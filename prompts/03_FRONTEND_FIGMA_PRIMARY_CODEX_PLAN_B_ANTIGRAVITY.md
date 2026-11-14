# Prompt 03 — Frontend Implementation (Codex primary; Antigravity Plan B)

Read `AGENTS.md`, the final development plan, and the data pipeline contract.

Final Figma:
https://www.figma.com/design/4NYVFlkUEmT3PCzYNPQqkK/Untitled?node-id=2-3

This prompt is for the frontend owner:
- Primary: Codex, if the team still has Codex usage available.
- Plan B: Antigravity, only if Codex usage/quota is exhausted.

Implement the existing React + Vite + TypeScript application to match the final approved Figma design. Do not create a replacement app or generic dashboard.

Connect the UI to the Codex-owned data contracts and scoring module. Do not hardcode scientific measurements, scores, ranks, percentiles, weights, validation results, confidence, or source details inside components.

Implement the approved product functionality as supported by available validated data:
1. Moon/Mars target selector for Shackleton, Malapert, Jezero, and Meridiani.
2. Interactive Earth analog map with 12 approved sites and meaningful group distinctions.
3. Ranked site list synchronized with map selection.
4. Site details with Fit, Mission, Limits, and Sources.
5. Eight feature comparisons with value, unit, source, status, and confidence.
6. Missing-data and insufficient-coverage states.
7. Weight controls/presets only if the scoring method and presets have been approved.
8. Internal reference-check display only when real reproducible results exist.
9. NASA Trek links/layers where service configuration is valid.
10. About/Method content that reflects the implemented scientific method.
11. Responsive layout and accessible controls.

Design requirements:
- Match Figma frames, components, typography, colours, spacing, imagery, and responsive behaviour.
- Reuse current project components and dependencies.
- Do not invent or substitute scientific images.
- Every interactive control must work.
- Include loading, empty, and error states.
- Keep mobile usability at 390 px.

IMPORTANT PLAN B RULES FOR ANTIGRAVITY:
- You are frontend-only. Edit only the frontend files explicitly assigned by the team (normally `src/` and approved UI assets).
- Do not edit Python scripts, data processing, scientific formulas, normalization, weights, data schemas, reference samples, validation thresholds, or source manifests.
- Consume the existing JSON/API contracts exactly as documented.
- If a frontend need requires a schema or backend change, stop and report the required contract change to the Codex/backend owner or human team.
- Do not run concurrently with Codex on the same files.

After implementation, list files changed and report which interactions were actually tested.