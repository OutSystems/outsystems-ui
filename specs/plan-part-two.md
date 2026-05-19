# Part Two: Component CSS Implementation Checklist

**Goal:** Make every component's CSS match the design review at
<https://jessicamendesos.github.io/jess-ui-review/proposed/showcase.html>.

This document is a flat, component-by-component checklist. Each item maps a
single property change to the exact `$token-*` variable to use (or marks a
hardcoded-by-design value). Items are derived directly from the design review
pages; nothing here is speculative.

Work in `src/scss/` (widgets, layout, pattern SCSS) and the pattern `scss/`
files. All token values are read from `src/scss/tokens/_variables.scss`.

**Per-component review order:** For each component, check all of the following in one pass:

1. Token swaps (values → `$token-*`)
2. A11y (`.has-accessible-features` block — focus rings, outline tokens)
3. RTL (`.is-rtl` block — logical properties, direction)
4. Transitions (swap hardcoded `ms`/curve values to `$token-transition-*`; replace `transition: all` with explicit property lists)
5. TS/JS inline styles (grep pattern TS files for hardcoded style values set via `style.*=`, `setProperty`, `classList` with colour/size literals — replace with token CSS custom properties where possible)

---

## Missing tokens (not in `outsystems-design-tokens` package)

| Missing token                                                                                                                                       | Expected value                             | Needed by                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Entire secondary semantic layer** — `$token-semantics-secondary-*`, `$token-bg-secondary-*`, `$token-text-secondary`, `$token-border-secondary-*` | —                                          | Any component using secondary color (Badge `background-secondary-lightest`, future secondary variants). Only primitives `$token-primitives-secondary-100` (#e8eaf2) and `$token-primitives-secondary-900` (#303d60) exist in the package. |
| `$token-font-size-200`                                                                                                                              | `0.625rem` (10px)                          | Badge small font size                                                                                                                                                                                                                     |
| `$token-opacity-disabled`                                                                                                                           | `0.45`                                     | Button disabled opacity                                                                                                                                                                                                                   |
| `$token-semantics-primary-hover`                                                                                                                    | `#0b47b8`                                  | Button primary hover background                                                                                                                                                                                                           |
| `$token-elevation-100`                                                                                                                              | —                                          | Button cancel hover box-shadow                                                                                                                                                                                                            |
| `$token-bg-surface-subtle`                                                                                                                          | `#fafbfc`                                  | Card bottom background                                                                                                                                                                                                                    |
| Scale token for `14px`                                                                                                                              | `14px`                                     | Card bottom padding (gap between `scale-300` 12px and `scale-400` 16px)                                                                                                                                                                   |
| `$token-border-radius-150`                                                                                                                          | `6px`                                      | Gallery image radius (gap between `border-radius-100` 4px and `border-radius-200` 8px)                                                                                                                                                    |
| `$token-font-size-275`                                                                                                                              | `11px`                                     | Chat List status text                                                                                                                                                                                                                     |
| Muted calendar day color                                                                                                                            | `#b4b4b4`                                  | DatePicker prev/next month day text                                                                                                                                                                                                       |
| `$token-bg-surface-hover`                                                                                                                           | `#f3f3f3` (same as `$token-border-subtle`) | DatePicker day hover background                                                                                                                                                                                                           |
| Radio disabled+checked color                                                                                                                        | `#8b8b8b`                                  | Radio button disabled+checked state                                                                                                                                                                                                       |
| Backdrop-filter blur token                                                                                                                          | `blur(4px)`                                | Popup scrim                                                                                                                                                                                                                               |

---

## Motion token reference

**Available in package** (`src/scss/tokens/_variables.scss`):

Durations: `$token-transition-time-0/100/150/200/250/300/350/500/1000/1500`

Curves: `$token-transition-curve-linear` · `$token-transition-curve-quick` · `$token-transition-curve-smooth` · `$token-transition-curve-spring` · `$token-transition-curve-base` · `$token-transition-curve-expressive` · `$token-transition-curve-bounce`

**Durations used in the design review that have no exact package token:**

| Used in review                                             | Value  | Gap                               |
| ---------------------------------------------------------- | ------ | --------------------------------- |
| `.12s` transitions (list, pagination, master detail, link) | 120 ms | between `time-100` and `time-150` |
| checkbox, switch, input/textarea transitions               | 180 ms | between `time-150` and `time-200` |
| accordion open/close animation                             | 400 ms | between `time-350` and `time-500` |

**Curves used in the review that match package tokens exactly** (for reference):

| Review value                                                 | Matches                          |
| ------------------------------------------------------------ | -------------------------------- |
| `cubic-bezier(0.4, 0, 1, 1)` (review "easing-standard")      | `$token-transition-curve-base`   |
| `cubic-bezier(0.16, 1, 0.3, 1)` (review "easing-expressive") | `$token-transition-curve-spring` |
| `linear`                                                     | `$token-transition-curve-linear` |

> **`prefers-reduced-motion`:** every new `transition` must be wrapped or
> zeroed under `@media (prefers-reduced-motion: reduce)`.

---

## 1. Accordion

**Files:**

- `src/scss/04-patterns/02-content/accordion/_accordion.scss`
- `src/scss/04-patterns/02-content/accordion-item/_accordion-item.scss`

### Token swap

- [x] `.osui-accordion-item` `border-radius`: `4px` → `$token-border-radius-100`
- [x] `.osui-accordion-item` active top indicator `background-color`: hardcoded blue → `$token-semantics-primary-base`
- [x] `.osui-accordion-item__title` `padding`: `24px` all → `$token-scale-300` top/bottom · `$token-scale-600` left/right
- [x] `.osui-accordion-item__title` `font-size`: `18px` → `$token-font-size-400` (16px)
- [x] `.osui-accordion-item__title` (open) `font-weight`: current → `$token-font-weight-semi-bold`
- [x] `.osui-accordion-item__title` `color`: current → `$token-text-default`
- [x] `.osui-accordion-item__icon` `color`: current → `$token-semantics-primary-base`
- [x] `[disabled]` `color`: hardcoded `#a2a2a2` → `$token-text-disabled`

### Transitions

- [x] `opacity 300ms ease-in` → `opacity $token-transition-time-300 $token-transition-curve-base`
- [x] `transition: all` on `__icon` → `transform $token-transition-time-300 ease-in-out` (no token match for ease-in-out)
- [x] `transform 300ms ease-in-out` on plus-minus → `transform $token-transition-time-300 ease-in-out` (no token match)
- [x] `transition: all` on `__content--is-animating` → `height $token-transition-time-300 ease-in-out` (no token match; visibility removed — not animatable)

### A11y

- [x] Focus ring: replaced yellow `$token-primitives-yellow-500` with `var(--color-focus-outer)` (semi-transparent primary blue) via `_resets.scss` global fix — applies to all components
- [x] Accordion title links: always underlined (`text-decoration: underline; text-underline-offset: 3px`); on focus shows `--color-focus-outer` background + underline colour; `box-shadow` and `outline` suppressed to avoid double ring
- [x] Disabled state: child `<a>` and `<button>` get `opacity: 0.4; pointer-events: none`

### RTL

- [x] `margin-right: $token-scale-200` on placeholder — no changes needed

### TS inline styles

- [x] `AccordionItem.ts` sets `height` (runtime-measured px) and `pointer-events` only — no hardcoded design values

---

## 2. Alert

**File:** `src/scss/04-patterns/02-content/_alert.scss`

### Token swap

- [x] Alert container `border-radius`: current → `$token-border-radius-200` (8px)
- [x] Alert container `padding`: `16px` all → `$token-scale-300` top/bottom · `$token-scale-400` left/right
- [x] Alert container `border`: remove 1px solid outer border (tonal background sufficient)
- [x] `border-left-width` (accent): remove (background alone carries semantic variant)
- [x] Icon/message `gap`: `16px` margin → `$token-scale-200` (8px) flex gap
- [x] Message `font-size`: `16px` → `$token-font-size-350` (14px/0.875rem)
- [x] Message `font-weight`: `400` → `$token-font-weight-medium`

### Variant token migrations

- [x] Warning `background-color`: current → `$token-bg-warning-subtle-default`
- [x] Warning `color`: current → `$token-text-warning`
- [x] Success `background-color`: current → `$token-bg-success-subtle-default`
- [x] Success `color`: current → `$token-text-success`
- [x] Info `background-color`: current → `$token-bg-info-subtle-default`
- [x] Info `color`: current → `$token-text-info`
- [x] Error/Danger `background-color`: current → `$token-bg-danger-subtle-default`
- [x] Error/Danger `color`: current → `$token-text-danger`

### Transitions

- [x] No existing transitions — none needed

### A11y

- [x] No `.has-accessible-features` block — none needed (static inline element, no interactive focus)

### RTL

- [x] RTL section removed — gap handles direction automatically

### TS inline styles

- [x] No TS pattern — Alert is CSS-only

---

## 3. Badge

**File:** `src/scss/04-patterns/05-numbers/_badge.scss`

### Token swap

- [x] Default `height`: `$token-scale-500` (20px); `padding: $token-scale-0 $token-scale-150` (0 6px)
- [x] Small `height`: `$token-scale-400` (16px); `padding: $token-scale-0 $token-scale-100` (0 4px)
- [x] Medium `height`: `$token-scale-700` (28px)
- [x] `background-primary-lightest`: `background-color: $token-semantics-primary-100`; `color: $token-semantics-primary-700` (theme-safe)
- [x] `background-secondary-lightest`: skipped — no `$token-semantics-secondary-*` in package (logged in missing tokens table)

---

## 4. Blank State

**File:** `src/scss/04-patterns/02-content/_blank-slate.scss`

### Token swap

- [ ] Not in design review — skip

---

## 5. Bottom Sheet

**File:** `src/scss/04-patterns/01-adaptive/bottom-sheet/_bottomsheet.scss`

### Token swap

- [x] Background, shadow, padding, border-radius vars — already using correct tokens
- [x] Handler pill — already `$token-border-input-default` (matches reference; plan was wrong)
- [x] Motion values (`350ms`, `cubic-bezier(0.19, 0.35, 0.56, 0.96)`) — deliberate design decisions, kept as-is

---

## 6. Breadcrumbs

**File:** `src/scss/04-patterns/04-navigation/_breadcrumbs.scss`

### Token swap

- [x] Link `color`: → `var(--osui-breadcrumbs-item-color)` (`$token-text-subtlest`)
- [x] Item `color`: → `$token-text-subtle`; `font-size: $token-font-size-350`; `font-weight: $token-font-weight-regular`
- [x] Current-page (last) item: `color: $token-text-default`; `font-weight: $token-font-weight-semi-bold`
- [x] Separator icon: `color: var(--osui-breadcrumbs-separator-color)`; `font-size: $token-font-size-300`; selector updated to `> div > .icon` to match actual HTML structure
- [x] Hover: `color: $token-text-default`; `text-decoration: none`
- [x] Transition: `color $token-transition-time-100 $token-transition-curve-base` on links
- [x] RTL: separator icon `transform: scaleX(-1)` via `.is-rtl .breadcrumbs-item > div > .icon`

---

## 7. Button

**File:** `src/scss/03-widgets/_btn.scss`

### Token swap

- [x] `.btn` `height`: `--osui-btn-height: #{$token-scale-1000}` (40px)
- [x] `.btn` `border-radius`: `--osui-btn-border-radius: #{$token-border-radius-200}` (8px)
- [x] `.btn-small` `height`: `$token-scale-800` (32px)
- [x] `.btn-large` `height`: `$token-scale-1200` (48px)
- [x] `.btn-primary`: CSS API vars `--osui-btn-primary-background/border-color/color` using `$token-semantics-primary-base` / `$token-text-inverse`
- [x] `.btn-success`: CSS API vars using `$token-bg-success-base-default` / `$token-text-inverse`
- [x] `.btn-error`: CSS API vars using `$token-bg-danger-base-default` / `$token-text-inverse`
- [x] `.btn-cancel`: CSS API vars using `$token-bg-surface-default` / `$token-text-subtle` / `$token-border-default`
- [x] `[disabled]`: single `opacity: 0.45; pointer-events: none` on `.btn[disabled]` — works for all variants without per-variant overrides. Note: `$token-opacity-disabled` missing from package (logged in missing tokens table). If additional utility-color variants are added in future, a per-variant disabled override may be needed.
- [x] `.btn-neutral` and `.btn-circle` — not added; these are new variants beyond the token migration scope

### Component CSS API vars

- [x] Declared at `.btn` root: `--osui-btn-height`, `--osui-btn-background`, `--osui-btn-color`, `--osui-btn-border-color`, `--osui-btn-border-radius`, plus per-variant vars for primary/success/error/cancel

### Hover

- [x] Base hover: `filter: brightness(0.9)` (desktop only)
- [x] Primary hover: `background-color: $token-semantics-primary-800; border-color: $token-semantics-primary-800; filter: none`
- [x] Cancel hover: `border-color: $token-border-input-default; color: $token-text-default`

### Motion

- [x] Explicit transition list: `background-color, border-color, color $token-transition-time-100 $token-transition-curve-base` (was `transition: all`)

---

## 7a. Button Loading

**File:** `src/scss/04-patterns/03-interaction/button-loading/_button-loading.scss`

### Token swap

- [x] Spinner `height`/`width`: `16px` → `$token-scale-400`
- [x] Spinner `border-radius`: `50%` → `$token-border-radius-full`
- [x] Spinner `border`: already `$token-border-size-050`; `margin-right`: already `$token-scale-200`; child `font-size`: already `$token-font-size-350`
- [x] Animation duration (`850ms`) and easing (`cubic-bezier(0.7, 1.05, 0.78, 0.78)`) — bespoke spinner values, no token equivalent; hardcoded by design

---

## 8. Button Group

**File:** `src/scss/03-widgets/_button-group.scss`

### Token swap

- [x] `.button-group-item` `height`: `$token-scale-1000` (40px), responsive `$token-scale-1200` (48px)
- [x] `.button-group-item` `border-color`: `$token-border-default`
- [x] `.button-group-item` `color`: `$token-text-default`
- [x] Corner `border-radius` (first/last): already `$token-border-radius-200` — plan was stale
- [x] `.button-group-selected-item` `background-color`: already `$token-semantics-primary-base` — plan was stale
- [x] Hover: `$token-primitives-neutral-100` → `$token-border-subtle` (same value, semantic upgrade)

---

## 9. Card

**Files:**

- `src/scss/04-patterns/02-content/_card.scss`
- `src/scss/04-patterns/02-content/_card-sectioned.scss`
- `src/scss/04-patterns/02-content/_card-item.scss`
- `src/scss/04-patterns/02-content/_card-background.scss`

### Token swap

- [x] `.card` — CSS API already complete: `$token-bg-surface-default`, `$token-border-subtle`, `$token-border-radius-200`, `$token-elevation-1`
- [x] `_card-item.scss`: fix `--osui-card-detail-title-color` missing `#{}` interpolation; upgrade `$token-primitives-neutral-700` → `$token-text-subtlest`
- [x] `.card-title` `color`: `$token-text-default` (explicit to prevent inheritance issues)
- [x] `.card-image` padding: `$token-scale-600` → `$token-scale-0` (flush image layout); applies to all orientations and layout-native context
- [x] `.card-bottom` `background-color`: `#fafbfc` (hardcoded; TODO: upgrade to `$token-bg-surface-subtle` when token lands); `border-top: $token-border-size-025 solid $token-border-subtle`
- [x] `.card-bottom` layout: `display: flex; align-items: center`; `.btn` `width: 100%`
- [x] `.background-pink`: not in our SCSS — platform utility class, out of scope

---

## 10. Carousel

**File:** `src/scss/04-patterns/02-content/carousel/_carousel.scss`

### Token swap

- [x] Track `border-radius`: `$token-border-radius-300` (12px) on `&__track` (no `overflow: hidden` — would clip pagination)
- [x] Pagination rest `background-color`: `#ccc` → `var(--osui-carousel-pagination-color)` (`$token-border-default`)
- [x] Arrow icon `color`: `$token-primitives-neutral-700` → `$token-text-default` via `--osui-carousel-arrow-icon-color`
- [x] Pagination gap: margin kept — WCAG 2.5.8: dot is 12px visual but 24px touch target (12px dot + 6px margin × 2); switching to `gap` would break this guarantee
- [x] Pagination dot `border-radius: $token-border-radius-full`; active pill: `width $token-scale-700` (28px) with `transition: width, background-color $token-transition-time-200 $token-transition-curve-linear`

### Motion

- [x] Arrow `transition: opacity 150ms linear` → `opacity $token-transition-time-150 $token-transition-curve-linear`

> **Hardcoded by design:** arrow button size (40px) and SVG icon size (14px) have no direct scale tokens.

---

## 11. Checkbox

**File:** `src/scss/03-widgets/_checkbox.scss`

### Token swap

- [x] `[data-checkbox]:before` border + border-radius: already via CSS API vars (`$token-border-input-default`, `$token-border-radius-200`)
- [x] `[data-checkbox]:checked` background: already via `--osui-checkbox-checked-color: #{$token-semantics-primary-base}`
- [x] `[data-checkbox]:disabled` `background-color`: `$token-bg-input-disabled` → `$token-border-subtle` (same #f3f3f3, semantic upgrade)
- [x] `[data-checkbox]:disabled` checkmark: already `$token-text-disabled`
- [x] Checkmark transform: border-trick `:after` with `$token-text-inverse` is correct; transform approach skipped (not needed)

### Motion

- [x] `transition: all 180ms linear` → explicit `background-color, border-color 180ms $token-transition-curve-linear` (180ms hardcoded: gap between `$token-transition-time-150`/`$token-transition-time-200`)

---

## 12. Counter

**File:** `src/scss/04-patterns/05-numbers/_counter.scss`

### Token swap

- [x] Background/text color classes (`background-primary`, `background-success`, etc.) — platform utility classes, not in our SCSS; out of scope
- [x] Display `font-size`: `.font-size-display` is a platform utility class handled in `_html-elements-headings.scss` via `$token-display-lg-regular` responsive mixin — already token-backed
- [x] No changes needed to `_counter.scss`

---

## 13. DatePicker

**File:** `src/scss/04-patterns/03-interaction/date-picker/_datepicker.scss`

### Token swap (input / flatpickr clone)

- [~] Clone input (`altInput`) styles: added then removed — altInput inherits adequate styling; block was not needed

### Token swap (calendar popup / flatpickr override)

**File:** `src/scss/04-patterns/03-interaction/date-picker/provider/_flatpickr.scss`

- [x] Calendar `border-radius`: → `$token-border-radius-200` (8px)
- [x] Calendar: border `$token-border-size-025 solid $token-border-default`; `box-shadow: var(--osui-elevation-overlay)`
- [x] Month/year `color`: `$token-semantics-primary-base` → `$token-text-default` (#242424)
- [x] Nav arrow `stroke`: `$token-text-subtlest` → `$token-semantics-primary-base`
- [x] Weekday `color`: → `$token-text-subtlest`
- [x] Day cell: selected/startRange/endRange → `$token-border-radius-200` (8px squircle); `:before` band keeps 50px half-pill shape for range connector
- [x] Today `border-color`: → `$token-border-default`; hover bg → `$token-border-subtle` (`#f3f3f3`, maps to missing `$token-bg-surface-hover`), color → `$token-semantics-primary-base`
- [x] Hover/focus background: → `$token-border-subtle` (`#f3f3f3`); border → `$token-border-default`
- [x] hover/focus/today: `border-radius: $token-border-radius-200` (8px squircle)
- [x] inRange: `border-radius: $token-border-radius-0` — flat continuous band between start/end caps
- [x] selected/startRange/endRange: `border-radius: $token-border-radius-200` (8px caps)
- [x] inRange background: `color-mix(in srgb, #{$token-semantics-primary-base} 12%, #{$token-bg-surface-default})` (light primary tint)
- [x] inRange `:before` band: same `color-mix` background
- [x] AM/PM pill: filled `$token-semantics-primary-base` background; hover → `$token-bg-neutral-subtle-default`
- [x] hasWeeks side column: `.flatpickr-weekwrapper .flatpickr-weeks` background `$token-border-subtle`; `box-shadow: none` (overrides library `1px 0 0 #e6e6e6` fake right border); `border-radius: $token-border-radius-200`; `margin-right: $token-scale-100`; week number day `color: $token-text-subtlest; opacity: 0.7`
- [x] Today button (`.osui-datepicker-calendar` scoped): plain centered text link with `border-top: $token-border-size-025 solid $token-border-subtle` separator; no pill styling — overrides the global today pill
- [x] `numInputWrapper` padding reduced to `0` (was `0 $token-scale-400`) to remove excess whitespace in time segment
- [x] Timepicker within datepicker (`&.hasTime .flatpickr-time`): segmented input layout — left-rounded hour segment, separator, right-rounded minute segment, AM/PM pill; all segments share top/bottom/connecting borders; focus highlights all segments blue via `:has(.numInput:focus)`; `font-size: $token-font-size-350`; `font-weight: $token-font-weight-medium`; `height: $token-scale-600`; AM/PM `border-radius: var(--osui-input-border-radius, #{$token-border-radius-200})`; `margin-left: $token-scale-150`

---

## 14. Dropdown

**Files:**

- `src/scss/04-patterns/03-interaction/dropdown/_dropdown.scss`
- `src/scss/04-patterns/03-interaction/dropdown/provider/_virtualselect.scss`

### Token swap

- [x] Trigger `height`: confirmed `$token-scale-1000` (40px) — proposed CSS keeps 40px
- [x] Trigger `border-radius`: `$token-border-radius-100` → `$token-border-radius-200` (8px)
- [x] Trigger `border-color`: direct `$token-border-input-default` → `var(--osui-input-border-color, #{$token-border-default})`
- [x] Trigger `font-size`: → `$token-font-size-350`
- [x] Trigger `transition`: `height, border-color 0.25s ease` → `border-color $token-transition-time-100 $token-transition-curve-base`
- [x] Trigger `:hover border-color`: `$token-border-input-default` → `var(--osui-input-focus-border-color, #{$token-semantics-primary-base})` (primary on hover per reference)
- [x] Trigger arrow `transition`: `all 0.25s ease` → `transform $token-transition-time-100 $token-transition-curve-base`
- [x] Popup container `border-radius`: `$token-border-radius-100` → `$token-border-radius-200`
- [x] Popup container: removed `box-shadow` inset border hack → real `border: $token-border-size-025 solid $token-border-default` + `box-shadow: var(--osui-elevation-overlay)`
- [x] Popup container `background-color`: `$token-bg-input-default` → `$token-bg-surface-default`
- [x] Popup container `padding`: complex inset-shadow padding → `0`
- [x] Search container `border-bottom-color`: `$token-border-input-default` → `$token-border-default`
- [x] Focused row `background-color`: `$token-bg-neutral-subtle-default` → `$token-border-subtle`
- [x] Selected row `background-color`: → `transparent` (reference: visual indicator is right-side checkmark, not background)
- [x] Selected row `font-weight`: `$token-font-weight-medium` → `$token-font-weight-regular` (per reference)
- [x] Selected row `::after` checkmark: `content: var(--osui-icon-check); font-family: var(--osui-icon-font-family); color: $token-semantics-primary-base` — depends on icon library foundation
- [x] Selected+focused row: `background-color: transparent`
- [x] Option item: `flex-wrap: nowrap; justify-content: space-between`; `transition` → `background-color $token-transition-time-100 $token-transition-curve-base`
- [x] Option text: `display: flex; align-items: center; gap: $token-scale-100; min-width: 0; overflow: hidden`
- [x] Options container `max-height`: `210px` → `240px`
- [x] Search clear hover `background-color`: `$token-primitives-neutral-400` → `$token-border-default`
- [x] Clear button hover `background-color`: `$token-primitives-neutral-400` → `$token-border-default`
- [x] `.vscomp-ele`: `display: inline-block` (lib) → `display: block`; `max-width: 250px` (lib) → `initial`
- [x] Hide left checkbox icon: `.vscomp-options .vscomp-option .checkbox-icon { display: none }` — right-side `::after` checkmark replaces it for all variants
- [x] All option `font-weight`: lib defaults bold → `$token-font-weight-regular` on base `.vscomp-option`
- [x] Focus rings inside dropbox: blanket `&:focus, &:focus-visible, *:focus, *:focus-visible { outline: none; box-shadow: none }` on `.vscomp-dropbox-container` (includes container self-ring — `tabindex="-1"`, briefly focused on open)
- [x] `.vscomp-wrapper:focus-visible { outline: none }` — wrapper is outside dropbox container, suppressed separately
- [x] A11y focus ring on wrapper: comes from global `.has-accessible-features :focus` rule on `.vscomp-wrapper`; toggle button ring removed (main block keeps `box-shadow: none` on `.vscomp-toggle-button` when focused)
- [x] A11y search container ring: not implemented — vscomp popup is portaled outside the screen container so page-level `has-accessible-features` is never an ancestor; `vscomp-dropbox-container` always carries the class independently, making CSS-only gating impossible

---

## 14a. Native Dropdown

**File:** `src/scss/03-widgets/_dropdown.scss`

### Token swap

- [x] `--osui-dropdown-border-color`: `#{$token-border-input-default}` → `#{$token-border-default}`
- [x] `--osui-dropdown-border-radius`: `#{$token-border-radius-100}` → `#{$token-border-radius-200}`
- [x] `--osui-dropdown-list-max-height`: `300px` → `240px`
- [x] Dropdown list `box-shadow`: `none` → `var(--osui-elevation-overlay)`
- [x] Dropdown list `border-radius`: `$token-border-radius-100` → `$token-border-radius-200`
- [x] Dropdown list scrollbar: `width: 5px`; track `$token-border-default`; thumb `$token-text-disabled`
- [x] Popup row `height`: `$token-scale-1000` → `$token-scale-1100` (44px); added `justify-content: space-between`
- [x] Popup row hover: `$token-bg-input-disabled` → `$token-border-subtle`
- [x] Selected row: `background-color: $token-bg-input-disabled` → `background: none`; `font-weight: $token-font-weight-semi-bold`; right-side checkmark `::after`
- [x] Scrollable list `padding`: `$token-scale-200 $token-scale-0` → `$token-scale-0`
- [x] `div, select.dropdown-display`: `font-weight: $token-font-weight-regular !important` — overrides platform inline `font-weight: bold`
- [x] A11y expanded border: `$token-text-default` → `var(--color-focus-inner)` + `box-shadow: 0 0 0 3px var(--color-focus-outer)`
- [x] A11y select focus: `$token-text-default` → `var(--color-focus-inner)`

---

## 14b. Dropdown Server Side

**Files:**

- `src/scss/04-patterns/03-interaction/dropdown/_dropdown-serverside.scss`
- `src/scss/04-patterns/03-interaction/dropdown/_dropdownserversideitem.scss`

### Token swap

- [x] Selected item: `background-color: var(--osui-dropdown-item-hover-bg)` → `background-color: transparent`; right-side checkmark `::after` (`--osui-icon-check`, `$token-semantics-primary-base`)
- [x] Item text bold override: `.bold { font-weight: $token-font-weight-regular }` inside `__content` — overrides platform utility class
- [x] A11y search wrapper: `__balloon-search-wrapper:focus-within { outline: 3px solid var(--color-focus-outer); outline-offset: -3px }` — uses `outline` (not `box-shadow: inset`) to avoid clipping by `.osui-balloon { overflow: hidden }`; input `box-shadow: none; outline: none` to suppress browser native rings
- [x] Search input: `:focus, :focus-visible { box-shadow: none; outline: none }` to suppress browser native rings

---

## 15. Flip Content

**File:** `src/scss/04-patterns/02-content/flip-content/_flipcontent.scss`

### Token swap

- [ ] Face `background-color` defaults: ad-hoc → `$token-bg-surface-default` (front) · `$token-border-subtle` (back)

### Motion

- [ ] Replace hardcoded `630ms cubic-bezier(0.03, 0.01, 0.67, 1.97)` → `400ms /* token gap */ $token-transition-curve-spring` on the flip transform
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 16. Form

**File:** `src/scss/03-widgets/_form.scss`

### Token swap

- [ ] Row spacing: `16px` → `$token-scale-600` (24px)
- [ ] Column gap: `16px` → `$token-scale-600` (24px)
- [ ] Remove card chrome from form wrapper (border + shadow + radius)

> **Note:** form control border and focus ring are in `_inputs-and-textareas.scss` — see **Input** below. Height stays at 40px (`$token-scale-1000`).

---

## 17. Gallery

**File:** `src/scss/04-patterns/02-content/gallery/_gallery.scss`

### Token swap

- [ ] `.gallery-img` `border-radius`: `$token-border-radius-100` (4px) → `6px` (annotate `// design-spec: 6px, between scale-050 2px and scale-100 4px — no exact token`)

> **Hardcoded by design:** 6px sits between `$token-border-radius-100` (4px) and `$token-border-radius-200` (8px); keep raw value with comment.

---

## 18. Icon Badge

**File:** `src/scss/04-patterns/05-numbers/_icon-badge.scss`

### Token swap

- [ ] `.background-primary` `background-color`: `color-primary` (#1068eb) → `$token-semantics-primary-base`
- [ ] `.background-error` `background-color`: `color-red` (#c92a2a) → `$token-semantics-danger-base`
- [ ] `.border-radius-rounded` `border-radius`: `100px` → `$token-border-radius-full` (999px)
- [ ] Badge text `color`: `color-neutral-0` → `$token-text-inverse`
- [ ] Ring shadow: `0 0 0 2px #ffffff` hardcoded → `0 0 0 2px $token-bg-surface-default` (use `#{$token-bg-surface-default}` interpolation)

---

## 19. Input

**File:** `src/scss/03-widgets/_inputs-and-textareas.scss`

### Token swap

- [x] `[data-input]` `height`: confirmed `$token-scale-1000` (40px) — proposed CSS keeps 40px, **not** 36px
- [ ] `[data-input]` `border-radius`: `4px` → `$token-border-radius-200` (8px)
- [x] `--osui-input-color: $token-text-default` fix missing `#{}` interpolation → `#{$token-text-default}`
- [ ] `--osui-input-border-color` CSS API var default: `#{$token-border-input-default}` — consider changing to `#{$token-border-default}` to unify inline vs portal'd behavior (portals cannot inherit from `.form-control` ancestor); deferred
- [ ] Hover `border-color`: current → `border-color: $token-border-input-default` (property only; avoid shorthand to preserve existing border-width/style)
- [ ] Focus state: replace `border:` shorthand → `border-color: var(--osui-input-focus-border-color); outline: none`
- [ ] Disabled `background-color`: → `$token-border-subtle`
- [ ] Disabled `color`: → `$token-text-disabled`
- [ ] Error `border-color`: `#dc2020` → `$token-semantics-danger-base`
- [x] `[data-input].input-small` `height`: → `$token-scale-800` (32px)
- [x] `[data-input].input-large` `height`: → `$token-scale-1200` (48px)

### Label and helper text (missing rules)

- [ ] Add `.form label` / `[data-label]` `font-size: $token-font-size-350`; `font-weight: $token-font-weight-medium`; `color: $token-text-default`; `margin-bottom: $token-scale-100`
- [ ] Add `.help-block` / `.input-helper` `font-size: $token-font-size-300`; `color: $token-text-subtle`; `margin-top: $token-scale-100`
- [ ] Add `span.validation-message` `font-size: $token-font-size-300`; `color: $token-semantics-danger-base`; `margin-top: $token-scale-100`

### Motion

- [ ] `transition: all 180ms linear` → explicit `border-color, background-color` list (avoid `transition: all`); deferred with hover/focus changes
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 20. Link

**File:** `src/scss/03-widgets/` (check for `_link.scss` or within `_inputs-and-textareas.scss`; may be in foundations)

### Token swap

- [ ] `color`: `color-primary` (#1068eb) → `$token-semantics-primary-base`
- [ ] `text-decoration`: none at rest → `underline` with 35% opacity via `text-decoration-color`
- [ ] Add `text-underline-offset: 3px`
- [ ] `:focus-visible` `outline`: browser default → `#{$token-border-size-050} solid $token-semantics-primary-base; outline-offset: 2px`

### Motion

- [ ] Add `transition: color 120ms /* token gap */ $token-transition-curve-base`

---

## 21. List

**File:** `src/scss/03-widgets/_list.scss` and `_list-item.scss`

### Token swap

- [ ] Row `padding`: `12px 16px` → `$token-scale-400` all sides
- [ ] Divider `border-color`: `#dee2e6` → `$token-border-subtle`
- [ ] Avatar–text gap: collapse max-width layout → `gap: $token-scale-200` hug-avatar approach
- [ ] Subtext `color`: `#6a7178` → `$token-text-subtle`
- [ ] Hover `background-color`: none → `$token-border-subtle`

### Motion

- [ ] Add `transition: background-color 120ms /* token gap */ $token-transition-curve-base` to `.list-item`

---

## 22. Master Detail

**File:** `src/scss/04-patterns/01-adaptive/_master-detail.scss`

### Token swap

- [ ] Wrapper `box-shadow` / `border`: remove
- [ ] Wrapper `border-radius`: `8px` → `0`
- [ ] List-item `padding`: `16px` all → `$token-scale-300` top/bottom · `$token-scale-600` left/right
- [ ] Selected item: active indicator left border → full-width tint `$token-bg-primary-base-default` (or `$token-semantics-primary-base` at low opacity)
- [ ] Selected item `font-weight`: → `$token-font-weight-semi-bold`
- [ ] Trailing indicator: swap filled arrow → stroked caret glyph

### Motion

- [ ] `.list-item` `transition: background-color 120ms /* token gap */ $token-transition-curve-base`

---

## 23. Notification

**File:** `src/scss/04-patterns/03-interaction/notification/_notification.scss`

### Token swap

- [ ] Container `background-color`: → `$token-bg-surface-default`
- [ ] Container `border-color`: `--color-neutral-4` → `$token-border-default`
- [ ] Container `border-radius`: → `$token-border-radius-100` (4px)
- [ ] Container `padding`: → `$token-scale-600` (24px)
- [ ] Text `color`: → `$token-text-default`

---

## 24. Pagination

**File:** `src/scss/04-patterns/04-navigation/_pagination.scss`

### Token swap

- [ ] Pagination button size: `32×32px` → `$token-scale-900 × $token-scale-900` (36×36px)
- [ ] Button `border-radius`: `4px` → `$token-border-radius-200` (8px)
- [ ] Rest button `border`: `1px solid #d5d5d5` → remove border
- [ ] Rest button `color`: `#4f575e` → `$token-text-default`
- [ ] Rest button `font-weight`: `400` → `$token-font-weight-medium`
- [ ] Active button `border-color`: primary blue → `$token-border-default`
- [ ] Active button `color`: `#105cef` → `$token-text-default`
- [ ] Hover button `background-color`: `rgba(21,24,26,.04)` → `$token-border-subtle`
- [ ] Button `margin-left`: `8px` → `$token-scale-100` (4px)
- [ ] Ellipsis width: `16px` fixed → `auto` with `min-width: $token-scale-200`

### Motion

- [ ] Add `transition: background-color 120ms /* token gap */ $token-transition-curve-base, border-color 120ms /* token gap */ $token-transition-curve-base, color 120ms /* token gap */ $token-transition-curve-base` to `.pagination-button`

---

## 25. Popup / Modal

**File:** `src/scss/03-widgets/_popup.scss`

### Token swap

- [ ] Modal `border-radius`: `4px` → `$token-border-radius-300` (12px)
- [ ] Backdrop `background`: `rgba(0,0,0,0.5)` → `rgba(15,23,42,0.45)` + `backdrop-filter: blur(4px)` (annotate `// hardcoded: no blur/scrim token yet`)
- [ ] Actions layout: right-align → flex with `gap: $token-scale-200`
- [ ] Close icon: update glyph reference (existing icon class → Phosphor Bold X equivalent)

---

## 26. Progress Bar

**File:** `src/scss/04-patterns/05-numbers/progress/_progressbar.scss`

### Token swap

- [ ] Track `background-color`: `color-neutral-3` (#e9ecef) → `$token-border-subtle`
- [ ] Fill (primary) `background-color`: `color-primary` (#1068eb) → `$token-semantics-primary-base`
- [ ] Fill (success) `background-color`: `color-success` → `$token-semantics-success-base`
- [ ] Fill (error) `background-color`: `color-error` → `$token-semantics-danger-base`
- [ ] Fill (warning) `background-color`: → `$token-semantics-warning-base`
- [ ] Track `border-radius`: none/square → `$token-border-radius-full` (999px)
- [ ] Label `color`: → `$token-text-default`
- [ ] Thickness steps (4/8/12/16px): align to `$token-scale-100 / $token-scale-200 / $token-scale-300 / $token-scale-400`

### Motion

- [ ] Fill animation: confirm `transition: width $token-transition-time-300 $token-transition-curve-base`

---

## 27. Progress Circle

**File:** `src/scss/04-patterns/05-numbers/progress/_progresscircle.scss`

### Token swap

- [ ] Trail stroke `color`: `color-neutral-3` (#e9ecef) → `$token-primitives-neutral-300`
- [ ] Progress stroke (primary): `color-primary` (#1068eb) → `$token-semantics-primary-base`
- [ ] Progress stroke (success): `color-success` → `$token-semantics-success-base`
- [ ] Progress stroke (warning): `color-warning` → `$token-semantics-warning-base`
- [ ] Progress stroke (error): `color-error` → `$token-semantics-danger-base`
- [ ] Display `font-size`: `--font-size-display` → `$token-font-size-900` (2.25rem)
- [ ] Display `font-weight`: → `$token-font-weight-semi-bold`
- [ ] Display `color`: → `$token-text-default`

### Motion

- [ ] Confirm/add `transition: stroke-dashoffset 400ms /* token gap */ $token-transition-curve-base` on progress path

---

## 28. Radio Button

**File:** `src/scss/03-widgets/_radio-button.scss`

### Token swap

- [ ] `[data-radio]:before` `border`: `1px solid color-neutral-5` → `$token-border-size-025 solid $token-border-input-default`
- [ ] Control hit area: `20px` → `24px`
- [ ] Checked indicator: 5px border → `6px solid $token-semantics-primary-base`
- [ ] Disabled+checked `color`: `#d5d5d5` → `#8b8b8b` (annotate `// design-spec: muted grey, no token for disabled-checked`)
- [ ] Focus ring: browser default → `box-shadow: 0 0 0 3px color-mix(in srgb, #{$token-semantics-primary-base} 22%, transparent)`
- [ ] Vertical gap between items: → `$token-scale-300` (12px)

---

## 29. Range Slider

**File:** `src/scss/04-patterns/03-interaction/range-slider/_rangeslider.scss`  
**Provider file:** `src/scss/04-patterns/03-interaction/range-slider/provider/_noUiSlider.scss`

### Token swap

- [ ] Track `background-color`: `#e5e5e5` → `$token-primitives-neutral-200`
- [ ] Track `border-radius`: → `$token-border-radius-full`
- [ ] Fill `background-color`: `#1068eb` → `$token-semantics-primary-base`
- [ ] Handle `border-width`: `1px` → `$token-border-size-050` (2px)
- [ ] Handle `border-color`: → `$token-semantics-primary-base` (use `--osui-range-slider-active-fill` if already defined)
- [ ] Handle `background-color`: → `$token-bg-surface-default`
- [ ] Tick markers `width × height`: `1×6px` → `2×8px`
- [ ] Tick markers `color`: `#b4b4b4` → `$token-text-subtlest`
- [ ] Value labels `color`: `#6a7178` → `$token-text-default`
- [ ] Value labels `font-weight`: `400` → `$token-font-weight-medium`

---

## 30. Rating

**File:** `src/scss/04-patterns/05-numbers/rating/_rating.scss`

### Token swap

- [ ] Filled/half star `color` / `--osui-rating-filled-color` default: `text-primary` blue (#1068eb) → `$token-semantics-warning-base` (gold/amber)
- [ ] Empty star `color` / `--osui-rating-empty-color` default: `color-neutral-5` (#ced4da) → `color-mix(in srgb, #{$token-semantics-warning-base} 38%, white)` (annotate `// design-spec: desaturated gold tint`)
- [ ] Disabled filled `--osui-rating-disabled-color` default: → `$token-text-disabled`
- [ ] Disabled empty `--osui-rating-disabled-empty-color` default: → `$token-border-default`
- [ ] Small star `--rating-size`: `8px` → `$token-scale-300` (12px)
- [ ] Item `padding`: `calc(size + --space-s)` → `calc(var(--rating-size) + #{$token-scale-200})`
- [ ] Icon `vertical-align`: `baseline` → `middle`
- [ ] Row label `text-align`: `center` → `start`
- [ ] Focus ring: `--color-focus-outer` legacy var → `box-shadow: 0 0 0 3px color-mix(in srgb, #{$token-semantics-primary-base} 22%, transparent)`

### Motion

- [ ] Hover item: `transform: scale(1.12)` with `transition: transform $token-transition-time-100 $token-transition-curve-base`

---

## 31. Section Index

**File:** `src/scss/04-patterns/04-navigation/section-index/_sectionindex.scss`

### Token swap

- [ ] Active indicator bar `background-color`: `--color-primary` → `$token-semantics-primary-base`
- [ ] Rest item `color`: `color-neutral-8` → `$token-text-subtle`
- [ ] Hover item `color`: `color-neutral-9` → `$token-text-default`
- [ ] Active item `color`: `color-neutral-9` → `$token-text-default`
- [ ] Active item `font-weight`: → `$token-font-weight-semi-bold`

---

## 32. Switch

**File:** `src/scss/03-widgets/_switch.scss`

### Token swap

- [ ] Track size: `48×30px` → `40×24px`
- [ ] Track `border`: remove 1px solid border (plain pill)
- [ ] Thumb size: `24px` → `20px`
- [ ] Off-state track `background-color`: `#ced4da` → `$token-border-default`
- [ ] On-state track `background-color`: `#1068eb` → `$token-semantics-primary-base`
- [ ] Focus ring: browser default → `box-shadow: 0 0 0 3px color-mix(in srgb, #{$token-semantics-primary-base} 22%, transparent)`
- [ ] Disabled state `background-color`: → `$token-border-subtle`
- [ ] Disabled thumb `background-color`: → `$token-border-default`

### Motion (confirm existing)

- [ ] Track: `transition: background-color 180ms /* token gap */ $token-transition-curve-linear`
- [ ] Thumb: `transition: transform 180ms /* token gap */ $token-transition-curve-linear`

---

## 33. Tabs

**File:** `src/scss/04-patterns/04-navigation/tabs/_tabs.scss`

### Token swap (component CSS API var defaults)

- [ ] `--osui-tabs-border-color` default: `color-neutral-5` → `#{$token-border-subtle}`
- [ ] `--osui-tabs-header-item-color` default: `color-neutral-8` → `#{$token-text-subtlest}`
- [ ] `--osui-tabs-header-item-color-active` default: `color-neutral-10` → `#{$token-semantics-primary-base}`
- [ ] `--osui-tabs-header-item-color-disabled` default: → `#{$token-text-disabled}`
- [ ] `--osui-tabs-indicator-color` default: → `#{$token-semantics-primary-base}`

### Rules

- [ ] Active item: replace `font-weight: 600` (causes reflow + layout shift) → `text-shadow: 0 0 0.5px currentColor` (optical bold, no reflow)
- [ ] Hover: add `background-color: rgba(0,0,0,.04)` + `border-radius: $token-border-radius-100`
- [ ] Hover `color`: → `$token-text-default`

### Motion (confirm existing)

- [ ] Header item: `transition: color $token-transition-time-200 $token-transition-curve-linear`
- [ ] Indicator: `transition: transform $token-transition-time-200 $token-transition-curve-linear`

---

## 34. Textarea

**File:** `src/scss/03-widgets/_inputs-and-textareas.scss`

(Same file as **Input** — handled together)

### Token swap

- [ ] `[data-textarea]` `border-radius`: `4px` → `$token-border-radius-200` (8px)
- [ ] `[data-textarea]` `border-color`: → `$token-border-input-default`
- [ ] `[data-textarea]` `padding`: `16px` all → `$token-scale-300` top/bottom · `$token-scale-400` left/right
- [ ] Focus: outline-based `$token-semantics-primary-base` (same as Input)
- [ ] Disabled → same tokens as Input
- [ ] `.not-valid` `border-color`: `#dc2020` → `$token-semantics-danger-base`
- [ ] Character counter (new slot): `color: $token-text-subtlest`; `font-size: $token-font-size-300`

### Motion

- [ ] Fix `transition: all 180ms linear` → explicit `border-color, background-color var(--token-duration-fast, 100ms) var(--token-easing-standard, ease)` (matches Input)
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 35. Timeline

**File:** `src/scss/04-patterns/04-navigation/_timeline.scss`

### Token swap

- [ ] Connector line `width`: `1px` → `$token-border-size-050` (2px)
- [ ] Connector line `background-color`: `color-neutral-5` → `$token-border-default`
- [ ] Content block `color`: `color-neutral-8` → `$token-text-subtle`
- [ ] Content block `margin-bottom`: `--space-xl` → `$token-scale-800` (32px)
- [ ] `.background-primary` → `$token-semantics-primary-base`
- [ ] `.background-success` → `$token-semantics-success-base`
- [ ] `.background-error` → `$token-semantics-danger-base`
- [ ] `.background-warning` → `$token-semantics-warning-base`
- [ ] `.background-info`: add/update → `$token-semantics-info-base`
- [ ] Timestamp `font-size`: → `$token-font-size-300`
- [ ] Timestamp `color`: → `$token-text-subtlest`
- [ ] Timestamp `font-weight`: → `$token-font-weight-semi-bold`
- [ ] `.timeline-avatar` `background-color`: current → `$token-border-subtle`
- [ ] `.timeline-avatar` `color`: current → `$token-text-subtle`
- [ ] Icon container `height × width`: `24×24px` → `28×28px`
- [ ] Icon container `font-size`: `10px` → `$token-font-size-350` (14px)
- [ ] Avatar size: `24px` → `40px`

### New state

- [ ] Add `.is-upcoming` state: dashed connector line + outlined icon bubble + `$token-text-disabled` icon body

### New card variant

- [ ] `.timeline-content--card`: `border: $token-border-size-025 solid $token-border-default` · `border-radius: $token-border-radius-200` · `padding: $token-scale-300 $token-scale-400`

---

## 36. Tooltip / Balloon

**Files:**

- `src/scss/04-patterns/03-interaction/tooltip/_tooltip.scss`
- `src/scss/04-patterns/03-interaction/balloon/_balloon.scss`

### Token swap

- [ ] `--osui-tooltip-background` / surface `background-color`: `neutral-9` (#272b30) → `#{$token-text-default}` (#242424)
- [ ] `--osui-tooltip-color` / text `color`: `neutral-0` → `#{$token-text-inverse}`
- [ ] `--osui-tooltip-border-radius` default: `4px` → `#{$token-border-radius-200}` (8px)
- [ ] `--osui-tooltip-padding` default: `--space-s` → `#{$token-scale-200}` (8px)
- [ ] Add `--osui-tooltip-max-width: 280px` CSS API var (replaces hardcoded `250px`)

---

## 37. Wizard

**File:** `src/scss/04-patterns/04-navigation/_wizard.scss`

### Token swap

- [ ] Icon bubble size: `32px` → `$token-scale-900` (36px)
- [ ] Icon bubble `border`: `1px solid #ced4da` → `$token-border-size-050 solid $token-border-default`
- [ ] Glyph `font-size`: `10px` → `$token-font-size-300`
- [ ] Connector `width` / `height`: confirm `$token-border-size-050` (2px)
- [ ] "Next" state icon `color`: `#ced4da` → `$token-text-disabled`
- [ ] Base label `color`: `#6a7178` → `$token-text-subtlest`
- [ ] Active label `color`: `neutral-10` → `$token-text-default`
- [ ] Past label `color`: `neutral-8` → `$token-text-subtle`
- [ ] Active state: add 4px halo ring `box-shadow: 0 0 0 4px color-mix(in srgb, #{$token-semantics-primary-base} 18%, transparent)`
- [ ] Past state bubble `background-color`: `#1068eb` → `$token-semantics-primary-base`
- [ ] Disabled state: add `opacity: 0.6` + `$token-text-disabled` + `$token-border-subtle` styling
- [ ] Vertical step spacing: `--space-l` alias → `$token-scale-600` (24px)

---

## 38. Columns

**File:** `src/scss/04-patterns/01-adaptive/_columns.scss`

### Token swap

- [ ] `.columns` `gap`: `8px` → `$token-scale-400` (16px)
- [ ] `.column` `border-radius`: `4px` → `$token-border-radius-200` (note: review proposes "10px"; use `$token-border-radius-200` 8px as nearest valid token unless design confirms 10px is intentional — annotate `// design-spec proposes 10px, using nearest token $token-border-radius-200 8px`)

---

## 39. Dropdown Tags

**File:** `src/scss/04-patterns/03-interaction/dropdown/provider/_virtualselect.scss`

### Token swap

- [x] Tag chip `height`: `$token-scale-600` (24px); `display: inline-flex; align-items: center`
- [x] Tag chip `background-color`: `$token-primitives-neutral-300` → `$token-border-subtle` (#f3f3f3)
- [x] Tag chip `color`: `$token-primitives-neutral-700` → `$token-text-default`
- [x] Tag chip `border-radius`: `$token-border-radius-100`
- [x] Tag chip `font-weight`: `$token-font-weight-semi-bold` → `$token-font-weight-medium`
- [x] Tag chip `padding`: `6px 35px 6px 10px` → `0 $token-scale-200` (inline clear button, no absolute positioning)
- [x] Clear button: `background-color: transparent`; `opacity: 0.5`; `position: relative`; `margin-left: $token-scale-100`; hover `opacity: 1`
- [x] Clear icon color: `$token-primitives-neutral-400` → `$token-text-default`
- [x] Trigger `border-radius`: already updated in section 14 ✓
- [ ] Disabled tag `color`: → `$token-text-disabled`

---

## 40. TimePicker

**Files:**

- `src/scss/04-patterns/03-interaction/time-picker/_timepicker.scss`
- `src/scss/04-patterns/03-interaction/time-picker/provider/_flatpickr.scss`

### Token swap

- [x] Time row `height`: `$token-scale-1000` (40px) — standalone no-calendar mode
- [x] AM/PM button `background-color`: `var(--osui-input-background, #{$token-bg-input-default})`; `border: $token-border-size-025 solid var(--osui-input-border-color, #{$token-border-default})`; `border-radius: $token-border-radius-200`
- [x] AM/PM button `color` (default): `$token-text-subtlest`; hover/focus → `$token-text-subtle` on `$token-border-subtle` background
- [x] AM/PM button `border-radius`: `$token-border-radius-200` (8px)
- [x] Number input `color`: `$token-text-default`; separator `color: $token-primitives-neutral-700`; font-weight `$token-font-weight-semi-bold`
- [x] Dropdown `border-radius`: `$token-border-radius-100` (from global flatpickr); border/shadow matching datepicker calendar

### Motion

- [x] AM/PM button: `transition: background-color, color $token-transition-time-100 $token-transition-curve-base`
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 41. MonthPicker

**Files:**

- `src/scss/04-patterns/03-interaction/month-picker/_monthpicker.scss`
- `src/scss/04-patterns/03-interaction/month-picker/provider/_flatpickr.scss`

### Token swap

- [x] Month cell `height`: `$token-scale-1000` (40px)
- [x] Month cell `border-radius`: `$token-border-radius-200` (8px)
- [x] Selected cell `background-color`: `$token-semantics-primary-base`
- [x] Selected cell `color`: `$token-text-inverse`
- [x] Hover cell `background-color`: `$token-border-subtle` (same as `$token-bg-surface-hover` which is missing from package)
- [x] Disabled cell `background-color`: `$token-bg-input-disabled`

> **Hardcoded by design:** `min-width: 70px` on month cells sits between scale steps — keep raw value with `// design-spec` comment.

### Motion

- [x] Month cell: `transition: background-color $token-transition-time-100 $token-transition-curve-base`
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 42. DatePicker Range

**File:** `src/scss/04-patterns/03-interaction/date-picker/provider/_flatpickr.scss`

(Extends the base DatePicker flatpickr override — same file)

### Token swap

- [x] Range start/end cell `background-color`: `$token-semantics-primary-base`; `border-color: $token-semantics-primary-base`; `border-radius: $token-border-radius-200`
- [x] In-range band `background-color`: `color-mix(in srgb, #{$token-semantics-primary-base} 12%, #{$token-bg-surface-default})` — light primary tint; `border-radius: $token-border-radius-0` (flat continuous band)
- [x] In-range `:before` pseudo-element band: same `color-mix` background; `left: -2px; right: -2px` for seamless connection
- [x] In-range text `color`: inherits `$token-text-default` (no override needed)
- [x] Start/end cap `:before` band: `border-radius: 50px 0 0 50px` (start) / `0 50px 50px 0` (end) for half-pill range connector shape
- [x] Today indicator: `border-color: $token-border-default` ring; hover → `$token-border-subtle` bg + `$token-semantics-primary-base` color; no fill color change at rest
- [x] Single-day range (start+end same day): `border-radius: $token-border-radius-200`; `:before` has `border-radius: 50px` (full pill)

---

## 43. Header

**Files:** `src/scss/02-layout/_header.scss`, `src/scss/02-layout/_menu-header-logo.scss`

### Token swap

- [ ] Header `background-color`: legacy `--background-color-header` → read through `--os-color-background-header` bridge var (already wired to `$token-bg-surface-default`)
- [ ] Header `box-shadow`: none → `$token-elevation-1`
- [ ] Header `padding`: → `$token-scale-200` / `$token-scale-400` / `$token-scale-600` (per breakpoint)
- [ ] Menu icon line `height`: `3px` → `$token-border-size-075` (annotate if no exact match)
- [ ] Menu icon line `width`: `24px` → `$token-scale-600`
- [ ] Menu icon line `margin`: `2px 0` → `$token-scale-050`
- [ ] Menu icon line `border-radius`: `20px` → `$token-border-radius-full`
- [ ] Menu icon / back button `color`: → `$token-text-subtlest`
- [ ] App logo `border-radius`: → `$token-border-radius-100` (4px)

> **Hardcoded by design:** logo `max-width: 120px` — no scale token for this; keep raw value with `// design-spec` comment.

---

## 44. Tag

**File:** `src/scss/04-patterns/02-content/_tag.scss`

### Token swap

- [ ] `--osui-tag-on-light-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [ ] Height (small) `24px` → `$token-scale-600`; (medium) `32px` → `$token-scale-800`; (large) `40px` → `$token-scale-1000`
- [ ] `min-width: 32px` → `$token-scale-800`
- [ ] Icon gap: → `$token-scale-100` (4px)
- [ ] Solid variant text `color`: → `$token-text-inverse`
- [ ] `letter-spacing: 0.01em` — no system token; annotate `// design-spec`

---

## 45. User Avatar

**File:** `src/scss/04-patterns/02-content/_user-avatar.scss`

### Token swap

- [ ] `--osui-avatar-on-light-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [ ] Size (small) `24px` → `$token-scale-600`; (default) `32px` → `$token-scale-800`; (medium) `40px` → `$token-scale-1000`
- [ ] `border-radius` variants: full → `$token-border-radius-full`; soft → `$token-border-radius-200`; none → `$token-border-radius-0`

---

## 46. Section

**File:** `src/scss/04-patterns/02-content/_section.scss`

### Token swap

- [ ] `--osui-section-title-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [ ] Section title `font-size`: → `$token-font-size-500` (1.25rem / 20px)
- [ ] Section title `font-weight`: → `$token-font-weight-semi-bold`
- [ ] Section title `padding-bottom`: → `$token-scale-200` (8px)
- [ ] Section title `border-bottom`: → `$token-border-size-025 solid $token-border-default`
- [ ] `.section-group .section-title` `background-color`: legacy `--background-color-body` → `$token-bg-body`
- [ ] `font-size: calc($token-font-size-700 - 2px)` (tablet) — fragile arithmetic; confirm responsive font-size tokens or annotate `// design-spec`

---

## 47. Chat Message

**File:** `src/scss/04-patterns/02-content/_chat-message.scss`

### Token swap

- [x] Received bubble `--osui-chat-message-background`: `$token-primitives-neutral-300` → `$token-bg-neutral-subtle-default` (#eae9e9; plan referenced `subtlest` which = white — wrong token)
- [x] `--osui-chat-message-border-radius`: `$token-border-radius-100` (4px) → `$token-border-radius-200` (8px)
- [x] Avatar `border-radius`: `50%` → `$token-border-radius-full`
- [x] Sent bubble: already `$token-semantics-primary-base` + `$token-text-inverse` via CSS API vars
- [ ] Bubble `border-radius`: → `$token-border-radius-200` (8px)
- [ ] Bubble `padding`: → `$token-scale-300` (12px)
- [ ] Status text `color`: → `$token-text-subtlest`
- [ ] Status text `font-size`: → `$token-font-size-275` (11px — annotate if no exact token match)
- [ ] Is-read indicator `color`: → `$token-semantics-success-base`
- [ ] Photo `height`/`width`: `40px` → `$token-scale-800` (32px, matches UserAvatar default)
- [ ] Photo `border-radius: 50%` — annotate `// design-spec: circular avatar`
- [ ] Bubble `max-width: 600px` — annotate `// design-spec: max bubble width`

---

## 48. Animated Label

**File:** `src/scss/04-patterns/03-interaction/animated-label/_animated-label.scss`

### Token swap

- [x] Container `height`: → `$token-scale-1000` (40px) — via `.animated-label-input:not(:has(textarea)) { height: $token-scale-1000 }`
- [x] Container `border`: → `$token-border-size-025 solid var(--osui-animated-label-border-color)` (defaults to `$token-border-input-default`)
- [x] Container `border-radius`: → `var(--osui-input-border-radius, #{$token-border-radius-200})` — inherits shared input CSS API
- [x] Container `background-color`: → `var(--osui-input-background, #{$token-bg-input-default})` — inherits shared input CSS API
- [x] Label (rest) `color`: → `var(--osui-input-color, #{$token-text-default})`; `font-size`: → `$token-font-size-350`; `font-weight`: → `$token-font-weight-regular`
- [x] Label (active/floated) `font-size`: → `$token-font-size-300`; `font-weight`: → `$token-font-weight-medium`
- [x] Error `border-color`: → `$token-semantics-danger-base`
- [x] `top: 8px` / `top: -10px` label offsets — replaced by outlined variant (`top: 50%; transform: translateY(-50%)` at rest; `top: 0; transform: translateY(-50%)` when active)
- [x] `top: 14px` (tablet/phone rest) — retained as-is for legacy underline context; outlined variant overrides via cascade
- [x] Validation message `bottom: 7px` — replaced by `position: absolute; top: calc(100% + #{$token-scale-100})`

### Motion

- [x] Label active: `transition: top $token-transition-time-200 ease, font-size $token-transition-time-200 ease, color $token-transition-time-100 ease, transform $token-transition-time-200 ease`; `transition: all` removed
- [x] Container: `transition: border-color $token-transition-time-100 ease`
- [x] Add `@media (prefers-reduced-motion: reduce)` zero-out — added for both `.animated-label` and `.animated-label-text`

---

## 49. Overflow Menu

**File:** `src/scss/04-patterns/03-interaction/overflow-menu/_overflowmenu.scss`

### Token swap

- [ ] Trigger `width` (desktop) `32px` → `$token-scale-800`; (tablet/phone) `40px` → `$token-scale-1000`
- [ ] Trigger + menu `border-radius`: → `$token-border-radius-200` (8px)
- [ ] Link row `padding`: → `$token-scale-200` / `$token-scale-400`
- [ ] Menu `background-color`: → `$token-bg-surface-default`
- [ ] Menu `color`: → `$token-text-default`
- [ ] Hover row `background-color`: → `$token-bg-neutral-subtle-default`
- [ ] Menu `box-shadow`: → `$token-elevation-2`
- [ ] `--border-radius-rounded: 16px` — legacy-style var, no `--osui-` prefix; rename to `--osui-overflow-menu-shape`; `16px` has no exact token (nearest `$token-border-radius-300` 12px) — confirm with design
- [ ] `--osui-overflow-menu-min-width: 170px` — annotate `// design-spec: component-specific min-width`

---

## 50. Dropdown Search

**File:** `src/scss/04-patterns/03-interaction/search/_search.scss`

### Token swap

- [ ] Selected row `background-color`: → `$token-bg-surface-active`
- [ ] Focused row `background-color`: → `$token-bg-surface-hover`
- [ ] Disabled `color`: → `$token-text-disabled`
- [ ] Dropdown `box-shadow`: → `$token-elevation-2`
- [ ] `-servicestudio-border-radius: 4px` → `$token-border-radius-100`
- [ ] `-servicestudio-height: 40px` (×2) → `$token-scale-1000`
- [ ] Confirm border-radius inherits correctly from Input when updated to `$token-border-radius-200`

### Motion

- [ ] Border-color: `transition: border-color $token-transition-time-100 $token-transition-curve-base`
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 51. Table

**File:** `src/scss/03-widgets/_table.scss`

### Token swap

- [x] `th { height: 48px }` → `$token-scale-1200`
- [x] `td { height: 56px }` → `$token-scale-1400`
- [x] `.table-row-small td { height: 48px }` → `$token-scale-1200`
- [x] `.table-row-medium td { height: 64px }` → `$token-scale-1600`
- [ ] `--osui-table-row-hover-background`: `#{$token-bg-input-disabled}` is semantically wrong for hover; update to `#{$token-border-subtle}`
- [ ] `table-row-selected` gradient `linear-gradient(rgba(255,255,255,0.9), ...)` — annotate `// design-spec: 90% white overlay for selected row`
- [ ] `td:before { margin-right: 10px; max-width: 110px; min-width: 110px }` (mobile stacked) — annotate `// design-spec: mobile label column width`

---

## 52. Sidebar

**File:** `src/scss/04-patterns/04-navigation/sidebar/_sidebar.scss`

### Token swap

- [ ] `--osui-sidebar-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [ ] `--overlay-opacity: 0` — rename to `--osui-sidebar-overlay-opacity` for namespace consistency
- [ ] `max-width: 85vw` (phone) — annotate `// design-spec: max sidebar width on phone`
- [ ] `padding-top: #{android-safe-area-top()}` — confirm matches `--os-safe-area-top` indirection used elsewhere

### Motion

- [ ] Closed: replace `transition: all 130ms ease-in` → `transform, opacity $token-transition-time-100 $token-transition-curve-base`; annotate `// token gap: 130ms`
- [ ] Open: `transition: transform $token-transition-time-350 $token-transition-curve-base`; annotate `// token gap: 330ms`
- [ ] Overlay: `transition: opacity $token-transition-time-100 $token-transition-curve-base`
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## Acceptance criteria

Each component's changes are complete when:

1. `npm run build` compiles without SCSS errors.
2. `npm run lint` reports zero warnings for the changed files.
3. No hardcoded hex / raw px / rem values appear in changed lines where a `$token-*` equivalent exists.
4. Every new `transition` has a corresponding `@media (prefers-reduced-motion: reduce)` block.
5. Every new `--osui-{component}-{prop}` CSS API var is declared with a `$token-*` default (interpolated with `#{}`), and the property value reads from `var(--osui-*)`.

---

## Review passes

### Pass 1 — Functional tests (current)

Cross-reference each component's checklist items against the functional test suite at `https://eng-starter-apps-dev.outsystems.app/AT_OSUIFunctional/Home`. For each component, note which checklist items touch something a test exercises, and flag any item that is likely to regress.

Add findings inline under each component section as a **"Functional test notes"** block.

### Pass 2 — Accessibility (todo)

After Pass 1 changes are implemented:

- Verify focus ring visibility meets WCAG 2.1 AA (3:1 contrast ratio against adjacent colours) for every component that received a new focus ring token.
- Confirm `color-mix()` focus halos are legible — if `$token-semantics-primary-base` (#105cef) at 22% opacity on white does not meet 3:1, switch to a pre-computed `rgba()` fallback.
- Check keyboard navigation order is unaffected by any layout changes (Button height, Pagination size, etc.).
- Confirm `aria-*` attributes and roles are not disturbed by structural changes (Accordion, Tabs, Wizard, Section Index).
- Verify `prefers-reduced-motion` blocks are in place for every new transition added in Pass 1.

### Pass 3 — RTL (todo)

After Pass 2 is signed off:

- Run through each component that has an `.is-rtl` block and confirm new spacing / layout changes mirror correctly.
- Pay particular attention to: Breadcrumbs (separator direction), Pagination (button order), Accordion (caret), Timeline (connector alignment), Sidebar (left/right transform), Input With Icon (icon slot side).
- Confirm logical properties (`margin-inline-start`, `inset-inline`) were used where introduced in Pass 1, rather than `margin-left` / `left`.

---

## Open issues and future work

This section tracks blockers, token gaps, design questions, and cross-cutting concerns that cannot be resolved within this implementation pass. Update it as things are resolved or new issues are found.

---

### Missing foundations — not yet in SCSS

These items exist in the proposed CSS but are absent from the current codebase. They are prerequisites for other component changes.

| Item                                                           | Where                                                                    | Action                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-focus-outer` global a11y token                        | `src/scss/01-foundations/_root.scss`                                     | **Done.** Added as `--color-focus-outer: var(--osui-border-focus-halo)` — all `has-accessible-features :focus` rules and per-component focus overrides now reference this var. Do **not** reference `$token-primitives-yellow-500` in any new focus rule. |
| `--osui-bg-neutral-subtlest: #f5f5f5`                          | `src/scss/01-foundations/_root.scss`                                     | Added as `--osui-*` future-token candidate (never use `--token-*` prefix for hand-declared vars)                                                                                                                                                          |
| Icon library vars (`--osui-icon-font-family`, `--osui-icon-*`) | `src/scss/01-foundations/_root.scss` or new `_icon-library.scss` partial | Entire system is missing; proposed CSS defines FontAwesome and Phosphor vars at root                                                                                                                                                                      |

**Action:** Implement `_root.scss` additions first (they unblock other components). Icon library vars are a separate partial — create `src/scss/01-foundations/_icon-library.scss` and register it in the ScssStructure spec.

---

### Missing motion duration tokens

The `outsystems-design-tokens` package is missing these durations. Affected component items use the raw ms value with `/* token gap */` until the tokens land.

| Missing token                | Value  | Needed by                                                  |
| ---------------------------- | ------ | ---------------------------------------------------------- |
| `$token-transition-time-120` | 120 ms | List hover, Master Detail hover, Pagination button, Link   |
| `$token-transition-time-180` | 180 ms | Checkbox, Switch track/thumb, Input, Textarea              |
| `$token-transition-time-400` | 400 ms | Accordion open/close, Flip Content, Progress Circle stroke |

**Action:** Request these three additions in the `outsystems-design-tokens` repo. Once merged and the package version bumped, do a find-and-replace of `/* token gap */` occurrences for those durations.

---

### Missing color / surface tokens

| Proposed token name         | Value     | Needed by                                 |
| --------------------------- | --------- | ----------------------------------------- |
| `$token-bg-surface-subtle`  | `#fafbfc` | Card `.card-bottom` background            |
| `$token-border-neutral-200` | `#e5e7eb` | Card border                               |
| (no name yet)               | `#b4b4b4` | DatePicker prev/next month day text color |

**Action:** Raise with the design-tokens team. Until tokens exist, keep raw hex values with `// TODO: token gap` comments.

---

### No backdrop-filter token

The Popup design specifies `backdrop-filter: blur(4px)` on the scrim. The token system has no backdrop-filter token. The blur value is hardcoded for now.

**Action:** Determine if a scrim/blur token belongs in the package or stays as a component-level constant.

---

### Scrim / overlay colour unification

Bottom Sheet, Popup, and any future drawer pattern each currently define their own scrim opacity (`rgba(0,0,0,0.25)`, `rgba(15,23,42,0.45)`, etc.). These should share a single source.

**Action:** Agree on one scrim token (or `--osui-scrim-color` component API var with a shared default) and apply it consistently across Bottom Sheet, Popup, and any future overlay component.

---

### Design-spec values between scale steps

These values appear intentionally in the design review but have no exact token:

| Component     | Property                      | Value              | Notes                                                                         |
| ------------- | ----------------------------- | ------------------ | ----------------------------------------------------------------------------- |
| Badge         | height (small/default/medium) | 16px / 20px / 28px | Between scale steps by design                                                 |
| Gallery image | `border-radius`               | 6px                | Between `$token-border-radius-100` (4px) and `$token-border-radius-200` (8px) |
| Columns       | `border-radius`               | 10px               | Between `$token-border-radius-100` and `$token-border-radius-200`             |

**Action:** Confirm with design whether these are intentional deviations or rounding errors. If intentional, leave as raw values with `// design-spec` comments and do not request tokens (these are one-off exceptions, not reusable values).

---

### Badge `.background-violet` → `.background-purple` rename

The design review renames the class and shifts the hex (`#7048e8` → `#7c3aed`). This is a **breaking public API change** — any app using `.background-violet` will lose its styling silently.

**Action:** Decide deprecation strategy (keep `.background-violet` as an alias for one release, or rename with a changelog note). Do not rename without a decision.

---

### Tabs active item: `font-weight` → `text-shadow` trade-off

The design review proposes replacing `font-weight: 600` (causes layout reflow) with `text-shadow: 0 0 0.5px currentColor` (optical bold, no reflow). This is an unusual technique and may render inconsistently on low-DPI screens or certain font stacks.

**Action:** Validate rendering on Windows ClearType and low-DPI Android before shipping. If the optical-bold trick is unreliable, fall back to `font-weight` and accept the reflow, or reserve fixed width for the tab label.

---

### `color-mix()` browser support

Several components (Checkbox focus ring, Radio focus ring, Switch focus ring, Wizard active halo, Rating focus ring) use `color-mix(in srgb, ...)` for the 18–22% primary halo. This is baseline-available since 2023 but is not supported in browsers below Chrome 111 / Firefox 113 / Safari 16.2.

**Action:** Confirm minimum browser support targets for OSUI. If pre-2023 browsers must be supported, replace `color-mix()` with a pre-computed `rgba()` fallback.

---

### `transition: all` — global find-and-replace needed

The proposed CSS eliminates `transition: all` everywhere in favor of explicit property lists (`background-color, border-color, color …`). The current codebase has `transition: all` in at minimum: `_btn.scss`, `_inputs-and-textareas.scss`, `_floating-actions.scss`, `_submenu.scss`, `_sidebar.scss`, `_stacked-cards.scss`, `_animated-label.scss`.

**Action:** Do a repo-wide grep for `transition: all` in `src/scss/` and `src/scripts/**/scss/` and replace each occurrence with an explicit property list before finalizing any component. Using `transition: all` in production is a performance anti-pattern (triggers unnecessary repaints on every property change).

---

### `prefers-reduced-motion` implementation approach

Each component section notes adding a `@media (prefers-reduced-motion: reduce)` block. Decide whether to:

- **A) Per-component blocks** — each component zeroes its own transitions inline (current proposal).
- **B) Global reset** — a single rule in foundations zeroes all transitions/animations for reduced-motion users, and components opt back in explicitly.

**Action:** Agree on approach before implementation starts so all components are consistent.

---

### Components pending design review

These components need a design review before changes can be made.

- **Feedback Message** (`.feedback-message`, `src/scss/03-widgets/_feedback-message.scss`) — currently uses solid semantic background (`$token-semantics-info/danger/success/warning-base`) with white text. Unclear if it should follow the same tonal pattern as Alert. Needs design review.
- **Popover** (`src/scss/03-widgets/_popover.scss`) — `max-width: 350px` has no token; needs design review to confirm intended width.
- **Upload** (`src/scss/03-widgets/_upload.scss`) — not reviewed.
- **Separator** (`src/scss/04-patterns/06-utilities/_separator.scss`) — not reviewed.

---

### Components not covered by the design review

These components have no design review page. Each checklist covers issues found in the current SCSS that should be addressed regardless of the design review.

---

#### B1. Video

**File:** `src/scss/04-patterns/02-content/video/_video.scss`

10 lines, runtime CSS is empty — the file is entirely SS preview properties.

- [ ] No runtime changes needed. Confirm file intentionally contains no runtime rules.

---

#### B2. Lightbox Image

**File:** `src/scss/04-patterns/03-interaction/_lightbox-image.scss`

Runtime rules are safe-area and RTL wrappers only; nearly all rules are `-servicestudio-*`.

- [ ] `-servicestudio-background-color: rgba(0, 0, 0, 0.3)` (×2) — replace with `#{$token-backdrop}` or annotate if scrim token doesn't match
- [ ] `padding-bottom: calc(var(--os-safe-area-bottom) + 10px)` — `10px` offset is hardcoded; annotate `// design-spec`
- [ ] Focus ring: `outline: 3px solid $token-primitives-yellow-500` — confirm correct a11y token

---

#### B3. Bottom Bar Item

**File:** `src/scss/04-patterns/04-navigation/_bottom-bar-item.scss`

- [ ] `--osui-bottom-bar-border-color: #{$token-primitives-neutral-300}` — upgrade to `#{$token-border-default}` for semantic consistency
- [ ] Empty-state `color: $token-primitives-neutral-700` → `$token-text-subtlest`
- [ ] Empty-state `font-size: 12px` → `$token-font-size-300`
- [ ] Empty-state `padding: 20px` → `$token-scale-500`
- [ ] `.bottom-bar-item-text { font-size: 10px }` — no token for 10px; annotate `// token gap`
- [ ] `max-width: 150px` — annotate `// design-spec`
- [ ] Focus ring: `box-shadow: 0 0 0 3px $token-primitives-yellow-500` — confirm correct a11y token

---

#### B4. Input With Icon

**File:** `src/scss/04-patterns/03-interaction/_input-with-icon.scss`

- [ ] `--osui-input-with-icon-icon-color: #{$token-primitives-neutral-700}` — upgrade to `#{$token-text-subtle}` for semantic intent
- [ ] Icon slot `width: 40px` → `$token-scale-1000`
- [ ] `padding-left: $token-scale-1000` on input when icon present — confirm tracks icon slot; consider `--osui-input-with-icon-slot-width` var

---

#### B5. Stacked Cards

**File:** `src/scss/04-patterns/03-interaction/_stacked-cards.scss`

- [ ] `&--animatable { transition: all 400ms ease }` — replace `all` with explicit properties; duration `400ms /* token gap */`; curve `$token-transition-curve-base`
- [ ] SS preview hardcoded hex colors (`#e8f2fa`, `#37b24d`, `#c92a2a`) — replace with `--osui-stacked-cards-overlay-*-background` CSS API vars
- [ ] `-servicestudio-min-height: 225px` — annotate `// design-spec: SS preview fixed height`

---

#### B6. Floating Actions

**File:** `src/scss/04-patterns/03-interaction/_floating-actions.scss`

- [ ] `transition: all 180ms ease-out` on `.is--open .floating-actions-item` — replace `all` with `opacity, transform`; duration `180ms /* token gap */`; curve `$token-transition-curve-base`
- [ ] `transition: transform 180ms ease-out` on `.floating-actions-item-button` — duration `180ms /* token gap */`; curve `$token-transition-curve-base`
- [ ] `transition: all 180ms linear` on `.floating-button` — replace `all` with `transform, box-shadow`; duration `180ms /* token gap */`; curve `$token-transition-curve-linear`
- [ ] `transition: opacity 180ms ease-out` on `.floating-overlay` — duration `180ms /* token gap */`; curve `$token-transition-curve-base`
- [ ] `transition-delay: calc(var(--delay) * 40ms)` — `40ms` is a stagger multiplier; annotate `// design-spec: stagger delay`
- [ ] `filter: brightness(0.9)` for hover — same issue as Button; explicit hover token preferred but no token exists; annotate `// TODO: replace with explicit hover token when available`
- [ ] `.floating-button { height: 56px; width: 56px }` — no `$token-scale-*` for 56px (sits between `scale-1200` 48px and `scale-1400` 56px if it exists); check `_variables.scss` and tokenize or annotate
- [ ] `.floating-actions-item-button { height: 40px; width: 40px }` — tokenize to `$token-scale-1000`
- [ ] Focus ring: `box-shadow: 0 0 0 3px $token-primitives-yellow-500` — confirm correct a11y token

---

#### B7. Submenu

**File:** `src/scss/04-patterns/04-navigation/submenu/_submenu.scss`

- [ ] `--osui-submenu-header-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [ ] `--osui-submenu-active-border-color: var(--osui-submenu-active-border-color)` — self-referential; add `$token-*` fallback: `#{$token-semantics-primary-base}`
- [ ] `transition: all 150ms linear` (×2 on header/header item) — replace `all` with `color, border-color`; duration `$token-transition-time-150`; curve `$token-transition-curve-linear`
- [ ] `transition: all 130ms ease-out` on `__items` — replace `all` with `opacity, transform`; duration `$token-transition-time-100`; curve `$token-transition-curve-base`; annotate `// token gap: 130ms`
- [ ] `__items { border-radius: $token-border-radius-100 }` — confirm whether this should follow the 8px update to `$token-border-radius-200`
- [ ] `__items { transform: translateY(-8px) }` — annotate `// design-spec`
- [ ] `a { padding: $token-scale-200 $token-scale-400 }` — already tokenized ✓
