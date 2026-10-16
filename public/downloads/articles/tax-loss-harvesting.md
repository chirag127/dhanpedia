
**Scope note.** A capital loss in India is not "lost money" — it is a **tax asset** that can wipe out current-year gains and, if unused, **carry forward for eight assessment years** under **§70(3).** Most retail investors never use it: the ITR is filed late, the loss is not claimed, and the asset silently expires. This article is the *mechanics* of the set-off and carry-forward waterfall, the specific *constraints* (LTCG-only set-off, 87A rebate trap, F&O speculation rules), and a **practical harvesting workflow** for a ₹10 lakh portfolio. Figures marked **"(verified 2026-10-16)"** are checked against the cited sources.

## The set-off and carry-forward waterfall (Sections 70–74)

The Income-tax Act prescribes a **fixed order** for loss adjustment. [src-loss-carry-forward-2026]

### Step 1 — Intra-head set-off (§70)

First, **losses within the same head** offset gains within that head:

- **STCL** (short-term capital loss) can be set off against **both STCG *and* LTCG** in the same year.
- **LTCL** (long-term capital loss) can **only** be set off against **LTCG** in the same year.

> **Key asymmetry:** STCL is *flexible*; LTCL is *rigid*. A long-term capital loss is useless against a short-term gain in that year.

### Step 2 — Inter-head set-off (§71)

After intra-head, unabsorbed **business losses** (not speculation) can be set off against *other* heads, but:

- **Capital losses cannot be set off against salary, interest, or business income.**
- **House-property loss** is capped at **₹2,00,000** for inter-head set-off.
- **Speculation losses** (including F&O under most interpretations) can only be set off against **speculation gains** in the same year; the *unabsorbed* amount does **not** carry forward under the same rules as ordinary capital losses.

### Step 3 — Carry-forward (§70(3))

Any **unabsorbed STCG/STCL/LTCL** that survives Steps 1 and 2 is **carried forward for eight assessment years (AY)**, set off against the *corresponding* gain type in those future years:

| Loss type | Can be set off against in future years | Carry-forward window |
|---|---|---|
| **Unabsorbed STCL** | STCG *and* LTCG | 8 AYs |
| **Unabsorbed LTCL** | LTCG only | 8 AYs |

**The §139(1) deadline is the gate.** To *claim* carry-forward, you **must file the ITR for the year in which the loss was incurred *by the §139(1) due date*** (typically 31 July for individuals; 31 October with audit). If you miss the due date, **the loss does not carry forward** — it is gone, even if you later file a belated return. [src-loss-carry-forward-2026]

## The §87A rebate trap (the "₹12L threshold" that bites)

The **§87A rebate** reduces tax to *zero* for total taxable income up to **₹12L** (FY 2026-27, new regime, verified [src-it-slab-fy2026-27]). This creates a **counter-intuitive interaction** with capital-gains harvesting:

- If your *total* taxable income (salary + interest + STCG + LTCG + other heads, *after* all deductions) is **under ₹12L**, **no tax is payable** — and **capital-gains *losses* you set off have zero value in that year** (you would have paid zero anyway).
- **Harvesting losses in a year where your income is under ₹12L is wasted** for that year's tax — the losses carry forward, but you had nothing to shield.
- Conversely, **a large LTCG event in a year where your other income is modest can push you *above* ₹12L**, and *then* a prior-year loss carry-forward *does* save real tax.

**Practical implication:** track your *total* income each year. If you are *below* the §87A threshold, **do not rush to harvest** (the loss is wasted that year, though it *does* carry forward). If a *large* LTCG is coming (e.g., an ESOP exit, a property sale), **harvest a matching loss *in the same or a prior year*** so the carry-forward *absorbs* the gain and *keeps* you *below* the threshold.

## F&O losses: the "speculation" constraint

F&O trading in India is generally treated as **speculation** (or **business** if you trade *frequently* and *systematically*). The loss-treatment depends on the *characterization*:

| Characterization | Loss treatment | Carry-forward |
|---|---|---|
| **Capital gain/loss** (infrequent, investment-intent) | STCL → flexible; LTCL → rigid (LTCG only) | 8 AYs (§70(3)) |
| **Speculation business** (frequent, not a business) | Set off against *speculation gains only*; unabsorbed does *not* carry forward the same way | *No 8-yr carry-forward under §70(3)* |
| **Non-speculation business** (frequent, *registered* business, *proper books*) | Set off against *other business income*; unabsorbed carries forward 8 AYs under §72 | 8 AYs (§72) |

**The SEBI FY26 data (87.7% of retail F&O traders lost, avg loss ₹1,16,654) [src-sebi-fo-fy26] is *not* a tax-loss asset** for most retail traders, because the losses are *speculation* losses that *cannot* be set off against *salary* or *equity LTCG*. They only reduce *other F&O gains* in the same year. If you have a *large* F&O loss and *no* F&O gains that year, **the loss is largely stranded** — it does not carry forward the same way a §70(3) capital loss does.

