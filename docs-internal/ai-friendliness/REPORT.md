# OutSystems UI — AI-Friendliness Evaluation Report

**Branch:** `agents/osui-validate-evals` (from `dev` @ `c0c45f9ad`) · **Date:** 2026-09-29
**Suite:** `npm run evals` (`evals/ai-friendliness/`) · **Docs:** `npm run docs:ai` (`docs-ai/`) · **Tests:** `npm test` (57 passing)
**Companion documents:** [eval design & formulas](./2026-09-29-eval-suite-design.md) · [ADR-0011](../adr/ADR-0011-ai-friendliness-eval-suite.md)

---

## 1. Executive Summary

### Core vision

OutSystems is moving towards a pipeline in which a **TypeScript coding agent** writes application
code against runtime libraries — OutSystems UI, Charts, Maps, Data Grid — and a TS model framework
compiles that code into OML. In that world a UI library is good for an agent when it is _legible to
a model_: cheap to read, explicit about its contracts, predictable in shape, and styled through
semantic tokens rather than rules. The research baseline (shadcn/ui, Radix, Tailwind-style systems,
HeroUI, React Suite) names the properties that make this true; this work turned them into ten
repeatable evals, ran them against this repository, and drove a behavior-preserving refinement loop.

### Key findings

1. **The library's foundations are strong and mostly invisible to a model.** 94 % of the 141
   configuration props are precisely typed, every one of the 33 public APIs follows the same
   `Create → Initialize → Dispose` shape with a JSON envelope, only 3 % of themeable CSS declarations
   are hardcoded, and the human documentation (ARCHITECTURE, CSS-ARCHITECTURE, rules files) is
   unusually good. None of that was machine-readable: schema completeness scored **0** and agent
   documentation **0/100** at baseline.
2. **Context cost was the dominant bottleneck.** Using a pattern correctly required reading a mean
   of **2,656 tokens** of source spread over 4–13 files (Dropdown: 9,168 tokens / 13 files;
   DatePicker: 8,155 / 11), against a **912-token median** for a shadcn/ui component that lives in
   one file. The complete typed public surface (`dist/ODC.OutSystemsUI.d.ts`) is ~51k tokens.
3. **Generating the contract from the source closes most of the gap without touching runtime
   code.** A manifest + tiered `llms.txt` set, derived with the same readers the evals use, brought
   the mean context cost to **435 tokens per pattern** and schema completeness to 100 %.
4. **Three gaps are structural and need breaking changes**: the composition model (global AMD
   namespaces, string-typed event names, 3–4 levels of inheritance behind provider patterns), the
   depth of the markup contracts an agent must reproduce (mean depth 3.7, up to 8), and the
   cascade (p90 class specificity of 6–8 in Rating, Accordion, Form; only 18 % of themeable
   declarations routed through a `--osui-*` knob). These are specified, with before/after snippets,
   in §5 and §6 — not applied.
5. **Pre-training density is the criterion no local change can fix.** `OutSystems.OSUI.Patterns.
AccordionAPI.Create(id, '{"MultipleItems":true,"ExtendedClass":""}')` plus the `name`/`id`/
   `[data-block]` DOM contract exists in no public corpus; every agent call needs injected context.
   The generated cards make that injection ~430 tokens instead of ~2,700, but the long-term answer
   is the open-web composition model in §6.

### Final scores

| ID  | Eval                                    | Baseline | Final (loop-4) |                Δ |
| --- | --------------------------------------- | -------: | -------------: | ---------------: |
| E01 | Context Token Cost                      |     64.9 |           99.9 |            +35.0 |
| E02 | Prop Surface & Typing Precision         |     94.6 |           94.7 |             +0.1 |
| E03 | Machine-Readable Schema Completeness    |      0.0 |          100.0 |           +100.0 |
| E04 | Type Strictness                         |     83.2 |          100.0 |            +16.8 |
| E05 | Documentation Coverage                  |     35.8 |          100.0 |            +64.2 |
| E06 | Public API Shape Consistency            |     97.7 |           98.7 |             +1.0 |
| E07 | Markup Contract Depth                   |     75.1 |           75.1 | 0.0 (structural) |
| E08 | Design Token Semantics                  |     72.3 |           72.3 | 0.0 (structural) |
| E09 | CSS Selector Complexity                 |     79.9 |           79.9 | 0.0 (structural) |
| E10 | Composition Model & Standards Alignment |     39.4 |           60.8 |            +21.4 |
| —   | **AI-Friendliness Index**               | **64.3** |       **88.1** |        **+23.8** |

All applied changes compile for both platform targets with zero lint warnings, leave the emitted
CSS untouched and change no runtime behavior (details in §5).

**Scope assumption: a single token-based theme.** Agents target only the token theme on `dev`
(light plus the generated dark mode). The pre-migration snapshot in `classic-theme/` is two compiled
CSS files served by Storybook for a visual comparison toggle; it has no source, no build target and
is absent from `dist/`. Checking the assumption changed no score: the evals never measured the
snapshot, removing the 201 Service Studio-only preview rules from component CSS leaves E08 unchanged
and moves E09 from 79.9 to 79.6, and no component partial reads the classic-compatible aliases.
What it did change is scope: the 554 token-generated utility classes are now documented
(`docs-ai/llms-utilities.txt`), the 16 legacy alias roles are marked in `llms-tokens.txt`, and the
next-generation specification (§6) assumes one theme.

---

## 2. Top-10 AI-Friendliness Eval Suite Specification

The suite is static and deterministic (no network, no model calls), runs in ~25 s, and writes
`evals/results/<label>.json` plus `history.json`. Scores are 0–100, higher is
better; the Index is their unweighted mean. `clamp` bounds to [0, 1]; component means use equal
weights. Formulas are also embedded in every results file.

