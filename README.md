# WeSC

We are the Superlative Components!

### Goals

- HTML first ([The Rule of Least Power](https://www.w3.org/2001/tag/doc/leastPower.html))
- Stay close to web standards
- Define and create a superlative component authoring experience
- Server language agnostic


## [WeSC Bundler](./crates/wesc/README.md)

A streaming web component bundler written in Rust using the [lol-html](https://github.com/cloudflare/lol-html) parser.

The idea is to create a single-file HTML component format and builder that builds 
the HTML result super fast (streaming, low memory) and is server language agnostic. 


### Features

- [x] Streaming HTML bundler
- [x] Web component definition
- [x] Default and named slots with fallback content
- [x] Declarative Shadow DOM
- [x] CSS bundling
- [ ] JS bundling


### Example

```sh
wesc ./index.html
```


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

**components/card.html**

```html
<template>
<!-- or <template shadowrootmode="open"> -->
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

<!-- TODO: bundle to a global scripts.js -->
<script>
  class WCard extends HTMLElement {
    connectedCallback() {
      console.log('w-card connected');
    }
  }
  customElements.define('w-card', WCard);
</script>
```


## WeSC DOM - Custom element server-side rendering

Custom elements are a crucial part of reaching these goals. 
The first problem WeSC is aiming to solve is rendering DSD 
([declarative shadow DOM](https://developer.chrome.com/en/articles/declarative-shadow-dom/))
in a simple and approachable way for most use cases.

### Examples

Have a look at the [examples](./examples) to see if your use case is handled and
feel free to open an [issue](https://github.com/luwes/wesc/issues/new) if not.

- [Cloudflare Worker](https://wesc.luwes.workers.dev/?url=https%3A%2F%2Fmedia-chrome.mux.dev%2Fexamples%2Fvanilla%2Fadvanced.html) ([source](./examples/cloudflare-worker))
- [Eleventy](https://wesc-eleventy.netlify.app/) ([source](./examples/eleventy))
- [Astro](https://wesc-astro-luwes.vercel.app/) ([source](./examples/astro))
- [Next.js](https://wesc-nextjs.vercel.app/) ([source](./examples/nextjs))
- [Sveltekit](https://wesc-sveltekit.vercel.app/) ([source](./examples/sveltekit))
- [Remix](https://wesc-remixrun.netlify.app/) ([source](./examples/remixrun))
- [Node](https://wesc-node.netlify.app/) ([source](./examples/node))


### Simple Node usage

```bash
npm install wesc
```

#### index.js

```js
import { promises as fs } from 'fs';
import { renderToString } from 'wesc/dom/server';

// Import web component library
import 'media-chrome';

// Process full page
let html = await fs.readFile('./app.html');

let out = await renderToString(html);

await fs.writeFile('./index.html', out);
```

#### app.html

```html
<!-- ... -->
<media-controller>
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
  <media-poster-image
    slot="poster"
    src="https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/thumbnail.jpg"
    placeholdersrc="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAUADADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAECBAP/xAAdEAEBAAEEAwAAAAAAAAAAAAAAARECAxITFCFR/8QAGQEAAwADAAAAAAAAAAAAAAAAAAEDAgQF/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAETERL/2gAMAwEAAhEDEQA/ANeC4ldyI1b2EtIzzrrIqYZLvl5FGkGdbfQzGPvo76WsPxXLlfqbaA5va2iVJADgPELACsD/2Q=="
  ></media-poster-image>
  <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-display></media-time-display>
    <media-time-range></media-time-range>
    <media-duration-display></media-duration-display>
    <media-playback-rate-button></media-playback-rate-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
<!-- ... -->
```

#### HTML output

view-source:https://wesc-node.netlify.app

## Related

- [Linkedom](https://github.com/WebReflection/linkedom) - This project is powered by Linkedom.
- [Ocean](https://github.com/matthewp/ocean) - Web component server-side rendering.
- [Web Components Compiler (WCC)](https://github.com/ProjectEvergreen/wcc) - Experimental native Web Components compiler.
- [custom-elements-ssr](https://github.com/thepassle/custom-elements-ssr/) - Renders Lit custom elements on the server.
- [WebC](https://github.com/11ty/webc)
