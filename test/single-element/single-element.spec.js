import { test } from 'zora';
import { renderToString } from '../../src/dom/server.js';
import './src/footer.js';

test('renders declarative shadow DOM', async function (t) {

  const html = await renderToString(`<wcc-footer></wcc-footer>`);

  t.equal(html, `<wcc-footer><template shadowrootmode="open">
  <style> .footer{color: white;bottom: 0;width: 100%;background-color: #192a27;min-height: 30px;padding-top: 10px;}.footer a{color: #efefef;text-decoration: none;}.footer h4{width: 90%;margin: 0 auto;padding: 0;text-align: center;}</style>

  <footer class="footer">
    <h4>
      <a href="https://www.greenwoodjs.io/">My Blog ©2023 ◈ Built with GreenwoodJS</a>
    </h4>
  </footer>
</template></wcc-footer>`);
});
