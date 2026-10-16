/**
 * Central site metadata for DhanPedia.
 * Edit these values in one place; all pages and exports read from here.
 */
export const SITE = {
  name: 'DhanPedia',
  tagline: "India's Encyclopedia of Investing, Money & Wealth.",
  taglineAlt: 'Understand Every Investment. Build Wealth With Knowledge.',
  description:
    'A free, evidence-based educational encyclopedia covering every major investment avenue, financial instrument, wealth-building strategy and personal-finance topic relevant to India — with clear explanations, accurate calculators, and downloadable books.',
  author: 'Chirag Singhal',
  authorEmail: 'chirag@oriz.in',
  facebook: 'https://www.facebook.com/singhal127',
  support: 'https://buymeacoffee.com/chirag127',
  githubOwner: 'chirag127',
  githubRepo: 'dhanpedia',
  // Canonical *domain root*. GitHub Pages serves this project site under the
  // /dhanpedia sub-path; that sub-path is supplied by Astro `base` (BASE_PATH),
  // so it must NOT be duplicated in origin or canonical/OG URLs will double up.
  origin: 'https://chirag127.github.io',
  repoUrl: 'https://github.com/chirag127/dhanpedia',
  locale: 'en-IN',
  themeColor: '#0f3a2e',
} as const;

export type CategoryId =
  | 'financial-foundations'
  | 'banking-cash'
  | 'government-schemes'
  | 'mutual-funds'
  | 'equities'
  | 'fixed-income'
  | 'p2p-lending'
  | 'gold-commodities'
  | 'real-estate'
  | 'insurance'
  | 'retirement-fire'
  | 'international'
  | 'derivatives'
  | 'alternatives'
  | 'taxation'
  | 'portfolio-construction'
  | 'personal-finance';

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  slug: string;
  short: string;
  blurb: string;
  icon: string;
  order: number;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'financial-foundations', title: 'Financial Foundations', slug: 'financial-foundations', short: 'Foundations', blurb: 'Money basics, returns, risk, compounding, inflation and how to think about investing.', icon: 'landmark', order: 1 },
  { id: 'personal-finance', title: 'Personal Finance & Independence', slug: 'personal-finance', short: 'Personal Finance', blurb: 'Budgeting, debt, credit, goals, EMI, fraud prevention and building toward financial independence.', icon: 'piggy-bank', order: 2 },
  { id: 'banking-cash', title: 'Banking & Cash Management', slug: 'banking-cash', short: 'Banking', blurb: 'Deposits, recurring deposits, FDs, sweep-in, payment & small-finance banks, and emergency funds.', icon: 'landmark', order: 3 },
  { id: 'government-schemes', title: 'Government Savings & Securities', slug: 'government-schemes', short: 'Govt. Schemes', blurb: 'PPF, EPF, NPS, APY, SCSS, SSY, NSC, KVP, post-office schemes, treasury bills and sovereign gold bonds.', icon: 'shield', order: 4 },
  { id: 'mutual-funds', title: 'Mutual Funds, ETFs & Index Investing', slug: 'mutual-funds', short: 'Mutual Funds', blurb: 'Fund types, direct vs regular plans, SIP/SWP/STP, ETFs, index funds, costs and taxation.', icon: 'pie-chart', order: 5 },
  { id: 'equities', title: 'Stocks & Equity Investing', slug: 'equities', short: 'Equities', blurb: 'Shareholders, IPOs, fundamentals, valuation, DCF, dividend/quality/value/growth and behavioural traps.', icon: 'trending-up', order: 6 },
  { id: 'fixed-income', title: 'Fixed Income, Bonds & Credit', slug: 'fixed-income', short: 'Bonds', blurb: 'Bond pricing, yields, duration, credit ratings, spreads, default risk and listed debt.', icon: 'bar-chart-3', order: 7 },
  { id: 'p2p-lending', title: 'P2P Lending & Alternative Credit', slug: 'p2p-lending', short: 'P2P Lending', blurb: 'How RBI-regulated P2P works, platform due diligence, credit loss, recovery, returns and taxation.', icon: 'hand-coins', order: 8 },
  { id: 'gold-commodities', title: 'Gold, Silver & Commodities', slug: 'gold-commodities', short: 'Gold & Commodities', blurb: 'Physical bullion, gold ETFs, SGBs, commodity cycles, currency and hedging limits.', icon: 'coins', order: 9 },
  { id: 'real-estate', title: 'Real Estate, REITs & Land', slug: 'real-estate', short: 'Real Estate', blurb: 'Residential & commercial property, REITs, InvITs, rental yield, title, RERA and liquidity.', icon: 'building-2', order: 10 },
  { id: 'insurance', title: 'Insurance & Risk Protection', slug: 'insurance', short: 'Insurance', blurb: 'Term, health, critical illness, motor & travel insurance, riders, claims data and mis-selling.', icon: 'heart-pulse', order: 11 },
  { id: 'retirement-fire', title: 'Retirement & FIRE', slug: 'retirement-fire', short: 'Retirement', blurb: 'Corpus planning, withdrawal rates, sequence risk, pensions, estate planning and decumulation.', icon: 'umbrella', order: 12 },
  { id: 'international', title: 'International Investing & Currency', slug: 'international', short: 'International', blurb: 'Global diversification, international funds, LRS, FX risk and overseas reporting.', icon: 'globe', order: 13 },
  { id: 'derivatives', title: 'Derivatives & Advanced Trading', slug: 'derivatives', short: 'Derivatives', blurb: 'Futures, options, greeks, hedging, backtesting limits and why most retail traders lose.', icon: 'activity', order: 14 },
  { id: 'alternatives', title: 'Alternative Investments', slug: 'alternatives', short: 'Alternatives', blurb: 'REIT/InvIT, private markets, startups, collectibles, digital assets and niche opportunities.', icon: 'puzzle', order: 15 },
  { id: 'taxation', title: 'Taxation, Regulation & Legal', slug: 'taxation', short: 'Taxation', blurb: 'Capital gains, slab regimes, TDS, reporting, SEBI/RBI/IRDAI frameworks and key legal distinctions.', icon: 'scroll-text', order: 16 },
  { id: 'portfolio-construction', title: 'Portfolio Construction & Asset Allocation', slug: 'portfolio-construction', short: 'Portfolios', blurb: 'Allocation, rebalancing, diversification, fee drag, risk budgeting and behaviour under uncertainty.', icon: 'scale', order: 17 },
];

export function categoryById(id: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
