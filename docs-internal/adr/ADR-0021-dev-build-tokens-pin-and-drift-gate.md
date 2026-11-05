# ADR-0021: Pinned-tokens builds, the `dev-latest` dev build and the generated-files drift gate

## Status

Accepted (agreed by the team on ROU-13169, 2026-10-27; implemented in ROU-13182)

## Context

Eleven files in this repository are generated from other sources. Before this change, three had a drift check,
none of those checks ran in CI, and the last two design-tokens bumps shipped with stale generated files (PR #1286
changed only `package.json`; PR #1318 needed a follow-up commit). Running the full chain while implementing this
ADR again found stale files on `dev` (`stories/_helpers/token-data/elevation.ts`, and trailing-newline drift in
`docs-ai/`).

A second risk sat in the build. `build:tokens` generates `src/scss/tokens/` from whatever `outsystems-design-tokens`
is in `node_modules`, never from the pin in `package.json`. After a pull or a branch switch without `npm i`, the
build succeeded and compiled the old tokens into `dist/*.css`. That CSS was then pasted by hand into the O11 and
ODC modules, and its banner named only the library version.

Nothing built `dev` after a merge; the first CI build of merged code was the manually triggered release-candidate
workflow, and GitHub releases carried no files.

Constraints: public repository (fork PRs get no secrets); `package-lock.json` is gitignored (ADR-0007), so the
exact tokens pin is the only anchor; `.npmrc`'s `min-release-age-exclude[]` needs npm >= 11.17; the `template-*`
workflows are vendored copies that are not edited here.

## Decision Drivers

-   A module must never ship tokens other than the pinned ones, and the shipped CSS must say what it carries.
-   A stale committed generated file must not reach `dev`.
-   No new secrets, no new infrastructure, works on fork PRs.
-   Bumping tokens and refreshing the OML block snapshot stay deliberate, manual acts.

## Considered Options

-   **Tokens mismatch: fail vs auto-install.** Auto-install makes the build reach the network and mutate
    `node_modules`, and is a supply-chain surface. Rejected; the build fails with the two versions and "run `npm i`".
-   **Commit the generated tokens.** Moves the drift into the repo and reverses ADR-0007. Rejected.
-   **Dev build distribution: Actions artifact** (expires, needs login, no stable URL), **one pre-release per merge**
    (history nobody needs, release-list clutter, a prune job), **npm `next` dist-tag** (immutable version per merge,
    Key Vault token), **rolling `dev-latest` pre-release**. Chosen: the rolling pre-release.
-   **Drift gate: warn first vs block from day one.** Blocking chosen; the fix is one command.
-   **Drift gate: per-script `--check` flags only vs regenerate-and-compare.** Regenerate-and-compare chosen as the
    gate (covers generators without a check, and the SCSS entry files); the existing per-script checks still run
    first for their precise messages.
-   **Local git hooks, self-healing bot commits, `postbuild` chaining.** Deferred until data shows they are needed.

## Decision Outcome

1. **Tokens version check.** `scripts/check-tokens-version.mjs` runs first in `build:tokens` (so in every `dev`
   and `build`): it fails when the installed `outsystems-design-tokens` differs from the pin, when it is missing,
   or when the pin is not exact. `build:tokens` calls the `build-tokens` bin directly instead of through `npx`,
   which would otherwise resolve a missing package from the public registry.
2. **Build provenance in the CSS.** The production CSS gets a second, less prominent banner line,
   `/*! Tokens 2.6.0 • Commit fe093aecc • Built 2026-11-05 14:11 UTC */`, added at transpile time in
   `gulp/Tasks/ScssTranspile.js` (not in the committed SCSS entry files, which a SHA or date would dirty on every
   build; not in the dev bundle, whose sourcemaps it would shift).
3. **`dev-latest` dev build.** `.github/workflows/dev-build.yaml` runs on every push to `dev`, builds with
   `npm run build:osui`, moves the `dev-latest` tag to the commit and replaces the files of the pre-release
   "Dev build (unreleased)": the six `dist/` files plus `classic-theme/{O11,ODC}.OutSystemsUI.css` published as
   `Classic.{O11,ODC}.OutSystemsUI.css`. It re-asserts `--prerelease --latest=false` on every run and publishes only
   from `refs/heads/dev` of the upstream repository. It is separate from the release-candidate `pre-release.yaml`.
4. **The O11 and ODC modules are updated only from the `dev-latest` files**, never from a local build. Updating
   them automatically through ModelAPI may be revisited later, especially for ODC.
5. **Drift gate.** `npm run docs:regen` = `build:osui` + `docs:generate` (every generator in dependency order).
   `npm run docs:check` runs the per-script checks, then `docs:generate`, and fails when any committed generated
   file changed. It runs as its own job in `build.yaml` and blocks merges from day one. Generators were made
   deterministic for it: the CSS API manifest lost its `generatedAt` timestamp, and `docs-ai/` files end in
   exactly one newline.
6. **Manual by decision:** bumping the tokens pin (`npm run tokens:update`, now exact-pinned and followed by
   `docs:regen`) and the OML block snapshot (`npm run docs:ai:blocks`).

Positive consequences:

-   A local build can no longer compile the wrong tokens silently, and pasted CSS names its tokens version and commit.
-   One stable URL per file for the modules; no secrets beyond the workflow token.
-   Stale generated files are caught on the PR, with the fix in the log.

Negative consequences:

-   The PR build gains a parallel job (~2 minutes including install).
-   Transitive dependencies float (no lockfile): a new `style-dictionary` release that changes how token values are
    formatted makes the gate fail on the next PR until someone runs `docs:regen`. This is the gate doing its job,
    but the failing PR may not be the one that caused it.
-   `dev-latest` is a moving tag and a permanent pre-release entry at the top of the release list.
-   The `dev-latest` tag and release must not be protected by a tag ruleset, or the force-push fails.
-   The PR build job from the vendored `template-ts-build-project.yaml` still installs with Node 24's bundled npm;
    the npm 11.18 step it needs belongs in the shared reusable-workflows repository.

## Links

-   ROU-13169 — spike and team decisions
-   ROU-13182 — implementation
-   ADR-0007 — build and tooling hygiene (gitignored lockfile and tokens)
-   ADR-0011 — generated agent documentation

## Date

2026-11-05
