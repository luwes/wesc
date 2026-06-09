#!/usr/bin/env bash
# Build the native `wesc-go` library and launch the streaming server with it
# linked. Mirrors examples/php-server's bootstrap: no manual setup needed.
#
#     ./examples/go-server/run.sh
#     open http://localhost:3000
#
# Prerequisites: the Rust toolchain, Go 1.21+, and a C toolchain for cgo (Xcode
# Command Line Tools on macOS; GCC/Clang on Linux).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$here/../.." && pwd)"

echo "building the wesc-go native library (cargo build -p wesc-go --release)…"
cargo build -p wesc-go --release --manifest-path "$repo_root/Cargo.toml"

# The cgo directives in crates/wesc-go embed an rpath to target/release, so the
# server finds the shared library at runtime without extra env setup.
cd "$here"
exec go run .
