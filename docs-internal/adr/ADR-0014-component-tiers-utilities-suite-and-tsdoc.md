# ADR-0014: Component tiers, a utilities suite and TSDoc as the documentation source

## Status

Proposed

## Date

2026-09-30

## Context

The evals classified every component as `pattern` or `css`. The 69 `css` entries were five different
things: platform widget styles, host-styled layout partials of the app templates, CSS-only components with
an anatomy, single-purpose helper classes, and nothing at all for the 24 utility families of
`src/scss/05-useful` (about 540 classes), which no eval measured. Every row weighed the same, so a
three-line helper moved E07 to E09 as much as DatePicker, produced findings nobody could act on ("no
`--osui-*` knobs" on `margin-container`, "no breakpoint rules" on `align-center`), and two helpers were
declared host-styled only to silence a markup eval. Agents met the same flatness in the docs:
`llms-patterns.txt` told them not to generate the markup of a class that has no markup, and
`llms-utilities.txt` listed 554 names (nine of them the word `scss`, read from a source comment) without a
single declaration.

The source comments were JSDoc in the Closure style: 1,689 `@export`, `@memberof`, `@class` and similar
tags, 556 `@param {type}` braces duplicating the TypeScript types, 243 bare `@return {*}` lines, no
`@returns` text, no `@example`, no `@defaultValue`; 128 of 133 config props were documented with `//`
lines, which the agent-docs generator reads but TypeDoc does not. `typedoc.json` whitelisted eight
non-standard tags to keep the build quiet. The agent entry points were stale (`CLAUDE.md` said the
repository had no test runner) or missing (`AGENTS.md`), and the published `llms.txt` depended on a
manual docs deploy.

The review behind this decision is a working note, `docs-internal/ai-friendliness/2026-09-30-docs-tiers-utilities-review.md`.

## Decision Drivers

- A pattern change must move the pattern figure, and only that figure.
- A utility class must be measured for what it is (a name, a value on a scale, a token) and documented
  as a grammar an agent can derive from, not as a list to memorise.
- One reader, several projections: the comments, the cards, the manifests, the schemas and the evals must
  not drift from one another.
- Nothing may change runtime behaviour: comments, generated files, registry fields, new evals only.

## Decision

1. **Four tiers** (`evals/lib/tiers.mjs`): `pattern`, `component`, `layout`, `utility`. The directory gives a
   partial its default tier (`02-layout` → layout, `05-useful` and `04-patterns/06-utilities` → utility,
   else component); `evals/components.json` may override it (`animate`, `columns` → utility; `section`,
   `list-updating`, `provider-login-button` → component; `pull-to-refresh` → layout). `css` is still read
   as `component`. A metric lists the tiers it measures in `present.appliesTo`; a component outside them
   gets a not-applicable cell that names its tier, composed by the dashboard from the eval's list so the
   data set stays under the artifact database limit. Every suite reports, besides its index, an index per
   tier: the same evals scored over the components of one tier. The suite index keeps its definition, so
   the gate and the history are untouched; the per-tier figures are additive (`tiers` in run files,
   history entries and `dashboard.json` v4).
2. **A third suite, `utilities` (U01–U06)**, over the 24 families read from their compiled partials through
   `evals/lib/utilities.mjs`: naming grammar conformance, scale completeness, token routing, documentation
   parity, synonym pressure and responsive coverage (roadmap). The AI and enterprise suites leave utility
   classes to it. A utility class is the subject of a selector, so `.phone .phone-full-width` documents
   `phone-full-width`, never the body class `phone`.
3. **Grammar-first utility documentation**: `llms-utilities.txt` states the grammar
   (`<property>[-<side>][-<value>]`, the size scale with its tokens, hues and shades), then every family as
   template rows (`margin-{side}-{step}` for 48 classes) and single rows with their declarations;
   `osui.utilities.json` carries every class with declarations, variants and tokens. `llms-patterns.txt`
   groups components, layout partials and helper classes with a different contract each. U04 checks the
   documents cover every class through the same template function the renderer uses.
4. **TSDoc as the single documentation source**: `/** */` on every public config prop, `@param name text`,
   `@returns text` derived from the return type and the envelope for every API function, no type braces,
   no Closure tags; `eslint-plugin-jsdoc` in TypeScript mode warns on the remaining gaps (parameters without
   a text). E05 scores the facets (description, parameter texts, return text) instead of presence, and
   counts `llms-utilities.txt` as a fifth tier. E03 reads `@defaultValue` when the code makes no default
   explicit. The generator emits a JSON Schema per pattern's configs and a usage example with every
   default.
5. **Agent entry points and publication**: `AGENTS.md` (vendor-neutral), `CLAUDE.md` corrected, and the
   `docs-ai/` set published to the `evals-results` branch with every recorded run.

## Alternatives Considered

### Re-weighting rows inside the existing index

- Pros: a single figure per suite.
- Cons: redefines eleven history entries; hides the tiers instead of exposing them.
- Rejected: the per-tier view is additive and keeps the gate stable.

### U01–U06 inside the AI-friendliness suite

- Pros: one index fewer.
- Cons: the AI index would change definition; the utilities questions are their own (grammar, scale,
  variants), with their own roadmap items.
- Rejected: a suite is one registry entry; moving the metrics later is a one-line change.

### `typedoc-plugin-markdown` or TypeDoc JSON as the agent surface

- Pros: no generator of our own.
- Cons: five to ten times the tokens of the cards; a second model that knows nothing of the configs
  string, the lifecycle or the envelope; a second source that drifts.
- Rejected: TypeDoc stays the human reference; the comments are the source, the generator the projection.

### Tailwind-style short names (`p-4`, `mt-2`)

- Pros: familiar to agents trained on Tailwind.
- Cons: a second grammar over the same CSS, twice the class space to know, collisions with customer CSS.
- Rejected: `llms.txt` keeps saying they do not exist; the long-form grammar is published instead.

## Consequences

- `loop-13` records the new measurement population: the AI index moves by the removed helper rows, the
  enterprise index by the same, and E05 by its new facets; the utilities index starts at its first value.
  The per-tier tables in `HISTORY.md` and the dashboard tiles show the pattern figures on their own.
- Additive, owner-decided follow-ups the suite points at (`docs-internal/ai-friendliness/2026-09-30-docs-tiers-utilities-review.md`
  §3.3): grammar aliases for the legacy names, the missing scale steps, viewport variants; each is new
  selectors only.
- `npm run lint` reports the parameters still without a description as warnings; the rules become errors
  once they are written.
- Two partials sharing a file name keep one name each (`section`, `layout-section`); the inventory
  prefixes the one outside `04-patterns` with its directory group.

## References

- ADR-0011, ADR-0012, ADR-0013 (the suites, the registries, the self-describing metrics this builds on)
- ADR-0010 (the radius vocabulary the scale eval leaves alone)
- `evals/README.md`, `evals/utilities/README.md`, `evals/lib/tiers.mjs`, `evals/lib/utilities.mjs`
- `.claude/rules/typescript.md` §7 (the TSDoc convention)
