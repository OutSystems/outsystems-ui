# Model bridge readiness (M01–M06)

How well the library serves the Model team's bridge, which composes OutSystems UI as OML blocks
(OpenUI, HTML and TSX dialects over `Block(SourceBlock: Flow/Name, …)`). Design and formulas:
`docs-internal/ai-friendliness/2026-10-02-model-bridge-eval-suite-design.md`.

## The block snapshot

`osui.blocks.json` is the OutSystems UI OML as the bridge sees it: every block's flow, name, input
parameters (type, kind, default, description), placeholders, events and the `*API` names its JavaScript
reaches, plus the static entities and structures those parameters reference. Schema: `osui.blocks.schema.json`
(a test validates the file). One file per platform (`osui.blocks.json` = ODC; `osui.blocks.o11.json` when
exported). The evals, the block cards and the doctor read the **composable** set: public blocks that are not
`DEPRECATED_*` and not the documentation-only `Licenses/Licenses` (91 today); the others stay in the file and are
reported as not applicable.

Refresh it with `npm run evals:model:export` (`evals/tools/export-snapshot.mjs`), which runs the exporter
(`osui-blocks-export`, a .NET console tool kept outside this repository: `OSUI_BLOCKS_EXPORT` or
`../osui-blocks-export`; it needs .NET 10, the OutSystems Azure NuGet feed and GitHub CLI):

    npm run evals:model:export                      # GitHub at the commit the snapshot pins
    npm run evals:model:export -- --commit <40-hex>  # GitHub at another commit
    npm run docs:ai && npm run evals -- --label <name>

A branch name is refused; `source.origin` records the commit, blob SHA and SHA-256. The snapshot is a measured
input: a new file records a run.

**Iterating on a fixed OML.** Drop the module as the one `.oml` file of `evals/model/local/` (git-ignored) and
run the same command: the local file is exported instead of GitHub, and the snapshot's `source.origin` names no
repository. Run the docs and the evals as usual to see what the fix moves; remove the file to return to GitHub.
The snapshot test refuses a repository-less snapshot unless a local OML is present, so an iteration snapshot
is not committed by accident.

## The evals

| ID  | Eval                        | What it reads                                                                  | What moves it                                                        |
| --- | --------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| M01 | Block manifest completeness | the snapshot vs `docs-ai/osui.blocks.json`                                     | `npm run docs:ai` (recipes, links); descriptions and defaults in OML |
| M02 | Pattern–block crosswalk     | `evals/components.json` `block` links and the snapshot's API hints             | confirming links and filling `paramMap` / `eventMap`                 |
| M03 | Block parameter precision   | the snapshot's parameters                                                      | the OutSystems UI OML (next Forge release)                           |
| M04 | Block card cost and recipes | `docs-ai/llms-blocks.txt` (≤ 250 o200k tokens per card)                        | the card renderer                                                    |
| M05 | Producer-scoped guidance    | `llms.txt`, the component cards, `llms-patterns.txt`                           | the `[runtime-only]` markers and the Producers section               |
| M06 | Silent-failure surfaces     | `osui.utilities.json`, `llms-tokens.txt`, `osui.icons.json`, `osui.enums.json` | the generated allowlists                                             |

Every composable block is a row of the dashboard (`evals/lib/universe.mjs`, category `component`): M01, M03
and M04 are its own heatmap cells (`appliesTo: ['block']`), the E- and R-evals it inherits from the pattern or
stylesheet it drives (the `block` links of `evals/components.json`), M02 is the pattern heatmap, M05 and M06 are
whole-repository figures. M01, M03 and M04 also report a table per block in the findings (`extra`): columns
`Block · Score · Missing · Do`, lowest score first, with a lead line saying what 100 means. Non-composable blocks
are not applicable.

## Defaults and ExtendedClass

An optional block parameter without a default in the OML takes the platform default of its data type at runtime
(Boolean `False`, Integer `0`, Decimal `0.0`, Text `""`, Date `#1900-01-01#`, Time `#00:00:00#`, Date Time
`#1900-01-01 00:00:00#`, identifiers `NullIdentifier()`, an empty structure or list). `lib/defaults.mjs` states it; the
block manifest and cards carry it with its source (`defaultSource`: `oml` or `platform`), and the recipes use it only
when it is an expression. M03 therefore scores descriptions (60) and precise types (40) and does not ask the OML for
defaults. `ExtendedClass` is Text on purpose (CSS utility classes, see `llms-utilities.txt`) and is never counted as
free Text; the same holds for the other Text-on-purpose parameters (`TEXT_ON_PURPOSE`: DOM identifiers such as
`WidgetId`, free texts such as `Title`, measures with a unit such as `Height`, the `DateFormat` / `TimeFormat` masks,
`SVGCode`), whose reason the manifest carries as `textOnPurpose` (ADR-0017).
