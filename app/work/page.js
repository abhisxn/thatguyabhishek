import GradientBackground from '../components/layout/GradientBackground';
import Hero from '../components/sections/Hero';
import { getWorkPageData } from '../../lib/notion-work';
import { getImageUrl } from '../components/sections/CalloutBlock';
import { RenderBlocks } from '../components/sections/NotionBlocks';
import { ProjectsGrid } from '../components/sections/ProjectCard';

export default async function WorkPage() {
  let blocks = [];
  let projects = [];
  let childrenMap = {};
  let error = null;

  try {
    const data = await getWorkPageData();
    blocks = data.blocks;
    projects = data.projects;
    childrenMap = data.childrenMap;
  } catch (err) {
    error = err.message;
  }

  const heroBlock = blocks[0]?.type === 'image' ? blocks[0] : null;
  const contentBlocks = heroBlock ? blocks.slice(1) : blocks;
  const hasDbBlock = blocks.some((b) => b.type === 'child_database' || b.type === 'child_data_source');

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen pt-16" style={{ color: 'var(--fg)', zIndex: 1 }}>
        {heroBlock && (
          <Hero
            variant="banner-boxed"
            eyebrow="Portfolio"
            title="Work & Projects"
            description="A collection of product design work spanning AI features, consumer apps, enterprise systems, and design leadership."
            media={
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={getImageUrl(heroBlock.image)} alt="Work hero" className="w-full h-full object-cover" />
            }
          />
        )}

        <div className="px-6 sm:px-10 lg:px-16 py-16 max-w-[1200px] mx-auto">
          {error ? (
            <p className="text-sm text-black/40 dark:text-white/40">Could not load page: {error}</p>
          ) : (
            <div className="flex flex-col gap-6">
              <RenderBlocks blocks={contentBlocks} projects={projects} childrenMap={childrenMap} />
              {!hasDbBlock && <ProjectsGrid projects={projects} />}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
