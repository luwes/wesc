use lol_html::{element, rewrite_str, HtmlRewriter, RewriteStrSettings, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::rc::Rc;

use crate::chunk_reader::ChunkReader;
use crate::Tag;
use crate::CHUNK_SIZE;

pub fn write_until_tag(
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

    let start_tag_names_clone = start_tag_names
        .iter()
        .map(|&name| name.to_owned())
        .collect::<Vec<_>>();

    let end_tag_names_clone = end_tag_names
        .iter()
        .map(|&name| name.to_owned())
        .collect::<Vec<_>>();

    let end_tag_names_ref = Rc::new(RefCell::new(
        end_tag_names
            .iter()
            .map(|&name| name.to_owned())
            .collect::<Vec<_>>(),
    ));

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
                let end_tag_names_ref = Rc::clone(&end_tag_names_ref);
                let tag_clone = Rc::clone(&tag_clone);
                let element_name = element_name.to_string();
                let el_tag_name = el.tag_name().to_string();

                if let Some(handlers) = el.end_tag_handlers() {
                    handlers.push(Box::new(move |end| {
                        let end_tag_names = end_tag_names_ref.borrow().to_vec();
                        let clean_end_tag_names = only_tag_names(&end_tag_names);

                        let mut tag = tag_clone.borrow_mut();

                        let is_end_of_named_slotted =
                            element_name.contains("*[slot]") && end.name() == el_tag_name;

                        if tag.tag_name == ""
                            && (clean_end_tag_names.contains(&end.name().as_str())
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

            let html = String::from_utf8(chunk.to_vec()).unwrap();

            if html == "<root>" {
                return;
            }

            let mut tag = tag.borrow_mut();

            if *ignore_prefix_clone.borrow() && html == prefix && position == tag.position.end {
                ignore_prefix_clone.replace(false);
                return;
            }

            tag.position.start = tag.position.end;
            tag.position.end += chunk.len();

            let start_tags = only_tag_names(&start_tag_names_clone)
                .iter()
                .map(|name| format!("<{}", name))
                .collect::<Vec<_>>();

            let end_tags = only_tag_names(&end_tag_names_clone)
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

/// Streaming write the contents of a file until a start tag is found.
pub fn write_until_start_tag(
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
pub fn write_until_end_tag(
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
