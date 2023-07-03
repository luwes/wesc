/** @type {import('@sveltejs/kit').Handle} */

import { renderToString } from 'wesc/server';

// Process only custom element ancestors
const customElementsRegex = /<(\w+-\w+)([^>]*?)>([^]*?)<\/\1>/gm;

export async function handle({ event, resolve }) {

  await import('media-chrome');
  await import('media-chrome/dist/media-theme-element.js');

  const response = await resolve(event);
  let html = await response.text();

  let out = '';
  let start = 0;

  let match;
  while ((match = customElementsRegex.exec(html)) !== null) {

    out += html.slice(start, match.index);
    out += await renderToString(match[0]);
    start = customElementsRegex.lastIndex;
  }

  out += html.slice(start);

  const headers = new Headers(response.headers);

  return new Response(out, { headers });
}
