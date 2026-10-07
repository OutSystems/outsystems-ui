---
name: osui-theme-migration
description: Migrate custom CSS from the classic OutSystems UI theme to the new token-based theme. Use this skill when a customer, app developer, or QE asks to "migrate CSS to the new theme", "fix my CSS for the new OSUI", "update my styles for the new OutSystems UI", "what changed in the new theme", "my app looks broken after the OSUI update", "adapt custom CSS", "theme migration", "new theme impact", "CSS broke after update", or any time someone's custom CSS needs updating because it targeted the old (pre-token-migration) OSUI vocabulary. Covers the five breakage categories, the retired → replacement mapping, detection patterns, and fix guidance.
---

# Migrating custom CSS to the new OutSystems UI theme

This skill helps analyse and fix custom CSS written against the **classic** (pre-token-migration) OutSystems UI theme so it works with the **new** token-based theme.

The new theme ships design tokens (`--token-*`), a framework theme layer (`--color-*`, `--border-radius-*`, `--space-*`, …), and a per-component CSS API (`--osui-*`). Most of the old public vocabulary survived, but several variable families were retired, components gained an override surface, and the box model moved to logical properties. Custom CSS that relied on retired variables or overrode component internals directly will break.

---

## 1. Triage — what to search for

Before diving in, search the customer's CSS for these patterns to identify which sections apply:

| If the CSS contains… | Verdict | Category |
|---|---|---|
| `var(--space-*)`, `var(--font-size-*)`, `var(--shadow-*)`, `var(--border-size-*)` | Retired — resolves to nothing | A (Section 2) |
| `var(--background-color-*)`, `var(--text-color-*)`, `var(--border-color-*)` | Retired — resolves to nothing | A (Section 2) |
| `--color-red`, `--color-indigo-light`, any extended-palette shade | Retired + hex changed | A (Section 2, extended palette) |
| `--color-primary`, `--color-error`, `--color-background-body` | Still works but resolves to a different colour | F (Section 8) |
| `--color-neutral-0` … `-10` | Still works but scale re-based — `neutral-0` is no longer white | F (Section 8, neutral trap) |
| A rule against `.osui-*`, or a legacy widget class (`.dropdown-container`, `.wizard-item-icon`, `[data-popup]`, `.form-control`), with `!important` or direct property overrides | Probably replaceable with an `--osui-*` variable on the current selector | B (Section 2) |
| Dark mode inverts `--color-neutral-*` while `--color-primary` points at a neutral step | Primary button label stays white (`--color-text-light` is not remapped) | C (Section 2, button contrast) |
| `font-size` without `line-height` | May look wrong due to line-height model change | D (Section 1) |
| `padding-left`, `margin-right` etc. on OSUI classes | May silently lose cascade race against logical properties | E (Section 1) |
| `.shadow-m`, `.margin-base`, `.font-size-h1` (utility classes) | Still shipped but no longer driven by old variables | G (Section 9) |
| Dark block overrides 3+ `--color-neutral-*` steps (ramp flip) | Role variables (`--color-text`, `--color-background-header`, …) no longer cascade from neutrals — text, buttons, and surfaces go invisible | H (Section 2, neutral ramp flip) |
| Custom dark class (`.dark-mode`) without `.os-dark-theme` | ~447 `--token-*` overrides don't fire — feedback messages, inputs, surfaces stay light | Section 6, Step 2d |
| Blank-slate icons turned grey | `--osui-blank-slate-icon-color` changed from primary-adjacent to `--color-text-disabled` | Section 10 recipe |

---

## 2. The breakage categories

Every migration issue falls into one of these. Scan for all of them.

### Category A — Retired CSS variables

The largest source of breakage. These variable families **no longer exist** at `:root`:

| Retired family | Example | What to use instead |
|---|---|---|
| `--background-color-*` | `--background-color-primary` | The matching `--color-*` role (Section 3 mapping) |
| `--text-color-*` | `--text-color-neutral-0` | The matching `--color-text-*` role (Section 3 mapping) |
| `--border-color-*` | `--border-color-primary` | The matching `--color-*` or `--color-border-*` role |
| `--shadow-*` | `--shadow-s`, `--shadow-l` | `--token-elevation-*` (Section 3 mapping) |
| `--font-size-*` | `--font-size-h1`, `--font-size-base` | `--token-font-size-*` (Section 3 mapping) |
| `--border-size-*` | `--border-size-s` | `--token-border-size-*` (Section 3 mapping) |
| `--color-{family}-{shade}` | `--color-red-dark`, `--color-indigo-light` | `--token-primitives-{family}-*` (Section 3 extended palette) |
| `--color-{status}-light` | `--color-error-light` | `--token-semantics-{role}-100` (Section 3 semantic shades) |
| `--border-radius-circle` | `border-radius: var(--border-radius-circle)` | Use `border-radius: 50%` or `--border-radius-rounded` |

A `var(--background-color-primary, var(--color-primary))` still works because of the inner fallback — but `var(--background-color-primary)` without a fallback resolves to nothing and the declaration is silently dropped.

**Detection pattern:**

```
var\(\s*--(background-color|text-color|border-color|shadow|font-size|border-size)-
```

### Category B — Component CSS API (`--osui-*`)

Patterns now declare their visual properties as `--osui-{component}-{property}` custom properties at the root selector and read them internally. An app rule that sets `background-color` directly on `.osui-sidebar` fights the framework on specificity. Setting the `--osui-sidebar-background` variable always wins and survives updates.

