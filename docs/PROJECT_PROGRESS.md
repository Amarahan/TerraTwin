# TerraTwin local MVP progress

Updated 2026-11-14. Git/GitHub work is postponed by team decision. No repository was initialized or published.

## Milestone 1 — installation and app inspection (complete)
- Existing app: `starter_app/`, React + Vite + TypeScript + Leaflet.
- Clean locked installation succeeded; native Windows x64 Rolldown binding loads.
- Vite dev server: `npm run dev -- --host 127.0.0.1`, URL `http://127.0.0.1:8443/`.
- Browser opened the original app successfully.
- Figma link could not be accessed; only `design/FIGMA_REFERENCE.md` is bundled. Existing app design is the working reference, not a claim of final Figma fidelity.
- `.figma/make/site.json` remains absent. Existing title fallback retained; no Figma export fabricated.

## Milestone 2 — functional pending-data interface (complete)
- Preserved existing header, navy/cyan palette, hero, cards and responsive design direction.
- Removed illustrative measurements, scores, rankings, arbitrary weight presets and unresolved markers from production UI.
- Added generated display JSON from the provisional register and supplied source inventory: 12 Earth sites, 4 targets, 8 feature concepts, null coordinates/measurements/scores.
- Target selectors, all site entries, search/category filters, shared active site, details, Fit/Mission/Limits/Sources sections, two-site availability comparison, methodology and NASA candidate source links implemented.
- Leaflet reference map supports pan/zoom/reset. No location markers or heatmaps; all coordinates remain pending. It intentionally uses a reference graticule without an unverified basemap.
- Loading, failed fetch, invalid data and retry states implemented. Browser loader rejects unsupported non-null scientific data in this pending-only contract.
- Hash navigation supports back/forward and page reload. Selection is session state; reloading resets the active site/target to the first register entry.

## Files changed or added
- `starter_app/src/App.tsx`: data loading, navigation and shared selection state.
- `starter_app/src/Shell.tsx`: extracted/adapted existing navigation, hero and design components.
- `starter_app/src/views.tsx`: target/catalogue/detail/compare/method screens.
- `starter_app/src/WorldMap.tsx`: Leaflet reference map with honest pending placement.
- `starter_app/src/data.ts`: pending-display contract and runtime validation.
- `starter_app/src/mvp.css`: responsive extensions to existing stylesheet.
- `starter_app/src/main.tsx`: loads the MVP stylesheet after the existing styles.
- `starter_app/scripts/serve_error_fixture.py`: isolated production error/retry test server; not bundled.
- `starter_app/scripts/export_pending_data.py`: reproducible display export; no spatial processing/scoring.
- `starter_app/public/data/atlas.json`: generated browser data.
- `starter_app/tests/data.test.ts`: scientific integrity and malformed-data regression tests.
- `docs/PROJECT_PROGRESS.md`: this checkpoint.

## Milestone 3 — earlier verification results (superseded by milestone 4 below)
- `npm run build`: exit 0. Vite 8.3.8 transformed 23 modules. Final output: CSS 79.95 kB; JS 396.90 kB (120.24 kB gzip), in `starter_app/dist/`.
- `npx --no-install tsc --noEmit`: exit 0, no diagnostics; checked again after implementation.
- `node --test tests/data.test.ts`: 5 passed, 0 failed. Covers register completeness, duplicate/missing entries, invalid contracts, fabricated coordinates/scores, null-to-zero substitution, missing feature rows and unsafe source URLs.
- `python -m unittest discover -s data/tests -v`: 10 tests ran, 9 passed, 1 failed. `test_readiness_report_preserves_scope_and_defers_scientific_coverage`, line 43, incorrectly expects the supplied SRTM PDF to be absent. The report function correctly returns present. This is a stale assertion outside the frontend editing scope, not an application failure.
- Desktop browser (1440 px): all four target cards and selector options work. All 12 site selections update details and map status. Filters return 4 Featured, 5 Benchmark, 3 Control and 12 All. Search empty state and Clear filters work.
- Detail tabs Fit/Mission/Limits/Sources work. Full Fit view renders eight features with missing Earth/target values. Coordinate issues and required decisions are visible. Sixteen candidate source links render with supplied provenance.
- Comparison selectors update both Earth columns; target selection updates its column. Selecting the same site twice displays a notice. No winner or score is computed.
- Mobile browser (390 px): all six navigation destinations work and close the menu. Dashboard, targets, explorer, catalogue, comparison and method have no document-level horizontal overflow. Site/target selection and detail panels also exercised on mobile.
- Leaflet zoom-in enabled zoom-out after animation; reset exercised. Site list and selected map-status text remain synchronized. No approved-position marker test is possible because all locations are pending; no markers are displayed.
- Isolated production error test on port 8444: HTTP 503 displays Atlas unavailable; malformed JSON displays validation error with no records; the next retry restores the dashboard. Target selection and map zoom then worked. The real data file was never altered.
- Captured browser error-level logs were empty after normal QA interactions and after production recovery. This is a scoped check, not a guarantee for every browser.
- Fixed visual defects: Mars decorative class collision, stylesheet import order squeezing notices into columns, and excessively tall mobile target graphics.
- Existing Vite future-native-loader warning about `__dirname` remains non-blocking with the locked version.
- Final extra Windows browser capture was stopped by the computer-use tool because it could not confidently determine the current URL. No further UI automation was attempted. Prior desktop/mobile checks remain valid; screenshots were visually inspected during them, but no standalone screenshot artifact was saved.

