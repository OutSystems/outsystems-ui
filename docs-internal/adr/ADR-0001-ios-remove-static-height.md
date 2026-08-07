<!-- This is an ADR template, follow the same convention for future ADRs -->

# ADR-0001: Replace JS-forced pixel viewport height with CSS viewport units on iOS

## Status

Proposed

## Context

OutSystems UI forces the layout viewport height on native mobile (phone/tablet) apps to a fixed
pixel value, captured once at load/orientation-change time, instead of letting CSS track the real
visible viewport continuously.

Specifically:

- `LayoutPrivateBodyCssVars.ts` (`_isPhoneOrTablet()`) writes an inline `document.body` style,
  `--viewport-height = window.innerHeight + 'px'`, whenever `body` has the `phone`/`tablet` class.
- `_setCssVars()` calls `_isPhoneOrTablet()` on every native-mobile run, and
  `LayoutPrivateOnOrientationChange.ts` re-runs the whole `CssBodyVariables.Set()` chain 500ms after
  an orientation-change event — re-snapshotting the same static px value.
- `_ios-bounce.scss` consumes it: `.ios .layout-native.ios-bounce:not(.hide-header-on-scroll) .main
  { max-height: var(--viewport-height, 100vh); }`. Because the inline px value always wins over the
  SCSS fallback, this snapshot governs the layout at all times between orientation-change events.

On iOS this static snapshot goes stale whenever the *visible* viewport changes without an
orientation-change event firing — URL/tool bar show/hide, safe-area settling, keyboard appearance,
split view — which clips or overflows content in the `ios-bounce` native layout.

