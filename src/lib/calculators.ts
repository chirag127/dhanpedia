/**
 * Calculator catalogue. Client-safe module: no Node APIs, only pure math from
 * the finance lib. Each calculator declares its inputs and a compute() that
 * returns formatted results and (optionally) a chart option for ECharts.
 *
 * Conventions (documented on each calculator page):
 *  - SIP/FV formulas assume end-of-period contributions and constant monthly
 *    return unless a specific calculator says otherwise.
 *  - XIRR uses calendar years (days/365.25).
 *  - Indian rupee formatting is applied in the island, not here.
 */
import {
  sipFutureValue, sipRequiredForGoal, lumpSumFutureValue, cagr, xirr, emi,
  loanAmortisation, compoundFutureValue, presentValue, realReturn,
  inflationErodedValue, effectiveAnnualRate, retirementCorpus,
  withdrawalSustainability, sustainableInitialWithdrawal, p2pExpectedNetReturn,
  bondPrice, macaulayDuration, feeImpact, currencyScenario, rentalYield,
  portfolioExpectedReturn, maxDrawdown, pmsSimulation,
  newRegimeTaxFY27, oldRegimeTaxFY27, coreSatelliteBlend, advanceTaxFY27,
  sifSleeveSizing, businessTrustTiming, aifWaterfall, deductionShieldFY27,
  afterTaxProductWedge, highIncomeTaxFY27, hufIncomeSplitFY27,
  npsRetirementExitFY27, preIpoTaxOutcome, seniorRegimeTaxFY27,
  nriIndiaTaxFY27, rolloverExemption, dtaaReliefFY27,
  esopVestingTaxFY27, capitalLadderFY27,
  fiftyFourECTrancheTracker, giftCityLrsTaxFY27,
  giftCityRouteComparison, directLrsUsEquityFilingFY27,
  fastDSDisclosureFY26, blackMoneyActExposure,
  fastDSValuationGuard,
} from '@lib/finance/index';

export interface CalcInput {
  key: string;
  label: string;
  default: number | string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  unit?: string;
  type?: 'number' | 'textarea' | 'select';
  options?: { value: number; label: string }[]; // for select-style inputs
}

export interface CalcResult {
  label: string;
  value: number | string;
  kind: 'inr' | 'pct' | 'number' | 'text' | 'inr2';
  note?: string;
}

export interface CalcDef {
  id: string;
  title: string;
  category: string;
  description: string;
  inputs: CalcInput[];
  assumptions: string[];
  limitations: string[];
  compute: (v: Record<string, number>) => {
    results: CalcResult[];
    chart?: { title: string; alt: string; option: Record<string, unknown> };
  };
}

const inr = (n: number) => Math.round(n);

