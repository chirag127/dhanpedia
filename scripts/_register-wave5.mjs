// One-off: register Wave 5 sources + articles, book chapters, update-log entries
import fs from 'node:fs';

const TODAY = '2026-10-17';
const REVIEW = '2027-04-17';

// ---- sources.json ----
const sp = 'content-registry/sources.json';
const s = JSON.parse(fs.readFileSync(sp, 'utf8'));
const haveS = new Set(s.map((x) => x.id));

const newSources = [
  {
    id: 'src-pms-aif-fees-2026',
    title: 'PMS / AIF fee convention 2026: management fee on opening corpus (2-2.5% flat, or ~1-1.75% + 15-20% performance above an 8-12% hurdle), performance on gain-above-benchmark, no clawback in the SEBI recurring-fee model; PMS gains pass through and are taxed as the investor own CGT',
    publisher: 'PMS Sahi Hai / SEBI PMS notification coverage (2026)',
    url: 'https://www.pmssahihai.com/insights/pms-charges',
    type: 'industry-guide',
    authority: 'secondary',
    verified: TODAY,
    lastVerified: TODAY,
    claims: [
      'Management fee charged on the opening corpus each year; performance fee on the gain that exceeds the hurdle, computed after the management fee',
      'Typical fixed fees 2-2.5%/yr, or ~1-1.75% + 15-20% of profits above an 8-12% hurdle (the SEBI PMS recurring-fee convention)',
      'PMS is a pass-through structure: the investor holds direct securities and the gains are taxed as the investor own capital gains (no vehicle-level tax)',
      'SEBI notified a revamped PMS regulation (effective April 2027) incl. a mutual-fund-only PMS route; re-check the management/performance mechanics and the new low-ticket minimum at go-live',
    ],
    notes: 'Fee percentages are market quotes, not a single official table; confirm the exact contract (fixed vs performance, hurdle, clawback) in each PMS/AIF agreement.',
  },
  {
    id: 'src-aif-categories-2026',
    title: 'SEBI AIF categories (2026): Cat I (non-debt, venture, private equity), Cat II (non-leveraged, structured), Cat III (leveraged/hedge funds); Rs.1Cr minimum for most AIFs (Rs.25L for angel funds and manager-employee/director investors); Cat I/II close-ended with a 3-year minimum tenure; up to 1000 investors per scheme (49 for angel funds)',
    publisher: 'Planify / SEBI (AIF) Regulations, 2012 (2026 coverage)',
    url: 'https://www.planify.in/article/sebi_regulations',
    type: 'regulator',
    authority: 'secondary',
    verified: TODAY,
    lastVerified: TODAY,
    claims: [
      'Rs.1Cr minimum per investor for most AIFs; Rs.25L for angel-fund investors and for employees/directors of the manager',
      'Category I and II AIFs are close-ended with a minimum 3-year tenure',
      'Up to 1000 investors per scheme (waived for accredited-investor-only funds); 49 for angel funds',
    ],
    notes: 'Confirm the category-specific and current AIF numbers against the SEBI AIF Regulations text and each fund LPR before advising.',
  },
  {
    id: 'src-advance-tax-fy2026-27',
    title: 'Advance tax FY 2026-27: duty when tax after TDS exceeds Rs.10,000; four cumulative installments 15 Jun (15%) / 15 Sep (45%) / 15 Dec (75%) / 15 Mar (100%); Sec 234C interest 1%/mo on each quarterly shortfall (3-month tails on the first three, 1-month on the last); Sec 234B 1%/mo from 1 Apr when advance paid is under 90% of assessed tax; capital-gains/lottery/dividend income arising after a date attracts no 234C if paid in the remaining installments (last quarter by 31 Mar); 44AD/44ADA presumptive taxpayers may pay 100% by 15 Mar in one installment',
    publisher: 'Income-tax Act, 2025 (FY 2026-27), Sec 207-211, 234B, 234C — via TaxClue advance-tax guide',
    url: 'https://taxclue.in/guide/advance-tax-calculator',
    type: 'regulator',
    authority: 'secondary',
    verified: TODAY,
    lastVerified: TODAY,
    claims: [
      'The advance-tax duty applies only when the balance after TDS/TCS exceeds Rs.10,000',
      'Installments are cumulative (15/45/75/100%), not four independent payments; a missed earlier installment carries its own 234C tail',
      '234C: 1% per month on each installment shortfall - 3 months (Jun/Aug) on the first three quarters and 1 month on the final installment',
      '234B: 1% per month from 1 April on the shortfall when advance paid is less than 90% of the assessed tax',
      'Capital-gains, lottery, and dividend income arising after an installment date incur no 234C if the tax on it is paid in the remaining installments; last-quarter gains by 31 March',
      '44AD/44ADA presumptive taxpayers may pay the entire advance tax in a single installment by 15 March',
    ],
    notes: 'The ITR utility and the Income-tax Act 2025 section text are the authority on the specific 234B/234C computation; re-verify the schedule dates at each Finance Act.',
  },
  {
    id: 'src-it-dept-final-dates-2026',
    title: 'Income-tax filing and advance-payment final dates for FY 2026-27: ITR-1/2/3/4 standard deadline 31 July 2027 (non-audited), 15 July 2027 (audited); verify the exact dates against the Income-tax Department each year-end',
    publisher: 'Income-tax Department of India (e-filing portal)',
    url: 'https://www.incometax.gov.in',
    type: 'regulator',
    authority: 'primary',
    verified: TODAY,
    lastVerified: TODAY,
    claims: [
      'Standard ITR deadline for non-audited individuals is 31 July of the assessment year; 15 July for audited entities',
      'The exact filing and advance-payment dates are published by the Income-tax Department each year-end and should be re-verified before the last mile of the checklist',
    ],
    notes: 'Cited as the authoritative check-line for year-end dates; the specific published dates are a re-verify-each-year item, not a stable figure.',
  },
];

