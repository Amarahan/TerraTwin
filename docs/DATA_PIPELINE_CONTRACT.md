# TerraTwin — Data Pipeline Contract

## 1. Directory contract

```text
data/
  input/       # approved CSV registers and cited target notes
  raw/         # original downloads/exports; never served
  interim/     # extraction outputs before cleaning
  processed/  # validated, normalized data and QA reports
  scripts/     # reproducible Python pipeline
  tests/       # pytest tests and fixtures
public/data/   # small final JSON only; browser-readable
```

## 2. Canonical files

### `features.json`
One record per feature. Required fields:
- `id`, `label`, `description`, `unit`
- `dataset_id`, `dataset_name`, `provider`, `band`
- `source_url`, `citation`
- `date_start`, `date_end`
- `native_resolution`, `analysis_scale`
- `scale_factor`, `offset`, `qa_method`
- `normalization_method`, `normalization_range`
- `confidence_tier`, `limitations`

### `sites.json`
- `targets`: four approved lunar/Martian targets, each with stable ID, name, body, coordinate/geometry, feature values and per-value provenance.
- `sites`: twelve approved Earth study sites, each with stable ID, name, group, region, coordinate/geometry, feature values and per-value provenance.
- `presets`: approved weight presets, if implemented.
- `limits`: body-specific Limits vs Mission Reality rows.

Each measurement should carry a value (number, category or null), unit, source ID, source URL/citation key, confidence, status, date range and processing method.

### `reference.json`
- Sample ID, coordinates, sample method, random seed, land-mask source, feature values and provenance.
- Include metadata for sample count, generation date, processing version, spatial scale and exclusions.
- Use the same pipeline and scoring configuration as candidate sites.

### `metadata.json`
- schema version;
- pipeline version / Git commit;
- generation timestamp;
- source manifest version;
- scoring-method version;
- reference sample seed and count;
- processing warnings;
- checksums where practical.

## 3. Processing stages
1. Validate input registers and coordinate ranges.
2. Check source availability and permissions.
3. Extract raw values.
4. Save untouched raw outputs.
5. Apply documented QA masks and scale factors.
6. Convert units without discarding original values.
7. Normalize using frozen shared ranges.
8. Merge target values with cited provenance.
9. Calculate feature similarities and scores.
10. Generate reference percentiles and validation outcomes.
11. Validate output schemas and scientific invariants.
12. Export compact JSON to `public/data/`.

Every stage must be re-runnable and produce a clear log.

## 4. Validation rules

Fail the pipeline when:
- required columns or IDs are missing;
- IDs are duplicated;
- coordinates are invalid or conflict with the approved register;
- units or source metadata are absent for a non-null value;
- a numeric value is outside its physically valid range without an explicit exception;
- normalization produces NaN/Infinity;
- weights are negative, non-finite or do not sum to 1.00 within tolerance;
- output schema is invalid;
- source record is missing for a derived result.

Warn (do not silently correct) for partial spatial coverage, low-quality pixels, coarse native resolution/resampling, target values from papers, estimated/categorical encodings, or different temporal coverage.

## 5. Scoring contract

The approved formula and missing-data policy must be written in the Method page and tested in Python and TypeScript.

Numeric similarity:
`sim_i = 1 - abs(earth_i_normalized - target_i_normalized)`

Rock/mineral similarity uses only the human-approved category matrix. Ice/permafrost uses the approved encoding only where the source supports it.

Composite score:
`score = 100 * sum(weight_i * similarity_i)` subject to the explicitly approved missing-data and coverage policy.

No missing value is zero. If the approved coverage rule is not met, the score is null and the UI explains why.

## 6. Dataset-specific cautions
- Copernicus DEM GLO-30 is a Digital Surface Model. It can include vegetation and buildings; document this when interpreting terrain metrics.
- Use the current official Earth Engine catalog entry and follow its collection mosaic/projection guidance.
- MODIS LST requires correct scale factor and QA consideration. Day-minus-night is a diurnal contrast, not seasonal temperature range.
- ERA5-Land accumulated precipitation is in metres for the relevant band; convert to millimetres explicitly and validate suspicious/negative accumulations.
- MODIS NDVI and MAIAC AOD require correct scale factors, bands and QA masks.
- Verify exact dataset IDs, bands, availability, temporal filtering and citations from the official catalog before processing.

## 7. Human approval gates
Agents must not decide these independently:
- final coordinates and geometry/buffer for each site;
- target values and citations;
- normalization ranges and direction;
- rock/mineral similarity matrix;
- ice/permafrost encoding;
- missing-data and minimum-coverage policy;
- reference sampling method and validation thresholds;
- whether a value is scientifically comparable across Earth, Moon and Mars.
