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

---

## Phase 4 — Complete partial CSS APIs

**Goal:** Extend existing `--osui-*` blocks so that interaction states (hover, active, focus, checked) also route through the CSS API instead of referencing tokens directly.

### Components and additions

| Component | File | Var to add | Default value |
|-----------|------|-----------|---------------|
| AccordionItem | `src/scripts/OSFramework/OSUI/Pattern/AccordionItem/scss/_accordion-item.scss` | `--osui-accordion-item-active-indicator-color` | `var(--token-semantics-primary-base)` |
| AccordionItem | same | `--osui-accordion-item-icon-color` | `var(--token-semantics-primary-base)` |
| AnimatedLabel | `src/scripts/OSFramework/OSUI/Pattern/AnimatedLabel/scss/_animated-label.scss` | `--osui-animated-label-focus-border-color` | `var(--token-semantics-primary-base)` |
| Carousel | `src/scripts/OSFramework/OSUI/Pattern/Carousel/scss/_carousel.scss` | `--osui-carousel-pagination-active-color` | `var(--token-semantics-primary-base)` |
| Carousel | same | `--osui-carousel-arrow-icon-color` | `var(--token-primitives-neutral-700)` |
| OverflowMenu | `src/scripts/OSFramework/OSUI/Pattern/OverflowMenu/scss/_overflowmenu.scss` | `--osui-overflow-menu-background` | `var(--token-bg-surface-default)` |
| OverflowMenu | same | `--osui-overflow-menu-border-color` | `var(--token-border-default)` |
| OverflowMenu | same | `--osui-overflow-menu-shadow` | `var(--token-elevation-2)` |
| Popover | `src/scss/03-widgets/_popover.scss` | `--osui-popover-shadow` | `var(--token-elevation-1)` |
| RadioButton | `src/scss/03-widgets/_radio-button.scss` | `--osui-radio-checked-color` | `var(--token-semantics-primary-base)` |
| SectionIndex | `src/scripts/OSFramework/OSUI/Pattern/SectionIndex/scss/_sectionindex.scss` | `--osui-section-index-item-active-color` | `var(--token-text-default)` |
| SectionIndex | same | `--osui-section-index-active-indicator-color` | `var(--token-semantics-primary-base)` |
| Sidebar | `src/scripts/OSFramework/OSUI/Pattern/Sidebar/scss/_sidebar.scss` | `--osui-sidebar-color` | `var(--token-text-default)` |
| Submenu | `src/scripts/OSFramework/OSUI/Pattern/Submenu/scss/_submenu.scss` | `--osui-submenu-active-border-color` | `var(--token-semantics-primary-base)` |
| Submenu | same | `--osui-submenu-header-color` | `var(--token-text-default)` |
| Switch | `src/scss/03-widgets/_switch.scss` | `--osui-switch-checked-track-color` | `var(--token-semantics-primary-base)` |
| Switch | same | `--osui-switch-thumb-color` | `var(--token-primitives-base-white)` |
| Tabs | `src/scripts/OSFramework/OSUI/Pattern/Tabs/scss/_tabs.scss` | `--osui-tabs-indicator-color` | `var(--token-semantics-primary-base)` |

### Wire-up rule
Each added var must be consumed: replace the direct `var(--token-*)` reference in the existing state rule with the new CSS API var.

### Phase 4 — Acceptance criteria

- [ ] All listed vars are added to their component CSS API blocks (inside the `// ─── Component CSS API` section)
- [ ] All corresponding state/feature rules use the CSS API var, not a direct token
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0

---

## Phase 5 — New CSS APIs: High-priority components

**Goal:** Add CSS API blocks to the 10 most impactful components currently lacking `--osui-*` coverage. Priority criteria: frequently-used components, components with hardcoded colour values, components with the most visual states.

### Pattern reminder
Declare all scoped vars at the top of the root selector. Use only scoped vars in property declarations. State variants override the var, not the property.

---

### 5.1 Card

**File:** `src/scss/04-patterns/02-content/_card.scss` — **Root selector:** `.card`

```scss
.card {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-card-background:    var(--token-bg-surface-default);
  --osui-card-border-color:  var(--token-border-default);
  --osui-card-border-radius: var(--token-border-radius-100);
  --osui-card-border-width:  var(--token-border-size-025);
  --osui-card-padding:       var(--token-scale-600);
  // ───────────────────────────────────────────────────────────────────

  background-color: var(--osui-card-background);
  border: var(--osui-card-border-width) solid var(--osui-card-border-color);
  border-radius: var(--osui-card-border-radius);
  padding: var(--osui-card-padding);
}

.layout-native .card {
  --osui-card-padding: var(--token-scale-400);
}
```

---

### 5.2 Alert

**File:** `src/scss/04-patterns/02-content/_alert.scss` — **Root selector:** `.alert`

Multi-variant component: declare vars with `info` as default, override per variant modifier.

```scss
.alert {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-alert-background:    var(--token-semantics-info-base);
  --osui-alert-color:         var(--token-text-inverse);
  --osui-alert-border-radius: var(--token-border-radius-100);
  --osui-alert-padding:       var(--token-scale-400);
  // ───────────────────────────────────────────────────────────────────

  background-color: var(--osui-alert-background);
  border-radius: var(--osui-alert-border-radius);
  color: var(--osui-alert-color);
  padding: var(--osui-alert-padding);

  &-success { --osui-alert-background: var(--token-semantics-success-base); }
  &-error   { --osui-alert-background: var(--token-semantics-danger-base); }
  &-warning {
    --osui-alert-background: var(--token-semantics-warning-base);
    --osui-alert-color:      var(--token-text-default);
  }
}
```

---

### 5.3 FeedbackMessage

**File:** `src/scss/03-widgets/_feedback-message.scss` — **Root selector:** `.feedback-message`

Same multi-variant pattern as Alert. Retro-compat variant selectors (`div.feedback-message-error` etc.) must stay — they add var overrides.

```scss
.feedback-message {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-feedback-message-background:    var(--token-semantics-info-base);
  --osui-feedback-message-color:         var(--token-text-inverse);
  --osui-feedback-message-border-radius: var(--token-border-radius-100);
  --osui-feedback-message-padding:       var(--token-scale-400);
  // ───────────────────────────────────────────────────────────────────

  background-color: var(--osui-feedback-message-background);
  border-radius: var(--osui-feedback-message-border-radius);
  color: var(--osui-feedback-message-color);
  padding: var(--osui-feedback-message-padding);
}

// Retro-compat selectors — keep, extend with var overrides:
div.feedback-message-error   { --osui-feedback-message-background: var(--token-semantics-danger-base); }
div.feedback-message-info    { --osui-feedback-message-background: var(--token-semantics-info-base); }
div.feedback-message-success { --osui-feedback-message-background: var(--token-semantics-success-base); }
div.feedback-message-warning {
  --osui-feedback-message-background: var(--token-semantics-warning-base);
  --osui-feedback-message-color:      var(--token-text-default);
}
```

⚠️ The `.phone .feedback-message { border-radius: 0 }` responsive override stays on the property — no CSS API change needed there (property override is intentional, not about theming).

---

### 5.4 Table

**File:** `src/scss/03-widgets/_table.scss` — **Root selector:** `.table`

```scss
.table {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-table-border-color:            var(--token-border-default);
  --osui-table-border-radius:           var(--token-border-radius-100);
  --osui-table-header-background:       var(--token-bg-surface-default);
  --osui-table-header-color:            var(--token-text-subtlest);
  --osui-table-row-background:          var(--token-bg-surface-default);
  --osui-table-row-hover-background:    var(--token-bg-neutral-subtle-default);
  --osui-table-row-stripe-background:   var(--token-bg-neutral-subtle-default);
  --osui-table-row-selected-background: var(--token-semantics-primary-base);
  --osui-table-sorted-color:            var(--token-semantics-primary-base);
  // ───────────────────────────────────────────────────────────────────

  border: var(--token-border-size-025) solid var(--osui-table-border-color);
  border-radius: var(--osui-table-border-radius);
  ...
}
```

Wire:
- `th`: `background-color` → `var(--osui-table-header-background)`, `color` → `var(--osui-table-header-color)`
- `.sorted th`: `color` → `var(--osui-table-sorted-color)`
- `td`: `background` → `var(--osui-table-row-background)`
- `.table-row:hover td` → `var(--osui-table-row-hover-background)` (**replaces hardcoded `rgba(21, 24, 26, 0.04)` in `.desktop`**)
- `.table-row-stripping:nth-child(even) td` → `var(--osui-table-row-stripe-background)`
- `.table-row-selected td` → `background: var(--osui-table-row-selected-background) linear-gradient(...)`

