---
name: osui-theme-migration
description: Migrate custom CSS from the classic OutSystems UI theme to the new token-based theme. Use this skill when a customer, app developer, or QE asks to "migrate CSS to the new theme", "fix my CSS for the new OSUI", "update my styles for the new OutSystems UI", "what changed in the new theme", "my app looks broken after the OSUI update", "adapt custom CSS", "theme migration", "new theme impact", "CSS broke after update", or any time someone's custom CSS needs updating because it targeted the old (pre-token-migration) OSUI vocabulary. Covers the eight breakage categories, the retired → replacement mapping, detection patterns, and fix guidance.
---

# Migrating custom CSS to the new OutSystems UI theme

This skill helps analyse and fix custom CSS written against the **classic** (pre-token-migration) OutSystems UI theme so it works with the **new** token-based theme.

The new theme ships design tokens (`--token-*`), a framework theme layer (`--color-*`, `--border-radius-*`, `--space-*`, …), and a per-component CSS API (`--osui-*`). Most of the old public vocabulary survived, but several variable families were retired, components gained an override surface, and the box model moved to logical properties. Custom CSS that relied on retired variables or overrode component internals directly will break.

**This file is the procedure. The two lookup tables live alongside it and are loaded on demand:**

| Reference | Load it when |
|---|---|
| [`references/variable-mapping.md`](references/variable-mapping.md) | Rewriting a retired variable name — the full classic → new mapping |
| [`references/widget-catalog.md`](references/widget-catalog.md) | Running Phase 2g — one row per widget whose defaults changed, with its bucket and knob |

Both are **writable**: a migration that discovers a new fact is expected to add it. See Phase 5.

Read a reference when the step says to, not up front. The catalog in particular should be consulted for the inventoried widgets only.

---

## 0. Decide what you are actually fixing

Out of the box, the new theme **is** a redesign. Components are deliberately sized, spaced, and coloured differently from classic. A migration that pins every one of those defaults back has paid the upgrade cost, gained none of the benefit, and left the customer with a pile of override CSS to maintain forever. **"Restore the classic look" is not the default recommendation.**

Plenty of it is not taste, though. Sort every finding into one of three buckets, and report the bucket alongside the finding:

| Bucket | What it means | What to do |
|---|---|---|
| **Breaks** | The customer's CSS no longer does what they wrote it to do — a retired variable resolves to nothing, a role stopped cascading from their neutral ramp, text or a control went invisible | Fix it. Not a judgement call |
| **Collides** | The framework change is defensible on its own, but it invalidates a rule the customer already had | Fix it. They cannot diagnose this themselves — their rule is still in the file and still looks correct |
| **Preference** | A framework default just looks different. Nothing of theirs is overridden and nothing is unreadable | **Leave it.** Report it with the one-line revert and let the customer decide |

**Collides** is the bucket that costs the most time and is easiest to miss, because the symptom never points at the cause. Its recurring shapes:

- A changed anchor or transform invalidates an offset the app had already tuned against the old one (the icon badge `top` / `left` case).
- A new `gap` stacks on top of a margin the app still sets, so the element grows.
- A new overlay or ring paints over colours the app set correctly underneath, so the symptom reads as "my colour is wrong" and sends you after the wrong variable.
- A size or padding increase overflows a height the app hand-set around the widget.

Many catalog rows are **mixed** — part of the change breaks something and part is preference. Split them in the report rather than applying the whole row. The top menu link is the canonical example: the new hover fill washing out the label on a custom dark header is a contrast break, while the link becoming a pill and losing its active underline is purely preference.

**One exception.** When the job is to *validate* the migration rather than ship it — proving nothing is silently lost, or producing an exhaustive impact list — restoring parity across all three buckets is the right call, because parity is the test. Say which mode you are in; do not hand a customer a parity patch and call it a migration.

---

## 1. Triage — what to search for

Before diving in, search the customer's CSS for these patterns to identify which sections apply:

| If the CSS contains… | Verdict | Category |
|---|---|---|
| `var(--font-size-*)`, `var(--shadow-*)`, `var(--border-size-*)`, `var(--font-*)` weights | Retired — resolves to nothing | A (Section 2) |
| `var(--background-color-*)`, `var(--text-color-*)`, `var(--border-color-*)` | **Not** retired — never declared in either theme. The framework stopped *reading* them, so the customer's own declaration is now ignored rather than broken | A (Section 2, removed read hooks) |
| `var(--space-*)` | **Still works.** Declared at `:root` with classic values — do not rewrite | `references/variable-mapping.md`, spacing |
| `--color-red-dark`, `--color-indigo-light`, any extended-palette shade | Retired + hex changed | A (`references/variable-mapping.md`, extended palette) |
| `--color-primary`, `--color-error`, `--color-background-body` | Still works but resolves to a different colour | F (Section 8) |
| `--color-neutral-0` … `-10` | Still works but scale re-based — `neutral-0` is no longer white | F (Section 8, neutral trap) |
| A rule against `.osui-*`, or a legacy widget class (`.dropdown-container`, `.wizard-item-icon`, `[data-popup]`, `.form-control`), with `!important` or direct property overrides | Probably replaceable with an `--osui-*` variable on the current selector | B (Section 2) |
| Dark mode inverts `--color-neutral-*` while `--color-primary` points at a neutral step | Primary button label stays white (`--color-text-light` is not remapped) | C (Section 2, button contrast) |
| `font-size` without `line-height` | May look wrong due to line-height model change | D (Section 2) |
| `padding-left`, `margin-right` etc. on OSUI classes | May silently lose cascade race against logical properties | E (Section 2) |
| `.shadow-m`, `.margin-base`, `.font-size-h1` (utility classes) | Still shipped but no longer driven by old variables | G (Section 9) |
| Dark block overrides 3+ `--color-neutral-*` steps (ramp flip) | Role variables (`--color-text`, `--color-background-header`, …) no longer cascade from neutrals — text, buttons, and surfaces go invisible | H (Section 2, neutral ramp flip) |
| Custom dark class (`.dark-mode`) without `.os-dark-theme` | ~447 `--token-*` overrides don't fire — feedback messages, inputs, surfaces stay light | Section 6, Step 2d |
| Blank-slate icons turned grey | `--osui-blank-slate-icon-color` changed from primary-adjacent to `--color-text-disabled` | Section 10 recipe |
| A widget looks different from the classic app, and the custom CSS never mentioned it | The new theme changed a framework default — these do not show up in any search of the customer's CSS | `references/widget-catalog.md`, applied in Phase 2g |

---

## 2. The breakage categories

Every migration issue falls into one of these eight. Categories A–E and H are documented below; F and G are large enough to have their own sections (8 and 9). Scan for all of them.

### Category A — Retired CSS variables

The largest source of breakage — but it contains **two different failure modes**, and they need different diagnoses. Do not merge them.

**A1 — variables that were declared and are now gone.** These were real `:root` declarations in the classic bundle and are absent from the new one, so a `var()` reading them resolves to nothing and the whole declaration is dropped.

| Retired family | Example | What to use instead |
|---|---|---|
| `--shadow-*` | `--shadow-s`, `--shadow-l` | `--token-elevation-*` (mapping in `references/variable-mapping.md`) |
| `--font-size-*` | `--font-size-h1`, `--font-size-base` | `--token-font-size-*` (mapping in `references/variable-mapping.md`) |
| `--border-size-*` | `--border-size-s` | `--token-border-size-*` (mapping in `references/variable-mapping.md`) |
| `--font-*` weights | `--font-regular`, `--font-semi-bold` | `--token-font-weight-*` (mapping in `references/variable-mapping.md`) |
| `--color-{family}-{shade}` | `--color-red-dark`, `--color-indigo-lightest` | `references/variable-mapping.md` extended palette — `lightest` and the bare family are often `--token-bg-extended-*` or a status role, not a primitive |
| `--color-{status}-light` | `--color-error-light` | `--token-semantics-{role}-100` (semantic shades in `references/variable-mapping.md`) |
| `--border-radius-circle` | `border-radius: var(--border-radius-circle)` | Use `border-radius: 50%` or `--border-radius-rounded` |

**A2 — read hooks the framework stopped honouring.** `--background-color-*`, `--text-color-*`, and `--border-color-*` were **never declared** in either theme. They existed only as the inner half of `var(--text-color-primary, var(--color-primary))` chains *inside framework rules* — an opt-in override surface. Classic read them in several hundred places; the new bundle reads `--text-color-*` and `--border-color-*` in **none**, and `--background-color-*` in a handful.

So a customer who set `--text-color-primary` at `:root` is not hitting a dead `var()`. Their declaration is still valid CSS and still resolves — the framework simply no longer asks for it. **The symptom is a setting that stopped having any effect, with nothing broken-looking in the stylesheet to point at.** The fix is to set the `--color-*` role the framework does read (mapping in `references/variable-mapping.md`), not to repair anything.

| Removed hook | Example | Set this instead |
|---|---|---|
| `--background-color-*` | `--background-color-primary` | The matching `--color-*` role (mapping in `references/variable-mapping.md`). **Except `-body`, `-header`, `-login`** — those three are still read and should be left alone |
| `--text-color-*` | `--text-color-neutral-0` | The matching `--color-text-*` role (mapping in `references/variable-mapping.md`) |
| `--border-color-*` | `--border-color-primary` | The matching `--color-border-*` role; `--color-*` only where the value is not a border |

Note the asymmetry this creates in the customer's own CSS: a rule reading `var(--background-color-primary, var(--color-primary))` still works, because of the inner fallback. A rule reading `var(--background-color-primary)` bare was always broken — in both themes — since nothing ever declared it.

#### Repairing a dead declaration can itself be the regression

An A1 variable anywhere in a **shorthand** invalidates the whole declaration, not just that one value. `border: var(--border-size-s) solid red` does not become `border: <nothing> solid red` — it is dropped entirely, and the element falls back to the framework's border on every side.

That matters because it means the rule has already been inert since the upgrade, and the element has been rendering on the framework default. Substituting the literal is the obvious repair and is sometimes wrong: it re-activates a rule that has been absent, re-asserting values the app never cared about against a framework that now supplies them differently. **Restoring the declaration faithfully can break something that currently looks correct.**

