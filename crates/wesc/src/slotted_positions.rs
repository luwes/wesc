use lol_html::{element, HtmlRewriter, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::ops::Range;
use std::rc::Rc;
use std::sync::{LazyLock, Mutex};

use crate::chunk_reader::{read_file_cached, ChunkReader};
use crate::pos_key;
use crate::scan::{find_next_byte, find_tag_end, get_attribute_value, is_self_closing_start_tag};
use crate::CHUNK_SIZE;
use crate::DEFAULT_SLOT_NAME;

/// A component's slotted light-DOM ranges, keyed by slot name (the default slot
/// and named slots, each of which can have multiple out-of-order ranges).
pub type SlottedRanges = HashMap<String, Vec<Range<usize>>>;

// Store the slotted positions of the light DOM content of the component.
static SLOTTED_POSITIONS: LazyLock<Mutex<HashMap<String, SlottedRanges>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

pub fn find_slotted_positions(
    read_position: usize,
    host_file_path: &str,
    component_name: &str,
    component_file_index: &usize,
    component_file_path: &str,
) -> io::Result<SlottedRanges> {
    let mut slotted_positions = SLOTTED_POSITIONS.lock().unwrap();

    let key = pos_key(*component_file_index, component_file_path);

    // to cache this we still need to know the count of the element in the host file
    // because there can be multiple components with the same name
    // if slotted_positions.contains_key(&key) {
    //     return Ok(slotted_positions[&key].clone());
    // }

    if let Some(component_slotted_positions) =
        find_slotted_positions_fast(read_position, host_file_path, component_name)?
    {
        slotted_positions.insert(key.clone(), component_slotted_positions.clone());
        return Ok(component_slotted_positions);
    }

    let mut reader = ChunkReader::new(host_file_path, CHUNK_SIZE).unwrap();
    reader.seek(read_position as u64)?;

    let mut component_slotted_positions: SlottedRanges = HashMap::new();

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
            if chunk == b"<root>" {
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
                if (*last_slot_name.borrow()).is_empty() {
                    start += chunk.len();
                }

                let range = start..0;
                positions.push(range);

                if !(*last_slot_name.borrow()).is_empty() {
                    component_slotted_positions
                        .get_mut(DEFAULT_SLOT_NAME)
                        .unwrap()
                        .last_mut()
                        .unwrap()
                        .end = *position;
                }
            }

            *position += chunk.len();

            if *is_end_tag.borrow() {
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

fn find_slotted_positions_fast(
    read_position: usize,
    host_file_path: &str,
    component_name: &str,
) -> io::Result<Option<SlottedRanges>> {
    let bytes = read_file_cached(host_file_path)?;
    if read_position >= bytes.len() || bytes[read_position] != b'<' {
        return Ok(None);
    }

    let component_name_bytes = component_name.as_bytes();
    let component_start_name = read_tag_name(&bytes, read_position + 1).ok_or_else(|| {
        io::Error::new(
            io::ErrorKind::InvalidData,
            "component start tag missing name",
        )
    })?;
    if !component_start_name.eq_ignore_ascii_case(component_name_bytes) {
        return Ok(None);
    }

    let component_start_end = find_tag_end(&bytes, read_position).ok_or_else(|| {
        io::Error::new(
            io::ErrorKind::InvalidData,
            "component start tag is not closed",
        )
    })?;
    if is_self_closing_start_tag(&bytes[read_position..component_start_end]) {
        let mut positions = HashMap::new();
        positions.insert(DEFAULT_SLOT_NAME.to_string(), vec![]);
        return Ok(Some(positions));
    }

    let mut positions: SlottedRanges = HashMap::new();
    positions.insert(DEFAULT_SLOT_NAME.to_string(), vec![]);

    let mut pos = component_start_end;
    let mut default_start = pos;

    loop {
        if pos >= bytes.len() {
            return Ok(None);
        }

        if starts_with_end_tag(&bytes, pos, component_name_bytes) {
            push_non_empty_range(&mut positions, DEFAULT_SLOT_NAME, default_start..pos);
            return Ok(Some(positions));
        }

        let tag_start = match find_next_byte(&bytes, pos, b'<') {
            Some(tag_start) => tag_start,
            None => return Ok(None),
        };

        if starts_with_end_tag(&bytes, tag_start, component_name_bytes) {
            push_non_empty_range(&mut positions, DEFAULT_SLOT_NAME, default_start..tag_start);
            return Ok(Some(positions));
        }

        if is_comment_or_declaration(&bytes, tag_start) {
            let Some(tag_end) = find_tag_end(&bytes, tag_start) else {
                return Ok(None);
            };
            pos = tag_end;
            continue;
        }

        if tag_start + 1 >= bytes.len() || bytes[tag_start + 1] == b'/' {
            pos = tag_start + 1;
            continue;
        }

        let Some(tag_name) = read_tag_name(&bytes, tag_start + 1) else {
            pos = tag_start + 1;
            continue;
        };

        if is_fallback_to_parser_tag(&tag_name) {
            return Ok(None);
        }

        let Some(start_tag_end) = find_tag_end(&bytes, tag_start) else {
            return Ok(None);
        };
        let start_tag = &bytes[tag_start..start_tag_end];
        let Some(element_end) = find_element_end(&bytes, tag_start, &tag_name, start_tag_end)
        else {
            return Ok(None);
        };

        if let Some(slot_name) = get_attribute_value(start_tag, b"slot") {
            push_non_empty_range(&mut positions, DEFAULT_SLOT_NAME, default_start..tag_start);
            push_non_empty_range(&mut positions, &slot_name, tag_start..element_end);
            default_start = element_end;
        }

        pos = element_end;
    }
}

fn push_non_empty_range(
    positions: &mut SlottedRanges,
    slot_name: &str,
    range: Range<usize>,
) {
    if range.start != range.end {
        positions
            .entry(slot_name.to_string())
            .or_default()
            .push(range);
    }
}

fn read_tag_name(bytes: &[u8], start: usize) -> Option<Vec<u8>> {
    let mut end = start;
    while end < bytes.len()
        && !bytes[end].is_ascii_whitespace()
        && bytes[end] != b'>'
        && bytes[end] != b'/'
    {
        end += 1;
    }

    if start == end {
        None
    } else {
        Some(bytes[start..end].to_vec())
    }
}

fn starts_with_end_tag(bytes: &[u8], pos: usize, tag_name: &[u8]) -> bool {
    let name_start = pos + 2;
    let name_end = name_start + tag_name.len();
    pos + 2 <= bytes.len()
        && bytes.get(pos) == Some(&b'<')
        && bytes.get(pos + 1) == Some(&b'/')
        && name_end <= bytes.len()
        && bytes[name_start..name_end].eq_ignore_ascii_case(tag_name)
        && (name_end == bytes.len()
            || bytes[name_end].is_ascii_whitespace()
            || bytes[name_end] == b'>')
}

fn is_comment_or_declaration(bytes: &[u8], pos: usize) -> bool {
    bytes.get(pos) == Some(&b'<') && matches!(bytes.get(pos + 1), Some(b'!') | Some(b'?'))
}

fn is_fallback_to_parser_tag(tag_name: &[u8]) -> bool {
    tag_name.eq_ignore_ascii_case(b"script")
        || tag_name.eq_ignore_ascii_case(b"style")
        || tag_name.eq_ignore_ascii_case(b"template")
}

fn find_element_end(
    bytes: &[u8],
    tag_start: usize,
    tag_name: &[u8],
    start_tag_end: usize,
) -> Option<usize> {
    if is_void_tag(tag_name) || is_self_closing_start_tag(&bytes[tag_start..start_tag_end]) {
        return Some(start_tag_end);
    }

    let mut depth = 1;
    let mut pos = start_tag_end;

    while pos < bytes.len() {
        let tag_pos = find_next_byte(bytes, pos, b'<')?;

        if is_comment_or_declaration(bytes, tag_pos) {
            pos = find_tag_end(bytes, tag_pos)?;
            continue;
        }

        if starts_with_end_tag(bytes, tag_pos, tag_name) {
            let end = find_tag_end(bytes, tag_pos)?;
            depth -= 1;
            if depth == 0 {
                return Some(end);
            }
            pos = end;
            continue;
        }

        if tag_pos + 1 < bytes.len() && bytes[tag_pos + 1] != b'/' {
            if let Some(name) = read_tag_name(bytes, tag_pos + 1) {
                let end = find_tag_end(bytes, tag_pos)?;
                if name.eq_ignore_ascii_case(tag_name)
                    && !is_void_tag(&name)
                    && !is_self_closing_start_tag(&bytes[tag_pos..end])
                {
                    depth += 1;
                }
                pos = end;
                continue;
            }
        }

        pos = tag_pos + 1;
    }

    None
}

fn is_void_tag(tag_name: &[u8]) -> bool {
    matches!(
        tag_name.to_ascii_lowercase().as_slice(),
        b"area"
            | b"base"
            | b"br"
            | b"col"
            | b"embed"
            | b"hr"
            | b"img"
            | b"input"
            | b"link"
            | b"meta"
            | b"param"
            | b"source"
            | b"track"
            | b"wbr"
    )
}
