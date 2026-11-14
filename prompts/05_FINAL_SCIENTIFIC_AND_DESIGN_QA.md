# Prompt 05 — Final Scientific, Design, and Mobile QA (Codex + human review)

Perform a final review without redesigning the approved Figma interface.

SCIENTIFIC QA:
- every displayed measurement has a valid source, unit, date/range, and status;
- previews are not misrepresented as quantitative rasters;
- target/site coordinates and geometries match the approved register;
- units, scale factors, QA masks, and processing scale are documented;
- normalization and scoring match the frozen method;
- null values are never treated as zero;
- coverage and confidence are visible;
- reference checks are reproducible and correctly labelled internal checks;
- limitations are clear and no mission claim exceeds the evidence.

DESIGN/UX QA:
- compare the running app with the final Figma frames;
- verify typography, colour, spacing, hierarchy, map, cards, navigation, and imagery;
- test desktop, tablet, and 390 px mobile;
- test keyboard focus, labels, touch targets, and readable text;
- ensure every button, tab, filter, and link works;
- ensure charts use real data and visibly handle missing values.

TECHNICAL QA:
- run Python tests;
- run TypeScript checks if configured;
- run `npm run build`;
- inspect browser console and network errors;
- check broken images and invalid WMTS/API requests.

Do not hide failing checks, fabricate missing data, or alter thresholds to force a pass. Provide a final issue list with severity and file references.