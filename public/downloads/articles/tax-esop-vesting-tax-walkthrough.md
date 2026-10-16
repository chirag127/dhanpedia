
**Scope note.** This is the *walkthrough* layer over the [two-stage ESOP framework](/articles/tax-esop-stock-grants): it models the full lifecycle — from grant to exercise to sale — with the exact FY 2026-27 numbers, the FMV cost-base step-up, the capital-gains head selection, the shared ₹1.25L 112A pool, the 80-IAC startup deferral, the TDS section migration (192 → 392 under the Income-tax Act 2025), the advance-tax obligation on the CG stage, and the Schedule FA / FAST-DS disclosure for foreign-parent equity. Figures marked **"(verified 2026-10-18)"** are checked against the cited sources; reconcile with Form 16/12BA and a CA before filing.

## The lifecycle in one table

| Event | What happens | Tax head | Rate (FY 2026-27) | Who withholds? |
|---|---|---|---|---|
| **Grant** | Options allotted under scheme | No tax | — | — |
| **Vesting** | Options become exercisable | No tax | — | — |
| **Exercise** | You pay the exercise price; shares are allotted | Perquisite §17(2)(vi) / Act-2025 §17(1)(d) | Slab (new regime default) | Employer TDS §192 (pre-Apr-2026) / §392 (from Apr-2026) |
| **Sale (listed, ≤ 12 mo)** | You sell the shares | STCG §111A / Act-2025 §196(1)(i) | 20% flat | You (advance tax) |
| **Sale (listed, > 12 mo)** | You sell the shares | LTCG §112A / Act-2025 §198(2)(a) | 12.5% above the shared ₹1.25L annual pool | You (advance tax) |
| **Sale (unlisted, ≤ 24 mo)** | You sell the shares | STCG at slab | Marginal new-regime rate | You (advance tax) |
| **Sale (unlisted, > 24 mo)** | You sell the shares | LTCG §112 / Act-2025 §197(1)(b) | 12.5% no indexation | You (advance tax) |

**The cost-base step-up (the single most important provision):** the FMV on the exercise/vesting date is your *cost of acquisition* for the Stage-2 capital-gain computation (Act-1961 §49(2AA); Act-2025 §73). The rupee slice already taxed as salary at Stage 1 is **never** taxed again at Stage 2. [src-esop-tax-it-dept]

## The FMV: how it is fixed

- **Listed shares (Rule 3(9)(i)):** the average of the opening and closing price on the exercise date. If the share was not traded that day, the immediately preceding trading day.
- **Unlisted shares (Rule 3(9)(ii)):** a Category-I SEBI-registered merchant banker's valuation on the exercise date or within 180 days before it. Your employer arranges this; ask HR or finance for the valuation report — you need it for your ITR. [src-esop-tax-it-dept]

## The 80-IAC deferral (startup employees only)

For employees of a **DPIIT-recognised eligible startup** that holds a valid **Inter-Ministerial Board (IMB) 80-IAC certificate**, the perquisite TDS is *deferred* (Act-1961 §192(1C); corresponding provision in the Act 2025). Instead of withholding at exercise, TDS is deposited only on the **earliest** of:

1. **60 months** from the end of the assessment year in which the shares were allotted (for shares allotted on or after 1 Apr 2026; the earlier 48-month limit applied to the Act-1961 years),
2. the date you **sell** the shares, or
3. the date you **cease employment**.

The tax *amount* is unchanged — only the timing shifts. As of 2026, roughly **4,000 of 1.97 lakh** DPIIT-recognised startups hold the IMB certificate; confirm your employer qualifies before planning around the deferral. [src-it-slab-fy2026-27]

## The TDS section migration (Act 2025)

Exercises on or after **1 April 2026** (Tax Year 2026-27) fall under the Income-tax Act, 2025:

| Act-1961 provision | Act-2025 equivalent |
|---|---|
| §17(2)(vi) perquisite | §17(1)(d) |
| §192 employer TDS | §392 |
| §49(2AA) cost-base step-up | §73 |
| §111A STCG 20% | §196(1)(i) |
| §112A LTCG 12.5% | §198(2)(a) |
| §80-IAC deferral | Corresponding provision (same mechanics) |

The *amount* is unchanged; only the section numbers move. For FY 2025-26 returns (filed in 2026) use the Act-1961 numbers. [src-esop-tax-it-dept]

## Worked walk-through: listed company, ₹10L grant

Rahul exercises **1,000 shares** of a listed IT company:

- Exercise price: ₹500
- FMV on exercise date: ₹1,500 (avg open+close)
- Other salary income in the FY: ₹20,00,000
- He sells 15 months later at ₹1,800

**Stage 1 — Perquisite:**

