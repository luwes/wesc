# wesc — Bundler

Streaming HTML/web-component bundler. Compiles single-file `.html`
components into ready-to-serve HTML — both light DOM expansion and
Declarative Shadow DOM. Builds the final HTML chunk by chunk with low
memory overhead, and has no runtime dependency on the host language.

This package ships the standalone CLI plus the sync / async / streaming
Node bindings (via [napi-rs](https://napi.rs)). The Rust core lives in
[`crates/wesc`](../../crates/wesc); the DOM-SSR runtime is a separate
package, [`@wesc/dom`](../dom).

## Features

- **Streaming bundler** — expands components chunk-by-chunk with low memory.
- **Component definitions** — declare custom elements with `<link rel="definition">`.
- **Slots** — default and named slots with fallback content.
- **Light DOM** — inline `<template>` expansion, no shadow root.
- **Declarative Shadow DOM** — emit `<template shadowrootmode>` shadow roots.
- **CSS bundling** — collect each component's top-level `<style>`.
- **JS bundling** — bundle each component's top-level `<script>`.
- **TypeScript** — author components with `<script lang="ts">`.
- **Minification** — optional, where supported.

## Why SFC?

HTML components tend to have three things that belong together:
structure, host/shadow styles, and a small upgrade script. Keeping them
in one file makes the component easy to read, move, review, and bundle.

```html
<template shadowrootmode="open">
  <button part="button"><slot></slot></button>
</template>

<style>
  w-button {
    display: inline-block;
  }
</style>

<script>
  customElements.define('w-button', class extends HTMLElement {});
</script>
```

At build time, WeSC expands the component markup, collects the
top-level CSS into a CSS bundle, and collects the top-level JS into a
JS bundle. Your template engine can still render the data around or
inside those components.

## Syntax

Define a component with `rel="definition"`, then use it as a custom
element. The bundler resolves the link at build time, expands every
matching element, and removes the link from the output.

**index.html**

```html
<!doctype html>
<html>
  <head>
    <link rel="definition" name="w-card" href="./components/card.html">
  </head>
  <body>
    <w-card>
      <h3 slot="title">Title</h3>
      Description
    </w-card>
  </body>
</html>
```

**components/card.html**

```html
<template shadowrootmode="open">
  <style>
    @scope {
      h3 {
        color: red;
      }
    }
  </style>
  <div>
    <h3><slot name="title">Add a slotted title</slot></h3>
    <p><slot>Add default slotted content</slot></p>
  </div>
</template>

<style>
  w-card {
    display: block;
  }
</style>

<script>
  class WCard extends HTMLElement {
    connectedCallback() {
      console.log('w-card connected');
    }
  }
  customElements.define('w-card', WCard);
</script>
```

- **Shadow DOM:** `<template shadowrootmode="open">` is emitted as
  Declarative Shadow DOM.
- **Light DOM:** drop the attribute (`<template>`) and the same content
  is inlined into light DOM instead — slots still work, there's just no
  shadow root.
- Two `<style>` blocks, two scopes: the one inside the template is
  scoped shadow-DOM CSS; the top-level one provides host styles for
  `w-card` itself and gets collected into the bundled CSS.
- The top-level `<script>` is collected into the bundled JS the same
  way.

## CLI

```sh
wesc ./index.html > out.html
```

It's also available as a one-shot CLI via `npx`:

```sh
npx wesc ./index.html > out.html
```

## Node

```sh
npm install wesc
```

Prebuilt binaries for macOS, Linux, and Windows ship as per-platform
`@wesc/binding-<triple>` packages and are selected automatically at
install time. The bundler runs in-process — no subprocess, no WASM.

```js
import { build, buildAsync, buildStream } from 'wesc';

const opts = { input: ['./index.html'], outcss: 'styles.css', minify: true };

// Async — runs on libuv's thread pool, never blocks the event loop.
// Prefer this on a request-serving path. Resolves with the HTML output
// plus the bundled assets.
const { html, css, js } = await buildAsync(opts);

// Streaming — low memory, chunk by chunk. The callback receives each
// chunk as a Buffer, then `null` once to signal end-of-stream. (Streaming
// emits HTML only; outcss/outjs are still written to disk.)
buildStream(opts, (chunk) => {
  if (chunk === null) res.end();
  else res.write(chunk);
});

// Synchronous — for build scripts and one-shot CLI use. Blocks the
// calling thread; do not put this on a request hot path.
const result = build(opts);
result.html; // Buffer of the expanded HTML
result.css; // bundled CSS string (outcss was requested)
result.js; // bundled JS string (undefined here — no outjs)
```

The one-shot builds (`build`, `buildAsync`) return a `BuildResult`
`{ html, css, js }`. `css`/`js` are filled in whenever `outcss`/`outjs`
are set, so you can serve the bundles straight from memory. A real path
also writes the bundle to disk; pass an empty string (`outcss: ''`) to
bundle in-memory only without writing a file.

| Option        | Type       | Notes                                       |
| ------------- | ---------- | ------------------------------------------- |
| `input`       | `string[]` | First entry is the host document.           |
| `outcss`      | `string?`  | Path to write the bundled CSS file.         |
| `outjs`       | `string?`  | Path to write the bundled JS file.          |
| `minify`      | `boolean?` | Minify generated assets. Defaults to false. |

See [examples/departures-board](../../examples/departures-board) for an
HTTP server that streams a 10,000-row flight board — every row is two
composed web components, so a single request expands to ~20k component
instances. wesc expands the components once into a single LiquidJS
template, which is streamed chunk by chunk with
[`renderToNodeStream`](https://liquidjs.com/tutorials/streaming.html)
(TTFB ≈ 10 ms; the shell and early rows flush while the rest render),
with the bundled JS/CSS cached and served from their own routes.

There's also [examples/node-server](../../examples/node-server), a
minimal streaming HTTP server built directly on `buildStream`.

## Build (from source)

The native addon is built with napi-rs from the monorepo root:

```sh
npm run build:native          # release build of the per-platform .node binary
npm run build:native:debug    # faster, unoptimized rebuilds
```

This writes `index.cjs`, `index.d.ts`, and `wesc.<triple>.node` into
this package directory.
