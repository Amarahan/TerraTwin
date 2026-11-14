# 11 — Public Links & Deployment

**Project:** TerraTwin — Planetary Analog Atlas  
**Date:** 2026-11-14 (Milestone 12)

---

## Verified Public URLs

| Resource | URL | Status |
|---|---|---|
| Live application | https://amarahan.github.io/TerraTwin/ | ✅ Live (HTTP 200 verified) |
| GitHub repository | https://github.com/Amarahan/TerraTwin | ✅ Public |
| GitHub Actions (CI/CD) | https://github.com/Amarahan/TerraTwin/actions | ✅ deploy.yml active |

---

## GitHub Pages Setup

The site is deployed automatically via GitHub Actions on every push to `main`.

**Workflow file:** `.github/workflows/deploy.yml`  
**Trigger:** `push` to `main` branch  
**Action:** `peaceiris/actions-gh-pages@v4`  
**Source:** `starter_app/dist/` (Vite production build output)  
**Base path:** `/TerraTwin/` (configured in `starter_app/vite.config.ts`)

### How it works
1. GitHub Actions runner installs Node.js dependencies (`npm ci` in `starter_app/`)
2. Runs `npm run build` → produces `starter_app/dist/`
3. `peaceiris/actions-gh-pages` pushes `dist/` contents to the `gh-pages` branch
4. GitHub Pages serves the `gh-pages` branch at `https://amarahan.github.io/TerraTwin/`

---

## How to Update the Live Site

```bash
# 1. Make your changes in starter_app/src/
# 2. Test locally (see Local Development Setup below)
# 3. Commit and push to main:
git add .
git commit -m "your change description"
git push origin main
# GitHub Actions will automatically rebuild and deploy to GitHub Pages.
# Allow 1-3 minutes for the deployment to propagate.
```

---

## Local Development Setup

```bash
# From the workspace root:
cd starter_app
npm install          # Install Node.js dependencies (uses package-lock.json)
npm run dev -- --host 127.0.0.1    # Dev server at http://127.0.0.1:8443/
```

The dev server uses `base: '/'` locally, automatically resolved by `vite.config.ts`.

---

## Running Tests

### TypeScript type check
```bash
cd starter_app
npx --no-install tsc --noEmit
# Expected: exit 0, no diagnostics
```

### Frontend unit tests (Node.js)
```bash
cd starter_app
node --test tests/exploratoryData.test.ts tests/workbookData.test.ts tests/scoring.test.ts tests/data.test.ts tests/mapData.test.ts
# Expected: 25 passed, 0 failed
```

### Production build
```bash
cd starter_app
npm run build
# Expected: exit 0, dist/ generated with /TerraTwin/ base path
```

### Python pipeline tests
```bash
# From workspace root:
python -m unittest discover -s data/tests -v
# Expected: 37 tests, 0 failures
```

---

## Data Pipeline Commands

```bash
# Generate exploratory model (48 site-target comparisons):
cd data/scripts
python build_exploratory_model.py
# Output: starter_app/public/data/exploratory_model.json

# Generate workbook evidence:
python publish_workbook_evidence.py
# Output: starter_app/public/data/workbook_evidence.json

# Run non-spatial readiness audit:
python nonspatial_readiness.py
# Output: data/interim/nonspatial_readiness.json
```

---

## Deployment Verification

After pushing to `main`, verify the deployment:

```powershell
# Check GitHub Pages HTTP status (PowerShell):
Invoke-WebRequest -Uri "https://amarahan.github.io/TerraTwin/" -Method Head -UseBasicParsing | Select-Object StatusCode
# Expected: StatusCode 200

# Or using curl:
curl -I https://amarahan.github.io/TerraTwin/
# Expected: HTTP/2 200
```

---

## Repository Structure (Key Paths)

```
TerraTwin_Team_Handoff/
├── .github/workflows/deploy.yml    ← GitHub Actions CI/CD
├── data/
│   ├── raw/                        ← Original source files (not served)
│   ├── interim/                    ← Pipeline intermediate outputs
│   ├── processed/                  ← Cleaned outputs
│   ├── scripts/                    ← Python pipeline scripts
│   └── tests/                      ← Python test suite
├── docs/                           ← Project documentation
├── starter_app/
│   ├── public/data/                ← Browser-ready JSON (served)
│   ├── public/images/              ← Browse images (served)
│   ├── src/                        ← React/TypeScript source
│   ├── tests/                      ← Node.js test suite
│   ├── dist/                       ← Production build output (gitignored)
│   └── vite.config.ts              ← Build configuration
└── submission/                     ← Submission documents (this folder)
```

---

## Important Notes

- `node_modules/` and `dist/` are gitignored — do not commit them.
- Raw NASA data files in `data/raw/` and large rasters (`*.hgt`) are gitignored.
- The `gh-pages` branch is managed entirely by GitHub Actions — do not push to it manually.
- All `.env` files, API keys, and credentials must remain out of Git history.
