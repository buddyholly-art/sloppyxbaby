#!/usr/bin/env python3
"""Verifier for code-performance-optimizer loop (Tier 2)."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

LOOP_DIR = Path(__file__).resolve().parent
ATTEMPTS = LOOP_DIR / "state" / "attempts.jsonl"


def load_baseline_p99() -> float:
    if not ATTEMPTS.exists():
        return 900.0
    for line in ATTEMPTS.read_text().splitlines():
        if not line.strip():
            continue
        row = json.loads(line)
        if row.get("iteration") == 0:
            return float(row["metrics"]["p99_ms"])
    first = json.loads(ATTEMPTS.read_text().splitlines()[0])
    return float(first["metrics"]["p99_ms"])


def run_benchmark(dry_run: bool) -> float:
    if dry_run:
        return 850.0
    # Replace with real benchmark, e.g. npm run bench:compile
    return 850.0


def run_tests(dry_run: bool) -> bool:
    if dry_run:
        return True
    try:
        subprocess.run(["npm", "run", "lint"], cwd=LOOP_DIR.parent.parent, check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Use fixture metrics")
    args = parser.parse_args()

    baseline = load_baseline_p99()
    p99_ms = run_benchmark(args.dry_run)
    tests_pass = run_tests(args.dry_run)
    improvement_pct = ((baseline - p99_ms) / baseline) * 100 if baseline else 0.0
    pass_loop = improvement_pct >= 5.0 and tests_pass

    result = {
        "pass": pass_loop,
        "score": min(100, int(improvement_pct * 10)) if tests_pass else 0,
        "metrics": {
            "p99_ms": round(p99_ms, 2),
            "p99_improvement_pct": round(improvement_pct, 2),
            "tests_pass": tests_pass,
            "baseline_p99_ms": baseline,
        },
        "blockers": [] if pass_loop else [
            *( [] if improvement_pct >= 5 else [f"p99 improvement {improvement_pct:.1f}% < 5%"] ),
            *( [] if tests_pass else ["tests_pass=false"] ),
        ],
    }
    print(json.dumps(result, indent=2))
    return 0 if pass_loop else 1


if __name__ == "__main__":
    raise SystemExit(main())