# Data processing status

The supplied register is under review. The workbook is treated as a provisional candidate only. Run the standard-library audit from the repository root:

```powershell
python data/scripts/audit_inputs.py
python -m unittest discover -s data/tests -v
```

The script writes review-only files to `data/interim/`:

- `provisional_site_target_register.json` preserves all 12 planned Earth sites and all 4 planetary targets. Candidate coordinates remain separate from `approved_coordinates`, which is `null` until human approval.
- `coordinate_conflict_report.json` records available CSV/workbook coordinate candidates, source worksheet/row, known source notes, and the human decision required.
- `source_asset_inventory.json` records file hashes and distinguishes numeric raster candidates from rendered images and reference metadata.
- For HGT files, the inventory checks whether the byte count matches the documented SRTM1 layout. This does not verify source version, units, void-fill lineage, or download provenance.
- `data_coverage_report.json` summarizes input availability and clearly reports scientific feature coverage as “not assessed” until review and processing are complete.

No generated review file is browser-ready. The current audit does not perform spatial extraction, spatial calculations, normalization, scoring, or export to `public/data/`. Preview PNG/JPEG pixels are not quantitative source data. Coordinate status is pending until a human approves a canonical value, its coordinate-specific citation, and representative geometry/buffer.
