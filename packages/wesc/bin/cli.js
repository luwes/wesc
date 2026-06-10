#!/usr/bin/env node
// The `wesc` command line tool — compile web components into a single file.
//
//   wesc ./index.html [-j out.js] [-o out.css] [-m]
//
// Mirrors the Rust CLI (crates/wesc/src/bin/wesc.rs): streams the built HTML to
// stdout, writing optional JS/CSS bundles to the given paths.
import { buildStream } from '../index.cjs';

function usage(code) {
  process.stderr.write(
    `Usage: wesc <path> [options]

Compile web components into a single file, streamed to stdout.

Arguments:
  <path>             Path to the entry point HTML file.

Options:
  -j, --outjs   <f>  Write the bundled JS to file <f>.
  -o, --outcss  <f>  Write the bundled CSS to file <f>.
  -m, --minify       Minify generated assets where supported.
  -h, --help         Show this help.
`,
  );
  process.exit(code);
}

const args = process.argv.slice(2);
let path;
let outjs;
let outcss;
let minify = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case '-h':
    case '--help':
      usage(0);
      break;
    case '-m':
    case '--minify':
      minify = true;
      break;
    case '-j':
    case '--outjs':
      outjs = args[++i];
      break;
    case '-o':
    case '--outcss':
      outcss = args[++i];
      break;
    default:
      if (arg.startsWith('-')) {
        process.stderr.write(`Unknown option: ${arg}\n`);
        usage(1);
      } else if (path === undefined) {
        path = arg;
      } else {
        process.stderr.write(`Unexpected argument: ${arg}\n`);
        usage(1);
      }
  }
}

if (path === undefined) {
  process.stderr.write('Error: missing entry point path.\n');
  usage(1);
}

// Exit cleanly when the consumer closes the pipe early (e.g. `wesc x | head`).
process.stdout.on('error', (err) => {
  if (err.code === 'EPIPE') process.exit(0);
  throw err;
});

buildStream({ input: [path], outjs, outcss, minify }, (chunk) => {
  if (chunk !== null) process.stdout.write(chunk);
});
