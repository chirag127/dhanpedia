/**
 * Unit tests for the DhanPedia financial calculation library.
 * Uses known numerical answers and independent cross-checks so a regression
 * in any formula is caught. Run with `npm test` (vitest).
 */
import {  describe, it, expect } from 'vitest';
import {
  simpleInterest, simpleInterestMaturity, compoundFutureValue, effectiveAnnualRate,
  presentValue, cagr, sipFutureValue, lumpSumFutureValue, sipRequiredForGoal,
  lumpSumRequiredForGoal, emi, loanAmortisation, realReturn, inflationErodedValue,
  xirr, irr, retirementCorpus, withdrawalSustainability, sustainableInitialWithdrawal,
  p2pExpectedNetReturn, portfolioExpectedReturn, maxDrawdown, feeImpact,
  bondPrice, macaulayDuration, currencyScenario, rentalYield, propertyTransactionCosts,
  pmsSimulation,
  newRegimeTaxFY27, oldRegimeTaxFY27, coreSatelliteBlend, advanceTaxFY27,
  sifSleeveSizing, businessTrustTiming, aifWaterfall, deductionShieldFY27, afterTaxProductWedge, highIncomeTaxFY27, hufIncomeSplitFY27, npsRetirementExitFY27, preIpoTaxOutcome, seniorRegimeTaxFY27, nriIndiaTaxFY27, rolloverExemption,
  dtaaReliefFY27, esopVestingTaxFY27, capitalLadderFY27,
  fiftyFourECTrancheTracker } from '@lib/finance/index';

const close = (a, b, tol = 1e-6) => Math.abs(a - b) < tol;

describe('simple & compound interest', () => {
  it('simple interest = P*r*t', () => {
    expect(simpleInterest(100000, 0.1, 2)).toBeCloseTo(20000, 3);
    expect(simpleInterestMaturity(100000, 0.1, 2)).toBeCloseTo(120000, 3);
  });

  it('compound FV annual = P(1+r)^t', () => {
    expect(compoundFutureValue(100000, 0.1, 2, 1)).toBeCloseTo(121000, 1);
  });

  it('monthly compounding beats annual', () => {
    const ann = compoundFutureValue(100000, 0.12, 1, 1);
    const monthly = compoundFutureValue(100000, 0.12, 1, 12);
    expect(monthly).toBeGreaterThan(ann);
    // 1.12 vs (1.01)^12 = 1.12682...
    expect(compoundFutureValue(100000, 0.12, 1, 12)).toBeCloseTo(112682.5, 0);
  });

  it('effective annual rate', () => {
    expect(effectiveAnnualRate(0.12, 12)).toBeCloseTo(Math.pow(1.01, 12) - 1, 8);
    expect(effectiveAnnualRate(0.12, 1)).toBeCloseTo(0.12, 8);
  });

  it('present value is the inverse of FV', () => {
    const pv = presentValue(121000, 0.1, 2);
    expect(pv).toBeCloseTo(100000, 3);
  });
});

describe('CAGR', () => {
  it('2x in 10 years ≈ 7.18%', () => {
    expect(cagr(100000, 200000, 10)).toBeCloseTo(0.0717734627, 6);
  });
  it('3.5x in 5 years ≈ 28.47%', () => {
    expect(cagr(100000, 350000, 5)).toBeCloseTo(0.2847351571, 6);
  });
  it('invalid inputs return NaN', () => {
    expect(Number.isNaN(cagr(0, 100, 5))).toBe(true);
    expect(Number.isNaN(cagr(100, 100, 0))).toBe(true);
  });
});

describe('SIP / goal planning', () => {
  it('SIP FV matches the annuity formula', () => {
    // 15000/mo, 1%/mo (12%/yr), 180 mo
    const fv = sipFutureValue(15000, 0.01, 180);
    const manual = 15000 * ((Math.pow(1.01, 180) - 1) / 0.01);
    expect(fv).toBeCloseTo(manual, 2);
    // Sanity: 1.01^180 ≈ 5.996 → (5.996-1)/0.01 = 499.6 → *15000 ≈ 74.9L
    expect(fv).toBeGreaterThan(7400000);
    expect(fv).toBeLessThan(7600000);
  });

  it('SIP FV at 0% rate = pmt * n', () => {
    expect(sipFutureValue(1000, 0, 120)).toBe(120000);
  });

  it('lump-sum FV with monthly compounding', () => {
    expect(lumpSumFutureValue(100000, 0.12, 1)).toBeCloseTo(100000 * Math.pow(1.01, 12), 2);
  });

  it('sipRequiredForGoal is the inverse of sipFutureValue', () => {
    const goal = 1000000;
    const pmt = sipRequiredForGoal(goal, 0.01, 120);
    expect(sipFutureValue(pmt, 0.01, 120)).toBeCloseTo(goal, 0);
  });

  it('lumpSumRequiredForGoal inverts', () => {
    const req = lumpSumRequiredForGoal(5000000, 0.1, 15);
    expect(req * Math.pow(1.1, 15)).toBeCloseTo(5000000, 0);
  });
});

describe('EMI & amortisation', () => {
  it('EMI formula', () => {
    // 10L at 8% annual over 10 yrs (120 mo): monthly rate 0.08/12
    // EMI = P*r*(1+r)^n/((1+r)^n-1) ≈ 12,132.76
    expect(emi(1000000, 0.08, 120)).toBeCloseTo(12132.76, 0);
  });
  it('EMI at 0% = principal/months', () => {
    expect(emi(1200000, 0, 120)).toBeCloseTo(10000, 3);
  });

  it('amortisation closes to ~0 and total interest is reasonable', () => {
    const rows = loanAmortisation(1000000, 0.08, 120);
    expect(rows[rows.length - 1].balance).toBeLessThan(1e-2);
    const totalInterest = rows.reduce((a, r) => a + r.interest, 0);
    // EMI ≈ 12,132.76 × 120 = 1,455,931; interest = 455,931
    expect(totalInterest).toBeGreaterThan(440000);
    expect(totalInterest).toBeLessThan(470000);
  });

  it('first payment is mostly interest', () => {
    const rows = loanAmortisation(1000000, 0.08, 120);
    expect(rows[0].interest).toBeCloseTo(1000000 * 0.08 / 12, 1); // 6666.67
    expect(rows[0].interest).toBeGreaterThan(rows[0].principal);
  });
});

describe('inflation & real returns', () => {
  it('real return = (1+nom)/(1+inf)-1', () => {
    expect(realReturn(0.12, 0.06)).toBeCloseTo((1.12 / 1.06 - 1), 8);
    expect(realReturn(0.12, 0.06)).toBeCloseTo(0.05660377, 5);
  });
  it('inflation erodes purchasing power', () => {
    expect(inflationErodedValue(1000000, 0.06, 10)).toBeCloseTo(1000000 / Math.pow(1.06, 10), 1);
    expect(inflationErodedValue(1000000, 0.06, 10)).toBeLessThan(560000);
  });
});

describe('XIRR / IRR', () => {
  it('XIRR of a 2-flow series equals annualised yield', () => {
    // -100000 at t0, +121000 at t=2yr → CAGR ~10%
    const now = Date.now();
    const x = xirr([
      { date: now - 2 * 365 * 86400000, amount: -100000 },
      { date: now, amount: 121000 },
    ]);
    expect(x).toBeCloseTo(0.1, 3);
  });

  it('XIRR with a lump-in and lump-out over 1 yr at 12%', () => {
    const now = Date.now();
    const x = xirr([
      { date: now - 365 * 86400000, amount: -100000 },
      { date: now, amount: 112000 },
    ]);
    expect(x).toBeCloseTo(0.12, 3);
  });

  it('XIRR returns NaN for fewer than 2 flows', () => {
    expect(Number.isNaN(xirr([{ date: '2024-01-01', amount: -1000 }]))).toBe(true);
  });

  it('IRR for annual flows (10k in, 112k out next year) ≈ 12%', () => {
    const r = irr([-100000, 112000]);
    expect(r).toBeCloseTo(0.12, 3);
  });
});

describe('retirement', () => {
  it('corpus factor method', () => {
    expect(retirementCorpus(1000000, 0.06, 30, 25)).toBeCloseTo(1000000 * Math.pow(1.06, 30) * 25, 0);
  });
  it('4% rule withdrawal', () => {
    expect(sustainableInitialWithdrawal(10000000, 0.04)).toBeCloseTo(400000, 0);
  });

  it('withdrawal sustainability — 12% initial draw is NOT sustainable', () => {
    // 1.2M draw on a 10M corpus (12%) with 7% growth & 6% inflation:
    // inflation-compounded withdrawals erode the corpus → runs out early.
    const r = withdrawalSustainability(10000000, 1200000, 0.07, 0.06, 30);
    expect(r.sustainable).toBe(false);
    expect(r.shortfallYear).toBeGreaterThan(0);
    expect(r.shortfallYear).toBeLessThan(15);
  });

  it('withdrawal sustainability — 4% draw at 7%/3% lasts', () => {
    const r = withdrawalSustainability(10000000, 400000, 0.07, 0.03, 30);
    expect(r.sustainable).toBe(true);
    expect(r.valueAfterYears).toBeGreaterThan(0);
  });

  it('withdrawal sustainability — too-high draw fails', () => {
    const r = withdrawalSustainability(5000000, 800000, 0.05, 0.06, 30);
    expect(r.sustainable).toBe(false);
    expect(r.shortfallYear).toBeGreaterThan(0);
  });
});

