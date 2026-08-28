# Part Five: Logical Box-Model Properties

**Status: implemented** on `ROU-13013` (one PR). Ticket: **ROU-13013** — _Implement start/end inline/block CSS rules for
padding, margin and border on the new theme._

Parts One–Three (`plan.md`, `plan-part-two.md`, `plan-part-three.md`) put a design-token
system under OSUI; Part Four (`plan-part-four.md`) formalized the theme layer. Part Five
changes the **axis vocabulary** of the box model: physical sides (`left` / `right` /
`top` / `bottom`) become logical ones (`inline-start` / `inline-end` / `block-start` /
`block-end`), and the `.is-rtl` rules that exist only to restate a physical side are
deleted.

The conversion landed as a single change on this branch; what follows is the record of
what was converted, what deliberately was not, and the two traps that produce wrong RTL
(§6.5, §6.6). The authoring rules are mirrored into `.claude/rules/scss.md` §15.

---

## 1. Scope

**In scope.** Every `padding-*`, `margin-*` and `border-*` declaration in `src/scss/**` —
sides, shorthands, and corner radii.

**Required to finish the job.** `left` / `right` / `inset` → `inset-inline-*`, and
`text-align: left|right` → `start|end`. Not box-model, but **20 of the 51 `.is-rtl` rule
sets are positional**: without these, those blocks cannot be deleted and the ticket's
outcome only half lands.

**Out of scope.**

- The RTL mechanism itself. `.is-rtl` on `<body>` plus the platform's own direction
  handling works today as intended; nothing here changes how direction is established,
  observed (`RTLObserver`), or passed to providers. No TypeScript changes.
- Vendor baselines — `_*_lib.scss` and `splide-core.scss` are never edited (rules §10).
- `-servicestudio-*` declarations and `08-servicestudio-preview/`: Service Studio's
  renderer is not a browser and logical support cannot be assumed. They stay physical.
- `writing-mode` / vertical text. The block-axis rewrite (`*-top` → `*-block-start`) is
  vocabulary consistency only — it changes nothing visually, but the ticket asks for
  "inline/block" and a half-logical box model is worse than a whole one (D3).
- Positional `top` / `bottom` (218 declarations). `inset-inline-start` alongside `top` is
  idiomatic, and insets play no part in mirroring.

---

## 2. Property mapping

