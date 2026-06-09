# frozen_string_literal: true

require_relative "lib/wesc/version"

Gem::Specification.new do |spec|
  spec.name = "wesc"
  spec.version = Wesc::VERSION
  spec.authors = ["Wesley Luyten"]
  spec.email = ["me@wesleyluyten.com"]

  spec.summary = "We are the Superlative Components! — a streaming HTML/web-component bundler."
  spec.description = "Ruby bindings for wesc's streaming HTML/web-component bundler. " \
    "The Rust core runs in-process via a native extension — no subprocess, no WASM."
  spec.homepage = "https://github.com/luwes/wesc"
  spec.license = "MIT"

  # rb-sys requires a recent RubyGems to drive the cargo-based extension build.
  spec.required_ruby_version = ">= 3.0"
  spec.required_rubygems_version = ">= 3.3.11"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/luwes/wesc"
  spec.metadata["changelog_uri"] = "https://github.com/luwes/wesc/blob/main/CHANGELOG.md"
  # Tell RubyGems this gem ships a Rust (Cargo) extension built with rb-sys.
  # This is the crate's Cargo *package* name (see ext/wesc/Cargo.toml).
  spec.metadata["cargo_crate_name"] = "wesc-rb"

  spec.files = Dir[
    "lib/**/*.rb",
    "ext/**/*.rs",
    "ext/**/Cargo.toml",
    "ext/**/extconf.rb",
    "README.md",
    "LICENSE*"
  ]
  spec.require_paths = ["lib"]

  # The native extension is built from ext/wesc/extconf.rb (rb-sys + cargo).
  spec.extensions = ["ext/wesc/extconf.rb"]

  spec.add_dependency "rb_sys", "~> 0.9"

  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "rake-compiler", "~> 1.2"
  spec.add_development_dependency "minitest", "~> 5.0"
end
