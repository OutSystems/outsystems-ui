# Utilities evals (U01–U06)

Six evals over the utility classes of `src/scss/05-useful` (24 families, about 540 classes): how predictable
and documented they are for an agent that composes styles from them, measured against what makes Tailwind
usable by agents (one grammar, a complete scale, theme-following values, class-to-CSS documentation, one name
per effect, viewport variants). They form their own **Utilities Index** (unweighted mean of U01–U06); the
AI-friendliness and enterprise suites do not measure utility classes.

```bash
npm run evals:utilities                  # this suite only (partial run, nothing written to history)
npm run evals -- --label <name>          # every suite; a full run updates history.json, HISTORY.md, dashboard.json
npm run docs:ai                          # regenerates llms-utilities.txt and osui.utilities.json (U04 reads them)
npm test                                 # includes evals/utilities/tests
```

| ID  | Eval                 | Class   | Measures (from the compiled partials, through `lib/utilities.mjs`)                                                                                            |
| --- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| U01 | Naming Grammar       | movable | classes named `<property>[-<side>][-<value>]` over the style families; `a11y` and `miscellaneous` are hooks, not applicable                                   |
| U02 | Scale Completeness   | movable | steps of `none xs s base m l xl xxl` each scalable property offers (margin, padding, gaps, font-size, shadow, border-size); radius keeps its shape vocabulary |
| U03 | Token Routing        | movable | themeable declarations (colour, spacing, radius, shadow, type size) that read a token; `0`, `auto` and keywords count as routed                               |
| U04 | Documentation Parity | movable | classes covered by a row of `llms-utilities.txt` (template or own name) and present in `osui.utilities.json` with declarations                                |
| U05 | Synonym Pressure     | movable | classes whose plain declarations equal another class's (`bold` = `font-bold`, `hidden` = `display-none`, teal = cyan)                                         |
| U06 | Responsive Coverage  | roadmap | layout and text families with a `.phone`/`.tablet`/`.desktop` variant; a product decision, not a refactor                                                     |

**Unit.** A row is a family (the heatmap cell), read from `ctx.compiledCss` of its partial. A class is the
_subject_ of a selector (its last compound): `.phone .phone-full-width` documents `phone-full-width` under
the context `.phone`, never `phone`, which is a body class the runtime sets.

**Grammar.** `lib/utilities.mjs` holds the heads, sides, steps, shades and hues, `classifyName`, and the
template keys (`margin-{side}-{step}`) the docs generator renders and U04 checks, so the two cannot drift.

**Non-breaking by construction.** Every improvement the suite points at is additive: an alias for a legacy
name, a missing step, a token behind a literal, a regenerated document, a viewport variant. Removing or
renaming a class would be a breaking change and is documented, never applied.
