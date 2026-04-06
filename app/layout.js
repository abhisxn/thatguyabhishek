import { Glory, Manrope } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/Navbar';
import ConditionalFooter from './components/layout/ConditionalFooter';
import Providers from './components/providers/Providers';
import SmoothScroll from './components/providers/SmoothScroll';
import DevLiveReload from './components/dev/DevLiveReload';

const glory = Glory({
  variable: '--font-glory-var',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope-var',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const BASE_URL = 'https://thatguyabhishek.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Abhishek Saxena — Senior Product Designer',
    template: '%s — Abhishek Saxena',
  },
  description:
    'Senior product designer with 12+ years of experience. Formerly at Microsoft. I design systems that scale, interfaces that convert, and experiences that stick.',
  keywords: [
    'product designer',
    'UX designer',
    'design systems',
    'senior designer',
    'Microsoft',
    'Abhishek Saxena',
    'thatguyabhishek',
  ],
  authors: [{ name: 'Abhishek Saxena', url: BASE_URL }],
  creator: 'Abhishek Saxena',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Abhishek Saxena',
    title: 'Abhishek Saxena — Senior Product Designer',
    description:
      'Senior product designer with 12+ years of experience. Formerly at Microsoft. I design systems that scale, interfaces that convert, and experiences that stick.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Abhishek Saxena — Senior Product Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhishek Saxena — Senior Product Designer',
    description:
      'Senior product designer with 12+ years of experience. Formerly at Microsoft.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Abhishek Saxena',
  url: BASE_URL,
  email: 'abhisxn@gmail.com',
  telephone: '+919999005281',
  jobTitle: 'Senior Product Designer',
  description:
    'Senior product designer with 12+ years of experience, formerly at Microsoft. Specialises in design systems, AI-powered products, and complex enterprise UX.',
  sameAs: [
    'https://www.linkedin.com/in/thatguyabhishek',
    'https://www.behance.net/thatguyabhishek',
    'https://dribbble.com/abhisheksaxena',
  ],
  knowsAbout: ['Product Design', 'UX Design', 'Design Systems', 'AI Products', 'Enterprise Software'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Abhishek Saxena',
  url: BASE_URL,
  description: 'Portfolio of Abhishek Saxena — Senior Product Designer',
  author: { '@type': 'Person', name: 'Abhishek Saxena' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
<body className={`${glory.variable} ${manrope.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <SmoothScroll>
            <Navbar />
            {children}
            <ConditionalFooter />
          </SmoothScroll>
        </Providers>
        {process.env.NODE_ENV === 'development' && <DevLiveReload />}
      </body>
    </html>
  );
}
