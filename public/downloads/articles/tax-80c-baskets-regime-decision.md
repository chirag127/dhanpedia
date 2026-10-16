
If you are on the **new regime** (the default since 2023), this article is still worth reading, because
the regime decision is *computable*, and the new regime is not automatically the winner for someone with a
₹1.5L 80C basket plus employer NPS. If you are on the **old regime**, this is the piece that tells you
*what to do with the deduction you are already paying for*.

The [India tax complete guide](./tax-india-investor-complete.mdx) gave you the slabs and the two regimes.
This article is the decision layer: **how much is the 80C basket actually worth to you, instrument by
instrument, and which regime should you file under in FY 2026-27?**

## What the 80C basket is — and is not

Section 80C gives **one shared bucket of ₹1,50,000 per year** (old regime only) that you can fill from any
mix of:

| Instrument | Typical return | Lock-in | Risk | Tax treatment |
|---|---|---|---|---|
| **ELSS** (equity mutual funds) | ~12-15% CAGR (historical, market risk) | **3 years** | Market | Deduction + 112A LTCG 12.5% on gains |
| **PPF** | **7.1% guaranteed** (FY 2026-27, 8th straight unchanged quarter) | **15 years** | None (govt) | EEE — completely tax-free |
| **EPF** | 8.25% (FY 2025-26 rate, carried forward) | Till retirement | None | EEE, but contribution capped at 10% of salary inside 80C |
| **NSC** | ~7.7% | 5 years | None | EEE |
| **Home-loan principal** | Your loan's rate | Until the loan ends | Property | Deduction on principal only |
| **LIC premium** | 4-6% (traditional) | 15-20 years | Low, but expensive | Deduction on premium |
| **Tuition fees** | — | — | — | Up to 2 children |
| **NPS self (80CCD(1))** | Market (E/G/C/A modes) | Till 60 | Market | Within the ₹1.5L, not on top |

Two traps that cost real money:

1. **The LIC-first habit.** Putting the whole ₹1.5L into a traditional LIC plan buys 4-6% with a 15-20
   year lock, when the same ₹1.5L in PPF buys 7.1% guaranteed with zero lock-in flexibility. The only
   reason to hold LIC at all is *insurance* — and for that, a **term policy (₹15-20k/year for ₹1Cr cover)**
   plus ELSS or PPF for the 80C is nearly always better.
2. **The "80C is automatic" myth.** EPF contributes automatically, but it only counts up to **10% of
   salary**, and anything beyond the ₹1.5L total gives you *zero* extra. If EPF alone fills 80C, a PPF or
   ELSS top-up does nothing for your tax this year.

## The NPS side-door: ₹50K over the basket — old regime only

