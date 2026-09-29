# AI-Friendliness Evals

Ten repeatable, code-driven evaluations that score how well this library fits the way LLM
coding agents generate UI: how much context a component costs, how explicit and machine-readable
its contract is, how predictable its API and markup are, and how well its styling follows
semantic tokens. Scores are 0–100 (higher is better); the **AI-Friendliness Index** is their
unweighted mean.

The suite is static and deterministic — no network, no model calls — so it can run on every
commit and track progression over time.

## Run

```bash
npm run evals                          # full run, label = run-<sha>
npm run evals -- --label loop-2        # named run (updates results/history.json)
npm run evals -- --only E01,E03        # subset (written, but not added to history)
npm run evals -- --compare baseline loop-2
npm run evals:test                     # unit tests for the suite itself
```

`E01` reads `dist/ODC.OutSystemsUI.d.ts` for the public-typings size when present (run
`npm run build` first for that number). Everything else works on a fresh clone after
`npm install` and `npm run build:tokens` (the SCSS evals compile against the generated tokens).

## Output

- `results/<label>.json` — full run: per-metric score, formula, raw counters, per-component rows
  (sorted worst-first) and the list of component/metric pairs that could not be measured, with the reason.
- `results/history.json` — one row per label: date, git SHA, the ten scores and the index.

## The ten evals

| ID | Eval | Criterion | Movable by non-breaking changes? |
| --- | --- | --- | --- |
| E01 | Context Token Cost | Token & context efficiency | yes (complete manifest cards count as the cheaper source) |
| E02 | Prop Surface & Typing Precision | Schema & anatomy | yes |
| E03 | Machine-Readable Schema Completeness | Schema & metadata | yes |
| E04 | Type Strictness | Type-constrained determinism | yes |
| E05 | Documentation Coverage | Agent documentation (llms.txt tiers) | yes |
| E06 | Public API Shape Consistency | Snippet predictability | yes |
| E07 | Markup Contract Depth | Anatomy & composition | structural |
| E08 | Design Token Semantics | Semantic tokens & theming | yes |
| E09 | CSS Selector Complexity | Predictable cascade | structural |
| E10 | Composition Model & Standards Alignment | Pre-training density | structural |

Formulas, bands and calibration are documented in
[`docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`](../../docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md)
and repeated in each metric module's `formula` field (also written into every results file).

## Layout

```
run.mjs            CLI
lib/               inventory · tokens · ts (compiler API) · scss · markup · manifest · expectations · score · results · context
metrics/           E01 … E10, one module each: { id, name, criterion, formula, movable, compute(ctx) }
tests/             node:test unit tests (formulas are tested with synthetic inputs; helpers with fixtures)
results/           committed snapshots + history
```

## Extending

Add `metrics/E11-<slug>.mjs` exporting a default metric object and a pure `scoreComponent`/`scoreGlobal`
function, register it in `metrics/index.mjs`, add a formula test to `tests/metrics.test.mjs`, and
document the band in the design doc. A metric must report components it cannot measure under
`unmeasured` instead of scoring them.
