<!-- This ADR documents why Chromatic baseline (push) builds have never run on ROU-12714, why the reusable-action fix is unavailable to a public repo, and the open question of removing the internal widget-package dependency -->

# ADR-0008: Chromatic Baseline Builds on `ROU-12714` and the Widget-Story Dependency

## Status

Proposed — section **A** and section **B → Option 1** are accepted and implemented (commit `d6a895d97`); section **C** is open pending a call on the widget stories.

## Context

ADR-0004 enabled Chromatic for the "Make Great UI" initiative: PRs into `ROU-12714` get a visual diff, and merges to `ROU-12714` advance the baseline via `autoAcceptChanges: '{dev,ROU-12714}'`. The first half works. **The second half has never run once.**

### C1. Baseline builds fail at authentication, and always have

Every `push`-triggered run of `.github/workflows/chromatic.yaml` has failed: **0 successes out of 9**, against 7 of 9 for `pull_request`. All of them die in `🔐 Azure login`, before Chromatic starts:

```
AADSTS700213: No matching federated identity record found for presented assertion
subject 'repo:OutSystems/outsystems-ui:ref:refs/heads/ROU-12714'
```

The OIDC subject differs by event, and federated identity credentials (FICs) match subjects **exactly**:

| Repo / event                                | Subject presented                                              | Result |
| :------------------------------------------ | :------------------------------------------------------------- | :----- |
| `outsystems-ui` — pull_request              | `repo:OutSystems/outsystems-ui:pull_request`                    | ✅     |
| `outsystems-ui` — push to `ROU-12714`       | `repo:OutSystems/outsystems-ui:ref:refs/heads/ROU-12714`        | ❌     |
| `runtime-mobile-widgets-js` — push to `main`| `repo:OutSystems/runtime-mobile-widgets-js:ref:refs/heads/main` | ✅     |

The app registration behind `OSUI_AZURE_CLIENT_ID` has a credential for the `pull_request` subject and none for any branch subject. This is a registration-inventory gap in Entra, not a repository defect — nothing in this repo can fix it.

Consequence: `ROU-12714` has **no Chromatic baseline of its own**. Merges never advance it, so PR builds are compared against whatever ancestor build Chromatic can find elsewhere.

### C2. The missing baseline turned a real regression into a green check

Build #31 (PR #1210, run `31691292567`) reported ✅ *Passed — 0 visual changes, 103 tests unchanged* while capturing **nothing**:

```
Found 0 changed files
→ Commit 'e78ed66' on branch 'ROU-12878'; found 1 parent build and 0 changed files
→ Found 0 story files affected by recent changes
✔ TurboSnap enabled
  Capturing 0 snapshots and skipping 103 snapshots.
```

A genuine change shipped unflagged in that build: `.separator` moved from `--color-primary` to `$token-border-default` (grey).

ADR-0004 §A chose `onlyChanged` + an `externals` list precisely to stop SCSS-only PRs from testing nothing. That guard could not fire here: **`externals` classifies entries in the changed-file list, and the list itself was empty.** The protection sits one layer above the failure. TurboSnap's changed-file detection is also fragile against this branch's squash-merged history, which routinely leaves it unable to resolve a parent-build commit.

### C3. The reusable-action route is closed to us

`runtime-mobile-widgets-js` authenticates with `OutSystems/rd.github-reusable-workflows/.github/actions/az-login`, which carries its own identity as an input default (client `45189da4-…`). Adopting it here is not possible:

| Repo                                     | Visibility |
| :--------------------------------------- | :--------- |
| `OutSystems/outsystems-ui`               | **PUBLIC** |
| `OutSystems/runtime-mobile-widgets-js`   | INTERNAL   |
| `OutSystems/rd.github-reusable-workflows`| INTERNAL   |

A public repository cannot consume actions from an internal one. That is exactly why this repo carries vendored copies under `.github/actions/` (`az-login`, `az-keyvault-get`, `run-sonarcloud`, `validate-pr-*`) with the shared `uses:` lines left commented out beside them — see `template-release.yaml`, `template-ts-build-project.yaml`, `validate-pr-title.yaml`. Switching would turn "pushes fail" into "every run fails, PRs included". Independently, FIC subjects embed the repo name, so that identity would still need a `repo:OutSystems/outsystems-ui:ref:…` credential registered against it.

