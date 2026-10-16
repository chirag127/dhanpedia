// One-off: register Wave 8 source, article, book chapter, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-aif-waterfall-economics-2026')) {
  sarr.push({
    id: 'src-aif-waterfall-economics-2026',
    title:
      "AIF GP-LP economics: the '2 and 20' standard ladder - management fee 2%/yr (committed capital during investment period, then NAV/invested during harvest), 20% carried interest, 8% IRR preferred return (hurdle), 100% GP catch-up; worked 500 Cr / 3x / 10-yr fund lands LPs at ~1300 Cr (2.6x net) and the GP at ~200 Cr carry + 70-80 Cr fee (~5-6% of fund value); the hurdle and catch-up are the terms that move in negotiation (raising the hurdle 8 to 10% cut GP carry ~20-25 Cr); clawback via 20-30% escrow holdback; GP all-in ~5-6% of fund value on a success, fee-only on a failure",
    publisher: 'Nucleus Advisors, "GP-LP economics: management fee, carry, hurdle - the standard ladder" (07 Jan 2026)',
    url: 'https://www.nucleusadvisors.in/insights/gp-lp-economics-fee-carry-hurdle',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'Management fee standard: 2%/yr on committed capital during the ~5-year investment period, then 2%/yr on invested capital or NAV during the harvest period',
      'Carry standard 20%; preferred-return hurdle standard 8% IRR compounded; 100% GP catch-up is standard and GP-friendly, 50% or no catch-up is LP-friendly',
      'Worked fund: 500 Cr committed, 3x over 10 years, 8% hurdle, 20% carry, 100% catch-up - LPs total ~1300 Cr, GP carry ~200 Cr, cumulative management fee ~70-80 Cr; GP all-in ~5-6% of fund value',
      'The hurdle is the single most-negotiated term (institutional LPs push 9-10% on debt/infra); a 200 bps hurdle change moves GP carry meaningfully',
      'Clawback standard fix: escrow holdback of 20-30% of carry payments until fund wind-up; without it the clause can be unenforceable years later',
      'On an unsuccessful fund the GP earns only the management fee - the structural alignment between GP and LP',
    ],
    notes: "Practitioner secondary source; the exact ladder numbers vary LPA-by-LPA. Read each fund's PPM waterfall page and confirm the specific hurdle, catch-up, fee base, and clawback/escrow language before committing.",
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('alternatives-aif-waterfall-economics')) {
  aarr.push({
    id: 'alternatives-aif-waterfall-economics',
    title: "The 2/20 Waterfall: How Carried Interest Actually Splits an AIF's Money (and What to Negotiate)",
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['aif', 'waterfall', 'carried-interest', 'hurdle', 'catch-up', 'clawback', '2-and-20', 'gp-lp', 'private-equity', 'fee-stack'],
    summary:
      'The LP economics layer over AIFs: how the "two and twenty" ladder really works - management fee, 8% hurdle, 100% catch-up and 80/20 split - with a worked 500 Cr fund example; why the hurdle and catch-up are the terms that actually move; what a clawback does when the fund misses; and the decision test for the 1 Cr smallest ticket.',
    file: 'src/content/alternatives/alternatives-aif-waterfall-economics.mdx',
    sources: ['src-aif-waterfall-economics-2026', 'src-pms-aif-fees-2026'],
    related: ['alternatives-aif-category-selection-guide', 'alternatives-hnw-pms-aif-sif-selection', 'alternatives-pms-aif-private', 'pf-wealth-plan-10-lakh', 'tax-tax-free-wealth-stack'],
    books: ['book-wealth-beyond-10l'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const bwe = barr.find((b) => b.id === 'book-wealth-beyond-10l');
if (bwe && !bwe.chapters.includes('alternatives-aif-waterfall-economics')) {
  bwe.chapters.push('alternatives-aif-waterfall-economics');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-aif-waterfall-standard-ladder-2026')) {
  uarr.push({
    id: 'ul-aif-waterfall-standard-ladder-2026',
    claim:
      'Standard AIF GP-LP ladder: 2%/yr mgmt fee (committed capital in investment period, NAV/invested in harvest), 20% carry, 8% IRR hurdle, 100% catch-up; worked 3x/10-yr fund gives LP ~2.6x net, GP ~5-6% of fund value all-in; GP earns fee-only on a failure',
    source: 'src-aif-waterfall-economics-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Practitioner reading; verify the specific ladder against each fund PPM before advising.',
  });
}
if (!uhav.has('ul-80ccd1b-regime-clarification-2026')) {
  uarr.push({
    id: 'ul-80ccd1b-regime-clarification-2026',
    claim:
      "80CCD(1B) Rs 50,000 extra NPS deduction is OLD-REGIME-only (disallowed under new regime Sec 115BAC); only 80CCD(2) employer NPS (14% of Basic+DA for all employers, raised from 10% private-sector by Budget 2024) survives in the new regime. A blog intro claimed 80CCD(1B) is 'available even under the New Regime', but the same site's CA-reviewed body (15 Oct 2026) and FAQ table state old-regime-only - consistent with existing src-nps-deductions-2026",
    source: 'src-nps-deductions-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'conflict-resolved',
    notes: 'Conflicting claims found during Wave 8 research (ELSS/NPS tax-shield planning). Resolution: old-regime-only, per the CA-reviewed 15 Oct 2026 review plus 1 Finance/ClearTax coverage. Re-verify at each Finance Act; Wave 9 ELSS/NPS tax-shield calculators must use 80CCD(1B) old-regime-only.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 8 registry updated: 1 source, 1 article, book-wealth-beyond-10l +1 chapter, 2 update-log entries (incl. 80CCD(1B) conflict note)');
