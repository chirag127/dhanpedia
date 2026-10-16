import { npsRetirementExitFY27 } from '../src/lib/finance/index.ts';

// 20k/month self + 10% employer = 22k total, 9%/yr, 30 years, 60% exit, 6.5% annuity, 30% slab
const r = npsRetirementExitFY27({
  monthlyContribution: 20000, employerPct: 0.1, annualReturn: 0.09, years: 30,
  smallCorpusThreshold: 800000, lumpSumPct: 0.8, annuityRate: 0.065,
  marginalTaxRate: 0.3, prematureExit: false,
});
const L = (x) => Math.round(x / 100000).toLocaleString('en-IN') + 'L';
console.log('corpus', L(r.corpus), 'contribs', L(r.totalContributions));
console.log('lumpSum(80%)', L(r.lumpSum), 'annuityCorpus', L(r.annuityCorpus));
console.log('exemptLumpSum(60% of contribs)', L(r.exemptLumpSum), 'taxableLumpSum', L(r.taxableLumpSum));
console.log('annual annuity income', L(r.annualAnnuityIncome), 'after-tax annuity', L(r.afterTaxAnnuityIncome));
console.log('after-tax total', L(r.totalAfterTax));

// Small corpus case: 5k/month, 10 yrs -> corpus ~ 8L or less
const s = npsRetirementExitFY27({
  monthlyContribution: 5000, employerPct: 0, annualReturn: 0.09, years: 10,
  smallCorpusThreshold: 800000, lumpSumPct: 0.8, annuityRate: 0.065,
  marginalTaxRate: 0.3, prematureExit: false,
});
console.log('\nSmall corpus:', L(s.corpus), 'isSmall', s.isSmallCorpus, 'lumpPct -> 100%', s.lumpSum === s.corpus);

// Premature exit: 20% / 80%
const p = npsRetirementExitFY27({
  monthlyContribution: 20000, employerPct: 0.1, annualReturn: 0.09, years: 15,
  smallCorpusThreshold: 800000, lumpSumPct: 0.8, annuityRate: 0.065,
  marginalTaxRate: 0.3, prematureExit: true,
});
console.log('Premature: lumpSum', L(p.lumpSum), 'annuityCorpus', L(p.annuityCorpus), '(20/80 split)');
