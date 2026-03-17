'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';

const IMG_ABOUT = 'https://www.figma.com/api/mcp/asset/d989315b-c955-47c0-a71c-e226f71a8412';

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

export default function AboutSection() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <motion.h2 variants={fadeUp} className="mb-10">
            🙋🏻‍♂️ About me
          </motion.h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeUp}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_ABOUT}
                alt="About Abhishek Saxena"
                loading="lazy"
                className="w-full rounded-3xl object-cover h-[500px]"
              />
            </motion.div>
            <motion.div variants={stagger} className="flex flex-col gap-6">
              <motion.div variants={fadeUp} className="t-lead text-fg flex flex-col gap-6">
                <p>I started in the era before UX had rules — when digital was still figuring itself out, flash websites were a career, and the only metric that mattered was whether people came back.</p>
                <p>That wired me differently. I think in systems. I measure in outcomes. I&apos;ve led design at a telecom giant, shipped AI features for 400M+ Excel users, and built two products from zero — one of which hit 50K downloads with no marketing budget.</p>
                <p>I&apos;m a design generalist. That&apos;s not a hedge — it&apos;s a deliberate choice. The best design decisions I&apos;ve made came from knowing just enough about business strategy, product thinking, data, and engineering to ask the right questions before picking up Figma.</p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button href="https://thatguyabhishek.notion.site/About-fb861d61100943ee9356e50d28be3f03" external variant="outline">
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
