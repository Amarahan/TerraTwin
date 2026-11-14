# TerraTwin — Final Team Development Plan
**NASA Space Apps Challenge 2026 | Team handoff pack | Updated 13 November 2026**

## 1. Product goal
Build **TerraTwin — Planetary Analog Atlas**, an evidence-based interactive research prototype that compares selected Earth environments with Moon and Mars target regions. The product must show not only similarity but also uncertainty, source provenance, and the limits of Earth analogs.

**Priority order**
1. Correct, traceable data.
2. Reproducible processing and scoring.
3. Functional interactions and consistent application state.
4. Evidence, uncertainty, and limitations.
5. Faithful implementation of the approved Figma design.
6. Deployment and mobile QA.

## 2. Source-of-truth references
- Final Figma: https://www.figma.com/design/4NYVFlkUEmT3PCzYNPQqkK/Untitled?node-id=2-3
- `AGENTS.md`: mandatory rules for every coding agent.
- `DATA_PIPELINE_CONTRACT.md`: schemas, pipeline, and validation rules.
- `data/manifests/`: dataset inventory and target manifests.
- Existing `starter_app/`: current React/Vite/TypeScript starting point.

Do not assume an earlier screenshot or an old prototype overrides the final Figma file.

## 3. Confirmed project scope
### Planetary targets
- Shackleton Crater Rim — Moon
- Malapert Massif — Moon
- Jezero Crater — Mars
- Meridiani Planum — Mars

### Earth analog sites
**Featured:** Twin Taung Maar Crater (Myanmar); Letpadaung / Monywa Copper Area (Myanmar); Mount Popa / Central Dry Zone (Myanmar); Kawah Ijen (Indonesia).

**Benchmark:** Atacama Desert (Chile); Haughton Crater (Canada); McMurdo Dry Valleys (Antarctica); Death Valley (USA); Lonar Crater (India).

**Control:** Amazon Rainforest (Brazil); Congo Basin (Africa); Irrawaddy Delta (Myanmar).

The site list and coordinates must be checked against `site_targets.csv`, the approved team register, and the actual dataset coverage. Existing app values and planning documents contain coordinate differences. Do not silently pick one. Ask the team to approve the canonical coordinate/geometry before running site-wide extraction.

## 4. Scientific features
The approved comparison concept contains eight features:
1. Slope
2. Surface roughness
3. Temperature contrast (be precise: day–night LST contrast is not seasonal temperature range)
4. Dryness
5. Vegetation / bareness
6. Rock and mineral type
7. Water ice / permafrost
8. Dust and wind / aerosol proxy

Use the exact final feature labels and scientific definitions confirmed by the team. Do not mix the older Figma prototype labels (such as thermal inertia, albedo, rock abundance, or geologic diversity) with the eight-feature scientific contract unless the team approves a mapping.

## 5. Data currently included in this handoff
The ZIP includes:
- Existing React/Vite/TypeScript starter application.
- Moon Trek polar layer catalog, LOLA/LROC metadata and Shackleton/Malapert preview layers.
- Mars Trek layer catalog, MOLA hillshade/roughness, TES dust/dust index, CTX and HiRISE preview layers, and WMTS capabilities.
- Earth SRTM HGT tiles for `N36W117` and `S24W070`.
- NASA/LP DAAC browse images and selected Earth analog imagery for Atacama, Death Valley, and Haughton.
- Existing Excel research workbooks.
- Dataset inventory, target manifest, download manifest, and site target register.

**Important limitations:** some included images are browse/preview products, not quantitative raster inputs. A preview image must not be sampled as though it were the original elevation, slope, dust, or mineral raster. The README and manifests describe which items are preview/reference files. The package does not claim to contain every global raw scientific dataset; some NASA collections require separate regional downloads or authenticated Earthdata access.

## 6. Eight-feature data contract
Every feature value should carry:
- value (or `null`);
- unit;
- source/dataset ID and citation/URL;
- band or variable;
- date range;
- native resolution and analysis scale;
- processing/QA method;
- confidence tier;
- status: measured, published, estimated, pending review, or missing;
- limitations.

Never turn missing values into zero. Never show a composite score when the agreed minimum coverage is not met. Display feature coverage with every score.

## 7. Scoring method — approval gate
Proposed formula:
`score = 100 × Σ(weightᵢ × similarityᵢ)`

For normalized numeric features:
`similarityᵢ = 1 − |Earthᵢ − Targetᵢ|`

Rock/mineral similarity uses a human-approved category similarity matrix. Ice/permafrost encoding must be source-supported and team-approved.

