import fs from 'node:fs';
const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, obj) =>
  fs.writeFileSync(`${root}/${p}`, JSON.stringify(obj, null, 1) + '\n');

// ---------- SOURCES ----------
const sources = read('content-registry/sources.json');
const sArr = Array.isArray(sources) ? sources : sources.sources;
const have = new Set(sArr.map((s) => s.id));

if (!have.has('src-sif-strategy-families-2026')) {
  sArr.push({
    id: 'src-sif-strategy-families-2026',
    title: 'SIF strategy families (SEBI MF Regulations 2026, secondary summaries): seven permitted long-short / relative-value families — equity long-short, equity market-neutral, debt long-short (rate), credit relative value, sector rotation, dynamic / tactical asset allocation, event-driven / arbitrage; illustrative 75% long / 25% short blend, ~25% naked-short cap + required hedging; ~2.25% management fee + ~2% marketing / distribution; daily NAV pricing; SIP / STP allowed',
    publisher: 'AndFintech / Mera SIF / GreySky Capital / SafeMoney (2026 secondary guides on the SEBI MF Regulations 2026 SIF framework)',
    url: 'https://andfintech.in/blog-post.php?slug=sif-categories-decoded-which-of-indias-7-long-short-strategies-fits-your-portfolio',
    type: 'industry-guide',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'The SIF category opens to seven broad strategy families (equity long-short, equity market-neutral, debt long-short / rate, credit relative value, sector rotation, dynamic / tactical asset allocation, event-driven / arbitrage); the "seven" is an order-of-magnitude secondary reading, not a fixed SEBI named list',
      'Illustrative equity long-short blend is roughly 75% long / 25% short; the naked (unhedged) short sleeve is capped at about 25% of the book with the remainder required to be hedged (medium confidence - verify against the scheme derivative policy)',
      'SIF expense cap about 2.25% management fee plus about 2% marketing / distribution; no separate performance fee in the classic mutual-fund style',
      'SIFs are priced daily (NAV), and SIP / STP are allowed; the 10L aggregate-minimum and active / passive breach rules carry forward from the overview',
    ],
    notes: 'Medium confidence - caps, the 75/25 blend and the seven-family framing are secondary-guide summaries of the SEBI 2026 framework; verify against the SEBI circular text and each scheme document before advising.',
  });
}

if (!have.has('src-reit-invit-premium-discount-2026')) {
  sArr.push({
    id: 'src-reit-invit-premium-discount-2026',
    title: 'REIT / InvIT NAV premium-discount dynamics and the Finance Bill 2026 dividend-uniformity proposal: REIT total return = distribution + NAV appreciation + change in the premium/discount; buying above NAV embeds a future cost if the premium normalises; the Finance Act 2025 amendment to 115UA(2) and the Taxation and Other Laws (Amendment) Act 2026 (assent 17 Aug 2026) make the dividend component more uniformly exempt while interest / rental components stay slab-taxed and a higher 25% SPV-level surcharge applies',
    publisher: 'Mint (Lok Sabha 2026 amendment report) / The Hindu Business Line / Finoscape (REIT-InvIT distribution treatment) / SEBI Item 13 memo (Sep 2025)',
    url: 'https://www.livemint.com/money/personal-finance/reit-invit-dividend-tax-relief-may-boost-investor-returns-know-who-benefits-and-what-remains-taxable-11786368498754.html',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'REIT / InvIT total return is distribution + NAV appreciation + change in the NAV premium/discount; a fat premium at purchase is a future cost if the premium normalises back to NAV',
      'The proposed dividend-uniformity change makes the dividend component more uniformly exempt to unitholders regardless of the underlying SPV tax regime, but the interest and other distribution components remain slab-taxed',
      'The uniform exemption comes with a higher 25% surcharge payable by the underlying SPVs that opt for the concessional regime - an industry-flagged trade-off that tempers the immediate benefit',
      'The amendment is the Taxation and Other Laws (Amendment) Act 2026 (assent 17 Aug 2026); the current-year wording of 115UA(2) and the dividend component breakup must be verified with a CA before acting',
    ],
    notes: 'Confirm the current-year 115UA wording, the 25% SPV surcharge figure, and the component-level TDS rates against the final Finance Act text and each REIT / InvIT distribution statement before advising.',
  });
}
write('content-registry/sources.json', Array.isArray(sources) ? sArr : sources);
console.log('sources total:', (Array.isArray(sources) ? sArr : sources.sources).length);

// ---------- ARTICLES ----------
const art = read('content-registry/articles.json');
const aArr = art.articles || art;
const aHave = new Set(aArr.map((a) => a.id));

