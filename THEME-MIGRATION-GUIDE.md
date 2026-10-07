# Migrating custom CSS to the new OutSystems UI theme

OutSystems UI's styling was rebuilt on the `outsystems-design-tokens` package. If your app ships custom CSS that overrode OutSystems UI variables or targeted its classes, most of it still works — but a specific, enumerable set of things moved.

This guide is the complete inventory: **what was retired and what replaces it**, **what kept its name but changed its value**, and **the new variables that let you stop writing overrides you previously had to hand-roll**.

> **Tip:** Feed this document to any AI coding assistant (Claude, Copilot, ChatGPT, Cursor, etc.) along with your custom CSS and ask it to migrate it. The mapping tables below give the assistant everything it needs.

---

## Triage your custom CSS

Search your stylesheets for each pattern below. That tells you which sections of this guide you actually need.

| If your CSS contains… | Verdict | Go to |
|---|---|---|
| `var(--font-size-*)`, `var(--shadow-*)`, `var(--border-size-*)` | Retired — resolves to nothing | [Retired variables](#retired-variables) |
| `var(--background-color-*)`, `var(--text-color-*)`, `var(--border-color-*)` | Retired — resolves to nothing | [Retired variables](#retired-variables) |
| `--color-red-dark`, `--color-indigo-light`, any extended-palette shade | Retired + hex changed | [Extended palette](#extended-palette) |
| `--color-primary`, `--color-error`, `--color-background-body` | Still works but resolves to a different colour | [Same name, new value](#same-name-new-value) |
| `--color-neutral-0` … `-10` | Still works but scale re-based — `neutral-0` is no longer white | [The neutral trap](#the-neutral-trap) |
| A rule against `.osui-*` with `!important` or direct property overrides | Probably replaceable with a `--osui-*` variable | [Component CSS API](#component-css-api) |
| `font-size` without `line-height` | May look wrong due to line-height model change | [Line-height model](#line-height-model) |
| `padding-left`, `margin-right` etc. on OSUI classes | May silently lose cascade race against logical properties | [Logical properties](#logical-properties) |
| `.shadow-m`, `.margin-base`, `.font-size-h1` (utility classes) | Still shipped but no longer driven by old variables | [Utility classes](#utility-classes) |
| _Nothing_ — but a widget still looks different from before | The widget's own built-in defaults changed | [Framework defaults that changed](#framework-defaults-that-changed) |

---

## Retired variables

These names are **no longer declared** anywhere in the bundle. A `var(--shadow-m)` in your CSS now resolves to nothing and the declaration is dropped — this is the category that breaks silently.

A `var(--background-color-primary, var(--color-primary))` with a fallback still renders, but should be cleaned up to use the replacement directly.

### Semantic colour helpers

| Classic (retired) | Replacement | Notes |
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
| `--text-color-neutral-N` | `--color-neutral-N` | Consider `--color-text-subtle` or `--color-text-subtlest` |
| `--border-color-primary` | `--color-border-primary` | Or `--color-primary` for general use |
| `--border-color-neutral-N` | `--color-neutral-N` | Or `--color-border` / `--color-border-subtle` |

### Shadows

`--shadow-*` → `--token-elevation-*`. The new elevations are two-layer shadows, so they are similar but not identical in appearance.

| Classic (retired) | Replacement |
|---|---|
| `--shadow-none` | `none` |
| `--shadow-xs` | `--token-elevation-1` |
| `--shadow-s` | `--token-elevation-1` |
| `--shadow-m` | `--token-elevation-2` |
| `--shadow-l` | `--token-elevation-3` |
| `--shadow-xl` | `--token-elevation-4` |

### Font sizes

| Classic (retired) | Replacement | Rendered size |
|---|---|---|
| `--font-size-display` | `--token-font-size-900` | 36px |
| `--font-size-h1` | `--token-font-size-700` | 28px (was 32px — smaller) |
| `--font-size-h2` | `--token-font-size-650` | 26px (was 28px — smaller) |
| `--font-size-h3` | `--token-font-size-600` | 24px (was 26px — smaller) |
| `--font-size-h4` | `--token-font-size-550` | 22px |
| `--font-size-h5` | `--token-font-size-500` | 20px |
| `--font-size-h6` | `--token-font-size-450` | 18px |
| `--font-size-base` | `--token-font-size-400` | 16px |
| `--font-size-s` | `--token-font-size-350` | 14px |
| `--font-size-xs` | `--token-font-size-300` | 12px |
| `--font-size-label` | `--token-font-size-275` | 11px |

> **Warning:** h1–h3 are **smaller** in the new scale. A one-to-one swap changes the rendered size. Pick a different token step if you need to preserve the old size.

### Border sizes

| Classic (retired) | Replacement | Value |
|---|---|---|
| `--border-size-none` | `--token-border-size-0` | 0px |
| `--border-size-s` | `--token-border-size-025` | 1px |
| `--border-size-m` | `--token-border-size-050` | 2px |
| `--border-size-l` | `--token-border-size-075` | 3px |

### Font weights

| Classic (retired) | Replacement |
|---|---|
| `--font-light` | `--token-font-weight-300` |
| `--font-regular` | `--token-font-weight-400` |
| `--font-semi-bold` | `--token-font-weight-600` |
| `--font-bold` | `--token-font-weight-700` |

### Extended palette

All 12 families × 7 shades (`--color-red-lightest` … `--color-pink-darkest`) are **retired as variables**, and the palette itself was recoloured.

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

> **Prefer the semantic role over the family.** `--color-red` was a literal colour. Its replacement is usually `--color-error` (theme role) or `--token-bg-danger-base-default` (token). Route through the role and your CSS follows any future theme.

### Semantic light shades

| Classic (retired) | Replacement |
|---|---|
| `--color-error-light` | `--token-semantics-danger-100` |
| `--color-warning-light` | `--token-semantics-warning-100` |
| `--color-success-light` | `--token-semantics-success-100` |
| `--color-info-light` | `--token-semantics-info-100` |
| `--color-primary-lightest` | `--token-bg-primary-subtle-default` |

### Border radius

Values changed and one was dropped:

| Name | Old value | New value |
|---|---|---|
| `--border-radius-none` | `0` | `0` — unchanged |
| `--border-radius-soft` | `4px` | **`8px`** — doubled |
| `--border-radius-rounded` | `100px` | **`999px`** — visually equivalent |
| `--border-radius-circle` | `100%` | **Retired** — use `border-radius: 50%` or `--border-radius-rounded` |

New: `--border-radius-default` (set once to re-radius everything), `--border-radius-2xs` through `--border-radius-2xl` (shape tier slots).

---

## Same name, new value

These variables still exist — your overrides still apply — but without an override they resolve to a **different colour**. Nothing to change in your CSS; this is here so unexpected visual diffs make sense.

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

If you used `var(--color-neutral-0)` for text on a coloured background, switch to `--color-text-inverse` or `--token-primitives-base-white`.

---

## Component CSS API

Patterns now declare their visual properties as `--osui-{component}-{property}` custom properties and read them internally. There are ~460 of these across the library (full list on the **CSS API Reference** Storybook page).

An app rule that sets `background-color` directly on `.osui-sidebar` fights the framework on specificity. Setting the variable always wins and survives updates:

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

Because they're custom properties, they cascade: set them on an ancestor to scope a whole screen, or inline on one element to change a single instance.

---

## Framework defaults that changed

Every category above starts from something in *your* CSS, so you find them by searching. This one is the opposite: a number of widgets changed their own built-in appearance, so they look different even in an app that never styled them. No search will turn these up — you find them by comparing screens against the old app.

Four changes repeat across the library. Once you recognise the shape, the fix follows:

- **A hover fill where there was none.** Classic widgets changed only the text colour on hover. Many now paint a neutral background behind it. If your app had no hover wash, set the widget's hover-background knob to its resting background.
- **The selected mark changed.** Classic marked the current item with a border, an underline, or a primary tint. Several widgets now use a neutral fill instead, or drop the mark entirely. Restore it on both the selected state **and** its `:hover` — the framework's hover rule is more specific and will otherwise paint over it.
- **Icon colour moved to a token.** Framework icons read `--token-icon-subtlest`. A plain `.icon` in your own markup does **not** read it — it still inherits text colour, so the two drift apart in dark mode.
- **Size and padding moved to knobs.** Heights, paddings, and type sizes now come from `--osui-*` defaults that differ from the classic pixel values.

| Widget | What changed | Fix with |
|---|---|---|
| Button group | Gained a hover fill, container padding, and an inter-item gap. The item is now `inline-block` at 32px tall with 12px type; classic was 40px (48px on phone/tablet) with 14px type and `--space-base` padding | The `--osui-button-group-*` knobs. If the group used to fill its parent, also set `width: 100%` and `display: flex` on it, and `flex: 1` on the inner wrapper, so `inline-block` doesn't shrink it to the label width |
| Top menu link | The current-page `border-block-end` was cleared, and a hover fill can now cover the `.active` item | Restore `border-block-end` on `.active`, and repeat it on `.active:hover` |
| Tabs | Hover gained a background fill; the active item colour changed | `--osui-tabs-header-item-hover-background: transparent` and `--osui-tabs-header-item-color-active`. The indicator is still `--osui-tabs-indicator-color` |
| Pagination | The active page was a primary border with primary text; it's now a neutral fill with a default border and label | `--osui-pagination-active-background: transparent`, plus `--osui-pagination-active-border-color` and `--osui-pagination-active-color` |
| Section index | The active item's primary indicator bar changed, and hover/press fills were added | `--osui-section-index-item-hover-background` and `-press-background` to transparent, plus `--osui-section-index-item-active-color` and `-active-indicator-color` |
| List item | The selected row's fill is gone — selected now equals the base background. Hover and press fills were added | `--osui-list-item-selected-background` and `--osui-list-item-selected-icon-color` |
| Table | Header background, label colour, and selected-row colour all changed; stripe and hover knobs were added | The `--osui-table-*` knobs |
| Card | New surface fill, subtler border, larger radius and padding, and **no shadow by default** | The `--osui-card-*` knobs, including `--osui-card-shadow` |
| Bottom bar | The icon no longer inherits the item's colour — it has its own knob | `--osui-bottom-bar-item-icon-color` |
| Icons | Framework icons read `--token-icon-subtlest`; your own `.icon` elements ignore it | Set `.icon { color: … }` yourself, and add `color: inherit` for icons sitting inside buttons, coloured cards, or anything else that sets its own text colour |
| Outlined transparent button | The border and label used to follow text colour; the border token is now too dark on a dark surface | See [Button labels disappear in dark mode](#button-labels-disappear-in-dark-mode) |
| Accordion item | The divider is now a `border-block-end` reading a knob, not a `border` or `:after` | `--osui-accordion-item-border-width` |
| Range slider | The handle's `:before` / `:after` pseudo-elements are now `display: none`, so styling them does nothing | `--osui-range-slider-handle-background`, and delete the pseudo-element rules |
| Carousel | The card gained padding and a taller minimum, so a hand-set `min-height` on the wrapper can clip its content | Re-measure the rendered card and raise the `min-height`. Worth re-checking any hand-set height around a carousel, list, or card grid |
| Feedback message, alert, notification, tag, badge, avatar | Status colours moved to semantic roles and `--token-bg-extended-*` | The [extended palette](#extended-palette) mapping, plus the feedback tokens in [Neutral ramp flip](#neutral-ramp-flip--roles-no-longer-cascade) |
| Switch, checkbox, radio, input, dropdown, upload | Each now has its own size, fill, border, and checked knobs — a direct property override loses to them | The widget's own `--osui-*` knobs |
| Pickers, search, menus, sheets, tooltips, popups, sidebar, wizard, timeline, breadcrumbs, progress, rating, blank slate, gallery | Each exposes `--osui-*` surface, text, icon, and radius knobs; several also gained a hover fill | Look the knob up before writing it |

> **Look the knob up — don't guess the name.** The **CSS API Reference** page in Storybook lists every `--osui-*` property the library actually reads. A plausible-looking name that isn't on that list silently does nothing.

---

## Line-height model

`body` line-height changed from unitless `1.5` (scales with each element's font-size) to `1.5rem` (absolute 24px). Any element that sets its own `font-size` but not its own `line-height` now inherits a fixed 24px — small text looks tall, large text overlaps.

```css
/* BEFORE: body { line-height: 1.5; }    — unitless, scales with font-size */
/* NOW:    body { line-height: 1.5rem; } — absolute 24px, does NOT scale */

/* Problem */
.my-title { font-size: 40px; }  /* Inherits 24px line-height — text overlaps! */

/* Fix */
.my-title { font-size: 40px; line-height: 1.2; }
```

**Rule of thumb:** every custom rule that sets `font-size` should also set `line-height`. Use the matching `--token-font-line-height-*` token or a unitless number.

### The `border-radius: 100%` trap

Adding a `line-height` changes the element's height, which changes its aspect ratio — and `border-radius: 100%` on a non-square element draws an **ellipse**, not a circle. So fixing the line-height can be what finally makes a badge look lopsided.

After you pair a `line-height`, check the same rule for `border-radius: 100%` and replace it with `border-radius: 100px` for a pill, or `border-radius: 50%` for a circle on an element you know is square. This mostly bites badges, tags, chart labels, and notification counters.

---

## Logical properties

Framework rules now use `padding-block` / `padding-inline` / `margin-inline-start` / `inset-inline-start` etc. A custom override using `padding-left` on the same element has **no specificity relationship** with `padding-inline-start` — whichever comes later wins — so a partial physical override can silently do nothing.

```css
/* OLD — needs a separate .is-rtl rule to mirror */
.my-element { margin-left: 20px; }
.is-rtl .my-element { margin-left: auto; margin-right: 20px; }

/* NEW — mirrors automatically */
.my-element { margin-inline-start: 20px; }
```

| Write this | Not this |
|---|---|
| `padding-inline-start` / `-end` | `padding-left` / `-right` |
| `padding-block-start` / `-end` | `padding-top` / `-bottom` |
| `margin-inline-start` | `margin-left` |
| `inset-inline-start` / `-end` | `left` / `right` |
| `border-inline-start` | `border-left` |

Converting to logical properties often eliminates `.is-rtl` mirror rules entirely.

---

## Utility classes

Every utility class kept its name (`.shadow-m`, `.margin-base`, `.font-size-h1`, `.background-red-lightest`, etc.) and still ships. What changed is what they read — they now inline the token directly:

```css
/* before */
.shadow-m { box-shadow: var(--shadow-m); }

/* now */
.shadow-m { box-shadow: var(--token-elevation-2, ...); }
```

> **Overriding the old variable no longer reskins the class.** Setting `--shadow-m` at `:root` used to change every `.shadow-m` element. It does nothing now — override `--token-elevation-2` instead. Same for `--space-*` → `--token-scale-*` and `--font-size-*` → `--token-font-size-*`.

---

## Dark theme

The new theme ships a generated dark theme (`.os-dark-theme` class on `<html>`) that overrides ~447 `--token-*` values. Toggle it via the `SetDarkTheme` client action.

### If your app has its own dark-mode class — add `.os-dark-theme` too

This is the single most impactful dark-mode fix. Without `.os-dark-theme` on `<html>`, every `--token-*` value used inside framework components stays at its light-mode default. Symptoms include:

- White feedback messages / toast notifications
- Light input backgrounds on dark forms
- Light active-nav pills with invisible text
- Light dropdown popups
- Wrong shadow and surface colors

**Fix:** toggle `.os-dark-theme` on `<html>` alongside your custom class. The framework's token overrides compose cleanly with your own `--color-*` and `--osui-*` overrides.

### Neutral ramp flip — roles no longer cascade

If your dark mode flips `--color-neutral-0` through `--color-neutral-10` (swapping light ↔ dark), this **no longer works** for framework-owned text, surfaces, and borders. In the old theme, roles like `--color-text` were defined as `var(--color-neutral-9)` — flipping neutral-9 cascaded automatically. In the new theme, roles resolve through `--token-*` variables that don't reference neutrals.

**Result:** dark backgrounds with dark text, invisible buttons, invisible borders.

**Fix:** add explicit role overrides in your dark block:

```css
:root.dark-mode,
:root.os-dark-theme {
    /* your existing neutral ramp overrides */

    /* Role overrides — required in the new theme */
    --color-text:                var(--color-neutral-10);
    --color-text-subtle:         var(--color-neutral-8);
    --color-text-subtlest:       var(--color-neutral-7);
    --color-background-header:   var(--header-color); /* or hex */
    --color-background-surface:  var(--color-neutral-1);
    --color-border:              var(--color-neutral-3);
    --color-border-subtle:       var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10); /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);  /* link/primary hover */
    --token-icon-subtlest:          var(--color-neutral-6);  /* framework icons */

    /* Feedback surfaces — these stay light without an explicit override */
    --token-bg-info-subtle-default:    var(--color-neutral-2);
    --token-bg-danger-subtle-default:  #3d1a2a;
    --token-bg-success-subtle-default: #1a3d2a;
    --token-bg-warning-subtle-default: #3d3a1a;
}
```

**Point at the ramp, don't repeat the hex.** When a colour you need is already a step in your flipped ramp, write `var(--color-neutral-N)` rather than pasting the hex. Both render the same today, but the variable keeps following the ramp if you ever retune it, and it makes the intent readable. Reserve a literal hex for a tint no step actually holds — the feedback surfaces above are a fair example.

**For a colour that must *not* flip**, find its hex in both ramps and point each mode at whichever step holds it there. A navy that is `neutral-6` in light may well be `neutral-4` after the flip, so the two blocks name different steps on purpose. Conversely, if the colour *should* flip with everything else, name the same step in both blocks and let the ramp do the work.

### Button labels disappear in dark mode

Primary button text uses `--osui-btn-primary-color: var(--color-text-light)`. `--color-text-light` stays white even in `.os-dark-theme`. If your dark mode makes `--color-primary` light/white, the label is invisible.

**Critical:** set `--osui-btn-primary-color` on `.btn-primary`, **not** on `:root`. The framework re-declares it on `.btn`, so a `:root`-level override is inherited but loses to the element-level declaration.

```css
/* WRONG — inherited, loses to .btn's own declaration */
:root.dark-mode { --osui-btn-primary-color: var(--color-neutral-0); }

/* RIGHT — targets the element directly */
.dark-mode .btn-primary { --osui-btn-primary-color: var(--color-neutral-0); }
```

Do **not** set `--osui-btn-color: var(--color-text-dark)` on all `.btn` — that makes default/secondary button labels invisible on their dark backgrounds. Only target buttons with explicitly light backgrounds:

```css
.dark-mode .btn.background-white {
    --osui-btn-color: var(--color-text-dark);
}
```

**A transparent outlined button is the opposite case.** It has no light fill, so `--color-text-dark` makes the label vanish — and its border token is too dark to see against a dark surface. Keep the fill transparent through every state and put both the border and the label on a light step:

```css
.dark-mode .btn.btn-transparent-with-border {
    --osui-btn-background: transparent;
    --osui-btn-hover-background: transparent;
    --osui-btn-active-background: transparent;
    --osui-btn-border-color: var(--color-neutral-10);
    --osui-btn-color: var(--color-neutral-10);
}
```

### Link color is not `--color-primary`

Links are hardcoded to `--token-semantics-primary-base` in the new theme, not `--color-primary`. Overriding `--color-primary` does **not** change link color. Override the token instead, or style links directly:

```css
/* Option 1: override the shared token (changes links AND primary) */
:root.dark-mode {
    --token-semantics-primary-base: #your-link-color;
    --token-semantics-primary-900: #your-link-hover-color;
}

/* Option 2: style links directly */
a[data-link] { color: var(--color-text); }
a[data-link]:hover { color: var(--color-text-subtle); }
```

### General dark-mode hygiene

- Replace hardcoded colour literals with `--color-*` roles or `--token-*` values where a match exists.
- Prefer `--color-text` over `--color-neutral-9` for body text — the role flips in dark mode, the neutral step does not.
- Blank-slate icons changed from primary to grey (`--color-text-disabled`). Override with `.blank-slate-icon { color: var(--color-primary); }` if needed.
- Your own `.icon` elements don't read `--token-icon-subtlest`, so setting that token moves the framework's icons and leaves yours behind. Set `.icon { color: … }` as well, and `color: inherit` for icons inside buttons or coloured blocks that set their own text colour.

---

## New variables you didn't have before

Worth a scan even if nothing in your CSS broke — several of these replace workarounds people commonly hand-rolled:

| Variable | What it gives you |
|---|---|
| `--border-radius-default` | Re-radius the entire library with one declaration |
| `--color-text-subtle` / `-subtlest` / `-disabled` / `-inverse` | Named text tiers instead of picking neutrals by number |
| `--color-border-subtle` / `-subtlest` / `-input` / `-input-hover` | Border tiers, including input states |
| `--color-background-surface` / `-footer` / `-input` / `-input-disabled` | Surfaces the old set didn't name |
| `--color-primary-hover` / `--color-primary-active` | Primary interaction tiers (needed when overriding `--color-primary`) |
| `--border-radius-2xs` through `--border-radius-2xl` | Shape tier slots (shape profiles) |
| 460 × `--osui-{component}-{prop}` | Per-component, per-instance theming — see **CSS API Reference** in Storybook |

---

## Recipes — "I used to do X"

### "I re-branded the app by overriding `--color-primary`"

Still works, but add the interaction tiers:

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

Check the CSS API Reference for the component's `--osui-*` knobs — there usually is one now:

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

### "I hand-built a dark mode"

Add `.os-dark-theme` on `<html>` alongside your custom class — it's implemented purely as ~447 token overrides and composes with your custom `--osui-*` and `--color-*` overrides. Toggle both classes via `SetDarkTheme` or your own logic. Without `.os-dark-theme`, feedback messages, input backgrounds, active nav pills, and many component internals stay at light-mode values. See the [Dark theme](#dark-theme) section above for the full list of symptoms.

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

## Verifying your app

1. **Grep before you look.** The retired names are a finite list; searching your stylesheets for `--font-size-`, `--shadow-`, `--border-size-`, `--background-color-`, `--text-color-`, and `--border-color-` will find most of the work mechanically.
2. **Expect silent failures, not build errors.** A declaration that reads a retired variable is simply dropped. Those show up as "the page looks slightly off" rather than something obviously broken.
3. **Delete, don't port, the `!important` overrides.** Most of them existed because there was no variable. Check the CSS API Reference for the component first.
4. **Check the Storybook theme toggle.** Switch between the new theme and the deprecated theme snapshot to confirm whether a visual difference is intended.
5. **Then walk the screens — grepping can't find everything.** The [framework defaults](#framework-defaults-that-changed) changed under widgets your CSS never mentions, so nothing in your stylesheet points at them. Open each screen side by side with the old app, in both light and dark mode, and give the interaction states their own pass — hover, selected, and disabled are where most of these show up.
6. **Expect to find unrelated bugs, and fix them separately.** A migration is usually the first time anyone reads the whole stylesheet end to end. Two that turn up often: a bare colour in a shorthand, like `border: var(--color-green)`, which is invalid and makes the browser drop the whole declaration so there's no border at all; and a class selector missing its leading dot, like `my-tag { … }`, which has quietly never applied. Neither is theme breakage — keep them out of the migration commit so the diff stays reviewable.
