// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 8.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '38 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation(115UB/64C-to-78)+sif-sleeve-sizing+reit-invit-timing calculators; Wave-8 alternatives-aif-waterfall-economics (2/20 ladder, 500Cr worked, clawback)';
x.next_action =
  'Daily article habit: Wave-9 candidate = ELSS + NPS tax-shield standalone calculators (80CCD(1B) old-regime-only per ul-80ccd1b-regime-clarification-2026; new regime = 80CCD(2) employer NPS only), or a PMS-vs-AIF after-tax net-return comparator';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '60/60 unit tests pass (Wave-8 added aifWaterfall: end-of-fund 2/20 waterfall, verified vs Nucleus 500Cr/3x/10yr worked example LP 1300 / GP carry 200)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 21 calculator pages';
u.validation_status =
  'builds; 21 calculator pages (Wave-8 added aif-waterfall); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 8');
