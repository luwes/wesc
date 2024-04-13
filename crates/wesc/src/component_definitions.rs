use indexmap::IndexMap;
use lol_html::{element, HtmlRewriter, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::path::Path;
use std::rc::Rc;
use std::sync::{LazyLock, Mutex};

use crate::chunk_reader::ChunkReader;
use crate::CHUNK_SIZE;

// Store the definitions of the components.
// e.g. <link rel="definition" name="w-card" href="./card.html">
static DEFINITIONS: LazyLock<Mutex<HashMap<String, IndexMap<String, String>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

pub fn get_component_file_path(current_file_path: &str, name: &str) -> Option<String> {
    let dir = Path::new(&current_file_path).parent().unwrap();
    let defs = find_component_definitions(current_file_path).unwrap();
    let component_href = defs[name].as_str();
    let component_href = Path::new(component_href);
    let component_file_path = dir.join(&component_href);
    component_file_path.to_string_lossy().to_string().into()
}

pub fn find_component_definition_names(file_path: &str) -> io::Result<Vec<String>> {
    let defs = find_component_definitions(file_path)?;

    Ok(defs.keys().cloned().collect())
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
pub fn find_component_definitions(file_path: &str) -> io::Result<IndexMap<String, String>> {
    let mut defs = DEFINITIONS.lock().unwrap();

    if defs.contains_key(file_path) {
        return Ok(defs[file_path].clone());
    }

    let mut reader = ChunkReader::new(file_path, CHUNK_SIZE).unwrap();
    let mut component_definitions: IndexMap<String, String> = IndexMap::new();
    let should_end = Rc::new(RefCell::new(false));

    let mut rewriter = HtmlRewriter::new(
        Settings {
            element_content_handlers: vec![
                element!("link[rel=definition]", |el| {
                    let href = el.get_attribute("href").unwrap();
                    let name = el.get_attribute("name").unwrap();
                    component_definitions.insert(name, href);
                    Ok(())
                }),
                element!("body", |_el| {
                    *should_end.borrow_mut() = true;
                    Ok(())
                }),
                element!("template", |_el| {
                    *should_end.borrow_mut() = true;
                    Ok(())
                }),
            ],
            ..Settings::default()
        },
        |_c: &[u8]| {},
    );

    loop {
        if *should_end.borrow() {
            break;
        }

        if let Some(chunk) = reader.read_next_chunk()? {
            rewriter.write(&chunk).unwrap();
        } else {
            break;
        }
    }

    rewriter.end().unwrap();

    defs.insert(file_path.to_string(), component_definitions.clone());

    Ok(component_definitions)
}
