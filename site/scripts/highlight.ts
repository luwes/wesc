import { codeToHtml, type ShikiTransformer } from 'shiki';

// Shiki-highlight every `<pre><code class="language-…">` block in an HTML
// source. The page sources are static markup, so this runs once at build time
// over the source (before wesc expands the components around it).
export async function highlightHtml(html: string): Promise<string> {
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
