# CONTRIBUTING — DhanPedia

DhanPedia grows through a small, reproducible workflow. This document covers the
human (and automated) contributions that keep the encyclopedia accurate and
complete.

## Adding a new article

1. **Register it first.** Add an entry to `content-registry/articles.json`
   (id, title, category, status `planned`, sources, related, books).
2. **Cite real sources.** Every source id must exist in
   `content-registry/sources.json`. If you need a new source, add it there first.
3. **Write the MDX** at `src/content/<category>/<id>.mdx` following the
   structure in `CONTENT_STYLE_GUIDE.md`.
4. **Mark time-sensitive claims** with `lastVerified` and add them to
   `content-registry/update-log.json`.
5. **Validate:** `npm run validate` and `npm run check-links` must pass.

## Editing an existing article

- Update `updated`/`lastVerified` dates in the frontmatter.
- If a regulation/rate changed, update the source in `sources.json` and log it
  in `update-log.json` with a `reviewAfter` date.
- Keep the source citation to the specific document, not a homepage.

## Managing sources

- Prefer the source hierarchy in `RESEARCH_POLICY.md`.
- Record: publisher, title, URL, type, authority (primary/secondary),
  published date, verified date, limitations, and which claims rely on it.
- If a URL stops working, note it in `update-log.json` and find an official
  replacement.

## Running the book pipeline

```
npm run books      # generate all book exports (md, txt, tts, html)
npm run report     # build-report summary
```

PDF/EPUB are produced by the build when tooling is available; outputs are
validated before deployment so no broken download links ever ship.

## Testing

```
npm test           # calculation unit tests (must pass)
npm run build      # full build incl. book generation + validation
```

Do not merge changes that break the validators or the tests.

## Code of conduct

Be rigorous, neutral, and honest. No fabricated statistics, citations, or
"guaranteed" returns. Distinguish regulated from unregulated products. When
unsure, say so and mark the claim unverified.
