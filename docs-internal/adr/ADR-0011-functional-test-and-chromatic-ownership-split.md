<!-- This ADR assigns behaviour to the Cucumber functional suite and appearance to Chromatic, after the new theme left 274 of 1,414 scenarios failing -->

# ADR-0011: Functional-test and Chromatic ownership split for the new theme

## Status

**Accepted**, with two questions left open and one defect confirmed.

| Decision | Status |
|---|---|
| **D1** — the functional suite asserts behaviour, Chromatic asserts appearance | **Accepted** |
| **D2** — classic-theme visual coverage | **Open** (Q1). The evidence points at *accept the loss*; closing it is the team's call |
| **D4** — DatePicker | **Accepted** — closed, never a defect |
| **D4a** — the Submenu hover/active underline | **Confirmed regression** (Q12, closed 2026-10-06). Needs a fix under the ROU-12776 epic |
| **D5** — the functional PR gate does not compile | **Confirmed** (Q9, closed 2026-10-06). Dark since 2026-08-07, so nothing was blocking on the 274 failures |
| **D6** — the Playwright rewrite | **Evaluated, not adopted.** Whether the suite moves to it is open (Q16) |
| **D7** — `--legacy` filters nothing | **Confirmed.** No count from this suite is interpretable until it is wired |

D6 does not change D1: the behaviour/appearance split is the same decision whichever runner
executes it. D5 makes Q16 sharper — this ADR names an owner for behaviour, and that owner is a
suite whose gate has not compiled since 2026-08-07.

## Summary

- The Cucumber functional suite owns **behaviour**; Chromatic owns **appearance** (D1). This ADR
  makes that assignment — no prior ticket, ADR or Confluence decision ever did.
- Three full passes of all 117 feature files found **2 candidate-defect records, which are one root
  cause** — the Submenu underline (D4a). The other 335 records are pre-existing, cosmetic,
  environmental or harness artefacts.
- **The functional PR gate has not compiled since 2026-08-07** (D5). The 274 failures were never a
  release blocker, because nothing was blocking on them.
- Three questions stay open: classic-theme visual coverage (**Q1**), automated visual coverage of
  the real composed page (**Q14**), and whether the suite moves to the Playwright rewrite (**Q16**).
- **No Jira tickets have been filed.** The action table near the end is a proposal for whoever
  schedules the work.

## Context

### C1. The theme shipped; the tests did not move with it

ROU-12872 merged the token-based theme into `dev` and said so in its closing notes: *"Automated Tests
were not updated yet, as there some architectural decisions we might need to make. A spike was
created to tackle this."* This ADR is that spike's output.

The merge left **274 of 1,414 scenarios failing across 71 of 116 spec files**, producing 319 failure
records in the accompanying triage run. The suite is the Cucumber functional suite in
`OutSystems/outsystems-ui-tests`; no part of it lives in this repository. Those failures are the
predictable result of one suite carrying two responsibilities — verifying that components **behave**
and verifying that they **look** a specific way — where the second is now better covered, in this
repository, by Storybook plus Chromatic.

### C2. Four test mechanisms exist, not three

| Mechanism | Lives in | Triggered by | Covers |
|---|---|---|---|
| Cucumber **functional** suite | `OutSystems/outsystems-ui-tests` | `pipelines/pr-pipeline.yaml`, path-derived tags, Chrome + Safari — **but see D5** | Behaviour **and** appearance, against a real low-code app |
| WebDriverIO **visual** suite | `OutSystems/outsystems-ui-tests` | 5 pipelines, `trigger: none`, 4 monthly + 1 manual-only | **Nothing — it cannot execute** (D2). ~210 web + ~31 native checks on paper |
| Chromatic visual testing | **This repository** (`stories/`) | `.github/workflows/chromatic.yaml`, on PR to and merge into `dev` | Appearance of **115 exported stories (~113 snapshotted) across 76 files**; ODC bundle only; initial render only |
| Build + lint gates | This repository | `npm run build`, `npm run lint` | `src/` only |

Two properties matter for everything below:

- **The functional trigger is path-derived.** `pr-pipeline.yaml` builds Cucumber tags from changed
  folders under `src/scripts/OSFramework/OSUI/Pattern`, `src/scripts/OutSystems/OSUI/Patterns`,
  `src/scripts/Providers/OSUI`, `src/scss/04-patterns` and `src/scss/10-deprecated`. A change
  outside those paths runs **no** functional tests at all.
- **The appearance assertions that actually run live in `tests/functional-tests/`**, not in
  `tests/visual-tests/`. Conflating the two trees is what made D2 look like a live-coverage question.

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

- **Both halves have to be quoted together.** The 274 largely survives as a *failure count* — 337
  records across 292 scenarios against the reference's 319/274 — and almost none of it survives as
  *component risk*: 2 candidate-defect records, one root cause (D4a).
- **The scale difference is explained, not mysterious.** `--retries=0` records first-attempt truth
  where the reference allowed three Cucumber retries; the runner OS flipped 9 failures off and 6 on;
  the suite had grown to 1,418 scenarios.
- **The suite is not flaky**, and the ticket's premise to the contrary is superseded — its opening
  bullet *"OSUI Functional Tests have a lot of flaky tests"* is **struck through in Jira**, and the
  measurement agrees: **291 of 292 failing scenarios reproduced across two consecutive passes
  (99.7%)** at `--retries=0`. Three scenarios in total were session-specific.

### C4. Three structural findings condition every count in this document

1. **`--legacy` filters nothing** (D7). 123 of 337 records (**37%**) sit in `@legacy`-tagged
   scenarios, 110 (**33%**) attributable to nothing else. Until the flag is wired to a real tag
   expression, no failure count from this suite is interpretable.
2. **One scenario name can produce several failure records.** A Scenario Outline whose Examples rows
   differ only in columns absent from the title renders several `<testcase>` entries under one name —
   337 against 292 here, 319 against 274 in the reference. **The two numbers must never be compared.**
3. **The PR gate has not compiled since 2026-08-07** (D5). It fails at template resolution before any
   job is scheduled, so the 274 failures were never a release blocker, and that is how the suite
   accumulated this much drift unobserved.

## Decision Drivers

- The ticket's own reasoning: *"As Functional Tests should be theme agnostic, they make sense to be
  kept."* A suite that pins `rgb(16, 92, 239)` is not theme-agnostic.
- A green check must mean something. The suite's colour assertions are a second, weaker
  visual-regression system with no diff UI, no reviewer workflow and no per-story granularity —
  Chromatic has all three and already gates every PR here.
- Remediation must happen **once**, not on every future token or design adjustment.
- **Removing an assertion must not remove functional coverage** (D1a). This shapes most of the
  decision.
