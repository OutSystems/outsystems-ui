# SCSS Conventions — OutSystemsUI

Evergreen rules for any SCSS work in this repo. Derived from the codebase as of Phase 14 of the design-token migration (ROU-12714), after which all `--color-*` / `--space-*` / `--font-*` / `--shadow-*` / `--border-*` legacy vars have been token-backed.

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
- Still retired (do **not** reintroduce): `--space-*`, `--font-size-*`, `--shadow-*`, `--border-size-*`. Use `$token-*` instead.
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

`.is-rtl` is used as a context selector throughout; prefer logical properties (`margin-inline-start`, `inset-inline`) in new code.

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

> **Note:** the opt-in dark theme (`_theme-dark.scss`) has been **removed for now** (no `.theme-dark` partial currently ships). The invariant below stands for any theme reintroduced later.

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
- Re-declaration of genuinely-retired vars (`--space-*`, `--font-size-*`, `--shadow-*`, `--border-size-*`). NOTE: `--color-*`, `--border-radius-*`, `--size-*`, `--layer-*` are **not** retired — they are the framework theme layer (§13).
- Calls to `get-background-color()` / `get-text-color()` / `get-border-color()`.
- New rules that touch `.theme-dark` from the component side.
- Imports of `_*_lib.scss` vendor baselines.
- Hand-edits of `O11.OutSystemsUI.scss` / `ODC.OutSystemsUI.scss`.
- Style rules on `08-servicestudio-preview/` files (read-only for runtime code).