| ID  | Eval · research criterion                                          | Unit                                             | Score formula                                                                                                                                                                                                                                         | Benchmark / band                                                                                                                                  | Movable by non-breaking change       |
| --- | ------------------------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| E01 | **Context Token Cost** · token & context efficiency                | TS pattern (33)                                  | `100 · clamp((6000 − T) / 5400)`; `T = min(o200k tokens of API+Config+Enum+Interface files, tokens of a ≥80 %-complete manifest card)`                                                                                                                | shadcn/ui components measured in-session: median 912, mean 1,325, range 173–5,564 tokens; 600 = one flat file, 6,000 = does not fit a task budget | yes                                  |
| E02 | **Prop Surface & Typing Precision** · schema & anatomy             | TS pattern                                       | `100 · (0.4·clamp(1 − max(0, n − 8)/12) + 0.6·precise/n)`; precise = boolean, number, enum/union, typed object/array, or free string. A string validated with `validateInRange` or defaulted to an enum member is a _stringly-typed enum_ (imprecise) | ≤ 8 props free; 20 props → size term 0                                                                                                            | yes                                  |
| E03 | **Machine-Readable Schema Completeness** · schema & metadata       | TS pattern                                       | mean of six facets (props typed, defaults, api, events, cssClasses, markup) · 100 · (entries/patterns); 0 without a versioned `docs-ai/osui.components.json`                                                                                          | every facet compared against the source                                                                                                           | yes                                  |
| E04 | **Type Strictness** · type-constrained determinism                 | whole program                                    | `100 − min(40, 4·implicitAny/KLOC) − min(20, 10·explicitAny/KLOC) − min(10, 2.5·suppressions) − 30·(public fns without return type / total)`                                                                                                          | program compiled with `noImplicitAny`                                                                                                             | yes                                  |
| E05 | **Documentation Coverage** · agent docs (llms.txt tiers) + JSDoc   | whole program                                    | `35·apiJsDoc + 15·propComments + 0.5·agentDocs`; agentDocs = 25 each for `llms.txt`, `llms-components.txt` (prorated by pattern coverage), `llms-tokens.txt`, `llms-patterns.txt`                                                                     | JSDoc counts only with a description and an `@param` per parameter                                                                                | yes                                  |
| E06 | **Public API Shape Consistency** · snippet predictability          | TS pattern                                       | `100 · (0.4·canonical/7 + 0.3·envelope + 0.2·camelCase params + 0.1·no inline error codes)`; canonical = Create, Initialize, Dispose, ChangeProperty, RegisterCallback, Get\<Name\>ById, GetAll\<Name\>                                               | envelope = `CreateApiResponse` on every non-lifecycle function                                                                                    | yes                                  |
| E07 | **Markup Contract Depth** · anatomy & composition                  | any component with a story (81)                  | `100 − 20·max(0, depth − 3) − 4·max(0, distinct − 6)`; measured on the deepest HTML template of the component's story; distinct = unique tag+classes signatures                                                                                       | shadcn Accordion usage: depth 3, 4 elements → 100                                                                                                 | structural                           |
| E08 | **Design Token Semantics** · semantic tokens & theming             | component SCSS partial, compiled standalone (94) | `100 · (0.55·(1 − hardcoded/themeable) + 0.30·(routed via --osui-*/themeable) + 0.15·clamp(1 − !important/(2 % of themeable)))`                                                                                                                       | hardcoded = raw colour or non-zero px/rem/em with no `var()`/token                                                                                | yes (literals), structural (routing) |
| E09 | **CSS Selector Complexity** · predictable cascade                  | component SCSS partial, compiled (99)            | `100 · (0.6·clamp(1 − max(0, mean combinators − 1)/3) + 0.4·clamp(1 − max(0, p90 class-specificity − 2)/4))`                                                                                                                                          | ≤ 1 combinator and ≤ 2 classes per selector → 100                                                                                                 | structural                           |
| E10 | **Composition Model & Standards Alignment** · pre-training density | TS pattern                                       | `100 − 12·max(0, inheritance depth − 1) − 5·max(0, contract files − 4) − 15·(configs only as JSON string) − 10·(event names typed string) − 15·(global namespaces instead of ES modules)`                                                             | one concrete class, ≤ 4 files, typed configs and events, ES modules → 100                                                                         | partly                               |

**Calibration evidence (E01).** shadcn/ui `apps/v4/registry/new-york-v4/ui/*.tsx`, o200k_base:
progress 173 · tooltip 439 · accordion 452 · card 531 · button 636 · tabs 912 · dialog 1,045 ·
carousel 1,429 · dropdown-menu 2,070 · sidebar 5,564.

**Two research criteria are not statically measurable in-repo** and are handled in §6 instead:
closed-loop sandbox feedback (Reflexion) and streaming/generative UI.

**Repeatability.**

```bash
npm run evals -- --label <name>          # full run, appends to results/history.json
npm run evals -- --compare baseline loop-3
npm run evals:test                       # 46 unit tests for the suite itself
```

---

## 3. Eval Progression & Tracking Matrix

The live matrix for both indices is `evals/results/HISTORY.md`, regenerated by every full run.
From `loop-6` the runs also carry the **Enterprise Readiness Index** (R01–R06, see ADR-0012 and the
enterprise-readiness proposal): baseline 50.7 at `loop-6`, 65.7 at `loop-7` after the first loop iteration
(theme-level guards and native activation recognised by the metrics; density knobs and the Search role
added, S-13). The AI-friendliness matrix through loop-4 follows.

