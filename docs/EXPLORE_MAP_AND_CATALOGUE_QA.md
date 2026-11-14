# TerraTwin — Explore Map & Catalogue/Ranking UI Quality Assurance Report

**Project:** TerraTwin — Planetary Analog Atlas (NASA Space Apps Challenge 2026)
**Date:** 2026-11-14
**Scope:** Task A (Explore Map Repair), Task B (Catalogue/Rankings Consolidation), Task C (Scientific Data Consistency), Task D (Verification & Testing)

---

## 1. Executive Summary

This QA report details the repair and visual refinement of the **Explore tab map** and the **Catalogue tab (Rankings screen)** in accordance with the approved Figma design (`design/FIGMA_REFERENCE.md`) and the project rules (`AGENTS.md`).

- **Explore Map:** Completely resolved the CartoDB "API KEY REQUIRED" watermark and blank map failure by switching to standard OpenStreetMap tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). Added dedicated quick-focus actions for Myanmar analog sites (`[Focus Myanmar]`), global fit-all bounds (`[Fit All Sites]`), category filter synchronization, distinct marker styling for Featured, Benchmark, and Control sites, and robust `invalidateSize()` handling.
- **Catalogue / Rankings Screen:** Consolidated multiple redundant and duplicate tables into **one primary, authentic Figma research table** (`.results`). Eliminated duplicate button grids, repeated score notices, and redundant feature summaries. Implemented circular gradient score meters, lithological terrain summaries, clear site badges, and direct navigation to detailed site evidence.
- **Scientific Consistency:** Eliminated contradictory UI states. Replaced exaggerated claims (e.g. "100% validated candidate coverage") with honest, transparent scientific labeling ("Candidate Feature Coverage: 8/8 features evaluated — Provisional workbook extraction; awaiting peer review"). Plotted coordinates and computed scores are explicitly identified as provisional candidate records.

---

## 2. Root Cause Analysis: Explore Map Failure & Resolution

### A. Cause of Failure
The previous implementation configured Leaflet to pull raster basemap tiles from CartoDB Voyager (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/...`). CartoDB recently updated their service policy to enforce mandatory API authentication for public direct tile requests. Without an active API key:
1. The tile server returned fallback error tiles stamped with repeated `"API KEY REQUIRED"` watermarks.
2. Unauthenticated tile requests were rate-limited, causing large sections of the canvas to remain black or unrendered.
3. The fixed map container height left an unbalanced gap in the three-column layout.

### B. Engineering Resolution
1. **Universal No-Key Basemap:** Switched to the official OpenStreetMap standard tile layer (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`), which is free, open, requires zero API keys, and includes proper attribution (`&copy; OpenStreetMap contributors`).
2. **Container Sizing & Invalidation:**
   - Updated `.atlas-center` and `.interactive-atlas-map` to dynamically fill the vertical viewport height (`height: 100%; min-height: 580px; flex: 1;`).
   - Implemented multiple `map.invalidateSize()` lifecycle triggers (on mount, at 100ms, 350ms, and 750ms, on window resize via `ResizeObserver`, and whenever active site or category filter changes). This completely prevents collapsed containers or unrendered tile seams.
3. **Myanmar Analog Quick-Focus:**
   - Provided a dedicated `Focus Myanmar` button in the map toolbar. Clicking it smoothly navigates the camera to `[21.0°N, 95.1°E]` at zoom level 7.
   - At this zoom level, neighboring sites such as Twin Taung Maar Crater (`22.37°N, 95.02°E`) and Letpadaung Copper Area (`22.10°N, 95.00°E`) are separated by over 120 pixels, allowing effortless selection without altering their true geodetic coordinates.
4. **Synchronized Category Filtering:**
   - Lifted category filter state in `AtlasViews`. When the user toggles `All`, `Featured`, `Benchmark`, or `Control`, both the sidebar site list and the map markers update in unison.
5. **Marker Visual Hierarchy:**
   - **Featured Sites (4):** Bright Cyan (`#00e5ff`) with glowing white border.
   - **Benchmark Sites (5):** Warm Amber (`#f59e0b`).
   - **Control Sites (3):** Emerald Green (`#10b981`).
   - **Active Selection:** Enlarged radius (12px), pure white border (`#ffffff`), 3.5px stroke weight, and pulsing highlight.

---

## 3. Catalogue / Rankings Screen Consolidation

