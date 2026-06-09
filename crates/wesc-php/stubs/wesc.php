<?php

// Stubs for the `wesc` PHP extension (crates/wesc-php).
//
// These declarations exist purely so editors and static analysers understand
// the functions the native extension registers. They are never executed — the
// real implementations live in the compiled extension. Keep them in sync with
// `crates/wesc-php/src/lib.rs`.

/**
 * Build the entry points and return the full HTML output as a string.
 *
 * The returned value is a binary-safe string containing the exact output bytes,
 * so you can `echo` it straight to the response.
 *
 * @param string[]    $entry_points Entry point file paths. The first entry is the host document.
 * @param string|null $outcss       Optional path to write the bundled CSS file.
 * @param string|null $outjs        Optional path to write the bundled JS file.
 * @param bool        $minify       Minify generated JS/CSS assets where supported.
 *
 * @return string The full HTML output.
 */
function wesc_build(
    array $entry_points,
    ?string $outcss = null,
    ?string $outjs = null,
    bool $minify = false,
): string {}

/**
 * Stream the build to a callable, chunk by chunk, for low-memory output.
 *
 * The callable is invoked with each string chunk as it is produced, then once
 * with `null` to signal the end of the stream. If it throws, the exception
 * propagates out and the build stops.
 *
 * @param string[]                   $entry_points Entry point file paths. The first entry is the host document.
 * @param callable(?string): mixed   $callback     Called with each chunk, then `null` at end-of-stream.
 * @param string|null                $outcss       Optional path to write the bundled CSS file.
 * @param string|null                $outjs        Optional path to write the bundled JS file.
 * @param bool                       $minify       Minify generated JS/CSS assets where supported.
 *
 * @return void
 */
function wesc_build_stream(
    array $entry_points,
    callable $callback,
    ?string $outcss = null,
    ?string $outjs = null,
    bool $minify = false,
): void {}
