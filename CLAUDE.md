# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

OutSystems UI is a UI component library providing TypeScript behaviors and CSS styles for 70+ patterns used in OutSystems Reactive Web and Native Mobile applications. The compiled library runs in end users' browsers and is consumed by applications built in OutSystems Service Studio.

**Key references:**

- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design, architectural tenets (Provider Pattern Isolation, Two-Tier Namespace Separation, Pattern Registry, Platform-Specific Compilation Guards, Factory Pattern), and external integrations table
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, workflow, code standards, PR requirements, and testing procedures

## Command Quick Reference

```bash
# Setup and development
npm run setup              # Install dependencies + start dev server
npm run dev                # Start dev server for all platforms (http://localhost:3000)
npm run dev -- --target O11    # Start dev server for O11 platform only
npm run dev -- --target ODC    # Start dev server for ODC platform only

# Building and quality checks
npm run build              # Production build (all platforms) + lint + format
npm run lint               # Check ESLint rules
npm run lintfix            # Auto-fix ESLint issues
npm run prettier           # Format all code

# Documentation
npm run docs               # Generate TypeDoc documentation
```

**Build output location:** `dist/` directory contains compiled JavaScript and CSS bundles per platform.

## Directory Structure

```
src/
├── scripts/
│   ├── OSFramework/           # Internal framework (not invoked directly)
│   │   └── OSUI/
│   │       ├── Behaviors/      # Pattern behavior classes
│   │       ├── Event/         # Event management (DOM, Gesture, Provider)
│   │       ├── Helper/        # Utilities (Dom, Dates, Device, Sanitize)
│   │       ├── Interface/     # Generic interfaces
│   │       ├── Pattern/       # Pattern implementations (Accordion, Carousel, etc.)
│   │       ├── Constants.ts   # Framework constants
│   │       ├── ErrorCodes.ts  # Internal error codes
│   │       └── GlobalEnum.ts  # Framework enumerations
│   │
│   ├── OutSystems/            # Public APIs (consumed by OutSystems apps)
│   │   └── OSUI/
│   │       ├── Patterns/      # Pattern APIs (AccordionAPI.ts, CarouselAPI.ts, etc.)
│   │       ├── Utils/         # Public utility APIs
│   │       └── ErrorCodes.ts  # Public error codes
│   │
│   ├── Providers/             # Third-party library integrations
│   │   └── OSUI/
│   │       ├── Carousel/            # Splide provider for Carousel
│   │       ├── Datepicker/          # Flatpickr for DatePicker
│   │       ├── Dropdown/            # VirtualSelect for Dropdown
│   │       ├── Monthpicker/         # Flatpickr for MonthPicker
│   │       ├── RangeSlider/         # NoUiSlider for RangeSlider
│   │       ├── Timepicker/          # Flatpickr for TimePicker
│   │       ├── SharedProviderResources/  # Shared Flatpickr resources
│   │       └── Utils/               # FloatingUI for positioning
│   │
│   └── osui.ts                # Deprecated API (redirects to OutSystems.OSUI.*)
│
├── scss/                      # Styles (non-pattern specific)
│   ├── 00-abstract/           # Variables, mixins, functions
│   ├── 01-foundations/        # Base styles, typography, colors
│   ├── 02-layout/             # Grid, layout utilities
│   ├── 03-widgets/            # Widget-specific styles
│   ├── 04-patterns/           # Pattern styles by category
│   └── 05-useful/             # Utility classes
│
gulp/                          # Build system configuration
├── Tasks/                     # Gulp tasks (TsTranspile, ScssTranspile, etc.)
├── ProjectSpecs/              # Build specifications
└── Template/                  # index.html template for dev server
```

See `src/README.md` for detailed directory structure documentation.

## OutSystems Domain Concepts

**Pattern:** A reusable UI component (e.g., Accordion, Carousel, DatePicker). Each pattern has:

- Internal implementation in `OSFramework/OSUI/Pattern/<PatternName>/`
- Public API in `OutSystems/OSUI/Patterns/<PatternName>API.ts`
- Configuration class ending in `Config.ts`
- Optional provider integration for complex patterns

**Provider:** Third-party library wrapped by the framework (Splide, Flatpickr, NoUiSlider, VirtualSelect, FloatingUI). Providers are isolated from public APIs using the Provider Pattern (see ARCHITECTURE.md T1. Provider Pattern Isolation).

**Platform Targets:**

- **O11** - OutSystems 11 (traditional platform)
- **ODC** - OutSystems Developer Cloud (cloud-native platform)

Build system compiles separate bundles for each platform with platform-specific code exclusions and placeholder replacements.

**Forge:** OutSystems component marketplace where this library is distributed.

**Service Studio:** OutSystems IDE where developers drag/drop UI patterns from this library.

## Code Patterns and Conventions

### TypeScript Naming (enforced by ESLint)

```typescript
// Classes: StrictPascalCase
class AccordionConfig { }

// Interfaces: IPascalCase or UPPER_CASE with I prefix
interface IAccordion { }

// Exported functions: StrictPascalCase
export function CreateAccordion() { }

// Private class members: _strictCamelCase (underscore required)
private _uniqueId: string;
private _initialize(): void { }

// Public/protected members: strictCamelCase (no underscore)
public widgetId: string;
protected updateConfig(): void { }
```