---

### 5.5 ListItem

**File:** `src/scss/03-widgets/_list-item.scss` — **Root selector:** `.list .list-item`

The CSS API vars are scoped inside `.list .list-item` (the styled context), not on bare `.list-item`.

```scss
.list {
  .list-item {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-list-item-background:          var(--token-bg-surface-default);
    --osui-list-item-hover-background:    var(--token-bg-neutral-subtle-default);
    --osui-list-item-selected-background: var(--token-semantics-primary-base);
    --osui-list-item-border-color:        var(--token-border-default);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-list-item-background);
    border-bottom-color: var(--osui-list-item-border-color);
  }
}

.desktop, .tablet.landscape {
  .list {
    .list-item:hover:not(.list-item-no-hover):not(.list-item-selected) {
      --osui-list-item-background: var(--osui-list-item-hover-background);
    }
    .list-item-selected {
      background: var(--osui-list-item-selected-background)
        linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9));
    }
  }
}
```

---

### 5.6 Popup

**File:** `src/scss/03-widgets/_popup.scss` — **Root selectors:** `.popup-backdrop`, `.popup-dialog`

```scss
.popup {
  &-backdrop {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-popup-backdrop-color: var(--token-backdrop);
    // ───────────────────────────────────────────────────────────────────
    background-color: var(--osui-popup-backdrop-color);
  }

  &-dialog {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-popup-background:    var(--token-bg-surface-default);
    --osui-popup-border-radius: var(--token-border-radius-100);
    --osui-popup-shadow:        var(--token-elevation-4);
    --osui-popup-padding:       var(--token-scale-600);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-popup-background);
    border-radius: var(--osui-popup-border-radius);
    box-shadow: var(--osui-popup-shadow);
    padding: var(--osui-popup-padding);
  }
}
```

---

### 5.7 ChatMessage ⚠️ Critical: hardcoded colour

**File:** `src/scss/04-patterns/02-content/_chat-message.scss` — **Root selector:** `.chat-message`

The "sent" bubble (`right` variant) uses a hardcoded `#4263eb`. Replace with `var(--token-semantics-primary-base)`.

> **Visual note:** This changes the sent-bubble colour from `#4263eb` (indigo) to `var(--token-semantics-primary-base)` (brand primary, default `#1068eb`). Intentional — ties the component to the brand colour system.

```scss
.chat {
  &-message {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-chat-message-background:    var(--token-primitives-neutral-300);
    --osui-chat-message-color:         inherit;
    --osui-chat-message-border-radius: var(--token-border-radius-100);
    --osui-chat-message-padding:       var(--token-scale-400);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-chat-message-background);
    border-radius: var(--osui-chat-message-border-radius);
    color: var(--osui-chat-message-color);
    padding: var(--osui-chat-message-padding);
  }

  &.right .chat-message {
    --osui-chat-message-background: var(--token-semantics-primary-base); // was: #4263eb
    --osui-chat-message-color:      var(--token-text-inverse);
  }
}
```

---

### 5.8 Wizard

**File:** `src/scss/04-patterns/04-navigation/_wizard.scss` — **Root selector:** `.wizard-item-icon`

The step circle is the primary visual unit. Declare vars there and propagate via state modifiers on `.wizard-wrapper-item`.

```scss
.wizard {
  &-item-icon {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-wizard-step-background:   var(--token-bg-surface-default);
    --osui-wizard-step-border-color: var(--token-border-input-default);
    --osui-wizard-step-color:        var(--token-primitives-neutral-700);
    --osui-wizard-connector-color:   var(--token-bg-neutral-base-default);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-wizard-step-background);
    border-color: var(--osui-wizard-step-border-color);
    color: var(--osui-wizard-step-color);

    &-wrapper:before {
      background-color: var(--osui-wizard-connector-color);
    }
  }

  &-wrapper-item {
    &.active .wizard-item-icon {
      --osui-wizard-step-border-color: var(--token-semantics-primary-base);
      --osui-wizard-step-color:        var(--token-semantics-primary-base);
      --osui-wizard-connector-color:   var(--token-semantics-primary-base);
    }
    &.past .wizard-item-icon {
      --osui-wizard-step-background:   var(--token-semantics-primary-base);
      --osui-wizard-step-border-color: var(--token-semantics-primary-base);
      --osui-wizard-step-color:        var(--token-text-inverse);
      --osui-wizard-connector-color:   var(--token-semantics-primary-base);
    }
  }
}
```

---

### 5.9 Pagination

**File:** `src/scss/04-patterns/04-navigation/_pagination.scss` — **Root selector:** `.pagination-button`

Also replaces the hardcoded `rgba(21, 24, 26, 0.04)` hover background.

```scss
.pagination {
  &-button {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-pagination-button-background:       var(--token-bg-surface-default);
    --osui-pagination-button-border-color:     var(--token-border-default);
    --osui-pagination-button-color:            var(--token-text-subtlest);
    --osui-pagination-button-border-radius:    var(--token-border-radius-100);
    --osui-pagination-button-hover-background: var(--token-bg-neutral-subtle-default);
    --osui-pagination-active-border-color:     var(--token-semantics-primary-base);
    --osui-pagination-active-color:            var(--token-semantics-primary-base);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-pagination-button-background);
    border-color: var(--osui-pagination-button-border-color);
    border-radius: var(--osui-pagination-button-border-radius);
    color: var(--osui-pagination-button-color);

    &.is--active {
      --osui-pagination-button-border-color: var(--osui-pagination-active-border-color);
      --osui-pagination-button-color:        var(--osui-pagination-active-color);
    }
  }
}

// Replace hardcoded rgba — wire hover through the CSS API var:
.desktop {
  .pagination-button:not(.is--ellipsis):hover {
    --osui-pagination-button-background: var(--osui-pagination-button-hover-background);
  }
}
```

> **Visual note:** Hover background changes from `rgba(21, 24, 26, 0.04)` to `var(--token-bg-neutral-subtle-default)` (solid light gray). Acceptable trade-off for theming consistency.

---

### 5.10 FloatingActions

**File:** `src/scss/04-patterns/03-interaction/_floating-actions.scss`  
**Selectors:** `.floating-button` (trigger) and `.floating-actions-item-button` (items)

```scss
.floating {
  &-button {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-floating-button-background: var(--token-semantics-primary-base);
    --osui-floating-button-color:      var(--token-text-inverse);
    --osui-floating-button-shadow:     var(--token-elevation-4);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-floating-button-background);
    box-shadow: var(--osui-floating-button-shadow);
    color: var(--osui-floating-button-color);
  }

  &-actions-item-button {
    // ─── Component CSS API ─────────────────────────────────────────────
    --osui-floating-actions-item-background:       var(--token-bg-surface-default);
    --osui-floating-actions-item-color:            var(--token-semantics-primary-base);
    --osui-floating-actions-item-shadow:           var(--token-elevation-1);
    --osui-floating-actions-item-hover-background: var(--token-semantics-primary-base);
    --osui-floating-actions-item-hover-color:      var(--token-text-inverse);
    // ───────────────────────────────────────────────────────────────────

    background-color: var(--osui-floating-actions-item-background);
    box-shadow: var(--osui-floating-actions-item-shadow);
    color: var(--osui-floating-actions-item-color);

    &:hover {
      --osui-floating-actions-item-background: var(--osui-floating-actions-item-hover-background);
      --osui-floating-actions-item-color:      var(--osui-floating-actions-item-hover-color);
    }
  }
}
```

---

### Phase 5 — Full acceptance criteria

- [ ] All 10 components have a `// ─── Component CSS API` block
- [ ] No component in this set has a `--token-*` var or hardcoded value used directly in a property declaration
- [ ] `.chat.right .chat-message` no longer has `background-color: #4263eb` — replaced with CSS API var
- [ ] `.desktop .pagination-button:hover` no longer has hardcoded `rgba(21, 24, 26, 0.04)` — replaced with CSS API var
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0

---

## Phase 6 — New CSS APIs: Remaining components

**Goal:** Extend CSS API coverage to all remaining visual components. Lower priority than Phase 5 but required for complete DTE theming support.

For each component: add a `// ─── Component CSS API` block at the top of the root selector, declare the listed vars, and wire each to replace the direct token or value reference.

---

### Navigation

