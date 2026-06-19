//! Side-channel asset extraction.
//!
//! Independently of the HTML expansion, a build also collects the top-level
//! `<style>` of every component definition into a single CSS string, and the
//! top-level `<script>` of every component into a JS bundle (via `rolldown`).
//! Both are returned to the caller in the [`crate::Assets`] value rather than
//! written to disk.
//!
//! JS bundling drives `rolldown` (which spawns threads and uses a `.wesc`
//! scratch tree on disk); it is not available on wasm targets, so that path is
//! gated off there and panics if requested. CSS bundling needs neither threads
//! nor filesystem writes, so it runs everywhere. An HTML-only build (`css`/`js`
//! both `false`) does no asset work at all.

use indextree::Node;
use std::collections::HashSet;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use crate::dep_graph::{DepGraph, Module};
use crate::write_tags::{read_until_start_tag, write_until_end_tag};

// Bundling-only imports: rolldown, tokio, and the helpers that feed them are
// native-only (see Cargo.toml). HTML/CSS-only builds never reach this code.
#[cfg(not(target_family = "wasm"))]
use rolldown::{Bundler, BundlerOptions, InputItem, OutputFormat, RawMinifyOptions};
#[cfg(not(target_family = "wasm"))]
use std::collections::HashMap;
#[cfg(not(target_family = "wasm"))]
use std::fs;
#[cfg(not(target_family = "wasm"))]
use std::io::Write;
#[cfg(not(target_family = "wasm"))]
use std::path::{Component, Path};
#[cfg(not(target_family = "wasm"))]
use tokio::runtime::Builder;

/// Stream the top-level `<style>` of each unique component definition in
/// `dep_graph` to `sink`, in dependency order. Used by [`extract_css`], which
/// already has the graph the HTML build resolved.
pub(crate) fn stream_component_css(dep_graph: &DepGraph, sink: &mut impl FnMut(&[u8])) {
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
            append_top_level_element(dep_file_path, "style", sink);
        }
    }
}

/// Concatenate the top-level `<style>` of each unique component definition into
/// a single CSS string. Returns `None` when CSS bundling was not requested
/// (`want_css == false`), and `Some` (possibly empty) otherwise.
///
/// Needs no filesystem writes, so it also runs on wasm targets.
pub(crate) fn extract_css(dep_graph: Arc<Mutex<DepGraph>>, want_css: bool) -> Option<String> {
    if !want_css {
        return None;
    }

    let dep_graph = dep_graph.lock().unwrap();
    let mut css: Vec<u8> = Vec::new();
    stream_component_css(&dep_graph, &mut |chunk: &[u8]| css.extend_from_slice(chunk));
    Some(String::from_utf8_lossy(&css).into_owned())
}

/// Append the body of `file_path`'s top-level `<tag>` element to `sink`,
/// returning whether such an element was present.
fn append_top_level_element(file_path: &str, tag: &str, sink: &mut impl FnMut(&[u8])) -> bool {
    let Ok(start) = read_until_start_tag(file_path, 0, &[format!("root > {tag}")], "") else {
        return false;
    };
    write_until_end_tag(
        file_path,
        start.position.end,
        &[tag],
        &format!("<{tag}>"),
        false,
        sink,
    )
    .unwrap();
    true
}

/// Mirror-file extension for a component's top-level `<script>`, derived from its
/// `lang` attribute. TypeScript scripts get a `.ts`/`.tsx` extension so rolldown
/// transpiles them (via oxc); everything else stays `.js`.
#[cfg(not(target_family = "wasm"))]
fn script_extension(lang: Option<&String>) -> &'static str {
    match lang.map(|l| l.to_ascii_lowercase()).as_deref() {
        Some("ts") | Some("typescript") => "ts",
        Some("tsx") => "tsx",
        _ => "js",
    }
}

/// Extract `file_path`'s top-level `<script>` into its mirror file (under
/// `scripts_dir`, mirroring the file's path relative to `cwd`), choosing the
/// extension from the script's `lang` attribute. Returns the chosen extension, or
/// `None` when the file has no top-level `<script>`.
#[cfg(not(target_family = "wasm"))]
fn extract_script(scripts_dir: &Path, cwd: &Path, file_path: &str) -> Option<&'static str> {
    let Ok(start) = read_until_start_tag(file_path, 0, &["root > script"], "") else {
        return None;
    };
    let ext = script_extension(start.attributes.get("lang"));
    let mirror_path = mirror_script_path(scripts_dir, cwd, Path::new(file_path), ext);
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
/// or `.ts`/`.tsx` for TypeScript components), then (when `want_js` is set)
/// generate an entry that imports the scripted ones and bundle them with
/// `rolldown`, returning the bundled JS.
///
/// Returns `None` when JS bundling was not requested (`want_js == false`), and
/// `Some(bundle)` otherwise. Requesting it on wasm panics.
pub(crate) fn extract_and_bundle_js(
    dep_graph: Arc<Mutex<DepGraph>>,
    want_js: bool,
    minify: bool,
    host_file_path: String,
    cwd: PathBuf,
) -> Option<String> {
    // The per-component mirror files and the bundle they feed only exist to
    // produce the JS bundle. When none was requested there is nothing to
    // do — and skipping it keeps HTML/CSS-only builds from touching the `.wesc`
    // scratch directory at all. This early return is the entire job on wasm.
    if !want_js {
        return None;
    }

    #[cfg(target_family = "wasm")]
    {
        let _ = (dep_graph, minify, host_file_path, cwd);
        panic!("wesc: JS bundling (js) requires a native target; build HTML/CSS only on wasm");
    }

    #[cfg(not(target_family = "wasm"))]
    Some(bundle_js(dep_graph, minify, host_file_path, cwd))
}

