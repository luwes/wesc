# php-server

A streaming HTTP server that renders web components with the native `wesc`
extension from PHP. It mirrors [`examples/python-server`](../python-server) and
[`examples/node-server`](../node-server): the JS/CSS bundles are built once and
cached, and the HTML is streamed chunk by chunk (chunked transfer encoding) so
the browser starts rendering before the build finishes.

## Run it

```sh
./examples/php-server/run.sh
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

`run.sh` builds the native `wesc` extension (`cargo build -p wesc-php --release`,
~30s the first time) and launches `server.php` with it loaded
(`php -d extension=…`). The prerequisites are:

- The [Rust toolchain](https://rustup.rs).
- PHP 8.1+ with development headers — `php-config` on your `PATH`.
- `libclang` (Xcode Command Line Tools on macOS; `libclang-dev` on Debian/Ubuntu).

## Notes

- Prefer to run it yourself? Build the extension and point PHP at the shared
  object:

  ```sh
  cargo build -p wesc-php --release
  php -d extension="$PWD/target/release/libwesc_php.so" \
      examples/php-server/server.php
  ```

  (On macOS the file is `libwesc_php.dylib`; on Windows it's `wesc_php.dll`.)

- Re-run `run.sh` after changing the Rust binding code in
  [`crates/wesc-php`](../../crates/wesc-php) — it rebuilds every time.
- Editor shows the `wesc_build` functions as undefined? Point your PHP language
  server at the in-repo stubs in
  [`crates/wesc-php/stubs/wesc.php`](../../crates/wesc-php/stubs/wesc.php).

## What it does

- Renders the [`todo-app` fixture](../../crates/wesc/tests/fixtures/todo-app),
  whose `index.html` already links `/styles.css` and `/scripts.js`.
- Builds once with `outjs`/`outcss` to produce the JS/CSS bundles into a local
  `dist/` folder (alongside wesc's `.wesc/` working dir), then caches them in
  memory and serves them from their own routes.
- For every page request, streams the (lean) HTML with `wesc_build_stream` —
  each string chunk goes straight to the socket, then `null` ends the stream.

The server uses a plain blocking accept loop, so it serves one connection at a
time. The bundler keeps a process-global cache, so that also conveniently
serializes the builds; the cached assets are served straight from memory.