| ID        | baseline<br>`568ddb574` | loop-1<br>`3988bb953` | loop-2<br>`729fe256d` | loop-3<br>`1c54735f0` | loop-4<br>`69815c54d` |   Total Δ | What moved it                                                                             |
| --------- | ----------------------: | --------------------: | --------------------: | --------------------: | --------------------: | --------: | ----------------------------------------------------------------------------------------- |
| E01       |                    64.9 |                 100.0 |                 100.0 |                  99.9 |                  99.9 |     +35.0 | complete manifest cards (mean 2,656 → 438 tokens)                                         |
| E02       |                    94.6 |                  94.6 |                  94.6 |                  94.6 |                  94.7 |      +0.1 | `Orientation` alias fixed; stringly-typed enums need a behavior-affecting change (§5 B-9) |
| E03       |                     0.0 |                 100.0 |                 100.0 |                 100.0 |                 100.0 |    +100.0 | `docs-ai/osui.components.json` generated from source                                      |
| E04       |                    83.2 |                  83.2 |                  99.2 |                  99.3 |                 100.0 |     +16.8 | 72 → 0 implicit-any, 4 → 0 suppressions, `noImplicitAny` enabled                          |
| E05       |                    35.8 |                  85.8 |                  85.8 |                  97.6 |                 100.0 |     +64.2 | llms.txt tiers (loop-1), 111 prop descriptions (loop-3), 24 JSDoc fixes (loop-4)          |
| E06       |                    97.7 |                  97.7 |                  97.8 |                  97.8 |                  98.7 |      +1.0 | camelCase params; `ChangeProperty` added to SwipeEvents/TouchEvents                       |
| E07       |                    75.1 |                  75.1 |                  75.1 |                  75.1 |                  75.1 |       0.0 | structural (DOM contracts)                                                                |
| E08       |                    72.3 |                  72.3 |                  72.3 |                  72.3 |                  72.3 |       0.0 | structural (knob routing); literal floor reached                                          |
| E09       |                    79.9 |                  79.9 |                  79.9 |                  79.9 |                  79.9 |       0.0 | structural (cascade)                                                                      |
| E10       |                    39.4 |                  39.4 |                  52.4 |                  52.4 |                  60.8 |     +21.4 | `Create` accepts a typed object; generated `Configs`/`EventName` types                    |
| **Index** |                **64.3** |              **82.8** |              **85.7** |              **86.9** |              **88.1** | **+23.8** |                                                                                           |

Iteration deltas: loop-1 **+18.5**, loop-2 **+2.9**, loop-3 **+1.2**, loop-4 **+1.2**. Every movable
eval is now ≥ 94.7; E06's last point and E10's remaining 39 points are the documented breaking
changes (§5.2). The loop stopped here by the protocol in the design doc; from now on the CI gate
(`npm run evals:gate`) keeps the index from regressing and `npm run docs:ai:check` keeps the
generated docs fresh.

Unmeasured pairs per run: 29 (22 CSS partials without a story for E07 — layout/menu plumbing —,
6 partials with no themeable declarations for E08, 1 empty partial for E09). They are listed with
reasons in each results file.

---

## 4. Deep-Dive Gap Analysis

### 4.1 Token & context efficiency (E01)

| Pattern                         | Source contract tokens (baseline) | Files | Card tokens (loop-3) |
| ------------------------------- | --------------------------------: | ----: | -------------------: |
| Dropdown                        |                             9,168 |    13 |                  591 |
| DatePicker                      |                             8,155 |    11 |                  620 |
| MonthPicker                     |                             5,296 |     7 |                  605 |
| RangeSlider                     |                             5,060 |     9 |                  645 |
| TimePicker                      |                             5,037 |     7 |                  605 |
| Carousel                        |                             4,788 |     6 |                  605 |
| Search / TouchEvents (smallest) |                            ~1,000 |   4–5 |              189–211 |
| **Mean / total**                |                **2,656 / 87,642** |   6.1 |              **435** |

- **Pro:** the contract is _discoverable_ — a public `*API.ts` per pattern, enums for every class
  name and property, a config class with `validateDefault` defaults. That is what made generation
  possible.
- **Con:** the contract is _distributed_: props live in a config class, allowed values in enums or
  `validateInRange` calls, defaults in a `switch`, markup only in stories, CSS knobs only in SCSS.
  Provider-backed patterns spread it over framework + provider directories (Dropdown: 13 files,
  22 with implementations). The compiled `.d.ts` is 50.7k tokens — an agent cannot load "the
  library" into context; it must load a card.
- **Bottleneck:** the `Create(id, configsJson)` call carries no type information an editor or
  model can use; the JSON string is opaque. Loop-2 made `configs` accept a typed object, which is
  the prerequisite for per-pattern config interfaces (§6).

### 4.2 Schema & metadata (E02, E03)

- **Pro:** 133 of 141 props are precisely typed; enum-typed props (`GlobalEnum.ShapeTypes`,
  `Enum.Navigation`, …) and `validateInRange` sets resolve to literal unions in the manifest
  (`TabsOrientation: 'horizontal' | 'vertical'`).
- **Con — stringly-typed enums (7):** `AccordionItem.Icon` (`string`, default `Enum.IconType.Caret`,
  validated only as non-empty), `AccordionItem.IconPosition` (`string`, default
  `GlobalEnum.Direction.Right`, never validated — any string passes), `DatePicker.TimeFormat`,
  `Notification.Position`/`Width`, `Sidebar.Width`, `Tabs.Height`. The type says "any string";
  the runtime handles two or three values. The manifest now says so explicitly
  (`hint: "default from GlobalEnum.Direction; not validated — any string is accepted"`) instead of
  fabricating an allowed-list.
- **Con — a type that resolved to `any` (fixed in loop-4):** `RangeSlider.Orientation: Orientation`
  used the alias in `Global.d.ts:132`, which pointed at `OSFramework.GlobalEnum.Orientation` — a
  namespace path that does not exist (`.OSUI` is missing). `skipLibCheck` hid the error and the
  checker typed the prop as `any`. The alias now points at the real enum (S-10).
- **Con — no schema before this branch:** TypeDoc HTML exists for humans; nothing existed for
  machines. `docs-ai/osui.components.json` (+ JSON Schema) now covers lifecycle, API signatures,
  typed props with defaults/allowed values/descriptions, events, CSS classes, `--osui-*` knobs and
  a markup skeleton for all 33 patterns; a test keeps generator and eval in agreement.

