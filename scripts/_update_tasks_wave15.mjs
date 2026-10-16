// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 15.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '45 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge; Wave-11 tax-surcharge-cess-high-income; Wave-12 tax-huf-second-slab-gifting; Wave-13 retirement-nps-exit-annuity-tax; Wave-14 alternatives-pre-ipo-unlisted-equity-hni; Wave-15 tax-senior-citizen-regime-decision (age brackets + 80TTB + verified new-regime-still-wins finding)';
x.next_action =
  'Daily article habit: Wave-16 candidate = NRI tax-structure article (DTAA/LRS interplay), an ESOP-vesting tax walkthrough, or a GIFT City FoF deep-dive; also resolve the open 80TTB conflict (ul-senior-80ttb-limit-2026)';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '104/104 unit tests pass (Wave-15 added seniorRegimeTaxFY27: age-bracket old-regime basic exemption (2.5/3/5L), the old-only senior stack (80TTB capped at limit+interest, 80D, 80C, 24b), 5/20/30 slabs + 87A-to-5L; new regime with no age benefit; both-regime effective rates + 80TTB value + regime winner)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 28 calculator pages';
u.validation_status =
  'builds; 28 calculator pages (Wave-15 added senior-regime-tax); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 15');
