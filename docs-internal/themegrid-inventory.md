# ThemeGrid CSS inventory

Every rule in OutSystems UI that depended on the OutSystems ThemeGrid, in one place, with
its compiled CSS and what replaced it.

> **Status (2026-10-02): neither platform ships ThemeGrid CSS any more.** The page gutters
> and content cap are provided on both O11 and ODC by `src/scss/02-layout/_page-gutters.scss`
> behind the `--osui-layout-*` API. The 23 collected ThemeGrid rules no longer exist in the
> tree; their compiled CSS is in §1–§5 below and the SCSS is archived in the ROU-13043 brief
> (Claude artifact, section 08).
> The per-platform split described below (O11 partial vs ODC partial) was the intermediate
> state between 2026-09-29 and 2026-10-02; the per-rule inventory and the §6 design are still
> current, read "ODC" as "both platforms".
>
> **O11 consequence to be aware of.** An O11 app that still uses a grid type keeps the
> platform's own grid stylesheet (`.ThemeGrid_Container { max-width }`, `.ThemeGrid_Width*`),
> but the cap rule in §6 is `(0,2,0)` and out-ranks the platform's `(0,1,0)` max-width, so
> the content width is OSUI's (1280px top menu, full width side menu) regardless of the app's
> Grid settings (decision 2026-10-02; a `:not(.ThemeGrid_Container)` guard was tried and
> removed). Such an app also loses §2 to §4: grid columns no longer stack to full width on
> phone, and the validation-message nudges next to grid-width fields are gone.

**Why this file exists.** ODC dropped the fluid/fixed grid type in favour of flexbox and
grid declared on the model, and O11 takes the same layout API, so the ThemeGrid rules no
longer live in any bundle you can grep — this is the manual-inspection copy.

**Scope.** "ThemeGrid-dependent" means the selector keys off `ThemeGrid_Container`,
`ThemeGrid_Width*`, `ThemeGrid_MarginGutter`, or the `OSFillParent` / `no-responsive` width
helpers that ship with the grid.

| | O11 | ODC |
|---|---|---|
| ThemeGrid rules shipped | 0 (was 23) | 0 |
| Source | removed from the tree 2026-10-02; compiled CSS in §1–§5, SCSS archived in the ROU-13043 brief | same |
| Replacement | [`src/scss/02-layout/_page-gutters.scss`](../src/scss/02-layout/_page-gutters.scss) | same |
| Content cap | `$layout-max-width` (`00-abstract/_setup-global-vars.scss`) | same |
| Registered in | `gulp/ProjectSpecs/ScssStructure/PageLayout.js`, "Page Gutters", no platform key | same |

24 rules existed before the split: the 23 below plus one ODC-only rule that was deleted
outright (§5). Counts are *compiled* rules — the SCSS nests some of them, so the partial has
fewer top-level blocks than 23.

---

## 1. Page gutters — 13 rules

The substantive group. `.ThemeGrid_Container` is what gave the header, main content and
footer their page padding at each breakpoint. **ODC: replaced** — see §6.

```css
.ThemeGrid_Container{
  margin-block:var(--token-scale-0, 0px);
  margin-inline:auto;
  width:100%;
}
.header .ThemeGrid_Container{
  padding-block:var(--token-scale-0, 0px);
  padding-inline:var(--token-scale-1000, 40px);
}
.layout .main-content.ThemeGrid_Container{
  padding:var(--token-scale-1000, 40px);
}
.layout .footer.ThemeGrid_Container{
  padding-block:var(--token-scale-400, 16px);
  padding-inline:var(--token-scale-1000, 40px);
}
.tablet .header .ThemeGrid_Container{
  padding-block:var(--token-scale-0, 0px);
  padding-inline:var(--token-scale-600, 24px);
}
.tablet .main-content.ThemeGrid_Container{
  padding:var(--token-scale-600, 24px);
}
.tablet .footer.ThemeGrid_Container{
  padding-block:var(--token-scale-400, 16px);
  padding-inline:var(--token-scale-600, 24px);
}
.phone .header .ThemeGrid_Container{
  padding-right:calc(var(--os-safe-area-right) + var(--token-scale-400, 16px));
  padding-left:calc(var(--os-safe-area-left) + var(--token-scale-400, 16px));
}
.phone .main-content.ThemeGrid_Container{
  padding-block-end:var(--token-scale-400, 16px);
  padding-block-start:var(--token-scale-400, 16px);
  padding-right:calc(var(--os-safe-area-right) + var(--token-scale-400, 16px));
  padding-left:calc(var(--os-safe-area-left) + var(--token-scale-400, 16px));
}
.phone .footer.ThemeGrid_Container{
  padding-right:calc(var(--os-safe-area-right) + var(--token-scale-400, 16px));
  padding-left:calc(var(--os-safe-area-left) + var(--token-scale-400, 16px));
}
.layout-native .main-content.ThemeGrid_Container{
  padding:var(--token-scale-0, 0px);
}
.full-width-section .ThemeGrid_Container{
  padding-block:var(--token-scale-0, 0px);
  padding-inline:var(--token-scale-1000, 40px);
}
.aside-expandable .header .ThemeGrid_Container{
  max-width:100%;
}
```

