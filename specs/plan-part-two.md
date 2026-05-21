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
| `$token-font-size-200`                                                                                                                              | `0.625rem` (10px)                          | Badge small font size; Icon Badge `.badge` font size; Tag small font size; User Avatar small font size (hardcoded `0.625rem` for now)                                                                                                     |
| `$token-opacity-disabled`                                                                                                                           | `0.45`                                     | Button disabled opacity                                                                                                                                                                                                                   |
| `$token-semantics-primary-hover`                                                                                                                    | `#0b47b8`                                  | Button primary hover background; Button secondary hover color                                                                                                                                                                             |
| `$token-bg-surface-subtle`                                                                                                                          | `#fafbfc`                                  | Card bottom background                                                                                                                                                                                                                    |
| Scale token for `14px`                                                                                                                              | `14px`                                     | Card bottom padding (gap between `scale-300` 12px and `scale-400` 16px)                                                                                                                                                                   |
| `$token-border-radius-150`                                                                                                                          | `6px`                                      | Gallery image radius (gap between `border-radius-100` 4px and `border-radius-200` 8px)                                                                                                                                                    |
| `$token-font-size-275`                                                                                                                              | `11px`                                     | Chat List status text                                                                                                                                                                                                                     |
| Muted calendar day color                                                                                                                            | `#b4b4b4`                                  | DatePicker prev/next month day text                                                                                                                                                                                                       |
| `$token-bg-surface-hover`                                                                                                                           | `#f3f3f3` (same as `$token-border-subtle`) | DatePicker day hover background; List item hover background (using `$token-border-subtle` as substitute)                                                                                                                                  |
| Radio disabled+checked color                                                                                                                        | `#8b8b8b`                                  | Radio button disabled+checked state                                                                                                                                                                                                       |
| Backdrop-filter blur token                                                                                                                          | `blur(4px)`                                | Popup scrim                                                                                                                                                                                                                               |
| `$token-font-line-height-default`                                                                                                                   | `1.4`                                      | Input labels, helper text, validation message (hardcoded `1.4` for now)                                                                                                                                                                   |
| `$token-border-subtle` **value mismatch**                                                                                                          | `#e0e0e0` (neutral-300)                    | Package maps `$token-border-subtle` → neutral-100 (#f3f3f3); design uses neutral-300. Card border, Card Sectioned divider, DatePicker/MonthPicker today ring, Table border all use `$token-primitives-neutral-300` as a workaround.        |
| `$token-bg-surface-active`                                                                                                                         | ~`#e8e8e8`                                 | Master Detail active row background (colour-mix workaround used for now)                                                                                                                                                                  |
| `$token-bg-surface-hover`                                                                                                                           | `#f3f3f3`                                  | Submenu hover backgrounds; resolved as `$token-primitives-neutral-100` (#f3f3f3) — same value, no semantic token exists                                                                                                                    |
| `$token-elevation-50`                                                                                                                               | `0 1px 2px rgba(0,0,0,.2)`                 | Switch thumb resting shadow (hardcoded `rgba` for now)                                                                                                                                                                                    |
| `$token-elevation-25`                                                                                                                               | `0 1px 2px rgba(0,0,0,.08)`                | Switch thumb disabled shadow (hardcoded `rgba` for now)                                                                                                                                                                                   |

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

- [x] `--osui-blank-slate-description-color`: `#{$token-text-default}`
- [x] `--osui-blank-slate-icon-color`: `#{$token-text-disabled}`
- [x] Spacing: `$token-scale-0`, `$token-scale-400`, `$token-scale-1200` throughout
- [x] Icon `font-size: 70px` / `120px` — annotated `// design-spec: no icon-size token at this scale`

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
- [x] `.btn-success`: CSS API vars using `var(--ion-color-success, #{$token-bg-success-base-default})` / `$token-text-inverse` — Ionic fallback first
- [x] `.btn-error`: CSS API vars using `var(--ion-color-danger, #{$token-bg-danger-base-default})` / `$token-text-inverse` — Ionic fallback first
- [x] `.btn-cancel`: CSS API vars using `$token-bg-surface-default` / `$token-text-subtle` / `$token-border-default`
- [x] `[disabled]`: `opacity: 0.45; pointer-events: none` on `.btn[disabled]` — fades any variant in place, no color override needed. Token gap: `$token-opacity-disabled` missing from package.
- [x] `.btn-neutral` and `.btn-circle` — not added; these are new variants beyond the token migration scope

### Component CSS API vars

- [x] Declared at `.btn` root: `--osui-btn-height`, `--osui-btn-background`, `--osui-btn-color`, `--osui-btn-border-color`, `--osui-btn-border-radius`, plus per-variant vars for primary/success/error/cancel

### Hover

- [x] Secondary (default outline) hover: `--osui-btn-border-color: #{$token-semantics-primary-800}` (desktop only) — darkens border via CSS API var; primary/success/error use their own border vars so unaffected
- [x] Success/error hover: `filter: brightness(0.9)` scoped to `.desktop` — darkens colored background
- [x] Utility `[class*="background-"]` hover: `filter: brightness(0.9)` scoped to `.desktop`
- [x] Primary hover: `background-color: #0b47b8; border-color: #0b47b8` (hardcoded; `$token-semantics-primary-hover` missing from package) — global rule, no filter
- [x] Cancel hover: `border-color: $token-border-input-default` — border darkens (neutral-400 → neutral-600); no background, color, or shadow change

### Motion

- [x] Base transition: `background-color, border-color, color` at `$token-transition-time-100`
- [x] Cancel transition: `border-color, color, box-shadow` at `$token-transition-time-150` (separate from base to animate box-shadow on cancel hover)

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

### Motion

- [x] `transition: all` → `transition: transform` — explicit property list; `630ms` and `cubic-bezier(0.03, 0.01, 0.67, 1.97)` kept as-is, no matching tokens

---

## 16. Form

**File:** `src/scss/03-widgets/_form.scss`

### Token swap

- [~] All proposed values not found in current file — appear to be platform-injected; no changes

---

## 17. Gallery

**File:** `src/scss/04-patterns/02-content/gallery/_gallery.scss`

### Token swap

- [~] `.gallery-img border-radius` — selector not found in current file; no changes

---

## 18. Icon Badge

**File:** `src/scss/04-patterns/05-numbers/_icon-badge.scss`

### Token swap

- [x] Badge position: `@include absolute-left-top(45%, 0)` → `position: absolute; top: 0; right: 0; left: auto`
- [x] Badge layout: added `display: inline-flex; align-items: center; justify-content: center`
- [x] `height: 18px` → `$token-scale-400` (16px)
- [x] `min-width: 18px` → `$token-scale-400` (16px)
- [x] `font-weight`: added `$token-font-weight-bold`
- [x] `transform: translateY(-40%)` → `translate(50%, -50%)`
- [x] Ring shadow: `0 0 0 2px var(--osui-icon-badge-ring-color)` (CSS API var defaulting to `#{$token-bg-surface-default}`)
- [~] `font-size: 0.625rem` hardcoded — `$token-font-size-200` not in package (see missing tokens table)

---

## 19. Input

**File:** `src/scss/03-widgets/_inputs-and-textareas.scss`

### Token swap

- [x] `[data-input]` `height`: confirmed `$token-scale-1000` (40px)
- [x] `[data-input]` `border-radius`: already `var(--osui-input-border-radius)` → `$token-border-radius-200` ✓
- [x] `--osui-input-color`: already `#{$token-text-default}` ✓
- [x] `--osui-input-border-color` default: `#{$token-border-input-default}` → `#{$token-border-default}` (matches reference)
- [x] Hover: `border:` shorthand → `border-color: $token-border-input-default`
- [x] Focus: `border:` shorthand → `border-color: var(--osui-input-focus-border-color); outline: none`
- [x] Disabled: already via CSS API vars (`$token-bg-input-disabled`, `$token-border-default`, `$token-text-disabled`) ✓
- [x] Error: already via `var(--osui-input-error-border-color)` → `$token-semantics-danger-base` ✓
- [x] `[data-input].input-small` `height`: → `$token-scale-800` (32px)
- [x] `[data-input].input-large` `height`: → `$token-scale-1200` (48px)

### Label and helper text

- [x] `.form label` / `[data-label]`: `font-size: $token-font-size-350`; `font-weight: $token-font-weight-semi-bold`; `color: $token-text-default`; `line-height: 1.4`
- [x] `.help-block` / `.input-helper`: `font-size: $token-font-size-300`; `color: $token-text-subtlest`; `margin-top: $token-scale-100`; `line-height: 1.4`
- [x] `span.validation-message`: `color: $token-semantics-danger-base`; `margin-top: $token-scale-100`; `display: block`
- [x] `.text-error` `font-size: $token-font-size-300` (12px) — added to `_colors-semantic.scss` as explicit rule after loop

### Motion

- [x] `transition: all 180ms linear` → `border-color $token-transition-time-100 $token-transition-curve-base, background-color $token-transition-time-100 $token-transition-curve-base`
- [x] `@media (prefers-reduced-motion: reduce)` zero-out added

### Token gaps

- [~] `line-height: 1.4` hardcoded on labels/helper — `$token-font-line-height-default` not in package (see missing tokens table)

---

## 20. Link

**File:** `src/scss/01-foundations/_html-elements-link.scss`

### Token swap

- [x] `color`: already `$token-semantics-primary-base` ✓
- [~] `[data-link]` text-decoration styles — removed per decision; not applied
- [~] `:focus-visible` outline on `[data-link]` — not in reference CSS; skip
- [~] `transition: color 120ms` — reference keeps `all 180ms linear` on `a`; no change

---

## 21. List

**File:** `src/scss/03-widgets/_list.scss` and `_list-item.scss`

### Token swap

- [x] `--osui-list-item-hover-background`: `$token-bg-neutral-subtle-default` → `$token-border-subtle` (#f3f3f3); token gap: `$token-bg-surface-hover` missing (see table)
- [x] CSS API simplified: removed `--osui-list-item-ripple-color`, `--osui-list-item-ripple-size`, `--osui-list-item-selected-overlay`
- [x] `.scale-animation` ripple: `rgba(0,0,0,0.1)` → `color-mix(in srgb, #{$token-text-default} 10%, transparent)`; `height/width` hardcoded `10px`
- [x] Selected state: gradient overlay → `color-mix(in srgb, #{$token-semantics-primary-base} 10%, #{$token-bg-surface-default})`
- [x] High-contrast border: `var(--color-focus-outer)` → `$token-semantics-primary-base`
- [~] Row padding: already `$token-scale-600` ✓
- [~] Divider border-color: already `$token-border-default` ✓
- [~] Avatar–text gap / subtext color: not found in file

### Motion

- [x] `transition: background-color $token-transition-time-100 $token-transition-curve-base` added to `.list-item`
- [x] `@media (prefers-reduced-motion: reduce)` — zeroes transition and animation

---

## 22. Master Detail

**File:** `src/scss/04-patterns/01-adaptive/_master-detail.scss`

### Token swap

- [x] Wrapper `box-shadow` / `border`: remove
- [x] Wrapper `border-radius`: `8px` → `0`
- [x] List-item `padding`: `16px` all → `$token-scale-300` top/bottom · `$token-scale-600` left/right
- [x] Selected item: active indicator left border → full-width tint `color-mix(in srgb, #{$token-semantics-primary-base} 8%, transparent)`
- [x] Selected item `font-weight`: → `$token-font-weight-semi-bold`
- [x] Trailing indicator: swap filled arrow → stroked caret glyph via `var(--osui-icon-chevron-right)`

### Motion

- [x] `.list-item` `transition: background-color $token-transition-time-100 $token-transition-curve-base`

---

## 23. Notification

**File:** `src/scss/04-patterns/03-interaction/notification/_notification.scss`

### Token swap

- [x] Container `background-color`: → `$token-bg-surface-default`
- [x] Container `border-radius`: → `$token-border-radius-100` (4px) — kept from original
- [x] Container `padding`: → `$token-scale-600` (24px) — kept from original
- [x] Text `color`: → `$token-text-default`
- [x] Type variants added (info/success/error/warning) matching Alert pattern: `$token-bg-{type}-subtle-default` + `$token-text-{type}`

---

## 23b. Feedback Message

**File:** `src/scss/03-widgets/_feedback-message.scss`

### Token swap

- [x] Default `background`: `transparent` → `$token-bg-surface-default`
- [x] Default `color`: `$token-text-inverse` → `$token-text-default`
- [x] `border-radius`: `$token-border-radius-100` → `$token-border-radius-200`
- [x] `font-size`: `$token-font-size-450` → `$token-font-size-350`
- [x] `font-weight`: `regular` → `$token-font-weight-medium`
- [x] `padding`: `$token-scale-400` → `$token-scale-300 $token-scale-400`
- [x] Layout: added `display: flex`, `gap: $token-scale-200`; removed `padding-left` on `.feedback-message-text`
- [x] Type variants: solid `$token-semantics-*-base` → `$token-bg-{type}-subtle-default` + `$token-text-{type}`, matching Alert pattern
- [x] Direct `background-color` + `color` added to each variant rule to override app-level CSS with same specificity

---

## 24. Pagination

**File:** `src/scss/04-patterns/04-navigation/_pagination.scss`

### Token swap

- [x] Pagination button size: `$token-scale-900` via `--osui-pagination-button-size`
- [x] Button `border-radius`: `$token-border-radius-200`
- [x] Rest button border: transparent (effectively removed)
- [x] Rest button `color`: `$token-text-default` via CSS API var
- [x] Rest button `font-weight`: `$token-font-weight-medium` via CSS API var
- [x] Active button `border-color`: `$token-border-default` via CSS API var
- [x] Active button `color`: `$token-text-default` via CSS API var
- [x] Hover button `background-color`: `$token-border-subtle` via CSS API var
- [x] Button `margin-left`: `$token-scale-100`
- [x] Ellipsis width: `$token-scale-400`

### Motion

- [x] `transition: background-color $token-transition-time-100 ease, border-color $token-transition-time-100 ease` on `.pagination-button`; `@media (prefers-reduced-motion)` zero-out added

---

## 25. Popup / Modal

**File:** `src/scss/03-widgets/_popup.scss`

### Token swap

- [x] Modal `border-radius`: `$token-border-radius-200` (8px) via `--osui-popup-border-radius`
- [x] Backdrop `background`: `$token-backdrop`
- [x] Shadow: `$token-elevation-4` via `--osui-popup-shadow`
- [x] Padding: `$token-scale-600` via `--osui-popup-padding`
- [x] Background: `$token-bg-surface-default` via `--osui-popup-background`

---

## 26. Progress Bar

**File:** `src/scss/04-patterns/05-numbers/progress/_progressbar.scss`

### Token swap

- [x] Track `background-color`: driven by `var(--trail-color)`; servicestudio fallback `$token-border-subtle`
- [x] Fill colors: driven by `var(--progress-color)`; servicestudio fallback `$token-semantics-primary-base`
- [x] Track `border-radius`: `calc(var(--shape) / 2)` — shape driven by TS; servicestudio fallback `$token-border-radius-full`
- [x] Thickness steps: driven by `var(--thickness)` set by TS

### Motion

- [x] Fill animation: driven by `var(--progress-speed)` set by TS; transition-delay via `var(--progress-initial-speed)`

---

## 27. Progress Circle

**File:** `src/scss/04-patterns/05-numbers/progress/_progresscircle.scss`

### Token swap

- [x] Trail stroke: `var(--trail-color, #{$token-primitives-neutral-300})`
- [x] Progress stroke: `var(--progress-circle-gradient-url, var(--progress-color, #{$token-semantics-primary-base}))`; semantic colour variants driven by TS via `--progress-color`

### Motion

- [x] `transition: stroke-dashoffset 0` by default; animated via `transition-duration: var(--progress-speed, 0.35s)` set by TS

---

## 28. Radio Button

**File:** `src/scss/03-widgets/_radio-button.scss`

### Token swap

- [x] Border: `$token-border-size-025 solid var(--osui-radio-border-color)` where border-color = `$token-border-input-default`
- [x] Control size: `--osui-radio-size: #{$token-scale-600}` (24px)
- [x] Checked indicator: `--osui-radio-indicator-border: #{$token-scale-150}` (6px) solid `$token-semantics-primary-base`
- [x] Disabled border: `$token-border-default`
- [x] Focus ring: `box-shadow: 0 0 0 $token-border-size-075 var(--osui-border-focus-halo)`
- [x] Vertical gap: `margin: $token-scale-300 0`
- [x] `transition: border-color $token-transition-time-100 $token-transition-curve-linear`; `@media (prefers-reduced-motion)` zero-out added

---

## 29. Range Slider

**File:** `src/scss/04-patterns/03-interaction/range-slider/_rangeslider.scss`  
**Provider file:** `src/scss/04-patterns/03-interaction/range-slider/provider/_noUiSlider.scss`

### Token swap

- [x] Track: `--osui-range-slider-track-color: #{$token-border-default}`
- [x] Track `border-radius`: `$token-border-radius-100`
- [x] Fill: `$token-semantics-primary-base`
- [x] Handle `border-width`: `$token-border-size-050`
- [x] Handle `border-color`: `$token-semantics-primary-base` via `--osui-range-slider-handle-border-color`
- [x] Handle `background-color`: `$token-bg-surface-default` via `--osui-range-slider-handle-background`
- [x] Tick markers: `$token-border-size-025` wide, `$token-scale-150` tall
- [x] Tick `color`: `$token-text-subtlest`
- [x] Value labels `color`: `$token-text-default` (tooltip), `$token-text-subtlest` (pip values)
- [x] Value labels `font-size`: `$token-font-size-300`

---

## 30. Rating

**File:** `src/scss/04-patterns/05-numbers/rating/_rating.scss`

### Token swap

- [x] Filled/half star colour: `--osui-rating-filled-color` (CSS API) → `--token-rating-filled-color` (internal var) set to `$token-semantics-warning-base`; colour applied via `.text-primary { color: var(--token-rating-filled-color) }` selector
- [x] Empty star colour: `--osui-rating-empty-color` (CSS API) → `--token-rating-empty-color` (internal var); `color-mix(in srgb, var(--token-rating-filled-color) 38%, #{$token-primitives-base-white})`; applied via `.text-neutral-5` selector
- [x] Disabled filled `--osui-rating-disabled-color` default: → `$token-text-disabled`
- [x] Disabled empty `--osui-rating-disabled-empty-color` default: → `$token-border-default`
- [x] Disabled empty icon `color`: `color-mix(in srgb, #{$token-text-disabled} 35%, #{$token-primitives-base-white})`
- [x] Small star `--rating-size`: `8px` → `$token-scale-300` (12px); spacing `$token-scale-100`
- [x] Item `padding`: `calc(size + --space-s)` → `calc(var(--rating-size) + #{$token-scale-200})`
- [x] Icon `vertical-align: middle` applied to `.rating .icon`
- [x] `line-height: 1` → `$token-font-line-height-full`
- [x] `calc()` interpolation fixed: bare `$token-scale-*` → `#{$token-scale-*}`
- [x] z-index vars: `--os-layer-local-tier-1` / `--os-layer-screen` → `--layer-local-tier-1` / `--layer-global-screen`
- [x] Focus ring: `var(--osui-border-focus-halo)` / `var(--color-focus-outer)` → `color-mix(in srgb, #{$token-semantics-primary-base} 22%, transparent)`
- [x] Accessible features disabled: `$token-primitives-neutral-700` → `$token-text-disabled`; empty icon → `$token-border-input-default`
- [x] High contrast: `outline` → `@include a11y-high-contrast-outline`
- [x] Reduced motion: flattened to top-level `.rating-item-filled/half/empty { transition: none }`
### Motion

- [x] Hover item: `transform: scale(1.12)` — not present in proposed reference CSS; skipped

---

## 31. Section Index

**File:** `src/scss/04-patterns/04-navigation/section-index/_sectionindex.scss`

### Token swap

- [x] Active indicator bar `background-color`: `--color-primary` → `$token-semantics-primary-base`
- [x] Rest item `color`: `color-neutral-8` → `$token-text-subtlest` (reference uses subtlest, not subtle)
- [x] Hover item `color`: `color-neutral-9` → `$token-text-default` (via new `--osui-section-index-item-color-hover` var); add hover background `color-mix(in srgb, $token-text-default 4%, transparent)`
- [x] Active item `color`: `color-neutral-9` → `$token-semantics-primary-base` (reference uses primary, not text-default); lock active color on hover with `&--is-active:hover`
- [x] Active item bold: replaced `font-weight: $token-font-weight-semi-bold` with `text-shadow: 0 0 0.5px currentColor` (faux-bold per reference — avoids layout shift)

---

## 32. Switch

**File:** `src/scss/03-widgets/_switch.scss`

### Token swap

- [x] Track: `height: $token-scale-600` (24px), `width: $token-scale-1000` (40px)
- [x] Track border: none at rest; `$token-border-size-025` border added on hover/checked states
- [x] Thumb size: `$token-scale-500` (20px)
- [x] Off-state track: `$token-border-input-default` via `--osui-switch-track-color`
- [x] On-state track: `$token-semantics-primary-base` via `--osui-switch-checked-track-color`
- [x] Focus ring: `color-mix(in srgb, #{$token-semantics-primary-base} 22%, transparent)` on `:focus-visible`
- [x] Disabled track: `$token-bg-input-disabled` via `--osui-switch-disabled-track-color`
- [x] Disabled thumb: `color-mix(in srgb, white 60%, transparent)` // token gap: $token-opacity-disabled missing
- [x] Thumb colour: `$token-primitives-base-white`

### Motion

- [x] Track: `transition: background-color $token-transition-time-200 $token-transition-curve-linear`
- [x] Thumb: `transition: transform $token-transition-time-200 $token-transition-curve-linear`
- [x] `@media (prefers-reduced-motion)` zero-out added

---

## 33. Tabs

**File:** `src/scss/04-patterns/04-navigation/tabs/_tabs.scss`

### Token swap (component CSS API var defaults)

- [x] `--osui-tabs-border-color`: `#{$token-border-default}`
- [x] `--osui-tabs-header-item-color`: `#{$token-text-subtlest}`
- [x] `--osui-tabs-header-item-color-active`: `#{$token-semantics-primary-base}`
- [x] `--osui-tabs-header-item-color-disabled`: `#{$token-text-disabled}`
- [x] `--osui-tabs-indicator-color`: `#{$token-semantics-primary-base}`
- [x] `--osui-tabs-header-item-color-hover`: `#{$token-text-default}` (new var)
- [x] `--osui-tabs-header-item-hover-background`: `color-mix(in srgb, #{$token-text-default} 4%, transparent)` (new var)

### Rules

- [x] Active item: `text-shadow: 0 0 0.5px currentColor` (no reflow)
- [x] Hover: `background-color: var(--osui-tabs-header-item-hover-background)`; `border-radius: $token-border-radius-100`
- [x] Hover `color`: `var(--osui-tabs-header-item-color-hover)`

### Motion

- [x] Header item: `transition: color $token-transition-time-200 $token-transition-curve-linear`
- [x] Indicator: `transition: transform $token-transition-time-200 $token-transition-curve-linear`
- [x] `@media (prefers-reduced-motion)` zero-out added

---

## 34. Textarea

**File:** `src/scss/03-widgets/_inputs-and-textareas.scss`

(Same file as **Input** — handled together)

### Token swap

- [x] `border-radius`: `var(--osui-input-border-radius)` = `$token-border-radius-200`
- [x] `border-color`: `var(--osui-input-border-color)` = `$token-border-default`; hover → `$token-border-input-default`
- [x] `padding`: `$token-scale-400` (all sides)
- [x] Focus: `border-color: var(--osui-input-focus-border-color)` = `$token-semantics-primary-base`
- [x] Disabled: `$token-bg-input-disabled`, `$token-border-default`, `$token-text-disabled` via CSS API vars
- [x] `.not-valid` `border-color`: `var(--osui-input-error-border-color)` = `$token-semantics-danger-base`
- [x] Character counter: `color: $token-text-subtlest`; `font-size: $token-font-size-300`

### Motion

- [x] `transition: border-color $token-transition-time-100 $token-transition-curve-base, background-color $token-transition-time-100 $token-transition-curve-base`
- [x] `@media (prefers-reduced-motion: reduce)` zero-out added

---

## 35. Timeline

**File:** `src/scss/04-patterns/04-navigation/_timeline.scss`

### Token swap

- [x] Icon container `height × width`: `24px` → `$token-scale-700` (28px); no CSS API var needed
- [x] Direct fallbacks added on `background-color`, `color` properties — `timeline-icon-line` / `timeline-icon-container` render outside `.timeline` in the DOM so CSS vars must carry their own fallback
- [x] Icon container `font-size`: already `$token-font-size-300` ✓; reference confirms 12px, not 14px
- [x] Connector `background-color`: already `var(--osui-timeline-line-color)` → `$token-bg-neutral-base-default` ✓
- [x] Connector `width`: reference keeps `1px` — no change needed
- [x] Content block `color`: already `var(--osui-timeline-text-color)` → `$token-text-subtlest` ✓
- [x] Content block `margin-bottom`: already `$token-scale-1000` (40px) ✓
- [x] `.timeline-item .timeline-content` + `.timeline-right`: add `padding-top: $token-scale-100`
- [x] `.timeline-right`: add `margin-left: $token-scale-400` + `white-space: nowrap`
- [x] `.timeline-content-inner` reset: add `margin: 0; padding: 0`
- [x] `&:empty` dot margin: `margin-top` → `margin: 10px $token-scale-600 0` (10px top is design-spec)
- [x] `.background-*`, timestamp, `.timeline-avatar`, `.is-upcoming`, card variant: not present in reference — skipped

---

## 36. Tooltip / Balloon

**Files:**

- `src/scss/04-patterns/03-interaction/tooltip/_tooltip.scss`
- `src/scss/04-patterns/03-interaction/balloon/_balloon.scss`

### Token swap

- [x] `--osui-tooltip-background`: fixed missing `#{}` interpolation → `#{$token-text-default}`
- [x] `--osui-tooltip-color`: already `#{$token-text-inverse}` ✓
- [x] `--osui-tooltip-border-radius`: initial `#{$token-border-radius-100}`; override block sets `#{$token-border-radius-200}` (design-spec asymmetric padding `6px 12px` also in override block)
- [x] `--osui-tooltip-padding`: initial `#{$token-scale-200}`; override block sets `6px 12px` // design-spec
- [x] `--osui-tooltip-max-width`: reference keeps `max-width: 250px` hardcoded — no CSS API var added
- [x] z-index: `--os-layer-global-negative` restored to `--os-layer-global-negative` ✓ (corrected from wrong `--layer-global-negative`)
- [x] `@keyframes osui-tooltip-in` entrance animation added (`opacity: 0 → 1`, 150ms)
- [x] `.osui-tooltip .osui-balloon--is-open` animation applied
- [x] `@media (prefers-reduced-motion: reduce)` guard added
- [x] Balloon z-index: `--os-layer-elevated` kept (already correct)

---

## 37. Wizard

**File:** `src/scss/04-patterns/04-navigation/_wizard.scss`

### Token swap

- [x] Add `--osui-wizard-icon-size: #{$token-scale-1000}` (40px) CSS API var
- [x] Icon bubble size: `32px` → `var(--osui-wizard-icon-size, #{$token-scale-1000})` (40px per reference; plan had wrong 36px)
- [x] Icon bubble border: already `$token-border-size-050 solid var(--osui-wizard-icon-border-color)` via CSS API ✓
- [x] Glyph `.icon font-size`: `$token-font-size-300` → `$token-font-size-400` (reference confirms 1rem/16px)
- [x] z-index: `--os-layer-local-tier-1` → `--layer-local-tier-1`; `--os-layer-screen` → `--layer-global-screen`
- [x] Connector `right/width` calcs: hardcoded `12px/24px` → `var(--osui-wizard-icon-size, ...) / 2` and `100% - var(...)`
- [x] Add `:has(.wizard-item-icon:empty):before` connector adjustment for dot-only items
- [x] Active state: add `box-shadow: 0 0 0 $token-scale-100 color-mix(in srgb, var(--osui-wizard-active-color) 15%, transparent)`
- [x] Active label: add `font-weight: $token-font-weight-semi-bold`; `color: $token-text-default` ✓
- [x] Past label: `color: $token-text-subtlest` ✓ (reference uses subtlest, not subtle)
- [x] Vertical connector: `bottom` calc updated to use `--osui-wizard-icon-size`; `18px` overhang annotated `// design-spec`
- [x] Disabled state, `.next` icon color: already `$token-text-disabled` ✓; disabled state not in reference — skipped

---

## 38. Columns

**File:** `src/scss/04-patterns/01-adaptive/_columns.scss`

### Token swap

- [x] `.columns` `gap`: not present in current file or proposed reference — no change needed
- [x] `.column` `border-radius`: not present in current file or proposed reference — no change needed

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
- [x] Disabled tag `color`: → `$token-text-disabled`

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
- [x] Add `@media (prefers-reduced-motion: reduce)` zero-out

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
- [x] `@media (prefers-reduced-motion: reduce)` zero-out added

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

- [x] Header `background-color`: already `var(--background-color-header, var(--os-color-background-header))` ✓; reference uses `--header-color` (undefined in our root) — kept `--os-color-background-header` bridge
- [x] Header `box-shadow`: already `$token-elevation-1` ✓
- [x] Header `padding`: not present in reference — no change needed
- [x] Menu icon line `height`: `3px` → `$token-border-size-050` (2px); reference confirms 050 not 075
- [x] Menu icon line `width`: `24px` → `$token-scale-500` (20px); reference confirms 500 not 600
- [x] Menu icon line `margin: 2px 0` — kept with `// design-spec` annotation; no token at 2px
- [x] Menu icon line `border-radius`: `20px` → `$token-border-radius-full`
- [x] Menu icon width: `24px` → `$token-scale-500` (20px)
- [x] Menu icon / back button `color`: already `$token-text-subtlest` ✓
- [x] App logo: `@include app-logo` mixin already has `$token-border-radius-100`, `$token-scale-200`, `max-width: 120px` ✓
- [x] z-index: `--os-layer-navigation` kept — `--layer-global-navigation` does not exist in root; `--os-layer-navigation` is the correct var

> **Hardcoded by design:** logo `max-width: 120px` — no scale token for this; keep raw value with `// design-spec` comment.

---

## 44. Tag

**File:** `src/scss/04-patterns/02-content/_tag.scss`

### Token swap

- [x] `--osui-tag-on-light-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [x] Heights updated per proposed reference: base `$token-scale-500` (20px); small `$token-scale-400` (16px); medium `$token-scale-700` (28px) — different from plan values, reference is authoritative
- [x] `min-width: 32px` → `unset` (reference uses unset, not `$token-scale-800`)
- [x] `gap: $token-scale-100` (4px) added
- [x] `font-weight`: `$token-font-weight-semi-bold` → `$token-font-weight-medium` per reference
- [x] `font-size: $token-font-size-300` added at base; small → `$token-font-size-200`; medium → `$token-font-size-350`
- [x] `padding` updated per reference; `line-height: $token-font-line-height-full` added
- [x] `letter-spacing: 0.01em` — annotated `// design-spec`
- [x] `.background-yellow` color rule added: `var(--osui-tag-on-light-color)`

---

## 45. User Avatar

**File:** `src/scss/04-patterns/02-content/_user-avatar.scss`

### Token swap

- [x] `--osui-avatar-on-light-color: $token-text-default` — missing `#{}` interpolation; fixed to `#{$token-text-default}`
- [x] Size: base `$token-scale-800` (32px); small `$token-scale-600` (24px) with `0.625rem` (token gap: `$token-font-size-200` not in package); medium `$token-scale-1000` (40px) with `$token-font-size-400`; size selectors changed to `&.avatar-small` / `&.avatar-medium` for specificity
- [x] `font-size: $token-font-size-300` added at base level
- [x] `border-radius` variants: not in proposed reference — skipped
- [x] Per-color lightest overrides (`.background-yellow`, `.background-*-lightest`, etc.) removed — background colours handled by utility classes; only transparent/neutral context overrides retained using `var(--osui-avatar-primary-color)` / `var(--osui-avatar-on-light-color)`

---

## 46. Section

**File:** `src/scss/04-patterns/02-content/_section.scss`

### Token swap

- [x] `--osui-section-title-color: $token-text-default` — missing `#{}` interpolation; fix to `#{$token-text-default}`
- [x] Section title `font-size`: → `$token-font-size-500` (1.25rem / 20px)
- [x] Section title `font-weight`: → `$token-font-weight-semi-bold` (already correct)
- [x] Section title `padding-bottom`: → `$token-scale-200` (8px) (already correct)
- [x] Section title `border-bottom`: → `$token-border-size-025 solid $token-border-default` (already correct)
- [x] `.section-group .section-title` `background-color`: fallback updated to `var(--color-background-body)` per proposed reference
- [x] `font-size: calc($token-font-size-700 - 2px)` (tablet) — replaced with `$token-font-size-500` matching proposed reference; tablet+phone combined into single rule

---

## 47. Chat Message

**File:** `src/scss/04-patterns/02-content/_chat-message.scss`

### Token swap

- [x] Received bubble `--osui-chat-message-background`: `$token-bg-neutral-subtle-default`
- [x] `--osui-chat-message-border-radius`: `$token-border-radius-200` (8px)
- [x] Avatar `border-radius`: `$token-border-radius-full`
- [x] Sent bubble: `$token-semantics-primary-base` + `$token-text-inverse` via CSS API vars
- [x] Bubble `border-radius`: `var(--osui-chat-message-border-radius)`
- [x] Bubble `padding`: `$token-scale-400` (16px)
- [x] Status text `font-size`: `$token-font-size-300`
- [x] Photo `border-radius`: `$token-border-radius-full`
- [x] Bubble `max-width: 600px` // design-spec: max bubble width

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
- [x] Icon-aware label offset: `.animated-label:has(.input-with-icon-content-icon:not(:empty)) .animated-label-text { left: $token-scale-1000 }`
- [x] Input padding for icon variants: left-icon `padding-left: $token-scale-1000`; right-icon `padding-right: $token-scale-1000; padding-left: $token-scale-400`

---

## 49. Overflow Menu

**File:** `src/scss/04-patterns/03-interaction/overflow-menu/_overflowmenu.scss`

### Token swap

- [x] Trigger `width` (desktop): `$token-scale-800`; (tablet/phone): `$token-scale-1000`
- [x] Trigger `border-radius`: `$token-border-radius-200` via `--osui-btn-border-radius`
- [x] Link row `padding`: `$token-scale-200 $token-scale-400`
- [x] Menu `background-color`: `$token-bg-surface-default` via `--osui-overflow-menu-background`
- [x] Menu `color`: `$token-text-default` via `--osui-overflow-menu-color`
- [x] Hover row `background-color`: `$token-bg-neutral-subtle-default` via `--osui-overflow-menu-trigger-active-bg`
- [x] Menu `box-shadow`: `$token-elevation-2` via `--osui-overflow-menu-shadow`
- [x] `--osui-overflow-menu-min-width: 170px` present // design-spec
- [x] `--border-radius-rounded: 16px` — reference still uses `--border-radius-rounded`; rename not applicable

---

## 50. Dropdown Search

**File:** `src/scss/04-patterns/03-interaction/search/_search.scss`

### Token swap

- [x] Selected/focused row backgrounds and disabled color: handled via `_virtualselect.scss` (see §39)
- [x] Dropdown `box-shadow`: via balloon/elevation tokens in provider
- [x] Border-radius inherits from input token vars
- [x] `-servicestudio-border-radius: 4px` — kept as-is (servicestudio preview only)
- [x] `-servicestudio-height: 40px` — kept as-is (servicestudio preview only)

### Motion

- [x] Border-color transition handled via shared input styles

---

## 51. Table

**File:** `src/scss/03-widgets/_table.scss`

### Token swap

- [x] `th { height: 48px }` → `$token-scale-1200`
- [x] `td { height: 56px }` → `$token-scale-1400`
- [x] `.table-row-small td { height: 48px }` → `$token-scale-1200`
- [x] `.table-row-medium td { height: 64px }` → `$token-scale-1600`
- [x] `--osui-table-row-hover-background`: `#{$token-bg-input-disabled}` (note: semantically should be `$token-border-subtle` — kept as-is per user direction)
- [x] `table-row-selected`: `color-mix(in srgb, var(--osui-table-row-selected-background) 10%, #{$token-bg-surface-default})`
- [x] `td:before` mobile stacked: hardcoded `10px`/`110px` // design-spec: mobile label column width
- [x] `transition: background-color $token-transition-time-100 ease` on `td`; `@media (prefers-reduced-motion)` zero-out added
- [x] `th.sortable:focus` a11y: `box-shadow: 0 0 0 3px var(--color-focus-outer)` (legacy var — not yet migrated to color-mix)

---

## 52. Sidebar

**File:** `src/scss/04-patterns/04-navigation/sidebar/_sidebar.scss`

### Token swap

- [x] `--osui-sidebar-color: $token-text-default` — fixed to `#{$token-text-default}`
- [x] `--overlay-opacity: 0` — kept as-is; reference also uses this name; renaming would require JS changes
- [x] `max-width: 85vw` (phone) — annotated `// design-spec: max sidebar width on phone`
- [x] `padding-top: #{android-safe-area-top()}` — confirmed correct; matches safe-area indirection pattern used elsewhere (android-safe-area-top() mixin)

### Motion

- [x] Closed: replaced `transition: all 130ms ease-in` → `opacity, transform 300ms $token-transition-curve-base; // token gap: 300ms` (reference uses 300ms)
- [x] Open: replaced `transition: transform 330ms ease-out` → `transform 500ms $token-transition-curve-base; // token gap: 500ms` (reference uses 500ms)
- [x] Overlay: annotated `transition: opacity 130ms ease-in; // token gap: 130ms duration` (reference keeps 130ms)
- [x] Added `@media (prefers-reduced-motion: reduce)` zero-out

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

### A11y audit — further review needed

The current pass adds focus rings and `has-accessible-features` blocks based on the reference CSS. A deeper audit is still needed:

- Verify focus ring visibility across all interactive components (not just the ones explicitly in the reference)
- Check keyboard navigation order and trap handling for portaled components (Dropdown, DatePicker, Tooltip)
- Review ARIA attributes wired via TypeScript for correctness against WCAG 2.1 AA
- Confirm colour contrast ratios for all text/background token combinations in both light and dark themes

**Action:** Schedule a dedicated a11y review pass after the token migration is complete.

---

### Carousel pagination — a11y toggle class

Consider introducing a `.has-accessible-features` variant for carousel pagination styles (e.g. larger pagination dots).

**Action:** Revisit carousel pagination styles — evaluate whether a `.has-accessible-features .osui-carousel` block should override dot size/color

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

- [x] No runtime changes needed. Confirmed file intentionally contains no runtime rules — entirely SS preview properties.

---

#### B2. Lightbox Image

**File:** `src/scss/04-patterns/03-interaction/_lightbox-image.scss`

Runtime rules are safe-area and RTL wrappers only; nearly all rules are `-servicestudio-*`.

- [x] `-servicestudio-background-color: rgba(0, 0, 0, 0.3)` (×2) — replaced with `#{$token-backdrop}` ($token-backdrop ≈ rgba(0,0,0,0.25), close enough for SS preview)
- [x] `padding-bottom: calc(var(--os-safe-area-bottom) + 10px)` — annotated `// design-spec: 10px caption offset`
- [x] Focus ring: already `outline: 3px solid var(--color-focus-outer)` — correct a11y token, no change needed

---

#### B3. Bottom Bar Item

**File:** `src/scss/04-patterns/04-navigation/_bottom-bar-item.scss`

- [x] `--osui-bottom-bar-border-color: #{$token-primitives-neutral-300}` — upgraded to `#{$token-border-default}` for semantic consistency
- [x] Empty-state `color: $token-primitives-neutral-700` → `$token-text-subtlest`
- [x] Empty-state `font-size: 12px` → `$token-font-size-300`
- [x] Empty-state `padding: 20px` → `$token-scale-500`
- [x] `.bottom-bar-item-text { font-size: 10px }` — annotated `// token gap: no 10px token`
- [x] `max-width: 150px` — annotated `// design-spec`
- [x] Focus ring: `box-shadow: 0 0 0 3px var(--color-focus-outer)` — already correct a11y token, no change needed

---

#### B4. Input With Icon

**File:** `src/scss/04-patterns/03-interaction/_input-with-icon.scss`

- [x] `--osui-input-with-icon-icon-color: #{$token-primitives-neutral-700}` — upgraded to `#{$token-text-subtle}` for semantic intent
- [x] Icon slot `width: 40px` → `$token-scale-1000`
- [x] `padding-left: $token-scale-1000` on input when icon present — confirmed tracks icon slot width; `padding-right: $token-scale-400` added for right-icon variant; no !important or top/bottom zeroing (vertical padding is owned by widget/form styles)

---

#### B5. Stacked Cards

**File:** `src/scss/04-patterns/03-interaction/_stacked-cards.scss`

- [x] `&--animatable { transition: all 400ms ease }` — replaced `all` with `transform, opacity`; duration `400ms /* token gap */`; curve `$token-transition-curve-base`
- [x] SS preview hardcoded hex colors (`#e8f2fa`, `#37b24d`, `#c92a2a`) — replaced with `--osui-stacked-cards-overlay-*-background` CSS API vars
- [x] `-servicestudio-min-height: 225px` — annotated `// design-spec: SS preview fixed height`

---

#### B6. Floating Actions

**File:** `src/scss/04-patterns/03-interaction/_floating-actions.scss`

- [x] `transition: all 180ms ease-out` on `.is--open .floating-actions-item` — replace `all` with `opacity, transform`; duration `180ms /* token gap */`; curve `$token-transition-curve-base`
- [x] `transition: transform 180ms ease-out` on `.floating-actions-item-button` — duration `180ms /* token gap */`; curve `$token-transition-curve-base`
- [x] `transition: all 180ms linear` on `.floating-button` — replace `all` with `transform, box-shadow`; duration `180ms /* token gap */`; curve `$token-transition-curve-linear`
- [x] `transition: opacity 180ms ease-out` on `.floating-overlay` — duration `180ms /* token gap */`; curve `$token-transition-curve-base`
- [x] `transition-delay: calc(var(--delay) * 40ms)` — `40ms` is a stagger multiplier; annotated `// design-spec: stagger delay`
- [x] `filter: brightness(0.9)` for hover — annotated `// TODO: replace with explicit hover token when available`
- [x] `.floating-button { height: 56px; width: 56px }` — tokenized to `$token-scale-1400` (56px)
- [x] `.floating-actions-item-button { height: 40px; width: 40px }` — tokenized to `$token-scale-1000`
- [x] Focus ring: already uses `var(--color-focus-outer)` — confirmed correct
- [x] `[data-link]` within `.floating-actions-item` — `text-decoration: underline; text-decoration-color: color-mix(in srgb, currentColor 35%, transparent); text-underline-offset: 3px`; hover: `text-decoration-color: currentColor`

---

#### B7. Submenu

**File:** `src/scss/04-patterns/04-navigation/submenu/_submenu.scss`

- [x] `--osui-submenu-header-color` — fixed `#{}` interpolation
- [x] `--osui-submenu-active-border-color` — kept self-referential per reference (intentional, overridden by consumer); reference does not add `$token-*` fallback
- [x] `--osui-submenu-items-border-color` → `transparent`; `border` on `__items` → `none`
- [x] `--osui-submenu-max-height: calc(100dvh - 80px)` CSS API var added
- [x] `__items`: `border-radius` → `$token-border-radius-200`; add `max-height`, `overflow-x/y: hidden/auto`, `width: max-content`; `padding` → `$token-scale-0`
- [x] `__items { transform: translateY(-8px) }` — annotated `// design-spec`
- [x] `transition: all 150ms/130ms` — kept as-is per reference (proposed also uses `all`)
- [x] Items `a` hover: added `transition: background-color 150ms linear`
- [x] `a { padding: $token-scale-200 $token-scale-400 }` — already tokenized ✓
