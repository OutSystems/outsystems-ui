# ADR-0020: Removing the `.has-accessible-features` scope from component styles

## Status

Proposed

## Context

Accessibility styles (focus rings, focus states and a few contrast overrides) were only applied when the layout had
the `.has-accessible-features` class, which is off by default. With it off, keyboard users had no global focus ring:
`_resets.scss` sets `:focus { outline: 0 }` for everyone and the only global ring was
`.has-accessible-features :focus-visible`. ROU-13153 removes the scope so these styles apply to every app.

ADR-0019 first removed declarations inside the scope that had no effect. This decision covers removing the scope
itself. The scope added specificity — (0,1,0), or (0,1,1) for `body:has(.has-accessible-features)` — so removing it
changes which rule wins wherever another rule targets the same element and property.

## Decision Drivers

-   Focus rings for every app by default (WCAG 2.4.7), without opting in.
-   Keep the result the class gave today wherever that was the intent.
-   Keep selectors plain, without a stand-in for the old scope.

## Considered Options

-   Option 1 — Replace the scope with an always-matching selector of equal specificity (`:root`, `:root body`)
    -   Pros: identical cascade by construction.
    -   Cons: keeps an artificial prefix everywhere; simplification is deferred.
-   Option 2 — Remove the scope and fix each cascade conflict it creates
    -   Pros: plain selectors; each conflict is handled where it happens.
    -   Cons: needs a per-rule review of conflicts.

## Decision Outcome

Chosen option: "Option 2".

-   The global ring and the link focus style keep their former specificity with a repeated pseudo-class
    (`:focus-visible:focus-visible`, (0,2,0); `a:focus-visible:focus-visible`, (0,2,1)), so later single-class rules
    that set `box-shadow`/`outline` (components, shadow utilities) or link colors do not override them.
-   `a11y-focus-shadow` and `a11y-focus-outline` set `outline` and `outline-offset` with `!important`, so library
    defaults with higher specificity (for example the carousel's Splide `:focus` outline and date picker library
    states) do not override the OSUI focus style.
-   Rules that only made sense as overrides were moved to the base or rewritten on `:focus-visible`, and plain
    `:focus` rules that would now fire on mouse click were changed to `:focus-visible`.
-   Intended behaviour changes: the app menu link `:focus` overrides (`.header a.active:focus`,
    `.app-menu-links a:focus`) are removed in favour of the global ring; the Dropdown Server Side hover and disabled
    border colors now show (they were forced to the input border color).
-   High contrast is included: the global high-contrast focus outline is `.os-high-contrast :focus-visible` with
    `a11y-focus-outline`. It has the same specificity as the global ring and comes after it, so it wins over the ring's
    `outline: none !important`. Elements whose own focus ring has a higher specificity keep that ring. The
    pattern-specific high-contrast rules (Dropdown Server Side and its items, Rating, Pagination, Overflow Menu,
    Range Slider) use the focus mixins and `:focus-visible`.
-   The focus custom properties are renamed and the focus theme roles are removed, with no aliases for the old
    names: `--osui-focus-shadow-color` → `--osui-color-focus`, `--osui-focus-shadow-gap` → `--osui-focus-gap`,
    `--osui-focus-inner-shadow-gap` → `--osui-focus-gap-inner`, `--osui-focus-shadow-width` →
    `--osui-focus-ring-width`; `--color-focus-outer` and `--color-focus-inner` are removed (the theme migration
    guide maps them to `--osui-color-focus` and `--token-border-boldest`).

Positive consequences:

-   Every app gets a keyboard focus ring and the accessibility focus styles without opting in.
-   Selectors no longer depend on a class set by the layout.

Negative consequences:

-   Breaking change for app CSS: overrides of the old focus custom properties (`--osui-focus-shadow-*`,
    `--osui-focus-inner-shadow-gap`) and of the removed `--color-focus-outer`/`--color-focus-inner` roles are silently
    ignored and must move to the new names; this needs a release note.
-   App CSS that customizes the focus `outline`/`outline-offset` of OSUI elements now needs `!important`.
-   In high contrast, the focus outline now shows on keyboard focus only and follows the focus tokens
    (`--osui-color-focus`, width and gap, with an offset) instead of `--color-focus-outer`; the Dropdown
    Server Side inset ring is thicker; the Overflow Menu link hover outline and the active Pagination button outline
    use `a11y-focus-outline` (with `!important`).
-   A focused date picker day that is today, in range and from the previous/next month keeps the library border
    color.
-   The `has-accessible-features` class is still read by scripts (VirtualSelect, `Device.HasAccessibilityEnabled`).

## Links

-   ROU-13153; ADR-0019; ROU-12826 and PR #1304 (`:focus-visible` migration).

## Date

2026-10-27
