#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createReadStream, existsSync } from 'node:fs';
import { watch } from 'node:fs';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(siteRoot, '..');
const webRoot = join(siteRoot, 'web');
const outDir = join(siteRoot, '.dev-dist');
const wescManifest = join(repoRoot, 'crates', 'wesc', 'Cargo.toml');
const highlightScript = join(siteRoot, 'scripts', 'highlight.mjs');
const wescBin = join(
  repoRoot,
  'target',
  'debug',
  process.platform === 'win32' ? 'wesc.exe' : 'wesc',
);
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '127.0.0.1';

const pages = [
  ['/', 'home.html', 'home.html'],
  ['/docs', 'docs.html', 'docs.html'],
];

const routeToOutput = new Map(pages.map(([route, , output]) => [route, output]));
const clients = new Set();
let building = false;
let queued = false;
let lastBuildOk = false;
let lastError = '';

await ensureWescBinary();
await buildAll();
startServer();
startWatcher();

async function buildAll() {
  if (building) {
    queued = true;
    return;
  }

  building = true;
  queued = false;
  const started = performance.now();
  console.log('⏳ wesc build started');

  try {
    await mkdir(outDir, { recursive: true });
    await rm(join(outDir, '.wesc'), { recursive: true, force: true });

    await runWesc([
      join(webRoot, 'assets.html'),
      '--cwd',
      outDir,
      '--outcss',
      'styles.css',
      '--outjs',
      'scripts.js',
    ]);

    const htmlFiles = [];
    for (const [, source, output] of pages) {
      const html = await runWesc([join(webRoot, 'pages', source), '--cwd', outDir], {
        captureStdout: true,
      });
      const outputPath = join(outDir, output);
      await writeFile(outputPath, html);
      htmlFiles.push(outputPath);
    }

    const notFound = await runWesc([join(webRoot, 'pages', 'not-found.html'), '--cwd', outDir], {
      captureStdout: true,
    });
    const notFoundPath = join(outDir, 'not-found.html');
    await writeFile(notFoundPath, notFound);
    htmlFiles.push(notFoundPath);

    await run('node', [highlightScript, ...htmlFiles], { captureStdout: true });

    lastBuildOk = true;
    lastError = '';
    const ms = Math.round(performance.now() - started);
    console.log(`✅ wesc build finished in ${ms} ms`);
    broadcast('reload');
  } catch (error) {
    lastBuildOk = false;
    lastError = String(error?.message ?? error);
    console.error('❌ wesc build failed');
    console.error(lastError);
    broadcast('error');
  } finally {
    building = false;
    if (queued) {
      setTimeout(buildAll, 20);
    }
  }
}

async function ensureWescBinary() {
  const started = performance.now();
  console.log('🔧 ensuring local wesc CLI is built');
  await run('cargo', ['build', '--quiet', '--manifest-path', wescManifest], {
    captureStdout: true,
  });
  console.log(`🔧 wesc CLI ready in ${Math.round(performance.now() - started)} ms`);
}

function runWesc(args, { captureStdout = false } = {}) {
  return run(wescBin, args, { captureStdout });
}

function run(command, args, { captureStdout = false } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: siteRoot, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      if (captureStdout) stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
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

function startServer() {
  const server = createServer(async (req, res) => {
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

      const output = routeToOutput.get(path);
      if (output) {
        await serveHtml(res, join(outDir, output), 200);
        return;
      }

      await serveNotFound(res, url.pathname);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String(error?.stack ?? error));
    }
  });

  server.listen(port, host, () => {
    console.log(`🚀 dev:site ready on http://${host}:${port}`);
    console.log('   watching web/ and serving .dev-dist/ without rebuilding Worker Wasm');
  });
}

function serveEvents(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Connection: 'keep-alive',
  });
  res.write('event: hello\ndata: connected\n\n');
  clients.add(res);
  req.on('close', () => clients.delete(res));
}

function broadcast(message) {
  for (const client of clients) {
    client.write(`event: ${message}\ndata: ${Date.now()}\n\n`);
  }
}

async function serveFile(res, filePath, contentType) {
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

async function serveHtml(res, filePath, status) {
  if (!existsSync(filePath)) {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(devErrorPage(lastError || `Missing ${relative(siteRoot, filePath)}`));
    return;
  }

  const html = await readFile(filePath, 'utf8');
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(injectLiveReload(html));
}

async function serveNotFound(res, path) {
  const filePath = join(outDir, 'not-found.html');
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const html = (await readFile(filePath, 'utf8')).replace('{{PATH}}', escapeHtml(path));
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(injectLiveReload(html));
}

function injectLiveReload(html) {
  const script = `<script type="module">
const events = new EventSource('/__dev/events');
events.addEventListener('reload', () => location.reload());
events.addEventListener('error', () => console.warn('[dev:site] build failed; check terminal'));
</script>`;

  if (html.includes('</body>')) return html.replace('</body>', `${script}</body>`);
  return `${html}${script}`;
}

function devErrorPage(error) {
  return `<!doctype html><meta charset="utf-8"><title>Build failed</title><pre>${escapeHtml(error)}</pre>`;
}

function startWatcher() {
  let timer = null;
  const schedule = (eventType, filename) => {
    if (filename) console.log(`🔁 ${eventType}: web/${filename}`);
    clearTimeout(timer);
    timer = setTimeout(buildAll, 80);
  };

  watch(webRoot, { recursive: true }, schedule);
}

function normalizePath(path) {
  if (path.length > 1) return path.replace(/\/+$/, '') || '/';
  return path;
}

function escapeHtml(input) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
