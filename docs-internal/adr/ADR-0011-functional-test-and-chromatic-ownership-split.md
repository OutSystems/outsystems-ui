<!-- This ADR assigns behaviour to the Cucumber functional suite and appearance to Chromatic, after the new theme left 274 of 1,414 scenarios failing -->

# ADR-0011: Functional-test and Chromatic ownership split for the new theme

## Status

**Accepted** for the ownership split (D1) and the DatePicker closure (D4).

**D6 — the Playwright rewrite — is evaluated, not decided.** The evaluation is accepted: it does not
change D1, because the behaviour/appearance split is the same decision whichever runner executes it.
**Whether the functional suite should move to it is left open** (Q16), and D5 makes that question
sharper rather than softer — this ADR names an owner for behaviour, and that owner is a suite whose
gate has not compiled since 2026-08-07.

**D2 — classic-theme visual coverage — is deliberately left open** (Q1). The evidence in this
document points at one option, but closing the question is the team's call, not this spike's.

**D5 — the functional PR gate does not compile — is confirmed** (Q9, closed 2026-10-06). The PR
pipeline run for this ADR's own pull request failed at template resolution. The gate has been dark
since 2026-08-07, which means nothing was blocking on the 274 failures.

**D4a — the Submenu hover/active underline is a real theme regression** (Q12, closed 2026-10-06).
The removal was not intended. It is the only defect three full passes found, and it needs a fix
under the ROU-12776 epic.

## Context

### C1. The theme shipped; the tests did not move with it

ROU-12872 merged the token-based theme into
`dev` and said so plainly in its own closing notes: *"Automated Tests were not updated yet, as there
some architectural decisions we might need to make. A spike was created to tackle this."* This ADR
is that spike's output.

The merge left **274 of 1,414 scenarios failing across 71 of 116 spec files**, producing 319 failure
records in the triage run that accompanied the ticket. The suite in question is the Cucumber
functional suite in `OutSystems/outsystems-ui-tests`; no part of it lives in this repository.

The failures are not an accident of one release. They are the predictable result of a suite that
mixes two responsibilities: verifying that components **behave** correctly, and verifying that
components **look** a specific way. The second responsibility is now also covered — better, and in
this repository — by Storybook plus Chromatic. Until the two are separated, every token or design
adjustment re-opens the same bill.

### C2. Four test mechanisms exist, not three

Conflating the functional and visual suites — they are separate trees in the same repository — is
what made the classic-theme question (D2) look like a live-coverage question. It is not.

| Mechanism | Lives in | Triggered by | Covers |
|---|---|---|---|
| Cucumber **functional** suite | `OutSystems/outsystems-ui-tests` | `pipelines/pr-pipeline.yaml`, path-derived tags, Chrome + Safari — **but see D5** | Behaviour **and** appearance, against a real low-code app |
| WebDriverIO **visual** suite | `OutSystems/outsystems-ui-tests` | 5 pipelines, `trigger: none`, 4 monthly + 1 manual-only | **Nothing — it cannot execute** (D2). ~210 web + ~31 native checks on paper |
| Chromatic visual testing | **This repository** (`stories/`) | `.github/workflows/chromatic.yaml`, on PR to and merge into `dev` | Appearance of **115 exported stories (~113 snapshotted) across 76 files**; ODC bundle only; initial render only |
| Build + lint gates | This repository | `npm run build`, `npm run lint` | `src/` only |

Two properties matter for what follows. The functional suite's trigger is **path-derived**:
`pr-pipeline.yaml` builds Cucumber tags from changed folders under
`src/scripts/OSFramework/OSUI/Pattern`, `src/scripts/OutSystems/OSUI/Patterns`,
`src/scripts/Providers/OSUI`, `src/scss/04-patterns` and `src/scss/10-deprecated`; a change outside
those paths runs **no** functional tests at all. And the appearance assertions that actually run
live in `tests/functional-tests/`, **not** in `tests/visual-tests/`.

### C3. The suite was re-run, and the result splits in two directions

Three full passes of all 117 feature files were executed on **2026-10-02** — two against the new
theme and, decisively, **one against the classic theme as a control**.

| Classification | Records |
|---|--:|
| `PRE-EXISTING` (fails identically on classic) | 182 |
| `COSMETIC` | 133 |
| `ENVIRONMENT` | 15 |
| `TIMEOUT` | 5 |
| **`CANDIDATE DEFECT`** | **2** |
| **Total** | **337 records across 292 scenarios** |

**Both halves of that result have to be quoted together.** The 274 largely survives as a failure
count — **337 records across 292 scenarios**, against the reference's 319/274. And almost none of it
survives as component risk — **2 candidate defect records, which are one root cause**: the Submenu
header's hover/active underline (D4a). Quoting either half alone misrepresents the exercise.

The scale difference against the reference is explained rather than mysterious: `--retries=0`
records first-attempt truth where the reference allowed three Cucumber retries, the runner OS
flipped 9 failures off and 6 on, and the suite had grown to 1,418 scenarios.

**The suite is not flaky, and the ticket's premise to the contrary is superseded.** The ticket's
Context panel opens with a bullet that is **struck through in Jira** — *"OSUI Functional Tests have a
lot of flaky tests"* — and the measurement agrees with the strike-through: **291 of 292 failing
scenarios reproduced across two consecutive passes (99.7%)**, and that was at `--retries=0`, which
refuses to let a retry-passing scenario count as a pass. Three scenarios in total were
session-specific. The failures are a fixed, enumerable list, not noise.

### C4. Three structural findings condition every count in this document

None of these is a detail. Each one changes how a number from this suite may be read.

1. **`--legacy` filters nothing** (D7). 123 of 337 records (**37%**) sit in `@legacy`-tagged
   scenarios, and 110 (**33%**) are attributable to nothing else. Until the flag is wired to a real
   tag expression, no failure count from this suite is interpretable.
2. **One scenario name can produce several failure records.** A Scenario Outline whose Examples rows
   differ only in columns absent from the title renders several `<testcase>` entries under one name.
   That is the records-versus-scenarios gap — 337 against 292 here, 319 against 274 in the
   reference. **The two numbers must never be compared with each other.**
3. **The PR gate has not compiled since 2026-08-07** (D5, confirmed 2026-10-06). It fails at
   template resolution before any job is scheduled, so **the 274 failures were never a release
   blocker — nothing was blocking on them.** That is also how the suite accumulated this much drift
   unobserved, and it is why this ADR does not frame the work as "unblocking the release".

## Decision Drivers

- The ticket's own reasoning, followed to its conclusion: *"As Functional Tests should be theme
  agnostic, they make sense to be kept."* A suite that pins `rgb(16, 92, 239)` is not theme-agnostic.
- A green check must mean something. The functional suite's colour assertions are a second, weaker
  visual-regression system with no diff UI, no reviewer workflow and no per-story granularity.
  Chromatic has all three and already gates every PR into this repository.
- Remediation must happen **once**, not on every future token or design adjustment.
- **Removing an assertion must not remove functional coverage.** This is the constraint that most of
  the decision is shaped around (D1a).
- Whatever coverage is given up must be named in this document, so it is owned rather than
  rediscovered later (D1e).
- No count from this suite is interpretable until `--legacy` is separated out (D7).

## Considered Options

### A. Who owns appearance

- **Option 1: re-point the expected values** to the new theme — update `constants.ts` plus the
  inline Gherkin literals. *Pros:* cheapest immediate fix; preserves end-to-end coverage today.
  *Cons:* leaves the suite coupled to the theme, so the same 114 failures recur on the next palette
  adjustment; does not address the ticket's own concern about losing the ability to test old-theme
  values; and, per D1b, it would have re-pointed the DatePicker assertions to the new grey, turning
  a failure report into a passing test.
- **Option 2: bulk-delete every colour assertion**, keyed on the cluster label or a grep for `rgb(`.
  *Pros:* fast. *Cons:* wrong — per D1a it destroys functional coverage in ~79 scenarios, 29 of them
  `ExtendedClass` tests that have nothing to do with colour.
- **Option 3: a token-resolution hybrid** — assert that a computed value resolves from a `--token-*`
  / `--osui-*` variable rather than equals a literal. *Pros:* theme-robust in form. *Cons:* examined
  and closed by decomposition; see Rejected alternatives.
- **Option 4: split the ownership** — the Cucumber suite asserts behaviour, Chromatic asserts
  appearance, and each appearance assertion is converted **per assertion** rather than per cluster.
  *Pros:* removes the coupling at its source; the replacements are strictly stronger than what they
  replace. *Cons:* ~79 scenarios need individual judgement; it gives up app-level visual coverage
  that nothing else picks up (D1e).

