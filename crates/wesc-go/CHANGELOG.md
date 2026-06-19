# Changelog

## [0.7.0](https://github.com/luwes/wesc/compare/wesc-go-v0.6.2...wesc-go-v0.7.0) (2026-06-19)


### ⚠ BREAKING CHANGES

* **bindings:** the one-shot build functions no longer return the raw HTML bytes/string; use the result html field and read css/js for the bundled assets. The Go wesc_build C ABI gained two WescBuffer out-parameters.
* **core:** BuildOptions gains a `code` field, so every BuildOptions literal must set it (bindings/examples updated to `code: None`); and build_with_source / build_in_memory / Assets / chunk_reader::MemorySource are removed in favor of `build`, `build_css`, and the `code` option.
* the `entry_points` build option is now `input` everywhere: Rust/Python/PHP/Ruby `input`, Node/JS `input`, Go `Options.Input`, and the C ABI `input`/`input_len` parameters.

### Features

* add a cwd build option and root the JS scratch tree under it ([c66f14f](https://github.com/luwes/wesc/commit/c66f14ffe449605b45b17ba28b5d26746baa8750))
* **bindings:** return the bundled CSS/JS assets from every binding ([786e88a](https://github.com/luwes/wesc/commit/786e88a11e7e0920d25d4e4f2f2e78166bbe35fd))


### Code Refactoring

* **core:** unify the build API around build + build_css + a code option ([1654859](https://github.com/luwes/wesc/commit/1654859ccf9a2f085ecb386494cea807f8d129bb))
* rename entry_points option to input ([25538d8](https://github.com/luwes/wesc/commit/25538d88298436517939eca556e166af6e2f2066))

## [0.6.2](https://github.com/luwes/wesc/compare/wesc-go-v0.6.1...wesc-go-v0.6.2) (2026-06-10)


### Miscellaneous Chores

* release 0.6.2 ([d841e84](https://github.com/luwes/wesc/commit/d841e84335e3e23957905ea7f3046616bf14c9ba))

## [0.6.1](https://github.com/luwes/wesc/compare/wesc-go-v0.6.0...wesc-go-v0.6.1) (2026-06-09)


### Miscellaneous Chores

* **wesc-go:** Synchronize wesc versions

## [0.6.0](https://github.com/luwes/wesc/compare/wesc-go-v0.5.0...wesc-go-v0.6.0) (2026-06-09)


### Miscellaneous Chores

* **wesc-go:** Synchronize wesc versions