Where they came from, and notes:

| Rule | Was in | Note |
|---|---|---|
| `.ThemeGrid_Container` | `02-layout/_themegrid-container.scss` | `margin-inline: auto` centres the container against the `max-width` the **platform's** fixed-grid stylesheet sets. Nothing to centre without a grid type. |
| header / main / footer, ×3 breakpoints | `02-layout/_themegrid-container.scss` | The `.phone` rules keep `padding-right`/`-left` **physical** on purpose: `--os-safe-area-*` resolves to a physical `env()`, so a logical property would mirror the side but not the value (scss rules §15). |
| `.layout-native .main-content…` | `02-layout/_themegrid-container.scss` | Emitted last in the source, with a comment that the selector order had to change for legacy loading. It ties on specificity with the `.layout` / `.tablet` / `.phone` rules and wins only by document order. |
| `.full-width-section …` | `02-layout/_section.scss` | Same specificity as `.header .ThemeGrid_Container` and deliberately after it. The pattern is full-bleed and re-applies the gutter on its inner wrapper. |
| `.aside-expandable .header …` | `02-layout/_header.scss` | Un-caps the fixed grid's `max-width` when the side menu is expandable. No max-width exists without a grid type. |

`.layout-native .header-top` already carries its own `padding-inline: 24px` from
`02-layout/_header-layout-native.scss` — independent of the ThemeGrid, and still shipping on
both platforms.

## 2. Width reflow — 2 rules

**ODC: dropped** (the `content-top` rule kept in simplified form, §6).

```css
.phone .layout:not(.layout-native) [class*=ThemeGrid_Width]:not(.no-responsive){
  margin-block:var(--token-scale-0, 0px) var(--token-scale-400, 16px);
  margin-inline:var(--token-scale-0, 0px);
  width:100%;
}
.content-top-title > div:not([class*=ThemeGrid_Width]),
.content-top-actions > div:not([class*=ThemeGrid_Width]){
  width:100%;
}
```

| Rule | Was in | What it did |
|---|---|---|
| phone reflow | `02-layout/_layout.scss` | Collapsed every grid column to full width on phone unless the developer opted out with `no-responsive`. With flex/grid on the model, wrapping is the model's business. |
| `content-top` children | `02-layout/_content.scss` | Stretched direct children that were *not* grid columns, so a grid column kept the width the ThemeGrid gave it. |

## 3. Validation-message offsets — 7 rules

`span.validation-message` is absolutely positioned against its field; these nudge its inset
or offset for fields carrying a grid width. **ODC: dropped, no replacement** — with no grid
widths emitted, none of these selectors matches anything, so removing them is a no-op. The
base `.form span.validation-message { inset-inline-start: 0 }` in `03-widgets/_form.scss`
takes over.

