import manifest from '@data/downloads.json';

/**
 * Download manifest for books & per-article files.
 *
 * `src/data/downloads.json` is (re)written on every build by
 * `scripts/generate-books.mjs`, which assembles real files into
 * `public/downloads/` (shipped with the site) and mirrors an authoritative
 * manifest (with exact byte sizes + mtime) back into this file. The books and
 * articles pages import from here so every download link they render is a
 * file that was actually generated in this build — no broken links.
 *
 * A minimal seed keeps imports valid before the first generation run.
 */
export const DOWNLOAD_MANIFEST = (manifest as unknown) as {
  generated: string;
  books: any[];
  articles: any[];
};

export function bookDownloads(id: string) {
  return DOWNLOAD_MANIFEST.books.find((b: any) => b.id === id)?.formats ?? [];
}
export function articleDownloads(id: string) {
  return DOWNLOAD_MANIFEST.articles.find((a: any) => a.id === id)?.formats ?? [];
}
export function manifestHas(id: string, kind: 'book' | 'article') {
  const arr = kind === 'book' ? DOWNLOAD_MANIFEST.books : DOWNLOAD_MANIFEST.articles;
  return arr.some((x: any) => x.id === id && !x.failed && x.formats?.length > 0);
}
