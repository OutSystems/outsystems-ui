# ADR-0011: Spinner pattern ported from Mobile UI without the Ionic Framework

## Status

Proposed — implemented on the exploratory branch `gm-test-spinner` (outsystems-ui and outsystems-ui-tests),
not yet committed. Needs a ROU ticket and team review before it can be Accepted.

## Context

Mobile UI (O11/ODC mobile apps) ships a **Spinner** widget. OutSystems UI (Reactive Web and Native Mobile)
has none: loading indicators are hand-made, or borrowed from ButtonLoading's inline ring. The goal is a native
OutSystems UI `Spinner` pattern with its own TypeScript class that mirrors the Mobile UI low-code surface.

What the Mobile UI Spinner actually is:

```
OutSystems.WidgetLibrary/Common/Widgets.xml ──(ModelPluginGenerator)──► Spinner.Generated.{cs,ts}
runtime-mobile-widgets-js …/Spinner/Spinner.tsx ──► <IonSpinner color name size/>   (React wrapper)
@ionic/core spinner.js + spinner-configs.js + spinner.ionic.css ──► <ion-spinner> shadow DOM, N <svg>
```

- **Everything visual lives in Ionic**: the seven animations' SVG geometry, the six keyframes, the durations,
  the size and colour defaults. The Mobile UI repo has no spinner stylesheet and no SVG of its own.
- **Low-code surface** (`Widgets.xml:1412-1447`): `AnimationType` (System Default, Dots, Lines, Lines Sharp,
  Bubbles, Circle, Circular, Crescent), `Visible`, `Color` (a text expression; `"primary"` when dropped), a
  hidden deprecated `SpinnerColor` enum, `Size` (Xsmall…ExtraLarge, default Xsmall) and `Style`. No events.
- **OutSystems UI constraints**: providers are browser globals loaded by the host app and reached only through
  provider wrappers (ARCHITECTURE T1); public APIs return envelopes (T2); patterns live in an ID registry (T3)
  with a symmetric build/dispose lifecycle (T4); components expose a `--osui-*` CSS API, and a theme must be
  able to re-skin them through custom properties alone (CSS-ARCHITECTURE §5).

The central question is how to bring the Spinner over when everything it draws comes from Ionic, which
OutSystems UI does not and should not depend on.

## Decision Drivers

- **No Ionic, no new runtime dependency.** Bundle size and load cost on every OutSystems UI app.
- **Low-code consistency with Mobile UI.** Same animation types, sizes and colour semantics, so developers moving
  between the two libraries find the same widget.
- **Visual parity.** The same geometry and timing as Mobile UI, not "a spinner".
- **Theming and the CSS API.** The spinner must be styleable through `--osui-*` and follow `.os-dark-theme`.
- **Framework conventions.** T2–T5, registry, envelopes, ESLint naming, logical properties, generated entry files.
- **Accessibility.** Screen-reader semantics, reduced motion, high contrast.
- **Leave Mobile UI untouched.** The owner's explicit constraint.

## Considered Options

-   **A. Reuse the Mobile UI runtime bundle** (`runtime-mobile-widgets.js`: React + Ionic + every Mobile UI widget)
    -   Pros: exact parity for free.
    -   Cons: 2,178,763 B of JS plus 144,706 B of CSS for one loading indicator; brings React into a library that
        has none; couples OutSystems UI releases to Mobile UI releases.
-   **B. Load `@ionic/core` as a provider global**, wrapped under `Providers/OSUI/`
    -   Pros: exact parity; formally fits the provider model.
    -   Cons: Ionic is a component runtime, not a widget library — Stencil runtime plus lazy chunks (the `dist/ionic`
        distribution is ~5 MB on disk; the loader alone is 27,614 B). The SVG renders inside a **shadow root**, so
        the `--osui-*` CSS API cannot reach it and `.os-dark-theme` token overrides do not pierce it — the theme
        invariant breaks. The host app would have to load Ionic.
-   **C. Copy only Ionic's spinner sources** (`spinner.js`, `spinner-configs.js`, `spinner.ionic.css`, 23,173 B)
    -   Pros: small.
    -   Cons: they compile against the Stencil runtime and do not run without it; a vendored fork to maintain.
-   **D. CSS-only ring** (like ButtonLoading), Color and Size inputs only
    -   Pros: trivial, ~1 KB, no TypeScript.
    -   Cons: does not mirror Mobile UI's `AnimationType`; breaks low-code consistency.