```css
.form.OSFillParent .form-control[class*=ThemeGrid_Width].not-valid ~ span.validation-message{
  inset-inline-start:22px;
}
.form > span.input-text .form-control[class*=ThemeGrid_Width].not-valid + span.validation-message{
  inset-inline-start:0;
}
.form .dropdown-container[class*=ThemeGrid_Width].not-valid span.validation-message{
  bottom:var(--token-scale-100, 4px);
}
.form-control[class*=ThemeGrid_Width].not-valid + span.validation-message{
  inset-inline-start:10px;
}
.phone .layout-native .form.OSFillParent .form-control[class*=ThemeGrid_Width].not-valid + span.validation-message{
  inset-inline-start:var(--token-scale-150, 6px);
}
.phone .form.OSFillParent span.input-text .form-control[class*=ThemeGrid_Width].not-valid + span.validation-message,
.phone .form span.input-text .form-control[class*=ThemeGrid_Width].not-valid.ThemeGrid_MarginGutter + span.validation-message,
.phone .form-control[class*=ThemeGrid_Width].not-valid + span.validation-message{
  inset-inline-start:0;
}
.form .input-with-icon .form-control[class*=ThemeGrid_Width].not-valid ~ span.validation-message{
  inset-inline-start:0;
}
```

Six came from `03-widgets/_form.scss`, the last from
`04-patterns/03-interaction/_input-with-icon.scss`.

Two ordering constraints inside the O11 partial, both load-bearing:

- `.form .dropdown-container[ThemeGrid_Width].not-valid span.validation-message` ties on
  specificity `(0,4,1)` with `_form.scss`'s
  `.form .dropdown-container.dropdown-expanded.not-valid span.validation-message`
  (`bottom: -19px`). The ThemeGrid rule must stay **earlier** in the bundle or it starts
  winning. That is why the partial sits at PageLayout slot 3.12 and not at the end.
- `.form .input-with-icon …` ties at `(0,6,1)` with `.form.OSFillParent …` and must stay
  **after** it.

The hardcoded `22px` / `10px` / `6px` suggest the base rule was never quite right on its
own — worth a visual pass on the Form widget in ODC rather than assuming.

## 4. Service Studio preview — 1 rule

Design-time only, so its cascade position is irrelevant at runtime. **ODC: dropped.**
Was in `03-widgets/_radio-button.scss`.

```css
[data-radio-button]:not(.OSFillParent):not([class*=ThemeGrid_Width]){
  -servicestudio-display:flex;
}
```

## 5. Deleted outright — 1 ODC-only rule

Was in `01-foundations/_icon-library-odc.scss`, which is registered `platform: odc`. It
never reached O11 — O11 renders its own `.dropdown-container:after` arrow from
`_icon-library-o11.scss` — so there was nothing to preserve and it was deleted rather than
moved into the O11 partial.

```css
.form .dropdown-container[class*=ThemeGrid_Width]:has(select):after{
  top:calc(50% - var(--token-scale-600, 24px) / 2);
}
```

## 6. What ODC ships instead

`src/scss/02-layout/_page-gutters.scss`. A 1:1 value carry-over of §1 applied to the
elements that own the page edges, behind a `--osui-layout-*` CSS API.

**Shape: three tiers of custom property on `.layout`, then exactly one declaration rule per
element.** `--osui-layout-gutter` is the single knob; the per-element, per-side
`--osui-layout-{header,content,footer}-padding-*` vars default through it (adding the safe area
on the inline sides); the declaration rules read those. The ThemeGrid original needed four
competing `(0,3,0)` rules per element resolved purely by document order. Here breakpoints,
native and the header-less side layout only ever re-set a variable, so no rule in the file is
overridden by another rule in the file, the Styles panel shows one live rule per element, and
an app can move every page edge at once with one line: `.layout { --osui-layout-gutter: … }`.

