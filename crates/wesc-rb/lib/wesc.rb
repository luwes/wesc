# frozen_string_literal: true

# WeSC — We are the Superlative Components.
#
# A streaming HTML / web-component bundler. This gem exposes the Rust core (via
# a native extension) so it can run in-process on a Ruby server — no subprocess,
# no WASM.
#
#   require "wesc"
#
#   # One-shot: returns the full HTML output as a (binary) String.
#   html = Wesc.build(["./index.html"], minify: true)
#
#   # Streaming: low memory, chunk by chunk. The block gets each chunk as a
#   # String, then `nil` once to signal end-of-stream.
#   Wesc.build_stream(["./index.html"]) { |chunk| ... }
#
# See https://github.com/luwes/wesc for the full documentation.

require_relative "wesc/version"
# The native extension (defines Wesc::Native). Built from crates/wesc-rb via
# rb-sys; see the gem's Rakefile (`rake compile`).
require_relative "wesc/wesc_rb"

module Wesc
  module_function

  # Build the entry points and return the full HTML output as a (binary) String.
  #
  #   html = Wesc.build(["./index.html"], minify: true)
  #
  # @param input [Array<String>] entry point paths; the first is the host
  #   document.
  # @param outcss [String, nil] optional path to write the bundled CSS file.
  # @param outjs [String, nil] optional path to write the bundled JS file.
  # @param minify [Boolean] minify generated JS/CSS assets. Defaults to false.
  # @return [String] the rendered HTML (ASCII-8BIT / binary encoding).
  def build(input, outcss: nil, outjs: nil, minify: false)
    Native.build(Array(input), outcss, outjs, minify ? true : false)
  end

  # Stream the build to a block, chunk by chunk, for low-memory output.
  #
  # The block is called with each chunk as a String, then once with `nil` to
  # signal the end of the stream. Raising from the block stops the build and the
  # exception propagates out of this method.
  #
  #   Wesc.build_stream(["./index.html"]) do |chunk|
  #     io.write(chunk) unless chunk.nil?
  #   end
  #
  # @param input [Array<String>] entry point paths; the first is the host
  #   document.
  # @param outcss [String, nil] optional path to write the bundled CSS file.
  # @param outjs [String, nil] optional path to write the bundled JS file.
  # @param minify [Boolean] minify generated JS/CSS assets. Defaults to false.
  # @yieldparam chunk [String, nil] each output chunk, then `nil` at end-of-stream.
  # @return [void]
  def build_stream(input, outcss: nil, outjs: nil, minify: false, &block)
    raise ArgumentError, "Wesc.build_stream requires a block" unless block

    Native.build_stream(Array(input), outcss, outjs, minify ? true : false, &block)
  end
end
