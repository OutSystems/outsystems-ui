# Motion Mapping — hardcoded / legacy → design tokens

A per-pattern map from the current ad-hoc animation values to the existing motion
tokens, so the framework converges on one duration + easing vocabulary. This is the
**plan**; applying it is a follow-up normalization pass.

Audit context: as of the design-token migration, ~40% of patterns already use
`$token-transition-time-*` / `$token-transition-curve-*`; the rest hardcode `ms`/`s`
literals, bare `ease*` keywords, ad-hoc `cubic-bezier()`s, or the legacy un-tokenized
`--osui-motion-duration-*` vars. The entry/exit _mechanism_ — off-screen `transform`,
state-class toggle, then a `transition` — is already consistent; only the values diverge.

> Global accessibility is already handled — `_resets.scss` collapses all durations to
> `0.01ms` under `prefers-reduced-motion: reduce` (keeping `transitionend`/`animationend`
> firing). No per-pattern reduced-motion work is needed.

---

## Available tokens (the target vocabulary)

**Durations** (`$token-transition-time-*`): `0, 100, 150, 200, 300, 500, 1000, 1500` ms.

**Curves** (`$token-transition-curve-*`):

| Token        | Bézier                           | Character              | Use for                                  |
| ------------ | -------------------------------- | ---------------------- | ---------------------------------------- |
| `linear`     | `linear`                         | constant               | spinners, progress fills, marquees       |
| `quick`      | `cubic-bezier(0,0,0.2,1)`        | decelerate (ease-out)  | **entrances**, things arriving           |
| `base`       | `cubic-bezier(0.4,0,1,1)`        | accelerate (ease-in)   | **exits**, things leaving                |
| `expressive` | `cubic-bezier(0.4,0,0.2,1)`      | standard (ease-in-out) | moves/resizes that start & end on-screen |
| `bounce`     | `cubic-bezier(0.47,0,0.23,1.38)` | overshoot              | playful emphasis, pop-in                 |

> ⚠️ **Naming caveat:** `base` is an **ease-in (accelerate)** curve, so it is the wrong
> default for _entrances_ (which should decelerate → `quick`). Several patterns currently
> use `base` for slide-ins; the table corrects those to `quick`. Consider renaming the
> tokens (`base`→`accelerate`, `quick`→`decelerate`) in a future token release.

## Mapping rules

**Duration** — snap to the nearest token; on a tie, round to the value that preserves
intent (entrances/exits → snappier, reveals → smoother):

| Current                                                             | → Token                                           |
| ------------------------------------------------------------------- | ------------------------------------------------- |
| `100ms` / `0.1s`                                                    | `$token-transition-time-100`                      |
| `130ms`, `--osui-motion-duration-130`                               | `$token-transition-time-150`                      |
| `180ms`, `--osui-motion-duration-180`                               | `$token-transition-time-200`                      |
| `200ms` / `0.2s`                                                    | `$token-transition-time-200`                      |
| `250ms` / `0.25s`                                                   | `$token-transition-time-300`                      |
| `300ms` / `0.3s` / `330ms` / `350ms` / `0.35s`                      | `$token-transition-time-300`                      |
| `400ms` / `--osui-motion-duration-400` / `0.5s` / `500ms` / `630ms` | `$token-transition-time-500`                      |
| `850ms` (looping) / `1000ms`                                        | `$token-transition-time-1000`                     |
| `1500ms`                                                            | `$token-transition-time-1500`                     |
| `40ms` (FAB stagger delay)                                          | _leave_ — sub-token micro-delay, not a transition |

**Easing** — map keywords + ad-hoc béziers to a curve token:

| Current                                                                                                  | → Token                                         |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `linear`                                                                                                 | `$token-transition-curve-linear`                |
| `ease-out`, `cubic-bezier(0,0,0.3,1)`, `cubic-bezier(0.16,1,0.3,1)`, `cubic-bezier(0.19,0.35,0.56,0.96)` | `$token-transition-curve-quick` (decelerate)    |
| `ease-in`                                                                                                | `$token-transition-curve-base` (accelerate)     |
| `ease`, `ease-in-out`                                                                                    | `$token-transition-curve-expressive` (standard) |
| `cubic-bezier(0.03,0.01,0.67,1.97)` (overshoot)                                                          | `$token-transition-curve-bounce`                |
| `cubic-bezier(0.7,1.05,0.78,0.78)` (button-loading spin)                                                 | _leave_ — bespoke looping curve                 |

