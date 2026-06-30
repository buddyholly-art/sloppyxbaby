# Skill: Python Runtime Optimizer

PURPOSE:
Optimize a target Python file using measured attempts, not guessing.

PROCESS:
1. Read `config.yaml`.
2. Record baseline benchmark and tests.
3. Make one minimal optimization attempt.
4. Run tests.
5. Run benchmark.
6. Run verifier.
7. Append attempt record to `state/attempts.jsonl`.
8. Continue only if budget remains and failure is not repeated.

DO NOT:
- Disable tests.
- Change public API without corresponding tests.
- Report success without verifier evidence.
