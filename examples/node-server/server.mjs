// Minimal Node server that renders the TodoMVC app with the native wesc bundler.
//
//   npm run build:native    # from the repo root, generates ../../index.cjs
//   node examples/node-server/server.mjs
//   open http://localhost:3000
//
// The todo-app fixture uses wesc's JS + CSS bundling: components are compiled
// into a single HTML document, while their `<script>`/`<style>` contents are
// bundled out to `scripts.js` / `styles.css`. wesc writes those assets to disk
// but leaves the HTML free of references, so the server serves the bundles and
// wires them into the page.

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { readFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { buildAsync } from '../../index.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '../../crates/wesc/tests/fixtures/todo-app');

// wesc's JS bundling writes intermediate files (.wesc/, per-component .js) next
// to the entry, so build inside a throwaway copy to keep the source tree clean.
const workDir = mkdtempSync(join(tmpdir(), 'wesc-todo-'));
cpSync(srcDir, workDir, { recursive: true });
process.chdir(workDir);

// Build once at startup: render the document and bundle the components' JS/CSS.
// (A real server could rebuild per request — buildAsync keeps it off the event loop.)
let html = (
  await buildAsync({
    entryPoints: ['index.html'],
    outjs: 'scripts.js',
    outcss: 'styles.css',
  })
).toString();
const js = readFileSync(join(workDir, 'scripts.js'));
const css = readFileSync(join(workDir, 'styles.css'));

// Wire the bundled assets into the page so it's styled and interactive.
html = html
  .replace('</head>', '    <link rel="stylesheet" href="/styles.css">\n  </head>')
  .replace('</body>', '    <script type="module" src="/scripts.js"></script>\n  </body>');

const server = createServer((req, res) => {
  switch (req.url) {
    case '/scripts.js':
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      return res.end(js);
    case '/styles.css':
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      return res.end(css);
    default:
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(html);
  }
});

server.listen(3000, () => {
  console.log(
    `TodoMVC built with wesc — html ${html.length} B, js ${js.length} B, css ${css.length} B`
  );
  console.log('listening on http://localhost:3000');
});
