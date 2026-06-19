use indexmap::IndexMap;
use lol_html::{element, HtmlRewriter, Settings};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::{self};
use std::path::Path;
use std::rc::Rc;

use crate::chunk_reader::ChunkReader;
use crate::CHUNK_SIZE;

// Store the definitions of the components.
// e.g. <link rel="definition" name="w-card" href="./card.html">
//
// Per-build, per-thread like the other caches, so concurrent builds stay
// isolated without locking. Cleared at the start of each build via
// [`clear_definitions`].
thread_local! {
    static DEFINITIONS: RefCell<HashMap<String, IndexMap<String, String>>> =
        RefCell::new(HashMap::new());
}

/// Drop all cached component definitions. Called at the start of each build.
pub fn clear_definitions() {
    DEFINITIONS.with(|cache| cache.borrow_mut().clear());
}

/// Resolve a component's `href` against the file that declared it.
pub fn resolve_href(declaring_file: &str, href: &str) -> String {
    Path::new(declaring_file)
        .parent()
        .unwrap()
        .join(href)
        .to_string_lossy()
        .into_owned()
}

pub fn get_component_file_path(current_file_path: &str, name: &str) -> Option<String> {
    let defs = find_component_definitions(current_file_path).unwrap();
    Some(resolve_href(current_file_path, &defs[name]))
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
    if let Some(defs) = DEFINITIONS.with(|cache| cache.borrow().get(file_path).cloned()) {
        return Ok(defs);
    }

    let mut reader = ChunkReader::new(file_path, CHUNK_SIZE).unwrap();
    let mut component_definitions: IndexMap<String, String> = IndexMap::new();
    let should_end = Rc::new(RefCell::new(false));

    let mut rewriter = HtmlRewriter::new(
        Settings::new()
            .append_element_content_handler(element!("link[rel=definition]", |el| {
                let href = el.get_attribute("href").unwrap();
                let name = el.get_attribute("name").unwrap();
                component_definitions.insert(name, href);
                Ok(())
            }))
            .append_element_content_handler(element!("body", |_el| {
                *should_end.borrow_mut() = true;
                Ok(())
            }))
            .append_element_content_handler(element!("template", |_el| {
                *should_end.borrow_mut() = true;
                Ok(())
            })),
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

    DEFINITIONS.with(|cache| {
        cache
            .borrow_mut()
            .insert(file_path.to_string(), component_definitions.clone());
    });

    Ok(component_definitions)
}
