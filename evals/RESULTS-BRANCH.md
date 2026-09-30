# Eval runs recorded on dev

This branch is written by the `AI-friendliness gate` workflow on every push to `dev` (steps "Record
dev-<sha>" and "Publish to the evals-results branch"). It holds no source code; do not commit to it by hand.

| File                | Content                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `history.json`      | one entry per recorded run (`dev-<sha>`, plus the runs that were in the repository first) |
| `HISTORY.md`        | the same history rendered per suite                                                       |
| `dashboard.json`    | the data set of the dashboard, built from the newest run                                  |
| `latest.json`       | the newest full run with every per-component row                                          |
| `runs/<label>.json` | the last 20 recorded runs in full                                                         |

The gate of a pull request into `dev` compares with the newest entry here, so a PR is judged against
its base branch. How the suites, the gate and the dashboard work: `evals/README.md` on `dev`.
