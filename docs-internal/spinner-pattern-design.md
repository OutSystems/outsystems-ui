# Spinner pattern — technical specification (port from Mobile UI)

| | |
|---|---|
| **Status** | Draft for review — no code written, no commits |
| **Date** | 2026-10-10 |
| **Branch (all repos)** | `gm-test-spinner` — exploratory, no JIRA ticket yet (see §8.1) |
| **Author** | gnbm (with Claude Code) |
| **Repos** | `outsystems-ui` (new pattern), `outsystems-ui-tests` (E2E), `outsystems-ui-preview` (Service Studio OnRender preview script). `runtime-mobile-widgets-js` and `OutSystems.WidgetLibrary` are read-only sources: **no changes to Mobile UI** |

## 1. Summary and recorded decisions

Port the Mobile UI **Spinner** widget into OutSystems UI as a native **`Spinner`** pattern: a dedicated TypeScript class under `OSFramework.OSUI.Patterns.Spinner`, a public `OutSystems.OSUI.Patterns.SpinnerAPI`, SCSS under `04-patterns/06-utilities/spinner/`, a Storybook story, and an E2E suite.

Decisions already taken with the owner (2026-10-10):

| # | Decision | Choice |
|---|---|---|
| D1 | Animation set | **All seven Mobile UI types** (Dots, Lines, Lines Sharp, Bubbles, Circle, Circular, Crescent) plus **Default** (Lines on iOS, Circular elsewhere). **Revised 2026-10-11 (hybrid):** the glyph markup is authored in the block with HTML Element widgets, the geometry and stagger live in CSS `nth-child` rules, and the TypeScript class only applies modifier classes and the colour. |
| D2 | Color input | **A single free-text `Color` input that accepts any colour** (revised 2026-10-11, superseding the earlier "Color Identifier + HEX/RGB" choice): theme colour names resolve through `Helper.Dom.Styles.GetColorCssValueFromColorType`, everything else is used as-is. Mirrors Mobile UI's `SpinnerColorExpression`; the deprecated `SpinnerColor` enum has no counterpart. |
| D3 | Mobile repos | **No changes at all** (owner decision, 2026-10-10, superseding an earlier "docs note only" choice). Both repos are used only as the porting source. |
| D4 | Ticket | **Exploratory.** Branch `gm-test-spinner`; PRs cannot be opened under that name (every repo enforces `ROU-xxxxx`), so a ticket is needed before PR time. |

Assumptions (stated, not confirmed — flag if wrong):

- A1. The pattern belongs to the **Utilities** section, beside ButtonLoading and List Updating.
- A2. Size mirrors Mobile UI's five values with **Xsmall** default; the undocumented/unimplemented Mobile UI `Shape` property is **dropped**.
- A3. Mobile UI's `Visible` built-in has no block-level equivalent in OutSystems UI (blocks are hidden by the consumer with an `If` or container); it is **not** an input.
- A4. Mobile UI's `Style` becomes the standard OutSystems UI **`ExtendedClass`** input.

## 2. Source analysis — what the Mobile UI Spinner actually is

### 2.1 Architecture

```
OutSystems.WidgetLibrary/Common/Widgets.xml  ──(ModelPluginGenerator)──►  Spinner.Generated.cs / Spinner.Generated.ts
runtime-mobile-widgets-js/src/scripts/Components/Spinner/Spinner.tsx  ──►  <IonSpinner color name size />   (React wrapper)
@ionic/core  spinner.js + spinner-configs.js + spinner.ionic.css       ──►  <ion-spinner> shadow DOM with N <svg> children
```

- The Mobile UI repo has **no Spinner stylesheet** and **no SVG of its own**. Everything visual (geometry, keyframes, durations, size tokens, default colour) is inside Ionic's `spinner.ionic.css` and `spinner-configs.js` (OutSystems dev build `8.8.20-dev.*`, which adds a `size` prop).
- OutSystems UI has no Ionic dependency and must not gain one (ARCHITECTURE T1; providers are browser globals loaded by the host app, and Ionic is a full web-component runtime, not a provider). **The geometry and keyframes are therefore re-implemented**, with Ionic's tables as the porting source (Appendix A).

### 2.2 Low-code surface (WidgetLibrary `Common/Widgets.xml:1412-1447`)

| Property | Kind | Values | Default | Notes |
|---|---|---|---|---|
| `AnimationType` ("Type") | Enum | Default ("System Default"), Dots, Lines, LinesSharp, Bubbles, Circle, Circular, Crescent | Default | Default → `""` → Ionic picks `lines` on iOS, `circular` otherwise. `Circle` maps to Ionic `circles`. `LinesSmall` / `LinesSharpSmall` were removed by `Upgrader_0_3_927_0`. |
| `Visible` | Built-in | Boolean | True | Platform built-in. |
| `SpinnerColorExpression` ("Color") | Expression (String) | suggestions `primary`, `neutral`, `white`, `success`, `warning`, `danger` | `"primary"` when dropped (`Spinner.cs:OnInitialize`); stories/spec use `neutral` | `neutral` → Ionic `medium`, `white` → `light`, else pass-through. |
| `SpinnerColor` | Enum, **hidden/deprecated** | Primary, Neutral, Info | Neutral | Not read by the runtime. |
| `SpinnerSize` ("Size") | Enum | Xsmall, Small, Medium, Large, ExtraLarge | Xsmall | |
| `Style` ("Style Classes") | Style | String | "" | Extra CSS classes. |

Events: none. Placeholders: none. Mandatory properties: none.

### 2.3 Rendered output and accessibility

Mobile UI renders a custom element with `role="progressbar"` whose shadow root holds one `<svg viewBox="0 0 64 64">` per animated element, each with a `<circle>` or `<line>`. The wrapper passes `ariaLabel: "Loading Spinner"` as a DOM **property** (reflects to an attribute only where ARIA reflection is supported). No `aria-busy`, no live region.
- Size → width/height: xsmall `--token-scale-600` (24px), small `800` (32px), medium `1000` (40px), large `1200` (48px), xlarge `1400` (56px). Ionic base default is `700` (28px).
- Colour: `--color` custom property, default `var(--token-primitives-neutral-800, #6c727a)`; `medium` resolves to `--token-primitives-neutral-900`.
- Animation table (elements, duration, keyframes) and per-element geometry: **Appendix A**.

### 2.4 What is deliberately not ported

- Ionic `duration` and `paused` props (never exposed by Mobile UI).
- `Shape` (documented in `Spinner.data.js`, never implemented).
- The deprecated hidden `SpinnerColor` enum.
- `LinesSmall` / `LinesSharpSmall` (already upgraded away in Mobile UI).

## 3. Target design — OutSystems UI `Spinner`

### 3.1 Low-code structure of the `Spinner` block (Service Studio, OutSystems UI OML)

> The OML (`OutSystemsUI_ROUTEST2.oml`) is a Service Studio binary and could not be inspected locally, so this section is the contract to build against. Where it says "as ButtonLoading does", open the `ButtonLoading` block in the OML and copy its shape.

