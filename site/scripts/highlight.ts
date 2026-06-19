#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

import { codeToHtml, type ShikiTransformer } from 'shiki';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/highlight.ts <html-file> [...]');
  process.exit(2);
}

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const highlighted = await highlightHtml(html);
  if (highlighted !== html) {
    await writeFile(file, highlighted);
  }
}

async function highlightHtml(html: string): Promise<string> {
  const codeBlock = /<pre><code class="language-([a-z0-9_-]+)">([\s\S]*?)<\/code><\/pre>/gi;
  let out = '';
  let cursor = 0;

  const transformers: ShikiTransformer[] = [
    {
      pre(node) {
        this.addClassToHast(node, 'code-block');
      },
    },
  ];

  for (const match of html.matchAll(codeBlock)) {
    out += html.slice(cursor, match.index);
    const lang = normalizeLanguage(match[1]);
    const code = decodeHtml(match[2]);
    out += await codeToHtml(code, { lang, theme: 'github-dark', transformers });
    cursor = match.index + match[0].length;
  }

  out += html.slice(cursor);
  return out;
}

function normalizeLanguage(lang: string): string {
  switch (lang.toLowerCase()) {
    case 'sh':
    case 'shell':
    case 'bash':
      return 'bash';
    case 'html':
    case 'markup':
      return 'html';
    case 'rs':
    case 'rust':
      return 'rust';
    default:
      return lang.toLowerCase();
  }
}

function decodeHtml(input: string): string {
  return input
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}
