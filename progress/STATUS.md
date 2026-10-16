# DhanPedia — Progress

Last updated: **2026-10-16** (content push #2: 5 new articles, 21 → 26; all pipeline green)

## State

- **Articles:** 26 on disk / registered (banking-cash category now filled: `banking-safety-deposits-fd`; new tax articles: `tax-esop-stock-grants`, `tax-loss-harvesting`; new personal-finance articles: `pf-credit-loans-debt`, `pf-wills-succession`).
- **Books:** 4 × 6 formats (PDF/EPUB/MD/HTML/TXT/TTS) → `public/downloads/books/`. Chapter counts: complete-investor 12, indian-taxation 5, p2p-lending 3, wealth-beyond-10l 8.
- **Sources:** 28 in `sources.json` (added 8: src-fd-rates-aug2026, src-rbi-credit-reporting-2026, src-prepay-vs-invest-2026, src-esop-tax-it-dept, src-wills-succession-2026, src-gift-tax-it-dept, src-loss-carry-forward-2026, src-it-slab-fy2026-27).
- **Update-log:** 19 tracked time-sensitive claims.

## This session (verified 2026-10-16 via web research)

### New articles (Wave 2)
- [x] `src/content/banking-cash/banking-safety-deposits-fd.mdx` — DICGC ₹5L mechanics, bank categories, FD rates (verified Oct 2026), SFB/payment-bank differences, sweep-in traps, cash-bucket framework, RBI weekly credit-reporting.
- [x] `src/content/personal-finance/pf-credit-loans-debt.mdx` — EMI amortization math, productive vs consumptive debt split, prepay-vs-invest decision (8.5% loan vs 8–8.5% safe debt, verified), credit-score mechanics post-RBI-weekly-reporting, cash-flow stress rules for ₹10L.
- [x] `src/content/taxation/tax-esop-stock-grants.mdx` — two-stage ESOP/RSU tax (§17(2)(vi) perquisite + capital gain), listed / pre-IPO / foreign-listed variants, the "taxed before you can sell" trap, Schedule FA, §87A interaction.
- [x] `src/content/personal-finance/pf-wills-succession.mdx` — nominee ≠ legal heir, will vs succession certificate vs probate by asset type, §57(xii) gift-tax bomb, 6-point no-freeze checklist, HUF / trust layer.
- [x] `src/content/taxation/tax-loss-harvesting.mdx` — §70–74 set-off waterfall, §70(3) 8-year carry-forward + §139(1) filing gate, §87A rebate trap, F&O speculation-loss constraint (SEBI FY26 data), yearly harvesting workflow.

### Pipeline (all green this session)
- [x] `node scripts/validate-content.mjs` → **26 articles, 4 books, 28 sources, 26 MDX on disk, 0 warnings**.
- [x] `node scripts/check-links.mjs` → all registry refs resolve.
- [x] `npx vitest run` → **41/41**.
- [x] `npx playwright test` → **12/12** passed in 54.7s.
- [x] `npx astro build` (system Node v24.18, not the Agnes wrapper's v22) → Complete, local base OK **and** `--base /dhanpedia` production OK.
- [x] `npx pagefind --site dist` → indexed **128 pages / 13943 words**.
- [x] `node scripts/generate-books.mjs` → 4/4 books, 26/26 article downloads, all 6 formats present on disk in `public/downloads/books/`.
- [x] `node scripts/build-report.mjs` → manifest OK, all files present.

### Known build-gotchas this session
- **MDX parse error:** `<digit` / `<₹` in prose/tables (`<3mo`, `<₹5L`, `<30%`) break JSX parsing. Fixed 5 occurrences by rewording to "under / less than".
- **Node version:** `npx astro build` via the Agnes wrapper fails ("Node.js v22.14.0 not supported by Astro, need ≥22.22"). Use `"C:\Program Files\nodejs\npx.cmd" astro build` (system Node v24.18.0).

## Not yet done
- [ ] Deploy to GitHub Pages (owner must enable Pages; CI is configured).
- [ ] Personalization pass on `pf-wealth-plan-10-lakh` once the user answers the 14 questions (the 5 new articles already give richer context for a later rewrite).
- [ ] Phase 3 calculators (ELSS tax shield, NPS tax shield, PMS fee-drag, AIF carry, SIF sleeve sizing).
- [ ] Phase 4 deeper expansion: banking "recurring deposits / savings account comparison" sub-articles; "corporate FD vs NBFC debenture" underwriting guide; "credit card vs UPI vs NBFD" personal loans matrix; 40+ total if user confirms.

## Next 3 actions
1. Commit this session's changes.
2. Re-present the 4 books (esp. `book-complete-indian-investor` now with 12 chapters including banking + credit, and `book-indian-taxation` now with 5 chapters including ESOP + loss-harvesting) as downloadable artifacts.
3. Ask the user the 14 personalization questions to rewrite `pf-wealth-plan-10-lakh` with their real numbers.
