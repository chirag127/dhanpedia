// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 17.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '47 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income; Wave-12 tax-huf-second-slab-gifting; Wave-13 retirement-nps-exit-annuity-tax; Wave-14 alternatives-pre-ipo-unlisted-equity-hni; Wave-15 tax-senior-citizen-regime-decision; Wave-16 international-nri-tax-residency-tds-dtaa; Wave-17 tax-capital-gains-rollover-54-54f-54ec (rollover exemption math + 54EC 50L cap + breakers)';
x.next_action =
  'Daily article habit: Wave-18 candidate = ESOP-vesting tax walkthrough, GIFT City FoF deep-dive, a DTAA-by-country rate table, or a 54EC tranche tracker; also resolve the open 80TTB conflict (ul-senior-80ttb-limit-2026)';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '119/119 unit tests pass (Wave-17 added rolloverExemption: the proportional rule exempt=min(gain,reinvested), the 54EC 50L reinvestment cap, 54/54F no binding cap, and the two breakers (missed time window / short-term gain) returning exempt + taxable + tax saved + no-rollover bill)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 30 calculator pages';
u.validation_status =
  'builds; 30 calculator pages (Wave-17 added capital-gains-rollover); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 17');
