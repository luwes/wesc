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
- [x] JS bundling (via [rolldown](https://rolldown.rs))
- [x] TypeScript components (`<script lang="ts">`)
- [x] Optional minification

## CLI

The expanded HTML is streamed to **stdout**. Bundled CSS and JS are only
produced when you ask for them with `--outcss` / `--outjs`, and are
written to those files (not stdout).

```sh
# HTML only, to stdout
wesc ./index.html > out.html

# HTML to stdout, plus bundled CSS and JS to files
wesc ./index.html --outcss ./out.css --outjs ./out.js

# Minified assets
wesc ./index.html --outjs ./out.js --minify

# Run from a specific working directory
wesc index.html --cwd ./site --outjs ./site/out.js
```

```
Usage: wesc [OPTIONS] <PATH>

Arguments:
  <PATH>  The path to the entry point file

Options:
  -o, --outcss <OUTCSS>  The output CSS file
  -j, --outjs <OUTJS>    The output JS file
      --cwd <CWD>        Working directory (like rolldown's cwd)
  -m, --minify           Minify generated assets where supported
  -h, --help             Print help
```

## Options

The CLI flags map one-to-one to the library's
[`BuildOptions`](#library-usage) fields:

| CLI flag             | `BuildOptions` field          | Type             | Description                                                                                                                                   |
| -------------------- | ----------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `<PATH>` (positional)| `entry_points: Vec<String>`   | path(s)          | The entry HTML file. The first entry is the host document that is expanded and streamed out. Required.                                        |
| `-o`, `--outcss`     | `outcss: Option<String>`      | path             | Write the bundled CSS (every component's top-level `<style>`, concatenated) to this file. Omit to skip CSS bundling.                          |
| `-j`, `--outjs`      | `outjs: Option<String>`       | path             | Write the bundled JS (every component's top-level `<script>`, bundled with rolldown) to this file. Omit to skip JS bundling.                  |
| `--cwd`              | `cwd: Option<String>`         | dir              | Working directory, like rolldown's `cwd`. Defaults to the process working directory. See [Working directory](#working-directory).             |
| `-m`, `--minify`     | `minify: bool`                | flag             | Minify the generated JS/CSS where supported. Defaults to `false`.                                                                             |

### Working directory

`--cwd` (the `cwd` option) controls the directory the build runs from,
mirroring [rolldown](https://rolldown.rs)'s `cwd`:

- Relative `entry_points`, `outcss`, and `outjs` paths resolve against
  it (absolute paths are used as-is).
- The `.wesc` scratch directory is created under it (see
  [The `.wesc` scratch directory](#the-wesc-scratch-directory)).
- It is passed through to rolldown, so module ids in the JS bundle stay
  relative to it.

It defaults to the process working directory, so by default `wesc`
behaves like any other CLI tool — paths are relative to where you run
it. Point it elsewhere (e.g. a project root, or a writable build dir
when the source tree is read-only) when you need to.

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

## CSS & JS output

CSS and JS are emitted as side outputs, independently of the streamed
HTML, and only when the matching output path is set:

- **CSS** (`--outcss`): each component definition's top-level `<style>`
  is concatenated into the output file (each unique component once).
- **JS** (`--outjs`): each component definition's top-level `<script>`
  is bundled with [rolldown](https://rolldown.rs) into the output file
  (ES module format). Components register themselves in dependency
  order — a child custom element is defined before the parent that uses
  it.

### TypeScript

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

### The `.wesc` scratch directory

When JS bundling is requested, each component's `<script>` is written to
a mirror file under a `.wesc/scripts` scratch tree (laid out to match
the component's path relative to the [`cwd`](#working-directory)), and a
generated entry imports them for rolldown. The tree is rebuilt on every
build, so stale scripts from removed components never linger.

`.wesc` is build scratch — add it to your `.gitignore`. HTML-only builds
(no `--outjs`) never create it.

## Library usage

```rust
use wesc::{build, BuildOptions};

let options = BuildOptions {
    entry_points: vec!["./index.html".to_string()],
    outcss: Some("./out.css".to_string()),
    outjs: Some("./out.js".to_string()),
    cwd: None, // defaults to the process working directory
    minify: false,
};

// The expanded HTML is delivered to the handler in streaming chunks.
build(options, &mut |chunk: &[u8]| {
    // write the chunk to a file, an HTTP response, stdout, ...
    print!("{}", String::from_utf8_lossy(chunk));
});
```

Each call starts from empty, thread-local caches, so independent builds
can run concurrently on different threads without an external lock.

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
