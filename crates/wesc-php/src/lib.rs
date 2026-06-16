#![deny(clippy::all)]
// `#[php_module]` uses the vectorcall calling convention on Windows, which is
// only available as a nightly feature there. No-op on other platforms.
#![cfg_attr(windows, feature(abi_vectorcall))]

//! PHP extension bindings for `wesc`.
//!
//! Exposes the streaming web-component bundler to PHP via [ext-php-rs](https://ext-php.rs)
//! so it can run in-process on a PHP server — no subprocess, no WASM.
//!
//! Two entry points, matching how a server typically consumes a build:
//! - [`wesc_build`]        — returns the full output as a (binary-safe) string.
//! - [`wesc_build_stream`] — streams each chunk to a callable (low memory). The
//!   callable runs in PHP, so the build runs synchronously on the calling thread.
//!
//! Note: the underlying bundler keeps a process-global file/template cache, so
//! builds should not run concurrently within a single process — serialize them
//! (the streaming server example does exactly this).

use ext_php_rs::binary::Binary;
use ext_php_rs::convert::IntoZval;
use ext_php_rs::error::Error;
use ext_php_rs::prelude::*;
use wesc::{build as wesc_build_core, BuildOptions as WescBuildOptions};

/// Assemble [`WescBuildOptions`] from the PHP-facing arguments.
fn make_options(
    input: Vec<String>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> WescBuildOptions {
    WescBuildOptions {
        input,
        code: None,
        outcss,
        outjs,
        cwd: None,
        minify,
    }
}

/// Build the entry points and return the full HTML output as a string.
///
/// The returned value is a binary-safe PHP string containing the exact output
/// bytes, so you can `echo` it straight to the response.
///
/// ```php
/// echo wesc_build(['./index.html'], minify: true);
/// ```
///
/// # Parameters
/// - `input`: Entry point file paths. The first entry is the host document.
/// - `outcss`: Optional path to write the bundled CSS file.
/// - `outjs`: Optional path to write the bundled JS file.
/// - `minify`: Minify generated JS/CSS assets where supported. Defaults to `false`.
#[php_function]
#[php(defaults(outcss = None, outjs = None, minify = false))]
pub fn wesc_build(
    input: Vec<String>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> Binary<u8> {
    let options = make_options(input, outcss, outjs, minify);

    let mut output: Vec<u8> = Vec::new();
    wesc_build_core(options, &mut |chunk: &[u8]| {
        output.extend_from_slice(chunk);
    });

    Binary::from(output)
}

/// Stream the build to a callable, chunk by chunk, for low-memory output.
///
/// The callable is invoked as `$callback($chunk)` — with each chunk as a string
/// as it is produced, then once with `null` to signal the end of the stream.
///
/// ```php
/// wesc_build_stream(['./index.html'], function ($chunk) {
///     if ($chunk === null) {
///         // end of stream
///     } else {
///         echo $chunk;
///         flush();
///     }
/// });
/// ```
///
/// The callable runs in PHP, so the build runs synchronously on the calling
/// thread. If it throws, the exception propagates out and the build stops.
///
/// # Parameters
/// - `input`: Entry point file paths. The first entry is the host document.
/// - `callback`: Called with each chunk string, then `null` at end-of-stream.
/// - `outcss`: Optional path to write the bundled CSS file.
/// - `outjs`: Optional path to write the bundled JS file.
/// - `minify`: Minify generated JS/CSS assets where supported. Defaults to `false`.
#[php_function]
#[php(defaults(outcss = None, outjs = None, minify = false))]
pub fn wesc_build_stream(
    input: Vec<String>,
    callback: ZendCallable,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> PhpResult<()> {
    let options = make_options(input, outcss, outjs, minify);

    // Remember the first callback failure so we can stop calling and surface it.
    // `ZendCallable::try_call` returns `Err`, taking ownership of any exception
    // the callback threw, so we re-throw that exact object (preserving its class
    // and message) rather than stringifying it.
    let mut pending_error: Option<PhpException> = None;
    wesc_build_core(options, &mut |chunk: &[u8]| {
        if pending_error.is_some() {
            return;
        }
        let zv = match Binary::from(chunk.to_vec()).into_zval(false) {
            Ok(zv) => zv,
            Err(err) => {
                pending_error = Some(err.into());
                return;
            }
        };
        if let Err(err) = callback.try_call(vec![&zv]) {
            pending_error = Some(to_php_exception(err));
        }
    });

    if let Some(err) = pending_error {
        return Err(err);
    }

    // Signal end-of-stream with a single `null` argument.
    let null = ().into_zval(false)?;
    callback.try_call(vec![&null])?;
    Ok(())
}

/// Turn a callback error into a [`PhpException`] that propagates correctly.
///
/// When the callback throws, the error carries the original exception object —
/// re-throw it as-is so PHP sees the real class and message. Other errors fall
/// back to their string form.
fn to_php_exception(err: Error) -> PhpException {
    match err {
        Error::Exception(obj) => match obj.into_zval(false) {
            Ok(zv) => PhpException::default(String::new()).with_object(zv),
            Err(err) => err.into(),
        },
        other => other.into(),
    }
}

/// Register the extension and its exported functions with PHP.
#[php_module]
pub fn module(module: ModuleBuilder) -> ModuleBuilder {
    module
        .function(wrap_function!(wesc_build))
        .function(wrap_function!(wesc_build_stream))
}
