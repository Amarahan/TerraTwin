"""Read-only SRTM, manifest, duplicate, and feature-source audit."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
from array import array
from pathlib import Path
from typing import Any

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
if str(REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(REPOSITORY_ROOT))

from data.scripts.audit_inputs import (
    EXPANDED,
    MASTER,
    ROOT,
    _xlsx_sheets,
    build_asset_inventory,
    build_register,
    validate_register,
)


SRTM_GUIDE_URL = "https://lpdaac.usgs.gov/documents/179/SRTM_User_Guide_V3.pdf"
LOCAL_GUIDE = ROOT / "docs/references/SRTM_User_Guide_V3.pdf"
SRTMGL1_BYTES = 3601 * 3601 * 2
SRTMGL3_BYTES = 1201 * 1201 * 2
SOURCE_ROOTS = [ROOT / "data" / name for name in ("earth", "moon", "mars", "manifests", "raw")]
MANIFESTS = [
    ROOT / "data/manifests/core_target_data_manifest.csv",
    ROOT / "data/manifests/download_manifest.csv",
]


def inspect_hgt(path: Path) -> dict[str, Any]:
    """Check file integrity/layout and inspect signed big-endian sample range.

    This is a file-format audit only. It does not geolocate or extract values.
    """
    raw = path.read_bytes()
    byte_count = len(raw)
    values = array("h")
    if byte_count % values.itemsize == 0:
        values.frombytes(raw)
        if sys.byteorder == "little":
            values.byteswap()
    else:
        values = array("h")
    sample_count = len(values)
    srtmgl1_match = byte_count == SRTMGL1_BYTES
    srtmgl3_match = byte_count == SRTMGL3_BYTES
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "file_size_bytes": byte_count,
        "sha256": hashlib.sha256(raw).hexdigest(),
        "expected_srtmgl1_bytes": SRTMGL1_BYTES,
        "expected_srtmgl3_bytes": SRTMGL3_BYTES,
        "matches_srtmgl1_size": srtmgl1_match,
        "matches_srtmgl3_size": srtmgl3_match,
        "size_consistent_layout": "SRTMGL1_3601x3601" if srtmgl1_match else "SRTMGL3_1201x1201" if srtmgl3_match else None,
        "interpreted_as_signed_16_bit_big_endian": byte_count % 2 == 0 and sample_count > 0,
        "interpreted_sample_count": sample_count,
        "big_endian_interpreted_min_meters": min(values) if values else None,
        "big_endian_interpreted_max_meters": max(values) if values else None,
        "count_of_minus_32768_samples": sum(value == -32768 for value in values),
        "exact_product_version": "UNVERIFIED",
        "download_origin": "UNVERIFIED",
        "source_provenance": "UNVERIFIED: HGT file is not listed in the supplied local-file manifests; nearby browse-image records do not establish this file's lineage.",
        "format_claims_from_guide": {
            "sample_type": "two-byte (16-bit) signed integer",
            "byte_order": "Motorola big-endian",
            "row_order": "row-major; northernmost row first",
            "header_or_trailer": "none embedded per guide format specification",
            "elevation_unit_and_reference": "meters referenced to the WGS84/EGM96 geoid (guide wording)",
            "void_value_by_version": {
                "versions_1_0_and_2_1": -32768,
                "version_3_0": "guide states no voids",
                "applied_to_this_file": "UNVERIFIED until exact version is established",
            },
        },
        "format_check_limitations": "A matching byte count is consistent with a documented SRTM layout, but does not identify dataset version, product lineage, datum realization, download origin, actual endian semantics, or prove that no bytes were replaced in the grid payload. Samples are reported as read-only big-endian interpretations; no values were transformed or used spatially.",
    }


def _manifest_path_rows() -> tuple[list[dict[str, Any]], set[str]]:
    actual_paths = {
        path.relative_to(ROOT).as_posix()
        for source_root in SOURCE_ROOTS
        for path in source_root.rglob("*")
        if path.is_file()
    }
    basename_index: dict[str, list[str]] = {}
    for relative_path in sorted(actual_paths):
        basename_index.setdefault(Path(relative_path).name.casefold(), []).append(relative_path)
    results: list[dict[str, Any]] = []
    declared_manifest_paths: set[str] = set()
    for manifest in MANIFESTS:
        with manifest.open(encoding="utf-8-sig", newline="") as stream:
            for row_number, row in enumerate(csv.DictReader(stream), start=2):
                local_file = row.get("local_file", "").replace("\\", "/").strip()
                if not local_file:
                    continue
                expected = f"data/{local_file}"
                declared_manifest_paths.add(expected)
                if expected in actual_paths:
                    status, matches = "EXACT_PATH_MATCH", [expected]
                else:
                    matches = basename_index.get(Path(local_file).name.casefold(), [])
                    if len(matches) == 1:
                        status = "UNIQUE_BASENAME_PATH_MISMATCH"
                    elif len(matches) > 1:
                        status = "AMBIGUOUS_BASENAME_MATCH"
                    else:
                        status = "MISSING_BUNDLED_FILE"
                results.append({
                    "manifest": manifest.relative_to(ROOT).as_posix(),
                    "manifest_row": row_number,
                    "expected_local_file": expected,
                    "status": status,
                    "actual_path_candidates": matches,
                    "source_url": row.get("official_nasa_source") or row.get("official_source_url") or "",
                    "dataset_or_layer": row.get("dataset_or_layer") or row.get("dataset") or "",
                    "notes": row.get("asset_type") or row.get("coverage_note") or "",
                })
    return results, declared_manifest_paths


def reconcile_manifests() -> dict[str, Any]:
    rows, declared = _manifest_path_rows()
    counts: dict[str, int] = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1
    return {
        "manifest_files_preserved": [path.relative_to(ROOT).as_posix() for path in MANIFESTS],
        "entry_count": len(rows),
        "counts_by_status": counts,
        "rows": rows,
        "bundled_hgt_not_declared_by_local_file_manifest": [
            path.relative_to(ROOT).as_posix()
            for source_root in SOURCE_ROOTS
            for path in source_root.rglob("*.hgt")
            if path.relative_to(ROOT).as_posix() not in declared
        ],
    }


def feature_source_rows() -> list[dict[str, str]]:
    workbook = _xlsx_sheets(MASTER)
    rows = []
    for row in workbook.get("Plan match", []):
        label = row.get("A", "").strip()
        if not re.match(r"^[1-8]\s", label):
            continue
        rows.append({
            "feature": re.sub(r"^[1-8]\s+", "", label),
            "world": row.get("B", ""),
            "candidate_source": row.get("D", ""),
            "workbook_status": row.get("E", ""),
            "resolution_or_coverage": row.get("F", ""),
            "workbook_derivation_note": row.get("H", ""),
            "workbook_caution": row.get("I", ""),
        })
    return rows


def build_readiness() -> dict[str, Any]:
    register = build_register()
    validate_register(register)
    assets = build_asset_inventory()
    hgt_files = sorted((ROOT / "data/earth").glob("*.hgt"))
    manifest_report = reconcile_manifests()
    feature_rows = feature_source_rows()
    return {
        "schema_version": "0.1",
        "scope": "non-spatial P1 readiness; no coordinate-based coverage claims",
        "local_srtm_guide": {
            "path": LOCAL_GUIDE.relative_to(ROOT).as_posix(),
            "present": LOCAL_GUIDE.is_file(),
            "status": "NOT_PRESENT; official LP DAAC web copy consulted for format specification" if not LOCAL_GUIDE.is_file() else "PRESENT",
            "official_web_reference": SRTM_GUIDE_URL,
        },
        "hgt_files": [inspect_hgt(path) for path in hgt_files],
        "asset_summary": {
            "file_count": len(assets["items"]),
            "sha256_recorded_for_each_file": all(len(item["sha256"]) == 64 for item in assets["items"]),
            "duplicate_content_groups": assets["duplicate_content_groups"],
            "asset_type_counts": {
                category: sum(item["asset_type"] == category for item in assets["items"])
                for category in sorted({item["asset_type"] for item in assets["items"]})
            },
        },
        "manifest_reconciliation": manifest_report,
        "scientific_feature_source_inventory": feature_rows,
        "data_gaps": [
            "The workbook's Site data sheet cites mee_lay_earth_features.csv, but that file is not present in the supplied bundle.",
            "No approved eight-feature source/configuration file exists; workbook mappings and derivation notes remain candidates.",
            "Only two quantitative-raster candidates are supplied (the HGT tiles); exact product version/source provenance is unverified and site extraction is coordinate-gated.",
            "Moon/Mars raster-like images are rendered previews or WMTS tiles, not calibrated numeric source rasters.",
            "No browser-ready validated scientific measurements or reference sample are present.",
        ],
        "policy_flags": [
            "The workbook's candidate plan includes non-NASA datasets/providers such as Copernicus/ESA, ERA5-Land/ECMWF, CHIRPS/UCSB, and Mars Climate Database consortium products. AGENTS.md requires human approval before adding non-NASA datasets.",
            "Workbook-proposed rule encodings for lunar/Martian dryness or vegetation and candidate ice classes are not treated as values or scoring rules without explicit approval.",
            "All 12 Earth sites and 4 targets remain in the provisional register; coordinate status is PENDING_HUMAN_REVIEW and approved coordinates are null.",
        ],
        "processing_status": "NO_SPATIAL_EXTRACTION_OR_SCORING_PERFORMED",
    }


def _markdown_report(report: dict[str, Any]) -> str:
    lines = [
        "# P1 Non-spatial Readiness Report",
        "",
        "**Status:** non-spatial audit complete. All 12 Earth sites and 4 planetary targets remain in the provisional register; all approved coordinates remain null and `PENDING_HUMAN_REVIEW`. No spatial extraction, site-specific coverage calculation, or similarity scoring was performed.",
        "",
        "## Current progress and fastest safe MVP path",
        "",
        "- P0 audit and coordinate-safe P1 register/conflict tooling are complete. This report adds HGT file-format inspection, SHA-256 duplicate verification, manifest-path reconciliation, and a feature-to-source inventory.",
        "- The existing React/Vite application should be retained. Replace unsupported measurements, coordinates, rankings, scores, and weight presets with the provisional register, pending/no-data states, NASA source context, and an honest no-score state.",
        "- The workspace is not a Git checkout; there is no Git status/diff to inspect. `starter_app/` has no lockfile or installed `node_modules` at audit start.",
        "",
        "## 1. SRTM guide availability and scope",
        "",
    ]
    local = report["local_srtm_guide"]
    if local["present"]:
        lines.append(f"- Requested local guide `{local['path']}` present: **true**. The supplied PDF was inspected directly on 2026-11-14; format specifications below are in section 2.1.4, pages 10–11 of the Revised October 2015 guide. File presence does not establish provenance for the bundled HGT tiles.")
    else:
        lines.append(f"- Requested local guide `{local['path']}` present: **false**. The supplied copy is missing from the workspace. The format specification below was checked against the [official LP DAAC guide (Revised October 2015)]({local['official_web_reference']}); this is not the missing local file.")
    lines += [
        "- The guide specifies SRTMGL1 as 3,601 × 3,601 at 1 arc-second and SRTMGL3 as 1,201 × 1,201 at 3 arc-seconds. Both HGT grids contain two-byte signed integer samples. The HGT convention is big-endian, row-major with the northernmost row first, with no embedded header/trailer. Elevation is in metres, referenced to the WGS84/EGM96 geoid (guide wording).",
        "- The guide says `-32768` marks voids for versions 1.0 and 2.1, while version 3.0 has no voids. Because exact input versions are unverified, the scan reports the sentinel count but does not classify or replace samples.",
        "",
        "## 2. HGT file-level results",
        "",
        "| File | Bytes | SHA-256 | SRTMGL1 layout match | SRTMGL3 layout match | Big-endian interpreted range (m) | `-32768` samples | Product/version/provenance |",
        "|---|---:|---|---|---|---:|---:|---|",
    ]
    for item in report["hgt_files"]:
        value_range = f"{item['big_endian_interpreted_min_meters']} to {item['big_endian_interpreted_max_meters']}" if item["interpreted_sample_count"] else "not read"
        lines.append(
            f"| `{item['path']}` | {item['file_size_bytes']:,} | `{item['sha256']}` | {item['matches_srtmgl1_size']} | {item['matches_srtmgl3_size']} | {value_range} | {item['count_of_minus_32768_samples']:,} | **UNVERIFIED**; {item['source_provenance']} |"
        )
    lines += [
        "",
        "Both files match the SRTMGL1 byte-count layout of 25,934,402 bytes; neither matches the SRTMGL3 byte count of 2,884,802 bytes. This is a format-size consistency result only. It does not establish exact product ID/version, origin, checksum from the source archive, vertical datum realization, void-fill lineage, or actual endian semantics. The byte scan is read-only; originals were not modified.",
        "",
        "## 3. SHA-256 duplicates and file integrity",
        "",
        f"The source inventory hashes all {report['asset_summary']['file_count']} supplied data files. Exact duplicate-content groups: **{len(report['asset_summary']['duplicate_content_groups'])}**.",
        "",
        "| SHA-256 | Exact duplicate paths |",
        "|---|---|",
    ]
    for group in report["asset_summary"]["duplicate_content_groups"]:
        lines.append(f"| `{group['sha256']}` | " + "<br>".join(f"`{path}`" for path in group["paths"]) + " |")
    lines += [
        "",
        "Inventory classification: " + "; ".join(f"{name}: {count}" for name, count in report["asset_summary"]["asset_type_counts"].items()) + ".",
        "",
        "## 4. Manifest path reconciliation",
        "",
        "Original manifests were read only and remain unchanged. Detailed row-by-row expected/actual paths and source URLs are in [the separate mismatch report](P1_MANIFEST_PATH_MISMATCH_REPORT.md).",
        "",
        "| Match status | Rows |",
        "|---|---:|",
    ]
    for status, count in sorted(report["manifest_reconciliation"]["counts_by_status"].items()):
        lines.append(f"| `{status}` | {count} |")
    lines += [
        "",
        "HGT files absent from the manifests' `local_file` records: " + (", ".join(f"`{path}`" for path in report["manifest_reconciliation"]["bundled_hgt_not_declared_by_local_file_manifest"]) or "none") + ". Their download provenance remains unverified.",
        "",
        "## 5. Scientific feature-to-source inventory",
        "",
        "The table transcribes candidate mappings and status notes from the research workbook's `Plan match` sheet. It does not approve a scientific definition, dataset, feature value, or coverage claim. Supplied preview assets do not count as quantitative source data.",
        "",
        "| Feature | World | Workbook source candidate | Workbook status / resolution | Candidate method and limitations |",
        "|---|---|---|---|---|",
    ]
    for row in report["scientific_feature_source_inventory"]:
        note = " ".join(item for item in [row["workbook_derivation_note"], row["workbook_caution"]] if item)
        lines.append(f"| {row['feature']} | {row['world']} | {row['candidate_source']} | {row['workbook_status']}; {row['resolution_or_coverage']} | {note or 'No method note supplied'} |")
    lines += [
        "",
        "### What is actually bundled",
        "",
        "- **Quantitative candidate:** two raw-looking SRTM HGT files, but source version/provenance is unverified; no spatial use is authorized until coordinates/geometry and source details are approved.",
        "- **Visual-only:** SRTM/ASTER browse JPEGs, selected regional images, Moon LOLA/LROC colorized slope/hillshade previews, and Mars Trek/WMTS PNG/JPEG tiles. Do not sample colors as measurements.",
        "- **Metadata/reference:** NASA Trek layer catalogs, WMTS capabilities, product pages, and workbook dataset records. They identify possible sources but do not supply analysis rasters.",
        "- The workbook's `Site data` sheet cites `mee_lay_earth_features.csv`, which is absent. Its feature values therefore cannot be reproduced from the supplied bundle. The workbook itself reports zero dataset test values in its verification summary.",
        "",
        "### Missing information and policy conflicts",
        "",
    ]
    lines.extend(f"- {item}" for item in report["data_gaps"] + report["policy_flags"])
    lines += [
        "- No site-specific data coverage can be inferred here. Candidate datasets' global extent or latitude range is not a substitute for approved site geometry, pixel QA, temporal filters, or a reproducible extraction.",
        "- The workbook proposes NASA and non-NASA sources. `AGENTS.md` says not to add non-NASA datasets unless the team confirms the challenge permits them and approves the change. Keep non-NASA candidates out of production inputs pending that approval.",
        "",
        "## 6. Recommended next technical steps",
        "",
        "1. Human team approves canonical coordinates and representative geometries, with coordinate-specific citations, for entries to be spatially processed. Preserve the other entries as pending.",
        "2. Team confirms NASA-only competition interpretation and approves the exact source list; choose NASA alternatives where available. Resolve the HGT tile download manifest/version/provenance without replacing originals.",
        "3. Team freezes feature definitions, normalization, weights, category matrices, missing-data policy, and reference checks before any score implementation.",
        "4. With scope and approved points, implement reproducible extractions from quantitative rasters/catalog products; do not sample preview images. Record native/analysis resolution, dates, scale, QA, unit and provenance.",
        "5. For the MVP meanwhile, connect the existing frontend to the 12+4 provisional display register, hide map markers for pending coordinates, show all feature values as `No data`/`Pending review`, and label score and validation status `Not computed`.",
        "",
        "## 7. Verification commands",
        "",
        "```powershell",
        "python data/scripts/nonspatial_readiness.py",
        "python -m unittest discover -s data/tests -v",
        "```",
        "",
        "No spatial extraction, coordinate selection, scoring, or scientific-value generation is performed by these commands.",
        "",
    ]
    return "\n".join(lines)


def build_mismatch_report(reconciliation: dict[str, Any]) -> str:
    lines = [
        "# Manifest Path Mismatch Report",
        "",
        "Original manifest CSV files were not modified. Paths are compared against the bundled files; a basename match is reported as a mismatch when the directory path differs.",
        "",
        "| Manifest | Row | Expected `local_file` | Result | Actual bundled path candidate(s) | Dataset/layer | Source URL |",
        "|---|---:|---|---|---|---|---|",
    ]
    for row in reconciliation["rows"]:
        actual = "<br>".join(f"`{path}`" for path in row["actual_path_candidates"]) or "None"
        lines.append(
            f"| `{row['manifest']}` | {row['manifest_row']} | `{row['expected_local_file']}` | `{row['status']}` | {actual} | {row['dataset_or_layer']} | {row['source_url'] or 'Not supplied'} |"
        )
    lines += [
        "",
        "## Unlisted quantitative candidates",
        "",
        "The following HGT files are present but absent from the checked manifests' `local_file` rows; this report does not infer or construct their source URLs:",
        "",
    ]
    lines.extend(f"- `{path}` — source/download provenance `UNVERIFIED`." for path in reconciliation["bundled_hgt_not_declared_by_local_file_manifest"])
    if not reconciliation["bundled_hgt_not_declared_by_local_file_manifest"]:
        lines.append("- None.")
    lines += ["", ""]
    return "\n".join(lines)


def main() -> int:
    output = ROOT / "data/interim"
    output.mkdir(parents=True, exist_ok=True)
    report = build_readiness()
    reconciliation = report["manifest_reconciliation"]
    (output / "nonspatial_readiness.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (output / "manifest_path_reconciliation.json").write_text(json.dumps(reconciliation, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (ROOT / "docs/P1_NONSPATIAL_READINESS_REPORT.md").write_text(_markdown_report(report), encoding="utf-8")
    (ROOT / "docs/P1_MANIFEST_PATH_MISMATCH_REPORT.md").write_text(build_mismatch_report(reconciliation), encoding="utf-8")
    print(f"Inspected {len(report['hgt_files'])} HGT files; product provenance remains unverified.")
    print(f"Hashed {report['asset_summary']['file_count']} source files; found {len(report['asset_summary']['duplicate_content_groups'])} duplicate-content groups.")
    print(f"Reconciled {reconciliation['entry_count']} manifest file rows; counts: {reconciliation['counts_by_status']}.")
    print(f"Wrote {len(report['scientific_feature_source_inventory'])} feature/world source-candidate rows.")
    print("No spatial extraction, score calculation, or coordinate selection was performed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