### B. Classic-theme visual coverage — **open**

The premise of the earlier framing was false. The question is not *"delete live coverage or
replicate it?"*, because there is no live coverage to delete.

- **Option A: accept the loss (the status quo).** Delete `tests/visual-tests/` (~721 lines of
  Gherkin, ~177 of TypeScript, none of which can execute) and add no classic axis to Chromatic.
  *Pros:* nothing that currently runs is lost — no live signal, no baseline reviewed since 2023, no
  pipeline that would go from green to absent. *Cons:* the `/port-to-classic` workflow is left with
  no automated gate at all (see Decision Outcome → D2).
- **Option B: a classic Chromatic mode.** A `chromatic.modes` entry over the theme toolbar global
  that already ships. *Pros:* a real CSS-regression gate on the classic snapshot. *Cons:* ~3–5
  engineering days, a stylesheet-load race to solve, ~113 extra snapshots per build across ~178
  builds/month, and a gain narrower than it looks — five reasons in D2.
- **Option C: port-scoped snapshots** — snapshot only when a port changes `classic-theme/`.
  *Pros:* none that survive scrutiny. *Cons:* **foreclosed**, not merely suspect. See D2.

### C. The Playwright rewrite (`outsystems-ui-tests-new`)

- **Option 1: adopt it** as the route out of this spike. *Cons:* not adoptable as it stands — seven
  things would have to change first, from applying D1 to it through to a PR-triggered pipeline and a
  governance trail. Those are conditions, not disqualifications; they are simply more than this
  spike can carry. See D6, Q16.
- **Option 2: evaluate it, name it, and leave adoption open** — out of scope to decide here, but
  stated as a question with entry conditions rather than passed over. *Chosen.* An ADR that declares
  the Cucumber suite the owner of behaviour, while an internal repository claims near-complete parity
  for that same responsibility and the incumbent's gate does not compile, reads as either unaware or
  evasive if it says nothing.
- **Option 3: rule it out** on the theme-coupling evidence alone. *Cons:* the coupling is a real
  objection but a fixable one, and ruling the rewrite out here would settle, in passing, a question
  that is larger than this spike and belongs with whoever owns ROU-12962.

## Decision Outcome

**A → Option 4. B → open (Q1). C → Option 2, with adoption left open (Q16).**

> **On the numbering: there is no D3, deliberately.** The decisions below keep the numbers they carry
> in this spike's working specification, so that anyone moving between the two documents finds the
> same labels. **D3 was the "deliverable shape" decision** — whether to write an ADR, a Confluence
> page, or both. That is a decision about this spike's own paperwork rather than about the
> architecture, so it has been dropped from this record. The gap is left open rather than closed by
> renumbering, because renumbering would silently break every D-number this spike's authors already
> use. The same applies to **Q15**, absent from the Open questions section below for the reason given
> there.

### D1. The functional suite stops asserting appearance; Chromatic owns visual regression

**This ADR makes that assignment.** It is not a pre-existing arrangement being written down.
Research found **no Jira ticket, no ADR and no Confluence decision that ever transferred this
ownership**: the only team debate — ROU-12958
(*Add Storybook workflow and enable Chromatic visual testing*) — ended with an unanswered question
and an alignment session whose outcome was never written down; Chromatic baselines were unblocked
only on **2026-08-21** (ROU-12997), five
weeks before this spike; and a prior attempt at exactly this decision,
RPOR-10387, was **Discarded**.

From here:

```
Behaviour   ──►  Cucumber functional suite (outsystems-ui-tests)
                 interactions, state transitions, API calls, accessibility semantics,
                 keyboard navigation, provider integration
                 theme-agnostic: no literal colours, no pixel positions, no font weights
                 state is read from the state signal (class, attribute, ARIA),
                 never inferred from a rendered colour or coordinate

Appearance  ──►  Chromatic (this repository, stories/)
                 colours, spacing, radius, typography, elevation, dark mode
                 full-capture builds; PR diffs reviewed, dev merges auto-accept the baseline

Compilation ──►  npm run build + npm run lint
                 unchanged by this decision
```

**What Chromatic does not replace**, stated here so it is not assumed away: real browsers and real
devices (Chromatic runs one headless Chrome); whole-screen and app-layout composition — **there is
no layout or app-shell story in `stories/` at all**; and real low-code HTML, since Chromatic
snapshots a mocked transcription of it. Confluence `6278250633` states the obstacle plainly: *"all
html for OutSystemsUI is made in low-code. We would need to mock as best as possible the low-code
html to the high-code."*

#### D1a. The operation is mostly substitution, not deletion

**This is the most important qualification in the decision, and it is the easiest thing here to get
wrong.** The triage report labels its largest cluster *"Colour tokens moved — cosmetic"*. That label
describes **why the assertion failed**, not **what the test was for**.

The 114 colour failures resolve to **79 distinct scenarios**, and almost none of them is a visual
test:

| Sub-group | Scenarios | What the scenario actually verifies |
|---|--:|---|
| `ExtendedClass …` | **29** | the custom CSS class reached the element |
| Selected / active state | ~20 | which day, dot or menu item is active |
| `Check Input Invalid state` | 4 | the input is in its invalid state |
| `IsDisabled` | 2 | the component is disabled |
| The component's `Color` API | ~10 | the value passed to the public API was applied |

In every one of these, colour is the **observation method**, not the subject. Deleting the assertion
deletes functional coverage. So the rule is applied **per assertion**:

| Case | Action |
|---|---|
| A designer could change this value with no bug involved | **Delete** |
| Colour stands for a state (`selected`, `active`, `invalid`, `disabled`) | **Replace** with whatever state signal the component actually exposes — verify per component, do not assume ARIA (D1c) |
| Colour stands for "a class was applied" | **Replace** with `classList.contains(…)` |
| Colour *is* the component's public API (`Color`, `ProgressColor`) | **Replace** the literal with the token resolved at runtime |

**Pure deletion turns out to be the rare case.** The replacements are strictly stronger than what
they replace: `classList.contains('selected')` catches the DatePicker symptom the report was worried
about **and** survives every future palette change, which the colour assertion does not.

Scale, for estimating: **68 colour-constant use sites** (imports excluded) across **33 files** and
**31 component directories**, plus **62 inline colour literals in 3 `.feature` files**
(`ProgressBar` 22, `ProgressCircle` 26, `ProgressCircleFraction` 14) and **6 inline `.ts` literals**
in 3 files — **136 call sites** in total. `RED_RGB_COLOR` alone accounts for 29 of the 68, nearly
all of them in `ExtendedClass` scenarios.

#### D1b. The trap: cluster labels do not separate cosmetic from defect

Two failures from the run, same assertion shape, opposite verdicts:

```
Submenu: The Submenu has active element                     → COSMETIC
  Check bottom border color the Menu Menu Title 1.
  Expected "rgb(16, 104, 235)" but found "rgb(16, 92, 239)"     ← the new blue; item IS active

Datepicker with the SelectInterval parameter active, RenderType "Flat"  → REAL DEFECT (as reported)
  "2021-9-22" is not selected.
  Background color !== rgb(16, 104, 235) (found rgb(239, 239, 239))     ← grey; day is NOT selected
```

The only thing distinguishing them is the **found** value. Any bulk edit keyed on the expected
value, the cluster label or the file name treats them identically. **No bulk edit is safe.**

The re-run supplied two sharper cases, and both show that reading the found value is necessary but
**not sufficient**:

| Case | The message says | The reality |
|---|---|---|
| **Submenu** (D4a) | `Expected "rgb(16, 104, 235)" but found "rgb(36, 37, 40)"` — looks like a token rename | The border is **gone** (`0px none`). The found value is `currentColor` leaking through a border that does not render. The only genuine candidate defect in three passes, disguised as a colour change |
| **Carousel dot** | `found "rgb(80, 133, 234)"` — matches no token, so it classifies as suspicious | A **frame of a 200ms transition**. The new theme animates `background-color` where the classic snapped it, so the test samples mid-animation. Settled values are correct. Not a defect |

So the found value can be neither the old nor the new token for two opposite reasons — a **removed**
property, or a **transient** one. Where the found value is unrecognised, **inspect the element before
classifying**. The classifier flagged 16 candidates; 14 dissolved on inspection, and the 2 that
survived were the ones whose messages looked most routine.

**The cheapest guard of the three, and the one to institutionalise: run the same suite against the
classic-theme module as a control.** Anything failing on both themes was not caused by the theme,
whatever its message says. That single comparison reattributed **182 of 337 records** in one pass,
and it needs no new infrastructure — only a run without `--branch`.

