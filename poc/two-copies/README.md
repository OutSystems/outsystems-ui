# PoC: two OutSystems UI bundles on one page (ROU-13176, level 1)

This proof of concept reproduces what happens when a second, different OutSystems UI bundle runs on a page
that already has one. That is the ODC Modular Apps case: a Host App screen and an Embedded App screen alternate
in one document. It then shows that the S1 design in §8.2 of the impacts document fixes it. S1 is one live copy
per major: a version-guarded prologue, plus module state moved into a per-major shared store.

Level 1 means no ODC platform. Screen lifecycles are simulated in [index.html](index.html). Level 2 (a real ODC
app through `os-model-script` preview) and level 3 (real composition with the client runtime's Native Federation
PoC) are out of scope.

## What is here

| File                                                   | Role                                                                                                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [make-variant.mjs](make-variant.mjs)                   | Takes a compiled bundle and a version label. `today` only rewrites `Constants.OSUIVersion`. `s1` also wraps the `tsc` output in the §8.2 prologue (seed and publish the three globals, semver compare, one slot per major). |
| [build-variants.mjs](build-variants.mjs)               | Writes `variants/{today,s1,pristine}-{3.0.0,3.2.0,4.0.0}.js`                                                                                                                                     |
| [index.html](index.html)                               | The harness (see below)                                                                                                                                                                          |
| [tests/two-copies.spec.mjs](tests/two-copies.spec.mjs) | The Playwright matrix                                                                                                                                                                            |
| [serve.mjs](serve.mjs)                                 | Static server rooted at the repository root, so the page can load `/dist/`                                                                                                                       |

The source change for S1 is scoped to what the harness exercises:

- `src/scripts/OSFramework/OSUI/Helper/SharedState.ts`: new `Helper.SharedState.Get(key, factory)`. Without the
  prologue (Storybook, today's build) it returns `factory()`, so behaviour is unchanged.
- `SidebarAPI`, `TabsAPI`, `TabsHeaderItemAPI` and `TabsContentItemAPI` registries, keyed `<Name>API.map`.
- `GlobalListenerManager` and `GlobalObserverManager`, keyed by their class names, read lazily (see deviation 2).

The other 29 pattern registries and the Menu, IconLibrary, Scroll, deprecated-submenu, OnPostMessage and Dates
state listed in §4 are **not** moved.

## How to run

From the repository root, build the ODC bundle (it lands in the git-ignored `dist/`):

```bash
npm run build:osui --target=odc
```

Then, in this folder:

```bash
npm install
```

```bash
npm test
```

`npm test` regenerates the variants and runs Playwright. Playwright starts `serve.mjs` on port 4173. If the Chromium
revision that `@playwright/test` expects is not installed, the config falls back to the newest `chromium-*` under
`%LOCALAPPDATA%\ms-playwright` (override with `PLAYWRIGHT_CHROMIUM_PATH`).

To explore by hand, run `npm run serve` and open, for example,
`http://localhost:4173/poc/two-copies/index.html?mode=s1&host=3.0.0&embedded=3.2.0`. Then use the two navigation
buttons and read `window.__poc.state()` in the console.

### Pristine baseline

`today` variants are built from the modified source and rely on the `SharedState` fallback. To show that the
fallback changes nothing, `build-variants.mjs` also writes `pristine-*` variants from
`baseline/ODC.OutSystemsUI.js` when that file exists. The file is git-ignored. Produce it by building the source
without this branch's `src/` change, then copying `dist/ODC.OutSystemsUI.js` there. The `pristine` test fails if
the file is missing.

## The harness

The page loads `/dist/ODC.OutSystemsUI.css`, installs the instrumentation, then injects the Host App's bundle.
Query parameters: `mode` (`today`, `s1` or `pristine`), `host`, `embedded` (a version, or `none`), and `rerunHost=1`.

- **Screens.** `Home` (Host App) and `AccountDetail` (Embedded App) each have a Sidebar and a Tabs with two
  header items and two content items. Each pattern uses the `[data-block]` + `name=<id>` markup of the stories.
  Lifecycle: `Create` (OnInitialize), then the DOM is inserted, then `Initialize` (OnReady). Home then opens its
  Sidebar (`HasOverlay: true`), which registers `mousedown` and `click` on `body`. Home's ids are the same each
  time it is shown, as widget ids are.
- **Navigation.** Navigation follows the platform transition. The next screen's Layout requires its app's bundle
  by injecting a `<script>`, deduplicated by URL like `RequireScript`. Each app serves the file under its own URL
  (`?app=Host` / `?app=Embedded`). The next screen is created and initialized **before** the previous screen's
  OnDestroy disposes it. `rerunHost=1` makes the Host bundle execute again on Back, under a cache-busted URL.
- **Instrumentation.** `EventTarget.prototype.addEventListener` and `removeEventListener` are patched to count
  live registrations on `body`, `document` and `window`. Every API call goes through the globals at call time, as
  the module's JS nodes do, and its envelope (`isSuccess`, `code`, `message`) is recorded. `console.warn` is
  captured. Each Sidebar and Tabs instance is tagged with the version of the copy whose class built it. The tag
  comes from a class-to-version map taken after each script loads. `window.__osLibs` is summarized in every
  snapshot.

## Results

18 tests, all passing (Chromium 1243; stable over `--repeat-each=3`). "Baseline" is the listener count after the
Host bundle loaded and before any screen: `body` = 1 (the ButtonsEffect click listener, see finding 1),
`window` = 0.

| #   | Scenario                                                    | Expected (§8.2)                                        | `today` (actual)                                                                                                                       | `s1` (actual)                                                                                                                                       |
| --- | ----------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Host 3.0.0 → Embedded 3.2.0, Home's OnDestroy               | today fails; S1 disposes, listeners back to baseline   | All 6 `Dispose` → `isSuccess:false`, "…was not found". `body` 3, `window` 2 after Home is gone. `pristine` identical.                  | All 6 `Dispose` → `isSuccess:true`. `body` 1 (baseline), `window` 1 (AccountDetail's Tabs). Overlap: shared maps hold Home + Acct; 3.0.0 instances disposed by 3.2.0 API code. |
| 2   | … then Back to Home (runtime skips the loaded Host URL)     | S1 keeps the shared store, creates with 3.2.0 code     | 3.2.0 serves. Create succeeds only because the new maps never saw Home. Listeners accumulate: `body` 4, `window` 2 (first Home: 2, 1). | Same `state` object. All envelopes succeed. Home's Sidebar and Tabs are built by 3.2.0 classes. Listeners equal to the first Home (`body` 2, `window` 1). |
| 2b  | … Back to Home, the Host bundle executes again              | 3.0.0 is a no-op                                       | 3.0.0 resets everything again: serving downgrades to 3.0.0 and AccountDetail's 6 `Dispose` fail.                                       | Warning `[OutSystems UI] 3.0.0 not applied; 3.2.0 serves this page.` 3.2.0 keeps serving, all succeed.                                              |
| 3   | Host 3.2.0 → Embedded 3.0.0 (Host ahead)                    | Incoming no-op with a warning                          | Downgrade: 3.0.0 serves, AccountDetail is built by 3.0.0 classes, Home's `Dispose` fail, `body` above baseline.                       | Warning `3.0.0 not applied; 3.2.0 serves this page.` AccountDetail is built by 3.2.0 classes. Disposes succeed, `body` at baseline.                   |
| 4   | Same revision twice (3.0.0 from two apps, two URLs)         | No-op                                                  | The bundle runs again and resets: Home's `Dispose` fail, `body` above baseline.                                                       | Warning `3.0.0 not applied; 3.0.0 serves this page.` Disposes succeed, `body` at baseline.                                                          |
| 5   | Another major (3.0.0 → 4.0.0)                               | No-op with a warning                                   | 4.0.0 takes over the globals, Home's `Dispose` fail.                                                                                   | Warning `4.0.0 not applied; another major serves this page.` 3.0.0 serves, `majors` has only `3`, disposes succeed.                                 |
| 6   | Single bundle (Embedded App brings none), Home → Acct → Home | Same as today                                         | All succeed, listeners at baseline after Home, equal on Back.                                                                         | Identical; the only difference is that `window.__osLibs.osui.majors['3']` exists.                                                                   |
| F1  | Click a `.btn` after a second copy loaded (finding 1)       | One ripple in S1                                       | 2 ripples (two body click listeners)                                                                                                    | **2 ripples** (two `_bodyClick` handlers on the one shared listener). Single bundle: 1.                                                            |

