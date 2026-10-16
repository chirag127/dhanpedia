// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 12.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '42 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income; Wave-12 tax-huf-second-slab-gifting-high-income (HUF second-slab, 56(2) gifting cliff, 64(2) self-acquired clubbing, two advance-tax clocks)';
x.next_action =
  'Daily article habit: Wave-13 candidate = ESOP-vesting tax walkthrough (exercise/ESOT/SSTT/112A timing, new-regime impact), NPS 80CCD(1B)/(2) tax-shield calculator, or senior-citizen + NRI tax structures';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '84/84 unit tests pass (Wave-12 added hufIncomeSplitFY27: solo vs two-PAN split through highIncomeTaxFY27, annual saving, effective rates, per-PAN advance-tax flags)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 25 calculator pages';
u.validation_status =
  'builds; 25 calculator pages (Wave-12 added huf-income-split); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 12');
