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
 * NPS Tier-1 retirement exit (PFRDA 16 Dec 2025 amendment) + tax position.
 *
 * The Dec-2025 exit rules for non-government subscribers:
 *  - Corpus below the small-corpus threshold (Rs 8L): 100% lump-sum withdrawal.
 *  - Corpus at/above: up to 80% lump sum, at least 20% into a PFRDA-empanelled
 *    annuity; annuity purchase may be deferred up to age 85.
 *  - Premature exit (< 60, after the lock-in conditions): 20% lump sum, 80%
 *    annuity.
 *
 * Tax position (the part most calculators skip):
 *  - The lump-sum NPS corpus is exempt under Sec 10(10A)/10(i)(xii) only up
 *    to 60% of your total NPS contributions (self + employer). The 2025 exit
 *    rules let you TAKE 80% as a lump sum, but the extra 20% over the 60%
 *    contribution cap is taxable at your slab.
 *  - Annuity income is slab-taxed (EET on that leg).
 *
 * Conventions: corpus compounds monthly at a single annual rate; the annuity
 * is priced at a flat annual rate on the annuity corpus (the ~6-7% life
 * annuity band); the marginal rate applies to the taxable lump sum and to the
 * annuity income. This is a planning aid; the Sec 10(10A) 60%-cap wording and
 * any new-regime annuity exemption should be confirmed with a CA for the year.
 */
export interface NpsExitInput {
  monthlyContribution: number;
  employerPct: number;
  annualReturn: number;
  years: number;
  smallCorpusThreshold: number;
  lumpSumPct: number;
  annuityRate: number;
  marginalTaxRate: number;
  prematureExit: boolean;
  totalContributions?: number;
}

export interface NpsExitResult {
  corpus: number;
  totalContributions: number;
  isSmallCorpus: boolean;
  lumpSum: number;
  annuityCorpus: number;
  exemptLumpSum: number;
  taxableLumpSum: number;
  annualAnnuityIncome: number;
  afterTaxAnnuityIncome: number;
  afterTaxLumpSum: number;
  totalAfterTax: number;
}

export function npsRetirementExitFY27(n: NpsExitInput): NpsExitResult {
  const mRate = n.annualReturn / 12;
  const months = Math.max(0, Math.round(n.years * 12));
  const monthlyTotal = n.monthlyContribution * (1 + Math.max(0, n.employerPct));
  const corpus =
    months > 0 && mRate > 0
      ? monthlyTotal * ((Math.pow(1 + mRate, months) - 1) / mRate)
      : monthlyTotal * months;
  const totalContributions = n.totalContributions ?? monthlyTotal * months;

  const isSmallCorpus = corpus <= n.smallCorpusThreshold;
  // PFRDA 16 Dec 2025: a permitted premature exit (< 60) forces the tighter
  // 20/80 split; a normal exit at 60 defaults to up to 80% lump / 20% annuity
  // and lets the caller pick any lump-sum share up to 100%.
  let lumpPct: number;
  if (isSmallCorpus) {
    lumpPct = 1.0;
  } else if (n.prematureExit) {
    lumpPct = 0.2;
  } else {
    // Normal exit: the caller supplies the lump-sum share (0 = 100% annuity,
    // up to 1 = 100% lump). No default fallback - 0 is a valid 100%-annuity input.
    lumpPct = Math.min(1, Math.max(0, n.lumpSumPct));
  }

  const lumpSum = corpus * lumpPct;
  const annuityCorpus = corpus - lumpSum;

  // Statutory exemption capped at 60% of contributions (Sec 10(10A)/10(i)(xii)).
  const exemptLumpSum = Math.min(lumpSum, 0.6 * totalContributions);
  const taxableLumpSum = Math.max(0, lumpSum - exemptLumpSum);

  const annualAnnuityIncome = annuityCorpus * n.annuityRate;
  const t = Math.max(0, Math.min(1, n.marginalTaxRate));
  const afterTaxAnnuityIncome = annualAnnuityIncome * (1 - t);
  const afterTaxLumpSum = exemptLumpSum + taxableLumpSum * (1 - t);
  const totalAfterTax = afterTaxLumpSum + afterTaxAnnuityIncome;

  return {
    corpus,
    totalContributions,
    isSmallCorpus,
    lumpSum,
    annuityCorpus,
    exemptLumpSum,
    taxableLumpSum,
    annualAnnuityIncome,
    afterTaxAnnuityIncome,
    afterTaxLumpSum,
    totalAfterTax,
  };
}

/**
 * Senior-citizen regime decision for FY 2026-27 (Income-tax Act, 2025).
 *
 * Age brackets (only the OLD regime differentiates by age):
 *  - Senior (60-79): old-regime basic exemption Rs 3,00,000.
 *  - Super senior (80+): old-regime basic exemption Rs 5,00,000.
 *  - New regime: no age benefit; same slabs + 87A (to 12L) for everyone.
 *
 * Senior-specific deductions:
 *  - 80TTB: up to a limit (Rs 50,000 in FY 2025-26; a Budget-2026 raise to
 *    Rs 1,00,000 has been reported but is UNVERIFIED - pass `eightyTTBLimit`
 *    and confirm with a CA) on interest income, OLD regime only.
 *  - 80D: enhanced cap for seniors (Rs 50,000, vs Rs 25,000 for a regular
 *    individual under the pre-2025 structure) - passed in as `eightyD`.
 *  - TDS on senior interest starts only above Rs 1,00,000/yr (Form 15H stops
 *    it below the taxable limit) - informational, not modelled here.
 *
 * Conventions: `interestIncome` is the FD/RD/SCSS/savings interest eligible
 * for 80TTB; `otherIncome` is everything else (pension, rental, etc.). The
 * old-regime 87A rebate (to Rs 5L) and new-regime 87A (to 12L) are applied.
 */
export interface SeniorTaxInput {
  age: number;
  interestIncome: number;
  otherIncome: number;
  eightyTTBLimit: number;
  eightyD: number;
  eightyC?: number;
  homeLoanInterest?: number;
}

