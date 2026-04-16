# Implementation Spec — OutSystemsUI Token Migration

This document is the contract for the migration. Each phase has a precise list of file changes and acceptance criteria. Work is complete when all criteria pass.

---

## Phase 0 — Snapshot

### Changes

| Action | Path |
|--------|------|
| Create folder | `deprecated/` |
| Run `npm run build`, copy output | `deprecated/O11.OutSystemsUI.css` |
| Run `npm run build`, copy output | `deprecated/ODC.OutSystemsUI.css` |
| Create | `deprecated/README.md` — one-liner: "Last compiled output before token migration. For reference only." |

### Acceptance criteria
- [ ] `deprecated/` exists and is committed
- [ ] Both CSS files are present and non-empty
- [ ] No changes to any `src/` file

---

## Phase 1 — Replace token definitions

### 1.1 Install `outsystems-design-tokens`

```bash
npm install --save-dev outsystems-design-tokens
```

**Acceptance criteria:**
- [ ] `outsystems-design-tokens` appears in `package.json` under `devDependencies`
- [ ] `package-lock.json` updated

---

### 1.2 Wire up build scripts

File: `package.json`

Add to `scripts`:
```json
"prebuild": "npx build.tokens --dest src/scss/tokens/ --prefix token",
"predev":   "npx build.tokens --dest src/scss/tokens/ --prefix token"
```

**Acceptance criteria:**
- [ ] Running `npm run build` automatically generates token files in `src/scss/tokens/` before SCSS compilation
- [ ] Running `npm run dev` does the same

---

### 1.3 Gitignore generated token output

File: `.gitignore`

Add:
```
# Generated design tokens
src/scss/tokens/
```

**Acceptance criteria:**
- [ ] `src/scss/tokens/` does not appear in `git status` after generation

---

### 1.4 Verify generated token output shape

After running `npx build.tokens --dest src/scss/tokens/ --prefix token`, the following files must exist:

**`src/scss/tokens/_root.scss`** — must open with:
```scss
:root {
  --token-primitives-neutral-100: ...;
  --token-primitives-neutral-200: ...;
  /* ... */
  --token-scale-0: 0;
  --token-scale-100: 4px;
  /* ... */
  --token-bg-body: ...;
  --token-text-default: ...;
  --token-border-default: ...;
}
```

**`src/scss/tokens/_variables.scss`** — must contain SCSS variables:
```scss
$token-scale-0: var(--token-scale-0, 0);
$token-scale-100: var(--token-scale-100, 4px);
/* ... */
```

**`src/scss/tokens/_utilities.scss`** — must contain utility classes.

**Acceptance criteria:**
- [ ] All three files generated
- [ ] `--token-scale-100` resolves to `4px`
- [ ] `--token-scale-400` resolves to `16px`
- [ ] `--token-primitives-neutral-100` is white (`#ffffff` or equivalent)
- [ ] `--token-primitives-neutral-1200` is near-black
- [ ] `--token-semantics-primary-base` is present
- [ ] `--token-semantics-danger-base` is present (not `error`)
- [ ] `--token-bg-body` is present
- [ ] `--token-text-default` is present
- [ ] `--token-border-default` is present

---

### 1.5 Delete OSUI abstract setup files

Delete these files entirely:

- `src/scss/00-abstract/_setup-color-vars.scss`
- `src/scss/00-abstract/_setup-global-typography-vars.scss`
- `src/scss/00-abstract/_setup-border-vars.scss`

Reduce `src/scss/00-abstract/_setup-global-vars.scss` to **layout-only vars** (not tokens — these are app-level customisation points with no token equivalent):

```scss
////
/// @group SCSS_Setup_Global_Variables

/* App Settings */
$header-size: 56px;
$header-size-content: 48px;
$side-menu-size: 300px;
$bottom-bar-size: 56px;
$footer-height: 0px;

/* Build helpers */
$osui-devices: 'phone', 'tablet', 'desktop';
$osui-box-sides: 'top', 'right', 'bottom', 'left';
$osui-box-x-sides: 'right', 'bottom';
$osui-box-y-sides: 'top', 'bottom';
$osui-box-corners: 'top-left', 'top-right', 'bottom-right', 'bottom-left';
```

**What is removed:** all `$osui-sizes`, `$osui-shadow-types`, `$osui-colors-*`, `$osui-typography-*`, `$osui-border-*` maps — these are replaced by the token system.

