// One-off: register Wave 15 source, article, book chapter, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-senior-tax-fy2026-27')) {
  sarr.push({
    id: 'src-senior-tax-fy2026-27',
    title:
      "Senior-citizen tax FY 2026-27 (Income-tax Act 2025): old-regime basic exemption Rs 3,00,000 (senior 60-79) / Rs 5,00,000 (super-senior 80+) vs Rs 2,50,000 below 60; the new regime has NO age benefit (same slabs + 87A to 12L + Rs 75,000 standard deduction for everyone); 80TTB up to Rs 50,000 on interest income (savings/FD/RD/post-office/SCSS), OLD regime only - a Budget-2026 raise to Rs 1,00,000 has been reported but is unverified; 80D enhanced senior cap; senior TDS threshold on interest raised to Rs 1,00,000 (from 50,000); Form 15H stops TDS below the taxable limit; seniors with no business income are exempt from advance tax (pay as self-assessment tax); Section 194P lets a 75+ senior whose only income is pension + interest from the same bank skip ITR filing; SCSS 8.2% interest is fully taxable as Other Sources with only 80C on the deposit and 80TTB on up to Rs 50,000 of interest (both old regime)",
    publisher: 'CalcGuru senior-citizen tax benefits (Aug 2026) / TaxClue senior slabs / Moneykit senior calculator',
    url: 'https://calcguru.in/senior-citizen-tax-benefits-80ttb-scss',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Old-regime basic exemption: Rs 3,00,000 senior (60-79) / Rs 5,00,000 super-senior (80+) / Rs 2,50,000 below 60; the new regime gives no age-based exemption to anyone',
      'Section 80TTB: up to Rs 50,000 deduction on interest income (FY 2026-27 confirmed figure), old regime only; the new regime removes it entirely',
      'A Budget-2026 report of raising 80TTB to Rs 1,00,000 is UNVERIFIED - the Income-tax Department / Finance Act text must be checked before relying on the higher cap',
      'Senior TDS threshold on interest income raised to Rs 1,00,000 (from Rs 50,000); Form 15H stops TDS if total income is below the taxable limit',
      'Seniors with no business income are exempt from advance tax; a 75+ senior whose only income is pension + same-bank interest may skip ITR filing under Section 194P',
      'SCSS (8.2% on up to Rs 30L) interest is fully taxable as Income from Other Sources; the only reliefs are 80C on the deposit (up to Rs 1.5L, investment year) and 80TTB on up to Rs 50,000 of the interest - both old regime',
      "In FY 2026-27 the new regime's widened slabs + 87A-to-12L often beat the old regime for retirees even WITH 80TTB/80D; the popular 'old regime wins for retirees' advice is stale at typical (below ~20L) income levels in this base-slab model",
    ],
    notes: 'The 80TTB Rs 50,000 figure is the confirmed FY 2026-27 (AY 2027-28) value; the reported Rs 1,00,000 raise is not yet in the Finance Act text - verify with a CA before acting. The senior TDS threshold, 15H, the advance-tax exemption and 194P are stable; the regime-decision result depends on the widened new-regime slabs and would flip back if the old regime regained lower top bands.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('tax-senior-citizen-regime-decision')) {
  aarr.push({
    id: 'tax-senior-citizen-regime-decision',
    title: 'The Senior-Citizen Regime Decision: When the Old Regime Wins for a Retiree (and the 87A Trap It Hides)',
    category: 'taxation',
    difficulty: 'intermediate',
    status: 'published',
    tags: ['senior-citizen', 'super-senior', '80ttb', '80d', 'regime-decision', 'scss', 'pension', 'interest', '15h', 'advance-tax', '194p'],
    summary:
      "The terminal-rung tax layer: how a retiree living on interest and pension should choose regimes in FY 2026-27 - the age-based old-regime exemptions (3L senior / 5L super-senior), the 80TTB interest deduction (old-only), the 80D enhanced cap, the Rs 1L senior TDS threshold + Form 15H, the retiree advance-tax exemption, the Section 194P no-ITR convenience - and the counterintuitive case where the new regime's 87A-to-12L rebate still wins for a typical retiree.",
    file: 'src/content/taxation/tax-senior-citizen-regime-decision.mdx',
    sources: ['src-senior-tax-fy2026-27', 'src-it-slab-fy2026-27', 'src-scss-8-2', 'src-advance-tax-fy2026-27'],
    related: ['tax-80c-baskets-regime-decision', 'tax-surcharge-cess-high-income', 'tax-india-investor-complete', 'govt-small-savings-schemes', 'retirement-fire-annuities'],
    books: ['book-indian-taxation'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const btax = barr.find((b) => b.id === 'book-indian-taxation');
if (btax && !btax.chapters.includes('tax-senior-citizen-regime-decision')) {
  btax.chapters.push('tax-senior-citizen-regime-decision');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-senior-80ttb-limit-2026')) {
  uarr.push({
    id: 'ul-senior-80ttb-limit-2026',
    claim:
      '80TTB interest-income deduction for senior citizens: Rs 50,000 confirmed for FY 2026-27; a Budget-2026 report of a raise to Rs 1,00,000 is UNVERIFIED (department portal still shows 50k). Old-regime-only. The senior TDS threshold on interest is Rs 1,00,000 (raised from 50,000).',
    source: 'src-senior-tax-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'conflict-open',
    notes: 'Conflicting figures found during Wave 15 research: CalcGuru/TaxClue show 80TTB at Rs 50,000 (old-only); some 2026 budget coverage reports a Rs 1,00,000 raise. Resolution pending - the Income-tax Act 2025 / Finance Act text must be checked before advising. The seniorRegimeTaxFY27() function takes the 80TTB limit as a user-settable input so the article does not hardcode a disputed figure.',
  });
}
if (!uhav.has('ul-senior-regime-decision-2026')) {
  uarr.push({
    id: 'ul-senior-regime-decision-2026',
    claim:
      "Modeled FY 2026-27 finding: with the widened new-regime slabs + 87A-to-12L, the NEW regime is cheaper for a retiree at typical income levels (below ~Rs 20L) even after giving up 80TTB/80D; even a full old-regime stack (80C 1.5L + 24b 2L + 80D 50k + 80TTB 50k = ~4.55L) does not flip the decision up to ~Rs 1 Cr in the base-slab model. The stale 'old regime wins for retirees' advice no longer holds below ~Rs 20L.",
    source: 'src-senior-tax-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Base-slab model excludes surcharge; the new regime 25% surcharge cap vs the old 37% would only widen the new regime advantage at the very top. Re-verify at each Finance Act - any old-regime top-band change would flip this back.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 15 registry updated: 1 source, 1 article, book-indian-taxation +1 chapter, 2 update-log entries (incl. open 80TTB conflict)');
