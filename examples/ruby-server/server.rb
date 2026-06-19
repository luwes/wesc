# frozen_string_literal: true

# Ruby server that STREAMS the rendered HTML with the native wesc bindings.
#
#   ./examples/ruby-server/run.sh    # first run builds the extension (needs Rust)
#   open http://localhost:3000
#
# `run.sh` compiles the `wesc` Ruby extension and launches this server with it on
# the load path. Streaming matters for large documents: build_stream emits the
# HTML chunk by chunk straight to the socket, so the server never holds the whole
# page in memory and the browser starts rendering before the build finishes.
#
# What about JS and CSS? They're never part of the HTML stream. wesc always
# strips component <script>/<style> out of the markup and bundles them
# separately, so the streamed HTML stays lean no matter how big the page is. We
# build those bundles ONCE (they're identical for every request), cache them in
# memory, and serve them from their own routes. The source document references
# them — the <link> in <head> lets the browser fetch the CSS in parallel while
# the body is still streaming.
#
# WEBrick is concurrent, so it can serve /scripts.js and /styles.css while a page
# is still streaming. The per-request HTML builds are concurrency-safe — wesc's
# caches are thread-local and an HTML-only build writes nothing to disk — so they
# run in parallel with no lock.

require "webrick"
require "fileutils"
require "wesc"

EXAMPLE_DIR = __dir__
REPO_ROOT = File.expand_path("../..", EXAMPLE_DIR)
ENTRY = File.join(REPO_ROOT, "crates", "wesc", "tests", "fixtures", "todo-app", "index.html")

# Build artifacts (.wesc/ working dir, scripts.js, styles.css) go in ./dist.
# wesc always creates its .wesc/ mirror relative to the cwd, so we run from dist;
# the entry point is an absolute path, so the source tree stays untouched.
DIST_DIR = File.join(EXAMPLE_DIR, "dist")
FileUtils.mkdir_p(DIST_DIR)
Dir.chdir(DIST_DIR)

# Build once up front purely to produce the JS/CSS bundles, then cache them.
# `build` returns the bundles in memory (and outjs:/outcss: also write them to
# ./dist), so we cache them straight off the result — no read-back needed.
result = Wesc.build([ENTRY], outjs: "scripts.js", outcss: "styles.css")
JS = result.js
CSS = result.css

server = WEBrick::HTTPServer.new(Port: 3000, Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN))

# Serve the cached, in-memory bundles from their own routes.
server.mount_proc("/scripts.js") do |_req, res|
  res["Content-Type"] = "text/javascript; charset=utf-8"
  res.body = JS
end
server.mount_proc("/styles.css") do |_req, res|
  res["Content-Type"] = "text/css; charset=utf-8"
  res.body = CSS
end

# Stream the (lean) HTML for one request. No outcss/outjs here: we only want the
# markup. Setting `res.chunked = true` and handing WEBrick the read end of a pipe
# makes it send each chunk with chunked transfer encoding as soon as it lands.
server.mount_proc("/") do |req, res|
  if req.path != "/"
    res.status = 404
    next
  end

  res["Content-Type"] = "text/html; charset=utf-8"
  res.chunked = true

  reader, writer = IO.pipe
  res.body = reader

  # No lock: HTML-only builds keep wesc's caches thread-local and write nothing
  # to disk, so concurrent requests can't interfere.
  Thread.new do
    Wesc.build_stream([ENTRY]) do |chunk|
      writer.write(chunk) unless chunk.nil? || chunk.empty?
    end
  rescue IOError, Errno::EPIPE
    # The client went away mid-stream; nothing left to do.
  ensure
    writer.close
  end
end

trap("INT") { server.shutdown }

warn "streaming TodoMVC on http://localhost:3000"
server.start
