// One-off: register Wave 11 source, article, book chapter, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-surcharge-cess-fy2026-27')) {
  sarr.push({
    id: 'src-surcharge-cess-fy2026-27',
    title:
      "Surcharge & Health and Education Cess under the Income-tax Act, 2025 (effective 1 Apr 2026): individual new-regime surcharge 10% (50L-1Cr) / 15% (1Cr-2Cr) / 25% capped above 2Cr (the 37% top rate of the 1961 Act was ABOLISHED for the new regime); old regime keeps 37% above 5Cr; surcharge on listed-equity 111A/112A tax capped at 15%; 4% cess on (base tax + surcharge); marginal relief at each boundary caps incremental tax + surcharge on (income above boundary)",
    publisher: 'Virtual Auditor - Surcharge & HEC under the Income-tax Act, 2025 (updated 15 Apr 2026; Income-tax Act 2025 + Finance Act 2026)',
    url: 'https://virtualauditor.in/learn/surcharge-cess-income-tax-2025/',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'New regime individual surcharge: nil to 50L, 10% to 1Cr, 15% to 2Cr, 25% capped above 2Cr - the old 37% rate was abolished for the new regime',
      'Old regime individual surcharge: nil to 50L, 10% to 1Cr, 15% to 2Cr, 25% to 5Cr, 37% above 5Cr (the 1961 Act structure carries into the Act 2025 opt-out regime)',
      'Surcharge on tax from listed-equity STCG (111A 20%) / LTCG (112A 12.5%) is capped at 15% regardless of total income',
      'Health and Education Cess is 4% on (income-tax + surcharge after marginal relief), both regimes, no threshold',
      'Marginal relief: additional tax + surcharge on income above a surcharge boundary is capped at the incremental income (no cliff effect)',
      'A 10Cr income in the new regime saves roughly Rs 3Cr vs the old regime from the surcharge differential alone (secondary worked estimate)',
    ],
    notes: 'The new-regime 25% cap and the 37% abolition are the Income-tax Act, 2025 positions (assent 21 Aug 2025, effective 1 Apr 2026) per this CA-published source; re-verify the exact bands at each Finance Act and against the Income-tax Department threshold tables before advising at the very top bands.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('tax-surcharge-cess-high-income')) {
  aarr.push({
    id: 'tax-surcharge-cess-high-income',
    title: 'Surcharge, Cess & the High-Income Regime: What ₹50L+ Actually Costs in FY 2026-27 (and the 25% Cap That Changes Everything Above ₹2Cr)',
    category: 'taxation',
    difficulty: 'advanced',
    status: 'published',
    tags: ['surcharge', 'cess', 'high-income', 'new-regime', 'old-regime', '25-cap', '37-rate', 'equity-surcharge-cap', 'marginal-relief', 'itr'],
    summary:
      'The high-income layer over the tax model: the three-tier computation (slab base tax -> surcharge with marginal relief -> 4% cess), the FY 2026-27 change that abolished the 37% surcharge in the new regime (capped at 25%), the 15% equity-surcharge cap, and when the old regime still wins at the very top. Closes the surcharge/cess gap the Wave-9 deduction-shield model flagged.',
    file: 'src/content/taxation/tax-surcharge-cess-high-income.mdx',
    sources: ['src-surcharge-cess-fy2026-27', 'src-it-slab-fy2026-27', 'src-advance-tax-fy2026-27'],
    related: ['tax-india-investor-complete', 'tax-80c-baskets-regime-decision', 'tax-advance-itr-final-checklist', 'tax-tax-free-wealth-stack', 'pf-wealth-plan-10-lakh'],
    books: ['book-indian-taxation'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const btax = barr.find((b) => b.id === 'book-indian-taxation');
if (btax && !btax.chapters.includes('tax-surcharge-cess-high-income')) {
  btax.chapters.push('tax-surcharge-cess-high-income');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-new-regime-surcharge-cap-25-2026')) {
  uarr.push({
    id: 'ul-new-regime-surcharge-cap-25-2026',
    claim:
      'FY 2026-27 individual surcharge: new regime 10%/15%/25% capped above 2Cr (the 37% top rate abolished for the new regime under the Income-tax Act, 2025, effective 1 Apr 2026); old regime keeps 37% above 5Cr; 15% surcharge cap on listed-equity 111A/112A tax; 4% HEC on (tax + surcharge after marginal relief)',
    source: 'src-surcharge-cess-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Income-tax Act, 2025 (assent 21 Aug 2025) position per CA-published secondary source; re-verify the bands at each Finance Act and against the Income-tax Department threshold tables. The highIncomeTaxFY27() function models these bands.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 11 registry updated: 1 source, 1 article, book-indian-taxation +1 chapter, 1 update-log entry');
