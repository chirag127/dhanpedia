// Register the SIF article in articles.json + add it to the wealth-beyond-10l
// book chapters. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';

// --- articles.json ---
const ap = './content-registry/articles.json';
const a = JSON.parse(readFileSync(ap, 'utf8'));
if (!a.articles.find((x) => x.id === 'alternatives-sif-specialized-funds')) {
  a.articles.push({
    id: 'alternatives-sif-specialized-funds',
    title:
      'Specialized Investment Funds (SIF): India\u2019s New ₹10 Lakh Tier Between Mutual Funds and PMS',
    category: 'alternatives',
    difficulty: 'advanced',
    status: 'published',
    tags: ['sif', 'pms', 'aif', 'sebi-2026', 'long-short', 'hni'],
    summary:
      'SEBI\u2019s SIF category (effective 1 April 2026) explained end-to-end: the ₹10 lakh minimum, long-short and market-neutral strategies, tax treatment, risk math, and the MF → SIF → PMS → AIF ladder for a ₹10L starter.',
    file: 'src/content/alternatives/alternatives-sif-specialized-funds.mdx',
    sources: ['src-sebi-sif-2026', 'src-sebi-mf-regulations-2026'],
    related: [
      'alternatives-pms-aif-private',
      'mf-choosing-comparing-funds',
      'pf-wealth-plan-10-lakh',
    ],
    books: ['book-wealth-beyond-10l'],
  });
  console.log('[articles] SIF registered, total now', a.articles.length);
}
writeFileSync(ap, JSON.stringify(a, null, 2) + '\n');

// --- books.json: insert SIF chapter in the ladder order (after PMS/AIF tier intro) ---
const bp = './content-registry/books.json';
const b = JSON.parse(readFileSync(bp, 'utf8'));
const book = b.books.find((x) => x.id === 'book-wealth-beyond-10l');
if (book && !book.chapters.includes('alternatives-sif-specialized-funds')) {
  // Place SIF right before the PMS/AIF chapter so the ladder reads
  // ₹10L plan → SIP goals → SIF (new tier) → PMS/AIF → international → REIT → FIRE
  const i = book.chapters.indexOf('alternatives-pms-aif-private');
  book.chapters.splice(i === -1 ? book.chapters.length : i, 0, 'alternatives-sif-specialized-funds');
  console.log('[books] chapters now:', book.chapters.join(' | '));
}
writeFileSync(bp, JSON.stringify(b, null, 2) + '\n');
console.log('done');
