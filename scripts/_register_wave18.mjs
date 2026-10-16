import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const write = (rel, obj) =>
  fs.writeFileSync(path.join(root, rel), JSON.stringify(obj, null, 2) + '\n');

// ---- 1) sources.json  (top-level bare ARRAY) ----
const sources = read('content-registry/sources.json');
if (!sources.some((x) => x.id === 'src-dtaa-country-rates-2026')) {
  sources.push({
    id: 'src-dtaa-country-rates-2026',
    title:
      'India DTAA corridor treaty rates (dividends / interest / royalties / FTS) FY 2026-27 - the country-by-country reference the NRI article leaves out: the domestic Act fallback (30% NRO interest / rent, 20% dividends, 20% royalty / FTS) vs the typical corridor treaty rate (DE/NL/JP/FR 10%; US/UK/AU/CA/SG ~15%; UAE 12.5% interest / 10% dividends, exemption-method), the exemption vs credit relief methods, the Sec 90/90A + 159(4) lower-rate rule once the NRI supplies TRC + Form 41 (formerly 10F), and the capital-gains caveat (most treaties do NOT reduce tax on the sale of Indian shares / property)',
    publisher: 'Income-tax Department country-wise withholding chart + DTAA rates chart (97 treaties, per-article)',
    url: 'https://crosscheckai.in/dtaa/rates',
    type: 'aggregator',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Domestic Act fallback before surcharge + 4% cess: 30% on NRO interest / rent, 20% on dividends, 20% on royalties / FTS',
      'Typical corridor treaty rates: Germany / Netherlands / Japan / France 10%; US / UK / Australia / Canada / Singapore ~15%; UAE 12.5% interest / 10% dividends (exemption-method, no home-country income tax)',
      'Relief method split: exemption (UAE / Saudi Arabia / Kuwait - home side exempts) vs credit (US / UK / Germany / Singapore / Australia / Canada - home side credits the India-side tax, claimed via Form 67 / Sec 91, capped at the lesser of India-paid and home tax)',
      'Treaty override: Sec 90 (DTAA) / 90A (exemption) + 159(4) - the lower of the Act rate and the treaty rate applies only when the non-resident supplies the Tax Residency Certificate + Form 41 (the renamed Form 10F) to the payer',
      'Capital-gains caveat: most DTAAs do NOT reduce the tax on the sale of Indian shares / property - India keeps its taxing right (111A STCG / 112A LTCG equity; 12.5% no-indexation property); treaty relief matters on dividends / interest / royalties / FTS, not on realising gains',
      'Surcharge and the 4% Health & Education cess still stack onto the (treaty) base rate, so the all-in effective rate is higher than the headline treaty rate',
    ],
    notes:
      'Rates are the typical corridor headline; the exact figure depends on the income type and any holding condition - confirm the treaty text / a CA before acting. Cross-corroborated by the SBI DTAA annexure withholding table and incometaxindia.gov.in country-wise chart (403-blocked to auto-read, cited from its search snippet). The 10/15/12.5 spread and the exemption-vs-credit split are what the dtaaReliefFY27() calculator and the dtaa-rate-reference corridor presets model.',
  });
}
write('content-registry/sources.json', sources);

// ---- 2) articles.json  (key: articles) ----
const articlesFile = read('content-registry/articles.json');
const arts = articlesFile.articles ?? articlesFile;
if (!arts.some((x) => x.id === 'international-dtaa-country-rate-reference')) {
  arts.push({
    id: 'international-dtaa-country-rate-reference',
    title:
      'DTAA Country-Rate Reference: Which Treaty Rate Applies to Your India-Source Income (FY 2026-27)',
    category: 'international',
    difficulty: 'advanced',
    status: 'published',
    tags: [
      'dtaa', 'nri', 'treaty', 'withholding', 'tds', 'section-90', 'section-91',
      'trc', 'form-41', 'form-10f', 'form-67', 'dividends', 'interest',
      'royalties', 'foreign-tax-credit',
    ],
    summary:
      'The treaty-rate reference the NRI article deliberately left out: India\'s 90+ DTAA corridors side-by-side (dividends / interest / royalties / FTS) against the domestic Act rate, the two relief methods (exemption vs credit), how the lower rate wins (Sec 90 / 90A / 159(4)), the TRC + Form 41 / 10F + Form 67 claim sequence, and why most treaties do NOT reduce capital gains.',
    file: 'src/content/international/international-dtaa-country-rate-reference.mdx',
    sources: ['src-dtaa-country-rates-2026', 'src-nri-tax-tds-dtaa-2026', 'src-it-slab-fy2026-27'],
    related: [
      'international-nri-tax-residency-tds-dtaa',
      'international-investing-lrs',
      'international-fof-gift-city-lrs',
      'tax-surcharge-cess-high-income',
    ],
    books: ['book-complete-indian-investor'],
  });
}
write('content-registry/articles.json', articlesFile);

// ---- 3) books.json  (key: books; each book has a chapters[]) ----
const booksFile = read('content-registry/books.json');
const books = booksFile.books ?? booksFile;
const book = books.find((x) => x.id === 'book-complete-indian-investor');
const chKey = book.chapters ? 'chapters' : 'artifactChapters';
const chArr = book[chKey];
if (!chArr.includes('international-dtaa-country-rate-reference')) {
  chArr.push('international-dtaa-country-rate-reference');
}
write('content-registry/books.json', booksFile);

// ---- 4) update-log.json  (key: entries) ----
const ulFile = read('content-registry/update-log.json');
const ul = ulFile.entries ?? ulFile;
if (!ul.some((x) => x.id === 'ul-dtaa-corridor-rates-fy2026-27')) {
  ul.push({
    id: 'ul-dtaa-corridor-rates-fy2026-27',
    claim:
      'Typical DTAA corridor rates FY 2026-27: DE/NL/JP/FR 10%, US/UK/AU/CA/SG ~15%, UAE 12.5% interest / 10% dividends (exemption method) vs domestic fallback 30% interest / 20% dividends; most treaties do NOT reduce capital-gains tax on Indian shares / property; Form 10F renamed Form 41 under the Income-tax Act 2025; surcharge + 4% cess still ride on the treaty base rate',
    source: 'src-dtaa-country-rates-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes:
      'Corridor headline rates are stable but specific treaty texts (holding conditions, MLI Principal Purpose Test, the exact 10%/15% dividend threshold) shift at each treaty ratification - re-verify the corridor table against the Income-tax Department country-wise withholding chart at review time. The 54EC/12.5% no-indexation base and the 112A threshold also ride the Finance Act cycle.',
  });
}
write('content-registry/update-log.json', ulFile);

console.log('registry updated.');
console.log(
  'totals ->',
  'articles:',
  (read('content-registry/articles.json').articles ?? read('content-registry/articles.json')).length,
  '| sources:',
  read('content-registry/sources.json').length,
  '| update-log:',
  (read('content-registry/update-log.json').entries ?? read('content-registry/update-log.json')).length,
  '| book-complete-indian-investor chapters:',
  chArr.length,
);
