# DhanPedia — Progress

Last updated: **2026-10-18** (Wave 20: 1 new article + 1 new finance function + 1 new calculator + 8 unit tests + 2 e2e tests; 49 → 50 articles; 33 calculators; all pipeline green)

## State

- **Articles:** 50 on disk / registered. Wave 20 added 1: `pf-capital-ladder-10l-to-1cr` (the *capital-ladder* layer that answers the user's "I have ₹10L now but can get more later" question: the four SEBI rung thresholds in order — SIF ₹10L (PAN-level, MF Regs 2026, eff 1 Apr 2026), PMS/PRIM + AIF-employee ₹25L (PM Regs 2026, eff 1 Apr 2027), standard PMS ₹50L (which also meets the ₹50L 54EC cap), AIF ₹1Cr HNI route — the corpus math for when each door opens (SIP + optional future lump-sum event), the surcharge-tier shift as income climbs (new-regime 10% > 50L, 15% > 1Cr, 25% cap > 2Cr), a full worked example (₹10L corpus + ₹50k SIP + ₹5L bonus at month 12), and the honest "when a higher rung is the wrong tool" layer). Wave 19 added 1: `tax-esop-vesting-tax-walkthrough` (the *two-stage ESOP/RSU lifecycle* layer: the exercise-date perquisite (FMV minus exercise price, slab tax on salary), the FMV cost-base step-up under Sec 49(2AA)/Act-2025 Sec 73, the CG-head selection (112A listed LTCG pool vs 111A unlisted LTCG vs Sec 112 STCG at the marginal rate), the shared ₹1.25L annual 112A pool, 4% cess + surcharge stacking, the 80-IAC 60-month startup deferral, the TDS 192→392 Act-2025 migration, the "taxed before you can sell" trap + three escape hatches, the Schedule FA / FAST-DS foreign-parent layer, the advance-tax obligation on the CG stage, two full worked examples (listed ₹10L grant + unlisted startup with deferral), and an ITR filing checklist).
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 18, indian-taxation 15 (+ tax-esop-vesting-tax-walkthrough in Wave 19), p2p-lending 4, wealth-beyond-10l 16. Wave 20 added `pf-capital-ladder-10l-to-1cr` as a chapter to both complete-indian-investor and wealth-beyond-10l.
- **Sources:** 57 in `sources.json` (Wave 20 reused 4 existing sources: `src-sebi-sif-2026`, `src-pms-aif-fees-2026`, `src-aif-categories-2026`, `src-surcharge-cess-fy2026-27` — no new source needed).
- **Update-log:** 56 tracked (Wave 20 added `ul-capital-ladder-rungs-fy2026-27`, reviewAfter 2027-04-17 — the four SEBI rung thresholds + FY 2026-27 surcharge tiers).
- **Calculators:** 33 (Wave 20 added `capital-ladder`, powered by the new `capitalLadderFY27()` pure function, with 8 unit tests and 2 e2e tests).

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
- [ ] Phase 4 deeper expansion: Wave 21 candidate = GIFT City FoF deep-dive, a 54EC tranche-tracker, or the personalized `pf-wealth-plan-10-lakh` rewrite once the user answers the 14 questions.

## Next 3 actions
1. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers (the 10L capital-ladder article now gives the roadmap that the rewrite plugs into).
2. Continue the daily article habit (Wave 21 candidate: GIFT City FoF deep-dive or a 54EC tranche-tracker).
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
