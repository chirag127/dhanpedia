# DhanPedia — Progress

Last updated: **2026-10-16** (content push #3: 2 new articles + 1 new calculator, 26 → 28 articles; all pipeline green)

## State

- **Articles:** 28 on disk / registered. Wave 3 added `insurance-claims-ulip-mis-selling` (IRDAI 2026 claims data + ULIP vs term math) and `international-fof-gift-city-lrs` (the $7B SEBI cap, GIFT City IFSCA route, FoF-vs-LRS cost/tax comparison).
- **Books:** 4 × 6 formats. Chapter counts: complete-investor 13, indian-taxation 5, p2p-lending 3, wealth-beyond-10l 9.
- **Sources:** 32 in `sources.json` (added 4 this session: src-intl-fof-cap-2026, src-epf-rate-2026, src-irdai-annual-report-2026, src-ulip-vs-term-2026).
- **Update-log:** 22 tracked time-sensitive claims.
- **Calculators:** 15 pages, including new `pms-aif-fees` (layered management + performance fee simulation, `pmsSimulation()` in `src/lib/finance`).

## This session (verified 2026-10-16 via web research)

### New articles (Wave 3)
- [x] `src/content/insurance/insurance-claims-ulip-mis-selling.mdx` — IRDAI FY 2025-26 claims data (life death-claim settlement ~99%; ~8% health-claim rejection; 1-hour cashless pre-auth met 86.8%; avg payout ~₹29,000; ICR public >100% / private 75-85%), the term-vs-ULIP 20-yr worked math (~₹30L+ gap), mis-selling red flags (insurance-as-FD, compulsory bundling, investment-linked pushed on risk-averse), solvency checks, and the IRDAI 2025-26 reforms (no entry-age cap, PED 3yr, moratorium 5yr, GST removed).
- [x] `src/content/international/international-fof-gift-city-lrs.mdx` — Why most domestic international FoFs closed to fresh SIPs in 2026 (SEBI/RBI $7B industry cap breached Jan 2022; only 1 fund open as of 10 Jul 2026 per Creso/Value Research), the GIFT City IFSCA route that sidesteps the cap (USD-denominated, LRS), and a 3-route cost/tax comparison (domestic FoF vs GIFT City vs direct LRS) with the FY 2026-27 investment TCS (20% above threshold) gotcha and a ₹10L decision framework.
- [x] **New calculator `pms-aif-fees`** — `pmsSimulation()` in `src/lib/finance/index.ts` (layered mgmt fee on opening corpus + performance fee on gain-above-benchmark, no clawback modelled); 3 known-answer unit tests; 14/14 e2e pass including the new page on desktop + mobile.

### Stale-fact fix this session
- [x] **EPF rate** — banking article had "8.5% (assumed return; PFRDA)" on the EPF row; corrected to **8.25% (FY 2025-26, EPFO CBT 239th meeting, Mar 2026)** with new source `src-epf-rate-2026`. (The 8.5% was a fabricated figure; the PFRDA NPS route, not EPF, is the 80CCD(1B) route.)

### Pipeline (all green this session)
- [x] `node scripts/validate-content.mjs` → **28 articles, 4 books, 32 sources, 28 MDX on disk, 0 warnings**.
- [x] `node scripts/check-links.mjs` → all registry refs resolve.
- [x] `npx vitest run` → **44/44** (3 new PMS/AIF fee tests).
- [x] `npx playwright test` → **14/14** (1 new PMS/AIF calculator test; desktop + mobile).
- [x] `astro build` (system Node v24.18) → Complete, local base OK **and** `--base /dhanpedia` production OK.
- [x] `npx pagefind --site dist` → **133 pages / 14179 words**.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 28/28 article downloads, all 6 formats present on disk.
- [x] `node scripts/build-report.mjs` → manifest OK.

### Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Pattern: use "up to ₹X" / "under N months" instead of "< ₹X" / "< Nmo". Fixed 5 occurrences in Wave 2, 1 in Wave 3.
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use `"C:\Program Files\nodejs\npx.cmd" astro build` (system Node v24.18.0).

## Not yet done
- [ ] Deploy to GitHub Pages (owner must enable Pages; CI is configured).
- [ ] Personalization pass on `pf-wealth-plan-10-lakh` once the user answers the 14 questions.
- [ ] Phase 4 deeper expansion if user confirms (REIT/InvIT worked example, NBFC debenture underwriting guide, HUF deep-dive, "tax-free wealth stack" article).
- [ ] More calculators: ELSS tax shield, NPS tax shield, AIF carry-return (with high-water-line), SIF sleeve sizing.

## Next 3 actions
1. Commit this session's changes (Wave 3: 2 articles, 1 calculator, 4 sources, EPF rate fix).
2. Re-present the 4 books (complete-investor now 13 chapters; wealth-beyond now 9 chapters) as downloadable artifacts.
3. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