The console also shows `OSUI-GEN-09007` warnings for Tabs. They are harness noise: `TabsAPI.Initialize` runs
before the items' `Initialize`, the same order the Tabs story uses. They are not related to the second copy.

## Where the PoC contradicts or refines §8.2

1. **§4 misses a namespace-level handler registration, and S1 as written does not cover it.** §4 says
   `OnPostMessage.Set()` is the one exception to lazy listeners. But
   [`OutSystems/OSUI/Utils/ButtonsEffect.ts:67`](../../src/scripts/OutSystems/OSUI/Utils/ButtonsEffect.ts) calls
   `GlobalListenerManager.Instance.addHandler(BodyOnClick, _bodyClick)` when the bundle runs. That is the `body`
   click listener in the baseline. Today, a second copy adds a second `body` listener. Under S1, the upgrade re-runs
   the file, and the shared manager ends up with two `_bodyClick` handlers. Either way every `.btn` click renders
   the ripple twice (test F1). The fix follows the §8.2 rule for module-level handlers: keep `_bodyClick` in
   shared state and register it once per major, through the same initializer that §8.2 proposes for
   `OnPostMessage.Set()`. The §4 inventory should add ButtonsEffect, and the "state to move" list should add it. A
   sweep for other statements that run at namespace level (not only `const _x =` state) is worth doing before
   GA.
2. **The `GlobalListenerManager` snippet in §8.2 throws on load if taken literally.**
   `private static _listenerManager = Helper.SharedState.Get(...)` runs when the class is defined. In the
   `tsc --outFile` output, `Event/DOMEvents/Listeners/ListenerManager.ts` (line 1354 of the ODC bundle) is
   emitted before `Helper/SharedState.ts` (line 3517). So `Helper.SharedState` does not exist yet. The PoC
   resolves it lazily inside the `Instance` getter and caches it in the private static. The same applies to
   `GlobalObserverManager`. The `*API.ts` maps are fine as module-level `const`s: `OutSystems/` is emitted after
   all of `OSFramework/`.
3. **A pattern family moves together.** Tabs needs the `TabsHeaderItemAPI` and `TabsContentItemAPI` maps moved
   as well as `TabsAPI`. Otherwise the child items' `Dispose` fail after an upgrade, as they do today. The same
   holds for every parent/child family (Accordion, Carousel items, …), which the "all 33 maps" plan already
   covers.
4. **"Same revision: the runtime already skips identical files" holds only for an identical URL.** Two apps
   serving the same OSUI revision from different URLs run it twice. Today that resets state just like a
   different revision does (row 4). S1 covers it because the prologue's check is `<= 0`, not `< 0`. Whether ODC
   serves one URL or one per app is for level 2/3 to confirm.
5. **Two sources for the version.** The prologue takes `__OSUI_VERSION__` from `package.json`, while
   `SharedState` derives the major from `Constants.OSUIVersion`. The two must agree, or the store is looked up
   under the wrong major and silently falls back to per-copy state. `make-variant.mjs` rewrites both. The real
   build should use one placeholder for both. Also, `Constants.OSUIVersion` is `'3.0.1'` today, not the
   `'3.0.0'` that §4 quotes.
6. **The `"use strict"` directive has to move.** The `tsc` output starts with `"use strict";`. Inside the
   wrapper, after the seed `var`s, it is no longer a directive. `make-variant.mjs` moves it to the first statement
   of the wrapper function. §8.2's prologue does not mention it.

What §8.2 predicted and the PoC confirms:

- Seed-and-publish keeps `window.OutSystems.OSUI` alive across loads.
- Same or older revision is a no-op with the expected warning. Newer upgrades in place and keeps the store.
- 3.0.0 instances are disposed by 3.2.0 API functions, and their `removeHandler` calls reach the adopted shared
  manager, so listeners return to baseline.
- After Back, the Host screen runs 3.2.0 code, styled by the Host App's CSS (here the same `dist/` CSS).

Not covered at level 1: provider-backed patterns (no Flatpickr or VirtualSelect loaded), the Menu,
deprecated-submenu and OnPostMessage handlers, CSS skew, and real platform timing.
