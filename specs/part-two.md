# Part Two: Component CSS Implementation Checklist

**Goal:** Make every component's CSS match the design review at
<https://jessicamendesos.github.io/jess-ui-review/proposed/showcase.html>.

This document is a flat, component-by-component checklist. Each item maps a
single property change to the exact `$token-*` variable to use (or marks a
hardcoded-by-design value). Items are derived directly from the design review
pages; nothing here is speculative.

Work in `src/scss/` (widgets, layout, pattern SCSS) and the pattern `scss/`
files. All token values are read from `src/scss/tokens/_variables.scss`.

---

## Motion token reference

**Available in package** (`src/scss/tokens/_variables.scss`):

Durations: `$token-transition-time-0/100/150/200/250/300/350/500/1000/1500`

Curves: `$token-transition-curve-linear` · `$token-transition-curve-quick` · `$token-transition-curve-smooth` · `$token-transition-curve-spring` · `$token-transition-curve-base` · `$token-transition-curve-expressive` · `$token-transition-curve-bounce`

**Durations used in the design review that have no exact package token:**

| Used in review | Value | Gap |
|---|---|---|
| `.12s` transitions (list, pagination, master detail, link) | 120 ms | between `time-100` and `time-150` |
| checkbox, switch, input/textarea transitions | 180 ms | between `time-150` and `time-200` |
| accordion open/close animation | 400 ms | between `time-350` and `time-500` |

**Curves used in the review that match package tokens exactly** (for reference):

| Review value | Matches |
|---|---|
| `cubic-bezier(0.4, 0, 1, 1)` (review "easing-standard") | `$token-transition-curve-base` |
| `cubic-bezier(0.16, 1, 0.3, 1)` (review "easing-expressive") | `$token-transition-curve-spring` |
| `linear` | `$token-transition-curve-linear` |

> **`prefers-reduced-motion`:** every new `transition` must be wrapped or
> zeroed under `@media (prefers-reduced-motion: reduce)`.

---

## 1. Accordion

**Files:**
- `src/scss/04-patterns/02-content/accordion/_accordion.scss`
- `src/scss/04-patterns/02-content/accordion-item/_accordion-item.scss`

### Token swap

- [ ] `.osui-accordion-item` `border-radius`: `4px` → `$token-border-radius-100`
- [ ] `.osui-accordion-item` active top indicator `background-color`: hardcoded blue → `$token-semantics-primary-base`
- [ ] `.osui-accordion-item__title` `padding`: `24px` all → `$token-scale-300` top/bottom · `$token-scale-600` left/right
- [ ] `.osui-accordion-item__title` `font-size`: `18px` → `$token-font-size-400` (16px)
- [ ] `.osui-accordion-item__title` (open) `font-weight`: current → `$token-font-weight-semi-bold`
- [ ] `.osui-accordion-item__title` `color`: current → `$token-text-default`
- [ ] `.osui-accordion-item__icon` `color`: current → `$token-semantics-primary-base`
- [ ] `[disabled]` `color`: hardcoded `#a2a2a2` → `$token-text-disabled`

### New component CSS API vars

- [ ] Declare `--osui-accordion-item-border-color: #{$token-border-default}` at root; use `var(--osui-accordion-item-border-color)` in border rules
- [ ] Declare `--osui-accordion-item-bg: #{$token-bg-surface-default}` and read through it

### Motion

- [ ] Add `grid-template-rows: 0fr ↔ 1fr` + `opacity` transition on collapsed/expanded content: `400ms /* token gap */` · `$token-transition-curve-spring`
- [ ] Add `@media (prefers-reduced-motion: reduce)` block setting transition duration to `0ms`

---

## 2. Alert

**File:** `src/scss/04-patterns/02-content/_alert.scss`

### Token swap

- [ ] Alert container `border-radius`: current → `$token-border-radius-200` (8px)
- [ ] Alert container `padding`: `16px` all → `$token-scale-300` top/bottom · `$token-scale-400` left/right
- [ ] Alert container `border`: remove 1px solid outer border (tonal background sufficient)
- [ ] `border-left-width` (accent): remove (background alone carries semantic variant)
- [ ] Icon/message `gap`: `16px` margin → `$token-scale-200` (8px) flex gap
- [ ] Message `font-size`: `16px` → `$token-font-size-350` (14px/0.875rem)
- [ ] Message `font-weight`: `400` → `$token-font-weight-medium`

