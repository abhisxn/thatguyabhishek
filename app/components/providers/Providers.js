'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';

// React 19 warns about <script> tags rendered by components (next-themes injects one
// for theme flash prevention). This is a library limitation — suppress until fixed upstream.
function useSuppressThemeScriptWarning() {
  useEffect(() => {
    const original = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('script')) return;
      original(...args);
    };
    return () => { console.error = original; };
  }, []);
}

export default function Providers({ children }) {
  useSuppressThemeScriptWarning();
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
