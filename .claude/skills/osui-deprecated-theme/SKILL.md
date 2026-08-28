---
name: osui-deprecated-theme
description: Port SCSS changes from the token-based new theme into the deprecated (pre-token-migration) theme snapshot under deprecated/. Use this skill whenever a change lands in src/scss/** or src/scripts/**/scss/** and it also has to be reflected in the old theme — i.e. any time the words "old theme", "deprecated theme", "deprecated folder", "bring this to the old theme", or "backport to the pre-migration CSS" come up. Covers what the snapshot is, the token → legacy-var mapping table, the compiled-CSS formatting rules, insertion-point anchoring, and the verification checklist.
---

# Porting to the deprecated (old) theme

## 1. What `deprecated/` actually is

```
deprecated/O11.OutSystemsUI.css    ~774 KB
deprecated/ODC.OutSystemsUI.css    ~781 KB
deprecated/README.md
```

Two **compiled CSS snapshots** of the pre-token-migration codebase — not SCSS, not partials, not a build target. There is no source tree behind them in this repo; the SCSS they came from lives on `dev` at the commit recorded in `deprecated/README.md`.

Storybook serves them at `/deprecated/*` (`.storybook/main.ts` `staticDirs`) and the **Theme** toolbar toggle (`.storybook/preview.ts`) swaps between `/osui/*` (new token theme) and `/deprecated/*` (old theme) so reviewers can eyeball old vs new.

**Consequences that drive everything below:**

- Porting a change means **hand-editing compiled CSS**. There is no `npm run build` that will do it for you.
- Both files must be patched. They are separate platform bundles that share ~95% of their content; a rule present in one and absent in the other is a bug.
- Hand-applied edits are **destroyed by a snapshot refresh** (rebuild `dev`, copy `dist/*.OutSystemsUI.css` over these). So every port must be logged in `deprecated/README.md` under **Hand-applied ports** — that log is the only record that survives review and the only way a future refresh can be replayed.

## 2. The one hard rule: no tokens

The old theme predates `outsystems-design-tokens`. Its entire vocabulary is the `:root` block near the top of each file (search `/*! Typography - Size */`). Anything you add must resolve inside that vocabulary.

**Never** let a `--token-*` or `$token-*` reach these files. Invariant to check after every port:

```bash
grep -c -- '--token-' deprecated/*.css      # must stay 0 for both
```

## 3. Token → legacy-var mapping

Resolve the new theme's `$token-*` to its literal value first (`src/scss/tokens/_variables.scss`, gitignored but present locally — each line ends in a hardcoded fallback), then map the literal onto the old vocabulary.

### Spacing — `$token-scale-*` / `$token-space-*` → `--space-*`

| literal | old var      | | literal | old var |
|---------|--------------|-|---------|---------|
| `0px`   | `--space-none` | | `24px` | `--space-m` |
| `4px`   | `--space-xs`   | | `32px` | `--space-l` |
| `8px`   | `--space-s`    | | `40px` | `--space-xl` |
| `16px`  | `--space-base` | | `48px` | `--space-xxl` |

The old ladder has **eight** steps; the token scale has thirty-odd. `6px`, `10px`, `12px`, `20px`, `28px`, `36px`, `44px`, `56px`+ have **no** old equivalent — emit the literal px value and add a `/*! no old-theme equivalent */`-style note in the README log, not in the CSS (comments in the CSS body diverge from compiled output).

### Border size — `$token-border-size-*` → `--border-size-*`

| token | literal | old var |
|-------|---------|---------|
| `$token-border-size-0`   | `0px` | `--border-size-none` |
| `$token-border-size-025` | `1px` | `--border-size-s` |
| `$token-border-size-050` | `2px` | `--border-size-m` |
| `$token-border-size-075` | `3px` | `--border-size-l` |

Note the ladder stops at `075`. There is **no** `$token-border-size-100` — if you see one in the source, the source is broken (see §7).

### Border radius — `$token-border-radius-*` → `--border-radius-*`

Old vocabulary is only `none` (0) / `soft` (4px) / `rounded` (100px) / `circle` (100%). Map `$token-border-radius-0` → `--border-radius-none`, `-100` (4px) → `--border-radius-soft`, `-full` (999px) → `--border-radius-rounded`. `8px`/`12px`/`16px` radii (`-200`/`-300`/`-400`) do **not** exist in the old theme — the pre-migration look is a 4px-radius design. Prefer `--border-radius-soft` over a hardcoded larger radius unless the change is specifically about radius.

### Color

| new token | old var |
|-----------|---------|
| `$token-semantics-primary-base` | `var(--color-primary)` |
| `$token-semantics-danger-base` | `var(--color-error)` |
| `$token-semantics-warning-base` | `var(--color-warning)` |
| `$token-semantics-success-base` | `var(--color-success)` |
| `$token-semantics-info-base` | `var(--color-info)` |
| `$token-bg-body` / `$token-bg-surface-default` | `var(--color-neutral-0)` (white) or `var(--color-background-body)` for the page ground |
| `$token-text-default` | `var(--color-neutral-10)` |
| `$token-text-subtle` | `var(--color-neutral-7)` |
| `$token-border-subtle` (`#e6eaee`) | `var(--color-neutral-4)` (`#dee2e6`) |
| `$token-border-default` | `var(--color-neutral-5)` (`#ced4da`) |