if (!aHave.has('alternatives-sif-strategy-families-deep-dive')) {
  aArr.push({
    id: 'alternatives-sif-strategy-families-deep-dive',
    title: 'SIF Strategy Families Decoded: The 7 Permitted Strategies, the Scheme-Document Mechanics & Sleeve-Sizing Math',
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['sif', 'strategy-families', 'long-short', 'market-neutral', 'sebi-2026', 'sleeve-sizing', 'fee-drag', 'scheme-document'],
    summary: 'Beyond the Rs.10L minimum: what SEBI 2026 actually permits a SIF to run (the seven strategy families), how to read the derivative-policy, allocation and governance annexes in the scheme document, the sleeve-sizing fee-decay math, and when a SIF sleeve earns its place on top of a mutual-fund core.',
    file: 'src/content/alternatives/alternatives-sif-strategy-families-deep-dive.mdx',
    sources: ['src-sebi-mf-regulations-2026', 'src-sebi-sif-2026', 'src-sif-strategy-families-2026'],
    related: ['alternatives-sif-specialized-funds', 'alternatives-hnw-pms-aif-sif-selection', 'mf-choosing-comparing-funds', 'portfolio-construction-rebalancing', 'pf-wealth-plan-10-lakh'],
    books: ['book-wealth-beyond-10l'],
  });
}

if (!aHave.has('real-estate-reit-invit-dividend-timing-tax')) {
  aArr.push({
    id: 'real-estate-reit-invit-dividend-timing-tax',
    title: 'REIT & InvIT Dividend Timing, the 12-Month Clock & the NAV Premium/Discount Trade',
    category: 'real-estate',
    difficulty: 'advanced',
    status: 'published',
    tags: ['reit', 'invit', 'timing', 'ltcg', 'nav-premium', 'dividend', '115ua', 'business-trust', 'tax-free-stack'],
    summary: 'The timing and total-return layer over the REIT/InvIT tax table: the 12-month long-term capital-gains clock, how the NAV premium/discount drags the effective yield, reinvest-vs-redeem, distribution timing into the tax-free stack, and the exit math that decides when to sell.',
    file: 'src/content/real-estate/real-estate-reit-invit-dividend-timing-tax.mdx',
    sources: ['src-reit-invit-tax-2026', 'src-reit-invit-premium-discount-2026', 'src-elss-ltcg-2026'],
    related: ['real-estate-reit-invit', 'tax-tax-free-wealth-stack', 'tax-loss-harvesting', 'pf-wealth-plan-10-lakh', 'portfolio-construction-rebalancing'],
    books: [],
  });
}
write('content-registry/articles.json', art);
console.log('articles total:', aArr.length);

// ---------- UPDATE-LOG ----------
const upd = read('content-registry/update-log.json');
const uArr = upd.entries;
const uHave = new Set(uArr.map((e) => e.id));
if (!uHave.has('ul-sif-strategy-families-2026')) {
  uArr.push({
    id: 'ul-sif-strategy-families-2026',
    claim: 'SIF strategy families (SEBI MF Regs 2026, secondary): seven permitted long-short / relative-value families; illustrative 75/25 blend with ~25% naked-short cap; ~2.25% management + ~2% distribution expense; daily NAV pricing; SIP/STP allowed',
    source: 'src-sif-strategy-families-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'The "seven families" and the 75/25 blend are secondary-guide readings, not a fixed SEBI named list; verify the exact caps against the SEBI circular and each scheme document.',
  });
}
if (!uHave.has('ul-reit-invit-dividend-uniformity-2026')) {
  uArr.push({
    id: 'ul-reit-invit-dividend-uniformity-2026',
    claim: 'Finance Bill 2026 (assent 17 Aug 2026) makes the REIT/InvIT dividend component more uniformly exempt to unitholders regardless of the SPV regime, with a higher 25% SPV surcharge trade-off; interest / rental components stay slab-taxed; 115UA(2) current-year wording must be verified with a CA',
    source: 'src-reit-invit-premium-discount-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-02-28',
    status: 'verified',
    notes: 'The 25% SPV-surcharge figure and the dividend-uniformity mechanics are from the Lok Sabha 2026 amendment report; confirm against the final Finance Act text and the REIT/InvIT distribution statement.',
  });
}
write('content-registry/update-log.json', upd);
console.log('update-log total:', uArr.length);

// ---------- BOOKS ----------
const books = read('content-registry/books.json');
const bArr = Array.isArray(books) ? books : books.books;
const wb = bArr.find((b) => b.id === 'book-wealth-beyond-10l');
if (wb && !wb.chapters.includes('alternatives-sif-strategy-families-deep-dive')) {
  wb.chapters.push('alternatives-sif-strategy-families-deep-dive');
}
write('content-registry/books.json', Array.isArray(books) ? bArr : books);
console.log('book-wealth-beyond-10l chapters:', wb.chapters.length);
