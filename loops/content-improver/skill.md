# Skill: Content Improver

## Load state first

1. Read `state/attempts.jsonl` — note rubric scores and rejected phrasing.
2. Read target file path from user or last attempt.
3. Read SloppyXBaby voice rules: no purple gradients, no `#6366f1`, no fake stats, Soft Premium tone.

## One iteration

1. **Audit** — Run `verifier.py --file <path> --dry-run` for baseline metrics.
2. **Edit** — Tighten one section; remove filler; strengthen citations if claims present.
3. **Verify** — Run verifier without `--dry-run` (rubric uses heuristics; swap for LLM judge in production).
4. **Record** — Append to `state/attempts.jsonl`.
5. **Human gate** — If rubric 7–8 borderline, pause for human_gate per config.

## Banned patterns (auto-fail)

- `revolutionary`, `game-changing`, `unlock your potential`
- `#6366f1`, `indigo-500`, purple gradient marketing speak
- Unsourced percentages in user-facing copy

## Stop when

- Verifier `pass: true`, or
- Human rejects twice, or
- `max_iterations` reached.