### Variant token migrations

- [ ] Warning `background-color`: current → `$token-bg-warning-subtle-default`
- [ ] Warning `color`: current → `$token-text-warning`
- [ ] Success `background-color`: current → `$token-bg-success-subtle-default`
- [ ] Success `color`: current → `$token-text-success`
- [ ] Info `background-color`: current → `$token-bg-info-subtle-default`
- [ ] Info `color`: current → `$token-text-info`
- [ ] Error/Danger `background-color`: current → `$token-bg-danger-subtle-default`
- [ ] Error/Danger `color`: current → `$token-text-danger`

### Motion

- [ ] Add `transition: background-color $token-transition-time-100 $token-transition-curve-base, color $token-transition-time-100 $token-transition-curve-base, border-color $token-transition-time-100 $token-transition-curve-base` to the container
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 3. Badge

**File:** `src/scss/04-patterns/05-numbers/_badge.scss`

### Token swap

- [ ] `font-size`: explicit `$token-font-size-300` (12px) — do not inherit body
- [ ] `font-weight`: `$token-font-weight-semi-bold`
- [ ] `color`: `$token-text-inverse`
- [ ] Small size `height`: `24px` → `16px`; padding `1px 4px`
- [ ] Default size `height`: `32px` → `20px`; padding `$token-scale-050 $token-scale-200`
- [ ] Medium size `height`: `40px` → `28px`; padding `3px 12px`
- [ ] `.border-radius-rounded` `border-radius`: `100px` → `$token-border-radius-full` (999px)
- [ ] `.background-violet` class rename → `.background-purple`; hex `#7048e8` → `$token-semantics-primary-base` purple family (or annotate as hardcoded brand color `#7c3aed`)

> **Hardcoded by design:** badge height values (16/20/28px) sit between scale steps; keep as raw px values with a `// design-spec` comment.

---

## 4. Blank State

**File:** `src/scss/04-patterns/02-content/_blank-slate.scss`

### Token swap

- [ ] `.blank-slate` `justify-content`: `space-around` → `center`
- [ ] `.blank-slate` add `gap: $token-scale-600` (replaces per-child padding)
- [ ] `.blank-slate-description` `padding`: current → `0` (gap handles spacing)
- [ ] `.blank-slate-actions` `padding`: current → `0` (gap handles spacing)
- [ ] `.blank-slate-icon` `color` / `--osui-blank-slate-icon-color` default: `$token-text-disabled` → `$token-text-placeholder`
- [ ] `.blank-slate-description` `color` / `--osui-blank-slate-description-color` default: current → `$token-text-subtle`

---

## 5. Bottom Sheet

**File:** `src/scss/04-patterns/01-adaptive/bottom-sheet/_bottomsheet.scss`

### Token swap

- [ ] Sheet `background-color` / `--osui-bottom-sheet-bg` default: palette neutral-0 → `$token-bg-surface-default`
- [ ] Top corner `border-radius` / `--osui-bottom-sheet-shape` default: current → `$token-border-radius-300` (12px)
- [ ] Handler pill `background-color`: neutral-5 → `$token-border-default`

> **Note:** `--osui-bottom-sheet-transition-function` is kept (motion continuity). Scrim / overlay color unification with modal/menu is a separate cross-component task tracked in `plan.md`.

---

## 6. Breadcrumbs

**File:** `src/scss/04-patterns/04-navigation/_breadcrumbs.scss`

### Token swap

- [ ] Link `color`: `color-primary` / `#1068eb` → `$token-text-subtlest`
- [ ] Current-page item `color`: `color-neutral-8` → `$token-text-default`
- [ ] Current-page item `font-weight`: current → `$token-font-weight-semi-bold`
- [ ] Separator `color`: `color-neutral-7` → `$token-text-subtlest`
- [ ] Item `font-size`: current → `$token-font-size-350` (13px)
- [ ] Link `border-radius`: current → `$token-border-radius-100`
- [ ] Hover state: remove underline; color shift only → `$token-text-default`

### Motion

