# Retired-variable replacement mapping

Reference for the `osui-theme-migration` skill. Every classic variable that no longer resolves, and what replaces it. Load this when rewriting a retired name; the skill body carries the procedure.

> **This file is the source of truth for the migration tables.** The tables wrapped in `<!-- table:ID -->` markers are copied into the matching `<!-- generated:ID -->` blocks of `THEME-MIGRATION-GUIDE.md` by `npm run docs:migration`. Correct a value here, never there, then run the sync. The surrounding prose is independent in each file — the guide addresses customers, this file addresses the agent — so only the tables travel.

### Semantic color helpers → role variables

Every `--text-color-*` and `--border-color-*` name is gone — zero reads in the shipped bundle — and so is every `--background-color-*` below. **Three `--background-color-*` names are the exception and are not retired:** `--background-color-body`, `--background-color-header`, and `--background-color-login` are still read, as override hooks in front of their roles:

```css
background-color: var(--background-color-body, var(--color-background-body));
```

A customer setting one of those three still gets the result they always did. Leave them alone; do not rewrite them to the `--color-background-*` role.

<!-- table:semantic-helpers -->

| Classic (retired)              | Replacement              | Notes                                                                       |
| ------------------------------ | ------------------------ | --------------------------------------------------------------------------- |
| `--background-color-primary`   | `--color-primary`        |                                                                             |
| `--background-color-secondary` | `--color-secondary`      |                                                                             |
| `--background-color-error`     | `--color-error`          |                                                                             |
| `--background-color-warning`   | `--color-warning`        |                                                                             |
| `--background-color-success`   | `--color-success`        |                                                                             |
| `--background-color-info`      | `--color-info`           |                                                                             |
| `--background-color-neutral-0` | `--color-neutral-0`      | Or `--color-background-surface` for cards/panels                            |
| `--background-color-neutral-N` | `--color-neutral-N`      | N = 1..10                                                                   |
| `--text-color-neutral-0`       | `--color-text-light`     | Light text on dark/primary backgrounds                                      |
| `--text-color-neutral-9`       | `--color-text`           | Default body text                                                           |
| `--text-color-neutral-10`      | `--color-text`           | Default body text                                                           |
| `--text-color-neutral-N`       | `--color-neutral-N`      | N = other steps; consider `--color-text-subtle` or `--color-text-subtlest`  |
| `--border-color-primary`       | `--color-border-primary` | The border role. Use `--color-primary` only where the value is not a border |
| `--border-color-neutral-N`     | `--color-neutral-N`      | Or `--color-border` / `--color-border-subtle` for generic borders           |

<!-- /table:semantic-helpers -->

### Shadows

<!-- table:shadows -->

| Classic (retired) | Replacement           |
| ----------------- | --------------------- |
| `--shadow-none`   | `none`                |
| `--shadow-xs`     | `--token-elevation-1` |
| `--shadow-s`      | `--token-elevation-1` |
| `--shadow-m`      | `--token-elevation-2` |
| `--shadow-l`      | `--token-elevation-3` |
| `--shadow-xl`     | `--token-elevation-4` |

<!-- /table:shadows -->

### Font sizes

<!-- table:font-sizes -->

| Classic (retired)     | Replacement             | Rendered size             |
| --------------------- | ----------------------- | ------------------------- |
| `--font-size-display` | `--token-font-size-900` | 36px                      |
| `--font-size-h1`      | `--token-font-size-700` | 28px (was 32px — smaller) |
| `--font-size-h2`      | `--token-font-size-650` | 26px (was 28px — smaller) |
| `--font-size-h3`      | `--token-font-size-600` | 24px (was 26px — smaller) |
| `--font-size-h4`      | `--token-font-size-550` | 22px                      |
| `--font-size-h5`      | `--token-font-size-500` | 20px                      |
| `--font-size-h6`      | `--token-font-size-450` | 18px                      |
| `--font-size-base`    | `--token-font-size-400` | 16px                      |
| `--font-size-s`       | `--token-font-size-350` | 14px                      |
| `--font-size-xs`      | `--token-font-size-300` | 12px                      |
| `--font-size-label`   | `--token-font-size-275` | 11px                      |

<!-- /table:font-sizes -->

> **Warning:** h1–h3 are **smaller** in the new scale. A one-to-one swap changes the rendered size. Flag this for the customer to decide whether the new size is acceptable or whether they want to pick a different token step to preserve the old size.

### Spacing (`--space-*` is **not** retired — leave it alone)

