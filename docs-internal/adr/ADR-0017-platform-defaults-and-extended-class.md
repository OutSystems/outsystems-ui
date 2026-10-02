# ADR-0017: Platform defaults for block parameters; ExtendedClass is Text on purpose

## Status

Proposed (branch `agents/osui-validate-evals`)

## Date

2026-10-02

## Context

The block evals (ADR-0015, ADR-0016) read the OutSystems UI OML snapshot. Of the 264 optional block
parameters, 122 declare no default in the OML, and M03 asked the Forge team to "default" each of them while the
block cards and recipes showed nothing for them. Every OutSystems data type has a platform default
(Boolean `False`, Integer `0`, Decimal `0.0`, Text `""`, Date `#1900-01-01#`, Time `#00:00:00#`, Date Time
`#1900-01-01 00:00:00#`, an identifier `NullIdentifier()`, a structure with every attribute at its default, an
empty list), and an optional parameter that declares none takes it at runtime. The request list was asking
the OML to repeat what the platform already guarantees.

Every block also offers `ExtendedClass`, a Text parameter that carries CSS utility classes. M03 counted its 78
occurrences as free Text and asked to "type ExtendedClass as a static entity, structure or number", which is
wrong: it is Text by design and its vocabulary is `llms-utilities.txt`.

## Decision

1. `evals/model/lib/defaults.mjs` states the platform default of a parameter from its data type
   (`platformDefault`) and settles a parameter's default (`withPlatformDefault`): the OML's when declared
   (`defaultSource: "oml"`), else the platform's for an optional parameter (`"platform"`), none for a required
   one. The OML snapshot is not changed.
2. The generated block manifest (`docs-ai/osui.blocks.json`) and cards (`llms-blocks.txt`) carry the settled
   default and its source for every optional parameter. Recipes use a default only when it is an expression
   (basic types and identifiers); a structure, list or binary default keeps `…`.
3. The Text parameters that are Text on purpose are excluded from the free-Text check (`TEXT_ON_PURPOSE` in
   `evals/model/lib/snapshot.mjs`), each with the reason the manifest carries as `textOnPurpose`:
   `ExtendedClass` (CSS utility classes); `MenuId`, `ScrollToWidgetId`, `WidgetId`, `ItemId` (the identifier
   of another element in the DOM); `Title`, `Group`, `Prompt`, `Name`, `Password` (free text shown as is);
   `Size`, `Height`, `Width` (a measure with its unit, such as `120px` or `70%`); `DateFormat`, `TimeFormat`
   (a text mask); `SVGCode` (the content of an SVG); `ImageURL`, `URL` (a URL). The list is by name and applies to Text
   parameters only. Binary Data is a precise type: binary content is what it is.
4. M03 weighs descriptions 60 and precise types 40; the defaults term is gone because it is settled by the
   platform. The per-block table still lists how many optional parameters take the platform default. M01's
   parameter facet is complete once a parameter is typed and described.

## Consequences

- The Forge request list (M03's table) names only what the OML must change: descriptions and the free-Text
  types not on the allowlist. After the allowlist no free-Text parameter remains in the current OML; the check
  stays for the next release.
- M03 moves from 74.8 under the previous weights; the run `platform-defaults` is the new baseline.
- Block cards grow by one default per optional parameter; the 250-token budget still holds (M04 measures it).
- A platform default is a statement about the runtime, not about the OML: the manifest keeps the source so
  a reader can tell them apart.

## Links

- ADR-0015 (model bridge suite), ADR-0016 (block universe)
- `evals/model/README.md`, `evals/model/lib/defaults.mjs`
- OutSystems reference: Basic data types (default values)
