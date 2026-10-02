# Model Bridge Readiness eval suite (`model`, M01–M06) — Design

- **Date:** 2026-10-02
- **Status:** Accepted (implemented on this branch; ADR-0015)
- **Target repository and branch:** `OutSystems/outsystems-ui`, branch `agents/osui-validate-evals` (PR #1277), worktree `C:\GitHubProjects\outsystems-ui.worktrees\agents-osui-validate-evals`
- **Companion:** ADR-0015; the assessment of 2026-10-01 (PR #1277 against the Model bridge) motivates every eval below

## 1. Brief

**Intended outcome.** A fourth eval suite in `evals/` that measures how well OutSystems UI serves the Model team's bridge (`OutSystems.ModelExtensions`: OpenUI, HTML and TSX dialects over OML blocks), so the refinement loop of PR #1277 can ratchet toward that pipeline with the same history, gate and dashboard as the other three suites.

**Who it is for.** The UI Components team running the loop; the Model team as the consumer of what the loop produces (`docs-ai/` for blocks).

**Success looks like.**

- `npm run evals` prints a fourth table, "Model Bridge Readiness Index (M01–M06)"; `history.json`, `HISTORY.md` and `dashboard.json` carry it; the gate protects it with the standard tolerances.
- The suite's inputs are deterministic and offline: a committed OML snapshot, `docs-ai/`, `evals/components.json`, the compiled CSS and the installed icon packages. No Model API, no .NET and no network at eval time.
- Every metric is self-describing (`present` block) and pure-scored (`score*` functions with synthetic-input tests), as the existing contract requires.
- The first loop iteration after the suite lands moves at least M01, M04 and M05 by generating the block cards and the producer-scoped guidance.

**Constraints (from the PR's own rules and the user).**

- Nothing changes runtime behaviour; the suite adds generated files, registry fields, a snapshot and evals only.
- No commit or push without explicit confirmation per commit.
- Static-analysis conventions of `evals/`: paths through `insideDir`, substring scanners (no regexes over source text), no nested template literals, explicit sort comparators, no child processes in metrics.
- The UI repository stays Node-only in CI; the OML exporter runs locally and lives outside the repository for now.

**Decisions taken before implementation.**

- Block input comes from a versioned OML snapshot committed to the repository (not a hand-maintained crosswalk alone, not a Model-team export).
- All six evals M01–M06 are in scope.

## 2. Vocabulary

| Term                | Meaning here                                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Block**           | An OutSystems UI block in the OML (`IMobileBlock`), identified as `Flow/Name` (`Interaction/Carousel`). What the bridge instantiates via `SourceBlock`.   |
| **Pattern**         | A runtime TypeScript pattern of this repository (`Carousel`, driven by `CarouselAPI`), as the inventory discovers it.                                     |
| **Snapshot**        | `evals/model/osui.blocks.json`: the exported block signatures, static entities and structures of one OutSystems UI module, with provenance.               |
| **Blocks manifest** | `docs-ai/osui.blocks.json`: the generated, agent-facing join of snapshot + crosswalk + recipes; `docs-ai/llms-blocks.txt` is its card rendering.          |
| **Crosswalk**       | The link pattern ↔ block(s) with a parameter map, from the exporter's hints confirmed by `evals/components.json`.                                         |
| **Producer**        | Who writes the code: an _OML producer_ (the bridge dialects, Service Studio) or a _runtime producer_ (standalone HTML + JS, the HTML dialect, Storybook). |

## 3. Architecture

```
OutSystemsUI.oml ──(local .NET exporter, CloneESpace)──► evals/model/osui.blocks.json   (committed snapshot, schema-checked)
                                                                   │
        src/scripts (patterns) ─┐                                  │ hints (JS OnReady → <X>API.Create)
        evals/components.json ──┼── scripts/lib/ai-docs.mjs ◄──────┘
        node_modules icon fonts ┘           │
                                            ▼
                     docs-ai/osui.blocks.json · llms-blocks.txt · osui.enums.json · osui.icons.json · llms.txt (producer section, [runtime-only] markers)
                                            │
                                            ▼
                     evals/model/metrics/M01…M06 ──► run.mjs ──► results/<label>.json · history.json · HISTORY.md · dashboard.json · gate
```

The exporter is the only new piece that needs the Model API; everything to its right is Node and runs in CI exactly like the other suites.

## 4. The snapshot (`evals/model/osui.blocks.json`)

### 4.1 Contract

```jsonc
{
	"$schema": "./osui.blocks.schema.json",
	"version": 1,
	"source": {
		"module": "OutSystemsUI",
		"platform": "ODC", // "ODC" | "O11"
		"moduleVersion": "…", // from the OML header (Version / ProductName) when present
		"lastModifiedUtc": "…", // OML header LastModifiedUtc
		"omlKey": "…", // OML header Key, for provenance only
		"origin": {
			// where the OML came from, pinned so the snapshot is reproducible
			"repository": "OutSystems/OutSystems.Tenant.Starter.Apps",
			"path": "src/10_Base/OutSystemsUI.oml",
			"commit": "f7ca45590…", // full commit SHA the file was taken from (never a branch name)
			"blobSha": "a084ae53…", // git blob SHA of the file, checked against the downloaded bytes
			"sha256": "…", // SHA-256 of the OML bytes
		},
		"exporter": "osui-blocks-export 0.1.0",
		"exportedAt": null, // always null: the file must be byte-stable for the same OML
	},
	"staticEntities": {
		"Color": {
			"description": "…",
			"records": [{ "identifier": "Transparent", "label": "Transparent", "attributes": { "Order": 1 } }],
		},
	},
	"structures": {
		"ItemsPerSlide": {
			"description": "…",
			"attributes": [
				{ "name": "Desktop", "type": "Integer", "mandatory": false, "default": "1", "description": "…" },
			],
		},
	},
	"blocks": {
		"Interaction/Carousel": {
			"flow": "Interaction",
			"name": "Carousel",
			"public": true,
			"description": "…",
			"inputParameters": [
				{
					"name": "ItemsPerSlide",
					"type": "ItemsPerSlide", // display type text as Service Studio shows it
					"typeKind": "structure", // basic | identifier | staticEntity | structure | list | other
					"typeRef": "ItemsPerSlide", // key into structures / staticEntities when typeKind is one of those; null otherwise
					"mandatory": false,
					"default": "…", // expression text or null
					"description": "…",
				},
			],
			"placeholders": [{ "name": "CarouselItems", "description": "…" }],
			"events": [
				{
					"name": "OnSlideMoved",
					"mandatory": false,
					"description": "…",
					"parameters": [{ "name": "Position", "type": "Integer", "description": "…" }],
				},
			],
			"requiredScripts": ["…"],
			"patternHints": { "apiCalls": ["CarouselAPI"] }, // distinct `OutSystems.OSUI.Patterns.<X>API` names found in the block's JavaScript nodes, sorted
		},
	},
}
```

Rules:

- Keys of `blocks`, `staticEntities` and `structures` are sorted by code point; arrays keep model order. The same OML yields a byte-identical file.
- `typeKind` is derived from the Model API type: `basic` (Text, Integer, Boolean, Decimal, Date, DateTime, Time, Currency, Email, PhoneNumber, BinaryData), `identifier` (an entity identifier that is not a static entity), `staticEntity` (identifier of a static entity defined in the module), `structure`, `list` (with `typeRef` the element structure when any), else `other`.
- Only blocks under the module's UI flows are exported; `public: false` blocks are kept (the metrics mark them not applicable) so the file is a faithful snapshot.
- A second platform is a second file (`osui.blocks.o11.json`) with the same schema; v1 ships the ODC file only. The metrics read every `evals/model/osui.blocks*.json` and treat each platform's blocks as separate rows named `Flow/Name (O11)` when more than one file exists.

### 4.2 Exporter

- A .NET console project `osui-blocks-export` kept **outside** the UI repository (sibling of `omlviz`, same `NuGet.config` and restored `OutSystems.ModelAPI` / `OutSystems.Model.Implementation` packages). It calls `ModelServices.CloneESpace(omlPath)` (the module is read-only; `LoadESpace` is refused), walks `eSpace.MobileFlows[*].Nodes.OfType<IMobileBlock>()`, and for the hints scans `IJavaScriptNode` code of the block's client actions for the substring `OutSystems.OSUI.Patterns.` followed by an identifier ending in `API`.
- Usage, from a local file or straight from GitHub:

    ```
    osui-blocks-export --oml <OutSystemsUI.oml> --platform ODC -o evals/model/osui.blocks.json
    osui-blocks-export --github OutSystems/OutSystems.Tenant.Starter.Apps@<commit>:src/10_Base/OutSystemsUI.oml --platform ODC -o evals/model/osui.blocks.json
    ```

    The GitHub form resolves the reference with the GitHub contents API through the caller's `gh` credentials (the repository is internal; the file is a plain blob, 4.8 MB, no LFS), requires a commit SHA rather than a branch name, verifies the downloaded bytes against the blob SHA the API reports, and fills `source.origin`. A branch name is refused so that two runs of the same command cannot yield different snapshots. The local form fills `origin` only with the SHA-256 (repository and commit unknown).

- Refreshing the snapshot is therefore: pick the Starter Apps release commit, run the GitHub form, run `npm run docs:ai`, run the suite. The snapshot's `origin.commit` names the Forge release it measures, and a later snapshot from a newer commit records a new run because `evals/model` is a measured input.
- The UI repository documents the contract (§4.1) and the command in `evals/model/README.md`; a test validates the committed snapshot against `osui.blocks.schema.json` (hand-written JSON Schema, checked with a small structural validator in `evals/lib/schema.mjs`, no new dependency).
- Follow-up noted, not in scope: the Model team's `ReferenceBlockTextualTransformer` can emit the same file from a consumer module's references.

### 4.3 Measured inputs

`evals/lib/inputs.mjs` `MEASURED_DIRS` gains `evals/model` (snapshot files only; the metrics directory is excluded like tokens are). A new Forge release therefore records a run; an eval-code change does not.

## 5. Generated docs and registry changes

### 5.1 `scripts/lib/ai-docs.mjs`

New functions, each pure over `ctx` plus the loaded snapshot(s):

- `loadBlockSnapshots(ctx)` → `{ platform, source, blocks, staticEntities, structures }[]` (empty when no file).
- `crosswalkOf(ctx, snapshots)` → per pattern `{ blocks: [{ key, paramMap, eventMap, source: 'registry'|'hint' }] }` and per block the pattern it drives. Source of truth order: `components.json` `block` entries win; otherwise a block whose `patternHints.apiCalls` names exactly one pattern's API is linked with an empty parameter map and `source: 'hint'`.
- `buildBlocksManifest(ctx)` → `docs-ai/osui.blocks.json`: per block the snapshot signature, `pattern` (name or null), `paramMap`, `recipes: { openui, tsx }`, `card` token count is **not** stored (the eval measures the text).
- `renderBlockCards(manifest)` → `docs-ai/llms-blocks.txt`: `## Flow/Name` sections with: one-line purpose, `Params:` (name: type [= default] — description, static-entity values listed inline when ≤ 8), `Slots:`, `Events:` (with payload), `Runtime pattern:` link when known, `OpenUI:` and `TSX:` recipes. Budget ≤ 250 o200k tokens per card; the renderer truncates descriptions to the first sentence and never truncates names.
- `buildEnumsManifest(snapshots)` → `docs-ai/osui.enums.json`: `{ "<StaticEntity>": { "values": [{ identifier, label }], "usedBy": ["Flow/Block.Param"] } }`.
- `buildIconsManifest(ctx)` → `docs-ai/osui.icons.json`: `{ "phosphor": { "prefix": "ph", "classes": [...] }, "fontawesome4": { "prefix": "fa", "classes": [...] } }`, read from the installed packages' CSS (`@phosphor-icons/web`, `font-awesome`) by substring scanning for `.ph-` / `.fa-` selectors; the icon library each platform uses comes from `src/scss/01-foundations/_icon-library-{o11,odc}.scss`.
- `renderIndex` adds a **Producers** section before the gotchas:
    - "OML / Service Studio producers (OpenUI, HTML, TSX dialects): compose blocks from llms-blocks.txt; never emit pattern markup or lifecycle calls; set `ExtendedClass` as a block parameter; style with llms-utilities.txt classes and llms-tokens.txt knobs."
    - "Runtime producers (standalone pages, Storybook, the HTML dialect's runtime path): llms-components.txt, lifecycle and markup apply."
    - Each gotcha line that is runtime-only starts with the literal marker `[runtime-only]`.
- `renderComponentCards` prefixes the `Lifecycle:` and `Markup skeleton` lines with `[runtime-only]`; `renderCssComponents` prefixes every `Skeleton` line the same way.

Recipes are generated from the signature, never hand-written:

```
OpenUI:  _Carousel1 = Block(SourceBlock: Interaction/Carousel, ItemsPerSlide: …, CarouselItems: [_Item1])
TSX:     <Carousel id={"_Carousel1"} data-source={"Interaction/Carousel"} ItemsPerSlide={…} CarouselItems={<>…</>} />
```

Placeholder arguments list one `_Child` identifier; parameter values are the default when present, else a typed placeholder (`"…"`, `0`, `false`, `Entities.<Entity>.<FirstRecord>`).

### 5.2 `evals/components.json`

Optional per-pattern field:

```jsonc
"Carousel": {
  "kind": "pattern",
  "block": [
    {
      "flow": "Interaction",
      "name": "Carousel",
      "paramMap": { "ItemsPerSlide.Desktop": "ItemsDesktop", "ItemsPerSlide.Tablet": "ItemsTablet", "ItemsPerSlide.Phone": "ItemsPhone", "Navigation": "Navigation", "ExtendedClass": "ExtendedClass", "Height": "Height" },
      "platformOnly": [ "Position" ],          // block params with no runtime counterpart, by design
      "eventMap": { "OnSlideMoved": "OnSlideMoved" }
    }
  ]
}
```

`lib/registry.mjs` validates the field: the block must exist in a snapshot, every `paramMap` key must be a block parameter (dotted for structure attributes) and every value a config prop of the pattern; `eventMap` keys block events, values runtime `EventName`s. The doctor (`tools/doctor.mjs`) proposes a `block` entry for every pattern whose API a block's hints name and that has no entry, and lists blocks whose hints name a pattern that does not exist.

### 5.3 Freshness

`scripts/check-ai-docs-fresh.mjs` already compares every generated file; the new files join automatically because `writeDocs` returns them. `npm run evals:fix` therefore regenerates them.

## 6. The metrics (`evals/model/metrics/`)

Shared helpers in `evals/model/lib/snapshot.mjs` (load snapshots, flatten blocks, applicability) and `evals/model/lib/cards.mjs` (parse `llms-blocks.txt` sections, reuse `parseCards` from E01 by generalising its heading parser to accept `/` in names).

Common presentation: M01, M03 and M04 set `heatmap: false`, `appliesTo: ['pattern']` (the contract requires a tier; blocks are measured in their own table), and provide `extra(m)` returning `{ title, columns, rows }` listing blocks with score and hint, like R01's requirement table. M02 is a pattern heatmap. M05 and M06 are whole-repository (`heatmap: false`). Non-public blocks are `notApplicable` with reason "not public in the module" in M01, M03 and M04.

| ID      | Name · criterion                                                  | Formula (per the contract, repeated in results)                                                                                                                                                                                                                                                                                                                                                                                                                                            | Class                                                                        |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **M01** | Block Manifest Completeness · machine-readable block contract     | per public block in the snapshot, mean of five facets read from `docs-ai/osui.blocks.json`: params (each with `type`, `description`, and `default` when optional), placeholders (each with a description), events (each with description and payload descriptions), recipes (both present), pattern link (present or explicitly `null` with `patternHints` empty); score = 100 · mean(block facet means) · (manifest blocks / snapshot public blocks); 0 without the manifest              | movable                                                                      |
| **M02** | Pattern–Block Crosswalk · composition fidelity                    | per pattern: 50 · (linked to ≥ 1 block via registry or hint) + 30 · (block params covered by `paramMap` or `platformOnly`, over the linked blocks' params) + 20 · (block events covered by `eventMap`); mean over patterns. Patterns with no block in the module (SwipeEvents, TouchEvents, the item patterns) are `notApplicable` when the snapshot has no hint naming them                                                                                                               | movable                                                                      |
| **M03** | Block Parameter Precision · typed contracts at the block boundary | per public block: 50 · (params with a non-empty description) + 30 · (optional params with a default) + 20 · (params whose `typeKind` is not `basic:Text` or `other`); mean over blocks; blocks without parameters are `notApplicable`                                                                                                                                                                                                                                                      | movable (needs OML changes to move; the eval also reports the top offenders) |
| **M04** | Block Card Cost and Recipes · token budget                        | per public block with a card in `llms-blocks.txt`: 70 · band(tokens, 250, 600) + 30 · (OpenUI and TSX recipe lines present); blocks without a card score 0; mean over blocks                                                                                                                                                                                                                                                                                                               | movable                                                                      |
| **M05** | Producer-Scoped Guidance · agent docs                             | five checks, 20 points each: (a) `llms.txt` has a `## Producers` section naming both routes; (b) every runtime-only gotcha in `llms.txt` carries `[runtime-only]` (prorated over the lines that mention lifecycle, `name=`, `[data-block]`, `configs` string or markup); (c) pattern cards' `Lifecycle:` and `Markup skeleton` lines marked (prorated over cards); (d) `llms-patterns.txt` skeleton lines marked (prorated); (e) `llms-blocks.txt` exists and `llms.txt` points at it      | movable                                                                      |
| **M06** | Silent-Failure Surfaces · validation inputs for the bridge        | four surfaces, 25 points each, prorated: (a) utility classes with declarations in `osui.utilities.json` over classes discovered (reuses `lib/utilities.mjs`); (b) `--osui-*` knobs named in `llms-tokens.txt` over knobs declared in the compiled component CSS; (c) icon libraries documented in `osui.icons.json` over libraries the SCSS icon partials declare; (d) static entities documented in `osui.enums.json` over static entities referenced by block parameters in the snapshot | movable                                                                      |

Gate rules: none beyond the suite defaults (`maxDrop 1`, `maxEvalDrop 3`). M01 does not declare `no-decrease`, because a new Forge release legitimately adds blocks the manifest does not have yet; the measurement-coverage rule already catches a manifest that stops covering blocks.

Scoring lives in exported pure functions: `scoreBlockFacets`, `scoreCrosswalk`, `scorePrecision`, `scoreCard`, `scoreGuidance`, `scoreSurfaces`. Each metric's `compute` only loads inputs, maps rows and calls them.

## 7. Wiring

- `evals/suites.mjs`: entry `{ id: 'model', name: 'Model bridge', indexName: 'Model Bridge Readiness Index', idPrefix: 'M', describe: 'how well the library serves the Model team\'s bridge, which composes OutSystems UI as OML blocks', metrics, maxDrop: 1, maxEvalDrop: 3, tone: 3 }`.
- `evals/dashboard/index.html`: `.t3` colour slot (and the `.heat th.t3 button` rule); `dashboard.mjs` `tone()` uses `% 4`.
- `evals/tests/suites.test.mjs`: expected ids `['ai', 'enterprise', 'utilities', 'model']`; the "ai and enterprise leave utilities alone" assertion unchanged.
- `evals/lib/inputs.mjs`: `MEASURED_DIRS` gains `evals/model`, with `evals/model/metrics/`, `evals/model/lib/`, `evals/model/tests/` and `evals/model/README.md` excluded (only snapshot and schema files count).
- `evals/README.md`: suite row, "Classifying a component" gains the `block` field, a "Block snapshot" section with the exporter command and contract pointer.
- `evals/model/README.md`: the suite's question, each eval's band, how to refresh the snapshot, what moves each eval.
- `docs-internal/adr/ADR-0015-model-bridge-readiness-suite.md` and `docs-internal/ai-friendliness/2026-10-02-model-bridge-eval-suite-design.md` (this document, trimmed to the repository's voice).
- `package.json`: no new scripts; `npm run evals -- --suite model` already works through the registry.

## 8. Error handling

- Missing snapshot: every model metric reports `score 0`, `summary: 'no evals/model/osui.blocks*.json snapshot'`, and the per-block rows are empty; the suite still runs (the first baseline is honest, not an exception).
- Snapshot that fails the schema test: `npm test` fails with the path of the first violation; metrics are not responsible for validation.
- Registry `block` entry naming an unknown block, parameter or prop: `validateRegistry` reports it and `tests/registry.test.mjs` fails; the doctor prints the correction.
- Generator run without a snapshot: `llms-blocks.txt` contains a single line stating that no snapshot is present, the enums manifest is empty, and `llms.txt` keeps its producer section (M05 can still move without the OML).
- Token counting uses the existing `lib/tokens.mjs`; a card parse that finds no sections yields rows scored 0 with the hint "card missing".

## 9. Testing

TDD per module; tests live in `evals/model/tests/` and `tests/` (generator):

- `snapshot.test.mjs`: schema validator accepts the committed file and rejects fixtures missing `version`, a block without `flow`, a parameter with an unknown `typeKind`.
- `m01.test.mjs` … `m06.test.mjs`: pure scoring with synthetic inputs (empty, partial, complete), non-public blocks not applicable, missing manifest → 0, band edges (250 → 100, 600 → 0).
- `crosswalk.test.mjs`: registry wins over hints; a hint naming two APIs links nothing; `paramMap` validation errors.
- `tests/ai-docs.test.mjs` additions: block cards within 250 tokens on the committed snapshot; recipes contain `SourceBlock:` / `data-source=`; `[runtime-only]` markers present on every pattern card; enums manifest lists every referenced static entity; icons manifest non-empty for both libraries.
- `tests/suites.test.mjs`, `tests/inputs.test.mjs`, `tests/registry.test.mjs`, `tests/doctor.test.mjs`: updated for the new suite, measured dir and field.
- End-to-end: `npm run evals -- --label model-0` produces the fourth table; `npm run evals:gate` passes against the previous baseline (the new suite has no baseline yet, so the gate skips it on the first run, as it does for any suite absent from the baseline); `npm run docs:ai:check` and `npm run evals:dashboard:page -- --check` pass.

## 10. Delivery plan (summary; the implementation plan is the next artefact)

1. Exporter (outside the repo) and the first snapshot; schema and validator; `MEASURED_DIRS`.
2. Registry `block` field, validation, doctor proposals; hand-confirmed entries for the 33 patterns from the exporter hints.
3. Generator: blocks manifest, cards with recipes, enums, icons, producer section and markers; freshness.
4. Metrics M01–M06 with tests; suite entry; dashboard slot; README/ADR/design note.
5. First full run (`model-0`) as the suite's baseline, then one loop iteration (M01/M04/M05 generated artefacts) recorded as `model-1`.

Each step is a separate commit proposed for confirmation; nothing is pushed without a go-ahead.

## 11. Risks and open points

- **O11 module.** Only the ODC OML is on this machine. The schema supports a second file; until it exists the suite measures ODC blocks. Stated in the README.
- **Hints quality.** Some blocks call several APIs (a block with an inner pattern) or none (CSS-only blocks). The registry confirmation step exists for exactly these; the doctor lists ambiguous hints.
- **Card budget vs. completeness.** A block with many parameters (Dropdown, DatePicker) may not fit 250 tokens with descriptions. The renderer truncates descriptions to the first sentence and lists enum values only when ≤ 8; M04's band (250 → 100, 600 → 0) tolerates the long tail without hiding it.
- **Model API access.** The exporter needs the private Azure feed and a machine with .NET 10; documented as a local step. CI never needs it.
- **Dashboard colour slot.** Adding `.t3` is a template change; the page test (`dashboard-page.test.mjs`) renders it, so a missing slot fails visibly.
