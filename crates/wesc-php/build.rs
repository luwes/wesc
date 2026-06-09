//! Build script for the PHP extension.
//!
//! A PHP extension is a `cdylib` that PHP `dlopen`s at startup. It references
//! Zend/PHP symbols (e.g. `zend_*`) that don't exist at link time — they're
//! provided by the PHP binary that loads the extension. macOS's linker rejects
//! such undefined symbols by default, so allow them to be resolved lazily at
//! load time. (Linux/Windows resolve these the way PHP expects without extra
//! flags.)

fn main() {
    if std::env::var("CARGO_CFG_TARGET_VENDOR").as_deref() == Ok("apple") {
        println!("cargo:rustc-cdylib-link-arg=-undefined");
        println!("cargo:rustc-cdylib-link-arg=dynamic_lookup");
    }
}