- Whatever coverage is given up must be named here, so it is owned rather than rediscovered (D1e).
- No count from this suite is interpretable until `--legacy` is separated out (D7).

## Considered Options

### A. Who owns appearance

| Option | Pros | Cons |
|---|---|---|
| **1. Re-point the expected values** to the new theme — `constants.ts` plus inline Gherkin literals | Cheapest immediate fix; preserves end-to-end coverage today | Leaves the suite theme-coupled, so the same 114 failures recur on the next palette change; ignores the ticket's concern about losing old-theme values; per D1b it would have re-pointed the DatePicker assertions to the new grey, turning a failure report into a passing test |
| **2. Bulk-delete every colour assertion**, keyed on the cluster label or a grep for `rgb(` | Fast | Wrong — per D1a it destroys functional coverage in ~79 scenarios, 29 of them `ExtendedClass` tests with nothing to do with colour |
| **3. A token-resolution hybrid** — assert a computed value resolves from a `--token-*` / `--osui-*` variable rather than equals a literal | Theme-robust in form | Closed by decomposition; see Rejected alternatives |
| **4. Split the ownership** — Cucumber asserts behaviour, Chromatic asserts appearance, converted **per assertion** rather than per cluster. **Chosen** | Removes the coupling at its source; the replacements are strictly stronger than what they replace | ~79 scenarios need individual judgement; gives up app-level visual coverage nothing else picks up (D1e) |

### B. Classic-theme visual coverage — **open**

The earlier framing was false: the question is not *"delete live coverage or replicate it?"*, because
there is no live coverage to delete. Three options, analysed in full in **D2**:

- **A. Accept the loss (status quo)** — delete the dead `tests/visual-tests/`, add no classic axis.
- **B. A classic Chromatic mode** — real, but ~3–5 days for a gain narrower than it looks.
- **C. Port-scoped snapshots** — **foreclosed**, not merely suspect.

### C. The Playwright rewrite (`outsystems-ui-tests-new`)

Analysed in full in **D6**; the adoption conditions are tabulated under **Q16**.

- **1. Adopt it** as the route out of this spike — not adoptable as it stands; seven conditions would
  have to be met first. Conditions, not disqualifications, but more than this spike can carry.
- **2. Evaluate it, name it, leave adoption open. Chosen.** An ADR cannot declare Cucumber the owner
  of behaviour while an internal repository claims near-complete parity for the same responsibility
  and the incumbent's gate does not compile.
- **3. Rule it out** on the theme-coupling evidence alone — the coupling is real but fixable, and
  ruling the rewrite out here would settle in passing a question larger than this spike, belonging
  with whoever owns ROU-12962.

## Decision Outcome

**A → Option 4. B → open (Q1). C → Option 2, with adoption left open (Q16).**

> **On the numbering:** D-numbers follow this spike's working specification so the two documents share
> labels. **There is no D3** — it was the "deliverable shape" decision (ADR, Confluence page, or
> both), paperwork rather than architecture, and is dropped. **Q15** is absent for the reason given in
> Open questions. Both gaps are left rather than closed by renumbering, which would silently break
> every number this spike's authors already use.

### D1. The functional suite stops asserting appearance; Chromatic owns visual regression

**This ADR makes that assignment**; it is not a pre-existing arrangement being written down. Research
found no Jira ticket, no ADR and no Confluence decision that ever transferred this ownership:

| Evidence | What it shows |
|---|---|
| ROU-12958 (*Add Storybook workflow and enable Chromatic visual testing*) | The only team debate, ended with an unanswered question and an alignment session whose outcome was never written down |
| ROU-12997 | Chromatic baselines were unblocked only on **2026-08-21**, five weeks before this spike |
| RPOR-10387 | A prior attempt at exactly this decision — **Discarded** |

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

**What Chromatic does not replace:**

- Real browsers and real devices — Chromatic runs one headless Chrome.
- Whole-screen and app-layout composition — **there is no layout or app-shell story in `stories/`
  at all**.
- Real low-code HTML. Confluence `6278250633`: *"all html for OutSystemsUI is made in low-code. We
  would need to mock as best as possible the low-code html to the high-code."*

#### D1a. The operation is mostly substitution, not deletion

The triage report labels its largest cluster *"Colour tokens moved — cosmetic"*. That describes **why
the assertion failed**, not **what the test was for**. The 114 colour failures resolve to **79
distinct scenarios**, and in almost all of them colour is the *observation method*, not the subject —
so deleting the assertion deletes functional coverage:

| Sub-group | Scenarios | What the scenario actually verifies |
|---|--:|---|
| `ExtendedClass …` | **29** | the custom CSS class reached the element |
| Selected / active state | ~20 | which day, dot or menu item is active |
| `Check Input Invalid state` | 4 | the input is in its invalid state |
| `IsDisabled` | 2 | the component is disabled |
| The component's `Color` API | ~10 | the value passed to the public API was applied |

The rule is therefore applied **per assertion**:

| Case | Action |
|---|---|
| A designer could change this value with no bug involved | **Delete** |
| Colour stands for a state (`selected`, `active`, `invalid`, `disabled`) | **Replace** with whatever state signal the component actually exposes — verify per component, do not assume ARIA (D1c) |
| Colour stands for "a class was applied" | **Replace** with `classList.contains(…)` |
| Colour *is* the component's public API (`Color`, `ProgressColor`) | **Replace** the literal with the token resolved at runtime |

**Pure deletion turns out to be the rare case**, and the replacements are strictly stronger:
`classList.contains('selected')` catches the DatePicker symptom the report worried about **and**
survives every future palette change, which the colour assertion does not.

Scale, for estimating — **136 call sites** in total:

| Where | Count |
|---|--:|
| Colour-constant use sites (imports excluded), across 33 files and 31 component directories | **68** — `RED_RGB_COLOR` alone is 29, nearly all in `ExtendedClass` scenarios |
| Inline colour literals in 3 `.feature` files (`ProgressBar` 22, `ProgressCircle` 26, `ProgressCircleFraction` 14) | **62** |
| Inline `.ts` literals across 3 files | **6** |

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

The only thing distinguishing them is the **found** value, so any bulk edit keyed on the expected
value, the cluster label or the file name treats them identically. **No bulk edit is safe.**

Reading the found value is necessary but **not sufficient** — the re-run supplied two sharper cases:

| Case | The message says | The reality |
|---|---|---|
| **Submenu** (D4a) | `Expected "rgb(16, 104, 235)" but found "rgb(36, 37, 40)"` — looks like a token rename | The border is **gone** (`0px none`). The found value is `currentColor` leaking through a border that does not render. The only genuine candidate defect in three passes, disguised as a colour change |
| **Carousel dot** | `found "rgb(80, 133, 234)"` — matches no token, so it classifies as suspicious | A **frame of a 200ms transition**. The new theme animates `background-color` where the classic snapped it, so the test samples mid-animation. Settled values are correct. Not a defect |

