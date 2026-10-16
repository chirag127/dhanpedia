// Rename the SIF category source to match the SIF article's frontmatter id.
// The canonical file is a bare JSON array. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';

const p = 'content-registry/sources.json';
let data = JSON.parse(readFileSync(p, 'utf8'));
if (!Array.isArray(data)) {
  console.log('NOTE: file is not a bare array; keeping object wrapper');
}
const l = Array.isArray(data) ? data : data.sources ?? [];

const idx = l.findIndex((x) => x.id === 'src-sebi-sif-categories');
if (idx >= 0 && !l.find((x) => x.id === 'src-sebi-mf-regulations-2026')) {
  l[idx].id = 'src-sebi-mf-regulations-2026';
  console.log('renamed src-sebi-sif-categories -> src-sebi-mf-regulations-2026');
} else if (!Array.isArray(data) && !l.find((x) => x.id === 'src-sebi-mf-regulations-2026')) {
  console.log('WARN: neither source id found');
}

if (Array.isArray(data)) {
  writeFileSync(p, JSON.stringify(l, null, 2) + '\n');
} else {
  data.sources = l;
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}
console.log('source ids:', l.map((x) => x.id).join(', '));
