/** @type {import('@sveltejs/kit').Handle} */

import { renderToStream } from 'wesc/server';

export async function handle({ event, resolve }) {

  await import('media-chrome');
  await import('media-chrome/dist/media-theme-element.js');

  const response = await resolve(event);
  const headers = new Headers(response.headers);

  return new Response(renderToStream(response.body), { headers });
}
