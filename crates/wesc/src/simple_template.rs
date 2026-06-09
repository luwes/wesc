//! Fast path for "simple" component templates.
//!
//! A template counts as simple when its body contains no nested components,
//! `<template>`, `<script>`, `<style>`, or shadow root: in other words, only
//! static markup and `<slot>` elements. Such templates can be parsed once into
//! a list of static byte ranges and slots (cached in [`SIMPLE_TEMPLATES`]) and
//! rendered without re-running the streaming scanner on every expansion.

// `render_simple_template` threads the build state explicitly, like the rest of
// the expansion engine (see `component.rs`).
#![allow(clippy::too_many_arguments)]

use std::collections::HashMap;
use std::ops::Range;
use std::sync::{LazyLock, Mutex};

use crate::chunk_reader::read_file_cached;
use crate::dep_graph::DepGraph;
use crate::scan::{
    contains_start_tag, find_end_tag, find_start_tag, find_tag_end, get_attribute_value,
    is_self_closing_start_tag, write_file_range,
};
use crate::slots::build_component_content;
use crate::slotted_positions::SlottedRanges;
use crate::{pos_key, BuildOptions, DEFAULT_SLOT_NAME};

static SIMPLE_TEMPLATES: LazyLock<Mutex<HashMap<String, Option<SimpleTemplate>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

#[derive(Debug, Clone)]
pub(crate) struct SimpleTemplate {
    parts: Vec<SimpleTemplatePart>,
}

#[derive(Debug, Clone)]
enum SimpleTemplatePart {
    Static(Range<usize>),
    Slot {
        name: Option<String>,
        fallback: Range<usize>,
    },
}

/// Drop all cached parsed templates. Called at the start of each build.
pub(crate) fn clear_simple_templates() {
    SIMPLE_TEMPLATES.lock().unwrap().clear();
}

pub(crate) fn get_simple_template(
    component_file_path: &str,
    component_definition_names: &[String],
) -> Option<SimpleTemplate> {
    if let Some(template) = SIMPLE_TEMPLATES
        .lock()
        .unwrap()
        .get(component_file_path)
        .cloned()
    {
        return template;
    }

    let template = parse_simple_template(component_file_path, component_definition_names);
    SIMPLE_TEMPLATES
        .lock()
        .unwrap()
        .insert(component_file_path.to_string(), template.clone());
    template
}

fn parse_simple_template(
    component_file_path: &str,
    component_definition_names: &[String],
) -> Option<SimpleTemplate> {
    let bytes = read_file_cached(component_file_path).ok()?;
    let template_start = find_start_tag(&bytes, 0, b"template")?;
    let template_start_end = find_tag_end(&bytes, template_start)?;
    let template_start_tag = &bytes[template_start..template_start_end];

    if get_attribute_value(template_start_tag, b"shadowrootmode").is_some() {
        return None;
    }

    let template_end_start = find_end_tag(&bytes, template_start_end, b"template")?;
    let body = template_start_end..template_end_start;
    let body_bytes = &bytes[body.clone()];

    if contains_start_tag(body_bytes, b"template")
        || contains_start_tag(body_bytes, b"script")
        || contains_start_tag(body_bytes, b"style")
        || component_definition_names
            .iter()
            .any(|name| contains_start_tag(body_bytes, name.as_bytes()))
    {
        return None;
    }

    let mut parts = Vec::new();
    let mut pos = body.start;

    while pos < body.end {
        let Some(slot_start) = find_start_tag(&bytes, pos, b"slot") else {
            if pos != body.end {
                parts.push(SimpleTemplatePart::Static(pos..body.end));
            }
            break;
        };

        if slot_start >= body.end {
            if pos != body.end {
                parts.push(SimpleTemplatePart::Static(pos..body.end));
            }
            break;
        }

        if pos != slot_start {
            parts.push(SimpleTemplatePart::Static(pos..slot_start));
        }

        let slot_start_end = find_tag_end(&bytes, slot_start)?;
        let slot_start_tag = &bytes[slot_start..slot_start_end];
        let name = get_attribute_value(slot_start_tag, b"name");

        let (fallback, slot_end) = if is_self_closing_start_tag(slot_start_tag) {
            (slot_start_end..slot_start_end, slot_start_end)
        } else {
            let slot_end_start = find_end_tag(&bytes, slot_start_end, b"slot")?;
            let slot_end = find_tag_end(&bytes, slot_end_start)?;
            (slot_start_end..slot_end_start, slot_end)
        };

        parts.push(SimpleTemplatePart::Slot { name, fallback });
        pos = slot_end;
    }

    Some(SimpleTemplate { parts })
}

pub(crate) fn render_simple_template(
    template: &SimpleTemplate,
    component_file_path: &str,
    host_file_path: &str,
    component_name: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    component_slotted_positions: &mut SlottedRanges,
    output_handler: &mut impl FnMut(&[u8]),
) {
    let host_pos_key = pos_key(file_indexes[host_file_path], host_file_path);

    for part in &template.parts {
        match part {
            SimpleTemplatePart::Static(range) => {
                write_file_range(component_file_path, range, output_handler);
            }
            SimpleTemplatePart::Slot { name, fallback } => {
                let slot_name = name.as_ref();
                let slot_lookup = slot_name
                    .map(|name| name.as_str())
                    .unwrap_or(DEFAULT_SLOT_NAME);
                let has_slotted_content = component_slotted_positions
                    .get(slot_lookup)
                    .is_some_and(|ranges| !ranges.is_empty());
                let host_start_pos = read_positions[&host_pos_key];

                if has_slotted_content {
                    while let Some(light_tag) = build_component_content(
                        slot_name,
                        host_file_path,
                        build_options,
                        file_indexes,
                        read_positions,
                        tag_stacks,
                        dep_graph,
                        component_slotted_positions,
                        output_handler,
                    ) {
                        if light_tag.is_end_tag && light_tag.tag_name == component_name {
                            break;
                        }
                    }
                }

                if host_start_pos == read_positions[&host_pos_key] {
                    write_file_range(component_file_path, fallback, output_handler);
                }
            }
        }
    }
}
