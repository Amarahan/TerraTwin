# TerraTwin — Planetary Analog Atlas: GitHub Upload Manifest

**Prepared Date:** 2026-11-14  
**Workspace Root:** `TerraTwin_Team_Handoff/`  
**Target Repository:** `https://github.com/Amarahan/TerraTwin.git` (Private)

---

## 1. Executive Summary

This manifest specifies the complete inventory of files, directories, size metrics, exclusion policies, data provenance notes, and licensing considerations for publishing the **TerraTwin — Planetary Analog Atlas** repository to GitHub.

- **Total Tracked Files for Upload:** 109 files (plus this manifest and the proposed `.gitignore`)
- **Total Upload Size:** ~5.93 MB
- **Git LFS Requirement:** None. No file exceeds 1.5 MB (well below GitHub's 50 MB recommendation and 100 MB hard limit).
- **Security & Secret Status:** Clean. No `.env` files, API keys, private tokens, or credentials detected.
- **Application Build Status:** Verified. TypeScript compilation and Vite production build succeed cleanly.

---

## 2. Repository Structure

The Git repository root is the complete `TerraTwin_Team_Handoff` folder (not `starter_app` alone), preserving all cross-discipline work:

```text
TerraTwin_Team_Handoff/
├── AGENTS.md                          # Mandatory agent rules and source-of-truth priority
├── README.md                          # Project overview and setup instructions
├── BUNDLE_CONTENTS.txt                # Curated package file listing
├── .gitignore                         # Repository-wide ignore rules (proposed)
├── data/                              # Curated datasets, manifests, scripts, and tests
│   ├── README.md                      # Data folder documentation
│   ├── earth/                         # Earth browse imagery (raw .hgt rasters excluded)
│   ├── input/                         # Input registers and documentation
│   ├── interim/                       # Audit reports and provisional registers (JSON)
│   ├── manifests/                     # Canonical manifests (CSV and README)
│   ├── mars/                          # Mars Trek catalogs, WMTS specs, browse previews
│   ├── moon/                          # Moon Trek catalogs, WMTS specs, browse previews
│   ├── processed/                     # Processed data placeholder and documentation
│   ├── raw/                           # Research spreadsheets and challenge reference HTML
│   ├── scripts/                       # Reproducible Python audit and validation pipeline
│   └── tests/                         # Python unit tests for input audits and readiness
├── design/                            # Design references and Figma specifications
│   └── FIGMA_REFERENCE.md             # Figma link and UI design guidelines
├── docs/                              # Project planning, architecture, and audit reports
│   ├── references/                    # Reference documentation (SRTM User Guide PDF)
│   ├── DATA_PIPELINE_CONTRACT.md      # Data pipeline schemas and invariants
│   ├── FRONTEND_INSTALL_BUILD_REPORT.md
│   ├── GITHUB_UPLOAD_MANIFEST.md      # This upload manifest
│   ├── P0_AUDIT_REPORT.md             # P0 audit findings and asset inventory
│   ├── P1_COORDINATE_CONFLICT_REPORT.md
│   ├── P1_MANIFEST_PATH_MISMATCH_REPORT.md
│   ├── P1_NONSPATIAL_READINESS_REPORT.md
│   ├── PROJECT_PROGRESS.md            # Sprint and milestone progress tracking
│   └── TerraTwin_Final_Development_Plan.md
├── prompts/                           # Ordered implementation prompts (00 to 06)
│   ├── 00_PROJECT_AUDIT.md
│   ├── 01_BACKEND_DATA_PIPELINE.md
│   ├── 02_SCORING_ENGINE.md
│   ├── 03_FRONTEND_FIGMA_PRIMARY_CODEX_PLAN_B_ANTIGRAVITY.md
│   ├── 04_INTEGRATION_AND_FUNCTIONAL_QA.md
│   ├── 05_FINAL_SCIENTIFIC_AND_DESIGN_QA.md
│   ├── 06_DEPLOYMENT_AND_HANDOFF.md
│   └── README_PROMPT_ORDER.md
└── starter_app/                       # React + Vite + TypeScript web application
    ├── index.html                     # HTML root entry point
    ├── package.json                   # App manifest and scripts
    ├── package-lock.json              # Exact dependency tree lockfile (preserved)
    ├── tsconfig.json                  # TypeScript compiler options
    ├── vite.config.ts                 # Vite bundler configuration
    ├── public/                        # Static web assets
    │   ├── favicon.png
    │   ├── assets/17d10.png
    │   └── data/atlas.json            # Validated pending-data browser JSON contract
    ├── scripts/                       # Frontend data generation and test server scripts
    │   ├── export_pending_data.py
    │   └── serve_error_fixture.py
    ├── src/                           # Frontend source code
    │   ├── App.tsx                    # Main app state, navigation, data loading
    │   ├── data.ts                    # TypeScript types and runtime data validation
    │   ├── index.css                  # Core design tokens and base styles
    │   ├── main.tsx                   # React DOM mount point
    │   ├── mvp.css                    # Component layout and responsive rules
    │   ├── Shell.tsx                  # App shell, navigation header, hero layout
    │   ├── views.tsx                  # Target selector, site list, detail view, compare
    │   ├── vite-env.d.ts              # Vite environment declarations
    │   └── WorldMap.tsx               # Leaflet coordinate-pending reference map
    └── tests/                         # Frontend tests
        └── data.test.ts               # Data contract and malformed JSON regression tests
```

---

## 3. Classification of Files for Upload

### Category A: Source Code (13 files)
- `starter_app/src/App.tsx` (2.8 KB)
- `starter_app/src/data.ts` (3.6 KB)
- `starter_app/src/index.css` (58.7 KB)
- `starter_app/src/main.tsx` (0.3 KB)
- `starter_app/src/mvp.css` (8.8 KB)
- `starter_app/src/Shell.tsx` (8.5 KB)
- `starter_app/src/views.tsx` (13.5 KB)
- `starter_app/src/vite-env.d.ts` (0.1 KB)
- `starter_app/src/WorldMap.tsx` (1.5 KB)
- `starter_app/index.html` (0.4 KB)
- `starter_app/vite.config.ts` (16.1 KB)
- `starter_app/tsconfig.json` (0.5 KB)
- `starter_app/package.json` (0.6 KB)
- `starter_app/package-lock.json` (61.1 KB)
- `data/mars/trekApi_mars.js` (5.8 KB)
- `data/moon/trekApi_moon.js` (5.8 KB)
- `data/mars/mars_trek.html` (2.4 KB)
- `data/mars/mars_trek_api.html` (4.2 KB)
- `data/moon/moon_trek.html` (7.8 KB)
- `data/moon/moon_trek_api.html` (4.2 KB)

### Category B: Documentation & Project Specifications (24 files)
- `AGENTS.md` (10.6 KB)
- `README.md` (2.2 KB)
- `BUNDLE_CONTENTS.txt` (3.7 KB)
- `design/FIGMA_REFERENCE.md` (0.3 KB)
- `docs/DATA_PIPELINE_CONTRACT.md` (5.0 KB)
- `docs/FRONTEND_INSTALL_BUILD_REPORT.md` (2.2 KB)
- `docs/GITHUB_UPLOAD_MANIFEST.md` (this file)
- `docs/P0_AUDIT_REPORT.md` (13.7 KB)
- `docs/P1_COORDINATE_CONFLICT_REPORT.md` (11.7 KB)
- `docs/P1_MANIFEST_PATH_MISMATCH_REPORT.md` (8.0 KB)
- `docs/P1_NONSPATIAL_READINESS_REPORT.md` (12.6 KB)
- `docs/PROJECT_PROGRESS.md` (4.3 KB)
- `docs/TerraTwin_Final_Development_Plan.md` (9.7 KB)
- `docs/references/SRTM_User_Guide_V3.pdf` (1,046.3 KB)
- `data/README.md` (1.5 KB)
- `data/input/README.md` (0.4 KB)
- `data/processed/README.md` (0.3 KB)
- `prompts/00_PROJECT_AUDIT.md` (1.3 KB)
- `prompts/01_BACKEND_DATA_PIPELINE.md` (2.0 KB)
- `prompts/02_SCORING_ENGINE.md` (1.6 KB)
- `prompts/03_FRONTEND_FIGMA_PRIMARY_CODEX_PLAN_B_ANTIGRAVITY.md` (2.6 KB)
- `prompts/04_INTEGRATION_AND_FUNCTIONAL_QA.md` (1.3 KB)
- `prompts/05_FINAL_SCIENTIFIC_AND_DESIGN_QA.md` (1.4 KB)
- `prompts/06_DEPLOYMENT_AND_HANDOFF.md` (1.1 KB)
- `prompts/README_PROMPT_ORDER.md` (1.3 KB)

### Category C: Python Scripts & Pipeline Tests (7 files)
- `data/scripts/audit_inputs.py` (29.5 KB)
- `data/scripts/nonspatial_readiness.py` (21.3 KB)
- `data/tests/test_audit_inputs.py` (4.7 KB)
- `data/tests/test_nonspatial_readiness.py` (2.1 KB)
- `starter_app/scripts/export_pending_data.py` (3.0 KB)
- `starter_app/scripts/serve_error_fixture.py` (1.2 KB)
- `starter_app/tests/data.test.ts` (1.8 KB)

### Category D: Data Manifests & Metadata Registers (24 files)
- `data/manifests/core_target_data_manifest.csv` (4.3 KB)
- `data/manifests/dataset_inventory.csv` (3.2 KB)
- `data/manifests/download_manifest.csv` (1.1 KB)
- `data/manifests/README.txt` (3.2 KB)
- `data/manifests/site_targets.csv` (0.6 KB)
- `data/interim/coordinate_conflict_report.json` (31.1 KB)
- `data/interim/data_coverage_report.json` (1.1 KB)
- `data/interim/manifest_path_reconciliation.json` (13.2 KB)
- `data/interim/nonspatial_readiness.json` (28.9 KB)
- `data/interim/provisional_site_target_register.json` (31.6 KB)
- `data/interim/source_asset_inventory.json` (34.5 KB)
- `data/moon/lola_kaguya_hillshade_metadata.html` (6.7 KB)
- `data/moon/lro_instruments.html` (306.9 KB)
- `data/moon/lro_nac_south_pole_metadata.html` (86.9 KB)
- `data/moon/moon_trek_polar_layers.json` (1,457.6 KB)
- `data/moon/shackleton_lola_slope_service.json` (0.7 KB)
- `data/moon/shackleton_lola_slope_wmts_capabilities.xml` (7.7 KB)
- `data/mars/ctx_global_wmts_capabilities.xml` (7.9 KB)
- `data/mars/hirise_global_wmts_capabilities.xml` (9.4 KB)
- `data/mars/mars_trek_eq_layers.json` (328.8 KB)
- `data/mars/mola_roughness_wmts_capabilities.xml` (5.0 KB)
- `data/mars/mola_wmts_capabilities.xml` (6.9 KB)
- `data/mars/tes_dust_index_wmts_capabilities.xml` (5.3 KB)
- `data/mars/tes_dust_wmts_capabilities.xml` (5.0 KB)
- `data/mars/trek_api_config.json` (10.0 KB)
- `data/raw/challenge_page.html` (84.0 KB)
- `data/raw/resources_page.html` (65.4 KB)

### Category E: NASA Scientific Datasets & Browser JSON (3 files)
- `starter_app/public/data/atlas.json` (39.8 KB) — Validated pending-data browser JSON contract.
- `data/raw/mee_lay_master_project_data(1).xlsx` (68.6 KB) — Research workbook with provisional site notes.
- `data/raw/mee_lay_complete_analog_data_expanded.xlsx` (10.6 KB) — Supplementary research workbook.

### Category F: Images & Browse/Preview Assets (28 files)
- `starter_app/public/favicon.png` (2.4 KB)
- `starter_app/public/assets/17d10.png` (10.1 KB)
- Earth browse tiles:
  - `data/earth/ASTGTMV003_N36W117.1.jpg` (39.9 KB)
  - `data/earth/ASTGTMV003_N75W090.1.jpg` (68.4 KB)
  - `data/earth/ASTGTMV003_S24W070.1.jpg` (26.4 KB)
  - `data/earth/atacama_true_color.jpg` (70.0 KB)
  - `data/earth/death_valley_aster_dem.jpg` (123.0 KB)
  - `data/earth/death_valley_true_color.jpg` (45.4 KB)
  - `data/earth/haughton_aster_dem.jpg` (50.0 KB)
  - `data/earth/haughton_true_color.jpg` (33.9 KB)
  - `data/earth/N36W117.SRTMGL1.2.jpg` (277.1 KB)
  - `data/earth/S24W070.SRTMGL1.2.jpg` (211.7 KB)
- Mars browse tiles:
  - `data/mars/jezero_ctx_global_mosaic.png` (15.5 KB)
  - `data/mars/jezero_hirise_global_mosaic.png` (16.0 KB)
  - `data/mars/jezero_mola_hillshade.png` (37.3 KB)
  - `data/mars/jezero_mola_hillshade_z6_r25_c91.jpg` (75.8 KB)
  - `data/mars/jezero_mola_roughness.png` (37.2 KB)
  - `data/mars/jezero_mola_roughness_z1_r0_c2.png` (165.0 KB)
  - `data/mars/jezero_tes_dust.png` (37.9 KB)
  - `data/mars/jezero_tes_dust_index.png` (42.2 KB)
  - `data/mars/jezero_tes_dust_index_z2_r1_c5.png` (196.1 KB)
  - `data/mars/jezero_tes_dust_z1_r0_c2.png` (158.3 KB)
  - `data/mars/mola_global_tile.jpg` (61.5 KB)
- Moon browse tiles:
  - `data/moon/malapert_lola_color_hillshade.png` (27.0 KB)
  - `data/moon/malapert_lola_color_slope.png` (41.6 KB)
  - `data/moon/malapert_lroc_dem_slope.png` (40.0 KB)
  - `data/moon/shackleton_lola_color_hillshade.png` (24.2 KB)
  - `data/moon/shackleton_lola_color_slope.png` (37.8 KB)

---

## 4. Files Intentionally Excluded

| Excluded Path | Size / Count | Reason for Exclusion | Location of Original |
| :--- | :--- | :--- | :--- |
| `starter_app/node_modules/` | ~6,300 files (~120 MB) | Transient package dependencies; fully reproducible via `package-lock.json` and `npm ci`. | Kept locally in `starter_app/node_modules/`. |
| `starter_app/dist/` | 3 files (~480 KB) | Ephemeral frontend build artifacts; recreated by `npm run build`. | Kept locally in `starter_app/dist/`. |
| `data/earth/N36W117.hgt` | 24.73 MB (25,934,402 B) | Raw SRTM binary terrain raster. Lacks verified download provenance, not listed in download manifest, and large raw data. Excluded pending team coordinate and provenance confirmation. | Preserved locally in `data/earth/N36W117.hgt`. |
| `data/earth/S24W070.hgt` | 24.73 MB (25,934,402 B) | Raw SRTM binary terrain raster. Lacks verified download provenance, not listed in download manifest, and large raw data. Excluded pending team coordinate and provenance confirmation. | Preserved locally in `data/earth/S24W070.hgt`. |
| `data/scripts/__pycache__/` | 2 files (73.3 KB) | Python bytecode cache (`*.pyc`). Not needed in version control. | Kept locally in `data/scripts/__pycache__/`. |
| `data/tests/__pycache__/` | 2 files (14.0 KB) | Python bytecode cache (`*.pyc`). Not needed in version control. | Kept locally in `data/tests/__pycache__/`. |
| `.env*`, credentials | 0 files | Security: private keys and environment tokens must never enter Git. | Ignored by pattern. |

---

## 5. File Size and Git Constraints Analysis

1. **GitHub File Size Limits:**
   - GitHub warns on files > 50 MB and blocks files > 100 MB.
   - In our tracked candidate set, the largest file is `data/moon/moon_trek_polar_layers.json` at **1.42 MB**, followed by `docs/references/SRTM_User_Guide_V3.pdf` at **1.02 MB**.
   - No individual file approaches GitHub limits.
2. **Git LFS:**
   - Because the two 25 MB unverified `.hgt` files are excluded, total repository upload size is only **~5.93 MB**.
   - Git LFS is **not required**, keeping cloning fast, dependencies minimal, and maintenance simple.

---

## 6. Licensing and Attribution

1. **NASA Data and Browse Imagery:**
   - Moon Trek, Mars Trek, LOLA, MOLA, TES, LROC, and SRTM browse products are NASA/JPL-Caltech/USGS public domain scientific assets.
   - Attribution is preserved in `data/manifests/dataset_inventory.csv`, `README.md`, and application source citations.
2. **Research Workbooks and Notes:**
   - Created for the NASA Space Apps Challenge 2026; private research status until official challenge publication.
3. **Application Code:**
   - Developed with React, TypeScript, Leaflet, and Tailwind CSS.
   - Dependencies under permissive open-source licenses (MIT/ISC).

---

## 7. Data Provenance & Integrity Status

- In compliance with `AGENTS.md` and `docs/DATA_PIPELINE_CONTRACT.md`:
  - **No Hardcoded Scientific Data:** All displayed values in `starter_app` come from `atlas.json`.
  - **Scientific Honesty:** Coordinates and measurements remain pending review (`null` / `"PENDING_HUMAN_REVIEW"`). No synthetic numbers, fake rankings, or arbitrary similarity percentages are committed.
  - **Unverified HGT Rasters:** Raw tiles are excluded from Git to prevent unverified data promotion into canonical version history.

---

## 8. Required Future Additions

When approved by the human scientific team:
1. Canonical coordinates and geometry buffers for all 12 Earth analog sites.
2. Validated quantitative source rasters downloaded through official NASA Earthdata / Earth Engine pipelines.
3. Finalized scoring formula parameters (Moon/Mars weight presets, normalization ranges, rock/mineral similarity category matrix).
4. Automated CI pipeline (GitHub Actions) for running TypeScript type checking, unit tests, and Python data validation.