---

## Per-pattern mapping

Excludes `*_lib.scss` vendor baselines and `splide-core.scss` (provider). Line numbers
are indicative.

### Overlays — entry/exit (the priority family)

| Pattern          | File                                             | Current                                                                           | → Mapped                                                                                   |
| ---------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Action Sheet** | `03-interaction/_action-sheet.scss`              | overlay `opacity 0.3s cubic-bezier(0,0,0.3,1)`                                    | `opacity $token-transition-time-300 $token-transition-curve-quick`                         |
|                  |                                                  | enter `all 330ms ease-out`                                                        | `all $token-transition-time-300 $token-transition-curve-quick`                             |
|                  |                                                  | exit `all 130ms ease-in`                                                          | `all $token-transition-time-150 $token-transition-curve-base`                              |
| **Bottom Sheet** | `01-adaptive/bottom-sheet/_bottomsheet.scss`     | `--osui-bottom-sheet-transition-function: cubic-bezier(0.19,0.35,0.56,0.96)`      | `--osui-bottom-sheet-transition-function: #{$token-transition-curve-quick}`                |
|                  |                                                  | enter `transform 350ms var(func)`                                                 | `transform $token-transition-time-300 var(func)`                                           |
|                  |                                                  | exit `transform 200ms ease-out`                                                   | `transform $token-transition-time-200 $token-transition-curve-quick`                       |
|                  |                                                  | overlay-out `opacity 200ms ease-out`                                              | `opacity $token-transition-time-200 $token-transition-curve-quick`                         |
|                  |                                                  | overlay-in `opacity 350ms ease-in`                                                | `opacity $token-transition-time-300 $token-transition-curve-base`                          |
|                  |                                                  | header shadow `opacity 200ms ease` + `transform 200ms var(func)`                  | `… $token-transition-time-200 $token-transition-curve-expressive` + `… var(func)`          |
| **Notification** | `03-interaction/notification/_notification.scss` | `transform 300ms ease-out, opacity 300ms ease-out`                                | `transform $token-transition-time-300 $token-transition-curve-quick, opacity …`            |
| **Sidebar**      | `04-navigation/sidebar/_sidebar.scss`            | enter `transform $token-transition-time-300 $token-transition-curve-base`         | `… $token-transition-curve-quick` (base→quick: decelerate on enter)                        |
|                  |                                                  | `transform $token-transition-time-500 $token-transition-curve-base`               | `… $token-transition-curve-quick`                                                          |
|                  |                                                  | overlay `opacity --osui-motion-duration-130 ease-in`                              | `opacity $token-transition-time-150 $token-transition-curve-base`                          |
| **Balloon**      | `03-interaction/balloon/_balloon.scss`           | `opacity 300ms ease-in`                                                           | `opacity $token-transition-time-300 $token-transition-curve-quick` (entrance → decelerate) |
| **Tooltip**      | `03-interaction/tooltip/_tooltip.scss`           | `animation osui-tooltip-in $token-transition-time-150 cubic-bezier(0.16,1,0.3,1)` | `… $token-transition-time-150 $token-transition-curve-quick`                               |

### Interaction / content

