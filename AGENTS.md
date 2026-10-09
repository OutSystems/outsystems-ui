# AGENTS.md

Vendor-neutral entry point for coding agents working on OutSystems UI. `CLAUDE.md` holds the detailed
conventions; this file is the short path to the right context.

## Read first

1. `docs-ai/llms.txt` — what the library is, the lifecycle of a pattern, the gotchas an agent must know, and
   which document to load next (one component card is about 450 tokens; never load `dist/*.d.ts`).
2. `docs-ai/llms-components.txt` (one card per pattern), `docs-ai/llms-patterns.txt` (CSS-only components,
   layout partials, helper classes), `docs-ai/llms-utilities.txt` (the utility grammar and every family),
   `docs-ai/llms-tokens.txt` (theme roles and `--osui-*` knobs). Machine-readable: `docs-ai/osui.components.json`,
   `docs-ai/osui.utilities.json`, config schemas under `docs-ai/schema/configs/`. An agent writing OML (the Model
   bridge dialects, Service Studio) composes blocks from `docs-ai/llms-blocks.txt` and `osui.enums.json` /
   `osui.icons.json` instead; the lines marked `[runtime-only]` do not apply to it.
3. `CLAUDE.md`, `ARCHITECTURE.md`, `CSS-ARCHITECTURE.md`, `.claude/rules/typescript.md`, `.claude/rules/scss.md`.

## Commands

| Command                            | Purpose                                                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run build`                    | Production build for O11 and ODC, then lint (zero errors and zero warnings)                               |
| `npm run lint` / `npm run lintfix` | ESLint over `src/scripts` (TSDoc rules included)                                                          |
| `npm test`                         | Unit tests of the docs generators and `ParseConfigs` (`tests/`)                                           |
| `npm run docs:ai`                  | Regenerate `docs-ai/` from the source; `npm run docs:ai:check` fails when the committed copy is stale     |
| `npm run types:generate`           | Regenerate the `Configs` and `EventName` types of every pattern (`PatternTypes.ts`)                       |
| `npm run blocks:export`            | Re-export the OML block snapshot from the one `.oml` under `scripts/ai-docs/snapshot/local/` (git-ignored) |

## Rules that matter most

- Comments are TSDoc: `/** */` on every exported function and every public config prop, `@param name text`
  and `@returns text`, no `{type}` braces, no `@export`/`@memberof`. The docs generator reads them, and ESLint
  warns on the rest (the build requires zero warnings).
- Public API functions return the JSON envelope from `CreateApiResponse`; only `Create` throws.
- `Create(id, configs)` accepts the platform's JSON string or a typed `Configs` object; the string path is
  unchanged `JSON.parse`.
- Styling goes through `--osui-*` knobs and `$token-*` variables, never literals; utilities follow
  `<property>[-<side>][-<value>]`.
- A pull request that touches a pattern's configuration, API, story or SCSS regenerates `docs-ai/` and
  `PatternTypes.ts` (`npm run types:generate && npm run docs:ai`); `npm test` fails while they are stale.
- Nothing here changes runtime behaviour without a documented decision: a breaking change is described with
  its impact, never applied silently.