**Acceptance criteria:**
- [ ] The three deleted files no longer exist
- [ ] `_setup-global-vars.scss` contains only the vars listed above
- [ ] No other file imports the deleted files (check build output for errors)

---

### 1.6 Delete OSUI helper functions

File: `src/scss/00-abstract/_functions.scss`

Delete entirely. These functions (`get-background-color`, `get-border-color`, `get-text-color`, `get-app-settings-background-color`) will be removed from all call sites in Phase 2.

> Note: do NOT delete before Phase 2 completes — they are still referenced throughout component SCSS. Delete at the end of Phase 2 once all call sites are replaced.

**Acceptance criteria (end of Phase 2):**
- [ ] `_functions.scss` deleted
- [ ] Zero occurrences of `get-background-color(`, `get-border-color(`, `get-text-color(`, `get-app-settings-background-color(` in `src/`

---

### 1.7 Replace `_root.scss` with token import + app-settings vars

File: `src/scss/01-foundations/_root.scss`

Replace the entire file with:

```scss
////
/// @group Root
/// Imports design token CSS custom properties and declares app-level overrideable vars.

// Design token CSS custom properties
@import '../tokens/root';

:root {
  /*! App Settings — overrideable per app theme */
  --header-color: var(--token-bg-surface-default, #ffffff);
  --color-background-body: var(--token-bg-body, #f3f6f8);
  --color-background-login: var(--token-bg-surface-default, #ffffff);

  /*! App Layout — not in token system */
  --header-size: #{$header-size};
  --header-size-content: #{$header-size-content};
  --side-menu-size: #{$side-menu-size};
  --bottom-bar-size: #{$bottom-bar-size};
  --footer-height: #{$footer-height};

  /*! iOS / Android Safe Areas */
  --os-safe-area-top: #{safe-area(top)};
  --os-safe-area-right: #{safe-area(right)};
  --os-safe-area-bottom: #{safe-area(bottom)};
  --os-safe-area-left: #{safe-area(left)};

  /*! Layer System */
  --layer-system-scale: 5;
  --layer-above: var(--layer-system-scale);
  --layer-below: calc(-1 * var(--layer-system-scale));

  --layer-global-screen: 0;
  --layer-global-elevated: calc(var(--layer-above) + var(--layer-global-screen));
  --layer-global-navigation: calc(var(--layer-above) + var(--layer-global-elevated));
  --layer-global-off-canvas: calc(var(--layer-above) + var(--layer-global-navigation));
  --layer-global-instant-interaction: calc(var(--layer-above) + var(--layer-global-off-canvas));

  --layer-global-negative: -1;
  --layer-global-auto: auto;

  --layer-local-tier-1: 1;
  --layer-local-tier-2: 2;
  --layer-local-tier-3: 3;
  --layer-local-tier-4: 4;
  --layer-local-tier-5: 5;

  --osui-bottom-sheet-layer: var(--layer-global-off-canvas);
  --osui-notification-layer: var(--layer-global-instant-interaction);
  --osui-popup-layer: var(--layer-global-off-canvas);
  --osui-sidebar-layer: var(--layer-global-off-canvas);
  --osui-menu-layer: calc(var(--layer-global-navigation) + var(--layer-local-tier-2));
}
```

**Acceptance criteria:**
- [ ] `@import '../tokens/root'` resolves correctly after `prebuild` runs
- [ ] Compiled `:root` contains both `--token-*` vars (from import) and `--header-size`, `--layer-*`, `--os-safe-area-*` vars
- [ ] `--color-background-body` is present with `var(--token-bg-body, ...)` as value
- [ ] No `--space-*`, `--color-primary`, `--font-size-*`, `--border-radius-*`, `--shadow-*` vars remain in `:root`

---

### 1.8 Import token variables in the abstract layer

File: `src/scss/00-abstract/_setup-global-vars.scss`

Add at the top:
```scss
// Design token SCSS variables (generated)
@import '../tokens/variables';
```

This makes `$token-*` SCSS variables available for any file that needs them at compile time.

**Acceptance criteria:**
- [ ] `$token-scale-400` resolves to `var(--token-scale-400, 16px)` in compiled output

---

### 1.9 Import token utilities in entry files

Files: `src/scss/O11.OutSystemsUI.scss` and `src/scss/ODC.OutSystemsUI.scss`

