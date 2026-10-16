# RESEARCH_POLICY — DhanPedia

DhanPedia is evidence-based. This policy governs what we cite, how we verify,
and what we refuse to publish.

## Source hierarchy (strongest → weakest)

1. Indian statutes, rules, official gazettes, court decisions
2. **RBI**
3. **SEBI**
4. **Income Tax Department** / official tax legislation
5. Ministry of Finance & relevant ministries
6. **AMFI**
7. **IRDAI**
8. **PFRDA**
9. **NSE / BSE**
10. **DICGC**
11. Department of Posts / scheme administrators
12. Official exchange circulars, fund documents, product disclosures
13. Company annual reports / audited financials
14. Peer-reviewed research & reputable academic publications
15. Reputable financial publications (context)
16. Community discussion (**anecdote only**, never proof of a legal/financial fact)

Use the **exact** document for the exact claim. If a circular/notification/
factsheet exists, cite it — not a generic homepage.

## Official domains to prefer

`rbi.org.in` · `sebi.gov.in` · `incometax.gov.in` · `indiabudget.gov.in` ·
`egazette.gov.in` · `amfiindia.com` · `irdai.gov.in` · `pfrda.org.in` ·
`nseindia.com` · `bseindia.com` · `dicgc.org.in` · `indiapost.gov.in` ·
`mca.gov.in` · `pib.gov.in`

Confirm a page is official and on-point before relying on it.

## Verification rules

- **No fabricated** publication dates, access dates, URLs, quotes, or document
  contents. If a source cannot be retrieved, label the claim **unverified** and do
  not present it as current fact.
- **Primary > secondary.** A secondary summary may cite a claim only if it
  reflects a primary source; note the limitation.
- **Time-sensitive** topics (tax, rates, limits, eligibility, availability) must:
  - state the applicable FY/AY;
  - distinguish announcement vs effective dates;
  - distinguish enacted law vs proposal;
  - keep historical rules when they explain earlier investments;
  - show a prominent `lastVerified` date;
  - be tracked in `update-log.json`.
- Never claim "currently available" without current verification.

## Reconciliation

Contradictory findings must be reconciled **before** publication. Record the
conflict, the resolution, and the winning source in the article's source list.
If it cannot be resolved, publish the uncertainty explicitly.

## Update register

`content-registry/update-log.json` lists time-sensitive claims with a `reviewAfter`
date. A GitHub Actions job may run validation and *flag* items for review, but it
must **never** auto-publish sensitive tax/legal changes. Editorial approval +
source verification are required.
