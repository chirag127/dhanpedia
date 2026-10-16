
The [retirement & FIRE / annuities article](./retirement-fire-annuities.mdx) built your corpus math
and the decumulation blueprint. This article is the **NPS exit layer** — the moment where a 15-30 year
investment decision meets three rules most investors have never read together: the PFRDA 16 December
2025 exit amendment, the Section 10(10A) exemption cap, and the annuity market. Get all three wrong and
you either pay tax on money the law *intends* to be exempt, or you buy an annuity that undershoots your
survivor income.

## What the PFRDA 16-Dec-2025 amendment changed

For **non-government** subscribers (the All-Citizen / Corporate model), the Exits & Withdrawals
amendment that took effect **16 December 2025** reset the default exit split:

| Leg | Before Dec-2025 | From Dec-2025 |
|---|---|---|
| Lump sum you *may* take at 60 | Up to **60%** of corpus | Up to **80%** of corpus |
| Annuity you *must* buy | At least **40%** | At least **20%** |
| Deferral of the annuity purchase | Up to age 75 | Up to **age 85** |
| Small-corpus full-withdrawal threshold | Rs 5L | **Rs 8L** — a corpus up to Rs 8L is a 100% lump-sum exit, no annuity |
| Premature exit (permitted, before 60) | 20% lump / 80% annuity | 20% lump / 80% annuity (unchanged) |

The **85-year deferral** is the sleeper feature: you can keep the annuity corpus compounding inside the
scheme and start the pension later, which is a real response to the fact that Indian life expectancy is
still climbing. The **Rs 8L small-corpus rule** is the one that matters for a short-tenure subscriber
(e.g. NPS Vatsalya, or a 5-year stint) — under Rs 8L you simply walk away with everything.

## The exemption cap that surprises people: 10(10A) says 60%, not 80%

Here is the rule that quietly costs the most. The PFRDA amendment lets you *take* up to 80% of your
corpus as a lump sum at 60 — but the **Income-tax Act exemption on that lump sum is capped at 60% of
your total contributions** (self + employer), under Section 10(10A) / 10(i)(xii).

$$
\text{Exempt lump sum} \;=\; \min\big(\text{lump sum taken},\; 0.60 \times \text{total contributions}\big)
$$

The two percentages describe different things:

| Number | What it controls |
|---|---|
| **80% (PFRDA)** | The *maximum share of the corpus* you are allowed to take out as cash |
| **60% (Income-tax)** | The *maximum share of your contributions* the tax system will not touch |

Consequence: if your NPS corpus has **appreciated well past 1.33 times your contributions** (which is
the exact point where the 80% of corpus equals 60% of contributions), the extra 20% of corpus you are *allowed*
to take is **taxable at your slab rate**. That is the gap the [NPS retirement-exit
calculator](/calculators/nps-retirement-exit) prices for you — a 30-year, 20k/month NPS at 9% build-up
has a corpus far above 1.33x contributions, so the "taxable lump-sum portion" is a real, non-trivial
line item.

One honesty note: the 60%-cap wording in Section 10(10A) sits in the 1961 Act and the Act-2025
renumbering has to be checked for your *exit year* — a CA should confirm the exact current-year
provision before you act, because this is where the Act-2025 transition (effective 1 April 2026) has
produced genuine confusion.

## The annuity leg: which of the five PFRDA variants you actually want

The minimum 20% (now that it is 20%, not 40%) still has to buy a **PFRDA-empanelled annuity** from one
of the licensed ASPs. The five standard variants and who each suits:

| Annuity type | Rate band (age 60) | Best for |
|---|---|---|
| **Annuity for Life** | Highest (~6-7%) | Single / no dependents, maximum monthly income |
| **Joint Life** (spouse continues) | ~5-6% | Married, want the survivor covered |
| **Joint Life with Return of Purchase Price** | ~4-5% | Married + want the balance returned to the nominee |
| **Annuity Certain (5/10/15/20 yrs)** | Lower | Short guaranteed period, then nominee income |
| **Life with Annual Increase (1-3%)** | Lower start, grows | Inflation worry, willing to take a low first payment |

The rate band matters more than the marketing suggests: on a Rs 80L annuity corpus, the difference
between a 7% and a 5% life annuity is **Rs 1.6L a year** of income — a ₹1.6L/yr gap that compounds for
decades. Shop the empanelled ASP quotes; the PFRDA empanelment list (15 providers as of 2026) is the
universe you compare across.

## The new-regime interaction: 80CCD(2) is still your friend

From the [80C-baskets article](./tax-80c-baskets-regime-decision.mdx): **80CCD(2) — your employer's NPS
contribution, up to 14% of Basic+DA in the new regime — is one of the only deductions that survives the
new regime.** The NPS-specific points that decide the NPS tax position:

