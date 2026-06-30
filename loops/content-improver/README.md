# Loop: content-improver

Tier **3–4** — improve landing or docs copy with hybrid verification (rubric + optional human gate).

## Recurring task

Marketing copy, README sections, and product descriptions need iterative tightening against voice rules and bloat metrics.

## Run

```bash
python3 loops/content-improver/verifier.py --file src/pages/LandingPageManual.tsx --dry-run
python3 scripts/loop-audit.py loops/content-improver
```

## Journey stage

`skill` — agent iterations with rubric verifier. Human gate required before `automate` for Tier 4 brand voice.

## Why hybrid

Brand voice has fuzzy edges (Tier 4), but bloat score and banned-pattern checks are deterministic (Tier 2). The verifier combines both.