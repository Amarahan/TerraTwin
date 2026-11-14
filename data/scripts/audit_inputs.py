"""Build a provenance-preserving register and supplied-asset audit.

This audit deliberately does not approve, normalize, or spatially process
coordinate candidates. It uses only Python's standard library.
"""

from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath
from typing import Any
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "data/manifests/site_targets.csv"
MASTER = ROOT / "data/raw/mee_lay_master_project_data(1).xlsx"
EXPANDED = ROOT / "data/raw/mee_lay_complete_analog_data_expanded.xlsx"
INTERIM = ROOT / "data/interim"
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
SRTM_USER_GUIDE = "https://lpdaac.usgs.gov/documents/179/SRTM_User_Guide_V3.pdf"

SITES = [
    ("twin-taung-maar-crater", "Twin Taung Maar Crater", "Featured", "Earth", ["twin taung", "twin taung maar crater", "twin taung maar crater (myanmar)"], "Myanmar"),
    ("letpadaung-monywa-copper-area", "Letpadaung / Monywa Copper Area", "Featured", "Earth", ["letpadaung", "letpadaung copper area", "letpadaung monywa copper area"], "Myanmar"),
    ("mount-popa-central-dry-zone", "Mount Popa / Central Dry Zone", "Featured", "Earth", ["mount popa", "mount popa central dry zone"], "Myanmar"),
    ("kawah-ijen", "Kawah Ijen", "Featured", "Earth", ["kawah ijen"], "Indonesia"),
    ("atacama-desert", "Atacama Desert", "Benchmark", "Earth", ["atacama", "atacama desert", "atacama (yungay)", "atacama desert (yungay)"], "Chile"),
    ("haughton-crater", "Haughton Crater", "Benchmark", "Earth", ["haughton", "haughton crater"], "Canada"),
    ("mcmurdo-dry-valleys", "McMurdo Dry Valleys", "Benchmark", "Earth", ["mcmurdo", "mcmurdo dry valleys"], "Antarctica"),
    ("death-valley", "Death Valley", "Benchmark", "Earth", ["death valley"], "United States"),
    ("lonar-crater", "Lonar Crater", "Benchmark", "Earth", ["lonar", "lonar crater"], "India"),
    ("amazon-rainforest", "Amazon Rainforest", "Control", "Earth", ["amazon", "amazon rainforest"], "Brazil"),
    ("congo-basin", "Congo Basin", "Control", "Earth", ["congo", "congo basin"], "Africa"),
    ("irrawaddy-delta-rice-fields", "Irrawaddy Delta rice fields", "Control", "Earth", ["irrawaddy", "irrawaddy delta", "irrawaddy delta rice fields"], "Myanmar"),
]
TARGETS = [
    ("shackleton-crater-rim", "Shackleton Crater Rim", "Moon", ["shackleton", "shackleton crater rim"]),
    ("malapert-massif", "Malapert Massif", "Moon", ["malapert", "malapert massif"]),
    ("jezero-crater", "Jezero Crater", "Mars", ["jezero", "jezero crater"]),
    ("meridiani-planum", "Meridiani Planum", "Mars", ["meridiani", "meridiani planum"]),
]


def norm_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


