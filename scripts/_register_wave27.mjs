import fs from 'node:fs';

// 1) sources.json - add the FAST-DS Rules 2026 valuation source
const sf = JSON.parse(fs.readFileSync('content-registry/sources.json', 'utf8'));
const srcs = Array.isArray(sf) ? sf : sf.sources;
const newSource = {
  id: 'src-fastds-rules-valuation-2026',
  title:
    'FAST-DS 2026 valuation + due-diligence layer: the Foreign Assets of Small Taxpayers-Disclosure Scheme Rules, 2026 (G.S.R. 732(E) dated 14 Aug 2026, in force 16 Aug 2026, last date 31 Dec 2026) - the 31 Mar 2026 valuation date (Rule 2(1)(e)), the Rule 3 per-asset-class FMV methods + RBI-reference-rate currency conversion (Rule 3(4)/(5)), the 20% valuation-variance safeguard (Rule 5(2)), the four-form chain (Forms 1-2-3-4, Rules 5-8) + the 1%/month late-payment interest (Rule 7), and the limited immunity that does NOT settle FEMA exposure',
  publisher: 'CA R N Mohil (TaxGuru, 18 Aug 2026) + the CBDT FAST-DS 2026 official FAQs (13 Aug 2026) + the notified G.S.R. 732(E) Rules + EY 2026 technical alert',
  url: 'https://taxguru.in/income-tax/fast-ds-2026-decoded-foreign-asset-disclosure-valuation-compliance.html',
  type: 'guide',
  authority: 'secondary',
  published: '2026-08-18',
  verified: '2026-10-18',
  lastVerified: '2026-10-18',
  claims: [
    'The FAST-DS 2026 Rules were notified vide G.S.R. 732(E) dated 14 Aug 2026, came into force 16 Aug 2026, and prescribe 31 Dec 2026 as the "last date" (Rule 2(4)); the valuation date is fixed at 31 Mar 2026 (Rule 2(1)(e)) - not adjustable',
    'Track A (undisclosed foreign asset/income, aggregate up to Rs 1 cr): 30% tax plus an additional amount equal to 100% of that tax = 60% of value; Rule 4 illustrates a Rs 60L bank account + Rs 20L undisclosed income (aggregate Rs 80L within the ceiling) -> tax Rs 24L + additional Rs 24L = Rs 48L',
    'Track B (a specified foreign asset up to Rs 5 cr that was acquired from income accrued abroad while non-resident, or from income already offered to tax but omitted from the return schedule): a flat Rs 1,00,000 fee; Rule 4 illustrates a Rs 3 cr foreign property acquired while non-resident -> Rs 1 lakh',
    'Rule 3 prescribes asset-specific valuation as on 31 Mar 2026: bullion/jewellery/precious stones (3(1)(a)), artistic works (3(1)(b)), quoted shares/securities (3(1)(c)(i)), unquoted equity shares (3(1)(c)(ii)), other unquoted shares/securities (3(1)(c)(iii)), immovable property (3(1)(d)), foreign bank accounts (3(1)(e) - the sum of deposits from opening to 31 Mar 2026 with treatment for redeposits), partnership/AOP/LLP interests (3(1)(f)), and other assets (3(1)(g)); Rule 3(2)/(3) cover assets transferred before the valuation date and assets acquired from proceeds; where valuation is not carried out, the indexed cost of acquisition is deemed to be the FMV',
    'Currency conversion (Rule 3(4)/(5)): an asset in a permitted currency is converted to INR at the RBI reference rate on the valuation date; other currencies convert two-stage through USD using the prescribed foreign-country rate + the RBI reference rate',
    'The four-form electronic process (Rules 5-8): Form 1 (declaration, Rule 5 - separately captures the Track A and Track B computations with annexures), Form 2 (order/determination, Rule 6 - issued by the Principal DGIT or DGIT (Systems)), Form 3 (payment intimation, Rule 7 - payment within 2 months of receipt of Form 2; 1% interest per month or part for delayed payment; part payments recognised), and Form 4 (final certification, Rule 8 - certifying the declaration is valid for Section 139 and conferring the prescribed immunity)',
    'Rule 5(2) valuation-variance safeguard: the declaration is not treated as invalid merely because the FMV declared in Form 1 differs from the value later determined by the assessing officer, provided the variance does not exceed 20% of the declared FMV; above 20% the charge re-computes on the (higher) determined FMV',
    'FAST-DS is taxpayer-specific (companies/LLPs/firms/trusts cannot use it for their employees) and its immunity is LIMITED: it regularises the tax / Black Money Act exposure but does NOT automatically settle FEMA / exchange-control exposure, and does not replace the ongoing Schedule FA obligation'
  ],
  limitations:
    'The 20% valuation-variance safeguard, the per-asset-class Rule 3 methods, and the RBI-reference-rate currency conversion are the operative 2026 positions and can move with a later notification / Budget. The "determined FMV" is what an assessing officer arrives at - the calculator takes it as an input, not a live valuation. Confirm the specific asset class and currency against the notified Rules and a CA before filing Form 1. This is a due-diligence/valuation planning layer, not a Form 1 filing computation.',
};
if (!srcs.some((s) => s.id === newSource.id)) {
  srcs.push(newSource);
  fs.writeFileSync('content-registry/sources.json', JSON.stringify(sf, null, 2) + '\n');
  console.log('sources.json: added', newSource.id, '->', srcs.length);
} else {
  console.log('sources.json: already present, total', srcs.length);
}

