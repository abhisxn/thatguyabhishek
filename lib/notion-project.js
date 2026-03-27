import { unstable_cache } from 'next/cache';
import notion from './notion';
import { getTitle, getDescription, getTags, getCoverUrl, getFirstBlockImage, getUrl, findProjectById } from './notion-work';
import { withRetry, createLimiter } from './notion-utils';

/* ── Block types that can have children we need to fetch ───────────────── */
const RECURSE_TYPES = new Set([
  'column_list', 'column', 'toggle', 'table',
  'synced_block', 'quote', 'callout',
  'bulleted_list_item', 'numbered_list_item',
]);

// Cap concurrent Notion API calls per page fetch — stays well under 3 req/s
const limit = createLimiter(3);

async function fetchChildren(blockId) {
  const results = [];
  let cursor;
  do {
    const res = await withRetry(() =>
      limit(() => notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      }))
    );
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

async function _getProjectPageData(pageId) {
  // Semantic IDs (UUID v8) are not supported by pages.retrieve — fall back to dataSources.query
  let pageRes;
  try {
    pageRes = await notion.pages.retrieve({ page_id: pageId });
  } catch {
    pageRes = await findProjectById(pageId);
    if (!pageRes) throw new Error(`Project not found: ${pageId}`);
  }

  const blocks = await fetchChildren(pageId);
  const childrenMap = await buildChildrenMap(blocks);

  // Safety pass: fetch children for any callout not covered by buildChildrenMap.
  // Notion can return has_children:false for callouts containing only dividers,
  // causing buildChildrenMap to skip them.
  const allProjectBlocks = [...blocks, ...Object.values(childrenMap).flat()];
  await Promise.all(
    allProjectBlocks
      .filter((b) => b.type === 'callout' && !childrenMap[b.id])
      .map(async (b) => { childrenMap[b.id] = await fetchChildren(b.id); })
  );

  return {
    page: pageRes,
    blocks,
    childrenMap,
    meta: {
      title:    getTitle(pageRes),
      desc:     getDescription(pageRes),
      tags:     getTags(pageRes),
      cover:    getCoverUrl(pageRes) ?? getFirstBlockImage(blocks),
      url:      getUrl(pageRes),
      notionUrl: pageRes.url,
      lastEdited: pageRes.last_edited_time,
    },
  };
}

export function getProjectPageData(pageId) {
  return unstable_cache(
    () => _getProjectPageData(pageId),
    [`project-page-${pageId}`],
    { revalidate: 3600, tags: ['notion'] }
  )();
}
