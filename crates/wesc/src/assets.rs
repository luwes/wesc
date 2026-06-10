//! Side-channel asset extraction.
//!
//! Independently of the HTML expansion, a build also collects the top-level
//! `<style>` of every component definition into a single CSS file, and the
//! top-level `<script>` of every component into a JS bundle (via `rolldown`).
//! Both run on their own threads from [`crate::build`].

use indextree::Node;
use rolldown::{Bundler, BundlerOptions, InputItem, OutputFormat, RawMinifyOptions};
use std::collections::{HashMap, HashSet};
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

        let mut seen_paths: HashSet<String> = HashSet::new();

        for dependency in dependencies.iter() {
            let dep_file_path = &dependency.get().file_path;

            // A component declared in multiple files appears as multiple nodes;
            // only bundle each unique file's styles once.
            if seen_paths.insert(dep_file_path.clone()) {
                append_top_level_element(dep_file_path, "style", Path::new(&outcss));
            }
        }
    }
}

/// Append the body of `file_path`'s top-level `<tag>` element to `out_path`,
/// returning whether such an element was present.
fn append_top_level_element(file_path: &str, tag: &str, out_path: &Path) -> bool {
    let Ok(start) = read_until_start_tag(file_path, 0, &[format!("root > {tag}")], "") else {
        return false;
    };
    write_until_end_tag(
        file_path,
        start.position.end,
        &[tag],
        &format!("<{tag}>"),
        false,
        &mut |chunk: &[u8]| append_data_to_file(out_path, chunk).unwrap(),
    )
    .unwrap();
    true
}

/// Mirror-file extension for a component's top-level `<script>`, derived from its
/// `lang` attribute. TypeScript scripts get a `.ts`/`.tsx` extension so rolldown
/// transpiles them (via oxc); everything else stays `.js`.
fn script_extension(lang: Option<&String>) -> &'static str {
    match lang.map(|l| l.to_ascii_lowercase()).as_deref() {
        Some("ts") | Some("typescript") => "ts",
        Some("tsx") => "tsx",
        _ => "js",
    }
}

/// Extract `file_path`'s top-level `<script>` into its mirror file, choosing the
/// extension from the script's `lang` attribute. Returns the chosen extension, or
/// `None` when the file has no top-level `<script>`.
fn extract_script(file_path: &str) -> Option<&'static str> {
    let Ok(start) = read_until_start_tag(file_path, 0, &["root > script"], "") else {
        return None;
    };
    let ext = script_extension(start.attributes.get("lang"));
    let mirror_path = mirror_script_path(Path::new(file_path), ext);
    write_until_end_tag(
        file_path,
        start.position.end,
        &["script"],
        "<script>",
        false,
        &mut |chunk: &[u8]| append_data_to_file(&mirror_path, chunk).unwrap(),
    )
    .unwrap();
    Some(ext)
}

