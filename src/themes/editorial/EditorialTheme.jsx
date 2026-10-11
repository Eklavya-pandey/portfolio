import React, { useState, useEffect, useCallback } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { PROJECTS } from './editorialData';
import { editorialAudio } from './editorialAudio';

import { useEditorialPage, EditorialLink, getActiveCaseStudySlug } from './editorialRouter';
import EditorialHomePage from './pages/EditorialHomePage';
import EditorialWorkPage from './pages/EditorialWorkPage';
import EditorialAboutPage from './pages/EditorialAboutPage';
import EditorialPlaygroundPage from './pages/EditorialPlaygroundPage';
import EditorialContactPage from './pages/EditorialContactPage';

import EditorialCaseStudyDrawer from './components/EditorialCaseStudyDrawer';
import EditorialCaseStudyPage from './components/EditorialCaseStudyPage';
import EditorialCommandPalette from './components/EditorialCommandPalette';
import EditorialInspectOverlay from './components/EditorialInspectOverlay';
import EditorialStatusTicker from './components/EditorialStatusTicker';
import EditorialToast from './components/EditorialToast';
import EditorialToolbar from './components/EditorialToolbar';
import EditorialFontSwapper, { FONT_PRESETS, ensureGoogleFontsLoaded } from './components/EditorialFontSwapper';
import { EDITORIAL_CONTENT } from './editorialContent';
import {
  IconClose,
  IconReticle,
  IconArrow,
  IconFontSwapper,
  IconSpeedTyping,
  IconAsciiArt,
  IconMusic,
  IconBlueprintMode,
  IconUiSounds,
  IconWin98,
  IconDesignFile,
  IconCommand,
  EditorialCornerTicks,
  CadCrossBox,
  CadColumnGrid
} from './components/EditorialIcons';

import EditorialTypingTest from './components/EditorialTypingTest';
import EditorialAsciiArt from './components/EditorialAsciiArt';

import './editorial.css';

import { editorialMusic, BG_MUSIC_SRC } from './editorialMusic';
export { BG_MUSIC_SRC };

// ============================================================================
// HERO SECTION CONFIGURATION
// Easily replace the hero photo path and project count here
// ============================================================================
export const HERO_CONFIG = {
  projectsCount: '10+',                   // <-- Replace Projects Shipped count here
  yearsExperience: '04',                  // <-- Years of experience
  primaryDomain: 'FINTECH',               // <-- Primary domain
  photoSrc: '/assets/hero-photo.jpg',     // <-- Replace hero photo path here
  designerName: 'NAVEEN KUMAR PANDEY',
  location: 'GOA, IN',
  photoLabel: 'PROFILE.IMG',
  photoScale: '1:1'
};

