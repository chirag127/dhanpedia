
The [80C basket regime decision](./tax-80c-baskets-regime-decision.mdx) answered *"which regime for a
working earner."* This article is the same question for the **terminal rung of your ladder** — the
retiree living on pension, interest and a SCSS, with no salary. The answer is not the one most people
assume: because the new regime's 87A rebate keeps income up to **₹12L tax-free** while the old regime's
87A only reaches **₹5L**, the new regime can *still* be cheaper for an interest-heavy retiree even after
you give up 80TTB and the higher age exemption.

## The age brackets — and which regime they matter in

The Income-tax Act splits older taxpayers into two groups, and the distinction **only carries weight
under the old regime**:

| Group | Age | Old-regime basic exemption | New regime |
|---|---|---|---|
| Regular taxpayer | Below 60 | ₹2.5L | No age benefit |
| **Senior citizen** | 60-79 | **₹3L** | No age benefit |
| **Super senior citizen** | 80+ | **₹5L** | No age benefit |

Under the **new regime (the default)**, age does not matter: everyone gets the same slabs and the same
₹4L nil band plus the 87A rebate to ₹12L. So a super-senior who moves to the new regime **silently gives
up ₹1L of extra exemption** (₹5L old vs ₹4L new) — that is the cost of the 87A sweetener.

## The two benefits the old regime gives a retiree (and both are old-only)

1. **Section 80TTB — the interest deduction.** A senior citizen can deduct up to **₹50,000** (AY
   2026-27; a Budget-2026 raise to ₹1L has been reported but is unverified — treat it as ₹50,000 until a
   CA confirms) of interest income from savings accounts, FDs, RDS, post-office deposits and SCSS. It is
   far more generous than 80TTA (₹10,000, savings-only, for non-seniors). It exists **only in the old
   regime** — opt into the new one and it vanishes.
2. **The higher age exemption** above (₹3L/₹5L), which the new regime does not give.

The retirement instrument most retirees hold — **SCSS at 8.2% on up to ₹30L** — is exactly where the
tax surprises them: the interest is **fully taxable as Income from Other Sources** at slab. The only two
reliefs are both old-regime: the **deposit** counts for 80C (up to ₹1.5L in the year you invest) and up
to ₹50,000 of the **interest** is sheltered by 80TTB.

$$
\text{SCSS after-tax income} \;\approx\; \text{interest} \times (1 - \text{slab rate}) \;-\; \text{the 80TTB shelter you actually get}
$$

## The counterintuitive result: the new regime often wins anyway

This is the finding most "save with 80TTB" articles get wrong. Run a 66-year-old with ₹8.46L of income
(₹2.46L SCSS interest + ₹6L pension):

| Regime | What applies | Tax |
|---|---|---|
| **New** | 87A rebate to ₹12L → **zero** | **₹0** |
| Old | 80TTB (₹50k) + 80D + 3L exemption, but 87A only to ₹5L | **₹59,200** |

Below ₹12L of income, the new regime's 87A rebate swallows the *entire* tax bill, so giving up 80TTB
costs you nothing — the old regime's deductions have **no base tax left to reduce**. The old regime only
starts to win **above ₹12L**, where its 80TTB + 80D + higher exemption can beat the new regime's steeper
top bands. That boundary is why you must *compute* the decision rather than assume "80TTB means old."

The [senior-regime-tax calculator](/calculators/senior-regime-tax) runs both regimes on your actual
numbers and shows the 80TTB value at your own marginal position.

## The retirement TDS and filing reliefs that save you effort

| Relief | What it does |
|---|---|
| **₹1,00,000 TDS threshold on senior interest** (raised from ₹50,000) | Banks deduct TDS on a senior's interest only above ₹1L/yr. Below that, no TDS. |
| **Form 15H** (the senior version of 15G) | If your total income is below the taxable limit even after crossing ₹1L, submit 15H to the bank to stop TDS at source — avoid the wait for a refund. |
| **Advance-tax exemption for retirees** | A senior with *no business income* is exempt from advance tax; pay the whole bill as self-assessment tax by the filing due date without 234B/234C interest ([the advance-tax article](./tax-advance-itr-final-checklist.mdx) covers the clock). |
| **Section 194P convenience** | A senior aged 75+ whose only income is pension + interest *from the same bank* can have that bank compute and deduct the correct tax — and **not file an ITR at all**. |

The 194P route is the one most retirees never discover: a 78-year-old on ₹4L of pension + interest from
one bank may have literally zero filing to do.

## Related

- [The 80C Basket Decision & Regime (working-earner version)](./tax-80c-baskets-regime-decision.mdx)
- [Surcharge, Cess & the High-Income Regime (above ₹50L)](./tax-surcharge-cess-high-income.mdx)
- [Government Savings Schemes: PPF, SSY, NSC, KVP & SCSS](../government-schemes/govt-small-savings-schemes.mdx)
- [Retirement & FIRE: Corpus, 4% Rule, Decumulation, Annuities](../retirement-fire/retirement-fire-annuities.mdx)