- [ ] Add `transition: color $token-transition-time-100 $token-transition-curve-base` to link elements
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 7. Button

**File:** `src/scss/03-widgets/_btn.scss`

### Token swap

- [ ] `.btn` `height`: `40px` → `$token-scale-900` (36px)
- [ ] `.btn-small` `height`: already `$token-scale-800` (32px) — confirm tokenized
- [ ] `.btn-large` `height`: → `$token-scale-1200` (48px)
- [ ] `.btn` `border-radius`: `$token-border-radius-100` (4px) → `$token-border-radius-200` (8px)
- [ ] `.btn` `font-weight`: `$token-font-weight-semi-bold` → `$token-font-weight-medium` on colored variants (primary/success/error)
- [ ] `.btn-primary` `background-color`: current → `$token-semantics-primary-base`
- [ ] `.btn-success` `background-color`: current → `$token-semantics-success-base`
- [ ] `.btn-error` `background-color`: current → `$token-semantics-danger-base`
- [ ] `.btn-cancel` `background-color`: current → `$token-bg-surface-default`
- [ ] `.btn-cancel` `border-color`: current → `$token-border-default`
- [ ] `.btn-cancel` `color`: current → `$token-text-subtle`
- [ ] `[disabled]` states: replace generic grey with `opacity: var(--token-opacity-disabled, 0.45)` per variant (keeps variant color identity)
- [ ] `line-height`: set explicit `1` (prevents descender height inflation)

### New component CSS API vars

- [ ] Declare `--osui-btn-height: #{$token-scale-900}` · `--osui-btn-radius: #{$token-border-radius-200}` at `.btn` root

### Motion

- [ ] `.btn` add `transition: background-color $token-transition-time-100 $token-transition-curve-base, border-color $token-transition-time-100 $token-transition-curve-base, color $token-transition-time-100 $token-transition-curve-base`
- [ ] `.btn-cancel` extend transition to include `box-shadow $token-transition-time-150 $token-transition-curve-base`
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 8. Button Group

**File:** `src/scss/03-widgets/_button-group.scss`

### Token swap

- [ ] `.button-group-item` `height`: `40px` → `$token-scale-900` (36px) — lock-step with Button
- [ ] `.button-group-item` `border-color` (rest): primary blue → `$token-border-default`
- [ ] `.button-group-item` `color` (rest): `color-primary` → `$token-text-default`
- [ ] `.button-group-item` corner `border-radius` (first/last): `$token-border-radius-100` → `$token-border-radius-200`
- [ ] `.button-group-selected-item` `background-color`: current → `$token-semantics-primary-base`
- [ ] Item layout: `inline-block` → `inline-flex` (eliminates HTML-whitespace ~4px gap between items)
- [ ] Hover state: add `background-color: $token-border-subtle` on rest items

---

## 9. Card

**Files:**
- `src/scss/04-patterns/02-content/_card.scss`
- `src/scss/04-patterns/02-content/_card-sectioned.scss`
- `src/scss/04-patterns/02-content/_card-item.scss`
- `src/scss/04-patterns/02-content/_card-background.scss`

### Token swap

