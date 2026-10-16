/**
 * DhanPedia — core financial calculation library.
 *
 * All functions are pure and deterministic so they can be unit-tested and
 * embedded in client-side React islands. They make no network calls.
 *
 * Conventions (documented per the calculator standards):
 *  - Time is expressed in years as a decimal when a rate is per-annum.
 *  - Monthly SIP/lump-sum FV formulas assume end-of-period contributions and a
 *    constant nominal annual rate compounded monthly unless stated otherwise.
 *  - XIRR uses calendar years (days / 365) between cash-flow dates.
 *  - Indian rupee formatting helpers live in format.ts (import from UI code).
 */

export interface CashFlow {
  /** ISO date string (YYYY-MM-DD) or epoch milliseconds. */
  date: string | number;
  /** Amount in ₹. Negative = money in (investment), positive = money out (return). */
  amount: number;
}

/* ------------------------------------------------------------------ *
 * Basics: interest, FV, PV, EAR, CAGR
 * ------------------------------------------------------------------ */

/** Simple interest: P * r * t. */
export function simpleInterest(principal: number, annualRate: number, years: number): number {
  return principal * annualRate * years;
}

/** Simple interest total at maturity (principal + interest). */
export function simpleInterestMaturity(principal: number, annualRate: number, years: number): number {
  return principal + simpleInterest(principal, annualRate, years);
}

/** Compound interest FV: P * (1 + r/n)^(n*t). */
export function compoundFutureValue(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear = 1,
): number {
  if (compoundsPerYear <= 0) throw new Error('compoundsPerYear must be > 0');
  return principal * Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear * years);
}

/** Effective annual rate from a nominal rate compounded n times/year. */
export function effectiveAnnualRate(nominalRate: number, compoundsPerYear: number): number {
  return Math.pow(1 + nominalRate / compoundsPerYear, compoundsPerYear) - 1;
}

/** Present value: FV / (1 + r)^t. */
export function presentValue(futureValue: number, annualRate: number, years: number): number {
  return futureValue / Math.pow(1 + annualRate, years);
}

/** Compound annual growth rate between a start and end value over n years. */
export function cagr(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return NaN;
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

/* ------------------------------------------------------------------ *
 * SIP / goal planning
 * ------------------------------------------------------------------ */

/**
 * Future value of a monthly SIP at a constant monthly return.
 * Assumes contributions at the end of each month (ordinary annuity).
 * @param pmt monthly contribution
 * @param monthlyRate constant monthly return (e.g. 0.007 for ~0.7%/month)
 * @param n number of months
 */
export function sipFutureValue(pmt: number, monthlyRate: number, n: number): number {
  if (monthlyRate === 0) return pmt * n;
  return pmt * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
}

/** Lump-sum FV under monthly compounding of an annual nominal rate. */
export function lumpSumFutureValue(principal: number, annualNominalRate: number, years: number): number {
  const monthlyRate = annualNominalRate / 12;
  const n = Math.round(years * 12);
  return principal * Math.pow(1 + monthlyRate, n);
}

/** Required monthly SIP to reach a goal FV. */
export function sipRequiredForGoal(goalFv: number, monthlyRate: number, n: number): number {
  if (monthlyRate === 0) return goalFv / n;
  return goalFv / ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
}

/** Lump sum needed to reach a goal FV at a constant annual rate. */
export function lumpSumRequiredForGoal(goalFv: number, annualRate: number, years: number): number {
  return goalFv / Math.pow(1 + annualRate, years);
}

/* ------------------------------------------------------------------ *
 * Loans: EMI and amortisation
 * ------------------------------------------------------------------ */

/** Monthly EMI for a principal P at monthly rate r over n months. */
export function emi(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12;
  if (months <= 0) throw new Error('months must be > 0');
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export interface AmortisationRow {
  period: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

/** Full amortisation schedule. */
export function loanAmortisation(
  principal: number,
  annualRate: number,
  months: number,
): AmortisationRow[] {
  const r = annualRate / 12;
  const payment = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  let balance = principal;
  const rows: AmortisationRow[] = [];
  for (let p = 1; p <= months; p++) {
    const interest = balance * r;
    let principalPaid = payment - interest;
    // Guard the final period so the schedule closes exactly to zero.
    if (p === months) principalPaid = balance;
    balance -= principalPaid;
    if (balance < 1e-6) balance = 0;
    rows.push({ period: p, emi: p === months ? principalPaid + interest : payment, principal: principalPaid, interest, balance });
  }
  return rows;
}

/* ------------------------------------------------------------------ *
 * Inflation & real returns
 * ------------------------------------------------------------------ */

/** Real (inflation-adjusted) return for a single period: (1+nom)/(1+inf)-1. */
export function realReturn(nominalReturn: number, inflation: number): number {
  return (1 + nominalReturn) / (1 + inflation) - 1;
}

/** Future value of a sum adjusted for annual inflation (purchasing power). */
export function inflationErodedValue(principal: number, inflation: number, years: number): number {
  return principal / Math.pow(1 + inflation, years);
}

/* ------------------------------------------------------------------ *
 * XIRR / IRR
 * ------------------------------------------------------------------ */

/**
 * XIRR: annualised IRR for irregularly-dated cash flows.
 * Solves sum_i cf_i * (1 + x)^(t_i) = 0 via Newton with bisection fallback.
 * @returns annualised rate, or NaN if no solution is found.
 */
export function xirr(cashFlows: CashFlow[]): number {
  const valid = cashFlows.filter((c) => Number.isFinite(c.amount) && c.amount !== 0);
  if (valid.length < 2) return NaN;
  const dates = valid.map((c) => (typeof c.date === 'number' ? c.date : Date.parse(c.date)));
  const amounts = valid.map((c) => c.amount);
  const t0 = dates[0];
  const years = dates.map((d) => (d - t0) / (365.25 * 86400000));

  const npv = (x: number): number =>
    years.reduce((acc, y, i) => acc + (amounts[i] / Math.pow(1 + x, y)), 0);

  // Bracket the root.
  let low = -0.999;
  let high = 10;
  let fLow = npv(low);
  let fHigh = npv(high);
  // Expand high if needed.
  let guard = 0;
  while (fLow * fHigh > 0 && guard < 40) {
    high = high * 1.5 + 0.1;
    fHigh = npv(high);
    guard++;
  }
  if (fLow * fHigh > 0) return NaN; // no sign change => no real root in range

  // Bisection to bracket tightly, then Newton polish.
  let lo = low;
  let hi = high;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-9) return mid;
    if (fLow * fMid < 0) {
      hi = mid;
      fHigh = fMid;
    } else {
      lo = mid;
      fLow = fMid;
    }
  }
  // Newton polish from the midpoint.
  let x = (lo + hi) / 2;
  for (let i = 0; i < 25; i++) {
    const f = npv(x);
    const df = years.reduce((acc, y, i) => acc + (-y * amounts[i]) / Math.pow(1 + x, y + 1), 0);
    if (df === 0) break;
    const nx = x - f / df;
    if (nx <= -0.999 || nx > high) break; // keep in domain
    if (Math.abs(nx - x) < 1e-12) return nx;
    x = nx;
  }
  return x;
}

/**
 * Plain IRR for equally-spaced (annual) cash flows.
 * @param flows array where index 0 is time 0.
 */
export function irr(flows: number[], guess = 0.1): number {
  const npv = (x: number): number => flows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + x, i), 0);
  let r = guess;
  for (let i = 0; i < 100; i++) {
    const f = npv(r);
    const df = flows.reduce((acc, cf, i) => acc + (-i * cf) / Math.pow(1 + r, i + 1), 0);
    if (df === 0) break;
    const nr = r - f / df;
    if (!Number.isFinite(nr)) break;
    if (Math.abs(nr - r) < 1e-10) return nr;
    r = nr;
  }
  return r;
}

