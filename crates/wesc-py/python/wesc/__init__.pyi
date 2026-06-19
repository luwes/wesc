from typing import Callable, List, Optional

__version__: str

class BuildResult:
    """The result of a one-shot :func:`build`.

    Attributes:
        html: The full HTML output as ``bytes``.
        css: The bundled CSS as ``str``, or ``None`` if there is nothing to bundle.
        js: The bundled JS as ``str``, or ``None`` if there is nothing to bundle.
    """

    html: bytes
    css: Optional[str]
    js: Optional[str]

def build(
    input: List[str],
    *,
    outcss: Optional[str] = ...,
    outjs: Optional[str] = ...,
    minify: bool = ...,
) -> BuildResult:
    """Build the entry points and return a :class:`BuildResult`.

    The result's ``html`` holds the full HTML output as ``bytes``; ``css`` and
    ``js`` hold the bundled assets as ``str`` (or ``None`` when there is nothing
    to bundle). Passing ``outcss``/``outjs`` additionally writes those bundles to
    disk; an empty string (``""``) bundles in memory only (no file written).

    Releases the GIL while the build runs. To await it from async code, run it
    on a worker thread: ``await asyncio.to_thread(wesc.build, ["./index.html"])``.

    Args:
        input: Entry point file paths. The first entry is the host document.
        outcss: Optional path to write the bundled CSS file (``""`` = in-memory only).
        outjs: Optional path to write the bundled JS file (``""`` = in-memory only).
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
