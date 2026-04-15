import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getReactions, setReaction } from '@/lib/reactions';
import { REACTIONS } from '@/lib/reaction-types';

const VALID_KEYS = new Set(REACTIONS.map((r) => r.key));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get('slug');
  const slug = rawSlug?.trim() ?? '';

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  if (slug.length > 200) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { slug: rawSlug, reaction } = body;
  const slug = rawSlug?.trim() ?? '';

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  if (slug.length > 200) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }
  if (reaction !== null && reaction !== undefined && !VALID_KEYS.has(reaction)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 });
  }
  const safeReaction = reaction ?? null;

  const cookieStore = await cookies();
  const prevRaw = cookieStore.get(`reaction_${slug}`)?.value ?? null;
  const prevReaction = prevRaw && VALID_KEYS.has(prevRaw) ? prevRaw : null;

  const { counts, total, error } = await setReaction(slug, prevReaction, safeReaction);

  const response = NextResponse.json({
    counts,
    total,
    userReaction: safeReaction,
    ...(error && { degraded: true }),
  });

  if (safeReaction) {
    response.cookies.set(`reaction_${slug}`, safeReaction, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    response.cookies.delete(`reaction_${slug}`);
  }

  return response;
}