- [ ] **BottomBarItem** — `src/scss/04-patterns/04-navigation/_bottom-bar-item.scss` → `.bottom-bar-wrapper`
  - `--osui-bottom-bar-background: var(--token-bg-surface-default)`
  - `--osui-bottom-bar-border-color: var(--token-primitives-neutral-300)` *(intentional primitive — no semantic match)*
  - `--osui-bottom-bar-color: var(--token-text-subtlest)`
  - `--osui-bottom-bar-active-color: var(--token-semantics-primary-base)`

- [ ] **Breadcrumbs** — `src/scss/04-patterns/04-navigation/_breadcrumbs.scss` → `.breadcrumbs-item`
  - `--osui-breadcrumbs-color: var(--token-text-subtlest)`
  - `--osui-breadcrumbs-separator-color: var(--token-primitives-neutral-700)` *(intentional primitive)*

- [ ] **Timeline** — `src/scss/04-patterns/04-navigation/_timeline.scss` → `.timeline`
  - `--osui-timeline-line-color: var(--token-bg-neutral-base-default)`
  - `--osui-timeline-icon-color: var(--token-text-inverse)`

---

### Content

- [ ] **Section** — `src/scss/04-patterns/02-content/_section.scss` → `.section-title`
  - `--osui-section-border-color: var(--token-border-default)`
  - `--osui-section-color: var(--token-text-default)`

- [ ] **CardItem** — `src/scss/04-patterns/02-content/_card-item.scss` → `.card-detail`
  - `--osui-card-item-title-color: var(--token-text-default)`
  - `--osui-card-item-text-color: var(--token-primitives-neutral-700)` *(intentional primitive)*

- [ ] **ListItemContent** — `src/scss/04-patterns/02-content/_list-item-content.scss` → `.list-item-content`
  - `--osui-list-item-content-title-color: var(--token-text-default)`
  - `--osui-list-item-content-text-color: var(--token-primitives-neutral-700)` *(intentional primitive)*

- [ ] **BlankSlate** — `src/scss/04-patterns/02-content/_blank-slate.scss` → `.blank-slate`
  - `--osui-blank-slate-icon-color: var(--token-text-disabled)`
  - `--osui-blank-slate-description-color: var(--token-text-default)`

- [ ] **Tag** — `src/scss/04-patterns/02-content/_tag.scss` → `.tag`
  - `--osui-tag-color: var(--token-text-inverse)`

- [ ] **UserAvatar** — `src/scss/04-patterns/02-content/_user-avatar.scss` → `.avatar`
  - `--osui-avatar-color: var(--token-text-inverse)`

---

### Interaction

- [ ] **StackedCards** — `src/scss/04-patterns/03-interaction/_stacked-cards.scss` → `.stackedcards`
  - `--osui-stacked-cards-background: var(--token-bg-surface-default)`
  - `--osui-stacked-cards-overlay-right-color: var(--token-semantics-success-base)`
  - `--osui-stacked-cards-overlay-left-color: var(--token-semantics-danger-base)`
  - `--osui-stacked-cards-overlay-top-color: var(--token-semantics-info-base)`

- [ ] **ActionSheet** — `src/scss/04-patterns/03-interaction/_action-sheet.scss` → `.action-sheet`
  - `--osui-action-sheet-background: var(--token-bg-surface-default)`
  - `--osui-action-sheet-cancel-color: var(--token-text-subtlest)`

- [ ] **InputWithIcon** — `src/scss/04-patterns/03-interaction/_input-with-icon.scss` → `.input-with-icon`
  - `--osui-input-with-icon-icon-color: var(--token-primitives-neutral-700)` *(intentional primitive)*

- [ ] **MasterDetail** — `src/scss/04-patterns/01-adaptive/_master-detail.scss` → `.split-screen-wrapper`
  - `--osui-master-detail-background: var(--token-bg-surface-default)`
  - `--osui-master-detail-border-color: var(--token-border-default)`

---

### Numbers

- [ ] **Badge** — `src/scss/04-patterns/05-numbers/_badge.scss` → `.badge`
  - `--osui-badge-color: var(--token-text-inverse)`

---

### Utilities

- [ ] **Separator** — `src/scss/04-patterns/06-utilities/_separator.scss` → `.separator`
  - `--osui-separator-color: var(--token-semantics-primary-base)`

- [ ] **ProviderLoginButton** — `src/scss/04-patterns/06-utilities/_provider-login-button.scss` → `.btn.btn-provider-login`
  - `--osui-provider-login-btn-background: var(--token-bg-surface-default)`
  - `--osui-provider-login-btn-border-color: var(--token-border-input-default)`
  - `--osui-provider-login-btn-color: var(--token-primitives-neutral-700)` *(intentional primitive)*

---

### Pattern scripts

- [ ] **Rating** — `src/scripts/OSFramework/OSUI/Pattern/Rating/scss/_rating.scss` → `.rating`
  - `--osui-rating-filled-color: var(--token-semantics-warning-base)`
  - `--osui-rating-empty-color: var(--token-border-default)`
  - `--osui-rating-disabled-color: var(--token-text-disabled)`

---

### Phase 6 — Full acceptance criteria

- [ ] All components in the checklist have a `// ─── Component CSS API` block
- [ ] All added vars are consumed in the component (no orphan declarations)
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0

---

## Phase 7 — Harden state/variant coverage in existing APIs

**Goal:** Components with existing CSS API blocks still have some state/variant rules that reference `--token-*` vars or hardcoded values directly. This phase wires those remaining references through the CSS API.

---

### 7.1 Button — Semantic variant backgrounds

**File:** `src/scss/03-widgets/_btn.scss`

The `btn-primary`, `btn-success`, and `btn-danger` variants bypass `--osui-btn-background`. Add per-variant API vars so each variant is independently themeable from the DTE.

| Var | Default | Selector |
|-----|---------|----------|
| `--osui-btn-primary-background` | `var(--token-semantics-primary-base)` | `.btn.btn-primary` |
| `--osui-btn-primary-color` | `var(--token-text-inverse)` | `.btn.btn-primary` |
| `--osui-btn-success-background` | `var(--token-semantics-success-base)` | `.btn.btn-success` |
| `--osui-btn-success-color` | `var(--token-text-inverse)` | `.btn.btn-success` |
| `--osui-btn-danger-background` | `var(--token-semantics-danger-base)` | `.btn.btn-danger` |
| `--osui-btn-danger-color` | `var(--token-text-inverse)` | `.btn.btn-danger` |

Declare each set on the respective modifier class and consume via the existing `background-color`/`color` properties (which should be updated to reference the new vars instead of the direct token vars).

---

### 7.2 Checkbox — Checked state

**File:** `src/scss/03-widgets/_checkbox.scss`

Add to existing CSS API block:
- `--osui-checkbox-checked-background: var(--token-semantics-primary-base)`
- `--osui-checkbox-checked-border-color: var(--token-semantics-primary-base)`

Wire: replace direct `var(--token-semantics-primary-base)` references in the `:checked + label:before` selector.

---

### 7.3 Input — Focus and error states

**File:** `src/scss/03-widgets/_inputs-and-textareas.scss`

Add to existing CSS API block:
- `--osui-input-focus-border-color: var(--token-semantics-primary-base)`
- `--osui-input-error-border-color: var(--token-semantics-danger-base)`
- `--osui-input-placeholder-color: var(--token-text-subtlest)`

Wire: replace direct token refs in the `:focus`, `.not-valid`, and `::placeholder` rules.

---

### 7.4 Remaining hardcoded value audit

After Phases 5 and 6, run this check and fix any remaining cases:

```bash
# Find hardcoded hex values in OSUI SCSS (excluding provider libs and deprecated)
grep -r '#[0-9a-fA-F]\{3,6\}' src/scss/ src/scripts/OSFramework src/scripts/Providers/OSUI \
  --include="*.scss" \
  --exclude-dir=10-deprecated \
  --exclude="*_lib.scss"
```

Any match that is NOT:
- Inside a `// intentional keep` comment
- A focus ring (`#ffd337`)
- A known primitive with no semantic equivalent

…must be replaced with a CSS API var defaulting to the closest semantic token.

---

### Phase 7 — Full acceptance criteria

- [ ] `.btn.btn-primary`, `.btn.btn-success`, `.btn.btn-error` use CSS API vars for `background-color`, `border-color`, and `color`
- [ ] `.layout-native .header-right .btn { color }` uses `--osui-btn-color` rather than a direct token ref
- [ ] Checkbox `:checked:before` uses `--osui-checkbox-checked-color` for both `background` and `border`
- [ ] A11y `.has-accessible-features [data-checkbox]:checked:before { border-color }` also uses `--osui-checkbox-checked-color`
- [ ] Input `:focus` border uses `--osui-input-focus-border-color` (normal + `.layout-native` header context)
- [ ] Input `.not-valid` border uses `--osui-input-error-border-color` (normal + a11y context)
- [ ] Hardcoded hex audit returns zero unresolved matches in component SCSS
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0