The shape to watch is a shorthand where only one value was ever the point — the others were written to be harmless against a framework default that has since changed. A row styled `padding: var(--font-size-label) 5px` wants narrow inline padding; the block value was tuned against a framework that set an explicit `height` on that element, so it never did much. Drop the height in the new theme and rebuild the row out of `padding-block` instead, and the faithfully restored shorthand now overrides the padding the row's height depends on. Nothing in the customer's CSS changed; the value simply started mattering.

So before substituting a literal into a dead declaration, ask what the element currently renders as without it. If the framework default already produces the classic result, **write the longhand the rule actually intended** (`padding-inline: 5px`) and leave the rest to the framework. Reach for the full shorthand only when the app genuinely needs every side pinned.

This applies to A1 only. An A2 hook never invalidated anything — the declaration was always valid — and `--space-*` is not retired at all, so neither is a candidate here.

#### Audit light/dark declaration symmetry

Category H fixes get written into the dark block, because that is where the breakage was reported. But most of them are role overrides expressed through the neutral ramp, and the ramp flips on its own — so the same override usually belongs at `:root`, where it serves both modes. Left dark-only, light mode silently keeps the framework's neutral greys while dark follows the customer's brand.

List the custom properties declared in each block, then take the set difference. Anything declared in the dark block but not at `:root` is a candidate. Extract the two name lists, splitting the file at the dark selector:

```sh
grep -oE '(^|[{;])[[:space:]]*--[A-Za-z0-9_-]+[[:space:]]*:' theme.css | grep -oE '\-\-[A-Za-z0-9_-]+' | sort -u
```

Run it once over the lines above the dark selector and once over the lines below it, and compare. Any reader works — the check is a set difference on declaration names, not a parse. Do it by eye on a short stylesheet.

Two outcomes, and the value tells you which:

- **A literal that only makes sense in dark** — `#3d1a2a`, `rgba(255,255,255,0.15)` — is correctly dark-only. Leave it.
- **A `var(--color-neutral-N)` reference** is almost always a light-mode gap. The ramp already flips, so the same declaration at `:root` covers both modes, and the dark block only needs to keep it if it deliberately picks a *different* step.

The roles most often caught this way are `--color-text`, `--color-text-subtle`, `--color-text-subtlest`, `--color-border`, and `--color-border-subtle`. None of them existed in classic — classic drove text directly off the ramp (`html` was `--color-neutral-9`) — so a customer who never declared them is not "keeping the default", they are inheriting a grey the old theme never showed them.

#### `--token-*` is NOT declared at `:root` — never emit a bare one

**This is the single highest-value rule in this document.** The shipped bundle does not declare the light `--token-*` values anywhere. `gulp/ProjectSpecs/ScssStructure/Root.js` registers `01-foundations/root` and `tokens/theme-dark`, but **not** `tokens/root` — deliberately, because `:root` and `.os-dark-theme` are both specificity 0-1-0 and emitting light tokens at `:root` would let them beat the dark overrides. Verify in any customer app:

```js
getComputedStyle(document.documentElement).getPropertyValue('--token-font-size-450')  // ""
```

So in the browser:

| Layer | At `:root` | Under `.os-dark-theme` |
|---|---|---|
| `--color-*`, `--border-radius-*`, `--layer-*`, `--os-safe-area-*` | **Declared** | — |
| `--osui-*` component knobs | Declared on each component | — |
| `--token-*` **colours** | **Not declared** | **Declared — ~447 of them** |
| `--token-*` sizes, scales, weights, border widths | **Not declared** | Not declared |

The framework itself is unaffected because its SCSS never emits a bare reference: `$token-border-size-025` expands to `var(--token-border-size-025, var(--token-scale-025, 1px))`, so every component falls through to a literal. Customer CSS is plain CSS with no access to `$token-*` and gets no such chain.

**Two consequences, and the second is the one that wastes an afternoon:**

1. A bare `var(--token-x)` for a size, scale, or weight is dead in **both** modes. In a shorthand it takes every other term with it, so the symptom is a *missing* border rather than a default one:

```css
/* No border at all — not a default border, none. */
border: var(--token-border-size-025) solid var(--color-neutral-10);

/* Renders 1px regardless. */
border: var(--token-border-size-025, 1px) solid var(--color-neutral-10);
```

2. A bare `var(--token-x)` for a **colour** is dead in light mode and **works in dark mode**, because `.os-dark-theme` declares those ~447 properties. An agent that verifies in dark mode first will conclude the rule is correct and ship a stylesheet that silently fails in the default theme. Always verify in light.

**Rules to follow:** prefer the `--color-*` / `--border-radius-*` theme-layer roles, which are declared at `:root` and already follow dark mode. Reach for `--token-*` only when no role covers the case, and then always as `var(--token-x, <literal>)`, taking the literal from `src/scss/tokens/_variables.scss`.

#### Verify every `--token-*` name before emitting it

The token namespace is generated, and its naming is not guessable. Weights are word-named (`--token-font-weight-regular`, not `-400`); sizes and scales are numeric (`--token-font-size-450`, `--token-scale-200`). Mixing the two conventions produces a name that looks plausible and does not exist. Check each one against `src/scss/tokens/_variables.scss` before writing it, and list any that fail:

```sh
grep -oE '^[[:space:]]*\$token-NAME[[:space:]]*:' src/scss/tokens/_variables.scss
```

That file declares each token as `$token-name: var(--token-name, <fallback>);`, so matching the SCSS variable confirms the CSS custom property too. Do **not** grep `src/scss/tokens/_root.scss` — `npm run build:tokens` runs with `--root false`, so that file is not generated and a fresh clone will not have it. A stale copy left over from an older build is worse than no file, because the grep appears to work while checking names against a snapshot.

This is worth a final sweep over the finished stylesheet: extract every `--token-*` and `--space-*`/`--color-*`/`--border-*` reference, confirm each is declared somewhere in the new theme, and treat any miss as a migration bug rather than a customer bug.

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
| `.button-group-item.button-group-selected-item` | `.button-group-item` | `--osui-button-group-selected-background: var(--color-primary)`, `--osui-button-group-selected-color: var(--color-neutral-0)`, `--osui-button-group-selected-border-color: transparent`. Unselected text was `--color-primary` → `--osui-button-group-color`. A direct `background-color` on `.button-group-item` loses to the selected rule. The classic widget has no hover fill. Set `--osui-button-group-hover-background` to the unselected background, and on `.desktop .button-group-item.button-group-selected-item:hover` set the background back to `--osui-button-group-selected-background` — one hover knob feeds both states |
| `.button-group` padding / joined capsule | `.button-group` | `--osui-button-group-container-background`, `--osui-button-group-container-border-radius`, `--osui-button-group-container-padding: 0`, `--osui-button-group-container-gap: 0`. The new widget insets the items; the old one did not. It is also `inline-block`, 32px tall, and 12px type. The classic item is 40px (`48px` on `.phone` / `.tablet`), `--font-size-s` (`--token-font-size-350`), and padded with `--space-base`. When the old group filled its parent, set `width: 100%` and `display: flex` (and `flex: 1` on the inner wrapper) so `inline-block` does not shrink it to the label. Set `--osui-button-group-height`, `--osui-button-group-font-size`, `--osui-button-group-padding-inline: var(--token-scale-400, 16px)`, and `--osui-button-group-min-width: 0` |
| `.osui-accordion-item` `border` / `:after` `border-width` | `.osui-accordion-item` | `--osui-accordion-item-border-width` (the divider is `border-block-end` reading this knob). `border: none` does not clear that longhand |
| `.osui-range-slider .noUi-handle` background | `.osui-range-slider` | `--osui-range-slider-handle-background`, plus `--osui-range-slider-handle-border-color` (the handle gained a 2px `--color-primary` border). The handle also shrank 24px → 16px, which has **no `--osui-*` knob** — set `--range-slider-handle-size`. Handle `:before` / `:after` are `display: none`; drop those rules **unless** the customer repurposed one as a visible mark, in which case see the matching row in `references/widget-catalog.md` |

**When the lookup does not give a clean swap:**

- The variable is declared but never read (example: `--osui-accordion-item-border-radius`). Keep the property. `--osui-accordion-border-radius` only rounds the first and last item of the group, so a per-item `border-radius` can still need `!important` against those longhands. The border-width knob above is read; the radius knob is not.
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

**Default button text must NOT be forced dark.** Do not set `--osui-btn-color: var(--color-text-dark)` on all `.btn` in dark mode. The default `.btn` has a dark surface background (`--color-background-surface`) and needs light text. Only target buttons whose fill stays light:

```css
.dark-mode .btn.background-white,
.os-dark-theme .btn.background-white {
    --osui-btn-color: var(--color-text-dark);
}
```

A transparent outlined button on a dark surface is the other case. Dark text disappears, and the default border token stays too dark to see. Keep the fill transparent and point the label and border at the light text step:

```css
.dark-mode .btn.btn-transparent-with-border,
.os-dark-theme .btn.btn-transparent-with-border {
    --osui-btn-background: transparent;
    --osui-btn-hover-background: transparent;
    --osui-btn-active-background: transparent;
    --osui-btn-border-color: var(--color-neutral-10);
    --osui-btn-color: var(--color-neutral-10);
}
```

Do NOT use a blanket `.dark-mode .btn { --osui-btn-color: var(--color-text-dark); }` — it makes default and secondary button labels invisible on their dark backgrounds.

### Category D — Line-height model

`body` line-height changed from unitless `1.5` to unitless **`1.714286`**. Both inherit as a *ratio*, so every element that sets its own `font-size` without a `line-height` gets a line box **14.3% taller** than before — proportionally, at every size:

| font-size | classic | new | delta |
|---|---|---|---|
| 11px | 16.50px | 18.86px | +2.36 |
| 14px | 21.00px | 24.00px | +3.00 |
| 40px | 60.00px | 68.57px | +8.57 |

**Inherited text does not overlap** — the whole scale loosens uniformly, because a ratio still scales with each element's own `font-size`. The "24px" figure that circulates for this change is the computed value at the *base* font size only (14 × 1.714286 = 24.00); it is not an absolute at `body`, and hunting for 24px line boxes under inherited text finds nothing. Verify before reasoning about it:

```bash
grep -A 10 '^body {' dist/ODC.OutSystemsUI.css
```

#### The absolute half — pattern rules, not `body`

`body` is the ratio. **Framework pattern rules are absolute**, and that is where text genuinely clips. Nine framework rules set `line-height` directly from the token scale, which resolves to a fixed `rem`:

```css
.osui-accordion-item__title {
  font-size: var(--token-font-size-400, 1rem);
  line-height: var(--token-font-line-height-600, 1.5rem);   /* 24px, fixed */
}
```

Classic's equivalent was `line-height: 1` — a ratio. So a customer who raises `font-size` on one of these gets a line box that **does not grow with it**, and the text clips or collides with the row below. The same rule in classic would have scaled.

The affected selectors are worth knowing by name, because the customer's CSS will target them without mentioning line-height: `.btn`, `.btn-small`, `.btn-large`, `.button-group-item`, `.osui-accordion-item__title`, `.form label, [data-label]`, `.help-block, .input-helper`, `.alert .alert-message`, `.list-item-content-title`.

`.btn` is the one to watch — raising button font-size is among the most common customisations in a stylesheet, and the line box will not follow it. A further eight components expose the same fixed line-height as an `--osui-*-line-height` knob (chat message status, list item content, section title, section content, submenu item, tabs header item, timeline, wizard label); those are override points rather than breakages. List the current set with:

```bash
awk '/\{[[:space:]]*$/ {sel=buf $0; sub(/[[:space:]]*\{[[:space:]]*$/,"",sel); buf=""; next}
     /,[[:space:]]*$/ {buf=buf $0 " "; next}
     /line-height:[[:space:]]*var\(--token-font-line-height/ {print sel}
     {buf=""}' dist/ODC.OutSystemsUI.css | sed 's/^[[:space:]]*//' | sort -u
```

**Whenever a fix raises `font-size` on a framework pattern, set `line-height` in the same rule.** Use a unitless ratio, or the next token step up — never leave the absolute default in place under larger text.

**Detection pattern:** any custom rule that sets `font-size` without a corresponding `line-height`. For inherited text that is a proportional loosening and often fine; on one of the selectors above it is a clip. Recommend pairing with the matching `--token-font-line-height-*` token or a unitless number.

**The default pairing value is `1.5`, because that is what classic's `body` declared** (`line-height: 1.5`, unitless, so every element resolved it against its own `font-size`). Writing `1.5` reproduces the old computed value exactly, at any font size. Never substitute a tighter number because the text is large — `1.2` on a 40px heading looks like a reasonable choice and silently shrinks the line box by 12px.

**But confirm before assuming `1.5`.** It is the usual answer, not a safe assumption — a third-party widget, or any ancestor, may already have been overriding it. Picking a number that looks reasonable resizes the element, and the customer reports it as "this got bigger after the migration". When a paired element changes size, ask for the classic computed value:

```js
const el = document.querySelector('<selector>');
const c = getComputedStyle(el);
console.log(el.getBoundingClientRect().height, c.lineHeight, c.fontSize);
```

**`line-height: normal` is a valid pairing value and is often the right one** for badges, tags, chart labels, and anything rendered by a charting or picker library. It makes the element size from its own font rather than from the inherited ratio, which is what you want wherever the classic app was already doing that. Use it whenever the classic computed value reads `normal` — do not translate it into a number.

**`border-radius: 100%` trap.** Adding `line-height` changes the element's height, which changes its aspect ratio. A `border-radius: 100%` on a non-square element produces an **ellipse**, not a circle. After pairing `line-height`, scan the same rule for `border-radius: 100%` and replace with `border-radius: 100px` (pill shape) or `border-radius: 50%` (circle only if the element is square). This commonly affects badge/pill/tag elements like chart labels.

### Category E — Logical properties

Framework rules now use `padding-block` / `padding-inline` / `margin-inline-start` / `inset-inline-start` etc. A custom override using `padding-left` on the same element has **no specificity relationship** with `padding-inline-start` — whichever comes later wins — so a partial physical override can silently do nothing.

**Detection pattern:** custom rules targeting OSUI classes that use physical properties (`padding-left`, `padding-right`, `margin-left`, `margin-right`, `left`, `right`, `border-left`, `border-right`) where the framework now uses the logical equivalent.

**Delete obsolete `.is-rtl` mirror patches.** A rule whose only job is swapping `left` and `right` under `.is-rtl` on a framework widget was compensating for physical positioning. The new theme uses `inset-inline-start` / `inset-inline-end`, which follow `dir="rtl"` on their own. Delete the patch. Do not rewrite it as logical properties — that restates the framework and can pin the widget to the wrong side.

```css
/* OLD — manual mirror. Delete both rules. */
.is-rtl .input-with-icon.input-with-icon-right .input-with-icon-content-icon {
    left: 0;
    right: auto;
}
.is-rtl .input-with-icon.input-with-icon-left .input-with-icon-content-icon {
    left: auto;
    right: 0;
}
```

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
- **White feedback messages** — `--token-bg-info-subtle-default`, `--token-bg-danger-subtle-default`, `--token-bg-success-subtle-default`, and `--token-bg-warning-subtle-default` stay at light values. `.os-dark-theme` flips them to the generated dark palette, which is a different theme from a custom ramp. Set the four tokens in the customer's dark block so the banners match the brand with or without that class.
- **Selected nav item lost its underline** — the classic current page is `border-block-end` in `--color-primary`. The new theme clears that border and a hover fill (`--token-bg-neutral-subtlest-hover`) can cover the active item. On a dark custom header that fill stays a light grey, so the label washes out. Restore the underline on `.active` and `.active:hover`; keep the fill for non-active hover only.
- **Grey blank-slate icons** — `--osui-blank-slate-icon-color` defaults to `--color-text-disabled` (grey) in the new theme; was closer to primary in the old theme

**Detection pattern:** a dark-mode block (`:root.dark-mode`, `:root.os-dark-theme`, `body.dark`, etc.) that overrides **3 or more** `--color-neutral-*` steps. This is the signature of a ramp-flip strategy.

```
:root\.(dark-mode|os-dark-theme)[^{]*\{[^}]*--color-neutral-[0-9]+:.*--color-neutral-[0-9]+:.*--color-neutral-[0-9]+:
```

**The fix:** add explicit role overrides, mapping each role to the customer's intended neutral step — and write them at **`:root`**, not in the dark block.

The breakage is reported in dark mode, so the instinct is to fix it there. Resist that. These roles are expressed through the ramp and the ramp flips on its own, so one declaration at `:root` serves both modes. Dark-only overrides fix the reported symptom and leave light mode sitting on the framework's neutral greys — a palette the customer never chose and has never seen, because none of these roles existed in the classic theme.

```css
:root {
    /* ... the light ramp ... */

    /* ─── Role overrides (required in the new theme) ─── */
    --color-text:                var(--color-neutral-9);   /* what classic's html used */
    --color-text-subtle:         var(--color-neutral-8);
    --color-text-subtlest:       var(--color-neutral-7);
    --color-background-surface:  var(--color-neutral-1);
    --color-border:              var(--color-neutral-3);
    --color-border-subtle:       var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10);  /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);   /* link/primary hover */
    --token-icon-subtlest:       var(--color-neutral-N);

    /* Wire the customer's own surface variables to their framework roles here.
       Use whatever they named it; the old framework read it by convention. */
    --color-background-header:   var(--their-header-var);
}

:root.dark-mode,
:root.os-dark-theme {
    /* ... the ramp flip — every role above follows it automatically ... */

    /* Only what the ramp cannot express belongs here: a role that deliberately
       picks a different step than light, and dark-only literals. */
    --color-text: var(--color-neutral-10);  /* pure white rather than neutral-9 */

    /* Feedback banners. Point at a ramp step or an existing custom var.
       A hex is only for a tint that is not already declared in this block. */
    --token-bg-danger-subtle-default:  var(--existing-var); /* or a hex if no variable already holds that color */
    --token-bg-success-subtle-default: var(--color-neutral-N);
    --token-bg-warning-subtle-default: var(--color-neutral-N);
    --token-bg-neutral-subtlest-hover: rgba(255, 255, 255, 0.15);
}
```

**Verify with the symmetry audit** (Section 2). Any property left in the dark block that reads `var(--color-neutral-N)` rather than a literal is almost certainly a light-mode gap.

#### Some classes were renamed, and rules targeting them fail silently

Most of this guide is about declarations whose *value* moved. A quieter class of breakage is a selector that still looks perfectly valid but no longer matches anything, because the framework moved the class under the `osui-` prefix. Nothing in the customer's CSS looks wrong, no variable is retired, and a diff of the two bundles' selector lists is the only way to see it.

Build that list once:

```bash
grep -oE '\.[a-zA-Z][a-zA-Z0-9_-]*' classic-theme/ODC.OutSystemsUI.css | sed 's/^\.//' | sort -u > /tmp/old.txt
grep -oE '\.[a-zA-Z][a-zA-Z0-9_-]*' dist/ODC.OutSystemsUI.css          | sed 's/^\.//' | sort -u > /tmp/new.txt
comm -23 /tmp/old.txt /tmp/new.txt
```

**Extract class *tokens*, not whole selector lines.** It is tempting to pull the selector text and keep only the entries that are a single bare class, but that filter drops ~95 genuinely-removed classes on the current bundles. A class is invisible to it whenever it only ever appears in a compound selector (`.no-responsive` is never a selector on its own), and the obvious `[a-z][a-z0-9-]*` character class silently excludes every PascalCase and underscored name — which is most of what the platform generates, including `.ThemeGrid_Container`, `.ListRecords`, `.Not_Valid`, and the whole `.choices__*` family. Matching `\.[a-zA-Z][a-zA-Z0-9_-]*` anywhere in the file avoids both. This is the same command the public guide gives customers, deliberately — the two should never produce different lists.

Then intersect that list with the customer's stylesheet — **match on a word boundary, not a substring**, or `.btn` will appear to be dropped because `.btn-primary` was restructured:

