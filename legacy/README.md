Compiled CSS output of the pre-token-migration codebase — the **old theme** snapshot,
kept for reference and visual regression comparison only (served at /legacy in
Storybook for the "Theme" toolbar toggle).

Snapshot provenance: built from `dev` @ a67fcf378 (ROU-12926, v2.30.1, 2026-09-04).
Refresh by building `dev` (`npm run build`) and copying dist/*.OutSystemsUI.css here,
then replaying every entry under **Hand-applied ports** below.

## Hand-applied ports

Changes back-ported from the new (token) theme by hand, de-tokenised onto the old
vocabulary. **A snapshot refresh wipes these** — replay every entry after rebuilding.
Procedure: `/port-to-legacy` (see `.claude/skills/osui-legacy-theme/SKILL.md`).

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

### Refresh log

- **2026-09-04 — refreshed d52518b15 → a67fcf378** (12 dev commits, v2.30.0 → v2.30.1).
  Both hand-applied ports above were replayed and verified: the refreshed snapshot now
  differs from a clean `dev` build by exactly those two blocks and nothing else.
  Dev CSS changes picked up by the refresh:
  `.osui-accordion-item__content--is-collapsed > div` (`display:none` →
  `visibility:hidden;contain:layout`, #1202/#1205); `.osui-tabs__content-item div:empty`
  replaced by `.ph:empty` / `.placeholder-empty:empty` (#1214/#1219); new
  `html[data-uieditorversion^="1"] .chat-message-status` SS-preview rules (#1219); ODC-only
  `.form .dropdown-container:has(> select.dropdown-display):after` (#1219).
