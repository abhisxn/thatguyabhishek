import GradientBackground from '../components/layout/GradientBackground';
import { SECTION_STYLES } from '../components/sections/ProjectSections';

const STYLE_NAMES = ['plain', 'surface', 'dark', 'accent', 'spotlight'];

const SAMPLE_BLOCKS = [
  {
    type: 'heading',
    text: 'Section heading',
  },
  {
    type: 'body',
    text: 'This is body text showing how paragraphs and descriptions look inside this section style. The muted colour and background are applied by the section wrapper.',
  },
  {
    type: 'tags',
    items: ['Research', 'UX Design', 'Prototyping'],
  },
];

function SampleContent({ s }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="t-h4 font-bold" style={{ color: s.textClr }}>Section heading</p>
      <p className="t-body2 leading-relaxed" style={{ color: s.mutedClr }}>
        This is body text showing how paragraphs look inside this section style. The muted colour and background come from the section wrapper.
      </p>
      <div className="flex flex-wrap gap-2">
        {['Research', 'UX Design', 'Prototyping'].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full t-caption font-medium"
            style={{
              background: s.textClr === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'var(--surface)',
              border: `1px solid ${s.textClr === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              color: s.mutedClr,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="h-24 rounded-xl flex items-center justify-center t-caption font-medium"
        style={{
          background: s.textClr === '#ffffff' ? 'rgba(255,255,255,0.08)' : 'var(--surface)',
          border: `1px solid ${s.textClr === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
          color: s.mutedClr,
        }}
      >
        image / embed placeholder
      </div>
    </div>
  );
}

export default function StyleGuide() {
  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen" style={{ color: 'var(--fg)', zIndex: 1 }}>

        {/* Header */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-12">
          <p className="t-caption font-semibold text-fg-muted mb-2 tracking-widest uppercase">Dev reference</p>
          <h1 className="t-h2 mb-3">Project Section Styles</h1>
          <p className="t-body1 text-fg-muted" style={{ maxWidth: '55ch' }}>
            5 visual section styles used in project pages. Sections split at Notion <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>---</code> dividers and cycle through these styles automatically.
          </p>
        </div>

        {/* Style previews */}
        {SECTION_STYLES.map((s, i) => (
          <section key={i} style={{ color: s.textClr, position: 'relative', overflow: 'hidden', ...s.wrap }}>
            {s.blob && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, #4839ca 8%, transparent) 0%, transparent 70%)',
                }}
              />
            )}
            <div
              className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12"
              style={s.inner}
            >
              {/* Style label */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full t-caption font-bold tabular-nums"
                  style={{
                    background: s.textClr === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'var(--border)',
                    color: s.textClr,
                  }}
                >
                  {i}
                </span>
                <code
                  className="t-caption font-mono font-semibold tracking-wide"
                  style={{ color: s.mutedClr }}
                >
                  SECTION_STYLES[{i}] — {STYLE_NAMES[i]}
                </code>
              </div>

              <SampleContent s={s} />
            </div>
          </section>
        ))}

        {/* Footer note */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 border-t border-theme">
          <p className="t-body2 text-fg-muted">
            Edit styles in{' '}
            <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              app/components/sections/ProjectSections.js
            </code>
          </p>
        </div>

      </main>
    </>
  );
}
