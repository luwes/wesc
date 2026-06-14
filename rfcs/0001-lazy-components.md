# RFC 0001: Lazy components & code splitting

| Field    | Value         |
| -------- | ------------- |
| Status   | Draft         |
| Created  | 2026-06-13    |
| Tracking | [#45](https://github.com/luwes/wesc/issues/45) |

## Summary

Let a consumer load a component lazily: instead of inlining it, wesc emits a
self-describing placeholder and ships the component's shadow-DOM fragment and JS
as a separate bundle the client fetches on demand — the "islands" pattern,
expressed through Declarative Shadow DOM (DSD) + slots.

## Motivation

wesc strips client JS unless asked for it, but today a used component is always
inlined: its shadow template and upgrade script ship with the first paint. For
below-the-fold or interactive widgets that's wasted HTML and JS. Lazy components
let a consumer defer a component (and its subtree) so the main document carries
only a placeholder, and the heavy parts load on a trigger (visible / idle /
interaction). DSD makes this natural: the shadow root is per-definition and
shippable as a file, while the slotted light DOM stays in the page.

## Guide-level explanation

Laziness is a **consumer decision**, like static vs. dynamic `import()`. The
component file stays mode-agnostic; the consumer opts in on the
`<link rel="definition">` — wesc's import statement:

```html
<link rel="definition" name="w-card" href="./card.html" w-lazy>   <!-- lazy -->
<link rel="definition" name="w-hero" href="./hero.html">          <!-- eager -->
```

- `w-lazy` matches the `w-*` convention (`w-trim`). Optional strategy value:
  `w-lazy="visible"` (default) / `"idle"` / `"interaction"` / `"eager"`.
- **The user writes only intent.** wesc generates all runtime *mechanism* — the
  `data-w-*` attributes below — on every placeholder. The user never hand-writes
  them. Optional per-instance `<w-card w-lazy>` sugar defers a single instance's
  HTML shell.
- **Shadow DOM required for the slotted case.** Runtime `<slot>` projection is
  shadow-DOM-only, so DSD is what lets the shell load separately while slotted
  light DOM stays in the page. Slotless light-DOM components also work
  (placeholder + `innerHTML`); slotted light-DOM components are warned + inlined
  for now.

The emitted placeholder (wesc-generated):

```html
<w-card data-w-html="/a/card.html" data-w-js="/a/card.js"
        data-w-client="visible" data-w-ssr>
  <h3 slot="title">Title</h3>
  <!--w:end-->
</w-card>
```

## Reference-level explanation

Today `build()` (single `output_handler`) resolves a dep graph from
`<link rel="definition">` edges, then runs `extract_css` /
`extract_and_bundle_js` on background threads while streaming expanded HTML. The
feature reuses these seams.

**Lazy is a dep-graph edge, not a node.** A component can be eager from one
consumer and lazy from another (across builds). Read the flag from the consuming
file: extend `find_component_definitions`' `IndexMap<name, href>` and record it
on the edge in `resolve_component_dependencies`. The fragment/chunk is generated
when an edge is lazy. **Within a single document, eager wins**: if any edge to a
tag is eager, inline all its instances — otherwise the per-document registry
would `define()` the class and upgrade "lazy" instances before their shadow
roots attach.

**Placeholder (main stream).** For a lazy DSD component, `build_component` skips
the inline `<template shadowrootmode>`, keeps `write_shadow_light_dom` /
`finish_component`, and stamps the `data-w-*` attributes. This is **new**
build-time behavior — today wesc only strips `slot` or omits a `w-trim` tag, it
never adds attributes (`write_start_tag_with_optional_slot_attribute` gains an
inject path).

**HTML fragments (background, per definition).** New `extract_lazy_fragments`
runs a sub-build rooted at the component's `<template>` (reusing `build_file`'s
`entry_is_component` path), writing a fragment that mirrors the component path
(cf. `mirror_script_path`) and keeps its extension. Nested lazy components
become nested placeholders. The fragment is wrapped as
`<template shadowrootmode="open">…</template>` so the loader's `setHTMLUnsafe`
attaches it (and nested DSD) recursively.

**JS splitting.** Move the JS extractor to multiple named rolldown entries +
`dir` output: the main entry imports eager-edge components; one entry per
lazily-imported component imports its script. Rolldown's shared-chunk extraction
handles "consumed both ways" automatically. Keep the single-`file` path when
nothing is lazy.

