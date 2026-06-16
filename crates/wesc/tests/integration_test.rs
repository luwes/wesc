//! Fixture-driven integration tests for the `wesc` bundler.
//!
//! Each `tests/fixtures/<name>/index.html` is built and its streamed HTML (plus
//! any bundled CSS/JS) is compared against the committed `expected.*` files.
//! Both the expected files and the actual output are run through `oxfmt`, so the
//! fixtures stay readable and diffs are clean regardless of the bundler's raw
//! whitespace.
//!
//! To refresh the expected files after an intentional change, format the new
//! output with `oxfmt` and write it back (the generated `blog` fixture also has
//! `tests/fixtures/blog/generate.mjs`).

#[cfg(test)]
use pretty_assertions::assert_eq;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{LazyLock, Mutex};
use std::{fs, io::Write};
use wesc::{build, BuildOptions, CHUNK_SIZE, DEFAULT_SLOT_NAME};

// ===========================================================================
// Tests
// ===========================================================================

// HTML-only fixtures.
#[test] fn no_components() { assert_html("no-components"); }
#[test] fn named_slot() { assert_html("named-slot"); }
#[test] fn named_slot_nesting() { assert_html("named-slot-nesting"); }
#[test] fn default_slot_fallback() { assert_html("default-slot-fallback"); }
#[test] fn light_dom_nesting() { assert_html("light-dom-nesting"); }
#[test] fn slot_forwarding() { assert_html("slot-forwarding"); }
#[test] fn nested_template() { assert_html("nested-template"); }
#[test] fn shadow_template() { assert_html("shadow-template"); }
#[test] fn layouts() { assert_html("layouts"); }
#[test] fn real_world() { assert_html("real-world"); }

// Fixtures that also bundle CSS.
#[test] fn default_slot() { assert_html_and_css("default-slot"); }
#[test] fn style_tags() { assert_html_and_css("style-tags"); }

// Fixtures that bundle CSS and JS.
#[test] fn script_tags() { assert_bundle("script-tags"); }
#[test] fn ts_script_tags() { assert_bundle("ts-script-tags"); }
#[test] fn todo_app() { assert_bundle("todo-app"); }
#[test] fn blog() { assert_bundle("blog"); }

#[test]
fn named_slot_layout() {
    // Regression for two slot bugs: (1) a `w-trim` layout with named slots the
    // host fills out of order, plus a named slot left empty — this used to panic
    // on the missing slot entry; (2) components nested through several default
    // slots (layout > list > item) were re-emitted after the layout's close tag,
    // because a component's end was located via any definition's end tag.
    assert_html("named-slot-layout");
}

#[test]
fn template_passthrough() {
    // Regression: (1) a component body that nests a <template> containing another
    // component — the nested </template> must not be read as the component's own
    // root-template close; (2) a component declared in two files must have its
    // styles bundled only once.
    assert_html_and_css("template-passthrough");
}

#[test]
fn minify_js() {
    let dir = fixture_dir("todo-app");
    let minified = run_build(&dir.join("index.html"), false, true, true)
        .js
        .expect("minified JS should be bundled");

    assert_eq!(minified, read(dir.join("expected.min.js")));
    assert!(
        minified.len() < read(dir.join("expected.js")).len(),
        "minified JS should be smaller than the readable bundle"
    );
    assert!(!minified.contains("//#region"), "region markers should be stripped");
}

#[test]
fn absolute_entry_path() {
    // Regression: an absolute entry path (as a server passes) must not break the
    // JS bundler. Extracted component JS must stay inside the `.wesc` mirror, not
    // get scattered next to the source files (which used to panic the bundler).
    let dir = fixture_dir("todo-app");
    let entry = fs::canonicalize(dir.join("index.html")).expect("fixture should exist");
    let out = run_build(&entry, false, true, false);

    assert!(out.js.unwrap().contains("customElements.define"));
    assert!(out.html.contains("class=\"todoapp\""));
    assert!(
        !dir.join("todo-app.js").exists(),
        "extracted JS must not be written next to the source"
    );
}

#[test]
fn scriptless_component() {
    // Regression: a `rel="definition"` component with no top-level <script> (e.g.
    // styles only) must not make the bundler import a never-written `.js`.
    let dir = fixture_dir("scriptless-component");
    let out = run_build(&dir.join("index.html"), false, true, false);

    assert!(out.js.unwrap().contains("customElements.define"));
    assert!(out.html.contains("class=\"wrap\""));
    assert!(out.html.contains("<button part=\"button\">"));
}

