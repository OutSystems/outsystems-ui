# Token Mapping Spec

Maps every current OutSystemsUI CSS custom property to its design-tokens replacement.
This is the working document for Phase 1 (token definitions) and Phase 2 (component SCSS replacement).

**Legend:**
- ✅ Direct match — value and intent are identical
- 🟡 Approximate — close enough, minor visual delta or confirmed rename
- 🔴 No match — keep as local var or propose addition to token package
- ❓ Unverified — mapping is a best guess, needs hex confirmation against actual token output

**Confirmed decisions applied throughout:**
- Prefix: `token` → `--token-*`
- `error` renamed to `danger` everywhere
- `grape` renamed to `purple`
- `cyan` renamed to `aqua`
- Neutral scale mapped by hex, not index
- `border-radius-rounded` 100px → 999px accepted
- App settings vars kept in `:root` but default to token values

---

## Spacing

| OSUI var | Value | Design Token | Token value | Status | Notes |
|----------|-------|-------------|-------------|--------|-------|
| `--space-none` | `0` | `--token-scale-0` | `0` | ✅ | |
| `--space-xs` | `4px` | `--token-scale-100` | `4px` | ✅ | |
| `--space-s` | `8px` | `--token-scale-200` | `8px` | ✅ | |
| `--space-base` | `16px` | `--token-scale-400` | `16px` | ✅ | |
| `--space-m` | `24px` | `--token-scale-600` | `24px` | ✅ | |
| `--space-l` | `32px` | `--token-scale-800` | `32px` | ✅ | |
| `--space-xl` | `40px` | `--token-scale-1000` | `40px` | ✅ | |
| `--space-xxl` | `48px` | `--token-scale-1200` | `48px` | ✅ | |

> Note: tokens also expose `--token-space-*` as aliases for scale — either works. Confirm which to use.

---

## Typography — Font Size

| OSUI var | Value | Design Token | Token value | Status | Notes |
|----------|-------|-------------|-------------|--------|-------|
| `--font-size-display` | `36px` | `--token-font-font-size-900` | `36px` | ✅ | |
| `--font-size-base` | `16px` | `--token-font-font-size-400` | `16px` | ✅ | |
| `--font-size-s` | `14px` | `--token-font-font-size-350` | `14px` | ✅ | |
| `--font-size-xs` | `12px` | `--token-font-font-size-300` | `12px` | ✅ | |
| `--font-size-label` | `11px` | `--token-font-font-size-275` | `11px` | ✅ | |
| `--font-size-h1` | `32px` | ❓ | ~32px | ❓ | Check token for 32px — may be `font-size-800` |
| `--font-size-h2` | `28px` | ❓ | `28px` | ❓ | |
| `--font-size-h3` | `26px` | ❓ | — | 🔴 | No 26px in token scale (25px or 28px nearby) |
| `--font-size-h4` | `22px` | ❓ | — | 🔴 | No 22px in token scale |
| `--font-size-h5` | `20px` | ❓ | `20px` | ❓ | Check token name |
| `--font-size-h6` | `18px` | ❓ | — | 🔴 | No 18px in token scale |

> **Issue:** OSUI heading sizes (26px, 22px, 18px) don't exist in the design-tokens scale. Decision needed: add these to the token scale, or use nearest available values.

---

## Typography — Font Weight

| OSUI var | Value | Design Token | Token value | Status | Notes |
|----------|-------|-------------|-------------|--------|-------|
| `--font-light` | `300` | `--token-font-font-weight-light` | `300` | ✅ | |
| `--font-regular` | `400` | `--token-font-font-weight-regular` | `400` | ✅ | |
| `--font-semi-bold` | `600` | `--token-font-font-weight-semi-bold` | `600` | ✅ | |
| `--font-bold` | `700` | `--token-font-font-weight-bold` | `700` | ✅ | |

---

## Borders — Size

