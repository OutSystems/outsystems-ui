# Part Four: Theming Architecture

**Status: proposed.** This document defines a deliberate **theme layer** for
OutSystems UI and a phased plan to formalize it. Parts One/Two (`plan.md`,
`plan-part-two.md`) put a real design-token system under OSUI; Part Four is about
the *theming* story on top of it — making "a theme" a first-class, enumerable,

> **Update:** the opt-in **dark theme has been removed for now** (`_theme-dark.scss`
> deleted, unregistered from the gulp spec). The leak inventory below is retained
> as the historical evidence that motivated the theme layer; **Phase C is therefore
> superseded** — the leak-closing work is now folded into Phase E, to be done when
> a theme is (re)introduced. Phases A and B (theme layer + component routing) are
> implemented.
framework-owned concept rather than the four overlapping ad-hoc layers it is today.

---

## Objective

Introduce a **framework-owned theme layer** that sits between the design-system
tokens and the components, formalize it as a documented contract, and restore
the architectural invariant that **a theme is a set of variable overrides —
never component rules**.

The end state:

1. A single, named middle layer (`--os-*` semantic role knobs) is OSUI's stable
   public theming surface, insulated from `outsystems-design-tokens` package
   renames.
2. Every themable property resolves through one predictable chain.
3. `_theme-dark.scss` (and any future theme) is expressible as variable
   overrides alone, with zero component-rule edits.
4. The themable surface is enumerable — a manifest the DTE and app authors can
   target without reading component internals.

---

## Context — why this is needed

The token migration established the chain *primitive → semantic `$token-*` →
component `--osui-*`*. But the theming concern grew organically and now spans
**four overlapping, undocumented layers**:

1. **External `--token-*` semantic tokens** — DTE-editable; the bulk theming
   surface. Dark theme overrides these.
2. **A `--os-*` framework bridge** in `_root.scss` that *mixes* genuinely-semantic
   roles (app surfaces `--os-color-background-*`; the border-radius role vars
   `--os-border-radius-flat/elevated/controls/circular`) with non-theme plumbing
   (layout sizes, safe-areas, the z-index layer system).
3. **A `--osui-*` "future-token candidates" block** parked in `_root.scss`
   (focus halo, overlay elevation, primary-hover, surface hover/active states,
   motion durations, disabled opacity, type-scale gaps…).
4. **A TypeScript bridge** — `Helper/LegacyTokenMap.ts` + `Helper/Dom.ts`
   (`GetColorValueFromColorType`, `GetBorderRadiusValueFromShapeType`) resolving
   `--color-*` / `--border-radius-*` at runtime for the Progress patterns via a
   three-tier `legacy → token → literal` fallback.

There is **no single enumerable "theme contract"**, and the dark theme already
violates its own stated invariant. Inventory of `_theme-dark.scss`:

- **~22 "mild" touchpoints** — reaching into a component selector to set its
  `--osui-*` API var (lines ~179–227, 256–257): `.card`, `.alert-*`, `.btn`,
  `.table`, `.form-control`, `.badge`, `.tag`. These at least go through the
  component API, but they're set *per component selector* inside the theme
  instead of once at the variable layer.
- **~10 "hard" leaks** — raw CSS properties on component selectors, which the
  invariant forbids entirely:

  | `_theme-dark.scss` | Selector | Raw property |
  | --- | --- | --- |
  | line 233 | `.header` | `border-bottom` |
  | line 239 | `.app-menu-content`, `.aside-navigation` | `background-color` |
  | lines 244–249 | `.app-menu-links a` (+ `:hover`, `.active`) | `color` |
  | line 262 | `span.validation-message` | `color` |
  | line 267 | `::placeholder` | `color` |
  | line 272 | `label` | `color` |
  | lines 279–282 | `.desktop .theme-dark .btn:hover` (+ 2 variants) | `filter: brightness(1.15)` |

Each hard leak is **evidence that a needed value isn't reachable as a variable**.
The `.btn:hover` block is the worst offender: a three-way selector hack that
exists only because button hover isn't a themable var.

---

## The layered model (target)

```
Tier 1  Primitives          $token-primitives-*       raw palette, theme-independent
Tier 2  Design-system tokens $token-* (bg/text/border) external package, DTE surface
Tier 3  Framework theme      un-prefixed role knobs    OSUI-owned stable role knobs;
        layer                (--color-*, --border-radius-*, --size-*, --layer-*)  each defaults THROUGH a Tier-2 token
Tier 4  Component CSS API    --osui-{component}-{prop}  defaults through Tier 3 (or Tier 2)
```

