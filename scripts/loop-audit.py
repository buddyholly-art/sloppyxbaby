#!/usr/bin/env python3
"""
Consume docs/loop-engineering/loop-audit-checklist.json against loops/<name>/.

Usage:
  python3 scripts/loop-audit.py loops/code-performance-optimizer
  python3 scripts/loop-audit.py loops/content-improver --json
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CHECKLIST = REPO / "docs" / "loop-engineering" / "loop-audit-checklist.json"
SCHEMA = REPO / "docs" / "loop-engineering" / "loop-config.schema.json"


def load_yaml_config(loop_dir: Path) -> dict | None:
    config_path = loop_dir / "config.yaml"
    if not config_path.exists():
        return None
    text = config_path.read_text()
    try:
        import yaml  # type: ignore
        parsed = yaml.safe_load(text) or {}
        if isinstance(parsed, dict):
            parsed["_raw"] = text
            return parsed
    except ImportError:
        pass
    return {"_raw": text, "name": loop_dir.name}


def check_file(loop_dir: Path, rel: str) -> bool:
    return (loop_dir / rel).exists()


def run_verifier_dry(loop_dir: Path) -> bool:
    verifier = loop_dir / "verifier.py"
    if not verifier.exists():
        return False
    cmd = [sys.executable, str(verifier), "--dry-run"]
    readme = loop_dir / "README.md"
    if loop_dir.name == "content-improver" and readme.exists():
        cmd.extend(["--file", str(readme)])
    try:
        proc = subprocess.run(
            cmd,
            cwd=loop_dir,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if proc.returncode not in (0, 1):
            return False
        out = proc.stdout.strip()
        return "pass" in out and "metrics" in out
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False


def audit_loop(loop_dir: Path) -> dict:
    checklist = json.loads(CHECKLIST.read_text())
    config = load_yaml_config(loop_dir)
    results: list[dict] = []
    weights = checklist["scoring"]["weights"]

    def add(check_id: str, severity: str, passed: bool, note: str = ""):
        results.append({"id": check_id, "severity": severity, "pass": passed, "note": note})

    # Structural checks mapped to checklist IDs
    add("LJ-03", "medium", config is not None, "config.yaml missing" if not config else "")
    raw = (config or {}).get("_raw", "")
    sc_ok = config is not None and (
        "success_criteria" in (config or {})
        or "verification:" in raw
        or "verifier_command:" in raw
    )
    add("SC-01", "critical", sc_ok, "success_criteria or verification block")
    add("SC-03", "critical", check_file(loop_dir, "verifier.py"), "verifier.py")
    add("SC-04", "high", run_verifier_dry(loop_dir), "verifier dry-run output")
    add("SM-01", "critical", check_file(loop_dir, "state") or check_file(loop_dir, "state/.gitkeep"), "state/")
    add("TE-02", "high", check_file(loop_dir, "skill.md"), "skill.md")
    add("DOC-01", "high", check_file(loop_dir, "README.md"), "README.md")
    add("DOC-02", "medium", config is not None, "schema validation manual")
    add("IJ-02", "medium", check_file(loop_dir, "skill.md"), "skill before automate")

    earned = 0
    possible = 0
    critical_fails = 0
    high_fails = 0
    for r in results:
        w = weights.get(r["severity"], 1)
        possible += w
        if r["pass"]:
            earned += w
        elif r["severity"] == "critical":
            critical_fails += 1
        elif r["severity"] == "high":
            high_fails += 1

    score = int((earned / possible) * 100) if possible else 0
    pass_audit = critical_fails == 0 and high_fails <= checklist["scoring"]["high_fail_max"] and score >= checklist["scoring"]["pass_score_min"]

    return {
        "loop": loop_dir.name,
        "score": score,
        "pass": pass_audit,
        "critical_fails": critical_fails,
        "high_fails": high_fails,
        "checks": results,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("loop_dir", type=Path, help="Path to loops/<name>")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    loop_dir = args.loop_dir if args.loop_dir.is_absolute() else REPO / args.loop_dir
    if not loop_dir.is_dir():
        print(f"Not a directory: {loop_dir}", file=sys.stderr)
        return 2

    report = audit_loop(loop_dir)
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        status = "PASS" if report["pass"] else "FAIL"
        print(f"{status} {report['loop']} — score {report['score']}/100")
        for c in report["checks"]:
            mark = "✓" if c["pass"] else "✗"
            note = f" ({c['note']})" if c["note"] else ""
            print(f"  {mark} {c['id']} [{c['severity']}]{note}")
    return 0 if report["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())