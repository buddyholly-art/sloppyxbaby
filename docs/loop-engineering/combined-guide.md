# Repo Loop Engineering Implementation + Audit Guide

Generated: 2026-06-28

Source basis: uploaded `Loop Engineering toolkit.md`.

## Files

This single-file guide mirrors the generated folder kit. Use the ZIP for the drop-in version.

## Machine-readable implementation guide

```json
{
  "schema_version": "1.0.0",
  "name": "repo_loop_engineering_implementation_guide",
  "generated_at": "2026-06-28",
  "purpose": "Define a repo-standard method for building, validating, and operating self-improving agentic loops.",
  "source_basis": "Uploaded Loop Engineering toolkit.md",
  "core_rule": "Do not automate until success criteria, state, verification, and stop conditions are explicit.",
  "repo_contract": {
    "root_paths": [
      "docs/loop-engineering/README.md",
      "docs/loop-engineering/repo-loop-implementation-guide.yaml",
      "docs/loop-engineering/repo-loop-audit-checklist.json",
      "docs/loop-engineering/loop-config.schema.json",
      "loops/_template/"
    ],
    "loop_paths": {
      "required": [
        "loops/<loop-name>/README.md",
        "loops/<loop-name>/config.yaml",
        "loops/<loop-name>/skill.md",
        "loops/<loop-name>/verifier.py",
        "loops/<loop-name>/state/"
      ],
      "optional": [
        "loops/<loop-name>/tests/",
        "loops/<loop-name>/fixtures/",
        "loops/<loop-name>/docs/",
        "loops/<loop-name>/state/attempts.jsonl",
        "loops/<loop-name>/state/decisions.jsonl"
      ]
    }
  },
  "implementation_phases": [
    {
      "phase": 1,
      "name": "trigger",
      "goal": "Define how the loop starts.",
      "required_fields": [
        "trigger.type",
        "trigger.source",
        "trigger.schedule_or_event",
        "trigger.input_contract"
      ],
      "acceptance": "A maintainer can identify exactly what starts the loop and what input shape is valid."
    },
    {
      "phase": 2,
      "name": "execution",
      "goal": "Define what the agent or process does.",
      "required_fields": [
        "execution.skill_file",
        "execution.allowed_tools",
        "execution.forbidden_actions",
        "execution.output_contract"
      ],
      "acceptance": "A coding agent can run the loop without rewriting its mission or expanding scope."
    },
    {
      "phase": 3,
      "name": "verification",
      "goal": "Define independent success tests.",
      "required_fields": [
        "verification.tier",
        "verification.criteria",
        "verification.verifier_command",
        "verification.failure_response"
      ],
      "acceptance": "Success can be confirmed without trusting the agent's own claim."
    },
    {
      "phase": 4,
      "name": "state_memory",
      "goal": "Persist attempts, results, failures, and improvements.",
      "required_fields": [
        "state.path",
        "state.format",
        "state.write_policy",
        "state.retention_policy"
      ],
      "acceptance": "Future attempts can learn from prior attempts without relying on chat history."
    }
  ],
  "success_criteria_tiers": [
    {
      "tier": 1,
      "name": "deterministic",
      "examples": [
        "tests pass",
        "file exists",
        "schema validates",
        "exit code 0"
      ],
      "preferred": true
    },
    {
      "tier": 2,
      "name": "numeric",
      "examples": [
        "latency < 500ms",
        "coverage >= 85%",
        "error rate < 1%"
      ],
      "preferred": true
    },
    {
      "tier": 3,
      "name": "bounded_semantic",
      "examples": [
        "contains required sections",
        "no banned phrases",
        "citations present"
      ],
      "preferred": true
    },
    {
      "tier": 4,
      "name": "human_review",
      "examples": [
        "maintainer approves",
        "coach reviews tone"
      ],
      "preferred": false
    },
    {
      "tier": 5,
      "name": "vague_preference",
      "examples": [
        "make it better",
        "looks good",
        "feels right"
      ],
      "preferred": false,
      "promotion_allowed": false
    }
  ],
  "state_patterns": [
    {
      "pattern": "jsonl_attempt_log",
      "use_when": "Every loop attempt needs timestamped outcome history.",
      "required_fields": [
        "attempt_id",
        "timestamp",
        "input_ref",
        "action_summary",
        "verifier_result",
        "next_adjustment"
      ]
    },
    {
      "pattern": "git_diff_snapshot",
      "use_when": "Loop modifies files.",
      "required_fields": [
        "base_commit",
        "changed_files",
        "diff_summary",
        "rollback_plan"
      ]
    },
    {
      "pattern": "rag_memory",
      "use_when": "Loop benefits from prior examples or decisions.",
      "required_fields": [
        "source_refs",
        "retrieval_query",
        "used_context",
        "excluded_context"
      ]
    },
    {
      "pattern": "budget_ledger",
      "use_when": "Loop spends tokens, money, API calls, or time.",
      "required_fields": [
        "budget_type",
        "limit",
        "used",
        "remaining",
        "stop_threshold"
      ]
    }
  ],
  "stop_conditions": [
    "max_attempts_reached",
    "budget_exhausted",
    "same_failure_repeated",
    "verification_regression",
    "unsafe_or_forbidden_action_requested",
    "missing_required_input",
    "external_dependency_unavailable"
  ],
  "anti_patterns": [
    {
      "id": "auto_without_verification",
      "description": "Loop runs but no independent verifier exists.",
      "severity": "critical"
    },
    {
      "id": "chat_history_as_state",
      "description": "Loop relies on conversational memory instead of repo state files.",
      "severity": "critical"
    },
    {
      "id": "infinite_retry",
      "description": "Loop retries without max attempts, budget, or repeated-failure detection.",
      "severity": "critical"
    },
    {
      "id": "tool_scope_creep",
      "description": "Agent adds tools or expands scope while executing.",
      "severity": "high"
    },
    {
      "id": "vague_success",
      "description": "Success criteria use subjective phrases without measurable checks.",
      "severity": "high"
    }
  ],
  "promotion_gates": [
    {
      "gate": "design",
      "must_pass": [
        "loop justification",
        "clear trigger",
        "clear output contract"
      ]
    },
    {
      "gate": "implementation",
      "must_pass": [
        "skill exists",
        "verifier exists",
        "state path exists"
      ]
    },
    {
      "gate": "staging",
      "must_pass": [
        "dry run completed",
        "audit has zero critical failures"
      ]
    },
    {
      "gate": "production",
      "must_pass": [
        "budget controls",
        "rollback plan",
        "owner documented"
      ]
    }
  ]
}
```

