# WeSC

We are the Superlative Components!

### Goals

- HTML first ([The Rule of Least Power](https://www.w3.org/2001/tag/doc/leastPower.html))
- Stay close to web standards
- Define and create a superlative component authoring experience
- Server language agnostic

## Custom element server-side rendering

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
- [Sveltekit](https://wesc-coe.pages.dev/) ([source](./examples/sveltekit))
- Node ([source](./examples/node))


### Simple Node usage

```bash
npm install wesc
```

#### index.js

```js
import { promises as fs } from 'fs';
import { renderToString } from 'wesc/server';

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