**Class member ordering:** Private fields → Protected fields → Public fields → Constructor → Private methods → Protected methods → Public methods (alphabetical within each group).

### Pattern Implementation Structure

Each pattern follows this structure:

1. **Internal pattern class** in `OSFramework/OSUI/Pattern/<Name>/<Name>.ts`
    - Extends `AbstractPattern` or `AbstractProviderPattern`
    - Implements pattern-specific interface
2. **Configuration class** in `OSFramework/OSUI/Pattern/<Name>/<Name>Config.ts`
    - Extends `AbstractConfiguration`
3. **Interface** in `OSFramework/OSUI/Pattern/<Name>/I<Name>.ts`
4. **Public API** in `OutSystems/OSUI/Patterns/<Name>API.ts`
    - Manages pattern registry (Map of instances)
    - Exports functions: `Create()`, `Initialize()`, `Dispose()`, etc.
5. **Factory** (for provider patterns) in `OSFramework/OSUI/Pattern/<Name>/<Name>Factory.ts`

### Provider Pattern Structure

Provider-based patterns have additional components:

- Provider implementation in `Providers/OSUI/<Name>/<ProviderLibrary>/`
- Provider extends internal pattern class
- Provider-specific configuration and event handling

### Documentation Requirements

**All public APIs must have JSDoc comments:**

```typescript
/**
 * Creates a new Accordion pattern instance.
 * @param accordionId Unique identifier for the accordion
 * @param configs JSON string with configuration options
 * @returns Accordion instance
 */
export function Create(accordionId: string, configs: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
	// implementation
}
```

Use VS Code "Document This" extension (type `/**` above a function/class) for starter templates.

### Build System Notes

- **Module format:** AMD (`tsconfig.json` specifies `"module": "amd"`)
- **Single bundle per platform:** No code splitting; entire framework compiles to one JS file
- **Platform-specific exclusions:** Files excluded via `gulp/ProjectSpecs/DefaultSpecs.js` (e.g., IconLibrary excluded from O11)
- **Placeholder replacement:** Build replaces `<->platformType<->` and `<->iconPlaceholderClass<->` tokens

## Common Scenarios

### Adding a new pattern

1. Create pattern directory under `OSFramework/OSUI/Pattern/<PatternName>/`
2. Implement pattern class, config, interface, and enum (if needed)
3. Create public API in `OutSystems/OSUI/Patterns/<PatternName>API.ts`
4. Add pattern styles in `src/scss/04-patterns/` (categorized by type)
5. Update imports in platform-specific SCSS files
6. Test with `npm run dev -- --target O11` and `npm run dev -- --target ODC`
7. Document with JSDoc comments
8. Verify with `npm run build` (must pass linting)

### Upgrading a provider library

1. Update dependency version in `package.json`
2. Modify provider-specific code in `Providers/OSUI/<PatternName>/<ProviderLibrary>/`
3. Update provider config and event handling if API changed
4. Test pattern behavior with `npm run dev`
5. Check TypeScript compilation: `npm run build`
6. Verify provider version in ARCHITECTURE.md External Integrations table

### Debugging in browser

1. Run `npm run dev -- --target O11` (or ODC)
2. Open `http://localhost:3000` in browser
3. Development build includes sourcemaps
4. Use browser DevTools to debug TypeScript source files
5. Changes auto-recompile and trigger browser reload

### Running linters before commit

```bash
npm run lintfix    # Fix auto-fixable issues
npm run lint       # Check remaining issues (must be clean)
npm run prettier   # Format all files
```

## Key Differences from Typical TypeScript Projects

1. **AMD modules, not ES6/CommonJS:** Build outputs AMD-format modules for Service Studio compatibility
2. **No tree-shaking:** Entire library ships as one bundle per platform
3. **Platform-specific compilation:** Same source compiled differently for O11 vs ODC
4. **Unique ID-based registry:** Pattern instances stored in Maps, accessed by string IDs (not direct references)
5. **Two-tier namespace:** `OSFramework.*` (internal) vs `OutSystems.OSUI.*` (public API)
6. **Provider abstraction:** Third-party libraries never exposed directly to consumers

## Testing and Quality Gates

**Before submitting PR:**

- `npm run build` succeeds without errors
- `npm run lint` passes with zero warnings/errors
- Code is documented with JSDoc comments
- Tested locally in both O11 and ODC modes (if pattern differs by platform)

**PR requirements:** See [CONTRIBUTING.md](./CONTRIBUTING.md) for PR title format, required labels, and review requirements.

**Automated testing:** Separate test repository ([outsystems-ui-tests](https://github.com/OutSystems/outsystems-ui-tests)) with E2E tests using WebDriverIO and Cucumber. See ARCHITECTURE.md Quality Assurance section and CONTRIBUTING.md Testing section for details.

## Additional Resources

- [OutSystems UI Website](https://outsystemsui.outsystems.com/OutsystemsUiWebsite/) - Live demos and documentation
- [TypeDoc Generated Docs](https://outsystems-ui-docs.github.io/) - Auto-generated API reference with UML diagrams
- [Forge component - O11:](https://www.outsystems.com/forge/component-overview/1385/outsystems-ui-o11) - Component download and versioning
- [Forge component - ODC:](https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc) - Component download and versioning
- [Product Documentation](https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns) - OutSystems official docs
- `gulp/README.md` - Build system documentation