-   **E. Native port of two single-element types only** (Circular, Crescent)
    -   Pros: nearly pure CSS; small.
    -   Cons: five of the seven Mobile UI types unavailable; a partial `AnimationType` enum is confusing.
-   **F. Native port of all seven types.** First form: a TypeScript class builds the SVG from a ported geometry
    table and SCSS owns the keyframes. Final form (**hybrid**, 2026-10-11): the block authors the glyph markup with
    HTML Element widgets, SCSS owns geometry and keyframes, and the TypeScript class only applies classes and colour.
    -   Pros: full parity; no dependency; light DOM, so the CSS API and theme work; follows every framework tenet;
        `AnimationType` can change at runtime.
    -   Cons: ~24 KB JS / ~6 KB CSS in the unminified dist; Ionic changes to the spinner must be ported by hand;
        no live animated preview in Service Studio.
-   **F′. Same as F, but with the SVG authored in the Service Studio block** instead of generated by TS
    -   First rejected (per-element inline geometry would have to be authored by hand), then **adopted** once the
        geometry moved to CSS `nth-child` rules: the siblings become identical, the `If` per type is the normal
        low-code way to switch markup, the canvas renders the glyph natively, and the accessible name becomes a
        translatable literal. This is the shipped shape (Q25).

## Decision Outcome

Chosen option: **"F. Native port of all seven types"**, because it is the only option that meets both hard
drivers at once — no Ionic or other runtime dependency, and full low-code and visual parity with Mobile UI — while
keeping the spinner inside the `--osui-*` CSS API and the theme.

### Measured cost (2026-10-10, uncompressed)

| What ships | Size |
|---|---|
| Spinner in `dist/ODC.OutSystemsUI.js` (six namespace blocks, with JSDoc comments) | 23,855 B (≈14.2 KB without comments/whitespace) |
| Spinner rules + keyframes in `dist/ODC.OutSystemsUI.css` | 5,686 B |
| Share of the ODC bundles | ≈1.8% JS, ≈0.5% CSS |
| Option A for comparison | 2,178,763 B JS + 144,706 B CSS |

The dist bundles are not minified and keep comments; minified and gzipped the spinner is a few KB.

### Resolved design decisions

