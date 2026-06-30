# Skill: Code Performance Optimizer

## Load state first

1. Read `state/attempts.jsonl` — baseline is iteration 0; never repeat failed hypotheses.
2. Read `state/progress.md` if it exists.
3. Read `config.yaml` stop_conditions.

## One iteration

1. Identify hot path (profile or read last attempt's notes).
2. Propose **one** measurable change.
3. Implement minimal diff.
4. Run `python3 verifier.py` from this directory.
5. Append attempt record to `state/attempts.jsonl`.
6. Update `state/progress.md` with learnings.

## Attempt record schema

```json
{
  "ts": "ISO8601",
  "iteration": 1,
  "hypothesis": "string",
  "metrics": {
    "p99_ms": 0,
    "p99_improvement_pct": 0,
    "tests_pass": true
  },
  "pass": false
}
```

## Stop when

- Verifier returns `"pass": true`, or
- `max_iterations` reached, or
- cost/duration ceiling hit.