### 4.3 Type-constrained determinism (E04)

- **Pro:** zero explicit `any`, every public function declares a return type, error codes are
  constants, and the public envelope `{ code, isSuccess, message, value? }` is uniform.
- **Con (fixed):** `strict` is off; the baseline had 72 `noImplicitAny` findings (38 of them
  string-indexed access into `{}`/`JSON`-typed objects) and 4 `@ts-expect-error`. Loop-2 removed
  the suppressions and 64 findings; loop-4 annotated the last 8 and enabled `noImplicitAny: true`
  in `tsconfig.json`. Enabling it also surfaced three latent type errors that the Gulp build never
  reports (it emits despite diagnostics): an evolving-`let` in `AnimateOnDrag`, a header-item union
  in `Tabs`, and a `Position`→`FloatingPosition` assignment in `Tooltip`; all three received
  explicit annotations. `strictNullChecks` remains off and is the next step of this kind.

### 4.4 Agent documentation (E05)

- **Pro:** 322/346 API functions carry JSDoc with descriptions and `@param`s; the repository's
  rules files are already written for AI-assisted work.
- **Con (fixed):** 111/141 config props had no comment and no `llms.txt` existed; 24 API functions
  had incomplete JSDoc (mostly `@param` names that no longer matched the parameter — `ButtonLoadingId`
  vs `buttonLoadingId`, `accodrionItemId` — plus missing parameters on `Create` for Carousel,
  Dropdown and Progress). All are complete after loop-4.

### 4.5 Snippet predictability (E06)

- **Pro:** 31 of 33 APIs expose the full canonical set; 340 of 346 functions wrap
  `CreateApiResponse`; no inline error-code literals.
- **Con:** `SwipeEvents` and `TouchEvents` had no `ChangeProperty` although they have a config
  prop (`WidgetId`) — added in loop-4 — and their `Dispose`/`RegisterCallback`/`GestureMove`/
  `GestureEnd` still return `void` instead of the envelope; an agent that pattern-matches the other
  31 APIs will be wrong here. Wrapping them changes error propagation (exceptions would be caught and
  serialized), so it is documented (§5 B-3), not applied.

### 4.6 Anatomy & composition (E07) — Block/Widget cross-reference

The runtime contract every pattern shares: a root element with `name="<id>"` (resolved through
`getElementsByName`) inside a `[data-block]` ancestor whose `id` becomes the `widgetId`, then
`Create` → `Initialize`. Child patterns additionally need specific part classes.

| Service Studio Block                        | TS pattern / CSS component                  | Contract an agent must emit                                                                                                                    | Depth · distinct parts | E07 |
| ------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --: |
| Lightbox Image                              | CSS-only (`_lightbox-image.scss`)           | gallery grid + figure + overlay chrome (PhotoSwipe)                                                                                            | 8 · 22                 |   0 |
| Master Detail                               | CSS-only                                    | `.master-detail` > columns > list > items > content                                                                                            | 7 · 10                 |   4 |
| Sidebar                                     | `Sidebar`                                   | trigger + `aside.osui-sidebar` > `__header` / `__content` / footer                                                                             | 6 · 12                 |  16 |
| Bottom Bar Item                             | CSS-only                                    | nav > item > icon + label wrappers                                                                                                             | 7 · 6                  |  20 |
| Dropdown (Search/Tags)                      | `Dropdown` (VirtualSelect)                  | `.osui-dropdown` wrapper > provider root; balloon detached to `<body>`                                                                         | 6 · 10                 |  24 |
| List / List Item                            | widgets                                     | `[data-list]` > `[data-block]` items > `.list-item` > content slots                                                                            | 6 · 10                 |  24 |
| Input With Icon                             | CSS-only                                    | wrapper > input group > icon + control                                                                                                         | 5 · 14                 |  28 |
| Accordion + Item                            | `Accordion`, `AccordionItem`                | `.osui-accordion` > `[data-block]` > `.osui-accordion-item` > `__title` (+ two `__icon`, one `.placeholder-empty`) + `__content` > placeholder | 5 · 6                  |  60 |
| Tabs                                        | `Tabs`, `TabsHeaderItem`, `TabsContentItem` | `section.osui-tabs` > `header.osui-tabs__header` (+ `__indicator`) + `section.osui-tabs__content`; items are separate patterns                 | 3 · 5                  | 100 |
| Tag, User Avatar, Separator, Switch, Upload | CSS-only / widgets                          | one or two elements                                                                                                                            | 1–3 · 1–4              | 100 |

Mean depth 3.7, mean 5.6 distinct parts. For comparison, a shadcn Accordion is
`Accordion > AccordionItem > (AccordionTrigger, AccordionContent)`; the trigger renders its own
chevron. OutSystems UI asks the agent to reproduce two icon placeholders and a `placeholder-empty`
marker that the runtime then decorates — knowledge that exists only in the OML block and the
stories.

### 4.7 Semantic tokens & cascade (E08, E09)

- **Pro:** a four-tier read chain (`--osui-*` → `--color-*` role → `$token-*` → primitive) is
  documented and enforced by review; only 96 of 3,073 themeable declarations (3.1 %) are hardcoded,
  and almost all of those are deliberate local values (`-1px`/`-2px` nudges, `50px` pill radii,
  vendor `.flatpickr-day` line-heights) with no token counterpart. 596 `--osui-*` knobs exist.
- **Con — routing:** only 559 declarations (18 %) read through a component knob; 1,829 read a
  token directly. Worst: `bulk-actions`, `form`, `scrollable-area` (0 knobs), `checkbox`
  (9/29), Dropdown (16/65). An agent (or a theme) cannot override those per instance without
  fighting the rule.
- **Con — cascade:** 212 selectors have ≥ 3 combinators; p90 class specificity reaches 6–8 in
  Rating, Accordion, Form, Columns, the menu layouts. The deepest:
  `.os-high-contrast .has-accessible-features .rating.is-half input:focus + .rating-item .rating-item-half *`
  (6 combinators, specificity 0-7-1). 10 `!important`s remain (4 in Dropdown).

