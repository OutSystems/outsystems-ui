<!-- This ADR documents the VirtualSelect 1.4.0 upgrade and related architectural decisions around validation ownership, security, and accessibility -->

# ADR-0002: VirtualSelect 1.4.0 Upgrade and OSUI Validation Ownership

## Status

Accepted

## Context

OSUI's Dropdown pattern wraps the VirtualSelect library (currently 1.1.0), which provides combobox functionality. The library underwent a significant 1.4.0 release that includes:

- **Accessibility improvements**: Added `aria-invalid`, `aria-describedby`, and live-region announcements for validation messages; conformance to WCAG 2.5.8 (target size) and WCAG 3.3.1 (error identification with non-colour cue)
- **Security enhancements**: Hardened attribute contexts (`data-value`, `aria-label`) to prevent XSS
- **Performance improvements**: Optimization of transitions and rendering

However, VirtualSelect 1.4.0's new validation features (error message element, live region, `aria-invalid` state) create a conflict with OSUI's existing validation architecture:

1. **Validation ownership**: OSUI owns Dropdown validation. The OutSystems platform calls `validation()` on the Dropdown API, which applies `.osui-dropdown--not-valid` and appends its own `.osui-dropdown-error-message` element styled with OSUI design tokens.

2. **Extensibility risk**: While `getProviderConfig()` does not currently pass VirtualSelect's `required` or `minValues` settings, the extensibility system (which merges arbitrary provider properties) means apps can still trigger the library's internal validation path through config overrides.

3. **Security gap**: VirtualSelect 1.4.0 hardened attribute contexts but does not sanitize HTML in the `description` field, which renders as live HTML in the option row. This was discovered as an XSS sink not covered by the library's own fixes.

4. **Motion preferences**: VirtualSelect 1.4.0 zeroes transitions under `prefers-reduced-motion` for some elements (dropbox, container, toggle button) but not others (toggle arrow, checkbox, option hover). OSUI's override stylesheet adds transitions not reached by the library's media query.

5. **Vendored integrity**: The library CSS is kept as a vendored copy of the upstream dist, which allows mechanical diffing on future upgrades. The 1.4.0 CSS uses escaped form (`\26A0`) for the error glyph; matching this form (while only decimal-formatting differs) preserves byte-faithfulness.

## Decision Drivers

- OSUI must maintain explicit ownership of Dropdown validation to ensure consistent user messaging and styling with OSUI design tokens.
- Apps using the Dropdown extensibility system must not reach a state where the combobox is marked `aria-invalid` with no discoverable reason or visible message (WCAG 2.4.3, 2.4.8, 4.1.2).
- VirtualSelect 1.4.0's accessibility improvements must be adopted (WCAG conformance uplift).
- Security holes (HTML rendering in `description` field) must be closed without requiring apps to upgrade Dropdown config.
- Motion preferences must be fully honoured across all transitions, even those added by OSUI's override stylesheet.
- Vendored library file integrity must be preserved to enable mechanical diffing against future upstream releases.

## Considered Options

### A. Validation Ownership

#### Option 1: Migrate to VirtualSelect's internal validation
- Pros: Reduces code duplication; library's validation is now WCAG-compliant in 1.4.0
- Cons: Breaks OSUI's ownership model; rethemes library messages through CSS only (fragile); extensibility becomes unsafe (apps can reach validation path unintentionally)

#### Option 2: Disable VirtualSelect's internal validation, keep OSUI validation (Chosen)
- Pros: Explicit ownership; safe extensibility (no library validation path reachable); consistent theming through OSUI tokens; allows future feature additions to Dropdown validation without library interference
- Cons: Adds a configuration line to every Dropdown init; library's new WCAG validation message is never rendered (but that validation path is dormant anyway in normal usage)

### B. Security: HTML in Description Field

#### Option 1: Document that descriptions must not contain markup (no code change)
- Pros: No change to API contract; users responsible for sanitization
- Cons: Security vulnerability shipped; apps unaware of the risk; affects persisted data (once description is escaped and stored, it stays escaped)

#### Option 2: Sanitize descriptions in getProviderConfig(), matching label treatment (Chosen)
- Pros: Closes XSS sink without breaking API; consistent treatment of all text fields; sanitized value reaches `customData` before option grouping (predictable); matches existing label sanitization
- Cons: Changes what `getSelectedValues()` returns for descriptions containing `<` or `>`; has a data-migration consideration for values already persisted in escaped form (deferred product decision)

### C. Motion Preferences Coverage

#### Option 1: Leave partial coverage, document the gap
- Pros: Minimal change; library did the work it intended to
- Cons: Four additional transitions skip the user's preference; incomplete conformance; poor UX for users with vestibular disorders

#### Option 2: Zero transitions in OSUI stylesheet under prefers-reduced-motion (Chosen)
- Pros: Complete coverage of all transitions; user preference fully honoured; non-invasive (stylesheet override does not edit vendored file)
- Cons: Duplicates media query logic; adds SCSS lines