**Asset URLs.** rolldown 1.0.3 takes separate filename templates, so lazy
*entries* get stable names (`entry_filenames: "[name].js"`) while shared chunks
hash (`chunk_filenames: "[name]-[hash].js"`). The URL the HTML references is then
predictable at stream time, with cache-busting still on the shared chunks those
entries import. So `data-w-*` inlines into the HTML even for hashed builds — no
runtime manifest. A JSON `manifest` stays an optional build artifact (preload
hints / asset pipelines), built from the asset list `bundler.write()` returns.

**CSS mostly takes care of itself.** A DSD component's shadow `<style>` lives
inside its `<template>`, so it already travels in the fragment. Only the tiny
top-level host `<style>` is separate, and that belongs in the main stylesheet
(it lets the placeholder reserve layout → avoids CLS). No CSS chunk to split.

**Client loader.** One generic behavior reads `data-w-*` — no manifest, no
framework renderer, no prop revival (props are attributes + light DOM):

```js
async function activate(el) {
  // top-down: wait for an un-activated parent island first
  const parent = el.parentElement?.closest('[data-w-ssr]');
  if (parent) return parent.addEventListener('w:activate', () => activate(el), { once: true });

  if (el.dataset.wHtml) attachFragment(el, await fetch(el.dataset.wHtml).then(r => r.text()));
  if (el.dataset.wJs) await import(el.dataset.wJs); // defines element; light DOM slots itself
  el.removeAttribute('data-w-ssr');
  el.dispatchEvent(new CustomEvent('w:activate', { bubbles: true }));
}
```

`attachFragment` uses `el.setHTMLUnsafe(text)` (the only string API that parses
DSD; Baseline since Sept 2025), else a ~15-line fallback that walks
`template[shadowrootmode]` and `attachShadow`s recursively. Streaming-safe
upgrade: a placeholder may upgrade before its light-DOM children arrive, so wait
for the `<!--w:end-->` marker (via `MutationObserver`, fallback
`DOMContentLoaded`) before scheduling. Per-strategy code (idle/visible/…) is
itself code-split.

**New options** (must land in every binding — see `AGENTS.md`):

- `outdir` — directory for fragments + JS chunks.
- `manifest` — optional build-artifact manifest path.
- `public_path` — URL prefix for the `data-w-*` asset references.

## Drawbacks

- New build-time attribute injection and a multi-entry rolldown path add
  complexity to the asset pipeline.
- Activation costs extra HTTP requests (fragment + chunk) — a latency/bytes
  trade vs. inlining.
- Per-document "eager wins" limits granularity: a tag used eagerly anywhere on a
  page can't be lazy on that page.
- `setHTMLUnsafe` is only Baseline 2025; older (but DSD-capable) browsers need
  the fallback.

## Rationale and alternatives

- **Consumer-side marker vs. component-side.** RSC separates *whether* code
  ships (`"use client"`, a module fact wesc reads from "does it have a
  `<script>`?") from *when* it loads (`React.lazy`, a consumer choice). Putting
  `w-lazy` on the `<link>` matches the per-document custom-element registry and
  keeps components reusable both ways.
- **Inline `data-w-*` vs. runtime manifest.** Self-describing placeholders
  (Astro's model) need no manifest fetch and stay streaming-safe; stable entry
  filenames remove the only reason a runtime map was needed.
- **Edge-not-node** is what enables "consumable both ways" to fall out of
  rolldown's shared chunks rather than bespoke dedup.

## Prior art

- **Astro islands** — `<astro-island>` inlines per-instance refs as HTML
  attributes; streaming-safe `await-children`; per-strategy directive modules;
  top-down hydration. wesc drops its renderer + prop serialization (DSD is
  native).
- **React Server Components** — server/client boundary, the `React.lazy` vs.
  `"use client"` two-axes split, and out-of-order streaming (see Future
  possibilities). wesc avoids RSC's serializable-props boundary (slots, not
  props).
- **webpack / `React.lazy`** — bakes the chunk map into the JS runtime; wesc
  instead keeps URLs predictable via stable entry names.

## Unresolved questions

- **Slotted light-DOM (non-shadow) lazy components** — warned + inlined for now;
  per-usage fragments are a possible later path.
- Empirical: rolldown shared-chunk behavior across the multi-entry setup, and
  `<!--w:end-->` upgrade timing under streaming.

## Future possibilities

- **Streamed islands (`w-lazy="stream"`)** — an RSC/Suspense-style mode: emit a
  fallback, then flush the real fragment later in the *same response* and swap it
  in by boundary id. Defers *rendering*, not *loading*; reuses the placeholder +
  `setHTMLUnsafe` machinery but needs a host API to flush mid-response. Distinct
  enough to warrant **its own follow-up RFC** once the core lands.
- Preload/`modulepreload` hints emitted from the optional manifest.
- Additional strategies (`media`, custom triggers).
