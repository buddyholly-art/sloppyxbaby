# Loop: code-performance-optimizer

Tier **2** — optimize a hot path until P99 improves ≥ 5% vs baseline with all tests green.

## Recurring task

Performance regressions and optimization opportunities on compile/API hot paths. Manual profiling repeats weekly.

## Run

```bash
# Agent session: read skill.md, run one iteration, then:
python3 loops/code-performance-optimizer/verifier.py

# Audit
python3 scripts/loop-audit.py loops/code-performance-optimizer
```

## Journey stage

`skill` — manual agent iterations with verifier. Promote to `automate` after 3 consecutive audited passes.

## Agentic

Wire via [Claude Code Routine](../../docs/loop-engineering/agentic/claude-code-setup.md) or [LangGraph](../../docs/loop-engineering/agentic/langgraph-self-improving-loop.py).