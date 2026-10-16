# DhanPedia — Progress

Last updated: **2026-10-17** (Wave 4: 3 new articles + 2 new calculators + old-regime slab fix, 28 → 31 articles; all pipeline green)

## State

- **Articles:** 31 on disk / registered. Wave 4 added 3 (tax-tax-free-wealth-stack, tax-huf-wealth-structure, fixed-income-nbfc-debentures) and upgraded real-estate-reit-invit with the Section 115UA/194LBA tax treatment. Wave 3 added `insurance-claims-ulip-mis-selling` (IRDAI 2026 claims data + ULIP vs term math) and `international-fof-gift-city-lrs` (the $7B SEBI cap, GIFT City IFSCA route, FoF-vs-LRS cost/tax comparison).
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 14, indian-taxation 7, p2p-lending 4, wealth-beyond-10l 9.
- **Sources:** 39 in `sources.json` (Wave 4 added 7: src-nps-deductions-2026, src-elss-ltcg-2026, src-eldeductions-fy2026-27, src-huf-tax-2026, src-reit-invit-tax-2026, src-ncd-rates-2026, src-hyb-bonds-2026).
- **Update-log:** 29 tracked time-sensitive claims.
- **Calculators:** 17 pages, including Wave 4 `tax-shield` (new-vs-old regime, `newRegimeTaxFY27`/`oldRegimeTaxFY27`) and `core-satellite` (NCD blend, `coreSatelliteBlend()`).

## Wave 4 session (verified 2026-10-17 via web research)

### New articles + REIT tax upgrade
- [x] `src/content/taxation/tax-tax-free-wealth-stack.mdx` — the full 80C/NPS/PPF/ELSS/interest-income stack worked out, the 80/20 NPS exit (PFRDA 16 Dec 2025), the 12L new-regime tax-free corridor, and the new-vs-old break-even (links to the new `tax-shield` calculator).
- [x] `src/content/taxation/tax-huf-wealth-structure.mdx` — HUF as a separate taxable entity: creation, Karta/deed, PAN-49A, ITR-2/3, what income may sit in it, the Sec 64(2) / ITA-2025 Sec 99(3)-(4) clubbing traps, Vineeta Sharma partition, and a two-entity worked example.
- [x] `src/content/fixed-income/fixed-income-nbfc-debentures.mdx` — NCD pricing off the G-Sec benchmark + credit spread, the 2026 yield bands by rating (AAA 7–8 / AA 8–9.5 / A 9.5–11.5 / BBB 11.5+), a 7-point underwriting checklist, default data, and the coupon-vs-YTM + tax position.
- [x] `src/content/real-estate/real-estate-reit-invit.mdx` — added the Section 115UA pass-through + 194LBA 10% TDS + 56(2)(xii) return-of-capital + 112A/111A shared-bucket tax treatment.

### Critical fact fix (old-regime slabs)
- [x] **FY 2026-27 old-regime slabs corrected.** Confirmed against Economic Times/Grant Thornton (Budget 2026), TaxFetch, and Cleartax: the old regime is **nil up to ₹2.5L, 5% to ₹5L, 20% to ₹10L, 30% above** — the 5/10/15% intermediate bands found in some pre-2013 references no longer exist (Budget 2025 widened only the NEW regime). Fixed `oldRegimeTaxFY27()` in `src/lib/finance/index.ts`, the `tax-india-investor-complete` worked example (now ₹1,50,000 old vs ₹97,500 new), the HUF worked example, and the tax-free-stack worked example (also corrected its 80C pool to respect the ₹1.5L cap and added the HUF no-87A note).

### New calculators
- [x] `tax-shield` and `core-satellite` registered in `src/lib/calculators.ts` (auto-generate their pages via `[id].astro`).

### Tests
- [x] 3 new finance functions covered: `newRegimeTaxFY27`, `oldRegimeTaxFY27`, `coreSatelliteBlend` — **48/48 unit tests pass**.
- [x] e2e: 2 new tests for the `tax-shield` and `core-satellite` pages — **18/18 pass** (desktop + mobile).

### Pipeline (all green)
- [x] `npm test` → 48 passed.
- [x] `node scripts/validate-content.mjs` → 31 articles, 4 books, 39 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 31/31 article downloads.
- [x] `astro build` → 111 pages; both new calculator pages generated.
- [x] `npx pagefind --site dist` → 146 pages / 15467 words.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 18 passed (desktop + mobile).

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
- [ ] More calculators: AIF carry-return (with high-water-line), SIF sleeve sizing. (ELSS/NPS tax shield now folded into `tax-shield` + the tax-free-stack article.)

## Next 3 actions
1. Commit Wave 4: 3 new articles + REIT tax upgrade + old-regime slab fix + 2 calculators + tests.
2. Re-present the 4 books (complete-investor now 14 chapters; indian-taxation now 7) as downloadable artifacts.
3. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
