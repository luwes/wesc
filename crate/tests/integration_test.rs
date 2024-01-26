#[cfg(test)]
use pretty_assertions::assert_eq;
use std::io::Write;
use std::process::{Command, Stdio};
use std::{fs, path::Path};
use wesc::{build, BuildOptions};

#[test]
fn default_slot() {
    test_file("./tests/fixtures/default-slot/index.html");
}

#[test]
fn default_slot_fallback() {
    test_file("./tests/fixtures/default-slot-fallback/index.html");
}

#[test]
fn light_dom_nesting() {
    test_file("./tests/fixtures/light-dom-nesting/index.html");
}

#[test]
fn slot_forwarding() {
    test_file("./tests/fixtures/slot-forwarding/index.html");
}

fn test_file(file_path: &str) {
    let mut output = Vec::new();

    let mut output_handler = |c: &[u8]| {
        output.extend_from_slice(c);
    };

    build(
        BuildOptions {
            entry_points: vec![String::from(file_path)],
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
