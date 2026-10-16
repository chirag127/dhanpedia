// Enrich the flagship 10L plan: insert the SIF rung into the growth path
// (mermaid + a dedicated bullet) and add a tax-regime-choice callout.
import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/content/personal-finance/pf-wealth-plan-10-lakh.mdx';
let t = readFileSync(p, 'utf8');
const msgs = [];

// 1) Upgrade the mermaid diagram to include the SIF rung between the start and PMS.
if (t.includes('M1 --> M2["PMS-eligible') && !t.includes('SIF')) {
  t = t.replace(
    'M1 --> M2["PMS-eligible\\n(₹50 lakh regulatory minimum)"]',
    'M1 --> M0["SIF sleeve available\\n(SEBI 2026, ₹10L aggregate min)"]\n  M1 --> M2["PMS-eligible\\n(₹50 lakh regulatory minimum)"]'
  );
  msgs.push('mermaid: added SIF rung');
}

// 2) Insert a SIF bullet right after the intro paragraph of the growth path,
//    before the "PMS entry at ₹50 lakh." bullet.
if (!t.includes('**SIF: the new bridge rung at your current corpus.**')) {
  t = t.replace(
    '- **PMS entry at ₹50 lakh.**',
    [
      '- **SIF: the new bridge rung at your current corpus.** SEBI\u2019s 2026 Mutual Fund Regulations added the **Specialized Investment Fund** category (effective 1 April 2026) with a **₹10 lakh aggregate minimum** per PAN within a single AMC\u2019s SIF offerings. That is *exactly* your starting corpus, so for the first time a ₹10L investor can own a "sophisticated" strategy tier (dynamic allocation, sector rotation, capped long-short) inside a regulated pooled vehicle taxed like a mutual fund — without jumping straight to the ₹50L PMS gate. Rule of thumb: keep the SIF sleeve to roughly 15–25% of total corpus and only on top of a solid index/debt core. Full treatment: [SIF: The ₹10 Lakh Tier](../alternatives/alternatives-sif-specialized-funds.mdx).',
      '',
      '- **PMS entry at ₹50 lakh.**',
    ].join('\n')
  );
  msgs.push('bullet: added SIF bridge-rung note');
}

// 3) Tax regime callout: the plan should state the regime decision explicitly
//    (new regime default; old regime wins only with a large deduction stack).
if (!t.includes('**Pick the regime by arithmetic, not habit.**')) {
  const anchor = '## Two-year action checklist';
  const block = [
    '### Pick the regime by arithmetic, not habit',
    '',
    'The new regime is the **default** for FY 2026-27, and for most people at this income level it is the *lower-tax* choice even with zero deductions, because the slab structure was reset so that income up to **₹12 lakh is effectively tax-free** (₹12.75 lakh gross for a salaried person after the ₹75,000 standard deduction). The **old regime** only wins when your Chapter VI-A stack (80C, 80D, 24(b) home-loan interest, 80CCD-1B NPS, HRA) is large enough that its deductions outweigh the new regime\u2019s flatter slabs — usually meaning a big home-loan or heavy insurance/NPS outlay, often somewhere above ₹20–25L of income. **Work the number for your own facts both ways** (the calculators page has the slab math) and commit to the lower-tax regime each year; it is a reversible, annual decision. Capital-gains and interest tax are *outside* this regime choice and are governed by the slab/CAPG rules in the taxation article.',
    '',
    anchor,
  ].join('\n');
  t = t.replace(anchor, block);
  msgs.push('added tax-regime-choice section');
}

writeFileSync(p, t);
console.log(msgs.join('\n'));
console.log('SIF mentions now:', (t.match(/SIF/g) || []).length);
