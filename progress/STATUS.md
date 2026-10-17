# DhanPedia — Progress

Last updated: **2026-10-18** (Wave 31: 1 new synthesis article + 1 new finance function + 1 new calculator + 8 unit tests + 2 e2e tests; 60 → 61 articles; 43 calculators; 21 wealth-beyond-10l chapters; all pipeline green)

## State

- **Articles:** 61 on disk / registered. Wave 31 added 1: `pf-corpus-allocation-blender` (the *synthesis / sizing* layer that fuses every avenue article into ONE screen: "I have this corpus at this risk grade — where does the next rupee go?"). It computes the risk-grade sleeve mix (after dropping the entity-only / international / SIF-gated sleeves and normalizing to 1), which of the four professional avenues (SIF ₹10L / ODI ~₹20L individual proxy / PMS ₹50L / AIF ₹1Cr) are actually **unlocked** at this corpus, the **blended after-tax planning return** (weight-average of the surviving sleeves), and the **front-load fraction** (corpus ÷ next-locked-avenue threshold) that parks the corpus-to-door slice in the low-cost build-up. All sleeve returns are labelled **after-tax planning figures** (equity ~8.5%, sovereign debt ~5.5%, gold ~6%, international ~7.5%, professional alt ~8-9%), not forecasts; the professional-alt sleeve is entity-gated and SIF-₹10L-gated; the ODI gate is the individual LRS ~₹20L proxy (the entity 400%-of-net-worth route is a separate layer). Web-verified 2026-10-18: the four avenue gates re-anchored to `src-sebi-sif-2026`, `src-pms-aif-fees-2026`, `src-aif-categories-2026`, `src-odi-rules-2026` (the 26 May 2026 400% amendment), and `src-surcharge-cess-fy2026-27`. **Caught a hand-computed table error before shipping:** the individual aggressive-grade row (and the "growth beats aggressive" narrative) were wrong; the real function shows the blended return rises *monotonically* with risk grade for an individual (6.6/7.3/7.8/7.9%), so the table + narrative were corrected and re-verified against the live function. Wave 30 added 1: `international-odi-route-eligibility` (the *outbound-investment* layer — "the side that invests *into* a foreign entity," which the personal LRS / GIFT City / FAST-DS cluster deliberately does not cover): ODI vs OPI vs personal-LRS (the ODI definition = unlisted equity / a listed stake of 10% or more / any control stake; a listed under-10% no-control position is **OPI**, not ODI), the **entity 400%-of-net-worth automatic route** (the 26 May 2026 amendment raising it from 300%) with the **USD 1B/FY prior-approval trigger**, the **individual LRS USD 250k/FY equity-only** ODI limit, the **entity-vs-individual reclassification** that turns a "not permitted" personal ODI into a clean automatic-route ODI, the **Form FC-ODI** post-fact filing (+ the ~₹7,500 late-fee) that a skipped filing turns into a [FEMA 3x / compounding](./tax-fema-exchange-control-exposure.mdx) exposure, and a ₹20 cr company / USD 2M foreign-start-up worked example. (the *exchange-control* layer — "the side FAST-DS does NOT settle": a position regularised on the tax / Black Money Act side still carries a *separate, RBI-administered* exposure under FEMA 1999, priced by the **Section 13(1) penalty of up to 3× the breaching sum** (LRS over-limit / NRO over the USD 1M window / ODI over the individual limit — *the remittance, not the asset value*) and the **Section 15 compounding route via PRAVAAH** (up to a ₹5 cr sum, the 2025 amendment capping certain fees at ₹2,00,000, and the *non-compoundable* Section 3(a) hawala exception). The structural point: **two regulators, two ledgers, two filings** — tax/BMA and FEMA are independent, and settling one does not close the other). Wave 28 added 1: `pf-capital-inflow-migration`. (the *scheduling / deployment* layer that turns the static 10L capital ladder into a *personal plan*: a sequence of **discrete future capital events** — a promotion, an ESOP exit, an inheritance — landing at **known months**, and the question "at the moment each rung opens, what **deployable margin** do I move *up* into the next instrument (SIF → PMS/PRIM → standard PMS → AIF)?"). It reuses the four SEBI rung thresholds from the ladder article but adds: the *inflow-as-unlocking-event* model (a bonus that lands at a boundary is what opens that door, not the slow SIP), the **PMS/PRIM 1-Apr-2027 commencement-date** limit (the ₹25L MF-only route is not purchasable before then), the **fee-crossover go/no-go** limit, and a 3-inflow worked migration plan (₹10L + 3 inflows → which inflow opens which rung). Wave 27 added 1: `tax-fastds-valuation-guard-due-diligence`. (the *valuation + due-diligence* layer that the FAST-DS and BMA articles point to: the fixed **31 March 2026 valuation date** (Rule 2(1)(e)), the **Rule 3 per-asset-class FMV methods** (including the Rule 3(1)(e) bank-account *accumulated-deposit* method that most people misread, and the indexed-cost deemed-FMV fallback), the **Rule 3(4)/(5) RBI-reference-rate / two-stage-USD currency conversion**, the **Rule 5(2) 20% valuation-variance safeguard** (the declaration stands on the *declared* value only while the variance is within 20% of it; above that the charge re-computes on the *higher determined* value — so undervaluing is the active risk), the **document checklist** for Forms 1→2→3→4, the **1%/month late-payment interest** (Rule 7), the pre-valuation eligibility gate, and the **limited immunity** that regularises the tax/BMA side but does *not* settle FEMA). (the *Black Money Act counterfactual* layer — the "what if you do nothing" price that the FAST-DS amnesty exists to avoid): the Section 40 30% tax on an undisclosed foreign asset + the Section 41 penalty of 3× the tax (90% of value, a **120% total**) + the flat **₹10L-per-defaulting-year** Section 43/44 Schedule-FA omission penalty, the **Finance Act 2026 exception** (the flat penalty is waived for a *non-immovable* asset at or under **₹20L**, but the 120% is *not*), the per-year compounding trap, the ITAT Special Bench *directory-not-mandatory* reading of the Section 43 "may" word, the three-ways-out decision (FAST-DS / Schedule-FA-going-forward / the open-ended BMA assessment), and the ₹90L-vs-₹30L-vs-₹1L worked spread on a ₹50L/3-yr asset. (the *FAST-DS 2026 worked-declaration* layer — the time-boxed small-taxpayer foreign-asset amnesty the direct-LRS article flagged as layer 5): what FAST-DS 2026 is (Finance Act 2026 Ch. IV §§130–144, Rules notified 15 Aug 2026, window 16 Aug – 31 Dec 2026, reference date 31 Mar 2026), the **two categories** (A = undisclosed up to ₹1 cr at **30% tax + an equal additional amount = 60% of value**; B = already-taxed-but-missed-Schedule-FA up to ₹5 cr at a **flat ₹1,00,000 fee**), the "equal additional amount" gotcha, the **ceiling-decides-category** decision, what the immunity does/doesn't cover, the Form 1 → 2 → payment → 3/4 online sequence before the Principal DGIT (Systems) with the *file-early* lead-time trap, a ₹50L worked example (₹30L Category A vs the flat ₹1L Category B reclassification), and the "when FAST-DS is/isn't the right move" layer. (the *filing-mechanics* layer for a resident Indian who owns US equities directly through a US brokerage under LRS: the five-layer ITR-2 structure — (1) the dividend at the slab rate with the **25% individual US dividend withholding** (the 15% figure is the *corporate-with-voting-stock* rate, not the individual one; 30% is the no-W-8BEN backup) credited via **Form 67** capped at the lesser of the India dividend tax and the US withholding, (2) the capital gain as a **foreign-unlisted security** at **12.5% no-indexation LTCG after 24 months with NO pool** or slab STCG, (3) the **20% TCS** on the LRS investment remittance above the ₹10L threshold (a recoverable credit), (4) **Schedule FA every year with no minimum threshold**, and (5) the **FAST-DS 2026** small-taxpayer window (~15 Aug – 31 Dec 2026) flagged as the *separate* amnesty layer, plus a ₹12L-worked-example and the honest "when the direct route is the right filing posture" layer). Wave 23 added 1: `international-gift-city-live-scheme-comparison`. (the *live-scheme comparison + route-decision* layer: the 2026 live GIFT City scheme table — PPFAS S&P 500 FoF, PPFAS Nasdaq 100 FoF, DSP Global Equity Fund, Edelweiss Greater China, Marcellus Global Equities, the Tata India Dynamic Equity inbound fund, and the HDFC passive pipeline — with TER / min ticket / AUM / launch date; the **tax-treatment resolution** that closes the Wave 22 open conflict on the DSP primary anchor: fund-level 14.95% LTCG / 42.74% STCG, no investor-side CG, no TDS, no Schedule FA; the TER-cost-decay layer; the two-route net-after-tax decision (GIFT City fund-level vs direct LRS 12.5% + Schedule FA + TCS reservation); and the ₹5L-over-5-years worked example that shows the crossover point is ~₹25L+). Wave 22 added 1: `international-gift-city-ifsc-tax-timing-deep-dive`. (the *operational* GIFT City / IFSC layer: why the route stays open (IFSCA-regulated, outside the SEBI $7B cap, bought under the personal LRS), the AY 2026-27 Section 50AA debt-based "Specified Mutual Fund" redefinition that now reaches 12.5% no-pool LTCG for non-specified international FoFs, the **two coexisting tax treatments** on GIFT City gains (Indian-side 12.5% no-indexation LTCG + Schedule FA vs fund-level post-tax NAV with no separate CG compute — the offer document is the tie-breaker), the **TCS 20% reservation math** on the LRS remittance (₹10L aggregate threshold, the 1 Apr 2026 2% education/medical/tour cut, the aggregate-not-per-remittance rule), the live scheme list, the fresh FCA + KYC onboarding, and the Schedule FA / FAST-DS disclosure layer). Wave 21 added 1: `tax-54ec-tranche-tracker`; Wave 20 added 1: `pf-capital-ladder-10l-to-1cr`; Wave 19 added 1: `tax-esop-vesting-tax-walkthrough`.
- **Books:** 4 × 6 formats. Chapter counts: complete-indian-investor 24, indian-taxation 17, p2p-lending 4, wealth-beyond-10l 21. Wave 31 added `pf-corpus-allocation-blender` as a chapter to wealth-beyond-10l; Wave 30 added `international-odi-route-eligibility`.
- **Sources:** 64 in `sources.json` (no new source in Wave 31 — the blender is a synthesis layer; its claims reuse the existing `src-sebi-sif-2026`, `src-pms-aif-fees-2026`, `src-aif-categories-2026`, `src-odi-rules-2026`, `src-surcharge-cess-fy2026-27` registry entries, which is the correct discipline: a synthesis article should anchor to the layered sources, not invent a new one).
- **Update-log:** 67 tracked (Wave 31 added `ul-corpus-allocation-blender-fy2026-27`, reviewAfter 2027-04-17).
- **Calculators:** 43 (Wave 31 added `corpus-allocation-blender`, powered by the new `corpusAllocationBlender()` pure function, with 8 unit tests and 2 e2e tests).