```bash
comm -23 /tmp/old.txt /tmp/new.txt | while read c; do
  grep -qE "\\.$c([^a-zA-Z0-9_-]|$)" customer.css && echo ".$c"
done
```

Most of what survives is a provider swap with no consequence for the customer — `.pika-*`, `.choices`, `.carousel` were replaced wholesale when the underlying library changed, and an app that never styled them does not care. The two that matter are a class the customer's markup still produces with no rule behind it and a **rename**.

**`menu-icon-line` is the first case, and it comes up in most older apps.** The current App Template builds the hamburger from an Icon Widget; older apps build it from a `<button class="menu-icon">` wrapping three `<div class="menu-icon-line">` bars. The new theme drops the `.menu-icon-line` rule because the markup it ships for no longer emits that element — this is deliberate, not a defect. `.menu-icon` itself survives and is still styled, so nothing in the customer's CSS looks wrong while the bars silently stop rendering. Classic also set `background-color: transparent; border: none` on `.menu-icon` and the new rule sets neither, so a `<button>` additionally picks up native browser chrome. Recommend migrating the markup to the Icon Widget; offer this only as a stopgap:

```css
.menu-icon { background-color: transparent; border: none; }
.menu-icon-line {
    background-color: var(--color-neutral-8);
    border-radius: 20px;
    height: 3px;
    margin-block: 2px;
    width: 24px;
}
```

A rename is the quieter failure of the two. A real case:

```css
/* customer CSS — still valid, still parsed, matches nothing */
.progress-wizard .wizard-item-icon { background-color: var(--wizard-bg-color) !important; }
```

`.wizard-item-icon` became `.osui-wizard-item-icon`. The rule references no retired variable, has no syntax error, and carries `!important` — which is exactly what makes it hard to doubt. It reads as a rule that must be winning. It never ran.

**Rewrite against the CSS API rather than the new class name** where a knob exists (`--osui-wizard-icon-background`, `--osui-wizard-connector-color`). It is less brittle than chasing prefixes, and it usually lets the `!important` go, since a knob is consumed by the framework's own declaration rather than fighting it.

#### Do not convert a direct declaration into a CSS API variable

Replacing `background-color: transparent` with `--osui-dropdown-background: transparent` looks like the modern, correct form of the same instruction. It is not the same instruction, and the rewrite is one of the easiest ways to break an app during this migration.

A `--osui-*` variable decides what the **framework's own** declaration resolves to:

```css
/* framework */
.dropdown-container > div.dropdown-display { background-color: var(--osui-dropdown-background); }
```

It has no effect if some other rule sets `background-color` outright, because that rule wins the cascade before the variable is ever consulted. Customer stylesheets are full of such rules. A real case:

```css
/* app theme — sets the property directly, specificity (0,2,0) */
.dropdown-container > div.dropdown-display { background-color: var(--color-neutral-2); }

/* widget module — original, (0,3,0), beats it */
.dropdown-container.locale-dropdown .dropdown-display { background-color: transparent; }

/* widget module — "migrated" to the CSS API, (0,2,0) on a different property entirely */
.dropdown-container.locale-dropdown { --osui-dropdown-background: transparent; }   /* no-op */
```

The original won a specificity contest. The variable does not enter that contest at all, so the override silently disappears and the app theme's grey comes back. The symptom was that a wrapper element "vanished" — the dropdown painted its own background over the 36px circle that contained it — with nothing in either stylesheet obviously wrong.

**The rule:** when the original sets a property directly, keep it as a direct declaration at the same selector. Reach for the `--osui-*` variable only when the original was *already* relying on the framework's default — typically a property the customer never wrote, like `--osui-dropdown-list-max-height`. In the same block above, the `max-height` and popup-radius knobs are correct precisely because nothing else sets those properties.

**Sweep for it before handing off.** Any `--osui-*` line you introduced that replaced a direct declaration is suspect; check whether any other stylesheet in the app sets that property on the same element.

#### There are two primary blues, and fixing one does not fix the other

`--token-semantics-primary-base` and `--token-text-primary` are separate tokens with separate defaults (`#105cef` and `#0f54da`). Re-pointing the first at `--color-primary` fixes links, the active nav item, the dropdown checkmark and the range slider's connect — which is most of what a customer reports — so it is easy to call the problem solved. `--token-text-primary` is read a further 14 times and stays blue, most visibly as the Upload pattern's "select file" label.

After any primary re-point, sweep for the other one before declaring done:

```bash
grep -nE 'var\(--token-text-primary[,)]' dist/ODC.OutSystemsUI.css
```

Prefer the component knob where one exists (`--osui-upload-color: var(--color-text)`) over re-pointing `--token-text-primary` globally — classic coloured the upload label with body text, not with primary, so the two tokens genuinely do mean different things.

#### A role override is global — never copy a local rule up into one

Every role you declare at `:root` reaches every framework rule that reads it, which is far more than the widget that prompted you to declare it. The failure is seductive: you find a customer rule that styles one widget, notice a role that looks like it means the same thing, and promote the rule's values into the role. The widget you were looking at is already handled by the customer's own rule, so nothing there changes and the edit looks free — while dozens of widgets you never looked at quietly change.

The input roles are where this happens most, because customers very often restyle text inputs and the role names read as if they are about text inputs:

```css
--color-background-input   /* read 17× */
--color-border-input       /* read 46× */
```

Those reads include **checkbox, radio, switch, wizard step icon, datepicker and the dropdown popup**, not just `.form-control[data-input]`. A customer rule like `background: var(--color-neutral-2); border: none;` is a normal thing to want on a text field and a disaster as a role: promoted, it strips the ring off every checkbox and radio in the app, and the customer reports "checkboxes disappeared" with nothing in their own CSS to explain it.

Map each role to **what classic gave the widgets that read it**, not to what the customer's narrowest rule says. Then leave the customer's rule where it is — it keeps winning on its own selectors, which is exactly the scope they wanted.

Before declaring any role, count its reads and look at what they are:

```bash
grep -nE 'var\(--color-border-input[,)]' dist/ODC.OutSystemsUI.css
```

If the list contains a widget the customer's CSS never mentions, the role is the wrong place for that value.

**Icons.** Framework icons moved from `--color-neutral-6` to `--token-icon-subtlest`. App icons with class `.icon` do not read that token; set `color: var(--color-neutral-N)` on `.icon`, and `color: inherit` on icons inside buttons, colored cards, and other blocks that set their own text color. When the icon color follows the flipped ramp, use the same `--color-neutral-N` in both modes. Use a different step in dark only when the hex must stay the same, because a flip moves that hex onto another step. Do not paste the hex.

**A color that must not flip.** The same rule applies to text or a fill on a custom block. Set `color` and, when descendants read it, `--color-text` to the `--color-neutral-N` that holds that hex in that mode. A single `var(--color-neutral-N)` on `:root` changes after the dark ramp flip.

The exact neutral step for each role depends on the customer's palette. Map the four `--token-bg-*-subtle-default` feedback tokens to that palette too — the generated `.os-dark-theme` values are a different dark theme, so adding the class does not reproduce a custom brand. Use the highest-contrast readable step for text (usually the one that flipped to near-white) and the closest-to-background step for surfaces/borders. A feedback tint that is not a ramp step and not an existing custom variable keeps one hex; that hex is the definition.

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

**Full tables: [`references/variable-mapping.md`](references/variable-mapping.md).** Read that file before rewriting any retired name — it covers the semantic colour helpers, shadows, font sizes, spacing, border sizes, font weights, the extended palette, semantic light shades, and border radius, with the exceptions that are easy to get wrong (the three `--background-color-*` hooks that survived, and `--border-color-primary` mapping to the border role).

Two rules that apply to every row and are worth carrying without opening the file:

- **A retired name does not error, it drops.** The declaration is discarded silently, so the symptom is "slightly off", never a console message.
- **Do not paste a computed hex.** Resolve to the role or `$token-*` that holds the value, so the result still follows the theme and the dark-mode flip.

## 4. Still valid — no change needed

These variable families are **not retired** and work identically in the new theme (though some resolve to different values — see Section 8):

- **Brand/status colors:** `--color-primary`, `--color-secondary`, `--color-error`, `--color-warning`, `--color-success`, `--color-info`
- **Neutral ramp:** `--color-neutral-0` through `--color-neutral-10` (values changed — see Section 8 neutral trap)
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

Scanning the customer's CSS only finds rules they wrote. The new theme also changes framework defaults on widgets their sheet never mentions. Step 2g inventories the widgets the app actually uses and walks the `references/widget-catalog.md` against that set, even when the search in Section 1 comes back empty. Do not wait for the customer to name each one.

### Scope — an OutSystems app has CSS in more than one place

Before starting, establish **which** stylesheets are in scope. A Reactive or Mobile app holds custom CSS in at least four places, and the retired-variable categories break identically in all of them:

| Location | In Service Studio | Typical content |
|---|---|---|
| Theme stylesheet | Theme → Style Sheet | `:root` palette overrides, app-wide rules — usually the bulk |
| Screen stylesheet | Screen → Style Sheet | Screen-scoped rules |
| Block stylesheet | Web Block → Style Sheet | The widget's own sizing and colour, often one or two declarations |
| Inline `<style>` | Expressions / HTML elements | Rare but it happens |

**Migrating only the theme stylesheet leaves the rest broken**, and the failures are confusing because they surface as a widget that ignores its own styling. The classic symptom is a size or colour reverting to an inherited value: a block sets `font-size: var(--font-size-h6)`, the variable is retired, the declaration drops, and the element silently inherits from its parent instead. The customer reads that as "the icon got smaller", not "a block stylesheet references a dead variable".

**Collect them all before starting Phase 1.** Ask for every stylesheet up front rather than migrating what you were handed and mentioning the rest at the end — a partial migration is worse than none, because the app half-works and the remaining failures are attributed to the migration itself. Ask directly:

> Besides the theme stylesheet, please also share the Style Sheet of any screen or web block that has custom CSS. Screens and blocks with no custom CSS can be skipped. If you're not sure which have any, search your module for `var(--` and send every file that matches.

Give them this to find candidates, including in modules they may not think of (shared UI modules, icon/widget libraries, theme extensions):

```
var\(\s*--(space|font-size|shadow|border-size|background-color|text-color|border-color|font)-
```

