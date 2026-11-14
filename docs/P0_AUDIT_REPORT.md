# TerraTwin P0 Audit Report

**Audit date:** 14 November 2026  
**Scope:** supplied handoff bundle, data assets and manifests, research workbooks, starter application, development plan, data contract, ordered prompts, and Figma access.

## Executive summary

The handoff is a useful prototype bundle, but it is not yet a reproducible end-to-end project. The starter app contains hardcoded scientific-looking values and unsupported scores; most supplied Moon and Mars files are browse imagery, catalogues, or WMTS-rendered map tiles rather than analysis rasters. The master workbook contains a 12-site research dataset, but it explicitly identifies unresolved coordinates, missing values, incomparable target values, and assumptions requiring team decisions. The target CSV and workbook are not equivalent registers. The final Figma file could not be inspected from this environment.

P1 ingestion and scoring must wait for approval of the canonical registers, coordinate/geometries, eight-feature definitions, source/value acceptance, and scoring policy. No scientific values or scores were changed or generated during this audit.

## 1. Repository and application

- The directory is a supplied handoff folder, not a Git checkout: no `.git` metadata is present, so commit history and a Git diff are unavailable.
- The existing app is `starter_app/`, a React 19 + Vite 8 + TypeScript 5.7 application using Leaflet 1.9. It is configured for strict TypeScript and has `dev`, `build`, `preview`, and `format` npm scripts. There is no lockfile or `node_modules` directory.
- `src/App.tsx` currently embeds a 12-site list with coordinates, environmental descriptions, illustrative temperatures, numeric scores, and narrative suitability claims. This conflicts with the data contract's requirement that such values come from approved, source-backed files. The app also includes network-backed imagery/map layers whose availability and attribution have not been verified.
- `public/` contains only a favicon and one image asset; there is no `public/data/` browser contract. There is no Python pipeline, schema, or test suite.
- `npm run build` was attempted from `starter_app/` and failed because Vite is not installed (`'vite' is not recognized`). Python 3.14.2 is present; `pytest`, `openpyxl`, and `rasterio` are not installed.
- The app has an existing architecture worth preserving. P3 should modify its current `src/` and approved assets after Figma inspection, rather than create another app.

## 2. Supplied data inventory and classification

The `data/` tree contains 57 files: 4 CSV, 2 HGT, 9 HTML, 12 JPEG, 2 JavaScript, 4 JSON, 14 PNG, 1 TXT, 2 XLSX, and 7 XML.

### Earth