- [ ] `.card` `background-color` → `$token-bg-surface-default`
- [ ] `.card` `border-color`: `$token-border-subtle` (#f3f3f3) → update to `#e5e7eb` (pending upstream `$token-border-neutral-200`; annotate as `// TODO: upgrade when token exists`)
- [ ] `.card` `border-radius`: confirm `$token-border-radius-200` (8px)
- [ ] `.card-title` `color`: set explicit `$token-text-default` (prevents inheritance issues)
- [ ] `.card-image` (card-sectioned) `padding`: `$token-scale-600` T/L/R → `0` (flush image layout)
- [ ] `.card-image img` `border-radius`: `$token-border-radius-200` → `0` (parent `overflow: hidden` clips corners)
- [ ] `.card-bottom` (card-sectioned) `background-color`: none → `#fafbfc` (pending `$token-bg-surface-subtle`; annotate as `// TODO: upgrade when token exists`)
- [ ] `.card-bottom` (card-sectioned) add `border-top: $token-border-size-025 solid $token-border-subtle`
- [ ] `.card-bottom .btn` `width`: `auto` → `100%`
- [ ] `.card-background` text-align: inherit center → explicit `start`
- [ ] `.background-pink` `background-color`: `#d6336c` → `#e91e8c` (hardcoded brand magenta; annotate `// brand color preserved`)

### Component CSS API

- [ ] `--osui-card-bg` default → `#{$token-bg-surface-default}`
- [ ] `--osui-card-border-color` default → `#{$token-border-subtle}` (update when upstream token lands)
- [ ] `--osui-card-radius` default → `#{$token-border-radius-200}`

---

## 10. Carousel

**File:** `src/scss/04-patterns/02-content/carousel/_carousel.scss`

### Token swap

- [ ] Track `border-radius`: `4px` → `$token-border-radius-300` (12px)
- [ ] Pagination indicator (rest) `color`/`background`: `#ccc` 70% opacity → `$token-border-default` full opacity
- [ ] Pagination indicator gap: margin → `gap: $token-scale-050` (flex)
- [ ] Arrow icon `color`: `#6a7178` → `$token-text-default`

### Motion

- [ ] Pagination active indicator: width expand (8px → 28px pill) `transition: width $token-transition-time-200 $token-transition-curve-linear, background-color $token-transition-time-200 $token-transition-curve-linear`

> **Hardcoded by design:** arrow button size (38px) and pagination indicator active pill width (28px) have no direct scale tokens.

---

## 11. Checkbox

**File:** `src/scss/03-widgets/_checkbox.scss`

### Token swap

- [ ] `[data-checkbox]:before` (box) `border`: 1px → `$token-border-size-025 solid $token-border-input-default`
- [ ] `[data-checkbox]:before` `border-radius`: current → `$token-border-radius-200` (8px)
- [ ] `[data-checkbox]:checked` `background-color`: → `$token-semantics-primary-base`
- [ ] `[data-checkbox]:disabled` `background-color`: → `$token-border-subtle`
- [ ] `[data-checkbox]:disabled` checkmark `color`: → `$token-text-disabled`
- [ ] Checkmark glyph: add explicit `transform: translate(-50%, -50%) rotate(-45deg)` centering; `color: $token-primitives-base-white`

### Motion

- [ ] Add `transition: background-color 180ms /* token gap */ $token-transition-curve-linear, border-color 180ms /* token gap */ $token-transition-curve-linear` to checkbox `:before`
- [ ] Add `@media (prefers-reduced-motion: reduce)` zero-out

---

## 12. Counter

**File:** `src/scss/04-patterns/05-numbers/_counter.scss`

### Token swap

- [ ] `.background-primary` `background-color`: `color-primary` → `$token-semantics-primary-base`
- [ ] `.background-success` `background-color`: `color-success` → `$token-semantics-success-base`
- [ ] `.background-error` `background-color`: `color-error` → `$token-semantics-danger-base`
- [ ] `.background-warning` `background-color`: `color-warning` → `$token-semantics-warning-base`
- [ ] Text `color`: `color-neutral-0` → `$token-text-inverse`
- [ ] Display `font-size`: `--font-size-display` → `$token-font-size-900` (2.25rem / 36px)

---

## 13. DatePicker

**File:** `src/scss/04-patterns/03-interaction/date-picker/_datepicker.scss`

### Token swap (input)

- [ ] Input `border-radius`: `4px` → `$token-border-radius-200` (8px)

### Token swap (calendar popup / flatpickr override)

**File:** `src/scss/04-patterns/03-interaction/date-picker/provider/_flatpickr.scss`

- [ ] Calendar container `border-radius`: `4px` → `$token-border-radius-300` (12px)
- [ ] Calendar container: remove 1px solid border; add elevation `$token-elevation-2`
- [ ] Month/year text `color`: primary blue → `$token-text-default`
- [ ] Nav arrow `color`: primary blue → `$token-text-subtlest`
- [ ] Day cell `border-radius` (shape): circle → `$token-border-radius-200` (8px squircle)
- [ ] Today cell `border-color`: `border-neutral-6` → `$token-border-default`
- [ ] Previous/next month day `color`: current → hardcoded `#b4b4b4` (no semantic token for "muted calendar day"; annotate `// TODO: gap — no token for prev/next-month day color`)
- [ ] AM/PM pill: `background-color` filled primary → transparent; `color` → `$token-semantics-primary-base`; `border`: add outline

---

## 14. Dropdown

**Files:**
- `src/scss/04-patterns/03-interaction/dropdown/_dropdown.scss`
- `src/scss/04-patterns/03-interaction/dropdown/provider/_virtualselect.scss`

### Token swap

- [ ] Trigger `height`: `40px` → `$token-scale-900` (36px)
- [ ] Trigger `border-radius`: `4px` → `$token-border-radius-200` (8px)
- [ ] Popup container `border-radius`: `4px` → `$token-border-radius-200`
- [ ] Selected row `background-color`: primary-light → `$token-border-subtle`
- [ ] Selected row `color`: primary → `$token-text-default`
- [ ] Selected row `font-weight`: current → `$token-font-weight-medium`

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

> **Note:** form control height (40px → 36px), border, and focus ring are in `_inputs-and-textareas.scss` — see **Input** below.

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

- [ ] `[data-input]` `height`: `40px` → `$token-scale-900` (36px)
- [ ] `[data-input]` `border-radius`: `4px` → `$token-border-radius-200` (8px)
- [ ] `[data-input]` `border-color`: `#d5d5d5` or legacy var → `$token-border-input-default`
- [ ] Hover `border-color`: `#626262` → `$token-text-subtlest`
- [ ] Focus state: replace border-only focus with `outline: #{$token-border-size-050} solid $token-semantics-primary-base; outline-offset: 1px`
- [ ] Disabled `background-color`: → `$token-border-subtle`
- [ ] Disabled `color`: → `$token-text-disabled`
- [ ] Error `border-color`: `#dc2020` → `$token-semantics-danger-base`
- [ ] `[data-input].input-small` `height`: → `$token-scale-800` (32px)
- [ ] `[data-input].input-large` `height`: → `$token-scale-1200` (48px)

### Motion

- [ ] Confirm `transition: 180ms /* token gap */ $token-transition-curve-linear` on border/outline

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

### Motion (confirm existing)

- [ ] `transition: 180ms /* token gap */ $token-transition-curve-linear`

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

## Acceptance criteria

Each component's changes are complete when:

1. `npm run build` compiles without SCSS errors.
2. `npm run lint` reports zero warnings for the changed files.
3. No hardcoded hex / raw px / rem values appear in changed lines where a `$token-*` equivalent exists.
4. Every new `transition` has a corresponding `@media (prefers-reduced-motion: reduce)` block.
5. Every new `--osui-{component}-{prop}` CSS API var is declared with a `$token-*` default (interpolated with `#{}`), and the property value reads from `var(--osui-*)`.

---

## Open issues and future work

This section tracks blockers, token gaps, design questions, and cross-cutting concerns that cannot be resolved within this implementation pass. Update it as things are resolved or new issues are found.

---

### Missing motion duration tokens

The `outsystems-design-tokens` package is missing these durations. Affected component items use the raw ms value with `/* token gap */` until the tokens land.

| Missing token | Value | Needed by |
|---|---|---|
| `$token-transition-time-120` | 120 ms | List hover, Master Detail hover, Pagination button, Link |
| `$token-transition-time-180` | 180 ms | Checkbox, Switch track/thumb, Input, Textarea |
| `$token-transition-time-400` | 400 ms | Accordion open/close, Flip Content, Progress Circle stroke |

**Action:** Request these three additions in the `outsystems-design-tokens` repo. Once merged and the package version bumped, do a find-and-replace of `/* token gap */` occurrences for those durations.

---

### Missing color / surface tokens

| Proposed token name | Value | Needed by |
|---|---|---|
| `$token-bg-surface-subtle` | `#fafbfc` | Card `.card-bottom` background |
| `$token-border-neutral-200` | `#e5e7eb` | Card border |
| (no name yet) | `#b4b4b4` | DatePicker prev/next month day text color |

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

| Component | Property | Value | Notes |
|---|---|---|---|
| Badge | height (small/default/medium) | 16px / 20px / 28px | Between scale steps by design |
| Gallery image | `border-radius` | 6px | Between `$token-border-radius-100` (4px) and `$token-border-radius-200` (8px) |
| Columns | `border-radius` | 10px | Between `$token-border-radius-100` and `$token-border-radius-200` |

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

### `prefers-reduced-motion` implementation approach

Each component section notes adding a `@media (prefers-reduced-motion: reduce)` block. Decide whether to:

- **A) Per-component blocks** — each component zeroes its own transitions inline (current proposal).
- **B) Global reset** — a single rule in foundations zeroes all transitions/animations for reduced-motion users, and components opt back in explicitly.