So the found value can be neither the old nor the new token for two opposite reasons — a **removed**
property or a **transient** one. Where the found value is unrecognised, **inspect the element before
classifying**: the classifier flagged 16 candidates, 14 dissolved on inspection, and the 2 that
survived were the ones whose messages looked most routine.

**The cheapest guard, and the one to institutionalise: run the same suite against the classic-theme
module as a control.** Anything failing on both themes was not caused by the theme, whatever its
message says. That single comparison reattributed **182 of 337 records** in one pass, and needs no new
infrastructure — only a run without `--branch`. Carried as **G3**.

#### D1c. The replacement signal is verified per component, never assumed

**The rule: inspect the element and confirm the property you intend to assert on still exists.**
Submenu (D4a) forces the stronger wording — `border-bottom-color` is not a property that moved; the
border it describes no longer renders, so **no swap of the literal can repair that assertion**.

An earlier draft of D1a prescribed `aria-selected` for selected state. That is not implementable for
DatePicker — inspected live on the functional-test app (2026-10-02), a selected Flatpickr day carries:

```html
<span class="flatpickr-day today selected" role="button"
      aria-label="Friday, 2 October, 2026" aria-current="date" tabindex="-1">
```

There is **no `aria-selected`**. The only state signal is the `selected` class, so the assertion is
`classList.contains('selected')`. Provider-backed patterns (Flatpickr, Splide, noUiSlider,
VirtualSelect) emit the vendor's markup, not OSUI's, so their state vocabulary is the vendor's and
varies per provider.

One family is now **closed** rather than open. For Animated Label the re-run verified the replacement
signal directly, in all four input states on both themes:

| State | Theme | parent class | `offsetTop` | `translateY` | **rendered** |
|---|---|---|--:|--:|--:|
| focus / blur, non-empty | classic | `animated-label active` | **−10** | 0 | **−10** |
| focus / blur, non-empty | new | `animated-label active` | **0** | −10 | **−10** |

The label ends up in exactly the same place on both themes, with the same `active` class and the same
12px font: the new theme moved the −10px displacement out of `top` and into a `transform`, and
`offsetTop` does not account for transforms. The animation is intact; the measurement is blind to it.
Replacement signal: `classList.contains('active')` on the `.animated-label` parent — verified on both
themes. **No design decision is needed for these 21.**

Out of scope here, but worth recording: a day that is selected yet exposes no state to assistive
technology is an accessibility gap in its own right (related to ROU-12826).

#### D1d. Not every colour literal is a theme value

The 62 inline Gherkin literals must **not** be removed wholesale. They split two ways, interleaved in
the same Examples tables:

| Kind | Example | Theme-coupled? | Action |
|---|---|---|---|
| **Parameter round-trip** — the test supplies an arbitrary colour and asserts it echoes back | `rgb(255, 82, 0)`, `#860ED4`, `#19B5FE` | **No** | **Keep.** It tests the API, not the palette, and survives any theme change |
| **Token name → RGB mapping** — the test passes a token *name* and asserts the resulting value | `\| yellow \| rgb(245, 159, 0) \|`, `\| neutral-10 \| rgb(16, 18, 19) \|` | **Yes** | Convert to the runtime-resolved token |

`yellow` and `neutral-10` are theme token names, so redefining either breaks the second kind only.
**The split is per row of the Examples table**, not per file — all three progress files contain both.

Related correction: of the **7** border-radius assertions in the suite, **6 already assert
`var(--border-radius-*)` token names rather than pixels** and need no change at all.

#### Accepted cost

The low-code application's **own** rendering — app templates, screens, layout composition — loses
automated visual coverage, because Chromatic photographs the library's stories, not a real OutSystems
app. Two qualifications:

- **What is given up is broader than the low-code app**: also lost are cross-browser rendering (real
  Safari on tablet and phone) and real-device rendering, **for both themes**.
- **This loss is already in force.** The WebDriverIO visual suite has been unable to execute since
  2026-01-19 (D2). D1 does not cause it; D1 removes the last *incidental* coverage of it.

#### D1e. Third-party CSS over OSUI components — the strongest argument against D1

Recorded as its own gap because it is the one gap D1 creates that **no mechanism in either repository
would detect**. What a user sees is not the OSUI bundle:

```
platform base CSS  (owned by Frontend Runtime, not here)
    + OSUI theme   (dist/ODC|O11.OutSystemsUI.css — the only layer Chromatic photographs)
    + app CSS      (per application, per customer)
```

The Frontend Runtime O11 team has shipped accessibility-motivated styles in that first layer which
change how OSUI components render. Those styles are **not in this repository, not in the bundle, and
not this team's to change**.

**Storybook does not close this.** It carries a platform layer — `.storybook/platform/platform-core.css`,
linked ahead of the OUI stylesheet to mirror the real load order — but it is a hand-vendored,
version-pinned snapshot: 878 lines extracted from `@outsystems/runtime-widgets-js@6.25.4`, scoped to
the *structural* pseudo-elements that make the data-attribute widgets render at all. A grep for
`focus|outline|a11y|accessib` across it returns **2** hits. It updates only when someone deliberately
re-vendors it (ADR-0009 defines the refresh trigger).

Every other accepted cost is "Chromatic covers less surface than the old suite did". This one is a
**detection gap with no owner**:

| | Would it notice a platform-CSS change that restyles an OSUI component? |
|---|---|
| Chromatic | **No** — that CSS is not in the bundle it photographs, and the vendored copy is pinned and partial |
| Functional suite, **today** | **Yes, accidentally** — it runs against the real composed app, so a changed colour or position shows up |
| Functional suite, **after D1** | **No** — those are exactly the assertions D1 removes |
| `npm run build` / `npm run lint` | No |
| PR gate in either repository | **No — there is no PR in either repository.** The change lands in a third team's codebase |

Every other failure mode in this document is triggered by a commit somebody makes here or in the
tests repo; this one has no commit in either, so no gate anywhere is invoked.

**D1 still holds**, for three reasons:

- What the functional suite provides here is real but poor — it surfaces the change as a colour or
  coordinate mismatch with a misleading message, the Submenu pattern of D1b exactly. An accidental
  gate that happens to sit in the right place, not a good one.
- Re-pointing the colour literals would not help: the next platform change breaks them again, and the
  suite still could not say whether the cause was OSUI or the platform. Attribution needs a
  purpose-built A/B comparison, which is precisely what a colour assertion cannot do.