Add after the existing utility imports:
```scss
@import 'tokens/utilities';
```

**Acceptance criteria:**
- [ ] Token utility classes (e.g. `.token-margin-*`, `.token-padding-*`) are present in compiled output

---

### Phase 1 — Full acceptance criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] Compiled CSS contains `--token-primitives-neutral-100`
- [ ] Compiled CSS contains `--token-scale-400`
- [ ] Compiled CSS contains `--token-semantics-primary-base`
- [ ] Compiled CSS contains `--token-bg-body`
- [ ] Compiled CSS contains `--header-size: 56px`
- [ ] Compiled CSS contains `--layer-global-elevated`
- [ ] Compiled CSS contains `--os-safe-area-top`
- [ ] Compiled CSS does NOT contain `--space-base` in `:root`
- [ ] Compiled CSS does NOT contain `--color-primary` in `:root`
- [ ] Compiled CSS does NOT contain `--font-size-base` in `:root`
- [ ] Compiled CSS does NOT contain `--border-radius-soft` in `:root`
- [ ] Compiled CSS does NOT contain `--shadow-s` in `:root`

> **Note:** After Phase 1, component SCSS files still reference the old `--space-*`, `--color-*` vars. These will be broken — visual output will be degraded until Phase 2 completes. This is expected and intentional.

---

## Phase 2 — Update all component SCSS

### Naming rules (must follow exactly)

| Old pattern | New pattern |
|-------------|-------------|
| `var(--space-none)` | `var(--token-scale-0)` |
| `var(--space-xs)` | `var(--token-scale-100)` |
| `var(--space-s)` | `var(--token-scale-200)` |
| `var(--space-base)` | `var(--token-scale-400)` |
| `var(--space-m)` | `var(--token-scale-600)` |
| `var(--space-l)` | `var(--token-scale-800)` |
| `var(--space-xl)` | `var(--token-scale-1000)` |
| `var(--space-xxl)` | `var(--token-scale-1200)` |
| `var(--font-size-display)` | `var(--token-font-size-900)` |
| `var(--font-size-base)` | `var(--token-font-size-400)` |
| `var(--font-size-s)` | `var(--token-font-size-350)` |
| `var(--font-size-xs)` | `var(--token-font-size-300)` |
| `var(--font-size-label)` | `var(--token-font-size-275)` |
| `var(--font-size-h1)` | `var(--token-font-size-800)` |
| `var(--font-size-h2)` | `var(--token-font-size-700)` |
| `var(--font-size-h3)` | `var(--token-font-size-650)` |
| `var(--font-size-h4)` | `var(--token-font-size-550)` |
| `var(--font-size-h5)` | `var(--token-font-size-500)` |
| `var(--font-size-h6)` | `var(--token-font-size-450)` |
| `var(--font-light)` | `var(--token-font-weight-light)` |
| `var(--font-regular)` | `var(--token-font-weight-regular)` |
| `var(--font-semi-bold)` | `var(--token-font-weight-semi-bold)` |
| `var(--font-bold)` | `var(--token-font-weight-bold)` |
| `var(--border-size-none)` | `var(--token-border-size-0)` |
| `var(--border-size-s)` | `var(--token-border-size-025)` |
| `var(--border-size-m)` | `var(--token-border-size-050)` |
| `var(--border-size-l)` | `var(--token-border-size-075)` |
| `var(--border-radius-none)` | `var(--token-border-radius-0)` |
| `var(--border-radius-soft)` | `var(--token-border-radius-100)` |
| `var(--border-radius-rounded)` | `var(--token-border-radius-full)` |
| `var(--border-radius-circle)` | `50%` *(keep as literal — no token equiv)* |
| `var(--shadow-none)` | `none` *(keep as literal)* |
| `var(--shadow-xs)` | `var(--token-elevation-1)` |
| `var(--shadow-s)` | `var(--token-elevation-1)` |
| `var(--shadow-m)` | `var(--token-elevation-2)` |
| `var(--shadow-l)` | `var(--token-elevation-3)` |
| `var(--shadow-xl)` | `var(--token-elevation-4)` |
| `get-background-color('neutral-0')` | `var(--token-primitives-base-white)` |
| `get-background-color('neutral-1')` | `var(--token-primitives-neutral-100)` |
| `get-background-color('neutral-2')` | `var(--token-primitives-neutral-200)` |
| `get-background-color('neutral-3')` | `var(--token-primitives-neutral-300)` |
| `get-background-color('neutral-4')` | `var(--token-primitives-neutral-400)` |
| `get-background-color('neutral-5')` | `var(--token-primitives-neutral-500)` |
| `get-background-color('primary')` | `var(--token-semantics-primary-base)` |
| `get-background-color('primary-hover')` | `var(--token-semantics-primary-900)` |
| `get-background-color('overlay')` | `var(--token-backdrop)` |
| `get-background-color('transparent')` | `transparent` |
| `get-background-color('focus-outer')` | `var(--color-focus-outer)` *(keep local)* |
| `get-text-color('neutral-5')` | `var(--token-primitives-neutral-500)` |
| `get-text-color('neutral-6')` | `var(--token-primitives-neutral-600)` |
| `get-text-color('neutral-7')` | `var(--token-primitives-neutral-700)` |
| `get-text-color('neutral-9')` | `var(--token-primitives-neutral-900)` |
| `get-text-color('neutral-10')` | `var(--token-primitives-neutral-1200)` |
| `get-text-color('neutral-0')` | `var(--token-primitives-base-white)` |
| `get-text-color('primary')` | `var(--token-semantics-primary-base)` |
| `get-text-color('error')` | `var(--token-semantics-danger-base)` |
| `get-border-color('neutral-3')` | `var(--token-primitives-neutral-300)` |
| `get-border-color('neutral-4')` | `var(--token-primitives-neutral-400)` |
| `get-border-color('neutral-5')` | `var(--token-primitives-neutral-500)` |
| `get-border-color('neutral-6')` | `var(--token-primitives-neutral-600)` |
| `get-border-color('primary')` | `var(--token-semantics-primary-base)` |
| `get-border-color('transparent')` | `transparent` |
| `get-border-color('neutral-0')` | `var(--token-primitives-base-white)` |

