# STATUS — DhanPedia
Updated: 2026-10-16 · Owner: Chirag Singhal · Repo: chirag127/dhanpedia

## Complete & verified (this session)
- [x] Full pipeline green end-to-end: `npm test` (41/41 unit) · `npm run build` (books → astro → pagefind → validate → check-links → report) · `npx playwright test` (12/12 e2e on desktop + mobile-chromium) · `BASE_PATH=/dhanpedia` production build.
- [x] 20 articles on disk (19 original + new SIF deep article, ~4,460 words, SEBI SIF 2026 tier).
- [x] 4 books × 6 formats (md/html/txt/tts/epub/pdf) + per-article downloads; SIF chapter added to *Wealth Beyond ₹10 Lakh*.
- [x] Registry refresh: sources.json normalized to bare array with 14 verified entries (added 2 SIF sources; repo source → primary RBI MPC Aug 2026; NPS → PFRDA gazette 16 Dec 2025; tax → FY 2026-27; SCSS → Q1 FY 2026-27).
- [x] update-log.json: 7 tracked claims; 5 re-verified 2026-10-16; added tl-sif-2026.
- [x] Content accuracy pass vs live web (2026-10-16): tax slab labels → FY 2026-27 (slabs unchanged by Budget 2026); NPS Dec-2025 exit rules confirmed in small-savings + retirement articles; SIF added to PMS/AIF capital ladder + ₹10L plan; tax-regime-choice section added to the flagship plan.
- [x] Fixed `link()`/`BASE_URL` double-slash bug (local base was `'/'` → `'//x'`); search.astro + BaseLayout now use the normalized base.
- [x] Fixed vitest picking up Playwright e2e files; Playwright webServer Node-version shadowing (prepend system Node on Windows); mobile project now runs on chromium.
- [x] All 12 e2e assertions pass: homepage, article, calculator, dark-mode, books (real downloads, no `//` links), 404.

## Current facts verified 2026-10-16
- RBI repo 5.25%, SDF 5.00%, MSF/BR 5.50%, neutral, 4th consecutive hold (MPC 3–5 Aug 2026). GDP outlook 6.7% FY2026-27.
- SCSS 8.2% / PPF 7.1% / MIS 7.4% / NSC 7.7% — unchanged for 8 consecutive quarters incl. Q1 FY 2026-27.
- FY 2026-27 income-tax slabs unchanged from Budget 2025 reset: new regime 0/5/10/15/20/25/30; 87A ₹60,000 (₹12L tax-free; ₹12.75L salaried with ₹75k standard deduction); old-regime slabs also unchanged.
- PFRDA NPS exit amendment w.e.f. 16 Dec 2025 (non-govt): no 5-yr lock-in; 80% lump sum / 20% min annuity; deferment to age 85; ₹8L corpus 100% withdrawal; up to 100% equity option.
- SEBI SIF (effective 1 Apr 2026): ₹10L aggregate minimum per PAN within one AMC; SIP/STP allowed; passive breach → full-redemption only; active breach → units frozen, 30-day rebalance; accredited-investor exemption. PMS ₹50L and AIF ₹1Cr minimums unchanged.
- LRS limit remains USD 250,000/person/FY; Budget 2025 revised TCS thresholds (education/tour ₹10L threshold, medical ₹5L).

## In progress / next
- [ ] Deploy: repo remote is configured; CI builds at base '' for tests, `BASE_PATH=/dhanpedia` for the Pages artifact. **Owner still needs to enable GitHub Pages (project site, /dhanpedia) and a root `404.html` is served by astro.**
- [ ] Optional wave-2 depth: expand remaining avenues (derives/futures, bank & deposit safety deep-dive, ESOP/RSU tax) — registries + inventory.json (180-item roadmap) already scoped.
- [ ] User profile answers → personalize `pf-wealth-plan-10-lakh` with their actual monthly capacity, risk grade, and tax regime (plan + questions already drafted).

## Failed / unresolved
- None blocking. Secondary-source SIF figures (caps, expense ratios) are explicitly flagged "verify against scheme document" per the honesty rule; SIF facts re-verify due 2027-04-01.

## One-off helper scripts (safe to delete; kept until next build proves they're unneeded)
- scripts/_refresh-sources.mjs, _refresh-updatelog.mjs, _refresh-tax-article.mjs, _refresh-tax-article2.mjs, _register-sif.mjs, _enrich-pmsaif.mjs, _enrich-10l.mjs, _rename-sif-source.mjs

## Deployable?
Yes for the owner: `git push` runs the CI (tests + validate + dual builds). The live URL only exists once Pages is enabled on the repo.