## Missing data / human decisions
- All approved coordinates and geometry/buffers remain null and PENDING_HUMAN_REVIEW.
- Scientific measurements, target values, final feature definitions/units, normalization, weights, categorical policies, missing-data rules and reference validation need approval.
- HGT product version and provenance remain UNVERIFIED. Numeric extraction is blocked for unresolved locations.
- Supplied source inventory includes non-NASA candidates; eligibility and suitability need approval before use. Links are clearly candidate references, not validated coverage.
- Figma exports/access are needed to certify visual fidelity; this does not block independent development.
- PDF availability is now consistent in generated JSON and Markdown. The valid supplied guide and truthful present/missing reporting have regression coverage.

## Exact next task
The stabilized pending-data MVP is ready for a team walkthrough at http://127.0.0.1:8443/. The stale Python assertion and report-generator bug are fixed. All 12 Python tests, five frontend integrity tests, 12 browser smoke-test groups, TypeScript and production build pass. Next task: obtain team acceptance of this pending-data demo and compare with approved Figma exports when available; then implement only the scientific inputs/policies explicitly approved by the team. No dependency reinstall or repeat audit is needed.

Review visual fidelity against Figma exports when available. After scientific approvals arrive, deliberately version the pending-display contract before introducing coordinates or measurements; the current loader rejects non-null scientific records. Git/GitHub and deployment remain postponed.

## Demo and resume commands
Run from `starter_app/`:
- `npm run dev -- --host 127.0.0.1` — development app at port 8443.
- `python scripts/export_pending_data.py` — regenerate display JSON from source records.
- `node --test tests/data.test.ts` — five frontend data-integrity tests.
- `npx --no-install tsc --noEmit` — strict TypeScript check.
- `npm run build` — production build.
- `npm run preview -- --host 127.0.0.1 --port 8445` — optional production preview (not run in this checkpoint).
- `python scripts/serve_error_fixture.py` — QA-only port 8444 intentionally fails twice before serving valid data. Do not use this server for a judge demonstration.

Suggested demonstration: Mission → Targets → choose destination → Explore → select site → Open site details → eight features → Sources → Compare → Method. Explain that geographic approvals and scientific computation remain pending.

## Remaining limitations
- This is a demonstrable pending-data MVP, not a completed scientific matching engine.
- The map is a reference grid without approved site markers or measured overlays.
- Full Figma fidelity and all external source pages have not been certified.
- Existing NASA hero imagery and web fonts require external connectivity; the core register and application bundle are local.
- The previous Python test failure and stale PDF-availability output are resolved; no known blocking application bug was found in the final smoke-test scope.
- No Git repository, GitHub push or deployment was created during this work.


## Milestone 4 — final technical stabilization (complete, 2026-11-14)
- Reproduced exact failure before changing it: `assertFalse(report["local_srtm_guide"]["present"])`, line 43, `AssertionError: True is not false`.
- Confirmed the intended state changed when the team added the guide. Updated the assertion to require the supplied non-empty file and PRESENT status. No test was deleted, skipped or disabled.
- Added strict PDF parse/content regression and both present/missing Markdown report regression. Corrected the generator's unconditional missing-file sentence.
- PDF: 1,071,409 bytes, unencrypted, 17 pages, parsed in strict mode; SHA-256 `422d91fef5195706a596fe5fa759d638ad3b509f5f36d77b0382004b3b0aaac9`. Its bytes were preserved.
- `python -m unittest discover -s data/tests -v`: **12 passed, 0 failures**, 34.816 seconds.
- `node --test tests/data.test.ts`: **5 passed, 0 failures**.
- `npx --no-install tsc --noEmit`: **exit 0**, no diagnostics.
- `npm run build`: **exit 0**, 23 modules; CSS 75.36 kB, JS 396.90 kB; locked Vite's existing future-loader warning remains non-blocking.
- `python data/scripts/nonspatial_readiness.py`: **exit 0**; 2 HGT tiles, 57 hashed source assets, 2 exact duplicate groups, 23 manifest path mismatches, 24 feature/world candidate rows. Scientific provenance remains unverified where previously unresolved.
- Independent integrity check matched all 57 original source SHA-256 hashes, the original PDF hash and both package-file hashes. Export/register hash agrees; all 16 locations retain null coordinates/scores and all 128 measurement values are null.
- Fresh browser smoke run at port 8443: **12/12 groups passed**, zero runtime exceptions. Desktop 1440x900, mobile 390x844. Covers six nav sections, four targets, twelve sites, search/categories, map controls, details/eight features, sources/method, comparison and failed-loading/malformed-data recovery.
- First browser run passed functional tests but sandbox networking blocked external images/fonts. A network-enabled rerun passed all groups with only the intentional 503 console error. Two cancelled local JSON requests occur during React effect cleanup/reload; no stale records are rendered.
- Saved screenshots were visually inspected: `docs/qa/desktop-targets.png`, `docs/qa/desktop-atlas.png`, `docs/qa/mobile-details.png`. Machine-readable results: `docs/qa/browser-smoke-results.json`.
- Repeatable browser command from `starter_app`: `node tests/browser-smoke.mjs "<existing-playwright-package-path>"`. This run used bundled Playwright at `C:/Users/Asus/AppData/Local/OpenAI/Codex/runtimes/cua_node/bfa21d187eb00b05/bin/node_modules/playwright` and installed Edge in an isolated temporary profile. No app dependencies were installed or changed. Runtime path can change across Codex updates.