**Action:** Agree on approach before implementation starts so all components are consistent.

---

### Blocks not yet in the design review

These components have no design review page. Each checklist below covers issues found in the current SCSS that should be addressed regardless of the design review. Work through them in order — simplest first.

---

#### B1. Video
**File:** `src/scss/04-patterns/02-content/video/_video.scss`

10 lines, runtime CSS is empty — the file is entirely SS preview properties.

- [ ] No runtime changes needed. Confirm file intentionally contains no runtime rules.

---

#### B2. Tag
**File:** `src/scss/04-patterns/02-content/_tag.scss`

- [ ] `--osui-tag-on-light-color: $token-text-default` — missing `#{}` interpolation; should be `#{$token-text-default}`
- [ ] Height values `24px / 32px / 40px` — confirm these map to `$token-scale-600 / $token-scale-800 / $token-scale-1000` and tokenize
- [ ] `min-width: 32px` — confirm intentional or tokenize to `$token-scale-800`

---

#### B3. User Avatar
**File:** `src/scss/04-patterns/02-content/_user-avatar.scss`

Near-identical structure to Tag.

- [ ] `--osui-avatar-on-light-color: $token-text-default` — missing `#{}` interpolation; should be `#{$token-text-default}`
- [ ] Size values `24px / 32px / 40px` (width + height) — tokenize to `$token-scale-600 / $token-scale-800 / $token-scale-1000`

