# Explore and Catalogue — final QA

Verified 14 November 2026 against the final local source. This record supersedes earlier layout and scoring-display claims in Milestones 8–10. The scientific pipeline is not declared complete.

## Ownership and recovery

Codex owns `starter_app/src/`, `starter_app/tests/`, Python processing/tests and these QA documents. Antigravity handles deployment only; any necessary `vite.config.ts` change must be coordinated with Codex.

Before editing, inspected the actual source, Git status/history/stashes, plan, contract, register and policy. The previous layout changes had been removed; App, WorldMap and views matched the committed implementation, and the new marker tests/helper were absent. No recoverable stash or workspace backup was found. Reconstructed targeted fixes against current files instead of checking out an older revision.

Verified ZIP backup: `C:\Users\Asus\.codex\visualizations\2026\11\14\01a1d7e6-e416-7080-b7a1-29da61536fb4\terratwin-backups\workspace-20261114-201217.zip`. It contains 166 files / 61,529,380 original bytes, including all project data, source, tests, design references, docs and configuration. ZIP CRC check passed. Each file has SHA-256 in BACKUP_MANIFEST.json. Dependencies, generated build, Git internals, caches and environment files were excluded; the ZIP is outside the repository.

## Latest Antigravity data checked

Ran `git fetch origin` after the team's data-only update request. Local HEAD and origin/main both resolve to `235224cc96b2e93b4cae34670c84fe0fb6097d09`. No newer source/data commit was available. Latest candidateData commit is `fdab8ae`; candidate values have not been replaced. Its sole change here is correcting an unsupported approval comment.

`git diff origin/main -- data starter_app/public/data starter_app/public/images` is empty. The deployed `origin/gh-pages:data/atlas.json` and `origin/main:starter_app/public/data/atlas.json` have the same Git blob ID: `5a51f0ebf6dd22eaa27977133c543beb4a9d8d1c`. Thus no data import or whole-branch merge was necessary. No UI rollback, push, deployment change or source reset was performed. The two original HGT files remain local and intact (they are excluded from Git).

## Explore corrections

Root cause: `.atlas-explorer` had `align-items:start` and only a minimum height, so long side-panel content stretched the page. The centre was sticky inside an overflow-hidden shell but its map had a fixed 570px height. Scrolling the page left a large empty centre below that finite map.

Desktop now uses a viewport-height shell with automatic header/status rows and a `minmax(0,1fr)` workspace. The three columns stretch within that bounded height, with `min-height:0` at the nested boundaries. The left list scrolls beneath persistent target/search/category controls; the right details panel scrolls independently and retains sticky tabs. The centre uses a flex column with a growing Leaflet viewport and a separate selection status. ResizeObserver calls invalidateSize without unnecessary panning.

Global Candidate Map, counts, Focus Myanmar, Fit All Sites and Reset View now occupy a compact toolbar ABOVE the Leaflet viewport. OSM URL and attribution remain intact. Zoom and attribution are the standard Leaflet controls. Tile failures have an explicit message and Retry tiles action. At 390px, the workspace stacks with a bounded site list and a 500px map section (the geographic viewport itself exceeds 300px).

Search/category filtering is shared between list and map counts. All twelve site selections update details and selection status. Map navigation presets describe browsing regions, not approved site geometry.

Removed the duplicated CandidateFeatureTable and compact feature-value list. Fit has one eight-feature comparison using the canonical atlas, with honest missing/pending states. Fit, Mission, Limits and Sources remain. Sources explains provenance and approval gaps. Existing associated browse images remain; unsupported quantitative/resolution captions were replaced with browse-only wording. All 26 public browse images match original project image files by SHA-256.

## Catalogue corrections

Preserved one existing primary results structure, dark navy/cyan palette, image/category tiles and Inspect actions. Added a single aligned target/category/search row, consistent columns/separators, mobile cards, and stable register numbers through filtering. Controls preserve all 12 records: 4 Featured, 5 Benchmark, 3 Control. Search combines name, region/country and existing provisional geological description. A label incorrectly wrapping multiple filter buttons was replaced with a named group to give each button its proper accessible name.

Scores render neutral unavailable rings, with no strength band or score-based sorting. Register order is explicitly not ranking. Existing geological context is labelled provisional, with source verification pending. All four targets share application state and all twelve Inspect actions open the correct site.

Figma URL was attempted again but could not be accessed. `design/` contains the reference link, not exported frames or ranking screenshots. The supplied written layout brief and current visual direction were followed. Exact pixel fidelity to Figma remains UNVERIFIED and is not claimed.

## Scientific integrity

The pending canonical atlas/register and `data/input/scoring_policy.pending.json` remain authoritative. All 16 coordinates remain null/PENDING_HUMAN_REVIEW. The UI does not read candidate coordinate constants or candidate normalized measurements for production markers, feature values, scores, coverage or rankings. No null-to-zero replacement, 8/8 coverage claim, arbitrary score band or live calculation remains in views.

