'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { fadeUp, stagger } from '@/lib/motion';
import HomeSectionShell from './HomeSectionShell';

export default function HelpSection() {
  return (
    <HomeSectionShell heading="🧑🏼‍🚀 How can I help?" ctaHref="/about">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <m.div variants={fadeUp}>
          <Image
            src="/help-photo.jpg"
            alt="How can I help"
            width={800}
            height={500}
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
    </HomeSectionShell>
  );
}
