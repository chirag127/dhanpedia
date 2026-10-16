
You now have the three layers of the professional rungs: the
[selection & fee-decay test](./alternatives-hnw-pms-aif-sif-selection.mdx), the
[category decision](./alternatives-aif-category-selection-guide.mdx), and the
[2/20 waterfall](./alternatives-aif-waterfall-economics.mdx). This article is the layer most
investors skip, and the one that quietly decides the answer to *"which of these is actually better for
me?"*: **what the return is after tax and after fees, on the same gross number.**

## The single question to ask any product

Every product on the ladder will quote you a **gross** return: a PMS and a SIF show *net-of-fee*
portfolios, an AIF PPM shows a gross IRR, an index fund shows the index. Those are **not comparable**
until you answer one question:

> **If I put the same ₹10L into each, at the same gross return, over the same years — which one leaves
> me the most money in my own bank account, and at what annualized rate does that grow?**

The gap between a product's gross CAGR and its after-tax, after-fee CAGR is the **wedge**. The wedge is
wider the more the tax lands at a high rate on your gain, and the more fees drag the compounding.

## Where the tax lands: the five products

| Product | Where the tax lands | Rate on a long-term gain | Fee convention |
|---|---|---|---|
| **Index fund** | Your ITR (112A) | **12.5%** above the shared ₹1.25L pool | 0.15-0.25% p.a. |
| **PMS** | Your ITR, scrip-by-scrip (112A) | **12.5%** on listed-equity LTCG | 2% mgmt + 15-20% carry |
| **SIF** | Your ITR (112A-equity-type) | **12.5%** on the long-term equity slice | ~2.25% mgmt + ~2% distribution cap |
| **AIF Cat I/II (unlisted)** | Your ITR, **pass-through at your slab** | **Your marginal rate** (no indexation, no pool) | 2% mgmt + 20% carry |
| **AIF Cat III** | **The fund**, before distribution | **~42.7% fund-level** (incl. surcharge) | 1-2% mgmt + up to 25% perf |

The two rows that decide the comparison are **the unlisted Cat I/II AIF** (your 30% slab beats the
12.5% 112A rate — a much wider wedge) and **the Cat III AIF** (the fund already paid ~42.7%, so you
receive it net — the widest wedge of all, but with tax *deferral* during the hold).

## A worked 10-year comparison at 14% gross

Run ₹1 through a 14% gross annual return for 10 years, then apply each product's tax and a realistic fee
stack. Gross final value: $1.14^{10} = 3.707$ (a 270.7% gain).

| Product | After-tax final (per ₹1) | After-tax CAGR | Total wedge |
|---|---|---|---|
| **Index fund** (0.2% fee) | ~₹3.37 | **~12.9%** | ~9% |
| **PMS** (2% mgmt + 15% carry) | ~₹2.67 | **~10.0%** | ~28% |
| **SIF** (~4.25% all-in) | ~₹2.95 | **~11.3%** | ~20% |
| **AIF Cat I/II unlisted** (2% + 20% carry, 30% slab tax) | ~₹2.44 | **~9.4%** | ~34% |
| **AIF Cat III** (~42.7% fund-level, 1.5% mgmt + 20% perf) | ~₹2.05 | **~7.7%** | ~45% |

*(Computed by the [tax-wedge calculator](/calculators/pms-sif-aif-tax-wedge); exact figures depend on
your fee inputs.)*

Read that table the right way: **at 14% gross, an index fund is the most tax-efficient home for that
return.** A PMS earns its fees by outperforming the index — but you only benefit *net* if its alpha
exceeds its fee-and-tax wedge over a plain index, which is the exact test in the
[selection guide](./alternatives-hnw-pms-aif-sif-selection.mdx). The AIFs are not "better returns" at
equal gross; they are **different-asset-class returns** (unlisted, pre-IPO, private credit) that a listed
fund *cannot* reach — the wedge is the price of that access.

## What this means for your ladder

| Your rung | The honest read |
|---|---|
| **₹10L (you, now)** | An index fund + a SIF sleeve beats a PMS *net* at equal gross. Your PMS/SIF edge must come from **alpha or a different asset**, not from the ticket size. |
| **₹50L** | A PMS is a reasonable core; the Cat I/II unlisted wedge only pays off if the private-market *alpha* clears ~2-3× the index's wedge. |
| **₹1Cr** | The first AIF commitment; the Cat I/II wedge is the real cost of unlisted access. A Cat III is a satellite, taxed net of the fund's ~42.7%. |

The **decision rule**: a higher-fee, higher-tax product is only worth it if
**its gross edge over the cheaper alternative × (1 − wedge)** is still positive. That multiplication is
why a PMS that "beats the index by 300 bps gross" can *lose* to the index after its own fee-and-tax
wedge — and why an unlisted AIF that returns 14% gross can hand you less per rupee than a 12% index.

## Three traps that make the wedge look smaller than it is

1. **The 194LBB TDS cash-flow trap.** A Cat I/II AIF credits you income (and 10% TDS) *before* you are
   paid out. You can owe advance tax on money that never hit your bank account — the
   [advance-tax clocks](../taxation/tax-advance-itr-final-checklist.mdx) still run on the credit. The
   calculator shows the *exit* tax; the TDS is a *cash-flow* problem on top of it.