A file with no match on that pattern and no `.osui-` or `[data-` selector is almost certainly safe to skip; say so rather than asking them to send everything.

If they can only provide some, proceed — but name the ones still outstanding in the Phase 3 handoff, and do not describe the migration as complete.

**A dependency's stylesheet breaks the app, not the dependency.** The sharpest version of this is a shared widget module — a locale switcher, an icon library, a header block. Its CSS is not in the customer's module and may not even be theirs to edit, but its failures render inside *their* screens. Check the DOM before concluding a widget is unstyled: `data-block="SomeModule.SomeWidget"` on an ancestor means the rule you are looking for lives in `SomeModule`, and the right repair is to migrate that module rather than to pile a local override on top of it. Write the override if the customer needs the screen to look right today, but label it as a stopgap and name the module.

**Watch for "the framework rule did not change, the rule containing it stopped applying."** The dependency case usually presents this way: measure the widget in both bundles, find the box metrics identical, and conclude nothing broke — when what actually broke is a *different* stylesheet's rule that was holding it in place. A flex item is the common shape, because `min-width: auto` stops it shrinking below its min-content width, so the moment a `min-width: 0` or a `padding: 0` from elsewhere stops applying, the item bursts out of its container and paints over it. The symptom reads as "the wrapper disappeared" when the wrapper is still there and merely covered.

**Diagnosing one from the browser.** Walk the ancestor chain in the old app and the new one and compare the computed property at every level:

```js
(() => {
  const el = document.querySelector('<selector>');
  const out = [];
  for (let n = el; n && n.tagName !== 'BODY'; n = n.parentElement) {
    out.push({ tag: n.tagName, cls: n.className, value: getComputedStyle(n).fontSize });
  }
  console.table(out);
})();
```

If the two chains are identical except that one element lost its value and now matches its parent, the declaration was **dropped at that element** — a dead variable in whatever stylesheet owns it. That is a different problem from a cascade you need to out-specify, and the fix belongs in the owning stylesheet, not in a more specific rule in the theme. Identify the owner from the class: if the theme stylesheet has no rule for that class at all, it is a block or screen stylesheet that was never migrated.

The resolved value usually names the culprit. A size that reverted to an inherited one, where the expected value matches an A1 variable exactly (18px is `--font-size-h6`, 1px is `--border-size-s`, and so on), identifies the dead reference without needing to see the stylesheet. Spacing values are **not** a tell here — `--space-*` still resolves, so a wrong 8px or 24px has some other cause.

### Working files — one per source stylesheet

At the start of the migration, write **each** stylesheet the customer provided to its own temporary working file in the **system temp directory** (works on macOS, Linux, and Windows):

```
<system-temp>/osui-migration-<name>.css
```

Resolve the temp directory using the platform's standard location:
- **macOS / Linux:** the value of `$TMPDIR` (typically `/var/folders/.../T/` on macOS, `/tmp` on Linux)
- **Windows:** the value of `%TEMP%` (typically `C:\Users\<user>\AppData\Local\Temp`)

Determine it at runtime with: `node -p "require('os').tmpdir()"` or `python3 -c "import tempfile; print(tempfile.gettempdir())"`.

`<name>` must identify **where the CSS came from**, because the customer has to paste each file back into a different place in Service Studio. Use the module or artefact name, not a generic label — `osui-migration-MyAppTheme.css`, `osui-migration-SharedWidgets.css`, `osui-migration-CheckoutScreen.css`. A single `osui-migration-custom.css` is only acceptable when there is genuinely one stylesheet.

These files are the single source of truth throughout the process:
- Phase 1 writes the auto-fixed CSS to each of them.
- Each Phase 2 step reads them, applies accepted changes, and writes them back.
- Phase 3 reads the final versions for the user.

Tell the user every working file path as you create it, and keep a running note of which Service Studio artefact each one maps back to — that mapping is what Phase 3 hands over.

**Scan every file; review across files.** Phase 1 runs over all of them. Phase 2 stays organised by **category**, not by file: one review group covering every logical-property finding in all stylesheets beats eight short per-file reviews that make the customer re-learn the same decision repeatedly. Note the file alongside each finding so they know what they are approving:

```
Category E — logical properties (3 findings)
  MyAppTheme.css:142      padding-left  → padding-inline-start
  SharedWidgets.css:18    margin-right  → margin-inline-end
  CheckoutScreen.css:67   padding-left  → padding-inline-start
```

Cross-file findings are worth calling out explicitly, because they are invisible when reading one file at a time: the same retired variable used in several modules, a `:root` override in the theme that a block stylesheet silently depends on, or two files setting the same property on the same selector where load order decides the winner.

#### When to delete them

Until a file has been pasted into its artefact, published, and verified in **both** modes, the working file **outranks the OML** — it holds decisions the app has not received yet. Deleting at that stage loses the migration. Never clean up on the assumption that handing over the final CSS ended the job; the customer still has to apply it, and they usually come back with findings.

Once applied and verified, the polarity flips and a surviving file becomes a liability:

- The customer pastes a **stale version** over newer work. The file still looks like valid migrated CSS, so nothing signals that it predates the last few fixes.
- An agent resuming the session reads it as current and **re-proposes work already applied**.

So delete each working file at the point its artefact is published and verified by the Phase 4 pass — not before, not at the end of a conversation. Delete any `.bak` or intermediate copy as soon as it is superseded; nothing references it and it carries the staleness risk with none of the value.

**Two things to do before deleting.** Ask first — the file may be the only record of *what the migration changed*, which is often wanted for a ticket or a review. And if it is wanted, move it somewhere durable rather than leaving it: **the system temp directory is sized for a single sitting.** macOS purges items from `$TMPDIR` after a few days without access, and a migration that spans a weekend can come back to missing working files. For anything expected to run longer than a day, say so up front and write the files into the repo or a project folder instead.

### Phase 1 — Scan and auto-fix

Scan **every** stylesheet for all breakage categories, classify each finding as `auto-fixable`, `review-needed`, or `manual`, then **immediately apply all auto-fixable replacements** and write the corrected CSS back to each working file.

Report the scan as a per-file tally before diving into review, so the customer can see where the work is and spot a file they forgot to send:

| File | Retired vars | Component API | Logical props | Line-height | Other |
|---|---|---|---|---|---|
| MyAppTheme.css | 55 | 12 | 8 | 9 | 3 |
| SharedWidgets.css | 3 | 1 | 0 | 1 | 0 |

A file that comes back all-zero is worth a sentence of its own — it means that stylesheet needs no change, which is useful information rather than an omission.

#### Auto-fixable — apply without asking

These are mechanical, safe, one-to-one replacements with no ambiguity:

- **Retired variable swaps (Category A1):** every `var(--border-size-s)` → `var(--token-border-size-025, 1px)`, every `var(--font-size-xs)` → `var(--token-font-size-300, 0.75rem)`, every `var(--font-regular)` → `var(--token-font-weight-regular, 400)`, etc. Use the full mapping table in `references/variable-mapping.md`, keep the literal fallback, and confirm each token name exists. **`var(--space-*)` is not on this list** — it still resolves, and sweeping it is the single largest source of pointless churn in a migration.
- **Missing `--color-primary-active` (Category C):** if `:root` overrides `--color-primary` and `--color-primary-hover` but not `--color-primary-active`, add `--color-primary-active` with the same value as `--color-primary-hover` (safe default — pressed state matches hover).

