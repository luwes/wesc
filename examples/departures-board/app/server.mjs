// Streaming a ~10,000-row departures board: wesc-stamped components, expanded
// once into a single LiquidJS template, streamed as a web `ReadableStream`.
// Needs Node >= 18 for global `ReadableStream`/`Response` and `Readable.fromWeb`.
//
//   npm run build:native
//   npm install --prefix examples/departures-board
//   node examples/departures-board/app/server.mjs
//   open http://localhost:3000
//
// `board.mjs` returns a standard web `Response`, so the same code runs on a
// Cloudflare Worker / Deno / Bun / Next.js handler:
//
//   export default { fetch: () => boardResponse({ rowCount: 10_000 }) };
//
// Here we serve it on Node's http server by adapting the web stream back into a
// Node stream with `Readable.fromWeb`.

import { createServer } from 'node:http';
import { Readable } from 'node:stream';

import { assets, boardResponse } from './board.mjs';

const config = {
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT) || 3000,
  rowCount: Number(process.env.ROWS) || 10_000,
  pageSize: Number(process.env.ROW_BATCH_SIZE) || 64,
};

const server = createServer((req, res) => {
  if (req.url === '/styles.css') {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.end(assets.css);
    return;
  }

  if (req.url === '/scripts.js') {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.end(assets.js);
    return;
  }

  if (req.url !== '/') {
    res.statusCode = 404;
    res.end();
    return;
  }

  const response = boardResponse({ rowCount: config.rowCount, pageSize: config.pageSize });
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  Readable.fromWeb(response.body).pipe(res);
});

server.listen(config.port, config.host, () => {
  const localUrl =
    config.host === '127.0.0.1' ? `localhost:${config.port}` : `${config.host}:${config.port}`;

  console.log(`page template cached - ${Buffer.byteLength(assets.page).toLocaleString()} B`);
  console.log(`bundles cached - js ${assets.js.length} B, css ${assets.css.length} B`);
  console.log(`streaming departures (Web stream) on http://${localUrl}`);
});
