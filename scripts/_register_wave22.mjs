import fs from 'node:fs';

// 1) sources.json — add 2 new sources
const sf = JSON.parse(fs.readFileSync('content-registry/sources.json', 'utf8'));
const srcs = Array.isArray(sf) ? sf : sf.sources;
const newSources = [
  {
    id: 'src-intl-fof-treatment-ay2026-27',
    title:
      'International Mutual Fund Taxation in India: the AY 2026-27 Section 50AA debt-test and the 12.5% LTCG (no pool) that now reaches non-specified international FoFs and GIFT City schemes',
    publisher: 'Foliyo / Sachin Kabra (ex-Director HDFC Private Wealth)',
    url: 'https://foliyo.ai/guides/mf-taxation/international-fund-tax/',
    type: 'guide',
    authority: 'secondary',
    published: '2026-10-11',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      "AY 2026-27: a 'Specified Mutual Fund' (Sec 50AA, renumbered Sec 76 in the Income-tax Act 2025) is now a DEBT-based test — a fund that invests >65% of proceeds in debt/money-market instruments (or >=65% in such a fund), measured on the annual average of daily closing figures; it no longer means 'every fund that lacks the domestic-equity threshold'",
      'An international equity FoF or India-listed int\'l equity ETF is NOT automatically a Specified MF just because it owns no Indian equity; if it fails the debt test, its units can become long-term after 24 months (unlisted) or 12 months (listed)',
      'For transfers on or after 23 Jul 2024, that LTCG is taxed at 12.5% WITHOUT indexation and with NO Rs 1.25L pool (the 112A pool applies only to equity-oriented funds) — separate from the 112A/111A equity regime that requires >65% domestic equity',
      'Gains on units that DO meet the Sec 50AA specified-fund definition are deemed SHORT-TERM and taxed at the slab rate regardless of holding period',
      'Income-tax Act 2025 section mapping: 111A->196, 112->197, 112A->198, 50AA->76 (effective 1 Apr 2026; the 1961 numbers are still used informally)',
      'GIFT City (IFSC) outbound funds: several schemes pay tax at the FUND level and reflect it in a post-tax NAV, so the resident investor generally has no separate capital-gains computation — but this must be confirmed in each scheme\'s offer document'
    ],
    limitations:
      'The "post-tax NAV, no investor-side CG" position for GIFT City schemes conflicts with the foreign-asset route (12.5% LTCG + Schedule FA) described in other 2026 guides; the offer document is the tie-breaker. The 50AA debt-test reclassification is a 2026 position and can shift with a later Finance Act.',
  },
  {
    id: 'src-gift-city-live-funds-2026',
    title:
      'GIFT City Global Index Funds 2026: the IFSCA-regulated route that stays open under the personal LRS while domestic int\'l FoFs are frozen, the live fund list, and the fresh-onboarding (FCA + KYC) requirement',
    publisher: 'Deepak Wealth / DG Deepak Gokul, CWM',
    url: 'https://deepakwealth.com/gift-city-global-index-funds-india-guide/',
    type: 'guide',
    authority: 'secondary',
    published: '2026-07-09',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Regulator is IFSCA (IFSCA Act 2019), a separate statutory regulator from SEBI; IFSCA-registered GIFT City funds are excluded from the SEBI USD 7B overseas MF ceiling, which is why the route stays open while domestic int\'l FoFs are frozen',
      'LRS: a resident individual can remit up to USD 250,000 per financial year; TCS is 20% on the amount above Rs 10L of total LRS remittance in the year (fully creditable against income tax at filing; reduced to 2% for education/medical/tour from 1 Apr 2026)',
      'GIFT City gains treated as foreign assets: LTCG (>24 months) 12.5% without indexation, STCG at the slab rate, and Schedule FA disclosure is mandatory every year while held',
      'Live retail GIFT City schemes in 2026: PPFAS IFSC S&P 500 FoF, PPFAS IFSC Nasdaq 100 FoF, DSP GIFT City Global Equity Fund, Tata GIFT City Fund; HDFC AM has Developed Markets and Emerging Markets passive funds in the pipeline',
      'Fresh onboarding: you need a Foreign Currency Account (FCA) at a GIFT City IFSC Banking Unit (HDFC / ICICI / Axis) plus fresh KYC on the fund house\'s dedicated portal; your existing domestic MF folio / demat KYC does NOT carry over'
    ],
    limitations:
      'Two tax-treatment positions coexist for GIFT City funds (fund-level post-tax NAV vs Indian-side 12.5% LTCG + Schedule FA); the live-fund list changes as more AMCs launch IFSCA-registered vehicles — confirm the current list and each scheme\'s tax posture with the fund house / a CA before remitting.',
  },
];
let srcAdded = 0;
for (const ns of newSources) {
  if (!srcs.some((s) => s.id === ns.id)) {
    srcs.push(ns);
    srcAdded++;
  }
}
if (srcAdded > 0) {
  fs.writeFileSync('content-registry/sources.json', JSON.stringify(sf, null, 2) + '\n');
  console.log('sources.json: added', srcAdded, '->', srcs.length);
} else {
  console.log('sources.json: no change, total', srcs.length);
}

