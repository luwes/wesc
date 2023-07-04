/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { renderToStream } from 'wesc/server';

export default {
  async fetch(request, env, ctx) {
    let out = '';

    const url = new URL(request.url);
    const contentUrl = url.searchParams.get('url');

    await import('media-chrome');
    await import('media-chrome/dist/media-theme-element.js');

    class TitleElementHandler {
      element(element) {
        element.before(`<base href="${contentUrl}">\n`, { html: true });
      }
    }

    if (contentUrl) {
      const res = await fetch(contentUrl);

      const newRes = new HTMLRewriter() // eslint-disable-line
        .on('title', new TitleElementHandler())
        .transform(res);

      out = renderToStream(newRes.body);
    }

    return new Response(out, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