describe('P2P expected loss', () => {
  it('expected loss = PD * LGD, net return subtracts drag & fees', () => {
    const s = { grossAnnualReturn: 0.14, defaultRate: 0.04, lossGivenDefault: 0.6, idleCashDrag: 0.005, annualServiceFee: 0.01 };
    const r = p2pExpectedNetReturn(s);
    expect(r.expectedLoss).toBeCloseTo(0.024, 6);
    // net = 0.14 - 0.024 - 0.005 - 0.01 = 0.101
    expect(r.netReturn).toBeCloseTo(0.101, 6);
    expect(r.netAnnualValue).toBeCloseTo(10100, 1); // on 1L
  });

  it('severe scenario can go negative', () => {
    const s = { grossAnnualReturn: 0.14, defaultRate: 0.2, lossGivenDefault: 0.8, idleCashDrag: 0.005, annualServiceFee: 0.01 };
    expect(p2pExpectedNetReturn(s).netReturn).toBeLessThan(0);
  });
});

describe('portfolio metrics', () => {
  it('weighted expected return', () => {
    expect(portfolioExpectedReturn([
      { name: 'eq', allocation: 0.6, expectedReturn: 0.12 },
      { name: 'debt', allocation: 0.4, expectedReturn: 0.07 },
    ])).toBeCloseTo(0.1, 6);
  });

  it('max drawdown', () => {
    // 100 → 200 peak, down to 50 → dd = (200-50)/200 = 0.75
    expect(maxDrawdown([100, 200, 50, 120])).toBeCloseTo(0.75, 6);
  });

  it('fee impact reduces FV', () => {
    const f = feeImpact(100000, 0.12, 0.015, 15);
    expect(f.withFees).toBeLessThan(f.withoutFees);
    expect(f.drag).toBeGreaterThan(0);
    // Assert against the formulas directly (robust, no hardcoded constants).
    expect(f.withoutFees).toBeCloseTo(100000 * Math.pow(1.12, 15), 1);
    expect(f.withFees).toBeCloseTo(100000 * Math.pow(1.12 - 0.015, 15), 1);
    expect(f.withoutFees).toBeGreaterThan(540000);
    expect(f.withFees).toBeLessThan(460000);
  });
});

describe('bonds', () => {
  it('par bond (coupon = YTM) prices at par', () => {
    expect(bondPrice(1000, 0.07, 10, 0.07)).toBeCloseTo(1000, 2);
  });
  it('premium bond (coupon > YTM) prices above par', () => {
    expect(bondPrice(1000, 0.08, 10, 0.06)).toBeGreaterThan(1000);
  });
  it('discount bond (coupon < YTM) prices below par', () => {
    expect(bondPrice(1000, 0.05, 10, 0.07)).toBeLessThan(1000);
  });
  it('duration of a par 10yr 8% coupon bond ≈ 7.25 years', () => {
    // Par bond (coupon = YTM = 8%): Macaulay D = (1+y)/y * (1-(1+y)^-n)
    // = 1.08/0.08 * (1 - 1/1.08^10) ≈ 7.247
    expect(macaulayDuration(1000, 0.08, 10, 0.08)).toBeCloseTo(7.2469, 3);
  });
  it('zero-coupon bond duration = its maturity', () => {
    expect(macaulayDuration(1000, 0, 7, 0.05)).toBeCloseTo(7, 2);
  });
});

describe('PMS / AIF fee simulation', () => {
  it('layered mgmt + performance fees (10L, 15% gross, 2y, 1% mgmt, 20% perf on 10% benchmark)', () => {
    // Year 1: open=1,000,000 -> gross 1,150,000; mgmt 10,000 -> 1,140,000;
    //   netGain 140,000; benchmark 100,000; excess 40,000; perf 8,000 -> value 1,132,000
    // Year 2: open=1,132,000 -> gross 1,301,800; mgmt 11,320 -> 1,290,480;
    //   netGain 158,480; benchmark 113,200; excess 45,280; perf 9,056 -> value 1,281,424
    const r = pmsSimulation(1e6, 0.15, 2, 0.01, 0.2, 0.1);
    expect(r.finalValue).toBeCloseTo(1281424, 0);
    expect(r.totalMgmtFees).toBeCloseTo(21320, 0);
    expect(r.totalPerfFees).toBeCloseTo(17056, 0);
    expect(r.totalFees).toBeCloseTo(38376, 0);
    expect(r.feeShareOfFinal).toBeCloseTo(38376 / 1281424, 4);
  });
  it('no performance fee when the fund only meets (does not beat) the benchmark', () => {
    // gross = benchmark => netGain after mgmt is below benchmark => excess 0 => perf 0
    const r = pmsSimulation(1e6, 0.1, 1, 0.0, 0.2, 0.1);
    expect(r.totalPerfFees).toBeCloseTo(0, 6);
    expect(r.finalValue).toBeCloseTo(1.1e6, 0); // 1,000,000 * 1.10, no fees
  });
  it('fees reduce final value vs a no-fee identical gross return', () => {
    const withFees = pmsSimulation(1e6, 0.15, 5, 0.01, 0.2, 0.1).finalValue;
    const noFees = pmsSimulation(1e6, 0.15, 5, 0.0, 0.0, 0.1).finalValue;
    expect(withFees).toBeLessThan(noFees);
  });
});

describe('currency, rental, transaction costs', () => {
  it('currency depreciation scenario', () => {
    expect(currencyScenario(1000000, 0.03, 10)).toBeCloseTo(1000000 * Math.pow(0.97, 10), 1);
    expect(currencyScenario(1000000, 0.03, 10)).toBeLessThan(750000); // 0.97^10 ≈ 0.7374
  });
  it('rental yield', () => {
    expect(rentalYield(300000, 12000000)).toBeCloseTo(0.025, 6);
    expect(Number.isNaN(rentalYield(300000, 0))).toBe(true);
  });
  it('transaction costs round-trip', () => {
    expect(propertyTransactionCosts(10000000, 0.07, 0.02)).toBeCloseTo(900000, 0);
  });
});

describe('FY 2026-27 tax slabs', () => {
  it('new regime: slabs + 87A rebate', () => {
    // nil up to 12L via the 87A rebate
    expect(newRegimeTaxFY27(0)).toBe(0);
    expect(newRegimeTaxFY27(1200000)).toBe(0);
    // 14.25L -> 4L@0 + 4L@5% + 4L@10% + 2.25L@15%
    expect(newRegimeTaxFY27(1425000)).toBe(20000 + 40000 + 33750);
    // 25L -> 4L@0 + 4L@5% + 4L@10% + 4L@15% + 4L@20% + 4L@25% + 1L@30%
    expect(newRegimeTaxFY27(2500000)).toBe(20000 + 40000 + 60000 + 80000 + 100000 + 30000);
  });

  it('old regime: classic 4-slab structure, 87A to 5L', () => {
    // nil up to 5L via the 87A (Rs 12,500) rebate
    expect(oldRegimeTaxFY27(0)).toBe(0);
    expect(oldRegimeTaxFY27(500000)).toBe(0);
    // 10L -> 0.25L@5% + 0.5L@20%
    expect(oldRegimeTaxFY27(1000000)).toBe(12500 + 100000);
    // 15L -> 12500 + 100000 + 5L@30%
    expect(oldRegimeTaxFY27(1500000)).toBe(12500 + 100000 + 150000);
    // 10.25L example from the article
    expect(oldRegimeTaxFY27(1025000)).toBe(12500 + 100000 + 7500);
    // 19.6L -> 12500 + 100000 + 9.6L@30%
    expect(oldRegimeTaxFY27(1960000)).toBe(12500 + 100000 + 288000);
  });

  it('regime comparison at defaults', () => {
    // 15L gross, no deductions: new regime is cheaper
    expect(newRegimeTaxFY27(1500000 - 75000)).toBeLessThan(oldRegimeTaxFY27(1500000 - 50000));
    // 15L gross with 2.4L deductions: old taxable = 12.1L -> 12500 + 100000 + 2.1L@30% = 175500
    const o = oldRegimeTaxFY27(1500000 - 50000 - 240000);
    expect(o).toBe(12500 + 100000 + 63000);
  });

  it('core-satellite blend math', () => {
    const r = coreSatelliteBlend(1000000, 0.7, 0.082, 0.11, 4);
    expect(r.blendedYield).toBeCloseTo(0.0904, 4); // 70%@8.2 + 30%@11 = 9.04
    expect(r.totalInterest).toBeCloseTo(90400, 0);
    expect(r.coreInterest).toBeCloseTo(57400, 0);
    expect(r.satelliteInterest).toBeCloseTo(33000, 0);
    expect(r.singleDefaultLoss).toBeCloseTo(75000, 6); // 30% of 10L across 4 names
    const none = coreSatelliteBlend(0, 0.7, 0.082, 0.11, 4);
    expect(none.blendedYield).toBe(0);
  });

  it('advance tax FY 2026-27 installment math', () => {
    // totalTax 1.8L, tds 30k -> balance 1.5L; 4 installments 15/45/75/100%
    const r = advanceTaxFY27(180000, 30000);
    expect(r.advanceTaxDue).toBe(150000);
    expect(r.needsAdvanceTax).toBe(true);
    expect(r.installments.length).toBe(4);
    expect(r.installments[0].amountDue).toBe(150000 * 0.15); // 22500
    expect(r.installments[1].amountDue).toBe(150000 * 0.45); // 67500
    expect(r.installments[2].amountDue).toBe(150000 * 0.75); // 112500
    expect(r.installments[3].amountDue).toBe(150000 * 1.0); // 150000
    // Approx 234C: 0.03 * (0.15+0.45+0.75) * 150000 = 0.03 * 1.35 * 150000 = 6075
    expect(r.interest234CApprox).toBeCloseTo(6075, 4);
    // Below the 10k threshold -> no duty
    const low = advanceTaxFY27(50000, 48000);
    expect(low.advanceTaxDue).toBe(2000);
    expect(low.needsAdvanceTax).toBe(false);
    // TDS exceeding the tax -> balance clamps to zero
    const clamped = advanceTaxFY27(100000, 200000);
    expect(clamped.advanceTaxDue).toBe(0);
    expect(clamped.needsAdvanceTax).toBe(false);
  });
});