The old theme's neutral ramp is `--color-neutral-0..10`; the new token neutrals were rebased, so exact hex matches are rare. Pick the nearest ramp step and say so in the README log.

**No fallback chains.** Write a single flat `var()` — the old theme's `:root` block defines
every one of these names unconditionally, so there is nothing to fall back *to*:

```css
/* right */  border:var(--border-size-s) solid var(--color-neutral-4);
/* wrong */  border:var(--border-size-s) solid var(--border-color-neutral-4, var(--color-neutral-4));
/* wrong */  border:var(--border-size-s) solid var(--token-border-subtle, #e6eaee);
```

The two-step chain is a *new-theme* mechanic: `$token-*` expands to `var(--token-*, <literal>)`
so the bundle still renders when the generated `:root` layer is absent. The old theme has no
generated layer and no token tier — the chain buys nothing and just makes the port
non-obvious to read.

You **will** see `var(--border-color-neutral-4, var(--color-neutral-4))` chains throughout the
existing snapshot content. Those come from the old `get-border-color()` / `get-background-color()`
helper functions (`.claude/rules/scss.md` §4) — a per-component semantic-override layer that
predates and is unrelated to token fallbacks. It is deprecated; **don't reproduce it in a port.**
Leave the existing occurrences alone.

### Typography / shadow

`--font-size-{h1..h6,display,base,s,xs,label}`, `--font-{light,regular,semi-bold,bold}`, `--shadow-{none,xs,s,m,l,xl}`. Map `$token-elevation-1..4` onto `--shadow-s`/`--shadow-m`/`--shadow-l`/`--shadow-xl` — the elevation tokens are two-layer shadows with no old equivalent, so this is a deliberate approximation. Log it.

### Layout plumbing — names differ, not just values

| new theme | old theme |
|-----------|-----------|
| `--size-side-menu` | `--side-menu-size` |
| `--size-header` | `--header-size` |
| `--size-bottom-bar` | `--bottom-bar-size` |
| `--layer-global-*`, `--layer-local-tier-*`, `--os-safe-area-*` | same names, no change |

This one bites: the `--size-*` / `*-size` flip is a rename, so a copy-paste port silently produces a dead `var()`.

## 4. The `--osui-*` component API layer — keep it

The deprecated snapshot already contains ~40 `--osui-*` custom properties (`--osui-balloon-shape`, `--osui-dropdown-min-width`, …) — the pattern-scoped-variable convention predates the token migration. So **keep the component CSS API structure** when porting; only the *defaults* get de-tokenised:

```css
/* new theme, compiled */
.layout.layout-side-no-header{
  --osui-layout-main-padding:var(--token-space-1000, var(--token-scale-1000, 40px));
}
/* deprecated port */
.layout.layout-side-no-header{
  --osui-layout-main-padding:var(--space-xl);
}
```

Do not flatten the var away — a reviewer comparing the two themes in Storybook should see the same override surface on both.

## 5. Formatting — match the compiled output exactly

These files were produced by dart-sass (compressed-ish `expanded` style) plus autoprefixer. Match it or the diff becomes unreadable:

- Two-space indent, one declaration per line.
- `{` sits directly against the selector, **no space**: `.foo{`
- **No space after `:`**: `padding:var(--space-xl);`
- `}` alone on its own line, no blank lines between rules.
- Comma-separated selectors: nested-`&` groups collapse onto one line (`.a .b, .a .c,`), distinct top-level selectors go on their own line. Copy the shape of the neighbouring rules.
- **Autoprefixer still applies.** Flexbox, `box-orient`, `transform`, `appearance`, gradients etc. need the `-webkit-`/`-ms-` prefixes the rest of the file carries. Logical properties (`border-inline-end`, `margin-block-start`) and custom properties pass through unprefixed — confirmed against the existing content.

