
The [AIF category selection guide](./alternatives-aif-category-selection-guide.mdx) told you *which*
category to pick and showed the fee-decay math on a one-year basis. This article goes one level deeper,
into the part of the fund document (the PPM / LPA) that actually decides **how much of the fund's money
ends up with you**: the distribution waterfall. "2 and 20" is not one number — it is **four** numbers,
in a fixed order, and two of them (the hurdle and the catch-up) are where your real negotiating power is.

## The four levers, in the order the money flows

Every Indian Category I / II AIF runs some version of the same ladder:

1. **Management fee** — the GP's quarterly charge for running the fund. Standard: **2% per annum on
   committed capital during the ~5-year investment period, then 2% on invested capital (or NAV) during the
   harvest period** — the base shrinks as the portfolio is monetised, so the fee falls in later years.
2. **Carried interest (carry)** — the GP's share of *profits*, standard **20%**, and only after you have
   been made whole to the hurdle.
3. **Preferred return (hurdle)** — the minimum return you receive on committed capital before the GP earns
   any carry. Standard: **8% IRR, compounded annually**.
4. **GP catch-up** — once the hurdle is paid, the GP takes **100% of the next slice of profits** until its
   cumulative share of total profits equals 20%; after that, the split moves to 80-20.

The catch-up is the term most first-time LPs skip. Its job is mechanical: without it, a fund that clears
the hurdle by even a little would pay the GP almost nothing, because the GP only earns 20% *after* the
hurdle. The catch-up gives the GP a fast lane back to its proportional 20% share, which is exactly why a
**100% catch-up is GP-friendly** and a 50% or no catch-up is LP-friendly.

## A worked fund: ₹500 Cr committed, 3x over 10 years

Take a ₹500 crore fund that returns ₹1,500 crore over ten years (3x gross, ~25% gross IRR), standard
2/20 economics with an 8% hurdle and a 100% catch-up:

| Step | What happens | Amount (Cr) |
|---|---|---|
| 1 | LPs get their committed capital back | 500 |
| 2 | LPs get the 8% preferred return (compounded over 10 years) | ~579 |
| 3 | Catch-up: GP takes 100% of the next slice until GP profit = 20% of total profit | ~145 to GP |
| 4 | Remaining profit split 80-20: ₹276 Cr x 80% to LPs, x 20% to GP | 221 to LP, 55 to GP |
| | **Total to LPs** (500 + 579 + 221) | **~1,300** |
| | **Total GP carry** (145 + 55) | **~200** |
| | Plus cumulative management fee over 10 years | ~70-80 |

The GP's all-in economics (fee + carry) land around **5-6% of fund value** on a success. Two things to
take from that:

- **Your gross multiple and your net outcome are different animals.** The fund "did 3x" — but a large chunk
  of that gross profit is what the fee ladder kept. The *net* IRR to LPs here is around 10%, not the 25%
  gross figure the marketing would lead with.
- **An unsuccessful fund pays the GP only the management fee.** For a ₹500 Cr fund that is the same ₹70-80
  Cr over ten years with no carry. That is the alignment you are buying: the GP only does well if you do.

$$
C \;=\; \frac{\text{LP hurdle increment} \times \text{carry}}{1-\text{carry}}
$$

For the worked fund the LP hurdle increment is ₹79 Cr (₹579 Cr preferred total minus ₹500 Cr capital), so the
100% catch-up is $79 \times 0.20 / 0.80 \approx ₹19.75$ Cr. **The catch-up zone is always capped by the
actual profit above the hurdle** — a fund that clears the hurdle by only ₹5 Cr pays the GP at most ₹5 Cr in
the catch-up zone. That cap, and every other step, is done for you in the
[AIF Waterfall calculator](/calculators/aif-waterfall) below.

## What actually moves in negotiation

The fee percentage (2%) and the carry percentage (20%) are **anchored in market convention** and barely
move. What a sophisticated LP negotiates is:

| Lever | Standard | Where it moves | Why it matters |
|---|---|---|---|
| **Hurdle** | 8% IRR | Up to 9-10% (debt / infra strategies) | The single most-negotiated term. Raising the hurdle from 8 to 10% cut the GP's total carry by ~₹20-25 Cr on the worked fund |
| **Catch-up** | 100% (GP-friendly) | 50% or none (LP-friendly) | Affects *timing* of the GP's carry in a successful fund, and barely matters in an unsuccessful one |
| **Fee base** | Committed capital (investment period) | Invested capital or NAV | Committed-capital fees charge you on money *not yet deployed* — the GP-friendly base |
| **Clawback** | 20-30% escrow holdback | Enforceable vs. paper-only | See below |

