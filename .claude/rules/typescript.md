# TypeScript Conventions — OutSystemsUI

Evergreen rules for any TypeScript work in this repo. Grounded in the actual code (see [`CLAUDE.md`](../../CLAUDE.md) and [`ARCHITECTURE.md`](../../ARCHITECTURE.md) for narrative context).

---

## 1. Module format — AMD, ambient namespaces, no ES imports

`tsconfig.json` sets `"module": "amd"`. Source files use **ambient TypeScript namespaces**, not ES modules:

```ts
// src/scripts/OSFramework/OSUI/Pattern/Accordion/Accordion.ts
namespace OSFramework.OSUI.Patterns.Accordion {
	export class Accordion
		extends AbstractParent<AccordionConfig, AccordionItem.IAccordionItem>
		implements IAccordion { ... }
}
```

Rules:

- **No `import ... from '...'`** in `src/scripts/**`. The only exception is `Global.d.ts` for ambient type declarations of third-party libs.
- Cross-file references use fully-qualified namespace paths: `OSFramework.OSUI.Helper.MapOperation.FindInMap(...)`.
- Every file begins with `// eslint-disable-next-line @typescript-eslint/no-unused-vars` because the outer `namespace` looks unused to the linter. Keep it.

## 2. Two-tier namespace

- **Internal (private):** `OSFramework.OSUI.*` — framework mechanics, pattern implementations, helpers, constants, enums, error codes.
- **Public (consumed by Service Studio):** `OutSystems.OSUI.*` — thin API surface. Every exported function returns a string envelope via `OutSystems.OSUI.Utils.CreateApiResponse(...)`.

Rules:

- Public API types reference fully-qualified internal types: `OSFramework.OSUI.Patterns.Accordion.IAccordion`.
- The internal layer **never** imports from `OutSystems.OSUI.*`. (One narrow exception: `OutSystems.OSUI.Utils.GetHasListInside` used inside provider wrappers.)
- Do not leak third-party provider types (e.g. `Splide`, `Flatpickr`, `VirtualSelect`, `noUiSlider`) into `OutSystems.OSUI.*`.

## 3. Naming conventions — ESLint-enforced

Declared in `.eslintrc.json` via `@typescript-eslint/naming-convention` at **error** level:

| Thing | Rule |
|---|---|
| Exported functions | `StrictPascalCase` |
| Classes | `StrictPascalCase` |
| Interfaces | `StrictPascalCase` or `UPPER_CASE`, **`I` prefix required** |
| Private class members | `strictCamelCase`, **leading `_` required** |
| Public / protected class members | `strictCamelCase`, **leading `_` forbidden** |

```ts
class Accordion {
	private _configs: AccordionConfig;     // private → underscore
	protected isProviderBased = false;      // protected → no underscore
	public get selfElement(): HTMLElement   // public → no underscore
}
```

Class member ordering (`member-ordering`, warn): private-field → protected-field → public-field → constructor → private-method → protected-method → public-method. Alphabetical within each group.

`explicit-member-accessibility` is **warn**: always mark `private` / `protected` / `public` explicitly.

If you must violate a naming rule for interop (e.g. provider class `OSUISplide`), use a localized `// eslint-disable-next-line @typescript-eslint/naming-convention` on the class line — don't disable globally.

## 4. Pattern implementation structure

Every pattern has this shape under `src/scripts/OSFramework/OSUI/Pattern/<Name>/`:

```
<Name>.ts           → class <Name> extends AbstractPattern | AbstractParent | AbstractProviderPattern
<Name>Config.ts     → class <Name>Config extends AbstractConfiguration
I<Name>.ts          → interface I<Name> extends Interface.IPattern | Interface.IParent
Enum.ts             → namespace with Properties / CSS / Events const objects
<Name>Factory.ts    → provider-based patterns only; dispatches by provider enum
```

And the matching public API under `src/scripts/OutSystems/OSUI/Patterns/`:

```
<Name>API.ts        → registry + Create / Initialize / Dispose / GetByID / lifecycle
```

### Registry pattern (public API)

```ts
namespace OutSystems.OSUI.Patterns.AccordionAPI {
	const _accordionMap = new Map<string, OSFramework.OSUI.Patterns.Accordion.IAccordion>();

	export function Create(id: string, configs: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		// throws on duplicate; inserts into _accordionMap; returns instance
	}

	export function Initialize(id: string): string {
		// CreateApiResponse wrapper around accordion.build()
	}

	export function Dispose(id: string): string {
		// CreateApiResponse wrapper around accordion.dispose(); deletes from map
	}

	export function GetAccordionById(id: string) {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap('Accordion', id, _accordionMap);
	}
}
```

Rules:

- Every public API entry point wraps its body in `OutSystems.OSUI.Utils.CreateApiResponse({ errorCode, callback })`. Uniform envelope for Service Studio consumers.
- Never call `Map.get()` directly — use `OSFramework.OSUI.Helper.MapOperation.FindInMap` (and `ExportKeys` for listing).
- Error codes come from `OSFramework.OSUI.ErrorCodes.<Pattern>.<Reason>` — never inline a string.

### Config class

```ts
class AccordionConfig extends AbstractConfiguration {
	public validateCustomCallback(key: string, value: unknown): unknown {
		switch (key) {
			case Enum.Properties.SomeKey:
				return /* validated value */;
			default:
				return super.validateDefault(key, value);
		}
	}
}
```