> **Note:** `neutral-0` (white) maps to `--token-primitives-base-white`, NOT `--token-primitives-neutral-100` (which is `#f3f3f3`). All heading font sizes are fully covered by the token scale.

> **Color vars used in component-scoped `--var` declarations** (e.g. `--border-color: #{get-border-color('neutral-5')}`) follow the same replacement rules — the value changes, the custom property name stays.

### Files to update (in priority order)

**Tier 1 — Layout & Widgets** (`src/scss/02-layout/`, `src/scss/03-widgets/`)
- [ ] All files in `02-layout/`
- [ ] All files in `03-widgets/`

**Tier 2 — Patterns** (`src/scripts/OSFramework/OSUI/Pattern/*/scss/`)
- [ ] `_accordion.scss` / `_accordion-item.scss`
- [ ] `_animated-label.scss`
- [ ] `_bottomsheet.scss`
- [ ] `_button-loading.scss`
- [ ] `_carousel.scss`
- [ ] `_datepicker.scss`
- [ ] `_dropdown.scss` / `_dropdown-search.scss` / `_dropdown-tags.scss` / `_dropdown-serverside.scss`
- [ ] `_dropdownserversideitem.scss`
- [ ] `_flipcontent.scss`
- [ ] `_gallery.scss`
- [ ] `_monthpicker.scss`
- [ ] `_notification.scss`
- [ ] `_overflowmenu.scss`
- [ ] `_progressbar.scss` / `_progresscircle.scss`
- [ ] `_rangeslider.scss`
- [ ] `_rating.scss`
- [ ] `_search.scss`
- [ ] `_sectionindex.scss`
- [ ] `_sidebar.scss`
- [ ] `_submenu.scss`
- [ ] `_tabs.scss`
- [ ] `_timepicker.scss`
- [ ] `_tooltip.scss`
- [ ] `_video.scss`

**Tier 2b — Feature SCSS** (`src/scripts/OSFramework/OSUI/Feature/*/scss/`)
- [ ] `_balloon.scss`

**Tier 3 — Provider overrides** (`src/scripts/Providers/OSUI/*/scss/`)
- [ ] `_virtualselect.scss`
- [ ] `_flatpickr.scss` (SharedProviderResources)
- [ ] `_flatpickr.scss` (Monthpicker)
- [ ] `_flatpickr.scss` (Timepicker)
- [ ] `_noUiSlider.scss`
- [ ] `splide-core.scss`
- [ ] ~~`_virtualselect_lib.scss`~~ — do not touch
- [ ] ~~`_flatpickr_lib.scss`~~ — do not touch

