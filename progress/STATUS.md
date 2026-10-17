# DhanPedia — Progress

Last updated: **2026-10-18** (Wave 24: 1 new article + 1 new finance function + 1 new calculator + 1 new source + 8 unit tests + 2 e2e tests; 53 → 54 articles; 37 calculators; all pipeline green)

## State

- **Articles:** 54 on disk / registered. Wave 24 added 1: `tax-direct-lrs-us-equity-filing-walkthrough` (the *filing-mechanics* layer for a resident Indian who owns US equities directly through a US brokerage under LRS: the five-layer ITR-2 structure — (1) the dividend at the slab rate with the **25% individual US dividend withholding** (the 15% figure is the *corporate-with-voting-stock* rate, not the individual one; 30% is the no-W-8BEN backup) credited via **Form 67** capped at the lesser of the India dividend tax and the US withholding, (2) the capital gain as a **foreign-unlisted security** at **12.5% no-indexation LTCG after 24 months with NO pool** or slab STCG, (3) the **20% TCS** on the LRS investment remittance above the ₹10L threshold (a recoverable credit), (4) **Schedule FA every year with no minimum threshold**, and (5) the **FAST-DS 2026** small-taxpayer window (~15 Aug – 31 Dec 2026) flagged as the *separate* amnesty layer, plus a ₹12L-worked-example and the honest "when the direct route is the right filing posture" layer). Wave 23 added 1: `international-gift-city-live-scheme-comparison`. (the *live-scheme comparison + route-decision* layer: the 2026 live GIFT City scheme table — PPFAS S&P 500 FoF, PPFAS Nasdaq 100 FoF, DSP Global Equity Fund, Edelweiss Greater China, Marcellus Global Equities, the Tata India Dynamic Equity inbound fund, and the HDFC passive pipeline — with TER / min ticket / AUM / launch date; the **tax-treatment resolution** that closes the Wave 22 open conflict on the DSP primary anchor: fund-level 14.95% LTCG / 42.74% STCG, no investor-side CG, no TDS, no Schedule FA; the TER-cost-decay layer; the two-route net-after-tax decision (GIFT City fund-level vs direct LRS 12.5% + Schedule FA + TCS reservation); and the ₹5L-over-5-years worked example that shows the crossover point is ~₹25L+). Wave 22 added 1: `international-gift-city-ifsc-tax-timing-deep-dive`. (the *operational* GIFT City / IFSC layer: why the route stays open (IFSCA-regulated, outside the SEBI $7B cap, bought under the personal LRS), the AY 2026-27 Section 50AA debt-based "Specified Mutual Fund" redefinition that now reaches 12.5% no-pool LTCG for non-specified international FoFs, the **two coexisting tax treatments** on GIFT City gains (Indian-side 12.5% no-indexation LTCG + Schedule FA vs fund-level post-tax NAV with no separate CG compute — the offer document is the tie-breaker), the **TCS 20% reservation math** on the LRS remittance (₹10L aggregate threshold, the 1 Apr 2026 2% education/medical/tour cut, the aggregate-not-per-remittance rule), the live scheme list, the fresh FCA + KYC onboarding, and the Schedule FA / FAST-DS disclosure layer). Wave 21 added 1: `tax-54ec-tranche-tracker`; Wave 20 added 1: `pf-capital-ladder-10l-to-1cr`; Wave 19 added 1: `tax-esop-vesting-tax-walkthrough`.
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 19, indian-taxation 16, p2p-lending 4, wealth-beyond-10l 18. Wave 24 added `tax-direct-lrs-us-equity-filing-walkthrough` as a chapter to complete-indian-investor.
- **Sources:** 61 in `sources.json` (Wave 24 added 1: `src-us-stock-tax-india-2026` — the 25% individual US dividend withholding (W-8BEN) vs the 30% backup (and the 15% corporate figure), the 24-month / 12.5% no-pool foreign-security CG treatment, the Form 67 FTC cap, the Schedule FA no-threshold disclosure, and the FAST-DS 2026 small-taxpayer scheme terms).
- **Update-log:** 60 tracked (Wave 24 added `ul-direct-lrs-us-equity-filing-fy2026-27`, reviewAfter 2027-04-17 — the five-layer direct-LRS US-equity filing structure).
- **Calculators:** 37 (Wave 24 added `direct-lrs-us-equity-filing`, powered by the new `directLrsUsEquityFilingFY27()` pure function, with 8 unit tests and 2 e2e tests).

## Wave 24 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-direct-lrs-us-equity-filing-walkthrough.mdx` — the *filing-mechanics* layer for the direct LRS US-equity route (the GIFT City route-comparison calculator points here as the "direct side" of the decision): the five-layer ITR-2 structure (dividend+FTC, foreign-unlisted-security CG, TCS reservation, Schedule FA, FAST-DS), the **25% individual US dividend withholding correction** (the 15% figure is the corporate-with-voting-stock rate, not the individual one), the **no-pool** 12.5% LTCG on a foreign security, the TCS aggregation rule, the Schedule FA no-minimum-threshold rule, and the FAST-DS 2026 small-taxpayer window as the *separate* amnesty layer, plus a ₹12L worked example.

