/** Prefix root-relative internal paths with Astro's configured base path cleanly. */
export function withBase(path: string): string {
  if (!path || !path.startsWith('/')) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  return base ? `${base}${path}` : path;
}
