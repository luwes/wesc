# Changelog

## [0.6.1](https://github.com/luwes/wesc/compare/wesc-core-v0.6.0...wesc-core-v0.6.1) (2026-06-09)


### Miscellaneous Chores

* **wesc-core:** Synchronize wesc versions

## [0.6.0](https://github.com/luwes/wesc/compare/wesc-core-v0.5.0...wesc-core-v0.6.0) (2026-06-09)


### Features

* add global CSS bundling ([#31](https://github.com/luwes/wesc/issues/31)) ([c263487](https://github.com/luwes/wesc/commit/c2634872858889e9d7accf1ef5b7e254b40b166e))
* add JS bundling and TodoMVC fixture ([8fb7ece](https://github.com/luwes/wesc/commit/8fb7ece89c80836583bfe9ba80e5670ac7cf59d3))
* add named (out of order) slot support ([6df488f](https://github.com/luwes/wesc/commit/6df488f7251eab84669a6ee1b8ed1cf5c07b61ad))
* add Rust WeSC HTML component bundler ([ea0319f](https://github.com/luwes/wesc/commit/ea0319f32b5f9e1860b34f8d25ae39147930e56d))
* support component entry & w-trim attribute ([#24](https://github.com/luwes/wesc/issues/24)) ([3faad1a](https://github.com/luwes/wesc/commit/3faad1a908c58344fec91620453043bf786e77b5))
* support template w/ shadowrootmode ([a9d29ba](https://github.com/luwes/wesc/commit/a9d29ba1654a367fe866e5f2e64439896063c57a))


### Bug Fixes

* add big real world & fix byte-&gt;str bottleneck ([5be783c](https://github.com/luwes/wesc/commit/5be783cd3129ae25a1eab9b9f824fad8cc4eb636))
* avoid utf8 panic in slotted text ([87a6909](https://github.com/luwes/wesc/commit/87a69092aa9a6492258d43cb4c8519184459e796))
* **bundler:** skip scriptless component definitions in JS entry ([2b4e33c](https://github.com/luwes/wesc/commit/2b4e33cc01cacd02e8a66a5d8c9152fd0063b941))
* doc test in lib.rs ([2c735ba](https://github.com/luwes/wesc/commit/2c735ba49b814b6d934977286b529f25bbcfb887))
* end early finding component defs ([1ee4535](https://github.com/luwes/wesc/commit/1ee453532a483d8834e56c49e1c40a18655ff925))
* nested template tag in component ([f8a79cb](https://github.com/luwes/wesc/commit/f8a79cbc1b9bd97921ade3498290138ad8a9debd))
* remove component definition links from build output ([380c259](https://github.com/luwes/wesc/commit/380c259110e6353eeae08209e5935dc4cf74b16f))
* slot attribute bug ([#25](https://github.com/luwes/wesc/issues/25)) ([58bb34b](https://github.com/luwes/wesc/commit/58bb34b6f4abb08a1388bc75c6dc9d3a8dc690c2))
* split up code ([fc11601](https://github.com/luwes/wesc/commit/fc116016ae79da3926a25269e3b7719c483ce3ee))
* upgrade lol_html ([b00360e](https://github.com/luwes/wesc/commit/b00360efa57fd325e63297214d6f8c69ffce59bf))
* use cargo workspaces ([c99b905](https://github.com/luwes/wesc/commit/c99b905b2f60ffae60861528ffecd0ee13140b32))
* **wesc:** deduplicate bundled CSS for components declared in multiple files ([4710d3e](https://github.com/luwes/wesc/commit/4710d3ec7ccf72a1a140d55820e83b52faf10fd6))
* **wesc:** pass through nested &lt;template&gt; elements in component bodies ([37fa95f](https://github.com/luwes/wesc/commit/37fa95f8809560184ac8200a595653f77e10ff26))
* **wesc:** preserve light DOM for shadow components and fix slot nesting ([1b2ba19](https://github.com/luwes/wesc/commit/1b2ba1995eac4be6eefe29e7384d49f2d3fc4a19))
* **wesc:** resolve JS bundler paths correctly for absolute entries ([53f7279](https://github.com/luwes/wesc/commit/53f72796d1d7d4aa0a489dd663e4cc273231fb4e))


### Performance Improvements

* avoid string work in tag scanner ([00b78ad](https://github.com/luwes/wesc/commit/00b78ad8c52f3c9cc58b6f8772992f69f126b7b8))
* cache source file reads ([4f4c79d](https://github.com/luwes/wesc/commit/4f4c79db3ed4425dc590e4874c8ab13168a3586e))
* fast-path component expansion ([dad65a8](https://github.com/luwes/wesc/commit/dad65a8adfc5556238c76d4b5a0c75c22e21296f))
* fast-scan slotted children ([e97670b](https://github.com/luwes/wesc/commit/e97670bf004054d88d5a355e4d6157d492626888))
* **wesc:** byte-scan component template and end-tag lookups ([e3ee04a](https://github.com/luwes/wesc/commit/e3ee04a870149446fee3da13ddb7e82191494ac5))
* **wesc:** use memchr for byte scanning ([67d0c33](https://github.com/luwes/wesc/commit/67d0c33e0c7081bd3a7af2c9792d6589135fad19))