// 2) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'tax-fastds-valuation-guard-due-diligence',
  file: 'src/content/taxation/tax-fastds-valuation-guard-due-diligence.mdx',
  title:
    'FAST-DS 2026 Valuation Guard & Due-Diligence: Did You Value It Right? (Rule 3 + the 20% Rule-5(2) Safeguard, 31 Mar 2026)',
  category: 'taxation',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-01-31',
  tags: [
    'fast-ds',
    'fastds-rules-2026',
    'valuation',
    'rule-3',
    '20-percent-safeguard',
    'rule-5-2',
    'fmv',
    '31-march-2026',
    'currency-conversion',
    'rbi-reference-rate',
    'form-1',
    'form-2',
    'form-3',
    'form-4',
    'late-payment-interest',
    'fema',
    'due-diligence',
    'foreign-asset',
  ],
  sources: [
    'src-fastds-rules-valuation-2026',
    'src-us-stock-tax-india-2026',
    'src-it-slab-fy2026-27',
  ],
  related: [
    'tax-fastds-2026-declaration',
    'tax-black-money-act-exposure',
    'tax-direct-lrs-us-equity-filing-walkthrough',
    'tax-india-investor-complete',
  ],
  books: ['book-complete-indian-investor'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed', newArticle.id, '->', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// 3) books.json - add chapter to book-complete-indian-investor
const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
const book = books.find((b) => b.id === 'book-complete-indian-investor');
if (book) {
  const ch = book.chapters ?? (book.chapters = []);
  if (!ch.includes(newArticle.id)) {
    ch.push(newArticle.id);
    fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2) + '\n');
    console.log('books.json: book-complete-indian-investor now', ch.length, 'chapters');
  } else {
    console.log('books.json: chapter already present, total', ch.length);
  }
}

// 4) update-log.json
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-fastds-valuation-guard-2026',
  topic:
    'FAST-DS 2026 valuation + due-diligence layer (the Foreign Assets of Small Taxpayers-Disclosure Scheme Rules, 2026, G.S.R. 732(E) 14 Aug 2026, in force 16 Aug, last date 31 Dec 2026): the fixed 31 Mar 2026 valuation date (Rule 2(1)(e)), the Rule 3 per-asset-class FMV methods (bank accounts = sum of deposits to 31 Mar 2026; quoted/unquoted securities; immovable property; bullion; partnership interests; indexed-cost deemed-FMV fallback) + the Rule 3(4)/(5) RBI-reference-rate two-stage currency conversion, the Rule 5(2) 20% valuation-variance safeguard (the declaration stands only while the FMV variance is within 20% of the DECLARED value; above that the charge re-computes on the higher determined FMV), the four-form chain (Forms 1-2-3-4, Rules 5-8, before the Principal DGIT Systems) + the 1%/month late-payment interest (Rule 7), and the LIMITED immunity (regularises tax / BMA exposure but does NOT settle FEMA and does not replace ongoing Schedule FA).',
  article: 'tax-fastds-valuation-guard-due-diligence',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-01-31',
  sourceIds: [
    'src-fastds-rules-valuation-2026',
    'src-us-stock-tax-india-2026',
    'src-it-slab-fy2026-27',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
}
