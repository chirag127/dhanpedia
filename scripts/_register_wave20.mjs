import fs from 'node:fs';

const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;

// 1) article entry
const newArticle = {
  id: 'pf-capital-ladder-10l-to-1cr',
  file: 'src/content/personal-finance/pf-capital-ladder-10l-to-1cr.mdx',
  title:
    'The 10-Lakh Capital Ladder: The Rung-by-Rung Roadmap from ₹10L to ₹1Cr+ (FY 2026-27)',
  category: 'personal-finance',
  status: 'published',
  difficulty: 'intermediate',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'capital-ladder',
    'sif',
    'pms',
    'prim',
    'aif',
    'hni',
    'sebi-2026',
    'surcharge',
    '10-lakh',
    'corpus',
    'roadmap',
    'allocation',
  ],
  sources: [
    'src-sebi-sif-2026',
    'src-pms-aif-fees-2026',
    'src-aif-categories-2026',
    'src-surcharge-cess-fy2026-27',
  ],
  related: [
    'pf-wealth-plan-10-lakh',
    'alternatives-hnw-pms-aif-sif-selection',
    'alternatives-sif-specialized-funds',
    'alternatives-pms-aif-private',
    'tax-surcharge-cess-high-income',
    'portfolio-construction-rebalancing',
  ],
  books: ['book-complete-indian-investor', 'book-wealth-beyond-10l'],
};

if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed pf-capital-ladder-10l-to-1cr, total', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// 2) book chapters (plain-string IDs)
const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
const targetBookIds = ['book-complete-indian-investor', 'book-wealth-beyond-10l'];
let bookChanges = 0;
for (const bid of targetBookIds) {
  const book = books.find((b) => b.id === bid);
  if (!book) {
    console.log('books.json: no such book', bid);
    continue;
  }
  const chKey = book.chapters ? 'chapters' : 'ids';
  if (!book[chKey]) book.chapters = [];
  const ch = book[chKey];
  if (!ch.includes(newArticle.id)) {
    ch.push(newArticle.id);
    bookChanges++;
  }
  console.log('books.json:', bid, 'now', ch.length, 'chapters');
}
if (bookChanges > 0) {
  fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2) + '\n');
  console.log('books.json: +', bookChanges, 'chapter(s)');
} else {
  console.log('books.json: no change');
}

// 3) update-log entry
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-capital-ladder-rungs-fy2026-27',
  topic:
    'Capital ladder: the four SEBI rung thresholds that unlock SIF (Rs 10L, PAN-level, MF Regs 2026, 1 Apr 2026), PMS/PRIM + AIF-employee (Rs 25L, PM Regs 2026, 1 Apr 2027), standard PMS (Rs 50L, also the 54EC cap), AIF (Rs 1Cr HNI); plus the FY 2026-27 new-regime surcharge tiers (10% > 50L, 15% > 1Cr, 25% cap > 2Cr).',
  article: 'pf-capital-ladder-10l-to-1cr',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-sebi-sif-2026',
    'src-pms-aif-fees-2026',
    'src-aif-categories-2026',
    'src-surcharge-cess-fy2026-27',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed ul-capital-ladder-rungs-fy2026-27, total', entries.length);
} else {
  console.log('update-log.json: already present, total', entries.length);
}
