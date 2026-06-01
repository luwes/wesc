#[cfg(test)]
use pretty_assertions::assert_eq;
use std::io::Write;
use std::process::{Command, Stdio};
use std::sync::{LazyLock, Mutex};
use std::{fs, path::Path};
use wesc::{build, BuildOptions};

static BUILD_LOCK: LazyLock<Mutex<()>> = LazyLock::new(|| Mutex::new(()));

#[test]
fn default_slot() {
    test_file(
        "./tests/fixtures/default-slot/index.html",
        Some("./tests/fixtures/default-slot/styles.css"),
    );
}

#[test]
fn no_components() {
    test_file("./tests/fixtures/no-components/index.html", None);
}

#[test]
fn named_slot() {
    test_file("./tests/fixtures/named-slot/index.html", None);
}

#[test]
fn default_slot_fallback() {
    test_file("./tests/fixtures/default-slot-fallback/index.html", None);
}

#[test]
fn light_dom_nesting() {
    test_file("./tests/fixtures/light-dom-nesting/index.html", None);
}

#[test]
fn slot_forwarding() {
    test_file("./tests/fixtures/slot-forwarding/index.html", None);
}

#[test]
fn nested_template() {
    test_file("./tests/fixtures/nested-template/index.html", None);
}

#[test]
fn shadow_template() {
    test_file("./tests/fixtures/shadow-template/index.html", None);
}

#[test]
fn layouts() {
    test_file("./tests/fixtures/layouts/index.html", None);
}

#[test]
fn style_tags() {
    test_file(
        "./tests/fixtures/style-tags/index.html",
        Some("./tests/fixtures/style-tags/styles.css"),
    );
}

#[test]
fn script_tags() {
    test_file_with_outputs(
        "./tests/fixtures/script-tags/index.html",
        Some("./tests/fixtures/script-tags/styles.css"),
        Some("./tests/fixtures/script-tags/scripts.js"),
    );
}

#[test]
fn todo_app() {
    test_file_with_outputs_and_cleanup(
        "./tests/fixtures/todo-app/index.html",
        Some("./tests/fixtures/todo-app/styles.css"),
        Some("./tests/fixtures/todo-app/scripts.js"),
        true,
    );
}

#[test]
fn minify_js() {
    let outjs = "./tests/fixtures/todo-app/minified.js";
    let mut output = Vec::new();
    let mut output_handler = |c: &[u8]| {
        output.extend_from_slice(c);
    };

    let _build_lock = BUILD_LOCK.lock().unwrap();
    build(
        BuildOptions {
            entry_points: vec![String::from("./tests/fixtures/todo-app/index.html")],
            outcss: None,
            outjs: Some(String::from(outjs)),
            minify: true,
        },
        &mut output_handler,
    );

    let minified = fs::read_to_string(outjs).expect("Should have been able to read the file");
    let expected = fs::read_to_string("./tests/fixtures/todo-app/expected.min.js")
        .expect("Should read expected minified JS");
    let readable = fs::read_to_string("./tests/fixtures/todo-app/expected.js")
        .expect("Should read readable JS");

    assert_eq!(minified, expected);
    assert!(minified.len() < readable.len());
    assert!(!minified.contains("//#region"));

    fs::remove_file(outjs).expect("Should have been able to remove the file");
}

#[test]
fn real_world() {
    test_file("./tests/fixtures/real-world/index.html", None);
}

#[test]
fn template_passthrough() {
    // Regression: a component whose body nests a <template> containing another
    // component (e.g. a clone template for runtime-created items). The nested
    // </template> must not be mistaken for the component's own root template
    // close, which previously truncated everything after it.
    test_file("./tests/fixtures/template-passthrough/index.html", None);
}

