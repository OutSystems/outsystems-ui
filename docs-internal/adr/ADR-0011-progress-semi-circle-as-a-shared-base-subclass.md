# ADR-0011: Progress Semi-Circle as a subclass of a shared circle base

## Status

Accepted

## Context

A Progress Semi-Circle pattern was requested: a 180° upper gauge with the arc across the top, a flat
diameter at the bottom, the fill running clockwise from the left, and the content sitting in the
opening on the diameter. Its box is `Size` wide and `Size / 2` tall. The behaviour contract is full
API parity with Progress Circle (`ProgressAPI` with type `SemiCircle`: progress, thickness, shape,
colors, gradients, extended class, accessibility).

Progress Circle already implements almost everything the semi-circle needs — SVG circle geometry,
dash math, resize observation, the CSS variable contract, and SVG gradient creation — but as one
concrete class. The hard constraint on this work: **Progress Circle's runtime output must not
change** (single-number `stroke-dasharray`, square box, `rotate(-90deg)`, identical gradient
vectors), because applications and the E2E suite depend on it.

Three geometry/behaviour problems surfaced during implementation and their resolutions are part of
this record:

1. Painting the arc with an SVG `<circle>` leaves the invisible lower half of the circle in the
   layout, spilling over following content.
2. Auto-sizing against the parent **height** self-feeds in content-sized containers: the gauge is
   the parent's content, so every growth re-triggers the resize observer and the gauge ramps up.
3. Linear gradient vectors were hardcoded for the circle's `rotate(-90deg)`. Under the semi-circle's
   `rotate(180deg)` plus clipping, the color ramp lands mostly in the hidden half of the bounding
   box, so an applied gradient is invisible.

## Decision Drivers

-   Zero behaviour change for Progress Circle (dash values, box, rotation, gradient output).
-   Full API parity for the semi-circle without duplicating ~550 lines of circle logic.
-   One pattern, one class: platform resolution by `ProgressFactory` type, per ARCHITECTURE.md.
-   Classic theme must receive the same visual (hand-ported compiled CSS snapshots).
-   Code as simple as possible: differences expressed as data (hooks), not as `if (semi)` branches.

## Considered Options

-   Option 1 — Extract `AbstractCircleProgress` and subclass it for both patterns
    -   Pros: single implementation of dash math, resize observation, CSS vars, and gradients; the
        differences reduce to five small hooks; the circle's outputs stay byte-identical because its
        hook values reproduce its previous literals.
    -   Cons: one more abstraction layer; the base lives in `Circle/` so the folder hosts two files.
-   Option 2 — Copy Progress Circle into a standalone SemiCircle pattern
    -   Pros: no risk to the circle; no new abstraction.
    -   Cons: ~550 duplicated lines whose dash/gradient/resize logic would drift; every circle fix
        would need manual mirroring.
-   Option 3 — Add a "semi" mode/config to Progress Circle itself
    -   Pros: smallest file count.
    -   Cons: runtime `if (mode)` branches in dash math, sizing, and CSS; a config change could alter
        the circle's output, violating the no-change constraint; Service Studio needs a distinct
        block anyway.

## Decision Outcome

Chosen option: "Option 1", because it is the only option that gives full parity without duplication
while keeping Progress Circle's output provably unchanged (its hook implementations return exactly
the literals the old code used).

The shared base `OSFramework.OSUI.Patterns.Progress.AbstractCircleProgress` (in `Pattern/Progress/Circle/`)
owns the resize observer, dash math, CSS variable writes, accessibility wiring, and SVG gradient
creation. Subclasses provide five hooks:

-   `getSweepRatio()` — fraction of the circumference painted: `1` (circle) vs `0.5` (semi). Sweep 1
    keeps the single-number `stroke-dasharray`; sweep 0.5 emits the `"arc arc"` pair with
    `stroke-dashoffset = arc × (1 − progress / 100)`.
-   `fitToParent(parentWidth, parentHeight)` — auto-size rule. The circle fits the smaller parent
    edge (unchanged). The semi fills the parent **width only**: reading the height self-feeds in
    content-sized containers (problem 2), so the height never constrains an auto-sized semi; the
    `Size` parameter does.
-   `getLinearGradientCoords(gradientType)` — linear gradient vectors in the SVG's pre-rotation unit
    box. Each pattern compensates for its own CSS rotation; the semi's vectors additionally span only
    the visible upper half-box so the whole color ramp lands on the arc (problem 3). The circle's
    values are the previous hardcoded literals.
-   `getContentClass()` / `getProgressPathClass()` — per-pattern CSS classes.

Geometry (problem 1) is solved by clipping rather than by an arc path: the root is
`Size × Size / 2` with `overflow: hidden`, the container is absolutely positioned at `height: 200%`,
and the paths rotate `180deg` so the painted half-circumference is the top arc. The content anchors
near the diameter (`top: 62%`). This keeps the `<circle>` + dash approach shared with Progress
Circle instead of introducing path-data generation. The semi also fixes the invalid
`transition: stroke-dashoffset 0` (unitless zero drops the declaration, falling back to `all` and
animating the radius) by declaring `0s`; the circle's rule was left untouched.

The classic theme receives a hand-applied port of the semi-circle block in both compiled snapshots
(`classic-theme/O11.OutSystemsUI.css` and `ODC.OutSystemsUI.css`, byte-identical blocks, no
`--token-*`, flat `var()` fallbacks), logged in `classic-theme/README.md` per the established
procedure. The Service Studio design-time preview script lives in the `outsystems-ui-preview`
repository and must set `--progress-circle-size` explicitly — the semi root is sized by that
variable alone, unlike the circle whose container flows.

Positive consequences:

-   A circle-family fix lands once in the base and serves both patterns.
-   The per-pattern differences are small, named, and testable (sweep, fit, gradient vectors).
-   Pre-existing defects found on the way were fixed: Progress Circle never set `progressType`
    (user-facing "Progressundefined" in gradient errors) and the invalid unitless transition.

Negative consequences:

-   The semi-circle's auto size ignores the parent height; a height-constrained layout must set the
    `Size` parameter explicitly.
-   The clipped-square approach keeps an invisible lower half inside the (hidden) overflow box, so
    absolute positioning inside the pattern must reference the root, not the container.

## Links

-   `src/scripts/OSFramework/OSUI/Pattern/Progress/Circle/AbstractCircleProgress.ts`
-   `src/scripts/OSFramework/OSUI/Pattern/Progress/SemiCircle/`
-   `src/scss/04-patterns/05-numbers/progress/_progresssemicircle.scss`
-   `classic-theme/README.md` — "Hand-applied ports" entry for the semi-circle
-   ARCHITECTURE.md — factories and the public-API envelope tenets

## Date

2026-10-11
