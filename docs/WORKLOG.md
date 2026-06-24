# Project Worklog

This repo keeps an append-only, machine-readable worklog in `worklog/log.jsonl`.

## Why NDJSON?

- **Stream-friendly**: each line is a valid JSON object; no giant array to parse.
- **Diff-friendly**: append-only means most changes are single new lines.
- **Query-friendly**: `jq -c` and standard Unix tools work out of the box.
- **Schema-enforced**: `worklog/schema.json` defines the shape.

## Schema

Required fields: `id`, `timestamp`, `event_type`, `scope`, `summary`.

See `worklog/schema.json` for the full spec.

## Event types

- `decision` — architectural or product decisions
- `action` — things done (code, config, deploys)
- `milestone` — shipped features or completed phases
- `issue` — known problems or bugs
- `note` — observations, context, reminders
- `blocker` — something stopping progress
- `fix` — resolutions to issues/blockers
- `deploy` — releases to production/preview

## How to append

Add one JSON object per line to `worklog/log.jsonl`. Generate a fresh UUID for `id` and use ISO 8601 UTC for `timestamp`.

Example:

```jsonl
{"id":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","timestamp":"2026-06-23T15:39:32Z","event_type":"milestone","scope":"repo/setup","summary":"Created GitHub repo and seeded with Vite/React source","tags":["repo","setup"],"status":"closed","owner":"agent:Hermes"}
```

## How to query

```bash
# all deploy events
jq -c 'select(.event_type=="deploy")' worklog/log.jsonl

# open blockers
jq -c 'select(.event_type=="blocker" and .status=="open")' worklog/log.jsonl

# entries by scope
jq -c 'select(.scope | contains("stripe"))' worklog/log.jsonl
```

## Conventions

- Keep `summary` to one sentence.
- Put URLs, commit SHAs, or issue numbers in `references`.
- Use `status` for items that have a lifecycle (`open` → `closed`).
- Tag liberally so future agents can grep/jq the log.
