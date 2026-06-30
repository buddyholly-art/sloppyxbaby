#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${1:-.}"
KIT_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$REPO_ROOT/docs/loop-engineering"
cp -R "$KIT_SOURCE"/README.md "$REPO_ROOT/docs/loop-engineering/README.md"
cp -R "$KIT_SOURCE"/AGENT_IMPLEMENTATION_PROMPT.md "$REPO_ROOT/docs/loop-engineering/AGENT_IMPLEMENTATION_PROMPT.md"
cp -R "$KIT_SOURCE"/repo-loop-implementation-guide.yaml "$REPO_ROOT/docs/loop-engineering/repo-loop-implementation-guide.yaml"
cp -R "$KIT_SOURCE"/repo-loop-audit-checklist.json "$REPO_ROOT/docs/loop-engineering/repo-loop-audit-checklist.json"
cp -R "$KIT_SOURCE"/loop-config.schema.json "$REPO_ROOT/docs/loop-engineering/loop-config.schema.json"
cp -R "$KIT_SOURCE"/repo-loop-audit-runner.py "$REPO_ROOT/docs/loop-engineering/repo-loop-audit-runner.py"

mkdir -p "$REPO_ROOT/loops"
if [ ! -d "$REPO_ROOT/loops/_template" ]; then
  cp -R "$KIT_SOURCE"/loops/_template "$REPO_ROOT/loops/_template"
fi

python3 "$REPO_ROOT/docs/loop-engineering/repo-loop-audit-runner.py" --repo "$REPO_ROOT"
