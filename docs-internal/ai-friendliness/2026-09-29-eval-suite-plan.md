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
**Files:** `evals/ai-friendliness/lib/inventory.mjs`, `evals/ai-friendliness/tests/inventory.test.mjs`
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
**Files:** `evals/ai-friendliness/tools/css-equivalence.mjs`, `tools/tokenize-literals.mjs` (codemod), changed SCSS.
- [ ] Tests: equivalence tool reports identical for `padding: 16px` vs `padding: var(--token-scale-400, 16px)`; reports a diff for a changed value.
- [ ] Codemod only size/space/radius/font literals with a unique `$token-*` match in the property family; never colours.
- [ ] Compile before/after, assert equivalence; `npm run build`; evals `loop-3`; commit.

### Task 11: Loop iteration 4 — documentation coverage
- [ ] JSDoc on config props and API functions lacking `@param`s; generated docs refreshed; evals `loop-4`; commit.

### Task 12: Report + ADR
**Files:** `docs-internal/ai-friendliness/REPORT.md`, `docs-internal/adr/ADR-0011-ai-friendliness-eval-suite.md`, ADR log row.
- [ ] Six sections as requested; BEFORE/AFTER snippets for each documented breaking change; tracking matrix from `results/history.json`.
- [ ] Commit.