### New finance function + calculator + tests
- [x] `directLrsUsEquityFilingFY27()` in `src/lib/finance/index.ts` — the five layers: US withholding (25% W-8BEN / 30% backup) and the Form 67 FTC cap (lesser of the India dividend tax and the US withholding actually paid), the 24-month STCG→LTCG flip (12.5% no-pool LTCG / slab STCG), the TCS reservation on the aggregate LRS outflow above the ₹10L threshold, the Schedule FA flag, and the FAST-DS note.
- [x] `direct-lrs-us-equity-filing` calculator page (category: International) — 7 inputs (dividend, US withholding rate, gain, months held, slab, LRS remittance, prior LRS outflow), 8 result rows, ECharts 5-bar tax-layer chart.
- [x] 8 new unit tests (25% withholding, the two-way FTC cap, the 24-month LTCG flip, the sub-24-month slab STCG, the TCS reservation at/under the threshold, the TCS aggregation, the total-burden + Schedule-FA flag, and the FAST-DS note) — **174/174 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **100/100 e2e tests pass**.

### New source
- [x] `src-us-stock-tax-india-2026` — the dedicated US-stock-tax-in-India source: the 25% individual dividend withholding (W-8BEN) vs 30% backup (and the 15% corporate figure), the 24-month / 12.5% no-pool foreign-security CG treatment, the Form 67 FTC cap, the Schedule FA no-threshold rule, and the FAST-DS 2026 scheme terms (Cross-corroborated across Vested / WINvesta / Filewise / Upstox 2026 guides + KPMG / CBDT / NDTV FAST-DS coverage).

### Build gotcha hit this session
- **Source mis-attribution caught before commit** — the first article draft attributed the 25%-dividend fact to `src-gift-city-scheme-terms-2026` (the GIFT City source), which is the wrong source for a *direct* LRS US-equity fact. Corrected by creating a dedicated `src-us-stock-tax-india-2026` source and updating both the frontmatter and the body `## Sources` section to cite it. Recurring theme: **a new article's claims must be anchored to a source that actually makes that claim, not to the nearest-adjacent source.**

### Research verified this session
- [x] **The 25% individual US dividend withholding** — with a W-8BEN, an individual gets 25% (not the 15% corporate-with-voting-stock treaty figure); without a W-8BEN the 30% backup applies; the credit is capped via Form 67 at the lesser of the India dividend tax and the US withholding actually paid (cambridgewealth / winvesta / platizio cross-checks).
- [x] **The 24-month / no-pool foreign-security CG rule** — US shares are unlisted foreign securities: LTCG after 24 months at 12.5% no-indexation with *no* ₹1.25L pool (the 112A pool is Indian-listed-equity only); STCG at the slab rate (vested / winvesta / filewise / upstox / the Income-tax Act 2025 renumbered text).
- [x] **The FAST-DS 2026 scheme** — Foreign Assets of *Small* Taxpayers – Disclosure Scheme 2026, Finance Act 2026 Chapter IV (§§130–144), a one-time window ~15 Aug to 31 Dec 2026; Category A = undisclosed assets up to ₹1 cr (specified tax + an equal additional amount), Category B = up to ₹5 cr for assets from disclosed income / a non-resident period (a flat ₹1L fee with immunity); it is the *amnesty* layer for undisclosed assets, distinct from a normal Schedule FA filing (KPMG flash news + CBDT FAQs + NDTV Profit / NationPath).
- [x] **The TCS reservation specifics** — ₹10L aggregate TCS-free threshold (raised from ₹7L by the Finance Act 2025); 20% on the "other / investment" bucket; education / medical / tour dropped to 2% from 1 Apr 2026; TCS is a recoverable credit, not a cost.

### Pipeline (all green)
- [x] `npx vitest run` → 174 passed.
- [x] `node scripts/validate-content.mjs` → 54 articles, 4 books, 61 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 220 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 54/54 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 100 passed (50 desktop + 50 mobile).

## Wave 23 session (verified 2026-10-18 via web research)
## Wave 23 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/international/international-gift-city-live-scheme-comparison.mdx` — the *live-scheme comparison + route-decision* layer that **closes the open tax-treatment conflict flagged in Wave 22**: the 2026 live GIFT City scheme table (PPFAS S&P 500 FoF 0.30% scheme / ~0.35% all-in, PPFAS Nasdaq 100 FoF ~0.60% all-in, DSP Global Equity Fund up to ~1.75% all-in + the newly-found Edelweiss Greater China, Marcellus Global Equities, and the HDFC passive pipeline; plus the **inbound distinction** — the Tata India Dynamic Equity fund invests *domestic* equity at a USD 500 NRI ticket and is NOT an outbound global sleeve), the **tax-treatment resolution on the DSP primary anchor** (fund-level 14.95% LTCG / 42.74% STCG, no investor-side CG, no TDS, no Schedule FA; the offer document is the per-scheme tie-breaker), the TER cost-decay layer (0.32 pp/yr PPFAS vs VOO; up to 1.4 pp/yr for the DSP active fund), the two-route net-after-tax decision, and the ₹5L-over-5-yr worked example that puts the crossover at ~₹25L+ (the PMS/PRIM rung from the capital-ladder article).

