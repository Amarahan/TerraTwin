# TerraTwin local MVP progress

Updated 2026-11-14. Git/GitHub work is postponed by team decision. No repository was initialized or published.

## Milestone 1 — installation and app inspection (complete)
- Existing app: `starter_app/`, React + Vite + TypeScript + Leaflet.
- Clean locked installation succeeded; native Windows x64 Rolldown binding loads.
- Vite dev server: `npm run dev -- --host 127.0.0.1`, URL `http://127.0.0.1:8443/`.
- Browser opened the original app successfully.
- Figma link could not be accessed; only `design/FIGMA_REFERENCE.md` is bundled. Existing app design is the working reference, not a claim of final Figma fidelity.
- `.figma/make/site.json` remains absent. Existing title fallback retained; no Figma export fabricated.

## Milestone 2 — functional pending-data interface (implemented; QA in progress)
- Preserved existing header, navy/cyan palette, hero, cards and responsive design direction.
- Removed illustrative measurements, scores, rankings, arbitrary weight presets and unresolved markers from production UI.
- Added generated display JSON from the provisional register and supplied source inventory: 12 Earth sites, 4 targets, 8 feature concepts, null coordinates/measurements/scores.
- Target selectors, all site entries, search/category filters, shared active site, details, Fit/Mission/Limits/Sources sections, two-site availability comparison, methodology and NASA candidate source links implemented.
- Leaflet reference map supports pan/zoom/reset. No location markers or heatmaps; all coordinates remain pending. It intentionally uses a reference graticule without an unverified basemap.
- Loading, failed fetch, invalid data and retry states implemented. Browser loader rejects unsupported non-null scientific data in this pending-only contract.
- Hash navigation supports back/forward and page reload. Selection is session state; reloading resets the active site/target to the first register entry.

## Files changed or added
- `starter_app/src/App.tsx`: data loading, navigation and shared selection state.
- `starter_app/src/Shell.tsx`: extracted/adapted existing navigation, hero and design components.
- `starter_app/src/views.tsx`: target/catalogue/detail/compare/method screens.
- `starter_app/src/WorldMap.tsx`: Leaflet reference map with honest pending placement.
- `starter_app/src/data.ts`: pending-display contract and runtime validation.
- `starter_app/src/mvp.css`: responsive extensions to existing stylesheet.
- `starter_app/scripts/export_pending_data.py`: reproducible display export; no spatial processing/scoring.
- `starter_app/public/data/atlas.json`: generated browser data.
- `starter_app/tests/data.test.ts`: scientific integrity and malformed-data regression tests.
- `docs/PROJECT_PROGRESS.md`: this checkpoint.

## Checks so far
- `npx --no-install tsc --noEmit`: passed after initial implementation.
- Browser: dashboard and four-target page rendered. A CSS class collision with the existing Mars hero decoration was found and corrected.
- Remaining milestone: final build, data tests, Python tests, complete desktop/mobile browser QA and console check.

## Missing data / human decisions
- All approved coordinates and geometry/buffers remain null and PENDING_HUMAN_REVIEW.
- Scientific measurements, target values, final feature definitions/units, normalization, weights, categorical policies, missing-data rules and reference validation need approval.
- HGT product version and provenance remain UNVERIFIED. Numeric extraction is blocked for unresolved locations.
- Supplied source inventory includes non-NASA candidates; eligibility and suitability need approval before use. Links are clearly candidate references, not validated coverage.
- Figma exports/access are needed to certify visual fidelity; this does not block independent development.
- The older `data/interim/nonspatial_readiness.json` still records the PDF as absent. The Markdown readiness report supersedes that field after the local PDF inspection; this UI does not display the stale field. Updating the audit generator is a separate data-maintenance task.

## Exact next task
Complete browser QA at 1440px and 390px: all four target selectors, all twelve site selections, category/search empty state, detail tabs, comparison, method/source links, map controls, navigation and errors. Then run final checks and append exact results here.
