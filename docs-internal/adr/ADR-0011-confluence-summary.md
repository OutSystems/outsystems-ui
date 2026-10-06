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

## 3. What we need, and from whom

| Ask | Who | Detail |
|---|---|---|
| **Q12 — verify the Submenu underline** | Whoever owns Submenu design | The header's hover/active underline is **gone** on the new theme — the border does not render at all. It is the one unresolved candidate in three passes, and it is **not yet established whether it is a bug or an intended redesign**. Verify, do not assume: check the ROU-12876 / ROU-12925 Figma first, then the component's SCSS history; escalate only if both are silent |
| **Q1 — classic-theme visual coverage** | The team | Left **deliberately open**. The old WebDriverIO visual suite has been unable to execute since 2026-01-19 and the Applitools licence was cut in 2024, so the real choice is **resurrect / replace / accept a two-year-old loss**, not "delete live coverage". The evidence in ADR-0011 points at *accept*, but the call is the team's |
| **Q9 and D7** | Whoever owns the tests repo's CI | **D7:** `--legacy` filters nothing — 37% of the failure list is `@legacy` rows driven against current components, so **no failure count is interpretable until it is fixed**. **Q9:** the functional PR gate's template reference does not resolve on `outsystems-ui-tests@dev` and may not have compiled since 2026-08-07. One look at the pipeline's last successful run settles it |

No Jira tickets have been filed — this spike delivers recommendations only.

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