### D. Vendored File Integrity

#### Option 1: Regenerate CSS from 1.4.0 library sources
- Pros: Cleaner (no hand-editing); new format applied consistently
- Cons: Loses ability to diff against upstream (original released CSS not preserved); changes formatting; makes future upgrade reviews harder

#### Option 2: Patch 1.4.0 library CSS by hand, verifying byte-faithfulness (Chosen)
- Pros: Preserves original released CSS for mechanical diffing; only decimal-formatting differs from upstream (reviewable); allows future diffs to show what actually changed between releases
- Cons: More manual work; must verify patched file matches original (done: whitespace- and quote-normalized confirmation)

## Decision Outcome

Chosen options:

- **Disable VirtualSelect's internal validation**, setting `disableValidation: true` in `getProviderConfig()`. This makes OSUI's validation ownership explicit and prevents unintended validation path execution through extensibility. Apps that explicitly want the library's validation can set `disableValidation: false` in their config (merged last in the init chain).

- **Sanitize the `description` field** in `getProviderConfig()` before `_groupOptions()` runs, using the same `OutSystems.OSFramework.OSUI.Helper.DomHandler` sanitization applied to labels. This closes the HTML rendering XSS sink without requiring apps to sanitize their own data. Note: This changes what `getSelectedValues()` returns for descriptions with `<` or `>`; a product decision is needed on whether to flip the `SanitizeDropdownValues` default (currently `false`).

- **Zero all Dropdown transitions under `prefers-reduced-motion`** in OSUI's `_virtualselect.scss` stylesheet, not the vendored library file. Target the four transitions not covered by VirtualSelect's own media query (toggle arrow rotation, checkbox background fade, checkbox check fade, option hover fade).

- **Match upstream's escaped form for the error glyph** in `_virtualselect_lib.scss` (`content: "\26A0"` instead of the literal character). Patch the vendored file by hand rather than regenerating, to preserve byte-faithfulness with the released 1.4.0 CSS and enable mechanical diffs on future upgrades.

### Changes Made

| File | Change | Rationale |
|------|--------|-----------|
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/AbstractVirtualSelectConfig.ts` | Add `disableValidation: true` in provider config merge | Make OSUI validation ownership explicit; prevent unintended validation path through extensibility |
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/_virtualselect_lib.scss` | Update to VirtualSelect 1.4.0 vendored CSS, patched by hand | Adopt WCAG improvements; preserve byte-faithfulness for mechanical diffs |
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/_virtualselect.scss` | Add `@media (prefers-reduced-motion: reduce)` block zeroing four transitions | Fully honour motion preferences; complete WCAG conformance |
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/VirtualSelect.d.ts` | Add TypeScript declaration for new library types (if needed) | Maintain type safety for library integration |
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/AbstractVirtualSelectEnum.ts` | No breaking changes (enum values remain stable) | Ensure backward compatibility |
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/README.md` | Update provider version to 1.4.0 | Document library version for maintainers |
| `ARCHITECTURE.md` | Update VirtualSelect provider version from 1.1.0 to 1.4.0 in External Integrations table | Keep documentation current |

Positive consequences:

- OSUI's validation ownership is explicit and cannot be bypassed through extensibility.
- XSS vulnerability in option descriptions is closed without requiring app-level changes.
- All Dropdown transitions respect `prefers-reduced-motion` (WCAG 2.3.3 conformance).
- VirtualSelect 1.4.0's accessibility and security improvements are adopted.
- Vendored library file integrity is preserved for future upgrades.
- No changes to the public `OutSystems.OSUI.Patterns.Dropdown` API.

Negative consequences:

- Description values containing `<` or `>` will be escaped in `getSelectedValues()` results (affects apps persisting descriptions in unescaped form; deferred product decision on `SanitizeDropdownValues` default flip).
- VirtualSelect's new validation message element is never rendered (acceptable because the validation path is dormant in normal usage and OSUI provides its own message through `.osui-dropdown-error-message`).
- `package.json` devDependency `virtual-select-plugin` left at `^1.1.0` (library JS ships as vendored module; 1.4.0 not yet published to npm).

## Links

- JIRA Epic: [ROU-12946](https://outsystemsrd.atlassian.net/browse/ROU-12946)
- VirtualSelect Release Notes: [1.4.0 Changes](https://sa-si-dev.github.io/virtual-select/#releases)
- Related Commits:
  - `89c6be0b5` - Update VirtualSelect provider to 1.4.0 (a11y, security, perf)
  - `721e2020` - Disable VirtualSelect internal validation
  - `7b7cba50` - Honour prefers-reduced-motion on OSUI Dropdown transitions
  - `b599345b` - Sanitize Dropdown option descriptions
  - `aff08b2f` - Match upstream escaped form for error-message glyph
- WCAG References:
  - [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)
  - [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/target-size-minimum.html)
  - [WCAG 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)

## Date

2026-08-10
