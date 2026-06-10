#![deny(clippy::all)]

//! Python bindings for `wesc`.
//!
//! Exposes the streaming web-component bundler to Python via [PyO3](https://pyo3.rs)
//! so it can run in-process on a Python server — no subprocess, no WASM.
//!
//! Two entry points, matching how a server typically consumes a build:
//! - [`build`]        — returns the full output as `bytes`. Releases the GIL
//!   while it runs, so other Python threads keep going (wrap it in
//!   `asyncio.to_thread` to await it from async code).
//! - [`build_stream`] — streams each chunk to a callback (low memory). The
//!   callback runs in Python, so this holds the GIL for its duration.
//!
//! Note: the underlying bundler keeps a process-global file/template cache, so
//! builds should not run concurrently within a single process — serialize them
//! (the streaming server example does exactly this).

use pyo3::prelude::*;
use pyo3::types::PyBytes;
use wesc::{build as wesc_build, BuildOptions as WescBuildOptions};

/// Build the entry points and return the full HTML output as `bytes`.
///
/// Releases the GIL while the (CPU-bound) build runs, so other Python threads
/// are free to make progress. From async code, run it on a worker thread:
///
/// ```python
/// html = await asyncio.to_thread(wesc.build, ["./index.html"], minify=True)
/// ```
///
/// Args:
///     input: Entry point file paths. The first entry is the host document.
///     outcss: Optional path to write the bundled CSS file.
///     outjs: Optional path to write the bundled JS file.
///     minify: Minify generated JS/CSS assets where supported. Defaults to ``False``.
#[pyfunction]
#[pyo3(signature = (input, *, outcss=None, outjs=None, minify=false))]
fn build<'py>(
    py: Python<'py>,
    input: Vec<String>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> Bound<'py, PyBytes> {
    let options = WescBuildOptions {
        input,
        outcss,
        outjs,
        cwd: None,
        minify,
    };

    let output = py.allow_threads(move || {
        let mut output: Vec<u8> = Vec::new();
        wesc_build(options, &mut |chunk: &[u8]| {
            output.extend_from_slice(chunk);
        });
        output
    });

    PyBytes::new(py, &output)
}

/// Stream the build to a callback, chunk by chunk, for low-memory output.
///
/// The callback is invoked as ``callback(chunk)`` — with each chunk as `bytes`
/// as it is produced, then once with ``None`` to signal the end of the stream.
///
/// ```python
/// def on_chunk(chunk):
///     if chunk is None:
///         response.close()
///     else:
///         response.write(chunk)
///
/// wesc.build_stream(["./index.html"], on_chunk)
/// ```
///
/// The callback runs in Python, so this function holds the GIL for its whole
/// duration. If the callback raises, the exception propagates out and the build
/// stops.
///
/// Args:
///     input: Entry point file paths. The first entry is the host document.
///     callback: Called with each `bytes` chunk, then ``None`` at end-of-stream.
///     outcss: Optional path to write the bundled CSS file.
///     outjs: Optional path to write the bundled JS file.
///     minify: Minify generated JS/CSS assets where supported. Defaults to ``False``.
#[pyfunction]
#[pyo3(signature = (input, callback, *, outcss=None, outjs=None, minify=false))]
fn build_stream<'py>(
    py: Python<'py>,
    input: Vec<String>,
    callback: Bound<'py, PyAny>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> PyResult<()> {
    let options = WescBuildOptions {
        input,
        outcss,
        outjs,
        cwd: None,
        minify,
    };

    // Remember the first callback error so we can stop calling and surface it.
    let mut pending_error: Option<PyErr> = None;
    wesc_build(options, &mut |chunk: &[u8]| {
        if pending_error.is_some() {
            return;
        }
        let bytes = PyBytes::new(py, chunk);
        if let Err(err) = callback.call1((bytes,)) {
            pending_error = Some(err);
        }
    });

    if let Some(err) = pending_error {
        return Err(err);
    }

    // Signal end-of-stream.
    callback.call1((py.None(),))?;
    Ok(())
}

/// The native `wesc._wesc` extension module. The pure-Python `wesc` package
/// re-exports these symbols (see `python/wesc/__init__.py`).
#[pymodule]
fn _wesc(module: &Bound<'_, PyModule>) -> PyResult<()> {
    module.add("__version__", env!("CARGO_PKG_VERSION"))?;
    module.add_function(wrap_pyfunction!(build, module)?)?;
    module.add_function(wrap_pyfunction!(build_stream, module)?)?;
    Ok(())
}