### New finance function + calculator + tests
- [x] `giftCityRouteComparison()` in `src/lib/finance/index.ts` — the two-route head-to-head: the GIFT City fund-level post-tax-NAV route (all-in TER netted into the base return + the embedded fund-level CG tax, no investor-side CG, no Schedule FA) vs the direct LRS route (low-cost US ETF TER + the 12.5% no-indexation LTCG + Schedule FA), returning both pre-tax FVs, both realized gains, both route taxes, both final values, the net-return %s, the linear TER cost-drag, the CG-rate spread, and the edge route/amount.
- [x] `gift-city-route-comparison` calculator page (category: International) — 7 inputs (deployed ₹, index return, years, GIFT all-in TER, GIFT fund-level CG rate, direct all-in TER, direct CG rate), 8 result rows, ECharts 2-bar final-value comparison (the winning bar highlights green).
- [x] 8 new unit tests (edge-on-direct-when-TER+CG-lower, edge-on-gift-when-embedded-rate-lower, the CG-rate spread sign, the Schedule-FA flag, the linear TER cost-drag, the higher-TER-lowers-final-value, monotonic-in-gross-return, and zero-invest-tie) — **166/166 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **96/96 e2e tests pass**.

### New source
- [x] `src-gift-city-scheme-terms-2026` — the PPFAS S&P 500 / Nasdaq 100 FoF scheme terms (0.30% scheme TER, 0.35% / 0.60% all-in, USD 5,000 min, USD 500 top-up, AUM), the DSP Global Equity Fund terms (up to ~1.75% all-in, USD 5,000 min, ~USD 56.3Mn AUM), the **DSP fund-level tax schedule (14.95% LTCG / 42.74% STCG, no investor-side CG, no TDS, no Schedule FA)**, and the live Edelweiss / Marcellus / Tata-inbound / HDFC-pipeline list.

### Build gotcha hit this session
- **Calculator array-insertion brace bug (recurring, now the Wave 21/22 class)** — inserting `gift-city-route-comparison` before the `];` tail dropped the previous `gift-city-lrs-tax` entry's closing `},` → "braces UNBALANCED" (1149 vs 1148). Fixed by restoring the `},` and re-running `_check_calc_braces.mjs` (now BALANCED, 35 entries → 36 after the new entry). The post-insertion brace check remains a hard gate.

### Research verified this session
- [x] **Live GIFT City scheme terms** — PPFAS S&P 500 FoF (NFO 20 Mar 2026, scheme TER 0.30%, ~0.35% all-in, ~USD 19.6Mn AUM), PPFAS Nasdaq 100 FoF (May 2026, ~0.60% all-in, ~USD 9.4Mn AUM), DSP Global Equity Fund (22 Sep 2025, up to ~1.75% all-in, ~USD 56.3Mn AUM), Edelweiss Greater China (Mar 2026) + Marcellus Global Equities live, HDFC passive in pipeline; the Tata India Dynamic Equity inbound fund (USD 500 NRI ticket, ~2.5% all-in TER) is a *domestic-equity* route, not outbound.
- [x] **The DSP fund-level tax position** — tax at the fund's PAN (not the investor's), no investor-side CG on redemption, no TDS, no Schedule FA; reported fund-level rates 14.95% LTCG (>24mo) / 42.74% STCG. This is the primary anchor that **resolves the Wave 22 open conflict** (the Deepak-Wealth secondary guide's "foreign-asset + Schedule FA" view is superseded for DSP schemes, with the offer document as the per-scheme tie-breaker).
- [x] **The TER cost-decay spread** — 0.32 pp/yr between a VOO-class direct ETF (0.03%) and the PPFAS S&P 500 FoF all-in (0.35%); up to 1.4 pp/yr vs the DSP active fund; ~₹65k–90k on a ₹5L sleeve over 20 years.

### Pipeline (all green)
- [x] `npx vitest run` → 166 passed.
- [x] `node scripts/validate-content.mjs` → 53 articles, 4 books, 60 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 219 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 53/53 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 96 passed (48 desktop + 48 mobile).

## Wave 22 session (verified 2026-10-18 via web research)
## Wave 22 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/international/international-gift-city-ifsc-tax-timing-deep-dive.mdx` — the *operational GIFT City / IFSC* layer (the route-selection article covered "which route"; this covers "how the GIFT City route actually behaves in your hands"): why it stays open (IFSCA-regulated, outside the SEBI $7B cap, bought under the personal LRS), the **AY 2026-27 Section 50AA debt-based "Specified Mutual Fund" redefinition** that now reaches 12.5% no-pool LTCG for non-specified international FoFs, the **two coexisting tax treatments** on GIFT City gains (Indian-side 12.5% no-indexation LTCG + Schedule FA vs fund-level post-tax NAV with no separate CG compute — the offer document is the tie-breaker), the **TCS 20% reservation math** (₹10L aggregate threshold, the 1 Apr 2026 2% education/medical/tour cut, the aggregate-not-per-remittance rule), the live 2026 scheme list, the fresh FCA + KYC onboarding that does not carry over, and the Schedule FA / FAST-DS disclosure layer.

### New finance function + calculator + tests
- [x] `giftCityLrsTaxFY27()` in `src/lib/finance/index.ts` — the LRS aggregate outflow, the TCS-able portion above the ₹10L threshold, the 20% TCS and the "cash needed at source" reservation, the TCS-as-%-of-investment ratio, the USD 250k cap check at an assumed USD/INR, and **both** tax treatments side by side (Indian-side foreign-asset 12.5% LTCG / slab STCG + Schedule FA note, and the fund-level post-tax-NAV "no separate CG" figure), with the TCS-recoverable flag.
- [x] `gift-city-lrs-tax` calculator page (category: International) — 6 inputs (invest Rs, prior LRS outflow, months held, expected gain %, slab %, USD/INR), 7 result rows, ECharts 3-bar remittance cash-flow chart (Investment / TCS / At source).
- [x] 8 new unit tests (20% TCS above the 10L threshold, zero-TCS at the threshold, the aggregate prior-outflow accumulation, the TCS-reservation ratio, the 24-month STCG→LTCG flip, the correct-rate gain tax at both treatments, the fund-level zero-investor-CG position, and the USD 250k cap check at 84 INR/USD) — **158/158 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels and the chart container — the ECharts canvas title is deliberately *not* asserted, per the Wave 19 gotcha) — **92/92 e2e tests pass**.