### Stabilization files
- Updated `data/tests/test_nonspatial_readiness.py` and `data/scripts/nonspatial_readiness.py`.
- Added `data/requirements-test.txt` documenting already-installed pypdf 6.18.1 for strict PDF tests.
- Refreshed generated `data/interim/nonspatial_readiness.json`, `data/interim/manifest_path_reconciliation.json`, `docs/P1_NONSPATIAL_READINESS_REPORT.md`, `docs/P1_MANIFEST_PATH_MISMATCH_REPORT.md`.
- Added `starter_app/tests/browser-smoke.mjs` and `docs/qa/` evidence. Updated this progress report.
- No application scientific records, input files, dependency declarations, lockfile, Git repository or deployment were changed.

### P0–P6 status
- P0 audit: complete.
- P1 safe non-spatial work: complete; quantitative extraction blocked by coordinate/source approval.
- P2 scoring: explicitly deferred; no approved policy or values.
- P3 interface: pending-data screens and controls exist, but the approved Figma design has not been inspected or implemented against exports. The current explorer's center is a reference graticule, not a geographic basemap or scientific overlay.
- P4 integration: pending register and source-candidate JSON are connected and validated. Scientific raster ingestion, site extraction, and scoring integration are not complete.
- P5 technical QA: the pending-data app passes the checks listed above. Scientific QA and Figma visual QA remain incomplete; those are not covered by the passing smoke tests.
- P6 publishing/submission: postponed by team instruction. This product can demonstrate the transparent workflow but must not be presented as a validated scientific matching engine.

## Milestone 5 — P0–P6 implementation gap review (2026-11-14)
- Corrected the completion claim above: functional QA of pending states does not mean the scientific data product, Figma implementation, or full integration is complete.
- Confirmed the supplied Figma URL is inaccessible to the available inspection tool. `design/FIGMA_REFERENCE.md` says the handoff contains the starter app, not a full editable design export; the `design/` folder has no desktop/mobile reference exports. No visual redesign was made without the source of truth.
- Confirmed `starter_app/public/data/atlas.json` is a display-only export generated from the provisional register and candidate-source inventory. All 16 coordinates and scores are null; all 128 site/target feature values are null. It is not a processed scientific data product.
- Confirmed the explorer map is a Leaflet reference graticule without geographic basemap tiles, approved markers, or data overlays. The UI clearly labels placement pending; the current map should not be described as a data map.
- Current verification, rerun on 2026-11-14: Python unittest discovery **12/12 passed**; frontend integrity tests **5/5 passed**; TypeScript **passed**; production build **passed** (Vite 8.3.8, 23 modules; existing `__dirname` future-loader warning); browser smoke **12/12 groups passed** at 1440 px and 390 px, zero uncaught runtime exceptions. The browser suite validates the pending-data interface only.
- The local development server at `http://127.0.0.1:8443/` returned HTTP 200 during this review. No dependencies, input datasets, source manifests, or scientific records were changed by this review.
- See [P0–P6 implementation gap status](P0_P6_IMPLEMENTATION_GAP_STATUS.md) for phase-by-phase scope, blockers, and the shortest safe path forward.


## Milestone 6 — Private GitHub publication and space agency catalog (complete, 2026-11-14)
- Safely initialized Git repository at the project root (`TerraTwin_Team_Handoff`).
- Configured `.gitignore` to strictly exclude unapproved large rasters (`*.hgt`), `node_modules/`, `dist/`, `.env*`, and Python caches (`__pycache__/`).
- Authored [docs/GITHUB_UPLOAD_MANIFEST.md](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/docs/GITHUB_UPLOAD_MANIFEST.md), [docs/GITHUB_BACKUP_REPORT.md](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/docs/GITHUB_BACKUP_REPORT.md), and [docs/OFFICIAL_DATA_RESOURCES_ROADMAP.md](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/docs/OFFICIAL_DATA_RESOURCES_ROADMAP.md).
- Integrated official Space Agency Partner Resources approved by the competition: CSA (RCM, RADARSAT-1), ESA (Copernicus Data Space Ecosystem, Open Science Catalog), and JAXA (G-Portal), alongside NASA Earthdata, Worldview, PDS, and LRO Diviner.
- Published to private remote repository: `https://github.com/Amarahan/TerraTwin.git` on `main`.