```css
/* OLD — fragile, breaks on update */
.osui-sidebar {
  background-color: var(--color-neutral-0);
  box-shadow: var(--shadow-l);
}

/* NEW — stable override via the CSS API */
.osui-sidebar {
  --osui-sidebar-background: var(--color-neutral-0);
  --osui-sidebar-shadow: var(--token-elevation-3);
}
```

Each pattern's knobs are listed in the Storybook **CSS API Reference** page.

**Detection pattern:** CSS rules that set visual properties (`background`, `color`, `border`, `box-shadow`, `padding`, `margin`, `font-size`, `border-radius`, `gap`, `opacity`) directly on a component, rather than via `--osui-*` variables. Search both current `.osui-*` selectors and the legacy selectors below. A rule on `.wizard-item-icon` is the same finding as a rule on `.osui-wizard-item-icon`.

**Legacy selector → current knob.** Confirm the knob is actually read in `src/scss/` before swapping. The old class often no longer matches.

| Legacy selector | Set the variable on | Knobs |
|---|---|---|
| `.dropdown-container`, `.dropdown-display`, `[data-dropdown] .dropdown-list` | `.dropdown-container` | `--osui-dropdown-background`, `--osui-dropdown-border-color`, `--osui-dropdown-border-width`, `--osui-dropdown-border-radius`, `--osui-dropdown-list-background`, `--osui-dropdown-color`, `--osui-dropdown-hover-border-color` |
| `.form-control[data-input]`, `.form-control[data-textarea]` | `.form-control` | `--osui-input-background`, `--osui-input-border-color`, `--osui-input-hover-border-color`, `--osui-input-border-radius`, `--osui-input-color` |
| `.progress-wizard .wizard-item-icon`, `.wizard-item-icon-wrapper` | `.osui-wizard-item` | `--osui-wizard-icon-background`, `--osui-wizard-icon-border-color`, `--osui-wizard-connector-color`, `--osui-wizard-past-background`, `--osui-wizard-active-color` |
| `[data-popup]` background | `.popup-dialog` | `--osui-popup-background` |

**When the lookup does not give a clean swap:**

- The variable is declared but never read (example: `--osui-accordion-item-border-radius`). Keep the property. `--osui-accordion-border-radius` only rounds the first and last item of the group, so a per-item `border-radius` can still need `!important` against those longhands.
- The framework sets `display: none` on the pseudo and there is no knob (range-slider handle `:before` / `:after`). Drop the restyle. It cannot show.
- There is no knob (tick `height`, `.form-info-field`). Keep the direct rule and say so.

### Category C — Theme-layer role changes

The new theme introduces semantic text/surface/border roles at `:root`:

| Old approach | New role |
|---|---|
| `--color-neutral-9` for body text | `--color-text` |
| `--color-neutral-0` for light text on primary bg | `--color-text-light` |
| `--color-neutral-0` for surface backgrounds | `--color-background-surface` |

Additionally, overriding `--color-primary` alone is no longer sufficient for buttons. The new theme reads `--color-primary-hover` and `--color-primary-active` for interactive states. If only `--color-primary` is overridden, hover/active states fall back to the default theme colour.

**Detection pattern:** overrides of `--color-primary` without companion `--color-primary-hover` / `--color-primary-active`.

**Button contrast in an inverted dark palette.** Primary button text is `--osui-btn-primary-color: var(--color-text-light)`. `--color-text-light` resolves to white and `.os-dark-theme` does not remap it. If the customer's dark block turns `--color-primary` light — including when primary is `var(--color-neutral-10)` and that step flips to white — the label disappears on the white button.

**Critical: set `--osui-btn-primary-color` on `.btn-primary`, NOT on `:root`.** The framework's `.btn` selector declares `--osui-btn-primary-color: var(--color-text-light)` directly on the element. A `:root`-level override is inherited but loses to the element-level declaration. The fix must target `.btn-primary` (or `.btn`) directly:

```css
/* WRONG — inherited value loses to .btn's own declaration */
:root.dark-mode {
    --osui-btn-primary-color: var(--color-neutral-0);
}

/* RIGHT — sets the variable on the element itself */
.dark-mode .btn-primary,
.os-dark-theme .btn-primary {
    --osui-btn-primary-color: var(--color-neutral-0);
}
```

Use `--color-text-dark` instead when their inverted `--color-neutral-0` is not the dark text.

**Default button text must NOT be forced dark.** Do not set `--osui-btn-color: var(--color-text-dark)` on all `.btn` in dark mode. The default `.btn` has a dark surface background (`--color-background-surface`) and needs light text. Only target buttons with explicitly light/white backgrounds:

```css
.dark-mode .btn.background-white,
.os-dark-theme .btn.background-white,
.dark-mode .btn.btn-transparent-with-border,
.os-dark-theme .btn.btn-transparent-with-border {
    --osui-btn-color: var(--color-text-dark);
}
```

Do NOT use a blanket `.dark-mode .btn { --osui-btn-color: var(--color-text-dark); }` — it makes default and secondary button labels invisible on their dark backgrounds.

### Category D — Line-height model

