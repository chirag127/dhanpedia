// One-off: register Wave 4 articles, REIT source bump, book chapters, update-log entries
import fs from 'node:fs';

// ---- articles.json ----
const ap = 'content-registry/articles.json';
const a = JSON.parse(fs.readFileSync(ap, 'utf8'));
const haveA = new Set(a.articles.map((x) => x.id));

const newArticles = [
  {
    id: 'tax-tax-free-wealth-stack',
    title: 'Building the Tax-Efficient Wealth Stack: 80C, NPS, PPF, ELSS & the Interest Layers, Worked Out',
    category: 'taxation',
    difficulty: 'intermediate',
    status: 'published',
    tags: ['80c', 'nps', 'ppf', 'elss', 'deductions', 'tax-planning'],
    summary: 'Every tax-saving layer stacked and worked out: 80C instruments, the NPS 80CCD route with the Dec 2025 80/20 exit change, 80TTB/80TTA interest layers, tax-free SGBs/PPF, a worked 18L-income example, and the new-vs-old regime break-even.',
    file: 'src/content/taxation/tax-tax-free-wealth-stack.mdx',
    sources: ['src-it-80c-150k', 'src-nps-2025-exit', 'src-nps-deductions-2026', 'src-elss-ltcg-2026', 'src-eldeductions-fy2026-27', 'src-it-slab-fy2026-27', 'src-sgb-discontinued', 'src-scss-8-2'],
    related: ['tax-india-investor-complete', 'govt-small-savings-schemes', 'tax-huf-wealth-structure', 'retirement-fire-annuities', 'pf-wealth-plan-10-lakh'],
    books: ['book-indian-taxation']
  },
  {
    id: 'tax-huf-wealth-structure',
    title: 'HUF Wealth Structure: The Second Tax Entity Your Family Can Legally Create',
    category: 'taxation',
    difficulty: 'advanced',
    status: 'published',
    tags: ['huf', 'karta', 'pan', 'clubbing', 'family'],
    summary: 'HUF as a separate income-tax person: creation, deed, PAN and ITR-2, what income may sit in the HUF, the Section 64(2)/99(3)-(4) clubbing traps, the Vineeta Sharma partition position, and a worked two-entity example.',
    file: 'src/content/taxation/tax-huf-wealth-structure.mdx',
    sources: ['src-huf-tax-2026', 'src-it-slab-fy2026-27', 'src-gift-tax-it-dept', 'src-wills-succession-2026'],
    related: ['tax-india-investor-complete', 'tax-tax-free-wealth-stack', 'pf-wills-succession'],
    books: ['book-indian-taxation']
  },
  {
    id: 'fixed-income-nbfc-debentures',
    title: 'NBFC Debenture Underwriting: How NCD Yields Are Set, How to Vouch for an NBFC, and the Tax Position',
    category: 'fixed-income',
    difficulty: 'advanced',
    status: 'published',
    tags: ['ncd', 'nbfc', 'corporate-bonds', 'credit', 'high-yield'],
    summary: 'The retail fixed-income middle rung: how NCD coupons are priced off the G-Sec plus a credit spread, the 2026 yield ladder by rating, the 7-point underwriting checklist, cohort default data, diversification math, and the coupon-vs-YTM and tax positions.',
    file: 'src/content/fixed-income/fixed-income-nbfc-debentures.mdx',
    sources: ['src-ncd-rates-2026', 'src-hyb-bonds-2026', 'src-rbi-repo', 'src-dicgc-deposit-insurance'],
    related: ['fixed-income-bonds-credit', 'p2p-lending-complete', 'banking-safety-deposits-fd', 'tax-tax-free-wealth-stack'],
    books: ['book-p2p-lending']
  },
];

for (const art of newArticles) {
  if (haveA.has(art.id)) { console.log('SKIP article:', art.id); continue; }
  a.articles.push(art);
  console.log('ADDED article:', art.id);
}

// REIT article: add new sources
const reit = a.articles.find((x) => x.id === 'real-estate-reit-invit');
if (reit) {
  const extra = ['src-reit-invit-tax-2026', 'src-elss-ltcg-2026'].filter((s) => !reit.sources.includes(s));
  reit.sources = [...reit.sources, ...extra];
  if (!reit.related.includes('tax-tax-free-wealth-stack')) reit.related.push('tax-tax-free-wealth-stack');
  console.log('UPDATED reit sources:', reit.sources.join(', '));
}
fs.writeFileSync(ap, JSON.stringify(a, null, 1) + '\n', 'utf8');
console.log('total articles now:', a.articles.length);

