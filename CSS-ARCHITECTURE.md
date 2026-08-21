# CSS Architecture — OutSystems UI

**Status: reference (living document).** This is the consolidated summary of the
styling architecture that resulted from the SCSS token-migration (Parts One–Four).
It documents the three cooperating layers — **design tokens**, the **framework
theme layer at `:root`**, and the per-component **CSS API** — and the single read
chain that ties them together.

It is a *summary*; the authoring rules live in [`.claude/rules/scss.md`](../.claude/rules/scss.md),
the migration history in [`plan.md`](../specs/plan.md) / [`plan-part-two.md`](../specs/plan-part-two.md),
and the theming rationale in [`plan-part-four.md`](../specs/plan-part-four.md).

---

## 1. The big picture

OutSystems UI styles every property through a **four-hop chain**. Each hop is a
single, well-defined layer with one job, and each hop has a sensible default so
the layer below is optional:

```
 property            → var(--osui-{component}-{prop})   ← Tier 4 · Component CSS API   (per-instance override)
   --osui-…          → var(--{role})                    ← Tier 3 · Framework theme layer (:root, app/theme override)
     --{role}        → $token-{…}                        ← Tier 2 · Design-token SCSS vars (compile-time)
       $token-…      → var(--token-{…}, <primitive>)     ← Tier 1 · Design tokens at :root (runtime override surface)
```

Concrete example (the Card background), top to bottom:

```scss
.card {
  --osui-card-background: var(--color-background-surface); // Tier 4 → Tier 3
}
background-color: var(--osui-card-background);             // property → Tier 4
```
```scss
// Tier 3 — src/scss/01-foundations/_root.scss
:root { --color-background-surface: #{$token-bg-surface-default}; }   // → Tier 2
```
```scss
// Tier 2 — src/scss/tokens/_variables.scss   (generated)
$token-bg-surface-default: var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff));  // → Tier 1
```

The fully-resolved CSS that ships is therefore:

```css
.card { --osui-card-background: var(--color-background-surface); background-color: var(--osui-card-background); }
:root { --color-background-surface: var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff)); }
```

**Anyone can intercept at any hop:** an app sets `--token-bg-surface-default` to
re-skin globally, a theme sets `--color-background-surface` to change just the
surface role, and a single component instance sets `--osui-card-background` to
override one card — none of them touch a component rule.

---

## 2. Tier 1 — Design tokens (`--token-*` / `$token-*`)

