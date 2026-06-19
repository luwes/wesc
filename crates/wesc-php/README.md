# wesc (PHP)

PHP extension bindings for [`wesc`](https://github.com/luwes/wesc)'s streaming
HTML/web-component bundler. The Rust core runs in-process — no subprocess, no
WASM — so you can build and server-render web components straight from a PHP
backend (plain PHP, Laravel, Symfony, Slim, the built-in dev server, …).

The extension targets PHP 8.1+ (non-thread-safe builds).

## Install

The recommended way to install is with [PIE](https://github.com/php/pie), the
official PHP extension installer (the successor to PECL). PIE downloads a
prebuilt binary matching your PHP version and platform from GitHub releases —
no Rust toolchain or compilation required:

```sh
pie install luwes/wesc
```

Prebuilt binaries are published for PHP 8.1–8.4 (NTS) on:

| OS            | Architectures   |
| ------------- | --------------- |
| Linux (glibc) | x86_64, arm64   |
| macOS         | arm64, x86_64   |

The extension registers itself as `wesc_php`; PIE enables it for you. On a
platform without a prebuilt binary, [build from source](#building-from-source).

> ZTS (thread-safe) PHP is not supported: the bundler keeps a process-global
> file/template cache, so builds must be serialized within a process.

## Usage

```php
<?php
// One-shot: returns an associative array with the HTML output plus the bundled
// assets. `html` is a binary-safe string; `css`/`js` are strings or null.
$result = wesc_build(['./index.html'], outcss: '', outjs: '', minify: true);
echo $result['html'];
file_put_contents('styles.css', $result['css'] ?? '');
file_put_contents('scripts.js', $result['js'] ?? '');

// `outcss`/`outjs` still write files: null skips the bundle, a non-empty path
// bundles *and* writes the file, and an empty string (above) returns the asset
// in memory only — without touching disk.

// Streaming: low memory, chunk by chunk. The callback receives each string
// chunk, then `null` once to signal end-of-stream.
wesc_build_stream(['./index.html'], function ($chunk) {
    if ($chunk === null) {
        // end of stream
    } else {
        echo $chunk;
        flush();
    }
});
```

## API

- `wesc_build(array $input, ?string $outcss = null, ?string $outjs = null, bool $minify = false): array` — returns `['html' => string, 'css' => ?string, 'js' => ?string]`.
- `wesc_build_stream(array $input, callable $callback, ?string $outcss = null, ?string $outjs = null, bool $minify = false): void`

| Argument       | Type                  | Notes                                          |
| -------------- | --------------------- | ---------------------------------------------- |
| `input`        | `string[]`            | First entry is the host document.              |
| `callback`     | `callable`            | `wesc_build_stream` only. Gets each string chunk, then `null` at end-of-stream. |
| `outcss`       | `?string`             | Path to write the bundled CSS file. `''` returns the CSS in memory only (no file). |
| `outjs`        | `?string`             | Path to write the bundled JS file. `''` returns the JS in memory only (no file). |
| `minify`       | `bool`                | Minify generated assets. Defaults to `false`.  |

All trailing arguments are optional and support PHP 8 named arguments, e.g.
`wesc_build(['./index.html'], minify: true)`.

If the `wesc_build_stream` callback throws, the exception propagates out
unchanged and the build stops.

> The bundler keeps a process-global file/template cache, so builds should not
> run concurrently within a single process — serialize them (the
> [`examples/php-server`](https://github.com/luwes/wesc/tree/main/examples/php-server)
> demo does exactly this).

## Building from source

This is an [ext-php-rs](https://ext-php.rs) project. It compiles to a native PHP
extension (a `cdylib`).

Prerequisites:

- The [Rust toolchain](https://rustup.rs).
- PHP 8.1+ with development headers — `php-config` must be on your `PATH`.
- `libclang` (used by bindgen). On macOS it ships with the Xcode Command Line
  Tools; on Debian/Ubuntu install `libclang-dev`.

Build the extension:

```sh
# From the repo root. The shared object lands in target/{debug,release}/.
cargo build -p wesc_php --release
```

The artifact is named per platform:

| Platform | File                    |
| -------- | ----------------------- |
| Linux    | `libwesc_php.so`        |
| macOS    | `libwesc_php.dylib`     |
| Windows  | `wesc_php.dll`          |

Load it with PHP via the `extension` ini directive — either on the command line
or in your `php.ini`:

```sh
php -d extension=/abs/path/to/libwesc_php.dylib your-script.php
```

`cargo php` (`cargo install cargo-php`) can also build IDE stubs and install the
extension into your active PHP automatically:

```sh
cd crates/wesc-php
cargo php install --release   # builds + installs into your PHP
cargo php stubs --stdout      # prints PHP stub declarations for IDEs
```

A hand-maintained stub for IDEs lives in
[`stubs/wesc.php`](./stubs/wesc.php).

See the repo README's [PHP section](../../README.md) for the broader project and
`crates/wesc-php/src/lib.rs` for the binding source.