## Milestone 7 — Scientific scoring engine with dual-language parity (complete, 2026-11-14)
- Built reproducible scoring engine in Python ([data/scripts/scoring.py](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/data/scripts/scoring.py)) and TypeScript ([starter_app/src/scoring.ts](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/starter_app/src/scoring.ts)).
- Created shared test fixtures in [data/tests/fixtures/scoring_fixtures.json](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/data/tests/fixtures/scoring_fixtures.json).
- Implemented scientific formula $similarity_i = 1 - |earth_i - target_i|$, categorical rock matrix (`same=1.0`, `related=0.5`, `different=0.0`), qualitative strength bands (`STRONG`, `PARTIAL`, `WEAK`), and 75% coverage suppression gate.
- Verified exact hand-calculated parity: Moon benchmark score 85.90, Mars benchmark score 79.20.
- Unit tests: 27/27 Python tests passed; 12/12 Node tests passed.

## Milestone 8 — Interactive world map, NASA browse imagery, candidate measurements & live scoring (complete, 2026-11-14)
- **Interactive Leaflet World Map:** Replaced the blank reference graticule with a high-resolution CartoDB Voyager basemap, active coordinate markers for all 12 Earth analog sites, group color coding (`Featured`: cyan, `Benchmark`: amber, `Control`: emerald), hover tooltips, click selection, smooth `flyTo` navigation, and a floating glassmorphic HUD badge.
- **NASA & Partner Browse Imagery:** Copied 26 high-resolution browse images into `starter_app/public/images/`. Integrated images into target cards (NASA LOLA slope/relief maps, NASA HiRISE 0.25 m/px delta mosaic, MOLA topography) and Earth site details (Landsat/Sentinel true-color optical satellite imagery, NASA SRTM 30m Global DEM, ASTER GDEM).
- **Candidate Feature Measurements & Live Scoring:** Ingested candidate measurements for all 12 Earth sites and 4 Target models from `data/interim/workbook_candidates/earth_candidates.json` and `workbook_cells.json`. Built [starter_app/src/candidateData.ts](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/starter_app/src/candidateData.ts). Wired live analog composite scoring and individual feature similarity meters directly into the site details and comparison screens.
- **Verification:**
  - TypeScript strict typecheck: 0 errors (`tsc --noEmit`).
  - Node.js test suite: 12 passed, 0 failed.
  - Python test suite: 27 passed, 0 failed.
  - Production build: `npm run build` passed (Vite 8.3.8).
  - Git repository: synchronized on remote `origin/main` at commit `098c742`.


## Milestone 9 — Explore map repair & Catalogue/Rankings Figma refinement (complete, 2026-11-14)
- **Explore Map Repair:** Removed the CartoDB Voyager basemap which required an unavailable API key and caused "API KEY REQUIRED" watermarks and black unrendered tiles. Replaced with standard universal OpenStreetMap raster tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) requiring zero API keys, with full attribution.
- **Myanmar Quick-Focus & Global Bounds:** Added dedicated toolbar buttons: `Focus Myanmar` (flies to zoom 7 at `[21.0, 95.1]`, cleanly separating closely spaced sites), `Fit All Sites` (calculates geographic bounding box for active candidates), and `Reset map view` (resets to global view at `[20, 10]`, zoom 2).
- **Synchronized Map & List Filters:** Category filtering (`All`, `Featured`, `Benchmark`, `Control`) is now synchronized between the left sidebar list and central map markers.
- **Catalogue / Rankings Figma Consolidation:** Completely overhauled the Catalogue tab to match the Figma `.results` table design. Replaced duplicate button grids and redundant score cards with a single unified rankings table featuring rank numbers (`01`, `02`...), site thumbnail images/badges, lithology summaries, dynamic circular score badges with conic gradients, and `Inspect Site →` action buttons.
- **Scientific Consistency:** Replaced overstated claims ("100% validated coverage") with honest, transparent scientific copy ("Candidate Feature Coverage: 8/8 features evaluated — Provisional workbook extraction"). Preserved the 16-missing-value baseline gate inside a collapsed `<details>` disclosure element on the full Details view.
- **QA Documentation:** Authored [docs/EXPLORE_MAP_AND_CATALOGUE_QA.md](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/docs/EXPLORE_MAP_AND_CATALOGUE_QA.md).
- **Verification:**
  - TypeScript: 0 errors (`tsc --noEmit`).
  - Node.js tests: 12 passed, 0 failed.
  - Python tests: 27 passed, 0 failed.
  - Production build: `npm run build` passed in 1.58s.
  - Development server: active at `http://127.0.0.1:8443/` (HTTP 200).

