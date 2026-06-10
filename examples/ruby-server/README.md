# ruby-server

A streaming HTTP server that renders web components with the native `wesc`
bindings from Ruby. It mirrors [`examples/go-server`](../go-server),
[`examples/php-server`](../php-server),
[`examples/python-server`](../python-server), and
[`examples/node-server`](../node-server): the JS/CSS bundles are built once and
cached, and the HTML is streamed chunk by chunk (chunked transfer encoding) so
the browser starts rendering before the build finishes.

## Run it

```sh
./examples/ruby-server/run.sh
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

`run.sh` compiles the native `wesc` Ruby extension (`bundle exec rake compile`,
~30s the first time) and launches `server.rb` with the gem's `lib/` on the load
path. The prerequisites are:

- The [Rust toolchain](https://rustup.rs).
- Ruby 3.0+ with development headers (and Bundler).
- A C toolchain and `libclang` for bindgen (Xcode Command Line Tools on macOS;
  `build-essential` + `libclang-dev` on Linux).

## Notes

- Prefer to run it yourself? Compile the extension, then run the server:

  ```sh
  cd crates/wesc-rb && bundle install && bundle exec rake compile && cd -
  ruby -I crates/wesc-rb/lib examples/ruby-server/server.rb
  ```

- Re-run `run.sh` (or `bundle exec rake compile`) after changing the Rust
  binding code in [`crates/wesc-rb`](../../crates/wesc-rb).

## What it does

- Renders the [`todo-app` fixture](../../crates/wesc/tests/fixtures/todo-app),
  whose `index.html` already links `/styles.css` and `/scripts.js`.
- Builds once with `outjs:`/`outcss:` to produce the JS/CSS bundles into a local
  `dist/` folder (alongside wesc's `.wesc/` working dir), then caches them in
  memory and serves them from their own routes.
- For every page request, streams the (lean) HTML with `Wesc.build_stream` — each
  chunk is written into a pipe that WEBrick drains straight to the socket.

WEBrick is concurrent, so it can serve `/scripts.js` and `/styles.css` in
parallel while a page is still streaming. The per-request HTML builds are
concurrency-safe — wesc's caches are thread-local and an HTML-only build writes
nothing to disk — so they run in parallel with no lock.
