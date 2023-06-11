import { parseHTML } from 'linkedom';

let {
  window,
  document,
  DOMParser,
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

function getComputedStyle() {
  return new CSSStyleDeclaration();
}

function requestAnimationFrame() {}
function cancelAnimationFrame() {}

Object.assign(globalThis, {
  window,
  document,
  DOMParser,
  HTMLTemplateElement,
  MutationObserver,
  localStorage,
  ResizeObserver,
  CSSStyleDeclaration,
  getComputedStyle,
  requestAnimationFrame,
  cancelAnimationFrame,
});