---

#### B4. Lightbox Image
**File:** `src/scss/04-patterns/03-interaction/_lightbox-image.scss`

Runtime rules are safe-area and RTL wrappers only; nearly all rules are `-servicestudio-*`.

- [ ] `-servicestudio-background-color: rgba(0, 0, 0, 0.3)` (×2 in SS preview) — replace with `#{$token-backdrop}` or keep as-is if scrim token doesn't match (confirm value)
- [ ] `padding-bottom: calc(var(--os-safe-area-bottom) + 10px)` — the `10px` offset is hardcoded; annotate `// design-spec`
- [ ] Focus ring: `outline: 3px solid $token-primitives-yellow-500` — confirm this is the correct a11y token for the high-contrast focus ring or whether a semantic token should be used

---

#### B5. Search
**File:** `src/scss/04-patterns/03-interaction/search/_search.scss`

Thin wrapper — delegates almost entirely to the Input styles.

- [ ] `-servicestudio-border-radius: 4px` — replace with `-servicestudio-border-radius: $token-border-radius-100`
- [ ] `-servicestudio-height: 40px` (×2) — replace with `-servicestudio-height: $token-scale-1000`
- [ ] Confirm that when Input `border-radius` is updated to `$token-border-radius-200` (8px) the Search input inherits correctly

---

#### B6. Section
**File:** `src/scss/04-patterns/02-content/_section.scss`

- [ ] `--osui-section-title-color: $token-text-default` — missing `#{}` interpolation; should be `#{$token-text-default}`
- [ ] `.section-group .section-title { background-color: var(--background-color-body, var(--os-color-background-body)); }` — `--background-color-body` and `--os-color-background-body` are legacy bridge vars; replace with `$token-bg-body` (or the correct body background token)
- [ ] `font-size: calc($token-font-size-700 - 2px)` (tablet) and `calc($token-font-size-700 - 4px)` (phone) — arithmetic on token values is fragile; confirm whether separate font-size tokens exist for these breakpoints or annotate as `// design-spec`

---

#### B7. Chat Message
**File:** `src/scss/04-patterns/02-content/_chat-message.scss`

Already well tokenized via CSS API vars.

