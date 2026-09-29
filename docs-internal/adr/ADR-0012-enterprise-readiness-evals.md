# ADR-0012: Enterprise-readiness evals as a second index

## Status

Proposed (branch `agents/osui-validate-evals`)

## Context

ADR-0011 introduced the AI-friendliness eval suite (E01–E10) and its index. "UI Enterprise apps
requirements" (OutSystems, 2025-07-30) lists what enterprise applications need from a UI framework:
components (data-heavy tables, specialised inputs, navigation), behaviours (feedback and state), theme
foundations, flows, and accessibility and keyboard compliance. These are business requirements about the
product, not about how legible the code is to agents. The question was whether and how to measure them with
the same machinery, and how to keep the two questions apart.

Three constraints shaped the answer. Table, Data Grid, Charts and Maps live in other OutSystems products,
so a naive coverage score would measure repository boundaries. The suite is offline and deterministic, so
only statically observable signals qualify now; behaviour quality needs a browser. And the movable /
structural distinction of ADR-0011 does not cover a missing component: that is new work, not a refactor
and not a breaking change.

## Decision Drivers

- Keep the AI-Friendliness Index meaningful: a new component must not offset a documentation regression.
- Score what this repository owns; report the rest without penalising it.
- Stay offline, deterministic and free of new dependencies; reuse the inventory, SCSS compilation and path
  confinement of the existing suite.
- Avoid the static-analysis findings already fixed once: no regular expressions over source text, no code
  execution, no spawned processes, every path confined to its base directory, functions under the cognitive
  complexity limit.

## Considered Options

1. Fold R01–R06 into the AI-Friendliness Index (sixteen evals, one mean).
2. A second suite with its own index, sharing the runner, results, gate, history and dashboard.
3. A separate repository or tool.

## Decision Outcome

Chosen option: **2**, a second suite `evals/enterprise/` (R01–R06) with the **Enterprise Readiness Index**.

- **One runner, two suites.** `npm run evals` runs both; `--suite ai|enterprise` selects one (a partial
  run). A run file keeps its E01–E10 shape and adds `enterprise: { scores, index, results }`; a history
  entry adds `enterprise: { scores, index }`. Files and entries without the key stay valid.
- **Delegated rule.** `requirements.json` gives every requirement an owner. Rows owned by the platform,
  Data Grid, Charts or Maps are reported as delegated and excluded from R01's score.
- **Roadmap class.** Metrics carry `cls: movable | structural | roadmap`; R01 is roadmap. Reports and the
  dashboard show the class instead of the yes/structural flag.
- **Gate.** The same drop rule applies to each index (`--max-drop`, `--max-drop-enterprise` to override),
  plus a no-decrease rule on R01: a removed component or feature fails the gate whatever the index does.
  The PR comment and job summary carry one before → after table per index, each compared with the
  oldest run that carries the suite (for the enterprise index, its first measurement) while the
  verdict compares with the newest run.
- **Proxies.** R02 and R03 are static proxies for accessibility and keyboard operability. The dynamic phase
  (axe over the existing Storybook stories, in the Chromatic workflow) is planned separately and will feed
  R02's detail; the static score stays as the offline signal.
- **Dark mode through tokens.** The token theme swaps tokens in `_theme-dark.scss`, so R04 treats tokened
  colours as dark-ready rather than requiring per-component `.os-dark` rules.

Positive consequences:

- Enterprise gaps become measurable and trend over time next to the AI-friendliness work, from one command.
- R01 reproduces the document's parity table from evidence, so the comparison stays current as components land.
- Per-component hints name the missing state, key or style, so the work is actionable component by component.

Negative consequences:

- `requirements.json` is curated: hand-set statuses need review when the product changes. A test catches
  evidence rules that stop matching, not statuses that became true.
- Static proxies can over- or under-credit (a handler present but wrong; a native control needing none). The
  dynamic phase is the correction.
- The baseline is low (50.7): the index will move mostly with new work, so the gate's role here is to catch
  regressions, not to drive the number.

## Links

- ADR-0011 · AI-friendliness eval suite
- `docs-internal/ai-friendliness/2026-09-29-enterprise-readiness-evals-proposal.md` (formulas, mapping, plan)
- `evals/enterprise/README.md`

## Date

2026-09-29
