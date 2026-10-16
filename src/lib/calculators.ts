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
  sifSleeveSizing, businessTrustTiming,
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
];

export function getCalc(id: string): CalcDef | undefined {
  return CALCULATORS.find((c) => c.id === id);
}
