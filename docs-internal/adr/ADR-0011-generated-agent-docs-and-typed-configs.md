# ADR-0011: Generated agent documentation, typed pattern configs and the TSDoc comment standard

## Status

Proposed

## Context

Coding agents, and TypeScript callers in general, cannot read a pattern's contract cheaply. The contract is
distributed: props live in a configuration class, allowed values in enums or `validateInRange` calls, defaults
in a `switch`, markup only in Storybook stories, CSS knobs only in SCSS. Using one pattern correctly meant
reading about 2,650 tokens across 4–13 files (Dropdown: 13 files), against roughly 900 tokens for a component
of a single-file design system such as shadcn/ui. The compiled `dist/*.d.ts` is about 51k tokens and cannot be
loaded whole. Nothing in the repository was machine-readable: no `llms.txt`, no schema of the `configs` JSON,
no typed form of `Create(id, configs)`, and the comments used a Closure-era JSDoc dialect (`@param {string}`,
`@export`, `@memberof`) that neither TypeScript nor TypeDoc consumes and that had drifted from the code.

Constraints: no runtime behaviour change, no public-contract break, the existing dependency pins and the
Storybook platform layer untouched, lint at zero warnings, and the OutSystems UI module OML (the block
definitions an OML producer composes) is not part of this repository.

## Decision Drivers

-   An agent must be able to load one pattern's full contract in a few hundred tokens.
-   The documentation must not drift from the source: generated, deterministic, asserted by a test.
-   The descriptions must live next to what they describe, so the code's comments are the single source.
-   OML producers (the Model bridge dialects, Service Studio) need block signatures, not runtime markup.
-   Platform concepts the library does not define (screens, layouts, themes, blocks, accessibility) must be
    reachable from the same entry point.

## Considered Options

-   Option 1 — Hand-written agent docs maintained by people
    -   Pros: no tooling.
    -   Cons: drifts within weeks; 33 patterns × props × defaults is too much to keep by hand.
-   Option 2 — Generate `docs-ai/` and `PatternTypes.ts` from the source, with TSDoc as the description source
    -   Pros: cannot drift (freshness test); one command; the comments improve TypeDoc as well.
    -   Cons: a regeneration duty on every contract change; a lint rule set that changes the comment style.
-   Option 3 — An ES-module facade or per-pattern packages (a new composition model)
    -   Pros: fixes the discoverability problem at the root.
    -   Cons: a distribution-model change; out of scope for a behaviour-preserving change.

## Decision Outcome

Chosen option: "Option 2". Option 3 is recorded as future work.

### Commands added to `package.json`

