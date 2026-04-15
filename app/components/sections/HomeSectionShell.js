'use client';

import { m } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowIcon } from '@/app/components/ui/icons';
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '../ui/W';

export default function HomeSectionShell({ heading, ctaHref, ctaLabel = 'KNOW MORE', children }) {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <m.div variants={fadeUp} className="flex items-center justify-between mb-10">
            <h2 className="t-h2 text-fg">{heading}</h2>
            {ctaHref && (
              <Button href={ctaHref} variant="link" size="sm" icon={<ArrowIcon size={11} />}>
                {ctaLabel}
              </Button>
            )}
          </m.div>
          {children}
        </m.div>
      </W>
    </div>
  );
}
