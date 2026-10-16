# DhanPedia

**India's Encyclopedia of Investing, Money & Wealth.**

DhanPedia is a free, evidence-based, static educational encyclopedia and publishing
platform covering every major investment avenue, financial instrument,
wealth-building strategy, and personal-finance topic relevant to India.

> **Author & creator:** Chirag Singhal — [chirag@oriz.in](mailto:chirag@oriz.in)
> · [Facebook](https://www.facebook.com/singhal127) · [Support the project](https://buymeacoffee.com/chirag127)
> · [Repository](https://github.com/chirag127/dhanpedia)

## What this is

- A **static site** built with **Astro + TypeScript + MDX + React islands**,
  styled with **Tailwind CSS v4**, deployable to **GitHub Pages**.
- A **content engine** that keeps articles, books, sources, and instruments in
  machine-readable registries under `content-registry/`.
- A **local financial calculator library** (`src/lib/finance`) that is
  deterministic and unit-tested — no paid APIs, no server.
- A **publishing pipeline** (`scripts/`) that turns reviewed articles into
  downloadable **Markdown, plain-text, TTS-friendly, HTML, PDF and EPUB** books.
- **Pagefind** full-text search over the generated site.

It is **educational, not advisory.** Nothing on the site is individualized
investment, tax, accounting, or legal advice, and the site does not claim to be
a SEBI-registered adviser, a regulated financial institution, or an official
government resource.

## Quick start

```bash
# 1. Install
npm install

# 2. Run the dev server (localhost:4321)
npm run dev

# 3. Build the static site + books + content validation
npm run build

# 4. Preview the production build
npm run preview

# 5. Run the calculation unit tests
npm test

# 6. Full-text search (after a build)
npm run search

# 7. Run the content/link validators manually
npm run validate
npm run check-links
npm run report
```

## Repository layout

```
dhanpedia/
├── public/            # static assets (favicon, robots, manifest)
├── src/
│   ├── components/    # MDX/component-enhanced blocks, charts, calc islands
│   ├── layouts/       # BaseLayout, ArticleLayout, CategoryLayout
│   ├── pages/         # Astro pages (home, topics, calculators, books, ...)
│   ├── content/       # MDX articles by category
│   ├── lib/           # site.ts (metadata/categories), finance/ (calculators), format.ts
│   └── styles/        # global CSS + design tokens
├── content-registry/  # articles.json, books.json, sources.json, instruments.json, update-log.json
├── scripts/           # validate-content, generate-books, generate-sitemap, check-links, build-report
├── tests/             # unit (vitest) + e2e (playwright)
├── types/             # shared registry types
├── progress/          # STATUS.md + TASKS.json — resumability state
└── .github/workflows/ # CI + GitHub Pages deploy
```

## Where the source of truth lives

| Concern | Location |
|---|---|
| Category taxonomy + site metadata | `src/lib/site.ts` |
| Article metadata (ids, status, sources, books) | `content-registry/articles.json` |
| Article prose (MDX) | `src/content/<category>/<id>.mdx` |
| Books (chapter order, audience) | `content-registry/books.json` |
| Citations | `content-registry/sources.json` |
| Quick-reference instruments | `content-registry/instruments.json` |
| Time-sensitive claims to re-verify | `content-registry/update-log.json` |

## Deployment

The deploy workflow (`.github/workflows/deploy.yml`) checks out, installs,
runs `npm test`, `npm run validate`, and `npm run build`, then deploys to
GitHub Pages under **`/dhanpedia`** (project site). Base path is set at build
time via `BASE_PATH`.

Until the repository's Pages settings are configured by the owner, the site
builds and deploys from CI; a verified live URL is documented in
`progress/STATUS.md` once it is actually reachable.

## Safety & ethics

- **No fabricated citations.** Every time-sensitive fact carries a `lastVerified`
  date and points to a real, checkable source in `sources.json`.
- **No promises of returns.** High-yield avenues come with explicit loss
  scenarios and the mechanism that causes permanent loss.
- **Regulated vs unregulated** products are clearly distinguished; we never
  instruct readers to do anything illegal or to commit fraud.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md), [AGENTS.md](./AGENTS.md) (for
automated agents), and [RESEARCH_POLICY.md](./RESEARCH_POLICY.md).

## License

Code is **MIT**; original educational content is **CC BY 4.0**.
See [LICENSE](./LICENSE) and the licensing note in
[DECISIONS.md](./DECISIONS.md).
