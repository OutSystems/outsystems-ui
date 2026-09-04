<!-- This ADR documents the standing policy and verification method for syncing the long-living new-theme branch with dev -->

# ADR-0005: Reconciling the New-Theme Branch with `dev`

## Status

Accepted

## Context

The token migration and UI refresh happen on the long-living integration branch `ROU-12714`, while `dev` continues to receive normal product work — bug fixes, provider upgrades, new patterns, toolchain changes. The two therefore diverge continuously; the first reconciliation covered **28 commits** of `dev` (up to `d52518b15`, v2.30.0) and produced 13 conflicts.

Two structural facts make these merges more than a routine `git merge`:

1. **The branch deliberately rewrote the styling layer.** Helper functions (`get-background-color()` and friends) were hard-removed, legacy vars (`--space-*`, `--font-size-*`, `--shadow-*`, `--border-size-*`) were retired, framework vars were renamed (`--side-menu-size` → `--size-side-menu`, `--header-size` → `--size-header`), and all pattern SCSS was consolidated from the scripts tree into `src/scss/04-patterns/`. Any SCSS arriving from `dev` is written against the *old* vocabulary and, in the case of brand-new files, **does not compile here at all**.
2. **Deletions on either side can silently destroy work on the other.** `dev` renamed the old Wizard styles into `10-deprecated/` — a tree this branch had deleted — so the merge removed this branch's already-restyled `_wizard.scss` *without reporting a conflict*.

## Decision Drivers

- Product fixes landing on `dev` must not be lost; the branch cannot become a fork.
- The new theme's visual decisions must not be silently reverted by incoming legacy styling.
- Resolution must be repeatable by anyone, since this recurs until the initiative merges back.
- Verification must catch defects that a source-level review cannot see.

## Considered Options

- **Option 1: rebase the branch onto `dev` each time** — Pros: linear history. Cons: rewrites a shared long-living branch that many feature branches are based on. Unacceptable.
- **Option 2: merge with a blanket strategy (`-X ours` / `-X theirs`)** — Pros: fast, no thinking. Cons: guaranteed to be wrong in one direction or the other; would either drop dev's fixes or revert the theme.
- **Option 3: merge with an explicit per-domain ownership policy, resolving each conflict on its merits** — Pros: correct; makes the reasoning reviewable. Cons: slow, requires judgement.
- **Option 4: cherry-pick only selected dev fixes** — Pros: minimal churn. Cons: leaves the branch permanently behind and makes the eventual merge worse.

## Decision Outcome

**Option 3**, with a standing ownership policy:

| Domain | Winner |
| :--- | :--- |
| UI / SCSS styling | **This branch** — it *is* the new theme |
| TypeScript behaviour, tooling, build system | **`dev`** |
| Menus (specifically) | **`dev`**, for now — the source of truth for that element |
| Anything ambiguous | Escalate and discuss; do not guess |

Corollaries:

- Dev's **functional** SCSS fixes are ported, never taken verbatim: they are re-expressed in the token vocabulary (e.g. `--space-base` → `$token-scale-400`, `--color-neutral-6` → `$token-icon-subtlest`). The pre-migration CSS snapshot in `legacy/` is the reference for what a legacy var was worth.
- Brand-new dev patterns are adopted as-is on the TS side, while their SCSS is relocated into `src/scss/04-patterns/` and translated, keeping this branch's `--osui-*` component API. (Wizard/WizardItem was the first case; its `_wizard.scss` had to be rewritten because it used removed helpers.)
- Generated entry files (`*.OutSystemsUI.scss`) are never hand-resolved — regenerate with `npm run create-osui-scss`.
- Deliberate deletions on this branch (`PatternsDeprecated.js`, `10-deprecated/**`, legacy `.submenu` styles) stay deleted every time.

**Verification is done on compiled artifacts, not sources.** Build both sides, diff `dist/` CSS and JS, cluster the CSS diff by selector, and grep the merged tree for retired constructs (`get-*(`, `--space-`, `--font-size-`, `--shadow-`, `--border-size-`).

Positive consequences:

- The artifact diff caught defects the source review missed: two retired-var leaks, the silently deleted Wizard styles, and (on a later sync) a platform-specific behaviour regression — see ADR-0006.
- It also produced a durable statement of the branch's true delta: the compiled JS differs from `dev` by only ~102 lines, all deliberate — the `LegacyTokenMap` runtime shim, two `GlobalEnum` var renames (`--footer-height` → `--size-footer`, `--header-size-content` → `--size-header-content`), a few behaviour tweaks, and prettier-only formatting noise. That list is the agenda for the eventual merge-to-`dev` review.
  > **Update (ROU-12975, 2026-08-20):** the `LegacyTokenMap` shim has since been deleted — `--space-*` was restored to `:root`, which was the only gap it genuinely covered — so the JS delta is now smaller than recorded above. The two `GlobalEnum` renames still stand.

Negative consequences:

- Each sync costs real analysis time; it cannot be delegated to a merge flag.
- The window between syncs is when drift accumulates, so syncing often is cheaper than syncing well.
- The first reconciliation was **squash-merged** upstream (PR #1206), so downstream branches that still carried the work locally received it as a fresh diff with no shared history rather than a fast-forward. Expect that shape again.

## Links

- PR #1206 — first reconciliation (28 commits of `dev`)
- `legacy/README.md` — provenance of the legacy-value reference snapshot
- ADR-0006 — a platform regression this reconciliation exposed

## Date

2026-08-12
