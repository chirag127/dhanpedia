// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 14.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '44 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income; Wave-12 tax-huf-second-slab-gifting; Wave-13 retirement-nps-exit-annuity-tax; Wave-14 alternatives-pre-ipo-unlisted-equity-hni (ICDR Reg 17 lock-in, SEBI off-market platform position, 24m/112 vs 12m/112A tax split)';
x.next_action =
  'Daily article habit: Wave-15 candidate = ESOP-vesting tax walkthrough (exercise/ESOT/SSTT/112A timing, new-regime impact), a senior-citizen + NRI tax-structure article, or a GIFT City FoF deep-dive';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '96/96 unit tests pass (Wave-14 added preIpoTaxOutcome: unlisted-LTCG Sec 112 12.5% no-pool / unlisted-STCG at slab / listed-LTCG Sec 112A above the shared pool / listed-STCG Sec 111A 20%; holding test switches on isListedAtSale; pool capped at the gross gain; after-tax net return on entry)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 27 calculator pages';
u.validation_status =
  'builds; 27 calculator pages (Wave-14 added pre-ipo-tax); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 14');
