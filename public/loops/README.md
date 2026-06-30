# Loops

Self-improving agent loops for this repository. Each subdirectory is one loop with its own success criteria, skill, verifier, and state.

## Philosophy

A loop is **Trigger → Skill → Verify → State**. If verification or state is missing, you have a retry machine — not a loop.

Read the full playbook: [docs/loop-engineering/implementation-guide.md](../docs/loop-engineering/implementation-guide.md).

## Included examples

| Loop | Tier | Best for |
|------|------|----------|
| [code-performance-optimizer](./code-performance-optimizer/) | 2 | Code, benchmarks, tests |
| [content-improver](./content-improver/) | 3–4 | Copy, docs, hybrid LLM + human gate |

## Add a new loop

```bash
cp -r _template my-new-loop
# Edit README.md, config.yaml, skill.md, verifier.py
python3 docs/loop-engineering/repo-loop-audit-runner.py --repo .
python3 scripts/loop-audit.py my-new-loop
```

Or copy an example folder (`example-python-runtime-optimizer`, `code-performance-optimizer`) and rename.

## Implementation journey

1. **Manual** — you run the task; define metrics
2. **Skill** — `skill.md` drives agent iterations
3. **Automate** — GitHub Action or Claude Routine trigger
4. **Self-improve** — state feeds back every run

Set `journey_stage` in `config.yaml` honestly. Do not skip stages.

## Audit before production

```bash
python3 scripts/loop-audit.py loops/<name>
```

Checklist source: [docs/loop-engineering/loop-audit-checklist.json](../docs/loop-engineering/loop-audit-checklist.json).

## Agentic wiring

- Claude Code: [docs/loop-engineering/agentic/claude-code-setup.md](../docs/loop-engineering/agentic/claude-code-setup.md)
- LangGraph: [docs/loop-engineering/agentic/langgraph-self-improving-loop.py](../docs/loop-engineering/agentic/langgraph-self-improving-loop.py)