| Physical | Logical |
|---|---|
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-top` / `padding-bottom` | `padding-block-start` / `padding-block-end` |
| `padding: a b` | `padding-block: a; padding-inline: b` |
| `padding: a b c` | `padding-block: a c; padding-inline: b` |
| `padding: a b c d` (b = d) | `padding-block: a c; padding-inline: b` |
| `padding: a b c d` (b ≠ d) | `padding-block: a c; padding-inline-start: d; padding-inline-end: b` |
| `border-left` / `border-right` (+ `-width` / `-style` / `-color`) | `border-inline-start` / `border-inline-end` (+ suffix) |
| `border-top-left-radius` | `border-start-start-radius` |
| `border-top-right-radius` | `border-start-end-radius` |
| `border-bottom-right-radius` | `border-end-end-radius` |
| `border-bottom-left-radius` | `border-end-start-radius` |
| `left` / `right` | `inset-inline-start` / `inset-inline-end` |
| `text-align: left` / `right` | `text-align: start` / `end` |

Browser floors are all 2020–21 (`*-inline-*`: Chrome 87 · Safari 14.1 · FF 66; logical
corner radii: Chrome 89 · Safari 15 · FF 66) — below anything OSUI 2.x supports.
`gulp-autoprefixer` neither prefixes nor polyfills them; no build change.

### When *not* to convert

- **`border-radius` shorthand that is symmetric on the inline axis.** `8px 8px 0 0`
  mirrors to itself; converting it costs four longhands for nothing. Only the
  inline-asymmetric ones are listed in the inventory (14 declarations, 4 files).
- **Properties with no logical form:** `transform` (`translateX`, `scaleX`, `rotate`),
  `transform-origin`, `box-shadow` / `text-shadow` offsets, `background-position`,
  `linear-gradient(to right)`, `flex-direction: row-reverse`, `float` (D4),
  and every declaration reading a `--os-safe-area-*` var (D5). These keep their
  `.is-rtl` rules.
- **Vendor-owned geometry.** Where a provider mirrors itself (Splide's `--ltr` / `--rtl`,
  VirtualSelect's `text-direction-rtl`), follow the provider rather than fight it.

---

## 3. Authoring rules

To be folded into `.claude/rules/scss.md` (promote §7, add a §15) and `CSS-ARCHITECTURE.md`:

1. **Logical is the default** for `padding`, `margin`, `border` and `inset` in all new and
   touched SCSS. A physical side requires a comment naming the reason.
2. **Component CSS API names carry the axis, never the side** —
   `--osui-{component}-padding-inline`, `--osui-{component}-padding-block`,
   `--osui-{component}-padding-inline-start`. Rename `--osui-sidebar-padding-x` / `-y`
   (`_sidebar.scss:15-16`); never introduce `-left` / `-right` in a spacing var. (Extends D11.)
3. **A custom property must not hold a multi-value box shorthand.** It cannot be mirrored
   without restating the whole value, which is precisely why `_card-sectioned.scss` needs
   an `.is-rtl` block at all. Split into `…-block` + `…-inline-start` + `…-inline-end`.
   12 declarations, 1 file.
4. **Convert whole rules, never single declarations** — see §6.1.
5. **Re-sort after converting.** `.stylelintrc.json` enforces
   `order/properties-alphabetical-order`, and the logical names sort differently
   (`padding-block` < `padding-inline-end` < `padding-inline-start`).

---

## 4. What landed

What is left to convert, at any time:

```bash
grep -rnE '^[[:space:]]*(padding|margin|border)-(left|right|top|bottom)|^[[:space:]]*(left|right):' \
  src/scss --include='*.scss' \
  | grep -vE '_lib\.scss|splide-core|08-servicestudio|09-excluders|provider/_flatpickr|-servicestudio-'
```

| Cat | What | Converted | Deleted from `.is-rtl` |
|---|---|---:|---:|
| A | `padding-*` / `margin-*` physical side | 127 | 89 |
| B | `border-*` physical side | 27 | 17 |
| C | corner / inline-asymmetric `border-radius` | 8 | 2 |
| D | `padding` / `margin` shorthand | 113 | 6 |
| E | `left` / `right` / `inset` | 216 | 57 |
| F | `text-align` | 9 | 4 |
| G | block axis (`*-top` / `*-bottom`) | 181 | — |
| | **Total** | **681** in 92 files | **175** in 42 files |

Plus, by hand:

- **`_card-sectioned.scss`** — the six 4-value shorthand custom properties became twelve
  `…-padding-block` / `…-padding-inline` pairs, and its `.is-rtl` block went with them.
- **Safe areas — deliberately untouched (D5).** Every declaration reading a
  `--os-safe-area-*` var keeps both its physical property and its physical var, and the
  `.is-rtl` rules that mirror them stay. `env()` has no logical form, so a logical property
  reading it would flip the side without flipping the value.
- **Utility loops** — `$osui-box-sides` became a physical-name → logical-side map, so
  `.margin-left-s`, `.padding-top-m` and `.border-left-s` keep their public class names but
  emit `margin-inline-start`, `padding-block-start`, `border-inline-start`.
  `.margin-x-*` / `-y-*` collapsed to `margin-inline` / `margin-block`.
- **`--osui-sidebar-padding-x` / `-y`** renamed to `-inline` / `-block` (D7).
- **`[align='left'|'right']`** now resolve through `text-align: start|end` in `_text.scss`,
  which preserves the RTL flip the deleted `.is-rtl` rule used to provide.

**205** rules left empty by the deletions were pruned, along with their orphaned
`// IsRTL ---` headers. **37** insets were then reverted to physical because they share an
element with a physical x-axis transform (§6.5), and **2** `.is-rtl` rules were restored
because they mirror platform-owned CSS (§6.6).

### Verification performed

Both bundles were compiled before and after and compared with a normaliser that resolves
logical properties back to physical LTR longhands:

