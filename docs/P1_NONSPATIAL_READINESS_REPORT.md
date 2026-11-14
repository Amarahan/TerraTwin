# P1 Non-spatial Readiness Report

**Status:** non-spatial audit complete. All 12 Earth sites and 4 planetary targets remain in the provisional register; all approved coordinates remain null and `PENDING_HUMAN_REVIEW`. No spatial extraction, site-specific coverage calculation, or similarity scoring was performed.

## Current progress and fastest safe MVP path

- P0 audit and coordinate-safe P1 register/conflict tooling are complete. This report adds HGT file-format inspection, SHA-256 duplicate verification, manifest-path reconciliation, and a feature-to-source inventory.
- The existing React/Vite application should be retained. Replace unsupported measurements, coordinates, rankings, scores, and weight presets with the provisional register, pending/no-data states, NASA source context, and an honest no-score state.
- The workspace is not a Git checkout; there is no Git status/diff to inspect. `starter_app/` has no lockfile or installed `node_modules` at audit start.

## 1. SRTM guide availability and scope

- Requested local guide `docs/references/SRTM_User_Guide_V3.pdf` present: **true**. The supplied PDF was inspected directly on 2026-11-14; format specifications below are in section 2.1.4, pages 10–11 of the Revised October 2015 guide. File presence does not establish provenance for the bundled HGT tiles.
- The guide specifies SRTMGL1 as 3,601 × 3,601 at 1 arc-second and SRTMGL3 as 1,201 × 1,201 at 3 arc-seconds. Both HGT grids contain two-byte signed integer samples. The HGT convention is big-endian, row-major with the northernmost row first, with no embedded header/trailer. Elevation is in metres, referenced to the WGS84/EGM96 geoid (guide wording).
- The guide says `-32768` marks voids for versions 1.0 and 2.1, while version 3.0 has no voids. Because exact input versions are unverified, the scan reports the sentinel count but does not classify or replace samples.

## 2. HGT file-level results

| File | Bytes | SHA-256 | SRTMGL1 layout match | SRTMGL3 layout match | Big-endian interpreted range (m) | `-32768` samples | Product/version/provenance |
|---|---:|---|---|---|---:|---:|---|
| `data/earth/N36W117.hgt` | 25,934,402 | `39e78219fff01f273e143c25511a2f1cfbfdf9632aec581fa00d571fba48028f` | True | False | -130 to 2170 | 0 | **UNVERIFIED**; UNVERIFIED: HGT file is not listed in the supplied local-file manifests; nearby browse-image records do not establish this file's lineage. |
| `data/earth/S24W070.hgt` | 25,934,402 | `4b87e2416670a507f7fe92eff71824a86b3e9310ba94191b6914071cda602e0a` | True | False | 618 to 3389 | 0 | **UNVERIFIED**; UNVERIFIED: HGT file is not listed in the supplied local-file manifests; nearby browse-image records do not establish this file's lineage. |

Both files match the SRTMGL1 byte-count layout of 25,934,402 bytes; neither matches the SRTMGL3 byte count of 2,884,802 bytes. This is a format-size consistency result only. It does not establish exact product ID/version, origin, checksum from the source archive, vertical datum realization, void-fill lineage, or actual endian semantics. The byte scan is read-only; originals were not modified.

## 3. SHA-256 duplicates and file integrity

The source inventory hashes all 57 supplied data files. Exact duplicate-content groups: **2**.

| SHA-256 | Exact duplicate paths |
|---|---|
| `7ff5aea6018ea8e4184e12c84ad456c05033dc01d3794b8c07eac1026aa1d190` | `data/moon/moon_trek_api.html`<br>`data/mars/mars_trek_api.html` |
| `038b6ab9e3fc3ffded6c18e69a3fdba2b792708b5efc7a1b4b4f5500cf4a173a` | `data/moon/trekApi_moon.js`<br>`data/mars/trekApi_mars.js` |

Inventory classification: catalog_or_documentation: 23; manifest_or_register_candidate: 4; quantitative_raster_candidate: 2; rendered_image_or_browse_preview: 26; research_workbook_candidate: 2.

## 4. Manifest path reconciliation

Original manifests were read only and remain unchanged. Detailed row-by-row expected/actual paths and source URLs are in [the separate mismatch report](P1_MANIFEST_PATH_MISMATCH_REPORT.md).

