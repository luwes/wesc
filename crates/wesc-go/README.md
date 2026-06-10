# wesc (Go)

Go bindings for [`wesc`](https://github.com/luwes/wesc)'s streaming
HTML/web-component bundler. The Rust core runs in-process via cgo — no
subprocess, no WASM — so you can build and server-render web components straight
from a Go backend (`net/http`, the standard library, your framework of choice,
…).

Go can't link Rust the way napi-rs / PyO3 / ext-php-rs do for the Node, Python,
and PHP bindings, so this crate exposes a small C ABI
([`src/lib.rs`](./src/lib.rs), header in [`include/wesc.h`](./include/wesc.h))
that the Go package wraps with cgo.

## Usage

```go
package main

import (
	"fmt"

	wesc "github.com/luwes/wesc/crates/wesc-go"
)

func main() {
	// One-shot: returns the full HTML output as bytes.
	html, err := wesc.Build(wesc.Options{
		Input:  []string{"./index.html"},
		Minify: true,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("%d bytes\n", len(html))

	// Streaming: low memory, chunk by chunk. The callback receives each chunk;
	// the call returns once the stream ends. Returning an error stops it.
	err = wesc.BuildStream(wesc.Options{Input: []string{"./index.html"}}, func(chunk []byte) error {
		_, err := writer.Write(chunk)
		return err
	})
}
```

## API

- `func Build(opts Options) ([]byte, error)`
- `func BuildStream(opts Options, fn func(chunk []byte) error) error`

```go
type Options struct {
	Input  []string // First entry is the host document.
	OutCSS string   // Path to write the bundled CSS file (empty = skip).
	OutJS  string   // Path to write the bundled JS file (empty = skip).
	Minify bool     // Minify generated assets. Defaults to false.
}
```

| Field / argument | Type                       | Notes                                            |
| ---------------- | -------------------------- | ------------------------------------------------ |
| `Input`          | `[]string`                 | First entry is the host document.                |
| `OutCSS`         | `string`                   | Path to write the bundled CSS file. Empty skips. |
| `OutJS`          | `string`                   | Path to write the bundled JS file. Empty skips.  |
| `Minify`         | `bool`                     | Minify generated assets. Defaults to `false`.    |
| `fn`             | `func([]byte) error`       | `BuildStream` only. Called with each chunk; return an error to stop. |

`BuildStream` signals end-of-stream simply by returning — unlike the Python/PHP
bindings, there's no trailing `nil`/`None` chunk. If `fn` returns an error, that
error is returned and no further chunks are delivered.

> The bundler keeps a process-global file/template cache, so builds should not
> run concurrently within a single process — serialize them (the
> [`examples/go-server`](https://github.com/luwes/wesc/tree/main/examples/go-server)
> demo does exactly this).

## Building from source

The Go package links the native library built from this crate, so build the Rust
side first, then build/test/run the Go code:

```sh
# From the repo root. The library lands in target/release/.
cargo build -p wesc-go --release

# Then, from this directory:
cd crates/wesc-go
go test ./...
```

The cgo directives in [`wesc.go`](./wesc.go) point the linker at
`target/release` (via `-L` and an `-rpath`) so the resulting Go binary finds the
shared library at runtime without extra environment setup. Re-run
`cargo build -p wesc-go --release` after changing the Rust binding code.

The crate produces both a static archive and a shared object:

| Platform | Static            | Shared              |
| -------- | ----------------- | ------------------- |
| Linux    | `libwesc_go.a`    | `libwesc_go.so`     |
| macOS    | `libwesc_go.a`    | `libwesc_go.dylib`  |
| Windows  | `wesc_go.lib`     | `wesc_go.dll`       |

The Go package links the shared object by default. To link the static archive
instead (for a self-contained binary), adjust the `#cgo LDFLAGS` in `wesc.go`.

A working C toolchain is required (cgo): Xcode Command Line Tools on macOS, GCC
or Clang on Linux.

See the repo README's [Go section](../../README.md) for the broader project and
`crates/wesc-go/src/lib.rs` for the C ABI source.
