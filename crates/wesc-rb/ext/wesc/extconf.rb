# frozen_string_literal: true

# Build the native extension with rb-sys (cargo under the hood).
#
# The crate's Cargo.toml lives alongside this file (ext/wesc/), so rb-sys builds
# the local `wesc_rb` cdylib and installs it as `wesc/wesc_rb.{so,bundle}` —
# which lib/wesc.rb loads with `require_relative "wesc/wesc_rb"`.
require "mkmf"
require "rb_sys/mkmf"

create_rust_makefile("wesc/wesc_rb")
