// Inspect + finish the FY 2026-27 label refresh for the tax article.
// Idempotent. Prints a precise report; applies remaining safe label updates.
import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/content/taxation/tax-india-investor-complete.mdx';
let t = readFileSync(p, 'utf8');
const report = [];
const log = (m) => report.push(m);

// --- frontmatter fields ---
const fm = t.slice(0, t.indexOf('---', 3));
const lv = (fm.match(/lastVerified:\s*"([^"]+)"/) || [])[1];
const up = (fm.match(/updated:\s*"([^"]+)"/) || [])[1];
log(`frontmatter lastVerified=${lv ?? 'MISSING'} updated=${up ?? 'MISSING'}`);

// Refresh frontmatter dates (safe, idempotent).
if (lv !== '2026-10-16') {
  t = t.replace(/lastVerified:\s*"[^"]+"/, 'lastVerified: "2026-10-16"');
  log('set frontmatter lastVerified -> 2026-10-16');
}
if (up !== '2026-10-16') {
  if (t.includes('updated: "')) t = t.replace(/updated:\s*"[^"]+"/, 'updated: "2026-10-16"');
  else t = t.replace(/\n---\n/, '\nupdated: "2026-10-16"\nlastVerified: "2026-10-16"\n---\n', 1);
  log('set frontmatter updated -> 2026-10-16');
}

// --- context-sensitive label fixes (keep past-dated "update log" history intact) ---
// 1) Old-regime parenthetical: the FY 2025-26 changes to lower slabs is a
//    historical note about WHEN they changed, so keep it accurate but clarify.
if (t.includes('(with the FY 2025-26 changes to some lower slabs)')) {
  t = t.replace(
    '(with the FY 2025-26 changes to some lower slabs)',
    '(those lower slabs were widened in Budget 2025 and carry over unchanged to FY 2026-27)'
  );
  log('clarified old-regime parenthetical');
}

// 2) Surcharge note: label it as the current structure as of verification date.
if (t.includes('a top-up on tax f') && t.includes('Surcharge')) {
  t = t.replace(
    /(Surcharge[^:]*\(verified as the current FY 2025-26 structure\))/,
    'Surcharge (verified as the current FY 2026-27 structure, 2026-10-16)'
  );
  log('relabeled surcharge verification note');
}

// 3) Generic "(verified 2026-08-06)" still present? refresh the date only.
const staleCount = (t.match(/verified 2026-08-06/g) || []).length;
log(`remaining "verified 2026-08-06" count=${staleCount}`);
if (staleCount > 0) t = t.split('verified 2026-08-06').join('verified 2026-10-16');

// 4) The update-log table row "Verified FY 2025-26 new-regime slabs" is a
//    HISTORY entry (what was verified on that date). Keep the row, but add a
//    new row for the FY 2026-27 rollover verification.
if (!t.includes('FY 2026-27')) {
  log('no FY 2026-27 text yet - heading refresh not applied earlier?');
}
if (
  t.includes('| 2026-08-06 | Verified FY 2025-26 new-regime slabs') &&
  !t.includes('| 2026-10-16 | Confirmed FY 2026-27 carries the unchanged slab structure')
) {
  t = t.replace(
    '| 2026-08-06 | Verified FY 2025-26 new-regime slabs',
    '| 2026-10-16 | Confirmed FY 2026-27 carries the unchanged slab structure (Budget 2026 made no slab change) | see FY 2026-27 sources |\n| 2026-08-06 | Verified FY 2025-26 new-regime slabs'
  );
  log('prepended FY 2026-27 update-log row');
}

// 5) The source line describing src-it-slab-fy2025-26: keep the id (registry key)
//    but make the description current-FY accurate.
if (t.includes('FY 2025-26 slab structure and regime mec')) {
  t = t.replace(
    'FY 2025-26 slab structure and regime mec',
    'new-regime 7-slab structure (reset in Budget 2025, carried unchanged to FY 2026-27) and regime mec'
  );
  log('updated source-line description');
}

writeFileSync(p, t);
console.log(report.join('\n'));
console.log('--- FINAL remaining FY 2025-26 mentions ---');
let i = 0;
while ((i = t.indexOf('FY 2025-26', i)) >= 0) {
  console.log(JSON.stringify(t.slice(i - 80, i + 30)));
  i += 10;
}
