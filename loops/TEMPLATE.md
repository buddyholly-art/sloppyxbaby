# Loop: <name>

> Copy this file to `loops/<name>/README.md` and replace placeholders.

## Purpose

**Recurring task:** <what happens weekly/daily/per-PR>

**Why a loop:** <why one-shot prompting fails; cost of manual repetition>

## Success criteria

- **Tier:** <1–5>
- **Statement:** <one testable sentence>
- **Metrics:** <list ids from config.yaml>

## Journey stage

Current: `manual` | `skill` | `automate` | `self_improve`

**Next upgrade:** <what must pass before promoting>

## Prerequisites

- <runtime, env vars, fixtures>

## Run manually

```bash
# 1. Agent reads skill.md + state/attempts.jsonl
# 2. One iteration per skill.md
# 3. Verify
python3 loops/<name>/verifier.py
```

## Verify

```bash
python3 loops/<name>/verifier.py --dry-run
python3 scripts/loop-audit.py loops/<name>
```

## State

Append each attempt to `state/attempts.jsonl`:

```json
{"ts":"","iteration":0,"hypothesis":"","metrics":{},"pass":false}
```

## Stop conditions

From `config.yaml`: max_iterations, max_cost_usd, on_success.

## Anti-patterns

See [implementation guide](../docs/loop-engineering/implementation-guide.md#anti-patterns).

## Files

| File | Role |
|------|------|
| `config.yaml` | Loop contract (schema-validated) |
| `skill.md` | Agent execution instructions |
| `verifier.py` | Scoring / pass-fail |
| `state/attempts.jsonl` | Iteration memory (gitignored) |