- **80CCD(1B) Rs 50,000 is old-regime-only** (verified in Wave 8; a conflicting new-regime claim was
  resolved to old-only). In the new regime your *self* NPS deduction does not exist beyond the standard
  deduction.
- **80CCD(1)** (your own Tier-1, within the 80C basket) is old-regime-only.
- **80CCD(2)** is both-regimes.
- The **corpus exemption cap (10(10A)) and the annuity-income slabs** are the exit-year tax, separate
  from the entry-year deductions.

So a new-regime NPS subscriber's tax story splits into two: **entry** is the employer 80CCD(2) deduction (worth
enormously at 30% marginal), **exit** is the 60% exemption cap on the lump sum + slab tax on the
annuity income. The entry deduction and the exit cap are two different levers and they do *not* net
against each other.

## Related

- [Retirement & FIRE: Corpus, 4% Rule, Decumulation, Annuities](./retirement-fire-annuities.mdx)
- [The 80C Basket Decision & Regime (incl. the 80CCD(2) new-regime lever)](./tax-80c-baskets-regime-decision.mdx)
- [Government Savings Schemes: PPF, SSY, NSC, KVP](../government-schemes/govt-small-savings-schemes.mdx)
- [Your 10 Lakh Wealth Plan](../personal-finance/pf-wealth-plan-10-lakh.mdx)

## Sources

- PFRDA Exits & Withdrawals (Amendment) Regulations, 2025, w.e.f. 16 Dec 2025 — 80/20 split, 85 deferral, Rs 8L small corpus — <a href="https://pfrda.org.in/">PFRDA (nps-2025-exit source)</a>
- NPS 80CCD(1)/(1B)/(2) deduction structure, old vs new regime — <a href="https://1finance.co.in/blog/nps-tax-benefits-80ccd">1 Finance / ClearTax NPS coverage</a>
- PFRDA-empanelled annuity-rate bands (life 6-7%, joint-life lower) and the 15-ASP empanelment list — <a href="https://pfrda.org.in/intermediaries/empaneled-entities/annuity-service-provider">PFRDA ASP list / NPS annuity calculators</a>

## Update log

- 2026-10-18 — Wave 13: PFRDA 16-Dec-2025 exit table (80/20, 85 deferral, Rs 8L 100% rule), the
  Section 10(10A) 60%-of-contributions exemption cap vs the PFRDA 80% exit (the "two 60/80 numbers"
  that get confused), the five annuity-variant comparison with a 6%-vs-5% income-gap worked figure,
  and the new-regime 80CCD(2) entry-vs-exit tax separation. The 60% 10(10A) cap and the Act-2025
  renumbering must be confirmed with a CA for the exit year; the PFRDA 80/20 split and Rs 8L
  small-corpus threshold are per the 16-Dec-2025 amendment. Re-verify the annuity-rate bands at each
  PFRDA empanelment update.


## Sources & Citations

- **PFRDA (Exits and Withdrawals under NPS) (Amendment) Regulations, 2025** — PFRDA (Exits and Withdrawals under the NPS) (Amendment) Regulations, 2025, w.e.f. 16 Dec 2025. https://www.pfrda.org.in/documents/33652/184762/Gazette+PFRDA+Exit+and+Withdrawals+under+the+NPS+Amendment+Regulations+2025.pdf (verified 2026-10-16)
- **1 Finance / ClearTax / PFRDA (NPS tax-benefits coverage, 2025-26)** — NPS deduction structure 2026: 80CCD(1) within 80C Rs 1.5L (old regime); 80CCD(1B) extra Rs 50,000 old-regime-only, incl. NPS Vatsalya for a minor child from FY 2025-26; 80CCD(2) employer up to 14% of salary in BOTH regimes (raised from 10% for private sector, FY 2025-26), combined employer EPF+NPS+superannuation exempt cap Rs 7.5L/yr. https://1finance.co.in/blog/nps-tax-benefits-80ccd (verified 2026-10-17)
- **PFRDA Exits & Withdrawals (Amendment) Regulations, 16 Dec 2025 / NPS annuity-calculator rate bands / Income-tax Act 10(10A) cap** — NPS retirement exit & annuity, FY 2026-27: PFRDA 16-Dec-2025 amendment - non-govt 80% lump / min 20% annuity (was 60/40), deferral to age 85, Rs 8L small-corpus 100% withdrawal; premature exit 20/80; annuity priced at PFRDA-empanelled ASP life-annuity rates ~6-7% at age 60 (joint-life / return-of-purchase lower); Sec 10(10A)/10(i)(xii) exempts the NPS lump sum up to 60% of total contributions - the extra 20% taken under the 80% exit is slab-taxed; annuity income slab-taxed. https://npscalculators.in/nps-annuity-calculator (verified 2026-10-18)

---
Educational content, not individualized investment, tax, accounting, or legal advice.
Author: Chirag Singhal. DhanPedia.
