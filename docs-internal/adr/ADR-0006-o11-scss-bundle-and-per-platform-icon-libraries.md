<!-- This ADR documents re-enabling the O11 SCSS bundle for the new theme and the ownership boundary between per-platform icon libraries and shared component partials -->

# ADR-0006: O11 SCSS Bundle and Per-Platform Icon Libraries

## Status

Accepted

## Context

OutSystems UI ships one JS bundle and one CSS bundle per platform (**O11**, **ODC**). The split is implemented in `gulp/`:

- `excludeFromTsTranspile` removes ODC-only sources from the O11 TypeScript program (`Utils/PreviewInDevices/**`, `Utils/IconLibrary.ts`);
- a post-compile string replacement injects `Constants.OSPlatform` and the bundle header;
- a `"platform"` key on any asset in `gulp/ProjectSpecs/ScssStructure/*.js` includes that partial only in the matching platform's generated entry file.

During the migration, Phase 15b narrowed SCSS generation to **ODC only** (`scssPlatformTarget`) so the team did not have to maintain two themes mid-flight. The gate was documented as reversible. The TS/JS split was never disabled.

Re-enabling O11 exposed the state of `_icon-library-o11.scss`: frozen out of compilation since Phase 15, it had missed the `@use` migration (so it no longer compiled) and still carried the **pre-token** iconography, while every component glyph rule had meanwhile been centralised into `_icon-library-odc.scss`.

The two files are not symmetric, and the asymmetry is meaningful: **the icon-library switching feature does not exist on O11.** `IconLibrary.ts` is excluded from the O11 JS bundle, so nothing can ever apply the `.iconLibrary-phosphor` class there.

## Decision Drivers

- O11 apps must receive the new theme, not the legacy look.
- O11 must not ship dead machinery (Phosphor variants it can never activate).
- The new theme's shared partials must render correctly on both platforms.
- Divergence from `dev`'s structure should be minimised, so future reconciliations (ADR-0005) stay cheap.
- Duplication between the two icon partials is a drift hazard and must be bounded.

## Considered Options

### A. Which SCSS does O11 get?

- **Option 1: ship `_icon-library-odc.scss` to both platforms** — Pros: one file, no duplication; its `:root` defaults are FontAwesome, which is what O11 needs. Cons: O11 would carry the entire `.iconLibrary-phosphor` block as permanently inert rules, and the structure would diverge from `dev`, making every future merge of that file a manual reconciliation. *(Attempted first, then reverted.)*
- **Option 2: keep a dedicated `_icon-library-o11.scss`, mirroring `dev`'s structure** — Pros: matches `dev`, no dead machinery shipped, each platform's iconography is explicit. Cons: two files to keep in step.

### B. Where do the shared theme's `var(--osui-icon-*)` reads resolve on O11?

The new theme draws several glyphs indirectly (pagination chevrons, dropdown/server-side/VirtualSelect selected checkmarks, submenu arrow, picker Service-Studio previews) — something `dev`'s O11 never had to resolve, because those rules did not exist there.

- **Option 1: inline literals into each shared partial per platform** — Cons: platform conditionals leak into component files.
- **Option 2: give the O11 partial a `:root` block of *static* FontAwesome `--osui-icon-*` values** — Pros: shared partials stay platform-agnostic; O11 needs no switching logic. Cons: the variable names imply a switching mechanism that O11 does not have (mitigated by a comment).

### C. Where does per-platform *behaviour* live?

- **Option 1: in each icon library** (the shape `dev` uses for the submenu arrow) — Cons: identical rules duplicated in two files; if one platform's copy is edited, the other silently drifts.
- **Option 2: in the shared component partial** — Pros: single definition; impossible to drift. Cons: requires recognising that a rule is behaviour rather than iconography.

## Decision Outcome

**A → Option 2; B → Option 2; C → Option 2.**

- `o11` restored to `scssPlatformTarget`; `O11.OutSystemsUI.{scss,css}` is generated and compiled again, carrying the token theme. No change was needed on the TS side.
- O11 keeps its own platform-tagged `_icon-library-o11.scss`: `dev`'s O11 iconography, tokenized and `@use`-migrated (CSS-border dropdown chevron, CSS-triangle sortable icon — retaining this branch's `currentColor` refactor, base64 search magnifier, FontAwesome literals for VirtualSelect/DropdownServerSide, picker preview vars), plus the static `:root` `--osui-icon-*` block from B.
- Pseudo-element glyphs that are ODC-only on `dev` (alert, chat status, password policy, splide/flatpickr/photoswipe arrows) remain ODC-only: verified against `dev`'s compiled O11 output, which uses markup icons and vendor-native arrows there.
- **New rule, from C: an icon library may not carry behaviour.** The submenu arrow's `display: none` + `.osui-submenu--is-dropdown` reveal (ROU-12882) moved out of `_icon-library-odc.scss` into the shared `_submenu.scss`. Icon libraries own only glyph concerns (`content`, `font-family`, icon geometry).

Positive consequences:

- Both platforms build the token theme; the compiled O11-vs-ODC difference is confined to the platform-tagged sections (~635 lines; `dev`'s own equivalent is ~1015).
- Rule C was not theoretical: it was written **because** the ROU-12882 fix had landed inside the ODC icon library, and O11 — which does not include that file, and whose partial had (correctly) dropped the submenu section to avoid double-drawing the chevron — was rendering the submenu arrow unconditionally, silently reintroducing the bug the fix had closed. Only a compiled-bundle comparison surfaced it.

Negative consequences:

- Two icon partials must be kept in step; one drift bug has already been caught this way.
- The `-odc` filename is now inaccurate (it is the ODC-only library, not an "ODC-flavoured" one); renaming it to `_icon-library.scss` was deferred to avoid churn before PR #1206 and is now unblocked.

## Links

- `gulp/ProjectSpecs/DefaultSpecs.js` (`platformTarget` / `scssPlatformTarget` / `excludeFromTsTranspile`)
- `gulp/ProjectSpecs/ScssStructure/Root.js` — the platform-tagged icon-library assets
- `specs/plan.md` Phase 15b — the original gate this reverses
- ADR-0005 — the reconciliation that exposed the submenu regression

## Date

2026-08-12
