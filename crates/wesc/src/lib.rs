use lol_html::{element, rewrite_str, HtmlRewriter, RewriteStrSettings, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::ops::Range;
use std::path::Path;
use std::rc::Rc;

pub mod chunk_reader;
use self::chunk_reader::ChunkReader;

#[derive(Debug, Clone)]
pub struct BuildOptions {
    pub entry_points: Vec<String>,
}

#[derive(Debug, Clone)]
struct Tag {
    tag_name: String,
    is_end_tag: bool,
    can_have_content: bool,
    attributes: HashMap<String, String>,
    position: Range<usize>,
}

// TODO: figure out optimal chunk size
const CHUNK_SIZE: usize = 512;
const DEFAULT_SLOT_NAME: &str = "&default";
const CONTENT_IN_PROGRESS: usize = 0;

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
    // Store the definitions of the components.
    let mut definitions: HashMap<String, HashMap<String, String>> = HashMap::new();
    // Store the parent file path of the component file path.
    let mut parents: HashMap<String, String> = HashMap::new();

    let mut slotted_positions: HashMap<String, HashMap<String, Vec<Range<usize>>>> = HashMap::new();

    build_file(
        file_path,
        &mut file_indexes,
        &mut read_positions,
        &mut tag_stacks,
        &mut definitions,
        &mut parents,
        &mut slotted_positions,
        output_handler,
    );
}

fn build_file(
    host_file_path: &str,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    definitions: &mut HashMap<String, HashMap<String, String>>,
    parents: &mut HashMap<String, String>,
    slotted_positions: &mut HashMap<String, HashMap<String, Vec<Range<usize>>>>,
    output_handler: &mut impl FnMut(&[u8]),
) {
    file_indexes.insert(host_file_path.to_string(), 0);
    read_positions.insert(pos_key(0, host_file_path), 0);

    loop {
        let ended = build_component(
            &host_file_path,
            file_indexes,
            read_positions,
            tag_stacks,
            definitions,
            parents,
            slotted_positions,
            output_handler,
        );

        if ended {
            break;
        }
    }
}

fn pos_key(file_index: usize, file_path: &str) -> String {
    format!("{}:{}", file_index, file_path)
}