**Tier 4 — UI Patterns & Utilities** (`src/scss/04-patterns/`, `src/scss/05-useful/`)
- [ ] All files in `04-patterns/`
- [ ] All files in `05-useful/`

### Phase 2 — Full acceptance criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] Zero occurrences of `var(--space-` in `src/` (grep check)
- [ ] Zero occurrences of `var(--color-` in `src/` (grep check, except `--color-background-body` / `--color-background-login` / `--color-focus-outer` in `_root.scss`)
- [ ] Zero occurrences of `var(--font-size-` in `src/` (grep check)
- [ ] Zero occurrences of `var(--font-light` / `--font-regular` / `--font-semi-bold` / `--font-bold` in `src/`
- [ ] Zero occurrences of `var(--border-size-` in `src/` (grep check)
- [ ] Zero occurrences of `var(--border-radius-` in `src/` (grep check)
- [ ] Zero occurrences of `var(--shadow-` in `src/` (grep check)
- [ ] Zero occurrences of `get-background-color(` in `src/` (grep check)
- [ ] Zero occurrences of `get-border-color(` in `src/` (grep check)
- [ ] Zero occurrences of `get-text-color(` in `src/` (grep check)
- [ ] `_functions.scss` deleted
- [ ] Visual output compared against `deprecated/` — intentional changes documented

---

## Phase 2b — Component CSS API

> Nomenclature (D11): **Option B** — `--osui-{component}-{property}` (e.g. `--osui-sidebar-background`, `--osui-accordion-item-border-color`).

### Pattern to follow for every component

Each component root selector must:
1. Declare all applicable scoped vars at the top, each defaulting to a token
2. Use only the scoped vars in property declarations (never the token var directly in a property)

```scss
.osui-{component} {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-{component}-background:    var(--token-bg-surface-default);
  --osui-{component}-color:         var(--token-text-default);
  --osui-{component}-border-color:  var(--token-border-default);
  --osui-{component}-border-width:  var(--token-border-border-size-025);
  --osui-{component}-border-radius: var(--token-border-border-radius-100);
  --osui-{component}-shadow:        var(--token-elevation-2);
  --osui-{component}-padding-x:     var(--token-scale-400);
  --osui-{component}-padding-y:     var(--token-scale-400);
  --osui-{component}-gap:           var(--token-scale-400);
  --osui-{component}-font-size:     var(--token-font-font-size-350);
  // ───────────────────────────────────────────────────────────────────

  background-color: var(--osui-{component}-background);
  color:            var(--osui-{component}-color);
  border:           var(--osui-{component}-border-width) solid var(--osui-{component}-border-color);
  border-radius:    var(--osui-{component}-border-radius);
  box-shadow:       var(--osui-{component}-shadow);
  padding:          var(--osui-{component}-padding-y) var(--osui-{component}-padding-x);
  gap:              var(--osui-{component}-gap);
  font-size:        var(--osui-{component}-font-size);
}
```

**Only declare vars for properties the component actually uses.** Do not add `--osui-sidebar-gap` if the sidebar doesn't use `gap`.

---

### Sub-elements

Sub-elements within a component may have their own scoped vars when they have meaningfully different visual properties from the root. Use a compound name:

```scss
.osui-accordion-item {
  --osui-accordion-item-background:    var(--token-bg-surface-default);
  --osui-accordion-item-border-color:  var(--token-border-default);
  --osui-accordion-item-border-radius: var(--token-border-border-radius-100);
  --osui-accordion-item-padding-x:     var(--token-scale-400);
  --osui-accordion-item-padding-y:     var(--token-scale-400);

  &__header {
    --osui-accordion-item-header-background: var(--token-bg-neutral-subtle);
    --osui-accordion-item-header-font-size:  var(--token-font-font-size-350);
    // ...
  }
}
```

---

### State variants

State modifiers (hover, active, disabled) override the scoped var, not the property:

```scss
.osui-{component} {
  --osui-{component}-background: var(--token-bg-surface-default);
  background-color: var(--osui-{component}-background);

  &:hover {
    --osui-{component}-background: var(--token-bg-neutral-subtle);
  }

  &.is-disabled {
    --osui-{component}-background: var(--token-bg-input-disabled);
    --osui-{component}-color:      var(--token-text-disabled);
  }
}
```

---

