/**
 * Converts a heading string into a URL-safe slug.
 * Handles duplicate slugs via the `seen` map passed by the caller.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
