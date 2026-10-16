// Add the SIF rung to the PMS/AIF capital ladder + a cross-link to the SIF article.
import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/content/alternatives/alternatives-pms-aif-private.mdx';
let t = readFileSync(p, 'utf8');
const msgs = [];

// 1) Insert a SIF row into the capital-ladder table. The ladder table has a row
//    for ₹10L. Upgrade that row's "No PMS/AIF" to note the SIF option, and add
//    a dedicated callout row between ₹10L and ₹50L.
if (t.includes('| **₹10L** |')) {
  t = t.replace(
    /(\| \*\*₹10L\*\* \| Index funds \+ 1 active fund \+ debt sleeve, SIP-driven \|) No PMS\/AIF/,
    '$1 No PMS/AIF *yet* — SIF sleeve becomes available (see below)'
  );
  msgs.push("og('upgraded ₹10L ladder row with SIF note'");;
}

// 2) Right after the ladder table (which ends before "The pattern: each stage..."),
//    insert a SIF callout block.
if (!t.includes('## The SIF rung (new, effective 1 April 2026)')) {
  const anchor = 'The pattern: each stage adds *illiquidity and complexity*';
  const sifBlock = `## The SIF rung (new, effective 1 April 2026)

SEBI\u2019s 2026 Mutual Fund Regulations introduced the **Specialized Investment Fund (SIF)** — a *fourth* rung that sits between a plain mutual fund (from ₹500) and PMS (₹50L). A SIF runs more sophisticated strategies (dynamic allocation, sector rotation, capped long-short with derivatives) but is still a *pooled, SEBI-regulated* vehicle taxed like a mutual fund. Its **₹10 lakh aggregate minimum** (per PAN, within a single AMC\u2019s SIF offerings) makes it the first "sophisticated" tier most investors can actually reach — the exact ₹10L stage this article\u2019s ladder starts from. The full treatment (minimum, breach rules, strategy categories, tax, due diligence, and when it beats a plain MF) is in the dedicated article:

- [Specialized Investment Funds (SIF): The ₹10 Lakh Tier](../alternatives/alternatives-sif-specialized-funds.mdx)

**How it slots into the ladder:** at ₹10L you can add a *sized SIF sleeve* on top of your index/debt core; at ₹50L the PMS gate opens; at ₹1Cr AIF access opens. The SIF is the bridge that turns "I\u2019ve hit ₹10L" into "I have access to strategies I previously only read about at the HNI tier."

`;
  t = t.replace(anchor, sifBlock + anchor);
  msgs.push("og('inserted SIF-rung section'");;
}

// 3) Add the SIF cross-link to the related-articles list (if not present).
if (!t.includes('alternatives-sif-specialized-funds')) {
  t = t.replace(
    '- [Your 10 Lakh Wealth Plan](../personal-finance/pf-wealth-plan-10-lakh.mdx)',
    '- [Specialized Investment Funds (SIF): The ₹10 Lakh Tier](../alternatives/alternatives-sif-specialized-funds.mdx) — the new SEBI 2026 category and how it bridges MF and PMS.\n- [Your 10 Lakh Wealth Plan](../personal-finance/pf-wealth-plan-10-lakh.mdx)'
  );
  msgs.push("og('added SIF to related list'");;
}

// 4) Note the SIF source in the update log (verify the SIF facts).
if (!t.includes('src-sebi-sif-2026')) {
  const marker = '- 2026-08-06: PMS \u20b950L minimum';
  const sifLine =
    '- 2026-10-16: SIF (SEBI 2026) effective 1 Apr 2026, \u20b910L aggregate minimum, long-short categories; PMS \u20b950L / AIF \u20b91Cr minimums unchanged. (src-sebi-sif-2026, src-sebi-mf-regulations-2026)\n';
  if (t.includes(marker)) {
    t = t.replace(marker, sifLine + marker);
    msgs.push("og('added SIF update-log line'");;
  } else {
    msgs.push("og('WARN: PMS update-log marker not found; SIF source not logged'");;
  }
}

// 5) Refresh the stale "FY 2025-26" label that was referenced inline.
if (t.includes('the top slab of the FY 2025-26 new regime, verified 2026-08-06')) {
  t = t.replace(
    'the top slab of the FY 2025-26 new regime, verified 2026-08-06',
    'the top slab of the FY 2026-27 new regime, verified 2026-10-16'
  );
  msgs.push("og('relabeled FY in PMS/AIF'");;
}

writeFileSync(p, t);
console.log(msgs.join(String.fromCharCode(10)));