describe('SIF sleeve sizing', () => {
  it('net edge vs stated benchmark decides whether the sleeve pays for itself', () => {
    const r = sifSleeveSizing({
      corpus: 4000000,
      coreReturn: 0.10,
      sifGrossReturn: 0.14,
      sifFee: 0.0225,
      benchmarkReturn: 0.11,
      sleevePct: 0.20,
      years: 5,
    });
    expect(r.sifNetReturn).toBeCloseTo(0.1175, 6); // 0.14 - 0.0225
    expect(r.netEdgeVsBenchmark).toBeCloseTo(0.0075, 6); // 0.1175 - 0.11
    expect(r.paysForItself).toBe(true);
    expect(r.effectiveSleevePct).toBe(0.20);
    // blended portfolio net return = 0.20*0.1175 + 0.80*0.10 = 0.1035
    expect(r.portfolioNetReturn).toBeCloseTo(0.1035, 6);
  });

  it('a fee that eats the gross edge means the sleeve does NOT pay for itself', () => {
    const r = sifSleeveSizing({
      corpus: 4000000,
      coreReturn: 0.10,
      sifGrossReturn: 0.12,
      sifFee: 0.0225,
      benchmarkReturn: 0.11,
      sleevePct: 0.20,
      years: 5,
    });
    expect(r.sifNetReturn).toBeCloseTo(0.0975, 6);
    expect(r.netEdgeVsBenchmark).toBeCloseTo(-0.0125, 6);
    expect(r.paysForItself).toBe(false);
  });

  it('sleeve is capped at the 25% rule of thumb', () => {
    const r = sifSleeveSizing({
      corpus: 4000000,
      coreReturn: 0.10,
      sifGrossReturn: 0.14,
      sifFee: 0.0225,
      benchmarkReturn: 0.11,
      sleevePct: 0.40,
      years: 5,
    });
    expect(r.effectiveSleevePct).toBe(0.25);
    expect(r.sleeveCapPct).toBe(0.25);
  });
});

describe('REIT / InvIT business-trust timing', () => {
  const base = {
    units: 1000,
    costPerUnit: 400,
    currentPrice: 480,
    navPerUnit: 420,
    annualDistPerUnit: 30,
    monthsHeld: 18,
    forwardYears: 3,
    navGrowthRate: 0.05,
    marginalTaxRate: 0.30,
    sharedLtcgPool: 0,
  };

  it('premium drags the effective yield; a long-term sale is better held forward', () => {
    const r = businessTrustTiming(base);
    expect(r.premiumDiscountPct).toBeCloseTo(60 / 420, 6);
    expect(r.headlineYield).toBe(0.075); // 30/400 on cost
    expect(r.yieldOnPrice).toBe(0.0625); // 30/480 on price
    expect(r.premiumYieldDrag).toBeCloseTo(0.0125, 6);
    expect(r.afterTaxDistIncome).toBe(21000); // 30000 * (1 - 0.30)
    expect(r.qualifiesLtcgNow).toBe(true); // 18 months >= 12
    expect(r.taxIfSoldNow).toBe(10000); // 80000 LTCG * 0.125
    expect(r.afterTaxProceedsNow).toBe(470000);
    // forward: 480000 * 1.05^3 = 555660; LTCG 155660*0.125 = 19457.5
    expect(r.afterTaxProceedsForward).toBeCloseTo(536202.5, 4);
    expect(r.betterChoice).toBe('forward');
  });

  it('under 12 months the gain is 20% short-term, so selling now is more costly', () => {
    const st = businessTrustTiming({ ...base, monthsHeld: 6 });
    expect(st.qualifiesLtcgNow).toBe(false);
    expect(st.taxIfSoldNow).toBe(16000); // 80000 STCG * 0.20
    expect(st.afterTaxProceedsNow).toBe(464000);
  });

  it('a unit trading below NAV is at a discount; yield-on-price rises vs cost-based', () => {
    const neg = businessTrustTiming({ ...base, currentPrice: 380 });
    expect(neg.premiumDiscountPct).toBeLessThan(0);
    // discount => you paid less than cost-basis, so the same distribution is a
    // higher yield on your actual purchase price (30/380 > 30/400)
    expect(neg.yieldOnPrice).toBeGreaterThan(neg.headlineYield);
    expect(neg.headlineYield).toBe(0.075);
    expect(neg.yieldOnPrice).toBeCloseTo(30 / 380, 6);
  });
});

describe('AIF end-of-fund waterfall (2/20)', () => {
  // Nucleus worked example: Rs 500 Cr committed, 3x over 10 yrs, 8% hurdle,
  // 20% carry, 100% catch-up, no fee.
  // Preferred total = 500 * 1.08^10 = 500 * 2.158925 = 1079.46; incremental 579.46
  // profitAboveHurdle = 1500 - 1079.46 = 420.54
  // catch-up = min(420.54, 579.46 * 0.2 / 0.8 = 144.87) = 144.87
  // remaining = 420.54 - 144.87 = 275.67; GP split = 55.13; LP share = 220.53
  // LP total = 1079.46 + 220.53 = 1299.99 ≈ 1300; GP carry = 200.00
  it('Nucleus worked example: LP net 1300, GP carry 200 (8% hurdle, catch-up)', () => {
    const r = aifWaterfall({
      committedCapital: 500,
      grossMultiple: 3,
      years: 10,
      hurdleRate: 0.08,
      carryPct: 0.2,
      catchUp: true,
      mgmtFeePct: 0,
    });
    expect(r.lpNetProceeds).toBeCloseTo(1300, 0);
    expect(r.gpCatchUpAmount + r.gpFinalSplit).toBeCloseTo(200, 0);
    expect(r.lpNetMultiple).toBeCloseTo(1300 / 500, 1); // 2.6x net
    expect(r.beatsHurdle).toBe(true);
  });

  it('management fee drag reduces the LP net proceeds', () => {
    const noFee = aifWaterfall({
      committedCapital: 1, grossMultiple: 3, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: true, mgmtFeePct: 0,
    });
    const withFee = aifWaterfall({
      committedCapital: 1, grossMultiple: 3, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: true, mgmtFeePct: 0.02,
    });
    // fee drag = 0.02 * 10 * 1 = 0.2 Cr
    expect(withFee.mgmtFeeDrag).toBeCloseTo(0.2, 6);
    expect(withFee.lpNetProceeds).toBeCloseTo(noFee.lpNetProceeds - 0.2, 6);
    expect(withFee.lpNetProceeds).toBeLessThan(noFee.lpNetProceeds);
  });

  it('no-catch-up (LP-friendly) leaves more with the LPs', () => {
    const catchUp = aifWaterfall({
      committedCapital: 500, grossMultiple: 3, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: true, mgmtFeePct: 0,
    });
    const straight = aifWaterfall({
      committedCapital: 500, grossMultiple: 3, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: false, mgmtFeePct: 0,
    });
    expect(straight.gpCatchUpAmount).toBe(0);
    expect(straight.lpNetProceeds).toBeGreaterThan(catchUp.lpNetProceeds);
  });

  it('a fund below the hurdle pays no carry; the LP takes the whole final value', () => {
    const r = aifWaterfall({
      committedCapital: 500, grossMultiple: 0.8, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: true, mgmtFeePct: 0,
    });
    // gross final = 400; preferred total = 1079.46 > 400 => no carry zone
    expect(r.gpCatchUpAmount + r.gpFinalSplit).toBe(0);
    expect(r.lpNetProceeds).toBe(400); // whole final value to LPs
    expect(r.lpNetIrr).toBeCloseTo(Math.pow(400 / 500, 1 / 10) - 1, 6);
    expect(r.beatsHurdle).toBe(false);
  });

  it('GP share of gross profit tracks the carry zone', () => {
    const r = aifWaterfall({
      committedCapital: 500, grossMultiple: 3, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: true, mgmtFeePct: 0,
    });
    // GP carry 200 on gross profit 1000 = 20%
    expect(r.gpShareOfProfit).toBeCloseTo(0.2, 3);
    const zero = aifWaterfall({
      committedCapital: 500, grossMultiple: 1, years: 10,
      hurdleRate: 0.08, carryPct: 0.2, catchUp: true, mgmtFeePct: 0,
    });
    expect(zero.gpShareOfProfit).toBe(0); // no profit at 1x
  });
});

