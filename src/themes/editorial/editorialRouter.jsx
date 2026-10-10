import React, { useState, useEffect, useCallback } from 'react';

/**
 * Detect the active page from the browser URL.
 * Supports index.html, work.html, about.html, playground.html, contact.html,
 * as well as root / or subpaths.
 */
export function getCurrentPage() {
  if (typeof window === 'undefined') return 'home';
  try {
    const search = new URLSearchParams(window.location.search);
    const p = search.get('page');
    if (p) return p.toLowerCase();
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash && ['home', 'work', 'about', 'experience', 'playground', 'contact'].includes(hash)) return hash;
  } catch {}
  const path = window.location.pathname.toLowerCase();
  if (path.includes('work')) return 'work';
  if (path.includes('about')) return 'about';
  if (path.includes('experience')) return 'experience';
  if (path.includes('playground')) return 'playground';
  if (path.includes('contact')) return 'contact';
  return 'home';
}

/**
 * Hook to track current page and listen to popstate / pushState.
 */
export function useEditorialPage() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getCurrentPage());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('editorial_navigate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('editorial_navigate', handlePopState);
    };
  }, []);

  const navigateTo = useCallback((targetUrl) => {
    if (typeof window === 'undefined') return;
    try {
      window.history.pushState(null, '', targetUrl);
      setCurrentPage(getCurrentPage());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.location.href = targetUrl;
    }
  }, []);

  return { currentPage, navigateTo };
}

/**
 * Accessible Editorial Link component.
 * Renders standard <a href> for SEO and multi-page direct URLs,
 * with smooth client-side transition when clicked.
 */
export function EditorialLink({
  href,
  children,
  className = '',
  onClick,
  activeClassName = 'active',
  isActive = false,
  ...props
}) {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    // Ignore modified clicks (cmd, ctrl, shift, right-click)
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      try {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new Event('editorial_navigate'));
        const hash = href.includes('#') ? href.substring(href.indexOf('#') + 1) : null;
        if (hash) {
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 80);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch {
        window.location.href = href;
      }
    }
  };

  const finalClass = [className, isActive ? activeClassName : ''].filter(Boolean).join(' ');

  return (
    <a href={href} className={finalClass} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