| # | Decision | Rationale |
|---|---|---|
| Q1 | **All seven animation types + Default** (dots 3, lines 8, lines-sharp 12, bubbles 9, circle 8, circular 1, crescent 1; 750/1000/1400 ms), with the geometry ported verbatim. Where it lives changed in Q25: markup in the block, geometry and timing in CSS. | Parity with Mobile UI was the reason for the port. |
| Q2 | **Default resolves in CSS**: the block renders both the lines and the circular glyph under the `default` branch; `.osui-spinner--default` hides lines, `.ios .osui-spinner--default` shows lines and hides circular. (Superseded the first form, a user-agent check in TypeScript.) | The platform already sets the `ios` class on `<body>`, so no TypeScript detection is needed and the choice re-evaluates whenever the class does. |
| Q3 | **Color is one free-text input that accepts any colour** (owner decision, 2026-10-11): a name with a `--color-*` role is written inline as `var(--color-<name>)`; anything else (HEX, RGB, HSL, CSS keyword) as-is; empty removes the override. The deprecated Mobile UI `SpinnerColor` enum has no counterpart. | Mirrors Mobile UI's `SpinnerColorExpression` rather than tying the input to the Color entity, so any colour an app uses works, while theme names still follow the theme and dark mode (an improvement over Progress, which inlines resolved values). |
| Q4 | **Empty Color = theme default** `--osui-spinner-color: $token-icon-subtlest`. | Equals Mobile UI's default (`neutral-800`) and flips with `.os-dark-theme`; a fixed `Neutral` identifier would not. |
| Q5 | **Size: xsmall 24 / small 32 / medium 40 / large 48 / xlarge 56 px** (`$token-scale-600…1400`), default xsmall. | Exactly Mobile UI's `spinner-{size}` token mapping. |
| Q6 | **Not ported**: Mobile UI `Shape` (documented, never implemented), the hidden deprecated `SpinnerColor`, Ionic `duration`/`paused` (never exposed), `LinesSmall`/`LinesSharpSmall` (removed by Mobile UI's own upgrader). `Visible` stays a platform concern; `Style` becomes the standard `ExtendedClass`. | YAGNI and OutSystems UI block conventions. |
| Q7 | **`Initialized` event added**, registered between `Create` and `Initialize`. | Every OutSystems UI block has it and the E2E harness asserts it. It fires inside `finishBuild()`, so a callback registered after `Initialize` is never called. |
| Q8 | **CSS API: `--osui-spinner-color`, `-size`, `-stroke-width` only.** No duration knob. | TS writes each element's `animation-duration` together with its matching negative `animation-delay`; a CSS-only duration override would desync the stagger. |
| Q9 | **Everything is `osui-spinner`-scoped**: classes `osui-spinner`, `osui-spinner--{type}`, `osui-spinner--{size}`; keyframes `osui-spinner-{fade-out,scale-out,dots,circular-inner}`. Rotation reuses the global `spin` keyframe. | The global `.spinner` utility and the `spinner` and `loadingSpinner` keyframes already exist and must not be redefined; `spin` is byte-identical to what the spinner needs, so it is reused rather than duplicated. |
| Q10 | **Reduced motion is owned by the pattern** (superseded the first form, which relied on the global reset): `@media (prefers-reduced-motion: reduce) { .osui-spinner svg, .osui-spinner circle, .osui-spinner line { animation: none } }`. Spinner animations must never set `animation-fill-mode`. | The global reset in `01-foundations/_resets.scss` exists only in the new theme; the classic snapshot has none, so a classic-theme app kept spinning with reduced motion on. With no animation each type shows its base frame: all lines, circles and dots at full opacity and scale (lines keep their star rotation, which is a base style), the crescent and circular arcs unrotated — still recognisable as a loading indicator. Mobile UI's Ionic spinner ignores the setting; this is a deliberate accessibility improvement over it. See Q28 for how to test it. |
| Q11 | **Not mirrored in RTL**: the `svg` layer keeps physical `top/left`, documented in the SCSS. | Ionic deliberately keeps spinners non-RTL-aware; the elements carry x-axis transforms, and scss rules §15 trap 1 forbids pairing those with logical insets. |
| Q12 | **Accessibility**: `role="progressbar"` set by the pattern; `aria-label` is a text literal on the Container in the block, so Multilingual translates it; `aria-hidden="true"` on every glyph `<svg>` in the markup. | Indeterminate progressbar, as in Mobile UI. Moving the label to low-code (Q25) removed the hardcoded English string the first form had. |
| Q13 | **High contrast** raises each type's stroke width one step (lines 6→8 px, lines-sharp/crescent 4→6 px, circular 5.6→8 units). | Types start from different widths and circular is unitless, so one shared border-size token does not fit. |
| Q14 | **Service Studio preview**: the canvas renders the block's own glyph markup; the OnRender script in `outsystems-ui-preview` (`OnRenderJS Preview/Utilities/Spinner.js`) only applies the classes and colour and hides the `If` branches that do not match `AnimationType`; the pattern adds no `-servicestudio-*` override, so the canvas receives the runtime CSS. **The canvas shows a static glyph (owner decision, 2026-10-11).** The ODC Studio canvas does not apply animations that come from the module stylesheet (the glyph rendered in its base frame, and a Container with OutSystems UI's existing `spinner` utility class was equally still), while non-animation rules do apply (the lines glyph keeps its star rotation). It does run animations from styles injected by script, which is how the Mobile UI Spinner animates there (its design-time bundle ships the keyframes in JavaScript). Injecting the spinner keyframes, per-type animations and stagger delays from the preview script was built and verified, then removed: it duplicated the SCSS timing in a second repository, to be kept in sync by hand, for a design-time-only effect. The preview script only renders; animating the canvas can be revisited if the canvas ever applies stylesheet animations. When no glyph is in the canvas (InlineSVG blocks, or glyphs kept off the canvas under an `If`), the script draws the matching one with DOM calls, pinned to the spinner box. | Earlier forms were dropped: a `-servicestudio-border` placeholder ring, a script that generated the SVG as an HTML string (doubled-quote escaping made it fragile), and a still canvas (`-servicestudio-animation: none`), removed at the owner's request. |
| Q15 | **Config defaults are re-validated after `super()`**, never field initializers; invalid values fall back to defaults and never throw. Enum values must match exactly (lower-case kebab), as every other pattern config expects. | `AbstractConfiguration` validates only keys present in the JSON, and field initializers run after `super()` and would overwrite received values. A case-folding step was tried and removed in review: no peer config does it, and the identifiers are owned by the library's own static entities. |
| Q16 | **Dispose is symmetric with build**: removes the generated SVGs, modifier classes, inline colour, `role` and `aria-label`. | ARCHITECTURE T4 (found in review, reproduced, fixed). |
| Q17 | **Placement**: Utilities section (beside ButtonLoading), `PatternName.Spinner`, error codes `OSUI-API-34001…34003`. | 34xxx is the next free prefix after WizardItem. No TS build registration exists; SCSS is registered in the gulp specs. |
| Q18 | **`export enum` in `Enum.ts`**, as every existing pattern does. | `.claude/rules/typescript.md` says to prefer const objects, but the code base uniformly uses enums; the code wins. |
| Q19 | **Storybook** story `Patterns/Utilities/Spinner` (Default, AllTypes, Sizes, Colors), documented like the other pattern stories, tagged `ui-pending` until design sign-off. **Chromatic keeps its default first-frame reset; `pauseAnimationAtEnd` is not used.** | The last frame of fade-out/scale-out is invisible, so pausing at the end would blank four of the seven types (found in review). |
| Q20 | **Classic theme parity**: the compiled spinner CSS is hand-ported into both `classic-theme/*.OutSystemsUI.css`, de-tokenised; logged in `classic-theme/README.md`. | Reviewers can compare the new and classic look with the Theme toolbar. |
| Q21 | **E2E**: `outsystems-ui-tests/tests/functional-tests/spinner/`, tags `@Functional @Spinner @spinner @skipLegacy @skipNative`, against a new `Tests_Spinner` screen in `AT_OSUIFunctional`. Parameter changes are re-applied on the same page, not by re-navigating. | Both tags are what the PR pipeline derives from the changed paths. No legacy or native screen exists yet. |
| Q23 | **Circular rotation uses the global `spin` keyframe, and the svg layer carries no `translateZ(0)`.** | Ionic's `spinner-circular` keyframe has only a 100% frame; combined with a base `transform: translateZ(0)` the browser interpolates identity→identity and the ring never rotates (verified: the svg transform stayed at the identity matrix). `spin` has an explicit 0% frame. Dropping the compositing hint also removes a transform the inline rotations overrode anyway. |
| Q24 | **Shared helper `Helper.Dom.Styles.GetColorCssValueFromColorType`** returns `var(--color-<name>)` for theme colours and the raw value otherwise; the pattern uses it instead of a local prefix constant. | Keeps the `--color-` role prefix in one file next to the existing resolver. ProgressBar/ProgressCircle could adopt it later to fix their dark-mode colour (separate follow-up). |
| Q27 | **At design time Default is always "not iOS", i.e. circular.** The OnRender preview script maps `default` (and empty) to `circular` before applying the classes, so the CSS iOS rule (`.ios .osui-spinner--default`) can never apply on the canvas, whatever classes the canvas page carries. With HTML Element markup the circular glyph is shown and the lines glyph hidden; with InlineSVG markup the circular glyph is drawn. | The canvas has no device: picking circular is the only deterministic choice and matches what every non-iOS runtime shows. Verified with an `ios` class forced on the page: both markup variants still showed circular. Runtime is unchanged: Default follows the device's `ios` body class. |
| Q28 | **How to test reduced motion** (same expected result in both themes; runtime only, since the canvas never animates — Q14): every spinner type is still and fully visible; lines and lines sharp still form a star; the crescent and circular arcs are visible but not rotating; turning the setting off resumes the animation without a reload. **Browser (fastest):** Chrome or Edge DevTools → ⋮ → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → `reduce`; check the Storybook `Patterns/Utilities/Spinner` stories with the Theme toolbar on New and on Classic, then a test-app screen. **Operating system (also drives real devices):** Windows 11 Settings → Accessibility → Visual effects → Animation effects **Off**; macOS System Settings → Accessibility → Display → Reduce motion **On**; iOS Settings → Accessibility → Motion → Reduce Motion **On**; Android Settings → Accessibility → Remove animations **On**. **Automated:** not covered by the E2E suite yet; a WebdriverIO scenario can emulate the media feature through the DevTools protocol (`Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce`) and assert `animation-name: none` on the glyph shapes. | The rule is a media query, so it cannot be seen without emulating the preference; this records the checks once so every reviewer runs the same ones. The pattern rule was verified in Storybook by applying its declarations directly: all 8 types still, all shapes at opacity 1, lines keeping their rotation. |
| Q26 | **Rotation on the shape, not the `<svg>`** (crescent, circular): `spin` runs on the `circle` with `transform-box: fill-box; transform-origin: center`; circular stacks it with the dash animation. | Found on the deployed test app: an extra outer `<svg>` around the glyph carried the same class, so both SVGs rotated and the glyph spun twice. Shape-level rotation is immune to any number of wrappers. |
| Q25 | **Hybrid split (owner decision, 2026-10-11): markup in low-code, geometry in CSS, behaviour in TypeScript.** The block authors one `<svg class="osui-spinner__<type>">` per type with identical child shapes (HTML Element widgets inside an `If` per type); SCSS `nth-child` mixins apply rotation / offsets / stagger; the TypeScript class only applies `osui-spinner--{type|size}`, `ExtendedClass`, the inline colour and `role`. `SpinnerAnimations.ts`, the inline per-element styles and the user-agent check were deleted. | Easier to maintain (the structure is visible in Service Studio, geometry is 40 lines of CSS instead of a table in TypeScript), the canvas renders natively, the label is translatable, and the TypeScript class the brief asked for stays, now as thin as the other class-toggling patterns. Cost: 42 HTML Element widgets to author once; a bigger CSS footprint (the `nth-child` rules) than the generated-SVG form. |
| Q22 | **Mobile UI is not changed.** `runtime-mobile-widgets-js` and `OutSystems.WidgetLibrary` are read-only sources. | Owner decision (2026-10-10). A docs pointer was drafted and then withdrawn; its branch was deleted. |