/* ------------------------------------------------------------------ *
 * Retirement
 * ------------------------------------------------------------------ */

/**
 * Required retirement corpus: annual spending grown by inflation to the target
 * year, multiplied by a corpus factor (spendable years).
 */
export function retirementCorpus(
  annualSpendNow: number,
  inflation: number,
  yearsToRetire: number,
  corpusFactor = 25,
): number {
  const spendAtRetire = annualSpendNow * Math.pow(1 + inflation, yearsToRetire);
  return spendAtRetire * corpusFactor;
}

/**
 * Whether a portfolio sustains inflation-adjusted withdrawals over N years.
 * Withdrawals grow with inflation; the corpus compounds at a nominal growth rate.
 * @returns { sustainable, valueAfterYears, shortfallAt (year index where value hits 0, 0 if none) }
 */
export function withdrawalSustainability(
  corpus: number,
  initialAnnualWithdrawal: number,
  nominalGrowth: number,
  inflation: number,
  years: number,
): { sustainable: boolean; valueAfterYears: number; shortfallYear: number } {
  let v = corpus;
  let w = initialAnnualWithdrawal;
  for (let y = 1; y <= years; y++) {
    w = w * (1 + inflation); // withdrawal grows with inflation
    v = v * (1 + nominalGrowth) - w;
    if (v <= 0) return { sustainable: false, valueAfterYears: 0, shortfallYear: y };
  }
  return { sustainable: true, valueAfterYears: v, shortfallYear: 0 };
}

/** 4% rule: maximum sustainable initial annual withdrawal from a corpus. */
export function sustainableInitialWithdrawal(corpus: number, rate = 0.04): number {
  return corpus * rate;
}

/* ------------------------------------------------------------------ *
 * P2P lending expected loss
 * ------------------------------------------------------------------ */

export interface P2PScenario {
  grossAnnualReturn: number; // advertised net return to lender, e.g. 0.15
  defaultRate: number; // probability a loan defaults
  lossGivenDefault: number; // fraction of principal lost on default (1 - recovery)
  idleCashDrag: number; // annual drag from idle/reinvestment cash
  annualServiceFee: number; // platform fee rate
}

/**
 * Expected net annual return after credit loss and fees.
 * expectedLoss = defaultRate * lossGivenDefault.
 */
export function p2pExpectedNetReturn(s: P2PScenario): {
  expectedLoss: number;
  netReturn: number;
  netAnnualValue: number;
} {
  const expectedLoss = s.defaultRate * s.lossGivenDefault;
  const grossAfterLoss = s.grossAnnualReturn - expectedLoss;
  const netReturn = grossAfterLoss - s.idleCashDrag - s.annualServiceFee;
  return { expectedLoss, netReturn, netAnnualValue: 1e5 * netReturn };
}

/* ------------------------------------------------------------------ *
 * Portfolio metrics
 * ------------------------------------------------------------------ */

export interface Asset {
  name: string;
  allocation: number; // target weight, 0..1
  expectedReturn: number; // annual
}

/** Portfolio expected return and a rough risk (weighted variance proxy). */
export function portfolioExpectedReturn(assets: Asset[]): number {
  const totalW = assets.reduce((a, x) => a + x.allocation, 0);
  if (totalW === 0) return 0;
  return assets.reduce((a, x) => a + (x.allocation / totalW) * x.expectedReturn, 0);
}

/** Max drawdown from a price/NAV series. */
export function maxDrawdown(series: number[]): number {
  if (series.length < 2) return 0;
  let peak = series[0];
  let mdd = 0;
  for (const v of series) {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak;
    if (dd > mdd) mdd = dd;
  }
  return mdd;
}

/** Fee drag on a corpus: FV difference over N years with vs without fees. */
export function feeImpact(
  corpus: number,
  grossReturn: number,
  fee: number,
  years: number,
): { withFees: number; withoutFees: number; drag: number } {
  const withoutFees = corpus * Math.pow(1 + grossReturn, years);
  const withFees = corpus * Math.pow(1 + grossReturn - fee, years);
  return { withFees, withoutFees, drag: withoutFees - withFees };
}

/* ------------------------------------------------------------------ *
 * Bonds (educational, approximate)
 * ------------------------------------------------------------------ */

/**
 * Approximate bond price for a coupon bond via discounted cash flows,
 * compounded annually, with YTM as the discount rate.
 */
export function bondPrice(
  faceValue: number,
  annualCouponRate: number,
  yearsToMaturity: number,
  annualYtm: number,
): number {
  let price = 0;
  const coupon = faceValue * annualCouponRate;
  for (let t = 1; t <= yearsToMaturity; t++) {
    price += coupon / Math.pow(1 + annualYtm, t);
  }
  price += faceValue / Math.pow(1 + annualYtm, yearsToMaturity);
  return price;
}

/** Macaulay duration (years) for a coupon bond. */
export function macaulayDuration(
  faceValue: number,
  annualCouponRate: number,
  yearsToMaturity: number,
  annualYtm: number,
): number {
  const coupon = faceValue * annualCouponRate;
  let num = 0;
  let price = 0;
  for (let t = 1; t <= yearsToMaturity; t++) {
    const cf = (t === yearsToMaturity ? coupon + faceValue : coupon) / Math.pow(1 + annualYtm, t);
    price += cf;
    num += t * cf;
  }
  if (price === 0) return 0;
  return num / price;
}

/* ------------------------------------------------------------------ *
 * Currency & real-estate scenarios
 * ------------------------------------------------------------------ */

/** Value of a foreign-holdings corpus after currency depreciation. */
export function currencyScenario(corpus: number, depreciation: number, years: number): number {
  return corpus * Math.pow(1 - depreciation, years);
}

/** Rental yield: annual net rental / property value. */
export function rentalYield(annualNetRental: number, propertyValue: number): number {
  if (propertyValue <= 0) return NaN;
  return annualNetRental / propertyValue;
}

/** Transaction cost drag on a property purchase+sale round trip. */
export function propertyTransactionCosts(price: number, buyCosts: number, sellCosts: number): number {
  return price * buyCosts + price * sellCosts;
}

/* ------------------------------------------------------------------ *
 * PMS / AIF cost simulation (layered fees: management + performance)
 * ------------------------------------------------------------------ */

export interface PmsSimResult {
  /** Final corpus value after all fees. */
  finalValue: number;
  /** Total management fees paid over the horizon. */
  totalMgmtFees: number;
  /** Total performance fees paid over the horizon. */
  totalPerfFees: number;
  /** Management + performance fees combined. */
  totalFees: number;
  /** Fee as a % of the final value. */
  feeShareOfFinal: number;
}

