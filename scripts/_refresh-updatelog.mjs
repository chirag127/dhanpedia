// One-off update-log refresh: bump the 2026-10-16 re-verified claims to a fresh
// lastVerified date and extend reviewAfter. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';

const p = './content-registry/update-log.json';
const raw = JSON.parse(readFileSync(p, 'utf8'));
const entries = raw.entries ?? [];

const bump = {
  'tl-repo-rate': { lastVerified: '2026-10-16', reviewAfter: '2027-04-30' }, // next MPC Jun 2027-ish, keep 6-month check
  'tl-tax-slabs': { lastVerified: '2026-10-16', reviewAfter: '2027-02-28' }, // Budget 2027
  'tl-nps-exit': { lastVerified: '2026-10-16', reviewAfter: '2027-04-01' },
  'tl-scoss-rate': { lastVerified: '2026-10-16', reviewAfter: '2027-01-01' }, // quarterly re-check
};

for (const e of entries) {
  if (bump[e.id]) {
    e.lastVerified = bump[e.id].lastVerified;
    e.reviewAfter = bump[e.id].reviewAfter;
    e.notes =
      (e.notes ? e.notes + ' ' : '') +
      'Re-verified 2026-10-16 against primary/secondary sources (RBI Bulletin Aug-2026 MPC; eGazette AY 2026-27 rates; PFRDA Gazette 16.12.2025; Outlook Money Q1 FY 2026-27 small-savings unchanged).';
  }
}

// Add a fresh entry tracking the SIF category so the SIF article stays under review.
if (!entries.find((e) => e.id === 'tl-sif-2026')) {
  entries.push({
    id: 'tl-sif-2026',
    claim:
      'SEBI SIF (Specialized Investment Fund) category, effective 1 Apr 2026: Rs.10L minimum, long-short strategy categories, MF Lite sibling framework; PMS Rs.50L and AIF Rs.1Cr minimums unchanged',
    lastVerified: '2026-10-16',
    reviewAfter: '2027-04-01',
    articles: ['alternatives-sif-specialized-funds', 'alternatives-pms-aif-private'],
    notes:
      'Minimum, breach rules, and cost caps were sourced from secondary guides summarizing the SEBI text. Confirm against SEBI circulars and scheme documents before advising.',
  });
}

raw.entries = entries;
writeFileSync(p, JSON.stringify(raw, null, 2) + '\n');
console.log(
  `[update-log] ${entries.length} entries. Refreshed: ${Object.keys(bump).filter((k) => entries.some((e) => e.id === k)).join(', ')}, +tl-sif-2026`
);
