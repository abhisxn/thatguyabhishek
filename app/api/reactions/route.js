import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getReactions, REACTIONS } from '@/lib/reactions';

const VALID_KEYS = new Set(REACTIONS.map((r) => r.key));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userReaction = cookieStore.get(`reaction_${slug}`)?.value ?? null;
  const safeUserReaction = userReaction && VALID_KEYS.has(userReaction) ? userReaction : null;

  const { counts, total, error } = await getReactions(slug);

  return NextResponse.json({
    counts,
    total,
    userReaction: safeUserReaction,
    ...(error && { degraded: true }),
  });
}