---

## Phase 8 — Consolidate SCSS into one tree

**Goal:** Eliminate the split between `src/scss/` and `src/scripts/OSFramework/OSUI/` for SCSS files. Move all pattern SCSS and all provider SCSS into `src/scss/04-patterns/`, giving every pattern its own folder and every pattern with a provider a `provider/` subfolder inside it.

**Why:** A single tree is easier to navigate, removes the conceptual overhead of "where does this SCSS live?", and makes Phase 9 (documentation generation) trivial since there's only one place to scan.

---

### 8.1 Target folder structure

Existing flat files in `04-patterns/` stay where they are. Only the files currently in `src/scripts/` move.

```
src/scss/04-patterns/
├── 01-adaptive/
│   └── bottom-sheet/
│       └── _bottomsheet.scss
│
├── 02-content/
│   ├── accordion/
│   │   └── _accordion.scss
│   ├── accordion-item/
│   │   └── _accordion-item.scss
│   ├── carousel/
│   │   ├── _carousel.scss
│   │   ├── _carousel_ss_preview_imgs.scss
│   │   └── provider/
│   │       └── splide-core.scss
│   ├── flip-content/
│   │   └── _flipcontent.scss
│   ├── gallery/
│   │   └── _gallery.scss
│   └── video/
│       ├── _video.scss
│       └── _video_ss_preview_imgs.scss
│
├── 03-interaction/
│   ├── animated-label/
│   │   └── _animated-label.scss
│   ├── balloon/                              ← from Feature/Balloon
│   │   └── _balloon.scss
│   ├── button-loading/
│   │   └── _button-loading.scss
│   ├── date-picker/
│   │   ├── _datepicker.scss
│   │   ├── _datepicker_ss_preview_imgs.scss
│   │   └── provider/
│   │       ├── _flatpickr.scss               ← SharedProviderResources base override
│   │       └── _flatpickr_lib.scss           ← vendor lib (shared — see §8.2)
│   ├── dropdown/
│   │   ├── _dropdown.scss
│   │   ├── _dropdown-search.scss
│   │   ├── _dropdown-tags.scss
│   │   ├── _dropdown-serverside.scss
│   │   ├── _dropdownserversideitem.scss
│   │   └── provider/
│   │       ├── _virtualselect.scss
│   │       └── _virtualselect_lib.scss
│   ├── month-picker/
│   │   ├── _monthpicker.scss
│   │   ├── _monthpicker_ss_preview_image.scss
│   │   └── provider/
│   │       └── _flatpickr.scss               ← Monthpicker-specific override
│   ├── notification/
│   │   └── _notification.scss
│   ├── overflow-menu/
│   │   └── _overflowmenu.scss
│   ├── range-slider/
│   │   ├── _rangeslider.scss
│   │   └── provider/
│   │       └── _noUiSlider.scss
│   ├── search/
│   │   └── _search.scss
│   ├── time-picker/
│   │   ├── _timepicker.scss
│   │   ├── _timepicker_ss_preview_imgs.scss
│   │   └── provider/
│   │       └── _flatpickr.scss               ← Timepicker-specific override
│   └── tooltip/
│       └── _tooltip.scss
│
├── 04-navigation/
│   ├── section-index/
│   │   └── _sectionindex.scss
│   ├── sidebar/
│   │   └── _sidebar.scss
│   ├── submenu/
│   │   └── _submenu.scss
│   └── tabs/
│       └── _tabs.scss
│
└── 05-numbers/
    ├── progress/
    │   ├── _progressbar.scss
    │   └── _progresscircle.scss
    └── rating/
        └── _rating.scss
```

---

### 8.2 Shared `_flatpickr_lib.scss`

DatePicker, TimePicker, and MonthPicker each have their own `_flatpickr.scss` override but all depend on the same vendor lib baseline (`_flatpickr_lib.scss`, currently in `SharedProviderResources/`).

**Decision needed before implementation** — two options:

**Option A (simpler):** Keep `_flatpickr_lib.scss` under `date-picker/provider/`. The TimePicker and MonthPicker `_flatpickr.scss` overrides import it via relative path (`../../date-picker/provider/_flatpickr_lib`).

**Option B (cleaner):** Extract to a dedicated shared location, e.g. `src/scss/providers/flatpickr/_flatpickr_lib.scss`, and have all three pickers import from there.

---

### 8.3 Change surfaces

| Surface | Count | What changes |
|---------|-------|-------------|
| Pattern + provider SCSS files | ~44 | Internal `@import` paths to provider subfolders recalculated |
| `O11.OutSystemsUI.scss` | 1 | ~30 `@import '../scripts/...'` lines → `04-patterns/{category}/{pattern}/` |
| `ODC.OutSystemsUI.scss` | 1 | Same as above |
| `gulp/ProjectSpecs/Patterns/*.js` | 33 | Each `scss` key value updated to `../scss/04-patterns/{category}/{pattern}/` |

**Which pattern SCSS files have internal provider imports** (need path recalculation):

| Pattern file | Currently imports |
|-------------|------------------|
| `_dropdown.scss` | `Providers/OSUI/Dropdown/VirtualSelect/scss/_virtualselect.scss` |
| `_datepicker.scss` | `Providers/OSUI/SharedProviderResources/Flatpickr/scss/flatpickr` |
| `_timepicker.scss` | `Providers/OSUI/Timepicker/Flatpickr/scss/_flatpickr.scss` |
| `_monthpicker.scss` | `Providers/OSUI/Monthpicker/Flatpickr/scss/_flatpickr.scss` |
| `_carousel.scss` | (none — Splide core is imported separately in entry point) |
| `_rangeslider.scss` | (check — NoUISlider may be separate) |

---

### Phase 8 — Full acceptance criteria

- [ ] Zero SCSS files remain under `src/scripts/OSFramework/OSUI/*/scss/` or `src/scripts/Providers/OSUI/*/scss/`
- [ ] Every pattern has a named folder inside the appropriate `04-patterns/{category}/` directory
- [ ] Every pattern with a provider has a `provider/` subfolder containing the provider SCSS
- [ ] `O11.OutSystemsUI.scss` and `ODC.OutSystemsUI.scss` contain no `../scripts/` import paths
- [ ] All 33 gulp spec `scss` keys point into `../scss/04-patterns/`
- [ ] `npm run build` exits 0 (both O11 and ODC)
- [ ] `npm run lint` exits 0
- [ ] Visual output diff against pre-Phase-8 build is empty

---

## Phase 9 — CSS API reference document

**Goal:** Produce a single Markdown file that documents every `--osui-*` CSS custom property exposed by the library — its component, default value, and purpose. Serves as the canonical reference for DTE integration and for consumers who want to theme individual components.

---

### 9.1 Input

All SCSS files under `src/scss/` (post Phase-8 consolidation) that contain a `// ─── Component CSS API` block.

---

### 9.2 Output

**File:** `docs/css-api-reference.md`

---

### 9.3 Format

```markdown
# OutSystemsUI — CSS API Reference

Each component exposes a set of CSS custom properties scoped to its root
selector. Override them on the component's class to theme a single instance,
or override them globally by targeting the class in your app stylesheet.

---

## Widgets

### Button (`.btn`)
_File: `src/scss/03-widgets/_btn.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-btn-background` | `var(--token-bg-surface-default)` | |
| `--osui-btn-color` | `var(--token-semantics-primary-base)` | |
| `--osui-btn-border-color` | `currentColor` | |
| `--osui-btn-border-radius` | `var(--token-border-radius-100)` | |
| `--osui-btn-primary-background` | `var(--token-semantics-primary-base)` | Primary variant |
| `--osui-btn-primary-border-color` | `var(--token-semantics-primary-base)` | Primary variant |
| `--osui-btn-primary-color` | `var(--token-text-inverse)` | Primary variant |
...

---

## Patterns — Interaction

### Dropdown (`.osui-dropdown`)
_File: `src/scss/04-patterns/03-interaction/dropdown/_dropdown.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-dropdown-background` | `var(--token-bg-input-default)` | |
...
```

---

### 9.4 Sections

Organise by the same categories as `04-patterns/`:

1. **Widgets** — `src/scss/03-widgets/`
2. **Patterns – Adaptive** — `04-patterns/01-adaptive/`
3. **Patterns – Content** — `04-patterns/02-content/`
4. **Patterns – Interaction** — `04-patterns/03-interaction/`
5. **Patterns – Navigation** — `04-patterns/04-navigation/`
6. **Patterns – Numbers** — `04-patterns/05-numbers/`
7. **Patterns – Utilities** — `04-patterns/06-utilities/`