#### D1c. The replacement signal is verified per component, never assumed

An earlier draft of D1a prescribed `aria-selected` for selected state. **That is not implementable
for DatePicker.** Inspected live on the functional-test app (2026-10-02), a selected Flatpickr day
carries exactly:

```html
<span class="flatpickr-day today selected" role="button"
      aria-label="Friday, 2 October, 2026" aria-current="date" tabindex="-1">
```

There is **no `aria-selected`** on it. The only state signal is the `selected` **class**, so the
assertion is `classList.contains('selected')`.

Provider-backed patterns (Flatpickr, Splide, noUiSlider, VirtualSelect) emit the vendor's markup,
not OSUI's, so their state vocabulary is the vendor's and varies per provider. Writing a conversion
against an assumed ARIA attribute produces a test that fails for a new reason.

**The rule, in its stronger form:** *inspect the element and confirm the property you intend to
assert on still exists.* Submenu (D4a) is the counter-example that forces the stronger wording —
`border-bottom-color` is not a property that moved; the border it describes no longer renders. **No
swap of the literal can repair that assertion**, because there is nothing to read.

One family is now **closed** rather than open. For Animated Label, the re-run verified the
replacement signal directly, in all four input states on both themes:

| State | Theme | parent class | `offsetTop` | `translateY` | **rendered** |
|---|---|---|--:|--:|--:|
| focus / blur, non-empty | classic | `animated-label active` | **−10** | 0 | **−10** |
| focus / blur, non-empty | new | `animated-label active` | **0** | −10 | **−10** |

The label ends up in **exactly the same place on both themes**, with the same `active` class and the
same 12px font. The new theme moved the −10px displacement out of `top` and into a `transform`, and
`offsetTop` does not account for transforms. The animation is intact; the measurement is blind to
it. Replacement signal: `classList.contains('active')` on the `.animated-label` parent — verified
correct on both themes. **No design decision is needed for these 21.**

A secondary observation, out of scope here: a day that is selected but exposes no state to assistive
technology is an accessibility gap in its own right. Related to ROU-12826 (a11y focus state review).

#### D1d. Not every colour literal is a theme value

The 62 inline Gherkin literals must **not** be removed wholesale. They split two ways, and the two
kinds are interleaved in the same Examples tables:

| Kind | Example | Theme-coupled? | Action |
|---|---|---|---|
| **Parameter round-trip** — the test supplies an arbitrary colour and asserts it echoes back | `rgb(255, 82, 0)`, `#860ED4`, `#19B5FE` | **No** | **Keep.** It tests the API, not the palette, and survives any theme change untouched |
| **Token name → RGB mapping** — the test passes a token *name* and asserts the resulting value | `\| yellow \| rgb(245, 159, 0) \|`, `\| neutral-10 \| rgb(16, 18, 19) \|` | **Yes** | Convert to the runtime-resolved token |

`yellow` and `neutral-10` are theme token names, so redefining either breaks the second kind only.
**The split is per row of the Examples table**, not per file — all three progress files contain both
kinds.

A correction in the same direction: of the **7** border-radius assertions in the functional suite,
**6 already assert `var(--border-radius-*)` token names rather than pixels**. They are already
theme-robust and need **no change at all**.

### Accepted cost

The low-code application's **own** rendering — app templates, screens, layout composition — loses
automated visual coverage. Chromatic photographs the library's stories, not a real OutSystems app.

Two qualifications keep this honest:

- **What is given up is broader than the low-code app.** Also lost are cross-browser rendering (real
  Safari on tablet and phone) and real-device rendering, **for both themes**.
- **This loss is already in force.** It describes the present, not a consequence of this decision —
  the WebDriverIO visual suite has been unable to execute since 2026-01-19 (D2). D1 does not cause
  it; D1 removes the last *incidental* coverage of it.

### D1e. Third-party CSS over OSUI components — the strongest argument against D1

Recorded as its own gap, deliberately not folded into the paragraph above, because it is the one
gap D1 creates that **no mechanism in either repository would detect**.

**The composition problem.** What a user sees is not the OSUI bundle. It is:

```
platform base CSS  (owned by Frontend Runtime, not here)
    + OSUI theme   (dist/ODC|O11.OutSystemsUI.css — the only layer Chromatic photographs)
    + app CSS      (per application, per customer)
```

The Frontend Runtime O11 team has shipped accessibility-motivated styles in that first layer which
change how OSUI components render. Those styles are **not in this repository, not in the bundle, and
not this team's to change**.

**Storybook does not close this.** It does carry a platform layer —
`.storybook/platform/platform-core.css`, linked ahead of the OUI stylesheet to mirror the real load
order. But it is a hand-vendored, version-pinned snapshot: 878 lines extracted from
`@outsystems/runtime-widgets-js@6.25.4`, scoped to the *structural* pseudo-elements that make the
data-attribute widgets render at all. A grep for `focus|outline|a11y|accessib` across it returns
**2** hits. It does not contain the accessibility styles in question, and it updates only when
someone deliberately re-vendors it (ADR-0009 defines the refresh trigger).

**The asymmetry that makes this different from every other accepted cost.** The others are
"Chromatic covers less surface than the old suite did". This one is a **detection gap with no
owner**:

| | Would it notice a platform-CSS change that restyles an OSUI component? |
|---|---|
| Chromatic | **No** — that CSS is not in the bundle it photographs, and the vendored copy is pinned and partial |
| Functional suite, **today** | **Yes, accidentally** — it runs against the real composed app, so a changed colour or position shows up |
| Functional suite, **after D1** | **No** — those are exactly the assertions D1 removes |
| `npm run build` / `npm run lint` | No |
| PR gate in either repository | **No — there is no PR in either repository.** The change lands in a third team's codebase |

**That last row is the crux.** Every other failure mode in this document is triggered by a commit
somebody makes here or in the tests repo. This one has no commit in either, so no gate anywhere is
even invoked.

**Honest qualification, so the argument is not overstated.** What the functional suite provides here
is real but poor: it would surface the change as a colour or coordinate mismatch with a misleading
message — the Submenu pattern of D1b exactly. It is not a good gate; it is an accidental one that
happens to sit in the right place.

**Why D1 still holds.** Re-pointing the colour literals would not help: the next platform change
breaks them again, and the suite still could not say whether the cause was OSUI or the platform.
Attributing anything needed a purpose-built A/B comparison, which is precisely what a colour
assertion cannot do. The gap is stated here rather than discovered later, and it leaves one question
this spike does not answer — **Q14**, how a future change of this kind gets detected at all. Who
fixes the *current* instance is not an open question here: it belongs to ROU-13032 and the Frontend
Runtime team (D1e-1).

Supporting evidence that D1's premise nonetheless holds: the Playwright rewrite (D6) ships **1,398
tests with no visual suite and no Flatpickr colour assertions**, and still claims scenario parity —
a working demonstration at a scale no argument in this document matches, with D6's caveat that one
of the assertions it dropped was load-bearing.

#### D1e-1. This exact impact has already been assessed — ROU-13032

The gap above is structural and real for **future** changes. The specific instance that prompted it
is **not open**: it was measured, and the findings are named.

ROU-13032 — *[OSUI] - Validate impact of a11y
widget improvements on UI Patterns*, Spike, High, currently **PO Acceptance** — did exactly this
assessment. Three facts bound the risk more tightly than D1e implies on its own:

- The O11 Frontend team's changes unblock **WCAG 2.2** compliance, are **off by default**, and
  **affect O11 Reactive only**.
- The root cause is precise: *"New selectors are more specific than the ones defined at UI framework
  for both themes."* It is a specificity collision, not an arbitrary restyle.
- **The functional side came back clean.** Quoting the ticket: *"OutSystemsUI components are already
  applying the rules for the elements inside which ends on overriding what was done by the
  FrontendRuntime team. So for what I was able to test nothing to be raised on that context."*
  **The impact is visual-only** — which is a point *for* the ownership split, not against it.

Findings as recorded: Button (Size Small 32 → 40, Size Large 48 → 40), Input (Size Small
`height/min-height` 32px/0 → 40px/40px), Popover (new theme 24px/0 → 40px/40px, classic 21px/0 →
40px/40px), Pagination and ActionSheet downstream of those, Popup, and the Input validation message
— now always in the DOM and visible, so it takes vertical space when empty; classic is unaffected
(`width: 0` when empty), **the new theme is affected because `display: block`**.