/// Extract each component's top-level `<script>` into its mirror file (a `.js`,
/// or `.ts`/`.tsx` for TypeScript components), then (when `outjs` is set)
/// generate an entry that imports the scripted ones and bundle them with
/// `rolldown`.
pub(crate) fn extract_and_bundle_js(
    dep_graph: Arc<Mutex<DepGraph>>,
    outjs: Option<String>,
    minify: bool,
    host_file_path: String,
) {
    // The per-component mirror files and the bundle they feed only exist to
    // produce `outjs`. When no JS bundle was requested there is nothing to
    // do — and skipping it keeps HTML-only builds from touching the shared
    // `./.wesc` scratch directory at all, so they can run concurrently without
    // any external lock.
    let Some(outjs) = outjs else {
        return;
    };

    let dep_graph = dep_graph.lock().unwrap();
    let dependencies = dep_graph
        .arena
        .iter()
        .filter(|node| node.parent().is_some())
        .collect::<Vec<&Node<Module>>>();

    // Track which components have a top-level <script> and the extension each
    // mirror was written with, so the generated entry imports the right file.
    // Only scripted components produce a mirror, and so only those are imported.
    let mut script_exts: HashMap<String, &'static str> = HashMap::new();
    let mut any_typescript = false;

    for dependency in dependencies.iter() {
        let dep_file_path = dependency.get().file_path.clone();

        // Clear any stale mirror from a previous build before re-extracting: the
        // script may have been removed or switched language, and extraction
        // appends, so a leftover file would otherwise be duplicated onto.
        for ext in ["js", "ts", "tsx"] {
            let stale = mirror_script_path(Path::new(&dep_file_path), ext);
            if stale.exists() {
                remove_file(&stale).unwrap();
            }
        }

        if let Some(ext) = extract_script(&dep_file_path) {
            any_typescript |= ext != "js";
            script_exts.insert(dep_file_path, ext);
        }
    }

    if Path::new(&outjs).exists() {
        remove_file(&outjs).unwrap();
    }

    let entry_path = Path::new("./.wesc/scripts").join("__entry.js");
    if entry_path.exists() {
        remove_file(&entry_path).unwrap();
    }
    // Make sure the entry exists even when no component has a script, so the
    // bundler always has a valid (possibly empty) input.
    append_data_to_file(&entry_path, b"").unwrap();

    for dependency in dependencies.iter() {
        let dep_file_path = dependency.get().file_path.clone();
        let parent_file_path = dep_graph.get_parent_file_path(&dep_file_path).unwrap();

        // Skip definitions without a top-level <script>: they produce no mirror,
        // so importing them would make the bundler fail with "Module not found".
        if parent_file_path == host_file_path {
            if let Some(ext) = script_exts.get(&dep_file_path) {
                let script_path = mirror_script_path(Path::new(&dep_file_path), ext);
                let script_path = script_path
                    .strip_prefix("./.wesc/scripts")
                    .unwrap_or(&script_path);
                let import = format!("import './{}';\n", script_path.to_string_lossy());
                append_data_to_file(&entry_path, import.as_bytes()).unwrap();
            }
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

    // TypeScript components are written as `.ts` mirrors (rolldown transpiles
    // them via oxc), but sibling components still import each other with `.js`
    // specifiers, so teach the resolver to try `.ts`/`.tsx` first. Only set this
    // when TS is present so pure-JS builds resolve exactly as before.
    if any_typescript {
        let mut resolve = bundler_options.resolve.take().unwrap_or_default();
        resolve.extension_alias = Some(vec![(
            ".js".to_string(),
            vec![".ts".to_string(), ".tsx".to_string(), ".js".to_string()],
        )]);
        resolve.extensions = Some(
            [".ts", ".tsx", ".mjs", ".js", ".json"]
                .iter()
                .map(ToString::to_string)
                .collect(),
        );
        bundler_options.resolve = Some(resolve);
    }

    let mut bundler = Bundler::new(bundler_options).unwrap();

    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    runtime.block_on(bundler.write()).unwrap();
}

/// Map a component file path to its location in the `./.wesc/scripts` mirror
/// tree, using `ext` for the extension (`js`, `ts`, or `tsx`).
///
/// `Path::join` discards the base when its argument is absolute, so joining
/// `./.wesc/scripts` with an absolute entry path (e.g. from a server) would let
/// the extracted JS escape the mirror and produce a broken import path. Stripping
/// the root/prefix components keeps the path nested under the mirror, so the write
/// location and the `__entry.js` import stay consistent regardless of the cwd.
pub(crate) fn mirror_script_path(dep_file_path: &Path, ext: &str) -> PathBuf {
    let relative: PathBuf = dep_file_path
        .components()
        .filter(|c| !matches!(c, Component::RootDir | Component::Prefix(_)))
        .collect();
    Path::new("./.wesc/scripts")
        .join(relative)
        .with_extension(ext)
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
            .open(file_path)?;

        file.write_all(data)?;

        return Ok(());
    }

    Err("Could not append data to file".into())
}
