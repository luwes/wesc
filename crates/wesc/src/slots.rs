//! Slot resolution: matching light-DOM content from the host file to the
//! `<slot>`s of an expanding component.
//!
//! These functions walk the host file's slotted ranges (computed by
//! [`crate::slotted_positions`]) and stream the matching content into the
//! output, recursing back into [`crate::component`] for nested components.

// Mutually recursive with the expansion engine; the build state is threaded
// explicitly rather than bundled into a context type (see `component.rs`).
#![allow(clippy::too_many_arguments)]

use std::collections::HashMap;
use std::ops::Range;

use crate::chunk_reader::read_file_cached;
use crate::component::{build_component, build_component_with_start_options};
use crate::component_definitions::find_component_definition_names;
use crate::dep_graph::DepGraph;
use crate::scan::{
    contains_start_tag, write_file_range, write_start_tag_with_optional_slot_attribute,
};
use crate::slotted_positions::SlottedRanges;
use crate::write_tags::{read_until_end_tag, write_until_tag};
use crate::{pos_key, BuildOptions, Tag, CONTENT_IN_PROGRESS, DEFAULT_SLOT_NAME};

pub(crate) fn build_component_content(
    slot_name_option: Option<&String>,
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    component_slotted_positions: &mut SlottedRanges,
    output_handler: &mut impl FnMut(&[u8]),
) -> Option<Tag> {
    let host_definition_names = find_component_definition_names(host_file_path).unwrap();

    // Get the component tag name from the stack.
    let tag_stack = tag_stacks
        .entry(host_file_path.to_string())
        .or_insert(vec![]);
    let current_tag = tag_stack.last().unwrap().as_str();

    let mut host_until_start_tags = host_definition_names.clone();
    host_until_start_tags.push("slot".to_owned());
    let names_slot_content_tag = format!("{} > *[slot]", current_tag);
    host_until_start_tags.push(names_slot_content_tag);

    let host_pos_key = pos_key(file_indexes[host_file_path], host_file_path);

    let slot_name = match slot_name_option {
        Some(name) => name,
        None => DEFAULT_SLOT_NAME,
    };

    // A named `<slot name="x">` whose host provides no matching `slot="x"`
    // content has no entry here. That's not an error: the component should emit
    // the slot's fallback, so report "no slotted content" by returning `None`.
    let slotted_ranges = component_slotted_positions.get_mut(slot_name)?;
    let current_slotted_range = match slotted_ranges.first() {
        Some(range) => range.clone(),
        None => return None,
    };

    if current_slotted_range.start != CONTENT_IN_PROGRESS {
        read_positions.insert(host_pos_key.clone(), current_slotted_range.start);
        slotted_ranges[0].start = CONTENT_IN_PROGRESS;
    }

    if let Ok(light_tag) = write_until_tag(
        host_file_path,
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
        if light_tag.tag_name == "slot" && !light_tag.attributes.contains_key("name") {
            read_positions.insert(host_pos_key.clone(), light_tag.position.end);

            let parent_file_path = dep_graph.get_parent_file_path(host_file_path).unwrap();

            let light_tag = build_component_content(
                slot_name_option,
                parent_file_path,
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
                host_file_path,
                read_positions[&host_pos_key],
                &["slot"],
                "<slot>",
            ) {
                read_positions.insert(host_pos_key.clone(), end_slot_tag.position.end);
            }

            return light_tag;
        }

        if !light_tag.is_end_tag {
            read_positions.insert(host_pos_key.clone(), light_tag.position.start);

            // Handle named slotted elements. e.g. <h3 slot="title">Title</h3>
            if let Some(slot_name) = light_tag.attributes.get("slot") {
                if slot_name_option.is_some() && slot_name_option.unwrap() == slot_name {
                    if write_simple_named_slotted_range(
                        &light_tag,
                        host_file_path,
                        &current_slotted_range,
                        &host_definition_names,
                        output_handler,
                    ) {
                        read_positions.insert(host_pos_key.clone(), current_slotted_range.end);
                    } else {
                        write_named_slotted_element_content(
                            &light_tag,
                            host_file_path,
                            build_options,
                            file_indexes,
                            read_positions,
                            tag_stacks,
                            dep_graph,
                            output_handler,
                        );
                    }
                    slotted_ranges.remove(0);
                    return Some(light_tag);
                }

                // Ignore light tags with a slot attribute that doesn't match the slot name.
                read_positions.insert(host_pos_key.clone(), light_tag.position.end);

                if let Ok(mut end_slot_tag) = read_until_end_tag(
                    host_file_path,
                    read_positions[&host_pos_key],
                    &[light_tag.tag_name.as_str()],
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
                    host_file_path,
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

fn write_named_slotted_element_content(
    light_tag: &Tag,
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    output_handler: &mut impl FnMut(&[u8]),
) {
    let host_definition_names = find_component_definition_names(host_file_path).unwrap();
    let host_pos_key = pos_key(file_indexes[host_file_path], host_file_path);

    if host_definition_names.contains(&light_tag.tag_name) {
        read_positions.insert(host_pos_key, light_tag.position.start);
        build_component_with_start_options(
            host_file_path,
            build_options,
            file_indexes,
            read_positions,
            tag_stacks,
            dep_graph,
            true,
            output_handler,
        );
        return;
    }

    write_start_tag_with_optional_slot_attribute(
        host_file_path,
        &light_tag.position,
        true,
        output_handler,
    );
    read_positions.insert(host_pos_key.clone(), light_tag.position.end);

    if !light_tag.can_have_content {
        return;
    }

    loop {
        let tag = write_until_tag(
            host_file_path,
            read_positions[&host_pos_key],
            &host_definition_names,
            &[light_tag.tag_name.as_str()],
            format!("<{}>", light_tag.tag_name).as_str(),
            false,
            output_handler,
        );

        let tag = match tag {
            Ok(tag) => tag,
            Err(_error) => break,
        };

        if tag.is_end_tag && tag.tag_name == light_tag.tag_name {
            write_file_range(host_file_path, &tag.position, output_handler);
            read_positions.insert(host_pos_key.clone(), tag.position.end);
            break;
        }

        if !tag.is_end_tag && host_definition_names.contains(&tag.tag_name) {
            read_positions.insert(host_pos_key.clone(), tag.position.start);
            build_component(
                host_file_path,
                build_options,
                file_indexes,
                read_positions,
                tag_stacks,
                dep_graph,
                output_handler,
            );
            continue;
        }

        read_positions.insert(host_pos_key.clone(), tag.position.end);
    }
}

fn write_simple_named_slotted_range(
    light_tag: &Tag,
    host_file_path: &str,
    slotted_range: &Range<usize>,
    host_definition_names: &[String],
    output_handler: &mut impl FnMut(&[u8]),
) -> bool {
    if host_definition_names.contains(&light_tag.tag_name) {
        return false;
    }

    let bytes = match read_file_cached(host_file_path) {
        Ok(bytes) => bytes,
        Err(_error) => return false,
    };

    if slotted_range.end > bytes.len() || light_tag.position.end > slotted_range.end {
        return false;
    }

    let content = &bytes[light_tag.position.end..slotted_range.end];
    if contains_start_tag(content, b"slot")
        || host_definition_names
            .iter()
            .any(|name| contains_start_tag(content, name.as_bytes()))
    {
        return false;
    }

    write_start_tag_with_optional_slot_attribute(
        host_file_path,
        &light_tag.position,
        true,
        output_handler,
    );
    output_handler(content);
    true
}