- `S24W070.hgt` and `N36W117.hgt` are the only supplied full numeric terrain rasters. Each is 25,934,402 bytes, matching the SRTM1 3,601 × 3,601 two-byte HGT layout in the [NASA SRTM Collection User Guide](https://lpdaac.usgs.gov/documents/179/SRTM_User_Guide_V3.pdf). This size check does not verify each file's product version, units, void-fill lineage, or download provenance; the HGT rows are absent from the supplied download manifest. The tile names correspond to the approximate Atacama and Death Valley CSV locations, subject to approval of site point/buffer and verification of tile metadata/NoData handling.
- Twelve JPEGs comprise SRTM/ASTER browse tiles and selected regional imagery. These are useful for visual context, not numeric elevation sampling.
- Haughton has an ASTER browse image only; no full numeric Haughton raster is included. No quantitative temperature, vegetation, aerosol, mineral, or ice source rasters are included for the Earth sites.

### Moon

- `moon_trek_polar_layers.json`, Moon Trek HTML/JavaScript, metadata pages, and WMTS capability/service records are catalogue, API, or provenance references.
- The Shackleton and Malapert slope/hillshade assets are small PNG preview maps. A colourized slope preview must not be sampled as quantitative slope data.
- No numeric DEM, temperature, illumination, dust, ice, or lithology extraction is included.

### Mars

- Mars Trek layer JSON, HTML/JavaScript, and seven WMTS capability XML files are catalogue/service metadata.
- The Jezero MOLA, roughness, TES dust/dust-index, CTX, and HiRISE PNG/JPEG assets are rendered regional/global preview or WMTS tiles. They provide visual context, not calibrated numeric pixel values.
- No Meridiani-specific data is included. No numeric target extraction is supplied for Jezero or Meridiani.

### Research workbooks and manifests

- `mee_lay_master_project_data(1).xlsx` has 18 sheets and includes a proposed 12-site register and Earth feature values. It reports unresolved coordinate/source issues, incomplete rock/ice coverage, missing Moon/Mars values, and a reference sample still to be generated. Its values cannot be promoted to canonical outputs without checking the sheet-level formulas, provenance, and human approval.
- `mee_lay_complete_analog_data_expanded.xlsx` has three sheets (Moon Targets, Mars Targets, Earth Gaps - Rock & Ice). It is an additional research artifact; its contents have not been approved as the canonical register or target values.
- Manifests distinguish browse imagery from direct analysis data. The download manifest lists JPEG browse tiles, while the HGT tiles are present but not listed there; this provenance gap should be reconciled before pipeline use.
- Two exact duplicate pairs exist: `data/moon/trekApi_moon.js` and `data/mars/trekApi_mars.js`, and `data/moon/moon_trek_api.html` and `data/mars/mars_trek_api.html`.

## 3. Registers, coordinate conflicts, and data gaps

- `data/manifests/site_targets.csv` has three Earth sites, two Moon targets, and Jezero Crater. It has neither the twelve Earth sites nor the four targets required by the plan; Meridiani Planum is absent. Its rows combine Earth sites and planetary targets, whereas the contract separately describes `targets` and `sites`.
- The master workbook's proposed 12 Earth sites are Twin Taung, Letpadaung, Mount Popa, Kawah Ijen, Atacama/Yungay, Haughton, McMurdo, Death Valley, Lonar, Amazon, Congo, and Irrawaddy Delta. This is a candidate register, not a confirmed replacement for the CSV.
- Coordinates differ between CSV and workbook for Atacama (−23.86, −69.13 vs −24.1, −70), Death Valley (36.53, −116.93 vs 36.46, −116.87), and Haughton (75.37, −89.68 vs 75.4, −89.7). McMurdo differs (161.717° vs 162° longitude). The workbook additionally flags Twin Taung's selected point as about 41 km from a cited field-centre coordinate; Letpadaung has no sourced coordinate, and Kawah Ijen's CSV point is described as from memory. Do not extract site-wide values until the team chooses the canonical site register and approves coordinates/geometries.
- The plan's eight features are slope, surface roughness, temperature contrast, dryness, vegetation/bareness, rock/mineral type, water ice/permafrost, and dust/wind or aerosol proxy. The workbook uses somewhat different labels/definitions (including temperature range, rainfall, NDVI, and aerosol AOD), so the mapping and units need team approval.
- The plan and contract leave normalization ranges/direction, Moon/Mars weights, rock/mineral similarity, ice/permafrost encoding, missing-data policy/minimum coverage, percentile/tie handling, reference sampling, and validation thresholds open. No scoring implementation can be scientifically finalized until these are decided.
- The workbook itself notes comparability problems: published lunar numbers do not match the proposed spatial method; target measurements remain to be computed; some terrestrial values are missing or have uncertain provenance; and no reproducible reference sample is included.

## 4. NASA Trek services and limitations

- Local capability files identify NASA Trek WMTS endpoints under `https://trek.nasa.gov/tiles/{Moon|Mars}/{SP|EQ}/{layer}/1.0.0/`. Examples include Shackleton `Site04_final_adj_5mpp_ColorSlope` (polar layer, `urn:ogc:def:crs:EPSG::0`) and Mars `Mars_MGS_MOLA_ClrShade_merge_global_463m` (equirectangular layer, `urn:ogc:def:crs:EPSG::104905`). The Moon catalog advertises polar stereographic and equirectangular projections; Mars catalog entries use Mars equirectangular projection identifiers. Exact layer identifiers and matrix metadata are retained in the supplied capability/catalogue files.
- These services expose rendered WMTS map tiles. They can support a clearly labelled visual context layer if browser access, CORS, service availability, attribution, and map projection behavior are verified. They are not source rasters for the scoring pipeline.
- The supplied global/preview layer coverage is not uniform across targets or zoom levels. Do not interpret tile resolution labels as measurement resolution or infer feature values from the image colors.
- No service request was made during this audit; operational availability and cross-origin behavior remain unverified.

## 5. Design audit

- The only local design artifact, `design/FIGMA_REFERENCE.md`, contains the approved Figma URL and says the handoff does not contain an export of the editable Figma document.
- Opening the Figma URL via the available web reader failed, and no browser tab was available for an authenticated inspection. Frames, assets, tokens, components, and responsive states therefore remain unaudited.
- Because Figma is the approved design source of truth, frontend visual work cannot be validated or safely adjusted until a team member makes the file accessible or provides approved exports/screenshots and responsive references.

## 6. What can be computed now

- The two SRTM HGT tiles are potentially usable quantitative terrain inputs for samples inside those tiles, after the team approves the site geometry, HGT provenance, processing method, resolution, and handling of voids. They do not cover the full twelve-site register.
- The supplied JPEG/PNG previews support visual context only. They cannot produce scientifically defensible site/target measurements.
- Earth values in the workbook may support a provisional research review, but not canonical browser outputs or scores until each value's provenance, formula, units, coordinates, and status are reviewed and approved.
- No final eight-feature target comparison, composite score, percentile, or internal reference check can be computed from the supplied approved data as it stands.

## 7. Proposed implementation sequence and files

No major implementation has been started. After the gates below are resolved:

1. **P1:** create `data/input/`, `data/interim/`, `data/processed/`, `data/scripts/`, `data/tests/`, and `starter_app/public/data/`; add the approved registers/source notes, reproducible parsing/validation/processing, provenance and coverage reports, and generated metadata/features/sites/targets JSON. Keep original files under `data/raw/`.
2. **P2:** add a single approved scoring configuration; pure Python and TypeScript scoring modules; shared fixtures; validation, boundary, missing-value, category, and hand-calculated tests. Do this only after all method parameters are frozen.
3. **P3:** update existing `starter_app/src/` components and styles and connect them to the approved `public/data/` and scoring contract. Preserve the app and implement only Figma-verified design and supported functionality.
4. **P4–P5:** integration and responsive/accessibility/scientific QA in existing code and tests; fix issues in the responsible modules.
5. **P6:** update the project README/setup and deployment instructions, then verify build and the approved static deployment path. Do not claim deployment without a deployment destination and verification.

## 8. Decisions required from the human team

Please provide or approve:

1. The canonical 12-site and four-target register, with stable IDs, names, group/category, coordinates, and geometry/buffer. Confirm whether the master workbook's twelve sites and coordinate set supersede the partial `site_targets.csv`.
2. Resolutions for the flagged Twin Taung, Letpadaung, Kawah Ijen, and inter-register coordinate discrepancies; approve any geometry/buffer and whether the two SRTM tiles can be processed for the relevant sites.
3. The exact eight feature definitions/units and the approved mapping of workbook fields to those definitions.
4. Approval of workbook-derived values with their source/method/status, or approved source data and citations for unresolved Earth/Moon/Mars fields. Specifically, confirm data expectations for Meridiani and target values that the preview layers cannot supply.
5. The full scoring policy: normalization ranges/direction, Moon/Mars weights, rock/mineral similarity matrix, ice/permafrost encoding, missing-data rule/minimum coverage, percentile/tie rules, and internal reference sample/validation method and thresholds—or an explicit decision to defer scores and validation to “Not computed.”
6. Access to the final Figma file or approved desktop/mobile exports so frontend work can be evaluated against the actual design.

P1 can begin with scaffolding and input validation once the canonical register and the permitted source/value set are approved. P2 must remain gated on item 5. P3 can proceed only after the design reference is inspectable and the data contract is stable.

## Human direction received — 14 November 2026

- Treat the master workbook as a provisional candidate register, not an approved source of truth.
- Retain all 12 planned Earth analogs and all four planned planetary targets. Keep missing/conflicting/questionable coordinates as `PENDING_HUMAN_REVIEW`; do not select or invent values.
- Continue P1 tasks that do not depend on coordinates. Pause spatial extraction/calculation for unresolved entries.
- Defer scoring until the complete method is approved. Figma exports/access will be provided for later visual work.
- The resulting register and conflict report are in `data/interim/` and `docs/P1_COORDINATE_CONFLICT_REPORT.md`.
