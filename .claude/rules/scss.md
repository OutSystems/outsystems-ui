# SCSS Conventions — OutSystemsUI

Evergreen rules for any SCSS work in this repo. Derived from the codebase as of Phase 14 of the design-token migration (ROU-12714), after which all `--color-*` / `--space-*` / `--font-*` / `--shadow-*` / `--border-*` legacy vars have been token-backed. ROU-12975 then restored the `--space-*` and `--layer-global-*` public names on top of those token-backed values.

---

## 1. Two SCSS trees — always check both

```
src/scss/                       Global styles: foundations, layout, widgets, utilities
src/scripts/**/scss/            Pattern + provider styles co-located with TS
```

Any token or naming change **must be surveyed across both trees**. Build-system `@import`s them into one bundle per platform.

Skip: `08-servicestudio-preview/`, `10-deprecated/` (unless actively migrating), `_*_ss_preview_imgs.scss`, and `_*_lib.scss` vendor baselines (never edit).

## 2. Token layer — the non-negotiable API

Two cooperating layers:

- **`--token-*` CSS custom properties** — generated into `src/scss/tokens/_root.scss` (gitignored). Public theming surface; apps override them at `:root`.
- **`$token-*` SCSS variables** — generated into `src/scss/tokens/_variables.scss`. Each expands to `var(--token-*, fallback)`. **Prefer `$token-*` in every new SCSS line.**

Rules of thumb:

