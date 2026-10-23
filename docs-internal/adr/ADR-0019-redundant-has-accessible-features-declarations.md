# ADR-0019: Removing redundant `.has-accessible-features` declarations only after a browser check

## Status

Proposed

## Context

ROU-13153 asked whether styles inside `.has-accessible-features` that repeat the default value can be removed, so
that turning the class on doesn't add selectors that change nothing. The scope stays; only no-op declarations go.

A static analysis of the compiled CSS (resolved `var()` chains, default cascade winner, CSS initial values, and a
check for declarations that cancel other scoped rules) marked 21 selectors and 9 declarations as no-ops in the
light theme, dark theme and high contrast.

A browser comparison then showed that most of them do change the result. Inside the scope, a declaration with the
same value as the base rule:

-   beats unscoped state rules through the scope's extra specificity (`:hover`, the expanded dropdown, disabled,
    `.not-valid`, and component-context rules such as `.input-with-icon .form-control`). With the class on, input and
    dropdown borders don't change on hover today;
-   decides combined states through its order within the scope (checked + hover, keyboard focus + hover).

## Decision Drivers

-   No visual change in any reachable state, with or without the class, in light, dark and high contrast.
-   Keep `.has-accessible-features` as the opt-in it is today.
-   Avoid rules that only repeat the default.

## Considered Options

-   Option 1 — Remove everything the static analysis marked as a no-op
    -   Pros: removes the most selectors (30 declarations).
    -   Cons: changes hover, expanded, disabled, error and combined states in the input, checkbox, radio, dropdown,
        VirtualSelect, ServerSide and date picker.
-   Option 2 — Remove only what a browser comparison proves has no effect
    -   Pros: no change in any reachable state.
    -   Cons: a much smaller removal (5 declarations); needs a browser harness.
-   Option 3 — Leave the scope untouched
    -   Pros: no risk.
    -   Cons: keeps rules that only repeat the default.

## Decision Outcome

Chosen option: "Option 2", because it's the only one that removes duplication without changing the outcome.

Removed: the input/textarea base `border-color: var(--color-border-input)`; the carousel pagination `width`/`height`
(the WCAG `margin` stays); the action sheet `position: relative` (`.btn` already sets it); the
`.flatpickr-months .flatpickr-month:focus-visible` selector from its group; the submenu tablet/phone `outline: 0`.

Verification: before/after CSS on the 25 affected Storybook stories, class on the story root, light/dark/high
contrast, states forced through the DevTools protocol (`:hover`, `:focus`, keyboard focus as
`:focus` + `:focus-visible`, hover + keyboard focus), plus checked, disabled + checked and `.not-valid` variants,
comparing every computed property of every element and pseudo-element. A before-vs-before run showed no noise. The
only remaining difference is a text field with `:focus` and without `:focus-visible`, which browsers don't produce.

Positive consequences:

-   Five declarations that only repeated the default are gone, with no visual change.
-   The verification method is documented for future changes inside the scope.

Negative consequences:

-   Most of the scope's apparent duplication stays, because it is load-bearing: it suppresses state rules. Changing
    that is a visual decision, not a cleanup.
-   A static analysis alone is not enough to remove scoped styles safely.

## Links

-   ROU-13153; ROU-12826 and PR #1304 (`:focus-visible` migration); ADR-0018.

## Date

2026-10-23
