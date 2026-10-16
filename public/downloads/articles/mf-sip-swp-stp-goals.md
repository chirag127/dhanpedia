
# SIP, STP & SWP: Structured Investing and Goal Planning

Three automation tools — Systematic Investment Plan (SIP), Systematic Transfer Plan (STP), and Systematic Withdrawal Plan (SWP) — cover the three life phases of money: **putting it in**, **moving it between risk buckets**, and **taking it out**. This article gives you the exact math for each, worked examples with stated assumptions, and the goal-ladder method that turns "I want a car in 3 years" into a specific monthly number.

Every number below states its assumption. If you change the return, change the answer — that is the whole point of doing the arithmetic yourself rather than trusting a headline.

## The SIP future value formula

$$FV = P\,\frac{(1+i)^{n}-1}{i}$$

where $P$ is the monthly contribution, $i$ is the **monthly** expected return (annual return ÷ 12), and $n$ is the number of months. The standard SIP convention assumes each instalment is invested at the start of the month and that interest compounds monthly. A different convention (instalments at month-end, no intra-month compounding) gives a slightly lower FV; the difference is small and the [calculator cross-reference](#calculator-cross-reference) below is where you can check both.

### Worked example 1 — 12% p.a.

₹10,000/month, 15 years, 12% p.a. ($i = 0.01$):

$$(1.01)^{180} = 5.997 \quad\Rightarrow\quad FV = 10{,}000 \times \frac{5.997-1}{0.01} = 10{,}000 \times 499.7 \approx ₹49.9\text{L}$$

- **Total contributed:** ₹10,000 × 180 = **₹18L**
- **Return earned (paper gain):** ₹49.9L − ₹18L = **₹31.9L**

### Worked example 2 — 15% p.a.

₹10,000/month, 15 years, 15% p.a. ($i = 0.0125$):

$$(1.0125)^{180} \approx 9.356 \quad\Rightarrow\quad FV = 10{,}000 \times \frac{9.356-1}{0.0125} = 10{,}000 \times 668.5 \approx ₹66.9\text{L}$$

- **Total contributed:** ₹18L
- **Return earned:** **₹48.9L**

### What the two examples actually teach you

The return gap is 3 percentage points (12% vs 15%). The corpus gap is ₹17L — **₹66.9L vs ₹49.9L**. A 3 pp return difference, sustained for 15 years, is a 34% larger corpus. This is the *entire* case for indexing and cost discipline: the index-fund article's direct-vs-regular gap (a 0.6% expense drag) is the same species of "small number, sustained, compounded" — but here the *return assumption* is the biggest driver, and the return assumption is the number you control least. The [index article](../mutual-funds/mf-index-etf-direct-regular.mdx) covers the cost side; this article covers the assumption side.

**Assumptions, stated explicitly, for both examples:**

- 12% and 15% are *nominal annual* expected equity returns, not promises. India's equity market has delivered different realised returns in every historical window; a 15% assumption over 15 years is the *upper end* of a plausible range, not a forecast.
- Monthly compounding at annual/12. No intra-month timing.
- No taxes on the intermediate gains (equity SIP gains are taxed at redemption, under the equity capital-gains regime — verify current rates and exemptions against the income-tax slabs reference, [src-it-slab-calculator](../mutual-funds/mf-sip-swp-stp-goals.mdx), time-sensitive, last verified 2026-08-06).
- No step-ups. If your income grows, the SIP should grow; the examples above are level.

## SIP vs lump sum: the honest version

The common framing — "market timing is hard, so SIP wins" — is incomplete, and this article says it plainly:

> **In a sustained bull market, a lump sum invested on day one beats the SIP, because the money was at work from day one. In a sustained down market, the SIP beats the lump sum, because the SIP bought more units on the way down. You cannot predict which regime you are in. Therefore: on a risk-adjusted basis, SIPs dominate — not because they earn more when markets go up, but because they cap your loss when they go down, and the capping is the value that compounds.**

The three-part structure is the argument. Drop any part and the conclusion breaks:

- "Lump sums win in bull markets" — true, and the part most SIP marketing ignores.
- "SIPs win in down markets" — true, and the part most lump-sum marketing ignores.
- "You cannot tell which market you are in" — the part that makes the choice a *risk* choice, not a *return* choice. A SIP is a risk-reduction tool with a cost (you sacrifice the bull-market edge); a lump sum is a risk-increase tool with a benefit (the bull-market edge). If your money is for a goal with a hard deadline, the risk of the lump sum sitting in an equity market for the final months is *your* risk, not the market's. That is the argument for the [ladder](#the-goal-ladder-method), not for "always do SIPs."

## STP: harvesting gains between buckets

A **Systematic Transfer Plan** automatically moves money from one fund to another on a schedule (monthly, quarterly, trigger-based). The canonical use in India is **debt-to-equity harvesting**: you hold a corpus in a debt fund or PPF-adjacent bucket, and on each pay day a slice STPs into an equity fund. Two things make this tool quietly powerful:

1. **The transfer is a deemed redemption.** The slice you move out of the debt fund is taxed at that moment (debt-instrument capital-gains rules apply to the debt portion; verify the current rules against the slabs reference). The equity slice then *starts a new holding period* in the equity fund — the clock for the equity capital-gains rules restarts on every STP'd tranche. Over a multi-year STP schedule, you have naturally layered a long tail of holding periods, which is the same effect the [laddering section](#fixed-income-laddering-by-proxy) describes for bonds.
2. **The STP removes the behavioural layer.** You do not decide each month "should I move money into equity?" — the schedule does. The decision you *do* make, once, is: source bucket, destination bucket, amount, frequency.

The tax note is the one most people miss: **an STP is not tax-free because it is "just a transfer."** It is a redemption plus a purchase. If the source is a tax-exempt bucket (a PPF, for example, until maturity), the "deemed redemption" framing changes — PPF has its own partial-withdrawal rules; check the scheme's current limits before you plan an STP out of it.

## SWP: creating income from a corpus

A **Systematic Withdrawal Plan** does the mirror: on a schedule, a value (or number of units) is redeemed out of the fund and paid to you. The three income sources every retiree in India is offered are the SWP, the FD (fixed deposit), and the annuity. Here is the honest comparison:

| | SWP (diversified equity/debt fund) | FD withdrawal | Annuity (pension scheme) |
|---|---|---|---|
| Where the income comes from | Units sold; corpus can grow or fall | Fixed coupon; principal untouched unless you break the FD | Premium paid; return is the annuity payout |
| Tax on the income | Capital-gains treatment (short- or long-term, depending on the unit sold and its holding period; equity-oriented funds follow the equity CG regime) | Interest is taxed **every year** at your slab rate, on the full amount | Tax treatment depends on the scheme and the annuity's composition — verify the current rules |
| Inflation protection | If the corpus is growth-weighted, the corpus itself compounds against inflation | None built in; a fixed ₹X/year gets more expensive to live on every year | None built in, unless the annuity has an inflation rider (if offered) |
| Loss of principal risk | Yes — in a bad sequence, the corpus can fall and the SWP can accelerate the fall | No (until you need the principal, which is the FD's own risk) | No — the annuity is the point |
| What you give up | The full upside of the corpus; the tax complexity | The compounding of the corpus you break | The flexibility of the corpus; the insurer's credit risk replaces the market's |

The **sequence-of-returns risk** is the SWP's real hazard: a bad first year after retirement (a deep drawdown) forces the SWP to sell units at the bottom, and the corpus has less time to recover. The [retirement article](../retirement-fire/retirement-fire-annuities.mdx) has the 4% rule and the sequence-risk math; the SWP here is the *mechanism* that delivers the 4% rule on a fund, not the strategy itself. If you are on the taxable-coupon side (FD, most debt funds), the SWP has one structural edge: you are paying capital-gains tax on the units you sell, not slab-rate tax on every rupee of interest, every year. That is worth quantifying against your specific slab before you choose the income source.

## The goal-ladder method

The rule: **one goal, one corpus, one horizon, one return assumption, one funding mechanism.** Then work backwards. The return assumption is *risk-matched to the horizon*:

- **≤ 3 years** — money in a debt bucket. A 3-year goal has no time to absorb an equity drawdown; the return assumption should be the realistic debt return, not the equity average. (The current repo rate sits near 5.25% as of late 2025 — time-sensitive, verified 2026-08-06; debt yields track it, verify the current rate before quoting it.)
- **3–10 years** — a debt-leaning mix. The closer to 10 years, the more equity you can carry; at 10 years the corpus has time to recover a mid-decade drawdown.
- **> 10 years** — an equity-leaning mix. The long horizon is where the two worked examples above apply.

### Worked: a car in 3 years, ₹50L

- **Horizon:** 36 months. **Return assumption:** 12% p.a. (a debt-heavy mix that *happens* to earn 12% is not realistic; use the debt bucket's realistic number and re-run the math below — the point is the *method*, not the 12%).
- **Required FV:** ₹50,00,000.
- **SIP formula, $i=0.01$, $n=36$:**

$$FV = P\,\frac{(1.01)^{36}-1}{0.01} = P \times 43.08 \quad\Rightarrow\quad P = \frac{50{,}00{,}000}{43.08} \approx ₹1{,}16{,}000/\text{month}$$

- **Total contributed:** ₹1.16L × 36 ≈ **₹41.8L**. **Return earned:** ~**₹8.2L** over 3 years.
- **Sensitivity:** at 8% p.a. (a more conservative debt-mix assumption), the factor is $\frac{(1.006667)^{36}-1}{0.006667} \approx 40.54$, so $P \approx ₹1.23\text{L}/\text{month}$. A 4 pp return assumption moves your required monthly SIP by ~₹7,000.

### The ladder, in one table

| Goal | Corpus | Horizon | Assumed return | i (mo) | n | Annuity factor | Required SIP |
|---|---|---|---|---|---|---|---|
| Car | ₹50L | 3 yrs | 12% (debt-mix) | 0.01 | 36 | 43.08 | ≈ ₹1.16L/mo |
| Home down payment | ₹35L | 5 yrs | 12% | 0.01 | 60 | 81.67 | ≈ ₹42,900/mo |
| Child's education | ₹80L | 10 yrs | 10% (debt-leaning) | 0.008333 | 120 | 204.96 | ≈ ₹39,000/mo |
| Retirement corpus | ₹4Cr | 20 yrs | 12% (equity-leaning) | 0.01 | 240 | 989.2 | ≈ ₹40,400/mo |

*Verification of every row (so the ladder is fully auditable):* $P = FV \div \text{factor}$, where factor $= ((1+i)^n - 1)/i$ and $i = r_{annual}/12$.

- **Car:** $(1.01)^{36}=1.4308$ → factor $=43.08$ → $P=50{,}00{,}000/43.08 = ₹1{,}16{,}076$ ≈ ₹1.16L/mo.
- **Home:** $(1.01)^{60}=1.8167$ → factor $=81.67$ → $P=35{,}00{,}000/81.67 = ₹42{,}856$ ≈ ₹42,900/mo.
- **Education:** $(1.008333)^{120}=2.7080$ → factor $=204.96$ → $P=80{,}00{,}000/204.96 = ₹39{,}031$ ≈ ₹39,000/mo.
- **Retirement:** $(1.01)^{240}=10.892$ → factor $=989.2$ → $P=40{,}00{,}000/989.2 = ₹40{,}437$ ≈ ₹40,400/mo. (Sanity: ₹10,000/mo at 12% for 20 yrs grows to ≈ ₹98.9L, so ₹4Cr needs ~₹40,400/mo — consistent.)

Each row is one corpus, one horizon, one mechanism. **Do not merge rows** — the education corpus and the retirement corpus are different risk budgets, and merging them into one "growth SIP" is the most common self-inflated plan in Indian household finance.

### The last-12-months rule

In every row, the final 12 months of the horizon are in a debt bucket, no matter what. The equity portion of the corpus is STP'd or redeemed (in tranches) into debt over the 12 months before the goal date. This is where the sequence-of-returns risk actually lives: a ₹35L home deposit is *not* something you let ride an equity index for the last year.

## Fixed-income laddering, by proxy

The same laddering logic that applies to bonds (a maturing coupon every year, reinvested into the next rung) is what a **debt→equity STP schedule** does for an equity corpus: every STP'd tranche starts a new holding period, so the *tax* profile of the corpus ladders automatically. For the bond version of this — explicit rungs, maturing coupons, a 10-year ladder against a known income need — see the [fixed-income article](../fixed-income/fixed-income-bonds-credit.mdx).

### Step-up SIPs and top-ups

A level SIP is the cleanest model but under-plans for a life in which income grows. Two mechanisms fix that:

- **Step-up SIP:** the instalment grows by a fixed *percentage* each year (or at the start of a new year). The classic use: raise the SIP by your expected salary-growth rate each year.
- **Top-up / lump addition:** a one-off extra instalment (a bonus, a side-income windfall) added to the running SIP.

Step-up math (worked, contribution side only — the FV gap scales with it): ₹10,000/month, 20 years, 10% p.a. step-up.

- **Total contributed, flat SIP:** ₹10,000 × 12 × 20 = **₹24L**.
- **Total contributed, 10% step-up:** $\sum_{k=1}^{20} 10{,}000 \times 12 \times (1.1)^{k-1} = 1{,}20{,}000 \times \frac{1.1^{20}-1}{0.1} = 1{,}20{,}000 \times 57.28 \approx \mathbf{₹68.7L}$ total (vs ₹24L flat) — i.e. **₹44.7L of extra contribution** on top of the flat-SIP total.

The FV advantage of the step-up is *more* than the extra contribution, because the later (bigger) instalments have more time to compound — but the exact FV depends on the compounding convention, so use the calculator rather than a headline. The decision worth making is the *step-up rate*: set it at your realistic income growth, not at hope. A 10% step-up you cannot sustain in year 6 is worse than a 5% step-up you sustain for 20.

### Inflation-adjusting the goal value

A nominal goal understates the money you need. A car quoted at ₹47L *today* is not ₹47L in three years if car prices rise with inflation:

$$\text{Future goal} = \text{Today's value} \times (1+g)^{h}$$

At 6% p.a. price growth over 3 years: $47 \times 1.06^3 = 47 \times 1.191 \approx ₹55.9\text{L}$. The car example in the goal-ladder above used a clean ₹50L target; inflation-adjusting it to ~₹56L moves the required SIP up by roughly 12%. **Inflation-adjust every goal before you run the ladder math** — this is the step that turns a "₹50L car" plan into an actually-achievable one. The growth rate $g$ to use is the *price inflation of that good or service* (education and medical costs historically run above general CPI; a car's price is closer to general inflation). Label your $g$ explicitly.

### Reverse STP: equity to debt near the goal

The STP tool also runs the other direction, and this is where goal planning meets sequence risk. With 12 months to a hard-deadline goal, the discipline is to **STP the equity corpus into a debt bucket** (or redeem in tranches into debt) so the final stretch is not riding an equity index. This *harvests* the equity gain you have so far (taxed at that moment under the equity CG rules — verify current rates) and locks the principal into a low-duration instrument. You are paying a small tax cost now to remove the single biggest threat to a deadline goal: a market drawdown in the final 6–12 months. The forward STP (debt→equity) is a growth tool; the reverse STP (equity→debt) is a *protection* tool, and goal-based planning is the context in which it earns its keep.

### SWP execution: amount method vs unit method

The SWP's mechanics matter more than the marketing implies. Two execution modes:

- **Amount method (fixed ₹/month):** the platform redems whatever units equal that ₹ amount. In a down market, more units are sold to raise the same ₹ — the corpus erodes faster exactly when it can least afford it. This is the dangerous mode near retirement, because the first-year drawdown compounds.
- **Unit method (fixed units/month):** a fixed number of units is sold regardless of NAV; the ₹ paid to you *varies* with the NAV. The corpus erosion is more stable, but your income fluctuates — bad for a retiree who needs a steady pension-like payout.

Most retirement SWPs use the amount method with a *floor* on the withdrawal rate (the 4% rule's analogue). The honest read: the amount method is a *smoother income* at the cost of *higher sequence risk*; the unit method is the reverse. Whichever you pick, the [retirement article](../retirement-fire/retirement-fire-annuities.mdx) governs the *rate*, and this section governs the *execution*. The tax note applies to both: the units sold carry their own holding period, so an SWP that has been running for years is selling long-term-hold units (favourable) early on and short-term-hold units (less favourable) only for the recent tranches.

### The behaviour layer: auto-debit and the crash-year instinct

The structural value of a SIP is *automaticity*: the money moves whether the market is up or down. The single most expensive behaviour pattern in Indian investing is **pausing the SIP in a crash year**, because that is the year the units are cheapest and the compounding benefit is largest. Auto-debit removes that decision from the month it is hardest to make. If you must keep manual control, the rule that survives scrutiny: *never pause a running SIP on the basis of a single quarter's return*; the only legitimate pause is a cash-flow event (a job loss, a large expected expense), and even then, a *reduced* SIP beats a *stopped* one.

## Calculator cross-reference

The two worked examples above are deliberately *not* a calculator, because the point is that you can run the same arithmetic in 30 seconds with the formula above. If you want a tool that does it for you and also handles the step-up SIP (the ₹10,000/month that grows to ₹12,000/month after year 2), use the **DhanPedia SIP calculator** on this site: enter $P$, $i$, $n$, and a step-up rate, and it will print the FV, the total contributed, and the paper gain — the same three numbers the examples above print, in one click. The calculator's assumptions (monthly compounding, start-of-month instalment) match the formula above; if you use a calculator that assumes month-end, your FV will be marginally lower, and that is correct, not a bug.

## Related

- [Index Funds, ETFs, Direct vs Regular Plans & Tracking Error](../mutual-funds/mf-index-etf-direct-regular.mdx) — the cost side this article's return assumption depends on.
- [How to Choose and Compare Mutual Funds](../mutual-funds/mf-choosing-comparing-funds.mdx) — the mandate-clarity step that decides *which* fund the SIP feeds.
- [Your 10 Lakh Wealth Plan](../personal-finance/pf-wealth-plan-10-lakh.mdx) — the allocation framework that decides *what fraction* of your income is the SIP's $P$.
- [Retirement & FIRE](../retirement-fire/retirement-fire-annuities.mdx) — the SWP side, and the sequence-of-returns risk this article names.

## Sources

- `src-it-slab-calculator` — secondary summary of the FY 2025-26 / FY 2026-27 income-tax slabs; referenced for the *time-sensitive* capital-gains-rate and slab-rate claims throughout this article, all marked "verify." No specific tax figure is asserted.

## Update log

- **2026-08-06** — last verified. The 12% and 15% return assumptions are *assumptions*, not forecasts; they are labelled as such in both worked examples. The repo-rate figure (≈5.25%, late 2025) is time-sensitive and marked "verify against the latest RBI MPC." All SIP FV numbers are arithmetic under the stated monthly-compounding convention; a different convention gives a slightly different FV, which the [calculator cross-reference](#calculator-cross-reference) acknowledges. The car-in-3-years example is a method illustration; its 12% assumption is flagged as unrealistically high for a debt bucket and the reader is directed to re-run the math at their debt bucket's realistic yield.


## Sources & Citations

- **Cleartax (secondary summary of official slabs)** — Income Tax Slabs FY 2025-26 & FY 2026-27 (New and Old Regime). https://cleartax.in/s/income-tax-slabs (verified 2026-08-06)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
