// One-off: register Wave 13 source, article, book chapter, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-nps-exit-annuity-2026')) {
  sarr.push({
    id: 'src-nps-exit-annuity-2026',
    title:
      "NPS retirement exit & annuity, FY 2026-27: PFRDA 16-Dec-2025 amendment - non-govt 80% lump / min 20% annuity (was 60/40), deferral to age 85, Rs 8L small-corpus 100% withdrawal; premature exit 20/80; annuity priced at PFRDA-empanelled ASP life-annuity rates ~6-7% at age 60 (joint-life / return-of-purchase lower); Sec 10(10A)/10(i)(xii) exempts the NPS lump sum up to 60% of total contributions - the extra 20% taken under the 80% exit is slab-taxed; annuity income slab-taxed",
    publisher: 'PFRDA Exits & Withdrawals (Amendment) Regulations, 16 Dec 2025 / NPS annuity-calculator rate bands / Income-tax Act 10(10A) cap',
    url: 'https://npscalculators.in/nps-annuity-calculator',
    type: 'regulator',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'PFRDA 16-Dec-2025 amendment (non-govt): up to 80% lump sum at 60, minimum 20% annuity; deferral of the annuity purchase allowed up to age 85; corpus at or below Rs 8L is a 100% lump-sum withdrawal',
      'Permitted premature exit (before 60, after the lock-in): 20% lump sum / 80% annuity - tighter than the normal 80/20',
      'PFRDA-empanelled ASP life-annuity rates at age 60 run ~6-7%; joint-life and return-of-purchase variants are lower (5-6% / 4-5%)',
      'Section 10(10A)/10(i)(xii): the NPS lump sum is exempt only up to 60% of total contributions (self + employer); the extra 20% of corpus taken under the PFRDA 80% exit is taxable at the slab rate',
      'Annuity (pension) income is taxable at the slab rate (EET on that leg); the new regime may exempt part of the annuity where the purchase is at age 65+ - verify the current-year wording',
      '80CCD(1B) Rs 50,000 and 80CCD(1) are old-regime-only; 80CCD(2) employer NPS works in both regimes (new regime: up to 14% of Basic+DA for all employers)',
    ],
    notes: 'The PFRDA 80/20 split, 85 deferral, and Rs 8L small-corpus threshold are per the 16-Dec-2025 amendment. The 60% 10(10A) exemption cap and any new-regime annuity-income exemption are Income-tax-Act provisions under the Act-2025 transition - confirm with a CA for the exit year before acting. Annuity rates are the 2026 empanelment bands and move with interest rates.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('retirement-nps-exit-annuity-tax-deep-dive')) {
  aarr.push({
    id: 'retirement-nps-exit-annuity-tax-deep-dive',
    title: 'Your NPS at 60: The 80/20 Exit, the 60%-Exemption Cap, and What the Annuity Leg Actually Pays',
    category: 'retirement-fire',
    difficulty: 'advanced',
    status: 'published',
    tags: ['nps', 'pfrda', 'annuity', 'exit', '80-20', '10-10a', 'tax', 'retirement', '80ccd2', '85-deferment'],
    summary:
      'The retirement-exit layer over NPS: the PFRDA 16-Dec-2025 80/20 split (and the Rs 8L small-corpus 100% rule + 85 deferral), why the Section 10(10A) exemption is capped at 60% of contributions even when you take 80%, the five PFRDA annuity variants and the rate band that decides monthly income, and the new-regime 80CCD(2) entry-vs-exit tax separation.',
    file: 'src/content/retirement-fire/retirement-nps-exit-annuity-tax-deep-dive.mdx',
    sources: ['src-nps-2025-exit', 'src-nps-deductions-2026', 'src-nps-exit-annuity-2026'],
    related: ['retirement-fire-annuities', 'tax-india-investor-complete', 'tax-80c-baskets-regime-decision', 'govt-small-savings-schemes', 'pf-wealth-plan-10-lakh'],
    books: ['book-complete-indian-investor'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const binv = barr.find((b) => b.id === 'book-complete-indian-investor');
if (binv && !binv.chapters.includes('retirement-nps-exit-annuity-tax-deep-dive')) {
  binv.chapters.push('retirement-nps-exit-annuity-tax-deep-dive');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-nps-exit-80-20-2025')) {
  uarr.push({
    id: 'ul-nps-exit-80-20-2025',
    claim:
      'PFRDA 16-Dec-2025 NPS exit (non-govt): up to 80% lump sum / min 20% annuity (was 60/40), annuity deferral to age 85, corpus <= Rs 8L is a 100% lump-sum withdrawal; premature exit 20/80; ASP life-annuity rates ~6-7% at 60; Sec 10(10A) exemption capped at 60% of contributions so the extra 20% lump sum is slab-taxed',
    source: 'src-nps-exit-annuity-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'PFRDA 80/20 split, 85 deferral, and Rs 8L small-corpus threshold are per the 16-Dec-2025 amendment; the 60% 10(10A) cap and any new-regime annuity-income exemption are Income-tax-Act provisions under the Act-2025 transition - confirm with a CA for the exit year. Annuity rates are 2026 empanelment bands and move with interest rates.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 13 registry updated: 1 source, 1 article, book-complete-indian-investor +1 chapter, 1 update-log entry');
