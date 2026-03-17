import RichText from '../ui/RichText';
import { CARD_SIZES, CARD_STYLES, styleForNotion } from '../ui/card-utils';

export function getImageUrl(imageBlock) {
  if (imageBlock.type === 'external') return imageBlock.external.url;
  if (imageBlock.type === 'file') return imageBlock.file.url;
  return null;
}

function findRichTextUrl(richText) {
  return richText?.find((t) => t.href)?.href ?? null;
}

function extractCalloutUrl(calloutTexts, children) {
  const fromCallout = findRichTextUrl(calloutTexts);
  if (fromCallout) return fromCallout;
  for (const b of children) {
    if (b.type === 'button') {
      const url = b.button?.action?.url ?? b.button?.url ?? findRichTextUrl(b.button?.rich_text);
      if (url) return url;
    }
    if (b.type === 'bookmark' && b.bookmark?.url) return b.bookmark.url;
    if (b.type === 'link_preview' && b.link_preview?.url) return b.link_preview.url;
    if (b.type === 'embed' && b.embed?.url) return b.embed.url;
    if (b.type === 'paragraph') {
      const url = findRichTextUrl(b.paragraph?.rich_text);
      if (url) return url;
    }
  }
  return null;
}

export default function CalloutBlock({ block, childrenMap }) {
  const icon = block.callout.icon;
  const emoji = icon?.type === 'emoji' ? icon.emoji : null;
  const texts = block.callout.rich_text;
  const calloutChildren = childrenMap?.[block.id] ?? [];

  const linkUrl = extractCalloutUrl(texts, calloutChildren);
  const imageBlock = calloutChildren.find((b) => b.type === 'image');
  const imageUrl = imageBlock ? getImageUrl(imageBlock.image) : null;

  const headingBlock = calloutChildren.find(
    (b) => b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3'
  );
  const titleTexts = texts.length > 0 ? texts : (headingBlock?.[headingBlock?.type]?.rich_text ?? []);
  const descParagraphs = calloutChildren.filter(
    (b) => b.type === 'paragraph' && b.paragraph?.rich_text?.length > 0
  );

  // Derive size + style from Notion callout color and presence of image
  const { size, cardStyle } = styleForNotion(block, 'callout', { hasImage: !!imageUrl });
  const sz  = CARD_SIZES[size];
  const sty = CARD_STYLES[cardStyle];
  const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

  const Wrapper = linkUrl ? 'a' : 'div';
  const wrapperProps = linkUrl
    ? { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        'group block no-underline flex flex-col overflow-hidden',
        'transition-transform duration-300 hover:-translate-y-1',
        sz.radius,
        sty.wrapper,
      ].join(' ')}
      style={sty.shadow !== 'none' ? { boxShadow: sty.shadow } : undefined}
    >
      {/* Image */}
      {imageUrl && (
        <div className={[
          'w-full overflow-hidden shrink-0',
          sz.hoverPad,
          `transition-[padding] duration-[400ms] ${ease}`,
        ].join(' ')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className={[
              'w-full object-cover block',
              sz.imgHeight,
              sz.imgRadius,
              `transition-[border-radius] duration-[400ms] ${ease}`,
            ].join(' ')}
          />
        </div>
      )}

      {/* Content */}
      <div className={`flex flex-col items-start flex-1 ${sz.contentGap}`}>
        {emoji && <span className="text-2xl leading-none">{emoji}</span>}

        {titleTexts.length > 0 && (
          <div className={`flex flex-col w-full ${sz.innerGap}`}>
            <p className={`leading-tight w-full ${sz.titleCls} ${sty.titleClr}`}>
              <RichText texts={titleTexts} />
            </p>
            {sz.showDesc && descParagraphs.length > 0 && (
              <div className={`t-body1 font-medium leading-relaxed w-full flex flex-col gap-3 ${sty.descClr}`}>
                {descParagraphs.map((b, i) => (
                  <p key={i}><RichText texts={b.paragraph.rich_text} /></p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {sz.showBtn && (
          <span className={[
            'mt-auto inline-flex items-center justify-center',
            'px-5 py-2.5 rounded-full t-btn1 font-semibold border-2',
            'transition-colors duration-200',
            sty.btn,
          ].join(' ')}>
            Know more
          </span>
        )}
      </div>
    </Wrapper>
  );
}
