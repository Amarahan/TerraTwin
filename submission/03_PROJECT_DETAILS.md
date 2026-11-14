# 03 — Project Details

**Project:** TerraTwin — Planetary Analog Atlas  
**Live site:** https://amarahan.github.io/TerraTwin/  
**Repository:** https://github.com/Amarahan/TerraTwin  
**Version:** Milestone 12 — 2026-11-14

---

## Overview

TerraTwin is a React + Vite + TypeScript single-page application backed by a reproducible Python data pipeline. It presents an exploratory comparison of 12 Earth analog candidate sites against 4 planetary targets on the Moon and Mars, using 8 scientific features derived from publicly accessible NASA, ESA, JAXA, and CSA satellite datasets.

All scientific results are explicitly labeled "Indicative Model Score (Provisional Candidate Extraction — Subject to Peer Review)." No results are claimed to be validated or peer-reviewed in this submission.

---

## Application Screens

### 1. Planetary Targets Tab (`#targets`)
Displays four NASA mission-relevant targets as cards with NASA/PDS browse imagery:
- **Shackleton Crater Rim** — South Polar lunar region (Artemis-relevant)
- **Malapert Massif** — South Polar peak with near-continuous solar illumination
- **Jezero Crater** — Perseverance rover landing site; ancient delta stratigraphy
- **Meridiani Planum** — Opportunity rover site; hematite-rich plains

Each card shows browse imagery labeled "Browse image — contextual only, not a quantitative measurement."

### 2. Explore Tab (`#explorer`)
An interactive Leaflet world map with:
- OpenStreetMap tile basemap (zero API key required)
- 12 provisional dashed candidate markers (coordinates are PENDING_HUMAN_REVIEW)
- Group color-coding: Featured (cyan), Benchmark (amber), Control (emerald)
- Hover tooltips, click-to-select, smooth flyTo navigation
- Synchronized list/map filters: All, Featured, Benchmark, Control
- Search by site name
- Three toolbar buttons: Focus Myanmar, Fit All Sites, Reset map view
- Three-panel layout: site list / map / site detail panel

### 3. Catalogue / Rankings Tab (`#rankings`)
A unified rankings table showing all 12 sites against the active planetary target:
- Rank numbers (01–12), site badges, lithology summaries
- Circular conic-gradient score badges computed from the exploratory model
- Group filters, site search
- "Inspect Site →" action linking to full site details
- All scores explicitly labeled provisional

### 4. Site Details Tab (`#details`)
Full evidence panel for the selected site:
- ModelScore with explicit provisional label
- 8-feature comparison meters showing per-feature similarity values
- WorkbookReadings: source readings and workbook evidence for each feature
- NASA browse images labeled as contextual only
- Feature coverage count (McMurdo shows 7/8 — NDVI preserved as null)
- 75% weighted coverage gate: score suppressed if coverage is below threshold
- Collapsible baseline disclosure element

### 5. Compare Tab (`#compare`)
Side-by-side comparison of two Earth sites against the active planetary target:
- Model scores side by side
- Feature-by-feature comparison table
- Warning when the same site is selected twice

### 6. Method / About Tab (`#method`)
Full methodology transparency:
- Scoring formula: `score = 100 × Σ(wᵢ × similarityᵢ)`
- Numeric similarity: `similarityᵢ = 1 − |earthᵢ − targetᵢ|` (after normalization)
- Normalization ranges: slope/30, roughness/80, temp_contrast/200, dryness from rainfall
- Rock/mineral category matrix: same=1.0, related=0.5, different=0.0
- Per-target feature weights (summing to 1.00)
- Coverage gate: ≥75% weighted coverage required for composite score
- Explicit limitations disclosure: exploratory only, coordinates pending, no independent validation

---

## Data Pipeline

### Python Scripts (`data/scripts/`)
| Script | Purpose |
|---|---|
| `scoring.py` | Canonical scoring engine: normalization, similarity, composite |
| `build_exploratory_model.py` | Generates 48 site-target comparisons → `exploratory_model.json` |
| `publish_workbook_evidence.py` | Exports workbook evidence → `workbook_evidence.json` |
| `nonspatial_readiness.py` | Pre-spatial readiness audit |

### Data Flow
```
data/interim/workbook_candidates/
  earth_candidates.json  →  build_exploratory_model.py  →  public/data/exploratory_model.json
  workbook_cells.json    →  publish_workbook_evidence.py →  public/data/workbook_evidence.json
```

### TypeScript Scoring (`starter_app/src/scoring.ts`)
Identical algorithm to the Python engine. Shared fixtures in `data/tests/fixtures/scoring_fixtures.json` guarantee dual-language parity.

---

## Test Suite Summary

| Suite | Tests | Status |
|---|---|---|
| Python unittest | 37 | 37/37 passed |
| Node.js (frontend) | 25 | 25/25 passed |
| TypeScript strict typecheck | — | 0 errors |
| Production build | — | Passes (Vite 8.3.8, ~1s) |
| Browser smoke (12 groups) | 12 | 12/12 passed |

---

## Known Limitations

| Limitation | Status |
|---|---|
| Site coordinates | All 12 = PENDING_HUMAN_REVIEW |
| Scientific validation | Exploratory only; no peer review |
| McMurdo NDVI | Null (missing); 7/8 features; passes ≥75% coverage gate |
| Challenge title | NEEDS TEAM CONFIRMATION |
| Video | Requires human screen recording (storyboard provided) |
| Figma fidelity | Figma URL was inaccessible during development |

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript (strict) |
| Build tool | Vite 8.3.8 |
| Map | Leaflet + React-Leaflet |
| Styling | Tailwind CSS |
| Data pipeline | Python 3.x |
| Testing (Python) | unittest |
| Testing (Node) | Node.js built-in test runner |
| Deployment | GitHub Actions → GitHub Pages |