| Pattern                    | File                                                   | Current                                            | → Mapped                                                            |
| -------------------------- | ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------- |
| **Alert**                  | `02-content/_alert.scss`                               | `background-color $token-transition-time-100 ease` | `… $token-transition-curve-expressive`                              |
| **Accordion Item**         | `02-content/accordion-item/_accordion-item.scss`       | `… $token-transition-time-300 ease-in-out` (×6)    | `… $token-transition-curve-expressive`                              |
| **Floating Actions**       | `03-interaction/_floating-actions.scss`                | `--osui-motion-duration-180` (×6)                  | `$token-transition-time-200`                                        |
|                            |                                                        | enter curves `$token-transition-curve-base`        | `$token-transition-curve-quick` where used on item/button _enter_   |
| **Stacked Cards**          | `03-interaction/_stacked-cards.scss`                   | `--osui-motion-duration-400 ease`                  | `$token-transition-time-500 $token-transition-curve-expressive`     |
| **Flip Content**           | `03-interaction/flip-content/_flipcontent.scss`        | `630ms cubic-bezier(0.03,0.01,0.67,1.97)`          | `$token-transition-time-500 $token-transition-curve-bounce`         |
| **Submenu**                | `04-navigation/submenu/_submenu.scss`                  | `130ms`                                            | `$token-transition-time-150`                                        |
|                            |                                                        | `200ms ease-out`                                   | `$token-transition-time-200 $token-transition-curve-quick`          |
|                            |                                                        | `ease`                                             | `$token-transition-curve-expressive`                                |
| **Dropdown (server-side)** | `03-interaction/dropdown/_dropdown-serverside.scss`    | `transform 200ms ease-in-out`                      | `… $token-transition-time-200 $token-transition-curve-expressive`   |
|                            |                                                        | `border 250ms ease-in-out`                         | `… $token-transition-time-300 $token-transition-curve-expressive`   |
|                            |                                                        | `opacity 250ms ease`                               | `… $token-transition-time-300 $token-transition-curve-expressive`   |
|                            |                                                        | `all 0.25s ease`                                   | `all $token-transition-time-300 $token-transition-curve-expressive` |
| **Dropdown item**          | `03-interaction/dropdown/_dropdownserversideitem.scss` | `250ms ease`                                       | `$token-transition-time-300 $token-transition-curve-expressive`     |
| **VirtualSelect override** | `03-interaction/dropdown/provider/_virtualselect.scss` | `0.25s ease` (×2)                                  | `$token-transition-time-300 $token-transition-curve-expressive`     |
| **Animated Label**         | `03-interaction/animated-label/_animated-label.scss`   | `100ms`, `ease` (×5), `ease-in-out`                | `$token-transition-time-100`, `…-curve-expressive`                  |
| **List Updating**          | `06-utilities/_list-updating.scss`                     | `300ms ease`                                       | `$token-transition-time-300 $token-transition-curve-expressive`     |
| **Pull to Refresh**        | `06-utilities/_pull-to-refresh.scss`                   | `0.25s ease` (×2)                                  | `$token-transition-time-300 $token-transition-curve-expressive`     |
| **Pagination**             | `04-navigation/_pagination.scss`                       | `ease` (×3)                                        | `$token-transition-curve-expressive`                                |

### Numbers / progress

| Pattern             | File                                                 | Current                                  | → Mapped                                                    |
| ------------------- | ---------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| **Progress Bar**    | `05-numbers/progress/_progressbar.scss`              | `0.35s`, `0.5s`                          | `$token-transition-time-300`, `$token-transition-time-500`  |
| **Progress Circle** | `05-numbers/progress/_progresscircle.scss`           | `0.35s`, `0.5s`                          | `$token-transition-time-300`, `$token-transition-time-500`  |
| **Button Loading**  | `03-interaction/button-loading/_button-loading.scss` | `850ms cubic-bezier(0.7,1.05,0.78,0.78)` | `$token-transition-time-1000` + _keep curve_ (bespoke loop) |

### Already token-clean (no change)

`tabs`, `carousel`, `master-detail`, `breadcrumbs`, `rating` (both files), `range-slider`,
`month-picker` provider — already on `$token-transition-time-*` + `$token-transition-curve-*`.

---

## Out of scope

- `*_lib.scss` vendor baselines (Flatpickr, VirtualSelect, noUiSlider, Splide) — never edited.
- `07-keyframes/_animate.scss` utility classes (`bottomtotop`, `fadein`, …) — a separate
  platform Animate API system; its `500/1000/1500ms ease-out` values already align with
  tokens but are exposed as utility classes, not pattern transitions.
- The `40ms` FAB stagger **delay** — a per-item offset, not a transition duration.

## Open decisions before applying

1. **`base` vs `quick` for entrances** — this table routes slide-ins to `quick`
   (decelerate). Confirm, or rename the curve tokens instead.
2. **Add a token for `400ms`?** Several patterns sit between `300` and `500`; a `400`
   duration token would reduce rounding.
3. **Expose motion via component CSS API** (`--osui-{component}-transition-*`) so themes
   can retune — bottom-sheet already half-does this with `--osui-bottom-sheet-transition-function`.
