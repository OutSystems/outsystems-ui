# ADR-0010: Border-radius theme layer and shape tier slots

## Status

Accepted — implemented (ROU-13017).

## Context

Low-code **Shape** is a layout-level choice that must restyle participating component
chrome in a subtree. A single inherited `--border-radius: 8px` cannot model the design
system: the same profile resolves to different pixel values per component category, and
size variants can shift the tier (Button Large + soft → `sm`/12px, Input Large + soft →
`xs`/8px).

The `outsystems-design-tokens` package ships **profile × tier** shape tokens
(`--token-shape-soft-xs`, `--token-shape-round-md`, …). OSUI must consume them through a
**shape tier slots** cascade (profile-slot pattern with two-axis resolution).

## Decision

### Tier slots + three `.shape-*` utilities

| Layer | Responsibility |
|---|---|
| `.shape-soft` / `.shape-round` / `.shape-rectangular` | Remap all tier slots (`--border-radius-2xs` … `--border-radius-2xl`) |
| Component CSS API | Read the tier appropriate to the component (and size modifier) |
| `:root` | Soft-profile defaults on every tier slot |

```scss
.shape-soft {
  --border-radius-xs: #{$token-shape-soft-xs};  // 8px
  --border-radius-sm: #{$token-shape-soft-sm};  // 12px
  // …all tiers
}
```

Component contract:

```scss
--osui-btn-border-radius: var(--border-radius-xs, #{$token-shape-soft-xs});
```

### Resolved design decisions

| # | Decision | Rationale |
|---|---|---|
| Q1 | Card uses **`xl`** tier for all shape profiles | Card is a primary surface container. **`xl`** keeps its corners visually distinct from controls (`xs`) and inline surfaces (`sm`), while still following the active profile when `.shape-*` remaps all tier slots. |
| Q2 | Alert uses **`sm`** tier for all shape profiles | Alert is a compact inline surface, not a full card. **`sm`** gives a softer corner than controls without matching card-scale chrome. |
| Q3 | Accordion corners use **`xl`** tier | Accordion chrome is surface-level (header + content panel). **`xl`** aligns accordion corners with card-level treatment in Figma rather than control-tier radius. |
| Q4 | Portaled patterns use **CSS local knob remaps** (see below) — no TS changes | Balloon, BottomSheet, and OverflowMenu render outside the layout subtree, so layout `.shape-*` does not inherit. TS still writes `var(--border-radius-{soft\|none\|rounded})`; each portaled root remaps those legacy knobs to the correct surface-tier **tokens** locally. |
| Q5 | **`--border-radius-softer` retired** | The old 16px intermediate knob duplicated what tier slots express explicitly. Consumers override `--border-radius-md`, `--border-radius-xl`, or another tier instead. |
| Q6 | Generated **`.token-shape-*`** utilities are not used by OSUI; **`.shape-*`** is the public API | Token utilities map one token to one class. Layout shape is profile-wide: **`.shape-soft` / `.shape-round` / `.shape-rectangular`** remap every `--border-radius-{tier}` slot at once — the contract apps and Placeholders use. |
| Q7 | Dropdown popup (all variants) uses **`lg`** tier; input/trigger uses **`xs`** | The list panel is an elevated surface (same tier family as other popups). The trigger and input remain control chrome and stay on **`xs`**, including when the popup is portaled to `<body>`. |

### Portaled patterns (Q4)

Balloon, BottomSheet, and OverflowMenu render **outside** the layout DOM subtree. A
`.shape-soft` class on a layout ancestor does not reach them through CSS inheritance.

**Chosen approach — CSS local knob remaps (no TS change):**

TypeScript continues to set `--osui-balloon-shape`, `--bottom-sheet-shape`, or
`--osui-overflow-menu-shape` to `var(--border-radius-{soft|none|rounded})` as before.
Each portaled root remaps the legacy knobs locally so `soft` resolves to the surface
tier (`sm`) and `rounded` to the surface round tier (`md`):

