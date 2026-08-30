const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Prefix a site-local path with Astro's configured deployment base. */
export function withBase(path = '') {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${base}${path.replace(/^\/+/, '')}`;
}