## Sources

- Senior/super-senior old-regime exemptions (₹3L/₹5L), 80TTB (₹50,000, old-only), 80D enhanced cap, the ₹1L senior TDS threshold, Form 15H, the advance-tax exemption, Section 194P, and SCSS 8.2% taxation — <a href="https://calcguru.in/senior-citizen-tax-benefits-80ttb-scss">CalcGuru senior-citizen benefits (Aug 2026)</a>
- FY 2026-27 slab structure & 87A (new regime to ₹12L, old to ₹5L) — <a href="https://economictimes.indiatimes.com/wealth/tax/income-tax-slabs-after-budget-2026-have-tax-slabs-for-fy-26-27-changed-check-latest-rates/articleshow/127910133.cms">Economic Times (Budget 2026 continuity)</a>
- SCSS 8.2% rate (FY 2025-26, carried forward) — <a href="https://economictimes.indiatimes.com/wealth/invest/scss-interest-rate">small-savings rate notifications</a>

## Update log

- 2026-10-18 — Wave 15: the age-bracket table, the two old-regime-only senior benefits (80TTB ₹50k,
  higher age exemption), the counterintuitive new-regime-87A-wins-below-12L result (worked 66-year-old
  ₹8.46L case: new ₹0 vs old ₹59,200), the SCSS taxation mechanics, the ₹1L senior TDS threshold +
  Form 15H, the retiree advance-tax exemption, and the Section 194P no-ITR convenience. The 80TTB
  limit is modelled as ₹50,000 (AY 2026-27 confirmed); the reported Budget-2026 raise to ₹1,00,000 is
  flagged as unverified and user-settable in the calculator — confirm with a CA before relying on it.


## Sources & Citations

- **CalcGuru senior-citizen tax benefits (Aug 2026) / TaxClue senior slabs / Moneykit senior calculator** — Senior-citizen tax FY 2026-27 (Income-tax Act 2025): old-regime basic exemption Rs 3,00,000 (senior 60-79) / Rs 5,00,000 (super-senior 80+) vs Rs 2,50,000 below 60; the new regime has NO age benefit (same slabs + 87A to 12L + Rs 75,000 standard deduction for everyone); 80TTB up to Rs 50,000 on interest income (savings/FD/RD/post-office/SCSS), OLD regime only - a Budget-2026 raise to Rs 1,00,000 has been reported but is unverified; 80D enhanced senior cap; senior TDS threshold on interest raised to Rs 1,00,000 (from 50,000); Form 15H stops TDS below the taxable limit; seniors with no business income are exempt from advance tax (pay as self-assessment tax); Section 194P lets a 75+ senior whose only income is pension + interest from the same bank skip ITR filing; SCSS 8.2% interest is fully taxable as Other Sources with only 80C on the deposit and 80TTB on up to Rs 50,000 of interest (both old regime). https://calcguru.in/senior-citizen-tax-benefits-80ttb-scss (verified 2026-10-18)
- **Income Tax Department / Union Budget 2025 (Finance Act 2025) — FY 2026-27 slabs** — Income-tax slabs, new regime, FY 2026-27 (AY 2027-28) — unchanged from the Budget 2025 reset: 0-4L nil, 5% to 8L, 10% to 12L, 15% to 16L, 20% to 20L, 25% to 24L, 30%+; Sec 87A rebate extends tax-free up to Rs 12L; standard deduction Rs 75,000. https://cleartax.in/s/income-tax-slabs (verified 2026-10-16)
- **Economic Times / Moneycontrol (quoting govt. quarterly review)** — Senior Citizens' Savings Scheme interest rate 8.2% p.a. for FY 2025-26. https://economictimes.indiatimes.com/wealth/invest/senior-citizens-savings-scheme-has-the-government-revised-scss-interest-rate-for-the-december-quarter/ (verified 2026-10-16)
- **Income-tax Act, 2025 (FY 2026-27), Sec 207-211, 234B, 234C — via TaxClue advance-tax guide** — Advance tax FY 2026-27: duty when tax after TDS exceeds Rs.10,000; four cumulative installments 15 Jun (15%) / 15 Sep (45%) / 15 Dec (75%) / 15 Mar (100%); Sec 234C interest 1%/mo on each quarterly shortfall (3-month tails on the first three, 1-month on the last); Sec 234B 1%/mo from 1 Apr when advance paid is under 90% of assessed tax; capital-gains/lottery/dividend income arising after a date attracts no 234C if paid in the remaining installments (last quarter by 31 Mar); 44AD/44ADA presumptive taxpayers may pay 100% by 15 Mar in one installment. https://taxclue.in/guide/advance-tax-calculator (verified 2026-10-17)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