| Command                  | Purpose                                                                                                                                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run docs:ai`        | Regenerates everything under `docs-ai/` from the TypeScript program, the compiled SCSS partials, the Storybook stories and the OML block snapshot. Deterministic: no timestamps, sorted keys, so a re-run on the same tree is a no-op. |
| `npm run docs:ai:check`  | Regenerates into a temporary folder and exits 1 when the committed `docs-ai/` differs (line endings ignored). The local guard against stale docs; it costs tens of seconds because it compiles the program and the partials.          |
| `npm run types:generate` | Regenerates `src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts` from the configuration classes and event enums of every pattern.                                                                                                     |
| `npm run blocks:export`  | Local extract only: runs the `osui-blocks-export` .NET tool over the one `.oml` under `scripts/ai-docs/snapshot/local/` and writes `scripts/ai-docs/snapshot/osui.blocks.json`. See "Running the extractor locally" below.           |
| `npm run docs`           | The TypeDoc build into `docs/`; the new `postdocs` step copies `docs-ai/` into that output so the documentation site serves `llms.txt` and the manifests at its root. See "TypeDoc output" below.                                   |

#### Running the extractor locally

The OutSystems UI module OML is not part of this repository and is never committed; the block snapshot is
the only OML-derived file in git. To refresh it:

1. Export the module from ODC Studio (or take the Forge `.oml`) and place it as the **one** `.oml` file under
   `scripts/ai-docs/snapshot/local/`. The folder is listed in `.gitignore`; any depth and any file name work.
2. Run `npm run blocks:export` (add `-- --platform O11` for the O11 module). The command accepts nothing else:
   it refuses to run when the folder is missing, empty or holds more than one `.oml`, so a stale or ambiguous
   input cannot produce a snapshot by accident. The written file records the OML's file name and SHA-256 in
   `source.origin`, which is how a reviewer knows which module a snapshot came from.
3. Run `npm run docs:ai && npm test` and commit the snapshot together with the regenerated `docs-ai/`.

The extractor itself (`osui-blocks-export`, a .NET 10 console tool) lives outside this repository: its project
folder is read from `OSUI_BLOCKS_EXPORT`, else `../osui-blocks-export` next to the checkout; `dotnet` is taken
from `DOTNET_ROOT`, else `PATH`. The wrapper script deliberately carries only the local-file path; fetching the
module from a source repository is out of scope until a shared, versioned source for the OML exists.

#### TypeDoc output

`npm run docs` runs TypeDoc over `src/scripts/{OSFramework,OutSystems,Providers}/OSUI/*.ts` (`typedoc.json`:
`entryPointStrategy: expand`, UML class diagrams, merged modules) and writes the HTML site into `docs/`.
`docs/` is git-ignored: it is a build output, regenerated on demand and never committed. It is produced in two
situations:

-   **Locally**, when a developer wants to read or check the API reference: `npm run docs`, then open
    `docs/index.html`. The `postdocs` step copies `docs-ai/` alongside, so `docs/llms.txt`,
    `docs/llms-components.txt`, `docs/osui.components.json`, … exist in the same tree.
-   **In CI**, by the `create-n-deploy-docs.yaml` workflow (manual `workflow_dispatch`): it runs `npm run docs`
    on the chosen branch, commits the output to the `deploy-docs` branch and publishes it to the documentation
    site (https://outsystems-ui-docs.github.io/). Because `postdocs` runs there too, the agent documentation is
    served from the site root, which is where an agent expects `llms.txt`.

TypeDoc reads the same TSDoc comments the generator reads, so the comment standard below serves both: a
description and `@param`/`@returns` texts render in the HTML reference, and the Closure tags that were removed
would have been ignored by it anyway.
| `npm test`               | `node --test tests/*.test.mjs`: unit tests of the generators, of `ParseConfigs`, and freshness assertions on every generated file. The library itself still has no local test runner; its E2E suite lives elsewhere.                    |

All generator code lives in `scripts/ai-docs/` (`README.md` there documents the modules and the snapshot
refresh procedure). It is plain Node (`.mjs`), outside `tsconfig` and outside `eslint --ext .ts`, and depends
only on `typescript`, `sass`, `postcss`, `postcss-selector-parser`, `prettier` and `gpt-tokenizer`.

### Generated files

| File                                           | Purpose                                                                                                                                                                         | Generated from                                                                                                                      | Impact                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `docs-ai/llms.txt`                             | The entry point: what the library is, the component index, who produces what (OML vs runtime), which file to read next, a pointer to the platform context, and the gotchas       | The manifest                                                                                                                        | Published at the docs-site root by `postdocs`; the first file an agent loads; kept under 1,600 tokens by a test |
| `docs-ai/llms-components.txt`                  | One card per TypeScript pattern: lifecycle, typed props with defaults and allowed values, events, API signatures, CSS classes, `--osui-*` knobs, config schema, docs link, markup | `*API.ts`, config classes, enums, compiled SCSS, stories                                                                            | About 450 tokens per card instead of about 2,650 tokens of source                                            |
| `docs-ai/llms-patterns.txt`                    | CSS-only components (skeleton and knobs), host-styled layout partials (never generated), helper classes                                                                         | Compiled SCSS partials, stories, `registry.json` (host, story aliases)                                                              | Tells an agent what markup it may emit and what the platform owns                                            |
| `docs-ai/llms-utilities.txt`                   | The utility-class grammar (`<property>[-<side>][-<value>]`), the size scale, hues and shades, and every family as template rows                                                  | Compiled `05-useful` partials                                                                                                       | Replaces guessing Tailwind-style names                                                                       |
| `docs-ai/llms-tokens.txt`                      | Framework theme roles (`--color-*`, `--border-radius-*`) and every `--osui-*` knob; legacy aliases marked                                                                       | Compiled SCSS                                                                                                                       | The theming surface, in one place                                                                            |
| `docs-ai/llms-blocks.txt`                      | One card per composable OutSystems UI block with OpenUI/TSX recipes                                                                                                             | The OML block snapshot and the block links of `registry.json`                                                                       | What an OML producer composes; `[runtime-only]` lines do not apply to it                                     |
| `docs-ai/llms-platform.txt`                    | ODC platform concepts (screens and layout placeholders, blocks, themes, screen templates, accessibility, icons) with their public documentation pages, and the documentation's pattern catalogue mapped to the runtime cards | `scripts/ai-docs/lib/platform-docs.mjs` (hand-curated, URLs verified when added) and the inventory | Keeps `llms.txt` under its token budget while giving agents the platform vocabulary; cards carry a `Docs:` slug |
| `docs-ai/osui.components.json`                 | The component cards as data, plus a usage example per pattern                                                                                                                   | Same readers as the cards                                                                                                           | Validated by `docs-ai/schema/osui.components.schema.json`                                                    |
| `docs-ai/osui.utilities.json`, `osui.icons.json` | Lookup tables: every utility class with its declarations and variants; every icon class of the installed fonts                                                                  | Compiled partials; the icon font stylesheets in `node_modules`                                                                      | Emitted compact (single line): read by programs, never by people                                            |
| `docs-ai/osui.blocks.json`, `osui.enums.json`  | The block cards as data; the static-entity values an OML parameter may take                                                                                                     | The OML block snapshot                                                                                                              | —                                                                                                            |
| `docs-ai/schema/configs/<Pattern>.schema.json` | JSON Schema of each pattern's `configs`, to validate before `Create`                                                                                                            | Configuration classes and enums                                                                                                     | Enum props carry the enum values (`'right'`), not member names                                               |
| `src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts` | Per pattern a `Configs` object type (optional, documented props) and an `EventName` union with a `(string & {})` escape hatch                                            | Configuration classes and event enums                                                                                               | Compiled into the bundle's `.d.ts`; `Create` and `RegisterCallback` reference these types                    |
| `scripts/ai-docs/snapshot/osui.blocks.json`    | The OutSystems UI module as an OML producer sees it: blocks, parameters, placeholders, events, API hints, static entities, structures                                            | `npm run blocks:export` over the local OML (`source.origin` records the file name and SHA-256)                                       | An input, not an output: a new snapshot changes the block docs; the OML itself is never committed            |
| `docs/` (TypeDoc site)                         | The human API reference with UML diagrams, plus a copy of `docs-ai/` at its root                                                                                                | `npm run docs` (TypeDoc + `postdocs`), locally on demand and in CI by `create-n-deploy-docs.yaml`                                   | Git-ignored build output; published to the documentation site, which is where `llms.txt` is served           |

Hand-maintained inputs: `scripts/ai-docs/registry.json` (only what the inventory cannot derive: a kind
override, utility-family titles, host-styled partials, story aliases, and the OML block each pattern or
stylesheet drives with its parameter and event maps; a test rejects anything else) and
`scripts/ai-docs/lib/platform-docs.mjs` (the public documentation pointers).

### Typed configs

`Create(id, configs)` accepts the platform's JSON string or a typed object. Both go through
`OSFramework.OSUI.Helper.ParseConfigs`, whose string path is byte-for-byte the previous `JSON.parse`; `null`,
arrays and numbers are rejected with a clear error instead of a `TypeError` later. `RegisterCallback` takes
`EventName`. `SwipeEvents` and `TouchEvents` gain `ChangeProperty` (error codes `OSUI-API-34001` and
`OSUI-API-35001`) so every pattern exposes the same canonical set. The `Orientation` alias in `Global.d.ts`
pointed at a namespace that does not exist and resolved to `any`; it now points at `OSFramework.OSUI.GlobalEnum`.
Everything that compiled before still compiles; JavaScript callers are unaffected.

### Comments, lint and TypeDoc

-   **TSDoc is the standard.** Every `/** */` block carries a description, `@param name text` per argument
    and `@returns text` when a value is returned. Types stay in the signature: no `{type}` braces. Public
    configuration props carry a one-line `/** */` comment, which is what the generator and TypeDoc read
    (`//` lines are invisible to both).
