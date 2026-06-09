//! The core component-expansion engine.
//!
//! Given a host file positioned at a custom-element start tag, these functions
//! locate the component's definition, expand its `<template>` into the output
//! stream, resolve nested components and `<slot>`s, and emit the matching end
//! tag. They are mutually recursive with the slot logic in [`crate::slots`].
//!
//! The shared build state (file indexes, read positions, tag stacks, dep graph,
//! options) is threaded through every call as a single [`BuildCtx`]. The output
//! sink stays a separate argument: streaming writes borrow it mutably while
//! other code reads the context, so keeping them apart avoids aliasing.

use crate::build::BuildCtx;
use crate::component_definitions::{find_component_definition_names, get_component_file_path};
use crate::scan::{
    read_first_start_tag, read_next_tag_named, write_file_range,
    write_start_tag_with_optional_slot_attribute,
};
use crate::simple_template::{get_simple_template, render_simple_template};
use crate::slots::build_component_content;
use crate::slotted_positions::find_slotted_positions;
use crate::write_tags::{write_until_end_tag, write_until_start_tag, write_until_tag};
use crate::{pos_key, Tag};

pub(crate) fn build_component(
    host_file_path: &str,
    ctx: &mut BuildCtx,
    output_handler: &mut impl FnMut(&[u8]),
) -> bool {
    build_component_with_start_options(host_file_path, ctx, false, output_handler)
}

