# OutSystemsUI Token Migration — Plan

## Objective

Replace OutSystemsUI's own design token system (SCSS maps → `:root` CSS vars) with the **outsystems-design-tokens** package (`--token-*` namespace), and introduce a **component CSS API** layer. The end state is a library that:
1. Consumes `npx build.tokens` output as its source of truth for all visual values
2. Exposes no hardcoded colors, spacing, typography, or elevation values in SCSS
3. Gives each component its own set of scoped CSS custom properties as a stable public API
4. Enables customer theme customization via the Design Tokens Editor (DTE) in ODC Studio

---

## Scope

### In scope
- All SCSS in `src/scss/` except `08-servicestudio-preview/`, `09-excluders/`, `10-deprecated/`
- All pattern SCSS in `src/scripts/OSFramework/OSUI/Pattern/*/scss/`
- All feature SCSS in `src/scripts/OSFramework/OSUI/Feature/*/scss/`
- All provider override SCSS in `src/scripts/Providers/OSUI/*/scss/` (excluding `_*_lib.scss` vendor files)

### Out of scope (this migration)
- `src/scss/08-servicestudio-preview/` — platform-specific rendering hacks, separate effort
- `src/scss/09-excluders/` — metadata only, no token values
- `src/scss/10-deprecated/` — 21 files; evaluate for deletion rather than migration
- `_*_lib.scss` vendor baseline files — must never be modified
- `_*_ss_preview_imgs.scss` files — Service Studio only, separate effort
- TypeScript pattern logic — no changes to `.ts` files

---

## Approach — Disruptive replacement

This is **not** a backwards-compatible migration. We are replacing the OSUI token system entirely. No bridge layer, no legacy aliases.

**Backwards compatibility:** The current compiled CSS output (`O11.OutSystemsUI.scss` / `ODC.OutSystemsUI.scss` → `dist/`) will be snapshotted and moved to a `deprecated/` folder before any changes, so consumers on the old system have a fallback. Moving forward, consumers adopt the new token-based output.

---

## Phased Approach

### Phase 0 — Snapshot current output

**What:** Run `npm run build` and copy the current `dist/` output to a `deprecated/` folder. This is the last known-good state of the old system.

**Files touched:** `deprecated/` (new folder, committed once)

---

### Phase 1 — Replace token definitions

**What:** Delete the SCSS variable definitions in `00-abstract/_setup-*.scss` and `01-foundations/_root.scss`. Replace with an import of the design-tokens generated output (`_root.scss` and `_variables.scss` from the token package).

**Files touched:**
- `src/scss/00-abstract/_setup-color-vars.scss` → deleted
- `src/scss/00-abstract/_setup-global-vars.scss` → deleted (or reduced to layout-only vars like `--header-size`)
- `src/scss/00-abstract/_setup-global-typography-vars.scss` → deleted
- `src/scss/00-abstract/_setup-border-vars.scss` → deleted
- `src/scss/01-foundations/_root.scss` → replaced with token import
- `src/scss/00-abstract/_functions.scss` → updated or deleted

**Success criteria:**
- `npm run build` completes without errors
- Token vars (`--token-*`) are present in compiled output

---

### Phase 2 — Update all component SCSS to `--token-*`

**What:** Go file by file through all SCSS in both trees and replace every `var(--space-*)`, `var(--color-*)`, `var(--font-*)`, `var(--border-*)`, `var(--shadow-*)` and every `get-background-color()` / `get-text-color()` / `get-border-color()` call with the appropriate `var(--token-*)` reference.

**Priority order:**
1. `src/scss/02-layout/` and `src/scss/03-widgets/`
2. `src/scripts/OSFramework/OSUI/Pattern/*/scss/`
3. `src/scripts/Providers/OSUI/*/scss/` (skip `_*_lib.scss`)
4. `src/scss/04-patterns/` and `src/scss/05-useful/`

**Success criteria:**
- Zero references to old `--space-*`, `--color-*`, `--font-*`, `--border-size-*`, `--shadow-*` vars remain
- Helper functions `get-background-color`, `get-text-color`, `get-border-color` removed from `_functions.scss`
- `npm run lint` passes
- Visual regression test against `deprecated/` output

---

### Phase 2b — Component CSS API

**What:** Add a set of scoped CSS custom properties to each component's root selector. These act as the component's public CSS API — they default to the global token values, but consumers can override them per-instance or globally without knowing the token internals.

