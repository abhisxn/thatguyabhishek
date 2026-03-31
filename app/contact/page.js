'use client';

import { motion } from 'framer-motion';
import GradientBackground from '../components/layout/GradientBackground';
import Button from '../components/ui/Button';
import { ArrowIcon } from '../components/ui/icons';
import { fadeUp, stagger, vp } from '../../lib/motion';
import W from '../components/ui/W';

const CONTACTS = [
  {
    emoji: '📧',
    label: 'Email',
    value: 'abhisxn@gmail.com',
    href: 'mailto:abhisxn@gmail.com',
    desc: 'Best for project enquiries and job opportunities.',
    cta: 'Send email',
  },
  {
    emoji: '💼',
    label: 'LinkedIn',
    value: '/in/thatguyabhishek',
    href: 'https://www.linkedin.com/in/thatguyabhishek/',
    desc: 'Connect professionally, view my full career history.',
    cta: 'View profile',
    external: true,
  },
  {
    emoji: '💬',
    label: 'WhatsApp',
    value: '+91 99990 05281',
    href: 'https://wa.me/919999005281',
    desc: 'Quick chats and scheduling a call — feel free to reach out.',
    cta: 'Message me',
    external: true,
  },
  {
    emoji: '📞',
    label: 'Phone',
    value: '+91 99990 05281',
    href: 'tel:+919999005281',
    desc: 'Direct line for urgent conversations.',
    cta: 'Call me',
  },
  {
    emoji: '⚡',
    label: 'Dribbble',
    value: 'dribbble.com/abhisheksaxena',
    href: 'https://dribbble.com/abhisheksaxena',
    desc: 'Visual snippets of work and design explorations.',
    cta: 'Follow',
    external: true,
  },
  {
    emoji: '🔸',
    label: 'Behance',
    value: 'behance.net/AbhishekSaxena',
    href: 'https://www.behance.net/AbhishekSaxena',
    desc: 'In-depth case studies and full project presentations.',
    cta: 'View work',
    external: true,
  },
];

const FAQS = [
  {
    q: 'Are you open to full-time roles?',
    a: 'Yes — I\'m actively looking for design leadership positions (Head of Design, Staff/Principal Designer, Design Manager). Open to relocation or remote-first teams.',
  },
  {
    q: 'Do you take freelance or consulting projects?',
    a: 'Selectively. If the problem is interesting and the timeline is realistic, let\'s talk. I\'m particularly interested in AI products, health tech, and enterprise UX.',
  },
  {
    q: 'What\'s the best way to reach you?',
    a: 'Email for detailed enquiries, LinkedIn for professional networking, WhatsApp for a quick chat to get the conversation started.',
  },
  {
    q: 'What\'s your notice period / availability?',
    a: 'Please reach out to discuss — I\'d be happy to share current availability directly.',
  },
];

export default function ContactPage() {
  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen text-fg z-[1]">

        {/* ── HERO ── */}
        <section className="relative flex items-center">
          <W className="w-full pt-32 pb-20">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.p variants={fadeUp} className="t-overline mb-4 text-fg-muted">
                CONTACT
              </motion.p>
              <motion.h1 variants={fadeUp} className="mb-6 max-w-[900px]">
                Let&apos;s build something meaningful together.
              </motion.h1>
              <motion.p variants={fadeUp} className="t-body1 max-w-[620px] mb-10 text-fg-muted">
                Whether you&apos;re hiring for a design leadership role, need a senior designer on a critical product, or just want to talk shop — I&apos;m all ears.
              </motion.p>
              {/* Availability badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(72,57,202,0.2)', border: '1px solid rgba(72,57,202,0.5)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="t-body3 font-medium text-[#a5b4fc]">Open to new opportunities</span>
              </motion.div>
            </motion.div>
          </W>
        </section>

        {/* ── CONTACT CARDS ── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.h2 variants={fadeUp} className="mb-12">📬 Get in touch</motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CONTACTS.map((c) => (
                  <motion.a
                    key={c.label}
                    variants={fadeUp}
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="group rounded-3xl p-7 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 bg-surface border border-theme"
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <div>
                      <p className="t-label mb-1 text-fg-muted">{c.label.toUpperCase()}</p>
                      <p className="t-body2 font-semibold">{c.value}</p>
                    </div>
                    <p className="t-body3 flex-1 text-fg-muted">{c.desc}</p>
                    <span className="inline-flex items-center gap-2 t-body3 font-semibold text-[var(--brand)]">
                      {c.cta} <ArrowIcon size={12} />
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </W>
        </div>

        {/* ── FAQ ── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.h2 variants={fadeUp} className="mb-12">🤔 Common questions</motion.h2>
              <div className="flex flex-col gap-0 max-w-[800px]">
                {FAQS.map((faq, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="py-7"
                    style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <p className="t-body1 font-bold mb-3">{faq.q}</p>
                    <p className="t-body2 text-fg-muted">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </W>
        </div>

      </main>


    </>
  );
}
