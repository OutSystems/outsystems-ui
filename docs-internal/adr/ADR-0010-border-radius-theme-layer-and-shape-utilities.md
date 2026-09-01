# ADR-0010: Border-radius theme layer and shape utilities

## Status

Accepted — implemented.

## Context

The theme-layer radius knobs (`--border-radius-*`) and the low-code Shape utilities were out of sync: class names, CSS variable names, and token sizes did not match, and many widgets/patterns bound `$token-border-radius-*` (or a theme knob) without reading `--border-radius`. That blocked a single `.shape-*` class from restyling chrome, and a value change on `--border-radius-softer` would have silently flattened 16px surfaces to 12px.

This ADR is the file to reopen when changing radius tokens, `.shape-*`, legacy `.border-radius-*` classes, or Tag / Avatar / Badge shape behaviour.

## Decision Drivers

- No visual breaking change to default chrome (no `.shape-*` on the element).
- `.shape-*` must restyle component chrome via `--border-radius`.
- TypeScript `ShapeTypes.Sharp = 'none'` concatenates `'--border-radius-' + shape` (Balloon, BottomSheet, OverflowMenu, ProgressBar / `GetBorderRadiusValueFromShapeType`).
- Service Studio still emits `.border-radius-{none,soft,rounded,circle}` on Tag, Avatar, and Badge.
- Prefer a `:root` knob when a matching size exists; otherwise keep the `$token-*`.

## Considered Options

- Rename `--border-radius-none` to `--border-radius-rectangular` to match design language.
  - Pros: one name everywhere.
  - Cons: breaks TS shape resolution and the legacy `.border-radius-none` class.
- Point `.border-radius-soft` at `--border-radius-soft` (8px).
  - Pros: one “soft” size.
  - Cons: existing Tag / Avatar / Badge markup that uses `.border-radius-soft` would jump from 4px to 8px.
- Map `--border-radius-softest` to `$token-border-radius-600` (24px).
  - Cons: nothing in widgets/patterns uses 24px.

## Decision Outcome

Chosen: keep `--border-radius-none` as the CSS identifier; use `.shape-rectangular` as the class name; retarget `--border-radius-softer` / `--border-radius-softest` onto the sizes actually used; wire chrome through `var(--border-radius, <today's default>)`; keep the four legacy property utilities at HEAD sizes.

### Naming split

| Surface | 0px name | Why |
| --- | --- | --- |
| CSS custom property | `--border-radius-none` | `ShapeTypes.Sharp = 'none'`; legacy class `.border-radius-none` |
| `.shape-*` utility | `.shape-rectangular` | Design-language name |

There is **no** `--border-radius-rectangular` and **no** `.shape-none`. `.shape-rectangular` sets `--border-radius: var(--border-radius-none)`.

### `:root` token map

Declared in `src/scss/01-foundations/_root.scss`. Interpolate `#{variables.$token-…}` — never `var(#{token})` (`$token-*` is already a `var()`).

Do not map `$token-border-radius-600` (24px); nothing consumes it.

| Knob | Token | Size |
| --- | --- | --- |
| `--border-radius-none` | `$token-border-radius-0` | 0px |
| `--border-radius-soft` | `$token-border-radius-200` | 8px |
| `--border-radius-softer` | `$token-border-radius-300` | 12px |
| `--border-radius-softest` | `$token-border-radius-400` | 16px |
| `--border-radius-rounded` | `$token-border-radius-full` | 999px |

`--border-radius-softer` **changed** from 16px (`$token-border-radius-400`) to 12px. Anything that must stay 16px uses `--border-radius-softest` (Card, Card Background, Accordion first/last/only item, Balloon / BottomSheet / OverflowMenu local `--border-radius-rounded` remap).

`--border-radius-default` is **not** used. A global re-radius is `.shape-*` / `--border-radius` on a subtree, or overriding the individual knobs.

### Component contract

Chrome (not inner glyphs) declares:

```scss
--osui-{component}-border-radius: var(--border-radius, <today's default>);
border-radius: var(--osui-{component}-border-radius);
```

`--border-radius` is unset until a `.shape-*` ancestor or self sets it. The fallback **must** be wrapped in `var()` (`var(--border-radius, var(--border-radius-soft))`, not `var(--border-radius, --border-radius-soft)`).

Size → fallback:

| Today’s size | Fallback |
| --- | --- |
| 0px | `var(--border-radius-none)` |
| 8px | `var(--border-radius-soft)` |
| 12px | `var(--border-radius-softer)` |
| 16px | `var(--border-radius-softest)` |
| 999px | `var(--border-radius-rounded)` |
| 4px | `#{variables.$token-border-radius-100}` (no matching root knob) |

### Two class families

**`.shape-*`** (new) — sets `--border-radius` only. Generated from `$osui-border-radius-types`: `rectangular`, `soft`, `softer`, `softest`, `rounded`.

**`.border-radius-{none,soft,rounded,circle}`** (legacy) — set the **`border-radius` property** at HEAD sizes so Service Studio markup does not change:

| Class | Value |
| --- | --- |
| `.border-radius-none` | `$token-border-radius-0` (0) |
| `.border-radius-soft` | `$token-border-radius-100` (**4px**, not 8px) |
| `.border-radius-rounded` | `$token-border-radius-full` |
| `.border-radius-circle` | `50%` |

Do **not** wire `.border-radius-soft` to `--border-radius-soft` (8px).

Corner/side utilities (`.border-radius-top-left-*`) follow the new type list (`-rectangular`, …). `-none` is still generated as an alias of rectangular for existing markup.

### Tag / Avatar / Badge

These get shape from platform classes, not from a default radius.

- Default CSS API fallback is `--border-radius-none` so `.shape-*` works when present.
- Keep Tag and Avatar `&.border-radius-soft` (4px; medium Tag soft = 8px / `$token-border-radius-200`). Figma “soft” ≠ theme-layer `--border-radius-soft`.
- Badge has no component-specific soft override; it still relies on the legacy property utilities for current markup.

### Out of scope for the CSS API

- Vendor `_*_lib.scss` (untouched baselines).
- `-servicestudio-*` design-time rules.
- Patterns with no radius (Sidebar, Gallery, Form, List, Rating, …).
- Inner glyphs that are geometrically circular or not chrome (`50%`, `50px`, `$token-scale-150` on Scrollable Area thumbs).
- Layout leftovers (`02-layout`) unless they are widget chrome.

## Links

- `src/scss/01-foundations/_root.scss` — theme-layer knobs
- `src/scss/05-useful/_border-radius.scss` — `.shape-*` and legacy `.border-radius-*`
- `src/scripts/OSFramework/OSUI/GlobalEnum.ts` — `ShapeTypes`
- `src/scripts/OSFramework/OSUI/Helper/Dom.ts` — `GetBorderRadiusValueFromShapeType`
- `.claude/rules/scss.md` §13 Radius

## Date

2026-09-01
