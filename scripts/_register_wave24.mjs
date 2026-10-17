import fs from 'node:fs';

// 1) sources.json — add the dedicated US-stock-tax / FAST-DS source
const sf = JSON.parse(fs.readFileSync('content-registry/sources.json', 'utf8'));
const srcs = Array.isArray(sf) ? sf : sf.sources;
const newSource = {
  id: 'src-us-stock-tax-india-2026',
  title:
    "US stocks taxed in India 2026: the 25% individual dividend withholding (W-8BEN) vs the 30% backup (and the 15% corporate-with-voting-stock figure that is NOT the individual rate), the 24-month / 12.5% no-pool foreign-security CG treatment, the Form 67 FTC cap, Schedule FA no-threshold disclosure, and the FAST-DS 2026 small-taxpayer scheme (Finance Act 2026 Ch. IV, ~15 Aug to 31 Dec 2026)",
  publisher: 'Vedanta / WINvesta / Vested / Filewise / Upstox 2026 investor guides + KPMG / CBDT / NDTV FAST-DS 2026 coverage + Income-tax Act 2025 renumbered text',
  url: 'https://vested.blog/posts/how-us-stocks-are-taxed-in-india',
  type: 'aggregator',
  authority: 'secondary',
  published: '2026-08-01',
  verified: '2026-10-18',
  lastVerified: '2026-10-18',
  claims: [
    "A US dividend paid to an individual Indian resident is subject to 25% US withholding when a Form W-8BEN is on file (the individual US-India treaty rate); without a W-8BEN the 30% backup rate applies; the widely-quoted 15% figure is the corporate-holder-with-substantial-voting-stock treaty rate, NOT the individual rate (cambridgewealth / winvesta)",
    "The dividend is also taxable in India (worldwide income) at the slab rate; the 25% US withholding is credited via Form 67 / Schedule FSI, capped at the lesser of the India dividend tax and the US tax actually paid",
    "US shares are unlisted foreign securities: LTCG after 24 months at 12.5% without indexation and with NO Rs 1.25L pool (the 112A pool is Indian-listed-equity only); STCG (<=24 months) at the slab rate (vested / winvesta / filewise / upstox)",
    "Schedule FA disclosure of a US brokerage position is mandatory every year while held, with no minimum threshold; foreign-source income (dividends / CG) is reported in Schedule FSI",
    "The LRS investment remittance that funds the US purchase attracts 20% TCS above the Rs 10L aggregate threshold (recoverable at ITR); education / medical / tour TCS is 2% from 1 Apr 2026",
    "FAST-DS 2026 = Foreign Assets of Small Taxpayers - Disclosure Scheme 2026, Finance Act 2026 Chapter IV (sections 130-144), a one-time window ~15 Aug to 31 Dec 2026; Category A = undisclosed foreign assets/income up to Rs 1 cr (a specified tax + an equal additional amount), Category B = up to Rs 5 cr for assets from disclosed income / non-resident period (a flat Rs 1L fee with immunity); it is the amnesty layer for UNDISCLOSED assets, distinct from a normal Schedule FA filing (KPMG flash news + CBDT FAQs + NDTV Profit / NationPath)"
  ],
  limitations:
    "The 25% individual dividend-withholding figure is the current US-India treaty position per the cited 2026 guides and can move with a treaty renewal or an IRS change; confirm the specific W-8BEN validity for the withholding year. The FAST-DS window dates (15 Aug to 31 Dec 2026) are the notified dates and the scheme is one-time - it cannot be reused. The Rs 10L LRS TCS threshold is the post-Finance-Act-2025 figure. All figures are planning inputs; reconcile with Form 67 / Schedule FSI / the ITR e-file and a CA before acting.",
};
if (!srcs.some((s) => s.id === newSource.id)) {
  srcs.push(newSource);
  fs.writeFileSync('content-registry/sources.json', JSON.stringify(sf, null, 2) + '\n');
  console.log('sources.json: added src-us-stock-tax-india-2026 ->', srcs.length);
} else {
  console.log('sources.json: already present, total', srcs.length);
}

// 2) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'tax-direct-lrs-us-equity-filing-walkthrough',
  file: 'src/content/taxation/tax-direct-lrs-us-equity-filing-walkthrough.mdx',
  title:
    'Direct LRS US-Equity Filing Walkthrough: Dividend FTC, 12.5% LTCG, TCS & Schedule FA (FY 2026-27)',
  category: 'taxation',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'lrs',
    'us-stocks',
    'us-equity',
    'foreign',
    'dividend',
    'withholding',
    'w8ben',
    'form-67',
    'foreign-tax-credit',
    '12.5%',
    'lucg',
    'stcg',
    'schedule-fa',
    'schedule-fsi',
    'tcs',
    'fast-ds',
    'direct-lrs',
    'itr-2',
  ],
  sources: [
    'src-lrs-tcs-sc-2026',
    'src-it-slab-fy2026-27',
    'src-us-stock-tax-india-2026',
  ],
  related: [
    'international-investing-lrs',
    'international-gift-city-live-scheme-comparison',
    'international-dtaa-country-rate-reference',
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

// 3) books.json — add chapter to book-complete-indian-investor
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
  id: 'ul-direct-lrs-us-equity-filing-fy2026-27',
  topic:
    'Direct LRS US-equity filing layers (FY 2026-27): the 5-layer structure (1 dividend at slab + the 25% individual US dividend withholding via W-8BEN credited through Form 67, 2 the foreign-unlisted-security CG at 12.5% no-indexation LTCG after 24 months with NO pool or slab STCG, 3 the 20% TCS on the LRS investment remittance above the Rs 10L threshold as a recoverable credit, 4 Schedule FA every year with no minimum threshold, 5 the FAST-DS 2026 small-taxpayer window ~15 Aug to 31 Dec 2026 as the separate amnesty layer).',
  article: 'tax-direct-lrs-us-equity-filing-walkthrough',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-lrs-tcs-sc-2026',
    'src-it-slab-fy2026-27',
    'src-us-stock-tax-india-2026',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
}
