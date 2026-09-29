# AI-Friendliness Eval Suite — Design

**Status:** Accepted (autonomous session; the request supplied the brief, constraints and output structure, so this design was written back rather than negotiated).
**Branch:** `agents/osui-validate-evals`
**Date:** 2026-09-29

## 1. Brief (written back)

**Intended outcome.** Measure how well the OutSystems UI codebase (this repository) fits the way LLM coding agents generate UI, using a repeatable, code-driven suite of ten scored evals; run a local refine → re-measure loop; and derive a gap analysis, an action plan and a next-generation architecture specification.

**Who it is for.** The UI Components team and the Model Services team exploring the "TS Coding Agent → Application TS Code → TS Model Framework → OML" pipeline, in which OutSystems UI is one of the runtime libraries an agent composes against.

**Success looks like.**
- `node evals/ai-friendliness/run.mjs` produces the same scores for the same commit, and a history file tracks progression across commits.
- Each of the ten evals has a written definition, a formula and a benchmark band calibrated against the research baseline (shadcn/ui, Radix, Tailwind-style systems).
- The loop applies only changes that keep runtime behavior identical (verified by build + CSS-equivalence check), and documents every improvement that would change behavior with BEFORE/AFTER snippets.
- The final report has the six requested sections.

**Constraints (stated by the request).**
- All work on branch `agents/osui-validate-evals`.
- No Jira keys anywhere in code, comments, commit messages or docs.
- Behavior-preserving changes only; breaking improvements are documented, not applied.

**Assumptions (mine, open to correction).**
- "AI-friendly" is evaluated for a *TypeScript coding agent* consuming the library (per the pipeline diagram), not for a Service Studio user. The public surface is therefore `OutSystems.OSUI.*`, the pattern markup contracts, the SCSS component CSS API, and any machine-readable docs.
- Token counts use the `o200k_base` BPE (via `gpt-tokenizer`) as a cross-vendor proxy; absolute numbers differ per model, relative comparisons hold.
- Size/space/radius literal → design-token substitutions are behavior-preserving (the shipped dark theme re-maps only colour tokens); colour literal → token substitutions change dark-theme rendering and are therefore *documented*, not applied.
- Adding devDependencies, scripts, generated docs and tests is non-breaking for the runtime bundle.
- **Single theme.** Agents target only the token-based theme (light plus the generated dark mode). The
  pre-migration snapshot in `classic-theme/` is a compiled Storybook comparison artifact with no source,
  no build target and no presence in `dist/`; it is outside every eval and every generated document.
  Verified 2026-09-29: the inventory never read it, removing the 201 Service Studio-only preview rules
  from component CSS leaves E08 unchanged and moves E09 by −0.3, and no component partial reads the
  classic-compatible aliases (`--color-neutral-*`, `--space-*`, `--border-radius-none|soft|rounded`).

## 2. Research baseline → measurable criteria

The three research documents converge on these properties of LLM-friendly UI frameworks. The right column names the eval that operationalizes each.

| Research criterion | Why it matters to an agent | Eval |
| --- | --- | --- |
| Token & context efficiency | Fewer tokens to read before producing correct code | E01 |
| Explicit prop schemas / typed contracts | >50% fewer generation errors with strict types | E02, E04 |
| Machine-readable metadata (JSON schema, llms.txt, MCP) | Agents load exact signatures instead of scraping | E03, E05 |
| Predictable composition / snippet predictability | Same shape everywhere → high pass@1 | E06 |
| Flat anatomy, named slots, shallow nesting | Misplaced children are the #1 layout bug | E07 |
| Semantic design tokens, no hardcoded values | Theming by variables, no rule overrides | E08 |
| Low selector specificity / simple cascade | Agents can style without fighting the framework | E09 |
| Pre-training density / open-web composition model | Proprietary DSLs need heavy context injection | E10 |

Two research criteria are *not* measurable statically inside this repository and are covered qualitatively in the report: closed-loop sandbox feedback (Reflexion) and streaming/generative UI. Open-code distribution is partially captured by E10 (module format) and discussed in the next-gen spec.

## 3. Architecture