```scss
.osui-balloon {
  --border-radius-soft: #{$token-shape-soft-sm};
  --border-radius-rounded: #{$token-shape-soft-md};
  border-radius: var(--osui-balloon-shape, var(--osui-balloon-border-radius));
}
```

**Rejected — TS `.shape-*` class toggling:** would require TypeScript changes; tier
slots are achievable purely in SCSS via scoped knob overrides.

**Rejected — copying computed px values:** fragile, breaks token/theming overrides.

### Portaled dropdown popups (Q7)

VirtualSelect (Dropdown Search / Dropdown Tags) moves its list panel to `<body>`
(`dropboxWrapper: Body`). Dropdown ServerSide and OverflowMenu use the Balloon feature
for positioning; their balloon nodes remain in the pattern DOM unless explicitly moved
(e.g. inside Bottom Sheet content). Custom properties declared on
`.osui-dropdown-search` / `.osui-dropdown-tags` **do not inherit** to the VirtualSelect
dropbox on `<body>`. Without a `.shape-*` bridge on the portaled node, the dropbox
resolves tier slots from `:root` soft defaults, not from a layout Placeholder wrapper.

**Chosen approach — declare the CSS API on the portaled root** (tier slot on the
detached node; see also § Layout `.shape-*` on portaled popups for profile propagation):

```scss
// VirtualSelect — portaled to <body>
.vscomp-dropbox {
  --osui-dropdown-popup-border-radius: var(--border-radius-lg, #{$token-shape-soft-lg});
  border-radius: var(--osui-dropdown-popup-border-radius);
}

// Dropdown ServerSide — portaled balloon
.osui-dropdown-serverside__balloon.osui-balloon,
.osui-dropdown-serverside__balloon-container {
  --osui-dropdown-ss-popup-border-radius: var(--border-radius-lg, #{$token-shape-soft-lg});
}

// OverflowMenu — portaled balloon (tier lg)
.osui-overflow-menu__balloon.osui-balloon {
  --osui-overflow-menu-border-radius: var(--border-radius-lg, #{$token-shape-soft-lg});
  --osui-balloon-border-radius: var(--osui-overflow-menu-border-radius);
  --border-radius-soft: #{$token-shape-soft-lg};
  --border-radius-rounded: #{$token-shape-soft-lg};
}
```

Popup tier is always **`lg`** (`--border-radius-lg` slot). Input/trigger chrome
stays on **`xs`**.

### Layout `.shape-*` on portaled popups — Flatpickr vs VirtualSelect (Q7 follow-up)

Declaring the CSS API on the portaled root (above) is **necessary but not sufficient**
for layout-level shape profiles. The popup must also carry a `.shape-*` utility on the
**same DOM node** (or an ancestor of that node) so `--border-radius-{tier}` slots remap
to the active profile. A `.shape-round` class on a layout Placeholder is **not** an
ancestor of a `<body>`-direct child — inheritance from the layout subtree does not reach
portaled popups.

**Flatpickr (Datepicker / Monthpicker / Timepicker)** — the calendar is portaled to
`<body>` by the provider (Flatpickr default). OSUI declares popup tier slots on the
portaled root (`.flatpickr-calendar`, `.osui-datepicker-calendar`, …). **The OutSystems
platform additionally applies the active layout `.shape-*` class directly onto the
`.flatpickr-calendar` container** when the popup opens. That is why picker popups follow
the layout shape profile even though they are detached from the pattern root.

**VirtualSelect (Dropdown Search / Dropdown Tags)** — OSUI forces `dropboxWrapper:
'body'`. The `.vscomp-dropbox` receives the same SCSS CSS API declaration, but **no
equivalent bridge copies `.shape-*` onto the dropbox**. The popup resolves
`--border-radius-lg` from `:root` soft defaults and ignores layout `.shape-*` on a
wrapper. The trigger (`.vscomp-toggle-button`) still follows layout shape because it
remains inside `.osui-dropdown-search` / `.osui-dropdown-tags`.