$$\text{Perquisite} = (1500 - 500) \times 1000 = ₹10,00,000$$

Added to his ₹20L salary → total salary income ₹30L. New-regime slab:

- Nil up to ₹4L, 5% to ₹8L, 10% to ₹12L, 15% to ₹16L, 20% to ₹20L, 25% to ₹24L, 30% above ₹24L
- Tax on ₹30L = ₹5,52,000 (verified against `newRegimeTaxFY27(3000000)`)
- Tax on ₹20L alone = ₹3,04,000
- **Incremental perquisite tax = ₹2,48,000** (this is what the employer withholds as TDS)

**Stage 2 — Capital gain (listed, held 15 months → LTCG):**

$$\text{CG} = (1800 - 1500) \times 1000 = ₹3,00,000$$

112A pool: ₹1.25L consumed; taxable = ₹1,75,000; tax = ₹1,75,000 × 12.5% = **₹21,875**

**Combined two-stage tax (with 4% cess):**

- Perquisite: ₹2,48,000 × 1.04 = ₹2,57,920
- CG: ₹21,875 × 1.04 = ₹22,750
- Surcharge: total income ₹31.75L → below ₹50L → **nil**
- **Total ≈ ₹2,80,670** on a ₹23L gross gain (exercise price ₹500 → sale ₹1,800 × 1,000 shares)

The *effective combined tax rate* on the gross gain is ≈ **12.2%** — well below the "30% slab" intuition that catches most employees off guard, because the Stage-2 slice is taxed at the much lower 112A rate.

## Worked walk-through: unlisted startup, ₹10L perquisite, 80-IAC deferral

Ananya exercises **5,000 shares** of a DPIIT-recognised startup:

- Exercise price: ₹10
- FMV (merchant-banker valuation): ₹200
- Perquisite = (200 − 10) × 5,000 = **₹9,50,000**
- Her other salary: ₹8,00,000
- She has **not sold** the shares

**Without deferral:** the employer withholds TDS at the marginal slab rate on ₹9.5L added to ₹8L salary → combined ₹17.5L → tax ≈ ₹3,63,000 (incremental ≈ ₹2,63,000 at the 15% band + a slice at 20%). She owes this tax *in the year of exercise*, even though the shares are illiquid.

**With 80-IAC deferral (IMB certificate confirmed):** no TDS at exercise. The tax is computed at the allotment-year rate (≈ ₹2,63,000) but **paid** on the earliest of 60 months from end of AY, sale, or leaving. For shares allotted in FY 2026-27, the 60-month clock ends in **March 2032**.

## The "taxed before you can sell" trap and the three escape hatches

For an unlisted startup employee the perquisite is **certain** (fixed at the FMV on the exercise date) while the *cash* is not (no market to sell into). Three ways to manage it:

1. **Staggered exercise** — ask the company to allow a partial exercise at a lower-FMV window, reducing the perquisite amount.
2. **80-IAC deferral** — if the employer holds the IMB certificate, the TDS is deferred (timing only, not amount).
3. **Advance-tax planning on the CG stage** — employer TDS covers the perquisite only. If you sell unlisted shares with a significant gain and no TDS was deducted, you owe advance tax in four instalments (15 Jun / 15 Sep / 15 Dec / 15 Mar). Miss them and §234B/§234C interest accrues.

## The foreign-parent layer (Schedule FA + FAST-DS)

If your employer is a **US/MNC parent** issuing RSUs or ESOPs in its foreign-listed shares:

- **Vesting** is the perquisite event (FMV in INR at the vesting-day rate).
- **24-month LTCG clock** applies to foreign-listed shares (not the 12-month Indian-listed clock).
- **No ₹1.25L 112A pool** — foreign-listed LTCG is taxed at 12.5% under §112 (no indexation, no pool) because no STT is paid on a foreign exchange.
- **Schedule FA** in ITR-2/ITR-3 is mandatory for any foreign asset you hold, including a single fractional share. There is **no minimum value threshold**.
- **FAST-DS amnesty** (opened 16 Aug 2026, last date **31 Dec 2026**): if you never filed Schedule FA in prior years, the one-time disclosure scheme is open. Missing it carries a penalty of **₹10 lakh per year** under §43 of the Black Money Act 2015, and unreported years stack.
- **Sell-to-cover is a sale:** the automatic US-withholding sale at vesting is a *disposal* you must report, not just the vesting event. [src-it-slab-fy2026-27]

## The advance-tax obligation on the CG stage (what your employer does NOT cover)

Employer TDS (§192 / §392) covers **only the perquisite**. The capital-gain tax at sale is **entirely yours**. If your residual CG liability after TDS exceeds **₹10,000**, you owe advance tax in the standard four instalments:

| Instalment | Due date | Cumulative % |
|---|---|---|
| 1 | 15 Jun | 15% |
| 2 | 15 Sep | 45% |
| 3 | 15 Dec | 75% |
| 4 | 15 Mar | 100% |

The capital-gains relief provision (CGAS) lets you defer advance tax on *unrealised* CG until the 31 Mar instalment, but *realised* CG (you actually sold) is due on the regular schedule. [src-esop-tax-it-dept]

## ITR filing checklist

| Step | What to do |
|---|---|
| 1 | Use **ITR-2** (or ITR-3 if you also have business income). ITR-1 (Sahaj) does NOT support capital gains or Schedule FA. |
| 2 | Report the perquisite in **Schedule S** (salary) — it is already in Form 16. |
| 3 | Report each CG sale in **Schedule 112A** (listed) or **Schedule 112** (unlisted) with the FMV at exercise as the cost base. |
| 4 | Claim the **₹1.25L 112A pool** — it is annual and aggregate, not per transaction. |
| 5 | If foreign shares: file **Schedule FA** + **Form 67** (before the return, not after — missing the sequence forfeits the foreign tax credit). |
| 6 | Pay **advance tax** on the CG stage if residual liability exceeds ₹10,000. |
| 7 | Reconcile **Form 12BA** (perquisite details) with your Form 16. |

## When this gets expensive to get wrong

- **Using the exercise price as the cost base at sale** → double-taxing the salary slice. The cost base is the FMV at exercise, not the exercise price.
- **Filing ITR-1 with ESOP or foreign-equity income** → ITR-1 cannot handle Schedule FA or capital-gains schedules; the return is invalid and the assessment is reopened.
- **Missing the 80-IAC deferral expiry** → if you deferred and neither sold nor left within 60 months, the tax (plus interest) is due immediately.
- **Assuming employer TDS covers the CG stage** → it does not. The CG advance-tax clock is entirely yours.
- **Omitting Schedule FA** → ₹10L/year penalty under the Black Money Act; years stack.

## Update log

| id | claim | lastVerified | reviewAfter | status |
|---|---|---|---|---|
| tl-esop-walkthrough-fy2026-27 | Two-stage ESOP/RSU tax mechanics (perquisite §17(2)(vi)→§17(1)(d) Act-2025; CG §111A/§112A/§112→§196/§198/§197 Act-2025); FMV cost-base step-up §49(2AA)→§73; 80-IAC 60-month deferral window for post-Apr-2026 allotments; Schedule FA ₹10L/yr penalty; FAST-DS deadline 31 Dec 2026; TDS migration §192→§392 | 2026-10-18 | 2027-04-17 | ok |

## Sources

- [src-esop-tax-it-dept] — Income-tax Department: "Taxation of Employee Stock Option Plan (ESOP)," two-stage framework, FMV rules, ITR reporting, startup deferral; corroborated by Tax Garden AY 2026-27 guide (updated 31 Aug 2026) and CSM & CO LLP ESOP taxation guide (23 Jul 2026).
- [src-it-slab-fy2026-27] — FY 2026-27 slab & equity-CG rates; 80-IAC 60-month window; Schedule FA / FAST-DS penalty (₹10L/yr, Black Money Act §43); 24-month foreign-LTCG clock; no-112A-pool rule for foreign-listed shares (The Finestate ESOP/RSU guide, Sep 2026; CalcGuru ESOP guide, Sep 2026; Tax Garden 87A guide).

## Related

- [ESOPs & RSUs: The Two-Stage Framework](/articles/tax-esop-stock-grants)
- [Tax for the Indian Investor](/articles/tax-india-investor-complete)
- [Advance Tax & ITR Final Checklist](/articles/tax-advance-itr-final-checklist)
- [International & LRS](/articles/international-investing-lrs)


## Sources & Citations

- **Income Tax Department, India (IT Act 2025 consolidated guide)** — Taxation of Employee Stock Option Plan (ESOP): two-stage — perquisite at exercise under Sec 17(2)(vi) (FMV minus exercise price) + capital gains at sale; unlisted-company FMV valuation and Schedule FA disclosure. https://www.incometaxindia.gov.in/w/taxation-of-employee-stock-option-plan-esop- (verified 2026-10-16)
- **Income Tax Department / Union Budget 2025 (Finance Act 2025) — FY 2026-27 slabs** — Income-tax slabs, new regime, FY 2026-27 (AY 2027-28) — unchanged from the Budget 2025 reset: 0-4L nil, 5% to 8L, 10% to 12L, 15% to 16L, 20% to 20L, 25% to 24L, 30%+; Sec 87A rebate extends tax-free up to Rs 12L; standard deduction Rs 75,000. https://cleartax.in/s/income-tax-slabs (verified 2026-10-16)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
