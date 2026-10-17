import fs from 'node:fs';

// 1) sources.json — add the scheme-terms source
const sf = JSON.parse(fs.readFileSync('content-registry/sources.json', 'utf8'));
const srcs = Array.isArray(sf) ? sf : sf.sources;
const newSource = {
  id: 'src-gift-city-scheme-terms-2026',
  title:
    "GIFT City IFSCA scheme terms 2026: PPFAS S&P 500 / Nasdaq 100 FoF (0.30% scheme TER, 0.35% / 0.60% all-in, USD 5,000 min, USD 500 top-up), DSP Global Equity Fund (up to ~1.75% all-in, USD 5,000 min), the DSP fund-level tax schedule (14.95% LTCG >24mo / 42.74% STCG, no investor-side CG, no TDS, no Schedule FA), and the live Edelweiss Greater China + Marcellus Global Equities + Tata India Dynamic Equity (inbound, USD 500) + HDFC pipeline list",
  publisher: 'IFSCA-registered scheme factsheets (PPFAS IFSC, DSP GIFT City) + DSP GIFT City knowledge hub + 2026 scheme-launch reports (Belong / ipomarket / univest / valueresearchonline / getbelong)',
  url: 'https://giftcity.dspim.com/knowledge-hub/gift-city-fund-taxation',
  type: 'aggregator',
  authority: 'secondary',
  published: '2026-07-30',
  verified: '2026-10-18',
  lastVerified: '2026-10-18',
  claims: [
    "PPFAS IFSC S&P 500 Fund of Fund (PPISP500): open-ended passive FoF; NFO allotment 20 Mar 2026; scheme TER 0.30% p.a.; all-in TER incl. underlying ETF ~0.35% p.a.; AUM ~USD 19.58Mn (Jul 2026); min ticket USD 5,000, top-up USD 500; USD-denominated, post-tax NAV",
    "PPFAS IFSC Nasdaq 100 Fund of Fund (PPINDX100): passive FoF; NFO May 2026; scheme TER 0.30% p.a.; all-in TER incl. underlying ETF ~0.60% p.a. (Regular ~0.60% all-in, 0.80% with distributor); AUM ~USD 9.4Mn (Sep 2026); min ticket USD 5,000, top-up USD 500",
    "DSP Global Equity Fund: actively managed open-ended global equity retail fund; launched 22 Sep 2025; min USD 5,000, top-up USD 500; AUM ~USD 56.3Mn (Sep 2026); TER up to ~1.75% p.a. (mgmt fee up to 1.5% + operating ~0.25%); DSP IFSC AUM ~USD 1.5Bn (Aug 2026)",
    "DSP fund-level tax schedule: GIFT City fund gains are taxed at the FUND level (the fund's PAN, not the investor's PAN); investors pay no capital-gains tax on redemption and no TDS is deducted on redemptions/distributions; reported fund-level rates 14.95% LTCG (>24 months) / 42.74% STCG; no Schedule FA required on this position",
    "Newly-launched 2026 live schemes: Edelweiss Greater China Fund (Mar 2026, actively managed regional), Marcellus Global Equities Fund (actively managed global); HDFC AM Developed Markets + Emerging Markets passive funds are in the pipeline (not yet live)",
    "Inbound GIFT City scheme: Tata India Dynamic Equity Fund (GIFT City) invests in DOMESTIC Indian equity, sold to NRIs/foreigners at a USD 500 retail ticket; total expense ratio ~2.5% p.a. (vs ~1.1% for the same strategy on mainland India); this is an INBOUND route, not an LRS-outbound global sleeve",
    "GIFT City outbound funds are excluded from the SEBI USD 7B MF industry overseas ceiling; the retail investor's binding limit is the personal LRS USD 250,000/FY"
  ],
  limitations:
    "The fund-level tax rates (14.95% / 42.74%) are DSP's published schedule and can differ house-to-house and move with a Finance Act; the specific scheme's offer document governs whether the fund-level or the Indian-side foreign-asset treatment applies. AUM / TER / launch figures are as-of the cited month and shift; confirm the current live list before remitting. The Edelweiss / Marcellus / HDFC-pipeline scheme terms are not all published uniformly — verify per scheme.",
};
if (!srcs.some((s) => s.id === newSource.id)) {
  srcs.push(newSource);
  fs.writeFileSync('content-registry/sources.json', JSON.stringify(sf, null, 2) + '\n');
  console.log('sources.json: added src-gift-city-scheme-terms-2026 ->', srcs.length);
} else {
  console.log('sources.json: already present, total', srcs.length);
}

// 2) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'international-gift-city-live-scheme-comparison',
  file: 'src/content/international/international-gift-city-live-scheme-comparison.mdx',
  title:
    'GIFT City Live Schemes & the GIFT-vs-Direct Route Decision (FY 2026-27)',
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
    'ppfas',
    'dsp',
    'edelweiss',
    'marcellus',
    'tata',
    'live-schemes',
    'expense-ratio',
    'fund-level-tax',
    'tax-treatment-resolution',
  ],
  sources: [
    'src-intl-fof-cap-2026',
    'src-lrs-tcs-sc-2026',
    'src-intl-fof-treatment-ay2026-27',
    'src-gift-city-live-funds-2026',
    'src-gift-city-scheme-terms-2026',
  ],
  related: [
    'international-gift-city-ifsc-tax-timing-deep-dive',
    'international-fof-gift-city-lrs',
    'international-investing-lrs',
    'pf-capital-ladder-10l-to-1cr',
    'alternatives-hnw-pms-aif-sif-selection',
  ],
  books: ['book-wealth-beyond-10l'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed', newArticle.id, '->', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
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
  id: 'ul-gift-city-live-schemes-route-decision-fy2026-27',
  topic:
    "GIFT City live scheme table (2026): PPFAS S&P 500 FoF (0.30% scheme / ~0.35% all-in, USD 5,000 min, ~USD 19.6Mn AUM, NFO 20 Mar 2026), PPFAS Nasdaq 100 FoF (0.30% / ~0.60% all-in, ~USD 9.4Mn AUM, May 2026), DSP Global Equity Fund (up to ~1.75% all-in, actively managed, ~USD 56.3Mn AUM, launched 22 Sep 2025), newly-launched Edelweiss Greater China + Marcellus Global Equities, HDFC Developed/Emerging Markets passive in pipeline; INBOUND distinction: Tata India Dynamic Equity (GIFT City) invests domestic equity at a USD 500 NRI ticket, ~2.5% all-in TER, NOT an outbound global sleeve. Resolves the Wave 22 tax-treatment conflict on the DSP primary anchor (fund-level 14.95% LTCG / 42.74% STCG, no investor-side CG, no TDS, no Schedule FA; offer document is the per-scheme tie-breaker).",
  article: 'international-gift-city-live-scheme-comparison',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-intl-fof-cap-2026',
    'src-lrs-tcs-sc-2026',
    'src-intl-fof-treatment-ay2026-27',
    'src-gift-city-live-funds-2026',
    'src-gift-city-scheme-terms-2026',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
}
