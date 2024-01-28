let cache = {};
let prerendering;

export function prerender(callback) {
  prerendering = [];
  resolve(callback());
  let result = Promise.all(prerendering);
  prerendering = null;
  return result;
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

    const asyncResult = import('./render.js')
      .then(({ render }) => render(children))
      .then(() => (cache[cacheId] = children));

    // If we're prerendering it means return sync now,
    // cache async result and return cache in 2nd render pass.
    if (prerendering) {
      prerendering.push(asyncResult);
      return props.children;
    }

    return asyncResult;
  }

  return props.children;
}

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

    if (typeof node === 'string') {
      result.push(node);

    } else if (typeof node.type === 'string') {
      let copy = { ...node, props: { ...node.props } };
      if (copy.props.children) copy.props.children = [];

      resolve(node.props.children, copy.props.children);
      result.push(copy);

    } else if (typeof node.type === 'function') {

      if (/^\s*class\s+/.test(node.type.toString())) {
        // Class component
        const comp = new node.type(node.props);
        const vnode = comp.render();
        resolve(vnode, result);
      } else {
        // Function component
        resolve(node.type(node.props), result);
      }

    } else if (typeof node.type === 'object' && typeof node.type.render === 'function') {
      resolve(node.type.render(node.props), result);
    }
  }

  return result;
}
