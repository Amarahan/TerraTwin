# Prompt 04 — Integration and Functional QA (Codex)

Read `AGENTS.md`, the plan, and data contract.

Integrate the validated backend/data outputs and frontend. Confirm the UI reads the current `public/data/` contracts and calls the shared scoring module. Do not duplicate scientific calculations in React components.

Test:
- target selection updates map, ranking, details, and validation consistently;
- selecting a map marker selects the same site in the ranked list;
- selecting a ranked row selects the same map marker;
- all detail tabs render correct source-backed information;
- null/missing values display as “No data”;
- insufficient coverage suppresses the composite score;
- all weights/presets validate and re-score only when approved;
- reference-set checks show real Pass/Fail/Not computed results;
- NASA Trek links and available WMTS layers behave correctly;
- error, loading, and empty states work;
- no fabricated scientific values or stale fallback data remain.

If Antigravity implemented the frontend under Plan B, review its diff and verify that it did not change backend-owned files or scientific contracts.

Run available Python tests, TypeScript checks, and `npm run build`. Report exact commands and outputs. Fix defects within your assigned ownership. Do not claim success for tests that were not run.