> **Naming (D35):** the Tier-3 contract is **un-prefixed** — `--color-*`,
> `--border-radius-*`, `--size-*`, `--layer-*` — to stay backward-compatible with
> the historical public theming surface (`--color-primary`, etc.). The only var
> that keeps the old `--os-` prefix is `--os-safe-area-*`.

**Read chain** for every themable property:

```
property  →  var(--osui-{component}-{prop})  →  var(--{role})  →  $token-*  →  primitive fallback
```

Concrete example (button primary background):

```scss
:root {
  --color-primary: var(--token-semantics-primary-base, #105cef);   // Tier 3
}
.btn {
  --osui-btn-primary-background: var(--color-primary);             // Tier 4
  background-color: var(--osui-btn-primary-background);
}
```

**The invariant:** a theme is a partial that assigns **Tier-2 and/or Tier-3
variables only**. It never declares a component rule and never sets a raw CSS
property on a component selector. This is enforceable in review and is the
acceptance bar for Phase C.

### Why framework-owned (not token-direct)

The design-token semantic tier *could* be the theme surface directly (apps
override `--token-semantics-primary-base`). We deliberately interpose `--os-*`
instead because OSUI is a **distributed library**: a framework-owned name set is
a stable contract that survives `outsystems-design-tokens` restructuring, gives
the DTE a single OSUI-defined target, and names the *role* ("primary") rather
than the *token implementation*. This **reverses D17** (see Decisions) — that
exclusion was a status-quo argument ("no consumers, no distinct override path")
that no longer holds once a theme layer is the explicit goal.

**Trade-off (must be documented):** every `--os-*` knob defaults *through* its
Tier-2 token, so overriding the token (e.g. dark theme) still cascades. But an
app that overrides an `--os-*` knob with a **literal** opts out of
theme-following for that role. That's the accepted cost of a stable bridge.

---

## The framework theme layer (un-prefixed role knobs)

The consolidated, documented role set living in `_root.scss`. Each line defaults
through a Tier-2 token. Names are un-prefixed for backward compatibility (D35);
the brand/status/neutral colors reuse the pre-existing `--color-*` block (which
TS `GetColorValueFromColorType` already reads), so there is no duplication.

**Brand** (reintroduced — reverses D17):

```scss
--color-primary:          var(--token-semantics-primary-base);
--color-primary-hover:    var(--token-semantics-primary-800); // primary interactive: hover
--color-primary-selected: var(--token-semantics-primary-900); // primary interactive: selected / active
--color-secondary:        #303d60; // no secondary token exists yet (literal)
```

**Status** (note: the danger role reuses the legacy public name `--color-error`):

```scss
--color-success: var(--token-semantics-success-base);
--color-warning: var(--token-semantics-warning-base);
--color-error:   var(--token-semantics-danger-base);
--color-info:    var(--token-semantics-info-base);
```

**Surfaces** — `--color-background-{body,surface,header,sidemenu,footer,login}` (added generic `-surface`) + form-field backgrounds `--color-background-{input,input-disabled}`.

**Text** (neutral foreground roles; semantic/status/link/extended text stay token-direct) — `--color-text` (default body text, now used everywhere a default text color is set), `--color-text-{subtle,subtlest,disabled,inverse}`.

**Borders** (neutral / structural; status borders follow their `--color-*` role) — `--color-border` (default), `--color-border-{subtle,subtlest}`, form-field borders `--color-border-{input,input-press}`.

**Radius** — merged into one shape vocabulary `--border-radius-{none,soft,softer,rounded}` (`soft` 8px = controls + flat surfaces, `softer` 16px = elevated surfaces — the new level, `rounded` 999px = circular). The earlier separate role vars (`flat-surfaces`/`elevated-surfaces`/`controls`/`circular`) were folded into this single set — fewer knobs, and it reuses the shape names TS already reads (`softer` is CSS-only).

**Graduated future-token candidates** — reframe the `_root.scss` `--osui-*`
"future-token candidates" block (focus halo, `--osui-elevation-overlay`,
`--osui-bg-surface-subtle/hover/active`, `--osui-semantics-primary-hover`,
`--osui-motion-duration-*`, `--osui-opacity-disabled`, etc.) as **theme-layer
entries** with the existing lifecycle comment: each maps 1:1 to a proposed
upstream token and graduates into `outsystems-design-tokens` by rename, not
rewrite. These are part of the theme contract today.

