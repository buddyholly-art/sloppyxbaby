#!/usr/bin/env python3
"""
LangGraph self-improving loop — production-style agentic pattern.

Requires: pip install langgraph langchain-core

Swap evaluate_node() simulation with real benchmark + test commands.
Persist state to loops/<name>/state/attempts.jsonl (same contract as Claude Code setup).

Run:
  python3 docs/loop-engineering/agentic/langgraph-self-improving-loop.py \
    --loop-dir loops/code-performance-optimizer \
    --max-iterations 8
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, TypedDict

try:
    from langgraph.graph import END, StateGraph
except ImportError:
    print("Install: pip install langgraph langchain-core", file=sys.stderr)
    sys.exit(1)


class LoopState(TypedDict):
    iteration: int
    max_iterations: int
    attempts: list[dict]
    best_p99_ms: float
    baseline_p99_ms: float
    current_p99_ms: float
    tests_pass: bool
    pass_loop: bool
    hypothesis: str
    loop_dir: str


def load_attempts(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def append_attempt(path: Path, record: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as f:
        f.write(json.dumps(record) + "\n")


def load_state_node(state: LoopState) -> LoopState:
    loop_dir = Path(state["loop_dir"])
    attempts_path = loop_dir / "state" / "attempts.jsonl"
    attempts = load_attempts(attempts_path)
    baseline = attempts[0]["metrics"]["p99_ms"] if attempts else 900.0
    best = min((a["metrics"]["p99_ms"] for a in attempts), default=baseline)
    return {
        **state,
        "attempts": attempts,
        "baseline_p99_ms": baseline,
        "best_p99_ms": best,
        "iteration": len(attempts),
    }


def generate_improvement_node(state: LoopState) -> LoopState:
    """Replace with real agent: edit files, run profiler, etc."""
    failed = [a.get("hypothesis") for a in state["attempts"] if not a.get("pass")]
    hypothesis = f"cache_hot_path_iter_{state['iteration']}"
    if hypothesis in failed:
        hypothesis = f"vectorize_inner_loop_iter_{state['iteration']}"
    # Simulated improvement trend
    delta = random.uniform(0.02, 0.08)
    current = state["best_p99_ms"] * (1 - delta)
    return {**state, "hypothesis": hypothesis, "current_p99_ms": current}


def evaluate_node(state: LoopState) -> LoopState:
    """Replace with: subprocess.run(['python3', 'verifier.py', ...])."""
    improvement_pct = (
        (state["baseline_p99_ms"] - state["current_p99_ms"])
        / state["baseline_p99_ms"]
        * 100
    )
    tests_pass = True
    pass_loop = improvement_pct >= 5.0 and tests_pass
    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "iteration": state["iteration"],
        "hypothesis": state["hypothesis"],
        "metrics": {
            "p99_ms": round(state["current_p99_ms"], 2),
            "p99_improvement_pct": round(improvement_pct, 2),
            "tests_pass": tests_pass,
        },
        "pass": pass_loop,
    }
    append_attempt(Path(state["loop_dir"]) / "state" / "attempts.jsonl", record)
    attempts = state["attempts"] + [record]
    best = min(state["best_p99_ms"], state["current_p99_ms"])
    return {
        **state,
        "attempts": attempts,
        "best_p99_ms": best,
        "tests_pass": tests_pass,
        "pass_loop": pass_loop,
        "iteration": state["iteration"] + 1,
    }


def should_continue(state: LoopState) -> str:
    if state["pass_loop"]:
        return "end"
    if state["iteration"] >= state["max_iterations"]:
        return "end"
    return "generate"


def build_graph() -> StateGraph:
    graph = StateGraph(LoopState)
    graph.add_node("load_state", load_state_node)
    graph.add_node("generate", generate_improvement_node)
    graph.add_node("evaluate", evaluate_node)
    graph.set_entry_point("load_state")
    graph.add_edge("load_state", "generate")
    graph.add_edge("generate", "evaluate")
    graph.add_conditional_edges("evaluate", should_continue, {"generate": "generate", "end": END})
    return graph


def main() -> int:
    parser = argparse.ArgumentParser(description="LangGraph self-improving loop")
    parser.add_argument("--loop-dir", default="loops/code-performance-optimizer")
    parser.add_argument("--max-iterations", type=int, default=8)
    args = parser.parse_args()

    initial: LoopState = {
        "iteration": 0,
        "max_iterations": args.max_iterations,
        "attempts": [],
        "best_p99_ms": 900.0,
        "baseline_p99_ms": 900.0,
        "current_p99_ms": 900.0,
        "tests_pass": False,
        "pass_loop": False,
        "hypothesis": "",
        "loop_dir": args.loop_dir,
    }

    # Seed baseline if empty
    attempts_path = Path(args.loop_dir) / "state" / "attempts.jsonl"
    if not load_attempts(attempts_path):
        append_attempt(
            attempts_path,
            {
                "ts": datetime.now(timezone.utc).isoformat(),
                "iteration": 0,
                "hypothesis": "baseline",
                "metrics": {"p99_ms": 900.0, "p99_improvement_pct": 0.0, "tests_pass": True},
                "pass": False,
            },
        )

    app = build_graph().compile()
    final = app.invoke(initial)
    print(json.dumps({"pass": final["pass_loop"], "best_p99_ms": final["best_p99_ms"], "iterations": final["iteration"]}, indent=2))
    return 0 if final["pass_loop"] else 1


if __name__ == "__main__":
    raise SystemExit(main())