/** Convert a category display label or route value to its canonical URL slug. */
export function categorySlug(value: string) {
  return value.trim().toLowerCase();
}
