#![feature(lazy_cell)]

use dep_graph::resolve_dependencies;
use lol_html::{element, HtmlRewriter, Settings};
use std::collections::HashMap;
use std::fs::remove_file;
use std::io::Write;
use std::ops::Range;
use std::path::Path;
use std::{fs, thread};

pub mod chunk_reader;

pub mod component_definitions;
use self::component_definitions::{find_component_definition_names, get_component_file_path};

pub mod dep_graph;
use self::dep_graph::DepGraph;

pub mod slotted_positions;
use self::slotted_positions::find_slotted_positions;

pub mod write_tags;
use self::write_tags::{read_until_end_tag, read_until_start_tag, read_until_tag};
use self::write_tags::{write_until_end_tag, write_until_start_tag, write_until_tag};

// TODO: figure out optimal chunk size
pub const CHUNK_SIZE: usize = 1024;
pub const DEFAULT_SLOT_NAME: &str = "&default";
pub const CONTENT_IN_PROGRESS: usize = 0;

#[derive(Debug, Clone)]
pub struct BuildOptions {
    pub entry_points: Vec<String>,
    pub outcss: Option<String>,
}

#[derive(Debug, Clone)]
pub struct Tag {
    tag_name: String,
    is_end_tag: bool,
    can_have_content: bool,
    attributes: HashMap<String, String>,
    position: Range<usize>,
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
    let file_path = &build_options.entry_points[0];

    // Store file indexes that gets increased each time a component of this file is built.
    // Needed for nesting the same component to keep track of the read position.
    let mut file_indexes: HashMap<String, usize> = HashMap::new();
    // The file index together with the file path is used in the key of
    // the positions hashmap to keep track of the read position.
    let mut read_positions: HashMap<String, usize> = HashMap::new();
    // Keep a stack of the component tags that are being built.
    let mut tag_stacks: HashMap<String, Vec<String>> = HashMap::new();

    let mut dep_graph = &mut DepGraph::new();

    build_file(
        file_path,
        &build_options,
        &mut file_indexes,
        &mut read_positions,
        &mut tag_stacks,
        &mut dep_graph,
        output_handler,
    );
}