Beyond the ₹1.5L 80C basket, **Section 80CCD(1B)** gives an *extra* ₹50,000 deduction for NPS Tier-1
self-contributions (salaried, self-employed, or even on your child's account under NPS Vatsalya).
The rules that matter for FY 2026-27:

- **Old regime: yes.** 80C (₹1.5L) + 80CCD(1B) (₹50K) stack, for ₹2.0L of NPS-related deductions.
- **New regime: no.** This was the subject of a conflicting blog claim during our Wave 8 research;
  the CA-reviewed source (15 Oct 2026) and 1 Finance/ClearTax coverage both confirm
  **80CCD(1B) is disallowed under the new regime (Section 115BAC)**. It is recorded in our update log
  (`ul-80ccd1b-regime-clarification-2026`).
- **The one NPS lever that survives the new regime: 80CCD(2)** — your *employer's* NPS contribution,
  up to **14% of Basic+DA for all employers** (raised from 10% private-sector by Budget 2024). You cannot
  claim it directly; you *get it* by asking HR to route part of your "special allowance" into employer NPS.
  For a ₹20L CTC earner in the 20% slab, converting ₹1.4L of cash salary into employer NPS saves
  **~₹29,120/year** — that is a 20.8% instant "return" on the money, before the NPS account even compounds.
  It counts toward the ₹7.5L combined employer EPF+NPS+superannuation exempt cap; above that it is taxed as
  a perquisite.

$$
\text{Total NPS-related deductions (old regime)} \;=\; \underbrace{80C \;(\le 1.5L)}_{\text{incl. 80CCD(1)}} \;+\; \underbrace{80CCD(1B) \;(\le 0.5L)}_{\text{old only}} \;+\; \underbrace{80CCD(2)}_{\text{both regimes}}
$$

## When the new regime actually wins (and a surprising FY 2026-27 result)

Here is the finding most people get wrong: **after the Budget 2025 widening of the new regime
(nil up to ₹4L, then 5/10/15/20/25/30% with the 87A rebate keeping income up to ₹12L tax-free, and a
₹75,000 standard deduction for salaried people), the new regime wins for a typical salaried taxpayer
even when they have a full old-regime deduction stack** — up to roughly ₹45 lakh of income, before
surcharge even enters.

We verified this by running the `deductionShieldFY27()` model across incomes with a *complete* ~₹5L
old-regime stack (₹1.5L 80C + ₹50k NPS 80CCD(1B) + ₹2L home-loan interest 24(b) + ₹1L health 80D).
The new regime came out cheaper at every income tested up to ₹45L. The reason is arithmetic, not
intuition: the new regime's lower *base* slabs (0/5/10/15/20/25% where the old regime was 0/5/20/30%)
mean the old regime has less base tax for the deductions to offset, and at the top both regimes hit
30% — so the deductions no longer have a steeper slope to leverage.

**So when does the old regime actually win?** Only when your *deductions are large relative to
income*, which for FY 2026-27 happens in a few specific cases:

| Your profile | Why old can win |
|---|---|
| Income ₹50L+ with a big 24(b) home-loan + 80E startup loss offset | Surcharge (not modelled here) plus the deduction stack flips the balance; verify with a CA including surcharge |
| Heavy 80D (₹1L health) + 80E (startup investment, up to ₹1L) on top of 80C | The old regime's extra deduction buckets stack into ₹3-4L that the new regime gives up |
| A mid-career earner where employer NPS (80CCD(2)) is *not* available | The one deduction the new regime *does* keep is gone, so the new regime's advantage shrinks |

The practical takeaway: **do not assume the new regime wins.** Run the numbers. For a ₹15L–₹40L
salaried person with a normal 80C basket, the new regime almost certainly wins. For a home-loan holder
at the top of that band, or anyone with 80E, the gap narrows and you must compute it.

**The one lever that is pure value in the new regime: 80CCD(2) employer NPS.** Because it is the only
deduction that survives in *both* regimes, routing salary into employer NPS is the single most
efficient tax move a new-regime filer has — it drops income at your full marginal rate with no
deduction-bucket limit, up to the ₹7.5L employer EPF+NPS+superannuation cap.

## Filling the basket: the three archetypes

| You are | Fill the basket with | Why |
|---|---|---|
| **In your 20s-30s, no home loan** | EPF auto (up to its cap) + the rest into **ELSS SIP** | 3-year lock is cheap at your age; ~12%+ historical CAGR beats 7.1% PPF in expectation |
| **Mid-career with a home loan** | **Home-loan principal** (you are paying it anyway) + EPF + a **PPF top-up** | No incremental cash outflow; PPF's 7.1% guaranteed with EEE is the safe core |
| **40s+, near retirement** | **PPF first** (15-yr tenure matches your retirement date), SCSS at 60+ | Guaranteed, tax-free, duration-matched; ELSS's equity risk is wrong for you this close |

One more timing rule worth ₹1,000 a year: **PPF contributions before the 5th of the month** earn a month's
interest for that month; contributing on the 6th or later costs you the month's accrual. On a ₹1.5L PPF
balance that is roughly ₹1,300/year of guaranteed interest.

## The regime decision, computed (not guessed)

Use the **80C + NPS Shield calculator** (`/calculators/regime-80c-shield`): enter your gross income, the
₹ you will actually invest in the 80C basket, your 80CCD(1B) self NPS, and your employer NPS — and it
returns the tax under *each* regime, which one wins, and the **rupee value of each bucket at your own
marginal rate** (a bucket is only worth its marginal-slab value: at the 5% slab, ₹1.5L of 80C saves ₹75K,
not ₹46.8K).

$$
\text{80C bucket value} \;=\; \text{old-regime tax (without it)} \;-\; \text{old-regime tax (with it)}
$$

That subtraction — not the 30%-slab headline number you see in every marketing piece — is the honest value
of the deduction for *you*.

## Related

- [India Taxation: The Complete Investor's Guide](./tax-india-investor-complete.mdx)
- [The Tax-Free Wealth Stack (EEE + EET instruments)](./tax-tax-free-wealth-stack.mdx)
- [Government Savings Schemes: PPF, SSY, NSC, KVP](../government-schemes/govt-small-savings-schemes.mdx)
- [Your 10 Lakh Wealth Plan](../personal-finance/pf-wealth-plan-10-lakh.mdx)

## Sources

- 80C limit ₹1.5L, old-regime-only — <a href="https://taxclue.in/blog/section-80c-tax-saving-investments-fy-2025-26">TaxClue 80C guide</a>
- Old vs new regime deduction map FY 2026-27 (80C, 80CCD(1B), 80D, 80E, 80TTA/80TTB) — <a href="https://cleartax.in/">ClearTax / 1 Finance coverage (FY 2026-27)</a>
- PPF 7.1% for FY 2026-27 Q1 (unchanged, 8th straight quarter) — <a href="https://economictimes.indiatimes.com/wealth/invest/ppf-interest-rate-2026-has-public-provident-fund-interest-rate-increased-for-april-june-2026-quarter/articleshow/130060237.cms">Economic Times (07 Apr 2026)</a>
- NPS 80CCD(1)/(1B)/(2) structure; 80CCD(1B) old-regime-only; 80CCD(2) 14% all-employers — <a href="https://smarttaxcalc.in/blog/nps-tax-benefits">SmartTaxCalc (CA-reviewed 15 Oct 2026)</a>

## Update log

- 2026-10-18 — Wave 9: 80C instrument-by-instrument value table, the NPS side-door regime resolution
  (80CCD(1B) old-regime-only, per the Wave 8 `ul-80ccd1b-regime-clarification-2026` record; 80CCD(2)
  14% for all employers works in both regimes), the regime-decision archetype table, the PPF timing
  rule (contribute before the 5th), and the `regime-80c-shield` calculator wiring. PPF 7.1% verified
  for FY 2026-27 Q1 (ET, 07 Apr 2026); re-verify the PPF rate at each quarterly notification (July,
  October, January).


## Sources & Citations

- **Income Tax Act / Economic Times** — Section 80C limit remains ₹1.5 lakh (old regime only). https://economictimes.indiatimes.com/wealth/tax/has-section-80c-deduction-limit-hiked-check-how-much-tax-you-can-save-after-union-budget-2025/articleshow/117821055.cms (verified 2026-08-06)
- **BasuNivesh (18 Mar 2026) + Income Tax Department threshold-limits page (cross-check)** — All tax deductions old vs new regime FY 2026-27 (Budget 2026 + Income Tax Act 2025): 80C Rs 1.5L, 80CCD(1B) Rs 50k, 80D Rs 50k/Rs 1L, 80E Rs 1L, 80TTA Rs 10k, 80TTB reported raised to Rs 1L for seniors (verify - department portal still shows Rs 50k); 80EEA/80EEB sanction windows closed; Income Tax Act 2025 renumbers 80C to Sec 123 etc.; 87A rebate keeps new-regime income up to Rs 12L tax-free. https://www.basunivesh.com/all-tax-deductions-old-vs-new-regime-full-list-fy-2026-27 (verified 2026-10-17)
- **Economic Times / Finance Ministry small-savings notification (30 Mar 2026)** — PPF interest rate FY 2026-27: 7.1% p.a. unchanged for Q1 (Apr-Jun 2026), the 8th straight unchanged quarter (Finance Ministry notification 30 Mar 2026); PPF is EEE - 80C deduction on contribution (old regime), tax-free interest credited annually, tax-free withdrawal; 15-year tenure; partial withdrawal after 5 yrs up to 50% of the lower of year-4 / previous-year balance; deposit before the 5th of the month earns that month interest. https://economictimes.indiatimes.com/wealth/invest/ppf-interest-rate-2026-has-public-provident-fund-interest-rate-increased-for-april-june-2026-quarter/articleshow/130060237.cms (verified 2026-10-18)
- **1 Finance / ClearTax / PFRDA (NPS tax-benefits coverage, 2025-26)** — NPS deduction structure 2026: 80CCD(1) within 80C Rs 1.5L (old regime); 80CCD(1B) extra Rs 50,000 old-regime-only, incl. NPS Vatsalya for a minor child from FY 2025-26; 80CCD(2) employer up to 14% of salary in BOTH regimes (raised from 10% for private sector, FY 2025-26), combined employer EPF+NPS+superannuation exempt cap Rs 7.5L/yr. https://1finance.co.in/blog/nps-tax-benefits-80ccd (verified 2026-10-17)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