-   **Closure-style tags are gone**: `@export`, `@memberof`, `@class`, `@interface`, `@extends`,
    `@implements`, `@static`, `@template`, `@type`, `@return` (→ `@returns`). TypeScript derives all of that
    from the AST, TypeDoc ignored the tag values, and a third of the `@memberof` paths named the wrong
    namespace. `@param {number} x` had no effect in the IDE either: the language service reads the signature,
    and only the description text after the name reaches the hover. Modifier tags that carry meaning stay:
    `@protected`, `@private`, `@public`, `@readonly`, `@abstract`, `@deprecated`, `@defaultValue`, `@remarks`.
-   **ESLint enforces it** through `eslint-plugin-jsdoc` in TypeScript mode, scoped to `src/scripts/**/*.ts`
    (declaration files excluded): `no-types`, `check-tag-names` (with `defaultValue` and `remarks` allowed),
    `check-param-names`, `require-param-description`, `require-returns-description`, `empty-tags`; and on
    `OutSystems/OSUI/Patterns/*API.ts` additionally `require-jsdoc` (public functions), `require-param` and
    `require-returns`. The rules are at warning level, but `npm run build` requires zero warnings, so they
    are mandatory in practice. The rewrite left zero findings.
-   **TypeDoc** keeps its configuration except that the Closure tags were removed from `blockTags`; they were
    listed only to silence "unknown tag" warnings and no longer occur in the source.
