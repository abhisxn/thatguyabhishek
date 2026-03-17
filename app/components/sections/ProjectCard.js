import Card from '../ui/Card';
import { styleForNotion } from '../ui/card-utils';
import { getTitle, getDescription, getTags, getCoverUrl, getUrl } from '../../../lib/notion-work';

export function ProjectCard({ page, size: sizeProp, cardStyle: styleProp }) {
  const title   = getTitle(page);
  const desc    = getDescription(page);
  const tags    = getTags(page);
  const url     = getUrl(page) ?? page.url;
  const coverUrl = getCoverUrl(page);

  // Derive consistent size + style from Notion DB page data unless overridden
  const { size: inferredSize, cardStyle: inferredStyle } = styleForNotion(page, 'db');
  const size      = sizeProp   ?? inferredSize;
  const cardStyle = styleProp  ?? inferredStyle;

  return (
    <Card
      size={size}
      cardStyle={cardStyle}
      title={title}
      desc={desc}
      tags={tags}
      img={coverUrl}
      href={url}
      altText={title}
      loading="lazy"
    />
  );
}

export function ProjectsGrid({ projects, size, cardStyle }) {
  if (!projects.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((page) => (
        <ProjectCard
          key={page.id}
          page={page}
          size={size}
          cardStyle={cardStyle}
        />
      ))}
    </div>
  );
}