### 4.8 Composition model & pre-training density (E10)

| Pattern group                                                         | Inheritance chain                                                                                           | Contract files |   E10 |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------: | ----: |
| Dropdown, DatePicker, RangeSlider                                     | concrete → Abstract\<Provider\> → Abstract\<Pattern\> → AbstractProviderPattern → AbstractPattern (depth 4) |          17–22 |     0 |
| MonthPicker, TimePicker, Carousel                                     | depth 3                                                                                                     |          11–15 |  0–16 |
| Parent/child patterns (Accordion, Tabs, Wizard, SectionIndex + items) | depth 2 via AbstractParent/AbstractChild                                                                    |            4–6 | 53–63 |
| Simple patterns (Tooltip, Rating, Sidebar, …)                         | depth 1                                                                                                     |            4–6 | 65–75 |

All 33 APIs are global AMD namespaces (`OutSystems.OSUI.Patterns.*`), all 33 `RegisterCallback`
functions type the event name as `string`, and (before loop-2) all 33 `Create` functions accepted
only a JSON string. None of this vocabulary appears in public training data; it is the opposite of
the "billions of tokens of React/HTML/Tailwind" the research credits for high pass@1.

### 4.9 Context/token bottlenecks — summary

1. Contract spread over 4–22 files per pattern (fixed for reading by the manifest; still true for editing).
2. Markup contracts only in stories/OML (skeletons now in cards; the DOM shape itself is unchanged).
3. JSON-string configs and string event names (configs fixed additively; events pending).
4. Proprietary global-namespace composition model (needs the §6 architecture).
5. `.d.ts` of 50.7k tokens as the only typed surface (a per-pattern typed facade is the fix).

---

## 5. Safe Local Changes vs. Documented Breaking Changes

### 5.1 Applied on the branch (behavior-preserving; `npm run build` green for O11 and ODC, lint 0/0, `npm test` 57/57)

