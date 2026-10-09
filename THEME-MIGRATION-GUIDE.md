# Migrating custom CSS to the new OutSystems UI theme

OutSystems UI's styling was rebuilt on the `outsystems-design-tokens` package. If your app ships custom CSS that overrode OutSystems UI variables or targeted its classes, most of it still works — but a specific, enumerable set of things moved.

This guide is the complete inventory: **what was retired and what replaces it**, **what kept its name but changed its value**, and **the new variables that let you stop writing overrides you previously had to hand-roll**.

> **Tip:** Feed this document to any AI coding assistant (Claude, Copilot, ChatGPT, Cursor, etc.) along with your custom CSS and ask it to migrate it. The mapping tables below give the assistant everything it needs.

---

## What you have to change, and what is just different

The new theme is a redesign as well as a re-plumbing. Components are deliberately sized, spaced, and coloured differently from before, so parts of your app will look different after you upgrade **even where nothing is wrong**. Separating those two things is the first decision of the migration, because the work involved is completely different.

- **Your CSS stopped working.** A variable you used no longer exists and the declaration is silently dropped, a colour you set no longer reaches the component, text or a control is unreadable. Everything up to the *Framework defaults that changed* section is this kind, and all of it needs fixing.

- **A change of ours broke a rule of yours.** The new default is reasonable on its own, but it invalidates CSS you already had — a component moved its anchor point and the offset you tuned no longer lands, a new `gap` stacks on top of a margin you still set, a new overlay paints over colours you set correctly underneath. These are the hardest to spot, because your rule is still in the file and still looks right, so the symptom never points at the cause. The *Framework defaults that changed* table calls out which rows do this.

- **It simply looks different.** A badge is smaller, a card's corners are rounder, a menu item is a pill instead of an underline. Nothing of yours is overridden and nothing is unreadable — this is the new design.

For that last group, **the default answer is to accept it.** Every default you pin back to the old appearance is CSS you now own and maintain forever, and it is the part of the upgrade you were buying. Revert them where the new look genuinely conflicts with your product's design language — not reflexively because something changed. The table in *Framework defaults that changed* gives you the revert for each one so you can decide per widget.

---

## Find all your CSS first

Your app holds custom CSS in more than one place, and every one of them is affected:

- **Theme** → Style Sheet — the app-wide rules and your `:root` palette. Usually the bulk of it.
- **Screen** → Style Sheet — screen-scoped rules.
- **Web Block** → Style Sheet — often just a couple of declarations sizing or colouring that widget.
- Inline `<style>` in expressions or HTML elements.

Don't forget shared modules either — a UI or icon library your app consumes has its own stylesheet, and it breaks the same way.

Migrating only the theme stylesheet is the most common mistake, and it produces confusing results: a widget appears to ignore its own styling. If a block sets `font-size: var(--font-size-h6)` and that variable is retired, the declaration is dropped and the element quietly inherits its parent's size instead — which looks like "the icon got smaller", not like a dead variable.

**Gather them before you start.** Search your modules for `var(--` and treat every file that matches as in scope. A stylesheet with no match, no `.osui-` selector, and no `[data-` selector needs nothing and can be skipped. Then run the triage below against each one, and migrate and publish them together — a half-migrated app is harder to reason about than an un-migrated one, because you can no longer tell which symptoms are the migration and which are left over.

## Triage your custom CSS

Search your stylesheets for each pattern below. That tells you which sections of this guide you actually need.

