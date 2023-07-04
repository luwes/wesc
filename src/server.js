import { parseHTML } from 'linkedom';

let preshimGlobalThis;

shim();

export function shim() {
  if (preshimGlobalThis) return;

  let {
    document,
    customElements,
    Event,
    CustomEvent,
    DocumentFragment,
    DOMParser,
    HTMLElement,
    HTMLTemplateElement,
    MutationObserver,
  } = parseHTML('...');

  class Storage {
    key() {}
    getItem() {}
    setItem() {}
    removeItem() {}
    clear() {}
  }

  const localStorage = new Storage();

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  class CSSStyleDeclaration {
    getPropertyPriority() {}
    getPropertyValue() {}
    item() {}
    removeProperty() {}
    setProperty() {}
  }

  const shims = {
    document,
    customElements,
    Event,
    CustomEvent,
    DocumentFragment,
    DOMParser,
    HTMLElement,
    HTMLTemplateElement,
    MutationObserver,
    localStorage,
    ResizeObserver,
    CSSStyleDeclaration,
    getComputedStyle: function getComputedStyle() { return new CSSStyleDeclaration(); },
    requestAnimationFrame: function requestAnimationFrame() {},
    cancelAnimationFrame: function cancelAnimationFrame() {},
    navigator: {},
  };

  preshimGlobalThis = {};
  for (let shim in shims) {
    preshimGlobalThis[shim] = globalThis[shim];
  }

  Object.assign(globalThis, shims);
}

export function unshim() {
  Object.assign(globalThis, preshimGlobalThis);
  preshimGlobalThis = undefined;
}


const voidElements = new Set(['area', 'base', 'br', 'col', 'command',
'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source',
'track', 'wbr']);

const nonClosingElements = new Set([
  ...voidElements,
  'html'
]);

const defaults = {
  getRenderComplete: () => new Promise((resolve) => setTimeout(resolve, 0)),
  minifyCss: true,
};

export async function renderToDom(html, opts = defaults) {
  html = String(html);

  // Remove doctype and save in the options object.
  html = html.replace(/<!DOCTYPE[^>]*?>/i, (doctype) => {
    opts.doctype = opts.doctype ?? doctype;
  });

  // Wrap a fragment with a html tag to avoid issues
  // where Node.getRootNode() would point to itself.
  const isFragment = !html.includes('<html');
  if (isFragment) {
    html = `<html>${html}</html>`;
  }

  document.documentElement.outerHTML = html;

  await opts.getRenderComplete();

  return isFragment ? document.documentElement.childNodes : document;
}

export async function renderToString(html, opts = defaults) {
  const dom = await renderToDom(html, opts);
  const isFragment = !html.includes('<html');

  if (isFragment) {
    return dom.map(n => stringify(n, opts)).join('');
  }

  return stringify(dom, opts);
}

export function stringify(node, opts) {
  let str = '';

  if (node.nodeName === '#document') {
    if (opts.doctype) {
      str += `${opts.doctype}\n`;
    }
    node = node.documentElement;
  }

  if (node.nodeName === '#text') {
    let text = node.textContent.replace(/\xA0/g, '&nbsp;');

    if (opts.minifyCss && node.parentNode.localName === 'style') {
      text = minimizeCss(text);
    }
    return text;
  }

  if (node.nodeName === '#comment') {
    return `<!--${node.textContent}-->`;
  }

  str += `<${node.localName}${(node.attributes || [])
    .map(a => ` ${a.name}${a.value === '' ? '' : `="${a.value}"`}`)
    .join('')}>`;

  if (node.shadowRoot) {
    str += `<template shadowrootmode="open">${node.shadowRoot.childNodes
      .map((n) => stringify(n, opts))
      .join('')}</template>`;
  }

  if (node.childNodes) {
    str += node.childNodes.map((n) => stringify(n, opts)).join('');
  }

  if(!nonClosingElements.has(node.localName)) {
    str += `</${node.localName}>`;
  }

  return str;
}

function minimizeCss(content) {
  content = content.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
  // now all comments, newlines and tabs have been removed
  content = content.replace(/ {2,}/g, ' ');
  // now there are no more than single adjacent spaces left
  content = content.replace(/ ([{:}]) /g, '$1');
  content = content.replace(/([;,]) /g, '$1');
  content = content.replace(/ !/g, '!');
  return content;
}
