# rust-server

A streaming HTTP server that renders web components with the `wesc` bundler from
Rust. It mirrors [`examples/go-server`](../go-server),
[`examples/php-server`](../php-server),
[`examples/python-server`](../python-server),
[`examples/node-server`](../node-server), and
[`examples/ruby-server`](../ruby-server): the JS/CSS bundles are built once and
cached, and the HTML is streamed chunk by chunk (chunked transfer encoding) so
the browser starts rendering before the build finishes.

Unlike the other examples, which call wesc through a language binding, the Rust
example depends on the [`wesc`](../../crates/wesc) core crate directly and calls
`wesc::build`.

## Run it

```sh
./examples/rust-server/run.sh
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

`run.sh` builds and launches the server (`cargo run -p rust-server --release`,
~30s the first time). The only prerequisite is the
[Rust toolchain](https://rustup.rs).

## Notes

- Prefer to run it yourself? It's a normal workspace crate:

  ```sh
  cargo run -p rust-server --release
  ```

- Re-run after changing the core crate in
  [`crates/wesc`](../../crates/wesc) — `cargo` rebuilds it automatically.

## What it does

- Renders the [`todo-app` fixture](../../crates/wesc/tests/fixtures/todo-app),
  whose `index.html` already links `/styles.css` and `/scripts.js`.
- Builds once with `outjs`/`outcss` to produce the JS/CSS bundles into a local
  `dist/` folder (alongside wesc's `.wesc/` working dir), then caches them in
  memory and serves them from their own routes.
- For every page request, streams the (lean) HTML with `wesc::build` — each
  chunk is written as an HTTP chunk and flushed immediately.

The server spawns a thread per connection, so it can serve `/scripts.js` and
`/styles.css` in parallel while a page is still streaming. The per-request HTML
builds are concurrency-safe — wesc's caches are thread-local and an HTML-only
build writes nothing to disk — so they run in parallel with no lock.
