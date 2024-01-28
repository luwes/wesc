import { test } from 'zora';
import { renderToString } from '../../src/dom/server.js';
import './src/components/paragraph.js';

test('renders declarative shadow DOM', async function (t) {

  const html = await renderToString(`
    <h1>Home Page</h1>

    <wcc-paragraph class="default"></wcc-paragraph>

    <wcc-paragraph class="custom">
      <span slot="my-text">Let's have some different text!</span>
    </wcc-paragraph>
  `);

  t.equal(html, `
    <h1>Home Page</h1>

    <wcc-paragraph class="default"><template shadowrootmode="open">\n  <style> p{color: white;background-color: #666;padding: 5px;}</style>\n  <p><slot name="my-text">My default text</slot></p>\n</template></wcc-paragraph>

    <wcc-paragraph class="custom"><template shadowrootmode="open">\n  <style> p{color: white;background-color: #666;padding: 5px;}</style>\n  <p><slot name="my-text">My default text</slot></p>\n</template>\n      <span slot="my-text">Let's have some different text!</span>\n    </wcc-paragraph>\n  `);
});
