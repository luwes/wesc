//! Build orchestration.
//!
//! [`build_file`] resolves the dependency graph for an entry point, kicks off
//! the CSS/JS asset extraction on background threads (see [`crate::assets`]),
//! and then drives the top-level expansion loop over the host file, delegating
//! each custom element to [`crate::component`].

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;

use crate::assets::{extract_and_bundle_js, extract_css};
use crate::component::build_component;
use crate::component_definitions::find_component_definition_names;
use crate::dep_graph::resolve_dependencies;
use crate::write_tags::{read_until_start_tag, read_until_tag};
use crate::{pos_key, BuildOptions};

pub(crate) fn build_file(
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    output_handler: &mut impl FnMut(&[u8]),
) {
    // Resolve all the dependencies of the entry point.
    let dep_graph = &resolve_dependencies(host_file_path);

    let dep_graph_ptr = Arc::new(Mutex::new(dep_graph.clone()));
    let dep_graph_ptr_clone = dep_graph_ptr.clone();

    let outcss = build_options.outcss.clone();
    let outjs = build_options.outjs.clone();
    let minify = build_options.minify;
    let host_file_path_string = host_file_path.to_owned();

    let css_thread_handle = thread::spawn(move || extract_css(dep_graph_ptr, outcss));

    let js_thread_handle = thread::spawn(move || {
        extract_and_bundle_js(dep_graph_ptr_clone, outjs, minify, host_file_path_string)
    });

    // todo: find a simpler way to handle these + without needing to pass them as fn args.
    file_indexes.insert(host_file_path.to_string(), 0);
    read_positions.insert(pos_key(0, host_file_path), 0);

    let html_or_component_tag = read_until_start_tag(
        host_file_path,
        0,
        &["root > html", "root > template"],
        "",
    )
    .unwrap();

    let entry_is_component = html_or_component_tag.tag_name != "html";
    let host_file_index = file_indexes[host_file_path];
    let host_pos_key = pos_key(host_file_index, host_file_path);

    if entry_is_component {
        read_positions.insert(host_pos_key.clone(), html_or_component_tag.position.end);
    }

    // Find the component definitions in the host file.
    let host_definition_names = find_component_definition_names(host_file_path).unwrap();

    loop {
        if entry_is_component {
            let root_tag = read_until_tag(
                host_file_path,
                read_positions[&host_pos_key],
                &host_definition_names,
                &["root > template"],
                "<template>",
            )
            .unwrap();

            if root_tag.tag_name == "template" && root_tag.is_end_tag {
                break;
            }
        }

        let ended = build_component(
            host_file_path,
            build_options,
            file_indexes,
            read_positions,
            tag_stacks,
            dep_graph,
            output_handler,
        );

        if ended {
            break;
        }
    }

    css_thread_handle.join().unwrap();
    js_thread_handle.join().unwrap();
}
