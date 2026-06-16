//! `wesc` compiles web components into a single HTML stream.
//!
//! The crate is organized as a small pipeline:
//!
//! - [`build`] orchestrates a build: resolve dependencies, extract assets, and
//!   drive the top-level expansion loop.
//! - [`component`] expands a single custom element from its definition, and
//!   [`slots`] resolves the light-DOM content that fills its `<slot>`s. These
//!   two are mutually recursive.
//! - [`simple_template`] is a fast path for templates that contain only static
//!   markup and slots.
//! - [`assets`] extracts top-level `<style>`/`<script>` into CSS and JS bundles.
//! - [`scan`] and [`write_tags`] provide the byte-level and streaming HTML
//!   scanning primitives, backed by the cached chunked reader in
//!   [`chunk_reader`].
//! - [`component_definitions`], [`dep_graph`], and [`slotted_positions`] resolve
//!   `<link rel="definition">` declarations, the dependency tree, and slotted
//!   light-DOM ranges respectively.

use std::collections::HashMap;
use std::ops::Range;
use std::rc::Rc;

pub mod chunk_reader;
pub mod component_definitions;
pub mod dep_graph;
pub mod slotted_positions;
pub mod write_tags;

mod assets;
mod build;
mod component;
mod scan;
mod simple_template;
mod slots;

use self::build::build_file;
use self::chunk_reader::{clear_file_cache, use_source, OsSource, Source};
use self::component_definitions::clear_definitions;
use self::simple_template::clear_simple_templates;

// TODO: figure out optimal chunk size
pub const CHUNK_SIZE: usize = 1024;
pub const DEFAULT_SLOT_NAME: &str = "&default";
pub const CONTENT_IN_PROGRESS: usize = 0;

#[derive(Debug, Clone)]
pub struct BuildOptions {
    pub input: Vec<String>,
    pub outcss: Option<String>,
    pub outjs: Option<String>,
    /// Working directory for the build, like rolldown's `cwd`. Relative
    /// `input`, `outcss`, and `outjs` resolve against it, the `.wesc`
    /// scratch tree is created under it, and it is passed through to rolldown.
    /// Defaults to the process working directory when `None`.
    pub cwd: Option<String>,
    pub minify: bool,
}

#[derive(Debug, Clone)]
pub struct Tag {
    tag_name: String,
    is_end_tag: bool,
    can_have_content: bool,
    attributes: HashMap<String, String>,
    position: Range<usize>,
}

/// Build a position key that combines a file index with its path.
///
/// The same file can be entered multiple times while nesting identical
/// components, so the index disambiguates the read position per occurrence.
fn pos_key(file_index: usize, file_path: &str) -> String {
    format!("{}:{}", file_index, file_path)
}

/// Build the web components from the entry points to an output handler function.
///
/// Each build starts from empty caches. The caches are thread-local, so this
/// only resets the calling thread's caches and never interferes with builds
/// running concurrently on other threads — callers no longer need to serialize
/// builds with an external lock.
///
/// # Example
///
/// ```rust
/// use wesc::{build, BuildOptions};
///
/// let build_options = BuildOptions {
///    input: vec!["./tests/fixtures/default-slot/index.html".to_string()],
///    outcss: None,
///    outjs: None,
///    cwd: None,
///    minify: false,
/// };
///
/// build(build_options, &mut |chunk: &[u8]| {
///   println!("{}", String::from_utf8_lossy(chunk));
///   // Write the chunk to a file or stream.
///   // file.write_all(chunk).unwrap();
///   // stream.write_all(chunk).unwrap();
///   // etc.
/// });
/// ```
pub fn build(build_options: BuildOptions, output_handler: &mut impl FnMut(&[u8])) {
    build_with_source(build_options, OsSource, output_handler);
}

/// Like [`build`], but draws inputs from a custom [`Source`] instead of the
/// filesystem — for example [`MemorySource`](crate::chunk_reader::MemorySource)
/// on a target without a filesystem, such as a WebAssembly worker.
///
/// The source is active only for the duration of this call.
///
/// # Example
///
/// ```rust
/// use wesc::chunk_reader::MemorySource;
/// use wesc::{build_with_source, BuildOptions};
///
/// let source = MemorySource::new()
///     .with("/app/index.html", "<!doctype html><html><body><p>Hi</p></body></html>");
///     // ...plus any component definitions the entry references.
///
/// build_with_source(
///     BuildOptions {
///         input: vec!["/app/index.html".to_string()],
///         outcss: None,
///         outjs: None,
///         cwd: Some("/app".to_string()),
///         minify: false,
///     },
///     source,
///     &mut |chunk: &[u8]| { let _ = chunk; },
/// );
/// ```
pub fn build_with_source(
    build_options: BuildOptions,
    source: impl Source + 'static,
    output_handler: &mut impl FnMut(&[u8]),
) {
    // Restores the default `OsSource` when this guard drops at the end of the call.
    let _source = use_source(Rc::new(source));

    clear_file_cache();
    clear_simple_templates();
    clear_definitions();

    build_file(&build_options, false, output_handler);
}

/// The in-memory side outputs of a build (see [`build_in_memory`]).
#[derive(Debug, Default, Clone)]
pub struct Assets {
    /// The bundled component CSS (every definition's top-level `<style>`,
    /// concatenated). Empty when no component has styles.
    pub css: Vec<u8>,
}

/// Like [`build_with_source`], but instead of writing side outputs to files it
/// returns them in memory — for targets without a filesystem, such as a
/// WebAssembly worker. The HTML still streams through `output_handler`, and the
/// bundled CSS comes back in [`Assets`].
///
/// The `outcss`/`outjs` paths on `build_options` are **ignored** here: CSS is
/// always returned in `Assets`, and JS bundling (which needs rolldown and a
/// filesystem) is not produced — bundle JS at build time with [`build`].
///
/// # Example
///
/// ```rust
/// use wesc::chunk_reader::MemorySource;
/// use wesc::{build_in_memory, BuildOptions};
///
/// let source = MemorySource::new()
///     .with(
///         "/app/index.html",
///         "<!doctype html><html><head>\
///          <link rel=\"definition\" name=\"x-box\" href=\"./box.html\"></head>\
///          <body><x-box>Hi</x-box></body></html>",
///     )
///     .with(
///         "/app/box.html",
///         "<template><div class=\"box\"><slot></slot></div></template>\
///          <style>x-box .box { color: hotpink; }</style>",
///     );
///
/// let assets = build_in_memory(
///     BuildOptions {
///         input: vec!["/app/index.html".to_string()],
///         outcss: None, // ignored; CSS comes back in `assets`
///         outjs: None,
///         cwd: Some("/app".to_string()),
///         minify: false,
///     },
///     source,
///     &mut |chunk: &[u8]| { let _ = chunk; },
/// );
///
/// assert!(String::from_utf8(assets.css).unwrap().contains("hotpink"));
/// ```
pub fn build_in_memory(
    build_options: BuildOptions,
    source: impl Source + 'static,
    output_handler: &mut impl FnMut(&[u8]),
) -> Assets {
    // Restores the default `OsSource` when this guard drops at the end of the call.
    let _source = use_source(Rc::new(source));

    clear_file_cache();
    clear_simple_templates();
    clear_definitions();

    // Memory mode always collects CSS, so `build_file` returns `Some`.
    let css = build_file(&build_options, true, output_handler).unwrap_or_default();
    Assets { css }
}