---

### 9.5 Generation approach

The document can be generated semi-automatically:

1. Grep for files containing `// ─── Component CSS API`
2. For each file, extract the block between the opener comment and the `// ───...───` closer
3. Parse out each `--osui-*` declaration: property name + default value
4. Identify the root selector from the surrounding context (line above the CSS API block)
5. Render as a Markdown table per component

---

### Phase 9 — Full acceptance criteria

- [ ] `docs/css-api-reference.md` exists and is committed
- [ ] Every component with a `// ─── Component CSS API` block appears in the document
- [ ] Every `--osui-*` var declared in any CSS API block is listed in the document
- [ ] No `--osui-*` var appears in the document that is not actually declared in the SCSS
- [ ] Document is organised by the category sections defined in §9.4
- [ ] Each entry shows the property name, default value, and (where applicable) which variant/state it applies to

---

## Phase 10 — Replace `var(--token-*)` with `$token-*` SCSS variables and remove `:root` token block

### 10.1 Background

`outsystems-design-tokens` generates two parallel artefacts:

| File | Contains | Purpose |
|------|----------|---------|
| `src/scss/tokens/_root.scss` | `:root { --token-* }` CSS custom properties | Runtime theming override surface |
| `src/scss/tokens/_variables.scss` | `$token-*: var(--token-*, fallback)` SCSS variables | Compile-time validation + fallback safety |

After Phases 1–9, all component SCSS files reference tokens via `var(--token-*)`. Phase 10 is two steps:

**Step A** — Migrate every `var(--token-*)` reference in component SCSS to the equivalent `$token-*` SCSS variable. Because every `$token-*` variable expands to a `var(--token-*, …hardcoded-fallback…)` chain, the compiled CSS still references the custom property, but now with a built-in fallback all the way to a hex value.

**Step B** — Remove the `@import '../tokens/root'` line from `src/scss/01-foundations/_root.scss`. Once Step A is done, every token reference in the codebase includes a complete fallback chain, so the `:root` block of `--token-*` declarations is no longer needed for default rendering. The custom properties still work as theming hooks: any DTE or runtime theme can write `--token-*` values to `:root` (or any scope) and they override the compiled-in fallbacks.

**Example of what the SCSS variable expands to:**
```scss
// _variables.scss (generated, never edit)
$token-bg-surface-default: var(--token-bg-surface-default, $token-primitives-base-white);
// which itself resolves to:
$token-primitives-base-white: var(--token-primitives-base-white, #ffffff);

// So $token-bg-surface-default compiles to:
// var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff))
// — self-sufficient without any :root declaration
```

### 10.2 Syntax rules (Step A)

Two cases apply depending on where the token value is used:

**Case A — Regular CSS property value** (no interpolation needed):
```scss
// Before
background-color: var(--token-bg-surface-default);
border: var(--token-border-size-025) solid var(--token-border-default);

// After
background-color: $token-bg-surface-default;
border: $token-border-size-025 solid $token-border-default;
```

**Case B — CSS custom property declaration** (interpolation required; SCSS treats custom property values as literal strings):
```scss
// Before
--osui-btn-background: var(--token-bg-surface-default);

// After
--osui-btn-background: #{$token-bg-surface-default};
```

> **Rule of thumb:** If the left-hand side starts with `--`, wrap the right-hand side in `#{}`. Otherwise, use the SCSS variable directly.

### 10.3 Scope

**In scope — convert `var(--token-*)` → `$token-*` (Step A):**

| Directory | Notes |
|-----------|-------|
| `src/scss/02-layout/` | All layout partials |
| `src/scss/03-widgets/` | All widget partials |
| `src/scss/04-patterns/**/*.scss` | Pattern files and provider overrides |

**In scope — modify (Step B):**

| File | Change |
|------|--------|
| `src/scss/01-foundations/_root.scss` | Remove `@import '../tokens/root'` line; convert `--color-focus-inner: var(--token-text-default)` → `--color-focus-inner: #{$token-text-default}` (this is the only bare `var(--token-*)` in that file lacking a fallback) |

**Out of scope — leave unchanged:**

| Path | Reason |
|------|--------|
| `src/scss/tokens/` | Generated files; never manually edited |
| `src/scss/00-abstract/` | Setup vars that may reference tokens contextually; review per-file but default to leave |
| `_*_lib.scss` vendor baselines | Never touch |
| Any `var(--osui-*)` reference | These are component CSS API vars, not token vars — unchanged |

### 10.4 Find/replace strategy (Step A)

Because `var(--token-` appears in both contexts (regular properties and custom property declarations), a two-pass find/replace is needed:

**Pass 1 — Custom property RHS** (needs `#{...}` interpolation):
- Find: `(--[\w-]+)\s*:\s*var\((--token-[\w-]+)\)`
- Replace: `$1: #{$token-<name>}` (strip `--token-` prefix to form the SCSS var name)
- Scope: lines where the LHS starts with `--` (i.e. custom property declarations)

**Pass 2 — Regular property values**:
- Find: `var\((--token-[\w-]+)\)`
- Replace: `$token-<name>` (strip `--token-` prefix)
- Scope: lines that are NOT custom property declarations (LHS does not start with `--`)

**Automated approach:** A short script (Python or sed) can perform both passes across all in-scope files. After running, `npm run build` validates correctness.

### 10.5 Step B — Remove `:root` token import

After Step A passes, apply the following minimal edit to `src/scss/01-foundations/_root.scss`:

```scss
// Remove this line:
@import '../tokens/root';

// And convert this line in the :root block:
--color-focus-inner: var(--token-text-default);
// To:
--color-focus-inner: #{$token-text-default};
```

The rest of `_root.scss`'s `:root {}` block (app layout vars, safe areas, layer system, other focus colors) is unchanged. The `src/scss/tokens/_root.scss` file itself is not deleted — it continues to be generated by `npx build.tokens` but is simply no longer imported. A DTE or future theming pipeline that wants to inject the full custom-property layer can re-add the import or inject the file separately.

### 10.6 Verification

After both steps:

1. `grep -rn "var(--token-" src/scss/01-foundations src/scss/02-layout src/scss/03-widgets src/scss/04-patterns` → must return zero matches
2. `grep "tokens/root" src/scss/01-foundations/_root.scss` → must return zero matches
3. `npm run build` → exits 0 for both O11 and ODC
4. Visual diff of compiled CSS against pre-Phase-10 snapshot → differences limited to: (a) fallback chains added to token references, (b) the `--token-*` `:root` block removed from output

### Phase 10 — Full acceptance criteria

- [ ] Zero `var(--token-*)` references remain in `src/scss/02-layout/`, `src/scss/03-widgets/`, `src/scss/04-patterns/`, and `src/scss/01-foundations/_root.scss`
- [ ] `@import '../tokens/root'` removed from `src/scss/01-foundations/_root.scss`
- [ ] `_variables.scss` and `_utilities.scss` are unchanged; `_root.scss` (generated) still exists but is no longer imported
- [ ] `var(--osui-*)` references are unchanged throughout
- [ ] `npm run build` exits 0 (O11 and ODC)
- [ ] No new SCSS lint errors introduced
- [ ] Compiled CSS: no `--token-*` `:root` block; all token references include full fallback chains

---

## Phase 11 — Dark Theme via token re-mapping

Opt-in dark theme scoped under a single class. Implemented **entirely** as CSS custom property overrides — no component rule, no `$token-*` value, and no pre-existing `--osui-*` default is touched. Exercises the invariant established in Phases 2b–7: every visual property flows through a two-step chain (component CSS API var → `--token-*` semantic var → `--token-primitives-*` fallback), so a complete alternate theme is expressible as variable overrides alone.

### 11.1 Preconditions

- [ ] Phase 7 has landed (every component with state/variant coverage uses `--osui-*` API vars rather than direct `--token-*` references in property declarations).
- [ ] `src/scss/tokens/_variables.scss` is generated and contains the full `$token-primitives-*` palette (neutral-100..1200, base-black, base-white, and the `*-300`/`*-400`/`*-500`/`*-600` shades of blue / red / green / yellow / pumpkin / orange / lime / teal / aqua / indigo / violet / purple / magenta / pink).
- [ ] Entry files `src/scss/O11.OutSystemsUI.scss` and `src/scss/ODC.OutSystemsUI.scss` are generated by `gulp/Tasks/CreateScssFile.js` on every `npm run dev` and `npm run build` (manual edits to these files are overwritten — new partials must be registered in `gulp/ProjectSpecs/ScssStructure/*.js`).

