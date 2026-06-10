# go-server

A streaming HTTP server that renders web components with the native `wesc`
bindings from Go. It mirrors [`examples/php-server`](../php-server),
[`examples/python-server`](../python-server), and
[`examples/node-server`](../node-server): the JS/CSS bundles are built once and
cached, and the HTML is streamed chunk by chunk (chunked transfer encoding) so
the browser starts rendering before the build finishes.

## Run it

```sh
./examples/go-server/run.sh
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

`run.sh` builds the native `wesc-go` library (`cargo build -p wesc-go --release`,
~30s the first time) and launches `server.go` with it linked (`go run .`). The
prerequisites are:

- The [Rust toolchain](https://rustup.rs).
- Go 1.21+.
- A C toolchain for cgo (Xcode Command Line Tools on macOS; GCC/Clang on Linux).

## Notes

- Prefer to run it yourself? Build the library, then run the server:

  ```sh
  cargo build -p wesc-go --release
  cd examples/go-server && go run .
  ```

  The cgo directives in [`crates/wesc-go`](../../crates/wesc-go) embed an rpath
  to `target/release`, so the binary finds the shared library at runtime without
  extra environment setup.

- Re-run `run.sh` (or `cargo build -p wesc-go --release`) after changing the Rust
  binding code in [`crates/wesc-go`](../../crates/wesc-go).

## What it does

- Renders the [`todo-app` fixture](../../crates/wesc/tests/fixtures/todo-app),
  whose `index.html` already links `/styles.css` and `/scripts.js`.
- Builds once with `OutJS`/`OutCSS` to produce the JS/CSS bundles into a local
  `dist/` folder (alongside wesc's `.wesc/` working dir), then caches them in
  memory and serves them from their own routes.
- For every page request, streams the (lean) HTML with `wesc.BuildStream` — each
  chunk goes straight to the socket and is flushed immediately.

The server is concurrent (`net/http`), so it can serve `/scripts.js` and
`/styles.css` in parallel while a page is still streaming. The per-request HTML
builds are concurrency-safe — wesc's caches are thread-local and an HTML-only
build writes nothing to disk — so they run in parallel with no lock.
