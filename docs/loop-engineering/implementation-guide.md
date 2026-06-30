---
title: Loop Engineering Implementation Guide
doc_id: howto-loop-engineering-implementation
triadic_leg: diataxis
diataxis_mode: solve
canonical_path: docs/loop-engineering/implementation-guide.md
status: active
owner: shared
last_reviewed: 2026-06-30
canonical: true
related_docs:
  - docs/loop-engineering/README.md
  - loops/README.md
---

# Loop Engineering Implementation Guide

How to build agent loops that **improve over time** instead of burning tokens on blind retries.

## The problem

Most "agent loops" are:

```
prompt → output → prompt again → output again → …
```

No scored verification. No memory. No learning. Cost compounds; quality does not.

Loop Engineering replaces that with a **designed system**:

```
Trigger → Skill (execute) → Verify (score) → State (remember) → repeat
```

## Four phases

### 1. Trigger

What starts the loop?

| Type | When to use |
|------|-------------|
| `manual` | Journey stage: manual or skill |
| `cron` / `routine` | Scheduled improvement passes |
| `github_event` | PR opened, CI failed, label applied |
| `webhook` | External system signal |
| `pr_comment` | Human invokes `/loop run` |

**Rule:** Do not automate the trigger until the skill and verifier work manually.

### 2. Execution (via Skills)

Execution is **not** a giant system prompt. It is a **versioned skill** (`skill.md` or `.claude/skills/…`) that:

- Loads prior state first
- Performs one focused transformation
- Stays narrow (one loop = one job)
- Declares model tier and turn budget

Skills are committed to git. Agents read the same instructions every run.

### 3. Verification

Every iteration must be **scored** before the next one starts.

The verifier (`verifier.py`, CI job, or `/goal` condition) returns:

```json
{
  "pass": false,
  "score": 72,
  "metrics": { "p99_ms": 842, "tests_pass": true },
  "blockers": ["p99 regression vs baseline"]
}
```

**No verifier → not a loop.** It is a chat session.

### 4. State / Memory

Append each attempt to `state/attempts.jsonl`:

```json
{"ts":"2026-06-30T14:00:00Z","iteration":3,"metrics":{"p99_ms":812},"pass":false,"summary":"Reduced allocations in hot path","git_sha":"abc123"}
```

Next run **reads** this file (or a RAG index built from it) and avoids repeating failed strategies.

State patterns:

| Pattern | Best for |
|---------|----------|
| `attempts.jsonl` | Numeric metrics, iteration history |
| `progress.md` | Human-readable narrative + agent context |
| Git diff / branch | Code-changing loops |
| RAG over past attempts | Fuzzy domains with long history |
| External (Linear, Drive) | Cross-repo or stakeholder state |

## Hero's journey (implementation order)

Do **not** jump to full automation.

| Stage | You do | Artifact |
|-------|--------|----------|
| **1. Manual** | Run the task yourself; note what "done" means | Notes, first metrics |
| **2. Codify skill** | Write `skill.md`; agent runs one iteration | `loops/<name>/skill.md` |
| **3. Automate** | Wire trigger + verifier in CI or Routine | `config.yaml`, workflow |
| **4. Self-improve** | Feed state back; track best attempt | `attempts.jsonl`, regression guards |

Promote stages only after the audit checklist passes at the current level.

## Five-tier success criteria

Prefer **Tier 1–3**. Tier 4–5 require explicit human gates.

| Tier | Name | Example | Verifier |
|------|------|---------|----------|
| **1** | Deterministic | `npm test` exit 0 | Shell / CI |
| **2** | Clear numeric | P99 latency ≤ 800ms | Benchmark script |
| **3** | Hybrid | Tests pass + LLM rubric score ≥ 8/10 | Script + judge |
| **4** | Fuzzy | "Reads on-brand" | LLM judge + spot check |
| **5** | Subjective | "Stakeholder approves" | Human gate only |

**Transcript warning:** Tier 4–5 loops without state devolve into expensive opinion roulette.

### Writing good criteria

**Bad:** "Make the code better."

**Good:** "P99 request latency ≤ 800ms on `/api/compile` fixture AND all unit tests pass."

Each metric needs: `id`, `type`, `target`, and an implementation in `verifier.py`.

## When NOT to build a loop

Skip the loop if:

- The task happens once per quarter
- Success cannot be defined even at Tier 4 with a human gate
- A single well-crafted prompt suffices
- Verification cost exceeds manual fix cost
- You cannot persist state (ephemeral sandbox with no export)

Use a **one-shot skill** instead.

## Decision framework

```
Is the task recurring?
  No  → one-shot skill or manual
  Yes → Can you define pass/fail?
          No  → stop; define done first
          Yes → Tier 1–3?
                  Yes → build loop (skill → verify → state)
                  No  → require human_gate in config
```

## Recommended repo structure

```
repo/
├── docs/loop-engineering/     # Toolkit (this guide, schema, checklist)
├── loops/
│   ├── README.md
│   ├── TEMPLATE.md
│   └── <loop-name>/
│       ├── README.md
│       ├── config.yaml        # Validated against schema
│       ├── skill.md
│       ├── verifier.py
│       └── state/
│           └── attempts.jsonl # gitignored at runtime
├── scripts/
│   └── loop-audit.py          # Consumes audit checklist
└── .github/workflows/
    └── loop-<name>.yml        # Optional trigger
```

## Anti-patterns

| Anti-pattern | Why it fails | Fix |
|--------------|--------------|-----|
| Infinite retry until lucky | No learning | Verifier + max_iterations |
| Success = model says "done" | Sycophancy | Tier 1–2 metrics |
| New prompt every run | No compounding | Read `attempts.jsonl` first |
| One mega-skill | Scope creep | Split loops |
| No cost ceiling | Runaway spend | `max_cost_usd`, token budgets |
| State in chat only | Lost on compaction | Persist to repo files |
| Automate before manual proof | Wrong skill baked in | Journey stage discipline |

## Quick-start checklist

- [ ] Recurring task justified (LJ-01)
- [ ] Success statement + tier chosen (SC-01, SC-02)
- [ ] `skill.md` written and narrow (TE-02)
- [ ] `verifier.py` returns structured pass/fail (SC-04)
- [ ] `state/attempts.jsonl` append documented (SM-02)
- [ ] `max_iterations` set (SS-01)
- [ ] `python3 scripts/loop-audit.py loops/<name>` passes
- [ ] Trigger wired only at `automate` stage or later

## Agentic setup (production)

For real 2026 deployments, see:

- [agentic/claude-code-setup.md](./agentic/claude-code-setup.md) — Routines, `/goal`, repo state
- [agentic/langgraph-self-improving-loop.py](./agentic/langgraph-self-improving-loop.py) — explicit graph control

## SloppyXBaby alignment

The landing page Loop Engineering section maps directly:

| UI label | Phase |
|----------|-------|
| Trigger | `phases.trigger` |
| Skill | `phases.execution` |
| Verify | `phases.verification` |
| State | `phases.state` |

The Prompt Advocate compiler is itself a Tier 3 loop: bloat score, voice consistency, guardrail compliance — scored, stored, improved.