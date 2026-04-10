'use client';

import FadeSection from '@/app/components/ui/FadeSection';

export default function BlurDemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-8 py-32 flex flex-col gap-32">

        {/* Block 1 — Display heading */}
        <FadeSection>
          <h1 className="text-6xl font-semibold leading-tight">
            Blur entry animation
          </h1>
        </FadeSection>

        {/* Block 2 — Body text */}
        <FadeSection>
          <p className="text-base text-foreground-secondary leading-relaxed max-w-xl">
            Each section fades in from below while unblurring as it enters the
            viewport. The effect uses Framer Motion's <code>whileInView</code>{' '}
            with a <code>filter: blur()</code> transition — no extra library
            required.
          </p>
        </FadeSection>

        {/* Block 3 — 2-column card row */}
        <FadeSection>
          <div className="grid grid-cols-2 gap-8">
            <div className="rounded-lg bg-surface border border-border p-8">
              <p className="text-sm font-medium text-foreground mb-2">Card one</p>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Surface card at standard size. Blurs in together with its sibling
                since both share the same FadeSection wrapper.
              </p>
            </div>
            <div className="rounded-lg bg-surface border border-border p-8">
              <p className="text-sm font-medium text-foreground mb-2">Card two</p>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Both cards animate as one unit — a single FadeSection wraps the
                entire grid row.
              </p>
            </div>
          </div>
        </FadeSection>

        {/* Block 4 — Heading + paragraph */}
        <FadeSection>
          <h2 className="text-4xl font-semibold mb-6">A second section</h2>
          <p className="text-base text-foreground-secondary leading-relaxed max-w-xl">
            Scroll speed and viewport margin both affect when the animation
            triggers. The <code>margin: -80px</code> on the viewport means the
            element starts animating just before it's fully in view.
          </p>
        </FadeSection>

        {/* Block 5 — Wide image placeholder */}
        <FadeSection>
          <div className="w-full aspect-video rounded-lg bg-background-secondary border border-border flex items-center justify-center">
            <p className="text-sm text-foreground-tertiary">Image placeholder</p>
          </div>
        </FadeSection>

      </div>
    </main>
  );
}
