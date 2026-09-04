# CLAUDE.md

OutSystems UI is a browser-side library providing the TypeScript behaviors and SCSS for the 70+ UI patterns used by OutSystems Reactive Web and Native Mobile applications. It has no server component: the build emits one AMD JS bundle and one CSS bundle per platform target.

**Read first:**

- [ARCHITECTURE.md](./ARCHITECTURE.md) — layering (`OutSystems → OSFramework → Providers`), the six tenets (provider isolation, public-API envelope, ID registry, symmetric build/dispose, build-time platform resolution, factories), the External Integrations table, and the Compilation Boundary section.
- [CSS-ARCHITECTURE.md](./CSS-ARCHITECTURE.md) — the styling architecture: design tokens → framework theme layer → component CSS API, and the read chain between them. Summarized under "Styling & Theming Architecture" below.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — setup, dev-server behavior, ESLint/Prettier/Stylelint rules, PR title/label gates, E2E pipeline, release workflows.
- [docs-internal/adr/](./docs-internal/adr/Readme.md) — Architecture Decision Records for cross-cutting decisions, each with its rejected alternatives.
- `.claude/rules/typescript.md` and `.claude/rules/scss.md` — the evergreen conventions for each tree, in more detail than this file.
- `src/README.md` for the directory breakdown, `gulp/README.md` for the build system.

## Command Quick Reference

| Command | Purpose |
| --- | --- |
| `npm run setup` | `npm i` + start dev server on `http://localhost:3000` |
| `npm run dev -- --target O11` | Dev build/watch for one target (`O11` or `ODC`); omit `--target` for both |
| `npm run build` | Production build for all targets, then `lintfix` + `lint` |
| `npm run lint` / `lintfix` / `prettier` | Quality gates (lint must be zero errors *and* zero warnings) |
| `npm run build:tokens` | Regenerate `src/scss/tokens/` from `outsystems-design-tokens` (runs automatically before `dev` and `build`) |
| `npm run create-osui-scss` | Regenerate the per-platform SCSS entry files |
| `npm run storybook` / `build-storybook` / `chromatic` | Storybook against the compiled `dist/` bundle, and its visual-test upload |
| `npm run update-version` | Interactive version bump across project files |
| `npm run docs` / `docs:css-api` / `docs:tokens` | TypeDoc output into `docs/`; regenerate the Storybook CSS-API and token reference pages |

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
- **`.npmrc` is untracked and gitignored.** It carries each developer's private-feed credentials, so it is not in the repo; the `min-release-age=7` install policy dev used to pin there is no longer enforced in-tree.
- **`src/scss/tokens/` is generated and gitignored.** A fresh clone has no tokens until `npm run build:tokens` (or any `dev`/`build`) has run — SCSS referencing `$token-*` will not compile before that.
- **`src/scripts/osui.ts` is a deprecated shim.** Never add entries; new surface goes in `OutSystems.OSUI.*`.
- Public API functions must return the serialized envelope from `OutSystems/OSUI/Utils/CreateApiResponse.ts` with a code from `OutSystems/OSUI/ErrorCodes.ts` — do not let exceptions escape (only `Create` throws).

## Adding or Changing a Pattern

Mirror an existing pattern of the same shape rather than inventing structure. A pattern spans: the class/config/interface (and factory, for provider or multi-mode patterns) under `OSFramework/OSUI/Pattern/<Name>/`, the public API in `OutSystems/OSUI/Patterns/<Name>API.ts`, any wrapper under `Providers/OSUI/<Name>/<Library>/`, and styles in `src/scss/04-patterns/` which must also be registered in the matching `gulp/ProjectSpecs/ScssStructure/Patterns*.js` spec (the entry files are generated — see below). Verify in both `--target O11` and `--target ODC` when behavior differs per platform.

## Styling & Theming Architecture

The SCSS layer is in the middle of a phased migration from hand-rolled OSUI tokens to the `outsystems-design-tokens` package. See `CSS-ARCHITECTURE.md` for the consolidated architecture summary (tokens → theme layer → component CSS API and the read chain), the Storybook "CSS API Reference" page (`stories/CssApiReference.mdx`, regenerated via `npm run docs:css-api`) for every `--osui-*` component property.

### Token system — two layers

- **`--token-*` CSS custom properties** — generated by `npx build.tokens` into `src/scss/tokens/_root.scss` (gitignored). This is the public theming surface: a DTE or runtime theme overrides these at `:root` and everything re-colours.
- **`$token-*` SCSS variables** — generated into `src/scss/tokens/_variables.scss`. Each expands to a `var(--token-*, fallback)` chain. **Prefer `$token-*` in component SCSS**; it gives compile-time typo validation, IDE autocomplete, and a hardcoded fallback if the `:root` layer is absent. In a CSS custom property declaration use `#{$token-*}` interpolation: `--osui-card-background: #{$token-bg-surface-default};`.

