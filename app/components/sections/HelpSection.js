'use client';

import { m } from 'framer-motion';
import Button from '../ui/Button';
import { fadeUp, stagger, vp } from '../../../lib/motion';
import W from '../ui/W';

const IMG_HELP = '/help-photo.jpg';

export default function HelpSection() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <m.div variants={fadeUp} className="flex items-center justify-between mb-10">
            <h2>🧑🏼‍🚀 How can I help?</h2>
            <Button href="/about" variant="link" size="sm" icon={<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
              KNOW MORE
            </Button>
          </m.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <m.div variants={fadeUp}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_HELP}
                alt="How can I help"
                loading="lazy"
                className="w-full rounded-3xl object-cover h-[500px]"
              />
            </m.div>
            <m.div variants={stagger} className="flex flex-col gap-6">
              <m.div variants={fadeUp} className="flex flex-col gap-6">
                <p className="t-body1 text-fg-muted">I work best when the problem is hard, the stakes are real, and someone needs to bridge the gap between what users need and what the business is trying to build.</p>
                <p className="t-body1 text-fg-muted">Whether that&apos;s defining a design system from scratch, leading a team through a zero-to-one product, redesigning a broken experience for 100M users, or embedding AI into a workflow that people actually use — I&apos;ve done it. More than once. At different scales.</p>
                <p className="t-body1 text-fg-muted">If you need hands-on craft, I can do that. If you need someone to run a design function, set strategy, hire, and report to leadership — I can do that too. That range is the point.</p>
              </m.div>
            </m.div>
          </div>
        </m.div>
      </W>
    </div>
  );
}
