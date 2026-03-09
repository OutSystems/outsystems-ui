# Contributing to OutSystems UI

Thank you for your interest in contributing to OutSystems UI, a framework providing UI patterns and screen templates for Reactive Web and Native Mobile applications.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/en) v12.0 or higher
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Recommended VS Code Extensions

- Prettier - Code formatter (`esbenp.prettier-vscode`)
- ESLint (`dbaeumer.vscode-eslint`)
- Stylelint (`stylelint.vscode-stylelint`)
- Document This (`oouo-diogo-perdigao.docthis`)

### Installation

1. Fork this repository
2. Clone your fork locally
3. Install dependencies and start development:

```bash
npm run setup
```

This command installs all dependencies and starts the development server.

## Project Structure

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

See `src/README.md` for detailed structure documentation.

## Development Workflow

### Branch Strategy

- Base branch: `dev` (main development branch)
- Create feature branches from `dev`
- Branch naming: Use JIRA ticket IDs (e.g., `ROU-12619`)
- Keep your branch updated with `dev`

### Starting Development

Start the development server with live reload:

```bash
npm run dev -- --target <platform>
```

Where `<platform>` is optional. If not provided, builds for all platforms. The development server runs at `http://localhost:3000`.

### Build System

The project uses Gulp for build orchestration:

- TypeScript files from `src/scripts/` compile to JavaScript (AMD modules)
- SCSS files from `src/scss/` compile to CSS
- Output written to the `dist/` directory

## Building and Testing

| Command            | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `npm run build`    | Production build for all platforms, includes linting and formatting |
| `npm run dev`      | Start development server with file watching                         |
| `npm run lint`     | Run ESLint to check for code style issues                           |
| `npm run lintfix`  | Automatically fix ESLint issues                                     |
| `npm run prettier` | Format all code with Prettier                                       |
| `npm run docs`     | Generate TypeDoc documentation                                      |

### Pre-commit Checklist

Before submitting your changes:

1. Build succeeds without errors: `npm run build`
2. No linting warnings or errors: `npm run lint`
3. Code is properly documented with JSDoc comments
4. All changes are tested locally

## Testing

### Automated Testing Repository

OutSystems UI has a separate automated testing repository:

- **Repository**: [outsystems-ui-tests](https://github.com/OutSystems/outsystems-ui-tests) (private)
- **Framework**: WebDriverIO with Cucumber for BDD-style scenarios
- **Visual Testing**: Applitools for visual regression (screenshot comparison)

### Test Types

- **Functional tests** (`tests/functional-tests/`) - Non-visual component behavior
- **Visual tests** (`tests/visual-tests/`) - Screenshot-based visual regression

Tests verify component behavior across platforms (O11/ODC) and catch unintended UI regressions.

### Running Tests Locally

```bash
npm run web-tests -- --environment=<dev|qa> --viewport=<Phone|Tablet|Desktop> --browsers=<chrome|firefox|edge|safari>
```

Tests can target specific branches: `--branch=ROU1234`

### Test Setup Documentation

For test setup and configuration: [UI End2End Testing Documentation](https://outsystemsrd.atlassian.net/wiki/spaces/EP/pages/1316586046/UI+End2End+Testing)

Note: Visual tests require `APPLITOOLS_API_KEY` environment variable.

## Code Standards

### TypeScript Conventions

**Naming:**

- Classes: `StrictPascalCase`
- Interfaces: `IPascalCase` or `UPPER_CASE` with `I` prefix
- Exported functions: `StrictPascalCase`
- Private class properties: `_strictCamelCase` (leading underscore required)
- Public/protected properties: `strictCamelCase` (no underscore)
- Private methods: `_strictCamelCase` (leading underscore required)
- Public/protected methods: `strictCamelCase` (no underscore)

**Class member ordering:**

1. Private fields
2. Protected fields
3. Public fields
4. Constructor
5. Private methods
6. Protected methods
7. Public methods

Within each category, members are ordered alphabetically.

**Documentation:**

- All public APIs must be documented with JSDoc comments
- Use the "Document This" VS Code extension for starter templates (type `/**` above a function/class)
- Include `@param`, `@returns`, and `@description` tags

**Configuration:**

TypeScript settings in `tsconfig.json`:

- Target: ES2017
- Module: AMD
- Strict mode enabled

### Formatting

- Indent: Tabs (width: 4)
- Line length: 120 characters maximum
- Semicolons: Required
- Quotes: Single quotes
- Trailing commas: ES5 style
- End of line: Auto (LF recommended)

Run `npm run prettier` to automatically format your code.

### SCSS Conventions

- Properties must be in alphabetical order
- Declaration order: variables → at-rules → declarations → rules → custom properties
- Line length: 170 characters maximum
- Stylelint enforces these rules (see `.stylelintrc.json`)

## Pull Request Process

### PR Title Format

PR titles must follow this convention:

```
<TICKET-ID> <description>
```

Example: `ROU-12619 Fix carousel icon alignment`

- `<TICKET-ID>`: JIRA issue identifier (e.g., `ROU-1234`)
- Branches named `release/*` or `merge/*` are exempt from this requirement

### Required PR Labels

Every PR must have at least one of these labels:

- `feature` - New features
- `bug` / `bugfix` - Bug fixes
- `chore` - Maintenance tasks
- `dependencies` / `dependency` - Dependency updates

**Do not use:** `do not merge` label (blocks PR from merging)

### Label-to-Version Mapping

| Labels                                                                  | SemVer Impact           |
| ----------------------------------------------------------------------- | ----------------------- |
| `breaking`, `major`                                                     | Major version (X+1.0.0) |
| `feat`, `feature`, `minor`                                              | Minor version (0.X+1.0) |
| `revert`, `perf`, `test`, `refactor`, `fix`, `bugfix`, `patch`, `chore` | Patch version (0.0.X+1) |
| `ci`, `none`, `docs`, `style`, `skip`                                   | No version change       |

### PR Template

When creating a PR, fill out the provided template:

- **Sample page:** Link to a working demo showing the fix or new feature
- **What was happening:** Describe the issue or motivation
- **What was done:** Explain your changes
- **Test steps:** Provide step-by-step testing instructions
- **Screenshots:** Include visual evidence (animated GIFs preferred)
- **Checklist:**
    - Tested locally
    - Documented the code
    - No ESLint warnings/errors
    - Indicate if OutSystems module changes are required

### Review Requirements

- PRs require approval from 2 team members (repository owners)
- All PR checks must pass (title validation, label validation, build)

## Release Process

Releases are managed through GitHub Actions workflows:

- `pre-release.yaml`: Creates release candidates (manual trigger, requires version and release date)
- `release.yaml`: Publishes releases (manual trigger)

Version numbers follow semantic versioning based on PR labels (see table above).

## Getting Help

- Trusted Committers: [UI Components team on support rotation](mailto:rd.uicomponents.team@outsystems.com)
- Internal Slack: `#rd-uicomponents-contributors` (business days 2PM-3PM PT)

## Additional Resources

- [OutSystems UI Website](https://outsystemsui.outsystems.com/OutsystemsUiWebsite/)
- [OutSystems UI Documentation](https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns)
- [TypeDoc Generated Docs](https://outsystems-ui-docs.github.io/)
- [Forge component - O11:](https://www.outsystems.com/forge/component-overview/1385/outsystems-ui-o11)
- [Forge component - ODC:](https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc)
- [NPM Package](https://www.npmjs.com/package/outsystems-ui)

## License

This repository belongs to OutSystems and all rights are reserved. See [LICENSE](LICENSE) for details.
