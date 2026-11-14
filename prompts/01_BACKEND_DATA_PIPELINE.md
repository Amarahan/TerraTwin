# Prompt 01 — Backend/Data Pipeline (Codex)

Read `AGENTS.md` and the approved plan and data contract first. You own backend/data work.

Implement the reproducible Python data pipeline in the existing project. The default architecture is a Python processing pipeline plus compact static JSON for the React frontend; do not create a traditional server unless the human team approves it.

Create/complete:
- `data/input/` for approved registers and target notes;
- `data/raw/` for original source files;
- `data/interim/` for raw extraction outputs;
- `data/processed/` for validated and normalized outputs;
- `data/scripts/` for reproducible scripts;
- `data/tests/` for pipeline tests;
- `public/data/` for compact browser-ready JSON only.

Use supplied data and manifests. Inspect each file before using it. Distinguish preview images from scientific raster data. Do not sample JPEG/PNG browse thumbnails as numeric source measurements.

Create and validate:
- `features.json`
- `sites.json`
- `reference.json` (only if a real, reproducible reference sample is available)
- `metadata.json`

Each non-null feature measurement must preserve value, unit, source/citation, dataset/band, date range, processing method, spatial resolution, confidence/status, and limitations.

Use NASA-only sources unless the human team explicitly approves a rule change. Verify official dataset IDs, bands, scale factors, QA masks, projections, and time coverage before extraction. Do not assume the catalog entry or band from an old prompt is correct.

Do not fabricate missing site or target values. Keep nulls as null. Stop and report unresolved coordinate conflicts before site extraction.

Deliver:
1. Python scripts with CLI arguments and clear logs.
2. Schema validation.
3. A source/provenance manifest.
4. A data coverage report.
5. Unit tests.
6. Exact commands and actual test results.
7. A list of missing data requiring human decisions or further approved downloads.

Do not change the approved Figma design in this task.