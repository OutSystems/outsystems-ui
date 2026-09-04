---
description: Port a new-theme SCSS change into the legacy (pre-token) theme snapshot under legacy/
argument-hint: "[commit-ish | file path | nothing for the working diff]"
---

# Port to the legacy theme

Backport the change described by `$ARGUMENTS` from the token-based new theme into the legacy pre-migration CSS snapshot in `legacy/`.

`$ARGUMENTS` may be:
- a commit-ish (`HEAD`, `6ce34d903`, `HEAD~3..HEAD`) → port that commit's SCSS changes
- one or more paths → port the working-tree changes in those files
- empty → port the working-tree + staged SCSS changes (`git diff HEAD -- '*.scss'`), falling back to `HEAD`'s SCSS changes if the tree is clean

---

## Authoritative procedure

@.claude/skills/osui-legacy-theme/SKILL.md

Follow it as written. The steps below are the execution order, not a substitute for the skill.

## Steps

1. **Resolve the change set.**
   - Commit-ish → `git show <ref> -- 'src/**/*.scss'`
   - Paths → `git diff HEAD -- <paths>`
   - Empty → `git diff HEAD -- '*.scss'`; if empty, `git show HEAD -- 'src/**/*.scss'`
   - If the change set contains no SCSS, stop and say so — there is nothing to port. TypeScript changes have no legacy-theme counterpart.

2. **Audit the source before porting** (skill §7). For every `$token-*` the diff touches:
   - Confirm it exists: `grep -n '^\$token-<name>' src/scss/tokens/_variables.scss`
   - Confirm custom-property declarations use `#{...}` interpolation
   Fix any source bug found, recompile, and report the fix. Do not port broken output.

3. **Compile the changed partial in isolation** to get the exact CSS being ported:
   ```bash
   npx sass --load-path=. <changed-partial> | grep -B3 -A15 '<new-selector>'
   ```

4. **De-tokenise** every value using the skill's mapping tables (§3). Keep the `--osui-*` component API structure (§4). Note every approximation you are forced to make.

5. **Locate insertion anchors** in both `legacy/O11.OutSystemsUI.css` and `legacy/ODC.OutSystemsUI.css` — the compiled new theme's immediately-preceding rule, so the block lands in the same relative position.

6. **Patch both files** with a single Python script that asserts anchor uniqueness and non-duplication before writing (skill §6 step 5). Match the compiled formatting exactly (skill §5): `selector{`, no space after `:`, two-space indent, autoprefixer prefixes where the surrounding file carries them.

7. **Log the port** in `legacy/README.md` under a `## Hand-applied ports` heading (create it if absent). One entry per port:
   ```
   - **<date> — <ticket / commit>** — <selectors added>.
     Mapping: <token> → <old var> (…). Approximations: <…, or "none">.
   ```
   This log is what survives a snapshot refresh; without it the port is silently lost.

8. **Verify** (skill §8) and report:
   - `grep -c -- '--token-' legacy/*.css` → must be 0 for both
   - identical selector/var counts across both files
   - `git diff --stat legacy/` → same insertion count per file
   - read `git diff legacy/` and confirm the formatting is indistinguishable from surrounding content
   - confirm every selector the port targets actually exists in the old theme; if one doesn't, flag it as dead CSS rather than shipping it quietly

## Output

Report, concisely:
- what was ported (selectors, both bundles)
- the token → legacy-var mapping applied
- every approximation or value with no old-theme equivalent
- any source bug fixed on the way
- the verification results

Do not commit unless asked.
