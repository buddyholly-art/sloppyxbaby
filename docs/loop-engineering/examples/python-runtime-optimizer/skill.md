# Skill: Python Runtime Optimizer

## Scope

One iteration of hot-path performance optimization. Do not refactor unrelated modules.

## Preconditions

1. Read `state/attempts.jsonl` — note baseline P99 from iteration 0 and failed strategies.
2. Read `state/progress.md` if present.
3. Confirm `stop_conditions.max_iterations` not exceeded.

## Steps

1. **Profile** — Identify the slowest function in the target module (cProfile or existing benchmark).
2. **Hypothesize** — State one concrete change (algorithm, allocation, cache, I/O).
3. **Implement** — Minimal diff; no drive-by cleanup.
4. **Verify** — Run `python3 verifier.py` from the loop directory.
5. **Record** — Append to `state/attempts.jsonl`:

```json
{
  "ts": "<ISO8601>",
  "iteration": <n>,
  "hypothesis": "<one sentence>",
  "metrics": { "p99_ms": <n>, "p99_improvement_pct": <n>, "tests_pass": <bool> },
  "pass": <bool>,
  "git_sha": "<short>"
}
```

6. Update `state/progress.md` with what worked and what to avoid next run.

## Stop

- Verifier reports `pass: true`, OR
- `max_iterations` reached, OR
- User aborts.

On pass with `on_success: open_pr`, open a PR summarizing metrics delta and linking attempt records.

## Do not

- Change public API signatures without explicit approval
- Disable tests to greenwash metrics
- Repeat a hypothesis already marked failed in attempts.jsonl