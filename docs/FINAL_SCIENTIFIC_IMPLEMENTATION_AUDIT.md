# TerraTwin — Final Scientific Implementation Audit

**Audit date:** 2026-11-14  
**Scope:** inspection only, as requested by the supplied brief. No application, pipeline, scientific input, manifest, or generated scientific data was edited. This report is the only new artifact.

## Executive finding

The current product is a tested **pending-data interface**, not a platform that processes and compares site-specific Earth, Moon, and Mars measurements. P0 and coordinate-safe P1 audits are evidenced. The app consumes a generated display-only JSON export, not outputs of scientific raster extraction. There is no active scientific scoring implementation, no reference sample, and no validated result in the browser.

The eight feature concepts, 12 Earth site candidates (4 Featured, 5 Benchmark, 3 Control), and four targets are present in the provisional register. All 16 coordinates, 128 feature records, and 16 scores are null. No site extraction or score calculation should be claimed.

## 1. Source-of-truth files

Present and reviewed: `AGENTS.md`, `docs/TerraTwin_Final_Development_Plan.md`, `docs/DATA_PIPELINE_CONTRACT.md`, `docs/PROJECT_PROGRESS.md`, `docs/P0_AUDIT_REPORT.md`, `docs/P1_COORDINATE_CONFLICT_REPORT.md`, `docs/P1_NONSPATIAL_READINESS_REPORT.md`, `README.md`, and all ordered prompts in `prompts/`.

Not present: `TerraTwin_Development_Plan_v2.md`, `docs/FINAL_MVP_QA_REPORT.md`. The current final plan and QA/progress reports are the available equivalents. `design/FIGMA_REFERENCE.md` says the handoff does not include the editable final Figma; the external link could not be inspected using available tools.

Architecture: existing React + Vite + TypeScript + Leaflet app in `starter_app/`; Python audits in `data/scripts/`; supplied data and manifests under `data/`; generated display JSON in `starter_app/public/data/atlas.json`. No separate API/server is present or required by the plan.

## 2. Dataset inventory and integrity

The machine-readable file inventory is `data/interim/source_asset_inventory.json`. It enumerates **57 bundled assets** with path, byte length, SHA-256, asset type, permitted audit use, and available source references. This is the per-file checksum/source index; many catalog and preview items do not provide product resolution, temporal range, CRS, or NoData semantics, so those fields are not asserted where absent.

| Inventory class | Files | Scientific interpretation |
|---|---:|---|
| Rendered image / browse preview | 26 | Visual context only; not quantitative raster inputs |
| Catalog / documentation | 23 | Source/product context; not measurements |
| Quantitative raster candidate | 2 | `data/earth/N36W117.hgt`, `data/earth/S24W070.hgt`; raw-looking HGT tiles, provenance/version unverified |
| Manifest / register candidate | 4 | Candidate IDs, coordinates, source rows; not a human-approved canonical register |
| Research workbook candidate | 2 | Research notes/source candidates; not validated site measurements |

Bundle subfolder counts from that inventory: Earth 12, Moon 14, Mars 22, manifests 5, raw 4. The broader `data/` tree also contains the interim reports, scripts, tests, and processed README. No GeoTIFF scientific measurement product or reference sample was identified in the supplied inventory. Original inputs remain preserved.

Exact duplicate-content findings (SHA-256):

- `7ff5aea6018ea8e4184e12c84ad456c05033dc01d3794b8c07eac1026aa1d190`: `data/moon/moon_trek_api.html`, `data/mars/mars_trek_api.html`.
- `038b6ab9e3fc3ffded6c18e69a3fdba2b792708b5efc7a1b4b4f5500cf4a173a`: `data/moon/trekApi_moon.js`, `data/mars/trekApi_mars.js`.

The two HGT files each have 25,934,402 bytes and match the expected SRTMGL1 byte-count layout (3601 × 3601 × 2), not SRTMGL3. The supplied 2015 guide was parsed and used for format interpretation. This byte count **does not identify exact product/version or prove download source/provenance**. Both HGT source identities remain `UNVERIFIED`, and the files are absent from manifest local-file records. See `docs/P1_NONSPATIAL_READINESS_REPORT.md` for per-file hashes, interpreted signed big-endian ranges, void sentinel counts, and caveats.

## 3. Processing pipeline and application data flow

Actual implemented data operations:

1. `data/scripts/audit_inputs.py` audits candidate registers, coordinate conflicts, asset inventory and possible coverage without approving conflicts.
2. `data/scripts/nonspatial_readiness.py` checks file integrity/layout, computes hashes and duplicate groups, reconciles manifests, inspects HGT bytes, reads the supplied guide and emits audit reports.
3. `starter_app/scripts/export_pending_data.py` reads the provisional register, final plan feature labels, dataset inventory, and non-spatial gap report; it exports `starter_app/public/data/atlas.json` with all coordinates, measurements, and scores null.
4. `starter_app/src/App.tsx` fetches this JSON; `starter_app/src/data.ts` validates the pending-only schema; React views render site/target selection and missing-data states.

