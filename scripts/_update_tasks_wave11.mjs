// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 11.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '41 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income (3-tier tax, new-regime 25% surcharge cap vs old 37%, 15% equity cap, marginal relief)';
x.next_action =
  'Daily article habit: Wave-12 candidate = HUF / family-office structuring (HUF income tax, gifting rules, 234B/234C interplay), senior-citizen / NRI tax structures, or an ESOP-vesting tax-walkthrough calculator';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '79/79 unit tests pass (Wave-11 added highIncomeTaxFY27: both-regime end-to-end with 112A/111A equity heads, surcharge bands (new 25% cap / old 37% above 5Cr), 15% equity surcharge cap, marginal relief, 4% cess, effective rates, regime winner)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 24 calculator pages';
u.validation_status =
  'builds; 24 calculator pages (Wave-11 added high-income-regime); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 11');