pub(crate) fn build_component_with_start_options(
    host_file_path: &str,
    ctx: &mut BuildCtx,
    strip_component_slot_attribute: bool,
    output_handler: &mut impl FnMut(&[u8]),
) -> bool {
    // Find the component definitions in the host file.
    let host_definition_names = find_component_definition_names(host_file_path).unwrap();

    let host_file_index = ctx.file_indexes[host_file_path];
    let host_pos_key = pos_key(host_file_index, host_file_path);

    // Write until after the start tag of a component.
    let component_tag = write_until_start_tag(
        host_file_path,
        ctx.read_positions[&host_pos_key],
        &host_definition_names,
        "",
        false,
        output_handler,
    );

    let component_tag = match component_tag {
        Ok(tag) => tag,
        Err(_error) => return true,
    };

    if !component_tag.attributes.contains_key("w-trim") {
        write_start_tag_with_optional_slot_attribute(
            host_file_path,
            &component_tag.position,
            strip_component_slot_attribute,
            output_handler,
        );
    }

    // Save the end position of the start tag of the component.
    ctx.read_positions
        .insert(host_pos_key.clone(), component_tag.position.end);

    // Push the component tag name onto the stack.
    ctx.tag_stacks
        .entry(host_file_path.to_string())
        .or_default()
        .push(component_tag.tag_name.clone());

    let component_name = &component_tag.tag_name;

    // Find the file path of the component.
    let component_file_path = get_component_file_path(host_file_path, component_name).unwrap();

    // Get the file index and increase it by 1 or if it doesn't exist insert 0.
    let component_file_index = *ctx
        .file_indexes
        .entry(component_file_path.to_string())
        .and_modify(|i| *i += 1)
        .or_insert(0);
    let component_pos_key = pos_key(component_file_index, &component_file_path);
    let component_definition_names = find_component_definition_names(&component_file_path).unwrap();

    let mut component_slotted_positions = find_slotted_positions(
        component_tag.position.start,
        host_file_path,
        component_name,
        &component_file_index,
        &component_file_path,
    )
    .unwrap();

    if let Some(simple_template) =
        get_simple_template(&component_file_path, &component_definition_names)
    {
        render_simple_template(
            &simple_template,
            &component_file_path,
            host_file_path,
            &component_tag.tag_name,
            ctx,
            &mut component_slotted_positions,
            output_handler,
        );
        finish_component(host_file_path, &component_file_path, &component_tag, ctx, output_handler);
        return false;
    }

    // Read until after the start tag of the <template>.
    let root_tag = read_first_start_tag(&component_file_path, b"template").unwrap();

    let has_shadowrootmode =
        root_tag.tag_name == "template" && root_tag.attributes.contains_key("shadowrootmode");

    let mut component_until_start_tags = component_definition_names.clone();
    component_until_start_tags.push("root > template".to_owned());
    // Stop on nested <template> tags too, so their depth can be tracked (see the
    // template handling in the loop below).
    component_until_start_tags.push("template".to_owned());

    if has_shadowrootmode {
        output_handler(b"\n");
        write_until_start_tag(
            &component_file_path,
            0,
            &["root > template"],
            "",
            true,
            output_handler,
        )
        .unwrap();
    } else {
        component_until_start_tags.push("slot".to_owned());
    }

    // Save the end position of the start tag of the template.
    ctx.read_positions
        .insert(component_pos_key.clone(), root_tag.position.end);

    // Depth of nested <template> elements within the component body.
    let mut template_depth: usize = 0;

    loop {
        let tag = write_until_tag(
            &component_file_path,
            ctx.read_positions[&component_pos_key],
            &component_until_start_tags,
            &["root > template"],
            "<template>",
            false,
            output_handler,
        );

        let tag = match tag {
            Ok(tag) => tag,
            Err(_error) => break false,
        };

        ctx.read_positions
            .insert(component_pos_key.clone(), tag.position.end);

        // A nested <template> in the component body: emit it verbatim and track
        // its depth. Because the body is parsed in fragments (each component
        // expansion restarts the parser with an injected `<template>` prefix), a
        // nested </template> would otherwise be mistaken for the component's own
        // root template close, truncating everything after it.
        if tag.tag_name == "template" && !tag.is_end_tag {
            write_file_range(&component_file_path, &tag.position, output_handler);
            template_depth += 1;
            continue;
        }

        if tag.tag_name == "template" && tag.is_end_tag && template_depth > 0 {
            write_file_range(&component_file_path, &tag.position, output_handler);
            template_depth -= 1;
            continue;
        }

        if tag.tag_name == "template" && tag.is_end_tag {
            if has_shadowrootmode {
                output_handler(b"</template>\n");

                // Declarative Shadow DOM: the `<template shadowrootmode>` becomes
                // the shadow root, and the host's light-DOM children stay put as
                // direct children of the element (the browser assigns them to the
                // shadow `<slot>`s at runtime). Emit that light DOM verbatim,
                // expanding any nested custom elements it contains.
                write_shadow_light_dom(
                    host_file_path,
                    ctx,
                    &host_definition_names,
                    &component_tag,
                    output_handler,
                );
            }

            finish_component(host_file_path, &component_file_path, &component_tag, ctx, output_handler);

            break false;
        }

        if component_definition_names.contains(&tag.tag_name) {
            ctx.read_positions
                .insert(component_pos_key.clone(), tag.position.start);
            build_component(&component_file_path, ctx, output_handler);
            continue;
        }

        if tag.tag_name == "slot" {
            let host_start_pos = ctx.read_positions[&host_pos_key];
            let slot_name = tag.attributes.get("name");

            while let Some(light_tag) = build_component_content(
                slot_name,
                host_file_path,
                ctx,
                &mut component_slotted_positions,
                output_handler,
            ) {
                if light_tag.is_end_tag && light_tag.tag_name == component_tag.tag_name {
                    break;
                }
            }

            // Emit the fallback slot content only when nothing was slotted (the
            // host read position didn't move). Precomputed so the streaming
            // closure below doesn't need to borrow the context.
            let host_unchanged = ctx.read_positions[&host_pos_key] == host_start_pos;
            if let Ok(end_slot_tag) = write_until_end_tag(
                &component_file_path,
                ctx.read_positions[&component_pos_key],
                &["slot"],
                "<slot>",
                false,
                &mut |chunk: &[u8]| {
                    if host_unchanged {
                        output_handler(chunk);
                    }
                },
            ) {
                ctx.read_positions
                    .insert(component_pos_key.clone(), end_slot_tag.position.end);
            }
        }
    }
}

