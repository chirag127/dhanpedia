import fs from 'node:fs';

// No new source: the Black Money Act 2015 counterfactual structure
// (Section 40 30% tax, Section 41 3x penalty = 90% of value, Section 43/44
// flat Rs 10L per-year Schedule FA penalty) already lives in
// src-us-stock-tax-india-2026; the Finance Act 2026 Rs 20L non-immovable
// threshold and the slab context are anchored in src-it-slab-fy2026-27.

// 1) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'tax-black-money-act-exposure',
  file: 'src/content/taxation/tax-black-money-act-exposure.mdx',
  title:
    'Black Money Act Exposure: What Happens if You Miss FAST-DS *and* Schedule FA (FY 2026-27)',
  category: 'taxation',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'black-money-act',
    'bma-2015',
    'section-40',
    'section-41',
    'section-43',
    'section-44',
    'schedule-fa',
    'undisclosed-foreign-asset',
    'penalty',
    '120-percent',
    'fast-ds',
    'counterfactual',
    'foreign-asset',
    'finance-act-2026',
  ],
  sources: ['src-us-stock-tax-india-2026', 'src-it-slab-fy2026-27'],
  related: [
    'tax-fastds-2026-declaration',
    'tax-direct-lrs-us-equity-filing-walkthrough',
    'international-investing-lrs',
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

// 2) books.json - add chapter to book-complete-indian-investor
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

// 3) update-log.json
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-black-money-act-counterfactual-fy2026-27',
  topic:
    'Black Money Act 2015 counterfactual exposure for an undisclosed foreign asset that is neither FAST-DS-regularised nor Schedule-FA-disclosed: Section 40 (30% tax on the value) + Section 41 (a penalty of 3x the tax = 90% of value, a 120% total) + Sections 43/44 (a flat Rs 10,00,000 per defaulting assessment year for the Schedule FA omission), softened ONLY for a non-immovable asset at or under the Finance Act 2026 Rs 20L threshold (the flat penalty is waived, the 120% is not). The per-year flat-penalty stacking makes time the enemy; the ITAT Special Bench (Mr. Vinil Venugopal & Mrs. Ranjeeta Vinil) read the Section 43 "may" word as directory, not mandatory. This counterfactual is the "do nothing" column the FAST-DS 2026 defined-cost routes (60% Category A / flat Rs 1L Category B) exist to replace.',
  article: 'tax-black-money-act-exposure',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: ['src-us-stock-tax-india-2026', 'src-it-slab-fy2026-27'],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
}
