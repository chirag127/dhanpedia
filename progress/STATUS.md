# DhanPedia — Progress

Last updated: **2026-10-18** (Wave 9: 1 new article + 1 new finance function + 1 new calculator + 1 new source; 38 → 39 articles; 22 calculators; all pipeline green)

## State

- **Articles:** 39 on disk / registered. Wave 9 added 1: `tax-80c-baskets-regime-decision` (the tax-shield layer: filling the ₹1.5L 80C basket by risk not habit — ELSS vs PPF vs EPF vs home-loan vs the LIC trap; the ₹50K NPS side-door is old-regime-only; the 80CCD(2) employer-NPS lever that survives the new regime; and the **verified FY 2026-27 finding that the new regime wins up to ~₹45L even with a full ~₹5L deduction stack**).
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 14, indian-taxation 10 (+ tax-80c-baskets-regime-decision), p2p-lending 4, wealth-beyond-10l 13.
- **Sources:** 49 in `sources.json` (Wave 9 added 1: src-ppf-rate-fy2026-27, PPF 7.1% FY 2026-27 Q1).
- **Update-log:** 42 tracked (Wave 9 added 2, incl. the `ul-regime-decision-new-wins-fy2026-27` modeled result + `ul-ppf-rate-fy2026-27`).
- **Calculators:** 22 (Wave 9 added `regime-80c-shield`, powered by the new `deductionShieldFY27()` pure function, with 6 unit tests and an e2e test).

## Wave 9 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-80c-baskets-regime-decision.mdx` — the *tax-shield* layer: the 80C instrument-by-instrument value table (ELSS ~12-15% CAGR / 3-yr lock, PPF 7.1% EEE / 15-yr, EPF 8.25% auto-capped, NSC, home-loan principal, LIC trap, tuition, NPS 80CCD(1)), the NPS side-door regime resolution (80CCD(1B) ₹50K old-regime-only per the Wave 8 `ul-80ccd1b-regime-clarification-2026` record; 80CCD(2) employer NPS 14% works in both regimes), the three basket-fill archetypes by life stage, the PPF "before the 5th" timing rule, and the **honest FY 2026-27 regime-decision result** (new regime wins up to ~₹45L even with a full ~₹5L stack, pre-surcharge).

### New finance function + calculator + tests
- [x] `deductionShieldFY27()` in `src/lib/finance/index.ts` — old vs new regime tax for a salaried FY 2026-27 taxpayer with 80C + NPS + 24(b) home-loan + 80D health, standard deductions (75k new / 50k old), and the *effective rupee value of each deduction bucket at the taxpayer's own marginal position* (sequential statutory order).
- [x] `regime-80c-shield` calculator page (category: Tax) — 7 inputs, new-vs-old tax, winner, per-bucket value, tax-comparison bar chart.
- [x] 6 new unit tests (full-stack new-wins scan across 6 income points, 24b bucket value, 87A no-deduction new-wins, 80CCD(2) new-regime effect, bucket-sum invariant, self-employed no std ded) — **67/67 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile) — **40/40 pass**.

### Research verified this session
- [x] **PPF 7.1% FY 2026-27 Q1** — 8th straight unchanged quarter, Finance Ministry notification 30 Mar 2026 (Economic Times 07 Apr 2026).
- [x] **EPF 8.25%** — carried forward from FY 2025-26 (`src-epf-rate-2026`), flagged for re-verification at the FY 2026-27 EPFO meeting.
- [x] **80CCD(1B) old-regime-only** — applied per `ul-80ccd1b-regime-clarification-2026` (Wave 8 conflict resolution); 80CCD(2) 14% all-employers survives the new regime (CA-reviewed 15 Oct 2026 source).
- [x] **NEW finding (corrects the initial draft):** the first version of this article hand-computed "old regime usually wins at ₹15-25L with a basket" — the `deductionShieldFY27()` scan proved that wrong: with the Budget 2025-widened new-regime slabs + 87A + 75k std ded, the **new regime wins up to ~₹45L even with a full ~₹5L old-regime stack**. The article now states the verified result; recorded as `ul-regime-decision-new-wins-fy2026-27` (surcharge above 50L excluded from the model — flagged for CA verification at the top bands).

### Pipeline (all green)
- [x] `npx vitest run` → 67 passed.
- [x] `node scripts/validate-content.mjs` → 39 articles, 4 books, 49 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npx astro build` → 175 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (17,267 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 39/39 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 40 passed (20 desktop + 20 mobile).

## Wave 8 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/alternatives/alternatives-aif-waterfall-economics.mdx` — the *GP-LP economics* layer: the four levers in money-flow order (mgmt fee → 20% carry → 8% hurdle → 100% catch-up), a worked ₹500 Cr / 3x / 10-yr fund (LP ~₹1,300 Cr = 2.6x net; GP ~₹200 Cr carry + ₹70-80 Cr fee ≈ 5-6% of fund value), the negotiation table (hurdle and catch-up are the terms that move; 200 bps hurdle change cut GP carry ~₹20-25 Cr on the worked fund), the clawback / 20-30% escrow-holdback fragility note, and the ₹1 Cr smallest-ticket decision test.

### New finance function + calculator + tests
- [x] `aifWaterfall()` in `src/lib/finance/index.ts` — European-style end-of-fund waterfall: compounded preferred return, capped 100% catch-up, 80/20 (or straight) split, below-hurdle = LP-takes-all branch, cumulative mgmt-fee drag; verified against the Nucleus worked example (LP 1300 / GP carry 200 on 500 Cr / 3x / 10 yr / 8% / 20% / catch-up on).
- [x] `aif-waterfall` calculator page (category: Alternatives) — inputs in ₹Cr, catch-up toggle, where-the-money-goes bar chart.
- [x] 5 new unit tests (Nucleus match, fee drag, no-catch-up LP-friendlier, below-hurdle zero carry, GP share-of-profit) — **60/60 unit tests pass**.
- [x] 2 new e2e tests (calculator page + article page, desktop + mobile) — **36/36 pass**.

