export interface RenderOptions {
  /**
   * Returns a promise that resolves once the custom elements have finished
   * their (possibly async) rendering. Defaults to waiting a macrotask.
   */
  getRenderComplete?: () => Promise<void>;
  /** Minify the CSS found inside `<style>` elements. Defaults to `true`. */
  minifyCss?: boolean;
  /** Strip the wrapping `<html>` tag that may be added internally. */
  stripHtmlTag?: boolean;
  /** The doctype to prepend when stringifying a document. */
  doctype?: string;
}

/**
 * Install the linkedom-backed DOM globals (document, customElements, …) onto
 * `globalThis` so web components can be defined and rendered on the server.
 * Runs automatically when this module is imported in a non-browser environment.
 */
export function shim(): void;

/** Restore the globals that were replaced by {@link shim}. */
export function unshim(): void;

/**
 * Parse `html` into the shared linkedom document, upgrading any registered
 * custom elements, and resolve with the document once rendering completes.
 */
export function renderToDom(html: string, opts?: RenderOptions): Promise<unknown>;

/** Render `html` and serialize it back to a string, including shadow DOM. */
export function renderToString(html: string, opts?: RenderOptions): Promise<string>;

/**
 * Transform a stream of HTML, server-rendering any custom elements it contains
 * into declarative shadow DOM as the chunks pass through.
 */
export function renderToStream(
  rs: ReadableStream<Uint8Array>,
  opts?: RenderOptions,
): ReadableStream<Uint8Array>;

/** Serialize a DOM node (and its shadow roots) to an HTML string. */
export function stringify(node: unknown, opts?: RenderOptions): string;
