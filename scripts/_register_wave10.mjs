// One-off: register Wave 10 article, book chapter, and update-log entry.
// Safe parse -> mutate -> stringify pattern. No new source needed: the article
// cites only existing registry sources (src-elss-ltcg-2026, src-pms-aif-fees-2026,
// src-aif-categories-2026, src-aif-waterfall-economics-2026).
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('alternatives-pms-sif-aif-after-tax-wedge')) {
  aarr.push({
    id: 'alternatives-pms-sif-aif-after-tax-wedge',
    title: "The After-Tax Wedge: Why Equal Gross Returns Leave You Different Money (Index vs PMS vs SIF vs AIF)",
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['aif', 'pms', 'sif', 'index-fund', 'after-tax', '112a', 'slab-rate', 'tax-wedge', 'cagr', 'fee-stack', 'capital-ladder'],
    summary:
      "The 'what actually lands in your pocket' layer over the capital ladder: an index fund, a PMS, a SIF, a Category I/II AIF and a Category III AIF can all quote the same gross return - but the net CAGR that compounds differs by where the tax lands and the fee stack. Worked 10-year comparison at 14% gross, the decision rule, and the 194LBB cash-flow trap.",
    file: 'src/content/alternatives/alternatives-pms-sif-aif-after-tax-wedge.mdx',
    sources: ['src-elss-ltcg-2026', 'src-pms-aif-fees-2026', 'src-aif-categories-2026', 'src-aif-waterfall-economics-2026'],
    related: ['alternatives-hnw-pms-aif-sif-selection', 'alternatives-aif-category-selection-guide', 'alternatives-aif-waterfall-economics', 'alternatives-sif-strategy-families-deep-dive', 'tax-aif-pcc-115bb-deep-dive'],
    books: ['book-wealth-beyond-10l'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const bwe = barr.find((b) => b.id === 'book-wealth-beyond-10l');
if (bwe && !bwe.chapters.includes('alternatives-pms-sif-aif-after-tax-wedge')) {
  bwe.chapters.push('alternatives-pms-sif-aif-after-tax-wedge');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-unlisted-ltcg-slab-2026')) {
  uarr.push({
    id: 'ul-unlisted-ltcg-slab-2026',
    claim:
      'Unlisted shares: 24-month LTCG holding period (unchanged by Budget 2024; the 36-month period was removed for most other assets), long-term gain taxed at slab rates without indexation; listed equity-type (shares, equity MF, business-trust units) is 12-month LTCG at 12.5% above the shared Rs 1.25L 112A pool',
    source: 'src-elss-ltcg-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Verified against the PIB Budget-2024 FAQ and the Finance Bill 2024 memo (holding periods: 12-month listed, 24-month unlisted/property/gold, 36-month removed). This is the rate the AIF Cat I/II pass-through wedge in the tax-wedge article uses at the investor slab.',
  });
}
if (!uhav.has('ul-cat3-fund-level-rate-2026')) {
  uarr.push({
    id: 'ul-cat3-fund-level-rate-2026',
    claim:
      'Category III AIFs are taxed at the fund level, frequently at the maximum marginal rate ~42.7% including surcharge; unitholders receive distributions net of that tax; specific vehicles may qualify for 10(4D)/10(23FF)/10(23FBC)/115AD exemptions',
    source: 'src-aif-categories-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Secondary reading (Altportfunds / Treelife 2026); confirm the specific fund tax note and the exact current-year rate before advising on a Cat III sleeve.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 10 registry updated: 1 article (no new source needed), book-wealth-beyond-10l +1 chapter, 2 update-log entries');
