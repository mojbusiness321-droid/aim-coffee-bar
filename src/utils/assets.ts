/**
 * Returns the fully qualified asset URL respecting the Vite base path
 * (e.g. '/aim-coffee-bar/' on GitHub Pages, or './' in local development).
 */
export function getAssetUrl(relativePath: string): string {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}