describe('Old vs new regime deduction shield', () => {
  const base = { eightyC: 0, npsSelf: 0, npsEmployer: 0, homeLoanInterest: 0, healthInsurance: 0, salaried: true };

  it('80C + NPS alone rarely beats the new regime at 25L - the new regime usually wins', () => {
    const r = deductionShieldFY27({ grossIncome: 2500000, eightyC: 150000, npsSelf: 50000, npsEmployer: 0, homeLoanInterest: 0, healthInsurance: 0, salaried: true });
    // 25L - 75k std = 24.25L new taxable -> tax ~ 24.25L slabs.
    // old: 25L - 50k std - 2L = 22.45L taxable. At the 30% marginal slab the 2L
    // saves ~45-60k, but the new regime's widening + 87A typically wins here.
    expect(['new', 'old']).toContain(r.winRegime);
    expect(r.eightyCValue).toBeGreaterThan(40000);
    expect(r.eightyCValue).toBeLessThan(50000);
  });

  it('home-loan interest (24b) is worth real money in the old regime, even when new wins', () => {
    const r = deductionShieldFY27({ grossIncome: 2500000, eightyC: 150000, npsSelf: 0, npsEmployer: 0, homeLoanInterest: 200000, healthInsurance: 0, salaried: true });
    // 24(b) is capped at 2L and is the single biggest old-regime lever for a home-loan holder
    expect(r.homeLoanInterestValue).toBeGreaterThan(50000);
    // HONEST FY 2026-27 RESULT: even with the home-loan stack, the new regime's
    // widened slabs + 87A keep it winning up to ~45L, so the winner is "new" here.
    expect(r.winRegime).toBe('new');
    expect(r.savingsByOld).toBeLessThan(0);
  });

  it('the new regime wins across incomes even with a full 5L old-regime stack (Budget 2025 widening)', () => {
    // The key honest finding: a ~5L stack (80C 1.5 + NPS 0.5 + 24b 2.0 + 80D 1.0)
    // does NOT flip the winner to old at any income up to 45L (pre-surcharge).
    for (const inc of [1500000, 2000000, 2500000, 3000000, 4000000, 4500000]) {
      const r = deductionShieldFY27({ grossIncome: inc, eightyC: 150000, npsSelf: 50000, npsEmployer: 0, homeLoanInterest: 200000, healthInsurance: 100000, salaried: true });
      expect(r.winRegime).toBe('new');
    }
  });

  it('no deductions and below the 87A threshold, the new regime wins', () => {
    const r = deductionShieldFY27({ grossIncome: 1000000, ...base });
    expect(r.newRegimeTax).toBe(0);
    expect(r.winRegime).toBe('new');
  });

  it('employer NPS (80CCD(2)) reduces the new-regime tax too', () => {
    const noEm = deductionShieldFY27({ ...base, grossIncome: 1800000, eightyC: 150000, npsSelf: 50000, npsEmployer: 0 });
    const withEm = deductionShieldFY27({ ...base, grossIncome: 1800000, eightyC: 150000, npsSelf: 50000, npsEmployer: 100000 });
    expect(withEm.newRegimeTax).toBeLessThan(noEm.newRegimeTax);
    expect(withEm.npsEmployerValue).toBeGreaterThan(0);
  });

  it('all bucket values sum to the total old-regime deduction effect', () => {
    const r = deductionShieldFY27({ grossIncome: 3000000, eightyC: 150000, npsSelf: 50000, npsEmployer: 100000, homeLoanInterest: 200000, healthInsurance: 100000, salaried: true });
    const baseTaxable = 3000000 - 50000; // old std ded, no deductions
    const totalTaxable = baseTaxable - 150000 - 50000 - 200000 - 100000 - 100000;
    const totalEffect = oldRegimeTaxFY27(baseTaxable) - oldRegimeTaxFY27(totalTaxable);
    const sumBuckets = r.eightyCValue + r.npsSelfValue + r.homeLoanInterestValue + r.healthInsuranceValue + r.npsEmployerValue;
    expect(sumBuckets).toBeCloseTo(totalEffect, 0);
  });

  it('self-employed gets no standard deduction', () => {
    const r = deductionShieldFY27({ grossIncome: 1800000, eightyC: 150000, npsSelf: 0, npsEmployer: 0, homeLoanInterest: 0, healthInsurance: 0, salaried: false });
    expect(r.newRegimeTaxable).toBe(1800000);
    expect(r.oldRegimeTaxable).toBe(1650000); // 18L - 1.5L 80C
  });
});

describe('After-tax product wedge', () => {
  it('an index fund has the smallest wedge at equal gross', () => {
    const idx = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 10, product: 'index',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    const cat3 = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 10, product: 'aifCat3',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    expect(idx.cagrAfterTax).toBeGreaterThan(cat3.cagrAfterTax);
    expect(idx.totalWedgePct).toBeLessThan(cat3.totalWedgePct);
    // 14% gross over 10 yrs = 3.707x; 12.5% tax on the 2.707 gain
    expect(idx.grossFinalValue).toBeCloseTo(3.7072, 3);
    expect(idx.taxRateApplied).toBeCloseTo(0.125, 6);
  });

  it('an unlisted Cat I/II AIF taxes the gain at the marginal slab, widening the wedge', () => {
    const r = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 10, product: 'aifCat12',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    expect(r.taxRateApplied).toBeCloseTo(0.3, 6);
    // 30% slab tax beats the 12.5% index rate -> larger wedge
    const idx = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 10, product: 'index',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    expect(r.totalWedgePct).toBeGreaterThan(idx.totalWedgePct);
  });

  it('fees drag the after-tax value below the no-fee baseline', () => {
    const noFees = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 10, product: 'pms',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    const withFees = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 10, product: 'pms',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0.02, perfFee: 0.15,
    });
    expect(withFees.feeDrag).toBeGreaterThan(0);
    expect(withFees.afterTaxFinalValue).toBeLessThan(noFees.afterTaxFinalValue);
  });

  it('a shared LTCG pool reduces the taxable profit for equity-type products', () => {
    const withPool = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 5, product: 'index',
      marginalSlabRate: 0.3, sharedLtcgPool: 1.25, mgmtFee: 0, perfFee: 0,
    });
    const noPool = afterTaxProductWedge({
      grossAnnualReturn: 0.14, years: 5, product: 'index',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    expect(withPool.taxPaid).toBeLessThan(noPool.taxPaid);
    expect(withPool.afterTaxFinalValue).toBeGreaterThan(noPool.afterTaxFinalValue);
  });

  it('a zero-gross return produces no tax and a zero wedge', () => {
    const r = afterTaxProductWedge({
      grossAnnualReturn: 0, years: 10, product: 'pms',
      marginalSlabRate: 0.3, sharedLtcgPool: 0, mgmtFee: 0, perfFee: 0,
    });
    expect(r.taxPaid).toBe(0);
    expect(r.totalWedgePct).toBe(0);
    expect(r.afterTaxFinalValue).toBeCloseTo(1, 6);
  });
});

describe('High-income tax: surcharge, cess, regime (FY 2026-27)', () => {
  const base = (over: Record<string, number> = {}) => ({
    nonEquityIncome: 0, equityLtcg: 0, equityStcg: 0,
    eightyC: 0, npsSelf: 0, healthInsurance: 0, homeLoanInterest: 0,
    npsEmployer: 0, salaried: true, ...over,
  });

  it('no surcharge or cess effect below 50L; slab tax only', () => {
    const r = highIncomeTaxFY27(base({ nonEquityIncome: 4000000 }));
    expect(r.new.surchargeRate).toBe(0);
    expect(r.new.surcharge).toBe(0);
    // cess still applies: 4% of base tax
    expect(r.new.cess).toBeCloseTo(0.04 * r.new.baseTax, 2);
    expect(r.new.total).toBe(r.new.baseTax + r.new.cess);
  });

  it('55L: 10% surcharge band, new regime wins on slab rate', () => {
    const r = highIncomeTaxFY27(base({ nonEquityIncome: 5500000 }));
    expect(r.new.surchargeRate).toBe(0.1);
    expect(r.old.surchargeRate).toBe(0.1);
    expect(r.new.baseTax).toBeCloseTo(1207500, 0);
    expect(r.new.surchargeAfterRelief).toBeCloseTo(120750, 0);
    expect(r.new.total).toBeCloseTo(1381380, 0);
    expect(r.new.effectiveRate).toBeGreaterThan(0.25);
    expect(r.new.effectiveRate).toBeLessThan(0.27);
    expect(r.winner).toBe('new');
    expect(r.savingsByOld).toBeLessThan(0);
  });

  it('new regime caps the surcharge at 25% above 2Cr; old regime still has 37% above 5Cr', () => {
    const r8cr = highIncomeTaxFY27(base({ nonEquityIncome: 80000000 }));
    expect(r8cr.new.surchargeRate).toBe(0.25);
    expect(r8cr.old.surchargeRate).toBe(0.37);
    expect(r8cr.winner).toBe('new');
    expect(r8cr.new.effectiveRate).toBeLessThan(r8cr.old.effectiveRate);
  });

  it('2.5Cr: both regimes in the 25% band (new capped, old at 25), new still wins on slab', () => {
    const r = highIncomeTaxFY27(base({ nonEquityIncome: 25000000 }));
    expect(r.new.surchargeRate).toBe(0.25);
    expect(r.old.surchargeRate).toBe(0.25);
    expect(r.winner).toBe('new');
  });

  it('the 15% equity-surcharge cap limits surcharge on 111A/112A tax, not the slab portion', () => {
    const r = highIncomeTaxFY27(base({ nonEquityIncome: 30000000, equityLtcg: 50000000 }));
    const equityTax = (50000000 - 125000) * 0.125; // 6234375
    const slabTax = r.new.baseTax - equityTax;
    const expectedSurcharge = Math.min(0.25, 0.15) * equityTax + 0.25 * slabTax;
    expect(r.new.surcharge).toBeCloseTo(expectedSurcharge, 0);
    expect(r.new.effectiveRate).toBeLessThan(0.30);
  });

  it('marginal relief caps the cliff just above a surcharge boundary', () => {
    // Just below the 50L boundary (self-employed, no std ded): no surcharge
    const below = highIncomeTaxFY27(base({ nonEquityIncome: 5000000, salaried: false }));
    const above = highIncomeTaxFY27(base({ nonEquityIncome: 5001000, salaried: false }));
    expect(below.new.surchargeRate).toBe(0);
    expect(above.new.surchargeRate).toBe(0.1);
    expect(above.new.marginalRelief).toBeGreaterThan(0);
    // Without relief, crossing 50L would add a ~10% surcharge on the whole
    // prior tax; with relief the increment on the extra Rs 1,000 is ~Rs 1,040.
    expect(above.new.total - below.new.total).toBeCloseTo(1040, 0);
  });

  it('zero income, no gains: zero tax, zero surcharge, zero cess', () => {
    const r = highIncomeTaxFY27(base({}));
    expect(r.new.total).toBe(0);
    expect(r.old.total).toBe(0);
    expect(r.winner).toBe('tie');
  });
});

