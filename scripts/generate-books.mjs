/**
 * DhanPedia publishing pipeline.
 *
 * Assembles books and per-article downloads from the CANONICAL MDX content.
 * Output (in public/downloads/) ships with the static build; a manifest is
 * mirrored to src/data/downloads.json so pages can render only real links.
 *
 * Formats per book: markdown, html, txt, tts, epub, pdf.
 * Per article: markdown, txt, html.
 *
 * Honesty: we only write files we actually produce, and the manifest records
 * exact byte sizes + mtime. The book/catalog pages read this manifest.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import JSZip from 'jszip';
import PDFDocument from 'pdfkit';

import { parseFrontmatter, toBlocks, blocksToText, blocksToXhtml, inlineToHtml } from './lib/mdx-util.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reg = (f) => JSON.parse(readFileSync(path.join(repoRoot, 'content-registry', f), 'utf8'));
const articles = reg('articles.json').articles;
const books = reg('books.json').books;
const sources = reg('sources.json');
const OUT = path.join(repoRoot, 'public', 'downloads');

const srcPath = (a) => path.join(repoRoot, a.file);
function loadArticle(id) {
  const a = articles.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown article id in book: ${id}`);
  const raw = readFileSync(srcPath(a), 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const blocks = toBlocks(body);
  const regRec = a;
  const cited = (Array.isArray(fm.sources) ? fm.sources : regRec.sources || [])
    .map((s) => sources.find((x) => x.id === s))
    .filter(Boolean);
  return { a, fm, raw, body, blocks, cited };
}

function articleMarkdown(a) {
  const { a: rec, fm, body, cited } = a;
  let md = body;
  if (cited?.length) {
    md += `\n\n## Sources & Citations\n\n${cited.map((s) => `- **${s.publisher}** — ${s.title}. ${s.url}${s.verified ? ` (verified ${s.verified})` : ''}`).join('\n')}\n`;
  }
  md += `\n---\nEducational content, not individualized investment, tax, accounting, or legal advice.\nAuthor: ${fm.author || 'Chirag Singhal'}. DhanPedia.\n`;
  return md;
}

function articlePlainText(a, tts) {
  return `# ${a.fm.title}\n\n${a.fm.description || ''}\n\n${blocksToText(a.blocks, { tts })}\n`;
}

function articleHtml(a) {
  const xhtml = blocksToXhtml(a.blocks);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${a.fm.title}</title>
<style>body{font:16px/1.7 Georgia,serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#14231d}
h1{font-size:1.8rem}h2{border-bottom:1px solid #ccc;margin-top:2rem}table{border-collapse:collapse;width:100%;font-size:.9rem}
td,th{border:1px solid #ccc;padding:.4rem .5rem}code{background:#f1efe7;padding:.1rem .3rem;border-radius:4px}
.eq code{display:block;text-align:center;margin:.8rem 0}blockquote{border-left:3px solid #c69a2c;margin:.4rem 0;padding-left:1rem;font-style:italic;color:#3c4b44}</style>
</head><body><h1>${a.fm.title}</h1>${a.fm.description ? `<p style="color:#3c4b44"><em>${a.fm.description}</em></p>` : ''}
<p style="font-size:.8rem;color:#555">DhanPedia · Author ${a.fm.author || 'Chirag Singhal'}${a.fm.lastVerified ? ` · Verified ${a.fm.lastVerified}` : ''}</p>
${xhtml}
${a.cited?.length ? `<h2>Sources</h2><ol>${a.cited.map((s) => `<li>${inlineToHtml(s.publisher)} — ${inlineToHtml(s.title)}: ${s.url}${s.verified ? ` (verified ${s.verified})` : ''}</li>`).join('')}</ol>` : ''}
<p style="font-size:.75rem;color:#666;margin-top:2rem;border-top:1px solid #ccc;padding-top:1rem">Educational content, not individualized investment, tax, accounting, or legal advice.</p>
</body></html>`;
}

function bookHtml(book) {
  const parts = book.chapters.map((id) => {
    const a = loadArticle(id);
    return `<article data-chapter="${id}"><h1>${a.fm.title}</h1>${blocksToXhtml(a.blocks)}</article>`;
  });
  const toc = book.chapters.map((id) => {
    const a = loadArticle(id);
    return `<li><a href="#${id}">${a.fm.title}</a></li>`;
  });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${book.title}</title>
<style>body{font:17px/1.75 Georgia,serif;max-width:48rem;margin:2rem auto;padding:0 1.2rem;color:#14231d}
nav.toc{background:#f1efe7;border:1px solid #ddd;border-radius:10px;padding:1rem 1.4rem;margin:1.5rem 0}
nav.toc h2{margin-top:0}.cover{text-align:center;padding:2.5rem 0;border-bottom:3px double #c69a2c}
.cover h1{font-size:2.2rem;margin:.4rem 0}.article{margin-top:2.5rem}h2{border-bottom:1px solid #ccc;margin-top:2rem}
table{border-collapse:collapse;width:100%;font-size:.9rem}td,th{border:1px solid #ccc;padding:.4rem .5rem}
code{background:#f1efe7;padding:.1rem .35rem;border-radius:4px}blockquote{border-left:3px solid #c69a2c;margin:.4rem 0;padding-left:1rem;font-style:italic;color:#3c4b44}
.eq code{display:block;text-align:center;margin:.8rem 0}footer{margin-top:3rem;border-top:1px solid #ccc;padding-top:1rem;font-size:.75rem;color:#666}
@media print{.noprint{display:none}nav.toc{break-inside:avoid}}</style></head>
<body>
<div class="cover"><div style="font-size:.9rem;letter-spacing:.1em;text-transform:uppercase;color:#1f7a5c">DhanPedia · ${book.subtitle || ''}</div>
<h1>${book.title}</h1><p style="color:#3c4b44">${book.description}</p><p style="font-size:.8rem;color:#555">Audience: ${book.audience} · Version ${book.version} · ${book.published}</p></div>
${book.preface ? `<div class="preface"><h2>Introduction</h2><p>${inlineToHtml(book.preface)}</p></div>` : ''}
<button class="noprint" onclick="window.print()" style="margin:1rem 0;padding:.5rem 1rem;border:1px solid #1f7a5c;background:#1f7a5c;color:#fff;border-radius:8px;cursor:pointer">🖨️ Print / Save as PDF</button>
<nav class="toc"><h2>Contents</h2><ol>${toc.join('')}</ol></nav>
${parts.join('\n')}
<footer>© ${new Date().getFullYear()} Chirag Singhal / DhanPedia. Content CC BY 4.0. Educational only — not individualized investment, tax, accounting, or legal advice.</footer>
</body></html>`;
}

async function makePdf(book, outPath) {
  const doc = new PDFDocument({ size: 'A5', margin: 40, bufferPages: true, info: { Title: book.title, Author: 'Chirag Singhal / DhanPedia' } });
  const stream = createWriteStream(outPath);
  doc.pipe(stream);
  // pdfkit's built-in Helvetica cannot render ₹; substitute a readable form.
  const san = (s) => String(s ?? '').replace(/₹/g, 'Rs. ').replace(/·/g, '-').replace(/→/g, '->').replace(/↔/g, '<->').replace(/×/g, 'x').replace(/−/g, '-');
  // Cover
  doc.font('Helvetica').fontSize(20).fillColor('#14231d').text('DhanPedia', { align: 'center' });
  doc.fontSize(26).text(book.title, { align: 'center', lineBreak: true, width: doc.page.width - 80 });
  if (book.subtitle) doc.fontSize(12).fillColor('#3c4b44').text(book.subtitle, { align: 'center', width: doc.page.width - 80 });
  doc.fillColor('#888').fontSize(9).text(`Audience: ${book.audience}  ·  Version ${book.version}  ·  ${book.published}`, { align: 'center' });
  doc.moveDown(2);
  doc.font('Helvetica').fontSize(11).fillColor('#14231d');
  doc.text('Introduction', { continued: false });
  if (book.preface) doc.fontSize(10).text(book.preface, { lineGap: 3 });
  doc.addPage();
  // Contents
  doc.fontSize(14).fillColor('#1f7a5c').text('Contents', { continued: false });
  book.chapters.forEach((id, n) => {
    const a = loadArticle(id);
    doc.font('Helvetica').fontSize(11).fillColor('#14231d').text(`${n + 1}.  ${a.fm.title}`, { lineBreak: true, lineGap: 4 });
  });
  // Preface note: keep one page per chapter start.
  const allBlocks = [];
  book.chapters.forEach((id, n) => {
    const a = loadArticle(id);
    allBlocks.push({ chapterStart: true, chapterNo: n + 1, a });
  });
  for (const item of allBlocks) {
    doc.addPage();
    const { a } = item;
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#14231d').text(a.fm.title, { lineBreak: true, width: doc.page.width - 80 });
    if (a.fm.description) doc.font('Helvetica-Oblique').fontSize(10).fillColor('#555').text(a.fm.description, { lineBreak: true, width: doc.page.width - 80 });
    doc.moveDown(1);
    for (const b of a.blocks) {
      const ensureSpace = (pt) => {
        if (doc.y + pt > doc.page.height - 50) { doc.addPage(); }
      };
      if (b.t === 'h1') { doc.font('Helvetica-Bold').fontSize(14).fillColor('#14231d'); ensureSpace(20); doc.text(san(b.text), { lineBreak: true, width: doc.page.width - 80 }); doc.moveDown(.4); }
      else if (b.t === 'h2') { doc.font('Helvetica-Bold').fontSize(12).fillColor('#1f7a5c'); ensureSpace(18); doc.text(san(b.text), { lineBreak: true, width: doc.page.width - 80 }); doc.moveDown(.3); }
      else if (b.t === 'h3' || b.t === 'h4') { doc.font('Helvetica-Bold').fontSize(11).fillColor('#14231d'); ensureSpace(16); doc.text(san(b.text), { lineBreak: true, width: doc.page.width - 80 }); }
      else if (b.t === 'p') { doc.font('Helvetica').fontSize(10).fillColor('#14231d'); ensureSpace(14); doc.text(san(b.text), { lineBreak: true, width: doc.page.width - 80, lineGap: 2 }); doc.moveDown(.3); }
      else if (b.t === 'ul' || b.t === 'ol') { doc.font('Helvetica').fontSize(10).fillColor('#14231d'); b.items.forEach((it, i) => { ensureSpace(14); doc.text(`${b.t === 'ol' ? `${i + 1}.` : '-'}  ${' '.repeat(it.depth)}`, { continued: false }); doc.text(san(it.text), { width: doc.page.width - 100, lineGap: 1.5 }); doc.moveDown(.15); }); doc.moveDown(.3); }
      else if (b.t === 'table') { doc.font('Courier').fontSize(8).fillColor('#333'); const [head, ...rows] = b.rows; ensureSpace(12); head.forEach((c, i) => doc.text(san(c), { continued: i < head.length - 1, lineBreak: false, width: 400 })); doc.moveDown(.2); rows.forEach((r) => { r.forEach((c, i) => doc.text(san(c ?? ''), { continued: i < r.length - 1, lineBreak: false, width: 400 })); doc.moveDown(.2); }); doc.font('Helvetica').fontSize(10).fillColor('#14231d'); doc.moveDown(.4); }
      else if (b.t === 'code') { doc.font('Courier').fontSize(8).fillColor('#333'); ensureSpace(12); doc.text(san(b.code), { lineBreak: true, width: doc.page.width - 80 }); doc.font('Helvetica').fontSize(10).fillColor('#14231d'); doc.moveDown(.3); }
      else if (b.t === 'eq') { doc.font('Courier').fontSize(10).fillColor('#1f7a5c'); ensureSpace(14); doc.text(san(b.text), { align: 'center' }); doc.font('Helvetica').fillColor('#14231d'); doc.moveDown(.3); }
      else if (b.t === 'diagram') { doc.font('Helvetica').fontSize(9).fillColor('#3c4b44'); ensureSpace(12); doc.text(`[Diagram${b.title ? ': ' + san(b.title) : ''}] ${san(b.code)}`, { lineBreak: true, width: doc.page.width - 80, lineGap: 1 }); doc.font('Helvetica').fillColor('#14231d'); doc.moveDown(.2); }
      else if (b.t === 'figure') { doc.font('Helvetica-Oblique').fontSize(9).fillColor('#3c4b44'); ensureSpace(12); doc.text(`[Figure: ${san(b.title)}] ${san(b.alt)}`, { lineBreak: true, width: doc.page.width - 80 }); doc.font('Helvetica').fillColor('#14231d'); }
      else if (b.t === 'quote') { doc.font('Helvetica-Oblique').fontSize(10).fillColor('#3c4b44'); ensureSpace(12); doc.text(san(b.text), { lineBreak: true, width: doc.page.width - 100, indent: 20 }); doc.font('Helvetica').fillColor('#14231d'); doc.moveDown(.2); }
    }
    // Footer per page is hard with bufferPages; add a simple disclaimer at end.
  }
  // Final disclaimer page
  doc.addPage();
  doc.font('Helvetica').fontSize(9).fillColor('#666').text('DhanPedia — India’s Encyclopedia of Investing, Money & Wealth.', { lineBreak: true });
  doc.text('Author: Chirag Singhal. This book is generated from DhanPedia’s canonical article content. It is educational and is not individualized investment, tax, accounting, or legal advice. Time-sensitive figures carry verification dates and may change; confirm against official sources before acting.', { lineBreak: true, width: doc.page.width - 80, lineGap: 3 });
  doc.end();
  await new Promise((res, rej) => { stream.on('finish', res); stream.on('error', rej); });
}

async function makeEpub(book, outPath) {
  const zip = new JSZip();
  const uid = book.id;
  const chapterXhtml = book.chapters.map((id, n) => {
    const a = loadArticle(id);
    return `<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><meta charset="utf-8"/><title>${a.fm.title}</title></head><body><h1>${a.fm.title}</h1>${a.fm.description ? `<p class="desc">${a.fm.description}</p>` : ''}${blocksToXhtml(a.blocks)}</body></html>`;
  });
  const chapFiles = chapterXhtml.map((x, n) => ({ name: `OEBPS/${uid}-ch${n + 1}.xhtml`, data: x, href: `${uid}-ch${n + 1}.xhtml` }));
  const prefaceFile = book.preface ? { name: `OEBPS/${uid}-pre.xhtml`, data: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"/><title>Introduction</title></head><body><h1>Introduction</h1><p>${book.preface}</p></body></html>`, href: `${uid}-pre.xhtml` } : null;
  const titleFile = { name: `OEBPS/${uid}-title.xhtml`, data: `<html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"/><title>${book.title}</title></head><body><h1>${book.title}</h1><h2>${book.subtitle || ''}</h2><p>${book.description}</p></body></html>`, href: `${uid}-title.xhtml` };

  const manifest = [
    { id: 'title', href: titleFile.href, type: 'cover' },
    ...(prefaceFile ? [{ id: 'pre', href: prefaceFile.href, type: 'text' }] : []),
    ...chapFiles.map((c) => ({ id: c.href, href: c.href, type: 'text' })),
    { id: 'css', href: 'style.css', type: 'text/css' },
    { id: 'nav', href: 'nav.xhtml', type: 'application/xhtml+xml' },
  ];

  const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
<metadata xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">${uid}</dc:identifier>
<dc:title>${book.title}</dc:title>
${book.subtitle ? `<dc:subtitle>${book.subtitle}</dc:subtitle>` : ''}
<dc:language>en</dc:language>
<dc:creator>Chirag Singhal / DhanPedia</dc:creator>
<dc:date>${book.published}</dc:date>
<dc:description>${book.description}</dc:description>
<meta property="dcterms:modified">${new Date().toISOString().replace('T', 'T').replace(/:\d\d\.\d\d\dZ$/, 'Z')}</meta>
</metadata>
<manifest>${manifest.map((m) => `<item id="${m.id}" href="${m.href}" media-type="${m.type}"${m.id === 'nav' ? ' properties="nav"' : ''}/>`).join('\n')}</manifest>
<spine toc="toc">
<itemref idref="title"/>
${prefaceFile ? `<itemref idref="pre"/>` : ''}
${chapFiles.map((c) => `<itemref idref="${c.href}"/>`).join('\n')}
</spine>
</package>`;

  const tocNcx = `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="${uid}"/><meta name="dtb:depth" content="1"/></head>
<docTitle><text>${book.title}</text></docTitle>
<navMap>
<navPoint id="np0" dcterms:type="toc"><navLabel><text>Contents</text></navLabel><content src="nav.xhtml"/></navPoint>
${chapFiles.map((c, n) => `<navPoint id="np${n + 1}"><navLabel><text>${loadArticle(book.chapters[n]).fm.title}</text></navLabel><content src="${c.href}"/></navPoint>`).join('\n')}
</navMap></ncx>`;

  const navXhtml = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><meta charset="utf-8"/></head><body><nav epub:type="toc" aria-label="Table of contents"><h1>Contents</h1><ol><li><a href="${titleFile.href}">Title</a></li>${chapFiles.map((c, n) => `<li><a href="${c.href}">${loadArticle(book.chapters[n]).fm.title}</a></li>`).join('')}</ol></nav></body></html>`;

  const styleCss = `body{font-family:serif;line-height:1.5}h1{font-size:1.4em}h2{border-bottom:1px solid #ccc}.eq code{text-align:center;display:block}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3em}`;

  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);
  zip.file('OEBPS/content.opf', contentOpf);
  zip.file('OEBPS/toc.ncx', tocNcx);
  zip.file('OEBPS/nav.xhtml', navXhtml);
  zip.file('OEBPS/style.css', styleCss);
  zip.file('OEBPS/title.xhtml', titleFile.data);
  if (prefaceFile) zip.file(prefaceFile.name, prefaceFile.data);
  chapFiles.forEach((c) => zip.file(c.name, c.data));
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  writeFileSync(outPath, buf);
}

// ---------------------------------------------------------------------------
// RUN
// ---------------------------------------------------------------------------
function write(dir, name, data) {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  mkdirSync(dir, { recursive: true });
  const p = path.join(dir, name);
  writeFileSync(p, buf);
  return { rel: path.relative(repoRoot, p).replace(/\\/g, '/'), bytes: buf.length, mtime: new Date().toISOString() };
}

const manifest = { generated: new Date().toISOString(), books: [], articles: [] };

for (const book of books) {
  const bdir = path.join(OUT, 'books', book.id);
  const entries = [];
  try {
    // Markdown
    const mdParts = [
      `# ${book.title}\n\n${book.subtitle ? `*${book.subtitle}*\n` : ''}`,
      book.description ? `> ${book.description}\n` : '',
      `Audience: ${book.audience}. Version ${book.version}, ${book.published}.\n`,
      book.preface ? `## Introduction\n\n${book.preface}\n` : '',
      `## Contents\n\n${book.chapters.map((id, n) => `${n + 1}. ${loadArticle(id).fm.title}`).join('\n')}\n`,
      ...book.chapters.map((id) => `\n\n---\n\n` + articleMarkdown(loadArticle(id))),
    ];
    entries.push(write(bdir, `${book.id}.md`, mdParts.join('\n')));
    // HTML
    entries.push(write(bdir, `${book.id}.html`, bookHtml(book)));
    // TXT + TTS
    const txt = book.chapters.map((id) => { const a = loadArticle(id); return `${a.fm.title.toUpperCase()}\n\n${blocksToText(a.blocks, { tts: false })}`; }).join('\n\n\n');
    entries.push(write(bdir, `${book.id}.txt`, txt));
    const tts = book.chapters.map((id) => { const a = loadArticle(id); return `${a.fm.title}\n\n${blocksToText(a.blocks, { tts: true })}`; }).join('\n\n\n');
    entries.push(write(bdir, `${book.id}.tts.txt`, tts));
    // EPUB
    await makeEpub(book, path.join(bdir, `${book.id}.epub`));
    entries.push(write(bdir, `${book.id}.epub`, readFileSync(path.join(bdir, `${book.id}.epub`))));
    // PDF
    await makePdf(book, path.join(bdir, `${book.id}.pdf`));
    entries.push(write(bdir, `${book.id}.pdf`, readFileSync(path.join(bdir, `${book.id}.pdf`))));
  } catch (e) {
    console.error(`[books] FAILED ${book.id}: ${e.message}`);
    console.error(e.stack);
    manifest.books.push({ id: book.id, title: book.title, failed: true, error: e.message });
    continue;
  }
  manifest.books.push({
    id: book.id, title: book.title, subtitle: book.subtitle, description: book.description,
    audience: book.audience, version: book.version, published: book.published,
    chapters: book.chapters,
    formats: entries.map((e) => ({ name: path.basename(e.rel), ext: path.extname(e.rel).slice(1), bytes: e.bytes, mtime: e.mtime, path: `public/downloads/books/${book.id}/${path.basename(e.rel)}` })),
  });
}

// Per-article downloads
const adir = path.join(OUT, 'articles');
for (const rec of articles.filter((a) => a.status === 'published')) {
  try {
    const a = loadArticle(rec.id);
    const entries = [
      write(adir, `${rec.id}.md`, articleMarkdown(a)),
      write(adir, `${rec.id}.txt`, articlePlainText(a, false)),
      write(adir, `${rec.id}.html`, articleHtml(a)),
    ];
    manifest.articles.push({
      id: rec.id, title: rec.title, category: rec.category,
      formats: entries.map((e) => ({ name: path.basename(e.rel), ext: path.extname(e.rel).slice(1), bytes: e.bytes, mtime: e.mtime, path: `public/downloads/articles/${path.basename(e.rel)}` })),
    });
  } catch (e) {
    manifest.articles.push({ id: rec.id, title: rec.title, failed: true, error: e.message });
  }
}

// Write manifest (shipped) + importable copy
mkdirSync(path.join(OUT), { recursive: true });
writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
mkdirSync(path.join(repoRoot, 'src', 'data'), { recursive: true });
writeFileSync(path.join(repoRoot, 'src', 'data', 'downloads.json'), JSON.stringify(manifest, null, 2));

const okBooks = manifest.books.filter((b) => !b.failed).length;
const okArticles = manifest.articles.filter((a) => !a.failed).length;
console.log(`[books] generated ${okBooks}/${books.length} books, ${okArticles}/${articles.length} article downloads → public/downloads/`);
