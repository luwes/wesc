//! Low-level byte scanning over cached file contents.
//!
//! These helpers operate directly on raw HTML bytes (as opposed to the
//! `lol_html`-based streaming scanner in [`crate::write_tags`]). They are used
//! by the component-expansion engine and the simple-template fast path to
//! locate tags, read attribute values, and emit verbatim byte ranges.

use std::collections::HashMap;
use std::io;
use std::ops::Range;

use crate::chunk_reader::read_file_cached;
use crate::Tag;

/// Emit the raw bytes of a file range verbatim (used to pass through nested
/// `<template>` open/close tags without losing attribute fidelity).
pub(crate) fn write_file_range(
    file_path: &str,
    range: &Range<usize>,
    output_handler: &mut impl FnMut(&[u8]),
) {
    if let Ok(bytes) = read_file_cached(file_path) {
        if range.end <= bytes.len() {
            output_handler(&bytes[range.start..range.end]);
        }
    }
}

pub(crate) fn write_start_tag_with_optional_slot_attribute(
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

pub(crate) fn strip_slot_attribute_from_start_tag(start_tag: &[u8]) -> Vec<u8> {
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

pub(crate) fn find_start_tag(bytes: &[u8], start: usize, tag_name: &[u8]) -> Option<usize> {
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

pub(crate) fn find_end_tag(bytes: &[u8], start: usize, tag_name: &[u8]) -> Option<usize> {
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

pub(crate) fn find_next_byte(bytes: &[u8], start: usize, needle: u8) -> Option<usize> {
    memchr::memchr(needle, bytes.get(start..)?).map(|offset| start + offset)
}

pub(crate) fn find_tag_end(bytes: &[u8], start: usize) -> Option<usize> {
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

pub(crate) fn is_self_closing_start_tag(start_tag: &[u8]) -> bool {
    let mut pos = start_tag.len().saturating_sub(1);
    while pos > 0 && start_tag[pos].is_ascii_whitespace() {
        pos -= 1;
    }
    pos > 0 && start_tag[pos] == b'>' && start_tag[pos - 1] == b'/'
}

pub(crate) fn get_attribute_value(start_tag: &[u8], attr_name: &[u8]) -> Option<String> {
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

/// Parse every attribute of a start tag into a name -> value map.
///
/// Names are lowercased to mirror `lol_html`'s `Attribute::name()`, which the
/// expansion engine relies on (it looks up `"shadowrootmode"`, `"w-trim"`,
/// `"name"`, `"slot"`, all lowercase). Values are kept verbatim.
pub(crate) fn parse_start_tag_attributes(start_tag: &[u8]) -> HashMap<String, String> {
    let mut attributes = HashMap::new();

    // Skip `<` and the tag name.
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
            break;
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

            value = std::str::from_utf8(&start_tag[value_start..value_end]).unwrap_or("");
        }

        if name_end > name_start {
            let name = String::from_utf8_lossy(&start_tag[name_start..name_end]).to_ascii_lowercase();
            attributes.entry(name).or_insert_with(|| value.to_string());
        }
    }

    attributes
}

/// Byte-scan fast path for `read_until_start_tag(file, 0, &["root > template"], "")`.
///
/// Finds the first start tag named `tag_name` in the file and returns it as a
/// [`Tag`] with parsed attributes and a position spanning the start tag. For
/// the component files this is used on, the first such tag is the top-level one,
/// matching the `root > template` selector the `lol_html` scanner used.
pub(crate) fn read_first_start_tag(file_path: &str, tag_name: &[u8]) -> io::Result<Tag> {
    let bytes = read_file_cached(file_path)?;

    let tag_start =
        find_start_tag(&bytes, 0, tag_name).ok_or_else(|| io::Error::other("tag not found"))?;
    let tag_end = find_tag_end(&bytes, tag_start).ok_or_else(|| io::Error::other("tag not found"))?;

    Ok(Tag {
        tag_name: String::from_utf8_lossy(tag_name).into_owned(),
        is_end_tag: false,
        can_have_content: true,
        attributes: parse_start_tag_attributes(&bytes[tag_start..tag_end]),
        position: tag_start..tag_end,
    })
}

/// Byte-scan fast path for `read_until_end_tag(file, position, &[tag], "<tag>")`.
///
/// The `lol_html` scanner for that selector shape pauses at the *first* tag
/// named `tag_name` (start or end) at or after `position` — it does not
/// depth-count, because by the time the caller looks for a component's own end
/// tag, any nested same-name elements have already been consumed. This
/// reproduces that exactly: it returns the first such tag, flagged as a start or
/// end tag, with a position whose `end` sits just past the tag's `>`.
pub(crate) fn read_next_tag_named(
    file_path: &str,
    position: usize,
    tag_name: &[u8],
) -> io::Result<Tag> {
    let bytes = read_file_cached(file_path)?;

    // Single forward pass: stop at the first `<tag` or `</tag>` from `position`,
    // rather than scanning the whole file twice. Scanning for a start and an end
    // tag independently would walk to EOF whenever one of them is absent (e.g. a
    // component that appears once in a large host document), which is the common
    // case for the end-tag lookups this serves.
    let mut pos = position;
    while let Some(lt) = find_next_byte(&bytes, pos, b'<') {
        let is_end = bytes.get(lt + 1) == Some(&b'/');
        let name_start = if is_end { lt + 2 } else { lt + 1 };
        let name_end = name_start + tag_name.len();

        if name_end <= bytes.len()
            && bytes[name_start..name_end].eq_ignore_ascii_case(tag_name)
            && (name_end == bytes.len()
                || bytes[name_end].is_ascii_whitespace()
                || bytes[name_end] == b'>'
                || (!is_end && bytes[name_end] == b'/'))
        {
            let tag_end =
                find_tag_end(&bytes, lt).ok_or_else(|| io::Error::other("tag not found"))?;
            return Ok(Tag {
                tag_name: String::from_utf8_lossy(tag_name).into_owned(),
                is_end_tag: is_end,
                can_have_content: true,
                attributes: HashMap::new(),
                position: lt..tag_end,
            });
        }

        pos = lt + 1;
    }

    Err(io::Error::other("tag not found"))
}

pub(crate) fn contains_start_tag(bytes: &[u8], tag_name: &[u8]) -> bool {
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
