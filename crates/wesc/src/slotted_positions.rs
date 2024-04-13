use lol_html::{element, HtmlRewriter, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::ops::Range;
use std::rc::Rc;
use std::sync::{LazyLock, Mutex};

use crate::chunk_reader::ChunkReader;
use crate::CHUNK_SIZE;
use crate::DEFAULT_SLOT_NAME;

// Store the slotted positions of the light DOM content of the component.
// There is a default slot and named slots that can have multiple ranges that are out-of-order.
static SLOTTED_POSITIONS: LazyLock<Mutex<HashMap<String, HashMap<String, Vec<Range<usize>>>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

fn pos_key(file_index: usize, file_path: &str) -> String {
    format!("{}:{}", file_index, file_path)
}

pub fn find_slotted_positions(
    read_position: usize,
    host_file_path: &str,
    component_name: &str,
    component_file_index: &usize,
    component_file_path: &str,
) -> io::Result<HashMap<String, Vec<Range<usize>>>> {
    let mut slotted_positions = SLOTTED_POSITIONS.lock().unwrap();

    let key = pos_key(*component_file_index, &component_file_path);

    // to cache this we still need to know the count of the element in the host file
    // because there can be multiple components with the same name
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
