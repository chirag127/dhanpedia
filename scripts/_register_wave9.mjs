// One-off: register Wave 9 source, article, book chapter, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-ppf-rate-fy2026-27')) {
  sarr.push({
    id: 'src-ppf-rate-fy2026-27',
    title:
      'PPF interest rate FY 2026-27: 7.1% p.a. unchanged for Q1 (Apr-Jun 2026), the 8th straight unchanged quarter (Finance Ministry notification 30 Mar 2026); PPF is EEE - 80C deduction on contribution (old regime), tax-free interest credited annually, tax-free withdrawal; 15-year tenure; partial withdrawal after 5 yrs up to 50% of the lower of year-4 / previous-year balance; deposit before the 5th of the month earns that month interest',
    publisher: 'Economic Times / Finance Ministry small-savings notification (30 Mar 2026)',
    url: 'https://economictimes.indiatimes.com/wealth/invest/ppf-interest-rate-2026-has-public-provident-fund-interest-rate-increased-for-april-june-2026-quarter/articleshow/130060237.cms',
    type: 'regulator',
    authority: 'primary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'PPF rate is 7.1% p.a. for FY 2026-27 Q1, unchanged for the 8th consecutive quarter',
      'PPF is an EEE instrument: 80C on contribution (old regime), tax-free interest, tax-free maturity',
      'Interest is credited at the end of each financial year; contributions before the 5th of a month earn that month accrual',
      'Partial withdrawal allowed after 5 years, limited to 50% of the lower of the year-4 or previous-year balance',
    ],
    notes: 'The rate is re-notified quarterly (July, October, January) - re-verify at each notification and before advising on a PPF top-up.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('tax-80c-baskets-regime-decision')) {
  aarr.push({
    id: 'tax-80c-baskets-regime-decision',
    title: 'The 80C Basket Decision: What ₹1.5 L of Deductions Is Actually Worth in Your Regime (and the NPS Side-Door)',
    category: 'taxation',
    difficulty: 'intermediate',
    status: 'published',
    tags: ['80c', 'elss', 'ppf', 'epf', 'nps', '80ccd1b', '80ccd2', 'old-regime', 'new-regime', 'tax-shield', 'deductions', 'fy-2026-27'],
    summary:
      'The tax-shield layer over old-regime deductions: how to fill the 1.5L 80C basket by risk not habit (ELSS vs PPF vs EPF vs home-loan vs the LIC trap), the 50K NPS side-door (old-regime-only), the 80CCD(2) employer-NPS lever that survives the new regime, and the verified FY 2026-27 result that the new regime usually still wins up to ~45L even with a full deduction stack.',
    file: 'src/content/taxation/tax-80c-baskets-regime-decision.mdx',
    sources: ['src-it-80c-150k', 'src-eldeductions-fy2026-27', 'src-ppf-rate-fy2026-27', 'src-nps-deductions-2026'],
    related: ['tax-india-investor-complete', 'tax-tax-free-wealth-stack', 'govt-small-savings-schemes', 'pf-wealth-plan-10-lakh', 'retirement-fire-annuities'],
    books: ['book-indian-taxation'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const btax = barr.find((b) => b.id === 'book-indian-taxation');
if (btax && !btax.chapters.includes('tax-80c-baskets-regime-decision')) {
  btax.chapters.push('tax-80c-baskets-regime-decision');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-ppf-rate-fy2026-27')) {
  uarr.push({
    id: 'ul-ppf-rate-fy2026-27',
    claim: 'PPF interest rate 7.1% p.a. for FY 2026-27 Q1 (unchanged, 8th straight quarter); re-notified quarterly',
    source: 'src-ppf-rate-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2026-12-31',
    status: 'verified',
    notes: 'Re-verify at the January 2027 notification for Q4 FY 2026-27.',
  });
}
if (!uhav.has('ul-regime-decision-new-wins-fy2026-27')) {
  uarr.push({
    id: 'ul-regime-decision-new-wins-fy2026-27',
    claim:
      'Modeled FY 2026-27 result: with the Budget 2025-widened new-regime slabs + 87A to 12L + 75k standard deduction, the NEW regime is cheaper than the old regime up to ~45L of income even with a full ~5L old-regime stack (80C 1.5L + 80CCD(1B) 0.5L + 24(b) 2L + 80D 1L); the old regime can only win with larger relative deductions (heavy 80D + 80E + top bands with surcharge). Verified by the deductionShieldFY27() unit-test scan.',
    source: 'src-it-slab-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Model excludes surcharge + 4% cess above 50L - the regime flip for >50L earners must be re-checked including surcharge. Re-verify at each Finance Act because any new-regime slab change flips the boundary.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 9 registry updated: 1 source, 1 article, book-indian-taxation +1 chapter, 2 update-log entries');
