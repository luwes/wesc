use lol_html::{element, HtmlRewriter, Settings};
use std::collections::HashMap;
use std::io::{self};

use crate::chunk_reader::ChunkReader;
use crate::CHUNK_SIZE;

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
pub fn find_component_definitions(
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