**Principle:** Every CSS property with visual significance becomes a two-step chain:
1. Component-scoped var declared at root, defaulting to a token
2. Property declaration consumes the scoped var

```scss
// Before (after Phase 2)
.osui-sidebar {
  background-color: var(--token-bg-surface-default);
  box-shadow: var(--token-elevation-3);
  padding: var(--token-scale-400) var(--token-scale-600);
}

// After (Phase 2b)
.osui-sidebar {
  // Component CSS API
  --sidebar-background: var(--token-bg-surface-default);
  --sidebar-shadow: var(--token-elevation-3);
  --sidebar-padding-y: var(--token-scale-400);
  --sidebar-padding-x: var(--token-scale-600);

  // Properties
  background-color: var(--sidebar-background);
  box-shadow: var(--sidebar-shadow);
  padding: var(--sidebar-padding-y) var(--sidebar-padding-x);
}
```

**CSS properties to expose as scoped vars** (for every component that uses them):

| Property | Scoped var suffix | Notes |
|----------|------------------|-------|
| `background-color` | `-background` | Main surface background |
| `color` | `-color` | Text/foreground color |
| `border-color` | `-border-color` | |
| `border-width` | `-border-width` | |
| `border-radius` | `-border-radius` | |
| `box-shadow` | `-shadow` | Elevation |
| `padding` | `-padding` or `-padding-x` / `-padding-y` | Split when H ≠ V |
| `gap` | `-gap` | For flex/grid components |
| `font-size` | `-font-size` | When component controls its own type size |

**Not exposed** (controlled by external layout, not the component):
- `margin` — parent's responsibility
- `width` / `height` — layout-controlled
- `transition` / `animation` — defer to a future motion-token phase

**Nomenclature:** ⚠️ Open decision D11 — see Decisions table.

**Applies to:**
- All `osui-*` pattern components in `src/scripts/OSFramework/OSUI/Pattern/*/scss/`
- Feature SCSS (`_balloon.scss`)
- Layout patterns in `src/scss/02-layout/` and `src/scss/03-widgets/` where they have named selectors

**Does NOT apply to:**
- Provider overrides (`.vscomp-*`, `.flatpickr-*`) — we don't own these class names
- Utility classes in `src/scss/05-useful/` — they are single-property by design

**Success criteria:**
- Every `osui-*` component root declares scoped vars for all applicable CSS properties
- All property declarations within the component consume the scoped vars
- Scoped vars resolve correctly to token values with no overrides applied
- Nomenclature decision (D11) resolved and applied consistently

---

### Phase 3 — Semantic token adoption

**What:** Where Phase 2 used primitive token vars (`--token-primitives-*`, `--token-scale-*`) as defaults in the component CSS API vars, upgrade to semantic component tokens (`--token-bg-*`, `--token-text-*`, `--token-border-*`, `--token-icon-*`).

**Example:** A sidebar whose CSS API currently has `--sidebar-background: var(--token-primitives-neutral-100)` becomes `--sidebar-background: var(--token-bg-surface-default)`.

**Success criteria:**
- Component scoped vars default to semantic tokens wherever the token system provides them
- Enables full theme customization from the DTE by overriding semantic tokens

> ✅ **Phases 0–3 complete** as of commit `3b66f2e2b` (branch `ROU-12714`).
> ✅ **Phases 4–7 complete** as of commit `b66c59e35` (branch `ROU-12714`).

---

### Phase 4 — Complete partial CSS APIs

**What:** Extend existing `--osui-*` blocks with missing interaction/state vars. Several components already have a CSS API block but their active, focus, checked, or hover states still reference `--token-*` vars directly — bypassing the API. This phase wires those state rules through new CSS API vars.

**Files touched:** 11 pattern and widget SCSS files (see `implementation.md` Phase 4 for the full var-by-var list)

**Success criteria:**
- All state/interaction rules use a `--osui-*` var rather than a direct `--token-*` reference
- No regression in visual output

---

### Phase 5 — New CSS APIs: High-priority components

**What:** Add full CSS API blocks to the 10 most impactful components currently lacking `--osui-*` coverage. Includes two critical fixes: the hardcoded `#4263eb` sent-bubble colour in ChatMessage and the hardcoded `rgba(21, 24, 26, 0.04)` hover in Pagination.

**Components:** Card, Alert, FeedbackMessage, Table, ListItem, Popup, ChatMessage, Wizard, Pagination, FloatingActions

**Success criteria:**
- All 10 components have a complete CSS API block
- Zero hardcoded hex or rgba colour values in these files

---