### New sources
- [x] `src-intl-fof-treatment-ay2026-27` — the Foliyo / ex-HDFC-Private-Wealth guide: the AY 2026-27 50AA debt-test, the 12.5% no-pool LTCG reaching non-specified int'l FoFs, the Act-2025 renumbering (111A→196, 112→197, 112A→198, 50AA→76), and the fund-level post-tax-NAV position.
- [x] `src-gift-city-live-funds-2026` — the Deepak Wealth 2026 GIFT City guide: the live scheme list (PPFAS S&P 500 FoF, PPFAS Nasdaq 100 FoF, DSP GIFT City Global Equity Fund, Tata GIFT City Fund, HDFC passive in pipeline), the fresh FCA + KYC onboarding, the LRS/TCS specifics, and the IFSCA Act 2019 anchor.

### Build gotcha hit this session
- **Calculator array-insertion brace bug (recurring, now Wave 10/11/12/14/21 class)** — inserting the `gift-city-lrs-tax` entry before the `];` tail dropped the previous `54ec-tranche-tracker` entry's closing `},` → "braces UNBALANCED" (1116 vs 1115). Fixed by restoring the `},` and re-running `_check_calc_braces.mjs` (now BALANCED, 34 entries). This is the same bug that has recurred since Wave 10; the post-insertion brace check is now a hard gate.
- **USD cap arithmetic miscalculation in a new unit test** — the first draft asserted ₹25L "exceeds the USD 250k cap" at 84 INR/USD, but the cap is ~₹2.1 cr, so it does not. Corrected the test to ₹1.5 cr prior + ₹0.8 cr invest = ₹2.3 cr (over) vs a small outflow (under). Same "run the unit test after writing it" lesson as Wave 20.

### Research verified this session
- [x] **AY 2026-27 Section 50AA debt-test** — "Specified Mutual Fund" is now a debt-based >65% test (annual average of daily closing figures); a non-specified int'l equity FoF can get 12.5% no-indexation LTCG after 24 months (unlisted) / 12 months (listed) instead of the old forever-slab treatment. Income-tax Act 2025 renumbers 50AA→76, 112A→198, 112→197, 111A→196, effective 1 Apr 2026.
- [x] **The two coexisting GIFT City tax treatments** — Indian-side foreign-asset (12.5% LTCG >24mo, slab STCG, Schedule FA mandatory) vs fund-level post-tax NAV (no separate investor-side CG); the scheme's offer document is the tie-breaker. This is an honest conflict and the article flags it explicitly rather than picking one.
- [x] **TCS reservation specifics** — ₹10L aggregate TCS-free threshold (raised from ₹7L by Finance Act 2025); 20% on the "other / investment" bucket; education / medical / overseas-tour dropped to 2% from 1 Apr 2026 (Finance Act 2026); TCS is a credit recovered at ITR, not a cost.
- [x] **Live GIFT City scheme list + fresh onboarding** — PPFAS S&P 500 FoF / PPFAS Nasdaq 100 FoF / DSP GIFT City Global Equity Fund / Tata GIFT City Fund live; HDFC Developed + Emerging Markets passive in pipeline; fresh FCA (HDFC/ICICI/Axis IFSC Banking Units) + fresh KYC, no carryover from a domestic folio.

### Pipeline (all green)
- [x] `npx vitest run` → 158 passed.
- [x] `node scripts/validate-content.mjs` → 52 articles, 4 books, 59 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 218 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 52/52 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 92 passed (46 desktop + 46 mobile).

## Wave 21 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-54ec-tranche-tracker.mdx` — the *operational* layer over Section 54EC (the rollover article covered "whether 54EC shelters your gain"; this covers "what the 54EC mechanism does across time and issuers"): the 6-month investment window (non-compliant = zero exemption, the whole gain re-taxed), the proportional min(gain, reinvested) rule applied tranche-by-tranche, the 5-year lock-in, the **early-redemption reversal** (exemption withdrawn, original gain re-taxed at 12.5% no-indexation — redeeming early cancels the saving and still costs coupon tax), a 3-scenario worked example on a ₹40L gain / ₹30L REC tranche, the REC vs PFC vs HUDCO vs IRFC issuer/coupon comparison, the ₹50L cap binding large gains (and its quiet overlap with the standard-PMS rung from the capital-ladder article), and the "when 54EC is the wrong tool" layer (54 house route beats 54EC; a planned pre-year-5 exit is the worst case).

