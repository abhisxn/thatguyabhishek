'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { fadeUp } from '@/lib/motion';
import HomeSectionShell from './HomeSectionShell';

export default function AboutSection() {
  return (
    <HomeSectionShell heading="🙋🏻‍♂️ About me" ctaHref="/about">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <m.div variants={fadeUp}>
          <Image
            src="/about-photo.jpg"
            alt="About Abhishek Saxena"
            width={800}
            height={500}
            className="w-full rounded-3xl object-cover h-[500px]"
          />
        </m.div>
        <div className="flex flex-col gap-6">
          <m.div variants={fadeUp} className="flex flex-col gap-6">
            <p className="t-body1 text-fg-muted">I started in the era before UX had rules — when digital was still figuring itself out, flash websites were a career, and the only metric that mattered was whether people came back.</p>
            <p className="t-body1 text-fg-muted">That wired me differently. I think in systems. I measure in outcomes. I&apos;ve led design at a telecom giant, shipped AI features for 400M+ Excel users, and built two products from zero — one of which hit 50K downloads with no marketing budget.</p>
            <p className="t-body1 text-fg-muted">I&apos;m a design generalist. That&apos;s not a hedge — it&apos;s a deliberate choice. The best design decisions I&apos;ve made came from knowing just enough about business strategy, product thinking, data, and engineering to ask the right questions before picking up Figma.</p>
          </m.div>
        </div>
      </div>
    </HomeSectionShell>
  );
}
