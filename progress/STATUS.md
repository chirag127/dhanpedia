# DhanPedia — Progress

Last updated: **2026-10-18** (Wave 16: 1 new article + 1 new finance function + 1 new calculator + 1 new source; 45 → 46 articles; 29 calculators; all pipeline green)

## State

- **Articles:** 46 on disk / registered. Wave 16 added 1: `international-nri-tax-residency-tds-dtaa` (the inbound NRI tax layer none of the investing-route articles covered: the Section 6 day-count residency tests (182-day / 60+365 / 120+365 with the ₹15L Indian-income variant), the NR/RNOR/ROR split, India-source-only taxation, the NRE/NRO/FCNR account choice, the Section 195 TDS table (30% flat, property TDS-on-value + 197), the DTAA relief sequence (TRC + Form 10F + Form 67, 15G/15H unavailable), the **87A-not-available-to-NRIs asymmetry**, and the ITR-2/ITR-3 filing map).
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 16 (+ international-nri-tax-residency-tds-dtaa), indian-taxation 13, p2p-lending 4, wealth-beyond-10l 15.
- **Sources:** 55 in `sources.json` (Wave 16 added 1: src-nri-tax-tds-dtaa-2026, Section 6 residency + 195 TDS heads + DTAA/197/10F/67 + 87A-exclusion + ITR-2/3 map).
- **Update-log:** 52 tracked (Wave 16 added `ul-nri-195-dtaa-2026`).
- **Calculators:** 29 (Wave 16 added `nri-india-tax`, powered by the new `nriIndiaTaxFY27()` pure function — residency day-counting + domestic-vs-DTAA TDS rate + cess — with 8 unit tests and 2 e2e tests).

## Wave 16 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/international/international-nri-tax-residency-tds-dtaa.mdx` — the *inbound NRI tax* layer (international category went from 2 to 3, and the investing-route articles finally get their tax counterpart): the Section 6 residency tests (182-day / 60+365 / 120+365 with the ₹15L Indian-income variant), the NR/RNOR/ROR split, the India-source-only scope, the NRE/NRO/FCNR account choice (NRE/FCNR interest exempt, NRO taxable + USD 1M/yr repatriation cap), the Section 195 TDS table (30% flat, head rates, property TDS-on-value + the 197 fix), the DTAA sequence (TRC + Form 10F + Form 67; 15G/15H unavailable to NRIs), the 87A-not-available asymmetry, and the ITR-2/ITR-3 filing map.

### New finance function + calculator + tests
- [x] `nriIndiaTaxFY27()` in `src/lib/finance/index.ts` — Section 6 residency day-counting (182-day test + the 60/365 or 120/365 long-term test with the high-income variant), the lower-of-domestic-and-DTAA TDS rate, TDS + 4% cess, and the DTAA relief in ₹ terms.
- [x] `nri-india-tax` calculator page (category: International) — 7 inputs (day counts, high-income flag, India-source income, domestic rate, DTAA rate + applies flag), residency verdict, applicable TDS rate, TDS/cess/total, DTAA relief, TDS-split bar chart.
- [x] 8 new unit tests (120-day NR, the DTAA-rate-lowers-TDS math, no-DTAA full domestic, higher-treaty-ignored, 182-day resident, the 60/365 long test, the 120-day high-income variant flip, zero-income zero-TDS) — **112/112 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the "Residential status" label and the "Section 195 TDS" heading each collide with the page TOC, so the assertions were switched to `.first()` / the least-ambiguous headings) — **68/68 pass**.

### Research verified this session
- [x] **Section 6 residency tests** — 182-day, and 60+365 (rising to 120+365 when Indian income > ₹15L); physical presence counts arrival + departure; the Income-tax Act 2025 did NOT change the individual residency day counts (NRI Blueprint, savetaxs, skla).
- [x] **India-source-only taxation + the account split** — NRE interest exempt u/s 10(4)(ii), FCNR (B) exempt u/s 10(15) while non-resident; NRO taxable, repatriation capped at USD 1M/yr post-tax (TaxClue, Aug 2026).
- [x] **Section 195 TDS + the DTAA sequence** — 30% flat with no exemption slabs; head rates (NRO/rent 30%, 111A 20%, 112A 12.5% above ₹1.25L, property LTCG 12.5% no indexation, property STCG 30%, dividends 20%); property TDS on the full value + the 197 certificate; DTAA = TRC + Form 10F + Form 67 at the lower of the two rates; 15G/15H unavailable to NRIs; 87A rebate NOT available to NRIs; ITR-2 (ITR-3 if business/foreign assets) due 31 Jul.

