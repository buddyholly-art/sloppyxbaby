#!/usr/bin/env python3
"""
Lightweight Repo Loop Audit Runner

Usage:
  python3 repo-loop-audit-runner.py --repo .
  python3 repo-loop-audit-runner.py --repo . --json

This runner intentionally avoids third-party dependencies. It checks required
files and performs text-based config checks. Use `loop-config.schema.json`
with a full JSON Schema validator for stricter validation.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from datetime import datetime, timezone


REQUIRED_STANDARD_PATHS = [
    "docs/loop-engineering/README.md",
    "docs/loop-engineering/repo-loop-implementation-guide.yaml",
    "docs/loop-engineering/repo-loop-audit-checklist.json",
    "docs/loop-engineering/loop-config.schema.json",
    "loops/_template/README.md",
    "loops/_template/config.yaml",
    "loops/_template/skill.md",
    "loops/_template/verifier.py",
    "loops/_template/state",
]

REQUIRED_LOOP_FILES = [
    "README.md",
    "config.yaml",
    "skill.md",
    "verifier.py",
    "state",
]

REQUIRED_CONFIG_TOKENS = [
    "schema_version:",
    "metadata:",
    "justification:",
    "trigger:",
    "execution:",
    "verification:",
    "verifier_command:",
    "state:",
    "stop_conditions:",
]

VAGUE_TERMS = ["make better", "improve it", "looks good", "clean it up", "nice", "quality"]


def load_checklist(repo: Path) -> dict:
    path = repo / "docs/loop-engineering/repo-loop-audit-checklist.json"
    if not path.exists():
        return {"checks": []}
    try:
        return json.loads(path.read_text())
    except Exception as exc:
        return {"checks": [], "load_error": str(exc)}


def check_exists(repo: Path, rel: str) -> dict:
    path = repo / rel
    return {
        "id": f"path.exists:{rel}",
        "severity": "critical",
        "status": "pass" if path.exists() else "fail",
        "evidence": str(path),
    }


def discover_loops(repo: Path) -> list[Path]:
    loops_root = repo / "loops"
    if not loops_root.exists():
        return []
    return [
        p for p in loops_root.iterdir()
        if p.is_dir() and not p.name.startswith(".") and p.name != "_template"
    ]


def read_text(path: Path) -> str:
    try:
        return path.read_text(errors="replace")
    except Exception:
        return ""


def audit_loop(repo: Path, loop_dir: Path) -> list[dict]:
    results = []
    rel_loop = loop_dir.relative_to(repo)

    for req in REQUIRED_LOOP_FILES:
        p = loop_dir / req
        results.append({
            "id": f"loop.required_file:{rel_loop}/{req}",
            "severity": "critical",
            "status": "pass" if p.exists() else "fail",
            "evidence": str(p),
        })

    config = read_text(loop_dir / "config.yaml")
    for token in REQUIRED_CONFIG_TOKENS:
        results.append({
            "id": f"loop.config_token:{rel_loop}:{token}",
            "severity": "critical" if token in ["trigger:", "verification:", "state:", "stop_conditions:"] else "high",
            "status": "pass" if token in config else "fail",
            "evidence": f"{loop_dir / 'config.yaml'} contains {token}",
        })

    lower = config.lower()
    vague_hits = [term for term in VAGUE_TERMS if term in lower]
    results.append({
        "id": f"loop.no_vague_success:{rel_loop}",
        "severity": "high",
        "status": "pass" if not vague_hits else "warn",
        "evidence": f"vague_hits={vague_hits}",
    })

    verifier = loop_dir / "verifier.py"
    results.append({
        "id": f"loop.verifier.executable_hint:{rel_loop}",
        "severity": "medium",
        "status": "pass" if verifier.exists() and ("if __name__" in read_text(verifier)) else "warn",
        "evidence": str(verifier),
    })

    return results


def summarize(results: list[dict]) -> dict:
    counts = {"pass": 0, "warn": 0, "fail": 0}
    critical_failures = 0
    for r in results:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
        if r["status"] == "fail" and r.get("severity") == "critical":
            critical_failures += 1
    status = "PASS" if critical_failures == 0 and counts["fail"] == 0 else ("PARTIAL" if critical_failures == 0 else "FAIL")
    return {
        "status": status,
        "counts": counts,
        "critical_failures": critical_failures,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".", help="Repository root")
    parser.add_argument("--json", action="store_true", help="Print JSON only")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    results = []

    for rel in REQUIRED_STANDARD_PATHS:
        results.append(check_exists(repo, rel))

    loops = discover_loops(repo)
    for loop_dir in loops:
        results.extend(audit_loop(repo, loop_dir))

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "repo": str(repo),
        "loops_found": [str(p.relative_to(repo)) for p in loops],
        "summary": summarize(results),
        "results": results,
    }

    out_dir = repo / "docs/loop-engineering/audit-results"
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "latest.json").write_text(json.dumps(report, indent=2))

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"STATUS: {report['summary']['status']}")
        print(f"critical_failures: {report['summary']['critical_failures']}")
        print(f"counts: {report['summary']['counts']}")
        print(f"result_file: {out_dir / 'latest.json'}")
        for r in results:
            if r["status"] != "pass":
                print(f"- {r['status'].upper()} [{r['severity']}] {r['id']} :: {r['evidence']}")

    return 0 if report["summary"]["critical_failures"] == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
