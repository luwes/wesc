//! `wesc` compiles web components into a single HTML stream.
//!
//! The crate is organized as a small pipeline:
//!
//! - [`build`] orchestrates a build: resolve dependencies, extract assets, and
//!   drive the top-level expansion loop. It streams the expanded HTML to a
//!   handler and returns the bundled CSS/JS [`Assets`].
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

use self::build::build_file;
use self::chunk_reader::clear_file_cache;
use self::component_definitions::clear_definitions;
use self::simple_template::clear_simple_templates;

// TODO: figure out optimal chunk size
pub const CHUNK_SIZE: usize = 1024;
pub const DEFAULT_SLOT_NAME: &str = "&default";
pub const CONTENT_IN_PROGRESS: usize = 0;

#[derive(Debug, Clone, Default)]
pub struct BuildOptions {
    pub input: Vec<String>,
    /// In-memory inputs, as a map of file path to its contents. When `Some`,
    /// reads resolve against this map first (paths are matched ignoring `.`/`..`
    /// segments), falling back to the filesystem for any path it doesn't hold.
    /// Supply the entry (keyed by its resolved `input` path) to build from a
    /// string produced by a template engine; supply the components too to build
    /// without touching the filesystem at all (e.g. on wasm).
    pub source: Option<HashMap<String, Vec<u8>>>,
    /// Bundle every component definition's top-level `<style>` (concatenated)
    /// and return it as [`Assets::css`]. `None` skips CSS bundling. `Some(path)`
    /// with a non-empty path also writes the bundle to that file (relative paths
    /// resolve against `cwd`); `Some("")` bundles in memory only, with no file
    /// write. CSS bundling needs no rolldown, so it also runs on wasm targets.
    pub outcss: Option<String>,
    /// Bundle every component definition's top-level `<script>` (with rolldown)
    /// and return it as [`Assets::js`]. `None` skips JS bundling. `Some(path)`
    /// with a non-empty path also writes the bundle to that file (relative paths
    /// resolve against `cwd`); `Some("")` bundles in memory only, with no file
    /// write. JS bundling is native-only — requesting it on a wasm target panics.
    pub outjs: Option<String>,
    /// Working directory for the build, like rolldown's `cwd`. Relative `input`,
    /// `outcss`, and `outjs` paths resolve against it, the `.wesc` scratch tree
    /// is created under it, and it is passed through to rolldown. Defaults to the
    /// process working directory when `None`.
    pub cwd: Option<String>,
    pub minify: bool,
}

/// The bundled assets returned by [`build`].
///
/// Each field is `Some` only when the corresponding [`BuildOptions`] path
/// (`outcss` / `outjs`) was set. The expanded HTML is not held here — it is
/// streamed to `build`'s output handler.
#[derive(Debug, Clone, Default)]
pub struct Assets {
    /// The bundled CSS (every component definition's top-level `<style>`,
    /// concatenated in dependency order, each unique definition once). `Some`
    /// when [`BuildOptions::outcss`] was set.
    pub css: Option<String>,
    /// The bundled JS (every component definition's top-level `<script>`,
    /// bundled with rolldown into an ES module). `Some` when
    /// [`BuildOptions::outjs`] was set.
    pub js: Option<String>,
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

/// Build the web components from the entry points, streaming the expanded HTML
/// to `output_handler` and returning the bundled [`Assets`].
///
/// The HTML is streamed chunk by chunk to `output_handler`. When
/// [`BuildOptions::outcss`] / [`BuildOptions::outjs`] are set, the corresponding
/// bundle is written to that file *and* returned in the [`Assets`] value once
/// the build completes ([`Assets::css`] / [`Assets::js`]). Setting `outjs` on a
/// wasm target panics (the rolldown-backed JS bundler is native-only); CSS
/// bundling works everywhere, including without a filesystem (where the file
/// write is skipped).
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
/// // `outcss` writes the bundled CSS to this file; it's also returned below.
/// let out_css = std::env::temp_dir().join("wesc-readme-example.css");
///
/// let build_options = BuildOptions {
///    input: vec!["./tests/fixtures/style-tags/index.html".to_string()],
///    source: None,
///    outcss: Some(out_css.to_string_lossy().into_owned()),
///    outjs: None,
///    cwd: None,
///    minify: false,
/// };
///
/// let assets = build(build_options, &mut |chunk: &[u8]| {
///   println!("{}", String::from_utf8_lossy(chunk));
///   // Write the chunk to a file or stream.
///   // file.write_all(chunk).unwrap();
///   // stream.write_all(chunk).unwrap();
///   // etc.
/// });
///
/// if let Some(css) = assets.css {
///   // The bundled CSS, also available in-memory (e.g. to serve from a route).
///   let _ = css;
/// }
/// # let _ = std::fs::remove_file(&out_css);
/// ```
pub fn build(build_options: BuildOptions, output_handler: &mut impl FnMut(&[u8])) -> Assets {
    clear_file_cache();
    clear_simple_templates();
    clear_definitions();

    build_file(&build_options, output_handler)
}
