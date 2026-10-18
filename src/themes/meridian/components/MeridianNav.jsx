import React, { useState, useEffect, useRef } from 'react';
import { useTheme, THEMES } from '../../../context/ThemeContext';
import { editorialMusic } from '../../editorial/editorialMusic';
import { MeridianLink } from '../meridianRouter';

export default function MeridianNav({ currentPage = 'home' }) {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const menuRef = useRef(null);

  // Monitor scroll for nav blur/compacting
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subscribe to background music state
  useEffect(() => {
    const unsub = editorialMusic.subscribe(({ isPlaying }) => {
      setIsMusicPlaying(isPlaying);
    });
    return unsub;
  }, []);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMusic = () => {
    editorialMusic.toggleMute();
  };

  return (
    <header className={`meridian-nav ${isScrolled ? 'meridian-nav-scrolled' : ''}`}>
      <MeridianLink href="/index.html" className="meridian-wordmark">
        <span className="meridian-wordmark-title">Naveen Pandey</span>
        <span className="meridian-wordmark-sub">Fintech • Product Designer</span>
      </MeridianLink>

      <nav aria-label="Main Navigation">
        <ul className="meridian-nav-links">
          <li>
            <MeridianLink
              href="/index.html"
              className={`meridian-nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              Home
            </MeridianLink>
          </li>
          <li>
            <MeridianLink
              href="/work.html"
              className={`meridian-nav-link ${currentPage === 'work' ? 'active' : ''}`}
            >
              Selected Work
            </MeridianLink>
          </li>
          <li>
            <MeridianLink
              href="/about.html"
              className={`meridian-nav-link ${currentPage === 'about' ? 'active' : ''}`}
            >
              Craft & Systems
            </MeridianLink>
          </li>
          <li>
            <MeridianLink
              href="/contact.html"
              className={`meridian-nav-link ${currentPage === 'contact' ? 'active' : ''}`}
            >
              Contact
            </MeridianLink>
          </li>
        </ul>
      </nav>

      <div className="meridian-nav-actions">
        {/* Audio Ambient Button */}
        <button
          className={`meridian-pill-btn ${isMusicPlaying ? 'active' : ''}`}
          onClick={toggleMusic}
          title="Toggle Ambient Audio"
          aria-label="Toggle Ambient Audio"
        >
          <span style={{ fontSize: '0.9rem' }}>{isMusicPlaying ? '♪' : '✕'}</span>
          <span>{isMusicPlaying ? 'Audio ON' : 'Audio OFF'}</span>
        </button>

        {/* Theme Switcher */}
        <div className="meridian-theme-menu" ref={menuRef}>
          <button
            className="meridian-pill-btn"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            aria-expanded={isThemeMenuOpen}
            aria-label="Switch Theme"
          >
            <span>THEME: MERIDIAN</span>
            <span style={{ fontSize: '0.6rem' }}>▼</span>
          </button>

          {isThemeMenuOpen && (
            <div className="meridian-theme-dropdown" role="menu">
              <button
                className={`meridian-theme-option ${theme === THEMES.MERIDIAN ? 'current' : ''}`}
                onClick={() => { setTheme(THEMES.MERIDIAN); setIsThemeMenuOpen(false); }}
              >
                <span>✦ Meridian (3D)</span>
                {theme === THEMES.MERIDIAN && <span>✓</span>}
              </button>
              <button
                className={`meridian-theme-option ${theme === THEMES.EDITORIAL ? 'current' : ''}`}
                onClick={() => { setTheme(THEMES.EDITORIAL); setIsThemeMenuOpen(false); }}
              >
                <span>Editorial Newspaper</span>
                {theme === THEMES.EDITORIAL && <span>✓</span>}
              </button>
              <button
                className={`meridian-theme-option ${theme === THEMES.DESIGNFILE ? 'current' : ''}`}
                onClick={() => { setTheme(THEMES.DESIGNFILE); setIsThemeMenuOpen(false); }}
              >
                <span>Design File (Figma)</span>
                {theme === THEMES.DESIGNFILE && <span>✓</span>}
              </button>
              <button
                className={`meridian-theme-option ${theme === THEMES.WINDOWS98 ? 'current' : ''}`}
                onClick={() => { setTheme(THEMES.WINDOWS98); setIsThemeMenuOpen(false); }}
              >
                <span>Windows 98 Desktop</span>
                {theme === THEMES.WINDOWS98 && <span>✓</span>}
              </button>
              <button
                className={`meridian-theme-option ${theme === THEMES.GAMING ? 'current' : ''}`}
                onClick={() => { setTheme(THEMES.GAMING); setIsThemeMenuOpen(false); }}
              >
                <span>Cyber Arcade HUD</span>
                {theme === THEMES.GAMING && <span>✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Download Resume Button */}
        <a
          href="/assets/Naveen_Pandey_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="meridian-pill-btn meridian-pill-btn-cv"
        >
          <span>CV ↓</span>
        </a>

        {/* Mobile Menu Toggle Button */}
        <button
          className="meridian-pill-btn"
          style={{ display: 'none' }}
          id="meridian-mobile-nav-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '100%',
            left: 0,
            width: '100%',
            background: '#0B0B0F',
            borderBottom: '1px solid var(--mr-border-subtle)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}
        >
          <MeridianLink
            href="/index.html"
            className="meridian-nav-link"
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </MeridianLink>
          <MeridianLink
            href="/work.html"
            className="meridian-nav-link"
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Selected Work
          </MeridianLink>
          <MeridianLink
            href="/about.html"
            className="meridian-nav-link"
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Craft & Systems
          </MeridianLink>
          <MeridianLink
            href="/contact.html"
            className="meridian-nav-link"
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </MeridianLink>
        </div>
      )}
    </header>
  );
}