| OSUI var | Value | Design Token | Token value | Status | Notes |
|----------|-------|-------------|-------------|--------|-------|
| `--border-size-none` | `0` | `--token-border-border-size-0` | `0` | ✅ | |
| `--border-size-s` | `1px` | `--token-border-border-size-025` | `1px` | ✅ | |
| `--border-size-m` | `2px` | `--token-border-border-size-050` | `2px` | ✅ | |
| `--border-size-l` | `3px` | `--token-border-border-size-075` | `3px` | ✅ | |

---

## Borders — Radius

| OSUI var | Value | Design Token | Token value | Status | Notes |
|----------|-------|-------------|-------------|--------|-------|
| `--border-radius-none` | `0` | `--token-border-border-radius-0` | `0` | ✅ | |
| `--border-radius-soft` | `4px` | `--token-border-border-radius-100` | `4px` | ✅ | |
| `--border-radius-rounded` | `100px` | `--token-border-border-radius-full` | `999px` | 🟡 | Visual delta — confirm with design |
| `--border-radius-circle` | `100%` | — | — | 🔴 | No `100%` in token scale; keep as local value |

---

## Elevation / Shadows

| OSUI var | Value | Design Token | Status | Notes |
|----------|-------|-------------|--------|-------|
| `--shadow-none` | `none` | — | 🔴 | No token for `none`; keep as-is or use `elevation.0` if added |
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.1)` | `--token-elevation-1` | 🟡 | Token is a two-layer shadow — verify visual match |
| `--shadow-s` | `0 2px 4px rgba(0,0,0,0.1)` | `--token-elevation-1` or `elevation-2` | 🟡 | Confirm which level matches |
| `--shadow-m` | `0 4px 6px rgba(0,0,0,0.1)` | `--token-elevation-2` | 🟡 | |
| `--shadow-l` | `0 6px 8px rgba(0,0,0,0.1)` | `--token-elevation-3` | 🟡 | |
| `--shadow-xl` | `0 8px 10px rgba(0,0,0,0.1)` | `--token-elevation-4` | 🟡 | |

> **Issue:** OSUI has 5 named shadow levels (`xs`–`xl` + `none`); tokens have 4 elevation levels. Need to decide if `xs` and `s` both map to `elevation-1`, or if a 5th level is added.

---

## Colors — Brand / Primary

| OSUI var | Value | Design Token | Status | Notes |
|----------|-------|-------------|--------|-------|
| `--color-primary` | `#1068eb` | `--token-semantics-primary-base` | ✅ | Base brand color |
| `--color-primary-hover` | `#295fd6` | `--token-semantics-primary-800` | ❓ | Confirm shade number |
| `--color-primary-selected` | `rgba(20,110,245,0.12)` | — | 🔴 | No token for this; keep as component-scoped var or add to tokens |
| `--color-primary-lightest` | `linear-gradient(...)` | — | 🔴 | Gradient value — no token equivalent; keep locally |
| `--color-secondary` | `#303d60` | — | 🔴 | No secondary brand token; map to `--token-primitives-indigo-1200`? Needs design input |

---

## Colors — Neutral

OSUI neutral scale (0–10, 0=white, 10=near-black) vs tokens (100–1200, 100=lightest, 1200=darkest).

| OSUI var | Value | Design Token | Status | Notes |
|----------|-------|-------------|--------|-------|
| `--color-neutral-0` | `#ffffff` | `--token-primitives-neutral-100` | ✅ | |
| `--color-neutral-1` | `#f8f9fa` | `--token-primitives-neutral-200` | ❓ | Verify hex match |
| `--color-neutral-2` | `#f1f3f5` | `--token-primitives-neutral-300` | ❓ | |
| `--color-neutral-3` | `#e9ecef` | `--token-primitives-neutral-400` | ❓ | |
| `--color-neutral-4` | `#dee2e6` | `--token-primitives-neutral-500` | ❓ | |
| `--color-neutral-5` | `#ced4da` | `--token-primitives-neutral-600` | ❓ | |
| `--color-neutral-6` | `#adb5bd` | `--token-primitives-neutral-700` | ❓ | |
| `--color-neutral-7` | `#6a7178` | `--token-primitives-neutral-800` | ❓ | |
| `--color-neutral-8` | `#4f575e` | `--token-primitives-neutral-900` | ❓ | |
| `--color-neutral-9` | `#272b30` | `--token-primitives-neutral-1100` | ❓ | OSUI has 11 shades; tokens have 12 — one level may not align |
| `--color-neutral-10` | `#101213` | `--token-primitives-neutral-1200` | ❓ | |