### Pipeline (all green)
- [x] `npx vitest run` → 112 passed.
- [x] `node scripts/validate-content.mjs` → 46 articles, 4 books, 55 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 203 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (18,243 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 46/46 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 68 passed (34 desktop + 34 mobile).

## Wave 15 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-senior-citizen-regime-decision.mdx` — the *terminal-rung / retiree* tax layer: the age brackets (3L senior / 5L super-senior, old regime only; the new regime gives no age benefit), the two old-regime-only senior benefits (80TTB interest deduction + the higher age exemption), the SCSS 8.2% tax mechanics (interest fully taxable as Other Sources; only 80C on the deposit + 80TTB on up to ₹50k of interest), the ₹1L senior TDS threshold + Form 15H, the retiree advance-tax exemption, the Section 194P no-ITR convenience for 75+, and the **verified counterintuitive finding that the new regime usually still wins for a retiree in FY 2026-27** (87A-to-12L + widened slabs dominate, even with a full old-regime stack — the "old regime wins for retirees" advice is stale below ~₹20L in this base-slab model).

### New finance function + calculator + tests
- [x] `seniorRegimeTaxFY27()` in `src/lib/finance/index.ts` — age-bracket old-regime basic exemption (2.5L/3L/5L), the senior-only old-regime stack (80TTB capped at the limit and the interest earned, 80D, 80C capped at 1.5L, 24(b) home-loan capped at 2L) on 5/20/30 slabs with the 87A-to-5L rebate; the new regime with no age benefit and no 80TTB/80D; both-regime effective rates, the 80TTB value at the taxpayer's own marginal position, and the regime winner. A corrected draft (first attempt double-subtracted the old-regime basic exemption via `oldRegimeTaxFY27()` — replaced with an explicit `seniorOldSlabTax()` age-band function).
- [x] `senior-regime-tax` calculator page (category: Tax) — 7 inputs (age, interest, other income, 80TTB limit, 80D, 80C, home-loan 24b), old-vs-new tax rows, the 80TTB value, and a tax-comparison bar chart.
- [x] 7 new unit tests (new-wins-at-8.46L worked case, the 3L/5L age brackets, below-60 2.5L, 80TTB cap-at-interest + cap-at-limit, 80TTB value zero under 5L, the full-stack new-still-wins at 40L, the 1Cr new-still-wins verified case, zero-income tie) — **104/104 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; one `exact: true` fix on the "Old-regime tax" / "New-regime tax" labels that also match the chart alt) — **64/64 pass**.

