// ISR: revalidate every hour — Notion signed image URLs expire after ~1 hour
export const revalidate = 3600;

import GradientBackground from './components/layout/GradientBackground';
import HomeHero from './components/sections/HomeHero';
import AboutSection from './components/sections/AboutSection';
import JourneySoFar from './components/sections/JourneySoFar';
import HelpSection from './components/sections/HelpSection';
import FadeSection from './components/ui/FadeSection';
import CalloutBlock from './components/sections/CalloutBlock';
import MoreWorkCard from './components/sections/MoreWorkCard';
import { getHomePageData } from '../lib/notion-work';
import { getCalloutType } from './components/ui/card-utils';

function collectCardCallouts(blocks, childrenMap) {
  const cards = [];
  for (const block of blocks) {
    if (block.type === 'callout' && getCalloutType(block) === 'card') {
      cards.push(block);
    } else if (block.type === 'column_list') {
      const columns = childrenMap[block.id] ?? [];
      for (const col of columns) {
        for (const b of (childrenMap[col.id] ?? [])) {
          if (b.type === 'callout' && getCalloutType(b) === 'card') {
            cards.push(b);
          }
        }
      }
    }
  }
  return cards;
}

export default async function Home() {
  let cardBlocks = [];
  let childrenMap = {};

  try {
    const data = await getHomePageData();
    childrenMap = data.childrenMap;
    cardBlocks = collectCardCallouts(data.blocks, data.childrenMap);
  } catch {
    // fail silently — page renders without Notion content
  }

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen text-fg z-[1]">

        <HomeHero />

        {cardBlocks.length > 0 && (
          <FadeSection>
            <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
              <h2 className="mb-12">🎨 Work</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                {cardBlocks.map((b) => (
                  <CalloutBlock key={b.id} block={b} childrenMap={childrenMap} />
                ))}
                <MoreWorkCard />
              </div>
            </div>
          </FadeSection>
        )}

        <AboutSection />
        <JourneySoFar />
        <HelpSection />

      </main>
    </>
  );
}