export default function EditorialTheme() {
  const { theme, setTheme } = useTheme();

  // Multi-Page Client Router
  const { currentPage, activeCaseStudySlug, navigateTo } = useEditorialPage();

  // State
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedExps, setExpandedExps] = useState({ 0: true }); // First one open by default
  const [toast, setToast] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicUnavailable, setIsMusicUnavailable] = useState(false);

  // Background single music track subscription (volume 0.4, loop, default off, no autoplay)
  useEffect(() => {
    return editorialMusic.subscribe(({ isPlaying, isUnavailable }) => {
      setIsMusicPlaying(isPlaying);
      setIsMusicUnavailable(isUnavailable);
    });
  }, []);

  // Top nav tools dropdown & mobile drawer state
  const [isNavToolsOpen, setIsNavToolsOpen] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).has('tools');
    } catch {
      return false;
    }
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navToolsRef = React.useRef(null);
  const mobileNavRef = React.useRef(null);

  // Active typography preset state
  const [activeFont, setActiveFont] = useState(() => {
    try {
      const saved = localStorage.getItem('editorial_font_preset');
      const found = FONT_PRESETS.find(f => f.id === saved);
      return found || FONT_PRESETS[0];
    } catch {
      return FONT_PRESETS[0];
    }
  });
  const currentFont = activeFont;

  // Active toolbar modal/popover: 'font' | 'type' | 'ascii' | null
  const [activeTool, setActiveTool] = useState(null);

  // Full-page case study view
  const [fullPageProject, setFullPageProject] = useState(() => {
    try {
      const slug = getActiveCaseStudySlug();
      if (slug) {
        return PROJECTS.find(p => p.id === slug || p.slug === slug) || null;
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    if (activeCaseStudySlug) {
      const found = PROJECTS.find(p => p.id === activeCaseStudySlug || p.slug === activeCaseStudySlug);
      setFullPageProject(found || null);
    } else {
      setFullPageProject(null);
    }
  }, [activeCaseStudySlug]);

  // Dark / Blueprint mode
  const [mode, setMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode');
      if (urlMode) return urlMode;
      return localStorage.getItem('editorial_mode') || 'paper';
    } catch {
      return 'paper';
    }
  });

  // Browser back/forward button support for case studies
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const projId = params.get('project');
        if (projId) {
          const found = PROJECTS.find(p => p.id === projId);
          setFullPageProject(found || null);
        } else {
          setFullPageProject(null);
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openFullPageCaseStudy = useCallback((project) => {
    if (!project) return;
    editorialAudio?.playOpen?.();
    setActiveCaseStudy(null);
    setFullPageProject(project);
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
    const slug = project.slug || project.id;
    navigateTo(`/work/${slug}`);
  }, [navigateTo]);

  const closeFullPageCaseStudy = useCallback(() => {
    editorialAudio?.playClose?.();
    setFullPageProject(null);
    document.body.style.overflow = '';
    navigateTo('/work.html');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigateTo]);

  // Sync document.body background color and data-mode attribute with editorial mode
  useEffect(() => {
    try {
      document.body.setAttribute('data-editorial-mode', mode);
      document.body.style.backgroundColor = mode === 'blueprint' ? '#0B0C0E' : '#E8E8E6';
    } catch {}
    return () => {
      try {
        document.body.removeAttribute('data-editorial-mode');
        document.body.style.backgroundColor = '';
      } catch {}
    };
  }, [mode]);

  // Toggle Mode (Blueprint / Paper)
  const toggleMode = () => {
    const newMode = mode === 'blueprint' ? 'paper' : 'blueprint';
    try {
      if (typeof editorialAudio?.playToggle === 'function') {
        editorialAudio.playToggle(newMode === 'blueprint');
      } else if (typeof editorialAudio?.playClick === 'function') {
        editorialAudio.playClick();
      }
    } catch {}
    setMode(newMode);
    try {
      localStorage.setItem('editorial_mode', newMode);
    } catch {}
    showToast({
      title: 'THEME SWITCHED',
      message: newMode === 'blueprint' ? 'Activated Technical Blueprint Mode' : 'Activated Paper Editorial Mode'
    });
  };

  // Toggle Audio
  const toggleAudio = () => {
    const nextState = editorialAudio.toggle();
    setIsAudioEnabled(nextState);
    showToast({
      title: 'AUDIO PREFERENCE',
      message: nextState ? 'Mechanical sound effects enabled' : 'Mechanical sound effects muted'
    });
  };

  // Sync typography CSS variables across document & body
  useEffect(() => {
    if (typeof document === 'undefined' || !currentFont) return;
    try {
      ensureGoogleFontsLoaded(currentFont);
      const displayFont = currentFont.displayFont || "'Chakra Petch', sans-serif";
      const bodyFont = currentFont.bodyFont || "'Chakra Petch', sans-serif";
      const displayScale = currentFont.displayScale || 1;
      const bodyScale = currentFont.bodyScale || 1;

      document.documentElement.style.setProperty('--font-display', displayFont);
      document.documentElement.style.setProperty('--font-body', bodyFont);
      document.documentElement.style.setProperty('--font-mono', bodyFont);
      document.documentElement.style.setProperty('--display-scale', displayScale);
      document.documentElement.style.setProperty('--body-scale', bodyScale);

      document.body.style.setProperty('--font-display', displayFont);
      document.body.style.setProperty('--font-body', bodyFont);
      document.body.style.setProperty('--font-mono', bodyFont);
      document.body.style.setProperty('--display-scale', displayScale);
      document.body.style.setProperty('--body-scale', bodyScale);
    } catch {}
  }, [currentFont]);

  const handleSelectFont = useCallback((font) => {
    ensureGoogleFontsLoaded(font);
    setActiveFont(font);
    try {
      localStorage.setItem('editorial_font_preset', font.id);
    } catch {}
    showToast(EDITORIAL_CONTENT.toasts.fontApplied(font.name));
  }, []);

  const handleResetFont = useCallback(() => {
    const def = FONT_PRESETS[0];
    ensureGoogleFontsLoaded(def);
    setActiveFont(def);
    try {
      localStorage.removeItem('editorial_font_preset');
    } catch {}
    showToast(EDITORIAL_CONTENT.toasts.fontReset);
  }, []);

  const toggleFontSwapper = useCallback(() => {
    setActiveTool(prev => (prev === 'font' ? null : 'font'));
  }, []);

  const openTypingTest = useCallback(() => {
    setActiveTool('type');
  }, []);

  const openAsciiArt = useCallback(() => {
    setActiveTool('ascii');
  }, []);

  const toggleMusic = useCallback(async () => {
    const res = await editorialMusic.toggle();
    if (res.isPlaying) {
      showToast({
        title: 'BACKGROUND MUSIC',
        message: 'Background music playing (0.4 vol, loop)'
      });
    } else if (!res.isUnavailable) {
      showToast({
        title: 'BACKGROUND MUSIC',
        message: 'Music playback paused'
      });
    } else {
      showToast({
        title: 'BACKGROUND MUSIC',
        message: 'Audio track unavailable'
      });
    }
  }, []);

  const closeActiveTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  // Toggle Figma / CAD Inspect Mode
  const toggleInspect = useCallback(() => {
    setIsInspectMode(prev => {
      const next = !prev;
      try {
        editorialAudio.playClick();
      } catch {}
      showToast(next ? EDITORIAL_CONTENT.toasts.inspectOn : EDITORIAL_CONTENT.toasts.inspectOff);
      return next;
    });
  }, []);

  // Toast Helper
  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast(current => (current === toastObj ? null : current));
    }, 3200);
  };

  // Copy Email Helper
  const handleCopyEmail = (e) => {
    if (e) e.preventDefault();
    editorialAudio.playSuccess();
    const email = 'naveen85pandey@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    showToast(EDITORIAL_CONTENT.toasts.emailCopied);
  };

  // Scroll Progress & Keyboard Shortcuts
  useEffect(() => {
    const handleScroll = () => {
      if (fullPageProject) return;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const current = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };

    const handleKeyDown = (e) => {
      // Inactive while boot loading screen is visible
      if (window.__nd_boot_active || document.getElementById('nd-boot-overlay')) return;

      // ⌘K or Ctrl+K to toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
        return;
      }

      // Escape to close dropdown, mobile drawer, active tool modal or inspect mode
      if (e.key === 'Escape') {
        if (isNavToolsOpen) {
          setIsNavToolsOpen(false);
          return;
        }
        if (isMobileNavOpen) {
          setIsMobileNavOpen(false);
          return;
        }
        if (activeTool) {
          setActiveTool(null);
          try {
            editorialAudio.playClose();
          } catch {}
          return;
        }
        if (isInspectMode) {
          setIsInspectMode(false);
          try {
            editorialAudio.playClick();
          } catch {}
          showToast({
            title: 'CAD INSPECT MODE OFF',
            message: 'Live inspector disabled'
          });
          return;
        }
      }

      // Guard: do NOT fire tool shortcuts when typing in inputs/textareas or typing benchmark
      const isTyping =
        ['INPUT', 'TEXTAREA'].includes(e.target?.tagName) ||
        e.target?.isContentEditable ||
        Boolean(e.target?.closest('.editorial-typing-wrap')) ||
        Boolean(e.target?.closest('.editorial-typing-surface'));
      if (isTyping) return;

      // 'b' or 'B' toggles Blueprint / Paper mode
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleMode();
        return;
      }

      // 'f' or 'F' toggles Font Swapper
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFontSwapper();
        return;
      }

      // 't' or 'T' opens Typing Test
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        openTypingTest();
        return;
      }

      // 'a' or 'A' opens ASCII Art Studio
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        openAsciiArt();
        return;
      }

      // 'm' or 'M' toggles Background Music
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMusic();
        return;
      }

      // 'i' or 'I' toggles Inspect Mode
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        toggleInspect();
        return;
      }
    };

    // Click outside listener to close tools dropdown and mobile drawer
    const handleClickOutside = (e) => {
      if (navToolsRef.current && !navToolsRef.current.contains(e.target)) {
        setIsNavToolsOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target) && !e.target.closest('.editorial-nav-hamburger-btn')) {
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullPageProject, isInspectMode, toggleInspect, activeTool, toggleFontSwapper, openTypingTest, openAsciiArt, toggleMusic, toggleMode, isNavToolsOpen, isMobileNavOpen]);

  const scrollTo = (id) => {
    editorialAudio.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleExp = (idx) => {
    editorialAudio.playClick();
    setExpandedExps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSelectCaseStudyById = (id) => {
    const proj = PROJECTS.find(p => p.id === id);
    if (proj) {
      openFullPageCaseStudy(proj);
    }
  };

  const filteredProjects = activeFilter === 'ALL'
    ? PROJECTS
    : PROJECTS.filter(p => {
        const target = activeFilter.replace(/_/g, ' ').toUpperCase();
        return p.categories.some(c => c.toUpperCase().replace(/_/g, ' ') === target);
      });

  return (
    <div
      className="editorial-root"
      data-mode={mode}
      style={{
        '--font-display': currentFont.displayFont,
        '--font-body': currentFont.bodyFont,
        '--font-mono': currentFont.bodyFont,
        '--display-scale': currentFont.displayScale || 1,
        '--body-scale': currentFont.bodyScale || 1,
        fontFamily: currentFont.bodyFont
      }}
    >
      {/* Global Background Grid Layer */}
      <div className="editorial-global-grid" aria-hidden="true" />

      {/* Tactile Film Grain Texture Overlay */}
      <div className="editorial-grain-overlay" aria-hidden="true" />

      {/* Figma / CAD Live Measurement Inspect Overlay */}
      <EditorialInspectOverlay isActive={isInspectMode} />

      <div className="editorial-window-frame">
        {/* Continuous 6-Column Architectural Gridlines */}
        <CadColumnGrid />

        {/* CAD Registration Alignment Crosshairs */}
        <div className="editorial-cad-crosshair ch-tl" aria-hidden="true">+</div>
        <div className="editorial-cad-crosshair ch-tr" aria-hidden="true">+</div>
        <div className="editorial-cad-crosshair ch-bl" aria-hidden="true">+</div>
        <div className="editorial-cad-crosshair ch-br" aria-hidden="true">+</div>


            {/* Reading Progress Indicator */}
            <div
              className="editorial-reading-progress"
              style={{ width: `${scrollProgress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(scrollProgress)}
              aria-valuemin="0"
              aria-valuemax="100"
            />

        {/* 1. Header / Navbar */}
        <header className="editorial-navbar">
          <EditorialLink href="/index.html" className="editorial-logo">
            <div className="editorial-logo-icon" />
            <span className="editorial-logo-text">naveen.design</span>
            <span className="editorial-nav-version-badge">v2.6</span>
          </EditorialLink>

          {/* Navigation Links: Home, Work, About, Playground, Contact (Multi-Page IA) */}
          <nav className="editorial-nav-links">
            <EditorialLink
              href="/index.html"
              className={`editorial-nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => editorialAudio.playClick()}
            >
              Home
            </EditorialLink>
            <EditorialLink
              href="/work.html"
              className={`editorial-nav-link ${currentPage === 'work' ? 'active' : ''}`}
              onClick={() => editorialAudio.playClick()}
            >
              Work
            </EditorialLink>
            <EditorialLink
              href="/about.html"
              className={`editorial-nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => editorialAudio.playClick()}
            >
              About
            </EditorialLink>
            <EditorialLink
              href="/playground.html"
              className={`editorial-nav-link ${currentPage === 'playground' ? 'active' : ''}`}
              onClick={() => editorialAudio.playClick()}
            >
              Playground
            </EditorialLink>
            <EditorialLink
              href="/contact.html"
              className={`editorial-nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => editorialAudio.playClick()}
            >
              Contact
            </EditorialLink>
          </nav>

          {/* Navigation Actions */}
          <div className="editorial-nav-actions">
            {/* Header Inspect CTA / Toggle (Global) */}
            <button
              type="button"
              className={`editorial-nav-inspect-btn ${isInspectMode ? 'active' : ''}`}
              onClick={toggleInspect}
              title="Toggle CAD / Figma Live Measurement Inspector"
              aria-label="Inspect Mode"
            >
              <IconReticle size={13} />
              <span>INSPECT</span>
              {isInspectMode && <span className="editorial-inspect-live-dot">●</span>}
            </button>

            {/* Grouped TOOLS Dropdown Menu (INSPECT, BLUEPRINT, SFX, WIN 98 - Search removed) */}
            <div className="editorial-nav-tools-dropdown-wrap" ref={navToolsRef}>
              <button
                type="button"
                className={`editorial-nav-tools-btn ${isNavToolsOpen ? 'active' : ''}`}
                onClick={() => {
                  editorialAudio.playClick();
                  setIsNavToolsOpen(prev => !prev);
                }}
                aria-expanded={isNavToolsOpen}
                aria-haspopup="menu"
                title="Developer & Design Tools"
              >
                <span className="editorial-nav-tools-icon"><IconReticle size={13} /></span>
                <span className="editorial-nav-tools-lbl">TOOLS</span>
                <span className="editorial-nav-tools-arrow">{isNavToolsOpen ? '▲' : '▼'}</span>
              </button>

              {isNavToolsOpen && (
                <div className="editorial-nav-tools-menu" role="menu">
                  {/* CAD Inspect Mode */}
                  <button
                    type="button"
                    role="menuitem"
                    className={`editorial-nav-tools-item ${isInspectMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      toggleInspect();
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconReticle size={16} /></span>
                      <span className="editorial-nav-tools-item-label">INSPECT</span>
                    </span>
                    <span className="editorial-nav-tools-item-right">
                      {isInspectMode && <span className="editorial-inspect-live-dot">●</span>}
                      <span className="editorial-nav-tools-item-kbd">I</span>
                    </span>
                  </button>

                  {/* Font Swapper */}
                  <button
                    type="button"
                    role="menuitem"
                    className={`editorial-nav-tools-item ${activeTool === 'font' ? 'active' : ''}`}
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      toggleFontSwapper();
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconFontSwapper size={16} /></span>
                      <span className="editorial-nav-tools-item-label">FONT SWAPPER</span>
                    </span>
                    <span className="editorial-nav-tools-item-kbd">F</span>
                  </button>

                  {/* Speed Typing Benchmark */}
                  <button
                    type="button"
                    role="menuitem"
                    className={`editorial-nav-tools-item ${activeTool === 'type' ? 'active' : ''}`}
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      openTypingTest();
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconSpeedTyping size={16} /></span>
                      <span className="editorial-nav-tools-item-label">SPEED TYPING</span>
                    </span>
                    <span className="editorial-nav-tools-item-kbd">T</span>
                  </button>

                  {/* ASCII Art Studio */}
                  <button
                    type="button"
                    role="menuitem"
                    className={`editorial-nav-tools-item ${activeTool === 'ascii' ? 'active' : ''}`}
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      openAsciiArt();
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconAsciiArt size={16} /></span>
                      <span className="editorial-nav-tools-item-label">ASCII ART</span>
                    </span>
                    <span className="editorial-nav-tools-item-kbd">A</span>
                  </button>

                  {/* Background Music Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    className={`editorial-nav-tools-item ${isMusicUnavailable ? 'disabled' : ''} ${isMusicPlaying ? 'active' : ''}`}
                    disabled={isMusicUnavailable}
                    aria-disabled={isMusicUnavailable}
                    aria-pressed={isMusicPlaying}
                    onClick={() => {
                      if (!isMusicUnavailable) {
                        setIsNavToolsOpen(false);
                        toggleMusic();
                      }
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconMusic size={16} /></span>
                      <span className="editorial-nav-tools-item-label">
                        {isMusicUnavailable ? 'MUSIC: UNAVAILABLE' : `MUSIC: ${isMusicPlaying ? 'ON' : 'OFF'}`}
                      </span>
                    </span>
                    <span className="editorial-nav-tools-item-right">
                      {isMusicPlaying && (
                        <span className="editorial-music-bars-indicator" aria-hidden="true">
                          <span className="music-bar bar-1" />
                          <span className="music-bar bar-2" />
                          <span className="music-bar bar-3" />
                        </span>
                      )}
                      <span className="editorial-nav-tools-item-kbd">M</span>
                    </span>
                  </button>

                  {/* Blueprint / Paper Mode */}
                  <button
                    type="button"
                    role="menuitem"
                    id="editorial-mode-toggle"
                    className="editorial-nav-tools-item"
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      toggleMode();
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconBlueprintMode size={16} /></span>
                      <span className="editorial-nav-tools-item-label">{mode === 'blueprint' ? 'PAPER MODE' : 'BLUEPRINT MODE'}</span>
                    </span>
                    <span className="editorial-nav-tools-item-kbd">B</span>
                  </button>

                  {/* UI Sounds Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    aria-pressed={isAudioEnabled}
                    className={`editorial-nav-tools-item ${isAudioEnabled ? 'active' : ''}`}
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      toggleAudio();
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconUiSounds size={16} isEnabled={isAudioEnabled} /></span>
                      <span className="editorial-nav-tools-item-label">UI SOUNDS</span>
                    </span>
                    <span className={`editorial-nav-tools-item-badge ${isAudioEnabled ? 'active' : ''}`}>
                      {isAudioEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Win 98 Theme */}
                  <button
                    type="button"
                    role="menuitem"
                    className="editorial-nav-tools-item"
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      setTheme(THEMES.WINDOWS98);
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconWin98 size={16} /></span>
                      <span className="editorial-nav-tools-item-label">WIN 98</span>
                    </span>
                    <span className="editorial-nav-tools-item-badge">SYS</span>
                  </button>

                  {/* Figma Theme (NAVEEN_PORTFOLIO.fig) */}
                  <button
                    type="button"
                    role="menuitem"
                    id="editorial-designfile-toggle"
                    aria-pressed={theme === THEMES.DESIGNFILE}
                    className={`editorial-nav-tools-item ${theme === THEMES.DESIGNFILE ? 'active' : ''}`}
                    onClick={() => {
                      setIsNavToolsOpen(false);
                      setTheme(THEMES.DESIGNFILE);
                    }}
                  >
                    <span className="editorial-nav-tools-item-left">
                      <span className="editorial-nav-tools-item-icon"><IconDesignFile size={16} /></span>
                      <span className="editorial-nav-tools-item-label">FIGMA THEME</span>
                    </span>
                    <span className={`editorial-nav-tools-item-badge ${theme === THEMES.DESIGNFILE ? 'active' : ''}`}>
                      {theme === THEMES.DESIGNFILE ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Header CTA: Download CV on every page */}
            <a
              href="/assets/Naveen_Pandey_CV.pdf"
              download="Naveen_Pandey_CV.pdf"
              className="editorial-contact-btn"
              data-text="Download CV"
              onClick={() => editorialAudio.playClick()}
              aria-label="Download CV"
            >
              <span>Download CV</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 6, flexShrink: 0 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>

            {/* Mobile Hamburger Button (<= 768px) */}
            <button
              type="button"
              className={`editorial-nav-hamburger-btn ${isMobileNavOpen ? 'active' : ''}`}
              onClick={() => {
                editorialAudio.playClick();
                setIsMobileNavOpen(prev => !prev);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <IconClose size={12} /> : '☰'}
            </button>
          </div>

          {/* Mobile Drawer Navigation (<= 768px) */}
          {isMobileNavOpen && (
            <div className="editorial-nav-mobile-drawer" ref={mobileNavRef}>
              <div className="editorial-nav-mobile-section">
                <span className="editorial-nav-mobile-sec-lbl">// NAVIGATION</span>
                <div className="editorial-nav-mobile-links">
                  <EditorialLink
                    href="/index.html"
                    className={`editorial-nav-mobile-link ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Home
                  </EditorialLink>
                  <EditorialLink
                    href="/work.html"
                    className={`editorial-nav-mobile-link ${currentPage === 'work' ? 'active' : ''}`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Work
                  </EditorialLink>
                  <EditorialLink
                    href="/about.html"
                    className={`editorial-nav-mobile-link ${currentPage === 'about' ? 'active' : ''}`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    About
                  </EditorialLink>
                  <EditorialLink
                    href="/playground.html"
                    className={`editorial-nav-mobile-link ${currentPage === 'playground' ? 'active' : ''}`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Playground
                  </EditorialLink>
                  <EditorialLink
                    href="/contact.html"
                    className={`editorial-nav-mobile-link ${currentPage === 'contact' ? 'active' : ''}`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Contact
                  </EditorialLink>
                </div>
              </div>

              <div className="editorial-nav-mobile-section">
                <span className="editorial-nav-mobile-sec-lbl">// TOOLS</span>
                <div className="editorial-nav-mobile-tools">
                  <button
                    type="button"
                    className={`editorial-nav-mobile-tool-btn ${isInspectMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      toggleInspect();
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconReticle size={16} />
                      <span>INSPECT</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="editorial-nav-mobile-tool-btn"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      toggleFontSwapper();
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconFontSwapper size={16} />
                      <span>FONT SWAPPER</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="editorial-nav-mobile-tool-btn"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      openTypingTest();
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconSpeedTyping size={16} />
                      <span>SPEED TYPING</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="editorial-nav-mobile-tool-btn"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      openAsciiArt();
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconAsciiArt size={16} />
                      <span>ASCII ART</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`editorial-nav-mobile-tool-btn ${isMusicUnavailable ? 'disabled' : ''} ${isMusicPlaying ? 'active' : ''}`}
                    disabled={isMusicUnavailable}
                    aria-disabled={isMusicUnavailable}
                    aria-pressed={isMusicPlaying}
                    onClick={() => {
                      if (!isMusicUnavailable) {
                        setIsMobileNavOpen(false);
                        toggleMusic();
                      }
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconMusic size={16} />
                      <span>{isMusicUnavailable ? 'MUSIC: UNAVAILABLE' : `MUSIC: ${isMusicPlaying ? 'ON' : 'OFF'}`}</span>
                    </span>
                    {isMusicPlaying && (
                      <span className="editorial-music-bars-indicator" aria-hidden="true" style={{ marginLeft: 6 }}>
                        <span className="music-bar bar-1" />
                        <span className="music-bar bar-2" />
                        <span className="music-bar bar-3" />
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="editorial-nav-mobile-tool-btn"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      toggleMode();
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconBlueprintMode size={16} />
                      <span>{mode === 'blueprint' ? 'PAPER' : 'BLUEPRINT'}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={isAudioEnabled}
                    className={`editorial-nav-mobile-tool-btn ${isAudioEnabled ? 'active' : ''}`}
                    onClick={() => {
                      toggleAudio();
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconUiSounds size={16} isEnabled={isAudioEnabled} />
                      <span>UI SOUNDS: {isAudioEnabled ? 'ON' : 'OFF'}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="editorial-nav-mobile-tool-btn"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setTheme(THEMES.WINDOWS98);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconWin98 size={16} />
                      <span>WIN 98</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={theme === THEMES.DESIGNFILE}
                    className={`editorial-nav-mobile-tool-btn ${theme === THEMES.DESIGNFILE ? 'active' : ''}`}
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setTheme(THEMES.DESIGNFILE);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconDesignFile size={16} />
                      <span>FIGMA THEME</span>
                    </span>
                    <span className={`editorial-nav-tools-item-badge ${theme === THEMES.DESIGNFILE ? 'active' : ''}`}>
                      {theme === THEMES.DESIGNFILE ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* 2. Status Ticker */}
        <EditorialStatusTicker />

        {/* 3. Main Multi-Page Content Area */}
        <main className="editorial-main-content">
          {currentPage === 'home' && (
            <EditorialHomePage
              projects={PROJECTS}
              onSelectProject={setActiveCaseStudy}
              onOpenCaseStudy={openFullPageCaseStudy}
              onCopyEmail={handleCopyEmail}
              isAudioEnabled={isAudioEnabled}
            />
          )}

          {currentPage === 'work' && (
            fullPageProject ? (
              <EditorialCaseStudyPage
                project={fullPageProject}
                allProjects={PROJECTS}
                onBack={closeFullPageCaseStudy}
                onSelectProject={openFullPageCaseStudy}
                mode={mode}
                toggleMode={toggleMode}
                showToast={showToast}
              />
            ) : (
              <EditorialWorkPage
                projects={PROJECTS}
                onOpenCaseStudy={setActiveCaseStudy}
                onOpenFullCaseStudy={openFullPageCaseStudy}
                onCopyEmail={handleCopyEmail}
              />
            )
          )}

          {currentPage === 'about' && (
            <EditorialAboutPage
              onCopyEmail={handleCopyEmail}
            />
          )}

          {currentPage === 'playground' && (
            <EditorialPlaygroundPage
              activeFont={activeFont}
              onSelectFont={handleSelectFont}
              onResetFont={handleResetFont}
              onCopyEmail={handleCopyEmail}
            />
          )}

          {currentPage === 'contact' && (
            <EditorialContactPage
              onCopyEmail={handleCopyEmail}
            />
          )}
        </main>
      </div>

      {/* 4. Footer */}
      <footer className="editorial-footer">
        <div className="editorial-footer-content">
          <p className="editorial-footer-text">
            © 2026 · Goa, India
          </p>
          <div className="editorial-footer-links">
            <button
              type="button"
              className="editorial-footer-btn"
              onClick={() => {
                editorialAudio.playClick();
                setIsCmdOpen(true);
              }}
              aria-label="Open Command Menu"
            >
              <IconCommand size={13} className="editorial-footer-btn-icon" />
              <span>Command Menu (⌘K)</span>
            </button>
            <button
              type="button"
              className="editorial-footer-btn"
              onClick={() => {
                editorialAudio.playClick();
                setTheme(THEMES.WINDOWS98);
              }}
              title="Try the retro theme"
              aria-label="Switch to Windows 98 theme"
            >
              <IconWin98 size={13} className="editorial-footer-btn-icon" />
              <span>Switch to Windows 98</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-over Case Study Drawer */}
      <EditorialCaseStudyDrawer
        project={activeCaseStudy}
        allProjects={PROJECTS}
        onClose={() => setActiveCaseStudy(null)}
        onSelectProject={(proj) => setActiveCaseStudy(proj)}
        onExpandToFullPage={openFullPageCaseStudy}
      />

      {/* Command Palette Modal */}
      <EditorialCommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectProject={(projId) => handleSelectCaseStudyById(projId)}
        onToggleMode={toggleMode}
        currentMode={mode}
        onToggleAudio={toggleAudio}
        isAudioEnabled={isAudioEnabled}
        onToggleInspect={toggleInspect}
        isInspectMode={isInspectMode}
        onOpenFont={toggleFontSwapper}
        onOpenType={openTypingTest}
        onOpenAscii={openAsciiArt}
        onToggleMusic={toggleMusic}
        isMusicPlaying={isMusicPlaying}
        isMusicUnavailable={isMusicUnavailable}
        onCopyEmail={handleCopyEmail}
        onSwitchToWin98={() => setTheme(THEMES.WINDOWS98)}
        onSwitchToDesignFile={() => setTheme(THEMES.DESIGNFILE)}
        isDesignFileActive={theme === THEMES.DESIGNFILE}
        onScrollTo={scrollTo}
      />

      {/* Font Swapper Popover (positioned above toolbar) */}
      <EditorialFontSwapper
        isOpen={activeTool === 'font'}
        onClose={closeActiveTool}
        currentFontId={activeFont.id}
        onSelectFont={handleSelectFont}
        onResetFont={handleResetFont}
      />

      {/* Speed Typing Benchmark Modal */}
      {activeTool === 'type' && (
        <EditorialTypingTest
          isOpen={true}
          onClose={closeActiveTool}
          themeMode={mode}
        />
      )}

      {/* Terminal ASCII Art Studio Modal */}
      {activeTool === 'ascii' && (
        <EditorialAsciiArt
          isOpen={true}
          onClose={closeActiveTool}
        />
      )}

      {/* System Toast Notification */}
      <EditorialToast toast={toast} />

    </div>
  );
}
