// Streaming a ~10,000-row departures board from Wesc-stamped templates.
//
//   npm run build:native       # generates ../../index.cjs
//   node examples/departures-board/server.mjs
//   open http://localhost:3000
//
// Why this demo: Wesc expands the custom elements once at startup. Each request
// then streams a static shell and stitches dynamic row data into pre-expanded row
// fragments, so the hot path is a JS data loop rather than a full document build.

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { writeFileSync, readFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { build } from '../../index.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = __dirname;
const ROW_COUNT = Number(process.env.ROWS) || 10_000;
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const ROW_BATCH_SIZE = Number(process.env.ROW_BATCH_SIZE) || 128;

// Work in a throwaway copy so we can write stamp documents and the bundler's
// .wesc/ working dir without polluting the source tree.
const workDir = mkdtempSync(join(tmpdir(), 'wesc-departures-'));
cpSync(resolve(srcDir, 'components'), join(workDir, 'components'), { recursive: true });
process.chdir(workDir);

// --- Synthetic flight data ----------------------------------------------------
// Deterministic so every request returns the same document.
const AIRLINES = ['UA', 'AA', 'DL', 'BA', 'LH', 'AF', 'KL', 'JL', 'NH', 'SQ', 'QF', 'EK', 'LX', 'IB'];
const CITIES = [
  ['JFK', 'New York'], ['LAX', 'Los Angeles'], ['ORD', 'Chicago'], ['DFW', 'Dallas'],
  ['DEN', 'Denver'], ['SEA', 'Seattle'], ['SFO', 'San Francisco'], ['BOS', 'Boston'],
  ['MIA', 'Miami'], ['ATL', 'Atlanta'], ['LHR', 'London'], ['CDG', 'Paris'],
  ['AMS', 'Amsterdam'], ['FRA', 'Frankfurt'], ['MAD', 'Madrid'], ['FCO', 'Rome'],
  ['ZRH', 'Zürich'], ['CPH', 'Copenhagen'], ['ARN', 'Stockholm'], ['HEL', 'Helsinki'],
  ['NRT', 'Tokyo'], ['HND', 'Tokyo Haneda'], ['ICN', 'Seoul'], ['HKG', 'Hong Kong'],
  ['SIN', 'Singapore'], ['BKK', 'Bangkok'], ['SYD', 'Sydney'], ['DXB', 'Dubai'],
  ['DOH', 'Doha'], ['IST', 'Istanbul'], ['GRU', 'São Paulo'], ['EZE', 'Buenos Aires'],
];
const STATUSES = [
  { key: 'on-time',    label: 'On Time',    weight: 55 },
  { key: 'boarding',   label: 'Boarding',   weight: 10 },
  { key: 'final-call', label: 'Final Call', weight: 3 },
  { key: 'delayed',    label: 'Delayed',    weight: 15 },
  { key: 'departed',   label: 'Departed',   weight: 14 },
  { key: 'cancelled',  label: 'Cancelled',  weight: 3 },
];

// Mulberry32 PRNG, deterministic and cheap.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const pad = (n) => String(n).padStart(2, '0');

function pickStatus(rand) {
  const total = STATUSES.reduce((s, x) => s + x.weight, 0);
  let r = rand() * total;
  for (const s of STATUSES) {
    r -= s.weight;
    if (r <= 0) return s;
  }
  return STATUSES[0];
}

function departure(rand) {
  const airline = pick(rand, AIRLINES);
  const flightNo = 100 + Math.floor(rand() * 9000);
  const dest = pick(rand, CITIES);
  const hh = Math.floor(rand() * 24);
  const mm = Math.floor(rand() * 12) * 5;
  const status = pickStatus(rand);
  const gateLetter = String.fromCharCode(65 + Math.floor(rand() * 6));
  const gate = `${gateLetter}${1 + Math.floor(rand() * 40)}`;
  let eta = '';

  if (status.key === 'delayed') {
    const delay = 15 + Math.floor(rand() * 180);
    const etaMin = (hh * 60 + mm + delay) % (24 * 60);
    eta = `${pad(Math.floor(etaMin / 60))}:${pad(etaMin % 60)}`;
  }

  return {
    flight: `${airline} ${flightNo}`,
    route: `${dest[0]} · ${dest[1]}`,
    time: `${pad(hh)}:${pad(mm)}`,
    gate,
    statusKey: status.key,
    statusLabel: status.label,
    delayed: status.key === 'delayed',
    eta,
  };
}

// --- Stamps ------------------------------------------------------------------
const TOKENS = {
  rows: '%%WESC_ROWS%%',
  rowCount: '%%WESC_ROW_COUNT%%',
  flight: '%%WESC_FLIGHT%%',
  route: '%%WESC_ROUTE%%',
  time: '%%WESC_TIME%%',
  gate: '%%WESC_GATE%%',
  status: '%%WESC_STATUS%%',
  statusLabel: '%%WESC_STATUS_LABEL%%',
  eta: '%%WESC_ETA%%',
};

function stampDefinitions() {
  return `
    <link rel="definition" name="flight-row" href="./components/flight-row.html">
    <link rel="definition" name="status-badge" href="./components/status-badge.html">
  `;
}

function writeStamp(name, source, options = {}) {
  writeFileSync(join(workDir, name), source);
  return build({ entryPoints: [name], ...options }).toString('utf8');
}

function rowStamp(attrs = '') {
  return `${stampDefinitions()}
<template>
  <flight-row${attrs}>
    <span slot="flight">${TOKENS.flight}</span>
    <span slot="route">${TOKENS.route}</span>
    <span slot="time">${TOKENS.time}</span>
    <span slot="gate">${TOKENS.gate}</span>
    <status-badge slot="status" status="${TOKENS.status}">${TOKENS.statusLabel}</status-badge>
  </flight-row>
</template>
`;
}

function shellStamp() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Departures · WeSC</title>
    ${stampDefinitions()}
    <link rel="stylesheet" href="/styles.css">
    <style>
      :root { color-scheme: dark; }
      html, body { margin: 0; background: #050505; color: #ddd; font: 14px/1.4 -apple-system, system-ui, "SF Mono", ui-monospace, monospace; }
      header { position: sticky; top: 0; z-index: 1; background: #050505; padding: 18px 28px 14px; border-bottom: 1px solid #1a1a1a; }
      header h1 { margin: 0 0 4px; font-size: 13px; letter-spacing: 0.4em; color: #ff8a4c; font-weight: 600; text-transform: uppercase; }
      header p { margin: 0; font-size: 12px; color: #777; }
      .head-row { display: grid; grid-template-columns: 90px 1fr 110px 70px 130px; gap: 24px; padding: 10px 28px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #555; border-bottom: 1px solid #1a1a1a; }
    </style>
  </head>
  <body>
    <header>
      <h1>Departures</h1>
      <p>${TOKENS.rowCount} flights · Wesc-stamped rows, streamed by JS</p>
    </header>
    <div class="head-row">
      <span>Flight</span><span>Destination</span><span>Time</span><span>Gate</span><span>Status</span>
    </div>
    <main>
${TOKENS.rows}
    </main>
  </body>
</html>
`;
}

function splitOnce(source, token) {
  const index = source.indexOf(token);
  if (index === -1) throw new Error(`Compiled stamp is missing ${token}`);
  return [source.slice(0, index), source.slice(index + token.length)];
}

function compileStamp(source, tokenByKey) {
  const entries = Object.entries(tokenByKey).map(([key, token]) => ({ key, token }));
  const parts = [];
  const seen = new Set();
  let index = 0;

  while (index < source.length) {
    let match = null;

    for (const entry of entries) {
      const tokenIndex = source.indexOf(entry.token, index);
      if (tokenIndex !== -1 && (!match || tokenIndex < match.index)) {
        match = { ...entry, index: tokenIndex };
      }
    }

    if (!match) {
      parts.push(source.slice(index));
      break;
    }

    parts.push(source.slice(index, match.index));
    parts.push({ key: match.key });
    seen.add(match.key);
    index = match.index + match.token.length;
  }

  for (const entry of entries) {
    if (!seen.has(entry.key)) {
      throw new Error(`Compiled stamp is missing ${entry.token}`);
    }
  }

  return (values) => {
    let output = '';
    for (const part of parts) {
      output += typeof part === 'string' ? part : values[part.key];
    }
    return output;
  };
}

const TEXT_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

const ATTR_ESCAPES = {
  ...TEXT_ESCAPES,
  '"': '&quot;',
  "'": '&#39;',
};

function escapeText(value) {
  return String(value).replace(/[&<>]/g, (ch) => TEXT_ESCAPES[ch]);
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ATTR_ESCAPES[ch]);
}

const normalRowHtml = writeStamp('row-normal.html', rowStamp()).trim();
const delayedRowHtml = writeStamp(
  'row-delayed.html',
  rowStamp(` delayed data-eta="${TOKENS.eta}"`)
).trim();

const normalRowTemplate = compileStamp(normalRowHtml, {
  flight: TOKENS.flight,
  route: TOKENS.route,
  time: TOKENS.time,
  gate: TOKENS.gate,
  status: TOKENS.status,
  statusLabel: TOKENS.statusLabel,
});
const delayedRowTemplate = compileStamp(delayedRowHtml, {
  flight: TOKENS.flight,
  route: TOKENS.route,
  time: TOKENS.time,
  gate: TOKENS.gate,
  status: TOKENS.status,
  statusLabel: TOKENS.statusLabel,
  eta: TOKENS.eta,
});

const shellHtml = writeStamp('shell.html', shellStamp(), {
  outjs: 'scripts.js',
  outcss: 'styles.css',
}).split(TOKENS.rowCount).join(ROW_COUNT.toLocaleString());
const [shellBeforeRows, shellAfterRows] = splitOnce(shellHtml, TOKENS.rows);

const css = readFileSync(join(workDir, 'styles.css'));
let js = Buffer.alloc(0);
try { js = readFileSync(join(workDir, 'scripts.js')); } catch {}

function renderRow(row) {
  const values = {
    flight: escapeText(row.flight),
    route: escapeText(row.route),
    time: escapeText(row.time),
    gate: escapeText(row.gate),
    status: escapeAttr(row.statusKey),
    statusLabel: escapeText(row.statusLabel),
    eta: escapeAttr(row.eta),
  };
  return row.delayed ? delayedRowTemplate(values) : normalRowTemplate(values);
}

function writeMeasured(res, chunk, state, t0) {
  if (res.destroyed) return false;
  if (!state.firstByteLogged) {
    const ttfb = Number(process.hrtime.bigint() - t0) / 1e6;
    console.log(`${state.url}  TTFB ${ttfb.toFixed(1)} ms`);
    state.firstByteLogged = true;
  }
  state.bytes += Buffer.byteLength(chunk);
  return res.write(chunk);
}

// --- Server ------------------------------------------------------------------
const server = createServer((req, res) => {
  if (req.url === '/styles.css') {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    return res.end(css);
  }
  if (req.url === '/scripts.js') {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    return res.end(js);
  }
  if (req.url !== '/') {
    res.statusCode = 404;
    return res.end();
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const t0 = process.hrtime.bigint();
  const state = { url: req.url, firstByteLogged: false, bytes: 0 };
  const rand = rng(1);
  let rowIndex = 0;

  const finish = () => {
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    console.log(`${req.url}  ${state.bytes.toLocaleString()} B in ${ms.toFixed(0)} ms`);
    res.end();
  };

  const pump = () => {
    while (rowIndex < ROW_COUNT && !res.destroyed) {
      let batch = '';
      const end = Math.min(rowIndex + ROW_BATCH_SIZE, ROW_COUNT);

      for (; rowIndex < end; rowIndex++) {
        batch += renderRow(departure(rand));
        batch += '\n';
      }

      if (!writeMeasured(res, batch, state, t0)) {
        res.once('drain', pump);
        return;
      }
    }

    if (!writeMeasured(res, shellAfterRows, state, t0)) {
      res.once('drain', finish);
      return;
    }

    finish();
  };

  if (!writeMeasured(res, shellBeforeRows, state, t0)) {
    res.once('drain', pump);
    return;
  }

  pump();
});

server.listen(PORT, HOST, () => {
  const shellBytes = Buffer.byteLength(shellBeforeRows) + Buffer.byteLength(shellAfterRows);
  const localUrl = HOST === '127.0.0.1' ? `localhost:${PORT}` : `${HOST}:${PORT}`;
  console.log(`row stamps cached - normal ${Buffer.byteLength(normalRowHtml)} B, delayed ${Buffer.byteLength(delayedRowHtml)} B`);
  console.log(`shell cached - ${shellBytes.toLocaleString()} B before dynamic rows`);
  console.log(`bundles cached - js ${js.length} B, css ${css.length} B`);
  console.log(`streaming departures on http://${localUrl}`);
});