```
evals/ai-friendliness/
  run.mjs                 CLI: run all/selected evals, write results, print table, compare labels
  lib/
    inventory.mjs         pattern & component discovery (API files, config/enum/interface, gulp specs, stories, scss)
    tokens.mjs            o200k token counting (gpt-tokenizer)
    ts.mjs                TypeScript compiler-API helpers (program, AST walkers, JSDoc, inheritance)
    scss.mjs              per-component SCSS compile (sass), postcss parse, selector specificity/depth
    markup.mjs            HTML template-literal extraction from stories, depth/element counting
    score.mjs             clamp/linear-band helpers, aggregation
  metrics/
    E01-context-tokens.mjs … E10-composition-model.mjs   one module per eval: { id, name, criterion, formula, compute(ctx) }
  tests/                  node:test unit tests with inline fixtures (TDD)
  results/
    history.json          [{ label, date, sha, scores: {E01..E10, index} }]
    <label>.json          full per-component details for one run
  README.md               how to run, how to read, how to extend
scripts/generate-ai-docs.mjs   generates docs-ai/* from the same inventory (loop iteration 1)
docs-ai/                       osui.components.json (+ JSON Schema), llms.txt, llms-components.txt, llms-tokens.txt, llms-patterns.txt
tests/                         node:test unit tests for src helpers changed in the loop (namespace files transpiled in isolation)
docs-internal/ai-friendliness/ this design, the plan, the REPORT
docs-internal/adr/ADR-0011-*   decision record for the suite
```

**Runtime.** Node ≥ 22 (repo pins 24), ESM `.mjs`, zero build step. Reuses existing devDependencies (`typescript`, `sass`, `postcss`, `postcss-selector-parser`); adds one (`gpt-tokenizer`). `.mjs` mirrors the existing `scripts/*.mjs` tooling convention and stays outside `eslint . --ext .ts` and `tsconfig include`, so it cannot affect the library build.

**Data flow.** `inventory` builds the component list once → each metric receives a shared `ctx` (inventory, TS program, compiled CSS cache, token counter) and returns `{ score, raw, perComponent }` → `run.mjs` aggregates, writes JSON, prints a table.

**Determinism.** No network, no time-dependent inputs; results carry the git SHA. Sorting is stable everywhere.

**Path confinement.** Every file the suite and the generators touch is resolved through `lib/paths.mjs` (`insideDir`): a base directory the caller controls plus data-derived segments (CLI labels, directory listings, spec entries, git metadata), and anything that resolves outside the base is refused. Result labels must be single file names and git refs must be plain `refs/…` names.

**Error handling.** A metric that cannot measure a component records it under `unmeasured` with a reason and excludes it from the mean; a metric that throws fails the whole run (a broken eval must not silently report a score).

## 4. The ten evals

Scores are 0–100, higher is better. `clamp(x)` bounds to [0,1]. Component means use equal weights. The overall **AI-Friendliness Index** is the unweighted mean of E01–E10.

### E01 · Context Token Cost — Token & Context Efficiency
- Unit: TS pattern (33). `T_src` = o200k tokens of the pattern's *contract surface*: its `*API.ts`, `*Config.ts` files (own + provider), `Enum*.ts`, `I*.ts`. `T_card` = tokens of its `## <Name>` card in `docs-ai/llms-components.txt` when the manifest entry scores ≥ 0.8 on E03 (a card only counts when it is complete). `T = min(T_src, T_card)`.
- Score per component: `100 · clamp((T_max − T) / (T_max − T_min))` with `T_min = 600`, `T_max = 6000`.
- Calibration: shadcn/ui component files measured in this session (see report) fall between ~200 and ~2,400 tokens, median ≈ 900; a whole component is read in one file. 600 is the "one flat file" band; 6,000 is where a component no longer fits a modest context budget alongside the task.
- Also reported (not scored): sum of `T_src`, tokens of the compiled `dist/ODC.OutSystemsUI.d.ts` (the entire typed public surface).

