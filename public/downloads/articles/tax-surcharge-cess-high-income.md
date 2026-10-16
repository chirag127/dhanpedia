
Below ₹50L the tax model is just slabs plus a 4% cess line — the
[80C basket decision article](./tax-80c-baskets-regime-decision.mdx) covers that world, and its
calculator *deliberately excluded surcharge*. Above ₹50L, two more layers switch on, and in FY 2026-27
one of them changed in a way most tax articles still get wrong: **the Income-tax Act, 2025 (effective
1 April 2026) abolished the 37% top surcharge in the new regime and capped it at 25%**. The old regime
keeps 37% above ₹5Cr. That single asymmetry is what decides regime fights at the top of your capital
ladder.

## The three tiers: base tax → surcharge → cess

Every bill above ₹50L is computed in exactly this order:

1. **Base tax** — your slab tax (new or old regime) plus the separate-head tax on equity gains
   (112A LTCG at 12.5% above the shared ₹1.25L pool; 111A STCG at 20%).
2. **Surcharge** — a percentage *of the base tax* (not of income), in bands by total income.
3. **Marginal relief** — at each surcharge boundary, the extra (tax + surcharge) on income above the
   boundary cannot exceed the incremental income itself. This removes the "cliff effect": crossing
   ₹50L by ₹1,000 costs about ₹1,040 *with* relief, not roughly ₹1.1L *without* it.
4. **Health & education cess** — a flat **4% on (base tax + surcharge after relief)**, in both
   regimes, with no threshold.

$$
\text{Total liability} \;=\; \underbrace{T}_{\text{base tax}} \;+\; \underbrace{(S - MR)}_{\text{surcharge after marginal relief}} \;+\; 0.04\,(T + S - MR)
$$

## The FY 2026-27 surcharge table — and the change that matters

| Total income | New regime | Old regime |
|---|---|---|
| Up to ₹50L | Nil | Nil |
| ₹50L – ₹1Cr | 10% | 10% |
| ₹1Cr – ₹2Cr | 15% | 15% |
| ₹2Cr – ₹5Cr | 25% | 25% |
| Above ₹5Cr | **25% (capped)** | **37%** |

The two regimes are identical up to ₹5Cr. **Above ₹5Cr the new regime stops at 25% while the old
regime reaches 37%** — a 12-percentage-point wedge on the surcharge layer alone, before you even
compare the lower new-regime slabs. The 37% top rate of the 1961 Act was deliberately not carried into
the new regime; the cap is a policy choice to keep very high earners in the default regime.

## The 15% equity-surcharge cap: the rule long-term equity investors need

Surcharge on tax arising from **listed-equity gains** — 111A short-term (20%) and 112A long-term
(12.5%) — is **capped at 15%**, no matter how high your total income is. The slab portion of your base
tax still attracts the full band rate. Consequence at, say, a ₹3Cr+ income:

| Base-tax component | Surcharge applied |
|---|---|
| Equity LTCG/STCG tax | 15% (capped) |
| Everything else (salary, rent, interest, unlisted gains, business) | Full band (25% / 37% by regime) |

This is why a ₹10Cr earner whose income is mostly 112A LTCG pays far less *effective* surcharge than a
₹10Cr earner whose income is salary — and why the [loss-harvesting and tax-free-stack
articles](./tax-loss-harvesting.mdx) keep pushing equity activity into the 112A bucket: the 12.5% rate
*and* the 15% surcharge cap stack into the most tax-efficient long-term channel in the system.

## Worked numbers (from the high-income calculator)

All figures below come from the `highIncomeTaxFY27()` model — the
[high-income calculator](/calculators/high-income-regime) reproduces them with your own inputs.

| Case | New regime (total) | Old regime (total) | Winner |
|---|---|---|---|
| ₹55L slab income, salaried | ₹13,81,380 (eff. 25.1%) | ₹16,55,940 (eff. 30.1%) | **New** |
| ₹2.5Cr slab income | ₹91,74,750 (eff. 36.7%) | ₹94,86,750 (eff. 38.0%) | **New** (narrower) |
| ₹8Cr slab income | ₹3,06,24,750 (eff. 38.3%) | ₹3,39,06,678 (eff. 42.4%) | **New, by ₹32.8L** |
| ₹3Cr slab + ₹5Cr equity LTCG | ₹1,85,81,063 (eff. 23.2%) | ₹1,99,90,991 (eff. 25.0%) | **New** (15% cap helps both, new slab wins) |

The pattern to internalize: **at every income tested, the new regime wins on total bill — but the
margin is not constant.** Between ₹50L and roughly ₹1–2Cr a heavy old-regime deduction stack (home-loan
interest, 80D, 80E) can still flip the decision, as the [regime-decision article](./tax-80c-baskets-regime-decision.mdx)
shows. Above ~₹2Cr, where both regimes sit in the 25% band and the new regime's slabs are structurally
lower, the new regime pulls away — and above ₹5Cr the 25%-vs-37% wedge makes the new regime the
unambiguous choice for a high-earner *without* a very large deduction stack.

## Marginal relief, shown at the ₹50L boundary

Crossing ₹50L (self-employed, no standard deduction): the surcharge band turns from 0% to 10%. Without
relief, the extra ₹1,000 of income would pull a 10% surcharge across the *entire* base tax (about
₹1.08L), so the marginal cost of that ₹1,000 would be ₹10,800+. **With marginal relief the extra
liability is capped at the incremental income** — the verified figure is ₹1,040 (₹1,000 plus a sliver
of slab-rate tax), not the cliff. The same cap operates at ₹1Cr, ₹2Cr and ₹5Cr. In practice this
means: *income that lands just above a boundary is nearly as cheap as income at the boundary* — and
it removes most of the temptation to "save for next year" an income component that is already going to
happen (you usually cannot choose the timing of salary).