#[test]
fn definition_manifest_assets() {
    // An asset-only manifest may contain only rel=definition links. It emits no
    // HTML, but still resolves the dependency graph and builds the CSS/JS side
    // outputs for those definitions.
    let dir = fixture_dir("definition-manifest");
    let out = run_build(&dir.join("index.html"), true, true, false);

    assert!(out.html.trim().is_empty());
    assert!(out.css.unwrap().contains("x-badge .badge"));
    let js = out.js.unwrap();
    assert!(js.contains("customElements.define"));
    assert!(js.contains("x-badge"));
}

#[test]
fn comments_before_component_template() {
    // Component definition files may carry documentation comments before their
    // root <template>. Tag-looking text inside those comments must not be
    // mistaken for real markup, and the pre-template comments are not emitted.
    let dir = fixture_dir("comments-before-template");
    let out = run_build(&dir.join("index.html"), true, true, false);

    assert!(out.html.contains("<article class=\"card\">"));
    assert!(out.html.contains("<span>Hello</span>"));
    assert!(out.html.contains("Body copy."));
    assert!(!out.html.contains("This leading comment must be ignored"));
    assert!(out.css.unwrap().contains("x-card .card"));
    let js = out.js.unwrap();
    assert!(js.contains("customElements.define"));
    assert!(js.contains("x-card"));
}

#[test]
fn build_from_memory_source() {
    // A build can draw its inputs from an in-memory `Source` instead of disk,
    // which is what a no-filesystem target (e.g. a WebAssembly worker) needs.
    // The component href uses `..`, exercising path normalization.
    use wesc::chunk_reader::MemorySource;
    use wesc::build_with_source;

    let source = MemorySource::new()
        .with(
            "/site/pages/index.html",
            concat!(
                "<!doctype html>\n",
                "<html>\n",
                "  <head>\n",
                "    <link rel=\"definition\" name=\"w-card\" href=\"../components/card.html\">\n",
                "  </head>\n",
                "  <body>\n",
                "    <w-card><span slot=\"title\">Hello</span>Body copy.</w-card>\n",
                "  </body>\n",
                "</html>\n",
            ),
        )
        .with(
            "/site/components/card.html",
            concat!(
                "<template>\n",
                "  <article class=\"card\">\n",
                "    <h3><slot name=\"title\">Untitled</slot></h3>\n",
                "    <p><slot>No body.</slot></p>\n",
                "  </article>\n",
                "</template>\n",
            ),
        );

    let mut html = Vec::new();
    build_with_source(
        BuildOptions {
            input: vec!["/site/pages/index.html".to_string()],
            outcss: None,
            outjs: None,
            cwd: Some("/site/pages".to_string()),
            minify: false,
        },
        source,
        &mut |chunk: &[u8]| html.extend_from_slice(chunk),
    );

    let html = String::from_utf8(html).expect("valid utf8");
    assert!(html.contains("<article class=\"card\">"), "got: {html}");
    // The slotted element is projected with its `slot` attribute stripped.
    assert!(html.contains("<span>Hello</span>"), "got: {html}");
    assert!(html.contains("Body copy."), "got: {html}");
}

#[test]
fn collect_css_in_memory() {
    // CSS bundling without a filesystem: the component's top-level <style> is
    // collected into the returned Assets while the HTML streams as usual. No
    // rolldown/threads, so this is also the wasm-capable path.
    use wesc::build_in_memory;
    use wesc::chunk_reader::MemorySource;

    let source = MemorySource::new()
        .with(
            "/app/index.html",
            concat!(
                "<!doctype html>\n",
                "<html>\n",
                "  <head>\n",
                "    <link rel=\"definition\" name=\"x-box\" href=\"./box.html\">\n",
                "  </head>\n",
                "  <body><x-box>Hi</x-box></body>\n",
                "</html>\n",
            ),
        )
        .with(
            "/app/box.html",
            concat!(
                "<template><div class=\"box\"><slot></slot></div></template>\n",
                "<style>\n",
                "  x-box .box {\n",
                "    color: hotpink;\n",
                "  }\n",
                "</style>\n",
            ),
        );

    let mut html = Vec::new();
    let assets = build_in_memory(
        BuildOptions {
            input: vec!["/app/index.html".to_string()],
            outcss: None, // ignored; CSS is returned in assets
            outjs: None,
            cwd: Some("/app".to_string()),
            minify: false,
        },
        source,
        &mut |chunk: &[u8]| html.extend_from_slice(chunk),
    );

    let html = String::from_utf8(html).expect("valid utf8");
    assert!(html.contains("<div class=\"box\">"), "got: {html}");

    let css = String::from_utf8(assets.css).expect("valid utf8");
    assert!(css.contains("x-box .box"), "css: {css}");
    assert!(css.contains("hotpink"), "css: {css}");
}

