
The [FAST-DS 2026 article](./tax-fastds-2026-declaration.mdx) and the [Black Money Act exposure article](./tax-black-money-act-exposure.mdx) close the **tax** side of an undisclosed foreign asset: a 60% defined cost (or a flat fee) in exchange for immunity from further tax, penalty and Black Money Act prosecution. But both of those articles also flag a limit they *cannot* fix: **the exchange-control side.** A position that is clean on the income-tax / Black Money Act ledger can still be open on a *second, independent* ledger, administered by a *different regulator* (the RBI, not the income-tax department), under the **Foreign Exchange Management Act, 1999 (FEMA)**. This page prices that second ledger. Everything below is a planning model; FEMA penalties are adjudicated by the RBI / the Enforcement Directorate on the facts of a specific contravention, not by a calculator.

## The two regulators, two ledgers (the structural point first)

The single most important thing to internalise: **tax regularisation and exchange-control regularisation are separate exercises, and one does not settle the other.** A FAST-DS declaration, or a Schedule FA disclosure, tells the income-tax department what you owe on the *tax* side. It says *nothing* to the RBI about whether the money that got there was *remitted lawfully* under FEMA. The two run on different clocks, in front of different authorities, and on different documents:

| | **Tax / Black Money Act ledger** | **FEMA / exchange-control ledger** |
|---|---|---|
| Regulator | Income-tax department (the Principal / DGIT (Systems) for FAST-DS) | **The RBI** (compounding, PRAVAAH) and, above the threshold, the **Enforcement Directorate** |
| Law | Income-tax Act + Black Money Act 2015 | **FEMA, 1999** |
| What it prices | The *tax + penalty* on undisclosed foreign income / asset | Whether the *money movement itself* (the LRS / ODI / NRO remittance) was lawful |
| The "cost" | 60% / flat-fee (FAST-DS) or 120% (the BMA counterfactual) | The **Section 13(1) penalty, up to 3x the sum involved** (or a Section 15 compounded fee) |
| Settled by | A FAST-DS declaration + payment | A **Section 15 compounding** filing, or the full Section 13 penalty if it is not compoundable |

The consequence that the fast-ds-valuation-guard article's immunity limit points to: **you can walk away from a FAST-DS declaration with the tax side closed and the FEMA side still wide open.** That open FEMA exposure is what this page and the **fema-penalty calculator** compute.

## The 3x penalty and the one that is not

**FEMA Section 13(1)** is the exchange-control counterfactual: for a contravention of FEMA or an instrument issued under it, the adjudicating authority may impose a penalty of **up to three times the sum involved** in the contravention. [src-fema-sec13-compound-2026]

Two numbers people get wrong, and why:

- **The "3x" is the *current* cap, not the old one.** FEMA is the 1999 liberalising successor to the draconian FERA; the "9 times" figure you may have seen is a **FERA-era** number that does *not* apply under FEMA. The operative Section 13(1) multiple is **3x the sum involved** (with a penalty floor where one is prescribed). The calculator's `section13Penalty` is `max(floor, sum × 3)`.
- **"The sum involved" is the *remittance*, not the *asset value*.** For an LRS breach it is the rupee amount that crossed a limit; for an NRO repatriation it is the amount above the window; for an ODI it is the investment that exceeded the individual limit. Pricing it on the *asset value* instead of the *breaching flow* is the most common (and most expensive) mistake - it can over- or under-state the exposure depending on which number is larger.

Three "sums" that actually trigger a Section 13 contravention, each with its own limit:

| Source | The limit | Who it is for |
|---|---|---|
| **LRS** | A resident individual may remit up to **USD 250,000 / FY** for permissible purposes; NRIs are *excluded* from LRS | Resident individuals (incl. minors) |
| **NRO repatriation** | An NRI may remit up to **USD 1,000,000 / FY** from NRO balances, asset-sale proceeds and inheritances, *after* Indian tax and **Forms 15CA / 15CB** | NRIs |
| **ODI (overseas direct investment)** | An individual may make equity ODI **within the LRS limit**; individuals **cannot** provide loans or guarantees to a foreign entity | Resident individuals |

Cross any of those lines - remit above the LRS limit, repatriate above the NRO window, or make an ODI above the individual limit - and you have a Section 13 contravention, priced at up to 3x the breaching sum. That is the "do nothing on the FEMA side" column, and it is *independent* of whatever you have done on the tax side.

## Section 15 compounding (the cheaper door, and its one big exception)

Before you face the full 3x Section 13 penalty, there is a **voluntary settlement** route: **FEMA Section 15** lets you **compound** a compoundable contravention by paying a fee to the **RBI** (for contraventions up to a ₹5 cr sum) or to the **Enforcement Directorate** (above that), filed through the **PRAVAAH** portal. Two conditions and one cap make it a genuinely different number:

- **A 2025 amendment caps the compounding fee at ₹2,00,000 for certain contraventions.** So even a large breaching sum can be compounded for a bounded fee - which is why the calculator caps `compoundedCost` at `₹2,00,000` by default. That is the single most useful fact on this page: **the FEMA cost of a settled contravention can be a *bounded* fee rather than an open-ended 3x.**
- **The one thing that cannot be compounded: a Section 3(a) hawala offence.** Hawala is the *criminal* exception inside an otherwise civil statute; it is *not* compoundable, so the full Section 13 penalty (and the criminal exposure) is the only outcome. The calculator's "Is the contravention compoundable?" input exists to model exactly this branch.
- **Compounding is a *case-specific* fee, not a fixed tariff.** The RBI sets the fee on the facts of the contravention; the ₹2L is a *cap* for a class of contraventions, not a flat price. Confirm the applicable fee with the PRAVAAH process / a FEMA practitioner before relying on the number.

The decision is therefore a two-step one that the **fema-penalty calculator** lays out: (1) is this contravention *compoundable* (not a Section 3(a) hawala offence)? If yes, the cost is the **capped compounded fee**, not the 3x penalty; if no, the 3x Section 13 penalty is the floor you are looking at.

## A worked example: the ₹20L LRS over-limit remittance

Assume a resident made an LRS investment remittance that breached the limit, with a **breaching sum of ₹20,00,000**, and the tax / BMA side was already regularised under FAST-DS. The two ledgers:

| Ledger | Computation | Figure |
|---|---|---|
| **Tax / BMA (FAST-DS)** | already settled | *closed* (this is the point of the FAST-DS layer) |
| **FEMA - full penalty** | Section 13(1): 3x the ₹20L sum | **₹60,00,000** (the worst-case column) |
| **FEMA - compounded** | Section 15 fee, capped at the 2025 ₹2L limit | **₹2,00,000** (if compoundable + filed) |

The spread - **₹60L worst case vs ₹2L compounded** - is the entire argument for going to the PRAVAAH compounding route early, and it is the gap a tax-only plan *never shows* because it has no FEMA column at all. The **fema-penalty calculator** reproduces all three rows on your exact breaching sum, your compounding-fee assumption, and the "is it compoundable / is the tax side settled" flags.

## When the FEMA side is actually open (and when it is not)

- **Open** when the money *moved* in breach of a FEMA limit (LRS over-limit, NRO over-window, ODI over-limit) **and** you have not compounded it under Section 15. This is the case the calculator prices.
- **Open even after a FAST-DS** - a FAST-DS declaration regularises the *tax / BMA* side only; it does *not* file a Section 15 compounding with the RBI. If your FAST-DS asset was funded by an *over-limit* LRS remittance, the FEMA exposure survives the FAST-DS.
- **Not open (on FEMA)** when the money moved *within* the limits - a legal LRS remittance under USD 250k/FY, an NRO repatriation under USD 1M/FY with 15CA/15CB, an ODI within the individual limit. No FEMA contravention means no Section 13 exposure at all; the only open question is the *tax* side, which is the FAST-DS / BMA / Schedule-FA layer, not this one.
- **The hawala exception** is the case where *nothing* is compoundable: a Section 3(a) offence is criminal and goes to the 3x penalty (and prosecution), not to the PRAVAAH fee.

## What to do now (the exchange-control order)

1. **Isolate the money-movement question from the tax question.** For each foreign position, ask *separately*: "was the *remittance* lawful under FEMA?" (this page) and "is the *tax* side settled?" (the FAST-DS / BMA pages). They have different answers.
2. **Identify the breaching sum** (LRS over-limit / NRO over-window / ODI over-limit) - the number Section 13(1) multiplies by 3.
3. **Run the [fema-penalty calculator](/calculators/fema-penalty)** for the 3x worst case, the compounded-fee best case, and the "FEMA open after the tax side is settled?" read.
4. **If compoundable and not hawala, file a Section 15 compounding** through PRAVAAH early - the ₹2L fee cap makes this the cheap door, and the fee is case-specific, so confirm it with the RBI / a FEMA practitioner.
5. **If it is a hawala offence, do not self-serve** - that is the non-compoundable, criminal branch; get a FEMA practitioner.
6. **Reconcile both ledgers with a CA + a FEMA practitioner** - a FAST-DS / Schedule-FA settlement and a Section 15 compounding are two different filings to two different authorities, and neither is a substitute for the other.

## The one-line verdict

**FEMA is the second ledger a FAST-DS or Schedule-FA settlement does not touch:** a cross-border position can be clean on the tax / Black Money Act side and still open on the exchange-control side, where **Section 13(1) prices a breach at up to 3x the breaching sum** (LRS / NRO / ODI "sums," not the asset value) and **Section 15 compounding - capped at the 2025 ₹2L fee for certain contraventions and *not* available for a Section 3(a) hawala offence - is the cheaper door.** The whole point is **two regulators, two ledgers, two filings**; settling the tax one does not close the FEMA one, and the **fema-penalty calculator** runs both columns on your exact numbers.