## Wave 31 session (verified 2026-10-18; synthesis layer over the ladder/migration/avenue cluster)

- [x] `src/content/personal-finance/pf-corpus-allocation-blender.mdx` — the *synthesis / sizing* layer: the one-screen answer to "I have this corpus at this risk grade — where does the next rupee go?". Five inputs (corpus / risk grade / entity-or-individual / international appetite / front-load flag), five outputs (sleeve mix / unlocked avenues / next-locked avenue / blended after-tax planning return / front-load fraction).
- [x] `corpusAllocationBlender()` pure function in `src/lib/finance/index.ts`: the risk-grade sleeve mix (entity-only / international / SIF-gated sleeves dropped, then normalized to 1), avenue eligibility against `AVENUE_THRESHOLDS` (SIF 10L / ODI 20L proxy / PMS 50L / AIF 1Cr, ODI entity-gated), `nextLockedAvenue` (the next corpus door), `blendedAfterTaxReturn` (weight-average of the surviving sleeves), and `frontLoadFraction` (corpus ÷ next-locked-avenue threshold, only when the flag is on).
- [x] `corpus-allocation-blender` calculator entry in `src/lib/calculators.ts` (43rd entry; pie chart of the sleeve mix + the five result rows; the ECharts canvas title is deliberately not asserted in e2e, per the Wave 19 gotcha).
- [x] 8 unit tests in `tests/unit/finance.test.ts` (SIF unlocked at 10L / front-load fraction 0.2 at 10L-vs-50L / front-load off → 0 / entity drops the individual alt sleeve / intl-off drops the international sleeve / 1.5Cr entity → all open / alt sleeve gated below the SIF gate / blended return is the weight-average).
- [x] 2 e2e tests in `tests/e2e/smoke.test.ts` (calculator: the three unique result-row DOM labels + the chart container; article: the three unique H2 headings `The one-answer layer` / `The risk-grade sleeve mix` / `Which avenues are actually open` + the TTS button).
- [x] Registry: `articles.json` (60 → 61), `books.json` wealth-beyond-10l (20 → 21 chapters), `update-log.json` (66 → 67). No new `sources.json` entry — the blender is a synthesis article and anchors to the five existing avenue/avenue + surcharge sources (correct discipline: do not invent a source for a synthesis layer).
- [x] **Pipeline green:** 230/230 unit, `generate-books` (4/4 books, 61/61 article downloads), `astro build` (198 pages, the new article + its calculator both rendered), `pagefind` (263 pages), `validate-content` (0 errors), `check-links` (all resolve), `build-report` (4 books × 6 formats + 61 articles all on disk), **128/128 e2e** (64 desktop + 64 mobile, incl. the 2 new tests).