| Match status | Rows |
|---|---:|
| `UNIQUE_BASENAME_PATH_MISMATCH` | 23 |

HGT files absent from the manifests' `local_file` records: `data/earth/N36W117.hgt`, `data/earth/S24W070.hgt`. Their download provenance remains unverified.

## 5. Scientific feature-to-source inventory

The table transcribes candidate mappings and status notes from the research workbook's `Plan match` sheet. It does not approve a scientific definition, dataset, feature value, or coverage claim. Supplied preview assets do not count as quantitative source data.

| Feature | World | Workbook source candidate | Workbook status / resolution | Candidate method and limitations |
|---|---|---|---|---|
| Slope | Earth | Copernicus DEM GLO-30 | Verified - changed; 30 m; global | Resample to 200 m; ee.Terrain.slope Reproject the tile collection before slope. AW3D30 (#27) is a JAXA cross-check. |
| Roughness | Earth | Copernicus DEM GLO-30 | Verified - changed; 30 m; global | Elevation std dev in 1 km window |
| Temperature range | Earth | MODIS Terra LST, 8-day (MOD11A2 V6.1) | Verified; 1 km | Mean day LST minus mean night LST, 2020-2024; x 0.02 1 km pixels, coarser than slope. |
| Dryness | Earth | ERA5-Land Monthly Aggregated | Partly verified; About 0.1 degree (about 11 km) | Annual sum of total_precipitation_sum x 1000 mm About 11 km pixels; nearby Myanmar sites may tie. CHIRPS (#26, about 5.6 km) separates sites better; IMERG (#5) is the NASA alternative: use V07. |
| Vegetation | Earth | MODIS Terra NDVI, 16-day (MOD13A2 V6.1) | Verified; 1 km | Mean NDVI 2020-2024 x 0.0001 |
| Rock and mineral | Earth | Published geology papers, Macrostrat maps | Not yet verified; n/a | One hand-entered category per site, cited Try Macrostrat (#28) and GVP (#29) for volcanic sites; both partly verified. ASTER GED (#9) is an optional lower-confidence index. |
| Water ice / permafrost | Earth | Published geology papers, Macrostrat maps | Not yet verified; n/a | One hand-entered category per site, cited Not yet verified. |
| Dust and wind | Earth | MODIS MAIAC aerosol optical depth (MCD19A2 V6.1) | Verified; 1 km, daily | Mean Optical_Depth_055 x 0.001 Aerosol over land is not the same quantity as Mars dust optical depth; say so on the About page. |
| Slope | Moon | LOLA south pole DTMs and derived slope / roughness maps | Verified - changed; 5 m (87-90S), 10 m (85S-pole), 20 m (80S-pole) | Clip about 20 km, resample to 200 m Malapert needs 10 m or 20 m product. |
| Roughness | Moon | LOLA south pole DTMs and derived slope / roughness maps | Verified - changed; 5 m (87-90S), 10 m (85S-pole), 20 m (80S-pole) | Same method as Earth (or use LDRM roughness maps) Define roughness the same way on all three worlds. |
| Temperature range | Moon | Diviner polar products (GDR L2 and Polar Resource Product) | Verified; South polar GDR 240 m/pixel; PRP covers 80S to pole | Published day and night extremes Use GDR_L2 day/night maps or PRP annual max. |
| Dryness | Moon | No dataset | n/a; n/a | Plan rule: Moon scores fully dry Set by rule. |
| Vegetation | Moon | No dataset | n/a; n/a | Plan rule: bare ground Set by rule. |
| Rock and mineral | Moon | Unified Geologic Map of the Moon | Not yet verified; n/a | Highland anorthosite for both targets Not yet verified. |
| Water ice / permafrost | Moon | Diviner polar products (GDR L2 and Polar Resource Product) | Verified; South polar GDR 240 m/pixel; PRP covers 80S to pole | 0-1 estimate per site, cited Diviner PRP gives modelled depth to ice; also cite LCROSS/LEND/LAMP (#15, not yet verified). |
| Dust and wind | Moon | No dataset | n/a; n/a | No Moon dust source in the plan GAP IN PLAN: LADEE LDEX (#30) gives orbital context only. Show no data or cite a qualitative value. |
| Slope | Mars | MOLA-HRSC blended DEM, 200 m (v2) | Verified; 200 m; global | Clip about 20 km, same method as Earth Check blend artifacts near targets. |
| Roughness | Mars | MOLA-HRSC blended DEM, 200 m (v2) | Verified; 200 m; global | Same method as Earth |
| Temperature range | Mars | Mars Climate Database (v6.1) | Verified; Model grid | Daily surface temperature range at each site Modelled, not measured. |
| Dryness | Mars | No dataset | n/a; n/a | Plan rule: Mars scores fully dry Set by rule. |
| Vegetation | Mars | No dataset | n/a; n/a | Plan rule: bare ground Set by rule. |
| Rock and mineral | Mars | CRISM mineral maps; Geologic Map of Mars SIM 3292 | Not yet verified; Not checked | Jezero clay + carbonate; Meridiani sulfate Not yet verified. |
| Water ice / permafrost | Mars | SWIM ice-consistency maps (also Odyssey neutron data) | Partly verified; About 3 km/pixel; 60S-60N | 0-1 estimate; low near equator SWIM is a consistency score, 60S-60N. |
| Dust and wind | Mars | Mars Climate Database (v6.1) | Verified; Model grid | Dust optical depth at each site Record which dust scenario you pick. |

### What is actually bundled

- **Quantitative candidate:** two raw-looking SRTM HGT files, but source version/provenance is unverified; no spatial use is authorized until coordinates/geometry and source details are approved.
- **Visual-only:** SRTM/ASTER browse JPEGs, selected regional images, Moon LOLA/LROC colorized slope/hillshade previews, and Mars Trek/WMTS PNG/JPEG tiles. Do not sample colors as measurements.
- **Metadata/reference:** NASA Trek layer catalogs, WMTS capabilities, product pages, and workbook dataset records. They identify possible sources but do not supply analysis rasters.
- The workbook's `Site data` sheet cites `mee_lay_earth_features.csv`, which is absent. Its feature values therefore cannot be reproduced from the supplied bundle. The workbook itself reports zero dataset test values in its verification summary.

### Missing information and policy conflicts

- The workbook's Site data sheet cites mee_lay_earth_features.csv, but that file is not present in the supplied bundle.
- No approved eight-feature source/configuration file exists; workbook mappings and derivation notes remain candidates.
- Only two quantitative-raster candidates are supplied (the HGT tiles); exact product version/source provenance is unverified and site extraction is coordinate-gated.
- Moon/Mars raster-like images are rendered previews or WMTS tiles, not calibrated numeric source rasters.
- No browser-ready validated scientific measurements or reference sample are present.
- The workbook's candidate plan includes non-NASA datasets/providers such as Copernicus/ESA, ERA5-Land/ECMWF, CHIRPS/UCSB, and Mars Climate Database consortium products. AGENTS.md requires human approval before adding non-NASA datasets.
- Workbook-proposed rule encodings for lunar/Martian dryness or vegetation and candidate ice classes are not treated as values or scoring rules without explicit approval.
- All 12 Earth sites and 4 targets remain in the provisional register; coordinate status is PENDING_HUMAN_REVIEW and approved coordinates are null.
- No site-specific data coverage can be inferred here. Candidate datasets' global extent or latitude range is not a substitute for approved site geometry, pixel QA, temporal filters, or a reproducible extraction.
- The workbook proposes NASA and non-NASA sources. `AGENTS.md` says not to add non-NASA datasets unless the team confirms the challenge permits them and approves the change. Keep non-NASA candidates out of production inputs pending that approval.

## 6. Recommended next technical steps

1. Human team approves canonical coordinates and representative geometries, with coordinate-specific citations, for entries to be spatially processed. Preserve the other entries as pending.
2. Team confirms NASA-only competition interpretation and approves the exact source list; choose NASA alternatives where available. Resolve the HGT tile download manifest/version/provenance without replacing originals.
3. Team freezes feature definitions, normalization, weights, category matrices, missing-data policy, and reference checks before any score implementation.
4. With scope and approved points, implement reproducible extractions from quantitative rasters/catalog products; do not sample preview images. Record native/analysis resolution, dates, scale, QA, unit and provenance.
5. For the MVP meanwhile, connect the existing frontend to the 12+4 provisional display register, hide map markers for pending coordinates, show all feature values as `No data`/`Pending review`, and label score and validation status `Not computed`.

## 7. Verification commands

```powershell
python data/scripts/nonspatial_readiness.py
python -m unittest discover -s data/tests -v
```

No spatial extraction, coordinate selection, scoring, or scientific-value generation is performed by these commands.
