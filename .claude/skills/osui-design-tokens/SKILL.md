---
name: osui-design-tokens
description: OutSystems Design Tokens — the --token-* / $token-* namespace used across OutSystemsUI. Use this skill whenever you need to pick a token, look up what's available, understand the three-tier hierarchy (primitives → semantics → component tokens), explain how theming and dark-mode work, or debug a missing / stale token. Trigger on questions like "which token for padding 16px?", "is there a token for surface background?", "where do these tokens come from?", or any time you're about to write `$token-*` or `var(--token-*)` in SCSS. Pairs with osui-scss for in-repo SCSS work.
---

# OutSystems Design Tokens

Design tokens are the styling contract between OutSystems UI (the component library) and any consuming app. Every value that can be themed — color, spacing, type, border radius, shadow, elevation, motion, z-index — is a token. OSUI must never hardcode a raw value where a token exists.

## 1. Where tokens come from

- **Package:** [`outsystems-design-tokens`](https://www.npmjs.com/package/outsystems-design-tokens) (pinned in `package.json`, currently `^1.3.7`).
- **Source of truth:** JSON files in the token package itself (`tokens/primitives.json`, `tokens/color scheme.json`, `tokens/typography.json`, `tokens/theme/*.json`, `tokens/shape/*.json`). Edited either directly or via the Token Studio Figma plugin.
- **Generated locally in this repo:** running `npx build.tokens` (wired into the gulp pipeline) writes three files into `src/scss/tokens/`:
  - `_root.scss` — all `--token-*` CSS custom properties on `:root`.
  - `_variables.scss` — matching `$token-*` SCSS variables, each expanding to `var(--token-*, <hardcoded-fallback>)`.
  - `_utilities.scss` — utility classes.
- **These three files are gitignored.** Never commit them, never hand-edit them. Regenerate via `npm run dev` / `npm run build` if they go stale.

## 2. The two-layer pattern (non-negotiable)

Every token exists as both a CSS custom property and a matching SCSS variable:

```scss
// In src/scss/tokens/_variables.scss (generated):
$token-scale-400: var(--token-scale-400, 16px);
$token-bg-surface-default: var(--token-bg-surface-default, #ffffff);
$token-text-default: var(--token-text-default, #242424);
```

### Rules of consumption

- **CSS property values** → use `$token-*` directly:
  ```scss
  .osui-card {
    padding: $token-scale-400;
    color: $token-text-default;
  }
  ```

- **CSS custom property declarations** (including the `--osui-*` component API layer) → **interpolate** with `#{}`:
  ```scss
  .osui-card {
    --osui-card-background: #{$token-bg-surface-default};
    --osui-card-padding: #{$token-scale-400};

    background-color: var(--osui-card-background);
    padding: var(--osui-card-padding);
  }
  ```

The `$token-*` form gives you compile-time typo detection, IDE autocomplete, and a baked-in fallback if the `:root` layer is absent. The raw `var(--token-*, fallback)` form is almost never what you want in OSUI source.

## 3. Three-tier hierarchy

Tokens are organized in three layers — always prefer the most semantic one that fits your use case.

### Tier 1 — Primitives (`$token-primitives-*`)

Raw design atoms. Stable values keyed by family + step.

- **Neutral scale:** `$token-primitives-neutral-100` through `$token-primitives-neutral-1200` (12 shades, lightest → darkest). Plus `$token-primitives-base-white` and `$token-primitives-base-black`.
- **Color families:** 16 families × 12 shades (100–1200): `neutral`, `base`, `red`, `pumpkin`, `orange`, `yellow`, `lime`, `green`, `teal`, `aqua`, `blue`, `indigo`, `violet`, `purple`, `magenta`, `pink`. Token shape: `$token-primitives-{family}-{step}`.
- **Shadow overlays:** seven opacity levels for elevation.
- **State overlays:** `$token-primitives-state-disabled`, `$token-primitives-state-press`.

Primitives are the building blocks — reach for them **only** when a semantic or component token doesn't fit.

### Tier 2 — Semantics (`$token-semantics-*`)

Color families mapped to meaning. Five groups, each with 12 shades:

- `$token-semantics-primary-*` — main brand color (currently maps to blue)
- `$token-semantics-info-*` — informational (maps to blue)
- `$token-semantics-success-*` — maps to green
- `$token-semantics-danger-*` — maps to red (note: "error" in old OSUI naming is "danger" in the token system)
- `$token-semantics-warning-*` — maps to yellow

Use these for states that are *logically* about meaning (a "danger" alert, a "success" banner) rather than a specific color.

### Tier 3 — Component tokens

Fully-resolved use-case tokens. **Prefer these whenever they exist** — they're already mapped to the right semantic for a given surface and respond correctly to theme swaps.

- **Backgrounds (`$token-bg-*`):**
  - Surface: `$token-bg-body`, `$token-bg-surface-default`, `$token-bg-surface-inverse`
  - Semantic: `$token-bg-primary-base-default`, `$token-bg-primary-base-press`, `$token-bg-primary-subtle-default`, and same for `danger`, `success`, `info`, `warning`
  - Neutral: `$token-bg-neutral-subtle`, `$token-bg-neutral-base`, `$token-bg-neutral-subtlest`, `$token-bg-neutral-bold`, `$token-bg-neutral-boldest`
  - Input: `$token-bg-input-default`, `$token-bg-input-read-only`, `$token-bg-input-press`, `$token-bg-input-disabled`, `$token-bg-input-bold`
  - Select: `$token-bg-select-default`, `$token-bg-select-press`
  - Extended: `$token-bg-extended-{pumpkin|orange|lime|teal|aqua|indigo|violet|purple|magenta|pink}-{base|subtle}-{default|press}`

- **Text (`$token-text-*`):** `default`, `subtle`, `subtlest`, `primary`, `disabled`, `danger`, `info`, `warning`, `success`, `link-default`, `link-press`, `link-visited`, `inverse`, `select`, plus extended color variants.

- **Border (`$token-border-*`):** `default`, `boldest`, `subtle`, `subtlest`, `primary`, `success`, `warning`, `disabled`, `focus-0`, `focus-default`, `focus-error`, `danger-base`, `danger-press`, `input-default`, `input-press`, `input-read-only`.

- **Icon (`$token-icon-*`):** `default`, `subtle`, `subtlest`, `disabled`, `primary`, `info`, `success`, `danger`, `warning`, `inverse`, `select`, `link-*`, plus extended color variants.

### Non-color tokens

- **Scale / spacing (`$token-scale-*`):** `0`, `25`, `50`, `75`, `100` (4px), `150` (6px), `200` (8px), `250` (10px), `300` (12px), `400` (16px), `500` (20px), `600` (24px), `700` (28px), `800` (32px), `900` (36px), `1000` (40px), `1100` (44px), `1200` (48px), and larger steps up to `3600`. Use for padding, margin, gap, width, height. Mirrored as `$token-space-*`.
- **Border size (`$token-border-border-size-*`):** `0`, `025` (1px), `050` (2px), `075` (3px).
- **Border radius (`$token-border-border-radius-*`):** `0`, `050` (2px), `100` (4px), `200` (8px), `300` (12px), `400` (16px), `500` (20px), `800` (32px), `1000` (40px), `full` (999px).
- **Font size (`$token-font-font-size-*`):** `275` (11px) through `900` (36px), output in rem.
- **Font weight (`$token-font-font-weight-*`):** `thin`, `extra-light`, `light`, `regular`, `medium`, `semi-bold`, `bold`, `extra-bold`, `black`.
- **Elevation (`$token-elevation-*`):** `1`, `2`, `3`, `4` — composite box-shadow values.
- **Transition:** `$token-transition-curve-*` (`linear`, `quick`, `base`, `expressive`, `bounce`) and `$token-transition-duration-*` (`0`, `100`, `150`, `200`, `300`, `500`, `1000`, `1500` ms).
- **Z-index (`$token-z-index-*`):** `0`, `100`–`500`, `bottom` (-99999), `top` (99999).
- **Backdrop / overlay:** `$token-backdrop` (70% opacity black).
- **RGB companions:** every color token also generates `$token-*-rgb` (three comma-separated ints) for use in `rgba()` composition.

### Typography — SCSS maps, not individual vars

Composite tokens (font-size + font-weight + line-height + letter-spacing + etc.) are emitted as **SCSS maps**:

- **Display:** `$token-display-sm-light`, `$token-display-sm-regular`, `$token-display-lg-light`, `$token-display-lg-regular`.
- **Headings:** `$token-heading-h1-regular` through `$token-heading-h6-bold` (6 sizes × 4 weights).
- **Body:** `$token-body-lg-regular` through `$token-body-sm-bold`.
- **Action:** `$token-body-action-{lg|md|sm|xs}-medium`.
- **Overline:** `$token-overline-{regular|medium|semi-bold|bold}`.

Consume via the `apply-typography` mixin in `src/scss/00-abstract/_mixins.scss`:

```scss
@include apply-typography($token-heading-h2-semi-bold);
```

## 4. Theme variants and dark mode

- **Light (default):** generated from `tokens/theme/light.json` in the token package. This is what every base `$token-*` resolves to unless overridden.
- **Dark theme:** ships as a **generated** partial — `src/scss/tokens/_theme-dark.scss` (`npm run build:tokens`), which re-maps the ~447 `--token-*` values that differ in dark and self-applies them under `.theme-dark`. It is registered in `ScssStructure/Root.js`. Apply it by putting `.theme-dark` on **`<html>`** — `--color-*` is declared at `:root` and substitutes its `var(--token-…)` against that element, so a `<body>`-level override resolves too late. Scoped to `<html>`, 43 of the 44 `--color-*` roles follow dark. No hand-written theme partial exists; the old `01-foundations/_theme-dark.scss` and its `--color-*` role bridge were deleted, the bridge being exactly what `<html>` scoping replaces.
- **Shape variants:** the token package can emit `soft`, `round`, or `rectangular` border-radius profiles. OSUI uses the default (soft) variant.

Theme-switching works because `$token-*` expands to `var(--token-*, fallback)`. A theme partial reassigns `--token-*` (and the framework theme-layer role knobs `--color-*`, `--border-radius-*`, …) at a class scope, and every `$token-*` use picks up the new value without a rebuild.

## 5. Finding the right token

When you need a value:

1. **Grep the generated file first:**
   ```bash
   grep -E '^\$token-' src/scss/tokens/_variables.scss | less
   ```
   It's 1400+ lines organized by category (Primitives, Scale, Semantics, Text, Bg, Icon, State, Border, Font, Space, Shadow, Elevation, Transition, Z-index, Rectangular, Round, Soft, Typography). Searching by category section is fast.

2. **If looking for a specific numeric value**, grep the hex or px:
   ```bash
   grep '16px' src/scss/tokens/_variables.scss
   grep '#1068eb' src/scss/tokens/_variables.scss
   ```

3. **Prefer the most semantic tier that fits.** A card background is `$token-bg-surface-default`, not `$token-primitives-base-white`. An error text is `$token-text-danger`, not `$token-semantics-danger-700`. Only reach into primitives when no higher-tier token matches.

4. **If you can't find a fit**, two valid responses:
   - Use the closest primitive and leave a `TODO: needs a semantic token` comment.
   - Flag it as a gap in the token package — the missing token should get added at the source (`outsystems-design-tokens` repo), not worked around locally.

## 6. Anti-patterns

- Hardcoded hex / rgb / rgba / px / rem in a property value where a token exists.
- Reintroducing retired OSUI-native vars: `--font-size-*`, `--shadow-*`. These were migrated out in the Make Great UI initiative (ROU-12714) and must not come back. `--color-*`, `--space-*`, `--border-radius-*`, `--size-*` and `--layer-*` are the framework theme layer and are deliberately kept — see `.claude/rules/scss.md` §13.
- Using `var(--token-*, fallback)` directly in source when the `$token-*` form is available. The SCSS var is always the correct citation.
- Hand-editing `src/scss/tokens/_root.scss`, `_variables.scss`, or `_utilities.scss`. They are generated output.
- Bypassing the `--osui-{component}-{prop}` CSS API layer by consuming `$token-*` directly in a component's property value. Always route through the component var so consumers can override.
- Referencing primitives where a semantic token would carry intent (e.g. `$token-primitives-blue-700` when you mean "primary brand color" — use `$token-semantics-primary-base` or a component-level `$token-bg-primary-base-default`).

## 7. When tokens change

- Package upgrades (`outsystems-design-tokens` version bumps) regenerate `src/scss/tokens/*`. The diff in those files is not meaningful — it's output, not input. Review the package changelog, not the generated diff.
- New categories may appear (e.g. a new color family). Search the generated file before reaching for primitives; a new semantic token may now cover your case.
- Removed tokens (rare) show up as build errors at every `$token-*` callsite. Update each call to the new name — never reintroduce the old var as a bridge.

## 8. Related

- **`osui-scss`** skill — how to apply tokens in SCSS source (the `--osui-*` component API layer, class naming, two trees, dark-theme invariant).
- **`.claude/rules/scss.md`** — detailed conventions for property-value usage, helper functions, and review red-flags.
- **Token package repo** — `outsystems-design-tokens` on npm and internal git. See its `CLAUDE.md` for maintainer-side concerns (generation logic, alias resolution, Style Dictionary formats).