### 11.2 Create the dark-theme partial

**File (new):** `src/scss/01-foundations/_theme-dark.scss`

The file contains a single top-level `.theme-dark {}` block plus one globally scoped selector group (the button hover filter override). Organised into the following sections, in order:

| Section | Purpose | Primary vars |
|---------|---------|--------------|
| Surface hierarchy | Three-tier body/surface/input elevation by colour | `--token-bg-body`, `--token-bg-surface-default`, `--token-bg-surface-inverse`, `--token-bg-input-*`, `--token-bg-neutral-{subtle,subtlest,base,bold,boldest}-*` |
| Text | Primary/subtle/disabled/inverse text + semantic + extended palette | `--token-text-default`, `--token-text-subtle`, `--token-text-subtlest`, `--token-text-disabled`, `--token-text-inverse`, `--token-text-{primary,select,info,success,danger,warning}`, `--token-text-link-*`, `--token-text-extended-*` |
| Icons | Mirror the text scale (icon tokens are decoupled in the token system) | `--token-icon-*` |
| Borders | Hairline borders on dark; focus and input ring overrides | `--token-border-default`, `--token-border-subtle`, `--token-border-subtlest`, `--token-border-boldest`, `--token-border-disabled`, `--token-border-input-*`, `--token-border-focus-*` |
| Primary brand | Nudge one shade brighter for pop on black | `--token-semantics-primary-base`, `--token-bg-primary-base-*`, `--token-border-primary` |
| Semantic subtle backgrounds | rgba tints (not `*-100` pastels) | `--token-bg-{primary,info,success,danger,warning}-subtle-*`, `--token-bg-select-*` |
| Semantic bold backgrounds | Shift one step toward brighter | `--token-bg-{danger,success,info,warning}-base-*` |
| Elevation | Darker/heavier shadows so cards register against the body | `--token-shadow-1..7`, `--token-elevation-1..4` |
| State | Press overlay, backdrop | `--token-state-press`, `--token-backdrop` |
| App-level layout tokens | Body / header / login / focus inner | `--color-background-body`, `--color-background-login`, `--header-color`, `--color-focus-inner` |
| Component-scoped refinements | `--osui-*` overrides where semantic tokens alone can't produce an elegant result | See table below |

**Component-scoped `--osui-*` refinements** (inside `.theme-dark { … }`, one nested selector per component):

| Selector | Vars overridden | Reason |
|----------|----------------|--------|
| `.card` | `--osui-card-border-color`, `--osui-card-shadow` | Visible border + subtle top-highlight shadow feel better than the light-theme heavy shadow on dark |
| `.alert-{info,success,error,warning}` | `--osui-alert-accent-color` | Accent needs the lighter palette shade for contrast on the dark-theme subtle backgrounds |
| `.btn` | `--osui-btn-{primary,success,error}-background`, `--osui-btn-{primary,success,error}-border-color` | Shift primary/success/error one shade brighter to pop on black |
| `.table` | `--osui-table-border-color`, `--osui-table-header-{background,color}`, `--osui-table-cell-background`, `--osui-table-row-{hover,stripe}-background`, `--osui-table-sorted-color` | Row hover / stripe read better as rgba whites than as solid subtle-neutral backgrounds |
| `.form-control` | `--osui-input-focus-border-color` | Focus ring uses the lighter blue shade |
| `.app-menu-content, .aside-navigation` | `background-color` | Pin menu surface to `neutral-1200` |
| `.app-menu-links a` | `color` (default / hover / active) | Menu link default + active state colours |
| `.badge, .tag` | `--osui-badge-on-light-color`, `--osui-tag-on-light-color` | On-light pills still need dark text even in dark theme |
| `span.validation-message` | `color` | Validation message uses the lighter red shade |
| `::placeholder` | `color` | Placeholder legibility on dark inputs |
| `label` | `color` | Label subtle colour |
| `.header` | `border-bottom: 1px solid neutral-1100` | Thin hairline to separate header from body |

**Button hover filter override** — a globally scoped selector group placed *outside* the `.theme-dark {}` block, since the base rule `.desktop .btn:hover { filter: brightness(0.9) }` lives at global scope:

```scss
.desktop .theme-dark .btn:hover,
.desktop.theme-dark .btn:hover,
.theme-dark .desktop .btn:hover {
	filter: brightness(1.15);
}
```

**Size target:** the file is ~280 lines including comments and whitespace.

### 11.3 Register the partial in the gulp SCSS structure

**File (edit):** `gulp/ProjectSpecs/ScssStructure/Resets.js`

The entry files `src/scss/{O11,ODC}.OutSystemsUI.scss` are **auto-generated** by `gulp/Tasks/CreateScssFile.js` on every `npm run dev` / `npm run build`. Partials must be listed in one of the `gulp/ProjectSpecs/ScssStructure/*.js` section specs or they will not appear in the compiled bundle.

Add the dark-theme partial as a second asset under the `Resets` section (semantically it pairs with resets — both are foundational, platform-agnostic, and run before any component rule):

```js
// gulp/ProjectSpecs/ScssStructure/Resets.js
const sectionInfo = {
    "name": "Resets",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "",
            "path": "01-foundations/resets"
        },
        {
            "name": "Dark Theme (opt-in via .theme-dark class)",
            "path": "01-foundations/theme-dark"
        }
    ]
};
```

### 11.4 Scope — what this phase does NOT change

| Path | Reason |
|------|--------|
| `src/scss/02-layout/**` | Component rules are untouched |
| `src/scss/03-widgets/**` | Component rules are untouched |
| `src/scss/04-patterns/**` | Pattern rules are untouched |
| `src/scss/tokens/**` | Generated files, never manually edited |
| `src/scss/tokens/_variables.scss` | No `$token-*` value changes |
| Any `--osui-*` default in a component file | Defaults remain pointing at their original `$token-*` vars |
| `src/scss/O11.OutSystemsUI.scss`, `src/scss/ODC.OutSystemsUI.scss` | Generated; regenerated automatically with the new partial once `Resets.js` is updated |

The only two files that should appear in the Phase 11 diff are `src/scss/01-foundations/_theme-dark.scss` (new) and `gulp/ProjectSpecs/ScssStructure/Resets.js` (4-line addition).

### 11.5 Design principles — why each choice

1. **Colour-based elevation over shadow-based elevation.** On a black body, shadows disappear. Use three distinct warm-neutral shades (`base-black` → `neutral-1200` → `neutral-1100`) so cards, header, and inputs read as distinct layers without relying on shadows.
2. **`*-400` shades for semantic text/icons.** The light-theme semantic text uses `*-900`; on black that drops below AA contrast. `*-400` (e.g. `red-400 #faa1a1`, `green-400 #7fe089`, `blue-400 #b5c0f7`) is the lightest shade that still reads as coloured rather than white-washed.
3. **rgba tints for semantic subtle backgrounds.** Light-theme `*-100` pastels (`#fde1e1`, `#e2f9e4`, etc.) look washed-out when placed on a dark body. Use `rgba(<shade>, 0.12..0.24)` so the colour reads as a tint of the dark surface, not an opaque pastel rectangle.
4. **Redefined `--token-elevation-*`.** Light-theme elevations use 5–15% black alpha; dark-theme versions use 40–55% black alpha with larger blur radii. Plus a 3% white 1px top-inset on cards for the "edge of glass" feel.
5. **Inverted button hover filter.** `brightness(0.9)` darkens the button — fine on white, invisible on black. Use `brightness(1.15)` so hover is visibly brighter than rest.
6. **Primary brand nudged up one shade.** `blue-700 → blue-600` gives CTAs more visual weight on black without becoming neon.

### 11.6 Usage

`.theme-dark` is applied to any ancestor element. The most common placements:

```html
<!-- Whole app in dark mode -->
<body class="theme-dark desktop">
  <!-- … -->
</body>

<!-- A/B both themes on the same page (layout-scoped) -->
<div class="layout theme-dark">
  <!-- dark-theme components -->
</div>
<div class="layout">
  <!-- light-theme components -->
</div>
```

### 11.7 Verification

1. **Build passes for both platform targets:**
   - `npm run dev -- --target ODC` → Browsersync starts, no SCSS errors (only pre-existing Dart Sass deprecation warnings)
   - `npm run dev -- --target O11` → same
