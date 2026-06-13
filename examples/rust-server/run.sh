#!/usr/bin/env bash
# Build and launch the streaming Rust server. Unlike the other server examples,
# which call wesc through a language binding, this one depends on the `wesc` core
# crate directly, so all it needs is the Rust toolchain.
#
#     ./examples/rust-server/run.sh
#     open http://localhost:3000
#
# Prerequisite: the Rust toolchain (https://rustup.rs).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$here/../.." && pwd)"

echo "building and launching the Rust server (cargo run -p rust-server --release)…"
exec cargo run -p rust-server --release --manifest-path "$repo_root/Cargo.toml"