**Dropdown ServerSide** — the balloon stays in the pattern DOM (FloatingUI positions
it; it is not reparented to `<body>` like VirtualSelect). Popup vars declared on
`.osui-dropdown-serverside .osui-balloon` inherit layout tier slots through the normal
subtree cascade without a platform class copy.

**Widget Dropdown (O11)** — `.dropdown-list` is `position: absolute` but remains a child of
`.dropdown-container`; layout `.shape-*` applies through inheritance.

| Popup | Portaled to `<body>` | Layout `.shape-*` reaches popup |
|---|---|---|
| Flatpickr calendar | Yes | **Yes** — platform adds `.shape-*` on `.flatpickr-calendar` |
| VirtualSelect `.vscomp-dropbox` | Yes | **No** — known gap; no class bridge today |
| Dropdown ServerSide balloon | No (in pattern DOM) | Yes — CSS inheritance |
| Widget `.dropdown-list` | No (in container) | Yes — CSS inheritance |

**Known gap — VirtualSelect:** closing it requires either (a) OSUI TS on open/close to
mirror the layout `.shape-*` from the pattern root onto `.vscomp-dropbox` /
`.vscomp-dropbox-wrapper`, or (b) the same platform mechanism used for Flatpickr applied
to VirtualSelect dropboxes. SCSS-only tier declaration on `.vscomp-dropbox` cannot fix
profile remapping alone.

**Rejected for VirtualSelect (documented for clarity):** relying on `.shape-*` at
`<html>` / `<body>` only — works globally but does not match per-layout Placeholder
shape scoping.

### Naming split

| Surface | Name | Why |
|---|---|---|
| TS `ShapeTypes.Sharp` | `'none'` | Low-code entity value |
| CSS utility | `.shape-rectangular` | Design language |
| TS `ShapeTypes.Rounded` | `'rounded'` | Low-code entity value |
| CSS utility | `.shape-round` | Matches token profile `round` |

### Legacy coexistence

- **`.border-radius-{none,soft,rounded,circle}`** on Tag, Avatar, Badge — unchanged
  (soft = 4px via `$token-border-radius-100`).
- **`--border-radius-soft`** — `#{$token-shape-soft-xs}` on `:root` for TS
  `GetBorderRadiusValueFromShapeType('soft')`; portaled roots remap to surface-tier
  tokens (`#{$token-shape-soft-sm}` / `#{$token-shape-soft-lg}`) without chaining
  through other `--border-radius-*` slots.
- **`--border-radius-rounded`** — retained for fixed pill/circle chrome (Switch, Radio,
  …) excluded from the shape cascade.

### Excluded from shape cascade

Switch, Radio, Carousel dots, circular/pill chrome, and other fixed-geometry patterns
documented in ROU-13017.

## Consequences

- Card default radius uses the **`xl`** tier slot (profile-dependent; soft profile = 8px per design tokens).
- Datepicker, Monthpicker, and Timepicker popups use **`lg`**; their inputs use **`xs`**.
- Upload uses **`xl`**; chat message, notification, tooltip balloon, and submenu items balloon use **`lg`**; submenu item links use **`none`**; floating-action button and item use **`md`**; pagination button uses **`xl`**.
- All dropdown popups (VirtualSelect `.vscomp-dropbox`, ServerSide balloon/container,
  O11 widget `.dropdown-list`) use **`lg`**; inputs/triggers use **`xs`**.
- VirtualSelect portaled popups (Dropdown Search / Tags) **do not** follow layout
  `.shape-*` until a class bridge exists (Flatpickr receives one from the platform;
  ServerSide and widget dropdowns inherit through the DOM subtree).
- Apps overriding `--border-radius-softer` must migrate to tier slots (e.g. `--border-radius-xl`).
- Chromatic baseline update required on `ROU-12714` branch policy.

## References

- `docs-internal/plans/shape-tier-slots.md`
- `src/scss/05-useful/_border-radius.scss`
- `src/scss/01-foundations/_root.scss`
