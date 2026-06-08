# node-server

A streaming HTTP server that renders web components with the native `wesc`
bundler from Node. The JS/CSS bundles are built once and cached, and the HTML is
streamed chunk by chunk so the browser starts rendering before the build
finishes.

## Run it

From the repo root:

```sh
# 1. Install dependencies
npm install

# 2. Build the native addon (generates packages/wesc/index.cjs + the .node binary)
npm run build:native

# 3. Run the example
node examples/node-server/server.mjs
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

## Notes

- `npm run build:native` (a root alias for `npm run build:native --workspace=wesc`)
  compiles the Rust core (the first build takes a while — rolldown is heavy) via
  napi-rs and writes `index.cjs`, `index.d.ts`, and the per-platform
  `wesc.<triple>.node` into [`packages/wesc`](../../packages/wesc), which
  `server.mjs` imports with `../../packages/wesc/index.cjs`.
- After the first build, re-running `node examples/node-server/server.mjs` is
  instant. You only need `npm run build:native` again if you change the Rust
  binding code in [`crates/wesc-node`](../../crates/wesc-node).
- Faster, unoptimized rebuilds while hacking on the binding:
  `npm run build:native:debug`.

## What it does

- Renders the [`todo-app` fixture](../../crates/wesc/tests/fixtures/todo-app),
  whose `index.html` already links `/styles.css` and `/scripts.js`.
- Builds once with `outjs`/`outcss` to produce the JS/CSS bundles into a local
  `dist/` folder (alongside wesc's `.wesc/` working dir), then caches them in
  memory and serves them from their own routes.
- For every page request, streams the (lean) HTML with `buildStream` — each
  `Buffer` chunk goes straight to the response, then `null` ends the stream.

See [`examples/python-server`](../python-server) for the same demo built on the
Python bindings.
