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
  - docs/loop-engineering/repo-loop-implementation-guide.yaml
  - docs/LLM_CONTEXT_ENGINEERING_TACTICS.md
  - loops/README.md
---

# Loop Engineering Toolkit

Production-ready guidance for building **self-improving agent loops** — human-readable playbooks plus machine-auditable schemas. Installed from the [repo-loop-engineering-kit](combined-guide.md) (source: `~/Downloads/Loop Engineering/repo-loop-engineering-kit.zip`).

## Audit the repo

```bash
python3 docs/loop-engineering/repo-loop-audit-runner.py --repo .
# Per-loop deep audit (optional):
python3 scripts/loop-audit.py loops/code-performance-optimizer
```

Results: `docs/loop-engineering/audit-results/latest.json`

## Deliverables

| File | Type | Purpose |
|------|------|---------|
| [implementation-guide.md](./implementation-guide.md) | Human guide | 4 phases, hero's journey, tiers, anti-patterns |
| [repo-loop-implementation-guide.yaml](./repo-loop-implementation-guide.yaml) | **Machine-readable** | Repo contract, phases, tiers, state patterns, promotion gates |
| [repo-loop-audit-checklist.json](./repo-loop-audit-checklist.json) | **Machine-readable** | Canonical audit checks for CI and agents |
| [loop-audit-checklist.json](./loop-audit-checklist.json) | **Machine-readable** | Extended per-check scoring (25+ items) |
| [loop-config.schema.json](./loop-config.schema.json) | JSON Schema | Validates `loops/<name>/config.yaml` |
| [repo-loop-audit-runner.py](./repo-loop-audit-runner.py) | Script | Zero-dep repo + loop audit |
| [AGENT_IMPLEMENTATION_PROMPT.md](./AGENT_IMPLEMENTATION_PROMPT.md) | Agent prompt | Paste into coding agents to install/verify kit |
| [install.sh](./install.sh) | Installer | Copy kit into another repo |
| [combined-guide.md](./combined-guide.md) | Single-file export | Full kit in one markdown doc |
| [agentic/](./agentic/) | Agentic setup | Claude Code Routines + LangGraph examples |

## `loops/` folder (repo root)

| Path | Purpose |
|------|---------|
| `loops/_template/` | Copy for every new loop |
| `loops/example-python-runtime-optimizer/` | Kit reference (Tier 2, sample `attempts.jsonl`) |
| `loops/code-performance-optimizer/` | SloppyXBaby hot-path optimizer |
| `loops/content-improver/` | Hybrid copy/anti-slop loop |
| `loops/TEMPLATE.md` | Markdown scaffold (legacy; prefer `_template/`) |

## Quick start

1. Copy `loops/_template` → `loops/<your-loop>/`
2. Fill `config.yaml` (validated against schema)
3. Write `skill.md` + `verifier.py`
4. Run audit before promoting:

```bash
python3 docs/loop-engineering/repo-loop-audit-runner.py --repo .
```

## For agents

Load in order:

1. `AGENT_IMPLEMENTATION_PROMPT.md` — install/verify contract
2. `repo-loop-implementation-guide.yaml` — machine-readable rules
3. `implementation-guide.md` — narrative playbook
4. Target loop's `skill.md` + `config.yaml`

Agentic wiring: [agentic/claude-code-setup.md](./agentic/claude-code-setup.md)

## Core rule

> Do not automate until success criteria, state, verification, and stop conditions are explicit.