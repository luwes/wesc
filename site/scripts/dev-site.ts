#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, watch } from 'node:fs';
import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(siteRoot, '..');
const webRoot = join(siteRoot, 'web');
const outDir = join(siteRoot, '.dev-dist');
// A mirror of web/ with the page sources Shiki-highlighted in place. The wesc
// CLI renders pages out of this tree per request, mirroring the Worker, which
// expands the embedded (highlighted) sources at runtime.
const mirroredWeb = join(outDir, 'web');
const wescManifest = join(repoRoot, 'crates', 'wesc', 'Cargo.toml');
const highlightScript = join(siteRoot, 'scripts', 'highlight.ts');
const wescBin = join(
  repoRoot,
  'target',
  'debug',
  process.platform === 'win32' ? 'wesc.exe' : 'wesc',
);
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '127.0.0.1';
// Type stripping is still flagged experimental in Node 24; silence the per-run
// warning when we shell out to `node` for the (TypeScript) highlighter.
const nodeTsFlags = ['--disable-warning=ExperimentalWarning'];

// Page sources Shiki highlights and that the CLI renders per request.
const pages = ['home.html', 'docs.html', 'not-found.html'];
const routeToSource = new Map<string, string>([
  ['/', 'home.html'],
  ['/docs', 'docs.html'],
]);

const clients = new Set<ServerResponse>();
let building = false;
let queued = false;
let lastBuildOk = false;
let lastError = '';

await ensureWescBinary();
await buildAssets();
startServer();
startWatcher();

// Builds only what's shared across requests: the CSS/JS bundles, and the
// Shiki-highlighted mirror of the source tree. Per-page HTML is rendered on
// demand in the request handler, the same way the Worker expands it at runtime.
async function buildAssets(): Promise<void> {
  if (building) {
    queued = true;
    return;
  }

  building = true;
  queued = false;
  const started = performance.now();
  console.log('⏳ wesc asset build started');

  try {
    await mkdir(outDir, { recursive: true });
    await rm(mirroredWeb, { recursive: true, force: true });
    await rm(join(outDir, '.wesc'), { recursive: true, force: true });

    // Mirror web/ and highlight the page sources in the copy.
    await cp(webRoot, mirroredWeb, { recursive: true });
    await run(
      'node',
      [...nodeTsFlags, highlightScript, ...pages.map((p) => join(mirroredWeb, 'pages', p))],
      {
        captureStdout: true,
      },
    );

    // Build the shared CSS + JS bundles once (rolldown handles the JS).
    await runWesc([
      join(mirroredWeb, 'assets.html'),
      '--cwd',
      outDir,
      '--outcss',
      'styles.css',
      '--outjs',
      'scripts.js',
    ]);

    lastBuildOk = true;
    lastError = '';
    const ms = Math.round(performance.now() - started);
    console.log(`✅ wesc asset build finished in ${ms} ms`);
    broadcast('reload');
  } catch (error) {
    lastBuildOk = false;
    lastError = String((error as Error)?.message ?? error);
    console.error('❌ wesc asset build failed');
    console.error(lastError);
    broadcast('error');
  } finally {
    building = false;
    if (queued) {
      setTimeout(buildAssets, 20);
    }
  }
}

// Expand a single page to HTML at request time, exactly like the Worker.
async function renderPage(sourceFile: string): Promise<string> {
  const started = performance.now();
  const html = await runWesc([join(mirroredWeb, 'pages', sourceFile)], { captureStdout: true });
  console.log(`🖌  rendered ${sourceFile} in ${Math.round(performance.now() - started)} ms`);
  return html;
}

async function ensureWescBinary(): Promise<void> {
  const started = performance.now();
  console.log('🔧 ensuring local wesc CLI is built');
  await run('cargo', ['build', '--quiet', '--manifest-path', wescManifest], {
    captureStdout: true,
  });
  console.log(`🔧 wesc CLI ready in ${Math.round(performance.now() - started)} ms`);
}