Always dispatch on `Enum.Properties.*` string constants; always fall through to `super.validateDefault`.

## 5. Provider-pattern isolation (T1)

For patterns backed by a third-party lib:

- `Pattern/<Name>/Abstract<Name>.ts` holds the generic base: `Abstract<Name><P, C> extends AbstractProviderPattern<P, C>`.
- `Pattern/<Name>/<Name>Factory.ts` is the **single** gateway that resolves provider name → concrete provider class.
- The concrete provider class lives under `Providers/OSUI/<Name>/<Library>/<Library>.ts`:

```ts
namespace Providers.OSUI.Carousel.Splide {
	export class OSUISplide
		extends OSFramework.OSUI.Patterns.Carousel.AbstractCarousel<Splide, Splide.SplideConfig>
		implements OSFramework.OSUI.Patterns.Carousel.ICarousel {

		public build(): void {
			this.provider = new window.Splide(...);
			// ... configure, subscribe to provider events
		}
	}
}
```

Rules:

- Public API accepts/returns only the `I<Name>` interface — never a provider type.
- Third-party lib is instantiated as `new window.<Lib>(...)` or via an ambient global declared in `Global.d.ts`.
- Provider-specific event listeners stay inside the provider wrapper. Emit framework-level events through the pattern's event manager to keep callers decoupled.

## 6. Constants, ErrorCodes, GlobalEnum

All three live under `OSFramework.OSUI.*` as namespaces of exported `const` object literals (**not `enum`s**):

```ts
namespace OSFramework.OSUI.Constants {
	export const A11YAttributes = {
		Aria: { Atomic: 'aria-atomic', Hidden: 'aria-hidden' /* ... */ },
	};
}

namespace OSFramework.OSUI.ErrorCodes {
	export const Accordion = {
		FailSetNewChildItem: 'OSUI-GEN-07002',
		FailChangeProperty: 'OSUI-GEN-07003',
	};
}

namespace OSFramework.OSUI.GlobalEnum {
	export const PatternName = {
		Accordion: 'Accordion' /* ... */,
	};
}
```

- Reference as `ErrorCodes.Accordion.FailChangeProperty`, `GlobalEnum.PatternName.Accordion`, `Constants.A11YAttributes.Aria.Atomic`.
- When adding a new pattern: add an ErrorCodes block and a GlobalEnum entry at the same time.

## 7. JSDoc — required on every public API

```ts
/**
 * Function that will create the pattern instance
 *
 * @export
 * @param {string} accordionId The id of the accordion element
 * @param {string} configs The configuration options as JSON string
 * @return {*}  {OSFramework.OSUI.Patterns.Accordion.IAccordion}
 */
export function Create(accordionId: string, configs: string): OSFramework.OSUI.Patterns.Accordion.IAccordion { ... }
```

- Every exported function in `OutSystems/OSUI/Patterns/**` must have JSDoc with `@export`, `@param` for each arg, and `@return`.
- Protected/internal methods get JSDoc with `@protected` and `@memberof OSFramework.Patterns.<Name>.<Class>`.
- Field comments use single-line `//` above the declaration (provider files especially).

## 8. Platform exclusions (O11 vs ODC)

Configured in `gulp/ProjectSpecs/DefaultSpecs.js` via `excludeFromTsTranspile.<platform>`:

```js
excludeFromTsTranspile: {
	O11: [
		'OutSystems/OSUI/Utils/PreviewInDevices/**/*',
		'OutSystems/OSUI/Utils/IconLibrary.ts',
	],
},
```

- To hide a file from one platform, add it here. Don't use `#ifdef`-style runtime checks.
- String placeholders (e.g. `iconPlaceholderClass`) in `DefaultSpecs.js` are replaced at compile time per platform.

## 9. Idioms worth preserving

- **`this.selfElement` not `this._selfElem`** — base `AbstractPattern` stores `private _selfElem` but exposes it via the public getter `selfElement`. Subclasses always use `this.selfElement`.
- **`console.log(GlobalEnum.WarningMessages.MethodNotImplemented)`** — intentional empty-hook placeholder in abstract overrides the pattern doesn't need.
- **Always instantiate ambient globals through `window.`** — `new window.Splide(...)`, not `new Splide(...)`. Makes the global binding explicit and lint-friendly.
- **Dispose is mandatory** — every pattern must unsubscribe listeners, clear its map entry, and null out provider references. The registry leaks otherwise.

## 10. What to flag in review

- `import` or `export` statements outside `Global.d.ts` or `.eslintrc` override files.
- Missing `CreateApiResponse` wrapper in a new public API function.
- Inlined error-code string literals (should reference `ErrorCodes.*`).
- A provider-library type appearing in `OutSystems.OSUI.*` signatures.
- Public / protected members starting with `_`, or private members without `_`.
- `I`-prefix missing on an interface.
- New `enum` declarations — we use `const` object literals.
- `Map.get()` / `Map.has()` bypassing `Helper.MapOperation`.
- Changes to `O11.OSUIFramework.ts` / `ODC.OSUIFramework.ts` entry files (auto-generated during build).
- Missing JSDoc on an exported public API function.
- New abstract pattern without an accompanying Factory, or new concrete pattern without matching API + Config + Interface + Enum.
- Provider file that imports/instantiates the vendor lib outside `Providers/OSUI/`.