## Machine-readable audit checklist

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "schema_version": "1.0.0",
  "name": "repo_loop_audit_checklist",
  "generated_at": "2026-06-28",
  "scoring": {
    "critical_failure": -10,
    "high_failure": -5,
    "medium_failure": -2,
    "low_failure": -1,
    "pass": 1,
    "promotion_threshold": {
      "production": {
        "critical_failures": 0,
        "minimum_score": 80
      },
      "staging": {
        "critical_failures": 0,
        "minimum_score": 65
      },
      "draft": {
        "critical_failures": 0,
        "minimum_score": 40
      }
    }
  },
  "checks": [
    {
      "id": "repo.standard_files.present",
      "category": "repo_standard",
      "severity": "critical",
      "description": "Repo contains the loop engineering guide, checklist, schema, and template.",
      "how_to_verify": [
        "Check docs/loop-engineering/README.md",
        "Check docs/loop-engineering/repo-loop-implementation-guide.yaml",
        "Check docs/loop-engineering/repo-loop-audit-checklist.json",
        "Check docs/loop-engineering/loop-config.schema.json",
        "Check loops/_template/"
      ],
      "pass_condition": "All required standard files and template directory exist."
    },
    {
      "id": "loop.justification.explicit",
      "category": "loop_justification",
      "severity": "high",
      "description": "Each loop states why a loop is needed instead of a one-shot script or manual checklist.",
      "how_to_verify": [
        "Open loops/<name>/README.md or config.yaml",
        "Find justification field"
      ],
      "pass_condition": "Justification names recurrence, measurable value, and why state improves future attempts."
    },
    {
      "id": "loop.trigger.defined",
      "category": "trigger",
      "severity": "critical",
      "description": "Each loop has an explicit trigger.",
      "how_to_verify": [
        "Inspect config trigger.type/source/schedule_or_event/input_contract"
      ],
      "pass_condition": "Trigger source and valid input contract are defined."
    },
    {
      "id": "loop.execution.bounded",
      "category": "execution",
      "severity": "critical",
      "description": "Execution has a bounded skill, allowed tools, forbidden actions, and output contract.",
      "how_to_verify": [
        "Inspect config execution block",
        "Inspect skill.md"
      ],
      "pass_condition": "Agent cannot expand scope without editing config."
    },
    {
      "id": "loop.verifier.independent",
      "category": "verification",
      "severity": "critical",
      "description": "A verifier independently evaluates success.",
      "how_to_verify": [
        "Check verifier.py exists",
        "Check config verification.verifier_command"
      ],
      "pass_condition": "Verifier command can run separately from the agent."
    },
    {
      "id": "loop.success_criteria.tiered",
      "category": "verification",
      "severity": "critical",
      "description": "Success criteria use deterministic, numeric, or bounded semantic checks where possible.",
      "how_to_verify": [
        "Inspect verification.tier and verification.criteria"
      ],
      "pass_condition": "Tier is 1, 2, or 3 unless explicitly documented as human review."
    },
    {
      "id": "loop.state.persistent",
      "category": "state_memory",
      "severity": "critical",
      "description": "Loop writes persistent state to repo-controlled or configured storage.",
      "how_to_verify": [
        "Check state.path exists",
        "Check state.write_policy"
      ],
      "pass_condition": "State directory exists and write policy defines what gets recorded."
    },
    {
      "id": "loop.state.attempt_history",
      "category": "state_memory",
      "severity": "high",
      "description": "Attempt history records inputs, outputs, verification, failures, and next adjustment.",
      "how_to_verify": [
        "Inspect attempts.jsonl or equivalent"
      ],
      "pass_condition": "Attempt records include timestamp, result, verifier output, and next adjustment."
    },
    {
      "id": "loop.stop_conditions.present",
      "category": "safeguards",
      "severity": "critical",
      "description": "Loop has stop conditions for max attempts, budget, repeated failure, and missing input.",
      "how_to_verify": [
        "Inspect config stop_conditions"
      ],
      "pass_condition": "At least max_attempts and one budget or repeated-failure stop condition are defined."
    },
    {
      "id": "loop.budget_controls.present",
      "category": "safeguards",
      "severity": "high",
      "description": "Loop limits token, money, time, API, or compute usage.",
      "how_to_verify": [
        "Inspect config budgets"
      ],
      "pass_condition": "At least one budget is defined with unit, limit, and stop threshold."
    },
    {
      "id": "loop.failure_response.safe",
      "category": "safeguards",
      "severity": "high",
      "description": "Failure response logs evidence and stops or escalates instead of thrashing.",
      "how_to_verify": [
        "Inspect verification.failure_response and stop_conditions"
      ],
      "pass_condition": "Repeated failures stop the loop and produce actionable evidence."
    },
    {
      "id": "loop.rollback.defined",
      "category": "repo_safety",
      "severity": "medium",
      "description": "File-modifying loops document rollback.",
      "how_to_verify": [
        "Inspect config rollback block or README"
      ],
      "pass_condition": "Rollback identifies backup path, git command, or restore procedure."
    },
    {
      "id": "loop.owner.status",
      "category": "documentation",
      "severity": "medium",
      "description": "Loop has owner, status, and promotion level.",
      "how_to_verify": [
        "Inspect config metadata and README"
      ],
      "pass_condition": "Owner, status, and lifecycle stage are present."
    },
    {
      "id": "loop.no_vague_success",
      "category": "verification",
      "severity": "high",
      "description": "Success criteria avoid vague phrases without measurable translation.",
      "how_to_verify": [
        "Search config and README for better/good/clean/improve without concrete checks"
      ],
      "pass_condition": "Subjective goals are translated into explicit checks."
    },
    {
      "id": "loop.no_chat_history_state",
      "category": "state_memory",
      "severity": "critical",
      "description": "Loop does not depend on chat history as operational memory.",
      "how_to_verify": [
        "Inspect skill.md and config state block"
      ],
      "pass_condition": "Operational memory is persisted to files/database, not chat only."
    }
  ]
}
```

## Loop config schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.local/schemas/loop-config.schema.json",
  "title": "Loop Config",
  "type": "object",
  "required": [
    "schema_version",
    "metadata",
    "trigger",
    "execution",
    "verification",
    "state",
    "stop_conditions"
  ],
  "additionalProperties": true,
  "properties": {
    "schema_version": {
      "type": "string"
    },
    "metadata": {
      "type": "object",
      "required": [
        "name",
        "owner",
        "status",
        "justification"
      ],
      "properties": {
        "name": {
          "type": "string",
          "pattern": "^[a-z0-9][a-z0-9_-]*$"
        },
        "owner": {
          "type": "string"
        },
        "status": {
          "type": "string",
          "enum": [
            "draft",
            "staging",
            "production",
            "deprecated"
          ]
        },
        "promotion_level": {
          "type": "string",
          "enum": [
            "design",
            "implementation",
            "staging",
            "production"
          ]
        },
        "justification": {
          "type": "string",
          "minLength": 20
        }
      }
    },
    "trigger": {
      "type": "object",
      "required": [
        "type",
        "source",
        "schedule_or_event",
        "input_contract"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "manual",
            "scheduled",
            "event",
            "condition_watch",
            "webhook",
            "cli"
          ]
        },
        "source": {
          "type": "string"
        },
        "schedule_or_event": {
          "type": "string"
        },
        "input_contract": {
          "type": "object"
        }
      }
    },
    "execution": {
      "type": "object",
      "required": [
        "skill_file",
        "allowed_tools",
        "forbidden_actions",
        "output_contract"
      ],
      "properties": {
        "skill_file": {
          "type": "string"
        },
        "allowed_tools": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "forbidden_actions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "output_contract": {
          "type": "object"
        }
      }
    },
    "verification": {
      "type": "object",
      "required": [
        "tier",
        "criteria",
        "verifier_command",
        "failure_response"
      ],
      "properties": {
        "tier": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5
        },
        "criteria": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "type",
              "expected"
            ]
          }
        },
        "verifier_command": {
          "type": "string"
        },
        "failure_response": {
          "type": "string"
        }
      }
    },
    "state": {
      "type": "object",
      "required": [
        "path",
        "format",
        "write_policy",
        "retention_policy"
      ],
      "properties": {
        "path": {
          "type": "string"
        },
        "format": {
          "type": "string",
          "enum": [
            "jsonl",
            "json",
            "sqlite",
            "markdown",
            "external"
          ]
        },
        "write_policy": {
          "type": "string"
        },
        "retention_policy": {
          "type": "string"
        }
      }
    },
    "budgets": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "unit",
          "limit",
          "stop_threshold"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "limit": {
            "type": "number"
          },
          "stop_threshold": {
            "type": "number"
          }
        }
      }
    },
    "stop_conditions": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "id",
          "condition",
          "action"
        ]
      }
    },
    "rollback": {
      "type": "object",
      "properties": {
        "strategy": {
          "type": "string"
        },
        "command": {
          "type": "string"
        }
      }
    }
  }
}
```
