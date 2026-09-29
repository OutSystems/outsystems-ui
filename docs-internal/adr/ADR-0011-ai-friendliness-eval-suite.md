# ADR-0011: AI-friendliness eval suite and generated agent documentation

## Status

Proposed

## Context

OutSystems is exploring a pipeline in which a TypeScript coding agent composes application code
against runtime libraries (OutSystems UI, Charts, Maps, Data Grid) that a model framework then
turns into OML. For that to work at low token cost and high first-try accuracy, this library has
to be *legible to a model*: cheap to read, explicit about its contracts, predictable in shape.

Research on LLM-friendly UI frameworks (shadcn/ui, Radix, Tailwind-style systems, HeroUI, React
Suite) converges on a small set of properties — token efficiency, typed/schema'd props,
machine-readable docs (`llms.txt`, MCP), predictable composition, flat anatomy, semantic tokens,
low selector complexity, open-web composition models — none of which this repository measured.
Judgements about "AI-friendliness" were anecdotal and could not gate a PR.

Constraints: no runtime behavior may change as a side effect of measuring or documenting; the
library ships as global AMD namespaces consumed by the platform through JSON-string configs; there
is no unit test runner in the repository.

## Decision Drivers

-   Repeatable, deterministic scoring that can run on every commit and track progression.
-   Zero new runtime dependencies and no change to the shipped bundles.
-   A single source of truth: docs generated from the code cannot drift from it.
-   Reuse of tooling already in `devDependencies` (`typescript`, `sass`, `postcss`).

## Considered Options

-   Option 1 — LLM-based evaluation (generate components with a model, measure pass@1)
    -   Pros: measures the actual outcome.
    -   Cons: non-deterministic, costly, needs network and credentials, cannot gate CI, results
        depend on the model of the day.
-   Option 2 — Static, code-driven evals with ten scored criteria (chosen)
    -   Pros: deterministic, fast (~25 s), runs offline, per-component actionable output, history file.
    -   Cons: proxies rather than outcomes (token counts use `o200k_base`, markup depth comes from stories).
-   Option 3 — Hand-maintained agent docs (`llms.txt` written by people)
    -   Pros: prose quality.
    -   Cons: drifts from the source; every pattern change needs a doc edit; not verifiable.

## Decision Outcome

Chosen option: "Option 2", complemented by **generated** agent documentation, because it is the
only option that is repeatable, offline and verifiable, and because generation from the same
readers the evals use makes the docs and the scores agree by construction (a test asserts the
generated manifest scores ≥ 90 % on schema completeness for every pattern).

-   `evals/ai-friendliness/` holds the suite (`npm run evals`, `npm run evals:test`); formulas
    and bands are documented in `docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`.
-   `scripts/generate-ai-docs.mjs` (`npm run docs:ai`) writes `docs-ai/`: a versioned component
    manifest with a JSON Schema, `llms.txt`, `llms-components.txt`, `llms-tokens.txt`,
    `llms-patterns.txt`.
-   `npm test` runs the node:test suites for both.
-   **Gate and freshness in CI.** `.github/workflows/ai-friendliness.yaml` runs `npm run evals:gate`
    (fails when the index drops more than one point against the newest `results/history.json`
    entry) and `npm run docs:ai:check` (fails when `docs-ai/` differs from a fresh generation) on
    pull requests into `dev` and on demand for any branch. Both commands run locally too. The gate
    writes a before → after table per eval to the job summary and to one sticky PR comment, and
    every full run regenerates `results/HISTORY.md` (`npm run evals:report`), the index over time.
-   **Publication.** `postdocs` copies `docs-ai/` into the TypeDoc output, so the documentation
    deployment serves `/llms.txt`, `/llms-components.txt`, `/llms-tokens.txt`, `/llms-utilities.txt`,
    `/llms-patterns.txt` and `/osui.components.json` at its root. Serving them from the OutSystems
    UI website itself is an external change to that application.
-   **Generated public types.** `scripts/generate-pattern-types.mjs` (`npm run types:generate`)
    writes `src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts`: for every pattern a `Configs`
    type (optional, documented props; provider-typed values degrade to `unknown`) and an `EventName`
    union with a `string` escape hatch, merged into the pattern's API namespace and used by `Create`
    and `RegisterCallback`. The file is formatted by the generator and its freshness is asserted by a
    test, so it cannot drift from the configuration classes.
-   **Single theme.** Only the token-based theme is in scope; `classic-theme/` is a Storybook
    comparison artifact and is excluded from evals and docs.

Positive consequences:

-   Any change to a pattern's props, API, enums or markup is reflected in the docs on the next
    `npm run docs:ai`, and any regression in AI-friendliness is visible as a score delta.
-   Agents can read a ~430-token card per pattern instead of ~2,700 tokens of source.

Negative consequences:

-   `docs-ai/` and `PatternTypes.ts` are generated output committed to the repository; they must
    be regenerated in the PR that changes a pattern (`npm run docs:ai && npm run types:generate`).
    The CI freshness check and the generated-file test make a stale commit fail.
-   Scores are proxies; a structural change can move a score without changing agent outcomes.
    The design doc records each formula's rationale so the proxies can be revisited.
-   The workflow installs dependencies with `npm install --ignore-scripts`, like every other
    workflow in the repository, because `package-lock.json` is git-ignored by policy and the
    `.npmrc` release-age rule is the supply-chain guard. SonarCloud reports this as an unlocked
    dependency hotspot on new code, which the security-rating condition of the quality gate counts.
    Decision: the issue is accepted in SonarCloud with that justification; committing a lockfile
    or excluding workflows from the rule would be a repository-wide change outside this suite.

## Links

-   `docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md` — eval definitions and bands
-   `docs-internal/ai-friendliness/REPORT.md` — baseline vs. loop results, gap analysis, roadmap
-   `evals/ai-friendliness/README.md` — how to run and extend

## Date

2026-09-29