## 6. Procedure

1. **Read the source change.** `git show <commit> -- 'src/**/*.scss'`, or `git diff`.
2. **Compile the new-theme SCSS in isolation** to see exactly what CSS the change produces, including selector nesting and ordering:
   ```bash
   npx sass --load-path=. src/scss/02-layout/_layout.scss | grep -B2 -A10 '<your-selector>'
   ```
   This is the shape you are porting — never hand-derive it from the SCSS.
3. **De-tokenise** each value using §3.
4. **Find the insertion anchor** — the compiled new theme's immediately-preceding rule, located in the deprecated file so the ported block lands in the same relative position:
   ```bash
   grep -n 'layout.layout-side.aside-overlay .main' deprecated/*.css
   ```
   Anchor on a **unique, multi-line, exact** string (selector + body). Assert `count == 1` before replacing.
5. **Patch both files** with one script, asserting anchor uniqueness and that the new selector is not already present:
   ```python
   for p in ('deprecated/O11.OutSystemsUI.css', 'deprecated/ODC.OutSystemsUI.css'):
       s = open(p, encoding='utf-8').read()
       assert '<new-selector>' not in s, p
       assert s.count(ANCHOR) == 1, p
       open(p, 'w', encoding='utf-8').write(s.replace(ANCHOR, ANCHOR + BLOCK))
   ```
   Prefer this over `sed` — these are 780 KB single-purpose files and a mis-anchored global substitution is hard to spot.
6. **Log it** in `deprecated/README.md` under **Hand-applied ports**: date, source commit/ticket, selectors added, and every approximation you had to make.
7. **Verify** (§8).

## 7. Check the source before porting it

Porting is the first time anyone reads the new SCSS closely, so it catches source bugs. Two that this repo's shape makes easy to ship:

- **Un-interpolated `$token-*` inside a custom property.** SCSS does not evaluate a variable in a custom-property *value* — it emits the text verbatim. `--osui-x: variables.$token-space-1000;` compiles to the literal string `variables.$token-space-1000` and silently produces invalid CSS. It must be `--osui-x: #{variables.$token-space-1000};` (`.claude/rules/scss.md` §2/§3).
- **A non-existent token, hidden by that same non-evaluation.** Because the value is never evaluated, a typo'd token name raises **no** compile error. Confirm every token you touch exists: `grep -n '^\$token-border-size' src/scss/tokens/_variables.scss`.

Fix the source first, recompile, then port the corrected output. Tell the user what you fixed.

## 8. Verification checklist

```bash
grep -c -- '--token-' deprecated/*.css                 # 0, both files
grep -c '<new-selector>' deprecated/*.css              # identical count, both files
grep -o -- '--osui-<component>-[a-z-]*' deprecated/*.css | sort | uniq -c   # same vars, same counts
git diff --stat deprecated/                            # identical insertion count per file
git diff deprecated/O11.OutSystemsUI.css               # read it; formatting must be indistinguishable
```

Then, for anything visual: `npm run storybook`, flip the **Theme** toolbar to *Deprecated theme*, and confirm the ported rule takes effect. Also grep that every selector the ported block targets actually exists in the old theme — the old markup contract may differ:

```bash
grep -n 'app-menu-content\|app-login-info\|main-content' deprecated/ODC.OutSystemsUI.css | head
```

A ported rule targeting a class the old theme never emits is dead CSS; say so rather than shipping it silently.

## 9. What not to do

- Don't hand-edit `src/scss/O11.OutSystemsUI.scss` / `ODC.OutSystemsUI.scss` (regenerated every build) — unrelated files, easy to confuse by name with the `deprecated/` ones.
- Don't rebuild the snapshot to apply a port. A refresh from `dev` wipes every prior hand-applied port.
- Don't reformat, minify, or run Prettier over `deprecated/*.css`. They are byte-comparable artefacts; a reformat destroys that.
- Don't write **any** `var()` fallback chain — not a token one (`var(--token-space-1000, var(--space-xl))`), not an old semantic-override one (`var(--border-color-neutral-4, var(--color-neutral-4))`). One flat `var(--old-name)` per value (§3).
- Don't port to only one platform bundle.
