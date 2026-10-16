// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 13.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '43 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income; Wave-12 tax-huf-second-slab-gifting; Wave-13 retirement-nps-exit-annuity-tax-deep-dive (PFRDA 16-Dec-2025 80/20 exit, 10(10A) 60% cap, annuity variants)';
x.next_action =
  'Daily article habit: Wave-14 candidate = ESOP-vesting tax walkthrough (exercise/ESOT/SSTT/112A timing, new-regime impact), a senior-citizen + NRI tax-structure article, or a GIFT City FoF deep-dive';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '90/90 unit tests pass (Wave-13 added npsRetirementExitFY27: PFRDA 16-Dec-2025 exit split (small-corpus 100% / premature 20/80 / normal 80/20), 10(10A) 60%-of-contributions exemption cap -> taxable lump sum, annuity corpus x flat rate -> after-tax income at the marginal slab)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 26 calculator pages';
u.validation_status =
  'builds; 26 calculator pages (Wave-13 added nps-retirement-exit); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 13');
