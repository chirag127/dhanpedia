/**
 * base — the site's deployment base path, normalized.
 * Astro reports import.meta.env.BASE_URL as '/' locally and '/dhanpedia' on a
 * GitHub Pages project site. A trailing-slash base would produce '//x' links,
 * so we normalize '/' (or '') to '' and only keep a real sub-path base.
 */
export const base: string = (() => {
  const raw = import.meta.env.BASE_URL ?? '';
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed === '' || trimmed === '/' ? '' : trimmed;
})();

/**
 * link(path) — resolve an internal (root-relative) path to a deployment-safe URL.
 *
 *   link('/topics')          → '/topics'            (local dev, base '')
 *   link('/topics')          → '/dhanpedia/topics'  (project site, base '/dhanpedia')
 *
 * Use this for every internal <a href> and asset src so the static site works
 * at the domain root locally AND under /dhanpedia on GitHub Pages. Pass
 * absolute external URLs (http…) through unchanged.
 */
export function link(path: string): string {
  if (!path) return base;
  // External / already-absolute URLs pass through untouched.
  const external =
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('data:') ||
    path.startsWith('//');
  if (external) return path;
  // Internal root-relative path: prefix with the deployment base.
  if (path.startsWith('/')) return base + path;
  // Relative path: leave as-is (rare in this codebase).
  return path;
}
