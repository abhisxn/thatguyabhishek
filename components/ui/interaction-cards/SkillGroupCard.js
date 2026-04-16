'use client';

import { m, useSpring } from 'framer-motion';

export function SkillGroupCard({ icon, label, skills }) {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <div
      style={{ position: 'relative', borderRadius: 16 }}
      onMouseEnter={() => strokeOpacity.set(0.7)}
      onMouseLeave={() => strokeOpacity.set(0.2)}
    >
      {/* Adaptive outline ring */}
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
          pointerEvents: 'none',
          opacity: strokeOpacity,
        }}
      />

      <div
        className="flex flex-col gap-4 rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{icon}</span>
          <p className="t-body2 font-semibold text-fg" style={{ margin: 0 }}>
            {label}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="ui-tag"
              style={{
                background: 'color-mix(in srgb, var(--fg) 7%, transparent)',
                color: 'var(--fg-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
