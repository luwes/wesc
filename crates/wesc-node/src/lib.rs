#![deny(clippy::all)]

//! Node.js native bindings for `wesc`.
//!
//! Exposes the streaming web-component bundler to JavaScript via napi-rs so it
//! can run in-process on a Node server — no subprocess, no WASM.
//!
//! Three entry points, matching how a server typically consumes a build:
//! - [`build`]       — synchronous, returns the HTML plus bundled CSS/JS.
//! - [`build_async`] — runs off the JS thread, returns `Promise<BuildResult>`.
//! - [`build_stream`]— streams each chunk to a callback (low memory).

use napi::bindgen_prelude::*;
use napi::threadsafe_function::{
    ErrorStrategy, ThreadsafeFunction, ThreadsafeFunctionCallMode,
};
use napi_derive::napi;
use wesc::{build as wesc_build, BuildOptions as WescBuildOptions};

/// Options for a wesc build. Mirrors the CLI flags.
#[napi(object)]
pub struct BuildOptions {
    /// Entry point file paths. The first entry is the host document.
    pub input: Vec<String>,
    /// Optional path to write the bundled CSS file.
    pub outcss: Option<String>,
    /// Optional path to write the bundled JS file.
    pub outjs: Option<String>,
    /// Working directory (like rolldown's cwd). Relative `input`/`outcss`/
    /// `outjs` resolve against it and the `.wesc` scratch dir is created under
    /// it. Defaults to the process working directory.
    pub cwd: Option<String>,
    /// Minify generated JS/CSS assets where supported. Defaults to `false`.
    pub minify: Option<bool>,
}

/// Result of a one-shot build: the full HTML output plus the bundled assets.
///
/// `css`/`js` are present whenever `outcss`/`outjs` were set (to a real path or
/// an empty string), letting you serve the bundles straight from memory. A real
/// path also writes the bundle to disk; an empty string bundles in-memory only.
#[napi(object)]
pub struct BuildResult {
    /// The full expanded HTML document.
    pub html: Buffer,
    /// The bundled CSS, when `outcss` was requested.
    pub css: Option<String>,
    /// The bundled JS, when `outjs` was requested.
    pub js: Option<String>,
}

impl From<BuildOptions> for WescBuildOptions {
    fn from(o: BuildOptions) -> Self {
        WescBuildOptions {
            input: o.input,
            source: None,
            outcss: o.outcss,
            outjs: o.outjs,
            cwd: o.cwd,
            minify: o.minify.unwrap_or(false),
        }
    }
}

/// Build the entry points and return the HTML output plus bundled assets.
///
/// The HTML is returned as a `Buffer`; `css`/`js` carry the bundled assets in
/// memory whenever `outcss`/`outjs` were requested.
///
/// Synchronous: blocks the calling thread until the build completes. Fine for
/// build scripts; prefer [`build_async`] on a request-serving hot path.
#[napi]
pub fn build(options: BuildOptions) -> BuildResult {
    let mut output: Vec<u8> = Vec::new();
    let assets = wesc_build(options.into(), &mut |chunk: &[u8]| {
        output.extend_from_slice(chunk);
    });
    BuildResult {
        html: output.into(),
        css: assets.css,
        js: assets.js,
    }
}

pub struct BuildTask {
    options: WescBuildOptions,
}

impl Task for BuildTask {
    type Output = (Vec<u8>, Option<String>, Option<String>);
    type JsValue = BuildResult;

    fn compute(&mut self) -> Result<Self::Output> {
        let mut output: Vec<u8> = Vec::new();
        let assets = wesc_build(self.options.clone(), &mut |chunk: &[u8]| {
            output.extend_from_slice(chunk);
        });
        Ok((output, assets.css, assets.js))
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        let (html, css, js) = output;
        Ok(BuildResult {
            html: html.into(),
            css,
            js,
        })
    }
}

/// Build off the JS thread and resolve with the HTML plus bundled assets.
///
/// Runs on libuv's thread pool, so it never blocks the event loop — the right
/// choice for a server that builds per request.
#[napi(ts_return_type = "Promise<BuildResult>")]
pub fn build_async(options: BuildOptions) -> AsyncTask<BuildTask> {
    AsyncTask::new(BuildTask {
        options: options.into(),
    })
}

/// Stream the build to a callback, chunk by chunk, for low-memory output.
///
/// The callback is invoked as `(chunk: Buffer | null)` — each chunk as it is
/// produced, then once with `null` to signal the end of the stream. Runs on a
/// background thread, so the event loop stays free while chunks flow.
///
/// ```js
/// build_stream({ input: ['./index.html'] }, (chunk) => {
///   if (chunk === null) res.end();
///   else res.write(chunk);
/// });
/// ```
#[napi]
pub fn build_stream(
    options: BuildOptions,
    callback: ThreadsafeFunction<Option<Buffer>, ErrorStrategy::Fatal>,
) {
    let opts: WescBuildOptions = options.into();
    std::thread::spawn(move || {
        wesc_build(opts, &mut |chunk: &[u8]| {
            callback.call(
                Some(chunk.to_vec().into()),
                ThreadsafeFunctionCallMode::Blocking,
            );
        });
        // Signal end-of-stream.
        callback.call(None, ThreadsafeFunctionCallMode::Blocking);
    });
}
