# Enterprise-readiness evals — proposal

Status: implemented on the branch as `evals/enterprise/` (R01–R06), baseline run `loop-6`; ADR-0012 records the
decisions. Sections 5 and 6 below keep the pre-implementation estimates and plan for the record; the measured
baseline is in `results/HISTORY.md`. Source: "UI Enterprise apps requirements" (OutSystems, 2025-07-30),
read against this repository at `261bc01aa`. Scope: the token-based theme only (`src/scss`, `classic-theme/`
excluded, as everywhere in this suite) and the whole inventory: 33 TypeScript patterns and 69 CSS-only components.

## 1. What the document asks for, and what this repository can answer

The document defines five layers (components, behaviours, styling, content, flows), four adoption scenarios
and a feature-by-feature comparison against Mobile UI and shadcn/ui. Three things decide what can become an
eval here:

1. **Where the capability lives.** Table, Data Grid, Charts, Maps and the platform form widgets are not in
   this repository. An eval must score them as *delegated* (to the platform widget, Data Grid, Charts, Maps)
   rather than as missing, otherwise the score measures repository boundaries, not the product.
2. **What is statically observable.** The current suite is offline and deterministic. Requirements about
   presence (a pattern exists, a story exists, a state class exists, an ARIA attribute is set, a breakpoint
   class is handled) are measurable from source. Requirements about *quality of behaviour* (does the
   keyboard trap actually work, does the contrast pass) need a running browser and belong to a second,
   dynamic phase.
3. **Whether it can move without a breaking change.** The suite already separates *movable* from
   *structural*. Enterprise requirements add a third class, **roadmap**: a missing component or feature
   that is neither a refactor nor a breaking change but new work (typeahead, skeleton loader, mega menu,
   density variants).

Probe results that ground the proposal (files matching, token theme only):

| Signal | Where | Count |
| --- | --- | ---: |
| Patterns whose TypeScript sets ARIA (helper or literal) | pattern + provider dirs | 28 / 33 |
| Patterns handling keyboard events | idem | 15 / 33 |
| Patterns managing focus (`focus()`, `tabindex`, focus trap) | idem | 17 / 33 |
| SCSS files with `.has-accessible-features` rules | `src/scss` | 35 rules in 25 files |
| SCSS files with `.os-high-contrast` rules | idem | 26 files |
| SCSS files with `.is-rtl` rules | idem | 25 files |
| SCSS files with `.os-dark` rules (token theme has `_theme-dark.scss`) | idem | 6 files |
| SCSS files guarding motion with `prefers-reduced-motion` | idem | 3 files (of 50 that animate) |
| SCSS files with breakpoint classes (`.phone`, `.tablet`, `.desktop`) | idem | 51 files |
| SCSS files with loading / skeleton / spinner rules | idem | 7 files |
| SCSS files with validation state rules (`not-valid`, feedback message) | idem | 15 files |
| Token families in the theme | `src/scss/tokens` | bg, text, icon, border, shadow, elevation, font, shape, space, scale, transition, z, state, primitives, semantics |

Every proposed eval below is built only from signals of this kind, so it runs inside `npm run evals` with
no new dependencies.

## 2. Requirement → eval map