/**
 * Year-by-year PMS/AIF cost simulation.
 *
 * Conventions (documented on the calculator page):
 *  - Gross return is the fund's pre-fee annual growth applied to the
 *    *opening* corpus each year.
 *  - The management fee (mgmtFeePct) is charged on the *opening* corpus
 *    value each year (SEBI PMS recurring management fee convention).
 *  - The performance fee (perfFeePct) is charged only on the gain that
 *    *exceeds* the benchmark return, computed *after* the management fee.
 *  - If the year's net gain does not beat the benchmark, the performance
 *    fee for that year is zero (clawback / high-water line is NOT modelled;
 *    see the page's limitations).
 *
 * This is a mathematical illustration, not a forecast.
 */
export function pmsSimulation(
  corpus: number,
  grossReturn: number,
  years: number,
  mgmtFeePct: number,
  perfFeePct: number,
  benchmarkReturn: number,
): PmsSimResult {
  let value = corpus;
  let totalMgmt = 0;
  let totalPerf = 0;
  for (let t = 0; t < years; t++) {
    const opening = value;
    const grossValue = opening * (1 + grossReturn);
    const mgmtFee = opening * mgmtFeePct;
    const afterMgmt = grossValue - mgmtFee;
    const netGain = afterMgmt - opening;
    const benchmarkGain = opening * benchmarkReturn;
    const excess = Math.max(0, netGain - benchmarkGain);
    const perfFee = excess * perfFeePct;
    value = afterMgmt - perfFee;
    totalMgmt += mgmtFee;
    totalPerf += perfFee;
  }
  const totalFees = totalMgmt + totalPerf;
  const feeShareOfFinal = value > 0 ? totalFees / value : 0;
  return { finalValue: value, totalMgmtFees: totalMgmt, totalPerfFees: totalPerf, totalFees, feeShareOfFinal };
}

/* ------------------------------------------------------------------ *
 * Income-tax regime comparison (FY 2026-27 slab structure)
 * ------------------------------------------------------------------ */

/**
 * New-regime tax on taxable income for FY 2026-27 (the default regime;
 * slabs unchanged by Budget 2026): nil up to 4L, 5% to 8L, 10% to 12L,
 * 15% to 16L, 20% to 20L, 25% to 24L, 30% above; 87A rebate keeps income
 * up to 12L tax-free. `income` is AFTER the standard deduction.
 * Returns tax before cess.
 */
export function newRegimeTaxFY27(income: number): number {
  if (income <= 0) return 0;
  let tax = 0;
  const slabs: Array<[number, number, number]> = [
    [0, 400000, 0],
    [400000, 800000, 0.05],
    [800000, 1200000, 0.1],
    [1200000, 1600000, 0.15],
    [1600000, 2000000, 0.2],
    [2000000, 2400000, 0.25],
    [2400000, Infinity, 0.3],
  ];
  for (const [lo, hi, rate] of slabs) {
    if (income > lo) tax += Math.min(income, hi) - lo > 0 ? (Math.min(income, hi) - lo) * rate : 0;
  }
  // 87A: taxable income up to 12L -> tax capped at the 60k rebate, i.e. zero.
  if (income <= 1200000) return 0;
  return tax;
}

/**
 * Old-regime income tax on taxable income for FY 2026-27 (general,
 * resident individual below 60). Verified structure (Economic Times /
 * Grant Thornton, Budget 2026; TaxFetch; Cleartax):
 *
 *   nil up to ₹2,50,000
 *   5%  on ₹2,50,001 – ₹5,00,000
 *   20% on ₹5,00,001 – ₹10,00,000
 *   30% above ₹10,00,000
 *
 * Budget 2025 widened the NEW regime only; the old regime kept its classic
 * 4-slab structure, unchanged into FY 2026-27. `income` is taxable income
 * after all deductions and the ₹50,000 standard deduction (old regime).
 * Returns tax before surcharge and cess. The Section 87A old-regime rebate
 * (₹12,500) makes income up to ₹5,00,000 effectively nil.
 * Senior (₹3L nil) and super-senior (₹5L nil) exemptions are NOT modelled
 * here; they only shift the nil band.
 */
export function oldRegimeTaxFY27(income: number): number {
  if (income <= 500000) return 0; // 87A old-regime rebate ceiling
  let tax = 0;
  const slabs: Array<[number, number, number]> = [
    [250000, 500000, 0.05],
    [500000, 1000000, 0.2],
    [1000000, Infinity, 0.3],
  ];
  for (const [lo, hi, rate] of slabs) {
    if (income > lo) tax += (Math.min(income, hi) - lo) * rate;
  }
  return tax;
}

/* ------------------------------------------------------------------ *
 * NCD core-satellite blending (yield ladder diversification math)
 * ------------------------------------------------------------------ */

export interface CoreSatelliteResult {
  blendedYield: number;
  coreInterest: number;
  satelliteInterest: number;
  totalInterest: number;
  /** Principal lost if exactly one of `issuers` satellite issuers defaults (equal weights). */
  singleDefaultLoss: number;
}

/**
 * Core-satellite fixed-income blend: `corpus` split `corePct` at
 * `coreYield` (AAA/AA) and (1-corePct) at `satYield` (A/BBB) across
 * `issuers` equally-weighted satellite names. Mathematical illustration.
 */
export function coreSatelliteBlend(
  corpus: number,
  corePct: number,
  coreYield: number,
  satYield: number,
  issuers: number,
): CoreSatelliteResult {
  const coreInterest = corpus * corePct * coreYield;
  const satInterest = corpus * (1 - corePct) * satYield;
  const totalInterest = coreInterest + satInterest;
  const blendedYield = corpus > 0 ? totalInterest / corpus : 0;
  const singleDefaultLoss = issuers > 0 ? (corpus * (1 - corePct)) / issuers : 0;
  return { blendedYield, coreInterest, satelliteInterest: satInterest, totalInterest, singleDefaultLoss };
}

/* ------------------------------------------------------------------ *
 * Advance tax (FY 2026-27 installment schedule + 234B/234C illustration)
 * ------------------------------------------------------------------ */

export interface AdvanceTaxInstallment {
  /** Human due date, e.g. "15 Jun 2026". */
  dueDate: string;
  /** Cumulative % of the total advance tax that must be paid by this date. */
  cumulativePct: number;
  /** Rs amount due on this installment (cumulativePct of the advance-tax balance). */
  amountDue: number;
}

export interface AdvanceTaxResult {
  /** Total advance tax = max(0, annualTax - tds), i.e. tax after TDS credit. */
  advanceTaxDue: number;
  /** True when advanceTaxDue exceeds the Rs 10,000 threshold that triggers the duty. */
  needsAdvanceTax: boolean;
  /** The four installment dues (15 Jun / 15 Sep / 15 Dec / 15 Mar, cumulative 15/45/75/100%). */
  installments: AdvanceTaxInstallment[];
  /**
   * Approximate Sec 234C interest if the entire balance is deferred to the last
   * installment. Modelled on cumulative shortfalls: 1% x 3 months on each of the
   * first three quarters' shortfalls (15%, 45%, 75% of the balance) and 1% x 1
   * month on the fourth (100%, shortfall 0). Clearly an illustration, not a CA
   * computation — verify against the official ITR utility before acting.
   */
  interest234CApprox: number;
}

