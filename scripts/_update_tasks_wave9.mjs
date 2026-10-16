// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 9.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '39 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation(115UB/64C-to-78); Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision (80C basket by risk, NPS side-door old-only, verified new-regime-wins-to-45L result)';
x.next_action =
  'Daily article habit: Wave-10 candidate = PMS-vs-AIF after-tax net-return comparator, ELSS lock-in / tax-shield standalone calculator, or re-model the regime decision including surcharge above 50L';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '67/67 unit tests pass (Wave-9 added deductionShieldFY27: old vs new regime with 80C/NPS/24b/80D buckets + per-bucket marginal value, verified new-regime-wins-to-45L scan)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 22 calculator pages';
u.validation_status =
  'builds; 22 calculator pages (Wave-9 added regime-80c-shield); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 9');
