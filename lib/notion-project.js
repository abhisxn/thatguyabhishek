import notion from './notion';
import { getTitle, getDescription, getTags, getCoverUrl, getUrl } from './notion-work';

/* ── Block types that can have children we need to fetch ───────────────── */
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

export async function getProjectPageData(pageId) {
  const [pageRes, blocksRes] = await Promise.all([
    notion.pages.retrieve({ page_id: pageId }),
    fetchChildren(pageId),
  ]);

  const blocks = blocksRes;
  const childrenMap = await buildChildrenMap(blocks);

  return {
    page:     pageRes,
    blocks,
    childrenMap,
    meta: {
      title:    getTitle(pageRes),
      desc:     getDescription(pageRes),
      tags:     getTags(pageRes),
      cover:    getCoverUrl(pageRes),
      url:      getUrl(pageRes),
      notionUrl: pageRes.url,
      edited:   pageRes.last_edited_time,
    },
  };
}
