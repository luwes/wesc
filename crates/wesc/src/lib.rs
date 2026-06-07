use dep_graph::{resolve_dependencies, Module};
use indextree::Node;
use rolldown::{Bundler, BundlerOptions, InputItem, OutputFormat, RawMinifyOptions};
use std::collections::{HashMap, HashSet};
use std::fs::remove_file;
use std::io::Write;
use std::ops::Range;
use std::path::{Component, Path, PathBuf};
use std::sync::{Arc, LazyLock, Mutex};
use std::{fs, thread};
use tokio::runtime::Builder;

pub mod chunk_reader;
use self::chunk_reader::{clear_file_cache, read_file_cached};

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

static SIMPLE_TEMPLATES: LazyLock<Mutex<HashMap<String, Option<SimpleTemplate>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

#[derive(Debug, Clone)]
pub struct BuildOptions {
    pub entry_points: Vec<String>,
    pub outcss: Option<String>,
    pub outjs: Option<String>,
    pub minify: bool,
}

#[derive(Debug, Clone)]
pub struct Tag {
    tag_name: String,
    is_end_tag: bool,
    can_have_content: bool,
    attributes: HashMap<String, String>,
    position: Range<usize>,
}

#[derive(Debug, Clone)]
struct SimpleTemplate {
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
///    outjs: None,
///    minify: false,
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
    clear_file_cache();
    SIMPLE_TEMPLATES.lock().unwrap().clear();

    let file_path = &build_options.entry_points[0];

    // Store file indexes that gets increased each time a component of this file is built.
    // Needed for nesting the same component to keep track of the read position.
    let mut file_indexes: HashMap<String, usize> = HashMap::new();
    // The file index together with the file path is used in the key of
    // the positions hashmap to keep track of the read position.
    let mut read_positions: HashMap<String, usize> = HashMap::new();
    // Keep a stack of the component tags that are being built.
    let mut tag_stacks: HashMap<String, Vec<String>> = HashMap::new();

    build_file(
        file_path,
        &build_options,
        &mut file_indexes,
        &mut read_positions,
        &mut tag_stacks,
        output_handler,
    );
}