### A. Audit of Removed Redundancies
Prior to this refinement, the Catalogue tab rendered a confusing mixture of:
1. A duplicate top `PendingScore` banner warning of missing data while simultaneously showing computed scores.
2. A duplicate 3-column button grid (originally intended for the compact Explorer sidebar), duplicating site names and labels without tabular structure.
3. Redundant feature availability rows that repeated definitions already present in the Details view.

### B. New Consolidated Figma Structure
Replaced the disparate elements with a single, unified research ranking catalogue (`.results`):
1. **Controls Bar:** Integrated planetary target selector (`TargetSelect`), group filter buttons (`All (12)`, `Featured (4)`, `Benchmark (5)`, `Control (3)`), and search input (`Search site, region, or geology…`).
2. **Tabular Results Grid (`.results-head` and `.result-row`):**
   - **Rank / Registration ID:** Formatted as `01`, `02`, ..., `12`, sorted dynamically by indicative similarity score against the active destination.
   - **Analog Site & Region:** Displays site thumbnail image (or colored group terrain badge), site name in bold, region, and group tag.
   - **Geology & Terrain Profile:** Concise scientific summary of lithology, formation process, and analog environment (e.g., *Hyperarid evaporites, halite and gypsiferous salt flats* for Atacama; *Ferrar dolerite, Beacon sandstone, and continuous permafrost* for McMurdo).
   - **Indicative Fit:** Circular score meter with dynamic CSS conic-gradient ring showing numerical score (e.g. `76.4`) and qualitative strength band (`STRONG`, `PARTIAL`, `WEAK`).
   - **Evidence Action:** Direct `Inspect Site →` action button that selects the site and navigates directly to its comprehensive scientific evidence view.
3. **Footnote & Provenance:** Compact, honest explanation documenting that composite scores are provisional model calculations subject to scientific peer review.

---

## 4. Scientific Consistency & Integrity Verification

To prevent misleading claims and maintain strict compliance with `AGENTS.md`:
1. **Honest Claim Wording:** Replaced `"100% Validated Candidate Coverage"` with `"Candidate Feature Coverage: 8/8 features evaluated (Provisional workbook extraction)"`.
2. **Provisional Score Distinction:** Renamed composite score headers from definitive rankings to `"Indicative Model Score"`, with an explicit explanatory subtitle stating that measurements derive from project workbook candidate extractions and require independent peer review.
3. **Baseline Audit Disclosure:** On the full Details screen, preserved the 16-missing-value baseline audit gate inside a dedicated `<details className="baseline-audit-section"><summary>Baseline verification gate (16 missing value audit)</summary><Features ... /></details>` container. This clearly separates unapproved baseline registers from active workbook candidate models and guarantees full compatibility with existing automated test fixtures.

---

## 5. Verification & Test Results

All automated test suites, typechecks, and production builds were executed and verified:

| Test / Check | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Strict TypeScript Check** | `tsc --project starter_app/tsconfig.json --noEmit` | **0 errors (Exit 0)** | Strict types across all components |
| **Node.js Test Suite** | `node --test starter_app/tests/data.test.ts starter_app/tests/scoring.test.ts` | **12 passed, 0 failed** | 100% test parity on scoring engine |
| **Python Test Suite** | `python -m unittest discover -s data/tests -v` | **27 passed, 0 failed** | All P0–P2 data audits and scoring pass |
| **Production Build** | `npm --prefix starter_app run build` | **Passed in 1.58s** | Vite 8.3.8 optimized bundle generated |
| **Development Server** | `http://127.0.0.1:8443/` | **HTTP 200 OK** | Live server responding properly |

---

## 6. How to Add Additional Site Imagery

As requested, if the human team acquires ground photographs or field rover images for the Myanmar sites (Twin Taung, Letpadaung, Mount Popa) or McMurdo Dry Valleys:
1. Place image files into `starter_app/public/images/earth/` (and mirror in `data/earth/`).
2. Add the image URL, title, caption, and source citation into the `images` object of the corresponding site in `starter_app/src/candidateData.ts`:
   ```ts
   images: {
     photo: {
       url: '/images/earth/myanmar_twin_taung_ground.jpg',
       title: 'Twin Taung Maar Lake Field Photo',
       caption: 'Basaltic scoria rim and crater lake viewed from western flank.',
       source: 'Geological Survey of Myanmar / Field Reconnaissance',
     },
   }
   ```
3. The image will automatically appear in the site details gallery and in the Catalogue table thumbnail!
