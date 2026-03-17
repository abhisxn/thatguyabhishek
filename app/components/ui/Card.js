'use client';

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
}) {
  const sz  = CARD_SIZES[size]       ?? CARD_SIZES.l;
  const sty = CARD_STYLES[cardStyle] ?? CARD_STYLES.default;
  const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

  const imgAlt = typeof title === 'string' ? title : (altText ?? '');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'group block no-underline flex flex-col overflow-hidden',
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={imgAlt}
            loading={loading}
            className={[
              'w-full object-cover block',
              sz.imgHeight,
              sz.imgRadius,
              `transition-[border-radius] duration-[400ms] ${ease}`,
            ].join(' ')}
          />
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
            <p className={`leading-tight w-full ${sz.titleCls} ${sty.titleClr}`}>
              {title}
            </p>
            {sz.showDesc && desc && (
              <p className={`t-body1 font-medium leading-relaxed w-full ${sty.descClr}`}>
                {desc}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        {sz.showTags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 w-full">
            {tags.map((tag) => <Tag key={tag} label={tag} />)}
          </div>
        )}

        {/* CTA button — pinned to bottom with mt-auto */}
        {sz.showBtn && (
          <span className={[
            'mt-auto inline-flex items-center justify-center',
            'px-5 py-2.5 rounded-full t-btn1 font-semibold border-2',
            'transition-colors duration-200',
            sty.btn,
          ].join(' ')}>
            {label}
          </span>
        )}
      </div>
    </a>
  );
}
