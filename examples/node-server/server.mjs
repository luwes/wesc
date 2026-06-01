// Node server that STREAMS the rendered HTML with the native wesc bundler.
//
//   npm run build:native    # from the repo root, generates ../../index.cjs
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

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { build, buildStream } from '../../index.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '../../crates/wesc/tests/fixtures/todo-app');

// Work in a throwaway copy — wesc writes .wesc/ and per-component .js next to
// the entry, and we don't want to touch the source tree.
const workDir = mkdtempSync(join(tmpdir(), 'wesc-todo-'));
cpSync(srcDir, workDir, { recursive: true });
process.chdir(workDir);

// Reference the bundles from the source so the tags flow through the HTML
// stream at the right positions (CSS in <head>, JS before </body>).
const indexPath = join(workDir, 'index.html');
writeFileSync(
  indexPath,
  readFileSync(indexPath, 'utf8')
    .replace('</head>', '  <link rel="stylesheet" href="/styles.css">\n  </head>')
    .replace('</body>', '  <script type="module" src="/scripts.js"></script>\n  </body>')
);

// Build once up front purely to produce the JS/CSS bundles, then cache them.
const bundleOpts = { entryPoints: ['index.html'], outjs: 'scripts.js', outcss: 'styles.css' };
build(bundleOpts);
const js = readFileSync(join(workDir, 'scripts.js'));
const css = readFileSync(join(workDir, 'styles.css'));

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
  buildStream({ entryPoints: ['index.html'] }, (chunk) => {
    if (chunk === null) res.end();
    else if (!res.writableEnded) res.write(chunk);
  });
});

server.listen(3000, () => {
  console.log(`bundles cached — js ${js.length} B, css ${css.length} B`);
  console.log('streaming TodoMVC on http://localhost:3000');
});
