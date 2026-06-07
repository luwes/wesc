"""WeSC — We are the Superlative Components.

A streaming HTML / web-component bundler. This package exposes the Rust core
(via native bindings) so it can run in-process on a Python server — no
subprocess, no WASM.

    import wesc

    # One-shot: returns the full HTML as bytes. Releases the GIL while it runs.
    html = wesc.build(["./index.html"], minify=True)

    # Streaming: low memory, chunk by chunk. The callback gets each `bytes`
    # chunk, then `None` once to signal end-of-stream.
    wesc.build_stream(["./index.html"], lambda chunk: ...)

See https://github.com/luwes/wesc for the full documentation.
"""

from ._wesc import __version__, build, build_stream

__all__ = ["build", "build_stream", "__version__"]