#### 3.1.1 Block properties

| Property | Value |
|---|---|
| Name | `Spinner` |
| Location | UI Flows → Patterns → Utilities, beside `ButtonLoading` |
| Description | "Animated loading indicator. Choose one of seven animations, a size and a color." |
| Public | Yes (shown in the Service Studio toolbox) |
| Design-time preview | the OnRender preview JavaScript from `outsystems-ui-preview` (`OnRenderJS Preview/Utilities/Spinner.js`, §7.4), set in the block's preview-script property exactly as ProgressCircle sets its own |

#### 3.1.2 Static entities (Data → Entities → Static, Public)

Both follow the shape of the existing `Color` static entity: a Text `Id` attribute holding the identifier, a `Label`, and `Order`. **The `Id` values must be exactly the lower-case kebab values below**: they travel unchanged to the pattern, which validates them against its enums and falls back to the default on any mismatch.

| Entity | Records (Label → Id) |
|---|---|
| `SpinnerAnimationType` | Default → `default`, Dots → `dots`, Lines → `lines`, Lines Sharp → `lines-sharp`, Bubbles → `bubbles`, Circle → `circle`, Circular → `circular`, Crescent → `crescent` |
| `SpinnerSize` | Extra Small → `xsmall`, Small → `small`, Medium → `medium`, Large → `large`, Extra Large → `xlarge` |

#### 3.1.3 Input parameters

| Input | Data type | Mandatory | Default | Description (shown in Service Studio) | Mirrors Mobile UI |
|---|---|---|---|---|---|
| `AnimationType` | `SpinnerAnimationType Identifier` | No | `Entities.SpinnerAnimationType.Default` | Animation style. Default follows the platform: lines on iOS, circular everywhere else. | `AnimationType` |
| `Color` | Text | No | `""` | Any color: a theme color name (`primary`, `error`, `neutral-7`, …), HEX, RGB, HSL or a CSS keyword. Empty keeps the theme default. | `SpinnerColorExpression` (the deprecated `SpinnerColor` enum has no counterpart) |
| `Size` | `SpinnerSize Identifier` | No | `Entities.SpinnerSize.Xsmall` | Spinner size: Extra Small 24px, Small 32px, Medium 40px, Large 48px, Extra Large 56px. | `SpinnerSize` |
| `ExtendedClass` | Text | No | `""` | Add custom style classes to the pattern. | `Style` |

No `Visible` input: as with every OutSystems UI block, visibility is the consumer's job (an `If` or the container's own visibility).

#### 3.1.4 Events

| Event | Mandatory | Parameters | Raised when |
|---|---|---|---|
| `Initialized` | No | none | The pattern finished building (the `Initialized` callback registered through `SpinnerAPI.RegisterCallback`). Standard on every OutSystems UI block; the E2E harness asserts it. |

Mobile UI's Spinner has no events; `Initialized` is an OutSystems UI convention, not a Mobile UI mirror.

#### 3.1.5 Widget tree

The glyph markup is authored in the block with **HTML Element** widgets, one `<svg>` per animation type, each inside an `If` on `AnimationType`. Siblings inside a glyph are identical except where the table in Appendix A says otherwise; rotation, position offsets and animation delays come from CSS `nth-child` rules, not from attributes.

```
Spinner (Block)
└── SpinnerWrapper (Container)
      Style Classes : "osui-spinner"                  ← static; the pattern adds the modifier classes
      Attributes    : name = UniqueId                  ← local variable set once in OnInitialize; the pattern locates its root by it
                      aria-label = "Loading"           ← text literal → translated by Multilingual
      ├── If (AnimationType = Entities.SpinnerAnimationType.Dots)
      │     └── svg  [class="osui-spinner__dots" viewBox="0 0 64 64" aria-hidden="true"]
      │           └── circle ×3  [cy="32" r="6", cx = 52.48 | 32 | 11.52]
      ├── If (… = Lines)
      │     └── svg  [class="osui-spinner__lines" viewBox="0 0 64 64" aria-hidden="true"]
      │           └── line ×8   [x1="32" y1="6" x2="32" y2="18"]
      ├── If (… = LinesSharp)
      │     └── svg  [class="osui-spinner__lines-sharp" viewBox="0 0 64 64" aria-hidden="true"]
      │           └── line ×12  [x1="32" y1="3" x2="32" y2="15"]
      ├── If (… = Bubbles)
      │     └── svg  [class="osui-spinner__bubbles" viewBox="0 0 64 64" aria-hidden="true"]
      │           └── circle ×9  [r="5", cx/cy from Appendix A]
      ├── If (… = Circle)
      │     └── svg  [class="osui-spinner__circle" viewBox="0 0 64 64" aria-hidden="true"]
      │           └── circle ×8  [r="5", cx/cy from Appendix A]
      ├── If (… = Circular)
      │     └── svg  [class="osui-spinner__circular" viewBox="24 24 48 48" aria-hidden="true"]
      │           └── circle ×1  [cx="48" cy="48" r="20"]
      ├── If (… = Crescent)
      │     └── svg  [class="osui-spinner__crescent" viewBox="0 0 64 64" aria-hidden="true"]
      │           └── circle ×1  [cx="32" cy="32" r="26"]
      └── If (… = Default)
            ├── the Lines svg (as above)
            └── the Circular svg (as above)         ← CSS shows one of the two by platform (`.ios` on <body>)
```

Rules: no `role` in the markup (the pattern sets it); no inline styles on the shapes; the `If` widgets render no element, so at runtime only the selected glyph is in the DOM. The Container's Style Classes stay `"osui-spinner"`; ExtendedClass is applied by the pattern so that runtime changes go through `ChangeProperty`.

**InlineSVG variant.** If the HTML Element widget cannot author `svg`/`line`/`circle`, each glyph can be an `InlineSVG` block whose `SVGCode` is the same markup (single `<svg>` root per block; the Default branch therefore holds **two** InlineSVG blocks, lines and circular). The runtime DOM then has two wrappers between the host and the `<svg>` (`div[data-block="Utilities.InlineSVG"] > div.osui-inline-svg > svg`); the pattern CSS gives both `display: contents`, so sizing and the glyph rules are unaffected, and the E2E selectors use the descendant axis. Costs of this variant: InlineSVG injects at runtime only, so the canvas would show nothing by itself; the OnRender preview script (§7.4) therefore draws the matching glyph through DOM calls whenever none is present, so the canvas shows the spinner anyway. The InlineSVG blocks may sit under an `If` with condition `False` (True branch empty, False branch holding the per-type `If`s) to keep their design-time placeholders off the canvas; the preview script draws into the empty wrapper. Whatever the wrapping, the Default branch must still carry **both** the lines and the circular glyph for runtime.

#### 3.1.6 Client actions (event handlers)

