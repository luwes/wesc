# python-server

A streaming HTTP server that renders web components with the native `wesc`
bundler from Python. It mirrors [`examples/node-server`](../node-server): the
JS/CSS bundles are built once and cached, and the HTML is streamed chunk by
chunk (chunked transfer encoding) so the browser starts rendering before the
build finishes.

## Run it

Just run it — no setup:

```sh
python3 examples/python-server/server.py
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

The **first** run creates a local `.venv`, builds the native `wesc` module into
it with maturin (this needs the [Rust toolchain](https://rustup.rs); ~30s), and
re-launches itself with that interpreter. Later runs start in about a second.
The only prerequisites are Python 3.8+ and Rust.

## Notes

- The bootstrap lives in [`bootstrap.py`](./bootstrap.py) (`ensure_wesc()`):
  `server.py` calls it before importing `wesc`. It creates
  `examples/python-server/.venv`, runs `maturin develop`, then re-launches the
  script. Delete that `.venv` to force a clean rebuild.
- Re-run `maturin develop` (or just delete `.venv`) after changing the Rust
  binding code in [`crates/wesc-py`](../../crates/wesc-py); the bootstrap only
  rebuilds when `wesc` isn't importable, not when the source changes.
- Prefer to manage it yourself? Create a venv, `pip install maturin`, run
  `maturin develop -m crates/wesc-py/Cargo.toml`, then `python
  examples/python-server/server.py` — the bootstrap becomes a no-op once `wesc`
  imports.
- Editor shows `Import "wesc" could not be resolved`? The repo's
  [`pyrightconfig.json`](../../pyrightconfig.json) adds the in-repo type stubs
  (`crates/wesc-py/python`) to the path, so Pyright/Pylance resolve `import wesc`
  even before you build. If your editor still can't find it, point it at the
  virtualenv where you ran `maturin develop`.

## What it does

- Renders the [`todo-app` fixture](../../crates/wesc/tests/fixtures/todo-app),
  whose `index.html` already links `/styles.css` and `/scripts.js`.
- Builds once with `outjs`/`outcss` to produce the JS/CSS bundles into a local
  `dist/` folder (alongside wesc's `.wesc/` working dir), then caches them in
  memory and serves them from their own routes.
- For every page request, streams the (lean) HTML with `wesc.build_stream` — each
  `bytes` chunk goes straight to the socket, then `None` ends the stream.

The server is threaded so it can serve `/scripts.js` and `/styles.css` in
parallel while a page is still streaming — a browser keeps the HTML connection
open for reuse, and a single-threaded server would block every other connection
behind it. The bundler keeps a process-global cache, so a lock serializes the
builds; the cached assets are served without it.