### Phase 6 — New CSS APIs: Remaining components

**What:** Extend CSS API coverage to all remaining visual components that still use tokens directly in property declarations.

**Components (~17):** BottomBarItem, Breadcrumbs, Timeline, Section, CardItem, ListItemContent, BlankSlate, Tag, UserAvatar, StackedCards, ActionSheet, InputWithIcon, MasterDetail, Badge, Separator, ProviderLoginButton, Rating

**Success criteria:**
- All visual components have CSS API blocks
- DTE can theme the full component set without knowing internal token names

---

### Phase 7 — Harden state/variant coverage in existing APIs

**What:** Button semantic variants (primary/success/danger), checkbox checked state, and input focus/error/placeholder states all currently bypass the CSS API. Wire these through new `--osui-*` vars. Also includes a grep-based hardcoded hex colour audit to catch any remaining stragglers.

**Files touched:** `_btn.scss`, `_checkbox.scss`, `_inputs-and-textareas.scss` + any files flagged by the audit

**Success criteria:**
- Button, checkbox, and input interaction states use CSS API vars
- Grep audit for hardcoded hex values returns zero unresolved matches

> ✅ **Phase 7 complete** as of commit `b66c59e35` (branch `ROU-12714`).

---

### Phase 8 — Consolidate SCSS into one tree

**What:** Move all pattern SCSS (currently co-located with TypeScript in `src/scripts/OSFramework/OSUI/`) and all provider SCSS (`src/scripts/Providers/OSUI/`) into `src/scss/04-patterns/`. Each pattern gets its own named folder inside the appropriate category directory; patterns that include a provider get a `provider/` subfolder inside their folder.

**Why:** A single SCSS tree eliminates the cognitive overhead of two trees, makes import paths self-evident, simplifies documentation generation (Phase 9), and aligns with where all new pattern SCSS will naturally be created going forward.

**Files touched:**
- 36 pattern SCSS files (move + `@import` path updates inside files that reference provider SCSS)
- ~10 provider SCSS files (move)
- `src/scss/O11.OutSystemsUI.scss` — update ~30 `@import '../scripts/...'` lines
- `src/scss/ODC.OutSystemsUI.scss` — update ~30 `@import '../scripts/...'` lines
- `gulp/ProjectSpecs/Patterns/*.js` — update `scss` key in all 33 spec files

**Key decision (resolve before implementation):** Where does the shared `_flatpickr_lib.scss` vendor baseline live? DatePicker, TimePicker, and MonthPicker all depend on it. Options: (A) under `date-picker/provider/`, imported by the other two via relative path; (B) a top-level `src/scss/providers/flatpickr/` shared location.

**Success criteria:**
- Zero SCSS files remain under `src/scripts/`
- `npm run build` exits 0 (O11 and ODC)
- Visual output diff against pre-Phase-8 build is empty

See `implementation.md` Phase 8 for the full target folder tree and change-surface table.

---

### Phase 9 — CSS API reference document

**What:** Generate `docs/css-api-reference.md` — a comprehensive listing of every `--osui-*` CSS custom property exposed by the library. One table per component, showing the property name, default token value, and any variant/state context. Organised by the same category structure as `04-patterns/`.

**Why:** Serves two purposes — (1) the canonical reference for DTE engineers integrating the component CSS API, and (2) public documentation for consumers who want to theme individual components without knowing internal token names.

**Method:** Semi-automatic. Grep for `// ─── Component CSS API` blocks across all SCSS files; parse out `--osui-*` declarations; identify root selector from context; render as Markdown tables.

**Files touched:**
- `docs/css-api-reference.md` (new file, committed)

**Success criteria:**
- Every component with a CSS API block appears in the document
- Every `--osui-*` var is listed with its default value
- Document is complete, accurate, and committed

See `implementation.md` Phase 9 for format spec and generation approach.

---

### Phase 10 — Replace `var(--token-*)` with `$token-*` SCSS variables and remove `:root` token block

**What:** Two related changes that complete the token migration:

**Step A — Replace `var(--token-*)` with `$token-*` SCSS variables.** Every `var(--token-*)` reference in component SCSS is replaced with the corresponding `$token-*` SCSS variable from `_variables.scss`. Two syntaxes are required depending on context:

- **Regular CSS properties** — no interpolation needed:
  ```scss
  // Before
  background: var(--token-bg-surface-default);
  // After
  background: $token-bg-surface-default;
  ```