Positive consequences:

-   OutSystems UI gains a Spinner with the same seven animations, sizes and colour semantics as Mobile UI, at
    about 1% of the cost of option A and with no new dependency.
-   The spinner is fully themeable through `--osui-spinner-*`, follows dark mode, and works in the classic theme.
-   Appendix A of the spec and the SCSS mixins give a single place to compare against future Mobile UI changes.

Negative consequences:

-   Ionic spinner changes are no longer inherited; they must be ported by hand into the block markup and the
    SCSS geometry.
-   Service Studio shows a still glyph, not the animation.
-   Colour vocabularies differ slightly between libraries: Mobile UI accepts Ionic colour names, OutSystems UI
    accepts its theme colour names plus any CSS colour. Apps moving a screen between libraries should re-check the colour.
-   The `aria-label` is a block literal: translated through Multilingual, but not configurable per instance.

Known gaps and follow-ups, not caused by this decision but surfaced by it:

-   The Service Studio block and its two static entities (`SpinnerAnimationType`, `SpinnerSize`) and the
    `Tests_Spinner` test screen are manual work still to do; the OutSystems UI OML could not be inspected locally.
-   `pipelines/pr-pipeline.yaml` references `pipelines/templates/build-and-execute-functional-tests-template.yml`
    in outsystems-ui-tests, which now lives under `pipelines/templates/steps/`; E2E stages will not resolve until it
    is fixed.
