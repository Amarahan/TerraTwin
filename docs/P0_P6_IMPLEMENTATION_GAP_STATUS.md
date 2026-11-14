# TerraTwin P0–P6 implementation gap status

**Reviewed:** 2026-11-14  
**Current product state:** functional, tested pending-data prototype; not yet a validated planetary analog atlas or final Figma implementation.

## Phase status

| Phase | Status | Evidence and remaining work |
|---|---|---|
| P0 — project audit | Complete | The workspace, plans, contracts, manifests, workbooks, supplied assets, and existing React/Vite app have been audited. The P0 audit report records the data and provenance gaps. |
| P1 — safe data preparation | Complete for non-spatial work | The SRTM guide and both HGT files were inspected, hashes and duplicate pairs checked, manifest paths reconciled, feature/source candidates inventoried, and the 12 Earth + 4 target register preserved. HGT product identity/provenance remains `UNVERIFIED`. No location extraction was performed. |
| P2 — scoring | Deferred / blocked on scientific approval | No approved feature definitions and normalization, body-specific weights, category similarity policy, ice encoding, missing-data/minimum-coverage rules, or reference-check procedure are available. Therefore no scoring engine or output scores have been implemented. |
| P3 — frontend | Partial | The existing React/Vite/TypeScript app has target/site selectors, category filters, detail tabs, eight pending feature panels, provenance/method text, and responsive layouts. It renders the pending register. It has not been compared with approved Figma frames. |
| P4 — integration and functional QA | Partial | The UI reads validated `public/data/atlas.json`; error and retry handling and pending states work. No validated scientific outputs, score module, approved map positions, or source-backed measurement records exist to integrate. |
| P5 — scientific, design, and mobile QA | Technical pending-state checks pass; final QA incomplete | Automated smoke tests cover the current interface at desktop and 390 px mobile. Scientific validation cannot run without actual approved inputs and methods. Visual fidelity cannot be certified without Figma frames/exports. |
| P6 — deployment and handoff | Not started | GitHub and deployment were explicitly postponed. A final submission package must wait until the app is scientifically and visually complete and the team authorizes publishing. |

## What is in the current interface

- Four target records and twelve Earth site records are retained in the display JSON. The register is explicitly provisional.
- Coordinates are `null` with `PENDING_HUMAN_REVIEW`; every measurement and score remains `null`.
- Source links are candidate references sourced from the inventory. Candidate links do not prove download, suitability, spatial coverage, or measured values.
- The explorer's central view is a Leaflet graticule with no basemap, markers, or scientific overlay. It is labelled as a reference grid. It does not currently provide the intended geographic map experience.
- The current UI is not hardcoding numeric measurements or scores, but it is also not yet rendering processed scientific observations. General explanatory copy is static interface content.

## Latest verification

Commands were run from the existing project directories; no dependency installation was performed.

- `python -m unittest discover -s data/tests -v` — **12 passed, 0 failed**.
- `node --test tests/data.test.ts` — **5 passed, 0 failed**.
- `npx --no-install tsc --noEmit` — **passed**, no diagnostics.
- `npm run build` — **passed**, Vite 8.3.8, 23 modules. Existing Vite warning about `__dirname` under its future native config loader remains.
- `node tests/browser-smoke.mjs "C:\Users\Asus\AppData\Local\OpenAI\Codex\runtimes\cua_node\bfa21d187eb00b05\bin\node_modules\playwright"` — **12/12 smoke groups passed**, including six navigation destinations, four targets, twelve site selections, category/search behavior, detail/features/source/method panels, error recovery, and responsive behavior at 390 px. This verifies the pending-data app, not scientific correctness or Figma fidelity.
- `http://127.0.0.1:8443/` — returned HTTP 200 during this review.

## Decisions and inputs still required

1. **Figma source:** provide inspectable desktop and mobile Figma exports (or restore authorized Figma access). The local design folder has only `FIGMA_REFERENCE.md`; it states the handoff does not include the editable Figma export. The external Figma URL could not be inspected with the available tools. Until that source is available, matching the approved layout would require guessing.
2. **Canonical geography:** approve or resolve the per-location coordinate conflicts in `P1_COORDINATE_CONFLICT_REPORT.md`, including representative geometry/buffer and source citations. Keep other locations in the register as pending. This gates point extraction and map markers for each unresolved entry.
3. **Source policy:** confirm NASA-only eligibility interpretation and approve the exact datasets/providers to use. The workbook lists some non-NASA candidates, and bundled browse images/catalog pages are not numeric rasters.
4. **Scientific definitions and values:** approve the eight feature definitions, units, target-data sources and encodings. The supplied package does not contain validated site/target measurements or the cited `mee_lay_earth_features.csv`.
5. **Scoring policy:** approve normalization ranges/direction, Moon/Mars weights, rock/mineral similarity, ice/permafrost encoding, null policy/minimum coverage, and reference-sample/percentile rules. The earlier team response explicitly deferred scoring; a UI request for scores alone does not define this method.
6. **Processing access:** where approved inputs are not bundled, provide/source authorized NASA data access, verify dataset IDs/bands/date windows/QA/projections, and resolve HGT provenance. Do not expose credentials in code or public JSON.

No coordinates, measurements, rankings, scores, coverage claims, or map markers should be supplied before the applicable decisions and source inputs are approved.

## Fastest safe route to a presentation-ready MVP

1. Provide Figma frames/exports and the outstanding human decisions above.
2. Freeze the approved site/target register, feature/source configuration, and score method as versioned input files.
3. Implement reproducible extraction only for locations with approved geometry and validated quantitative sources; keep unresolved entries pending.
4. Add schema validation and source/unit/scale/QA provenance to every extracted value; test Python and TypeScript scoring against shared fixtures and an independently hand-calculated example.
5. Render the actual approved Figma layout using the data contract, with explicit per-record gaps and no scores where coverage/method gates fail.
6. Complete scientific, desktop/tablet/mobile, browser-console, and deployment checks. Only then prepare the submission/deployment deliverables if the team authorizes P6.
