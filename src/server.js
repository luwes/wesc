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


const nonClosingElements = new Set(['area', 'base', 'br', 'col', 'command',
'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source',
'track', 'wbr']);

const defaults = {
  getRenderComplete: () => new Promise((resolve) => setTimeout(resolve, 0)),
  minifyCss: true,
  stripHtmlTag: false,
};

let renderCompleteQueue = new Set();

export async function renderToDom(html, opts = { ...defaults }) {
  html = String(html);

  // Remove doctype and save in the options object.
  html = html.replace(/(<!DOCTYPE[^>]*?>)\s*\n/i, (_, doctype) => {
    opts.doctype = opts.doctype ?? doctype;
    return '';
  });

  // Wrap with a html tag if it's missing to avoid issues
  // where Node.getRootNode() would point to itself.
  if (!html.includes('<html')) {
    html = `<html>${html}</html>`;
    opts.stripHtmlTag = true;
  }

  const renderComplete = opts.getRenderComplete();
  renderCompleteQueue.add(renderComplete);
  renderComplete.then(() => renderCompleteQueue.delete(renderComplete));

  // There is just 1 global document so we have to queue parsing requests
  // if many renderToDom calls are made at once.
  await Promise.all(renderCompleteQueue);

  document.documentElement.outerHTML = html;

  // Some custom elements render async to batch render calls so wait a
  // configurable amount of time before rendering the DOM.
  // Using a setTimeout of 0s by default to make it wait a macrotask so
  // microtasks will be finished by then.
  await renderComplete;

  return document;
}

export async function renderToString(html, opts = { ...defaults }) {
  const dom = await renderToDom(html, opts);
  return stringify(dom, opts);
}

// Process only custom element ancestors
const customElementOpenRegex = /<(\w+-\w+)([^>]*?)>/m;
const customElementsRegex = /<(\w+-\w+)([^>]*?)>([^]*?)<\/\1>/gm;

export function renderToStream(rs, opts) {
  const reader = rs.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let html = '';

      while (true) { // eslint-disable-line
        const { done, value } = await reader.read();

        // When no more data needs to be consumed, break the reading
        if (done) {
          controller.enqueue(encoder.encode(html));
          break;
        }

        const decoded = decoder.decode(value, { stream: true });
        html += decoded;

        if (customElementOpenRegex.test(html)) {

          let out = '';
          let start = 0;

          const matches = html.matchAll(customElementsRegex);

          for (const match of matches) {
            out += html.slice(start, match.index);
            out += await renderToString(match[0], opts);
            start = match.index + match[0].length;
          }

          if (out) {
            controller.enqueue(encoder.encode(out));
            html = html.slice(start);
          }

          continue;
        }

        // Enqueue the next data chunk into our target stream
        controller.enqueue(encoder.encode(html));
        html = '';
      }

      // Close the stream
      controller.close();
      reader.releaseLock();
    }
  });
}

export function stringify(node, opts) {
  let str = '';
  let skipNode = false;

  if (node.nodeName === '#document') {
    if (opts.doctype) {
      str += `${opts.doctype}\n`;
    }

    node = node.documentElement;
    skipNode = opts.stripHtmlTag;
  }

  if (!skipNode) {

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
  }

  if (node.shadowRoot) {
    str += `<template shadowrootmode="open">${node.shadowRoot.childNodes
      .map((n) => stringify(n, opts))
      .join('')}</template>`;
  }

  if (node.childNodes) {
    str += node.childNodes.map((n) => stringify(n, opts)).join('');
  }

  if(!skipNode && !nonClosingElements.has(node.localName)) {
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
