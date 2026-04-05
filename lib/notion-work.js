import { unstable_cache } from 'next/cache';
import notion from './notion';
import { withRetry, createLimiter } from './notion-utils';

const WORK_PAGE_ID = '372d8d3491624c4ebaa062d8bdb242dc';
const WORK_DS_ID   = 'f10273fc0bd24a09bcba022726aa63ad';

const limit = createLimiter(3);

async function fetchChildren(blockId) {
  const res = await withRetry(() =>
    limit(() => notion.blocks.children.list({ block_id: blockId }))
  );
  return res.results;
}

async function fetchColumnListChildren(block, childrenMap) {
  const columns = await fetchChildren(block.id);
  childrenMap[block.id] = columns;
  await Promise.all(
    columns.map(async (col) => {
      if (!col.has_children) return;
      const colContent = await fetchChildren(col.id);
      childrenMap[col.id] = colContent;
      await Promise.all(
        colContent.filter((b) => b.has_children).map(async (b) => {
          childrenMap[b.id] = await fetchChildren(b.id);
        })
      );
    })
  );
}

async function fetchBlocksWithChildren(pageId) {
  const blocks = await fetchChildren(pageId);
  const childrenMap = {};

  await Promise.all(
    blocks
      .filter((b) => b.has_children && (b.type === 'column_list' || b.type === 'synced_block' || b.type === 'callout'))
      .map(async (block) => {
        if (block.type === 'column_list') {
          await fetchColumnListChildren(block, childrenMap);
        }
        if (block.type === 'synced_block') {
          const originalId = block.synced_block?.synced_from?.block_id ?? block.id;
          const syncedChildren = await fetchChildren(originalId);
          childrenMap[block.id] = syncedChildren;
          await Promise.all(
            syncedChildren
              .filter((b) => b.has_children && b.type === 'column_list')
              .map((b) => fetchColumnListChildren(b, childrenMap))
          );
        }
        if (block.type === 'callout') {
          childrenMap[block.id] = await fetchChildren(block.id);
        }
      })
  );

  return { blocks, childrenMap };
}

async function _getHomePageData() {
  const result = await fetchBlocksWithChildren('5c597b62-cdaa-48f2-9ac2-83c421189974'.replace(/-/g, ''));

  // Ensure ALL callout children are fetched regardless of has_children.
  // Notion sometimes returns has_children:false for callouts that contain only
  // dividers or other childless blocks — this safety pass catches those gaps.
  const allBlocks = [...result.blocks, ...Object.values(result.childrenMap).flat()];
  await Promise.all(
    allBlocks
      .filter((b) => b.type === 'callout' && !result.childrenMap[b.id])
      .map(async (b) => { result.childrenMap[b.id] = await fetchChildren(b.id); })
  );

  return result;
}

export const getHomePageData = unstable_cache(
  _getHomePageData,
  ['home-page-data'],
  { revalidate: 3600, tags: ['notion'] }
);

async function _getWorkPageData() {
  const [blocksRes, projectsRes] = await Promise.all([
    withRetry(() => limit(() => notion.blocks.children.list({ block_id: WORK_PAGE_ID }))),
    withRetry(() => limit(() => notion.dataSources.query({ data_source_id: WORK_DS_ID }))),
  ]);
  const blocks = blocksRes.results;
  const projects = projectsRes.results;
  const childrenMap = {};

  await Promise.all(
    blocks
      .filter((b) => b.has_children && (b.type === 'column_list' || b.type === 'synced_block' || b.type === 'callout'))
      .map(async (block) => {
        if (block.type === 'column_list') {
          await fetchColumnListChildren(block, childrenMap);
        }
        if (block.type === 'synced_block') {
          const originalId = block.synced_block?.synced_from?.block_id ?? block.id;
          const syncedChildren = await fetchChildren(originalId);
          childrenMap[block.id] = syncedChildren;
          await Promise.all(
            syncedChildren
              .filter((b) => b.has_children && b.type === 'column_list')
              .map((b) => fetchColumnListChildren(b, childrenMap))
          );
        }
        if (block.type === 'callout') {
          childrenMap[block.id] = await fetchChildren(block.id);
        }
      })
  );

  // Ensure ALL callout children are fetched regardless of has_children.
  // Notion sometimes returns has_children:false for callouts that contain only
  // dividers or other childless blocks — this safety pass catches those gaps.
  const allBlocks = [...blocks, ...Object.values(childrenMap).flat()];
  await Promise.all(
    allBlocks
      .filter((b) => b.type === 'callout' && !childrenMap[b.id])
      .map(async (b) => { childrenMap[b.id] = await fetchChildren(b.id); })
  );

  return { blocks, projects, childrenMap };
}

