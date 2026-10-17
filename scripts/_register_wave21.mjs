import fs from 'node:fs';

const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;

const newArticle = {
  id: 'tax-54ec-tranche-tracker',
  file: 'src/content/taxation/tax-54ec-tranche-tracker.mdx',
  title:
    'The 54EC Tranche Tracker: The 6-Month Window, 5-Year Lock-In & the Early-Redemption Reversal (FY 2026-27)',
  category: 'taxation',
  status: 'published',
  difficulty: 'intermediate',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    '54ec',
    'capital-gains',
    'lucg',
    'bond',
    'rec',
    'pfc',
    'hudco',
    'irfc',
    'nhai',
    'lock-in',
    'rollover',
    'reversal',
    'exemption',
    'infrastructure',
    '50-lakh',
    'tranche-tracker',
  ],
  sources: ['src-54-rollover-fy2026-27', 'src-it-slab-fy2026-27'],
  related: [
    'tax-capital-gains-rollover-54-54f-54ec',
    'tax-india-investor-complete',
    'real-estate-reit-invit',
    'fixed-income-bonds-credit',
    'pf-capital-ladder-10l-to-1cr',
  ],
  books: ['book-indian-taxation'],
};

if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed tax-54ec-tranche-tracker, total', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// Book chapter: book-indian-taxation
const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
const book = books.find((b) => b.id === 'book-indian-taxation');
if (book) {
  const chKey = book.chapters ? 'chapters' : 'ids';
  if (!book[chKey]) book.chapters = [];
  const ch = book[chKey];
  if (!ch.includes(newArticle.id)) {
    ch.push(newArticle.id);
    fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2) + '\n');
    console.log('books.json: book-indian-taxation now', ch.length, 'chapters');
  } else {
    console.log('books.json: already present in book-indian-taxation,', ch.length, 'chapters');
  }
} else {
  console.log('books.json: book-indian-taxation not found');
}

// Update-log entry
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-54ec-tranche-reversal-fy2026-27',
  topic:
    '54EC operational structure: the 6-month investment window, the 5-year lock-in, the Rs 50L reinvestment cap, the 12.5% no-indexation LTCG base, the REC/PFC/HUDCO/IRFC notified-bond list with ~6.5-7.5% coupons (slab-taxed), and the early-redemption reversal (exemption withdrawn, original gain re-taxed at 12.5%).',
  article: 'tax-54ec-tranche-tracker',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: ['src-54-rollover-fy2026-27', 'src-it-slab-fy2026-27'],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed ul-54ec-tranche-reversal-fy2026-27, total', entries.length);
} else {
  console.log('update-log.json: already present, total', entries.length);
}
