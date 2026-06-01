// Minimal Node server that renders web components with the native wesc bundler.
//
//   npm run build:native    # from the repo root, generates ../../index.cjs
//   node examples/node-server/server.mjs
//   curl http://localhost:3000/
//
// Uses streaming so the browser starts receiving HTML before the build
// finishes — wesc's whole point. `build` and `buildAsync` are shown too.

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { build, buildAsync, buildStream } from '../../index.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Any wesc entry document. Here we reuse a crate test fixture.
const entry = resolve(
  __dirname,
  '../../crates/wesc/tests/fixtures/default-slot/index.html'
);

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Streaming: pipe each chunk straight to the response, end on null.
  buildStream({ entryPoints: [entry] }, (chunk) => {
    if (chunk === null) res.end();
    else res.write(chunk);
  });
});

server.listen(3000, () => {
  // Show the buffered APIs work too, then announce readiness.
  const sync = build({ entryPoints: [entry] });
  console.log(`sync build(): ${sync.length} bytes`);

  buildAsync({ entryPoints: [entry] }).then((buf) => {
    console.log(`async buildAsync(): ${buf.length} bytes`);
    console.log('listening on http://localhost:3000');
  });
});