2. **Compiled bundles contain the dark-theme rules:**
   - `grep -c "theme-dark" dist/dev.ODC.OutSystemsUI.css` → **40**
   - `grep -c "theme-dark" dist/dev.O11.OutSystemsUI.css` → **40**
3. **Rule structure check:**
   - `grep -o "[^}]*theme-dark[^{]*{" dist/dev.ODC.OutSystemsUI.css | head` → shows `.theme-dark{`, `.theme-dark .card{`, `.theme-dark .alert-info{`, `.theme-dark .alert-success{`, `.theme-dark .alert-error{`, `.theme-dark .alert-warning{`, `.theme-dark .btn{`, `.theme-dark .table{`, …
4. **Light-theme parity (no regressions):** diff `dist/dev.{ODC,O11}.OutSystemsUI.css` against the pre-Phase-11 build, filtered to rules *not* inside `.theme-dark` scope → empty.
5. **Component-file diff check:** `git diff --stat src/scss/02-layout src/scss/03-widgets src/scss/04-patterns src/scripts/OSFramework/OSUI/Pattern src/scripts/Providers/OSUI` → empty. If any component file is listed, Phase 11 has leaked.

### Phase 11 — Full acceptance criteria

- [ ] `src/scss/01-foundations/_theme-dark.scss` exists and compiles without errors
- [ ] `gulp/ProjectSpecs/ScssStructure/Resets.js` registers the new partial as a second asset
- [ ] `npm run dev -- --target ODC` and `npm run dev -- --target O11` both complete without new SCSS errors
- [ ] `dist/dev.{ODC,O11}.OutSystemsUI.css` each contain ≥40 `.theme-dark`-scoped rules
- [ ] Adding `class="theme-dark"` to `<body>` visibly flips cards, alerts, tables, inputs, buttons, header, and menu to dark mode in the dev server
- [ ] Default (no `.theme-dark` class) rendering is byte-for-byte identical to the pre-Phase-11 build when `.theme-dark`-scoped rules are filtered out
- [ ] `git diff --stat` after Phase 11 shows exactly two changed files: `src/scss/01-foundations/_theme-dark.scss` (new) and `gulp/ProjectSpecs/ScssStructure/Resets.js` (modified). No component SCSS file under `02-layout/`, `03-widgets/`, `04-patterns/`, or `src/scripts/` has a diff.
- [ ] No `$token-*` value has changed in `src/scss/tokens/_variables.scss`
- [ ] No pre-existing `--osui-*` default has changed in any component file
- [ ] `npm run lint` passes

---

## Phase 12 — Append `--token-*` fallback to legacy CSS var references in TypeScript

### 12.1 Background

Phases 1–10 migrated the SCSS layer off the hand-rolled OSUI `:root` token block (`--space-*`, `--color-*`, `--border-radius-*`, `--font-size-*`, `--shadow-*`, …) and onto the `--token-*` namespace emitted by `outsystems-design-tokens`. Phase 10 additionally removed the `@import '../tokens/root'` line so the compiled CSS carries full `var(--token-*, fallback)` chains without needing a `:root { --token-* }` block.

**The gap.** Six TypeScript call sites in `src/scripts/` still reference the legacy var names at runtime — either by emitting a `var(--legacy-*)` string to an inline style, or by calling `getComputedStyle().getPropertyValue('--legacy-*')` on `document.documentElement`. On a token-only build those references resolve to the empty string. Inline-style writes set the target CSS custom property to the empty value; the compiled SCSS then has no value to consume.

**Principle.** The fix is strictly additive — the legacy var stays first in every emitted `var()` chain, so any consumer still defining `--border-radius-rounded: 12px` at `:root` renders with 12px. The `--token-*` var is added as a fallback so consumers on the new token system also render correctly.

### 12.2 Audit — complete surface

`rg -n -e '--(space|color|font-size|border-radius|shadow|font-weight|font-family|line-height|letter-spacing|border-size)-' --glob 'src/scripts/**/*.ts'` returns 6 hits across 5 files, in 3 variable families:

| # | File:line | Emitted/read string | Family | Driver |
|---|-----------|---------------------|--------|--------|
| 1 | `src/scripts/OSFramework/OSUI/Feature/Balloon/Balloon.ts:436` | `'var(--border-radius-' + this.featureOptions.shape + ')'` | `--border-radius-{shape}` | `GlobalEnum.ShapeTypes` |
| 2 | `src/scripts/OSFramework/OSUI/Pattern/BottomSheet/BottomSheet.ts:101` | `'var(--border-radius-' + shape + ')'` | `--border-radius-{shape}` | `GlobalEnum.ShapeTypes` |
| 3 | `src/scripts/OSFramework/OSUI/Pattern/OverflowMenu/OverflowMenu.ts:90` | `` `var(--border-radius-${this.configs.Shape})` `` | `--border-radius-{shape}` | `GlobalEnum.ShapeTypes` |
| 4 | `src/scripts/OSFramework/OSUI/Helper/Dom.ts:186` (`GetBorderRadiusValueFromShapeType`) | `getPropertyValue('--border-radius-' + shapeName)` | `--border-radius-{shape}` | `ProgressBar.ts:28,52` |
| 5 | `src/scripts/OSFramework/OSUI/Helper/Dom.ts:197` (`GetColorValueFromColorType`) | `getPropertyValue('--color-' + colorName)` | `--color-{name}` | `ProgressBar.ts:22,34,43,70`, `ProgressCircle.ts:174,188,333,379` |
| 6 | `src/scripts/OSFramework/OSUI/Pattern/Gallery/Gallery.ts:21` | `` `var(--space-${this.configs.ItemsGap})` `` | `--space-{size}` | `GalleryConfig.ItemsGap` |

Providers, public `src/scripts/OutSystems/OSUI/*`, Event/Behaviors, and Utils directories are clean.

### 12.3 Mapping data

Three `Record<string, string>` lookups, ported from `specs/token-mapping.md`. Keys are the **legacy suffix** that follows the family prefix (e.g. the `rounded` in `--border-radius-rounded`). Values are the full `--token-*` custom property name.

**ShapeTokenMap** — keys are `GlobalEnum.ShapeTypes` values:
```typescript
{
  none:    '--token-border-radius-0',     // 0
  soft:    '--token-border-radius-100',   // 4px
  rounded: '--token-border-radius-full',  // 999px (D7 — 100px → 999px accepted)
}
```

**SpaceTokenMap** — keys are the space-scale strings passed to `GalleryConfig.ItemsGap`:
```typescript
{
  none: '--token-scale-0',      // 0
  xs:   '--token-scale-100',    // 4px
  s:    '--token-scale-200',    // 8px
  base: '--token-scale-400',    // 16px
  m:    '--token-scale-600',    // 24px
  l:    '--token-scale-800',    // 32px
  xl:   '--token-scale-1000',   // 40px
  xxl:  '--token-scale-1200',   // 48px
}
```

**ColorTokenMap** — keys are the legacy color suffix from `--color-{name}`. Entries with no semantic equivalent in the token system (tracked in `specs/token-mapping.md` with 🔴 status) are **omitted** so the fallback resolves to empty and behaviour matches today:
```typescript
{
  // Brand — semantic base
  primary:          '--token-semantics-primary-base',
  'primary-hover':  '--token-semantics-primary-800',
  // `primary-selected`, `primary-lightest`, `secondary` — OMITTED (no token equivalent)

  // Neutrals — map by hex, not index (OSUI 0–10 ↔ tokens 100–1200)
  'neutral-0':  '--token-primitives-neutral-100',
  'neutral-1':  '--token-primitives-neutral-200',
  'neutral-2':  '--token-primitives-neutral-300',
  'neutral-3':  '--token-primitives-neutral-400',
  'neutral-4':  '--token-primitives-neutral-500',
  'neutral-5':  '--token-primitives-neutral-600',
  'neutral-6':  '--token-primitives-neutral-700',
  'neutral-7':  '--token-primitives-neutral-800',
  'neutral-8':  '--token-primitives-neutral-900',
  'neutral-9':  '--token-primitives-neutral-1100',
  'neutral-10': '--token-primitives-neutral-1200',

  // Status — D4 rename: error → danger
  error:           '--token-semantics-danger-base',
  'error-light':   '--token-semantics-danger-100',
  warning:         '--token-semantics-warning-base',
  'warning-light': '--token-semantics-warning-100',
  success:         '--token-semantics-success-base',
  'success-light': '--token-semantics-success-100',
  info:            '--token-semantics-info-base',
  'info-light':    '--token-semantics-info-100',

  // focus-outer, focus-inner — OMITTED (no semantic equivalent; focus ring stays as-is)
}
```

