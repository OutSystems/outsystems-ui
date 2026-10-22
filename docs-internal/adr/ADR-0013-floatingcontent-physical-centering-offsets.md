# ADR-0013: Physical centering offsets in FloatingContent

## Status

Proposed

## Context

FloatingContent centers its Top, Center and Bottom positions with a physical `left: 50%` and
`transform: translateX(-50%)`. The UseMargin and visible side-menu variants override that `left` with an
offset. The new theme merge (ROU-12872, `94747118f`) converted those offsets from `left` to the logical
`inset-inline-start`. In LTR that is still `left`. In RTL it is `right`, so the element ends up with both
`left: 50%` and `right: ~50%` while `width: auto`, and its width collapses (ROU-13134). The classic theme
keeps `left` in these rules and is not affected.

## Decision Drivers

-   Fix the RTL width collapse with the smallest change.
-   Keep the centering model coherent: an offset must use the same property it overrides.
-   Keep the existing side-menu behaviour that the classic theme already has.

## Considered Options

-   Option 1 — Revert the three centering offsets to physical `left`
    -   Pros: one-file, three-property change; matches the classic theme; a centered block needs no mirroring.
    -   Cons: these rules stay physical in a file that is otherwise logical, so a future "make everything
        logical" pass must not convert them alone.
-   Option 2 — Make the centering logical (`inset-inline-start: 50%`) and flip the transform under `.is-rtl`
    -   Pros: fully logical file.
    -   Cons: the transform appears in several full-width/full-height combinations; each needs an RTL
        duplicate, which is more code and more risk for no visible gain.
-   Option 3 — Option 1 plus an `.is-rtl` side-menu offset (`left: calc(50% - side-menu-size / 2)`)
    -   Pros: centers the block in the content area when the menu is on the right in RTL.
    -   Cons: a behaviour change beyond the reported bug, and it diverges from the classic theme.

## Decision Outcome

Chosen option: "Option 1". The UseMargin offsets (Center; Top/Bottom/Center) and the visible side-menu
offset (Top/Center/Bottom) use `left`. Rule: in this pattern, an offset that overrides the physical
centering must stay physical. Logical start/end pairs remain correct for the Left, Right and full-width
rules. Option 3 was declined to keep the classic behaviour.

### Consequences

-   RTL Top/Center/Bottom keep their natural width; LTR output is unchanged.
-   In RTL with the side menu visible, the centered block keeps the classic offset toward the menu side.
-   No classic-theme port is needed.

## Links

-   Jira: ROU-13134
-   Regression source: ROU-12872 (`94747118f`)
-   Fix commit: `428bf590c`

## Date

2026-10-22