The bottom layer is the [`outsystems-design-tokens`](https://github.com/OutSystems/outsystems-design-tokens)
package (a dependency, pinned in `package.json`). It is **generated**, never
hand-edited:

```bash
npx build.tokens --dest src/scss/tokens/ --prefix token   # runs in prebuild / predev
```

This emits three files into `src/scss/tokens/` (all **gitignored**):

| File | Contents | Layer it represents |
|---|---|---|
| `_root.scss` | `--token-*` custom properties at `:root` (raw hex/rem/px values) | The **runtime override surface** |
| `_variables.scss` | `$token-*` SCSS vars, each = `var(--token-*, <fallback>)` | The **compile-time surface** |
| `_utilities.scss` | token-backed maps for utility-class generation | — |

### Three sub-tiers within the token package

Tokens are themselves layered (primitives → semantics → component), and the
fallback chain encodes that relationship:

```
$token-primitives-base-white      → var(--token-primitives-base-white, #ffffff)              · raw value
$token-bg-surface-default          → var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff))   · semantic role
$token-elevation-1, $token-scale-600, $token-border-radius-200 …                              · component/scale tokens
```

A **semantic** token (`bg-surface-default`) falls back through a **primitive**
(`primitives-base-white`) which falls back to a literal — so a component is
correct even if *no* `--token-*` are defined at runtime.

### How the two layers are used (the non-negotiable rule)

- **`$token-*` SCSS vars are what component SCSS writes.** They give compile-time
  typo-checking, IDE autocomplete, and a baked-in fallback.
  - In a CSS **property value** → `$token-*` directly: `padding: $token-scale-600;`
  - In a CSS **custom-property declaration** → interpolate: `--osui-card-padding: #{$token-scale-600};`
- **`--token-*` is the public theming surface**, *not* something the bundle ships.

> **Verified subtlety:** the compiled bundle (`dist/*.OutSystemsUI.css`) does **not**
> emit the `--token-*` `:root` block — it relies entirely on the `var(--token-*, fallback)`
> fallbacks (`grep -c '--token-primitives-neutral-100:' dist/…css` → `0`). The
> generated `tokens/_root.scss` is the **canonical definition / override set** a
> DTE or app supplies at `:root` to re-skin; the bundle renders correctly with or
> without it. Wiring: only `tokens/_variables` is `@import`ed into the bundle (via
> `00-abstract/_setup-global-vars.scss`).

**Retired — never reintroduce:** `--font-size-*`, `--shadow-*`,
`--border-size-*`, and the helper functions `get-background-color()` /
`get-text-color()` / `get-border-color()`. Use `$token-*` instead.

---

## 3. Tier 3 — Framework theme layer at `:root`

File: **`src/scss/01-foundations/_root.scss`** (hand-authored, checked in).

This is OUI's **stable, framework-owned theming contract** — a set of role knobs
that sit *between* the design tokens and the components. It is deliberately
**un-prefixed** (no `--os-`) to stay backward-compatible with the historical
public theming surface (`--color-primary`, etc.). Each knob defaults **through**
a `$token-*`, so overriding the token still cascades.

```scss
:root {
  // surfaces / text / borders
  --color-background-surface: #{$token-bg-surface-default};
  --color-text:               #{$token-text-default};
  --color-border:             #{$token-border-default};

  // brand / status / neutral  (also read by TS GetColorValueFromColorType)
  --color-primary: #{$token-semantics-primary-base};
  --color-error:   #{$token-semantics-danger-base};
  --color-neutral-0 … --color-neutral-10: #{$token-primitives-neutral-*};

  // radius — one shape vocabulary; each resolves var(--border-radius-default, <own>)
  --border-radius-soft:   var(--border-radius-default, #{$token-border-radius-200}); // 8px  · controls + flat surfaces
  --border-radius-softer: var(--border-radius-default, #{$token-border-radius-400}); // 16px · elevated surfaces
  --border-radius-rounded:var(--border-radius-default, #{$token-border-radius-full});// 999px· circular
}
```

What lives here:

| Group | Vars | Notes |
|---|---|---|
| **Surfaces** | `--color-background-{body,surface,header,sidemenu,footer,login,input,…}` | |
| **Text** | `--color-text`, `--color-text-{subtle,subtlest,disabled,inverse}` | |
| **Borders** | `--color-border`, `--color-border-{subtle,subtlest,input,…}` | |
| **Brand / status / neutral** | `--color-{primary,primary-hover,primary-selected,primary-active,secondary,error,warning,success,info}`, `--color-neutral-0..10` | brand + neutrals are Color-entity records read by TS `GetColorValueFromColorType`; the four status roles are **not** entity records, just public O11 names |
| **Palette** | `--color-{red,orange,yellow,lime,green,teal,cyan,blue,indigo,violet,grape,pink}`, `--color-transparent` | the 12 Color-entity families; entity-bound, so the names cannot change. The light/dark variants (`-lightest` … `-darkest`) are deliberately **not** roles — their utility classes read `$token-*` directly |
| **Focus ring** | `--color-focus-outer` (translucent wash), `--color-focus-inner` (solid line on top) | read by `.has-accessible-features :focus` |
| **Radius** | `--border-radius-{none,soft,softer,rounded}` | set **`--border-radius-default`** once at `:root` to re-radius everything; `none/soft/rounded` ↔ TS `GetBorderRadiusValueFromShapeType`, `softer` is CSS-only |
| **Spacing** | `--space-{none,xs,s,base,m,l,xl,xxl}` | token-backed onto `$token-scale-*`; also read at runtime by Gallery `ItemsGap`. Prefer `$token-scale-*` in new component SCSS |

> **Renaming any entity-bound name is a breaking change.**
> `Helper.Dom.GetColorValueFromColorType` builds `'--color-' + <Color entity value>` at
> runtime (Progress `ProgressColor` / `TrailColor`). If the var is missing the helper
> falls through to `return colorName`, writing the literal entity name out as a colour —
> silently, with no build error. Same shape for
> `GetBorderRadiusValueFromShapeType` → `--border-radius-{none,soft,rounded}` and
> Gallery `ItemsGap` → `--space-*`.

Status **text/border** tiers are intentionally absent from the theme layer:
components read `$token-text-danger` / `$token-border-danger-default` directly,
because neither has an entity record or a cross-component consumer.

**Also in `_root.scss` but NOT part of the theme contract** (app-layout
plumbing): layout sizes `--size-*`, z-index `--layer-global-*` / `--layer-local-*`,
safe areas `--os-safe-area-*` (the one retained `--os-` prefix), and the
portaled-pattern `--osui-*-layer` vars (read off-DOM, so they must live at `:root`).

The old block of **cross-component future-token candidates** is gone (ROU-12975):
each entry either moved to the token that now exists, or was inlined at its call
site where no token does. Nothing in `_root.scss` is a placeholder any more.

---

## 4. Tier 4 — Component CSS API (`--osui-*`)

Every visual component declares its own custom properties at its **root
selector**, defaulting either to a Tier-3 role (themeable props) or straight to a
`$token-*` (structural props), then reads them in property values:

```scss
.card {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-card-background:    var(--color-background-surface);   // → theme role (themeable)
  --osui-card-border-color:  var(--osui-border-subtle);
  --osui-card-border-width:  #{$token-border-size-025};         // → token directly (structural)
  --osui-card-border-radius: var(--border-radius-soft);
  --osui-card-padding:       #{$token-scale-600};
  --osui-card-shadow:        #{$token-elevation-1};
  // ───────────────────────────────────────────────────────────────────

  background-color: var(--osui-card-background);
  border:           var(--osui-card-border-width) solid var(--osui-card-border-color);
  border-radius:    var(--osui-card-border-radius);
  box-shadow:       var(--osui-card-shadow);
  padding:          var(--osui-card-padding);
}
```

Rules:

- **Naming:** `--osui-{component}-{property}` (Decision D11).
- Property declarations **must** go through the `--osui-*` var, never directly
  through `$token-*`/`--color-*`, so a consumer can override one instance
  (`<div class="card" style="--osui-card-padding: 8px">`) without touching tokens
  or the theme.
- **Route themeable props through the Tier-3 role** (`--color-*`, `--border-radius-*`)
  and **structural/size props straight to `$token-*`** — as Card does above
  (colour/radius → role, padding/border-width → token). This keeps the theme able
  to recolour without resizing.
- Defaults live on the component root. A theme overrides *variables only* — it
  never edits a component rule.

Pattern SCSS (`src/scripts/**/scss/`) follows the same shape with `osui-`-prefixed
class names; pattern-scoped knobs may also alias a global token or carry a literal
default (e.g. `--osui-bottom-sheet-max-height: calc(100vh - 54px)`). Portaled
patterns additionally declare their layer var in `_root.scss`.

---

## 5. Theming — how to re-skin

A theme is **entirely CSS-custom-property overrides scoped under a single class**
(e.g. `<body class="theme-x">`). It overrides Tier-3 role knobs (`--color-*`,
`--border-radius-*`, …) and/or the underlying Tier-1 `--token-*`. It touches **no**
component rule, **no** `$token-*` value, and **no** pre-existing `--osui-*` default.

```css
/* Re-skin one role across the whole framework */
:root            { --color-primary: #6d28d9; }
/* Re-skin globally by overriding a token (cascades through every role + component) */
:root            { --token-bg-surface-default: #1b1b1b; }
/* Round every corner at once */
:root            { --border-radius-default: 12px; }
/* Override a single component instance */
.card.is-promo   { --osui-card-shadow: var(--osui-elevation-overlay); }
```

> **Invariant:** if a theme ever needs to touch a *component rule*, that is a
> **leak in that component's CSS API** — fix it in the component (add/route the
> missing `--osui-*` knob), not in the theme.