```css
.layout{
  --osui-layout-max-width:1280px;
  --osui-layout-gutter:var(--token-scale-1000, 40px);
  --osui-layout-header-padding-right:calc(var(--os-safe-area-right) + var(--osui-layout-gutter));
  --osui-layout-header-padding-left:calc(var(--os-safe-area-left) + var(--osui-layout-gutter));
  --osui-layout-content-padding-block-start:var(--osui-layout-gutter);
  --osui-layout-content-padding-block-end:var(--osui-layout-gutter);
  --osui-layout-content-padding-right:calc(var(--os-safe-area-right) + var(--osui-layout-gutter));
  --osui-layout-content-padding-left:calc(var(--os-safe-area-left) + var(--osui-layout-gutter));
  --osui-layout-footer-padding-block:var(--token-scale-400, 16px);
  --osui-layout-footer-padding-right:calc(var(--os-safe-area-right) + var(--osui-layout-gutter));
  --osui-layout-footer-padding-left:calc(var(--os-safe-area-left) + var(--osui-layout-gutter));
}
.layout .header-top,
.layout .main-content,
.layout .footer{
  margin-block:var(--token-scale-0, 0px);
  margin-inline:auto;
  max-width:var(--osui-layout-max-width);  /* (0,2,0): out-ranks the platform's .ThemeGrid_Container max-width on O11 */
  width:100%;
}
.layout:not(.layout-native) .header-top{
  padding-block:var(--token-scale-0, 0px);
  padding-right:var(--osui-layout-header-padding-right);
  padding-left:var(--osui-layout-header-padding-left);
}
.layout .main-content{
  padding-block-start:var(--osui-layout-content-padding-block-start);
  padding-block-end:var(--osui-layout-content-padding-block-end);
  padding-right:var(--osui-layout-content-padding-right);
  padding-left:var(--osui-layout-content-padding-left);
}
.layout .footer{
  padding-block:var(--osui-layout-footer-padding-block);
  padding-right:var(--osui-layout-footer-padding-right);
  padding-left:var(--osui-layout-footer-padding-left);
}
.full-width-section > div:not(.section-background){
  margin-inline:auto;
  max-width:var(--osui-layout-max-width);
  padding-block:var(--token-scale-0, 0px);
  padding-inline:var(--token-scale-1000, 40px);
}
.content-top-title > div,
.content-top-actions > div{ width:100%; }
.tablet .layout,
.phone  .layout{ --osui-layout-gutter:var(--token-scale-400, 16px); }
.layout.layout-side{ --osui-layout-max-width:none; }
.layout.layout-native{ /* content and footer padding-* -> 0; header keeps its own */ }
```

### Element mapping

| ThemeGrid selector | ODC selector | Notes |
|---|---|---|
| `.main-content.ThemeGrid_Container` | `.main-content` | Same element; the class was compound. |
| `.footer.ThemeGrid_Container` | `.footer` | Same element. |
| `.header .ThemeGrid_Container` | `.header-top` | From runtime inspection. `.header-top` is the container; `.header-content` (my first guess) is not. |
| `.full-width-section .ThemeGrid_Container` | `.full-width-section > div:not(.section-background)` | Matched by position — see below. |
| `.aside-expandable .header .ThemeGrid_Container` | `.layout.layout-side` var override (`--osui-layout-max-width: none`) | The original un-capped only the header, and only when the menu was expandable. Design (2026-10-01): every side menu layout is full width, whatever the MenuBehaviour and with or without a header, so the cap is dropped for header, content and footer. The 1280px cap now applies only to the top menu layout. |
| `.layout-native .main-content.ThemeGrid_Container` | `.layout.layout-native` var override (content and footer padding to 0; the native footer is the bottom bar, design 2026-10-02) | Compound `.layout.layout-native`, **not** bare `.layout-native`: it has to out-rank `.tablet .layout` / `.phone .layout` at `(0,2,0)`. A bare `.layout-native` is `(0,1,0)` and loses, leaving native with a 24/16px gutter. |
| *(none)* — native header | `.layout:not(.layout-native) .header-top` | The header gutter skips native. `_header-layout-native.scss` owns that padding (32px desktop, 24px tablet/phone) and never went through the ThemeGrid; without the `:not()` the later `(0,2,0)` gutter rule would bump desktop native to 40px. |

### Three decisions worth knowing

**`--osui-layout-max-width: 1280px` is new to this repo.** No `1280` literal existed anywhere
in `src/`, `gulp/`, `stories/` or `docs/`, and no `:root`-level `max-width` or `--*width*`
property existed at all. The cap came entirely from the platform's fixed-grid stylesheet, so
OSUI now owns it. Stored as `$layout-max-width` in `00-abstract/_setup-global-vars.scss`
beside `$header-size` and friends, under the existing
`/* App Settings — layout vars with no token equivalent */` comment. **Confirm the value with
the platform team.**

