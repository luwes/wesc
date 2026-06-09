#!/usr/bin/env bash
# Build the native `wesc` Ruby extension and launch the streaming server with it
# on the load path. Mirrors examples/go-server's bootstrap: no manual setup
# needed.
#
#     ./examples/ruby-server/run.sh
#     open http://localhost:3000
#
# Prerequisites: the Rust toolchain, Ruby 3.0+ with dev headers, and a C
# toolchain + libclang for bindgen (Xcode Command Line Tools on macOS;
# build-essential + libclang-dev on Linux).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$here/../.." && pwd)"
rb_dir="$repo_root/crates/wesc-rb"

echo "building the wesc Ruby extension (bundle exec rake compile)…"
(
  cd "$rb_dir"
  bundle install --quiet
  bundle exec rake compile
)

# Put the gem's lib/ on the load path so `require "wesc"` finds the freshly
# compiled extension without installing the gem.
cd "$here"
exec ruby -I "$rb_dir/lib" server.rb
