# Frontend installation and build verification

Verified on 2026-11-14 in the existing `starter_app/` application.

## Installation

- Command: `npm ci --prefer-offline --no-audit --no-fund`
- Result: exit code 0; npm reported `added 47 packages in 12s`.
- Runtime: Windows x64, Node.js v24.19.0.
- Installation recreated `starter_app/node_modules` from the existing lockfile.
- No dependency declarations or locked versions were changed.

SHA-256 hashes matched their pre-install values:

| File | SHA-256 |
| --- | --- |
| `starter_app/package.json` | `e77896c55917ff4465e8d567ec01ee6c81d099c6323841ce67706cf573bf16bb` |
| `starter_app/package-lock.json` | `7f655fd5f73a920bb4d2a9af431f49b5f3da74ccae3f0272a1666998b182f90c` |

## Verification results

| Check | Result |
| --- | --- |
| Direct Node require of `@rolldown/binding-win32-x64-msvc` | Passed; version 1.2.19 loaded, exposing 80 exports |
| `npm run build` | Passed, exit 0; Vite 8.3.8 transformed 18 modules and emitted `starter_app/dist/` |
| `npx --no-install tsc --noEmit` | Passed, exit 0, no diagnostics |

The previous native binding load failure did not recur after this clean installation. The precise cause of the earlier invalid installed binary was not independently established.

## Figma configuration

`starter_app/.figma/make/site.json` remains absent. The Vite configuration already checks whether that file exists and uses only a TerraTwin document-title fallback when absent. This behavior built successfully. No Figma file was fabricated, and no application source or design changes were made during this verification.

Vite emitted a non-blocking warning about `__dirname` support in a future major version's native configuration loader. The current production build passes with the locked Vite version; no version or configuration change was needed for this check.

## Scope

This verifies dependency loading, TypeScript compilation, and production bundling. It does not establish browser behavior, responsive design, scientific validity, or MVP readiness. No spatial extraction, coordinate approval, or scoring was performed; source datasets were not modified. A vulnerability audit was not run (`--no-audit` was requested).
