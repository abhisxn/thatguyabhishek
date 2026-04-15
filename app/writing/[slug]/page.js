export const revalidate = 3600;
export const dynamicParams = true;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWritingArticles, getArticleBySlug, getArticleBlocks } from '@/lib/notion-work';
import ArticleClient from './ArticleClient';
import { slugify } from '@/lib/slugify';

const BASE_URL = 'https://thatguyabhishek.com';

function extractHeadings(blocks) {
  const seen = {};
  return blocks
    .filter((b) => b.type === 'heading_1' || b.type === 'heading_2')
    .map((b) => {
      const level = b.type === 'heading_1' ? 1 : 2;
      const text = b[b.type].rich_text.map((t) => t.plain_text).join('');
      let slug = slugify(text);
      if (seen[slug] !== undefined) {
        seen[slug] += 1;
        slug = `${slug}-${seen[slug]}`;
      } else {
        seen[slug] = 0;
      }
      return { id: b.id, text, slug, level };
    });
}

export async function generateStaticParams() {
  try {
    const articles = await getWritingArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return {};
    const url = `${BASE_URL}/writing/${slug}`;
    return {
      title: article.title,
      description: article.desc || 'An essay by Abhishek Saxena.',
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        url,
        title: article.title,
        description: article.desc || 'An essay by Abhishek Saxena.',
        authors: ['Abhishek Saxena'],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.desc || 'An essay by Abhishek Saxena.',
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  let article, blocksData, allArticles;
  try {
    [article, allArticles] = await Promise.all([
      getArticleBySlug(slug),
      getWritingArticles(),
    ]);
  } catch {
    notFound();
  }

  if (!article) notFound();

  try {
    blocksData = await getArticleBlocks(article.id);
  } catch {
    blocksData = { blocks: [], childrenMap: {} };
  }

  const otherArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 3);
  const headings = extractHeadings(blocksData.blocks);

  return (
    <ArticleClient
      article={article}
      blocks={blocksData.blocks}
      childrenMap={blocksData.childrenMap}
      otherArticles={otherArticles}
      headings={headings}
    />
  );
}
