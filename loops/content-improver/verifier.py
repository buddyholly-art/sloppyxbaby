#!/usr/bin/env python3
"""Verifier for content-improver loop (Tier 3 hybrid)."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

BANNED_PHRASES = [
    "revolutionary",
    "game-changing",
    "unlock your potential",
    "#6366f1",
    "indigo-500",
]
FILLER = [
    "in order to",
    "it is important to note",
    "leverage",
    "utilize",
    "at the end of the day",
]


def score_bloat(text: str) -> int:
    lower = text.lower()
    return sum(lower.count(f) for f in FILLER) * 3 + max(0, len(text.split()) - 500) // 50


def has_banned_patterns(text: str) -> bool:
    lower = text.lower()
    return any(p in lower for p in BANNED_PHRASES)


def rubric_heuristic(text: str, bloat: int) -> float:
    """Replace with LLM judge in production automate stage."""
    score = 10.0
    score -= min(4, bloat * 0.2)
    if "citation" in text.lower() or "cite" in text.lower():
        score += 0.5
    if len(text) < 100:
        score -= 2
    return max(0, min(10, round(score, 1)))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.file.exists():
        print(json.dumps({"pass": False, "error": f"file not found: {args.file}"}))
        return 2

    text = args.file.read_text()
    bloat = score_bloat(text)
    banned = has_banned_patterns(text)
    rubric = rubric_heuristic(text, bloat) if not args.dry_run else 8.5

    pass_loop = bloat <= 15 and not banned and rubric >= 8.0

    result = {
        "pass": pass_loop,
        "score": int(rubric * 10),
        "metrics": {
            "bloat_score": bloat,
            "banned_patterns": banned,
            "rubric_score": rubric,
        },
        "blockers": [
            *( [f"bloat_score {bloat} > 15"] if bloat > 15 else [] ),
            *( ["banned_patterns detected"] if banned else [] ),
            *( [f"rubric {rubric} < 8"] if rubric < 8 else [] ),
        ],
    }
    print(json.dumps(result, indent=2))
    return 0 if pass_loop else 1


if __name__ == "__main__":
    raise SystemExit(main())