### The Wave 31 gotcha (caught before shipping)
- **Hand-computed table error in the new article.** The first draft's risk-grade table was computed *by hand* and had the individual **aggressive** row wrong (it read equity 56.3% / intl 18.8% / debt 6.3% / gold 6.3% → 6.9%, and claimed "growth beats aggressive"). The real `corpusAllocationBlender()` (run via `vite-node`) shows the individual aggressive mix is equity 64.3% / intl 21.4% / debt 7.1% / gold 7.1% → **7.9%**, and the blended return actually rises **monotonically** with risk grade for an individual (6.6 / 7.3 / 7.8 / 7.9%). Fixed both the table and the narrative ("the entity posture lifts it to ~8.2%, vs 7.9% individual — a few tenths, not a full point, because the individual aggressive mix already leans 64% into the 8.5% equity sleeve"), then re-ran the build + e2e to confirm. **Lesson: never ship a hand-computed allocation table in a Wave that has a live function behind it — run the function and copy its numbers.**

## Wave 30 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/international/international-odi-route-eligibility.mdx` — the *outbound-investment* layer ("invest *into* a foreign entity," the lane the personal LRS / GIFT City / FAST-DS cluster does not cover): the ODI-vs-OPI-vs-LRS definition gate (ODI = unlisted equity / a listed stake of 10% or more / any control stake; a listed under-10% no-control position is OPI, not ODI), the **entity 400%-of-net-worth automatic route** (the 26 May 2026 amendment up from 300%) + the **USD 1B/FY prior-approval trigger**, the **individual LRS USD 250k/FY equity-only** ODI limit, the **entity-vs-individual reclassification** that turns a not-permitted personal ODI into a clean automatic-route ODI (the "good-return, more-capital" lever the user asked about), the **Form FC-ODI** post-fact filing (+ the ~₹7,500 late fee) that a skipped filing turns into a FEMA 3x / compounding exposure, and a ₹20 cr company / USD 2M foreign-start-up worked example.

### New finance function + calculator + tests
- [x] `odiRouteEligibility()` in `src/lib/finance/index.ts` — the ODI-at-all test (unlisted / ≥10% listed / control), the entity 400%-of-net-worth automatic limit in USD, the individual LRS USD 250k equity-only cap, the USD 1B/FY prior-approval trigger, the within-automatic-route verdict, and the Form FC-ODI / LRS+15CA/15CB filing-form selection.
- [x] `odi-route-eligibility` calculator page (category: International) — 6 inputs (investor type, entity net worth, USD commitment, stake %, unlisted flag, control flag), 5 result rows, ECharts 2-bar commitment-vs-automatic-limit chart (the commitment bar turns red when out of route).
- [x] 8 new unit tests (entity automatic-route fit, the USD 1B approval trigger, the above-400%-but-sub-1B case, the individual LRS fit, the individual over-LRS out-of-route, the listed-under-10% OPI exclusion, the listed-≥10% ODI, and the control-stake-under-10% ODI) — **222/222 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **124/124 e2e tests pass**.

### New source
- [x] `src-odi-rules-2026` — the ODI route source (KAMRIT 26 May 2026 omnibus-route update + Resolut / E-Tax Prime / Beacon / Khaitan 2026 ODI coverage + the RBI OI Rules 2022 ODI/OPI definition + the RBI LRS FAQ): the 400%-of-net-worth entity limit (up from 300%), the USD 1B/FY approval trigger, the individual LRS USD 250k equity-only ODI, the ODI-vs-OPI definition, and the Form FC-ODI filing + ~₹7,500 late fee.