**`.full-width-section` is matched by position, not class.** Two obvious targets are both
wrong. `.full-width-section` itself cannot carry the gutter: `.section-background` is
absolutely positioned at inset 0 with `width/height: 100%`, which resolves against the padding
box, so padding on the parent insets the background on one side and overflows it on the other
— and the full-bleed background is the pattern's whole point. And `.section-content` belongs to
the **Section pattern** (`04-patterns/02-content`), which declares its own
`--osui-section-content-*` API and is zeroed by `.layout-native .section-content
{ padding: 0 }` at `(0,2,0)`. Matching the wrapper by exclusion keeps the gutter for whatever
the block renders and is a no-op if it renders none. Note the original was a flat 40px at every
breakpoint — there was no `.tablet`/`.phone` override for it.

**The safe area is added at every breakpoint, not only on phone.** The ThemeGrid original
added `--os-safe-area-*` to the inline sides only under `.phone`. Folding it into the base
per-element defaults is what lets a breakpoint be a single `--osui-layout-gutter` line. Away
from a notch the var resolves to `0px`, so desktop and real tablets are unchanged; the one
observable difference is a notched phone that the device detection classes as `.tablet` in
landscape, which now also clears its notch - an improvement, but a deviation from 1:1.

**One of the deleted rules has no replacement, on purpose.**
`.ThemeGrid_Container { margin-inline: auto; width: 100% }`'s centring existed only relative
to the platform's cap. The cap is now ours, so the centring is kept on the three capped
elements. The `.aside-expandable` header un-cap was generalised into the full-width variable
override above rather than carried over as-is.

### `.layout-side-no-header` is a variable override, not a second API

ODC's new `Layouts.Layout` block renders `.main-content` with **no** ThemeGrid class (confirmed
in a running app, 2026-09-30), so on that layout the page gutter above is the live padding.
Every side menu layout is **full width** (`.layout.layout-side { --osui-layout-max-width:
none }`, design decision 2026-10-01 - the 1280px cap is for the top menu layout only). The
header-less side layout no longer needs any gutter override of its own: **tablet and phone
share the 16px gutter for every layout** (design, 2026-10-01; the ThemeGrid original had 24px
on tablet). An intermediate "0 top padding on tablet/phone" reading, and a tablet override
scoped to this layout alone, were both superseded.

Two earlier shapes were rejected for making the Styles panel a pile of struck-through rules:
a parallel `--osui-layout-main-padding-*` API in `_layout.scss` declaring padding on the same
element at higher specificity, and a `.layout-side-no-header .main-content { max-width: none }`
un-cap rule on the element. Both said the same thing twice at different specificities; the
variable override says it once. `_layout.scss` keeps only the menu-specific side-no-header
rules (link gap, menu-icon margins); the aside hairlines moved up to `.layout-side`.

## 7. Loose ends

`09-excluders/_excluders.scss` still lists `ThemeGrid_Container` and `ThemeGrid_MarginGutter`
in its `ExcludeFromPickers` comment, on **both** bundles. That comment tells the IDE which
class names to hide from the Style Classes dropdown; the two entries are harmless but stale
on ODC. Splitting them out needs a `platform` key on the Excluders section spec, which is not
worth doing for a comment unless the picker starts surfacing them.

## 8. Regenerating this file

The compiled blocks above come straight out of a production build:

```bash
npx gulp createProduction --target

# §1–§4: no longer in the tree; the compiled blocks above are the record (SCSS archived in the brief)

# §6: the replacement, compiled (same on both platforms)
sed -n '/\/\*! 3.12. Page Gutters \*\//,/\/\*! 3.13/p' dist/ODC.OutSystemsUI.css

# Invariant: BOTH bundles read exactly 1 hit, the ExcludeFromPickers comment (§7).
grep -c 'ThemeGrid' dist/O11.OutSystemsUI.css dist/ODC.OutSystemsUI.css

# Invariant: nothing in src/ references the ThemeGrid in a live rule
grep -rn 'ThemeGrid\|OSFillParent\|OSInline\|no-responsive' src/scss src/scripts --include='*.scss' \
  | grep -v 'O11.OutSystemsUI\|ODC.OutSystemsUI\|09-excluders' \
  | grep -vE ':[[:space:]]*//'
```

