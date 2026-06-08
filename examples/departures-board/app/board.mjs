// Rendering core for the departures board.
//
// wesc expands the components into a single LiquidJS page template once at
// startup; each request streams that template, pulling rows from an async
// cursor so the shell and earlier rows flush while later pages are still being
// fetched and rendered. The public surface is a standard web `Response` /
// `ReadableStream`, so it drops straight into a Worker / Deno / Bun / Next.js
// handler, or onto Node's http server via `Readable.fromWeb`.

import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Liquid, Drop } from 'liquidjs';

import { build } from '../../../packages/wesc/index.cjs';
import { createDepartureCursor } from './flight-data.mjs';

// board.mjs lives in app/, but entry points and build output are resolved
// relative to the example root, so step up out of app/.
const projectDir = dirname(dirname(fileURLToPath(import.meta.url)));

// Expand the wesc components once at startup. The result is a single LiquidJS
// page template plus the bundled component CSS/JS.
function buildBoard() {
  process.chdir(projectDir);

  const page = build({
    entryPoints: ['app/templates/index.liquid'],
    outjs: 'dist/scripts.js',
    outcss: 'dist/styles.css',
  })
    .toString('utf8')
    .trim();

  return {
    page,
    css: readFileSync('dist/styles.css'),
    js: readFileSync('dist/scripts.js'),
  };
}

export const assets = buildBoard();

const engine = new Liquid();
const page = engine.parse(assets.page);

// A row backed by the async cursor. Its first property access awaits the
// cursor (which awaits a page fetch on each page boundary), handing the event
// loop back so rendered output can flush. Once the row's data is in hand, the
// remaining fields are served synchronously.
class CursorRow extends Drop {
  constructor(cursor) {
    super();
    this.cursor = cursor;
    this.row = null;
  }

  liquidMethodMissing(key) {
    if (this.row) return this.row[key];
    return this.cursor.next().then((row) => {
      this.row = row;
      return row[key];
    });
  }
}

// LiquidJS's streaming API is a Node Readable; we adapt its async-iterator
// chunks into a standard web ReadableStream.
function boardWebStream({ rowCount, pageSize }) {
  const cursor = createDepartureCursor({ total: rowCount, pageSize });
  const flights = Array.from({ length: rowCount }, () => new CursorRow(cursor));
  const nodeStream = engine.renderToNodeStream(page, {
    rowCount: rowCount.toLocaleString(),
    flights,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of nodeStream) {
          controller.enqueue(encoder.encode(String(chunk)));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

// A standard web Response streaming the full HTML document.
export function boardResponse(opts) {
  return new Response(boardWebStream(opts), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Don't let a reverse proxy (nginx) buffer the streamed response.
      'x-accel-buffering': 'no',
    },
  });
}
