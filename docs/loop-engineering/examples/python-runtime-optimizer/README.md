# Example: Python Runtime Optimizer

Tier **2** loop — clear numeric success criteria for a hot-path optimization task.

Copy this folder to `loops/python-runtime-optimizer/` when promoting from documentation example to a live loop.

## Success criteria

P99 latency on the benchmark fixture improves ≥ 5% vs baseline **and** all tests pass.

## Files

- `config.yaml` — schema-valid loop definition
- `skill.md` — agent instructions for one optimization iteration

## Run manually

```bash
# 1. Agent reads skill.md + state/attempts.jsonl
# 2. Agent proposes a code change
# 3. Verify
python3 ../../loops/code-performance-optimizer/verifier.py --fixture benchmarks/compile.json
```