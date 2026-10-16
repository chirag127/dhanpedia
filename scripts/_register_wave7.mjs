// One-off: register Wave 7 sources, articles, book chapters, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const arr = sources.sources ?? sources;
const have = new Set(arr.map((s) => s.id));

if (!have.has('src-aif-sebi-amendment-2026')) {
  arr.push({
    id: 'src-aif-sebi-amendment-2026',
    title:
      'SEBI AIF Amendment 2026: accredited-investor-only schemes (1,000-investor cap waived), distinct Category I angel-fund class (49-investor cap, accredited-only, re-registration deadline 8 Sep 2026), inoperative-fund classification and Regulation 29 retained-liquidation-proceeds changes; AIF Master Circular 3 June 2026',
    publisher: 'SEBI AIF Amendment Regulations 2026 / AIF Master Circular (3 Jun 2026) — via Tax Update India, RANJ Legal, calcguru',
    url: 'https://taxupdate.in/finance/706/sebi-aif-amendment-regulations-2026-inoperative-fund-regulation-29-ppm-update-guide/',
    type: 'regulator',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Funds that restrict themselves exclusively to Accredited Investors get the 1,000-investor cap waived',
      'Angel funds are now a distinct Category I AIF class that may raise only from accredited investors, with a 49-investor cap; existing angel funds had to re-align by the transition deadline of 8 Sep 2026',
      'The SEBI (AIF) (Amendment) Regulations, 2026 let an AIF be tagged as an inoperative fund and change how retained liquidation proceeds are handled (Regulation 29)',
      'The AIF Master Circular was consolidated on 3 June 2026',
    ],
    notes: 'Secondary readings of the SEBI amendment text; confirm the exact amendment numbers, dates, and deadlines against the SEBI AIF Master Circular (3 Jun 2026) and the notification before advising.',
  });
}

