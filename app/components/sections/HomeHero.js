'use client';

import { m } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import W from '../ui/W';

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <W className="w-full pt-28 pb-24">
        <m.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="t-display mb-8 w-full"
        >
          Hey there, I&apos;m Abhishek Saxena, a product designer enabling growth led design for 12+ years
        </m.h1>

        {/* Mobile avatar — visible below headline, hidden at lg+ */}
        <m.div
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex lg:hidden justify-center mb-10"
        >
          <m.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="hero-avatar-float-sm"
          >
            <div className="hero-avatar-glow-sm" />
            <div className="avatar-circle-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/avatar.gif" alt="Abhishek Saxena" className="hero-avatar-img-sm" />
            </div>
          </m.div>
        </m.div>

        <div className="grid lg:grid-cols-[1fr_480px] gap-10 items-center">
          <m.div variants={stagger} initial="hidden" animate="visible">
            <m.div variants={fadeUp} className="t-body1 text-fg-muted mb-12">
              Based in India, open to the world. I&apos;m a product designer and design leader with 12+ years
              shipping AI features, consumer apps, and enterprise systems — from Microsoft Excel to Airtel&apos;s
              100M users. I don&apos;t just design interfaces. I build design practices, lead teams, and move
              metrics that matter.
              <br />
              <span className="font-semibold text-fg">Open to design leadership roles.</span>
            </m.div>

            <m.div variants={fadeUp} className="flex flex-col gap-2 mb-12 text-fg-muted">
              <p className="t-body2 uppercase tracking-widest">Quick Snapshot:</p>
              <p className="t-body2">Senior Product Designer @ Microsoft</p>
              <p className="t-body2">Ex Principal Experience Designer @ Airtel</p>
              <p className="t-body2">Ex Design Director UX @ Cheil, Samsung</p>
              <p className="t-body2 flex items-center gap-2">
                <span>💁🏻‍♂️ Latest Update</span>
                <a
                  href="https://www.linkedin.com/in/thatguyabhishek/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline text-[var(--color-coral)]"
                >
                  Click here
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </p>
            </m.div>
          </m.div>

          {/* Avatar */}
          <m.div
            initial={{ opacity: 0, scale: 0.88, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center z-[2]"
          >
            <div className="scale-[1.1] -translate-y-[20px]">
            <m.div
              animate={{ y: [0, -40, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="hero-avatar-float"
            >
              <div className="hero-avatar-glow" />

              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="hero-avatar-ticker-ring"
              >
                <svg width="420" height="420" viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg" overflow="visible">
                  <defs>
                    <path id="hero-ticker-path" d="M 210,7 A 203,203 0 1,1 209.999,7" />
                  </defs>
                  <text className="avatar-ticker-text">
                    <textPath href="#hero-ticker-path" startOffset="0%">
                      AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦ AVAILABLE FOR WORK ✦
                    </textPath>
                  </text>
                </svg>
              </m.div>

              <div className="avatar-circle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/avatar.gif" alt="Abhishek Saxena" className="hero-avatar-img" />
              </div>
            </m.div>
            </div>
          </m.div>
        </div>
      </W>
    </section>
  );
}
