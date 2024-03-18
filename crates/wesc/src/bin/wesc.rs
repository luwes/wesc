use clap::Parser;
use std::io;
use std::io::prelude::*;
use wesc::{build, BuildOptions};

#[derive(Parser)]
struct Cli {
    path: String,
}

/// The `wesc` command line tool.
/// Compile web components into a single file.
///
/// # Example
///
/// ```sh
/// wesc ./index.html
/// ```
///
/// ## Syntax
///
/// **index.html**
///
/// ```html
/// <!doctype html>
/// <html>
///   <head>
///     <link rel="definition" name="w-card" href="./components/card.html">
///   </head>
///   <body>
///     <w-card>
///       <h3 slot="title">Title</h3>
///       Description
///     </w-card>
///   </body>
/// </html>
/// ```
///
/// **components/card.html**
///
/// ```html
/// <template>
///   <div>
///     <h3><slot name="title">Add a slotted title</slot></h3>
///     <p><slot>Add default slotted content</slot></p>
///   </div>
/// </template>
/// ```
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