> **Issue:** 11 OSUI neutrals vs 12 token neutrals — the middle of the scale may drift. Needs hex comparison once token values are available.

---

## Colors — Semantic

> `error` → `danger` rename accepted. Affects all component SCSS — handled as a find-replace in Phase 2.

| OSUI var | Value | Design Token | Status | Notes |
|----------|-------|-------------|--------|-------|
| `--color-error` | `#dc2020` | `--token-semantics-danger-base` | ✅ | **Rename: `error` → `danger`** |
| `--color-error-light` | `#fceaea` | `--token-semantics-danger-100` | ❓ | Verify hex match |
| `--color-warning` | `#e9a100` | `--token-semantics-warning-base` | ✅ | |
| `--color-warning-light` | `#fdf6e5` | `--token-semantics-warning-100` | ❓ | |
| `--color-success` | `#29823b` | `--token-semantics-success-base` | ✅ | |
| `--color-success-light` | `#eaf3eb` | `--token-semantics-success-100` | ❓ | |
| `--color-info` | `#017aad` | `--token-semantics-info-base` | ✅ | |
| `--color-info-light` | `#e5f5fc` | `--token-semantics-info-100` | ❓ | |

---

## Colors — Extended Palette

OSUI has 12 color families × 7 shades. Tokens have 16 families × 12 shades.

| OSUI family | OSUI shades | Token family | Status | Notes |
|-------------|------------|-------------|--------|-------|
| `red` | lightest→darkest | `red` | ✅ | Different shade count — map OSUI 7 to token 12 (need hex comparison) |
| `orange` | lightest→darkest | `orange` | ✅ | |
| `yellow` | lightest→darkest | `yellow` | ✅ | |
| `lime` | lightest→darkest | `lime` | ✅ | |
| `green` | lightest→darkest | `green` | ✅ | |
| `teal` | lightest→darkest | `teal` | ✅ | |
| `cyan` | lightest→darkest | `aqua` | 🟡 | Renamed `cyan` → `aqua` |
| `blue` | lightest→darkest | `blue` | ✅ | |
| `indigo` | lightest→darkest | `indigo` | ✅ | |
| `violet` | lightest→darkest | `violet` | ✅ | |
| `grape` | lightest→darkest | `purple` | 🟡 | Renamed `grape` → `purple`; verify hex match |
| `pink` | lightest→darkest | `pink` | ✅ | |
| — | — | `pumpkin` | 🟡 | Token-only; exposed as new extended color vars |
| — | — | `magenta` | 🟡 | Token-only; exposed as new extended color vars |

> **Extended shade mapping** (OSUI 7 → token 12): needs explicit hex comparison.
> Proposed mapping: `lightest`→100, `lighter`→300, `light`→500, `''(default)`→700, `dark`→800, `darker`→900, `darkest`→1100

---

## Colors — Focus

| OSUI var | Value | Design Token | Status | Notes |
|----------|-------|-------------|--------|-------|
| `--color-focus-outer` | `#ffd337` | — | 🔴 | No focus color in token system; keep as-is or propose addition |
| `--color-focus-inner` | `var(--color-neutral-10)` | `--token-primitives-neutral-1200` | ❓ | Resolves to neutral-10 |

---

## Colors — App Settings / Surfaces

