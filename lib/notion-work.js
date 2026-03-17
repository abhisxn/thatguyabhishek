import notion from './notion';

const WORK_PAGE_ID = '372d8d3491624c4ebaa062d8bdb242dc';
const WORK_DS_ID   = 'f10273fc0bd24a09bcba022726aa63ad';

async function fetchChildren(blockId) {
  const res = await notion.blocks.children.list({ block_id: blockId });
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

export async function getWorkPageData() {
  const [blocksRes, projectsRes] = await Promise.all([
    notion.blocks.children.list({ block_id: WORK_PAGE_ID }),
    notion.dataSources.query({ data_source_id: WORK_DS_ID }),
  ]);
  const blocks = blocksRes.results;
  const projects = projectsRes.results;
  const childrenMap = {};

  await Promise.all(
    blocks
      .filter((b) => b.has_children && (b.type === 'column_list' || b.type === 'synced_block'))
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
      })
  );
  return { blocks, projects, childrenMap };
}

export function getTitle(page) {
  const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
  return titleProp?.title?.map((t) => t.plain_text).join('') || 'Untitled';
}

export function getDescription(page) {
  const keys = ['Description', 'Summary', 'Tagline', 'Bio', 'Excerpt', 'About'];
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
  // 1. Native Notion page cover
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

export function getUrl(page) {
  const keys = ['URL', 'Link', 'Website', 'Url', 'Demo', 'Live'];
  for (const key of keys) {
    const prop = page.properties[key];
    if (prop?.type === 'url' && prop.url) return prop.url;
  }
  return null;
}