- The Playwright rewrite (D6) ships **1,398 tests with no visual suite and no Flatpickr colour
  assertions** and still claims scenario parity — a working demonstration at a scale no argument here
  matches, with D6's caveat that one dropped assertion was load-bearing.

**The gap is structural for future changes; the instance that prompted it is already assessed.**
ROU-13032 (*[OSUI] - Validate impact of a11y widget improvements on UI Patterns*, Spike, currently
**PO Acceptance**) measured it, and three findings bound the risk more tightly than the above implies:
the O11 Frontend team's changes unblock **WCAG 2.2**, are **off by default** and affect **O11 Reactive
only**; the root cause is a specificity collision rather than an arbitrary restyle (*"New selectors are
more specific than the ones defined at UI framework for both themes"*); and **the functional side came
back clean**, so the impact is **visual-only** — a point *for* the ownership split, not against it.
Its method is the reusable part and the cheapest known answer to **Q14**: sample screens built with
the feature ON and OFF for both themes, screenshotted as deployed pages with Playwright and diffed —
a visual run against a *real composed* page, done ad hoc by one person without Applitools, SauceLabs
or any part of the broken harness, which suggests **replacing the dead visual coverage may be far
cheaper than resurrecting it**. What stays open there is **governance, not detection**, and it is
ROU-13032's to close, not this spike's — though it is at risk of evaporating, since that ticket sits
in PO Acceptance carrying the sentence that would close it unresolved (*"the goal of this task has
been achieved […] what comes out from now on should be defined by [others]"*). Note finally that
ROU-13032, the DatePicker spot-check and ROU-13049 are **three** appearance findings that arrived from
deliberate manual work rather than from any suite, and that cross-team notification, while it does
work, is the ordinary best-effort Slack/email channel — which is why **Q14's cadence must be
time-based, not event-triggered**.

What is left open is **Q14** — how a future change of this kind gets detected at all. Who fixes the
*current* instance is not open: it belongs to ROU-13032 and the Frontend Runtime team.

### D2. Classic-theme visual coverage — **OPEN**

**Status: unresolved.** This ADR states the question and its consequences; it does not settle it (Q1).

**Established fact: the WebDriverIO visual suite cannot execute, and has not been able to since
2026-01-19.** Two independent causes, either sufficient alone:

1. **The runner is structurally broken.** The Applitools Eyes WebdriverIO service is registered in no
   config, yet every visual scenario's `Before` hook calls `Applitools.setViewportSize(...)`, whose
   first statement is `driver.eyesGetConfiguration()` — a custom command only that service adds. Every
   visual scenario fails in setup before a screenshot is taken. Introduced by commit **`6ff316c`
   (2026-01-19, PR #521)** as collateral of a dependency modernization; the tests repo's own ADR-0004
   documents it as known and deliberately deferred, and no follow-up fix exists.
2. **The licence was cancelled.** Three Confluence pages (2024-05-07) carry *"Given that the
   applitools license was cut based on costs, we needed to disable all code pipelines for visual
   tests!"*. ROU-12492, which proposed migrating off Applitools, was **Discarded on 2026-09-30**.

Authoring stopped earlier still: `git log -- tests/visual-tests/` shows **0 commits in 2024 and 0 in
2025**, while the repository took 86 and 43 commits in those years. **So the real choice is: resurrect,
replace, or accept a loss that has already been in force for roughly two years unnoticed.**

**Option A — accept the loss.** Delete `tests/visual-tests/` — ~721 lines of Gherkin and ~177 of
TypeScript, none of which can execute — and add no classic axis to Chromatic. Nothing that currently
runs is lost: no live signal, no baseline reviewed since 2023, no pipeline going from green to absent.
The real gap is the **port workflow**, and it is worse than it looks: a `/port-to-classic` change triggers **zero** functional
tests, and `classic-theme/` is excluded from Chromatic's visual-surface detector
(`chromatic.yaml:76` diffs only `src stories .storybook`). Its only verification today is grep
invariants plus a human flipping the Storybook Theme toolbar by hand. Neither `npm run build` nor
`npm run lint` reaches the classic tree: the build emits `src/` → `dist/` only, lint covers `.ts`, and
there is no SCSS behind the snapshot to be correct — it is three checked-in files.

**Option B — a classic Chromatic mode.** The mechanism **already ships on `dev`**: `.storybook/main.ts`
serves `classic-theme/` at `/classic-theme` (so the CSS is already inside every `storybook-static`
published to Chromatic), `preview-head.html` gives the stylesheet link an `id`, and `preview.ts`
defines `THEME_HREF = { new, classic }`, `applyTheme()` and a `theme` toolbar global with exactly
`new` / `classic`. The route is a `chromatic.modes` entry over that global — roughly ten lines.

- **Effort: ~3–5 engineering days.** The non-trivial part is a **stylesheet-load race**: `applyTheme`
  sets `href` synchronously and `storyFn()` runs on the next line, but parsing a 780 KB stylesheet is
  async — this repository has already been bitten by that failure class with fonts.
- It also needs the classic cell disabled on the 13 token-dependent docs pages, since the classic
  snapshot contains **0** `--token-*` declarations against 5,642 in `dist`.
- **Recurring cost:** ~113 extra snapshots per build across ~178 builds/month, doubled PR review
  surface, and a *guaranteed* classic no-op diff on every token change.

**Option B's gain is narrower than it looks**, for five reasons:

1. **It would have caught 0 of the 4 ports ever made.** Those ports target `.layout-side-no-header`,
   `.app-menu-content`, `.app-login-info` and `.application-name`, and there is no layout or app-shell
   story in `stories/` at all. Every historical port would have been a silent pass.
2. **It gates half of each port.** Only the ODC bundle is ever loaded; `classic-theme/O11.*.css` is
   served but never linked, and every port must patch both.
3. **Initial render only** (ADR-0009) — hover, focus and expanded states are invisible to it.
4. **It is a hybrid, not the classic theme.** `classic-theme/` has no JavaScript and
   `preview-head.html` loads the new-theme JS unconditionally, so "classic mode" is new-theme runtime
   plus old-theme CSS. Defensible as a CSS-regression gate; it must not be called "the classic theme
   under test".
5. **Observed port frequency is zero.** Only 2 commits have ever touched `classic-theme/` — the import
   and a one-line version-banner bump.

**Option C — port-scoped snapshots: foreclosed, with named evidence.** ADR-0008 records Chromatic
build #31 reporting *"✅ Passed — 0 visual changes, 103 tests unchanged"* while capturing nothing and
shipping a real regression unflagged. Its generalisable sentence: *"`externals` classifies entries in
the changed-file list, and the list itself was empty. The protection sits one layer above the
failure."* Option C is built on precisely that mechanism, and `classic-theme/**` was already an
`externals` entry in ADR-0004 — the team already treated a classic change as untraceable.

**The one identified flip condition has been resolved, toward Option A.** The biggest swing factor on
Q1 was whether **O11 adopts the new theme at all**, carried as an explicit `OPEN DECISION` on the
Vision page (Confluence `6264848425`). **Answered by the ticket assignee on 2026-10-02: yes, O11
adopts the new theme.** Both targets converge, so the classic snapshot is not the long-term surface
for the larger install base.

**One hardening move that is *not* Option B**, recommended under Option A (**A8**): keep the manual
Storybook Theme-toggle check as the prescribed port verification, and **state plainly in the port
workflow that it is the only gate**. A port hand-edits ~775 KB of compiled CSS in two bundles with no
compiler, no lint, no test and no visual gate behind it; the person doing that should not have to
infer that nothing else is watching.

> A second move — adding `classic-theme` to the visual-surface path list at `chromatic.yaml:76` — was
> proposed and **withdrawn**. That guard asserts a comparison actually happened when something changed
> that *can move a snapshot*; a change under `classic-theme/` cannot, because no story loads that CSS.
> Adding the path would make the guard assert something vacuous and would encode the false claim that
> `classic-theme/` is part of the visual surface Chromatic covers. If Option B is ever adopted, the
> path belongs in that list as part of that work — not before.

**Not open under any outcome:** the `@legacy` / `@skipLegacy` **functional** stages in
`pr-pipeline.yaml` stay exactly as they are. They exercise legacy **components**, not the old theme's
appearance — different axes.

**What would still need to be true for Option B:** a reason to expect ports to resume, **and** an
app-layout story group to exist (ROU-13043 / ROU-12973) so a classic axis would cover the selectors
ports actually touch. Two further live spikes could unfreeze the snapshot on a different axis —
ROU-12972 (*single SCSS tree for multiple Design Systems and Themes*) and ROU-13058 (*splitting CSS
across multiple themes*).

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
folds into the colour cluster — the found value is the new blue, and the `webkitTextFillColor` half of
the **same assertion matches expected exactly**:

```
"2026-9-9" is not selected.
Background color    !== rgb(16, 104, 235) (found rgb(16, 92, 239))     ← the new blue
webkitTextFillColor !== rgb(255, 255, 255) (found rgb(255, 255, 255))  ← identical to expected
```

What misleads is the step's message prefix: `"<date>" is not selected.` is printed whenever the colour
comparison fails, whatever the reason. And *date restrictions* **passes now**, month arrows included.

**DatePicker rejoins the ordinary conversion work. No bug to file, no pause to maintain.**

**A general warning, not a DatePicker qualifier.** The module used for the re-run,
`AT_OSUIFunctional_ROU13036`, **is not built from current `dev`** — `Video: URL with file extension
keeps source type` fails only there because that module's `VideoURL` input has `maxlength="50"` where
the unbranched one has `500`. There is no "new-theme module" to refresh; `ROU13036` is an unrelated
ticket's branch module that happens to carry the new theme. **Treat any single theme-attributed
failure as provisional until the same staleness check is made** (A7).

#### D4a. The Submenu underline is a real defect

On the new theme the Submenu header loses its hover/active underline, and the sub-title loses its
`text-decoration` with it. Verified 2026-10-06: **the removal was not intended. This is a theme
regression and it needs fixing** — the only defect three full passes found. It belongs to this
repository, under the ROU-12776 epic, and is action item **A1**.

### D5. The functional PR gate is not running at all — **confirmed**

**Q9 is closed.** The PR pipeline run for the pull request carrying this ADR failed at template
resolution:

```
/pipelines/pr-pipeline.yaml: Could not find
/pipelines/templates/build-and-execute-functional-tests-template.yml
in repository outsystems-ui-tests hosted on https://github.com/
using commit 6811bea4d3351f2b238d056574d7811bab226f98.
GitHub reported the error, "Not Found"
```

**The mechanism.** `pipelines/pr-pipeline.yaml` declares the `outsystems-ui-tests` repository resource
**with no `ref:`**, so it resolves against that repo's default branch, `dev`. All four test stages
call `./pipelines/templates/build-and-execute-functional-tests-template.yml@outsystems-ui-tests`, and
that path does not exist there — the file lives at
`pipelines/templates/steps/build-and-execute-functional-tests-template.yml`, moved by commit `5d7d688`
(ROU-12581, **2026-08-07**). Azure resolves templates at queue time, so a missing path means the
pipeline fails to **compile**, not to fail tests. The commit named in the error above is the tests
repo's current default branch, which rules out the two alternative explanations: the definition does
point at this YAML, and it is not pinned to another branch.

Three independent signals agree:

1. **The referenced path does not exist**, confirmed in both checkouts.
2. **The tests repo has no PR-triggered pipeline at all**, and everything still running there migrated
   to a `templates/stages/` structure. `pr-pipeline.yaml` alone still points at the pre-migration
   layout.
3. **The file is frozen** — last modified **2023-05-30**.

The one piece of counter-evidence is gone: build 2175929 did produce test results, but the ticket
assignee confirmed (2026-10-06) it was a **manual** run.

**What follows:**

- **The 274 failures were never a release blocker, because nothing was blocking on them.** The
  accurate framing is *pay down a suite that stopped being consulted*, not "unblock the release" —
  and it explains how the suite accumulated this much drift unobserved.
- **The gate has been dark since 2026-08-07**, which is the window in which the theme merged and 274
  scenarios started failing.
- **This is the most urgent item in this document, and not the one anybody expected.** Every
  conversion step below assumes a gate that will eventually run the converted suite; there is none
  today. The fix is one line (**A0b**).
- **The constraint that this spike changes no pipeline file must not be read as preserving a broken
  reference.** That constraint keeps the spike narrow; the fix belongs in a separate change and should
  not wait on any conversion work.

### D6. The Playwright rewrite — evaluated here, adoption **OPEN** (Q16)

`OutSystems/outsystems-ui-tests-new` (package `osui-play`) is a 19-day, single-author Playwright
reimplementation of the Cucumber suite. It reaches near-total scenario parity (**1,376 matched / 1
missing / 37 native-only** against 1,414) and runs the non-legacy Chromium suite in minutes rather
than hours. It has no ADR, no CONTRIBUTING, no CODEOWNERS, no PRs, no second contributor and no Jira
issue sanctioning it. Its theme coupling is wider than the incumbent's, quantified in Q16 item 1.

Two reasons it is not a route out of this spike:

- **Adoption is not a repository swap.** The functional suite is invoked **cross-repo** from this
  repository through a template the tests repo owns, and results publish as **cucumber JSON**;
  Playwright emits JUnit. Adoption needs a new cross-repo template contract and a replacement for the
  `PublishCucumberReport@1` stage. Both its CI definitions are manual-only today.
- **A competing, documented initiative pulls the other way.** ROU-12962 (Tech Investment, To Do)
  commits `outsystems-ui-tests` and three sibling suites to a shared **WDIO + Cucumber** test-utils
  v2. Adopting Playwright here would strand that work, since the plan's value comes from all four
  converging — and the rewrite's `native/` tree has already forked that shared layer into a third
  divergent copy.

**Five assets are worth harvesting regardless**, none requiring adoption:

| Asset | Value | Caveat |
|---|---|---|
| `scripts/parity-audit.mjs` | A scenario-count ratchet — exactly the guard that bulk assertion removal across 71 files needs | Broken on Windows (path-separator regex); needs the old repo as a pinned sibling checkout |
| 4 determinism root-cause fixes | Root causes rather than symptom patches; serve **ROU-13059** directly | Two of the four are browser-specific |
| The branch-suffix regex `/(ROU-?\d+)/i` | A one-line fix for the branch-naming defect | None |
| `URL` / `PW_URL` base-URL override | An ODC escape hatch the old repo lacks; ODC work is live in this epic | None |
| Evidence for D1's premise | 1,398 tests, no visual suite, parity retained | One dropped assertion was load-bearing (D4) |

**The four determinism fixes**, written out so the hand-off to ROU-13059 carries content. Of nine
fixes across the rewrite's five flakiness commits, seven are real determinism work and these four are
root causes:

| Root cause | Fix | Commit |
|---|---|---|
| WebKit ignores forced clicks on the flatpickr AM/PM `span` | `dispatchEvent('click')` instead of `click({ force: true })` | `d3b3c46` |
| The `msedge` project runs Chromium, but the app reads the `Edg/` user agent | Key expectations off the project name, not the engine | `d3b3c46` |
| WebKit does not re-layout the gallery on a runtime resize | Open the page **inside** the viewport change, not before | `d3b3c46` |
| Firefox computes a `backface-visibility: hidden` rotated container as hidden | Assert on `[id*="-CardBack"]`, not `[id*="-FlipContainer"]` | `a70c1f9` |

These are browser behaviours, so the **analysis** transfers to the Cucumber suite directly; the code
does not, since Playwright's API differs from WebdriverIO's. They are also not equally applicable: the
PR gate runs Chrome and Safari, so the two WebKit items map straight onto Safari, while the Edge and
Firefox items only matter if the scheduled or manual pipelines run those browsers. Check the browser
matrix before promising all four.

**Not worth taking:** the `native/` tree (a stale fork carrying a byte-identical `constants.ts` with
180 palette references — it *duplicates* the theme coupling) and the page-object layer (34 of 35
objects have zero importers).

#### Q16 — should the functional suite move to the rewrite at all? **Open.**

The rewrite does not change **D1** — the behaviour/appearance split is the same decision whichever
runner executes it — but that is not the same as "there is nothing to decide". What makes it live:

- **The incumbent is not running.** D5 is confirmed, which weakens the strongest argument for the
  incumbent: that it is the thing that actually runs.
- **The parity claim is not trivial.** 1,376 of 1,414 scenarios matched, 1 missing, 37 native-only,
  and the non-legacy Chromium suite completes in minutes rather than hours.
- **Three directions compete and no one has chosen**: stay on WDIO + Cucumber as-is, converge on
  ROU-12962's shared test-utils v2, or move to the rewrite. Doing nothing picks the first by default.

**What the rewrite would have to change to be adoptable** — conditions, not disqualifications:

| # | Gap today | What would have to change | Size |
|---|---|---|---|
| **1** | **No shared palette seam.** `constants.ts` was inlined into 105 colour literals across 28 of 43 spec files, 50 of them theme-derived, none in `src/`. A theme change that today means editing **one file** would mean editing **28**. `RED_RGB_COLOR` is declared identically in 23 spec files and `BASE_PADDING` in 22, and naming drifted — `BLUE_RGB_COLOR`, `PIKA_SELECTED_BG` and `SELECTED_DAY_RGB_COLOR` all hold `rgb(16, 104, 235)` — so only a search by value finds them | **Apply D1 there, not a palette module.** Most of those 50 literals should not survive the behaviour/appearance split at all; they convert or get deleted, exactly as A2–A5 do here. This also shrinks the "coupling widens from one file to 28" objection to the handful of parameter round-trip values D1d says to keep, which are fine distributed — so it is a reason to sequence D1 before adoption, not a reason the rewrite is structurally wrong | M |
| **2** | **Parity is measured by title, not by assertion.** 1,376 of 1,414 matched, but it never ported the colour assertion for the current flatpickr widget, verifying selection through the input's text value instead. Its better DatePicker pass rate is partly a dropped check | **Extend `parity-audit.mjs` to compare assertions, not just scenario names**, and reconcile every gap. Until then the parity number cannot carry the weight the adoption case puts on it | M |
| **3** | **Manual-only CI, wrong report format.** Both pipeline definitions are manual; results publish as JUnit where the cross-repo contract consumes cucumber JSON through `PublishCucumberReport@1` | **A PR-triggered pipeline, plus either a cucumber-JSON reporter or a replacement publish stage**, and a cross-repo template this repository can call | M |
| **4** | **No governance trail.** No ADR, CONTRIBUTING, CODEOWNERS or PRs; one author; no sanctioning Jira issue | **CODEOWNERS, a PR-based workflow, and a sanctioning ticket.** Cheap, and it makes the rest reviewable rather than a matter of trust | S |
| **5** | **`native/` is a stale fork.** 117 files differing by ~1,629 lines, older WDIO pins with no `resolutions` block, excluded from `tsconfig.json` so never type-checked, byte-identical `constants.ts` with 180 palette references | **Delete it or re-sync it.** As it stands it duplicates the coupling item 1 removes | S–M |
| **6** | **An unused page-object layer.** 34 of 35 objects have zero importers; everything funnels through one 1,028-line `functional-page.ts`. `src/utils/tags.ts` is unreferenced and its `@smoke` tag appears zero times | **Use the layer or delete it.** A single 1,028-line object is a maintainability risk at 1,398 tests | S |
| **7** | **Reconciliation with ROU-12962.** Four suites are committed to a shared WDIO + Cucumber test-utils v2; the rewrite pulls a third way | **Argue it against ROU-12962 explicitly**, not in isolation. Either the rewrite is the better target for all four suites, or it is not adopted here | — |

**This spike does not answer Q16, and should not.** Two sequencing constraints: **ROU-12962 is
consulted first**, because whoever owns the shared layer has the larger stake; and **D1 is applied
before adoption, not after**, or the A2–A5 conversion work has to be repeated at 28 times the spread.
Tracked as **Q16** / **A13**.

### D7. `--legacy` filters nothing, and no count is interpretable until it does

Found by the re-run, not by the triage report. It outranks every other harness defect because it
distorts the input to every decision in this document.

The tests repo's own `CLAUDE.md` states: *"With `False`, test examples tagged `@legacy` are skipped;
with `True`, test examples tagged `@skipLegacy` are skipped."* **Neither happens.**
`configs/wdio-shared-conf.ts` hard-codes `tagExpression: ''`, and nothing converts the `--legacy`
value into a tag expression — the flag reaches `driver.config.isLegacy`, where its only effect is
appending the `_OLD` page-name suffix for page objects that opt in.

The consequence is systematic, because ADR-0005 splits legacy from non-legacy at the **Examples**
level — one Scenario Outline carrying two blocks that differ only in the element ids they feed, so
with the filter inert **both** blocks run and the `@legacy` rows drive legacy ids against the current
test page:

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

- **Scale: 123 of 337 failure records (37%)** sit in `@legacy`-tagged scenarios, **110 (33%)**
  attributable to nothing else.
- It explains the reference report's *"13 from a `ShowPips` control that never existed"* — `ShowPips`
  is a real parameter **of the legacy Range Slider**, used only in `RangeSliderLegacy.feature`, whose
  scenarios open the same page as the non-legacy file.
- The reference's *"67 stale locators, verified identical on un-branched master"* was a correct
  observation with the wrong root cause: 58 of the re-run's 82 are this, not dead selectors.
- **Any count quoted from this suite — the 274, the 337, every per-cluster figure — must say whether
  the `@legacy` rows were separated.** The re-run separates them per scenario; the reference did not.

Wiring `--legacy` to a real tag expression removes a third of the noise from every future triage,
which is why it is **A0a**, at the top of the sequence.

### What this does *not* claim

- **No cause is claimed for the residual unattributed failures beyond what was measured.** The re-run
  reduced them from 9 records to **1** in 337, and the 21 element timeouts resolved to **5**, 14 of
  the original being downstream of D7 rather than of the theme.
- **The suite is not claimed to be flaky** — see C3, 291 of 292 at `--retries=0`.
- **The Gallery/Carousel "layout shift" is not theme-caused.** It fails identically on the classic
  baseline, and at the same viewport both themes give `grid-template-columns: 427.75px ×4`,
  `gap: 16px`. Every failing Gallery case is *nested*, where the container decides the column count;
  the assertions are over-specified and were already failing. No design confirmation needed.
- **The "module not branched" 404s prove nothing about staleness.** `getURL()` appends the branch
  suffix to **every** module name, including `Platform_FunctionalTests`, which only ever exists
  unbranched, so it 404s whenever `--branch` is passed at all.

### Rejected alternatives

The option tables above carry the full comparison. Three rejections need reasoning not stated there:

- **The token-resolution hybrid** (A3) — a global smoke check that a computed value resolves from a
  `--token-*` / `--osui-*` variable. **Closed by decomposition.** Per-element comparison against a
  runtime-resolved token *is* adopted, but only where the token is the component's own public API
  (A4) — not as a general pattern. A *global* "did the theme load" check is **not** adopted: a
  theme-agnostic suite must by construction give the same answer on either theme, so the check is
  obsolete exactly when the conversion it protects completes, and it would obstruct the classic
  control run that D1b establishes as the cheapest attribution tool available. What the idea reached
  for was **interpretability of a run**, answered by one log line in **A6**.
- **Executing the remediation inside this spike** — landing the assertion removal in
  `outsystems-ui-tests` under this ticket. A single PR to review, but it mixes a decision needing team
  agreement with mechanical changes across 71 files in another repository.
- **Adopting the Playwright rewrite** as the route out — see D6 and Q16.

**The classic Chromatic story set is not in this list.** It is a live option under D2 (Q1), not a
rejected alternative.

## Recommended next steps

**No Jira tickets have been filed for any of this.** The table below is a proposal for whoever
schedules the work; sizes are rough and relative, not estimates. **A0a** and **A0b** come first:
until `--legacy` is wired, every count is distorted (D7); until the template reference is fixed, there
is no functional gate at all (D5), and every conversion row assumes one that will eventually run.

| # | Action | Type | Where | Owner | Size | After |
|---|---|---|---|---|---|---|
| **A0a** | Wire `--legacy` to a real tag expression — it currently filters nothing (**D7**) | Fix | `outsystems-ui-tests` | tests-repo CI owner | S | — |
| **A0b** | **Fix the stale template reference in `pipelines/pr-pipeline.yaml`** — point it at `templates/steps/…` or the `templates/stages/` structure everything still running uses. One line (**D5**) | Fix | **this repo** | tests-repo CI owner | XS | — |
| **A1** | **Restore the Submenu hover/active affordances** — the header's `border-bottom` and the sub-title's `text-decoration`. A confirmed theme regression, the only defect three passes found (**D4a**, Q12) | Fix | **this repo** | OSUI | S | — (must land before A5, which would otherwise delete the scenarios that caught it) |
| **A2** | Convert the 29 `ExtendedClass` scenarios from a background-colour check to `classList.contains(…)`. Mechanical, independent of every other row — the cheapest large win and a good first slice | Convert | `outsystems-ui-tests` | QE | M | A0a; A11 best closed first |
| **A3** | Rework the proxy assertions (**D1a / D1b / D1c**). Two families, same treatment: *colour as proxy for state* (selected day, active dot, active menu item, `Invalid state`, `IsDisabled`) → the signal the component actually exposes, **inspected first**; *position as proxy for behaviour* (Animated Label `offsetTop`, Gallery and Carousel Y-coordinates) → the state signal the animation or advance sets. Per-scenario judgement, with the **found** value read | Convert | `outsystems-ui-tests` | QE | L | A0a |
| **A4** | Re-express the `Color` API scenarios (Progress Bar, Progress Circle) against the runtime-resolved token. These cannot simply be deleted — the scenario would then assert nothing. Split per Examples row (**D1d**): token-name rows convert, arbitrary round-trip colours stay | Convert | `outsystems-ui-tests` | QE | M | A0a |
| **A5** | Delete the residue that is genuinely appearance-only, now that Chromatic owns it | Convert | `outsystems-ui-tests` | QE | S | A1–A4 |
| **A6** | Hygiene track — see the list below | Fix | `outsystems-ui-tests` | tests-repo owner | L | — |
| **A7** | Re-run all passes with `--legacy` fixed and against a module built from current `dev`. A purpose-made module removes a whole class of false attribution (**D4**) | Verify | `outsystems-ui-tests` | QE | M | A2–A5 |
| **A8** | Record in the port workflow that the manual Storybook Theme-toggle check is the **only** gate on a port (**D2**) | Document | **this repo** | OSUI | XS | — |
| **A9** | Notify **ROU-12962**: its acceptance criterion *"the ui-tests Applitools visual run must stay green"* is **unsatisfiable** — the run cannot execute (**D2**). It still budgets Applitools as a shared-test-layer dependency, and was created **2026-08-10**, seven months after the January breakage, which is evidence the breakage is not known to the team | Notify | Jira | this spike's author | XS | — |
| **A10** | Notify **ROU-13059** (*Fix Flaky test 2nd iteration*): D6's four determinism fixes are directly applicable and are root causes, independent of the theme and of the rewrite's fate | Notify | Jira | this spike's author | XS | — |
| **A11** | **Close Q1** — classic-theme visual coverage: resurrect, replace, or accept. Evidence points at *accept*; the call is the team's | **Decide** | — | the team | — | best before A2 |
| **A12** | **Answer Q14** — do we want automated visual coverage of the real composed page, and how? The one gap with no owner; needs a team outside OSUI | **Decide** | — | TBD | — | — |
| **A13** | **Answer Q16** — move to the Playwright rewrite, converge on ROU-12962's shared layer, or stay as is? Doing nothing picks the third by default. Needs its own evaluation, argued against ROU-12962, starting from D6's conditions table | **Decide** | ROU-12962 owner + QE | TBD | — | — |

**A6 in detail**, independent of the theme — stale locators, unbranched module references, the OS
assertion, mobile gestures on desktop, plus:

- `--cucumberOpts.tagExpression` silently consumed as a positional argument after `--`.
- The **inverted** branch defect: `--branch=ROU-12872` works and `--branch=ROU12872` — the form the
  repo's own README and `CLAUDE.md` instruct users to pass — 404s. D6's one-line regex fix applies.
- `junit-results/` accumulation is **local-only**; CI cleans it, the local config has no such hook.
- The "Unstable" label on every failure, emitted for any scenario lacking a `@bug` tag — of which
  there are **zero live**, so the downstream known-issue triage branch is unreachable.
- The suite will not install or run with the default Yarn setup: `corepack yarn` plus
  `YARN_NODE_LINKER=node-modules` is required on every invocation, and a committed `.yarnrc.yml`
  would remove the problem entirely.
- The headless viewport is **929px** tall, not the ~1080 that eleven Notification scenarios assume
  when they assert absolute pixel ranges.
- **Log which theme stylesheet the target module served.** Not a gate and not an assertion — one line
  in the run output. The reference report never recorded it, and that single omission is why this
  exercise spent days unable to say whether a failure had been measured against the new theme or the
  classic one.
- **TypeScript and lint posture.** The triage report's **98 `tsc` errors and 183 ESLint errors** were
  accurate for its checkout (`b50f1a6`, 2026-08-11) and **have since been paid down** by `79d45c6`
  (*ROU-12969*, 2026-09-16, 77 files, +478/−321); measured at `9c77637` (2026-10-01) the counts are
  **3** and **0 in scope**. What remains: **`strict` is off**, hiding **613** errors; the 3 live
  errors are `TS2307` on `@wdio/protocols`, pinned in `resolutions` but never declared as a
  dependency; and **no pipeline runs either gate**, so the count can grow again unseen.

### Three guards worth adopting alongside the sequence

- **G1 — a scenario-count ratchet for A2–A5.** Bulk removal across 71 files risks deleting a
  *scenario* where only an *assertion* was meant to go, and nothing in `outsystems-ui-tests` checks
  for that today. D6's `parity-audit.mjs` does exactly this at title level.
- **G2 — harvest the four determinism fixes** (A10's payload).
- **G3 — keep the classic-theme control run as standing practice** (D1b). It reattributed 182 of 337
  records in one pass and needs no new infrastructure. Make it the default first step of any future
  theme triage, not a special measure.

## Open questions

The `Q` numbers come from this spike's working specification, which is local and **does not ship**;
they are defined here so the ADR stands on its own.

| ID | Question | Status | Where |
|---|---|---|---|
| **Q1** | Do we keep any visual coverage of the classic theme — resurrect it, replace it, or accept a loss already two years old? | **Open.** Evidence points at *accept*; the call is the team's. Best closed before the conversion work starts | D2, **A11** |
| **Q9** | Does the functional PR gate still compile? | **Closed 2026-10-06 — it does not**, and has not since 2026-08-07. Confirmed by the pipeline run on this ADR's own pull request | D5, **A0b** |
| **Q12** | Is the removed Submenu hover/active underline a bug or an intended redesign? | **Closed 2026-10-06 — a bug.** A real theme regression, and the only one three full passes found | D4a, **A1** |
| **Q14** | Do we want automated visual coverage of the real composed page, and if so how? | **Open.** The one gap with no owner; needs a team outside OSUI, and the cadence has to be time-based rather than triggered by notification | D1e, **A12** |
| **Q16** | Does the functional suite move to the Playwright rewrite, converge on ROU-12962's shared WDIO + Cucumber layer, or stay as it is? | **Open**, and raised by this ADR rather than inherited. Doing nothing picks the third by default | D6, **A13** |

Two questions the specification carried are **not** open and are deliberately absent: whether to adopt
a global token-resolution smoke check (closed by decomposition — see Rejected alternatives), and who
owns the visual impact of the O11 accessibility styles (closed as a split: the fix belongs to
ROU-13032 and the Frontend Runtime team, not to this spike — see D1e).

## Links

References are given by name and identifier rather than as links, because this repository is public
and the systems below are internal.

**Related ADRs in this directory** — D1 makes Chromatic load-bearing, so the guarantees these record
become this decision's constraints (NFR4):

- **ADR-0004**, *Chromatic visual testing on a long-living branch* — why TurboSnap cannot be trusted
  here, and therefore why full-capture builds are a requirement.
- **ADR-0008**, *Chromatic baseline builds and the widget-story dependency* — build #31, green having
  captured nothing. Forecloses D2's Option C and is the guard behind D2's withdrawn hardening move.
- **ADR-0009**, *Static widget stories and zero private dependencies* — initial-render-only capture
  (bears on D4a) and the vendored `platform-core.css` central to D1e.

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

**Working documents** — the specification, the three-pass re-run report and the two research documents
behind this ADR are local only, under a gitignored `specs/` directory, and **do not ship**. That is
why every figure above is written out here rather than cited to them. They are attached to the
Confluence page for anyone who needs the raw evidence.

## Date

2026-10-06
