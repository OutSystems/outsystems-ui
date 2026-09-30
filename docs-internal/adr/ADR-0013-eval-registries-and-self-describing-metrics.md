# ADR-0013: Eval registries and self-describing metrics

## Status

Proposed (branch `agents/osui-validate-evals`)

## Date

2026-09-30

## Context

ADR-0011 introduced the AI-friendliness eval suite and ADR-0012 the enterprise-readiness suite as a second
index. A review of the loop (2026-09-30) against two questions — does everything follow when a pattern or a
CSS component is added, and can a third suite or an eleventh eval be added without touching every file —
found four gaps:

1. Per-eval knowledge lived outside the metrics: the dashboard data tool held the scope text, the heatmap
   membership, the cell and advice builders and the fix hints of every eval in maps keyed by id; the gate
   hard-coded the coverage rule for R01 and told the suites apart by the first letter of an id; the runner,
   the results library, the history report and the page each special-cased the second suite. A new eval
   meant edits in five files plus the page; a new suite, seven files and a new history field.
2. Component classification was spread over six places with silent defaults: a host-styled list next to the
   inventory, story aliases in the inventory, five role sets and the pattern families in the enterprise
   signals, three state sets in R06, a density set in R05, a no-DOM set in R02. A new pattern was scored as
   plain interactive and a new CSS component as non-interactive and story-less without anything saying so.
3. Components an eval did not apply to were reported as _unmeasured_ by four evals, so the count could not
   tell "nothing to check" from "cannot measure", and no rule stopped measurement coverage from shrinking.
4. The gate was index-level only: one eval could drop several points while the index stayed inside the
   tolerance; after the branch merges, the before → after table would compare every future run with the
   oldest entry.

## Decision Drivers

- One place per kind of knowledge: a suite is described once, a metric describes itself, a component is
  classified once.
- A new component must never be scored with silent defaults: the defaults become visible entries.
- Scores must not move because of the refactor; the freshness tests and a cell-by-cell comparison prove it.
- Keep the constraints of ADR-0012: static, deterministic, no new dependencies, paths confined, no regular
  expressions over source, functions under the complexity limit.

## Decision

1. **Suite registry** (`evals/suites.mjs`). Every suite is one entry: id, index name, eval prefix, one-line
   question, metrics, gate tolerances (`maxDrop`, `maxEvalDrop`) and a dashboard tone. The runner, the gate,
   the history report, the dashboard data and the page iterate the registry. History entries and run files
   carry one block per suite (`suites: { ai: …, enterprise: … }`); the previous shape is normalised on read.
2. **Self-describing metrics.** A metric module exports, besides its formula and `compute`, a `present` block
   — `scope`, `heatmap`, `appliesTo`, `cell(row)`, `advice(result)`, optional `extra(result)` and
   `unmeasuredHint` — and optional `rules` (`no-decrease`). The dashboard data tool and the gate know no eval
   by id. A contract test over every suite checks the shape (unique ids with the suite's prefix, class in the
   allowed set, `present` complete).
3. **Component registry** (`evals/components.json`). One entry per pattern and CSS-only component with
   `kind`, `roles`, `family`, `host`, `story`, `interactive`, `loading`, `validating`, `density`. The
   inventory and the enterprise signals read it; a test fails when it disagrees with the inventory. The
   **doctor** (`npm run evals:doctor`) lists unclassified, stale or story-less components with an entry
   derived from code signals (provider directory, focus trap or Escape handling, arrow keys, live regions,
   hover or loading or invalid selectors); `--fix` appends the derived entries flagged `derived: true` for
   review. The gate report carries the doctor's section.
4. **Not applicable is distinct from unmeasured.** Components with nothing to check (a non-interactive
   pattern for keyboard checks, a partial with nothing themeable, a pattern without SCSS for style checks)
   are reported under `notApplicable` with a hint; `unmeasured` keeps its meaning (a story, a partial or a
   compile is missing). History entries record the unmeasured count per eval.
5. **Gate rules.** Per suite: the index tolerance (1 point), a per-eval tolerance (3 points), the
   `no-decrease` rules metrics declare, and a measurement-coverage rule (no eval may leave more components
   unmeasured than the baseline). Baseline and origin prefer the newest run recorded on `dev` (`branch` or a
   `dev-` label) once one exists, so the before → after table compares a PR with its base branch.
6. **Shared code under `evals/`.** The runner, the libraries, the tools, the results and the shared tests
   move out of `evals/ai-friendliness/`; a suite directory holds its metrics, its tests and its README. The
   dashboard page template is versioned (`evals/dashboard/index.html`) and built with the data set embedded.

## Alternatives Considered

- **Keep the id-keyed maps and add cases per eval.** Rejected: every eval added would touch the same five
  files, and nothing would catch a forgotten case.
- **Derive classification entirely from code, no registry.** Rejected: the signals are proxies (a focus trap
  suggests an overlay, it does not prove one) and a wrong derivation would be invisible. The registry keeps
  the decision explicit; the doctor makes the derivation a visible proposal.
- **Fail the gate on an unclassified component.** Deferred: the registry test fails the job today; whether
  the job should instead append the derived entry and continue is a CI decision (batch 4 of the review).

## Consequences

- Adding an eval: one module and one line in the suite's index; adding a suite: one directory and one
  registry entry. The dashboard shows both without page changes.
- Adding a component: the inventory discovers it, the test fails until `components.json` classifies it,
  `npm run evals:doctor -- --fix` proposes the entry; the PR comment shows what the evals will assume.
- Scores are unchanged by the refactor (loop-10 and loop-11 agree to the decimal); dashboard cells differ
  only where not-applicable rows now carry their reason and hint.
- The history file changed shape once; readers normalise the old shape, so older run files stay readable.
- What remains manual: recording runs on `dev`, regenerating stale generated files in CI, refreshing the
  published dashboard (the artifact sandbox cannot fetch from GitHub). These are the CI options of the
  review's batch 4.

## References

- `docs-internal/ai-friendliness/2026-09-30-evals-scaling-review.md` (working note, not committed)
- `evals/README.md` — how to run, add an eval or a suite, classify a component
- ADR-0011, ADR-0012
