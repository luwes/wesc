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

  def test_build_returns_output
    in_scratch_dir do
      html = Wesc.build([fixture_entry("default-slot")])
      assert_kind_of String, html
      refute_empty html
    end
  end

  def test_build_stream_matches_build
    in_scratch_dir do
      one_shot = Wesc.build([fixture_entry("default-slot")])

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