/// Stream a Declarative-Shadow-DOM component's light-DOM children to the output.
///
/// Unlike a light-DOM component (whose `<slot>`s pull host content in and whose
/// unmatched light DOM is dropped), a shadow component keeps its light DOM as
/// host children so the browser can slot them at runtime. This walks the host
/// from just after the component's start tag to its matching end tag, writing
/// everything verbatim while expanding any nested custom elements in place. It
/// stops just before the end tag, leaving it for [`finish_component`].
fn write_shadow_light_dom(
    host_file_path: &str,
    ctx: &mut BuildCtx,
    host_definition_names: &[String],
    component_tag: &Tag,
    output_handler: &mut impl FnMut(&[u8]),
) {
    let host_pos_key = pos_key(ctx.file_indexes[host_file_path], host_file_path);
    let end_tag_names = [component_tag.tag_name.clone()];
    // Injected so the streaming scanner has an open element to match the
    // component's own end tag against (without it, the leading `</component>`
    // of an empty element looks like a stray close tag and is skipped, making
    // the scan overrun into the rest of the file).
    let prefix = format!("<{}>", component_tag.tag_name);

    loop {
        let tag = write_until_tag(
            host_file_path,
            ctx.read_positions[&host_pos_key],
            host_definition_names,
            &end_tag_names,
            &prefix,
            false,
            output_handler,
        );

        let tag = match tag {
            Ok(tag) => tag,
            Err(_error) => break,
        };

        // The component's own end tag: stop, leaving it for `finish_component`.
        if tag.is_end_tag && tag.tag_name == component_tag.tag_name {
            ctx.read_positions
                .insert(host_pos_key.clone(), tag.position.start);
            break;
        }

        // A nested custom element in the light DOM: expand it in place. Its own
        // expansion advances the host read position past its end tag.
        if !tag.is_end_tag && host_definition_names.contains(&tag.tag_name) {
            ctx.read_positions
                .insert(host_pos_key.clone(), tag.position.start);
            build_component(host_file_path, ctx, output_handler);
            continue;
        }

        ctx.read_positions
            .insert(host_pos_key.clone(), tag.position.end);
    }
}

pub(crate) fn finish_component(
    host_file_path: &str,
    component_file_path: &str,
    component_tag: &Tag,
    ctx: &mut BuildCtx,
    output_handler: &mut impl FnMut(&[u8]),
) {
    let host_pos_key = pos_key(ctx.file_indexes[host_file_path], host_file_path);

    // Advance the host past this component's own end tag. Match specifically on
    // the component's tag name (not every known definition): by the time we get
    // here any nested components in the light DOM have already been expanded and
    // consumed, so the next tag with this name is the component's own close.
    // Matching any definition's end tag would instead stop early at a nested
    // `</child>` when slot resolution left the read position rewound inside the
    // light DOM (e.g. a named slot ordered after the default slot), which would
    // then re-emit the trailing light DOM as top-level components.
    if let Ok(component_end_tag) = read_next_tag_named(
        host_file_path,
        ctx.read_positions[&host_pos_key],
        component_tag.tag_name.as_bytes(),
    ) {
        // Pop the component tag name off the stack.
        ctx.tag_stacks
            .entry(host_file_path.to_string())
            .or_default()
            .pop();

        // Decrease file index by 1 if the component ends.
        if let Some(value) = ctx.file_indexes.get_mut(component_file_path) {
            if *value > 0 {
                *value -= 1;
            }
        }

        if !component_tag.attributes.contains_key("w-trim") {
            output_handler(format!("</{}>", component_tag.tag_name).as_bytes());
        }

        ctx.read_positions
            .insert(host_pos_key.clone(), component_end_tag.position.end);
    }
}