function runWesc(
  args: string[],
  { captureStdout = false }: { captureStdout?: boolean } = {},
): Promise<string> {
  return run(wescBin, args, { captureStdout });
}

function run(
  command: string,
  args: string[],
  { captureStdout = false }: { captureStdout?: boolean } = {},
): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: siteRoot, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    child.stdout!.setEncoding('utf8');
    child.stderr!.setEncoding('utf8');
    child.stdout!.on('data', (chunk: string) => {
      if (captureStdout) stdout += chunk;
    });
    child.stderr!.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise(stdout);
      } else {
        reject(new Error(stderr || `wesc exited with ${code}`));
      }
    });
  });
}

function startServer(): void {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? `${host}:${port}`}`);
      const path = normalizePath(url.pathname);

      if (path === '/__dev/events') {
        serveEvents(req, res);
        return;
      }

      if (path === '/styles.css') {
        await serveFile(res, join(outDir, 'styles.css'), 'text/css; charset=utf-8');
        return;
      }

      if (path === '/scripts.js') {
        await serveFile(res, join(outDir, 'scripts.js'), 'text/javascript; charset=utf-8');
        return;
      }

      const source = routeToSource.get(path);
      if (source) {
        await servePage(res, source, 200);
        return;
      }

      await serveNotFound(res, url.pathname);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String((error as Error)?.stack ?? error));
    }
  });

  server.listen(port, host, () => {
    console.log(`🚀 dev:site ready on http://${host}:${port}`);
    console.log('   rendering pages with the wesc CLI per request, like the Worker');
  });
}

function serveEvents(req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Connection: 'keep-alive',
  });
  res.write('event: hello\ndata: connected\n\n');
  clients.add(res);
  req.on('close', () => clients.delete(res));
}

function broadcast(message: string): void {
  for (const client of clients) {
    client.write(`event: ${message}\ndata: ${Date.now()}\n\n`);
  }
}

async function serveFile(
  res: ServerResponse,
  filePath: string,
  contentType: string,
): Promise<void> {
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(lastBuildOk ? 'Not found' : lastError || 'Build output missing');
    return;
  }

  const { size } = await stat(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': size,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  createReadStream(filePath).pipe(res);
}

async function servePage(res: ServerResponse, sourceFile: string, status: number): Promise<void> {
  if (!lastBuildOk) {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(devErrorPage(lastError || 'Asset build missing'));
    return;
  }

  const html = await renderPage(sourceFile);
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(injectLiveReload(html));
}

async function serveNotFound(res: ServerResponse, path: string): Promise<void> {
  if (!lastBuildOk) {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(devErrorPage(lastError || 'Asset build missing'));
    return;
  }

  const html = (await renderPage('not-found.html')).replace('{{PATH}}', escapeHtml(path));
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(injectLiveReload(html));
}

function injectLiveReload(html: string): string {
  const script = `<script type="module">
const events = new EventSource('/__dev/events');
events.addEventListener('reload', () => location.reload());
events.addEventListener('error', () => console.warn('[dev:site] build failed; check terminal'));
</script>`;

  if (html.includes('</body>')) return html.replace('</body>', `${script}</body>`);
  return `${html}${script}`;
}

function devErrorPage(error: string): string {
  return `<!doctype html><meta charset="utf-8"><title>Build failed</title><pre>${escapeHtml(error)}</pre>`;
}

function startWatcher(): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const schedule = (eventType: string, filename: string | null): void => {
    if (filename) console.log(`🔁 ${eventType}: web/${filename}`);
    if (timer) clearTimeout(timer);
    timer = setTimeout(buildAssets, 80);
  };

  watch(webRoot, { recursive: true }, schedule);
}

function normalizePath(path: string): string {
  if (path.length > 1) return path.replace(/\/+$/, '') || '/';
  return path;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