The final color map is authored by grepping `src/scripts/**/*.ts` for every literal string passed to `GetColorValueFromColorType` (user-facing values come from the progress-color picker enum) and keeping only entries present in `specs/token-mapping.md` with ✅ or ❓ status.

### 12.4 File-by-file contract

#### 12.4.1 `src/scripts/OSFramework/OSUI/Helper/LegacyTokenMap.ts` *(new)*

- Declared under namespace `OSFramework.OSUI.Helper`.
- Exports three `readonly` `Record<string, string>` constants: `ShapeTokenMap`, `SpaceTokenMap`, `ColorTokenMap`.
- File header JSDoc notes: "Phase 12 — legacy-to-token lookup tables. Additive fallback only; do not remove legacy var references."
- No default export (AMD-compatible); consumers import via the namespace.

#### 12.4.2 `src/scripts/OSFramework/OSUI/Helper/Dom.ts`

Two methods updated; both keep their existing public signature `(name: string): string`.

- **`GetBorderRadiusValueFromShapeType(shapeName: string): string`** (line ~185)
  ```typescript
  public static GetBorderRadiusValueFromShapeType(shapeName: string): string {
    const style = getComputedStyle(document.documentElement);
    const legacy = style.getPropertyValue('--border-radius-' + shapeName);
    if (legacy !== '') return legacy;
    const tokenName = Helper.LegacyTokenMap.ShapeTokenMap[shapeName];
    return tokenName !== undefined ? style.getPropertyValue(tokenName) : '';
  }
  ```

- **`GetColorValueFromColorType(colorName: string): string`** (line ~195)
  - Same Case B pattern: read `--color-{colorName}` first; if empty, look up `ColorTokenMap[colorName]` and read that.
  - The existing downstream check for HEX/RGB on user-provided raw values (the tail end of the method) is preserved unchanged — it still runs on whatever string is returned.

#### 12.4.3 `src/scripts/OSFramework/OSUI/Feature/Balloon/Balloon.ts:436`

```typescript
// Before
Helper.Dom.Styles.SetStyleAttribute(
  this.featureElem,
  Enum.CssCustomProperties.Shape,
  'var(--border-radius-' + this.featureOptions.shape + ')'
);

// After
const shape = this.featureOptions.shape;
const tokenName = Helper.LegacyTokenMap.ShapeTokenMap[shape];
Helper.Dom.Styles.SetStyleAttribute(
  this.featureElem,
  Enum.CssCustomProperties.Shape,
  tokenName !== undefined
    ? `var(--border-radius-${shape}, var(${tokenName}))`
    : `var(--border-radius-${shape})`
);
```

The `tokenName !== undefined` guard preserves today's behaviour for any shape value that isn't in the map (defensive — the `ShapeTypes` enum currently has exactly 3 values so this branch is theoretical).

#### 12.4.4 `src/scripts/OSFramework/OSUI/Pattern/BottomSheet/BottomSheet.ts:101`

Same Case A transform as Balloon, inside `_handleShape(shape)`. The `shape` parameter is already in scope.

#### 12.4.5 `src/scripts/OSFramework/OSUI/Pattern/OverflowMenu/OverflowMenu.ts:90`

Same Case A transform, inside `_setOverflowMenuShape`. Uses `this.configs.Shape` as the key.

#### 12.4.6 `src/scripts/OSFramework/OSUI/Pattern/Gallery/Gallery.ts:21`

```typescript
// Before
private _setItemsGap(): void {
  Helper.Dom.Styles.SetStyleAttribute(
    this.selfElement,
    Enum.CssVariables.PatternItemsGap,
    `var(--space-${this.configs.ItemsGap})`
  );
}

// After
private _setItemsGap(): void {
  const gap = this.configs.ItemsGap;
  const tokenName = Helper.LegacyTokenMap.SpaceTokenMap[gap];
  Helper.Dom.Styles.SetStyleAttribute(
    this.selfElement,
    Enum.CssVariables.PatternItemsGap,
    tokenName !== undefined
      ? `var(--space-${gap}, var(${tokenName}))`
      : `var(--space-${gap})`
  );
}
```

`GalleryConfig.ItemsGap` is typed `string` (end-user-supplied), so the `undefined` branch is load-bearing: if a consumer passes `'4rem'` or a custom key, the legacy-only `var(--space-4rem)` still resolves to empty in the new token world — same as today — and no crash.

### 12.5 Scope — what does NOT change

- Every legacy var reference remains emitted; the only edit wraps it in a `var(…, var(--token-…))` chain or a Case B fallback read. `git grep -E '(--(border-radius|space|color)-[a-z0-9-]+)' src/scripts/` count is non-decreasing.
- No SCSS file is touched.
- Public API signatures of `GetBorderRadiusValueFromShapeType` and `GetColorValueFromColorType` are unchanged.
- Providers (`src/scripts/Providers/OSUI/*`), public APIs (`src/scripts/OutSystems/OSUI/*`), Event/, Behaviors/, Helper/ (beyond `Dom.ts` + new `LegacyTokenMap.ts`), Interface/, and `osui.ts` — untouched.
- No ESLint/Prettier rule tweaks. File-order and namespace-member conventions preserved.

### 12.6 Verification

1. **Build passes:**
   - `npm run build` → O11 and ODC bundles emit without error.
   - `npm run lint` → zero new warnings.
2. **Audit is clean:**
   - `rg -n -e '--(space|color|font-size|border-radius|shadow|font-weight|font-family|line-height|letter-spacing|border-size)-' --glob 'src/scripts/**/*.ts' --glob '!**/LegacyTokenMap.ts'` → every remaining match is inside a `var(…, var(--token-…))` fallback chain or the `getComputedStyle` Case B block. No bare legacy references emitted.
   - `rg -n '--token-' --glob 'src/scripts/**/*.ts' --glob '!**/LegacyTokenMap.ts'` → zero matches. Token names live only in `LegacyTokenMap.ts`; call sites reference them by lookup, not by string literal.
3. **Runtime check — token-only `:root` (post-Phase-10 reality):**
   - Dev server shows Gallery items-gap renders the correct pixel value for each of `xs`/`s`/`base`/`m`/`l`/`xl`/`xxl`.
   - BottomSheet, Balloon, OverflowMenu shape values render rounded / soft / sharp at expected radii.
   - ProgressBar / ProgressCircle render their `ProgressColor` + `TrailColor` using the brand/semantic palette when the config is a named color (e.g. `'primary'`, `'success'`).
4. **Runtime check — legacy `:root` still defining `--space-*`/`--color-*`/`--border-radius-*` via app-level overrides:**
   - All of the above render using the legacy values (not the token fallback) — fallback chain guarantees legacy wins when defined.
5. **File diff check:** `git diff --stat src/scripts/` lists exactly 6 files:
   - `OSFramework/OSUI/Helper/LegacyTokenMap.ts` *(new)*
   - `OSFramework/OSUI/Helper/Dom.ts`
   - `OSFramework/OSUI/Feature/Balloon/Balloon.ts`
   - `OSFramework/OSUI/Pattern/BottomSheet/BottomSheet.ts`
   - `OSFramework/OSUI/Pattern/OverflowMenu/OverflowMenu.ts`
   - `OSFramework/OSUI/Pattern/Gallery/Gallery.ts`
6. **No SCSS diff:** `git diff --stat src/scss/` → empty.

### Phase 12 — Full acceptance criteria

- [ ] `src/scripts/OSFramework/OSUI/Helper/LegacyTokenMap.ts` exists and exports `ShapeTokenMap`, `SpaceTokenMap`, `ColorTokenMap`
- [ ] `GetBorderRadiusValueFromShapeType` and `GetColorValueFromColorType` in `Dom.ts` use the Case B fallback pattern and keep their existing `(name: string): string` signatures
- [ ] Balloon, BottomSheet, OverflowMenu, Gallery all emit `var(--legacy-*, var(--token-*))` fallback chains via `SetStyleAttribute`
- [ ] Zero legacy var reference has been deleted — every pre-Phase-12 legacy var still appears in the diff, just with an appended fallback
- [ ] `npm run build` succeeds for O11 and ODC
- [ ] `npm run lint` passes
- [ ] In a dev build with a token-only `:root`, Gallery gap / BottomSheet / Balloon / OverflowMenu shape / ProgressBar colours render at their expected values
- [ ] In a dev build that still defines legacy `--space-*`/`--color-*`/`--border-radius-*` on `:root`, values match the legacy definitions (legacy wins first in the chain)
- [ ] `git diff --stat` after Phase 12 lists exactly six files under `src/scripts/` and zero under `src/scss/`
