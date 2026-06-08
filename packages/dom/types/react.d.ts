import type { ReactNode } from 'react';

/**
 * Render `callback` once to collect every `<WeSC>` subtree, await their
 * server-side rendering, and resolve when all of them are done. Use this to
 * prerender web components before serializing the React tree.
 */
export function prerender(callback: () => unknown): Promise<unknown[]>;

export interface WeSCProps {
  children?: ReactNode;
  /** Cache key for the rendered subtree. Defaults to the serialized children. */
  id?: string;
}

/**
 * Wrapper component that server-renders its web component children into
 * declarative shadow DOM. On the client it renders its children unchanged.
 */
export function WeSC(props: WeSCProps): ReactNode;
