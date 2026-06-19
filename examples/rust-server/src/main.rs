// Rust server that STREAMS the rendered HTML with the core wesc crate.
//
//     ./examples/rust-server/run.sh    # first run builds wesc (needs Rust)
//     open http://localhost:3000
//
// `run.sh` builds and launches this server. Unlike the other server examples,
// which call wesc through a language binding, the Rust example depends on the
// `wesc` core crate directly and calls `wesc::build`. Streaming matters for
// large documents: `build` emits the HTML chunk by chunk straight to the
// socket, so the server never holds the whole page in memory and the browser
// starts rendering before the build finishes.
//
// What about JS and CSS? They're never part of the HTML stream. wesc always
// strips component <script>/<style> out of the markup and bundles them
// separately, so the streamed HTML stays lean no matter how big the page is. We
// build those bundles ONCE (they're identical for every request), cache them in
// memory, and serve them from their own routes. The source document references
// them — the <link> in <head> lets the browser fetch the CSS in parallel while
// the body is still streaming.
//
// The server spawns a thread per connection, so it can serve /scripts.js and
// /styles.css while a page is still streaming. The per-request HTML builds are
// concurrency-safe — wesc's caches are thread-local and an HTML-only build
// writes nothing to disk — so they run in parallel with no lock.

use std::fs;
use std::io::{self, BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::path::PathBuf;
use std::sync::Arc;
use std::thread;

use wesc::{build, BuildOptions};

fn main() -> io::Result<()> {
    // Locate the repo relative to this crate, so the server works no matter
    // which directory it's launched from.
    let example_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let repo_root = example_dir.join("..").join("..");
    let entry = repo_root
        .join("crates")
        .join("wesc")
        .join("tests")
        .join("fixtures")
        .join("todo-app")
        .join("index.html");
    let entry = entry.to_string_lossy().into_owned();

    // Build artifacts (.wesc/ working dir, scripts.js, styles.css) go in ./dist.
    // We point wesc's `cwd` at dist so its .wesc/ mirror and the bundles land
    // there; the entry point is an absolute path, so the source tree stays
    // untouched. Using `cwd` instead of changing the process directory keeps the
    // multi-threaded server free of process-global state.
    let dist_dir = example_dir.join("dist");
    fs::create_dir_all(&dist_dir)?;
    let dist = dist_dir.to_string_lossy().into_owned();

    // Build once up front purely to produce the JS/CSS bundles, then cache them.
    build(
        BuildOptions {
            input: vec![entry.clone()],
            source: None,
            outcss: Some("styles.css".to_string()),
            outjs: Some("scripts.js".to_string()),
            cwd: Some(dist.clone()),
            minify: false,
        },
        &mut |_chunk: &[u8]| {
            // Discard the HTML from this warm-up build; we only want the bundles.
        },
    );
    let js = Arc::new(fs::read(dist_dir.join("scripts.js"))?);
    let css = Arc::new(fs::read(dist_dir.join("styles.css"))?);

    let listener = TcpListener::bind("127.0.0.1:3000")?;
    println!("bundles cached — js {} B, css {} B", js.len(), css.len());
    println!("streaming TodoMVC on http://localhost:3000");

    // Shared, immutable state handed to each connection thread.
    let entry = Arc::new(entry);
    let dist = Arc::new(dist);

    for stream in listener.incoming() {
        let stream = match stream {
            Ok(stream) => stream,
            Err(err) => {
                eprintln!("accept error: {err}");
                continue;
            }
        };
        let (js, css, entry, dist) = (js.clone(), css.clone(), entry.clone(), dist.clone());
        thread::spawn(move || {
            if let Err(err) = handle(stream, &js, &css, &entry, &dist) {
                // A dropped client connection lands here too — just log it.
                eprintln!("connection error: {err}");
            }
        });
    }
    Ok(())
}

/// Handle one connection: route on the request path, then serve a cached bundle
/// or stream the freshly built HTML.
fn handle(stream: TcpStream, js: &[u8], css: &[u8], entry: &str, dist: &str) -> io::Result<()> {
    let mut reader = BufReader::new(stream.try_clone()?);
    let mut request_line = String::new();
    if reader.read_line(&mut request_line)? == 0 {
        return Ok(()); // client closed before sending anything
    }
    // Drain the rest of the request headers; we don't need them.
    let mut header = String::new();
    loop {
        header.clear();
        if reader.read_line(&mut header)? == 0 || header == "\r\n" || header == "\n" {
            break;
        }
    }

    // Request line looks like: GET /path HTTP/1.1
    let path = request_line.split_whitespace().nth(1).unwrap_or("/");
    let mut stream = stream;

    match path {
        "/scripts.js" => serve_static(&mut stream, js, "text/javascript; charset=utf-8"),
        "/styles.css" => serve_static(&mut stream, css, "text/css; charset=utf-8"),
        "/" => stream_html(&mut stream, entry, dist),
        _ => {
            let body = b"Not Found";
            write!(
                stream,
                "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                body.len()
            )?;
            stream.write_all(body)
        }
    }
}

/// Send a fixed, in-memory body with a known length.
fn serve_static(stream: &mut TcpStream, body: &[u8], content_type: &str) -> io::Result<()> {
    write!(
        stream,
        "HTTP/1.1 200 OK\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    )?;
    stream.write_all(body)
}

/// Stream the (lean) HTML for one request with chunked transfer encoding. No
/// outcss/outjs here: we only want the markup. We emit each wesc chunk as an
/// HTTP chunk and flush it, so the browser starts rendering before the build
/// finishes.
///
/// No lock: HTML-only builds keep wesc's caches thread-local and write nothing
/// to disk, so concurrent requests can't interfere.
fn stream_html(stream: &mut TcpStream, entry: &str, dist: &str) -> io::Result<()> {
    write!(
        stream,
        "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n\r\n"
    )?;

    // `build`'s handler returns `()`, so we capture the first write error here
    // and stop writing once the client has gone away.
    let mut write_err: Option<io::Error> = None;
    build(
        BuildOptions {
            input: vec![entry.to_string()],
            source: None,
            outcss: None,
            outjs: None,
            cwd: Some(dist.to_string()),
            minify: false,
        },
        &mut |chunk: &[u8]| {
            if chunk.is_empty() || write_err.is_some() {
                return;
            }
            if let Err(err) = write_chunk(stream, chunk) {
                write_err = Some(err);
            }
        },
    );

    if let Some(err) = write_err {
        return Err(err);
    }

    // Terminating zero-length chunk ends the response.
    stream.write_all(b"0\r\n\r\n")?;
    stream.flush()
}

/// Write a single HTTP chunk (`<hex len>\r\n<bytes>\r\n`) and flush it.
fn write_chunk(stream: &mut TcpStream, chunk: &[u8]) -> io::Result<()> {
    write!(stream, "{:x}\r\n", chunk.len())?;
    stream.write_all(chunk)?;
    stream.write_all(b"\r\n")?;
    stream.flush()
}
