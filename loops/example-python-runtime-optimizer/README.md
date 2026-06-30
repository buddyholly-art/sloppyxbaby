# Example Loop: Python Runtime Optimizer

This loop demonstrates a bounded optimization loop with deterministic and numeric success criteria.

## Goal

Improve a Python script's runtime while preserving correctness.

## Verification tier

Tier 2: numeric.

## Success criteria

- Existing tests pass.
- Runtime improves by at least 10%.
- No forbidden files are modified.
- Attempt history is written to `state/attempts.jsonl`.

## Run verifier

```bash
python3 loops/example-python-runtime-optimizer/verifier.py
```
