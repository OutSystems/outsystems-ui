#!/usr/bin/env bash
# Publish the result files of the run just recorded to the orphan branch $RESULTS_BRANCH (default
# evals-results): history.json, HISTORY.md, dashboard.json, latest.json, README.md and the last
# $KEEP_RUNS run files under runs/. Built with git plumbing on a temporary index on top of the previous
# branch commit (none the first time), so the working tree is never touched and no checkout is needed.
#
#   RESULTS_BRANCH=evals-results KEEP_RUNS=20 bash evals/tools/publish-results.sh [--dry-run]
#
# --dry-run builds the commit and prints its tree without pushing (used by the local check).
set -euo pipefail

branch="${RESULTS_BRANCH:-evals-results}"
keep="${KEEP_RUNS:-20}"
results="evals/results"
dry_run=0
[ "${1:-}" = "--dry-run" ] && dry_run=1

label="$(node -e "const h=require('./$results/history.json');const s=[...h].sort((a,b)=>a.date.localeCompare(b.date));console.log(s[s.length-1].label)")"
for f in history.json HISTORY.md dashboard.json latest.json "$label.json"; do
	[ -f "$results/$f" ] || { echo "missing $results/$f" >&2; exit 1; }
done

export GIT_INDEX_FILE="${RUNNER_TEMP:-/tmp}/evals-results.index"
rm -f "$GIT_INDEX_FILE"
parent=""
if git fetch --quiet origin "$branch" 2>/dev/null; then
	parent="$(git rev-parse "origin/$branch")"
	git read-tree "$parent"
else
	git read-tree --empty
fi

add() {
	git update-index --add --cacheinfo "100644,$(git hash-object -w "$1"),$2"
}
add "$results/history.json" history.json
add "$results/HISTORY.md" HISTORY.md
add "$results/dashboard.json" dashboard.json
add "$results/latest.json" latest.json
add "$results/$label.json" "runs/$label.json"
add evals/RESULTS-BRANCH.md README.md

# keep the newest $keep run files, by the date recorded in history.json
for stale in $(node -e "const h=require('./$results/history.json');const s=[...h].sort((a,b)=>b.date.localeCompare(a.date)).map((e)=>e.label);console.log(s.slice($keep).join(' '))"); do
	git update-index --force-remove "runs/$stale.json" 2>/dev/null || true
done

tree="$(git write-tree)"
message="evals: record $label"
if [ -n "$parent" ]; then
	commit="$(git commit-tree "$tree" -p "$parent" -m "$message")"
else
	commit="$(git commit-tree "$tree" -m "$message")"
fi
rm -f "$GIT_INDEX_FILE"

echo "$branch: $message → $commit"
git ls-tree --name-only -r "$tree"
if [ "$dry_run" = "1" ]; then
	echo "dry run: not pushed"
	exit 0
fi
git push --quiet origin "$commit:refs/heads/$branch"