export const getWorkPageData = unstable_cache(
  _getWorkPageData,
  ['work-page-data'],
  { revalidate: 3600, tags: ['notion'] }
);

/* ── What I'm Thinking About ─────────────────────────────────────── */
const THINKING_DS_ID = 'd02ae11e-f2c7-4d9c-bbad-3426ba9ad621';

async function _getThinkingItems() {
  const res = await withRetry(() =>
    limit(() => notion.dataSources.query({ data_source_id: THINKING_DS_ID }))
  );
  return res.results.map((page) => ({
    id: page.id,
    title: page.properties.Title?.title?.map((t) => t.plain_text).join('') || '',
    description: page.properties.Description?.rich_text?.map((t) => t.plain_text).join('') || '',
    topic: page.properties.Topic?.select?.name || '',
    url: `https://www.notion.so/${page.id.replace(/-/g, '')}`,
  }));
}

export const getThinkingItems = unstable_cache(
  _getThinkingItems,
  ['thinking-items'],
  { revalidate: 3600, tags: ['notion'] }
);

export function getTitle(page) {
  const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
  return titleProp?.title?.map((t) => t.plain_text).join('') || 'Untitled';
}

export function getDescription(page) {
  const keys = ['Description', 'Desc', 'Bio', 'About'];
  for (const key of keys) {
    const prop = page.properties[key];
    if (prop?.type === 'rich_text' && prop.rich_text.length > 0)
      return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return null;
}

export function getSummary(page) {
  const keys = ['Summary', 'Tagline', 'Excerpt'];
  for (const key of keys) {
    const prop = page.properties[key];
    if (prop?.type === 'rich_text' && prop.rich_text.length > 0)
      return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return null;
}

export function getTags(page) {
  const keys = ['Tags', 'Tech', 'Stack', 'Category', 'Type'];
  for (const key of keys) {
    const prop = page.properties[key];
    if (prop?.type === 'multi_select' && prop.multi_select.length > 0)
      return prop.multi_select.map((t) => t.name);
    if (prop?.type === 'select' && prop.select) return [prop.select.name];
  }
  return [];
}

export function getCoverUrl(page) {
  // 1. Native Notion page cover (banner)
  if (page.cover?.type === 'external') return page.cover.external.url;
  if (page.cover?.type === 'file') return page.cover.file.url;

  // 2. Cover stored as a Files property (Cover / Image / Thumbnail)
  const p = page.properties ?? {};
  const fileProp = p['Cover'] ?? p['Image'] ?? p['Thumbnail'] ?? p['cover'] ?? p['image'];
  if (fileProp?.type === 'files' && fileProp.files?.length) {
    const f = fileProp.files[0];
    return f.type === 'external' ? f.external.url : (f.file?.url ?? null);
  }

  return null;
}

/**
 * Extract the first image URL from a list of already-fetched blocks.
 * Used by getProjectPageData to derive a thumbnail when there's no page cover.
 */
export function getFirstBlockImage(blocks = []) {
  for (const block of blocks) {
    if (block.type === 'image') {
      if (block.image?.type === 'external') return block.image.external.url;
      if (block.image?.type === 'file')     return block.image.file.url;
    }
  }
  return null;
}

export function getUrl(page) {
  const keys = ['URL', 'Link', 'Website', 'Url', 'Demo', 'Live'];
  for (const key of keys) {
    const prop = page.properties[key];
    if (prop?.type === 'url' && prop.url) return prop.url;
  }
  return null;
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Fetch all projects from Notion once, cache the result. */
async function fetchAllProjects() {
  const results = [];
  let cursor;
  do {
    const res = await withRetry(() =>
      notion.dataSources.query({
        data_source_id: WORK_DS_ID,
        ...(cursor ? { start_cursor: cursor } : {}),
      })
    );
    results.push(...res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return results;
}

/**
 * Find a project page by slug — used as fallback when slug isn't in static JSON.
 */
export async function findProjectBySlug(slug) {
  const pages = await fetchAllProjects();
  return pages.find((p) => slugify(getTitle(p)) === slug) ?? null;
}

/**
 * Find a project page by its Notion page ID — used to resolve semantic IDs
 * that pages.retrieve doesn't support, by going through dataSources.query.
 */
export async function findProjectById(id) {
  const pages = await fetchAllProjects();
  return pages.find((p) => p.id === id) ?? null;
}
