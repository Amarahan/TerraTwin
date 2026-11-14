# AGENTS.md — TerraTwin Project Rules

This file is the persistent instruction contract for Codex, Antigravity, and any other coding agent. Read it before inspecting or editing files. Follow it on every task.

## 1. Project identity
- Project: **TerraTwin — Planetary Analog Atlas**.
- Goal: an evidence-based, transparent research prototype comparing selected Earth environments with Moon/Mars target regions.
- Existing frontend stack: React + Vite + TypeScript + Leaflet. Inspect actual versions before changing dependencies.
- Data/backend work: Codex owns the Python data pipeline, data validation, scoring logic, data contracts, and any approved service/API layer.
- Frontend: Codex is the primary frontend implementer when available. **Plan B:** if the team's Codex usage/quota is exhausted, use Antigravity for frontend implementation only, following the approved Figma design and the contracts produced by Codex.
- No traditional server backend is required unless the team explicitly approves one. The default architecture is a reproducible Python processing pipeline plus compact static JSON and browser-side TypeScript scoring/presentation.

## 2. Source-of-truth priority
1. Official competition requirements and explicit human-team decisions.
2. Approved final Figma file: https://www.figma.com/design/4NYVFlkUEmT3PCzYNPQqkK/Untitled?node-id=2-3
3. Existing repository architecture and working implementation.
4. `docs/TerraTwin_Final_Development_Plan.md` and `docs/DATA_PIPELINE_CONTRACT.md`.
5. Agent assumptions (lowest priority; never silently substitute them).

If two sources conflict, STOP and report the conflict. Do not make an unapproved scientific or design decision.

## 3. Design / UI / UX
- The linked Figma file is the final approved visual source of truth.
- Inspect the actual frames, components, assets, tokens, and responsive states before implementation.
- Extend the current React/Vite app; do not create a second app or replace the existing project.
- Preserve the approved page structure, navigation, colour palette, typography, spacing, card styles, map presentation, and responsive behaviour unless the human team approves a change.
- Do not substitute a generic AI dashboard, a different sidebar concept, or an unapproved light/dark theme.
- Do not use AI-generated imagery as a substitute for approved scientific imagery.
- Every button, tab, toggle, filter, and link must work and have a clear purpose.
- Provide honest loading, error, empty, and “No data” states.
- Keep keyboard focus visible and touch targets usable.
- Test desktop and 390 px mobile widths.

## 4. No hardcoded scientific data
Never hardcode site/target measurements, scores, rankings, percentiles, confidence levels, source records, feature weights, validation outcomes, or mission-suitability claims inside React components.
- Scientific records must come from approved data files.
- Feature definitions and calculation parameters must come from one canonical configuration/data contract.
- The UI renders data; it does not invent it.
- Do not add plausible-looking fallback numbers.
- Mock data is allowed only in tests or a clearly labelled development mode; remove it from the production build.
- Never silently use stale values if a dataset fails to load.
- Never embed private API keys, Earth Engine credentials, tokens, or passwords in source code, JSON, Git history, or browser bundles.

## 5. Dataset folder and Python workflow
- Keep supplied datasets inside the project repository in the agreed `data/` structure.
- `data/raw/`: original downloads and exports; never served to visitors.
- `data/interim/`: intermediate extraction outputs.
- `data/processed/`: cleaned/validated outputs and QA reports.
- `data/scripts/`: reproducible Python pipeline.
- `data/tests/`: pipeline tests.
- `public/data/`: compact browser-ready JSON only.
- Use relative paths derived from the repository root.
- Preserve original source values; write transformed values separately.
- Record source URL/citation, provider, dataset ID, band, unit, scale factor, date range, native resolution, analysis scale, QA/mask method, and processing version.
- Use Earth Engine only after authentication is confirmed and a small test extraction succeeds.
- If a supplied dataset is missing, report it. Never fabricate a replacement.
- Keep credentials and `.env` files out of Git and ZIP submissions.

## 6. Data integrity and scientific honesty
- `null` means missing/unavailable. Never coerce null to zero.
- “Not detected” is not proof of absence unless the source supports that interpretation.
- Every non-null displayed number needs a source and unit.
- Every derived result must be reproducible from documented inputs and a documented formula.
- Distinguish measured, published, estimated, pending-validation, and missing values.
- Confidence must reflect source/method quality, not an agent's intuition.
- Flag uncertain source, unit, coordinate, time period, spatial scale, or method rather than guessing.
- Do not tune weights, thresholds, sample points, or normalization ranges to force a desired ranking or Pass state.
- An internal reference-set check is not independent scientific validation.
- NASA-only requirement: the supplied project README states that the dataset folder is NASA-only. Do not add non-NASA datasets unless the human team confirms the competition rules permit them and approves the change.

