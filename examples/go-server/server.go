// Go server that STREAMS the rendered HTML with the native wesc bindings.
//
//	./examples/go-server/run.sh    # first run builds wesc (needs Rust + a C toolchain)
//	open http://localhost:3000
//
// `run.sh` builds the `wesc-go` native library and launches this server with it
// linked. Streaming matters for large documents: BuildStream emits the HTML
// chunk by chunk straight to the socket, so the server never holds the whole
// page in memory and the browser starts rendering before the build finishes.
//
// What about JS and CSS? They're never part of the HTML stream. wesc always
// strips component <script>/<style> out of the markup and bundles them
// separately, so the streamed HTML stays lean no matter how big the page is. We
// build those bundles ONCE (they're identical for every request), cache them in
// memory, and serve them from their own routes. The source document references
// them — the <link> in <head> lets the browser fetch the CSS in parallel while
// the body is still streaming.
//
// The server is concurrent (net/http), so it can serve /scripts.js and
// /styles.css while a page is still streaming. The bundler keeps a
// process-global cache and isn't concurrency-safe, so a mutex serializes the
// builds; the cached assets are served without it.
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"sync"

	wesc "github.com/luwes/wesc/crates/wesc-go"
)

func main() {
	// Locate the repo relative to this source file, so the server works no
	// matter which directory it's launched from.
	_, thisFile, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("could not locate server source file")
	}
	exampleDir := filepath.Dir(thisFile)
	repoRoot := filepath.Join(exampleDir, "..", "..")
	entry := filepath.Join(repoRoot, "crates", "wesc", "tests", "fixtures", "todo-app", "index.html")

	// Build artifacts (.wesc/ working dir, scripts.js, styles.css) go in ./dist.
	// wesc always creates its .wesc/ mirror relative to the cwd, so we run from
	// dist; the entry point is an absolute path, so the source tree stays
	// untouched.
	distDir := filepath.Join(exampleDir, "dist")
	if err := os.MkdirAll(distDir, 0o777); err != nil {
		log.Fatalf("mkdir dist: %v", err)
	}
	if err := os.Chdir(distDir); err != nil {
		log.Fatalf("chdir dist: %v", err)
	}

	// Build once up front purely to produce the JS/CSS bundles, then cache them.
	if _, err := wesc.Build(wesc.Options{
		EntryPoints: []string{entry},
		OutCSS:      "styles.css",
		OutJS:       "scripts.js",
	}); err != nil {
		log.Fatalf("initial build: %v", err)
	}
	js, err := os.ReadFile(filepath.Join(distDir, "scripts.js"))
	if err != nil {
		log.Fatalf("read scripts.js: %v", err)
	}
	css, err := os.ReadFile(filepath.Join(distDir, "styles.css"))
	if err != nil {
		log.Fatalf("read styles.css: %v", err)
	}

	// The bundler isn't concurrency-safe (process-global cache), so serialize
	// the per-request HTML builds with this lock.
	var buildMu sync.Mutex

	mux := http.NewServeMux()
	mux.HandleFunc("/scripts.js", serveStatic(js, "text/javascript; charset=utf-8"))
	mux.HandleFunc("/styles.css", serveStatic(css, "text/css; charset=utf-8"))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		streamHTML(w, entry, &buildMu)
	})

	log.Printf("bundles cached — js %d B, css %d B", len(js), len(css))
	log.Println("streaming TodoMVC on http://localhost:3000")
	if err := http.ListenAndServe(":3000", mux); err != nil {
		log.Fatalf("server: %v", err)
	}
}

// serveStatic returns a handler that sends a fixed, in-memory body.
func serveStatic(body []byte, contentType string) http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", contentType)
		_, _ = w.Write(body)
	}
}

// streamHTML streams the (lean) HTML for one request. No OutCSS/OutJS here: we
// only want the markup. net/http uses chunked transfer encoding automatically
// when we write without a Content-Length and flush after each chunk.
func streamHTML(w http.ResponseWriter, entry string, buildMu *sync.Mutex) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	flusher, _ := w.(http.Flusher)

	buildMu.Lock()
	defer buildMu.Unlock()

	err := wesc.BuildStream(wesc.Options{EntryPoints: []string{entry}}, func(chunk []byte) error {
		if len(chunk) == 0 {
			return nil
		}
		if _, err := w.Write(chunk); err != nil {
			return err
		}
		if flusher != nil {
			flusher.Flush()
		}
		return nil
	})
	if err != nil {
		// Headers may already be on the wire, so we can't change the status —
		// just log it. A dropped client connection lands here too.
		log.Printf("stream error: %v", err)
	}
}