### Research verified this session
- [x] **GP-LP 2/20 ladder** — Nucleus Advisors practitioner article (07 Jan 2026): worked 500 Cr example, hurdle/catch-up negotiation points, escrow-holdback clawback fix, GP fee-only-on-failure alignment.
- [x] **80CCD(1B) regime conflict found and resolved** — a SmartTaxCalc blog *intro* claimed the ₹50k extra NPS deduction is "available even under the New Regime", but the same site's CA-reviewed body (reviewed 15 Oct 2026) + FAQ table + 1 Finance/ClearTax coverage all say **old-regime-only**; recorded as a `conflict-resolved` update-log entry (`ul-80ccd1b-regime-clarification-2026`) for Wave 9's ELSS/NPS tax-shield calculators.

### Pipeline (all green)
- [x] `npx vitest run` → 60 passed.
- [x] `node scripts/validate-content.mjs` → 38 articles, 4 books, 48 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npx astro build` → 171 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (17,094 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 38/38 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 36 passed (18 desktop + 18 mobile).

## Wave 7 session (verified 2026-10-18 via web research)

### New articles
- [x] `src/content/alternatives/alternatives-aif-category-selection-guide.mdx` — the *category decision* layer over AIFs: the Cat I/II/III comparison table (mandate, leverage, structure, lock-in, tax landing place, nature of risk, ideal investor, liquidity optionality), the 2/20 fee-decay math on a worked ₹1Cr position, the profile-to-category mapping, an 8-point due-diligence Mermaid checklist, the capital-ladder placement (₹10L SIF → ₹50L PMS → ₹1Cr first AIF → ₹5Cr/₹10Cr blends), and a **Regulatory watch** section on the SEBI AIF Amendment 2026 (accredited-only funds, the new angel-fund Category I class, inoperative-fund / Regulation 29).
- [x] `src/content/taxation/tax-aif-pcc-115bb-deep-dive.mdx` — the *taxation* layer over AIFs: the PMS-vs-Cat I/II-vs-Cat III distinction table, the 115UB pass-through and its two breaks (business income NOT passed through; the 12-month loss hold), the Cat III ~42.7% fund-level tax and its specific-exemption sections, the **64C/64D → 78/79 form migration** under the Income-tax Act 2025 (effective 1 Apr 2026, Sec 224 / Rule 145), the 194LBB 10% TDS trap and its connection to the 234B/234C advance-tax clocks, Schedule PTI reporting, and the PMS/AIF fee non-deductibility rule.

### New calculators
- [x] `sif-sleeve-sizing` calculator page — wires `sifSleeveSizing()`: size the SIF sleeve, apply the all-in fee, compare net edge vs a plain index, and project corpus with vs without the sleeve. The "does it pay for itself" decision test.
- [x] `reit-invit-timing` calculator page — wires `businessTrustTiming()`: the 12-month LTCG clock, NAV premium/discount yield-drag, after-tax distribution income, and a now-vs-forward exit comparison.

### Research verified this session
- [x] **SEBI AIF Amendment 2026** — accredited-investor-only schemes (1,000-investor cap waived), the distinct Category I angel-fund class (49-investor, accredited-only, re-registration deadline 8 Sep 2026), inoperative-fund classification and Regulation 29 retained-liquidation-proceeds changes; AIF Master Circular 3 June 2026 (Tax Update India, RANJ Legal, calcguru, SEBI).
- [x] **AIF category mechanics & fees** — Cat I no-leverage / 3-5 yr lock-in / govt incentives; Cat II up to 2× NAV / 5-10 yr / pass-through / 75%+ of commitments; Cat III up to 2× NAV / open or close-ended / fund-level ~42.7% tax; 2/20 standard fee ladder (Altportfunds, Nucleus Advisors, Scholarly).
- [x] **AIF taxation & form migration** — 115UB pass-through, 194LBB 10% TDS, business-income non-pass-through, 12-month loss hold, 64C/64D → 78/79 under the Income-tax Act 2025 (Sec 224 / Rule 145), Schedule PTI in ITR-2, Cat III ~42.7% fund-level with 10(4D)/10(23FF)/10(23FBC)/115AD exemptions (49Tax, Altportfunds, TaxHeal).

### Pipeline (all green)
- [x] `npx vitest run` → 55 passed (unit; the two new calculators are pure-data entries, no new unit math).
- [x] `node scripts/validate-content.mjs` → 37 articles, 4 books, 47 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npx astro build` → indexed pages; both new article pages + both new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (16,951 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 37/37 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 32 passed (16 desktop + 16 mobile).

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
- [ ] Phase 4 deeper expansion: Wave 10 candidate = a PMS-vs-AIF after-tax net-return comparator, an ELSS lock-in / tax-shield standalone calculator, or re-model the regime decision including surcharge above 50L.

## Next 3 actions
1. Commit Wave 9: 1 new article + deductionShieldFY27() function + regime-80c-shield calculator + 1 source + tests.
2. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
3. Continue the daily article habit (Wave 10 candidate: PMS-vs-AIF after-tax net-return comparator, or an ELSS lock-in / tax-shield standalone calculator).

## Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Use "up to ₹X" / "under N months" instead.
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use `"C:\Program Files\nodejs\npx.cmd" astro build` (system Node v24.18.0).
- **Scratch scripts:** keep one-off registry scripts (`_register-waveN.mjs`) for audit; delete transient inspection scripts.
