# wesc-node

The Rust `cdylib` crate that exposes [`wesc`](../wesc)'s bundler to Node.js via
[napi-rs](https://napi.rs). It is **not** published on its own — it is compiled
into the `wesc` npm package's native binary.

The build is driven from the `wesc` package
(`napi build --cargo-cwd ../../crates/wesc-node`, run in
[`packages/wesc`](../../packages/wesc)), which produces `index.cjs`,
`index.d.ts`, and the per-platform `wesc.<triple>.node`. See the
[`packages/wesc` README](../../packages/wesc/README.md) for usage and
its `package.json` for the build/publish scripts.

## Exports

- `build(options)` — synchronous, returns a `BuildResult` `{ html, css, js }`.
- `buildAsync(options)` — runs off the JS thread, returns `Promise<BuildResult>`.
- `buildStream(options, callback)` — streams the HTML to `callback` chunk by
  chunk, then `null` at the end (still writes `outcss`/`outjs` to disk).

The one-shot builds return the expanded HTML as `result.html` (a `Buffer`) plus
the bundled `result.css`/`result.js` whenever `outcss`/`outjs` were requested,
so you can serve the bundles from memory. A real path also writes the bundle to
disk; an empty string (`outcss: ''`) bundles in-memory only.
