# CLAUDE.md

OutSystems UI is a browser-side library providing the TypeScript behaviors and SCSS for the 70+ UI patterns used by OutSystems Reactive Web and Native Mobile applications. It has no server component: the build emits one AMD JS bundle and one CSS bundle per platform target.

**Read first:**

- [ARCHITECTURE.md](./ARCHITECTURE.md) — layering (`OutSystems → OSFramework → Providers`), the six tenets (provider isolation, public-API envelope, ID registry, symmetric build/dispose, build-time platform resolution, factories), the External Integrations table, and the Compilation Boundary section.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — setup, dev-server behavior, ESLint/Prettier/Stylelint rules, PR title/label gates, E2E pipeline, release workflows.
- `src/README.md` for the directory breakdown, `gulp/README.md` for the build system.

## Command Quick Reference

| Command | Purpose |
| --- | --- |
| `npm run setup` | `npm i` + start dev server on `http://localhost:3000` |
| `npm run dev -- --target O11` | Dev build/watch for one target (`O11` or `ODC`); omit `--target` for both |
| `npm run build` | Production build for all targets, then `lintfix` + `lint` |
| `npm run lint` / `lintfix` / `prettier` | Quality gates (lint must be zero errors *and* zero warnings) |
| `npm run create-osui-scss` | Regenerate the per-platform SCSS entry files |
| `npm run update-version` | Interactive version bump across project files |
| `npm run docs` | TypeDoc output into `docs/` |

There is no test runner in this repository — nothing to run locally beyond build and lint.

## Domain Terminology

- **O11** — OutSystems 11, the traditional platform. **ODC** — OutSystems Developer Cloud. Every build produces a bundle per target.
- **Pattern** — a public UI component with its own `*API.ts` entry point (Accordion, Carousel, DatePicker, …).
- **Feature** — a composable capability with no public API of its own, reused by several patterns (`OSFramework/OSUI/Feature/Balloon/`).
- **Provider** — a third-party library wrapped under `src/scripts/Providers/OSUI/` (Splide, Flatpickr, noUiSlider, VirtualSelect, Floating UI).
- **Service Studio** — the OutSystems IDE where developers drag patterns onto screens. **Forge** — the marketplace where the compiled component is distributed.

## Gotchas

- **Providers are not bundled.** They are reached as browser globals (`window.Splide`, `window.flatpickr`, `window.FloatingUIDOM`, …) typed in `src/scripts/Global.d.ts`; the host application loads the scripts. `package.json` devDependencies only supply typings and SCSS sources, so bumping a devDependency does not change what runs in the browser. The version a wrapper targets is the `ProviderInfo.Version` constant in the provider directory — update it deliberately, and note ARCHITECTURE.md flags known drift between devDependency and in-code versions.
- **TypeScript `strict` is off.** Null/undefined bugs are not caught by the compiler; guard defensively, especially in `dispose` paths where the platform may have already removed the DOM.
- **Platform differences belong in `gulp/ProjectSpecs/DefaultSpecs.js`** (per-target file exclusions and placeholder tokens), not in runtime `if (platform === …)` branches.
- **E2E coverage is path-derived.** `pipelines/pr-pipeline.yaml` builds Cucumber tags from changed folders under `src/scripts/OSFramework/OSUI/Pattern`, `src/scripts/OutSystems/OSUI/Patterns`, `src/scripts/Providers/OSUI`, and `src/scss/04-patterns`. Changes elsewhere trigger **no** tests — say so explicitly and describe manual verification.
- **`.npmrc` sets `min-release-age=7`.** A package published in the last 7 days cannot be installed; do not remove the setting to work around it.
- **`src/scripts/osui.ts` is a deprecated shim.** Never add entries; new surface goes in `OutSystems.OSUI.*`.
- Public API functions must return the serialized envelope from `OutSystems/OSUI/Utils/CreateApiResponse.ts` with a code from `OutSystems/OSUI/ErrorCodes.ts` — do not let exceptions escape (only `Create` throws).

## Adding or Changing a Pattern

Mirror an existing pattern of the same shape rather than inventing structure. A pattern spans: the class/config/interface (and factory, for provider or multi-mode patterns) under `OSFramework/OSUI/Pattern/<Name>/`, the public API in `OutSystems/OSUI/Patterns/<Name>API.ts`, any wrapper under `Providers/OSUI/<Name>/<Library>/`, and styles in `src/scss/04-patterns/` which must also be imported by the platform SCSS entry files (`npm run create-osui-scss` regenerates them). Verify in both `--target O11` and `--target ODC` when behavior differs per platform.

- [OutSystems UI Website](https://outsystemsui.outsystems.com/OutsystemsUiWebsite/) - Live demos and documentation
- [TypeDoc Generated Docs](https://outsystems-ui-docs.github.io/) - Auto-generated API reference with UML diagrams
- [Forge component - O11:](https://www.outsystems.com/forge/component-overview/1385/outsystems-ui-o11) - Component download and versioning
- [Forge component - ODC:](https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc) - Component download and versioning
- [Product Documentation](https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns) - OutSystems official docs
- `gulp/README.md` - Build system documentation
Record significant design decisions as an ADR — see CONTRIBUTING.md's Documentation section for the procedure.
