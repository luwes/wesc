#![deny(clippy::all)]

//! C-ABI bindings for `wesc`, consumed from Go via cgo.
//!
//! Go can't link Rust the way napi-rs / PyO3 / ext-php-rs do for Node, Python,
//! and PHP, so this crate instead exposes a tiny, stable `extern "C"` surface
//! that the Go package in this directory wraps with cgo. The Rust core runs
//! in-process — no subprocess, no WASM.
//!
//! Two entry points, matching how a server typically consumes a build:
//! - [`wesc_build`]        — returns the full output as a heap [`WescBuffer`].
//! - [`wesc_build_stream`] — streams each chunk to a C callback (low memory).
//!
//! Every build runs inside [`std::panic::catch_unwind`]: a Rust panic must never
//! unwind across the FFI boundary into Go (that is undefined behavior), so a
//! panic is captured and surfaced as an error string instead.
//!
//! Note: the underlying bundler keeps a process-global file/template cache, so
//! builds should not run concurrently within a single process — serialize them
//! (the streaming server example does exactly this).

use std::any::Any;
use std::ffi::{c_char, c_int, CStr, CString};
use std::mem::ManuallyDrop;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::ptr;
use std::slice;

use wesc::{build as wesc_build_core, BuildOptions};

/// The result of [`wesc_build`]: an owned byte buffer, or an error.
///
/// On success `error` is null and `data`/`len` hold the output (`cap` is the
/// backing allocation's capacity, needed to free it). On failure `data` is null,
/// `len`/`cap` are zero, and `error` is a heap C string describing the problem.
///
/// The caller must hand the value back to [`wesc_buffer_free`] exactly once to
/// release both the byte buffer and any error string.
#[repr(C)]
pub struct WescBuffer {
    data: *mut u8,
    len: usize,
    cap: usize,
    error: *mut c_char,
}

/// Callback invoked once per output chunk by [`wesc_build_stream`].
///
/// `user_data` is the opaque handle passed straight through from the call site
/// (Go threads a `runtime/cgo` handle through it). `chunk`/`len` borrow the
/// chunk bytes for the duration of the call only — copy them if you need to keep
/// them. The pointer is non-`const` only so the type matches the prototype cgo
/// generates for the exported Go callback; the bytes must not be mutated.
pub type WescChunkCallback = extern "C" fn(user_data: usize, chunk: *mut u8, len: usize);

/// Read a borrowed C string into an owned `String`, or `None` if it is null.
///
/// # Safety
/// `ptr` must be null or a valid pointer to a NUL-terminated C string.
unsafe fn opt_string(ptr: *const c_char) -> Option<String> {
    if ptr.is_null() {
        None
    } else {
        Some(CStr::from_ptr(ptr).to_string_lossy().into_owned())
    }
}

/// Assemble [`BuildOptions`] from the C-facing arguments.
///
/// # Safety
/// `entry_points` must point to `entry_points_len` valid C strings, and `outcss`
/// / `outjs` must each be null or a valid C string.
unsafe fn collect_options(
    entry_points: *const *const c_char,
    entry_points_len: usize,
    outcss: *const c_char,
    outjs: *const c_char,
    minify: c_int,
) -> BuildOptions {
    let entry_points = if entry_points.is_null() || entry_points_len == 0 {
        Vec::new()
    } else {
        slice::from_raw_parts(entry_points, entry_points_len)
            .iter()
            .map(|&p| CStr::from_ptr(p).to_string_lossy().into_owned())
            .collect()
    };

    BuildOptions {
        entry_points,
        outcss: opt_string(outcss),
        outjs: opt_string(outjs),
        cwd: None,
        minify: minify != 0,
    }
}

/// Allocate a C string from a Rust `String`, for returning errors to Go.
fn into_c_string(message: String) -> *mut c_char {
    // Replace any interior NULs so the conversion can't fail; the message is
    // diagnostic only.
    let sanitized = message.replace('\0', " ");
    match CString::new(sanitized) {
        Ok(s) => s.into_raw(),
        Err(_) => ptr::null_mut(),
    }
}