### Build gotcha hit this session
- **MDX `<digit` gotcha (recurring, now the `<10%` class)** — the first draft used `listed <10%` / `≥10%` in 4 places; the `<10%` sequences risk an MDX/JSX build error ("Unexpected character"). Reworded to "listed position under 10%" and "10% or more listed" (the documented safe forms), keeping the `≥`/`>=` in the frontmatter description (which is safe). The build stayed green; this is now the standard: **never put a bare `<digit` in prose/tables — use "under N" / "N or more".**
- **No recurring brace bug** — the `odi-route-eligibility` calculator entry was inserted before the `];` tail with the previous entry's closing `},` preserved; `_check_calc_braces.mjs` reported BALANCED on the first run (1403/1403, 42 → 43 entries).

### Research verified this session
- [x] **The 400%-of-net-worth entity ODI limit + the 26 May 2026 amendment** — the automatic-route limit for an Indian entity is 400% of net worth (last audited); the 26 May 2026 RBI amendment to the OI Regulations 2022 raised the omnibus-route limit from 300% to 400% (KAMRIT + Resolut / E-Tax Prime / Beacon cross-checks).
- [x] **The USD 1B/FY prior-approval trigger** — a financial commitment above USD 1 billion in a FY moves to a prior-RBI-approval route, even within the 400% limit (RBI Master Direction on ODI para 5).
- [x] **The individual LRS USD 250k/FY equity-only ODI limit** — a resident individual may make an ODI only in equity capital (no loans / guarantees to a foreign entity), only within the LRS USD 250,000/FY limit combined with all other LRS remittances (RBI LRS FAQ + Khaitan / Resolut).
- [x] **The ODI-vs-OPI definition** — ODI = unlisted equity / a listed stake of 10% or more / any control stake; a listed under-10% no-control position is OPI (the 50%-of-net-worth route), not ODI (the RBI OI Rules 2022 ODI definition).

### Pipeline (all green)
- [x] `npx vitest run` → 222 passed.
- [x] `node scripts/validate-content.mjs` → 60 articles, 4 books, 64 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 226 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 60/60 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 124 passed (62 desktop + 62 mobile).

## Wave 29 session (verified 2026-10-18 via web research)
## Wave 29 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-fema-exchange-control-exposure.mdx` — the *exchange-control* layer ("the side FAST-DS does NOT settle"): the structural "two regulators, two ledgers, two filings" point; the **Section 13(1) 3x penalty** on the *breaching sum* (LRS / NRO / ODI, explicitly *not* the FERA-era 9x, and *not* the asset value); the **Section 15 PRAVAAH compounding route** (the 2025 ₹2L fee cap, and the non-compoundable Section 3(a) hawala exception); the three "sums" that trigger it (LRS USD 250k/FY resident, NRO USD 1M/FY NRI, ODI individual equity-only); a ₹20L LRS over-limit worked example (₹60L worst-case 3x vs ₹2L compounded); and the "when the FEMA side is actually open / not open" decision layer.

### New finance function + calculator + tests
- [x] `femaSection13Exposure()` in `src/lib/finance/index.ts` — the Section 13(1) penalty (max(floor, sum × 3)), the Section 15 compounded cost (fee capped at the 2025 ₹2L limit, available only when compoundable + a fee is provided), the applicable FEMA cost (compounded fee when available, else the full 3x penalty), and the "FEMA open after the tax side is settled" flag.
- [x] `fema-penalty` calculator page (category: Tax) — 4 inputs (contravention sum, compounding fee, compoundable flag, tax-side-settled flag), 5 result rows, ECharts 3-bar penalty-vs-fee-vs-applicable chart.
- [x] 8 new unit tests (the 3x penalty, the penalty floor, the capped compounding fee, the no-fee full-penalty case, the non-compoundable hawala branch, the "FEMA open after tax settled" note, the both-open note, and the zero-sum edge) — **214/214 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **120/120 e2e tests pass**.

### New source
- [x] `src-fema-sec13-compound-2026` — the FEMA 1999 exchange-control source (Beacon Filing / VirtualAuditor / APTaxLaw / KS&A 2026 coverage + the RBI Master Direction on Compounding of Contraventions under FEMA, April 2025 update + Oquilia Research + the RBI LRS FAQ): the Section 13(1) "up to 3x the sum involved" cap (vs the FERA-era 9x that does not apply), the Section 15 PRAVAAH compounding route + 2025 ₹2L fee cap + the non-compoundable Section 3(a) hawala exception, and the LRS USD 250k / NRO USD 1M / ODI individual limits that define the breaching "sum."

### Build gotchas avoided this session
- **No recurring brace bug** — the `fema-penalty` calculator entry was inserted before the `];` tail with the previous entry's closing `},` preserved; `_check_calc_braces.mjs` reported BALANCED on the first run (1368/1368, 41 → 42 entries). The finance function appended at the true EOF this time (the file ends at `femaSection13Exposure`), so the "function landed mid-file" issue from Wave 28 did not recur.
- **New source, not reuse** — the FEMA 3x / compounding facts did *not* live in any existing source (the closest, `src-us-stock-tax-india-2026`, only carries the "FAST-DS does NOT settle FEMA" one-liner, not the 3x/Section-15 math), so Wave 29 correctly created `src-fema-sec13-compound-2026` rather than mis-anchoring to it.

### Research verified this session
- [x] **The Section 13(1) 3x cap (and the FERA-era 9x that does not apply)** — the operative FEMA 1999 multiple is "up to 3 times the sum involved"; the "9 times" figure is the older FERA-era number (Beacon Filing / VirtualAuditor / APTaxLaw cross-checks).
- [x] **The Section 15 PRAVAAH compounding route + the 2025 ₹2L fee cap + the hawala exception** — compounding of a compoundable contravention by paying a fee to the RBI (up to a ₹5 cr sum) / ED (above that) via PRAVAAH; a 2025 amendment caps the fee for certain contraventions at ₹2,00,000; a Section 3(a) hawala offence is *not* compoundable (RBI Master Direction on Compounding, April 2025 update).
- [x] **The three "sums" that trigger it** — LRS USD 250,000/FY (resident individuals; NRIs excluded), NRO repatriation USD 1,000,000/FY (after Indian tax + Forms 15CA/15CB), and ODI individual (equity-only within the LRS limit; individuals cannot provide loans/guarantees) (RBI LRS FAQ + Oquilia Research).

