'use client';

import { useState, useEffect } from 'react';

export function useArticleToc(headings) {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: '0px 0px -65% 0px' }
    );
    headings.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return { activeSlug, progress };
}

export function estimateReadTime(blocks) {
  const words = blocks
    .flatMap((b) => {
      const texts = b[b.type]?.rich_text ?? b[b.type]?.caption ?? [];
      return texts.map((t) => t.plain_text);
    })
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
