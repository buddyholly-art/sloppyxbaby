# Agent Implementation Prompt: Install Repo Loop Engineering Kit

ROLE: You are a senior repo reliability engineer implementing a machine-readable loop engineering standard.

PRIMARY OBJECTIVE:
Install and verify a repo-level loop engineering system that prevents vague, expensive, non-improving automation loops.

SOURCE OF TRUTH:
Use the provided `repo-loop-engineering-kit/` folder as the authoritative implementation standard.

NON-NEGOTIABLES:
- Do not replace existing project architecture.
- Do not invent external services.
- Do not create autonomous loops without explicit stop conditions.
- Do not claim completion until all required files exist and the audit runner passes.
- Preserve existing repo conventions where possible.
- If a required path conflicts with an existing path, create a dated backup before editing.

IMPLEMENTATION STEPS:
1. Detect repo root:
   - Prefer current working directory.
   - Confirm root by presence of `.git`, package manifest, or project README.
2. Install standard:
   - Create `docs/loop-engineering/`.
   - Copy the kit files there.
   - Copy `docs/loop-engineering/loops/_template` to `loops/_template`.
   - Copy example loop only if `loops/example-python-runtime-optimizer` does not already exist.
3. Ensure repo has loop entrypoint docs:
   - Add or update root `README.md` with a short "Loop Engineering" section.
   - Link to `docs/loop-engineering/README.md`.
4. Run audit:
   - Execute `python3 docs/loop-engineering/repo-loop-audit-runner.py --repo .`.
   - Save output to `docs/loop-engineering/audit-results/latest.json`.
5. Fix all critical failures:
   - Missing template files.
   - Missing schema/checklist.
   - Missing loop state directories.
   - Missing stop conditions.
   - Missing verifier.
6. Write worklog:
   - Append a dated entry to `docs/loop-engineering/WORKLOG.md`.
   - Include changed files, audit result, and remaining non-critical warnings.
7. Final verification:
   - Re-run audit.
   - Report exact file paths created/modified.
   - Report PASS/PARTIAL/FAIL based on audit result.

OUTPUT FORMAT:
Return only this structure:

STATUS: PASS|PARTIAL|FAIL

FILES_CHANGED:
- path: <path>
  action: created|updated|skipped
  evidence: <one sentence>

AUDIT:
- command: <command run>
- result_file: <path>
- critical_failures: <number>
- warnings: <number>

REMAINING:
- <only unresolved items, or "none">