Actual scientific feature extraction is **absent**. No Earth Engine calls, authentication checks, raster sampling, reprojection, terrain derivatives, temporal composites, QA masks, or Moon/Mars numerical extraction were found. No raw/interim/processed scientific observation chain is connected to the app. `data/processed/README.md` does not constitute processed measurements.

## 4. Data status by scientific feature

All eight features have a planning concept, not site/target values. Candidate products and caveats are inventoried in `docs/P1_NONSPATIAL_READINESS_REPORT.md`; candidates are not approved sources or evidence of coverage.

| Feature | Earth source situation | Moon/Mars situation | Current app status |
|---|---|---|---|
| Slope | Two HGT quantitative candidates, provenance unresolved; no approved-site extraction | LOLA/MOLA layer catalogs and rendered previews; no numeric target raster extraction | `MISSING` / pending definition and data |
| Surface roughness | No derived 1 km elevation standard deviation pipeline | Candidate layer metadata/previews only | `MISSING` |
| Temperature range/contrast | No MODIS LST temporal dataset or day/night computation bundled | Diviner catalog/preview; Mars model source candidate only | `MISSING`; exact meaning needs confirmation (diurnal contrast is not seasonal range) |
| Water ice / permafrost | No validated site classification/value and citation | Candidate metadata/references; no extracted/cited target values | `MISSING` |
| Rock and mineral type | Workbook/published source candidates; no approved per-site classification table | Candidate geology/mineral sources; no target values in app | `MISSING` |
| Dryness | Candidate precipitation sources described in workbook, no downloaded time series/extraction | Workbook proposes dry/bare rules; those encodings are not approved values | `MISSING` |
| Vegetation / bareness | No MODIS NDVI observations or temporal computation bundled | Workbook proposes bare-ground rule, not an approved numeric encoding | `MISSING` |
| Dust and wind | No MAIAC AOD temporal input or QA processing bundled | Mars/Moon metadata and previews are not validated feature observations | `MISSING` |

The app feature order comes from the eight-feature contract, but the UI truncates parenthetical label text for compact headings. No quantitative feature value is displayed.

## 5. Scientific values and hardcoding audit

Runtime source scan found:

- **Measurements/scores/coordinates:** none in app source as populated data. Runtime type/schema enforces null coordinates, null score, and null measurement fields in this pending release.
- **Generated JSON:** `starter_app/public/data/atlas.json` is populated with provisional names/categories, source-candidate descriptions/URLs, feature concepts, and explicit null scientific records. It is generated, not raw scientific data.
- **Scoring function:** no TypeScript or Python scoring calculation exists. No output score/rank/percentile is present. Old CSS classes for ranking/score layouts remain unused presentation styles, not active scoring.
- **Map locations:** no application coordinate source; `WorldMap.tsx` draws a reference graticule using fixed latitude/longitude grid lines. It adds no site markers, raster overlay, or map synchronization to geographic positions.
- **UI constants:** general explanatory copy, category labels, navigation names, and styles are hardcoded interface content. They are not measured scientific results. Source and feature records are loaded from generated JSON.
- **Visible scientific number classifications:** none. The interface displays no numeric measurements, similarity scores, rankings, percentiles, confidence values, or geographic coordinates. Therefore there are no visible scientific numbers to classify as real, derived, cited, or sample.

## 6. Scope and target data

The final plan's eight concepts are all represented, though the order differs from the pasted audit brief (the final plan places Dryness and Vegetation before Rock/Ice). Do not change either order/definition without reconciling the plan. The planned register composition is preserved: 12 Earth records, 4/5/3 categories, and four targets (Shackleton Crater Rim, Malapert Massif, Jezero Crater, Meridiani Planum). This is a provisional register, not approved geography.

All location coordinates remain null and `PENDING_HUMAN_REVIEW`; the coordinate conflict report contains decisions and source references required per entry. Spatial extraction/markers for unresolved locations remain blocked.

## 7. Scoring policy audit

No score engine is implemented; there is no Python/TypeScript parity or shared scoring fixture. The newly supplied audit brief states the proposed numeric formula `similarity = 1 - abs(earth - target)`, weighted score `100 × Σ(weight × similarity)`, category similarities 1.0/0.5/0.0, bands Strong ≥0.75, Partial ≥0.40, Weak <0.40, and Moon/Mars weight vectors. Arithmetic check: Moon weights sum to 1.00; Mars weights sum to 1.00 within floating-point tolerance.

