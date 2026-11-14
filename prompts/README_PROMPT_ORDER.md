# Prompt sequence — use one at a time

Paste these prompts into the coding agent in order. Do not send all prompts as one message.

| Order | File | Owner | Purpose |
|---|---|---|---|
| P0 | `00_PROJECT_AUDIT.md` | Codex | Inspect repo, Figma, datasets; no major code yet |
| P1 | `01_BACKEND_DATA_PIPELINE.md` | Codex | Python pipeline, provenance, schemas, data outputs |
| P2 | `02_SCORING_ENGINE.md` | Codex | Approved scientific scoring + Python/TypeScript tests |
| P3 | `03_FRONTEND_FIGMA_PRIMARY_CODEX_PLAN_B_ANTIGRAVITY.md` | Codex primary; Antigravity fallback | Build the frontend against Figma and data contracts |
| P4 | `04_INTEGRATION_AND_FUNCTIONAL_QA.md` | Codex | Integrate and test end-to-end |
| P5 | `05_FINAL_SCIENTIFIC_AND_DESIGN_QA.md` | Codex + human team | Final science, design, accessibility, mobile QA |
| P6 | `06_DEPLOYMENT_AND_HANDOFF.md` | Codex | Deploy, document, prepare team handoff |

## Important
- Always give the agent `AGENTS.md`, the final plan, and the data pipeline contract.
- Codex owns backend/data/scoring. Do not move these responsibilities to Antigravity.
- Antigravity is the Plan B frontend-only tool if Codex usage/quota is exhausted.
- Only one agent may edit a file at a time.
- Stop for human approval when coordinates, scientific parameters, or data sources conflict.