| Document section | Requirement | Measurable here as | Eval |
| --- | --- | --- | --- |
| §2.1 components, §5 list | Component present (typeahead, skeleton, mega menu, rich text, uploader, breadcrumbs, KPI card, timeline, kanban…) | inventory + a curated requirements map with evidence rules; delegated items named | R01 |
| §2.1 Table / Data Table features | fixed header, filtering, sorting, bulk actions, row actions, density, zebra | *delegated* to the platform Table / Data Grid; only `bulk-actions`, `pagination`, `table` styles are here | R01 (delegated rows) |
| §2.1 accessibility compliance, §3 "WCAG 2.1 is a must-have" | ARIA roles/states, live regions, focus management, accessible-features styles, high contrast | static proxies per pattern; phase 2: axe over Storybook | R02 |
| §1 keyboard navigation | Enter/Space/Escape/Arrow handling, focus trap in overlays, roving tabindex | static per interactive pattern | R03 |
| §2.3 theme foundations (8 rows) | iconography, colours, typography, shape, spacing, elevation, grid, responsive | token families present **and consumed** per component; dark, high-contrast, RTL coverage | R04 |
| §2.1 density, §2.3 responsive layout | compact/standard/relaxed, breakpoints, RTL | size/density knobs and breakpoint rules per component | R05 |
| §2.2 behaviours | loading skeletons, progress, validation, press/hover/focus/disabled states, transitions, reduced motion, dismiss | state classes and motion guards per component | R06 |
| §2.5 flows | login, CRUD, search & filter, admin, settings, notifications, approvals, reporting, import/export | derived: a flow is "kit-complete" when every UI element it lists resolves to an R01 row that is offered or delegated | R01 flow view (report only) |
| §2.4 content | placeholder content | out of scope: authoring, not framework | — |
| §3 scenarios "branding is relevant" | brand tokens applied to all components | already E08 (token semantics) + R04 consumption | E08, R04 |
| §4/§5 comparison with shadcn | parity table | R01 emits the same table shape as the document, from evidence | R01 |

## 3. Proposed evals

All ten current evals are *AI-friendliness*. The six below answer a different question, *enterprise
readiness*, so they form a **second index** (Enterprise Readiness Index, ERI) rather than being folded into
the AI-Friendliness Index. Mixing them would let a new component offset a documentation regression and
vice versa. Each eval: unit, formula, band, class.

### R01 · Enterprise Component Coverage — *roadmap*

- **Input:** `evals/enterprise/requirements.json`, a curated list transcribed from §2.1 and §5 of the
  document: `{ id, group, requirement, owner: 'osui' | 'platform' | 'datagrid' | 'charts' | 'maps' | 'mobile-ui',
  evidence: [{ kind: 'pattern' | 'css' | 'story' | 'scss-rule' | 'ts-symbol', match }], status: auto | 'partial' | 'missing' }`.
  `auto` means the evidence rules decide (offered when every rule matches, partial when some do); `partial`
  and `missing` are hand-set for requirements the rules cannot see (e.g. "saved views"), with the reason.
- **Per requirement:** offered = 1, partial = 0.5, missing = 0, delegated = excluded from the OSUI score but
  reported in a second column so the parity table matches the document.
- **Score:** 100 · mean over `owner: 'osui'` requirements, weighted by group (components 50 %, forms and
  inputs 20 %, navigation 20 %, data visualisation inside OSUI 10 %).
- **What moves it:** new patterns or features (typeahead, skeleton, mega menu, global search, rich text,
  advanced uploader, density variants). None is a refactor, hence *roadmap*.
- **Report extra:** the flows table from §2.5, one row per flow, "kit-complete" yes/partial and the missing
  elements.

### R02 · Accessibility Contract — *movable*

- **Per pattern (TypeScript + its SCSS):** five checks, each 0/1:
  1. sets ARIA roles or states (`Helper.A11Y.*` or literal `aria-*` / `role=`) — 28/33 today;
  2. announces changes where it gives feedback (`aria-live`, `role="alert|status"`) — required only for
     Notification, ButtonLoading, Progress, Search, Wizard, validation messages; others pass by default;
  3. manages focus on open/close (`focus()`, focus trap) — required for overlays: BottomSheet, Sidebar,
     Notification, Dropdown, OverflowMenu, Tooltip, Submenu, Gallery lightbox;
  4. has `.has-accessible-features` rules (visible focus / affordances) in its SCSS;
  5. has `.os-high-contrast` rules in its SCSS.
- **Per CSS-only component:** checks 4 and 5 only.
- **Score:** 100 · mean of applicable checks, mean over components. Formula is a *proxy*: it detects the
  contract being addressed, not WCAG conformance.