### Pipeline (all green)
- [x] `npx vitest run` → 214 passed.
- [x] `node scripts/validate-content.mjs` → 59 articles, 4 books, 63 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 225 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 59/59 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 120 passed (60 desktop + 60 mobile).

## Wave 28 session (verified 2026-10-18; scheduling model built on the Wave 20 ladder thresholds)
## Wave 28 session (verified 2026-10-18; scheduling model built on the Wave 20 ladder thresholds)

### New article
- [x] `src/content/personal-finance/pf-capital-inflow-migration.mdx` — the *scheduling / deployment* layer: a sequence of discrete future capital events (promotion, ESOP exit, inheritance) landing at known months; the **inflow-as-unlocking-event** model (a bonus that lands at a rung boundary is what opens that door, not the slow SIP); the **deployable-margin** rule (corpus at the unlock month − the threshold, floored 0 — the money free to move *up* without touching the already-deployed lower-rung capital); the two honest limits (**PMS/PRIM 1 Apr 2027 commencement** and the **after-tax fee-crossover**); and a 3-inflow worked migration plan (₹10L + ₹5L@12 + ₹15L@36 + ₹30L@48 → which inflow opens SIF / PMS / AIF).

### New finance function + calculator + tests
- [x] `capitalInflowMigrationPlanner()` in `src/lib/finance/index.ts` — month-by-month corpus trajectory (lump + SIP + a *sequence* of discrete inflows indexed by landing month), the unlock month of each of the four SEBI rungs, the deployable margin at each unlock, the year-by-year corpus for the chart, the total-inflows sum, and the next-locked-rung report.
- [x] `capital-inflow-migration` calculator page (category: Personal Finance) — 9 inputs (corpus, SIP, return, 3 × (amount + month)), 7 result rows, ECharts line chart of the corpus-by-year with the four rung thresholds as dashed reference lines.
- [x] 8 new unit tests (SIF-at-month-0 zero margin, the deployable-margin rule, an inflow accelerating two rungs to the same month, the PMS-50L margin from a 60L inflow, the total-inflows positive-sum, the next-locked-rung report, the all-locked edge, and the corpus-jump-at-inflow-year) — **206/206 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **116/116 e2e tests pass**.

### Build gotchas hit this session
- **Operator-precedence bug in the new function (caught by a unit test)** — `for (let y = 0; y <= inp.horizonYears ?? 30; y++)` evaluated as `(y <= inp.horizonYears) ?? 30`, which is always truthy when `horizonYears` is omitted (the calculator omits it) → `corpusByYear` stayed empty. Fixed by hoisting `const years = inp.horizonYears ?? 30;` and using `y <= years`. This is the standard "hoist the `??` default, never inline it into a comparison" lesson.
- **Function landed mid-file, not at the end** — the `tcsRecoverable: true` anchor used to insert `capitalInflowMigrationPlanner()` is the tail of `directLrsUsEquityFilingFY27` (near the middle of the file), so the new function now sits between that and the rest; the `braces BALANCED` + all-`export function`-present check confirmed nothing was clobbered. Fine structurally, just not the usual "append at EOF" pattern.

### Pipeline (all green)
- [x] `npx vitest run` → 206 passed.
- [x] `node scripts/validate-content.mjs` → 58 articles, 4 books, 62 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 224 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 58/58 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 116 passed (58 desktop + 58 mobile).

## Wave 27 session (verified 2026-10-18 via web research)
## Wave 27 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-fastds-valuation-guard-due-diligence.mdx` — the *valuation + due-diligence* layer: the fixed 31 March 2026 valuation date (Rule 2(1)(e), not adjustable), the Rule 3 per-asset-class FMV methods (the Rule 3(1)(e) bank-account accumulated-deposit method is the most-misread one; the indexed-cost deemed-FMV fallback when valuation is not carried out), the Rule 3(4)/(5) RBI-reference-rate / two-stage-USD currency conversion, the **Rule 5(2) 20% valuation-variance safeguard** (protects only while the variance is within 20% of the *declared* FMV; above that the charge re-computes on the *higher determined* value — so "declare a bit less and the 20% covers it" is a trap), the full document checklist for Forms 1→2→3→4, the 1%/month late-payment interest, the pre-valuation eligibility gate (ceiling / proceeds-of-crime / completed-BMA / taxpayer-specific / residential-status), and the limited immunity that does NOT settle FEMA and does NOT replace ongoing Schedule FA.

### New finance function + calculator + tests
- [x] `fastDSValuationGuard()` in `src/lib/finance/index.ts` — the 20% Rule-5(2) variance test (measured against the declared FMV), whether the safeguard holds, the charge base (declared when it holds, the higher determined value when it fails), the Track A (60%) / Track B (flat ₹1L) payable, the ceiling-eligibility check at the *determined* value, the 1%/month late-payment interest, and the total outflow.
- [x] `fast-ds-valuation-guard` calculator page (category: Tax) — 4 inputs (declared FMV, determined FMV, track select, late-payment months), 7 result rows, ECharts 4-bar declared-vs-revalued payable + late-interest + total chart (the re-valued bar turns red when the safeguard fails).
- [x] 8 new unit tests (the 20% boundary inclusive-holds, the above-20% recompute on the determined value, the Track A 60% payable, the Track B flat fee, the Track B over-ceiling ineligibility, the 1%/month late interest, the on-time zero-interest, and the zero-value edge) — **198/198 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **112/112 e2e tests pass**.

