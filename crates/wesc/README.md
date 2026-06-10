# wesc

Streaming HTML/web-component bundler. Compiles single-file `.html`
components into Declarative-Shadow-DOM-ready output using
[lol-html](https://github.com/cloudflare/lol-html) — fast, low-memory,
chunk-by-chunk, with no runtime dependency on the host language.

This crate is the Rust core. For the Node bindings, examples, and the
broader project, see [github.com/luwes/wesc](https://github.com/luwes/wesc).

## Features

- [x] Streaming HTML bundler
- [x] Web component definition (`<link rel="definition">`)
- [x] Default and named slots with fallback content
- [x] Declarative Shadow DOM
- [x] CSS bundling
- [x] JS bundling

## CLI

```sh
wesc ./index.html > out.html
```

## Syntax

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

The root `<template shadowrootmode="open">` is emitted as Declarative
Shadow DOM. Drop the attribute (`<template>`) and the content is
inlined into light DOM instead — slots still work, there's just no
shadow root.

The top-level `<style>` and `<script>` (outside the template) provide
host styles and the upgrade script for the element, and are collected
into the bundled CSS / JS outputs.

Add `lang="ts"` (or `lang="tsx"`) to a script to author it in
TypeScript — rolldown transpiles it (types are stripped, not
type-checked). Components may import each other with `.js` specifiers
even when the imported component is TypeScript:

```html
<script type="module" lang="ts">
  import './child.js'; // resolves to the child's `.ts` script

  class WCard extends HTMLElement {
    connectedCallback(): void {
      console.log('w-card connected');
    }
  }
  customElements.define('w-card', WCard);
</script>
```

## Benchmarks

The bundler ships with two performance harnesses:

```sh
cargo bench -p wesc                                    # detailed measurement (criterion)
cargo test  -p wesc --release --test perf_guard -- --nocapture   # regression guard
```

- `benches/bundler.rs` measures time and throughput across a few
  representative fixtures (a no-op passthrough, the multi-component
  todo app, a full `blog` site with 100 posts, and a ~750 KB
  real-world page).
- `tests/perf_guard.rs` is the CI guard: it asserts each scenario
  stays under a wall-clock budget so new features can't silently slow
  the bundler down. It only enforces in release builds; in debug it
  just prints timings. Tune with `WESC_PERF_SCALE` (budget multiplier
  for slower hardware) or disable failures with `WESC_PERF_GUARD=0`.

## License

MIT