This pixel-forcing hack originally worked around old iOS/cordova environments where `100vh` was
unreliable. It surfaces as a live bug now because the cordova/iOS hardcoded-code removal scheduled
for OSUI v8 (2026, tracked under the parent epic
[ROU-12922](https://outsystemsrd.atlassian.net/browse/ROU-12922)) changes how the visible viewport
behaves underneath it.

During codebase exploration for this change, a second, undocumented consumer of
`--viewport-height` was found: `_dropdown-serverside.scss:535`
(`.phone .osui-dropdown-serverside__balloon--has-not-search .osui-dropdown-serverside__balloon-container`),
scoped to *all* phones (Android and iOS), with **no fallback value**. Removing the JS that sets
`--viewport-height` without also touching this rule would silently invalidate its `max-height`
`calc()` on every phone, not just iOS — a regression outside the original ticket's stated scope.

A separate exploratory-testing finding (Confluence, "MABS 13 cordova-ios 8 Ensemble", 2026-06-16)
independently surfaced the same underlying issue and proposed a *different*, complementary fix:
changing the global layout reset in `_layout.scss:6-12`
(`html, body, #reactContainer, #transitionContainer, .screen-container { height: 100%; }`) so
`html` gets a real viewport-based height instead of `100%`.

## Decision Drivers

- The `ios-bounce` layout's `.main` element must track the real, current visible viewport height at
  all times, not a stale load/orientation-change snapshot.
- Existing body-level behaviors driven by the same code path (dark mode detection, high-contrast
  detection, non-web-app header/footer sizing) must continue to work unchanged.
- `npm run build` and `npm run lint` must pass clean for both O11 and ODC platform targets.
- The public `OutSystems.OSUI.*` API surface must not change.
- OutSystems UI only supports `viewport-fit=cover` (no `viewport-fit=auto`/`contain` mode is
  supported), so `100vh` already reflects the full visual viewport; dynamic viewport units
  (`dvh`/`svh`/`lvh`) are not required to solve the reported defect.
- Fix must not regress the newly-discovered second consumer (`_dropdown-serverside.scss`) on any
  phone platform, even though that consumer wasn't part of the originally reported defect.

## Considered Options

- **Dynamic viewport unit (`100dvh`/`100svh`) vs plain `100vh`**
    - `100dvh` (dynamic viewport height, grows/shrinks live with browser/URL-bar visibility)
        - Pros: matches the previous "fill visible area" intent; layout expands to use all
          available space once browser chrome hides.
        - Cons: content can still be transiently obscured while browser UI is visible/transitioning;
          not needed given OutSystems UI's `viewport-fit=cover`-only support.
    - `100svh` (small viewport height, always the smallest possible viewport)
        - Pros: content is never obscured by browser UI, regardless of chrome state.
        - Cons: wastes available space when browser chrome is hidden; behavior change from what the
          layout previously aimed for; not needed given OutSystems UI's `viewport-fit=cover`-only
          support.
    - `100vh` (status quo unit, no dynamic tracking)
        - Pros: no new CSS feature dependency; consistent with OutSystems UI only ever running under
          `viewport-fit=cover`, where `100vh` already reflects the full visual viewport.
        - Cons: none identified for this defect — the root cause was the JS pixel-forcing, not the
          `100vh` unit itself.

- **Keep or drop the `--viewport-height` CSS custom property**
    - Drop it, use `100vh` directly in SCSS
        - Pros: simplest; no dead variable left behind.
        - Cons: removes a CSS override hook, however unused today, that a consuming app could
          theoretically rely on.
    - Keep it as `var(--viewport-height, <fallback>)`
        - Pros: preserves a CSS override hook for consuming apps; smaller diff to the SCSS fallback
          shape already in place; no change to `GlobalEnum.CSSVariables.ViewportHeight`.
        - Cons: variable is never set by any TS code after this change, so it's dead weight unless a
          future consumer actually uses it.

- **Scope of the `_layout.scss` global reset finding**
    - Out of scope for this change (defer to a separate, confirmed fix)
        - Pros: minimizes blast radius to exactly what the primary root-cause analysis covered.
        - Cons: leaves a related, independently-observed defect unaddressed in the same release.
    - Include it, giving `html` its own `100vh` height for consistency with the rest of this change
        - Pros: addresses both known reports of the same underlying class of bug in one pass;
          consistent technical approach across all three touched files.
        - Cons: expands scope beyond the ticket's original technical analysis; the exploratory
          finding's author has not confirmed this specific interpretation.

- **Second consumer: `_dropdown-serverside.scss:535`**
    - Leave unchanged, accept the regression risk, document it for a follow-up ticket
        - Pros: keeps this change strictly scoped to the reported defect.
        - Cons: knowingly ships a regression (invalid `max-height` on every phone) in the same
          release that removes the JS setter.
    - Fix it in the same pass, using the same layered fallback pattern as the primary fix
        - Pros: no regression shipped; consistent fix applied everywhere `--viewport-height` is
          consumed.
        - Cons: touches a file outside the originally reported defect's investigation.

## Decision Outcome

Chosen options:

- **Plain `100vh`**, with no `dvh`/`svh` layering, because OutSystems UI only supports
  `viewport-fit=cover` — under that mode `100vh` already reflects the full visual viewport, so
  dynamic viewport units add a new CSS feature dependency without solving anything the root-cause
  analysis identified.
- **Keep `--viewport-height`** as `var(--viewport-height, 100vh)` in all three touched SCSS
  locations, preserving a CSS override hook even though no TS code sets it after this change.
- **Include the `_layout.scss` global reset fix**, splitting `html` out of the shared `height: 100%`
  rule and giving it its own `height: 100vh;`, for consistency with the rest of this change.
- **Fix the `_dropdown-serverside.scss:535` second consumer** in the same pass, applying the
  identical layered-fallback pattern inside its `calc()`.

Remove the JS pixel-forcing entirely: delete `_isPhoneOrTablet()` and its call site in
`_setCssVars()` (`LayoutPrivateBodyCssVars.ts`), leaving dark-mode detection, high-contrast
detection, and non-web-app header/footer sizing untouched. `LayoutPrivateOnOrientationChange.ts` is
left unchanged — it is the only caller of `CssBodyVariables.Set()` in the repo, and its other
responsibilities (iPhoneX reclassification, desktop-class fixup) are independent of the
viewport-height logic.

### Changes to be made

| File                                                                                          | Change |
| ------------------------------------------------------------------------------------------------| -------|
| `src/scss/02-layout/_ios-bounce.scss`                                                          | No change — `.main`'s `max-height` already had the `var(--viewport-height, 100vh)` fallback (line 15) before this ticket. |
| `src/scripts/OSFramework/OSUI/Pattern/Dropdown/ServerSide/scss/_dropdown-serverside.scss`      | Add a `var(--viewport-height, 100vh)` fallback inside the `calc()` at line 535 (`--has-not-search` balloon `max-height`), which previously had none. |
| `src/scss/02-layout/_layout.scss`                                                              | Split `html` out of the shared reset (lines 6-12); give it `height: 100vh;` (OutSystems UI only supports `viewport-fit=cover`, so no `dvh` layering is needed), keep `body, #reactContainer, #transitionContainer, .screen-container { height: 100%; }`. |
| `src/scripts/OutSystems/OSUI/Utils/LayoutPrivateBodyCssVars.ts`                                | Delete `_isPhoneOrTablet()` (lines 48-55) and its call site in `_setCssVars()` (lines 64-76). No other method changes. |
| `src/scripts/OutSystems/OSUI/Utils/LayoutPrivateOnOrientationChange.ts`                        | No change (verified as safe — no other dependency on the viewport-height re-`Set()`). |
| `src/scripts/OSFramework/OSUI/GlobalEnum.ts`                                                   | No change — `CSSVariables.ViewportHeight` (line 71) is kept as the documented CSS variable name, even though no TS sets it after this change. |

Positive consequences:

- iOS `ios-bounce` layout no longer clips/overflows because of a stale, JS-forced pixel snapshot
  that always won over the CSS fallback — the CSS `100vh` fallback now actually applies, which is
  sufficient given OutSystems UI's `viewport-fit=cover`-only support.
- The previously-undiscovered `_dropdown-serverside.scss` regression is prevented instead of shipped.
- No new CSS feature dependency (`dvh`/`svh`) is introduced, so there's no minimum-browser-version
  floor to track for this fix.
- No change to the public `OutSystems.OSUI.*` API surface.
- Consuming apps retain a (currently unused) CSS override hook via `--viewport-height`.

Negative consequences:

- `GlobalEnum.CSSVariables.ViewportHeight` becomes dead code from the TS side (no setter references
  it anymore) — accepted as low-risk since it's still meaningful documentation of the CSS variable
  name and removing it isn't required by any acceptance criterion.
- The `_layout.scss` change expands scope beyond the ticket's original root-cause analysis, and its
  specific interpretation (a real `height: 100vh` on `html` vs. the exploratory finding's proposed
  static `100vh`) has not yet been confirmed with the finding's author (Gonçalo Martins) — though
  in this case the two interpretations are now identical.
- No automated test coverage exists locally for this code path; verification relies on manual
  iOS device/simulator testing and the separate `outsystems-ui-tests` E2E repo.

## Links

- JIRA: [ROU-12349](https://outsystemsrd.atlassian.net/browse/ROU-12349) (Bug, High, In Progress)
- Parent epic: [ROU-12922](https://outsystemsrd.atlassian.net/browse/ROU-12922) "OutSystems UI - MABS 13"
- Cloned by: [ROU-12862](https://outsystemsrd.atlassian.net/browse/ROU-12862) (Mobile UI, out of scope, separate repo)
- Spec: `specs/ROU-12349-ios-viewport-height/spec.md`
- Plan: `specs/ROU-12349-ios-viewport-height/plan.md`
- Confluence: "MABS 13 cordova-ios 8 Ensemble - 2026-06-16 - Plan" (finding #1, cites ROU-12349)
- CSS reference: dynamic viewport units (`dvh`/`svh`/`lvh`) — MDN "Viewport-percentage lengths"

## Date

2026-07-29
