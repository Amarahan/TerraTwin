# 05 — AI / SI Tool Use Disclosure

**Project:** TerraTwin — Planetary Analog Atlas  
**Date:** 2026-11-14  
**Status:** Accurate and complete disclosure for NASA Space Apps 2026 submission.

---

## Summary

Two AI coding assistant tools were used during the development of TerraTwin. All scientific decisions, feature weights, normalization ranges, scoring formulas, and data source choices were made and approved by the human team. AI tools assisted with implementation and automation tasks only.

---

## Tool 1: OpenAI Codex

**Role:** Backend owner, data pipeline owner, scientific implementation, testing.

**Specific tasks performed:**
- Repository audit (Phase P0): Examined existing starter app, data manifests, and pending decisions.
- Python data pipeline (`data/scripts/`): Built `scoring.py`, `build_exploratory_model.py`, `publish_workbook_evidence.py`, `nonspatial_readiness.py`.
- Scoring engine: Implemented the team-approved similarity formula, normalization ranges, rock/mineral categorical matrix, 75% coverage gate, and null-preservation policy in Python.
- TypeScript type contracts: Authored TypeScript interfaces and scoring functions in `starter_app/src/scoring.ts`.
- Shared test fixtures: Created `data/tests/fixtures/scoring_fixtures.json` with hand-verified parity examples (Moon benchmark 85.90, Mars benchmark 79.20).
- Test suites: Wrote Python `unittest` test modules (`test_scoring.py`, `test_exploratory_model.py`, `test_publish_workbook_evidence.py`, `test_audit_inputs.py`, `test_ingest_workbook_candidates.py`, `test_nonspatial_readiness.py`).
- Node.js test suites: Authored `exploratoryData.test.ts`, `workbookData.test.ts`, `scoring.test.ts`, `data.test.ts`, `mapData.test.ts`.
- QA verification: Ran all test suites and confirmed 37/37 Python + 25/25 Node passing results.
- Exploratory model pipeline: Ingested all candidate data and generated 48 site-target comparisons.
- Layout corrections: Corrected Explore/Catalogue layout issues (Milestone 11) in `App.tsx`, `WorldMap.tsx`, `views.tsx`, `mvp.css`.
- Documentation: Authored `docs/PROJECT_PROGRESS.md` milestone records, `docs/P0_P6_IMPLEMENTATION_GAP_STATUS.md`, and intermediate QA reports.

**What Codex did NOT do:**
- Did not choose scientific feature weights, normalization ranges, or thresholds independently.
- Did not invent site measurements or scores.
- Did not alter raw data files.

---

## Tool 2: Google Antigravity (Gemini)

**Role:** Frontend implementation (Plan B), GitHub Pages deployment, submission preparation.

**Specific tasks performed:**
- Frontend implementation: Implemented React components (Targets, Explore, Catalogue, Site Details, Compare, Method screens) in `starter_app/src/views.tsx`, `App.tsx`, `Shell.tsx`, `WorldMap.tsx`, `mvp.css`, `candidateData.ts`, `mapData.ts`.
- Map tile fix: Replaced unavailable CartoDB Voyager tiles (which required an unavailable API key) with standard OpenStreetMap tiles (Milestone 9).
- Catalogue refinement: Overhauled rankings table with conic-gradient score badges, group filters, and Inspect actions.
- GitHub Pages deployment: Authored `.github/workflows/deploy.yml`, configured `vite.config.ts` base path to `/TerraTwin/`, adapted `candidateData.ts` for dynamic path resolution.
- Provisional map markers: Connected `displayMapPosition` to render dashed provisional candidate markers with PENDING_HUMAN_REVIEW tooltips.
- Submission preparation (Phase 6/7): Created `submission/` documents, PPTX script, video storyboard, SRT file, and updated public README.

**What Antigravity did NOT do:**
- Did not change Python scripts, scoring formulas, feature weights, normalization ranges, or test fixtures.
- Did not alter raw data or source manifests.
- Did not invent scientific values.
- Did not submit anything to the competition portal.

---

## Separation of Concerns

Per `AGENTS.md` Rule 9 (Plan B Protocol), Codex and Antigravity were never assigned the same files concurrently. Backend/data files were owned exclusively by Codex; frontend files were assigned to Antigravity only after Codex completed backend integration.

---

## NASA Space Apps AI/SI Disclosure Note

> As required by competition rules: This project used AI coding assistants (OpenAI Codex and Google Antigravity/Gemini) for software implementation tasks. All scientific decisions were made by the human team. AI tools did not access competition submission systems, did not make scientific claims independently, and did not submit or certify any materials on behalf of the team.