### C4. What the Azure login is actually for

Chromatic itself never needed Azure — `OSUI_CHROMATIC_TOKEN` is a plain repository secret. The login exists solely to reach the internal Azure Artifacts feed for three packages:

- `.npmrc` redirects **only** the `@outsystems:` scope; everything else resolves publicly.
- `@outsystems/runtime-{core,view,widgets}-js` are `optionalDependencies`, so `npm i` succeeds without auth and simply skips them.
- `.storybook/main.ts` then narrows the stories glob from `stories/**` to `stories/*`, dropping `stories/widgets/**` — **20 of 103 stories** (Button, ButtonGroup, Checkbox, Dropdown, FeedbackMessage, Form, Icon, Image, Input, Label, Link, List, Popover, Popup, RadioGroup, Switch, Table, Text, TextArea, Upload).

This is the path fork PRs already take (ADR-0003), so it is proven. It also means the entire push-build blockage traces back to one dependency that only 20 stories use.

Two properties of those stories matter for section C. They **mount the real platform React components** (`import { Input } from '@outsystems/runtime-widgets-js'` + `mountWidget`), so the DOM under test is the platform's actual output, not our idea of it. And per ADR-0003 §B, `platform-core.css` is **generated at Storybook startup from the same package** rather than vendored.

## Decision Drivers

- A green check must mean the relevant stories were actually compared; a check that silently tests nothing is worse than no check (restated from ADR-0004).
- Every merge into `ROU-12714` must advance the baseline, or PR diffs are meaningless.
- No repo-side change may regress the `pull_request` path, which currently works.
- The repo is public: internal actions, internal packages and secrets are unavailable to forks and to public-repo workflow resolution.
- Widget stories cover `03-widgets/` — the form controls, buttons and list items this migration is actively rewriting. Coverage lost there is lost where risk is highest.
- Fidelity of the widget stories comes from rendering platform-owned markup; a copy we maintain ourselves cannot detect platform-side drift.
- Anything added must be cheap to remove when the initiative merges to `dev`.

## Considered Options

### A. Preventing silent no-op builds

- **Option 1: leave ADR-0004's config as-is** — Pros: none beyond inertia. Cons: demonstrated to report green having captured 0 snapshots. Rejected.
- **Option 2: disable TurboSnap for `ROU-12714` (PRs into it and pushes to it)** — Pros: correctness does not depend on TurboSnap resolving a parent build across squash-merges; ~100 stories is a cheap full build. Cons: loses the savings ADR-0004 §A Option 3 was protecting, for this branch only.
- **Option 3: fail the job when the PR touched the visual surface but `actualCaptureCount` is 0** — Pros: converts any future silent no-op — from any cause, not just this one — into a red check. Cons: one more step to understand.

### B. Restoring authentication on `push`

- **Option 1: register the missing FICs on the `OSUI_AZURE_CLIENT_ID` app registration** (`repo:OutSystems/outsystems-ui:ref:refs/heads/ROU-12714` and `…/dev`, issuer `https://token.actions.githubusercontent.com`, audience `api://AzureADTokenExchange`) — Pros: fixes the actual defect; no repo change; restores full 103-story baselines. Cons: external dependency on whoever owns the registration; `dev` needs it too or the same failure resurfaces after the initiative lands.
- **Option 2: switch to the shared reusable `az-login`** — Pros: matches `runtime-mobile-widgets-js`. Cons: **impossible** — public repo cannot consume an internal action, and the shared identity would still need a per-repo FIC. Rejected (see C3).
- **Option 3: scope the job to a GitHub `environment` so the subject becomes `…:environment:<name>`** — Pros: a valid subject shape. Cons: still requires an Entra credential to be registered, i.e. all of Option 1's cost with none of its clarity.
- **Option 4: trigger baseline builds via `workflow_dispatch`** — Pros: no Azure work. Cons: manual dispatch presents the same `ref:refs/heads/…` subject and fails identically. Rejected on the mechanism.