export const CALCULATORS: CalcDef[] = [
  {
    id: 'sip-vs-lumpsum',
    title: 'SIP vs Lump-Sum',
    category: 'Growth planning',
    description: 'Compare a monthly SIP against a single lump sum at a constant return. A monthly nominal rate is used with end-of-month contributions.',
    inputs: [
      { key: 'amt', label: 'Amount (₹ / month for SIP, total for lump sum)', default: 15000, min: 100, step: 500, hint: 'For the SIP this is the monthly amount; for the lump sum it is the one-time investment.' },
      { key: 'rate', label: 'Expected annual return (%)', default: 12, min: 0, max: 30, step: 0.5, hint: 'Use a realistic long-run equity number; avoid chasing peak years.' },
      { key: 'years', label: 'Years', default: 15, min: 1, max: 40, step: 1 },
    ],
    assumptions: [
      'SIP: end-of-month contributions at a constant monthly return of (annual/12).',
      'Lump sum: one-time investment compounded monthly.',
      'No taxes, no expenses, no market timing; this is a mathematical illustration, not a forecast.',
    ],
    limitations: ['Actual markets are volatile; the "constant return" assumption is the key simplification. Taxes and expenses reduce real outcomes.'],
    compute: (v) => {
      const m = v.rate / 100 / 12;
      const n = v.years * 12;
      const sipFv = sipFutureValue(v.amt, m, n);
      const lumpFv = lumpSumFutureValue(v.amt, v.rate / 100, v.years);
      const months = Array.from({ length: v.years * 4 + 1 }, (_, i) => i);
      const sipSeries = months.map((mm) => Math.round(sipFutureValue(v.amt, m, mm)));
      const lumpSeries = months.map((mm) => Math.round(v.amt * Math.pow(1 + m, mm)));
      return {
        results: [
          { label: 'SIP future value', value: inr(sipFv), kind: 'inr', note: `${v.amt}/mo × ${v.years}y` },
          { label: 'Lump-sum future value', value: inr(lumpFv), kind: 'inr', note: `${v.amt} one-time` },
          { label: 'Difference', value: inr(Math.abs(sipFv - lumpFv)), kind: 'inr', note: sipFv > lumpFv ? 'SIP wins' : 'Lump sum wins' },
          { label: 'SIP total invested', value: inr(v.amt * n), kind: 'inr' },
        ],
        chart: {
          title: `Growth over ${v.years} years at ${v.rate}%`,
          alt: `Two lines comparing SIP and lump-sum growth over ${v.years} years at ${v.rate} percent annual.`,
          option: {
            tooltip: { trigger: 'axis', valueFormatter: (x: number) => `₹${(x / 1e5).toFixed(1)}L` },
            legend: { data: ['SIP', 'Lump sum'] },
            xAxis: { type: 'category', data: months.map((mm) => `${Math.floor(mm / 12)}y`), name: 'Years' },
            yAxis: { type: 'value', name: '₹ (lakh)', axisLabel: { formatter: (x: number) => `${(x / 1e5).toFixed(0)}` } },
            series: [
              { name: 'SIP', type: 'line', smooth: true, data: sipSeries, areaStyle: { opacity: 0.12 }, lineStyle: { color: '#1f7a5c' }, itemStyle: { color: '#1f7a5c' } },
              { name: 'Lump sum', type: 'line', smooth: true, data: lumpSeries, lineStyle: { color: '#c69a2c', type: 'dashed' }, itemStyle: { color: '#c69a2c' } },
            ],
          },
        },
      };
    },
  },

  {
    id: 'goal-sip',
    title: 'Goal-Based SIP',
    category: 'Growth planning',
    description: 'Find the monthly SIP needed to reach a goal amount by a target date at a constant return.',
    inputs: [
      { key: 'goal', label: 'Goal amount (₹)', default: 5000000, min: 10000, step: 100000 },
      { key: 'rate', label: 'Expected annual return (%)', default: 12, min: 0, max: 30, step: 0.5 },
      { key: 'years', label: 'Years to goal', default: 5, min: 1, max: 40, step: 1 },
      { key: 'inflation', label: 'Inflation on the goal (%)', default: 6, min: 0, max: 20, step: 0.5, hint: 'Optional: inflates the goal to its future value first.' },
    ],
    assumptions: ['End-of-month contributions; constant monthly return; goal optionally inflated to the target year.'],
    limitations: ['Ignores taxes and expenses. Inflation on the goal makes the target larger — use it when the goal is a future price.'],
    compute: (v) => {
      const m = v.rate / 100 / 12;
      const n = v.years * 12;
      const inflatedGoal = v.goal * Math.pow(1 + v.inflation / 100, v.years);
      const monthly = sipRequiredForGoal(inflatedGoal, m, n);
      const invested = monthly * n;
      return {
        results: [
          { label: 'Future value of goal (inflated)', value: inr(inflatedGoal), kind: 'inr' },
          { label: 'Required monthly SIP', value: inr(monthly), kind: 'inr' },
          { label: 'Total you will invest', value: inr(invested), kind: 'inr' },
          { label: 'Wealth created (FV − invested)', value: inr(inflatedGoal - invested), kind: 'inr' },
        ],
      };
    },
  },

  {
    id: 'cagr-xirr',
    title: 'CAGR & XIRR',
    category: 'Performance',
    description: 'Compute compound annual growth rate for a two-point investment, and XIRR for irregular cash flows (enter the largest up to 6 flows; negative = money in, positive = money out).',
    inputs: [
      { key: 'start', label: 'Start value (₹)', default: 100000, min: 0, step: 1000 },
      { key: 'end', label: 'End value (₹)', default: 250000, min: 0, step: 1000 },
      { key: 'years', label: 'Years between', default: 5, min: 1, max: 60, step: 0.5 },
      { key: 'cf1a', label: 'XIRR cash-flow 1 (₹, - in / + out)', default: -100000, step: 1000 },
      { key: 'cf1d', label: '… months ago (for flow 1)', default: 60, step: 1 },
      { key: 'cf2a', label: 'XIRR cash-flow 2 (₹)', default: 250000, step: 1000 },
      { key: 'cf2d', label: '… months ago (for flow 2, 0 = now)', default: 0, step: 1 },
    ],
    assumptions: ['CAGR needs two values and a period. XIRR here uses two dated flows spaced by months (× 30.4 days).'],
    limitations: ['XIRR with two flows equals the annualised yield between them; add more flows in code (tests/unit) for true irregular series.'],
    compute: (v) => {
      const c = cagr(v.start, v.end, v.years);
      const days1 = v.cf1d * 30.44;
      const days2 = v.cf2d * 30.44;
      const x = xirr([
        { date: Date.now() - days1 * 86400000, amount: v.cf1a },
        { date: Date.now() - days2 * 86400000, amount: v.cf2a },
      ]);
      return {
        results: [
          { label: 'CAGR', value: Number.isFinite(c) ? `${(c * 100).toFixed(2)}%` : '—', kind: 'text' },
          { label: 'XIRR (2 flows)', value: Number.isFinite(x) ? `${(x * 100).toFixed(2)}%` : '—', kind: 'text' },
        ],
      };
    },
  },

  {
    id: 'emi-loan',
    title: 'EMI & Loan Amortisation',
    category: 'Loans',
    description: 'Monthly EMI for a loan and how much of each payment is interest vs principal.',
    inputs: [
      { key: 'principal', label: 'Loan amount (₹)', default: 2000000, min: 1000, step: 10000 },
      { key: 'rate', label: 'Annual interest rate (%)', default: 8.5, min: 0, max: 30, step: 0.1 },
      { key: 'months', label: 'Tenure (months)', default: 240, min: 1, max: 360, step: 12 },
    ],
    assumptions: ['Fixed-rate, reducing-balance amortisation; EMI is constant.'],
    limitations: ['Does not model prepayment, float resets, or insurance. Actual loans may differ.'],
    compute: (v) => {
      const pay = emi(v.principal, v.rate / 100, v.months);
      const sched = loanAmortisation(v.principal, v.rate / 100, v.months);
      const totalInterest = sched.reduce((a, r) => a + r.interest, 0);
      const q1 = sched.slice(0, 3);
      return {
        results: [
          { label: 'Monthly EMI', value: inr(pay), kind: 'inr' },
          { label: 'Total interest over term', value: inr(totalInterest), kind: 'inr' },
          { label: 'Total repaid', value: inr(v.principal + totalInterest), kind: 'inr' },
          { label: 'Interest in first 3 months', value: inr(q1.reduce((a, r) => a + r.interest, 0)), kind: 'inr', note: 'Front-loaded interest' },
        ],
        chart: {
          title: 'Interest vs principal in the first 12 EMI periods (₹ lakh)',
          alt: 'Stacked bars showing interest and principal portions of each of the first 12 EMI payments.',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { data: ['Interest', 'Principal'] },
            xAxis: { type: 'category', data: sched.slice(0, 12).map((r) => r.period) },
            yAxis: { type: 'value', name: '₹/10k' },
            series: [
              { name: 'Interest', type: 'bar', stack: 't', data: sched.slice(0, 12).map((r) => +(r.interest / 10000).toFixed(2)), itemStyle: { color: '#c69a2c' } },
              { name: 'Principal', type: 'bar', stack: 't', data: sched.slice(0, 12).map((r) => +(r.principal / 10000).toFixed(2)), itemStyle: { color: '#1f7a5c' } },
            ],
          },
        },
      };
    },
  },

  {
    id: 'fd-maturity',
    title: 'Fixed Deposit Maturity',
    category: 'Debt',
    description: 'Maturity value of a fixed deposit with annual, half-yearly, quarterly or monthly compounding.',
    inputs: [
      { key: 'principal', label: 'Principal (₹)', default: 500000, min: 1000, step: 10000 },
      { key: 'rate', label: 'Interest rate (p.a. %)', default: 7, min: 0, max: 20, step: 0.1 },
      { key: 'years', label: 'Tenure (years)', default: 5, min: 1, max: 30, step: 1 },
      { key: 'freq', label: 'Compounding', default: 4, step: 1, options: [
        { value: 1, label: 'Yearly (1)' }, { value: 2, label: 'Half-yearly (2)' }, { value: 4, label: 'Quarterly (4)' }, { value: 12, label: 'Monthly (12)' },
      ] },
    ],
    assumptions: ['Interest is compounded (not simple) at the chosen frequency.'],
    limitations: ['Interest is taxable at your slab rate; TDS may apply. This shows pre-tax maturity.'],
    compute: (v) => {
      const fv = compoundFutureValue(v.principal, v.rate / 100, v.years, v.freq);
      const ear = effectiveAnnualRate(v.rate / 100, v.freq);
      return {
        results: [
          { label: 'Maturity value', value: inr(fv), kind: 'inr' },
          { label: 'Interest earned', value: inr(fv - v.principal), kind: 'inr' },
          { label: 'Effective annual rate', value: `${(ear * 100).toFixed(2)}%`, kind: 'text' },
        ],
      };
    },
  },

  {
    id: 'inflation-erode',
    title: 'Inflation Erosion & Real Returns',
    category: 'Returns',
    description: 'How far purchasing power falls under inflation, and what a nominal return is worth in real terms.',
    inputs: [
      { key: 'amount', label: 'Amount today (₹)', default: 1000000, min: 1000, step: 10000 },
      { key: 'inflation', label: 'Annual inflation (%)', default: 6, min: 0, max: 30, step: 0.5 },
      { key: 'years', label: 'Years', default: 10, min: 1, max: 60, step: 1 },
      { key: 'nominal', label: 'Nominal return you expect (%)', default: 12, min: 0, max: 40, step: 0.5 },
    ],
    assumptions: ['Constant inflation and nominal return each year; real return uses the exact formula (1+nom)/(1+inf)−1.'],
    limitations: ['Inflation is not constant in reality; this is a planning estimate.'],
    compute: (v) => {
      const eroded = inflationErodedValue(v.amount, v.inflation / 100, v.years);
      const real = realReturn(v.nominal / 100, v.inflation / 100);
      const fvNom = v.amount * Math.pow(1 + v.nominal / 100, v.years);
      const fvReal = v.amount * Math.pow(1 + real, v.years);
      return {
        results: [
          { label: 'Today’s money in that many years', value: inr(eroded), kind: 'inr', note: 'Purchasing power' },
          { label: 'Real annual return', value: `${(real * 100).toFixed(2)}%`, kind: 'text' },
          { label: 'Nominal FV', value: inr(fvNom), kind: 'inr' },
          { label: 'Real (inflation-adjusted) FV', value: inr(fvReal), kind: 'inr' },
        ],
      };
    },
  },

  {
    id: 'retirement-corpus',
    title: 'Retirement Corpus & Withdrawal',
    category: 'Retirement',
    description: 'Corpus needed to fund inflation-adjusted spending, and whether a given corpus sustains withdrawals.',
    inputs: [
      { key: 'spend', label: 'Annual spending at retirement (₹)', default: 1000000, min: 10000, step: 10000 },
      { key: 'years', label: 'Life expectancy after retirement (years)', default: 25, min: 5, max: 40, step: 1 },
      { key: 'inflation', label: 'Annual inflation on spending (%)', default: 6, min: 0, max: 15, step: 0.5 },
      { key: 'growth', label: 'Portfolio growth (p.a. %)', default: 9, min: 0, max: 15, step: 0.5 },
      { key: 'factor', label: 'Corpus factor (spend multiples)', default: 25, min: 10, max: 40, step: 1, hint: '25 ≈ the 4% rule; use 30–33 for lower real growth.' },
      { key: 'corpus', label: 'Corpus you actually have (₹)', default: 7500000, min: 0, step: 100000 },
    ],
    assumptions: ['Corpus = spend × factor. Withdrawal test compounds the corpus at growth, grows spending with inflation.'],
    limitations: ['Does not model sequence-of-returns risk year-by-year, taxes on withdrawals, or healthcare spikes. The 4% rule is a US-origin heuristic, not proven for India.'],
    compute: (v) => {
      const required = retirementCorpus(v.spend, v.inflation / 100, v.years, v.factor);
      const w = withdrawalSustainability(v.corpus, v.spend, v.growth / 100, v.inflation / 100, v.years);
      const withdraw4 = sustainableInitialWithdrawal(v.corpus, 0.04);
      return {
        results: [
          { label: 'Corpus needed (factor method)', value: inr(v.spend * v.factor), kind: 'inr' },
          { label: 'Corpus needed (inflation + 25x)', value: inr(required), kind: 'inr', note: 'Inflates first, then × factor' },
          { label: '4% rule initial withdrawal', value: inr(withdraw4), kind: 'inr', note: 'From your actual corpus' },
          { label: 'Your corpus last year of test', value: inr(w.valueAfterYears), kind: 'inr' },
          { label: 'Sustainable?', value: w.sustainable ? 'Yes' : `No — runs out in year ${w.shortfallYear}`, kind: 'text' },
        ],
      };
    },
  },

  {
    id: 'p2p-stress',
    title: 'P2P Expected-Loss Stress Test',
    category: 'P2P lending',
    description: 'Estimate expected net P2P return after credit loss (default rate × loss-given-default) and fees, across mild/base/severe scenarios.',
    inputs: [
      { key: 'gross', label: 'Advertised gross return (%)', default: 14, min: 0, max: 40, step: 0.5 },
      { key: 'pd', label: 'Base default rate (%)', default: 4, min: 0, max: 60, step: 0.5 },
      { key: 'lgd', label: 'Loss given default (%)', default: 60, min: 0, max: 100, step: 5, hint: 'Share of a defaulted ticket you actually lose (100 − recovery).' },
      { key: 'fee', label: 'Platform + service fee (%)', default: 1, min: 0, max: 10, step: 0.1 },
      { key: 'idle', label: 'Idle-cash drag (%)', default: 0.5, min: 0, max: 5, step: 0.1 },
    ],
    assumptions: ['Expected loss = PD × LGD, subtracted from gross before fees and idle-cash drag. Scenarios: mild = 0.5×PD & LGD−10; base = as given; severe = 2×PD & LGD+10.'],
    limitations: ['PD/LGD are estimates you must back-test against the platform’s actual NPA and recovery data. Correlated defaults (one sector hit) can make realised losses far worse than expected. Never treat this as a guaranteed return.'],
    compute: (v) => {
      const base = p2pExpectedNetReturn({ grossAnnualReturn: v.gross / 100, defaultRate: v.pd / 100, lossGivenDefault: v.lgd / 100, idleCashDrag: v.idle / 100, annualServiceFee: v.fee / 100 });
      const mild = p2pExpectedNetReturn({ grossAnnualReturn: v.gross / 100, defaultRate: (v.pd / 2) / 100, lossGivenDefault: Math.max(0, v.lgd - 10) / 100, idleCashDrag: v.idle / 100, annualServiceFee: v.fee / 100 });
      const severe = p2pExpectedNetReturn({ grossAnnualReturn: v.gross / 100, defaultRate: Math.min(60, v.pd * 2) / 100, lossGivenDefault: Math.min(100, v.lgd + 10) / 100, idleCashDrag: v.idle / 100, annualServiceFee: v.fee / 100 });
      const on1L = (r: number) => r * 100000;
      return {
        results: [
          { label: 'Base expected net return', value: `${(base.netReturn * 100).toFixed(2)}%`, kind: 'text', note: `≈ ₹${(on1L(base.netReturn) / 10000).toFixed(2)}L per ₹10L` },
          { label: 'Mild scenario', value: `${(mild.netReturn * 100).toFixed(2)}%`, kind: 'text' },
          { label: 'Severe scenario', value: `${(severe.netReturn * 100).toFixed(2)}%`, kind: 'text', note: 'Losses can be negative' },
          { label: 'Base expected loss', value: `${(base.expectedLoss * 100).toFixed(2)}%`, kind: 'text' },
        ],
        chart: {
          title: 'Expected net return by scenario',
          alt: 'Bar chart comparing expected net P2P returns for mild, base, and severe credit scenarios.',
          option: {
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['Mild', 'Base', 'Severe'] },
            yAxis: { type: 'value', name: '% p.a.' },
            series: [{ type: 'bar', data: [mild.netReturn, base.netReturn, severe.netReturn].map((x) => +(x * 100).toFixed(2)), itemStyle: { color: '#1f7a5c' }, barWidth: 48 }],
          },
        },
      };
    },
  },

  {
    id: 'bond-price',
    title: 'Bond Price & Duration',
    category: 'Fixed income',
    description: 'Price a coupon bond at a given yield-to-maturity and estimate its Macaulay duration (interest-rate sensitivity).',
    inputs: [
      { key: 'face', label: 'Face value (₹)', default: 1000, min: 100, step: 100 },
      { key: 'coupon', label: 'Annual coupon (%)', default: 7, min: 0, max: 20, step: 0.1 },
      { key: 'years', label: 'Years to maturity', default: 10, min: 1, max: 40, step: 1 },
      { key: 'ytm', label: 'Yield to maturity (%)', default: 6.5, min: 0, max: 20, step: 0.1 },
    ],
    assumptions: ['Annual coupons, YTM as the discount rate. Price = DCF of coupons + face. Macaulay duration in years.'],
    limitations: ['Uses a single YTM for the whole curve. Does not model credit-spread moves or convexity separately (duration is a linear approximation).'],
    compute: (v) => {
      const price = bondPrice(v.face, v.coupon / 100, v.years, v.ytm / 100);
      const dur = macaulayDuration(v.face, v.coupon / 100, v.years, v.ytm / 100);
      const up = bondPrice(v.face, v.coupon / 100, v.years, (v.ytm + 1) / 100);
      const down = bondPrice(v.face, v.coupon / 100, v.years, Math.max(0, (v.ytm - 1)) / 100);
      return {
        results: [
          { label: 'Bond price', value: Number(price.toFixed(2)), kind: 'inr2', note: price > v.face ? 'Premium (coupon > YTM)' : price < v.face ? 'Discount (coupon < YTM)' : 'Par' },
          { label: 'Macaulay duration', value: Number(dur.toFixed(2)), kind: 'number', note: 'years' },
          { label: 'Price if YTM +1%', value: Number(up.toFixed(2)), kind: 'inr2' },
          { label: 'Price if YTM −1%', value: Number(down.toFixed(2)), kind: 'inr2' },
          { label: 'Approx % price change for +1% rate', value: `${(((up - price) / price) * 100).toFixed(2)}%`, kind: 'text', note: '≈ −duration × Δy' },
        ],
      };
    },
  },

  {
    id: 'fee-drag',
    title: 'Expense-Ratio Drag',
    category: 'Costs',
    description: 'How much a higher expense ratio quietly costs over time — the compounding side of the fee coin.',
    inputs: [
      { key: 'corpus', label: 'Investment (₹)', default: 1000000, min: 10000, step: 50000 },
      { key: 'gross', label: 'Gross return (%)', default: 12, min: 0, max: 30, step: 0.5 },
      { key: 'fee', label: 'Expense ratio (%)', default: 1.5, min: 0, max: 5, step: 0.1 },
      { key: 'years', label: 'Years', default: 15, min: 1, max: 40, step: 1 },
    ],
    assumptions: ['Fees compound the same way returns do; net return = gross − fee.'],
    limitations: ['Ignores taxes and entry/exit loads on top of the expense ratio.'],
    compute: (v) => {
      const f = feeImpact(v.corpus, v.gross / 100, v.fee / 100, v.years);
      return {
        results: [
          { label: 'Value without fees', value: inr(f.withoutFees), kind: 'inr' },
          { label: `Value with ${v.fee}% fee`, value: inr(f.withFees), kind: 'inr' },
          { label: 'Lost to the fee', value: inr(f.drag), kind: 'inr', note: 'Compounded over the full period' },
        ],
      };
    },
  },

  {
    id: 'currency-scenario',
    title: 'Currency Depreciation Scenario',
    category: 'International',
    description: 'What happens to the rupee value of an overseas-holdings corpus if INR depreciates a fixed % per year.',
    inputs: [
      { key: 'corpus', label: 'Overseas holdings (₹ value today)', default: 2000000, min: 0, step: 50000 },
      { key: 'dep', label: 'Annual INR depreciation (%)', default: 3, min: 0, max: 20, step: 0.5 },
      { key: 'years', label: 'Years', default: 10, min: 1, max: 40, step: 1 },
    ],
    assumptions: ['Foreign asset grows at zero in home terms except currency; depreciation applied multiplicatively.'],
    limitations: ['Currency moves both ways and is hard to forecast; use as a sensitivity, not a prediction.'],
    compute: (v) => {
      const vNow = currencyScenario(v.corpus, v.dep / 100, v.years);
      return {
        results: [
          { label: 'Today’s value', value: inr(v.corpus), kind: 'inr' },
          { label: `After ${v.years}y at ${v.dep}% depreciation`, value: inr(vNow), kind: 'inr' },
          { label: 'Currency effect', value: inr(vNow - v.corpus), kind: 'inr', note: 'Before any foreign-asset return' },
        ],
      };
    },
  },

  {
    id: 'rental-yield',
    title: 'Real Estate Rental Yield & Costs',
    category: 'Real estate',
    description: 'Compute gross and net rental yield, and the drag of transaction costs on a property round-trip.',
    inputs: [
      { key: 'price', label: 'Property value (₹)', default: 10000000, min: 100000, step: 100000 },
      { key: 'rent', label: 'Annual gross rent (₹)', default: 250000, min: 0, step: 10000 },
      { key: 'vacancy', label: 'Vacancy + maintenance (%) of gross rent', default: 20, min: 0, max: 100, step: 5 },
      { key: 'propTax', label: 'Property tax etc. (% of gross rent)', default: 5, min: 0, max: 50, step: 1 },
      { key: 'buyCosts', label: 'Buy-side transaction costs (%) of price', default: 7, min: 0, max: 20, step: 0.5 },
      { key: 'sellCosts', label: 'Sell-side transaction costs (%) of price', default: 2, min: 0, max: 15, step: 0.5 },
    ],
    assumptions: ['NPI = gross rent × (1 − vacancy) × (1 − tax). Gross yield = gross rent / price; net yield = NPI / price.'],
    limitations: ['Indicative; actual figures vary widely by city and asset. Finance and capital-gains tax are not included here.'],
    compute: (v) => {
      const gross = v.rent / v.price;
      const net = v.rent * (1 - v.vacancy / 100) * (1 - v.propTax / 100);
      const netY = net / v.price;
      const txn = v.price * v.buyCosts / 100 + v.price * v.sellCosts / 100;
      return {
        results: [
          { label: 'Gross rental yield', value: `${(gross * 100).toFixed(2)}%`, kind: 'text' },
          { label: 'Net rental yield', value: `${(netY * 100).toFixed(2)}%`, kind: 'text', note: 'After vacancy & tax' },
          { label: 'Annual net property income', value: inr(net), kind: 'inr' },
          { label: 'Round-trip transaction costs', value: inr(txn), kind: 'inr', note: `${v.buyCosts}% buy + ${v.sellCosts}% sell` },
        ],
      };
    },
  },

  {
    id: 'drawdown',
    title: 'Max Drawdown & Recovery',
    category: 'Risk',
    description: 'Paste a series of portfolio values (one per row or comma-separated) to compute the maximum drawdown and the gain needed to recover.',
    inputs: [
      { key: 'series', label: 'Values (comma-separated)', default: '1000000, 1200000, 900000, 1100000, 1500000', step: 0, type: 'textarea', hint: 'e.g. 1000000, 1200000, 900000, 1100000, 1500000' },
    ],
    assumptions: ['Drawdown measured from running peak; recovery = 1/(1−dd).'],
    limitations: ['Point-in-time values; use the series you actually care about.'],
    compute: (v) => {
      const s = String(v.series ? `${v.series}` : '').split(/[,\n]/).map((x) => parseFloat(x.trim())).filter(Number.isFinite);
      const dd = maxDrawdown(s.length ? s : [1, 1]);
      const recover = dd > 0 ? 1 / (1 - dd) - 1 : 0;
      return {
        results: [
          { label: 'Max drawdown', value: `${(dd * 100).toFixed(1)}%`, kind: 'text' },
          { label: 'Gain needed to recover', value: `${(recover * 100).toFixed(1)}%`, kind: 'text' },
        ],
      };
    },
  },

  {
    id: 'pms-aif-fees',
    title: 'PMS / AIF Fee Drag (mgmt + performance)',
    category: 'Costs',
    description: 'Model the layered fees of a PMS/AIF — an annual management fee plus a performance fee charged only on gains above a benchmark — and how much they quietly cost over a long horizon.',
    inputs: [
      { key: 'corpus', label: 'Starting corpus (₹)', default: 1000000, min: 500000, step: 500000, hint: 'SEBI PMS minimum is ₹50L; AIF Cat-I/II/III from ₹25L. Use the amount you would actually commit.' },
      { key: 'gross', label: 'Gross annual return, before fees (%)', default: 15, min: 0, max: 40, step: 0.5, hint: 'The fund\u2019s pre-fee return. PMS/AIFs are often 14-18% in good years; do not extrapolate peak years.' },
      { key: 'years', label: 'Years', default: 15, min: 1, max: 30, step: 1 },
      { key: 'mgmt', label: 'Management fee (% / yr)', default: 1.0, min: 0, max: 3, step: 0.1, hint: 'SEBI PMS recurring management fee is capped; many charge 0.5-2%. Charged each year on the opening corpus.' },
      { key: 'perf', label: 'Performance fee (% on excess gain)', default: 20, min: 0, max: 25, step: 1, hint: 'Charged only on the gain that beats the benchmark. Common at 20% of the excess (the standard "2-and-20" style).' },
      { key: 'benchmark', label: 'Benchmark return (%)', default: 10, min: 0, max: 20, step: 0.5, hint: 'The hurdle (often an index like Nifty). Performance fee applies only above this.' },
    ],
    assumptions: [
      'Gross return is pre-fee; the management fee is charged each year on the *opening* corpus (SEBI PMS convention).',
      'The performance fee applies only to the gain that *exceeds* the benchmark, computed *after* the management fee; if the year does not beat the benchmark, that year\u2019s performance fee is zero.',
      'No entry/exit load, no taxes, no high-water-line clawback; a smooth constant return (the key simplification).',
    ],
    limitations: [
      'Real PMS/AIF performance is volatile and non-linear; a clawback / high-water line can reduce the performance fee in down years but is not modelled here.',
      'AIFs can add a carry provision and a longer lock-in; treat this as the order of magnitude, not a fund-specific quote.',
    ],
    compute: (v) => {
      const s = pmsSimulation(v.corpus, v.gross / 100, v.years, v.mgmt / 100, v.perf / 100, v.benchmark / 100);
      const noFee = pmsSimulation(v.corpus, v.gross / 100, v.years, 0, 0, v.benchmark / 100).finalValue;
      const yrs = Array.from({ length: v.years + 1 }, (_, i) => i);
      const withFeesSeries = yrs.map((yy) => Math.round(pmsSimulation(v.corpus, v.gross / 100, yy, v.mgmt / 100, v.perf / 100, v.benchmark / 100).finalValue));
      const noFeesSeries = yrs.map((yy) => Math.round(pmsSimulation(v.corpus, v.gross / 100, yy, 0, 0, v.benchmark / 100).finalValue));
      return {
        results: [
          { label: 'Final value (with fees)', value: inr(s.finalValue), kind: 'inr', note: `after ${v.mgmt}% mgmt + ${v.perf}% perf` },
          { label: 'Final value (no fees)', value: inr(noFee), kind: 'inr' },
          { label: 'Lost to fees', value: inr(noFee - s.finalValue), kind: 'inr', note: 'management + performance fees, compounded' },
          { label: 'Total management fees', value: inr(s.totalMgmtFees), kind: 'inr' },
          { label: 'Total performance fees', value: inr(s.totalPerfFees), kind: 'inr' },
          { label: 'Fees as % of final value', value: `${(s.feeShareOfFinal * 100).toFixed(1)}%`, kind: 'text' },
        ],
        chart: {
          title: `PMS/AIF growth over ${v.years}y with vs without fees`,
          alt: `Two lines over ${v.years} years: the corpus with management and performance fees, and the same corpus with no fees, showing the fee drag.`,
          option: {
            tooltip: { trigger: 'axis', valueFormatter: (x: number) => `₹${(x / 1e5).toFixed(1)}L` },
            legend: { data: ['With fees', 'No fees'] },
            xAxis: { type: 'category', data: yrs.map((yy) => `${yy}y`), name: 'Years' },
            yAxis: { type: 'value', name: '₹ (lakh)', axisLabel: { formatter: (x: number) => `${(x / 1e5).toFixed(0)}` } },
            series: [
              { name: 'With fees', type: 'line', smooth: true, data: withFeesSeries, areaStyle: { opacity: 0.12 }, lineStyle: { color: '#b45309' }, itemStyle: { color: '#b45309' } },
              { name: 'No fees', type: 'line', smooth: true, data: noFeesSeries, lineStyle: { color: '#1f7a5c', type: 'dashed' }, itemStyle: { color: '#1f7a5c' } },
            ],
          },
        },
      };
    },
  },

  {
    id: 'tax-shield',
    title: 'New vs Old Regime Tax Shield (FY 2026-27)',
    category: 'Tax',
    description: 'Compare your FY 2026-27 income-tax liability under the new regime (default, no 80C/80D/80CCD deductions, 75k standard deduction) against the old regime (50k standard deduction plus your deduction stack). Slabs: new nil to ₹4L … 30% above ₹24L, 87A rebate to ₹12L; old nil to ₹2.5L, 5% to ₹5L, 20% to ₹10L, 30% above.',
    inputs: [
      { key: 'gross', label: 'Gross salary / salary income (₹)', default: 1500000, min: 0, step: 50000, hint: 'Your CTC salary component. Investment income is taxed the same under both regimes and cancels out of the comparison.' },
      { key: 'ded80c', label: '80C + 80CCD(1B) deductions (₹)', default: 200000, min: 0, max: 200000, step: 10000, hint: 'PPF + ELSS + life insurance + NPS, capped at ₹1,50,000 for 80C plus ₹50,000 extra under 80CCD(1B).' },
      { key: 'ded80d', label: '80D health premium (₹)', default: 25000, min: 0, max: 50000, step: 5000, hint: '₹25,000 base (₹50,000 for seniors), plus ₹25,000 for self and ₹50,000 for senior parents.' },
      { key: 'dedloan', label: 'Home-loan interest 24(b) (₹)', default: 0, min: 0, max: 200000, step: 10000, hint: 'Self-occupied property interest, capped at ₹2,00,000/yr. Let-out property interest is uncapped and allowed in both regimes — add it to both sides, or just note it cancels out.' },
      { key: 'hrra', label: 'HRA exemption (₹)', default: 0, min: 0, step: 10000, hint: 'Only usable under the old regime. Compute with the lowest-of-three rule (50% of salary, rent − 10% of salary, rent paid).' },
    ],
    assumptions: [
      'FY 2026-27 slabs, resident individual below 60, no surcharge (income under ₹50L).',
      'New regime: 75k standard deduction, 87A rebate keeps income up to ₹12L tax-free.',
      'Old regime: 50k standard deduction, nil to ₹2.5L, 5% to ₹5L, 20% to ₹10L, 30% above; 87A rebate keeps income up to ₹5L tax-free (₹12,500 rebate).',
      '4% health & education cess added to both; investment and capital-gains income excluded (same in both regimes).',
    ],
    limitations: [
      'Surcharge, senior-citizen nil bands, and marginal relief above ₹12L are not modelled — high-income users should verify with a CA.',
      'HRA and let-out house property interest depend on your rent/city; treat the HRA input as your own computed figure, not a default.',
    ],
    compute: (v) => {
      const newTax = newRegimeTaxFY27(v.gross - 75000);
      const oldTax = oldRegimeTaxFY27(v.gross - 50000 - v.ded80c - v.ded80d - v.dedloan - v.hrra);
      const newTotal = newTax * 1.04;
      const oldTotal = oldTax * 1.04;
      const winner = newTotal <= oldTotal ? 'new' : 'old';
      const series = Array.from({ length: 10 }, (_, i) => {
        const g = (v.gross / 10) * (i + 1);
        return [Math.round(g / 1000) * 1000, Math.round(newRegimeTaxFY27(g - 75000) * 1.04), Math.round(oldRegimeTaxFY27(Math.max(0, g - 50000 - v.ded80c - v.ded80d - v.dedloan - v.hrra)) * 1.04)];
      });
      return {
        results: [
          { label: 'New-regime tax + cess', value: Math.round(newTotal), kind: 'inr', note: `₹${Math.round(newTax).toLocaleString('en-IN')} + 4% cess` },
          { label: 'Old-regime tax + cess', value: Math.round(oldTotal), kind: 'inr', note: `₹${Math.round(oldTax).toLocaleString('en-IN')} + 4% cess` },
          { label: 'Save by choosing ' + winner, value: Math.round(Math.abs(newTotal - oldTotal)), kind: 'inr', note: winner === 'new' ? 'Deductions do not beat the flatter new slabs' : 'Deduction stack wins this year' },
        ],
        chart: {
          title: `Tax liability as gross salary scales (${winner}-regime advantage at your deduction stack)`,
          alt: `A two-line chart: new-regime and old-regime total tax (including 4% cess) as gross salary scales from one-tenth to your entered gross salary, with your deduction stack applied to the old regime.`,
          option: {
            tooltip: { trigger: 'axis', valueFormatter: (x: number) => `₹${(x / 1e5).toFixed(2)}L` },
            legend: { data: ['New regime', 'Old regime'] },
            xAxis: { type: 'category', data: series.map((r) => `₹${(r[0] / 1e5).toFixed(1)}L`), name: 'Gross salary' },
            yAxis: { type: 'value', name: '₹ (lakh)', axisLabel: { formatter: (x: number) => `${(x / 1e5).toFixed(1)}` } },
            series: [
              { name: 'New regime', type: 'line', smooth: true, data: series.map((r) => r[1]), lineStyle: { color: '#1f7a5c' }, itemStyle: { color: '#1f7a5c' } },
              { name: 'Old regime', type: 'line', smooth: true, data: series.map((r) => r[2]), lineStyle: { color: '#b45309' }, itemStyle: { color: '#b45309' } },
            ],
          },
        },
      };
    },
  },

  {
    id: 'core-satellite',
    title: 'NCD Core-Satellite Blend',
    category: 'Fixed income',
    description: 'Blend a high-grade AAA/AA core with a smaller A/BBB satellite to raise blended yield, and see how much principal one satellite default costs. Illustrates the Q2-2026 yield ladder (AAA 7–8%, AA 8–9.5%, A 9.5–11.5%, BBB 11.5%+).',
    inputs: [
      { key: 'corpus', label: 'Fixed-income corpus (₹)', default: 1000000, min: 100000, step: 100000, hint: 'The amount you would split between the two rungs.' },
      { key: 'corePct', label: 'Share in AAA/AA core (%)', default: 70, min: 0, max: 100, step: 5, hint: 'The safety-first portion. Most conservative retail builds keep 60–80% here.' },
      { key: 'coreYield', label: 'Core yield, AAA/AA (%)', default: 8.2, min: 3, max: 15, step: 0.1, hint: 'Q2-2026 reference: AAA 7.0–8.0%, AA 8.0–9.5%.' },
      { key: 'satYield', label: 'Satellite yield, A/BBB (%)', default: 11, min: 3, max: 20, step: 0.5, hint: 'Q2-2026 reference: A 9.5–11.5%, BBB 11.5–13%+.' },
      { key: 'issuers', label: 'Satellite issuers (equal-weight)', default: 4, min: 1, max: 20, step: 1, hint: 'Number of separate A/BBB names in the satellite. Each issuer carries its own default risk.' },
    ],
    assumptions: [
      'Yields are fixed-coupon illustrations for one year; the result is annual interest, not a compounded corpus projection.',
      'Coupons on NCDs are taxed at your slab rate (with TDS on unlisted; listed NCDs in demat generally have no TDS), so a high nominal yield can be worth considerably less after tax.',
      'One-issuer default: you lose that issuer\u2019s entire satellite equal-weight; recovery at maturity (typically 30–70% in historical defaults) is not modelled.',
    ],
    limitations: [
      'Yield bands move with the repo cycle; re-run before allocating. The 2026 reference bands are time-sensitive.',
      'Diversification across issuers cuts single-name risk, not sector-wide credit stress.',
    ],
    compute: (v) => {
      const r = coreSatelliteBlend(v.corpus, v.corePct / 100, v.coreYield / 100, v.satYield / 100, v.issuers);
      const coreAlloc = Math.round(v.corpus * (v.corePct / 100));
      const satAlloc = v.corpus - coreAlloc;
      return {
        results: [
          { label: 'Blended annual yield', value: r.blendedYield, kind: 'pct', note: `₹${Math.round(r.totalInterest).toLocaleString('en-IN')} interest on ₹${v.corpus.toLocaleString('en-IN')}` },
          { label: 'Core allocation', value: coreAlloc, kind: 'inr', note: `${v.corePct}% at ${v.coreYield}%` },
          { label: 'Satellite allocation', value: satAlloc, kind: 'inr', note: `${100 - v.corePct}% across ${v.issuers} issuers at ${v.satYield}%` },
          { label: 'If one satellite issuer defaults', value: Math.round(r.singleDefaultLoss), kind: 'inr', note: `Principal at risk on ${v.issuers} equal-weight names; recovery (30–70% historically) would cut this loss` },
        ],
        chart: {
          title: 'Blended yield vs all-core baseline',
          alt: `Two bars: the blended yield of ${v.corePct}% core at ${v.coreYield}% plus ${100 - v.corePct}% satellite at ${v.satYield}%, versus a pure-core portfolio at ${v.coreYield}%, showing the yield uplift bought by satellite risk.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `${x}%` },
            xAxis: { type: 'category', data: [`Blended (${v.corePct}% core)`, `All core`, `All satellite`] },
            yAxis: { type: 'value', name: '% p.a.', axisLabel: { formatter: (x: number) => `${x}%` } },
            series: [{
              name: 'Yield', type: 'bar',
              data: [
                { value: +(r.blendedYield * 100).toFixed(2), itemStyle: { color: '#1f7a5c' } },
                { value: v.coreYield, itemStyle: { color: '#84a98c' } },
                { value: v.satYield, itemStyle: { color: '#b45309' } },
              ],
              label: { show: true, formatter: (p: { value: number }) => `${p.value}%` },
            }],
          },
        },
      };
    },
  },

  {
    id: 'advance-tax',
    title: 'Advance Tax Installments (FY 2026-27)',
    category: 'Tax',
    description: 'Plan your four advance-tax installments (15 Jun / 15 Sep / 15 Dec / 15 Mar) under FY 2026-27 new-regime slabs, after TDS credit, and see an approximate Section 234C interest cost if you defer everything to the last date.',
    inputs: [
      { key: 'income', label: 'Estimated annual taxable income (Rs)', default: 2000000, min: 0, step: 100000, hint: 'All income for the year (salary, rent, business, capital gains). The calculator applies new-regime slabs, the 87A rebate, surcharge and 4% cess. If you use the old regime, compute your own total tax and enter it in the "total tax" box instead.' },
      { key: 'useTaxInput', label: 'Use a pre-computed total tax (Rs)', default: 0, min: 0, step: 10000, hint: 'Optional: enter your own total tax + cess (from a CA or the ITR utility) and it will replace the slab computation. Leave at 0 to compute from income.' },
      { key: 'tds', label: 'TDS / TCS expected to be credited (Rs)', default: 200000, min: 0, step: 10000, hint: 'Salaried employees mostly clear their advance-tax duty via TDS. Freelancers and rental income usually need the rest paid in installments.' },
      { key: 'presumptive', label: 'Presumptive 44AD/44ADA taxpayer', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes - may pay 100% by 15 Mar' }], hint: 'Presumptive-income taxpayers can skip the four installments and pay the full amount by 15 March instead.' },
    ],
    assumptions: [
      'FY 2026-27 new-regime slabs: nil to Rs 4L, 5% to 8L, 10% to 12L, 15% to 16L, 20% to 20L, 25% to 24L, 30% above; 87A rebate keeps income up to Rs 12L tax-free.',
      'Surcharge: 10% above Rs 50L, 15% above Rs 1Cr, 25% above Rs 2Cr (new regime cap), plus 4% health & education cess on (tax + surcharge).',
      'The advance-tax duty applies when the balance after TDS exceeds Rs 10,000; the four cumulative dates are 15 / 45 / 75 / 100%.',
    ],
    limitations: [
      'Old-regime filers should compute their own total tax and use the "pre-computed total tax" input; the slab computation here is new-regime only.',
      'The 234C figure is an approximation (1% x 3 months on each of the first three quarterly shortfalls); actual liability depends on how much you paid on each date - verify with the ITR utility.',
      'This is an illustration, not a filing - pay via Challan 280 (Advance Tax) on the income-tax portal.',
    ],
    compute: (v) => {
      const totalTax =
        v.useTaxInput > 0
          ? v.useTaxInput
          : (() => {
              const slabTax = newRegimeTaxFY27(v.income);
              let surcharge = 0;
              if (v.income > 5000000) surcharge = slabTax * 0.1;
              if (v.income > 10000000) surcharge = slabTax * 0.15;
              if (v.income > 20000000) surcharge = slabTax * 0.25;
              return (slabTax + surcharge) * 1.04;
            })();
      const r = advanceTaxFY27(totalTax, v.tds);
      const schedule =
        v.presumptive === 1
          ? [
              { dueDate: '15 Mar 2027 (single installment)', cumulativePct: 1.0, amountDue: r.advanceTaxDue },
            ]
          : r.installments;
      const totalWithInterest = r.advanceTaxDue + r.interest234CApprox;
      return {
        results: [
          {
            label: 'Total tax + cess (est.)',
            value: Math.round(totalTax),
            kind: 'inr',
            note: v.useTaxInput > 0 ? 'Your pre-computed figure' : 'Computed on new-regime slabs',
          },
          {
            label: 'Advance tax due after TDS',
            value: Math.round(r.advanceTaxDue),
            kind: 'inr',
            note: r.needsAdvanceTax
              ? `Above the Rs 10,000 threshold - installments required${v.presumptive === 1 ? ' (or one 15 Mar installment if 44AD/44ADA)' : ''}`
              : 'At or below the Rs 10,000 threshold - no advance tax',
          },
          {
            label: 'Approx 234C interest if fully deferred',
            value: Math.round(r.interest234CApprox),
            kind: 'inr',
            note: '1% x 3 months on each of the first three quarterly shortfalls; zero if all installments are paid on time',
          },
        ],
        chart: {
          title: r.needsAdvanceTax ? 'Installment schedule (Rs cumulative)' : 'No advance tax due at these inputs',
          alt: `Bar chart of the cumulative advance-tax dues: ${r.installments.map((s) => `${s.dueDate} Rs ${Math.round(s.amountDue).toLocaleString('en-IN')}`).join(', ')}; total ${Math.round(r.advanceTaxDue).toLocaleString('en-IN')}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${Math.round(x).toLocaleString('en-IN')}` },
            xAxis: { type: 'category', data: schedule.map((s) => s.dueDate), name: 'Due date' },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Cumulative due',
                type: 'bar',
                data: schedule.map((s) => Math.round(s.amountDue)),
                itemStyle: { color: '#1f7a5c' },
                label: { show: true, formatter: (p: { value: number }) => `${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'sif-sleeve-sizing',
    title: 'SIF Sleeve Sizing & Fee Decay',
    category: 'Alternatives',
    description: 'Size an equity long-short / SIF sleeve as a percentage of your corpus, apply its all-in fee, compare the net edge over a benchmark, and project the corpus with and without the sleeve. The decision test is "does the net edge beat the benchmark after fees?"',
    inputs: [
      { key: 'corpus', label: 'Investable corpus (Rs)', default: 1000000, min: 100000, step: 100000, hint: 'Total equity + debt corpus you are sizing the sleeve against. A SIF sleeve is a satellite, not the whole portfolio.' },
      { key: 'coreReturn', label: 'Core portfolio annual return (decimal)', default: 0.12, min: 0, step: 0.005, hint: 'Expected annual return on the rest of the portfolio (your SIP / index / debt core). Enter 0.12 for 12%.' },
      { key: 'sifGrossReturn', label: 'SIF expected gross annual return (decimal)', default: 0.14, min: 0, step: 0.005, hint: 'The gross return the SIF quotes, before its all-in fee. Long-short strategies track dispersion, not market direction.' },
      { key: 'sifFee', label: 'SIF all-in fee (decimal)', default: 0.0225, min: 0, step: 0.0025, hint: 'Management + distribution + performance. The SEBI SIF expense cap is about 2.25% management + about 2% marketing; use 0.0225 as a planning floor.' },
      { key: 'benchmarkReturn', label: 'Benchmark (index) annual return (decimal)', default: 0.11, min: 0, step: 0.005, hint: 'The market return you would earn by putting that same money into a plain index fund instead. The net edge is SIF-net minus this.' },
      { key: 'sleevePct', label: 'Sleeve as % of corpus (0-25)', default: 15, min: 0, max: 25, step: 1, hint: 'The naked-short-cap rule of thumb keeps a long-short sleeve under 25% of the book. Inputs above 25 are capped at 25.' },
      { key: 'years', label: 'Hold period (years)', default: 10, min: 1, step: 1, hint: 'How long the blended portfolio compounds at the blended net return.' },
    ],
    assumptions: [
      'Blended portfolio net return = sleeve% x SIF-net + (1 - sleeve%) x core return, compounded annually.',
      'SIF net return = SIF gross - all-in fee. The sleeve is "pays for itself" only when the SIF net return exceeds the benchmark return on the same money.',
      'Fee drag over the period is the difference between compounding the sleeve at gross vs at net. This is an expected-return decision aid, not a backtest.',
    ],
    limitations: [
      'Long-short returns come from pair selection and volatility, not market direction; a single "expected gross" number is a planning input, not a forecast.',
      'The 25% sleeve cap is a risk-of-concentration rule of thumb, not a regulatory limit - a manager may allow more, at your risk.',
      'Taxes on the sleeve are not modelled; a SIF is not a mutual fund, so check the tax landing place before acting.',
    ],
    compute: (v) => {
      const r = sifSleeveSizing({
        corpus: v.corpus,
        coreReturn: v.coreReturn,
        sifGrossReturn: v.sifGrossReturn,
        sifFee: v.sifFee,
        benchmarkReturn: v.benchmarkReturn,
        sleevePct: v.sleevePct / 100,
        years: v.years,
      });
      return {
        results: [
          {
            label: 'SIF net return (after fee)',
            value: (r.sifNetReturn * 100).toFixed(1) + '%',
            kind: 'text',
            note: `Gross ${(v.sifGrossReturn * 100).toFixed(1)}% - ${(v.sifFee * 100).toFixed(1)}% all-in fee`,
          },
          {
            label: 'Net edge vs benchmark',
            value: ((r.netEdgeVsBenchmark) * 100).toFixed(1) + ' bps -> ' + Math.round(r.netEdgeVsBenchmark * 10000) + ' bps',
            kind: 'text',
            note: r.paysForItself
              ? 'Positive - the SIF beats a plain index after its fee, so the sleeve earns its place'
              : 'Negative - a plain index would beat this SIF after its fee; the sleeve does not pay for itself',
          },
          {
            label: 'Effective sleeve (capped at 25%)',
            value: Math.round(r.effectiveSleevePct * 100) + '%',
            kind: 'text',
            note: r.sleevePct > 0.25 ? 'Your requested sleeve was above the 25% cap and was reduced' : 'Within the naked-short-cap rule of thumb',
          },
          {
            label: 'Fee drag over the period',
            value: Math.round(r.feeDragOverPeriod),
            kind: 'inr',
            note: 'Value lost to compounding the sleeve at net vs gross over ' + v.years + ' years',
          },
          {
            label: 'Corpus with sleeve',
            value: Math.round(r.corpusWithSleeve),
            kind: 'inr',
            note: 'All-core corpus = Rs ' + Math.round(r.corpusAllCore).toLocaleString('en-IN'),
          },
          {
            label: 'Extra value from the sleeve',
            value: Math.round(r.deltaOverPeriod),
            kind: 'inr',
            note: r.deltaOverPeriod >= 0 ? 'The sleeve adds this over all-core after its fee' : 'The sleeve subtracts this over all-core after its fee',
          },
        ],
        chart: {
          title: r.paysForItself ? 'Sleeve pays for itself: projected corpus' : 'Sleeve does not beat the index after its fee',
          alt: `Projected corpus after ${v.years} years: Rs ${Math.round(r.corpusWithSleeve).toLocaleString('en-IN')} with a ${Math.round(r.effectiveSleevePct * 100)}% SIF sleeve vs Rs ${Math.round(r.corpusAllCore).toLocaleString('en-IN')} all-core; delta Rs ${Math.round(r.deltaOverPeriod).toLocaleString('en-IN')}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${Math.round(x).toLocaleString('en-IN')}` },
            xAxis: { type: 'category', data: ['All-core', 'With SIF sleeve'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Projected corpus',
                type: 'bar',
                data: [Math.round(r.corpusAllCore), Math.round(r.corpusWithSleeve)],
                itemStyle: { color: r.paysForItself ? '#1f7a5c' : '#b45309' },
                label: { show: true, formatter: (p: { value: number }) => `${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'reit-invit-timing',
    title: 'REIT / InvIT Timing & Total-Return Optimizer',
    category: 'Real Estate',
    description: 'Decide when to sell REIT/InvIT units: the 12-month long-term clock, the NAV premium/discount drag on your effective yield, the distribution after tax, and a now-vs-forward exit comparison including the shared 1.25L equity LTCG pool.',
    inputs: [
      { key: 'units', label: 'Units held', default: 5000, min: 1, step: 100, hint: 'Number of REIT/InvIT units you own.' },
      { key: 'costPerUnit', label: 'Average cost per unit (Rs)', default: 400, min: 1, step: 1, hint: 'Your acquisition price per unit. This is what the 12-month long-term clock and the premium/discount are measured against.' },
      { key: 'currentPrice', label: 'Current market price per unit (Rs)', default: 420, min: 1, step: 1, hint: 'Today NAV-trading price per unit. A price above NAV is a premium that drags your yield; below NAV is a discount that lifts it.' },
      { key: 'navPerUnit', label: 'NAV per unit (Rs)', default: 405, min: 1, step: 1, hint: 'The trust NAV. Premium/discount is the gap between the market price and NAV.' },
      { key: 'annualDistPerUnit', label: 'Annual distribution per unit (Rs)', default: 30, min: 0, step: 1, hint: 'Expected annual distribution per unit. Most components are slab-taxed, so the after-tax figure matters for your income.' },
      { key: 'monthsHeld', label: 'Months held (current)', default: 14, min: 0, step: 1, hint: '12 months or more qualifies for 12.5% long-term CG; under 12 months the gain is 20% short-term CG.' },
      { key: 'forwardYears', label: 'Hold forward (years)', default: 3, min: 0, step: 1, hint: 'Project the market value forward this many years at the NAV growth rate to test a later sale. 0 means compare only a sale now.' },
      { key: 'navGrowthRate', label: 'Expected annual NAV growth (decimal)', default: 0.08, min: 0, step: 0.005, hint: 'The expected annual appreciation of the trust NAV. Enter 0.08 for 8%.' },
      { key: 'marginalTaxRate', label: 'Your marginal slab rate (decimal)', default: 0.3, min: 0, max: 0.4, step: 0.05, hint: 'Used to after-tax the distribution income. Enter 0.3 for the 30% slab (plus cess, use 0.315).' },
      { key: 'sharedLtcgPool', label: 'Remaining shared 1.25L equity-LTCG pool (Rs)', default: 125000, min: 0, step: 10000, hint: 'The 1.25L long-term equity CG exemption shared with shares and equity funds. A forward sale may land in a fresh pool, so treat that figure as a heuristic.' },
    ],
    assumptions: [
      'Total return = distribution + NAV appreciation + change in the NAV premium/discount; the premium on entry drags your effective yield.',
      'Long-term CG (held 12+ months) is 12.5% above the shared 1.25L equity pool (Section 112A, which expressly covers business-trust units); short-term is 20% (Section 111A).',
      'Distribution income is after-taxed at your marginal slab rate (most REIT/InvIT payout components are slab-taxed under the 115UA pass-through).',
    ],
    limitations: [
      'The forward sale may land in a different assessment year with a fresh 1.25L pool, so the forward figure is a heuristic, not a guarantee.',
      'Distribution components (interest / dividend / rental) are taxed separately; a pure exempt-dividend payout would raise the after-tax income toward gross.',
      'This models price vs NAV timing; it does not model a forced-liquidation or a NAV discount closing, which changes the realized gain.',
    ],
    compute: (v) => {
      const r = businessTrustTiming({
        units: v.units,
        costPerUnit: v.costPerUnit,
        currentPrice: v.currentPrice,
        navPerUnit: v.navPerUnit,
        annualDistPerUnit: v.annualDistPerUnit,
        monthsHeld: v.monthsHeld,
        forwardYears: v.forwardYears,
        navGrowthRate: v.navGrowthRate,
        marginalTaxRate: v.marginalTaxRate,
        sharedLtcgPool: v.sharedLtcgPool,
      });
      const sign = (x: number) => (x >= 0 ? '+' : '');
      return {
        results: [
          {
            label: 'NAV premium / (discount)',
            value: sign(r.premiumDiscountPct) + (r.premiumDiscountPct * 100).toFixed(1) + '%',
            kind: 'text',
            note: r.premiumDiscountPct >= 0
              ? `Price is above NAV - the premium drags your effective yield by ${Math.round(r.premiumYieldDrag * 10000)} bps`
              : `Price is below NAV - the discount lifts your effective yield`,
          },
          {
            label: 'Yield on price (effective)',
            value: (r.yieldOnPrice * 100).toFixed(2) + '%',
            kind: 'text',
            note: `Headline yield on cost is ${(r.headlineYield * 100).toFixed(2)}%`,
          },
          {
            label: 'After-tax distribution income',
            value: Math.round(r.afterTaxDistIncome),
            kind: 'inr',
            note: `Gross Rs ${Math.round(r.annualDistIncome).toLocaleString('en-IN')} after your ${(v.marginalTaxRate * 100).toFixed(0)}% slab`,
          },
          {
            label: 'LTCG-qualified now?',
            value: r.qualifiesLtcgNow ? 'Yes (12.5%)' : 'No (20% STCG)',
            kind: 'text',
            note: r.monthsHeld >= 12 ? `${v.monthsHeld} months held - long-term applies` : `${v.monthsHeld} months held - short-term rate applies`,
          },
          {
            label: 'After-tax proceeds if sold now',
            value: Math.round(r.afterTaxProceedsNow),
            kind: 'inr',
            note: `Gain Rs ${Math.round(r.gainIfSoldNow).toLocaleString('en-IN')} - tax Rs ${Math.round(r.taxIfSoldNow).toLocaleString('en-IN')}`,
          },
          {
            label: 'Better exit',
            value: r.betterChoice === 'now' ? 'Sell now' : 'Hold forward',
            kind: 'text',
            note:
              r.betterChoice === 'now'
                ? `Selling now beats the ${v.forwardYears}-yr forward exit on after-tax proceeds`
                : `The forward exit (projected Rs ${Math.round(r.projectedMarketValueForward).toLocaleString('en-IN')}) beats selling now on after-tax proceeds`,
          },
        ],
        chart: {
          title: `Now vs ${v.forwardYears}-yr forward after-tax proceeds`,
          alt: `After-tax proceeds: Rs ${Math.round(r.afterTaxProceedsNow).toLocaleString('en-IN')} if sold now vs Rs ${Math.round(r.afterTaxProceedsForward).toLocaleString('en-IN')} after ${v.forwardYears} years; the tool suggests ${r.betterChoice === 'now' ? 'selling now' : 'holding forward'}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${Math.round(x).toLocaleString('en-IN')}` },
            xAxis: { type: 'category', data: ['Sell now', `After ${v.forwardYears} yrs`] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'After-tax proceeds',
                type: 'bar',
                data: [Math.round(r.afterTaxProceedsNow), Math.round(r.afterTaxProceedsForward)],
                itemStyle: { color: '#1f7a5c' },
                label: { show: true, formatter: (p: { value: number }) => `${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'aif-waterfall',
    title: 'AIF 2/20 Waterfall & Carry (End-of-Fund)',
    category: 'Alternatives',
    description: 'Run a Category I/II AIF distribution waterfall on your committed capital: the 8% preferred-return hurdle, the 100% GP catch-up, the 80/20 split, the management-fee drag, and your net multiple and net IRR. Toggle the catch-up off to see the LP-friendlier variant.',
    inputs: [
      { key: 'committedCapital', label: 'Committed capital (Rs Cr)', default: 1, min: 0.01, step: 0.1, hint: 'Your ticket in crore rupees. Enter 1 for Rs 1 Cr. The same math scales linearly, so keep this small - the fee percentage is your biggest relative drag.' },
      { key: 'grossMultiple', label: 'Expected gross multiple (x)', default: 3, min: 0.1, step: 0.1, hint: 'Gross exit multiple on committed capital: 3x means the fund returns 3x what was committed. A fund that returns only 0.8x does not clear the hurdle and pays no carry.' },
      { key: 'years', label: 'Fund tenure (years)', default: 10, min: 1, step: 1, hint: 'Total life of the fund. The 8% preferred return compounds over this period.' },
      { key: 'hurdleRate', label: 'Preferred return / hurdle (decimal)', default: 0.08, min: 0, step: 0.005, hint: 'The minimum compounded IRR the LPs receive before any carry. Standard 0.08 (8%); institutional LPs push 0.09-0.10 on debt and infrastructure strategies.' },
      { key: 'carryPct', label: 'Carried interest % (decimal)', default: 0.2, min: 0, step: 0.01, hint: 'The GP share of profits above the hurdle. Standard 0.20; premium GPs sometimes take 0.25 on absolute-return strategies.' },
      { key: 'catchUp', label: 'GP catch-up', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - 100% catch-up (standard, GP-friendly)' }, { value: 0, label: 'No - straight 80/20 above hurdle (LP-friendly)' }], hint: 'With the catch-up on, the GP takes 100% of the profit between the hurdle and its proportional share. Without it, the split is 80/20 from the first rupee above the hurdle.' },
      { key: 'mgmtFeePct', label: 'Annual management fee (decimal)', default: 0.02, min: 0, step: 0.0025, hint: 'Annual fee on committed capital: standard 0.02 (2%). Junior GPs sometimes offer 0.015. The model charges fee x years on committed capital as cumulative drag.' },
    ],
    assumptions: [
      'End-of-fund (European-style) waterfall: capital back, then the compounded 8% preferred return, then the 100% GP catch-up, then 80/20 on the remainder.',
      'If the fund does not reach the hurdle, the LPs take the whole final value and the GP earns only the management fee.',
      'Management-fee drag is approximated as annual fee x years x committed capital; a real fund fees on committed during the investment period and on NAV/invested during harvest.',
    ],
    limitations: [
      'No clawback is modelled: in a real LPA, a fund that ends below the hurdle makes the GP return earlier carry, usually via a 20-30% escrow holdback.',
      'This is a decision aid for comparing fund terms (hurdle, catch-up, fee base), not a backtest; distribution timing and interim distributions change the actual cash flows.',
      'Carry taxation (and the 115UB pass-through vs fund-level tax of the category) is not modelled here - see the AIF taxation article for where that lands.',
    ],
    compute: (v) => {
      const r = aifWaterfall({
        committedCapital: v.committedCapital,
        grossMultiple: v.grossMultiple,
        years: v.years,
        hurdleRate: v.hurdleRate,
        carryPct: v.carryPct,
        catchUp: v.catchUp === 1,
        mgmtFeePct: v.mgmtFeePct,
      });
      const cr = (x: number) => Math.round(x * 100) / 100;
      return {
        results: [
          {
            label: 'LP net proceeds (after fee)',
            value: cr(r.lpNetProceeds),
            kind: 'number',
            note: `Rs Cr on Rs ${v.committedCapital} Cr committed - a ${r.lpNetMultiple.toFixed(2)}x net multiple`,
          },
          {
            label: 'LP net IRR',
            value: (r.lpNetIrr * 100).toFixed(2) + '%',
            kind: 'text',
            note: r.beatsHurdle
              ? 'Above the hurdle - the GP earns carry on this outcome'
              : 'Below the hurdle - GP earns only the management fee, no carry',
          },
          {
            label: 'GP total carry (before fees)',
            value: cr(r.gpCatchUpAmount + r.gpFinalSplit),
            kind: 'number',
            note: `Catch-up ${cr(r.gpCatchUpAmount)} Cr + final split ${cr(r.gpFinalSplit)} Cr`,
          },
          {
            label: 'Cumulative management-fee drag',
            value: cr(r.mgmtFeeDrag),
            kind: 'number',
            note: `${(v.mgmtFeePct * 100).toFixed(1)}%/yr x ${v.years} yrs on committed capital - this is why your ticket size matters`,
          },
          {
            label: 'GP share of gross profit',
            value: (r.gpShareOfProfit * 100).toFixed(1) + '%',
            kind: 'text',
            note: 'Carry only, excluding the management fee',
          },
        ],
        chart: {
          title: 'Where the money goes (Rs Cr)',
          alt: `Split of the gross final value ${cr(r.grossFinalValue)} Cr: LP net proceeds ${cr(r.lpNetProceeds)} Cr, GP carry ${cr(r.gpCatchUpAmount + r.gpFinalSplit)} Cr, management-fee drag ${cr(r.mgmtFeeDrag)} Cr, committed capital ${v.committedCapital} Cr.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${Math.round(x * 100) / 100} Cr` },
            yAxis: { type: 'category', data: ['LP net', 'GP carry', 'Mgmt fee drag'] },
            xAxis: { type: 'value', name: 'Rs Cr' },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: cr(r.lpNetProceeds), itemStyle: { color: '#1f7a5c' } },
                  { value: cr(r.gpCatchUpAmount + r.gpFinalSplit), itemStyle: { color: '#b45309' } },
                  { value: cr(r.mgmtFeeDrag), itemStyle: { color: '#64748b' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `${p.value} Cr` },
              },
            ],
            grid: { left: 110, right: 30, top: 30, bottom: 30 },
          },
        },
      };
    },
  },

  {
    id: 'regime-80c-shield',
    title: 'Old vs New Regime: the 80C + NPS Shield',
    category: 'Tax',
    description: 'Decide new vs old tax regime for FY 2026-27 with your 80C basket, the 50K NPS side-door (old-regime-only) and your employer NPS: it shows the tax under each regime, which wins, and the rupee value of each deduction bucket.',
    inputs: [
      { key: 'grossIncome', label: 'Gross annual income (Rs)', default: 1800000, min: 0, step: 100000, hint: 'Total gross income BEFORE the standard deduction and before any 80C/NPS deductions. Includes salary, rent, interest, and net capital gains.' },
      { key: 'eightyC', label: '80C basket invested (Rs)', default: 150000, min: 0, max: 150000, step: 10000, hint: 'ELSS + PPF + EPF + home-loan principal + NSC + LIC + own NPS under 80CCD(1). Capped at Rs 1,50,000. Available OLD regime only - in the new regime this whole basket does nothing.' },
      { key: 'npsSelf', label: 'Extra NPS self-contribution (Rs)', default: 50000, min: 0, max: 50000, step: 10000, hint: 'Section 80CCD(1B): up to Rs 50,000 on NPS Tier-1, over and above the 80C basket. OLD regime only (verified Wave 8 - a conflicting claim that it survives the new regime was resolved to old-regime-only).' },
      { key: 'npsEmployer', label: 'Employer NPS contribution (Rs)', default: 0, min: 0, step: 10000, hint: 'Section 80CCD(2): your employer NPS contribution (up to 14% of Basic+DA for all employers in the new regime). This is one of the few deductions that survives in BOTH regimes. Counts toward the Rs 7.5L employer EPF+NPS+superannuation exempt cap.' },
      { key: 'homeLoanInterest', label: 'Home-loan interest (Rs)', default: 0, min: 0, step: 10000, hint: 'Section 24(b): home-loan interest paid in the year, up to the Rs 2,00,000 cap. OLD regime only - in the new regime this deduction is gone. This is usually what tips the decision to the old regime for a home-loan holder.' },
      { key: 'healthInsurance', label: 'Health insurance (Rs)', default: 0, min: 0, step: 10000, hint: 'Section 80D: your own premium + family + parents, up to Rs 1,00,000. OLD regime only. Note the 80D cap is the premium, not the tax it saves.' },
      { key: 'salaried', label: 'Salaried taxpayer', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - standard deduction applies (75,000 new / 50,000 old)' }, { value: 0, label: 'No - self-employed, no standard deduction' }], hint: 'The standard deduction is 75,000 in the new regime and 50,000 in the old regime for salaried taxpayers; self-employed taxpayers get neither.' },
    ],
    assumptions: [
      'FY 2026-27 slabs: new regime nil to 4L, 5% to 8L, 10% to 12L, 15% to 16L, 20% to 20L, 25% to 24L, 30% above, with the 87A rebate keeping income up to 12L tax-free; old regime nil to 2.5L, 5% to 5L, 20% to 10L, 30% above, 87A rebate to 5L.',
      '80C and 80CCD(1B) are old-regime-only; 80CCD(2) employer NPS works in both regimes.',
      'Surcharge and 4% cess are NOT modelled - above Rs 50L of income the comparison should be redone with them added (10% surcharge from 50L).',
    ],
    limitations: [
      'The "value" of each bucket is the old-regime tax it actually saves at your marginal position - a 5% slab earns only 5% back on 80C, not 30%.',
      'Home-loan principal inside 80C must be from an eligible, documented loan; the calculator takes your total basket as one number.',
      'Employer NPS above the Rs 7.5L combined EPF+NPS+superannuation cap is taxable as a perquisite - keep it inside the cap.',
    ],
    compute: (v) => {
      const r = deductionShieldFY27({
        grossIncome: v.grossIncome,
        eightyC: v.eightyC,
        npsSelf: v.npsSelf,
        npsEmployer: v.npsEmployer,
        homeLoanInterest: v.homeLoanInterest,
        healthInsurance: v.healthInsurance,
        salaried: v.salaried === 1,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      return {
        results: [
          {
            label: 'New-regime tax',
            value: inr(r.newRegimeTax),
            kind: 'inr',
            note: `On taxable Rs ${inr(r.newRegimeTaxable)}`,
          },
          {
            label: 'Old-regime tax',
            value: inr(r.oldRegimeTax),
            kind: 'inr',
            note: `On taxable Rs ${inr(r.oldRegimeTaxable)}`,
          },
          {
            label: 'Winner',
            value: r.winRegime === 'old' ? 'Old regime' : r.winRegime === 'new' ? 'New regime' : 'Tie',
            kind: 'text',
            note:
              r.winRegime === 'old'
                ? `Old regime saves Rs ${inr(r.savingsByOld)} more - your deductions beat the lower slabs`
                : r.winRegime === 'new'
                  ? `New regime saves Rs ${inr(Math.abs(r.savingsByOld))} more - the lower slabs beat your deductions`
                  : 'Both regimes give the same tax at these numbers',
          },
          {
            label: '80C basket value',
            value: inr(r.eightyCValue),
            kind: 'inr',
            note: `Rs ${inr(v.eightyC)} of basket saves this much at your old-regime marginal rate - zero in the new regime`,
          },
          {
            label: 'NPS side-door value (80CCD(1B))',
            value: inr(r.npsSelfValue),
            kind: 'inr',
            note: 'Old-regime-only; zero value under the new regime',
          },
          {
            label: 'Home-loan interest value (24b)',
            value: inr(r.homeLoanInterestValue),
            kind: 'inr',
            note: 'Old-regime-only; usually the deduction that tips the decision for home-loan holders',
          },
          {
            label: 'Health insurance value (80D)',
            value: inr(r.healthInsuranceValue),
            kind: 'inr',
            note: 'Old-regime-only',
          },
          {
            label: 'Employer NPS value (80CCD(2))',
            value: inr(r.npsEmployerValue),
            kind: 'inr',
            note: 'Works in BOTH regimes - the most valuable deduction for new-regime filers',
          },
        ],
        chart: {
          title: 'Tax under each regime (Rs)',
          alt: `Tax comparison: new regime Rs ${inr(r.newRegimeTax)} vs old regime Rs ${inr(r.oldRegimeTax)}; the ${r.winRegime === 'old' ? 'old regime' : r.winRegime === 'new' ? 'new regime' : 'two'} wins by Rs ${inr(Math.abs(r.savingsByOld))}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['New regime', 'Old regime'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Tax',
                type: 'bar',
                data: [
                  { value: Math.round(r.newRegimeTax), itemStyle: { color: r.winRegime === 'new' ? '#1f7a5c' : '#b45309' } },
                  { value: Math.round(r.oldRegimeTax), itemStyle: { color: r.winRegime === 'old' ? '#1f7a5c' : '#b45309' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'pms-sif-aif-tax-wedge',
    title: 'PMS / SIF / AIF After-Tax Return Wedge',
    category: 'Alternatives',
    description: 'Compare what an equal gross return actually leaves you across an index fund, a PMS, a SIF, a Category I/II AIF (unlisted pass-through at your slab), and a Category III AIF (fund-level tax): the gross final value, the fee drag, the tax rate applied, and your annualized after-tax CAGR.',
    inputs: [
      { key: 'grossAnnualReturn', label: 'Gross annual return (decimal)', default: 0.14, min: 0, step: 0.01, hint: 'The gross return the product quotes, before fees and tax. Use the same number for every product to see the wedge.' },
      { key: 'years', label: 'Hold period (years)', default: 10, min: 1, step: 1, hint: 'The horizon over which the gross return compounds before the one-time exit tax.' },
      { key: 'product', label: 'Product', default: 0, min: 0, max: 5, step: 1, type: 'select', options: [
        { value: 0, label: 'Index fund / listed equity (112A 12.5%)' },
        { value: 1, label: 'PMS (listed, 112A 12.5% + fees)' },
        { value: 2, label: 'SIF (112A 12.5% + all-in fee)' },
        { value: 3, label: 'AIF Cat I/II unlisted (pass-through at your slab)' },
        { value: 4, label: 'AIF Cat III (fund-level ~42.7%, net of tax)' },
      ], hint: 'The tax landing place differs by product: listed equity-type products get the 12.5% 112A rate; an unlisted private-market AIF passes the gain through at your marginal slab; a Cat III fund is taxed at the fund level and you receive it net.' },
      { key: 'marginalSlabRate', label: 'Your marginal slab rate (decimal)', default: 0.3, min: 0, max: 0.4, step: 0.05, hint: 'Only used by the unlisted Cat I/II AIF, which taxes the pass-through gain at your slab. Enter 0.3 for the 30% slab (0.315 with cess).' },
      { key: 'mgmtFee', label: 'Annual management fee (decimal)', default: 0, min: 0, step: 0.0025, hint: 'Per-year fee on the corpus: 0.02 is 2%/yr (PMS/AIF standard), 0.0025-0.01 for most index/SIF plans. Compounds over the hold.' },
      { key: 'perfFee', label: 'Performance fee on the gain (decimal)', default: 0, min: 0, step: 0.01, hint: 'Fraction of the total gain taken once at exit: 0.15-0.20 is the AIF/PMS carry range (a real waterfall has a hurdle the calculator does not model - use the AIF Waterfall tool for that).' },
    ],
    assumptions: [
      'End-of-horizon tax: one exit tax on the total gain at the product-specific rate; no interim distributions.',
      'Equity-type products (index, PMS, SIF) apply the 112A long-term rate of 12.5%; the shared Rs 1.25L annual pool is zero here because one exit after years >> 1 uses a single-year pool.',
      'Unlisted Cat I/II pass-through gain is taxed at your marginal slab (no indexation, no pool); Cat III applies the ~42.7% fund-level rate so the investor receives the gain net of it.',
      'The performance fee is a flat fraction of the gain with no hurdle or catch-up - a simplification; the AIF Waterfall calculator models the full 2/20 ladder.',
    ],
    limitations: [
      'This is an exit-time approximation to compare products at equal gross; it does not model the 194LBB 10% TDS cash-flow timing that Cat I/II AIFs credit you, which is why the advance-tax clocks still matter.',
      'Surcharge above Rs 50L on a slab-tax gain is not modelled; at very high incomes the unlisted wedge is even wider than shown.',
      'A real Cat III trust deed and tax note can change the effective fund-level rate - read the specific fund tax note before acting.',
    ],
    compute: (v) => {
      const productKeys = ['index', 'pms', 'sif', 'aifCat12', 'aifCat3'] as const;
      const r = afterTaxProductWedge({
        grossAnnualReturn: v.grossAnnualReturn,
        years: v.years,
        product: productKeys[v.product],
        marginalSlabRate: v.marginalSlabRate,
        sharedLtcgPool: 0,
        mgmtFee: v.mgmtFee,
        perfFee: v.perfFee,
      });
      const p2 = (x: number) => (x * 100).toFixed(2) + '%';
      return {
        results: [
          {
            label: 'Gross final value (per Rs 1)',
            value: r.grossFinalValue.toFixed(3),
            kind: 'number',
            note: `Gross CAGR ${p2(r.cagrGross)}`,
          },
          {
            label: 'Tax rate applied',
            value: p2(r.taxRateApplied),
            kind: 'text',
            note: v.product === 3 ? 'Your slab on the unlisted pass-through gain' : v.product === 4 ? 'Fund-level rate (incl. surcharge), you receive net' : '112A long-term equity rate',
          },
          {
            label: 'After-tax final value (per Rs 1)',
            value: r.afterTaxFinalValue.toFixed(3),
            kind: 'number',
            note: `After-tax CAGR ${p2(r.cagrAfterTax)} - the number that actually compounds in your pocket`,
          },
          {
            label: 'Total wedge (fee + tax)',
            value: p2(r.totalWedgePct),
            kind: 'text',
            note: `Fee drag ${r.feeDrag.toFixed(3)} + tax paid ${r.taxPaid.toFixed(3)} on a gross gain of ${(r.grossFinalValue - 1).toFixed(3)}`,
          },
        ],
        chart: {
          title: 'After-tax CAGR vs gross CAGR',
          alt: `After-tax CAGR ${p2(r.cagrAfterTax)} vs gross ${p2(r.cagrGross)}; the total wedge is ${p2(r.totalWedgePct)} across the ${v.years}-year hold.`,
          option: {
            tooltip: { valueFormatter: (x: number) => p2(x / 100) },
            xAxis: { type: 'category', data: ['Gross CAGR', 'After-tax CAGR'] },
            yAxis: { type: 'value', name: '%', axisLabel: { formatter: (x: number) => `${Math.round(x)}%` } },
            series: [
              {
                name: 'CAGR',
                type: 'bar',
                data: [
                  { value: r.cagrGross * 100, itemStyle: { color: '#64748b' } },
                  { value: r.cagrAfterTax * 100, itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `${p.value.toFixed(1)}%` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'high-income-regime',
    title: 'High-Income Tax: Surcharge, Cess & Regime (above ₹50L)',
    category: 'Tax',
    description: 'The full FY 2026-27 tax bill for incomes above ₹50L: slab tax + surcharge (the new-regime 25% cap vs the old regime’s 37% above ₹5Cr), the 15% equity-surcharge cap, marginal relief, and the 4% health & education cess. Compares both regimes end to end and shows who wins.',
    inputs: [
      { key: 'nonEquityIncome', label: 'Slab income before deductions (Rs)', default: 3000000, min: 0, step: 100000, hint: 'Salary + rent + interest + unlisted gains + other slab income, BEFORE the standard deduction and before any 80C/NPS/home-loan deductions. Equity gains go in the separate equity boxes below.' },
      { key: 'equityLtcg', label: 'Listed-equity long-term capital gains (Rs)', default: 0, min: 0, step: 100000, hint: 'LTCG on listed shares / equity MFs / REIT-InvIT units (12-month hold): 12.5% above the shared Rs 1.25L annual pool, surcharge-capped at 15%.' },
      { key: 'equityStcg', label: 'Listed-equity short-term capital gains (Rs)', default: 0, min: 0, step: 100000, hint: 'STCG under 12 months (Sec 111A): 20%, surcharge-capped at 15%.' },
      { key: 'eightyC', label: '80C basket (Rs, old regime only)', default: 0, min: 0, max: 150000, step: 10000, hint: 'Up to Rs 1,50,000. Old regime only - in the new regime this bucket does nothing.' },
      { key: 'npsSelf', label: 'NPS self 80CCD(1B) (Rs, old regime only)', default: 0, min: 0, max: 50000, step: 10000, hint: 'Up to Rs 50,000, old regime only (verified Wave 8: the conflicting new-regime claim was resolved to old-only).' },
      { key: 'healthInsurance', label: 'Health insurance 80D (Rs, old regime only)', default: 0, min: 0, max: 100000, step: 10000, hint: 'Up to Rs 1,00,000, old regime only.' },
      { key: 'homeLoanInterest', label: 'Home-loan interest 24(b) (Rs, old regime only)', default: 0, min: 0, max: 200000, step: 10000, hint: 'Up to Rs 2,00,000, old regime only - the single biggest old-regime lever for a home-loan holder.' },
      { key: 'npsEmployer', label: 'Employer NPS 80CCD(2) (Rs, both regimes)', default: 0, min: 0, step: 10000, hint: 'Your employer NPS contribution; one of the few deductions that survives in BOTH regimes. Counts toward the Rs 7.5L employer EPF+NPS+superannuation cap.' },
      { key: 'salaried', label: 'Salaried taxpayer', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - standard deduction 75,000 (new) / 50,000 (old)' }, { value: 0, label: 'No - self-employed, no standard deduction' }], hint: 'The standard deduction is 75,000 in the new regime and 50,000 in the old for salaried taxpayers; self-employed gets neither.' },
    ],
    assumptions: [
      'FY 2026-27 (Income-tax Act, 2025, effective 1 Apr 2026): new-regime surcharge 10% (50L-1Cr) / 15% (1Cr-2Cr) / 25% capped above 2Cr - the 37% top rate was abolished for the new regime; old regime keeps 37% above 5Cr.',
      'The 15% equity-surcharge cap limits the surcharge on tax arising from listed-equity 111A/112A gains; the band rate applies to the rest of the tax.',
      '4% health & education cess is charged on (base tax + surcharge after marginal relief). Marginal relief caps the incremental tax + surcharge above each boundary at the incremental income (the boundary itself is priced at its own band).',
      'The shared 112A equity-LTCG annual pool defaults to Rs 1.25L and applies to the equity-LTCG input only.',
    ],
    limitations: [
      'Marginal relief here prices the boundary at its own lower band and compares pre-cess totals - a close, documented approximation; the ITR utility is the authority for the exact figure at each boundary.',
      'Unlisted-equity gains (slab-taxed) belong in "slab income", not the equity boxes - the equity boxes are for listed-equity STCG/LTCG that get the 15% surcharge cap.',
      'Surcharge thresholds run on total income; this model approximates the standard-deduction and old-regime-deduction interaction by applying deductions to the slab-income leg only.',
    ],
    compute: (v) => {
      const r = highIncomeTaxFY27({
        nonEquityIncome: v.nonEquityIncome,
        equityLtcg: v.equityLtcg,
        equityStcg: v.equityStcg,
        eightyC: v.eightyC,
        npsSelf: v.npsSelf,
        healthInsurance: v.healthInsurance,
        homeLoanInterest: v.homeLoanInterest,
        npsEmployer: v.npsEmployer,
        salaried: v.salaried === 1,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      const pct = (x: number) => (x * 100).toFixed(1) + '%';
      return {
        results: [
          {
            label: 'New-regime total (tax + surcharge + cess)',
            value: inr(r.new.total),
            kind: 'inr',
            note: `Effective rate ${pct(r.new.effectiveRate)}; surcharge band ${pct(r.new.surchargeRate)}${r.new.marginalRelief > 0 ? `; marginal relief ${inr(r.new.marginalRelief)}` : ''}`,
          },
          {
            label: 'Old-regime total (tax + surcharge + cess)',
            value: inr(r.old.total),
            kind: 'inr',
            note: `Effective rate ${pct(r.old.effectiveRate)}; surcharge band ${pct(r.old.surchargeRate)}${r.old.marginalRelief > 0 ? `; marginal relief ${inr(r.old.marginalRelief)}` : ''}`,
          },
          {
            label: 'Regime winner',
            value: r.winner === 'old' ? 'Old regime' : r.winner === 'new' ? 'New regime' : 'Tie',
            kind: 'text',
            note:
              r.winner === 'old'
                ? `Old regime saves ${inr(r.savingsByOld)} more at these numbers`
                : r.winner === 'new'
                  ? `New regime saves ${inr(Math.abs(r.savingsByOld))} more - above 5Cr the 25% cap beats the old 37%`
                  : 'Both regimes give the same total at these numbers',
          },
          {
            label: 'New-regime cess',
            value: inr(r.new.cess),
            kind: 'inr',
            note: '4% on (base tax + surcharge after relief)',
          },
          {
            label: 'Old-regime cess',
            value: inr(r.old.cess),
            kind: 'inr',
            note: '4% on (base tax + surcharge after relief)',
          },
        ],
        chart: {
          title: 'Total tax bill under each regime (Rs)',
          alt: `Total tax + surcharge + cess: new regime Rs ${inr(r.new.total)} vs old regime Rs ${inr(r.old.total)}; the ${r.winner === 'old' ? 'old' : 'new'} regime is cheaper by ${inr(Math.abs(r.savingsByOld))}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['New regime', 'Old regime'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Total bill',
                type: 'bar',
                data: [
                  { value: Math.round(r.new.total), itemStyle: { color: r.winner === 'new' ? '#1f7a5c' : '#b45309' } },
                  { value: Math.round(r.old.total), itemStyle: { color: r.winner === 'old' ? '#1f7a5c' : '#b45309' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'huf-income-split',
    title: 'HUF Income Split: Second Slab & Advance-Tax Streams',
    category: 'Tax',
    description: 'Compare one high-slab individual against the same income split between that individual and a HUF (each its own assessable person on its own slabs and surcharge), and see the annual saving, the effective rates, and the two separate advance-tax streams the split creates.',
    inputs: [
      { key: 'individualIncome', label: 'Individual income (Rs)', default: 3000000, min: 0, step: 100000, hint: 'The slab income currently (or hypothetically) in the individual\'s hands: salary, rent, interest, unlisted gains, etc.' },
      { key: 'hufIncome', label: 'Income that may sit in the HUF (Rs)', default: 500000, min: 0, step: 100000, hint: 'Income LEGALLY eligible for the HUF: coparcenary property income, HUF-sourced rental/interest, gifts from non-member relatives. NOT self-acquired property you gift to the HUF (that is clubbed back - Sec 64(2) / 99(3)-(4) of the 2025 Act) and NOT your spouse\'s income.' },
      { key: 'regime', label: 'Regime (both parties)', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'New regime' }, { value: 1, label: 'Old regime' }], hint: 'The HUF is a separate assessable person that can pick its own regime; in practice both are usually run the same way.' },
      { key: 'eightyC', label: '80C basket on the individual leg (Rs, old regime only)', default: 0, min: 0, max: 150000, step: 10000, hint: 'The HUF itself can also claim 80C/80D as an entity in the old regime - not modelled here; the saving is larger in the old regime than this baseline shows.' },
      { key: 'healthInsurance', label: '80D on the individual leg (Rs, old regime only)', default: 0, min: 0, max: 100000, step: 10000, hint: 'Health insurance premium, old regime only.' },
      { key: 'homeLoanInterest', label: 'Home-loan interest 24(b) on the individual leg (Rs, old regime only)', default: 0, min: 0, max: 200000, step: 10000, hint: 'Old regime only; the HUF leg could carry a separate home loan, not modelled.' },
    ],
    assumptions: [
      'Solo vs split is computed on the SAME total income: solo = one PAN at that total; split = two PANs, each run through the full slab + 112A/111A + surcharge + marginal relief + 4% cess model (highIncomeTaxFY27).',
      'The HUF is a separate assessable person with its own slabs, 87A, surcharge and - crucially - its own advance-tax duty (Sec 207 / Sec 404 of the Act 2025).',
      'Old-regime 80C/80D/24(b) inputs apply to the individual leg only; a HUF can claim its own entity-level buckets in the old regime, which the model does not double-count.',
      'No TDS is modelled (neither leg is salary): the advance-tax figures are the full liability on each leg.',
    ],
    limitations: [
      'This is a planning aid, not a legality check: the article covers WHICH income may legally sit in the HUF (coparcenary income, HUF gifts; not self-acquired conversion under 64(2), not spouse income under 64(1)(iv), not minor income under 64(1A)).',
      'A husband-wife-only pair is not a valid HUF; a HUF needs at least the father + son (or existing coparceners).',
      'The HUF must file its own ITR (ITR-2/ITR-3) and pay its own advance tax; the 234B/234C clocks run per PAN.',
    ],
    compute: (v) => {
      const r = hufIncomeSplitFY27({
        individualIncome: v.individualIncome,
        hufIncome: v.hufIncome,
        regime: v.regime === 1 ? 'old' : 'new',
        eightyC: v.eightyC,
        healthInsurance: v.healthInsurance,
        homeLoanInterest: v.homeLoanInterest,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      const pct = (x: number) => (x * 100).toFixed(1) + '%';
      return {
        results: [
          {
            label: 'Solo (one PAN) total bill',
            value: inr(r.soloBill),
            kind: 'inr',
            note: `Effective ${pct(r.soloEffectiveRate)} on ${inr(r.totalIncome)} total income`,
          },
          {
            label: 'Split (individual + HUF) total bill',
            value: inr(r.splitBill),
            kind: 'inr',
            note: `Individual ${inr(r.individualBill)} + HUF ${inr(r.hufBill)}; effective ${pct(r.splitEffectiveRate)}`,
          },
          {
            label: 'Annual saving from the split',
            value: inr(r.annualSaving),
            kind: 'inr',
            note: r.annualSaving > 0 ? 'The second slab is worth this much - before the HUF\'s own 80C/80D buckets in the old regime' : 'No saving at these numbers; the split is not worth it here',
          },
          {
            label: 'HUF advance-tax stream',
            value: r.hufNeedsAdvanceTax ? inr(r.hufAdvanceTaxDue) : 'Nil',
            kind: 'inr',
            note: r.hufNeedsAdvanceTax ? 'The HUF owes its OWN advance tax on its own leg - a second 234B/234C clock runs on the HUF PAN' : 'HUF income is below the 10,000 advance-tax threshold on its own',
          },
          {
            label: 'Individual advance-tax stream',
            value: r.individualNeedsAdvanceTax ? inr(r.individualAdvanceTaxDue) : 'Nil',
            kind: 'inr',
            note: r.individualNeedsAdvanceTax ? 'The individual\'s own advance-tax duty on its leg' : 'Below the 10,000 threshold on the individual leg',
          },
        ],
        chart: {
          title: 'Total tax bill: solo vs split (Rs)',
          alt: `Solo bill Rs ${inr(r.soloBill)} vs split bill Rs ${inr(r.splitBill)}; the HUF second-slab split saves Rs ${inr(r.annualSaving)} a year.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['Solo (1 PAN)', 'Split (2 PANs)'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Total bill',
                type: 'bar',
                data: [
                  { value: Math.round(r.soloBill), itemStyle: { color: '#b45309' } },
                  { value: Math.round(r.splitBill), itemStyle: { color: r.annualSaving > 0 ? '#1f7a5c' : '#b45309' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'nps-retirement-exit',
    title: 'NPS Retirement Exit: Corpus, 80/20 Split & After-Tax Position',
    category: 'Retirement',
    description: 'Run your NPS Tier-1 corpus through the PFRDA 16-Dec-2025 exit rules: the 80/20 lump-sum-to-annuity split (or the Rs 8L small-corpus 100% rule, or the 20/80 premature-exit split), the Section 10(10A) 60%-of-contributions exemption cap, and the after-tax value of the lump sum plus annuity income at your marginal slab.',
    inputs: [
      { key: 'monthlyContribution', label: 'Monthly NPS self-contribution (Rs)', default: 20000, min: 0, step: 1000, hint: 'Your monthly Tier-1 contribution. 80CCD(1) within the 80C basket and the 80CCD(1B) Rs 50,000 old-regime deduction both sit on this number - use the 80C-baskets article for the tax side.' },
      { key: 'employerPct', label: 'Employer NPS as % of your contribution', default: 0, min: 0, max: 1, step: 0.05, hint: 'The 80CCD(2) employer contribution is up to 14% of Basic+DA in the new regime. Enter it as a fraction of your own monthly contribution (e.g. 0.1 for 10%). It is one of the few deductions that survives the new regime.' },
      { key: 'annualReturn', label: 'Expected annual NPS return (decimal)', default: 0.09, min: 0, step: 0.005, hint: 'NPS equity/G/C blend - 9% is a reasonable long-run planning figure for a 60-70% equity mix; active-choice all-equity runs higher with more volatility.' },
      { key: 'years', label: 'Subscription years', default: 30, min: 1, step: 1, hint: 'From your first contribution to the exit at 60 (or earlier for a premature exit).' },
      { key: 'lumpSumPct', label: 'Lump-sum % at exit (0-100)', default: 80, min: 0, max: 100, step: 5, hint: 'PFRDA 16 Dec 2025: normal exit is up to 80% lump sum / min 20% annuity. The 60%-cap on the 10(10A) exemption means any lump sum above 60% of your total contributions is taxed at your slab - see the result below.' },
      { key: 'annuityRate', label: 'Annuity annual rate (decimal)', default: 0.065, min: 0, max: 0.1, step: 0.005, hint: 'PFRDA-empanelled ASP life-annuity rates run roughly 6-7% at age 60; joint-life and return-of-purchase variants are lower. Older purchase = higher rate.' },
      { key: 'marginalTaxRate', label: 'Your marginal slab rate at exit (decimal)', default: 0.3, min: 0, max: 0.4, step: 0.05, hint: 'Applies to the taxable lump-sum portion (above the 60% cap) and to the annuity income. A 30% slab = 0.30 (use 0.315 with cess).' },
      { key: 'prematureExit', label: 'Premature exit (before 60)?', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'No - normal exit at 60 (80/20)' }, { value: 1, label: 'Yes - premature exit (20% lump, 80% annuity)' }], hint: 'A premature exit forces the tighter 20/80 split regardless of the lump-sum input; the small-corpus Rs 8L 100% rule still applies if your corpus is at or below it.' },
    ],
    assumptions: [
      'PFRDA Exits and Withdrawals (Amendment) Regulations, 16 Dec 2025: non-government subscriber - corpus <= Rs 8L is a 100% lump-sum exit; otherwise up to 80% lump sum with at least 20% into an annuity (deferred purchase allowed up to age 85); premature exit (< 60 after the lock-in) is 20% lump / 80% annuity.',
      'Section 10(10A)/10(i)(xii): the NPS lump sum is exempt only up to 60% of your TOTAL contributions (self + employer) - so an 80% lump sum on a corpus that has appreciated well past 1.33x your contributions is partly taxable.',
      'The annuity income is slab-taxed (EET on that leg); the annuity rate is a flat planning figure on the annuity corpus, not a guaranteed ASP quote.',
      'Corpus is a monthly SIP FV at a single annual rate - no regime-switch, no equity drawdown, no contribution ramp.',
    ],
    limitations: [
      'The 60% 10(10A) exemption cap and any new-regime annuity-income exemption should be confirmed with a CA for your exit year; the 16-Dec-2025 PFRDA amendment and the Income-tax Act 2025 renumbering are the authority on the current exit split.',
      'A premature exit before the lock-in period (5 yrs for non-govt, or 3 yrs if enrolled after 60) is not available at all - the 20/80 split applies only to a permitted premature exit.',
      'Government-subscriber exits follow service rules (a mandatory 40% annuity until the Dec-2025/2026 alignment) - this calculator models the non-government (All Citizen / Corporate) rules.',
    ],
    compute: (v) => {
      const r = npsRetirementExitFY27({
        monthlyContribution: v.monthlyContribution,
        employerPct: v.employerPct,
        annualReturn: v.annualReturn,
        years: v.years,
        smallCorpusThreshold: 800000,
        lumpSumPct: v.lumpSumPct / 100,
        annuityRate: v.annuityRate,
        marginalTaxRate: v.marginalTaxRate,
        prematureExit: v.prematureExit === 1,
      });
      const L = (x: number) => `${Math.round(x / 1e5).toLocaleString('en-IN')}`;
      return {
        results: [
          { label: 'Projected NPS corpus', value: L(r.corpus) + ' L', kind: 'text', note: `On total contributions of ${L(r.totalContributions)}L over ${v.years} yrs` },
          { label: 'Lump sum (after the 60% exemption cap)', value: L(r.lumpSum) + ' L', kind: 'text', note: r.isSmallCorpus ? 'Small corpus (<= Rs 8L) - 100% lump-sum exit' : `Exit split ${v.prematureExit === 1 ? '20/80 (premature)' : `${v.lumpSumPct}/${100 - v.lumpSumPct}`}` },
          { label: 'Exempt lump sum (60% of contributions)', value: L(r.exemptLumpSum) + ' L', kind: 'text', note: 'Sec 10(10A) caps the exemption at 60% of your total NPS contributions' },
          { label: 'Taxable lump-sum portion', value: L(r.taxableLumpSum) + ' L', kind: 'text', note: r.taxableLumpSum > 0 ? `This is taxed at your ${(v.marginalTaxRate * 100).toFixed(0)}% slab - the gap between an 80% exit and the 60% exemption cap` : 'None - your lump sum fits inside the 60% cap' },
          { label: 'Annuity corpus', value: L(r.annuityCorpus) + ' L', kind: 'text', note: `Buys a life annuity at ${(v.annuityRate * 100).toFixed(1)}%/yr` },
          { label: 'Annual annuity income (after tax)', value: L(r.afterTaxAnnuityIncome) + ' L', kind: 'text', note: `Gross ${L(r.annualAnnuityIncome)}L/yr, slab-taxed at ${(v.marginalTaxRate * 100).toFixed(0)}%` },
          { label: 'Total after-tax retirement value', value: L(r.totalAfterTax) + ' L', kind: 'text', note: 'Lump sum (net of the taxable portion) + annual after-tax annuity income - a single planning figure, not a corpus' },
        ],
        chart: {
          title: 'Where the NPS corpus goes at exit (Rs L)',
          alt: `Corpus ${L(r.corpus)}L: exempt lump sum ${L(r.exemptLumpSum)}L, taxable lump sum ${L(r.taxableLumpSum)}L, annuity corpus ${L(r.annuityCorpus)}L.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${L(x)}L` },
            xAxis: { type: 'category', data: ['Exempt lump', 'Taxable lump', 'Annuity corpus'] },
            yAxis: { type: 'value', name: 'Rs L', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Corpus split',
                type: 'bar',
                data: [
                  { value: Math.round(r.exemptLumpSum), itemStyle: { color: '#1f7a5c' } },
                  { value: Math.round(r.taxableLumpSum), itemStyle: { color: '#b45309' } },
                  { value: Math.round(r.annuityCorpus), itemStyle: { color: '#334155' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'pre-ipo-tax',
    title: 'Pre-IPO / Unlisted Equity Tax Outcome',
    category: 'Alternatives',
    description: 'Work out what a pre-IPO or unlisted-equity exit actually leaves in your pocket: the unlisted 24-month vs listed 12-month holding split, the 112 (no pool) vs 112A (shared pool) LTCG difference, and STCG at slab vs 20%, as the net return on your entry price.',
    inputs: [
      { key: 'costPerUnit', label: 'Cost per unit / share (Rs)', default: 1000, min: 0, step: 10, hint: 'Your acquisition price per share, including any transfer/registration cost you treat as part of cost. This is the base for your net-return figure.' },
      { key: 'units', label: 'Number of units / shares', default: 1000, min: 1, step: 10, hint: 'The lot you hold or plan to sell. Pre-IPO lots are often small - a thin lot is where the dealer spread hides.' },
      { key: 'salePricePerUnit', label: 'Expected sale price per unit (Rs)', default: 2000, min: 0, step: 10, hint: 'The price you expect to settle at. For a pre-IPO name, judge it against the price six months after listing, not the listing pop - you are locked out under ICDR Reg 17 for that window.' },
      { key: 'monthsHeld', label: 'Months held at sale', default: 30, min: 0, step: 1, hint: 'From your acquisition transfer to the sale. Unlisted: > 24 months is long-term. Listed (sold on the exchange, STT paid): > 12 months is long-term. The clock starts at your transfer, not at listing.' },
      { key: 'isListedAtSale', label: 'Is the share listed on the exchange at the time you sell?', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'No - still unlisted (off-market / private sale)' }, { value: 1, label: 'Yes - sold on NSE/BSE (STT paid)' }], hint: 'This switches the holding test: unlisted uses the 24-month Sec 112 rule; a listed exchange sale uses the 12-month 111A/112A rule. If you hold through the IPO and sell after listing, pick "Yes".' },
      { key: 'sharedLtcgPool', label: 'Remaining shared Rs 1.25L 112A pool this year (Rs)', default: 0, min: 0, step: 25000, hint: 'Only relevant to a LISTED long-term sale: the Rs 1.25L annual equity-LTCG exemption shared across listed shares / equity MFs / business-trust units. An unlisted Sec 112 gain gets NO pool. Set 0 if you have used it up elsewhere.' },
      { key: 'marginalSlabRate', label: 'Your marginal slab rate (decimal)', default: 0.3, min: 0, max: 0.4, step: 0.05, hint: 'Used for unlisted short-term gains (at slab). Enter 0.3 for the 30% slab (0.315 with cess).' },
    ],
    assumptions: [
      'Unlisted equity: > 24 months long-term = 12.5% (Sec 112, no indexation, no Rs 1.25L pool); <= 24 months short-term = your slab rate.',
      'Listed exchange sale (STT paid): > 12 months = 12.5% above the shared Rs 1.25L pool (Sec 112A); <= 12 months = 20% (Sec 111A).',
      'The holding-period clock starts at your acquisition transfer, not at listing; sequence matters when you hold an unlisted share through its IPO and sell as a listed share.',
    ],
    limitations: [
      'This is an exit-time tax aid; it does NOT model the 6-month ICDR Reg 17 post-IPO lock-in (you cannot sell on the exchange until it ends) or the illiquidity/price-discovery risk the article covers.',
      'Unlisted STCG at the slab is a big cost for a top-slab investor - a short holding is rarely the right plan here.',
      'The figures are the FY 2026-27 post-Budget-2024 rates; confirm the current position with a CA, as each Finance Act can renumber or revise these under the Income-tax Act, 2025.',
    ],
    compute: (v) => {
      const r = preIpoTaxOutcome({
        costPerUnit: v.costPerUnit,
        units: v.units,
        salePricePerUnit: v.salePricePerUnit,
        monthsHeld: v.monthsHeld,
        isListedAtSale: v.isListedAtSale === 1,
        sharedLtcgPool: v.sharedLtcgPool,
        marginalSlabRate: v.marginalSlabRate,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      const headLabel = {
        'unlisted-ltcg': 'Unlisted LTCG (Sec 112, 12.5%, no pool)',
        'unlisted-stcg': `Unlisted STCG (at your ${(v.marginalSlabRate * 100).toFixed(0)}% slab)`,
        'listed-ltcg': 'Listed LTCG (Sec 112A, 12.5% above pool)',
        'listed-stcg': 'Listed STCG (Sec 111A, 20%)',
      }[r.taxHead];
      return {
        results: [
          { label: 'Gross gain', value: inr(r.grossGain), kind: 'inr', note: `On cost of Rs ${inr(r.totalCost)} across ${inr(v.units).replace(/^/, v.units < 1000 ? '' : '')} shares` },
          { label: 'Tax head', value: headLabel, kind: 'text', note: `Held ${v.monthsHeld} months${v.isListedAtSale === 1 ? ' and sold on the exchange' : ' while still unlisted'}` },
          { label: 'Tax paid', value: inr(r.taxPaid), kind: 'inr', note: r.poolApplied > 0 ? `After applying the Rs ${inr(r.poolApplied)} shared 112A pool` : 'No pool applies to this head' },
          { label: 'After-tax gain', value: inr(r.afterTaxGain), kind: 'inr', note: 'What the gain leaves you, net of capital-gains tax' },
          { label: 'Net return on entry', value: (r.netReturnPct * 100).toFixed(1) + '%', kind: 'text', note: 'After-tax gain as a % of your cost - the number to compare against a plain listed index at the same risk' },
        ],
        chart: {
          title: 'Gross vs after-tax gain (Rs)',
          alt: `Gross gain ${inr(r.grossGain)} vs after-tax gain ${inr(r.afterTaxGain)}; tax paid ${inr(r.taxPaid)} under ${headLabel}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['Gross gain', 'After-tax gain'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Gain',
                type: 'bar',
                data: [
                  { value: Math.round(r.grossGain), itemStyle: { color: '#64748b' } },
                  { value: Math.round(r.afterTaxGain), itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'senior-regime-tax',
    title: 'Senior-Citizen Regime Decision (60+ / 80+)',
    category: 'Tax',
    description: 'For a retiree living on interest and pension: which tax regime wins in FY 2026-27. It applies the age-based old-regime basic exemption (3L senior / 5L super-senior), the 80TTB interest deduction, 80D, and the new regime 87A-to-12L, then shows the 80TTB value and which regime costs less.',
    inputs: [
      { key: 'age', label: 'Age during the year', default: 66, min: 0, max: 120, step: 1, hint: '60-79 is the senior bracket (3L old-regime exemption); 80+ is super-senior (5L). The new regime gives no age benefit either way.' },
      { key: 'interestIncome', label: 'Interest income (FD/RD/SCSS/savings) (Rs)', default: 246000, min: 0, step: 10000, hint: 'The interest a retiree usually lives on. Up to the 80TTB limit of this is deductible in the OLD regime; TDS on it starts only above Rs 1,00,000/yr.' },
      { key: 'otherIncome', label: 'Other income (pension, rental, etc.) (Rs)', default: 600000, min: 0, step: 10000, hint: 'Everything that is not 80TTB-eligible interest. Pension and rental go here.' },
      { key: 'eightyTTBLimit', label: '80TTB interest-deduction limit (Rs)', default: 50000, min: 0, step: 10000, hint: 'Rs 50,000 for FY 2025-26 / AY 2026-27. A Budget-2026 raise to Rs 1,00,000 has been reported but is NOT yet verified - use 50,000 until a CA confirms the new cap.' },
      { key: 'eightyD', label: '80D health / medical (Rs)', default: 50000, min: 0, step: 10000, hint: 'Old-regime 80D claim. Seniors get an enhanced cap (up to Rs 50,000, higher than a regular individual). Set 0 if you have no claim.' },
      { key: 'eightyC', label: '80C basket on the old regime (Rs, up to 1.5L)', default: 0, min: 0, max: 150000, step: 10000, hint: 'PPF / ELSS / EPF / home-loan principal etc. that a retiree may still claim in the OLD regime. Only available in the old regime.' },
      { key: 'homeLoanInterest', label: 'Home-loan interest 24(b) (Rs, up to 2L)', default: 0, min: 0, max: 200000, step: 10000, hint: 'Old-regime-only home-loan interest deduction, up to Rs 2,00,000. Set 0 if you have no home loan.' },
    ],
    assumptions: [
      'Old regime: age-based basic exemption (3L senior / 5L super-senior / 2.5L below-60) + 80TTB on interest (capped at the limit and the interest earned) + 80D, on the 5/20/30 slabs with the 87A-to-5L rebate.',
      'New regime: no age benefit and no 80TTB/80D; everyone gets the same slabs + 87A rebate to 12L. A retiree moving to the new regime silently gives up the extra exemption (e.g. a super-senior loses Rs 1L of nil band).',
      'The 80TTB value is the old-regime tax you save by claiming it: old tax without 80TTB minus old tax with it, at your own marginal position.',
    ],
    limitations: [
      'The 80TTB limit is user-settable because the FY 2026-27 figure is in flux (Rs 50,000 confirmed for AY 2026-27; a reported Rs 1,00,000 raise is unverified) - confirm with a CA before acting.',
      'No surcharge or 4% cess (retirees rarely cross Rs 50L on interest+pension, but a large corpus can); use the high-income calculator if total income is above Rs 50L.',
      'SCSS interest is fully taxable as Other Sources; only the 80C deposit (up to 1.5L in the investment year) and the 80TTB interest relief apply, both old-regime.',
    ],
    compute: (v) => {
      const r = seniorRegimeTaxFY27({
        age: v.age,
        interestIncome: v.interestIncome,
        otherIncome: v.otherIncome,
        eightyTTBLimit: v.eightyTTBLimit,
        eightyD: v.eightyD,
        eightyC: v.eightyC,
        homeLoanInterest: v.homeLoanInterest,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      const bracket =
        r.ageBracket === 'super-senior' ? 'Super-senior (80+)' : r.ageBracket === 'senior' ? 'Senior (60-79)' : 'Below 60';
      return {
        results: [
          { label: 'Age bracket', value: bracket, kind: 'text', note: `Old-regime basic exemption ${inr(r.old.basicExemption)}; new regime has no age benefit` },
          { label: 'Old-regime tax', value: inr(r.old.tax), kind: 'inr', note: `On taxable ${inr(r.old.taxableIncome)} after 80TTB ${inr(r.old.eightyTTBApplied)} + 80D` },
          { label: 'New-regime tax', value: inr(r.new.tax), kind: 'inr', note: `On total ${inr(r.new.taxableIncome)} - no 80TTB, no 80D, but 87A to 12L` },
          { label: 'Regime winner', value: r.winner === 'old' ? 'Old regime' : r.winner === 'new' ? 'New regime' : 'Tie', kind: 'text', note: r.winner === 'old' ? `Old regime saves ${inr(r.savingsByOld)}` : r.winner === 'new' ? `New regime saves ${inr(Math.abs(r.savingsByOld))} - the 87A-to-12L rebate often beats the old regime for interest retirees` : 'Same tax at these numbers' },
          { label: '80TTB value (old regime)', value: inr(r.eightyTTBValue), kind: 'inr', note: 'The tax the 80TTB deduction removes in the old regime; it is worth 0 under the new regime' },
        ],
        chart: {
          title: 'Tax under each regime (Rs)',
          alt: `Old-regime tax ${inr(r.old.tax)} vs new-regime tax ${inr(r.new.tax)}; the ${r.winner} regime is cheaper by ${inr(Math.abs(r.savingsByOld))}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['Old regime', 'New regime'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Tax',
                type: 'bar',
                data: [
                  { value: Math.round(r.old.tax), itemStyle: { color: r.winner === 'old' ? '#1f7a5c' : '#b45309' } },
                  { value: Math.round(r.new.tax), itemStyle: { color: r.winner === 'new' ? '#1f7a5c' : '#b45309' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'nri-india-tax',
    title: 'NRI India-Source Tax & TDS (with DTAA)',
    category: 'International',
    description: 'Work out your NRI residential status from your day counts, whether you owe Indian tax, the Section 195 domestic TDS rate on your India-source income, the DTAA-reduced rate (TRC + Form 10F), the 4% cess, and the relief the treaty actually saves you.',
    inputs: [
      { key: 'daysInIndia', label: 'Days in India this FY', default: 120, min: 0, step: 1, hint: 'Physical presence - arrival and departure days both count. Under 182 days is necessary (but not sufficient) for NRI status.' },
      { key: 'daysInLastFourYears', label: 'Days in India in the 4 preceding FYs', default: 300, min: 0, step: 1, hint: 'For the long-term residency test: you are resident if you were in India 60+ days this FY AND 365+ days in the 4 preceding FYs (120+ this FY if Indian income tops Rs 15L).' },
      { key: 'indianIncomeAbove15L', label: 'Indian income above Rs 15L this FY?', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes - the 120-day variant applies' }], hint: 'High Indian income switches the residency long-test from 60 to 120 days in the current year.' },
      { key: 'indiaSourceIncome', label: 'India-source income (Rs)', default: 1000000, min: 0, step: 100000, hint: 'The income taxed in India: NRO interest, Indian rent, capital gains on Indian assets, salary for India services. NRE/FCNR interest and foreign income are NOT here.' },
      { key: 'domesticRate', label: 'Domestic Section 195 TDS rate (decimal)', default: 0.3, min: 0, max: 0.4, step: 0.01, hint: 'NRO interest / rent: 0.30. Listed-equity STCG (111A): 0.20. Listed / property LTCG: 0.125 (no 112A pool for NRI property). Choose the rate for your specific head.' },
      { key: 'dtaaRate', label: 'DTAA treaty rate, if a TRC applies (decimal)', default: 0.15, min: 0, max: 0.4, step: 0.01, hint: 'The treaty rate from your home country DTAA (e.g. 15% on interest under many treaties). Set 0 if the treaty exempts it. Only used when DTAA applies.' },
      { key: 'dtaaApplies', label: 'DTAA relief claimed (TRC + Form 10F)?', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'No - domestic rate applies' }, { value: 1, label: 'Yes - lower of domestic and treaty rate' }], hint: 'You need a Tax Residency Certificate from your home country plus Form 10F to get the treaty rate. NRIs cannot use Form 15G/15H.' },
    ],
    assumptions: [
      'An NRI is taxed in India only on India-source income; the status is decided by the Section 6 day counts (182-day test, and the 60/365 or 120/365 long-term test).',
      'TDS under Section 195 is withheld by the payer before remittance; you reconcile and claim any excess back by filing an Indian ITR (ITR-2, due 31 Jul).',
      'The applicable TDS rate is the LOWER of the domestic rate and the DTAA treaty rate (only when a valid TRC + Form 10F is in place). Surcharge and the 4% cess are shown but surcharge is not band-modelled here.',
    ],
    limitations: [
      'This computes the flat-head TDS rate; it does not run the full slab + surcharge + 87A (the 87A rebate is NOT available to NRIs - they are taxed on the whole India-source income).',
      'DTAA rates vary by country and head; the treaty rate you enter must be the rate actually applicable to your income type - confirm against the specific DTAA.',
      'NRE / FCNR interest is exempt (not a Section 195 head); only route taxable India-source income through this calculator.',
    ],
    compute: (v) => {
      const r = nriIndiaTaxFY27({
        daysInIndia: v.daysInIndia,
        daysInLastFourYears: v.daysInLastFourYears,
        indianIncomeAbove15L: v.indianIncomeAbove15L === 1,
        indiaSourceIncome: v.indiaSourceIncome,
        domesticRate: v.domesticRate,
        dtaaRate: v.dtaaRate,
        dtaaApplies: v.dtaaApplies === 1,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      return {
        results: [
          { label: 'Residential status', value: r.residency === 'non-resident' ? 'Non-resident (NRI)' : 'Resident', kind: 'text', note: r.qualifyingTest },
          { label: 'Applicable TDS rate', value: (r.applicableTdsRate * 100).toFixed(0) + '%', kind: 'text', note: v.dtaaApplies === 1 ? 'Lower of domestic ' + (v.domesticRate*100).toFixed(0) + '% and treaty ' + (v.dtaaRate*100).toFixed(0) + '%' : 'Domestic Section 195 rate (no DTAA claimed)' },
          { label: 'TDS before cess', value: inr(r.tdsBeforeCess), kind: 'inr', note: `On ${inr(v.indiaSourceIncome)} of India-source income` },
          { label: '4% Health & Education cess', value: inr(r.cess4Pct), kind: 'inr', note: 'Flat 4% on the TDS amount' },
          { label: 'Total TDS with cess', value: inr(r.totalTdsWithCess), kind: 'inr', note: 'The amount withheld before you file and reclaim any excess' },
          { label: 'DTAA relief (if claimed)', value: inr(r.dtaaRelief), kind: 'inr', note: v.dtaaApplies === 1 ? 'TDS saved by the treaty rate vs the domestic rate - recoverable only by filing an ITR' : 'Not claimed - set DTAA applies to see the saving' },
        ],
        chart: {
          title: 'TDS on the India-source income (Rs)',
          alt: `TDS ${inr(r.tdsBeforeCess)} + cess ${inr(r.cess4Pct)} = ${inr(r.totalTdsWithCess)} on ${inr(v.indiaSourceIncome)}; DTAA relief ${inr(r.dtaaRelief)}.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['TDS', 'Cess', 'Total'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.tdsBeforeCess), itemStyle: { color: '#334155' } },
                  { value: Math.round(r.cess4Pct), itemStyle: { color: '#64748b' } },
                  { value: Math.round(r.totalTdsWithCess), itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
            grid: { left: 70, right: 20, top: 30, bottom: 30 },
          },
        },
      };
    },
  },

  {
    id: 'capital-gains-rollover',
    title: 'Capital Gains Rollover: 54 / 54F / 54EC Exemption',
    category: 'Tax',
    description: 'Work out how much of a long-term capital gain you can shelter by reinvesting: Section 54 (house to house), 54F (any asset to house) and 54EC (notified bonds, Rs 50L cap) — the exempt amount, the taxable balance, the 12.5% tax it saves, and what breaks the exemption (a missed time window or a short-term gain).',
    inputs: [
      { key: 'gain', label: 'Net capital gain (Rs)', default: 800000, min: 0, step: 50000, hint: 'Sale value minus cost and expenses. Only a LONG-TERM gain qualifies - check your holding period (24 months for property, 12 months for listed equity / equity MFs).' },
      { key: 'reinvested', label: 'Amount reinvested in the new asset (Rs)', default: 500000, min: 0, step: 50000, hint: 'What you actually put into the new house / bonds within the statutory window. The exemption is the smaller of the gain and this - reinvest less and the balance is taxable.' },
      { key: 'route', label: 'Reinvestment route', default: 2, min: 0, max: 2, step: 1, type: 'select', options: [{ value: 0, label: '54 - house to house' }, { value: 1, label: '54F - any long-term asset to a house' }, { value: 2, label: '54EC - notified bonds (Rs 50L cap)' }], hint: '54EC is a hard Rs 50,00,000 cap on the reinvestment and is for a house-gain reinvested in notified bonds; 54/54F reinvest in a house and have no binding cap in this model.' },
      { key: 'timeCompliant', label: 'Reinvestment done inside the statutory window?', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - on time' }, { value: 0, label: 'No - window missed' }], hint: '54EC: within 6 months of the sale. 54: purchase within 1 year before / 2 years after the sale, or construction within 3 years. 54F: within 2 years of the sale. Miss the window and the exemption is zero.' },
      { key: 'ltcgOnly', label: 'Is this a long-term gain?', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - long-term' }, { value: 0, label: 'No - short-term' }], hint: 'The 54/54F/54EC reinvestment exemptions apply only to LONG-TERM gains. A short-term gain gets no rollover exemption.' },
      { key: 'taxRateOnGain', label: 'Tax rate on the gain (decimal)', default: 0.125, min: 0, max: 0.4, step: 0.005, hint: '12.5% for the post-2024 uniform LTCG rate (property, listed equity, most assets, no indexation). Use your slab rate only if the gain is a non-112A/112 head taxed at slab.' },
    ],
    assumptions: [
      'Post-Finance (No.2) Act 2024: long-term capital gains are taxed at 12.5% without indexation; the reinvestment exemptions (54/54F/54EC) are the primary way to shelter a long-term gain, and they apply to residents and NRIs alike.',
      'The exemption is the smaller of (a) the gain and (b) the amount actually reinvested within the window - the proportional rule. 54EC additionally caps the reinvestment at Rs 50,00,000.',
      'A missed statutory window or a short-term gain zeroes the exemption; only the time-compliant, long-term portion is sheltered.',
    ],
    limitations: [
      'This models the reinvestment amount and the 54EC cap; the Section 54 Rs 10 Cr new-asset-cost cap and the 54/54F condition that the old house not be sold within 3 years of the new purchase are not modelled - they are compliance gates, not the exemption math.',
      'Unspent sale consideration in a CGAS account must be invested within the remaining window or the exemption fails for that amount - track the deadline separately.',
      '54EC bonds are issued only in notified tranches (NHAI/REC/PFC/IRFC, etc.); the window to invest depends on a tranche being open - confirm the notified list and your tranche dates.',
    ],
    compute: (v) => {
      const routes = ['54', '54F', '54EC'] as const;
      const r = rolloverExemption({
        gain: v.gain,
        reinvested: v.reinvested,
        route: routes[v.route],
        timeCompliant: v.timeCompliant === 1,
        ltcgOnly: v.ltcgOnly === 1,
        taxRateOnGain: v.taxRateOnGain,
      });
      const inr = (x: number) => Math.round(x).toLocaleString('en-IN');
      const broken = !r.timeCompliant || !v.ltcgOnly;
      return {
        results: [
          {
            label: 'Route',
            value: r.route.toUpperCase(),
            kind: 'text',
            note: r.route === '54EC' ? 'Rs 50,00,000 reinvestment cap applies' : 'No binding cap in this model',
          },
          {
            label: 'Exempt amount',
            value: inr(r.exemptAmount),
            kind: 'inr',
            note: broken
              ? 'Zeroed: ' + (!r.timeCompliant ? 'window missed' : 'not a long-term gain')
              : 'The smaller of the gain and the (capped) reinvested amount',
          },
          {
            label: 'Taxable balance',
            value: inr(r.taxableGain),
            kind: 'inr',
            note: 'This portion is taxed at your rate - the reinvestment sheltered the rest',
          },
          {
            label: 'Tax the rollover saves',
            value: inr(r.taxSaved),
            kind: 'inr',
            note: `At ${(v.taxRateOnGain * 100).toFixed(1)}% on the exempt amount - zero if the window was missed or the gain is short-term`,
          },
          {
            label: 'Tax with no rollover',
            value: inr(r.taxOnGainIfNoRollover),
            kind: 'inr',
            note: 'The full bill on the whole gain if nothing were reinvested',
          },
        ],
        chart: {
          title: broken ? 'Exemption broken - the whole gain is taxable' : 'How the gain splits after the rollover',
          alt: `Exempt ${inr(r.exemptAmount)}, taxable ${inr(r.taxableGain)}; the rollover saves ${inr(r.taxSaved)} in tax.`,
          option: {
            tooltip: { valueFormatter: (x: number) => `Rs ${inr(x)}` },
            xAxis: { type: 'category', data: ['Exempt', 'Taxable'] },
            yAxis: { type: 'value', name: 'Rs', axisLabel: { formatter: (x: number) => `${Math.round(x / 1e5)}L` } },
            series: [
              {
                name: 'Gain',
                type: 'bar',
                data: [
                  { value: Math.round(r.exemptAmount), itemStyle: { color: broken ? '#b45309' : '#1f7a5c' } },
                  { value: Math.round(r.taxableGain), itemStyle: { color: '#64748b' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },
  {
    id: 'dtaa-rate-reference',
    title: 'DTAA Treaty-Rate vs Domestic TDS (NRI India-Source Income)',
    category: 'Tax',
    description:
      'Compare the withholding a non-resident pays on India-source income (NRO interest, dividends, royalties) under the domestic TDS rate versus the lower DTAA treaty rate for your country of residence — with surcharge + 4% cess, the TDS saved, the effective rates, and the section 91 foreign-tax-credit when the home country also taxes the same income (exemption-method corridors like the UAE pay nothing there).',
    inputs: [
      {
        key: 'income',
        label: 'India-source income (Rs)',
        default: 1000000,
        min: 0,
        step: 50000,
        hint: 'Gross income paid to you in India (NRO account interest, dividends, royalties, fees). This is what gets withheld at source.',
      },
      {
        key: 'corridor',
        label: 'Country of residence (DTAA corridor)',
        default: 0,
        min: 0,
        max: 10,
        step: 1,
        type: 'select',
        options: [
          { value: 0, label: 'United States - 15% (interest / dividends, >10% holding)' },
          { value: 1, label: 'United Kingdom - 15% (dividends / interest)' },
          { value: 2, label: 'Singapore - 15% (interest) / 10-15% (dividends)' },
          { value: 3, label: 'Australia - 15% (dividends / interest)' },
          { value: 4, label: 'Canada - 15% (dividends >10%) / 15% interest' },
          { value: 5, label: 'Germany - 10% (dividends / interest / royalties)' },
          { value: 6, label: 'Netherlands - 10% (dividends / interest / royalties)' },
          { value: 7, label: 'Japan - 10% (dividends / interest / royalties)' },
          { value: 8, label: 'France - 10% (dividends / interest / royalties)' },
          { value: 9, label: 'UAE - 12.5% interest / 10% dividends (exemption method, no home tax)' },
          { value: 10, label: 'Domestic rate only (no DTAA claim) - 30%' },
        ],
        hint: 'Picks the typical treaty rate for that corridor. Treatments differ by income type - verify the exact article rate for your case before acting.',
      },
      {
        key: 'domesticRate',
        label: 'Domestic TDS rate (fraction, e.g. 0.30)',
        default: 0.3,
        min: 0,
        max: 1,
        step: 0.01,
        hint: 'The Act rate without a treaty claim. Section 195 on NRO interest / rent is 30% (surcharge + cess on top); dividends 20%.',
      },
      {
        key: 'residenceTax',
        label: 'Home-country tax on this income (Rs)',
        default: 0,
        min: 0,
        step: 10000,
        hint: 'The tax your country of residence levies on the same income. 0 models an exemption-method corridor (UAE / Saudi / Kuwait) where the home side taxes nothing, so India is your only tax.',
      },
      {
        key: 'surchargePct',
        label: 'Surcharge on the TDS (fraction of tax, e.g. 0.05)',
        default: 0,
        min: 0,
        max: 1,
        step: 0.01,
        hint: 'Applied as a % of the withholding itself before the 4% cess. For most NRI TDS the surcharge is nil, but large amounts attract it.',
      },
    ],
    assumptions: [
      'Treaty rate is the typical corridor rate and is set before surcharge and the 4% Health & Education cess; the all-in figure applies (1 + surcharge) x (1 + 4%).',
      'Treaty benefit requires a Tax Residency Certificate (TRC) from your home country plus Form 41 (formerly 10F) to the payer, filed before the deduction.',
      'Foreign tax credit (section 91) in the residence country is capped at the lesser of the India-side tax paid and the home-country tax on the same income.',
      'Capital gains on the sale of Indian property are NOT reduced by most DTAAs - India keeps its taxing right; the treaty helps on dividends, interest, royalties and FTS.',
    ],
    limitations: [
      'Treaty rates differ by income type and holding - this shows the corridor typical, not your exact article; confirm with a CA / the treaty text.',
      'Does not model a section 197 lower-deduction certificate (used when the payer over-withholds on property).',
      'Home-country tax is entered by you; it is not computed here. Exemption-method corridors (residenceTax 0) simply show India as the only tax.',
    ],
    compute: (v) => {
      const CORRIDOR_TREATY: number[] = [
        0.15, 0.15, 0.15, 0.15, 0.15, // US, UK, SG, AU, CA
        0.1, 0.1, 0.1, 0.1, // DE, NL, JP, FR
        0.125, // UAE
        0.3, // domestic-only
      ];
      const cIdx = Math.min(CORRIDOR_TREATY.length - 1, Math.max(0, Math.round(v.corridor || 0)));
      const treatyRate = CORRIDOR_TREATY[cIdx];
      const r = dtaaReliefFY27({
        income: v.income,
        domesticRate: v.domesticRate,
        treatyRate: v.corridor === 10 ? 0.3 : treatyRate,
        surchargePct: v.surchargePct,
        residenceTax: v.residenceTax,
      });
      const inr = (n: number) => `Rs ${Math.round(n).toLocaleString('en-IN')}`;
      const pct = (x: number) => `${(x * 100).toFixed(2)}%`;
      const results: CalcResult[] = [
        { label: 'Route', value: v.corridor === 10 ? 'Domestic TDS only (no treaty)' : 'Treaty (DTAA) route', type: 'text' },
        { label: 'Treaty rate applied', value: pct(r.treatyRate) },
        { label: 'TDS @ domestic rate', value: inr(r.domesticWithholding) },
        { label: 'TDS @ treaty rate', value: inr(r.treatyWithholding) },
        { label: 'TDS saved (pre-cess)', value: inr(r.tdsSaved) },
        { label: 'All-in tax @ domestic (surcharge + cess)', value: inr(r.domesticAllIn) },
        { label: 'All-in tax @ treaty (surcharge + cess)', value: inr(r.treatyAllIn) },
        { label: 'Total saving (all-in)', value: inr(r.savingAllIn) },
        { label: 'Effective rate - domestic', value: pct(r.effectiveRateDomestic) },
        { label: 'Effective rate - treaty', value: pct(r.effectiveRateTreaty) },
        { label: 'Home-country tax (entered)', value: inr(r.residenceTax) },
        { label: 'Foreign tax credit (s.91, capped)', value: inr(r.foreignTaxCredit) },
        { label: 'Net extra home-country tax', value: inr(r.netAdditionalTax) },
        { label: 'Total two-country burden - treaty route', value: inr(r.totalTaxBurdenTreatyRoute) },
      ];
      return {
        results,
        chart: {
          title: 'Withholding: domestic vs treaty (all-in)',
          alt: 'Bar chart comparing the all-in tax on the income under the domestic TDS route and the DTAA treaty route, with the saving shown.',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: ['Domestic TDS', 'Treaty (DTAA)'] },
            yAxis: {
              type: 'value',
              axisLabel: { formatter: (x: number) => `Rs ${Math.round(x / 1e5)}L` },
            },
            grid: { left: 70, right: 20, top: 30, bottom: 40 },
            series: [
              {
                name: 'All-in tax (surcharge + cess)',
                type: 'bar',
                data: [
                  { value: Math.round(r.domesticAllIn), itemStyle: { color: '#64748b' } },
                  { value: Math.round(r.treatyAllIn), itemStyle: { color: '#1f7a5c' } },
                ],
                label: {
                  show: true,
                  formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L`,
                },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'esop-vesting-tax',
    title: 'ESOP / RSU Two-Stage Tax Walkthrough (Perquisite + Capital Gains, FY 2026-27)',
    category: 'Tax',
    description:
      'Model the full two-stage ESOP/RSU burden: the exercise-date perquisite (FMV minus exercise price, slab tax on salary) plus the later capital gain (head depends on listed vs unlisted and the holding clock), with the shared Rs 1.25L 112A pool, 4% cess, surcharge, employer TDS, and the 80-IAC startup deferral. Shows what lands in your pocket after both events.',
    inputs: [
      { key: 'shares', label: 'Shares exercised / vested', default: 1000, min: 0, step: 100, hint: 'Whole shares allotted on the exercise or vesting date.' },
      { key: 'exercisePrice', label: 'Exercise price per share (Rs)', default: 500, min: 0, step: 50, hint: 'Rs 0 for RSUs (you pay nothing to receive the share).' },
      { key: 'fmvAtExercise', label: 'FMV per share on exercise date (Rs)', default: 1500, min: 0, step: 50, hint: 'Listed: avg of open+close that day. Unlisted: Category-I merchant-banker valuation within 180 days.' },
      { key: 'salePrice', label: 'Sale price per share (Rs)', default: 1800, min: 0, step: 50, hint: 'Rs 0 if you have not sold yet (then only the Stage-1 perquisite is computed).' },
      { key: 'listed', label: 'Listed (STT-paid) equity?', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - listed on Indian exchange' }, { value: 0, label: 'No - unlisted / private' }], hint: 'Sets the 12-month (listed) vs 24-month (unlisted) long-term clock and the 112A pool applicability.' },
      { key: 'monthsHeld', label: 'Months held from exercise to sale', default: 15, min: 0, step: 1, hint: 'Whole months from the exercise/allotment date to the sale date. Over 12 (listed) or over 24 (unlisted) makes it long-term.' },
      { key: 'otherSalary', label: 'Other salary income in the FY (Rs)', default: 2000000, min: 0, step: 100000, hint: 'Salary excluding this ESOP perquisite - used to place the perquisite in the slab and find the unlisted-STCG marginal rate.' },
      { key: 'otherListedLtcg', label: 'Other listed-equity LTCG this FY (Rs)', default: 0, min: 0, step: 10000, hint: 'Other 112A gains that share the Rs 1.25L aggregate pool. Reduces the pool available to this ESOP gain.' },
      { key: 'startupDeferral', label: 'Employer has 80-IAC / IMB deferral certificate?', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'No - normal TDS at exercise' }, { value: 1, label: 'Yes - DPIIT + IMB certified startup' }], hint: 'Defers the perquisite TDS to the earliest of 60 months, sale, or leaving. Only a few thousand startups hold the certificate.' },
      { key: 'tdsOnPerquisite', label: 'TDS already deducted on the perquisite (Rs)', default: 0, min: 0, step: 1000, hint: 'The employer-withheld perquisite tax. Reduces the net out-of-pocket bill.' },
    ],
    assumptions: [
      'New-regime slabs for the perquisite salary (FY 2026-27); the CG stages use the statutory 112A/111A/Sec-112 rates.',
      'Perquisite cost base is the FMV at exercise (Sec 49(2AA) / Act-2025 Sec 73 step-up), so the salary-taxed slice is never re-taxed as CG.',
      'The Rs 1.25L 112A pool is annual and aggregate across all listed-equity LTCG, not per transaction.',
      '4% health & education cess applies to the perquisite tax, CG tax and surcharge.',
      'Unlisted short-term gains are taxed at the marginal new-regime rate at the combined-income level.',
      '80-IAC deferral changes only the timing of the perquisite TDS, not the amount; tax is computed at allotment-year rates.',
    ],
    limitations: [
      'Exercises on or after 1 Apr 2026 move the perquisite TDS from Sec 192 to Sec 392 (Income-tax Act 2025) - the amount is unchanged.',
      'Surcharge marginal-relief at the Rs 50L/1Cr/2Cr boundaries is modelled with the pre-cess band, a documented approximation.',
      'Foreign-parent ESOPs/RSUs add Schedule FA disclosure and a 24-month foreign-LTCG clock that are not modelled here.',
      'This is a decision model, not a filing compute - reconcile with Form 16/12BA and a CA before acting.',
    ],
    compute: (v) => {
      const r = esopVestingTaxFY27({
        shares: v.shares,
        exercisePrice: v.exercisePrice,
        fmvAtExercise: v.fmvAtExercise,
        salePrice: v.salePrice,
        listed: v.listed > 0.5,
        monthsHeld: v.monthsHeld,
        otherSalary: v.otherSalary,
        otherListedLtcg: v.otherListedLtcg,
        startupDeferral: v.startupDeferral > 0.5,
        tdsOnPerquisite: v.tdsOnPerquisite,
      });
      const lcr = (n: number) => `Rs ${Math.round(n / 100000).toLocaleString('en-IN')}L`;
      const results = [
        { label: 'Stage 1 perquisite (salary-taxed)', value: lcr(r.perquisite), sub: 'FMV - exercise price, times shares' },
        { label: 'Stage 1 incremental slab tax', value: lcr(r.perquisiteIncrementalTax), sub: `cess-included Rs ${Math.round(r.perqTaxWithCess / 1000)}k` },
        { label: 'Stage 2 capital gain (gross)', value: lcr(r.capitalGain), sub: `head ${r.cgHead}${r.isLtcg ? ' (long-term)' : ''}` },
        { label: '112A pool consumed', value: lcr(r.poolConsumed), sub: 'of the Rs 1.25L annual aggregate pool' },
        { label: 'Stage 2 CG tax', value: lcr(r.cgTax), sub: `cess-included Rs ${Math.round(r.cgTaxWithCess / 1000)}k` },
        { label: 'Surcharge (pre-cess)', value: lcr(r.surcharge), sub: 'on total income above 50L' },
        { label: 'Total two-stage tax (with cess + surcharge)', value: lcr(r.totalTwoStageTax), sub: `net after TDS Rs ${Math.round(r.netTaxAfterTds / 1000)}k` },
        { label: 'Effective tax on gross gain', value: `${(r.effectiveTaxRate * 100).toFixed(1)}%`, sub: r.deferralApplies ? '80-IAC deferral active' : 'no deferral' },
      ];
      return {
        results,
        chart: {
          title: 'Where the two-stage ESOP tax lands',
          alt: 'Bar chart splitting the ESOP tax into the Stage-1 perquisite (salary) and Stage-2 capital-gain legs plus surcharge',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: {
              type: 'category',
              data: ['Stage 1 perquisite', 'Stage 2 CG tax', 'Surcharge', 'Total'],
            },
            yAxis: { type: 'value', axisLabel: { formatter: (x: number) => `Rs ${Math.round(x / 1e5)}L` } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Tax (with cess)',
                type: 'bar',
                data: [
                  { value: Math.round(r.perqTaxWithCess), itemStyle: { color: '#c65d3b' } },
                  { value: Math.round(r.cgTaxWithCess), itemStyle: { color: '#3a6ea5' } },
                  { value: Math.round(r.surcharge * 1.04), itemStyle: { color: '#8a8f98' } },
                  { value: Math.round(r.totalTwoStageTax), itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p: { value: number }) => `Rs ${Math.round(p.value / 1e5)}L` },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'capital-ladder',
    title: 'The 10L Capital Ladder: Rung-by-Rung Unlock (SIF / PMS / AIF, FY 2026-27)',
    category: 'Personal Finance',
    description:
      'Model how a Rs 10L starter corpus (plus a monthly SIP and an optional future lump-sum event) climbs the SEBI rung ladder: the SIF 10L unlock (MF Regs 2026), the Rs 25L PMS/PRIM + AIF-employee unlock (PM Regs 2026), the standard PMS 50L unlock, and the AIF 1Cr unlock - with the months to cross each door and the surcharge-tier shift as income grows.',
    inputs: [
      { key: 'currentCorpus', label: 'Current investable corpus (Rs)', default: 1000000, min: 0, step: 100000, hint: 'The lump sum you can deploy today. 10L already unlocks the SIF door.' },
      { key: 'monthlySip', label: 'Monthly SIP / top-up (Rs)', default: 50000, min: 0, step: 5000, hint: 'The recurring amount added at month-end each month.' },
      { key: 'annualReturn', label: 'Expected annual return (%)', default: 9, min: 0, max: 30, step: 0.5, hint: 'Nominal annual return on the combined corpus; 9-10% is a conservative blended long/short assumption.' },
      { key: 'additionalCapital', label: 'Future lump-sum event (Rs)', default: 500000, min: 0, step: 50000, hint: 'A promotion bonus, ESOP exercise, or inherited capital landing later. 0 for none.' },
      { key: 'additionalCapitalMonth', label: 'Month that event lands', default: 12, min: 0, max: 360, step: 1, hint: '1-based month it is added to the corpus. 0 = no event.' },
      { key: 'currentAnnualIncome', label: 'Current annual income (Rs)', default: 2000000, min: 0, step: 100000, hint: 'For the surcharge-tier model: your income today (pre-supercharge base tax at the new-regime slabs).' },
      { key: 'futureAnnualIncome', label: 'Future annual income (Rs)', default: 4000000, min: 0, step: 100000, hint: 'Your expected income when the corpus is larger; shows the surcharge-tier jump (10% above 50L, 15% above 1Cr, 25% above 2Cr).' },
    ],
    assumptions: [
      'Rung thresholds are the SEBI regulatory minimums (verified FY 2026-27): SIF Rs 10L (PAN-level), PMS/PRIM Rs 25L (MF-only, PM Regs 2026), standard PMS Rs 50L, AIF Rs 1Cr.',
      'The corpus grows at a constant monthly return plus the SIP; the optional lump-sum event is added at its month and compounds afterwards.',
      'Surcharge uses the new-regime FY 2026-27 bands (10% above 50L, 15% above 1Cr, 25% above 2Cr) applied to the new-regime base tax, pre-cess.',
      'Reaching a rung means the corpus *available for deployment* clears the minimum; it does not require abandoning existing investments.',
    ],
    limitations: [
      'SIF and PMS fees are not modelled here (see the after-tax-wedge calculator); this tool answers "when do I qualify?", not "should I?".',
      'AIF Category-I employee/director minimum is Rs 25L only when you are an eligible employee/director of the portfolio company; the general HNI route is Rs 1Cr.',
      'The 25L PRIM route opens 1 Apr 2027; before that, the only sub-50L professional door is the SIF at 10L.',
      'This is a qualification-timing model, not a filing or tax computation - reconcile with a CA before acting.',
    ],
    compute: (v) => {
      const r = capitalLadderFY27({
        currentCorpus: v.currentCorpus,
        monthlySip: v.monthlySip,
        annualReturn: v.annualReturn / 100,
        additionalCapital: v.additionalCapital,
        additionalCapitalMonth: v.additionalCapitalMonth,
        currentAnnualIncome: v.currentAnnualIncome,
        futureAnnualIncome: v.futureAnnualIncome,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const mfmt = (m: number) => m < 0 ? 'beyond 30 yr' : m === 0 ? 'now' : m + ' mo (' + (m / 12).toFixed(1) + ' yr)';
      const results = [
        { label: 'SIF (Rs 10L) status', value: mfmt(r.rungs[0].monthsToUnlock), sub: r.rungs[0].status },
        { label: 'PMS/PRIM (Rs 25L) status', value: mfmt(r.rungs[1].monthsToUnlock), sub: 'PM Regs 2026, eff 1 Apr 2027' },
        { label: 'Standard PMS (Rs 50L) status', value: mfmt(r.rungs[2].monthsToUnlock), sub: 'min per client' },
        { label: 'AIF (Rs 1Cr) status', value: mfmt(r.rungs[3].monthsToUnlock), sub: 'HNI route' },
        { label: 'Next locked rung', value: r.nextRungId ? cr(r.rungs.find((x) => x.id === r.nextRungId).threshold) : 'all unlocked', sub: mfmt(r.monthsToNextRung) },
        { label: 'Corpus at 30-yr horizon', value: cr(r.corpusAtHorizon), sub: 'with SIP + event' },
        { label: 'Surcharge tier now', value: r.surcharge.currentTier.label, sub: cr(r.surcharge.surchargeNow) },
        { label: 'Surcharge tier later', value: r.surcharge.futureTier.label, sub: cr(r.surcharge.surchargeLater) },
      ];
      return {
        results,
        chart: {
          title: 'When each rung unlocks (months)',
          alt: 'Step chart of the four rung thresholds with the months to reach each from the current corpus plus SIP',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: r.rungs.map((x) => x.name.replace(' unlock', '')) },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Threshold',
                type: 'bar',
                data: r.rungs.map((x) => x.threshold),
                itemStyle: { color: '#3a6ea5' },
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
              {
                name: 'Months to unlock',
                type: 'line',
                data: r.rungs.map((x) => (x.monthsToUnlock < 0 ? null : x.monthsToUnlock)),
                itemStyle: { color: '#1f7a5c' },
                yAxisIndex: 0,
              },
            ],
          },
        },
      };
    },
  },

  {
    id: '54ec-tranche-tracker',
    title: '54EC Tranche Tracker: The 6-Month Window, 5-Year Lock-In & Early-Redemption Reversal (FY 2026-27)',
    category: 'Tax',
    description:
      'Model a sequence of 54EC infrastructure-bond tranches against a single long-term capital gain: which tranches are compliant inside the 6-month window, which sit under the Rs 50L cap, and - the trap most people miss - what happens to the exemption when you redeem a tranche before its 5-year lock-in expires. The early-redemption reversal pulls the whole exemption back and re-taxes the original gain at 12.5%.',
    inputs: [
      { key: 'originalGain', label: 'Original LTCG amount (Rs)', default: 4000000, min: 0, step: 100000, hint: 'The long-term capital gain from the asset sale that creates the 54EC obligation.' },
      { key: 'trancheInvested', label: 'Amount invested in this 54EC tranche (Rs)', default: 3000000, min: 0, step: 100000, hint: 'What you put into this bond issue. Bounded by the Rs 50L cap and the original gain.' },
      { key: 'monthsFromSaleToInvest', label: 'Months from sale to this investment', default: 4, min: 0, max: 24, step: 1, hint: 'The 54EC window is 6 months. A tranche bought in month 7 or later is non-compliant and earns no exemption.' },
      { key: 'monthsHeld', label: 'Months held before redemption (-1 = hold to maturity)', default: 30, min: -1, max: 120, step: 1, hint: 'The 54EC lock-in is 5 years (60 months). Redeeming before month 60 triggers the exemption reversal. Use -1 for held-to-maturity.' },
      { key: 'couponRate', label: '54EC bond coupon rate (%)', default: 7, min: 0, max: 12, step: 0.5, hint: 'The bond pays a fixed coupon (recent REC/PFC/HUDCO/IRFC 54EC issues price around 6.5-7.5%). Interest is taxed at your slab rate, not 12.5%.' },
      { key: 'interestMonths', label: 'Months of coupon interest accrued', default: 30, min: 0, max: 60, step: 1, hint: 'How many months of interest to tax on redemption; defaults to months held.' },
    ],
    assumptions: [
      '12.5% no-indexation LTCG rate (post-Finance-No.2 Act 2024) applies to the original gain if the exemption lapses.',
      'The 54EC reinvestment cap is Rs 50L per financial year; this tracker models one tranche against that cap.',
      'The 5-year lock-in is 60 months; early redemption before month 60 withdraws the exemption for the tranche.',
      'Coupon interest accrues at the stated rate on the capped principal and is taxed at a flat 30% slab (the HNI bracket).',
      'A single non-compliant tranche (bought after 6 months) captures zero exemption; the original gain is then fully taxed at 12.5%.',
    ],
    limitations: [
      'The 54EC cap is a per-FY reinvestment limit; a large gain spread across two years must respect each year cap separately.',
      'Early-redemption interest is a simplification - the actual holding-period coupon is the issuer coupon, not a running accrual.',
      'This is an operational-exemption tracker, not a filing computation; reconcile with Form 64C/64D (78/79 under the Act-2025) and a CA.',
      'The Rs 50L cap is the statutory default; if a Finance-Act amendment raises it, the cap input overrides the default.',
    ],
    compute: (v) => {
      const r = fiftyFourECTrancheTracker({
        originalGain: v.originalGain,
        trancheInvested: v.trancheInvested,
        monthsFromSaleToInvest: v.monthsFromSaleToInvest,
        monthsHeldBeforeRedemption: v.monthsHeld,
        couponRate: v.couponRate / 100,
        interestAccrualMonths: v.interestMonths,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const status = !r.compliant ? 'NON-COMPLIANT (bought after the 6-mo window)'
        : r.earlyRedemption ? 'REVERSED (redeemed before the 5-yr lock-in)'
        : 'HELD TO MATURITY - exemption kept';
      const results = [
        { label: 'Exemption captured', value: cr(r.exemptionCaptured), sub: 'of ' + cr(r.originalGain) + ' original gain' },
        { label: 'Tax saved by the rollover', value: cr(r.taxSaved), sub: 'vs the no-54EC 12.5% baseline' },
        { label: 'Tranche status', value: status, sub: r.compliant ? 'compliant in window' : 'no exemption for this tranche' },
        { label: 'Early-redemption reversal tax', value: cr(r.reversalTax), sub: r.earlyRedemption ? 'exemption lapsed, gain re-taxed at 12.5%' : 'no reversal (held to maturity)' },
        { label: 'Net tax effect', value: cr(r.netTaxEffect), sub: r.netTaxEffect < 0 ? 'net saving' : 'net cost' },
        { label: 'Coupon interest accrued', value: cr(r.interestAccrual), sub: 'on the capped principal' },
        { label: 'Interest tax at 30% slab', value: cr(r.interestTax), sub: 'separate income head, not 12.5%' },
        { label: 'Total net tax effect', value: cr(r.totalTaxEffect), sub: 'reversal + interest, net of the saving' },
      ];
      return {
        results,
        chart: {
          title: '54EC tranche economics (Rs L)',
          alt: 'Bar chart of the 54EC tranche: exemption captured, tax saved, reversal tax, coupon interest, and the net effect',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: ['Exemption', 'Tax saved', 'Reversal', 'Coupon', 'Interest tax'] },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.exemptionCaptured), itemStyle: { color: '#1f7a5c' } },
                  { value: Math.round(r.taxSaved), itemStyle: { color: '#3a6ea5' } },
                  { value: Math.round(r.reversalTax), itemStyle: { color: '#c65d3b' } },
                  { value: Math.round(r.interestAccrual), itemStyle: { color: '#8a8f98' } },
                  { value: Math.round(r.interestTax), itemStyle: { color: '#6b5b8a' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'gift-city-lrs-tax',
    title: 'GIFT City / IFSC LRS Route: TCS Reservation + the Two Tax-Treatment Positions (FY 2026-27)',
    category: 'International',
    description:
      'The operational math for investing in a GIFT City IFSC fund: the TCS "reservation" on your LRS remittance (20% above the Rs 10L threshold), the USD 250k LRS cap, and the two coexisting tax positions on the gain (Indian-side 12.5% LTCG + Schedule FA vs fund-level post-tax NAV). Shows how much cash to keep at source and how the holding period flips the Indian-side treatment.',
    inputs: [
      { key: 'investRupees', label: 'Rs you want to invest (Rs)', default: 2000000, min: 0, step: 100000, hint: 'The rupee amount remitted under LRS to buy the GIFT City scheme.' },
      { key: 'priorLrsRemittance', label: 'Other LRS remittances this FY (Rs)', default: 0, min: 0, step: 100000, hint: 'Your total LRS outflow before this one. TCS is on the AGGREGATE above the Rs 10L threshold.' },
      { key: 'monthsHeld', label: 'Months you will hold the units', default: 30, min: 0, max: 240, step: 1, hint: '24+ months = long-term (12.5% on the Indian-side route); under 24 months = slab-rate STCG.' },
      { key: 'gainPct', label: 'Expected gain (%)', default: 20, min: -100, max: 200, step: 5, hint: 'Illustrative gain per rupee invested, used to compute the two treatment outcomes.' },
      { key: 'slabRate', label: 'Your marginal slab rate (%)', default: 30, min: 0, max: 30, step: 5, hint: 'For the STCG / specified-MF position on the Indian-side route.' },
      { key: 'usdInr', label: 'USD/INR (for the cap check)', default: 84, min: 50, max: 120, step: 1, hint: 'The assumed rate for the USD 250,000 LRS cap check; a planning input, not a forecast.' },
    ],
    assumptions: [
      'LRS cap USD 250,000/person/FY; TCS-free threshold Rs 10L on the AGGREGATE LRS outflow (post-Finance-Act-2025).',
      'The 20% TCS applies to the "other / investment" bucket; education / medical / tour dropped to 2% from 1 Apr 2026.',
      'TCS is a credit, not a cost: it is recovered against your final tax liability at ITR filing.',
      'The Indian-side route taxes GIFT City gains as a foreign asset: 12.5% no-indexation LTCG after 24 months, slab STCG, Schedule FA mandatory.',
      'Some GIFT City schemes instead pay tax at the fund level (post-tax NAV); the offer document decides which applies to you.',
    ],
    limitations: [
      'The two tax positions conflict; a planner must confirm the specific scheme\'s posture in its offer document before remitting.',
      'The USD/INR is illustrative; the LRS cap is checked at your assumed rate, not the live interbank rate.',
      'The AY 2026-27 Section 50AA debt-test change can reclassify a domestic international FoF you already hold; this calculator covers the GIFT City (IFSCA) route only.',
      'This is a planning model, not a filing compute; reconcile TCS + Schedule FA with a CA before acting.',
    ],
    compute: (v) => {
      const r = giftCityLrsTaxFY27({
        investRupees: v.investRupees,
        priorLrsRemittance: v.priorLrsRemittance,
        monthsHeld: v.monthsHeld,
        gainPct: v.gainPct / 100,
        slabRate: v.slabRate / 100,
        usdInr: v.usdInr,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const results = [
        { label: 'TCS on this remittance', value: cr(r.tcs), sub: '20% of the aggregate LRS above Rs 10L' },
        { label: 'Cash needed at source', value: cr(r.sourceCashNeeded), sub: 'investment + TCS (the reservation)' },
        { label: 'TCS as % of investment', value: (r.tcsPctOfInvestment * 100).toFixed(1) + '%', sub: 'recoverable as a credit at ITR' },
        { label: 'LRS cap check', value: r.exceedsLrsCap ? 'OVER the USD 250k cap' : 'within the cap', sub: 'at ' + v.usdInr + ' USD/INR' },
        { label: 'Indian-side gain treatment', value: r.indianSideTreatment.holdingClass, sub: r.indianSideTreatment.note },
        { label: 'Indian-side tax on the gain', value: cr(r.indianSideTreatment.taxOnGain), sub: (r.indianSideTreatment.rate * 100).toFixed(1) + '% x gain' },
        { label: 'Fund-level post-tax NAV', value: 'no separate CG', sub: r.fundLevelPostTaxNav.note },
      ];
      return {
        results,
        chart: {
          title: 'GIFT City remittance cash-flow (Rs L)',
          alt: 'Bar chart of the investment, TCS, and total cash needed at source for the LRS remittance',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: ['Investment', 'TCS', 'At source'] },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.investRupees), itemStyle: { color: '#3a6ea5' } },
                  { value: Math.round(r.tcs), itemStyle: { color: '#c65d3b' } },
                  { value: Math.round(r.sourceCashNeeded), itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'gift-city-route-comparison',
    title: 'GIFT City vs Direct LRS: The Net-After-Tax Route Decision (TER + embedded CG + Schedule FA)',
    category: 'International',
    description:
      'Compare the two reliable global routes on the same corpus: a GIFT City IFSC fund (TER netted in, the fund-level embedded CG tax - 14.95% LTCG / 42.74% STCG per DSP - and no Schedule FA on the DSP position) vs a direct LRS US ETF (low TER, 12.5% no-indexation LTCG, Schedule FA + the 20% TCS reservation). Shows which route has the higher final value and why.',
    inputs: [
      { key: 'invest', label: 'Amount deployed (Rs)', default: 500000, min: 0, step: 50000, hint: 'The capital in this global sleeve; the TCS reservation is modelled separately on the gift-city-lrs-tax calculator.' },
      { key: 'grossAnnualReturn', label: 'Index annual return (%)', default: 10, min: 0, max: 30, step: 0.5, hint: 'The pre-cost underlying index return (e.g. S&P 500 / Nasdaq 100). A planning input, not a forecast.' },
      { key: 'yearsHeld', label: 'Years held', default: 5, min: 0, max: 30, step: 1, hint: '2+ years makes the gain long-term on both routes; under 2 years the STCG rates apply.' },
      { key: 'giftAllInTer', label: 'GIFT City all-in TER (%)', default: 0.35, min: 0, max: 5, step: 0.05, hint: 'PPFAS S&P 500 FoF is ~0.35% all-in; DSP Global Equity up to ~1.75%; domestic-equity GIFT City funds can run ~2.5%.' },
      { key: 'giftTaxRate', label: 'GIFT City fund-level CG rate (%)', default: 14.95, min: 0, max: 50, step: 0.05, hint: 'DSP schedule: 14.95% LTCG (>24 months) or 42.74% STCG. The fund-level embedded tax, not your personal rate.' },
      { key: 'directAllInTer', label: 'Direct US ETF all-in TER (%)', default: 0.03, min: 0, max: 3, step: 0.01, hint: 'VOO-class ~0.03%; Nasdaq-100 ETF ~0.20%. The cheapest fund cost in the comparison.' },
      { key: 'directTaxRate', label: 'Direct-route CG rate (%)', default: 12.5, min: 0, max: 30, step: 0.5, hint: '12.5% no-indexation LTCG after 24 months; the slab rate for STCG (under 24 months).' },
    ],
    assumptions: [
      'The GIFT City route (DSP position) pays CG at the FUND level - 14.95% LTCG / 42.74% STCG - with no investor-side CG and no Schedule FA; confirm the specific scheme\'s posture in its offer document.',
      'The direct LRS route owns the US ETF directly: 12.5% no-indexation LTCG (24mo+) or slab STCG, plus Schedule FA disclosure and the 20% TCS reservation (modelled on the gift-city-lrs-tax calculator).',
      'The all-in TER (scheme TER + underlying-ETF TER) is netted into the base return so it is not double-counted with the cost-drag display figure.',
      'The comparison is on a single deployed amount and a single horizon; a multi-year SIP ladder changes the arithmetic.',
      'Both routes run through the same LRS plumbing for the rupee->dollar move; the TCS reservation applies to both, so it cancels out of the head-to-head.',
    ],
    limitations: [
      'The GIFT City fund-level rate (14.95% / 42.74%) is DSP\'s published schedule; other houses may use a different embedded rate - use the scheme\'s figure, not a house\'s, when comparing.',
      'The 12.5% direct-route rate assumes a 24-month holding; a sub-24-month exit is the slab-rate STCG case, which is materially worse.',
      'The "no Schedule FA on GIFT City" position is the DSP view; if your scheme is instead taxed on the Indian-side foreign-asset rules, re-run with the direct-route tax rate and add the Schedule FA + FAST-DS exposure.',
      'This is a decision model, not a filing computation; reconcile with a CA before remitting.',
    ],
    compute: (v) => {
      const r = giftCityRouteComparison({
        invest: v.invest,
        grossAnnualReturn: v.grossAnnualReturn / 100,
        yearsHeld: v.yearsHeld,
        giftAllInTer: v.giftAllInTer / 100,
        giftTaxRate: v.giftTaxRate / 100,
        directAllInTer: v.directAllInTer / 100,
        directTaxRate: v.directTaxRate / 100,
        directScheduleFa: true,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const pct = (n: number) => (n * 100).toFixed(2) + '%';
      const results = [
        { label: 'GIFT City final value', value: cr(r.giftFinalValue), sub: 'TER ' + v.giftAllInTer + '% + ' + v.giftTaxRate + '% fund-level CG' },
        { label: 'Direct LRS final value', value: cr(r.directFinalValue), sub: 'TER ' + v.directAllInTer + '% + ' + v.directTaxRate + '% CG + Schedule FA' },
        { label: 'Edge', value: r.edgeRoute === 'tie' ? 'tie' : r.edgeRoute + ' wins ' + cr(Math.abs(r.edgeAmount)), sub: pct(r.edgePctOfInvest) + ' of deployed capital' },
        { label: 'GIFT City net return', value: pct(r.giftNetReturnPct), sub: 'after TER + fund-level tax' },
        { label: 'Direct net return', value: pct(r.directNetReturnPct), sub: 'after TER + CG + (Schedule FA carry)' },
        { label: 'Cost drag over ' + v.yearsHeld + ' yr (GIFT vs direct)', value: cr(r.giftCostDragApprox) + ' vs ' + cr(r.directCostDragApprox), sub: 'the linear TER x capital x years' },
        { label: 'CG-rate spread', value: (r.taxRateSpread * 100).toFixed(2) + ' pp', sub: r.taxRateSpread > 0 ? 'GIFT City embedded rate is HIGHER' : 'GIFT City embedded rate is lower' },
        { label: 'Schedule FA exposure', value: r.giftNoScheduleFa ? 'GIFT City avoids it' : 'both carry it', sub: 'the operational, not economic, difference' },
      ];
      return {
        results,
        chart: {
          title: 'GIFT City vs Direct LRS final value (Rs L)',
          alt: 'Bar chart of the final after-tax value on the GIFT City fund-level route vs the direct LRS route for the same corpus and horizon',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: ['GIFT City (fund-level)', 'Direct LRS (+FA)'] },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Final value',
                type: 'bar',
                data: [
                  { value: Math.round(r.giftFinalValue), itemStyle: { color: r.edgeRoute === 'gift' ? '#1f7a5c' : '#3a6ea5' } },
                  { value: Math.round(r.directFinalValue), itemStyle: { color: r.edgeRoute === 'direct' ? '#1f7a5c' : '#8a8f98' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'direct-lrs-us-equity-filing',
    title: 'Direct LRS US-Equity Filing Walkthrough: Dividend FTC + 12.5% LTCG + TCS + Schedule FA (FY 2026-27)',
    category: 'International',
    description:
      'The filing-mechanics layer for a resident Indian who owns US equities directly through a US brokerage under LRS: the 25% US dividend withholding (with a W-8BEN) credited in India via Form 67, the 12.5% no-indexation LTCG (24-month clock, no Rs 1.25L pool on a foreign security) or slab STCG, the 20% TCS reservation on the LRS investment remittance (a recoverable credit), and the Schedule FA disclosure that is mandatory with no minimum threshold - plus the FAST-DS 2026 small-taxpayer window flagged as the separate amnesty layer.',
    inputs: [
      { key: 'dividendRupees', label: 'US dividend received this FY (Rs)', default: 300000, min: 0, step: 10000, hint: 'The gross US dividend, converted to rupees at the relevant rate. 0 if you held a zero-coupon / no-dividend position.' },
      { key: 'usWithholdingRate', label: 'US dividend withholding rate (%)', default: 25, min: 0, max: 30, step: 1, hint: '25% with a Form W-8BEN on file (the individual treaty rate); 30% backup withholding if no W-8BEN. The 15% figure is the corporate-with-voting-stock rate, not the individual rate.' },
      { key: 'capitalGainRupees', label: 'Realized capital gain this FY (Rs)', default: 400000, min: -1000000, max: 10000000, step: 10000, hint: 'The gross realized gain (loss if negative) on the lot sold, in rupees.' },
      { key: 'monthsHeld', label: 'Months held on the sold lot', default: 30, min: 0, max: 240, step: 1, hint: 'US shares are unlisted foreign securities: 24+ months = long-term (12.5% no pool); under 24 months = slab-rate STCG.' },
      { key: 'slabRate', label: 'Your marginal slab rate (%)', default: 30, min: 0, max: 30, step: 5, hint: 'For the dividend + any STCG; the top HNI bracket is 30% before surcharge.' },
      { key: 'lrsRemittance', label: 'LRS investment remittance this FY (Rs)', default: 1200000, min: 0, step: 100000, hint: 'The rupee outflow under LRS that funded the US purchase - the TCS is on the AGGREGATE LRS outflow above the Rs 10L threshold.' },
      { key: 'priorLrsRemittance', label: 'Other LRS remittances this FY (Rs)', default: 0, min: 0, step: 100000, hint: 'Your total LRS outflow before this one; TCS accumulates on the aggregate.' },
    ],
    assumptions: [
      'US dividend withholding is 25% with a W-8BEN on file (the 30% backup rate applies without one); the 15% treaty figure is the corporate-with-voting-stock rate and is NOT the individual rate.',
      'US shares are unlisted foreign securities: LTCG after 24 months at 12.5% without indexation and with NO Rs 1.25L pool (the 112A pool is Indian-listed-equity only); STCG at the slab rate.',
      'The Form 67 foreign-tax-credit caps the credit at the lesser of the India dividend tax and the US withholding actually paid.',
      'The 20% TCS on the LRS investment remittance above the Rs 10L threshold is a recoverable credit against your final tax, not a cost.',
      'Schedule FA is mandatory for a US brokerage position, with no minimum threshold, every year while held.',
    ],
    limitations: [
      'The W-8BEN must be valid for the withholding year; a lapsed or missing form pushes the rate to the 30% backup.',
      'This is a filing-computation model, not a Form 67 / Schedule FSI utility - reconcile with the ITR e-file before acting.',
      'The FAST-DS 2026 window (Finance Act 2026, Ch. IV, ~15 Aug to 31 Dec 2026) is the amnesty layer for UNDISCLOSED foreign assets; a normally-reported US position does not need FAST-DS.',
      'FX conversion of the gain / dividend to rupees uses the rate on the relevant date; the calculator takes rupee inputs.',
    ],
    compute: (v) => {
      const r = directLrsUsEquityFilingFY27({
        dividendRupees: v.dividendRupees,
        usWithholdingRate: v.usWithholdingRate / 100,
        capitalGainRupees: v.capitalGainRupees,
        monthsHeld: v.monthsHeld,
        slabRate: v.slabRate / 100,
        lrsRemittance: v.lrsRemittance,
        priorLrsRemittance: v.priorLrsRemittance,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const results = [
        { label: 'US withholding on the dividend', value: cr(r.usWithholdingPaid), sub: v.usWithholdingRate + '% (W-8BEN ' + (v.usWithholdingRate < 30 ? 'on file' : 'backup') + ')' },
        { label: 'Form 67 foreign-tax-credit', value: cr(r.foreignTaxCredit), sub: 'capped at the lesser of India dividend tax and US withholding' },
        { label: 'Net dividend tax', value: cr(r.netDividendTax), sub: 'slab tax minus the credit' },
        { label: 'CG head + rate', value: r.cgHead.toUpperCase() + ' at ' + (r.cgRate * 100).toFixed(1) + '%', sub: r.noLtcgPool ? 'LTCG: no Rs 1.25L pool on a foreign security' : 'STCG at the slab rate' },
        { label: 'CG tax', value: cr(r.cgTax), sub: 'on the realized gain' },
        { label: 'TCS on the LRS remittance', value: cr(r.tcs), sub: '20% above the Rs 10L threshold - recoverable at ITR' },
        { label: 'Total Indian tax on the foreign income', value: cr(r.totalBurden), sub: 'net dividend tax + CG tax (before the TCS credit)' },
        { label: 'Schedule FA', value: r.scheduleFaRequired ? 'required (no threshold)' : 'not required', sub: 'disclose the US position every year while held' },
      ];
      return {
        results,
        chart: {
          title: 'Direct LRS US-equity tax layers (Rs L)',
          alt: 'Bar chart of the Indian tax layers on the US position: US withholding, the Form 67 credit, net dividend tax, the CG tax, and the TCS reservation',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: {
              type: 'category',
              data: ['US withholding', 'Form 67 credit', 'Net div tax', 'CG tax', 'TCS'],
            },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.usWithholdingPaid), itemStyle: { color: '#c65d3b' } },
                  { value: Math.round(r.foreignTaxCredit), itemStyle: { color: '#1f7a5c' } },
                  { value: Math.round(r.netDividendTax), itemStyle: { color: '#3a6ea5' } },
                  { value: Math.round(r.cgTax), itemStyle: { color: '#6b5b8a' } },
                  { value: Math.round(r.tcs), itemStyle: { color: '#8a8f98' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'fast-ds-declaration',
    title: 'FAST-DS 2026 Declaration: The Small-Taxpayer Foreign-Asset Amnesty Cost (30%+equal / flat Rs 1L)',
    category: 'Tax',
    description:
      'The FAST-DS 2026 (Foreign Assets of Small Taxpayers - Disclosure Scheme, Finance Act 2026 Ch. IV, window 16 Aug to 31 Dec 2026) decision tool: which category your undisclosed foreign asset falls into - Category A (undisclosed, up to Rs 1 cr: 30% tax plus an equal additional amount = 60% of value) or Category B (already-taxed-but-missed-in-Schedule-FA, up to Rs 5 cr: a flat Rs 1,00,000 fee) - and the effective cost of the regularisation plus the immunity you get.',
    inputs: [
      { key: 'disclosedValue', label: 'Disclosed foreign asset / income value (Rs)', default: 5000000, min: 0, step: 100000, hint: 'The value as of the 31 March 2026 reference date, in rupees, for the asset/income you would declare.' },
      { key: 'category', label: 'FAST-DS category', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'Category A - undisclosed (30% + equal additional = 60%)' }, { value: 1, label: 'Category B - missed Schedule FA (flat Rs 1L fee)' }], hint: 'A = the asset/income was never reported and is up to Rs 1 cr. B = the asset was already taxed elsewhere or acquired during non-residence but was simply omitted from Schedule FA, up to Rs 5 cr.' },
      { key: 'categoryATaxRate', label: 'Category A tax rate (%)', default: 30, min: 0, max: 100, step: 1, hint: 'The scheme rate plus an equal additional amount; the default 30% + equal = 60% total.' },
    ],
    assumptions: [
      'FAST-DS 2026 = Foreign Assets of Small Taxpayers - Disclosure Scheme, Finance Act 2026 Chapter IV (sections 130-144), Rules notified 15 Aug 2026; window 16 Aug to 31 Dec 2026; reference date 31 Mar 2026.',
      'Category A: undisclosed foreign assets / income up to Rs 1 cr -> 30% tax plus an equal additional amount (60% of value total).',
      'Category B: specified foreign assets up to Rs 5 cr that were already taxed elsewhere / acquired during non-residence but omitted from Schedule FA -> a flat Rs 1,00,000 fee.',
      'Above the category ceiling the scheme cannot be used for that asset; the value must be as of the 31 March 2026 reference date.',
      'A valid declaration + payment gives immunity from further tax, penalty and Black Money Act prosecution for the declared asset/income.',
    ],
    limitations: [
      'FAST-DS is a ONE-TIME window (31 Dec 2026 deadline) and does NOT replace the ongoing Schedule FA obligation for future years.',
      'It excludes assets linked to proceeds of crime and years where a Black Money Act assessment is already complete; eligibility also depends on the residential-status conditions.',
      'The valuation method is per the FAST-DS Rules, 2026 (Rule 3); this calculator takes the rupee value as an input rather than computing the valuation itself.',
      'This is a decision model, not a Form 1 declaration - reconcile with the official FAST-DS process and a CA before acting.',
    ],
    compute: (v) => {
      const r = fastDSDisclosureFY26({
        disclosedValue: v.disclosedValue,
        category: v.category > 0.5 ? 'missed-schedule-fa' : 'undisclosed',
        categoryATaxRate: v.categoryATaxRate / 100,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const results = [
        { label: 'FAST-DS eligibility', value: r.eligible ? 'eligible' : 'over the ceiling', sub: r.category + ' (ceiling ' + cr(r.ceiling) + ')' },
        { label: 'Payable (tax / fee)', value: cr(r.payable), sub: r.category === 'undisclosed' ? '30% + equal additional' : 'flat Rs 1L fee' },
        { label: 'Tax portion + additional', value: cr(r.taxPortion) + ' + ' + cr(r.additionalAmountPortion), sub: r.category === 'undisclosed' ? 'the two 30% legs' : 'Category B has no percentage legs' },
        { label: 'Effective cost', value: (r.effectiveCostPct * 100).toFixed(1) + '%', sub: 'of the disclosed value' },
        { label: 'Immunity granted', value: 'Black Money Act', sub: 'no further tax / penalty / prosecution for the declared asset' },
        { label: 'Window', value: '31 Dec 2026', sub: 'one-time; Schedule FA continues after' },
      ];
      return {
        results,
        chart: {
          title: 'FAST-DS 2026 cost breakdown (Rs L)',
          alt: 'Bar chart of the FAST-DS cost: the tax portion, the equal additional amount, and the total payable for the disclosed value',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: ['Tax', 'Additional', 'Total payable'] },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.taxPortion), itemStyle: { color: '#3a6ea5' } },
                  { value: Math.round(r.additionalAmountPortion), itemStyle: { color: '#c65d3b' } },
                  { value: Math.round(r.payable), itemStyle: { color: r.eligible ? '#1f7a5c' : '#8a8f98' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'black-money-act-exposure',
    title: 'Black Money Act Exposure: The Counterfactual When You Miss FAST-DS + Schedule FA (FY 2026-27)',
    category: 'Tax',
    description:
      'The "what if you do nothing" layer: the Black Money Act 2015 counterfactual exposure for an undisclosed foreign asset that is neither regularised under FAST-DS 2026 nor disclosed in Schedule FA - the Section 40 30% tax + the Section 41 penalty of 3x the tax (90% of value, a 120% total) + the flat Rs 10L per-year Section 43/44 Schedule FA penalty (waived for non-immovable assets at or under the Rs 20L Finance-Act-2026 threshold) - and the gap that is the whole reason the one-time amnesty exists.',
    inputs: [
      { key: 'undisclosedValue', label: 'Undisclosed foreign asset / income value (Rs)', default: 5000000, min: 0, step: 100000, hint: 'The value that was never disclosed in Schedule FA and not regularised under FAST-DS. The counterfactual is priced on this value.' },
      { key: 'nonDisclosureYears', label: 'Years the non-disclosure persisted', default: 3, min: 1, max: 30, step: 1, hint: 'The flat Rs 10L Schedule FA penalty is per defaulting assessment year; more years = more accumulated flat penalty.' },
      { key: 'nonImmovable', label: 'Is it a non-immovable asset?', default: 1, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 1, label: 'Yes - non-immovable (a foreign bank account / shares / fund)' }, { value: 0, label: 'No - immovable (foreign real estate)' }], hint: 'The Finance Act 2026 exception waives the flat Rs 10L penalty only for non-immovable assets at or under the Rs 20L threshold; foreign real estate always attracts it.' },
    ],
    assumptions: [
      'Section 40 of the Black Money Act 2015 levies a 30% tax on the undisclosed foreign income/asset.',
      'Section 41 adds a penalty of THREE times the tax (90% of the value), so the tax + penalty total is 120% of the undisclosed value.',
      'Section 43/44 adds a flat Rs 10,00,000 penalty per defaulting assessment year for failing to disclose the asset in Schedule FA.',
      'Since the Finance Act 2026, the flat Rs 10L penalty does NOT apply where the aggregate value of NON-IMMOVABLE foreign assets is at or under Rs 20 lakh.',
      'The FAST-DS Category A defined cost for the same value is 60% of value (30% + an equal additional amount) - the gap between this counterfactual and that is the reason the amnesty exists.',
    ],
    limitations: [
      'This is the COUNTERFACTUAL exposure, not a charge you actually pay - it is what the department would assess if it found the undisclosed asset.',
      'The BMA "may" under Section 43 has been read by a Mumbai ITAT Special Bench as directory (discretionary), not mandatory - the department has discretion in some cases, so treat the flat penalty as the worst case, not a certainty.',
      'The 120% figure is tax + penalty on the value; interest, prosecution and any Income-tax Act misreporting penalty are separate and not modelled here.',
      'The Finance Act 2026 Rs 20L non-immovable threshold and the Section 40/41 rates can move at a Budget - verify before acting on a specific asset.',
    ],
    compute: (v) => {
      const r = blackMoneyActExposure({
        undisclosedValue: v.undisclosedValue,
        nonDisclosureYears: v.nonDisclosureYears,
        nonImmovable: v.nonImmovable > 0.5,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const results = [
        { label: 'BMA tax (Sec 40, 30%)', value: cr(r.bmaTax), sub: 'on the undisclosed value' },
        { label: 'BMA penalty (Sec 41, 90%)', value: cr(r.bmaPenalty), sub: '3x the tax' },
        { label: 'Tax + penalty', value: cr(r.totalBmaCharge), sub: (r.effectivePctOfValue * 100).toFixed(0) + '% of the value' },
        { label: 'Flat Schedule FA penalty', value: cr(r.totalFlatPenalty), sub: r.flatPenaltyApplies ? v.nonDisclosureYears + ' yr x Rs 10L' : 'waived (FA-2026 exception)' },
        { label: 'Total counterfactual exposure', value: cr(r.totalCounterfactualExposure), sub: 'what "doing nothing" costs' },
        { label: 'FAST-DS Category A would cost', value: cr(r.fastDsCategoryACost), sub: 'the defined 60% route' },
        { label: 'Saving from the amnesty', value: cr(r.fastDsCategoryASaving), sub: 'the gap that is why FAST-DS exists' },
      ];
      return {
        results,
        chart: {
          title: 'Counterfactual vs FAST-DS cost (Rs L)',
          alt: 'Bar chart of the Black Money Act counterfactual exposure (tax, penalty, flat penalty, total) versus the FAST-DS Category A defined cost',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: {
              type: 'category',
              data: ['BMA tax', 'BMA penalty', 'Flat penalty', 'Total exposure', 'FAST-DS A'],
            },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.bmaTax), itemStyle: { color: '#c65d3b' } },
                  { value: Math.round(r.bmaPenalty), itemStyle: { color: '#a53a3a' } },
                  { value: Math.round(r.totalFlatPenalty), itemStyle: { color: '#8a8f98' } },
                  { value: Math.round(r.totalCounterfactualExposure), itemStyle: { color: '#5a2a2a' } },
                  { value: Math.round(r.fastDsCategoryACost), itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },

  {
    id: 'fast-ds-valuation-guard',
    title: 'FAST-DS 2026 Valuation Guard: Did You Value It Right? (Rule 3 + the 20% Rule-5(2) Safeguard)',
    category: 'Tax',
    description:
      'The "did I value the asset right?" layer for a FAST-DS 2026 declaration: the 31 March 2026 valuation date, the Rule 3 per-asset-class FMV, the RBI-reference-rate currency conversion, and - the gotcha - the 20% valuation-variance safeguard in Rule 5(2). If the FMV you declared in Form 1 differs from the FMV the authority later determines by more than 20% of what you declared, the charge is re-computed on the higher value and your payable rises. Shows Track A (60%) vs Track B (flat Rs 1L), the variance, the payable that actually applies, and the 1%-per-month late-payment interest.',
    inputs: [
      { key: 'declaredFmv', label: 'FMV you declared in Form 1 (Rs)', default: 4000000, min: 0, step: 100000, hint: 'The fair market value of the asset as of the 31 Mar 2026 valuation date, in rupees, that you put in Form 1. Under-stating it is the trap this calculator surfaces.' },
      { key: 'determinedFmv', label: 'FMV the authority would determine (Rs)', default: 5000000, min: 0, step: 100000, hint: 'The "true" FMV an assessing officer would arrive at on assessment / inquiry. If it exceeds your declared value by more than 20%, the 20% safeguard fails and the charge is re-computed on this higher value.' },
      { key: 'track', label: 'FAST-DS track', default: 0, min: 0, max: 1, step: 1, type: 'select', options: [{ value: 0, label: 'Track A - undisclosed (60% of value, up to Rs 1 cr)' }, { value: 1, label: 'Track B - missed Schedule FA (flat Rs 1L fee, up to Rs 5 cr)' }], hint: 'Track A = the asset/income was never reported. Track B = it was taxed elsewhere but missed from Schedule FA.' },
      { key: 'latePaymentMonths', label: 'Form 3 payment delay (months past the window)', default: 0, min: 0, max: 36, step: 1, hint: '1% interest per month (or part) applies to the payable after the initial two-month payment window closes.' },
    ],
    assumptions: [
      'FAST-DS Rules 2026 (G.S.R. 732(E), 14 Aug 2026; in force 16 Aug 2026; last date 31 Dec 2026); the valuation date is fixed at 31 Mar 2026 (Rule 2(1)(e)).',
      'Track A = 30% tax + an additional amount equal to 100% of that tax = 60% of the value; the ceiling is Rs 1 cr.',
      'Track B = a flat Rs 1,00,000 fee; the ceiling is Rs 5 cr.',
      'The 20% Rule 5(2) safeguard: the declaration is not invalid merely because the FMV varies, provided the variance is within 20% of the DECLARED FMV; above that the charge re-computes on the higher determined value.',
      'Late payment of the Form 3 amount attracts 1% interest per month (or part) on the payable.',
    ],
    limitations: [
      'The "determined FMV" is your best estimate of what an assessing officer would arrive at; the department re-values using Rule 3 and the RBI reference rate, so a declared value materially below that is the risk.',
      'Currency conversion uses the RBI reference rate on the valuation date (Rule 3(4)/(5)); the calculator takes rupee values, not a live FX compute.',
      'FAST-DS regularises the tax / Black Money Act exposure; it does NOT automatically settle FEMA / exchange-control exposure.',
      'This is a valuation-guard model, not a Form 1 filing; reconcile with the notified Rules and a CA before acting.',
    ],
    compute: (v) => {
      const r = fastDSValuationGuard({
        declaredFmv: v.declaredFmv,
        determinedFmv: v.determinedFmv,
        track: v.track > 0.5 ? 'B' : 'A',
        latePaymentMonths: v.latePaymentMonths,
      });
      const cr = (n: number) => 'Rs ' + Math.round(n / 100000).toLocaleString('en-IN') + 'L';
      const results = [
        { label: 'Valuation variance', value: (r.variancePct * 100).toFixed(1) + '%', sub: 'determined vs declared FMV (the 20% Rule-5(2) test)' },
        { label: '20% safeguard', value: r.valuationSafeguardHolds ? 'HOLDS (stands on declared value)' : 'FAILED (re-computed on determined value)', sub: 'the declaration is invalid only above 20%' },
        { label: 'Payable (track ' + r.track + ')', value: cr(r.payableFinal), sub: r.track === 'A' ? '60% of the charge base' : 'flat Rs 1L fee' },
        { label: 'Payable if declared (vs re-valued)', value: cr(r.payableIfDeclared) + ' vs ' + cr(r.payableIfRevalued), sub: 'the gap the safeguard closes' },
        { label: 'Eligible at determined value', value: r.eligibleAtDetermined ? 'yes' : 'NO - over the ceiling', sub: r.track === 'A' ? 'Rs 1 cr ceiling' : 'Rs 5 cr ceiling' },
        { label: 'Late-payment interest', value: cr(r.latePaymentInterest), sub: '1%/month x ' + v.latePaymentMonths + ' months' },
        { label: 'Total outflow', value: cr(r.totalOutflow), sub: 'payable + late interest' },
      ];
      return {
        results,
        chart: {
          title: 'FAST-DS payable: declared vs re-valued (Rs L)',
          alt: 'Bar chart of the FAST-DS payable on the declared FMV versus the re-valued (determined) FMV, plus the late-payment interest and the total outflow',
          option: {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: {
              type: 'category',
              data: ['If declared', 'If re-valued', 'Late interest', 'Total outflow'],
            },
            yAxis: { type: 'value', axisLabel: { formatter: (x) => 'Rs ' + Math.round(x / 100000) + 'L' } },
            grid: { left: 70, right: 20, top: 30, bottom: 50 },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: [
                  { value: Math.round(r.payableIfDeclared), itemStyle: { color: '#3a6ea5' } },
                  { value: Math.round(r.payableIfRevalued), itemStyle: { color: r.valuationSafeguardHolds ? '#8a8f98' : '#c65d3b' } },
                  { value: Math.round(r.latePaymentInterest), itemStyle: { color: '#8a8f98' } },
                  { value: Math.round(r.totalOutflow), itemStyle: { color: '#1f7a5c' } },
                ],
                label: { show: true, formatter: (p) => 'Rs ' + Math.round(p.value / 1e5) + 'L' },
              },
            ],
          },
        },
      };
    },
  },
];

export function getCalc(id: string): CalcDef | undefined {
  return CALCULATORS.find((c) => c.id === id);
}
