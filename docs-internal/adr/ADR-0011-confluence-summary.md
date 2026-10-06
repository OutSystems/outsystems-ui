# Functional tests and the new theme — testing strategy

**ROU-13041** · decided 2026-10-06 · full reasoning in **ADR-0011** (see Links)

The new theme merged without the automated tests moving with it, leaving 274 of 1,414 Cucumber
scenarios failing. The suite had been doing two jobs at once — checking that components *behave*,
and checking that they *look* a specific way. This splits them.

## 1. Who owns what, from now on

| Responsibility | Owner | What that means in practice |
|---|---|---|
| **Behaviour** — interactions, state transitions, API calls, keyboard navigation, accessibility semantics, provider integration | **Cucumber functional suite** (`outsystems-ui-tests`) | Theme-agnostic. No literal colours, no pixel positions, no font weights. State is read from the state signal — a class or attribute — never inferred from a rendered colour or coordinate |
| **Appearance** — colours, spacing, radius, typography, elevation, dark mode | **Chromatic** (this repo, `stories/`) | Already gates every PR. Full-capture builds; PR diffs reviewed, merges to `dev` advance the baseline |
| **Compilation** | `npm run build` + `npm run lint` | Unchanged |

## 2. The re-run result — both halves matter

Three full passes were run on 2026-10-02, including one against the **classic theme as a control**.

> **The 274 largely survives as a failure count — 337 records across 292 scenarios.
> Almost none of it survives as component risk — 2 candidate defect records, which are one root
> cause.**

Neither half is quotable without the other. The classic control run alone reattributed **182 of 337
records** to causes that have nothing to do with the theme. The suite is **not** flaky: 291 of 292
failing scenarios reproduced across two consecutive passes (99.7%), with retries disabled.

## 3. Action items

**No Jira tickets have been filed** — this spike delivers recommendations only. Sizes are rough and
relative. **A0a and A0b come first**: until they are done, every failure count is distorted and the
urgency of everything else is unknown.

**Three rows need a human answer rather than engineering work — A1, A12 and A0b. They are the reason
this page exists.**

| # | Action | Owner | Size |
|---|---|---|---|
| **A0a** | **D7 — fix `--legacy`, which filters nothing.** 37% of the failure list is `@legacy` rows driven against current components, so **no failure count is interpretable until this is fixed** | Tests-repo CI owner | S |
| **A0b** | **Q9 — does the functional PR gate still compile?** Its template reference does not resolve on `outsystems-ui-tests@dev` and may not have compiled since 2026-08-07. One look at the pipeline's last successful run settles it | Tests-repo CI owner | XS |
| **A1** | **Q12 — verify the Submenu underline.** The header's hover/active underline is **gone** on the new theme — the border does not render at all. The one unresolved candidate in three passes, and it is **not established whether it is a bug or an intended redesign**. Verify, do not assume: ROU-12876 / ROU-12925 Figma first, then the component's SCSS history; escalate only if both are silent | Submenu design owner | S |
| **A2** | Convert the 29 `ExtendedClass` scenarios to a class check. Mechanical, independent, cheapest large win — a good first slice | QE | M |
| **A3** | Rework the colour-as-state and position-as-behaviour assertions | QE | L |
| **A4** | Re-express the `Color` API scenarios against the runtime-resolved token | QE | M |
| **A5** | Delete the residue that is genuinely appearance-only | QE | S |
| **A6** | Hygiene track — harness defects, stale locators, turn `strict` on (613 hidden errors), wire a type-check into CI | Tests-repo owner | L |
| **A7** | Re-run the suite with `--legacy` fixed, against a module built from current `dev` | QE | M |
| **A8** | Add `classic-theme` to the visual-surface path list in `chromatic.yaml`, so a classic-only PR stops silently disarming Chromatic's capture guard | OSUI | XS |
| **A9** | Record in the port workflow that the manual Storybook Theme-toggle check is the **only** gate on a port | OSUI | XS |
| **A10** | Notify **ROU-12962** — its acceptance criterion requires an Applitools visual run that **cannot execute** | Spike author | XS |
| **A11** | Notify **ROU-13059** — four directly applicable determinism fixes are available | Spike author | XS |
| **A12** | **Q1 — classic-theme visual coverage.** Deliberately open. The old visual suite has been unable to execute since 2026-01-19 and the Applitools licence was cut in 2024, so the real choice is **resurrect / replace / accept a two-year-old loss**, not "delete live coverage". The evidence points at *accept*; the call is **the team's**. Best closed before A2 | **The team** | — |
| **A13** | **Q14 — do we want automated visual coverage of the real composed page?** The one gap with no owner: a platform- or app-level CSS change that restyles an OSUI component produces no PR in either repository, so no gate fires. Needs a team outside OSUI | TBD | — |
| **A14** | **Q15 — who owns the O11 a11y visual impact?** Decide before ROU-13032 closes out of PO Acceptance and takes the question with it | TBD | — |

Three standing practices alongside the above: a **scenario-count ratchet** across A2–A5 so a bulk
edit cannot delete a scenario where only an assertion was meant to go; **harvest the determinism
fixes**; and **keep the classic-theme control run as the default first step of any theme triage** —
it reattributed 182 of 337 records in a single pass and needs no new infrastructure.

## 4. What changes if you are writing a test tomorrow

- **Do not assert a colour, a pixel position, a border radius or a font weight.** If the thing you
  care about is how it *looks*, it belongs in a Storybook story, not here.
- **If a colour was standing in for something else — selected, active, invalid, disabled, "the class
  was applied" — replace it, do not delete it.** Most of the failing assertions are in this category,
  and deleting them removes real functional coverage.
- **Inspect the element first and confirm the property you want to assert on actually exists.** Do
  not assume ARIA: a selected Flatpickr day has a `selected` class and no `aria-selected` at all.
- **Read the *found* value, not the expected one or the cluster label.** The same message shape
  covers a harmless token rename and a removed affordance. No bulk edit is safe.
- **When triaging a theme-related failure, run the same scenario against the classic module as a
  control.** It is the cheapest attribution tool available and it needs no new infrastructure.

## Links

- **ADR-0011** — `docs-internal/adr/ADR-0011-functional-test-and-chromatic-ownership-split.md` in
  `OutSystems/outsystems-ui`. The full reasoning, the per-assertion conversion rules, the rejected
  alternatives, and the sequenced follow-up work.
- [ROU-13041](https://outsystemsrd.atlassian.net/browse/ROU-13041) — this spike ·
  [ROU-12776](https://outsystemsrd.atlassian.net/browse/ROU-12776) — parent epic ·
  [ROU-12872](https://outsystemsrd.atlassian.net/browse/ROU-12872) — the story that deferred this
- **Evidence** — the specification and the three-pass re-run report are local working documents and
  are **attached to this page**; ask on the epic channel if you need the raw JUnit artifacts.
- Two tickets need notifying, because a finding here invalidates an assumption in them:
  [ROU-12962](https://outsystemsrd.atlassian.net/browse/ROU-12962) (its acceptance criteria require
  an Applitools visual run that cannot execute) and
  [ROU-13059](https://outsystemsrd.atlassian.net/browse/ROU-13059) (four directly applicable
  determinism fixes are available).
