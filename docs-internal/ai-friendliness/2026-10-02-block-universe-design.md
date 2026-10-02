# Block universe: the OML block as the unit of measurement — design

Date: 2026-10-02 · Branch: `agents/osui-validate-evals` · ADR-0016 · Supersedes the tiers of ADR-0014 · Builds on ADR-0015.
`C:\GitHubProjects\outsystems-ui.worktrees\agents-osui-validate-evals`) · Supersedes the four-tier part of
ADR-0014 · Builds on the model bridge suite (design note 2026-10-02-model-bridge-eval-suite-design.md,
ADR-0015).

## 1. Problem

The heatmap's row is a thing found in the source tree: 33 TypeScript patterns, 48 CSS-only components, 16
layout partials and 30 utility families, in four tiers (`pattern`, `component`, `layout`, `utility`). The
Model bridge composes OutSystems UI as **OML blocks**, and the committed snapshot now lists 118 public
blocks, of which 89 are composable (not deprecated, not the documentation-only `Licenses`). Three things
follow from the mismatch:

1. The unit an agent produces (a block) is not the unit the loop scores (a pattern or a stylesheet), so a
   block's readiness is spread over several rows and three evals (M01, M03, M04) live in side tables because
   blocks are not rows.
2. The per-block tables show Block · Score · Hint; a hint does not say what is missing nor what to do, unlike
   every other finding on the page.
3. Four tiers are too fine for the reader. The filter asks them to tell a layout partial from a utility
   family, when the question they have is "is this something an agent composes, or a style the platform
   wears?"

## 2. Decisions

- **Row set.** Every public, non-deprecated block except `Licenses/Licenses` is a row (89 today). Registry
  components no block links to are rows of a second category.
- **Categories.** `component` (block rows) and `platform` (everything else: layout partials, utility families,
  widget stylesheets such as `btn`, `checkbox`, `form`, `table`, `switch`). Labels: "components (OML
  blocks)" and "platform & layout styles".
- **Block tables.** Block · Score · Missing · Do, lowest first, one lead line per table stating what 100
  means.
- **Approach.** Projection at the data-set layer: the metrics keep measuring their own objects; a block
  universe maps each block to its runtime and the runner, data set and page are built over block rows.
- **Shared runtimes.** A pattern several blocks drive gives each block its scores; blocks are the unit, so
  two blocks sharing a pattern weigh twice in the component category.
- **Deprecated blocks** leave the M-evals and the generated block cards. The resulting shift is recorded as a
  deliberate re-baseline (`npm run evals -- --label block-universe --force` if the gate would otherwise
  refuse the entry), not as a regression.

## 3. Architecture

```
snapshot (osui.blocks.json) ──┐
registry (components.json) ───┼─► lib/universe.mjs ──► rows: Block | PlatformStyle
inventory (source tree) ──────┘          │
                                         ├─► run.mjs: categorySummary (index per category)
metric results (per pattern / stylesheet / utility / block)
                                         └─► tools/dashboard-data.mjs: components[] = rows with projected cells
                                                      └─► dashboard page: filter, tiles, heatmap, findings
```

### 3.1 `evals/lib/universe.mjs` (new)

```js
/** @typedef {'component'|'platform'} Category */
/**
 * @typedef {object} Row
 * @property {string} id        `Flow/Name` for a block, the registry name for a platform style
 * @property {string} name      display name: block name, or the registry name
 * @property {string|null} flow block flow, null for a platform style
 * @property {Category} category
 * @property {import('./kinds.mjs').Kind} kind  source kind the evals reason with: the runtime pattern's
 *                                             `pattern`, else the stylesheet's kind, else `block`
 * @property {{ pattern: string|null, style: string|null }} runtime  the pattern and the CSS-only component
 *                                             (kind component or layout) the block drives
 * @property {string} platform  snapshot platform (ODC / O11), '' for a platform style
 */
export const CATEGORIES = /** @type {const} */ (['component', 'platform']);
export const CATEGORY_LABEL = { component: 'components (OML blocks)', platform: 'platform & layout styles' };
/** Public, not DEPRECATED_*, not Licenses/Licenses. */
export function composableBlocks(rows: BlockRow[]): BlockRow[];
/** Every row of the universe, blocks first (by key), then platform styles (by name). */
export function buildUniverse(snapshots, registry, inventory): Row[];
/** `Flow/Name` → Row and registry name → Row (a platform style, or the block row(s) a pattern/style feeds). */
export function rowIndex(rows: Row[]): { byId: Map<string, Row>, byRuntime: Map<string, Row[]> };
/** The row an eval's per-component entry belongs to: a block id, a pattern or stylesheet name. */
export function rowsForResult(index, resultName: string): Row[];
```

