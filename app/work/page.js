// ISR: revalidate every hour — Notion signed image URLs expire after ~1 hour
export const revalidate = 3600;

import GradientBackground from '../components/layout/GradientBackground';
import FadeSection from '../components/ui/FadeSection';
import CalloutBlock from '../components/sections/CalloutBlock';
import { getWorkPageData } from '../../lib/notion-work';
import { RenderBlocks } from '../components/sections/NotionBlocks';
import ProjectsExpandableGrid from '../components/sections/ProjectsExpandableGrid';
import { getCalloutType } from '../components/ui/card-utils';
import projectsJson from '../../data/projects.json';

export default async function WorkPage() {
  let proseBlocks = [];
  let cardBlocks  = [];
  let childrenMap = {};
  let error = null;

  try {
    const data = await getWorkPageData();
    childrenMap = data.childrenMap;

    const raw = data.blocks;
    const all = raw[0]?.type === 'image' ? raw.slice(1) : raw;

    for (const b of all) {
      if (b.type === 'callout' && getCalloutType(b) === 'card') {
        cardBlocks.push(b);
      } else {
        proseBlocks.push(b);
      }
    }
  } catch (err) {
    error = err.message;
  }

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen pt-16" style={{ color: 'var(--fg)', zIndex: 1 }}>

        {error ? (
          <div className="px-6 sm:px-10 lg:px-16 py-16 max-w-[1200px] mx-auto">
            <p className="text-sm text-black/40 dark:text-white/40">Could not load page: {error}</p>
          </div>
        ) : (
          <>
            {/* Prose content — description, intro text */}
            {proseBlocks.length > 0 && (
              <FadeSection className="px-6 sm:px-10 lg:px-16 pt-16 pb-4 max-w-[1200px] mx-auto flex flex-col gap-4">
                <RenderBlocks blocks={proseBlocks} childrenMap={childrenMap} skipDatabase />
              </FadeSection>
            )}

            {/* Featured project cards grid */}
            {cardBlocks.length > 0 && (
              <FadeSection className="border-t border-theme">
                <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    {cardBlocks.map((b) => {
                      const children = childrenMap[b.id] ?? [];
                      const heading  = children.find((c) => c.type === 'heading_1' || c.type === 'heading_2' || c.type === 'heading_3');
                      const headingText = heading ? (heading[heading.type]?.rich_text ?? []).map((t) => t.plain_text).join('').toLowerCase() : '';
                      const hrefOverride = headingText.includes('excited') ? 'https://www.behance.net/thatguyabhishek' : undefined;
                      return <CalloutBlock key={b.id} block={b} childrenMap={childrenMap} hrefOverride={hrefOverride} />;
                    })}
                  </div>
                </div>
              </FadeSection>
            )}

            {/* All projects grid */}
            <section className="border-t border-theme px-6 sm:px-10 lg:px-16 py-20 max-w-[1200px] mx-auto">
              <ProjectsExpandableGrid
                projects={projectsJson}
                heading="All Projects"
              />
            </section>
          </>
        )}
      </main>
    </>
  );
}