**`var(--space-m)` still resolves, to the same 24px it always did.** The scale is declared at `:root` in the shipped bundle with values identical to classic, in a deliberate `Theme layer · space scale` block in `src/scss/01-foundations/_root.scss` alongside the radius knobs. Customer CSS written against it renders unchanged.

Verify it rather than taking it on trust:

```bash
grep -E '^[[:space:]]*--space-' dist/ODC.OutSystemsUI.css
```

<!-- table:spacing -->

| Variable       | Classic | New  | Now resolves through |
| -------------- | ------- | ---- | -------------------- |
| `--space-none` | 0       | 0px  | `--token-scale-0`    |
| `--space-xs`   | 4px     | 4px  | `--token-scale-100`  |
| `--space-s`    | 8px     | 8px  | `--token-scale-200`  |
| `--space-base` | 16px    | 16px | `--token-scale-400`  |
| `--space-m`    | 24px    | 24px | `--token-scale-600`  |
| `--space-l`    | 32px    | 32px | `--token-scale-800`  |
| `--space-xl`   | 40px    | 40px | `--token-scale-1000` |
| `--space-xxl`  | 48px    | 48px | `--token-scale-1200` |

<!-- /table:spacing -->

**Do not rewrite these.** A `var(--space-*)` → `var(--token-scale-*, …)` sweep is a **Preference** row in Section 0 terms: it changes no rendered pixel, it touches more lines than anything else in a typical migration — 50+ references in a single stylesheet is normal — and every shorthand it touches is an opportunity to introduce the regression described under Category A. Propose it only if the customer has asked for one spacing vocabulary, and never as part of a breakage fix.

**One framework consumer still reads it, and not from CSS.** The shipped bundle contains zero `var(--space-` reads of its own, which makes it tempting to conclude nothing in the framework depends on the scale. The Gallery pattern does: `Gallery.ts:21` writes `var(--space-${ItemsGap})` as an inline style when the widget renders, so a customer who re-points `--space-m` still moves Gallery's item gap. A grep of the CSS will not show this.

`.claude/rules/scss.md` records the same position — `--space-*` is the public spacing vocabulary, restored by ROU-12975 and kept precisely so apps and Gallery's runtime have a stable override surface. Preferring `$token-scale-*` in new framework SCSS is an authoring convention, not a statement that the variable is dead.

**One real consequence of that zero-read count.** Overriding `--space-base` at `:root` no longer reskins the framework's own CSS, because no framework rule reads it any more — Gallery's runtime write above is the only thing left that responds. It still drives the customer's own rules. See Section 9 for the same effect on utility classes. **To move the framework's own spacing, override the `--token-scale-*` step instead** — `--token-scale-400` is what `--space-base` now resolves through, and the framework reads the token directly.

`--token-scale-*`, for the cases where you do need a token, runs in 4px steps with `025`/`050`/`075` for 1/2/3px, up to `9000` (360px).

### Border sizes

<!-- table:border-sizes -->

| Classic (retired)    | Replacement               | Value |
| -------------------- | ------------------------- | ----- |
| `--border-size-none` | `--token-border-size-0`   | 0px   |
| `--border-size-s`    | `--token-border-size-025` | 1px   |
| `--border-size-m`    | `--token-border-size-050` | 2px   |
| `--border-size-l`    | `--token-border-size-075` | 3px   |

<!-- /table:border-sizes -->

### Font weights (retired `--font-*` shorthand)

The weight tokens are **word-named, not numeric**. `--token-font-weight-400` does not exist; writing it silently drops the declaration.

<!-- table:font-weights -->

| Classic (retired)  | Replacement                     | Value |
| ------------------ | ------------------------------- | ----- |
| `--font-light`     | `--token-font-weight-light`     | 300   |
| `--font-regular`   | `--token-font-weight-regular`   | 400   |
| `--font-semi-bold` | `--token-font-weight-semi-bold` | 600   |
| `--font-bold`      | `--token-font-weight-bold`      | 700   |

<!-- /table:font-weights -->

The full set is `thin` (100), `extra-light` (200), `light` (300), `regular` (400), `medium` (500), `semi-bold` (600), `bold` (700), `extra-bold` (800), `black` (900). Every classic weight has a one-to-one replacement.

### Extended palette (12 families x 7 shades)

All `--color-{family}-{shade}` variables are **retired** (e.g. `--color-red-dark`, `--color-indigo-light`). The palette itself was also recoloured, so even the base hex values changed.