/**
 * Advance-tax installment schedule for FY 2026-27 (AY 2027-28).
 *
 * Conventions (documented on the calculator page):
 *  - `annualTax` is your estimated total tax for the year INCLUDING cess
 *    (and surcharge, if any), before TDS credit.
 *  - `tds` is the total TDS/TCS expected to be credited against that tax over
 *    the year.
 *  - Advance tax is payable in four cumulative installments: 15% by 15 Jun,
 *    45% by 15 Sep, 75% by 15 Dec, 100% by 15 Mar.
 *  - The duty applies only when the balance after TDS exceeds Rs 10,000.
 *  - Presumptive-income (44AD/44ADA) taxpayers may instead pay 100% by 15 Mar
 *    in one installment; this function returns the standard 4-step schedule and
 *    the page notes the single-installment alternative.
 */
export function advanceTaxFY27(annualTax: number, tds: number): AdvanceTaxResult {
  const balance = Math.max(0, annualTax - Math.max(0, tds));
  const needsAdvanceTax = balance > 10000;
  const steps: Array<[string, number]> = [
    ['15 Jun 2026', 0.15],
    ['15 Sep 2026', 0.45],
    ['15 Dec 2026', 0.75],
    ['15 Mar 2027', 1.0],
  ];
  const installments = steps.map(([dueDate, cumulativePct]) => ({
    dueDate,
    cumulativePct,
    amountDue: balance * cumulativePct,
  }));
  // Approx 234C: 1% x 3 months on each of the first three quarters' cumulative
  // shortfalls (15/45/75%) and 1% x 1 month on the fourth (shortfall 0 at 100%).
  const interest234CApprox = 0.03 * (0.15 + 0.45 + 0.75) * balance;
  return { advanceTaxDue: balance, needsAdvanceTax, installments, interest234CApprox };
}

/**
 * SIF sleeve-sizing and fee-edge test.
 *
 * A SIF is a satellite on top of a diversified mutual-fund core. The decision
 * is whether the manager's *net* (after fee) edge over its stated benchmark is
 * positive, and how much of the corpus a SIF sleeve may safely hold under the
 * ~15-25% rule of thumb.
 *
 * Conventions:
 *  - `coreReturn` is the diversified mutual-fund core's expected annual net
 *    return (decimal).
 *  - `sifGrossReturn` is the SIF's expected annual GROSS return (decimal).
 *  - `sifFee` is the SIF's annual expense ratio / management fee (decimal).
 *  - `benchmarkReturn` is the SIF's stated strategy-benchmark expected gross
 *    return (decimal). The net edge is computed against THIS, not the plain
 *    index — a long-short SIF is judged on its own stated benchmark.
 *  - `sleevePct` is the fraction of total corpus placed in the SIF (decimal),
 *    bounded to [0, 0.25] by the rule of thumb; inputs above 0.25 are capped.
 *  - Terminal values are compounded at the blended net return over `years`.
 *  - This is an expected-return decision aid, not a backtest; a SIF's
 *    long-short return is a function of pair selection, not market direction.
 */
export interface SifSleeveInput {
  corpus: number;
  coreReturn: number;
  sifGrossReturn: number;
  sifFee: number;
  benchmarkReturn: number;
  sleevePct: number;
  years: number;
}

export interface SifSleeveResult {
  sifNetReturn: number;
  netEdgeVsBenchmark: number;
  paysForItself: boolean;
  effectiveSleevePct: number;
  feeDragOverPeriod: number;
  portfolioNetReturn: number;
  corpusWithSleeve: number;
  corpusAllCore: number;
  deltaOverPeriod: number;
  sleeveCapPct: number;
}

export function sifSleeveSizing(s: SifSleeveInput): SifSleeveResult {
  const sleevePct = Math.max(0, Math.min(0.25, s.sleevePct));
  const sifNetReturn = s.sifGrossReturn - s.sifFee;
  const netEdgeVsBenchmark = sifNetReturn - s.benchmarkReturn;
  const paysForItself = netEdgeVsBenchmark > 0;
  const sleeveCorpus = s.corpus * sleevePct;
  const withoutFees = sleeveCorpus * Math.pow(1 + s.sifGrossReturn, s.years);
  const withFees = sleeveCorpus * Math.pow(1 + sifNetReturn, s.years);
  const feeDragOverPeriod = Math.max(0, withoutFees - withFees);
  const portfolioNetReturn = sleevePct * sifNetReturn + (1 - sleevePct) * s.coreReturn;
  const corpusWithSleeve = s.corpus * Math.pow(1 + portfolioNetReturn, s.years);
  const corpusAllCore = s.corpus * Math.pow(1 + s.coreReturn, s.years);
  const deltaOverPeriod = corpusWithSleeve - corpusAllCore;
  return {
    sifNetReturn,
    netEdgeVsBenchmark,
    paysForItself,
    effectiveSleevePct: sleevePct,
    feeDragOverPeriod,
    portfolioNetReturn,
    corpusWithSleeve,
    corpusAllCore,
    deltaOverPeriod,
    sleeveCapPct: 0.25,
  };
}

/**
 * REIT / InvIT (business-trust) timing & total-return decision aid.
 *
 * A business trust's total return is distribution + NAV appreciation, and its
 * capital gain is only 12.5% long-term (above the shared Rs 1.25L annual
 * equity pool, Section 112A) once the 12-month clock has run; before that the
 * gain is 20% short-term. Most distributions are slab-taxed component-by-
 * component (Section 115UA pass-through), so the after-tax income matters.
 *
 * Conventions:
 *  - `navPerUnit` is the current NAV per unit; `currentPrice` is the market
 *    price. premium/discount = (price - nav) / nav. A positive premium shrinks
 *    the effective distribution yield on your purchase price.
 *  - `annualDistPerUnit` is the expected annual distribution per unit.
 *  - `monthsHeld` is how long you have already held the units; the unit
 *    qualifies for 12.5% long-term capital gains only at 12 months or more.
 *  - `forwardYears` projects the market value forward at `navGrowthRate`.
 *  - `sharedLtcgPool` is the remaining shared Rs 1.25L equity-LTCG annual
 *    exemption for the year a long-term sale would land; a forward sale may
 *    land in a fresh pool, so treat the forward figure as a heuristic.
 *  - Distributions are assumed to be predominantly slab-taxed (interest /
 *    115BAA-dividend / rental components); a pure exempt-dividend payout
 *    would raise afterTaxDistIncome toward gross.
 */
export interface BtTimingInput {
  units: number;
  costPerUnit: number;
  currentPrice: number;
  navPerUnit: number;
  annualDistPerUnit: number;
  monthsHeld: number;
  forwardYears: number;
  navGrowthRate: number;
  marginalTaxRate: number;
  sharedLtcgPool: number;
}

export interface BtTimingResult {
  premiumDiscountPct: number;
  totalCost: number;
  marketValue: number;
  unrealizedGain: number;
  headlineYield: number;
  yieldOnPrice: number;
  premiumYieldDrag: number;
  annualDistIncome: number;
  afterTaxDistIncome: number;
  qualifiesLtcgNow: boolean;
  gainIfSoldNow: number;
  taxIfSoldNow: number;
  afterTaxProceedsNow: number;
  projectedMarketValueForward: number;
  gainIfSoldForward: number;
  taxIfSoldForward: number;
  afterTaxProceedsForward: number;
  betterChoice: 'now' | 'forward';
}

