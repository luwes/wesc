#![deny(clippy::all)]

//! Ruby bindings for `wesc`.
//!
//! Exposes the streaming web-component bundler to Ruby via [Magnus](https://github.com/matsadler/magnus)
//! (on top of [rb-sys](https://github.com/oxidize-rb/rb-sys)) so it can run
//! in-process on a Ruby server — no subprocess, no WASM.
//!
//! These are the *native* entry points. They live under the `Wesc::Native`
//! module and take plain positional arguments; the thin pure-Ruby wrapper in
//! `lib/wesc.rb` re-exposes them as `Wesc.build` / `Wesc.build_stream` with
//! idiomatic keyword arguments (mirroring the Python package's native module +
//! wrapper split).
//!
//! Two entry points, matching how a server typically consumes a build:
//! - [`build`]        — returns the full output as a (binary) `String`.
//! - [`build_stream`] — yields each chunk to the block (low memory). The block
//!   runs in Ruby, then receives `nil` once to signal end-of-stream.
//!
//! Magnus guards the FFI boundary: a Rust panic is caught and re-raised as a
//! Ruby exception rather than unwinding into the VM (which would be undefined
//! behavior), and a Ruby exception raised by the block surfaces back to the
//! caller as a normal `Result::Err`.
//!
//! Note: the underlying bundler keeps a process-global file/template cache, so
//! builds should not run concurrently within a single process — serialize them
//! (the streaming server example does exactly this).

use magnus::{function, prelude::*, Error, RString, Ruby, Value};
use wesc::{build as wesc_build, BuildOptions};

/// Assemble [`BuildOptions`] from the native (positional) arguments.
fn collect_options(
    input: Vec<String>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> BuildOptions {
    BuildOptions {
        input,
        code: None,
        outcss,
        outjs,
        cwd: None,
        minify,
    }
}

/// Build the entry points and return the full HTML output as a binary `String`.
///
/// Exposed to Ruby as `Wesc::Native.build`; see `Wesc.build` in `lib/wesc.rb`
/// for the public keyword-argument API.
fn build(
    ruby: &Ruby,
    input: Vec<String>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> RString {
    let options = collect_options(input, outcss, outjs, minify);

    let mut output: Vec<u8> = Vec::new();
    wesc_build(options, &mut |chunk: &[u8]| {
        output.extend_from_slice(chunk);
    });

    ruby.str_from_slice(&output)
}

/// Stream the build to the block, chunk by chunk, for low-memory output.
///
/// The block is called once per output chunk with the chunk as a binary
/// `String`, then once with `nil` to signal the end of the stream. If the block
/// raises, no further chunks are delivered and the exception propagates out.
///
/// Exposed to Ruby as `Wesc::Native.build_stream`; see `Wesc.build_stream` in
/// `lib/wesc.rb` for the public keyword-argument API.
fn build_stream(
    ruby: &Ruby,
    input: Vec<String>,
    outcss: Option<String>,
    outjs: Option<String>,
    minify: bool,
) -> Result<(), Error> {
    let block = ruby.block_proc()?;
    let options = collect_options(input, outcss, outjs, minify);

    // Remember the first block error so we can stop yielding and surface it.
    let mut pending_error: Option<Error> = None;
    wesc_build(options, &mut |chunk: &[u8]| {
        if pending_error.is_some() {
            return;
        }
        let bytes = ruby.str_from_slice(chunk);
        if let Err(err) = block.call::<_, Value>((bytes,)) {
            pending_error = Some(err);
        }
    });

    if let Some(err) = pending_error {
        return Err(err);
    }

    // Signal end-of-stream.
    block.call::<_, Value>((ruby.qnil(),))?;
    Ok(())
}

/// Initialize the native extension: define `Wesc::Native` and its module
/// functions. The pure-Ruby `Wesc` wrapper (lib/wesc.rb) builds on these.
#[magnus::init(name = "wesc_rb")]
fn init(ruby: &Ruby) -> Result<(), Error> {
    let module = ruby.define_module("Wesc")?;
    let native = module.define_module("Native")?;
    native.define_singleton_method("build", function!(build, 4))?;
    native.define_singleton_method("build_stream", function!(build_stream, 4))?;
    Ok(())
}
