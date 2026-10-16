/**
 * check-links.mjs
 * Validates that every relative internal link target referenced in the
 * registries (articles.json `related`, `books`; instruments.json `articleId`;
 * book chapters) resolves to a registered article, and that every source URL
 * is well-formed http(s).
 *
 * This is a registry-level link check (fast, deterministic). The built site's
 * on-page link integrity is exercised by the Playwright e2e suite instead.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(path.join(repoRoot, p), 'utf8'));

const articles = read('content-registry/articles.json').articles;
const books = read('content-registry/books.json').books;
const instruments = read('content-registry/instruments.json').instruments;
const sources = read('content-registry/sources.json');

const ids = new Set(articles.map((a) => a.id));
let errors = [];

// related / books refs
for (const a of articles) {
  for (const r of a.related ?? []) if (!ids.has(r)) errors.push(`Article ${a.id}: related "${r}" not found`);
  for (const b of a.books ?? []) if (!read('content-registry/books.json').books.some((x) => x.id === b)) errors.push(`Article ${a.id}: book "${b}" not found`);
}
// book chapters
for (const b of books) for (const c of b.chapters) if (!ids.has(c)) errors.push(`Book ${b.id}: chapter "${c}" not found`);
// instrument article refs
for (const i of instruments) if (!ids.has(i.articleId)) errors.push(`Instrument ${i.id}: articleId "${i.articleId}" not found`);
// source URL well-formedness
for (const s of sources) {
  try {
    const u = new URL(s.url);
    if (!['http:', 'https:'].includes(u.protocol)) errors.push(`Source ${s.id}: bad protocol ${u.protocol}`);
  } catch (e) {
    errors.push(`Source ${s.id}: invalid URL "${s.url}"`);
  }
}

console.log(`[check-links] ${articles.length} articles, ${books.length} books, ${instruments.length} instruments, ${sources.length} sources`);
for (const e of errors) console.log(`  ✗ ${e}`);
if (errors.length) {
  console.log(`[check-links] ${errors.length} broken reference(s) — FAILED`);
  process.exit(1);
}
console.log('[check-links] OK — all registry references resolve');