Marker functionality is retained behind an explicit approved-position check. Fit All Sites is disabled with an explanation while there are zero approved coordinates. Actual study-site marker placement is intentionally withheld, not reported as a missing implementation. An isolated synthetic fixture exercises marker click, keyboard selection, list synchronization, filtering and bounds. That fixture is under tests, is never imported by the application, and its text is absent from the production JavaScript bundle.

No scientific formulas, weights, categorical assumptions, thresholds or original values were changed. Existing scoring engine tests prove implementation behavior only; they do not approve the unratified policy or validate scientific comparisons. The candidate module's old statement claiming human approval has been corrected to match the team's explicit decision.

## Final commands and results

Commands run from project root unless stated otherwise. No dependencies were reinstalled.

| Command / check | Final result |
|---|---|
| `python -m unittest discover -s data/tests -v` | 27 passed; 0 failed; includes PDF/HGT/manifest, register, ingestion and scoring fixture checks |
| `node --experimental-strip-types --test tests/*.test.ts` (starter_app) | 16 passed; 0 failed |
| `npx tsc --noEmit` (starter_app) | Exit 0; no errors |
| `npm run build` (starter_app) | Exit 0; Vite 8.3.8; 25 modules; final build 1.23s |
| `node tests/browser-smoke.mjs <playwright-package>` (starter_app) | 12 groups passed; 0 failed; no runtime exceptions |
| `node tests/layout-smoke.mjs <playwright-package>` (starter_app) | 12 groups passed; 0 failed; no runtime exceptions |
| Data/reference comparison with backup | 81 files unchanged; 0 missing/modified |
| Public browse-image hash trace | 26/26 match project originals |
| `git diff --check` | No whitespace errors (Git emitted normal LF/CRLF notices) |

Existing Playwright package used: `C:/Users/Asus/AppData/Local/OpenAI/Codex/runtimes/cua_node/bfa21d187eb00b05/bin/node_modules/playwright`. Browser was installed Edge, using an isolated headless profile and authorized network access. App URL: http://127.0.0.1:8443/.

The final layout run recorded 101 successful live OSM tile responses. Tests waited for loaded images and fonts, checked that toolbar/map rectangles do not overlap, used mouse-wheel scrolling in both side panels, and required unchanged map bounds plus no page scroll. Viewports: 1440×900, 1280×720, 390×844. Mobile card and map widths remain inside the viewport. Existing smoke tests additionally cover all six navigation sections, target/body filters, all site selectors, detail tabs, eight features, sources/methodology, comparison selectors, invalid atlas JSON, HTTP 503 and retry recovery.

Intermediate failures were investigated and corrected: category button accessible naming; test inspection of a Leaflet pane transform instead of actual requested zoom tiles; missing Vite React refresh bootstrap/query-string handling in the isolated fixture; and a font-load timing shift before layout measurement. No assertions were skipped to pass. Final results above apply to current files, not the overwritten earlier revision.

Console notes: the deliberate atlas HTTP 503 and tile-abort fixtures produce expected resource errors. The isolated intercepted marker page also reports an Edge local-network HMR WebSocket restriction; it does not affect production application interactions, and no JavaScript exception occurs. The normal application smoke suite logged only the intentional HTTP 503. Existing Vite config emits a future `configLoader: native` / `__dirname` warning; deployment-owned configuration was left unchanged.

Machine-readable evidence: [layout results](qa/final-layout/results.json), [existing smoke results](qa/browser-smoke-results.json), [data/image integrity](qa/final-layout/integrity.json), [tested file hashes](qa/final-layout/tested-files.json).

## Screenshots

- [Explore 1440×900 initial](qa/final-layout/explore-1440-initial.png)
- [Explore 1440×900 with both panels scrolled](qa/final-layout/explore-1440-scrolled.png)
- [Explore 1280×720 initial](qa/final-layout/explore-1280-initial.png)
- [Explore 1280×720 scrolled](qa/final-layout/explore-1280-scrolled.png)
- [Catalogue desktop](qa/final-layout/catalogue-desktop.png)
- [Catalogue filtered to Atacama](qa/final-layout/catalogue-filtered.png)
- [Catalogue 1280×720](qa/final-layout/catalogue-1280.png)
- [Mobile Explore](qa/final-layout/explore-mobile.png)
- [Mobile Catalogue top](qa/final-layout/catalogue-mobile.png)
- [Mobile Catalogue final records](qa/final-layout/catalogue-mobile-last.png)

Screenshots were inspected for map visibility, panel boundaries, readable cards and overflow. These are local captures, not deployed-site certification.

## Remaining decisions and exact next task

No known blocking layout/runtime bug remains in the tested scope. UI refinement is ready for deployment handoff. Scientific completion still needs an approved register with geometry/buffers, measurement/source eligibility and provenance, comparable target values, and the complete scoring/missing-data/reference policy. Exact Figma acceptance requires accessible frames/exports. Live map tiles require network access, with retry available on failure.

Next: Antigravity deploys this exact tested local revision without resetting source files, then verify the deployed URL's navigation, assets, atlas JSON and map tiles. Codex retains sole source/test ownership. No live scores or unapproved markers should be re-enabled as a deployment workaround.
