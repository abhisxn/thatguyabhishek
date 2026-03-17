'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  VW, VH, ML, MR, MT, IH, IW,
  X_TICKS, H_GRID,
  xOf, yOf, xPct, buildLinePath, buildAreaPath, nearestIdx,
  TIMELINE,
} from './careerData';

function WordLines({ text, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ...style }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'block', lineHeight: 1.2 }}>{word}</span>
      ))}
    </div>
  );
}

export default function CareerChart({ activeIdx, setActiveIdx }) {
  const [isDragging, setIsDragging] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const chartRef  = useRef(null);
  const inViewRef = useRef(null);
  const isInView  = useInView(inViewRef, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setLineDrawn(true), 1900);
    return () => clearTimeout(t);
  }, [isInView]);

  const activeYear = TIMELINE[activeIdx].year;
  const activeItem = TIMELINE[activeIdx];
  const activeLine = useMemo(() => buildLinePath(activeYear), [activeYear]);
  const activeArea = useMemo(() => buildAreaPath(activeYear), [activeYear]);

  const dotXPx = xOf(activeYear);
  const dotYPx = yOf(activeYear);
  const dotX   = xPct(activeYear);
  const labelToRight  = dotXPx < 180;
  const labelTransform = labelToRight ? 'translate(14px, -50%)' : 'translate(calc(-100% - 14px), -50%)';

  const pathTransition = isDragging ? { duration: 0.08, ease: 'linear' } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] };
  const dotTransition  = isDragging
    ? 'left 0.08s linear, top 0.08s linear'
    : 'left 0.7s cubic-bezier(0.22,1,0.36,1), top 0.7s cubic-bezier(0.22,1,0.36,1)';

  function idxFromClientX(clientX) {
    if (!chartRef.current) return activeIdx;
    const rect = chartRef.current.getBoundingClientRect();
    const localX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const svgX = (localX / rect.width) * VW;
    const t = Math.max(0, Math.min(1, (svgX - ML) / IW));
    return nearestIdx(2011 + t * (2026 - 2011));
  }

  function onDotPointerDown(e) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setActiveIdx(idxFromClientX(e.clientX));
  }
  function onDotPointerMove(e) { if (isDragging) setActiveIdx(idxFromClientX(e.clientX)); }
  function onDotPointerUp() { setIsDragging(false); }

  return (
    <div ref={inViewRef} style={{ background: '#163846', borderRadius: 24, padding: '20px 16px 0', cursor: isDragging ? 'grabbing' : 'default' }}>
      <div ref={chartRef} style={{ position: 'relative' }}>
        <p className="t-label" style={{ color: 'rgba(255,255,255,0.45)', paddingLeft: 12, position: 'absolute', top: 12, left: 0, zIndex: 10, margin: 0 }}>
          Career Timeline
        </p>

        <svg width="100%" height={VH} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="ct-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea8575" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="ct-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={activeArea} fill="url(#ct-area)" stroke="none" initial={{ opacity: 0 }} animate={{ d: activeArea, opacity: lineDrawn ? 1 : 0 }} transition={{ d: pathTransition, opacity: { duration: 0.5 } }} />
          {H_GRID.map(v => {
            const y = (MT + IH - (v / 100) * IH).toFixed(2);
            return <line key={v} x1={ML} y1={y} x2={VW - MR} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          <line x1={ML} y1={MT + IH} x2={VW - MR} y2={MT + IH} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <motion.path d={activeLine} fill="none" stroke="url(#ct-line)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ d: activeLine, pathLength: isInView ? 1 : 0 }} transition={{ d: pathTransition, pathLength: { duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] } }} />
          {X_TICKS.map(yr => {
            const x = xOf(yr).toFixed(2);
            const baseY = MT + IH;
            return (
              <g key={yr}>
                <line x1={x} y1={baseY + 4} x2={x} y2={baseY + 10} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
                <text x={x} y={baseY + 26} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11" fontWeight="500" style={{ fontFamily: 'var(--font-glory-var, sans-serif)' }}>
                  &apos;{String(yr).slice(2)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Draggable dot */}
        <motion.div onPointerDown={onDotPointerDown} onPointerMove={onDotPointerMove} onPointerUp={onDotPointerUp} onPointerCancel={onDotPointerUp} initial={{ opacity: 0 }} animate={{ opacity: lineDrawn ? 1 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', left: dotX, top: dotYPx, transform: 'translate(-50%, -50%)', zIndex: 6, transition: dotTransition, cursor: isDragging ? 'grabbing' : 'ew-resize', touchAction: 'none' }}>
          <div style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <motion.div animate={isDragging ? { scale: 3.2, opacity: 0.35 } : { scale: [1, 2.6, 1], opacity: [0.45, 0, 0.45] }} transition={isDragging ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 18, height: 18, borderRadius: '50%', background: '#8b5cf6' }} />
            </div>
            <motion.div animate={{ scale: isDragging ? 1.25 : 1 }} transition={{ duration: 0.15 }} style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', border: '3px solid #8b5cf6', boxShadow: isDragging ? '0 0 0 4px rgba(139,92,246,0.35)' : 'none', position: 'relative', zIndex: 1, flexShrink: 0 }} />
          </div>
        </motion.div>

        {/* Role label */}
        <div style={{ position: 'absolute', left: dotX, top: dotYPx, transform: labelTransform, zIndex: 5, pointerEvents: 'none', transition: dotTransition }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: lineDrawn ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div style={{ background: 'rgba(10,20,40,0.88)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 8, padding: '7px 11px', whiteSpace: 'nowrap' }}>
                  <WordLines text={activeItem.role} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.02em' }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
