import React, { useState, useEffect, useCallback } from 'react';

/**
 * Detect active page from URL search, hash, or pathname.
 * Supports /index.html, /work.html, /about.html, /contact.html,
 * ?page=home|work|about|contact, and #home|work|about|contact.
 */
export function getCurrentPage() {
  if (typeof window === 'undefined') return 'home';

  try {
    const search = new URLSearchParams(window.location.search);
    const p = search.get('page');
    if (p) {
      const low = p.toLowerCase();
      if (['home', 'work', 'about', 'contact'].includes(low)) return low;
    }

    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash) {
      if (['home', 'work', 'about', 'contact'].includes(hash)) return hash;
    }
  } catch {}

  const path = window.location.pathname.toLowerCase();
  if (path.includes('work')) return 'work';
  if (path.includes('about')) return 'about';
  if (path.includes('contact')) return 'contact';
  return 'home';
}

/**
 * Detect active case study slug from route /work/:slug, ?project=:slug, or #work/:slug.
 */
export function getActiveCaseStudySlug() {
  if (typeof window === 'undefined') return null;
  try {
    const search = new URLSearchParams(window.location.search);
    const p = search.get('project');
    if (p) return p.toLowerCase();

    const path = window.location.pathname.toLowerCase();
    const match = path.match(/\/work\/([^/?#]+)/);
    if (match && match[1] && match[1] !== 'work.html') {
      return match[1];
    }

    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash.startsWith('work/')) {
      return hash.replace('work/', '');
    }
  } catch {}
  return null;
}

/**
 * Hook to manage multi-page routing for the Meridian theme.
 */
export function useMeridianPage() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage);
  const [activeCaseStudySlug, setActiveCaseStudySlug] = useState(getActiveCaseStudySlug);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getCurrentPage());
      setActiveCaseStudySlug(getActiveCaseStudySlug());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('meridian_navigate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('meridian_navigate', handlePopState);
    };
  }, []);

  const navigateTo = useCallback((targetUrl) => {
    if (typeof window === 'undefined') return;
    try {
      window.history.pushState(null, '', targetUrl);
      setCurrentPage(getCurrentPage());
      setActiveCaseStudySlug(getActiveCaseStudySlug());
      window.dispatchEvent(new Event('meridian_navigate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.location.href = targetUrl;
    }
  }, []);

  return { currentPage, activeCaseStudySlug, navigateTo, setCurrentPage, setActiveCaseStudySlug };
}

/**
 * MeridianLink: Accessible multi-page link component.
 * Allows right-click / open in new tab with standard hrefs,
 * while executing smooth client-side SPA routing on primary click.
 */
export function MeridianLink({
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

    // Allow standard browser shortcuts (cmd+click, ctrl+click, shift+click, right-click)
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      try {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new Event('meridian_navigate'));

        const hash = href.includes('#') ? href.substring(href.indexOf('#') + 1) : null;
        if (hash) {
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 60);
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
