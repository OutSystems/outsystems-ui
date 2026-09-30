# AI-Friendliness Eval Suite — Implementation Plan

> **For agentic workers:** execute task-by-task with TDD (failing test → minimal code → green → commit). Steps use checkbox syntax for tracking.

**Goal:** Ship a repeatable ten-eval suite under `evals/ai-friendliness/`, run a behavior-preserving refinement loop on `agents/osui-validate-evals`, and produce the report.

**Architecture:** ESM `.mjs` modules on Node 24 reusing the repo's `typescript`, `sass`, `postcss`, `postcss-selector-parser` devDependencies plus `gpt-tokenizer`; a shared inventory feeds ten metric modules; a CLI writes JSON results and a history file.

**Tech Stack:** Node 24, `node:test`, TypeScript compiler API, sass JS API, postcss.

**Spec:** `docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`

## Global Constraints

- Branch `agents/osui-validate-evals` only.
- No Jira keys in any file or commit message; commit messages use `type(scope): subject`.
- Runtime behavior of `dist/*.OutSystemsUI.{js,css}` must not change; every src edit is gated by `npm run build` and, for SCSS, the CSS-equivalence tool.
- `.mjs` files live outside `tsconfig include` and `eslint --ext .ts`; they must not be imported by `src/`.

## Review Focus

1. A component with no story or no `Enum.ts` must be reported as unmeasured, never crash the run (E07, E03).
2. A pattern whose config chain spans provider directories (Dropdown, DatePicker, RangeSlider, Carousel) must have all its config props counted (E02).
3. Story helpers composing templates (`itemMarkup(...)`) must be inlined so depth is not under-counted (E07).
4. SCSS files that cannot compile standalone must be excluded from the E09 mean rather than scoring 0 or 100.
5. The tokenizer must never see the same file twice with different results (cache keyed by path+content hash).

---

### Task 1: Inventory

**Files:** `evals/lib/inventory.mjs`, `evals/tests/inventory.test.mjs`
**Produces:** `buildInventory(root) → { patterns: Pattern[], cssComponents: CssComponent[] }` where `Pattern = { name, apiFile, patternDir, providerDirs[], configFiles[], enumFiles[], interfaceFile, factoryFiles[], classFiles[], scssFile, storyFile }`, `CssComponent = { name, scssFile, storyFile }`.

- [ ] Test: inventory on the real repo lists 33 patterns, `Accordion.scssFile` ends with `accordion/_accordion.scss`, `Dropdown.configFiles` includes provider configs, `AccordionItem.storyFile` resolves to `Accordion.stories.ts`.
- [ ] Implement discovery from `OutSystems/OSUI/Patterns/*API.ts`, `gulp/ProjectSpecs/Patterns/*.js` (scss path), case-insensitive provider dir match, longest-prefix story match.
- [ ] Commit `feat(evals): component inventory`.

### Task 2: Token counter

**Files:** `lib/tokens.mjs`, `tests/tokens.test.mjs`; `package.json` (+`gpt-tokenizer` devDependency).

- [ ] Test: `countTokens('Hello world') === 2`; `countFileTokens(path)` caches.
- [ ] Implement with `gpt-tokenizer/encoding/o200k_base`.
- [ ] Commit.

### Task 3: TypeScript helpers

**Files:** `lib/ts.mjs`, `tests/ts.test.mjs`
**Produces:** `createProgram(root, extraOptions)`, `getExportedFunctions(sourceFile)`, `getJsDoc(node)`, `getClassChain(program, className)`, `getConfigProps(program, configFiles)`, `countAnyKeywords(sourceFile)`, `implicitAnyDiagnostics(program)`.

- [ ] Tests with inline fixture sources via `ts.createSourceFile` and an in-memory compiler host.
- [ ] Implement; commit.

### Task 4: SCSS helpers

**Files:** `lib/scss.mjs`, `tests/scss.test.mjs`
**Produces:** `compileComponent(file, loadPaths) → css|null`, `analyseSelectors(css) → { selectors: [{ selector, depth, spec:[a,b,c] }] }`, `analyseDeclarations(scss) → { total, literal, routed, important }`.

- [ ] Tests on inline SCSS strings (`.a .b > .c:not(.d)` → depth 2, spec [0,3,0]).
- [ ] Implement; commit.

### Task 5: Markup helpers

