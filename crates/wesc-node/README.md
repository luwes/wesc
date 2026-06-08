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

- `build(options)` — synchronous, returns a `Buffer`.
- `buildAsync(options)` — runs off the JS thread, returns `Promise<Buffer>`.
- `buildStream(options, callback)` — streams each chunk to `callback`, then `null` at the end.
