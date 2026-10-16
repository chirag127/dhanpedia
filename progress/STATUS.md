# DhanPedia — Progress

Last updated: **2026-10-16** (content push: derivatives article + Budget-2026 fact fixes)

## State

- **Articles:** 21 on disk / registered (derivatives category now filled: `derivatives-fno-retail-realities`, ~3,590 words).
- **Books:** 4 × 6 formats (PDF/EPUB/MD/HTML/TXT/TTS) → `public/downloads/`.
- **Sources:** 20 in `sources.json` (added `src-budget-2026-sgb-tax`, `src-lrs-tcs-sc-2026`, `src-irdai-moratorium-2026`, `src-sebi-fo-fy26`, `src-et-fo-retail-exodus`, `src-toi-big-boys`).
- **Update-log:** 11 tracked time-sensitive claims.

## This session (verified 2026-10-16 via web research)

### New article
- [x] `src/content/derivatives/derivatives-fno-retail-realities.mdx` — "Why 9 in 10 Lose — and When Hedging Actually Works." SEBI 5-year retail F&O loss table, negative-sum options structure, hedging decision framework, F&O tax treatment, and where F&O fits a ₹10L portfolio. Registered in `articles.json`, added to `book-complete-indian-investor` (now 10 chapters), 3 sources + 3 update-log entries added.

### Stale-fact fixes (Budget 2026 / IRDAI / SEBI, all cross-checked)
- [x] **SGB tax change** — Budget 2026 (eff. 1 Apr 2026) limited the SGB maturity redemption CGT exemption to *original subscribers*; secondary-market buyers are now slab-taxed on both pre-maturity sale and maturity. Fixed in: SGB article (rewrote secondary-market paragraphs, comparison table, worked example, update-log, sources section), gold-commodities article, and tax article. New source `src-budget-2026-sgb-tax` (TOI Carat & Stick).
- [x] **LRS TCS FY 2026-27 structure** — threshold ₹7L→₹10L; loan-funded education 0%; self-funded education/medical 2% above threshold; tour packages 2% flat; other LRS 20% above threshold. Added a dedicated TCS table + section to the LRS article. New source `src-lrs-tcs-sc-2026` (Standard Chartered Finance Act 2026 notice).
- [x] **IRDAI health-insurance reforms** — no entry-age cap; PED waiting capped at 3 years; moratorium cut 8→5 years (60 months). Added a new "IRDAI 2025-26 reforms" section + updated the PED waiting bullet in the insurance article. New source `src-irdai-moratorium-2026` (India Today).
- [x] **SEBI F&O FY26 data** — 78.6 lakh individual traders, ₹91,685 cr losses, avg ₹1,16,654/trader, 87.7% lost, F&O STT ₹27,695 cr. Used as the primary data spine in the new derivatives article. New sources `src-sebi-fo-fy26`, `src-et-fo-retail-exodus`, `src-toi-big-boys`.

### Pipeline (all green)
- [x] `node scripts/validate-content.mjs` → **21 articles, 4 books, 20 sources, 0 warnings**.
- [x] `node scripts/check-links.mjs` → all registry refs resolve.
- [x] `npx vitest run` → 41/41.
- [x] `npx astro build` → 88 pages, local base OK **and** `BASE_PATH=/dhanpedia` production OK.
- [x] `npx pagefind --site dist` → search index built (derivatives included).
- [x] `node scripts/build-report.mjs` → manifest files present on disk.

## Known issues / fixes this session
- Subagent MDX used bare `<https://...>` autolinks (MDX-incompatible) → converted to markdown links.
- One-shot frontmatter patch dropped the closing `]` on 5 articles' `sources:` arrays → repaired.
- SGB/insurance/gold anchors use em-dashes (`—`), not hyphens → follow-up patch with exact text.

## Not yet done
- [ ] Deploy to GitHub Pages (owner must enable Pages; CI is configured).
- [ ] Personalization pass on `pf-wealth-plan-10-lakh` once the user answers the 14 questions.
- [ ] Phase 2 article depth expansion (bank safety, ESOP/RSU tax, REIT/InvIT, gold SGB-vs-ETF worked example).
- [ ] More calculators (ELSS tax shield, NPS tax shield, PMS fee-drag, AIF carry, SIF sleeve sizing).

## Next 3 actions
1. Commit this session's changes.
2. Present the updated books (esp. `book-complete-indian-investor`, now with the derivatives chapter) as downloadable artifacts.
3. Ask the user the personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