### E02 · Prop Surface & Typing Precision — Schema & Anatomy
- Unit: TS pattern. Props = public fields of its configuration class chain (excluding the shared `ExtendedClass`).
- A prop is *precise* when its declared type is `boolean`, `number`, an enum/union type, a declared object/array type, or `string` that is **not** validated with `validateInRange` (a string validated against a fixed set is a stringly-typed enum → imprecise). `unknown`, `any` or no annotation → imprecise.
- `size = clamp(1 − max(0, n − 8) / 12)`; `type = precise / n` (n = 0 → 1).
- Score: `100 · (0.4·size + 0.6·type)`.

### E03 · Machine-Readable Schema Completeness — Schema & Metadata
- Reads `docs-ai/osui.components.json`. Missing file → 0.
- Per TS pattern, six facets each in [0,1]: `props` (coverage of E02 props with a `type`), `defaults` (coverage of props that have a `validateDefault` default), `api` (coverage of exported API functions), `events` (coverage of `Enum.Events` / `registerCallback` cases), `cssClasses` (coverage of `Enum.CssClass*` values), `markup` (non-empty markup contract).
- Component score = mean of facets · 100. Eval = mean · (entries / patterns).
- Validity gate: the file must parse and declare `$schema` or `version`; otherwise 0.

### E04 · Type Strictness — Type-Constrained Determinism
- Whole `src/scripts` program compiled with the repo `tsconfig` plus `noImplicitAny: true` (`noEmit`). `implicit = count of diagnostics 7000–7099`.
- `explicit = count of AnyKeyword type nodes` outside `.d.ts`. `suppressions = @ts-expect-error + @ts-ignore`. `missingReturn = exported functions in OutSystems/OSUI/** without a return type annotation / exported functions`.
- `KLOC = TS lines / 1000`.
- Score: `clamp0(100 − min(40, 4·implicit/KLOC) − min(20, 10·explicit/KLOC) − min(10, 2.5·suppressions) − 30·missingReturn)`.

### E05 · Documentation Coverage — Agent Documentation
- `jsdocApi` = exported API functions with a description **and** an `@param` per parameter / total.
- `jsdocProps` = config props with a JSDoc or `//` comment on the preceding line / total.
- `agentDocs` (0–100, 25 each): `docs-ai/llms.txt`; `llms-components.txt` with a `## <Name>` section per TS pattern (prorated); `llms-tokens.txt` (theme roles + `--osui-*` knobs); `llms-patterns.txt` (composition recipes).
- Score: `0.35·jsdocApi·100 + 0.15·jsdocProps·100 + 0.5·agentDocs`.

### E06 · Public API Shape Consistency — Snippet Predictability
- Canonical set per API: `Create`, `Initialize`, `Dispose`, `ChangeProperty`, `RegisterCallback`, `Get<Name>ById`, `GetAll<Name>[s]`. `presence = found / 7`.
- `envelope` = exported functions (excluding `Create`, `Initialize`, `Get*ById`, `GetAll*`) whose body calls `CreateApiResponse` / eligible.
- `params` = parameters named in `camelCase` / all parameters.
- `codes` = 1 if no inline `'OSUI-API-…'` literal appears in the file, else 0.
- Score: `100 · (0.4·presence + 0.3·envelope + 0.2·params + 0.1·codes)`.

### E07 · Markup Contract Depth — Anatomy & Composition
- Unit: any component with a story (TS pattern or CSS-only). HTML template literals are extracted from `stories/<Story>.stories.ts`; local helper functions returning template literals are inlined once where interpolated.
- `depth` = maximum element nesting depth across templates; `elements` = element count of the deepest template.
- Score: `clamp0(100 − 20·max(0, depth − 3) − 4·max(0, elements − 6))`.
- Calibration: shadcn Accordion usage is `Accordion > AccordionItem > (Trigger, Content)` → depth 3, 4 elements → 100.
- Not applicable: CSS-only components listed in `lib/host-styled.json` style markup owned by something else (app template Layout and Menu blocks, the Login common screen, the platform runtime, or the patterns that position them). An agent never emits that markup, so they are excluded from the mean and reported as `notApplicable` with their host, distinct from `unmeasured` (a component with a contract of its own but no story).