#[test]
fn utf8_slotted_text_split_across_chunks() {
    // A multi-byte character straddling a chunk boundary must not panic the
    // slotted-position scanner.
    let dir = std::env::temp_dir().join(format!("wesc-utf8-slotted-text-{}", std::process::id()));
    fs::create_dir_all(&dir).expect("temp fixture dir should be created");

    let host = dir.join("index.html");
    let start = "<w-card>";
    let padding = "a".repeat(CHUNK_SIZE - start.len() - 1);
    fs::write(&host, format!("{start}{padding}ü · Zürich</w-card>")).expect("write host fixture");

    let positions = wesc::slotted_positions::find_slotted_positions(
        0,
        host.to_str().unwrap(),
        "w-card",
        &0,
        dir.join("card.html").to_str().unwrap(),
    )
    .expect("UTF-8 split across chunks should not panic");

    let ranges = positions.get(DEFAULT_SLOT_NAME).expect("default slot range");
    assert_eq!(ranges.len(), 1);
    assert!(ranges[0].end > ranges[0].start);

    fs::remove_dir_all(&dir).expect("temp fixture should be removed");
}

#[test]
fn concurrent_builds_are_isolated() {
    // Independent HTML-only builds on separate threads must not interfere: the
    // caches are thread-local, and an HTML-only build writes nothing to the
    // shared `.wesc` scratch directory (JS extraction is skipped without
    // `outjs`). `script-tags` has components with top-level <script>, so before
    // that skip these concurrent builds raced on `.wesc/scripts/*.js`.
    //
    // Build the same fixture on many threads at once — deliberately *without*
    // the harness BUILD_LOCK, so the concurrency is real — and assert every
    // thread matches a single-threaded build. A regression (shared global cache
    // or shared scratch file) would surface as garbled HTML or a panic.
    let entry = fixture_dir("script-tags").join("index.html");
    let reference = build_html_only(&entry);

    let handles: Vec<_> = (0..16)
        .map(|_| {
            let entry = entry.clone();
            std::thread::spawn(move || build_html_only(&entry))
        })
        .collect();

    for handle in handles {
        let html = handle.join().expect("a concurrent build panicked");
        assert_eq!(html, reference, "a concurrent build diverged from the single-threaded output");
    }
}

// ===========================================================================
// Harness
// ===========================================================================

const FIXTURES: &str = "./tests/fixtures";

/// Serializes builds that emit CSS/JS. Each build now scopes its `.wesc` scratch
/// tree to its own fixture folder (via `cwd`), but several tests build the *same*
/// fixture, so they'd still share that folder — the lock keeps them from racing.
/// The in-memory caches are thread-local and need no locking (see
/// `concurrent_builds_are_isolated`), but the filesystem scratch space still does.
static BUILD_LOCK: LazyLock<Mutex<()>> = LazyLock::new(|| Mutex::new(()));

/// Makes each build's temp output paths unique so the reads that happen after
/// the lock is released can never collide.
static OUTPUT_SEQ: AtomicU64 = AtomicU64::new(0);

fn fixture_dir(name: &str) -> PathBuf {
    Path::new(FIXTURES).join(name)
}

fn assert_html(name: &str) {
    assert_fixture(name, false, false);
}

fn assert_html_and_css(name: &str) {
    assert_fixture(name, true, false);
}

fn assert_bundle(name: &str) {
    assert_fixture(name, true, true);
}

/// Build `<name>/index.html` and assert each output matches the pre-formatted
/// `expected.*` file beside it.
fn assert_fixture(name: &str, css: bool, js: bool) {
    let dir = fixture_dir(name);
    let out = run_build(&dir.join("index.html"), css, js, false);

    assert_matches(&out.html, dir.join("expected.html"), Lang::Html);
    if let Some(css) = out.css {
        assert_matches(&css, dir.join("expected.css"), Lang::Css);
    }
    if let Some(js) = out.js {
        assert_matches(&js, dir.join("expected.js"), Lang::Js);
    }
}