- **What moves it:** adding ARIA/focus code and styles — behaviour-preserving for existing users, so
  movable. Expect ~70–75 at baseline from the probes.
- **Phase 2 (dynamic, separate workflow):** `@storybook/test-runner` with `axe-playwright` over the existing
  stories; violations per story become the per-component detail. Not part of `npm run evals`, runs in the
  Chromatic workflow where Storybook is already built.

### R03 · Keyboard Operability — *movable*

- **Applies to** interactive patterns (all except InlineSvg, Video, SwipeEvents, TouchEvents, Progress,
  AnimatedLabel, SectionIndex): 26.
- **Per pattern:** handles `keydown`/`keyup` with the keys its role needs (Enter/Space for activation,
  Escape for dismiss on overlays, Arrows for composite widgets: Tabs, Carousel, RangeSlider, Rating,
  DatePicker/MonthPicker/TimePicker via provider), and sets `tabindex` where the element is not natively
  focusable.
- **Score:** 100 · handled keys / required keys, mean over patterns. Today 15/33 patterns handle any key.
- **What moves it:** key handlers are additive. Provider-backed pickers get credit through the provider
  (flatpickr, noUiSlider, VirtualSelect) when the wrapper does not remove the handlers; that is recorded as
  "delegated to provider" in the detail.

### R04 · Theme Foundations (token theme) — *movable*

- **Part A, foundations present (40 %):** one point per document row when the token theme defines the
  family and at least one component consumes it: iconography (icon library + `--token-icon`), colours
  (`--token-bg/text/border/semantics`), typography (`--token-font`), shape (`--token-shape`), spacing
  (`--token-space`), elevation (`--token-shadow/elevation`), grid and alignment (`columns`, `layout`,
  `--token-scale`), responsive (breakpoint classes). All eight are present today, so Part A starts at 100;
  it guards regressions.
- **Part B, consumption per component (60 %):** for each component SCSS, the share of the eight families
  it reads through tokens or knobs (only families it declares at all count), plus three variant checks:
  dark theme rules present when the component sets colours (6/94 files today), RTL rules present when the
  component uses directional properties (25 files), reduced-motion guard present when it animates (3/50).
- **What moves it:** adding `.os-dark`, `.is-rtl` and `prefers-reduced-motion` rules and replacing literal
  reads; all additive.

### R05 · Responsiveness and Density — *movable / structural*

- **Per component SCSS:** breakpoint rules when the component has layout (`.phone/.tablet/.desktop`,
  `.landscape/.portrait` or `@media`); a size or density axis (`is-small/is-large/is-compact`, or
  `--osui-<c>-padding/height/size` knobs) for list-like and form-like components (table, list, list-item,
  form, inputs, dropdown, tabs, card, pagination, bulk-actions); RTL handled (shared with R04, counted once).
- **Score:** 100 · mean of applicable checks. The density axis is largely absent today (no compact/relaxed
  concept exists), which the document names explicitly; adding knobs with defaults equal to today's values
  is movable, adding variant classes that change defaults is structural.

### R06 · Feedback and State Behaviours — *movable*

- **Per component SCSS (+ TS where the state is scripted):** the states the document lists, each 0/1 when
  applicable: hover, focus-visible, active/press, disabled, loading (`is-loading`, skeleton, spinner,
  progress), invalid/validation (`not-valid`, feedback message), dismiss/transition with a reduced-motion
  guard, expansion/collapse animated where the pattern toggles (Accordion, Sidebar, Submenu, BottomSheet,
  Dropdown).
- **Score:** 100 · mean of applicable checks.
- **What moves it:** state styles and guards are additive; a skeleton-loading component is R01 roadmap.

### Not proposed as evals

- **Table and Data Grid features, Charts, Maps:** owned by other products; R01 reports them as delegated so
  the parity table is complete, but nothing here can move them.
- **Performance ("thousands of rows without lag"), real-time updates, saved views:** runtime and data-layer
  properties; not observable in this repository.
