# Spec: CSS Cascade Layers (`@layer`) for OutSystems UI

**Status:** Options A + B + C implemented (ODC bundle) — see §5. **BLOCKED on a platform-wide cascade contract (D7) — see §6a.** Also gated on §8 (browser support D1, versioning D2).
**Owner:** _TBD_
**Related:** `docs/css-architecture.md`, `specs/plan-part-four.md` (theme layer), `.claude/rules/scss.md`
**Reference:** [MDN — `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)

---

## 1. Problem statement

Feedback claims that adopting CSS cascade layers would let consuming apps "quickly override the default styles of OutSystems UI." This spec evaluates whether that is true and, if so, defines the CSS architecture to support it.

### What consumers can already do well (no gap)

OutSystems UI ships a mature **custom-property** theming surface (three cooperating tiers — see `docs/css-architecture.md`):

| Tier | Surface | Override path |
|---|---|---|
| Design tokens | `--token-*` | Set at `:root` (DTE / runtime theme) |
| Framework theme roles | `--color-*`, `--border-radius-*`, `--size-*` | Set at `:root` or a theme class |
| Component CSS API | `--osui-{component}-{prop}` (385 props / 75 components) | Set on the component root or an ancestor, or inline |

For any value that flows through a custom property, overriding is already frictionless and **specificity-proof** — a `:root` or ancestor declaration re-skins the component with no selector war. **Cascade layers add nothing here.**

### The actual gap: overriding *rules*, not *values*

When a consumer needs to change something **not exposed as a custom property** — a layout rule, a pseudo-element, a state selector, a property no `--osui-*` knob reaches (the "hard leaks" catalogued in `specs/plan-part-four.md`, e.g. `.header` border, `.app-menu-links a` color, `::placeholder` color, `.btn:hover` filter) — there is **no documented, specificity-safe override path**. Today they must:

1. Write an app rule with **equal-or-higher specificity**, matching OSUI's compound/nested selectors (up to ~`0,3,0`); or
2. Reach for `!important`; or
3. Change DOM structure / class names; or
4. File a request to expose a new `--osui-*` knob.

This is the specificity arms race cascade layers are designed to end.

### How `@layer` solves it

A declaration in a cascade layer **always loses to an unlayered declaration on the same element, regardless of specificity** (layer origin is sorted *above* specificity in the cascade). So if the **entire OutSystems UI bundle is emitted inside a named layer**, then any ordinary app CSS — however low its specificity — wins automatically:

```css
/* OSUI bundle, shipped inside a layer */
@layer outsystems-ui {
  .osui-dropdown-serverside.--not-valid .osui-dropdown-serverside__selected-values-wrapper {
    border-color: red;               /* specificity 0,3,0, but LAYERED */
  }
}

/* App CSS, unlayered — wins despite lower specificity, no !important */
.my-wrapper { border-color: blue; }
```

**Verdict: the feedback is correct, but narrowly.** Cascade layers deliver a genuine, large improvement for the *rule-override* case. They are complementary to — not a replacement for — the existing custom-property API, and they are **not** a silver bullet (see §6 limitations: they do not beat inline styles or `!important`).

---

## 2. Current-state facts (grounding)

Established by survey of the build system and SCSS trees:

- **One monolithic bundle per platform.** `dist/ODC.OutSystemsUI.css` (~800 KB) contains everything — resets, foundations, layout, widgets, **vendor CSS (Splide, Flatpickr, NoUiSlider, VirtualSelect) inline**, patterns, utilities, keyframes, Service Studio preview. There are no separate provider CSS files.
- **SCSS is ODC-only today.** `gulp/ProjectSpecs/DefaultSpecs.js` → `scssPlatformTarget` lists only `odc`. O11 SCSS generation is disabled. **Any layer change currently affects the ODC bundle only** — this must be resolved before it can benefit O11 consumers.
- **Entry files are auto-generated.** `gulp/Tasks/CreateScssFile.js` + `gulp/Tasks/CreateScss/GetPartialsList.js` build `src/scss/ODC.OutSystemsUI.scss` from the section specs in `gulp/ProjectSpecs/ScssStructure/*.js` on every `dev`/`build`. **Hand-edits are overwritten** — the layer wrapper must be injected by the generator.
- **Toolchain supports `@layer`.** Dart Sass ≥ 1.77 (compiles `@layer` fine). PostCSS runs `discard-comments` + `discard-duplicates` + `autoprefixer` (`last 10 versions`); **no cssnano / clean-css**. Autoprefixer ignores `@layer`; `discard-duplicates` must be validated (see §7 spike).
- **`!important` inventory.** ~106 occurrences in `src/scss/`, of which ~46 are Service-Studio-preview internals (`-servicestudio-*`) and ~60 are runtime. Several exist specifically to beat **platform-injected inline styles** (e.g. `_dropdown.scss` overriding inline `font-weight: bold`). Zero `!important` in `src/scripts/**/scss/`. No ID selectors anywhere.
- **Section order in the generated bundle** (natural sublayer boundaries): setup vars → mixins → `root`/tokens → resets → `theme-dark` → html-elements → layout → widgets → **providers (vendor)** → patterns → useful/utilities → screen-transitions → keyframes → servicestudio-preview → excluders.

---

## 3. Proposed architecture

### 3.1 Layer strategy — three options

**Option A — Single wrapper layer (recommended for v1).**

Emit the whole bundle inside one layer:

```css
@layer outsystems-ui {
  /* entire current bundle, unchanged */
}
```

- **Internal cascade is byte-for-byte unchanged** — within a single layer, specificity + source order behave exactly as today, so OSUI's own appearance cannot regress.
- Every unlayered app rule now wins over OSUI. Maximum override benefit, minimum internal risk.
- Vendor CSS is inside the layer too, so apps override Splide/Flatpickr/etc. the same way.

**Option B — Named sublayers.**

Declare the precedence order once, up front, then route each generated section into its sublayer. Lowest priority is leftmost, highest rightmost. **As implemented** (sublayers nest inside the outer `outsystems-ui` layer, so `@layer reset {…}` compiles to `outsystems-ui.reset`):

```css
@layer outsystems-ui {
  @layer vendor, root, reset, base, patterns, utilities;
  /* vendor    → provider baselines (Splide, Flatpickr, NoUiSlider, VirtualSelect) — moved to bottom
     root      → :root token/theme-role declarations + icon library
     reset     → resets, theme-dark, html-elements
     base      → layout, widgets
     patterns  → the 75 patterns, screen-transitions, keyframes
     utilities → 05-useful atomic classes, Service Studio preview, excluders — top */
}
```

The mental shift vs Option A: **across sublayers, order wins and specificity is ignored**; within a single sublayer, specificity still applies as normal. The order preserves today's relative section order with two deliberate changes — `vendor` drops to the bottom, `utilities` rises to the top.

_Advantages (all about cascade correctness, not bytes):_

1. **Utilities always win — without `!important` or specificity tricks.** The biggest win. The `05-useful` classes (`.text-center`, color/spacing helpers, `.is-hidden`, a11y) are meant to be the atomic "last word", but today a single-class utility *loses* to any more-specific pattern selector — so it wins only by being imported last, and where that isn't enough, by `!important`. A top `utilities` sublayer makes a one-class utility beat even a deeply nested pattern rule, guaranteed (the Tailwind / Open Props model).
2. **Vendor always loses to OSUI's own overrides.** OSUI's provider override files (`_virtualselect.scss`, Flatpickr overrides, …) target the same `.vscomp-*` / `.flatpickr-*` classes as the vendor baselines, which ship high-specificity selectors. Today OSUI beats them by source order + occasional specificity fights. A bottom `vendor` sublayer makes OSUI's overrides win **structurally**, regardless of how specific the vendor got. (Prior art — Design Systems Collective, *Mastering CSS Cascade Layers* — recommends the same: third-party styles in the lowest layer "so they won't interfere with your custom styles.")
3. **A chance to shed intra-framework `!important`.** Some of OSUI's ~60 runtime `!important` exist purely to win *cross-section* conflicts (a state modifier beating a more-specific child; a utility beating a pattern). Once sublayer order enforces that precedence, those can be dropped — which also removes them as consumer-override blockers (§6). **Partial only:** the `!important` rules that beat platform **inline** styles (e.g. `_dropdown.scss` `font-weight`) must stay — layers don't beat inline styles.
4. **Surgical consumer overrides + self-documenting cascade.** Apps can target one slice (override only `outsystems-ui.vendor`, or slot a theme relative to `outsystems-ui.root`) instead of the blunt "all my CSS beats all of OSUI". The declaration line above also becomes an explicit, readable statement of the framework's precedence — cleaner for maintainers than relying on implicit import order.

_Note on `root`:_ its placement is largely cosmetic. Custom-property *declarations* aren't really contested by layer order (they're just values resolved later), so where `root` sits matters far less than `vendor` / `utilities`. Kept low (matching today's import order) for readability.

_SCSS-scope constraint (the reason for the `root` sublayer split, discovered in implementation):_ a top-level SCSS `$var`/`@mixin`/`@function` defined *inside* one `@layer {}` block is **not** visible inside a sibling `@layer {}` block. So every cross-section shared definition must be imported at the top level of the outer `outsystems-ui` layer, **outside** the sublayers (where it stays global to all nested blocks). An audit confirmed the only such files are the two definition-only `00-abstract/*` partials (`setup-global-vars`, `mixins`) — they emit no CSS, so hoisting them leaks nothing. Every other cross-section dependency flows from those two.

_Build interaction (spike item, confirmed):_ splitting rules across `@layer` boundaries stops `postcss-discard-duplicates` from merging a handful of identical declarations that were adjacent under Option A (rules in different layers are semantically distinct, so retaining them is correct). Net effect measured: **+~31 declaration lines, +~1.3 KB gzipped — no rule dropped** (verified: every Option A content line is present in Option B).

- **Cost/risk:** splitting into sublayers *deliberately changes* OSUI's internal cascade — cross-section conflicts that today resolve by specificity now resolve by sublayer order. That is the point, but places where a more-specific *earlier* rule currently beats a less-specific *later* one can flip. **This is why the visual-regression pass (Phase 3) is mandatory before shipping** — compile-level checks prove the rule *content* is unchanged, not the rendered *result*.

**Option C — Wrapper layer + published ordering contract.** Option A, plus we document the layer name and recommend that apps which use their *own* layers declare order explicitly:

```css
/* App establishes precedence up front; app layers still beat OSUI */
@layer outsystems-ui, app;
```

This covers the edge case where an app author puts *their* overrides in a layer too (two layered declarations sort by layer order, not specificity). **Recommended as the documentation half of the v1 rollout.**

**Recommendation: ship Option A + Option C docs in v1; evaluate Option B for v2.**

### 3.2 Where the layer is injected

The wrapper must come from the **generator**, not a hand-edit. Two viable mechanisms — pick in the spike (§7):

1. **Wrap the import block** in `CreateScssFile.js` so the generated entry file is:
   ```scss
   @layer outsystems-ui {
     @import '00-abstract/setup-global-vars';
     @import '01-foundations/root';
     /* …all partials… */
   }
   ```
   Dart Sass inlines `@import` at its location, so all content lands inside the layer. **Must confirm Sass accepts `@import` nested in `@layer {}`** (spike item 1).
2. **PostCSS wrap step** — a small plugin/step after Sass, before autoprefixer, that wraps all top-level rules in `@layer outsystems-ui { … }`. More robust against Sass `@import` quirks; keeps the generator untouched.

Either way, **`@keyframes` and `@font-face` are unaffected by layers** (collected globally), and **`:root` custom-property declarations inside a layer remain overridable by unlayered `:root`** — which is exactly the theming behaviour we want, so tokens/theme roles keep working.

### 3.3 Interaction with the existing theme layer

No conflict. The custom-property tiers (`--token-*`, `--color-*`, `--osui-*`) are **value** plumbing; layers govern **rule** precedence. An app overriding `--osui-card-background` at `:root` still wins (unlayered custom-property declaration beats the layered default). `.theme-dark` continues to work: it lives inside the bundle, so it's in the layer too, and its overrides apply by normal within-layer cascade. Its remaining "known CSS-API leaks" become app-overridable as a side benefit.

---

## 4. Value assessment — does it deliver "quick overrides"?

| Scenario | Today | With `@layer` (Option A) |
|---|---|---|
| Override a value exposed as `--osui-*` / `--color-*` / `--token-*` | ✅ Already trivial | ✅ Unchanged |
| Override a **rule** with no custom-property knob | ❌ Specificity match or `!important` | ✅ Any unlayered app rule wins |
| Override across OSUI internal sections | Source-order dependent | ✅ (A) unchanged / (B) explicit |
| Beat a platform **inline** style | Needs `!important` | ❌ Still needs `!important` (see §6) |
| Override an OSUI `!important` | Needs `!important` + specificity | ❌ Still needs app `!important` (see §6) |

**Conclusion:** real and worthwhile for the rule-override gap, which is the exact pain the feedback describes. It does not replace the custom-property API and does not remove every `!important` need.

---

## 5. Rollout / phased plan

| Phase | Goal | Status / Deliverables |
|---|---|---|
| **0 — Spike** | De-risk the toolchain | ✅ **Done.** Confirmed Dart Sass accepts `@import` nested in `@layer {}` (inlines all partials inside the layer); confirmed `discard-comments` + `discard-duplicates` + autoprefixer leave `@layer` intact; compiled a wrapped bundle and diffed (whitespace-normalised) against an unwrapped baseline — **delta is exactly the two `@layer outsystems-ui{` / `}` lines**, content otherwise byte-identical. Verified no CSS rule precedes the layer (only `@charset` + banner comments). |
| **1 — Decide gates** | Answer the blocking questions in §8 | ⏳ **Open (blocking release).** Signed-off browser-support matrix (D1); version-bump decision (D2); O11 scope (D4). Implementation is landed but ships only once D1/D2 are signed off. |
| **2 — Implement (Option A)** | Wrap the ODC bundle | ✅ **Done.** `wrapInCascadeLayer` in `gulp/Tasks/CreateScssFile.js` wraps the generated `@import` block in `@layer outsystems-ui { … }`; regenerated `src/scss/ODC.OutSystemsUI.scss`. |
| **3 — Validate** | No self-regression | ⏳ Compile-level proof done in Phase 0 (identical content → single layer cannot regress internal cascade). **Remaining:** a browser/Storybook visual-regression sweep + a functional check that an unlayered low-specificity app rule now overrides a deep OSUI selector without `!important`. |
| **4 — Docs (Option C)** | Enable consumers | ✅ **Done.** `docs/css-architecture.md` §8 "Overriding the library from an app" documents the `outsystems-ui` layer name, the "unlayered app CSS always wins" rule, the `@layer outsystems-ui, app;` ordering tip, and the inline-style / `!important` caveats. |
| **5 — Sublayers (Option B)** | Ordered sublayers | ✅ **Implemented.** `GetPartialsList.js` declares `@layer vendor, root, reset, base, patterns, utilities;` and routes each section into its sublayer (nested inside the outer `outsystems-ui`); `00-abstract/*` defs hoisted to top level. Compiles clean; AST-verified 0 rules leak outside a sublayer; rule content identical to Option A (+~31 dedup-retained lines). **Remaining:** the mandatory visual-regression pass (Phase 3) — sublayers change internal precedence by design, so rendered output must be confirmed. |

---

## 6. Limitations (be honest with consumers)

1. **Inline styles beat layers.** The platform (Service Studio) injects inline styles on some widgets; a layered *or* unlayered rule cannot override an inline style — only `!important` can. The existing inline-beating `!important` rules (e.g. `_dropdown.scss` `font-weight`) **must stay**.
2. **`!important` inverts layer order.** An `!important` declaration inside `@layer outsystems-ui` still beats an app's *normal* unlayered declaration (importance outranks layer origin). So OSUI's ~60 runtime `!important` rules remain override-blockers unless the app also uses `!important`. A follow-up audit to reduce non-inline `!important` would widen the benefit but is out of scope for v1.
3. **Custom properties are unaffected by layer inversion** in the useful direction — unlayered `:root` overrides still win, so theming is unaffected.
4. **No IE support.** `@layer` has no legacy fallback; a browser without support ignores the at-rule and drops the enclosed styles entirely (see §8 gate).

---

## 6a. The blocker: unlayered Platform CSS beats layered OUI (D7)

**The most serious interaction, and a hard blocker.** Cascade layers have one absolute rule: **unlayered CSS beats every layer, at any specificity.** The intended win — an app's unlayered CSS now overrides OUI — has an unintended twin: the **Platform's own unlayered CSS also jumps above OUI.**

In a real OutSystems app the load order is `platform base CSS (Basic.css / platform-core.css) → OUI theme → app/screen CSS`. This repo confirms the dependency is deliberate: `specs/plan-part-three.md` — *"Platform core CSS must load BEFORE the OUI theme … platform's base CSS already established their structure"* — i.e. **OUI is meant to override the platform base.** Today's precedence is `platform-base < OUI < app` (load order + specificity).

Wrapping OUI in `@layer outsystems-ui` while the platform stays unlayered flips it to:

```
OUI  <  platform-base      ← REGRESSION: Platform Basic.css utilities now override OUI
OUI  <  app                ← intended win
```

**There is no fix inside this repo.** You cannot demote unlayered CSS with layer ordering — declaring `@layer platform, outsystems-ui;` does nothing unless Basic.css is *actually inside* the `platform` layer. Layers only work when the whole ecosystem opts in.

### The required fix — a platform-wide cascade contract

The precedence must be expressed as a coordinated layer order the **Platform participates in**:

```css
@layer platform, outsystems-ui;   /* declared once, as early in the load order as possible */
/* platform Basic.css / platform-core.css → @layer platform      (lowest)   */
/* OutSystems UI bundle                    → @layer outsystems-ui (middle)   */
/* app / screen CSS                         → unlayered            (top, wins) */
```

This restores `platform < OUI < app` **and** keeps the easy-override benefit — but it requires the Platform team to wrap its base CSS in `@layer platform`.

**Nuance — the platform layer is not monolithic.** Utility classes (platform's *and* OUI's) are meant to be the "last word" — the reason OUI's own `05-useful` sits in the top `utilities` sublayer. If platform *utilities* land in the lowest `platform` layer they'd now lose to OUI component rules (a regression the other way). A correct contract likely mirrors OUI's base/utilities split, e.g.:

```css
@layer platform-base, outsystems-ui, platform-utilities;   /* app CSS unlayered on top */
```

so the Platform must categorise its CSS, not just wrap it.

### Implication

This is the **largest gate — a cross-team architectural dependency**, bigger than D1/D2. **OUI cannot ship the layer wrap alone without regressing the platform→OUI precedence.** Either (1) hold the rollout until a platform-wide layer contract is agreed and shipped in lockstep, or (2) run it as a coordinated multi-repo effort from the outset. OUI may emit the `@layer platform, outsystems-ui;` order declaration ahead of time (harmless), but that does **not** fix anything until the Platform actually layers its CSS.

---

## 7. Spike checklist (Phase 0) — done

- [x] Dart Sass accepts `@import` nested inside `@layer name { … }` and inlines all partials within the layer (verified). Nested sublayers also compile, and outer-block SCSS defs are visible in nested sublayer blocks.
- [x] `postcss-discard-duplicates` does not drop the `@layer` rule; it no longer merges a few cross-layer duplicates (expected — retained, +~31 lines).
- [x] `autoprefixer` output unchanged apart from the wrapper (it ignores `@layer`).
- [x] Diffed wrapped vs unwrapped (Option A): only structural delta is the `@layer` envelope. Option B: rule content identical to A, only sublayer grouping added.
- [x] **No stray unlayered rules** — AST-verified: every rule sits inside a sublayer; only `@charset` + banner comments precede the layer.
- [ ] **Remaining (Phase 3):** Storybook smoke-test that all patterns render identically and that an unlayered low-specificity rule overrides a deep OSUI selector without `!important`.

---

## 8. Open decisions (blocking, need product/eng sign-off)

| # | Decision | Options | Notes |
|---|---|---|---|
| D1 | **Browser-support matrix** | Confirm `@layer` baseline (Chrome/Edge 99, Firefox 97, Safari 15.4 — all Mar 2022) meets OSUI's supported browsers. | No in-repo browserslist; build uses `last 10 versions`. A browser without `@layer` **drops all enclosed CSS** — this is the hard gate. |
| D2 | **Backward-compat / versioning** | (a) Major version, layer on by default; (b) opt-in build/flag; (c) feature-detect. | Wrapping in a layer means apps whose *lower-specificity* rules currently **lose** to OSUI will suddenly **win** → potential visual change in existing apps. Almost always the intended direction, but a behaviour change that must be version-gated + release-noted. |
| D3 | **Layer granularity** | Option A (single) vs Option B (sublayers) vs C (single + docs). | Recommend A+C for v1. |
| D4 | **O11 scope** | ODC-only (current reality) vs re-enable O11 SCSS to match. | SCSS is ODC-only today; O11 consumers get no benefit until O11 SCSS generation is restored. |
| D5 | **Service Studio preview layer** | Keep `08-servicestudio-preview` inside the layer, or leave it unlayered / in a higher-priority layer. | Editor-only CSS; must keep rendering correctly in Service Studio regardless of app CSS. |
| D6 | **`!important` audit** | In scope for v1 or deferred. | Reducing non-inline `!important` widens the override benefit; large surface, recommend deferring. |
| **D7** | **Platform-wide cascade contract** ⛔ **blocking** | (a) Coordinate with the Platform to layer Basic.css/platform-core.css below OUI, shipped in lockstep; (b) hold the OUI rollout until (a) exists. | **See §6a.** Unlayered Platform CSS beats layered OUI, inverting the deliberate `platform-base < OUI` precedence. Cannot be fixed inside this repo — needs the Platform to categorise its CSS into a shared layer order (`@layer platform-base, outsystems-ui, platform-utilities;`). This is the largest gate. |

---

## 9. Recommendation

Cascade layers are implemented as **Option A (outer `outsystems-ui` layer) + Option B (named sublayers) + Option C (consumer docs)**. This closes the override gap the feedback identified — specificity-free rule overrides — and adds the sublayer benefits (utilities always win, vendor always loses, self-documenting precedence), while leaving the mature custom-property API as the first-choice path for value overrides.

**However, the feature cannot ship as a unilateral OUI change.** The D7 interaction (§6a) is decisive: wrapping OUI in a layer while the Platform's Basic.css/platform-core.css stays unlayered *inverts* the deliberate `platform-base < OUI` precedence, so Platform utility classes start overriding OUI. This is unfixable inside this repo.

Sequencing:

1. **D7 first (blocking).** Agree a platform-wide cascade contract and ship OUI + Platform layers in lockstep (`@layer platform-base, outsystems-ui, platform-utilities;`, app CSS unlayered on top). Until then, the implemented wrap should stay **off in production** (behind the D2 gate) — the code is ready and validated, but enabling it alone regresses existing apps.
2. **Then the §8 gates** — browser-support sign-off (D1) and the version bump (D2).
3. **Then the Phase-3 visual-regression pass.** Option A is provably neutral (identical rule content, single layer); **Option B deliberately changes internal precedence**, so rendering across all patterns must be confirmed in a browser. Fix any regression by adjusting `sectionSublayers` in `GetPartialsList.js`, not component CSS.

A follow-up `!important` audit (advantage #3) can widen the benefit later but is out of scope here.

The implementation work stands and is correct; what it's taught us is that this is a **platform-level cascade decision, not a library-level one.** The most valuable next step is socialising the D7 contract with the Platform team.