| Handler | Node | JavaScript node inputs | What it does |
|---|---|---|---|
| `OnInitialize` | JavaScript `GenerateUniqueId` → local variable `UniqueId` | none | `$parameters.UniqueId = OutSystems.OSUI.Utils.GenerateUniqueId();` — generated **once**; the Container's `name` attribute and every API call below use this variable. Two separate calls to `GenerateUniqueId()` give two different ids, and `Initialize` then throws "The Spinner with id … was not found". |
| `OnReady` | JavaScript `InitializeSpinner` | `UniqueId`, `AnimationType`, `Color`, `Size`, `ExtendedClass` | Creates the pattern, registers the `Initialized` callback, then initializes. |
| `OnParametersChanged` | JavaScript `ChangeSpinnerProperties` | same inputs as above | Pushes the current inputs to the pattern through `ChangeProperty`. |
| `OnDestroy` | JavaScript `DestroySpinner` | `UniqueId` | Disposes the pattern and removes it from the registry. |
| `OnInitialized` (client action) | Trigger Event `Initialized` | none | Called by the pattern's callback; raises the block event. |

The pattern finds its root with `document.getElementsByName(uniqueId)`, so the `name` attribute value and the id passed to `Create`/`Initialize`/`ChangeProperty`/`Dispose` must be the same string. The Container's own `Id` (`b3-SpinnerWrapper`) is **not** that value.