The last grep is the one to run in review — the trailing `grep -v` drops comment-only hits,
including the `// was: …` provenance notes in `_page-gutters.scss`. It should return
exactly these 9 lines, all false positives:

| Hit | File | Why it stays |
|---|---|---|
| `.table-no-responsive` ×4 | `03-widgets/_table.scss` | The Table widget's own opt-out class. Unrelated to the grid's `no-responsive`, despite the name. |
| `.table-no-responsive` ×3 | `08-servicestudio-preview/_servicestudiopreview.scss` | Same class, design-time rules. |
| `.OSInline` | `04-patterns/02-content/_floating-content.scss` | Width helper, see below. |
| `button.OSFillParent` | `01-foundations/_resets.scss` | Width helper, see below. |

`OSFillParent` and `OSInline` are the non-grid entries in the widget Width property, so they
plausibly outlive the grid type — but that is worth confirming with whoever owns the ODC
Width property rather than assumed. If they go too, these two rules and the `:not()` in §4
are the follow-up. Every *grid-column* reference (`ThemeGrid_Width*`,
`ThemeGrid_MarginGutter`, `ThemeGrid_Container`) is already gone from the ODC bundle.

## 9. Parity verification — what was actually measured

Build-level checks (must hold on every change to the gutters partial):

- **Both bundles have exactly one `ThemeGrid` hit**, the `ExcludeFromPickers` comment (§7).
  (Until 2026-10-02 O11 shipped the 23 rules and was checked byte-identical to its baseline;
  that invariant is retired with the O11 partial.)
- **O11 with a grid type takes OSUI's cap.** Rendering the O11 bundle with
  `ThemeGrid_Container` on the three elements and a stand-in platform rule
  `.ThemeGrid_Container { max-width: 1200px }` loaded after it must read OSUI's value
  (1280px top menu, `none` side menu) on all three, not 1200px.

Computed-style parity was measured by rendering the layout DOM twice in
`chrome-headless-shell` — once against the baseline `ODC.OutSystemsUI.css` with the
ThemeGrid classes in the markup plus a stand-in `.ThemeGrid_Container { max-width: 1280px }`
for the platform stylesheet, once against the new bundle with no ThemeGrid classes — and
diffing `padding-*`, `margin-*`, `max-width` and `width` on `.header-top`, `.main-content`,
`.footer` and the full-width-section wrapper. A deterministic notch was forced
(`--os-safe-area-right: 44px; --os-safe-area-left: 34px`) so the safe-area chain is
exercised. 750 comparisons across 75 cells — 5 layout variants × 3 breakpoints × 5 probes.

| Probe | Result |
|---|---|
| `.header-top` | **Identical** across all 15 layout × breakpoint cells |
| `.footer` | **Identical** across all 15 cells |
| `.main-content` | Identical in 12 of 15 — all but the three `layout-side-no-header` cells |
| full-width-section wrapper | Identical in 12 of 15 — same three cells |

Every remaining difference traces to the side-no-header layout, and the harness baseline was
wrong for it: it put `ThemeGrid_Container` on `.main-content` for *every* layout, but the real
`Layouts.Layout` block renders that element with no ThemeGrid class at all (runtime inspection,
2026-09-30). The measured deltas are the harness comparing against a state the layout never
had, not a regression. The layout's tablet/phone top padding changed deliberately on this
branch (§6), so it is out of scope for a parity check.

A second headless pass on the final bundle (2026-09-30, 44px/34px forced safe areas) read
`.header-top`, `.main-content` and `.footer` padding plus `max-width` for `layout-side`,
`layout-side-no-header` and `layout-native` at all three breakpoints. Every cell matched the
values in §6; the cells that differ from the ThemeGrid original are deliberate: every tablet
gutter is 16px instead of 24px, side menu layouts are full width instead of capped at 1280px,
and the desktop native header keeps its own 32px instead of taking the 40px gutter.

Two further confirmations, neither derivable from this repo:

- **1280px** is the intended ODC content width (platform team).
- The FullWidthSection block still renders exactly one non-background wrapper div, so
  `.full-width-section > div:not(.section-background)` finds it.