-   **The generator is the consumer.** A new function or prop needs its comment before `docs-ai/` is
    regenerated, otherwise the card ships without a description and `require-param-description` warns.

### Stories follow `dev`'s markup; no stylesheet change ships with this work

-   The Provider Login Button logo rule (`.btn.btn-provider-login-logo svg`, a Sass nesting slip that matched
    nothing) was first fixed on this branch. ROU-13091 fixed the same selector on `dev` together with a wider
    style review of the component, so the branch was rebased onto that commit and its own stylesheet and
    `classic-theme` edits were dropped. The compiled CSS of both platform targets is byte-identical to `dev`:
    this change set is documentation, typings, tooling and stories only, and triggers no E2E tags.
-   ROU-13091 also removed the `OSInline` platform class from the PasswordPolicy and ProviderLoginButton blocks
    and moved the inline layout into the stylesheet (`display: inline-block` on `.password-policy_icon`, its
    sibling, and `.btn-provider-login-text-name`). The new stories reproduce the DOM those blocks emit *after*
    that change, without `OSInline`, so what Storybook renders is what the platform renders and the markup
    skeleton the docs generator reads from the stories stays truthful. Stories always follow the block
    markup on `dev`, never the other way round.

### Positive consequences

-   A pattern card costs about 450 tokens instead of about 2,650; the contract is explicit (defaults, allowed
    values, events, CSS knobs, markup skeleton, JSON Schema, documentation link).
-   TypeScript callers get typed configs and event names without a breaking change.
-   `llms.txt` points agents at the ODC documentation for screens, layouts, blocks, themes and accessibility,
    and maps the documentation's pattern names to the runtime cards.

### Negative consequences

-   Contract changes carry a regeneration duty (`npm run types:generate && npm run docs:ai`); with no CI
    check the guard is `npm test`.
-   The jsdoc lint rules reject the previous comment style in new code.
-   `blocks:export` depends on a machine-local .NET tool and a locally provided OML.
-   `platform-docs.mjs` is hand-curated: its URLs are checked when added, not by a test.

## Links

-   `scripts/ai-docs/README.md` — generators, snapshot provenance and the refresh procedure.
-   `AGENTS.md`, `docs-ai/llms.txt` — agent entry points.
-   `.claude/rules/typescript.md` §7 — the TSDoc rule in detail.
-   https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/ —
    the public documentation `llms.txt` points to.

## Date

2026-10-09