### New source
- [x] `src-fastds-rules-valuation-2026` — the dedicated FAST-DS Rules 2026 valuation + due-diligence source (CA R N Mohil / TaxGuru 18 Aug 2026 + the CBDT official FAQs 13 Aug 2026 + the notified G.S.R. 732(E) + the EY 2026 alert): the 31 Mar 2026 valuation date, the Rule 3 per-asset-class methods + currency conversion, the Rule 5(2) 20% safeguard, the four-form chain + 1%/month interest, and the limited non-FEMA immunity.

### Build gotcha avoided this session
- **`before`/`after` swap on a function append** — the first attempt to insert `fastDSValuationGuard()` used the wrong field order (put the new block in `before` and the anchor in `after`), which reported "No match found." Redid it with `before` = the existing `export function fastDSDisclosureFY26` line and `after` = the new block + that line. The finance file stayed clean (verified by the `findstr` line numbers 3218/3276/3344).
- **No recurring brace bug** — the `fast-ds-valuation-guard` calculator entry was inserted before the `];` tail with the previous entry's closing `},` preserved; `_check_calc_braces.mjs` reported BALANCED on the first run (1290/1290, 39 → 40 entries).

### Research verified this session
- [x] **The fixed 31 March 2026 valuation date** — Rule 2(1)(e) of the FAST-DS Rules 2026 (G.S.R. 732(E), 14 Aug 2026; in force 16 Aug; last date 31 Dec 2026); the FMV of *every* asset is computed as on this date, not the acquisition date or "today."
- [x] **The Rule 3 per-asset-class methods + the bank-account accumulated-deposit rule** — Rule 3(1)(a)–(g) prescribe different FMV methods; for a foreign bank account (3(1)(e)) it is the *sum of deposits from opening to 31 Mar 2026* (with redeposit treatment), not the closing balance; where valuation is not carried out, the indexed cost of acquisition is deemed the FMV (Rule 3(2)/(3)).
- [x] **The 20% Rule 5(2) valuation-variance safeguard (one-sided, value-upward)** — the declaration is not invalid *only* while the determined-vs-declared FMV variance is within 20% of the *declared* value; above that the charge re-computes on the higher determined FMV — so undervaluing is the risk.
- [x] **The four-form chain + 1%/month interest + the limited immunity** — Forms 1→2→3→4 (Rules 5–8) before the Principal / DGIT (Systems); payment within 2 months of Form 2, 1% interest per month (or part) thereafter, part payments recognised (Rule 7); the immunity regularises the tax / Black Money Act exposure but does **not** automatically settle FEMA and does not replace ongoing Schedule FA.

### Pipeline (all green)
- [x] `npx vitest run` → 198 passed.
- [x] `node scripts/validate-content.mjs` → 57 articles, 4 books, 62 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 223 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 57/57 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 112 passed (56 desktop + 56 mobile).

## Wave 26 session (verified 2026-10-18 via web research)
## Wave 26 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-black-money-act-exposure.mdx` — the *Black Money Act counterfactual* layer: the Section 40 30% tax + Section 41 3× penalty (= 90% of value, a 120% total) + the flat ₹10L-per-defaulting-year Section 43/44 Schedule-FA omission penalty; the **Finance Act 2026 exception** (the flat penalty is waived for a *non-immovable* asset at or under **₹20L**, but the 120% is not, and foreign immovable property never gets the waiver); the per-year compounding trap; the ITAT Special Bench *directory-not-mandatory* reading of the Section 43 "may" word; the three-ways-out decision (FAST-DS defined cost / Schedule FA going forward / the open-ended BMA assessment); and a ₹50L/3-yr worked spread (₹90L do-nothing vs ₹30L FAST-DS-A vs ₹1L FAST-DS-B).

### New finance function + calculator + tests
- [x] `blackMoneyActExposure()` in `src/lib/finance/index.ts` — the Section 40 tax, the Section 41 penalty (3× the tax), the 120% combined charge, the flat-penalty-applies logic (the FA-2026 ₹20L non-immovable exception), the accumulated flat penalty over the non-disclosure years, the total counterfactual, and the FAST-DS Category A (60%) cost + saving for the same value.
- [x] `black-money-act-exposure` calculator page (category: Tax) — 3 inputs (undisclosed value, non-disclosure years, immovable flag), 7 result rows, ECharts 5-bar counterfactual-vs-FAST-DS cost chart.
- [x] 8 new unit tests (the 120% pricing, the 3×-penalty relationship, the per-year flat accumulation, the FA-2026 ₹20L non-immovable waiver, the boundary (at-threshold waived / above charged), the immovable-always-charges case, the FAST-DS-A 60% cost + saving, and the zero-value edge) — **190/190 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **108/108 e2e tests pass**.

### Build gotcha hit this session
- **Mermaid bare `<=` gotcha (recurring, now the `## Sources` / `<=` class)** — the first draft of the article's Mermaid diagram had a node label `D{"Aggregate <= Rs 20L?"}`; a bare `<=` in a node label risks the MDX/JSX build ("Unexpected character"). Reworded to `up to Rs 20L` (the documented safe form). The build stayed green; this is now the standard: **never put a bare `=` / `<=` in a Mermaid node/edge label or a table cell in prose — use "up to" / "at most".**

