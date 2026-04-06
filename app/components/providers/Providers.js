'use client';

import { ThemeProvider } from 'next-themes';
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';

export default function Providers({ children }) {
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