### New finance function + calculator + tests
- [x] `fiftyFourECTrancheTracker()` in `src/lib/finance/index.ts` — the compliant-only exemption (min of gain and cap-bound tranche, zero when bought after the 6-month window), the tax saved vs the 12.5% no-rollover baseline, the early-redemption reversal (exemption lapsed × 12.5%), the coupon interest accrued on the capped principal taxed at the slab rate, and the total net effect.
- [x] `54ec-tranche-tracker` calculator page (category: Tax) — 6 inputs (original gain, tranche, months from sale, months held (-1 = maturity), coupon %, interest months), 8 result rows with a three-state status label (HELD / REVERSED / NON-COMPLIANT), 5-bar ECharts tranche-economics chart.
- [x] 8 new unit tests (proportional exemption, the 50L cap binding, non-compliant window-zeroes-exemption + full-gain reversal, early-redemption cancellation, held-to-maturity net saving, coupon accrual + slab tax, zero-gain edge, redemption-strictly-worse-than-holding) — **150/150 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the article asserts the unique `The six-month window` / `The five-year lock-in` / `The early-redemption reversal` headings) — **88/88 e2e tests pass**.

### Build gotcha hit this session
- **Interface-deletion side effect** — inserting the new `FiftyFourECTrancheInput`/`-Result` interfaces via an edit that used the `RolloverInput` interface block as the anchor *replaced* it, leaving `RolloverResult` referencing a now-missing type. Caught by the unit-test compile; restored the `RolloverInput` interface in a follow-up edit. Lesson: when using a named interface block as an edit anchor, verify the anchor still exists after the edit.
- **Reversal semantics** — the first function draft made the non-compliant case reverse only the exemption-captured amount (zero), but a tranche bought after the window shelters *nothing*, so the *whole original gain* is taxed; corrected `exemptionLapsed` to `!compliant ? originalGain : earlyRedemption ? baseExempt : 0`.

### Research verified this session
- [x] **54EC operational structure** — 6-month investment window (allotment within window), 5-year lock-in, ₹50L reinvestment cap, 12.5% no-indexation base post-Finance-No.2 Act 2024, slab-taxed coupon; noted the Income-tax Act 2025 renumbering (54EC → Section 85, effective 1 Apr 2026, issuer notices already re-titled "CGTE bonds u/s 85" — the old section number is still used in practice).
- [x] **Notified-bond issuers** — REC (Series XX w.e.f. 1 Apr 2026), PFC, HUDCO, IRFC, NHAI; coupons in the ~6.5–7.5% band (REC/PFC/HUDCO issuer-notice cross-checks).
- [x] **Early-redemption reversal** — withdrawal of the 54EC exemption on pre-lock-in transfer, original gain taxed as LTCG; consistent with the rollover article's "two exemption-breakers" framework.

### Pipeline (all green)
- [x] `npx vitest run` → 150 passed.
- [x] `node scripts/validate-content.mjs` → 51 articles, 4 books, 57 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 217 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 51/51 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 88 passed (44 desktop + 44 mobile).

## Wave 20 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/personal-finance/pf-capital-ladder-10l-to-1cr.mdx` — the *capital-ladder* layer that answers the user's "I have ₹10L now but can get more later" question directly: the four SEBI rung thresholds in order (SIF ₹10L PAN-level · MF Regs 2026, eff 1 Apr 2026; PMS/PRIM + AIF-employee ₹25L · PM Regs 2026, eff 1 Apr 2027; standard PMS ₹50L, which also meets the ₹50L 54EC cap; AIF ₹1Cr HNI route), the corpus math for when each door opens (SIP + an optional future lump-sum event), the surcharge-tier shift as income climbs (new-regime 10% > 50L, 15% > 1Cr, 25% cap > 2Cr), a full worked example (₹10L corpus + ₹50k SIP + ₹5L bonus at month 12), and the honest "when a higher rung is the wrong tool" layer (fee-crossover, the ₹25L AIF-employee exception trap, the 1 Apr 2027 PRIM date).

### New finance function + calculator + tests
- [x] `capitalLadderFY27()` in `src/lib/finance/index.ts` — month-by-month corpus trajectory (lump + SIP + optional event), first-month crossing of each of the four rung thresholds, the next-locked-rung report, and the new-regime surcharge-tier comparison between a current and a future income level.
- [x] `capital-ladder` calculator page (category: Personal Finance) — 7 inputs (corpus, SIP, expected return, future event ₹ + month, current/future income), 8 result rows, ECharts step chart (rung thresholds + months-to-unlock line).
- [x] 8 new unit tests (rung-threshold ordering, 10L-already-SIF-unlocked, next-locked-rung, all-unlocked-at-1.5Cr, event-accelerates-rungs, all-locked-zero-corpus, surcharge-tier-shift, corpus-compounding-monotonicity) — **142/142 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the article test asserts the unique `The four rungs, in order` and `The surcharge-tier shift` headings, avoiding the recurring strict-mode double-heading collision) — **84/84 e2e tests pass**.

### Research verified this session
- [x] **SIF ₹10L minimum** — SEBI (Mutual Funds) Regulations 2026, introduced 27 Feb 2026, effective 1 Apr 2026; PAN-level aggregate across all SIF strategies of one AMC; ₹13,814 Cr SIF assets by May 2026 (SEBI / etmoney / policycircle cross-checks; the government SEBI PDF is behind a JS shell, corroborated via secondary sources).
- [x] **PRIM ₹25L MF-only PMS route** — SEBI (Portfolio Managers) Regulations 2026 (replaces the 2020 framework), effective 1 Apr 2027; opens IPO / unlisted-debt / overseas-sec avenues to managers and adds the ₹25L mutual-fund-only "PRIM" portfolio route (PTI / ET / 5paisa / cafemutual).
- [x] **AIF ₹1Cr / ₹25L employee-director** — the general HNI AIF minimum is ₹1Cr; eligible employees/directors of a portfolio company can enter at ₹25L (aequitas / pcjholdings AIF guides, cross-checked against the hnw-pms-aif-sif-selection article already in the corpus).
- [x] **Surcharge tiers new regime FY 2026-27** — 10% above ₹50L, 15% above ₹1Cr, 25% cap above ₹2Cr (the 37% old-regime tier above ₹5Cr is abolished for the new regime); 4% cess on top. `src-surcharge-cess-fy2026-27` already registered and consistent.

