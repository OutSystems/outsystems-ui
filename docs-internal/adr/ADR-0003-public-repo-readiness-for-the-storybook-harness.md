<!-- This ADR documents how the Storybook harness was made safe and usable in a public repository -->

# ADR-0003: Public-Repo Readiness for the Storybook Harness

## Status

Accepted

## Context

`OutSystems/outsystems-ui` is a **public** GitHub repository. The Storybook harness built for the token migration (see `specs/plan-part-three.md`) introduced two dependencies on OutSystems-internal resources:

1. **Private npm packages.** The `stories/widgets/` group mounts the platform's real React widgets from `@outsystems/runtime-core-js`, `runtime-view-js` and `runtime-widgets-js`, published only to the internal Azure Artifacts feed. They sat in `devDependencies`, so their `404` aborted `npm install` **entirely** for any external clone — breaking `npm run build` and all outside contribution, not merely the widget stories.

2. **Vendored platform CSS.** `.storybook/platform/platform-core.css` carried 593 lines of OutSystems **platform runtime** base CSS, tracked in the public repo. It exists because OSUI is only a *theme*: without the platform's base layer, the data-attribute widgets (`[data-checkbox]`, `[data-switch]`, `[data-input]`) render without the pseudo-element `content` that generates their visible structure.

An audit confirmed no credential exposure (`.npmrc` and `package-lock.json` are both gitignored), so this is a usability and source-ownership problem, not a security one.

## Decision Drivers

- `git clone && npm install && npm run build` must work for anyone, with no internal access.
- Internal developers must keep a single-command install — no manual extra step to remember.
- Platform-owned source should not be redistributed from this repository as a side effect of a dev-tooling need.
- Degradation must be **visible**, never silent.

## Considered Options

### A. Private platform-widget packages

- **Option 1: leave in `devDependencies`** — Pros: simplest. Cons: public repo cannot install at all. Rejected outright.
- **Option 2: remove from `package.json`, document a manual `npm i` line for internal devs** — Pros: nothing private in the manifest. Cons: undeclared dependency drifts silently; no version range recorded.
- **Option 3: move to `optionalDependencies`** — Pros: npm tolerates the `404` and continues (verified empirically); version ranges stay declarative; internal install unchanged. Cons: the manifest still names internal packages (already true of the feed itself).
- **Option 4: split the widget stories into a separate Storybook composition** — Pros: cleanest separation. Cons: significantly more configuration for no additional benefit today.

### B. Platform base CSS

- **Option 1: keep vendored, add provenance/licence header** — Pros: zero effort, stories keep working everywhere. Cons: does not answer the source-ownership question; the file silently ages against the platform.
- **Option 2: trim to the minimal structural subset the stories exercise** — Pros: smaller footprint. Cons: still vendoring; the necessary subset was never measured.
- **Option 3: stop vendoring — generate it at Storybook startup from the installed platform package** — Pros: no platform-owned source in the repo; automatically tracks package upgrades. Cons: widget-story fidelity now requires internal-feed access.

## Decision Outcome

**A → Option 3; B → Option 3.**

- The three `@outsystems/runtime-*-js` packages move to `optionalDependencies`. `.storybook/main.ts` probes for them and narrows the `stories` glob to exclude `stories/widgets/**` when they are absent, logging a one-line notice.
- `platform-core.css` is deleted from git and regenerated on every Storybook startup from `@outsystems/runtime-widgets-js` (stripping the FontAwesome `@font-face`, whose relative URLs would 404), stamped with the source package version. When the package is absent a commented **stub** is written instead, so `staticDirs` and the `preview-head.html` link keep resolving. The generated file is gitignored, and a missing/renamed source path throws a clear build error rather than emitting a broken layer.

Positive consequences:

- Verified by an external-clone simulation (empty user/global npmrc, public registry): install succeeds, build succeeds, and `build-storybook` completes with zero unresolved imports.
- The widget group's 20 stories simply do not appear externally; everything else is unchanged.
- The platform CSS now follows the installed package version instead of drifting.

Negative consequences:

- Widget-story fidelity depends on internal-feed access; external contributors see the data-attribute form controls unstyled.
- Two code paths (real file vs stub) to keep in mind when debugging widget-story styling.

## Links

- `specs/plan-part-three.md` — the Storybook harness this hardens
- `.storybook/main.ts`, `stories/Introduction.mdx`, `CONTRIBUTING.md` (Storybook section)
- ADR-0004 — the CI half of the same problem (fork PRs)

## Date

2026-08-12
