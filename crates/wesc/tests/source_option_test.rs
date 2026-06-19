//! Tests for the in-memory `source` build option.
//!
//! Every *input* — the entry document and the component files it references — is
//! supplied through the `source` map (path -> contents), so the build never
//! reads inputs from the filesystem. This doubles as coverage for the
//! no-filesystem read path (e.g. a WebAssembly worker). The CSS tests request a
//! bundle via `outcss` (which also writes a temp file, removed afterwards) and
//! assert on the bundle returned in-memory via `Assets`.

use std::collections::HashMap;

use wesc::{build, BuildOptions};

#[test]
fn build_from_in_memory_source() {
    // The entry and the component it references are both served from the map.
    let entry = concat!(
        "<!doctype html>\n",
        "<html>\n",
        "  <head>\n",
        "    <link rel=\"definition\" name=\"w-card\" href=\"../components/card.html\">\n",
        "  </head>\n",
        "  <body>\n",
        "    <w-card><span slot=\"title\">Hello</span>Body copy.</w-card>\n",
        "  </body>\n",
        "</html>\n",
    );
    let card = concat!(
        "<template>\n",
        "  <article class=\"card\">\n",
        "    <h3><slot name=\"title\">Untitled</slot></h3>\n",
        "    <p><slot>No body.</slot></p>\n",
        "  </article>\n",
        "</template>\n",
    );

    let source = HashMap::from([
        (
            "/site/pages/index.html".to_string(),
            entry.as_bytes().to_vec(),
        ),
        (
            "/site/components/card.html".to_string(),
            card.as_bytes().to_vec(),
        ),
    ]);

    let mut html = Vec::new();
    build(
        BuildOptions {
            input: vec!["/site/pages/index.html".to_string()],
            source: Some(source),
            ..Default::default()
        },
        &mut |chunk: &[u8]| html.extend_from_slice(chunk),
    );

    let html = String::from_utf8(html).expect("valid utf8");
    assert!(html.contains("<article class=\"card\">"), "got: {html}");
    // The slotted element is projected with its `slot` attribute stripped.
    assert!(html.contains("<span>Hello</span>"), "got: {html}");
    assert!(html.contains("Body copy."), "got: {html}");
}

#[test]
fn empty_outcss_bundles_in_memory_without_writing() {
    // `Some("")` requests the bundle but writes no file: the CSS comes back in
    // `Assets.css`, and the build never touches the filesystem (so this also
    // works on targets without one). It must not panic trying to write "".
    let entry = concat!(
        "<!doctype html><html><head>",
        "<link rel=\"definition\" name=\"x-box\" href=\"box.html\">",
        "</head><body><x-box>Hi</x-box></body></html>",
    );
    let box_component = concat!(
        "<template><div class=\"box\"><slot></slot></div></template>\n",
        "<style>x-box .box { color: hotpink; }</style>\n",
    );

    let source = HashMap::from([
        ("/site/index.html".to_string(), entry.as_bytes().to_vec()),
        (
            "/site/box.html".to_string(),
            box_component.as_bytes().to_vec(),
        ),
    ]);

    let assets = build(
        BuildOptions {
            input: vec!["/site/index.html".to_string()],
            source: Some(source),
            outcss: Some(String::new()),
            ..Default::default()
        },
        &mut |_chunk: &[u8]| {},
    );

    // The bundle is returned in memory; nothing was written to disk.
    let css = assets.css.expect("empty outcss still bundles in memory");
    assert!(css.contains("x-box .box"), "css: {css}");
    assert!(css.contains("hotpink"), "css: {css}");
}

