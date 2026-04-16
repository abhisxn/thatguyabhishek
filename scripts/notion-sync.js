#!/usr/bin/env node
/**
 * notion-sync.js
 * Run: node scripts/notion-sync.js
 *
 * 1. Fetches project metadata from Notion → data/projects.json
 * 2. Fetches full block content for each project → data/pages.json
 *    (replaces expiring S3 image URLs with stable /api/notion-image proxy URLs)
 *
 * Uses Notion API v5 (@notionhq/client v5) — dataSources.query instead of databases.query
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

/* ── Config ──────────────────────────────────────────────── */
const NOTION_KEY     = process.env.NOTION_API_KEY || process.env.NOTION_KEY;
const DATA_SOURCE_ID = 'f10273fc0bd24a09bcba022726aa63ad'; // linked view on Work page
const OUT_FILE       = path.join(__dirname, '..', 'data', 'projects.json');
const PAGES_FILE     = path.join(__dirname, '..', 'data', 'pages.json');

if (!NOTION_KEY) {
  console.error('❌  NOTION_API_KEY env var not set. Export it and re-run.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_KEY });

/* ── Property helpers ────────────────────────────────────── */
function getText(prop) {
  if (!prop) return '';
  if (prop.type === 'title')     return prop.title.map(t => t.plain_text).join('');
  if (prop.type === 'rich_text') return prop.rich_text.map(t => t.plain_text).join('');
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

/* ── Block fetching ──────────────────────────────────────── */

const RECURSE_TYPES = new Set([
  'column_list', 'column', 'toggle', 'table',
  'synced_block', 'quote', 'callout',
  'bulleted_list_item', 'numbered_list_item',
]);

async function fetchChildren(blockId) {
  const results = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    results.push(...res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return results;
}

async function buildChildrenMap(blocks, childrenMap = {}) {
  await Promise.all(
    blocks
      .filter((b) => b.has_children && RECURSE_TYPES.has(b.type))
      .map(async (block) => {
        const sourceId =
          block.type === 'synced_block'
            ? (block.synced_block?.synced_from?.block_id ?? block.id)
            : block.id;
        const children = await fetchChildren(sourceId);
        childrenMap[block.id] = children;
        await buildChildrenMap(children, childrenMap);
      })
  );
  return childrenMap;
}

// Replace expiring Notion S3 signed URLs with stable proxy URLs.
// Mutates blocks and childrenMap in place.
function replaceExpiringUrls(blocks, childrenMap) {
  const FILE_BLOCK_TYPES = ['image', 'file', 'pdf', 'video', 'audio'];

  const replaceInBlock = (block) => {
    for (const type of FILE_BLOCK_TYPES) {
      if (block.type === type && block[type]?.type === 'file') {
        block[type].file.url = `/api/notion-image?block_id=${block.id}`;
      }
    }
  };

  const allBlocks = [...blocks, ...Object.values(childrenMap).flat()];
  allBlocks.forEach(replaceInBlock);
}

/* ── Sync project metadata ───────────────────────────────── */
async function syncProjects() {
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

    return {
      id:         page.id,
      title,
      slug:       title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      desc:       getText(p['Description'] ?? p['Desc']),
      summary:    getText(p['Summary'] ?? p['Tagline'] ?? p['Excerpt']),
      status:     getSelect(p['Status']),
      tags:       getMultiSelect(p['Tags'] ?? p['Type']),
      cover:      `/api/notion-image?id=${page.id}`,
      url:        getUrl(p['URL'] ?? p['Link'] ?? p['Notion URL']),
      featured:   getCheckbox(p['Featured']),
      order:      getNumber(p['Order'] ?? p['Sort'] ?? p['Priority']),
      notionUrl:  page.url,
      lastEdited: page.last_edited_time,
    };
  }));

  projects.sort((a, b) => {
    const aOrder = a.order ?? Infinity;
    const bOrder = b.order ?? Infinity;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.lastEdited) - new Date(a.lastEdited);
  });

  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUT_FILE, JSON.stringify(projects, null, 2));
  console.log(`📦  Written to ${OUT_FILE} (${projects.length} projects)`);

  return projects;
}

/* ── Sync full page content ──────────────────────────────── */
async function syncPageContent(projects) {
  console.log('\n🔄  Syncing full page content…');
  const pages = {};

  for (const project of projects) {
    try {
      process.stdout.write(`   ${project.title}… `);

      const blocks = await fetchChildren(project.id);
      const childrenMap = await buildChildrenMap(blocks);

      // Safety pass: fetch children for callouts Notion reported as childless
      const allBlocks = [...blocks, ...Object.values(childrenMap).flat()];
      await Promise.all(
        allBlocks
          .filter((b) => b.type === 'callout' && !childrenMap[b.id])
          .map(async (b) => { childrenMap[b.id] = await fetchChildren(b.id); })
      );

      // Replace expiring S3 URLs with stable proxy paths
      replaceExpiringUrls(blocks, childrenMap);

      pages[project.id] = {
        blocks,
        childrenMap,
        meta: {
          title:      project.title,
          desc:       project.desc,
          tags:       project.tags,
          cover:      project.cover,
          url:        project.url,
          notionUrl:  project.notionUrl,
          lastEdited: project.lastEdited,
        },
      };

      const blockCount = blocks.length + Object.values(childrenMap).flat().length;
      console.log(`✓ (${blockCount} blocks)`);
    } catch (err) {
      console.log(`⚠  skipped — ${err.message}`);
    }
  }

  fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
  console.log(`\n📦  Written to ${PAGES_FILE}`);
  console.log(`    ${Object.keys(pages).length}/${projects.length} projects cached.`);
}

/* ── Entry point ─────────────────────────────────────────── */
async function sync() {
  const projects = await syncProjects();
  await syncPageContent(projects);
}

sync().catch(err => {
  console.error('❌  Sync failed:', err.message ?? err);
  process.exit(1);
});
