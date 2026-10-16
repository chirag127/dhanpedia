/**
 * validate-content.mjs
 * Checks the content registries and article files for structural integrity:
 *  - every articles.json entry has a file that exists
 *  - frontmatter id matches the registry id
 *  - sources cited by articles exist in sources.json
 *  - no unregistered MDX files under src/content
 *  - no unresolved placeholders in published articles
 *  - books reference only registered article ids
 * Exits 1 on failure (used by `npm run build` and CI).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(path.join(repoRoot, p), 'utf8'));

const articles = read('content-registry/articles.json').articles;
const books = read('content-registry/books.json').books;
const sources = read('content-registry/sources.json');
const sourceIds = new Set(sources.map((s) => s.id));

let errors = [];
let warnings = [];

// 1. Article files exist & ids match
for (const a of articles) {
  const file = path.join(repoRoot, a.file);
  if (!existsSync(file)) {
    errors.push(`Article ${a.id}: missing file ${a.file}`);
    continue;
  }
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\s*[\s\S]*?^---\s*$/m);
  if (!m) {
    errors.push(`Article ${a.id}: no frontmatter block`);
    continue;
  }
  const fmBlock = m[0];
  const fmId = (fmBlock.match(/^id:\s*(.+)$/m)?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
  if (fmId !== a.id) {
    errors.push(`Article ${a.id}: frontmatter id "${fmId}" does not match registry id`);
  }
  // Check that sources cited in frontmatter exist.
  const srcMatch = fmBlock.match(/^sources:\s*\[(.*?)\]/m);
  if (srcMatch) {
    const cited = srcMatch[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    for (const c of cited) {
      if (!sourceIds.has(c)) errors.push(`Article ${a.id}: cites unknown source "${c}"`);
    }
  }
  // Placeholder scan (published only, hard fail).
  if (a.status === 'published') {
    const body = raw.slice(m[0].length);
    const bad = body.match(/TODO|FIXME|lorem ipsum|\[\[.*?\]\]|XXX(?![^a-z])/i);
    if (bad) errors.push(`Article ${a.id}: placeholder text found ("${bad[0]}")`);
  }
  // lastVerified presence for published
  if (a.status === 'published' && !/^lastVerified:\s*\S+/m.test(fmBlock)) {
    warnings.push(`Article ${a.id}: published without a lastVerified date`);
  }
}

// 2. No orphan MDX files
const contentRoot = path.join(repoRoot, 'src', 'content');
const registeredPaths = new Set(articles.map((a) => a.file.replace(/\\/g, '/')));
const mdxFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.mdx')) mdxFiles.push(p);
  }
})(contentRoot);
for (const f of mdxFiles) {
  const rel = path.relative(repoRoot, f).replace(/\\/g, '/');
  if (!registeredPaths.has(rel)) errors.push(`Orphan MDX file (not in articles.json): ${rel}`);
}

// 3. Books reference registered articles only
const registeredIds = new Set(articles.map((a) => a.id));
for (const b of books) {
  for (const ch of b.chapters) {
    if (!registeredIds.has(ch)) errors.push(`Book ${b.id}: chapter "${ch}" not in articles.json`);
  }
}

// Report
console.log(`[validate] ${articles.length} articles, ${books.length} books, ${sources.length} sources, ${mdxFiles.length} MDX files on disk`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
for (const e of errors) console.log(`  ✗ ${e}`);
if (errors.length) {
  console.log(`[validate] ${errors.length} error(s) — FAILED`);
  process.exit(1);
}
console.log(`[validate] OK (${warnings.length} warning(s))`);