**The method is the most reusable part of it, and the closest thing to a working answer for Q14.**
The assessment built sample screens with the feature ON and OFF, for both themes, on a dedicated
platform instance, then **screenshotted those deployed pages in both states with Playwright and
diffed the images**. That is a visual run against a **real composed** page — platform CSS plus OSUI
plus app CSS — which is the thing the dead WebDriverIO suite used to be (D2). **It has now been done,
recently, successfully, and without Applitools, SauceLabs or any part of the broken harness** — ad
hoc, by one person, against deployed sample screens. The implication is material: **replacing the
dead visual coverage may be far cheaper than resurrecting it.**

**What is actually open here is governance, not detection, and it is explicitly not this spike's to
settle.** The ticket's own conclusion is *"my suggestion is to share these visual issues with
FrontendRuntime team to them create less specific selectors"*, and its comment thread records a real
unresolved disagreement: one position holds the diffs are deliberate (larger hit targets), so they
belong to the team that shipped the feature; the other holds that a11y changes should have **no**
visual impact and should not override the UI framework at all. The dilemma stated in the thread is
genuine — if the platform styles do not override OSUI they are useless and should be deleted; if
they do override and OSUI un-overrides them, OSUI both invalidates an IDE feature and takes
ownership of the final rendering.

**This belongs to ROU-13032 — but it is at risk of evaporating.** That ticket sits in PO Acceptance,
and its own thread contains the sentence that would justify closing it unresolved: *"the goal of
this task has been achieved, differences with/without the feature has been raised, what comes out
from now on should be defined by [others]."* That is fair — the spike did its job — but it means the
governance question can close along with the ticket, unanswered and unowned. **This ADR names it so
that outcome is a choice rather than an accident.** It is ROU-13032's to close, not this spike's.

**A pattern worth naming.** ROU-13049 found
genuine classic-vs-new breakage in real customer-shaped apps — by hand, with no automated suite
involved. With ROU-13032 and the DatePicker spot-check, that is **three** instances of real
appearance findings arriving from deliberate manual work rather than from any suite. App-level
composition is where real breakage lives, and nothing automated currently looks there. Note also
that notification between teams does exist and does work — ROU-13032 exists *because* Frontend
Runtime told us — but it is the ordinary Slack/email channel, which is best-effort. Coverage that
fires only when someone remembers to tell us covers precisely the changes we would have heard about
anyway, which is why Q14's cadence must be time-based rather than event-triggered.

### D2. Classic-theme visual coverage — **OPEN**

**Status: unresolved.** This ADR states the question and its consequences; it does not settle it
(Q1).

**What is established fact, with citations.** The WebDriverIO visual suite **cannot execute, and has
not been able to since 2026-01-19.** Two independent causes, either sufficient alone:

