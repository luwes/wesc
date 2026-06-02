// Streaming a ~10,000-row departures board from Wesc-stamped Handlebars templates.
//
//   npm run build:native
//   npm install --prefix examples/departures-board
//   node examples/departures-board/server.mjs
//   open http://localhost:3000

import { createServer } from 'node:http';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDepartureGenerator } from './flight-data.mjs';
import { createBoardRenderer } from './renderer.mjs';

const srcDir = dirname(fileURLToPath(import.meta.url));
const config = {
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT) || 3000,
  rowCount: Number(process.env.ROWS) || 10_000,
  rowBatchSize: Number(process.env.ROW_BATCH_SIZE) || 128,
};

const board = createBoardRenderer({
  srcDir,
  rowCount: config.rowCount,
});

function writeMeasured(res, chunk, state) {
  if (res.destroyed) return false;

  if (!state.firstByteLogged) {
    const ttfb = Number(process.hrtime.bigint() - state.startedAt) / 1e6;
    console.log(`${state.url}  TTFB ${ttfb.toFixed(1)} ms`);
    state.firstByteLogged = true;
  }

  state.bytes += Buffer.byteLength(chunk);
  return res.write(chunk);
}

function finishResponse(res, state) {
  const ms = Number(process.hrtime.bigint() - state.startedAt) / 1e6;
  console.log(`${state.url}  ${state.bytes.toLocaleString()} B in ${ms.toFixed(0)} ms`);
  res.end();
}

function streamDepartures(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const nextDeparture = createDepartureGenerator(1);
  const state = {
    url: req.url,
    bytes: 0,
    firstByteLogged: false,
    startedAt: process.hrtime.bigint(),
  };
  let rowIndex = 0;

  const pump = () => {
    while (rowIndex < config.rowCount && !res.destroyed) {
      let batch = '';
      const end = Math.min(rowIndex + config.rowBatchSize, config.rowCount);

      for (; rowIndex < end; rowIndex++) {
        batch += board.renderRow(nextDeparture());
        batch += '\n';
      }

      if (!writeMeasured(res, batch, state)) {
        res.once('drain', pump);
        return;
      }
    }

    if (!writeMeasured(res, board.shellAfterRows, state)) {
      res.once('drain', () => finishResponse(res, state));
      return;
    }

    finishResponse(res, state);
  };

  if (!writeMeasured(res, board.shellBeforeRows, state)) {
    res.once('drain', pump);
    return;
  }

  pump();
}

const server = createServer((req, res) => {
  if (req.url === '/styles.css') {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.end(board.css);
    return;
  }

  if (req.url === '/scripts.js') {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.end(board.js);
    return;
  }

  if (req.url !== '/') {
    res.statusCode = 404;
    res.end();
    return;
  }

  streamDepartures(req, res);
});

server.listen(config.port, config.host, () => {
  const localUrl =
    config.host === '127.0.0.1'
      ? `localhost:${config.port}`
      : `${config.host}:${config.port}`;

  console.log(`Handlebars row template cached - ${board.rowTemplateBytes} B`);
  console.log(`shell cached - ${board.shellBytes.toLocaleString()} B before dynamic rows`);
  console.log(`bundles cached - js ${board.js.length} B, css ${board.css.length} B`);
  console.log(`streaming departures on http://${localUrl}`);
});
