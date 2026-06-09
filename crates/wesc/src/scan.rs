//! Low-level byte scanning over cached file contents.
//!
//! These helpers operate directly on raw HTML bytes (as opposed to the
//! `lol_html`-based streaming scanner in [`crate::write_tags`]). They are used
//! by the component-expansion engine and the simple-template fast path to
//! locate tags, read attribute values, and emit verbatim byte ranges.

use std::ops::Range;

use crate::chunk_reader::read_file_cached;

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
    bytes
        .get(start..)?
        .iter()
        .position(|byte| *byte == needle)
        .map(|offset| start + offset)
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
