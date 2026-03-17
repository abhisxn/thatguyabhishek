'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';

const IMG_HELP = 'https://www.figma.com/api/mcp/asset/9135e33d-8392-4d59-bc28-3283a502d512';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const vp = { once: true, margin: '-80px' };

function W({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

export default function HelpSection() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <motion.h2 variants={fadeUp} className="mb-10">
            🧑🏼‍🚀 How can I help?
          </motion.h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeUp}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_HELP}
                alt="How can I help"
                loading="lazy"
                className="w-full rounded-3xl object-cover h-[500px]"
              />
            </motion.div>
            <motion.div variants={stagger} className="flex flex-col gap-6">
              <motion.div variants={fadeUp} className="t-lead text-fg flex flex-col gap-6">
                <p>I work best when the problem is hard, the stakes are real, and someone needs to bridge the gap between what users need and what the business is trying to build.</p>
                <p>Whether that&apos;s defining a design system from scratch, leading a team through a zero-to-one product, redesigning a broken experience for 100M users, or embedding AI into a workflow that people actually use — I&apos;ve done it. More than once. At different scales.</p>
                <p>If you need hands-on craft, I can do that. If you need someone to run a design function, set strategy, hire, and report to leadership — I can do that too. That range is the point.</p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button href="https://thatguyabhishek.notion.site/Contact-7846bf0322c34e66b00c1b5ca961f401" external variant="outline">
                  Know more
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </W>
    </div>
  );
}
