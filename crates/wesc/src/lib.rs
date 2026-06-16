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

use self::build::{build_css as run_build_css, build_file};
use self::chunk_reader::clear_file_cache;
use self::component_definitions::clear_definitions;
use self::simple_template::clear_simple_templates;

// TODO: figure out optimal chunk size
pub const CHUNK_SIZE: usize = 1024;
pub const DEFAULT_SLOT_NAME: &str = "&default";
pub const CONTENT_IN_PROGRESS: usize = 0;

#[derive(Debug, Clone)]
pub struct BuildOptions {
    pub input: Vec<String>,
    /// Inline source for the entry point. When `Some`, the first `input` path is
    /// used only to resolve relative component `href`s — the entry's contents
    /// come from this string instead of being read from disk. Component files
    /// are still read from the filesystem. Lets a build run without reading the
    /// entry from disk (e.g. a string produced by a template engine).
    pub code: Option<String>,
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
///    code: None,
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
    clear_file_cache();
    clear_simple_templates();
    clear_definitions();

    build_file(&build_options, output_handler);
}

/// Stream the bundled component CSS (every definition's top-level `<style>`,
/// concatenated) to `output_handler`, the same way [`build`] streams HTML.
///
/// No HTML is produced and rolldown/JS is never involved, so this needs no
/// filesystem writes and runs on targets without a filesystem (e.g. a
/// WebAssembly worker). The `outcss`/`outjs` options are ignored. Pair it with
/// the `code` option to bundle CSS for an entry held in memory.
///
/// # Example
///
/// ```rust
/// use wesc::{build_css, BuildOptions};
///
/// let mut css = Vec::new();
/// build_css(
///     BuildOptions {
///         input: vec!["./tests/fixtures/style-tags/index.html".to_string()],
///         code: None,
///         outcss: None,
///         outjs: None,
///         cwd: None,
///         minify: false,
///     },
///     &mut |chunk: &[u8]| css.extend_from_slice(chunk),
/// );
/// ```
pub fn build_css(build_options: BuildOptions, output_handler: &mut impl FnMut(&[u8])) {
    clear_file_cache();
    clear_simple_templates();
    clear_definitions();

    run_build_css(&build_options, output_handler);
}
