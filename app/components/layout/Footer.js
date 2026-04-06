'use client';

import { useRef, useCallback } from 'react';
import { m, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

/* ── Local assets ───────────────────────────────────────────── */
const IMG_AVATAR     = '/avatar-card.png';
const IMG_AVATAR_ICON = '/avatar-icon.png';
const IMG_LI_LOGO    = '/linkedin-logo.svg';

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

import W from '../ui/W';
import Button from '../ui/Button';

/* ── Magnetic tilt hook ─────────────────────────────────────── */
function useTilt(maxDeg = 6) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxDeg, -maxDeg]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxDeg, maxDeg]), { stiffness: 300, damping: 30 });

  const onMouseMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}

/* ── Ticker strip ────────────────────────────────────────────── */
function Ticker() {
  const text = TICKER_CHUNK.repeat(4);
  return (
    <div className="border-t border-theme overflow-hidden whitespace-nowrap py-3">
      <div className="inline-flex footer-ticker-inner">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="t-small font-medium text-fg-muted footer-ticker-text"
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
  const purpleTilt = useTilt(5);
  const liTilt = useTilt(5);

  return (
    <footer className="border-t border-theme text-fg relative z-[1]">
      <W className="py-14 sm:py-20 lg:py-24">
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="flex flex-col gap-12 sm:gap-16"
        >

          {/* ── 1. CTA headline ── */}
          <m.div variants={fadeUp}>
            <p className="t-h3">
              Good design isn&apos;t decoration. It&apos;s the decision that changes the outcome. I bring craft,
              systems thinking, and leadership to problems that actually matter — not as separate skills,
              but as one way of working. If that&apos;s who you&apos;re looking for,{' '}
              <span style={{ color: 'var(--color-coral)' }}>look no further, get in touch.</span>
            </p>
            <hr className="mt-8 border-theme" />
          </m.div>

          {/* ── 2. CTA cards ── */}
          <m.div variants={stagger} className="flex flex-col sm:flex-row gap-5 sm:gap-8">

            {/* ── Purple card ── */}
            <m.div
              variants={fadeUp}
              ref={purpleTilt.ref}
              onMouseMove={purpleTilt.onMouseMove}
              onMouseLeave={purpleTilt.onMouseLeave}
              style={{ perspective: 900, rotateX: purpleTilt.rotateX, rotateY: purpleTilt.rotateY, transformStyle: 'preserve-3d' }}
              className="relative overflow-hidden flex-[3] rounded-2xl footer-cta-purple"
            >
              {/* Gradient blob — lower-left, mix-blend-hard-light */}
              <div aria-hidden="true" className="footer-cta-blob-purple" />
              {/* Pink blob — upper-right */}
              <div aria-hidden="true" className="footer-cta-blob-pink" />

              {/* Avatar — bottom-right */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_AVATAR} alt="" aria-hidden="true" loading="lazy" className="footer-cta-avatar" />
              {/* Content — padding-based so it never overlaps on narrow screens */}
              <div className="footer-cta-content">
                <p className="footer-cta-heading footer-cta-heading--muted">
                  Have an exciting project?
                </p>
                <p className="footer-cta-heading footer-cta-heading--white">
                  Let&apos;s work together.
                </p>
                <Button href="mailto:abhisxn@gmail.com" variant="outline" size="lg">
                  Connect with me
                </Button>
              </div>
            </m.div>

            {/* ── LinkedIn card ── */}
            <m.div
              variants={fadeUp}
              ref={liTilt.ref}
              onMouseMove={liTilt.onMouseMove}
              onMouseLeave={liTilt.onMouseLeave}
              style={{ perspective: 900, rotateX: liTilt.rotateX, rotateY: liTilt.rotateY, transformStyle: 'preserve-3d' }}
              className="bg-white flex-[2] rounded-[8px] flex flex-col gap-4 p-6 footer-li-card"
            >
              {/* Top row: avatar icon + LinkedIn logo */}
              <div className="flex items-start justify-between">
                <div className="w-[88px] h-[88px] p-2 rounded-full overflow-hidden shrink-0 footer-li-icon-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_AVATAR_ICON} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_LI_LOGO} alt="LinkedIn" loading="lazy" className="footer-li-logo" />
              </div>
              {/* Name + bio + button */}
              <div className="flex flex-col gap-3 flex-1">
                <p className="footer-li-name">Abhishek Saxena</p>
                <p className="t-body2 font-medium leading-relaxed text-black">
                  Design Guy, 12+ yrs of Product, UX &amp; Advertising, 35+ Awards, 2 GTM Startups. Senior Designer @ Microsoft
                </p>
                <div className="mt-auto">
                  <Button
                    href="https://www.linkedin.com/in/thatguyabhishek/"
                    variant="outline-brand"
                    size="lg"
                    external
                  >
                    Know more
                  </Button>
                </div>
              </div>
            </m.div>
          </m.div>

          {/* ── 3. Links grid — Socials + Links + Contact ── */}
          <m.div
            variants={stagger}
            className="flex flex-col sm:flex-row gap-8 sm:gap-6 text-center border-t border-theme pt-[clamp(2rem,4vw,4rem)]"
          >
            {/* Socials */}
            <m.div variants={fadeUp} className="flex flex-col gap-5 items-center sm:flex-1 footer-link-col">
              <p className="t-body1 font-semibold text-fg">Socials</p>
              <a href="https://www.linkedin.com/in/thatguyabhishek/" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">👤 Linkedin</a>
              <a href="https://dribbble.com/abhisheksaxena" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">⚡ Dribbble</a>
              <a href="https://www.behance.net/AbhishekSaxena" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">🔸 Behance</a>
            </m.div>

            {/* Links */}
            <m.div variants={fadeUp} className="flex flex-col gap-5 items-center sm:flex-1 footer-link-col">
              <p className="t-body1 font-semibold text-fg">Links</p>
              <Link href="/about" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">☝ About</Link>
              <Link href="/work" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">🎨 Work</Link>
              <Link href="/awards" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">🏆 Awards</Link>
            </m.div>

            {/* Contact */}
            <m.div variants={fadeUp} className="flex flex-col gap-5 items-center sm:flex-1 footer-link-col">
              <p className="t-body1 font-semibold text-fg">Contact</p>
              <a href="tel:+919999005281" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">📞 Call for a Chat</a>
              <a href="mailto:abhisxn@gmail.com" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">📧 Send an email</a>
              <a href="https://wa.me/919999005281" target="_blank" rel="noopener noreferrer" className="t-body2 text-fg-muted inline-block font-medium relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full">💬 Whatsapp me</a>
            </m.div>
          </m.div>

        </m.div>
      </W>

      {/* ── 4. Ticker ── */}
      <Ticker />
    </footer>
  );
}
