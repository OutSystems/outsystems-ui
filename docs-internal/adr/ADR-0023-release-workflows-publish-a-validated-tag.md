<!-- This ADR documents how the docs and npm release workflows choose what they publish -->

# ADR-0023: Release workflows publish a validated tag

## Status

Proposed

## Context

`create-n-deploy-docs.yaml` failed on every run since 2026-02 and `create-n-deploy-npm.yaml` since `ubuntu-latest` moved to Ubuntu 26.04 (ROU-13219):

- `docs/` is gitignored, so the signed commit to the intermediate `deploy-docs` branch had nothing to commit.
- `GuillaumeFalourd/copy-push-files` (2022) breaks with the credentials `actions/checkout` v7 stores.
- The 26.04 runner image no longer installs `gulp` globally.
- Without a `files` whitelist, the npm package would ship 863 files, including `.claude/`, `stories/` and `tests/`. The `prepareToDeploy` remove list had not kept up with new folders.

Both workflows took any ref as input and created a `deploy-docs` / `deploy-npm` branch from it. Passing those names, or a branch left behind by a failed run, broke the next run.

The Azure federated credential only accepts `dev`. The workflow definition therefore always comes from `dev`, while the content comes from the input ref. A file changed on `dev` (`package.json`, a gulp task) does not apply when an older tag is published.

## Decision Drivers

- The docs site and the npm package match a released version exactly.
- The fix works for tags created before it (e.g. `v3.0.0`).
- Fewer moving parts and no third-party action holding a write token.
- Keep npm trusted publishing (bound to the workflow file name) and provenance.

## Considered Options

- **Input**
    - Any ref (as before). Pros: flexible. Cons: can publish unreleased code; branch-name collisions.
    - A release tag, validated (`vX.Y.Z`, equal to `package.json` `version` at that tag). Pros: what is published is what was released. Cons: no publishing from `rc*` branches (never used; npm has no pre-release versions).
- **Docs publishing**
    - Repair the existing chain (force-add `docs/`, replace the copy action). Cons: keeps the intermediate branch and a third-party action with the token.
    - One job: generate from the tag, clone the docs repository, replace its content, push. Pros: no intermediate branch; stale pages are removed; `.nojekyll` is kept. Cons: the docs-site commit is an unsigned bot commit.
- **npm package content**
    - `files` in `package.json` on `dev`. Cons: does not reach existing tags.
    - Extend the `prepareToDeploy` remove list. Cons: a blacklist that drifts again; does not reach existing tags either.
    - Whitelist set by the workflow (`npm pkg set files[]=dist files[]=src`). Pros: applies to any tag. Cons: the rule lives in the workflow, not in `package.json`.

## Decision Outcome

Chosen: validated release tag, single-job docs publishing, and the workflow-level whitelist. Also: the project's local `gulp` binary (`./node_modules/.bin/gulp`) instead of a global `gulp`, Node 24 set explicitly, `npm pack --dry-run` logged before publishing, and the `deploy-npm` cleanup runs after failures too.

Positive consequences:

- The docs site and the npm package always correspond to a tag whose version matches.
- `v3.0.0` can be published without changing the tag.
- No `deploy-docs` branch; `deploy-npm` no longer outlives a failed run.

Negative consequences:

- Docs improvements merged to `dev` (e.g. the TypeDoc theme, ROU-13061) reach the site only with the next release.
- Both workflows stay manual. Triggering them on `release: published` needs an Azure federated credential for tag refs.
- The docs site receives unsigned commits from UiComponentsBot.
- Write access of the Key Vault GitHub token to the docs repository is confirmed only on the first run.