for (const src of newSources) {
  if (haveS.has(src.id)) { console.log('SKIP source:', src.id); continue; }
  s.push(src);
  console.log('ADDED source:', src.id);
}
fs.writeFileSync(sp, JSON.stringify(s, null, 1) + '\n', 'utf8');
console.log('sources.json total:', s.length);

// ---- articles.json ----
const ap = 'content-registry/articles.json';
const a = JSON.parse(fs.readFileSync(ap, 'utf8'));
const haveA = new Set(a.articles.map((x) => x.id));

const newArticles = [
  {
    id: 'alternatives-hnw-pms-aif-sif-selection',
    title: 'Picking Your Own Rung: The SIF / PMS / AIF Selection & Fee-Decay Decision Guide',
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['sif', 'pms', 'aif', 'hni', 'fee-drag', 'due-diligence', 'sebi-2026', 'allocation'],
    summary: 'The selection layer over the professional rungs: when a SIF (Rs.10L), PMS (Rs.50L) or AIF (Rs.1Cr) beats the plain index, the fee-decay math that decides when each pays for itself, a 10-point due-diligence checklist, and the 10L -> 50L -> 1Cr capital roadmap (including the April-2027 MF-only PMS route).',
    file: 'src/content/alternatives/alternatives-hnw-pms-aif-sif-selection.mdx',
    sources: ['src-sebi-sif-2026', 'src-sebi-mf-regulations-2026', 'src-pms-aif-fees-2026', 'src-aif-categories-2026'],
    related: ['alternatives-pms-aif-private', 'alternatives-sif-specialized-funds', 'pf-wealth-plan-10-lakh', 'portfolio-construction-rebalancing', 'tax-india-investor-complete'],
    books: ['book-wealth-beyond-10l'],
  },
  {
    id: 'tax-advance-itr-final-checklist',
    title: 'Advance Tax, the 234B/234C Interest Clock, and the Final ITR Checklist for FY 2026-27',
    category: 'taxation',
    difficulty: 'advanced',
    status: 'published',
    tags: ['advance-tax', '234b', '234c', 'itr', 'tax-planning', 'fy-2026-27', 'compliance'],
    summary: 'Who must pay advance tax in FY 2026-27, the four cumulative installment dates, the 234B and 234C interest clocks with the capital-gains 31-Mar relief, the surcharge thresholds, which ITR form to file, and the end-of-year checklist that turns estimate into settled.',
    file: 'src/content/taxation/tax-advance-itr-final-checklist.mdx',
    sources: ['src-advance-tax-fy2026-27', 'src-it-slab-fy2026-27', 'src-it-dept-final-dates-2026'],
    related: ['tax-india-investor-complete', 'tax-tax-free-wealth-stack', 'tax-loss-harvesting', 'tax-huf-wealth-structure', 'pf-wealth-plan-10-lakh'],
    books: ['book-indian-taxation'],
  },
];

