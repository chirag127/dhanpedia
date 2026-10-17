import fs from 'node:fs';

// 1) sources.json - add the FEMA Section 13 / compounding source
const sf = JSON.parse(fs.readFileSync('content-registry/sources.json', 'utf8'));
const srcs = Array.isArray(sf) ? sf : sf.sources;
const newSource = {
  id: 'src-fema-sec13-compound-2026',
  title:
    'FEMA 1999 exchange-control exposure: the Section 13(1) "up to 3x the sum involved" penalty (vs the FERA-era 9x that does not apply), the Section 15 compounding route via PRAVAAH (up to a Rs 5 cr contravention, the 2025 amendment capping certain compounding fees at Rs 2,00,000, and the non-compoundable Section 3(a) hawala exception), and the LRS USD 250k / NRO USD 1M / ODI individual limits that define the breaching "sum"',
  publisher: 'Beacon Filing / VirtualAuditor / APTaxLaw / KS&A 2026 FEMA penalty + compounding coverage + the RBI Master Direction on Compounding of Contraventions under FEMA, 1999 (April 2025 update) + Oquilia Research (NRO USD 1M / LRS USD 250k) + RBI LRS FAQ',
  url: 'https://www.beaconfiling.com/blog/fema-penalties-compounding-process',
  type: 'aggregator',
  authority: 'secondary',
  published: '2026-01-01',
  verified: '2026-10-18',
  lastVerified: '2026-10-18',
  claims: [
    "FEMA Section 13(1) levies a monetary penalty of up to THREE times the sum involved in the contravention (the current cap; the '9 times' figure was the FERA-era number and does not apply under FEMA 1999)",
    "FEMA Section 15 allows compounding (voluntary settlement) of a compoundable contravention by paying a fee to the RBI (up to a Rs 5 cr contravention) or the Enforcement Directorate (above Rs 5 cr), filed via the PRAVAAH portal; a Section 3(a) hawala offence is NOT compoundable",
    "A 2025 amendment to the FEMA compounding regime caps the fee for certain compounded contraventions at Rs 2,00,000; the applicable fee is set by the RBI per contravention, not a flat tariff",
    "The 'sum involved' in a Section 13 penalty is the breaching remittance, not the asset value: a resident LRS remittance (up to USD 250,000/FY, NRIs excluded), an NRO repatriation (up to USD 1,000,000/FY after Indian tax + Forms 15CA/15CB), or an ODI (individual equity-only, within the LRS limit; individuals cannot provide loans/guarantees)",
    "Tax regularisation (FAST-DS / Schedule FA) and exchange-control regularisation (FEMA compounding) are separate exercises administered by different authorities - the income-tax department vs the RBI / ED - and settling one does not close the other"
  ],
  limitations:
    'The 3x Section 13(1) penalty is a cap ("up to 3x"), the actual adjudicated penalty is case-specific, and the Section 15 compounding fee is set by the RBI per contravention (the Rs 2L is a 2025 cap for a class of contraventions, not a flat price). Confirm the specific contravention\'s compoundability and fee with the PRAVAAH process / a FEMA practitioner before acting. The LRS / NRO / ODI limits are the 2026 positions and can move with an RBI Master Direction.',
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
  id: 'tax-fema-exchange-control-exposure',
  file: 'src/content/taxation/tax-fema-exchange-control-exposure.mdx',
  title:
    'FEMA Exchange-Control Exposure: The 3x Penalty and the Side FAST-DS Does NOT Settle (FY 2026-27)',
  category: 'taxation',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'fema',
    'exchange-control',
    'section-13',
    'section-15',
    'compounding',
    'pravaah',
    'lrs',
    'nro',
    'odi',
    'hawala',
    '3x-penalty',
    'black-money-act',
    'fast-ds',
    'rbi',
    'repatriation',
  ],
  sources: [
    'src-fema-sec13-compound-2026',
    'src-us-stock-tax-india-2026',
    'src-lrs-tcs-sc-2026',
  ],
  related: [
    'tax-fastds-2026-declaration',
    'tax-black-money-act-exposure',
    'tax-direct-lrs-us-equity-filing-walkthrough',
    'international-nri-tax-residency-tds-dtaa',
    'international-investing-lrs',
  ],
  books: ['book-complete-indian-investor', 'book-indian-taxation'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed', newArticle.id, '->', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// 3) books.json - add chapter to both books
const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
let bookChanges = 0;
for (const bid of ['book-complete-indian-investor', 'book-indian-taxation']) {
  const book = books.find((b) => b.id === bid);
  if (!book) {
    console.log('books.json: no such book', bid);
    continue;
  }
  const ch = book.chapters ?? (book.chapters = []);
  if (!ch.includes(newArticle.id)) {
    ch.push(newArticle.id);
    bookChanges++;
    console.log('books.json:', bid, 'now', ch.length, 'chapters');
  } else {
    console.log('books.json:', bid, 'already present,', ch.length, 'chapters');
  }
}
if (bookChanges > 0) {
  fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2) + '\n');
}

// 4) update-log.json
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-fema-sec13-3x-exposure-fy2026-27',
  topic:
    'FEMA 1999 exchange-control exposure (the "side FAST-DS does NOT settle"): the Section 13(1) penalty of up to 3x the breaching sum (LRS over-limit / NRO over the USD 1M window / ODI over the individual limit) - NOT the FERA-era 9x - and the Section 15 compounding route via PRAVAAH (up to a Rs 5 cr contravention, the 2025 amendment capping certain compounding fees at Rs 2,00,000, and the non-compoundable Section 3(a) hawala exception). The structural point: tax / BMA regularisation and exchange-control regularisation are separate exercises before different authorities; a FAST-DS or Schedule-FA settlement does NOT close the FEMA ledger.',
  article: 'tax-fema-exchange-control-exposure',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-fema-sec13-compound-2026',
    'src-us-stock-tax-india-2026',
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
