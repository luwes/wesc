import { createElement } from 'react';

export async function render(children) {

  const container = document.createElement('div');
  renderChildren(children, container);
  document.body.appendChild(container);

  await new Promise((resolve) => setTimeout(resolve, 30));
  container.remove();

  return children;
}

function renderChildren(children, domNode) {

  for (let node of children ?? []) {

    if (typeof node.type === 'string') {

      const dom = createDom(node.type, node.props);

      if (dom) {
        renderChildren(node.props.children, dom);
        domNode.appendChild(dom);

        if (node.type.includes('-')) {

          const originalConnected = dom.connectedCallback;
          dom.connectedCallback = function() {

            originalConnected?.call(dom);

            if (dom.shadowRoot) {

              // Some web components defer updates. Add a timeout larger than micro task.
              setTimeout(() => {

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

const reservedReactProperties = new Set([
  'children',
  'localName',
  'ref',
]);

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
