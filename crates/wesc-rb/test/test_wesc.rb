# frozen_string_literal: true

require "minitest/autorun"
require "tmpdir"
require "wesc"

class TestWesc < Minitest::Test
  # Bundler test fixtures live in the core crate.
  FIXTURES = File.expand_path("../../wesc/tests/fixtures", __dir__)

  def fixture_entry(name)
    File.join(FIXTURES, name, "index.html")
  end

  # Run the block from a scratch dir so wesc's `.wesc/` working dir doesn't
  # litter the repo; the entry point is absolute, so the source tree is safe.
  def in_scratch_dir
    Dir.mktmpdir do |dir|
      Dir.chdir(dir) { yield }
    end
  end

  def test_build_returns_result
    in_scratch_dir do
      result = Wesc.build([fixture_entry("default-slot")])
      assert_kind_of Wesc::Result, result
      assert_kind_of String, result.html
      refute_empty result.html
      # No outcss/outjs requested, so the bundles are absent.
      assert_nil result.css
      assert_nil result.js
    end
  end

  def test_build_returns_in_memory_assets
    in_scratch_dir do
      # Empty-string outcss/outjs request the bundles in memory only (no write).
      result = Wesc.build([fixture_entry("default-slot")], outcss: "", outjs: "")
      assert_kind_of String, result.css
      assert_kind_of String, result.js
    end
  end

  def test_build_stream_matches_build
    in_scratch_dir do
      one_shot = Wesc.build([fixture_entry("default-slot")]).html

      streamed = +"".b
      Wesc.build_stream([fixture_entry("default-slot")]) do |chunk|
        streamed << chunk unless chunk.nil?
      end

      assert_equal one_shot, streamed
    end
  end

  def test_build_stream_propagates_block_error
    in_scratch_dir do
      error = assert_raises(RuntimeError) do
        Wesc.build_stream([fixture_entry("default-slot")]) do |chunk|
          raise "boom" unless chunk.nil?
        end
      end
      assert_equal "boom", error.message
    end
  end

  def test_build_stream_requires_a_block
    assert_raises(ArgumentError) do
      Wesc.build_stream([fixture_entry("default-slot")])
    end
  end
end