export function businessTrustTiming(i: BtTimingInput): BtTimingResult {
  const premiumDiscountPct =
    i.navPerUnit > 0 ? (i.currentPrice - i.navPerUnit) / i.navPerUnit : 0;
  const totalCost = i.units * i.costPerUnit;
  const marketValue = i.units * i.currentPrice;
  const unrealizedGain = marketValue - totalCost;
  const headlineYield = i.costPerUnit > 0 ? i.annualDistPerUnit / i.costPerUnit : 0;
  const yieldOnPrice = i.currentPrice > 0 ? i.annualDistPerUnit / i.currentPrice : 0;
  const premiumYieldDrag = headlineYield - yieldOnPrice;
  const annualDistIncome = i.units * i.annualDistPerUnit;
  const afterTaxDistIncome = annualDistIncome * (1 - Math.max(0, Math.min(1, i.marginalTaxRate)));
  const qualifiesLtcgNow = i.monthsHeld >= 12;
  const gainIfSoldNow = Math.max(0, marketValue - totalCost);
  const taxIfSoldNow = qualifiesLtcgNow
    ? Math.max(0, gainIfSoldNow - Math.max(0, i.sharedLtcgPool)) * 0.125
    : Math.max(0, gainIfSoldNow) * 0.2;
  const afterTaxProceedsNow = marketValue - taxIfSoldNow;
  const projectedMarketValueForward = marketValue * Math.pow(1 + i.navGrowthRate, i.forwardYears);
  const gainIfSoldForward = Math.max(0, projectedMarketValueForward - totalCost);
  const taxIfSoldForward = Math.max(0, gainIfSoldForward - Math.max(0, i.sharedLtcgPool)) * 0.125;
  const afterTaxProceedsForward = projectedMarketValueForward - taxIfSoldForward;
  const betterChoice = afterTaxProceedsForward >= afterTaxProceedsNow ? 'forward' : 'now';
  return {
    premiumDiscountPct,
    totalCost,
    marketValue,
    unrealizedGain,
    headlineYield,
    yieldOnPrice,
    premiumYieldDrag,
    annualDistIncome,
    afterTaxDistIncome,
    qualifiesLtcgNow,
    gainIfSoldNow,
    taxIfSoldNow,
    afterTaxProceedsNow,
    projectedMarketValueForward,
    gainIfSoldForward,
    taxIfSoldForward,
    afterTaxProceedsForward,
    betterChoice,
  };
}

/**
 * Old-vs-new regime decision for a salaried FY 2026-27 taxpayer with the
 * 80C basket + NPS deductions.
 *
 * Conventions:
 *  - `grossIncome` is total gross income BEFORE the standard deduction and
 *    before any Chapter VI-A deductions (salary, rent, interest, CG net of
 *    exemptions, etc.).
 *  - `eightyC` is the total 80C basket (ELSS + PPF + EPF + home-loan + NSC +
 *    LIC + NPS 80CCD(1)) — available OLD regime only.
 *  - `npsSelf` is the 80CCD(1B) extra NPS self-contribution (max 50,000) —
 *    available OLD regime only (verified Wave 8: a conflicting blog claim was
 *    resolved to old-regime-only per the CA-reviewed 15 Oct 2026 source).
 *  - `npsEmployer` is the 80CCD(2) employer NPS contribution — available in
 *    BOTH regimes (new regime: 14% of Basic+DA for all employers).
 *  - Standard deduction: new regime 75,000 (salaried), old regime 50,000.
 *  - Surcharge + 4% cess are NOT modelled (the calculator targets the
 *    individual-salaried band below 50L; surcharge only matters above 50L).
 *
 * Returns the tax under each regime, the regime difference, and the
 * effective value of each deduction bucket under the old regime.
 */
export interface DeductionShieldInput {
  grossIncome: number;
  eightyC: number;
  npsSelf: number;
  npsEmployer: number;
  homeLoanInterest: number;
  healthInsurance: number;
  salaried: boolean;
}

export interface DeductionShieldResult {
  newRegimeTax: number;
  oldRegimeTax: number;
  savingsByOld: number;
  winRegime: 'new' | 'old' | 'tie';
  newRegimeTaxable: number;
  oldRegimeTaxable: number;
  eightyCValue: number;
  npsSelfValue: number;
  npsEmployerValue: number;
  homeLoanInterestValue: number;
  healthInsuranceValue: number;
}

export function deductionShieldFY27(d: DeductionShieldInput): DeductionShieldResult {
  const stdDed = d.salaried ? 75000 : 0;
  const newRegimeTaxable = Math.max(
    0,
    d.grossIncome - stdDed - Math.max(0, d.npsEmployer),
  );
  const oldStdDed = d.salaried ? 50000 : 0;
  const oldOnlyDeductions =
    Math.min(Math.max(0, d.eightyC), 150000) +
    Math.min(Math.max(0, d.npsSelf), 50000) +
    Math.min(Math.max(0, d.homeLoanInterest), 200000) +
    Math.min(Math.max(0, d.healthInsurance), 100000);
  const oldRegimeTaxable = Math.max(
    0,
    d.grossIncome - oldStdDed - oldOnlyDeductions - Math.max(0, d.npsEmployer),
  );
  const newRegimeTax = newRegimeTaxFY27(newRegimeTaxable);
  const oldRegimeTax = oldRegimeTaxFY27(oldRegimeTaxable);
  const savingsByOld = newRegimeTax - oldRegimeTax;
  const winRegime = savingsByOld > 0 ? 'old' : savingsByOld < 0 ? 'new' : 'tie';

  // Effective value of each bucket = old-regime tax saved by that bucket at the
  // taxpayer's own marginal position (sequential, in the statutory order).
  const taxAt = (taxable: number) => oldRegimeTaxFY27(Math.max(0, taxable));
  let cursor = d.grossIncome - oldStdDed; // old-regime taxable with NO VI-A deductions
  const valueOf = (amount: number): number => {
    const without = taxAt(cursor);
    cursor -= amount;
    return Math.max(0, without - taxAt(cursor));
  };
  const eightyCValue = valueOf(Math.min(Math.max(0, d.eightyC), 150000));
  const npsSelfValue = valueOf(Math.min(Math.max(0, d.npsSelf), 50000));
  const homeLoanInterestValue = valueOf(Math.min(Math.max(0, d.homeLoanInterest), 200000));
  const healthInsuranceValue = valueOf(Math.min(Math.max(0, d.healthInsurance), 100000));
  const npsEmployerValueBase = cursor;
  const npsEmployerValue = Math.max(
    0,
    taxAt(npsEmployerValueBase) -
      taxAt(npsEmployerValueBase - Math.max(0, d.npsEmployer)),
  );

  return {
    newRegimeTax,
    oldRegimeTax,
    savingsByOld,
    winRegime,
    newRegimeTaxable,
    oldRegimeTaxable,
    eightyCValue,
    npsSelfValue,
    npsEmployerValue,
    homeLoanInterestValue,
    healthInsuranceValue,
  };
}