describe('HUF income split (second slab + advance tax streams)', () => {
  const base = (over: Record<string, unknown> = {}) => ({
    individualIncome: 0, hufIncome: 0, regime: 'new', ...over,
  });

  it('moving income to a low-slab HUF saves tax in the new regime (worked 30L + 5L)', () => {
    const r = hufIncomeSplitFY27(base({ individualIncome: 3000000, hufIncome: 500000, regime: 'new' }));
    expect(r.soloBill).toBe(631800);
    expect(r.annualSaving).toBeGreaterThan(100000);
    expect(r.soloEffectiveRate).toBeGreaterThan(0.17);
    expect(r.splitEffectiveRate).toBeLessThan(0.15);
    expect(r.hufBill).toBe(0); // HUF 5L is under the 12L new-regime tax-free threshold
  });

  it('the HUF pays no tax when its income is under the 87A threshold', () => {
    const r = hufIncomeSplitFY27(base({ individualIncome: 3000000, hufIncome: 500000, regime: 'new' }));
    expect(r.hufNeedsAdvanceTax).toBe(false);
    // The individual still owes advance tax on their own leg
    expect(r.individualNeedsAdvanceTax).toBe(true);
  });

  it('in the old regime with 80C on the individual leg, the split still saves (HUF leg under the 87A nil band)', () => {
    const r = hufIncomeSplitFY27(base({
      individualIncome: 3000000, hufIncome: 500000, regime: 'old', eightyC: 150000,
    }));
    expect(r.soloBill).toBe(834600);
    expect(r.hufBill).toBe(0); // old-regime 87A keeps HUF income up to 5L tax-free
    expect(r.annualSaving).toBe(156000);
    // The HUF leg in the old regime can claim its OWN 80C/80D buckets as a
    // separate entity (not modelled here - see the article), which makes the
    // old-regime split even more powerful than this baseline.
    expect(r.splitEffectiveRate).toBeLessThan(r.soloEffectiveRate);
  });

  it('a HUF income leg that crosses 50L creates its own advance-tax stream', () => {
    const r = hufIncomeSplitFY27(base({ individualIncome: 5000000, hufIncome: 20000000, regime: 'new' }));
    expect(r.hufNeedsAdvanceTax).toBe(true);
    expect(r.hufAdvanceTaxDue).toBeGreaterThan(300000);
    // Both legs carry the 15% surcharge band
    expect(r.hufBill).toBeGreaterThan(0);
  });

  it('zero income on both sides: zero bill, zero saving', () => {
    const r = hufIncomeSplitFY27(base({}));
    expect(r.soloBill).toBe(0);
    expect(r.annualSaving).toBe(0);
    expect(r.hufNeedsAdvanceTax).toBe(false);
    expect(r.individualNeedsAdvanceTax).toBe(false);
  });
});

describe('NPS retirement exit (PFRDA 16-Dec-2025 rules + 10(10A) cap)', () => {
  const base = (over: Record<string, unknown> = {}) => ({
    monthlyContribution: 20000, employerPct: 0.1, annualReturn: 0.09, years: 30,
    smallCorpusThreshold: 800000, lumpSumPct: 0.8, annuityRate: 0.065,
    marginalTaxRate: 0.3, prematureExit: false, ...over,
  });

  it('a 30-yr 20k/month NPS at 9% builds ~4.0 Cr corpus on an 80/20 exit', () => {
    const r = npsRetirementExitFY27(base({}));
    expect(r.corpus).toBeGreaterThan(3.9e7);
    expect(r.corpus).toBeLessThan(4.2e7);
    // 20k self + 20% employer = 22k/mo; contributions = 22k x 360 = 7.92M
    expect(r.totalContributions).toBeCloseTo(7920000, 0);
    expect(r.lumpSum).toBeCloseTo(r.corpus * 0.8, 0);
    expect(r.annuityCorpus).toBeCloseTo(r.corpus * 0.2, 0);
  });

  it('the 60% 10(10A) exemption cap makes the extra 20% lump sum taxable', () => {
    const r = npsRetirementExitFY27(base({}));
    // exempt = min(lumpSum, 0.6 x contributions); corpus >> 1.33 x contributions so the cap binds
    expect(r.exemptLumpSum).toBeCloseTo(0.6 * r.totalContributions, 0);
    expect(r.taxableLumpSum).toBeCloseTo(r.lumpSum - r.exemptLumpSum, 0);
    expect(r.taxableLumpSum).toBeGreaterThan(0);
    expect(r.afterTaxLumpSum).toBeCloseTo(
      r.exemptLumpSum + r.taxableLumpSum * 0.7,
      0,
    );
  });

  it('a corpus under Rs 8L is a 100% lump-sum exit with no annuity', () => {
    const r = npsRetirementExitFY27(base({ monthlyContribution: 5000, employerPct: 0, years: 5 }));
    expect(r.isSmallCorpus).toBe(true);
    expect(r.lumpSum).toBeCloseTo(r.corpus, 0);
    expect(r.annuityCorpus).toBe(0);
    expect(r.annualAnnuityIncome).toBe(0);
  });

  it('a permitted premature exit forces the 20/80 split regardless of the lump-sum input', () => {
    const r = npsRetirementExitFY27(base({ years: 15, prematureExit: true, lumpSumPct: 0.8 }));
    expect(r.lumpSum).toBeCloseTo(r.corpus * 0.2, 0);
    expect(r.annuityCorpus).toBeCloseTo(r.corpus * 0.8, 0);
  });

  it('a 100% annuity exit (lumpSumPct = 0) puts everything in the pension', () => {
    const r = npsRetirementExitFY27(base({ lumpSumPct: 0 }));
    expect(r.lumpSum).toBe(0);
    expect(r.annuityCorpus).toBeCloseTo(r.corpus, 0);
    expect(r.annualAnnuityIncome).toBeCloseTo(r.corpus * 0.065, 0);
    expect(r.afterTaxAnnuityIncome).toBeCloseTo(r.annualAnnuityIncome * 0.7, 0);
  });

  it('zero contribution: zero corpus, zero everything, small-corpus flag', () => {
    const r = npsRetirementExitFY27(base({ monthlyContribution: 0 }));
    expect(r.corpus).toBe(0);
    expect(r.totalAfterTax).toBe(0);
    expect(r.isSmallCorpus).toBe(true);
  });
});

