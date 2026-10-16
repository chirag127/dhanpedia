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
