//! Build orchestration.
//!
//! [`build_file`] resolves the dependency graph for an entry point, kicks off
//! the CSS/JS asset extraction on background threads (see [`crate::assets`]),
//! and then drives the top-level expansion loop over the host file, delegating
//! each custom element to [`crate::component`].

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::thread;

use crate::assets::{extract_and_bundle_js, extract_css};
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

pub(crate) fn build_file(options: &BuildOptions, output_handler: &mut impl FnMut(&[u8])) {
    // Resolve relative paths against the build's working directory — like
    // rolldown's `cwd` — which defaults to the process working directory.
    let cwd = resolve_cwd(options.cwd.as_deref());
    let resolved_entry = resolve_path(&cwd, &options.input[0]);
    let host_file_path = resolved_entry.as_str();

    // Resolve all the dependencies of the entry point.
    let dep_graph = resolve_dependencies(host_file_path);

    // CSS/JS extraction runs on background threads over their own clone of the
    // graph, independently of the HTML expansion below.
    let dep_graph_ptr = Arc::new(Mutex::new(dep_graph.clone()));
    let dep_graph_ptr_clone = dep_graph_ptr.clone();
    let outcss = options.outcss.as_deref().map(|p| resolve_path(&cwd, p));
    let outjs = options.outjs.as_deref().map(|p| resolve_path(&cwd, p));
    let has_side_outputs = outcss.is_some() || outjs.is_some();
    let minify = options.minify;
    let host_file_path_string = host_file_path.to_owned();
    let cwd_for_js = cwd.clone();

    let css_thread_handle = thread::spawn(move || extract_css(dep_graph_ptr, outcss));
    let js_thread_handle = thread::spawn(move || {
        extract_and_bundle_js(
            dep_graph_ptr_clone,
            outjs,
            minify,
            host_file_path_string,
            cwd_for_js,
        )
    });

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
                css_thread_handle.join().unwrap();
                js_thread_handle.join().unwrap();
                let _ = err;
                return;
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

    css_thread_handle.join().unwrap();
    js_thread_handle.join().unwrap();
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