**Files:** `lib/markup.mjs`, `tests/markup.test.mjs`
**Produces:** `extractTemplates(storySource) → string[]` (with helper inlining), `measureHtml(html) → { depth, elements, classes }`.

- [ ] Tests: nested divs depth 3; `${itemMarkup()}` inlined.
- [ ] Implement; commit.

### Task 6: Metrics E01–E10

**Files:** `metrics/E0N-*.mjs`, `tests/metrics.test.mjs`, `lib/score.mjs`

- [ ] For each metric: a test with a synthetic ctx asserting the formula on known raw values; then the real `compute(ctx)`.
- [ ] Commit per metric or per pair.

### Task 7: Runner

**Files:** `run.mjs`, `results/`, `README.md`, `package.json` scripts `evals`, `evals:test`.

- [ ] Test: `aggregate(results)` computes index; `--only E01` filters; history append is idempotent per label (re-running a label replaces its entry).
- [ ] Implement CLI, markdown table output, `--compare a b`.
- [ ] Run `baseline`; commit results.

### Task 8: Loop iteration 1 — machine-readable docs

**Files:** `scripts/generate-ai-docs.mjs`, `docs-ai/*`, `tests/ai-docs.test.mjs`, `package.json` script `docs:ai`.

- [ ] Tests: manifest lists every pattern; every prop has a type; cards ≤ 400 tokens; JSON Schema validates the manifest shape.
- [ ] Implement from the shared inventory + ts helpers; generate; run evals `loop-1`; commit.

### Task 9: Loop iteration 2 — type & API hygiene (behavior-preserving)

- [ ] Add `Helper.ParseConfigs` (accept object or JSON string) with a node:test that transpiles the single namespace file; wire into `Create` functions.
- [ ] Fix parameter casing drift and missing explicit return types in `OutSystems/OSUI/Patterns/*API.ts`.
- [ ] `npm run build` green; evals `loop-2`; commit.

### Task 10: Loop iteration 3 — SCSS token hygiene (behavior-preserving)

**Files:** `evals/tools/css-equivalence.mjs`, `tools/tokenize-literals.mjs` (codemod), changed SCSS.

- [ ] Tests: equivalence tool reports identical for `padding: 16px` vs `padding: var(--token-scale-400, 16px)`; reports a diff for a changed value.
- [ ] Codemod only size/space/radius/font literals with a unique `$token-*` match in the property family; never colours.
- [ ] Compile before/after, assert equivalence; `npm run build`; evals `loop-3`; commit.

### Task 11: Loop iteration 4 — documentation coverage

- [ ] JSDoc on config props and API functions lacking `@param`s; generated docs refreshed; evals `loop-4`; commit.

### Task 13: CI gate and docs freshness ✅

**Files:** `evals/tools/gate.mjs`, `scripts/lib/ai-docs-fresh.mjs`, `scripts/check-ai-docs-fresh.mjs`, `.github/workflows/ai-friendliness.yaml`, tests.

- [x] `evaluateGate`/`pickBaseline` tested; CLI compares a no-write run with the newest history entry; fails on a drop > `--max-drop` (default 1).
- [x] `compareDocs` tested (CRLF-insensitive); CLI regenerates into a temp dir and reports modified/missing files.
- [x] Workflow on `pull_request` into `dev` and `workflow_dispatch` (any branch, `max-drop` input).
- [x] Gate `--report` writes a before → after table (job summary + sticky PR comment); `results/HISTORY.md` generated from `history.json` (`npm run evals:report`, refreshed by every full run, freshness asserted by a test).
- [x] `results/dashboard.json` (`npm run evals:dashboard`, refreshed by every full run, freshness asserted by a test): the data set behind the dashboard artifact, which reads it from its database on refresh.
- [x] SonarCloud flags the workflow's `npm install` as an unlocked-dependency hotspot (fails the quality gate's security rating on new code). Every repository workflow installs the same way and the lockfile is git-ignored by policy, so it is accepted in SonarCloud with that justification (owner decision); a lockfile or a rule exclusion would be a repository-wide change.

### Task 14: Publication of the agent docs ◐

- [x] `postdocs` copies `docs-ai/` into the TypeDoc output (`npm run docs`), so the documentation deployment serves `/llms.txt` and friends at its root.
- [ ] Serve the same files at the OutSystems UI website root (external OutSystems application; needs a static-resource change there).
- [ ] MCP server over `osui.components.json`.

