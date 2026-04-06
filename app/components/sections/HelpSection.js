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
          <m.h2 variants={fadeUp} className="mb-10">
            🧑🏼‍🚀 How can I help?
          </m.h2>
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
              <m.div variants={fadeUp} className="t-lead text-fg flex flex-col gap-6">
                <p>I work best when the problem is hard, the stakes are real, and someone needs to bridge the gap between what users need and what the business is trying to build.</p>
                <p>Whether that&apos;s defining a design system from scratch, leading a team through a zero-to-one product, redesigning a broken experience for 100M users, or embedding AI into a workflow that people actually use — I&apos;ve done it. More than once. At different scales.</p>
                <p>If you need hands-on craft, I can do that. If you need someone to run a design function, set strategy, hire, and report to leadership — I can do that too. That range is the point.</p>
              </m.div>
              <m.div variants={fadeUp}>
                <Button href="https://thatguyabhishek.notion.site/Contact-7846bf0322c34e66b00c1b5ca961f401" external variant="outline">
                  Know more
                </Button>
              </m.div>
            </m.div>
          </div>
        </m.div>
      </W>
    </div>
  );
}
