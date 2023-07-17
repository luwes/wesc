/** @type {import('@sveltejs/kit').Handle} */

import { renderToStream } from 'wesc/server';

export async function handle({ event, resolve }) {

  await import('media-chrome');
  await import('media-chrome/dist/media-theme-element.js');

  const response = await resolve(event);
  const body = renderToStream(response.body);

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(body, { headers });
}
