# Part Three: Storybook Implementation

**Status: complete.** This document records the Storybook harness that was built
for OutSystems UI, the architectural decisions behind it, and the contract gotchas
discovered while wiring every pattern up. It is a record of what shipped, not a
forward-looking plan.

Where Part One (`plan.md`) and Part Two (`plan-part-two.md`) cover the SCSS
token migration, this part covers the **visual verification surface** built on
top of it: a Storybook that renders the *compiled* library so the new token
theme can be eyeballed component-by-component (and diffed against the
pre-migration baseline via a toolbar toggle).

---

## Objective

Stand up a Storybook that documents and visually verifies every OutSystems UI
component **without reimplementing any of them**. The Storybook drives the real
compiled bundle (`dist/ODC.OutSystemsUI.{js,css}`) exactly the way OutSystems
Service Studio does at runtime, transcribed to high-code. This gives:

1. A living catalogue of all 70+ patterns and CSS-only blocks.
2. A side-by-side **new-theme vs deprecated-theme** toggle for reviewing the
   token migration's visual impact (the Phase 0 snapshot in `deprecated/` is the
   comparison baseline).
3. An **icon-library** toggle (FontAwesome ↔ Phosphor) and an
   **`has-accessible-features`** toggle, so a11y affordances and both icon fonts
   can be reviewed in place.
4. A per-component UI sign-off workflow via story tags (`ui-pending` →
   `ui-reviewed`).

---

## Approach — drive the compiled bundle, don't reimplement

