// One-off registry update: refresh time-sensitive source entries to their
// latest verified values and add SIF-specific entries. Idempotent: safe to
// re-run; only rewrites entries whose content differs.
import { readFileSync, writeFileSync } from 'node:fs';

const p = './content-registry/sources.json';
const raw = JSON.parse(readFileSync(p, 'utf8'));
const list = raw.sources ?? raw;

const byId = Object.fromEntries(list.map((s) => [s.id, s]));

// 1) PFRDA NPS exit source: point at the primary PFRDA gazette, keep wiki as
//    a corroborating note.
if (byId['src-nps-2025-exit']) {
  byId['src-nps-2025-exit'].title =
    'PFRDA (Exits and Withdrawals under the NPS) (Amendment) Regulations, 2025, w.e.f. 16 Dec 2025';
  byId['src-nps-2025-exit'].url =
    'https://www.pfrda.org.in/documents/33652/184762/Gazette+PFRDA+Exit+and+Withdrawals+under+the+NPS+Amendment+Regulations+2025.pdf';
  byId['src-nps-2025-exit'].authority = 'primary';
  byId['src-nps-2025-exit'].verified = '2026-10-16';
  byId['src-nps-2025-exit'].claims =
    'Non-gov NPS: no 5-yr lock-in; 80% lump-sum exit / 20% min annuity; deferment to age 85; Rs.8L corpus 100% withdrawal; up to 100% equity option';
  byId['src-nps-2025-exit'].notes =
    'Gazette PDF is the primary text. PFRDA press release (19 Dec 2025) and secondary summaries (thewealthblog.in, outlookmoney.com) corroborate.';
}

// 2) Repo rate: point at the primary RBI MPC document (Aug 2026), note FY26.
if (byId['src-rbi-repo']) {
  byId['src-rbi-repo'].title =
    'RBI MPC decision, 3-5 Aug 2026: repo held at 5.25%, neutral stance, SDF 5.00%, MSF 5.50%';
  byId['src-rbi-repo'].url = 'https://www.rbi.org.in/SCRIPTs/BS_ViewBulletin.aspx?Id=24369';
  byId['src-rbi-repo'].authority = 'primary';
  byId['src-rbi-repo'].verified = '2026-10-16';
  byId['src-rbi-repo'].claims =
    'Repo 5.25% (held 4 straight meetings incl. Aug 2026), neutral stance; SDF 5.00%, MSF/Bank Rate 5.50%';
  byId['src-rbi-repo'].notes =
    'Re-verify at each of the 6 MPC meetings. Fixed reverse repo 3.35% per the same press release.';
}

// 3) Tax slab source: refresh to FY 2026-27 (AY 2027-28), slabs unchanged from
//    Budget-2025 reset; keep a corroborating entry as well.
if (byId['src-it-slab-fy2025-26']) {
  byId['src-it-slab-fy2025-26'].title =
    'Income-tax slabs, new regime, FY 2026-27 (AY 2027-28) - unchanged from the Budget 2025 reset';
  byId['src-it-slab-fy2025-26'].url =
    'https://www.indiabudget.gov.in/doc/Finance_Bill.pdf';
  byId['src-it-slab-fy2025-26'].verified = '2026-10-16';
  byId['src-it-slab-fy2025-26'].claims =
    'New regime 7-slab: 0-4L nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, above 30%; 87A Rs.60,000 rebate to Rs.12L (Rs.12.75L gross for salaried); standard deduction Rs.75,000; old regime slabs unchanged';
  byId['src-it-slab-fy2025-26'].notes =
    'eGazette S.C.-DL.A.-31032026-271439 (rates for AY 2026-27) is the authoritative rates document; Budget 2026 made no slab change.';
}

// 4) SCSS source: confirm 8.2% is current through Q1 FY 2026-27.
if (byId['src-scss-8-2']) {
  byId['src-scss-8-2'].verified = '2026-10-16';
  byId['src-scss-8-2'].claims =
    'SCSS 8.2% p.a. for Q1 FY 2026-27 (Apr-Jun 2026), 8 consecutive quarters unchanged; PPF 7.1%, MIS 7.4%, NSC 7.7%';
  byId['src-scss-8-2'].notes =
    'Outlook Money 01 Apr 2026: rates unchanged for 8 straight quarters. Re-verify each quarter (revisions announced ~last week of Mar/Jun/Sep/Dec).';
}

// 5) New: SIF source entries (SEBI MF Regulations 2026).
if (!list.find((s) => s.id === 'src-sebi-sif-2026')) {
  list.push({
    id: 'src-sebi-sif-2026',
    publisher: 'SEBI (via secondary fund guides)',
    title: 'SIF vs Mutual Funds vs PMS vs AIF: Where SEBI\u2019s New 2026 Category Fits',
    url: 'https://www.finvastra.com/blog/sif-vs-mutual-funds-pms-aif-2026',
    type: 'regulator',
    authority: 'secondary',
    verified: '2026-10-16',
    claims:
      'SIF: SEBI (MF) Regs 2026 effective 1 Apr 2026; min Rs.10L per PAN aggregate within one AMC; SIP/STP allowed; passive breach \u2192 full redemption only; active breach \u2192 units frozen 30 days; accredited investors exempt; MF Lite sibling for passive-only funds',
    notes: 'Confirm minimum/breach details against the SEBI circular text and each scheme document before advising.',
  });
}
if (!list.find((s) => s.id === 'src-sebi-sif-categories')) {
  list.push({
    id: 'src-sebi-sif-categories',
    publisher: 'SEBI (via SIF guide)',
    title: 'SIF strategy categories, long-short caps, cost caps (SEBI MF Regulations 2026)',
    url: 'https://sifmf.in/index.php/sif-basics',
    type: 'regulator',
    authority: 'secondary',
    verified: '2026-10-16',
    claims:
      'SIF categories: Equity Long-Short (market-neutral, ~75/25 illustrative), Debt Long-Short (duration/credit); naked shorts up to ~25% + hedging; expense cap ~2.25%+2%; investor-level tax like MFs by asset class; AIF Cat III differs (CG 12.5% + business income 30%)',
    notes: 'Medium confidence: caps and category specifics are secondary summaries - verify against the SEBI text and scheme document.',
  });
}

raw.sources = list;
writeFileSync(p, JSON.stringify(raw, null, 2) + '\n');
console.log(
  `[sources] updated. Total entries: ${list.length} (repo=${byId['src-rbi-repo']?.verified}, nps=${byId['src-nps-2025-exit']?.verified}, tax=${byId['src-it-slab-fy2025-26']?.verified}, scss=${byId['src-scss-8-2']?.verified})`
);