- In a CSS **property value** → write `$token-*` directly: `padding: $token-scale-400;`
- In a CSS **custom property declaration** → interpolate: `--osui-card-background: #{$token-bg-surface-default};`
- Never hardcode hex/rem/px if a matching `$token-*` exists.
- Still retired (do **not** reintroduce): `--font-size-*`, `--shadow-*`, `--border-size-*`. Use `$token-*` instead.
- **`--space-*` is NOT retired** (restored ROU-12975). It is the public spacing vocabulary — `--space-none` … `--space-xxl`, generated in `_root.scss` from `$osui-space-token-vars` and token-backed onto `$token-scale-*`. Prefer `$token-scale-*` directly in new component SCSS; `--space-*` exists so apps (and Gallery's runtime `ItemsGap`) keep a stable override surface.
- **Exception — the framework theme layer (Part Four).** `--color-*`, `--border-radius-*`, `--size-*`, and `--layer-*` are **not** retired: they are the framework theme layer (Tier 3) — see §13. They were deliberately un-prefixed (dropping the old `--os-` prefix) to stay backward-compatible with the historical public theming surface. Components route through them; each defaults through a `$token-*`.

## 3. Component CSS API — the `--osui-*` layer

Every visual component declares its own CSS custom properties at its root selector with a `$token-*` default, then reads them in property values:

```scss
.card {
  // ─── Component CSS API ─────────────────────────
  --osui-card-background: #{$token-bg-surface-default};
  --osui-card-shadow:     #{$token-elevation-1};
  --osui-card-padding:    #{$token-scale-400};
  // ───────────────────────────────────────────────

  background-color: var(--osui-card-background);
  box-shadow:       var(--osui-card-shadow);
  padding:          var(--osui-card-padding);
}
```

Rules:

- Naming: `--osui-{component}-{property}` (decision D11).
- Property declarations **must** go through the `--osui-*` var, not directly through `$token-*`, so consumers can override per-instance without touching tokens.
- Defaults live on the component root. Themes (e.g. `.theme-dark`) only override variables — never touch component rules.

## 4. Helper functions — deprecated, don't reintroduce

`get-background-color()`, `get-text-color()`, `get-border-color()`, `get-app-settings-background-color()` are a legacy semantic-override layer. Phase 2 replaced every call site. New code uses `$token-*` directly — not helper functions.

## 5. Class naming

- **`src/scss/` classes** (layout, widgets, utilities): no prefix — `.card`, `.btn`, `.alert`, `.layout-*`
- **`src/scripts/` pattern classes**: always `osui-` prefixed — `.osui-accordion`, `.osui-sidebar`, `.osui-balloon`
- **Provider override classes**: match the vendor lib — `.vscomp-*`, `.flatpickr-*`, etc.

BEM-hybrid structure:

```
.card                    block
.card-content            element
.card-sectioned          modifier
.is-active               state
.has-accessible-features state-with-feature
```

## 6. Widget targeting — data attributes, not classes

Form controls are styled via data attributes: `[data-input]`, `[data-textarea]`, `[data-checkbox]`, `[data-switch]`, `[data-radio]`. Do **not** convert these to classes.

## 7. State classes

`.is-active`, `.is-disabled`, `.is-open`, `.is-hidden`, `.is-selected`, `.is-focused`, `.is-inline`, `.is-rtl`, `.has-accessible-features`, `.has-event`.

`.is-rtl` is a context selector for the handful of genuinely physical properties only — see §15.

## 8. Pattern-scoped custom properties

Pattern SCSS files declare their own `--osui-{pattern}-{prop}` variables at the component root, optionally aliasing a global token or providing a sensible literal default:

```scss
.osui-bottom-sheet {
  --osui-bottom-sheet-max-height: calc(100vh - 54px);
  --osui-bottom-sheet-draggable-area: 56px;
  --osui-bottom-sheet-transition-function: cubic-bezier(0.19, 0.35, 0.56, 0.96);
}
```

Pattern-scoped vars that need to be read off-DOM (portaled patterns) or from sibling layouts are additionally declared in `src/scss/01-foundations/_root.scss` under the `--osui-*-layer` block.

## 9. Auto-generated entry files

`src/scss/O11.OutSystemsUI.scss` and `src/scss/ODC.OutSystemsUI.scss` are **regenerated on every `npm run dev` / `npm run build`** by `gulp/Tasks/CreateScssFile.js`. **Never hand-edit them.**

To add a new SCSS partial:

1. Create it under the appropriate `src/scss/<section>/` folder.
2. Register it in the matching section spec in `gulp/ProjectSpecs/ScssStructure/*.js`:
   ```js
   { "name": "Description", "path": "01-foundations/foo" }
   ```
3. Run `npm run dev -- --target ODC` and verify the partial appears in `dist/dev.ODC.OutSystemsUI.css`.

## 10. Provider files

- `Providers/OSUI/*/scss/_<provider>.scss` — override files, use OSUI tokens and follow OSUI naming.
- `Providers/OSUI/*/scss/_<provider>_lib.scss` — unmodified vendor CSS baselines. **Never edit.**

Pattern files that consume a provider import the override SCSS directly:

```scss
@import '../../../../../Providers/OSUI/Dropdown/VirtualSelect/scss/_virtualselect.scss';
```

## 11. Theme invariant

> **Note:** a dark theme **does ship**, and it is **fully generated** — `src/scss/tokens/_theme-dark.scss`, written by `npm run build:tokens` from the design tokens' dark mode (that directory is gitignored). It re-maps the ~447 `--token-*` values that differ in dark and self-applies them under `.theme-dark`. Registered in `gulp/ProjectSpecs/ScssStructure/Root.js`; never hand-add it to the entry files (§9).
>
> Opt-in, manual only: add `.theme-dark` to **`<html>`** (`document.documentElement`) — no OS auto-detection (an app that wants to follow `prefers-color-scheme` toggles the class itself). It must be `<html>`, not `<body>`: `--color-*` is declared at `:root` and substitutes its `var(--token-…)` against that element, so a `<body>`-level token override lands after the roles have already resolved light. `.theme-dark` is an element-agnostic class selector — the element is the whole mechanism, no CSS change involved.
>
> The hand-written `01-foundations/_theme-dark.scss` has been **deleted**, and with it both the `--color-*` role bridge (made redundant by scoping the class to `<html>`) and the old **"KNOWN CSS-API LEAKS"** block. The invariant below is therefore now structurally true rather than aspirational: the shipped theme is nothing but `--token-*` overrides. Do **not** reintroduce a hand-written theme partial to patch a component; add the `--osui-*` knob to the component instead.

A theme is **entirely** CSS-custom-property overrides scoped under a single class. It overrides theme-layer role knobs (`--color-*`, `--border-radius-*`, …) and/or the underlying `--token-*` — it touches **no** component rule, **no** `$token-*` value, and **no** pre-existing `--osui-*` default.

**If a theme needs to modify a component rule, that indicates a leak in the component's CSS API.** Fix it in the component, not the theme.

## 12. Safe-area indirection

Mobile safe-area wrapping pattern — keep the indirection, don't collapse:

```scss
--os-safe-area-top: #{safe-area(top)};  // wraps max(env(safe-area-inset-top, 0px), var(--overridable))
```

## 13. Framework theme layer (Tier 3) — `_root.scss`

`_root.scss` declares the **framework theme layer**: the stable, framework-owned theming contract that sits between the design tokens and the components. The read chain is:

```
property → var(--osui-{component}) → var(--{role}) → $token-* → primitive
e.g.       --osui-btn-primary-background → --color-primary → $token-semantics-primary-base
```

Each role knob defaults **through** a `$token-*`, so overriding the token (e.g. dark theme) still cascades. The contract is deliberately **un-prefixed** (no `--os-`) to stay backward-compatible with the historical public theming surface (`--color-primary`, etc.):

- **Brand / status / neutral colors** — `--color-primary`, `--color-secondary`, `--color-error`, `--color-warning`, `--color-success`, `--color-info`, `--color-neutral-0..10`. (Also read by TS `GetColorValueFromColorType`.)
- **Surfaces / text** — `--color-background-{body,surface,header,sidemenu,footer,login}`, `--color-text`.
- **Radius** — one shape vocabulary `--border-radius-{none,soft,softer,rounded}` (8px=`soft` for controls + flat surfaces, 16px=`softer` for elevated surfaces, 999px=`rounded` for circular). Each resolves `var(--border-radius-default, <own-default>)`, so setting **`--border-radius-default`** at `:root` re-radiuses the whole framework with one override (undefined by default). `none`/`soft`/`rounded` are also read by TS `GetBorderRadiusValueFromShapeType`; `softer` is CSS-only.
- **App-layout plumbing (NOT part of the theme contract)** — layout sizes `--size-*`, z-index `--layer-*`, and safe areas `--os-safe-area-*` (the **one** retained `--os-` prefix — see §12).

These are intentionally not `--osui-*`: theme-layer roles are app-level knobs an end-user theme overrides once; `--osui-*` is per-component. See `specs/plan-part-four.md` for the full architecture.

## 14. Dead-code red flags

Flag in review:

- Hardcoded hex / rgb / rgba where a `$token-*` exists.
- Re-declaration of genuinely-retired vars (`--font-size-*`, `--shadow-*`, `--border-size-*`). NOTE: `--color-*`, `--space-*`, `--border-radius-*`, `--size-*`, `--layer-*` are **not** retired — they are the framework theme layer (§13).
- Calls to `get-background-color()` / `get-text-color()` / `get-border-color()`.
- New rules that touch `.theme-dark` from the component side.
- Imports of `_*_lib.scss` vendor baselines.
- Hand-edits of `O11.OutSystemsUI.scss` / `ODC.OutSystemsUI.scss`.
- Style rules on `08-servicestudio-preview/` files (read-only for runtime code).

## 15. Logical box model — the default since ROU-13013

`padding`, `margin`, `border` and `inset` are written **logically**. A physical side needs a
comment saying why.

| Write this | Not this |
|---|---|
| `padding-inline-start` / `-end` | `padding-left` / `-right` |
| `padding-block-start` / `-end` | `padding-top` / `-bottom` |
| `padding-block: a; padding-inline: b` | `padding: a b` |
| `border-inline-start` (+ `-width` / `-style` / `-color`) | `border-left` |
| `border-start-start-radius` … | `border-top-left-radius` … |
| `inset-inline-start` / `-end` | `left` / `right` |
| `text-align: start` / `end` | `text-align: left` / `right` |
| `var(--os-safe-area-inline-start)` | `var(--os-safe-area-left)` |

Corollaries:

- **Component CSS API names carry the axis, never the side** — `--osui-x-padding-inline`,
  `--osui-x-padding-block`, `--osui-x-padding-inline-start`. No `-x` / `-y` / `-left` / `-right`.
- **Never put a multi-value box shorthand in a custom property.** It cannot mirror without
  restating the whole value. Split it into `…-block` + `…-inline-start` + `…-inline-end`.
- **Convert whole rules.** Logical and physical longhands that resolve to the same side have
  no specificity relationship — the later declaration wins — so a half-converted rule fails
  silently.
- **`border-radius` shorthand only when the inline axis is asymmetric.** `8px 8px 0 0`
  mirrors to itself.

### Two traps that produce wrong RTL

**1. Never mix a logical inset with a physical x-axis transform on the same element.**
`transform` has no logical form, so it never mirrors. Pair it with `inset-inline-*` and the
anchor flips in RTL while the transform does not:

```scss
// WRONG - in RTL the anchor moves to the right edge, translateX still pushes right
inset-inline-start: 0;
transform: translateX(8px);

// RIGHT - both halves in the same coordinate system
left: 0;
transform: translateX(8px);
```

This bit the Switch (thumb slid outside its track in RTL) and every use of the centring
idiom `left: 50%; transform: translateX(-50%)`. No grep catches this — it needs to know
both declarations are on the same element — so it is a review check: **a rule with an
x-axis transform keeps its inset physical.**

**2. Before deleting an `.is-rtl` rule, check the base declaration is ours.** Some `.is-rtl`
rules mirror physical CSS owned by the **platform** stylesheet or a vendor baseline, not by
OSUI. Making our side logical does nothing for those - the physical base never mirrors, so
the `.is-rtl` rule is still load-bearing. Popover ODC (platform's `margin-left: -50%`) and
Scrollable Area are the two kept for this reason.

### Still physical, on purpose

`transform` (`translateX`, `scaleX`, `rotate`), `transform-origin`, `box-shadow` /
`text-shadow` offsets, `background-position`, `linear-gradient(to right)`,
`flex-direction: row-reverse`, `float` (the logical keywords need Chrome 118 / Safari 16.4),
positional `top` / `bottom`, `env(safe-area-inset-*)`, everything `-servicestudio-*`, and
the vendor baselines.

### Direction-pinned subtrees

Inside an element whose computed `direction` is `ltr`, a logical property resolves LTR and
does **not** mirror. Three such islands exist: `.flatpickr-calendar` (vendor —
`date-picker` / `month-picker` / `time-picker` provider SCSS is therefore excluded from the
conversion and stays physical), `.osui-accordion-item__title`, and `.is-rtl .splide--ltr`.
Check for a pin before converting anything inside a provider subtree.

### Finding stragglers

```bash
grep -rnE '^[[:space:]]*(padding|margin|border)-(left|right|top|bottom)|^[[:space:]]*(left|right):' \
  src/scss --include='*.scss' \
  | grep -vE '_lib\.scss|splide-core|08-servicestudio|09-excluders|provider/_flatpickr|-servicestudio-'
```

Everything it returns should either be converted or carry a comment saying why it is
physical. The durable guard is the stylelint `property-disallowed-list` rule described in
`specs/plan-part-five.md` §7 — not yet wired, because stylelint 14 here has no
`customSyntax: postcss-scss` and cannot parse `//` comments.

See `specs/plan-part-five.md` for the full rationale and the follow-ups.
