import fs from 'node:fs';
const s = fs.readFileSync('src/lib/calculators.ts', 'utf8');
const i = s.indexOf('export function getCalc');
const before = s.slice(0, i);
const m = before.match(/\];/g);
console.log('total ]; occurrences before getCalc:', m ? m.length : 0);
const open = (s.match(/{/g) || []).length;
const close = (s.match(/}/g) || []).length;
console.log('braces { =', open, ' } =', close, open === close ? 'BALANCED' : 'UNBALANCED');
const lo = (s.match(/\[/g) || []).length;
const lc = (s.match(/\]/g) || []).length;
console.log('brackets [ =', lo, ' ] =', lc, lo === lc ? 'BALANCED' : 'UNBALANCED');

// Count calculator entries by the "id: '" pattern (single-quoted).
const re = /id: '[a-z0-9-]+',/g;
const ids = s.split('\n').filter((l) => /^\s{4}id: '[a-z0-9-]+',$/.test(l)).map((l) => l.trim());
console.log('entry count:', ids.length);
console.log('last 3:', ids.slice(-3).join(', '));
console.log('has dtaa-rate-reference:', ids.includes('dtaa-rate-reference'));