### Dark theme (ships)

`src/scss/01-foundations/_theme-dark.scss` implements a dark theme that is
**opt-in, manual only**:

- Add `.theme-dark` to the screen's outermost element (e.g. `<body>`) to switch
  the library to dark; remove it for the default light palette.
- There is **no OS auto-detection**. An app that wants to follow the OS reads
  `prefers-color-scheme` itself and toggles the class.

The whole palette lives in one `@mixin osui-theme-dark`, applied under
`.theme-dark`. It re-maps the dark `--token-*` **and** re-declares the `--color-*`
roles — the latter is required because `--color-*` is substituted at `:root`, so a
`--token-*` override on `<body>` alone wouldn't reach components that read
`--color-*`. Re-declaring `--color-*` makes the body scope self-sufficient, so the
whole subtree under `.theme-dark` re-resolves to the dark palette.

It is mostly invariant-clean (token + `--color-*` + `--osui-*` overrides), with a
small, clearly-marked **"KNOWN CSS-API LEAKS"** block (`.header`, `.app-menu-*`,
`label`, `::placeholder`, validation text) — components without a `--osui-*` knob
for the property, each a FIXME to migrate per Phase E. See
[`plan-part-four.md`](../specs/plan-part-four.md).

---

## 6. File & build map

| Path | Role | Source |
|---|---|---|
| `src/scss/tokens/_root.scss` | Tier 1 — `--token-*` at `:root` (override surface) | generated, gitignored |
| `src/scss/tokens/_variables.scss` | Tier 1 — `$token-*` = `var(--token-*, fallback)` | generated, gitignored |
| `src/scss/00-abstract/_setup-global-vars.scss` | `@import`s `tokens/variables`; token bridges; utility maps | checked in |
| `src/scss/01-foundations/_root.scss` | Tier 3 — framework theme layer + layout plumbing | checked in |
| `src/scss/04-patterns/**`, `src/scripts/**/scss/**` | Tier 4 — component CSS APIs | checked in |
| `src/scss/{O11,ODC}.OutSystemsUI.scss` | generated entry files | **never hand-edit** (regen on every build) |
| `dist/{O11,ODC}.OutSystemsUI.css` | compiled bundle (ships fallbacks, not `--token-*` root) | build output |

