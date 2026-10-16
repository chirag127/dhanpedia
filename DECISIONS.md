# DECISIONS — DhanPedia

Settled questions. Record new decisions here instead of revisiting.

| # | Decision | Rationale |
|---|---|---|
| D01 | Static-first architecture (Astro, no backend) | Core articles, search, calculators, downloads must work on free GitHub Pages. |
| D02 | GitHub Pages at project site `/dhanpedia` | Owner has a personal repo; project-site base path is correct, not root. |
| D03 | React islands only where interactivity requires them | Keeps default pages near-zero JS; calculators/viz are the islands. |
| D04 | Local, deterministic calculator library | No paid APIs; unit-testable; reproducible; no silent division/overflow. |
| D05 | Citations via `content-registry/sources.json` spine | Prevents fabricated sources; traceable; auditable. |
| D06 | Pagefind for search | Static, no server, fast; covers titles, bodies, glossary, books, calculators. |
| D07 | License: **MIT (code) + CC BY 4.0 (original content)** | Separates software from prose; third-party data kept out of redistribution unless free. |
| D08 | No user accounts / no sensitive data collection | Privacy + static hosting; calculators are client-side. |
| D09 | PDF/EPUB via a build-time pipeline; validate outputs before deploy | "No broken download links" is a hard acceptance criterion. |
| D10 | Two tax regimes documented, not a single "best" | FY 2025-26 default is the new regime; old regime only wins with large deductions. |
| D11 | Time-sensitive facts carry `lastVerified` + `update-log.json` | Avoids stale "currently available" claims (e.g. SGB, rates). |

## Open / flagged
- **Live URL** is not yet verified (Pages settings are owner-side). Recorded in STATUS.
- **Repo 5.25%** rate and **SCSS 8.2%** are verified against late-2025 sources; re-verify each quarter.