def _xlsx_sheets(path: Path) -> dict[str, list[dict[str, str]]]:
    """Read worksheet cell values (including inline and shared strings)."""
    with zipfile.ZipFile(path) as archive:
        shared: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared = [
                "".join(part.text or "" for part in item.findall(".//m:t", NS))
                for item in shared_root.findall("m:si", NS)
            ]
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rels = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels_root}
        result: dict[str, list[dict[str, str]]] = {}
        for sheet in workbook.findall(".//m:sheet", NS):
            target = rels[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
            target = target if target.startswith("xl/") else f"xl/{target}"
            target = str(PurePosixPath("xl") / PurePosixPath(target).relative_to("xl"))
            root = ET.fromstring(archive.read(target))
            rows: list[dict[str, str]] = []
            for row in root.findall(".//m:sheetData/m:row", NS):
                cells: dict[str, str] = {"_row": row.attrib.get("r", "")}
                for cell in row.findall("m:c", NS):
                    ref = cell.attrib.get("r", "")
                    column = re.match(r"[A-Z]+", ref)
                    if not column:
                        continue
                    if cell.attrib.get("t") == "inlineStr":
                        value = "".join(part.text or "" for part in cell.findall(".//m:t", NS))
                    else:
                        value_node = cell.find("m:v", NS)
                        value = value_node.text if value_node is not None else ""
                        if cell.attrib.get("t") == "s" and value:
                            value = shared[int(value)]
                    if value != "":
                        cells[column.group()] = value
                rows.append(cells)
            result[sheet.attrib["name"]] = rows
        return result


def _row_index(rows: list[dict[str, str]], name_col: str) -> dict[str, dict[str, str]]:
    indexed: dict[str, dict[str, str]] = {}
    for row in rows:
        name = row.get(name_col, "").strip()
        if name:
            indexed[norm_name(name)] = row
    return indexed


def _candidate(lat: str | None, lon: str | None, *, source_file: str, sheet: str | None = None, row: str | None = None, record_name: str | None = None, coordinate_source_note: str | None = None, associated_source_reference: str | None = None, raw_text: str | None = None) -> dict[str, Any]:
    result: dict[str, Any] = {
        "latitude_raw": lat,
        "longitude_raw": lon,
        "coordinate_text_raw": raw_text,
        "source_file": source_file,
        "sheet": sheet,
        "row": row,
        "record_name": record_name,
        "coordinate_specific_source_reference": coordinate_source_note,
        "associated_source_reference": associated_source_reference,
        "status": "PENDING_HUMAN_REVIEW",
    }
    return result


def _same_decimal(left: dict[str, Any], right: dict[str, Any]) -> bool:
    try:
        return float(left["latitude_raw"]) == float(right["latitude_raw"]) and float(left["longitude_raw"]) == float(right["longitude_raw"])
    except (TypeError, ValueError, KeyError):
        return False


def _overall_status(candidates: list[dict[str, Any]]) -> str:
    # Matching text/numeric values still need human approval and coordinate citations.
    return "PENDING_HUMAN_REVIEW"


def _issue_type(candidates: list[dict[str, Any]]) -> str:
    if not candidates:
        return "MISSING_COORDINATE_CANDIDATE"
    numeric = [candidate for candidate in candidates if candidate.get("latitude_raw") is not None]
    if len(numeric) > 1 and any(not _same_decimal(numeric[0], other) for other in numeric[1:]):
        return "CONFLICTING_COORDINATE_CANDIDATES"
    if any(candidate.get("coordinate_text_raw") for candidate in candidates):
        return "COORDINATE_TEXT_REQUIRES_REVIEW"
    return "PROVENANCE_OR_APPROVAL_REQUIRED"


def _load_csv() -> list[dict[str, str]]:
    with MANIFEST.open(encoding="utf-8-sig", newline="") as stream:
        rows = list(csv.DictReader(stream))
    for line_number, row in enumerate(rows, start=2):
        row["_line_number"] = str(line_number)
    return rows


def build_register() -> dict[str, Any]:
    csv_rows = _load_csv()
    master = _xlsx_sheets(MASTER)
    expanded = _xlsx_sheets(EXPANDED)

    master_sites = master.get("Site master", [])
    master_site_by_name = _row_index(master_sites, "A")
    coordinate_check = _row_index(master.get("Coordinate check", []), "A")
    expanded_sites = _row_index(expanded.get("Earth Gaps - Rock & Ice", []), "A")
    moon_targets = _row_index(expanded.get("Moon Targets", []), "A")
    mars_targets = _row_index(expanded.get("Mars Targets", []), "A")

    alias_map: dict[str, tuple[str, ...]] = {}
    for entry in SITES + TARGETS:
        for alias in entry[4] if len(entry) > 4 else entry[3]:
            alias_map[norm_name(alias)] = entry[0:2]
    csv_index: dict[str, dict[str, str]] = {}
    for row in csv_rows:
        label = row.get("target_name", "") if row.get("body", "") != "Earth" else row.get("target_name", "")
        key = norm_name(label)
        if key in alias_map:
            canonical_id, _ = alias_map[key]
            csv_index[canonical_id] = row

    records: list[dict[str, Any]] = []
    for site_id, name, group, body, aliases, region in SITES:
        master_row = next((master_site_by_name.get(norm_name(alias)) for alias in aliases if master_site_by_name.get(norm_name(alias))), None)
        expanded_row = next((expanded_sites.get(norm_name(alias)) for alias in aliases if expanded_sites.get(norm_name(alias))), None)
        check_row = next((coordinate_check.get(norm_name(alias)) for alias in aliases if coordinate_check.get(norm_name(alias))), None)
        csv_row = csv_index.get(site_id)
        candidates: list[dict[str, Any]] = []
        if csv_row:
            candidates.append(_candidate(csv_row.get("latitude"), csv_row.get("longitude"), source_file="data/manifests/site_targets.csv", row=csv_row.get("_line_number"), record_name=csv_row.get("target_name"), associated_source_reference=csv_row.get("primary_official_data_to_download")))
        if master_row:
            candidates.append(_candidate(master_row.get("D"), master_row.get("E"), source_file=MASTER.relative_to(ROOT).as_posix(), sheet="Site master", row=master_row.get("_row"), record_name=master_row.get("A")))
        if check_row and (check_row.get("D") or check_row.get("E")):
            candidates.append(_candidate(check_row.get("D"), check_row.get("E"), source_file=MASTER.relative_to(ROOT).as_posix(), sheet="Coordinate check — source coordinate", row=check_row.get("_row"), record_name=check_row.get("A"), coordinate_source_note=check_row.get("F")))
        if expanded_row:
            candidates.append(_candidate(expanded_row.get("C"), expanded_row.get("D"), source_file=EXPANDED.relative_to(ROOT).as_posix(), sheet="Earth Gaps - Rock & Ice", row=expanded_row.get("_row"), record_name=expanded_row.get("A"), associated_source_reference=expanded_row.get("G")))
        issue = _coordinate_issue(candidates, csv_row, check_row)
        records.append({
            "id": site_id,
            "id_status": "PROVISIONAL_SLUG",
            "name": name,
            "body": body,
            "group": group,
            "region_candidate": region,
            "register_status": "PROVISIONAL_CANDIDATE",
            "approved_coordinates": None,
            "coordinate_status": _overall_status(candidates),
            "coordinate_issue_type": _issue_type(candidates),
            "coordinate_candidates": candidates,
            "nature_of_conflict": issue,
            "human_decision_required": "Approve a canonical coordinate, authoritative citation, and representative geometry/buffer; preserve this site in the register while pending.",
        })

    for target_id, name, body, aliases in TARGETS:
        csv_row = csv_index.get(target_id)
        target_rows = moon_targets if body == "Moon" else mars_targets
        book_row = next((target_rows.get(norm_name(alias)) for alias in aliases if target_rows.get(norm_name(alias))), None)
        candidates = []
        if csv_row:
            candidates.append(_candidate(csv_row.get("latitude"), csv_row.get("longitude"), source_file="data/manifests/site_targets.csv", row=csv_row.get("_line_number"), record_name=csv_row.get("target_name"), associated_source_reference=csv_row.get("primary_official_data_to_download")))
        if book_row:
            candidates.append(_candidate(None, None, source_file=EXPANDED.relative_to(ROOT).as_posix(), sheet="Moon Targets" if body == "Moon" else "Mars Targets", row=book_row.get("_row"), record_name=book_row.get("A"), associated_source_reference=book_row.get("H"), raw_text=book_row.get("B")))
        records.append({
            "id": target_id,
            "id_status": "PROVISIONAL_SLUG",
            "name": name,
            "body": body,
            "register_status": "PROVISIONAL_CANDIDATE",
            "approved_coordinates": None,
            "coordinate_status": "PENDING_HUMAN_REVIEW",
            "coordinate_issue_type": _issue_type(candidates),
            "coordinate_candidates": candidates,
            "nature_of_conflict": _coordinate_issue(candidates, csv_row, None),
            "human_decision_required": "Approve a canonical coordinate, authoritative coordinate citation, and target geometry; keep this target in the register while pending.",
        })

    return {
        "schema_version": "0.1",
        "register_status": "PROVISIONAL_CANDIDATE_NOT_APPROVED",
        "policy": "Candidate coordinates are preserved verbatim with workbook/CSV provenance. approved_coordinates remains null until human approval. No site or target is removed due to missing coordinates.",
        "sources": [
            "data/manifests/site_targets.csv",
            MASTER.relative_to(ROOT).as_posix(),
            EXPANDED.relative_to(ROOT).as_posix(),
            "docs/TerraTwin_Final_Development_Plan.md (planned site and target scope)",
        ],
        "sites": records[:len(SITES)],
        "targets": records[len(SITES):],
    }


def validate_register(register: dict[str, Any]) -> None:
    expected_sites = {entry[1] for entry in SITES}
    expected_targets = {entry[1] for entry in TARGETS}
    sites = register.get("sites", [])
    targets = register.get("targets", [])
    errors: list[str] = []
    if {item.get("name") for item in sites} != expected_sites:
        errors.append("Earth site names do not match the complete planned 12-site scope.")
    if {item.get("name") for item in targets} != expected_targets:
        errors.append("Target names do not match the complete planned four-target scope.")
    entries = sites + targets
    ids = [item.get("id") for item in entries]
    if len(ids) != len(set(ids)) or any(not value for value in ids):
        errors.append("Register IDs must be present and unique.")
    for item in entries:
        if item.get("approved_coordinates") is not None:
            errors.append(f"Unapproved coordinates were placed in the approved field for {item.get('name')}.")
        if item.get("coordinate_status") != "PENDING_HUMAN_REVIEW":
            errors.append(f"Coordinate status is not pending for {item.get('name')}.")
        if not isinstance(item.get("coordinate_candidates"), list):
            errors.append(f"Coordinate candidates must be a list for {item.get('name')}.")
    if errors:
        raise ValueError("Register validation failed: " + " ".join(errors))


def _coordinate_issue(candidates: list[dict[str, Any]], csv_row: dict[str, str] | None, check_row: dict[str, str] | None) -> str:
    descriptions: list[str] = []
    numeric = [candidate for candidate in candidates if candidate.get("latitude_raw") is not None]
    if not csv_row:
        descriptions.append("No coordinate row in site_targets.csv.")
    if len(numeric) > 1 and any(not _same_decimal(numeric[0], other) for other in numeric[1:]):
        sources = {"csv" if item["source_file"].endswith("site_targets.csv") else "workbook" for item in numeric}
        if sources == {"csv", "workbook"}:
            descriptions.append("CSV and workbook coordinate candidates differ; none is selected.")
        else:
            descriptions.append("Coordinate candidates differ between workbook sheets; none is selected.")
    if any(candidate.get("coordinate_text_raw") for candidate in candidates):
        descriptions.append("Workbook coordinate is retained as original text and has not been parsed or selected.")
    reference = (check_row or {}).get("F", "").strip()
    if reference:
        descriptions.append(f"Workbook Coordinate check records: {reference}")
    coordinate_refs = [candidate.get("coordinate_specific_source_reference") for candidate in candidates if candidate.get("coordinate_specific_source_reference")]
    if coordinate_refs:
        descriptions.append("A workbook coordinate source note is recorded; its linked citation and applicability still require verification and human approval.")
    else:
        descriptions.append("No direct, coordinate-specific source citation is recorded for the candidate coordinate(s).")
    return " ".join(descriptions) or "Coordinate provenance and approval remain unresolved."


def build_asset_inventory() -> dict[str, Any]:
    items: list[dict[str, Any]] = []
    manifest_records: dict[str, list[dict[str, str]]] = {}
    source_roots = [ROOT / "data" / name for name in ("earth", "moon", "mars", "manifests", "raw")]
    actual_by_basename: dict[str, list[str]] = {}
    for source_root in source_roots:
        for path in source_root.rglob("*"):
            if path.is_file():
                actual_by_basename.setdefault(path.name.casefold(), []).append(path.relative_to(ROOT).as_posix())
    manifest_files = [
        (ROOT / "data/manifests/core_target_data_manifest.csv", "official_nasa_source", "dataset_or_layer", "asset_type"),
        (ROOT / "data/manifests/download_manifest.csv", "official_source_url", "dataset", "coverage_note"),
    ]
    for manifest_path, url_field, label_field, notes_field in manifest_files:
        with manifest_path.open(encoding="utf-8-sig", newline="") as stream:
            for record in csv.DictReader(stream):
                local_path = record.get("local_file", "").replace("\\", "/").strip()
                if not local_path:
                    continue
                exact_exists = (ROOT / "data" / local_path).is_file()
                actual_key = f"data/{local_path}" if exact_exists else local_path
                path_match_status = "EXACT_PATH_MATCH" if exact_exists else "MANIFEST_PATH_DIFFERS_FROM_BUNDLE"
                if not exact_exists:
                    matching_paths = actual_by_basename.get(Path(local_path).name.casefold(), [])
                    if len(matching_paths) == 1:
                        actual_key = matching_paths[0]
                        path_match_status = "UNIQUE_BASENAME_MATCH_PATH_DIFFERS"
                manifest_records.setdefault(actual_key.removeprefix("data/"), []).append({
                    "manifest": manifest_path.relative_to(ROOT).as_posix(),
                    "url": record.get(url_field, ""),
                    "label": record.get(label_field, ""),
                    "notes": record.get(notes_field, ""),
                    "path_match_status": path_match_status,
                })
    for source_root in source_roots:
        for path in sorted(source_root.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(ROOT).as_posix()
            suffix = path.suffix.casefold()
            if suffix == ".hgt":
                asset_type = "quantitative_raster_candidate"
                usage = "Potential numeric SRTM terrain source; requires approved spatial extent, metadata/provenance, and QA before sampling."
            elif suffix in {".png", ".jpg", ".jpeg"}:
                asset_type = "rendered_image_or_browse_preview"
                usage = "Visual context only; do not sample image colors as measurements."
            elif suffix in {".xlsx"}:
                asset_type = "research_workbook_candidate"
                usage = "Research candidate; values require provenance review and human approval."
            elif suffix in {".csv"}:
                asset_type = "manifest_or_register_candidate"
                usage = "Input/reference metadata; register coordinates remain pending approval."
            elif suffix in {".xml", ".json", ".html", ".js", ".txt"}:
                asset_type = "catalog_or_documentation"
                usage = "Metadata/reference; not a quantitative measurement raster."
            else:
                asset_type = "unclassified"
                usage = "Review asset type before use."
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            source_refs = manifest_records.get(rel.removeprefix("data/"), [])
            item = {
                "path": rel,
                "bytes": path.stat().st_size,
                "sha256": digest,
                "asset_type": asset_type,
                "permitted_audit_use": usage,
                "source_references": source_refs,
                "source_reference_status": "RECORDED_IN_MANIFEST" if source_refs else "NOT_RECORDED_IN_SUPPLIED_MANIFESTS",
            }
            if suffix == ".hgt":
                expected_srtm1_bytes = 3601 * 3601 * 2
                item["format_size_check"] = {
                    "expected_bytes_for_srtm1_layout": expected_srtm1_bytes,
                    "matches_srtm1_layout_size": path.stat().st_size == expected_srtm1_bytes,
                    "product_format_reference": {
                        "citation": "NASA SRTM Collection User Guide, revised October 2015",
                        "url": SRTM_USER_GUIDE,
                        "supports": "SRTM1 tiles have 3,601 rows by 3,601 samples; HGT uses 2-byte signed integer samples.",
                    },
                    "limitation": "A matching byte count is only a format-size consistency check; it does not verify this file's dataset version, units, void-fill lineage, or download provenance.",
                }
            items.append(item)
    by_hash: dict[str, list[str]] = {}
    for item in items:
        by_hash.setdefault(item["sha256"], []).append(item["path"])
    duplicates = [
        {"sha256": digest, "paths": paths}
        for digest, paths in by_hash.items()
        if len(paths) > 1
    ]
    return {
        "schema_version": "0.1",
        "generated_by": "data/scripts/audit_inputs.py",
        "items": items,
        "duplicate_content_groups": duplicates,
    }


def _format_candidates(candidates: list[dict[str, Any]]) -> str:
    values = []
    for item in candidates:
        if item["source_file"].endswith("site_targets.csv"):
            value = f"({item.get('latitude_raw')}, {item.get('longitude_raw')})"
        elif item.get("coordinate_text_raw"):
            value = item["coordinate_text_raw"]
        else:
            value = f"({item.get('latitude_raw')}, {item.get('longitude_raw')})"
        label = item.get("sheet") or "CSV"
        row = item.get("row")
        record_name = item.get("record_name")
        location = f"{label}{' row ' + row if row else ''}{' (' + record_name + ')' if record_name else ''}"
        values.append(f"{location}: {value}")
    return "<br>".join(values) if values else "None supplied"


def build_markdown_report(register: dict[str, Any]) -> str:
    lines = [
        "# Coordinate Conflict Report",
        "",
        "**Status:** candidate register only; no coordinates are approved. All planned entries remain present. No spatial calculation or extraction was performed.",
        "",
        "The CSV primary-data column and workbook source/citation cells are retained as available references; they are not coordinate citations unless explicitly identified as such in the `coordinate_specific_source_reference` field.",
        "",
        "| Site or target | CSV coordinates | Workbook coordinates | Available source references | Conflict / decision required |",
        "|---|---|---|---|---|",
    ]
    for record in register["sites"] + register["targets"]:
        candidates = record["coordinate_candidates"]
        csv_candidates = [item for item in candidates if item["source_file"].endswith("site_targets.csv")]
        workbook_candidates = [item for item in candidates if item["source_file"].endswith(".xlsx")]
        refs = []
        for item in candidates:
            if item.get("coordinate_specific_source_reference"):
                refs.append(f"Coordinate check: {item['coordinate_specific_source_reference']}")
            if item.get("associated_source_reference"):
                refs.append(f"{item.get('sheet') or 'CSV'} associated reference: {item['associated_source_reference']}")
        refs_text = "<br>".join(refs) if refs else "No direct coordinate citation supplied"
        conflict = f"**{record['coordinate_issue_type']}** — {record['nature_of_conflict']} {record['human_decision_required']}"
        lines.append(
            f"| {record['name']} ({record['body']}) | {_format_candidates(csv_candidates)} | "
            f"{_format_candidates(workbook_candidates)} | {refs_text} | {conflict} |"
        )
    lines += [
        "",
        "## Required team decisions",
        "",
        "For each entry, approve or provide a coordinate with a coordinate-specific source citation and the geometry/buffer that represents the named site or target. Where candidates disagree, state which source and definition to use. Missing candidates must remain missing until approved; do not substitute zero or approximate coordinates.",
        "",
    ]
    return "\n".join(lines)


def build_conflict_report(register: dict[str, Any]) -> dict[str, Any]:
    entries = register["sites"] + register["targets"]
    return {
        "schema_version": "0.1",
        "report_status": "REVIEW_REQUIRED",
        "coordinate_policy": "Candidate values are preserved verbatim. No candidate is approved or selected.",
        "summary": {
            "planned_earth_sites": len(register["sites"]),
            "planned_planetary_targets": len(register["targets"]),
            "pending_human_review": sum(item["coordinate_status"] == "PENDING_HUMAN_REVIEW" for item in entries),
        },
        "entries": [
            {
                "id": item["id"],
                "name": item["name"],
                "body": item["body"],
                "csv_coordinates": [candidate for candidate in item["coordinate_candidates"] if candidate["source_file"].endswith("site_targets.csv")],
                "workbook_coordinates": [candidate for candidate in item["coordinate_candidates"] if candidate["source_file"].endswith(".xlsx")],
                "available_source_references": [
                    candidate.get("coordinate_specific_source_reference") or candidate.get("associated_source_reference")
                    for candidate in item["coordinate_candidates"]
                    if candidate.get("coordinate_specific_source_reference") or candidate.get("associated_source_reference")
                ],
                "coordinate_status": item["coordinate_status"],
                "coordinate_issue_type": item["coordinate_issue_type"],
                "nature_of_conflict": item["nature_of_conflict"],
                "human_decision_required": item["human_decision_required"],
            }
            for item in entries
        ],
    }


def build_coverage_report(register: dict[str, Any], asset_inventory: dict[str, Any]) -> dict[str, Any]:
    assets = asset_inventory["items"]
    counts: dict[str, int] = {}
    for item in assets:
        counts[item["asset_type"]] = counts.get(item["asset_type"], 0) + 1
    entries = register["sites"] + register["targets"]
    return {
        "schema_version": "0.1",
        "report_status": "INPUT_AVAILABILITY_ONLY_SCIENTIFIC_COVERAGE_NOT_COMPUTED",
        "register": {
            "planned_earth_sites": len(register["sites"]),
            "planned_planetary_targets": len(register["targets"]),
            "approved_coordinates": sum(item["approved_coordinates"] is not None for item in entries),
            "pending_human_coordinate_reviews": sum(item["coordinate_status"] == "PENDING_HUMAN_REVIEW" for item in entries),
        },
        "pipeline_outputs": {
            "validated_site_measurements": "NOT_COMPUTED",
            "validated_target_measurements": "NOT_COMPUTED",
            "reference_samples": "NOT_COMPUTED",
            "browser_ready_data_files": 0,
            "reason": "Coordinates, source/value provenance, and feature definitions require review; this audit did not run spatial processing.",
        },
        "supplied_asset_counts_by_audit_type": counts,
        "provenance_gaps": {
            "assets_without_manifest_source_reference": sum(not item["source_references"] for item in assets),
            "assets_matched_by_unique_basename_but_not_manifest_path": sum(
                any(ref.get("path_match_status") == "UNIQUE_BASENAME_MATCH_PATH_DIFFERS" for ref in item["source_references"])
                for item in assets
            ),
        },
        "scientific_feature_coverage": "NOT_ASSESSED",
        "scoring": "DEFERRED_PENDING_HUMAN_METHOD_APPROVAL",
    }


def main() -> int:
    INTERIM.mkdir(parents=True, exist_ok=True)
    register = build_register()
    validate_register(register)
    asset_inventory = build_asset_inventory()
    (INTERIM / "provisional_site_target_register.json").write_text(json.dumps(register, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (INTERIM / "coordinate_conflict_report.json").write_text(json.dumps(build_conflict_report(register), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (INTERIM / "source_asset_inventory.json").write_text(json.dumps(asset_inventory, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (INTERIM / "data_coverage_report.json").write_text(json.dumps(build_coverage_report(register, asset_inventory), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report_path = ROOT / "docs/P1_COORDINATE_CONFLICT_REPORT.md"
    report_path.write_text(build_markdown_report(register), encoding="utf-8")
    print(f"Wrote provisional register: {len(register['sites'])} sites, {len(register['targets'])} targets; all coordinates remain pending human review.")
    print(f"Wrote asset inventory for {len(asset_inventory['items'])} supplied data files.")
    print("Wrote data coverage report; scientific feature coverage remains not assessed.")
    print(f"Wrote human-readable conflict report: {report_path.relative_to(ROOT).as_posix()}")
    print("No spatial extraction, spatial calculation, scoring, or public-data export was performed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
