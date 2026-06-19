// WeSC marketing/docs site, served from a Cloudflare Worker.
//
// The dogfooding happens at build time: `scripts/build-site.ts` runs the `wesc`
// npm package on the host to expand the single-file `.html` components in
// `web/` into HTML and bundle the shared CSS/JS, emitting `dist/generated.js`.
// Wrangler inlines that module into this Worker, which just routes requests and
// streams the pre-rendered output.
//
// The pages are static, so rendering them per request (as the old Rust/Wasm
// Worker did) produced identical bytes every time; the only request-specific
// bit is the 404 page echoing the requested path, which we still do here.

import { DOCS_HTML, HOME_HTML, NOT_FOUND_HTML, SCRIPTS_JS, STYLES_CSS } from '../dist/generated.js';

/** HTML is streamed to the client in chunks of this size. */
const STREAM_CHUNK_SIZE = 16 * 1024;

const encoder = new TextEncoder();

export default {
  fetch(request: Request): Response {
    // This is a read-only site: only GET/HEAD are served.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    return route(new URL(request.url).pathname);
  },
};

/**
 * Resolve a request path to a response.
 *
 * Trailing slashes are normalized so `/docs/` and `/docs` are equivalent.
 * Anything unrecognized falls through to a 404 that echoes the requested path.
 */
function route(path: string): Response {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') || '/' : path;

  switch (normalized) {
    case '/':
      return streamPage(HOME_HTML, 200);
    case '/docs':
      return streamPage(DOCS_HTML, 200);
    case '/styles.css':
      return serveAsset(STYLES_CSS, 'text/css; charset=utf-8');
    case '/scripts.js':
      return serveAsset(SCRIPTS_JS, 'text/javascript; charset=utf-8');
    default:
      return streamPage(NOT_FOUND_HTML.replaceAll('{{PATH}}', escapeHtml(path)), 404);
  }
}

/** Stream a page's HTML in bounded chunks. */
function streamPage(html: string, status: number): Response {
  const bytes = encoder.encode(html);
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (let offset = 0; offset < bytes.length; offset += STREAM_CHUNK_SIZE) {
        controller.enqueue(bytes.subarray(offset, offset + STREAM_CHUNK_SIZE));
      }
      controller.close();
    },
  });

  const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
  if (status === 200) headers.set('Cache-Control', 'public, max-age=300');
  return new Response(stream, { status, headers });
}

/**
 * Serve a cacheable asset bundle (CSS/JS). These are content-built and never
 * change between deploys, so they're cached aggressively.
 */
function serveAsset(body: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

/** Minimal HTML-escaping for the untrusted request path interpolated into 404s. */
function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