- **LTR: zero value differences** on ODC and O11. Every remaining textual difference is a
  custom-property rename (the card-sectioned split, the sidebar rename) or a newly added
  rule — no computed value moved.
- `npx gulp createProduction --target` builds both platforms clean.
- stylelint: net **zero** new violations (26 ordering violations introduced by the renamed
  properties were re-sorted away). Note the repo's stylelint 14 setup has no
  `customSyntax: postcss-scss`, so it cannot parse `//` comments — 367 pre-existing
  "errors" are that, not real findings. Wiring it up (§7) needs that fixed first.

---

## 5. `.is-rtl` after the change

**51 files → 21.** Thirty `.is-rtl` rule sets were deleted outright. What is left:

| Why it stays | Files |
|---|---|
| `transform` (`translateX`, `scaleX`, `rotate`) and its transitions | `_menu.scss`, `_menu-layout-side.scss`, `_popover-odc.scss`, `_breadcrumbs.scss`, `_pagination.scss`, `_progresscircle.scss`, `_rating.scss` |
| `transform-origin`, `justify-content`, `grid-column` | `_tabs.scss` |
| RTL-specific `animation-name` (physical keyframe tracks) | `_feedback-message.scss` |
| `direction` on a pinned subtree (§6.2) | `_accordion-item.scss`, `_carousel.scss`, `month-picker/provider/_flatpickr.scss` |
| `flex-direction: row-reverse` on a vendor bar | `_lightbox-image.scss` |
| `rotateY` | `_flipcontent.scss` |
| `float` — kept physical per D4 | `_list-item-content.scss` |
| vendor quirk / unrelated | `_rangeslider.scss`, `_resets.scss` (`.is-rtl-device`), `_popover.scss` (`display: inline`, still unexplained), `_submenu.scss` (two `background-color`) |
| anchored off a `--os-safe-area-*` var (D5) | `section-index/_sectionindex.scss` |
| **documented exception** — direction-pinned Flatpickr calendar | `date-picker/provider/_flatpickr.scss` |

---

## 6. CSS-level gotchas

### 6.1 Physical and logical longhands cascade by order, not specificity

Two declarations that resolve to the same side have **no** specificity relationship — the
later one wins. A half-converted rule (`padding-inline-start` in the base rule, a stale
`padding-left` further down the same partial or in a later-imported section) fails
silently. Two consequences:

- Convert a whole rule at a time, and grep the component for leftovers before moving on.
- Bundle order is `root → resets → html-elements → page-layout → widgets → providers →
  patterns → useful-classes → screen-transitions → keyframes → ss-preview` (`#All.js`).
  `05-useful` utilities still win over patterns by order, exactly as today.

### 6.2 Direction-pinned subtrees

Inside an element whose computed `direction` is `ltr`, a logical property resolves to the
LTR side — so converting declarations there changes nothing until the pin is lifted. Four
pins exist:

| Site | Effect on this work |
|---|---|
| `_flatpickr_lib.scss:10` — `.flatpickr-calendar { direction: ltr }` (**vendor**) | The whole calendar is pinned. Either add `.is-rtl .flatpickr-calendar { direction: rtl }` to the override file and convert — which also retires the `.flatpickr-months/-weekdays/-days { direction: rtl }` patch at `:561` — or leave the calendar's 78 declarations physical. Do not half-convert. Affects DatePicker, TimePicker, MonthPicker. |
| `_accordion-item.scss:103` — `.osui-accordion-item__title { direction: ltr }` | Caret-side hack, undone at `:300`. Re-derive with flex `order` + logical padding to retire both. |
| `_carousel.scss:222` — `.is-rtl .splide--ltr { direction: ltr }` | Leave alone; Splide owns its axis. |
| `_resets.scss:63` — `body { direction: ltr }` | Note only: an author declaration on `<body>` outranks the UA `dir` mapping, so confirm what the platform sets it against before relying on logical properties in top-level layout rules (PR 2). |

### 6.3 Deleting an `.is-rtl` rule drops specificity

`.is-rtl .foo` is `(0,2,0)`; the base rule usually is not. Anything that was quietly losing
to the RTL rule starts winning once it is gone. Check components with app-level override
hooks — Header, Menu, Table — after each deletion.

