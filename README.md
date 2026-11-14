# TerraTwin — Planetary Analog Atlas

> **An open, evidence-based web application that identifies Earth environments whose physical characteristics most closely resemble selected regions on the Moon and Mars.**

TerraTwin compares 12 Earth analog candidate sites against four planetary targets using 8 scientific features derived from NASA, ESA, JAXA, and CSA satellite datasets. It applies a transparent exploratory scoring methodology and displays all results with explicit uncertainty labeling.

**All results are exploratory and provisional. Coordinates are pending team review. No results have been independently peer-reviewed.**

---

## Live Demo

🌐 **[https://amarahan.github.io/TerraTwin/](https://amarahan.github.io/TerraTwin/)**

> *Add a screenshot here after recording the demo video.*  
> `docs/qa/desktop-targets.png` — existing QA screenshot available.

---

## NASA Space Apps Challenge 2026

> **Challenge:** ⚠️ NEEDS TEAM CONFIRMATION  
> **Team:** _(team name to be confirmed)_

This project was built for the NASA Space Apps Challenge 2026.

---

## Features

- **4 Planetary Targets** — Shackleton Crater Rim, Malapert Massif, Jezero Crater, Meridiani Planum
- **12 Earth Analog Sites** — spanning polar, arid, volcanic, and highland environments
- **8 Scientific Features** — slope, surface roughness, temperature contrast, dryness, vegetation/bareness (NDVI), rock/mineral type, water ice/permafrost, dust/aerosol (AOD)
- **48 Exploratory Comparisons** — all 12 Earth sites × 4 planetary targets
- **Interactive World Map** — OpenStreetMap basemap with 12 provisional candidate markers
- **Rankings Catalogue** — 12-site table with conic-gradient score badges
- **Site Details** — 8-feature comparison meters, workbook evidence, NASA browse imagery
- **Side-by-Side Compare** — any two sites against the active target
- **Full Methodology Transparency** — scoring formula, normalization tables, limitations, feature weights all documented
- **Scientific Honesty** — all scores labeled "Indicative — Provisional — Subject to Peer Review"; null values preserved as null; no data invented

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 18 + TypeScript (strict) |
| Build | Vite 8.3.8 |
| Map | Leaflet + OpenStreetMap |
| Styling | Tailwind CSS |
| Data pipeline | Python 3 |
| Deployment | GitHub Actions → GitHub Pages |

---

## Local Development

```bash
# Install dependencies and start dev server
cd starter_app
npm install
npm run dev -- --host 127.0.0.1
# Opens at http://127.0.0.1:8443/
```

---

## Data Pipeline

```bash
# Generate exploratory model (48 comparisons)
cd data/scripts
python build_exploratory_model.py
# → starter_app/public/data/exploratory_model.json

# Generate workbook evidence
python publish_workbook_evidence.py
# → starter_app/public/data/workbook_evidence.json
```

---

## Running Tests

### Python tests (37 tests)
```bash
# From repo root:
python -m unittest discover -s data/tests -v
# Expected: 37 tests, 0 failures
```

### TypeScript type check
```bash
cd starter_app
npx --no-install tsc --noEmit
# Expected: exit 0, no diagnostics
```

### Frontend unit tests (25 tests)
```bash
cd starter_app
node --test tests/exploratoryData.test.ts tests/workbookData.test.ts tests/scoring.test.ts tests/data.test.ts tests/mapData.test.ts
# Expected: 25 passed, 0 failed
```

### Production build
```bash
cd starter_app
npm run build
# Expected: exit 0
```

---

## NASA Datasets Used

| Dataset | Product | Role |
|---|---|---|
| MODIS LST | MOD11A1 / MYD11A1 | Earth temperature contrast |
| MODIS NDVI | MOD13A2 | Earth vegetation/bareness |
| MAIAC AOD | MCD19A2 | Earth aerosol/dust loading |
| SRTM DEM | SRTMGL1 | Earth slope and roughness |
| GPM IMERG | Final V07 | Earth precipitation/dryness |
| LRO LOLA | Polar GDR | Lunar slope and roughness |
| LRO Diviner | Polar GDR | Lunar temperature contrast |
| MOLA | MEGDR | Mars slope and roughness |
| MGS TES | Surface temperature | Mars temperature contrast |

Partner data (approved under NASA Space Apps partner provisions): ESA Copernicus DEM GLO-30, Sentinel-2/3; CSA RADARSAT; JAXA GSMaP.

---

## Scientific Disclaimer

> This application presents an **exploratory model only**. All site-target comparisons are provisional candidate extractions subject to independent peer review. Earth site coordinates are pending human team review (`PENDING_HUMAN_REVIEW`). No results are claimed as validated or scientifically authoritative. McMurdo's missing NDVI value is preserved as null and not coerced to zero.

---

## Repository Structure

```
├── .github/workflows/deploy.yml   ← GitHub Actions CI/CD
├── data/
│   ├── raw/                       ← Source data (not served)
│   ├── interim/                   ← Pipeline intermediates
│   ├── scripts/                   ← Python pipeline
│   └── tests/                     ← Python test suite
├── docs/                          ← Project documentation
├── starter_app/
│   ├── public/data/               ← Browser-ready JSON
│   ├── src/                       ← React/TypeScript source
│   └── tests/                     ← Node.js test suite
└── submission/                    ← Submission documents
```

---

## AI Tools Used

This project used **OpenAI Codex** (Python pipeline, scoring engine, tests, TypeScript contracts) and **Google Antigravity / Gemini** (frontend implementation, GitHub Pages deployment, submission preparation) under the direction of the human team. All scientific decisions were made by the human team. See [`submission/05_AI_SI_DISCLOSURE.md`](submission/05_AI_SI_DISCLOSURE.md).

---

## License & Credits

- Application code: see individual file headers
- OpenStreetMap tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL)
- NASA imagery: public domain (NASA/JPL/PDS)
- React (MIT), Vite (MIT), TypeScript (Apache-2.0), Leaflet (BSD-2), Tailwind CSS (MIT)

See [`submission/07_OTHER_RESOURCES_CREDITS_LICENSES.md`](submission/07_OTHER_RESOURCES_CREDITS_LICENSES.md) for full credits.
