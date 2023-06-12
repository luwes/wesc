import { parseHTML } from 'linkedom';

let {
  window,
  document,
  customElements,
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

function getComputedStyle() {
  return new CSSStyleDeclaration();
}

function requestAnimationFrame() {}
function cancelAnimationFrame() {}

Object.assign(globalThis, {
  window,
  document,
  customElements,
  DOMParser,
  HTMLElement,
  HTMLTemplateElement,
  MutationObserver,
  localStorage,
  ResizeObserver,
  CSSStyleDeclaration,
  getComputedStyle,
  requestAnimationFrame,
  cancelAnimationFrame,
});
