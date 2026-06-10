# wesc (Python)

Python bindings for [`wesc`](https://github.com/luwes/wesc)'s streaming
HTML/web-component bundler. The Rust core runs in-process — no subprocess, no
WASM — so you can build and server-render web components straight from a Python
backend (Flask, FastAPI, Django, plain `http.server`, …).

```sh
pip install wesc
```

Prebuilt `abi3` wheels ship for macOS, Linux, and Windows and work on CPython
3.8+. No Rust toolchain needed to install.

## Usage

```python
import wesc

# One-shot: returns the full HTML output as `bytes`. Releases the GIL while it
# runs, so other threads keep working.
html = wesc.build(["./index.html"], minify=True)

# Streaming: low memory, chunk by chunk. The callback receives each `bytes`
# chunk, then `None` once to signal end-of-stream.
def on_chunk(chunk):
    if chunk is None:
        finish()
    else:
        write(chunk)

wesc.build_stream(["./index.html"], on_chunk)
```

### Async servers

`build` releases the GIL, so the idiomatic way to await it from `asyncio`
(FastAPI, etc.) is a worker thread:

```python
import asyncio, wesc

html = await asyncio.to_thread(wesc.build, ["./index.html"], minify=True)
```

## API

- `build(input, *, outcss=None, outjs=None, minify=False) -> bytes`
- `build_stream(input, callback, *, outcss=None, outjs=None, minify=False) -> None`

| Argument       | Type                                | Notes                                       |
| -------------- | ----------------------------------- | ------------------------------------------- |
| `input`        | `list[str]`                         | First entry is the host document.           |
| `callback`     | `Callable[[bytes \| None], object]` | `build_stream` only. `None` ends the stream.|
| `outcss`       | `str \| None`                       | Path to write the bundled CSS file.         |
| `outjs`        | `str \| None`                       | Path to write the bundled JS file.          |
| `minify`       | `bool`                              | Minify generated assets. Defaults to `False`.|

> The bundler keeps a process-global file/template cache, so builds should not
> run concurrently within a single process — serialize them (the
> [`examples/python-server`](https://github.com/luwes/wesc/tree/main/examples/python-server)
> demo does exactly this).

## Building from source

This is a maturin project. From this directory:

```sh
pip install maturin
maturin develop            # build + install into the active virtualenv
maturin build --release    # produce a wheel in target/wheels/
```

See the repo README's [Python section](../../README.md#python) for the broader
project and `crates/wesc-py/src/lib.rs` for the binding source.
