#!/usr/bin/env python3
from pathlib import Path
import json
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
REQUIRED = ["README.md", "config.yaml", "skill.md", "verifier.py", "state"]

def main() -> int:
    missing = [name for name in REQUIRED if not (ROOT / name).exists()]
    result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "pass" if not missing else "fail",
        "missing": missing,
    }
    print(json.dumps(result, indent=2))
    return 0 if not missing else 1

if __name__ == "__main__":
    raise SystemExit(main())