/**
 * HUF income-split decision aid: the annual value of moving income from a
 * high-slab individual to a second HUF slab, plus each party's advance-tax
 * position.
 *
 * Conventions:
 *  - "Solo" = all income in one individual's hands; "split" = the same income
 *    in two assessable persons (the individual + the HUF). Both sides run
 *    through highIncomeTaxFY27 so the 50L/1Cr/2Cr/5Cr surcharge structure is
 *    honoured on each side.
 *  - The HUF is a separate assessable person: its own liability over 10,000
 *    is a SECOND advance-tax stream (234B/234C clocks run per PAN).
 *  - This is a planning aid: it does NOT model the clubbing rules (64(2)
 *    self-acquired-to-HUF, 64(1)(iv) spouse, 64(1A) minor) - the article
 *    explains which income is legally eligible to sit in the HUF.
 */
export interface HufSplitInput {
  individualIncome: number;
  hufIncome: number;
  regime: 'new' | 'old';
  eightyC?: number;
  healthInsurance?: number;
  homeLoanInterest?: number;
}

export interface HufSplitResult {
  soloBill: number;
  splitBill: number;
  individualBill: number;
  hufBill: number;
  annualSaving: number;
  soloEffectiveRate: number;
  splitEffectiveRate: number;
  totalIncome: number;
  hufNeedsAdvanceTax: boolean;
  hufAdvanceTaxDue: number;
  individualNeedsAdvanceTax: boolean;
  individualAdvanceTaxDue: number;
}

export function hufIncomeSplitFY27(s: HufSplitInput): HufSplitResult {
  const solo = highIncomeTaxFY27({
    nonEquityIncome: s.individualIncome + s.hufIncome,
    equityLtcg: 0,
    equityStcg: 0,
    eightyC: s.eightyC ?? 0,
    npsSelf: 0,
    healthInsurance: s.healthInsurance ?? 0,
    homeLoanInterest: s.homeLoanInterest ?? 0,
    npsEmployer: 0,
    salaried: true,
  });
  const soloBill = s.regime === 'new' ? solo.new.total : solo.old.total;

  // HUF is not a salaried individual: no standard deduction line.
  const ind = highIncomeTaxFY27({
    nonEquityIncome: s.individualIncome,
    equityLtcg: 0,
    equityStcg: 0,
    eightyC: s.eightyC ?? 0,
    npsSelf: 0,
    healthInsurance: s.healthInsurance ?? 0,
    homeLoanInterest: s.homeLoanInterest ?? 0,
    npsEmployer: 0,
    salaried: true,
  });
  const huf = highIncomeTaxFY27({
    nonEquityIncome: s.hufIncome,
    equityLtcg: 0,
    equityStcg: 0,
    eightyC: 0,
    npsSelf: 0,
    healthInsurance: 0,
    homeLoanInterest: 0,
    npsEmployer: 0,
    salaried: false,
  });
  const individualBill = s.regime === 'new' ? ind.new.total : ind.old.total;
  const hufBill = s.regime === 'new' ? huf.new.total : huf.old.total;
  const splitBill = individualBill + hufBill;
  const totalIncome = s.individualIncome + s.hufIncome;
  return {
    soloBill,
    splitBill,
    individualBill,
    hufBill,
    annualSaving: soloBill - splitBill,
    soloEffectiveRate: totalIncome > 0 ? soloBill / totalIncome : 0,
    splitEffectiveRate: totalIncome > 0 ? splitBill / totalIncome : 0,
    totalIncome,
    hufNeedsAdvanceTax: hufBill > 10000,
    hufAdvanceTaxDue: Math.max(0, hufBill),
    individualNeedsAdvanceTax: individualBill > 10000,
    individualAdvanceTaxDue: Math.max(0, individualBill),
  };
}

/**
 * AIF end-of-fund "2 and 20" waterfall (European-style, single distribution).
 *
 * Models a fund that returns `grossMultiple` on committed capital at the end of
 * its life, with a preferred-return (hurdle) paid to LPs first, then a GP
 * catch-up, then the 80/20 (or custom) split. A management fee is removed from
 * the final LP proceeds.
 *
 * Conventions:
 *  - The hurdle is compounded over `years` on the committed capital; the
 *    catch-up is the 100% variant (the GP takes everything between the hurdle
 *    and the point where cumulative GP profit is `carryPct` of total profit).
 *  - `mgmtFeePct` is applied to the gross final value to approximate the
 *    cumulative management-fee drag; it is not a precise quarterly-fee model.
 *  - Clawback is NOT modelled: a clawback only matters if the fund ends below
 *    hurdle, in which case the GP returns carry paid earlier.
 *
 * This is a decision aid for comparing fund terms (hurdle, catch-up, fee base),
 * not a backtest.
 */
export interface AifWaterfallInput {
  committedCapital: number;
  grossMultiple: number;
  years: number;
  hurdleRate: number;
  carryPct: number;
  catchUp: boolean;
  mgmtFeePct: number;
}

export interface AifWaterfallResult {
  grossFinalValue: number;
  totalProfit: number;
  lpPreferredReturn: number;
  lpCashReturn: number;
  gpCatchUpAmount: number;
  lpProfitAfterCatchUp: number;
  gpFinalSplit: number;
  lpFinalProceeds: number;
  mgmtFeeDrag: number;
  lpNetProceeds: number;
  lpNetMultiple: number;
  lpNetIrr: number;
  gpTotalEconomics: number;
  gpShareOfProfit: number;
  beatsHurdle: boolean;
}

/**
 * After-tax "wedge" between a gross product return and what actually reaches
 * the investor, by product type and by where the tax lands.
 *
 * This is the comparison layer for the capital ladder: an index fund, a SIF,
 * a PMS, a Category I/II AIF (unlisted pass-through), and a Category III AIF
 * (fund-level tax) can all quote the same gross return, but the *net* return
 * that compounds in your hands differs because the tax rate applied to the
 * profit differs by product and by where the tax is paid.
 *
 * Conventions:
 *  - End-of-horizon model: corpus = 1, gross final value = (1+g)^years.
 *  - `mgmtFee` is a per-year fraction of corpus (approximated against a
 *    corpus of 1); `perfFee` is a fraction of the total gross profit, taken
 *    once at exit (no hurdle modelled here - see the PMS simulation for a
 *    layered version).
 *  - Equity-type products ('index', 'equity', 'sif', 'pms') tax the profit
 *    at the 112A long-term rate (12.5%) after the shared Rs 1.25L annual pool.
 *  - 'aifCat12' (unlisted private-market pass-through) taxes the profit at
 *    your marginal slab rate (no indexation, no pool) - the biggest wedge.
 *  - 'aifCat3' applies a fund-level rate (default ~42.7% incl. surcharge) to
 *    the profit, so the investor receives it net of that; character is lost.
 *
 * This is a decision aid for comparing products at equal gross; it does not
 * model interim distributions, the 194LBB TDS cash-flow timing, or surcharge
 * on the slab for very high incomes.
 */
export type AfterTaxProduct =
  | 'index'
  | 'equity'
  | 'sif'
  | 'pms'
  | 'aifCat12'
  | 'aifCat3';

export interface AfterTaxWedgeInput {
  grossAnnualReturn: number;
  years: number;
  product: AfterTaxProduct;
  marginalSlabRate: number;
  sharedLtcgPool: number;
  mgmtFee: number;
  perfFee: number;
  aifCat3FundRate?: number;
}

