<!-- This ADR documents removing every internal package dependency from the repo by transcribing the platform widgets' real DOM into static stories and vendoring the platform base CSS for Storybook -->

# ADR-0009: Static Widget Stories and Zero Private Dependencies

## Status

Accepted — implemented. Resolves ADR-0008 §C (which was left open) and reverses ADR-0003 §B.

## Context

ADR-0008 established the causal chain behind a long-standing CI failure and left one question open. This ADR answers it.

### C1. The chain, restated

Chromatic `push` builds on `ROU-12714` had **never succeeded — 0 of 9** — always dying in `🔐 Azure login`:

```
AADSTS700213: No matching federated identity record found for presented assertion
subject 'repo:OutSystems/outsystems-ui:ref:refs/heads/ROU-12714'
```

The consequence was not a red check on a side job. It was that **the branch had no Chromatic baseline at all**: merges never advanced one, so every PR diff on the initiative was compared against whatever ancestor build Chromatic could find elsewhere. Build #31 reported "✅ Passed — 0 visual changes, 103 tests unchanged" while capturing **zero** snapshots, and a real regression (`.separator` moving from `--color-primary` to grey) shipped unflagged.

Each link in the chain has exactly one cause:

| Link | Why it exists |
| :--- | :--- |
| Azure login fails on `push` | Federated identity credentials match OIDC subjects exactly; only a `pull_request` subject was registered |
| Azure login exists | To fetch an ADO token from Key Vault |
| The ADO token exists | To authenticate npm to the internal Azure Artifacts feed |
| The feed is needed | For `@outsystems/runtime-{core,view,widgets}-js` |
| Those packages are needed | By `stories/widgets/**` (17 of 20 stories mounted the real React components) and by `platform-core.css`, generated at Storybook startup from the same package |

Chromatic itself never needed Azure — `OSUI_CHROMATIC_TOKEN` is a plain repository secret. **The entire blockage traced to one dependency used by one story group.**

### C2. Fixing it upstream was not in our hands

ADR-0008 §B accepted "register the missing FICs" as the correct fix, and it remains correct. But it is a request to whoever owns the `OSUI_AZURE_CLIENT_ID` app registration, `dev` would need the same credential before the initiative lands, and the reusable-action route is closed outright: a **public** repository cannot consume actions from an internal one (which is why this repo carries vendored copies under `.github/actions/`). Waiting meant PR diffs stayed unanchored indefinitely.

### C3. Why "just mock the stories" was not sufficient on its own

ADR-0008 §C Option 3 was to hand-author the widget markup. Its blocking objection was that `platform-core.css` — the platform base layer that generates the checkbox box and switch track/thumb via pseudo-element `content` — is produced from **the same package**. Mocking the stories alone would leave the package, the feed and the Azure login all still required. Removing the CSS dependency too means vendoring platform-owned CSS into a public repo, which is exactly what ADR-0003 §B decided *against*.

So the real decision was never "mock or not". It was whether to reverse ADR-0003 §B.

### C4. A latent defect found while implementing

`@storybook/addon-docs` resolves `react/package.json` at build time. `react` was present only **transitively, via the private packages**. An external clone — the scenario ADR-0003 was written to support — therefore could not build the Storybook at all:

```
Error: Cannot find module 'react/package.json'
Require stack: - ./node_modules/@storybook/addon-docs/dist/preset.js
```

ADR-0003's external-clone simulation predates the Storybook 10 upgrade and no longer held.

## Decision Drivers

- A green check must mean the relevant stories were actually compared (ADR-0004, restated).
- Every merge into the integration branch must advance the baseline, or PR diffs are meaningless.
- No dependency on an external team's action for the branch's core quality gate.
- The repo is public: `git clone && npm i && npm run build` must produce the **complete** Storybook for anyone.
- Widget stories cover `03-widgets/` — the form controls this migration is actively rewriting. Coverage lost there is lost where risk is highest.
- Fidelity: markup that drifts from the platform silently is worse than markup whose provenance is auditable.
- Platform-owned source should not be redistributed from this repository as a side effect of a dev-tooling need (ADR-0003, still a real cost).

## Considered Options

### A. The widget markup