- [ ] `--osui-chat-message-background: #{$token-primitives-neutral-300}` — `neutral-300` is a mid-grey; confirm this is intentional for received messages or whether `$token-bg-neutral-subtle` would be more semantic
- [ ] Photo `border-radius: 50%` — intentional circle; annotate `// design-spec: circular avatar`
- [ ] Photo `height: 40px; width: 40px` — tokenize to `$token-scale-1000`
- [ ] `max-width: 600px` on bubble — annotate `// design-spec: max bubble width`

---

#### B8. Bottom Bar Item
**File:** `src/scss/04-patterns/04-navigation/_bottom-bar-item.scss`

- [ ] `--osui-bottom-bar-border-color: #{$token-primitives-neutral-300}` — `neutral-300` is a primitive; consider upgrading to `#{$token-border-default}` for semantic consistency
- [ ] Empty-state `color: $token-primitives-neutral-700` — use `$token-text-subtlest` instead
- [ ] Empty-state `font-size: 12px` — tokenize to `$token-font-size-300`
- [ ] Empty-state `padding: 20px` — tokenize to `$token-scale-500` (20px)
- [ ] `.bottom-bar-item-text { font-size: 10px }` — no `$token-font-size-*` exists for 10px; annotate `// token gap: 10px has no token`
- [ ] `max-width: 150px` on nav items — annotate `// design-spec`
- [ ] Focus ring: `box-shadow: 0 0 0 3px $token-primitives-yellow-500` — confirm correct a11y token

---

#### B9. Input With Icon
**File:** `src/scss/04-patterns/03-interaction/_input-with-icon.scss`

- [ ] `--osui-input-with-icon-icon-color: #{$token-primitives-neutral-700}` — `neutral-700` is a primitive; upgrade to `#{$token-icon-default}` or `#{$token-text-subtle}` for semantic intent
- [ ] Icon slot `width: 40px` — if Input height is moving to `$token-scale-900` (36px), confirm icon slot width also needs to update to match; annotate decision
- [ ] `padding-left: $token-scale-1000` (40px) on input when icon present — if icon slot shrinks, this padding must track it; consider deriving from a shared `--osui-input-with-icon-slot-width` var

---

#### B10. Animated Label
**File:** `src/scss/04-patterns/03-interaction/animated-label/_animated-label.scss`

- [ ] `top: 8px` (label resting position) and `top: -10px` (label floated position) — hardcoded; annotate `// design-spec: pixel-precise label offsets`
- [ ] `transition: all 300ms ease` on label text — replace duration with `$token-transition-time-300`; replace curve with `$token-transition-curve-base`; avoid `all` (use explicit property list: `top, font-size`)
- [ ] `transition: all 100ms ease-in-out` on input — replace with `$token-transition-time-100 $token-transition-curve-base`; avoid `all`
- [ ] `top: 14px` (tablet/phone resting position) — hardcoded; annotate `// design-spec`
- [ ] `.animated-label-input .form-control[data-textarea] + span.validation-message { bottom: 7px }` — hardcoded offset; annotate `// design-spec`

---

#### B11. Overflow Menu
**File:** `src/scss/04-patterns/03-interaction/overflow-menu/_overflowmenu.scss`

- [ ] `--border-radius-rounded: 16px` — this is a legacy-style local var (no `--osui-` prefix); rename to `--osui-overflow-menu-shape` or remove if `--osui-overflow-menu-shape` already covers it; value `16px` has no matching `$token-border-radius-*` (nearest is `$token-border-radius-300` 12px) — annotate or request token
- [ ] `.tablet, .phone { --border-radius-rounded: 100% }` — same issue; this appears to be overriding a shape for mobile; confirm intent
- [ ] `--osui-overflow-menu-min-width: 170px` — declared inside the selector without `#{}`, which is fine for a raw number but confirm value is intentional design-spec
- [ ] Trigger `width: 32px` (desktop) / `40px` (tablet/phone) — if Button height changes to 36px, confirm trigger sizes remain correct; tokenize to `$token-scale-800` / `$token-scale-1000`

---

#### B12. Stacked Cards
**File:** `src/scss/04-patterns/03-interaction/_stacked-cards.scss`

