export const revalidate = 3600;

import AboutClient from './AboutClient';
import { getThinkingItems, getWritingArticles } from '@/lib/notion-work';

export default async function AboutPage() {
  let thinkingItems = [];
  let articles = [];
  try {
    [thinkingItems, articles] = await Promise.all([
      getThinkingItems(),
      getWritingArticles(),
    ]);
  } catch {
    // fall through with empty arrays — static fallbacks in AboutClient
  }
  return <AboutClient thinkingItems={thinkingItems} articles={articles} />;
}