## What this means for your ladder

| Your income position | What changes at FY 2026-27 |
|---|---|
| ₹50L – ₹1Cr | Surcharge starts: +10% on the whole base tax (plus cess on it). The new regime still wins for most people here; re-run the regime decision with surcharge included. |
| ₹1Cr – ₹2Cr | 15% band. The surcharge on a ₹1Cr base tax is ~₹1.5L before cess — plan the advance-tax installments on the *post-surcharge* number, or the [234C clock](./tax-advance-itr-final-checklist.mdx) starts working against you. |
| ₹2Cr+ | Both regimes at 25%. New regime's lower slabs + capped surcharge make it the default winner; old wins only with an unusually large deduction stack. |
| ₹5Cr+ | **Old regime's 37% is now the out-of-sight cost.** A ₹10Cr income saves roughly ₹3L/year just from the surcharge differential, before slabs. |

Two honesty notes: (1) these are the model's numbers, and the ITR utility is the authority for the
exact figure at each boundary — the marginal-relief computation here prices the boundary at its own
band, which is the standard approximation; (2) the 15% equity cap and the 25% new-regime ceiling are
the Income-tax Act, 2025 positions as effective 1 April 2026 — re-verify at each Finance Act.

## Related

- [India Taxation: The Complete Investor's Guide](./tax-india-investor-complete.mdx)
- [The 80C Basket Decision & Regime](./tax-80c-baskets-regime-decision.mdx)
- [Advance Tax, the 234B/234C Interest Clock & the Final ITR Checklist](./tax-advance-itr-final-checklist.mdx)
- [Tax Loss Harvesting](./tax-loss-harvesting.mdx)

## Sources

- Surcharge & cess under the Income-tax Act, 2025 (new-regime 25% cap, old-regime 37% above 5Cr, 15% equity cap, 4% cess, marginal relief; worked examples) — <a href="https://virtualauditor.in/learn/surcharge-cess-income-tax-2025/">Virtual Auditor (updated 15 Apr 2026)</a>
- FY 2026-27 slab structure & 87A — <a href="https://taxatlas.app/in/tax-brackets/">Tax Atlas India / Income-tax Dept (incometaxindia.gov.in)</a>
- Advance-tax interplay (installments run on the post-surcharge figure) — <a href="https://taxclue.in/guide/advance-tax-calculator">TaxClue advance-tax guide</a>

## Update log

- 2026-10-18 — Wave 11: three-tier computation (base → surcharge with marginal relief → 4% cess), the
  FY 2026-27 surcharge table with the new-regime 25% cap vs old-regime 37% above ₹5Cr (Income-tax Act,
  2025, effective 1 Apr 2026), the 15% equity-surcharge cap, worked regime comparisons at 55L / 2.5Cr
  / 8Cr / 3Cr+5Cr-LTCG, and the marginal-relief cliff math at ₹50L (₹1,040 not ₹1,08,000+ on an extra
  ₹1,000). Model verified against the Act 2025 secondary source; exact boundary figures should be
  confirmed with the ITR utility. Re-verify the surcharge bands at each Finance Act.


## Sources & Citations

- **Virtual Auditor - Surcharge & HEC under the Income-tax Act, 2025 (updated 15 Apr 2026; Income-tax Act 2025 + Finance Act 2026)** — Surcharge & Health and Education Cess under the Income-tax Act, 2025 (effective 1 Apr 2026): individual new-regime surcharge 10% (50L-1Cr) / 15% (1Cr-2Cr) / 25% capped above 2Cr (the 37% top rate of the 1961 Act was ABOLISHED for the new regime); old regime keeps 37% above 5Cr; surcharge on listed-equity 111A/112A tax capped at 15%; 4% cess on (base tax + surcharge); marginal relief at each boundary caps incremental tax + surcharge on (income above boundary). https://virtualauditor.in/learn/surcharge-cess-income-tax-2025/ (verified 2026-10-18)
- **Income Tax Department / Union Budget 2025 (Finance Act 2025) — FY 2026-27 slabs** — Income-tax slabs, new regime, FY 2026-27 (AY 2027-28) — unchanged from the Budget 2025 reset: 0-4L nil, 5% to 8L, 10% to 12L, 15% to 16L, 20% to 20L, 25% to 24L, 30%+; Sec 87A rebate extends tax-free up to Rs 12L; standard deduction Rs 75,000. https://cleartax.in/s/income-tax-slabs (verified 2026-10-16)
- **Income-tax Act, 2025 (FY 2026-27), Sec 207-211, 234B, 234C — via TaxClue advance-tax guide** — Advance tax FY 2026-27: duty when tax after TDS exceeds Rs.10,000; four cumulative installments 15 Jun (15%) / 15 Sep (45%) / 15 Dec (75%) / 15 Mar (100%); Sec 234C interest 1%/mo on each quarterly shortfall (3-month tails on the first three, 1-month on the last); Sec 234B 1%/mo from 1 Apr when advance paid is under 90% of assessed tax; capital-gains/lottery/dividend income arising after a date attracts no 234C if paid in the remaining installments (last quarter by 31 Mar); 44AD/44ADA presumptive taxpayers may pay 100% by 15 Mar in one installment. https://taxclue.in/guide/advance-tax-calculator (verified 2026-10-17)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
