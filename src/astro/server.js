import { renderToString } from '../server.js';

async function check(tag, props) {
  return !!customElements?.get?.(tag) && props.wesc;
}

async function renderToStaticMarkup(tag, attrs, children) {
  delete attrs.wesc;

  let html = await renderToString(stringify(tag, attrs, children));
  return { html };
}

function stringify(tag, attrs, children) {
  let html = `<${tag}`;

  for (let name in attrs) {
    let value = attrs[name];

    if (typeof value === 'undefined') continue;
    if (typeof value === 'boolean') {
      if (!value) continue;
      value = '';
    }

    html += ` ${name.toLowerCase()}="${value}"`;
  }

  html += `>`;

  for (let childHtml of Object.values(children)) {
    html += childHtml;
  }

  html += `</${tag}>`;

  return html;
}

export default { check, renderToStaticMarkup };
