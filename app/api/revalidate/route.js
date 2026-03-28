import { revalidateTag } from 'next/cache';

// POST /api/revalidate
// Busts the ISR cache for all Notion-sourced pages (home, work, about, awards, contact).
// Does NOT update data/pages.json — project body content stays frozen until a full rebuild.
// Protected by REFRESH_SECRET env var to prevent abuse.

export async function POST(request) {
  const secret = process.env.REFRESH_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  revalidateTag('notion');

  return Response.json({ ok: true, type: 'isr', message: 'ISR cache cleared — next request will re-fetch from Notion' });
}
