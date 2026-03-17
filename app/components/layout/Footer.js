'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Figma assets ───────────────────────────────────────────── */
const IMG_AVATAR   = 'https://www.figma.com/api/mcp/asset/3a1d14f2-2a44-4a96-8ea7-f86a2da53412';
const IMG_LI_ICON  = 'https://www.figma.com/api/mcp/asset/f1dc1cbd-7eb9-4d7d-b7ae-1cd089bb4aab';
const IMG_LI_LOGO  = 'https://www.figma.com/api/mcp/asset/ab47688f-282a-4d19-8599-f89a1abe0e04';

/* ── Animation ─────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const vp = { once: true, margin: '-60px' };

/* ── Ticker text ────────────────────────────────────────────── */
const TICKER_CHUNK =
  'YOU ARE CURRENTLY BROWSING PORTFOLIO WEBSITE OF PRODUCT DESIGNER THAT GUY ABHISHEK \u2756 THE CONCEPT, CONTENT AND MEDIA OF THIS WEBSITE IS COPYRIGHTED \u2756 MADE WITH LOVE \u2665 \u00A9 2026 THATGUYABHISHEK.COM \u2756 ';

/* ── Wrapper ─────────────────────────────────────────────────  */
function W({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/* ── Ticker strip ────────────────────────────────────────────── */
function Ticker() {
  const text = TICKER_CHUNK.repeat(4);
  return (
    <div className="border-t border-theme overflow-hidden whitespace-nowrap py-2.5">
      <div className="inline-flex" style={{ animation: 'footerTicker 38s linear infinite' }}>
        {[0, 1].map((i) => (
          <span
            key={i}
            className="t-small font-medium text-fg-muted"
            style={{ letterSpacing: '0.04em', opacity: 0.45, paddingRight: '2rem' }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="border-t border-theme text-fg relative z-[1]">
      <W className="py-14 sm:py-20 lg:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="flex flex-col gap-12 sm:gap-16"
        >

          {/* ── 1. CTA headline ── */}
          <motion.div variants={fadeUp}>
            <p className="t-h2 mb-4">
              Are you looking for a product designer who can fix UX, bring diverse industry
              experience, embrace end-to-end thinking, establish design systems, bridge user empathy
              with metrics, enable product scaling, infuse innovation and collaboration, and make a
              lasting impact?
            </p>
            <h2 style={{ color: '#ea8575' }}>
              Look no further. Get in touch.
            </h2>
          </motion.div>

          {/* ── 2. CTA cards ── */}
          <motion.div variants={stagger} className="flex flex-col sm:flex-row gap-5 sm:gap-8">

            {/* ── Purple card ── */}
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden flex-[3] rounded-2xl"
              style={{ background: '#4a2d7f', minHeight: 280 }}
            >
              {/* Gradient blob — lower-left, mix-blend-hard-light */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: -60, top: '60%',
                  width: '80%', height: '130%',
                  background: 'radial-gradient(ellipse at 30% 60%, rgba(139,92,246,0.55) 0%, rgba(72,57,202,0.25) 45%, transparent 70%)',
                  mixBlendMode: 'hard-light',
                  pointerEvents: 'none',
                }}
              />
              {/* Pink blob — upper-right */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: -40, top: -50,
                  width: '65%', height: '90%',
                  background: 'radial-gradient(ellipse at 65% 25%, rgba(255,100,160,0.55) 0%, rgba(236,72,153,0.2) 40%, transparent 68%)',
                  filter: 'blur(28px)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              />

              {/* Avatar — bottom-right */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_AVATAR}
                alt=""
                aria-hidden="true"
                loading="lazy"
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 'clamp(130px, 20vw, 222px)',
                  height: 'clamp(130px, 20vw, 222px)',
                  objectFit: 'contain', pointerEvents: 'none',
                }}
              />
              {/* Content — padding-based so it never overlaps on narrow screens */}
              <div style={{ padding: '32px 32px 24px', paddingRight: 'clamp(32px, 22vw, 240px)' }}>
                <p className="font-extrabold leading-tight mb-1.5" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: 'rgba(255,255,255,0.65)' }}>
                  Have an exciting project?
                </p>
                <p className="font-extrabold leading-tight mb-7" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: '#ffffff' }}>
                  Let&apos;s work together.
                </p>
                <a href="mailto:abhisxn@gmail.com" className="btn-card-dark">
                  Connect with me
                </a>
              </div>
            </motion.div>

            {/* ── LinkedIn card ── */}
            <motion.div
              variants={fadeUp}
              className="bg-white flex-[2] rounded-[10px] flex flex-col gap-4 p-6"
              style={{ boxShadow: '0 0 2.3px rgba(0,0,0,0.15)' }}
            >
              {/* Top row: icon + logo */}
              <div className="flex items-start justify-between">
                <div className="rounded-full p-3 flex items-center justify-center shrink-0" style={{ background: '#4a2d7f' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_LI_ICON} alt="" aria-hidden="true" loading="lazy" className="w-[67px] h-[67px] object-contain" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_LI_LOGO} alt="LinkedIn" loading="lazy" style={{ height: 23, width: 95, objectFit: 'contain' }} />
              </div>
              {/* Name + bio + button */}
              <div className="flex flex-col gap-3 flex-1">
                <p className="font-extrabold text-black" style={{ fontSize: 'clamp(18px, 2vw, 23px)' }}>Abhishek Saxena</p>
                <p className="t-body2 font-medium leading-relaxed text-black">
                  Design Guy, 12+ yrs of Product, UX &amp; Advertising, 35+ Awards, 2 GTM Startups. Senior Designer @ Microsoft
                </p>
                <div className="mt-auto">
                  <a
                    href="https://www.linkedin.com/in/thatguyabhishek/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-card-light"
                  >
                    Know more
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── 3. Links grid — Socials + Links + Contact ── */}
          <motion.div
            variants={stagger}
            className="flex flex-col sm:flex-row gap-8 sm:gap-6 text-center border-t border-theme pt-[clamp(2rem,4vw,4rem)]"
          >
            {/* Socials */}
            <motion.div variants={fadeUp} className="flex flex-col gap-5 items-center sm:flex-1 footer-link-col">
              <p className="t-body1 font-semibold text-fg">Socials</p>
              <a href="https://www.linkedin.com/in/thatguyabhishek/" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">👤 Linkedin</a>
              <a href="https://dribbble.com/abhisheksaxena" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">⚡ Dribbble</a>
              <a href="https://www.behance.net/AbhishekSaxena" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">🔸 Behance</a>
            </motion.div>

            {/* Links */}
            <motion.div variants={fadeUp} className="flex flex-col gap-5 items-center sm:flex-1 footer-link-col">
              <p className="t-body1 font-semibold text-fg">Links</p>
              <Link href="/about" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">☝ About</Link>
              <Link href="/work" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">🎨 Work</Link>
              <Link href="/awards" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">🏆 Awards</Link>
              <Link href="/contact" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">✉ Contact</Link>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeUp} className="flex flex-col gap-5 items-center sm:flex-1 footer-link-col">
              <p className="t-body1 font-semibold text-fg">Contact</p>
              <a href="tel:+919999005281" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">📞 Call for a Chat</a>
              <a href="mailto:abhisxn@gmail.com" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">📧 Send an email</a>
              <a href="https://wa.me/919999005281" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">💬 Whatsapp me</a>
            </motion.div>
          </motion.div>

        </motion.div>
      </W>

      {/* ── 4. Ticker ── */}
      <Ticker />
    </footer>
  );
}
