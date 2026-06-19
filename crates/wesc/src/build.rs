//! Build orchestration.
//!
//! [`build_file`] resolves the dependency graph for an entry point, kicks off
//! the CSS/JS asset extraction (see [`crate::assets`]), and then drives the
//! top-level expansion loop over the host file, delegating each custom element
//! to [`crate::component`]. The extractors run on background threads on native
//! targets; on wasm (no threads) they run inline. The expanded HTML is streamed
//! to the output handler and the bundled CSS/JS are returned as [`Assets`].

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
#[cfg(not(target_family = "wasm"))]
use std::thread;

use crate::assets::{extract_and_bundle_js, extract_css};
use crate::chunk_reader::{current_source, use_source, MemorySource, Source, SourceGuard};
use crate::component::build_component;
use crate::component_definitions::find_component_definition_names;
use crate::dep_graph::{resolve_dependencies, DepGraph};
use crate::write_tags::{read_until_start_tag, read_until_tag};
use crate::{pos_key, Assets, BuildOptions};

/// State threaded through the mutually-recursive expansion engine.
///
/// Bundling it keeps the engine's function signatures small: a single
/// `&mut BuildCtx` carries the dependency graph plus the mutable bookkeeping.
/// The output sink is deliberately not stored here: streaming writes borrow it
/// mutably while other code reads this context, and separate arguments avoid
/// aliasing those borrows.
pub(crate) struct BuildCtx<'a> {
    pub deps: &'a DepGraph,
    /// Per-file occurrence counter, so the same file nested multiple times
    /// keeps a distinct read position per occurrence.
    pub file_indexes: HashMap<String, usize>,
    /// Current read offset, keyed by [`pos_key`] (file index + path).
    pub read_positions: HashMap<String, usize>,
    /// Stack of component tag names currently being expanded, per host file.
    pub tag_stacks: HashMap<String, Vec<String>>,
}

impl<'a> BuildCtx<'a> {
    fn new(deps: &'a DepGraph) -> Self {
        Self {
            deps,
            file_indexes: HashMap::new(),
            read_positions: HashMap::new(),
            tag_stacks: HashMap::new(),
        }
    }
}

/// Expand an entry point to HTML (streamed to `output_handler`), returning the
/// bundled CSS/JS as [`Assets`] when requested via `options.css` / `options.js`.
pub(crate) fn build_file(
    options: &BuildOptions,
    output_handler: &mut impl FnMut(&[u8]),
) -> Assets {
    // Resolve relative paths against the build's working directory — like
    // rolldown's `cwd` — which defaults to the process working directory.
    let cwd = resolve_cwd(options.cwd.as_deref());
    let resolved_entry = resolve_path(&cwd, &options.input[0]);
    let host_file_path = resolved_entry.as_str();

    // Serve inputs from the in-memory `source` (if given) for the duration of
    // this build; otherwise reads fall through to the filesystem.
    let _source_guard = install_source(&options.source);
    // Captured (post-install) so the background extractor threads below read
    // through the same source as this thread.
    let thread_source = current_source();

    // Resolve all the dependencies of the entry point.
    let dep_graph = resolve_dependencies(host_file_path);

    // CSS/JS extraction works over its own clone of the graph, independently of
    // the HTML expansion below.
    let dep_graph_ptr = Arc::new(Mutex::new(dep_graph.clone()));
    let dep_graph_ptr_clone = dep_graph_ptr.clone();
    // Any `Some` value (including an empty string) requests the bundle, which
    // always comes back in `Assets`. A non-empty path additionally writes the
    // bundle to that file; an empty string means "in memory only" (skip the
    // write), which is handy on targets without a filesystem.
    let want_css = options.outcss.is_some();
    let want_js = options.outjs.is_some();
    // Write paths, resolved against cwd. Empty paths drop out, so they're never
    // written to disk.
    let outcss = options
        .outcss
        .as_deref()
        .filter(|p| !p.is_empty())
        .map(|p| resolve_path(&cwd, p));
    let outjs = options
        .outjs
        .as_deref()
        .filter(|p| !p.is_empty())
        .map(|p| resolve_path(&cwd, p));
    let has_side_outputs = want_css || want_js;
    let minify = options.minify;
    let host_file_path_string = host_file_path.to_owned();
    let cwd_for_js = cwd.clone();

    let extractors = Extractors::start(
        dep_graph_ptr,
        want_css,
        dep_graph_ptr_clone,
        want_js,
        minify,
        host_file_path_string,
        cwd_for_js,
        thread_source,
    );

    let mut ctx = BuildCtx::new(&dep_graph);
    ctx.file_indexes.insert(host_file_path.to_string(), 0);
    ctx.read_positions.insert(pos_key(0, host_file_path), 0);

    let html_or_component_tag =
        match read_until_start_tag(host_file_path, 0, &["root > html", "root > template"], "") {
            Ok(tag) => tag,
            Err(err) if has_side_outputs => {
                // Asset-only manifests are useful for building a shared CSS/JS bundle:
                // an entry can contain only `<link rel="definition">` declarations,
                // with no root document/template and no HTML output. The dependency
                // graph was already resolved above, so wait for the side-output
                // extractors and return an empty HTML stream.
                let _ = err;
                return finalize(extractors.finish(), outcss.as_deref(), outjs.as_deref());
            }
            Err(err) => panic!("entry must contain a root <html> or <template>: {err}"),
        };

    let entry_is_component = html_or_component_tag.tag_name != "html";
    let host_pos_key = pos_key(ctx.file_indexes[host_file_path], host_file_path);

    if entry_is_component {
        ctx.read_positions
            .insert(host_pos_key.clone(), html_or_component_tag.position.end);
    }

    // Find the component definitions in the host file.
    let host_definition_names = find_component_definition_names(host_file_path).unwrap();

    loop {
        if entry_is_component {
            let root_tag = read_until_tag(
                host_file_path,
                ctx.read_positions[&host_pos_key],
                &host_definition_names,
                &["root > template"],
                "<template>",
            )
            .unwrap();

            if root_tag.tag_name == "template" && root_tag.is_end_tag {
                break;
            }
        }

        if build_component(host_file_path, &mut ctx, output_handler) {
            break;
        }
    }

    finalize(extractors.finish(), outcss.as_deref(), outjs.as_deref())
}