export interface AfterTaxWedgeResult {
  grossFinalValue: number;
  feeDrag: number;
  taxableProfit: number;
  taxPaid: number;
  afterTaxFinalValue: number;
  cagrAfterTax: number;
  cagrGross: number;
  totalWedgePct: number;
  taxRateApplied: number;
}

export function afterTaxProductWedge(w: AfterTaxWedgeInput): AfterTaxWedgeResult {
  const grossFinalValue = Math.pow(1 + w.grossAnnualReturn, w.years);
  const totalGrossProfit = grossFinalValue - 1;
  // Management fee compounds: each year charges mgmtFee on the growing corpus.
  // Approximate as mgmtFee * years applied to the average corpus level; a close
  // enough planning figure without a full year-by-year simulation.
  const mgmtFeeDrag = w.mgmtFee > 0 ? (Math.pow(1 + w.mgmtFee, w.years) - 1) * grossFinalValue : 0;
  const perfFeeDrag = w.perfFee * Math.max(0, totalGrossProfit);
  const feeDrag = Math.max(0, mgmtFeeDrag + perfFeeDrag);

  // Tax rate applied to the profit, by where the tax lands.
  let taxRateApplied: number;
  let pool: number;
  switch (w.product) {
    case 'aifCat12':
      taxRateApplied = w.marginalSlabRate; // unlisted pass-through at slab
      pool = 0;
      break;
    case 'aifCat3':
      taxRateApplied = w.aifCat3FundRate ?? 0.427; // fund-level, incl. surcharge
      pool = 0;
      break;
    case 'index':
    case 'equity':
    case 'sif':
    case 'pms':
    default:
      taxRateApplied = 0.125; // 112A long-term equity
      pool = Math.max(0, w.sharedLtcgPool);
      break;
  }

  const preTaxProfit = Math.max(0, totalGrossProfit - feeDrag);
  const taxableProfit = Math.max(0, preTaxProfit - pool);
  const taxPaid = taxableProfit * taxRateApplied;
  const afterTaxFinalValue = grossFinalValue - feeDrag - taxPaid;

  const cagrAfterTax =
    w.years > 0 && afterTaxFinalValue > 0
      ? Math.pow(afterTaxFinalValue, 1 / w.years) - 1
      : -1;
  const cagrGross = w.years > 0 ? Math.pow(grossFinalValue, 1 / w.years) - 1 : 0;
  const totalWedgePct =
    grossFinalValue > 1 ? 1 - afterTaxFinalValue / grossFinalValue : 0;

  return {
    grossFinalValue,
    feeDrag,
    taxableProfit,
    taxPaid,
    afterTaxFinalValue,
    cagrAfterTax,
    cagrGross,
    totalWedgePct,
    taxRateApplied,
  };
}

/**
 * Full FY 2026-27 individual tax computation including the surcharge and
 * 4% Health & Education Cess layers, for both regimes, and the regime
 * decision at high incomes.
 *
 * This closes the gap flagged in the Wave-9 deduction-shield model, which
 * deliberately excluded surcharge/cess. Verified against the Income-tax
 * Act, 2025 (effective 1 Apr 2026):
 *
 *  - New regime surcharge: 10% (50L-1Cr), 15% (1Cr-2Cr), 25% above 2Cr -
 *    the 37% top rate of the 1961 Act was ABOLISHED for the new regime.
 *  - Old regime surcharge: 10% / 15% / 25% (2Cr-5Cr) / 37% above 5Cr.
 *  - Equity surcharge cap: surcharge on tax arising from listed-equity
 *    capital gains (111A STCG 20% / 112A LTCG 12.5%) is capped at 15%,
 *    regardless of total income.
 *  - Cess: 4% on (base tax + surcharge after marginal relief).
 *  - Marginal relief: at each surcharge boundary, the surcharge is reduced
 *    so that (total tax + surcharge) does not exceed (tax + surcharge at
 *    the boundary + the incremental income). Cess is excluded from the
 *    relief comparison (documented approximation).
 *
 * Conventions:
 *  - `nonEquityIncome` is slab income BEFORE the standard deduction and
 *    before any Chapter VI-A deductions (salary, rent, interest, unlisted
 *    gains, business income net of losses, etc.).
 *  - Equity gains are kept out of the slab computation (111A/112A are
 *    separate heads) and enter through `equityLtcg` / `equityStcg`.
 *  - The shared 112A annual pool defaults to Rs 1.25L.
 */
export interface HighIncomeTaxInput {
  nonEquityIncome: number;
  equityLtcg: number;
  equityStcg: number;
  eightyC: number;
  npsSelf: number;
  healthInsurance: number;
  homeLoanInterest: number;
  npsEmployer: number;
  salaried: boolean;
  ltcgPool?: number;
}

export interface RegimeFullTax {
  taxableSlabIncome: number;
  baseTax: number;
  surchargeRate: number;
  surcharge: number;
  marginalRelief: number;
  surchargeAfterRelief: number;
  cess: number;
  total: number;
  effectiveRate: number;
}

export interface HighIncomeTaxResult {
  new: RegimeFullTax;
  old: RegimeFullTax;
  winner: 'new' | 'old' | 'tie';
  savingsByOld: number; // positive => old regime is cheaper
}

/**
 * Surcharge band rate for FY 2026-27 given TOTAL income.
 * New regime: 37% abolished - capped at 25% above 2Cr.
 * Old regime: 37% above 5Cr still applies.
 */
function surchargeBandRate(totalIncome: number, regime: 'new' | 'old'): number {
  if (totalIncome <= 5000000) return 0;
  if (regime === 'new') {
    if (totalIncome <= 10000000) return 0.1;
    if (totalIncome <= 20000000) return 0.15;
    return 0.25;
  }
  if (totalIncome <= 10000000) return 0.1;
  if (totalIncome <= 20000000) return 0.15;
  if (totalIncome <= 50000000) return 0.25;
  return 0.37;
}

/**
 * The gross total-income threshold just below `totalIncome` where the current
 * surcharge band starts (0 when total income is at or below 50L).
 */
function surchargeBoundaryTotalIncome(totalIncome: number, regime: 'new' | 'old'): number {
  if (totalIncome <= 5000000) return 0;
  if (regime === 'old' && totalIncome > 50000000) return 50000000;
  if (totalIncome > 20000000) return 20000000;
  if (totalIncome > 10000000) return 10000000;
  return 5000000;
}

interface LevelEval {
  slabTaxable: number;
  baseTax: number;
  surcharge: number;
  surchargeRate: number;
  preCess: number; // base tax + surcharge, before the 4% cess
}

/**
 * Evaluate base tax + surcharge (pre-cess) at a given total-income level. The
 * 15% equity-surcharge cap applies to the equity-gains portion of the base
 * tax; the band rate applies to the rest. At a total income exactly at a band
 * boundary the *lower* band rate is returned (the band is "above X up to Y").
 */
