import fs from 'node:fs';
// Strip BOM from books.json if present
let raw = fs.readFileSync('content-registry/books.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) {
  raw = raw.slice(1);
  fs.writeFileSync('content-registry/books.json', raw);
  console.log('BOM stripped');
}
const bf = JSON.parse(raw);
const books = bf.books ?? bf;
const book = books.find((b) => b.id === 'book-indian-taxation');
const chKey = book.chapters ? 'chapters' : 'artifactChapters';
const chArr = book[chKey];
const fixed = chArr.map((c) => (typeof c === 'string' ? c : c.id));
book[chKey] = fixed;
fs.writeFileSync('content-registry/books.json', JSON.stringify(bf, null, 2));
console.log('book-indian-taxation chapters now (all strings):', fixed.length);
console.log('last 3:', fixed.slice(-3));