-   outsystems-ui-tests `yarn lint` fails on three pre-existing `@wdio/protocols` type errors on `dev`.
-   `npm run docs:css-api` also refreshed stale non-spinner entries from `dev` in `css-api-manifest.ts`.
-   `.claude/rules/scss.md` §1/§5 still describe a `src/scripts/**/scss/` tree that no longer exists, and
    `.claude/rules/typescript.md` contradicts the enum convention (Q18).

## Links

-   Spec: [`docs-internal/spinner-pattern-design.md`](../spinner-pattern-design.md) (low-code mapping, DOM contract,
    E2E scenarios, Appendix A geometry table).
-   Implementation plan: session working notes, kept outside the repo (the ADR log explains why working logs are not committed).
-   Pattern: `src/scripts/OSFramework/OSUI/Pattern/Spinner/`, `src/scripts/OutSystems/OSUI/Patterns/SpinnerAPI.ts`,
    `src/scss/04-patterns/06-utilities/spinner/_spinner.scss`, `src/scss/07-keyframes/_spinner.scss`.
-   Story: `stories/Spinner.stories.ts`. Classic port log: [`classic-theme/README.md`](../../classic-theme/README.md).
-   Design-time preview: outsystems-ui-preview `OnRenderJS Preview/Utilities/Spinner.js` (branch `gm-test-spinner`).
-   Porting sources (read-only): Ionic `core/src/components/spinner/` (`spinner-configs.ts`, `spinner.tsx`,
    `spinner.scss`); runtime-mobile-widgets-js `src/scripts/Components/Spinner/`; OutSystems.WidgetLibrary
    `Common/Widgets.xml`, `ServiceStudio/Widgets/Spinner.cs`, `ServiceStudio/Upgraders/Upgrader_0_3_927_0.cs`.
-   E2E: outsystems-ui-tests `tests/functional-tests/spinner/`.
-   Related: ARCHITECTURE.md tenets T1–T5; CSS-ARCHITECTURE.md §5 (theme invariant); `.claude/rules/scss.md` §15.

## Date

2026-10-10
