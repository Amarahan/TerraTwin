# Prompt 00 — Project, Figma, and Dataset Audit (Codex)

You are the technical lead for TerraTwin — Planetary Analog Atlas.

Before coding, read `AGENTS.md`, `docs/TerraTwin_Final_Development_Plan.md`, and `docs/DATA_PIPELINE_CONTRACT.md`.

Final Figma design:
https://www.figma.com/design/4NYVFlkUEmT3PCzYNPQqkK/Untitled?node-id=2-3

Inspect the entire repository, current React/Vite/TypeScript starter, package dependencies, all supplied datasets, manifests, NASA Trek JSON/XML/HTML files, Earth HGT files, and Excel workbooks.

Do not start major implementation yet.

Report:
1. Existing app architecture and build commands.
2. Complete dataset inventory by Moon, Mars, Earth, and research workbook.
3. Which assets are quantitative source data versus browse images, previews, metadata, or catalog files.
4. WMTS endpoints, projections, layer names, and limitations.
5. Data gaps, coordinate conflicts, duplicated files, and source/units gaps.
6. What can be computed from the supplied data now and what requires additional approved source data.
7. Proposed backend/data pipeline modules and frontend integration points.
8. Files you intend to change in each later phase.

Do not invent measurements or resolve scientific conflicts yourself. Flag decisions for the human team. Preserve the existing application and final Figma design. Wait for approval before major changes.