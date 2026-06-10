//! Performance benchmarks for the `wesc` bundler.
//!
//! Run with:
//!
//! ```sh
//! cargo bench -p wesc
//! ```
//!
//! Each scenario reports both the time per build and the throughput in terms of
//! the entry file's byte size, so regressions are easy to spot relative to the
//! amount of HTML being processed.
//!
//! The companion regression guard lives in `tests/perf_guard.rs`: it asserts
//! that the core HTML expansion stays under a wall-clock budget so that new
//! features don't silently make the bundler slower. Keep the two in sync when
//! adding or renaming scenarios.

use std::fs;
use std::hint::black_box;

use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion, Throughput};
use wesc::{build, BuildOptions};

/// Representative builds, ordered from cheapest to most expensive.
///
/// All scenarios bundle HTML only (no `outcss`/`outjs`) so the benchmark
/// measures the bundler's own work rather than the external JS bundler
/// (rolldown) or disk I/O.
const SCENARIOS: &[(&str, &str)] = &[
    // Pure passthrough: no custom elements, just the HTML scanner.
    ("no-components", "./tests/fixtures/no-components/index.html"),
    // Many small components with slots, nesting, and forwarding.
    ("todo-app", "./tests/fixtures/todo-app/index.html"),
    // A full website: a w-trim layout, header/nav/footer, sidebar, and 100
    // blog posts spread across ~17 components with deep nesting.
    ("blog", "./tests/fixtures/blog/index.html"),
    // A large (~750 KB) real-world document with a component definition.
    ("real-world", "./tests/fixtures/real-world/index.html"),
];

/// Run a single HTML-only build, draining the output through `black_box` so the
/// optimizer can't elide the work.
fn run_build(entry: &str) {
    let mut total = 0usize;
    build(
        BuildOptions {
            entry_points: vec![entry.to_string()],
            outcss: None,
            outjs: None,
            cwd: None,
            minify: false,
        },
        &mut |chunk: &[u8]| {
            total += chunk.len();
        },
    );
    black_box(total);
}

fn bench_bundler(c: &mut Criterion) {
    let mut group = c.benchmark_group("bundler");

    for (name, entry) in SCENARIOS {
        let bytes = fs::metadata(entry)
            .unwrap_or_else(|e| panic!("benchmark fixture {entry} should exist: {e}"))
            .len();
        group.throughput(Throughput::Bytes(bytes));
        group.bench_with_input(BenchmarkId::from_parameter(name), entry, |b, entry| {
            b.iter(|| run_build(entry));
        });
    }

    group.finish();
}

criterion_group!(benches, bench_bundler);
criterion_main!(benches);