### Task 15: Backlog item 1 — generated `Configs` / `EventName` types ✅

**Files:** `scripts/lib/pattern-types.mjs`, `scripts/generate-pattern-types.mjs`, `src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts`, 33 `*API.ts`, `tests/pattern-types.test.mjs`.

- [x] Test-first: one namespace per pattern, alphabetical optional props with descriptions, no `Providers.`/`OSFramework.`/`GlobalEnum.` references in code, callbacks and lower-case provider fields excluded, `EventName` union + `(string & {})`, committed file fresh.
- [x] Output formatted with the repo Prettier config inside the generator; lint warning-free.
- [x] `Create(id, configs: string | Configs)`, `RegisterCallback(id, eventName: EventName, cb)` in all 33 APIs.

### Task 16: Backlog items 2 and 3 — type hygiene and API completeness ✅ / ◐

- [x] `Orientation` alias fixed; last 8 implicit-any sites annotated; `noImplicitAny: true`; three latent errors surfaced by it annotated (`AnimateOnDrag`, `Tabs`, `Tooltip`); `tsc --noEmit` clean.
- [x] 24 JSDoc blocks completed; `ChangeProperty` + error codes for SwipeEvents/TouchEvents.
- [ ] Envelope on the existing SwipeEvents/TouchEvents functions — documented breaking change (report B-3), not applied.

### Task 17: Enterprise-readiness evals (R01–R06) ✅

**Files:** `evals/enterprise/` (requirements.json, lib/signals.mjs, metrics/R01–R06, tests, README), `run.mjs` (`--suite`, `enterprise` block in runs and history), `lib/results.mjs` (class column, titled tables), `tools/gate.mjs` (second index, coverage no-decrease rule, `--max-drop-enterprise`), `tools/report.mjs` and `tools/dashboard-data.mjs` (second suite), ADR-0012, proposal doc.

- [x] Requirements map transcribed from the document with owner, status and evidence rules; a test fails when an evidence rule stops matching.
- [x] R02–R06 built from substring signals over TypeScript and compiled CSS (no regexes over source, no execution, paths confined); per-component rows with failed checks as hints.
- [x] Second index, never merged with the AI-Friendliness Index; `roadmap` class for R01.
- [x] Baseline `loop-6`: Enterprise Readiness Index 50.7 (R01 68.9, R02 31.0, R03 55.1, R04 75.7, R05 44.6, R06 28.7).
- [ ] Dynamic phase: axe over the Storybook stories in the Chromatic workflow, feeding R02's detail.
- [ ] Owner review of the hand-set statuses in `requirements.json` (partial / missing rows carry the reason).

### Task 18: Enterprise loop, run 1 (`loop-7`) ✅

The refine loop now covers both suites: measure → apply what is additive → re-measure → record. Enterprise Readiness Index 50.7 → 65.7; AI-Friendliness Index unchanged (E08 +0.1).

- [x] Metric fidelity first (no runtime change): the theme-level reduced-motion guard in `01-foundations/_resets.scss` and its global focus ring count for every component (R04, R06, R02); gesture helpers without DOM are out of the ARIA check; a native button, link or input in the story markup satisfies Enter/Space (R03); Progress already announces through `role="progressbar"` + `aria-valuenow`; Wizard is navigation, not feedback; density is expected on items, not containers (R05).
- [x] Additive code, computed values unchanged: density knobs with defaults equal to the previous fixed values on list-item, accordion-item title, card-detail gap, card-sectioned padding, dropdown-serverside item, form field spacing (R05 +3.3, E08 +0.1); `role="search"` on the Search pattern, whose accessibility hook was a stub (R02).
- [ ] Next additive candidates, in order of value: `.os-high-contrast` rules for the 78 components without them (R02), loading and invalid state styles where the component has the state but no style (R06), a density knob on `menu-app-menu-links` (R05), Arrow-key handlers for TabsHeaderItem / WizardItem / SectionIndexItem (R03, behaviour addition, needs review).
- [ ] Breakpoint rules (R05) and new components (R01) stay out of the loop: layout changes and roadmap work.

### Task 19: Loop run 2 (`loop-8`) — findings from both suites ✅

