# ADR-0018: Dropdown search focus ring shown only on keyboard interaction

## Status

Proposed

## Context

Both Dropdown variants focus their search input every time they open, however they were opened.
Dropdown Search/Tags relies on VirtualSelect, whose `focusElementOnOpen()` focuses `$searchInput` after the
dropbox is shown. Dropdown ServerSide focuses `_balloonSearchInputElement` in `_updatePatternState()`. The
intent is that users can type to filter immediately, and that iOS can handle the keyboard and balloon height.

ROU-12826 (PR #1304) switched the new theme's focus rings from `:focus` to `:focus-visible`, so they follow
the browser's input modality. That does not work for the search input: browsers always match
`:focus-visible` on elements that accept text input, including focus moved there by script after a mouse
click. Both search ring rules also use `:focus-within`, which matches any focus. So a mouse-opened Dropdown
shows a focus ring, and `has-accessible-features` was kept `False` by default for that reason (ROU-13153).

## Decision Drivers

-   Hide the search ring when the Dropdown is opened with a pointer, and keep it for keyboard users (WCAG 2.4.7).
-   Keep the current open behaviour: the search input is still focused on open (type to filter, iOS handling,
    existing E2E flows that click and then type).
-   Do not patch VirtualSelect.
-   Keep the change scoped to the Dropdown. It is the only pattern that focuses a text input on open.

## Considered Options

-   Option 1 — Do not focus the search input when the Dropdown is opened with a pointer
    -   Pros: the ring problem disappears at the source.
    -   Cons: behaviour change for every app (no type to filter after a click; no mobile keyboard); needs a
        patch or override of VirtualSelect's `focusElementOnOpen()`; breaks E2E flows that click and then type.
-   Option 2 — Framework-wide input-modality tracker (`pointerdown`/`keydown` on `document`, attribute on `<html>`)
    -   Pros: reusable by any pattern.
    -   Cons: a new global module and global listeners for a Dropdown-only problem; needs capture-phase listeners,
        which `AbstractListener` declares (`useCapture`) but never passes to `addEventListener`.
-   Option 3 — Per-Dropdown keyboard flag and state class
    -   Pros: built on each Dropdown's own events and lifecycle; follows the existing `osui-*--is-*` state-class
        pattern; no global code, no vendor patch, no behaviour change.
    -   Cons: logic in two places (ServerSide and the VirtualSelect provider); the ring is opt-in, so a keyboard
        path that is not detected would show no ring.

## Decision Outcome

Chosen option: "Option 3", because it fixes the ring without changing behaviour or patching the vendor, and keeps
the logic inside the pattern that has the problem.

Each Dropdown keeps a `_isKeyboardInteraction` flag and toggles a class through `_setKeyboardInteraction()`.
The search ring rules only paint while that class is present.

-   ServerSide: class `osui-dropdown-serverside--focus-visible` on the balloon element. It is set by the existing
    keyboard handlers (open keys on the trigger, any key on the options wrapper, navigation keys in the search
    input, option-item keypresses) and by a trigger or search input click with `event.detail === 0` (the
    keyboard's synthetic `.click()` and screen-reader activations). It is cleared by a pointer click on the
    trigger or the search input (`event.detail > 0`), and close.
-   Search/Tags (VirtualSelect): class `osui-dropdown--focus-visible` on `provider.$dropboxContainer`, because OSUI
    renders the dropbox under `<body>` (`dropboxWrapper: body`). `keydown` and `mousedown` are listened to on the
    pattern element and on the dropbox container, and `click` on both (capture phase on the dropbox container).
    Navigation keys and clicks with `detail === 0` (screen-reader activation) set the class; typing in the
    search input does not. Any pointer `mousedown` clears it. The state is re-applied after a redraw.
-   Both: the public `open()` (e.g. `DropdownAPI.Open`) of a closed Dropdown sets the flag from whether the
    focused element matches `:focus-visible`, so a keyboard-operated external button keeps the ring and a mouse
    click does not. Text fields (`GlobalEnum.CSSSelectors.TextField`) always match `:focus-visible`, so they
    never set it. An already open Dropdown keeps its current state.

Positive consequences:

-   No ring on mouse or touch open, or while typing; the ring still shows on keyboard open and navigation.
-   No change to focus behaviour, vendor code, or the E2E page objects.
-   Unblocks defaulting `has-accessible-features` to `True`, which is handled in the low-code Layout.

Negative consequences:

-   The navigation-key lists must stay complete. A missed keyboard path hides the ring for keyboard users.
-   A keyboard user in a text field whose action opens the Dropdown through the API gets no ring; telling
    keyboard from pointer there would need the global modality tracker of Option 2.
-   Two implementations to keep in sync, and the VirtualSelect side depends on `provider.$dropboxContainer`
    staying the container of the search input in future library versions.

## Links

-   ROU-13153 (this decision), ROU-12826 and PR #1304 (`:focus-visible` migration).
-   ADR-0002 (VirtualSelect; note the installed package is still 1.1.0).

## Date

2026-10-22
