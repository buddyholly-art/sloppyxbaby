# Claude Code: Agentic Loop Setup

Production pattern for Loop Engineering on Claude Code (Routines, `/goal`, Skills, repo state). Matches how power users ship self-improving loops in 2026 without custom orchestration infra.

## Architecture mapping

| Loop phase | Claude Code primitive |
|------------|----------------------|
| Trigger | **Routine** (scheduled or event) |
| Execution | **Skill** (`skill.md` in repo) |
| Verification | **`/goal`** success condition + `verifier.py` |
| State | `loops/<name>/state/attempts.jsonl` + `progress.md` |

## Directory layout

```
loops/code-performance-optimizer/
├── config.yaml
├── skill.md
├── verifier.py
└── state/
    ├── attempts.jsonl
    └── progress.md
```

Commit `skill.md` and `verifier.py`. Gitignore runtime `attempts.jsonl`.

## Routine prompt (copy-paste template)

Create a Routine in Claude Code (cloud or local) with:

```markdown
# Loop: code-performance-optimizer

You are running iteration {{iteration}} of a self-improving optimization loop.

## Load
1. Read `loops/code-performance-optimizer/skill.md` — follow exactly.
2. Read `loops/code-performance-optimizer/state/attempts.jsonl` — last 5 attempts.
3. Read `loops/code-performance-optimizer/config.yaml` — respect stop_conditions.

## Execute
Run one optimization iteration per skill.md. Work on branch `claude/optimizer-{{date}}`.

## Verify
Run: `python3 loops/code-performance-optimizer/verifier.py --repo .`

## Goal
Use /goal with condition:
"P99 improved >= 5% vs baseline in attempts.jsonl[0] AND verifier reports tests_pass=true, OR stop after 8 turns."

## State
Append this iteration to state/attempts.jsonl before ending.
Update state/progress.md with failed hypotheses to avoid.

## Stop
- Success condition met → commit, push branch, summarize metrics
- max_iterations (8) → stop and report best attempt
- max_cost_usd exceeded → stop immediately
```

## `/goal` as verifier loop

`/goal` is the built-in iterative engine:

1. You define a **clear success condition** once (natural language tied to metrics).
2. A fast evaluator checks after every turn.
3. Claude keeps working until success or turn cap.

**Bind `/goal` to real metrics** — never "user seems happy":

```
/goal P99 latency on benchmarks/compile.json improved >= 5% vs baseline 
recorded in loops/code-performance-optimizer/state/attempts.jsonl line 1 
AND python3 loops/code-performance-optimizer/verifier.py exits 0
```

## Skills

Convert `loops/<name>/skill.md` to a Claude Code skill:

```bash
mkdir -p .claude/skills/code-performance-optimizer
cp loops/code-performance-optimizer/skill.md .claude/skills/code-performance-optimizer/SKILL.md
```

Add YAML frontmatter per Claude skill spec. The Routine references the skill by name.

## State persistence

Claude Code sessions compact; **repo files are the memory**:

| File | Purpose |
|------|---------|
| `attempts.jsonl` | Machine-readable iteration log |
| `progress.md` | Narrative: what failed, what to try next |
| Git branch | Code state for the loop |

Optional: Google Drive / Linear connectors for cross-session context — repo files remain SSOT for metrics.

## Example session flow

```bash
# Manual iteration (journey_stage: skill)
claude
> Read loops/code-performance-optimizer/skill.md and run iteration 1.
> After edits, run verifier.py and append to state/attempts.jsonl.

# Automated (journey_stage: automate)
# Create Routine with prompt above; schedule nightly or on `perf` label.
```

## PR automation

When `stop_conditions.on_success: open_pr`:

1. Routine completes with `pass: true`
2. Push `claude/optimizer-*` branch
3. Open PR with body template from last attempt's metrics

## Checklist before enabling Routine

- [ ] `verifier.py` passes locally on fixture
- [ ] `attempts.jsonl` has baseline row (iteration 0)
- [ ] `max_iterations` and `max_cost_usd` set in config.yaml
- [ ] `python3 scripts/loop-audit.py loops/code-performance-optimizer` ≥ 80 score

## Hybrid with LangGraph

Use Claude Routines for **scheduling + high-level goal** and LangGraph for **inner multi-node graphs** (generator → critic → router). See [langgraph-self-improving-loop.py](./langgraph-self-improving-loop.py).