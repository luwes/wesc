//! Side-channel asset extraction.
//!
//! Independently of the HTML expansion, a build also collects the top-level
//! `<style>` of every component definition into a single CSS file, and the
//! top-level `<script>` of every component into a JS bundle (via `rolldown`).
//! Both run on their own threads from [`crate::build`].

use indextree::Node;
use rolldown::{Bundler, BundlerOptions, InputItem, OutputFormat, RawMinifyOptions};
use std::collections::HashSet;
use std::fs::{self, remove_file};
use std::io::Write;
use std::path::{Component, Path, PathBuf};
use std::sync::{Arc, Mutex};
use tokio::runtime::Builder;

use crate::dep_graph::{DepGraph, Module};
use crate::write_tags::{read_until_start_tag, write_until_end_tag};

/// Concatenate the top-level `<style>` of each unique component definition into
/// `outcss`. Does nothing when no CSS output path was requested.
pub(crate) fn extract_css(dep_graph: Arc<Mutex<DepGraph>>, outcss: Option<String>) {
    if let Some(outcss) = outcss {
        if Path::new(&outcss).exists() {
            remove_file(&outcss).unwrap();
        }

        let dep_graph = dep_graph.lock().unwrap();
        let dependencies = dep_graph
            .arena
            .iter()
            .filter(|node| node.parent().is_some())
            .collect::<Vec<&Node<Module>>>();

        // A component declared in multiple files appears as multiple nodes;
        // only bundle each unique file's styles once.
        let mut seen_paths: HashSet<String> = HashSet::new();

        for dependency in dependencies.iter() {
            let dep_file_path = &dependency.get().file_path;

            if !seen_paths.insert(dep_file_path.clone()) {
                continue;
            }

            if let Ok(style_tag) =
                read_until_start_tag(&dep_file_path, 0, &vec!["root > style"], "")
            {
                let _style_tag = write_until_end_tag(
                    &dep_file_path,
                    style_tag.position.end,
                    &vec!["style"],
                    "<style>",
                    false,
                    &mut |chunk: &[u8]| {
                        append_data_to_file(Path::new(&outcss), chunk).unwrap();
                    },
                )
                .unwrap();
            }
        }
    }
}

/// Extract each component's top-level `<script>` into its mirror `.js`, then
/// (when `outjs` is set) generate an entry that imports the scripted ones and
/// bundle them with `rolldown`.
pub(crate) fn extract_and_bundle_js(
    dep_graph: Arc<Mutex<DepGraph>>,
    outjs: Option<String>,
    minify: bool,
    host_file_path: String,
) {
    let dep_graph = dep_graph.lock().unwrap();
    let dependencies = dep_graph
        .arena
        .iter()
        .filter(|node| node.parent().is_some())
        .collect::<Vec<&Node<Module>>>();

    // Track which components actually have a top-level <script>. Only those
    // produce a mirror .js file, and so only those should be imported by the
    // generated entry below.
    let mut scripted_deps: HashSet<String> = HashSet::new();

    for dependency in dependencies.iter() {
        let dep_file_path_string = &dependency.get().file_path;
        let binding = dep_file_path_string.clone();
        let dep_file_path = Path::new(&binding);
        let outjs = mirror_js_path(dep_file_path);

        if outjs.exists() {
            remove_file(&outjs).unwrap();
        }

        if let Ok(script_tag) =
            read_until_start_tag(&dep_file_path_string, 0, &vec!["root > script"], "")
        {
            let _script_tag = write_until_end_tag(
                &dep_file_path_string,
                script_tag.position.end,
                &vec!["script"],
                "<script>",
                false,
                &mut |chunk: &[u8]| {
                    append_data_to_file(&outjs, chunk).unwrap();
                },
            )
            .unwrap();

            scripted_deps.insert(dep_file_path_string.clone());
        }
    }

    if let Some(outjs) = outjs {
        if Path::new(&outjs).exists() {
            remove_file(&outjs).unwrap();
        }

        let entry_path = Path::new("./.wesc/scripts").join("__entry.js");
        if entry_path.exists() {
            remove_file(&entry_path).unwrap();
        }
        // Make sure the entry exists even when no component has a script, so
        // the bundler always has a valid (possibly empty) input.
        append_data_to_file(&entry_path, b"").unwrap();

        for dependency in dependencies.iter() {
            let parent_file_path = dep_graph
                .get_parent_file_path(&dependency.get().file_path)
                .unwrap();

            // Skip definitions without a top-level <script>: they produce no
            // mirror .js, so importing them would make the bundler fail with
            // "Module not found".
            if parent_file_path == host_file_path
                && scripted_deps.contains(&dependency.get().file_path)
            {
                let dep_file_path = Path::new(&dependency.get().file_path);
                let script_path = mirror_js_path(dep_file_path);
                let script_path = script_path
                    .strip_prefix("./.wesc/scripts")
                    .unwrap_or(&script_path);
                let import = format!("import './{}';\n", script_path.to_string_lossy());
                append_data_to_file(&entry_path, import.as_bytes()).unwrap();
            }
        }

        let mut bundler_options = BundlerOptions {
            input: Some(vec![InputItem::from(
                entry_path.to_string_lossy().to_string(),
            )]),
            file: Some(outjs),
            format: Some(OutputFormat::Esm),
            ..BundlerOptions::default()
        };

        if minify {
            bundler_options.minify = Some(RawMinifyOptions::Bool(true));
        }

        let mut bundler = Bundler::new(bundler_options).unwrap();

        let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
        runtime.block_on(bundler.write()).unwrap();
    }
}

/// Map a component file path to its location in the `./.wesc/scripts` mirror tree.
///
/// `Path::join` discards the base when its argument is absolute, so joining
/// `./.wesc/scripts` with an absolute entry path (e.g. from a server) would let
/// the extracted JS escape the mirror and produce a broken import path. Stripping
/// the root/prefix components keeps the path nested under the mirror, so the write
/// location and the `__entry.js` import stay consistent regardless of the cwd.
pub(crate) fn mirror_js_path(dep_file_path: &Path) -> PathBuf {
    let relative: PathBuf = dep_file_path
        .components()
        .filter(|c| !matches!(c, Component::RootDir | Component::Prefix(_)))
        .collect();
    Path::new("./.wesc/scripts")
        .join(relative)
        .with_extension("js")
}

pub(crate) fn append_data_to_file(
    file_path: &Path,
    data: &[u8],
) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(p) = file_path.parent() {
        fs::create_dir_all(p)?;

        let mut file = fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&file_path)?;

        file.write_all(&data)?;

        return Ok(());
    }

    Err("Could not append data to file".into())
}
