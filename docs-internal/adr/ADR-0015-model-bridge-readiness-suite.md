# ADR-0015: Model bridge readiness suite and block-level agent docs

## Status

Proposed (branch `agents/osui-validate-evals`)

## Date

2026-10-02

## Context

The Model team's bridge (`OutSystems.ModelExtensions`: the OpenUI, HTML and TSX dialects over the Model API)
composes OutSystems UI as **OML blocks by reference** — `Block(SourceBlock: Interaction/Carousel, …)` with the
block's input parameters, placeholders and events — and never calls the browser runtime
(`OutSystems.OSUI.Patterns.<Name>API`). The three existing suites and the generated agent docs measured and
described that runtime: component cards told an agent to emit `name="<id>"`, `[data-block]`, the
`Create → Initialize` lifecycle and a markup skeleton, which is exactly what an OML producer must not do, and
nothing in the repository described a block's signature, the static-entity values its parameters take, the
icon names, or which runtime pattern a block drives. The assessment of 2026-10-01 (PR #1277 against the
bridge) named this the main gap for agentic OML generation.

Constraints: the loop must stay deterministic and offline (no Model API, .NET or network at eval time), nothing
may change runtime behaviour, and the first recorded run of a new suite must be an honest "before".

## Decision Drivers

- The suite index should become the headline the loop optimises, with the same history, gate and dashboard as
  the other suites.
- One reader for the OML data, reproducible from a pinned source.
- Agent docs must tell an OML producer and a runtime producer apart.
- The platform ignores a wrong CSS class, knob, icon or enum value silently: those surfaces need allowlists.

## Considered Options

- **OML snapshot committed to the repository** (chosen): a .NET exporter outside the repository clones the
  read-only OutSystems UI module (`CloneESpace`; `LoadESpace` is refused for system modules) and writes
  `evals/model/osui.blocks.json` with pinned GitHub provenance (commit, blob SHA, SHA-256); the suite reads the
  file.
    - Pros: deterministic, offline, CI stays Node-only; the exporter's API hints (the `*API` names a block's
      JavaScript reaches through its client actions) derive the pattern ↔ block crosswalk automatically.
    - Cons: a local .NET step with the private NuGet feed; one platform (ODC) until the O11 module is exported.
- **Hand-maintained crosswalk only**: a `block` field per pattern in `evals/components.json`, no OML data.
    - Pros: no tooling. Cons: block signatures stay unverified; the manifest cannot be generated.
- **Model-team export**: the bridge's `ReferenceBlockTextualTransformer` emits the file.
    - Pros: one reader on their side. Cons: the suite scores nothing until they deliver; the schema (§4 of the
      design note) is shared so this remains possible later.
- **A `block` tier in the dashboard** for the per-block evals (rejected): blocks are not components; M01, M03
  and M04 report their own table through `present.extra`, leaving `tierSummary` and the component universe
  untouched.

## Decision Outcome

Chosen option: the committed OML snapshot, read by a fourth suite `model` (M01–M06, "Model Bridge Readiness
Index"), plus block-level generated docs:

- `evals/model/osui.blocks.json` (+ schema, validated by a test) and `evals/model` as a measured input.
- `evals/components.json` `block` links (confirmed parameter and event maps), proposed by the doctor from the
  snapshot's API hints and validated against the snapshot and the patterns.
- `docs-ai/osui.blocks.json`, `llms-blocks.txt` (one card per block, ≤ 250 tokens, OpenUI and TSX recipes),
  `osui.enums.json`, `osui.icons.json`; a **Producers** section in `llms.txt`; `[runtime-only]` markers on the
  lifecycle, markup and skeleton lines of the existing docs.
- Evals: M01 manifest completeness, M02 pattern–block crosswalk, M03 block parameter precision (moves with the
  OML), M04 card cost and recipes, M05 producer-scoped guidance, M06 silent-failure surfaces.

Positive consequences:

- `model-0` (before the generated docs) recorded 29.2; `model-1` (after one loop iteration) 93.5. The three
  other indices are unchanged.
- An OML agent can read one 200-token card per block instead of calling the bridge per block, and the bridge
  can validate class names, knobs, icons and enum values against published allowlists.
- The exporter's hints linked 31 of 33 patterns to 36 blocks with no hand lookup; `SwipeEvents` and
  `TouchEvents` are driven by no block and are not applicable.

Negative consequences:

- M03 moves only with the OutSystems UI OML (descriptions, defaults, static-entity types); its table is a
  request list for the Forge release, not something this repository can fix.
- The snapshot covers ODC; the O11 module needs a second export (same schema, `osui.blocks.o11.json`).
- Four block events have no typed runtime counterpart (Carousel `OnSlideMoved`, DatePicker/TimePicker
  `OnSelected`, RangeSlider `OnValueChange`) and stay unmapped in M02.
- `llms.txt` grew to about 1,520 tokens with the Producers section; its test budget moved from 1,500 to 1,600,
  and the pattern-card budget from 650 to 660 for the markers.

## Links

- Design note: `docs-internal/ai-friendliness/2026-10-02-model-bridge-eval-suite-design.md`
- Suite README: `evals/model/README.md`; exporter: `osui-blocks-export` (outside the repository)
- PR #1277; `OutSystems/OutSystems.ModelExtensions` branches `UI-evals`, `feature/typescript-tsx-ui-representation`,
  `feature/typescript-app-dialect-ui`
- ADR-0011 (eval suite), ADR-0013 (registries and self-describing metrics), ADR-0014 (tiers)
