// One-off: update progress/TASKS.json T-articles, T-search, T-e2e for Wave 7.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '37 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 added tax-free-stack, HUF, NCD + REIT tax; Wave-5 added hnw-pms-aif-sif-selection + advance-tax/itr-checklist; Wave-6 added sif-strategy-families-deep-dive + reit-invit-dividend-timing-tax; Wave-7 added alternatives-aif-category-selection-guide + tax-aif-pcc-115bb-deep-dive (115UB pass-through / 64C-to-78 migration) and wired sif-sleeve-sizing + reit-invit-timing calculators';
x.next_action =
  'Daily article habit: Wave-8 candidate = AIF carry-return / high-water-line calculator, ELSS + NPS tax-shield standalone calculators, or a PMS-vs-AIF after-tax net-return comparator';
const s = arr.find((y) => y.id === 'T-search');
s.status = 'complete';
s.validation_status = 'Pagefind indexed at build time (16,951 words); /search page present; e2e verifies the build pipeline';
const e = arr.find((y) => y.id === 'T-e2e');
e.status = 'complete';
e.validation_status = 'Playwright smoke suite: 32 tests (16 desktop + 16 mobile chromium) pass in CI and locally; Wave-7 added sif-sleeve-sizing + reit-invit-timing calculator tests and the 2 new Wave-7 article tests';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 7 (incl. T-search, T-e2e)');
