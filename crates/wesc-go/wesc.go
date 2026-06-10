// Package wesc provides Go bindings for wesc's streaming HTML/web-component
// bundler. The Rust core runs in-process via cgo — no subprocess, no WASM — so
// you can build and server-render web components straight from a Go backend
// (net/http, the standard library, your framework of choice, …).
//
// Two entry points, matching how a server typically consumes a build:
//
//   - [Build]       returns the full output as a []byte.
//   - [BuildStream] streams each chunk to a callback (low memory).
//
// Note: the underlying bundler keeps a process-global file/template cache, so
// builds should not run concurrently within a single process — serialize them
// (the streaming server example does exactly this).
//
// The package links the native library built from crates/wesc-go
// (cargo build -p wesc-go --release). See README.md for build details.
package wesc

/*
#cgo CFLAGS: -I${SRCDIR}/include
#cgo linux LDFLAGS: -L${SRCDIR}/../../target/release -Wl,-rpath,${SRCDIR}/../../target/release -lwesc_go -lm -ldl -lpthread
#cgo darwin LDFLAGS: -L${SRCDIR}/../../target/release -Wl,-rpath,${SRCDIR}/../../target/release -lwesc_go -framework CoreFoundation -framework Security

#include <stdlib.h>
#include "wesc.h"

// Forward declaration of the Go trampoline exported from export.go.
void wescGoChunk(uintptr_t user_data, uint8_t *chunk, size_t len);

// Calling wesc_build_stream from C (rather than passing the Go function pointer
// from Go) keeps cgo happy: Go code can't hand a Go func pointer to C, but C can
// reference the exported wescGoChunk symbol directly.
static char *wescBuildStreamBridge(const char *const *input,
                                   size_t input_len,
                                   const char *outcss,
                                   const char *outjs,
                                   int minify,
                                   uintptr_t user_data) {
    return wesc_build_stream(input, input_len, outcss, outjs,
                             minify, wescGoChunk, user_data);
}
*/
import "C"

import (
	"errors"
	"runtime/cgo"
	"unsafe"
)

// Options configures a build. It mirrors the CLI flags and the other language
// bindings.
type Options struct {
	// Input are the entry point file paths. The first entry is the host
	// document.
	Input []string
	// OutCSS, if non-empty, is the path to write the bundled CSS file.
	OutCSS string
	// OutJS, if non-empty, is the path to write the bundled JS file.
	OutJS string
	// Minify enables minification of generated JS/CSS assets where supported.
	Minify bool
}

// cArgs marshals Options into the C-facing argument list. The returned free
// function releases every C allocation and must be called when the build
// returns.
func (o Options) cArgs() (entries **C.char, n C.size_t, outcss, outjs *C.char, minify C.int, free func()) {
	cEntries := make([]*C.char, len(o.Input))
	for i, e := range o.Input {
		cEntries[i] = C.CString(e)
	}

	if o.OutCSS != "" {
		outcss = C.CString(o.OutCSS)
	}
	if o.OutJS != "" {
		outjs = C.CString(o.OutJS)
	}
	if o.Minify {
		minify = 1
	}

	free = func() {
		for _, p := range cEntries {
			C.free(unsafe.Pointer(p))
		}
		if outcss != nil {
			C.free(unsafe.Pointer(outcss))
		}
		if outjs != nil {
			C.free(unsafe.Pointer(outjs))
		}
	}

	if len(cEntries) > 0 {
		entries = (**C.char)(unsafe.Pointer(&cEntries[0]))
	}
	return entries, C.size_t(len(cEntries)), outcss, outjs, minify, free
}

// Build compiles the entry points and returns the full HTML output as bytes.
//
//	html, err := wesc.Build(wesc.Options{Input: []string{"./index.html"}, Minify: true})
func Build(opts Options) ([]byte, error) {
	entries, n, outcss, outjs, minify, free := opts.cArgs()
	defer free()

	buf := C.wesc_build(entries, n, outcss, outjs, minify)
	defer C.wesc_buffer_free(buf)

	if buf.error != nil {
		return nil, errors.New(C.GoString(buf.error))
	}
	if buf.len == 0 {
		return []byte{}, nil
	}
	return C.GoBytes(unsafe.Pointer(buf.data), C.int(buf.len)), nil
}

// streamState carries the user callback and the first error it produced across
// the cgo boundary via a runtime/cgo handle. The exported wescGoChunk callback
// (export.go) reads it back out by handle.
type streamState struct {
	fn  func(chunk []byte) error
	err error
}

// BuildStream compiles the entry points and invokes fn once per output chunk,
// for low-memory streaming. If fn returns an error, that error is returned and
// no further chunks are delivered.
//
//	err := wesc.BuildStream(wesc.Options{Input: []string{"./index.html"}}, func(chunk []byte) error {
//	    _, err := w.Write(chunk)
//	    return err
//	})
func BuildStream(opts Options, fn func(chunk []byte) error) error {
	entries, n, outcss, outjs, minify, free := opts.cArgs()
	defer free()

	state := &streamState{fn: fn}
	handle := cgo.NewHandle(state)
	defer handle.Delete()

	cerr := C.wescBuildStreamBridge(entries, n, outcss, outjs, minify, C.uintptr_t(handle))
	if cerr != nil {
		msg := C.GoString(cerr)
		C.wesc_string_free(cerr)
		// A callback error takes precedence over a generic build failure.
		if state.err != nil {
			return state.err
		}
		return errors.New(msg)
	}
	return state.err
}
