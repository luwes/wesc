//! Build orchestration.
//!
//! [`build_file`] resolves the dependency graph for an entry point, kicks off
//! the CSS/JS asset extraction (see [`crate::assets`]), and then drives the
//! top-level expansion loop over the host file, delegating each custom element
//! to [`crate::component`]. The extractors run on background threads on native
//! targets; on wasm (no threads) they run inline.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
#[cfg(not(target_family = "wasm"))]
use std::thread;

use crate::assets::{extract_and_bundle_js, extract_css, CssOutput};
use crate::component::build_component;
use crate::component_definitions::find_component_definition_names;
use crate::dep_graph::{resolve_dependencies, DepGraph};
use crate::write_tags::{read_until_start_tag, read_until_tag};
use crate::{pos_key, BuildOptions};

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

/// Run a build.
///
/// When `css_to_memory` is set, the bundled CSS is collected and returned
/// instead of written to a file, and JS bundling (which needs a filesystem and
/// rolldown) is disabled — the no-filesystem path. Otherwise the side outputs go
/// to the `outcss`/`outjs` file paths and `None` is returned.
pub(crate) fn build_file(
    options: &BuildOptions,
    css_to_memory: bool,
    output_handler: &mut impl FnMut(&[u8]),
) -> Option<Vec<u8>> {
    // Resolve relative paths against the build's working directory — like
    // rolldown's `cwd` — which defaults to the process working directory.
    let cwd = resolve_cwd(options.cwd.as_deref());
    let resolved_entry = resolve_path(&cwd, &options.input[0]);
    let host_file_path = resolved_entry.as_str();

    // Resolve all the dependencies of the entry point.
    let dep_graph = resolve_dependencies(host_file_path);

    // CSS/JS extraction works over its own clone of the graph, independently of
    // the HTML expansion below.
    let dep_graph_ptr = Arc::new(Mutex::new(dep_graph.clone()));
    let dep_graph_ptr_clone = dep_graph_ptr.clone();

    // In memory mode the CSS is always collected and handed back, so `outcss`
    // is ignored. In file mode it is written to the `outcss` path, if any.
    let (css, css_buffer) = if css_to_memory {
        let buffer = Arc::new(Mutex::new(Vec::new()));
        (Some(CssOutput::Memory(buffer.clone())), Some(buffer))
    } else if let Some(path) = options.outcss.as_deref() {
        (Some(CssOutput::File(resolve_path(&cwd, path))), None)
    } else {
        (None, None)
    };

    // JS bundling writes a file and drives rolldown, so it is unavailable when
    // collecting in memory.
    let outjs = if css_to_memory {
        None
    } else {
        options.outjs.as_deref().map(|p| resolve_path(&cwd, p))
    };

    let has_side_outputs = css.is_some() || outjs.is_some();
    let minify = options.minify;
    let host_file_path_string = host_file_path.to_owned();
    let cwd_for_js = cwd.clone();

    // Collected CSS reads component files through the active `Source`, which is
    // thread-local — so when collecting in memory the extractors must run on
    // this thread (where the caller set the source), not a spawned one.
    let extractors = Extractors::start(
        dep_graph_ptr,
        css,
        dep_graph_ptr_clone,
        outjs,
        minify,
        host_file_path_string,
        cwd_for_js,
        css_to_memory,
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
                extractors.finish();
                let _ = err;
                return collected_css(css_buffer);
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

    extractors.finish();
    collected_css(css_buffer)
}

/// Drain a collected-CSS buffer into the bytes returned from a build.
fn collected_css(buffer: Option<Arc<Mutex<Vec<u8>>>>) -> Option<Vec<u8>> {
    buffer.map(|buffer| buffer.lock().unwrap().clone())
}

/// Runs the CSS/JS side-output extractors (see [`crate::assets`]).
///
/// They run on background threads (concurrently with HTML expansion) on native
/// targets, except when `inline` is requested or the target is wasm (no
/// threads), in which case they run inline up front on the calling thread.
/// Inline execution matters when inputs come from a thread-local [`Source`],
/// since a spawned thread would not see it. Either way an HTML-only build
/// (`outcss`/`outjs` both `None`) makes both a no-op.
enum Extractors {
    #[cfg(not(target_family = "wasm"))]
    Threaded {
        css: thread::JoinHandle<()>,
        js: thread::JoinHandle<()>,
    },
    /// Already ran on the calling thread; nothing to join.
    Inline,
}

impl Extractors {
    #[allow(clippy::too_many_arguments)]
    fn start(
        css_graph: Arc<Mutex<DepGraph>>,
        css: Option<CssOutput>,
        js_graph: Arc<Mutex<DepGraph>>,
        outjs: Option<String>,
        minify: bool,
        host_file_path: String,
        cwd: PathBuf,
        inline: bool,
    ) -> Self {
        #[cfg(not(target_family = "wasm"))]
        if !inline {
            return Extractors::Threaded {
                css: thread::spawn(move || extract_css(css_graph, css)),
                js: thread::spawn(move || {
                    extract_and_bundle_js(js_graph, outjs, minify, host_file_path, cwd)
                }),
            };
        }
        #[cfg(target_family = "wasm")]
        let _ = inline;

        extract_css(css_graph, css);
        extract_and_bundle_js(js_graph, outjs, minify, host_file_path, cwd);
        Extractors::Inline
    }

    fn finish(self) {
        #[cfg(not(target_family = "wasm"))]
        if let Extractors::Threaded { css, js } = self {
            css.join().unwrap();
            js.join().unwrap();
        }
        // Inline extractors already finished on the calling thread.
        #[cfg(target_family = "wasm")]
        let Extractors::Inline = self;
    }
}

/// The working directory for a build, like rolldown's `cwd`: the directory that
/// relative `input`/`outcss`/`outjs` resolve against. Defaults to the
/// process working directory and is always returned as an absolute path.
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
