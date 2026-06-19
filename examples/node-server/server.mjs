// Node server that STREAMS the rendered HTML with the native wesc bundler.
//
//   npm run build:native    # from the repo root, generates packages/wesc/index.cjs
//   node examples/node-server/server.mjs
//   open http://localhost:3000
//
// Streaming matters for large documents: buildStream emits the HTML chunk by
// chunk straight to the response, so the server never holds the whole page in
// memory and the browser starts rendering before the build finishes.
//
// What about JS and CSS? They're never part of the HTML stream. wesc always
// strips component <script>/<style> out of the markup and bundles them
// separately, so the streamed HTML stays lean no matter how big the page is.
// We build those bundles ONCE (they're identical for every request), cache
// them in memory, and serve them from their own routes. The source document
// references them — the <link> in <head> lets the browser fetch the CSS in
// parallel while the body is still streaming.

import { mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build, buildStream } from '../../packages/wesc/index.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '../../crates/wesc/tests/fixtures/todo-app');
const entry = join(srcDir, 'index.html');

// Build artifacts (.wesc/ working dir, scripts.js, styles.css) go in ./dist.
// wesc always creates its .wesc/ mirror relative to the cwd, so we run from
// dist; the entry point is an absolute path, so the source tree stays untouched.
const distDir = resolve(__dirname, 'dist');
mkdirSync(distDir, { recursive: true });
process.chdir(distDir);

// Build once up front purely to produce the JS/CSS bundles, then cache them.
// wesc returns the bundles in memory (result.js / result.css); we still pass
// outjs/outcss so they're written to ./dist too. Serve them straight from the
// build result — no need to read the files back.
const { js, css } = build({
  input: [entry],
  outjs: 'scripts.js',
  outcss: 'styles.css',
});

const server = createServer((req, res) => {
  if (req.url === '/scripts.js') {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    return res.end(js);
  }
  if (req.url === '/styles.css') {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    return res.end(css);
  }

  // Stream the HTML. No outjs/outcss here: we only want the (lean) markup, and
  // Node uses chunked transfer encoding automatically when we write without a
  // Content-Length. Scales to arbitrarily large documents.
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  buildStream({ input: [entry] }, (chunk) => {
    if (chunk === null) res.end();
    else if (!res.writableEnded) res.write(chunk);
  });
});

server.listen(3000, () => {
  console.log(`bundles cached — js ${js.length} B, css ${css.length} B`);
  console.log('streaming TodoMVC on http://localhost:3000');
});