fn build_file(
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &mut DepGraph,
    output_handler: &mut impl FnMut(&[u8]),
) {
    // Resolve all the dependencies of the entry point.
    resolve_dependencies(host_file_path, dep_graph);

    let dependencies = dep_graph
        .arena
        .iter()
        .filter(|node| node.parent().is_some())
        .map(|node| node.get().file_path.clone())
        .collect::<Vec<String>>();

    let outcss = build_options.outcss.clone();

    let css_thread_handle = thread::spawn(move || {
        if let Some(outcss) = outcss {
            if Path::new(&outcss).exists() {
                remove_file(&outcss).unwrap();
            }

            for dep_file_path in dependencies {
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
                            append_data_to_file(&outcss, chunk).unwrap();
                        },
                    )
                    .unwrap();
                }
            }
        }
    });

    // todo: find a simpler way to handle these + without needing to pass them as fn args.
    file_indexes.insert(host_file_path.to_string(), 0);
    read_positions.insert(pos_key(0, host_file_path), 0);

    let html_or_component_tag = read_until_start_tag(
        &host_file_path,
        0,
        &vec!["root > html", "root > template"],
        "",
    )
    .unwrap();

    let entry_is_component = html_or_component_tag.tag_name != "html";
    let host_file_index = file_indexes[host_file_path];
    let host_pos_key = pos_key(host_file_index, &host_file_path);

    if entry_is_component {
        read_positions.insert(host_pos_key.clone(), html_or_component_tag.position.end);
    }

    // Find the component definitions in the host file.
    let host_definition_names = find_component_definition_names(&host_file_path).unwrap();

    loop {
        if entry_is_component {
            let root_tag = read_until_tag(
                &host_file_path,
                read_positions[&host_pos_key],
                &host_definition_names,
                &vec!["root > template"],
                "<template>",
            )
            .unwrap();

            if root_tag.tag_name == "template" && root_tag.is_end_tag {
                break;
            }
        }

        let ended = build_component(
            &host_file_path,
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
}

fn pos_key(file_index: usize, file_path: &str) -> String {
    format!("{}:{}", file_index, file_path)
}

fn build_component(
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    output_handler: &mut impl FnMut(&[u8]),
) -> bool {
    // Find the component definitions in the host file.
    let host_definition_names = find_component_definition_names(&host_file_path).unwrap();

    let host_file_index = file_indexes[host_file_path];
    let host_pos_key = pos_key(host_file_index, &host_file_path);

    // Write until after the start tag of a component.
    let component_tag = write_until_start_tag(
        &host_file_path,
        read_positions[&host_pos_key],
        &host_definition_names,
        "",
        false,
        output_handler,
    );

    let component_tag = match component_tag {
        Ok(tag) => tag,
        Err(_error) => return true,
    };

    if !component_tag.attributes.contains_key("w-trim") {
        let _ = write_until_start_tag(
            &host_file_path,
            component_tag.position.start,
            &host_definition_names,
            "",
            true,
            output_handler,
        );
    }

    // Save the end position of the start tag of the component.
    read_positions.insert(host_pos_key.clone(), component_tag.position.end);

    // Push the component tag name onto the stack.
    let tag_stack = tag_stacks
        .entry(host_file_path.to_string())
        .or_insert(vec![]);
    tag_stack.push(component_tag.tag_name.clone());

    let component_name = &component_tag.tag_name;

    // Find the file path of the component.
    let component_file_path = get_component_file_path(&host_file_path, component_name).unwrap();

    // Get the file index and increase it by 1 or if it doesn't exist insert 0.
    let component_file_index = *file_indexes
        .entry(component_file_path.to_string())
        .and_modify(|i| *i += 1)
        .or_insert(0);
    let component_pos_key = pos_key(component_file_index, &component_file_path);
    let component_definition_names = find_component_definition_names(&component_file_path).unwrap();

    let mut component_slotted_positions = find_slotted_positions(
        component_tag.position.start,
        &host_file_path,
        &component_name,
        &component_file_index,
        &component_file_path,
    )
    .unwrap();

    // Read until after the start tag of the <template>.
    let root_tag =
        read_until_start_tag(&component_file_path, 0, &vec!["root > template"], "").unwrap();

    let has_shadowrootmode =
        root_tag.tag_name == "template" && root_tag.attributes.contains_key("shadowrootmode");

    let mut component_until_start_tags = component_definition_names.clone();
    component_until_start_tags.push("root > template".to_owned());

    if has_shadowrootmode {
        output_handler(b"\n");
        write_until_start_tag(
            &component_file_path,
            0,
            &vec!["root > template"],
            "",
            true,
            output_handler,
        )
        .unwrap();
    } else {
        component_until_start_tags.push("slot".to_owned());
    }

    // Save the end position of the start tag of the template.
    read_positions.insert(component_pos_key.clone(), root_tag.position.end);

    loop {
        let tag = write_until_tag(
            &component_file_path,
            read_positions[&component_pos_key],
            &component_until_start_tags,
            &vec!["root > template"],
            "<template>",
            false,
            output_handler,
        );

        let tag = match tag {
            Ok(tag) => tag,
            Err(_error) => break false,
        };

        read_positions.insert(component_pos_key.clone(), tag.position.end);

        if tag.tag_name == "template" && tag.is_end_tag {
            if has_shadowrootmode {
                output_handler(b"</template>\n");
            }

            // If there is no default slot, skip slotted content.
            if let Ok(component_end_tag) = read_until_end_tag(
                &host_file_path,
                read_positions[&host_pos_key],
                &host_definition_names,
                format!("<{}>", component_tag.tag_name).as_str(),
            ) {
                // Pop the component tag name off the stack.
                let tag_stack = tag_stacks
                    .entry(host_file_path.to_string())
                    .or_insert(vec![]);
                tag_stack.pop();

                // Decrease file index by 1 if the component ends.
                if let Some(value) = file_indexes.get_mut(&component_file_path.to_string()) {
                    if *value > 0 {
                        *value -= 1;
                    }
                }

                if !component_tag.attributes.contains_key("w-trim") {
                    output_handler(format!("</{}>", component_tag.tag_name).as_bytes());
                }

                read_positions.insert(host_pos_key.clone(), component_end_tag.position.end);
            }

            break false;
        }

        if component_definition_names.contains(&tag.tag_name) {
            read_positions.insert(component_pos_key.clone(), tag.position.start);

            build_component(
                &component_file_path,
                build_options,
                file_indexes,
                read_positions,
                tag_stacks,
                dep_graph,
                output_handler,
            );

            continue;
        }

        if tag.tag_name == "slot" {
            let host_start_pos = read_positions[&host_pos_key];
            let slot_name = tag.attributes.get("name");

            loop {
                if let Some(light_tag) = build_component_content(
                    slot_name,
                    &host_file_path,
                    build_options,
                    file_indexes,
                    read_positions,
                    tag_stacks,
                    dep_graph,
                    &mut component_slotted_positions,
                    output_handler,
                ) {
                    if light_tag.is_end_tag && light_tag.tag_name == component_tag.tag_name {
                        break;
                    }
                } else {
                    break;
                }
            }

            // Output the fallback slot content if there is no slotted content.
            if let Ok(end_slot_tag) = write_until_end_tag(
                &component_file_path,
                read_positions[&component_pos_key],
                &vec!["slot"],
                "<slot>",
                false,
                &mut |chunk: &[u8]| {
                    if host_start_pos == read_positions[&host_pos_key] {
                        output_handler(chunk);
                    }
                },
            ) {
                read_positions.insert(component_pos_key.clone(), end_slot_tag.position.end);
            }
        }
    }
}

fn build_component_content(
    slot_name_option: Option<&String>,
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    component_slotted_positions: &mut HashMap<String, Vec<Range<usize>>>,
    output_handler: &mut impl FnMut(&[u8]),
) -> Option<Tag> {
    let host_definition_names = find_component_definition_names(&host_file_path).unwrap();

    // Get the component tag name from the stack.
    let tag_stack = tag_stacks
        .entry(host_file_path.to_string())
        .or_insert(vec![]);
    let current_tag = tag_stack.last().unwrap().as_str();

    let mut host_until_start_tags = host_definition_names.clone();
    host_until_start_tags.push("slot".to_owned());
    let names_slot_content_tag = format!("{} > *[slot]", current_tag);
    host_until_start_tags.push(names_slot_content_tag);

    let host_pos_key = pos_key(file_indexes[host_file_path], &host_file_path);

    let slot_name = match slot_name_option {
        Some(name) => name,
        None => DEFAULT_SLOT_NAME,
    };

    let slotted_ranges = component_slotted_positions.get_mut(slot_name).unwrap();
    let slotted_range = match slotted_ranges.first() {
        Some(range) => range,
        None => return None,
    };

    if slotted_range.start != CONTENT_IN_PROGRESS {
        read_positions.insert(host_pos_key.clone(), slotted_range.start);
        slotted_ranges[0].start = CONTENT_IN_PROGRESS;
    }

    if let Ok(light_tag) = write_until_tag(
        &host_file_path,
        read_positions[&host_pos_key],
        &host_until_start_tags,
        &host_definition_names,
        format!("<{}>", current_tag).as_str(),
        false,
        &mut |chunk: &[u8]| {
            if slot_name_option.is_none() {
                output_handler(chunk);
            }
        },
    ) {
        if light_tag.tag_name == "slot" {
            if let None = light_tag.attributes.get("name") {
                read_positions.insert(host_pos_key.clone(), light_tag.position.end);

                let parent_file_path = dep_graph.get_parent_file_path(host_file_path).unwrap();

                // slotted_ranges.remove(0);

                let light_tag = build_component_content(
                    slot_name_option,
                    &parent_file_path,
                    build_options,
                    file_indexes,
                    read_positions,
                    tag_stacks,
                    dep_graph,
                    component_slotted_positions,
                    output_handler,
                );

                // Output the fallback slot content if there is no slotted content.
                if let Ok(end_slot_tag) = read_until_end_tag(
                    &host_file_path,
                    read_positions[&host_pos_key],
                    &vec!["slot"],
                    "<slot>",
                ) {
                    read_positions.insert(host_pos_key.clone(), end_slot_tag.position.end);
                }

                return light_tag;
            }
        }

        if !light_tag.is_end_tag {
            read_positions.insert(host_pos_key.clone(), light_tag.position.start);

            // Handle named slotted elements. e.g. <h3 slot="title">Title</h3>
            if let Some(slot_name) = light_tag.attributes.get("slot") {
                if slot_name_option.is_some() && slot_name_option.unwrap() == slot_name {
                    read_positions.insert(host_pos_key.clone(), light_tag.position.start);

                    let _ = write_until_start_tag(
                        &host_file_path,
                        read_positions[&host_pos_key],
                        &vec![light_tag.tag_name.as_str()],
                        "",
                        true,
                        &mut |chunk: &[u8]| {
                            // Remove the slot attribute.
                            let mut rewriter = HtmlRewriter::new(
                                Settings {
                                    element_content_handlers: vec![element!("*[slot]", |el| {
                                        el.remove_attribute("slot");
                                        Ok(())
                                    })],
                                    ..Settings::default()
                                },
                                |c: &[u8]| {
                                    output_handler(c);
                                },
                            );

                            rewriter.write(chunk).unwrap();
                            rewriter.end().unwrap();
                        },
                    );

                    read_positions.insert(host_pos_key.clone(), light_tag.position.end);

                    if light_tag.can_have_content {
                        if let Ok(mut end_slot_tag) = write_until_end_tag(
                            &host_file_path,
                            read_positions[&host_pos_key],
                            &vec![light_tag.tag_name.as_str()],
                            format!("<{}>", light_tag.tag_name).as_str(),
                            true,
                            &mut |chunk: &[u8]| {
                                output_handler(chunk);
                            },
                        ) {
                            read_positions.insert(host_pos_key.clone(), end_slot_tag.position.end);

                            end_slot_tag
                                .attributes
                                .insert("slot".to_string(), slot_name.clone());

                            slotted_ranges.remove(0);
                            return Some(end_slot_tag);
                        }
                    }

                    slotted_ranges.remove(0);
                    return Some(light_tag);
                }

                // Ignore light tags with a slot attribute that doesn't match the slot name.
                read_positions.insert(host_pos_key.clone(), light_tag.position.end);

                if let Ok(mut end_slot_tag) = read_until_end_tag(
                    &host_file_path,
                    read_positions[&host_pos_key],
                    &vec![light_tag.tag_name.as_str()],
                    format!("<{}>", light_tag.tag_name).as_str(),
                ) {
                    read_positions.insert(host_pos_key.clone(), end_slot_tag.position.end);

                    end_slot_tag
                        .attributes
                        .insert("slot".to_string(), slot_name.clone());

                    slotted_ranges.remove(0);
                    return Some(end_slot_tag);
                }
            } else {
                read_positions.insert(host_pos_key.clone(), light_tag.position.start);

                build_component(
                    &host_file_path,
                    build_options,
                    file_indexes,
                    read_positions,
                    tag_stacks,
                    dep_graph,
                    output_handler,
                );
            }

            return Some(light_tag);
        }

        if light_tag.is_end_tag {
            read_positions.insert(host_pos_key.clone(), light_tag.position.start);
        }

        return Some(light_tag);
    }

    None
}

fn append_data_to_file(path: &str, data: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)?;

    file.write_all(&data)?;

    Ok(())
}
