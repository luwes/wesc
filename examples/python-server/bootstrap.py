"""Make a bare `python <script>.py` work without manual setup.

`ensure_wesc()` guarantees that `import wesc` succeeds. On first run it creates a
local `.venv` next to this file, builds the native `wesc` module into it with
maturin (needs the Rust toolchain), then re-launches the entry script with that
interpreter. It's a no-op once `wesc` is importable, so later runs start straight
away.

Usage (at the very top of the entry script, before importing wesc):

    from bootstrap import ensure_wesc

    ensure_wesc()

    import wesc
"""

import importlib.util
import os
import subprocess
import sys
from pathlib import Path

# This file lives in examples/<name>/; the repo root is two levels up.
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
VENV = HERE / ".venv"
CARGO = REPO / "crates" / "wesc-py" / "Cargo.toml"


def ensure_wesc() -> None:
    """Guarantee `import wesc` succeeds, building it on first run."""
    if importlib.util.find_spec("wesc") is not None:
        return
    if Path(sys.prefix).resolve() == VENV.resolve():
        # Already inside our own .venv but wesc still isn't importable.
        raise ModuleNotFoundError("wesc: the build into .venv appears broken")

    venv_py = VENV / ("Scripts" if os.name == "nt" else "bin") / "python"

    def venv_has_wesc() -> bool:
        return (
            venv_py.exists()
            and subprocess.run(
                [str(venv_py), "-c", "import wesc"], capture_output=True
            ).returncode
            == 0
        )

    if not venv_has_wesc():
        if not venv_py.exists():
            print("First run: creating .venv …", flush=True)
            subprocess.run([sys.executable, "-m", "venv", str(VENV)], check=True)
        print(
            "Building the native wesc module (needs Rust; ~30s first time) …",
            flush=True,
        )
        # maturin installs into the virtualenv it *detects* (VIRTUAL_ENV, else a
        # .venv in a parent dir), not necessarily the interpreter we invoke it
        # with — so point it explicitly at our venv.
        env = {**os.environ, "VIRTUAL_ENV": str(VENV)}
        env.pop("CONDA_PREFIX", None)
        subprocess.run(
            [str(venv_py), "-m", "pip", "install", "-q", "-U", "pip", "maturin"],
            check=True,
        )
        subprocess.run(
            [str(venv_py), "-m", "maturin", "develop", "-m", str(CARGO)],
            check=True,
            env=env,
        )

    # Re-launch the original entry script with the venv interpreter.
    main = Path(sys.argv[0]).resolve()
    try:
        code = subprocess.run([str(venv_py), str(main), *sys.argv[1:]]).returncode
    except KeyboardInterrupt:
        code = 0
    raise SystemExit(code)
