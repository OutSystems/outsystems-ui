# Contributing to OutSystems UI

OutSystems UI provides the TypeScript behaviors and SCSS styles for the UI patterns used in OutSystems Reactive Web and Native Mobile applications. Contributions are welcome from both the UI Components team and external contributors.

## Development Setup

### Prerequisites

- **Node.js 24** — the toolchain is pinned via [Volta](https://volta.sh) (`volta` field in `package.json`, Node 24.13.1 / npm 11.18.0), and CI builds on Node 24. The `engines` field still allows older Node, but use 24 to match CI.
- [Visual Studio Code](https://code.visualstudio.com/) is recommended. Accept the workspace extension recommendations in `.vscode/extensions.json` (Prettier, ESLint, Stylelint, Document This, Git Blame).

### Installation

1. Fork the repository (external contributors) and clone it locally.
2. Run `npm run setup` — installs dependencies and immediately starts the dev server at `http://localhost:3000`.

Note: `.npmrc` sets `min-release-age=7`, so freshly published package versions are not installable for 7 days. This is intentional; do not remove it when bumping dependencies.

```
src/
├── scripts/              TypeScript source code
│   ├── OSFramework/      Internal framework (not invoked directly)
│   │   ├── Behaviors/    Pattern behavior classes
│   │   ├── Event/        Event management
│   │   ├── Helper/       Utility classes
│   │   ├── Interface/    Generic interfaces
│   │   └── Pattern/      UI patterns (Accordion, Carousel, etc.)
│   ├── OutSystems/       Public APIs
│   │   └── OSUI/         OutSystems UI public APIs
│   └── Providers/        Third-party library integrations
│       ├── Carousel/     Splide provider
│       ├── DatePicker/   Flatpickr provider
│       └── ...
└── scss/                 SCSS styles (non-pattern specific)
```

Source lives under `src/scripts` (TypeScript) and `src/scss` (styles). See `src/README.md` for the full directory breakdown and [ARCHITECTURE.md](./ARCHITECTURE.md) for the layering rules between `OSFramework`, `OutSystems`, and `Providers`.

## Development Workflow

### Branching and commits

- Base branch is `dev`. Create your branch from `dev` and keep it rebased/merged up to date.
- Branch name is the JIRA ticket ID, optionally with a suffix: `ROU-12960`, `ROU-12946_v2`.
- Commit messages use `ROU-12345: Short description`. Dependency and small chore commits without a ticket are accepted but PR title rules still apply.
- `release/*` and `merge/*` branches are used by the release automation, not for feature work.

### Running the dev server

```bash
npm run dev                    # all platform targets
npm run dev -- --target O11    # O11 only
npm run dev -- --target ODC    # ODC only
```

Gulp cleans `dist/`, generates the platform SCSS entry files, transpiles TS and SCSS in dev mode (with sourcemaps), then serves `dist/` with browser-sync and watches `src/**/*.ts` and `src/**/*.scss`. The generated `dist/index.html` links the per-platform bundles (`dev.O11.OutSystemsUI.js`, `dev.ODC.OutSystemsUI.css`, etc.).

Platform targets, per-platform file exclusions, and compile-time placeholder tokens are declared in `gulp/ProjectSpecs/DefaultSpecs.js`. Add new platform-specific exclusions there rather than with runtime checks. See `gulp/README.md` for build system details.

### Before opening a PR

1. `npm run build` succeeds (production build for all targets, then `lintfix` + `lint`).
2. `npm run lint` reports zero errors and zero warnings.
3. Public APIs carry JSDoc comments.
4. Behavior verified locally in both O11 and ODC when the pattern differs per platform.

## Building and Testing

| Command                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `npm run setup`            | Install dependencies and start the dev server                        |
| `npm run dev`              | Dev build + browser-sync server on port 3000 with file watching       |
| `npm run build`            | Production build for all platforms, then `lintfix` and `lint`         |
| `npm run lint`             | ESLint over all `.ts` files                                          |
| `npm run lintfix`          | ESLint with `--fix`                                                  |
| `npm run prettier`         | Format all `js`, `ts`, and `css` files                               |
| `npm run docs`             | Generate TypeDoc output into `docs/`                                 |
| `npm run create-osui-scss` | Regenerate the platform SCSS entry files                             |
| `npm run update-version`   | Interactive version bump across project files                         |

### Automated tests

There is no unit test suite in this repository (`run-vitest` is disabled in the build workflow). End-to-end coverage lives in the separate private [outsystems-ui-tests](https://github.com/OutSystems/outsystems-ui-tests) repository (WebDriverIO + Cucumber, Applitools for visual regression).

`pipelines/pr-pipeline.yaml` (Azure DevOps) drives those tests for a PR: it diffs against `origin/dev`, derives Cucumber tags from the changed pattern folders under `src/scripts/OSFramework/OSUI/Pattern`, `src/scripts/OutSystems/OSUI/Patterns`, `src/scripts/Providers/OSUI`, and `src/scss/04-patterns`, then runs the matching functional tests on Chrome and Safari against the PR source branch. Consequence: if a change touches files outside those paths, no E2E tests run — verify manually. Run and debug the suites from the tests repository; see the internal [UI End2End Testing](https://outsystemsrd.atlassian.net/wiki/spaces/EP/pages/1316586046/UI+End2End+Testing) documentation for setup.

## Storybook and Visual Testing (Chromatic)

The repo ships a Storybook that drives the **compiled** library bundle — each story renders a pattern's HTML skeleton and calls its public `Create(id, configs)` API, exactly as OutSystems Service Studio does at runtime.

```bash
npm run build            # prerequisite: Storybook serves the compiled dist/ bundle
npm run storybook        # dev server on http://localhost:6006
npm run build-storybook  # static build (what CI publishes to Chromatic)
```

### Story group: platform Widgets

The `Widgets/` story group covers controls that are **not** part of this library — the platform's React widgets from `@outsystems/runtime-widgets-js`. This repo does **not** depend on those packages: every widget story is a static transcription of the DOM the real widget emits, captured from `@outsystems/runtime-widgets-js@6.25.4` under React 17 and recorded with its provenance in each story's doc comment. See `docs-internal/adr/ADR-0009` for the capture method and the refresh trigger.

`/platform/platform-core.css` — the platform base layer that gives the data-attribute controls (`[data-checkbox]`, `[data-switch]`, `[data-upload]`, …) their structural pseudo-elements — is a tracked, Storybook-only copy at `.storybook/platform/platform-core.css`. It is not part of the library build and nothing in `dist/` reads it.

The upshot: `git clone && npm i && npm run build && npm run build-storybook` produces the **complete** Storybook for anyone — no internal package feed, no Azure login, no scope mapping in `~/.npmrc`. External clones, fork PRs and CI all render the identical story set.

If a widget's platform DOM changes, re-capture rather than hand-editing: the stories are meant to stay faithful to the package, not to be tuned until they look right.

### Chromatic CI

`.github/workflows/chromatic.yaml` publishes the Storybook to [Chromatic](https://www.chromatic.com/) on every PR into (and merge to) the long-living branches. PRs get a visual diff against the base-branch baseline plus a PR comment with the build/preview links; merges auto-accept the new baseline.

The job needs no internal infrastructure — the only secret involved is the Chromatic token, and the Chromatic step is skipped (never failed) when it is absent, so fork PRs stay neutral while still proving the public build works. To run Chromatic against your own fork, create a free Chromatic project and run `npx chromatic --project-token=<your-token>` (see `npm run chromatic`).

**TurboSnap is deliberately OFF.** Every build snapshots every story. Storybook here loads the **compiled** bundle from `dist/` through `<script>`/`<link>` tags rather than importing it, so nothing under `src/` is in Storybook's module graph — and TurboSnap silently ignores a changed file it cannot trace, which would make a SCSS-only PR (nearly every PR in the theme migration) snapshot nothing and still report green. An `externals` list was tried as a fix and was not enough: it only classifies files already in the changed-file list, and that list itself came back empty against this branch's squash-merged history. A `🛡️ Verify Chromatic actually captured snapshots` step now fails the build whenever the visual surface changed but zero snapshots were taken. **Do not re-enable `onlyChanged` without reading `docs-internal/adr/ADR-0008`** — and note `externals` is only accepted alongside `onlyChanged: true`, so the two must be added or removed together.

## Code Standards

Standards are enforced by the config files below. `.claude/rules/typescript.md` and `.claude/rules/scss.md`
restate them as evergreen guidance for AI-assisted work — keep the two in sync when a config changes.

### TypeScript (`.eslintrc.json`)

Naming (`@typescript-eslint/naming-convention`, error level):

| Selector                     | Format                          | Underscore |
| ---------------------------- | ------------------------------- | ---------- |
| Class                        | `StrictPascalCase`              | —          |
| Exported function            | `StrictPascalCase`              | —          |
| Interface                    | `StrictPascalCase`/`UPPER_CASE` with `I` prefix | — |
| Private property / method    | `strictCamelCase`               | required   |
| Public / protected property / method | `strictCamelCase`       | forbidden  |

Class member ordering (`member-ordering`, warn): signature → private fields → protected fields → public fields → constructor → private methods → protected methods → public methods → abstract methods, alphabetical within each group. Explicit accessibility modifiers are required on members other than the constructor.

Also enforced: `no-var`, `no-eval`, `no-extend-native`, `no-cond-assign`, `no-unmodified-loop-condition`, mandatory semicolons, at most one consecutive blank line, and no trailing blank line at EOF.

Compiler settings are in `tsconfig.json`: target `es2017`, module `amd`, comments stripped from output. Strict mode is currently off — do not rely on it to catch null issues.

### Formatting (`.prettierrc.json`)

Tabs with width 4, print width 120, single quotes, semicolons, ES5 trailing commas, `endOfLine: auto`. Run `npm run prettier` before committing; ESLint extends `prettier`, so formatting conflicts are not reported as lint errors.

### SCSS (`.stylelintrc.json`)

Properties in alphabetical order, declaration order `dollar-variables → at-rules → declarations → rules → custom-properties`, max line length 170.

Styling also has an architecture, not just a formatter: read [CSS-ARCHITECTURE.md](./CSS-ARCHITECTURE.md) for the
`--token-*` / `$token-*` design-token layer, the `--osui-{component}-{property}` component CSS API, the theme
invariant, and the logical box model. `src/scss/O11.OutSystemsUI.scss` and `ODC.OutSystemsUI.scss` are generated
on every build — register new partials in `gulp/ProjectSpecs/ScssStructure/*.js` instead of editing them.

### Documentation

- JSDoc with `@param` and `@returns` on every public API. The Document This extension (`/**` above a declaration) generates the scaffold.
- Significant design decisions are recorded as ADRs in `docs-internal/adr/` — copy `ADR-0000-Title-of-ADR.md`, number it sequentially, and update the ADR log table in `docs-internal/adr/Readme.md`.

## Pull Request Process

Target `dev`. Three checks gate every PR:

**PR title** (`validate-pr-title.yaml`) must match `^[A-Z][A-Z0-9]*-[0-9]+:?\s\w`, i.e. a JIRA ticket ID followed by a description — `ROU-12960: Add full Flatpickr position options`. Branches whose head ref contains `release/` or `merge/` are skipped. The `+semver:` prefix is not enabled in this repository.

**PR labels** (`validate-pr-labels.yaml`) require at least one of `feature`, `bug`, `bugfix`, `dependencies`, `dependency`, `chore`, and forbid the `do not merge` label. Labels also drive the release version bump:

| Labels                                                                  | SemVer impact           |
| ----------------------------------------------------------------------- | ----------------------- |
| `breaking`, `major`                                                     | Major version (X+1.0.0) |
| `feat`, `feature`, `minor`                                              | Minor version (0.X+1.0) |
| `revert`, `perf`, `test`, `refactor`, `fix`, `bugfix`, `patch`, `chore` | Patch version (0.0.X+1) |
| `ci`, `none`, `docs`, `style`, `skip`                                   | No version change       |

**Build** (`build.yaml`) runs `npm install` and `npm run build` on Node 24 for PRs into `dev`. SonarCloud analysis is configured (`sonar-project.properties`) but currently disabled in the workflow.

Fill in the template from `.github/pull_request_template.md`: sample page link, what was happening, what was done, test steps, screenshots (animated GIF preferred), and the checklist — including whether the change requires an accompanying OutSystems module or a new sample page.

Review: `.github/CODEOWNERS` assigns `@OutSystems/rd-ui-components` to the whole repository; PRs need approval from 2 team members.

Workflows prefixed `template-` are vendored copies of shared reusable workflows (see `.github/workflows/README.md`). Do not edit them directly.

## Releases

Releases are manual `workflow_dispatch` GitHub Actions:

- `pre-release.yaml` — creates a release candidate branch and version (inputs: new version, release date, optional next dev version).
- `release.yaml` — promotes a release candidate to latest and optionally deletes the `rc*` branch.
- `create-n-deploy-npm.yaml` / `create-n-deploy-docs.yaml` — publish the npm package and the TypeDoc site from a given branch.

Dependabot opens grouped weekly minor/patch npm PRs labeled `chore`; major upgrades and `*outsystems*` packages are ignored and must be bumped by hand.

## Getting Help

- Trusted Committers: [UI Components team member on support rotation](mailto:rd.uicomponents.team@outsystems.com)
- Internal Slack: `#rd-uicomponents-contributors`, business days 2PM-3PM PT

## Additional Resources

- [OutSystems UI Website](https://outsystemsui.outsystems.com/OutsystemsUiWebsite/) — live demos
- [TypeDoc API reference](https://outsystems-ui-docs.github.io/)
- [Pattern documentation](https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns)
- Forge: [O11](https://www.outsystems.com/forge/component-overview/1385/outsystems-ui-o11) · [ODC](https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc) · [npm package](https://www.npmjs.com/package/outsystems-ui)

## License

This repository belongs to OutSystems. See [LICENSE](LICENSE).
