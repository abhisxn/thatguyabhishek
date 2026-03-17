import { Glory, Manrope } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/Navbar';
import ConditionalFooter from './components/layout/ConditionalFooter';
import Providers from './components/providers/Providers';
import SmoothScroll from './components/providers/SmoothScroll';

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

export const metadata = {
  title: 'Abhishek Saxena — Product Designer',
  description: 'Product designer crafting intuitive digital experiences.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${glory.variable} ${manrope.variable} antialiased`}>
        <Providers>
          <SmoothScroll>
            <Navbar />
            {children}
            <ConditionalFooter />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
