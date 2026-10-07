# ADR-0016: The composable OML block as the unit of measurement; two categories instead of four tiers

## Status

Proposed (branch `agents/osui-validate-evals`) — supersedes the tiers of ADR-0014 §1

## Date

2026-10-02

## Context

The heatmap's row was a thing found in the source tree: 33 TypeScript patterns, 48 CSS-only components, 16
layout partials and 30 utility families, in four tiers (`pattern`, `component`, `layout`, `utility`). The
Model bridge composes OutSystems UI as **OML blocks**, and the committed snapshot (ADR-0015) lists 118 public
blocks, of which 91 are composable (not deprecated, not the documentation-only `Licenses`). Three things
followed from the mismatch:

1. The unit an agent produces (a block) was not the unit the loop scored (a pattern or a stylesheet), so a
   block's readiness was spread over several rows, and three evals (M01, M03, M04) lived in side tables
   because blocks were not rows.
2. The per-block tables showed Block · Score · Hint; a hint said neither what was missing nor what to do,
   unlike every other finding on the page.
3. Four tiers were too fine for the reader: the filter asked them to tell a layout partial from a utility
   family, when their question was "is this something an agent composes, or a style the platform wears?"

A review of the evals infrastructure and the generated documents was asked for at the same time: every
file of `docs-ai/` has at least one production reader (an eval, the freshness check or the publisher), so
none was removed; the scan found needless exports, a legacy `css` kind nothing used, three metrics importing
another suite's metric, and stale texts.

## Decision Drivers

- The block an agent composes is the row an agent, a reviewer and the dashboard reason about.
- Two categories a reader can name without the glossary; the finer source kinds stay as an attribute.
- Every finding says what is missing and what to do, the block tables included.
- The category series must be readable back to the first run, not start from the next one.
- Metrics keep measuring what they measure; the universe is a lens applied to their results.

## Considered Options

- **Projection at the data-set layer** (chosen): a row universe maps every composable block to the pattern
  and/or stylesheet it drives through the registry's `block` links; the runner's per-category index, the data
  set and the page are built over those rows and inherit each block's scores from its runtime.
    - Pros: 28 metrics and their tests untouched; one module owns the mapping; the same universe backfills
      every recorded run.
    - Cons: a pattern several blocks drive weighs once per block.
- **Block-first inside every metric**: each metric emits rows keyed by block. The E-evals read TypeScript
  that exists per pattern, so all of them would carry the mapping. Rejected for the blast radius.
- **Registry re-keyed by block**: `components.json` keyed by `Flow/Name`. Rejected: the inventory, doctor and
  every lookup migrate at once, and platform styles with no block need a second keyspace anyway.

## Decision

1. **Rows and categories** (`evals/lib/universe.mjs`). A row is a composable block (category `component`,
   91 today) or a registry component no block links to (category `platform`: layout partials, utility
   families, widget stylesheets such as `btn`, `checkbox`, `form`; 66 today). Labels: "components (OML
   blocks)" and "platform & layout styles". The source **kinds** (`evals/lib/kinds.mjs`, renamed from
   `tiers.mjs`) gain `block` for a pure OML block and remain an attribute the evals reason with:
   `rowApplies(present, row)` is true when `appliesTo` includes the row's kind, or includes `block` and the
   row is a block. The word "tier" leaves the code, the page, the READMEs and the agent entry points.
2. **Links** (`evals/components.json`). A `block` link is allowed on CSS-only components and layout partials
   (flow and name only; the maps stay on patterns). A block is linked from one entry at most, never from a
   utility family, never a deprecated block. The doctor proposes links by API call and by exact normalised
   name (`CardSectioned` ↔ `card-sectioned`, never by prefix). The branch records 69 links: 38 on patterns, 31 on
   stylesheets; 22 blocks are pure OML (Columns*, DisplayOnDevice, the Private events, the Utilities helpers).
3. **Composable set** (`evals/model/lib/snapshot.mjs`). Deprecated blocks and `Licenses` leave the M-evals,
   the block cards and the doctor; the snapshot file is unchanged.
4. **Block evals in the heatmap**. M01, M03 and M04 declare `appliesTo: ['block']` and `heatmap: true`; their
   rows are the block ids. Their tables carry `Block · Score · Missing · Do` and a lead line saying what 100
   means (`blockTable(title, lead, rows)`).
5. **Categories in results and history**. `categorySummary(results, rows, metrics)` replaces `tierSummary`;
   runs write `categories` (component, platform). `evals/tools/backfill-categories.mjs`
   (`npm run evals:history:categories`) recomputes both series for every recorded run from its stored result
   file under the current universe and removes the old `tiers` field. The series is a lens applied to every
   run, not a measurement that existed at the time.
6. **Data set v5 and page**. Rows carry id, name, flow, category, kind and runtime; cells are projected
   (block id, else pattern, else stylesheet); the kind texts and category labels travel with the data. The
   page filters by category (components selected), shows a tile per category, names the flow and runtime
   on each block row, and renders the tables with their lead.
7. **Cleanup**. `parseCards` → `evals/lib/cards.mjs`, `manifestClasses` → `evals/lib/utilities.mjs`; `entryOf`
   and the legacy `css` kind deleted; sixty-odd symbols used only inside their file lose `export`;
   `docs-ai/osui.blocks.json` carries no `"$schema": null`; the snapshot schema says records and events are
   sorted by name.

## Consequences

Positive:

- One unit from the OML to the dashboard: 157 rows (91 blocks, 66 platform styles). The run
  `block-universe` records the model suite at 92.9 (M01 86.7, M02 95.8, M03 74.8, M04 100, M05 100,
  M06 100); the three other indices are unchanged (87.5, 68.5, 75.7).
- Category series from the baseline: AI-friendliness components 66.9 → 86.2 and platform 72.0 → 72.7
  across the 16 runs; enterprise components 51.1 → 68.7; model components 29.2 → 92.9.
- The block tables say what to change and where: M03's lowest rows (`Private/MenuDrag` 30,
  `Content/CardItem` 50, `Content/ListItemContent` 50) each name their undescribed or free-Text parameters
  for the OML.

Negative:

- A pattern several blocks drive (Dropdown → DropdownSearch, DropdownTags) weighs once per block in the
  component index; the suite index is unchanged.
- The six registry helpers filed as utilities (`animate`, `columns`, `separator`, `align-center`,
  `center-content`, `margin-container`) are rows no suite measures; they show as not measured with a
  neutral text rather than disappearing.
- The old four-tier series stay in the result files' history on the `evals-results` branch and are not
  plotted; the run files recorded in the legacy shape were lifted to the suites shape when the backfill
  wrote them.
- Removing deprecated blocks moved M02 from 98.7 to 95.8 and M03 from 75.4 to 74.8, inside the gate's
  tolerances, so no forced re-baseline was needed.

## Links

- Design note: `docs-internal/ai-friendliness/2026-10-02-block-universe-design.md`
- `evals/README.md` (rows, categories, kinds), `evals/model/README.md`
- ADR-0014 (tiers, superseded in §1 by this decision), ADR-0015 (model bridge suite)