2. **The shared ₹1.25L pool resets yearly but a 10-year exit uses one.** The calculator zeroes the pool
   for a multi-year single exit because the pool is an *annual* equity-LTCG bucket; a huge exit in one
   year is taxed above that one year's ₹1.25L, not a 10-year accumulated pool.
3. **Cat III "net of tax" can hide the surcharge.** The ~42.7% is with surcharge at the fund level; a
   specific trust deed and tax note can change it. Read the fund tax note, as the
   [AIF taxation article](../taxation/tax-aif-pcc-115bb-deep-dive.mdx) says.

## Related

- [Picking Your Own Rung: The SIF / PMS / AIF Selection & Fee-Decay Decision Guide](./alternatives-hnw-pms-aif-sif-selection.mdx)
- [AIF Category Selection: Which Rung of ₹1Cr Fits Your Capital](./alternatives-aif-category-selection-guide.mdx)
- [The 2/20 Waterfall: How Carried Interest Actually Splits an AIF's Money](./alternatives-aif-waterfall-economics.mdx)
- [SIF Strategy Families Decoded](./alternatives-sif-strategy-families-deep-dive.mdx)
- [AIF Taxation Decoded (115UB pass-through / 64C-to-78)](../taxation/tax-aif-pcc-115bb-deep-dive.mdx)

## Sources

- 112A equity-LTCG 12.5% above ₹1.25L shared pool; unlisted-equity 24-month LTCG at slab — <a href="https://taxguru.in/income-tax/budget-2024-transforms-capital-gains.html">TaxGuru Budget-2024 capital-gains change / Finance Bill 2024 memo</a>
- PMS/AIF fee conventions (2% mgmt, 15-20% carry, Cat III up to 25% perf) — <a href="https://www.nucleusadvisors.in/insights/gp-lp-economics-fee-carry-hurdle">Nucleus Advisors GP-LP economics</a>
- Cat I/II/III structure, 30% slab pass-through for unlisted, ~42.7% Cat III fund-level — <a href="https://altportfunds.com/understanding-category-i-ii-iii-aifs-whats-the-difference/">Altportfunds AIF categories</a>

## Update log

- 2026-10-18 — Wave 10: the after-tax wedge table (index / PMS / SIF / AIF Cat I-II / Cat III at equal
  14% gross over 10 years), the 194LBB cash-flow trap, the shared-pool caveat, and the decision rule
  (gross edge × (1 − wedge) must be positive). The SIF 12.5% 112A-equity treatment and the ~42.7% Cat III
  fund-level rate are secondary readings — verify the specific SIF/ Cat III scheme tax note before
  acting. Exact wedge figures are produced by the `afterTaxProductWedge()` function and the
  `pms-sif-aif-tax-wedge` calculator, which you should re-run with your own fee and slab inputs.


## Sources & Citations

- **Upstox / Value Research / SEBI Investor / Economic Times (ELSS + FY 2025-26 MF tax rules)** — ELSS taxation 2026: Rs 1.5L 80C deduction (old regime only; no deduction under the default new regime), mandatory 3-year lock-in per allotment (SIP instalments lock-in separately), 80% equity minimum, LTCG 12.5% above Rs 1.25L/yr shared across all equity gains. https://upstox.com/learning-center/mutual-funds/how-to-calculate-ltcg-tax-on-elss-mutual-funds/article-943 (verified 2026-10-17)
- **PMS Sahi Hai / SEBI PMS notification coverage (2026)** — PMS / AIF fee convention 2026: management fee on opening corpus (2-2.5% flat, or ~1-1.75% + 15-20% performance above an 8-12% hurdle), performance on gain-above-benchmark, no clawback in the SEBI recurring-fee model; PMS gains pass through and are taxed as the investor own CGT. https://www.pmssahihai.com/insights/pms-charges (verified 2026-10-17)
- **Planify / SEBI (AIF) Regulations, 2012 (2026 coverage)** — SEBI AIF categories (2026): Cat I (non-debt, venture, private equity), Cat II (non-leveraged, structured), Cat III (leveraged/hedge funds); Rs.1Cr minimum for most AIFs (Rs.25L for angel funds and manager-employee/director investors); Cat I/II close-ended with a 3-year minimum tenure; up to 1000 investors per scheme (49 for angel funds). https://www.planify.in/article/sebi_regulations (verified 2026-10-17)
- **Nucleus Advisors, "GP-LP economics: management fee, carry, hurdle - the standard ladder" (07 Jan 2026)** — AIF GP-LP economics: the '2 and 20' standard ladder - management fee 2%/yr (committed capital during investment period, then NAV/invested during harvest), 20% carried interest, 8% IRR preferred return (hurdle), 100% GP catch-up; worked 500 Cr / 3x / 10-yr fund lands LPs at ~1300 Cr (2.6x net) and the GP at ~200 Cr carry + 70-80 Cr fee (~5-6% of fund value); the hurdle and catch-up are the terms that move in negotiation (raising the hurdle 8 to 10% cut GP carry ~20-25 Cr); clawback via 20-30% escrow holdback; GP all-in ~5-6% of fund value on a success, fee-only on a failure. https://www.nucleusadvisors.in/insights/gp-lp-economics-fee-carry-hurdle (verified 2026-10-18)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
