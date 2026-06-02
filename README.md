# WeSC — We are the Superlative Components

Build and server-render web components from any backend.

WeSC ships in one npm package with two complementary parts:

1. **Bundler** — a streaming HTML/web-component bundler written in Rust
   (via [lol-html](https://github.com/cloudflare/lol-html)). Compiles
   single-file `.html` components into Declarative-Shadow-DOM-ready
   output. Standalone CLI, plus sync / async / streaming Node bindings
   (via [napi-rs](https://napi.rs)).
2. **DOM SSR** — `wesc/dom/server` renders custom elements on the
   server using [Linkedom](https://github.com/WebReflection/linkedom),
   for components whose shadow DOM is produced by JS at upgrade time.

Status: pre-1.0 (`0.5.x`), APIs may change. MIT-licensed. The Node APIs
require Node ≥ 16; the standalone CLI binary has no runtime dependency.

### Which one do I want?

- **Bundler** — if your components are declarative: a `<template>`,
  some scoped CSS, an optional upgrade script. Builds ahead-of-time or
  streams per-request. Backend language agnostic.
- **DOM SSR** — if your components only build their shadow DOM by
  running JS (typical for third-party libraries like `media-chrome`).
  Node-only.

### Goals

- HTML first ([The Rule of Least Power](https://www.w3.org/2001/tag/doc/leastPower.html))
- Stay close to web standards (DSD, slots, `<template>`)
- A first-class authoring experience for single-file components
- Usable from any backend (standalone CLI; Node bindings today, more welcome)

### What WeSC is

WeSC is an HTML component bundler. It lets developers author web
components as single-file components (SFCs), then compiles those
components into final HTML plus optional CSS and JS bundles.

WeSC is not meant to replace full-featured template engines. It does
not try to own variables, conditionals, loops, layouts, partials, or
application data flow. Use Handlebars, Nunjucks, Twig, React, your
backend framework, or plain string output for that layer. WeSC sits
beside them: it turns component definitions into reusable HTML
building blocks that can be stamped by whatever renders your data.

---

## Bundler

Streaming HTML/web-component bundler. Builds the final HTML chunk by
chunk with low memory overhead, and has no runtime dependency on the
host language.

See the [crate README](./crates/wesc/README.md) for the Rust API.

### Why SFC?

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

### Features

- [x] Streaming HTML bundler
- [x] Web component definition
- [x] Default and named slots with fallback content
- [x] Declarative Shadow DOM
- [x] CSS bundling
- [x] JS bundling

### Syntax

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

`rel="definition"` is a WeSC-specific link relation. The bundler
resolves it at build time, expands every matching custom element, and
removes the link from the output.

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

Three things to notice in the component file:

- The root `<template shadowrootmode="open">` is emitted as
  Declarative Shadow DOM. Drop the attribute (`<template>`) and the
  same content is inlined into light DOM instead — slots still work,
  there's just no shadow root.
- Two `<style>` blocks, two scopes: the one inside the template is
  scoped shadow-DOM CSS; the top-level one provides host styles for
  `w-card` itself and gets collected into the bundled CSS.
- The top-level `<script>` is collected into the bundled JS the same
  way.

### CLI

```sh
wesc ./index.html > out.html
```

### Node

```sh
npm install wesc
```

Prebuilt binaries for macOS, Linux, and Windows ship as per-platform
`@wesc/binding-<triple>` packages and are selected automatically at
install time. The bundler runs in-process — no subprocess, no WASM.

```js
import { build, buildAsync, buildStream } from 'wesc';

const opts = { entryPoints: ['./index.html'], minify: true };

// Async — runs on libuv's thread pool, never blocks the event loop.
// Prefer this on a request-serving path.
const html = await buildAsync(opts);

// Streaming — low memory, chunk by chunk. The callback receives each
// chunk as a Buffer, then `null` once to signal end-of-stream.
buildStream(opts, (chunk) => {
  if (chunk === null) res.end();
  else res.write(chunk);
});

// Synchronous — for build scripts and one-shot CLI use. Blocks the
// calling thread; do not put this on a request hot path.
const buf = build(opts);
```

| Option        | Type       | Notes                                       |
| ------------- | ---------- | ------------------------------------------- |
| `entryPoints` | `string[]` | First entry is the host document.           |
| `outcss`      | `string?`  | Path to write the bundled CSS file.         |
| `outjs`       | `string?`  | Path to write the bundled JS file.          |
| `minify`      | `boolean?` | Minify generated assets. Defaults to false. |

It's also available as a one-shot CLI via `npx`:

```sh
npx wesc ./index.html > out.html
```

See [examples/departures-board](./examples/departures-board) for an
HTTP server that streams a 10,000-row flight board — every row is two
composed web components, so a single request expands to ~20k component
instances. HTML streamed chunk by chunk (TTFB ≈ 2 ms on the cold
request), with the bundled JS/CSS cached and served from their own
routes.

---

## DOM SSR

`wesc/dom/server` renders custom elements on the server via
[Linkedom](https://github.com/WebReflection/linkedom). Use it when a
component's shadow DOM is built by JavaScript (typically inside
`connectedCallback`) rather than declared in a `<template>` — the
common case for third-party web-component libraries.

### Examples

Open an [issue](https://github.com/luwes/wesc/issues/new) if your stack
isn't covered.

| Framework         | Demo                                                                                                          | Source                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Cloudflare Worker | [Demo](https://wesc.luwes.workers.dev/?url=https%3A%2F%2Fmedia-chrome.mux.dev%2Fexamples%2Fvanilla%2Fadvanced.html) | [Source](./examples/cloudflare-worker)  |
| Eleventy          | [Demo](https://wesc-eleventy.netlify.app/)                                                                    | [Source](./examples/eleventy)           |
| Astro             | [Demo](https://wesc-astro-luwes.vercel.app/)                                                                  | [Source](./examples/astro)              |
| Next.js           | [Demo](https://wesc-nextjs.vercel.app/)                                                                       | [Source](./examples/nextjs)             |
| SvelteKit         | [Demo](https://wesc-sveltekit.vercel.app/)                                                                    | [Source](./examples/sveltekit)          |
| Remix             | [Demo](https://wesc-remixrun.netlify.app/)                                                                    | [Source](./examples/remixrun)           |
| Node              | [Demo](https://wesc-node.netlify.app/)                                                                        | [Source](./examples/node)               |

### Standalone Node script

```sh
npm install wesc
```

**index.js**

```js
import { promises as fs } from 'fs';
import { renderToString } from 'wesc/dom/server';

// Web components register themselves on import.
import 'media-chrome';

const html = await fs.readFile('./app.html');
const out = await renderToString(html);

await fs.writeFile('./index.html', out);
```

**app.html** (trimmed)

```html
<media-controller>
  <video slot="media" playsinline src="https://stream.mux.com/.../high.mp4"></video>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-time-range></media-time-range>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

`renderToString` returns a string with the upgraded element trees
inlined as Declarative Shadow DOM. View source on the [Node example
demo](https://wesc-node.netlify.app/) to see full output.

---

## Related

**Built on**

- [Linkedom](https://github.com/WebReflection/linkedom) — DOM
  implementation powering the SSR path.
- [lol-html](https://github.com/cloudflare/lol-html) — streaming HTML
  rewriter powering the bundler.
- [napi-rs](https://napi.rs) — Rust ↔ Node bindings.

**Related projects**

- [Ocean](https://github.com/matthewp/ocean) — web-component
  server-side rendering.
- [WCC](https://github.com/ProjectEvergreen/wcc) — experimental native
  web components compiler.
- [custom-elements-ssr](https://github.com/thepassle/custom-elements-ssr/) — server-rendering for Lit elements.
- [WebC](https://github.com/11ty/webc) — single-file web-component
  format from the 11ty team.
