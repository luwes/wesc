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
[`BuildOptions`](#library-usage) fields. Setting `outcss`/`outjs` both
writes the bundle to that file **and** returns it in-memory in the
[`Assets`](#library-usage) value the library's `build` returns:

| CLI flag             | `BuildOptions` field          | Type             | Description                                                                                                                                   |
| -------------------- | ----------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `<PATH>` (positional)| `input: Vec<String>`          | path(s)          | The entry HTML file. The first entry is the host document that is expanded and streamed out. Required.                                        |
| _(library only)_     | `source: Option<HashMap<String, Vec<u8>>>` | in-memory files | In-memory inputs, as a `path -> contents` map. When set, reads resolve against it first (paths matched ignoring `.`/`..`), falling back to disk for any path it doesn't hold. Supply just the entry to build a template-engine string; supply the components too to build without touching disk (e.g. on wasm). No CLI flag.  |
| `-o`, `--outcss`     | `outcss: Option<String>`      | path             | Bundle every component's top-level `<style>` (concatenated), write it to this file, and return it as `Assets.css`. Omit to skip CSS bundling; pass an empty string to bundle in-memory only (no file write). |
| `-j`, `--outjs`      | `outjs: Option<String>`       | path             | Bundle every component's top-level `<script>` (with rolldown), write it to this file, and return it as `Assets.js`. Omit to skip JS bundling; pass an empty string to bundle in-memory only (no file write). |
| `--cwd`              | `cwd: Option<String>`         | dir              | Working directory, like rolldown's `cwd`. Defaults to the process working directory. See [Working directory](#working-directory).             |
| `-m`, `--minify`     | `minify: bool`                | flag             | Minify the generated JS/CSS where supported. Defaults to `false`.                                                                             |

### Working directory

`--cwd` (the `cwd` option) controls the directory the build runs from,
mirroring [rolldown](https://rolldown.rs)'s `cwd`:

- Relative `input`, `outcss`, and `outjs` paths resolve against it
  (absolute paths are used as-is).
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

CSS and JS are bundled independently of the streamed HTML, only when an
output path is set. Each bundle is written to its file **and** returned
in the [`Assets`](#library-usage) value:

- **CSS** (`outcss`): each component definition's top-level `<style>` is
  concatenated (each unique component once), written to `outcss`, and
  returned as `Assets.css`. An empty `outcss` (`Some("")`) bundles
  in-memory only — no file is written. CSS bundling needs no rolldown,
  so it also runs on wasm targets.
- **JS** (`outjs`): each component definition's top-level `<script>` is
  bundled with [rolldown](https://rolldown.rs) into an ES module,
  written to `outjs`, and returned as `Assets.js`. An empty `outjs`
  bundles in-memory only. Components register themselves in dependency
  order — a child custom element is defined before the parent that uses
  it. JS bundling is native-only; requesting it on a wasm target panics.

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

`.wesc` is build scratch — add it to your `.gitignore`. Builds without
JS bundling (no `outjs`) never create it.

## Library usage

```rust
use wesc::{build, BuildOptions};

let options = BuildOptions {
    input: vec!["./index.html".to_string()],
    source: None, // or Some(map of path -> contents) for in-memory inputs
    outcss: Some("./dist/styles.css".to_string()), // bundle + write CSS
    outjs: Some("./dist/scripts.js".to_string()),  // bundle + write JS
    cwd: None, // defaults to the process working directory
    minify: false,
};

// The expanded HTML is delivered to the handler in streaming chunks; the
// bundled CSS/JS are written to outcss/outjs and also returned in `Assets`.
let assets = build(options, &mut |chunk: &[u8]| {
    // write the chunk to a file, an HTTP response, stdout, ...
    print!("{}", String::from_utf8_lossy(chunk));
});

if let Some(css) = assets.css {
    // the bundled CSS, in-memory (also already written to outcss above)
    let _ = css;
}
```

Each call starts from empty, thread-local caches, so independent builds
can run concurrently on different threads without an external lock.

### Bundling the CSS without the HTML

There is no separate CSS entry point: set `outcss` and read `Assets.css`
from the result, ignoring the streamed HTML. Use an empty string
(`Some("")`) to bundle in-memory only — no file is written, so this also
works on targets without a filesystem (e.g. wasm). CSS bundling needs no
rolldown; pair it with the `source` option to bundle CSS for inputs held
in memory.

```rust
use wesc::{build, BuildOptions};

let assets = build(
    BuildOptions {
        input: vec!["./index.html".to_string()],
        outcss: Some(String::new()), // bundle CSS in memory; don't write a file
        ..Default::default()
    },
    &mut |_chunk: &[u8]| {}, // ignore the HTML
);
let css = assets.css.unwrap_or_default();
```

### Building from memory

For a build that never touches the filesystem — a template-engine string, or a
WebAssembly worker with no disk — pass a `source` map from each input path to
its contents. Reads for any path not in the map still fall back to disk, so you
can mix in-memory and on-disk inputs:

```rust
use std::collections::HashMap;
use wesc::{build, BuildOptions};

let source = HashMap::from([
    (
        "/site/pages/index.html".to_string(),
        b"<link rel=\"definition\" name=\"w-card\" href=\"../components/card.html\">\
          <w-card>Hi</w-card>"
            .to_vec(),
    ),
    (
        "/site/components/card.html".to_string(),
        b"<template><slot></slot></template>".to_vec(),
    ),
]);

let mut html = Vec::new();
build(
    BuildOptions {
        input: vec!["/site/pages/index.html".to_string()],
        source: Some(source),
        ..Default::default()
    },
    &mut |chunk: &[u8]| html.extend_from_slice(chunk),
);
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
