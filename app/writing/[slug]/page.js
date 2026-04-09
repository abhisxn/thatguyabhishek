export const revalidate = 3600;
export const dynamicParams = true;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWritingArticles, getArticleBySlug, getArticleBlocks } from '../../../lib/notion-work';
import ArticleClient from './ArticleClient';

const BASE_URL = 'https://thatguyabhishek.com';

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

  return (
    <ArticleClient
      article={article}
      blocks={blocksData.blocks}
      childrenMap={blocksData.childrenMap}
      otherArticles={otherArticles}
    />
  );
}
