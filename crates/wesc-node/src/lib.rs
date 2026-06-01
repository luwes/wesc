#![deny(clippy::all)]

//! Node.js native bindings for `wesc`.
//!
//! Exposes the streaming web-component bundler to JavaScript via napi-rs so it
//! can run in-process on a Node server — no subprocess, no WASM.
//!
//! Three entry points, matching how a server typically consumes a build:
//! - [`build`]       — synchronous, returns the full output as a `Buffer`.
//! - [`build_async`] — runs off the JS thread, returns `Promise<Buffer>`.
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
    pub entry_points: Vec<String>,
    /// Optional path to write the bundled CSS file.
    pub outcss: Option<String>,
    /// Optional path to write the bundled JS file.
    pub outjs: Option<String>,
    /// Minify generated JS/CSS assets where supported. Defaults to `false`.
    pub minify: Option<bool>,
}

impl From<BuildOptions> for WescBuildOptions {
    fn from(o: BuildOptions) -> Self {
        WescBuildOptions {
            entry_points: o.entry_points,
            outcss: o.outcss,
            outjs: o.outjs,
            minify: o.minify.unwrap_or(false),
        }
    }
}

/// Build the entry points and return the full HTML output as a `Buffer`.
///
/// Synchronous: blocks the calling thread until the build completes. Fine for
/// build scripts; prefer [`build_async`] on a request-serving hot path.
#[napi]
pub fn build(options: BuildOptions) -> Buffer {
    let mut output: Vec<u8> = Vec::new();
    wesc_build(options.into(), &mut |chunk: &[u8]| {
        output.extend_from_slice(chunk);
    });
    output.into()
}

pub struct BuildTask {
    options: WescBuildOptions,
}

impl Task for BuildTask {
    type Output = Vec<u8>;
    type JsValue = Buffer;

    fn compute(&mut self) -> Result<Self::Output> {
        let mut output: Vec<u8> = Vec::new();
        wesc_build(self.options.clone(), &mut |chunk: &[u8]| {
            output.extend_from_slice(chunk);
        });
        Ok(output)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output.into())
    }
}

/// Build off the JS thread and resolve with the full output as a `Buffer`.
///
/// Runs on libuv's thread pool, so it never blocks the event loop — the right
/// choice for a server that builds per request.
#[napi(ts_return_type = "Promise<Buffer>")]
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
/// build_stream({ entryPoints: ['./index.html'] }, (chunk) => {
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
