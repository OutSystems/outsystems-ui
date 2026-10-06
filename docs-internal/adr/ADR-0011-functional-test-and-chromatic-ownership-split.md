<!-- This ADR assigns behaviour to the Cucumber functional suite and appearance to Chromatic, after the new theme left 274 of 1,414 scenarios failing -->

# ADR-0011: Functional-test and Chromatic ownership split for the new theme

## Status

**Accepted** for the ownership split (D1), the deliverable shape (D3), the DatePicker closure (D4)
and the evaluation of the Playwright rewrite (D6).

**D2 — classic-theme visual coverage — is deliberately left open** (Q1). The evidence in this
document points at one option, but closing the question is the team's call, not this spike's.

**D5 — whether the functional PR gate still compiles — is recorded as unverified** (Q9). It needs
one look at an Azure DevOps definition, which the work behind this ADR could not reach.

## Context

### C1. The theme shipped; the tests did not move with it

[ROU-12872](https://outsystemsrd.atlassian.net/browse/ROU-12872) merged the token-based theme into
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
3. **The PR gate may not have compiled since 2026-08-07** (D5). If that holds, the 274 failures were
   never a release blocker, because nothing was blocking on them — which would also explain how the
   suite accumulated this much drift unobserved.

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

### C. Deliverable shape

- **Option 1: an ADR alone.** *Pros:* tightest coupling to the code the decision governs.
  *Cons:* QE, design and PO do not read `docs-internal/`.
- **Option 2: an ADR plus a short Confluence page**, each for the audience it serves — the ADR
  carries reasoning and alternatives, the page carries conclusions and asks. *Chosen.*
- **Option 3: the ADR plus execution in the same spike** — landing the assertion removal in
  `outsystems-ui-tests` here. *Cons:* mixes a decision that needs team agreement with mechanical
  changes across 71 files in another repository. Rejected.

### D. The Playwright rewrite (`outsystems-ui-tests-new`)

- **Option 1: adopt it** as the route out of this spike. *Cons:* it is **less** theme-agnostic than
  the suite it replaces, and adoption is not a repository swap. See D6.
- **Option 2: evaluate it, name it, and do not adopt it under this ticket.** *Chosen* — an ADR that
  declares the Cucumber suite the owner of behaviour while an internal repository claims near-complete
  parity for that same responsibility reads as either unaware or evasive.

## Decision Outcome

**A → Option 4. B → open (Q1). C → Option 2. D → Option 2.**

### D1. The functional suite stops asserting appearance; Chromatic owns visual regression

**This ADR makes that assignment.** It is not a pre-existing arrangement being written down.
Research found **no Jira ticket, no ADR and no Confluence decision that ever transferred this
ownership**: the only team debate — [ROU-12958](https://outsystemsrd.atlassian.net/browse/ROU-12958)
(*Add Storybook workflow and enable Chromatic visual testing*) — ended with an unanswered question
and an alignment session whose outcome was never written down; Chromatic baselines were unblocked
only on **2026-08-21** ([ROU-12997](https://outsystemsrd.atlassian.net/browse/ROU-12997)), five
weeks before this spike; and a prior attempt at exactly this decision,
[RPOR-10387](https://outsystemsrd.atlassian.net/browse/RPOR-10387), was **Discarded**.

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
assertion cannot do. The gap is stated here rather than discovered later, and it leaves two
questions this spike does not answer — **Q14** (how future changes get detected) and **Q15** (who
owns this one).

Supporting evidence that D1's premise nonetheless holds: the Playwright rewrite (D6) ships **1,398
tests with no visual suite and no Flatpickr colour assertions**, and still claims scenario parity —
a working demonstration at a scale no argument in this document matches, with D6's caveat that one
of the assertions it dropped was load-bearing.

#### D1e-1. This exact impact has already been assessed — ROU-13032

The gap above is structural and real for **future** changes. The specific instance that prompted it
is **not open**: it was measured, and the findings are named.

[ROU-13032](https://outsystemsrd.atlassian.net/browse/ROU-13032) — *[OSUI] - Validate impact of a11y
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
that outcome is a choice rather than an accident** (Q15).

**A pattern worth naming.** [ROU-13049](https://outsystemsrd.atlassian.net/browse/ROU-13049) found
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
   tests!"*. [ROU-12492](https://outsystemsrd.atlassian.net/browse/ROU-12492), which proposed
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

**Two hardening moves that are *not* Option B** (≈0.5 d total), recommended under Option A:

1. Add `classic-theme` to the visual-surface path list at `.github/workflows/chromatic.yaml:76`, so
   a classic-only PR stops silently disarming the capture guard.
2. Keep the manual Storybook Theme-toggle check as the prescribed port verification, and **state
   plainly that it is the only gate** — so the risk is owned rather than invisible.

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

#### D4a. The one unresolved candidate: the Submenu underline

Two records, one root cause, reproduced in both new-theme passes and **both passing on the classic
baseline**:

- `Submenu: The user hovers the Menu Title 2`
- `Submenu: The Submenu without items has active element`

```
Check bottom border color the Menu Menu Title 2.
  Expected "rgb(16, 104, 235)" but found "rgb(36, 37, 40)".
```

**The colour is not what is wrong.** The element has no bottom border at all on the new theme, and
nothing replaces it:

| | classic | new theme |
|---|---|---|
| `border-bottom-width` | `2px` | **`0px`** |
| `border-bottom-style` | `solid` | **`none`** |
| `border-bottom-color` | `rgb(16, 104, 235)` | `rgb(36, 37, 40)` — i.e. `currentColor`, because there is no border |
| `box-shadow` | `none` | `none` |
| `::after` / `::before` | `none` | `none` |

A related failure points the same way: `Submenu: The user hovers the Sub Menu Title 1.1` fails with
`textDecorationLine` `underline` → `none`. **Two different hover affordances in the same component
were both removed.**

**Whether that is a bug or an intended redesign is unverified.** It is not established either way —
the functional suite cannot tell the two apart, and neither can this ADR. **The next action is a
verification task, not a bug report and not a design meeting.** Cheapest first:

1. **Check the Figma for Submenu.** The new theme's Submenu styling was delivered under **ROU-12876**
   (*Navigation Patterns v1*) and **ROU-12925** (*Navigation v2*). If the design shows no
   hover/active underline on the menu header, the removal is intended and the question closes
   without anyone being asked.
2. **Check the SCSS history.** Whether the `border-bottom` was deliberately dropped or fell out of
   the token migration is visible in the component's own history, against the pre-migration rule.
3. **Only if 1 and 2 disagree or are silent**, escalate to whoever owns the Submenu design.

One check answers both affordances — they were almost certainly changed by the same work.

Outcome, either way:

- **Intended** — these scenarios are appearance-only and belong in the deletion bucket, and
  **Chromatic should carry a baseline for submenu hover**, which today it does not (ADR-0009:
  initial render only).
- **Not intended** — this is a real theme regression, and the only one three full passes found. It
  gets a bug under ROU-12776.

**What it is not:** a state bug. The assertion never looked at the active-state class. If the
removal is intended, the correct replacement assertion is that class, not any colour.

Tracked as **Q12**.

### D5. The functional PR gate may not be running at all — **unverified**

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

**This is not yet fact.** A check against the Azure DevOps definition is still needed — the
definition could point at different YAML or pin a branch outside the file. But if it holds:

- The 274 failures were **never a release blocker**, because nothing was blocking on them. "Unblock
  the release" becomes "pay down a suite that stopped being consulted", and those are not the same
  argument.
- **The constraint that this spike changes no pipeline file must not be read as preserving a broken
  reference.** That constraint exists to keep the spike narrow. If D5 confirms, the file needs
  fixing — in a separate change, not this one.

Cost to resolve: **one look at the pipeline's last successful run.** Tracked as **Q9**.

### D6. The Playwright rewrite exists, was evaluated, and changes nothing here

`OutSystems/outsystems-ui-tests-new` (package name `osui-play`) is a 19-day, single-author
Playwright reimplementation of the Cucumber suite. It reaches near-total scenario parity (**1,376
matched / 1 missing / 37 native-only** against 1,414) and runs the non-legacy Chromium suite in
minutes rather than hours. It has no ADR, no CONTRIBUTING, no CODEOWNERS, no PRs, no second
contributor and no Jira issue sanctioning it.

**On D1's axis it makes the problem worse.** The rewrite is **less** theme-agnostic than the suite it
replaces: it has no palette module at all. The old repository's single `constants.ts` was inlined
into **105 colour literals across 28 of 43 spec files, 50 of them theme-derived**, with none in
`src/` — so there is no shared seam. A theme change that today means editing **one file** would mean
editing **28**. `RED_RGB_COLOR` is declared identically in 23 spec files and `BASE_PADDING` in 22,
and the naming has drifted (`BLUE_RGB_COLOR`, `PIKA_SELECTED_BG` and `SELECTED_DAY_RGB_COLOR` all
hold `rgb(16, 104, 235)`), so a symbol search does not find them — only a search by value does.

Two further reasons it is not a route out of this spike:

- **Adoption is not a repository swap.** The functional suite is invoked **cross-repo** from this
  repository through a template the tests repo owns, and results publish as **cucumber JSON**;
  Playwright emits JUnit. Adoption needs a new cross-repo template contract and a replacement for
  the `PublishCucumberReport@1` stage. Both its CI definitions are manual-only today.
- **A competing, documented initiative pulls the other way.**
  [ROU-12962](https://outsystemsrd.atlassian.net/browse/ROU-12962) (Tech Investment, To Do) commits
  `outsystems-ui-tests` and three sibling suites to a shared **WDIO + Cucumber** test-utils v2.
  Adopting Playwright here would strand that work, since the plan's value comes from all four
  converging — and the rewrite's `native/` tree has already forked that shared layer into a third
  divergent copy.

**Five assets are worth harvesting regardless**, none of which requires adopting it:

| Asset | Value | Caveat |
|---|---|---|
| `scripts/parity-audit.mjs` | A scenario-count ratchet — exactly the guard that bulk assertion removal across 71 files needs | Broken on Windows (path-separator regex); needs the old repo as a pinned sibling checkout |
| 4 determinism root-cause fixes | Portable to the Cucumber suite verbatim; serve **ROU-13059** directly | None |
| The branch-suffix regex `/(ROU-?\d+)/i` | A one-line fix for the branch-naming defect | None |
| `URL` / `PW_URL` base-URL override | An ODC escape hatch the old repo lacks; ODC work is live in this epic | None |
| Evidence for D1's premise | 1,398 tests, no visual suite, parity retained | One dropped assertion was load-bearing (D4) |

**Not worth taking:** the `native/` tree (a stale fork carrying a byte-identical `constants.ts` with
180 palette references — it *duplicates* the theme coupling) and the page-object layer (34 of 35
objects have zero importers).

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
- **An ADR alone, without the Confluence page.** The audiences differ: QE, design and PO do not read
  `docs-internal/`, and the people who most need to know that the functional suite stops owning
  appearance are exactly the ones who would never see it.

Note that **the classic Chromatic story set is not in this list.** It is a live option under D2, not
a rejected alternative.

## Recommended next steps

**No Jira tickets have been filed for any of this.** This spike delivers recommendations only; the
sequencing below is a proposal for whoever schedules the work.

### Action items at a glance

Everything this ADR asks anyone to do, in one place. Sizes are rough and relative, not estimates.
`A0a` and `A0b` come first for a reason: until they are done, every count below them is distorted
(D7) and the urgency of all of it is unknown (D5). The detail behind each row is in the sequence
that follows this table.

| # | Action | Type | Where it lands | Owner | Size |
|---|---|---|---|---|---|
| **A0a** | Wire `--legacy` to a real tag expression — it currently filters nothing (**D7**) | Fix | `outsystems-ui-tests` | tests-repo CI owner | S |
| **A0b** | Confirm whether the functional PR gate still compiles; one look at its last successful run (**D5 / Q9**) | Verify | Azure DevOps | tests-repo CI owner | XS |
| **A1** | Verify the Submenu underline — bug or intended redesign (**D4a / Q12**). Figma (ROU-12876 / ROU-12925) → SCSS history → escalate only if both are silent | Verify | this repo | Submenu design owner | S |
| **A2** | Convert the 29 `ExtendedClass` scenarios from a background-colour check to `classList.contains(…)` | Convert | `outsystems-ui-tests` | QE | M |
| **A3** | Rework the proxy assertions — colour-as-state and position-as-behaviour (**D1a / D1b / D1c**) | Convert | `outsystems-ui-tests` | QE | L |
| **A4** | Re-express the `Color` API scenarios against the runtime-resolved token; split per Examples row (**D1d**) | Convert | `outsystems-ui-tests` | QE | M |
| **A5** | Delete the residue that is genuinely appearance-only | Convert | `outsystems-ui-tests` | QE | S |
| **A6** | Hygiene track — harness defects, stale locators, turn `strict` on (613 hidden), resolve the 3 `TS2307`s, wire a type-check into CI | Fix | `outsystems-ui-tests` | tests-repo owner | L |
| **A7** | Re-run all passes with `--legacy` fixed and against a module built from current `dev` | Verify | `outsystems-ui-tests` | QE | M |
| **A8** | Add `classic-theme` to the visual-surface path list at `chromatic.yaml:76`, so a classic-only PR stops disarming the capture guard (**D2**, hardening 1 — *not* Option B) | Fix | **this repo** | OSUI | XS |
| **A9** | Record in the port workflow that the manual Storybook Theme-toggle check is the **only** gate on a port (**D2**, hardening 2) | Document | **this repo** | OSUI | XS |
| **A10** | Notify **ROU-12962**: its acceptance criterion *"the ui-tests Applitools visual run must stay green"* is unsatisfiable (**D2**) | Notify | Jira | this spike's author | XS |
| **A11** | Notify **ROU-13059**: D6's four determinism fixes are directly applicable and are root causes | Notify | Jira | this spike's author | XS |
| **A12** | **Close Q1** — classic-theme visual coverage: resurrect, replace, or accept. Evidence points at *accept*; the call is the team's. Best closed before A2 | **Decide** | — | the team | — |
| **A13** | **Answer Q14** — do we want automated visual coverage of the real composed page, and how? The one gap with no owner; needs a team outside OSUI | **Decide** | — | TBD | — |
| **A14** | **Answer Q15** — who owns the O11 a11y visual impact, before ROU-13032 closes out of PO Acceptance and takes the question with it | **Decide** | ROU-13032 / Frontend Runtime | TBD | — |

Three standing practices, not one-off actions: **G1** a scenario-count ratchet across A2–A5; **G2**
harvest the determinism fixes; **G3** keep the classic-theme control run as the default triage step.
Each is expanded below.

**Step 0a — fix `--legacy` (D7). This is the top of the list.** A third of the failure list is noise
from it, and every subsequent count is distorted until the flag is wired to a real tag expression.

**Step 0b — resolve Q9 (D5), cheaper still.** One look at the pipeline's last successful run. If the
PR gate has not compiled since 2026-08-07, that reframes the urgency of everything below it before
any of it is scheduled.

Then:

1. **Verify the Submenu underline (D4a / Q12)** — Figma first, then the SCSS history, escalating only
   if both are silent. It does not block the conversion work, but it should be settled before step 5
   decides whether those scenarios are deleted.
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
- **G2 — harvest the four determinism fixes** (A11's payload). They are independent of the theme and
  of the rewrite's fate, and they are root causes rather than symptom patches.
- **G3 — keep the classic-theme control run as standing practice.** It reattributed 182 of 337
  records in one pass, needs no new infrastructure, and is the cheapest attribution tool available.
  Make it the default first step of any future theme triage, not a special measure.

### Tickets that must be notified, not merely referenced

A finding in this document invalidates an assumption in each of these. Saying *"that is the owner's
call"* is true but passive — the owner has to **learn** of it, or discovers it only on trying to
execute.

- **[ROU-12962](https://outsystemsrd.atlassian.net/browse/ROU-12962)** (shared test-utils v2) still
  budgets Applitools as a shared-test-layer dependency, and its acceptance criteria require *"The
  ui-tests Applitools visual run must stay green"*. Per D2 that is **unsatisfiable** — the run cannot
  execute. Worth noting *why* the criterion exists: ROU-12962 was created **2026-08-10**, seven
  months after the January breakage, which is evidence the breakage is not known to the team.
- **[ROU-13059](https://outsystemsrd.atlassian.net/browse/ROU-13059)** (*Fix Flaky test 2nd
  iteration*) is the direct target for D6's four determinism fixes, which are directly applicable and
  are root causes.

## Links

- **Confluence summary of this ADR**, for the wider team:
  [*Functional tests and the new theme — testing strategy*](https://outsystemsrd.atlassian.net/wiki/spaces/RDMBLVS/pages/6871941170/Functional+tests+and+the+new+theme+testing+strategy)
  (child of *OutSystemsUI 3.0 (New Theme) — Vision*) — the conclusions and the asks; this ADR
  carries the reasoning and the alternatives. Its Markdown source is
  [`ADR-0011-confluence-summary.md`](./ADR-0011-confluence-summary.md).
- [`ADR-0004-chromatic-visual-testing-on-a-long-living-branch.md`](./ADR-0004-chromatic-visual-testing-on-a-long-living-branch.md)
  — why TurboSnap cannot be trusted here. D1 makes Chromatic load-bearing, so its correctness
  constraints become this decision's constraints: a SCSS-only PR traces to no story, so full-capture
  builds are not a preference but a requirement.
- [`ADR-0008-chromatic-baseline-builds-and-the-widget-story-dependency.md`](./ADR-0008-chromatic-baseline-builds-and-the-widget-story-dependency.md)
  — build #31, which reported green having captured nothing. That failure is what forecloses D2's
  Option C, and the capture guard it introduced is what D2's first hardening move extends to
  `classic-theme`.
- [`ADR-0009-static-widget-stories-and-zero-private-dependencies.md`](./ADR-0009-static-widget-stories-and-zero-private-dependencies.md)
  — initial-render-only capture (so hover and focus states are outside Chromatic's reach today, which
  bears on D4a) and the vendored `platform-core.css` whose pinned, partial scope is central to D1e.
- [ROU-13041](https://outsystemsrd.atlassian.net/browse/ROU-13041) — this spike.
- [ROU-12776](https://outsystemsrd.atlassian.net/browse/ROU-12776) — parent epic, *OutSystems UI -
  New theme*.
- [ROU-12872](https://outsystemsrd.atlassian.net/browse/ROU-12872) — *Integrate new theme in
  low-code*, the story that deferred this decision.
- `.github/workflows/chromatic.yaml` · `pipelines/pr-pipeline.yaml` — the two files D2 and D5 discuss
  and **neither of which this ADR changes**.
- Confluence `6264848425` (*OutSystemsUI 3.0 (New Theme) — Vision*, the parent of the summary page
  and where the O11 decision lived), `6278250633` (*Part II: Unify Storybook offering*, the
  mocked-low-code-HTML constraint), `6806241361` (the ROU-13049 comparison write-up).
- The specification, the three-pass re-run report and the two research documents behind this ADR are
  **local working documents under `specs/ROU-13041-functional-tests-theme-strategy/`**. That
  directory is gitignored and **does not ship**, which is why every figure above is written out here
  rather than cited to it. Attached to the Confluence page for anyone who needs the raw evidence.

## Date

2026-10-06
