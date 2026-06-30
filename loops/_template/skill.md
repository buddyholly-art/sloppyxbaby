# Skill: Replace Me Loop

PURPOSE:
Execute exactly the loop defined in `config.yaml`.

RULES:
- Read `config.yaml` before doing work.
- Do not expand scope.
- Do not use forbidden actions.
- Write attempt evidence to `state/attempts.jsonl`.
- Run the verifier command before reporting success.
- Stop when any stop condition is met.

OUTPUT:
Return status, files changed, verifier result, and next adjustment.
