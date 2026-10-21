# OutSystems UI · 3.0.0

Compiled CSS output of the pre-token-migration codebase — the **old theme** snapshot,
kept for reference and visual regression comparison only (served at /classic-theme in
Storybook for the "Theme" toolbar toggle).

Snapshot provenance: built from `dev` @ a67fcf378 (ROU-12926, v2.30.1, 2026-09-04).
Refresh by building `dev` (`npm run build`) and copying dist/*.OutSystemsUI.css here,
then replaying every entry under **Hand-applied ports** below.

> **The version above tracks the release, not the snapshot.** The heading of this file and
> the `OutSystems UI Classic <version>` banner at the top of both bundles are rewritten by
> `npm run update-version` ([gulp/Tasks/UpdateVersion.js](../gulp/Tasks/UpdateVersion.js)),
> so they report the shipped OutSystems UI version — the _snapshot's_ real version is the
> provenance line above. **After a refresh, re-sync the two banners by hand.** A refresh
> overwrites the bundles (not this file) with whatever `dev` emitted, so their banners stop
> matching the current version and the task skips them with a `⚠️ Skipped …` warning until
> someone sets them back. `dev` emits `OutSystems UI <version>`, so re-add the `Classic` word
> too: the task matches `OutSystems UI Classic <version>` only.

## Hand-applied ports

Changes back-ported from the new (token) theme by hand, de-tokenised onto the old
vocabulary. **A snapshot refresh wipes these** — replay every entry after rebuilding.
Procedure: `/port-to-classic` (see `.claude/skills/osui-classic-theme/SKILL.md`).

- **2026-08-27 — ROU-12992 / 6ce34d903 "add new layout rules"** — added
  `.layout.layout-side-no-header` (+ `.main-content`, `.app-menu-content`,
  `.app-login-info`, `.menu-icon` children) and the `.tablet` / `.phone`
  `--osui-layout-main-padding` override, in both bundles.
  Mapping: `$token-space-1000` (40px) → `--space-xl`; `$token-space-600` (24px) →
  `--space-m`; `$token-space-400` (16px) → `--space-base`;
  `$token-border-size-025` (1px) → `--border-size-s`.
  Approximations: `$token-border-subtle` (#e6eaee) → `var(--color-neutral-4)` (#dee2e6) —
  nearest step on the old neutral ramp, which was rebased by the token migration.
- **2026-08-27 — ROU-12992 (working tree)** — added
  `.layout.layout-side-no-header .app-menu-links{gap}` in both bundles.
  Mapping: `$token-space-200` (8px) → `--space-s`. Approximations: none (exact match).
- **2026-09-11 — autoprefixer correction to the 2026-08-27 ROU-12992 port (working tree)** —
  added the `-webkit-border-end` / `-webkit-border-before` prefix pairs the original port
  omitted on `.layout.layout-side-no-header .app-menu-content` and `.app-login-info`.
  Dev's own autoprefixer (`overrideBrowserslist: ['last 10 versions']`) does prefix
  single-side logical properties — see `.osui-submenu__header__icon` in a clean dev build —
  so the unprefixed port would not have applied on the older WebKit still in that range.
  `margin-block` / `margin-inline` are **not** prefixed, so `.menu-icon` needed no change.
- **2026-09-10 — ServiceStudio ApplicationTitle fix (working tree)** — added
  `.layout:not(.layout-side) .header-content > [data-block*=ApplicationTitle] .application-name`
  with `-servicestudio-display:none !important`, in both bundles, immediately after the
  `.phone/.tablet .app-menu-links a` SS-preview rule (same relative position as the new theme).
  Mapping: none needed — the rule is a single `-servicestudio-*` declaration with no token
  values, so it is byte-identical in both themes. Approximations: none.
- **2026-10-13 — RDINC-94039 DatePicker value hidden on Android Chrome M154+ (working tree)** —
  replaced the single `.osui-datepicker input[type=date]::-webkit-*` hiding block with the
  new theme's five compiled blocks, in both bundles, in place: spin button stays hidden
  everywhere; the calendar-picker indicator and `::-webkit-datetime-edit-*` fields are now
  hidden only on `[type=date]:not(.flatpickr-mobile)`; on `input.flatpickr-mobile`
  (type-agnostic — the mobile input is `type=datetime-local` when time is enabled) the
  input gets `position:relative`, the `::-webkit-datetime-edit` text is made click-through
  (`pointer-events:none`), and the indicator becomes an invisible full-input hit area
  (`position:absolute;opacity:0;z-index:1`) so taps anywhere — including on the text —
  open the native calendar.
  Mapping: none needed — no token values in these rules.
  Approximations: the new theme's `inset:0` was written as `top/right/bottom/left:0` —
  `inset` appears nowhere in the snapshot, so the longhands match its compiled-output era.
  The equivalent `.osui-timepicker input[type=time]` block was deliberately **not** changed
  (TimePicker not reproduced; out of scope of the fix).
- **2026-10-16 — DatePicker input width flicker (working tree)** — classic-only.
  On `.form-control[data-input], .form-control[data-textarea]` in both bundles,
  replaced `transition:all 180ms linear` with
  `border-color 180ms linear, background-color 180ms linear` (and the `-webkit-`
  prefix). Matches the new theme, where that selector never uses `transition:all`,
  so a redrawn DatePicker input no longer animates width. Timing kept at
  `180ms linear`. The leftover `.osui-datepicker input.flatpickr-input` override
  in O11 was removed; it targeted the hidden input. Safari `transition:none`
  is unchanged. Approximations: none.
- **2026-10-16 — DatePicker redraw skips input transition (working tree)** — added
  `.osui-datepicker.osui-datepicker--redrawn input.flatpickr-input` and
  `.osui-datepicker.osui-datepicker--redrawn input.flatpickr-input + input`
  immediately before `.safari input.flatpickr-input`, in both bundles. The class
  is set in `prepareToAndRedraw`, so only a recreated input matches. The visible
  field is the sibling after the hidden `.flatpickr-input`. Recreated inputs
  use `transition:none` (and `-webkit-transition`). The first create has no
  class, so it keeps `.form-control[data-input]`: border-color and
  background-color only, at `180ms linear`. Approximations: none.
- **2026-10-18 — ROU-13124 ChatMessage empty placeholders clipped in Service Studio (working tree)** —
  added `.chat-photo > div:empty` and `.right .chat-photo > div:empty` (negative margin on the photo-gap side, min-height, min-width; the new theme is 48px wide with the same 16px offset because its avatar is 32px, not 40px) immediately after `.chat-photo` and
  `.chat-message > div:empty` immediately after `.chat-message`, in both bundles. Each sets
  only `-servicestudio-*` properties, so neither has any effect at runtime. The block's placeholders
  carry no class, which is why the selectors are structural.
  Mapping: `$token-scale-400` → `var(--space-base)` (inside `calc(-1 * …)`), `$token-scale-1400` → `56px` (min-width), `$token-scale-1600` → `64px` (min-height), `$token-scale-4000` → `160px` (literals, because
  the old `--space-*` ladder stops at 48px). Approximations: none.

### Refresh log

- **2026-10-20 — ROU-13098 ODC-only removal of the "6.8 Deprecated Patterns" section (working tree)** —
  removed, from `ODC.OutSystemsUI.css` only: the whole `6.8. Deprecated Patterns` block (22 patterns,
  6.8.1–6.8.22), its `6.8.*` entries in the table of contents, and the `.osui-deprecated:before`
  Service Studio preview rule. Mirrors ROU-13057 (`41653843c`), which omits deprecated code from the ODC build.
  O11 snapshot is untouched (O11 still imports the deprecated preview). Replay: delete the same blocks after rebuilding.
  Not removed in this entry: `.osui-deprecated` selector lists elsewhere in the same file (excluder lists and
  a carousel selector), which are handled separately. Mapping: none (removal only).
- **2026-09-04 — refreshed d52518b15 → a67fcf378** (12 dev commits, v2.30.0 → v2.30.1).
  Both hand-applied ports above were replayed and verified: the refreshed snapshot now
  differs from a clean `dev` build by exactly those two blocks and nothing else.
  Dev CSS changes picked up by the refresh:
  `.osui-accordion-item__content--is-collapsed > div` (`display:none` →
  `visibility:hidden;contain:layout`, #1202/#1205); `.osui-tabs__content-item div:empty`
  replaced by `.ph:empty` / `.placeholder-empty:empty` (#1214/#1219); new
  `html[data-uieditorversion^="1"] .chat-message-status` SS-preview rules (#1219); ODC-only
  `.form .dropdown-container:has(> select.dropdown-display):after` (#1219).
