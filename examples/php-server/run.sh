#!/usr/bin/env bash
# Build the native `wesc` PHP extension and launch the streaming server with it
# loaded. Mirrors examples/python-server's bootstrap: no manual setup needed.
#
#     ./examples/php-server/run.sh
#     open http://localhost:3000
#
# Prerequisites: the Rust toolchain, PHP 8.1+ with `php-config` on PATH, and
# libclang (Xcode CLT on macOS; `libclang-dev` on Debian/Ubuntu).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$here/../.." && pwd)"

echo "building the wesc PHP extension (cargo build -p wesc_php --release)…"
cargo build -p wesc_php --release --manifest-path "$repo_root/Cargo.toml"

# The shared object name is platform-specific.
case "$(uname -s)" in
  Darwin) ext="$repo_root/target/release/libwesc_php.dylib" ;;
  MINGW* | MSYS* | CYGWIN*) ext="$repo_root/target/release/wesc_php.dll" ;;
  *) ext="$repo_root/target/release/libwesc_php.so" ;;
esac

if [[ ! -f "$ext" ]]; then
  echo "error: built extension not found at $ext" >&2
  exit 1
fi

exec php -d extension="$ext" "$here/server.php"