- **CSS custom property declarations** — interpolation required (SCSS treats custom property values as literal strings):
  ```scss
  // Before
  --osui-btn-background: var(--token-bg-surface-default);
  // After
  --osui-btn-background: #{$token-bg-surface-default};
  ```

**Step B — Remove the `@import '../tokens/root'` from `src/scss/01-foundations/_root.scss`.** The generated `_root.scss` file declares every `--token-*` custom property in `:root`. Once Step A is complete, every token reference in the codebase already includes a full fallback chain (e.g. `var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff))`), so the `:root` declarations are no longer required for default rendering. Removing the import shrinks the CSS bundle and makes it explicit that the design-token runtime layer is optional. The `--token-*` custom properties still work as theming hooks — any DTE or runtime theme can write them to `:root` and they will override the compiled-in fallbacks.

> **Note:** `src/scss/01-foundations/_root.scss` contains its own `:root {}` block (app layout vars, safe areas, layer system, focus colors) which is unaffected and stays. Only the `@import '../tokens/root'` line at the top is removed.
>
> One token reference in that block lacks a fallback — `--color-focus-inner: var(--token-text-default)` — and must be converted to `--color-focus-inner: #{$token-text-default}` before the import is removed.

**Why:** The SCSS variables in `_variables.scss` are strictly better than bare `var(--token-*)` references:

1. **Compile-time validation** — a typo in `$token-bg-surfaace-default` causes a build failure; a typo in `var(--token-bg-surfaace-default)` is silent and produces no value at runtime.
2. **Hardcoded fallback values** — every `$token-*` variable expands to a `var(--token-*, fallback)` chain (e.g. `var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff))`), so components degrade gracefully even without the `:root` token block.
3. **IDE autocomplete** — `$token-` variables are recognised by SCSS-aware editors; CSS var strings are not.
4. **Smaller CSS bundle** — the generated `_root.scss` declares 200+ custom properties in `:root`; removing it reduces output size without any visual change.
5. **DTE theming still works** — the CSS var reference is preserved in the compiled output as the first argument of each `var()`; a theme that sets `--token-*` properties will still override the fallbacks.

**Scope — what changes:**
- All `var(--token-*)` usages in `src/scss/02-layout/`, `src/scss/03-widgets/`, `src/scss/04-patterns/**`
- Provider override files inside `04-patterns/*/provider/` (excluding `_*_lib.scss` vendor baselines)
- `src/scss/01-foundations/_root.scss` — remove `@import '../tokens/root'` line; convert `--color-focus-inner` to use `#{$token-text-default}`

**Scope — what does NOT change:**
- `src/scss/tokens/` — generated files, never edited manually
- `src/scss/00-abstract/` — setup variables that mix token references with app-level vars; reviewed individually
- `var(--osui-*)` references — component CSS API vars, not token vars; leave untouched
- `_*_lib.scss` vendor baselines — never modified

**Files touched:** All SCSS in `src/scss/02-layout/`, `src/scss/03-widgets/`, `src/scss/04-patterns/` (~80 files) plus the two-line change to `src/scss/01-foundations/_root.scss`.

**Success criteria:**
- Zero `var(--token-*)` references remain in `02-layout/`, `03-widgets/`, `04-patterns/`, and `01-foundations/_root.scss` after Phase 10
- `@import '../tokens/root'` is removed from `src/scss/01-foundations/_root.scss`
- `npm run build` exits 0 for both platforms
- Visual diff against pre-Phase-10 build is empty (compiled CSS output is identical in effect; the only difference is the fallback chain now appears in the output and the `:root` token block is gone)

See `implementation.md` Phase 10 for file-by-file change surface and find/replace strategy.

---

### Phase 11 — Dark Theme via token re-mapping

**What:** Ship an opt-in dark theme for the whole component library by re-mapping CSS custom properties under a single scope class, with **no changes to any component rule, any `$token-*` value, or any `--osui-*` default**. Consumers flip a root class (typically on `<body>`) and every patched component — cards, alerts, tables, inputs, buttons, headers, menu — renders in dark mode.

**Why this phase validates the architecture.** Phases 2b–7 established the invariant that every visual property flows through a two-step chain: component CSS API var → `--token-*` semantic var → `--token-primitives-*` fallback. Phase 11 is the payoff — a complete alternate theme implemented entirely as CSS variable overrides, with zero component-rule edits. If this phase needed to touch a component's property declaration, that would indicate a leak in the CSS API.

**Approach:** A single new partial — `src/scss/01-foundations/_theme-dark.scss` — scopes overrides under `.theme-dark`:

