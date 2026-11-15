# TerraTwin — Scientific Approval Blockers & Human Decisions Log

**Document status:** Persistent Scientific Tracking Record  
**Last updated:** 2026-11-15  
**Governing rule:** AGENTS.md § 2, § 6, § 7, § 13

---

## 1. Scope & Purpose

Under the TerraTwin instruction contract (`AGENTS.md`), autonomous AI agents are strictly forbidden from fabricating scientific approvals, guessing geodetic coordinates, coercing missing measurements to zero, or silently altering feature weights.

This document logs all scientific items that remain in a **provisional, pending-validation, or candidate state**, detailing the exact human scientific decisions required before any future version can claim peer-reviewed authority.

---

## 2. Active Scientific Approval Blockers

### Blocker 1: Official Geodetic Coordinate Register Approval
- **Current State:** The 12 candidate sites in `candidateData.ts` and `data/interim/provisional_site_target_register.json` contain working coordinates derived from the project workbook and regional surveys.
- **Why It Is Blocked:** Several sites (notably Twin Taung, Letpadaung, and McMurdo Dry Valleys) have slight coordinate variances between different source publications (e.g. crater rim vs. central lake vs. mining concession).
- **Required Human Action:** The science team must formally approve the bounding box or point centroid and buffer radius for each of the 12 candidate sites.
- **Current Mitigation in App:** Coordinates are displayed with `Geographic placement pending human review` notices. The Leaflet map does not render authoritative pin markers.

### Blocker 2: NASA-Only vs. Multi-Agency Data Provider Policy
- **Current State:** The repository includes candidate measurements from NASA (MODIS LST, MODIS NDVI, MAIAC AOD, SRTM DEM, LOLA, MOLA, TES, Diviner), but also references ESA (Copernicus DEM GLO-30), ECMWF (ERA5-Land), UCSB (CHIRPS), and regional geological literature.
- **Why It Is Blocked:** The supplied challenge README specifies a NASA-only dataset preference, while the expanded scientific workbook includes international partner datasets.
- **Required Human Action:** Formal written confirmation from the team that international partner datasets are permitted under Space Apps partner provisions.
- **Current Mitigation in App:** Every non-NASA value is explicitly badged with its external source citation in the Workbook Evidence panel.

### Blocker 3: Lithology / Mineral Category Similarity Matrix
- **Current State:** Rock and mineral similarity uses a 5-group related lithology classification:
  - Group 1: `basalt`, `anorthosite`, `gabbro`, `volcanic_mafic`
  - Group 2: `sandstone`, `siltstone`, `mudstone`, `sedimentary_clastic`
  - Group 3: `evaporite`, `carbonate`, `gypsum`, `halite`, `sedimentary_chemical`
  - Group 4: `granite`, `rhyolite`, `felsic_igneous`
  - Group 5: `impact_breccia`, `regolith_breccia`, `impactite`
- **Why It Is Blocked:** A full petrological distance metric requires peer-reviewed spectral library matching rather than a 5-bucket heuristic.
- **Required Human Action:** Planetary geologists on the team must ratify whether partial similarity (0.50) is valid across these categories.
- **Current Mitigation in App:** Clearly disclosed as a heuristic classification model on the `#about` Method page.

### Blocker 4: Subsurface Cryosphere & Ice Index Encoding
- **Current State:** Ground ice is encoded as a [0.0–1.0] index based on continuous vs. localized permafrost literature estimates.
- **Why It Is Blocked:** True volumetric ice content cannot be simplified into a scalar without depth-resolved radar sounder data (e.g. SHARAD or MARSIS).
- **Required Human Action:** Review of cryosphere normalization bounds.
- **Current Mitigation in App:** Identified as a model assumption in `Reading` and `candidateData.ts`.

---

## 3. Mandatory Judging Disclosures

When presenting TerraTwin to the Space Apps Challenge judging panel, the team must explicitly disclose:
1. TerraTwin is an **exploratory modeling prototype**, not an operational landing-site selection system.
2. Composite match scores are **provisional indicative metrics** illustrating multi-feature similarity under documented assumptions.
3. Missing values (such as Antarctic winter NDVI) are **strictly preserved as null** and penalize coverage rather than being zero-filled.
4. The Mission Objective Simulator allows judges to inspect how changing operational priorities alters candidate rankings, demonstrating algorithmic transparency.
