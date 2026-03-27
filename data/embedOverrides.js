/**
 * embedOverrides.js
 *
 * Notion converts Google Drive/Slides/Docs URLs to native Drive blocks,
 * which the API returns as `type: "unsupported"` with no URL exposed.
 *
 * This map lets us render them anyway:
 *   key   → Notion block ID (with dashes, as returned by the API)
 *   url   → the embed URL to render in the iframe
 *   label → shown in the "Open directly" fallback link
 *
 * To add a new one:
 *   1. Find the block ID (check the API or console.log in dev)
 *   2. Get the "Publish to web" URL from Google Slides/Docs/Drive
 *   3. Add an entry below
 */

const EMBED_OVERRIDES = {
  // ThinkPlanty — Brand Pitch (Google Slides)
  '32b848f1-3d34-80b7-b75b-c20be807e27c': {
    url: 'https://docs.google.com/presentation/d/e/2PACX-1vTfXuHvO5B1Atk2XUzHgq1V3YmR7ooT5OhTkK15D0TclKiLZe-ciWGPmmppXy7vO78TXE59wP1U6bDs/pubembed?start=true&loop=true&delayms=3000',
    label: 'Brand Pitch — ThinkPlanty',
  },
  // Watchlyst — Product Strategy (Google Slides)
  '330848f1-3d34-8098-a2e5-edb184484d3d': {
    url: 'https://docs.google.com/presentation/d/e/2PACX-1vQ2X9BOYmRdqrKYoOYctWDy_WVoZjQgUK31Iu6hVyKoRtJthgEV-OWWjXyFC6OkSutm3ZyNOtpxJRG9/pubembed?start=true&loop=true&delayms=3000',
    label: 'Product Strategy — Watchlyst',
  },
};

export default EMBED_OVERRIDES;