Enterprise Readiness Index 65.7 → 67.9; AI-Friendliness Index 88.2 → 87.9 (E07 −2.9 because 22 more components are now measured, see below; E08 +0.4, E09 +0.1).

- [x] E07: story aliases for `btn` → Button and `radio-button` → RadioGroup, which already had widget stories.
- [x] E07: the 20 CSS-only components without a story, resolved in `loop-10` (Task 20) after the generated stories of `loop-8` were rolled back in `loop-9`: 18 are host-styled and out of E07's scope by design; bulk-actions and provider-login-button got real stories.

### Task 20: Loop run 3 (`loop-10`) — host-styled components ✅

Indices unchanged (AI-Friendliness 88.2, Enterprise Readiness 67.9); E07 measures 85 components, 0 without story, 18 not applicable.

- [x] `evals/lib/host-styled.json` (since Task 21: the `host` field of `evals/components.json`): 18 CSS-only components that style markup owned by something else, each with its host and reason: the app template Layout and Menu blocks (layout, content, header, header-layout-_, menu, menu-layout-_, menu-app-*, menu-header-logo, themegrid-container), the Login common screen (login), runtime utility classes (animate, align-center), the platform runtime (ios-bounce, pull-to-refresh) and the patterns that position it (balloon). E07 reports them as not applicable instead of "no story"; the dashboard shows them as n/a with the host.
- [x] `llms-patterns.txt` marks them **host-styled** with the host and "do not generate this markup", listing their knobs; the intro explains the rule.
- [x] Stories for the two components with a contract of their own: `widgets/BulkActions` (Table widget DOM with the Checkbox widget selection column, following the ADR-0009 transcription method) and `ProviderLoginButton`.
- [ ] Optional: one captured reference story per layout family (Side, Top, Blank, Native) from a generated app, scored once, if the depth of the host an agent works inside should be measured at all.

