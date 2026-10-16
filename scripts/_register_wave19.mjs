import fs from 'node:fs';

const af = JSON.parse(fs.readFileSync('content-registry/articles.json', 'utf8'));
const arts = af.articles ?? af;
if (!arts.find((a) => a.id === 'tax-esop-vesting-tax-walkthrough')) {
  arts.push({
    id: 'tax-esop-vesting-tax-walkthrough',
    title: 'ESOP / RSU Vesting Tax Walkthrough: The Full Two-Stage Lifecycle (FY 2026-27)',
    category: 'taxation',
    difficulty: 'advanced',
    status: 'published',
    tags: ['esop', 'rsu', 'perquisite', 'capital-gains', '80-iac', 'startup-deferral', 'schedule-fa', 'tds-192', 'tds-392'],
    summary: 'Full two-stage ESOP/RSU tax walkthrough: perquisite at exercise (FMV step-up), CG head selection (112A/111A/Sec112/slab), 80-IAC 60-month deferral, TDS 192-392 migration, advance tax on CG, Schedule FA + FAST-DS, and two worked examples.',
    file: 'src/content/taxation/tax-esop-vesting-tax-walkthrough.mdx',
    sources: ['src-esop-tax-it-dept', 'src-it-slab-fy2026-27'],
    related: ['tax-esop-stock-grants', 'tax-india-investor-complete', 'tax-advance-itr-final-checklist', 'international-investing-lrs'],
    books: ['book-indian-taxation'],
  });
}
fs.writeFileSync('content-registry/articles.json', JSON.stringify(af, null, 2));
console.log('articles count:', arts.length);

const bf = JSON.parse(fs.readFileSync('content-registry/books.json', 'utf8'));
const books = bf.books ?? bf;
const book = books.find((b) => b.id === 'book-indian-taxation');
if (book) {
  const chKey = book.chapters ? 'chapters' : 'artifactChapters';
  const chArr = book[chKey];
  if (!chArr.find((c) => c.id === 'tax-esop-vesting-tax-walkthrough')) {
    chArr.push({ id: 'tax-esop-vesting-tax-walkthrough', title: 'ESOP / RSU Vesting Tax Walkthrough' });
  }
  console.log('book-indian-taxation chapters:', chArr.length);
}
fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2));

const ulf = JSON.parse(fs.readFileSync('content-registry/update-log.json', 'utf8'));
const ul = ulf.entries ?? ulf;
if (!ul.find((e) => e.id === 'ul-esop-80iac-60mo-fy2026-27')) {
  ul.push({
    id: 'ul-esop-80iac-60mo-fy2026-27',
    claim:
      '80-IAC deferral window extended from 48 to 60 months for shares allotted on/after 1 Apr 2026; TDS section migrates 192->392 under Income-tax Act 2025; FAST-DS disclosure deadline 31 Dec 2026; Schedule FA penalty Rs 10L/year under Black Money Act s.43',
    source: 'taxgarden.in, thefinestate.com, calcguru.in, csmllp.in (verified 2026-10-18)',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'ok',
    notes:
      'Section numbers: s.17(2)(vi)->s.17(1)(d), s.49(2AA)->s.73, s.111A->s.196(1)(i), s.112A->s.198(2)(a), s.112->s.197(1)(b), s.192->s.392',
  });
}
console.log('update-log entries:', ul.length);
fs.writeFileSync('content-registry/update-log.json', JSON.stringify(ulf, null, 2));