**This is a major, often-missed tax cost of F&O trading** on top of the direct loss. [src-loss-carry-forward-2026]

## Debt funds and the "12-month" rule

A **debt fund** (or a *taxable bond* held in a demat) is *not* equity. The *STCG/LTCG* split is:

- **Held < 36 months → STCG** (taxed at slab).
- **Held ≥ 36 months → LTCG** (indexed; 20% or 11.25% after indexation, whichever is lower — the *§50AA/50AB* rules).

**The harvesting implication:** if you hold a *debt fund position at a loss* and sell it *before* 36 months, the loss is a **STCL** (flexible, §70(3) carry-forward). If you wait *past* 36 months, the loss (if it persists) becomes an **LTCL** (rigid, LTCG-only). **For a ₹10L investor, a STCL from a debt-fund redemption is the most useful *flexible* loss asset you can create.**

## A practical harvesting workflow for a ₹10L portfolio

This is a *decision framework*, not a recommendation. Execute in order:

### 1. Year-end review (January–February, *before* ITR due date)

- **List all open positions** in demat, MF, PPF, NPS, F&O, REITs, InvITs, SGBs, gold ETFs.
- **Flag every position at a *loss*** (mark-to-market, not just "sold at a loss").
- **Separate equity positions from debt-fund positions** (the STCL vs LTCL flexibility differs).

### 2. Compute your "loss asset" inventory

| Position | P&L | Type | STCL/LTCL? | Set-off use in *this* year | Carry-forward value |
|---|---|---|---|---|---|
| Nifty fund, bought 2022, −12% | −₹60k | Equity | STCL (held under 12 months *if* recent; LTCG if held over 12 months) | Can offset any STCG/LTCG this year | If not used, 8-yr carry-forward (§70(3)) |
| Debt fund, bought 2023, −4% | −₹8k | Debt | STCL (held under 36 months) | Flexible set-off | 8-yr carry-forward |
| 1 F&O trader, net loss −₹50k | −₹50k | F&O | Speculation loss | Set off against *F&O gains only* | **No §70(3) carry-forward** (spec) |

### 3. Decide: sell at a loss?

Sell a losing position *only if*:

- [ ] The *fundamental reason* you bought it is *gone* (or the position is *poorly* performing *relative to its replacement*).
- [ ] You have a **matching gain** in the *same year* that the loss will offset (otherwise you are *paying* the spread + *losing* the carry-forward value for a year where you paid zero tax anyway — the §87A trap).
- [ ] You **do not need to replace the position in the same day** (a *wash-sale* rule does *not* apply in India as it does in the US, but a *same-instrument re-purchase* on the *same day* can raise *transfer-pricing / sham-transaction* questions with the tax department; **spread purchases by ≥ 30 days** to be safe).
- [ ] You will **file the ITR by the §139(1) due date** to *claim* the carry-forward.

### 4. Execute the sale, book the loss in your records

- The *broker/AMC* reports the P&L to the *income-tax department* via **Form 24C / 12BB** (equity) or **MF statements** (debt). **Do not rely on the broker's report alone — keep your own cost-base records** (including *bonus issues, splits, buybacks, and ESOP exercise-day FMV*).
- The loss is *final* at the time of sale (you *cannot* "undo" it).

### 5. File the ITR by the due date (§139(1))

- **ITR-2** is required for any *capital-gains* income (ITR-1 cannot report *LTCG/STCG* from *listed equity* — it *can* report *debt-fund* CG but not *equity* CG).
- **Claim the loss in the "Schedule CG"** section of the ITR (even if the loss *exceeds* the gains — the excess *carries forward* if the return is filed *on time*).
- **If you missed the §139(1) deadline**, file a *belated* return within the *same AY* (before 31 Dec) — the *current-year* loss is *claimed* in that belated return, but **the carry-forward from a *prior* year is *lost* if that prior-year ITR was not filed on time**.

### 6. Track carry-forward losses (a simple ledger)

Maintain a **rolling ledger**:

```
AY 2025-26 (FY 2024-25): Unabsorbed STCL = ₹42,000  [carries to AY 2027-28]
AY 2025-26 (FY 2024-25): Unabsorbed LTCL = ₹18,000  [carries to AY 2027-28]
AY 2026-27 (FY 2025-26): Unabsorbed STCL = ₹15,000  [carries to AY 2028-29]
```

Each entry *expires* 8 years later. **If you have *no* gains in a given year, the loss *just sits* in the carry-forward — it does not *reduce* your other income (salary, interest) unless it is a *business* loss.**

## When NOT to harvest

