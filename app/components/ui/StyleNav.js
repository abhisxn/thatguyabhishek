'use client';
import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'colours',          label: '01 Colours' },
  { id: 'typography',       label: '02 Typography' },
  { id: 'buttons',          label: '03 Buttons' },
  { id: 'badges',           label: '04 Badges' },
  { id: 'tags',             label: '05 Tags' },
  { id: 'card-sizes',       label: '06 Card Sizes' },
  { id: 'card-styles',      label: '07 Card Styles' },
  { id: 'forms',            label: '08 Forms' },
  { id: 'surfaces',         label: '09 Surfaces' },
  { id: 'section-map',      label: '10 Section Map' },
  { id: 'section-previews', label: '11 Previews' },
  { id: 'block-map',        label: '12 Block Map' },
  { id: 'block-elements',   label: '13 Block Elements' },
  { id: 'callout-types',    label: '14 Callout System' },
  { id: 'tables',           label: '15 Tables' },
];

export default function StyleNav() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const els = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav aria-label="Style guide sections" className="flex flex-col py-1 gap-0.5">
      <p className="px-3 pb-2 t-caption font-mono opacity-40 uppercase tracking-widest">Sections</p>
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={[
            'px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 no-underline',
            active === id
              ? 'bg-[var(--brand-muted)] text-[var(--brand)] font-bold'
              : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-1)]',
          ].join(' ')}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