- [x] E08: additive knobs with defaults equal to the previous values on bulk-actions (check and indeterminate colours), ButtonLoading (spinner size, gap, border, label size) and scrollable-area (scrollbar size, thumb colours and radius; three literal colours routed). Dropdown left out: its balloon is portaled (B-7 review); menu-layout-native left out: its values are structural offsets, not theme values.
- [x] R03 fidelity: a key handled by a family member (Tabs for its header items) or by a shared feature the pattern uses (Balloon for Escape) counts; a native control created in TypeScript (Rating's radios) activates itself; provider credit per key; Gallery is a static grid, step indicators and link lists are not roving-focus widgets.
- [x] E01: guidance line in `llms.txt` to load a component card, never the compiled typings.
- [ ] E02 prop counts and stringly-typed enums: public-contract changes, documented as B-9; not applied.
- [ ] E08 `!important` removal: cascade change, documented as B-8; not applied.
- [ ] R03 remaining: Accordion (parent, no activation of its own by design), TimePicker / Carousel arrow keys beyond the provider, Wizard and SectionIndex families; behaviour additions that need design review.

### Task 21: Scaling review, batches 1–3 (`loop-11`) ✅

**Files:** `evals/suites.mjs`, `evals/components.json`, `evals/lib/{registry,present,results}.mjs`, `evals/tools/{gate,report,dashboard-data,dashboard-page,doctor}.mjs`, `evals/dashboard/index.html`, every metric (`present` block), `evals/README.md`, ADR-0013. Review note: `docs-internal/ai-friendliness/2026-09-30-evals-scaling-review.md` (working note, not committed).

- [x] Shared runner, libraries, tools, results and tests moved to `evals/`; a suite directory holds metrics, tests and README. `npm test` runs the enterprise tests (the previous glob skipped them: 97 → 107 tests).
- [x] Suite registry; history entries and run files carry one block per suite (older shapes normalised on read); the runner, gate, history report, dashboard data and page iterate the registry.
- [x] Self-describing metrics (`present`, `rules`) with a contract test over every suite; the dashboard data tool knows no eval by id. Every measured cell and advice text identical to loop-10.
- [x] Not applicable distinct from unmeasured in R03–R06, E08 and E09, each with a hint; history records the unmeasured count per eval.
- [x] Gate: per-eval tolerance (3), no-decrease rules from the metrics, measurement-coverage rule, baseline and origin from the newest `dev` run once one exists; the report carries the doctor section.
- [x] Component registry seeded from the previous sets (102 entries); inventory and enterprise signals read it; a test fails when the tree and the registry disagree; `npm run evals:doctor` (`--fix`) derives entries from code. Checked: a probe partial is flagged with its derived entry and missing story, and the tree is clean again once removed.
- [x] Dashboard page template versioned with a build (`npm run evals:dashboard:page -- --check`) that renders the page in a document stub; data set v3 with one block per suite.
- [x] `evals/README.md` entry point (run, gate rules, add an eval, add a suite, classify a component, publish, hygiene conventions); suite READMEs, design doc and ADR-0013 updated.

### Task 22: Scaling review, batch 4 — CI recording and stale-file handling ✅ (decisions: results branch · fail with instructions · artifact)

**Files:** `.github/workflows/ai-friendliness.yaml` (recording steps, history step; one job for both events so the install step is not repeated), `evals/tools/publish-results.sh`, `evals/RESULTS-BRANCH.md`, `package.json` (`evals:fix`), `evals/run.mjs` (latest.json), `evals/tools/dashboard-data.mjs` (latest.json fallback).

- [x] Every push to `dev` records `dev-<sha>` and publishes history.json, HISTORY.md, dashboard.json, latest.json and the last 20 run files to the orphan `evals-results` branch with git plumbing; nothing is committed to `dev`. The gate job fetches that history as its baseline when the branch exists, so a PR is judged against its base branch.
- [x] Stale generated files fail the PR with instructions; `npm run evals:fix` regenerates docs-ai/, the pattern types, HISTORY.md, dashboard.json and the registry entries locally. No bot commits on PR branches.
- [x] The dashboard stays a Claude artifact, refreshed from `results/dashboard.html` and `dashboard.json` after a run.
- [x] PR-scoped section: `evals/tools/touched.mjs` maps the changed files (API, contract, typing and SCSS files, story, pattern and provider directories) to components; the gate (`--changed`, `--base-run`) appends each touched component with its heatmap cells before → after and the hints of cells that dropped or sit below 80; the workflow diffs the PR against its base and takes `latest.json` from the results branch.
- [ ] The first push to `dev` after the merge creates the branch; until then the gate compares with the committed history.

### Task 23: Loops measure pattern code only ✅

**Files:** `evals/lib/inputs.mjs`, `evals/run.mjs` (`--force`), `evals/lib/results.mjs` (`inputs` in history entries), `evals/tools/publish-results.sh`, `evals/results/history.json`.

- [x] Rule: a run is recorded only when the fingerprint of `src/` (without generated tokens), `stories/` and `docs-ai/` differs from the newest recorded run's; tooling, dashboard, workflow and docs changes write the run file but no history entry; `--force` overrides for a deliberate re-baseline.
- [x] History corrected by the same rule, checked against the recording commits: `loop-6` (first enterprise measurement, run on exactly `loop-5`'s tree) folded into `loop-5` as its enterprise block; `loop-11` (tooling only, 0 measured files) removed. Every remaining loop changed pattern sources, stories or agent docs (`loop-8` 29 files, `loop-9` 22, `loop-10` 3, `loop-12` 3 from the `dev` merge). Fingerprints back-filled from the recording commits.

### Task 24: Component tiers (`loop-13`, batch 1) ✅

**Files:** `evals/lib/tiers.mjs`, `evals/lib/registry.mjs`, `evals/lib/inventory.mjs`, `evals/components.json`, every metric (`present.appliesTo` as a tier list; E07–E09 and R02–R06 filter by it), `evals/lib/results.mjs` (`tierSummary`), `evals/run.mjs`, `evals/tools/{report,dashboard-data,doctor,touched}.mjs`, `evals/dashboard/{index.html,dashboard.mjs}` (data set v4), `scripts/lib/ai-docs.mjs` (`llms-patterns.txt` by tier), ADR-0014. Review note: `docs-internal/ai-friendliness/2026-09-30-docs-tiers-utilities-review.md` (working note, not committed).

- [x] Four tiers with a directory default and a registry override; `css` still reads as `component`; the registry test reports tier overrides without failing (`animate`, `columns`, `list-updating`, `provider-login-button`, `pull-to-refresh`). The duplicate `_section.scss` partials get one name each (`section`, `layout-section`).
- [x] Reclassified: 33 patterns, 48 components, 16 layout partials, 30 utility entries (6 helpers + 24 families); `align-center` and `animate` lose the misused `host`.
- [x] Per-tier scores and index per suite, additive (`tiers` in run files, history entries, `HISTORY.md` table, dashboard tiles); the suite index keeps its definition. AI by tier: patterns 88.6, components 75.5, layout 71.9; enterprise: 69.9 / 62.5 / 54.3.
- [x] A cell an eval does not apply to by tier is omitted from `dashboard.json` and composed by the page from the eval's `appliesTo` (402 KB → 180 KB, under the artifact database limit).

### Task 25: Utilities suite (`loop-13`, batch 2) ✅

**Files:** `evals/lib/utilities.mjs`, `evals/utilities/{metrics,tests,README.md}`, `evals/suites.mjs`, `scripts/lib/ai-docs.mjs` (`renderUtilities` v2, `buildUtilitiesManifest`), `docs-ai/{llms-utilities.txt,osui.utilities.json,schema/osui.utilities.schema.json}`, `evals/ai-friendliness/metrics/E05-documentation.mjs` (fifth tier), `package.json` (`evals:utilities`).

- [x] Utility classes read from the compiled `05-useful` partials as the subject of each selector (538 classes; the nine `scss` artifacts and the `phone`/`tablet` body classes are gone), with declarations, variants and tokens.
- [x] U01 grammar 90.6 (481/531, 50 legacy names), U02 scale 75.0 (14 missing steps), U03 token routing 99.4, U04 documentation parity 100, U05 synonym pressure 89.4 (22 groups: all `-lightest` backgrounds, `text-*-darker` = base, teal = cyan, `hidden` = `display-none`, `font-bold` = `bold`, `shadow-xs` = `shadow-s`), U06 responsive coverage 0 (roadmap). Utilities Index 75.7.
- [x] `llms-utilities.txt` grammar-first with template rows (3,898 tokens for the grammar and a declaration per row); `osui.utilities.json` (211 KB) with a schema; U04 and the renderer share the template function.

### Task 26: TSDoc, schemas, agent entry points and publication (batch 3) ✅

**Files:** `src/scripts/**/*.ts` (252 files, comments only), `.eslintrc.json` (`eslint-plugin-jsdoc`, warnings), `typedoc.json`, `.claude/rules/typescript.md` §7, `evals/lib/ts.mjs` (`paramDescriptions`, `returns`, `documentedDefault`), E05 v2, `scripts/lib/ai-docs.mjs` (`usageOf`, `configSchemaOf`, card pointer), `scripts/lib/ai-docs-fresh.mjs` (nested files), `docs-ai/schema/configs/*.schema.json` (33), `AGENTS.md`, `CLAUDE.md`, `evals/tools/publish-results.sh`, `evals/RESULTS-BRANCH.md`, workflow header.

- [x] Codemod, behaviour-neutral and reproducible from the committed source: 284 `@returns` texts derived from the return type and the envelope, 1,907 Closure tags and 1,825 type braces removed, 135 prop `//` comments converted to `/** */`, 29 `@param` names aligned with their signatures, 3 tags of non-existent parameters dropped, 20 bare `@param` tags added. Every manifest description identical before and after.
- [x] Lint: 0 errors; 689 warnings, every one a parameter without a description (owners' text, not derivable); the rules become errors once written. TypeDoc validates with 0 errors and no whitelisted tag (7 pre-existing warnings about namespaces declared with a comment more than once). `npm run build:osui -- --target O11` green.
- [x] E05 v2 facets: 94.0 (288.5/348 function facets, 172 of 348 functions complete); E03 reads `@defaultValue`; a configs JSON Schema and a usage example per pattern, pointed at from the card and `llms.txt`.
- [x] `AGENTS.md`; `CLAUDE.md` command table and agent-documentation section; `docs-ai/` published to the results branch with every recorded run.
- [ ] Owners: parameter descriptions (689), `@defaultValue` for the 66 props without a code default, the review's §3.3 decisions (aliases, scale steps, viewport variants).

### Task 12: Report + ADR

**Files:** `docs-internal/ai-friendliness/REPORT.md`, `docs-internal/adr/ADR-0011-ai-friendliness-eval-suite.md`, ADR log row.

- [ ] Six sections as requested; BEFORE/AFTER snippets for each documented breaking change; tracking matrix from `results/history.json`.
- [ ] Commit.