fn build_file(
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

    let css_thread_handle = thread::spawn(move || {
        if let Some(outcss) = outcss {
            if Path::new(&outcss).exists() {
                remove_file(&outcss).unwrap();
            }

            let dep_graph = dep_graph_ptr.lock().unwrap();
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
    });

    let js_thread_handle = thread::spawn(move || {
        let dep_graph = dep_graph_ptr_clone.lock().unwrap();
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
                if parent_file_path == host_file_path_string
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
    js_thread_handle.join().unwrap();
}

fn pos_key(file_index: usize, file_path: &str) -> String {
    format!("{}:{}", file_index, file_path)
}

/// Emit the raw bytes of a file range verbatim (used to pass through nested
/// `<template>` open/close tags without losing attribute fidelity).
fn write_file_range(file_path: &str, range: &Range<usize>, output_handler: &mut impl FnMut(&[u8])) {
    if let Ok(bytes) = read_file_cached(file_path) {
        if range.end <= bytes.len() {
            output_handler(&bytes[range.start..range.end]);
        }
    }
}

fn write_start_tag_with_optional_slot_attribute(
    file_path: &str,
    range: &Range<usize>,
    strip_slot_attribute: bool,
    output_handler: &mut impl FnMut(&[u8]),
) {
    if !strip_slot_attribute {
        write_file_range(file_path, range, output_handler);
        return;
    }

    if let Ok(bytes) = read_file_cached(file_path) {
        if range.end <= bytes.len() {
            let start_tag = &bytes[range.start..range.end];
            let start_tag = strip_slot_attribute_from_start_tag(start_tag);
            output_handler(&start_tag);
        }
    }
}

fn strip_slot_attribute_from_start_tag(start_tag: &[u8]) -> Vec<u8> {
    let mut i = 0;

    while i < start_tag.len() {
        if !start_tag[i].is_ascii_whitespace() {
            i += 1;
            continue;
        }

        let attr_start = i;
        let mut name_start = i;
        while name_start < start_tag.len() && start_tag[name_start].is_ascii_whitespace() {
            name_start += 1;
        }

        let mut name_end = name_start;
        while name_end < start_tag.len()
            && !start_tag[name_end].is_ascii_whitespace()
            && start_tag[name_end] != b'='
            && start_tag[name_end] != b'>'
            && start_tag[name_end] != b'/'
        {
            name_end += 1;
        }

        if name_start == name_end {
            i += 1;
            continue;
        }

        let mut value_end = name_end;
        while value_end < start_tag.len() && start_tag[value_end].is_ascii_whitespace() {
            value_end += 1;
        }

        if value_end < start_tag.len() && start_tag[value_end] == b'=' {
            value_end += 1;
            while value_end < start_tag.len() && start_tag[value_end].is_ascii_whitespace() {
                value_end += 1;
            }

            if value_end < start_tag.len()
                && (start_tag[value_end] == b'"' || start_tag[value_end] == b'\'')
            {
                let quote = start_tag[value_end];
                value_end += 1;
                while value_end < start_tag.len() && start_tag[value_end] != quote {
                    value_end += 1;
                }
                if value_end < start_tag.len() {
                    value_end += 1;
                }
            } else {
                while value_end < start_tag.len()
                    && !start_tag[value_end].is_ascii_whitespace()
                    && start_tag[value_end] != b'>'
                {
                    value_end += 1;
                }
            }
        }

        if start_tag[name_start..name_end].eq_ignore_ascii_case(b"slot") {
            let mut out = Vec::with_capacity(start_tag.len());
            out.extend_from_slice(&start_tag[..attr_start]);
            out.extend_from_slice(&start_tag[value_end..]);
            return out;
        }

        i = value_end;
    }

    start_tag.to_vec()
}

fn get_simple_template(
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

fn render_simple_template(
    template: &SimpleTemplate,
    component_file_path: &str,
    host_file_path: &str,
    component_name: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    component_slotted_positions: &mut HashMap<String, Vec<Range<usize>>>,
    output_handler: &mut impl FnMut(&[u8]),
) {
    let host_pos_key = pos_key(file_indexes[host_file_path], &host_file_path);

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
                    loop {
                        if let Some(light_tag) = build_component_content(
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
                        } else {
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

fn find_start_tag(bytes: &[u8], start: usize, tag_name: &[u8]) -> Option<usize> {
    let mut pos = start;
    while pos < bytes.len() {
        let tag_start = find_next_byte(bytes, pos, b'<')?;
        let name_start = tag_start + 1;
        let name_end = name_start + tag_name.len();
        if name_end <= bytes.len()
            && bytes[name_start..name_end].eq_ignore_ascii_case(tag_name)
            && (name_end == bytes.len()
                || bytes[name_end].is_ascii_whitespace()
                || bytes[name_end] == b'>'
                || bytes[name_end] == b'/')
        {
            return Some(tag_start);
        }
        pos = tag_start + 1;
    }

    None
}

fn find_end_tag(bytes: &[u8], start: usize, tag_name: &[u8]) -> Option<usize> {
    let mut pos = start;
    while pos < bytes.len() {
        let tag_start = find_next_byte(bytes, pos, b'<')?;
        let name_start = tag_start + 2;
        let name_end = name_start + tag_name.len();
        if bytes.get(tag_start + 1) == Some(&b'/')
            && name_end <= bytes.len()
            && bytes[name_start..name_end].eq_ignore_ascii_case(tag_name)
            && (name_end == bytes.len()
                || bytes[name_end].is_ascii_whitespace()
                || bytes[name_end] == b'>')
        {
            return Some(tag_start);
        }
        pos = tag_start + 1;
    }

    None
}

fn find_next_byte(bytes: &[u8], start: usize, needle: u8) -> Option<usize> {
    bytes
        .get(start..)?
        .iter()
        .position(|byte| *byte == needle)
        .map(|offset| start + offset)
}

fn find_tag_end(bytes: &[u8], start: usize) -> Option<usize> {
    let mut quote = None;
    let mut pos = start;
    while pos < bytes.len() {
        match (quote, bytes[pos]) {
            (Some(q), c) if c == q => quote = None,
            (None, b'"' | b'\'') => quote = Some(bytes[pos]),
            (None, b'>') => return Some(pos + 1),
            _ => {}
        }
        pos += 1;
    }

    None
}

fn is_self_closing_start_tag(start_tag: &[u8]) -> bool {
    let mut pos = start_tag.len().saturating_sub(1);
    while pos > 0 && start_tag[pos].is_ascii_whitespace() {
        pos -= 1;
    }
    pos > 0 && start_tag[pos] == b'>' && start_tag[pos - 1] == b'/'
}

fn get_attribute_value(start_tag: &[u8], attr_name: &[u8]) -> Option<String> {
    let mut pos = 1;
    while pos < start_tag.len()
        && !start_tag[pos].is_ascii_whitespace()
        && start_tag[pos] != b'>'
        && start_tag[pos] != b'/'
    {
        pos += 1;
    }

    while pos < start_tag.len() {
        while pos < start_tag.len() && start_tag[pos].is_ascii_whitespace() {
            pos += 1;
        }

        if pos >= start_tag.len() || start_tag[pos] == b'>' || start_tag[pos] == b'/' {
            return None;
        }

        let name_start = pos;
        while pos < start_tag.len()
            && !start_tag[pos].is_ascii_whitespace()
            && start_tag[pos] != b'='
            && start_tag[pos] != b'>'
            && start_tag[pos] != b'/'
        {
            pos += 1;
        }
        let name_end = pos;

        while pos < start_tag.len() && start_tag[pos].is_ascii_whitespace() {
            pos += 1;
        }

        let mut value = "";
        if pos < start_tag.len() && start_tag[pos] == b'=' {
            pos += 1;
            while pos < start_tag.len() && start_tag[pos].is_ascii_whitespace() {
                pos += 1;
            }

            let value_start;
            let value_end;
            if pos < start_tag.len() && (start_tag[pos] == b'"' || start_tag[pos] == b'\'') {
                let quote = start_tag[pos];
                pos += 1;
                value_start = pos;
                while pos < start_tag.len() && start_tag[pos] != quote {
                    pos += 1;
                }
                value_end = pos;
                if pos < start_tag.len() {
                    pos += 1;
                }
            } else {
                value_start = pos;
                while pos < start_tag.len()
                    && !start_tag[pos].is_ascii_whitespace()
                    && start_tag[pos] != b'>'
                {
                    pos += 1;
                }
                value_end = pos;
            }

            value = std::str::from_utf8(&start_tag[value_start..value_end]).ok()?;
        }

        if start_tag[name_start..name_end].eq_ignore_ascii_case(attr_name) {
            return Some(value.to_string());
        }
    }

    None
}

/// Map a component file path to its location in the `./.wesc/scripts` mirror tree.
///
/// `Path::join` discards the base when its argument is absolute, so joining
/// `./.wesc/scripts` with an absolute entry path (e.g. from a server) would let
/// the extracted JS escape the mirror and produce a broken import path. Stripping
/// the root/prefix components keeps the path nested under the mirror, so the write
/// location and the `__entry.js` import stay consistent regardless of the cwd.
fn mirror_js_path(dep_file_path: &Path) -> PathBuf {
    let relative: PathBuf = dep_file_path
        .components()
        .filter(|c| !matches!(c, Component::RootDir | Component::Prefix(_)))
        .collect();
    Path::new("./.wesc/scripts")
        .join(relative)
        .with_extension("js")
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
    build_component_with_start_options(
        host_file_path,
        build_options,
        file_indexes,
        read_positions,
        tag_stacks,
        dep_graph,
        false,
        output_handler,
    )
}

fn build_component_with_start_options(
    host_file_path: &str,
    build_options: &BuildOptions,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    dep_graph: &DepGraph,
    strip_component_slot_attribute: bool,
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
        write_start_tag_with_optional_slot_attribute(
            &host_file_path,
            &component_tag.position,
            strip_component_slot_attribute,
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

    if let Some(simple_template) =
        get_simple_template(&component_file_path, &component_definition_names)
    {
        render_simple_template(
            &simple_template,
            &component_file_path,
            host_file_path,
            &component_tag.tag_name,
            build_options,
            file_indexes,
            read_positions,
            tag_stacks,
            dep_graph,
            &mut component_slotted_positions,
            output_handler,
        );
        finish_component(
            host_file_path,
            &component_file_path,
            &host_definition_names,
            &component_tag,
            file_indexes,
            read_positions,
            tag_stacks,
            output_handler,
        );
        return false;
    }

    // Read until after the start tag of the <template>.
    let root_tag =
        read_until_start_tag(&component_file_path, 0, &vec!["root > template"], "").unwrap();

    let has_shadowrootmode =
        root_tag.tag_name == "template" && root_tag.attributes.contains_key("shadowrootmode");

    let mut component_until_start_tags = component_definition_names.clone();
    component_until_start_tags.push("root > template".to_owned());
    // Stop on nested <template> tags too, so their depth can be tracked (see the
    // template handling in the loop below).
    component_until_start_tags.push("template".to_owned());

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

    // Depth of nested <template> elements within the component body.
    let mut template_depth: usize = 0;

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

        // A nested <template> in the component body: emit it verbatim and track
        // its depth. Because the body is parsed in fragments (each component
        // expansion restarts the parser with an injected `<template>` prefix), a
        // nested </template> would otherwise be mistaken for the component's own
        // root template close, truncating everything after it.
        if tag.tag_name == "template" && !tag.is_end_tag {
            write_file_range(&component_file_path, &tag.position, output_handler);
            template_depth += 1;
            continue;
        }

        if tag.tag_name == "template" && tag.is_end_tag && template_depth > 0 {
            write_file_range(&component_file_path, &tag.position, output_handler);
            template_depth -= 1;
            continue;
        }

        if tag.tag_name == "template" && tag.is_end_tag {
            if has_shadowrootmode {
                output_handler(b"</template>\n");
            }

            finish_component(
                host_file_path,
                &component_file_path,
                &host_definition_names,
                &component_tag,
                file_indexes,
                read_positions,
                tag_stacks,
                output_handler,
            );

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

fn finish_component(
    host_file_path: &str,
    component_file_path: &str,
    host_definition_names: &[String],
    component_tag: &Tag,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    output_handler: &mut impl FnMut(&[u8]),
) {
    let host_pos_key = pos_key(file_indexes[host_file_path], host_file_path);

    // If there is no default slot, skip slotted content.
    if let Ok(component_end_tag) = read_until_end_tag(
        host_file_path,
        read_positions[&host_pos_key],
        host_definition_names,
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
    let host_definition_names = find_component_definition_names(&host_file_path).unwrap();
    let host_pos_key = pos_key(file_indexes[host_file_path], &host_file_path);

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
            &vec![light_tag.tag_name.as_str()],
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

fn contains_start_tag(bytes: &[u8], tag_name: &[u8]) -> bool {
    if tag_name.is_empty() {
        return false;
    }

    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] != b'<' || i + 1 >= bytes.len() {
            i += 1;
            continue;
        }

        let name_start = i + 1;
        if bytes[name_start] == b'/'
            || bytes[name_start] == b'!'
            || bytes[name_start] == b'?'
            || name_start + tag_name.len() > bytes.len()
        {
            i += 1;
            continue;
        }

        let name_end = name_start + tag_name.len();
        if bytes[name_start..name_end].eq_ignore_ascii_case(tag_name)
            && (name_end == bytes.len()
                || bytes[name_end].is_ascii_whitespace()
                || bytes[name_end] == b'>'
                || bytes[name_end] == b'/')
        {
            return true;
        }

        i += 1;
    }

    false
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
    let current_slotted_range = match slotted_ranges.first() {
        Some(range) => range.clone(),
        None => return None,
    };

    if current_slotted_range.start != CONTENT_IN_PROGRESS {
        read_positions.insert(host_pos_key.clone(), current_slotted_range.start);
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

fn append_data_to_file(file_path: &Path, data: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
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