### Build gotcha hit this session
- **Unit-test expected-value miscalculation (new test)** — the first version of the "event-accelerates-rungs" test asserted the ₹25L event with zero SIP never reaches ₹50L within 30 years; at 9% p.a. the 25L compounds to 50L in ~93 months and 1Cr in ~186 months, both inside the horizon. Fixed by asserting `93 < months < 96` and `180 < months < 190` for the PMS and AIF rungs respectively. Recurring theme: **always run the unit test after writing it** — the trajectory math is easy to eyeball wrong.

### Pipeline (all green)
- [x] `npx vitest run` → 142 passed.
- [x] `node scripts/validate-content.mjs` → 50 articles, 4 books, 57 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 216 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 50/50 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 84 passed (42 desktop + 42 mobile).

## Wave 19 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-esop-vesting-tax-walkthrough.mdx` — the *two-stage ESOP/RSU lifecycle* layer (the existing `tax-esop-stock-grants` article covered the framework at surface level; this is the full worked math): the lifecycle table (grant → vesting/exercise → perquisite → FMV cost-base step-up → sale → CG-head selection), how FMV is fixed (listed: open+close average; unlisted: Category-I merchant-banker valuation within 180 days), the 80-IAC deferral (60-month window for shares allotted on/after 1 Apr 2026; 48-month for earlier; only DPIIT+IMB-certified startups), the TDS 192→392 Act-2025 migration, two full worked examples (listed company ₹10L grant + unlisted startup ₹10L perquisite with deferral), the "taxed before you can sell" trap + three escape hatches, the Schedule FA / FAST-DS foreign-parent layer, the advance-tax obligation on the CG stage (which the employer does NOT cover), and an ITR filing checklist.

### New finance function + calculator + tests
- [x] `esopVestingTaxFY27()` in `src/lib/finance/index.ts` — Stage 1 perquisite (FMV − exercise price) × shares, slab-placed into the salary pool for the incremental-tax math, the FMV cost-base step-up, the Stage 2 CG head selection (112A listed LTCG / 111A unlisted LTCG / Sec 112 STCG at the combined marginal rate), the shared ₹1.25L annual 112A pool consumption, 4% cess + surcharge, the 80-IAC deferral flag, and TDS netting.
- [x] `esop-vesting-tax` calculator page (category: Tax) — 10 inputs (shares, exercise price, FMV, sale price, listed flag, months held, other salary, other 112A LTCG, startup deferral flag, TDS already deducted), 8 result rows, ECharts 4-bar split (Stage 1 / Stage 2 / Surcharge / Total).
- [x] 8 new unit tests (perquisite math, cost-base step-up, 112A pool consumption, listed-vs-unlisted head split, STCG marginal rate, 80-IAC deferral flag, TDS netting, zero-share edge) — **134/134 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile) — **80/80 e2e tests pass**.

### Build gotchas hit this session
- **e2e chart-title assertion bug (new test)** — the first version asserted `getByText('Where the two-stage ESOP tax lands')` (the ECharts `chart.title`), which renders *inside the canvas*, not as DOM text → 5s timeout. Fixed by asserting a results-row DOM label (`'Stage 1 incremental slab tax'`) and keeping the `[role="img"]` canvas check.
- **e2e strict-mode heading collision (new test)** — `/Worked walk-through/` matched **two** H2s (listed company + unlisted startup) → "multiple elements found". Fixed by asserting both unique headings (`/Worked walk-through: listed company/` and `/Worked walk-through: unlisted startup/`). Same class of bug as the Wave 18 `Sources & citations` collision; the new gotcha: **any heading text used by two H2s in one article fails a non-`.first()` assertion**.

### Research verified this session
- [x] **80-IAC 60-month window** — shares allotted on/after 1 Apr 2026 get the 60-month (5-year) deferral; earlier allotments keep 48 months; the deferral resets on sale, leaving the company, or expiry — whichever is earliest; employer must hold the DPIIT+IMB certificate.
- [x] **TDS 192 → 392** — Income-tax Act 2025 (effective 1 Apr 2026) renumbers the perquisite-TDS section; the amount and the timing are unchanged; Form 64C/64D → 78/79 for FY 2025-26 filings.
- [x] **FMV cost-base step-up** — Sec 49(2AA) / Act-2025 Sec 73: the FMV at exercise becomes the cost of acquisition for the CG head, so the salary-taxed slice is never re-taxed as CG.
- [x] **Two worked examples verified** — listed company (1000 shares, Rs 500 exercise, Rs 1500 FMV, Rs 1800 sale, 15 months): perquisite Rs 10L, LTCG head 112A; unlisted startup (same numbers, 24+ months): perquisite Rs 10L deferred under 80-IAC, CG head 111A at the marginal rate.