- **Content (§2.4):** authoring concern.

## 4. Scoring model and how it lands in the existing checks

| Piece | Today | With the enterprise suite |
| --- | --- | --- |
| Suites | `evals/ai-friendliness` (E01–E10) | plus `evals/enterprise` (R01–R06) sharing `lib/` (context, inventory, scss, ts, paths, results) |
| Run | `npm run evals --label x` | `npm run evals` runs both; `--suite ai|enterprise` selects one; one results file per run keeps both suites: `{ suites: { ai: {...}, enterprise: {...} } }` (existing files stay valid: a missing `suites` key means `ai` only) |
| Indices | AI-Friendliness Index = mean(E01–E10) | plus Enterprise Readiness Index = mean(R01–R06); never merged |
| history.json | `{ label, date, sha, scores, index }` | plus `enterprise: { scores, index }` per entry; old entries have none and render as "—" |
| Gate | index drop > 1 fails | same rule per index (`--max-drop` applies to both; `--max-drop-enterprise` to override); R01 has an extra rule: coverage may not decrease at all (a removed component is always a regression) |
| PR comment / job summary | one before → after table | two tables, one per index, same renderer |
| HISTORY.md | index over time, per-eval | second pair of tables for R01–R06 |
| dashboard.json / dashboard | one index tile, ten evals, heatmap, findings | second index tile; the evals table and small multiples get a suite column; the heatmap gains R02–R06 columns (R01 is not per component); findings gain a **roadmap** group (R01 missing/partial items with the document's wording) beside movable / structural |
| docs | ADR-0011, design doc, REPORT | ADR-0012 "enterprise-readiness evals": the second-index decision, the delegated rule, the roadmap class; a design doc with the six formulas |
| Movability classes | movable, structural | plus roadmap (new work, not a refactor, not breaking) |

The single-theme assumption holds unchanged: every SCSS signal is read from `src/scss` compiled with the
token variables; `classic-theme/` stays a Storybook comparison artifact.

## 5. Expected baseline (from the probes, before any implementation)

| Eval | Rough baseline | Main gap in the document's words |
| --- | ---: | --- |
| R01 | ~55–60 | typeahead, skeleton loading, mega menu, global search, rich text, advanced uploader, density, KPI cards partial, timeline partial |
| R02 | ~70–75 | 5 patterns without ARIA (Carousel, DatePicker, MonthPicker, RangeSlider, TimePicker: provider-rendered), few live regions |
| R03 | ~50 | 18 patterns handle no key; pickers delegate to providers |
| R04 | ~65 | dark rules in 6 of 94 component files; reduced-motion guard in 3 of 50 animating files |
| R05 | ~45 | no density axis; breakpoint rules in 51 files |
| R06 | ~65 | loading states in 7 files; validation states in 15 |
| **ERI** | **~60** | |

These are estimates from file counts, not eval runs; the first implementation task is the baseline run that
replaces them.

## 6. Implementation plan (not started)

1. `evals/enterprise/requirements.json` transcribed from §2.1 and §5, each row with owner and evidence
   rules; a test asserts every evidence rule matches at least one path today or is marked `missing`.
2. `evals/enterprise/metrics/R01…R06.mjs` on the shared `lib/`; unit tests per scorer as in the current
   suite; per-component rows with hints in the shape `dashboard-data.mjs` already consumes.
3. `run.mjs`: `--suite`, results file with `suites`, history entries with `enterprise`, gate rules,
   report and dashboard data for two indices.
4. Baseline run, `HISTORY.md` and dashboard update, ADR-0012, design doc, README.
5. Phase 2, separate: `@storybook/test-runner` + `axe-playwright` in the Chromatic workflow, feeding R02's
   detail with real violations per story.

Estimated size: R02–R06 are each one metric file of the current size (150–250 lines) plus tests; R01 is
mostly the curated map. The runner and dashboard changes are additive to the current shapes.
