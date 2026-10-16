// One-off: register Wave 17 source, article, book chapter, and update-log entry.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-54-rollover-fy2026-27')) {
  sarr.push({
    id: 'src-54-rollover-fy2026-27',
    title:
      "Capital-gains reinvestment (rollover) exemptions FY 2026-27 - Section 54 (residential house to residential house), 54F (any long-term asset other than a house to a residential house) and 54EC (a house-gain reinvested in notified infrastructure bonds, capped at Rs 50,00,000): the proportional rule (exemption = the smaller of the net gain and the amount actually reinvested in time), the statutory time windows (54EC within 6 months; 54 purchase within 1 yr before / 2 yr after sale or construction within 3 yr; 54F within 2 yr), the two exemption-breakers (a missed window and a non-long-term gain), the Capital Gains Account Scheme (CGAS) to hold unspent consideration, the Rs 10 Cr new-asset-cost cap on 54/54F (from AY 2024-25), the post-Finance (No.2) Act 2024 12.5% no-indexation LTCG base, and NRI eligibility (the rollover also reduces the 195 TDS)",
    publisher: 'CBDT Budget-2024 capital-gains FAQs (PIB, 24 Jul 2024) / TaxClue 54EC + 54F guides',
    url: 'https://www.pib.gov.in/newsite/erelcontentt.aspx?_d=2036604',
    type: 'regulator',
    authority: 'primary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'The post-2024 capital-gains rationalisation: holding periods simplified to 1 year (listed) and 2 years (other assets); LTCG on all assets at 12.5% without indexation; the 112A equity exemption raised to Rs 1.25L; reinvestment (rollover) benefits unchanged in structure',
      'Section 54: a long-term gain on a residential house is exempt to the extent it is reinvested in another residential house - purchase within 1 year before or 2 years after the sale, or construction within 3 years of the sale',
      'Section 54F: a long-term gain on any asset OTHER than a house is exempt to the extent the net consideration is invested in one residential house within 2 years of the sale',
      'Section 54EC: a long-term gain on a house may instead be reinvested in notified infrastructure bonds (NHAI / REC / PFC / IRFC etc.), capped at Rs 50,00,000, within 6 months of the sale; the bond must be held (not sold or converted to money) for the statutory period',
      'The exemption is proportional: it is the SMALLER of the net gain and the amount actually reinvested; reinvesting less than the gain leaves the balance taxable',
      'Two conditions break the exemption: the reinvestment must be inside the statutory window, and the gain must be a LONG-TERM gain',
      'Unspent sale consideration can be parked in a Capital Gains Account Scheme (CGAS) deposit; the exemption holds only if it is deployed within the remaining time, else the uninvested part becomes taxable in the year the deadline lapses',
      'From AY 2024-25 the 54/54F exemption for a single individual/HUF is capped at a new-asset cost of Rs 10 crore; the routes are available to residents and NRIs, and using them also reduces the Section 195 TDS an NRI property buyer withholds',
    ],
    notes: 'The 54EC notified-bond list is updated by the government each quarter - confirm the open tranche and its investment dates before relying on the 6-month window. The 12.5% no-indexation base and the holding periods are the Finance (No.2) Act 2024 position; re-verify at each Finance Act. The rollover math (exemption = min(gain, reinvested), 54EC 50L cap) is what the rolloverExemption() function models.',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('tax-capital-gains-rollover-54-54f-54ec')) {
  aarr.push({
    id: 'tax-capital-gains-rollover-54-54f-54ec',
    title: 'Capital Gains Rollover: Section 54, 54F & 54EC — Reinvest the Gain, Not the Sale Value (and What Breaks It)',
    category: 'taxation',
    difficulty: 'intermediate',
    status: 'published',
    tags: ['capital-gains', '54', '54f', '54ec', 'rollover', 'reinvestment', 'ltcg', 'exemption', 'property', 'rec', 'nhai', 'cgs', 'bond'],
    summary:
      'The reinvestment layer over capital gains: how Section 54 (house to house), 54F (any asset to house) and 54EC (notified bonds, Rs 50L cap) shelter a long-term gain, the time windows that make or break each, the proportional rule when you reinvest less than the gain, the 12.5% no-indexation base, the CGAS escape valve, and the NRI angle.',
    file: 'src/content/taxation/tax-capital-gains-rollover-54-54f-54ec.mdx',
    sources: ['src-54-rollover-fy2026-27', 'src-elss-ltcg-2026', 'src-it-slab-fy2026-27'],
    related: ['tax-loss-harvesting', 'tax-india-investor-complete', 'real-estate-reit-invit', 'international-nri-tax-residency-tds-dtaa', 'pf-wealth-plan-10-lakh'],
    books: ['book-indian-taxation'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const btax = barr.find((b) => b.id === 'book-indian-taxation');
if (btax && !btax.chapters.includes('tax-capital-gains-rollover-54-54f-54ec')) {
  btax.chapters.push('tax-capital-gains-rollover-54-54f-54ec');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-54ec-notified-bonds-fy2026-27')) {
  uarr.push({
    id: 'ul-54ec-notified-bonds-fy2026-27',
    claim:
      'Section 54EC reinvestment is capped at Rs 50,00,000 and must be into government-notified infrastructure bonds (NHAI / REC / PFC / IRFC etc.) within 6 months of the sale; the notified-bond list is refreshed quarterly and a tranche must be open to invest',
    source: 'src-54-rollover-fy2026-27',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-01-31',
    status: 'verified',
    notes: 'The 50L cap and the 6-month window are stable; the specific notified-bond issuers and tranche dates are re-notified each quarter - confirm the open tranche before acting. Re-verify the 12.5% no-indexation base and the 1-yr / 2-yr holding periods at each Finance Act.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 17 registry updated: 1 source, 1 article, book-indian-taxation +1 chapter, 1 update-log entry');