#[test]
fn build_returns_bundled_css_from_memory() {
    // Setting `outcss` requests the CSS bundle; `build` returns it in `Assets`
    // (and also writes it to the file). The in-memory source feeds both the HTML
    // expansion and the CSS bundling.
    let entry = concat!(
        "<!doctype html><html><head>",
        "<link rel=\"definition\" name=\"x-box\" href=\"box.html\">",
        "</head><body><x-box>Hi</x-box></body></html>",
    );
    let box_component = concat!(
        "<template><div class=\"box\"><slot></slot></div></template>\n",
        "<style>x-box .box { color: hotpink; }</style>\n",
    );

    let source = HashMap::from([
        ("/site/index.html".to_string(), entry.as_bytes().to_vec()),
        (
            "/site/box.html".to_string(),
            box_component.as_bytes().to_vec(),
        ),
    ]);

    let out_css = std::env::temp_dir().join(format!("wesc-src-css-{}.css", std::process::id()));
    let assets = build(
        BuildOptions {
            input: vec!["/site/index.html".to_string()],
            source: Some(source),
            outcss: Some(out_css.to_string_lossy().into_owned()),
            ..Default::default()
        },
        &mut |_chunk: &[u8]| {},
    );
    let _ = std::fs::remove_file(&out_css);

    let css = assets.css.expect("css requested");
    assert!(css.contains("x-box .box"), "css: {css}");
    assert!(css.contains("hotpink"), "css: {css}");
}

#[test]
fn bundled_css_keeps_nested_definitions_in_order_without_duplicates() {
    // Definition tree (the entry's own styles are never bundled):
    //
    //   index -> page  -> card -> icon
    //                  -> icon            (shared)
    //         -> footer -> icon           (shared)
    //
    // `x-icon` is a diamond dependency reached three ways. The CSS bundler must
    // emit each unique component's <style> exactly once, in dependency order.
    let source = HashMap::from([
        (
            "/site/index.html".to_string(),
            concat!(
                "<!doctype html><html><head>",
                "<link rel=\"definition\" name=\"x-page\" href=\"page.html\">",
                "<link rel=\"definition\" name=\"x-footer\" href=\"footer.html\">",
                "</head><body><x-page></x-page><x-footer></x-footer></body></html>",
            )
            .as_bytes()
            .to_vec(),
        ),
        (
            "/site/page.html".to_string(),
            concat!(
                "<link rel=\"definition\" name=\"x-card\" href=\"card.html\">",
                "<link rel=\"definition\" name=\"x-icon\" href=\"icon.html\">",
                "<template><div class=\"page\"><x-card></x-card><x-icon></x-icon></div></template>",
                "<style>.page { color: red; }</style>",
            )
            .as_bytes()
            .to_vec(),
        ),
        (
            "/site/card.html".to_string(),
            concat!(
                "<link rel=\"definition\" name=\"x-icon\" href=\"icon.html\">",
                "<template><div class=\"card\"><x-icon></x-icon></div></template>",
                "<style>.card { color: green; }</style>",
            )
            .as_bytes()
            .to_vec(),
        ),
        (
            "/site/footer.html".to_string(),
            concat!(
                "<link rel=\"definition\" name=\"x-icon\" href=\"icon.html\">",
                "<template><div class=\"footer\"><x-icon></x-icon></div></template>",
                "<style>.footer { color: blue; }</style>",
            )
            .as_bytes()
            .to_vec(),
        ),
        (
            "/site/icon.html".to_string(),
            concat!(
                "<template><svg class=\"icon\"></svg></template>",
                "<style>.icon { color: gold; }</style>",
            )
            .as_bytes()
            .to_vec(),
        ),
    ]);

    let out_css =
        std::env::temp_dir().join(format!("wesc-src-css-nested-{}.css", std::process::id()));
    let assets = build(
        BuildOptions {
            input: vec!["/site/index.html".to_string()],
            source: Some(source),
            outcss: Some(out_css.to_string_lossy().into_owned()),
            ..Default::default()
        },
        &mut |_chunk: &[u8]| {},
    );
    let _ = std::fs::remove_file(&out_css);
    let css = assets.css.expect("css requested");

    // The shared `x-icon` is bundled once despite three paths to it.
    assert_eq!(
        css.matches(".icon").count(),
        1,
        "shared dependency bundled more than once: {css}"
    );

    // Pre-order across the definition tree: page, then its child card, then the
    // shared icon (first reached through card), then footer.
    let page = css.find(".page").expect("page style");
    let card = css.find(".card").expect("card style");
    let icon = css.find(".icon").expect("icon style");
    let footer = css.find(".footer").expect("footer style");
    assert!(
        page < card && card < icon && icon < footer,
        "styles out of dependency order: {css}"
    );
}