**Output:** write the migrated CSS back to each working file with `/* MIGRATED: ... */` comments on each changed line. Show a summary of what was changed (not the full CSS — that's in the file). Example of a migrated line:

```css
.btn {
    border-radius: var(--border-radius-rounded);
    font-weight: var(--token-font-weight-regular, 400); /* MIGRATED: was --font-regular */
    font-size: 14px;
    white-space: nowrap;
}
```

#### What qualifies as auto-fixable

A replacement is auto-fixable **only** when:
1. The mapping is a single, unambiguous entry in `references/variable-mapping.md` (one old var → one new var).
2. The replacement produces the **same rendered value** (same px/color/weight). Font-size swaps where the new token renders a **different size** (h1–h3) are NOT auto-fixable.
3. The replacement does not change the selector, property name, or specificity — only the value.

Everything else goes to Phase 2.

#### Also report — pre-existing CSS bugs

These are not theme breakage, so never auto-fix them, but a migration pass is when someone finally reads the whole stylesheet. List them with the Phase 1 summary as a separate "unrelated bugs found" group and let the user decide.

- **A bare color in a `border` / `outline` shorthand** — `border: var(--color-green)` is invalid, so the browser drops the whole declaration and the element has no border at all. Usually the author meant `border-color`.
- **A class selector missing its leading dot** — `requeststatus-tag { … }` targets an element type that does not exist, so the rule never applies. Compare against the neighbouring selectors to confirm it was meant to be a class.
- **A property that lost to a later duplicate** in the same rule, and vendor prefixes with no unprefixed fallback.

### Phase 2 — Interactive review (one group at a time)

Present review-needed findings **one category at a time**. Show the table for that category, ask the user, **wait for their response**, apply their choices, then move to the next category. Never present multiple categories in the same message.

The order is intentional — most impactful / most broken first:

#### Step 2a — Component CSS API overrides (Category B)

For each direct visual override, look up the `--osui-*` knob in `src/scss/`. Include both `.osui-*` rules and the legacy selectors in the Category B table (dropdown, input, wizard, popup). A renamed class is still a finding: retarget it in the proposed replacement. Apply the "when the lookup does not give a clean swap" rules in that table (unused knob, `display: none` pseudo, no knob). Present a table with before/after for each finding. Ask: "Should I replace these with the CSS API variables? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the relevant working files. Then proceed to Step 2b.**

#### Step 2b — Font-size / line-height pairing (Category D)

For each `font-size` without `line-height`, present the rule and suggest a `line-height` value. Skip icons (`.icon` class or icon-like context). Ask: "Should I add line-height to these? (yes/no/pick which ones)"

**Suggest `1.5` at every font size.** That is what classic's `body` declared, unitless, so it reproduces the old computed value exactly for any element — see Category D. There is no size bracket to apply and no reason to tighten the value as text gets larger: a heading was `1.5` in classic too, and `1.2` on a 40px heading silently removes 12px of line box.

The only values that are not `1.5`:
- **`normal`**, where the classic computed value reads `normal` — common for badges, tags, chart labels, and anything a third-party widget renders. Check before assuming.
- **A measured value**, where an ancestor or library was already overriding the inherited ratio. Measure it; do not estimate it.

If you cannot measure and have no reason to think an ancestor overrode it, use `1.5` and say that it is unverified.

**Wait for the user's response. Apply their choices to the relevant working files. Then proceed to Step 2c.**

#### Step 2c — Physical vs logical properties (Category E)

For each physical property on an OSUI/framework selector, present the logical equivalent. Show which `.is-rtl` rules become unnecessary after conversion. Separately, list `.is-rtl` rules that only swap `left` and `right` on a framework widget the new theme already positions with logical properties (`.input-with-icon` is the usual case) and propose deleting them. Ask: "Should I convert these to logical properties, and delete the obsolete RTL patches? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the relevant working files. Then proceed to Step 2d.**

#### Step 2d — Dark mode class (Category C, if applicable)

If the CSS uses a dark-mode selector other than `.os-dark-theme`, present the options:
- **Option A:** Keep the custom selector as-is (app manages its own dark mode).
- **Option B (recommended):** Add `.os-dark-theme` alongside the custom selector to benefit from the framework's dark token overrides.

**Why Option B matters.** The framework ships ~447 dark-mode `--token-*` overrides scoped under `.os-dark-theme`. These cover feedback messages (`--token-bg-info-subtle-default`, `--token-bg-danger-subtle-default`, …), input backgrounds, surface colors, shadow colors, state overlays, and many component internals. Without `.os-dark-theme`, all of these stay at their light-mode values — producing white feedback messages, light inputs, and other light-on-dark glitches. Adding `.os-dark-theme` alongside the customer's class (e.g. toggling both `.dark-mode` and `.os-dark-theme` on `<html>`) fixes these automatically without needing individual token overrides.

If the customer chooses Option A, flag that they will need to manually override every `--token-*` that their dark mode exposes (feedback messages, dropdowns, inputs, etc.). This is significantly more work than adding the class.

**Option B is not a CSS change.** Nothing in the stylesheet can add the class — it has to be toggled at runtime, in whatever action already toggles the customer's own dark class. Do not try to solve it here and do not block on it. Record it as a **manual step** and carry it to the Phase 3 handoff, which has the client action, the code, and the traps.

In the same step, check button contrast. If the dark block makes `--color-primary` light (directly, or because it points at a neutral step that flips light), propose setting `--osui-btn-primary-color` **on `.btn-primary`** (not on `:root` — see Category C note). Propose `--osui-btn-color: var(--color-text-dark)` on `.btn.background-white` and other buttons whose fill stays light. A transparent outlined button on a dark surface instead gets `--osui-btn-background: transparent`, `--osui-btn-color`, and `--osui-btn-border-color` set to the light text step.

Ask: "Which dark-mode approach do you want, and should I apply the button-label fix?" If they pick Option B, note it for the Phase 3 handoff and move on — do not stop to work through the wiring now.

**Wait for the user's response. Apply their choice to the relevant working file. Then proceed to Step 2e.**

#### Step 2e — Redeclared palette colors (Category A)

If the sheet declares a retired family base (`--color-red`, `--color-green`, or another `--color-{family}` with no shade) and uses it, propose the alias from `references/variable-mapping.md`: keep the hex on `--color-error` / `--color-success`, point the old name at that role, and set `--osui-btn-error-*` / `--osui-btn-success-*`. Repeat it in the dark block when that block defines its own hex. Shaded names stay in this step too, with the extended-palette token shown before applying, because the hex changed.

Ask: "Should I alias these palette colors? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the relevant working files. Then proceed to Step 2f.**

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
| `--token-icon-subtlest` | `var(--color-neutral-N)`. Same step in both modes when the icon follows the flip; a different dark step only when the hex must stay the same | Framework icons. Also set `.icon { color: var(--color-neutral-N) }` — plain icons do not read this token. Do not paste the hex |
| `--token-bg-info-subtle-default` | `var(--color-neutral-2)` | Info feedback banner. Generated `.os-dark-theme` is a different palette |
| `--token-bg-danger-subtle-default` | `var(--existing-var)` or one hex | Error feedback banner. Hex only when no variable already holds that color |
| `--token-bg-success-subtle-default` | `var(--color-neutral-N)` or one hex | Success feedback banner |
| `--token-bg-warning-subtle-default` | `var(--color-neutral-N)` or one hex | Warning feedback banner |

Also check whether any custom variables need wiring to framework roles in the `:root` (light) block too (e.g. `--color-background-header: var(--header-color)`).

Ask: "Should I add these role overrides to the dark block? (yes/no/pick which ones)"

**Wait for the user's response. Apply their choices to the relevant working files. Then proceed to Step 2g.**

#### Step 2g — Framework defaults the custom CSS never mentioned

A scan of the customer's CSS only finds rules they wrote. These are changes to framework defaults, so they fire on widgets the sheet never mentions. Drive this step from an inventory, not from the search results.

**Build the inventory first.**

1. **From the stylesheet** — every framework selector the sheet touches, including ones it only restyles lightly.
2. **From the module**, when an OML or the running app is available — every widget the app places and never restyled. With the OutSystems CLI: `oml query <file> -` with `Root { MobileFlows { Name Nodes { Name } } }` for the screen list, then read a screen's widgets. A widget that is placed but unstyled still renders with the new defaults.
3. If neither is available, ask which patterns the app uses, and offer the catalog list.

Then take the `references/widget-catalog.md` rows for the inventoried widgets only. **Lead with each row's Bucket.** `Breaks` and `Collides` rows are proposed as fixes; `Preference` rows are presented as "this looks different on purpose — here is the revert if you want it", with no recommendation to apply. For a `Mixed` row, propose only the breaking half and list the rest as optional. Group the `Preference` rows into a single message at the end rather than asking about each one — they are the bulk of the catalog, and walking them individually turns a migration into a redesign review.

Propose one widget at a time, wait, apply, move on. After each apply, tell the customer to reload the affected stylesheets and compare that widget with the classic app in **both** modes.

Ask, per widget: "The classic app shows X. The new theme shows Y. Should I restore the classic behavior? (yes/no)"

**Color resolution — apply to every value written in this step and Step 2f.**

1. Find the hex in the light ramp and in the dark ramp.
2. If one `--color-neutral-N` holds it in that mode, use `var(--color-neutral-N)`. Do not paste the hex.
3. If the color should follow the flip, it is the same step in both modes.
4. If the hex must stay the same, light and dark name different steps, because the flip moved it.
5. A hex is only for a tint that is not already a variable in that block.

**Was the classic rule actually visible?** Before restoring classic behaviour, resolve what it rendered *in this customer's palette*, not what it says. A rule can exist and still be a no-op: classic nav hover sets `color: var(--color-primary)`, and in a palette where `--color-primary` equals the menu's resting text colour, hovering changed nothing. Restoring such a rule as something visible — a fill, a border, a weight — invents a state the app never had, and the customer reports it as a new bug. When the classic value and the resting value resolve to the same thing, the correct restoration is to suppress whatever the new theme added.

**Diagnose from the DOM, not from the stylesheet.** When a visual difference cannot be traced to a rule, stop guessing selectors and ask the user for the element. Guessing burns a round per attempt and silently writes rules that match nothing. Ask them to paste the element's `outerHTML`, or to run an ancestor walk:

```js
const el = document.querySelector('<selector for the thing that looks wrong>');
for (let n = el, i = 0; n && i < 6; n = n.parentElement, i++) {
    const c = getComputedStyle(n);
    console.log(i, n.tagName, '|', n.className.toString().slice(0, 70),
                '| color:', c.color, '| background:', c.backgroundColor,
                '| font-family:', c.fontFamily.slice(0, 40));
}
```

The computed values identify which ancestor the element inherits from, `font-family` reveals a custom icon font, and a `background` of `rgba(0, 0, 0, 0)` on something that looks filled means the user was hovering it when they took the screenshot.

**Wait for the user's response. Apply their choice to the relevant working file.**

**If a widget turns out to differ in a way the catalog does not list, add a row to `references/widget-catalog.md`.** Do not leave the fix only in the customer's stylesheet — the next migration will miss it. Phase 5 covers where the finding goes and how it reaches the public guide.

### Phase 3 — Final output

After the user has responded to **all** review groups:
1. Read every working file.
2. Remove the `/* MIGRATED: ... */` comments (they were only for review).
3. Write the clean final versions back.
4. Hand over a table mapping each working file to **where it has to be pasted**, since the customer is now editing several artefacts in Service Studio rather than one:

| Working file | Paste into | Changes |
|---|---|---|
| `…/osui-migration-MyAppTheme.css` | MyApp → Theme → Style Sheet | 87 |
| `…/osui-migration-SharedWidgets.css` | SharedWidgets → `IconBlock` → Style Sheet | 5 |

   Name any stylesheet the customer never provided, and say plainly that those are still un-migrated. Do not call the migration complete while any remain.
5. List the **`Preference` findings not applied**, separately from the migration itself — what now looks different, and the revert for each. This is the part of the new theme the customer is actually adopting, so it is a deliverable, not a leftover. Keeping it out of the stylesheet and in the handover is what stops a migration from quietly becoming a re-skin back to classic.
6. Print the **manual steps** below — the work that cannot be done by editing CSS. Collect these as they come up during Phase 2 and list only the ones that actually apply.

**Do not delete the working files here.** Phase 3 hands over CSS; it does not mean the app has it. Keep them until each artefact is published and verified — that is Phase 4 — then clean up per *When to delete them* above.

#### Manual steps outside the stylesheet

These are app changes in Service Studio / ODC Studio, not stylesheet edits. The migrated CSS will not behave correctly until they are done, so state them explicitly at the end rather than assuming the customer infers them from the review.

**Always:** replace **every** migrated stylesheet in its own artefact and publish. Nothing below is observable until this happens, and a block or screen stylesheet left on the old version will keep producing symptoms that look like the theme migration failed. Publishing the theme alone is the most common reason a customer reports "it's still broken".

**Wire `os-dark-theme`** — when Step 2d chose Option B. Call the framework's **`SetDarkTheme(IsDark)`** client action, which adds and removes `os-dark-theme` on `document.documentElement`, from wherever the app already toggles its own dark class. If the customer prefers a single JavaScript node:

```js
const root = document.documentElement;
if ($parameters.IsDarkMode) {
    root.classList.add('custom-dark-class', 'os-dark-theme');
} else {
    root.classList.remove('custom-dark-class', 'os-dark-theme');
}
```

Four things go wrong when customers write this by hand. If they paste their existing action, check all four:

1. **One string with a space in it throws.** `classList.add('a b')` raises `InvalidCharacterError` and applies nothing, so the toggle fails with no visible error. Each class must be its own argument.
2. **Never toggle `os-dark-mode`.** It is signal-only: the framework attaches no CSS to it and maintains it automatically from the OS `prefers-color-scheme`, as a hook for the customer to style against. Setting it by hand changes nothing visually and makes it misreport the OS setting. `os-dark-theme` is the class that does the work.
3. **Keep toggling their own class too.** Every custom dark rule in the stylesheet keys off it. An action that switches to `os-dark-theme` alone silently drops all of their own dark styling.
4. **`<html>`, not `<body>`.** The `--color-*` roles resolve on the root element; tokens set lower down arrive too late. See Section 6.

Warn them what to expect: areas that looked stuck in light mode all flip the first time this runs. That is the fix landing, not a new bug. Any token patches already written into the dark block become redundant but stay harmless, because `:root.custom-dark-class` outranks `.os-dark-theme`. Offer to remove the dead patches in a follow-up, only after they confirm the class is live.

**Load an icon library** — when Step 2g restored a widget whose new default renders a glyph the classic one did not, such as the dropdown's selected-row checkmark. These read `--osui-icon-check` and `--osui-icon-font-family`, and render as an empty box if no library is configured.

**Anything else surfaced during Phase 2** that is a module change rather than a CSS change — a renamed asset path, a widget that must be swapped in the screen, a theme setting. Add it here rather than leaving it in the middle of a review step where it will be lost.

### Phase 4 — Verify in the running app

Phase 3 hands over CSS. This phase is what turns *handed over* into *verified*, and it is the trigger for deleting the working files — until it completes for an artefact, that artefact's working file still outranks the OML.

Run it **per artefact**, as each one is pasted in and published, not once at the end. A customer who publishes four stylesheets and then looks at the app cannot tell which one caused what.

**1. Ask for screenshots.** This pass cannot be run by reasoning about CSS. Request the same screen from the migrated app and the classic app in **both** modes, and ask for the interaction states separately — hover, selected, and disabled are where framework-default changes concentrate, and a resting screenshot shows none of them.

**2. Walk the Step 2g inventory, not the screen.** You already built the list of framework widgets this app places; go through it. A widget that looked right during review can still be wrong now, because Phase 2 verified each proposed fix in isolation and this is the first time all of them are applied together.

**3. Check geometry, not just colour.** Colour differences announce themselves. Geometry ones survive a side-by-side glance, and three questions find most of them:

- **Is it the right shape?** A circle that became an oval, a square that became a rectangle. Suspect this wherever the customer's CSS sets one dimension as a **percentage** and inherits the other in pixels — the two stop tracking each other the moment the framework resizes the box they resolve against, and the new theme resized many of those boxes.
- **Is it centred?** A mark positioned by a vendor or framework rule is centred against *that* rule's box. Change the element's size or its border width and the mark stays where it was while the box moves out from under it. Border width counts: with `box-sizing: border-box` it sets the padding box that percentages and absolute positioning resolve against.
- **Is it sized consistently with its neighbours?** An item whose padding you removed is now shorter than the ones you left alone.

**4. Apply the false-positive check before writing anything.** Everything in *Not every difference from the classic app is the theme* applies here and matters more, because the customer is now looking at a live app where every difference feels like a regression.

**5. Say what you could not verify.** Screens the customer did not send, modes they did not toggle, and states they did not exercise are unverified — not passed. List them. The pass is complete when the inventory is covered, not when nothing was reported.

Once an artefact's widgets are covered in both modes, that artefact is verified: delete its working file per *When to delete them* above. The migration is not finished, though — Phase 5 is.

---

### Phase 5 — Write back what this migration taught you

**A migration that ends when the customer's CSS is fixed has thrown away its most valuable output.** Every real app exercises combinations no one anticipated, so a finding that cost an hour here should cost the next migration nothing. This phase is not optional bookkeeping — the skill is only as good as the last migration that fed it.

Record a finding if it is a fact about the **framework**: a widget whose default moved, a variable that resolves differently than documented, a selector that no longer matches. Do not record anything about the customer's own code, their palette, or their app's structure — those belong in the migration report, not here.

**1. Fix it in this skill first.** The skill is the source of truth for migration facts; the public guide is downstream of it.

| What you learned | Where it goes |
|---|---|
| A retired variable's replacement is wrong or missing | `references/variable-mapping.md` |
| A widget differs in a way the catalog does not list | `references/widget-catalog.md` |
| A detection pattern missed something, or a phase needs a new step | this file |

**2. Push it to the customer-facing guide.** `THEME-MIGRATION-GUIDE.md` restates these facts for customers who migrate without an agent, and it goes stale silently — a wrong value there reads exactly like a right one.

```bash
npm run docs:migration            # copies the mapping tables into the guide
npm run docs:migration -- --check # verifies without writing; use this first
```

The sync moves the tables in `references/variable-mapping.md` and nothing else. **Three things it cannot do, which you must handle by hand:**

- **Prose.** The guide addresses a customer in their own app; this skill addresses you in the repo. The same fact is written differently on purpose — compare the spacing sections, where the guide offers a `getComputedStyle` check to run in the browser console and `references/variable-mapping.md` offers a `grep` against `dist/`. Write the customer's version yourself; do not paste this one.
- **The widget catalog.** The guide's *Framework defaults that changed* is an editorial projection of `references/widget-catalog.md` — bucket folded into the widget name, `Classic` and `New default` condensed into one prose cell. It is not generated. Add the row in both places.
- **Recipes.** Nothing checks these, so they are the easiest to leave half-done. If a fix needed a selector or a declaration that the guide's version of the same recipe lacks, add it there by hand — and compare the whole recipe, not just the line you changed. Both documents have carried a recipe that was quietly narrower than its counterpart.

**3. Say what you changed.** List the skill edits at the end of your migration report, so the person reviewing the CSS can also review the claim you are about to make permanent.

---

## 8. Same name, new value (Category F)

These variables still exist — overrides still apply — but without an override they now resolve to a **different colour**. Nothing to change in the CSS; flag these so the customer understands unexpected visual diffs.

Key changes:

| Variable | Old | New |
|---|---|---|
| `--color-primary` | `#1068eb` | `#105cef` |
| `--color-primary-hover` | `#295fd6` | `#0f54da` |
| `--color-primary-selected` | `rgba(20,110,245,0.12)` | `#0d4bc3` — **now solid, not translucent** |
| `--color-secondary` | `#303d60` | `#383e45` |
| `--color-error` | `#dc2020` | `#e0243a` |
| `--color-warning` | `#e9a100` | `#ffd600` |
| `--color-success` | `#29823b` | `#4aae83` |
| `--color-info` | `#017aad` | `#105cef` — info is now blue-primary |
| `--color-background-body` | `#f3f6f8` | `#ffffff` |
| `--border-radius-soft` | `4px` | `8px` — doubled |

> **`--color-primary-selected` changed meaning.** It used to be a translucent wash for row backgrounds. It is now a solid pressed-state colour.

### The neutral trap

`--color-neutral-0` through `-10` survived, but the scale was re-based and **`--color-neutral-0` is no longer white** — it resolves to `#f6f7fa` via `--token-primitives-neutral-100`, not `#ffffff`.

The `.text-neutral-0` and `.background-neutral-0` utility classes read that same variable (`color: var(--color-neutral-0)` and `background-color: var(--color-neutral-0)` in the shipped bundle), so they moved with it. There is no divergence between the variable and the classes to work around — everything that named neutral-0 shifted together.

If the customer used `var(--color-neutral-0)` or either utility class to get pure white — text on a coloured background is the usual case — switch to `--color-text-inverse` or `--token-primitives-base-white`.

**The root text color moved off the ramp.** `html` was `color: var(--text-color-neutral-9, var(--color-neutral-9))` and is now `color: var(--color-text)`, which resolves through tokens that never reference a neutral. That single line is why re-pointing `--color-neutral-9` no longer moves body text, and it is the mechanism behind Category H. When the customer wants body text to move, set `--color-text`.

---

## 9. Utility classes (Category G)

Every utility class kept its name (`.shadow-m`, `.margin-base`, `.font-size-h1`, `.background-red-lightest`, etc.) and still ships. What changed is what they read — they now inline the token directly instead of going through the old variable:

```css
/* before */
.shadow-m { box-shadow: var(--shadow-m); }

/* now */
.shadow-m { box-shadow: var(--token-elevation-2, ...); }
```

> **Overriding the old variable no longer reskins the class.** Setting `--shadow-m` at `:root` used to change every `.shadow-m` element. It does nothing now — override `--token-elevation-2` instead. Same for `--font-size-*` → `--token-font-size-*`.
>
> **`--space-*` is the subtle one.** It still resolves, so the customer's own rules reading it are fine — but no framework CSS rule reads it any more, so setting `--space-base` at `:root` no longer moves `.margin-base` or anything else the framework ships. The one exception is Gallery, which writes `var(--space-<ItemsGap>)` inline at runtime (`references/variable-mapping.md`). The variable works; it just stopped being a theming lever for everything except that. Override `--token-scale-400` to move the utilities.

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

One switch covers most of it:

```css
:root { --border-radius-default: 0; }    /* every tier slot square */
:root { --border-radius-default: 12px; } /* every tier slot softer */
```

This reaches the seven `--border-radius-{2xs…2xl}` tier slots only. The three legacy roles — `--border-radius-none`, `-soft`, `-rounded` — resolve straight to their tokens and ignore it, and `soft` is the one customer CSS reads most. Set those explicitly as well; see the border-radius section above.

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

The classic top menu marks the current page with an underline, `border-block-end: var(--token-border-size-050) solid var(--color-primary)`, not a filled pill. The new theme clears that border (`border-block-end: transparent` on `.layout:not(.layout-side) .app-menu-links a.active`, and `border-block-end: none` under `.header-navigation`) and paints a hover fill. On a dark custom header that fill stays a light grey, so the label washes out.

**Do not add a hover fill.** Classic hover was `color: var(--color-primary); text-decoration: none;` and nothing else — no background. In many customer palettes `--color-primary` also equals the menu's resting text colour, so classic hover was a visual no-op. Painting a fill to "restore" it invents a state the app never had. Clear the background on hover, and mark only the current page.

**Restoring the border is not enough — the link's box changed too.** The new theme turns each header link into a centred pill:

```scss
.header-navigation .app-menu-links > a {
    align-self: center;                 // classic stretched to full header height
    border-block-end: none;             // classic: 2px, transparent until .active
    border-block-start: none;           // classic: 2px transparent, for balance
    border-radius: $token-border-radius-200;
    padding-block: $token-scale-200;    // 8px  — classic had none
    padding-inline: $token-scale-300;   // 12px — classic had none
}
```

So an underline put back on that box renders **under the label instead of on the header's bottom edge**, and **24px wider than the word**. Customers describe this as "the highlight is in the wrong place and too long", which sounds like a styling preference and is really a geometry change. Undo the box on *all* the links, not just the active one, or the active link ends up a different size from its neighbours:

```css
.desktop .header-navigation .app-menu-links > a {
    align-self: stretch;
    border-block-start: var(--token-border-size-050, 2px) solid transparent;
    border-radius: 0;
    margin-inline: 0 var(--token-scale-400, 16px);
    padding-block: 0;
    padding-inline: 0;
}
```

Keep the transparent top border: classic carried one so active and inactive links stayed the same height and the labels did not shift.

**The `margin-inline` is not optional, and this is the trap.** The same framework rule sets `margin-inline: $token-scale-025` (1px) at specificity 0-3-0, which outranks any `margin-*` utility class the app puts on the link — `.margin-right-base` is 0-1-0. So in the new theme those utilities are already dead and the entire visible gap between items is the `padding-inline` you just removed. Take the padding away without putting a margin back and the links collide. Classic set no margin on the link at all, which is why the app's utilities worked there and why nobody noticed they had stopped.

**Restate the utilities per class, not as one flat value.** Links in the same menu routinely carry different utilities, and the gap between two of them is the sum of the left link's end margin and the right link's start margin — commonly from two different classes. Collapsing that to a single `margin-inline` on every link both undershoots the gap and leaves a stray margin outside the first and last item, which a flat value cannot avoid. Scope each utility at the framework's specificity instead:

```css
.desktop .header-navigation .app-menu-links > a { margin-inline: 0; }
.desktop .header-navigation .app-menu-links > a.margin-right-base { margin-inline-end: var(--token-scale-400, 16px); }
.desktop .header-navigation .app-menu-links > a.<grid-gutter-class> { margin-inline-start: <declared value>; }
```

Take the **declared** value for any platform grid class, not the computed pixel figure — grid gutters are usually percentages and often have media-query variants, so a measured px will drift at other viewport widths. Expect the declared rule to come as a *pair*: a physical `margin-left` plus an `.is-rtl` override flipping it to `margin-right`. Restate it as the single logical `margin-inline-start`, which covers both directions — the same conversion the framework applied to its own utilities, where classic's `margin-right` on `.margin-right-base` is now `margin-inline-end`. Read the rules out of the live stylesheets:

```js
[...document.styleSheets]
  .flatMap(s => { try { return [...s.cssRules] } catch { return [] } })
  .filter(r => r.selectorText && /<grid-gutter-class>/.test(r.selectorText))
  .forEach(r => console.log(r.selectorText, '=>', r.style.cssText));
```

Measure the classic gap rather than assuming — different links often carry different utilities, so one value may not fit all of them:

```js
console.table([...document.querySelectorAll('.app-menu-links > a')].map(a => {
    const c = getComputedStyle(a);
    return { text: a.textContent.trim().slice(0, 14), cls: a.className,
             padInline: c.paddingInline, marInline: c.marginInline };
}));
```

Then, on `.active` and `.active:hover`, clear the background and restore the underline. `.desktop .header-navigation .app-menu-links > a.active:hover` beats a plain `.active` rule, so include `:hover`.

```css
.app-menu-links > a:hover,
.desktop .header-navigation .app-menu-links > a:hover {
    background-color: transparent;
}

.layout:not(.layout-side) .app-menu-links a.active,
.desktop .header-navigation .app-menu-links > a.active,
.desktop .header-navigation .app-menu-links > a.active:hover {
    background-color: transparent;
    border-block-end: var(--token-border-size-050, 2px) solid var(--color-primary);
    border-radius: 0;
    color: var(--color-primary);
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

**Fix:** add explicit role overrides — and put them in `:root`, **not** in the dark block.

This is the step most often got wrong. The roles are written in terms of the ramp, and the ramp already flips, so a single declaration at `:root` serves both modes. Writing them into the dark block alone fixes dark and leaves light silently sitting on the framework's neutral greys — and since none of these roles existed in the classic theme, that grey is something the customer has never seen before and will not recognise as a default.

```css
:root {
    /* Light ramp */
    --color-neutral-0: #ffffff;
    --color-neutral-10: #101828;
    /* ... rest of ramp ... */

    /* Role overrides — required in the new theme. They belong HERE so both modes
       get them; the flip below carries them into dark at no extra cost. */
    --color-text:                   var(--color-neutral-9);
    --color-text-subtle:            var(--color-neutral-8);
    --color-text-subtlest:          var(--color-neutral-7);
    --color-background-surface:     var(--color-neutral-1);
    --color-border:                 var(--color-neutral-3);
    --color-border-subtle:          var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10);  /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);   /* link/primary hover */
    --token-icon-subtlest:          var(--color-neutral-6);
}