// 2) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'international-gift-city-ifsc-tax-timing-deep-dive',
  file: 'src/content/international/international-gift-city-ifsc-tax-timing-deep-dive.mdx',
  title:
    'GIFT City IFSC Funds: The Tax-Treatment Split, the TCS Reservation Math, and Which Schemes Are Live (FY 2026-27)',
  category: 'international',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'gift-city',
    'ifsc',
    'ifscf',
    'fof',
    'international',
    's-p-500',
    'nasdaq-100',
    'lrs',
    'tcs',
    'section-50aa',
    'act-2025',
    'indian-side-tax',
    'fund-level-tax',
    'schedule-fa',
    '24-month-ltcg',
  ],
  sources: [
    'src-intl-fof-cap-2026',
    'src-lrs-tcs-sc-2026',
    'src-intl-fof-treatment-ay2026-27',
    'src-gift-city-live-funds-2026',
  ],
  related: [
    'international-fof-gift-city-lrs',
    'international-investing-lrs',
    'tax-capital-gains-rollover-54-54f-54ec',
    'pf-capital-ladder-10l-to-1cr',
  ],
  books: ['book-wealth-beyond-10l'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed', newArticle.id, '->', arts.length);
}

// 3) books.json — add chapter to book-wealth-beyond-10l
const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
const book = books.find((b) => b.id === 'book-wealth-beyond-10l');
if (book) {
  const ch = book.chapters ?? (book.chapters = []);
  if (!ch.includes(newArticle.id)) {
    ch.push(newArticle.id);
    fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2) + '\n');
    console.log('books.json: book-wealth-beyond-10l now', ch.length, 'chapters');
  } else {
    console.log('books.json: chapter already present, total', ch.length);
  }
}

// 4) update-log.json
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-gift-city-tax-treatment-split-fy2026-27',
  topic:
    'GIFT City IFSC fund tax treatment: two positions exist in FY 2026-27 (Indian-side 12.5% LTCG/slab STCG + Schedule FA vs fund-level post-tax NAV with no separate investor-side CG compute); the offer document decides. Plus the AY 2026-27 Section 50AA debt-test redefinition (non-specified int\'l FoFs can now get 12.5% LTCG, not forever-slab), the ₹10L TCS-free LRS threshold, the 20% investment-remittance TCS, and the live GIFT City fund list (PPFAS S&P 500 FoF, PPFAS Nasdaq 100 FoF, DSP GIFT City Global Equity Fund, Tata GIFT City Fund).',
  article: 'international-gift-city-ifsc-tax-timing-deep-dive',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-intl-fof-cap-2026',
    'src-lrs-tcs-sc-2026',
    'src-intl-fof-treatment-ay2026-27',
    'src-gift-city-live-funds-2026',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
}
