# 01 — Feature Implementation Audit

**Project:** TerraTwin — Planetary Analog Atlas  
**Audit date:** 2026-11-14 (Milestone 12 state)  
**Basis:** `docs/PROJECT_PROGRESS.md` Milestones 1–12; verified test results.

---

## Audit Legend

| Status | Meaning |
|---|---|
| ✅ Implemented and tested | Feature is live, covered by automated tests, deployed |
| ⚠️ Implemented but not fully tested | Feature exists in production; test coverage partial |
| 🔶 Partially implemented | Core logic present; one or more sub-features missing |
| 📋 Planned but not implemented | Scoped in design plan; not yet built |
| 🚫 Blocked | Cannot proceed without an external decision or approval |

---

## 1. Navigation & Shell

| Feature | Status | Notes |
|---|---|---|
| Hash-based SPA routing (#targets, #explorer, #rankings, #details, #compare, #method) | ✅ Implemented and tested | 25/25 frontend tests pass; 12/12 browser smoke groups pass |
| Desktop navigation header | ✅ Implemented and tested | Verified 1440×900 |
| Mobile hamburger navigation (390 px) | ✅ Implemented and tested | Verified 390×844 |
| Loading, error, and "No data" states | ✅ Implemented and tested | Error-fixture test server used for QA |
| Back/forward browser navigation | ✅ Implemented and tested | Hash state preserved on reload |

---

## 2. Planetary Targets Tab

| Feature | Status | Notes |
|---|---|---|
| 4 target cards (Shackleton Crater Rim, Malapert Massif, Jezero Crater, Meridiani Planum) | ✅ Implemented and tested | Cards with NASA browse images and descriptive copy |
| Target selector updates active target globally | ✅ Implemented and tested | Shared state wired through ExploratoryProvider |
| NASA/PDS browse imagery on target cards | ✅ Implemented and tested | 26 images copied to public/images/; labeled "Browse image — contextual only" |
| Quantitative target feature values (scientific) | 🚫 Blocked | Coordinates pending human review; values are exploratory/provisional only |

---

## 3. Explore Tab

| Feature | Status | Notes |
|---|---|---|
| OpenStreetMap Leaflet basemap (zero API key) | ✅ Implemented and tested | CARTO replaced with OSM tiles (Milestone 9) |
| 12 provisional dashed candidate markers | ✅ Implemented and tested | Markers display with tooltip "PENDING_HUMAN_REVIEW" |
| Hover tooltips on markers | ✅ Implemented and tested | |
| Click marker → select site | ✅ Implemented and tested | |
| Smooth flyTo navigation | ✅ Implemented and tested | |
| Group color-coding (Featured/Benchmark/Control) | ✅ Implemented and tested | Cyan, amber, emerald |
| Synchronized list/map category filters | ✅ Implemented and tested | |
| Search by site name | ✅ Implemented and tested | |
| Focus Myanmar button | ✅ Implemented and tested | Flies to zoom 7 at [21.0, 95.1] |
| Fit All Sites button | ✅ Implemented and tested | Calculates geographic bounding box |
| Reset map view button | ✅ Implemented and tested | |
| Three-panel layout (list / map / detail) | ✅ Implemented and tested | Stacks to single column on mobile |
| Tile failure/retry handling | ✅ Implemented and tested | |
| Approved scientific coordinates | 🚫 Blocked | All 12 site coordinates = PENDING_HUMAN_REVIEW |
| Data overlays / heatmaps | 📋 Planned but not implemented | Requires approved coordinates and pipeline outputs |

---

## 4. Catalogue / Rankings Tab

| Feature | Status | Notes |
|---|---|---|
| 12-site rankings table | ✅ Implemented and tested | Rank numbers 01–12, site badges, lithology summaries |
| Conic-gradient circular score badges | ✅ Implemented and tested | Dynamically computed from exploratory model |
| Group filters (All / Featured / Benchmark / Control) | ✅ Implemented and tested | Counts verified: 4 / 5 / 3 / 12 |
| Search filter | ✅ Implemented and tested | |
| Inspect Site → action buttons | ✅ Implemented and tested | Navigates to site details |
| Target selector synchronization | ✅ Implemented and tested | |
| Rankings based on validated/peer-reviewed scores | 🚫 Blocked | Scores are explicitly labeled "Indicative — Provisional — Subject to Peer Review" |

---

## 5. Site Details Tab

| Feature | Status | Notes |
|---|---|---|
| ModelScore display with provisional label | ✅ Implemented and tested | Label: "Indicative Model Score (Provisional Candidate Extraction — Subject to Peer Review)" |
| 8-feature comparison meters (similarity bars) | ✅ Implemented and tested | Per-feature similarity from exploratory model |
| Source readings / workbook evidence | ✅ Implemented and tested | WorkbookReadings wired to workbook_evidence.json |
| NASA browse images | ✅ Implemented and tested | 26 images; each labeled "Browse image — contextual only, not a quantitative measurement" |
| Feature coverage count display | ✅ Implemented and tested | McMurdo correctly shows 7/8 features |
| 75% weighted coverage gate | ✅ Implemented and tested | Score suppressed if coverage < 75% |
| Null values preserved as null (not coerced to zero) | ✅ Implemented and tested | McMurdo NDVI null preserved; 37/37 Python tests pass |
| "No data" state for missing features | ✅ Implemented and tested | |
| Coordinate display | 🚫 Blocked | Coordinates labeled PENDING_HUMAN_REVIEW |

---

## 6. Compare Tab

| Feature | Status | Notes |
|---|---|---|
| Side-by-side model scores for two sites | ✅ Implemented and tested | |
| Feature-by-feature comparison table | ✅ Implemented and tested | |
| Same-site-twice warning notice | ✅ Implemented and tested | |
| Target selection updates compare columns | ✅ Implemented and tested | |
| Peer-reviewed score comparison | 🚫 Blocked | Comparison uses exploratory/provisional scores |

---

## 7. Method / About Tab

| Feature | Status | Notes |
|---|---|---|
| Scoring formula display | ✅ Implemented and tested | `score = 100 × Σ(wᵢ × similarityᵢ)` documented |
| Normalization tables | ✅ Implemented and tested | Slope/30, Roughness/80, Temp Contrast/200, Dryness formula |
| Limitations disclosure | ✅ Implemented and tested | Explicit "Exploratory Only" and "Provisional" disclaimers |
| Feature weight breakdown | ✅ Implemented and tested | Per-target weights summing to 1.00 |
| Rock/mineral category matrix | ✅ Implemented and tested | same=1.0, related=0.5, different=0.0 |
| References / data sources list | ✅ Implemented and tested | NASA, ESA, JAXA, CSA sources listed |

---

## 8. Data Pipeline

| Feature | Status | Notes |
|---|---|---|
| Python scoring engine (scoring.py) | ✅ Implemented and tested | 37/37 Python tests; dual-language parity with TypeScript |
| TypeScript scoring engine (scoring.ts) | ✅ Implemented and tested | 25/25 frontend tests |
| Exploratory model pipeline (build_exploratory_model.py) | ✅ Implemented and tested | 48 site-target comparisons generated |
| Workbook evidence publisher (publish_workbook_evidence.py) | ✅ Implemented and tested | Outputs workbook_evidence.json |
| Null-preservation for missing values | ✅ Implemented and tested | McMurdo NDVI null; not coerced to zero |
| Shared fixture parity (Python ↔ TypeScript) | ✅ Implemented and tested | scoring_fixtures.json; hand-calculated examples verified |
| Fully validated scientific measurements | 🚫 Blocked | All measurements are candidate/provisional; no independent peer review |
| Approved site coordinates / geometry buffers | 🚫 Blocked | PENDING_HUMAN_REVIEW |

---

## 9. Deployment & Infrastructure

| Feature | Status | Notes |
|---|---|---|
| GitHub Actions CI/CD (deploy.yml) | ✅ Implemented and tested | Triggers on push to main |
| GitHub Pages public deployment | ✅ Implemented and tested | https://amarahan.github.io/TerraTwin/ |
| Dynamic base path (local vs /TerraTwin/) | ✅ Implemented and tested | Vite config and candidateData.ts adaptive resolution |
| Public GitHub repository | ✅ Implemented and tested | https://github.com/Amarahan/TerraTwin |
| Production build (npm run build) | ✅ Implemented and tested | Passes in ~1s; 0 TypeScript errors |

---

## 10. Known Limitations (Honest Disclosure)

- **Scientific status:** All 48 comparisons are exploratory/indicative. No independent scientific validation has been performed.  
- **Coordinates:** All 12 Earth site coordinates are PENDING_HUMAN_REVIEW. Markers are explicitly provisional.  
- **Challenge title:** Not yet confirmed. Marked "NEEDS TEAM CONFIRMATION" throughout.  
- **McMurdo NDVI:** Null (missing data). Score uses 7/8 features; 97%/95% weighted coverage passes the ≥75% gate for Moon/Mars targets.  
- **No video:** Actual MP4 requires human screen recording. Storyboard and SRT provided.  
- **Figma fidelity:** Figma URL was inaccessible during development. Implementation is based on the existing starter app design direction.
