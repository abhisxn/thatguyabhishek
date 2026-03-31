'use client';

import Link from 'next/link';
import './card.css';
import Tag from './Tag';
export { CARD_SIZES, CARD_STYLES, styleForNotion } from './card-utils';
import { CARD_SIZES, CARD_STYLES } from './card-utils';

/* ─────────────────────────────────────────────────────────────────────────────
 * CARD COMPONENT
 *
 * Props:
 *   size       "xl" | "l" | "m" | "s" | "xs"                        default "l"
 *   cardStyle  "default" | "elevated" | "outline" | "tinted" | "dark" default "default"
 *   title      string | ReactNode
 *   desc       string | ReactNode
 *   tags       string[]
 *   img        string — image URL
 *   href       string
 *   label      string — CTA button text                              default "Know more"
 *   loading    "lazy" | "eager"                                       default "lazy"
 *   altText    string — img alt override when title is a ReactNode
 *   emoji      string — optional emoji displayed above title
 *   showDesc   boolean — override size config to force show/hide description
 * ──────────────────────────────────────────────────────────────────────────── */
export default function Card({
  size      = 'l',
  cardStyle = 'default',
  title,
  desc,
  tags      = [],
  img,
  href,
  label     = 'Know more',
  loading   = 'lazy',
  altText,
  emoji,
  showDesc: showDescProp,
}) {
  const sz  = CARD_SIZES[size]       ?? CARD_SIZES.l;
  const sty = CARD_STYLES[cardStyle] ?? CARD_STYLES.default;
  const showDesc = showDescProp !== undefined ? showDescProp : sz.showDesc;
  const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

  const imgAlt = typeof title === 'string' ? title : (altText ?? '');
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));

  // Use Next.js Link for internal routes (client-side nav), plain <a> for external
  const Wrapper = isExternal ? 'a' : Link;
  const wrapperExtra = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      href={href ?? '#'}
      {...wrapperExtra}
      className={[
        'group block no-underline flex flex-col overflow-hidden h-full',
        'transition-transform duration-300 hover:-translate-y-1',
        sz.radius,
        sty.wrapper,
      ].join(' ')}
      style={sty.shadow !== 'none' ? { boxShadow: sty.shadow } : undefined}
    >
      {/* ── Image ── */}
      {sz.showImg && img && (
        <div className={[
          'w-full overflow-hidden shrink-0',
          sz.hoverPad,
          `transition-[padding] duration-[400ms] ${ease}`,
        ].join(' ')}>
          {/* Inner wrapper — clips scale animation */}
          <div className={[
            'relative overflow-hidden w-full',
            sz.imgHeight,
            sz.imgRadius,
            `transition-[border-radius] duration-[400ms] ${ease}`,
          ].join(' ')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={imgAlt}
              loading={loading}
              className={[
                'absolute inset-0 w-full h-full object-cover',
                `transition-transform duration-[350ms] ${ease}`,
                'group-hover:scale-[1.08]',
              ].join(' ')}
            />

          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className={[
        'flex flex-col items-start flex-1',
        sz.contentGap,
      ].join(' ')}>

        {/* Emoji badge (Notion callout icon) */}
        {emoji && <span className="text-2xl leading-none">{emoji}</span>}

        {/* Title + description block */}
        {title && (
          <div className={`flex flex-col w-full ${sz.innerGap}`}>
            <p className={`w-full ${sz.titleCls} ${sty.titleClr}`}>
              {title}
            </p>
            {showDesc && desc && (
              <div className={`leading-relaxed w-full ${sz.descCls ?? 't-body2'} ${sty.descClr}`}>
                {desc}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {sz.showTags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 w-full">
            {tags.map((tag) => <Tag key={tag} label={tag} />)}
          </div>
        )}

        {/* CTA button — span inside the wrapper link, click bubbles up */}
        {sz.showBtn && href && (
          <span className={[
            'mt-auto inline-flex items-center justify-center',
            'px-5 py-3 rounded-full t-btn1 font-semibold border-2',
            'transition-colors duration-200',
            sty.btn,
          ].join(' ')}>
            {label}
          </span>
        )}
      </div>
    </Wrapper>
  );
}
