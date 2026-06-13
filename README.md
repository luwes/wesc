# WeSC — We are the Superlative Components

Build web components from any backend.

WeSC is a streaming HTML/web-component bundler written in Rust (via
[lol-html](https://github.com/cloudflare/lol-html) for HTML and
[rolldown](https://rolldown.rs) for the JS bundle). It compiles single-file
`.html` components into Declarative-Shadow-DOM-ready output.

## Goals

- **HTML first** — lean on the platform ([The Rule of Least Power](https://www.w3.org/2001/tag/doc/leastPower.html)).
- **Standards-aligned** — Declarative Shadow DOM, slots, and `<template>`, not a custom dialect.
- **Single-file components** — author markup, styles, and script in one `.html` file.
- **Backend-agnostic** — a standalone CLI, plus native bindings (more welcome):
  - **Node** via [napi-rs](https://napi.rs)
  - **Python** via [PyO3](https://pyo3.rs)
  - **PHP** via [ext-php-rs](https://ext-php.rs)
  - **Go** via [cgo](https://pkg.go.dev/cmd/cgo)
  - **Ruby** via [Magnus](https://github.com/matsadler/magnus)

## What WeSC is

WeSC is an HTML component bundler. It lets developers author web
components as single-file components (SFCs), then compiles those
components into final HTML plus optional CSS and JS bundles.

WeSC is not meant to replace full-featured template engines. It does
not try to own variables, conditionals, loops, layouts, partials, or
application data flow. Use [Liquid](https://shopify.github.io/liquid/),
[Handlebars](https://handlebarsjs.com), [Nunjucks](https://mozilla.github.io/nunjucks/),
[Jinja](https://jinja.palletsprojects.com), [Twig](https://twig.symfony.com),
[ERB](https://docs.ruby-lang.org/en/master/ERB.html),
[Mustache](https://mustache.github.io), your backend framework, or plain string
output for that layer. WeSC sits
beside them: it turns component definitions into reusable HTML
building blocks that can be stamped by whatever renders your data.

## Repository layout

| Path                                           | What                                                       |
| ---------------------------------------------- | ---------------------------------------------------------- |
| [`packages/wesc`](./packages/wesc)             | The `wesc` npm package: CLI + Node bindings for the bundler. |
| [`packages/dom`](./packages/dom)               | The `@wesc/dom` npm package: DOM SSR via Linkedom.          |
| [`crates/wesc`](./crates/wesc)                 | The Rust bundler core (lol-html).                          |
| [`crates/wesc-node`](./crates/wesc-node)       | napi-rs Node bindings.                                     |
| [`crates/wesc-py`](./crates/wesc-py)           | PyO3 Python bindings.                                      |
| [`crates/wesc-php`](./crates/wesc-php)         | ext-php-rs PHP bindings.                                   |
| [`crates/wesc-go`](./crates/wesc-go)           | cgo Go bindings (C ABI).                                   |
| [`crates/wesc-rb`](./crates/wesc-rb)           | Magnus (rb-sys) Ruby bindings.                             |
| [`examples`](./examples)                       | Bundler examples (departures-board, node-server, python-server, php-server, go-server, ruby-server, rust-server). |

## Develop

This is an npm-workspaces monorepo. From the repo root:

```sh
npm install                 # installs every workspace
npm test                    # runs each package's tests
npm run lint                # lints each package
npm run build               # builds each package (esbuild for @wesc/dom)
npm run build:native        # builds the native Node bundler addon (Rust toolchain)
npm run build:php           # builds the native PHP extension (Rust + PHP headers + libclang)
```

The Go and Ruby bindings build with their own toolchains (`cargo build -p
wesc-go --release`; `bundle exec rake compile` in `crates/wesc-rb`); see each
crate's README.

## Related

**Built on**

- [lol-html](https://github.com/cloudflare/lol-html) — streaming HTML
  rewriter powering the bundler.
- [rolldown](https://rolldown.rs) — Rust bundler for the component JavaScript.
- [napi-rs](https://napi.rs) — Rust ↔ Node bindings.
- [PyO3](https://pyo3.rs) — Rust ↔ Python bindings.
- [ext-php-rs](https://ext-php.rs) — Rust ↔ PHP bindings.
- [cgo](https://pkg.go.dev/cmd/cgo) — Rust ↔ Go bindings (over a small C ABI).
- [Magnus](https://github.com/matsadler/magnus) — Rust ↔ Ruby bindings (on
  [rb-sys](https://github.com/oxidize-rb/rb-sys)).

**Related projects**

- [WebC](https://github.com/11ty/webc) — single-file web-component
  format from the 11ty team.
