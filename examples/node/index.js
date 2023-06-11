import { promises as fs } from 'fs';
import { renderToString } from 'wesc/server';

import 'media-chrome';
import 'media-chrome/dist/media-theme-element.js';

// Process full page
// let html = await fs.readFile('./app.html');
// console.time('renderToString');
// let out = await renderToString(html);
// console.timeEnd('renderToString');
// await fs.writeFile('./index.html', out);


// Process only custom element ancestors
const customElementsRegex = /<(\w+-\w+)([^>]*?)>([^]*?)<\/\1>/gm;

let html = await fs.readFile('./app.html');

console.time('renderToString');

let out = '';
let start = 0;

let match;
while ((match = customElementsRegex.exec(html)) !== null) {

  out += html.slice(start, match.index);
  out += await renderToString(match[0]);
  start = customElementsRegex.lastIndex;
}

out += html.slice(start);
console.timeEnd('renderToString');

await fs.writeFile('./index.html', out);
