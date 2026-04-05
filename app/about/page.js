export const revalidate = 3600;

import AboutClient from './AboutClient';
import { getThinkingItems } from '../../lib/notion-work';

export default async function AboutPage() {
  let thinkingItems = [];
  try {
    thinkingItems = await getThinkingItems();
  } catch {
    // fall through with empty array — static fallback in AboutClient
  }
  return <AboutClient thinkingItems={thinkingItems} />;
}
