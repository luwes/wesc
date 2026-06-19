<?php

// Stubs for the `wesc` PHP extension (crates/wesc-php).
//
// These declarations exist purely so editors and static analysers understand
// the functions the native extension registers. They are never executed — the
// real implementations live in the compiled extension. Keep them in sync with
// `crates/wesc-php/src/lib.rs`.

/**
 * Build the entry points and return the HTML output plus the bundled assets.
 *
 * The result is an associative array with three keys:
 * - `html` (`string`): a binary-safe string with the exact output bytes, so you
 *   can `echo` it straight to the response.
 * - `css` (`?string`): the bundled CSS, or `null` when no CSS was produced.
 * - `js` (`?string`): the bundled JS, or `null` when no JS was produced.
 *
 * `$outcss`/`$outjs` still control file output: `null` skips the bundle, a
 * non-empty path bundles and writes the file (and returns it), and an empty
 * string bundles and returns the asset without writing it to disk.
 *
 * @param string[]    $input  Entry point file paths. The first entry is the host document.
 * @param string|null $outcss Optional path to write the bundled CSS file (`''` = in-memory only).
 * @param string|null $outjs  Optional path to write the bundled JS file (`''` = in-memory only).
 * @param bool        $minify Minify generated JS/CSS assets where supported.
 *
 * @return array{html: string, css: ?string, js: ?string} The HTML output and bundled assets.
 */
function wesc_build(
    array $input,
    ?string $outcss = null,
    ?string $outjs = null,
    bool $minify = false,
): array {}

/**
 * Stream the build to a callable, chunk by chunk, for low-memory output.
 *
 * The callable is invoked with each string chunk as it is produced, then once
 * with `null` to signal the end of the stream. If it throws, the exception
 * propagates out and the build stops.
 *
 * Only the HTML is streamed; the bundled CSS/JS are not returned here. Pass
 * `$outcss`/`$outjs` to write the bundles to disk, or use `wesc_build()` if you
 * need the assets back in memory.
 *
 * @param string[]                   $input    Entry point file paths. The first entry is the host document.
 * @param callable(?string): mixed   $callback Called with each chunk, then `null` at end-of-stream.
 * @param string|null                $outcss   Optional path to write the bundled CSS file.
 * @param string|null                $outjs    Optional path to write the bundled JS file.
 * @param bool                       $minify   Minify generated JS/CSS assets where supported.
 *
 * @return void
 */
function wesc_build_stream(
    array $input,
    callable $callback,
    ?string $outcss = null,
    ?string $outjs = null,
    bool $minify = false,
): void {}
