# ADR-0011: The theme-migration skill is the source of truth for migration facts

## Status

Accepted

## Context

Two documents tell people how to move custom CSS from the classic theme to the token-based one, for two different readers:

-   `.claude/skills/osui-theme-migration/` — the agent-facing procedure. Phases, triage tables, false-positive checks, commands that run against `classic-theme/` and `dist/` inside this repo.
-   `THEME-MIGRATION-GUIDE.md` — the customer-facing guide, published for app developers migrating by hand or pasting it into an assistant. Second person, commands written against the `old/` and `new/` bundle copies a customer would have.

Underneath the differing prose they restate the same facts. At the point this was examined, the two shared 222 of 311 variable names and 28 of 32 hex values, and the skill reference's nine retired-variable subsections mapped one-to-one, in the same order, onto the guide's nine. Three of six comparable table bodies were already byte-identical.

Both were hand-maintained, by people trying to keep them consistent, and both had drifted in ways no reader of either document alone could see:

-   The skill's class-rename detection command extracted whole selector lines and filtered to single bare lowercase classes. That silently dropped ~95 genuinely-removed classes — every PascalCase and underscored name the platform generates (`ThemeGrid_Container`, `ListRecords`, the `choices__*` family) and every class that only ever appears in a compound selector. The guide's command was correct. **The less accurate document was the agent-facing one.**
-   The guide's three dark-mode button recipes targeted only `.dark-mode`, while the skill's targeted `.dark-mode` and `.os-dark-theme`. The guide contradicted its own prose, which calls adding `.os-dark-theme` "the single most impactful dark-mode fix".
-   The guide's link recipe dropped `a[data-link]:focus`, so a customer following it would leave keyboard users without the colour change.
-   Font sizes were written `36 px` in one and `36px` in the other; border sizes carried the value in its own column in one and inline in the other.

None of these are the kind of error a careful reader catches, because a wrong value in a mapping table reads exactly like a right one.

Constraints:

-   Neither document is upstream of the other in any natural sense — **both are downstream of the compiled bundle**, and either can be the wrong one on a given fact, as the first two items above show in opposite directions.
-   The prose genuinely cannot be shared. The same check is `getComputedStyle` in a browser console for a customer and a `grep` against `dist/` for the agent. Both are correct for their reader.
-   A third consumer, `stories/Migration.mdx`, is planned and will want the same facts again.
-   This repo has no test runner, so any check has to be a standalone script.

## Decision Drivers

-   A migration fact should be stated once and corrected once.
-   The customer-facing document must not silently fall behind the one the team actually maintains.
-   Audience-appropriate prose must survive; a mechanism that flattens it is worse than the duplication.
-   Whatever is built has to survive a third consumer without redesign.
-   Low cost: no dependencies, no new infrastructure, consistent with the repo's existing generators.

## Considered Options

-   **Option 1 — Leave both hand-maintained, rely on review.**
    -   Pros: no tooling, no markers in the published guide, nothing new to learn.
    -   Cons: this is the status quo that produced all four defects above. Review demonstrably does not catch a wrong token name in a 90-row table.
-   **Option 2 — Generate the whole guide from the skill.**
    -   Pros: one document to maintain; perfect consistency by construction.
    -   Cons: destroys the audience-specific prose, which is roughly a third of each document and is deliberate. Also unsafe: the skill held the broken class-extraction command while the guide held the correct one, so a blind skill → guide generation would have overwritten a correct public document with a defect.
-   **Option 3 — A drift checker only, no generation.**
    -   Pros: catches divergence regardless of which side is wrong; no markers needed; cannot destroy anything.
    -   Cons: leaves the error-prone hand-copying of ten tables in place, so it spends its time reporting work a script could have done.
-   **Option 4 — Generate the shared tables only, leave everything else to the skill's own procedure.** *(chosen)*
    -   Pros: removes the hand-copying where the content is genuinely identical and preserves prose; the comparison is exact, so it has no heuristics to tune and cannot report a false positive.
    -   Cons: two sets of markers to keep wired; a correct fix made in the guide is reverted on the next sync; nothing mechanical guards the prose or the recipes.