describe('Pre-IPO / unlisted equity tax outcome', () => {
  const base = (over: Record<string, unknown> = {}) => ({
    costPerUnit: 1000, units: 1000, salePricePerUnit: 2000, monthsHeld: 30,
    isListedAtSale: false, sharedLtcgPool: 0, marginalSlabRate: 0.3, ...over,
  });

  it('unlisted long-term (24m+) is Sec 112: 12.5%, NO pool, on a 2x gain', () => {
    const r = preIpoTaxOutcome(base({}));
    expect(r.grossGain).toBe(1000000); // (2000-1000) x 1000
    expect(r.taxHead).toBe('unlisted-ltcg');
    expect(r.taxRate).toBe(0.125);
    expect(r.poolApplied).toBe(0); // no 112A pool on unlisted equity LTCG
    expect(r.taxPaid).toBe(125000);
    expect(r.afterTaxGain).toBe(875000);
    expect(r.netReturnPct).toBeCloseTo(0.875, 6);
  });

  it('unlisted short-term (<= 24m) is taxed at the slab rate, not a flat 20%', () => {
    const r = preIpoTaxOutcome(base({ monthsHeld: 18 }));
    expect(r.taxHead).toBe('unlisted-stcg');
    expect(r.taxRate).toBe(0.3); // 30% slab
    expect(r.taxPaid).toBe(300000);
    expect(r.afterTaxGain).toBe(700000);
    // A higher slab means a materially worse short-term outcome
    const highSlab = preIpoTaxOutcome(base({ monthsHeld: 18, marginalSlabRate: 0.35 }));
    expect(highSlab.taxPaid).toBeGreaterThan(r.taxPaid);
  });

  it('a listed exchange sale (STT paid) switches to the 12m 112A test with the shared pool', () => {
    const r = preIpoTaxOutcome(base({ monthsHeld: 15, isListedAtSale: true, sharedLtcgPool: 125000 }));
    expect(r.taxHead).toBe('listed-ltcg');
    expect(r.taxRate).toBe(0.125);
    expect(r.poolApplied).toBe(125000);
    expect(r.taxPaid).toBeCloseTo((1000000 - 125000) * 0.125, 0);
  });

  it('a listed sale held <= 12 months is Sec 111A at a flat 20%, no pool', () => {
    const r = preIpoTaxOutcome(base({ monthsHeld: 10, isListedAtSale: true, sharedLtcgPool: 125000 }));
    expect(r.taxHead).toBe('listed-stcg');
    expect(r.taxRate).toBe(0.2);
    expect(r.poolApplied).toBe(0);
    expect(r.taxPaid).toBe(200000);
  });

  it('the pool is capped at the gross gain (a pool larger than the gain applies only the gain)', () => {
    // gain 100000, pool 125000 -> poolApplied = 100000, tax 0
    const r = preIpoTaxOutcome(base({
      salePricePerUnit: 1100, monthsHeld: 15, isListedAtSale: true, sharedLtcgPool: 125000,
    }));
    expect(r.grossGain).toBe(100000);
    expect(r.poolApplied).toBe(100000);
    expect(r.taxPaid).toBe(0);
    expect(r.afterTaxGain).toBe(100000);
  });

  it('a loss (sale below cost) produces zero gain and zero tax', () => {
    const r = preIpoTaxOutcome(base({ salePricePerUnit: 800, monthsHeld: 30 }));
    expect(r.grossGain).toBe(0);
    expect(r.taxPaid).toBe(0);
    expect(r.afterTaxGain).toBe(0);
    expect(r.netReturnPct).toBe(0);
  });
});

describe('Senior-citizen regime decision (age brackets + 80TTB + 87A)', () => {
  const base = (over: Record<string, unknown> = {}) => ({
    age: 66, interestIncome: 246000, otherIncome: 600000,
    eightyTTBLimit: 50000, eightyD: 50000, ...over,
  });

  it('a 66-year-old at 8.46L: the new regime 87A-to-12L zeroes the bill, old pays 59.2k', () => {
    const r = seniorRegimeTaxFY27(base({}));
    expect(r.ageBracket).toBe('senior');
    expect(r.new.tax).toBe(0); // 8.46L is under the 12L new-regime tax-free threshold
    expect(r.old.tax).toBe(59200);
    expect(r.winner).toBe('new');
    expect(r.savingsByOld).toBeLessThan(0); // new regime is cheaper here
  });

  it('the old-regime basic exemption is 3L for senior and 5L for super-senior', () => {
    const s = seniorRegimeTaxFY27(base({ age: 66, interestIncome: 0, otherIncome: 1000000, eightyTTBLimit: 0, eightyD: 0 }));
    const sp = seniorRegimeTaxFY27(base({ age: 82, interestIncome: 0, otherIncome: 1000000, eightyTTBLimit: 0, eightyD: 0 }));
    expect(s.old.basicExemption).toBe(300000);
    expect(sp.old.basicExemption).toBe(500000);
    expect(s.ageBracket).toBe('senior');
    expect(sp.ageBracket).toBe('super-senior');
  });

  it('below 60 the old-regime basic exemption is the regular 2.5L', () => {
    const r = seniorRegimeTaxFY27(base({ age: 55, interestIncome: 0, otherIncome: 1000000, eightyTTBLimit: 0, eightyD: 0 }));
    expect(r.ageBracket).toBe('below-60');
    expect(r.old.basicExemption).toBe(250000);
  });

  it('80TTB applies only up to the interest actually earned (and the limit)', () => {
    const r = seniorRegimeTaxFY27(base({ interestIncome: 30000, otherIncome: 10000000 }));
    // 30k interest < 50k limit, so the applied deduction is the full 30k
    expect(r.old.eightyTTBApplied).toBe(30000);
    const capped = seniorRegimeTaxFY27(base({ interestIncome: 200000, otherIncome: 10000000 }));
    expect(capped.old.eightyTTBApplied).toBe(50000); // capped at the limit
  });

  it('the 80TTB value is the old-regime tax it removes (zero at low income)', () => {
    // High income: 80TTB has real value
    const high = seniorRegimeTaxFY27(base({ interestIncome: 1000000, otherIncome: 12000000 }));
    expect(high.eightyTTBValue).toBeGreaterThan(0);
    // Low income (total under the 5L old-regime 87A threshold): old tax is
    // zero either way, so 80TTB has no base tax to reduce - value is 0.
    const low = seniorRegimeTaxFY27(base({ interestIncome: 100000, otherIncome: 200000 }));
    expect(low.eightyTTBValue).toBe(0);
  });

  it('even a full old-regime stack does NOT flip the decision at typical retiree income (new wins)', () => {
    // The honest finding: at 40L, a super-senior with the whole old stack
    // (80C 1.5L + 24b 2L + 80D 50k + 80TTB 50k = ~4.55L) still pays LESS in
    // the new regime, because both hit 30% at the top but the new regime has
    // lower base slabs + the 87A-to-12L rebate. 80TTB alone is too small to
    // overcome the new regime's widened slabs.
    const r = seniorRegimeTaxFY27({
      age: 84, interestIncome: 200000, otherIncome: 3800000,
      eightyTTBLimit: 50000, eightyD: 50000, eightyC: 150000, homeLoanInterest: 200000,
    });
    expect(r.winner).toBe('new');
    expect(r.new.tax).toBe(780000);
    expect(r.old.tax).toBe(865000);
    expect(r.savingsByOld).toBe(-85000);
  });

  it('the new regime still wins even at very high income with the full old stack (FY 2026-27 widening)', () => {
    // Verified honest finding: at 1 Cr with the entire old-regime stack
    // (80C 1.5L + 24b 2L + 80D 50k + 80TTB 50k = ~4.55L of deductions), the
    // new regime STILL costs less. The FY 2026-27 new-regime widening (lower
    // base slabs + 87A to 12L) means the stale "old regime wins for retirees"
    // advice no longer holds in this base-slab model. (Model excludes
    // surcharge; the new regime's 25% surcharge cap vs the old 37% would only
    // widen the new regime's advantage at the very top.)
    const r = seniorRegimeTaxFY27({
      age: 84, interestIncome: 1000000, otherIncome: 9000000,
      eightyTTBLimit: 50000, eightyD: 50000, eightyC: 150000, homeLoanInterest: 200000,
    });
    expect(r.winner).toBe('new');
    expect(r.new.tax).toBe(2580000);
    expect(r.old.tax).toBe(2665000);
    expect(r.savingsByOld).toBeLessThan(0);
  });

  it('zero income: both regimes zero, tie', () => {
    const r = seniorRegimeTaxFY27(base({ interestIncome: 0, otherIncome: 0 }));
    expect(r.old.tax).toBe(0);
    expect(r.new.tax).toBe(0);
    expect(r.winner).toBe('tie');
  });
});

describe('NRI India-source tax & TDS (residency + DTAA)', () => {
  const base = (over: Record<string, unknown> = {}) => ({
    daysInIndia: 120, daysInLastFourYears: 300, indianIncomeAbove15L: false,
    indiaSourceIncome: 1000000, domesticRate: 0.3, dtaaRate: 0.15, dtaaApplies: true, ...over,
  });

  it('120 days in the FY (and < 365 prior) is a non-resident', () => {
    const r = nriIndiaTaxFY27(base({}));
    expect(r.residency).toBe('non-resident');
    expect(r.taxableIndiaIncome).toBe(1000000);
  });

  it('the DTAA treaty rate lowers the TDS, and the relief is the gap x income', () => {
    const r = nriIndiaTaxFY27(base({}));
    expect(r.applicableTdsRate).toBe(0.15); // lower of 0.30 domestic and 0.15 treaty
    expect(r.tdsBeforeCess).toBe(150000); // 15% of 10L
    expect(r.cess4Pct).toBe(6000); // 4% of 150000
    expect(r.totalTdsWithCess).toBe(156000);
    expect(r.dtaaRelief).toBe(150000); // (0.30 - 0.15) x 10L
  });

  it('without a DTAA the full domestic rate and cess apply, no relief', () => {
    const r = nriIndiaTaxFY27(base({ dtaaApplies: false }));
    expect(r.applicableTdsRate).toBe(0.3);
    expect(r.tdsBeforeCess).toBe(300000);
    expect(r.dtaaRelief).toBe(0);
    expect(r.totalTdsWithCess).toBe(312000);
  });

  it('a treaty rate higher than the domestic rate is ignored (lower of the two)', () => {
    const r = nriIndiaTaxFY27(base({ dtaaRate: 0.4, dtaaApplies: true }));
    expect(r.applicableTdsRate).toBe(0.3); // min(0.30, 0.40)
    expect(r.dtaaRelief).toBe(0);
  });

  it('182+ days makes you a resident (global income pulled in)', () => {
    const r = nriIndiaTaxFY27(base({ daysInIndia: 200, daysInLastFourYears: 0 }));
    expect(r.residency).toBe('resident');
  });

  it('the 60/365 long-term test flips you resident even under 182 days', () => {
    const r = nriIndiaTaxFY27(base({ daysInIndia: 100, daysInLastFourYears: 400 }));
    expect(r.residency).toBe('resident'); // 100 >= 60 and 400 >= 365
  });

  it('the 120-day variant applies when Indian income exceeds 15L', () => {
    // 100 days in FY + 400 prior: resident under the 60-day variant,
    // but NON-resident under the 120-day variant (Indian income > 15L).
    const hi = nriIndiaTaxFY27(base({ daysInIndia: 100, daysInLastFourYears: 400, indianIncomeAbove15L: true }));
    const lo = nriIndiaTaxFY27(base({ daysInIndia: 100, daysInLastFourYears: 400, indianIncomeAbove15L: false }));
    expect(hi.residency).toBe('non-resident');
    expect(lo.residency).toBe('resident');
  });

  it('zero India-source income: zero TDS, zero cess, zero relief', () => {
    const r = nriIndiaTaxFY27(base({ indiaSourceIncome: 0 }));
    expect(r.tdsBeforeCess).toBe(0);
    expect(r.cess4Pct).toBe(0);
    expect(r.dtaaRelief).toBe(0);
  });
});

