'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function W({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <W className="w-full pt-28 pb-24">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="t-h1 mb-10 w-full"
        >
          Hey there, I&apos;m Abhishek Saxena, a product designer enabling growth led design for 12+ years
        </motion.h1>

        <div className="grid lg:grid-cols-[1fr_480px] gap-10 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="t-lead text-fg-muted mb-12">
              Based in India, open to the world. I&apos;m a product designer and design leader with 12+ years
              shipping AI features, consumer apps, and enterprise systems — from Microsoft Excel to Airtel&apos;s
              100M users. I don&apos;t just design interfaces. I build design practices, lead teams, and move
              metrics that matter.{' '}
              <span className="font-semibold text-fg">Open to design leadership roles.</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-12 t-body1 text-fg">
              <p>Quick Snapshot:</p>
              <p>Senior Product Designer @ Microsoft</p>
              <p>Ex Principal Experience Designer @ Airtel</p>
              <p>Ex Design Director UX @ Cheil, Samsung</p>
              <p className="flex items-center gap-2">
                <span>💁🏻‍♂️ Latest Update</span>
                <a
                  href="https://www.linkedin.com/in/thatguyabhishek/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline text-[#ea8575]"
                >
                  Click here
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </p>
            </motion.div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center z-[2]"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', width: 293, height: 293 }}
            >
              <div style={{ position: 'absolute', inset: -26, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,215,232,0.45) 0%, rgba(72,57,202,0.2) 55%, transparent 80%)', filter: 'blur(18px)', pointerEvents: 'none' }} />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 420, height: 420, left: -63.5, top: -60, zIndex: 20, pointerEvents: 'none' }}
              >
                <svg width="420" height="420" viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg" overflow="visible">
                  <defs>
                    <path id="hero-ticker-path" d="M 210,7 A 203,203 0 1,1 209.999,7" />
                  </defs>
                  <text className="avatar-ticker-text" style={{ fill: 'rgba(255,255,255,0.52)', fontSize: '13px', fontWeight: 600, letterSpacing: '3px', fontFamily: 'var(--font-glory-var, Glory, sans-serif)' }}>
                    <textPath href="#hero-ticker-path" startOffset="0%">
                      AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              <div className="avatar-circle" style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 380, height: 380, borderRadius: '50%', background: 'linear-gradient(140deg, #e5d7e8 0%, #c8b0e0 45%, #a8c8f0 100%)', boxShadow: '0 8px 39px rgba(229,215,232,0.3), 0 0 65px rgba(72,57,202,0.2)', zIndex: 10, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.gif"
                  alt="Abhishek Saxena"
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 240, height: 240, objectFit: 'contain', zIndex: 11 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </W>
    </section>
  );
}