> Non-theme `--os-*` (layout sizes, safe-areas, the z-index layer system) stay
> where they are but are **documented as out of the theme contract** — they're
> app-layout plumbing, not themable roles.

---

## The theme contract (manifest)

The deliverable that makes theming legible: a single enumerated list of every
variable a theme is allowed to set, grouped by role (brand, status, surfaces,
text, border, icon, elevation, radius roles, motion, state). This is:

- the **DTE / consumer target surface** (what to override to re-skin), and
- the **review checklist** for "is this theme legal?" (it may only touch names
  on this list).

The manifest is the union of (the framework-owned Tier-3 `--os-*` roles) + (the
subset of Tier-2 `--token-*` semantic names the framework actually depends on).

---

## Phased implementation

Each phase mirrors `plan.md`'s contract (what / files / acceptance criteria) and
must keep `npm run build` + `npm run lint` green.

### Phase A — Define the theme layer

**What:** reorganize `_root.scss` into one documented framework-theme block. Add
the brand (`--os-color-primary/-secondary`) and status (`--os-color-success/
-warning/-danger/-info`) knobs, each defaulting through its Tier-2 token. Keep
app surfaces and radius roles; relabel the "future-token candidates" `--osui-*`
block as theme-contract entries. Add a header comment separating *themable
roles* from *layout plumbing*.

**Files:** `src/scss/01-foundations/_root.scss`.

**Acceptance:** the file has a clearly delimited "Framework theme layer" section;
every new `--os-color-*` resolves through a token; build/lint pass; compiled CSS
is byte-unchanged for the brand/status defaults (they resolve to the same token).

### Phase B — Route component APIs through the theme layer

**What:** where a component's `--osui-*` default currently points straight at a
brand/status/surface/radius `$token-*`, re-point it at the matching `--os-*`
role knob. Establishes the Tier-4 → Tier-3 read chain. (Radius already does this;
extend to brand/status colors — e.g. `--osui-btn-primary-background`,
`--osui-alert-accent-color` variants, `--osui-badge-*`, validation text.)

**Files:** `src/scss/03-widgets/*` and `src/scss/04-patterns/**` component roots.
Pattern: change the default value only, never the property read.

**Acceptance:** grep shows brand/status `--osui-*` defaults reference `--os-*`,
not `$token-semantics-*` directly; visual output unchanged in the default theme;
build/lint pass.

### Phase C — Close the theme leaks (~~dark-theme~~ — SUPERSEDED)

> **Superseded.** The dark theme was removed, so there is no `_theme-dark.scss`
> to de-leak today. The work below is retained as a checklist and folded into
> **Phase E** — when a theme is (re)introduced it must be authorable as variables
> alone, which requires these same component-API fixes:
>
> - **Hard leaks → variables.** For each row in the (now-historical) leak table,
>   add the missing `--osui-*` component var + its default on the component root
>   so the value is reachable without a raw property on a component selector.
>   E.g. `.header` border → `--osui-header-border-color`; menu link colors →
>   `--osui-menu-link-color` / `-hover` / `-active`; placeholder/label/validation
>   → component (or text-role) vars.
> - **Kill the `.btn:hover` filter hack.** Replace `filter: brightness()` with a
>   themable hover var (`--osui-btn-*-hover-background` or a `--color-primary-hover`
>   role), so a theme overrides a value, not a selector.
> - **Lift the mild touchpoints.** Prefer a single role-knob/`--token-*` override
>   (inherited by all consumers) over per-component-selector overrides.

### Phase D — Reconcile the TS bridge

**What:** the runtime resolvers (`LegacyTokenMap.ColorTokenMap` /
`ShapeTokenMap`, `Dom.GetColorValueFromColorType` /
`GetBorderRadiusValueFromShapeType`) read `--color-*` / `--border-radius-*` then
fall back to `--token-*`. Insert the Tier-3 `--os-*` role var into that chain
(`--os-color-* → --token-* → literal`) so runtime-resolved Progress colors/shapes
follow the same theme contract as CSS. If alignment isn't worth it, document why
the legacy names remain (e.g. low blast radius, Progress-only).

