# 07 — Other Resources, Credits & Licenses

**Project:** TerraTwin — Planetary Analog Atlas  
**Date:** 2026-11-14

---

## Open-Source Libraries

| Library | License | Version Used | Role |
|---|---|---|---|
| React | MIT | 18.x | UI component framework |
| Vite | MIT | 8.3.8 | Build tool and development server |
| TypeScript | Apache-2.0 | (strict mode) | Type-safe JavaScript superset |
| Leaflet | BSD-2-Clause | — | Interactive map rendering |
| React-Leaflet | Hippocratic License 2.1 | — | React bindings for Leaflet |
| Tailwind CSS | MIT | — | Utility-first CSS framework |
| python-pptx | MIT | 1.0.2 | PPTX generation for submission slides |

---

## Map Data & Tiles

| Resource | License | Usage |
|---|---|---|
| OpenStreetMap tile layer (`tile.openstreetmap.org`) | ODbL (Open Database License) | Basemap tiles in the Explore tab world map. Attribution: "© OpenStreetMap contributors" |
| OpenStreetMap data | ODbL | Underlying geographic data for OSM tiles |

**OpenStreetMap attribution** (required by ODbL):  
© [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

---

## NASA Browse Imagery

Browse images used in target cards and site detail panels are sourced from NASA and NASA partner archives. Each is labeled **"Browse image — contextual only, not a quantitative measurement."**

NASA imagery is in the public domain unless otherwise noted. Source archives:
- NASA Planetary Data System (PDS): https://pds.nasa.gov/
- LRO/LROC image archive: https://pds.lroc.asu.edu/
- NASA Earthdata Worldview: https://worldview.earthdata.nasa.gov/

No NASA logos, mission insignia, or official seals are used in AI-generated slides or application UI.

---

## Fonts & Icons

| Resource | License | Usage |
|---|---|---|
| System UI font stack | N/A — system fonts | Body and interface text |
| (No external icon library bundled) | — | Icons implemented as inline SVG or CSS |

---

## Python Runtime Dependencies

| Package | License | Role |
|---|---|---|
| pypdf | BSD-2-Clause | PDF parsing in nonspatial readiness tests |
| python-pptx | MIT | Submission PPTX generation |

---

## Credits

**Human Team:**  
The TerraTwin project was conceived, scientifically directed, and owned by the student/researcher team participating in NASA Space Apps Challenge 2026. All scientific decisions — feature definitions, normalization ranges, feature weights, analog site selection, and target definitions — were made by the human team.

**AI Tools:**  
OpenAI Codex and Google Antigravity (Gemini) assisted with software implementation under the direction of the human team. See `05_AI_SI_DISCLOSURE.md` for full disclosure.

---

## Disclaimer

TerraTwin is a research prototype produced for the NASA Space Apps Challenge. It is not an official NASA product. Scientific results are exploratory and provisional. All data are sourced from publicly accessible archives with appropriate attribution.