`kind` gains one value: `block` (the Kind type becomes `'pattern'|'component'|'layout'|'utility'|'block'`), used
for pure OML blocks (Columns2, DisplayOnDevice, SectionGroup …) that drive no pattern and no stylesheet.
`kindText('block')` = "a pure OML block: no TypeScript pattern and no OutSystems UI stylesheet of its own".
Two other n/a texts are added for block rows: a block whose runtime is a stylesheet only (E01–E06, E10:
"this block drives a CSS-only component, not a TypeScript pattern") and a block whose runtime is a pattern
only (nothing new: pattern evals apply).

A block appears once per snapshot file; with two platforms the row id is `Flow/Name (PLATFORM)` as the
M-evals already label it.

**Applicability of an eval to a row.** `rowApplies(present, row)` (in `lib/kinds.mjs`) is true when
`present.appliesTo` is absent, contains `row.kind`, or contains `'block'` and `row.category === 'component'`.
M01, M03 and M04 declare `appliesTo: ['block']`: they measure every block row whatever its runtime and no
platform row. The E- and R-evals keep their source-kind lists, so a block whose runtime is a stylesheet gets
n/a on the pattern evals and a pure OML block gets n/a on everything but the M-evals. `categorySummary` and
`componentCells` both use `rowApplies`; the page composes the n/a text from the same rule.

### 3.2 Registry links (`evals/lib/registry.mjs`, `evals/components.json`)

- The `block` field (array of `BlockLink`) is allowed on entries of kind `component` and `layout` as well as
  `pattern`. On a stylesheet entry `paramMap`, `platformOnly` and `eventMap` are absent (no TypeScript
  config); only `flow`, `name` and `derived` are used.
- `validateBlockLinks` gains two checks: a block is linked from at most one entry ("block Content/Card is
  linked from card and from stacked-cards"); on a stylesheet entry a `paramMap`/`eventMap` is an error
  ("card: paramMap on a CSS-only component"). Utility entries with a `block` field are an error.
- `blockRuntimeOf(reg, flow, name) → { pattern: string|null, style: string|null }`.

### 3.3 Doctor (`evals/tools/doctor.mjs`)

- `blockHintsFor` gains a third source: **name matches**. For every composable block with no link, the
  normalised block name (`CardSectioned` → `card-sectioned`, `InputWithIcon` → `input-with-icon`, `ProgressBar` →
  `progress` is _not_ matched: a match is exact after normalisation) is compared with pattern names
  (`Accordion` ↔ `Accordion`, `SwipeEvents` ↔ `SwipeEvents`) and stylesheet names (`card` ↔ `Card`,
  `blank-slate` ↔ `BlankSlate`). One exact match → a proposal `{ pattern|style, block, source: 'name' }`.
- `applyFixes` appends derived links for single-match proposals on stylesheet entries too (`derived: true`).
- The doctor report lists orphan composable blocks (no runtime at all) as information, not disagreement.

Expected first pass (to be confirmed by the run, not assumed): about 30 stylesheet links (card, card-item,
card-sectioned, card-background, badge, icon-badge, counter, alert, blank-slate, breadcrumbs, tag,
user-avatar, chat-message, section, floating-content, floating-actions, bottom-bar-item, pagination,
scrollable-area, stacked-cards, lightbox-image, master-detail, action-sheet, input-with-icon,
list-item-content, provider-login-button, timeline (TimelineItem: no exact match → stays manual),
animate (utility: never linked), separator (utility: never linked)); two pattern links by name
(SwipeEvents, TouchEvents). Anything not matched exactly is added by hand in the plan's registry task, with
the snapshot as the source of truth.

### 3.4 Categories in results (`evals/lib/results.mjs`, `evals/run.mjs`)

- `categorySummary(results, universe, metrics)` replaces `tierSummary` for new runs. For each category and each
  heatmap eval that applies to at least one row of the category: the mean of the projected cell values of the
  category's rows. A block row's value for an eval = the value of the eval's row for the block itself (M01,
  M03, M04), else for its pattern, else for its stylesheet. Non-heatmap evals take the eval score. The
  per-category `index` is the mean over the evals that produced a value.
