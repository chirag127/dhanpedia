/**
 * Shared MDX parsing utilities for the DhanPedia publishing pipeline.
 *
 * Turns a raw .mdx source string into (a) frontmatter, and (b) a flat list of
 * structured blocks that every export format (markdown, text, TTS, HTML,
 * EPUB, PDF) can render from. This guarantees all formats stay in sync with
 * the canonical article content.
 */

export function parseFrontmatter(raw) {
  const fm = {};
  let body = raw;
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (m) {
    body = raw.slice(m[0].length);
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (!kv) continue;
      let [, key, val] = kv;
      val = val.trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        fm[key] = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
      } else {
        fm[key] = val.replace(/^"|"$/g, '');
      }
    }
  }
  return { fm, body };
}

/** Inline JSX → textual form, keeping surrounding paragraph text. */
function inlineJsxToText(line) {
  let out = line;
  // Block math with braces: <Math block>{"a^2"}</Math> or <Math>{"a^2"}</Math>
  out = out.replace(/<Math\b[^>]*>\s*\{`?([\s\S]*?)`?\}\s*<\/Math>/g, (_, expr) => ` ${expr.trim()} `);
  // Mermaid component (multi-line handled by caller; single line fallback)
  out = out.replace(/<Mermaid\b[^>]*>\s*\{`([\s\S]*?)`\}\s*<\/Mermaid>/g, (_, code) => ` [diagram] ${code.trim().replace(/\n/g, ' / ')} `);
  // Chart component: keep title + alt (which describe the figure).
  out = out.replace(/<Chart\b[^>]*title="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/>/g, (_, title, alt) => ` [figure: ${title}. ${alt}] `);
  out = out.replace(/<Chart\b[^>]*alt="([^"]*)"[^>]*title="([^"]*)"[^>]*\/>/g, (_, alt, title) => ` [figure: ${title}. ${alt}] `);
  // Strip any remaining opening/closing JSX tags, keep children.
  out = out.replace(/<\/?[A-Z][A-Za-z0-9]*(\s[^<>]*)?\/?>/g, ' ');
  return out;
}

/** Convert an MDX body into a flat list of blocks. */
export function toBlocks(body) {
  const lines = body.split(/\r?\n/);
  const blocks = [];
  let i = 0;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      const text = inlineJsxToText(para.join(' ')).replace(/\s+/g, ' ').trim();
      if (text) blocks.push({ t: 'p', text });
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Mermaid component (multi-line): capture from opening tag to </Mermaid>
    if (/^\s*<Mermaid\b/.test(line)) {
      flushPara();
      let j = i;
      let buf = [line];
      while (j < lines.length && !/\/>/.test(lines[j]) && !/<\/Mermaid>/.test(lines[j])) {
        j++;
        buf.push(lines[j]);
      }
      buf.push(lines[j] ?? '');
      const chunk = buf.join('\n');
      const title = chunk.match(/title="([^"]*)"/)?.[1] ?? '';
      const code = chunk.match(/\{`([\s\S]*?)`\}/)?.[1]?.trim() ?? chunk;
      blocks.push({ t: 'diagram', title, code });
      i = j + 1;
      continue;
    }

    // Chart component (single or multi-line)
    if (/^\s*<Chart\b/.test(line)) {
      flushPara();
      let j = i;
      let buf = [line];
      while (j < lines.length && !/\/>\s*$/.test(lines[j].trim()) && !/<\/Chart>\s*$/.test(lines[j].trim())) {
        j++;
        buf.push(lines[j]);
      }
      buf.push(lines[j] ?? '');
      const chunk = buf.join('\n');
      const title = chunk.match(/title="([^"]*)"/)?.[1] ?? '';
      const alt = chunk.match(/alt="([^"]*)"/)?.[1] ?? '';
      blocks.push({ t: 'figure', title, alt });
      i = j + 1;
      continue;
    }

    // Math component
    if (/^\s*<Math\b/.test(line)) {
      flushPara();
      let j = i;
      let buf = [line];
      while (j < lines.length && !/<\/Math>/.test(lines[j])) {
        j++;
        buf.push(lines[j] ?? '');
      }
      const chunk = buf.join('\n');
      const expr = chunk.match(/\{`?([\s\S]*?)`?\}\s*<\/Math>/)?.[1]?.trim() ?? '';
      const block = /block=/.test(chunk) || /<Math block/.test(chunk);
      if (block) blocks.push({ t: 'eq', text: expr });
      else para.push(` ${expr} `);
      i = j + 1;
      continue;
    }

    // Fenced code
    if (/^\s*```/.test(line)) {
      flushPara();
      let j = i + 1;
      const codeLines = [];
      while (j < lines.length && !/^\s*```/.test(lines[j])) {
        codeLines.push(lines[j]);
        j++;
      }
      blocks.push({ t: 'code', code: codeLines.join('\n') });
      i = j + 1;
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      blocks.push({ t: `h${Math.min(h[1].length, 4)}`, text: h[2].replace(/`/g, '') });
      i++;
      continue;
    }

    // Table
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1])) {
      flushPara();
      const rows = [];
      let j = i;
      while (j < lines.length && /^\s*\|/.test(lines[j])) {
        rows.push(lines[j].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        j++;
      }
      // rows[1] is the |---| separator; skip it.
      blocks.push({ t: 'table', rows: [rows[0], rows.slice(2)] });
      i = j;
      continue;
    }

    // Lists (flat; nested items flattened with indentation marker)
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      flushPara();
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      let j = i;
      while (j < lines.length && (/^\s*[-*]\s+/.test(lines[j]) || /^\s*\d+\.\s+/.test(lines[j]))) {
        const depth = Math.floor(lines[j].match(/^\s*/)[0].length / 2);
        items.push({ depth, text: lines[j].replace(/^\s*(?:[-*]|\d+\.)\s+/, '').trim() });
        j++;
      }
      blocks.push({ t: ordered ? 'ol' : 'ul', items });
      i = j;
      continue;
    }

    // Blockquote
    if (/^\s*>/.test(line)) {
      flushPara();
      const q = [];
      let j = i;
      while (j < lines.length && /^\s*>/.test(lines[j])) {
        q.push(lines[j].replace(/^\s*>\s?/, ''));
        j++;
      }
      blocks.push({ t: 'quote', text: q.join(' ') });
      i = j;
      continue;
    }

    // Blank line
    if (/^\s*$/.test(line)) {
      flushPara();
      i++;
      continue;
    }

    para.push(line);
    i++;
  }
  flushPara();
  return blocks;
}

/** Plain-text rendering of blocks (for .txt). */
export function blocksToText(blocks, opts = {}) {
  const { tts = false } = opts;
  const clean = (s) =>
    s
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1$2')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, tts ? '$1 ($2)' : '$1 ($2)')
      .replace(/₹/g, tts ? ' rupees ' : 'Rs. ')
      .trim();
  const out = [];
  for (const b of blocks) {
    if (b.t.startsWith('h')) {
      out.push('');
      out.push(clean(b.text).toUpperCase());
      out.push(''.padEnd(Math.max(3, clean(b.text).length), '='));
    } else if (b.t === 'p') {
      out.push('');
      out.push(clean(b.text));
    } else if (b.t === 'ul') {
      b.items.forEach((it) => out.push(`${' '.repeat(it.depth * 2)}• ${clean(it.text)}`));
      out.push('');
    } else if (b.t === 'ol') {
      b.items.forEach((it, n) => out.push(`${n + 1}. ${clean(it.text)}`));
      out.push('');
    } else if (b.t === 'table') {
      const [head, ...rows] = b.rows;
      out.push('');
      out.push(rows.map((r) => head.map((h, n) => `${h}: ${r[n] ?? ''}`).join('  |  ')).join('\n'));
      out.push('');
    } else if (b.t === 'code') {
      out.push('');
      out.push(b.code);
      out.push('');
    } else if (b.t === 'diagram') {
      out.push('');
      out.push(b.title ? `Diagram — ${b.title}` : 'Diagram');
      out.push(b.code);
      out.push('');
    } else if (b.t === 'figure') {
      out.push('');
      out.push(`Figure: ${b.title}. ${b.alt}`);
      out.push('');
    } else if (b.t === 'eq') {
      out.push('');
      out.push(tts ? `Formula: ${clean(b.text).replace(/\\([a-z]+)/g, '$1')}` : `Formula: ${b.text}`);
      out.push('');
    } else if (b.t === 'quote') {
      out.push('');
      out.push(`Note: ${clean(b.text)}`);
      out.push('');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Minimal inline markdown → HTML (for EPUB chapters). */
export function inlineToHtml(text) {
  let s = String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

/** Blocks → XHTML (for EPUB chapter files). */
export function blocksToXhtml(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.t.startsWith('h')) {
      out.push(`<${b.t.slice(1)}>${inlineToHtml(b.text)}</${b.t.slice(1)}>`);
    } else if (b.t === 'p') {
      out.push(`<p>${inlineToHtml(b.text)}</p>`);
    } else if (b.t === 'ul' || b.t === 'ol') {
      const items = b.items.map((it) => `<li>${inlineToHtml(it.text)}</li>`).join('\n');
      out.push(`<${b.t}>\n${items}\n</${b.t}>`);
    } else if (b.t === 'table') {
      const [head, ...rows] = b.rows;
      const thead = `<tr>${head.map((c) => `<th>${inlineToHtml(c)}</th>`).join('')}</tr>`;
      const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${inlineToHtml(c ?? '')}</td>`).join('')}</tr>`).join('\n');
      out.push(`<table>\n<thead>${thead}</thead>\n<tbody>${tbody}</tbody>\n</table>`);
    } else if (b.t === 'code') {
      out.push(`<pre>${b.code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`);
    } else if (b.t === 'diagram') {
      out.push(`<div class="diagram"><p><strong>${inlineToHtml(b.title || 'Diagram')}</strong></p><pre>${(b.code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre></div>`);
    } else if (b.t === 'figure') {
      out.push(`<div class="figure"><p><em>Figure: ${inlineToHtml(b.title)}</em> ${inlineToHtml(b.alt)}</p></div>`);
    } else if (b.t === 'eq') {
      out.push(`<div class="eq"><code>${b.text.replace(/</g, '&lt;')}</code></div>`);
    } else if (b.t === 'quote') {
      out.push(`<blockquote>${inlineToHtml(b.text)}</blockquote>`);
    }
  }
  return out.join('\n');
}