The practical insight from practitioner guidance: **first-time GPs often concede on the carry percentage
(the wrong thing to concede) when the right move is to concede on the catch-up.** The carry percentage is
permanent for the fund's life; the catch-up change matters only in a *successful* fund.

## The clawback — the term that protects you when the fund misses

A fund can pay the GP carry early (interim distributions), then end its life *below* the hurdle. The
**clawback** clause makes the GP return that excess carry. Two structural facts make it fragile in India:

- A poorly drafted clawback can require the GP to return money **years after it has been distributed to the
  GP's individual partners** — practically unenforceable.
- The standard fix is an **escrow holdback of 20-30% of every carry payment**, released only when the fund
  confirms at wind-up that the hurdle was met. Read the LPA for which version you got.

## The decision test for your ₹1 Cr ticket

You are the *smallest* investor in any of these structures, which means the fixed 2% fee is your largest
relative drag. Before committing:

1. **Run the numbers at your size.** A ₹1 Cr position in a fund with the worked economics: the 2% fee is
   ₹20,000/year *regardless of your outcome* — that is 20% of a reasonable ₹1L net annual profit before
   any carry. The [fee-decay decision test](./alternatives-hnw-pms-aif-sif-selection.mdx) applies.
2. **Ask for the waterfall summary page of the PPM**, not the marketing deck. The four levers above are in
   it; the marketing deck is not.
3. **Check the clawback and escrow language.** If the clawback is paper-only with no holdback, value the GP's
   carry as already spent, and price the fund lower.
4. **Use the [AIF Waterfall calculator](/calculators/aif-waterfall)** with the fund's actual terms — not the
   2/20 defaults — to see your net multiple and net IRR, with and without the catch-up.

## Related

- [AIF Category Selection: Which Rung of ₹1Cr Fits Your Capital](./alternatives-aif-category-selection-guide.mdx)
- [Picking Your Own Rung: The SIF / PMS / AIF Selection & Fee-Decay Decision Guide](./alternatives-hnw-pms-aif-sif-selection.mdx)
- [Beyond SIP: PMS, AIFs & Private Markets for Growing Capital](./alternatives-pms-aif-private.mdx)
- [The Tax-Free Wealth Stack](./tax-tax-free-wealth-stack.mdx)

## Sources

- GP-LP economics: fee, carry, hurdle, catch-up, clawback — <a href="https://www.nucleusadvisors.in/insights/gp-lp-economics-fee-carry-hurdle">Nucleus Advisors (07 Jan 2026)</a>
- PMS/AIF fee conventions (2-2.5% mgmt, 15-20% carry above hurdle, pass-through structure) — <a href="https://www.planify.in/article/sebi_regulations">Planify / SEBI coverage</a>

## Update log

- 2026-10-18 — Wave 8: four-lever waterfall decomposition, worked ₹500 Cr / 3x / 10-year example (LP ~₹1,300 Cr,
  GP ~₹200 Cr carry + ₹70-80 Cr fee), the negotiation levers table (hurdle and catch-up as the ones that
  move), the clawback / escrow-fragility note, and the ₹1 Cr smallest-ticket decision test. The worked
  figures follow the standard European-style (end-of-fund) waterfall with a 100% catch-up; real funds vary
  by LPA — read the PPM waterfall page for the specific fund.


## Sources & Citations

- **Nucleus Advisors, "GP-LP economics: management fee, carry, hurdle - the standard ladder" (07 Jan 2026)** — AIF GP-LP economics: the '2 and 20' standard ladder - management fee 2%/yr (committed capital during investment period, then NAV/invested during harvest), 20% carried interest, 8% IRR preferred return (hurdle), 100% GP catch-up; worked 500 Cr / 3x / 10-yr fund lands LPs at ~1300 Cr (2.6x net) and the GP at ~200 Cr carry + 70-80 Cr fee (~5-6% of fund value); the hurdle and catch-up are the terms that move in negotiation (raising the hurdle 8 to 10% cut GP carry ~20-25 Cr); clawback via 20-30% escrow holdback; GP all-in ~5-6% of fund value on a success, fee-only on a failure. https://www.nucleusadvisors.in/insights/gp-lp-economics-fee-carry-hurdle (verified 2026-10-18)
- **PMS Sahi Hai / SEBI PMS notification coverage (2026)** — PMS / AIF fee convention 2026: management fee on opening corpus (2-2.5% flat, or ~1-1.75% + 15-20% performance above an 8-12% hurdle), performance on gain-above-benchmark, no clawback in the SEBI recurring-fee model; PMS gains pass through and are taxed as the investor own CGT. https://www.pmssahihai.com/insights/pms-charges (verified 2026-10-17)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
