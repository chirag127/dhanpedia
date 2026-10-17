import fs from 'node:fs';

// No new source: src-us-stock-tax-india-2026 already carries the FAST-DS 2026 claims
// (Finance Act 2026 Ch. IV §§130-144, 15 Aug / 16 Aug - 31 Dec 2026 window, 31 Mar 2026
// reference date, the two categories, the Form 1->2->3/4 sequence, BMA immunity + exclusions).

// 1) articles.json
const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
const newArticle = {
  id: 'tax-fastds-2026-declaration',
  file: 'src/content/taxation/tax-fastds-2026-declaration.mdx',
  title:
    'FAST-DS 2026: The Small-Taxpayer Foreign-Asset Amnesty, Worked (Two Categories, 30%+Equal / Flat ₹1L, 31 Dec 2026)',
  category: 'taxation',
  status: 'published',
  difficulty: 'advanced',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-01-31',
  tags: [
    'fast-ds',
    'amnesty',
    'foreign-asset',
    'black-money-act',
    'disclosure-scheme',
    'finance-act-2026',
    'schedule-fa',
    'small-taxpayer',
    'undisclosed-foreign-income',
    'immunity',
    'category-a',
    'category-b',
    '31-dec-2026',
  ],
  sources: ['src-us-stock-tax-india-2026', 'src-it-slab-fy2026-27'],
  related: [
    'tax-direct-lrs-us-equity-filing-walkthrough',
    'international-investing-lrs',
    'tax-india-investor-complete',
    'international-nri-tax-residency-tds-dtaa',
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

// 2) books.json — add chapter to book-complete-indian-investor
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
  id: 'ul-fastds-2026-window-2026',
  topic:
    "FAST-DS 2026 (Foreign Assets of Small Taxpayers - Disclosure Scheme, Finance Act 2026 Ch. IV ss.130-144, Rules notified 15 Aug 2026): the one-time window 16 Aug to 31 Dec 2026, reference date 31 Mar 2026, two categories (A = undisclosed foreign asset/income up to Rs 1 cr at 30% tax + an equal additional amount = 60% of value; B = a specified foreign asset up to Rs 5 cr that was already taxed elsewhere / acquired during non-residence but omitted from Schedule FA, at a flat Rs 1,00,000 fee), the Form 1 -> 2 -> payment -> 3/4 online sequence before the Principal DGIT (Systems), the Black Money Act immunity (asset-specific, excluding proceeds-of-crime and completed-BMA-assessment years) and the ongoing Schedule FA obligation that FAST-DS does NOT replace. The window is time-boxed - re-verify at the FY 2027-28 Budget whether it closed on 31 Dec 2026 and whether a successor scheme is announced.",
  article: 'tax-fastds-2026-declaration',
  lastVerified: '2026-10-18',
  reviewAfter: '2027-01-31',
  sourceIds: ['src-us-stock-tax-india-2026', 'src-it-slab-fy2026-27'],
};
if (!entries.some((e) => e.id === ulEntry.id)) {
  entries.push(ulEntry);
  fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2) + '\n');
  console.log('update-log.json: pushed', ulEntry.id, '->', entries.length);
}