### Component CSS API (the `--osui-*` layer)

Every visual component has a two-step value chain declared at its root selector: **component CSS API var → `$token-*` default → `var(--token-*)` fallback chain**. Example:

```scss
.card {
  // ─── Component CSS API ─────────────────────────────────────────────
  --osui-card-background: #{$token-bg-surface-default};
  --osui-card-shadow:     #{$token-elevation-1};
  // ───────────────────────────────────────────────────────────────────

  background-color: var(--osui-card-background);
  box-shadow: var(--osui-card-shadow);
}
```

Nomenclature is `--osui-{component}-{property}` (Decision D11, Option B). Component property declarations **must** go through the `--osui-*` var — not directly through `$token-*` — so consumers can override per-instance without touching tokens.

### Auto-generated entry files (important!)

`src/scss/O11.OutSystemsUI.scss` and `src/scss/ODC.OutSystemsUI.scss` are **regenerated on every `npm run dev` / `npm run build`** by `gulp/Tasks/CreateScssFile.js`. Manual edits to these files are overwritten.

To add a new SCSS partial to the compiled bundle, edit the matching section spec in `gulp/ProjectSpecs/ScssStructure/*.js` (e.g. `Resets.js`, `PageLayout.js`, `Widgets.js`, `Patterns*.js`, `UsefullClasses.js`). Each spec lists assets like:

```js
"assets": [
  { "name": "", "path": "01-foundations/resets" }
]
```

The `path` is resolved relative to `src/scss/` and the `_` / `.scss` extension are implicit.

### Themes

> A dark theme **ships, and it is now entirely generated**: `src/scss/tokens/_theme-dark.scss`, produced by `npm run build:tokens` from the design tokens' dark mode (the whole `src/scss/tokens/` directory is gitignored). It re-maps the ~447 `--token-*` values that differ in dark and self-applies them under `.theme-dark`, so importing it is all dark mode needs. It is registered in `gulp/ProjectSpecs/ScssStructure/Root.js` — **not** hand-added to the entry files, which every build regenerates.
>
> Opt-in, manual only — add `.theme-dark` to **`<html>`** (`document.documentElement`) to switch to dark; no OS auto-detection (an app that wants to follow `prefers-color-scheme` toggles the class itself).
>
> **`<html>`, not `<body>`, and that matters.** The `--color-*` roles are declared at `:root` as `var(--token-…, <light fallback>)`, and a `var()` is substituted against the element the declaration applies to. Override `--token-*` on `<body>` and you are too late — the role already resolved to its light fallback on `<html>` and inherits down as that literal. On `<html>` the tokens sit on the element the roles resolve on, so 43 of 44 `--color-*` knobs flip to dark for free (`--color-focus-outer` is a deliberate hardcoded yellow). `.theme-dark` is an element-agnostic class selector, so this needed no CSS change — only the right element.
>
> The hand-written `src/scss/01-foundations/_theme-dark.scss` is **gone**, along with its `--color-*` role bridge and its "KNOWN CSS-API LEAKS" block. The bridge existed only to work around the class being on `<body>`; scoping to `<html>` replaces it structurally. What still will not follow the theme is the residual set of hardcoded literals at `:root` — 17 of the 21 `--osui-*` defaults there, each already marked `// future: --token-*`. The theme invariant below is now satisfied by construction: the theme is pure token overrides and touches no component rule.

A theme re-skins the whole library as a single class scope (e.g. `<body class="theme-name">`) implemented **entirely** as CSS custom property overrides — overriding theme-layer role knobs (`--color-*`, `--border-radius-*`, …) and/or the underlying `--token-*`. No component rule, no `$token-*` value, and no pre-existing `--osui-*` default is touched. If a theme needs to touch a component rule, that indicates a leak in the CSS API that should be fixed in the component, not the theme. See `CSS-ARCHITECTURE.md` §5.

## Additional Resources

- [OutSystems UI Website](https://outsystemsui.outsystems.com/OutsystemsUiWebsite/) — live demos and documentation
- [TypeDoc Generated Docs](https://outsystems-ui-docs.github.io/) — auto-generated API reference with UML diagrams
- Forge: [O11](https://www.outsystems.com/forge/component-overview/1385/outsystems-ui-o11) · [ODC](https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc)
- [Product Documentation](https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns) — OutSystems official docs

Record significant design decisions as an ADR — see CONTRIBUTING.md's Documentation section for the procedure.