## Update log

- **2026-10-18 (Wave 29):** created. Verified the FEMA 1999 exchange-control counterfactual against `src-fema-sec13-compound-2026` (the Section 13(1) "up to 3x the sum involved" cap and the FERA-era 9x that does *not* apply; the Section 15 compounding route via PRAVAAH up to a ₹5 cr sum, the 2025 amendment capping certain compounding fees at ₹2,00,000, and the non-compoundable Section 3(a) hawala exception; and the LRS USD 250k/FY resident limit, the NRO USD 1M/FY repatriation window, and the ODI individual equity-only limit), cross-checked against `src-us-stock-tax-india-2026` (the "FAST-DS does NOT settle FEMA" immunity limit) and `src-lrs-tcs-sc-2026` (the LRS / TCS plumbing underneath).
- **Review by 2027-04-17:** re-verify the Section 13(1) 3x cap and the 2025 Section 15 ₹2L fee cap at the next RBI amendment / Master Direction on compounding; the PRAVAAH compounding fees are set per contravention and the cap is a 2025 position that can move.

## Sources

- `src-fema-sec13-compound-2026` — the FEMA 1999 exchange-control source: the Section 13(1) "up to 3x the sum involved" penalty (and the FERA-era 9x that does not apply), the Section 15 compounding route (PRAVAAH, up to a ₹5 cr sum, the 2025 ₹2,00,000 fee cap, and the non-compoundable Section 3(a) hawala exception), and the LRS USD 250k / NRO USD 1M / ODI individual limits that define the breaching "sum."
- `src-us-stock-tax-india-2026` — the "FAST-DS regularises the tax / BMA side but does NOT automatically settle FEMA" immunity limit that this layer prices, and the Black Money Act 2015 context.
- `src-lrs-tcs-sc-2026` — the LRS USD 250,000/FY limit and the ₹10L TCS threshold that sit under the LRS remittance the Section 13 exposure is measured against.

## Related

- [FAST-DS 2026 Declaration (the tax-side layer this is the *separate* counterfactual of)](/articles/tax-fastds-2026-declaration)
- [Black Money Act Exposure (the "do nothing on the tax side" counterfactual)](/articles/tax-black-money-act-exposure)
- [Direct LRS US-Equity Filing Walkthrough (the routine LRS / Schedule FA layer)](/articles/tax-direct-lrs-us-equity-filing-walkthrough)
- [NRI Tax / Residency / TDS / DTAA (the NRO repatriation + 15CA/15CB side)](/articles/international-nri-tax-residency-tds-dtaa)
- [International Investing & LRS (the route + the limits underneath)](/articles/international-investing-lrs)
- The **fema-penalty** calculator — run your exact breaching sum through the 3x worst case, the compounded-fee best case, and the "FEMA still open after the tax side is settled" read.


## Sources & Citations

- **Beacon Filing / VirtualAuditor / APTaxLaw / KS&A 2026 FEMA penalty + compounding coverage + the RBI Master Direction on Compounding of Contraventions under FEMA, 1999 (April 2025 update) + Oquilia Research (NRO USD 1M / LRS USD 250k) + RBI LRS FAQ** — FEMA 1999 exchange-control exposure: the Section 13(1) "up to 3x the sum involved" penalty (vs the FERA-era 9x that does not apply), the Section 15 compounding route via PRAVAAH (up to a Rs 5 cr contravention, the 2025 amendment capping certain compounding fees at Rs 2,00,000, and the non-compoundable Section 3(a) hawala exception), and the LRS USD 250k / NRO USD 1M / ODI individual limits that define the breaching "sum". https://www.beaconfiling.com/blog/fema-penalties-compounding-process (verified 2026-10-18)
- **Vedanta / WINvesta / Vested / Filewise / Upstox 2026 investor guides + KPMG / CBDT / NDTV FAST-DS 2026 coverage + Income-tax Act 2025 renumbered text** — US stocks taxed in India 2026: the 25% individual dividend withholding (W-8BEN) vs the 30% backup (and the 15% corporate-with-voting-stock figure that is NOT the individual rate), the 24-month / 12.5% no-pool foreign-security CG treatment, the Form 67 FTC cap, Schedule FA no-threshold disclosure, and the FAST-DS 2026 small-taxpayer scheme (Finance Act 2026 Ch. IV, ~15 Aug to 31 Dec 2026). https://vested.blog/posts/how-us-stocks-are-taxed-in-india (verified 2026-10-18)
- **Standard Chartered Bank India (official notice reproducing Finance Act 2026 LRS TCS amendment)** — Revised TCS on outward foreign remittances under LRS, w.e.f. 1 April 2026 (Finance Act 2026, Sec 394(1) of IT Act 2025). https://www.sc.bank.in/important-information/others/lrs-amendment-in-tcs/ (verified 2026-10-16)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
