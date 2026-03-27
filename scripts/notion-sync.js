#!/usr/bin/env node
/**
 * notion-sync.js
 * Run: node scripts/notion-sync.js
 *
 * Fetches projects from Notion and writes them to data/projects.json
 * Uses Notion API v5 (@notionhq/client v5) — dataSources.query instead of databases.query
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

/* ── Config ──────────────────────────────────────────────── */
const NOTION_KEY        = process.env.NOTION_KEY;
const DATA_SOURCE_ID    = 'f10273fc0bd24a09bcba022726aa63ad'; // linked view on Work page
const OUT_FILE          = path.join(__dirname, '..', 'data', 'projects.json');

if (!NOTION_KEY) {
  console.error('❌  NOTION_KEY env var not set. Export it and re-run.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_KEY });

/* ── Slug ────────────────────────────────────────────────── */
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* ── Property helpers ────────────────────────────────────── */
function getText(prop) {
  if (!prop) return '';
  if (prop.type === 'title')       return prop.title.map(t => t.plain_text).join('');
  if (prop.type === 'rich_text')   return prop.rich_text.map(t => t.plain_text).join('');
  return '';
}

function getSelect(prop) {
  return prop?.select?.name ?? '';
}

function getMultiSelect(prop) {
  return prop?.multi_select?.map(s => s.name) ?? [];
}

function getUrl(prop) {
  return prop?.url ?? '';
}

function getCheckbox(prop) {
  return prop?.checkbox ?? false;
}

function getNumber(prop) {
  return prop?.number ?? null;
}


/* ── Main ────────────────────────────────────────────────── */
async function sync() {
  console.log('🔄  Querying Notion data source…');

  let results = [];
  let cursor;

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    results = results.concat(res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);

  console.log(`✅  Got ${results.length} pages from Notion`);

  const projects = await Promise.all(results.map(async page => {
    const p = page.properties;
    const title = getText(p['Name'] ?? p['Title'] ?? p['Project']);

    // Cover: always use the API proxy so signed S3 URLs never go stale
    const cover = `/api/notion-image?id=${page.id}`;

    return {
      id:          page.id,
      title,
      slug:        slugify(title),
      desc:        getText(p['Description'] ?? p['Desc']),
      summary:     getText(p['Summary'] ?? p['Tagline'] ?? p['Excerpt']),
      status:      getSelect(p['Status']),
      tags:        getMultiSelect(p['Tags'] ?? p['Type']),
      cover,
      url:         getUrl(p['URL'] ?? p['Link'] ?? p['Notion URL']),
      featured:    getCheckbox(p['Featured']),
      order:       getNumber(p['Order'] ?? p['Sort'] ?? p['Priority']),
      notionUrl:   page.url,
      lastEdited:  page.last_edited_time,
    };
  }));

  /* Sort: by Order asc (nulls last), then featured first, then by last edited */
  projects.sort((a, b) => {
    const aOrder = a.order ?? Infinity;
    const bOrder = b.order ?? Infinity;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.lastEdited) - new Date(a.lastEdited);
  });

  /* Write output */
  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUT_FILE, JSON.stringify(projects, null, 2));
  console.log(`📦  Written to ${OUT_FILE}`);
  console.log(`    ${projects.length} projects synced.`);
}

sync().catch(err => {
  console.error('❌  Sync failed:', err.message ?? err);
  process.exit(1);
});
