# Changelog — DhanPedia

All notable changes to this project. Dates use ISO (YYYY-MM-DD).

## [0.1.0] — 2026-08-06
### Added
- Project skeleton: Astro + TypeScript + MDX + React + Tailwind v4 + Pagefind.
- Core financial calculation library (`src/lib/finance`) — CAGR, XIRR, IRR,
  SIP/EMI/FD, inflation, retirement, P2P expected loss, bond price/duration,
  fee drag, currency & rental scenarios.
- Content registry: `articles.json`, `books.json`, `sources.json`,
  `instruments.json`, `update-log.json`.
- Source registry seeded with verified primary/secondary Indian financial
  facts (tax slabs, 80C/ELSS, SGB status, SCSS, NPS 2025 exit rules,
  RBI P2P Directions 2025, repo, deposit insurance).
- Project docs: README, AGENTS, PROJECT_PLAN, DECISIONS, RESEARCH_POLICY,
  CONTENT_STYLE_GUIDE, CONTRIBUTING, LICENSE, SECURITY.
- Resumability state: `progress/STATUS.md`, `progress/TASKS.json`.

### Not yet done (planned)
- Design system, layout, home/category/article/calculator/book/glossary pages.
- Article prose library (all 17 categories).
- React calculator islands + unit tests.
- Book generation pipeline (MD/TEXT/TTS/HTML/PDF/EPUB) + catalogue.
- Search index, link validator, GitHub Actions CI/CD.