function evalAtLevel(
  regime: 'new' | 'old',
  slabIncomeGross: number,
  equityLtcgGain: number,
  equityStcgGain: number,
  ltcgPool: number,
  stdDed: number,
  oldOnlyDeductions: number,
  npsEmployer: number,
): LevelEval {
  const slabTaxable = Math.max(0, slabIncomeGross - stdDed - oldOnlyDeductions - npsEmployer);
  const ltcgTax = Math.max(0, equityLtcgGain - ltcgPool) * 0.125;
  const stcgTax = Math.max(0, equityStcgGain) * 0.2;
  const equityTax = ltcgTax + stcgTax;
  const baseTax =
    (regime === 'new' ? newRegimeTaxFY27(slabTaxable) : oldRegimeTaxFY27(slabTaxable)) +
    equityTax;
  const totalIncome = slabIncomeGross + equityLtcgGain + equityStcgGain;
  const rate = surchargeBandRate(totalIncome, regime);
  const equitySurchargeRate = Math.min(rate, 0.15);
  const surcharge = equityTax * equitySurchargeRate + (baseTax - equityTax) * rate;
  return {
    slabTaxable,
    baseTax,
    surcharge,
    surchargeRate: rate,
    preCess: baseTax + surcharge,
  };
}

function computeRegimeFullTax(
  regime: 'new' | 'old',
  slabIncomeGross: number,
  equityLtcgGain: number,
  equityStcgGain: number,
  ltcgPool: number,
  stdDed: number,
  oldOnlyDeductions: number,
  npsEmployer: number,
): RegimeFullTax {
  const actual = evalAtLevel(
    regime, slabIncomeGross, equityLtcgGain, equityStcgGain,
    ltcgPool, stdDed, oldOnlyDeductions, npsEmployer,
  );
  const totalIncome = slabIncomeGross + equityLtcgGain + equityStcgGain;

  // Marginal relief (Sec 111E style): cap the *incremental* tax + surcharge
  // on the income above the boundary B at (totalIncome - B). The counterfactual
  // is the total income exactly at B, priced at B's own (lower) band. Relief
  // is computed on (base tax + surcharge), pre-cess.
  let marginalRelief = 0;
  const boundary = surchargeBoundaryTotalIncome(totalIncome, regime);
  if (boundary > 0 && actual.surchargeRate > 0 && totalIncome > boundary) {
    const scale = boundary / totalIncome;
    const atBoundary = evalAtLevel(
      regime,
      slabIncomeGross * scale,
      equityLtcgGain * scale,
      equityStcgGain * scale,
      ltcgPool,
      stdDed,
      oldOnlyDeductions,
      npsEmployer * scale,
    );
    marginalRelief = Math.max(
      0,
      actual.preCess - atBoundary.preCess - (totalIncome - boundary),
    );
  }
  const surchargeAfterRelief = Math.max(0, actual.surcharge - marginalRelief);
  const cess = 0.04 * (actual.baseTax + surchargeAfterRelief);
  const total = actual.baseTax + surchargeAfterRelief + cess;
  return {
    taxableSlabIncome: actual.slabTaxable,
    baseTax: actual.baseTax,
    surchargeRate: actual.surchargeRate,
    surcharge: actual.surcharge,
    marginalRelief,
    surchargeAfterRelief,
    cess,
    total,
    effectiveRate: totalIncome > 0 ? total / totalIncome : 0,
  };
}

export function highIncomeTaxFY27(h: HighIncomeTaxInput): HighIncomeTaxResult {
  const ltcgPool = Math.max(0, h.ltcgPool ?? 125000);
  // Standard deduction: 75k new regime / 50k old regime, salaried only.
  const newStd = h.salaried ? 75000 : 0;
  const oldStd = h.salaried ? 50000 : 0;
  // Old-regime-only deductions, with statutory caps (Wave-9 conventions).
  const oldOnly =
    Math.min(Math.max(0, h.eightyC), 150000) +
    Math.min(Math.max(0, h.npsSelf), 50000) +
    Math.min(Math.max(0, h.healthInsurance), 100000) +
    Math.min(Math.max(0, h.homeLoanInterest), 200000);

  const newRegime = computeRegimeFullTax(
    'new', h.nonEquityIncome, h.equityLtcg, h.equityStcg,
    ltcgPool, newStd, 0, h.npsEmployer,
  );
  const oldRegime = computeRegimeFullTax(
    'old', h.nonEquityIncome, h.equityLtcg, h.equityStcg,
    ltcgPool, oldStd, oldOnly, h.npsEmployer,
  );

  const savingsByOld = newRegime.total - oldRegime.total;
  const winner: HighIncomeTaxResult['winner'] =
    savingsByOld > 0 ? 'old' : savingsByOld < 0 ? 'new' : 'tie';
  return { new: newRegime, old: oldRegime, winner, savingsByOld };
}

export function aifWaterfall(w: AifWaterfallInput): AifWaterfallResult {
  const grossFinalValue = w.committedCapital * w.grossMultiple;
  const totalProfit = Math.max(0, grossFinalValue - w.committedCapital);
  // Preferred return includes the capital back: total = committed x (1 + hurdle)^years.
  const lpPreferredReturn = w.committedCapital * Math.pow(1 + w.hurdleRate, w.years);
  const lpPrefIncremental = Math.max(0, lpPreferredReturn - w.committedCapital);
  const profitAboveHurdle = Math.max(0, grossFinalValue - lpPreferredReturn);

  // 100% catch-up: the GP takes everything in the zone between the hurdle and the
  // point where GP cumulative profit = carryPct of LP cumulative profit:
  // C / (lpPrefIncremental + C) = carryPct  =>  C = lpPrefIncremental*carry/(1-carry).
  const gpCatchUpAmount = w.catchUp
    ? Math.min(profitAboveHurdle, (lpPrefIncremental * w.carryPct) / (1 - w.carryPct))
    : 0;
  const remaining = Math.max(0, profitAboveHurdle - gpCatchUpAmount);
  const gpFinalSplit = remaining * w.carryPct;
  // If the fund does not reach the hurdle, the LP takes the whole final value.
  const lpCashReturn =
    profitAboveHurdle > 0
      ? lpPreferredReturn + remaining * (1 - w.carryPct)
      : grossFinalValue;
  const lpProfitAfterCatchUp = Math.max(0, lpCashReturn - w.committedCapital);

  // Cumulative management-fee drag (approx): annual fee x years on committed capital.
  const mgmtFeeDrag = w.mgmtFeePct * w.years * w.committedCapital;
  const lpNetProceeds = lpCashReturn - mgmtFeeDrag;
  const lpNetMultiple = w.committedCapital > 0 ? lpNetProceeds / w.committedCapital : 0;
  const lpNetIrr =
    w.years > 0 && lpNetProceeds > 0
      ? Math.pow(lpNetProceeds / w.committedCapital, 1 / w.years) - 1
      : 0;
  const gpTotalEconomics = gpCatchUpAmount + gpFinalSplit + mgmtFeeDrag;
  const gpShareOfProfit =
    totalProfit > 0 ? (gpCatchUpAmount + gpFinalSplit) / totalProfit : 0;
  const beatsHurdle = lpNetIrr > w.hurdleRate;

  return {
    grossFinalValue,
    totalProfit,
    lpPreferredReturn,
    lpCashReturn,
    gpCatchUpAmount,
    lpProfitAfterCatchUp,
    gpFinalSplit,
    lpFinalProceeds: lpCashReturn,
    mgmtFeeDrag,
    lpNetProceeds,
    lpNetMultiple,
    lpNetIrr,
    gpTotalEconomics,
    gpShareOfProfit,
    beatsHurdle,
  };
}