### Pipeline (all green)
- [x] `npx vitest run` → 134 passed.
- [x] `node scripts/validate-content.mjs` → 49 articles, 4 books, 57 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 215 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (18,869 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 49/49 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 80 passed (40 desktop + 40 mobile).

## Wave 18 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/international/international-dtaa-country-rate-reference.mdx` — the *corridor rate reference* layer (the NRI tax article references DTAA relief but had no country-by-country rate table; this is the genuine remaining gap in the international category): the 11-corridor table (US/UK/SG/AU/CA 15%, DE/NL/JP/FR 10%, UAE 12.5% interest-exemption-method, domestic-only 30%), the Sec 90/90A + 159(4) lower-rate rule (treaty wins only when TRC + Form 41 supplied), the exemption-method corridors (UAE/Saudi/Kuwait: home country taxes nothing, India is the only tax), the credit-method corridors (US/UK/DE/SG/AU/CA: home country credits India tax via Form 67, s.91 cap = lesser of India-paid and home-tax), the capital-gains caveat (most treaties don't reduce share/property-gains withholding), the surcharge+cess stacking on the reduced rate, a ₹10L NRO interest worked example × 4 corridors, and a Mermaid claim-sequence flow diagram.

### New finance function + calculator + tests
- [x] `dtaaReliefFY27()` in `src/lib/finance/index.ts` — compares domestic TDS vs treaty-withholding with surcharge + 4% cess multipliers, models s.91 foreign-tax-credit cap (lesser of India-paid and home-country tax), returns the treaty-route net additional tax, the two total-tax-burden figures (domestic-route vs treaty-route), and the exemption/credit-method flags.
- [x] `dtaa-rate-reference` calculator page (category: Tax) — 5 inputs (income, 11-corridor select, domestic rate, home-country tax, surcharge), domestic-vs-treaty all-in split, s.91 credit row, 2-bar ECharts comparison.
- [x] 7 new unit tests (treaty-halves-withholding, surcharge+cess-applied-to-both, effective-rate-multiplier, exemption-method-corridor-residenceTax-0, credit-method-corridor-cap, home-tax-exceeds-India-side, clamp-rates-0-1) — **126/126 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; heading-collision fix: article body uses `## Sources`, not `## Sources & citations`, to avoid strict-mode collision with the page's auto-rendered heading at `src/pages/articles/[id].astro:130`) — **76/76 e2e tests pass**.

### Research verified this session
- [x] **DTAA corridor rates FY 2026-27** — US/UK/SG/AU/CA 15% (dividends+interest), DE/NL/JP/FR 10%, UAE exemption-method for interest, domestic TDS 30% NRO (crosscheckai 97-treaty aggregator, TaxClue ITA 2025 guide, PIB/Budget cross-checks; government incometaxindia page was 403-blocked, corroborated via secondary aggregator + CA-reviewed sources).
- [x] **Exemption vs credit method by corridor** — exemption: UAE/Saudi/Kuwait (home country taxes nothing); credit: US/UK/DE/SG/AU/CA (home country credits India tax); s.91 cap = lesser of India-paid and home-tax paid.
- [x] **Capital-gains caveat** — most DTAAs don't reduce the 12.5% (no-indexation) share/property LTCG withholding; the corridor table applies to interest/dividends/royalties only.
- [x] **Form 41 (formerly 10F) migration** — Income-tax Act 2025 (effective 1 Apr 2026) renumbers Form 64C/64D → 78/79; Form 10F → 41 for FY 2026-27 onward; FY 2025-26 still uses old form numbers.

### Build gotcha hit this session
- **e2e strict-mode heading collision** — the new article body used `## Sources & citations`, which matched the page's auto-rendered `<h2>Sources & citations</h2>` at `src/pages/articles/[id].astro:130`, causing `getByRole('heading', {name: /Sources & citations/})` to find 2 elements → test failure. Fixed by renaming the body heading to `## Sources` (matching the convention of all 47 existing articles). The test was then written to assert on the less-ambiguous `Corridor reference` / `How to claim` / `Sources` headings instead.

### Pipeline (all green)
- [x] `npx vitest run` → 126 passed.
- [x] `node scripts/validate-content.mjs` → 48 articles, 4 books, 57 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 159 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (18,625 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 48/48 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 76 passed (38 desktop + 38 mobile).

## Wave 17 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-capital-gains-rollover-54-54f-54ec.mdx` — the *capital-gains reinvestment* layer (the complement to the loss-harvesting article): the 54/54F/54EC route table (what you sold → what you reinvest in, with the time windows: 54EC 6-month, 54 purchase 1yr-before/2yr-after or construction 3yr, 54F 2yr), the **proportional rule** (exemption = min(gain, reinvested), so "I sold for ₹1Cr" is the wrong mental model), the two exemption-breakers (a missed window and a non-long-term gain), the CGAS escape valve, the post-2024 12.5% no-indexation base + the ₹10 Cr new-asset cap, and the NRI angle (the rollover also cuts the 195 TDS).

### New finance function + calculator + tests
- [x] `rolloverExemption()` in `src/lib/finance/index.ts` — the proportional rule (exempt = min(gain, reinvested)), the 54EC ₹50L reinvestment cap, the 54/54F no-binding-cap branch, and the two breakers (a missed time window or a short-term gain zeroes the exemption), returning the exempt amount, taxable balance, tax saved, and the no-rollover bill.
- [x] `capital-gains-rollover` calculator page (category: Tax) — 6 inputs (gain, reinvested, route select, time-compliant flag, LTCG flag, rate), the 5 result rows, and an exempt-vs-taxable bar chart that turns amber when the exemption is broken.
- [x] 7 new unit tests (the 5L-on-8L proportional case, full reinvestment, the 54EC ₹50L cap binding, 54/54F no cap, the time-window-break, the short-term-gain-break, and zero gain) — **119/119 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile) — **72/72 pass**.

### Research verified this session
- [x] **Post-2024 capital-gains rationalisation** — holding periods simplified to 1 year (listed) / 2 years (other), LTCG at 12.5% without indexation, the 112A exemption raised to ₹1.25L, reinvestment benefits unchanged in structure (CBDT Budget-2024 capital-gains FAQ, PIB 24 Jul 2024 — primary source).
- [x] **The three rollover routes** — 54 (house→house, 1yr-before/2yr-after purchase or 3yr construction), 54F (any-asset→house, 2yr), 54EC (house-gain→notified infrastructure bonds NHAI/REC/PFC/IRFC, ₹50L cap, 6 months, bond must be held) (TaxClue 54EC + 54F guides).
- [x] **The two breakers + CGAS + the ₹10 Cr cap + NRI eligibility** — a missed window or a non-LTCG gain zeroes the exemption; the CGAS parks unspent consideration; the 54/54F new-asset-cost cap is ₹10 Cr (AY 2024-25+); all routes work for NRIs and also cut the 195 TDS (calcguru NRI rollover guide).

### Build gotcha hit this session
- The recurring calculator-array brace bug: inserting the `capital-gains-rollover` entry dropped the `nri-india-tax` entry's closing `},` → "Unexpected token" at the new entry's opening brace. Fixed by restoring the `},`; now the standard post-edit check is `];` count + brace balance (recurring since Wave 10).

### Pipeline (all green)
- [x] `npx vitest run` → 119 passed.
- [x] `node scripts/validate-content.mjs` → 47 articles, 4 books, 56 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 207 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed (18,359 words).
- [x] `node scripts/generate-books.mjs` → 4/4 books, 47/47 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 72 passed (36 desktop + 36 mobile).

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

## Not yet done
- [ ] Deploy to GitHub Pages (owner must enable Pages; CI is configured).
- [ ] Personalization pass on `pf-wealth-plan-10-lakh` once the user answers the 14 questions.
- [ ] Resolve the open 80TTB conflict (`ul-senior-80ttb-limit-2026`): confirm whether the Budget-2026 raise to Rs 1,00,000 is in the Finance Act text - re-run the senior-regime decision if so.
- [ ] **Act-2025 54EC -> Section 85 renumbering:** confirm the operative section number for FY 2027-28 filings; add a new update-log entry if the FY 2027-28 Budget renumbers it back. (Noted in Wave 21; current practice still uses "54EC" informally.)
- [ ] **Per-scheme CA confirmation** for each live GIFT City house (PPFAS / DSP / Edelweiss / Marcellus / Tata) — flagged in Wave 23 as a 30-min call, not a structural unknown; the DSP fund-level position (14.95% / 42.74%, no SchFA) is the primary anchor.
- [ ] Phase 4 deeper expansion: Wave 25 candidate = the 10L personalized-wealth-plan rewrite driven by the user's answers to the 14 questions, or a FAST-DS 2026 worked-declaration example (the two-category math) that pairs with the direct-LRS filing article.

## Next 3 actions
1. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers (the 10L capital-ladder article now gives the roadmap that the rewrite plugs into).
2. Continue the daily article habit (Wave 25 candidate: a FAST-DS 2026 worked-declaration example — the two-category (Rs 1 cr specified-tax / Rs 5 cr flat-fee) math that closes the disclosure layer opened in Wave 24).
3. Resolve the 80TTB conflict and re-verify time-sensitive claims at their reviewAfter dates.

## Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Use "up to ₹X" / "under N months" instead.
- **MDX bare `=` / `<=`:** a bare `=` (or `<=`) outside a `$...$` math block or an attribute value breaks the MDX/JSX build with "Unexpected character `=`" (hit in Wave 13). Reword to "is" / "up to" / "equals"; `\;=\;` inside `$...$` and `href="..."` are safe.
- **Calculator array-insertion brace:** inserting a new calculator entry in `src/lib/calculators.ts` by replacing the `},\n];` tail has repeatedly (Waves 10/11/12/14) either dropped the previous entry's closing `},` or left a duplicate `];`. After every insertion, verify `]`-close count is exactly 1 before `export function getCalc` and that the previous entry ends with `},\n  },` (use `_check_calc_braces.mjs`).
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use the system `npx` on PATH (Node v24.18.0).
- **e2e heading collision:** the page auto-renders a `Sources & citations` `<h2>` at `src/pages/articles/[id].astro:130`. Article body headings must use `## Sources` (not `## Sources & citations`) to avoid strict-mode collision (hit in Wave 18).
- **e2e chart-title assertion:** ECharts `chart.title` renders *inside the canvas*, not as DOM text — `getByText('<chart title>')` will 5s-timeout. Assert a results-row DOM label instead, and keep the `[role="img"]` check for the canvas (hit in Wave 19).
- **e2e strict-mode double-heading:** any heading text used by two H2s in one article fails a non-`.first()` assertion ("multiple elements found"). Write assertions on the *unique* suffix (e.g. `Worked walk-through: listed company` not just `Worked walk-through`) (hit in Wave 19; same class as the Wave 18 collision).
- **Scratch scripts:** keep one-off registry scripts (`_register-waveN.mjs`) for audit; delete transient inspection scripts.