:root.dark-mode,
:root.os-dark-theme {
    /* The flip. Every role above follows it automatically. */
    --color-neutral-0: #101828;
    --color-neutral-10: #ffffff;
    /* ... rest of ramp ... */

    /* Only what cannot be expressed through the ramp belongs here: dark-only
       literals, and roles that deliberately pick a different step than light. */
    --color-text: var(--color-neutral-10);   /* pure white rather than neutral-9 */

    --token-bg-danger-subtle-default:  #3d1a2a;
    --token-bg-success-subtle-default: #1a3d2a;
    --token-bg-warning-subtle-default: #3d3a1a;
    --token-bg-neutral-subtlest-hover: rgba(255, 255, 255, 0.15);
}
```

Wire any app-specific surface variable to its framework role at `:root` as well, using whatever the app named it:

```css
:root {
    --color-background-header: var(--app-header-color);
}
```

Then run the light/dark symmetry audit from Section 2. Anything still declared only in the dark block that reads `var(--color-neutral-N)` is a light-mode gap, not a dark-mode fix.

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

## 11. Widget catalog — classic vs new defaults

**Full catalog: [`references/widget-catalog.md`](references/widget-catalog.md).** One row per framework widget whose defaults changed, each with its bucket and the knob that restores classic behaviour.

Load it during **Phase 2g**, and only for the widgets in the inventory you built there. Walking the whole catalog turns a migration into a redesign review — the `Preference` rows are the bulk of it, and they are presented as optional reverts rather than fixes.

## 12. What NOT to flag

- Variables that are still **declared** (see `references/variable-mapping.md`) — but "still declared" is not "unchanged". `--color-primary`, `--color-neutral-*`, and `--border-radius-soft` all survive under the same name carrying a **different value**, and those belong in Section 8 (Category F), not here. `--border-radius-soft` went 4px → 8px, so a rule reading it renders at twice the radius with nothing in the CSS to show for it. What genuinely needs no action is `--border-radius-none`, roles whose value did not move, and **the entire `--space-*` scale**, which is declared with its classic values and should be left exactly as the customer wrote it.
- Inline styles set by the OutSystems platform runtime — only flag CSS the customer authored.
- Variables inside `env()` or `calc()` wrappers that are structurally correct.
- Provider/vendor CSS (`.flatpickr-*`, `.vscomp-*`, `.splide-*`) — these are framework-owned.

### Not every difference from the classic app is the theme

Side-by-side comparison is the main way framework-default changes get found (Step 2g), and it produces false positives. Before chasing a visual delta, establish that OSUI can even cause it:

```sh
grep -rli '<library-or-class>' src/scss/ classic-theme/ dist/
```

**No match in any of the three means neither theme has an opinion about that element, so neither theme changed it.** Stop there and say so — the cause is the app, a third-party library, or the environment. Third-party widgets that render their own markup are the usual source: charts, maps, editors, and date libraries ship default `font-family`, `font-size`, and colour that they apply inline on their own container, which beats anything in a stylesheet and differs across library versions.

The same library can also emit the *same* content two different ways, so whether the app's own styling reaches it varies between two apps running identical CSS. A chart library rendering a label as SVG wraps it in a `<foreignObject>`, which contains a genuine nested `<body>` — and an app's `html, body, … { font-family: … }` rule **matches that inner body**, so the app font re-enters the subtree and overrides what the SVG was passing down. Render the same label as a plain HTML `<span>` instead and there is no `<body>` to match, so the library's inline style inherits all the way through. Identical stylesheets, opposite results. Walk the ancestor chain and read the `inline` column rather than reasoning about it.

A **typeface** difference is the specific trap, because it changes measured width *and* height and so imitates a line-height or padding bug precisely. Check the `Font` row in the element inspector on both apps before believing a box-model explanation. Two labels at the same `font-size`, `line-height`, and `padding` will still measure differently if one resolves to a different family, and no CSS mapping in this skill will account for the gap.

The same applies to anything the comparison apps do not share: different library versions, a module rename that broke an asset URL, or one app loading a font the other cannot reach. Name the difference, say it is out of scope for the migration, and move on rather than writing CSS to paper over it.
