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
///     <link rel="definition" name="w-alert" href="./components/alert.html">
///   </head>
///   <body>
///     <w-alert variant="warning">
///       <span slot="title">Heads up</span>
///       Your trial ends in 3 days.
///     </w-alert>
///   </body>
/// </html>
/// ```
///
/// **components/alert.html**
///
/// ```html
/// <template>
///   <div class="content">
///     <strong><slot name="title">Notice</slot></strong>
///     <p><slot>Something happened.</slot></p>
///   </div>
/// </template>
/// ```
fn main() {
    let args = Cli::parse();
    let mut stdout = io::stdout();

    let mut output_handler = |c: &[u8]| {
        stdout.write_all(c).unwrap();
    };

    // The expanded HTML is streamed to stdout; the bundled CSS/JS are written to
    // `--outcss`/`--outjs` (and also returned in-memory, which the CLI ignores).
    build(
        BuildOptions {
            input: vec![args.path],
            source: None,
            outcss: args.outcss,
            outjs: args.outjs,
            cwd: args.cwd,
            minify: args.minify,
        },
        &mut output_handler,
    );
}
