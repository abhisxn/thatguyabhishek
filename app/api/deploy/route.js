// POST /api/deploy
// Triggers a full Vercel rebuild via Deploy Hook.
// Runs notion-sync.js + next build → updates data/pages.json + all bundled content.
// Required env vars:
//   VERCEL_DEPLOY_HOOK_URL — the deploy hook URL from Vercel project settings
//   REFRESH_SECRET        — optional bearer token to protect this endpoint

export async function POST(request) {
  const secret = process.env.REFRESH_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return Response.json({ ok: false, error: 'VERCEL_DEPLOY_HOOK_URL not configured' }, { status: 503 });
  }

  const res = await fetch(hookUrl, { method: 'POST' });
  if (!res.ok) {
    return Response.json({ ok: false, error: `Deploy hook returned ${res.status}` }, { status: 502 });
  }

  return Response.json({ ok: true, type: 'rebuild', message: 'Build triggered — takes 3–5 minutes. Check Vercel dashboard for progress.' });
}
