# AGENTS.md

Guidance for automated agents working in this repository. Read this before
touching any file.

## Truth hierarchy (do not violate)

1. **`content-registry/sources.json`** is the citation spine. An article may only
   cite a source that already exists in this file. **Never invent a URL,
   publisher, publication date, or quotation.** If a source is missing, add a
   real, checkable entry first.
2. **`content-registry/articles.json`** is the article registry. Every article
   body must live at the `file` path declared in the registry and have a matching
   `id`. Do not add an MDX file without a registry entry.
3. **`progress/STATUS.md` + `progress/TASKS.json`** are the resumability state.
   After each phase, update both. Do not mark a workstream complete just because
   files exist.
4. **Honesty rule:** never claim something is deployed, tested, verified, or
   generated unless you actually ran it and it passed. Record failures honestly.

## File ownership

- One agent/owner per file. If you need to change a file another owner
  produced, coordinate in `DECISIONS.md` first.
- Article bodies: `src/content/<category>/<id>.mdx`.
- Calculator logic: `src/lib/finance/` (pure, no side effects, must pass `npm test`).
- Site shell: `src/layouts`, `src/pages`, `src/components`, `src/styles`.

## Definition of done for an article

- [ ] Registry entry exists with valid `id`, `category`, `status`, `sources`, `lastVerified`.
- [ ] All `sources` ids resolve in `sources.json`.
- [ ] Body passes the structural checklist in `CONTENT_STYLE_GUIDE.md`.
- [ ] No placeholder text (`TODO`, `FIXME`, lorem, `XXX`, `[[...]]`).
- [ ] Time-sensitive claims carry a `lastVerified` date and are in `update-log.json`.
- [ ] `npm run validate` and `npm run check-links` pass.

## Definition of done for a calculator

- [ ] Pure function in `src/lib/finance/` with a JSDoc explaining the convention.
- [ ] Unit tests in `tests/unit/` with known numerical answers.
- [ ] An accessible React island + a page that documents assumptions and limits.

## Commands that must pass before "done"

```
npm test            # calculation unit tests
npm run validate    # content registry + article validation
npm run check-links # internal + citation link integrity
npm run build       # astro build + book generation + report
```

## Resuming an interrupted session

1. Read `progress/STATUS.md` (what's done / next 3 actions).
2. Read `progress/TASKS.json` and resume the first genuinely incomplete task.
3. Run `git status` and the 4 commands above to confirm current state.
4. Do **not** discard verified work. Resume from the first incomplete dependency.
