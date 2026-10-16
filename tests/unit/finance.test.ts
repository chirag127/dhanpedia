/**
 * Unit tests for the DhanPedia financial calculation library.
 * Uses known numerical answers and independent cross-checks so a regression
 * in any formula is caught. Run with `npm test` (vitest).
 */
import { describe, it, expect } from 'vitest';
import {
  simpleInterest, simpleInterestMaturity, compoundFutureValue, effectiveAnnualRate,
  presentValue, cagr, sipFutureValue, lumpSumFutureValue, sipRequiredForGoal,
  lumpSumRequiredForGoal, emi, loanAmortisation, realReturn, inflationErodedValue,
  xirr, irr, retirementCorpus, withdrawalSustainability, sustainableInitialWithdrawal,
  p2pExpectedNetReturn, portfolioExpectedReturn, maxDrawdown, feeImpact,
  bondPrice, macaulayDuration, currencyScenario, rentalYield, propertyTransactionCosts,
  pmsSimulation,
  newRegimeTaxFY27, oldRegimeTaxFY27, coreSatelliteBlend, advanceTaxFY27,
} from '@lib/finance/index';

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
