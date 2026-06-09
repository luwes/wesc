# wesc (Ruby)

Ruby bindings for [`wesc`](https://github.com/luwes/wesc)'s streaming
HTML/web-component bundler. The Rust core runs in-process via a native extension
— no subprocess, no WASM — so you can build and server-render web components
straight from a Ruby backend (Rack, Sinatra, Rails, plain WEBrick, …).

The extension is built with [Magnus](https://github.com/matsadler/magnus) on top
of [rb-sys](https://github.com/oxidize-rb/rb-sys), the same way the Node, Python,
and PHP bindings use napi-rs / PyO3 / ext-php-rs. The native module
(`Wesc::Native`, [`ext/wesc/src/lib.rs`](./ext/wesc/src/lib.rs)) is wrapped by a thin pure-Ruby
layer ([`lib/wesc.rb`](./lib/wesc.rb)) that exposes the idiomatic
keyword-argument API.

```sh
gem install wesc
```

## Usage

```ruby
require "wesc"

# One-shot: returns the full HTML output as a (binary) String.
html = Wesc.build(["./index.html"], minify: true)
puts "#{html.bytesize} bytes"

# Streaming: low memory, chunk by chunk. The block receives each chunk as a
# String, then `nil` once to signal end-of-stream. Raising from the block
# stops the build.
Wesc.build_stream(["./index.html"]) do |chunk|
  io.write(chunk) unless chunk.nil?
end
```

## API

- `Wesc.build(entry_points, outcss: nil, outjs: nil, minify: false) -> String`
- `Wesc.build_stream(entry_points, outcss: nil, outjs: nil, minify: false) { |chunk| ... } -> nil`

| Argument       | Type                  | Notes                                              |
| -------------- | --------------------- | -------------------------------------------------- |
| `entry_points` | `Array<String>`       | First entry is the host document.                  |
| `outcss`       | `String, nil`         | Path to write the bundled CSS file. `nil` skips.   |
| `outjs`        | `String, nil`         | Path to write the bundled JS file. `nil` skips.    |
| `minify`       | `Boolean`             | Minify generated assets. Defaults to `false`.      |
| `&block`       | `{ \|String, nil\| }` | `build_stream` only. Gets each chunk, then `nil`.  |

`build` returns a binary (`ASCII-8BIT`) `String`. `build_stream` yields each
chunk as a binary `String`, then yields `nil` once to mark end-of-stream — the
same trailing-`nil`/`None` convention as the Python and PHP bindings.

> The bundler keeps a process-global file/template cache, so builds should not
> run concurrently within a single process — serialize them (the
> [`examples/ruby-server`](https://github.com/luwes/wesc/tree/main/examples/ruby-server)
> demo does exactly this with a `Mutex`).

## Building from source

This is an rb-sys gem. From this directory:

```sh
bundle install
bundle exec rake compile    # build the native extension into lib/wesc/
bundle exec rake test       # compile (if needed) + run the test suite
bundle exec rake build      # package the gem into pkg/
```

`rake compile` runs `cargo` under the hood, so the prerequisites are:

- The [Rust toolchain](https://rustup.rs) (the repo pins a version via
  `rust-toolchain.toml`).
- Ruby 3.0+ with development headers.
- A C toolchain and `libclang` for bindgen (Xcode Command Line Tools on macOS;
  `build-essential` + `libclang-dev` on Linux).

`rake compile` is the canonical build: rb-sys drives `cargo` and passes the
Ruby-specific linker flags (on macOS, `-Wl,-undefined,dynamic_lookup`) a loadable
extension needs, since the Ruby symbols are resolved by the host process at
load time.

The crate (at [`ext/wesc`](./ext/wesc)) is also a member of the repo's Cargo
workspace, so `cargo check -p wesc-rb` typechecks it against the active Ruby on
your `PATH`. It's excluded from the workspace's `default-members`, so a bare
`cargo build` at the root won't try to build it (it needs Ruby headers +
libclang, and a plain `cargo build -p wesc-rb` won't *link* standalone — that's
what `rake compile` is for).

> Tip: with [rbenv](https://github.com/rbenv/rbenv) the bundled
> [`.ruby-version`](./.ruby-version) selects a Ruby 3 toolchain automatically in
> this directory.

See the repo README's [Ruby section](../../README.md) for the broader project
and `crates/wesc-rb/ext/wesc/src/lib.rs` for the binding source.
