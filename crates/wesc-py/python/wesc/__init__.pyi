from typing import Callable, List, Optional

__version__: str

def build(
    input: List[str],
    *,
    outcss: Optional[str] = ...,
    outjs: Optional[str] = ...,
    minify: bool = ...,
) -> bytes:
    """Build the entry points and return the full HTML output as ``bytes``.

    Releases the GIL while the build runs. To await it from async code, run it
    on a worker thread: ``await asyncio.to_thread(wesc.build, ["./index.html"])``.

    Args:
        input: Entry point file paths. The first entry is the host document.
        outcss: Optional path to write the bundled CSS file.
        outjs: Optional path to write the bundled JS file.
        minify: Minify generated JS/CSS assets where supported. Defaults to ``False``.
    """
    ...

def build_stream(
    input: List[str],
    callback: Callable[[Optional[bytes]], object],
    *,
    outcss: Optional[str] = ...,
    outjs: Optional[str] = ...,
    minify: bool = ...,
) -> None:
    """Stream the build to ``callback``, chunk by chunk, for low-memory output.

    ``callback`` is invoked with each ``bytes`` chunk as it is produced, then
    once with ``None`` to signal end-of-stream. If it raises, the exception
    propagates out and the build stops.

    Args:
        input: Entry point file paths. The first entry is the host document.
        callback: Called with each ``bytes`` chunk, then ``None`` at end-of-stream.
        outcss: Optional path to write the bundled CSS file.
        outjs: Optional path to write the bundled JS file.
        minify: Minify generated JS/CSS assets where supported. Defaults to ``False``.
    """
    ...