/// Write any requested side outputs to disk, then return the bundled [`Assets`].
///
/// The bundles are always returned in memory; `outcss`/`outjs` additionally
/// mirror them to the given files. File writes are native-only — on wasm there
/// is no filesystem, so they are skipped (the in-memory `Assets` still flow back
/// to the caller).
fn finalize(assets: Assets, outcss: Option<&str>, outjs: Option<&str>) -> Assets {
    #[cfg(not(target_family = "wasm"))]
    {
        if let (Some(path), Some(css)) = (outcss, assets.css.as_deref()) {
            write_output(path, css);
        }
        if let (Some(path), Some(js)) = (outjs, assets.js.as_deref()) {
            write_output(path, js);
        }
    }
    #[cfg(target_family = "wasm")]
    let _ = (outcss, outjs);
    assets
}

/// Write `contents` to `path`, creating any missing parent directories first
/// (the output may point into a `dist/` that doesn't exist yet).
#[cfg(not(target_family = "wasm"))]
fn write_output(path: &str, contents: &str) {
    if let Some(parent) = Path::new(path).parent() {
        if !parent.as_os_str().is_empty() {
            std::fs::create_dir_all(parent).unwrap();
        }
    }
    std::fs::write(path, contents).unwrap();
}

/// When `source` is set, make this build read inputs from that in-memory map for
/// the duration of the returned guard; reads for paths it doesn't hold fall back
/// to the filesystem. With no `source`, reads go straight to the filesystem and
/// this returns `None`.
fn install_source(source: &Option<HashMap<String, Vec<u8>>>) -> Option<SourceGuard> {
    source
        .as_ref()
        .map(|source| use_source(Arc::new(MemorySource::from_map(source))))
}

/// Runs the CSS/JS asset extractors (see [`crate::assets`]) and collects their
/// bundled output into [`Assets`].
///
/// On native targets they run on background threads, concurrently with the HTML
/// expansion; wasm targets have no threads, so they run inline in
/// [`start`](Extractors::start). Either way an HTML-only build (`css`/`js` both
/// `false`) makes both a no-op and returns empty [`Assets`].
struct Extractors {
    #[cfg(not(target_family = "wasm"))]
    css: thread::JoinHandle<Option<String>>,
    #[cfg(not(target_family = "wasm"))]
    js: thread::JoinHandle<Option<String>>,
    #[cfg(target_family = "wasm")]
    assets: Assets,
}

impl Extractors {
    fn start(
        css_graph: Arc<Mutex<DepGraph>>,
        want_css: bool,
        js_graph: Arc<Mutex<DepGraph>>,
        want_js: bool,
        minify: bool,
        host_file_path: String,
        cwd: PathBuf,
        source: Arc<dyn Source>,
    ) -> Self {
        #[cfg(not(target_family = "wasm"))]
        {
            // Each extractor runs on its own thread, so re-install the build's
            // source there (the thread-local default is the filesystem). This is
            // what lets an in-memory `source` feed the CSS/JS extraction too.
            let css_source = source.clone();
            Extractors {
                css: thread::spawn(move || {
                    let _guard = use_source(css_source);
                    extract_css(css_graph, want_css)
                }),
                js: thread::spawn(move || {
                    let _guard = use_source(source);
                    extract_and_bundle_js(js_graph, want_js, minify, host_file_path, cwd)
                }),
            }
        }
        #[cfg(target_family = "wasm")]
        {
            // No threads on wasm: extraction runs inline on this thread, which
            // already has the build's source installed.
            let _ = source;
            let css = extract_css(css_graph, want_css);
            let js = extract_and_bundle_js(js_graph, want_js, minify, host_file_path, cwd);
            Extractors {
                assets: Assets { css, js },
            }
        }
    }

    fn finish(self) -> Assets {
        #[cfg(not(target_family = "wasm"))]
        {
            let css = self.css.join().unwrap();
            let js = self.js.join().unwrap();
            Assets { css, js }
        }
        #[cfg(target_family = "wasm")]
        {
            self.assets
        }
    }
}

/// The working directory for a build, like rolldown's `cwd`: the directory that
/// relative `input` paths resolve against. Defaults to the process working
/// directory and is always returned as an absolute path.
fn resolve_cwd(cwd: Option<&str>) -> PathBuf {
    match cwd {
        Some(cwd) => {
            let cwd = Path::new(cwd);
            if cwd.is_absolute() {
                cwd.to_path_buf()
            } else {
                std::env::current_dir()
                    .map(|base| base.join(cwd))
                    .unwrap_or_else(|_| cwd.to_path_buf())
            }
        }
        None => std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")),
    }
}

/// Resolve `path` against `cwd` when it is relative, leaving absolute paths as-is.
fn resolve_path(cwd: &Path, path: &str) -> String {
    let path = Path::new(path);
    if path.is_absolute() {
        path.to_string_lossy().into_owned()
    } else {
        cwd.join(path).to_string_lossy().into_owned()
    }
}