describe('Capital gains rollover (54 / 54F / 54EC reinvestment)', () => {
  const base = (over: Record<string, unknown> = {}) => ({
    gain: 800000, reinvested: 500000, route: '54EC',
    timeCompliant: true, ltcgOnly: true, taxRateOnGain: 0.125, ...over,
  });

  it('shelters min(gain, reinvested) - a 5L reinvestment on an 8L gain leaves 3L taxable', () => {
    const r = rolloverExemption(base({}));
    expect(r.exemptAmount).toBe(500000);
    expect(r.taxableGain).toBe(300000);
    expect(r.taxSaved).toBeCloseTo(500000 * 0.125, 2);
    expect(r.taxOnGainIfNoRollover).toBeCloseTo(800000 * 0.125, 2);
  });

  it('a full reinvestment (reinvested >= gain) makes the whole gain exempt', () => {
    const r = rolloverExemption(base({ gain: 400000, reinvested: 400000, route: '54' }));
    expect(r.exemptAmount).toBe(400000);
    expect(r.taxableGain).toBe(0);
    expect(r.taxSaved).toBeCloseTo(400000 * 0.125, 2);
  });

  it('the 54EC route caps the reinvestment at Rs 50L even when more is available', () => {
    // A 60L gain, 60L reinvested, 54EC -> exemption capped at 50L
    const r = rolloverExemption(base({ gain: 6000000, reinvested: 6000000, route: '54EC' }));
    expect(r.routeCap).toBe(5000000);
    expect(r.exemptAmount).toBe(5000000);
    expect(r.taxableGain).toBe(1000000);
  });

  it('54 and 54F have no binding cap in this model (reinvested is the binding number)', () => {
    const r = rolloverExemption(base({ gain: 6000000, reinvested: 6000000, route: '54' }));
    expect(r.routeCap).toBe(0);
    expect(r.exemptAmount).toBe(6000000); // full gain reinvested -> fully exempt
    expect(r.taxableGain).toBe(0);
  });

  it('a missed time window zeroes the exemption', () => {
    const r = rolloverExemption(base({ timeCompliant: false }));
    expect(r.exemptAmount).toBe(0);
    expect(r.taxableGain).toBe(800000);
    expect(r.taxSaved).toBe(0);
  });

  it('a short-term gain (ltcgOnly false) gets no rollover exemption', () => {
    const r = rolloverExemption(base({ ltcgOnly: false, taxRateOnGain: 0.2 }));
    expect(r.exemptAmount).toBe(0);
    expect(r.taxableGain).toBe(800000);
    expect(r.taxOnGainIfNoRollover).toBeCloseTo(800000 * 0.2, 2);
  });

  it('a zero gain is trivially fully exempt', () => {
    const r = rolloverExemption(base({ gain: 0, reinvested: 0 }));
    expect(r.exemptAmount).toBe(0);
    expect(r.taxableGain).toBe(0);
    expect(r.taxSaved).toBe(0);
  });
});


describe('dtaaReliefFY27', () => {
  const base = (o: Record<string, unknown> = {}) => ({
    income: 1000000,
    domesticRate: 0.3,
    treatyRate: 0.15,
    surchargePct: 0,
    cessPct: 0.04,
    residenceTax: 0,
    ...o,
  });

  it('treaty route halves the pre-cess withholding vs 30% domestic', () => {
    const r = dtaaReliefFY27(base());
    expect(r.domesticWithholding).toBe(300000);
    expect(r.treatyWithholding).toBe(150000);
    expect(r.tdsSaved).toBe(150000);
  });

  it('applies surcharge + 4% cess to both routes for the all-in figure', () => {
    const r = dtaaReliefFY27(base({ surchargePct: 0.1 }));
    expect(r.domesticAllIn).toBeCloseTo(300000 * 1.1 * 1.04, 0);
    expect(r.treatyAllIn).toBeCloseTo(150000 * 1.1 * 1.04, 0);
    expect(r.savingAllIn).toBeCloseTo(r.domesticAllIn - r.treatyAllIn, 0);
  });

  it('effective rate reflects the cess+surcharge multiplier', () => {
    const r = dtaaReliefFY27(base({ surchargePct: 0 }));
    expect(r.effectiveRateDomestic).toBeCloseTo(0.3 * 1.04, 6);
    expect(r.effectiveRateTreaty).toBeCloseTo(0.15 * 1.04, 6);
  });

  it('exemption-method corridor (residenceTax 0) shows India as the only tax', () => {
    const r = dtaaReliefFY27(base({ residenceTax: 0 }));
    expect(r.creditMethod).toBe(false);
    expect(r.totalTaxBurdenTreatyRoute).toBeCloseTo(r.treatyAllIn, 0);
    expect(r.netAdditionalTax).toBe(0);
  });

  it('credit-method corridor caps the s.91 credit at the lesser of India-paid and home-tax', () => {
    const r = dtaaReliefFY27(base({ residenceTax: 120000 }));
    expect(r.creditMethod).toBe(true);
    expect(r.foreignTaxCredit).toBe(120000);
    expect(r.netAdditionalTax).toBe(0);
    expect(r.totalTaxBurdenTreatyRoute).toBeCloseTo(r.treatyAllIn, 0);
  });

  it('when home tax exceeds the India-side, the net extra is the difference', () => {
    const r = dtaaReliefFY27(base({ residenceTax: 400000 }));
    const cap = r.treatyAllIn;
    expect(r.foreignTaxCredit).toBeCloseTo(cap, 0);
    expect(r.netAdditionalTax).toBeCloseTo(400000 - cap, 0);
    expect(r.totalTaxBurdenTreatyRoute).toBeCloseTo(400000, 0);
  });

  it('clamps rates to 0-1 and floors savings at zero when treaty >= domestic', () => {
    const r = dtaaReliefFY27(base({ domesticRate: 0.2, treatyRate: 0.35 }));
    expect(r.tdsSaved).toBe(0);
    expect(r.savingAllIn).toBe(0);
  });
});


describe('esopVestingTaxFY27', () => {
  const base = (o: Record<string, unknown> = {}) => ({
    shares: 1000,
    exercisePrice: 500,
    fmvAtExercise: 1500,
    salePrice: 1800,
    listed: true,
    monthsHeld: 15,
    otherSalary: 2000000,
    otherListedLtcg: 0,
    startupDeferral: false,
    tdsOnPerquisite: 0,
    ...o,
  });

  it('computes the Stage-1 perquisite as (FMV - exercise price) x shares', () => {
    const r = esopVestingTaxFY27(base());
    // (1500 - 500) x 1000 = 1000000
    expect(r.perquisite).toBe(1000000);
  });

  it('listed LTCG consumes the 1.25L pool and taxes the excess at 12.5%', () => {
    const r = esopVestingTaxFY27(base());
    // CG = (1800 - 1500) x 1000 = 300000
    expect(r.capitalGain).toBe(300000);
    expect(r.isLtcg).toBe(true);
    expect(r.cgHead).toBe('112A');
    // pool 125000 consumed, taxable = 175000
    expect(r.poolConsumed).toBe(125000);
    expect(r.taxableCg).toBe(175000);
    expect(r.cgTax).toBeCloseTo(175000 * 0.125, 6);
  });

  it('listed STCG (held under 12 months) is taxed flat at 20%', () => {
    const r = esopVestingTaxFY27(base({ monthsHeld: 6 }));
    expect(r.isLtcg).toBe(false);
    expect(r.cgHead).toBe('111A');
    expect(r.cgTax).toBeCloseTo(300000 * 0.2, 6);
  });

  it('unlisted LTCG (>24 months) uses Sec 112 at 12.5% with no pool', () => {
    const r = esopVestingTaxFY27(base({ listed: false, monthsHeld: 30 }));
    expect(r.isLtcg).toBe(true);
    expect(r.cgHead).toBe('sec112');
    expect(r.poolConsumed).toBe(0);
    expect(r.cgTax).toBeCloseTo(300000 * 0.125, 6);
  });

  it('when other listed LTCG exhausts the pool, none is consumed', () => {
    const r = esopVestingTaxFY27(base({ otherListedLtcg: 125000 }));
    expect(r.poolConsumed).toBe(0);
    expect(r.taxableCg).toBe(300000);
    expect(r.cgTax).toBeCloseTo(300000 * 0.125, 6);
  });

  it('not-sold (salePrice 0) zeroes the Stage-2 gain and keeps perquisite intact', () => {
    const r = esopVestingTaxFY27(base({ salePrice: 0, monthsHeld: 0 }));
    expect(r.capitalGain).toBe(0);
    expect(r.cgHead).toBe('none');
    expect(r.perquisite).toBe(1000000);
  });

  it('80-IAC deferral flag is surfaced without changing the tax amount', () => {
    const withDef = esopVestingTaxFY27(base({ startupDeferral: true }));
    const noDef = esopVestingTaxFY27(base());
    expect(withDef.deferralApplies).toBe(true);
    expect(withDef.deferralNote.length).toBeGreaterThan(0);
    // Deferral changes timing, not amount
    expect(withDef.totalTwoStageTax).toBeCloseTo(noDef.totalTwoStageTax, 6);
  });

  it('netTaxAfterTds subtracts the employer-withheld perquisite TDS', () => {
    const r = esopVestingTaxFY27(base({ tdsOnPerquisite: 200000 }));
    expect(r.netTaxAfterTds).toBeCloseTo(r.totalTwoStageTax - 200000, 6);
  });
});

