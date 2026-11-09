# ADR-0013: Physical horizontal positions in FloatingContent

## Status

Proposed

## Context

FloatingContent places its block at a fixed screen position (Top/Center/Bottom, each Left, Center or Right).
The new theme merge (ROU-12872, `94747118f`) converted every horizontal position in
`_floating-content.scss` from physical `left`/`right` to the logical `inset-inline-start`/`inset-inline-end`.
In RTL those resolve to the opposite side, which caused two problems (ROU-13134):

-   Top, Center and Bottom are centered with a physical `left: 50%` and `transform: translateX(-50%)`. The
    UseMargin and visible side-menu offsets that override that `left` became `inset-inline-start`, which is
    `right` in RTL. The element ended up with both `left: 50%` and `right: ~50%` while `width: auto`, and its
    width collapsed.
-   The Left and Right positions (and their Top/Bottom variants and side-menu offsets) mirrored in RTL: Left
    rendered on the right and Right on the left. The position chosen in the app must be the position shown,
    whatever the text direction.

The classic theme, and this file before ROU-12872, use physical `left`/`right` for all of these rules and
have neither problem.

## Decision Drivers

-   A FloatingContent position is a screen position, not a text-flow position; Left means left in RTL too.
-   Keep the centering model coherent: an offset must use the same property it overrides.
-   Match the classic theme, including its side-menu behaviour.

## Considered Options

-   Option 1 — Use physical `left`/`right` for every horizontal position in the pattern
    -   Pros: Left/Right stay put in RTL; centering offsets no longer collapse the width; one file; restores
        the pre-ROU-12872 properties and matches the classic theme; the file uses one model throughout.
    -   Cons: a future "make everything logical" pass must skip this pattern.
-   Option 2 — Revert only the three centering offsets to `left`, keep the logical start/end pairs
    -   Pros: smallest change for the width collapse.
    -   Cons: Left and Right still swap sides in RTL, and the file mixes both models.
-   Option 3 — Make the centering logical (`inset-inline-start: 50%`) and flip the transform under `.is-rtl`
    -   Pros: fully logical file.
    -   Cons: Left/Right still mirror; the transform appears in several full-width/full-height combinations
        and each needs an RTL duplicate.
-   Option 4 — Option 1 plus an `.is-rtl` side-menu offset (`left: calc(50% - side-menu-size / 2)`)
    -   Pros: centers the block in the content area when the menu is on the right in RTL.
    -   Cons: a behaviour change beyond the reported bug, and it diverges from the classic theme.

## Decision Outcome

Chosen option: "Option 1". All horizontal positions in FloatingContent (Left/Right and their Top/Bottom
variants, full-width, the UseMargin offsets and the side-menu offsets) use physical `left`/`right`. Rule: in
this pattern, horizontal positions are physical and do not mirror in RTL. Option 4 was declined to keep the
classic behaviour.

### Consequences

-   In RTL, Top/Center/Bottom keep their natural width and Left/Right stay on their own side; LTR output is
    unchanged.
-   In RTL with the side menu visible, the side-menu offsets keep the classic values (offset applied from the
    left).
-   No classic-theme port is needed.

## Links

-   Jira: ROU-13134
-   Regression source: ROU-12872 (`94747118f`)
-   Fix commits: `428bf590c` (centering offsets), follow-up for Left/Right positions

## Date

2026-10-23
