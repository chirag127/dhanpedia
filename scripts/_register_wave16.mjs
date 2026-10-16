// One-off: register Wave 16 source, article, book chapter, and update-log entry.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-nri-tax-tds-dtaa-2026')) {
  sarr.push({
    id: 'src-nri-tax-tds-dtaa-2026',
    title:
      "NRI tax & TDS FY 2026-27 (Income-tax Act 2025, individual residency tests unchanged from the 1961 Act): Section 6 residency = resident if in India 182+ days in the FY, OR 60+ days in the FY AND 365+ days in the 4 preceding FYs (the 60 rises to 120 if Indian income exceeds Rs 15L); fail both = non-resident; NR/RNOR/ROR split (RNOR window under Section 6(6)); an NRI is taxed only on India-source income (rent, CG on Indian assets, NRO interest, salary for India services); NRE interest exempt u/s 10(4)(ii) and FCNR (B) exempt u/s 10(15) while non-resident; NRO/FCNR freely repatriable, NRO repatriation capped at USD 1M/yr post-tax; Section 195 TDS on payments to a non-resident is flat 30% (+surcharge +4% cess) with no exemption slabs, head-specific rates: NRO/rent 30%, 111A STCG 20%, 112A listed-equity LTCG 12.5% above Rs 1.25L, property LTCG 12.5% no indexation, property STCG 30% at slab, dividends 20%; on a property sale the buyer withholds on the FULL sale value under 195 (not the gain) - a Section 197 lower-deduction certificate is the fix; DTAA relief = valid TRC + Form 10F + Form 67 (foreign tax credit), the LOWER of the domestic and treaty rate; NRIs CANNOT use Form 15G/15H; the Section 87A rebate is NOT available to NRIs (they are taxed on the whole India-source income); ITR for an NRI is ITR-2 (ITR-3 if business income or foreign assets), due 31 Jul (31 Oct if audit); NRIs generally cannot use ITR-1",
    publisher: 'TaxClue NRI tax guide (updated 18 Aug 2026) / NRI Blueprint Section 6 guide',
    url: 'https://www.taxclue.in/guide/tax-on-nri-income',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Section 6 residency (individual, unchanged into the Income-tax Act 2025): resident if 182+ days in the FY, OR 60+ days in the FY AND 365+ days in the 4 preceding FYs; the 60-day figure rises to 120 if Indian income exceeds Rs 15L; fail both = non-resident; physical presence counts arrival and departure days',
      'A non-resident is taxed in India only on India-source income; foreign income and NRE/FCNR interest stay outside the Indian net',
      'Account split: NRE interest exempt u/s 10(4)(ii) + freely repatriable; FCNR (B) exempt u/s 10(15) while non-resident + freely repatriable (foreign currency); NRO interest fully taxable, repatriation capped at USD 1M/yr post-tax',
      'Section 195 TDS on payments to a non-resident is a flat 30% (+surcharge +4% cess) with no exemption slabs; head rates: NRO/rent 30%, 111A STCG 20%, 112A listed-equity LTCG 12.5% above Rs 1.25L, property LTCG 12.5% no indexation, property STCG 30% at slab, dividends 20%',
      'On an NRI property sale the buyer withholds under 195 on the FULL sale value, not the gain; a Section 197 lower-deduction certificate (before the sale) is the fix for the over-withholding',
      'DTAA relief sequence: valid Tax Residency Certificate + Form 10F (NRI declaration) + Form 67 (foreign tax credit); the applicable rate is the LOWER of the domestic and treaty rate; NRIs cannot use Form 15G/15H (resident-only)',
      'The Section 87A rebate (new-regime tax-free up to Rs 12L) is NOT available to NRIs; an NRI is taxed on the whole India-source income at the slab or special rates',
      'NRI ITR: ITR-2 (ITR-3 if Indian business/professional income or foreign assets), due 31 Jul (31 Oct if audit); NRIs generally cannot use ITR-1 (Sahaj); filing is required to reclaim excess TDS',
    ],
    notes: 'The 195 head rates, the 87A-not-available position, and the 15G/15H exclusion are as of the FY 2026-27 transition under the Income-tax Act 2025; the individual residency day counts were NOT changed by the 2025 Act. Re-verify the 195 head rates and the 87A position at each Finance Act, and confirm the specific DTAA treaty rate against the actual treaty text before claiming relief.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('international-nri-tax-residency-tds-dtaa')) {
  aarr.push({
    id: 'international-nri-tax-residency-tds-dtaa',
    title: 'NRI Tax in India: Residency, India-Source Income, Section 195 TDS & DTAA Relief (FY 2026-27)',
    category: 'international',
    difficulty: 'advanced',
    status: 'published',
    tags: ['nri', 'non-resident', 'residency', 'section-6', '195', 'tds', 'dtaa', 'nre', 'nro', 'fcnr', 'rnor', 'itr-2', '87a'],
    summary:
      'The inbound NRI tax layer the investing-route articles do not cover: how the Section 6 day counts (182-day / 60+365 / 120+365, with the Rs 15L Indian-income variant) decide status, the NR/RNOR/ROR split, why only India-source income is taxed, the NRE/NRO/FCNR account choice, the Section 195 TDS table (30% flat, property TDS-on-value + 197), the DTAA relief sequence (TRC + Form 10F + Form 67, 15G/15H unavailable), the 87A-not-available asymmetry, and the ITR-2/ITR-3 filing map.',
    file: 'src/content/international/international-nri-tax-residency-tds-dtaa.mdx',
    sources: ['src-nri-tax-tds-dtaa-2026', 'src-it-slab-fy2026-27', 'src-intl-fof-cap-2026'],
    related: ['international-investing-lrs', 'international-fof-gift-city-lrs', 'tax-india-investor-complete', 'tax-surcharge-cess-high-income', 'pf-wealth-plan-10-lakh'],
    books: ['book-complete-indian-investor'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const binv = barr.find((b) => b.id === 'book-complete-indian-investor');
if (binv && !binv.chapters.includes('international-nri-tax-residency-tds-dtaa')) {
  binv.chapters.push('international-nri-tax-residency-tds-dtaa');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-nri-195-dtaa-2026')) {
  uarr.push({
    id: 'ul-nri-195-dtaa-2026',
    claim:
      'NRI Section 195 TDS is a flat 30% (+surcharge +4% cess) with no exemption slabs (head rates: NRO/rent 30%, 111A 20%, 112A 12.5% above 1.25L, property LTCG 12.5% no indexation, property STCG 30%, dividends 20%); property sale TDS is on the full value (use 197 to fix); DTAA relief = TRC + Form 10F + Form 67 at the lower of domestic and treaty rate; 15G/15H unavailable to NRIs; 87A rebate NOT available to NRIs',
    source: 'src-nri-tax-tds-dtaa-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'The 195 head rates and the 87A/15G-15H positions are as of the FY 2026-27 transition under the Income-tax Act 2025; the individual residency day counts were unchanged. Re-verify the 195 head rates and the 87A position at each Finance Act, and confirm the specific DTAA treaty rate against the treaty text.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 16 registry updated: 1 source, 1 article, book-complete-indian-investor +1 chapter, 1 update-log entry');
