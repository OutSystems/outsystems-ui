# AI-Friendliness Evals

Ten repeatable, code-driven evaluations that score how well this library fits the way LLM
coding agents generate UI: how much context a component costs, how explicit and machine-readable
its contract is, how predictable its API and markup are, and how well its styling follows
semantic tokens. Scores are 0–100 (higher is better); the **AI-Friendliness Index** is their
unweighted mean.

The suite is static and deterministic — no network, no model calls — so it can run on every
commit and track progression over time.

## Run

This suite runs through the shared runner in `evals/`; see [`evals/README.md`](../README.md) for every
command. The ones used most:

```bash
npm run evals -- --label <name>        # full run of every suite; updates results/history.json, HISTORY.md, dashboard.json
npm run evals -- --suite ai            # this suite only (partial run, nothing written to history)
npm run evals -- --only E01,E03        # a few evals (partial run)
npm run evals:gate -- --report out.md  # every suite gated; before → after tables (what the PR comment shows)
npm test                               # unit tests, including this suite's formula tests
```

`E01` reads `dist/ODC.OutSystemsUI.d.ts` for the public-typings size when present (run
`npm run build` first for that number). Everything else works on a fresh clone after
`npm install` and `npm run build:tokens` (the SCSS evals compile against the generated tokens).

## Output

- `results/<label>.json` — full run: per-metric score, formula, raw counters, per-component rows
  (sorted worst-first), the component/metric pairs that could not be measured (with the reason) and the components the eval does not apply to (with the reason and a hint).
- `results/history.json` — one entry per label: date, git SHA, branch, and per suite the scores, the index and the unmeasured count per eval.

## The ten evals

| ID  | Eval                                    | Criterion                            | Movable by non-breaking changes?                          |
| --- | --------------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| E01 | Context Token Cost                      | Token & context efficiency           | yes (complete manifest cards count as the cheaper source) |
| E02 | Prop Surface & Typing Precision         | Schema & anatomy                     | yes                                                       |
| E03 | Machine-Readable Schema Completeness    | Schema & metadata                    | yes                                                       |
| E04 | Type Strictness                         | Type-constrained determinism         | yes                                                       |
| E05 | Documentation Coverage                  | Agent documentation (llms.txt tiers) | yes                                                       |
| E06 | Public API Shape Consistency            | Snippet predictability               | yes                                                       |
| E07 | Markup Contract Depth                   | Anatomy & composition                | structural                                                |
| E08 | Design Token Semantics                  | Semantic tokens & theming            | yes                                                       |
| E09 | CSS Selector Complexity                 | Predictable cascade                  | structural                                                |
| E10 | Composition Model & Standards Alignment | Pre-training density                 | structural                                                |

Formulas, bands and calibration are documented in
[`docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`](../../docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md)
and repeated in each metric module's `formula` field (also written into every results file).

## Layout

```
metrics/           E01 … E10, one module each: { id, name, criterion, formula, movable, present, compute(ctx) }
tests/             formula tests with synthetic inputs (metrics.test.mjs)
README.md          this file
```

The runner, the libraries (inventory, TypeScript and SCSS helpers, token counting, scoring), the tools
(gate, history report, dashboard data and page, doctor), the results and the component registry are shared
by every suite and live one level up, in `evals/`.

## Extending

Add `metrics/E11-<slug>.mjs` with a default metric object (formula, `present` block, `compute`) and a pure
`scoreComponent`/`scoreGlobal` function, register it in `metrics/index.mjs`, add a formula test to
`tests/metrics.test.mjs`, and document the band in the design doc. The step-by-step guide and the metric
contract are in [`evals/README.md`](../README.md#adding-an-eval). A metric reports components it cannot
measure under `unmeasured` and components it does not apply to under `notApplicable`; it never scores either.
