use clap::Parser;
use std::io;
use std::io::prelude::*;
use wesc::{build, BuildOptions};

/// The `wesc` command line tool.
#[derive(Parser)]
struct Cli {
    /// The path to the entry point file.
    path: String,

    /// The output CSS file.
    #[arg(short, long)]
    outcss: Option<String>,

    /// The output JS file.
    #[arg(short = 'j', long)]
    outjs: Option<String>,

    /// Working directory (like rolldown's cwd). Relative paths resolve against
    /// it and the `.wesc` scratch dir is created under it. Defaults to the
    /// current directory.
    #[arg(long)]
    cwd: Option<String>,

    /// Minify generated assets where supported.
    #[arg(short, long)]
    minify: bool,
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
            input: vec![args.path],
            code: None,
            outcss: args.outcss,
            outjs: args.outjs,
            cwd: args.cwd,
            minify: args.minify,
        },
        &mut output_handler,
    );
}
