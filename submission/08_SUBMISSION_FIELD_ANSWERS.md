# 08 — Submission Field Answers

**Project:** TerraTwin — Planetary Analog Atlas  
**Purpose:** Field-by-field guide for completing the NASA Space Apps 2026 submission form.

> **Legend:**  
> ✅ Ready to copy-paste  
> ⚠️ NEEDS TEAM CONFIRMATION — human team must fill this in  
> 📝 Placeholder — team fills with actual names/details

---

## Field Guide

### Project Name ✅
```
TerraTwin — Planetary Analog Atlas
```

### Tagline / Short Description ✅
```
An open, evidence-based web application that identifies Earth environments
mirroring the Moon and Mars for planetary analog research.
```

### Challenge ⚠️ NEEDS TEAM CONFIRMATION
```
[CONFIRM: Insert exact NASA Space Apps 2026 challenge title and URL here]
```
> The human team must look up the exact challenge name on the NASA Space Apps portal and confirm it before submitting. Do not guess or paraphrase the challenge title.

### Project Description (long form) ✅
> Copy from `02_PROJECT_SUMMARY.md`. Recommended text:

```
TerraTwin — Planetary Analog Atlas is an open, evidence-based web application
that identifies Earth environments whose physical characteristics most closely
resemble selected regions on the Moon and Mars. It addresses a core challenge
in planetary mission planning: finding accessible terrestrial sites where
hardware, suits, and crew procedures can be tested under conditions analogous
to target destinations.

The application compares 12 Earth analog candidate sites against four
planetary targets — Shackleton Crater Rim, Malapert Massif, Jezero Crater,
and Meridiani Planum — across eight scientific features derived from NASA,
ESA, JAXA, and CSA datasets: slope, surface roughness, temperature contrast,
dryness, vegetation/bareness, rock/mineral type, water ice/permafrost, and
dust/aerosol loading.

An exploratory similarity scoring model generates 48 site-target comparisons.
All results are explicitly labeled provisional and indicative, pending
coordinate confirmation and independent scientific validation. The application
prioritizes transparency: null values are preserved, every score is sourced,
and known limitations are prominently disclosed.
```

### Demo / Project URL ✅
```
https://amarahan.github.io/TerraTwin/
```

### Code / Repository URL ✅
```
https://github.com/Amarahan/TerraTwin
```

### Video URL ⚠️ NEEDS TEAM ACTION
```
[TEAM: Upload 30-second screen recording to YouTube or Vimeo after recording,
then insert the URL here. See 09_DEMO_STORYBOARD.md for scene-by-scene guide.]
```

### Team Name 📝
```
[TEAM: Insert your registered NASA Space Apps team name here]
```

### Team Members 📝
```
[TEAM: List all registered team members with their roles]
```

### Location / Country 📝
```
[TEAM: Insert team location as registered on NASA Space Apps]
```

### Technologies Used ✅
```
React 18, TypeScript (strict), Vite 8.3.8, Leaflet, Tailwind CSS,
Python 3, NASA Earthdata (MODIS LST, NDVI, MAIAC AOD, SRTM, GPM IMERG),
NASA PDS (LRO LOLA, LROC, Diviner, MOLA, TES),
ESA Copernicus (DEM GLO-30, Sentinel-2/3), JAXA GSMaP, CSA RADARSAT,
GitHub Actions, GitHub Pages
```

### How It Addresses the Challenge ✅
> Copy from `04_CHALLENGE_ALIGNMENT.md`. Short version:
```
TerraTwin applies NASA satellite data (MODIS, SRTM, GPM, LRO LOLA/Diviner,
MOLA, MGS TES) to systematically compare Earth analog sites against Moon and
Mars targets using a documented exploratory similarity model. The application
makes the methodology fully transparent — all results are labeled provisional,
null values are preserved, and limitations are prominently disclosed.
```

### AI / SI Tools Used ✅
> Copy from `05_AI_SI_DISCLOSURE.md`. Short version:
```
OpenAI Codex: Python data pipeline, scoring engine, TypeScript type contracts,
test suites (37 Python + 25 Node tests), layout corrections.

Google Antigravity (Gemini): React frontend implementation, GitHub Pages
deployment, map tile fix (CartoDB → OSM), Catalogue refinement, submission
document preparation.

All scientific decisions (feature weights, normalization, analog site selection,
target definitions) were made by the human team. AI tools assisted with
software implementation tasks only.
```

---

## Pre-Submission Checklist

Before clicking Submit, confirm all of the following:

- [ ] Challenge title confirmed and inserted in the form
- [ ] Team name and members match NASA Space Apps registration
- [ ] Demo URL resolves (test: https://amarahan.github.io/TerraTwin/)
- [ ] GitHub repo is public (test: https://github.com/Amarahan/TerraTwin)
- [ ] Video URL is live and accessible
- [ ] Project description reviewed for no invented numbers or unverified claims
- [ ] AI/SI disclosure is complete and accurate
- [ ] All team members agree on submission contents

---

> ⚠️ **DO NOT submit** until the human team has completed all ⚠️ items above.  
> Agents cannot access the submission portal, click buttons, or certify legal terms on behalf of the team.