Before coding the final score, the team must freeze:
- normalization ranges and direction;
- Moon and Mars weights;
- rock/mineral similarity matrix;
- ice/permafrost encoding;
- missing-data policy and minimum coverage;
- percentile/tie handling;
- internal validation thresholds and reference sampling method.

Weights must be finite, non-negative, and sum to 1.00. No agent may tune values or thresholds to force a desired result. Python and TypeScript results must match on shared fixtures.

## 8. Internal reference checks
If implemented, label the checks **Internal reference-set checks**, not independent scientific validation. Use a fixed seed and documented sampling method, land mask, processing scale, feature coverage, and scoring configuration. Show sample size and Pass/Fail/Not computed. A failed check must remain visible.

## 9. Locked delivery priorities
### Must-have
- Target selector updates all relevant views.
- Twelve Earth sites appear with approved coordinates and categories.
- Map and ranked list select the same active site.
- Site details: Fit, Mission, Limits, Sources.
- Source and confidence/status shown for every scientific value.
- Missing values render as “No data”.
- Internal reference checks show real results or “Not computed”.
- About/Method explains sources, formulas, assumptions, weights, missing-data policy, and limitations.
- Limits vs Mission Reality clearly separates what Earth can rehearse, partly rehearse, and cannot reproduce.
- Featured-site insights are explicitly labelled “Hypothesis to test”, with evidence and caveats.
- Approved Figma design is preserved and mobile responsive.
- README, deployment, and AI-tool disclosure are ready.

### Should-have (only after Must-have is complete)
- Weight sliders and approved presets.
- Instrument-test badges derived from evidence, labelled as estimates.
- Myanmar heatmap only if it is genuinely computed from valid inputs and clearly labelled.

### Could-have
- Two-site comparison.
- Printable report.
- Novelty score only if a defensible method is documented.

### Do not build for this submission unless explicitly approved
- User accounts, chatbot, fabricated live feeds, fake telemetry, or unnecessary 3D globe.
- Do not add a traditional backend server just for architecture appearance; use the simplest approved architecture.

## 10. AI tools and team workflow
### Primary plan
**Codex owns backend/data work:**
- audit existing project and datasets;
- design and implement Python ingestion/processing/QA pipeline;
- create and validate data schemas and compact JSON outputs;
- implement scoring logic and reproducible tests;
- document provenance, assumptions, limitations, and API/data contracts;
- perform integration checks and builds.

**Codex also handles frontend when usage is available:**
- implement React components to match Figma;
- connect UI to Codex-owned data contracts;
- test interactions, responsive layouts, and error states.

### Plan B — if Codex usage/quota runs out
Use **Antigravity for frontend only**:
1. Do not rewrite or migrate the backend.
2. Keep Codex-produced Python pipeline, scoring method, tests, JSON schemas, and data contracts as the source of truth.
3. Give Antigravity the same `AGENTS.md`, this plan, `DATA_PIPELINE_CONTRACT.md`, final Figma link, and the relevant frontend prompt.
4. Antigravity may edit only assigned frontend files (normally `src/` and approved UI assets).
5. Antigravity must consume existing JSON/API contracts. It must not change scientific calculations, normalization, weights, data schemas, Python pipeline, source metadata, reference samples, or validation thresholds.
6. If a frontend requirement needs a backend/schema change, stop and ask the Codex/backend owner or human team to update the contract first.
7. Never let Codex and Antigravity edit the same files concurrently. Use one owner per file.
8. Run the same tests and `npm run build` after Antigravity changes. Review the diff before merging.

### Suggested file ownership
| Area | Owner |
|---|---|
| `data/scripts/`, `data/processed/`, pipeline tests | Codex |
| scoring method, schema, `DATA_PIPELINE_CONTRACT.md` | Codex + human approval |
| `public/data/` generated outputs | Codex pipeline only |
| `src/` frontend | Codex primary; Antigravity Plan B |
| `AGENTS.md`, plan, feature weights, scientific decisions | Human team approves |

## 11. Development sequence
1. P0 — Audit repository, Figma, and all supplied data. No major coding until audit findings and conflicts are reported.
2. P1 — Backend/data pipeline and provenance.
3. P2 — Scoring engine, reference checks, and tests.
4. P3 — Frontend implementation against final Figma (Codex; Antigravity only under Plan B).
5. P4 — Integration and functional QA.
6. P5 — Final scientific, design, accessibility, mobile, and build QA.
7. P6 — Deployment, README, presentation/demo readiness, and submission checklist.

## 12. Stop and ask the team
Stop if coordinates conflict, a source/band/unit is missing, Figma differs from a requested change, the scoring method is incomplete, a dataset cannot support the requested calculation, or an official competition rule changes what is permitted.

**Final principle:** build what the data supports, make uncertainty visible, and keep the final Figma design intact.