### 6.4 Safe areas stay physical, end to end — D5

`env(safe-area-inset-*)` is physical and has no logical form, and
`--os-safe-area-top/right/bottom/left` (`_root.scss`) carry those values. A logical
property reading one of them is the §6.5 mismatch in another guise: `padding-inline-start:
var(--os-safe-area-left)` flips to the right edge in RTL while still spending the *left*
inset.

So the whole safe-area surface is out of scope: the vars keep their physical names, the
**44** declarations that read them keep their physical properties, and the `.is-rtl` rules
that mirror them — Section Index's sticky rail — stay. This is settled, sensible code; it
is not what the ticket is about.

### 6.5 A logical inset must never meet a physical x-transform

`transform` has no logical form. When `inset-inline-start` and `translateX()` sit on the
same element, RTL flips the anchor but not the transform and the element lands in the
wrong place. Two shapes hit this:

- the Switch thumb — `inset-inline-start: 0` + `translateX(var(--osui-switch-thumb-offset-*))`
  put the knob outside its track in RTL;
- the centring idiom — `left: 50%; transform: translateX(-50%)`, which is *symmetric* and
  correct in both directions while both halves stay physical, and wrong the moment the
  inset goes logical.

**37 insets across 17 files** were reverted to `left` / `right` for this reason. Affected: Notification (9), noUiSlider (4), the `.absolute-center*` utilities (4),
Floating Content (3), Menu, Sidebar, Icon Badge, Progress Circle, Bottom Sheet, Switch,
Master Detail, Bulk Actions, Wizard, VirtualSelect, the icon libraries and the
`absolute-center` mixin.

A grep cannot catch this one — it needs to know that two declarations sit on the same
element. Until the stylelint rule in §7 lands it is a review check: **if a rule has a
`translateX` / `translate()` / `scaleX`, its inset stays physical.**

### 6.6 Some `.is-rtl` rules mirror CSS we do not own

An `.is-rtl` rule is only redundant if the base declaration it mirrors became logical. Two
mirrored **platform** or unowned CSS and were kept:

- **Popover ODC** — `margin-left: -50%` + `translateX(-50%)` on
  `[data-popover] > .popover-bottom.align-center` is declared in the platform stylesheet
  (`platform-core.css:523-527`), never in OSUI. Our RTL override is still the only thing
  mirroring it.
- **Scrollable Area** — the LTR sibling margin that
  `.is-rtl .horizontal-scroll > :not(:first-child)` mirrors is not declared anywhere in the
  bundle, so there is no logical declaration for RTL to inherit from.

The check is mechanical: for each deleted declaration, does our own compiled bundle declare
the mirrored property for that element? Three `.is-rtl` declarations now have no base
counterpart, and all three are deliberate.

### 6.7 App-level overrides stay physical

Apps override OSUI with `padding-left` and friends from their own sheets, which load last
and keep winning; overrides written inside a customer's own `.is-rtl` scope also keep
working. What changes is that our value has moved to the other side in RTL, so an app
override that was complementing one of our deleted blocks may now double up. List the
removed blocks (§5) in the release notes.

---

## 7. Follow-ups not in this PR

1. **Lift the Flatpickr pin.** `date-picker/provider/_flatpickr.scss`,
   `month-picker/provider/_flatpickr.scss` and `time-picker/provider/_flatpickr.scss` were
   left entirely physical and are excluded in both scripts. The vendor baseline pins
   `.flatpickr-calendar { direction: ltr }` (§6.2), so converting them without lifting the
   pin would half-mirror the calendar. Lifting it is a visual change across three patterns
   and deserves its own change with its own Chromatic review.
2. **Positional `top` / `bottom`** — 213 declarations, deliberately left physical (D3).
3. **Enforcement.** Add `customSyntax: postcss-scss` to `.stylelintrc.json` (without it
   stylelint cannot parse this codebase), wire `"lint:scss"` into `package.json`, then add
   `property-disallowed-list` for the physical sides with `overrides` exempting
   `_*_lib.scss`, `splide-core.scss`, the three Flatpickr files and
   `08-servicestudio-preview/`.
