# Enterprise-readiness evals (R01–R06)

Six evals that answer a different question from the AI-friendliness suite: how far the token-based theme
and the patterns of OutSystems UI meet the requirements of "UI Enterprise apps requirements" (OutSystems,
2025-07-30). They form their own **Enterprise Readiness Index** (unweighted mean of R01–R06); the two
indices are never merged.

```bash
npm run evals -- --label <name>          # both suites; a full run updates history.json, HISTORY.md, dashboard.json
npm run evals -- --suite enterprise      # this suite only (partial run, nothing written to history)
npm run evals:gate                        # both indices gated; enterprise coverage (R01) may never decrease
npm test                                  # includes evals/enterprise/tests
```

| ID  | Eval                            | Class     | Measures (statically, from source and compiled CSS)                                                                                    |
| --- | ------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| R01 | Enterprise Component Coverage   | roadmap   | `requirements.json` (§2.1, §5 of the document) against the inventory; delegated rows (platform, Data Grid, Charts, Maps) reported, not scored |
| R02 | Accessibility Contract          | movable   | ARIA set, feedback announced, focus managed (patterns); `.has-accessible-features` and `.os-high-contrast` styles (all components)     |
| R03 | Keyboard Operability            | movable   | required keys per interactive pattern (Enter/Space; Escape + tab order for overlays; Arrows + tab order for composite widgets)           |
| R04 | Theme Foundations               | movable   | the eight foundation rows present and consumed; per component: declared families tokened, dark-ready, RTL, reduced-motion guard          |
| R05 | Responsiveness and Density      | movable   | breakpoint rules where laying out; density axis where expected; RTL where directional                                                    |
| R06 | Feedback and State Behaviours   | movable   | hover, focus-visible, press/open, disabled, loading, invalid, guarded motion, each where applicable                                      |

**Classes.** `movable`: additive changes with no runtime or contract impact. `structural`: needs a documented
breaking change. `roadmap` (new here): new components or features, neither refactor nor breaking change.

**Scope.** Token theme only (`src/scss`; `classic-theme/` excluded). Requirements owned by other OutSystems
products are *delegated*: listed so the parity table matches the document, excluded from the score.

**Proxies, not conformance.** R02 and R03 detect that the contract is addressed in code; they do not prove
WCAG conformance or working keyboard behaviour. The planned dynamic phase (axe over the existing Storybook
stories, in the Chromatic workflow) will feed real violations into R02's detail.

**Maintaining `requirements.json`.** Each row has an owner, a status (`auto` lets the evidence rules decide;
`partial` / `missing` are hand-set with a reason) and evidence rules (`pattern`, `css`, `story`, `scss-text`,
`ts-text`, plain substring matches). A test fails when an evidence rule of a non-missing row stops matching,
so a renamed component is caught. Adding a component: add or update its row, run the evals.

Design and formulas: `docs-internal/ai-friendliness/2026-09-29-enterprise-readiness-evals-proposal.md`
(sections 3–4) and ADR-0012.