| Situation | Why not to sell at a loss |
|---|---|
| **Your total income is *under* the ₹12L §87A threshold** | The loss has *zero* tax value this year; the carry-forward is *locked* to a future gain type (LTCL → LTCG only). Better to *hold* (no cost) and let the position recover. |
| **You *need* the money in the *same day*** | The sale is a *forced* liquidity event, not a *tax* decision. Harvest when you *choose* to, not when you *have* to. |
| **You are in F&O speculation and have *no* F&O gains that year** | The loss is a *speculation* loss with *no §70(3) carry-forward* — selling more *just increases* the stranded loss. |
| **The position is a *winner*** | **Never** sell a *winner* to "harvest a loss." The loss from a *loser* offsets the *gain* from the *winner* — you want to *realize* the *winner*, not the *loser*. |

## The "one-loss-per-year" rule of thumb for a ₹10L portfolio

A practical *minimum* harvesting routine:

1. **Once a year (Jan–Feb),** review *all* positions. Flag *losses > 10%*.
2. **If you have a *planned* LTCG event** (ESOP exit, property sale, large MF redemption) *in the same year*, **harvest a *matching* STCL/LTCL *before* the gain event** so the *set-off* happens in-year.
3. **If you have *no* planned gain event**, *do not* manufacture a loss. The carry-forward is *useless* if you have no gains to offset. **Hold the losing position.**
4. **File ITR-2 on time.** This is the *single most important* step — an *on-time* ITR is what *enables* the 8-year carry-forward. A *late* ITR *destroys* it.
5. **Keep a *loss ledger* (AY by AY)** so you *never* lose track of a carry-forward that *expires*.

**The one number to remember: a §70(3) capital-loss carry-forward *expires* 8 years after the AY in which the loss was *incurred.* A *late* ITR in that AY *forfeits* the carry-forward. The *cost* of a late ITR is not a penalty — it is the *permanent loss* of a *tax asset* that could have offset a future gain of ₹1–5L+ over the 8-year window.**

## Update log

| id | claim | lastVerified | reviewAfter | status |
|---|---|---|---|---|
| tl-sec70-3-carryforward | §70(3): unabsorbed STCL/LTCL carries forward 8 AYs; STCL is flexible (STCG+LTCG), LTCL is rigid (LTCG only); §139(1) on-time filing is mandatory to claim carry-forward | 2026-10-16 | 2027-04-01 | ok |
| tl-87a-rebate-trap | §87A: total taxable income ≤ ₹12L → zero tax (FY 2026-27 new regime, unchanged from Budget 2025 reset); harvesting a loss in a *below-threshold* year has zero in-year value | 2026-10-16 | 2027-04-01 | ok |
| tl-fo-spec-loss | F&O retail losses (speculation character) *cannot* be set off against salary or equity gains; unabsorbed spec loss has *no* §70(3) carry-forward; SEBI FY26: 87.7% of retail F&O traders lost, avg ₹1,16,654 | 2026-10-16 | 2027-04-01 | ok |

## Sources & citations

- [src-loss-carry-forward-2026] — NumberIQ / CalcWise / Patron Accounting: §70(3) set-off and carry-forward rules, AY 2026-27
- [src-it-slab-fy2026-27] — Income-tax slabs FY 2026-27 (new regime, §87A threshold ₹12L, LCG 12.5%, STCG 20%)
- [src-sebi-fo-fy26] — SEBI F&O FY26 data (Rajya Sabha written reply 11 Aug 2026): 87.7% loss rate, avg loss ₹1,16,654

## Related

- [Tax for the Indian Investor](/articles/tax-india-investor-complete)
- [ESOPs & RSUs](/articles/tax-esop-stock-grants)
- [F&O for Retail Investors](/articles/derivatives-fno-retail-realities)
- [Equity: Fundamental & Valuation](/articles/equity-fundamental-valuation)


## Sources & Citations

- **NumberIQ / CalcWise / Patron Accounting (AY 2026-27 set-off & carry-forward guides)** — Set-off and carry-forward of losses, AY 2026-27: Sec 70 intra-head first, Sec 71 inter-head (₹2L house-property cap; capital losses cannot offset salary/interest), unabsorbed capital losses carry 8 AYs under Sec 70(3) only if the return is filed by the Sec 139(1) due date; speculation losses have no 70(3) carry-forward. https://numberiq.in/insights/set-off-carry-forward-losses-income-tax (verified 2026-10-16)
- **Income Tax Department / Union Budget 2025 (Finance Act 2025) — FY 2026-27 slabs** — Income-tax slabs, new regime, FY 2026-27 (AY 2027-28) — unchanged from the Budget 2025 reset: 0-4L nil, 5% to 8L, 10% to 12L, 15% to 16L, 20% to 20L, 25% to 24L, 30%+; Sec 87A rebate extends tax-free up to Rs 12L; standard deduction Rs 75,000. https://cleartax.in/s/income-tax-slabs (verified 2026-10-16)
- **Ministry of Finance / SEBI (Rajya Sabha written reply)** — Ministry of Finance written reply, Rajya Sabha Unstarred Q 2633 (retail investor protection in F&O trading), 11 Aug 2026. https://sansad.in/getFile/annex/271/AU2633_w2b25X.pdf (verified 2026-10-16)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