## Decision Outcome

Chosen option: **Option 4**, because it is the only one that removes the duplication where the content is genuinely the same without destroying the duplication that exists for a reason.

**The skill is the source of truth for migration facts.** A fact is corrected in `.claude/skills/osui-theme-migration/references/`, never directly in the guide. Where the guide was found to be more accurate, the skill was corrected first and the guide then regenerated from it.

`scripts/sync-migration-guide.mjs` (`npm run docs:migration`) implements exactly one thing: ten tables delimited by `<!-- table:ID -->` in `references/variable-mapping.md` are copied into matching `<!-- generated:ID -->` blocks in the guide. `--check` reports drift and exits non-zero without writing, so it can gate CI. The comparison is exact string equality — no heuristics, no thresholds, no false positives.

Deliberately **not** generated or checked:

-   **All prose**, for the audience reasons above.
-   **The widget catalog.** The guide's *Framework defaults that changed* is an editorial projection of `references/widget-catalog.md` — five columns become three, the bucket folds into the widget name as `**Breaks** — Checkbox`, and `Classic` plus `New default` condense into one prose cell. Only 10 of 26 rows share a label. It is maintained in both places by hand.
-   **CSS recipes.** A second pass was built and then removed; see below.

**On the recipe checker that is not here.** A second pass was implemented that matched CSS blocks across the two documents by identifier overlap and reported selectors or properties present in the skill but missing from the guide. It worked, and it immediately found two real defects: the guide's three dark-mode button recipes targeted only `.dark-mode` while the skill's also targeted `.os-dark-theme`, and the guide's link recipe had dropped `a[data-link]:focus`. **Both were fixed, and the pass was then deleted.** It was 75 of the script's 216 lines and carried every heuristic in the file — Jaccard similarity, a tuned threshold, a hand-maintained list of audience-specific substitutions, CSS selector parsing — plus one permanent false positive, and it never gated anything. Its value was a one-time audit that has now been realised; keeping it as standing infrastructure to guard a rare event was not worth the upkeep. If recipe divergence proves recurrent, the approach is recorded here and in git history.

**Phase 5 of the skill closes the loop.** Tooling alone does not help if nothing tells an agent to run it, so the migration procedure now ends with a write-back step: record framework facts (not customer facts) in the skill, run the sync, hand-edit the three things it cannot do, and declare the skill edits in the migration report.

Positive consequences:

-   A migration fact is corrected in one place and reaches the customer-facing guide by command rather than by memory.
-   Drift is detectable no matter who introduced it, including a human editing the guide directly without going through the skill — which is the case Phase 5 cannot cover.
-   Finding a defect in the guide now prompts fixing the skill, which is where the next migration will read it.
-   `stories/Migration.mdx` can adopt the same marker mechanism without redesign.

Negative consequences:

-   The published guide now carries 10 invisible HTML comments, and the reference 11.
-   Prose and CSS recipes have no mechanical guard at all. Phase 5 instructs comparing them by hand, which is weaker than a check and is the accepted cost of not maintaining one.
-   Running `npm run docs:migration` without `--check` first will silently revert a correct fix made in the guide. Phase 5 instructs running `--check` first and the failure message names the file to edit, but the guardrail depends on reading the output.
-   The skill is now load-bearing for a public document, so its defects stop being local to it.

## Links

-   `scripts/sync-migration-guide.mjs` — the implementation, and `npm run docs:migration`.
-   `.claude/skills/osui-theme-migration/SKILL.md` — Phase 5, "Write back what this migration taught you".
-   `THEME-MIGRATION-GUIDE.md` — the generated target.
-   ROU-13079 — the spike that produced this guidance and surfaced the drift.
-   `scripts/generate-css-api-reference.mjs` — the existing precedent for generating docs from a source of truth rather than from another document.

## Date

2026-10-09
