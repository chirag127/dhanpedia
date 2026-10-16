/**
 * build-report.mjs
 * Honest post-build summary: what actually got generated, what didn't.
 * Reads the downloads manifest + the built dist/ tree and prints a table.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(repoRoot, 'dist');

let manifest = { books: [], articles: [] };
try { manifest = JSON.parse(readFileSync(path.join(repoRoot, 'public', 'downloads', 'manifest.json'), 'utf8')); } catch { /* first run */ }

function walk(dir, exts = []) {
  const out = [];
  (function rec(d) {
    if (!existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) rec(p);
      else if (!exts.length || exts.some((x) => p.endsWith(x))) out.push(p);
    }
  })(dir);
  return out;
}

const htmlPages = walk(dist, ['.html']);
const pdfs = walk(dist, ['.pdf']);
const epubs = walk(dist, ['.epub']);

const okBooks = manifest.books.filter((b) => !b.failed && b.formats?.length);
const badBooks = manifest.books.filter((b) => b.failed);
const okArticles = manifest.articles.filter((a) => !a.failed);

console.log('=== DhanPedia build report ===');
console.log(`  HTML pages:            ${htmlPages.length}`);
console.log(`  Books (generated):     ${okBooks.length}  ${badBooks.length ? `(failed: ${badBooks.length})` : ''}`);
for (const b of badBooks) console.log(`    ✗ ${b.id}: ${b.error}`);
console.log(`  Per-article files:     ${okArticles.length} articles × (md/txt/html)`);
console.log(`  PDF files in dist:     ${pdfs.length}`);
console.log(`  EPUB files in dist:    ${epubs.length}`);

// Per-book format sizes (from manifest, authoritative)
for (const b of okBooks) {
  console.log(`  \n  ${b.title} (v${b.version})`);
  for (const f of b.formats) {
    console.log(`    · ${f.name.padEnd(24)} ${(f.bytes / 1024).toFixed(1).padStart(6)} KB  ${f.path}`);
  }
}

// Verify each manifest file actually exists on disk in public/downloads
let missing = 0;
const check = (rel) => { if (!existsSync(path.join(repoRoot, rel))) { missing++; console.log(`    ✗ missing on disk: ${rel}`); } };
okBooks.forEach((b) => b.formats.forEach((f) => check(f.path)));
okArticles.forEach((a) => a.formats.forEach((f) => check(f.path)));
if (missing) {
  console.log(`\n[build-report] ${missing} manifest file(s) missing on disk — FAILED`);
  process.exit(1);
}
console.log('\n[build-report] OK — all manifest files present on disk');