### E08 · Design Token Semantics — Semantic Tokens & Theming
- Unit: component SCSS file (04-patterns, 03-widgets, 02-layout; vendor `_lib`, `_ss_preview`, `provider/` excluded).
- Considered declarations: colour, background, border(-color/-width), box-shadow, padding/margin/gap/inset, border-radius, font-size/line-height.
- `literal` = value contains a raw colour (`#hex`, `rgb[a](`, `hsl[a](`) or a non-zero `px|rem|em` number and references neither `$token-`/`variables.$token-` nor `var(--`.
- `routed` = value reads `var(--osui-…)` (component CSS API).
- `important` = `!important` count.
- Score: `100 · (0.55·(1 − literal/total) + 0.30·routed/total + 0.15·clamp(1 − important/(0.02·total)))`.

### E09 · CSS Selector Complexity — Predictable Cascade
- Each component SCSS file is compiled standalone with `sass` (`loadPaths: src/scss`); rules parsed with `postcss`; selectors analysed with `postcss-selector-parser`.
- `depth` per selector = combinator count; `spec` = specificity (a,b,c).
- `avgDepth`, `p90b` = 90th percentile of the class/attribute/pseudo-class component.
- Score: `100 · (0.6·clamp(1 − max(0, avgDepth − 1)/3) + 0.4·clamp(1 − max(0, p90b − 2)/4))`.
- Files that fail to compile standalone are reported as unmeasured.

### E10 · Composition Model & Standards Alignment — Pre-training Density
- Unit: TS pattern. `depth` = inheritance chain length from the concrete class to the root abstract class. `files` = number of source files in the contract set (class, config, enum, interface, factory, provider class/config).
- Binary properties: `configShape` (1 if `Create` accepts an object or typed configs, 0 if JSON string only), `eventModel` (1 if event names are typed, 0 if `string`), `moduleFormat` (1 for ES module exports, 0 for global namespaces).
- Score: `clamp0(100 − 12·max(0, depth − 1) − 5·max(0, files − 4) − 15·(1 − configShape) − 10·(1 − eventModel) − 15·(1 − moduleFormat))`.

## 5. Refinement loop protocol

1. Run the suite on the branch tip; label the run (`baseline`, `loop-1`, …).
2. Rank evals by (100 − score) × movability. *Movable* = can improve with behavior-preserving edits (E01, E03, E04, E05, E06, E08 partially, E10 partially). *Structural* = needs breaking changes (E07, E09, most of E10) → documented.
3. Apply one themed change-set per iteration, each guarded by: `npm run build` (both targets, lint zero warnings), `npm test` (node:test), and for SCSS the CSS-equivalence check (`var(--token-*, fallback)` resolved to fallback and diffed rule-by-rule against the pre-change bundle).
4. Re-run, record, commit with a conventional-commit message (no ticket keys).
5. Stop when the movable evals gain < 1 point in an iteration or reach ≥ 90.

**Decision taken during the loop (E08).** The 96 hardcoded declarations the baseline found are
almost all deliberate local values — `-1px`/`-2px` positional nudges, `50px`/`100px` pill radii,
vendor-override line-heights — with no exact design-token counterpart, which is exactly the case
the SCSS rules allow ("need a value with no token yet? keep it local"). An automated literal → token
codemod would therefore be low-value and semantically dubious, and the planned CSS-equivalence gate
was not needed. E08's real gap is the *routing* term (18% of themeable declarations read through an
`--osui-*` knob); closing it is a per-component design decision recorded in the roadmap, not a loop
iteration.

## 6. Non-goals
- Running LLM generation experiments (pass@1) — the suite is static and deterministic so it can gate CI.
- Changing DOM structures, class names, selectors, public signatures or the module format on this branch — those are specified as breaking changes in the report.
- Replacing the Storybook or the E2E test repository.

## 7. Risks
| Risk | Mitigation |
| --- | --- |
| Token counts differ per model | Documented as a proxy; thresholds are bands, not absolutes |
| Standalone SCSS compile fails for some files | Reported as unmeasured, not silently 0; the bundle compile is the fallback |
| A "safe" edit alters behavior | Build + CSS-equivalence gate; colour substitutions are never applied |
| Eval gaming via stub docs | E01 only credits cards whose manifest entry is ≥ 80% complete (E03) |
