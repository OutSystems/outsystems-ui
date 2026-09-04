<!-- This ADR documents how Chromatic visual testing was enabled for the new-theme work, including the TurboSnap correctness constraint and fork safety -->

# ADR-0004: Chromatic Visual Testing on a Long-Living Branch

## Status

Accepted — §A amended by ADR-0008 (the `externals` guard cannot fire when TurboSnap reports an empty changed-file list, so `onlyChanged` is disabled on `ROU-12714`).

## Context

The design refresh changes almost every component's CSS, so a visual-regression net is a prerequisite for reviewing it. A Chromatic project already existed for OutSystems UI, and a `Storybook` workflow existed in the repo — but its triggers only matched `dev`, which never carries this initiative's work, so **it had never actually run**.

Three properties of this repository shape the solution:

1. **Feature branches target the long-living integration branch `ROU-12714`, not `dev`.** A workflow that only watches `dev` is inert for the whole initiative.
2. **Storybook drives the *compiled* library.** Stories load `dist/*.OutSystemsUI.{js,css}` as classic `<script>`/`<link>` tags and call the public pattern APIs; no story imports anything from `src/`. Consequently **nothing under `src/` exists in Storybook's module graph**, and `dist/` is gitignored.
3. **The repo is public.** Fork PRs receive no repository secrets, so every step that needs internal infrastructure (Azure login, Key Vault, internal npm feed, the Chromatic token) cannot succeed for an outside contributor.

Property 2 is the dangerous one. TurboSnap (`onlyChanged`) decides what to snapshot by tracing changed files through the module graph. Reading the Chromatic CLI source confirmed that a changed file which cannot be traced is **silently ignored** — it is not treated as a bail condition. With `onlyChanged: true` and no further configuration, a SCSS-only pull request (i.e. nearly every PR in this initiative) would therefore snapshot **nothing** and report green.

## Decision Drivers

- Every PR into the integration branch must produce a visual diff, and every merge must advance the baseline.
- A green check must mean "the relevant stories were actually compared" — a check that silently tests nothing is worse than no check.
- Fork PRs must not fail for reasons an external contributor cannot act on.
- Fork PRs should still prove the public build works.
- Configuration must be reversible/removable once the initiative merges to `dev`.

## Considered Options

### A. TurboSnap

- **Option 1: keep `onlyChanged` as-is** — Pros: cheapest snapshot bill. Cons: **incorrect** — SCSS-only PRs test nothing (see Context). Rejected.
- **Option 2: drop `onlyChanged` entirely** — Pros: always correct; simplest config. Cons: no savings on story-only or docs-only PRs.
- **Option 3: keep `onlyChanged` and declare an `externals` list covering everything the module graph cannot see** — Pros: correct *and* keeps savings where they are real. Cons: one more piece of config that must not be "cleaned up" by a future reader.
- **Option 4: make the dependency real (import the compiled bundle from a story)** — Pros: would restore tracing. Cons: impossible in practice — `dist/` is gitignored, so git never reports a change there, and tracing still could not reach `src/`.

### B. Fork PRs

- **Option 1: leave failing** — Cons: red check on every outside PR, unactionable.
- **Option 2: skip the internal steps when the PR comes from a fork, and skip Chromatic when its token is empty** — Pros: neutral result, and `npm i` + `npm run build` still run, proving public buildability.

## Decision Outcome

**A → Option 3; B → Option 2.**

- Triggers extended to `pull_request` and `push` on **both** `dev` and `ROU-12714`, with `autoAcceptChanges: '{dev,ROU-12714}'` so merges advance the baseline while PRs still require review in Chromatic. The `ROU-12714` entries are commented in-file as removable once the initiative lands on `dev`.
- `externals: [src/**, gulp/**, legacy/**]` accompanies `onlyChanged`. A change to any of those paths disables TurboSnap for that build and forces a full re-snapshot. `package.json`/lockfile and `.storybook/**` already force one automatically.
- Fork safety: an `IS_FORK` job-level env gates the Azure login, Key Vault fetch and internal-feed login; the Chromatic step is skipped when its token is empty; the PR-comment steps only run when Chromatic actually ran.

Positive consequences:

- Correct by construction for the dominant PR shape in this initiative.
- Outside PRs show the Storybook job as skipped/neutral instead of red.
- An internal-run guard asserts the platform-widget packages resolved after `npm i`, so a silent feed-auth failure cannot publish a reduced story set and auto-accept it as the baseline.

Negative consequences:

- Because `src/**` is external, most PRs here do a **full** run: TurboSnap is configured for correctness, not for cost. If cost ever dominates, Option 2 (drop `onlyChanged`) is the honest simplification.
- The `externals` list is load-bearing but non-obvious; it carries a "do not remove" comment for that reason.

## Implementation constraints discovered

Two GitHub Actions behaviours cost a debugging cycle each and are recorded so they are not rediscovered:

- **The `secrets` context is not available in a step-level `if`.** Referencing it there does not merely fail that step — it invalidates the **entire workflow file**. GitHub then reports a 0-second failed run titled with the file path, containing no jobs, and the workflow never triggers. The check must be hoisted to job-level `env`, where `secrets` *is* available.
- **Local composite actions (`./.github/actions/*`) require `actions/checkout` to run first.** The pre-existing step order placed Azure login before checkout, which could never have worked — it had simply never executed.

`actionlint` is the recommended pre-push check for any workflow edit; it pinpointed the first issue immediately.

## Links

- `.github/workflows/chromatic.yaml`
- Chromatic TurboSnap: <https://www.chromatic.com/docs/turbosnap>
- ADR-0003 — the packaging half of public-repo readiness

## Date

2026-08-12