fn build_component(
    host_file_path: &str,
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    mut definitions: &mut HashMap<String, HashMap<String, String>>,
    parents: &mut HashMap<String, String>,
    mut slotted_positions: &mut HashMap<String, HashMap<String, Vec<Range<usize>>>>,
    output_handler: &mut impl FnMut(&[u8]),
) -> bool {
    // Find the component definitions in the host file.
    let host_definitions = find_component_definitions(&mut definitions, &host_file_path).unwrap();
    // Put the component definition names in a vector.
    let host_definition_names = host_definitions
        .iter()
        .map(|element| element.0.as_str())
        .collect::<Vec<_>>();

    let host_file_index = file_indexes[host_file_path];
    let host_pos_key = pos_key(host_file_index, &host_file_path);

    // Write until after the start tag of a component.
    let component_tag = write_until_start_tag(
        &host_file_path,
        read_positions[&host_pos_key],
        &host_definition_names,
        "",
        true,
        output_handler,
    );

    let component_tag = match component_tag {
        Ok(tag) => tag,
        Err(_error) => return true,
    };

    // Save the end position of the start tag of the component.
    read_positions.insert(host_pos_key.clone(), component_tag.position.end);

    // Push the component tag name onto the stack.
    let tag_stack = tag_stacks
        .entry(host_file_path.to_string())
        .or_insert(vec![]);
    tag_stack.push(component_tag.tag_name.clone());

    let component_name = &component_tag.tag_name;

    // Find the file path of the component.
    let component_file_path =
        get_component_file_path(&host_file_path, &host_definitions, component_name).unwrap();

    // Get the file index and increase it by 1 or if it doesn't exist insert 0.
    let component_file_index = *file_indexes
        .entry(component_file_path.to_string())
        .and_modify(|i| *i += 1)
        .or_insert(0);
    let component_pos_key = pos_key(component_file_index, &component_file_path);

    parents.insert(component_file_path.to_string(), host_file_path.to_string());

    let component_definitions =
        find_component_definitions(&mut definitions, &component_file_path).unwrap();
    let component_definition_names = component_definitions
        .iter()
        .map(|element| element.0.as_str())
        .collect::<Vec<_>>();

    let _component_slotted_positions = find_slotted_positions(
        &mut slotted_positions,
        component_tag.position.start,
        &host_file_path,
        &component_name,
        &component_file_index,
        &component_file_path,
    )
    .unwrap();

    // Write until after the start tag of the template.
    let template_tag = write_until_start_tag(
        &component_file_path,
        0,
        &vec!["template"],
        "",
        false,
        &mut |_chunk: &[u8]| {},
    )
    .unwrap();

    // Save the end position of the start tag of the template.
    read_positions.insert(component_pos_key.clone(), template_tag.position.end);

    let mut component_until_start_tags = component_definition_names.clone();
    component_until_start_tags.push("slot");

    loop {
        let tag = write_until_tag(
            &component_file_path,
            read_positions[&component_pos_key],
            &component_until_start_tags,
            &vec!["template"],
            "<template>",
            false,
            output_handler,
        );

        let tag = match tag {
            Ok(tag) => tag,
            Err(_error) => break false,
        };

        read_positions.insert(component_pos_key.clone(), tag.position.end);

        if component_definition_names.contains(&tag.tag_name.as_str()) {
            read_positions.insert(component_pos_key.clone(), tag.position.start);

            build_component(
                &component_file_path,
                file_indexes,
                read_positions,
                tag_stacks,
                definitions,
                parents,
                slotted_positions,
                output_handler,
            );

            continue;
        }

        if tag.tag_name == "template" && tag.is_end_tag {
            // If there is no default slot, skip slotted content.
            if let Ok(component_end_tag) = write_until_end_tag(
                &host_file_path,
                read_positions[&host_pos_key],
                &host_definition_names,
                format!("<{}>", component_tag.tag_name).as_str(),
                false,
                &mut |_chunk: &[u8]| {},
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

                output_handler(format!("</{}>", component_tag.tag_name).as_bytes());

                read_positions.insert(host_pos_key, component_end_tag.position.end);
            }

            break false;
        }

        if tag.tag_name == "slot" {
            let host_start_pos = read_positions[&host_pos_key];
            let slot_name = tag.attributes.get("name");

            loop {
                if let Some(light_tag) = build_component_content(
                    slot_name,
                    &host_file_path,
                    file_indexes,
                    read_positions,
                    tag_stacks,
                    definitions,
                    parents,
                    slotted_positions,
                    output_handler,
                ) {
                    // if light_tag.is_end_tag && slot_name == light_tag.attributes.get("slot") {
                    //     break;
                    // }

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
    file_indexes: &mut HashMap<String, usize>,
    read_positions: &mut HashMap<String, usize>,
    tag_stacks: &mut HashMap<String, Vec<String>>,
    mut definitions: &mut HashMap<String, HashMap<String, String>>,
    parents: &mut HashMap<String, String>,
    slotted_positions: &mut HashMap<String, HashMap<String, Vec<Range<usize>>>>,
    output_handler: &mut impl FnMut(&[u8]),
) -> Option<Tag> {
    let host_definitions = find_component_definitions(&mut definitions, &host_file_path).unwrap();
    let host_definition_names = host_definitions
        .iter()
        .map(|element| element.0.as_str())
        .collect::<Vec<_>>();

    let mut host_until_start_tags = host_definition_names.clone();
    host_until_start_tags.push("slot");
    host_until_start_tags.push("*[slot]");

    // Get the component tag name from the stack.
    let tag_stack = tag_stacks
        .entry(host_file_path.to_string())
        .or_insert(vec![]);
    let current_tag = tag_stack.last().unwrap().as_str();

    let host_pos_key = pos_key(file_indexes[host_file_path], &host_file_path);
    let component_slotted_positions = slotted_positions.get_mut(&host_pos_key).unwrap();

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

                let parents_clone = parents.clone();
                let parent_file_path = parents_clone[host_file_path].as_str();

                // slotted_ranges.remove(0);

                let light_tag = build_component_content(
                    slot_name_option,
                    &parent_file_path,
                    file_indexes,
                    read_positions,
                    tag_stacks,
                    definitions,
                    parents,
                    slotted_positions,
                    output_handler,
                );

                // Output the fallback slot content if there is no slotted content.
                if let Ok(end_slot_tag) = write_until_end_tag(
                    &host_file_path,
                    read_positions[&host_pos_key],
                    &vec!["slot"],
                    "<slot>",
                    false,
                    &mut |_chunk: &[u8]| {
                        // TODO: find out when to output the fallback content.
                        // if host_start_pos == read_positions[&host_pos_key] {
                        //     output_handler(chunk);
                        // }
                    },
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
                        output_handler,
                    );

                    read_positions.insert(host_pos_key.clone(), light_tag.position.end);

                    println!("light_tag: {:?}", light_tag);

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

                if let Ok(mut end_slot_tag) = write_until_end_tag(
                    &host_file_path,
                    read_positions[&host_pos_key],
                    &vec![light_tag.tag_name.as_str()],
                    format!("<{}>", light_tag.tag_name).as_str(),
                    false,
                    &mut |_chunk: &[u8]| {
                        // TODO: find out when to output the fallback content.
                        // if host_start_pos == read_positions[&host_pos_key] {
                        //     output_handler(chunk);
                        // }
                    },
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
                    file_indexes,
                    read_positions,
                    tag_stacks,
                    definitions,
                    parents,
                    slotted_positions,
                    output_handler,
                );
            }

            return Some(light_tag);
        }

        // Break the loop if no named slotted element was found.
        // TODO: find out how to continue not adjacent named slotted elements.
        // if slot_name_option.is_some() {
        //     return None;
        // }

        if light_tag.is_end_tag {
            read_positions.insert(host_pos_key.clone(), light_tag.position.start);
        }

        return Some(light_tag);
    }

    return None;
}

fn write_until_tag(
    file_path: &str,
    position: usize,
    start_tag_names: &Vec<&str>,
    end_tag_names: &Vec<&str>,
    prefix: &str,
    include_tag: bool,
    output_handler: &mut impl FnMut(&[u8]) -> (),
) -> io::Result<Tag> {
    let will_pause = Rc::new(RefCell::new(false));
    let will_pause_clone = Rc::clone(&will_pause);

    let paused = Rc::new(RefCell::new(false));
    let paused_clone = Rc::clone(&paused);

    let tag = Rc::new(RefCell::new(Tag {
        tag_name: String::from(""),
        is_end_tag: false,
        can_have_content: false,
        attributes: HashMap::new(),
        position: position..position,
    }));
    let tag_clone = Rc::clone(&tag);

    // Merge start and end tag names into a single vector.
    let tag_names = start_tag_names
        .iter()
        .chain(end_tag_names.iter())
        .collect::<Vec<_>>();

    let end_tag_names_clone = end_tag_names
        .iter()
        .map(|name| name.to_string())
        .collect::<Vec<_>>();

    let end_tag_names_ref = Rc::new(RefCell::new(end_tag_names_clone));

    let ignore_prefix = Rc::new(RefCell::new(prefix != ""));
    let ignore_prefix_clone = Rc::clone(&ignore_prefix);

    let element_content_handlers = tag_names
        .iter()
        .flat_map(|element_name| {
            [element!(element_name, |el| {
                let mut tag = tag_clone.borrow_mut();
                let exclude_start_tag = *ignore_prefix.borrow() && tag.position.end == position;

                if !exclude_start_tag {
                    *will_pause.borrow_mut() = true;

                    if tag.tag_name == "" {
                        tag.tag_name = el.tag_name();
                        tag.can_have_content = el.can_have_content();
                        tag.attributes = el
                            .attributes()
                            .iter()
                            .map(|attr| (attr.name(), attr.value()))
                            .collect::<HashMap<_, _>>();
                    }
                }

                let will_pause_clone = Rc::clone(&will_pause);
                let end_tag_names_ref_clone = Rc::clone(&end_tag_names_ref);
                let tag_clone = Rc::clone(&tag_clone);
                let element_name = element_name.to_string();
                let el_tag_name = el.tag_name().to_string();

                if let Some(handlers) = el.end_tag_handlers() {
                    handlers.push(Box::new(move |end| {
                        let end_tag_names = end_tag_names_ref_clone.borrow();
                        let mut tag = tag_clone.borrow_mut();

                        let is_end_of_named_slotted =
                            element_name.contains("*[slot]") && end.name() == el_tag_name;

                        if tag.tag_name == ""
                            && (end_tag_names.contains(&end.name()) || is_end_of_named_slotted)
                        {
                            tag.tag_name = end.name();
                            tag.is_end_tag = true;
                            *will_pause_clone.borrow_mut() = true;
                        }

                        Ok(())
                    }));
                }

                Ok(())
            })]
        })
        .collect::<Vec<_>>();

    let mut rewriter = HtmlRewriter::new(
        Settings {
            element_content_handlers,
            ..Settings::default()
        },
        move |chunk: &[u8]| {
            if *paused.borrow() {
                return;
            }

            if *will_pause_clone.borrow() {
                *paused.borrow_mut() = true;
            }

            let mut tag = tag.borrow_mut();

            let html = String::from_utf8(chunk.to_vec()).unwrap();

            if *ignore_prefix_clone.borrow() && html == prefix && position == tag.position.end {
                ignore_prefix_clone.replace(false);
                return;
            }

            tag.position.start = tag.position.end;
            tag.position.end += chunk.len();

            let start_tags = start_tag_names
                .iter()
                .map(|name| format!("<{}", name))
                .collect::<Vec<_>>();

            let end_tags = end_tag_names
                .iter()
                .map(|name| format!("</{}>", name))
                .collect::<Vec<_>>();

            let is_named_slotted = start_tag_names.iter().any(|name| name.contains("*[slot]"))
                && html.starts_with("<")
                && html.ends_with(">")
                && html.contains("slot=\"");

            // Exclude start tag if include_tag is false and the html starts with a start tag.
            let exclude_start_tag = !include_tag
                && (start_tags.iter().any(|tag| html.starts_with(tag)) || is_named_slotted);

            // Exclude end tag if include_tag is false and the html equals an end tag.
            let exclude_end_tag = !include_tag && end_tags.iter().any(|tag| &html == tag);

            if !exclude_start_tag && !exclude_end_tag {
                // Remove the slot attribute from all parsed elements.
                let clean_html = rewrite_str(
                    &html,
                    RewriteStrSettings {
                        element_content_handlers: vec![element!("*[slot]", |el| {
                            el.remove_attribute("slot");
                            Ok(())
                        })],
                        ..RewriteStrSettings::default()
                    },
                )
                .unwrap();

                output_handler(clean_html.as_bytes());
            }
        },
    );

    let mut reader = ChunkReader::new(file_path, CHUNK_SIZE).unwrap();

    reader.seek(position as u64)?;
    rewriter.write(prefix.as_bytes()).unwrap();

    loop {
        if *paused_clone.borrow() {
            rewriter.end().unwrap();
            break;
        }

        if let Some(chunk) = reader.read_next_chunk()? {
            rewriter.write(&chunk).unwrap();
        } else {
            rewriter.end().unwrap();
            break;
        }
    }

    let tag = tag_clone.borrow();

    if tag.tag_name == "" {
        return Err(io::Error::new(
            io::ErrorKind::Other,
            "tag not found".to_string(),
        ));
    }

    Ok(tag.clone())
}

/// Streaming write the contents of a file until a start tag is found.
fn write_until_start_tag(
    file_path: &str,
    position: usize,
    tag_names: &Vec<&str>,
    prefix: &str,
    include_tag: bool,
    output_handler: &mut impl FnMut(&[u8]) -> (),
) -> io::Result<Tag> {
    write_until_tag(
        file_path,
        position,
        tag_names,
        &vec![],
        prefix,
        include_tag,
        output_handler,
    )
}

/// Streaming write the contents of a file until an end tag is found.
fn write_until_end_tag(
    file_path: &str,
    position: usize,
    tag_names: &Vec<&str>,
    prefix: &str,
    include_tag: bool,
    output_handler: &mut impl FnMut(&[u8]) -> (),
) -> io::Result<Tag> {
    write_until_tag(
        file_path,
        position,
        &vec![],
        tag_names,
        prefix,
        include_tag,
        output_handler,
    )
}

/// Find all custom element definitions in a file.
///
/// A custom element definition is a link tag with a rel attribute of "definition".
/// The name of the custom element is the name attribute of the link tag.
/// The href attribute of the link tag is the path to the file that contains the custom element definition.
///
/// # Example
///
/// ```html
/// <link rel="definition" name="my-element" href="./my-element.html">
/// ```
fn find_component_definitions(
    definitions: &mut HashMap<String, HashMap<String, String>>,
    file_path: &str,
) -> io::Result<HashMap<String, String>> {
    if definitions.contains_key(file_path) {
        return Ok(definitions[file_path].clone());
    }

    let mut reader = ChunkReader::new(file_path, CHUNK_SIZE).unwrap();
    let mut component_definitions: HashMap<String, String> = HashMap::new();

    let mut rewriter = HtmlRewriter::new(
        Settings {
            element_content_handlers: vec![element!("link[rel=definition]", |el| {
                let href = el.get_attribute("href").unwrap();
                let name = el.get_attribute("name").unwrap();
                component_definitions.insert(name, href);
                Ok(())
            })],
            ..Settings::default()
        },
        |_c: &[u8]| {},
    );

    // TODO: we probably want to require definitions be at the top of the files
    // and then we can break out of the loop asap once we've found them all.

    loop {
        if let Some(chunk) = reader.read_next_chunk()? {
            rewriter.write(&chunk).unwrap();
        } else {
            break;
        }
    }

    rewriter.end().unwrap();

    definitions.insert(file_path.to_string(), component_definitions.clone());

    Ok(component_definitions)
}

fn get_component_file_path(
    file_path: &str,
    defs: &HashMap<String, String>,
    name: &str,
) -> Option<String> {
    let dir = Path::new(&file_path).parent().unwrap();
    let component_href = defs[name].as_str();
    let component_href = Path::new(component_href);
    let component_file_path = dir.join(&component_href);
    component_file_path.to_string_lossy().to_string().into()
}

fn find_slotted_positions(
    slotted_positions: &mut HashMap<String, HashMap<String, Vec<Range<usize>>>>,
    read_position: usize,
    host_file_path: &str,
    component_name: &str,
    component_file_index: &usize,
    _component_file_path: &str,
) -> io::Result<HashMap<String, Vec<Range<usize>>>> {
    let key = pos_key(*component_file_index, &host_file_path);

    // todo: cache slotted positions result
    // if slotted_positions.contains_key(&key) {
    //     return Ok(slotted_positions[&key].clone());
    // }

    let mut reader = ChunkReader::new(host_file_path, CHUNK_SIZE).unwrap();
    reader.seek(read_position as u64)?;

    let mut component_slotted_positions: HashMap<String, Vec<Range<usize>>> = HashMap::new();

    let position = Rc::new(RefCell::new(read_position));
    let position_clone = Rc::clone(&position);

    let stop = Rc::new(RefCell::new(false));
    let stop_clone = Rc::clone(&stop);

    let is_end_tag = Rc::new(RefCell::new(false));

    let slot_name = Rc::new(RefCell::new("".to_string()));
    let last_slot_name = Rc::new(RefCell::new("".to_string()));

    let mut rewriter = HtmlRewriter::new(
        Settings {
            element_content_handlers: vec![
                element!(format!("root > {}", component_name), |el| {
                    if let Some(handlers) = el.end_tag_handlers() {
                        *slot_name.borrow_mut() = DEFAULT_SLOT_NAME.to_string();

                        let stop = Rc::clone(&stop_clone);

                        handlers.push(Box::new(move |_end| {
                            *stop.borrow_mut() = true;
                            Ok(())
                        }));
                    }
                    Ok(())
                }),
                element!(format!("root > {} > *[slot]", component_name), |el| {
                    *slot_name.borrow_mut() = el.get_attribute("slot").unwrap();

                    let is_end_tag = is_end_tag.clone();

                    if let Some(handlers) = el.end_tag_handlers() {
                        handlers.push(Box::new(move |_end| {
                            *is_end_tag.borrow_mut() = true;
                            Ok(())
                        }));
                    }

                    Ok(())
                }),
                element!(format!("root > {} > *:not([slot])", component_name), |el| {
                    *slot_name.borrow_mut() = DEFAULT_SLOT_NAME.to_string();

                    let is_end_tag = is_end_tag.clone();

                    if let Some(handlers) = el.end_tag_handlers() {
                        handlers.push(Box::new(move |_end| {
                            *is_end_tag.borrow_mut() = true;
                            Ok(())
                        }));
                    }

                    Ok(())
                }),
            ],
            ..Settings::default()
        },
        |chunk: &[u8]| {
            let html = String::from_utf8(chunk.to_vec()).unwrap();

            if html == "<root>" {
                return;
            }

            let mut position = position_clone.borrow_mut();

            if *stop.borrow() {
                component_slotted_positions
                    .get_mut(DEFAULT_SLOT_NAME)
                    .unwrap()
                    .last_mut()
                    .unwrap()
                    .end = *position;

                return;
            }

            if *last_slot_name.borrow() != *slot_name.borrow() {
                let positions = component_slotted_positions
                    .entry(slot_name.borrow().clone())
                    .or_insert(vec![]);

                let mut start = *position;
                // The first time add the length of the component start tag
                if *last_slot_name.borrow() == "" {
                    start += chunk.len();
                }

                let range = start..0;
                positions.push(range);

                if *last_slot_name.borrow() != "" {
                    component_slotted_positions
                        .get_mut(DEFAULT_SLOT_NAME)
                        .unwrap()
                        .last_mut()
                        .unwrap()
                        .end = *position;
                }
            }

            *position += chunk.len();

            if is_end_tag.borrow().clone() {
                *is_end_tag.borrow_mut() = false;

                component_slotted_positions
                    .get_mut(slot_name.borrow().as_str())
                    .unwrap()
                    .last_mut()
                    .unwrap()
                    .end = *position;

                if *slot_name.borrow() != DEFAULT_SLOT_NAME {
                    let positions = component_slotted_positions
                        .get_mut(DEFAULT_SLOT_NAME)
                        .unwrap();
                    let range = *position..0;
                    positions.push(range);
                }

                *slot_name.borrow_mut() = DEFAULT_SLOT_NAME.to_string();
            }

            *last_slot_name.borrow_mut() = slot_name.borrow().clone();
        },
    );

    rewriter.write("<root>".as_bytes()).unwrap();

    loop {
        if *stop.borrow() {
            break;
        }

        if let Some(chunk) = reader.read_next_chunk()? {
            rewriter.write(&chunk).unwrap();
        } else {
            break;
        }
    }

    rewriter.end().unwrap();

    slotted_positions.insert(key.clone(), component_slotted_positions.clone());

    Ok(component_slotted_positions)
}
