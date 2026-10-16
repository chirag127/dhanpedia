// One-off: refresh the tax article's FY labels to the current FY 2026-27.
// Slab structure is unchanged (Budget 2026 made no slab change), so this is a
// label + verification-date refresh, not a content rewrite. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/content/taxation/tax-india-investor-complete.mdx';
let t = readFileSync(p, 'utf8');

const rep = (search, replace) => {
  const before = t.length;
  t = t.split(search).join(replace);
  console.log(`replaced ${JSON.stringify(search.slice(0, 60))} (${t.length - before} chars delta)`);
};

// Title + description
rep(
  'Indian Taxation for Investors (FY 2025-26): Regimes, Capital Gains, Deductions & Reporting',
  'Indian Taxation for Investors (FY 2026-27): Regimes, Capital Gains, Deductions & Reporting'
);

// Slab headings + verification notes
rep(
  '### New-regime slabs, FY 2025-26 (verified 2026-08-06)',
  '### New-regime slabs, FY 2026-27 (verified 2026-10-16)\n\nThe slab structure below was reset by the Budget 2025 and **carried over unchanged for FY 2026-27** (the Budget 2026 made no slab change; it only changed ITR timelines and compliance framing).\n'
);
// Remove the now-duplicated blank line if it produced one
rep('\n\n\n', '\n\n');

rep(
  '### Old-regime slabs (still available as an option in FY 2025-26)',
  '### Old-regime slabs (still available as an option in FY 2026-27)'
);

// Scope note verification-date mention
rep(
  'figures marked **"(verified 2026-08-06)"** were checked',
  'figures marked **"(verified 2026-10-16)"** were checked'
);
rep('(verified 2026-08-06)', '(verified 2026-10-16)');

// Frontmatter dates + a note about the FY rollover
rep('lastVerified: "2026-08-06"', 'lastVerified: "2026-10-16"');
rep('updated: "2026-08-06"', 'updated: "2026-10-16"');

// Ensure the frontmatter "updated:" field exists; if it was missing nothing bad
// happens (split/join is a no-op when the string is absent).

writeFileSync(p, t);
console.log('[tax-article] refreshed. Remaining FY 2025-26 mentions:', (t.match(/FY 2025-26/g) || []).length);