1. **Re-map `--token-*` semantic vars to dark-palette primitives.** This is the high-leverage layer — every component that consumes `$token-bg-surface-default`, `$token-text-default`, `$token-border-default`, etc. automatically flips.
2. **Use `rgba()` tints for semantic-subtle backgrounds.** The light-theme pastel `*-100` shades produce washed-out pastel rectangles on a dark body; low-alpha rgba over the dark surface produces a "glassy info box" effect instead.
3. **Re-define `--token-elevation-1..4`.** Light-theme shadows vanish on black; dark-theme elevations use 40–55% black alpha with larger blur radii.
4. **Component-scoped `--osui-*` refinements for the handful of cases where semantic tokens alone can't produce an elegant result** — card border-color + shadow, alert accent per variant, table header/stripe/hover backgrounds, badge/tag on-light text (so white pills keep dark text), input focus color, menu-link active color, `::placeholder` / `label` colors.
5. **Invert the button hover filter.** The global `.desktop .btn:hover { filter: brightness(0.9) }` rule darkens the button; dark theme needs `brightness(1.15)`. Handled with three selector variants that cover whichever element carries `.desktop` / `.theme-dark`.

**Surface hierarchy (elevation by colour, not by shadow):**
- `--token-bg-body` → `$token-primitives-base-black` (`#111111`)
- `--token-bg-surface-default` (cards, header) → `$token-primitives-neutral-1200` (`#242424`)
- `--token-bg-input-default` → `$token-primitives-neutral-1100` (`#292929`)
- Inputs press / read-only → `$token-primitives-neutral-1000`

**Semantic text/icons** pull from the *light* end of each palette (`*-400`) so AA contrast holds against the dark surface without the tint-washing that `*-100` would produce.

**Files touched:**
- `src/scss/01-foundations/_theme-dark.scss` (new) — all dark-theme overrides, ~280 lines
- `gulp/ProjectSpecs/ScssStructure/Resets.js` — register the new partial as the second asset under the Resets section so the generated `O11.OutSystemsUI.scss` / `ODC.OutSystemsUI.scss` pick it up on every dev/prod build
- No component SCSS is touched
- No `$token-*` value is touched
- No pre-existing `--osui-*` default is touched

**Key constraint:** the entry files `src/scss/{O11,ODC}.OutSystemsUI.scss` are **auto-generated** on every dev/prod build by `gulp/Tasks/CreateScssFile.js`. New partials must be registered in the `gulp/ProjectSpecs/ScssStructure/*.js` spec files or they will be missing from the compiled bundle. Manual edits to the generated entry files are overwritten.

**Usage:**
```html
<body class="theme-dark desktop">
  <!-- everything below renders in dark mode -->
</body>
```
`.theme-dark` can also be applied to any ancestor of the patterns you want themed (e.g. a specific `.layout` wrapper) to A/B both themes side-by-side.

**Scope — what does NOT change:**
- All component SCSS files under `02-layout/`, `03-widgets/`, `04-patterns/` remain untouched
- `src/scss/tokens/` generated files remain untouched
- `$token-*` SCSS variables in `_variables.scss` remain untouched
- All `--osui-*` defaults in their respective components remain untouched
- Light theme remains the default — dark theme is strictly additive and opt-in

**Success criteria:**
- `npm run dev -- --target ODC` and `npm run dev -- --target O11` both compile with zero new errors (only pre-existing Dart Sass deprecation warnings)
- Compiled `dist/dev.{ODC,O11}.OutSystemsUI.css` each contain ~40 `.theme-dark`-scoped rules
- Adding `class="theme-dark"` to `<body>` in the built dev server flips every patched component to dark mode
- Light theme (default, no class) is visually identical to pre-Phase-11 output
- No component SCSS file has a git diff after Phase 11 is merged

---

## Decisions

