import fs from 'node:fs';

// 1) sources.json - add the ODI route source
const sf = JSON.parse(fs.readFileSync('content-registry/sources.json', 'utf8'));
const srcs = Array.isArray(sf) ? sf : sf.sources;
const newSource = {
  id: 'src-odi-rules-2026',
  title:
    "ODI (Overseas Direct Investment) route 2026: the 26 May 2026 amendment raising the entity automatic-route limit from 300% to 400% of net worth, the USD 1B-per-FY prior-approval trigger, the resident-individual LRS USD 250k/FY equity-only ODI limit, the ODI-vs-OPI definition (unlisted equity / 10%+ listed / control vs a listed under-10% no-control OPI position), and the Form FC-ODI post-fact filing + ~Rs 7,500 late-submission fee",
  publisher: 'KAMRIT 26 May 2026 omnibus-route update + Resolut Partners / E-Tax Prime / Beacon Filing 2026 ODI coverage + Khaitan & Co + the RBI OI Rules 2022 ODI/OPI definition + the RBI LRS FAQ',
  url: 'https://kamrit.com/blog/fema-overseas-investment-omnibus-route-may-2026',
  type: 'aggregator',
  authority: 'secondary',
  published: '2026-05-26',
  verified: '2026-10-18',
  lastVerified: '2026-10-18',
  claims: [
    "The 26 May 2026 RBI amendment to the Foreign Exchange Management (Overseas Investment) Regulations, 2022 raises the omnibus/automatic-route ODI limit for an Indian entity from 300% to 400% of net worth (last audited balance sheet)",
    "A financial commitment above USD 1 billion in a financial year moves to the prior-RBI-approval route, even within the 400% limit (Master Direction on ODI para 5)",
    "A resident individual may make an ODI only in equity capital (no loans / guarantees to a foreign entity), only within the LRS USD 250,000/FY limit combined with all other LRS remittances, through the AD bank",
    "ODI (per the RBI OI Rules 2022 definition) means: acquisition of unlisted equity capital of a foreign entity, OR subscription as part of its memorandum, OR investment in 10% or more of the paid-up equity of a listed foreign entity, OR investment with control where the stake is under 10%; a listed under-10% no-control position is OPI (the 50%-of-net-worth route), not ODI",
    "Entity ODI is post-fact reporting via Form FC-ODI to the AD bank; a late filing attracts a late-submission fee (about Rs 7,500 and rising, scaled to the delay)",
  ],
  limitations:
    "The 400% multiple is the 26 May 2026 position and a later notification can move it back to 300% or forward; the USD 1B approval trigger and the Form FC-ODI late-fee figures are case-specific and can change with a Master Direction. An individual ODI is equity-only by law - a personal loan / guarantee to a foreign entity is not permitted, so this source does not price that case. Confirm the operative multiple and fee against the current OI Rules 2022 + Master Direction on ODI before remitting.",
};
if (!srcs.some((s) => s.id === newSource.id)) {
  srcs.push(newSource);
  fs.writeFileSync('content-registry/sources.json', JSON.stringify(sf, null, 2) + '\n');
  console.log('sources.json: added src-odi-rules-2026 ->', srcs.length);
} else {
  console.log('sources.json: already present, total', srcs.length);
}

// 2) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'international-odi-route-eligibility',
  file: 'src/content/international/international-odi-route-eligibility.mdx',
  title:
    'ODI Route Eligibility: Investing INTO a Foreign Entity (400% Net Worth Entity / LRS USD 250k Individual, FY 2026-27)',
  category: 'international',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'odi',
    'overseas-direct-investment',
    'fema',
    '400-percent-net-worth',
    'lrs',
    'usd-250k',
    'form-fc-odi',
    'foreign-startup',
    'control-stake',
    'opi',
    'auto-route',
    'rbi',
    'may-2026-amendment',
  ],
  sources: [
    'src-odi-rules-2026',
    'src-fema-sec13-compound-2026',
    'src-lrs-tcs-sc-2026',
  ],
  related: [
    'tax-fema-exchange-control-exposure',
    'international-gift-city-live-scheme-comparison',
    'international-investing-lrs',
    'alternatives-pre-ipo-unlisted-equity-hni',
    'pf-capital-inflow-migration',
  ],
  books: ['book-wealth-beyond-10l'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed international-odi-route-eligibility ->', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// 3) books.json - add chapter to book-wealth-beyond-10l
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
  id: 'ul-odi-400-percent-limit-fy2026-27',
  topic:
    'ODI (Overseas Direct Investment) route eligibility (FY 2026-27): the 26 May 2026 amendment raising the entity automatic-route limit from 300% to 400% of net worth, the USD 1B-per-FY prior-approval trigger, the resident-individual LRS USD 250,000/FY equity-only ODI limit, the ODI-vs-OPI definition (unlisted equity / 10%+ listed / control = ODI; a listed under-10% no-control position = OPI, not ODI), and the Form FC-ODI post-fact filing with the ~Rs 7,500 late-submission fee. The ODI route is the outbound-investment lane that is a different mechanism from buying a GIFT City fund or a personal LRS remittance; a breached ODI limit becomes a FEMA Section 13 3x / Section 15 compounding exposure (cross-referenced to tax-fema-exchange-control-exposure).',
  article: 'international-odi-route-eligibility',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-odi-rules-2026',
    'src-fema-sec13-compound-2026',
    'src-lrs-tcs-sc-2026',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
} else {
  console.log('update-log.json: already present, total', entries.length);
}
