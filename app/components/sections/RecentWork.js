'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';

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

const PROJECTS = [
  {
    id: 'wiki-agent',
    title: 'Microsoft: Copilot Excel Wiki Agent',
    desc: 'An AI-powered assistant designed for Excel designers to streamline workflows, centralise knowledge, and provide actionable answers on design craft, process, accessibility, and handoffs.',
    img: 'https://www.figma.com/api/mcp/asset/116ea7b5-6989-4f89-a03f-c39ba6eba920',
    href: 'https://thatguyabhishek.notion.site/Microsoft-Copilot-Excel-Wiki-Agent-25a848f13d3480b99b39cb86d9d4c2e5',
  },
  {
    id: 'planty',
    title: 'Planty™ — The Brand, Product and Strategy',
    desc: 'From inception to execution — an online boutique green gifting brand making plant adoption fun. Modern and compact garden solutions for first time plant parents.',
    img: 'https://www.figma.com/api/mcp/asset/7307b486-62db-4db6-aadc-d14a24c51ac9',
    href: 'https://thatguyabhishek.notion.site/ThinkPlanty-com-Idea-Product-Strategy-89c5d9fbc65c48b6ac6f9ae4f9979f76',
  },
  {
    id: 'chart-insights',
    title: 'Microsoft: AI powered insights on chart insert',
    desc: 'Chart Insights via Copilot automatically generates intelligent, contextual insights the moment a chart is inserted — trends, anomalies, and comparisons in a lightweight panel.',
    img: 'https://www.figma.com/api/mcp/asset/64956314-754e-47ee-8308-1dedcd00759e',
    href: 'https://thatguyabhishek.notion.site/Excel-Charting-AI-Powered-Chart-Insights-2c6848f13d3480668d7ee8b2e7112910',
  },
  {
    id: 'watchlyst',
    title: "Watchlyst App — Aggregating what's worth watching",
    desc: 'The first startup: solving the paradox of choice in entertainment. An aggregator and recommendation engine for TV, OTT, events, and radio. 50K downloads, zero paid marketing.',
    img: 'https://www.figma.com/api/mcp/asset/dc8c5058-a5c0-4c2a-9489-a8763f67931e',
    href: 'https://thatguyabhishek.notion.site/Watchlyst-App-Idea-Product-Strategy-c7e9f615209e40f6a75c3296fe25b471',
  },
  {
    id: 'airtel',
    title: 'Airtel Thanks 2.0: Redesigning Airtel Thanks Program',
    desc: "India's second-largest telecom app, redesigned. Launched Airtel Thanks 2.0 to 100M+ users with zero critical incidents. Increased MAU engagement by 6%.",
    img: 'https://www.figma.com/api/mcp/asset/0522e636-82c6-4b43-8d67-dc1e3185f147',
    href: 'https://thatguyabhishek.notion.site/Airtel-Thanks-2-0-Redesigning-Airtel-Thanks-Program-ccd66a9923484b8cbc560b8943b272ed',
  },
];

export default function RecentWork() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <motion.h2 variants={fadeUp} className="mb-12">
            👨🏻‍💻️ Recent Work
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="grid grid-cols-1 sm:grid-cols-2 gap-10"
        >
          {PROJECTS.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <Card size="big" title={p.title} desc={p.desc} img={p.img} href={p.href} />
            </motion.div>
          ))}

          <motion.div variants={fadeUp} className="h-full">
            <a
              href="/work"
              className="more-work-card group flex flex-col items-center justify-center rounded-3xl h-full min-h-[420px] overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="more-work-bg" aria-hidden="true" />
              <span
                className="more-work-text font-bold leading-none mb-8 select-none relative z-10 block text-center"
                style={{ fontSize: 'clamp(56px, 8vw, 88px)' }}
              >
                More<br />Work
              </span>
              <div
                className="more-work-arrow relative z-10 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-2"
                style={{ width: 64, height: 64 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </W>
    </div>
  );
}