Build order (per generated entry): `00-abstract/setup-global-vars` (pulls in
`$token-*`) → `00-abstract/mixins` → `01-foundations/root` (theme layer) →
foundations → layout → widgets → patterns → utilities.

`npm run build:tokens` regenerates Tier 1; `npm run tokens:update` bumps the
package and regenerates.

---

## 7. Authoring quick-reference

When writing any SCSS line, walk **down** the chain only as far as you need:

1. Reading a **themeable** colour/radius? → use the **Tier-3 role**: `var(--color-*)`, `var(--border-radius-*)`.
2. Reading a **structural** size/space/elevation/border? → use **`$token-*`** directly.
3. Exposing it on a component? → declare a **`--osui-{component}-{prop}`** that defaults to (1) or (2), and have the property read the `--osui-*` var.
4. Need a value with no token yet? → keep it **local**: inline it in the property value, or declare an `--osui-{component}-{prop}` on the component root. Do **not** add a global placeholder to `_root.scss` — that block existed and was retired in ROU-12975, because a global with one reader is harder to find than a literal at its call site. If the value is genuinely cross-component, file the gap upstream in `outsystems-design-tokens`.

**Red flags** (see `.claude/rules/scss.md` §14): hardcoded hex/rem/px where a
`$token-*` exists; reintroducing retired `--font-size-*`/`--shadow-*`/`--border-size-*`;
`get-*-color()` calls; a property reading `$token-*`/`--color-*` directly instead
of via its `--osui-*`; a theme touching a component rule; hand-edits to the
generated entry files.