- [ ] `&--animatable { transition: all 400ms ease }` — replace with explicit property list; duration `400ms /* token gap */`; curve `$token-transition-curve-base`; avoid `all`
- [ ] SS preview hardcoded hex colors: `-servicestudio-background-color: #e8f2fa` (top overlay), `#37b24d` (right overlay), `#c92a2a` (left overlay) — replace with the corresponding `--osui-stacked-cards-overlay-*-background` CSS API vars so SS preview reflects actual theme colors
- [ ] `-servicestudio-min-height: 225px` and `225px` background-size — annotate `// design-spec: SS preview fixed height`

---

#### B13. Floating Actions
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

#### B14. Submenu
**File:** `src/scss/04-patterns/04-navigation/submenu/_submenu.scss`

- [ ] `--osui-submenu-header-color: $token-text-default` — missing `#{}` interpolation; should be `#{$token-text-default}`
- [ ] `--osui-submenu-active-border-color: var(--osui-submenu-active-border-color)` — self-referential declaration; this is a placeholder for consumer override but has no default value; add a `$token-*` fallback: `#{$token-semantics-primary-base}`
- [ ] `transition: all 150ms linear` (×2 on header/header item) — replace `all` with `color, border-color`; duration `$token-transition-time-150`; curve `$token-transition-curve-linear`
- [ ] `transition: all 130ms ease-out` on `__items` — replace `all` with `opacity, transform`; duration `$token-transition-time-100` (nearest to 130ms); curve `$token-transition-curve-base`; annotate `// token gap: 130ms`
- [ ] `__items { border-radius: $token-border-radius-100 }` — confirm whether this should follow the 8px update (`$token-border-radius-200`) that other dropdowns/popups are getting
- [ ] `__items { transform: translateY(-8px) }` — hardcoded translate offset; annotate `// design-spec`
- [ ] `a { padding: $token-scale-200 $token-scale-400 }` in items — already tokenized ✓

---

#### B15. Table
**File:** `src/scss/03-widgets/_table.scss`

- [ ] `th { height: 48px }` — tokenize to `$token-scale-1200`
- [ ] `td { height: 56px }` (default row) — no `$token-scale-*` for 56px; annotate `// token gap: 56px has no exact token` (nearest: `$token-scale-1400` if exists, else keep raw)
- [ ] `.table-row-small td { height: 48px }` — tokenize to `$token-scale-1200`
- [ ] `.table-row-medium td { height: 64px }` — check if `$token-scale-1600` exists; annotate if not
- [ ] `table-row-selected` gradient: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9))` — this tints the selected-row background; consider whether `$token-opacity-*` or a surface token covers this; annotate `// design-spec: 90% white overlay for selected row`
- [ ] `td:before { margin-right: 10px; max-width: 110px; min-width: 110px }` (mobile stacked layout) — hardcoded; annotate `// design-spec: mobile label column width`
- [ ] `--osui-table-row-hover-background: #{$token-bg-input-disabled}` — `bg-input-disabled` is semantically wrong for a hover state; consider `$token-border-subtle` (matches hover pattern used in List, Pagination)
- [ ] Confirm `border-radius` on table corners correctly uses `$token-border-radius-200` (already present, verify no regressions after border-radius system update)

---

#### B16. Sidebar
**File:** `src/scss/04-patterns/04-navigation/sidebar/_sidebar.scss`

- [ ] `transition: all 130ms ease-in` (closed state) — replace `all` with `transform, opacity`; duration `$token-transition-time-100` (nearest to 130ms); curve `$token-transition-curve-base`; annotate `// token gap: 130ms`
- [ ] `transition: transform 330ms ease-out` (open state) — duration `$token-transition-time-350` (nearest to 330ms); curve `$token-transition-curve-base`; annotate `// token gap: 330ms`
- [ ] `transition: opacity 130ms ease-in` (overlay) — same as above; duration `$token-transition-time-100`; annotate `// token gap: 130ms`
- [ ] `--osui-sidebar-color: $token-text-default` — missing `#{}` interpolation; should be `#{$token-text-default}`
- [ ] `--overlay-opacity: 0` — local var declared without `--osui-` prefix; rename to `--osui-sidebar-overlay-opacity` for namespace consistency
- [ ] `padding-top: #{android-safe-area-top()}` — SCSS function call; confirm this is the correct indirection and matches the `--os-safe-area-top` pattern used elsewhere
- [ ] `max-width: 85vw` (phone) — annotate `// design-spec: max sidebar width on phone`
