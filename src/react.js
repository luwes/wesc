import { createElement } from 'react';

let cache = {};
let prerendering = false;

export function prerender(callback) {
  prerendering = true;
  resolve(callback());
  prerendering = false;

  return new Promise((resolve) => setTimeout(resolve, 30));
}

// Must go in a client component
// > Otherwise will error:
// > Attempted to call the default export of ... from the server but it's on the client.
// > It's not possible to invoke a client function from the server, it can only be rendered
// > as a Component or passed to props of a Client Component.

export function WeSC(props) {

  if (typeof window === 'undefined') {

    const children = resolve(props.children);
    const cacheId = props.id ?? JSON.stringify(children);

    if (cache[cacheId]) {
      return cache[cacheId];
    }

    const container = document.createElement('div');
    render(children, container);
    document.body.appendChild(container);

    const asyncResult = new Promise((resolve) => setTimeout(resolve, 30))
      .then(() => {
        container.remove();
        cache[cacheId] = children;
        return children;
      });

    // If we're prerendering it means return sync now,
    // cache async result and return cache in 2nd render pass.
    return prerendering ? props.children : asyncResult;
  }

  return props.children;
}

const reservedReactProperties = new Set([
  'children',
  'localName',
  'ref',
]);

/**
 * Resolve vdom tree and create node copies because the original objects are immutable in dev.
 *
 * @param  {Array|object}  children
 * @param  {Array}         result
 * @return {Array}
 */
function resolve(children, result = []) {
  children = [].concat(children ?? []);

  for (let node of children) {

    if (typeof node.type === 'string') {
      let copy = { ...node, props: { ...node.props } };
      if (copy.props.children) copy.props.children = [];

      resolve(node.props.children, copy.props.children);
      result.push(copy);

    } else if (typeof node.type === 'function') {
      resolve(node.type(node.props), result);

    } else if (typeof node.type === 'object' && typeof node.type.render === 'function') {
      resolve(node.type.render(node.props), result);
    }
  }

  return result;
}

function render(children, domNode) {

  for (let node of children ?? []) {

    if (typeof node.type === 'string') {

      const dom = createDom(node.type, node.props);

      if (dom) {
        render(node.props.children, dom);
        domNode.appendChild(dom);

        if (node.type.includes('-')) {

          const proto = dom.constructor.prototype;
          const originalConnected = proto.connectedCallback;

          proto.connectedCallback = function() {
            originalConnected?.call(dom);

            if (dom.shadowRoot) {

              for (let style of dom.shadowRoot.querySelectorAll('style')) {
                style.textContent = minimizeCss(style.textContent);
              }

              const templateShadowRoot = createElement('template', {
                shadowrootmode: dom.shadowRoot.mode ?? 'open',
                dangerouslySetInnerHTML: {
                  __html: dom.shadowRoot.innerHTML,
                },
              });

              if (node.props.children) {
                node.props.children.unshift(templateShadowRoot);
              } else {
                node.props.children = [templateShadowRoot];
              }

              // Some web components defer updates. Add a timeout larger than micro task.
              setTimeout(() => {
                Object.assign(node.props, attributesToProps(dom.attributes));

                if (typeof node.props.style === 'string') {
                  node.props.style = stringStyleToMap(node.props.style);
                }
              }, 0);
            }
          };
        }
      }
    }
  }
}

function createDom(type, props) {
  const dom = document.createElement(type);

  for (let name in props) {
    if (reservedReactProperties.has(name)) continue;

    let value = props[name];

    if (name === 'style') {
      if (typeof value == 'string') {
        dom.style.cssText = value;
      } else {
        if (value) {
          for (name in value) {
            setStyle(dom.style, name, value[name]);
          }
        }
      }
    } else if (name !== 'dangerouslySetInnerHTML') {
      if (
        name !== 'width' &&
        name !== 'height' &&
        name !== 'href' &&
        name !== 'list' &&
        name !== 'form' &&
        // Default value in browsers is `-1` and an empty string is
        // cast to `0` instead
        name !== 'tabIndex' &&
        name !== 'download' &&
        name !== 'rowSpan' &&
        name !== 'colSpan' &&
        name in dom
      ) {
        try {
          dom[name] = value == null ? '' : value;
          continue;
        } catch {
          //
        }
      }

      if (typeof value === 'function') {
        // never serialize functions as attribute values
      } else if (value != null && (value !== false || name[4] === '-')) {
        dom.setAttribute(name.toLowerCase(), value);
      } else {
        dom.removeAttribute(name);
      }
    }
  }

  return dom;
}

export const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

function setStyle(style, key, value) {
  if (key[0] === '-') {
    style.setProperty(key, value == null ? '' : value);
  } else if (value == null) {
    style[key] = '';
  } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
    style[key] = value;
  } else {
    style[key] = value + 'px';
  }
}

const attributesToProps = (attrs) => {
  const props = {};
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    props[attr.name] = attr.value;
  }
  return props;
};

function stringStyleToMap(style) {
  let styleMap = {};
  let properties = style.split(';');
  for (let prop of properties) {
    let [name, value] = prop.split(':');
    styleMap[name.trim()] = value.trim();
  }
  return styleMap;
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