- The run file and the history entry write `categories: { component, platform }` (same shape as the old
  `tiers`). Old entries keep their `tiers` field untouched; `normalizeHistoryEntry` leaves both as they are. The
  dashboard plots `categories` only; a run without it has no category series, which is how the two series get
  their first-run baseline.
- `tierSummary` and the `tiers` field are removed from the runner; the function stays exported for the tests
  of old runs until those are deleted in the same change.

### 3.5 Data set (`evals/tools/dashboard-data.mjs`, v5)

```
components: [{ n, id, k, b, f, rt: { p, s }, cells }]
   n = display name · id = row id · k = source kind · b = category · f = flow or null ·
   rt = runtime { p: pattern|null, s: style|null } · cells as today, projected
suites[].categories: { component?: {...}, platform?: {...} }  (the shape the old tiers had, two keys)
```

- `componentCells(results, row, index)` collects: the eval's own row for `row.id` (M-evals), else for
  `row.runtime.pattern`, else for `row.runtime.style`; unmeasured and not-applicable entries are matched the
  same way. The `appliesTo` skip rule uses `row.kind`.
- M01, M03 and M04 set `present.heatmap: true` and provide `present.cell(row)`; their per-block rows carry
  `name: row.label` which equals the universe row id. Their `extra` tables stay.
- `componentKinds` is replaced by the universe: no more inference of a kind from an eval's `appliesTo`.

### 3.6 Page (`evals/dashboard/index.html`, `evals/dashboard/dashboard.mjs`)

- Filter: `<select id="heat-kind">` options `all`, `component` (selected), `platform`, labelled from
  `CATEGORY_LABEL`. The Kind column shows the category label and, for a block, its runtime in small text
  ("pattern Accordion", "style card", "pure OML").
- Tiles: one per category per suite ("AI-Friendliness · components (OML blocks)"); the "Components measured"
  tile becomes "Rows measured: 89 blocks · 60 platform styles".
- Heatmap row head: block name, flow as faint text; platform rows as today.
- Not-applicable text composed from `kindText(row.k)` with the two block-specific texts of §3.1.
- Trend and multiples unchanged.

### 3.7 Block tables (`evals/model/lib/manifest.mjs`, M01, M03, M04)

```js
blockTable(title, lead, rows: { label, score, missing, do }[]) →
  { title, lead, columns: ['Block', 'Score', 'Missing', 'Do'], rows }
```

- **M01** lead: "100 = every parameter typed, described and defaulted when optional; placeholders and
  events described; both recipes; a pattern link or no API hint." Missing: facets under 100 with counts
  ("params 5/7, events 0/2, pattern link"). Do: per facet, the place: "OML: describe/default <params>",
  "OML: describe events <names>", "components.json: link to <pattern>" (from the hint), "npm run docs:ai"
  when the entry is absent.
- **M03** lead: "100 = every parameter described, defaulted when optional, typed as a static entity,
  structure or number rather than Text." Missing: "3 undescribed, 2 undefaulted, 4 free Text". Do: "In the
  OML: describe A, B; default C; type D as a static entity".
- **M04** lead: "100 = a card within 250 tokens with both recipes." Missing: "312 tokens (62 over), no TSX
  recipe". Do: "trim stage N (shorter descriptions, fewer listed values)", "regenerate: npm run docs:ai".
- The page renders `lead` under the table title; Missing and Do cells wrap (`.block-table td { white-space:
normal }`).

### 3.8 Composable set everywhere

`composableBlocks` replaces `publicBlocks` in M01–M04, M06 (static entities referenced), the block
manifest/cards generator (`scripts/lib/ai-docs-blocks.mjs`), the doctor and the universe. `osui.blocks.json`
(the snapshot) is unchanged: the exporter keeps exporting every block; the filter is a consumer rule.
`docs-ai/llms-blocks.txt` drops to 89 cards; `osui.blocks.json` (docs-ai) lists 89 entries.

## 4. Error handling

- No snapshot: the universe has only platform rows; every suite's `component` category is absent; the page
  shows the platform category only and the M-evals report `NO_SNAPSHOT` as today.