`body` line-height changed from unitless `1.5` (relative to each element's font-size) to `1.5rem` (absolute 24 px). Every element that sets its own `font-size` but not its own `line-height` now inherits a fixed 24 px. Small text looks tall; large text overlaps.

**Detection pattern:** any custom rule that sets `font-size` without a corresponding `line-height`. Recommend pairing with the matching `--token-font-line-height-*` token or a unitless number.

**`border-radius: 100%` trap.** Adding `line-height` changes the element's height, which changes its aspect ratio. A `border-radius: 100%` on a non-square element produces an **ellipse**, not a circle. After pairing `line-height`, scan the same rule for `border-radius: 100%` and replace with `border-radius: 100px` (pill shape) or `border-radius: 50%` (circle only if the element is square). This commonly affects badge/pill/tag elements like chart labels.

### Category E — Logical properties

Framework rules now use `padding-block` / `padding-inline` / `margin-inline-start` / `inset-inline-start` etc. A custom override using `padding-left` on the same element has **no specificity relationship** with `padding-inline-start` — whichever comes later wins — so a partial physical override can silently do nothing.

**Detection pattern:** custom rules targeting OSUI classes that use physical properties (`padding-left`, `padding-right`, `margin-left`, `margin-right`, `left`, `right`, `border-left`, `border-right`) where the framework now uses the logical equivalent.

### Category H — Neutral ramp flip (roles no longer cascade)

The highest-impact dark-mode breakage. In the **old theme**, role variables were defined directly in terms of neutral steps:

```css
/* Old theme internals — roles read neutrals directly */
--color-text: var(--color-neutral-9);
--color-background-header: var(--color-neutral-0);
--color-background-surface: var(--color-neutral-0);
--color-border: var(--color-neutral-3);
```

Customers who built dark mode by flipping the entire neutral ramp (swapping `--color-neutral-0` ↔ `--color-neutral-10`, `--color-neutral-1` ↔ `--color-neutral-9`, etc.) got dark text, surfaces, and borders "for free" because every role cascaded through the ramp.

In the **new theme**, roles resolve through `$token-*` variables that do **not** reference `--color-neutral-*`. Flipping the neutral ramp still changes elements that read neutrals directly (custom backgrounds, custom borders), but the framework's own text, surfaces, headers, and borders are unaffected — they keep their light-mode token values on a now-dark background, producing:

- **Invisible / faded body text** — `--color-text` still resolves to dark text
- **Invisible button labels** — `--osui-btn-color` still reads the light-mode token
- **Invisible outline / secondary button text** — transparent-background buttons get white text on white fill
- **Blue links instead of themed links** — link color is hardcoded to `$token-semantics-primary-base` (not `--color-primary`), so the customer's `--color-primary` override has no effect on links
- **Link hover invisible** — `a:hover` uses `--token-semantics-primary-900` which stays at its light value; when links are overridden to match body text, hover must be overridden too (e.g. to `--color-text-subtle`)
- **Missing header background** — `--color-background-header` still resolves to the light default
- **Missing surface contrast** — `--color-background-surface` unchanged
- **Invisible borders** — `--color-border` still resolves to its light value
- **White feedback messages** — `--token-bg-info-subtle-default` and other feedback tokens stay at light values (see Section 6 — fix by adding `.os-dark-theme` or overriding the tokens manually)
- **White active nav pill** — `.app-menu-links > a.active` gets `--token-bg-primary-subtle-default` (light blue) which stays light; text inside uses `--token-semantics-primary-base` which was overridden to white — white on light = invisible
- **Grey blank-slate icons** — `--osui-blank-slate-icon-color` defaults to `--color-text-disabled` (grey) in the new theme; was closer to primary in the old theme

**Detection pattern:** a dark-mode block (`:root.dark-mode`, `:root.os-dark-theme`, `body.dark`, etc.) that overrides **3 or more** `--color-neutral-*` steps. This is the signature of a ramp-flip strategy.

```
:root\.(dark-mode|os-dark-theme)[^{]*\{[^}]*--color-neutral-[0-9]+:.*--color-neutral-[0-9]+:.*--color-neutral-[0-9]+:
```

**The fix:** add explicit role overrides in the dark block, mapping each role to the customer's intended neutral step. The mapping depends on which neutral step now serves each purpose after the flip:

```css
:root.dark-mode,
:root.os-dark-theme {
    /* ... existing neutral ramp overrides ... */

    /* ─── Role overrides (required after ramp flip) ─── */
    --color-text:                var(--color-neutral-10);  /* was neutral-9 in old theme */
    --color-text-subtle:         var(--color-neutral-8);
    --color-text-subtlest:       var(--color-neutral-7);
    --color-background-header:   #141C4E;  /* or var(--header-color) if customer has a custom var */
    --color-background-surface:  var(--color-neutral-1);
    --color-border:              var(--color-neutral-3);
    --color-border-subtle:       var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10);  /* links + primary color follow the flipped ramp */
    --token-semantics-primary-900:  var(--color-neutral-9);   /* link/primary hover state */
}
```

The exact neutral step for each role depends on the customer's palette. Use the highest-contrast readable step for text (usually the one that flipped to near-white) and the closest-to-background step for surfaces/borders.

**`--token-semantics-primary-base` is a shared root.** Overriding it changes both link color AND `--color-primary` (buttons, focus rings, etc.) because they all resolve through the same token. This is usually what ramp-flip customers want — their `--color-primary` already points at a neutral step that flipped. But if a customer needs links and primary to diverge in dark mode, skip the token override and add a direct rule instead:

```css
.dark-mode a,
.os-dark-theme a {
    color: var(--color-neutral-10);
}
```

**Custom surface variables need wiring too.** If the customer declares custom variables like `--header-color` or `--sidebar-bg` that the old framework read by convention, these must now be wired to the framework's role variables explicitly. The new framework reads `--color-background-header`, not `--header-color`:

```css
:root {
    --color-background-header: var(--header-color);
}
```

---

## 3. Retired-variable replacement mapping

### Semantic color helpers → role variables

| Classic (retired) | New replacement | Notes |
|---|---|---|
| `--background-color-primary` | `--color-primary` | |
| `--background-color-secondary` | `--color-secondary` | |
| `--background-color-error` | `--color-error` | |
| `--background-color-warning` | `--color-warning` | |
| `--background-color-success` | `--color-success` | |
| `--background-color-info` | `--color-info` | |
| `--background-color-neutral-0` | `--color-neutral-0` | Or `--color-background-surface` for cards/panels |
| `--background-color-neutral-N` | `--color-neutral-N` | N = 1..10 |
| `--text-color-neutral-0` | `--color-text-light` | Light text on dark/primary backgrounds |
| `--text-color-neutral-9` | `--color-text` | Default body text |
| `--text-color-neutral-10` | `--color-text` | Default body text |
| `--text-color-neutral-N` | `--color-neutral-N` | N = other steps; consider `--color-text-subtle` or `--color-text-subtlest` |
| `--border-color-primary` | `--color-primary` | Or `--color-border-primary` for border-specific contexts |
| `--border-color-neutral-N` | `--color-neutral-N` | Or `--color-border` / `--color-border-subtle` for generic borders |

### Shadows

| Classic (retired) | New replacement |
|---|---|
| `--shadow-none` | `none` |
| `--shadow-xs` | `--token-elevation-1` |
| `--shadow-s` | `--token-elevation-1` |
| `--shadow-m` | `--token-elevation-2` |
| `--shadow-l` | `--token-elevation-3` |
| `--shadow-xl` | `--token-elevation-4` |

### Font sizes

| Classic (retired) | New replacement | Rendered size |
|---|---|---|
| `--font-size-display` | `--token-font-size-900` | 36 px |
| `--font-size-h1` | `--token-font-size-700` | 28 px (was 32 px — smaller) |
| `--font-size-h2` | `--token-font-size-650` | 26 px (was 28 px — smaller) |
| `--font-size-h3` | `--token-font-size-600` | 24 px (was 26 px — smaller) |
| `--font-size-h4` | `--token-font-size-550` | 22 px (same) |
| `--font-size-h5` | `--token-font-size-500` | 20 px (same) |
| `--font-size-h6` | `--token-font-size-450` | 18 px (same) |
| `--font-size-base` | `--token-font-size-400` | 16 px (same) |
| `--font-size-s` | `--token-font-size-350` | 14 px (same) |
| `--font-size-xs` | `--token-font-size-300` | 12 px (same) |
| `--font-size-label` | `--token-font-size-275` | 11 px (same) |

> **Warning:** h1–h3 are **smaller** in the new scale. A one-to-one swap changes the rendered size. Flag this for the customer to decide whether the new size is acceptable or whether they want to pick a different token step to preserve the old size.

### Border sizes

| Classic (retired) | New replacement |
|---|---|
| `--border-size-none` | `--token-border-size-0` |
| `--border-size-s` | `--token-border-size-025` (1 px) |
| `--border-size-m` | `--token-border-size-050` (2 px) |
| `--border-size-l` | `--token-border-size-075` (3 px) |

### Font weights (retired `--font-*` shorthand)

| Classic (retired) | New replacement |
|---|---|
| `--font-light` | `--token-font-weight-300` |
| `--font-regular` | `--token-font-weight-400` |
| `--font-semi-bold` | `--token-font-weight-600` |
| `--font-bold` | `--token-font-weight-700` |

### Extended palette (12 families x 7 shades)

All `--color-{family}-{shade}` variables are **retired** (e.g. `--color-red-dark`, `--color-indigo-light`). The palette itself was also recoloured, so even the base hex values changed.

Replacement by shade:

| Old shade | Replacement token pattern |
|---|---|
| `lightest` | `--token-bg-{role}-subtle-default` (e.g. `red` → `--token-bg-danger-subtle-default`) |
| `lighter` | `--token-primitives-{family}-300` |
| `light` | `--token-primitives-{family}-500` |
| _(base)_ | `--token-bg-{role}-base-default` (e.g. `green` → `--token-bg-success-base-default`) |
| `dark` | `--token-primitives-{family}-800` |
| `darker` | `--token-primitives-{family}-900` |
| `darkest` | `--token-primitives-{family}-1000` |

Family renames in the token package: **`grape` → `purple`**, **`cyan` → `aqua`**, **`error` → `danger`**.

> **Prefer the semantic role over the family.** `--color-red` was a literal colour. Its replacement is usually `--color-error` (theme role) or `--token-bg-danger-base-default` (token). Route through the role and the CSS follows any future theme; hardcode a family primitive and it won't.

**Customer-redeclared family colors are not dead.** If the sheet sets `--color-red` or `--color-green` (or another retired family base) and reads it back, the custom property still works for those rules. The framework no longer reads the name. Keep their hex, alias the role, and point the matching button variant at it. Do this in every block that defines the color, including dark mode:

```css
--color-error: #c92a2a;
--color-red: var(--color-error);
--osui-btn-error-background: var(--color-error);
--osui-btn-error-border-color: var(--color-error);

--color-success: #37b24d;
--color-green: var(--color-success);
--osui-btn-success-background: var(--color-success);
--osui-btn-success-border-color: var(--color-success);
```

Do not auto-swap a shaded name (`--color-indigo-lightest`). The palette was recolored, so show the token from the extended-palette table and ask.

**Detection pattern:**
```
var\(\s*--color-(red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet|grape|pink)-(lightest|lighter|light|dark|darker|darkest)\)
```

### Semantic light shades

| Classic (retired) | New replacement |
|---|---|
| `--color-error-light` | `--token-semantics-danger-100` |
| `--color-warning-light` | `--token-semantics-warning-100` |
| `--color-success-light` | `--token-semantics-success-100` |
| `--color-info-light` | `--token-semantics-info-100` |
| `--color-primary-lightest` | `--token-bg-primary-subtle-default` |

### Border radius

The radius names survived as theme roles, but values changed and one was dropped:

| Name | Old value | New value |
|---|---|---|
| `--border-radius-none` | `0` | `0` — unchanged |
| `--border-radius-soft` | `4px` | **`8px`** — doubled |
| `--border-radius-rounded` | `100px` | **`999px`** — visually equivalent |
| `--border-radius-circle` | `100%` | **Retired** — use `border-radius: 50%` or `--border-radius-rounded` |

New additions: `--border-radius-default` (global override — set once to re-radius everything), `--border-radius-2xs` through `--border-radius-2xl` (shape tier slots).

> **Warning:** `--border-radius-soft` doubling from 4px to 8px is a visual change even though the name survived. If the customer relied on 4px corners, they'll need `border-radius: 4px` explicitly.

---

## 4. Still valid — no change needed

These variable families are **not retired** and work identically in the new theme (though some resolve to different values — see Section 8):

- **Brand/status colors:** `--color-primary`, `--color-secondary`, `--color-error`, `--color-warning`, `--color-success`, `--color-info`
- **Neutral ramp:** `--color-neutral-0` through `--color-neutral-10` (values changed — see Section 8 neutral trap)
- **Spacing scale:** `--space-none`, `--space-xs`, `--space-s`, `--space-base`, `--space-m`, `--space-l`, `--space-xl`, `--space-xxl`
- **Border radius:** `--border-radius-none`, `--border-radius-soft` (now 8px, was 4px), `--border-radius-rounded`
- **Layout sizes:** `--header-size`, `--header-size-content`, `--side-menu-size`, `--bottom-bar-size`, `--footer-height`
- **Z-index layers:** `--layer-global-*`, `--layer-local-tier-*`, `--layer-above`, `--layer-below`
- **Safe areas:** `--os-safe-area-top`, `--os-safe-area-right`, `--os-safe-area-bottom`, `--os-safe-area-left`

Do **not** flag these as needing migration — but see Section 8 for value changes that may cause visual diffs.

---

## 5. New variables available (upgrade opportunities)

The new theme exposes additional roles that didn't exist before. Customers can use these for a more semantic, theme-aware approach:

| Variable | Purpose |
|---|---|
| `--color-text` | Default body text (replaces `--color-neutral-9`) |
| `--color-text-subtle` | Secondary/muted text |
| `--color-text-subtlest` | Hint/placeholder text |
| `--color-text-disabled` | Disabled state text |
| `--color-text-inverse` | Text on inverted backgrounds |
| `--color-text-light` | Light text on dark/primary backgrounds |
| `--color-text-dark` | Dark text on light/accent backgrounds |
| `--color-background-body` | Page background |
| `--color-background-surface` | Card/panel/popup background |
| `--color-background-header` | Header background |
| `--color-background-sidemenu` | Side menu background |
| `--color-background-footer` | Footer background |
| `--color-background-login` | Login screen background |
| `--color-border` | Default border |
| `--color-border-subtle` | Subtle/divider border |
| `--color-border-subtlest` | Lightest border |
| `--color-primary-hover` | Primary colour hover state |
| `--color-primary-active` | Primary colour active/pressed state |
| `--border-radius-2xs` through `--border-radius-2xl` | New shape tier slots (shape profiles) |

---

## 6. Dark theme considerations

The new theme ships a generated dark theme (`.os-dark-theme` class on `<html>`) that overrides ~447 `--token-*` values for dark mode. Custom CSS with **hardcoded hex/rgb values** will not follow the theme switch. Flag:

- Any hardcoded colour literal (`#abc123`, `rgb(...)`, `rgba(...)`, `hsl(...)`) that has a token or role equivalent.
- Overrides pinned to a specific neutral step (e.g. `--color-neutral-9`) for text — these won't flip in dark mode. Prefer `--color-text` and its variants.

**If the customer uses a custom dark-mode class (e.g. `.dark-mode`) instead of `.os-dark-theme`, strongly recommend adding `.os-dark-theme` alongside it.** Without `.os-dark-theme`, framework component internals that read `--token-*` values (feedback messages, input backgrounds, dropdown popups, surface colors, shadows, state overlays) stay at their light-mode defaults — producing white feedback banners, light inputs, and other light-on-dark artefacts. Each must be overridden manually. Adding `.os-dark-theme` to `<html>` whenever the custom class is toggled fixes all of these automatically and composes cleanly with the customer's own `--color-*` and `--osui-*` overrides.

---

## 7. Migration procedure

The migration is a **two-phase workflow**: auto-fix first, then interactive review. All work is done in a **working file** so progress is preserved between steps.

### Working file

At the start of the migration, write the customer's CSS to a temporary working file in the **system temp directory** (works on macOS, Linux, and Windows):

```
<system-temp>/osui-migration-<name>.css
```

Resolve the temp directory using the platform's standard location:
- **macOS / Linux:** the value of `$TMPDIR` (typically `/var/folders/.../T/` on macOS, `/tmp` on Linux)
- **Windows:** the value of `%TEMP%` (typically `C:\Users\<user>\AppData\Local\Temp`)

Determine it at runtime with: `node -p "require('os').tmpdir()"` or `python3 -c "import tempfile; print(tempfile.gettempdir())"`.

`<name>` is derived from the source (filename, app name, or `custom` as fallback). This file is the single source of truth throughout the process:
- Phase 1 writes the auto-fixed CSS to it.
- Each Phase 2 step reads the file, applies accepted changes, and writes it back.
- Phase 3 reads the final version for the user.

Tell the user the working file path after creating it so they can open it alongside the conversation.

### Phase 1 — Scan and auto-fix

Scan the full CSS for all five breakage categories, classify each finding as `auto-fixable`, `review-needed`, or `manual`, then **immediately apply all auto-fixable replacements** and write the corrected CSS to the working file.

#### Auto-fixable — apply without asking

These are mechanical, safe, one-to-one replacements with no ambiguity:

- **Retired variable swaps (Category A):** every `var(--border-size-s)` → `var(--token-border-size-025)`, every `var(--font-size-xs)` → `var(--token-font-size-300)`, every `var(--font-regular)` → `var(--token-font-weight-400)`, etc. Use the full mapping table in Section 2. The replacement is always the same regardless of context.
- **Missing `--color-primary-active` (Category C):** if `:root` overrides `--color-primary` and `--color-primary-hover` but not `--color-primary-active`, add `--color-primary-active` with the same value as `--color-primary-hover` (safe default — pressed state matches hover).

**Output:** write the migrated CSS to the working file with `/* MIGRATED: ... */` comments on each changed line. Show a summary of what was changed (not the full CSS — that's in the file). Example of a migrated line:

```css
.btn {
    border-radius: var(--border-radius-rounded);
    font-weight: var(--token-font-weight-400); /* MIGRATED: was --font-regular */
    font-size: 14px;
    white-space: nowrap;
}
```

#### What qualifies as auto-fixable

A replacement is auto-fixable **only** when:
1. The mapping is a single, unambiguous entry in Section 2 (one old var → one new var).
2. The replacement produces the **same rendered value** (same px/color/weight). Font-size swaps where the new token renders a **different size** (h1–h3) are NOT auto-fixable.
3. The replacement does not change the selector, property name, or specificity — only the value.

Everything else goes to Phase 2.

### Phase 2 — Interactive review (one group at a time)

Present review-needed findings **one category at a time**. Show the table for that category, ask the user, **wait for their response**, apply their choices, then move to the next category. Never present multiple categories in the same message.

The order is intentional — most impactful / most broken first:

#### Step 2a — Component CSS API overrides (Category B)

For each direct visual override, look up the `--osui-*` knob in `src/scss/`. Include both `.osui-*` rules and the legacy selectors in the Category B table (dropdown, input, wizard, popup). A renamed class is still a finding: retarget it in the proposed replacement. Apply the "when the lookup does not give a clean swap" rules in that table (unused knob, `display: none` pseudo, no knob). Present a table with before/after for each finding. Ask: "Should I replace these with the CSS API variables? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the working file. Then proceed to Step 2b.**

#### Step 2b — Font-size / line-height pairing (Category D)

For each `font-size` without `line-height`, present the rule and suggest a `line-height` value. Skip icons (`.icon` class or icon-like context). Ask: "Should I add line-height to these? (yes/no/pick which ones)"

The suggested `line-height` follows this heuristic:
- **font-size <= 12px**: suggest `line-height: 1.4`
- **font-size 13–18px**: suggest `line-height: 1.5` (or the matching `--token-font-line-height-*`)
- **font-size >= 20px**: suggest `line-height: 1.2`

**Wait for the user's response. Apply their choices to the working file. Then proceed to Step 2c.**

#### Step 2c — Physical vs logical properties (Category E)

For each physical property on an OSUI/framework selector, present the logical equivalent. Show which `.is-rtl` rules become unnecessary after conversion. Ask: "Should I convert these to logical properties? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the working file. Then proceed to Step 2d.**

#### Step 2d — Dark mode class (Category C, if applicable)

If the CSS uses a dark-mode selector other than `.os-dark-theme`, present the options:
- **Option A:** Keep the custom selector as-is (app manages its own dark mode).
- **Option B (recommended):** Add `.os-dark-theme` alongside the custom selector to benefit from the framework's dark token overrides.

**Why Option B matters.** The framework ships ~447 dark-mode `--token-*` overrides scoped under `.os-dark-theme`. These cover feedback messages (`--token-bg-info-subtle-default`, `--token-bg-danger-subtle-default`, …), input backgrounds, surface colors, shadow colors, state overlays, and many component internals. Without `.os-dark-theme`, all of these stay at their light-mode values — producing white feedback messages, light inputs, and other light-on-dark glitches. Adding `.os-dark-theme` alongside the customer's class (e.g. toggling both `.dark-mode` and `.os-dark-theme` on `<html>`) fixes these automatically without needing individual token overrides.

If the customer chooses Option A, flag that they will need to manually override every `--token-*` that their dark mode exposes (feedback messages, dropdowns, inputs, etc.). This is significantly more work than adding the class.

In the same step, check button contrast. If the dark block makes `--color-primary` light (directly, or because it points at a neutral step that flips light), propose setting `--osui-btn-primary-color` **on `.btn-primary`** (not on `:root` — see Category C note). Also propose `--osui-btn-color: var(--color-text-dark)` on `.btn.background-white` and any other light-background button variants under the dark selector.

Ask: "Which dark-mode approach do you want, and should I apply the button-label fix?"

**Wait for the user's response. Apply their choice to the working file. Then proceed to Step 2e.**

#### Step 2e — Redeclared palette colors (Category A)

If the sheet declares a retired family base (`--color-red`, `--color-green`, or another `--color-{family}` with no shade) and uses it, propose the alias in Section 3: keep the hex on `--color-error` / `--color-success`, point the old name at that role, and set `--osui-btn-error-*` / `--osui-btn-success-*`. Repeat it in the dark block when that block defines its own hex. Shaded names stay in this step too, with the extended-palette token shown before applying, because the hex changed.

Ask: "Should I alias these palette colors? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the working file. Then proceed to Step 2f.**

#### Step 2f — Neutral ramp flip role overrides (Category H, if applicable)

If the dark block overrides 3 or more `--color-neutral-*` steps (the ramp-flip pattern), the framework's role variables no longer cascade from the neutrals. Present the customer with the list of role overrides needed, mapped to their specific neutral steps:

1. **Identify the customer's text step** — whichever `--color-neutral-*` flipped to near-white (usually `--color-neutral-10` or `--color-neutral-9`).
2. **Identify the customer's surface step** — the step closest to the dark background (usually `--color-neutral-1` or `--color-neutral-0`).
3. **Identify the customer's border step** — typically `--color-neutral-2` or `--color-neutral-3`.
4. **Check for custom surface variables** — if the customer declares variables like `--header-color`, `--sidebar-bg`, etc. that are NOT the framework's role names (`--color-background-header`, `--color-background-surface`), flag that these must be wired.

Present a table like:

| Role variable | Proposed value | Purpose |
|---|---|---|
| `--color-text` | `var(--color-neutral-10)` | Body text |
| `--color-text-subtle` | `var(--color-neutral-8)` | Secondary text |
| `--color-text-subtlest` | `var(--color-neutral-7)` | Hint/placeholder text |
| `--color-background-header` | `var(--header-color)` or hex | Header background |
| `--color-background-surface` | `var(--color-neutral-1)` | Card/panel surfaces |
| `--color-border` | `var(--color-neutral-3)` | Default borders |
| `--color-border-subtle` | `var(--color-neutral-2)` | Subtle/divider borders |
| `--token-semantics-primary-base` | `var(--color-neutral-10)` | Link color + primary (framework hardcodes links to this token, not `--color-primary`) |
| `--token-semantics-primary-900` | `var(--color-neutral-9)` | Link hover + primary hover state |

Also check whether any custom variables need wiring to framework roles in the `:root` (light) block too (e.g. `--color-background-header: var(--header-color)`).

Ask: "Should I add these role overrides to the dark block? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the working file.**

### Phase 3 — Final output

After the user has responded to **all** review groups:
1. Read the working file.
2. Remove the `/* MIGRATED: ... */` comments (they were only for review).
3. Write the clean final version back to the working file.
4. Tell the user the file is ready and show a short summary of all changes applied vs. left as-is.

---

## 8. Same name, new value (Category F)

These variables still exist — overrides still apply — but without an override they now resolve to a **different colour**. Nothing to change in the CSS; flag these so the customer understands unexpected visual diffs.

Key changes:

| Variable | Old | New |
|---|---|---|
| `--color-primary` | `#1068eb` | `#105cef` |
| `--color-primary-hover` | `#295fd6` | `#0f54da` |
| `--color-primary-selected` | `rgba(20,110,245,0.12)` | `#0d4bc3` — **now solid, not translucent** |
| `--color-secondary` | `#303d60` | `#3b3b3b` |
| `--color-error` | `#dc2020` | `#d82424` |
| `--color-warning` | `#e9a100` | `#ffd600` |
| `--color-success` | `#29823b` | `#1ba433` |
| `--color-info` | `#017aad` | `#105cef` — info is now blue-primary |
| `--color-background-body` | `#f3f6f8` | `#ffffff` |
| `--border-radius-soft` | `4px` | `8px` — doubled |

> **`--color-primary-selected` changed meaning.** It used to be a translucent wash for row backgrounds. It is now a solid pressed-state colour.

### The neutral trap

`--color-neutral-0` through `-10` survived, but the scale was re-based and **`--color-neutral-0` is no longer white** (`#f9f9f9` instead of `#ffffff`). The `.text-neutral-0` / `.background-neutral-0` utility classes still resolve to pure white, but the *variable* does not — the two diverged.

If the customer used `var(--color-neutral-0)` for text on a coloured background, switch to `--color-text-inverse` or `--token-primitives-base-white`.

---

## 9. Utility classes (Category G)

Every utility class kept its name (`.shadow-m`, `.margin-base`, `.font-size-h1`, `.background-red-lightest`, etc.) and still ships. What changed is what they read — they now inline the token directly instead of going through the old variable:

```css
/* before */
.shadow-m { box-shadow: var(--shadow-m); }

/* now */
.shadow-m { box-shadow: var(--token-elevation-2, ...); }
```

> **Overriding the old variable no longer reskins the class.** Setting `--shadow-m` at `:root` used to change every `.shadow-m` element. It does nothing now — override `--token-elevation-2` instead. Same for `--space-*` → `--token-scale-*` and `--font-size-*` → `--token-font-size-*`.

---

## 10. Recipes — "I used to do X"

Common migration patterns:

### "My dark primary button lost its label"

`--color-text-light` stays white. If dark mode turns `--color-primary` white, the label disappears. Set `--osui-btn-primary-color` **on `.btn-primary`**, not on `:root` (the framework re-declares it on `.btn`, so a `:root` override is inherited but loses):

```css
.dark-mode .btn-primary,
.os-dark-theme .btn-primary {
  --osui-btn-primary-color: var(--color-neutral-0);
}
.dark-mode .btn.background-white,
.os-dark-theme .btn.background-white {
  --osui-btn-color: var(--color-text-dark);
}
```

### "I re-branded the app by overriding `--color-primary`"

Still works, but add the interaction tiers and border:

```css
:root {
  --color-primary: #7c20f2;
  --color-primary-hover: #651ac5;
  --color-primary-active: #5817ab;
  --color-border-primary: #7c20f2;
}
```

Or go one level deeper for a full re-brand (focus halos recolour automatically):

```css
:root {
  --token-semantics-primary-base: #7c20f2;
  --token-semantics-primary-800: #651ac5;
  --token-semantics-primary-900: #5817ab;
}
```

### "I rounded (or squared) every corner by hand"

One switch now:

```css
:root { --border-radius-default: 0; }    /* everything square */
:root { --border-radius-default: 12px; } /* everything softer */
```

### "I restyled one component with `!important`"

Check the CSS API Reference for the component's `--osui-*` knobs first — there usually is one now:

```css
/* before */
.my-page .osui-sidebar { background: #1a1a2e !important; }

/* now */
.my-page .osui-sidebar {
  --osui-sidebar-background: #1a1a2e;
  --osui-sidebar-color: #ffffff;
}
```

### "I set my own body / header / menu backgrounds"

Use the surface roles:

```css
:root {
  --color-background-body: #f6f7fb;
  --color-background-surface: #ffffff;
  --color-background-header: #101828;
  --color-background-sidemenu: #101828;
  --color-background-footer: #101828;
  --color-background-login: #ffffff;
  --color-background-input: #ffffff;
}
```

### "My links are blue / invisible in dark mode"

The framework hardcodes link color to `$token-semantics-primary-base`, not `--color-primary`. Overriding `--color-primary` does not change links. Override the token in the dark block, or style links directly. When overriding link color, always override hover/focus too — `a:hover` reads `--token-semantics-primary-900` which also stays at its light value:

```css
/* Option 1: override the token (changes links AND primary) */
:root.dark-mode {
    --token-semantics-primary-base: var(--color-neutral-10);
    --token-semantics-primary-900: var(--color-neutral-9);
}

/* Option 2: style links directly (independent of primary) */
a[data-link] {
    color: var(--color-text);
}
a[data-link]:hover,
a[data-link]:focus {
    color: var(--color-text-subtle);
}
```

### "My active nav link is invisible in dark mode"

The active menu pill uses `--token-bg-primary-subtle-default` (light blue) for its background and `--token-semantics-primary-base` for text. Without `.os-dark-theme`, the background stays light. If `--token-semantics-primary-base` was overridden to white, it's white text on a light pill — invisible.

**Best fix:** add `.os-dark-theme` alongside the custom dark class — the token flips to a dark blue automatically.

**Targeted fix** (without `.os-dark-theme`):

```css
.dark-mode .app-menu-links > a.active,
.os-dark-theme .app-menu-links > a.active {
    background-color: rgba(255, 255, 255, 0.15);
    color: var(--color-neutral-10);
}
```

### "My blank-slate icons turned grey"

The new theme changed `--osui-blank-slate-icon-color` from a primary-adjacent colour to `--color-text-disabled` (grey). Override on the component:

```css
.blank-slate-icon {
    color: var(--color-primary);
}
```

### "I hand-built a dark mode"

Consider adopting the built-in `.os-dark-theme` alongside the custom class — it's implemented purely as variable overrides and composes with custom `--osui-*` and `--color-*` overrides. Toggle the class on `<html>` via the `SetDarkTheme` client action. Without it, ~447 `--token-*` overrides (feedback messages, input backgrounds, shadows, etc.) stay at light-mode values.

### "I built dark mode by flipping the neutral ramp"

A common pattern: override `--color-neutral-0` through `--color-neutral-10` in a dark block so that 0 becomes the darkest and 10 becomes the lightest. This worked in the old theme because role variables like `--color-text` were defined as `var(--color-neutral-9)` — flipping neutral-9 to a light color automatically made text light.

In the new theme, roles go through tokens and **no longer cascade from neutrals**. The ramp flip still affects elements that read `var(--color-neutral-*)` directly (custom backgrounds, custom borders), but the framework's own text, headers, surfaces, and borders stay in light mode. Result: dark backgrounds with dark text — invisible UI.

**Fix:** add explicit role overrides in the dark block, mapped to the flipped neutral steps:

```css
:root.dark-mode,
:root.os-dark-theme {
    /* Existing neutral ramp flip */
    --color-neutral-0: #040D3F;
    --color-neutral-10: #ffffff;
    /* ... rest of ramp ... */

    /* Role overrides — required in the new theme */
    --color-text:                var(--color-neutral-10);
    --color-text-subtle:         var(--color-neutral-8);
    --color-text-subtlest:       var(--color-neutral-7);
    --color-background-header:   #141C4E;  /* wire custom var or use hex */
    --color-background-surface:  var(--color-neutral-1);
    --color-border:              var(--color-neutral-3);
    --color-border-subtle:       var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10);  /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);   /* link/primary hover */
}
```

Also wire any custom surface variables to framework roles in the `:root` block:

```css
:root {
    --color-background-header: var(--header-color);
}
```

### "I changed all the shadows / all the spacing / all the type"

Override the tokens directly:

```css
:root {
  --token-elevation-2: 0 2px 8px rgba(0, 0, 0, 0.12);
  --token-scale-400: 20px;     /* every 16px gap becomes 20px */
  --token-font-size-400: 15px;
}
```

---

## 11. What NOT to flag

- `var(--color-primary)`, `var(--space-base)`, `var(--border-radius-soft)` and other still-valid variables (Section 3).
- Inline styles set by the OutSystems platform runtime — only flag CSS the customer authored.
- Variables inside `env()` or `calc()` wrappers that are structurally correct.
- Provider/vendor CSS (`.flatpickr-*`, `.vscomp-*`, `.splide-*`) — these are framework-owned.
