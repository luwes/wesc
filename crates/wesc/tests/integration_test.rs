#[cfg(test)]
use pretty_assertions::assert_eq;
use std::io::Write;
use std::process::{Command, Stdio};
use std::{fs, path::Path};
use wesc::{build, BuildOptions};

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
fn real_world() {
    test_file("./tests/fixtures/real-world/index.html", None);
}

fn test_file(file_path: &str, outcss: Option<&str>) {
    let mut output = Vec::new();

    let mut output_handler = |c: &[u8]| {
        output.extend_from_slice(c);
    };

    build(
        BuildOptions {
            entry_points: vec![String::from(file_path)],
            outcss: outcss.map(String::from),
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
    }
}

fn prettier(file_contents: &str) -> String {
    let mut child = Command::new("prettier")
        .arg("--stdin-filepath")
        .arg("index.html")
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
