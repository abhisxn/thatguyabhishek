'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { m, AnimatePresence, useInView } from 'framer-motion';
import {
  VW, VH, ML, MT, IH, IW,
  X_TICKS, H_GRID,
  xOf, yOf, xPct, buildLinePath, buildAreaPath, nearestIdx,
  TIMELINE,
} from '../../../data/careerData';

function WordLines({ text }) {
  return (
    <div className="ct-word-lines">
      {text.split(' ').map((word, i) => <span key={i}>{word}</span>)}
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
  const dotYPct = ((dotYPx / VH) * 100).toFixed(3) + '%';
  const labelToRight   = dotXPx < 180;
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
    <div ref={inViewRef} className="ct-chart-card" style={{ cursor: isDragging ? 'grabbing' : 'default' }}>
      <div ref={chartRef} className="ct-chart-inner">
        <p className="t-label ct-chart-label">Career Timeline</p>

        <svg width="100%" height="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" className="ct-svg">
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
          <m.path d={activeArea} fill="url(#ct-area)" stroke="none" initial={{ opacity: 0 }} animate={{ d: activeArea, opacity: lineDrawn ? 1 : 0 }} transition={{ d: pathTransition, opacity: { duration: 0.5 } }} />
          {H_GRID.map(v => {
            const y = (MT + IH - (v / 100) * IH).toFixed(2);
            return <line key={v} x1={0} y1={y} x2={VW} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          <line x1={0} y1={MT + IH} x2={VW} y2={MT + IH} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <m.path d={activeLine} fill="none" stroke="url(#ct-line)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ d: activeLine, pathLength: isInView ? 1 : 0 }} transition={{ d: pathTransition, pathLength: { duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] } }} />
          {X_TICKS.map(yr => {
            const x = xOf(yr).toFixed(2);
            const baseY = MT + IH;
            return <line key={yr} x1={x} y1={baseY + 4} x2={x} y2={baseY + 10} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />;
          })}
        </svg>

        {/* Year labels — HTML divs to avoid SVG non-uniform scaling distortion */}
        {X_TICKS.map(yr => (
          <div key={yr} className="ct-year-label-pos" style={{ left: xPct(yr), top: `${((MT + IH + 22) / VH * 100).toFixed(3)}%` }}>
            <span className="ct-year-label">&apos;{String(yr).slice(2)}</span>
          </div>
        ))}

        {/* Draggable dot */}
        <m.div
          onPointerDown={onDotPointerDown}
          onPointerMove={onDotPointerMove}
          onPointerUp={onDotPointerUp}
          onPointerCancel={onDotPointerUp}
          initial={{ opacity: 0 }}
          animate={{ opacity: lineDrawn ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', left: dotX, top: dotYPct, transform: 'translate(-50%, -50%)', zIndex: 6, transition: dotTransition, cursor: isDragging ? 'grabbing' : 'ew-resize', touchAction: 'none' }}
        >
          <div className="ct-dot-hit">
            <div className="ct-dot-ring-wrap">
              <m.div
                className="ct-dot-ring"
                animate={isDragging ? { scale: 3.2, opacity: 0.35 } : { scale: [1, 2.6, 1], opacity: [0.45, 0, 0.45] }}
                transition={isDragging ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <m.div
              className="ct-dot-core"
              animate={{ scale: isDragging ? 1.25 : 1 }}
              transition={{ duration: 0.15 }}
              style={{ boxShadow: isDragging ? '0 0 0 4px rgba(139,92,246,0.35)' : 'none' }}
            />
          </div>
        </m.div>

        {/* Role label */}
        <div style={{ position: 'absolute', left: dotX, top: dotYPct, transform: labelTransform, zIndex: 5, pointerEvents: 'none', transition: dotTransition }}>
          <m.div initial={{ opacity: 0 }} animate={{ opacity: lineDrawn ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <AnimatePresence mode="wait">
              <m.div key={activeIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="ct-role-popup">
                  <WordLines text={activeItem.role} />
                </div>
              </m.div>
            </AnimatePresence>
          </m.div>
        </div>
      </div>
    </div>
  );
}
