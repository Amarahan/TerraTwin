# 04 — Challenge Alignment

**Project:** TerraTwin — Planetary Analog Atlas  
**Challenge:** ⚠️ **NEEDS TEAM CONFIRMATION** — Challenge title and URL must be confirmed by the human team before submission.  
**Competition:** NASA Space Apps Challenge 2026

---

> ⚠️ **STOP — Human Action Required**  
> The challenge title is not confirmed. The team must verify the exact challenge name and URL on the NASA Space Apps 2026 submission portal before completing this section. Do not submit with a placeholder challenge title.

---

## How TerraTwin Addresses the Challenge

### Problem Statement
Planetary mission planning — from hardware testing to crew training — requires terrestrial sites that accurately replicate the physical environment of target destinations on the Moon and Mars. Identifying suitable analog sites is traditionally manual, slow, and difficult to replicate or audit.

### TerraTwin's Response
TerraTwin provides a transparent, data-driven web tool that systematically compares Earth analog candidate sites to lunar and Martian targets using publicly accessible NASA satellite data. The application:

1. **Uses NASA data as primary source:** MODIS LST (temperature), MODIS NDVI (vegetation/bareness), MAIAC AOD (aerosol/dust), SRTM (elevation/slope), GPM IMERG (precipitation), LRO LOLA (lunar slope/roughness), LRO Diviner (lunar temperature), MOLA MEGDR (Mars slope/roughness), MGS TES (Mars temperature), and LRO LROC (lunar imagery).

2. **Applies a reproducible scoring methodology:** The exploratory model uses a documented similarity formula (`score = 100 × Σ(wᵢ × similarityᵢ)`) with transparent normalization ranges, feature weights, and a 75% coverage gate. The method is fully documented in the application's Method tab and in source code.

3. **Prioritizes scientific honesty:** All results are labeled "Indicative — Provisional — Subject to Peer Review." Missing values are preserved as null. Known limitations are prominently disclosed. No result is overstated.

4. **Makes results accessible and auditable:** The live web application at https://amarahan.github.io/TerraTwin/ allows anyone to explore all 48 site-target comparisons with per-feature evidence. The source code at https://github.com/Amarahan/TerraTwin is fully public and reproducible.

5. **Covers both Moon and Mars targets:** Shackleton Crater Rim and Malapert Massif (Artemis-era lunar south pole) and Jezero Crater and Meridiani Planum (Mars exploration heritage sites).

---

## NASA Data Usage Summary

| Dataset | NASA Product | Role |
|---|---|---|
| MODIS LST | MOD11A1 / MYD11A1 | Earth surface temperature contrast |
| MODIS NDVI | MOD13A2 | Earth vegetation/bareness index |
| MAIAC AOD | MCD19A2 | Earth aerosol/dust loading |
| SRTM | SRTMGL1 | Earth slope and roughness |
| GPM IMERG | Final V07 | Earth precipitation/dryness |
| LRO LOLA | Polar DTM GDR | Lunar slope and roughness |
| LRO Diviner | Polar GDR | Lunar temperature contrast and cold traps |
| LRO LROC | NAC imagery | Lunar contextual browse imagery |
| MOLA MEGDR | Global DEM | Mars slope and roughness |
| MGS TES | Surface temperature | Mars temperature contrast |

---

## Partner Space Agency Data

Formally approved under NASA Space Apps Challenge 2026 partner provisions:
- **ESA Copernicus:** DEM GLO-30, Sentinel-2 (NDVI backup), Sentinel-3 SLSTR (LST backup)
- **CSA RADARSAT:** Surface roughness reference
- **JAXA G-Portal / GSMaP:** Precipitation backup

---

## Alignment Summary

TerraTwin demonstrates how open NASA satellite data can be systematically applied to the planetary analog site identification problem, with reproducible methodology, honest uncertainty disclosure, and an accessible public interface — directly serving the mission-planning and scientific transparency goals of the NASA Space Apps Challenge.

---

> ⚠️ **Team action required:** Insert exact challenge title and submission URL before finalizing this document.