### C. The widget-story dependency (open)

- **Option 1: keep the dependency; baseline builds stay blocked until B lands** — Pros: no fidelity loss, no work. Cons: zero baselines until an external team acts; PR diffs remain unanchored for that whole period.
- **Option 2: make the Azure/ADO steps `continue-on-error` on push, publishing an 83-story baseline without widgets** — Pros: baselines start advancing immediately; self-heals to 103 the moment B lands, with no follow-up commit. Cons: the blind spot lands exactly on `03-widgets/`, the surface under active migration; the 20 widget stories appear as "new" on every internal PR until a full baseline exists; requires relaxing the `🔎 Verify platform-widget deps` guard to PR-only, which is the very protection it was written for.
- **Option 3: mock the widgets the way Patterns are mocked (hand-authored markup + `renderStatic`) and drop the packages entirely** — Pros: removes the internal-feed dependency from the whole harness, so push builds, fork PRs and external clones all get identical, complete coverage; deletes the optional-dependency / stub dual path from ADR-0003; one fewer auth surface; consistent with every other story in the repo. Cons: the widget DOM is **platform-owned** — class names, nesting and data-attributes are exactly what our CSS targets — so a hand copy can drift from the real runtime silently, and Chromatic would keep passing against our own mock; `platform-core.css` comes from the same package, so removing it reopens ADR-0003 §B (vendoring it back was rejected there); 20 stories to re-author plus ongoing fidelity review.
- **Option 4: record-and-commit the real widget markup** — snapshot the DOM the real components render, commit it, and have stories replay the recording; re-record on a cadence or when the package version bumps — Pros: removes the runtime dependency like Option 3 while keeping the markup anchored to real platform output; drift becomes a visible diff at re-record time rather than an invisible divergence. Cons: needs a recording script and a documented refresh trigger; `platform-core.css` still has to be solved as in Option 3; recordings are only as current as the last refresh.

## Decision Outcome

**A → Options 2 + 3 (accepted, implemented). B → Option 1 (accepted, external ask). C → open.**

Implemented in `d6a895d97` on `.github/workflows/chromatic.yaml`:

- `onlyChanged: ${{ github.base_ref != 'ROU-12714' && github.ref_name != 'ROU-12714' }}` — TurboSnap stays on for the `dev` path, off for the integration branch.
- A `🔍 Detect changes to the visual surface` step counting changes under `src/`, `stories/`, `.storybook/`, and a final `🛡️ Verify Chromatic actually captured snapshots` step that fails the job when that count is non-zero and `actualCaptureCount` is `0`. It runs after the PR comment so reviewers keep the build link, and is gated on `pull_request` so fork runs stay neutral.

Section B is a request to the owners of the `OSUI_AZURE_CLIENT_ID` registration; until it lands, no baseline exists and section C decides whether we wait.

Positive consequences:

- A build that photographs nothing can no longer report green.
- The failure mode is now documented with reproduction evidence, instead of looking like "Chromatic is flaky".

Negative consequences:

- Full snapshots on every PR into `ROU-12714` until the initiative moves to `dev`.
- The capture guard only covers `pull_request`; push builds would need a different changed-file base (`github.event.before`) to be covered too.
- Baselines remain absent until B lands or C is decided — every PR diff on the branch is provisional in the meantime.

## Links

- Amends ADR-0004 §A: `onlyChanged` + `externals` is retained for `dev` but replaced by a full build on `ROU-12714`, because `externals` cannot fire when the changed-file list is empty.
- Builds on ADR-0003 (public-repo readiness): the optional-dependency + glob-narrowing path is what makes C Option 2 viable, and ADR-0003 §B is what C Options 3 and 4 would reopen.
- Failing run: <https://github.com/OutSystems/outsystems-ui/actions/runs/31690540261> · Silent-pass build #31: <https://www.chromatic.com/build?appId=6a1eb7050a5a593505d96954&number=31>
- Entra workload-identity federation: <https://learn.microsoft.com/entra/workload-id/workload-identity-federation>

## Date

2026-08-13