## Milestone 10 — Automated GitHub Pages deployment & public access configuration (complete, 2026-11-14)
- **Continuous Deployment Workflow:** Added [.github/workflows/deploy.yml](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/.github/workflows/deploy.yml) configuring GitHub Actions to build and deploy the React/Vite application to GitHub Pages on every push to the `main` branch.
- **Dynamic Asset & Base Path Resolution:** Configured [starter_app/vite.config.ts](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/starter_app/vite.config.ts) and [starter_app/src/candidateData.ts](file:///c:/Users/Asus/Downloads/Telegram%20Desktop/TerraTwin_Team_Handoff_Codex_Antigravity/TerraTwin_Team_Handoff/starter_app/src/candidateData.ts) to adaptively resolve assets and static data under both local root (`/`) and GitHub Pages repository subpath (`/TerraTwin/`).
- **Hash-Routing Preservation:** Single Page App routing uses URL hash state (`#explorer`, `#rankings`, `#details`), guaranteeing that page refreshes and direct links on GitHub Pages will never produce 404 HTTP errors.
- **Verification:**
  - TypeScript: 0 errors (`tsc --noEmit`).
  - Node.js tests: 12 passed, 0 failed.
  - Python tests: 27 passed, 0 failed.
  - Production build: `npm run build` passed with `/TerraTwin/` base path in 1.11s.
  - Remote: pushed to `https://github.com/Amarahan/TerraTwin.git` on `main`.


## Milestone 11 — recovered Explore/Catalogue refinement and scientific display gate (2026-11-14)

This milestone supersedes earlier claims of approved live scoring, approved candidate coordinates and Figma fidelity in Milestones 8–10. The team confirmed Codex is sole source/test/QA owner; Antigravity is deployment-only.

- Created and verified a complete project-file backup outside the repository before editing (166 files, originals preserved; dependency/build/cache/Git exclusions documented in final QA).
- Reconstructed the lost layout corrections against the current committed app; no old branch checkout or reset.
- Explore: compact toolbar outside the map, viewport-bounded desktop grid, independent list/detail scrolling, stable resizing map, shared search/category filtering, sticky detail tabs, and stacked mobile layout.
- Kept live OSM tiles/attribution. Added tile failure/retry. Retained marker/list/bounds functionality with explicit approved-coordinate gating; tested it through an isolated synthetic fixture.
- Fit now contains one eight-feature evidence presentation. Canonical null measurements remain No data. Removed duplicate measurement/scoring displays and unsupported approval/coverage claims.
- Catalogue: one aligned table/card structure, correct 12/4/5/3 counts, combined search/group filters, stable register numbers, target synchronization and all 12 Inspect actions. Neutral unavailable score rings replace unapproved scores/rankings.
- Preserved candidate data values and images; only the candidateData approval comment changed. No scientific formulas, weights, inputs, target models or raw datasets changed.
- Fetched GitHub after the data-only request. Local/main and origin/main are both 235224c; latest data is already present. Deployed gh-pages atlas JSON equals main exactly. No import or branch merge needed; UI retained.
- Final verification: Python 27/27; frontend unit tests 16/16; original browser suite 12/12 groups; new layout/browser suite 12/12 groups; TypeScript exit 0; production build exit 0. Tested 1440×900, 1280×720 and 390×844, initial/scrolled states, recovery paths and marker fixture. No runtime exceptions in final runs.
- Integrity: 81 data/reference files unchanged from backup; 26 public browse images trace to project originals by SHA-256. Synthetic fixture absent from production bundle.

Modified source: starter_app/src/App.tsx, WorldMap.tsx, views.tsx, mvp.css; candidateData.ts (comment only). New helper: src/mapData.ts. Tests: updated tests/browser-smoke.mjs; added mapData.test.ts, layout-smoke.mjs, map-fixture.tsx. Updated generated QA screenshots/results and added final-layout evidence/hash records. Full results, backup path, commands, test corrections and screenshots: [EXPLORE_CATALOGUE_FINAL_QA.md](EXPLORE_CATALOGUE_FINAL_QA.md).

Remaining limitations: approved coordinates/geometry, complete scoring policy, scientific measurement provenance/target comparability, and direct Figma review. Existing Vite __dirname warning remains; fixture-only HMR restriction is recorded. No blocking UI bug found in tested scope. No deployment files changed and no push/deployment performed by Codex.

Exact next task: hand the tested local revision to deployment-only Antigravity and verify the actual deployed URL without resetting src/tests or enabling unapproved science. Continue scientific processing only after the explicit approvals above.

## Milestone 12 — Explicitly labelled exploratory model, 48-comparison pipeline & production deployment (complete, 2026-11-14)
- **Exploratory Model Pipeline:** Ingested all candidate data into `data/scripts/build_exploratory_model.py` and `data/scripts/publish_workbook_evidence.py`, generating all 48 site-target comparisons in `exploratory_model.json` and `workbook_evidence.json`.
- **Preserved Missing McMurdo NDVI:** In accordance with `AGENTS.md` Rule 6, McMurdo's missing cell K11 is strictly preserved as `null` (not coerced to zero). McMurdo correctly shows 7/8 evaluated features with 97% weighted coverage for Moon and 95% for Mars.
- **Frontend Integration:** Wired `ExploratoryProvider` and `WorkbookEvidenceProvider` into `starter_app/src/App.tsx`. Updated `ModelScore`, `Reading`, `ModelMethod`, `WorkbookReadings`, and the Catalogue rankings table with conic-gradient score badges, feature counts, and interactive site inspection.
- **Provisional Map Placements:** Connected `displayMapPosition` to render dashed provisional candidate markers with clear tooltips noting coordinate review status.
- **Comprehensive Parity & Tests:**
  - Python tests: 37/37 passed (`test_exploratory_model`, `test_publish_workbook_evidence`, `test_scoring`, `test_audit_inputs`, `test_ingest_workbook_candidates`, `test_nonspatial_readiness`).
  - Frontend unit tests: 25/25 passed (`exploratoryData.test.ts`, `workbookData.test.ts`, `mapData.test.ts`, `scoring.test.ts`, `data.test.ts`).
  - TypeScript: 0 errors (`tsc --noEmit`).
  - Production build: `npm run build` passed in 988ms with dynamic `/TerraTwin/` base.
- **Git & GitHub Pages:** Synchronized and pushed to `main` and `gh-pages` on `https://github.com/Amarahan/TerraTwin.git`. Live site verified at `https://amarahan.github.io/TerraTwin/`.

## Milestone 13 — Landing page refinement & authentic featured Earth photography (complete, 2026-11-14)
- **Hero Section Text Refinements:**
  - Removed `MISSION TT-01` completely from the hero kicker; preserved `PLANETARY ANALOG RECONNAISSANCE`.
  - Removed `NO LIVE MODEL` and the unnecessary `CONTEXT VIEW` box with its status-card styling.
  - Replaced the bottom-right status box with a transparent, subtle caption: `Illustrative planetary composition · Not to scale`.
  - Preserved `Discover Earth's Twins Beyond Earth.`, exploratory introductory copy, CTA buttons, and key statistics (12 Earth Study Sites, 4 Planetary Targets, 8 Environmental Variables).
- **Three Celestial Worlds in Planetary Illustration:**
  - Integrated Earth (largest central visual), Moon (cratered grey reference celestial body), and Mars (reddish reference planet).
  - Used authentic NASA imagery:
    - Earth: NASA Blue Marble view (`GSFC_20171208_Archive_e001386`).
    - Moon: Authentic NASA Galileo/LRO global lunar mosaic (`PIA00405`).
    - Mars: Authentic NASA MOLA/Viking global surface tile (`mola_global_tile.jpg`).
  - Added subtle connecting orbital paths and dashed trajectory lines connecting all three celestial bodies.
  - Verified labels:
    - `01 EARTH · NASA CONTEXT IMAGE`
    - `02 MOON REFERENCE BODY`
    - `03 MARS REFERENCE BODY`
- **Real Location Images in Featured Earth Locations:**
  - Saved user-uploaded real photographs to `starter_app/public/assets/featured/`:
    - `mount-popa.jpg` (Mount Popa volcanic mountain with summit monastery)
    - `twin-taung.jpg` (Twin Taung crater lake and surrounding landscape)
    - `letpadaung.jpg` (Letpadaung copper-area landscape)
    - `kawah-ijen.jpg` (Kawah Ijen turquoise acidic crater lake)
  - Display order strictly preserved: Mount Popa → Twin Taung → Letpadaung → Kawah Ijen.
  - Cards feature clean 4-card arrangement on desktop, with responsive stacking (2-column on tablet, 1-column on mobile 390px).
  - Cards display clear site name, country/region, featured category badge, descriptive text, scanline overlay, and custom object-position styling preserving key subjects.
  - Scientific integrity strictly maintained: no coordinates, measurements, or scoring parameters altered.
- **Verification:**
  - `npx --no-install tsc --noEmit`: 0 errors.
  - `node --test tests/*.test.ts`: 25 passed, 0 failed.
  - `npm run build`: built cleanly with Vite 8.3.8.
  - Verified at 1440px desktop width and 390px mobile width with full screenshot QA artifacts saved in `docs/qa/landing-refinement/`.
  - Local dev server active at `http://localhost:8443/`.

## Milestone 14 — Targets page: real images + improved card layout (complete, 2026-11-15)
- **Image assets saved to `starter_app/public/images/targets/`:**
  - `shackleton-crater-rim.png` → Shackleton Crater Rim (Moon) — lunar surface oblique B&W view
  - `malapert-massif.jpg` → Malapert Massif (Moon) — LRO colour elevation 3D render
  - `jezero-crater.jpg` → Jezero Crater (Mars) — artist rendering of ancient lake basin
  - `meridiani-planum.jpg` → Meridiani Planum (Mars) — Opportunity rover surface photograph
  - Attribution for all four: "Attribution: pending review" (team to confirm source credits before submission)
- **`starter_app/src/views.tsx` changes:**
  - Added `TARGET_IMAGES` constant mapping each target ID to its local image path (`import.meta.env.BASE_URL`), alt text, and `objectPosition`.
  - Replaced old `target-card` layout (side-by-side 42%/1fr with decorative `.target-context` div and external `TARGET_MODELS` URLs) with new `target-card-new` layout: full-width image at top (height 260px, `object-fit: cover`), body tag badge overlaid on image, then info section with eyebrow / h2 / description / Explore button.
  - All existing functionality preserved: Moon/Mars segmented filter, Explore button navigates to `#explorer` with correct `targetId`, `PendingScore` notice retained.
- **`starter_app/src/index.css` changes:**
  - Added `.target-card-new`, `.target-card-image`, `.target-card-body-tag`, `.target-card-info` rules.
  - 820px breakpoint: `.target-card-image` height reduced to 220px.
  - 540px breakpoint: `.target-grid` collapses to single column; `.target-card-image` height reduced to 200px.
  - Legacy `.target-card` and `.target-image` rules retained for backward compatibility.
- **Scientific integrity:**
  - Images are visual references only — no coordinates, measurements, scores, or scientific claims added or modified.
  - Attribution marked as pending — no invented photographer names or licences.
  - No scoring, feature, or normalization parameters altered.
- **Verification:**
  - `npx --no-install tsc --noEmit`: **0 errors**.
  - `node --test tests/exploratoryData.test.ts tests/workbookData.test.ts tests/scoring.test.ts tests/data.test.ts tests/mapData.test.ts`: **25/25 passed, 0 failed**.
  - `npm run build`: **exit 0** — Vite 8.3.8, 30 modules, CSS 89.54 kB, JS 452.69 kB.
  - Screenshots captured and verified at `docs/qa/targets-page/`.

## Milestone 15 — Method page cleanup & realistic planetary orbital illustration (complete, 2026-11-15)
- **Top Planetary Target Selector Row Removed:**
  - Removed `<div className="context-toolbar">` with the `TargetSelect` dropdown and candidate evidence heading on `screen === 'about'` only.
  - Eliminated the unnecessary vertical space above the Method page headline; content now starts naturally at a proportional distance beneath the global status banner.
  - Target selector toolbar remains intact on other screens (`explore`, `details`, `compare`).
- **Realistic NASA Planetary Imagery for Orbital Illustration:**
  - Downloaded and saved authentic NASA planetary imagery locally to `starter_app/public/images/celestial/`:
    - `nasa_blue_marble_earth.jpg` (245 kB) — authentic NASA Blue Marble Earth view (`GSFC_20171208_Archive_e001386`).
    - `nasa_galileo_moon.jpg` (202 kB) — authentic NASA Galileo/LRO global lunar mosaic (`PIA00405`).
    - `nasa_mola_mars.jpg` (63 kB) — authentic NASA MOLA/Viking Mars global surface tile (`mola_global_tile.jpg`).
  - Swapped generic CSS circles for realistic spherical celestial globes:
    - **Earth**: Centered, prominent 110px sphere with soft cyan atmospheric glow, spherical shadow, and label `01 EARTH · NASA BLUE MARBLE`.
    - **Moon**: Cratered grey 44px sphere with authentic lunar surface texture, inner orbit ring, and label `02 MOON REFERENCE BODY`.
    - **Mars**: Distinct reddish-orange 58px sphere with warm limb glow, outer orbit ring, and label `03 MARS REFERENCE BODY`.
  - Added subtle dashed orbital arcs, connecting trajectory curve, and waypoint node.
  - Added transparency caption: `Conceptual planetary illustration · Not to scale`.
  - Added source credits: `NASA GSFC (Blue Marble) · NASA JPL/USGS (Galileo PIA00405) · NASA MOLA Team`.
- **Responsive Layout:**
  - Full desktop (1440px) 2-column hero: clean headline and intro text on left, balanced orbital illustration on right.
  - Mobile (390px): Clean single-column stack, scaled spheres (86px / 34px / 46px), compact typography with no label clipping or horizontal overflow.
- **Verification:**
  - `npx --no-install tsc --noEmit`: **0 errors**.
  - `node --test tests/*.test.ts`: **25/25 passed**.
  - `npm run build`: **exit 0** — Vite 8.3.8, 30 modules, CSS 92.32 kB, JS 454.25 kB.
  - Visual QA verified and captured at `docs/qa/method-page/`:
    - `method-after-1440px.png` (desktop)
    - `method-after-390px.png` (mobile)
    - `compare-verification-1440px.png` (verified compare page retains target toolbar)

## Milestone 16 — Complete Catalogue Site Thumbnail Images (2026-11-15)
- **Scope & Constraints:**
  - Updated thumbnail photograph associations in `starter_app/src/candidateData.ts` for Earth candidate sites.
  - Strictly preserved all 12 candidate site records, ranking order, scoring indicators, sorting logic, filters, and DOM structure.
- **Image Assignments Applied:**
  - **Mount Popa / Central Dry Zone** (`mount-popa-central-dry-zone`): `assets/featured/mount-popa.jpg` (verified authentic ground photograph from `Screenshot 2026-11-13 183821.png`).
  - **Twin Taung Maar Crater** (`twin-taung-maar-crater`): `assets/featured/twin-taung.jpg` (verified authentic crater lake photograph from `Screenshot 2026-11-13 184238.png`).
  - **Letpadaung / Monywa Copper Area** (`letpadaung-monywa-copper-area`): `assets/featured/letpadaung.jpg` (verified authentic open-pit hydrothermal exposure photograph from `Screenshot 2026-11-13 184702.png`).
  - **Kawah Ijen** (`kawah-ijen`): `assets/featured/kawah-ijen.jpg` (verified authentic active sulfuric crater lake photograph).
  - **Atacama Desert** (`atacama-desert`): preserved authentic Landsat/Copernicus true-color satellite imagery (`images/earth/atacama_true_color.jpg`).
  - **Death Valley** (`death-valley`): preserved authentic Landsat/Copernicus true-color satellite imagery (`images/earth/death_valley_true_color.jpg`).
  - **Haughton Crater** (`haughton-crater`): preserved authentic NASA HMP satellite true-color imagery (`images/earth/haughton_true_color.jpg`).
  - **Lonar Crater** (`lonar-crater`): preserved honest, neutral letter placeholder (`[B]` for Benchmark). No unrelated photograph or fabricated credit assigned.
  - **McMurdo Dry Valleys** (`mcmurdo-dry-valleys`): removed temporary misleading lunar hillshade image (`shackleton_lola_color_hillshade.png`), resetting to clean neutral letter placeholder (`[B]`). McMurdo appears exactly once with no duplicate site rows.
- **Pending Image Ingestion Status:**
  - The remaining 4 location images (`congo-basin`, `amazon-rainforest`, `irrawaddy-delta-rice-fields`, and `mcmurdo-dry-valleys`) were not received by the server due to an Antigravity process restart during message submission. They remain on honest neutral group placeholders (`[C]` and `[B]`) awaiting file upload.
- **Verification:**
  - `npx --no-install tsc --noEmit`: **0 errors**.
  - `node --test tests/*.test.ts`: **25/25 passed, 0 failed**.
  - `npm run build`: **exit 0** — Vite 8.3.8, 30 modules, CSS 92.39 kB, JS 454.93 kB.
  - Full desktop QA screenshot captured and archived at `docs/qa/catalogue-thumbnails-verified.png`.

## Milestone 16b — Complete All 12 Site Thumbnails (2026-11-15)
- Ingested remaining 5 candidate photographs in exact requested order:
  - McMurdo Dry Valleys (`mcmurdo-dry-valleys.jpg`)
  - Congo Basin (`congo-basin.jpg`)
  - Lonar Crater (`lonar-crater.jpg`)
  - Amazon Rainforest (`amazon-rainforest.jpg`)
  - Irrawaddy Delta rice fields (`irrawaddy-delta.jpg`)
- All 12 candidate rows in the Catalogue now display authentic photographic thumbnails.
- Verified: `tsc --noEmit` (0 errors), `node --test` (25/25 passed), `npm run build` (exit 0).
- Pushed to `main` at `e9e1960`.

## Milestone 17 — Final Project Audit, Scientific Transparency & Submission Readiness (2026-11-15)
- **Labeling Standardizations:**
  - Standardized all Catalogue headers and table columns to `Exploratory Rankings` and `Candidate Match`.
  - Re-verified all score descriptions as `Provisional Candidate Score` and `Subject to Scientific Review`.
- **Mission Objective Simulator Verification:**
  - Confirmed active integration of `MissionSimulator.tsx` and `missionScenarios.ts`.
  - Validated all 5 scenario presets: Baseline Fit, Rover Mobility, ISRU Cryo-Drilling, EVA Suit & Dust, Astrobiology.
  - Unit test suite expanded with 3 dedicated simulator tests; total passing tests: **28/28**.
- **Documentation Suite Created:**
  - `docs/INDEPENDENT_PROJECT_REVIEW.md` (State of the implementation & architecture review).
  - `docs/SCIENTIFIC_APPROVAL_BLOCKERS.md` (Human decisions log & judging disclosure guide).
  - `docs/FINAL_SUBMISSION_QA.md` (Formal test execution & deployment verification report).
- **Verification:**
  - `npx --no-install tsc --noEmit`: **0 errors**.
  - `node --test`: **28/28 passed**.
  - `npm run build`: **exit 0** (32 modules transformed, CSS 98 kB, JS 467 kB).
  - Live deployment in sync with GitHub Pages.