4. **Docs** — regenerate `npm run docs:css-api` for the renamed custom properties.

## 7b. Behaviour changes to call out in the release notes

Everything below is intentional; LTR is untouched in all cases.

1. **`.border-left-*` / `.border-right-*` / `.border-top-*` / `.border-bottom-*` utilities
   now mirror in RTL.** They never had an `.is-rtl` counterpart, so previously they stayed
   physical while `.margin-left-*` and `.padding-left-*` flipped. They are now consistent
   with the rest of the utility set.
2. **Card Sectioned images gain their padding back.** `--card-sectioned-image-padding` was
   declared without interpolation (`variables.$token-scale-600 …` reached the browser as
   literal text), so the value was invalid at computed-value time and the image padding
   resolved to `0`. The split into `…-padding-block` / `…-padding-inline` interpolates
   correctly, so the intended 24px/16px padding now applies. This is a visible fix in both
   directions.
3. **Renamed custom properties** — apps setting these directly must update:
   `--osui-sidebar-padding-x` → `-inline`, `--osui-sidebar-padding-y` → `-block`,
   `--card-sectioned-{top,image,bottom}-padding` → `…-padding-block` + `…-padding-inline`.
4. **Deleted `.is-rtl` rules** — 30 blocks. Apps that overrode OSUI *inside* their own
   `.is-rtl` scope still win, but an override written to complement one of these blocks may
   now double up.
5. **Three RTL rules were not pure mirrors and are now mirrored consistently:** the
   **Table** sort icon is spaced with `margin-inline-start` instead of a relative `right`
   offset; the **Accordion item** placeholder loses a redundant RTL margin that duplicated
   its flex `gap`; the sticky **Section Index** on phone had its RTL padding on the block
   axis (`0 0 16px 0`) where the base rule puts it on the inline axis, and now mirrors the
   base.

---

## 8. Decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| D1 | Convert `left` / `right` too? | Yes — mandatory | 20 of 51 `.is-rtl` rule sets are positional; without it they survive and the ticket half-lands |
| D2 | Convert `text-align: left/right`? | Yes (9 base + 4 RTL) | Trivial, and it is what blocks `_table.scss` and `_text.scss` from REMOVE |
| D3 | Convert `*-top` / `*-bottom`? | Yes for `padding`/`margin`/`border` (185); **no** for positional `top`/`bottom` insets (218) | The ticket says "inline/block"; a half-logical box model is worse than a fully logical one. `inset-inline-start` next to `top` is idiomatic, so insets stay physical |
| D4 | `float: inline-start`? | No — keep physical, or replace the float with flex | Chrome 118 / Safari 16.4 is the only support floor above our baseline. 2 declarations, `_list-item-content.scss` |
| D5 | Safe areas | Out of scope — vars, properties and `.is-rtl` mirrors all left as they are | `env()` is physical, so a logical property reading it flips the side but not the value. Existing code already handles this correctly |
| D6 | `border-radius` shorthands | Convert only when inline-asymmetric | `8px 8px 0 0` mirrors to itself |
| D7 | Component CSS API naming | Axis suffixes (`-inline`, `-block`, `-inline-start`); no `-x` / `-y` / `-left` / `-right` | Mirror-correct by construction. Renames are breaking for apps setting them directly, so batch them in one PR and document them |
| D8 | Vendor baselines | Never edited; mirror from the override file, lifting a `direction` pin there when needed | Existing rule (`.claude/rules/scss.md` §10) |
| D9 | Service Studio preview | `-servicestudio-*` stays physical, exempt in stylelint | Not rendered by a browser; logical support cannot be assumed |

---

## 9. Still open

1. **`.is-rtl .popover-top { display: inline }`** (`_popover.scss`) — no discoverable
   physical motive; kept untouched pending archaeology.
2. **Is the RTL Storybook variant in the Chromatic matrix?** The `direction` global exists
   (`.storybook/preview.ts:196-204`); the RTL snapshots are what confirm the 30 deleted
   blocks changed nothing. Confirm before merging.
3. **Flatpickr pin** — follow-up 1 above.
