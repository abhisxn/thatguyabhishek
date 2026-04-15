'use client';

import { m } from 'framer-motion';
import Button from '../ui/Button';
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '../ui/W';
import { ArrowIcon } from '@/app/components/ui/icons';

const IMG_ABOUT = '/about-photo.jpg';

export default function AboutSection() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <m.div variants={fadeUp} className="flex items-center justify-between mb-10">
            <h2>🙋🏻‍♂️ About me</h2>
            <Button href="/about" variant="link" size="sm" icon={<ArrowIcon size={11} />}>
              KNOW MORE
            </Button>
          </m.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <m.div variants={fadeUp}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_ABOUT}
                alt="About Abhishek Saxena"
                loading="lazy"
                className="w-full rounded-3xl object-cover h-[500px]"
              />
            </m.div>
            <m.div variants={stagger} className="flex flex-col gap-6">
              <m.div variants={fadeUp} className="flex flex-col gap-6">
                <p className="t-body1 text-fg-muted">I started in the era before UX had rules — when digital was still figuring itself out, flash websites were a career, and the only metric that mattered was whether people came back.</p>
                <p className="t-body1 text-fg-muted">That wired me differently. I think in systems. I measure in outcomes. I&apos;ve led design at a telecom giant, shipped AI features for 400M+ Excel users, and built two products from zero — one of which hit 50K downloads with no marketing budget.</p>
                <p className="t-body1 text-fg-muted">I&apos;m a design generalist. That&apos;s not a hedge — it&apos;s a deliberate choice. The best design decisions I&apos;ve made came from knowing just enough about business strategy, product thinking, data, and engineering to ask the right questions before picking up Figma.</p>
              </m.div>
            </m.div>
          </div>
        </m.div>
      </W>
    </div>
  );
}