| If your CSS contains… | Verdict | Go to |
|---|---|---|
| `var(--font-size-*)`, `var(--shadow-*)`, `var(--border-size-*)` | Retired — resolves to nothing | [Retired variables](#retired-variables) |
| `var(--background-color-*)`, `var(--text-color-*)`, `var(--border-color-*)` | **Not** retired — but the framework stopped reading them, so setting one no longer has any effect | [Retired variables](#retired-variables) |
| `var(--space-*)` | **Still works** — declared with its classic values. Leave it alone | [Spacing](#spacing) |
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

There are **two different things** in this section, and they fail in different ways.

**Names that are genuinely gone.** `--shadow-*`, `--font-size-*`, `--border-size-*`, the `--font-*` weights, the extended-palette shades, and `--border-radius-circle` were declared in the classic bundle and are absent from the new one. A `var(--shadow-m)` now resolves to nothing and the whole declaration is dropped. This is the category that breaks silently.

**Names that were never declared, and are no longer read.** `--background-color-*`, `--text-color-*`, and `--border-color-*` were never values you could read — they were hooks the classic framework offered *you*, as the inner half of `var(--text-color-primary, var(--color-primary))` chains inside its own rules. Classic consulted them in several hundred places. The new theme consults `--text-color-*` and `--border-color-*` in none.

So if you set `--text-color-primary` at `:root` to re-colour your app, nothing is broken — your declaration is still valid and still resolves. The framework just stopped asking. **The symptom is a setting that quietly does nothing**, and there's nothing wrong-looking in your CSS to find. Set the `--color-*` role instead, from the mapping below.

A `var(--background-color-primary, var(--color-primary))` *in your own CSS* still renders, because of the inner fallback — but it's worth cleaning up to read the replacement directly.

### Careful with shorthands — repairing one can be the regression

A gone-for-good variable anywhere in a **shorthand** kills the whole declaration, not just that one value. `border: var(--border-size-s) solid red` doesn't become `border: <nothing> solid red`; it's dropped entirely and the element falls back to the framework's border on all four sides.

Which means the rule has been inert since you upgraded, and that element has been rendering on the framework default — possibly looking perfectly fine. Substituting the literal is the obvious repair, and it is sometimes the thing that breaks it: you're re-activating a rule that has been absent, re-asserting values your app never cared about against a framework that now supplies them differently.

The shape to watch for is a shorthand where only one value was ever the point, and the others were written to be harmless. A row styled `padding: var(--font-size-label) 5px` wanted narrow left/right padding; the block value was tuned against a framework that gave that element an explicit `height`, so it never did much. In the new theme that height is gone and the same size comes from `padding-block` instead — so faithfully restoring the shorthand now overrides the padding the row's height depends on, and collapses it to a bare line of text. Nothing in your CSS changed. The value just started mattering.

**Before substituting a literal, look at what the element renders as right now without the rule.** If it already looks right, write the longhand you actually meant — `padding-inline: 5px` — and leave the rest to the framework. Use the full shorthand only where you genuinely need every side pinned.

### Always write `--token-*` with a fallback — it is not defined at `:root`

**Read this before you replace anything.** The OutSystems UI bundle does not declare the light `--token-*` values. Check for yourself in your app's console:

```js
getComputedStyle(document.documentElement).getPropertyValue('--token-font-size-450')  // ""
```

What *is* defined at `:root` are the theme-layer roles — `--color-*`, `--border-radius-*`, `--layer-*` — and each component's own `--osui-*` knobs. The framework's components still render correctly because its build expands every token into a fallback chain internally. Your hand-written CSS doesn't get that.

So give every token a literal fallback:

```css
/* Dead — and because one term of the shorthand is invalid, the element
   gets no border at all, not a default one. */
border: var(--token-border-size-025) solid var(--color-neutral-10);

/* Renders 1px regardless. */
border: var(--token-border-size-025, 1px) solid var(--color-neutral-10);
```

**The trap that costs the most time:** colour tokens behave differently from size tokens. Adding `.os-dark-theme` declares roughly 879 `--token-*` colour properties, so a bare colour token **works in dark mode and silently does nothing in light mode**. If you test your change in dark mode first, it will look correct and then fail for every user on the default theme. Always verify in light.

**The practical rule:** prefer `--color-*` and `--border-radius-*`, which are defined at `:root` and already follow dark mode. Use `--token-*` only when no role covers what you need, and always with a fallback.

Watch the token names, too: weights are word-named (`--token-font-weight-regular`), while sizes and spacing are numeric (`--token-font-size-450`, `--token-scale-200`). A name that mixes the two conventions compiles fine and does nothing.

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

### Spacing

**Good news: `--space-*` still works, and you should leave it alone.** The whole family is still declared in the new bundle, with exactly the values it had before. `padding: var(--space-m)` is 24px in both themes. Check it yourself in your app's console:

```js
getComputedStyle(document.documentElement).getPropertyValue('--space-m')  // "24px"
```

| Variable | Classic | New | Now resolves through |
|---|---|---|---|
| `--space-none` | 0 | 0px | `--token-scale-0` |
| `--space-xs` | 4px | 4px | `--token-scale-100` |
| `--space-s` | 8px | 8px | `--token-scale-200` |
| `--space-base` | 16px | 16px | `--token-scale-400` |
| `--space-m` | 24px | 24px | `--token-scale-600` |
| `--space-l` | 32px | 32px | `--token-scale-800` |
| `--space-xl` | 40px | 40px | `--token-scale-1000` |
| `--space-xxl` | 48px | 48px | `--token-scale-1200` |

Rewriting these as `--token-scale-*` is optional tidying, not a fix. It changes no rendered pixel, it's usually the largest edit in the whole migration — dozens of references in a single stylesheet is normal — and each shorthand you touch is a chance to introduce the problem described under [shorthands](#careful-with-shorthands--repairing-one-can-be-the-regression). Do it only if you want one spacing vocabulary across your CSS.

**One thing did change.** No framework rule reads `--space-*` any more. Setting `--space-base` at `:root` used to retune the library's own spacing and the `.margin-base`-style utilities; now it only affects your own rules. Override `--token-scale-400` if you want to move the framework.

If you do need a token — for a step the old scale never had — the scale runs in 4px increments (`--token-scale-150` is 6px, `--token-scale-250` is 10px, up to `--token-scale-9000` at 360px).

### Border sizes

| Classic (retired) | Replacement | Value |
|---|---|---|
| `--border-size-none` | `--token-border-size-0` | 0px |
| `--border-size-s` | `--token-border-size-025` | 1px |
| `--border-size-m` | `--token-border-size-050` | 2px |
| `--border-size-l` | `--token-border-size-075` | 3px |

### Font weights

The weight tokens are **word-named, not numeric**. There is no `--token-font-weight-400`; if you write one, the declaration is silently dropped and the element keeps the framework's weight.

| Classic (retired) | Replacement | Value |
|---|---|---|
| `--font-light` | `--token-font-weight-light` | 300 |
| `--font-regular` | `--token-font-weight-regular` | 400 |
| `--font-semi-bold` | `--token-font-weight-semi-bold` | 600 |
| `--font-bold` | `--token-font-weight-bold` | 700 |

The available weights are `thin` (100), `extra-light` (200), `light` (300), `regular` (400), `medium` (500), `semi-bold` (600), `bold` (700), `extra-bold` (800), `black` (900) — so every classic weight maps one-to-one.

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

New: `--border-radius-default` (a global override) and `--border-radius-2xs` through `--border-radius-2xl` (shape tier slots).

**`--border-radius-default` doesn't re-radius quite everything.** The seven tier slots resolve `var(--border-radius-default, <own-default>)` and follow it. The three legacy roles — `--border-radius-none`, `--border-radius-soft`, `--border-radius-rounded` — resolve straight to their tokens and ignore it. Since `soft` is the one most custom CSS reads, setting the default won't bring those corners back to 4px; write the value explicitly.

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

**The root text colour moved off the ramp entirely.** `html` used to be `color: var(--text-color-neutral-9, var(--color-neutral-9))`; it is now `color: var(--color-text)`, which resolves through tokens that never reference a neutral. That one line is why re-pointing `--color-neutral-9` no longer moves body text, and it's the mechanism behind [Neutral ramp flip](#neutral-ramp-flip--roles-no-longer-cascade) below. Set `--color-text` when you want to move body text.

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

**Most of this table is optional.** It is the redesign, not a list of bugs, and the "Fix with" column is a revert you *may* want rather than one you should apply. Read it as a changelog first and decide per widget. Two kinds of row are not optional, and they are marked:

- **Breaks** — the widget is unreadable or has drifted off your palette, usually because it stopped following your neutral ramp. Fix these.
- **Collides** — the change invalidates CSS you already wrote. Fix these too; you will not find them by inspection, because the rule of yours that stopped working is still in the file.

Everything unmarked is preference. If you are migrating a large app, work the marked rows first and come back to the rest once the app is correct.

Four changes repeat across the library. Once you recognise the shape, the fix follows:

- **A hover fill where there was none.** Classic widgets changed only the text colour on hover. Many now paint a neutral background behind it. If your app had no hover wash, set the widget's hover-background knob to its resting background.
- **The selected mark changed.** Classic marked the current item with a border, an underline, or a primary tint. Several widgets now use a neutral fill instead, or drop the mark entirely. Restore it on both the selected state **and** its `:hover` — the framework's hover rule is more specific and will otherwise paint over it.
- **Icon colour moved to a token.** Framework icons read `--token-icon-subtlest`. A plain `.icon` in your own markup does **not** read it — it still inherits text colour, so the two drift apart in dark mode.
- **Size and padding moved to knobs.** Heights, paddings, and type sizes now come from `--osui-*` defaults that differ from the classic pixel values.
- **A focus ring was added.** Classic marked focus with a border change alone. Several widgets now also paint a `box-shadow` ring, which sits outside the border box and can collide with a tight layout. Look for a `-focus-ring-color` knob and set it to `transparent` to drop it.
- **Flex `gap` replaced margins.** Widgets that are now `inline-flex` space their children with `gap`. If your CSS also sets a margin on the same child you get both, and the element grows.

| Widget | What changed | Fix with |
|---|---|---|
| Button group | Gained a hover fill, container padding, and an inter-item gap. The item is now `inline-block` at 32px tall with 12px type; classic was 40px (48px on phone/tablet) with 14px type and `--space-base` padding | The `--osui-button-group-*` knobs. If the group used to fill its parent, also set `width: 100%` and `display: flex` on it, and `flex: 1` on the inner wrapper, so `inline-block` doesn't shrink it to the label width |
| **Collides** — Top menu link | Each header link became a centred pill: `align-self: center` instead of stretching to the full header height, 8px/12px padding, a border radius, and a hover fill. The current-page `border-block-end` was also cleared | Restore `border-block-end` on `.active`, and repeat it on `.active:hover` — the hover rule outranks a plain `.active`. But also undo the box on **all** the links, or the underline lands under the label rather than on the header's bottom edge and runs 24px wider than the word: `.desktop .header-navigation .app-menu-links > a { align-self: stretch; border-radius: 0; padding-block: 0; padding-inline: 0; border-block-start: 2px solid transparent; }`. Keep that transparent top border so active and inactive links stay the same height, and only drop the padding if your links are already spaced by margin utilities **Put the spacing back when you drop the padding.** The same framework rule sets `margin-inline: 1px` with a selector specific enough to override any `margin-*` utility class on your links, so those utilities have already stopped working and the padding is the only gap holding the items apart. Add `margin-inline: 0 16px` (or whatever your classic gap measured) alongside `padding-inline: 0`, or the links will touch. |
| Tabs | Hover gained a background fill; the active item colour changed | `--osui-tabs-header-item-hover-background: transparent` and `--osui-tabs-header-item-color-active`. The indicator is still `--osui-tabs-indicator-color` |
| Pagination | The active page was a primary border with primary text; it's now a neutral fill with a default border and label | `--osui-pagination-active-background: transparent`, plus `--osui-pagination-active-border-color` and `--osui-pagination-active-color` |
| Section index | The active item's primary indicator bar changed, and hover/press fills were added | `--osui-section-index-item-hover-background` and `-press-background` to transparent, plus `--osui-section-index-item-active-color` and `-active-indicator-color` |
| List item | The selected row's fill is gone — selected now equals the base background. Hover and press fills were added | `--osui-list-item-selected-background` and `--osui-list-item-selected-icon-color` |
| Table | Header background, label colour, and selected-row colour all changed; stripe and hover knobs were added | The `--osui-table-*` knobs |
| Card | New surface fill, subtler border, larger radius and padding, and **no shadow by default** | The `--osui-card-*` knobs, including `--osui-card-shadow` |
| Bottom bar | The icon no longer inherits the item's colour — it has its own knob | `--osui-bottom-bar-item-icon-color` |
| **Collides** — Icon badge (notification count) | The count bubble went from 18px to 16px with 10px bold text instead of 12px semi-bold, moved from `left: 45%` / `translateY(-40%)` to `right: 0` / `translate(50%, -50%)`, and gained a 1px ring (`box-shadow: 0 0 0 1px`) that classic never drew | The re-anchoring is the part that breaks things: if your CSS sets `top` or `left` on `.icon-badge .badge`, that offset was tuned against the old anchor and now compounds with the new transform, so restore `left: 45%; right: auto; transform: translateY(-40%)` alongside it. The size, weight and ring are preference — `box-shadow: none; height: 18px; min-width: 18px; font-size: 12px; font-weight: var(--token-font-weight-semi-bold, 600)` puts them back |
| **Breaks** — App menu (top nav) | Three changes at once: the link colour no longer follows `--color-primary`, the active item's underline is now drawn in `transparent` so it vanishes, and hovering a menu item gained a background fill that classic never drew | The colour is fixed by the `--token-semantics-primary-base` override (see [Link color is not `--color-primary`](#link-color-is-not---color-primary)) — don't restyle the nav for it. For the other two: `.layout:not(.layout-side) .app-menu-links a.active { border-block-end-color: var(--color-primary); }` and `.desktop .header-navigation .app-menu-links > a:hover { background-color: transparent; }`. Worth checking even if your CSS never mentions the nav — that's exactly why it gets missed |
| **Breaks** — Icons | Framework icons read `--token-icon-subtlest`; your own `.icon` elements ignore it | Set `.icon { color: … }` yourself, and add `color: inherit` for icons sitting inside buttons, coloured cards, or anything else that sets its own text colour |
| **Breaks** — Outlined transparent button | The border and label used to follow text colour; the border token is now too dark on a dark surface | See [Button labels disappear in dark mode](#button-labels-disappear-in-dark-mode) |
| Accordion item | The divider is now a `border-block-end` reading a knob. The title also shrank from 18px to 16px, its padding went from even `--space-m` to 12px block / 24px inline, and it gained a hover fill | `--osui-accordion-item-border-width` and `--osui-accordion-item-title-hover-background`. There's **no knob for the title's font-size or padding** — set those properties directly on `.osui-accordion-item__title` |
| **Collides** — Button with an icon | `.btn` is now `inline-flex` with an 8px `gap`, so every icon button is 8px wider than before | Drop your own margin on `.btn .icon` — it now stacks on top of the gap. If the old width matters, set `gap: 0` on `.btn` and keep the margin |
| **Collides** — Disabled button | Gained a `::after` wash painted over the whole button — `rgba(255,255,255,.6)` in light, `rgba(0,0,0,.6)` in dark. Classic only recoloured background, border, and text | `--osui-btn-disabled-overlay: transparent` on `.btn[disabled]`. Your own disabled colours are still applying underneath; the wash just sits on top. The symptom looks like a colour problem, so it's easy to spend time on the wrong variable |
| **Breaks** — Checkbox | The box now reads `--color-background-input`, which dark mode re-maps to a near-black `#131518` instead of following your neutral ramp. Classic used `--color-neutral-0` with a `--color-neutral-5` border | `[data-checkbox] { --osui-checkbox-background: var(--color-neutral-0); --osui-checkbox-border-color: var(--color-neutral-5); }`. If you flipped your ramp for dark mode, the box renders near-black on your dark card and looks like a hole in the surface. Note the selector is `[data-checkbox]`, not a class |
| Upload | The "select file" label is now `--token-text-primary`, a link blue (`#6f8bf4` in dark). Classic coloured it with body text | `--osui-upload-color: var(--color-text)`. Border and radius are separate knobs: `--osui-upload-border-color`, `--osui-upload-border-radius` |
| **Collides** — Dropdown | Focus gained a 2px `box-shadow` ring. The selected row in the popup lost its background fill and gained a primary checkmark on the right | `--osui-dropdown-focus-ring-color: transparent` to drop the ring. The selected row also lost its fill and gained a primary checkmark on the right. That mark doesn't shrink and carries an 8px margin, so it takes about 24px of fixed width out of the row; the label ellipsis-truncates to absorb it, and a narrow dropdown now cuts off its own selected option, so "EN" renders as "E…". The old fill cost no width at all, which is why this is new. Set a background on `.dropdown-popup-row-selected` and `content: none` on its `::after` **The popup row lost its fixed height.** Classic set `height: 40px` on `.dropdown-popup-row`; the new theme removes it and builds the same 40px from `padding-block: 8px` around a 24px line box. If your CSS sets `padding` on that row as a shorthand — `padding: 0 5px`, say — the leading `0` used to be free because the height was fixed, and now it removes the row's only source of height, collapsing every option to a bare line of text. Rewrite it as `padding-inline: 5px` and let the framework supply the vertical padding. **The popup also shrank and got rounder.** Its `max-height` went from a hard `300px` to `240px`, so a list that used to fit now scrolls — set `--osui-dropdown-list-max-height: 300px`. Its radius went from `--border-radius-soft` (4px back then) to `--border-radius-lg` (8px); set `--osui-dropdown-popup-border-radius` to a literal `4px` rather than naming `--border-radius-soft`, because that variable is itself now 8px. |
| **Collides** — Range slider | The handle shrank from 24px to 16px and gained a 2px `--color-primary` border. Its `:before` / `:after` are now `display: none`, so styling them does nothing. The filled portion is hardcoded to a token and **no longer follows `--color-primary`**. The track moved from `--color-neutral-5` at 4px radius to `--color-border`, fully pill-shaped | `--osui-range-slider-handle-background`, `--osui-range-slider-handle-border-color`, `--osui-range-slider-track-color`, `--osui-range-slider-track-radius`. Three things have no knob. **Size:** `--range-slider-handle-size` still works, but its value went from a flat `24px` to 16px — so if any of your own rules size or position something with a `calc()` against it, that rule shrank by a third without you touching it. Set it back to `24px` on `.osui-range-slider` rather than rewriting your `calc()`. **Filled colour:** re-point `--token-semantics-primary-base` at `:root` if you re-branded `--color-primary` app-wide (classic drove every primary-coloured component from it, so this restores them all at once), or set `background` on `.noUi-connect` if you only want the slider changed. **A `:before` you used as a visible mark:** start with `display: block` — only the `display` was taken away, and noUiSlider still supplies the `content`, `position`, `height` and `top` exactly as it always did. Whether that's the whole fix depends on what you used the pseudo-element for. If it was a thin grip line, as noUiSlider intended, stop there; adding your own positioning moves the mark somewhere it never was. If you repurposed it as a **shape** — a centre dot, a pill — you do need to restate the geometry, because the vendor's fixed `height: 14px` / `top: 6px` were sized for its own 34x28 handle and never centred anything in a small round one. The tell is that your rule sets `width` as a percentage while the height stays a fixed pixel value: the two no longer track each other once the handle's box changes, and it changed twice here (24px to 16px, border 1px to 2px). Drive both from the same percentage and centre on both axes — `width: 57%; height: 57%; top: 50%; left: 50%; transform: translate(-50%, -50%);` — and it stays a circle whatever the handle does |
| **Collides** — Carousel | The card gained padding and a taller minimum, so a hand-set `min-height` on the wrapper can clip its content | Re-measure the rendered card and raise the `min-height`. Worth re-checking any hand-set height around a carousel, list, or card grid |
| **Breaks** — Feedback message, alert, notification, tag, badge, avatar | Status colours moved to semantic roles and `--token-bg-extended-*` | The [extended palette](#extended-palette) mapping, plus the feedback tokens in [Neutral ramp flip](#neutral-ramp-flip--roles-no-longer-cascade) |
| **Collides** — Switch, checkbox, radio, input, upload | Each now has its own size, fill, border, and checked knobs — a direct property override loses to them | The widget's own `--osui-*` knobs |
| Pickers, search, menus, sheets, tooltips, popups, sidebar, wizard, timeline, breadcrumbs, progress, rating, blank slate, gallery | Each exposes `--osui-*` surface, text, icon, and radius knobs; several also gained a hover fill | Look the knob up before writing it |

> **Look the knob up — don't guess the name.** The **CSS API Reference** page in Storybook lists every `--osui-*` property the library actually reads. A plausible-looking name that isn't on that list silently does nothing.

---

## Line-height model

`body` line-height changed from unitless `1.5` to unitless **`1.714286`**. Both are ratios that scale with each element's font-size — but the ratio is ~14% larger, so any element setting its own `font-size` without a `line-height` now gets a taller line box than it used to:

| Your font-size | Line box before | Line box now |
|---|---|---|
| 11px | 16.50px | 18.86px |
| 14px | 21.00px | 24.00px |
| 40px | 60.00px | 68.57px |

Inherited text doesn't overlap — the whole scale loosens proportionally, because a ratio still grows with the element's own font-size. You may see "24px" quoted for this change; that is the computed value at the base 14px font size, not an absolute. At any other size the number is different, so don't go looking for 24px line boxes under ordinary text.

### Where text does clip: the framework's own patterns

`body` is a ratio. **Around two dozen pattern rules are not** — they set an absolute `rem` line-height from the token scale:

```css
.osui-accordion-item__title {
  font-size: var(--token-font-size-400, 1rem);
  line-height: var(--token-font-line-height-600, 1.5rem);   /* 24px, fixed */
}
```

The classic equivalent was `line-height: 1`, a ratio. So if you raise `font-size` on one of these, the line box **does not grow with it**, and your text clips or collides with whatever is below. The same change in the classic theme would have scaled cleanly.

The selectors worth knowing, because you'll target them without thinking about line-height: `.osui-accordion-item__title`, `[data-label]`, `.input-helper`, `.btn-small`, `.btn-large`, `.alert .alert-message`, `.list-item-content-title`.

**Whenever you raise `font-size` on a framework pattern, set `line-height` in the same rule.** A unitless ratio is safest.

```css
/* BEFORE: body { line-height: 1.5; }       — ratio; 40px text → 60px line box */
/* NOW:    body { line-height: 1.714286; }  — ratio; 40px text → 68.57px line box */

/* Problem: inherits the new, looser ratio */
.my-title { font-size: 40px; }

/* Fix: pin the classic ratio — 1.5 at every size, not a tighter number */
.my-title { font-size: 40px; line-height: 1.5; }
```

**Rule of thumb:** every custom rule that sets `font-size` should also set `line-height`. Use the matching `--token-font-line-height-*` token or a unitless number.

**The default pairing value is `1.5`** — that is what the classic theme declared on `body`, unitless, so every element resolved it against its own `font-size`. Writing `1.5` reproduces your old computed value exactly, at any font size. Resist tightening it for large text: `1.2` on a 40px heading looks sensible and quietly removes 12px of line box.

**Confirm before assuming, though.** `1.5` is the usual answer, but a charting library, date picker, or any ancestor may already have been overriding it. Guessing a reasonable-looking number resizes the element, which shows up as "this badge got bigger after the migration". Check the old app before you pick:

```js
const el = document.querySelector('.your-label');
const c = getComputedStyle(el);
console.log(el.getBoundingClientRect().height, c.lineHeight, c.fontSize);
```

**`line-height: normal` is a legitimate pairing value**, and often the correct one for badges, tags, chart labels, and anything drawn by a third-party widget. It sizes the element from its own font rather than from the inherited ratio, which is what you want wherever the old app was already doing that. If the old app computes `normal`, write `normal`; don't convert it to a number.

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

## Renamed classes

Utility classes kept their names. Many component classes did not — most moved under the `osui-` prefix, and several were re-expressed in BEM at the same time.

**This is the quietest break in the whole migration.** A rule targeting an old class is still perfectly valid CSS. No variable is retired, nothing errors, and the rule often carries `!important` — so it reads like a rule that *must* be taking effect, when in fact it matches nothing at all. There is no deprecated alias and nothing in the stylesheet to flag it.

Around 158 class names exist in the old bundle and not the new one, out of roughly 1,500:

| Group | Roughly | Example |
| --- | --- | --- |
| Straight prefix renames | 15 | `notification` → `osui-notification` |
| State classes folded into BEM | 6 | `is-open` → `osui-accordion-item--is-open` |
| Third-party widget classes | 39 | `pika-*`, `choices`, `flatpickr` |
| Component sub-elements | ~98 | `progress-circle-text` → `osui-progress-circle__text` |

The third group is a library swap and only matters if you styled those widgets directly. The fourth is the same rename one level down, which is why a simple "add `osui-`" search-and-replace won't find them all.

**Generate the list rather than working from the table.** Diff the class names in your old and new `ODC.OutSystemsUI.css`:

```bash
rg -No '\.[a-zA-Z][a-zA-Z0-9_-]*' old/ODC.OutSystemsUI.css | sed 's/^\.//' | sort -u > /tmp/old.txt
rg -No '\.[a-zA-Z][a-zA-Z0-9_-]*' new/ODC.OutSystemsUI.css | sed 's/^\.//' | sort -u > /tmp/new.txt
comm -23 /tmp/old.txt /tmp/new.txt
```

Then intersect that against your own stylesheet to see which ones you actually use. **Match on a word boundary, not a substring** — otherwise `.btn` looks dropped because `.btn-primary` was restructured:

```bash
comm -23 /tmp/old.txt /tmp/new.txt | while read c; do
  rg -q "\\.$c([^a-zA-Z0-9_-]|$)" your-stylesheet.css && echo "$c"
done
```

For each hit, find the replacement by searching the new bundle for the component name — `rg 'osui-.*wizard' new/ODC.OutSystemsUI.css` — rather than assuming the prefix is the only change.

---

## Dark theme

The new theme ships a generated dark theme (`.os-dark-theme` class on `<html>`) that overrides ~879 `--token-*` values. Toggle it via the `SetDarkTheme` client action.

### If your app has its own dark-mode class — add `.os-dark-theme` too

This is the single most impactful dark-mode fix. Without `.os-dark-theme` on `<html>`, every `--token-*` value used inside framework components stays at its light-mode default. Symptoms include:

- White feedback messages / toast notifications
- Light input backgrounds on dark forms
- Light active-nav pills with invisible text
- Light dropdown popups
- Wrong shadow and surface colors

**Fix:** toggle `.os-dark-theme` on `<html>` alongside your custom class. The framework's token overrides compose cleanly with your own `--color-*` and `--osui-*` overrides.

**This is a client-action change, not a CSS one.** Nothing in your stylesheet can add the class. Call the built-in **`SetDarkTheme(IsDark)`** client action — it adds and removes `os-dark-theme` on `document.documentElement` — from wherever you already toggle your own dark class. If you'd rather keep it as one JavaScript node:

```js
const root = document.documentElement;
if ($parameters.IsDarkMode) {
    root.classList.add('your-dark-class', 'os-dark-theme');
} else {
    root.classList.remove('your-dark-class', 'os-dark-theme');
}
```

Four things commonly go wrong here:

1. **Don't pass both classes as one string.** `classList.add('a b')` throws `InvalidCharacterError` and applies nothing — the toggle fails with no visible error. Each class must be a separate argument.
2. **Don't toggle `os-dark-mode`.** It's signal-only: the framework attaches no CSS to it and maintains it automatically from the OS `prefers-color-scheme`, as a hook for you to style against. Setting it by hand changes nothing visually and makes it misreport the system setting. `os-dark-theme` is the one that does the work.
3. **Keep toggling your own class.** All of your custom dark CSS keys off it. Switching to `os-dark-theme` alone silently drops your own dark styling.
4. **Put it on `<html>`, not `<body>`.** See [Dark theme](#dark-theme) — the `--color-*` roles resolve on the root element, so tokens set lower down arrive too late.

The first time this runs, areas that looked stuck in light mode will flip. That's the fix taking effect. Any `--token-*` overrides you'd already written into your dark block stay harmless: `:root.your-dark-class` outranks `.os-dark-theme`, so your values keep winning.

**Expect it to look dark but not look like your app.** The shipped dark palette is a neutral charcoal ramp. If your dark mode is a branded one — navy, deep green, warm grey — then anywhere a token shows through that you haven't overridden, you get grey on brand. It reads as a smudge rather than as a colour you chose, and it's easy to conclude the class made things worse when what it actually did was replace "stuck in light mode" with "someone else's dark mode."

Hold the two apart: `.os-dark-theme` is the floor, covering the ~870 tokens you'll never touch, and your own overrides are the brand on top. These are the ones most likely to be visible, so check them first:

| Token | Reads | Shipped dark |
|---|---|---|
| `--token-bg-surface-default` | 42 | `#1a1d21` |
| `--token-bg-neutral-subtlest-hover` | 30 | `#22262b` |
| `--token-bg-neutral-subtle-default` | 29 | `#22262b` |
| `--token-bg-neutral-base-default` | 13 | `#31353c` |
| `--token-border-subtle` | 9 | `#292d33` |

Point each at the step in your own ramp that plays the same role, at `:root` so it serves both modes.

### Neutral ramp flip — roles no longer cascade

If your dark mode flips `--color-neutral-0` through `--color-neutral-10` (swapping light ↔ dark), this **no longer works** for framework-owned text, surfaces, and borders. In the old theme, roles like `--color-text` were defined as `var(--color-neutral-9)` — flipping neutral-9 cascaded automatically. In the new theme, roles resolve through `--token-*` variables that don't reference neutrals.

**Result:** dark backgrounds with dark text, invisible buttons, invisible borders.

**Fix:** add explicit role overrides — in `:root`, not in your dark block.

This catches almost everyone. The roles are written in terms of your ramp, and your ramp already flips, so one declaration at `:root` covers both modes. Put them only in the dark block and you fix dark while light quietly keeps the framework's neutral greys. Because none of these roles existed in the classic theme, that grey is not a default you ever chose — it's one you've simply never seen.

```css
:root {
    /* your light ramp */

    /* Role overrides — required in the new theme. They go HERE so both modes
       get them; your flip below carries them into dark for free. */
    --color-text:                   var(--color-neutral-9);
    --color-text-subtle:            var(--color-neutral-8);
    --color-text-subtlest:          var(--color-neutral-7);
    --color-background-surface:     var(--color-neutral-1);
    --color-border:                 var(--color-neutral-3);
    --color-border-subtle:          var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10); /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);  /* link/primary hover */
    --token-icon-subtlest:          var(--color-neutral-6);  /* framework icons */

    /* wire your own surface variables to their framework role here too */
    --color-background-header:      var(--your-header-color);
}

:root.dark-mode,
:root.os-dark-theme {
    /* your ramp flip — every role above follows it automatically */

    /* Only what the ramp can't express belongs here: dark-only literals, and
       roles that deliberately pick a different step than light. */
    --color-text: var(--color-neutral-10);   /* pure white instead of neutral-9 */

    --token-bg-danger-subtle-default:  #3d1a2a;
    --token-bg-success-subtle-default: #1a3d2a;
    --token-bg-warning-subtle-default: #3d3a1a;
    --token-bg-neutral-subtlest-hover: rgba(255, 255, 255, 0.15);
}
```

**Check your two blocks against each other when you're done.** List the custom properties declared in the dark block but not at `:root`. A dark-only *literal* like `#3d1a2a` is correct. A dark-only `var(--color-neutral-N)` almost always means light mode is still missing that override.

**Point at the ramp, don't repeat the hex.** When a colour you need is already a step in your flipped ramp, write `var(--color-neutral-N)` rather than pasting the hex. Both render the same today, but the variable keeps following the ramp if you ever retune it, and it makes the intent readable. Reserve a literal hex for a tint no step actually holds — the feedback surfaces above are a fair example.

**For a colour that must *not* flip**, find its hex in both ramps and point each mode at whichever step holds it there. A navy that is `neutral-6` in light may well be `neutral-4` after the flip, so the two blocks name different steps on purpose. Conversely, if the colour *should* flip with everything else, name the same step in both blocks and let the ramp do the work.

**Some element classes gained an `osui-` prefix, and your rules for them now match nothing.** The Wizard is the one to check: `.wizard-item-icon` is now `.osui-wizard-item-icon`, `.wizard-item-icon-wrapper` is `.osui-wizard-item-icon-wrapper`. A rule like this is still valid CSS, references no retired variable, and carries `!important` — so it reads as a rule that must be winning, when in fact it never runs:

```css
.progress-wizard .wizard-item-icon { background-color: var(--wizard-bg-color) !important; }
```

Rewrite it against the CSS API rather than the new class name. It's less brittle, and you can usually drop the `!important`:

```css
.progress-wizard {
    --osui-wizard-icon-background: var(--wizard-bg-color);
    --osui-wizard-icon-border-color: var(--wizard-bg-color);
    --osui-wizard-connector-color: var(--wizard-bg-color);
}
```

**Don't rewrite a direct declaration as a `--osui-*` variable.** This looks like tidying and it's the easiest way to break your own app. A `--osui-*` knob only decides what the *framework's* declaration resolves to:

```css
/* framework */
.dropdown-container > div.dropdown-display { background-color: var(--osui-dropdown-background); }
```

It does nothing if some other rule sets `background-color` outright, because that rule wins the cascade before the variable is ever read — and your stylesheets are full of such rules. A real case: a widget module had `.dropdown-container.locale-dropdown .dropdown-display { background-color: transparent; }`, which beat the app theme's `.dropdown-container > div.dropdown-display { background-color: var(--color-neutral-2); }` on specificity. Rewritten as `--osui-dropdown-background: transparent`, it stopped competing at all, the theme's grey came back, and the dropdown painted over the circle that was wrapping it. The visible symptom was a wrapper element apparently vanishing, with nothing wrong in either file.

So: if the original set a property directly, keep it a direct declaration on the same selector. Use the `--osui-*` knob only for properties you never wrote yourself — things like `--osui-dropdown-list-max-height`, where you were relying on a framework default all along.

**Your dependencies have stylesheets too, and theirs break inside your screens.** A shared widget module — a locale switcher, an icon library, a header block — ships its own CSS that you may not own or even be able to see. Its failures render on your pages, in widgets your stylesheet never mentions, so there is nothing in your own code to search for. If a widget looks wrong and you can't find a rule for it, check the DOM: a `data-block="SomeModule.SomeWidget"` on an ancestor tells you which module to go and migrate. You can patch it locally to unblock yourself, but the real fix belongs in that module.

**There are two primary blues.** `--token-semantics-primary-base` and `--token-text-primary` are different tokens. Pointing the first at your `--color-primary` fixes links, the active nav item, the dropdown checkmark and the range slider's filled track — most of what you'd notice — so it's easy to think you're done. The second is read another 14 times and stays blue, most visibly on the Upload pattern's "select file" label. Fix that one with its own knob, `[data-upload] { --osui-upload-color: var(--color-text); }`, rather than re-pointing the token: classic coloured that label with body text, not with your brand colour.

**Don't move one of your own rules up into a role.** A role at `:root` reaches every framework widget that reads it — always many more than the one that sent you looking. The trap that catches people is `--color-background-input` and `--color-border-input`: the names read as if they're about text fields, but checkboxes, radios, switches, wizard step icons, the datepicker and the dropdown popup all resolve through them too. If you restyled your text inputs to a grey fill with no border and promote those values into the roles, your inputs look identical — your own rule was already doing that — and every checkbox and radio in the app silently loses its outline. Set the roles to what the classic theme gave those widgets (`var(--color-neutral-0)` fill, `var(--color-neutral-5)` border), and leave your input rule where it is. It still wins on its own selectors, which is the scope you wanted in the first place.

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
| `--border-radius-default` | Re-radius the seven shape tier slots with one declaration (the three legacy roles ignore it) |
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

One switch covers most of it:

```css
:root { --border-radius-default: 0; }    /* every tier slot square */
:root { --border-radius-default: 12px; } /* every tier slot softer */
```

That reaches the seven tier slots, not the three legacy roles — `--border-radius-soft` in particular ignores it, and it's the one custom CSS reads most often. Set that one explicitly too.

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

Add `.os-dark-theme` on `<html>` alongside your custom class — it's implemented purely as ~879 token overrides and composes with your custom `--osui-*` and `--color-*` overrides. Toggle both classes via `SetDarkTheme` or your own logic. Without `.os-dark-theme`, feedback messages, input backgrounds, active nav pills, and many component internals stay at light-mode values. See the [Dark theme](#dark-theme) section above for the full list of symptoms.

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
6. **Not every difference you spot is the theme.** Side-by-side comparison is the only way to find the framework-default changes, and it turns up false positives too. Before writing CSS to close a gap, check whether OutSystems UI has any rule for that element at all — look in **both** the new `ODC.OutSystemsUI.css` and the classic snapshot, since a rule that exists in neither can't be the theme. Third-party widgets are the usual culprit: charts, maps, editors, and date libraries render their own markup and apply their own `font-family`, `font-size`, and colours inline on their container, which beats any stylesheet and varies by library version. **A typeface difference is the one to watch**, because it changes measured width *and* height at once and looks exactly like a line-height or padding bug. Compare the `Font` row in your browser's element inspector on both apps before you believe a box-model explanation — two labels with identical `font-size`, `line-height`, and `padding` still measure differently if one resolves to a different font, and nothing in this guide will account for it.
7. **Expect to find unrelated bugs, and fix them separately.** A migration is usually the first time anyone reads the whole stylesheet end to end. Two that turn up often: a bare colour in a shorthand, like `border: var(--color-green)`, which is invalid and makes the browser drop the whole declaration so there's no border at all; and a class selector missing its leading dot, like `my-tag { … }`, which has quietly never applied. Neither is theme breakage — keep them out of the migration commit so the diff stays reviewable.