for (const art of newArticles) {
  if (haveA.has(art.id)) { console.log('SKIP article:', art.id); continue; }
  a.articles.push(art);
  console.log('ADDED article:', art.id);
}
fs.writeFileSync(ap, JSON.stringify(a, null, 1) + '\n', 'utf8');
console.log('articles.json total:', a.articles.length);

// ---- books.json ----
const bp = 'content-registry/books.json';
const b = JSON.parse(fs.readFileSync(bp, 'utf8'));
for (const bk of b.books) {
  if (bk.id === 'book-wealth-beyond-10l' && !bk.chapters.includes('alternatives-hnw-pms-aif-sif-selection')) {
    bk.chapters.push('alternatives-hnw-pms-aif-sif-selection');
  }
  if (bk.id === 'book-indian-taxation' && !bk.chapters.includes('tax-advance-itr-final-checklist')) {
    bk.chapters.push('tax-advance-itr-final-checklist');
  }
}
fs.writeFileSync(bp, JSON.stringify(b, null, 1) + '\n', 'utf8');
for (const bk of b.books) console.log(bk.id, '->', bk.chapters.length, 'chapters');

// ---- update-log.json ----
const up = 'content-registry/update-log.json';
const ul = JSON.parse(fs.readFileSync(up, 'utf8'));
const haveU = new Set(ul.entries.map((x) => x.id));
const newEntries = [
  {
    id: 'ul-sif-pan-minimum-2026',
    claim: 'SIF: Rs.10L aggregate minimum at the PAN level (excludes AMC-mandated employee investments); accredited-investor exemption; framework effective 1 April 2026 - the first professional rung a Rs.10L reader is already eligible for',
    source: 'src-sebi-sif-2026',
    lastVerified: TODAY,
    reviewAfter: REVIEW,
    status: 'verified',
  },
  {
    id: 'ul-mf-only-pms-route-2027',
    claim: 'SEBI notified a revamped PMS regulation effective April 2027 introducing a mutual-fund-only PMS route at a Rs.25L minimum (below the classic Rs.50L PMS floor) - a new low-ticket pooled rung between SIF and classic PMS; re-verify the exact minimum and go-live date',
    source: 'src-pms-aif-fees-2026',
    lastVerified: TODAY,
    reviewAfter: REVIEW,
    status: 'verified',
  },
  {
    id: 'ul-aif-category-minima-2026',
    claim: 'AIF: Rs.1Cr minimum (Rs.25L for angel funds and manager-employee/director investors); Cat I/II close-ended with a 3-year minimum tenure; up to 1000 investors per scheme (49 angel)',
    source: 'src-aif-categories-2026',
    lastVerified: TODAY,
    reviewAfter: REVIEW,
    status: 'verified',
  },
  {
    id: 'ul-advance-tax-fy2026-27',
    claim: 'Advance tax FY 2026-27: duty when tax after TDS exceeds Rs.10,000; cumulative 15/45/75/100% on 15 Jun / 15 Sep / 15 Dec / 15 Mar; 234C 1%/mo on each shortfall (3-month tails first three, 1-month last); 234B 1%/mo from 1 Apr when advance paid under 90% of assessed; capital-gains 31-Mar relief; 44AD/44ADA single 15-Mar payment',
    source: 'src-advance-tax-fy2026-27',
    lastVerified: TODAY,
    reviewAfter: REVIEW,
    status: 'verified',
  },
  {
    id: 'ul-itr-final-dates-2026',
    claim: 'FY 2026-27 ITR standard deadline 31 July 2027 (non-audited), 15 July 2027 (audited); the exact dates are a published annual notification to re-verify at year-end',
    source: 'src-it-dept-final-dates-2026',
    lastVerified: TODAY,
    reviewAfter: '2027-07-31',
    status: 'verified',
  },
];
for (const e of newEntries) {
  if (haveU.has(e.id)) { console.log('SKIP update-log:', e.id); continue; }
  ul.entries.push(e);
  console.log('ADDED update-log:', e.id);
}
fs.writeFileSync(up, JSON.stringify(ul, null, 1) + '\n', 'utf8');
console.log('update-log.json total:', ul.entries.length);