`InitializeSpinner` (the call order matters: `Initialized` fires inside the pattern's `finishBuild()`, so a callback registered after `Initialize` is never called):

```javascript
OutSystems.OSUI.Patterns.SpinnerAPI.Create($parameters.UniqueId, JSON.stringify({
    AnimationType: $parameters.AnimationType,
    Color: $parameters.Color,
    Size: $parameters.Size,
    ExtendedClass: $parameters.ExtendedClass
}));
OutSystems.OSUI.Patterns.SpinnerAPI.RegisterCallback($parameters.UniqueId, 'Initialized', $actions.OnInitialized);
OutSystems.OSUI.Patterns.SpinnerAPI.Initialize($parameters.UniqueId);
```

`ChangeSpinnerProperties` (sending an unchanged value is harmless: each change only swaps a modifier class or rewrites the inline colour, both idempotent):

```javascript
OutSystems.OSUI.Patterns.SpinnerAPI.ChangeProperty($parameters.UniqueId, 'AnimationType', $parameters.AnimationType);
OutSystems.OSUI.Patterns.SpinnerAPI.ChangeProperty($parameters.UniqueId, 'Color', $parameters.Color);
OutSystems.OSUI.Patterns.SpinnerAPI.ChangeProperty($parameters.UniqueId, 'Size', $parameters.Size);
OutSystems.OSUI.Patterns.SpinnerAPI.ChangeProperty($parameters.UniqueId, 'ExtendedClass', $parameters.ExtendedClass);
```

If the ButtonLoading block compares each input with its previous value before calling `ChangeProperty`, mirror that; it is an optimisation, not a requirement.

`DestroySpinner`:

```javascript
OutSystems.OSUI.Patterns.SpinnerAPI.Dispose($parameters.UniqueId);
```

Every `SpinnerAPI` call except `Create` and `Initialize` returns the standard serialized response envelope; the block does not need to read it.

#### 3.1.7 Config JSON contract (block → pattern)

```json
{ "AnimationType": "default", "Color": "", "Size": "xsmall", "ExtendedClass": "" }
```

- Keys are the input names; values are the identifier `Id`s and texts, unchanged.
- **`Color` resolution:** `Helper.Dom.Styles.GetColorCssValueFromColorType` checks whether a `--color-<value>` theme role exists. If it does, the pattern writes `--osui-spinner-color: var(--color-<value>)` inline, so the colour keeps following the theme and `.os-dark-theme`. If it does not, the raw value (HEX, RGB, HSL or a CSS keyword) is written as-is. Empty removes the inline override, which is why the default is `""` and not `Neutral`: the SCSS default (`$token-icon-subtlest`) already equals Mobile UI's default and stays theme-driven. This deliberately improves on ProgressBar, which inlines the *resolved* colour and therefore does not flip in dark mode.
- A missing key, or an identifier the pattern does not know, falls back to the pattern default (`default` type, `xsmall` size, empty colour) and never throws.

#### 3.1.8 Checklist to build it

1. Create the two static entities (3.1.2) and publish.
2. Duplicate `ButtonLoading`, rename to `Spinner`, set the description (3.1.1).
3. Replace the inputs (3.1.3) and keep only the `Initialized` event (3.1.4).
4. Rebuild the widget tree to a single empty Container (3.1.5).
5. Rewrite the three handlers and the `OnInitialized` action (3.1.6).
6. Set the design-time preview script (3.1.1 / §7.4).
7. Publish, drop the block on a screen: design time shows the still glyph, runtime shows the animation with `role="progressbar"` on the Container.

#### 3.1.9 Element-by-element contents (copy sheet)

Everything the Spinner block contains, in the order Service Studio shows it. The seven `SVGCode` texts are generated from the geometry in Appendix A; copy them as they are (OutSystems text literal, single-quoted attributes inside). With HTML Element widgets instead of InlineSVG, author the same tags and attributes as widgets.

**Block `Spinner`** — Public: Yes. Description: "Animated loading indicator. Choose one of seven animations, a size and a color."

**Input parameters**

| Name | Data type | Default |
|---|---|---|
| `AnimationType` | `SpinnerAnimationType Identifier` | `Entities.SpinnerAnimationType.Default` |
| `Color` | Text | `""` |
| `Size` | `SpinnerSize Identifier` | `Entities.SpinnerSize.Xsmall` |
| `ExtendedClass` | Text | `""` |

**Local variable** `UniqueId` — Text, no default. **Event** `Initialized` — no parameters, not mandatory.

**Widget tree**

1. `SpinnerWrapper` — **Container**. Style Classes `"osui-spinner"`. Attributes: `name` = `UniqueId`, `aria-label` = `"Loading"`. Nothing else (no `role`, no `style`). Children: items 2–9.

2. `IfDots` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Dots`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__dots' viewBox='0 0 64 64' aria-hidden='true'><circle cx='52.48' cy='32' r='6'></circle><circle cx='32' cy='32' r='6'></circle><circle cx='11.52' cy='32' r='6'></circle></svg>"
```
False branch: empty.

3. `IfLines` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Lines`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__lines' viewBox='0 0 64 64' aria-hidden='true'><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line><line x1='32' y1='6' x2='32' y2='18'></line></svg>"
```
False branch: empty.

4. `IfLinesSharp` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.LinesSharp`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__lines-sharp' viewBox='0 0 64 64' aria-hidden='true'><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line><line x1='32' y1='3' x2='32' y2='15'></line></svg>"
```
False branch: empty.

5. `IfBubbles` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Bubbles`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__bubbles' viewBox='0 0 64 64' aria-hidden='true'><circle cx='52.48' cy='32.00' r='5'></circle><circle cx='47.69' cy='45.16' r='5'></circle><circle cx='35.56' cy='52.17' r='5'></circle><circle cx='21.76' cy='49.74' r='5'></circle><circle cx='12.76' cy='39.00' r='5'></circle><circle cx='12.76' cy='25.00' r='5'></circle><circle cx='21.76' cy='14.26' r='5'></circle><circle cx='35.56' cy='11.83' r='5'></circle><circle cx='47.69' cy='18.84' r='5'></circle></svg>"
```
False branch: empty.

6. `IfCircle` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Circle`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__circle' viewBox='0 0 64 64' aria-hidden='true'><circle cx='52.48' cy='32.00' r='5'></circle><circle cx='46.48' cy='46.48' r='5'></circle><circle cx='32.00' cy='52.48' r='5'></circle><circle cx='17.52' cy='46.48' r='5'></circle><circle cx='11.52' cy='32.00' r='5'></circle><circle cx='17.52' cy='17.52' r='5'></circle><circle cx='32.00' cy='11.52' r='5'></circle><circle cx='46.48' cy='17.52' r='5'></circle></svg>"
```
False branch: empty.

7. `IfCircular` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Circular`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__circular' viewBox='24 24 48 48' aria-hidden='true'><circle cx='48' cy='48' r='20'></circle></svg>"
```
False branch: empty.

8. `IfCrescent` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Crescent`. True branch: one InlineSVG (Source Block `Utilities\InlineSVG`, `ExtendedClass` empty) with `SVGCode`:
```
"<svg class='osui-spinner__crescent' viewBox='0 0 64 64' aria-hidden='true'><circle cx='32' cy='32' r='26'></circle></svg>"
```
False branch: empty.

9. `IfDefault` — **If**. Condition: `AnimationType = Entities.SpinnerAnimationType.Default`. True branch: **two** InlineSVG blocks, first the lines one (item 3's `SVGCode`), then the circular one (item 7's `SVGCode`). Both are in the DOM at runtime; the pattern CSS hides one: on a page whose `<body>` has the `ios` class it shows lines and hides circular, everywhere else (Android, desktop) it shows circular and hides lines. That is how Default equals circular except on iOS, as in Mobile UI, without JavaScript deciding it. False branch: empty.

An extra wrapper `If` with condition `False` around items 2–9 is allowed (True branch empty, False branch holding them): it keeps the InlineSVG placeholders off the canvas, and the OnRender preview script draws the glyph into the empty wrapper at design time.

**`SVGCode` must be exactly the glyph above**, one `<svg class='osui-spinner__<type>'>` root, not wrapped in a second `<svg>`. The CSS tolerates a wrapper (rotation is on the shape), but an outer `<svg>` adds nothing and repeats the glyph class.

**Logic**

- `SpinnerCreate` (or the `OnReady` node, whichever calls Create) → `OutSystems.OSUI.Patterns.SpinnerAPI.Create($parameters.UniqueId, $parameters.Configs);`. Calling any other API there (for example a copy left from InlineSVG) means the spinner is never registered and `Initialize` throws "The Spinner with id … was not found".
- `OnInitialize` → JavaScript node, output `UniqueId` assigned to the local variable: `$parameters.UniqueId = OutSystems.OSUI.Utils.GenerateUniqueId();` (generated once; a second call anywhere produces a different id and the "was not found" error).
- `OnReady`, `OnParametersChanged`, `OnDestroy` and the `OnInitialized` client action: as in 3.1.6, every API call with `$parameters.UniqueId`.

### 3.2 DOM contract (block markup + what the pattern adds)

Example: `AnimationType = lines`, `Size = medium`, `Color = primary`, `ExtendedClass = "my-spinner"`, Portuguese locale.

```html
<div data-block="OutSystemsUI.Spinner" id="b3-Spinner_Main">
  <div data-container="" id="b3-SpinnerWrapper" name="b3-SpinnerWrapper"
       class="osui-spinner my-spinner osui-spinner--medium osui-spinner--lines"
       role="progressbar" aria-label="A carregar"
       style="--osui-spinner-color: var(--color-primary);">
    <svg class="osui-spinner__lines" viewBox="0 0 64 64" aria-hidden="true">
      <line x1="32" y1="6" x2="32" y2="18"></line>
      <!-- … 8 identical lines; CSS nth-child rotates each by 45° steps and staggers the delays -->
    </svg>
  </div>
</div>
```

| Owner | Produces |
|---|---|
| Low-code (block) | the Container, `aria-label` (translatable literal), the `<svg class="osui-spinner__<type>">` glyph and its identical child shapes; for `default` both the lines and circular glyphs |
| TypeScript (pattern) | `osui-spinner` (idempotent), `osui-spinner--{type}`, `osui-spinner--{size}`, `ExtendedClass`, inline `--osui-spinner-color` (only when `Color` is set), `role="progressbar"` |
| CSS | size, colour, per-child rotation / offsets / stagger delays (`nth-child`), stroke and fill, the `default` choice (`.ios .osui-spinner--default` shows lines, otherwise circular), high contrast, reduced motion |

Class vocabulary (all registered in `09-excluders/_excluders.scss`):

| Class | Role |
|---|---|
| `osui-spinner` | root / CSS API host |
| `osui-spinner--{default\|dots\|lines\|lines-sharp\|bubbles\|circle\|circular\|crescent}` | the configured animation type, as received (`default` stays `default`; CSS resolves it) |
| `osui-spinner--{xsmall\|small\|medium\|large\|xlarge}` | size |
| `osui-spinner__{dots\|lines\|lines-sharp\|bubbles\|circle\|circular\|crescent}` | the glyph `<svg>` authored in the block |

Accessibility: `role="progressbar"` (pattern) + `aria-label` (block, translatable); every glyph `<svg>` carries `aria-hidden="true"` in the markup. Reduced motion: the pattern owns it — `@media (prefers-reduced-motion: reduce)` sets `animation: none` on the glyph `svg`, `circle` and `line` elements, so every glyph shows its base, fully visible frame. It does not rely on the global reset in `01-foundations/_resets.scss`, which the classic theme does not have. Never add `animation-fill-mode` to a spinner animation. Test procedure: ADR-0011 Q28.

### 3.3 TypeScript design

Files (all new, under `src/scripts/`):

```
OSFramework/OSUI/Pattern/Spinner/
  Spinner.ts        class Spinner extends AbstractPattern<SpinnerConfig> implements ISpinner
  SpinnerConfig.ts  class SpinnerConfig extends AbstractConfiguration { AnimationType; Color; Size }
  ISpinner.ts       interface ISpinner extends Interface.IPattern {}
  Enum.ts           AnimationType, Size, CssClass, CssProperty, Properties
OutSystems/OSUI/Patterns/SpinnerAPI.ts
```

Registrations: `GlobalEnum.PatternName.Spinner = 'Spinner'` (alphabetically after `Sidebar`), `ErrorCodes.Spinner = { FailChangeProperty: 'OSUI-API-34001', FailDispose: 'OSUI-API-34002', FailRegisterCallback: 'OSUI-API-34003' }` (next free prefix after `WizardItem` 33xxx; placed before `Legacy`). No TS build registration exists — `tsc --outFile` over `src/scripts` picks the files up for both O11 and ODC. One shared helper was added: `Helper.Dom.Styles.GetColorCssValueFromColorType(name)` returns `var(--color-<name>)` when the theme role exists, otherwise the raw value.

`SpinnerConfig.validateDefault(key, value)` — `AnimationType` and `Size` via `validateInRange(value, default, Object.values(Enum.X))`; `Color` is trimmed text; everything else falls through to `super.validateDefault`. The constructor re-runs `validateDefault` for the three properties after `super(config)` so a partial config still gets defaults (field initializers would run after `super()` and overwrite the received values).

`Spinner` class — what it does and, just as important, what it no longer does:

| Member | Responsibility |
|---|---|
| `private _setType()` | swaps `osui-spinner--{AnimationType}` through `Helper.Dom.Styles.ExtendedClass`. The value is applied as received; `default` is resolved by CSS, so there is no user-agent check in TypeScript. |
| `private _setSize()` | swaps `osui-spinner--{Size}` the same way. |
| `private _setColor()` | empty → removes the inline `--osui-spinner-color`; otherwise writes `GetColorCssValueFromColorType(Color)`. |
| `protected setA11YProperties()` | `role="progressbar"` only; the accessible name is the block's translatable literal. |
| `protected setHtmlElements()` / `unsetHtmlElements()` | adds the `osui-spinner` base class / removes the modifier classes, the inline colour and the role (guarded, the platform may have removed the DOM). |
| `public build()` | `super.build()` → `setHtmlElements` → `_setSize` → `_setType` → `_setColor` → `setA11YProperties` → `finishBuild`. |
| `public changeProperty()` | `super.changeProperty` (validates + stores); then `AnimationType` → `_setType`, `Size` → `_setSize`, `Color` → `_setColor`. A change of `AnimationType` only swaps a class: the platform re-renders the `If` branch with the new glyph. |
| `public dispose()` | `unsetHtmlElements()`; `super.dispose()`. |

Gone from the first version: SVG generation, the geometry table (`SpinnerAnimations.ts`), inline per-element durations and delays, the user-agent based Default resolution, and the hardcoded `aria-label`.

`SpinnerAPI` (mirror `ButtonLoadingAPI`, **without** its two quirks): `ChangeProperty`, `Create` (throws on duplicate id — the only function allowed to throw), `Dispose`, `GetAllSpinners`, `GetSpinnerById` (via `Helper.MapOperation.FindInMap`), `Initialize`, `RegisterCallback` (use the local `GetSpinnerById`, not `this.`; parameter named `spinnerId`). Every function except `Create`/`Initialize`/`Get*` returns the `CreateApiResponse` envelope. Full JSDoc with `@export`, `@param`, `@return`.

No O11/ODC behavioural difference is expected; nothing goes into `DefaultSpecs.excludeFromTsTranspile`.

### 3.4 SCSS design

Files (new) and registrations:

| File | Registration |
|---|---|
| `src/scss/04-patterns/06-utilities/spinner/_spinner.scss` | `gulp/ProjectSpecs/Patterns/Spinner.js` (`codeName: "Spinner"`, `section: "Utilities"`, `scss: "../scss/04-patterns/06-utilities/spinner/spinner"`), `require` + `"spinner": spinner.info` in `Patterns/#All.js`, `{ "key": "spinner" }` in `ScssStructure/PatternsUtilities.js` |
| `src/scss/07-keyframes/_spinner.scss` | `{ "name": "Spinner", "path": "07-keyframes/spinner" }` in `ScssStructure/Keyframes.js` |
| `src/scss/{O11,ODC}.OutSystemsUI.scss` | **regenerated** by `npm run create-osui-scss` (or dev/build) and committed — never hand-edited |
| `src/scss/09-excluders/_excluders.scss` | `osui-spinner`, `osui-spinner--*` added to the pickers exclusion list |

Naming constraints (verified collisions): the global utility `.spinner` (`03-interaction/_animate.scss:80`), `@keyframes spinner` (`07-keyframes/_animate.scss:142`) and `@keyframes loadingSpinner` (`_btn-loading.scss:7`) already exist. New keyframes are prefixed: `osui-spinner-fade-out`, `osui-spinner-scale-out`, `osui-spinner-dots`, `osui-spinner-circular-inner`. Rotation (crescent, circular) reuses the existing global `spin` keyframe, which has an explicit 0% frame: a 100%-only rotation keyframe interpolated through identity matrices and never rotated (found in review, verified in the browser).

**CSS owns the geometry.** Two mixins drive the glyph layout from the markup's identical siblings:

```scss
@mixin spinner-stagger($count, $duration) { @for $i from 1 through $count { &:nth-child(#{$i}) { animation-delay: #{math.div($duration * ($i - 1), $count) - $duration}ms; } } }
@mixin spinner-radial($count)            { @for $i from 1 through $count { &:nth-child(#{$i}) { transform: rotate(#{math.div(360, $count) * ($i - 1)}deg); } } }
```

- `lines` / `lines-sharp`: each `line` gets `transform-box: view-box; transform-origin: 32px 32px`, a rotation step (45° / 30°) and a stagger over 1000ms; stroke width `--osui-spinner-stroke-width` (6px / 4px).
- `bubbles` / `circle`: each `circle` (positioned by its own `cx`/`cy` in the markup) animates scale-out / fade-out with a stagger over 1000ms; `transform-box: fill-box; transform-origin: center` keeps the scale centred on the circle.
- `dots`: three circles, `osui-spinner-dots` over 750ms with delays 0 / −110 / −220ms.
- `crescent`: the **circle** spins (750ms, `transform-box: fill-box; transform-origin: center`); it is a dashed stroke (128px dash, 82px offset, 4px).
- `circular`: the **circle** runs two animations, `spin` (1400ms) and `osui-spinner-circular-inner` (ease-in-out, 1400ms) over a static `80px, 200px` dash, stroke 5.6 user units.
- Rotation sits on the shape, never on an `<svg>`: an InlineSVG block, or an extra `<svg>` around the glyph, then cannot compound the rotation (with the earlier svg-level rotation, a nested outer `<svg>` carrying the same class made crescent and circular spin twice; found on the test app).
- `default`: `.osui-spinner--default .osui-spinner__lines { display: none }`; `.ios .osui-spinner--default` flips it (lines shown, circular hidden). The platform sets the `ios` class on `<body>`.
- Durations: 1000ms uses `$token-transition-time-1000`; 750ms and 1400ms have no token and are literals with a comment.
- No design-time override (`-servicestudio-*`): the canvas gets the runtime CSS, but does not run stylesheet animations, so it shows the static glyph (§7.4).

Component CSS API (declared on `.osui-spinner`; every property read through the `--osui-*` var — rules §3): `--osui-spinner-color` (`$token-icon-subtlest`), `--osui-spinner-size` (`$token-scale-600`; the size modifiers override it with `$token-scale-800/1000/1200/1400`), `--osui-spinner-stroke-width` (`$token-scale-150`; `lines-sharp` overrides with `$token-scale-100`). No duration knob: the stagger delays are derived from the duration in SCSS, so a runtime duration override would desync them.

Logical box model (§15): no physical inset or margin is used; the glyph fills the host (`display: block; width/height: 100%`). Rotations are `transform`, which never mirrors in RTL, and the Mobile UI Spinner is not mirrored either.

### 3.5 Public API summary

| `OutSystems.OSUI.Patterns.SpinnerAPI` | Returns | Error code |
|---|---|---|
| `Create(spinnerId, configs)` | `ISpinner` (throws on duplicate) | — |
| `Initialize(spinnerId)` | `ISpinner` | — |
| `ChangeProperty(spinnerId, propertyName, propertyValue)` | envelope | `OSUI-API-34001` |
| `Dispose(spinnerId)` | envelope | `OSUI-API-34002` |
| `RegisterCallback(spinnerId, eventName, callback)` | envelope | `OSUI-API-34003` |
| `GetSpinnerById(spinnerId)` / `GetAllSpinners()` | `ISpinner` / `string[]` | — |

## 4. Storybook

- `stories/Spinner.stories.ts`, title `Patterns/Utilities/Spinner`, built with `createAndInit('SpinnerAPI', id, { AnimationType, Color, Size }, register)` inside `renderPattern` (same helpers as `ButtonLoading.stories.ts`). Stories:
  - **Default** — controls: `AnimationType` (select, 8 values incl. default), `Color` (text; try `primary`, `error`, `#ff6600`), `Size` (select).
  - **AllTypes** — grid of the seven explicit types plus Default, labelled.
  - **Sizes** — five sizes of one type.
  - **Colors** — identifier colours vs. HEX/RGB, to prove the resolver path.
  - **InsideButton** — dropped: ButtonLoading already owns the in-button loading state.
- Documentation follows the other pattern stories: a header comment listing each low-code input as `Name :: Type :: Default` plus the runtime contract and class mapping, every control named after its low-code input with a description, the shared `extendedClassArgType` for `ExtendedClass`, and a doc comment on each story. The meta keeps the default `ui-pending` tag until design signs the component off (`!ui-pending`, `ui-reviewed`).
- No Chromatic animation parameter: Chromatic's default resets CSS animations to their first frame, where every type is fully visible, so the spinner stays under visual test (Mobile UI instead excludes its spinner from snapshots entirely). Do **not** set `pauseAnimationAtEnd`: the last frame of `fade-out` and `scale-out` is invisible, which would blank four of the seven types.
- `stories/_helpers/PatternCatalogue.tsx`: add `{ name: 'Spinner', category: 'Utilities', blurb: 'Animated loading indicator with seven styles.', id: 'patterns-utilities-spinner--default' }` — the `id` must match the story title, otherwise the generated CSS API page cannot link to it (note: ButtonLoading's catalogue id is already wrong for the same reason; out of scope).
- Run `npm run docs:css-api` and commit the regenerated `stories/CssApiReference.mdx` + `stories/_helpers/css-api-manifest.ts` so the four `--osui-spinner-*` properties appear in the CSS API Reference.
- Storybook loads only the **ODC** bundle from `dist/`, so `npm run build` (or `npm run dev -- --target ODC`) must precede `npm run storybook`.

## 5. E2E coverage (`outsystems-ui-tests`)

No registration in the tests repo: wdio globs `tests/functional-tests/**/*.feature` and `**/*steps.ts`.

**Files** — `tests/functional-tests/spinner/`:

| File | Content |
|---|---|
| `Spinner.feature` | tags `@Functional @Spinner @spinner @skipLegacy` (both case variants are what `outsystems-ui/pipelines/pr-pipeline.yaml` derives from `Pattern/Spinner/*` and `04-patterns/…/spinner/*`; `@skipLegacy` because no `Tests_Spinner_OLD` screen exists — same as BottomSheet / FloatingActions) |
| `spinner-page.ts` | `class SpinnerPage extends FunctionalTestsBasePage`, `super('Tests_Spinner', params)`; locators by widget id `//div[contains(@id, "-Spinner_Main")]` plus `osui-spinner*` classes |
| `spinner-page-steps.ts` | filename **must** end in `steps.ts`; every step text suffixed `on "Spinner" page` (steps are global) |
| `spinner-params.ts` | `interface SpinnerParams { AnimationType; Color; Size; ExtendedClass }` |

**Scenarios** (Scenario Outlines where tabular):

| # | Scenario | Assertion |
|---|---|---|
| S1 | Initialized event | `label "Ran Initialized" has value "True"` (shared step) |
| S2 | Default type per platform | desktop browsers → root has `osui-spinner--default`, the `circular` glyph is displayed and the `lines` glyph is not (no `ios` class on `<body>`) |
| S3 | Each explicit AnimationType × expected shape count | the `osui-spinner__<type>` glyph is displayed and holds `dots`→3, `lines`→8, `lines-sharp`→12, `bubbles`→9, `circle`→8, `circular`→1, `crescent`→1 shapes; root class `osui-spinner--<type>` |
| S4 | Size | each of five sizes → class `osui-spinner--<size>` and computed width equals the token px (24/32/40/48/56) |
| S5 | Color identifier vs HEX | `primary` → inline `--osui-spinner-color` is `var(--color-primary)`; `#ff6600` → inline value `#ff6600`; empty → no inline style |
| S6 | ChangeProperty at runtime (settings form Apply) | changing type re-renders SVG count; changing size swaps class; changing colour updates inline var |
| S7 | ExtendedClass | class present on root; changing it swaps class |
| S8 | A11y | `role="progressbar"` (pattern) and `aria-label` (block literal) on root; `aria-hidden="true"` on every glyph svg (block markup) |
| S9 | Add/Remove in runtime (`@removeComponent` / `@addComponent`) | `Spinner` not in DOM after `Remove component = True`; back after `False`; no feedback error |
| S10 | Inside Tabs / Accordion / Form / List (`SpinnerInsideElements.feature`, optional) | S3 holds for `Spinner_InsideTabs2` etc. — only if the test app gets those blocks |

**Test-app contract (`AT_OSUIFunctional` → screen `Tests_Spinner`, built in Service Studio):** settings form with `<label>` text equal to the parameter names (`AnimationType` select, `Color` text, `Size` select, `ExtendedClass` text), an `Apply` button (`btnApplySettings`), `.feedback-message-text`, the `Ran Initialized` label, the `SwitchAddRemove` switch wrapping block `AddRemoveSpinnerBlock`, and widget names `Spinner_Main` (+ `_InsideTabs2`, `_InsideAccordion4`, `_InsideForm`, `_InsideList` if S10 is wanted). Native module `AT_OSUINativeFunctional`: either add the screen + menu link or tag scenarios `@skipNative`.

**Visual tests (optional):** a `@TestSpinner` scenario in `tests/visual-tests/tests/TestReactiveIsolatedPatterns.feature` requires a "Spinner" option in the isolated-patterns screen; Applitools needs animations paused or a region ignore.

Run locally: `yarn functional-web-tests -- --browsers=chrome --environment=dev --cucumberOpts.tagExpression="@Spinner"` (add `--branch=<module suffix>` for a feature-branch module).

## 6. Mobile repos — no changes (D3)

`runtime-mobile-widgets-js` and `OutSystems.WidgetLibrary` are not modified. They are read only, as the source of the low-code surface (§2.2) and the animation geometry (Appendix A). A docs pointer was drafted on 2026-10-10 and then withdrawn at the owner's request; its worktree and branch were deleted.

Known inaccuracies in the Mobile UI Spinner docs page (`Spinner.data.js`: "nine animation types" repeated in three descriptions, two removed types still listed, an unimplemented `Shape` row, and a Color row listing the deprecated enum) are left as they are, for the Mobile UI team to decide on.

## 7. Impact, regression and performance analysis

### 7.1 Breaking changes — none
Additive pattern. No existing pattern, API, enum value, token, theme role or block is modified. `PatternName.Spinner`, `SpinnerAPI` and `ErrorCodes.Spinner` are all unused names today.

### 7.2 Naming / cascade conflicts — mitigated
- Global `.spinner` utility and the `spinner`/`spin`/`loadingSpinner` keyframes: untouched; everything new is `osui-spinner*`-scoped (§3.4).
- An app that already uses the class `osui-spinner` for its own CSS would collide; grep of both OSUI trees finds no such usage. Forge components are outside our control — note in release notes.

### 7.3 Build / bundle — why Ionic is not brought in

The port has **no Ionic dependency**. Ionic contributes four things to the Mobile UI Spinner: a Stencil web-component wrapper with shadow DOM, a seven-entry geometry table, six keyframes, and size/colour tokens. OutSystems UI already has its own lifecycle and the same `--token-*` package, and the other two are plain SVG and CSS.

Sizes measured on the local checkouts (2026-10-10, uncompressed):

| Option | What would ship | Size |
|---|---|---|
| Reuse the Mobile UI runtime | `runtime-mobile-widgets.js` (React + Ionic + every Mobile UI widget) + `outsystems-mobile-widgets.css` | 2,178,763 B JS + 144,706 B CSS |
| Load `@ionic/core` as a provider | `dist/ionic` lazy-loader distribution; loader `ionic.esm.js` alone is 27,614 B, plus the Stencil runtime and per-component chunks | ~5 MB on disk |
| Ionic spinner source only | `spinner.js` + `spinner-configs.js` + `spinner.ionic.css` + `spinner.native.css` — unusable without the Stencil runtime | 23,173 B |
| **Native port (this spec), measured after implementation** | six emitted namespace blocks + spinner rules and keyframes in the dist bundles (dist is not minified and keeps JSDoc comments) | **23,855 B JS (≈14.2 KB without comments/whitespace) + 5,686 B CSS** |

Baseline for comparison: the ODC bundles built with the spinner are 1,363,016 B JS and 1,153,516 B CSS, so the spinner is about 1.8% of the JS bundle and 0.5% of the CSS bundle as shipped. The pre-implementation estimate (~3 KB JS, 2–3 KB CSS, "well under 1%") was too low because it ignored that dist keeps comments and is unminified. Even as shipped, it is about 1% of the size of reusing the Mobile UI runtime.

Besides size, Ionic would be an architectural misfit: its shadow root would hide the SVG from the `--osui-*` CSS API and from `.os-dark-theme` token overrides, breaking the theme invariant, and it is a component runtime rather than a provider global like Splide or Flatpickr. The accepted costs of not using Ionic are a static (not animated) Service Studio preview (§7.4) and manual porting of any future Ionic spinner changes.

Entry SCSS files regenerate on build (expected diff noise).
- Classic theme: `classic-theme/{O11,ODC}.OutSystemsUI.css` is the pre-token snapshot; **recommendation:** port the spinner CSS there via the `osui-classic-theme` skill / `port-to-classic` so apps on the classic theme get the pattern too. Confirm with the owner.

### 7.4 Service Studio preview
The OnRender design-experience script in `outsystems-ui-preview` (`OnRenderJS Preview/Utilities/Spinner.js`, same convention as Tag and ProgressCircle) makes the canvas show the spinner for either markup variant: it applies the `osui-spinner--{type|size}` classes and `ExtendedClass`, sets `--osui-spinner-color` (`var(--color-<name>)` when the theme role exists, raw otherwise), shows the glyph `<svg>` whose class matches `AnimationType` and hides the others, and **if no matching glyph is in the canvas** (InlineSVG variant, or glyphs hidden under an `If`) it draws one itself with `document.createElementNS` and `setAttribute`, the same markup as Appendix A. Building through DOM calls rather than an HTML string means there is nothing for the expression editor to escape (the script contains no double quotes apart from the four `'" + Param + "'` placeholders) and nothing for the canvas to sanitise. It is idempotent: glyphs it drew carry `data-preview` and are removed before each run, since the canvas re-runs the script on every property change. `default` always shows the circular glyph on the canvas: the script maps `default` to `circular` before applying the classes, so the CSS `.ios` rule can never apply at design time (ADR-0011 Q27). The pattern adds no `-servicestudio-*` override, so the canvas gets the runtime CSS. **The canvas shows a static glyph (owner decision, 2026-10-11).** The ODC Studio canvas does not apply animations that come from the module stylesheet (the glyph rendered in its base frame, and a Container with OutSystems UI's existing `spinner` utility class was equally still), while non-animation rules do apply (the lines glyph keeps its star rotation). It does run animations from styles injected by script, which is how the Mobile UI Spinner animates there (its design-time bundle ships the keyframes in JavaScript). Injecting the spinner keyframes, per-type animations and stagger delays from the preview script was built and verified, then removed: it duplicated the SCSS timing in a second repository, to be kept in sync by hand, for a design-time-only effect. The preview script only renders; animating the canvas can be revisited if the canvas ever applies stylesheet animations. The glyph the script draws is absolutely positioned at the top-left of the wrapper and fills it, because on the canvas the `If` placeholders sit inside the wrapper and would otherwise push a flowing glyph below the spinner box.

### 7.5 Runtime performance
- One `<svg>` with up to 12 shapes per spinner, each shape animating `opacity` or `transform` (compositor-only). One spinner is negligible; a list rendering dozens (e.g. per-row loading) is the risk — same order of cost as the Mobile UI Spinner, so no regression, but worth a line in the pattern docs ("prefer one spinner per region").
- `ChangeProperty(AnimationType)` only swaps a class; the platform re-renders the `If` branch. No DOM is generated by the pattern at all.
- Splide (`.splide__spinner`) and VirtualSelect (`.vscomp-options-loader`) keep their own vendor spinners; no consolidation attempted.

### 7.6 Accessibility and motion
- Reduced motion: a pattern-owned media query stops every animation and leaves each type as a static, fully visible glyph, identically in the new and classic themes (§3.2; test procedure in ADR-0011 Q28).
- High contrast (`.os-high-contrast`): raise each type's `--osui-spinner-stroke-width` one step, as ButtonLoading thickens its ring: lines 6→8px (`$token-scale-200`), lines-sharp and crescent 4→6px (`$token-scale-150`), circular 5.6→8 user units. Per-type values are used instead of a single `$token-border-size-075` because the types start from different widths and circular is unitless.
- `role="progressbar"` without `aria-valuenow` is the indeterminate form; acceptable (matches Ionic).

### 7.7 RTL
Ionic deliberately keeps spinners non-RTL-aware. The pattern follows: physical `top/left` on the svg layer plus inline x-transforms; no `.is-rtl` rule needed. Documented in the SCSS per rules §15.

### 7.8 CI / pipeline risks (pre-existing, found during analysis)
- `outsystems-ui/pipelines/pr-pipeline.yaml` lines 100/125/148/173 reference `pipelines/templates/build-and-execute-functional-tests-template.yml@outsystems-ui-tests`, but on the tests repo's `dev` the file lives at `pipelines/templates/steps/…`. Until that path is updated, the Spinner PR's E2E stages cannot resolve. **Separate fix, separate ticket.**
- The same script never resets `ELEMENT` between loop iterations (harmless for this PR thanks to de-duplication).
- `.claude/rules/scss.md` §1/§5 still describe a `src/scripts/**/scss/` tree that no longer exists (pattern SCSS is only under `src/scss/04-patterns/`); `.claude/rules/typescript.md` §6/§10 say "no `enum`, use const objects", while every pattern `Enum.ts` in the repo uses `export enum`. This spec follows the **code** (`export enum`), not the rule text. Both docs deserve a cleanup PR.

## 8. Work plan by repository (all on `gm-test-spinner`)

### 8.1 Branch and PR hygiene (applies to every repo)
- Create `gm-test-spinner` from `dev` in outsystems-ui and outsystems-ui-tests only. No branch is created in the Mobile UI repos (D3).
- Both repos enforce `^[A-Z][A-Z0-9]*-\d+:?\s\w` on PR titles and require a label. **A ROU ticket is needed before any PR**; the branch can keep its name but commits/titles must be `ROU-xxxxx: …`.
- No commits or pushes until explicitly approved (per the task's commit-safety rule).

### 8.2 Order of work
1. **outsystems-ui** — pattern (§3), SCSS (§3.4), gulp specs, regenerate entry SCSS, story + catalogue + `docs:css-api`, `src/README.md` tree entry, `_excluders.scss`. Gates: `npm run build` green, `npm run lint` zero errors **and** zero warnings, verify in Storybook (ODC) and `npm run dev -- --target O11` for the O11 bundle. PR label `feature`. Record the decisions in ADR-0011 (done).
2. **OutSystems UI OML** (Service Studio, manual) — static entities `SpinnerAnimationType`, `SpinnerSize`; block `Spinner`; publish to the test environment. Not a git step.
3. **Test app `AT_OSUIFunctional`** (Service Studio, manual) — `Tests_Spinner` screen per §5.
4. **outsystems-ui-tests** — suite per §5; `yarn lint && yarn build`; run `@Spinner` against dev. PR label `feature`; PR template checkbox "requires OutSystems changes / new sample page" ticked with the module name.

### 8.3 Definition of done
- All seven types + Default render in Storybook light/dark, LTR/RTL, five sizes, identifier + HEX colours.
- Reduced-motion static frames verified with the OS setting.
- E2E S1–S9 green on Chrome and Safari non-legacy stages.
- CSS API Reference lists `--osui-spinner-color|size|stroke-width`.
- Release notes drafted (OutSystems UI O11 + ODC) via the `outsystems-release-notes` skill.

## 9. Open points — defaults taken for the first implementation pass

The owner approved implementation on 2026-10-10 without resolving these, so the first pass uses the defaults below. Each is cheap to reverse.

1. **Existing static entities in the OutSystems UI OML** — unverifiable locally (OML is unreadable). Default: the block uses two new static entities as specified in §3.1; the Service Studio work reconciles with any existing entity.
2. **Classic theme parity** — **ported** on 2026-10-10 into both `classic-theme/*.OutSystemsUI.css` bundles; mapping and approximations are logged in `classic-theme/README.md` under Hand-applied ports.
3. **Mobile UI notes** — **none** in either Mobile UI repo (D3, owner decision).
4. **Native test module** — default: native scenarios tagged `@skipNative` until a native screen exists.
5. **ADR** — **written**: [`ADR-0011`](./adr/ADR-0011-spinner-pattern-ported-from-mobile-ui-without-ionic.md) collects the options explored and every resolved design decision. Status Proposed until a ROU ticket and team review.

## Appendix A — Glyph markup (what the block's HTML Element widgets contain)

All glyphs use `viewBox="0 0 64 64"` except `circular` (`24 24 48 48`); every `<svg>` carries `class="osui-spinner__<type>"` and `aria-hidden="true"`. Shapes carry no inline style; rotation, offsets and delays are CSS `nth-child` (§3.4). The ring radius is 20.48 (32% of 64), the value the Mobile UI Spinner uses.

| Type | Children (in document order) |
|---|---|
| `dots` | `<circle cy="32" r="6">` with `cx` = 52.48, 32, 11.52 |
| `lines` | 8 × `<line x1="32" y1="6" x2="32" y2="18">` (CSS rotates child *n* by 45°·(n−1)) |
| `lines-sharp` | 12 × `<line x1="32" y1="3" x2="32" y2="15">` (CSS rotates child *n* by 30°·(n−1)) |
| `bubbles` | 9 × `<circle r="5">` at (cx, cy) = (52.48, 32.00) (47.69, 45.16) (35.56, 52.17) (21.76, 49.74) (12.76, 39.00) (12.76, 25.00) (21.76, 14.26) (35.56, 11.83) (47.69, 18.84) |
| `circle` | 8 × `<circle r="5">` at (cx, cy) = (52.48, 32.00) (46.48, 46.48) (32.00, 52.48) (17.52, 46.48) (11.52, 32.00) (17.52, 17.52) (32.00, 11.52) (46.48, 17.52) |
| `circular` | 1 × `<circle cx="48" cy="48" r="20">` |
| `crescent` | 1 × `<circle cx="32" cy="32" r="26">` |
| `default` | the `lines` glyph followed by the `circular` glyph |

Timing (CSS): lines, lines-sharp, bubbles, circle 1000ms with child *n* delayed by 1000·(n−1)/count − 1000 ms; dots 750ms with delays 0 / −110 / −220 ms; crescent 750ms rotation; circular 1400ms rotation plus the inner dash animation. These are the Mobile UI Spinner's values.
