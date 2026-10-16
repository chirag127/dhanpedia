# PROJECT_PLAN — DhanPedia

Master plan. Phases integrate continuously; status is tracked in
`progress/STATUS.md` and the task registry in `progress/TASKS.json`.

## Phase 1 — Discovery & architecture
- Inspect environment, toolchain, remote; verify dependency versions. ✅
- Finalize architecture (Astro + TS + MDX + React + Tailwind + Pagefind). ✅
- Define category taxonomy + registry schemas. ✅
- Seed source registry with verified primary/secondary facts. ✅
- **Deliverable:** reproducible skeleton + documented plan. ✅ (in progress)

## Phase 2 — Design system & core site
- Editorial design system (light/dark tokens).
- BaseLayout (nav, footer, reading modes, TOC, progress bar).
- Home, Topics index, Category pages, Article template, Calculators, Books,
  Glossary, About/Editorial Policy.
- SEO (sitemap, robots, OG), accessibility foundations.

## Phase 3 — Content production
- Complete article inventory (target: substantive, distinct; minimum 600 planned).
- Research + draft across ALL major avenues; validate citations + metadata.
- Dedup + quality checks; publish verified articles incrementally.

## Phase 4 — Calculators & visualizations
- Shared calculation library (CAGR, XIRR, SIP, EMI, FD, inflation,
  retirement, P2P expected loss, bond price/duration). ✅ (engine written)
- Accessible React calculator islands + unit tests.
- Charts with textual/alt fallbacks.

## Phase 5 — Books & publishing
- Markdown / plain-text / TTS / HTML / PDF / EPUB export pipeline.
- Book catalogue + article-level downloads (no broken links).
- Validate generated outputs.

## Phase 6 — Search, QA & deployment
- Pagefind + sitemap.
- Vitest unit + integration; Playwright e2e; link check; a11y baseline.
- GitHub Actions CI/CD; deploy to GitHub Pages under `/dhanpedia`.
- Final build + honest STATUS + final report.

## Personal-goal deliverable
- A dedicated article: **"Wealth Plan for a ₹23 Lakh Portfolio"** —
  high-return, informed-risk allocation with honest loss scenarios.
- A personal-finance book from reviewed articles.

## Content target
Minimum **600 distinct articles** (plan ≈690 across 17 categories). Count is
unique articles, not duplicates. Quality gate: no repetitive/fabricated filler;
shortfall is documented in STATUS rather than padded.