- **Option 1: keep mounting the real React components** — Pros: the DOM under test is the platform's actual output; drift is impossible. Cons: keeps the internal feed, the Azure login and therefore the broken baseline. Rejected — this is the status quo that failed for months.
- **Option 2: hand-author the markup from the widgets' compiled source** — Pros: no dependency. Cons: a reading of `createElement` calls in a 165 KB bundle is a guess until something checks it; no evidence trail.
- **Option 3: capture the real rendered DOM, then transcribe it** — render each widget exactly as the old stories did (React 17 `ReactDOM.render` under jsdom, same `runtimeMock`/`Model.Variable` harness), dump the resulting DOM, and write stories that reproduce it, recording the source package version per story. Pros: every tag, class, `data-` attribute and ARIA attribute is evidence-backed rather than inferred; departures are explicit; the capture is repeatable for refreshes. Cons: a one-off harness; still a point-in-time snapshot.
- **Option 4: commit the raw captured DOM and have stories replay it verbatim** (ADR-0008 §C Option 4) — Pros: mechanical refresh. Cons: the capture contains harness artefacts (`id="-input"`, `id=""`, React's stray `_dependencies="0"` attribute); replaying them verbatim bakes in noise, and nothing readable explains what the markup *is*.

### B. The platform base CSS

- **Option 1: keep generating it at Storybook startup** — Cons: retains the whole dependency chain. Defeats the purpose.
- **Option 2: re-vendor it as a tracked, Storybook-only file** — Pros: the only option that actually severs the chain. Cons: reverses ADR-0003 §B; platform-owned CSS lives in a public repo again; ages against the platform.
- **Option 3: hand-write a minimal OUI-owned structural layer covering just the controls the stories exercise** — Pros: sidesteps the source-ownership question entirely; ours to maintain. Cons: the necessary subset was never measured (ADR-0003 §B Option 2 said as much); a subset we invent stops being the platform baseline, so the stories would validate OUI against our own approximation — the same fidelity trap as option A2, moved into CSS.

### C. The capture guard on `push`

- **Option 1: leave it `pull_request`-only** — Cons: the baseline-advancing build is the one that must not silently photograph nothing. ADR-0008 recorded this as an open negative consequence.
- **Option 2: extend it, selecting the base commit per event** (`pull_request.base.sha` vs `event.before`) — Cons: `event.before` is all-zeros on branch creation, absent on `workflow_dispatch`, and can be unreachable after a force-push, so it needs a fail-safe.

## Decision Outcome

**A → Option 3; B → Option 2; C → Option 2.**

### What was implemented

- **All 20 `Widgets/` stories are now static**, rendered through the same `renderStatic` helper the pattern stories use. The three that were already static (FeedbackMessage, List, Table) are unchanged; the 17 that mounted React were transcribed from DOM captured from `@outsystems/runtime-widgets-js@6.25.4` under React 17. Each story's doc comment records the source version and the DOM contract it reproduces.
- **`stories/_helpers/widget.ts` is deleted** — the `runtimeMock` Proxy, the `Model.Variable` bridge and the React 17 mount harness are all gone.
- **`.storybook/platform/platform-core.css` is tracked**, carrying a provenance header (source package + version, FontAwesome `@font-face` stripped, refresh trigger, and an explicit "do not hand-tune values here" note). Removed from `.gitignore`.
- **`.storybook/main.ts`** loses the `hasPlatformWidgets` probe, the startup CSS generation, the stub-file fallback and the conditional `stories` glob. One unconditional glob; one static dir.
- **`package.json`** drops the `optionalDependencies` block entirely and `react-router-dom` (only the Link story needed it). `react` and `react-dom` are now declared **explicitly** as public devDependencies at ^19 — see Context C4; they were previously supplied only by the private packages.
- **`.github/workflows/chromatic.yaml`** loses `🔐 Azure login`, `🔑 Get ADO token from Azure Key Vault`, `⭕ Connect to OutSystems Environment`, the `🔎 Verify platform-widget deps` guard, the `IS_FORK` env and the `id-token: write` permission. A header comment records why an Azure login must not come back.
- **The capture guard now covers `push`**, choosing its base commit per event and treating an unusable base as "assume the surface changed" so it fails safe rather than disarming itself.

### Verification

Fidelity was checked mechanically, not by eye. Each story's rendered markup was compared against the captured DOM after whitespace normalisation: **11 of 16 comparable cases are byte-identical**. Every remaining difference was then re-checked under a canonicalisation that ignores story-layout `style` attributes and generated ids, and all of them are accounted for:

| Story | Difference | Why |
| :--- | :--- | :--- |
| Button, Icon | outer wrapper only | The flex-layout wrapper belongs to the story (the old stories had it too); the widget markup inside is byte-identical. The capture's `_dependencies="0"` was an artefact of the old harness cloning props onto a DOM node — dropping it is a fix. |
| RadioGroup, Form, Dropdown | `id` / `for` / `name` | The capture stubbed the platform's id service, emitting `id="-input"`, `id=""`, `name=""`. No OUI selector targets an id, so real ids are safe and make labels associate and the radio group actually mutually exclusive. |
| Dropdown (native) | `selected` on the current option | React sets selection through the DOM `value` property, which never appears in `innerHTML`; static markup has to state it. |
| Dropdown | extra column wrappers + `<h3>`s | Story layout, present in the old story too. Both captured widget blocks appear verbatim inside it. |

Then, simulating an external clone — the private packages and every React package removed from `node_modules`:

- `npm run build-storybook` **completes successfully** (it failed before this change, on `react`; see C4).
- The published Storybook contains **110 stories, 24 of them under `Widgets/`** — up from 103/20, because states that previously required a click are now their own stories.
- `npm run lint` clean; `tsc --noEmit` over `.storybook/main.ts` and every widget story clean.

### Coverage deliberately added

A static transcription cannot be clicked, and Chromatic only ever photographed the **initial** render anyway — so the interactive states were never actually snapshotted, even while the stories mounted live widgets. Four states were therefore promoted to their own stories, and the DOM for each was captured by dispatching a real click before dumping:

- `Widgets/Dropdown → Custom Expanded` — `.dropdown-list`, `.dropdown-popup-row(-selected)`, `.scrollable-list`. This is the bulk of `_dropdown.scss` and it had never been snapshotted.
- `Widgets/Popover → Expanded` — `.popover-bottom`, i.e. all of `_popover.scss` / `_popover-odc.scss`.
- `Widgets/Checkbox → States` and `Widgets/Switch → States` — unchecked and disabled, previously unreachable in a snapshot.

Positive consequences:

- Push builds have nothing left to authenticate against, so the baseline can finally advance on merge and PR diffs become meaningful.
- ADR-0003's dual code path (real package vs written stub) is gone; internal runs, fork PRs and external clones render one identical story set.
- The Storybook actually builds on an external clone now — it did not before.
- One fewer auth surface, one fewer secret in a public repo's critical path, `id-token` dropped.
- Net coverage increase on the surface under active migration, not a decrease.

Negative consequences:

- **Platform DOM drift is now silent.** If the platform changes a widget's markup, these stories keep passing against the old shape and Chromatic keeps agreeing with our own copy. This is the real price and it is not mitigated, only documented — see *Refresh trigger* below.
- Platform-owned CSS is redistributed from a public repo again, reversing ADR-0003 §B. It is Storybook-only, never enters `dist/`, and carries provenance — but the source-ownership objection recorded there stands and is knowingly accepted.
- `platform-core.css` ages against the platform, as ADR-0003 §B Option 1 warned.
- The widget markup is a point-in-time transcription of `6.25.4`, not a live binding.

### Refresh trigger

Re-capture when the platform changes the structural contract of the widgets — a `runtime-widgets-js` major/minor bump touching widget DOM, or a visual bug that reproduces in a real app but not in Storybook. The method: install the packages, mount each widget under React 17 with the harness described in A3, dump the DOM, and update the stories and the CSS file together, keeping their headers current. Do **not** hand-tune the vendored CSS or the story markup to make something look right — that hides drift instead of surfacing it, and defeats the purpose of the transcription.

## Links

- Resolves ADR-0008 §C (open); keeps ADR-0008 §A (TurboSnap off, capture guard) and extends the guard to `push`.
- Reverses ADR-0003 §B (`platform-core.css` generated, not vendored); ADR-0003 §A is moot — the packages are no longer dependencies of any kind.
- ADR-0008 §B (register the missing FICs) is **no longer needed by Chromatic**, but remains valid for any *other* workflow in this repo that still uses `.github/actions/az-login` (`template-release.yaml`, `template-ts-build-project.yaml`, `create-n-deploy-npm.yaml`, `create-n-deploy-docs.yaml`, `template-pre-release.yaml`).
- `.storybook/platform/platform-core.css`, `stories/widgets/*.stories.ts`, `.storybook/main.ts`, `.github/workflows/chromatic.yaml`
- Silent-pass build #31: <https://www.chromatic.com/build?appId=6a1eb7050a5a593505d96954&number=31>

## Date

2026-08-21
