Compiled CSS output of the pre-token-migration codebase — the **old theme** snapshot,
kept for reference and visual regression comparison only (served at /deprecated in
Storybook for the "Theme" toolbar toggle).

Snapshot provenance: built from `dev` @ d52518b15 (ROU-12946, v2.30.0, 2026-08-11)
— the last dev state merged into the token-migration branch (ROU-12955 merge).
Refresh by building `dev` (`npm run build`) and copying dist/*.OutSystemsUI.css here.

## Hand-applied ports

Changes back-ported from the new (token) theme by hand, de-tokenised onto the old
vocabulary. **A snapshot refresh wipes these** — replay every entry after rebuilding.
Procedure: `/port-to-deprecated` (see `.claude/skills/osui-deprecated-theme/SKILL.md`).

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