The project plan requires approved normalization before applying continuous similarity; raw values cannot be inserted directly into this formula. Missing weighted input handling remains explicitly ambiguous. The earlier team response deferred scoring, while the new brief labels the method “approved”; **no implementation was performed in this inspect-only phase**. Before incomplete-data scores, the team must state whether any null suppresses the composite, set a minimum coverage rule and define the denominator/coverage display. Do not impute null as zero or renormalize weights silently. Also confirm the category matrix's meaning and which categories are related; the pasted 1.0/0.5/0.0 shorthand does not provide the actual rock/mineral category-pair table.

## 8. Reference validation

No approximately 500-point land reference dataset, generation script, fixed seed, land mask, feature extraction, normalized reference values, reference scores, or percentile outputs were found. Ocean exclusion/polar land inclusion and the same-pipeline guarantee are therefore unimplemented. Criteria (best benchmark ≥90th percentile; median control ≤25th percentile; median benchmark > median control) are not evaluated. Status: `MISSING` / `NOT_COMPUTED`, not Pass or Fail.

## 9. Provider-policy conflict

`AGENTS.md` requires NASA-only data unless the human team confirms competition rules permit non-NASA datasets and approves the change. The development/workbook candidate inventory contains a mix of NASA mission/archive candidates and non-NASA sources (including ESA/Copernicus, ECMWF/ERA5-Land, UCSB/CHIRPS, and published research). This conflict is unresolved. No unapproved source was newly ingested in this audit.

| Provider class | Bundled/source state | Permitted audit conclusion |
|---|---|---|
| NASA agency archives / mission products | NASA Trek catalogs, LOLA/LROC/Diviner/MOLA/TES layer metadata and rendered previews; selected NASA browse products | Product discovery/reference only unless a quantitative product, identity, band, QA, units and provenance are verified |
| USGS | Candidate source references in workbook/manifests | Not approved for ingestion under current NASA-only instruction without team confirmation |
| ESA / Copernicus | Workbook source candidates; no complete analysis inputs in the audited bundle | Not approved for ingestion under current policy |
| Other agencies / research | Workbook references include ECMWF, UCSB/CHIRPS, Mars Climate Database and published geology | Candidate evidence only; provider eligibility and value citation require approval |

See `data/interim/source_asset_inventory.json`, manifests, and the P1 source inventory for exact per-file references. A recorded URL is not proof the resource was downloaded or processed.

## 10. Existing test evidence

Latest available technical check from the prior stabilization run: Python 12/12, frontend integrity 5/5, TypeScript pass, production build pass, browser pending-state smoke 12/12. These tests validate register integrity, null-data behavior, file audit, and UI interactions. They do **not** validate a scientific extraction/scoring pipeline because none exists.

## 11. Required approvals and exact implementation priorities

1. Resolve coordinate conflicts and representative geometries site by site. Keep all other register rows pending.
2. Confirm NASA-only eligibility versus the non-NASA providers in the workbook; approve exact products, versions, citations, bands, temporal ranges, units, native/analysis scales and QA masks.
3. Confirm canonical feature order/definitions. Resolve temperature “range” versus day/night contrast, dryness and vegetation encoding for planetary targets, rock/mineral category mapping, and ice/permafrost value semantics.
4. Confirm that the supplied formula/weights/category similarity/strength bands supersede the earlier “defer scoring” instruction; define null/minimum-coverage and actual related-category matrix.
5. Only then implement real source acquisition and reproducible Earth/Moon/Mars processing into raw → interim → processed, with manifests and schema validation; do not treat image previews as data.
6. Implement equivalent tested Python and TypeScript scoring with shared fixtures, boundary and invalid-weight cases, null behavior, and a hand-calculated example.
7. Generate the reference set with fixed seed, valid land mask and identical extraction/normalization/scoring; report all three benchmark/control criteria honestly.
8. Integrate the validated outputs into browser-ready JSON, then complete Figma comparison, scientific QA, mobile/browser QA, and deployment only after team approval.

## 12. Machine-readable audit references

- Per-file inventory, source references and SHA-256: `data/interim/source_asset_inventory.json`.
- Duplicate groups and manifest reconciliation: `data/interim/nonspatial_readiness.json`, `data/interim/manifest_path_reconciliation.json`, `docs/P1_MANIFEST_PATH_MISMATCH_REPORT.md`.
- HGT analysis and feature/source candidate table: `docs/P1_NONSPATIAL_READINESS_REPORT.md`.
- Provisional register/conflicts: `data/interim/provisional_site_target_register.json`, `docs/P1_COORDINATE_CONFLICT_REPORT.md`.
- Display-only browser records: `starter_app/public/data/atlas.json`.
- Pending data export and validation: `starter_app/scripts/export_pending_data.py`, `starter_app/src/data.ts`.
