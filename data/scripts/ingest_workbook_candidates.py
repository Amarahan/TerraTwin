"""Ingest supplied XLSX values with provenance; no spatial/scoring operations.

Run: python data/scripts/ingest_workbook_candidates.py [--check]
Outputs are review-only candidates, deliberately incompatible with public data.
"""
from __future__ import annotations

import argparse
from collections import Counter
import hashlib
from io import BytesIO
import json
import math
from pathlib import Path
import posixpath
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
WORKBOOKS = (
    "data/raw/mee_lay_master_project_data(1).xlsx",
    "data/raw/mee_lay_complete_analog_data_expanded.xlsx",
)
REGISTER = "data/interim/provisional_site_target_register.json"
OUTPUT = ROOT / "data/interim/workbook_candidates"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
# Source column names, not a new scientific feature definition or normalization.
HEADERS = dict(zip("ABCDEFGHIJKLMN", (
    "name", "group", "lat", "lon", "slope_deg", "roughness_m", "elev_m",
    "lst_day_K", "lst_night_K", "lst_range_K", "ndvi", "aod_055",
    "rain_era5_mm", "rain_chirps_mm",
)))


def name_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


def read_workbook(content: bytes) -> dict:
    """Keep cell type, original stored value, formula and cached result separately."""
    with zipfile.ZipFile(BytesIO(content)) as archive:
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared = ["".join(t.text or "" for t in item.findall(".//m:t", NS))
                      for item in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("m:si", NS)]
        relationships = {r.attrib["Id"]: r for r in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        sheets = {}
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).findall("m:sheets/m:sheet", NS):
            title = sheet.attrib["name"]
            if title in sheets:
                raise ValueError(f"Duplicate worksheet: {title}")
            rel = relationships[sheet.attrib[f"{{{NS['r']}}}id"]]
            if rel.attrib.get("TargetMode") == "External":
                raise ValueError(f"External worksheet is unsupported: {title}")
            target = rel.attrib["Target"]
            member = posixpath.normpath(target.lstrip("/") if target.startswith("/") else "xl/" + target)
            if not member.startswith("xl/"):
                raise ValueError(f"Worksheet outside XLSX namespace: {member}")
            cells = {}
            for cell in ET.fromstring(archive.read(member)).findall("m:sheetData/m:row/m:c", NS):
                ref = cell.attrib["r"]
                if ref in cells:
                    raise ValueError(f"Duplicate cell: {title}!{ref}")
                typ = cell.attrib.get("t", "n")
                raw = cell.findtext("m:v", default=None, namespaces=NS)
                value = raw
                if typ == "s":
                    if raw is None or int(raw) < 0:
                        raise ValueError(f"Invalid shared-string reference: {title}!{ref}")
                    value = shared[int(raw)]
                elif typ == "inlineStr":
                    value = "".join(t.text or "" for t in cell.findall("m:is//m:t", NS))
                formula = cell.find("m:f", NS)
                cells[ref] = {"cell_type": typ, "stored_value": raw, "text": value,
                              "formula": None if formula is None else {"text": formula.text, "attributes": formula.attrib}}
            sheets[title] = {"archive_member": member, "cells": cells}
        return sheets


def parse_number(cell: dict | None) -> float | None:
    if cell is None or cell["text"] in (None, ""):
        return None
    if cell["cell_type"] not in ("n",):
        raise ValueError(f"Expected numeric cell, found {cell['cell_type']}: {cell['text']!r}")
    value = float(cell["text"])
    if not math.isfinite(value):
        raise ValueError("Non-finite candidate value")
    return value


