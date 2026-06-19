# [0.5.0](https://github.com/luwes/wesc/compare/v0.4.0...v0.5.0) (2026-06-01)


### Bug Fixes

* add big real world & fix byte->str bottleneck ([5be783c](https://github.com/luwes/wesc/commit/5be783cd3129ae25a1eab9b9f824fad8cc4eb636))
* avoid readonly globals in server shim ([7f23768](https://github.com/luwes/wesc/commit/7f2376852111296eceae8d2b9486b22f3650d293))
* doc test in lib.rs ([2c735ba](https://github.com/luwes/wesc/commit/2c735ba49b814b6d934977286b529f25bbcfb887))
* drop platform optionalDependencies from committed manifest ([e0e4dbd](https://github.com/luwes/wesc/commit/e0e4dbdc7b6ada9077e9c3d23b42c6cac7e1446c))
* end early finding component defs ([1ee4535](https://github.com/luwes/wesc/commit/1ee453532a483d8834e56c49e1c40a18655ff925))
* keep native compile out of the default `build` script ([4637f0e](https://github.com/luwes/wesc/commit/4637f0ef6d774c1e6c4391f6642e09f13348a7c4))
* nested template tag in component ([f8a79cb](https://github.com/luwes/wesc/commit/f8a79cbc1b9bd97921ade3498290138ad8a9debd))
* slot attribute bug ([#25](https://github.com/luwes/wesc/issues/25)) ([58bb34b](https://github.com/luwes/wesc/commit/58bb34b6f4abb08a1388bc75c6dc9d3a8dc690c2))
* split up code ([fc11601](https://github.com/luwes/wesc/commit/fc116016ae79da3926a25269e3b7719c483ce3ee))
* upgrade lol_html ([b00360e](https://github.com/luwes/wesc/commit/b00360efa57fd325e63297214d6f8c69ffce59bf))
* use cargo workspaces ([c99b905](https://github.com/luwes/wesc/commit/c99b905b2f60ffae60861528ffecd0ee13140b32))
* **wesc:** deduplicate bundled CSS for components declared in multiple files ([4710d3e](https://github.com/luwes/wesc/commit/4710d3ec7ccf72a1a140d55820e83b52faf10fd6))
* **wesc:** pass through nested <template> elements in component bodies ([37fa95f](https://github.com/luwes/wesc/commit/37fa95f8809560184ac8200a595653f77e10ff26))
* **wesc:** resolve JS bundler paths correctly for absolute entries ([53f7279](https://github.com/luwes/wesc/commit/53f72796d1d7d4aa0a489dd663e4cc273231fb4e))


### Features

* add global CSS bundling ([#31](https://github.com/luwes/wesc/issues/31)) ([c263487](https://github.com/luwes/wesc/commit/c2634872858889e9d7accf1ef5b7e254b40b166e))
* add JS bundling and TodoMVC fixture ([8fb7ece](https://github.com/luwes/wesc/commit/8fb7ece89c80836583bfe9ba80e5670ac7cf59d3))
* add named (out of order) slot support ([6df488f](https://github.com/luwes/wesc/commit/6df488f7251eab84669a6ee1b8ed1cf5c07b61ad))
* add Rust component (default slot) builder ([c8dfdfb](https://github.com/luwes/wesc/commit/c8dfdfbef652e87a69d765dd02477aed12b570bd))
* distribute the native Rust bundler on npm as `wesc` ([84ab232](https://github.com/luwes/wesc/commit/84ab232e7364419aba96bf3880a1c34f9ecf5f35))
* support component entry & w-trim attribute ([#24](https://github.com/luwes/wesc/issues/24)) ([3faad1a](https://github.com/luwes/wesc/commit/3faad1a908c58344fec91620453043bf786e77b5))
* support template w/ shadowrootmode ([a9d29ba](https://github.com/luwes/wesc/commit/a9d29ba1654a367fe866e5f2e64439896063c57a))


### Reverts

* Revert "docs(CHANGELOG): 0.6.0" ([9f14f2d](https://github.com/luwes/wesc/commit/9f14f2d1ad3242a97e10d55ab657d9e0ee5a4c4d))
* Revert "chore(release): 0.6.0" ([55ea2b2](https://github.com/luwes/wesc/commit/55ea2b2581d3c975e31916da3b8f6668b794afed))



# [0.4.0](https://github.com/luwes/wesc/compare/v0.3.3...v0.4.0) (2024-01-28)


### Bug Fixes

* upgrade deps ([eb68e8d](https://github.com/luwes/wesc/commit/eb68e8ded95b3b2072fe2980cbc068f48493236c))
* upgrade Linkedom to 0.15.6 ([93859dc](https://github.com/luwes/wesc/commit/93859dca095e652fc10cae51281d59487d90141f))


### Features

* move DOM SSR to wesc/dom submodule ([5e76fa0](https://github.com/luwes/wesc/commit/5e76fa09832bd7a6004fdedc8a3445f16a27f692))



## [0.7.0](https://github.com/luwes/wesc/compare/wesc-v0.6.2...wesc-v0.7.0) (2026-06-19)


### ⚠ BREAKING CHANGES

* **bindings:** the one-shot build functions no longer return the raw HTML bytes/string; use the result html field and read css/js for the bundled assets. The Go wesc_build C ABI gained two WescBuffer out-parameters.
* the `entry_points` build option is now `input` everywhere: Rust/Python/PHP/Ruby `input`, Node/JS `input`, Go `Options.Input`, and the C ABI `input`/`input_len` parameters.

### Features

* **bindings:** return the bundled CSS/JS assets from every binding ([786e88a](https://github.com/luwes/wesc/commit/786e88a11e7e0920d25d4e4f2f2e78166bbe35fd))


### Code Refactoring

* rename entry_points option to input ([25538d8](https://github.com/luwes/wesc/commit/25538d88298436517939eca556e166af6e2f2066))

## [0.6.2](https://github.com/luwes/wesc/compare/wesc-v0.6.1...wesc-v0.6.2) (2026-06-10)


### Miscellaneous Chores

* release 0.6.2 ([d841e84](https://github.com/luwes/wesc/commit/d841e84335e3e23957905ea7f3046616bf14c9ba))

## [0.6.1](https://github.com/luwes/wesc/compare/wesc-v0.6.0...wesc-v0.6.1) (2026-06-09)


### Miscellaneous Chores

* **wesc:** Synchronize wesc versions

## [0.6.0](https://github.com/luwes/wesc/compare/wesc-v0.5.0...wesc-v0.6.0) (2026-06-09)


### Miscellaneous Chores

* **wesc:** Synchronize wesc versions

## [0.3.3](https://github.com/luwes/wesc/compare/v0.3.2...v0.3.3) (2023-10-14)


### Bug Fixes

* add event methods to globalThis. closes [#4](https://github.com/luwes/wesc/issues/4) ([d174a6e](https://github.com/luwes/wesc/commit/d174a6e1427874f73e6a9a068a8c64305d7fda0a))
* move recursive renderChildren call after appendChild ([#3](https://github.com/luwes/wesc/issues/3)) ([5fe5aef](https://github.com/luwes/wesc/commit/5fe5aef3182cf42d57c7adf2f73c58eefc08ea1c))



## [0.3.2](https://github.com/luwes/wesc/compare/v0.3.1...v0.3.2) (2023-07-18)


### Bug Fixes

* React children render bug ([3fea989](https://github.com/luwes/wesc/commit/3fea9893b295e806f3c76e99c683ee0d79af25d6))



## [0.3.1](https://github.com/luwes/wesc/compare/v0.3.0...v0.3.1) (2023-07-18)


### Bug Fixes

* upgrade linkedom ([e351f34](https://github.com/luwes/wesc/commit/e351f343640ceb0501c8a8680e3eda1e0e97741e))
* use matchAll in renderToStream ([d7632ed](https://github.com/luwes/wesc/commit/d7632edca2c4c4f21d7ec2a436bf8c39c65c8df0))



# [0.3.0](https://github.com/luwes/wesc/compare/v0.2.0...v0.3.0) (2023-07-16)


### Bug Fixes

* improve React node resolver ([7005536](https://github.com/luwes/wesc/commit/7005536f93288b90aec10e74e1277018dbfb614d))
* pass options to renderToStream ([f0db21a](https://github.com/luwes/wesc/commit/f0db21a91b2389e5f3be97ed95043ae446cf2f6f))
* render race condition and mutation bug ([b3250ee](https://github.com/luwes/wesc/commit/b3250eed0aa414399db81d24f92e019cd0c45cc0))


### Features

* add renderToStream ([d427534](https://github.com/luwes/wesc/commit/d4275346778e4c41163f7022080b5d8392e66240))



# [0.2.0](https://github.com/luwes/wesc/compare/v0.1.0...v0.2.0) (2023-07-02)


### Bug Fixes

* package lock (updated Next.js settings) ([38b9d95](https://github.com/luwes/wesc/commit/38b9d959847aaa23c825f8b759d69ed8c73a1bc1))


### Features

* add Astro SSR renderer ([1010f13](https://github.com/luwes/wesc/commit/1010f1304fd97112a070a309e9dd73fee3337249))



# 0.1.0 (2023-07-01)


### Bug Fixes

* add web component SSR module ([be96b3c](https://github.com/luwes/wesc/commit/be96b3c904caec8f46d5b6204908fd756ab63fce))
* linkedom bug, add lint / WCC tests ([f1fddcc](https://github.com/luwes/wesc/commit/f1fddccfd2d221bb49166ce99e43667aebd01356))
* make React module lighter client side ([4f36f6e](https://github.com/luwes/wesc/commit/4f36f6eb97926a9095bffba081e78c02625aa686))


### Features

* add react module, add unshim ([fc4efee](https://github.com/luwes/wesc/commit/fc4efee9cc2f9cd7e2b033e4e0a93652052f6546))