1. **The runner is structurally broken.** The Applitools Eyes WebdriverIO service is registered in
   no config. Every visual scenario's `Before` hook calls `Applitools.setViewportSize(...)`, whose
   first statement is `driver.eyesGetConfiguration()` — a custom command only that service adds. So
   **every visual scenario fails in setup before a screenshot is taken.** Introduced by commit
   **`6ff316c` (2026-01-19, PR #521)** as collateral of a dependency modernization. The tests repo's
   own ADR-0004 documents it as known and deliberately deferred; no follow-up fix exists.
2. **The licence was cancelled.** Three Confluence pages (2024-05-07) carry the note *"Given that
   the applitools license was cut based on costs, we needed to disable all code pipelines for visual
   tests!"*. ROU-12492, which proposed
   migrating off Applitools, was **Discarded on 2026-09-30**.

Authoring stopped earlier still: `git log -- tests/visual-tests/` shows **0 commits in 2024 and 0 in
2025**, while the repository took 86 and 43 commits in those years.

**So the real choice is: resurrect, replace, or accept a loss that has already been in force for
roughly two years without anyone noticing.** The third option is the status quo.

**Option A — accept the loss.** Nothing that currently runs is lost. The real gap it leaves is the
**port workflow**, and it is worse than it first appears: a `/port-to-classic` change triggers
**zero** functional tests, and `classic-theme/` is **excluded from Chromatic's visual-surface
detector** (`chromatic.yaml:76` diffs only `src stories .storybook`), which *also disarms the capture
guard* for a classic-only PR. Its only verification today is grep invariants plus a human flipping
the Storybook Theme toolbar by hand. Note too that neither `npm run build` nor `npm run lint` reaches
the classic tree: the build emits `src/` → `dist/` only, lint covers `.ts`, and there is no SCSS
behind the snapshot to be correct — it is three checked-in files.

**Option B — a classic Chromatic mode.** The mechanism it needs **already ships on `dev`**:
`.storybook/main.ts` serves `classic-theme/` at `/classic-theme` (so the CSS is already inside every
`storybook-static` published to Chromatic), `preview-head.html` gives the stylesheet link an `id`,
and `preview.ts` defines `THEME_HREF = { new, classic }`, `applyTheme()`, and a `theme` toolbar
global with exactly `new` / `classic`. The route is a `chromatic.modes` entry over that existing
global — roughly ten lines. **Effort: ~3–5 engineering days**, the non-trivial part being a
**stylesheet-load race**: `applyTheme` sets `href` synchronously and `storyFn()` runs on the next
line, but parsing a 780 KB stylesheet is async; this repository has already been bitten by that
failure class with fonts. It also needs the classic cell disabled on the 13 token-dependent docs
pages, since the classic snapshot contains **0** `--token-*` declarations against 5,642 in `dist`.
Recurring cost: ~113 extra snapshots per build across ~178 builds/month, doubled PR review surface,
and a *guaranteed* classic no-op diff on every token change.

**But Option B's gain is narrower than it looks**, for five reasons:

1. **It would have caught 0 of the 4 ports ever made.** Those ports target `.layout-side-no-header`,
   `.app-menu-content`, `.app-login-info` and `.application-name` — and there is no layout or
   app-shell story in `stories/` at all. Every historical port would have been a silent pass.
2. **It gates half of each port.** Only the ODC bundle is ever loaded; `classic-theme/O11.*.css` is
   served but never linked. Every port must patch both.
3. **Initial render only** (ADR-0009) — hover, focus and expanded states are invisible to it.
4. **It is a hybrid, not the classic theme.** `classic-theme/` has no JavaScript and
   `preview-head.html` loads the new-theme JS unconditionally. "Classic mode" is new-theme runtime
   plus old-theme CSS. Defensible as a CSS-regression gate; it must not be called "the classic theme
   under test".
5. **Observed port frequency is zero.** Only 2 commits have ever touched `classic-theme/` — the
   import and a one-line version-banner bump.

**Option C — port-scoped snapshots: ruled out, with named evidence.** ADR-0008 records Chromatic
build #31 reporting *"✅ Passed — 0 visual changes, 103 tests unchanged"* while capturing nothing,
shipping a real regression unflagged. The generalisable failure is ADR-0008's own sentence:
*"`externals` classifies entries in the changed-file list, and the list itself was empty. The
protection sits one layer above the failure."* Option C is built on precisely that mechanism.
`classic-theme/**` was already an `externals` entry in ADR-0004 — the team already treated a classic
change as untraceable. **Option C is not merely suspect; it is foreclosed.**

**The one identified flip condition has been resolved, and it resolves toward Option A.** The
biggest swing factor on Q1 was whether **O11 adopts the new theme at all**, carried as an explicit
`OPEN DECISION` on the Vision page (Confluence `6264848425`). If O11 stayed on the classic snapshot
while ODC moved forward, the classic theme would become long-lived production code for the larger
install base, port frequency would rise, and Option B's case would change completely. **Answered by
the ticket assignee on 2026-10-02: yes, O11 adopts the new theme.** Both targets converge; the
classic snapshot is not the long-term surface for the larger install base.

**One hardening move that is *not* Option B**, recommended under Option A: keep the manual Storybook
Theme-toggle check as the prescribed port verification, and **state plainly in the port workflow
that it is the only gate** — so the risk is owned rather than invisible. A port hand-edits ~775 KB
of compiled CSS in two bundles, with no compiler, no lint, no test and no visual gate behind it; the
person doing that should not have to infer that nothing else is watching.

> **A second move was proposed and has been withdrawn.** The research recommended adding
> `classic-theme` to the visual-surface path list at `.github/workflows/chromatic.yaml:76`, on the
> grounds that a classic-only PR "silently disarms the capture guard". That reasoning does not hold.
> The guard exists to assert that *a comparison actually happened* when something changed that
> **can move a snapshot** — which is what that path list means, in the workflow's own words. A
> change under `classic-theme/` cannot move a snapshot, because no story loads that CSS. The guard
> is therefore not disarmed; it is correctly inapplicable, and adding the path would make it assert
> something vacuous (Chromatic photographs ~113 new-theme stories on every build, so the check would
> pass unconditionally). Worse, it would encode in the workflow the claim that `classic-theme/` is
> part of the visual surface Chromatic covers. It is not, and a future reader would reasonably
> conclude the stories are verified in both themes. **If Option B is ever adopted, the path belongs
> in that list as part of that work — not before.**

**What is not open, under every outcome:** the `@legacy` / `@skipLegacy` **functional** stages in
`pr-pipeline.yaml` stay exactly as they are. They exercise legacy **components**, not the old
theme's appearance. *"Legacy component"* and *"classic theme"* are different axes, and only the
second is in question here.

**What would still need to be true for Option B:** a reason to expect ports to resume, **and** an
app-layout story group to exist (ROU-13043 / ROU-12973) so a classic axis would cover the selectors
ports actually touch. Two further live spikes could unfreeze the snapshot on a different axis —
ROU-12972 (*single SCSS tree for multiple Design Systems and Themes*) and ROU-13058 (*splitting CSS
across multiple themes*). Best closed before step 2 of the sequence below, which is where
classic-theme visual coverage actually ends.

### D4. DatePicker is closed — it was never a defect

All **76** DatePicker failure records re-triage, on a correctly resolved and correctly themed module
(OSUI 3.0.0, `--color-primary: #105cef`, `--border-radius-soft: 8px`), as:

| Classification | Records |
|---|--:|
| `COSMETIC` | 46 |
| `--legacy` harness artefact (D7) | 29 |
| Parse gap | 1 |
| **`CANDIDATE DEFECT`** | **0** |

Both clusters the reference called the strongest defect candidates are retired. *Day never selects*
folds into the colour cluster — the found value is the new blue, and the `webkitTextFillColor` half
of the **same assertion matches expected exactly**:

```
"2026-9-9" is not selected.
Background color    !== rgb(16, 104, 235) (found rgb(16, 92, 239))     ← the new blue
webkitTextFillColor !== rgb(255, 255, 255) (found rgb(255, 255, 255))  ← identical to expected
```

What misleads is the step's message prefix: `"<date>" is not selected.` is printed whenever the
colour comparison fails, whatever the reason, so a cosmetic failure reads as a state bug. And *date
restrictions* **passes now**, month arrows included.

**DatePicker rejoins the ordinary conversion work. No bug to file, no pause to maintain.**

**A general warning, which is not a DatePicker qualifier.** The module used for the re-run,
`AT_OSUIFunctional_ROU13036`, **is not built from current `dev`** — `Video: URL with file extension
keeps source type` fails only there because that module's `VideoURL` input has `maxlength="50"`
where the unbranched one has `500`, a widening that arrived with recent `dev` work the module
predates. Note there is no "new-theme module" to refresh: `ROU13036` is an unrelated ticket's branch
module that happens to carry the new theme. **Treat any single theme-attributed failure as
provisional until the same staleness check is made, and prefer a purpose-made module built from
current `dev` for the next pass.**

#### D4a. The Submenu underline is a real defect

On the new theme the Submenu header loses its hover/active underline, and the sub-title loses its
`text-decoration` with it. Verified 2026-10-06: **the removal was not intended. This is a theme
regression and it needs fixing** — the only defect three full passes found. It belongs to this
repository, under the ROU-12776 epic, and is action item **A1**.

### D5. The functional PR gate is not running at all — **confirmed**

**This changes the ADR's tone, not its strategy.**

`pipelines/pr-pipeline.yaml` declares the `outsystems-ui-tests` repository resource **with no
`ref:`**, so it resolves against that repo's default branch, `dev`. All four test stages then call
`./pipelines/templates/build-and-execute-functional-tests-template.yml@outsystems-ui-tests`.
**That path does not exist on `outsystems-ui-tests@dev`.** The file lives at
`pipelines/templates/steps/build-and-execute-functional-tests-template.yml`, moved there by commit
`5d7d688` (ROU-12581, **2026-08-07**). Azure resolves templates at queue time, so a missing path
means the pipeline fails to **compile**, not to fail tests.

Three independent signals point the same way:

1. **The referenced path does not exist**, confirmed in both checkouts.
2. **The tests repo has no PR-triggered pipeline at all**, and everything that still runs there
   migrated to a `templates/stages/` structure. `pr-pipeline.yaml` alone still points at the
   pre-migration layout.
3. **The file is frozen** — last modified **2023-05-30**.

The one piece of counter-evidence is gone: build 2175929 did produce test results, which looked like
proof the gate runs, but the ticket assignee confirmed (2026-10-06) it was a **manual** run. It says
nothing about the PR gate.

#### Confirmed 2026-10-06 — the gate does not compile

**Q9 is closed.** The PR pipeline run for the pull request that carries this ADR failed at template
resolution, with exactly the error this section predicted:

```
/pipelines/pr-pipeline.yaml: Could not find
/pipelines/templates/build-and-execute-functional-tests-template.yml
in repository outsystems-ui-tests hosted on https://github.com/
using commit 6811bea4d3351f2b238d056574d7811bab226f98.
GitHub reported the error, "Not Found"
```

The pipeline never reaches a test stage; it fails before any job is scheduled. The resolved commit
named in the error is the tests repo's **current default branch**, which rules out the two
alternative explanations this section had left open: the definition does point at this YAML, and it
is not pinned to some other branch.

**What follows, now that it is fact rather than hypothesis:**

- **The 274 failures were never a release blocker, because nothing was blocking on them.** The
  framing "unblock the release" is wrong and is not used in this ADR. The accurate framing is: *pay
  down a suite that stopped being consulted.* It also explains how the suite accumulated this much
  drift unobserved — nothing was reporting it.
- **The gate has been dark since 2026-08-07**, the date the template moved (`5d7d688`, ROU-12581).
  That is the window in which the theme merged and 274 scenarios started failing, with no gate
  running.
- **This is now the most urgent item in this document, and it is not the one anybody expected.**
  Every conversion step below assumes a gate that will eventually run the converted suite. There is
  no such gate today. Fixing the reference is a one-line change to `pipelines/pr-pipeline.yaml` —
  point it at `pipelines/templates/steps/…`, or at the `templates/stages/` structure everything
  still running has migrated to.
- **The constraint that this spike changes no pipeline file must not be read as preserving a broken
  reference.** That constraint exists to keep the spike narrow. The fix belongs in a separate
  change, and it should not wait on any of the conversion work.

### D6. The Playwright rewrite — evaluated here, but whether to adopt it is **OPEN** (Q16)

`OutSystems/outsystems-ui-tests-new` (package name `osui-play`) is a 19-day, single-author
Playwright reimplementation of the Cucumber suite. It reaches near-total scenario parity (**1,376
matched / 1 missing / 37 native-only** against 1,414) and runs the non-legacy Chromium suite in
minutes rather than hours. It has no ADR, no CONTRIBUTING, no CODEOWNERS, no PRs, no second
contributor and no Jira issue sanctioning it.

**On D1's axis, it has further to travel.** The rewrite has no palette module: the old repository's
single `constants.ts` was inlined into **105 colour literals across 28 of 43 spec files, 50 of them
theme-derived**, with none in `src/`, so there is no shared seam. A theme change that today means
editing **one file** would mean editing **28**. `RED_RGB_COLOR` is declared identically in 23 spec
files and `BASE_PADDING` in 22, and the naming has drifted (`BLUE_RGB_COLOR`, `PIKA_SELECTED_BG` and
`SELECTED_DAY_RGB_COLOR` all hold `rgb(16, 104, 235)`), so a symbol search does not find them — only
a search by value does.

That is a statement about distance, not about direction. **D1 applies to the rewrite exactly as it
applies here**, and once appearance assertions leave, most of those 50 literals have no reason to
exist in either codebase — see Q16, item 1. What it means in practice is that the conversion has to
happen *before* any adoption, not that the rewrite is structurally wrong.

Two further reasons it is not a route out of this spike:

- **Adoption is not a repository swap.** The functional suite is invoked **cross-repo** from this
  repository through a template the tests repo owns, and results publish as **cucumber JSON**;
  Playwright emits JUnit. Adoption needs a new cross-repo template contract and a replacement for
  the `PublishCucumberReport@1` stage. Both its CI definitions are manual-only today.
- **A competing, documented initiative pulls the other way.**
  ROU-12962 (Tech Investment, To Do) commits
  `outsystems-ui-tests` and three sibling suites to a shared **WDIO + Cucumber** test-utils v2.
  Adopting Playwright here would strand that work, since the plan's value comes from all four
  converging — and the rewrite's `native/` tree has already forked that shared layer into a third
  divergent copy.

**Five assets are worth harvesting regardless**, none of which requires adopting it:

| Asset | Value | Caveat |
|---|---|---|
| `scripts/parity-audit.mjs` | A scenario-count ratchet — exactly the guard that bulk assertion removal across 71 files needs | Broken on Windows (path-separator regex); needs the old repo as a pinned sibling checkout |
| 4 determinism root-cause fixes | Root causes rather than symptom patches; serve **ROU-13059** directly. Enumerated below | Two of the four are browser-specific — see the note |
| The branch-suffix regex `/(ROU-?\d+)/i` | A one-line fix for the branch-naming defect | None |
| `URL` / `PW_URL` base-URL override | An ODC escape hatch the old repo lacks; ODC work is live in this epic | None |
| Evidence for D1's premise | 1,398 tests, no visual suite, parity retained | One dropped assertion was load-bearing (D4) |

**The four determinism fixes, written out** so this ADR is self-contained and the hand-off to
ROU-13059 carries content rather than a promise. Of nine fixes across the rewrite's five flakiness
commits, seven are real determinism work and these four are root causes:

| Root cause | Fix | Commit |
|---|---|---|
| WebKit ignores forced clicks on the flatpickr AM/PM `span` | `dispatchEvent('click')` instead of `click({ force: true })` | `d3b3c46` |
| The `msedge` project runs Chromium, but the app reads the `Edg/` user agent | Key expectations off the project name, not the engine | `d3b3c46` |
| WebKit does not re-layout the gallery on a runtime resize | Open the page **inside** the viewport change, not before | `d3b3c46` |
| Firefox computes a `backface-visibility: hidden` rotated container as hidden | Assert on `[id*="-CardBack"]`, not `[id*="-FlipContainer"]` | `a70c1f9` |

These are browser behaviours, so the **analysis** transfers to the Cucumber suite directly; the code
does not — Playwright's API differs from WebdriverIO's, so each technique has to be re-expressed.
**And they are not all equally applicable**: the PR gate runs Chrome and Safari, so the two WebKit
items map straight onto Safari, while the Edge-user-agent and Firefox items only matter if the
scheduled or manual pipelines run those browsers. Whoever picks this up should check the browser
matrix before promising all four.

**Not worth taking:** the `native/` tree (a stale fork carrying a byte-identical `constants.ts` with
180 palette references — it *duplicates* the theme coupling) and the page-object layer (34 of 35
objects have zero importers).

#### Q16 — should the functional suite move to the rewrite at all? **Open.**

Everything above says the rewrite does not change **D1**, and that holds: the behaviour/appearance
split is the same decision whichever runner executes it. But "it does not change D1" is not the same
as "there is nothing to decide", and this ADR should not let the second hide behind the first.

**What makes it a live question rather than a curiosity:**

- **The incumbent is not running.** D5 is now confirmed — the Cucumber PR gate has not compiled since
  2026-08-07. This ADR assigns behaviour ownership to a suite that is currently dark. That was an
  unverified worry when D6 was first written; it is a fact now, and it weakens the strongest argument
  for the incumbent, which was that it is the thing that actually runs.
- **The parity claim is not trivial.** 1,376 of 1,414 scenarios matched, 1 missing, 37 native-only,
  and the non-legacy Chromium suite completes in minutes rather than hours.
- **Three directions are competing**, and no one has chosen: stay on WDIO + Cucumber as-is, converge
  on the shared test-utils v2 that ROU-12962 commits four suites to, or move to the rewrite. Doing
  nothing is a choice in favour of the first, taken by default rather than on the evidence.

**What the rewrite would have to change to be adoptable.** Stated as work rather than as a verdict,
because the question is open and a list of defects would prejudge it. None of these is a reason the
rewrite *cannot* be adopted; each is a condition that has to be met first, and several are cheap.

| # | Gap today | What would have to change | Size |
|---|---|---|---|
| **1** | **No shared palette seam.** `constants.ts` was inlined into 105 colour literals across 28 of 43 spec files, 50 of them theme-derived. The naming drifted — `BLUE_RGB_COLOR`, `PIKA_SELECTED_BG` and `SELECTED_DAY_RGB_COLOR` all hold `rgb(16, 104, 235)` — so a symbol search misses them and only a search by value finds them | **Apply D1 there, not a palette module.** Most of those 50 literals should not survive the behaviour/appearance split at all; they convert or get deleted, exactly as A2–A5 do here. A shared seam only matters for what remains, and what remains is small | M |
| **2** | **Scenario parity is measured by title, not by assertion.** 1,376 of 1,414 matched — but it never ported the colour assertion for the current flatpickr widget, verifying selection through the input's text value instead. Its better DatePicker pass rate is partly a dropped check | **Extend `parity-audit.mjs` to compare assertions, not just scenario names**, and reconcile every gap it finds. Until that exists, the parity number cannot carry the weight the adoption case puts on it | M |
| **3** | **Manual-only CI, and the wrong report format.** Both its pipeline definitions are manual; results publish as JUnit where the cross-repo contract consumes cucumber JSON through `PublishCucumberReport@1` | **A PR-triggered pipeline, plus either a cucumber-JSON reporter or a replacement publish stage**, and a cross-repo template this repository can call — the same shape the current one exposes | M |
| **4** | **No governance trail.** No ADR, no CONTRIBUTING, no CODEOWNERS, no pull requests, one author, and no Jira issue sanctioning it | **CODEOWNERS, a PR-based workflow, and a sanctioning ticket.** Cheap, and it is what makes the rest reviewable rather than a matter of trust | S |
| **5** | **`native/` is a stale fork.** 117 files differing by ~1,629 lines, older WDIO pins with no `resolutions` block, excluded from `tsconfig.json` so never type-checked, and a byte-identical `constants.ts` carrying 180 palette references | **Delete it or re-sync it.** As it stands it duplicates the very coupling item 1 removes | S–M |
| **6** | **An unused page-object layer.** 34 of 35 objects have zero importers; everything funnels through one 1,028-line `functional-page.ts`. `src/utils/tags.ts` is unreferenced and its `@smoke` tag appears zero times | **Use the layer or delete it.** A single 1,028-line object is a maintainability risk at 1,398 tests, whichever way it is resolved | S |
| **7** | **Reconciliation with ROU-12962.** Four suites are committed to a shared WDIO + Cucumber test-utils v2; the rewrite pulls a third way | **Argue it against ROU-12962 explicitly**, not in isolation. Either the rewrite is the better target for all four suites, or it is not adopted here | — |

**Note what item 1 does to the strongest objection.** "The coupling widens from one file to 28" is
true of the rewrite *as it stands today* — but it is an artefact of the pre-D1 world. Once appearance
assertions leave the functional suite, most of those literals have no reason to exist in **either**
codebase. The objection shrinks to the handful of parameter round-trip values that D1d says to keep,
and those are fine distributed. So the coupling is a reason to sequence D1 before any adoption, not a
reason the rewrite is structurally wrong.

**This spike does not answer Q16, and should not.** Deciding it properly needs its own evaluation,
argued against ROU-12962 rather than in isolation, and it should start from the table above rather
than from either suite's advocates. Two sequencing constraints worth stating now: **ROU-12962 is
consulted first**, because whoever owns the shared layer has the larger stake; and **D1 is applied
before adoption, not after**, or the conversion work in A2–A5 has to be repeated at 28 times the
spread.

Tracked as **Q16**.

### D7. `--legacy` filters nothing, and no count is interpretable until it does

Found by the re-run, not by the triage report. It outranks every other harness defect because it
distorts the input to every decision in this document.

The tests repo's own `CLAUDE.md` states: *"With `False`, test examples tagged `@legacy` are skipped;
with `True`, test examples tagged `@skipLegacy` are skipped."* **Neither happens.**
`configs/wdio-shared-conf.ts` hard-codes `tagExpression: ''`, and nothing converts the `--legacy`
value into a tag expression. The flag reaches `driver.config.isLegacy`, where its only effect is
appending the `_OLD` page-name suffix for page objects that opt in.

The consequence is systematic, because ADR-0005 splits legacy from non-legacy at the **Examples**
level — one Scenario Outline carrying two blocks that differ only in the element ids they feed:

```gherkin
  @skipLegacy
  Examples:
    | id                        | TabsBlock   |
    | ButtonLoading_InsideTabs2 | Inside Tabs |

  @legacy
  Examples:
    | id                             | TabsBlock            |
    | ButtonLoading_InsideLegacyTab2 | Inside Tabs (Legacy) |
```

With the filter inert, **both** blocks run, and the `@legacy` rows drive legacy ids against the
current test page.

**Scale: 123 of 337 failure records (37%) sit in `@legacy`-tagged scenarios, and 110 (33%) are
attributable to nothing else.** It also explains the reference report's *"13 from a `ShowPips`
control that never existed"*: `ShowPips` is a real parameter **of the legacy Range Slider**, used
only in `RangeSliderLegacy.feature`, whose scenarios open the same page as the non-legacy file.

**The rule that follows: any count quoted from this suite — including the 274, the 337, and every
per-cluster figure — must say whether the `@legacy` rows were separated.** The re-run separates them
per scenario; the reference did not. The reference's *"67 stale locators, verified identical on
un-branched master"* was a correct observation with the wrong root cause — 58 of the re-run's 82 are
this, not dead selectors.

Wiring `--legacy` to a real tag expression removes a third of the noise from every future triage,
which is why it sits at the **top** of the sequence below rather than in the middle of it.

### What this does *not* claim

Stated explicitly, because each is easy to over-read:

- **No cause is claimed for the residual unattributed failures beyond what was measured.** The re-run
  reduced them from 9 records to **1** in 337, and the 21 element timeouts resolved to **5**, 14 of
  the original being downstream of D7 rather than of the theme. That is the whole of what is known.
- **The suite is not claimed to be flaky.** See C3 — 291 of 292 at `--retries=0`.
- **The Gallery/Carousel "layout shift" is not theme-caused.** All of it fails identically on the
  classic baseline, and at the same viewport both themes give `grid-template-columns: 427.75px ×4`,
  `gap: 16px`. Every failing Gallery case is *nested*, where the container decides the column count;
  the assertions are over-specified and were already failing. No design confirmation is needed.
- **The "module not branched" 404s prove nothing about staleness.** `getURL()` appends the branch
  suffix to **every** module name, including `Platform_FunctionalTests`, which only ever exists
  unbranched. It 404s whenever `--branch` is passed at all — on a healthy branch as readily as a
  stale one.

### Rejected alternatives

- **Re-point the expected values** to the new theme. Cheapest immediate fix, and it preserves
  end-to-end coverage, but it leaves the suite coupled to the theme so the same 114 failures recur on
  the next palette adjustment; it does not address the ticket's own concern about losing the ability
  to test old-theme values; and per D1b it would have re-pointed the DatePicker assertions to the new
  grey, converting a failure report into a passing test.
- **Bulk-delete every colour assertion**, keyed on the cluster label or a grep for `rgb(`. Fast, and
  wrong: per D1a it destroys functional coverage in ~79 scenarios, 29 of them `ExtendedClass` tests
  that have nothing to do with colour.
- **The token-resolution hybrid** — a global smoke check that a computed value resolves from a
  `--token-*` / `--osui-*` variable rather than equals a literal. **Closed by decomposition.**
  Per-element comparison against a runtime-resolved token *is* adopted, but only where the token is
  the component's own public API — that is step 4 of the sequence, not a general pattern. A *global*
  "did the theme load" check is **not** adopted: a theme-agnostic suite must by construction give the
  same answer on either theme, so the check is obsolete exactly when the conversion it was meant to
  protect completes, and it would obstruct the deliberate classic control run that D1b establishes as
  the cheapest attribution tool available. What the idea was reaching for was **interpretability of a
  run**, and that is answered by one log line — step 6 below.
- **Executing the remediation inside this spike** — landing the assertion removal in
  `outsystems-ui-tests` under this ticket. A single PR to review, but it mixes a decision that needs
  team agreement with mechanical changes across 71 files in another repository.
- **Adopting the Playwright rewrite** as the route out. See D6: it inherits and widens the very
  coupling this decision removes.

Note that **the classic Chromatic story set is not in this list.** It is a live option under D2, not
a rejected alternative.

## Recommended next steps

**No Jira tickets have been filed for any of this.** This spike delivers recommendations only; the
sequencing below is a proposal for whoever schedules the work.

### Action items at a glance

Everything this ADR asks anyone to do, in one place. Sizes are rough and relative, not estimates.
`A0a` and `A0b` come first for a reason: until `--legacy` is wired up, every count below is
distorted (D7); and until the template reference is fixed, **there is no functional gate at all**
(D5, confirmed) — every conversion step below assumes one that will eventually run. The detail
behind each row is in the sequence that follows this table.

Two rows that were investigations in the first version of this ADR are now fixes: **A0b** and
**A1**. Both questions were answered on 2026-10-06, and both answers were the unwelcome one.

| # | Action | Type | Where it lands | Owner | Size |
|---|---|---|---|---|---|
| **A0a** | Wire `--legacy` to a real tag expression — it currently filters nothing (**D7**) | Fix | `outsystems-ui-tests` | tests-repo CI owner | S |
| **A0b** | **Fix the stale template reference in `pipelines/pr-pipeline.yaml`** — it points at `pipelines/templates/build-and-execute-functional-tests-template.yml`, which has not existed on `outsystems-ui-tests@dev` since 2026-08-07, so the gate fails to compile (**D5**, confirmed). One line; point it at `templates/steps/…` or the `templates/stages/` structure everything still running uses | Fix | **this repo** | tests-repo CI owner | XS |
| **A1** | **Restore the Submenu hover/active affordances** — both the header's `border-bottom` and the sub-title's `text-decoration`. Confirmed a theme regression, not an intended redesign (**D4a**, Q12 closed); the only defect three passes found | Fix | **this repo** | OSUI | S |
| **A2** | Convert the 29 `ExtendedClass` scenarios from a background-colour check to `classList.contains(…)` | Convert | `outsystems-ui-tests` | QE | M |
| **A3** | Rework the proxy assertions — colour-as-state and position-as-behaviour (**D1a / D1b / D1c**) | Convert | `outsystems-ui-tests` | QE | L |
| **A4** | Re-express the `Color` API scenarios against the runtime-resolved token; split per Examples row (**D1d**) | Convert | `outsystems-ui-tests` | QE | M |
| **A5** | Delete the residue that is genuinely appearance-only | Convert | `outsystems-ui-tests` | QE | S |
| **A6** | Hygiene track — harness defects, stale locators, turn `strict` on (613 hidden), resolve the 3 `TS2307`s, wire a type-check into CI | Fix | `outsystems-ui-tests` | tests-repo owner | L |
| **A7** | Re-run all passes with `--legacy` fixed and against a module built from current `dev` | Verify | `outsystems-ui-tests` | QE | M |
| **A8** | Record in the port workflow that the manual Storybook Theme-toggle check is the **only** gate on a port (**D2**, the one hardening move) | Document | **this repo** | OSUI | XS |
| **A9** | Notify **ROU-12962**: its acceptance criterion *"the ui-tests Applitools visual run must stay green"* is unsatisfiable (**D2**) | Notify | Jira | this spike's author | XS |
| **A10** | Notify **ROU-13059**: D6's four determinism fixes are directly applicable and are root causes | Notify | Jira | this spike's author | XS |
| **A11** | **Close Q1** — classic-theme visual coverage: resurrect, replace, or accept. Evidence points at *accept*; the call is the team's. Best closed before A2 | **Decide** | — | the team | — |
| **A12** | **Answer Q14** — do we want automated visual coverage of the real composed page, and how? The one gap with no owner; needs a team outside OSUI | **Decide** | — | TBD | — |
| **A13** | **Answer Q16** — does the functional suite move to the Playwright rewrite, converge on ROU-12962's shared WDIO + Cucumber layer, or stay as it is? Doing nothing picks the third by default. Needs its own evaluation, argued against ROU-12962, with the four entry conditions in D6 | **Decide** | ROU-12962 owner + QE | TBD | — |

Three standing practices, not one-off actions: **G1** a scenario-count ratchet across A2–A5; **G2**
harvest the determinism fixes; **G3** keep the classic-theme control run as the default triage step.
Each is expanded below.

**Step 0a — fix `--legacy` (D7). This is the top of the list.** A third of the failure list is noise
from it, and every subsequent count is distorted until the flag is wired to a real tag expression.

**Step 0b — fix the template reference in `pipelines/pr-pipeline.yaml` (D5, confirmed).** Q9 asked
whether the gate still compiles; it does not, and the answer arrived from this ADR's own pull
request. One line, and until it lands every step below converts a suite that nothing runs.

Then:

1. **Restore the Submenu hover/active affordances (D4a).** Verified 2026-10-06 as a real regression,
   not an intended redesign — the header's `border-bottom` and the sub-title's `text-decoration`
   were both dropped and nothing replaced them. It does not block the conversion work, but it must
   land before step 5, which would otherwise delete the scenarios that caught it.
2. **Convert the `ExtendedClass` scenarios** (29 — the single largest group) from a background-colour
   check to `classList.contains(…)`. Mechanical, independent of every other step, and the cheapest
   large win: a good first slice.
3. **Rework the proxy assertions** per D1a. Two families, same treatment: *colour as proxy for state*
   (selected day, active dot, active menu item, `Invalid state`, `IsDisabled`) → the signal the
   component actually exposes, **inspected first** (D1c); and *position as proxy for behaviour*
   (Animated Label `offsetTop`, Gallery and Carousel Y-coordinates) → the state signal the animation
   or advance actually sets. Both need per-scenario judgement and the **found** value read (D1b).
4. **Re-express the `Color` API scenarios** (Progress Bar, Progress Circle) against the token
   resolved at runtime rather than an RGB literal. These cannot simply be deleted — the scenario
   would then assert nothing. Split per Examples row (D1d): token-name rows convert, arbitrary
   round-trip colours stay.
5. **Delete what is left** — the residue that is genuinely appearance-only, now that Chromatic owns
   it.
6. **Hygiene track** (`outsystems-ui-tests`), independent of the theme: stale locators, unbranched
   module references, the OS assertion, mobile gestures on desktop, and the harness defects in their
   corrected form — `--cucumberOpts.tagExpression` silently consumed as a positional argument after
   `--`; the **inverted** branch defect, where `--branch=ROU-12872` works and `--branch=ROU12872`, the
   form the repo's own README and `CLAUDE.md` instruct users to pass, 404s; `junit-results/`
   accumulation being **local-only** (CI cleans it, the local config has no such hook); and the
   "Unstable" label on every failure, emitted for any scenario lacking a `@bug` tag — of which there
   are **zero live** in the suite, so the downstream known-issue triage branch is unreachable. Two
   further environment findings belong here: the suite will not install or run with the default Yarn
   setup (`corepack yarn` plus `YARN_NODE_LINKER=node-modules` is required on every invocation, and a
   committed `.yarnrc.yml` would remove the problem entirely), and the headless viewport is **929px**
   tall, not the ~1080 that eleven Notification scenarios assume when they assert absolute pixel
   ranges. The one-line branch-regex fix from D6 belongs here too.
   **Also here: log which theme stylesheet the target module served.** Not a gate and not an
   assertion — one line in the run output. The reference report never recorded it, and that single
   omission is why this exercise spent days unable to say whether a given failure had been measured
   against the new theme or the classic one.
7. **Re-run the full suite** after steps 2–5, with `--legacy` fixed and against a module built from
   current `dev`. A purpose-made module removes a whole class of false attribution (D4).

**On the TypeScript and lint posture, so it is not carried as work that is already done.** The triage
report's **98 `tsc` errors and 183 ESLint errors** were accurate for its checkout (`b50f1a6`,
2026-08-11) and **have since been paid down by `79d45c6`** — *"ROU-12969: Pay down the TypeScript and
lint debt in tests/"*, 2026-09-16, 77 files, +478/−321. Measured at `9c77637` (2026-10-01) the counts
are **3** and **0 in scope**. What remains is narrower and sharper, and is the only part belonging in
step 6: **`strict` is off**, hiding **613** errors; the 3 live errors are `TS2307` on
`@wdio/protocols`, pinned in `resolutions` but never declared as a dependency; and **no pipeline runs
either gate**, so the count can grow again unseen.

