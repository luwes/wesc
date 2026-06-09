//! Performance regression guard for the `wesc` bundler.
//!
//! This is the cheap, CI-friendly companion to the criterion benchmark in
//! `benches/bundler.rs`. Criterion is great for *measuring* performance, but it
//! doesn't fail a build on regression. This test does: it bundles a few
//! representative fixtures and asserts the core HTML expansion stays under a
//! wall-clock budget, so new features can't silently make the bundler slower.
//!
//! Wall-clock budgets are inherently hardware dependent, so the design leans on
//! two things to stay robust:
//!
//! * It times the **best** (minimum) of many iterations. The minimum is far
//!   more stable than the mean because it filters out scheduler hiccups, GC in
//!   other processes, CPU frequency scaling, etc.
//! * The budgets carry generous headroom over a fast dev machine so they don't
//!   flake on slower CI runners, while still catching the kind of multiple-x
//!   regression an accidental O(n^2) or extra full re-scan would introduce.
//!
//! Because the budgets describe *optimized* performance, the guard only fails
//! the build when compiled in release mode (`cargo test --release`). In a debug
//! build, optimizations are off and timings aren't representative, so the test
//! still measures and prints but never fails. CI enforces the budgets via a
//! dedicated release run (see `.github/workflows/ci.yml`).
//!
//! Tuning knobs (environment variables):
//!
//! * `WESC_PERF_SCALE` — multiplies every budget. Use a value `> 1.0` on slow
//!   hardware (e.g. `WESC_PERF_SCALE=2` doubles every budget). Defaults to `1`.
//! * `WESC_PERF_GUARD=0` — measure and print timings but never fail. Useful for
//!   profiling without tripping the guard.

use std::time::{Duration, Instant};

use wesc::{build, BuildOptions};

/// A bundling scenario and the time budget a single build must stay under.
struct Scenario {
    name: &'static str,
    entry: &'static str,
    /// Per-build budget (best of `ITERATIONS`) on reference hardware, before
    /// the `WESC_PERF_SCALE` multiplier is applied.
    ///
    /// Reference dev-machine medians at the time of writing:
    ///   no-components ≈ 0.06 ms, todo-app ≈ 1.4 ms, real-world ≈ 1.4 ms,
    ///   blog ≈ 30 ms (100 posts across ~18 deeply nested components).
    /// Budgets sit well above those to absorb slower CI hardware while still
    /// catching a regression that multiplies the work.
    budget: Duration,
}

const SCENARIOS: &[Scenario] = &[
    Scenario {
        name: "no-components",
        entry: "./tests/fixtures/no-components/index.html",
        budget: Duration::from_micros(1_500),
    },
    Scenario {
        name: "todo-app",
        entry: "./tests/fixtures/todo-app/index.html",
        budget: Duration::from_millis(10),
    },
    Scenario {
        name: "real-world",
        entry: "./tests/fixtures/real-world/index.html",
        budget: Duration::from_millis(10),
    },
    Scenario {
        name: "blog",
        entry: "./tests/fixtures/blog/index.html",
        budget: Duration::from_millis(100),
    },
];

/// Iterations per scenario; we keep the best (minimum) time. Taking the best of
/// a handful of runs filters out scheduler/CPU-frequency noise, so a few is
/// plenty. The budget is only enforced in release; a debug run (measure-only)
/// does even fewer passes to keep `cargo test` fast.
const ITERATIONS: u32 = if cfg!(debug_assertions) { 2 } else { 5 };

/// Warm-up builds run (and discarded) before timing, so file caches and the
/// allocator are warm.
const WARMUP: u32 = if cfg!(debug_assertions) { 1 } else { 2 };

/// Run one HTML-only build. CSS/JS outputs are intentionally `None` so we
/// measure the bundler itself, not the external JS bundler (rolldown) or disk
/// I/O — those would dominate and add noise.
fn run_build(entry: &str) -> usize {
    let mut total = 0usize;
    build(
        BuildOptions {
            entry_points: vec![entry.to_string()],
            outcss: None,
            outjs: None,
            minify: false,
        },
        &mut |chunk: &[u8]| {
            total += chunk.len();
        },
    );
    total
}

fn best_build_time(entry: &str) -> Duration {
    for _ in 0..WARMUP {
        std::hint::black_box(run_build(entry));
    }

    let mut best = Duration::MAX;
    for _ in 0..ITERATIONS {
        let start = Instant::now();
        std::hint::black_box(run_build(entry));
        best = best.min(start.elapsed());
    }
    best
}

fn perf_scale() -> f64 {
    std::env::var("WESC_PERF_SCALE")
        .ok()
        .and_then(|v| v.parse::<f64>().ok())
        .filter(|s| *s > 0.0)
        .unwrap_or(1.0)
}

fn guard_enabled() -> bool {
    // Budgets describe optimized performance; debug builds run ~10x slower, so
    // only enforce in release. `WESC_PERF_GUARD=0` disables enforcement entirely.
    if cfg!(debug_assertions) {
        return false;
    }
    std::env::var("WESC_PERF_GUARD").map(|v| v != "0").unwrap_or(true)
}

#[test]
fn bundler_stays_within_budget() {
    let scale = perf_scale();
    let enforce = guard_enabled();
    let mut failures = Vec::new();

    if !enforce {
        if cfg!(debug_assertions) {
            println!("perf: debug build — measuring only, guard not enforced (run with --release to enforce)");
        } else {
            println!("perf: WESC_PERF_GUARD=0 — measuring only, guard not enforced");
        }
    }

    for scenario in SCENARIOS {
        let best = best_build_time(scenario.entry);
        let budget = scenario.budget.mul_f64(scale);

        println!(
            "perf: {:<14} best {:>9.3?} / budget {:>9.3?} ({:>3.0}% of budget)",
            scenario.name,
            best,
            budget,
            best.as_secs_f64() / budget.as_secs_f64() * 100.0,
        );

        if best > budget {
            failures.push(format!(
                "{}: {:.3?} exceeded budget {:.3?} (scale {scale})",
                scenario.name, best, budget
            ));
        }
    }

    if enforce && !failures.is_empty() {
        panic!(
            "bundler performance regression detected:\n  {}\n\n\
             If this is expected (e.g. slower hardware), raise WESC_PERF_SCALE \
             or update the budgets in tests/perf_guard.rs.",
            failures.join("\n  ")
        );
    }
}
