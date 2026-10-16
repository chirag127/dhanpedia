// One-off: update progress/TASKS.json T-articles, T-calc, T-calc-ui for Wave 10.
import fs from 'node:fs';
const p = `${process.cwd()}/progress/TASKS.json`;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = t.tasks ?? t;
const x = arr.find((y) => y.id === 'T-articles');
x.title = '40 deep articles across all 17 avenues (source-cited, verified)';
x.validation_status =
  'Wave-4 tax-free-stack/HUF/NCD/REIT; Wave-5 hnw-selection+advance-tax; Wave-6 sif-strategy-families+reit-invit-timing; Wave-7 aif-category-selection+aif-taxation; Wave-8 aif-waterfall-economics; Wave-9 tax-80c-baskets-regime-decision; Wave-10 pms-sif-aif-after-tax-wedge (the after-tax pocket-landing comparison across the capital ladder)';
x.next_action =
  'Daily article habit: Wave-11 candidate = PMS-vs-AIF after-tax net-return comparator, re-model the regime decision with surcharge above 50L, or an ELSS lock-in / tax-shield standalone calculator';
const c = arr.find((y) => y.id === 'T-calc');
c.validation_status =
  '72/72 unit tests pass (Wave-10 added afterTaxProductWedge: end-of-horizon gross-final-value with product-specific tax landing (112A 12.5% / slab for unlisted pass-through / ~42.7% Cat III fund-level), compounding mgmt fee + exit perf fee, shared-LTCG-pool subtraction, after-tax CAGR + total wedge)';
const u = arr.find((y) => y.id === 'T-calc-ui');
u.title = 'React calculator islands + 23 calculator pages';
u.validation_status =
  'builds; 23 calculator pages (Wave-10 added pms-sif-aif-tax-wedge); data-driven via src/lib/calculators.ts + [id].astro';
fs.writeFileSync(p, JSON.stringify(t, null, 1) + '\n');
console.log('TASKS.json updated for Wave 10');
