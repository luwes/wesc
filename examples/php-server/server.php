<?php

declare(strict_types=1);

/**
 * PHP server that STREAMS the rendered HTML with the native wesc extension.
 *
 *     ./examples/php-server/run.sh    # first run builds wesc (needs Rust + PHP headers)
 *     open http://localhost:3000
 *
 * `run.sh` builds the `wesc` extension and launches this script with it loaded
 * (`php -d extension=...`). You can also load it yourself; this script aborts
 * early with instructions if the extension isn't present.
 *
 * Streaming matters for large documents: wesc_build_stream emits the HTML chunk
 * by chunk straight to the socket, so the server never holds the whole page in
 * memory and the browser starts rendering before the build finishes.
 *
 * What about JS and CSS? They're never part of the HTML stream. wesc always
 * strips component <script>/<style> out of the markup and bundles them
 * separately, so the streamed HTML stays lean no matter how big the page is. We
 * build those bundles ONCE (they're identical for every request), cache them in
 * memory, and serve them from their own routes. The source document references
 * them — the <link> in <head> lets the browser fetch the CSS in parallel while
 * the body is still streaming.
 *
 * This uses a plain blocking accept loop, so it serves one connection at a time
 * regardless of the bundler — wesc's HTML builds are themselves concurrency-safe
 * (thread-local caches, no shared scratch files), so a threaded server would not
 * need a lock either; the cached assets are served straight from memory.
 */

if (!extension_loaded('wesc_php')) {
    fwrite(STDERR, <<<MSG
        The native `wesc` extension is not loaded.

        Run this example via the bootstrap script, which builds and loads it:

            ./examples/php-server/run.sh

        Or build it yourself and load the shared object explicitly:

            cargo build -p wesc_php --release
            php -d extension=\$PWD/target/release/libwesc_php.so \\
                examples/php-server/server.php

        MSG);
    exit(1);
}

$repoRoot = dirname(__DIR__, 2);
$srcDir = $repoRoot . '/crates/wesc/tests/fixtures/todo-app';
$entry = $srcDir . '/index.html';

// wesc always creates its .wesc/ working-dir mirror relative to the cwd, so we
// run from ./dist; the entry point is an absolute path, so the source tree stays
// untouched. The JS/CSS bundles are kept in memory (see below), not written here.
$distDir = __DIR__ . '/dist';
if (!is_dir($distDir)) {
    mkdir($distDir, 0o777, true);
}
chdir($distDir);

// Build once up front purely to produce the JS/CSS bundles, then cache them.
// Empty-string outcss/outjs ask wesc to bundle the assets and hand them back in
// memory (in the result array) without writing any files to disk.
$result = wesc_build([$entry], outcss: '', outjs: '');
$js = $result['js'] ?? '';
$css = $result['css'] ?? '';

$server = stream_socket_server('tcp://0.0.0.0:3000', $errno, $errstr);
if ($server === false) {
    fwrite(STDERR, "Could not bind to port 3000: $errstr ($errno)\n");
    exit(1);
}

printf("bundles cached — js %d B, css %d B\n", strlen($js), strlen($css));
echo "streaming TodoMVC on http://localhost:3000\n";

while (true) {
    $conn = @stream_socket_accept($server, -1);
    if ($conn === false) {
        continue;
    }
    handle($conn, $entry, $js, $css);
    fclose($conn);
}

/**
 * Handle a single HTTP request on the given connection.
 *
 * @param resource $conn
 */
function handle($conn, string $entry, string $js, string $css): void
{
    // The request line is enough to route; read it and drop the rest.
    $requestLine = fgets($conn);
    if ($requestLine === false) {
        return;
    }
    $path = explode(' ', trim($requestLine))[1] ?? '/';

    if ($path === '/scripts.js') {
        send($conn, $js, 'text/javascript; charset=utf-8');
        return;
    }
    if ($path === '/styles.css') {
        send($conn, $css, 'text/css; charset=utf-8');
        return;
    }

    // Stream the HTML with chunked transfer encoding. No outjs/outcss here: we
    // only want the (lean) markup. wesc_build_stream calls back with each chunk,
    // then null at end-of-stream.
    $head = "HTTP/1.1 200 OK\r\n"
        . "Content-Type: text/html; charset=utf-8\r\n"
        . "Transfer-Encoding: chunked\r\n"
        . "Connection: close\r\n"
        . "\r\n";
    fwrite($conn, $head);

    wesc_build_stream([$entry], function (?string $chunk) use ($conn): void {
        if ($chunk === null) {
            fwrite($conn, "0\r\n\r\n"); // terminating chunk
        } elseif ($chunk !== '') { // skip empties: a 0-length chunk ends the body early
            fwrite($conn, sprintf("%x\r\n", strlen($chunk)));
            fwrite($conn, $chunk);
            fwrite($conn, "\r\n");
        }
    });
}

/**
 * Send a complete response with a known length.
 *
 * @param resource $conn
 */
function send($conn, string $body, string $contentType): void
{
    $head = "HTTP/1.1 200 OK\r\n"
        . "Content-Type: $contentType\r\n"
        . 'Content-Length: ' . strlen($body) . "\r\n"
        . "Connection: close\r\n"
        . "\r\n";
    fwrite($conn, $head . $body);
}