### Research verified this session
- [x] **Senior/super-senior brackets** — 3L (60-79) / 5L (80+) old-regime basic exemption, 2.5L below 60; the new regime gives no age benefit (same slabs + 87A-to-12L + 75k standard deduction) (CalcGuru, TaxClue, Moneykit, ET slabs continuity).
- [x] **80TTB ₹50,000 (old-only) + the open conflict** — confirmed ₹50,000 for FY 2026-27; a Budget-2026 raise to ₹1,00,000 is reported but UNVERIFIED (department portal still shows 50k). Recorded as `ul-senior-80ttb-limit-2026` (conflict-open); the calculator takes the limit as a user-settable input rather than hardcoding a disputed figure.
- [x] **Senior TDS ₹1L threshold + Form 15H + the retiree advance-tax exemption + Section 194P** — TDS on senior interest only above ₹1L (raised from ₹50k); 15H stops TDS below the taxable limit; seniors with no business income pay as self-assessment tax (no 234B/234C); 75+ with only pension + same-bank interest can skip the ITR under 194P.
- [x] **NEW finding (corrects the draft's expectation):** scanning the full old-regime stack across incomes showed the **new regime wins at essentially all levels (up to ~₹1Cr, excluding surcharge)** — the base-slab difference is a constant ₹85k favouring new at 25-40L, because the new regime's widened 5/10/15/20/25/30 slabs + 87A-to-12L beat the old 5/20/30 even with ₹4.55L of deductions. Recorded as `ul-senior-regime-decision-2026`.

### Build gotcha hit this session
- **First draft of `seniorRegimeTaxFY27()` reused `oldRegimeTaxFY27()` (which has a built-in 2.5L below-60 nil band) AND subtracted the senior `oldBasic` exemption — a double-subtraction.** Replaced with an explicit `seniorOldSlabTax()` that takes the age-appropriate nil band. (Same class of bug as the Wave 11 marginal-relief rewrite — verify each function's base-tax helper before reusing it.)

### Pipeline (all green)
- [x] `npx vitest run` → 104 passed.
- [x] `node scripts/validate-content.mjs` → 45 articles, 4 books, 54 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 199 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (18,071 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 45/45 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 64 passed (32 desktop + 32 mobile).

## Wave 14 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/alternatives/alternatives-pre-ipo-unlisted-equity-hni.mdx` — the *direct pre-IPO / unlisted-equity* rung (the rung between SIF at ₹10L and AIF at ₹1Cr, and the one most investors try to buy *directly*): the three structural facts (ICDR Reg 17 six-month post-IPO lock-in — you cannot sell into the listing pop; SEBI's repeated position that off-market unlisted-trade platforms are not SEBI-recognised, so no clearing guarantee; no single price, only a dealer's ask), the supply-source table (ESOP / angel / PE-VC secondary / promoter sell-down / pre-IPO placement), the dealer-ask mechanics, the 24-month/112 (no pool, 12.5% no indexation) vs 12-month/112A (shared pool) tax split with STCG-at-slab, and a decision framework with explicit "when to say no" triggers.

### New finance function + calculator + tests
- [x] `preIpoTaxOutcome()` in `src/lib/finance/index.ts` — all four capital-gains heads: unlisted-LTCG (Sec 112, 12.5%, no pool, no indexation), unlisted-STCG (slab), listed-LTCG (Sec 112A, 12.5% above the shared Rs 1.25L pool), listed-STCG (Sec 111A, 20%); the holding test switches on `isListedAtSale` (24m vs 12m), the pool is capped at the gross gain, and it returns the after-tax net return on the entry price.
- [x] `pre-ipo-tax` calculator page (category: Alternatives) — 7 inputs (incl. the listed-at-sale toggle + the shared-pool input), a tax-head result row, and a gross-vs-after-tax gain bar chart.
- [x] 6 new unit tests (unlisted-LTCG 112 no-pool, unlisted-STCG at slab vs a higher slab, listed-LTCG above the pool, listed-STCG 20% no pool, pool-capped-at-gain zero tax, loss zero tax) — **96/96 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; two `exact: true` fixes on the "Gross gain" / "After-tax gain" labels that also match the chart alt) — **60/60 pass**.

### Research verified this session
- [x] **ICDR Reg 17 six-month post-IPO lock-in** — pre-IPO shares held by non-promoters are locked 6 months from IPO allotment; the 2026 NSE unlisted case (bought ~1,950-2,050, IPO 1,785, listed 1,800, locked to ~March 2027) (Money n Wealth, reviewed 14 Oct 2026).
- [x] **SEBI platform position** — advisories of Aug 2016, Dec 2024, Jun 2026: off-market unlisted-trade platforms are not SEBI-recognised; no clearing guarantee, no SEBI-administered protection; any platform claiming SEBI approval is a red flag.
- [x] **Unlisted vs listed tax split** — unlisted >24m LTCG 12.5% (Sec 112, no indexation, no pool); unlisted <=24m STCG at slab; listed exchange sale >12m 112A above the shared pool, <=12m 111A 20%; holding clock starts at transfer, not listing (We Grow Wealth, 12 Sep 2026; cross-checked against the PIB Budget-2024 FAQ).

### Build gotcha hit this session
- Inserting the `pre-ipo-tax` calculator entry consumed the NPS entry's closing `},`, producing a "Unexpected token" at the pre-IPO opening brace. Fixed by restoring the `},` object-close; re-checking `];` count + brace balance after every calculator edit (this is the recurring pattern from Waves 10/11/12 — now the standard post-edit check).

### Pipeline (all green)
- [x] `npx vitest run` → 96 passed.
- [x] `node scripts/validate-content.mjs` → 44 articles, 4 books, 53 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 195 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (17,953 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 44/44 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 60 passed (30 desktop + 30 mobile).

## Wave 13 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/retirement-fire/retirement-nps-exit-annuity-tax-deep-dive.mdx` — the *NPS retirement-exit* layer (retirement category went from 1 to 2 articles): the PFRDA 16-Dec-2025 amendment table (80/20 split, 85 deferral, Rs 8L small-corpus 100% rule, premature 20/80), the Section 10(10A) 60%-of-contributions exemption cap vs the PFRDA 80% exit (the "two 60/80 numbers that get confused"), the five PFRDA annuity variants with the ~6-7% life-annuity rate band and a 6%-vs-5% income-gap worked figure, and the new-regime 80CCD(2) entry-vs-exit tax separation.

### New finance function + calculator + tests
- [x] `npsRetirementExitFY27()` in `src/lib/finance/index.ts` — monthly SIP corpus build, the PFRDA exit split (small-corpus 100%, premature 20/80, normal 80/20 or caller-chosen), the 10(10A) 60%-of-contributions exemption cap → taxable lump sum, annuity corpus + flat annuity rate → after-tax annuity income at the marginal slab, and a single after-tax planning figure.
- [x] `nps-retirement-exit` calculator page (category: Retirement) — 8 inputs, corpus-split bar chart (exempt / taxable / annuity legs), 7 result rows.
- [x] 6 new unit tests (30-yr corpus + 80/20, the 60% cap binding + taxable-lump arithmetic, small-corpus 100%, premature 20/80 override, 100%-annuity exit, zero-contribution tie) — **90/90 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; one `exact: true` fix on the "Annuity corpus" label that also matches the chart alt) — **56/56 pass**.

### Research verified this session
- [x] **PFRDA 16-Dec-2025 exit amendment** — 80% lump / min 20% annuity (was 60/40), deferral to age 85 (was 75), small-corpus 100% threshold raised 5L → 8L, premature 20/80 (PFRDA press release + PFRDA Exits & Withdrawals Regulations, last amended 20 Jul 2026; thewealthblog / etmoney 2026 summaries).
- [x] **Annuity rate bands** — PFRDA-empanelled ASP life annuity ~6-7% at 60, joint-life and return-of-purchase lower (npscalculators / invsify 2026; 15-ASP empanelment list).
- [x] **Section 10(10A) 60% exemption cap** — the lump sum is exempt only up to 60% of total contributions even though PFRDA allows an 80% exit; the extra 20% is slab-taxed (cross-checked against the toolisky / npscalculators "80% lump sum doesn't mean 80% tax-free" note).

### Build gotcha hit this session
- Bare `=` and `<=` in the new article's table cell + prose broke the MDX/JSX build (`Unexpected character =`). Fixed by rewording to "corpus up to Rs 8L is a 100% lump-sum exit", "equals", and "entry is / exit is" — re-adding to the known-gotchas list (the KaTeX `\;=\;` inside the `$...$` block is fine; only bare `=` outside math/attributes breaks).

### Pipeline (all green)
- [x] `npx vitest run` → 90 passed.
- [x] `node scripts/validate-content.mjs` → 43 articles, 4 books, 52 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 191 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (17,816 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 43/43 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 56 passed (28 desktop + 28 mobile).

## Wave 12 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-huf-second-slab-gifting-high-income.mdx` — the *high-income HUF* layer: the second-assessable-person math (30L individual + 5L HUF new regime: solo ₹6,31,800 → split ₹4,75,800, saving ₹1,56,000/yr because the HUF's own 87A threshold zeroes its leg), the income-eligibility table (coparcenary income YES; 64(2)/99(3)-(4) self-acquired-to-HUF conversion NO; 64(1)(iv) spouse / 64(1A) minor income clubbed), the 56(2) gifting rules (relative gifts exempt unlimited; non-relative aggregate over ₹50k → entire amount taxed; wedding/inheritance/12A always exempt), the "exempt gift, taxed income" trap, and the two-advance-tax-clocks section (HUF PAN runs its own 234B/234C clocks + files its own ITR-2/3).

### New finance function + calculator + tests
- [x] `hufIncomeSplitFY27()` in `src/lib/finance/index.ts` — solo (one PAN) vs split (two PANs) through highIncomeTaxFY27 (full slab + surcharge + marginal relief + cess on each), annual saving, effective rates, and per-PAN advance-tax flags/duties.
- [x] `huf-income-split` calculator page (category: Tax) — 6 inputs, solo-vs-split bar chart, per-advance-tax-stream results.
- [x] 5 new unit tests (worked 30L+5L new-regime values, HUF-under-87A zero bill, old-regime 80C baseline, HUF 50L-crossing second stream, zero-income tie) — **84/84 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile) — **52/52 pass**.

### Research verified this session
- [x] **56(2) gifts + clubbing 60-65** — relative exemption, ₹50k non-relative cliff (whole amount, not excess), wedding/inheritance/12A always exempt, 64(1)(iv) spouse income clubbing, 64(1A) minor income to higher-income parent, 64(2) self-acquired-to-HUF conversion (→ 99(3)-(4) of the Act 2025), 65 joint-and-several liability; AIS cross-PAN detection (TaxClue / Legal Suvidha, FY 2026-27).
- [x] **HUF advance tax per PAN** — the HUF is a separate assessable person; its own 234B/234C clocks and ITR-2/3 deadline (Oquilia / etnownews, FY 2026-27).

### Pipeline (all green)
- [x] `npx vitest run` → 84 passed.
- [x] `node scripts/validate-content.mjs` → 42 articles, 4 books, 51 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 187 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (17,668 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 42/42 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 52 passed (26 desktop + 26 mobile).

## Wave 11 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-surcharge-cess-high-income.mdx` — the *high-income* layer that closes the surcharge/cess gap flagged in Wave 9: the three-tier computation (base tax → surcharge with marginal relief → 4% cess), the FY 2026-27 table (new regime 25% capped vs old regime 37% above ₹5Cr), the 15% equity-surcharge cap, worked regime comparisons (55L / 2.5Cr / 8Cr / 3Cr+5Cr-LTCG), and the marginal-relief cliff math at ₹50L (₹1,040 not ₹1,08,000+ on an extra ₹1,000).

### New finance function + calculator + tests
- [x] `highIncomeTaxFY27()` in `src/lib/finance/index.ts` — both regimes end to end: slab base tax (new/old FY 2026-27), separate-head 112A/111A equity-gains tax, surcharge bands (new 25% cap / old 37% above 5Cr), the 15% equity-surcharge cap on the equity portion of base tax, marginal relief (boundary priced at its own band, pre-cess comparison — documented approximation), 4% cess on (base + surcharge after relief), effective rates, and the regime winner.
- [x] `high-income-regime` calculator page (category: Tax) — 9 inputs incl. equity-LTCG/STCG, both-regime totals + effective rates + winner, per-regime cess, total-bill bar chart.
- [x] 7 new unit tests (no-surcharge below 50L, the 55L 10% band with exact base/surcharge/total, the 8Cr 25%-vs-37% split, 2.5Cr both-in-25%, the 15% equity-cap arithmetic, marginal relief at the ₹50L boundary, zero-income tie) — **79/79 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile) — **48/48 pass**.

### Research verified this session
- [x] **Income-tax Act, 2025 surcharge structure** — new regime: 10% (50L-1Cr), 15% (1Cr-2Cr), 25% capped above 2Cr, 37% abolished; old regime: 37% above 5Cr kept; 15% equity cap on 111A/112A tax; 4% HEC; marginal relief at boundaries (Virtual Auditor, updated 15 Apr 2026; corroborated by the Income-tax Dept threshold-limit snippets and multiple 2026 slab guides).

### Pipeline (all green)
- [x] `npx vitest run` → 79 passed.
- [x] `node scripts/validate-content.mjs` → 41 articles, 4 books, 50 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 183 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (17,524 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 41/41 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 48 passed (24 desktop + 24 mobile).

## Wave 10 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/alternatives/alternatives-pms-sif-aif-after-tax-wedge.mdx` — the *after-tax "what lands in your pocket"* layer over the capital ladder: the where-the-tax-lands table (index/PMS/SIF → 112A 12.5%; AIF Cat I/II unlisted → investor slab; AIF Cat III → ~42.7% fund-level net), a worked 10-year 14%-gross comparison across all five products, the decision rule (**gross edge × (1 − wedge) must stay positive**), the 194LBB TDS cash-flow trap, and the shared-₹1.25L-pool caveat.

### New finance function + calculator + tests
- [x] `afterTaxProductWedge()` in `src/lib/finance/index.ts` — end-of-horizon gross-final-value model with product-specific tax landing (112A 12.5% for equity-type, slab for unlisted Cat I/II pass-through, ~42.7% fund-level for Cat III), compounding management-fee drag + exit performance fee, the shared-LTCG-pool subtraction, and after-tax CAGR + total wedge.
- [x] `pms-sif-aif-tax-wedge` calculator page (category: Alternatives) — product select, slab/fee inputs, gross-vs-after-tax CAGR bar chart.
- [x] 5 new unit tests (index-smallest-wedge, unlisted slab widens the wedge, fees drag value, pool reduces tax, zero-gross zero-wedge) — **72/72 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile) — **44/44 pass**.

### Research verified this session
- [x] **Unlisted-equity LTCG at slab, 24-month holding** — confirmed against the PIB Budget-2024 FAQ + Finance Bill 2024 memo (36-month period removed; unlisted/property/gold now 24-month; listed 12-month). This is the rate the Cat I/II pass-through wedge uses.
- [x] **Cat III ~42.7% fund-level** — secondary reading recorded as `ul-cat3-fund-level-rate-2026` for CA confirmation per fund.

### Pipeline (all green)
- [x] `npx vitest run` → 72 passed.
- [x] `node scripts/validate-content.mjs` → 40 articles, 4 books, 49 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 179 pages; new article + new calculator pages generated (one transient syntax error — a duplicate array-close `];` from the Wave 10 calculator edit — fixed).
- [x] `npx pagefind --site dist` → indexed (17,367 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 40/40 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 44 passed (22 desktop + 22 mobile).

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
- [ ] Resolve the open 80TTB conflict (`ul-senior-80ttb-limit-2026`): confirm whether the Budget-2026 raise to Rs 1,00,000 is in the Finance Act text - re-run the senior-regime decision if so.
- [ ] Phase 4 deeper expansion: Wave 17 candidate = an ESOP-vesting tax walkthrough (exercise/ESOT/SSTT/112A timing, new-regime impact), a GIFT City FoF deep-dive, or a DTAA-by-country rate reference table.

## Next 3 actions
1. Commit Wave 16: 1 new article + nriIndiaTaxFY27() function + nri-india-tax calculator + 1 source + tests.
2. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
3. Continue the daily article habit (Wave 17 candidate: ESOP-vesting tax walkthrough, GIFT City FoF deep-dive, or a DTAA-by-country rate table).

## Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Use "up to ₹X" / "under N months" instead.
- **MDX bare `=` / `<=`:** a bare `=` (or `<=`) outside a `$...$` math block or an attribute value breaks the MDX/JSX build with "Unexpected character `=`" (hit in Wave 13). Reword to "is" / "up to" / "equals"; `\;=\;` inside `$...$` and `href="..."` are safe.
- **Calculator array-insertion brace:** inserting a new calculator entry in `src/lib/calculators.ts` by replacing the `},\n];` tail has repeatedly (Waves 10/11/12/14) either dropped the previous entry's closing `},` or left a duplicate `];`. After every insertion, verify `]`-close count is exactly 1 before `export function getCalc` and that the previous entry ends with `},\n  },`.
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use `"C:\Program Files\nodejs\npx.cmd" astro build` (system Node v24.18.0).
- **Scratch scripts:** keep one-off registry scripts (`_register-waveN.mjs`) for audit; delete transient inspection scripts.