| # | Decision | Resolution |
|---|----------|-----------|
| D1 | Where does the design-tokens build output live? | Install `outsystems-design-tokens` as `devDependency`. Output goes to `src/scss/tokens/` (gitignored). |
| D2 | Run `build.tokens` as part of build? | Yes — as `prebuild` and `predev` npm scripts. |
| D3 | Which `--prefix`? | Keep default `token` → `--token-*`. `osui` would collide with existing `--osui-*` pattern-scoped vars. |
| D4 | `error` → `danger` rename | Accepted. Find-replace across all component SCSS. |
| D5 | Neutral scale mismatch (OSUI 0–10 vs tokens 100–1200) | Map by hex value, not index. One-time comparison to find closest token shade per OSUI neutral. |
| D6 | `grape` → `purple` rename | Accepted. `grape` usages map to `purple`. `pumpkin` and `magenta` are new — exposed as new extended color vars. |
| D7 | `border-radius-rounded` 100px → 999px | Accepted. Visually equivalent for typical use cases; 999px is more robust. |
| D8 | Semantic token assignment (Phase 3) | Deferred to Phase 3, resolved per component. |
| D9 | App settings vars (`--color-background-body`, `--header-color`, etc.) | Kept as overrideable vars in `:root`, but sourced from tokens as defaults (e.g. `var(--token-bg-body)`). |
| D10 | Remove helper functions? | Hard-remove `get-background-color`, `get-text-color`, `get-border-color` in Phase 2. |
| D11 | Component CSS API — scoped var nomenclature | ✅ Option B: `--osui-{component}-{property}` (e.g. `--osui-sidebar-background`) |

---

## Token Source Integration

`outsystems-design-tokens` added as `devDependency`. Build pipeline runs `build.tokens` before compiling SCSS:

```json
"scripts": {
  "prebuild": "npx build.tokens --dest src/scss/tokens/ --prefix token",
  "predev":   "npx build.tokens --dest src/scss/tokens/ --prefix token"
}
```

Generated output lands in `src/scss/tokens/` (gitignored). Three files produced:
- `_root.scss` — `:root {}` CSS custom properties, imported in `01-foundations/_root.scss`
- `_variables.scss` — SCSS variables with `var()` fallbacks, imported in `00-abstract/`
- `_utilities.scss` — utility classes, imported in the main entry files

---

## D11 — Component CSS API Nomenclature Options

The scoped vars need a consistent naming pattern. The format must:
- Not collide with global token vars (`--token-*`)
- Not collide with existing pattern-scoped vars (`--osui-bottom-sheet-layer` etc.)
- Be predictable enough that consumers can guess the var name from the component name
- Be clear that it's a component-level override point, not a global token

### Option A — Component name only, no prefix
```css
--sidebar-background: var(--token-bg-surface-default);
--accordion-item-border-color: var(--token-border-default);
--dropdown-padding-x: var(--token-scale-400);
```
- ✅ Short and readable
- ❌ Risk of collision with external CSS (no namespace)

### Option B — `osui-` prefix + component name
```css
--osui-sidebar-background: var(--token-bg-surface-default);
--osui-accordion-item-border-color: var(--token-border-default);
--osui-dropdown-padding-x: var(--token-scale-400);
```
- ✅ Namespaced — no collision risk
- ✅ Consistent with existing `--osui-*` pattern vars (`--osui-sidebar-layer`)
- ❌ Verbose

### Option C — `osui-` prefix + component name + double-dash before property (BEM-like)
```css
--osui-sidebar--background: var(--token-bg-surface-default);
--osui-accordion-item--border-color: var(--token-border-default);
--osui-dropdown--padding-x: var(--token-scale-400);
```
- ✅ Visually separates component identity from property
- ❌ Unusual in CSS custom property convention; double-dash rarely used this way

### Option D — `osui-` prefix, shared across all components (no component name)
```css
--osui-background: var(--token-bg-surface-default);
--osui-color: var(--token-text-default);
--osui-border-color: var(--token-border-default);
--osui-padding-x: var(--token-scale-400);
```
- ✅ Maximally predictable — same names across every component
- ✅ Protected namespace — no third-party collision
- ✅ Cascade-safe for nesting — each component re-declares at its root, creating a scope boundary
- ✅ Visually distinguishable from structural vars: `--osui-{property}` = CSS API; `--osui-{component}-{thing}` = structural/behavioral
- ❌ Semantic ambiguity when one component has multiple logical "backgrounds" (e.g. dropdown toggle vs. list)
- ❌ `:root { --osui-background: blue }` won't cascade into components (component declarations win over inherited values) — global overrides must target the component class directly
- ❌ Less debuggable — DevTools shows `--osui-background` without identifying which component set it

---

## Constraints

1. `npm run build` must produce valid O11 and ODC bundles (visual output will change intentionally)
2. All lint rules must pass (`npm run lint`)
3. `-servicestudio-*` properties must be preserved exactly
4. Safe area patterns (`--os-safe-area-*`) must be preserved
5. RTL (`.is-rtl`) context selectors must be preserved
6. `_*_lib.scss` vendor baseline files must never be modified
