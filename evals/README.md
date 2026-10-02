# Evals

Offline, deterministic measurements of the OutSystems UI library, organised in **suites**. Each suite
answers one question with its own index (an unweighted mean of its evals, 0–100); indices are never merged.

| Suite        | Directory                                       | Index                                | Question                                                                     |
| ------------ | ----------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `ai`         | [`ai-friendliness/`](ai-friendliness/README.md) | AI-Friendliness Index (E01–E10)      | how legible the library is to coding agents                                  |
| `enterprise` | [`enterprise/`](enterprise/README.md)           | Enterprise Readiness Index (R01–R06) | how far the token theme and the patterns meet the enterprise UI requirements |
| `utilities`  | [`utilities/`](utilities/README.md)             | Utilities Index (U01–U06)            | how predictable and documented the utility classes are for an agent          |

Everything else in this directory is shared: the runner, the libraries, the tools, the results and the
component registry.

Components belong to one of four **tiers** (`lib/tiers.mjs`): `pattern` (TypeScript + SCSS), `component`
(CSS-only, with an anatomy and a story), `layout` (host-styled partials of the app templates) and `utility`
(helper classes and the `05-useful` families). A metric lists the tiers it measures in `present.appliesTo`;
a component outside them gets a not-applicable cell that names its tier. Besides its index, every suite
reports an index per tier (the same evals scored over the components of one tier), so a helper class cannot
move the pattern figure. The AI and enterprise suites leave utility classes to the utilities suite.

```
evals/
  run.mjs              CLI: run every suite (or one), write results, print tables, compare labels
  suites.mjs           the suite registry: id, index name, eval prefix, metrics, gate tolerances, dashboard tone
  components.json      the component registry: one classified entry per pattern, CSS-only component, layout partial and utility family
  lib/                 inventory (discovery) · registry · tiers · utilities · context · ts · scss · tokens · markup · manifest · expectations · score · results · present · paths
  tools/               gate · report (HISTORY.md) · dashboard-data (dashboard.json) · dashboard-page · doctor
  dashboard/           index.html, the dashboard page template
  results/             history.json · HISTORY.md · dashboard.json · <label>.json per run
  tests/               node:test unit tests of the shared code (each suite tests its own metrics)
  <suite>/             metrics/ (one module per eval + index.mjs) · tests/ · README.md
```

## Run

```bash
npm run evals -- --label <name>           # full run of every suite; updates history.json, HISTORY.md, dashboard.json
npm run evals -- --suite enterprise       # one suite (partial run, nothing written to history)
npm run evals -- --only E01,R03           # a few evals (partial run)
npm run evals -- --compare loop-10 loop-11
npm run evals:gate -- --report out.md     # every suite gated; Markdown before → after tables (what the PR comment shows)
npm run evals:doctor                      # the tree vs the component registry; --fix appends derived entries
npm run evals:report                      # regenerate results/HISTORY.md
npm run evals:dashboard                   # regenerate results/dashboard.json
npm run evals:dashboard:page -- --check   # build results/dashboard.html from the template and render-check it
npm run evals:fix                         # regenerate every generated file: docs-ai/, pattern types, HISTORY.md, dashboard.json, registry entries
npm test                                  # unit tests: scripts, shared code, every suite
```

A fresh clone needs `npm install` and `npm run build:tokens` (the SCSS evals compile against the generated
tokens). A full run takes about 30 s; the metrics themselves about 7 s.

## What a run records

A loop is a measurement of pattern code. The runner fingerprints the measured inputs (`src/` without the
generated tokens, `stories/`, `docs-ai/`) and records a full run in the history only when that fingerprint
differs from the newest recorded run's; a change to the evals, the dashboard, the workflow or the docs
writes the run file but adds no entry (`--force` records anyway, for a deliberate re-baseline). The
recording step on `dev` follows the same rule, so an infrastructure merge publishes nothing.

- `results/<label>.json`: per suite, each eval's score, formula, raw counters, per-component rows, the
  components it could not measure (`unmeasured`, with the reason) and the components it does not apply to
  (`notApplicable`, with the reason and a hint). Unmeasured and not-applicable components do not count in
  the score: an eval averages what it measured.
- `results/history.json`: one entry per label: date, commit, branch, and per suite the scores, the index,
  the unmeasured count per eval and, from `loop-13` on, the scores and index per tier (`tiers`).
- `results/HISTORY.md` and `results/dashboard.json`: rendered from the two above; tests assert both are fresh.