#[test]
fn absolute_entry_path() {
    // Regression: building with an absolute entry path (as a server would pass)
    // must not break the JS bundler. Previously `Path::join("./.wesc/scripts", abs)`
    // discarded the base, scattering the extracted component JS next to the source
    // files and producing a broken import that panicked the bundler.
    let abs_entry =
        fs::canonicalize("./tests/fixtures/todo-app/index.html").expect("fixture should exist");
    let outjs = "./tests/fixtures/todo-app/abs-scripts.js";

    let _build_lock = BUILD_LOCK.lock().unwrap();
    let mut output = Vec::new();
    build(
        BuildOptions {
            entry_points: vec![abs_entry.to_string_lossy().to_string()],
            outcss: None,
            outjs: Some(String::from(outjs)),
            minify: false,
        },
        &mut |c: &[u8]| output.extend_from_slice(c),
    );

    // The bundle was produced (no panic) and carries the component definitions.
    let js = fs::read_to_string(outjs).expect("bundled JS should be written");
    assert!(js.contains("customElements.define"));

    // The HTML still renders the components.
    let html = String::from_utf8_lossy(&output);
    assert!(html.contains("class=\"todoapp\""));

    // The extracted component JS stayed inside the .wesc mirror — it was NOT
    // scattered next to the source files.
    assert!(
        !Path::new("./tests/fixtures/todo-app/todo-app.js").exists(),
        "extracted JS must not be written next to the source"
    );

    fs::remove_file(outjs).expect("cleanup outjs");
}

fn test_file(file_path: &str, outcss: Option<&str>) {
    test_file_with_outputs(file_path, outcss, None);
}

fn test_file_with_outputs(file_path: &str, outcss: Option<&str>, outjs: Option<&str>) {
    test_file_with_outputs_and_cleanup(file_path, outcss, outjs, false);
}

fn test_file_with_outputs_and_cleanup(
    file_path: &str,
    outcss: Option<&str>,
    outjs: Option<&str>,
    cleanup_outcss: bool,
) {
    let mut output = Vec::new();

    let mut output_handler = |c: &[u8]| {
        output.extend_from_slice(c);
    };

    let _build_lock = BUILD_LOCK.lock().unwrap();
    build(
        BuildOptions {
            entry_points: vec![String::from(file_path)],
            outcss: outcss.map(String::from),
            outjs: outjs.map(String::from),
            minify: false,
        },
        &mut output_handler,
    );

    let actual = String::from_utf8_lossy(&output);
    // println!("\nACTUAL:\n{:}\n", actual);
    let actual = prettier(&actual);

    let dir = Path::new(&file_path).parent().unwrap();
    let expected_file_path = dir.join("expected.html");
    let expected = prettier(
        &fs::read_to_string(expected_file_path).expect("Should have been able to read the file"),
    );

    assert_eq!(actual, expected);

    if let Some(outcss) = outcss {
        let expected_css_file_path = dir.join("expected.css");
        let expected_css = prettier(
            &fs::read_to_string(expected_css_file_path)
                .expect("Should have been able to read the file"),
        );

        let actual_css_file_path = Path::new(outcss);
        let actual_css = prettier(
            &fs::read_to_string(actual_css_file_path)
                .expect("Should have been able to read the file"),
        );

        assert_eq!(actual_css, expected_css);

        if cleanup_outcss {
            fs::remove_file(actual_css_file_path)
                .expect("Should have been able to remove the file");
        }
    }

    if let Some(outjs) = outjs {
        let expected_js_file_path = dir.join("expected.js");
        let expected_js = prettier_for(
            &fs::read_to_string(expected_js_file_path)
                .expect("Should have been able to read the file"),
            "index.js",
        );

        let actual_js_file_path = Path::new(outjs);
        let actual_js = prettier_for(
            &fs::read_to_string(actual_js_file_path)
                .expect("Should have been able to read the file"),
            "index.js",
        );

        assert_eq!(actual_js, expected_js);
        fs::remove_file(actual_js_file_path).expect("Should have been able to remove the file");
    }
}

fn prettier(file_contents: &str) -> String {
    prettier_for(file_contents, "index.html")
}

fn prettier_for(file_contents: &str, file_path: &str) -> String {
    let mut child = Command::new("prettier")
        .arg("--stdin-filepath")
        .arg(file_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("Failed to spawn child process");

    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(file_contents.as_bytes())
            .expect("Failed to write to stdin");
    }

    let output = child
        .wait_with_output()
        .expect("Failed to wait on child process");

    String::from_utf8_lossy(&output.stdout).to_string()
}
