# DhanPedia — Progress

Last updated: **2026-10-17** (Wave 5: 2 new articles + 1 new calculator + 4 new sources; 31 → 33 articles; all pipeline green)

## State

- **Articles:** 33 on disk / registered. Wave 5 added 2: `alternatives-hnw-pms-aif-sif-selection` (the selection + fee-decay layer over SIF/PMS/AIF) and `tax-advance-itr-final-checklist` (advance tax, 234B/234C interest clocks, surcharge, ITR form selection, end-of-year checklist).
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 14, indian-taxation 8, p2p-lending 4, wealth-beyond-10l 10.
- **Sources:** 43 in `sources.json` (Wave 5 added 4: src-pms-aif-fees-2026, src-aif-categories-2026, src-advance-tax-fy2026-27, src-it-dept-final-dates-2026).
- **Update-log:** 34 tracked time-sensitive claims.
- **Calculators:** 18 pages, including Wave 5 `advance-tax` (4-installment schedule + 234B/234C approximation, `advanceTaxFY27()`).

## Wave 5 session (verified 2026-10-17 via web research)

### New articles
- [x] `src/content/alternatives/alternatives-hnw-pms-aif-sif-selection.mdx` — the *selection* layer over the professional rungs: the forward-edge-minus-fee-drag decision test, the fee-decay math (one-year PMS worked example: 14% gross → 10.3% net after a 2% mgmt + 15%-above-10%-hurdle perf fee), the SIF/PMS/AIF screen table, the 10L→50L→1Cr roadmap (incl. the April-2027 ₹25L MF-only PMS route), a 10-point due-diligence checklist, and "when to say no to all three." ECharts-free by design; uses the PMS/AIF-fee, core-satellite, fee-drag, and tax-shield calculators.
- [x] `src/content/taxation/tax-advance-itr-final-checklist.mdx` — who owes advance tax in FY 2026-27 (the ₹10k threshold), the 15/45/75/100% cumulative schedule (15 Jun / 15 Sep / 15 Dec / 15 Mar), the 234C 3-month vs 1-month interest tails (worked ₹7,575 example), the 234B 90% backstop, the capital-gains 31-Mar relief, the surcharge thresholds (10/15/25% at 50L/1Cr/2Cr, new-regime cap 25%), ITR-1/2/3 selection, and a 6-step end-of-year checklist.

### New finance function + calculator
- [x] `advanceTaxFY27(annualTax, tds)` in `src/lib/finance/index.ts` (AdvanceTaxResult: four installments, 234C approximation) + the `advance-tax` calculator page.
- [x] 3 new finance unit tests: `advanceTaxFY27` installment/234C math + threshold + clamp — **49/49 unit tests pass**.
- [x] 1 new e2e test for the `advance-tax` page — **20/20 pass** (desktop + mobile).

### Research verified this session
- [x] **SIF minimum** — ₹10L at the PAN level, accredited-investor exemption, effective 1 Apr 2026 (SEBI circulars Feb–Jul 2025; Business Standard). The first professional rung a ₹10L reader is already eligible for.
- [x] **MF-only PMS route** — SEBI's revamped PMS regulation (effective April 2027) adds a mutual-fund-only PMS at a ₹25L minimum (CNBC-TV18, Moneycontrol) — a new low-ticket rung between SIF and classic PMS.
- [x] **Advance tax FY 2026-27** — 15/45/75/100% on 15 Jun / 15 Sep / 15 Dec / 15 Mar; ₹10k threshold; 234C 1%/mo (3-month tails first three, 1-month last); 234B 90% backstop; capital-gains 31-Mar relief; 44AD/44ADA single payment (TaxClue, Cleartax). Surcharge 10/15/25% at 50L/1Cr/2Cr, new-regime cap 25% (Budget 2026 changed nothing).

### Pipeline (all green)
- [x] `npx vitest run` → 49 passed.
- [x] `node scripts/validate-content.mjs` → 33 articles, 4 books, 43 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npx astro build` → 116 pages; both new article pages + the `advance-tax` calculator page generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 33/33 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 20 passed (desktop + mobile).

## Wave 4 (prior session, commit 48a4b28)
- [x] 3 new articles + REIT tax upgrade + old-regime slab fix + 2 calculators. 31 articles, 39 sources, 17 calculators. Critical fix: old-regime tax slabs corrected from wrong 5/10/15/30 to correct 5/20/30 structure (nil ≤₹2.5L, 5%→₹5L, 20%→₹10L, 30%+), verified against ET/Grant Thornton, TaxFetch, Cleartax.

## Not yet done
- [ ] Deploy to GitHub Pages (owner must enable Pages; CI is configured).
- [ ] Personalization pass on `pf-wealth-plan-10-lakh` once the user answers the 14 questions.
- [ ] Phase 4 deeper expansion if the user confirms: SIF sleeve-sizing calculator, AIF carry-return calculator (high-water-line), ELSS/NPS tax-shield standalone (already folded into `tax-shield`).

## Next 3 actions
1. Commit Wave 5: 2 new articles + `advance-tax` calculator + 4 sources + tests.
2. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
3. Continue the daily article habit (Wave 6 candidates: a SIF strategy-category deep-dive, or an AIF-category selection guide, or a REIT/InvIT dividend-timing article).

## Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Use "up to ₹X" / "under N months" instead.
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use `"C:\Program Files\nodejs\npx.cmd" astro build` (system Node v24.18.0).
- **Scratch scripts:** keep one-off registry scripts (`_register-waveN.mjs`) for audit; delete transient inspection scripts.
