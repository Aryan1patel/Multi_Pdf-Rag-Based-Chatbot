'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.logoText}>DocMind</span>
        </Link>

        {/* Nav Links */}
        <div className={styles.links}>
          <Link href="/#features" className={styles.link}>Features</Link>
          <Link href="/#how-it-works" className={styles.link}>How it works</Link>
          <Link href="/#tech" className={styles.link}>Tech</Link>
        </div>

        {/* CTA */}
        <Link href="/try" className={`btn btn-primary btn-sm ${styles.cta}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
          </svg>
          Try it now
        </Link>
      </div>
    </nav>
  );
}