/// Extract a human-readable message from a caught panic payload.
fn panic_message(payload: Box<dyn Any + Send>) -> String {
    if let Some(s) = payload.downcast_ref::<&str>() {
        (*s).to_string()
    } else if let Some(s) = payload.downcast_ref::<String>() {
        s.clone()
    } else {
        "wesc build panicked".to_string()
    }
}

/// Build the entry points and return the full HTML output as a [`WescBuffer`].
///
/// The returned buffer owns its bytes; release it with [`wesc_buffer_free`].
///
/// # Safety
/// `entry_points` must point to `entry_points_len` valid NUL-terminated C
/// strings. `outcss` and `outjs` must each be null or a valid C string.
#[no_mangle]
pub unsafe extern "C" fn wesc_build(
    entry_points: *const *const c_char,
    entry_points_len: usize,
    outcss: *const c_char,
    outjs: *const c_char,
    minify: c_int,
) -> WescBuffer {
    let result = catch_unwind(AssertUnwindSafe(|| {
        let options = collect_options(entry_points, entry_points_len, outcss, outjs, minify);
        let mut output: Vec<u8> = Vec::new();
        wesc_build_core(options, &mut |chunk: &[u8]| {
            output.extend_from_slice(chunk);
        });
        output
    }));

    match result {
        Ok(output) => {
            let mut output = ManuallyDrop::new(output);
            WescBuffer {
                data: output.as_mut_ptr(),
                len: output.len(),
                cap: output.capacity(),
                error: ptr::null_mut(),
            }
        }
        Err(payload) => WescBuffer {
            data: ptr::null_mut(),
            len: 0,
            cap: 0,
            error: into_c_string(panic_message(payload)),
        },
    }
}

/// Stream the build to a callback, chunk by chunk, for low-memory output.
///
/// `callback` is invoked once per output chunk with the supplied `user_data`.
/// Returns null on success, or a heap error string (free it with
/// [`wesc_string_free`]) if the build panicked.
///
/// # Safety
/// `entry_points` must point to `entry_points_len` valid NUL-terminated C
/// strings. `outcss` and `outjs` must each be null or a valid C string.
/// `callback` must be a valid function pointer for the whole call.
#[no_mangle]
pub unsafe extern "C" fn wesc_build_stream(
    entry_points: *const *const c_char,
    entry_points_len: usize,
    outcss: *const c_char,
    outjs: *const c_char,
    minify: c_int,
    callback: WescChunkCallback,
    user_data: usize,
) -> *mut c_char {
    let result = catch_unwind(AssertUnwindSafe(|| {
        let options = collect_options(entry_points, entry_points_len, outcss, outjs, minify);
        wesc_build_core(options, &mut |chunk: &[u8]| {
            callback(user_data, chunk.as_ptr() as *mut u8, chunk.len());
        });
    }));

    match result {
        Ok(()) => ptr::null_mut(),
        Err(payload) => into_c_string(panic_message(payload)),
    }
}

/// Release a [`WescBuffer`] returned by [`wesc_build`].
///
/// Frees both the byte buffer and any error string. Safe to call on a
/// zero-initialized buffer.
///
/// # Safety
/// `buffer` must be a value previously returned by [`wesc_build`], and must not
/// be freed more than once.
#[no_mangle]
pub unsafe extern "C" fn wesc_buffer_free(buffer: WescBuffer) {
    if !buffer.data.is_null() {
        drop(Vec::from_raw_parts(buffer.data, buffer.len, buffer.cap));
    }
    if !buffer.error.is_null() {
        drop(CString::from_raw(buffer.error));
    }
}

/// Release a string returned by [`wesc_build_stream`].
///
/// # Safety
/// `s` must be null or a string previously returned by [`wesc_build_stream`],
/// and must not be freed more than once.
#[no_mangle]
pub unsafe extern "C" fn wesc_string_free(s: *mut c_char) {
    if !s.is_null() {
        drop(CString::from_raw(s));
    }
}
