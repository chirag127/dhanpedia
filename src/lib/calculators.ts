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
  portfolioExpectedReturn, maxDrawdown,
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
];

export function getCalc(id: string): CalcDef | undefined {
  return CALCULATORS.find((c) => c.id === id);
}
