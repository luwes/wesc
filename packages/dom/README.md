# @wesc/dom — DOM SSR

`@wesc/dom/server` renders custom elements on the server via
[Linkedom](https://github.com/WebReflection/linkedom). Use it when a
component's shadow DOM is built by JavaScript (typically inside
`connectedCallback`) rather than declared in a `<template>` — the
common case for third-party web-component libraries.

It's the DOM-SSR half of [WeSC](https://github.com/luwes/wesc); the
ahead-of-time / streaming bundler lives in the
[`wesc`](../wesc) package.

Status: pre-1.0 (`0.5.x`), APIs may change. MIT-licensed. Node-only,
requires Node ≥ 18.

## Install

```sh
npm install @wesc/dom
```

## Entry points

| Import                  | Use                                                          |
| ----------------------- | ----------------------------------------------------------- |
| `@wesc/dom/server`      | `renderToDom`, `renderToString`, `renderToStream`, `shim`.  |
| `@wesc/dom/unshim`      | Restore the global scope after shimming.                    |
| `@wesc/dom/react`       | `WeSC` component + `prerender` for React/Next.js.           |
| `@wesc/dom/astro`       | Astro integration (`addRenderer`).                          |

## Standalone Node script

**index.js**

```js
import { promises as fs } from 'fs';
import { renderToString } from '@wesc/dom/server';

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

## Examples

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

## Develop

```sh
npm install           # from the monorepo root
npm test  --workspace=@wesc/dom
npm run build --workspace=@wesc/dom   # bundles src/ into dist/ with esbuild
```

## Related

- [Linkedom](https://github.com/WebReflection/linkedom) — DOM
  implementation powering the SSR path.
- [Ocean](https://github.com/matthewp/ocean) — web-component
  server-side rendering.
- [WCC](https://github.com/ProjectEvergreen/wcc) — experimental native
  web components compiler.
- [custom-elements-ssr](https://github.com/thepassle/custom-elements-ssr/) — server-rendering for Lit elements.
