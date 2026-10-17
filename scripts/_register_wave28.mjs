import fs from 'node:fs';

// 1) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'pf-capital-inflow-migration',
  file: 'src/content/personal-finance/pf-capital-inflow-migration.mdx',
  title:
    'The Capital-Inflow Migration Planner: When to Move Each New Rupee Into the Next Rung (SIF \u2192 PMS \u2192 AIF)',
  category: 'personal-finance',
  status: 'published',
  difficulty: 'intermediate',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'capital-inflow',
    'migration',
    'sif',
    'pms',
    'prim',
    'aif',
    'ladder',
    'deployment',
    'scheduling',
    '10-lakh',
    'esop',
    'promotion',
    'inheritance',
    'portfolio',
    'roadmap',
  ],
  sources: [
    'src-sebi-sif-2026',
    'src-pms-aif-fees-2026',
    'src-aif-categories-2026',
    'src-it-slab-fy2026-27',
  ],
  related: [
    'pf-capital-ladder-10l-to-1cr',
    'pf-wealth-plan-10-lakh',
    'alternatives-hnw-pms-aif-sif-selection',
    'tax-esop-vesting-tax-walkthrough',
    'tax-surcharge-cess-high-income',
  ],
  books: ['book-complete-indian-investor', 'book-wealth-beyond-10l'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed', newArticle.id, '->', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// 2) books.json - add chapter to both books
const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
let bookChanges = 0;
for (const bid of ['book-complete-indian-investor', 'book-wealth-beyond-10l']) {
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

// 3) update-log.json
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-capital-inflow-migration-scheduling-fy2026-27',
  topic:
    'Capital-inflow migration scheduling: a sequence of discrete future capital events (promotion, ESOP exit, inheritance) landing at known months, and the deployable-margin rule at each SEBI rung that opens (SIF Rs 10L, PMS/PRIM Rs 25L, standard PMS Rs 50L, AIF Rs 1Cr). The planner treats a discrete inflow that lands at a rung boundary as the unlocking event for that rung; the two honest limits are the PMS/PRIM 1 Apr 2027 commencement date (the Rs 25L MF-only route is not purchasable before then) and the after-tax fee-crossover (a threshold crossing is permission, not mandate - the low-cost build-up can still beat a PMS on fees).',
  article: 'pf-capital-inflow-migration',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-sebi-sif-2026',
    'src-pms-aif-fees-2026',
    'src-aif-categories-2026',
    'src-it-slab-fy2026-27',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
} else {
  console.log('update-log.json: already present, total', entries.length);
}
