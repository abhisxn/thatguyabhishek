'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../ui/ThemeToggle';
import { ArrowIcon } from '../ui/icons';
import Button from '../ui/Button';

const RESUME_URL = 'https://drive.google.com/file/d/1QuxjEMB-PyVbgwsjjPpacY3xJ3j8eXMU/view?usp=drive_link';


const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Awards', href: '/awards' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              background: 'color-mix(in srgb, var(--bg-solid, #19223d) 70%, transparent)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid var(--border)',
            }
          : { background: 'transparent', borderBottom: '1px solid transparent' }
      }
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-70 transition-opacity duration-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="thatguyabhishek" className="h-12 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="t-body2 text-fg-muted relative transition-colors duration-200 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href={RESUME_URL} external size="sm" variant="outline" icon={<ArrowIcon size={14} />}>Get my resumé</Button>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex flex-col justify-center gap-[4px] w-8 h-8"
          >
            <span className={`block h-px transition-all duration-300 origin-center ${open ? 'w-5 translate-y-2 rotate-45' : 'w-5'}`} style={{ background: 'var(--fg)' }} />
            <span className={`block h-px transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} style={{ background: 'var(--fg)' }} />
            <span className={`block h-px transition-all duration-300 origin-center ${open ? 'w-5 -translate-y-2 -rotate-45' : 'w-5'}`} style={{ background: 'var(--fg)' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          background: 'color-mix(in srgb, var(--bg-solid, #19223d) 92%, transparent)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="t-body2 text-fg-muted transition-colors hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <Button href={RESUME_URL} external size="sm" variant="outline" icon={<ArrowIcon size={14} />} className="self-start">Get my resumé</Button>
        </nav>
      </div>
    </header>
  );
}
