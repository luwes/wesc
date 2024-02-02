use clap::Parser;
use std::io;
use std::io::prelude::*;
use wesc::{build, BuildOptions};

#[derive(Parser)]
struct Cli {
    path: String,
}

fn main() {
    let args = Cli::parse();
    let mut stdout = io::stdout();

    let mut output_handler = |c: &[u8]| {
        stdout.write_all(c).unwrap();
    };

    build(
        BuildOptions {
            entry_points: vec![args.path],
        },
        &mut output_handler,
    );
}
