#!/usr/bin/env python3
from pathlib import Path
import json
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
ATTEMPTS = ROOT / "state" / "attempts.jsonl"

def read_last_attempt():
    if not ATTEMPTS.exists():
        return None
    lines = [line.strip() for line in ATTEMPTS.read_text().splitlines() if line.strip()]
    if not lines:
        return None
    return json.loads(lines[-1])

def main() -> int:
    missing = [name for name in ["README.md", "config.yaml", "skill.md", "verifier.py", "state"] if not (ROOT / name).exists()]
    last = read_last_attempt()
    checks = {
        "required_files_exist": not missing,
        "attempt_logged": last is not None,
        "tests_pass": bool(last and last.get("tests_passed") is True),
        "runtime_improves_10_percent": bool(
            last and
            isinstance(last.get("baseline_runtime_ms"), (int, float)) and
            isinstance(last.get("new_runtime_ms"), (int, float)) and
            last["new_runtime_ms"] <= last["baseline_runtime_ms"] * 0.90
        )
    }
    result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "pass" if all(checks.values()) else "fail",
        "checks": checks,
        "missing": missing,
        "last_attempt": last,
    }
    print(json.dumps(result, indent=2))
    return 0 if result["status"] == "pass" else 1

if __name__ == "__main__":
    raise SystemExit(main())