The key decision (vs. the design-tokens repo's React docs-only Storybook): this
Storybook uses **`@storybook/html-vite`** and loads the **compiled** OUI bundle
as classic `<script>` tags. OUI patterns are not framework components — they are
TypeScript behaviour classes that attach to platform-rendered HTML. So each
story reproduces the three runtime steps:

1. Render the HTML skeleton the pattern expects (located by `name=<id>`).
2. `OutSystems.OSUI.Patterns.<Pattern>API.Create(id, configsJSON)`.
3. `…Initialize(id)` → runs the pattern's `build()`.

HTML skeletons are **derived from each pattern's TypeScript contract**
(`Enum.ts` CSS classes, `Config` defaults, the selectors `build()` queries) —
**not** from an unpacked OML (OML unpacking yields the Service Studio widget
tree, not the rendered DOM).

**Prerequisite:** the bundle must exist first — `npm run build:osui` (one-shot
gulp production build, ODC) or `npm run dev -- --target ODC`, then
`npm run storybook`.

---

## File layout

```
.storybook/
├── main.ts                 # html-vite config; staticDirs map dist/ + node_modules vendors to /osui, /vendor/*
├── preview-head.html       # loads icon fonts, vendor CSS/JS, platform base CSS, OUI bundle (order-critical)
├── preview.ts              # decorators + toolbar globals (theme / iconLibrary / accessibleFeatures), storySort
└── platform/
    └── platform-core.css   # OutSystems core base widget CSS (must load BEFORE the OUI theme)

stories/
├── Introduction.mdx        # the catalogue overview
├── _helpers/
│   ├── osui.ts             # renderPattern / renderStatic / createAndInit / osuiRoot / cfg / uid
│   ├── lowcode.ts          # cls() + shared low-code argTypes (COLOR_OPTIONS, ExtendedClass, UsePadding)
│   └── widget.ts           # React-widget harness (runtimeMock, createVariable, mountWidget, StoryRoot)
├── *.stories.ts            # JS-driven patterns + CSS-only static blocks (45 files)
└── widgets/*.stories.ts    # platform React widgets (17 files)
```

---

## Build / serving model

`main.ts` wires everything through `staticDirs` — nothing is bundled by Vite,
it's all served as static assets and loaded by `preview-head.html`:

| Served at | From | Purpose |
| --- | --- | --- |
| `/osui` | `dist/` | Compiled OUI bundle (new token theme) |
| `/deprecated` | `deprecated/` | Phase 0 pre-migration CSS snapshot (theme toggle target) |
| `/platform` | `.storybook/platform/` | Core platform base widget CSS |
| `/vendor/font-awesome` | `node_modules/font-awesome` | FA 4.7 default icon font |
| `/vendor/phosphor` | `@phosphor-icons/web/src/regular` | Alternate icon font |
| `/vendor/flatpickr` | `flatpickr/dist` | DatePicker/MonthPicker/TimePicker provider + monthSelect plugin |
| `/vendor/splide` | `@splidejs/splide/dist` | Carousel provider |
| `/vendor/nouislider` + `/vendor/wnumb` | `nouislider/dist` + `wnumb` | RangeSlider provider (wNumb is required) |
| `/vendor/floating-ui-core` + `-dom` | `@floating-ui/{core,dom}/dist` | Tooltip / balloon positioning |
| `/vendor/virtual-select` | `virtual-select-plugin/dist` | Dropdown (search/tags) provider |

### Load order is the whole game (`preview-head.html`)

1. **Icon fonts** — both `FontAwesome` and `Phosphor` `@font-face` families
   (the bundle ships no `@font-face`; the active set is chosen by a toolbar root
   class).
2. **Provider vendor CSS.**
3. **Platform core CSS (`/platform/platform-core.css`) — BEFORE the OUI theme.**
   OUI is only a *theme*: it overrides widget pseudo-elements but assumes the
   platform's base CSS already established their structure and pseudo-element
   `content` (the checkbox box, switch track/thumb, etc.). Standalone, those
   controls render invisible. Loading this AFTER OUI regresses to the legacy
   design (e.g. the switch goes back to legacy green instead of OUI blue).
4. **OUI stylesheet** (`#osui-theme` link — the toolbar swaps its `href` between
   `/osui` and `/deprecated`).
5. **All `<script>`s are `defer`'d**, vendors before the bundle. Required: the
   OUI bundle attaches a `document.body` click listener at load (`BodyOnClick`);
   without `defer`, `document.body` is null in `<head>` and the bundle throws.
   `defer` also preserves order so vendors initialise first.

---

## Toolbar globals & decorators (`preview.ts`)

A single `withAppShell` decorator stamps the platform body shell
(`.desktop`, `.active-screen`, `dir="ltr"`) and applies three toolbar globals:

- **Theme** — swaps `#osui-theme` href between the new token theme (`/osui`) and
  the deprecated snapshot (`/deprecated`). Both are self-contained stylesheets,
  so swapping the href is sufficient.
- **Icons** — `FontAwesome` (default) vs `Phosphor`. Toggles root classes:
  `.icon-library-FontAwesome` / (`.iconLibrary-phosphor` + `.icon-library-Phosphor`).
  The `iconLibrary-phosphor` class overrides the `--osui-icon-*` vars; the
  `.icon-library-*` classes gate the flatpickr month-nav arrows.
- **A11y features** — toggles the `has-accessible-features` body class
  (focus rings / a11y affordances; off by default).

`storySort` order: `Introduction` → `Patterns` (Content, Interaction,
Navigation, Adaptive, Numbers, Utilities) → `Widgets`.

---

## Story harness (`stories/_helpers/osui.ts`)

The shared driver. Key exports and the contract they encode:

- **`osuiRoot(id)`** → emits `id="…" name="…" data-block="osui"`. OUI's
  `AbstractPattern` locates the element by `name` (`getElementsByName`) and
  derives `widgetId` from `selfElement.closest('[data-block]').id`
  (`AbstractPattern.ts:42-43`). Collapsing the `[data-block]` wrapper onto the
  root satisfies all three lookups with one element.
- **`cfg(configs)`** → `JSON.stringify` with `ExtendedClass: ''` injected.
  `AbstractPattern` calls `configs.ExtendedClass.split(...)` for every pattern,
  so omitting it throws.
- **`renderPattern(template, init)`** → injects the HTML, waits two
  `requestAnimationFrame`s for the node to be connected, then runs `init`;
  surfaces init failures as a red `<pre>` in the canvas. Flushes the previous
  story's teardowns first so the OUI registry (a `Map` keyed by id) and global
  listeners don't accumulate across story switches / HMR.
- **`createAndInit(apiName, id, configs, register)`** → `Create` + `Initialize`
  + registers `Dispose` for cleanup.
- **`renderStatic(template)`** → for CSS-only blocks (no `Create`/`Initialize`).
- **`uid(prefix)`** → fresh per-render ids to avoid "already registered" throws.

---

## Coverage

### JS-driven patterns — every public pattern API

- **Content** — Accordion, Carousel, FlipContent
- **Interaction** — AnimatedLabel, BottomSheet, ButtonLoading, DatePicker,
  Dropdown, MonthPicker, Notification, RangeSlider, Search, TimePicker, Tooltip
- **Navigation** — OverflowMenu, SectionIndex, Sidebar, Submenu, Tabs
- **Adaptive** — Gallery
- **Numbers** — Progress (Bar + Circle), Rating
- **Utilities** — InlineSvg, Video, SwipeEvents, TouchEvents

**Not storied:** `DropdownServerSideItem` — server-side variant, needs the
server-side parent + a data source to render meaningfully.

#### `Create()` signature variants (the ones that aren't `(id, configs)`)

| Pattern | Signature |
| --- | --- |
| Progress | `(id, type, configs)` — `type` ∈ `Bar` \| `Circle` |
| Carousel | `(id, configs, 'Splide')` |
| DatePicker / MonthPicker / TimePicker | `(id, configs, 'flatpickr')` |
| RangeSlider | `(id, configs, mode, 'noUiSlider')` — `mode` ∈ `single` \| `interval` |
| Dropdown | `(id, mode, provider, configs)` — `mode` ∈ `search` \| `tags`, `provider = 'virtual-select'` |

### CSS-only static blocks (`renderStatic`)

Pure markup styled by the shipped stylesheet (no JS). Storied with the
**shipped** class names from each `_*.scss` (which sometimes differ from the
proposed-showcase names): Alert, Card (Basic/Sectioned/Background/Detail), Tag,
UserAvatar, ChatMessage (`.chat`), Section, BlankSlate, ListItem, Table,
Breadcrumbs, Wizard, Timeline, Pagination, MasterDetail (`.split-screen-wrapper`),
Columns, Badge, IconBadge, Counter, Popup.

Static markup was corrected against the live OUI site, not invented: shape
classes (`border-radius-rounded` / `-soft`) are required for pill/circle
geometry; `background-*` / `text-neutral-0` / `OSInline` / `font-size-*` etc.
are real OUI utility classes; icons render as FontAwesome **4.7** syntax
(`<i class="icon fa fa-NAME">`).

#### Low-code controls (`stories/_helpers/lowcode.ts`)

CSS-only pattern stories expose each block's low-code input parameters as
interactive Storybook `argTypes`. Param names/types/defaults/descriptions come
from the unpacked OutSystemsUI library OML (the block's `InputParameters`);
value→CSS-class mappings come from the repo SCSS. Shared helpers: `cls()`,
`COLOR_OPTIONS`, `extendedClassArgType`, `usePaddingArgType`. Done for Card, Tag,
Badge, IconBadge, UserAvatar, Alert, Counter, Section, BlankSlate, ChatMessage,
Timeline, Wizard, Pagination, Breadcrumbs, ListItem, MasterDetail, Columns.

### Platform Widgets — `Widgets/` group (a different stack)

Some controls are **React** components from `@outsystems/runtime-widgets-js` (the
platform runtime, published only to the internal Azure Artifacts feed). This repo
is public and **no longer depends on those packages at all** — the `Widgets/`
group renders each widget's real DOM as static markup instead of mounting the
components. See `docs-internal/adr/ADR-0009` for why (the dependency was what
blocked every Chromatic baseline build on this branch) and for the capture
method and refresh trigger.

Group contents (20 stories, 24 including added states): Button, ButtonGroup,
Checkbox, RadioGroup, Switch, Input, TextArea, Dropdown, Upload, Link, Popup,
Popover, Label, Icon, Image, Text, plus the CSS-only FeedbackMessage, List and
Table blocks.

The markup is a transcription of DOM captured from
`@outsystems/runtime-widgets-js@6.25.4` mounted under React 17 with the harness
that used to live in `stories/_helpers/widget.ts` (a `runtimeMock()` Proxy for the
runtime interfaces, a bridged `Model.Variable`, and a `_dependencies` nonce to
defeat each widget's `React.memo`). That harness is deleted; the knowledge it
encoded now lives in the captured markup and in each story's doc comment, which
records the source version and the DOM contract it reproduces.

**Durable facts about the platform widgets**, still worth knowing when
re-capturing or reading the markup:

- The `style` prop is a **className**, emitted verbatim (so an empty `style`
  yields `class=""`, which the stories reproduce).
- `const enum`s (`InputType`, `IconSize`, `Accept`, Image `Type`, `DropdownMode`)
  are not runtime-exported → a re-capture must pass numeric literals.
- Dropdown has two modes with **different DOM**: custom (div-based) and native
  (`<select>`). Popup renders through a **React portal** onto `document.body`.
  Link routes through react-router (no DOM footprint beyond `href`).
- `mandatory` adds `required` + `aria-required="true"`; on Label it appends
  ` mandatory` to the className (hence the leading space).
- The visible form of `[data-checkbox]`, `[data-switch]` and `[data-upload]` is
  pseudo-element `content` from the platform base layer, vendored at
  `.storybook/platform/platform-core.css` and loaded **before** the OUI
  stylesheet — the same order a real app uses.

**States are now stories, not clicks.** Chromatic only ever photographed the
initial render, so interactive states were never actually snapshotted even while
the stories mounted live widgets. Expanded Dropdown, expanded Popover, and the
unchecked/disabled Checkbox and Switch are therefore separate stories.

---

## Pattern contract gotchas (discovered, encoded in the helpers/stories)

These are the non-obvious rules every story must honour — they mirror real OUI /
Service Studio structure and were each verified against the live site:

0. **Parent/child wrappers are real elements.** Patterns whose parent CSS targets
   `wrapper > .child` need the real `[data-block]` wrapper around each child.
   Accordion dividers come from
   `.osui-accordion :not(:first-child):not(.list) > .osui-accordion-item { border-top }`,
   so each item must be
   `.osui-accordion > div[data-block] > .osui-accordion-item`. Collapsing
   wrapper + item into one element kills the dividers.
1. **`osuiRoot(id)` emits only `id` + `name` + `data-block`** — each story must
   also add the pattern's **base block class** itself (e.g. `osui-accordion-item`).
   JS adds only modifier classes (`--is-open`), never the base block class.
2. **Every config needs `ExtendedClass: ''`** — `cfg()` injects it.
3. **Scripts must be `defer`'d** — the bundle attaches a `document.body` click
   listener at load.
4. **Provider/positioning prerequisites:**
   - Tooltip / any Balloon-based pattern positions via `window.FloatingUIDOM`
     (needs `window.FloatingUICore`) — both UMD globals load core→dom before the
     bundle. The balloon-wrapper also needs the `osui-balloon` class **in the
     markup** (`Balloon.build()` doesn't add it — it's part of the Service Studio
     block template, and carries the `position:fixed`/opacity CSS FloatingUI drives).
   - MonthPicker needs the flatpickr `monthSelectPlugin` global; its config
     dates are shaped `{ Month: string, Year: number }` (Year < 1900 = unset).
   - RangeSlider needs `window.wNumb`.
   - AnimatedLabel needs `data-input` on its input
     (`GlobalEnum.DataBlocksTag.Input = '[data-input]'`).
   - Rating generates its own items — needs `.icon-states` (≥1 child, cloned per
     star) + an empty `<fieldset>`.
   - DatePicker needs `<label for>` + an `osui-datepicker-a11y` sibling.

---

## Quality gate & sign-off workflow

- Every story (JS + static + widgets) is smoke-tested **headless** (loads,
  initialises / renders, no console errors; computed-style spot-checks confirm
  CSS applies). Playwright was used to verify, then uninstalled — it could be
  re-added as a `test-storybook` smoke check.
- **UI review tracking via tags:** every story starts tagged `ui-pending`
  (set globally in `preview.ts`). As a component's UI is signed off, its meta
  opts out with `!ui-pending` and adds `ui-reviewed`. Filter by either in the
  sidebar's tag menu.

---

## Commands

```bash
# Prerequisite — produce dist/ (the bundle Storybook serves at /osui).
# NOTE: Introduction.mdx / main.ts refer to `npm run build:osui`, but that
# script is not (yet) defined in package.json. The actual build commands are:
npm run build               # gulp createProduction + lint (all platforms)
npm run dev -- --target ODC # dev build, ODC only (sufficient — Storybook loads ODC.*)

npm run storybook       # storybook dev -p 6006
npm run build-storybook # static build
npm run chromatic       # visual regression (build-script-name=build-storybook)
```