/// Extract each scripted component's `<script>` to a `.wesc` mirror tree, write
/// an entry that imports them, bundle the result with rolldown, and return the
/// bundled JS.
#[cfg(not(target_family = "wasm"))]
fn bundle_js(
    dep_graph: Arc<Mutex<DepGraph>>,
    minify: bool,
    host_file_path: String,
    cwd: PathBuf,
) -> String {
    // The scratch tree lives in a `.wesc` folder under the build's working
    // directory (`cwd`), mirroring how rolldown roots its own paths.
    let scripts_dir = cwd.join(".wesc").join("scripts");

    // Start from a clean scratch tree so mirror files for components that have
    // since been removed or renamed never linger in the output. Extraction also
    // appends, so a leftover file would otherwise be duplicated onto.
    if scripts_dir.exists() {
        fs::remove_dir_all(&scripts_dir).unwrap();
    }

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

    // A component used in several places appears as multiple nodes; extract each
    // unique file's script only once (extraction appends, so a re-extract would
    // duplicate the declarations into the mirror).
    let mut seen_paths: HashSet<String> = HashSet::new();

    for dependency in dependencies.iter() {
        let dep_file_path = dependency.get().file_path.clone();
        if !seen_paths.insert(dep_file_path.clone()) {
            continue;
        }
        if let Some(ext) = extract_script(&scripts_dir, &cwd, &dep_file_path) {
            any_typescript |= ext != "js";
            script_exts.insert(dep_file_path, ext);
        }
    }

    let entry_path = scripts_dir.join("__entry.js");
    // Make sure the entry exists even when no component has a script, so the
    // bundler always has a valid (possibly empty) input.
    append_data_to_file(&entry_path, b"").unwrap();

    let mut imported: HashSet<String> = HashSet::new();
    for dependency in dependencies.iter() {
        let dep_file_path = dependency.get().file_path.clone();
        let parent_file_path = dep_graph.get_parent_file_path(&dep_file_path).unwrap();

        // Skip definitions without a top-level <script>: they produce no mirror,
        // so importing them would make the bundler fail with "Module not found".
        // A host may declare the same component twice; import it only once.
        if parent_file_path == host_file_path && imported.insert(dep_file_path.clone()) {
            if let Some(ext) = script_exts.get(&dep_file_path) {
                let script_path =
                    mirror_script_path(&scripts_dir, &cwd, Path::new(&dep_file_path), ext);
                let script_path = script_path
                    .strip_prefix(&scripts_dir)
                    .unwrap_or(&script_path);
                let import = format!("import './{}';\n", script_path.to_string_lossy());
                append_data_to_file(&entry_path, import.as_bytes()).unwrap();
            }
        }
    }

    // Rolldown writes the bundle to a scratch file under `.wesc`; we read it
    // back into a string to return as `Assets::js` (there is no user-facing
    // output path anymore). Keeping it inside the scratch tree means the next
    // build's `remove_dir_all` above cleans it up.
    let bundle_path = scripts_dir.join("__bundle.js");

    // Drive rolldown from the same `cwd`, so the module ids it prints in the
    // bundle stay relative to it (`.wesc/scripts/...`). The entry and output
    // paths are already absolute (resolved against `cwd` in `build`).
    let mut bundler_options = BundlerOptions {
        input: Some(vec![InputItem::from(
            entry_path.to_string_lossy().to_string(),
        )]),
        cwd: Some(cwd),
        file: Some(bundle_path.to_string_lossy().to_string()),
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

    fs::read_to_string(&bundle_path).unwrap_or_default()
}

/// Map a component file path to its location in the `scripts_dir` mirror tree,
/// mirroring its path relative to `cwd` and using `ext` for the extension (`js`,
/// `ts`, or `tsx`).
///
/// Stripping `cwd` mirrors the project layout under the scratch dir; keeping only
/// `Normal` components then guarantees the mirror can never escape it (via a
/// leading `/` or a `..` from a resolved href or a component outside `cwd`), so
/// the write location and the import specifiers in `__entry.js` stay consistent.
#[cfg(not(target_family = "wasm"))]
pub(crate) fn mirror_script_path(
    scripts_dir: &Path,
    cwd: &Path,
    dep_file_path: &Path,
    ext: &str,
) -> PathBuf {
    let relative = dep_file_path.strip_prefix(cwd).unwrap_or(dep_file_path);
    let relative: PathBuf = relative
        .components()
        .filter(|c| matches!(c, Component::Normal(_)))
        .collect();
    scripts_dir.join(relative).with_extension(ext)
}

#[cfg(not(target_family = "wasm"))]
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
