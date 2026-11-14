# TerraTwin existing project data assessment

**Assessment date:** 2026-11-14  
**Actual project data folder:** `C:\Users\Asus\Downloads\Telegram Desktop\TerraTwin_Team_Handoff_Codex_Antigravity\TerraTwin_Team_Handoff\data`  
**Scope:** inspect the actual directory recursively and plan use of supplied data. No original data was changed. No dataset was downloaded, extracted, scored, or published by this assessment.

## Summary

I recursively inspected **75 files** under the actual project `data/` directory. The prior `source_asset_inventory.json` describes 57 bundled source assets, but is not a complete inventory of the current directory: it omits interim reports, processing scripts and tests, their Python bytecode caches, and directory READMEs. The full file list is in [Recursive file inventory](#recursive-file-inventory).

The project includes two HGT elevation candidates, candidate Earth observation values embedded in a workbook, extensive NASA Moon/Mars layer catalogs and service metadata, and many rendered browse/preview images. The two workbooks are substantive data sources that need to be treated explicitly: the master workbook contains numeric Earth-site feature rows and qualitative Earth/Moon/Mars geology and ice notes. However, those rows cite a missing Earth Engine CSV, the workbook's own dataset verification summary reports zero test values obtained, spatial coordinates are unresolved, and several values/encodings are flagged as assumptions or checks. They are **candidate/unverified**, not validated measurements suitable for public scores.

No complete validated eight-feature dataset exists for the 12 Earth sites and four targets. There is no raw MODIS, precipitation, MAIAC, LOLA, Diviner, MOLA/HRSC, CRISM, or Mars climate-model analysis raster/table in the data folder. Previews and metadata cannot replace those quantitative inputs. No spatial extraction or scoring was run.

## 1. What is present in the actual directory

The recursive scan counted 75 files: 12 in `earth/`, 14 in `moon/`, 22 in `mars/`, 6 in `interim/`, 5 in `manifests/`, 4 in `raw/`, 4 in `scripts/`, 4 in `tests/`, two at the data root, one in `input/`, and one in `processed/`.

Formats found: 14 PNG, 12 JPG, 10 JSON, 9 HTML, 7 XML, 4 CSV, 4 Python source, 4 Python bytecode cache, 3 Markdown, 2 TXT, 2 HGT, 2 XLSX, and 2 JavaScript. No GeoTIFF/TIFF, NetCDF, GeoJSON, shapefile, ZIP archive, or other georeferenced scientific raster container was found. `data/input/` and `data/processed/` contain README files only; there is no `data/reference/` or `data/output/` directory. Interim JSON reports are audit/register artifacts, not measurement outputs.

The 57 source-asset hashes in `data/interim/source_asset_inventory.json` were independently matched to the actual files during the earlier P1 integrity work. This assessment separately enumerated the full 75-file tree and inspected formats/content for files the source-asset list omits. The 18 additional entries are interim reports, code/tests and bytecode, requirements, and READMEs; they are not new scientific datasets.

## 2. Direct inspection of the two workbooks

### `data/raw/mee_lay_master_project_data(1).xlsx`

The workbook is an 18-sheet Excel workbook (70,198 bytes; SHA-256 `806a1628a81d1f8f99c1a55fd054e7e8e903d78ffec7c0c0e9680875b755a6`). It was read from its XLSX/XML contents in read-only fashion. Sheets include Overview, Site master, Datasets, Plan match, Site data, Rock & minerals, Ice & permafrost, Moon & Mars numbers, Coordinate check, Requirements, Data issues, Fixes to plan, Do we need more, Next steps, Still missing, Plan schedule, Dataset summary, and Missing summary.

The `Site data` sheet contains 12 Earth rows with candidate coordinates and numeric columns for slope (degrees), roughness (metres), elevation (metres), LST day/night (K), day-minus-night contrast (K), NDVI, AOD at 0.55 µm, ERA5-Land rainfall (mm), and CHIRPS rainfall (mm). NDVI is blank for McMurdo; CHIRPS is blank for Haughton, McMurdo, and Death Valley. Excel formulas compute rainfall differences/check flags and featured-site comparisons. The sheet title says values came from `mee_lay_earth_features.csv` and an Earth Engine run (2020–2024), but that CSV is absent from the actual tree. There is no matching Earth Engine script, extraction log, source-image export, pixel QA record, or per-row product/band/processing provenance bundled with these rows.

The workbook itself flags material limitations: the Twin Taung coordinate is about 41 km from the cited volcanic-field point; the featured Myanmar points are close together relative to the stated coarse windows; polar day/night contrast is not a seasonal temperature range; AOD is an aerosol measure, not a dust measurement; the CHIRPS rainfall comparison has anomalies; and forest DEM values include canopy. Its `Datasets` sheet has 30 candidates and explicitly summarizes **0 test values obtained** for those dataset-verification entries. Therefore the spreadsheet numbers are `HARDCODED_UNVERIFIED` candidate outputs for the purpose of this application audit. They may guide source recovery and QA, but must not be presented as validated or used for scores until their source export and method are reproduced and reviewed.

`Site master` also carries coordinates and summary values, including zero rainfall/NDVI entries for lunar and Mars records from a stated “fully dry/bare” planning rule. These are proposed encodings, not observations, and must not be treated as measured target data. The workbook's proposed ice class-to-number mapping is also explicitly identified as a proposal.

### `data/raw/mee_lay_complete_analog_data_expanded.xlsx`

This workbook is 10,805 bytes, with sheets `Moon Targets`, `Mars Targets`, and `Earth Gaps - Rock & Ice`. The first two sheets list ten candidate targets each, broad qualitative/range values, coordinates, and mixed citation labels. The final register still contains only the four agreed targets. Some values cite secondary pages or broad mission names rather than a source-specific product/value; the workbook itself says published values may not match the planned method. These are research notes, not comparable target measurements. The Earth Gaps sheet contains candidate lithology/ice descriptions and coordinate entries for 12 sites, but many references are general or absent. The rows require source validation and per-site evidence before use.

### Register and manifest files

- `data/manifests/site_targets.csv` has only six rows: two Moon targets, one Mars target, and three Earth candidates. It is incomplete relative to the agreed 12 Earth + 4 target register; its coordinates are candidate values, not approved values.
- The generated provisional register in `data/interim/provisional_site_target_register.json` has all 12 Earth sites and four targets. All 16 `approved_coordinates` are null and have pending review statuses. The coordinate conflict report records workbook/CSV candidates and required decisions.
- `dataset_inventory.csv` has 16 source-candidate rows; `core_target_data_manifest.csv` 18 layer rows; `download_manifest.csv` 5 rows. Their `local_file` paths do not consistently match the actual flattened `earth/`, `moon/`, and `mars/` paths. The separate P1 manifest reconciliation should be used to resolve each path; original CSV manifests remain preserved.

## 3. Contents, coverage and scientific meaning by folder

### Earth (`data/earth/`, 12 files)

- `N36W117.hgt` and `S24W070.hgt`: each 25,934,402 bytes; SHA-256 values are listed below. Each matches the SRTMGL1-sized 3601 × 3601, two-byte layout. The supplied SRTM guide describes signed 16-bit big-endian, row-major samples, no header/trailer, elevation in metres referenced to WGS84/EGM96, and version-dependent void semantics. The files contain no embedded CRS/metadata. Their names suggest Death Valley/Atacama one-degree tiles, but filename and size alone do not establish exact product, source, version, or provenance; status remains `UNVERIFIED`. The P1 audit read-only scan found zero `-32768` samples in each interpreted scan but cannot assign a version-specific void interpretation. Suitable as raw elevation candidates only after provenance and approved site geometry are resolved; terrain derivatives would require processing.
- `N36W117.SRTMGL1.2.jpg`, `S24W070.SRTMGL1.2.jpg`, and three `ASTGTMV003_*.jpg` images are browse images (2048² or 1024² greyscale/color image encodings), not numeric elevation rasters.
- Atacama, Death Valley, and Haughton true-color/ASTER DEM JPEGs are 768 × 768 rendered context images. They lack quantitative raster bands/georeferencing metadata in the image files.

### Moon (`data/moon/`, 14 files)

- `moon_trek_polar_layers.json` is a 1.49 MB NASA Trek metadata/facet response with 490 product records. Fields include product label/title, mission/instrument, descriptions, provider, nominal projection, coverage/bounding boxes, display resolution, and thumbnail/service references. It has candidate LOLA, Diviner, and unified lunar geology products, including products relevant to south-polar latitudes. It is a catalog, not the referenced numeric product arrays.
- Four local LOLA PNGs for Shackleton/Malapert are 120 × 120 RGBA colorized hillshade/slope thumbnails; the 120 × 120 `malapert_lroc_dem_slope.png` is a rendered LROC preview. They support visual context only, not calculation of slope values.
- `shackleton_lola_slope_wmts_capabilities.xml` and `shackleton_lola_slope_service.json` describe a NASA Trek image-tile service. The local preview tile is not a raw DEM. The WMTS advertises image/png and Moon/IAU projection identifiers; the PNG previews do not themselves encode quantitative elevations.
- `lro_nac_south_pole_metadata.html`, `lola_kaguya_hillshade_metadata.html`, `lro_instruments.html`, `moon_trek.html`, and the Trek API HTML/JS files are metadata/documentation/client references, not measurements. The two Trek JS files are byte-identical across Moon and Mars.

### Mars (`data/mars/`, 22 files)

- `mars_trek_eq_layers.json` is a 336,642-byte NASA Trek catalog with 146 layer records. It includes names/descriptions for MOLA, MOLA/HRSC blended hillshade, roughness, TES dust, HiRISE and CTX layers; metadata carries product labels, coverage, projection, resolution and thumbnail/service references. Catalog records do not contain the target-window numeric arrays needed by the pipeline.
- Seven local Jezero PNG/JPG global and regional files are 120 × 120 preview images or 256 × 256 image tiles. Files labelled MOLA roughness and TES dust remain rendered color/display layers; they are not raw calibrated numeric rasters and must not be sampled for feature values.
- Six WMTS capability XMLs describe image/png or image/jpeg services and tile matrices. The catalog advertises Mars `EPSG::104905`/planetary coordinate references; service metadata is useful to reconstruct a display map, but these image services do not provide verified feature statistics in this bundle.
- `mola_global_tile.jpg`, Trek HTML/JS/config, and capabilities are visual or API metadata. No local MOLA-HRSC DEM, TES calibrated numeric array, CRISM mineral raster, SWIM table, or Mars climate-model output was found.

### Raw, interim, processed, input, manifests and scripts

- `raw/` contains the two XLSX workbooks and saved NASA challenge/resources HTML pages. Those pages are source discovery/context, not processed observations.
- `interim/` contains six JSON QA artifacts: coordinate conflicts, data availability, manifest path reconciliation, non-spatial readiness, provisional register, and source asset hashes. They do not contain spatially extracted site values.
- `processed/README.md` explicitly says no spatially processed scientific data is available. `input/README.md` says the directory is reserved for human-approved inputs; it has no approved register file.
- `scripts/audit_inputs.py` and `scripts/nonspatial_readiness.py` implement register/provenance/file-readiness audits. They do not run Earth Engine or derive the eight feature values. `tests/` contains their audit tests; `__pycache__` entries are Python bytecode, not data.
- There is no `reference/` or `output/` subtree. No 500-point sample, processed tiles, or site/target observation table exists in `data/`.

## 4. Feature-to-file assessment

Statuses refer to current availability for scientific processing, not whether a filename/catalog mentions that feature.

| Feature | Existing files and what they actually contain | Immediate support/status | Minimum remaining data or decision |
|---|---|---|---|
| Slope | Earth: two HGT elevation candidates and unquantitative JPEG browse images; Earth workbook has 12 unverified candidate slope numbers. Moon: LOLA catalog, colorized slope previews and service metadata. Mars: MOLA/HRSC and Jezero slope/terrain previews/catalog metadata. | `HARDCODED_UNVERIFIED` workbook candidates; `UNVERIFIED` HGT inputs; lunar/Martian previews cannot be measured. No approved site extraction. | Approve coordinates/geometry; resolve HGT provenance and verify full numeric elevation coverage. Numeric LOLA DTM and MOLA/HRSC DEM inputs/products for the relevant regions; common slope method and documented scale. |
| Surface roughness | Earth workbook candidate `roughness_m` values; same HGT could provide elevation for a documented window if provenance/site geometry pass. Moon and Mars catalogs/previews mention roughness; local images are rendered. | No reproducible roughness calculation is present. Workbook values are unverified. | Same approved DEM inputs plus the agreed roughness definition/window and per-pixel QA. Retrieve numeric lunar roughness/DTM and Mars DEM/roughness data. |
| Temperature range / contrast | Workbook stores candidate LST day/night and day-minus-night values for Earth; cited source CSV is missing. Diviner/Mars products appear in catalogs and broad contextual ranges appear in the expanded workbook. | No processing is reproducible from the bundle. Metric is ambiguous: diurnal day–night contrast is not seasonal range; polar rows expose a comparability problem. | Approve a common scientific definition; obtain numeric Earth MODIS LST and target Diviner/Mars temperature inputs with temporal coverage/QA and compatible aggregations. |
| Dryness | Workbook includes candidate ERA5-Land and CHIRPS rainfall columns; absent source CSV and non-NASA sources conflict with current NASA-only rule. | Candidate numbers only. Do not use Moon/Mars zero rainfall fillers as measurements. | Approve an Earth dryness definition/provider; for NASA-only, obtain a suitable NASA precipitation product (candidate in workbook: GPM IMERG V07) and document resolution/period. Define planetary handling without equating a rule to an observation. |
| Vegetation / bareness | Workbook has 11 candidate NDVI rows and a missing McMurdo value; MODIS source product is described but not bundled. | Candidate outputs are unverified; no raw NDVI observations. Moon/Mars zero values in Site master are proposed bare-ground rules. | Obtain NASA MODIS NDVI values and QA/missing policy; approve whether non-vegetated planetary surfaces are encoded as a comparable value or left missing. |
| Rock and mineral type | Workbooks include 12 Earth qualitative entries (some “not searched”/general claims) and qualitative target text/citation labels. Trek catalogs include Moon geology metadata; Mars catalog/source notes identify possible CRISM/map products but no calibrated rasters. | Source discovery and candidate citations only; no completed, uniformly sourced category table or approved category matrix. | Validate a site-specific citation per Earth/target; obtain applicable Moon geologic units and Mars CRISM/geology data; approve taxonomy and similarity mapping. Provider conflict applies to USGS/Macrostrat/other references. |
| Water ice / permafrost | Workbooks include candidate narrative classes; one sheet proposes `None=0`, `Low=.25`, `Possible=.5`, `Confirmed=1` and explicitly labels it a proposal. Moon Diviner/LEND/LAMP metadata and Mars SWIM citations occur in source catalogs/plans, not local value tables. | No approved/validated class or numeric target/site values. Do not publish proposed encodings. | Approve source-backed class/metric; obtain cited Earth permafrost/ice evidence and numeric lunar Diviner PRP / Mars SWIM or an approved alternative. Define meaning/uncertainty. |
| Dust and wind / aerosol proxy | Earth workbook has AOD 0.55 candidate values; NASA MAIAC metadata/source candidates but no actual observations. Mars has TES dust image previews and service metadata; Moon LADEE description is orbital dust context without a site map. | No validated dust/wind measurement. Earth AOD is aerosol optical depth, not a direct dust or wind measurement; previews are not numerical. | Define whether the feature is AOD, dust optical depth, or wind/aerosol combination. Obtain compatible NASA numeric datasets for worlds where available; permit an explicit missing state where no comparable Moon site value exists. |

**Can all eight features be calculated for the complete 12-site/4-target register using only the files currently present? No.** No feature has a fully traceable, reproducible, complete cross-world measurement set in this folder. Some workbook columns are numeric candidates, and two HGT files could conditionally support terrain processing in their nominal footprints, but unresolved coordinates, data lineage, absent source inputs, QA/method details, and source-policy decisions block claiming usable feature values. No scores can be produced from these files as they stand.

## 5. Geographic coverage and coordinate system evidence

- The provisional register contains 12 Earth sites and four targets. All 16 approved coordinate fields are null and `PENDING_HUMAN_REVIEW`; workbook/CSV coordinate candidates remain in the conflict report.
- Earth HGT has a standard 1° SRTM-style grid-size match and filename tile designators, but no embedded CRS/transform/provenance. Treat nominal tile locations as candidate coverage only until source lineage is established.
- Earth browse JPEGs have no georeferenced raster metadata. Their manifest URLs describe tile locations, but the images themselves are not geospatial rasters.
- Moon catalog records carry `trekProjection` identifiers (including IAU lunar polar CRS identifiers), coverage/bbox fields and service references; WMTS capability files advertise tile projection/format. The local PNGs are thumbnails.
- Mars catalog/WMTS metadata carries planetary projection identifiers (including `EPSG::104905`), tile matrices, service layer labels, and candidate resolution. Local PNG/JPG preview tiles do not preserve numeric raster bands or a complete geotransform suitable for scientific analysis.
- No local CRS/geotransform is available for the preview images; nominal display coverage in a catalog is not site-level measurement coverage.

## 6. Provenance, units and time coverage

The manifest and workbook record many proposed products, bands, units, nominal resolutions and periods, but these describe intended sources rather than the provenance of a local measurement. In particular, the master workbook's 2020–2024 Earth Engine claim lacks its cited CSV export, script, collection IDs per exported row, geometry/buffer, projection, scale, mask, scale-factor application record, run timestamp, and raw result checksum. Its numerical cells therefore do not meet the data pipeline contract's provenance requirements.

SRTM guide details are recorded in `docs/P1_NONSPATIAL_READINESS_REPORT.md`. HGT sample units/vertical datum are guide specifications for the named family, not proof of these two file origins. `-32768` was not present in the interpreted scans; exact product version and void-fill lineage remain unverified.

NASA Trek layer catalogs and WMTS files provide product/service metadata but do not prove the downloaded preview image's complete lineage unless the individual file is matched to a precise product URL/hash. A source URL in a manifest is a citation candidate, not evidence that a local numeric source was fetched or processed.

## 7. Provider-policy conflict

`AGENTS.md` imposes NASA-only source use unless the human team confirms otherwise. The locally saved challenge page `data/raw/challenge_page.html` says the challenge invites open Earth, Moon, and Mars data from NASA **and other space agencies**. This differs from the later project-agent NASA-only restriction and must be resolved by the team according to official challenge rules. The workbook/plan lists NASA mission products and external candidates such as ESA/Copernicus, ECMWF/ERA5-Land, UCSB CHIRPS, JAXA AW3D30, USGS maps, Macrostrat, Smithsonian GVP, and Mars Climate Database partners. No new external source was added. Before ingestion, the team must confirm which provider classes are acceptable; use NASA candidates only where their science and spatial/temporal suitability are sufficient.

## 8. Duplicate and path findings

The two exact duplicate pairs are documented by SHA-256 in `source_asset_inventory.json`: `moon_trek_api.html` / `mars_trek_api.html`, and `trekApi_moon.js` / `trekApi_mars.js`. These are identical shared API references, not duplicate scientific observations.

Manifest local paths include directories that do not exist in the actual tree (for example `earth/srtm/`, `earth/aster_gdem/`, and `moon/trek_target_layers/`); actual files are under flattened `earth/`, `moon/`, and `mars/` folders. Use `docs/P1_MANIFEST_PATH_MISMATCH_REPORT.md` for row-level reconciliation. Original manifest paths were not rewritten.

## 9. Recommended implementation order

1. Human team resolves canonical coordinates and representative geometry for each location; retain every unresolved entry with null coordinates.
2. Recover the missing `mee_lay_earth_features.csv` and its originating script/log from the team if available. Match its hashes, columns, coordinate provenance, Earth Engine collection/bands, time, geometry/window, scale, QA masks, units and formulas against the workbook. If it cannot be recovered, keep workbook numbers explicitly unverified and rerun only after method/source approvals.
3. Decide source-policy eligibility. Keep unapproved non-NASA candidates out of pipeline inputs. Reconcile manifests without rewriting originals.
4. For approved locations inside the two HGT candidate tiles, validate provenance/coverage and use the raw HGT only for an independently reproducible terrain derivation; preserve raw files and write derived outputs under a new versioned `data/interim/` or `data/processed/` subfolder. This is conditional, not approved/run in this assessment.
5. Acquire only the minimum missing numerical source products after approval. Prefer existing NASA products where they meet the feature definition; do not fetch replacements for previews until exact products/regions are settled.
6. Approve definitions, units, cross-world comparability, temporal windows, missing-data rules and scoring policy before calculations. Keep unsupported features missing, rather than encode them as zero.
7. Build the pipeline with source manifests, immutable raw inputs, separate interim/processed outputs, provenance schemas, QA reports, and test fixtures. Integrate compact outputs into the existing app only after validation and design review.

### Files that can be processed now

- **Immediately, without site science:** parse/validate all four CSV manifests, six interim JSON records, 490 Moon Trek and 146 Mars Trek catalog records, and seven WMTS capability documents; verify file hashes and image dimensions; inspect workbook candidate content and metadata; and rerun the non-spatial HGT format/void scan. These operations audit provenance and availability, not site measurements.
- **Not immediately as approved feature values:** workbook numeric cells, preview PNG/JPG layers, and the two HGT tiles. Workbook values lack their cited source export/reproducible processing record; previews have no quantitative bands; HGT source identity and approved geometry are unresolved. Do not ingest these into production output as validated features yet.
- **Conditional future processing using existing raw files:** derive terrain measures from an HGT tile only for an approved site geometry that is inside that tile and after the tile's source/product lineage is verified. This would cover only the relevant tile area, not all 12 Earth sites, and does not provide cross-world feature inputs or scores.

## 10. Complete recursive file inventory

The following list is from a fresh recursive scan of the actual `data/` directory, including generated QA artifacts and code files omitted from the 57-source-asset inventory. Sizes are bytes. The machine-readable per-source asset list records SHA-256 for the 57 source assets.


| Relative path | Bytes | SHA-256 | Inspected content class |
|---|---:|---|---|
| `earth/ASTGTMV003_N36W117.1.jpg` | 40,831 | `115d4df2f4776b67fe5d0603f87aa3bde9ab748fac34521310951a39c0d74432` | Rendered image/tile; not a quantitative raster |
| `earth/ASTGTMV003_N75W090.1.jpg` | 70,090 | `90e58325b56541e4390d865aead066fc9953fdef3b939632001a85ad1517f2df` | Rendered image/tile; not a quantitative raster |
| `earth/ASTGTMV003_S24W070.1.jpg` | 27,065 | `16fd450bfee7a8ed0986e272d1bb70a64130aea0b5a2de119029775581b19ef1` | Rendered image/tile; not a quantitative raster |
| `earth/atacama_true_color.jpg` | 71,671 | `b47c24938bb702069457d909b7e6ad19869cc9181a6c658085bbe8e0880738c0` | Rendered image/tile; not a quantitative raster |
| `earth/death_valley_aster_dem.jpg` | 125,931 | `571aea717973ebacbd16d14824ce42447fba4312e702fcd8dc22c92f97d1711f` | Rendered image/tile; not a quantitative raster |
| `earth/death_valley_true_color.jpg` | 46,470 | `7be72d924442d60d02c3244eb04ad9c0964c976bf1e15995272a2cbdb3d9443f` | Rendered image/tile; not a quantitative raster |
| `earth/haughton_aster_dem.jpg` | 51,221 | `4626373f1370745469ba6f892fe8c73ca63b9d839697503df83def0d52a05fc6` | Rendered image/tile; not a quantitative raster |
| `earth/haughton_true_color.jpg` | 34,694 | `ca84a97baa7de1c6fcd414e91239ada9d50680370fec9f1105528838e4688de1` | Rendered image/tile; not a quantitative raster |
| `earth/N36W117.hgt` | 25,934,402 | `39e78219fff01f273e143c25511a2f1cfbfdf9632aec581fa00d571fba48028f` | Raw elevation candidate; provenance/version unverified |
| `earth/N36W117.SRTMGL1.2.jpg` | 283,717 | `6ac07ba43807db53bb0875e8d15eaf57205bfba2173802eb0d7a70a745b91a36` | Rendered image/tile; not a quantitative raster |
| `earth/S24W070.hgt` | 25,934,402 | `4b87e2416670a507f7fe92eff71824a86b3e9310ba94191b6914071cda602e0a` | Raw elevation candidate; provenance/version unverified |
| `earth/S24W070.SRTMGL1.2.jpg` | 216,770 | `a1c0d46475b727fc2c4f55d2103173356ae23ea8d2fa91842a475f8cdfea4589` | Rendered image/tile; not a quantitative raster |
| `input/README.md` | 370 | `9697aa0629e0698212ff9006d1e8dcb4d26a3b62dffa990c373057ab8d871fe6` | Project/data documentation |
| `interim/coordinate_conflict_report.json` | 31,895 | `be4a100be61de2c83ba4570ade4161111d3c57d064360b53f2e671bf6a1ad4fe` | Generated audit/register metadata; not measurement output |
| `interim/data_coverage_report.json` | 1,143 | `eeff50a6782780b78e0e0d9dfefec1e4db28987a674c64306e96e7db2fb0c9ff` | Generated audit/register metadata; not measurement output |
| `interim/manifest_path_reconciliation.json` | 13,474 | `58a9b2232de9e2af9bb46073556aece91e6478faadae0771c131e06620420da2` | Generated audit/register metadata; not measurement output |
| `interim/nonspatial_readiness.json` | 29,504 | `dadbc24b5b18e4330896bc76ca8be54012bb2e98b7d416f78a3d6733c8fd8ae9` | Generated audit/register metadata; not measurement output |
| `interim/provisional_site_target_register.json` | 32,354 | `c784c3dcea582ce39f2cd0b3f8f95357b8816b7947d71655417ae2ca9614f35b` | Generated audit/register metadata; not measurement output |
| `interim/source_asset_inventory.json` | 35,290 | `8bf07d79750d900f7b395e78433804058eb9f6a799209b67006e668b7ff51624` | Generated audit/register metadata; not measurement output |
| `manifests/core_target_data_manifest.csv` | 4,409 | `8bda0ef696376d6ce03ce897fa2a4a653e3ebfb1bf3f2beceb00ce50f88efe09` | Manifest/register candidate; source rows require approval |
| `manifests/dataset_inventory.csv` | 3,230 | `2e3a0e8eabb11a4871ccdc8f8987546bc3b4df3fc080925691b6d9db59ea1ad4` | Manifest/register candidate; source rows require approval |
| `manifests/download_manifest.csv` | 1,166 | `2d2c405e68076cd154c44c55a744414db3abec40f25e23c61c5ff94bcce9f7e9` | Manifest/register candidate; source rows require approval |
| `manifests/README.txt` | 3,248 | `36ef5da31029b22b90754386a7e059371e71aa76271e4ed7a9c0f795e61f7a0f` | Project/data documentation |
| `manifests/site_targets.csv` | 608 | `26edbd501676f416ab4f98ef722c97acb17f83222b1c0cc6be6f72c163543141` | Manifest/register candidate; source rows require approval |
| `mars/ctx_global_wmts_capabilities.xml` | 8,057 | `16919bec258e3292e07f4a1b42d9d847accc929a0d93fa6cb0989b2ba50aafcf` | WMTS service metadata |
| `mars/hirise_global_wmts_capabilities.xml` | 9,633 | `f58d4e64a9fed5d91bba6dd8867c75ff0117fdacf87aad6101d0bffcaa0c4804` | WMTS service metadata |
| `mars/jezero_ctx_global_mosaic.png` | 15,869 | `722bfd625444a2f538b10dafb685267466087d650e099cb713015bbf2a1a51ac` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_hirise_global_mosaic.png` | 16,374 | `75eac1f759009999c4364a195aef6b2dcfcc3e6cc10b7d1a3e1d3a54b599cda0` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_mola_hillshade.png` | 38,224 | `caf321f75efaa6a5d429b875719820de09125aad3e8f45f03c0cdb2c397a9566` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_mola_hillshade_z6_r25_c91.jpg` | 77,622 | `01c9150142af2d2c4366fbfd1d27054f2c365f222439126c5467a36d911c6212` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_mola_roughness.png` | 38,099 | `6e9bee58677509cad233995482814a92f4d7b537c26c4f866f4cf07ec06cf246` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_mola_roughness_z1_r0_c2.png` | 168,921 | `ef4e829f6874177d32ebbcaf435f7eeaa8ddcb9f5a5e553db827a77398631ee8` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_tes_dust.png` | 38,761 | `41da428d5d4cc4a4502a43d6167dd09436f5d31592980e1a50e79d858b7ef0c5` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_tes_dust_index.png` | 43,218 | `6132df7bfd6abf4d198dc214c4a7d745ce64b1326a48022e9cc6fac5dce1d15e` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_tes_dust_index_z2_r1_c5.png` | 200,844 | `6616cfd435c66442c036049da4d61364b15a9f18a1de83c8f672ea927ed93681` | Rendered image/tile; not a quantitative raster |
| `mars/jezero_tes_dust_z1_r0_c2.png` | 162,149 | `734269663f594bec81ce8629ab08334a4e8c87d8c577ec575155266fdd14a9bb` | Rendered image/tile; not a quantitative raster |
| `mars/mars_trek.html` | 2,488 | `13635e1d576bcae4d833fe6f7cb9c338ab05743b1ccafcea2e15e4ffb6d56947` | Saved web reference / metadata page |
| `mars/mars_trek_api.html` | 4,312 | `7ff5aea6018ea8e4184e12c84ad456c05033dc01d3794b8c07eac1026aa1d190` | Saved web reference / metadata page |
| `mars/mars_trek_eq_layers.json` | 336,642 | `b98d3d3db56d29bed481c7e3594deca4e81d43d4bfdda6faf66a47a6f716d324` | NASA Trek catalog/facet metadata |
| `mars/mola_global_tile.jpg` | 62,976 | `e6107f23837680f0bacbf7e9d0fc3fb364e897039203eff9c6f2e8af73191856` | Rendered image/tile; not a quantitative raster |
| `mars/mola_roughness_wmts_capabilities.xml` | 5,158 | `cc8e386198acf84fd25f8cf242cf7be6a03dc191204f834bef4c6950f4db5f54` | WMTS service metadata |
| `mars/mola_wmts_capabilities.xml` | 7,040 | `2fb4722b5af0417980052354eab806cb9bdea003617548433cec8d8813d8d125` | WMTS service metadata |
| `mars/tes_dust_index_wmts_capabilities.xml` | 5,457 | `b69c9c360eec9fec656e23fb13fad7e4b87d40a3eb1506f2880674febf18855b` | WMTS service metadata |
| `mars/tes_dust_wmts_capabilities.xml` | 5,116 | `12222bdb83a13622ee8d517afbc96798395850bfcdacb8b96845e94522287f1d` | WMTS service metadata |
| `mars/trek_api_config.json` | 10,233 | `0bcadd7ccfd21216d21486c0a630efaff444c8fe02bb51db58b88e44c9fd4079` | Trek service/API configuration metadata |
| `mars/trekApi_mars.js` | 5,952 | `038b6ab9e3fc3ffded6c18e69a3fdba2b792708b5efc7a1b4b4f5500cf4a173a` | Trek API client source |
| `moon/lola_kaguya_hillshade_metadata.html` | 6,820 | `18b26db679657b4a10970968fac5a6a3dbf4a2b799e169d4b195a1be166cfc26` | Saved web reference / metadata page |
| `moon/lro_instruments.html` | 314,315 | `3a2d196fd0e7f32abcfdaf5686c41b71c8e7ab39df855a3d880aeea1293e8729` | Saved web reference / metadata page |
| `moon/lro_nac_south_pole_metadata.html` | 88,950 | `0e731920bbc881072fb23c1fbdffa3e2ab441a8191f28c21abddcde1fc14aecc` | Saved web reference / metadata page |
| `moon/malapert_lola_color_hillshade.png` | 27,612 | `59f7b2ea7676926569e19717d512317d903c0e156dcb1ec13d6c652cbf7686b6` | Rendered image/tile; not a quantitative raster |
| `moon/malapert_lola_color_slope.png` | 42,555 | `53cd0b29d76363745ac133eda3341e7986797dd5272b7b822cedae7b7bcf06e9` | Rendered image/tile; not a quantitative raster |
| `moon/malapert_lroc_dem_slope.png` | 40,928 | `23332609a9a1256d465a06464a1375ad2ff30f3248566e61ff14ab6667c14d01` | Rendered image/tile; not a quantitative raster |
| `moon/moon_trek.html` | 8,027 | `1707844db86e37d997b1ff4797db02a6bbb12082bb7af582d4de919759d6a0cf` | Saved web reference / metadata page |
| `moon/moon_trek_api.html` | 4,312 | `7ff5aea6018ea8e4184e12c84ad456c05033dc01d3794b8c07eac1026aa1d190` | Saved web reference / metadata page |
| `moon/moon_trek_polar_layers.json` | 1,492,574 | `f41c30df38e60342f48d507c61867902483b2da4aa21fae7013805197d8d29ca` | NASA Trek catalog/facet metadata |
| `moon/shackleton_lola_color_hillshade.png` | 24,770 | `7256e9ef74462c699b946e68bbb830a6216210c0df12a96a33b72299e4bf19fc` | Rendered image/tile; not a quantitative raster |
| `moon/shackleton_lola_color_slope.png` | 38,730 | `7a59cdc0b9153954c4095df8052451bc9c06ca93c3934ad3cb247c6dccac1bc0` | Rendered image/tile; not a quantitative raster |
| `moon/shackleton_lola_slope_service.json` | 668 | `e82c6f56959e6dc18e1fa6bea220ba30f792219bdb49ead63c5ba1d39d668a70` | Trek service/API configuration metadata |
| `moon/shackleton_lola_slope_wmts_capabilities.xml` | 7,864 | `9e5f7812839c7f1746d5766ab48572c44cb0fe38940cd7bcc79535f58957d211` | WMTS service metadata |
| `moon/trekApi_moon.js` | 5,952 | `038b6ab9e3fc3ffded6c18e69a3fdba2b792708b5efc7a1b4b4f5500cf4a173a` | Trek API client source |
| `processed/README.md` | 282 | `35fb05e0f39726479ca110d3115333a329b6df97c642b7f7294d6dd110cba230` | Project/data documentation |
| `raw/challenge_page.html` | 86,016 | `41cb69477e424108cb7f3ccb77d7f32f19f71a4f49cad393250ec963c8f436ec` | Saved web reference / metadata page |
| `raw/mee_lay_complete_analog_data_expanded.xlsx` | 10,805 | `b0df39afa5495a87f54e1430f031d73c83c9271d35ba6b923084225841ddeed9` | Research workbook; candidate values/notes, not validated output |
| `raw/mee_lay_master_project_data(1).xlsx` | 70,198 | `806a1628a81d1f8f9f99c1a55fd054e7e8e903d78ffec7c0c0e9680875b755a6` | Research workbook; candidate values/notes, not validated output |
| `raw/resources_page.html` | 66,995 | `104f6c63ca7d2925b342543fd73c453f33036230aa70777da93b6d1b94ff392d` | Saved web reference / metadata page |
| `README.md` | 1,586 | `e7a581400b4f27a48102df45c71fd0b944c61d55aa10bbc5ec7b499ecb8cf6d0` | Project/data documentation |
| `requirements-test.txt` | 109 | `618d6f095ae0e6ad292525c0cd49f1dede5ef334849e68ece92dc68c8404fcb0` | Project/data documentation |
| `scripts/__pycache__/audit_inputs.cpython-314.pyc` | 45,204 | `51300b61a3a32122bcc400d4750f8a235f34106c8b396a821f561f9dbe6ebcdf` | Generated Python bytecode cache; not source data |
| `scripts/__pycache__/nonspatial_readiness.cpython-314.pyc` | 30,211 | `be34b72d83e8550de98bb4509ce01ba7eb808f5daf168f5579afaa56cb403cf1` | Generated Python bytecode cache; not source data |
| `scripts/audit_inputs.py` | 30,259 | `7429b512d7e5857e1ed91778bc9de4ec0958f7d8ea7c8606dcecd76003a25b5e` | Read-only audit pipeline/test source |
| `scripts/nonspatial_readiness.py` | 22,167 | `b81931380b026c0de793191a9240b400cd8462c50a31f4a0ce159080a5d6c73d` | Read-only audit pipeline/test source |
| `tests/__pycache__/test_audit_inputs.cpython-314.pyc` | 10,178 | `6df8822b0854087013fff01cb271084950f2ee840390b735b454fc8e94209f87` | Generated Python bytecode cache; not source data |
| `tests/__pycache__/test_nonspatial_readiness.cpython-314.pyc` | 7,167 | `b3ab49dbc6d8a64bf4b0cc1ae1057c9a06f4325aad424bca3c4102db814a6498` | Generated Python bytecode cache; not source data |
| `tests/test_audit_inputs.py` | 4,816 | `cb9cad6542a6e6c43d54d8660bffef3b1b6b26f28a4921009857909e0fb9cdb4` | Read-only audit pipeline/test source |
| `tests/test_nonspatial_readiness.py` | 3,793 | `796ad3883ec8fe2dfb1c8487feff6588888c8f35aa56758199de1dac84a47906` | Read-only audit pipeline/test source |

## 11. Approval status

This report is ready for review. No scientific calculations or external downloads were performed. The assessment does not approve coordinates, resolve source eligibility, validate workbook candidate values, or approve missing-data/scoring semantics. The next implementation task should be chosen after the team reviews the evidence and supplies/retrieves the missing Earth Engine export/provenance and coordinate/source decisions.