// ---- books.json ----
const bp = 'content-registry/books.json';
const b = JSON.parse(fs.readFileSync(bp, 'utf8'));
for (const bk of b.books) {
  if (bk.id === 'book-indian-taxation') {
    for (const ch of ['tax-tax-free-wealth-stack', 'tax-huf-wealth-structure']) {
      if (!bk.chapters.includes(ch)) bk.chapters.push(ch);
    }
  }
  if (bk.id === 'book-p2p-lending') {
    if (!bk.chapters.includes('fixed-income-nbfc-debentures')) bk.chapters.push('fixed-income-nbfc-debentures');
  }
  if (bk.id === 'book-complete-indian-investor') {
    if (!bk.chapters.includes('tax-tax-free-wealth-stack')) bk.chapters.push('tax-tax-free-wealth-stack');
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
    id: 'ul-nps-exit-80-20',
    claim: 'Non-government NPS exit: PFRDA 16 Dec 2025 amendment allows 80% lump sum / 20% min annuity (was 60/40), deferment to age 85, 100% withdrawal for corpus under Rs 8L; Section 10(12A) tax exemption still covers only 60% of the corpus',
    source: 'src-nps-2025-exit',
    lastVerified: '2026-10-17',
    reviewAfter: '2027-04-01',
    status: 'verified'
  },
  {
    id: 'ul-nps-80ccd-structure',
    claim: 'NPS deductions: 80CCD(1B) Rs 50,000 extra (old regime, incl. NPS Vatsalya from FY 2025-26); 80CCD(2) employer up to 14% both regimes (raised from 10% private, FY 2025-26); combined employer EPF+NPS+superannuation exempt cap Rs 7.5L/yr',
    source: 'src-nps-deductions-2026',
    lastVerified: '2026-10-17',
    reviewAfter: '2027-04-01',
    status: 'verified'
  },
  {
    id: 'ul-elss-ltcg-bucket',
    claim: 'ELSS: Rs 1.5L 80C (old regime only), 3-year lock-in per allotment; equity MF LTCG 12.5% above Rs 1.25L/yr shared bucket (Finance No.2 Act 2024); REIT/InvIT units share the same Sec 112A exemption',
    source: 'src-elss-ltcg-2026',
    lastVerified: '2026-10-17',
    reviewAfter: '2027-04-01',
    status: 'verified'
  },
  {
    id: 'ul-80ttb-reported-hike',
    claim: 'REPORTED (secondary): Budget 2026 raised 80TTB senior-citizen interest deduction to Rs 1L and doubled the TDS threshold; Income Tax Department threshold page still shows Rs 50,000 - verify before AY 2026-27 filing',
    source: 'src-eldeductions-fy2026-27',
    lastVerified: '2026-10-17',
    reviewAfter: '2026-12-31',
    status: 'unverified-conflict'
  },
  {
    id: 'ul-huf-clubbing-2025act',
    claim: 'HUF: separate taxable person (Sec 2(31)), own PAN, ITR-2/ITR-3; clubbing of member-gifted property income under Sec 64(2) of the 1961 Act = Sec 99(3)-(4) of the Income Tax Act 2025 (in force 1 Apr 2026); Vineeta Sharma partition is not taxable',
    source: 'src-huf-tax-2026',
    lastVerified: '2026-10-17',
    reviewAfter: '2027-04-01',
    status: 'verified'
  },
  {
    id: 'ul-reit-115ua-treatment',
    claim: 'REIT/InvIT: Sec 115UA pass-through; dividend exempt only if SPV NOT under 115BAA; 194LBA TDS 10% no threshold (resident); return-of-capital 56(2)(xii) from AY 2024-25; 112A LTCG 12.5% above Rs 1.25L, 111A STCG 20% under 12 months; TA Amendment Act 2026 (assent 17 Aug 2026) touched dividend wording - re-verify',
    source: 'src-reit-invit-tax-2026',
    lastVerified: '2026-10-17',
    reviewAfter: '2027-04-01',
    status: 'verified'
  },
  {
    id: 'ul-ncd-yield-ladder',
    claim: 'Q2 2026 NCD bands: AAA 7.0-8.0%, AA 8.0-9.5%, A 9.5-11.5%, BBB 11.5-13%+; repo floor 5.25%, 10-yr G-Sec ~6.5-6.8%; NCD tax FY 2026-27: coupon at slab, no TDS (listed, resident demat), LTCG 12.5% no indexation; CRISIL 3-yr cohort defaults A 1.5-3%, BBB 3-5%',
    source: 'src-ncd-rates-2026',
    lastVerified: '2026-10-17',
    reviewAfter: '2027-01-17',
    status: 'verified'
  },
];
for (const e of newEntries) {
  if (haveU.has(e.id)) { console.log('SKIP ul:', e.id); continue; }
  ul.entries.push(e);
  console.log('ADDED update-log:', e.id);
}
fs.writeFileSync(up, JSON.stringify(ul, null, 1) + '\n', 'utf8');
console.log('total update-log entries now:', ul.entries.length);
