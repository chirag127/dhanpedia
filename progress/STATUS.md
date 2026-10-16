# DhanPedia — Progress

Last updated: **2026-10-18** (Wave 6: 2 new articles + 2 new finance functions + 2 new sources; 33 → 35 articles; all pipeline green)

## State

- **Articles:** 35 on disk / registered. Wave 6 added 2: `alternatives-sif-strategy-families-deep-dive` (the 7 SIF strategy families, scheme-document annex mechanics, sleeve-sizing fee-decay math) and `real-estate-reit-invit-dividend-timing-tax` (the 12-month LTCG clock, NAV premium/discount yield-drag, reinvest-vs-redeem, distribution timing into the tax-free stack).
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 14, indian-taxation 8, p2p-lending 4, wealth-beyond-10l 11 (Wave 6 added the SIF strategy-families chapter).
- **Sources:** 45 in `sources.json` (Wave 6 added 2: src-sif-strategy-families-2026, src-reit-invit-premium-discount-2026).
- **Update-log:** 36 tracked time-sensitive claims.
- **Calculators:** 18 pages. Wave 6 added 2 pure, unit-tested finance functions (`sifSleeveSizing()`, `businessTrustTiming()`) that power the two new articles' decision math.

## Wave 6 session (verified 2026-10-18 via web research)

### New articles
- [x] `src/content/alternatives/alternatives-sif-strategy-families-deep-dive.mdx` — the *strategy* layer the SIF overview left open: the seven SEBI 2026 strategy families decoded (equity long-short, equity market-neutral, debt long-short/rate, credit relative value, sector rotation, dynamic/tactical allocation, event-driven/arbitrage), the 75/25 illustrative blend and ~25% naked-short cap, the three scheme-document annexes to read (derivative policy, allocation/rebalancing, governance/turnover), the sleeve-sizing fee-decay decision test, and when a SIF sleeve is the wrong tool. KaTeX + Mermaid + a 7-family table.
- [x] `src/content/real-estate/real-estate-reit-invit-dividend-timing-tax.mdx` — the *timing and total-return* layer over the REIT/InvIT tax table: the 12-month LTCG clock and the 12.5% vs 20% rate step, how the NAV premium/discount drags the effective yield on your purchase price (premium is a future cost, discount is return to capture), reinvest-vs-redeem and what to route the distribution into, a worked now-vs-forward exit math, and how the REIT slots into the tax-free stack (exempt-dividend leg + shared ₹1.25L 112A pool management). KaTeX + Mermaid + worked tables.

### New finance functions + tests
- [x] `sifSleeveSizing()` in `src/lib/finance/index.ts` (SifSleeveResult: net edge vs stated benchmark, blended portfolio net return, fee drag over period, sleeve cap at the 25% rule).
- [x] `businessTrustTiming()` in `src/lib/finance/index.ts` (BtTimingResult: premium/discount, yield-on-cost vs yield-on-price and the drag, 12-month LTCG qualification, after-tax distribution income, after-tax proceeds of selling now vs forward, better-choice flag).
- [x] 6 new finance unit tests (3 for each function) — **55/55 unit tests pass**.
- [x] 2 new e2e tests (the two new article pages, desktop + mobile) — **24/24 pass**.

### Research verified this session
- [x] **SIF strategy families** — the "seven" families and the 75/25 blend / ~25% naked-short cap are secondary-guide readings of the SEBI MF Regulations 2026 (AndFintech, Mera SIF, GreySky, SafeMoney); flagged medium-confidence for scheme-document verification.
- [x] **REIT/InvIT dividend-uniformity** — Finance Bill 2026 (assent 17 Aug 2026) makes the dividend component more uniformly exempt regardless of the SPV regime, with a higher 25% SPV-level surcharge trade-off; interest/rental components stay slab-taxed (Mint, Hindu Business Line, Finoscape). Current-year 115UA(2) wording flagged for CA verification.
- [x] **NAV premium/discount** — REIT total return = distribution + NAV appreciation + change in the premium/discount; a fat premium at purchase is a future cost if it normalises (Finoscape, secondary pattern).

### Pipeline (all green)
- [x] `npx vitest run` → 55 passed.
- [x] `node scripts/validate-content.mjs` → 35 articles, 4 books, 45 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npx astro build` → 159 indexed pages; both new article pages generated.
- [x] `npx pagefind --site dist` → indexed (159 pages, 16,496 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 35/35 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 24 passed (desktop + mobile).

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
- [ ] Phase 4 deeper expansion if the user confirms: AIF carry-return calculator (high-water-line), dedicated `sif-sleeve` and `reit-invit-timing` calculator pages wiring the two new finance functions, ELSS/NPS tax-shield standalone.

## Next 3 actions
1. Commit Wave 6: 2 new articles + 2 finance functions + 2 sources + tests.
2. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
3. Continue the daily article habit (Wave 7 candidates: an AIF-category selection guide, an AIF carry-return calculator, or a SIF sleeve-sizing calculator page).

## Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Use "up to ₹X" / "under N months" instead.
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use `"C:\Program Files\nodejs\npx.cmd" astro build` (system Node v24.18.0).
- **Scratch scripts:** keep one-off registry scripts (`_register-waveN.mjs`) for audit; delete transient inspection scripts.