| OSUI var | Value | Design Token | Status | Notes |
|----------|-------|-------------|--------|-------|
| `--color-background-body` | `#f3f6f8` | `--token-bg-body` | 🟡 | Token is `#ffffff`; OSUI uses a light grey — **design decision** |
| `--color-background-login` | `#ffffff` | `--token-bg-body` | 🟡 | Same token? Or keep separate? |
| `--header-color` | `#ffffff` | — | 🔴 | No token; keep as app-settings override |
| `--overlay-background` | `rgba(0,0,0,0.25)` | `--token-backdrop` | 🟡 | Token backdrop is 70% opacity — **design decision** |

---

## Z-index / Layer System

The OSUI layer system is entirely computed (no hardcoded z-index values). Tokens have a z-index scale.

| OSUI var | Computed value | Design Token | Status | Notes |
|----------|---------------|-------------|--------|-------|
| `--layer-global-screen` | `0` | `--token-z-index-0` | ❓ | Verify token scale |
| `--layer-global-elevated` | `5` | `--token-z-index-100` | ❓ | |
| `--layer-global-navigation` | `10` | `--token-z-index-200` | ❓ | |
| `--layer-global-off-canvas` | `15` | `--token-z-index-300` | ❓ | |
| `--layer-global-instant-interaction` | `20` | `--token-z-index-400` | ❓ | |

> **Likely keep as-is.** The computed layer system is a strength of OSUI architecture. Replacing with static token values would lose the relative increment logic. Recommend keeping `--layer-*` vars but potentially anchoring `--layer-system-scale` to a token value.

---

## Component-level Semantic Tokens (Phase 3 targets)

These design-token component vars have no OSUI equivalent yet but should replace `get-*-color()` helper calls in Phase 3.

### Background
```
--token-bg-primary-base-default     → get-background-color('primary')
--token-bg-primary-base-press       → (hover/active states on primary bg)
--token-bg-primary-subtle-default   → get-background-color('primary-lightest') ?
--token-bg-neutral-subtle           → get-background-color('neutral-1') or 'neutral-2'
--token-bg-neutral-base             → get-background-color('neutral-3')
--token-bg-surface-default          → get-background-color('neutral-0')
--token-bg-body                     → --color-background-body
--token-bg-input-default            → get-background-color('neutral-0') on inputs
--token-bg-input-disabled           → get-background-color('neutral-2') on disabled inputs
--token-bg-input-read-only          → (read-only input bg)
--token-bg-danger-base-default      → get-background-color('error')
--token-bg-success-base-default     → get-background-color('success')
--token-bg-warning-base-default     → get-background-color('warning')
--token-bg-info-base-default        → get-background-color('info')
```

### Text
```
--token-text-default                → get-text-color('neutral-9') (body text)
--token-text-subtle                 → get-text-color('neutral-7')
--token-text-subtlest               → get-text-color('neutral-5') or 'neutral-6'
--token-text-disabled               → get-text-color('neutral-6')
--token-text-primary                → get-text-color('primary')
--token-text-danger                 → get-text-color('error')
--token-text-inverse                → get-text-color('neutral-0')
--token-text-link                   → get-text-color('primary')
```

### Border
```
--token-border-default              → get-border-color('neutral-5')
--token-border-subtle               → get-border-color('neutral-4')
--token-border-focus                → (focus ring border)
--token-border-input-default        → get-border-color('neutral-5') on inputs
--token-border-input-press          → get-border-color('primary') on focused inputs
--token-border-danger-base          → get-border-color('error')
```

---

## Items Requiring Design Input

These cannot be resolved without a design decision:

1. **`--color-secondary`** (`#303d60`) — no semantic token; map to a primitive or add semantic token?
2. **`--color-background-body`** (`#f3f6f8`) — token `--token-bg-body` is white; keep OSUI value or align to token?
3. **`--overlay-background`** — OSUI 25% opacity vs token 70%; intentional difference?
4. **`--color-focus-outer`** (`#ffd337`) — no token for focus color; add or keep?
5. **Heading font sizes** (26px, 22px, 18px) — not in token scale; add or substitute?
6. **`--border-radius-rounded`** (100px vs 999px) — visual difference on non-pill shapes; verify with design
7. **Shadow scale** (5 OSUI levels vs 4 token elevation levels) — which OSUI shadows collapse?
