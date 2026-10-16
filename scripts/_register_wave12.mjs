// One-off: register Wave 12 source, article, book chapter, and update-log entries.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-gifts-clubbing-fy2026-27')) {
  sarr.push({
    id: 'src-gifts-clubbing-fy2026-27',
    title:
      "Gifts (Sec 56(2)) and clubbing of income (Sec 60-65; 64(2) = 99(3)-(4) of the Act 2025) FY 2026-27: gifts from specified relatives exempt with no limit; non-relative gifts aggregate over Rs 50,000 in a year makes the ENTIRE amount taxable at slab (a cliff, not an excess); wedding/inheritance/12A-trust gifts always exempt; 64(1)(iv) clubs income on assets gifted to a spouse; 64(1A) clubs a minor's income to the higher-income parent; 64(2) clubs income from self-acquired property converted into a HUF the transferor belongs in; 65 makes the transferee jointly liable",
    publisher: 'TaxClue tax-on-gifts guide / Legal Suvidha clubbing-of-income guide (FY 2026-27)',
    url: 'https://legalsuvidha.com/blog/clubbing-of-income/',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      "Gifts from specified relatives (spouse, siblings, lineal ascendants/descendants and their spouses) are exempt with no limit under 56(2)",
      'From non-relatives, the aggregate of all gifts in a year over Rs 50,000 makes the entire amount taxable at slab - a cliff, not a free allowance (e.g. Rs 60,000 of gifts -> all Rs 60,000 taxed)',
      'Always exempt regardless of amount: wedding gifts, inheritance under a will, gifts from 12A/10(23C) registered trusts, and employer gifts up to Rs 5,000',
      'Sec 64(1)(iv): income arising from an asset gifted to a spouse (directly or indirectly, without adequate consideration) is clubbed into the transferor - only direct income on the original asset, not income on reinvested income',
      'Sec 64(1A): a minor child investment income is clubbed into the higher-income parent; the grandparent gift to the grandchild is safe at the grandparent level but the parent bears the income tax',
      "Sec 64(2) (renumbered 99(3)-(4) in the Income-tax Act, 2025): converting SELF-ACQUIRED property into a HUF the transferor belongs in taxes the income in the transferor's hands, not the HUF's",
      'Sec 65: the spouse/child who received the asset is jointly and severally liable for the transferor clubbed-income tax',
    ],
    notes: 'The AIS now matches transfers across PANs, so clubbing triggers leave an electronic audit trail before filing. Verify the exact Act-2025 renumbering (64(2) -> 99(3)-(4)) against the Income-tax Act, 2025 text before advising a HUF structure.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('tax-huf-second-slab-gifting-high-income')) {
  aarr.push({
    id: 'tax-huf-second-slab-gifting-high-income',
    title: 'The HUF at High Income: Second-Slab Savings, the Gifting Rules, and the Two Advance-Tax Clocks',
    category: 'taxation',
    difficulty: 'advanced',
    status: 'published',
    tags: ['huf', 'clubbing', '64-2', '56-2', 'gifting', 'advance-tax', '234b', '234c', 'second-slab', 'karta', 'inheritance'],
    summary:
      'The high-income layer over the HUF: why a second assessable person beats one high slab (worked 30L+5L split saves 1.56L/yr in the new regime), which income legally sits in the HUF vs which gets clubbed back (64(2) self-acquired conversion, 64(1)(iv) spouse, 64(1A) minor), the 56(2) gifting rules and the 50k non-relative cliff, and why a HUF that earns above 10K carries its own 234B/234C advance-tax clock.',
    file: 'src/content/taxation/tax-huf-second-slab-gifting-high-income.mdx',
    sources: ['src-huf-tax-2026', 'src-gifts-clubbing-fy2026-27', 'src-advance-tax-fy2026-27'],
    related: ['tax-huf-wealth-structure', 'tax-advance-itr-final-checklist', 'tax-surcharge-cess-high-income', 'tax-india-investor-complete', 'pf-wealth-plan-10-lakh'],
    books: ['book-indian-taxation'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const btax = barr.find((b) => b.id === 'book-indian-taxation');
if (btax && !btax.chapters.includes('tax-huf-second-slab-gifting-high-income')) {
  btax.chapters.push('tax-huf-second-slab-gifting-high-income');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-56-2-gift-cliff-2026')) {
  uarr.push({
    id: 'ul-56-2-gift-cliff-2026',
    claim:
      "Sec 56(2) gifts: relative gifts exempt with no limit; non-relative gifts aggregate over Rs 50,000 in a year makes the entire amount taxable at slab (a cliff); wedding/inheritance/12A-trust gifts always exempt; Budget 2025 did not change the threshold",
    source: 'src-gifts-clubbing-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'The 50k cliff and the relative-list are stable; re-verify at each Finance Act.',
  });
}
if (!uhav.has('ul-64-2-huf-renumber-act-2025')) {
  uarr.push({
    id: 'ul-64-2-huf-renumber-act-2025',
    claim:
      'Sec 64(2) self-acquired-to-HUF clubbing is renumbered Sec 99(3)-(4) in the Income-tax Act, 2025 (effective 1 Apr 2026); Sec 64(1)(iv) spouse-income and 64(1A) minor-income carry through; Sec 65 joint-and-several liability of the transferee remains',
    source: 'src-gifts-clubbing-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'Confirm the exact Act-2025 section numbers against the Income-tax Act, 2025 text before advising a HUF structure; the AIS cross-PAN matching makes the clubbing triggers leave an electronic audit trail.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 12 registry updated: 1 source, 1 article, book-indian-taxation +1 chapter, 2 update-log entries');
