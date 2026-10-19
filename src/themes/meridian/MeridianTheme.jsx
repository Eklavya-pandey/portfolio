import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMeridianPage } from './meridianRouter';
import { MeridianNav, MeridianScene3D, MeridianCaseStudyModal } from './components';
import { editorialMusic } from '../editorial/editorialMusic';
import MeridianHomePage from './pages/MeridianHomePage';
import MeridianWorkPage from './pages/MeridianWorkPage';
import MeridianAboutPage from './pages/MeridianAboutPage';
import MeridianContactPage from './pages/MeridianContactPage';
import './meridian.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MeridianTheme() {
  const { currentPage, activeCaseStudySlug, navigateTo } = useMeridianPage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(activeCaseStudySlug);
  const [toastMessage, setToastMessage] = useState(null);

  // Background ambient music: auto-start on arrival, pause on theme switch/unmount
  useEffect(() => {
    editorialMusic.autoStart();
    return () => {
      editorialMusic.pause();
    };
  }, []);

  // Custom magnetic cursor position
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const lenisRef = useRef(null);

  // Sync selectedCaseStudy with URL slug
  useEffect(() => {
    setSelectedCaseStudy(activeCaseStudySlug);
  }, [activeCaseStudySlug]);

  // Helper to calculate scroll progress
  const updateScrollState = (scrollY) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
    setScrollProgress(progress);
  };

  // 1. Lenis Smooth Scroll Setup
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenisInstance = null;
    let tickerCallback = null;

    if (!prefersReducedMotion) {
      lenisInstance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.6,
        infinite: false
      });

      lenisRef.current = lenisInstance;

      lenisInstance.on('scroll', (e) => {
        ScrollTrigger.update();
        updateScrollState(e.scroll);
      });

      tickerCallback = (time) => {
        lenisInstance.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    } else {
      const handleNativeScroll = () => {
        updateScrollState(window.scrollY);
      };
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      updateScrollState(window.scrollY);

      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    updateScrollState(window.scrollY);

    return () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // 2. Reset scroll to top on page navigation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    setScrollProgress(0);
    ScrollTrigger.refresh();
  }, [currentPage]);

  // 3. Stop Lenis scrolling while case study modal is open
  useEffect(() => {
    if (lenisRef.current) {
      if (selectedCaseStudy) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [selectedCaseStudy]);

  // 4. GSAP Editorial Entrance Reveals per page view
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.meridian-header-block, .meridian-home-route-card, .meridian-advisory-card').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          },
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.meridian-spotlight-card, .meridian-split-card, .meridian-compact-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          },
          y: 35,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.meridian-deepdive-container, .meridian-systems-specimen-card, .meridian-contact-box, .meridian-page-transition-box').forEach((box) => {
        gsap.from(box, {
          scrollTrigger: {
            trigger: box,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out'
        });
      });
    });

    return () => ctx.revert();
  }, [currentPage]);

  // 5. Custom Magnetic Cursor (Desktop only)
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.meridian-spotlight-card') ||
          target.closest('.meridian-split-card') ||
          target.closest('.meridian-compact-card') ||
          target.closest('.meridian-home-route-card') ||
          target.closest('.meridian-dd-thumb') ||
          target.closest('.meridian-swatch-box'))
      ) {
        setIsCursorHovering(true);
      } else {
        setIsCursorHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="meridian-root" data-theme="meridian">
      {/* Scroll Progress Bar at the top */}
      <div
        className="meridian-scroll-progress"
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      />

      {/* Atmospheric Subtle Vignette */}
      <div className="meridian-ambient-layer" aria-hidden="true" />

      {/* 3D Kinetic Three.js Scene — Contextual across all pages */}
      <MeridianScene3D scrollProgress={scrollProgress} currentPage={currentPage} />

      {/* Fixed Luxury Multi-Page Nav */}
      <MeridianNav currentPage={currentPage} />

      {/* Multi-Page Content Host */}
      <main className="meridian-content-wrapper">
        {currentPage === 'home' && (
          <MeridianHomePage
            onOpenCaseStudy={(slug) => setSelectedCaseStudy(slug)}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'work' && (
          <MeridianWorkPage
            onOpenCaseStudy={(slug) => setSelectedCaseStudy(slug)}
          />
        )}

        {currentPage === 'about' && (
          <MeridianAboutPage />
        )}

        {currentPage === 'contact' && (
          <MeridianContactPage
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Case Study Modal Reader */}
      {selectedCaseStudy && (
        <MeridianCaseStudyModal
          studyKey={selectedCaseStudy}
          onClose={() => {
            setSelectedCaseStudy(null);
            // Clear ?project= parameter from URL if present
            if (typeof window !== 'undefined' && window.location.search.includes('project=')) {
              const url = new URL(window.location.href);
              url.searchParams.delete('project');
              window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
            }
          }}
        />
      )}

      {/* Custom Cursor (Desktop only) */}
      {!isTouchDevice && (
        <>
          <div
            className={`meridian-cursor ${isCursorHovering ? 'hovering' : ''}`}
            style={{
              transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`
            }}
            aria-hidden="true"
          />
          <div
            className="meridian-cursor-dot"
            style={{
              transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="meridian-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
