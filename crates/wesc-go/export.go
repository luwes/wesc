package wesc

// This file holds the exported Go callback that the native bundler invokes for
// each output chunk. cgo requires that a file using //export keep its preamble
// to declarations only (no C definitions) — the streaming bridge that *calls*
// this trampoline therefore lives in wesc.go instead.

/*
#include <stddef.h>
#include <stdint.h>
*/
import "C"

import (
	"fmt"
	"runtime/cgo"
	"unsafe"
)

//export wescGoChunk
func wescGoChunk(userData C.uintptr_t, chunk *C.uint8_t, length C.size_t) {
	state := cgo.Handle(userData).Value().(*streamState)
	// Once the callback has errored (or panicked), ignore the remaining chunks;
	// the build keeps running in Rust but we stop doing work. This mirrors the
	// "first error wins" behavior of the Python and PHP bindings.
	if state.err != nil {
		return
	}

	// A panic must not unwind across the FFI boundary into Rust, so recover it
	// and surface it as the stream error.
	defer func() {
		if r := recover(); r != nil {
			state.err = fmt.Errorf("wesc: stream callback panicked: %v", r)
		}
	}()

	var b []byte
	if length > 0 {
		b = C.GoBytes(unsafe.Pointer(chunk), C.int(length))
	}
	state.err = state.fn(b)
}