describe('capitalLadderFY27', () => {
  const base = (over: Partial<Parameters<typeof capitalLadderFY27>[0]> = {}) => ({
    currentCorpus: 1000000,
    monthlySip: 50000,
    annualReturn: 0.09,
    ...over,
  });

  it('exposes the four rung thresholds in ascending order', () => {
    const r = capitalLadderFY27(base());
    expect(r.rungs.map((x) => x.threshold)).toEqual([1000000, 2500000, 5000000, 10000000]);
  });

  it('treats a 10L corpus as already SIF-unlocked', () => {
    const r = capitalLadderFY27(base());
    const sif = r.rungs[0];
    expect(sif.status).toBe('unlocked');
    expect(sif.monthsToUnlock).toBe(0);
  });

  it('reports the next locked rung and its months-to-unlock', () => {
    const r = capitalLadderFY27(base());
    expect(r.nextRungId).toBe('prim-25l');
    expect(r.monthsToNextRung).toBe(r.rungs[1].monthsToUnlock);
    expect(r.monthsToNextRung).toBeGreaterThan(0);
    expect(r.yearsToNextRung).toBeCloseTo(r.monthsToNextRung / 12, 6);
  });

  it('marks every rung unlocked when the corpus already exceeds 1Cr', () => {
    const r = capitalLadderFY27(base({ currentCorpus: 15000000 }));
    expect(r.rungs.every((x) => x.status === 'unlocked' && x.monthsToUnlock === 0)).toBe(true);
    expect(r.nextRungId).toBeNull();
    expect(r.monthsToNextRung).toBe(-1);
  });

  it('counts a future lump-sum event into the rung timing', () => {
    // Corpus starts at 0; a 25L event at month 1: SIF and PRIM open at m=1,
    // then 25L compounds to 50L (PMS, ~93 mo) and 1Cr (AIF, ~186 mo) within 30 yr.
    const r = capitalLadderFY27(base({
      currentCorpus: 0, monthlySip: 0,
      additionalCapital: 2500000, additionalCapitalMonth: 1,
    }));
    expect(r.rungs[0].monthsToUnlock).toBe(1); // SIF 10L
    expect(r.rungs[1].monthsToUnlock).toBe(1); // PRIM 25L
    expect(r.rungs[2].monthsToUnlock).toBeGreaterThan(90);
    expect(r.rungs[2].monthsToUnlock).toBeLessThan(96);
    expect(r.rungs[3].monthsToUnlock).toBeGreaterThan(180);
    expect(r.rungs[3].monthsToUnlock).toBeLessThan(190);
  });

  it('with no corpus, no SIP and no event stays fully locked', () => {
    const r = capitalLadderFY27(base({ currentCorpus: 0, monthlySip: 0 }));
    expect(r.rungs.every((x) => x.status === 'locked')).toBe(true);
    expect(r.nextRungId).toBe('sif-10l');
    expect(r.monthsToNextRung).toBe(-1);
    expect(r.corpusAtHorizon).toBe(0);
  });

  it('shifts the surcharge tier as income crosses 50L', () => {
    const r = capitalLadderFY27(base({ currentAnnualIncome: 4000000, futureAnnualIncome: 6000000 }));
    // 40L income: base tax 7.8L, no surcharge (below the 50L band). 60L: base 13.8L, 10% surcharge = 1.38L.
    expect(r.surcharge.surchargeNow).toBe(0);
    expect(r.surcharge.surchargeLater).toBeCloseTo(138000, 0);
    expect(r.surcharge.futureTier.rate).toBe(0.1);
    expect(r.surcharge.increase).toBeCloseTo(r.surcharge.surchargeLater, 0);
  });

  it('compounds the corpus monotonically toward the horizon', () => {
    const a = capitalLadderFY27(base());
    const b = capitalLadderFY27(base({ monthlySip: 100000 }));
    expect(b.corpusAtHorizon).toBeGreaterThan(a.corpusAtHorizon);
    expect(a.corpusAtHorizon).toBeGreaterThan(0);
  });
});

describe('fiftyFourECTrancheTracker', () => {
  const base = (over: Partial<Parameters<typeof fiftyFourECTrancheTracker>[0]> = {}) => ({
    originalGain: 4000000,
    trancheInvested: 3000000,
    monthsFromSaleToInvest: 4,
    monthsHeldBeforeRedemption: -1,
    ...over,
  });

  it('captures the smaller of the gain and the (cap-bound, compliant) tranche', () => {
    const r = fiftyFourECTrancheTracker(base());
    // 30L invested < 40L gain, and under the 50L cap -> exemption = 30L.
    expect(r.exemptionCaptured).toBe(3000000);
    expect(r.compliant).toBe(true);
  });

  it('is bounded by the Rs 50L cap, not the gain', () => {
    const r = fiftyFourECTrancheTracker(base({ originalGain: 8000000, trancheInvested: 6000000 }));
    // Tranche is 60L but capped at 50L; exemption is the cap, not the 80L gain.
    expect(r.trancheAfterCap).toBe(5000000);
    expect(r.exemptionCaptured).toBe(5000000);
  });

  it('captures zero exemption when the tranche is bought after the 6-month window', () => {
    const r = fiftyFourECTrancheTracker(base({ monthsFromSaleToInvest: 7 }));
    expect(r.compliant).toBe(false);
    expect(r.exemptionCaptured).toBe(0);
    expect(r.taxSaved).toBe(0);
    // The whole original gain is then taxed at 12.5% -> reversal equals the full gain tax.
    expect(r.reversalTax).toBeCloseTo(4000000 * 0.125, 0);
  });

  it('reverses the exemption on an early redemption (before the 5-year lock-in)', () => {
    const r = fiftyFourECTrancheTracker(base({ monthsHeldBeforeRedemption: 30 }));
    expect(r.earlyRedemption).toBe(true);
    expect(r.exemptionLapsed).toBe(r.exemptionCaptured);
    expect(r.reversalTax).toBeCloseTo(r.exemptionCaptured * 0.125, 0);
    // Net effect cancels the saving (reversal = tax saved).
    expect(r.netTaxEffect).toBeCloseTo(0, 0);
  });

  it('keeps the exemption when held to maturity (no reversal)', () => {
    const r = fiftyFourECTrancheTracker(base({ monthsHeldBeforeRedemption: 60 }));
    expect(r.earlyRedemption).toBe(false);
    expect(r.exemptionLapsed).toBe(0);
    expect(r.netTaxEffect).toBeCloseTo(-r.taxSaved, 0); // a net saving
  });

  it('accrues and taxes coupon interest on the capped principal at the slab rate', () => {
    const r = fiftyFourECTrancheTracker(
      base({ monthsHeldBeforeRedemption: 60, couponRate: 0.07, interestAccrualMonths: 60 }),
    );
    // 50L... but tranche is 30L (under cap) -> 30L x 7% x 5 yr = 10.5L interest.
    expect(r.interestAccrual).toBeCloseTo(3000000 * 0.07 * 5, 0);
    expect(r.interestTax).toBeCloseTo(r.interestAccrual * 0.30, 0);
    expect(r.totalTaxEffect).toBeCloseTo(r.netTaxEffect + r.interestTax, 0);
  });

  it('zeroes all flows when the original gain is zero', () => {
    const r = fiftyFourECTrancheTracker(base({ originalGain: 0 }));
    expect(r.exemptionCaptured).toBe(0);
    expect(r.reversalTax).toBe(0);
    expect(r.totalTaxEffect).toBe(r.interestTax);
  });

  it('the reversal makes a redeemed tranche strictly worse than doing nothing', () => {
    const held = fiftyFourECTrancheTracker(base({ monthsHeldBeforeRedemption: 60 }));
    const redeemed = fiftyFourECTrancheTracker(base({ monthsHeldBeforeRedemption: 12 }));
    // Redemption (reversal + interest) is a worse net outcome than holding to maturity.
    expect(redeemed.totalTaxEffect).toBeGreaterThan(held.totalTaxEffect);
  });
});

