// One-off: register Wave 4 sources in content-registry/sources.json (safe parse-mutate-write)
import fs from 'node:fs';

const p = 'content-registry/sources.json';
const s = JSON.parse(fs.readFileSync(p, 'utf8'));
const have = new Set(s.map((x) => x.id));

const newSources = [
  {
    id: 'src-nps-deductions-2026',
    title: 'NPS deduction structure 2026: 80CCD(1) within 80C Rs 1.5L (old regime); 80CCD(1B) extra Rs 50,000 old-regime-only, incl. NPS Vatsalya for a minor child from FY 2025-26; 80CCD(2) employer up to 14% of salary in BOTH regimes (raised from 10% for private sector, FY 2025-26), combined employer EPF+NPS+superannuation exempt cap Rs 7.5L/yr',
    publisher: '1 Finance / ClearTax / PFRDA (NPS tax-benefits coverage, 2025-26)',
    url: 'https://1finance.co.in/blog/nps-tax-benefits-80ccd',
    claims: [
      '80CCD(1B) = Rs 50,000 extra deduction over the Rs 1.5L 80C cap, old regime only; combined self-contribution deduction Rs 2L',
      'NPS Vatsalya (minor-child NPS) qualifies for the same Rs 50,000 80CCD(1B) limit from FY 2025-26; the parent chooses own NPS or the child account, not both',
      '80CCD(2) employer contribution: up to 14% of Basic+DA in the new regime (FY 2025-26, raised from 10% for private sector; government employees 14% old regime); available in both regimes',
      'Combined tax-free employer contribution to NPS+EPF+superannuation capped at Rs 7.5L/yr; excess is taxable'
    ],
    type: 'financial-publication',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
  {
    id: 'src-elss-ltcg-2026',
    title: 'ELSS taxation 2026: Rs 1.5L 80C deduction (old regime only; no deduction under the default new regime), mandatory 3-year lock-in per allotment (SIP instalments lock-in separately), 80% equity minimum, LTCG 12.5% above Rs 1.25L/yr shared across all equity gains',
    publisher: 'Upstox / Value Research / SEBI Investor / Economic Times (ELSS + FY 2025-26 MF tax rules)',
    url: 'https://upstox.com/learning-center/mutual-funds/how-to-calculate-ltcg-tax-on-elss-mutual-funds/article-943',
    claims: [
      'ELSS 80C deduction capped at Rs 1.5L/yr, old regime only; the investment is valid under the new regime with no tax deduction',
      '3-year lock-in from each allotment; SIP instalments lock-in individually (Jan 2024 instalment unlocks Jan 2027, Feb 2024 unlocks Feb 2027, etc.)',
      'Equity MF LTCG = 12.5% above Rs 1.25L/yr (Finance (No. 2) Act 2024, from Budget 2024); STCG 20% (holding under 12 months) - not normally applicable to ELSS because of the 3-year lock-in',
      'The Rs 1.25L annual exemption is one shared bucket across all equity gains (listed shares, equity funds, ELSS, REIT/InvIT units), not per-fund'
    ],
    type: 'financial-publication',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
  {
    id: 'src-eldeductions-fy2026-27',
    title: 'All tax deductions old vs new regime FY 2026-27 (Budget 2026 + Income Tax Act 2025): 80C Rs 1.5L, 80CCD(1B) Rs 50k, 80D Rs 50k/Rs 1L, 80E Rs 1L, 80TTA Rs 10k, 80TTB reported raised to Rs 1L for seniors (verify - department portal still shows Rs 50k); 80EEA/80EEB sanction windows closed; Income Tax Act 2025 renumbers 80C to Sec 123 etc.; 87A rebate keeps new-regime income up to Rs 12L tax-free',
    publisher: 'BasuNivesh (18 Mar 2026) + Income Tax Department threshold-limits page (cross-check)',
    url: 'https://www.basunivesh.com/all-tax-deductions-old-vs-new-regime-full-list-fy-2026-27',
    claims: [
      'FY 2026-27: 80C Rs 1.5L, 80CCD(1B) Rs 50k (old regime), 80CCD(2) employer 14% both regimes; 80D Rs 50k self+family / Rs 1L with senior-citizen parents',
      'Reported change: 80TTB senior-citizen interest deduction raised from Rs 50,000 to Rs 1,00,000 in Budget 2026, with TDS threshold on senior deposit interest also doubled - SECONDARY REPORT; the Income Tax Department threshold page still lists Rs 50,000; verify before filing AY 2026-27',
      '80EEA (affordable housing, sanction window 1 Apr 2019 - 31 Mar 2022) and 80EEB (EV loan, sanction window 1 Apr 2019 - 31 Mar 2023) are closed to new loans; existing borrowers continue claiming',
      'The Income Tax Act 2025 (in force 1 Apr 2026) renumbers deductions: 80C -> Sec 123, 80CCD -> Sec 124, 80D -> Sec 126; limits unchanged. "Financial Year" becomes "Tax Year"'
    ],
    type: 'financial-publication',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
  {
    id: 'src-huf-tax-2026',
    title: 'HUF taxation FY 2025-26 / AY 2026-27: HUF is a separate taxable person (Sec 2(31) of the 1961 Act), own PAN, files ITR-2 (investment income) or ITR-3 (business income); dues 31 Jul 2026 non-audit / 31 Oct 2026 audit; clubbing under Sec 64(2) (old Act) = Sec 99(3)-(4) of the Income Tax Act 2025; Vineeta Sharma partition position; HUF gets its own slab + 87A layer',
    publisher: 'Income Tax Department HUF guidance + Tradeviser / SetIndiaBiz / TaxClue HUF guides (Oct 2026)',
    url: 'https://www.incometaxindia.gov.in/huf',
    claims: [
      'A HUF is a separate assessable person with its own PAN, own ITR (ITR-2 for investment income, ITR-3 for business income), own 26AS/AIS; AY 2026-27 dues: 31 Jul 2026 (non-audit), 31 Oct 2026 (audit)',
      'HUF income that is genuinely family (coparcenary property income, gifts from non-member relatives) is taxed in the HUF hands at individual slabs; income from property gifted BY a member or by the Karta is CLUBBED back into that member under Sec 64(2) / Sec 99(3)-(4) of the Income Tax Act 2025',
      'Vineeta Sharma (SC 2020): every daughter is a coparcener by birth; a genuine partition of HUF property is not a taxable event in the family',
      'HUF can use 80C Rs 1.5L and 80D as an entity, old regime; it cannot claim HRA or salary-based deductions; a husband-wife-only pair is NOT an HUF'
    ],
    type: 'regulator',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
  {
    id: 'src-reit-invit-tax-2026',
    title: 'REIT/InvIT taxation AY 2026-27: Section 115UA pass-through; distribution components (interest / dividend two-fork under 115BAA / rental / return-of-capital) taxed separately; 194LBA TDS 10% (resident) no threshold; 56(2)(xii) return-of-capital tax from AY 2024-25; capital gains 111A STCG 20% under 12 months, 112A LTCG 12.5% above Rs 1.25L (shared with equity gains, Sec 112A expressly covers units of a business trust)',
    publisher: 'Tax Garden (31 Aug 2026) / VittSphere ONE / SEBI Item 13 memo (Sep 2025)',
    url: 'https://taxgarden.in/blog/reit-invit-taxation-india-ay-2026-27-section-115ua-distributions-capital-gains',
    claims: [
      'REIT/InvIT is a "business trust" (Sec 2(13A), 1961 Act; Sec 2(21) of the 2025 Act) with pass-through status under Sec 115UA: the trust pays no tax on most income; it passes through to unitholders',
      'Distribution components: interest from SPV (50-70% of most payouts) taxed at slab; dividend is EXEMPT only if the SPV did NOT opt for 115BAA (most large SPVs opted, so most dividend components are taxable at slab); rental income taxable at slab; return-of-capital reduces cost of acquisition unless cumulative distributions exceed the issue price (56(2)(xii), Finance Act 2023 rules from AY 2024-25)',
      'Sec 194LBA TDS: 10% on interest/taxable-dividend/rental components for resident unitholders, NO threshold; 5% on interest for NRs (subject to DTAA)',
      'Capital gains on listed units: holding period 12 months; STCG 20% (Sec 111A) / LTCG 12.5% above Rs 1.25L (Sec 112A, which expressly covers units of a business trust - the exemption is shared with listed shares and equity funds); STT paid on exchange sale is the condition; no indexation',
      'A Finance Act 2025 amendment to 115UA(2) concerns tax on capital gains earned by the trust itself (on SPV disposal), not gains made by unitholders on selling units; the Taxation and Other Laws (Amendment) Act 2026 (assent 17 Aug 2026) amended dividend treatment - verify the current-year wording'
    ],
    type: 'financial-publication',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
  {
    id: 'src-ncd-rates-2026',
    title: 'NCD interest rates in India 2026 (BondScanner OBPP guide, 28 May 2026): coupon = repo floor -> 10-yr G-Sec (~6.5-6.8%) + credit spread (AAA ~50-100bp; BBB ~400-600bp) + tenor + demand; Q2 2026 bands AAA 7.0-8.0%, AA 8.0-9.5%, A 9.5-11.5%, BBB 11.5-13%+; coupon vs YTM divergence example (9% coupon bought at Rs 950 -> ~10.8% YTM); FY 2026-27 tax: coupon at slab, no TDS on listed NCD interest (resident demat holders self-report), STCG under 12 months at slab, LTCG 12.5% without indexation; minimum investment Rs 10,000',
    publisher: 'BondScanner (SEBI-registered OBPP) blog guide, May 2026',
    url: 'https://bondscanner.com/blog/ncd-interest-rates-india-2026-how-set-what-to-look-for',
    claims: [
      'Q2 2026 indicative NCD bands: AAA 7.0-8.0% p.a., AA+ / AA / AA- 8.0-9.5%, A+ / A / A- 9.5-11.5%, BBB+ / BBB / BBB- 11.5-13%+ (lowest SEBI investment grade)',
      'The 10-yr G-Sec benchmark is ~6.5-6.8% (mid-2026), with the RBI repo floor at 5.25% after the cumulative 2026 cut; each rating notch down adds ~100-200bp to the coupon',
      'Secondary-market purchases must be compared on YTM, not coupon: a 9% coupon NCD bought at Rs 950 with 3 years left has a YTM of ~10.8%',
      'Tax (post-July-2024 Finance Act rules, operative FY 2026-27): coupon income at slab, no TDS on listed NCD interest for resident demat holders (self-report in ITR); sale within 12 months STCG at slab; sale after 12 months LTCG 12.5% without indexation; held-to-maturity standard coupon NCDs produce no capital-gains event',
      'Minimum public-issue investment Rs 10,000 (ten Rs 1,000 debentures); SEBI mandates a debenture trustee on every public NCD issue'
    ],
    type: 'industry',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
  {
    id: 'src-hyb-bonds-2026',
    title: 'High-yield bonds in India 2026 (GoldenPi OBPP guide): A/BBB-rated corporate debt yields 10-12%+ (10-14.5% for the broader high-yield bracket as of June 2026); CRISIL 3-year cohort default rates A ~1.5-3%, BBB ~3-5%; 7-point underwriting checklist (outlook, promoter, interest coverage 2x+, secured status, repayment history, CAR 15% minimum for NBFCs, collateral class); diversification: no more than 10% of a fixed-income portfolio in one high-yield issuer; 70/30 core-satellite blend gives ~9% blended pre-tax',
    publisher: 'GoldenPi (SEBI-registered OBPP) high-yield-bond guide, June 2026',
    url: 'https://goldenpi.com/blog/high-yield-bonds-in-india',
    claims: [
      'High-yield bracket (A / BBB ratings) yields 10-12%+ as of June 2026; the wider high-yield market runs 11.00-14.50% (BB and below)',
      'CRISIL annual default-study cohort data: 3-year cumulative default rate ~1.5-3% for A-rated, ~3-5% for BBB-rated corporate bond cohorts (i.e. 95-98.5% of A/BBB cohorts service on schedule)',
      '7-point underwriting checklist: credit-rating outlook; promoter background; interest coverage (2x+); secured vs unsecured with asset cover; repayment history; Capital Adequacy Ratio 15% minimum for NBFCs; collateral class (liquid / diversified)',
      'Concentration rule: no more than 10% of a total fixed-income portfolio in a single high-yield issuer; 5-issuer diversification at equal weight bounds one default at 20% of the book',
      'Core-satellite illustration: 70% AAA/AA core at 8.2% + 30% A/BBB satellite at 11% -> blended pre-tax ~9.04%',
      'Gold-loan NBFC paper is structurally protected by liquid physical gold collateral; real-estate developer paper carries illiquid, concentrated collateral risk'
    ],
    type: 'industry',
    verified: '2026-10-17',
    lastVerified: '2026-10-17'
  },
];

for (const src of newSources) {
  if (have.has(src.id)) {
    console.log('SKIP (exists):', src.id);
    continue;
  }
  s.push(src);
  console.log('ADDED:', src.id);
}
fs.writeFileSync(p, JSON.stringify(s, null, 1) + '\n', 'utf8');
console.log('total sources now:', s.length);