Replacement by shade. Intermediate shades are primitives. `lightest` and the bare family name are not — they bind to a status role or a `--token-bg-extended-*` token:

<!-- table:extended-palette-shades -->

| Old shade  | Replacement token pattern                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- |
| `lightest` | Status role, or `--token-bg-extended-{family}-subtle-default`. See the family table below |
| `lighter`  | `--token-primitives-{family}-300`                                                         |
| `light`    | `--token-primitives-{family}-500`                                                         |
| _(base)_   | Status role, or `--token-bg-extended-{family}-base-default`. See the family table below   |
| `dark`     | `--token-primitives-{family}-800`                                                         |
| `darker`   | `--token-primitives-{family}-900`                                                         |
| `darkest`  | `--token-primitives-{family}-1000`                                                        |

<!-- /table:extended-palette-shades -->

`lightest` and the bare family, from `src/scss/00-abstract/_setup-global-vars.scss`:

<!-- table:extended-palette-families -->

| Family                                   | `lightest`                                    | bare family                                 |
| ---------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| red                                      | `--token-bg-danger-subtle-default`            | `--token-bg-danger-base-default`            |
| yellow                                   | `--token-bg-warning-subtle-default`           | `--token-bg-warning-base-default`           |
| green                                    | `--token-bg-success-subtle-default`           | `--token-bg-success-base-default`           |
| blue                                     | `--token-bg-info-subtle-default`              | `--token-bg-info-base-default`              |
| orange, lime, teal, indigo, violet, pink | `--token-bg-extended-{family}-subtle-default` | `--token-bg-extended-{family}-base-default` |
| cyan                                     | `--token-primitives-aqua-100`                 | `--token-primitives-aqua-900`               |
| grape                                    | `--token-primitives-purple-100`               | `--token-primitives-purple-800`             |

<!-- /table:extended-palette-families -->

Family renames in the token package: **`grape` → `purple`**, **`cyan` → `aqua`**, **`error` → `danger`**. Cyan's intermediate shades bind to teal primitives, not aqua.

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

<!-- table:semantic-light-shades -->

| Classic (retired)          | Replacement                         |
| -------------------------- | ----------------------------------- |
| `--color-error-light`      | `--token-semantics-danger-100`      |
| `--color-warning-light`    | `--token-semantics-warning-100`     |
| `--color-success-light`    | `--token-semantics-success-100`     |
| `--color-info-light`       | `--token-semantics-info-100`        |
| `--color-primary-lightest` | `--token-bg-primary-subtle-default` |

<!-- /table:semantic-light-shades -->

### Border radius

The radius names survived as theme roles, but values changed and one was dropped:

<!-- table:border-radius -->

| Name                      | Old value | New value                                                           |
| ------------------------- | --------- | ------------------------------------------------------------------- |
| `--border-radius-none`    | `0`       | `0` — unchanged                                                     |
| `--border-radius-soft`    | `4px`     | **`8px`** — doubled                                                 |
| `--border-radius-rounded` | `100px`   | **`999px`** — visually equivalent                                   |
| `--border-radius-circle`  | `100%`    | **Retired** — use `border-radius: 50%` or `--border-radius-rounded` |

<!-- /table:border-radius -->

New additions: `--border-radius-default` (global override) and the `--border-radius-2xs` through `--border-radius-2xl` shape tier slots.

**`--border-radius-default` does not re-radius everything, despite how it is usually described.** Only the seven tier slots resolve `var(--border-radius-default, <own-default>)`. The three legacy roles resolve straight to their tokens and ignore it:

```css
--border-radius-lg: var(--border-radius-default, var(--token-shape-soft-lg, 8px)); /* follows */
--border-radius-soft: var(--token-shape-soft-xs, 8px); /* does not */
--border-radius-rounded: var(--token-border-radius-full, 999px); /* does not */
--border-radius-none: var(--token-border-radius-0, var(--token-scale-0, 0px)); /* does not */
```

That exception is the one that matters, because `--border-radius-soft` is the role customer CSS actually reads. Setting `--border-radius-default` will not bring a corner reading `soft` back to its classic radius — only an explicit value will. Confirm the current split before promising a one-line fix:

```bash
grep -E '^[[:space:]]*--border-radius-[a-z0-9]+:' dist/ODC.OutSystemsUI.css
```

> **Warning:** `--border-radius-soft` doubling from 4px to 8px is a visual change even though the name survived. If the customer relied on 4px corners, they'll need `border-radius: 4px` explicitly.

---