- A link to a block that is not composable (deprecated) is a validation error ("Accordion links
  DEPRECATED_Accordion: deprecated blocks are not composable").
- A block linked from two entries: validation error (3.2). A registry entry whose `block` has a `paramMap`
  but is a stylesheet: validation error.
- A results row whose name matches no universe row (a renamed pattern): dashboard-data logs it to stderr as
  "row without a universe entry" and drops it; the gate's measurement-coverage rule is unaffected.

## 5. Testing

- `evals/tests/universe.test.mjs`: composable filter (deprecated, Licenses, non-public excluded; platform
  suffix when two snapshots); `buildUniverse` on a fixture of 3 blocks + 4 registry entries → category,
  kind, runtime; `rowsForResult` for a shared pattern yields two rows.
- `registry.test.mjs`: stylesheet link accepted; paramMap on a stylesheet rejected; duplicate block link
  rejected; utility with a block rejected; deprecated target rejected.
- `doctor.test.mjs`: name-match proposals (exact match only; `ProgressBar` does not match `progress`);
  `applyFixes` appends derived stylesheet links.
- `results.test.mjs`: `categorySummary` over a fixture (two blocks sharing a pattern weigh twice; M-eval row
  by block id; a non-heatmap eval takes the eval score).
- `dashboard-data.test.mjs`: v5 shape; projected cells (pattern cell, style cell, block cell, n/a text for
  a stylesheet-only block on E01, pure OML block on E07).
- `dashboard-page.test.mjs`: the filter has two categories with `component` selected; render check on the
  committed data set; a single-suite data set with `categories.component` only.
- M01/M03/M04 tests: `missing` and `do` strings for one incomplete block and one complete block; table has
  the four columns and a lead.
- `ai-docs-blocks.test.mjs`: cards exclude deprecated blocks and Licenses; count equals the composable set.
- Existing suites stay green; the registry validation test runs against the real `components.json`.

## 6. Documentation

- `docs-internal/adr/ADR-0016-block-universe.md`: supersedes ADR-0014 §1 (tiers) — two categories, source kinds
  kept as an attribute, the block as the unit, shared-runtime weighting, deprecated exclusion, the
  re-baseline.
- `evals/README.md`: tiers paragraph → categories and the universe; the registry table (`block` on stylesheet
  entries); the results section (`categories`); the page section.
- `evals/model/README.md`: composable set; the block tables' columns.
- `AGENTS.md` / `CLAUDE.md`: the one-line description of the heatmap row.
- `docs-internal/ai-friendliness/2026-10-02-block-universe-design.md`: this note, trimmed of the approval
  trail.

## 7. Out of scope

- Re-keying `components.json` by block.
- Changing what any metric measures or how it scores (only M01/M03/M04 presentation and the composable set).
- The O11 snapshot.
- Re-plotting the old four-tier series.

## 8. Vocabulary

- **Category**: one of the two groups a row belongs to, `component` or `platform`. The word "tier" leaves
  the code, the page, the README and the ADRs; `evals/lib/tiers.mjs` becomes `evals/lib/kinds.mjs`
  (`Kind`, `KINDS`, `normalizeKind`, `defaultKindFor`, `appliesTo`, `rowApplies`, `kindText`), and the
  categories and their labels live in `evals/lib/universe.mjs`. Old history entries keep their `tiers` field
  as recorded; nothing reads it any more.
- **Kind**: the source kind of a row (`pattern`, `component`, `layout`, `utility`, `block`), an attribute the
  evals reason with, never a filter or an index.
- **Row**: a block or a platform style; **block**: a composable OML block; **platform style**: a registry
  component no block links to.

## 9. Category series back to the baseline

Every recorded run (`baseline` … `model-1`, 15 entries) still has its result file under `evals/results/`
with per-row results, so the two category indices are computed for the whole history rather than started
from the next run.

- `evals/tools/backfill-categories.mjs` (`npm run evals:history:categories`): for each history entry whose
  run file exists, builds the universe from the **current** snapshot, registry and inventory, computes
  `categorySummary` over that run's results and writes `categories` into the entry (and into the run file).
  A row name the current universe does not know (a component renamed since) is dropped and listed on stderr.
  Entries whose run file is missing are left as they are and reported.
- The series therefore answers "what would the component and platform indices have been, under today's
  universe, at each recorded commit". ADR-0016 states this: the universe is a lens applied to every run, not
  a measurement that existed at the time. A second run of the tool is idempotent.
- The old `tiers` field is removed from every entry by the same tool (nothing reads it; the data stays in
  the run files' history on the `evals-results` branch).
- The dashboard's category tiles then show a baseline label of `baseline` (ai), `loop-5` (enterprise),
  `loop-13` (utilities) and `model-0` (model), the same as the suite indices.
- `HISTORY.md` gains one column pair per category (component · platform) in its per-run table, rendered by
  `tools/report.mjs`.

## 10. Dead code and technical debt

A scan of `evals/**`, `scripts/lib/ai-docs*.mjs`, `scripts/lib/pattern-types.mjs` and the generators (scratch
script, not committed) and a reader map of `docs-ai/` give this cleanup, done in one task after the
functional work so each removal is checked against a green suite:

**Generated documents.** Every file of `docs-ai/` has at least one production reader (an eval, the
freshness check or `publish-ai-docs.mjs`), so none is removed. Two changes: `docs-ai/osui.blocks.json`
writes no `"$schema": null` (the key is omitted until a schema is published), and the two
`docs-ai/schema/*.schema.json` files are kept because they are the published contract of the manifests
(E03 measures the manifest against them). The report of readers per file goes into the ADR.

**Delete** (verified unused at task time with a repository-wide search before each removal):
`THEME_RESETS` (enterprise/lib/signals), `VARIANT_LABELS` (R04), `entryOf` (lib/registry), the legacy
`css` → `component` compatibility in `normalizeKind` (no entry uses `css`), the `componentKinds` inference
in dashboard-data (replaced by the universe), `tierSummary` and every `tiers` reader (replaced by
`categorySummary`), the page's `OUTSIDE_TIER` and `TIER_LABEL` copies (the data set carries `kindTexts`
and `categoryLabels` from `lib/kinds.mjs` and `lib/universe.mjs` so the texts live once), the unused
imports `parseCards` (M05), `aggregate` (run.mjs), `TIERS` (dashboard-data), `SIDES` (ai-docs).

**De-export** every symbol the scan lists as exported but used only in its own file and by no test (about
45 constants and helpers: E01 `T_MIN`/`T_MAX`/`BENCHMARK`/`CARD_COMPLETENESS_GATE`, E02 `FREE_PROPS`/
`PROPS_TO_ZERO`/`isPrecise`, E05 `isDocumented`, E06 `CANONICAL`, E07 `FREE_DEPTH`/`FREE_ELEMENTS`, the
R-eval needle lists, `readHeadCommit`/`readHeadBranch`, `classifyTsFile`/`readSpecScss`, `percentile`,
`loadRepoConfig`/`walkNodes`/`documentedDefault`, `RADII`/`ALIGNS`/`subjectOf`, `MODEL_DIR`/`SCHEMA_FILE`,
`FACETS`, `coverageOf`, `sectionLines`, `declaredIconLibraries`, the dashboard-page path constants and
`createDocumentStub`/`writeDashboardPage`, `gateSuite`/`isDevEntry`, the U-eval hint constants,
`firstSentence`/`recipeValue`, `ICON_SOURCES`, `MANIFEST_VERSION`/`shortType`/`parseEnumPath`/
`enumValuesFor`/`describeProp`/`cleanMarkup`/`knobsOf`/`usageOf`/`LEGACY_ALIAS`/`SINGLE_THEME_SCOPE`/
`themeRolesOf`, `GENERATOR`/`publicType`/`renderPatternTypesRaw`). Symbols a test imports stay exported:
a test is a reader.

**Cross-suite imports** (a metric importing another suite's metric): `parseCards` moves from E01 to
`evals/lib/cards.mjs`; `manifestClasses` moves from U04 to `evals/lib/utilities.mjs`. E01, U04, M04, M05
and M06 import from the libraries.

**Stale text**: the snapshot schema's description "arrays keep model order" becomes "records and events
sorted by name"; `evals/README.md` loses every mention of tiers; `inputs.mjs` header line wrapped.

**Not touched**: `scripts/generate-token-data.mjs` and `scripts/generate-css-api-reference.mjs` predate the
branch and are outside the evals infrastructure; the scan's "local" hits that are spread-call false
positives (`...paramMapErrors(`, `...renderCardApi(`, `...SRC`) are not dead.
