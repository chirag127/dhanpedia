import fs from 'node:fs';

// 1) articles.json - register the synthesis article
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'pf-corpus-allocation-blender',
  file: 'src/content/personal-finance/pf-corpus-allocation-blender.mdx',
  title:
    'The Corpus Allocation Blender: Where Does Your Next Rupee Go? (Sleeve Split + Blended After-Tax Return + Next Rung, FY 2026-27)',
  category: 'personal-finance',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  tags: [
    'corpus-allocation',
    'sleeve-mix',
    'sif',
    'pms',
    'aif',
    'odi',
    'next-rung',
    'after-tax-return',
    'front-load',
    'risk-grade',
    'synthesis',
    'allocation',
  ],
  sources: [
    'src-sebi-sif-2026',
    'src-pms-aif-fees-2026',
    'src-aif-categories-2026',
    'src-odi-rules-2026',
    'src-surcharge-cess-fy2026-27',
  ],
  related: [
    'pf-capital-ladder-10l-to-1cr',
    'pf-capital-inflow-migration',
    'alternatives-hnw-pms-aif-sif-selection',
    'international-odi-route-eligibility',
    'tax-surcharge-cess-high-income',
  ],
  books: ['book-wealth-beyond-10l'],
};
if (!arts.some((a) => a.id === newArticle.id)) {
  arts.push(newArticle);
  fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2) + '\n');
  console.log('articles.json: pushed pf-corpus-allocation-blender ->', arts.length);
} else {
  console.log('articles.json: already present, total', arts.length);
}

// 2) books.json - add the chapter to book-wealth-beyond-10l
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
} else {
  console.log('books.json: book-wealth-beyond-10l NOT FOUND');
}

// 3) update-log.json
const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const entries = ulf.entries ?? ulf;
const ulEntry = {
  id: 'ul-corpus-allocation-blender-fy2026-27',
  topic:
    'Corpus Allocation Blender (FY 2026-27): the synthesis/sizing layer that answers "I have this corpus at this risk grade - where does the next rupee go?" in one screen: the risk-grade sleeve mix (after dropping entity-only / international / SIF-gated sleeves and normalizing), which of the four professional avenues (SIF 10L / ODI ~20L individual proxy / PMS 50L / AIF 1Cr) are actually unlocked, the blended after-tax planning return (weight-average of the surviving sleeves), and the front-load fraction (corpus divided by the next-locked-avenue threshold) that parks the corpus-to-door slice in the low-cost build-up. All sleeve returns are after-tax planning figures (equity ~8.5%, sovereign debt ~5.5%, gold ~6%, international ~7.5%, professional alt ~8-9%), not forecasts; the professional-alt sleeve is entity-gated and SIF-10L-gated; the ODI gate is the individual LRS ~20L proxy (the entity 400%-of-net-worth route is a separate layer).',
  article: 'pf-corpus-allocation-blender',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-04-17',
  sourceIds: [
    'src-sebi-sif-2026',
    'src-pms-aif-fees-2026',
    'src-aif-categories-2026',
    'src-odi-rules-2026',
    'src-surcharge-cess-fy2026-27',
  ],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
} else {
  console.log('update-log.json: already present, total', entries.length);
}
