'use client';

import { motion } from 'framer-motion';
import GradientBackground from './components/layout/GradientBackground';
import Button from './components/ui/Button';
import CareerTimeline from './components/sections/CareerTimeline';
import HomeHero from './components/sections/HomeHero';
import RecentWork from './components/sections/RecentWork';
import AboutSection from './components/sections/AboutSection';
import HelpSection from './components/sections/HelpSection';

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

export default function Home() {
  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen text-fg z-[1]">

        <HomeHero />
        <RecentWork />
        <AboutSection />

        {/* Journey So Far */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.div variants={fadeUp} className="flex items-center justify-between mb-10">
                <h2>🎢 Journey So Far</h2>
                <Button href="https://thatguyabhishek.notion.site/About-fb861d61100943ee9356e50d28be3f03" external variant="outline">
                  Know more
                </Button>
              </motion.div>
              <motion.div variants={fadeUp}>
                <CareerTimeline />
              </motion.div>
            </motion.div>
          </W>
        </div>

        <HelpSection />

      </main>
    </>
  );
}
