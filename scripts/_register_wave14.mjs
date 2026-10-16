// One-off: register Wave 14 source, article, book chapter, and update-log entry.
// Safe parse -> mutate -> stringify pattern.
import fs from 'node:fs';

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p, v) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 1) + '\n');

// ---- sources ----
const sources = read('content-registry/sources.json');
const sarr = sources.sources ?? sources;
const shav = new Set(sarr.map((s) => s.id));

if (!shav.has('src-pre-ipo-unlisted-2026')) {
  sarr.push({
    id: 'src-pre-ipo-unlisted-2026',
    title:
      "Pre-IPO / unlisted equity (2026): ICDR Reg 17 - pre-IPO shares held by non-promoters are locked 6 months from IPO allotment (cannot sell into the listing pop); SEBI advisories (Aug 2016, Dec 2024, Jun 2026) - off-market unlisted-trade platforms are NOT SEBI-recognised, no clearing guarantee; supply sources (ESOP / angel / PE-VC secondary / promoter sell-down / pre-IPO placement); dealer-ask price discovery (inventory, lot size, news flow, last round); tax: unlisted >24m LTCG 12.5% (Sec 112, no indexation, no Rs 1.25L pool), unlisted <=24m STCG at slab; listed exchange sale >12m 112A 12.5% above the shared Rs 1.25L pool, <=12m 111A 20%; holding clock starts at transfer, not listing; NSE unlisted case - bought ~1950-2050, IPO 1785, listed 1800, locked to ~Mar 2027",
    publisher: 'Money n Wealth (reviewed 14 Oct 2026) / We Grow Wealth (12 Sep 2026)',
    url: 'https://moneynwealth.in/insights/unlisted-pre-ipo-shares-risks',
    type: 'financial-publication',
    authority: 'secondary',
    verified: '2026-10-18',
    lastVerified: '2026-10-18',
    claims: [
      'ICDR Regulation 17 (SEBI ICDR Regulations, 2018): pre-IPO shares held by persons other than promoters are locked in for six months from the date of IPO allotment; promoters carry a longer lock-in',
      "SEBI advisories of Aug 2016, Dec 2024 and Jun 2026: platforms facilitating trades in unlisted securities are not authorised or recognised by SEBI; off-market trades have no clearing guarantee and no SEBI-administered investor protection; a platform claiming SEBI approval for unlisted trading is a red flag",
      'Unlisted equity capital gains: held > 24 months is long-term at 12.5% without indexation and with NO Rs 1.25L exemption (Sec 112); held <= 24 months is short-term at the taxpayer slab rate',
      'A listed exchange sale (STT paid): > 12 months long-term at 12.5% above the shared Rs 1.25L pool (Sec 112A); <= 12 months short-term at 20% (Sec 111A); the holding period starts at the acquisition transfer, not at listing',
      'Pre-IPO supply sources: employee ESOPs (most common, spikes after vesting cliffs), early angels/seed (large clean lots), PE/VC secondary (often with a negotiated floor), promoter sell-down, pre-IPO placement (rarely in retail size); the quoted price is a dealer ask that moves on inventory, lot size, IPO news flow and the last funding round',
      'Worked 2026 case: NSE unlisted shares bought at ~1,950-2,050; the September 2026 IPO priced at 1,785 via institutional book-building; listed at 1,800 and dipped toward 1,761; pre-IPO holders were in the 6-month lock-in to about March 2027 and could not sell',
      'The IPO may not happen (DRHPs lapse/are withdrawn) and may price below the pre-IPO entry; unlisted shares in a company with no listing plan have only a private buyer as the exit',
    ],
    notes: 'The 12.5% 112 rate and the 24-month unlisted holding test are the post-Budget-2024 position; confirm the current-year section numbers (and any Act-2025 renumbering) with a CA before acting. The SEBI platform position is a regulatory warning, not a change to the underlying private transaction law (Companies Act / articles compliance).',
  });
}
write('content-registry/sources.json', sources);

// ---- articles ----
const articles = read('content-registry/articles.json');
const aarr = articles.articles ?? articles;
const ahav = new Set(aarr.map((s) => s.id));

if (!ahav.has('alternatives-pre-ipo-unlisted-equity-hni')) {
  aarr.push({
    id: 'alternatives-pre-ipo-unlisted-equity-hni',
    title: 'Pre-IPO & Unlisted Equity: The Rung Between SIF and AIF (Lock-in, the Reg-17 Trap & the Tax Split Most Buyers Miss)',
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['pre-ipo', 'unlisted-shares', 'private-markets', 'icdr-reg-17', 'lock-in', 'slab-rate', '112a', '112', 'sebi', 'hni', 'dealers', 'off-market'],
    summary:
      'The direct private-market rung between SIF (Rs 10L) and AIF (Rs 1Cr): how to lawfully buy pre-IPO/unlisted shares off-market, why ICDR Reg 17 six-month post-IPO lock-in means you cannot sell into the listing pop, why SEBI does not recognise the off-market platforms, where the supply comes from, the 24-month/112 (no pool) vs 12-month/112A (shared pool) tax split with STCG-at-slab, and when to say no.',
    file: 'src/content/alternatives/alternatives-pre-ipo-unlisted-equity-hni.mdx',
    sources: ['src-pre-ipo-unlisted-2026', 'src-elss-ltcg-2026', 'src-aif-categories-2026'],
    related: ['alternatives-pms-aif-private', 'alternatives-aif-category-selection-guide', 'alternatives-pms-sif-aif-after-tax-wedge', 'alternatives-sif-specialized-funds', 'pf-wealth-plan-10-lakh'],
    books: ['book-wealth-beyond-10l'],
  });
}
write('content-registry/articles.json', articles);

// ---- books ----
const books = read('content-registry/books.json');
const barr = books.books ?? books;
const bwe = barr.find((b) => b.id === 'book-wealth-beyond-10l');
if (bwe && !bwe.chapters.includes('alternatives-pre-ipo-unlisted-equity-hni')) {
  bwe.chapters.push('alternatives-pre-ipo-unlisted-equity-hni');
}
write('content-registry/books.json', books);

// ---- update-log ----
const ulog = read('content-registry/update-log.json');
const uarr = ulog.entries ?? ulog.updates ?? ulog;
const uhav = new Set(uarr.map((s) => s.id));

if (!uhav.has('ul-pre-ipo-reg17-lockin-2026')) {
  uarr.push({
    id: 'ul-pre-ipo-reg17-lockin-2026',
    claim:
      'ICDR Reg 17: pre-IPO shares held by non-promoters are locked 6 months from IPO allotment (no selling into the listing pop); SEBI advisories (Aug 2016 / Dec 2024 / Jun 2026): off-market unlisted-trade platforms are not SEBI-recognised, no clearing guarantee; unlisted >24m LTCG 12.5% (Sec 112, no indexation, no pool), unlisted <=24m STCG at slab; listed sale >12m 112A pool / <=12m 111A 20%; holding clock starts at transfer',
    source: 'src-pre-ipo-unlisted-2026',
    lastVerified: '2026-10-18',
    reviewAfter: '2027-04-17',
    status: 'verified',
    notes: 'The Reg 17 six-month lock-in and the SEBI platform position are stable regulatory points; re-verify the 12.5% 112/112A section numbers and any Act-2025 renumbering at each Finance Act, and confirm the current SEBI advisory list before relying on it.',
  });
}
write('content-registry/update-log.json', ulog);

console.log('Wave 14 registry updated: 1 source, 1 article, book-wealth-beyond-10l +1 chapter, 1 update-log entry');
