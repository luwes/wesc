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

use self::build::build_file;
use self::chunk_reader::clear_file_cache;
use self::simple_template::clear_simple_templates;

// TODO: figure out optimal chunk size
pub const CHUNK_SIZE: usize = 1024;
pub const DEFAULT_SLOT_NAME: &str = "&default";
pub const CONTENT_IN_PROGRESS: usize = 0;

#[derive(Debug, Clone)]
pub struct BuildOptions {
    pub entry_points: Vec<String>,
    pub outcss: Option<String>,
    pub outjs: Option<String>,
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
/// # Example
///
/// ```rust
/// use wesc::{build, BuildOptions};
///
/// let build_options = BuildOptions {
///    entry_points: vec!["./tests/fixtures/default-slot/index.html".to_string()],
///    outcss: None,
///    outjs: None,
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

    build_file(&build_options, output_handler);
}