## The gate

`npm run evals:gate` runs every suite without writing results and compares each with its baseline: the
newest run recorded on `dev` when history has one (`branch: "dev"` or a `dev-` label), else the newest run
of any label (`--baseline <label>` to choose). In CI the history comes from the `evals-results` branch (see
"Recording on dev" below), so a pull request is judged against its base branch. Per suite it applies:

1. the index may not drop by more than `maxDrop` points (1);
2. no single eval may drop by more than `maxEvalDrop` points (3);
3. evals that declare a `no-decrease` rule may not go down at all (R01, component coverage);
4. no eval may leave more components unmeasured than the baseline did (once the baseline records counts).

The `--report` tables compare with the origin (the newest `dev` run, else the oldest run carrying the suite:
the state before the branch's work; `--report-baseline <label>` to choose) and name the baseline the verdict
used. With `--changed <file>` (one repository path per line, as `git diff --name-only` prints) the report adds
a **components touched** section: the patterns and CSS components those files belong to, each heatmap cell
before → after (the "before" run is `--base-run <run.json>`, in CI the results branch's `latest.json`), and
the hints of the cells that dropped or sit below 80. Locally:

```bash
git diff --name-only origin/dev > /tmp/changed.txt && npm run evals:gate -- --changed /tmp/changed.txt
```

The report ends with the component registry section when the tree and `components.json` disagree.
Tolerances live per suite in `suites.mjs`; `--max-drop`, `--max-drop-<suite>` and `--max-eval-drop` override
them for one run.

## Recording on dev

Every push to `dev` runs the recording steps of the same workflow job: it seeds the history from the
`evals-results` branch, runs every suite as `dev-<sha>` with `--branch dev`, and publishes `history.json`,
`HISTORY.md`, `dashboard.json`, `latest.json` and the last 20 run files to that orphan branch with git
plumbing (`tools/publish-results.sh`; `--dry-run` builds the commit locally without pushing). Nothing is
committed to `dev`; the branch holds no source and is never edited by hand (`RESULTS-BRANCH.md` is its
README). On pull requests the same job fetches the branch's `history.json` as its baseline when the branch exists.

## Stale generated files

The gate job fails a pull request whose generated files are stale and says so in the PR comment; it does
not push fixes. Run `npm run evals:fix` locally: it regenerates `docs-ai/`, the pattern types,
`HISTORY.md` and `dashboard.json`, and appends derived registry entries for new components, then commit.

## Adding an eval

1. Create `<suite>/metrics/<ID>-<slug>.mjs` exporting a default metric object:

    ```js
    export default {
    	id: 'E11', // <suite prefix><two digits>, unique across suites
    	name: '…',
    	criterion: '…', // the research or requirements criterion it measures
    	formula: '…', // repeated in every results file
    	movable: true, // moves with additive changes; false = structural (or cls: 'roadmap')
    	present: {
    		scope: '…', // what a per-component cell means and why some components have none
    		heatmap: true, // perComponent rows are components → a dashboard column
    		appliesTo: ['pattern', 'component', 'layout'], // the tiers it measures (lib/tiers.mjs)
    		unmeasuredHint: '…', // what gives an unmeasured component what the eval reads
    		cell(row) {
    			return { s: row.score, h: '…' };
    		}, // one measured row → score and hint
    		advice(m) {
    			return ['…'];
    		}, // eval-level next steps from the latest result
    	},
    	// rules: [{ kind: 'no-decrease', why: '…' }],      // optional gate rule on this eval's score
    	compute(ctx) {
    		return { score, summary, raw, perComponent, unmeasured, notApplicable };
    	},
    };
    ```

    Keep the scoring in a pure `scoreComponent` / `scoreGlobal` function and test it with synthetic inputs.
    Report what you cannot measure under `unmeasured` (`{ name, reason }`) and what does not apply under
    `notApplicable` (`{ name, reason, hint }`); never score either.

2. Register it in `<suite>/metrics/index.mjs`. The contract test in `tests/suites.test.mjs` checks the
   shape; the gate, HISTORY.md and dashboard.json pick the eval up from the registry.
3. Add a formula test to the suite's tests and document the band in the design document.

## Adding a suite

1. Create `evals/<suite>/` with `metrics/index.mjs` (exporting `metrics`), `tests/` and a `README.md`.
2. Add one entry to `suites.mjs`: `id`, `name`, `indexName`, `idPrefix`, `describe`, `metrics`, `maxDrop`,
   `maxEvalDrop`, `tone`. The runner, gate, history report, dashboard data and page iterate the registry.
3. Run `npm run evals -- --label <name>`: the first run that carries the suite becomes its baseline.

## Classifying a component

The inventory (`lib/inventory.mjs`) discovers components from the tree: a `*API.ts` file is a pattern, its
SCSS comes from the gulp spec, its story is matched by name; a partial under `src/scss/02-layout`,
`03-widgets`, `04-patterns` or `05-useful` is a CSS component whose directory gives its default tier
(`02-layout` → layout, `05-useful` and `04-patterns/06-utilities` → utility, else component). Two partials
sharing a file name keep one name each (`section`, `layout-section`). What a component _is_ comes from
`components.json`:

| Field                              | Applies to | Meaning                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`                             | all        | the tier: `pattern`, `component`, `layout` or `utility` (`css` still reads as `component`); a pattern cannot be registered as anything else, a CSS component may override its directory tier (`animate`, `columns` → utility)                                                                                                                                                                             |
| `title`                            | utility    | display name of a utility family in `llms-utilities.txt` (`Spacing · margin`)                                                                                                                                                                                                                                                                                                                             |
| `roles`                            | patterns   | `provider` (behaviour in a provider library), `overlay` (opens a layer: Escape, focus), `composite` (arrow keys), `feedback` (announces status), `non-interactive`, `no-dom` (attaches to existing elements)                                                                                                                                                                                              |
| `family`                           | patterns   | patterns implementing one keyboard model together share the parent's name (Tabs, Accordion, Wizard, SectionIndex)                                                                                                                                                                                                                                                                                         |
| `host` `{ host, reason }`          | css        | styles markup something else emits (app template blocks, common screens, the runtime): no markup contract of its own                                                                                                                                                                                                                                                                                      |
| `story`                            | css        | normalised story name when it differs from the component name (`btn` → `button`)                                                                                                                                                                                                                                                                                                                          |
| `interactive`                      | css        | operated by the user (patterns are interactive unless `non-interactive`)                                                                                                                                                                                                                                                                                                                                  |
| `loading`, `validating`, `density` | all        | has a loading state, an invalid state, or is expected to offer a density axis                                                                                                                                                                                                                                                                                                                             |
| `derived`                          | all        | appended by the doctor from code signals; review, adjust and remove the flag                                                                                                                                                                                                                                                                                                                              |
| `block`                            | patterns   | the OML block(s) the pattern drives: `[{ flow, name, paramMap, platformOnly, eventMap }]`; `paramMap` maps a block parameter (dotted for a structure attribute) to a config prop, `platformOnly` names block parameters with no runtime counterpart, `eventMap` maps block events to runtime events; the model suite's M02 reads it and a test resolves every link against `evals/model/osui.blocks.json` |

A test fails when the registry and the inventory disagree. When a component is added or renamed:

```bash
npm run evals:doctor            # what is unclassified, stale or without a story, with the entry the code suggests
npm run evals:doctor -- --fix   # append the derived entries, drop stale ones; then review components.json
npm run docs:ai                 # regenerate docs-ai/ (the manifest card and llms files)
npm run evals -- --label <name> # measure; the new component appears in every applicable eval
```

The requirements of the enterprise suite (`enterprise/requirements.json`) name the evidence that satisfies
them, so a component that fulfils a missing requirement flips it without editing the file.

## Publishing the dashboard

`npm run evals:dashboard:page -- --check` builds `results/dashboard.html` from `dashboard/index.html` and the page module `dashboard/dashboard.mjs` with
`results/dashboard.json` embedded and render-checks it. The dashboard lives as a Claude artifact: the page is
republished from `results/dashboard.html` and the new `dashboard.json` is written to the artifact database
document `evals/dashboard` after a run (a Claude session or scheduled task does both). The artifact sandbox
cannot fetch from GitHub, so the workflow does not refresh it; `dashboard.json` on the `evals-results` branch
is always the newest data set to publish.

## Conventions the static analysis expects

Every path built from data goes through `insideDir` (`lib/paths.mjs`); scanners are substring tests, never
regular expressions over source text; no nested template literals; `String.raw` for backslashes; explicit
comparators for every sort; functions under the cognitive-complexity limit; no code execution or spawned
processes except the gate running the runner. `.wiz` lists `evals/**` as by design.
