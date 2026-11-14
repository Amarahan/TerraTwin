# TerraTwin Team Handoff Pack

This folder is prepared for sharing with all team members.

## Read these first
1. `AGENTS.md` — mandatory coding-agent rules.
2. `docs/TerraTwin_Final_Development_Plan.md` — agreed project scope, responsibilities, Plan B, and delivery order.
3. `docs/DATA_PIPELINE_CONTRACT.md` — data schemas and scientific pipeline rules.
4. `prompts/README_PROMPT_ORDER.md` — how to use the prompts in order.

## AI tool strategy
- **Codex = backend/data owner** (Python pipeline, schemas, data validation, scoring engine, tests, provenance, integration).
- Codex is also the primary frontend implementer while available.
- **Plan B: Antigravity = frontend only** if the team's Codex usage/quota is exhausted. Antigravity must follow the same rules and consume Codex-owned contracts. It must not change scientific logic or data schemas.
- Never have Codex and Antigravity edit the same files at the same time.

## Included
- `starter_app/`: current React + Vite + TypeScript starter files.
- `data/`: curated supplied datasets and manifests, grouped by Moon, Mars, and Earth.
- `docs/`: final development plan and data pipeline contract.
- `prompts/`: ordered copy/paste prompts for the coding agents.
- `AGENTS.md`: persistent project rules.

## Important data note
This is a curated team handoff, not a claim that every full-resolution NASA dataset is included. Some files are browse images, preview layers, catalog records, or metadata. They must not be treated as quantitative source rasters unless their format and scientific meaning support that use. Read `data/manifests/README.txt` and `core_target_data_manifest.csv`.

## Setup
1. Extract the ZIP.
2. Open the extracted folder in VS Code / Codex / Antigravity.
3. Read `AGENTS.md`.
4. For the existing frontend starter, open `starter_app/` as the app project. Install dependencies with `npm install` only after reviewing the package and lockfile situation.
5. Keep raw data out of `public/`. Only small validated browser-ready JSON belongs in `public/data/`.
6. Never include `.env`, passwords, API keys, Earth Engine credentials, or personal account files in shared commits.

## Figma
Final design: https://www.figma.com/design/4NYVFlkUEmT3PCzYNPQqkK/Untitled?node-id=2-3
