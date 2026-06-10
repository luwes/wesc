"""Python server that STREAMS the rendered HTML with the native wesc bundler.

    python examples/python-server/server.py   # first run builds wesc (needs Rust)
    open http://localhost:3000

No setup needed: on first run, bootstrap.py creates a local .venv, builds the
native `wesc` module into it with maturin, and re-launches this script with that
interpreter. Later runs start straight away.

Streaming matters for large documents: build_stream emits the HTML chunk by
chunk straight to the socket, so the server never holds the whole page in
memory and the browser starts rendering before the build finishes.

What about JS and CSS? They're never part of the HTML stream. wesc always
strips component <script>/<style> out of the markup and bundles them
separately, so the streamed HTML stays lean no matter how big the page is. We
build those bundles ONCE (they're identical for every request), cache them in
memory, and serve them from their own routes. The source document references
them — the <link> in <head> lets the browser fetch the CSS in parallel while
the body is still streaming.

The server is threaded so it can serve /scripts.js and /styles.css in parallel
while a page is still streaming (a browser keeps the HTML connection open for
reuse — a single-threaded server would block every other connection behind it).
The per-request HTML builds are concurrency-safe — wesc's caches are
thread-local and an HTML-only build writes nothing to disk — so they run in
parallel with no lock.
"""

import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from bootstrap import ensure_wesc

# Make sure `wesc` is importable (builds + re-launches on first run), then use it.
ensure_wesc()

import wesc  # noqa: E402

HERE = Path(__file__).resolve().parent
SRC_DIR = HERE.parents[1] / "crates" / "wesc" / "tests" / "fixtures" / "todo-app"
ENTRY = str(SRC_DIR / "index.html")

# Build artifacts (.wesc/ working dir, scripts.js, styles.css) go in ./dist.
# wesc always creates its .wesc/ mirror relative to the cwd, so we run from dist;
# the entry point is an absolute path, so the source tree stays untouched.
DIST_DIR = HERE / "dist"
DIST_DIR.mkdir(exist_ok=True)
os.chdir(DIST_DIR)

# Build once up front purely to produce the JS/CSS bundles, then cache them.
wesc.build([ENTRY], outjs="scripts.js", outcss="styles.css")
JS = (DIST_DIR / "scripts.js").read_bytes()
CSS = (DIST_DIR / "styles.css").read_bytes()


class Handler(BaseHTTPRequestHandler):
    # HTTP/1.1 so we can use chunked transfer encoding for the streamed HTML.
    protocol_version: str = "HTTP/1.1"

    def do_GET(self) -> None:
        if self.path == "/scripts.js":
            return self._send(JS, "text/javascript; charset=utf-8")
        if self.path == "/styles.css":
            return self._send(CSS, "text/css; charset=utf-8")

        # Stream the HTML. No outjs/outcss here: we only want the (lean) markup.
        # build_stream calls back with each chunk, then None at end-of-stream.
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Transfer-Encoding", "chunked")
        self.end_headers()

        def on_chunk(chunk: bytes | None) -> None:
            if chunk is None:
                self.wfile.write(b"0\r\n\r\n")  # terminating chunk
            elif chunk:  # skip empties: a 0-length chunk would end the body early
                self.wfile.write(f"{len(chunk):x}\r\n".encode())
                self.wfile.write(chunk)
                self.wfile.write(b"\r\n")

        # No lock: HTML-only builds keep wesc's caches thread-local and write
        # nothing to disk, so concurrent requests can't interfere.
        wesc.build_stream([ENTRY], on_chunk)

    def _send(self, body: bytes, content_type: str) -> None:
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:  # noqa: A002
        pass  # quiet


if __name__ == "__main__":
    print(f"bundles cached — js {len(JS)} B, css {len(CSS)} B")
    print("streaming TodoMVC on http://localhost:3000")
    try:
        ThreadingHTTPServer(("", 3000), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\nbye")
