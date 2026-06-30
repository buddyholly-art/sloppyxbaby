---
title: Loop Engineering Toolkit
doc_id: reference-loop-engineering-toolkit
triadic_leg: diataxis
diataxis_mode: lookup
canonical_path: docs/loop-engineering/README.md
status: active
owner: shared
last_reviewed: 2026-06-30
canonical: true
related_docs:
  - docs/loop-engineering/implementation-guide.md
  - docs/LLM_CONTEXT_ENGINEERING_TACTICS.md
  - loops/README.md
---

# Loop Engineering Toolkit

Production-ready guidance for building **self-improving agent loops** — human-readable playbooks plus machine-auditable schemas. SloppyXBaby ships this toolkit in-repo so agents and humans share the same contract.

## What is a loop?

A loop is not "run the agent again." It is a closed system:

**Trigger → Skill (execution) → Verification → State/Memory → repeat**

Without clear success criteria and persisted state, loops become expensive retry machines that never improve.

## Deliverables in this folder

| File | Type | Purpose |
|------|------|---------|
| [implementation-guide.md](./implementation-guide.md) | Guide | Full playbook: 4 phases, hero's journey, success-criteria tiers, decision frameworks, anti-patterns |
| [loop-audit-checklist.json](./loop-audit-checklist.json) | Machine-readable | 7 categories, 25+ checks with severity, verification steps, scoring |
| [loop-config.schema.json](./loop-config.schema.json) | JSON Schema | Validate `loops/<name>/config.yaml` |
| [examples/python-runtime-optimizer/](./examples/python-runtime-optimizer/) | Example | Tier-2 optimization loop (config + skill stub) |
| [agentic/claude-code-setup.md](./agentic/claude-code-setup.md) | Agentic | Routines + `/goal` + skills + repo state (2026 Claude Code pattern) |
| [agentic/langgraph-self-improving-loop.py](./agentic/langgraph-self-improving-loop.py) | Agentic | Runnable LangGraph graph with persistence and stop conditions |

## Drop-in `loops/` folder

Copy-ready loop instances live at the **repo root**: [`../../loops/`](../../loops/).

```
loops/
├── README.md
├── TEMPLATE.md
├── code-performance-optimizer/   # Tier 2 — deterministic metrics
└── content-improver/             # Tier 3–4 — hybrid + human gate
```

Each loop includes `config.yaml`, `skill.md`, `verifier.py`, and `state/` for `attempts.jsonl`.

## Quick start

1. Read [implementation-guide.md](./implementation-guide.md).
2. Copy `loops/TEMPLATE.md` → `loops/<your-loop>/`.
3. Author `config.yaml` and validate against [loop-config.schema.json](./loop-config.schema.json).
4. Run the audit:

```bash
python3 scripts/loop-audit.py loops/<your-loop>
```

5. Wire a trigger (GitHub Actions, Claude Routine, cron, PR bot).

## For agents

When building or reviewing a loop, load:

1. `implementation-guide.md` — rules of the road
2. `loop-audit-checklist.json` — pass/fail gates
3. The target loop's `config.yaml` + `skill.md`

Point coding agents (Claude Code, Cursor, Hermes) at [agentic/claude-code-setup.md](./agentic/claude-code-setup.md) for production scheduling patterns.

## Core principle (from the transcript)

> Design the loop — don't just prompt. Most failures come from jumping to automation without measurable success criteria or state that compounds learning.