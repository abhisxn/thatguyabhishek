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

/**
 * Converts a project title into a URL-safe slug.
 * Collapses any non-alphanumeric run (including apostrophes) to a single hyphen.
 * Used for project page URLs in notion-work.js and notion-sync.js.
 */
export function slugifyTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Converts an article title into a URL-safe slug.
 * Strips special characters first (preserving spaces), then converts spaces to hyphens.
 * Apostrophes are stripped rather than becoming hyphens: "What's" → "whats".
 * Used for writing article URLs in notion-work.js.
 */
export function slugifyArticle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