export interface SeniorRegimeResult {
  ageBracket: 'below-60' | 'senior' | 'super-senior';
  old: {
    basicExemption: number;
    eightyTTBApplied: number;
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  new: {
    basicExemption: number;
    eightyTTBApplied: number; // 0 - 80TTB is old-regime-only
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  totalIncome: number;
  eightyTTBValue: number; // the old-regime tax saved by the 80TTB deduction
  winner: 'old' | 'new' | 'tie';
  savingsByOld: number; // positive => old regime is cheaper
}

function seniorOldBasicExemption(age: number): number {
  if (age >= 80) return 500000;
  if (age >= 60) return 300000;
  return 250000;
}

/**
 * Old-regime slab tax on income-after-deductions, with an age-appropriate
 * basic-exemption nil band: nil up to `basicExemption`, 5% up to 5L, 20% up
 * to 10L, 30% above. (The 5/20/30 structure is the classic old regime; only
 * the nil-band start changes with age.)
 */
function seniorOldSlabTax(incomeAfterDeductions: number, basicExemption: number): number {
  if (incomeAfterDeductions <= basicExemption) return 0;
  let tax = 0;
  const b1Hi = 500000;
  const b2Hi = 1000000;
  if (basicExemption < b1Hi) {
    tax += (Math.min(incomeAfterDeductions, b1Hi) - basicExemption) * 0.05;
  }
  if (incomeAfterDeductions > b1Hi) {
    tax += (Math.min(incomeAfterDeductions, b2Hi) - b1Hi) * 0.2;
  }
  if (incomeAfterDeductions > b2Hi) {
    tax += (incomeAfterDeductions - b2Hi) * 0.3;
  }
  return tax;
}

export function seniorRegimeTaxFY27(s: SeniorTaxInput): SeniorRegimeResult {
  const totalIncome = s.interestIncome + s.otherIncome;
  const ageBracket: SeniorRegimeResult['ageBracket'] =
    s.age >= 80 ? 'super-senior' : s.age >= 60 ? 'senior' : 'below-60';

  // OLD regime: age-based basic exemption + 80TTB on interest (capped at the
  // limit and the interest actually earned) + 80D + the old-regime-only stack
  // (80C basket, 24(b) home-loan interest), on the 5/20/30 slabs.
  const oldBasic = seniorOldBasicExemption(s.age);
  const eightyTTBApplied = Math.min(s.eightyTTBLimit, Math.max(0, s.interestIncome));
  const eightyD = Math.max(0, s.eightyD);
  const eightyC = Math.min(Math.max(0, s.eightyC ?? 0), 150000);
  const homeLoan = Math.min(Math.max(0, s.homeLoanInterest ?? 0), 200000);
  const oldDeductions = eightyTTBApplied + eightyD + eightyC + homeLoan;
  const oldTaxable = Math.max(0, totalIncome - oldBasic - oldDeductions);
  let oldTax = seniorOldSlabTax(totalIncome - oldDeductions, oldBasic);
  // 87A (old regime): income up to 5L is tax-free regardless of age.
  if (totalIncome <= 500000) oldTax = 0;
  // The 80TTB value = the old tax if 80TTB were not claimed, minus the tax with it.
  let oldTaxNoTTB = seniorOldSlabTax(totalIncome - oldDeductions + eightyTTBApplied, oldBasic);
  if (totalIncome <= 500000) oldTaxNoTTB = 0;
  const eightyTTBValue = Math.max(0, oldTaxNoTTB - oldTax);

  // NEW regime: no age benefit, no 80TTB/80D, same 87A-to-12L rebate as everyone.
  const newTaxable = totalIncome; // no deductions available in the new regime
  const newTax = newRegimeTaxFY27(newTaxable);

  const oldEff = totalIncome > 0 ? oldTax / totalIncome : 0;
  const newEff = totalIncome > 0 ? newTax / totalIncome : 0;
  const savingsByOld = newTax - oldTax;
  const winner: SeniorRegimeResult['winner'] =
    savingsByOld > 0 ? 'old' : savingsByOld < 0 ? 'new' : 'tie';

  return {
    ageBracket,
    old: {
      basicExemption: oldBasic,
      eightyTTBApplied,
      taxableIncome: oldTaxable,
      tax: oldTax,
      effectiveRate: oldEff,
    },
    new: {
      basicExemption: 400000,
      eightyTTBApplied: 0,
      taxableIncome: newTaxable,
      tax: newTax,
      effectiveRate: newEff,
    },
    totalIncome,
    eightyTTBValue,
    winner,
    savingsByOld,
  };
}

/**
 * NRI (non-resident) India-source tax + TDS position for FY 2026-27.
 *
 * Residential status (Section 6, carried into the Income-tax Act, 2025):
 *  - Non-resident if IN India for fewer than 182 days in the FY AND fewer
 *    than the longer test (60 days in the FY + 365 days in the 4 preceding
 *    FYs, or 120 days in the FY + 365 days in the 4 preceding FYs if Indian
 *    income exceeds Rs 15L). Fail the residency tests and you are an NRI.
 *  - An NRI is taxed in India ONLY on India-source income; foreign income is
 *    outside the Indian net (subject to the RNOR/ROR nuance).
 *
 * TDS: payments to a non-resident are withheld under Section 195, generally
 * at a flat 30% (or the applicable CG rate: 20% listed STCG / 12.5% listed
 * and property LTCG, no 112A pool for NRI property; NRE/FCNR interest is
 * exempt), before surcharge and 4% cess. DTAA relief (a valid TRC + Form
 * 10F) lowers the rate where the treaty rate is below the domestic rate.
 *
 * Conventions: `domesticRate` is the pre-cess, pre-surcharge rate that
 * applies to this income head (0.30 for NRO interest / rent, 0.125 for a
 * 112A-listed-equity long-term gain, 0.20 for 111A short-term, etc.);
 * `dtaaRate` is the treaty rate (0.00 - 1.00) once a TRC + Form 10F is in
 * place; the applicable TDS rate is the LOWER of the two. Surcharge and
 * cess are applied on top where income is high enough (a flat flag, not a
 * full slabs model - see the high-income calculator).
 */
export interface NriTaxInput {
  daysInIndia: number;
  daysInLastFourYears: number;
  indianIncomeAbove15L: boolean;
  indiaSourceIncome: number;
  domesticRate: number;
  dtaaRate: number;
  dtaaApplies: boolean;
}

export interface NriTaxResult {
  residency: 'non-resident' | 'resident';
  qualifyingTest: string;
  taxableIndiaIncome: number;
  applicableTdsRate: number;
  tdsBeforeCess: number;
  cess4Pct: number;
  totalTdsWithCess: number;
  dtaaRelief: number; // TDS saved by the DTAA rate vs the domestic rate
}

export function nriIndiaTaxFY27(n: NriTaxInput): NriTaxResult {
  // Residency: NON-resident requires failing BOTH the 182-day test and the
  // long-term test (120-day variant when Indian income tops 15L).
  const longerDaysNeeded = n.indianIncomeAbove15L ? 120 : 60;
  const nonResident =
    n.daysInIndia < 182 &&
    !(
      n.daysInIndia >= longerDaysNeeded && n.daysInLastFourYears >= 365
    );
  const qualifyingTest = nonResident
    ? `Failed 182-day (${n.daysInIndia} days) and the ${longerDaysNeeded}-day + 365-day test (${n.daysInLastFourYears} prior-4-FY days)`
    : `Resident: ${n.daysInIndia >= 182 ? '182-day test met' : 'the ' + longerDaysNeeded + '-day + 365-day test met'}`;

  const domesticRate = Math.max(0, Math.min(1, n.domesticRate));
  const dtaaRate = Math.max(0, Math.min(1, n.dtaaRate));
  const treatyRate = n.dtaaApplies ? dtaaRate : domesticRate;
  const applicableTdsRate = Math.min(domesticRate, treatyRate);

  const tdsBeforeCess = n.indiaSourceIncome * applicableTdsRate;
  const cess4Pct = 0.04 * tdsBeforeCess;
  const totalTdsWithCess = tdsBeforeCess + cess4Pct;
  const dtaaRelief = n.dtaaApplies
    ? Math.max(0, (domesticRate - applicableTdsRate) * n.indiaSourceIncome)
    : 0;

  return {
    residency: nonResident ? 'non-resident' : 'resident',
    qualifyingTest,
    taxableIndiaIncome: nonResident ? n.indiaSourceIncome : n.indiaSourceIncome,
    applicableTdsRate,
    tdsBeforeCess,
    cess4Pct,
    totalTdsWithCess,
    dtaaRelief,
  };
}

/**
 * Capital-gains reinvestment exemption (Section 54 / 54F / 54EC) for FY 2026-27.
 *
 * After the Finance (No.2) Act 2024 rationalisation, long-term capital gains
 * are taxed at 12.5% without indexation, and the reinvestment exemptions
 * (54 house, 54F any-asset-to-house, 54EC notified bonds) are the primary
 * legal way to shelter a long-term gain. These exemptions are available to
 * residents AND NRIs.
 *
 * Conventions:
 *  - Only LONG-TERM gains qualify; the holding period is the caller's
 *    responsibility (property: 24 months, listed equity: 12 months).
 *  - `gain` is the net long-term capital gain (sale - cost - expenses).
 *  - `reinvested` is the amount actually invested in the new asset within
 *    the statutory window. The exemption is the SMALLER of the gain and the
 *    reinvested amount (the proportional rule): reinvesting less than the
 *    gain leaves the balance taxable.
 *  - `route` selects the cap: 54EC is capped at Rs 50L and only works on a
 *    long-term gain from a residential house (54) / any asset (54F
 *    reinvested via a house); 54/54F are subject to the Rs 10Cr cap on the
 *    new asset cost. The 6-month (54EC) vs 2-year-purchase/3-year-construction
 *    (54/54F) windows are the caller's compliance responsibility, modelled
 *    here by a `timeCompliant` flag that, when false, zeroes the exemption.
 *  - The tax saving is the 12.5% (or, for property/other-asset non-112A
 *    gains, the slab rate passed in) that would have applied to the exempt
 *    portion.
 */
/**
 * 54EC Tranche Tracker: the operational layer over a single-event rollover.
 *
 * The existing `rolloverExemption` answers "how much of one gain is exempt
 * if I reinvest it?". This one answers the follow-up question that actually
 * trips people up in practice: I have a sequence of 54EC bond issues
 * (tranches) I am buying across the 6-month window, each with a 5-year
 * lock-in. What happens when I redeem one early?
 *
 * The reversal trap: if you sell or transfer a 54EC bond before the 5-year
 * lock-in expires, the exemption for that tranche is withdrawn and the
 * original LTCG is taxed as long-term capital gain at 12.5% (no-indexation
 * base, post-Finance-No.2 Act 2024). This function models the net outcome:
 *
 *   1. The exemption captured by a compliant tranche.
 *   2. The tax saved vs the no-rollover baseline.
 *   3. The early-redemption reversal: the tranche's exemption lapses and the
 *      original gain re-enters the LTCG pot at 12.5%, with the interest
 *      accrued up to redemption being a separate income-head item.
 *
 * All inputs are Rs, months are calendar months, and all math is pure and
 * deterministic.
 */
export interface FiftyFourECTrancheInput {
  /** The original LTCG amount that generated the 54EC obligation. */
  originalGain: number;
  /** The amount actually invested in this 54EC tranche. */
  trancheInvested: number;
  /** The 54EC statutory reinvestment cap (Rs 50L, the default). */
  cap?: number;
  /** 12.5% post-Finance-No.2 Act 2024. */
  ltcgRate?: number;
  /** The 6-month statutory window, in months. */
  windowMonths?: number;
  /** The months from the sale date to when this tranche was invested.
   *  Must be <= windowMonths to be compliant; otherwise the exemption lapses
   *  for this tranche. */
  monthsFromSaleToInvest: number;
  /** The months the tranche is held before early redemption; -1 or a value
   *  >= lockInMonths means "held to maturity" (no reversal). */
  monthsHeldBeforeRedemption: number;
  /** 60 months for the standard 5-year lock-in. */
  lockInMonths?: number;
  /** A flat coupon rate for the 54EC bond, used to estimate the interest
   *  head on the tranche (54EC bond coupon interest is taxed at the
   *  investor's slab rate, not at 12.5%). */
  couponRate?: number;
  /** For early-redemption interest: the months of interest accrued up to
   *  redemption (defaults to monthsHeldBeforeRedemption when provided). */
  interestAccrualMonths?: number;
  /** Slab rate for coupon interest taxation (0.30 = 30% bracket assumed
   *  for the default HNI bracket). */
  slabRateForCoupon?: number;
}

export interface FiftyFourECTrancheResult {
  originalGain: number;
  trancheInvested: number;
  capApplied: number;
  trancheAfterCap: number; // the smaller of the tranche and the cap
  compliant: boolean; // monthsFromSaleToInvest <= windowMonths
  exemptionCaptured: number; // the smaller of the original gain and the (cap-bound,
  //   compliant-only) tranche
  taxSaved: number; // exemption x ltcgRate
  lockInMonths: number;
  earlyRedemption: boolean;
  // The reversal numbers: when earlyRedemption is true, the exemption for this
  // tranche lapses and the original gain re-enters the LTCG pot at ltcgRate.
  exemptionLapsed: number; // 0 when held-to-maturity or non-compliant
  reversalTax: number; // the tax on the lapsed exemption
  netTaxEffect: number; // reversalTax - taxSaved (negative = net saving)
  interestAccrual: number; // coupon x principal x months/12
  interestTax: number; // interest x slabRate
  totalTaxEffect: number; // netTaxEffect + interestTax
}

export function fiftyFourECTrancheTracker(inp: FiftyFourECTrancheInput): FiftyFourECTrancheResult {
  const originalGain = Math.max(0, inp.originalGain);
  const trancheInvested = Math.max(0, inp.trancheInvested);
  const cap = inp.cap ?? 5000000;
  const ltcgRate = inp.ltcgRate ?? 0.125;
  const windowMonths = inp.windowMonths ?? 6;
  const lockInMonths = inp.lockInMonths ?? 60;
  const couponRate = inp.couponRate ?? 0;
  const slabRate = inp.slabRateForCoupon ?? 0.30;
  const monthsFromSaleToInvest = inp.monthsFromSaleToInvest;
  const monthsHeld = inp.monthsHeldBeforeRedemption;
  const interestMonths =
    inp.interestAccrualMonths !== undefined
      ? inp.interestAccrualMonths
      : Math.max(0, monthsHeld);

  const trancheAfterCap = Math.min(trancheInvested, cap);
  const compliant = monthsFromSaleToInvest <= windowMonths;
  const baseExempt = Math.min(originalGain, compliant ? trancheAfterCap : 0);
  const taxSaved = baseExempt * ltcgRate;

  const earlyRedemption = monthsHeld >= 0 && monthsHeld < lockInMonths;
  // The portion of the gain whose exemption fails or lapses:
  //  - non-compliant: the whole original gain (it never got any exemption);
  //  - early redemption: the exemption captured earlier lapses;
  //  - held to maturity: nothing lapses (the non-exempted balance stays in the
  //    no-rollover baseline and is not a "reversal").
  const exemptionLapsed = !compliant ? originalGain : earlyRedemption ? baseExempt : 0;
  const reversalTax = exemptionLapsed * ltcgRate;
  const netTaxEffect = reversalTax - taxSaved;

  const interestAccrual = couponRate > 0 ? (trancheAfterCap * couponRate * interestMonths) / 12 : 0;
  const interestTax = interestAccrual * slabRate;

  return {
    originalGain,
    trancheInvested,
    capApplied: cap,
    trancheAfterCap,
    compliant,
    exemptionCaptured: baseExempt,
    taxSaved,
    lockInMonths,
    earlyRedemption,
    exemptionLapsed,
    reversalTax,
    netTaxEffect,
    interestAccrual,
    interestTax,
    totalTaxEffect: netTaxEffect + interestTax,
  };
}

export interface GiftCityLrsInput {
  /** The rupee amount you want to invest in the GIFT City scheme. */
  investRupees: number;
  /** Your total LRS remittance this FY *before* this one (Rs).
   *  The TCS-free threshold is Rs 10L on the *aggregate* LRS outflow. */
  priorLrsRemittance: number;
  /** The LRS TCS-free threshold (Rs 10L, post-Finance-Act-2025). */
  tcsThreshold?: number;
  /** The LRS TCS rate on investment remittances above the threshold (20%). */
  tcsRate?: number;
  /** The USD LRS annual limit (USD 250,000). */
  lrsUsdLimit?: number;
  /** The USD/INR rate for the cap check (illustrative, e.g. 84). */
  usdInr?: number;
  /** Months the units are held; >= 24 = long-term, else short-term. */
  monthsHeld: number;
  /** The gain per rupee invested (e.g. 0.15 = a 15% gain), for the two
   *  treatment outcomes below. */
  gainPct: number;
  /** Your marginal slab rate for STCG / specified-MF gains (e.g. 0.30). */
  slabRate?: number;
}

export interface GiftCityLrsResult {
  investRupees: number;
  /** The aggregate LRS outflow after adding this remittance. */
  aggregateLrs: number;
  /** The portion of the aggregate above the Rs 10L TCS-free threshold. */
  tcsable: number;
  /** The TCS collected at source (20% of the tcsable portion). */
  tcs: number;
  /** The cash you must keep at source to complete the investment
   *  (investment + TCS) - the "reservation" the article models. */
  sourceCashNeeded: number;
  /** TCS as a % of the investment (the real cash-flow hit at remittance). */
  tcsPctOfInvestment: number;
  /** True when the remittance (at the assumed USD/INR) would exceed the
   *  USD 250,000 LRS limit after the prior outflow. */
  exceedsLrsCap: boolean;
  lrsCapRupees: number;
  // The two coexisting tax positions for GIFT City gains in FY 2026-27:
  /** Indian-side route: 12.5% LTCG (no pool) when held 24+ months, slab
   *  STCG when held shorter; Schedule FA disclosure mandatory. */
  indianSideTreatment: {
    holdingClass: 'long-term' | 'short-term';
    rate: number;
    taxOnGain: number;
    note: string;
  };
  /** Fund-level route: the scheme pays tax at the fund level and reflects
   *  it in a post-tax NAV, so the investor generally owes no separate
   *  CG compute - confirm in the scheme's offer document. */
  fundLevelPostTaxNav: {
    investorSideCg: number;
    note: string;
  };
  /** A reminder that TCS is a credit, not a cost: it is recovered against
   *  your final liability at ITR filing. */
  tcsRecoverable: boolean;
}

/**
 * The GIFT City / IFSC LRS route: the TCS reservation math and the two
 * coexisting tax-treatment positions (Indian-side 12.5% LTCG + Schedule FA
 * vs fund-level post-tax NAV with no separate CG compute).
 *
 * Verified FY 2026-27 position:
 *  - LRS cap USD 250,000/person/FY; TCS-free threshold Rs 10L on the
 *    aggregate LRS outflow (raised from Rs 7L by the Finance Act 2025).
 *  - Investment-purpose LRS remittances attract 20% TCS above the threshold
 *    (credit against final tax at ITR; education/medical/tour dropped to 2%
 *    from 1 Apr 2026, so the 20% rate is specific to the "other/investment"
 *    bucket).
 *  - GIFT City funds are IFSCA-regulated (not SEBI), so they sit outside
 *    the SEBI USD 7B MF industry ceiling.
 *  - The Indian-side treatment of the gains is foreign-asset rules: 12.5%
 *    no-indexation LTCG after 24 months, slab STCG, Schedule FA mandatory.
 *  - Some GIFT City schemes instead pay tax at the fund level and reflect it
 *    in a post-tax NAV (no separate investor-side CG) - the offer document
 *    decides; this function models both positions so a planner can see the
 *    spread.
 */
export function giftCityLrsTaxFY27(inp: GiftCityLrsInput): GiftCityLrsResult {
  const invest = Math.max(0, inp.investRupees);
  const prior = Math.max(0, inp.priorLrsRemittance);
  const threshold = inp.tcsThreshold ?? 1000000;
  const tcsRate = inp.tcsRate ?? 0.2;
  const usdLimit = inp.lrsUsdLimit ?? 250000;
  const usdInr = inp.usdInr ?? 84;
  const monthsHeld = inp.monthsHeld;
  const gainPct = inp.gainPct;
  const slabRate = inp.slabRate ?? 0.3;

  const aggregateLrs = prior + invest;
  const tcsable = Math.max(0, aggregateLrs - threshold);
  const tcs = tcsable * tcsRate;
  const sourceCashNeeded = invest + tcs;
  const tcsPctOfInvestment = invest > 0 ? tcs / invest : 0;

  const lrsCapRupees = usdLimit * usdInr;
  const exceedsLrsCap = aggregateLrs > lrsCapRupees;

  const isLtcg = monthsHeld >= 24;
  const indianRate = isLtcg ? 0.125 : slabRate;
  const gainRupees = invest * Math.max(0, gainPct);
  const indianSideTreatment: GiftCityLrsResult['indianSideTreatment'] = {
    holdingClass: isLtcg ? 'long-term' : 'short-term',
    rate: indianRate,
    taxOnGain: gainRupees * indianRate,
    note: isLtcg
      ? 'Foreign-asset route: 12.5% no-indexation LTCG after 24 months + Schedule FA disclosure'
      : 'STCG at the slab rate + Schedule FA disclosure',
  };
  const fundLevelPostTaxNav: GiftCityLrsResult['fundLevelPostTaxNav'] = {
    investorSideCg: 0,
    note: 'Fund-level post-tax NAV: the scheme pays the tax at the fund level; confirm in the offer document',
  };

  return {
    investRupees: invest,
    aggregateLrs,
    tcsable,
    tcs,
    sourceCashNeeded,
    tcsPctOfInvestment,
    exceedsLrsCap,
    lrsCapRupees,
    indianSideTreatment,
    fundLevelPostTaxNav,
    tcsRecoverable: true,
  };
}

/* ------------------------------------------------------------------
 * Capital Inflow Migration Planner (the "I have 10L now, more later"
 * scheduling layer that capitalLadderFY27's single-corpus trajectory
 * does not cover)
 *
 * capitalLadderFY27 models ONE lump + a SIP and asks "when does the
 * corpus cross each rung?". This planner adds the thing that actually
 * happens in a real plan: a SEQUENCE of discrete future capital events
 * (a promotion at month 12, an ESOP exit at month 36, an inheritance
 * at month 48, ...) and asks "at each rung that opens, what margin do
 * I deploy and into which instrument?" It is a deployment-scheduling
 * model, not a tax compute.
 *
 * All math is pure and deterministic; the corpus compounds monthly at
 * a constant nominal return plus the SIP, with each inflow landing at
 * its month. The "deployable margin" at a rung is the corpus at the
 * unlock month minus that rung's threshold (floored at 0) - the amount
 * that can move UP into the newly-opened instrument without touching
 * the already-deployed lower-rung capital.
 * ------------------------------------------------------------------ */

export interface CapitalInflowEvent {
  /** The rupee amount of the event (promotion, ESOP exit, inheritance). */
  amount: number;
  /** The 1-based month it lands (0 = a starting lump, i.e. month 0). */
  month: number;
  /** A short label for the schedule output. */
  label?: string;
}

export interface CapitalInflowMigrationInput {
  /** The corpus you can deploy at month 0. */
  currentCorpus: number;
  /** The recurring monthly SIP. */
  monthlySip: number;
  /** Nominal annual return as a decimal (e.g. 0.09). */
  annualReturn: number;
  /** The discrete future capital events, each landing at its month. */
  inflows: CapitalInflowEvent[];
  /** Whole years of the planning horizon (default 30). */
  horizonYears?: number;
}

export interface CapitalInflowMigrationRung {
  id: string;
  name: string;
  threshold: number;
  /** -1 when the rung does not open within the horizon. */
  unlockMonth: number;
  /** The corpus at the unlock month. */
  corpusAtUnlock: number;
  /** The deployable margin at the unlock: corpus - threshold, floored 0. */
  deployableMargin: number;
  /** The instrument to deploy the margin into when the rung opens. */
  instrument: string;
}

export interface CapitalInflowMigrationResult {
  horizonMonths: number;
  /** The corpus sampled at every 12 months (for the chart). */
  corpusByYear: number[];
  /** The total discrete capital added across all inflows. */
  totalInflows: number;
  migrationSchedule: CapitalInflowMigrationRung[];
  /** The next rung that is still locked and will open within the
   *  horizon (or null when all are open / none will open). */
  nextLockedRung: string | null;
  nextLockedUnlockMonth: number;
  /** A human-readable note on the deployment discipline. */
  note: string;
}

export function capitalInflowMigrationPlanner(
  inp: CapitalInflowMigrationInput,
): CapitalInflowMigrationResult {
  const corpus0 = Math.max(0, inp.currentCorpus);
  const sip = Math.max(0, inp.monthlySip);
  const rMonthly = inp.annualReturn / 12;
  const years = inp.horizonYears ?? 30;
  const horizonMonths = Math.max(1, years * 12);

  // Index the inflows by their landing month (0 = the starting lump).
  const inflowByMonth = new Map<number, number>();
  let totalInflows = 0;
  for (const ev of inp.inflows ?? []) {
    if (ev.month <= 0) continue; // month 0 is already currentCorpus
    inflowByMonth.set(ev.month, (inflowByMonth.get(ev.month) ?? 0) + Math.max(0, ev.amount));
    totalInflows += Math.max(0, ev.amount);
  }

  // Build the month-by-month corpus trajectory.
  let current = corpus0;
  const trajectory: number[] = [current];
  for (let m = 1; m <= horizonMonths; m++) {
    current = current * (1 + rMonthly) + sip;
    if (inflowByMonth.has(m)) current += inflowByMonth.get(m) as number;
    trajectory.push(current);
  }

  const corpusByYear: number[] = [];
  for (let y = 0; y <= years; y++) {
    const idx = Math.min(horizonMonths, y * 12);
    corpusByYear.push(trajectory[idx]);
  }

  // The four rung thresholds + the instrument to deploy the margin into.
  const rungs: Array<Omit<CapitalInflowMigrationRung, 'unlockMonth' | 'corpusAtUnlock' | 'deployableMargin'>> = [
    {
      id: 'sif-10l',
      name: 'SIF',
      threshold: 1000000,
      instrument: 'SEBI Specialized Investment Fund (PAN-level, MF Regs 2026)',
    },
    {
      id: 'prim-25l',
      name: 'PMS/PRIM',
      threshold: 2500000,
      instrument: 'MF-only PMS "PRIM" route (PM Regs 2026, eff 1 Apr 2027) + AIF-employee',
    },
    {
      id: 'pms-50l',
      name: 'Standard PMS',
      threshold: 5000000,
      instrument: 'dedicated PMS portfolio + the 54EC recycling cap',
    },
    {
      id: 'aif-1cr',
      name: 'AIF',
      threshold: 10000000,
      instrument: 'AIF Category I/II/III (VC/PE, debt, long-short)',
    },
  ];

  const migrationSchedule: CapitalInflowMigrationRung[] = rungs.map((def) => {
    let unlockMonth = 0;
    if (corpus0 >= def.threshold) {
      unlockMonth = 0;
    } else {
      unlockMonth = -1;
      for (let m = 1; m <= horizonMonths; m++) {
        if (trajectory[m] >= def.threshold) {
          unlockMonth = m;
          break;
        }
      }
    }
    const corpusAtUnlock = unlockMonth >= 0 ? trajectory[unlockMonth] : 0;
    const deployableMargin = unlockMonth >= 0 ? Math.max(0, corpusAtUnlock - def.threshold) : 0;
    return {
      id: def.id,
      name: def.name,
      threshold: def.threshold,
      unlockMonth,
      corpusAtUnlock,
      deployableMargin,
      instrument: def.instrument,
    };
  });

  const nextLocked = migrationSchedule.find((r) => r.unlockMonth > 0) ?? null;
  const nextLockedRung = nextLocked ? nextLocked.id : null;
  const nextLockedUnlockMonth = nextLocked ? nextLocked.unlockMonth : -1;

  const note =
    'Deploy each rung margin at the moment it opens (not before) - the rung threshold is the *minimum*, and the after-tax fee-crossover decides whether the higher rung actually beats the low-cost build-up. A discrete inflow that lands right at a rung boundary is the natural moment to move that margin UP, not to over-allocate early.';

  return {
    horizonMonths,
    corpusByYear,
    totalInflows,
    migrationSchedule,
    nextLockedRung,
    nextLockedUnlockMonth,
    note,
  };
}

export interface GiftCityRouteInput {
  /** The rupee (or USD) amount deployed. */
  invest: number;
  /** The underlying index return per year, pre-cost (e.g. 0.10 = 10%). */
  grossAnnualReturn: number;
  /** Whole years held. 2+ means the gain is long-term on both routes. */
  yearsHeld: number;
  /** The GIFT City scheme's ALL-IN TER (scheme TER + underlying-ETF TER), e.g.
   *  0.0035 for the PPFAS S&P 500 FoF. The TER is netted into the base return. */
  giftAllInTer: number;
  /** The GIFT City fund-level tax rate on the realized gain: 0.1495 (LTCG,
   *  >24mo) or 0.4274 (STCG) per DSP's fund-level tax schedule. */
  giftTaxRate: number;
  /** The direct LRS route's all-in TER (a low-cost US ETF such as VOO-class
   *  is ~0.0003; a Nasdaq-100 ETF is ~0.002). */
  directAllInTer: number;
  /** The direct-route capital-gains rate: 0.125 (12.5% no-indexation LTCG,
   *  24mo+) or the slab rate (STCG). */
  directTaxRate: number;
  /** The direct route requires Schedule FA disclosure; the GIFT City
   *  fund-level route (DSP position) does not. */
  directScheduleFa: boolean;
}

export interface GiftCityRouteResult {
  invest: number;
  /** The pre-tax future value on each route (the TER is already netted in). */
  giftPreTaxFuture: number;
  directPreTaxFuture: number;
  /** The realized gain on each route before the route's own tax. */
  giftGain: number;
  directGain: number;
  /** The route's tax on the realized gain. */
  giftFundLevelTax: number;
  directTax: number;
  /** The final value after the route's tax. */
  giftFinalValue: number;
  directFinalValue: number;
  /** Net return on the deployed capital after cost + tax. */
  giftNetReturnPct: number;
  directNetReturnPct: number;
  /** The linear cost-drag approximation (invest x TER x years) for display. */
  giftCostDragApprox: number;
  directCostDragApprox: number;
  /** The CG-rate spread: positive = the GIFT City route's embedded tax is
   *  HIGHER than the direct route's (the 14.95% vs 12.5% case). */
  taxRateSpread: number;
  /** True when the GIFT City route avoids the Schedule FA disclosure that the
   *  direct route carries. */
  giftNoScheduleFa: boolean;
  /** Which route has the higher final value (before the Schedule FA /
   *  operational-complexity judgment). */
  edgeRoute: 'gift' | 'direct' | 'tie';
  edgeAmount: number;
  edgePctOfInvest: number;
  note: string;
}

/**
 * The two-route net comparison for a GIFT City global sleeve: the GIFT City
 * fund-level post-tax-NAV route (TER netted in + the fund's own embedded
 * capital-gains tax, no investor-side CG, no Schedule FA per the DSP position)
 * vs the direct LRS route (a low-cost US ETF's TER + the 12.5% no-indexation
 * LTCG + Schedule FA + the 20% TCS reservation).
 *
 * All math is pure and deterministic. The TER is netted into the base return
 * so it is not double-counted with the cost-drag display figure.
 */
export function giftCityRouteComparison(inp: GiftCityRouteInput): GiftCityRouteResult {
  const invest = Math.max(0, inp.invest);
  const yrs = Math.max(0, inp.yearsHeld);

  const giftBase = 1 + inp.grossAnnualReturn - inp.giftAllInTer;
  const directBase = 1 + inp.grossAnnualReturn - inp.directAllInTer;
  const giftPreTaxFuture = invest * Math.pow(giftBase, yrs);
  const directPreTaxFuture = invest * Math.pow(directBase, yrs);

  const giftGain = Math.max(0, giftPreTaxFuture - invest);
  const directGain = Math.max(0, directPreTaxFuture - invest);

  const giftFundLevelTax = giftGain * inp.giftTaxRate;
  const directTax = directGain * inp.directTaxRate;

  const giftFinalValue = giftPreTaxFuture - giftFundLevelTax;
  const directFinalValue = directPreTaxFuture - directTax;

  const giftNetReturnPct = invest > 0 ? (giftFinalValue - invest) / invest : 0;
  const directNetReturnPct = invest > 0 ? (directFinalValue - invest) / invest : 0;

  const giftCostDragApprox = invest * inp.giftAllInTer * yrs;
  const directCostDragApprox = invest * inp.directAllInTer * yrs;
  const taxRateSpread = inp.giftTaxRate - inp.directTaxRate;
  const edgeAmount = giftFinalValue - directFinalValue;
  const edgePctOfInvest = invest > 0 ? edgeAmount / invest : 0;
  const edgeRoute: GiftCityRouteResult['edgeRoute'] =
    edgeAmount > 0 ? 'gift' : edgeAmount < 0 ? 'direct' : 'tie';

  let note = '';
  if (taxRateSpread > 0) {
    note =
      'The GIFT City route embedded ' +
      (inp.giftTaxRate * 100).toFixed(2) +
      '% on the gain vs ' +
      (inp.directTaxRate * 100).toFixed(1) +
      '% on the direct route - the embedded fund-level rate is HIGHER, so the GIFT City route wins only on operational simplicity (no Schedule FA, no USD brokerage), not on the CG rate.';
  } else if (taxRateSpread < 0) {
    note =
      'The GIFT City route embedded a LOWER rate than the direct route on the gain - a net-after-tax edge for the GIFT City route, plus no Schedule FA.';
  } else {
    note = 'The two routes tax the gain at the same rate; the decision is the TER gap + the Schedule FA / operational cost.';
  }

  return {
    invest,
    giftPreTaxFuture,
    directPreTaxFuture,
    giftGain,
    directGain,
    giftFundLevelTax,
    directTax,
    giftFinalValue,
    directFinalValue,
    giftNetReturnPct,
    directNetReturnPct,
    giftCostDragApprox,
    directCostDragApprox,
    taxRateSpread,
    giftNoScheduleFa: inp.directScheduleFa,
    edgeRoute,
    edgeAmount,
    edgePctOfInvest,
    note,
  };
}

export interface RolloverInput {
  gain: number;
  reinvested: number;
  route: '54' | '54F' | '54EC';
  timeCompliant: boolean;
  ltcgOnly: boolean;
  taxRateOnGain: number;
}

export interface RolloverResult {
  route: RolloverInput['route'];
  longTermGain: number;
  reinvested: number;
  timeCompliant: boolean;
  routeCap: number; // the reinvestment cap for this route (0 = none modelled)
  exemptAmount: number;
  taxableGain: number;
  taxSaved: number;
  taxOnGainIfNoRollover: number;
}

export function rolloverExemption(r: RolloverInput): RolloverResult {
  const gain = Math.max(0, r.gain);
  const reinvested = Math.max(0, r.reinvested);

  // Route caps: 54EC is a hard Rs 50L reinvestment cap; 54/54F reinvestment
  // is effectively uncapped in this model (the Rs 10Cr new-asset-cost cap is
  // a ceiling on the asset, not the gain, and is not the binding number here).
  const routeCap = r.route === '54EC' ? 5000000 : 0;
  const capApplied = routeCap > 0 ? Math.min(reinvested, routeCap) : reinvested;

  // The proportional rule: exemption = the smaller of the gain and the
  // (capped) reinvested amount - but only if the reinvestment happened within
  // the statutory window and the gain is a long-term gain.
  const eligible = r.timeCompliant && r.ltcgOnly;
  const exemptAmount = eligible ? Math.min(gain, capApplied) : 0;
  const taxableGain = Math.max(0, gain - exemptAmount);

  const rate = Math.max(0, Math.min(1, r.taxRateOnGain));
  const taxOnGainIfNoRollover = gain * rate;
  const taxSaved = exemptAmount * rate;

  return {
    route: r.route,
    longTermGain: gain,
    reinvested,
    timeCompliant: r.timeCompliant,
    routeCap,
    exemptAmount,
    taxableGain,
    taxSaved,
    taxOnGainIfNoRollover,
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
 * Pre-IPO / unlisted-equity tax outcome: the 24-month vs 12-month holding
 * asymmetry and the unlisted-LTCG (Sec 112, no pool) vs listed-LTCG
 * (Sec 112A, shared Rs 1.25L pool) split that decide what a pre-IPO win
 * actually leaves in your pocket.
 *
 * Verified FY 2026-27 position (post Budget-2024, renumbered under the
 * Income-tax Act 2025):
 *  - Unlisted equity held > 24 months: LTCG at 12.5% (Sec 112), WITHOUT
 *    indexation and with NO Rs 1.25L exemption (the 112A pool applies only
 *    to listed equity / specified equity MFs / business-trust units).
 *  - Unlisted equity held <= 24 months: STCG at your slab rate.
 *  - Once listed and sold on the exchange (STT paid), the 12-month 112A
 *    test applies: > 12 months = 12.5% above the shared Rs 1.25L pool;
 *    <= 12 months = 20% (111A). The holding period starts at your
 *    acquisition transfer, not at listing.
 *
 * Conventions: gross gain is (sale - cost) x units, floored at 0; the
 * tax head is chosen by (isListedAtSale, monthsHeld); this is an exit-time
 * tax aid, not a model of the 6-month ICDR Reg 17 post-IPO lock-in itself
 * (that is the article's structural point, not a number this function takes).
 */
export interface PreIpoTaxInput {
  costPerUnit: number;
  units: number;
  salePricePerUnit: number;
  monthsHeld: number;
  isListedAtSale: boolean;
  sharedLtcgPool: number;
  marginalSlabRate: number;
}

export interface PreIpoTaxResult {
  totalCost: number;
  saleValue: number;
  grossGain: number;
  taxHead: 'unlisted-ltcg' | 'unlisted-stcg' | 'listed-ltcg' | 'listed-stcg';
  taxRate: number;
  poolApplied: number;
  taxPaid: number;
  afterTaxGain: number;
  netReturnPct: number;
}

export function preIpoTaxOutcome(p: PreIpoTaxInput): PreIpoTaxResult {
  const totalCost = p.costPerUnit * p.units;
  const saleValue = p.salePricePerUnit * p.units;
  const grossGain = Math.max(0, saleValue - totalCost);
  const slab = Math.max(0, Math.min(1, p.marginalSlabRate));

  let taxHead: PreIpoTaxResult['taxHead'];
  let taxRate: number;
  let poolApplied: number;

  if (p.isListedAtSale) {
    // Sold on the exchange (STT paid): the 12-month 112A test governs.
    if (p.monthsHeld > 12) {
      taxHead = 'listed-ltcg';
      taxRate = 0.125;
      poolApplied = Math.min(Math.max(0, p.sharedLtcgPool), grossGain);
    } else {
      taxHead = 'listed-stcg';
      taxRate = 0.2;
      poolApplied = 0;
    }
  } else {
    // Still unlisted at sale: the 24-month Sec 112 test governs.
    if (p.monthsHeld > 24) {
      taxHead = 'unlisted-ltcg';
      taxRate = 0.125;
      poolApplied = 0; // no Rs 1.25L exemption on unlisted equity LTCG
    } else {
      taxHead = 'unlisted-stcg';
      taxRate = slab; // unlisted STCG at the slab rate
      poolApplied = 0;
    }
  }

  const taxBase = Math.max(0, grossGain - poolApplied);
  const taxPaid = taxBase * taxRate;
  const afterTaxGain = grossGain - taxPaid;
  const netReturnPct = totalCost > 0 ? afterTaxGain / totalCost : 0;

  return {
    totalCost,
    saleValue,
    grossGain,
    taxHead,
    taxRate,
    poolApplied,
    taxPaid,
    afterTaxGain,
    netReturnPct,
  };
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

/**
 * DTAA (Double Taxation Avoidance Agreement) relief for India-source income of a
 * non-resident, FY 2026-27.
 *
 * A non-resident's India-source income (NRO interest, dividends, royalties, FTS)
 * is withheld at the *domestic* TDS rate unless the resident of a treaty country
 * claims the lower *treaty* rate by supplying a Tax Residency Certificate and
 * Form 41 (formerly 10F). This model compares the two routes, adds surcharge +
 * the 4% Health & Education cess on top, and (optionally) models the
 * residence-country foreign tax credit under section 91.
 *
 * Convention:
 *  - `domesticRate` / `treatyRate` are fractions before surcharge/cess
 *    (e.g. 0.30 for Section 195 on NRO interest, 0.20 for dividends).
 *  - All-in figure = rate x income x (1 + surchargePct) x (1 + cessPct).
 *  - Foreign tax credit (section 91) in the residence country is capped at the
 *    lesser of the India-side tax actually paid and the residence-country tax on
 *    the same income. `residenceTax` of 0 models an exemption-method country
 *    (UAE / Saudi / Kuwait) where no residence-side tax is levied.
 */
export interface DtaaReliefFY27Input {
  /** Gross India-source income to be withheld on, in Rs. */
  income: number;
  /** Domestic TDS rate before surcharge/cess (fraction). E.g. 0.30 (NRO interest). */
  domesticRate: number;
  /** DTAA treaty rate (fraction). E.g. 0.15 (US/UK/SG/AU) or 0.10 (DE/NL/JP/FR). */
  treatyRate: number;
  /** Surcharge applied to the withholding tax as a fraction of that tax. Default 0. */
  surchargePct?: number | null;
  /** Health & Education cess as a fraction of (tax + surcharge). Default 0.04. */
  cessPct?: number | null;
  /** Residence-country tax on the same income, in Rs (for the section 91 credit). Default 0. */
  residenceTax?: number | null;
}

export interface DtaaReliefFY27Output {
  income: number;
  domesticRate: number;
  treatyRate: number;
  /** income x domesticRate, before surcharge/cess. */
  domesticWithholding: number;
  /** income x treatyRate, before surcharge/cess. */
  treatyWithholding: number;
  /** domesticWithholding - treatyWithholding, floored at 0. */
  tdsSaved: number;
  /** All-in domestic route: (tax + surcharge) x (1 + cess). */
  domesticAllIn: number;
  /** All-in treaty route: (tax + surcharge) x (1 + cess). */
  treatyAllIn: number;
  /** domesticAllIn - treatyAllIn, floored at 0. */
  savingAllIn: number;
  /** domesticAllIn / income. */
  effectiveRateDomestic: number;
  /** treatyAllIn / income. */
  effectiveRateTreaty: number;
  residenceTax: number;
  /** section 91 credit: min(residenceTax, treatyAllIn). */
  foreignTaxCredit: number;
  /** max(0, residenceTax - foreignTaxCredit): the net extra the residence country still takes. */
  netAdditionalTax: number;
  /** Total across both countries on the treaty route: treatyAllIn + netAdditionalTax. */
  totalTaxBurdenTreatyRoute: number;
  /** Total across both countries on the domestic route: domesticAllIn + net extra vs domestic. */
  totalTaxBurdenDomesticRoute: number;
  /** True when a residence-country tax is present (credit-method corridor). */
  creditMethod: boolean;
}

export function dtaaReliefFY27(inp: DtaaReliefFY27Input): DtaaReliefFY27Output {
  const income = Math.max(0, inp.income);
  const domesticRate = Math.min(1, Math.max(0, inp.domesticRate));
  const treatyRate = Math.min(1, Math.max(0, inp.treatyRate));
  const surchargePct =
    inp.surchargePct !== null && inp.surchargePct !== undefined ? inp.surchargePct : 0;
  const cessPct =
    inp.cessPct !== null && inp.cessPct !== undefined ? inp.cessPct : 0.04;
  const residenceTax = Math.max(0, inp.residenceTax ?? 0);

  const domesticWithholding = income * domesticRate;
  const treatyWithholding = income * treatyRate;
  const tdsSaved = Math.max(0, domesticWithholding - treatyWithholding);

  const allIn = (rate: number) =>
    income * rate * (1 + surchargePct) * (1 + cessPct);
  const domesticAllIn = allIn(domesticRate);
  const treatyAllIn = allIn(treatyRate);
  const savingAllIn = Math.max(0, domesticAllIn - treatyAllIn);

  const effectiveRateDomestic = income > 0 ? domesticAllIn / income : 0;
  const effectiveRateTreaty = income > 0 ? treatyAllIn / income : 0;

  const foreignTaxCredit = Math.min(residenceTax, treatyAllIn);
  const netAdditionalTax = Math.max(0, residenceTax - foreignTaxCredit);
  const totalTaxBurdenTreatyRoute = treatyAllIn + netAdditionalTax;

  const domesticFtc = Math.min(residenceTax, domesticAllIn);
  const totalTaxBurdenDomesticRoute =
    domesticAllIn + Math.max(0, residenceTax - domesticFtc);

  return {
    income,
    domesticRate,
    treatyRate,
    domesticWithholding,
    treatyWithholding,
    tdsSaved,
    domesticAllIn,
    treatyAllIn,
    savingAllIn,
    effectiveRateDomestic,
    effectiveRateTreaty,
    residenceTax,
    foreignTaxCredit,
    netAdditionalTax,
    totalTaxBurdenTreatyRoute,
    totalTaxBurdenDomesticRoute,
    creditMethod: residenceTax > 0,
  };
}

/* ------------------------------------------------------------------
 * Capital Ladder: the "I have 10L now, more later" roadmap
 *
 * Models the investor's corpus growth (lump + monthly SIP + an optional
 * future lump-sum event) against the four regulatory rung thresholds that
 * unlock the professional-grade avenues (SIF, PMS/PRIM, standard PMS, AIF)
 * and reports the surcharge tier at a current vs a future income level.
 *
 * Verified FY 2026-27 rung thresholds (SEBI):
 *   - SIF  (SEBI MF Regs 2026, eff 1 Apr 2026)             : Rs 10,00,000 (PAN-level)
 *   - PMS/PRIM MF-only (SEBI PM Regs 2026, eff 1 Apr 2027) : Rs 25,00,000
 *   - AIF employee/director exception                       : Rs 25,00,000
 *   - Standard PMS (minimum per client)                      : Rs 50,00,000
 *   - AIF (HNI route)                                       : Rs 1,00,00,000
 *
 * All math is pure and deterministic. `monthlySip` and `annualReturn`
 * drive the corpus trajectory; the surcharge model uses the FY 2026-27
 * new-regime bands (10% above 50L, 15% above 1Cr, 25% above 2Cr).
 * ------------------------------------------------------------------ */

export interface CapitalLadderRung {
  id: string;
  name: string;
  threshold: number;
  unlocks: string;
  instruments: string[];
  status: 'unlocked' | 'locked';
  /** 0 = already unlocked, -1 = not within the 30-year horizon. */
  monthsToUnlock: number;
}

export interface CapitalLadderSurcharge {
  currentTier: { label: string; rate: number };
  futureTier: { label: string; rate: number };
  /** Rs, pre-cess, on currentAnnualIncome. */
  surchargeNow: number;
  /** Rs, pre-cess, on futureAnnualIncome. */
  surchargeLater: number;
  increase: number;
}

export interface CapitalLadderInput {
  currentCorpus: number;
  monthlySip: number;
  /** Nominal annual return as a decimal, e.g. 0.09. */
  annualReturn: number;
  /** A future lump-sum event (promotion / bonus / ESOP). */
  additionalCapital?: number;
  /** 1-based month it lands; 0/undefined = none. */
  additionalCapitalMonth?: number;
  currentAnnualIncome?: number;
  futureAnnualIncome?: number;
  regime?: 'new' | 'old';
}

export interface CapitalLadderResult {
  rungs: CapitalLadderRung[];
  nextRungId: string | null;
  /** -1 if no rung remains or none is reached within the horizon. */
  monthsToNextRung: number;
  /** Fractional years; -1 when no next rung. */
  yearsToNextRung: number;
  corpusAtHorizon: number;
  horizonMonths: number;
  surcharge: CapitalLadderSurcharge;
}

/** The four regulatory rung thresholds (verified SEBI minimums). */
const LADDER_RUNGS: Array<Omit<CapitalLadderRung, 'status' | 'monthsToUnlock'>> = [
  {
    id: 'sif-10l',
    name: 'SIF unlock',
    threshold: 1000000,
    unlocks:
      'SEBI Specialised Investment Fund (MF Regs 2026, eff 1 Apr 2026) - your first professional-grade actively-managed instrument; 10L is the PAN-level aggregate minimum across all SIF strategies of one AMC.',
    instruments: ['SIF long-short', 'SIF multi-asset', 'SIF credit'],
  },
  {
    id: 'prim-25l',
    name: 'PMS/PRIM + AIF-employee',
    threshold: 2500000,
    unlocks:
      'SEBI (Portfolio Managers) Regs 2026 (eff 1 Apr 2027) opens the Rs 25L mutual-fund-only PMS "PRIM" route; the same Rs 25L is the AIF minimum for eligible employees/directors of a portfolio company.',
    instruments: ['PRIM (MF-only PMS)', 'AIF Cat-I (employee/director exception)'],
  },
  {
    id: 'pms-50l',
    name: 'Standard PMS',
    threshold: 5000000,
    unlocks:
      'The general PMS minimum per client (Rs 50L) - a dedicated portfolio run by a SEBI-registered manager at 1-2.5% management + 10-20% performance fees; the 54EC infrastructure-bond rollover cap is also set at 50L.',
    instruments: ['PMS (all strategies)', 'AIF Cat-II', '54EC bond recycling'],
  },
  {
    id: 'aif-1cr',
    name: 'AIF (HNI route)',
    threshold: 10000000,
    unlocks:
      'The standard AIF minimum (Rs 1Cr) - Category I (VC/PE), II (fixed-return debt), III (open-end long-short / leveraged) funds; pass-through taxation and the SEBI 2026 AIF form migration apply.',
    instruments: ['AIF Cat-I (VC/PE)', 'AIF Cat-II (debt)', 'AIF Cat-III (long-short)'],
  },
];

/**
 * Compute the month-by-month corpus trajectory, the first month each rung
 * unlocks, and the surcharge-tier shift between a current and a future
 * income level. Pure and deterministic.
 */
export function capitalLadderFY27(inp: CapitalLadderInput): CapitalLadderResult {
  const corpus0 = Math.max(0, inp.currentCorpus);
  const sip = Math.max(0, inp.monthlySip);
  const rMonthly = inp.annualReturn / 12;
  const addCap = Math.max(0, inp.additionalCapital ?? 0);
  const addMonth = inp.additionalCapitalMonth ?? 0;
  const regime: 'new' | 'old' = inp.regime ?? 'new';
  const horizonMonths = 360;

  let current = corpus0;
  const trajectory: number[] = [current];
  for (let m = 1; m <= horizonMonths; m++) {
    current = current * (1 + rMonthly) + sip;
    if (addCap > 0 && m === addMonth) current += addCap;
    trajectory.push(current);
  }

  const rungs: CapitalLadderRung[] = LADDER_RUNGS.map((def) => {
    const alreadyUnlocked = corpus0 >= def.threshold;
    let months = 0;
    if (!alreadyUnlocked) {
      months = -1;
      for (let m = 1; m <= horizonMonths; m++) {
        if (trajectory[m] >= def.threshold) {
          months = m;
          break;
        }
      }
    }
    return {
      id: def.id,
      name: def.name,
      threshold: def.threshold,
      unlocks: def.unlocks,
      instruments: def.instruments,
      status: alreadyUnlocked ? 'unlocked' : 'locked',
      monthsToUnlock: months,
    };
  });

  const nextLocked = rungs.find((rg) => rg.status === 'locked');
  const nextRungId = nextLocked ? nextLocked.id : null;
  const monthsToNextRung = nextLocked ? nextLocked.monthsToUnlock : -1;
  const yearsToNextRung =
    nextLocked && nextLocked.monthsToUnlock > 0 ? nextLocked.monthsToUnlock / 12 : -1;

  // Surcharge-tier comparison (new-regime base tax + the band surcharge, pre-cess).
  const curIncome = Math.max(0, inp.currentAnnualIncome ?? 0);
  const futIncome = Math.max(0, inp.futureAnnualIncome ?? curIncome);
  const baseNow = newRegimeTaxFY27(curIncome);
  const baseLater = newRegimeTaxFY27(futIncome);
  const scNow = baseNow * surchargeBandRate(curIncome, regime);
  const scLater = baseLater * surchargeBandRate(futIncome, regime);
  const surcharge: CapitalLadderSurcharge = {
    currentTier: ladderTierLabel(curIncome, regime),
    futureTier: ladderTierLabel(futIncome, regime),
    surchargeNow: scNow,
    surchargeLater: scLater,
    increase: scLater - scNow,
  };

  return {
    rungs,
    nextRungId,
    monthsToNextRung,
    yearsToNextRung,
    corpusAtHorizon: trajectory[horizonMonths],
    horizonMonths,
    surcharge,
  };
}

function ladderTierLabel(income: number, regime: 'new' | 'old'): { label: string; rate: number } {
  const rate = surchargeBandRate(income, regime);
  const tier = SURCHARGE_TIER_LABELS.find((t) => Math.abs(t.rate - rate) < 1e-9);
  return tier ? { label: tier.label, rate } : { label: rate === 0 ? 'no surcharge' : 'band', rate };
}

/** Surcharge tiers, new regime (FY 2026-27): 10% > 50L, 15% > 1Cr, 25% > 2Cr. */
const SURCHARGE_TIER_LABELS: Array<{ above: number; rate: number; label: string }> = [
  { above: 5000000, rate: 0.1, label: '10% above Rs 50L' },
  { above: 10000000, rate: 0.15, label: '15% above Rs 1Cr' },
  { above: 20000000, rate: 0.25, label: '25% above Rs 2Cr' },
];

/* ------------------------------------------------------------------ *
 * ESOP / RSU two-stage tax (perquisite at exercise + CG at sale)
 * ------------------------------------------------------------------ */

export interface EsopVestingTaxInput {
  /** Number of shares exercised or vested */
  shares: number;
  /** Exercise price per share in Rs (0 for RSUs) */
  exercisePrice: number;
  /** FMV per share on the exercise/vesting date in Rs */
  fmvAtExercise: number;
  /** Sale price per share in Rs (0 = not yet sold) */
  salePrice: number;
  /** true = listed (STT-paid) equity, false = unlisted/private */
  listed: boolean;
  /** Whole months held from exercise to sale (0 if not yet sold) */
  monthsHeld: number;
  /** Other salary income in the FY, excluding this ESOP perquisite (Rs) */
  otherSalary: number;
  /** Aggregate listed-equity LTCG in the FY from sources other than this ESOP (Rs) */
  otherListedLtcg: number;
  /** true if the employer holds a valid 80-IAC / IMB deferral certificate */
  startupDeferral: boolean;
  /** TDS already deducted on the perquisite this FY (Rs) */
  tdsOnPerquisite: number;
}

export interface EsopVestingTaxResult {
  /** Perquisite = (FMV - exercise price) x shares */
  perquisite: number;
  /** Incremental slab tax caused by adding the perquisite to other salary */
  perquisiteIncrementalTax: number;
  /** Whether the capital gain (if any) qualifies as long-term */
  isLtcg: boolean;
  /** CG head label: '112A' | '111A' | 'sec112' | 'slab-unlisted' | 'none' */
  cgHead: string;
  /** Gross capital gain = (sale price - FMV) x shares (0 if not sold) */
  capitalGain: number;
  /** 112A pool amount consumed by this gain (Rs, 0 if not 112A) */
  poolConsumed: number;
  /** Capital gain after pool subtraction (Rs) */
  taxableCg: number;
  /** CG tax before surcharge + cess (Rs) */
  cgTax: number;
  /** Perquisite tax with 4% cess (Rs) */
  perqTaxWithCess: number;
  /** CG tax with 4% cess (Rs) */
  cgTaxWithCess: number;
  /** Combined two-stage tax incl. cess and surcharge (Rs) */
  totalTwoStageTax: number;
  /** Surcharge on total income (Rs, pre-cess) */
  surcharge: number;
  /** Net tax after TDS already paid (Rs) */
  netTaxAfterTds: number;
  /** Whether 80-IAC deferral applies to the perquisite TDS */
  deferralApplies: boolean;
  /** Human-readable deferral note */
  deferralNote: string;
  /** Total gross gain from exercise price to sale (Rs) */
  totalGrossGain: number;
  /** Effective combined tax rate = totalTwoStageTax / totalGrossGain */
  effectiveTaxRate: number;
}

/**
 * Two-stage ESOP/RSU tax for FY 2026-27.
 *
 * Stage 1 (perquisite): (FMV at exercise - exercise price) x shares,
 *   taxed at the new-regime slab on (otherSalary + perquisite).
 *   The incremental tax is the difference between the slab on the
 *   combined income and the slab on other salary alone.
 *
 * Stage 2 (capital gain): (sale price - FMV at exercise) x shares.
 *   - Listed > 12 mo  -> 112A: 12.5% on the amount above the 1.25L
 *     aggregate pool (pool is shared with otherListedLtcg).
 *   - Listed <= 12 mo -> 111A: 20% flat STCG on listed equity (STT-paid).
 *   - Unlisted > 24 mo -> Sec 112: 12.5% no indexation, no pool.
 *   - Unlisted <= 24 mo -> slab: marginal rate at the combined-income level.
 *
 * Cess: 4% on (perquisite tax + CG tax). Surcharge on total income
 * (salary + perquisite + taxable CG) using FY 2026-27 new-regime bands.
 *
 * 80-IAC deferral: if `startupDeferral` is true, perquisite TDS is
 * deferred to the earliest of 60 months from end of allotment AY,
 * sale date, or cessation of employment. Tax amount unchanged.
 */
export function esopVestingTaxFY27(inp: EsopVestingTaxInput): EsopVestingTaxResult {
  const shares = Math.max(0, Math.floor(inp.shares));
  const exPrice = Math.max(0, inp.exercisePrice);
  const fmv = Math.max(0, inp.fmvAtExercise);
  const saleP = Math.max(0, inp.salePrice);
  const listed = inp.listed;
  const months = Math.max(0, Math.floor(inp.monthsHeld));
  const otherSal = Math.max(0, inp.otherSalary);
  const otherLtcg = Math.max(0, inp.otherListedLtcg);
  const deferred = inp.startupDeferral;
  const tdsP = Math.max(0, inp.tdsOnPerquisite);

  // Stage 1: perquisite
  const perqPerShare = Math.max(0, fmv - exPrice);
  const perquisite = perqPerShare * shares;

  const salBefore = newRegimeTaxFY27(otherSal);
  const salAfter = newRegimeTaxFY27(otherSal + perquisite);
  const perqIncTax = Math.max(0, salAfter - salBefore);

  // Stage 2: capital gain
  const hasSale = saleP > 0;
  const cgPerShare = hasSale ? Math.max(0, saleP - fmv) : 0;
  const capitalGain = cgPerShare * shares;

  let isLtcg: boolean;
  let cgHead: string;
  let poolConsumed = 0;
  let taxableCg = 0;
  let cgTax = 0;

  if (hasSale && capitalGain > 0) {
    if (listed) {
      isLtcg = months > 12;
      if (isLtcg) {
        cgHead = '112A';
        const poolAvailable = Math.max(0, 125000 - otherLtcg);
        poolConsumed = Math.min(poolAvailable, capitalGain);
        taxableCg = capitalGain - poolConsumed;
        cgTax = taxableCg * 0.125;
      } else {
        cgHead = '111A';
        taxableCg = capitalGain;
        cgTax = capitalGain * 0.20;
      }
    } else {
      isLtcg = months > 24;
      if (isLtcg) {
        cgHead = 'sec112';
        taxableCg = capitalGain;
        cgTax = capitalGain * 0.125;
      } else {
        cgHead = 'slab-unlisted';
        taxableCg = capitalGain;
        const slabWithCg = newRegimeTaxFY27(otherSal + perquisite + capitalGain);
        const slabWithoutCg = newRegimeTaxFY27(otherSal + perquisite);
        cgTax = Math.max(0, slabWithCg - slabWithoutCg);
      }
    }
  } else {
    isLtcg = false;
    cgHead = hasSale
      ? (listed ? (months > 12 ? '112A' : '111A') : (months > 24 ? 'sec112' : 'slab-unlisted'))
      : 'none';
  }

  // Cess (4%) on perquisite tax + CG tax
  const perqTaxWithCess = perqIncTax * 1.04;
  const cgTaxWithCess = cgTax * 1.04;

  // Surcharge on total income (salary + perquisite + taxable CG)
  const totalIncome = otherSal + perquisite + taxableCg;
  let surcharge = 0;
  if (totalIncome > 5000000) {
    if (totalIncome <= 10000000) surcharge = (perqIncTax + cgTax) * 0.10;
    else if (totalIncome <= 20000000) surcharge = (perqIncTax + cgTax) * 0.15;
    else surcharge = (perqIncTax + cgTax) * 0.25;
  }
  const totalSurchargeWithCess = surcharge * 1.04;

  // Totals
  const totalTwoStageTax = perqTaxWithCess + cgTaxWithCess + totalSurchargeWithCess;
  const totalGrossGain = hasSale
    ? Math.max(0, saleP - exPrice) * shares
    : perquisite;
  const effectiveTaxRate = totalGrossGain > 0 ? totalTwoStageTax / totalGrossGain : 0;
  const netTaxAfterTds = Math.max(0, totalTwoStageTax - tdsP);

  let deferralNote = '';
  if (deferred) {
    deferralNote =
      '80-IAC deferral active: perquisite TDS deferred to the earliest of ' +
      '60 months from the end of the allotment AY, the sale date, or ' +
      'cessation of employment. Tax is computed at allotment-year rates.';
  }

  return {
    perquisite,
    perquisiteIncrementalTax: perqIncTax,
    isLtcg,
    cgHead,
    capitalGain,
    poolConsumed,
    taxableCg,
    cgTax,
    perqTaxWithCess,
    cgTaxWithCess,
    totalTwoStageTax,
    surcharge,
    netTaxAfterTds,
    deferralApplies: deferred,
    deferralNote,
    totalGrossGain,
    effectiveTaxRate,
  };
}

/* ------------------------------------------------------------------
 * Direct LRS US-equity filing walkthrough (the "direct route" layer that
 * the GIFT City route-comparison calculator points to)
 *
 * For a resident Indian who owns US equities directly through a US
 * brokerage (under LRS), this models the FY 2026-27 filing mechanics:
 *
 *  - Dividends: US-source, taxed in India at the slab rate. The US
 *    withholds 25% (with a Form W-8BEN on file; the 15% figure is the
 *    corporate-with-voting-stock treaty rate, NOT the individual rate) or
 *    30% (backup, no W-8BEN). The US withholding is credited in India via
 *    Form 67, capped at the lesser of the India tax on the dividend and
 *    the US tax actually paid.
 *  - Capital gains: US shares are UNLISTED foreign securities. LTCG
 *    (>24 months) is 12.5% without indexation and with NO Rs 1.25L pool
 *    (the 112A pool is Indian-listed-equity only); STCG (<=24 months) is
 *    at the slab rate.
 *  - TCS: the LRS investment remittance that funded the purchase attracts
 *    20% TCS above the Rs 10L aggregate threshold - a recoverable credit,
 *    not a cost.
 *  - Schedule FA: a specified foreign financial asset with NO minimum
 *    threshold, disclosed every year while held.
 *  - FAST-DS 2026: a one-time "small taxpayer" disclosure window
 *    (Finance Act 2026, Ch. IV, ~15 Aug to 31 Dec 2026) for undisclosed
 *    foreign assets - the amnesty layer, flagged for completeness.
 *
 * All math is pure and deterministic; conventions are documented.
 * ------------------------------------------------------------------ */

export interface DirectLrsUsEquityInput {
  /** The gross US dividend received this FY, in rupees. */
  dividendRupees: number;
  /** The US dividend withholding rate actually applied: 0.25 (with a
   *  Form W-8BEN on file) or 0.30 (backup, no W-8BEN). */
  usWithholdingRate: number;
  /** Override the US withholding actually paid (rupees). When 0/undefined
   *  it is derived as dividend x usWithholdingRate. */
  usWithholdingPaid?: number;
  /** The gross realized capital gain this FY, in rupees. */
  capitalGainRupees: number;
  /** Whole months held on the lot that generated the gain; >= 24 makes it
   *  long-term (12.5% no-pool), otherwise short-term (slab). */
  monthsHeld: number;
  /** The marginal slab rate for the dividend + STCG (e.g. 0.30). */
  slabRate?: number;
  /** The LRS investment remittance this FY that funded the purchase (Rs). */
  lrsRemittance: number;
  /** Other LRS remittances this FY before this one (Rs). */
  priorLrsRemittance?: number;
  /** The Rs 10L TCS-free threshold on aggregate LRS outflow. */
  tcsThreshold?: number;
  /** The LRS investment-remittance TCS rate (20%). */
  tcsRate?: number;
}

export interface DirectLrsUsEquityResult {
  dividendRupees: number;
  usWithholdingPaid: number;
  /** The India slab tax on the dividend (before the FTC). */
  dividendSlabTax: number;
  /** The Form 67 foreign-tax-credit: the lesser of the India dividend tax
   *  and the US withholding actually paid. */
  foreignTaxCredit: number;
  /** The net dividend tax after the credit. */
  netDividendTax: number;
  /** The CG head + rate for this lot. */
  cgHead: 'ltcg' | 'stcg';
  cgRate: number;
  capitalGainRupees: number;
  cgTax: number;
  /** True when the lot is LTCG - which carries NO Rs 1.25L pool on a
   *  foreign (unlisted) security. */
  noLtcgPool: boolean;
  /** The TCS on the LRS investment remittance above the threshold - a
   *  recoverable credit, not a permanent cost. */
  tcsable: number;
  tcs: number;
  /** Schedule FA is mandatory for a US brokerage position, with no minimum
   *  threshold. */
  scheduleFaRequired: boolean;
  /** The total Indian tax on the foreign income, after the credit. */
  totalBurden: number;
  /** A note flagging the FAST-DS 2026 small-taxpayer disclosure window as
   *  the amnesty layer for *undisclosed* foreign assets (distinct from a
   *  normally-reported US brokerage position). */
  fastDsNote: string;
}

export function directLrsUsEquityFilingFY27(inp: DirectLrsUsEquityInput): DirectLrsUsEquityResult {
  const dividend = Math.max(0, inp.dividendRupees);
  const whRate = Math.min(1, Math.max(0, inp.usWithholdingRate));
  const usWithholdingPaid =
    inp.usWithholdingPaid && inp.usWithholdingPaid > 0
      ? inp.usWithholdingPaid
      : dividend * whRate;
  const slabRate = inp.slabRate ?? 0.3;

  const dividendSlabTax = dividend * slabRate;
  // Form 67 FTC cap: the lesser of the India tax on the dividend and the
  // US withholding actually paid on it.
  const foreignTaxCredit = Math.min(dividendSlabTax, usWithholdingPaid);
  const netDividendTax = Math.max(0, dividendSlabTax - foreignTaxCredit);

  const isLtcg = inp.monthsHeld >= 24;
  const cgHead: DirectLrsUsEquityResult['cgHead'] = isLtcg ? 'ltcg' : 'stcg';
  const cgRate = isLtcg ? 0.125 : slabRate;
  const capitalGain = Math.max(0, inp.capitalGainRupees);
  const cgTax = capitalGain * cgRate;

  // The TCS reservation on the LRS investment remittance (recoverable credit).
  const threshold = inp.tcsThreshold ?? 1000000;
  const tcsRate = inp.tcsRate ?? 0.2;
  const aggregateLrs = Math.max(0, inp.priorLrsRemittance ?? 0) + Math.max(0, inp.lrsRemittance);
  const tcsable = Math.max(0, aggregateLrs - threshold);
  const tcs = tcsable * tcsRate;

  const totalBurden = netDividendTax + cgTax;

  return {
    dividendRupees: dividend,
    usWithholdingPaid,
    dividendSlabTax,
    foreignTaxCredit,
    netDividendTax,
    cgHead,
    cgRate,
    capitalGainRupees: capitalGain,
    cgTax,
    noLtcgPool: isLtcg,
    tcsable,
    tcs,
    scheduleFaRequired: true,
    totalBurden,
    fastDsNote:
      'FAST-DS 2026 (Foreign Assets of Small Taxpayers, Finance Act 2026 Ch. IV, ~15 Aug to 31 Dec 2026) is the amnesty layer for UNDISCLOSED foreign assets (a Rs 1 cr specified-tax/fee category and a Rs 5 cr flat-Rs 1L-fee category); a normally-reported US brokerage position does NOT need FAST-DS - it is Schedule FA, every year.',
  };
}

/* ------------------------------------------------------------------
 * FAST-DS 2026 declaration (the small-taxpayer foreign-asset amnesty
 * that Wave 24 flagged as the separate layer)
 *
 * The Foreign Assets of Small Taxpayers - Disclosure Scheme, 2026
 * (Finance Act 2026, Chapter IV, sections 130-144; Rules notified
 * 15 Aug 2026; window 16 Aug - 31 Dec 2026; reference date
 * 31 March 2026) has two categories:
 *
 *   - Category A - undisclosed foreign assets / income up to Rs 1 cr:
 *     a 30% tax PLUS an equal additional amount, i.e. 60% of the
 *     disclosed value.
 *   - Category B - specified foreign assets up to Rs 5 cr that were
 *     already taxed elsewhere (or acquired during non-residence) but
 *     were simply omitted from Schedule FA: a FLAT Rs 1,00,000 fee.
 *
 * Above the category ceiling (Rs 1 cr / Rs 5 cr) the taxpayer is NOT
 * eligible for that category. All math is pure and deterministic.
 * ------------------------------------------------------------------ */

export interface FastDSDisclosureInput {
  /** The value of the disclosed foreign asset / income as of the
   *  31 March 2026 reference date (Rs). */
  disclosedValue: number;
  /** 'undisclosed' = Category A (30% + equal additional, i.e. 60%);
   *  'missed-schedule-fa' = Category B (flat Rs 1L fee, the asset was
   *  already taxed / acquired during non-residence but omitted from
   *  Schedule FA). */
  category: 'undisclosed' | 'missed-schedule-fa';
  /** The Category A ceiling (Rs 1 cr). */
  categoryACeiling?: number;
  /** The Category B ceiling (Rs 5 cr). */
  categoryBCeiling?: number;
  /** The Category A tax rate (30%) and its equal additional amount
   *  (another 30% -> 60% total). */
  categoryATaxRate?: number;
  /** The Category B flat fee (Rs 1,00,000). */
  categoryBFlatFee?: number;
}

export interface FastDSDisclosureResult {
  disclosedValue: number;
  category: FastDSDisclosureInput['category'];
  eligible: boolean;
  /** The applicable ceiling for the chosen category. */
  ceiling: number;
  /** The tax / fee payable. */
  payable: number;
  /** Category A: the 30% tax and its equal additional amount, split out. */
  taxPortion: number;
  additionalAmountPortion: number;
  /** The total cost as a fraction of the disclosed value. */
  effectiveCostPct: number;
  /** What you get: immunity from further tax, penalty and Black Money
   *  Act prosecution for the declared asset/income. */
  immunity: string;
  /** A reminder that this is a one-time window (16 Aug - 31 Dec 2026)
   *  and does NOT replace the ongoing Schedule FA obligation. */
  oneTimeWindowNote: string;
  note: string;
}

/* ------------------------------------------------------------------
 * Black Money Act (2015) counterfactual exposure - the "what if you
 * miss FAST-DS and Schedule FA" layer that the FAST-DS article points
 * to
 *
 * The Black Money (Undisclosed Foreign Income and Assets) and
 * Imposition of Tax Act, 2015 (the "Black Money Act") is the
 * enforcement framework that FAST-DS 2026 is a one-time way out of.
 * For an undisclosed foreign asset / income that is NOT regularised
 * (no FAST-DS declaration, no Schedule FA), the counterfactual
 * exposure is:
 *
 *   - Section 40 - a 30% tax on the undisclosed foreign income/asset.
 *   - Section 41 - a penalty of THREE times the tax payable, i.e.
 *     90% of the value; so tax + penalty = 120% of the undisclosed
 *     value.
 *   - Section 43/44 - a flat Rs 1,00,000 penalty per assessment year
 *     for failing to disclose the foreign asset in Schedule FA (or
 *     furnishing inaccurate particulars); since the Finance Act 2026,
 *     this flat penalty does NOT apply where the aggregate value of
 *     NON-IMMOVABLE foreign assets stays within Rs 20 lakh.
 *
 * The whole reason FAST-DS exists is that this counterfactual is
 * 120% + a recurring flat penalty, while FAST-DS Category A costs
 * only 60% (and Category B a flat Rs 1L). All math is pure and
 * deterministic; conventions are documented.
 * ------------------------------------------------------------------ */

export interface BlackMoneyActInput {
  /** The undisclosed foreign asset / income value, in rupees. */
  undisclosedValue: number;
  /** The BMA Section 40 tax rate on the undisclosed value (30%). */
  bmaTaxRate?: number;
  /** The BMA Section 41 penalty as a multiple of the tax (3x), i.e.
   *  90% of the value. */
  bmaPenaltyMultiple?: number;
  /** The flat per-year Schedule FA non-disclosure penalty (Rs 10L). */
  flatPenaltyPerYear?: number;
  /** Whole assessment years the Schedule FA non-disclosure persisted
   *  for (the flat penalty is per defaulting year). */
  nonDisclosureYears?: number;
  /** The Finance Act 2026 threshold below which the flat Rs 10L
   *  Schedule FA penalty does NOT apply (Rs 20L, non-immovable only). */
  flatPenaltyThreshold?: number;
  /** True when the undisclosed value is a NON-IMMOVABLE asset (the
   *  FA-2026 flat-penalty exception only covers non-immovable assets). */
  nonImmovable?: boolean;
}

export interface BlackMoneyActResult {
  undisclosedValue: number;
  /** The Section 40 tax on the undisclosed value. */
  bmaTax: number;
  /** The Section 41 penalty (a multiple of the tax). */
  bmaPenalty: number;
  /** The combined tax + penalty on the undisclosed value. */
  totalBmaCharge: number;
  /** The effective % of the undisclosed value (tax + penalty). */
  effectivePctOfValue: number;
  /** Whether the flat Rs 10L Schedule FA penalty applies (it does NOT
   *  when the asset is non-immovable AND at/below the FA-2026
   *  threshold). */
  flatPenaltyApplies: boolean;
  /** The flat per-year penalty, 0 when the exception applies. */
  flatPenaltyPerYearAmount: number;
  /** The accumulated flat penalty over the non-disclosure years. */
  totalFlatPenalty: number;
  /** The full counterfactual exposure: BMA tax + BMA penalty + the
   *  accumulated flat penalty. */
  totalCounterfactualExposure: number;
  /** The FAST-DS Category A cost for the same value (the 60% route) -
   *  included so a planner can see the "defined cost vs open-ended
   *  exposure" gap that is the whole point of the amnesty. */
  fastDsCategoryACost: number;
  /** The saving of a FAST-DS Category A declaration over the BMA
   *  counterfactual (positive = FAST-DS is cheaper). */
  fastDsCategoryASaving: number;
  note: string;
}

export function blackMoneyActExposure(inp: BlackMoneyActInput): BlackMoneyActResult {
  const value = Math.max(0, inp.undisclosedValue);
  const bmaTaxRate = inp.bmaTaxRate ?? 0.3;
  const bmaPenaltyMultiple = inp.bmaPenaltyMultiple ?? 3;
  const flatPenaltyPerYear = inp.flatPenaltyPerYear ?? 1000000;
  const nonDisclosureYears = inp.nonDisclosureYears ?? 1;
  const flatPenaltyThreshold = inp.flatPenaltyThreshold ?? 2000000;

  const bmaTax = value * bmaTaxRate;
  // Section 41: a penalty of THREE times the tax (= 90% of value).
  const bmaPenalty = bmaTax * bmaPenaltyMultiple;
  const totalBmaCharge = bmaTax + bmaPenalty;
  const effectivePctOfValue = value > 0 ? totalBmaCharge / value : 0;

  // The Finance Act 2026 exception: the flat Rs 10L Schedule FA penalty
  // does not apply where the aggregate value of NON-IMMOVABLE foreign
  // assets is at or under the Rs 20L threshold.
  const flatPenaltyApplies =
    !(inp.nonImmovable ?? true) || value > flatPenaltyThreshold;
  const flatPenaltyPerYearAmount = flatPenaltyApplies ? flatPenaltyPerYear : 0;
  const totalFlatPenalty = flatPenaltyPerYearAmount * Math.max(0, nonDisclosureYears);

  const totalCounterfactualExposure = totalBmaCharge + totalFlatPenalty;

  // The FAST-DS Category A cost for the same value (60% of value) - the
  // "defined cost" the amnesty replaces with the open-ended exposure.
  const fastDsCategoryACost = value * (bmaTaxRate + bmaTaxRate);
  const fastDsCategoryASaving = totalCounterfactualExposure - fastDsCategoryACost;

  let note = '';
  if (flatPenaltyApplies) {
    note =
      'The full counterfactual exposure is the BMA tax + penalty (' +
      Math.round(effectivePctOfValue * 100) +
      '% of the undisclosed value) PLUS the flat Rs 10L per non-disclosure year. A FAST-DS 2026 Category A declaration would have cost only 60% of the value - the ' +
      Math.max(0, Math.round(fastDsCategoryASaving)).toLocaleString('en-IN') +
      'Rs gap is exactly why the one-time amnesty exists.';
  } else {
    note =
      'Because the undisclosed value is a non-immovable asset at or under the Rs 20L Finance-Act-2026 threshold, the flat Rs 10L Schedule FA penalty does NOT apply; the exposure is the BMA tax + 90% penalty only (120% of value), still far above the 60% FAST-DS Category A cost.';
  }

  return {
    undisclosedValue: value,
    bmaTax,
    bmaPenalty,
    totalBmaCharge,
    effectivePctOfValue,
    flatPenaltyApplies,
    flatPenaltyPerYearAmount,
    totalFlatPenalty,
    totalCounterfactualExposure,
    fastDsCategoryACost,
    fastDsCategoryASaving,
    note,
  };
}

/* ------------------------------------------------------------------
 * FAST-DS 2026 valuation guard (the "did I value it right?" layer
 * that both the FAST-DS and the Black Money Act articles point to)
 *
 * The Foreign Assets of Small Taxpayers - Disclosure Scheme Rules,
 * 2026 (G.S.R. 732(E), 14 Aug 2026; in force 16 Aug 2026; last date
 * 31 Dec 2026) fix the valuation date at 31 March 2026 and prescribe
 * per-asset-class valuation (Rule 3) + RBI-reference-rate currency
 * conversion (Rule 3(4)/(5)). The practical "gotcha" is the
 * 20% valuation-variance safeguard in Rule 5(2): if the FMV you
 * declared in Form 1 differs from the FMV the authority later
 * determines, the declaration is NOT invalid *only* while the
 * variance is within 20% of the declared FMV; above that, the value
 * is re-computed on the (higher) determined FMV and the payable
 * rises with it. Track A = 60% of value (30% + 100% additional);
 * Track B = a flat Rs 1L fee within the Rs 5 cr ceiling.
 *
 * All math is pure and deterministic; the late-payment interest is
 * 1% per month (or part) on the payable (Rule 7).
 * ------------------------------------------------------------------ */

export interface FastDSValuationInput {
  /** The FMV you declared in Form 1, as of the 31 Mar 2026 valuation
   *  date (Rs). */
  declaredFmv: number;
  /** The FMV the authority would determine on assessment / inquiry
   *  (Rs) - the "true" value the 20% safeguard is tested against. */
  determinedFmv: number;
  /** 'A' = undisclosed (30% + 100% additional = 60% of value);
   *  'B' = a missed-Schedule-FA asset (flat Rs 1L fee, within the
   *  Rs 5 cr ceiling). */
  track: 'A' | 'B';
  /** The Track A ceiling (Rs 1 cr) - the aggregate must be at or under
   *  it for Track A to be available. */
  trackACeiling?: number;
  /** The Track B ceiling (Rs 5 cr). */
  trackBCeiling?: number;
  /** The Track A tax rate (30%); the additional amount is equal to it. */
  trackATaxRate?: number;
  /** The Track B flat fee (Rs 1,00,000). */
  trackBFlatFee?: number;
  /** Whole months (or part) the Form 3 payment is delayed past the
   *  initial two-month window; 1% interest per month applies. */
  latePaymentMonths?: number;
}

export interface FastDSValuationResult {
  declaredFmv: number;
  determinedFmv: number;
  track: FastDSValuationInput['track'];
  /** The 20% valuation-variance, measured against the DECLARED FMV
   *  (Rule 5(2)). */
  variancePct: number;
  /** True when the variance is within 20% of the declared FMV - the
   *  declaration stands on the declared value. */
  valuationSafeguardHolds: boolean;
  /** The value the payable is computed on: the declared FMV when the
   *  safeguard holds, otherwise the (higher) determined FMV. */
  chargeBaseValue: number;
  /** The declared-valuation payable (60% of the declared value for A,
   *  the flat fee for B). */
  payableIfDeclared: number;
  /** The re-valued payable if the safeguard does NOT hold (60% of the
   *  determined value for A; the flat fee still applies for B within
   *  the ceiling). */
  payableIfRevalued: number;
  /** The payable that actually applies (re-valued when the safeguard
   *  fails). */
  payableFinal: number;
  /** True when the DETERMINED value is within the track ceiling - a
   *  Track B asset re-valued above Rs 5 cr loses the flat fee. */
  eligibleAtDetermined: boolean;
  /** The 1%-per-month late-payment interest on the payable. */
  latePaymentInterest: number;
  /** The full outflow: the applicable payable + the late interest. */
  totalOutflow: number;
  note: string;
}

export function fastDSValuationGuard(inp: FastDSValuationInput): FastDSValuationResult {
  const declared = Math.max(0, inp.declaredFmv);
  const determined = Math.max(0, inp.determinedFmv);
  const track = inp.track;
  const ceilingA = inp.trackACeiling ?? 10000000;
  const ceilingB = inp.trackBCeiling ?? 50000000;
  const taxRateA = inp.trackATaxRate ?? 0.3;
  const flatFeeB = inp.trackBFlatFee ?? 100000;
  const lateMonths = inp.latePaymentMonths ?? 0;

  // Rule 5(2): the variance is measured against the DECLARED FMV; the
  // declaration stands while it is within 20%.
  const variancePct = declared > 0 ? Math.abs(determined - declared) / declared : 0;
  const valuationSafeguardHolds = variancePct <= 0.2;

  // The value the charge is computed on, and whether the (re-valued)
  // asset still sits within the track ceiling.
  const chargeBaseValue = valuationSafeguardHolds ? declared : determined;
  const eligibleAtDetermined =
    track === 'A' ? determined <= ceilingA : determined <= ceilingB;

  const payableIfDeclared =
    track === 'A' ? declared * (taxRateA + taxRateA) : flatFeeB;
  const payableIfRevalued =
    track === 'A' ? determined * (taxRateA + taxRateA) : flatFeeB;
  const payableFinal = valuationSafeguardHolds ? payableIfDeclared : payableIfRevalued;

  const latePaymentInterest = payableFinal * 0.01 * Math.max(0, lateMonths);
  const totalOutflow = payableFinal + latePaymentInterest;

  let note = '';
  if (!eligibleAtDetermined) {
    note =
      'The DETERMINED value of Rs ' +
      determined.toLocaleString('en-IN') +
      ' exceeds the ' +
      (track === 'A' ? 'Rs 1 cr Track A' : 'Rs 5 cr Track B') +
      ' ceiling - the 60% / flat-fee route is not available at the re-valued amount; this asset is outside the FAST-DS scheme for this track.';
  } else if (!valuationSafeguardHolds) {
    note =
      'The valuation variance of ' +
      (variancePct * 100).toFixed(1) +
      '% of the declared FMV exceeds the 20% Rule-5(2) safeguard, so the charge is re-computed on the higher determined FMV - under-value the declaration and the payable rises with it.';
  } else {
    note =
      'The valuation variance of ' +
      (variancePct * 100).toFixed(1) +
      '% of the declared FMV is within the 20% Rule-5(2) safeguard, so the declaration stands on the declared value and the payable is ' +
      (track === 'A' ? '60% of it' : 'the flat Rs 1L fee');
  }

  return {
    declaredFmv: declared,
    determinedFmv: determined,
    track,
    variancePct,
    valuationSafeguardHolds,
    chargeBaseValue,
    payableIfDeclared,
    payableIfRevalued,
    payableFinal,
    eligibleAtDetermined,
    latePaymentInterest,
    totalOutflow,
    note,
  };
}

export function fastDSDisclosureFY26(inp: FastDSDisclosureInput): FastDSDisclosureResult {
  const value = Math.max(0, inp.disclosedValue);
  const category = inp.category;
  const ceilingA = inp.categoryACeiling ?? 10000000;
  const ceilingB = inp.categoryBCeiling ?? 50000000;
  const taxRateA = inp.categoryATaxRate ?? 0.3;
  const flatFeeB = inp.categoryBFlatFee ?? 100000;

  let eligible: boolean;
  let ceiling: number;
  let payable: number;
  let taxPortion: number;
  let additionalAmountPortion: number;

  if (category === 'undisclosed') {
    ceiling = ceilingA;
    eligible = value > 0 && value <= ceilingA;
    taxPortion = eligible ? value * taxRateA : 0;
    additionalAmountPortion = eligible ? value * taxRateA : 0;
    payable = taxPortion + additionalAmountPortion;
  } else {
    ceiling = ceilingB;
    eligible = value > 0 && value <= ceilingB;
    taxPortion = 0;
    additionalAmountPortion = 0;
    payable = eligible ? flatFeeB : 0;
  }

  const effectiveCostPct = value > 0 ? payable / value : 0;

  let note = '';
  if (!eligible && value > 0) {
    note =
      'Not eligible for the ' +
      category +
      ' category: the disclosed value of Rs ' +
      value.toLocaleString('en-IN') +
      ' exceeds the Rs ' +
      ceiling.toLocaleString('en-IN') +
      ' ceiling. Above the ceiling the scheme cannot be used for this asset.';
  } else if (category === 'undisclosed') {
    note =
      'Category A pays 30% tax plus an equal additional amount - a total of 60% of the disclosed value - for immunity from further tax, penalty and Black Money Act prosecution.';
  } else {
    note =
      'Category B pays a flat Rs 1,00,000 fee (not a percentage of value) for an asset that was already taxed elsewhere or acquired during non-residence but omitted from Schedule FA.';
  }

  return {
    disclosedValue: value,
    category,
    eligible,
    ceiling,
    payable,
    taxPortion,
    additionalAmountPortion,
    effectiveCostPct,
    immunity:
      'Immunity from further tax, penalty and prosecution under the Black Money Act, 2015, for the specific asset / income declared.',
    oneTimeWindowNote:
      'One-time window: 16 Aug to 31 Dec 2026 (reference date 31 Mar 2026). This does NOT replace the ongoing Schedule FA obligation for future years.',
    note,
  };
}

/* ------------------------------------------------------------------
 * FEMA Section 13 exchange-control exposure - the "side FAST-DS does
 * NOT settle" layer
 *
 * A cross-border position regularised on the tax / Black Money Act side
 * (FAST-DS 2026, or Schedule FA) still carries a SEPARATE exposure
 * under the Foreign Exchange Management Act, 1999 (FEMA), administered
 * by the RBI - not the income-tax department. The counterfactual the
 * tax-only articles do not price is:
 *
 *   - FEMA Section 13(1) - a penalty of up to THREE times the sum
 *     involved in the contravention (the "up to 3x" figure is the
 *     current FEMA cap; the older "9x" was the FERA-era number).
 *   - Section 15 - compounding (voluntary settlement) of a
 *     compoundable contravention, by paying a fee to the RBI (up to a
 *     Rs 5 cr contravention) over a PRAVAAH filing; a Section 3(a)
 *     hawala offence is NOT compoundable. A 2025 amendment caps the
 *     fee for certain compounding at Rs 2,00,000.
 *   - The "sum involved" is the FEMA-breaching remittance: a resident
 *     LRS remittance that exceeded a limit, an NRO repatriation above
 *     the USD 1M/FY window, or an ODI above the individual limit.
 *
 * The whole reason this layer exists: settling the tax / BMA side via
 * FAST-DS does NOT close the FEMA side - the two are independent
 * regulators and independent exposures. All math is pure and
 * deterministic; conventions are documented.
 * ------------------------------------------------------------------ */

export interface FemaSection13Input {
  /** The sum involved in the FEMA contravention (Rs) - e.g. an LRS
   *  remittance that exceeded a limit, an NRO repatriation above the
   *  USD 1M window, or an ODI above the individual limit. */
  contraventionSum: number;
  /** The Section 13(1) penalty as a multiple of the sum (3x the cap). */
  penaltyMultiple?: number;
  /** The statutory floor on the penalty (Rs); 0 = none modelled. */
  penaltyFloor?: number;
  /** The 2025-amendment cap on the fee for certain compounded
   *  contraventions (Rs 2,00,000). */
  compoundingFeeCap?: number;
  /** The fee paid (or to be paid) to compound the contravention under
   *  Section 15. 0 / undefined = not compounded, the full Section 13
   *  penalty applies. */
  compoundingFee?: number;
  /** True when the contravention is compoundable (a Section 3(a) hawala
   *  offence is NOT). */
  compoundable?: boolean;
  /** True when the tax / BMA side has already been regularised (via
   *  FAST-DS or a normal assessment) - the case where the FEMA side is
   *  the *separate* open exposure. */
  fastDsSettled?: boolean;
}

export interface FemaSection13Result {
  contraventionSum: number;
  /** The Section 13(1) penalty: max(floor, sum x multiple). */
  section13Penalty: number;
  /** The Section 15 compounding fee, capped at the 2025 fee cap. */
  compoundedCost: number;
  /** True when Section 15 compounding is available for this
   *  contravention (compoundable AND a fee is provided). */
  canCompound: boolean;
  /** The FEMA cost that actually applies: the compounded fee when
   *  compounding is available, otherwise the full Section 13 penalty. */
  applicableFemaCost: number;
  /** True when the tax/BMA side is settled but the FEMA side remains
   *  open - the point this layer exists to make explicit. */
  femaOpenAfterTaxSettled: boolean;
  note: string;
}

export function femaSection13Exposure(inp: FemaSection13Input): FemaSection13Result {
  const sum = Math.max(0, inp.contraventionSum);
  const penaltyMultiple = inp.penaltyMultiple ?? 3;
  const penaltyFloor = inp.penaltyFloor ?? 0;
  const compoundingFeeCap = inp.compoundingFeeCap ?? 200000;

  // The Section 13(1) penalty: up to 3x the sum involved, floored.
  const section13Penalty = Math.max(penaltyFloor, sum * penaltyMultiple);

  // The Section 15 compounding fee (voluntary settlement), capped.
  const feeProvided = inp.compoundingFee ?? 0;
  const canCompound = (inp.compoundable ?? true) && feeProvided > 0;
  const compoundedCost = canCompound
    ? Math.min(feeProvided, compoundingFeeCap)
    : 0;

  // The FEMA cost that actually applies: the compounded fee when
  // available, otherwise the full Section 13 penalty.
  const applicableFemaCost = canCompound ? compoundedCost : section13Penalty;

  // The tax/BMA side and the FEMA side are independent; settling the
  // tax side (FAST-DS / Schedule FA) does NOT close the FEMA exposure.
  const femaOpenAfterTaxSettled = inp.fastDsSettled ?? false;

  let note = '';
  if (femaOpenAfterTaxSettled) {
    note =
      'The tax / Black Money Act side is settled, but the FEMA exposure is a SEPARATE, RBI-administered liability that FAST-DS does NOT regularise: ' +
      (canCompound
        ? 'compound it under Section 15 for a capped fee of Rs ' +
          compoundedCost.toLocaleString('en-IN') +
          ' (vs a full Section 13 penalty of Rs ' +
          section13Penalty.toLocaleString('en-IN') +
          ').'
        : 'the full Section 13(1) penalty of up to ' +
          penaltyMultiple +
          'x the sum involved applies (Rs ' +
          section13Penalty.toLocaleString('en-IN') +
          '); a Section 3(a) hawala offence is not compoundable at all.');
  } else {
    note =
      'FEMA Section 13(1) exposure of up to ' +
      penaltyMultiple +
      'x the contravention sum (Rs ' +
      section13Penalty.toLocaleString('en-IN') +
      '); compound under Section 15 (Rs ' +
      compoundedCost.toLocaleString('en-IN') +
      ') where the contravention is compoundable and not a Section 3(a) hawala offence.';
  }

  return {
    contraventionSum: sum,
    section13Penalty,
    compoundedCost,
    canCompound,
    applicableFemaCost,
    femaOpenAfterTaxSettled,
    note,
  };
}

