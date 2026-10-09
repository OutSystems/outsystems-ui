# Agent documentation generators (`scripts/ai-docs/`)

Everything under `docs-ai/` and `src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts` is generated from the
source by the scripts in this folder. Nothing here runs in the browser; the generators read the TypeScript
program, the SCSS partials, the Storybook stories and the OML block snapshot, and write deterministic files
(no timestamps, sorted keys), so re-running on the same tree yields identical bytes.

| Entry point                  | npm script           | What it does                                                                                                   |
| ---------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `generate-ai-docs.mjs`       | `npm run docs:ai`    | Writes `docs-ai/`: the `llms*.txt` tiers, the component / utilities / blocks / enums / icons manifests, schemas |
| `check-ai-docs-fresh.mjs`    | `docs:ai:check`      | Regenerates into a temp folder and exits 1 when `docs-ai/` differs (CRLF-insensitive)                          |
| `generate-pattern-types.mjs` | `types:generate`     | Writes `PatternTypes.ts`: per pattern a `Configs` object type and an `EventName` union                          |
| `export-snapshot.mjs`        | `blocks:export`      | Runs the `osui-blocks-export` .NET tool and writes `snapshot/osui.blocks.json`                                  |
| `publish-ai-docs.mjs`        | `postdocs`           | Copies `docs-ai/` into the TypeDoc output so the docs site serves `llms.txt` at its root                       |

`lib/` holds the readers (`ts.mjs`, `scss.mjs`, `markup.mjs`, `inventory.mjs`, `tokens.mjs`, …) and the
renderers (`ai-docs.mjs`, `ai-docs-blocks.mjs`, `ai-docs-icons.mjs`, `pattern-types.mjs`). `lib/platform-docs.mjs`
is the one hand-curated content module: the public ODC documentation pages for the concepts this library does
not define and the documentation's pattern catalogue mapped to runtime names; it renders `docs-ai/llms-platform.txt`
and the `Docs:` slug on every card (check a URL resolves before adding it). `registry.json`
classifies every component the inventory discovers (kind, utility title, host-styled partials, story aliases,
and the OML block each pattern or stylesheet drives, with its parameter and event maps). The tests live in
`tests/` (`npm test`) and fail when a generated file is stale.

## When to regenerate

Any change to a pattern's configuration class, public API, enum, story markup, SCSS classes or `--osui-*`
knobs changes the generated output. Run and commit:

```bash
npm run types:generate && npm run docs:ai
npm test
```

## The OML block snapshot

`snapshot/osui.blocks.json` is the OutSystems UI module as an OML producer sees it: every block's flow, name,
input parameters (type, kind, default, description), placeholders, events and the `*API` names its JavaScript
reaches, plus the static entities and structures those parameters reference. `snapshot/osui.blocks.schema.json`
describes the file and a test validates it. The block docs (`llms-blocks.txt`, `osui.blocks.json`,
`osui.enums.json`) are rendered from it.

**Provenance.** The committed snapshot is pinned to a local OML: `source.origin` carries the file name
(`path`) and its SHA-256. The OML is never committed.

**Refreshing it (local extract).**

1. Export the OutSystems UI module from ODC Studio (or take the Forge `.oml`) and drop it as the one `.oml`
   file under `snapshot/local/` (git-ignored; any depth; the name is free).
2. `npm run blocks:export` (`-- --platform O11` for the O11 module). The command refuses to run when the
   folder is missing, empty or holds more than one `.oml`, and accepts no other arguments.
3. `npm run docs:ai && npm test` — the block docs follow the snapshot; commit the snapshot and `docs-ai/`.

The exporter is the `osui-blocks-export` .NET console tool, kept outside this repository: its project folder
is read from `OSUI_BLOCKS_EXPORT`, else `../osui-blocks-export` next to the checkout (or next to its worktrees
folder). It needs the .NET 10 SDK (`DOTNET_ROOT`, else the first `dotnet` on `PATH`) and the OutSystems Azure
NuGet feed to build.
