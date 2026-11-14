# Prompt 02 — Scientific Scoring Engine (Codex)

Read `AGENTS.md` and the data pipeline contract.

Implement the TerraTwin scoring engine only after the human team has approved:
- the exact eight feature definitions and normalization ranges;
- Moon and Mars target weights;
- rock/mineral category similarity matrix;
- ice/permafrost encoding;
- missing-data policy and minimum feature coverage;
- reference sample and percentile rules.

Proposed score:
`score = 100 × Σ(weight_i × similarity_i)`

For normalized numeric features:
`similarity_i = 1 − abs(earth_i − target_i)`

Rock/mineral similarity uses the approved category matrix. Ice/permafrost similarity uses only source-supported approved encodings.

Requirements:
1. Implement a pure TypeScript scoring module for the browser.
2. Implement the equivalent Python calculation for reproducibility.
3. Use shared test fixtures so both implementations return matching results.
4. Reject invalid weights; weights must be finite, non-negative, and sum to 1.00 within a documented tolerance.
5. Never coerce null to zero.
6. Never silently re-normalize weights over only the available features.
7. If the approved minimum coverage is not met, return a null/unavailable composite score with a reason.
8. Return feature-level similarities, data coverage, and provenance references.
9. Add tests for boundaries, missing values, invalid weights, categories, and a hand-calculated example.

Do not tune weights or thresholds after seeing rankings. Do not call internal reference-set checks independent scientific validation. If the team has not approved any required scientific parameter, stop and request it instead of guessing.