# WeSC — We are the Superlative Components

Build web components from any backend.

WeSC is a streaming HTML/web-component bundler written in Rust (via
[lol-html](https://github.com/cloudflare/lol-html)). It compiles
single-file `.html` components into Declarative-Shadow-DOM-ready
output: a standalone CLI, plus sync / async / streaming Node bindings
(via [napi-rs](https://napi.rs)) and Python bindings (via
[PyO3](https://pyo3.rs)).

## Goals

- HTML first ([The Rule of Least Power](https://www.w3.org/2001/tag/doc/leastPower.html))
- Stay close to web standards (DSD, slots, `<template>`)
- A first-class authoring experience for single-file components
- Usable from any backend (standalone CLI; Node and Python bindings today, more welcome)

## What WeSC is

WeSC is an HTML component bundler. It lets developers author web
components as single-file components (SFCs), then compiles those
components into final HTML plus optional CSS and JS bundles.

WeSC is not meant to replace full-featured template engines. It does
not try to own variables, conditionals, loops, layouts, partials, or
application data flow. Use Handlebars, Nunjucks, Twig, React, your
backend framework, or plain string output for that layer. WeSC sits
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
| [`examples`](./examples)                       | Bundler examples (departures-board, node-server, python-server). |

## Develop

This is an npm-workspaces monorepo. From the repo root:

```sh
npm install                 # installs every workspace
npm test                    # runs each package's tests
npm run lint                # lints each package
npm run build               # builds each package (esbuild for @wesc/dom)
npm run build:native        # builds the native bundler addon (Rust toolchain)
```

## Related

**Built on**

- [lol-html](https://github.com/cloudflare/lol-html) — streaming HTML
  rewriter powering the bundler.
- [napi-rs](https://napi.rs) — Rust ↔ Node bindings.

**Related projects**

- [WebC](https://github.com/11ty/webc) — single-file web-component
  format from the 11ty team.