| #    | Commit                    | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Evidence it is non-breaking                                                                                                                                                   |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S-1  | `729fe256d`               | `scripts/generate-ai-docs.mjs` → `docs-ai/` (manifest + JSON Schema, `llms.txt`, `llms-components.txt`, `llms-tokens.txt`, `llms-utilities.txt`, `llms-patterns.txt`); `npm run docs:ai`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | files only; nothing under `src/`                                                                                                                                              |
| S-2  | `1c54735f0`               | `Helper.ParseConfigs` — `Create(id, configs: string \| Record<string, unknown>)` in 33 APIs and 9 factories                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | string path is byte-for-byte `JSON.parse`; unit-tested; objects were rejected before, accepted now (additive)                                                                 |
| S-3  | `1c54735f0`               | 4 `@ts-expect-error` replaced by typed casts / a `window.monthSelectPlugin` declaration / the true return type of `SetDeviceBreakpoints`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | emitted JS identical (casts and types are erased)                                                                                                                             |
| S-4  | `1c54735f0`               | 65 implicit-any annotations (`AbstractParent` child maps, config indexing, l10n dictionaries, `GradientColor[]`, listener/window indexing, provider callbacks)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | type-only                                                                                                                                                                     |
| S-5  | `1c54735f0`               | camelCase parameters: `GetAccordionById(accordionId)`, `ToggleNativeBehavior(isNative)`, `SetEditableInput(isEditable)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | JavaScript callers pass positionally                                                                                                                                          |
| S-6  | `6e5b0649a`               | 111 config props documented with a verified `//` line                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `removeComments: true` — comments never reach the bundle                                                                                                                      |
| S-7  | `091ca001c`…`3988bb953`   | the eval suite, its tests, `npm run evals`, `gpt-tokenizer` devDependency                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | tooling only; `.mjs` is outside `tsconfig include` and `eslint --ext .ts`                                                                                                     |
| S-8  | `69815c54d`               | CI gate (`evals:gate`, index drop > 1 fails), docs freshness (`docs:ai:check`), `.github/workflows/ai-friendliness.yaml` (PRs into `dev` + manual run on any branch), `postdocs` publishes `docs-ai/` at the documentation-site root                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | tooling only                                                                                                                                                                  |
| S-9  | loop-4                    | generated `PatternTypes.ts`: per pattern `Configs` (typed optional props with descriptions) and `EventName` (event union + `string` escape hatch); `Create(id, configs: string \| Configs)`, `RegisterCallback(id, eventName: EventName, cb)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | types are erased; relative to `dev` the object form is new, so nothing that compiled before stops compiling; `npm run types:generate`, freshness asserted by a test           |
| S-10 | loop-4                    | `Orientation` alias in `Global.d.ts` points at `OSFramework.OSUI.GlobalEnum`; last 8 implicit-any sites annotated; `noImplicitAny: true` in `tsconfig.json`; factory `NewFloatingPosition` declares its real return type and is called without `new`                                                                                                                                                                                                                                                                                                                                                                                                                                                            | type-only; calling a factory that returns an object with or without `new` yields the same object                                                                              |
| S-11 | loop-4                    | 24 API JSDoc blocks completed (param names, missing params, descriptions); `ChangeProperty` added to SwipeEvents and TouchEvents with new error codes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | docs and an additive function; existing functions untouched                                                                                                                   |
| S-16 | tooling, no loop          | the loop itself, made scalable (ADR-0013): a suite registry (`evals/suites.mjs`) and self-describing metrics, so an eval or a suite is one module or one entry; a component registry (`evals/components.json`) with a doctor that flags unclassified components and derives their entry from code; not-applicable rows distinct from unmeasured; gate rules per eval (3-point tolerance), no-decrease and measurement coverage; the dashboard page template versioned. Shared code moved from `evals/ai-friendliness/` to `evals/`; `npm test` now runs the enterprise tests. Loops record pattern code only: a run whose `src/`, `stories/` and `docs-ai/` equal the newest recorded run adds no history entry | tooling and docs only; both indices unchanged (88.2 / 67.9) and every measured dashboard cell identical to loop-10; not a loop                                                |
| S-15 | loop-10                   | host-styled scope for E07 (`lib/host-styled.json`, 18 CSS-only components whose markup is emitted by the app template blocks, the Login common screen, the runtime or other patterns: not applicable rather than "no story"); `llms-patterns.txt` marks them host-styled with "do not generate this markup" and their knobs; stories for bulk-actions (Table widget DOM with the Checkbox selection column) and provider-login-button                                                                                                                                                                                                                                                                           | eval scope and docs; stories are new files                                                                                                                                    |
| S-14 | loop-8 / loop-9           | knobs with defaults equal to the previous values on bulk-actions, ButtonLoading and scrollable-area (`--osui-bulk-actions-*`, `--osui-btn-loading-*`, `--osui-scrollable-area-*`); story aliases for `btn` and `radio-button` to their widget stories; a `llms.txt` line telling agents to load a card, never the compiled typings. The 20 generated static-markup stories of loop-8 were rolled back in loop-9: those components are CSS classes on platform-owned markup and need a considered representation first (plan Task 19)                                                                                                                                                                            | the knobs resolve to the same values; aliases and docs only                                                                                                                   |
| S-13 | loop-7                    | density knobs with defaults equal to the previous fixed values (`--osui-list-item-padding-*`, `--osui-accordion-item-title-padding-*`, `--osui-card-detail-gap`, `--osui-card-sectioned-padding`, `--osui-dropdown-item-padding-*`, `--osui-form-field-spacing`); `role="search"` on the Search pattern                                                                                                                                                                                                                                                                                                                                                                                                         | compiled CSS resolves to the same values (a knob default is the old literal), so rendering is identical until a theme sets a knob; the role is an attribute with no behaviour |
| S-12 | static-analysis follow-up | `Menu.ts` menu-icon key handler reads `e.key === ' ' \|\| e.key === 'Enter'` instead of the deprecated `keyCode` 32/13 (the only `keyCode` use in the runtime); tooling reads gulp specs as text instead of `require`, loads the test namespace through a temp ES module, and guards the git-metadata path                                                                                                                                                                                                                                                                                                                                                                                                      | same keys in every supported browser; the rest is tooling                                                                                                                     |

**S-2 — BEFORE / AFTER**

```ts
// BEFORE (AccordionAPI.ts)
export function Create(accordionId: string, configs: string): IAccordion {
	const _newAccordion = new Accordion(accordionId, JSON.parse(configs));

// AFTER
export function Create(accordionId: string, configs: string | Record<string, unknown>): IAccordion {
	const _newAccordion = new Accordion(accordionId, OSFramework.OSUI.Helper.ParseConfigs(configs));

// an agent (or a TS app) can now write
OutSystems.OSUI.Patterns.AccordionAPI.Create(id, { MultipleItems: true, ExtendedClass: '' });
```

**S-3 — BEFORE / AFTER**

```ts
// BEFORE (AbstractProviderPattern.ts)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
this._provider.destroy();

// AFTER
(this._provider as unknown as { destroy: () => void }).destroy();
```

**S-4 — BEFORE / AFTER**

```ts
// BEFORE (AbstractParent.ts) — 11 implicit-any index accesses
private _childItemsByType = {};

// AFTER
private _childItemsByType: Record<string, Map<string, CT>> = {};
```

**S-6 — BEFORE / AFTER**

```ts
// BEFORE (TabsConfig.ts)
public StartingTab: number;

// AFTER
// Zero-based index of the tab active when built; cannot be changed afterwards.
public StartingTab: number;
```

### 5.2 Documented, not applied (would change runtime behavior or a public contract)

| #    | Change                                                                                                                                                      | Behavioral impact                                                                                                                                                                | Evals affected           |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| B-1  | ~~Per-pattern typed config interfaces~~ — **applied as S-9** (`string \| Configs`, additive relative to `dev`)                                              | —                                                                                                                                                                                | —                        |
| B-2  | ~~Typed event names~~ — **applied as S-9** (`EventName` union with a `string` escape hatch, so unknown names keep working)                                  | —                                                                                                                                                                                | —                        |
| B-3  | `SwipeEvents`/`TouchEvents`: wrap `Dispose`/`RegisterCallback`/`GestureMove`/`GestureEnd` in `CreateApiResponse` (`ChangeProperty` was added in S-11)       | exceptions currently propagate to the caller; the envelope would catch and serialize them; return type `void` → `string`                                                         | E06 → 100                |
| B-4  | ES-module facade / npm package with named exports (`import { Accordion } from '@outsystems/ui'`)                                                            | distribution model change: bundle no longer a single AMD file; requires a compatibility shim for `OutSystems.OSUI.*`                                                             | E10 +15/pattern          |
| B-5  | Declarative auto-instantiation from data attributes (`<details data-osui="accordion-item">`) replacing the `name`/`id`/`[data-block]` + part-class contract | DOM contract change for every block; runtime would synthesize the current structure                                                                                              | E07, E10                 |
| B-6  | Flatten deep selectors into state classes on the element they style                                                                                         | cascade order changes; every override written against the current specificity breaks                                                                                             | E09                      |
| B-7  | Route the 1,829 direct token reads through `--osui-*` knobs (`form`, `checkbox`, `bulk-actions`, `scrollable-area`, Dropdown first)                         | additive when the default equals the current value, **except** for portaled elements (balloons, bottom sheets) where an inherited knob is undefined — needs per-component review | E08 routed 18 % → ≥ 60 % |
| B-8  | Remove the 10 `!important`s                                                                                                                                 | cascade change                                                                                                                                                                   | E08                      |
| B-9  | Turn stringly-typed enums into validated enum types (`AccordionItem.Icon: Enum.IconType` with `validateInRange`)                                            | invalid values that today reach the DOM as a class name would fall back to the default                                                                                           | E02 → ~99                |
| B-10 | ~~Fix the `Orientation` alias~~ — **applied as S-10**; the feared enum-vs-literal cascade did not materialize (`tsc --noEmit` clean)                        | —                                                                                                                                                                                | —                        |

**B-3 — BEFORE / AFTER (illustrative)**

```ts
// BEFORE (SwipeEventsAPI.ts) — no envelope, exceptions escape
export function Dispose(swipeEventsId: string): void {
	const swipeEvents = GetSwipeEventsById(swipeEventsId);
	swipeEvents.dispose();
	_swipeEventsMap.delete(swipeEventsId);
}

// AFTER — same shape as the other 31 APIs; errors become data with a stable code
export function Dispose(swipeEventsId: string): string {
	return OutSystems.OSUI.Utils.CreateApiResponse({
		errorCode: ErrorCodes.SwipeEvents.FailDispose,
		callback: () => {
			const swipeEvents = GetSwipeEventsById(swipeEventsId);
			swipeEvents.dispose();
			_swipeEventsMap.delete(swipeEventsId);
		},
	});
}
```

**B-5 — BEFORE / AFTER (illustrative)**

```html
<!-- BEFORE: what an agent must emit today for one accordion item -->
<div id="item-1" data-block="osui">
	<div name="item-1" class="osui-accordion-item">
		<div class="osui-accordion-item__title" id="item-1-title">
			<div class="osui-accordion-item__icon"></div>
			<div class="osui-accordion-item__icon placeholder-empty"></div>
			<span>Is it accessible?</span>
		</div>
		<div class="osui-accordion-item__content"><div id="item-1-content">Yes.</div></div>
	</div>
</div>
<script>
	OutSystems.OSUI.Patterns.AccordionItemAPI.Create('item-1', {
		Icon: 'Caret',
		IconPosition: 'right',
		IsDisabled: false,
		StartsExpanded: false,
		ToggleWithIcon: false,
		ExtendedClass: '',
	});
	OutSystems.OSUI.Patterns.AccordionItemAPI.Initialize('item-1');
</script>

<!-- AFTER: depth 2, web-standard elements, runtime synthesizes the chrome -->
<details data-osui="accordion-item" open>
	<summary>Is it accessible?</summary>
	<div>Yes.</div>
</details>
```

**B-6 — BEFORE / AFTER (illustrative)**

```scss
// BEFORE (rating) — 6 combinators, specificity 0-7-1
.os-high-contrast .has-accessible-features .rating.is-half input:focus + .rating-item .rating-item-half * { … }

// AFTER — state on the part, one class, JS toggles `is-focused`
.rating-item-half.is-focused { … }
```

**B-7 — BEFORE / AFTER (illustrative)**

```scss
// BEFORE (_form.scss) — reads the token directly; no per-instance override
.form .form-group {
	padding-block: variables.$token-scale-400;
}

// AFTER — knob with the identical default, then the read
.form {
	--osui-form-group-padding-block: #{variables.$token-scale-400};
	.form-group {
		padding-block: var(--osui-form-group-padding-block);
	}
}
```

---

## 6. Prioritized Action Plan & Next-Gen AI-First OutSystems UI Specification

### 6.1 Action plan for the current framework

| Priority | Action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Eval target              | Effort |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------ |
| P0 ✅    | CI gate and docs freshness: `.github/workflows/ai-friendliness.yaml` runs `evals:gate` (fail on index drop > 1) and `docs:ai:check` on PRs into `dev` and on demand for any branch (S-8)                                                                                                                                                                                                                                                                                                          | keeps 88.1               | done   |
| P0 ◐     | Publish `docs-ai/`: `postdocs` copies it into the TypeDoc output, so the documentation deployment serves `/llms.txt`, `/llms-components.txt`, `/llms-tokens.txt`, `/llms-utilities.txt`, `/llms-patterns.txt`, `/osui.components.json` (S-8). **Still external:** the OutSystems UI website is an OutSystems application; serving the same files at its root needs a static-resource change in that app, and the MCP server (`list_components`, `get_component`, `search_css_api`) is not started | research criteria 5, 6   | S–M    |
| P0 ✅    | Typed `Configs` and `EventName` generated from the source (S-9)                                                                                                                                                                                                                                                                                                                                                                                                                                   | E10 52.4 → 60.8, E02     | done   |
| P0 ✅    | `noImplicitAny` finished and enabled; `Orientation` alias fixed (S-10)                                                                                                                                                                                                                                                                                                                                                                                                                            | E04 → 100                | done   |
| P1 ◐     | 24 API JSDoc gaps completed; `ChangeProperty` added to `SwipeEvents`/`TouchEvents` (S-11). **Open:** the envelope on their existing functions (B-3) changes error propagation and stays documented                                                                                                                                                                                                                                                                                                | E05 → 100 ✅, E06 → 98.7 | S      |
| P1       | Knob routing program, one component per PR, starting with `form`, `checkbox`, `bulk-actions`, `scrollable-area`, Dropdown (B-7); add the routed ratio to the CSS-API Storybook page                                                                                                                                                                                                                                                                                                               | E08 → ≥ 85               | M–L    |
| P1       | Cascade flattening for Rating, Accordion, AnimatedLabel, Form, Columns, menu layouts (B-6); remove the 10 `!important`s (B-8)                                                                                                                                                                                                                                                                                                                                                                     | E09 → ≥ 90               | M      |
| P1       | Validated enum types for the 7 stringly-typed props (B-9), released as a minor with the fallback documented                                                                                                                                                                                                                                                                                                                                                                                       | E02 → ~99                | S      |
| P2       | Declarative auto-instantiation (`data-osui`) as an opt-in layer over the current `Create/Initialize` (B-5)                                                                                                                                                                                                                                                                                                                                                                                        | E07, E10                 | L      |
| P2       | ES-module facade package with a compatibility shim (B-4)                                                                                                                                                                                                                                                                                                                                                                                                                                          | E10 → ≥ 85               | L      |

### 6.2 Next-generation architecture specification

**Design principles** (each maps to a research criterion and an eval):
open code over encapsulation (E10) · one flat file per component (E01, E07) · typed and
schema'd contracts as the source of truth (E02, E03, E04) · named slots (E07) · semantic tokens
with per-instance knobs (E08) · single-class cascade (E09) · tiered machine-readable docs and MCP
(E05) · a fast validation loop the agent can call (Reflexion) · streaming-friendly rendering.

**Layered architecture**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 5. Agent surfaces      llms.txt tiers · MCP server · osui.components.json     │
│                        validate(markup|tsx) · preview(component, props)       │
├──────────────────────────────────────────────────────────────────────────────┤
│ 4. Schema layer        one JSON Schema per component  ⇄  TS types  ⇄  OML     │
│                        block metadata (props, slots, events, tokens)          │
├──────────────────────────────────────────────────────────────────────────────┤
│ 3. Styled components   flat ES modules, ≤ 600 tokens each, named slots,       │
│                        --osui-* knobs → --color-* roles → $token-*            │
├──────────────────────────────────────────────────────────────────────────────┤
│ 2. Headless behaviors  disclosure · floating/anchor · focus trap · roving     │
│                        tabindex · gesture · list/selection (ES modules)       │
├──────────────────────────────────────────────────────────────────────────────┤
│ 1. Design tokens       outsystems-design-tokens (unchanged)                   │
└──────────────────────────────────────────────────────────────────────────────┘
        ↓ TS Model Framework compiles component usage into OML blocks/widgets
```

**Schema design.** One file per component, generated into TypeScript types, a JSON Schema and
OML block metadata. The shape below is the one `docs-ai/osui.components.json` already emits, made
first-class:

```jsonc
{
	"name": "AccordionItem",
	"props": {
		"icon": { "type": "enum", "values": ["caret", "plus-minus", "custom"], "default": "caret" },
		"iconPosition": { "type": "enum", "values": ["start", "end"], "default": "end" },
		"disabled": { "type": "boolean", "default": false },
		"open": { "type": "boolean", "default": false, "mutable": true },
	},
	"slots": { "summary": { "required": true }, "content": { "required": true }, "icon": {} },
	"events": { "toggle": { "detail": { "open": "boolean" } } },
	"cssApi": ["--osui-accordion-item-padding", "--osui-accordion-item-border-color"],
	"a11y": { "role": "button", "pattern": "WAI-ARIA disclosure" },
}
```

```ts
// what the schema generates — and what the agent writes
import { Accordion, AccordionItem } from '@outsystems/ui';

<Accordion multiple>
  <AccordionItem open onToggle={(e) => save(e.detail.open)}>
    <AccordionItem.Summary>Is it accessible?</AccordionItem.Summary>
    <AccordionItem.Content>Yes.</AccordionItem.Content>
  </AccordionItem>
</Accordion>
```

**Token strategy (context budget).**

| Tier             | Content                                                | Budget                                                                                 |
| ---------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `llms.txt`       | index, gotchas, read-next                              | ≤ 1,500 tokens (today 1,196)                                                           |
| component card   | props, events, slots, knobs, skeleton                  | ≤ 400 tokens (today mean 435, max 645)                                                 |
| component source | one flat file                                          | ≤ 900 tokens (shadcn median)                                                           |
| theming surface  | roles + knobs, one theme                               | ≤ 4,500 tokens (today 4,853 with the alias notes; drops below once the aliases retire) |
| utilities        | 554 classes by family with the token family each reads | ≤ 3,500 tokens (today 2,610)                                                           |
| recipes          | 10–15 composition recipes                              | ≤ 300 tokens each                                                                      |

**Single theme by design.** The next-generation framework ships exactly one theme: the design
tokens, their generated dark mode, and per-component knobs. There is no classic vocabulary to
back-port to, so the `--color-neutral-*` / `--space-*` / `--border-radius-{none,soft,rounded}`
aliases retire together with the three runtime readers that keep them alive today
(`GetColorValueFromColorType`, `GetBorderRadiusValueFromShapeType`, Gallery `ItemsGap`), which move
onto tokens directly. Utility classes stay token-generated, so their list is always derivable and
never hand-maintained.

Progressive disclosure: the agent reads the index, then only the cards it needs, then source only
when it must customize. MCP `get_component` returns the card; `get_source` the file.

**Agent developer experience.**

- Instantiate with a typed object or JSX; no `id`/`name`/`[data-block]` boilerplate — the runtime
  derives identity (auto-instantiation is the migration bridge, B-5).
- Events as `CustomEvent`s with typed `detail`; results as typed objects, not JSON strings.
- Slots as named children; misplaced children are a type error, not a rendering bug.
- Styling via knobs on the element (`style="--osui-card-padding: …"` or `class`), never via rules.
- A local validator (`osui validate <file>`) that runs the same schema and eval rules and returns
  diagnostics the agent can act on — the Reflexion loop the research credits with raising pass rates
  from ~50 % to ~95 %.
- Storybook stays the executable specification; every card links to its story and the story's
  skeleton is the card's markup.

**Migration.** `OutSystems.OSUI.*` remains as a compatibility layer generated from the same
schemas; new components are authored once in layer 3 and projected to both surfaces. The eval
suite is the ratchet: each migrated component must not lower any score, and the index target for
the next-gen surface is ≥ 95 with E07, E09 and E10 at ≥ 90.

---

### Appendix — how to reproduce

```bash
git checkout agents/osui-validate-evals
npm install && npm run build:tokens
npm test                                  # 57 tests
npm run evals -- --label verify           # ~25 s, writes evals/results/verify.json
npm run evals -- --compare baseline verify
npm run docs:ai && git status --short     # docs-ai/ must be unchanged
```