### Three guards worth adopting alongside the sequence

- **G1 — a scenario-count ratchet for steps 2–5 (A2–A5).** Bulk removal across 71 files risks
  deleting a *scenario* where only an *assertion* was meant to go, and nothing in
  `outsystems-ui-tests` checks for that today. D6's `parity-audit.mjs` does exactly this at title
  level.
- **G2 — harvest the four determinism fixes** (A10's payload). They are independent of the theme and
  of the rewrite's fate, and they are root causes rather than symptom patches.
- **G3 — keep the classic-theme control run as standing practice.** It reattributed 182 of 337
  records in one pass, needs no new infrastructure, and is the cheapest attribution tool available.
  Make it the default first step of any future theme triage, not a special measure.

### Tickets that must be notified, not merely referenced

A finding in this document invalidates an assumption in each of these. Saying *"that is the owner's
call"* is true but passive — the owner has to **learn** of it, or discovers it only on trying to
execute.

- **ROU-12962** (shared test-utils v2) still
  budgets Applitools as a shared-test-layer dependency, and its acceptance criteria require *"The
  ui-tests Applitools visual run must stay green"*. Per D2 that is **unsatisfiable** — the run cannot
  execute. Worth noting *why* the criterion exists: ROU-12962 was created **2026-08-10**, seven
  months after the January breakage, which is evidence the breakage is not known to the team.
- **ROU-13059** (*Fix Flaky test 2nd
  iteration*) is the direct target for D6's four determinism fixes, which are directly applicable and
  are root causes.

## Open questions

The `Q` numbers used above come from this spike's working specification, which is a local document
and **does not ship**. They are defined here so the ADR stands on its own.

| ID | Question | Status | Where |
|---|---|---|---|
| **Q1** | Do we keep any visual coverage of the classic theme — resurrect it, replace it, or accept a loss already two years old? | **Open.** Evidence points at *accept*; the call is the team's. Best closed before the conversion work starts | D2, action **A11** |
| **Q9** | Does the functional PR gate still compile? | **Closed 2026-10-06 — it does not**, and has not since 2026-08-07. Confirmed by the pipeline run on this ADR's own pull request | D5, action **A0b** |
| **Q12** | Is the removed Submenu hover/active underline a bug or an intended redesign? | **Closed 2026-10-06 — a bug.** A real theme regression, and the only one three full passes found | D4a, action **A1** |
| **Q14** | Do we want automated visual coverage of the real composed page, and if so how? | **Open.** The one gap with no owner; needs a team outside OSUI, and the cadence has to be time-based rather than triggered by notification | D1e, action **A12** |
| **Q16** | Does the functional suite move to the Playwright rewrite, converge on ROU-12962's shared WDIO + Cucumber layer, or stay as it is? | **Open**, and raised by this ADR rather than inherited. Doing nothing picks the third by default | D6, action **A13** |

Two further questions the specification carried are **not** open and are deliberately absent: whether
to adopt a global token-resolution smoke check (closed by decomposition — see Rejected alternatives),
and who owns the visual impact of the O11 accessibility styles (closed as a split: the fix belongs to
ROU-13032 and the Frontend Runtime team, not to this spike — see D1e-1).

## Links

References are given by name and identifier rather than as links, because this repository is public
and the systems below are internal.

**Related ADRs in this directory** (NFR4 — D1 makes Chromatic load-bearing, so the guarantees these
record become this decision's constraints):

- **ADR-0004**, *Chromatic visual testing on a long-living branch* — why TurboSnap cannot be trusted
  here: a SCSS-only PR traces to no story, so full-capture builds are a requirement, not a
  preference.
- **ADR-0008**, *Chromatic baseline builds and the widget-story dependency* — build #31, which
  reported green having captured nothing. That failure forecloses D2's Option C. Its capture guard
  is also what D2's withdrawn second hardening move would have extended to `classic-theme`: the
  guard asserts that a comparison happened, and a classic-only change has no comparison to assert.
- **ADR-0009**, *Static widget stories and zero private dependencies* — initial-render-only capture
  (so hover and focus states are outside Chromatic's reach today, which bears on D4a) and the
  vendored `platform-core.css` whose pinned, partial scope is central to D1e.

**Jira** — ROU-13041 (this spike), ROU-12776 (parent epic, *OutSystems UI - New theme*), ROU-12872
(*Integrate new theme in low-code*, the story that deferred this decision). Named in the decisions
above: ROU-12958, ROU-12997, RPOR-10387, ROU-12492, ROU-12962, ROU-13032, ROU-13049, ROU-13059.

**Confluence** (space `RDMBLVS`) — *Functional tests and the new theme — testing strategy*, the
team-facing summary of this ADR, published as a child of *OutSystemsUI 3.0 (New Theme) — Vision*
(`6264848425`), which is also where the O11 decision lived. Also `6278250633` (*Part II: Unify
Storybook offering*, the mocked-low-code-HTML constraint) and `6806241361` (the ROU-13049 comparison
write-up). The page is maintained in Confluence; this ADR is the durable record.

**Files this ADR discusses and does not change** — `.github/workflows/chromatic.yaml`,
`pipelines/pr-pipeline.yaml`.

**Working documents** — the specification, the three-pass re-run report and the two research
documents behind this ADR are local only, under a gitignored `specs/` directory, and **do not
ship**. That is why every figure above is written out here rather than cited to them. They are
attached to the Confluence page for anyone who needs the raw evidence.

## Date

2026-10-06
