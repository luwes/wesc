use lol_html::{element, HtmlRewriter, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::rc::Rc;

use crate::chunk_reader::ChunkReader;
use crate::Tag;
use crate::CHUNK_SIZE;

pub fn write_until_tag<T: AsRef<str>, U: AsRef<str>>(
    file_path: &str,
    position: usize,
    start_tag_names: &[T],
    end_tag_names: &[U],
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

    let start_tag_names = start_tag_names
        .iter()
        .map(|name| name.as_ref())
        .collect::<Vec<_>>();

    let end_tag_names = end_tag_names
        .iter()
        .map(|name| name.as_ref())
        .collect::<Vec<_>>();

    // Merge start and end tag names into a single vector.
    let binding = start_tag_names.clone();
    let tag_names = binding
        .iter()
        .chain(end_tag_names.iter())
        .collect::<Vec<_>>();

    let start_tag_names_clone = start_tag_names
        .iter()
        .map(|&name| name.to_owned())
        .collect::<Vec<_>>();

    let end_tag_names_clone = end_tag_names
        .iter()
        .map(|&name| name.to_owned())
        .collect::<Vec<_>>();

    let clean_end_tag_names = Rc::new(
        only_tag_names(&end_tag_names_clone)
            .iter()
            .map(|name| name.to_string())
            .collect::<Vec<_>>(),
    );
    let start_tag_prefixes = only_tag_names(&start_tag_names_clone)
        .iter()
        .map(|name| format!("<{}", name).into_bytes())
        .collect::<Vec<_>>();
    let end_tags = only_tag_names(&end_tag_names_clone)
        .iter()
        .map(|name| format!("</{}>", name).into_bytes())
        .collect::<Vec<_>>();
    let match_named_slotted_start = start_tag_names.iter().any(|name| name.contains("*[slot]"));

    let ignore_prefix = Rc::new(RefCell::new(prefix != ""));
    let ignore_prefix_clone = Rc::clone(&ignore_prefix);

    let skip_next_definition_link = Rc::new(RefCell::new(false));
    let skip_next_definition_link_handler = Rc::clone(&skip_next_definition_link);
    let skip_next_definition_link_output = Rc::clone(&skip_next_definition_link);

    let mut element_content_handlers = tag_names
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
                let clean_end_tag_names = Rc::clone(&clean_end_tag_names);
                let tag_clone = Rc::clone(&tag_clone);
                let element_name = element_name.to_string();
                let el_tag_name = el.tag_name().to_string();

                if let Some(handlers) = el.end_tag_handlers() {
                    handlers.push(Box::new(move |end| {
                        let mut tag = tag_clone.borrow_mut();

                        let is_end_of_named_slotted =
                            element_name.contains("*[slot]") && end.name() == el_tag_name;

                        if tag.tag_name == ""
                            && (clean_end_tag_names
                                .iter()
                                .any(|name| name.as_str() == end.name())
                                || is_end_of_named_slotted)
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

    element_content_handlers.push(element!("link[rel=definition]", move |_el| {
        *skip_next_definition_link_handler.borrow_mut() = true;
        Ok(())
    }));

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

            if chunk == b"<root>" {
                return;
            }

            let mut tag = tag.borrow_mut();

            if *ignore_prefix_clone.borrow()
                && chunk == prefix.as_bytes()
                && position == tag.position.end
            {
                ignore_prefix_clone.replace(false);
                return;
            }

            tag.position.start = tag.position.end;
            tag.position.end += chunk.len();

            // Definition links are a build-time directive, not browser-usable
            // output. Do not mutate the parser token with `el.remove()`: this
            // scanner's byte positions are source offsets, so the tag must
            // still count toward `tag.position`.
            if *skip_next_definition_link_output.borrow() {
                *skip_next_definition_link_output.borrow_mut() = false;
                return;
            }

            let is_named_slotted = match_named_slotted_start
                && chunk.starts_with(b"<")
                && chunk.ends_with(b">")
                && contains_bytes(chunk, b"slot=\"");

            // Exclude start tag if include_tag is false and the html starts with a start tag.
            let exclude_start_tag = !include_tag
                && (start_tag_prefixes.iter().any(|tag| chunk.starts_with(tag))
                    || is_named_slotted);

            // Exclude end tag if include_tag is false and the html equals an end tag.
            let exclude_end_tag = !include_tag && end_tags.iter().any(|tag| chunk == tag);

            if !exclude_start_tag && !exclude_end_tag {
                output_handler(chunk);
            }
        },
    );

    let mut reader = ChunkReader::new(file_path, CHUNK_SIZE).unwrap();

    reader.seek(position as u64)?;

    rewriter.write("<root>".as_bytes()).unwrap();
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

fn only_tag_names(selectors: &Vec<String>) -> Vec<&str> {
    selectors
        .iter()
        .map(|name| {
            let parts: Vec<&str> = name.splitn(2, ">").collect();
            if parts.len() > 1 {
                parts[1].trim()
            } else {
                name
            }
        })
        .collect::<Vec<_>>()
}

fn contains_bytes(haystack: &[u8], needle: &[u8]) -> bool {
    if needle.is_empty() {
        return true;
    }

    haystack
        .windows(needle.len())
        .any(|window| window == needle)
}

/// Streaming write the contents of a file until a start tag is found.
pub fn write_until_start_tag<T: AsRef<str>>(
    file_path: &str,
    position: usize,
    tag_names: &[T],
    prefix: &str,
    include_tag: bool,
    output_handler: &mut impl FnMut(&[u8]) -> (),
) -> io::Result<Tag> {
    write_until_tag(
        file_path,
        position,
        tag_names,
        NO_TAGS,
        prefix,
        include_tag,
        output_handler,
    )
}

/// Streaming write the contents of a file until an end tag is found.
pub fn write_until_end_tag<T: AsRef<str>>(
    file_path: &str,
    position: usize,
    tag_names: &[T],
    prefix: &str,
    include_tag: bool,
    output_handler: &mut impl FnMut(&[u8]) -> (),
) -> io::Result<Tag> {
    write_until_tag(
        file_path,
        position,
        NO_TAGS,
        tag_names,
        prefix,
        include_tag,
        output_handler,
    )
}

/// Empty tag-name list, for the start- or end-tag side a caller doesn't use.
const NO_TAGS: &[&str] = &[];

pub fn read_until_tag<T: AsRef<str>, U: AsRef<str>>(
    file_path: &str,
    position: usize,
    start_tag_names: &[T],
    end_tag_names: &[U],
    prefix: &str,
) -> io::Result<Tag> {
    write_until_tag(
        file_path,
        position,
        start_tag_names,
        end_tag_names,
        prefix,
        false,
        &mut |_chunk: &[u8]| {},
    )
}

pub fn read_until_start_tag<T: AsRef<str>>(
    file_path: &str,
    position: usize,
    tag_names: &[T],
    prefix: &str,
) -> io::Result<Tag> {
    read_until_tag(file_path, position, tag_names, NO_TAGS, prefix)
}

pub fn read_until_end_tag<T: AsRef<str>>(
    file_path: &str,
    position: usize,
    tag_names: &[T],
    prefix: &str,
) -> io::Result<Tag> {
    read_until_tag(file_path, position, NO_TAGS, tag_names, prefix)
}
