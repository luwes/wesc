import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import Handlebars from 'handlebars';
import { build } from '../../index.cjs';

const TEMPLATE_DIR = 'templates';

function readTemplate(srcDir, name) {
  return readFileSync(resolve(srcDir, TEMPLATE_DIR, name), 'utf8');
}

function buildTemplate(workDir, name, source, options = {}) {
  const entryPoint = join(workDir, name);
  writeFileSync(entryPoint, source);
  return build({ entryPoints: [name], ...options }).toString('utf8');
}

function readOptional(path) {
  try {
    return readFileSync(path);
  } catch {
    return Buffer.alloc(0);
  }
}

export function createBoardRenderer({ srcDir, rowCount }) {
  const workDir = mkdtempSync(join(tmpdir(), 'wesc-departures-'));
  cpSync(resolve(srcDir, 'components'), join(workDir, 'components'), { recursive: true });

  const previousCwd = process.cwd();
  let rowHtml;
  let shellBeforeRowsTemplate;

  try {
    process.chdir(workDir);
    rowHtml = buildTemplate(workDir, 'row.hbs', readTemplate(srcDir, 'row.hbs'), {
      outjs: 'scripts.js',
      outcss: 'styles.css',
    }).trim();
    shellBeforeRowsTemplate = readTemplate(srcDir, 'shell-before-rows.hbs');
  } finally {
    process.chdir(previousCwd);
  }

  const renderRow = Handlebars.compile(rowHtml);
  const shellBeforeRows = Handlebars.compile(shellBeforeRowsTemplate)({
    rowCount: rowCount.toLocaleString(),
  });
  const shellAfterRows = readTemplate(srcDir, 'shell-after-rows.hbs');

  return {
    css: readFileSync(join(workDir, 'styles.css')),
    js: readOptional(join(workDir, 'scripts.js')),
    shellAfterRows,
    shellBeforeRows,
    shellBytes: Buffer.byteLength(shellBeforeRows) + Buffer.byteLength(shellAfterRows),
    rowTemplateBytes: Buffer.byteLength(rowHtml),
    renderRow,
  };
}