### Research verified this session
- [x] **The BMA counterfactual structure** — Section 40 (30% tax on the undisclosed foreign income/asset), Section 41 (a penalty of 3× the tax = 90% of value, a 120% total), Sections 43/44 (a flat ₹10,00,000 per defaulting assessment year for a Schedule FA omission / inaccurate particulars) — verified against the Black Money Act 2015 text (indiacode.nic.in / the CBDT PDFs) and 2026 secondary coverage (KS&A, skmcglobal, Enterslice, mytaxexpert).
- [x] **The Finance Act 2026 ₹20L non-immovable threshold** — since the Finance Act 2026, the flat ₹10L Section 43/44 penalty does *not* apply where the aggregate value of *non-immovable* foreign assets stays within ₹20L (itrfa.in / taxroutine 2026 coverage); a foreign immovable property never gets the waiver; the 120% is unaffected by the exception.
- [x] **The Section 43 "may" directory reading** — a Mumbai ITAT Special Bench (Mr. Vinil Venugopal & Mrs. Ranjeeta Vinil) held the "may" word in Section 43 is *directory* (discretionary), not mandatory; this is a *coin flip in the assessee's disfavour*, not a planning input — the flat penalty is the worst case, not a certainty.
- [x] **The FAST-DS vs BMA spread** — for a ₹50L/3-yr non-immovable asset: do-nothing = ₹90L (₹60L = 120% + ₹30L flat / 3 yr), FAST-DS-A = ₹30L, FAST-DS-B = ₹1L; the reclassification A→B saves ₹29L and any FAST-DS route over do-nothing saves ₹60L+.

### Pipeline (all green)
- [x] `npx vitest run` → 190 passed.
- [x] `node scripts/validate-content.mjs` → 56 articles, 4 books, 61 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 222 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 56/56 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 108 passed (54 desktop + 54 mobile).

## Wave 25 session (verified 2026-10-18 via web research)
## Wave 25 session (verified 2026-10-18 via web research)

### New article
- [x] `src/content/taxation/tax-fastds-2026-declaration.mdx` — the *FAST-DS 2026 worked-declaration* layer: what the scheme is (Finance Act 2026 Ch. IV §§130–144, Rules notified 15 Aug 2026, window 16 Aug – 31 Dec 2026, reference date 31 Mar 2026, fully-online before the Principal DGIT (Systems)), the two categories and their costs (A = undisclosed ≤ ₹1 cr at 60% of value via the 30% + equal-additional clause; B = missed-Schedule-FA ≤ ₹5 cr at a flat ₹1L fee), the "ceiling decides the category" decision, the immunity + its limits (asset-specific, excludes proceeds-of-crime / completed-BMA years, does NOT replace Schedule FA), the Form 1 → 2 → payment → 3/4 sequence with the file-early lead-time trap, a ₹50L worked example (₹30L Category A vs the flat-₹1L Category B reclassification), and the right/wrong-to-file layer.

### New finance function + calculator + tests
- [x] `fastDSDisclosureFY26()` in `src/lib/finance/index.ts` — the two-category cost model: Category A (30% tax + an equal additional amount, both legs split out, 60% total, eligible only at or under the ₹1 cr ceiling), Category B (flat ₹1L fee, eligible only at or under the ₹5 cr ceiling), the effective-cost %, the over-ceiling ineligibility note, and the immunity + one-time-window strings.
- [x] `fast-ds-declaration` calculator page (category: Tax) — 3 inputs (disclosed value, category select, Category A rate override), 6 result rows, ECharts 3-bar cost breakdown (Tax / Additional / Total payable; the total bar turns grey when over the ceiling).
- [x] 8 new unit tests (the 60% Category A math, Category A eligible at the ₹1 cr ceiling, Category A ineligible just above, the Category B flat-fee-across-values, Category B over the ₹5 cr ceiling, the immunity + window note, zero-value ineligibility, and the Category A rate override) — **182/182 unit tests pass**.
- [x] 2 new e2e tests (calculator + article, desktop + mobile; the calculator asserts the three unique result-row DOM labels + the chart container, not the ECharts canvas title) — **104/104 e2e tests pass**.

### Build gotcha avoided this session
- **No recurring brace bug this time** — the `fast-ds-declaration` calculator entry was inserted *before* the `];` tail with the previous entry's closing `},` preserved in the same edit, so `_check_calc_braces.mjs` reported BALANCED on the first run (1219/1219, 37 → 38 entries). The post-insertion brace check still ran as a gate.
- **Source reuse, not a new source** — the FAST-DS scheme terms already lived in `src-us-stock-tax-india-2026` (created in Wave 24 for the 25%-dividend / 24-month-LTCG / Schedule-FA / FAST-DS claims), so Wave 25 correctly *reused* it rather than duplicating; the article's frontmatter + body `## Sources` both cite it. Recurring discipline: a new article's claims must be anchored to a source that actually makes that claim (the Wave 24 source-mis-attribution fix).

### Research verified this session
- [x] **FAST-DS 2026 category math** — Category A (undisclosed ≤ ₹1 cr): **30% tax + an equal additional amount = 60% of value**; Category B (missed-Schedule-FA ≤ ₹5 cr): **a flat ₹1,00,000 fee**; reference date **31 March 2026**; window **16 Aug – 31 Dec 2026** (no declaration after 31 Dec); eligibility extends to certain non-residents / RNORs who were resident in the relevant year (FinanceToolSite FAST-DS guide, cross-checked against the KPMG flash news + CBDT Rules 2026 + NDTV Profit / NationPath coverage).
- [x] **The Form 1 → 2 → 3/4 sequence + the file-early trap** — fully online before the Principal DGIT (Systems); determination (Form 2) + payment + confirmation (Forms 3/4) happen *after* the Form 1 declaration, so a last-week-of-December filing can fail to complete inside the window (official FAQ guidance).
- [x] **The immunity + exclusions** — asset-specific immunity from further tax / penalty / Black Money Act prosecution; excludes proceeds-of-crime assets and years with a completed Black Money Act assessment; does **not** replace the ongoing Schedule FA obligation.