**Files:** `src/scripts/OSFramework/OSUI/Helper/LegacyTokenMap.ts` (maps + the
`legacy → token → literal` chain), `src/scripts/OSFramework/OSUI/Helper/Dom.ts`.

**Acceptance:** Progress color/shape resolution honors a `theme-dark` (or brand)
override of the relevant role; existing behaviour preserved when no theme is
active; build/lint pass.

### Phase E — Prove it

**What:** author the theme-contract reference doc (the manifest) and a **second
theme** expressed as variables only — e.g. a brand-accent or high-contrast theme
partial scoped under its own class. This is the same validation role Phase 11
(dark theme) played for the token chain: if any new theme needs to touch a
component rule, that's a leak to fix in the component, not the theme.

**Files:** new `src/scss/01-foundations/_theme-*.scss` partial (registered in
`gulp/ProjectSpecs/ScssStructure/Resets.js`) + the manifest doc.

**Acceptance:** the example theme is component-rule-free; toggling its class
re-skins the library; the manifest enumerates exactly the variables both themes
touch.

---

## Decisions

| # | Decision | Resolution |
|---|----------|-----------|
| D28 | Theming model — new namespace vs formalize existing | ✅ Formalize the semantic layer as a documented contract. **No** parallel `--theme-*` namespace. |
| D29 | Theme contract ownership | ✅ **Framework-owned.** Named `--os-*` semantic role knobs are OSUI's stable public theming surface; each defaults *through* a Tier-2 token. Insulates apps/DTE from token-package renames. |
| D30 | Brand vars in the theme layer | ✅ **Reintroduced** (`--os-color-primary/-secondary`). **Supersedes D17**, whose status-quo rationale ("no consumers, no distinct override path") no longer applies once a deliberate theme layer exists. |
| D31 | Component read path | ✅ Through the component `--osui-*` var: `--osui-* → --os-* → $token-*`. Preserves the Tier-4 component-API layer; brand colors are not read inline. |
| D32 | Theme = variables-only invariant | ✅ Hard rule. A theme assigns Tier-2/Tier-3 variables only; any component-rule edit is a CSS-API leak fixed in the component. |
| D33 | Non-theme plumbing (layout/safe-area/z-index) | ✅ Kept (`--size-*`, `--layer-*`, `--os-safe-area-*`), but explicitly **excluded from the theme contract** and documented as app-layout plumbing. |
| D34 | Literal override of a role knob | ✅ Accepted trade-off: overriding a knob with a literal (not a token) opts that role out of theme-following. Documented, not prevented. |
| D35 | Theme-layer naming — prefix | ✅ **Un-prefixed.** Drop the `--os-` prefix from the whole theme layer + plumbing so the contract reuses the historical public names (`--color-primary`, `--border-radius-*`, `--size-*`, `--layer-*`) → instant backward compatibility, no duplication with the existing `--color-*` block, and TS already reads `--color-*`. The danger role reuses `--color-error`. **Only** `--os-safe-area-*` keeps the prefix (build constraint). This restates the naming in D29/D30/D31 (which referenced `--os-*`). |
| D36 | Dark theme | ✅ **Removed for now.** `_theme-dark.scss` deleted + unregistered from the gulp spec. The leak inventory is kept as historical motivation; closing those leaks moves to Phase E (authoring a clean theme). The theme layer (Phases A–B) ships regardless. |
| D37 | Global radius override | ✅ Each `--border-radius-*` resolves `var(--border-radius-default, <own-default>)`; setting `--border-radius-default` at `:root` re-radiuses the whole framework with one override (undefined by default). |

---

## Acceptance criteria (overall)

- Any theme partial (when reintroduced) is **zero** component-rule property
  declarations — pure Tier-2/Tier-3 variable overrides.
- Every theme-layer role knob (`--color-*`, `--border-radius-*`, …) resolves
  through a Tier-2 token (no raw literals except where no token exists, flagged
  as future-token candidates).
- A theme-contract manifest enumerates the full themable surface.
- A second theme (Phase E) re-skins the library via variables alone.
- `npm run build` and `npm run lint` pass; default-theme visual output is
  unchanged through Phases A–B.

---

## Out of scope

- Editing `outsystems-design-tokens` itself (the future-token candidates
  graduate upstream separately).
- Font-family / typography theming (a separate platform-theming decision, per
  D15).
- The Service Studio preview SCSS (`08-servicestudio-preview/`).