if (!have.has('src-aif-tax-forms-2026')) {
  arr.push({
    id: 'src-aif-tax-forms-2026',
    title:
      'AIF tax forms AY 2026-27 vs AY 2027-28: Section 115UB pass-through (Cat I/II) vs fund-level trust taxation (Cat III); 194LBB 10% TDS on credited income; business income NOT passed through; losses pass through only after 12-month hold; the 64C/64D -> 78/79 form migration under the Income-tax Act 2025 (effective 1 Apr 2026, Sec 224 / Rule 145); Schedule PTI reporting in ITR-2',
    publisher: '49Tax PMS/AIF Taxation Guide (AY 2026-27) / Altportfunds AIF Tax Forms / TaxHeal pass-through AY 2026-27',
    url: 'https://www.altportfunds.com/aif-tax-forms-itr-reporting',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Section 115UB gives Category I & II AIFs pass-through status: fund income is taxed in the unitholder hands, retaining its character',
      'Business income of the AIF is taxed at the fund level (max marginal rate) and reaches the unitholder tax-free; it is NOT passed through',
      'Losses: business losses stay at the fund level; other losses pass through only if units were held at least 12 months',
      'TDS at 10% under Section 194LBB on income credited to the unitholder, whether or not distributed',
      'The Income-tax Act 2025 (effective 1 Apr 2026) renames Form 64C -> Form 78 and Form 64D -> Form 79 (Sec 224, Rule 145); income for years beginning before 1 Apr 2026 stays under the old Act and old forms',
      'Category III AIFs have no pass-through; taxed at fund level, frequently ~42.7% incl. surcharge, net of tax to the unitholder; specific Cat III vehicles may qualify for exemptions under 10(4D), 10(23FF), 10(23FBC) or 115AD',
      'Pass-through income is reported in Schedule PTI of ITR-2, by head and by fund, including the deemed-credit mechanism',
    ],
    notes: 'The ~42.7% Cat III fund-level rate and the specific-exemption sections are secondary readings; confirm the exact rate and sections against the Income-tax Act 2025 text and a CA for the assessment year.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('alternatives-aif-category-selection-guide')) {
  aarr.push({
    id: 'alternatives-aif-category-selection-guide',
    title: 'AIF Category Selection: Which Rung of ₹1Cr (Cat I / II / III) Fits Your Capital, Liquidity & Tax',
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['aif', 'category-i', 'category-ii', 'category-iii', 'pms', 'private-equity', 'venture', 'hedge-fund', 'due-diligence', 'fees', 'carried-interest', 'lock-in', 'leverage'],
    summary:
      'The decision layer over AIFs: how SEBI\'s three categories differ on leverage, lock-in, tax and fee structure; which one a growing ₹1Cr-to-₹10Cr investor should actually pick; the 2/20 fee-decay math; and the due-diligence questions that separate a real opportunity from a fee stack.',
    file: 'src/content/alternatives/alternatives-aif-category-selection-guide.mdx',
    sources: ['src-aif-categories-2026', 'src-pms-aif-fees-2026', 'src-sebi-sif-2026', 'src-aif-sebi-amendment-2026'],
    related: ['alternatives-pms-aif-private', 'alternatives-hnw-pms-aif-sif-selection', 'alternatives-sif-strategy-families-deep-dive', 'tax-tax-free-wealth-stack', 'portfolio-construction-rebalancing'],
    books: ['book-wealth-beyond-10l'],
  });
}

if (!ahav.has('tax-aif-pcc-115bb-deep-dive')) {
  aarr.push({
    id: 'tax-aif-pcc-115bb-deep-dive',
    title: 'AIF Taxation Decoded: Section 115UB Pass-Through, the Cat III Fund-Level Tax & the 64C-to-78 Form Migration',
    category: 'taxation',
    difficulty: 'advanced',
    status: 'published',
    tags: ['aif', '115ub', 'pass-through', '194lbb', 'form-64c', 'form-78', 'schedule-pti', 'category-iii', 'taxation', 'itr', 'advance-tax'],
    summary:
      'The taxation layer over AIFs: how Category I/II pass-through under Section 115UB puts tax in your hands, why Category III is taxed at the fund level, the 194LBB TDS, the business-income non-pass-through trap, and the 2026 migration from Form 64C/64D to 78/79 under the new Income-tax Act.',
    file: 'src/content/taxation/tax-aif-pcc-115bb-deep-dive.mdx',
    sources: ['src-advance-tax-fy2026-27', 'src-it-slab-fy2026-27', 'src-it-dept-final-dates-2026', 'src-aif-tax-forms-2026'],
    related: ['tax-advance-itr-final-checklist', 'alternatives-aif-category-selection-guide', 'alternatives-pms-aif-private', 'tax-loss-harvesting', 'pf-wealth-plan-10-lakh'],
    books: ['book-indian-taxation'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const bwe = barr.find((b) => b.id === 'book-wealth-beyond-10l');
if (bwe && !bwe.chapters.includes('alternatives-aif-category-selection-guide')) {
  bwe.chapters.push('alternatives-aif-category-selection-guide');
}
const btax = barr.find((b) => b.id === 'book-indian-taxation');
if (btax && !btax.chapters.includes('tax-aif-pcc-115bb-deep-dive')) {
  btax.chapters.push('tax-aif-pcc-115bb-deep-dive');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-aif-sebi-amendment-2026')) {
  uarr.push({
    id: 'ul-aif-sebi-amendment-2026',
    claim:
      'SEBI AIF Amendment 2026: accredited-investor-only schemes waive the 1,000-investor cap; angel funds are a distinct Category I class (49-investor, accredited-only, re-registration deadline 8 Sep 2026); inoperative-fund classification and Regulation 29 retained-liquidation-proceeds changes; AIF Master Circular 3 Jun 2026',
    source: 'src-aif-sebi-amendment-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Secondary reading of the SEBI amendment; confirm deadlines and amendment numbers against the SEBI AIF Master Circular (3 Jun 2026).',
  });
}
if (!uhav.has('ul-aif-tax-forms-migration-2026')) {
  uarr.push({
    id: 'ul-aif-tax-forms-migration-2026',
    claim:
      'AIF tax forms: 64C/64D migrate to 78/79 under the Income-tax Act 2025 (effective 1 Apr 2026, Sec 224 / Rule 145); income for years beginning before 1 Apr 2026 stays on the old forms; 194LBB 10% TDS on credited pass-through income; business income not passed through; losses need a 12-month hold',
    source: 'src-aif-tax-forms-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-07-31',
    status: 'verified',
    notes: 'The 115UB pass-through and 194LBB TDS are current; the form renumbering is a 2026 framework change - re-verify at each Finance Act and against the Income-tax Department ITR-2 documentation.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 7 registry updated: 2 sources, 2 articles, book chapters updated, 2 update-log entries');