def extract_earth(sheets: dict, register: dict, source: dict) -> list[dict]:
    sites = register["sites"]
    if len(sites) != 12 or len({s["id"] for s in sites}) != 12:
        raise ValueError("Provisional register must retain 12 unique Earth sites")
    if Counter(s["group"] for s in sites) != {"Featured": 4, "Benchmark": 5, "Control": 3}:
        raise ValueError("Provisional register categories changed")
    aliases = {}
    for site in sites:
        names = [site["name"]] + [c["record_name"] for c in site["coordinate_candidates"]
                                  if c.get("source_file") == source["path"] and c.get("record_name")]
        for name in names:
            key = name_key(name)
            if key in aliases and aliases[key]["id"] != site["id"]:
                raise ValueError(f"Ambiguous site alias: {name}")
            aliases[key] = site
    cells = sheets["Site data"]["cells"]
    for col, label in HEADERS.items():
        if cells.get(col + "4", {}).get("text") != label:
            raise ValueError(f"Source column changed: Site data!{col}4 expected {label}")
    # Summary/formula rows begin at 18 in this supplied workbook version.
    # Fail if the contiguous input table grows, shrinks or is reordered into an unknown site.
    if cells.get("A17", {}).get("text") not in (None, ""):
        raise ValueError("Unexpected additional source row at Site data!A17")
    result = []
    seen = set()
    for row in range(5, 17):
        raw_name = cells.get(f"A{row}", {}).get("text") or ""
        site = aliases.get(name_key(raw_name))
        if site is None or site["id"] in seen:
            raise ValueError(f"Missing, unknown or duplicate Earth row: Site data!A{row}: {raw_name}")
        seen.add(site["id"])
        if cells.get(f"B{row}", {}).get("text") != site["group"]:
            raise ValueError(f"Source category disagrees with register: {raw_name}")
        variables = {}
        for col, label in HEADERS.items():
            if col in "ABCD":
                continue
            cell_ref = f"{col}{row}"
            cell = cells.get(cell_ref)
            value = parse_number(cell)
            variables[label] = {
                "candidate_value": value, "status": "MISSING" if value is None else "PENDING_REVIEW",
                "eligible_for_scoring": False,
                "source": {**source, "sheet": "Site data", "cell": cell_ref, "header_cell": col + "4"},
                "original_cell": cell,
            }
        result.append({"id": site["id"], "name": site["name"], "group": site["group"],
                       "body": "Earth", "source_name": raw_name,
                       "approved_coordinates": site["approved_coordinates"],
                       "coordinate_status": site["coordinate_status"],
                       "coordinate_candidate_cells": {col + str(row): cells.get(col + str(row)) for col in "CD"},
                       "variables": variables})
    return result


def build(root: Path = ROOT) -> dict[str, dict]:
    register_bytes = (root / REGISTER).read_bytes()
    register = json.loads(register_bytes)
    all_records = register["sites"] + register["targets"]
    if len(register["targets"]) != 4 or len({r["id"] for r in all_records}) != 16:
        raise ValueError("Register must preserve all 16 unique locations")
    if any(r["approved_coordinates"] is not None or r["coordinate_status"] != "PENDING_HUMAN_REVIEW" for r in all_records):
        raise ValueError("Register approval state changed; review candidate ingestion contract")
    books = []
    for path in WORKBOOKS:
        content = (root / path).read_bytes()
        books.append({"path": path, "sha256": hashlib.sha256(content).hexdigest(),
                      "bytes": len(content), "sheets": read_workbook(content)})
    master = books[0]
    source = {"path": master["path"], "sha256": master["sha256"]}
    earth = extract_earth(master["sheets"], register, source)
    metadata = {"schema_version": "workbook-candidates-v1", "processing_version": "1.0.0",
                "register_path": REGISTER, "register_sha256": hashlib.sha256(register_bytes).hexdigest(),
                "eligible_for_scoring": False,
                "operation": "Lossless workbook cell transcription and finite numeric parsing only; no spatial extraction, QA correction, normalization or scoring.",
                "warnings": ["Workbook claims require scientific verification; file hashes establish local lineage only.",
                             "Formula cells retain cached results and are not recalculated.",
                             "Coordinates and original extraction provenance remain under review.",
                             "Referenced mee_lay_earth_features.csv and its originating extraction script must be recovered or reproduced."]}
    return {
        "workbook_cells.json": {**metadata, "workbooks": books},
        "earth_candidates.json": {**metadata,
            "source_statement": master["sheets"]["Site data"]["cells"].get("A1"),
            "sites": earth,
            "targets": [{"id": t["id"], "name": t["name"], "body": t["body"],
                         "approved_coordinates": None, "coordinate_status": t["coordinate_status"],
                         "status": "PENDING_REVIEW", "score": None} for t in register["targets"]]},
    }


def serialize(value: dict) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check that existing outputs match current source bytes; write nothing")
    args = parser.parse_args()
    try:
        outputs = build()
        encoded = {name: serialize(value) for name, value in outputs.items()}
        # Fixed generated directory avoids ever accepting an input/public output path.
        if OUTPUT.resolve() != ROOT / "data/interim/workbook_candidates":
            raise ValueError("Output directory resolves outside the designated generated directory")
        if args.check:
            for name, content in encoded.items():
                if not (OUTPUT / name).is_file() or (OUTPUT / name).read_text(encoding="utf-8") != content:
                    raise ValueError(f"Missing or stale generated output: {name}")
        else:
            OUTPUT.mkdir(parents=True, exist_ok=True)
            for name, content in encoded.items():
                temp = OUTPUT / (name + ".tmp")
                temp.write_text(content, encoding="utf-8")
                temp.replace(OUTPUT / name)
        print(f"{'Verified' if args.check else 'Imported'} 2 workbooks; 12 Earth candidates; 4 targets retained; outputs: {OUTPUT.relative_to(ROOT)}")
        print("Candidates remain pending review. No scientific scores or spatial extraction performed.")
        return 0
    except (ValueError, KeyError, OSError, zipfile.BadZipFile, ET.ParseError, IndexError) as error:
        print(f"Candidate ingestion failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
