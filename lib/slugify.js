/**
 * Converts a Notion project title to a URL-safe slug.
 * Deterministic — same title always produces same slug.
 *
 * Examples:
 *   "Excel Charting : AI-Powered Chart Insights" → "excel-charting-ai-powered-chart-insights"
 *   "Airtel Thanks 2.0: Redesigning Airtel Thanks Program" → "airtel-thanks-2-0-redesigning-airtel-thanks-program"
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