### Pipeline (all green)
- [x] `npx vitest run` → 182 passed.
- [x] `node scripts/validate-content.mjs` → 55 articles, 4 books, 61 sources, 0 warnings.
- [x] `node scripts/check-links.mjs` → all registry references resolve.
- [x] `npm run build` → 221 pages; new article + new calculator pages generated.
- [x] `npx pagefind --site dist` → indexed.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 55/55 article downloads.
- [x] `node scripts/build-report.mjs` → manifest OK.
- [x] `npx playwright test` → 104 passed (52 desktop + 52 mobile).

## Wave 24 session (verified 2026-10-18 via web research)
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
- [ ] **Per-scheme CA confirmation** for each live GIFT City house (PPFAS / DSP / Edelweiss / Marcellus / Tata) — flagged in Wave 23 as a 30-min call; the DSP fund-level position (14.95% / 42.74%, no SchFA) is the primary anchor.
- [ ] **FAST-DS 2026 window close-out (reviewAfter 2027-01-31, from Wave 25):** verify the window actually closed 31 Dec 2026 and whether a *successor* disclosure scheme is announced at the FY 2027-28 Budget — the article is only actionable while the window is open or a successor is confirmed.
- [ ] **FA-2026 Rs 20L non-immovable threshold (from Wave 26, reviewAfter 2027-04-17):** re-verify the threshold at the FY 2027-28 Budget (a later Budget can change it); any change re-prices the BMA counterfactual's "do nothing" column.
- [ ] **PMS/PRIM 1 Apr 2027 commencement + SEBI rung minimums (from Wave 28, reviewAfter 2027-04-17):** confirm the PMS/PRIM Rs 25L MF-only route actually commenced 1 Apr 2027 and that the four rung minimums (SIF 10L / PMS 50L / AIF 1Cr) are unchanged; any move re-prices the migration schedule.
- [ ] **FEMA Section 13 3x cap + Section 15 compounding fee (from Wave 29, reviewAfter 2027-04-17):** re-verify the 3x cap and the 2025 Rs 2L compounding-fee cap at the next RBI Master Direction on compounding; the per-contravention fee is case-specific.
- [ ] Phase 4 deeper expansion: Wave 30 candidate = the 10L personalized-wealth-plan rewrite driven by the user's answers to the 14 questions (now that the ladder, migration-planner, GIFT City, FAST-DS, BMA and FEMA layers are all in place, the personal plan can reference every one of them), or an ODI / NRI-repatriation worked example that pairs with the fema-penalty calculator.

## Next 3 actions
1. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers - the capital-inflow-migration planner (Wave 28) turns those answers into a concrete deployment schedule, the GIFT City / FAST-DS / BMA / FEMA layers (Waves 22-29) give the international + disclosure side, and the new **corpus-allocation-blender** (Wave 31) turns the final corpus + risk grade into a one-screen "where does the next rupee go" allocation the rewritten plan can point to.
2. Continue the daily article habit (Wave 32 candidate: a **NRI-repatriation / LRS-return worked example** that pairs with the `fema-penalty` and `odi-route-eligibility` calculators — the "bringing the money *back*" lane the outbound-investment cluster does not cover — OR the 10L personalized rewrite once the user answers the questions).
3. Resolve the 80TTB conflict, the 54EC->Sec 85 renumbering, the FA-2026 Rs 20L threshold, and re-verify time-sensitive claims at their reviewAfter dates (the FAST-DS reviewAfter 2027-01-31 is the earliest one; the Wave 31 blender reviewAfter is 2027-04-17, alongside the SIF/PMS/AIF/ODI minimums).

## Known build-gotchas (recurring)
- **MDX parse error:** `<₹` / `<digit` in prose/tables breaks JSX parsing. Use "up to ₹X" / "under N months" instead.
- **MDX bare `=` / `<=`:** a bare `=` (or `<=`) outside a `$...$` math block or an attribute value breaks the MDX/JSX build with "Unexpected character `=`" (hit in Wave 13). Reword to "is" / "up to" / "equals"; `\;=\;` inside `$...$` and `href="..."` are safe.
- **Calculator array-insertion brace:** inserting a new calculator entry in `src/lib/calculators.ts` by replacing the `},\n];` tail has repeatedly (Waves 10/11/12/14) either dropped the previous entry's closing `},` or left a duplicate `];`. After every insertion, verify `]`-close count is exactly 1 before `export function getCalc` and that the previous entry ends with `},\n  },` (use `_check_calc_braces.mjs`).
- **Node version:** `npx astro build` via the Agnes wrapper (Node v22.14) fails — Astro 7 needs ≥22.22. Use the system `npx` on PATH (Node v24.18.0).
- **e2e heading collision:** the page auto-renders a `Sources & citations` `<h2>` at `src/pages/articles/[id].astro:130`. Article body headings must use `## Sources` (not `## Sources & citations`) to avoid strict-mode collision (hit in Wave 18).
- **e2e chart-title assertion:** ECharts `chart.title` renders *inside the canvas*, not as DOM text — `getByText('<chart title>')` will 5s-timeout. Assert a results-row DOM label instead, and keep the `[role="img"]` check for the canvas (hit in Wave 19).
- **e2e strict-mode double-heading:** any heading text used by two H2s in one article fails a non-`.first()` assertion ("multiple elements found"). Write assertions on the *unique* suffix (e.g. `Worked walk-through: listed company` not just `Worked walk-through`) (hit in Wave 19; same class as the Wave 18 collision).
- **Hand-computed table vs live function (new, Wave 31):** a synthesis article that has a live `src/lib/finance` function behind it must copy the *function's* numbers, not a hand calculation. The first draft of `pf-corpus-allocation-blender` had the individual aggressive row wrong (equity 56.3% → blended 6.9% "growth beats aggressive"); the real function returns equity 64.3% → blended 7.9%, and the blended return rises *monotonically* with risk grade. Verify by running the function (`npx vite-node` over a temp check script) and re-run the build + e2e after the fix.
- **Scratch scripts:** keep one-off registry scripts (`_register-waveN.mjs`) for audit; delete transient inspection scripts.
