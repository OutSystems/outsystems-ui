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

Refresh it with the exporter (`osui-blocks-export`, a .NET console tool kept outside this repository; it
needs .NET 10, the OutSystems Azure NuGet feed and GitHub CLI):

    osui-blocks-export --github OutSystems/OutSystems.Tenant.Starter.Apps@<commit>:src/10_Base/OutSystemsUI.oml --platform ODC -o evals/model/osui.blocks.json
    npm run docs:ai && npm run evals -- --label <name>

A branch name is refused; `source.origin` records the commit, blob SHA and SHA-256. The snapshot is a measured
input: a new file records a run.

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
