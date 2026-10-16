// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 16.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '46 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income; Wave-12 tax-huf-second-slab-gifting; Wave-13 retirement-nps-exit-annuity-tax; Wave-14 alternatives-pre-ipo-unlisted-equity-hni; Wave-15 tax-senior-citizen-regime-decision; Wave-16 international-nri-tax-residency-tds-dtaa (Section 6 residency, 195 TDS, DTAA/10F/67, 87A exclusion, ITR-2/3)';
x.next_action =
  'Daily article habit: Wave-17 candidate = ESOP-vesting tax walkthrough (exercise/ESOT/SSTT/112A timing, new-regime impact), a GIFT City FoF deep-dive, or a DTAA-by-country rate reference table; also resolve the open 80TTB conflict (ul-senior-80ttb-limit-2026)';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '112/112 unit tests pass (Wave-16 added nriIndiaTaxFY27: Section 6 residency day-counting (182-day + 60/365 or 120/365 long test with the high-income variant), lower-of-domestic-and-DTAA TDS rate, TDS + 4% cess, DTAA relief in Rs terms)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 29 calculator pages';
u.validation_status =
  'builds; 29 calculator pages (Wave-16 added nri-india-tax); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 16');