/// Format `actual` and assert it equals the (already formatted) expected file.
fn assert_matches(actual: &str, expected_path: PathBuf, lang: Lang) {
    assert_eq!(
        oxfmt(actual, lang),
        read(&expected_path),
        "{} did not match",
        expected_path.display()
    );
}

/// The streamed HTML and any bundled assets produced by a single build.
struct Output {
    html: String,
    css: Option<String>,
    js: Option<String>,
}

/// Run one build, returning its HTML and (optionally) its bundled CSS/JS.
///
/// CSS/JS go to unique temp files that are read and removed here, so tests never
/// leave artifacts in the fixtures. Only the build itself is serialized; the
/// unique temp outputs are safe to read once the lock is released.
fn run_build(entry: &Path, want_css: bool, want_js: bool, minify: bool) -> Output {
    let css_path = want_css.then(|| temp_path("css"));
    let js_path = want_js.then(|| temp_path("js"));
    let (cwd, entry_point) = entry_in_cwd(entry);

    let mut html = Vec::new();
    {
        let _lock = BUILD_LOCK.lock().unwrap();
        build(
            BuildOptions {
                input: vec![entry_point],
                outcss: css_path.as_deref().map(path_string),
                outjs: js_path.as_deref().map(path_string),
                cwd,
                minify,
            },
            &mut |chunk: &[u8]| html.extend_from_slice(chunk),
        );
    }

    Output {
        html: String::from_utf8_lossy(&html).into_owned(),
        css: css_path.map(read_and_remove),
        js: js_path.map(read_and_remove),
    }
}

/// Build an entry to HTML only (no CSS/JS outputs, so no `.wesc` scratch files),
/// bypassing the harness build lock so concurrency is actually tested.
fn build_html_only(entry: &Path) -> String {
    let (cwd, entry_point) = entry_in_cwd(entry);
    let mut html = Vec::new();
    build(
        BuildOptions {
            input: vec![entry_point],
            outcss: None,
            outjs: None,
            cwd,
            minify: false,
        },
        &mut |chunk: &[u8]| html.extend_from_slice(chunk),
    );
    String::from_utf8_lossy(&html).into_owned()
}

/// Split an entry path into its `cwd` (the fixture folder) and the entry file
/// name, so each fixture build runs with its working directory set to the
/// fixture folder — where its `.wesc` scratch tree then lives.
fn entry_in_cwd(entry: &Path) -> (Option<String>, String) {
    let cwd = entry.parent().map(path_string);
    let name = entry
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| entry.to_string_lossy().into_owned());
    (cwd, name)
}

fn temp_path(ext: &str) -> PathBuf {
    let seq = OUTPUT_SEQ.fetch_add(1, Ordering::Relaxed);
    std::env::temp_dir().join(format!("wesc-test-{}-{seq}.{ext}", std::process::id()))
}

fn path_string(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}

fn read(path: impl AsRef<Path>) -> String {
    let path = path.as_ref();
    fs::read_to_string(path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()))
}

fn read_and_remove(path: PathBuf) -> String {
    let contents = read(&path);
    let _ = fs::remove_file(&path);
    contents
}

#[derive(Clone, Copy)]
enum Lang {
    Html,
    Css,
    Js,
}

impl Lang {
    /// `oxfmt` picks its language from the (virtual) file name.
    fn stdin_filepath(self) -> &'static str {
        match self {
            Lang::Html => "index.html",
            Lang::Css => "index.css",
            Lang::Js => "index.js",
        }
    }
}

/// Format `source` with `oxfmt` (the oxc formatter, installed via npm — see
/// `package.json`). It has no Rust crate, so it can't be a Cargo dev-dependency;
/// prefer the workspace `node_modules/.bin` copy (so `cargo test` works after
/// `npm install` without a global install) and fall back to `PATH`. `oxfmt` is a
/// Node CLI, so `node` must be available either way.
fn oxfmt(source: &str, lang: Lang) -> String {
    let local = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../node_modules/.bin/oxfmt");
    let mut command = if local.exists() {
        Command::new(local)
    } else {
        Command::new("oxfmt")
    };

    let mut child = command
        .arg("--stdin-filepath")
        .arg(lang.stdin_filepath())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("failed to spawn oxfmt");

    child
        .stdin
        .take()
        .expect("oxfmt stdin")
        .write_all(source.as_bytes())
        .expect("failed to write to oxfmt");

    let output = child.wait_with_output().expect("failed to wait for oxfmt");
    String::from_utf8_lossy(&output.stdout).into_owned()
}
