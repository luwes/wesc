import { test } from 'zora';
import { renderToString } from '../src/dom/server.js';

test('normal document input equals output with no custom elements', async function (t) {

  const html = await renderToString(/*html*/`<!doctype html>
    <html>
      <head>
        <title>Test</title>
      </head>
      <body>
        <p>Hello world</p>
      </body>
    </html>
  `);

  t.equal(html, /*html*/`<!doctype html>\n<html>
      <head>\n        <title>Test</title>\n      </head>
      <body>\n        <p>Hello world</p>\n      </body>\n    </html>`);
});

test('slim document input equals output with no custom elements', async function (t) {

  const html = await renderToString(/*html*/`<!doctype html>
    <title>Test</title>
    <p>Hello world</p>
  `);

  t.equal(html, /*html*/`<!doctype html>
    <title>Test</title>\n    <p>Hello world</p>\n  `);
});

test('fragment input equals output with no custom elements', async function (t) {

  const html = await renderToString(/*html*/`<p>Hello world</p>`);

  t.equal(html, /*html*/`<p>Hello world</p>`);
});
