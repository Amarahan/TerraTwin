# 06 — NASA Data Resources

**Project:** TerraTwin — Planetary Analog Atlas  
**Authority:** `docs/OFFICIAL_DATA_RESOURCES_ROADMAP.md` (approved 2026-11-14)

---

## NASA Datasets

| # | Dataset Name | Provider | Product ID / Shortname | Role in TerraTwin | Portal URL |
|---|---|---|---|---|---|
| 1 | MODIS Land Surface Temperature (Day/Night) | NASA EOSDIS | MOD11A1 (Terra), MYD11A1 (Aqua) | Earth temperature contrast feature; diurnal range calculation | https://search.earthdata.nasa.gov/ |
| 2 | MODIS Vegetation Index (NDVI) | NASA EOSDIS | MOD13A2 | Earth vegetation/bareness feature | https://search.earthdata.nasa.gov/ |
| 3 | MODIS/Terra+Aqua MAIAC Land Aerosol Optical Depth | NASA EOSDIS | MCD19A2 | Earth aerosol/dust loading feature | https://search.earthdata.nasa.gov/ |
| 4 | SRTM Global 1 Arc-Second DEM | NASA EOSDIS | SRTMGL1 | Earth slope and surface roughness feature | https://search.earthdata.nasa.gov/ |
| 5 | GPM IMERG Final Precipitation | NASA EOSDIS | GPM_3IMERGDF V07 | Earth dryness/precipitation feature | https://search.earthdata.nasa.gov/ |
| 6 | LRO LOLA Lunar Polar DTM / GDR | NASA PDS / GSFC | LOLA GDR (Polar / Global) | Lunar slope and surface roughness target values | https://pds-geosciences.wustl.edu/missions/lro/ |
| 7 | LRO LROC NAC Imagery | NASA PDS / ASU | LROC NAC | Lunar contextual browse imagery on target cards | https://pds-geosciences.wustl.edu/missions/lro/ |
| 8 | LRO Diviner Lunar Radiometer | NASA PDS / UCLA | Diviner Polar GDR, Rock Abundance | Lunar temperature contrast, cold trap, rock abundance target values | https://pds-geosciences.wustl.edu/missions/lro/diviner.htm |
| 9 | MOLA Mars Global DEM (MEGDR) | NASA PDS / GSFC | MOLA MEGDR | Mars slope and surface roughness target values | https://pds.nasa.gov/ |
| 10 | MGS TES Surface Temperature | NASA PDS / ASU | TES Bolometric (Global Survey) | Mars surface temperature contrast target values | https://pds.nasa.gov/ |

---

## Partner Space Agency Datasets (Formally Approved)

Partner resources approved under NASA Space Apps Challenge 2026 policy (see `docs/OFFICIAL_DATA_RESOURCES_ROADMAP.md`):

| # | Dataset Name | Provider | Product / Mission | Role in TerraTwin | Portal URL |
|---|---|---|---|---|---|
| 11 | Copernicus DEM GLO-30 | ESA / Copernicus | COP-DEM GLO-30 | Earth slope/roughness reference (backup to SRTM) | https://dataspace.copernicus.eu/ |
| 12 | Sentinel-2 MSI Multispectral | ESA / Copernicus | Sentinel-2 L2A | Earth NDVI backup reference | https://dataspace.copernicus.eu/ |
| 13 | Sentinel-3 SLSTR Land Surface Temperature | ESA / Copernicus | Sentinel-3 SLSTR | Earth LST backup reference | https://dataspace.copernicus.eu/ |
| 14 | RADARSAT Constellation Mission (RCM) | CSA | RCM Open Data | Earth surface roughness SAR reference | https://donnees-data.asc-csa.gc.ca/en/dataset/rcm |
| 15 | RADARSAT-1 Open Data Archive | CSA | RADARSAT-1 | Historical SAR roughness reference | https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1 |
| 16 | GSMaP Global Precipitation | JAXA | GSMaP NRT / Standard | Earth precipitation backup reference | https://gportal.jaxa.jp/ |

---

## Eight-Feature ↔ Dataset Mapping

| Feature | Earth Sources | Moon Target Sources | Mars Target Sources |
|---|---|---|---|
| Slope | SRTMGL1 (NASA), COP-DEM GLO-30 (ESA) | LRO LOLA GDR (NASA PDS) | MOLA MEGDR (NASA PDS) |
| Surface Roughness | SRTMGL1 1 km std dev (NASA), CSA RADARSAT SAR | LRO LOLA 1 km roughness GDR (NASA PDS) | MOLA roughness grid (NASA PDS) |
| Temperature Contrast | MOD11A1/MYD11A1 (NASA), Sentinel-3 SLSTR (ESA) | LRO Diviner Polar GDR (NASA PDS) | MGS TES (NASA PDS) |
| Dryness / Precipitation | GPM IMERG Final V07 (NASA), JAXA GSMaP | Hyper-arid baseline (0 mm) | Hyper-arid baseline (0 mm) |
| Vegetation / Bareness (NDVI) | MOD13A2 (NASA), Sentinel-2 MSI (ESA) | Barren baseline (NDVI = 0.00) | Barren baseline (NDVI = 0.00) |
| Rock / Mineral Type | Geologic catalog references | USGS Unified Lunar Geologic Map, LRO Diviner Rock Abundance | CRISM global mosaics, USGS Mars Geologic Map (NASA PDS) |
| Water Ice / Permafrost | NSIDC/IPA Circum-Arctic Permafrost Map (NASA) | LRO Diviner cold traps, LEND polar hydrogen (NASA PDS) | SWIM, SHARAD (NASA PDS) |
| Dust / Aerosol (AOD) | MCD19A2 MAIAC AOD (NASA) | LADEE Exospheric Dust Context (NASA PDS) | MGS TES Dust Optical Depth (NASA PDS) |

---

> **Note:** All dataset values used in the exploratory model are candidate/provisional extractions. Source URLs listed above are discovery portals, not direct data download links. Actual data files are stored in `data/raw/` and `data/interim/` and are not served to site visitors.
