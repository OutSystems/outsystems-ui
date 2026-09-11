<!-- This ADR documents build/tooling decisions taken to make the repo buildable from a clean clone and reproducible in CI -->

# ADR-0007: Build and Tooling Hygiene

## Status

Accepted (the lockfile question in §D remains **open** — see Decision Outcome)

## Context

A cluster of build failures during the new-theme work shared one root cause: **the build was not reproducible from a clean checkout.** Each surfaced only in CI, because local machines carried state that masked it.

- **`npm run build` could not run on a fresh clone.** `cleanOldFiles` called `gulp.src('./dist/*')` unguarded, which throws `ENOENT: scandir .../dist` when `dist/` (gitignored) does not exist yet. `dev` had already fixed this, but the fix had never reached the integration branch.
- **TypeScript compiled against accidentally-included type packages.** `tsconfig.json` left `types` unset, so TypeScript auto-included all 20+ `@types/*` packages that dev tooling pulls in transitively — none declared, none needed by this browser-only ambient-namespace library. With no committed lockfile, CI floated to the newest versions; `@types/node` 26 used TypeScript-5.0-only syntax (`const` type parameters in `ffi.d.ts`) and produced 50 parse errors against the then-pinned TypeScript 4.9. `skipLibCheck` does not suppress parse errors.
- **Fixing that broke something else.** With `types: []`, `Array.prototype.flat()` in the VirtualSelect provider stopped compiling — it had only ever worked because `@types/node` was dragging newer `lib` definitions in via reference directives.
- **`npm run docs` deleted tracked documentation.** TypeDoc cleans its `out` directory (`./docs`) before writing, and hand-written architecture docs had been placed there.
- **Documented commands did not work.** `npm run build:osui` was referenced in three files but never defined; and the documented `npm run dev -- --target O11` cannot work — Gulp reads `npm_config_target`, which `--` bypasses, and the platform maps are keyed lowercase with a case-sensitive lookup.
- **Token generation flags had drifted** across `prebuild`, `predev`, `build:tokens` and `tokens:update`.

## Decision Drivers

- A clean clone must build, on a developer machine and in CI alike.
- Failures should be caused by the repository's own code, not by transitive dependency drift.
- Commands documented in the repo must actually work.
- Divergence from `dev` in shared tooling files should be minimised (ADR-0005).
- Nothing internal may leak into this public repository.

## Considered Options

### A. Insulating the TypeScript program

- **Option 1: pin `@types/node`** — Pros: minimal. Cons: fights the symptom; any of the other 20 packages can break the build next.
- **Option 2: upgrade TypeScript** — Pros: fixes this instance. Cons: large, risky change for a library, and orthogonal.
- **Option 3: `types: []` plus an explicit `lib`** — Pros: removes the whole failure class; states honestly what the code needs. Cons: new runtime APIs require a deliberate `lib` bump.

### B. TypeDoc output vs hand-written docs

- **Option 1: repoint TypeDoc's `out` to a subdirectory** — Pros: docs can stay in `docs/`. Cons: diverges from `dev`'s `typedoc.json`, adding merge friction to a file nobody wants to reconcile.
- **Option 2: leave `typedoc.json` identical to `dev` and move the hand-written docs elsewhere** — Pros: zero divergence in shared tooling. Cons: doc paths change; references must be updated.

### C. Platform target syntax

- **Option 1: make the Gulp lookups case-insensitive and accept both syntaxes** — Pros: forgiving. Cons: touches `TsTranspile.js`, which PR #1206 was rewriting — a guaranteed conflict.
- **Option 2: correct the documentation to the one working form now; normalise the lookups later** — Pros: no conflict; users stop hitting a broken command immediately.

### D. Reproducible installs

- **Option 1: commit `package-lock.json`** — Pros: the actual fix for dependency drift. Cons: the local lockfile contains `resolved` URLs on the internal Azure Artifacts feed; committing it to a **public** repo would publish internal infrastructure paths. This is precisely why it is gitignored today.
- **Option 2: keep it ignored and insulate the build instead (A)** — Pros: no disclosure. Cons: CI installs remain non-reproducible; this class of failure can recur.

## Decision Outcome

- **A → Option 3.** `"types": []` and an explicit `"lib": ["ES2019", "DOM", "DOM.Iterable"]` (emit target stays ES2017). New code using newer runtime APIs bumps `lib`; it must **not** remove `types: []`.
- **B → Option 2.** `typedoc.json` and the `docs/` ignore entry stay byte-identical to `dev`. `docs/css-architecture.md` moved to **`CSS-ARCHITECTURE.md`** at the repo root; `docs/css-api-reference.md` was deleted as a duplicate of the Storybook page, so `scripts/generate-css-api-reference.mjs` now emits only `stories/CssApiReference.mdx`; `docs/motion-mapping.md` was deleted (unreferenced).
- **C → Option 2.** All documentation now says `npm run dev --target=o11|odc`, the only form that works. Normalising the Gulp lookups is a follow-up, unblocked now that #1206 has landed.
- **D → Option 2, with the question left open.** Revisit deliberately — e.g. a sanitised lockfile, or scoping the internal packages so their URLs do not appear — ideally alongside the merge back to `dev`.
- Also: the fresh-checkout guard for `cleanOldFiles` was ported from `dev`; `build:tokens` became the single source of truth for token-generation flags (`prebuild`, `predev`, `tokens:update` all delegate to it); `build:osui` (= `build` minus lint) now exists; and `.vscode/settings.json` pins `typescript.tsdk` to the workspace copy, because VS Code's bundled TypeScript 6 rejects this repo's `module: "amd"` / `moduleResolution: "node"`, fails to load the tsconfig, and then reports phantom `TS2564` errors on every `*Config.ts` that the real build never produces.

Positive consequences:

- Verified by simulation: with `src/scss/tokens/` and `dist/` wiped, a full build succeeds; with the CI-resolved `@types/node` swapped in, it still succeeds, and the emitted bundles are byte-identical before and after the compiler-option change.
- `npm run docs` no longer touches tracked files.

Negative consequences:

- `lib` is now a manual maintenance point.
- Dependency drift remains possible until §D is resolved.

## Links

- `tsconfig.json`, `gulpfile.js`, `package.json` (`scripts`), `typedoc.json`, `.vscode/settings.json`
- `CSS-ARCHITECTURE.md`; Storybook → *CSS API Reference*
- ADR-0005 — why divergence in shared tooling files is costly

## Date

2026-08-12
