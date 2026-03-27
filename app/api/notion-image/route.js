import { NextResponse } from 'next/server';
import notion from '../../../lib/notion';

// Re-fetch from Notion just before the S3 signed URL expires (1hr TTL)
export const revalidate = 3500;

async function getCoverUrl(pageId) {
  // 1. Native Notion page cover
  const page = await notion.pages.retrieve({ page_id: pageId });

  if (page.cover?.type === 'external') return page.cover.external.url;
  if (page.cover?.type === 'file')     return page.cover.file.url;

  // 2. Cover / Image / Thumbnail property
  const props = page.properties ?? {};
  for (const key of ['Cover', 'Image', 'Thumbnail']) {
    const prop = props[key];
    if (prop?.files?.length) {
      const f = prop.files[0];
      const url = f.type === 'external' ? f.external?.url : f.file?.url;
      if (url) return url;
    }
  }

  // 3. First image block in page content
  const blocks = await notion.blocks.children.list({ block_id: pageId, page_size: 50 });
  for (const block of blocks.results) {
    if (block.type === 'image') {
      if (block.image?.type === 'external') return block.image.external.url;
      if (block.image?.type === 'file')     return block.image.file.url;
    }
  }

  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return new Response('Missing id', { status: 400 });

  try {
    const url = await getCoverUrl(id);
    if (!url) return new Response('No cover found', { status: 404 });
    return NextResponse.redirect(url, 307);
  } catch {
    return new Response('Failed to fetch cover', { status: 500 });
  }
}
