/**
 * Formatting helpers used by calculators and article examples.
 * Kept dependency-free so tests run under Node.
 */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrDec = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const plain = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** Format a number as Indian-rupee (no decimals), e.g. ₹1,23,456. */
export function formatINR(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return inr.format(n);
}

/** Format a number as Indian-rupee with 2 decimals. */
export function formatINR2(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return inrDec.format(n);
}

/** Format a percentage like 12.34%. */
export function formatPercent(fraction: number, digits = 2): string {
  if (!Number.isFinite(fraction)) return '—';
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Format a plain number with Indian digit grouping. */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return plain.format(n);
}

/** Compact Indian notation (Lakh / Crore) for large values. */
export function formatCompactINR(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  return `${sign}₹${plain.format(abs)}`;
}

/** Reading-time estimate in minutes (~200 wpm for a motivated Indian reader). */
export function readingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