### Component coverage checklist

Apply to all pattern and feature SCSS — skip provider overrides (`.vscomp-*`, `.flatpickr-*`) and utility classes.

**Patterns:**
- [ ] `.osui-accordion` / `.osui-accordion-item`
- [ ] `.osui-animated-label`
- [ ] `.osui-bottom-sheet`
- [ ] `.osui-button-loading`
- [ ] `.osui-carousel`
- [ ] `.osui-datepicker`
- [ ] `.osui-dropdown` / `.osui-dropdown-search` / `.osui-dropdown-tags`
- [ ] `.osui-flipcontent`
- [ ] `.osui-gallery`
- [ ] `.osui-monthpicker`
- [ ] `.osui-notification`
- [ ] `.osui-overflow-menu`
- [ ] `.osui-progress-bar` / `.osui-progress-circle`
- [ ] `.osui-range-slider`
- [ ] `.osui-rating`
- [ ] `.osui-search`
- [ ] `.osui-section-index`
- [ ] `.osui-sidebar`
- [ ] `.osui-submenu`
- [ ] `.osui-tabs`
- [ ] `.osui-timepicker`
- [ ] `.osui-tooltip`
- [ ] `.osui-video`

**Feature:**
- [ ] `.osui-balloon`

**Layout & widgets** (where named selectors exist):
- [ ] Layout containers in `src/scss/02-layout/`
- [ ] Widget selectors in `src/scss/03-widgets/`

---

### Phase 2b — Full acceptance criteria

- [ ] Every `osui-*` component root has a CSS API block at the top of its selector
- [ ] No component uses a `--token-*` var directly in a property declaration — always via a scoped var
- [ ] No component uses a `--token-*` var directly in a state variant — state overrides the scoped var
- [ ] Scoped var names follow the agreed D11 nomenclature consistently across all components
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0

---

## Phase 3 — Semantic token adoption

### Principle

After Phase 2b, component properties never reference tokens directly — they go through the CSS API vars. Phase 3 upgrades the **default values of those scoped vars** from primitive tokens (`--token-primitives-*`, `--token-scale-*`) to semantic tokens (`--token-bg-*`, `--token-text-*`, `--token-border-*`) wherever they exist.

```scss
// Phase 2b state
--osui-sidebar-background: var(--token-primitives-neutral-100);

// Phase 3 state
--osui-sidebar-background: var(--token-bg-surface-default);
```

### Priority targets

These are the highest-value replacements — they unlock per-component theming in the DTE:

| Usage context | Primitive token used in Phase 2 | Target semantic token |
|---------------|--------------------------------|----------------------|
| Input border default | `--token-primitives-neutral-600` | `--token-border-input-default` |
| Input border focus | `--token-semantics-primary-base` | `--token-border-input-press` |
| Input background | `--token-primitives-neutral-100` | `--token-bg-input-default` |
| Input background disabled | `--token-primitives-neutral-300` | `--token-bg-input-disabled` |
| Input text | `--token-primitives-neutral-1100` | `--token-text-default` |
| Input placeholder | `--token-primitives-neutral-800` | `--token-text-subtle` |
| Surface / card background | `--token-primitives-neutral-100` | `--token-bg-surface-default` |
| Body background | `--token-bg-body` | already semantic |
| Default text | `--token-primitives-neutral-1100` | `--token-text-default` |
| Subtle text | `--token-primitives-neutral-800` | `--token-text-subtle` |
| Disabled text | `--token-primitives-neutral-700` | `--token-text-disabled` |
| Link text | `--token-semantics-primary-base` | `--token-text-link` |
| Primary button bg | `--token-semantics-primary-base` | `--token-bg-primary-base-default` |
| Danger/error text | `--token-semantics-danger-base` | `--token-text-danger` |
| Default border | `--token-primitives-neutral-600` | `--token-border-default` |
| Focus ring | local / `--color-focus-outer` | `--token-border-focus` *(if added to tokens)* |

### Phase 3 — Full acceptance criteria

- [ ] All inputs use `--token-bg-input-*`, `--token-border-input-*`
- [ ] All text uses `--token-text-*` where a semantic token exists
- [ ] Buttons use `--token-bg-*` for backgrounds
- [ ] Surfaces (cards, modals, sidebars) use `--token-bg-surface-default`
- [ ] All semantic tokens surfaced to the DTE can be overridden to produce a consistent theme change