## 7. Scoring and missing-data policy
Use only the method approved by the human team and documented on the Method page.
Before implementation, confirm:
- feature order and meaning;
- normalization ranges and direction;
- target-specific weights;
- rock/mineral category similarity matrix;
- ice/permafrost encoding;
- missing-data policy and minimum coverage;
- percentile and tie-handling rules.

Proposed score:
`score = 100 × Σ(wᵢ × similarityᵢ)`

Numeric similarity:
`similarityᵢ = 1 − |earthᵢ − targetᵢ|` after approved normalization. Rock similarity uses the approved category matrix.

Requirements:
- Weights must be finite, non-negative, and sum to 1.00 within documented tolerance.
- Reject invalid weights; do not silently repair scientific inputs.
- Null values must follow the human-approved missing-data policy.
- Do not silently re-normalize weights over available features.
- Show feature coverage and suppress the composite score when minimum coverage is not met.
- Python and TypeScript implementations must agree on shared test fixtures.
- Include unit tests and at least one independently hand-calculated example.

## 8. Coordinates and geography
- Use the human-approved site register as the only source of site IDs, names, groups, and coordinates.
- Verify coordinate conflicts with the team before extraction.
- Do not silently move a site or substitute a nearby point.
- Store chosen geometry/buffer and explain how it represents the site.
- Use consistent geometry and buffer settings in every pipeline run.

## 9. AI tool roles and Plan B
### Primary workflow
- **Codex:** repository audit; data/backend architecture; Python ingestion and processing; NASA dataset parsing; provenance; schema validation; scoring engine; tests; API/static-data contracts; integration; build and deployment checks.
- **Codex frontend (when available):** implement React components against the Figma design and Codex-owned data contracts.
- **Figma:** approved design reference only; do not alter the design without team approval.

### Plan B — Codex usage/quota exhausted
1. Do not stop the project or rewrite the backend.
2. Keep Codex-owned backend/data/scoring work and its contracts unchanged.
3. Switch **frontend-only** tasks to Antigravity.
4. Give Antigravity `AGENTS.md`, `TerraTwin_Final_Development_Plan.md`, `DATA_PIPELINE_CONTRACT.md`, the Figma URL, and the exact frontend prompt.
5. Antigravity may edit only the frontend files explicitly assigned in the prompt (normally `src/` and approved UI assets). It must consume the existing JSON/API contracts.
6. Antigravity must not change scientific formulas, source data, Python scripts, schemas, normalization, weights, reference samples, or validation thresholds.
7. If a frontend request requires a backend/schema change, stop and send the request to the Codex/backend owner or human team; do not improvise a new contract.
8. After Antigravity changes, run the same integration tests and `npm run build`. Review the diff before merging.
9. Never run Codex and Antigravity on the same files concurrently. Assign one owner per file.

## 10. Code architecture and collaboration
- Inspect repository, package.json, lockfile, existing components, data, and tests before editing.
- Do not create a second app or replace working code because a prompt suggests a scaffold.
- Do not assume a library is installed; check first and add dependencies only with a clear reason.
- Keep components focused and calculations in reusable pure modules.
- Do not duplicate scoring logic or scientific constants.
- Keep TypeScript strict; avoid `any` unless justified and contained.
- Handle fetch errors and malformed JSON safely.
- Never let two agents edit the same files concurrently.
- Make small, reviewable changes.
- Do not delete working features without approval.

## 11. Required workflow for every task
1. Read this file and relevant plan/data contract.
2. Inspect existing implementation and data before editing.
3. State files to change and why.
4. Identify unresolved assumptions/conflicts; ask the human team rather than inventing answers.
5. Implement the smallest complete change.
6. Add/update tests.
7. Run relevant Python tests, TypeScript checks, and `npm run build`.
8. Report exact commands and results. Never claim a test passed if it was not run.
9. Summarize changed files, remaining limitations, and human decisions needed.

## 12. Final UI quality bar
The finished site must feel like a carefully designed scientific research tool—not an AI-generated template.
- Use precise, concise language.
- Avoid fake activity indicators, simulated live data, arbitrary percentages, fabricated badges, and unsupported confidence claims.
- Charts must use actual values and identify missing data.
- Ensure the interface remains understandable without relying on colour alone.
- Preserve the approved Figma design.

## 13. Stop conditions
Stop and ask the human team if:
- official challenge requirements conflict with this plan;
- Figma and requested implementation conflict;
- approved site coordinates are inconsistent;
- a dataset, source citation, unit, band, or target value is missing;
- scoring/missing-data method is not fully specified;
- a proposed change would alter scientific method or visual design;
- a feature cannot be completed without inventing data.

**Final principle:** Build what the data can support, show what it cannot support, and preserve the approved design.
