import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  PROJECTS,
  EXPERIENCES,
  EDUCATION,
  CERTIFICATIONS,
  SKILL_GROUPS,
  EDITORIAL_CONTENT
} from '../designfileData';
import { CadCrossBox, IconArrow } from '../../editorial/components/EditorialIcons';
import { FONT_PRESETS } from '../../editorial/components/EditorialFontSwapper';
import EditorialTypingTest from '../../editorial/components/EditorialTypingTest';
import EditorialAsciiArt from '../../editorial/components/EditorialAsciiArt';

/* ── Crosshatch Case Study Cover Image Placeholder (Strictly covers only) ── */
export function CrosshatchCover({ width = '100%', height = '180px', label = 'COVER IMAGE' }) {
  return (
    <div
      className="df-crosshatch-cover"
      style={{ width, height }}
      aria-label={label}
    >
      <svg className="df-crosshatch-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="df-crosshatch-pat" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="16" y2="16" stroke="#D0D0D0" strokeWidth="1" />
            <line x1="16" y1="0" x2="0" y2="16" stroke="#D0D0D0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#df-crosshatch-pat)" />
        <rect width="100%" height="100%" fill="none" stroke="#D0D0D0" strokeWidth="1" />
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#C0C0C0" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#C0C0C0" strokeWidth="1" />
      </svg>
      <span className="df-crosshatch-label font-mono">{label}</span>
    </div>
  );
}

/* ── 8 Decorative Handles (Figma exact) ── */
function SelectionHandles({ width, height }) {
  return (
    <div className="df-handles-layer" aria-hidden="true">
      <div className="df-handle tl" />
      <div className="df-handle tc" />
      <div className="df-handle tr" />
      <div className="df-handle ml" />
      <div className="df-handle mr" />
      <div className="df-handle bl" />
      <div className="df-handle bc" />
      <div className="df-handle br" />
      {width && height && (
        <div className="df-dim-pill font-mono">
          {width} × {height}
        </div>
      )}
    </div>
  );
}

export default function CanvasFrame({
  frame,
  isSelected,
  isEntered,
  selectedChildId,
  selectedMeasure,
  hoveredId,
  onSelect,
  onEnter,
  onMeasure,
  isAltHeld,
  isShiftAActive,
  onTriggerLockedDrag,
  hasSeenInteractionHint,
  copiedEmail,
  onCopyEmail,
  onNavigatePage,
  isMobileLayout = false
}) {
  const frameRef = useRef(null);
  const [frameDimensions, setFrameDimensions] = useState({ w: 1024, h: 480 });
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [workFilter, setWorkFilter] = useState('ALL');
  const [activeFontPreset, setActiveFontPreset] = useState(FONT_PRESETS[0] || null);
  const [contactCopied, setContactCopied] = useState(false);

  const handleContactCopy = (e) => {
    if (e) e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('naveen85pandey@gmail.com');
    }
    setContactCopied(true);
    if (onCopyEmail) onCopyEmail();
    setTimeout(() => setContactCopied(false), 2000);
  };

  // Measure frame height to hug content dynamically
  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const updateSize = () => {
      if (frameRef.current) {
        const w = frameRef.current.offsetWidth || 1024;
        const h = frameRef.current.offsetHeight || 480;
        setFrameDimensions({ w, h });
        if (isSelected && !selectedChildId) {
          onMeasure(frame.id, { w, h, x: 0, y: frameRef.current.offsetTop || 0 });
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, [frame.id, isSelected, selectedChildId, onMeasure, workFilter]);

  // Click & Double-click interaction rules
  const handleFrameClick = (e) => {
    if (isEntered) return;
    e.stopPropagation();
    onSelect(frame.id);
  };

  const handleFrameDoubleClick = (e) => {
    e.stopPropagation();
    onEnter(frame.id);
  };

  const handleCardClick = (cardId, cardEl, e) => {
    if (e.metaKey || e.ctrlKey) {
      // Cmd/Ctrl+click on a link opens it
      return;
    }
    if (isEntered) {
      // Content is interactive
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    onSelect(cardId);

    // Measure card for synchronized pill and Properties panel size
    if (cardEl) {
      const w = cardEl.offsetWidth || 360;
      const h = cardEl.offsetHeight || 500;
      const x = cardEl.offsetLeft || 0;
      const y = cardEl.offsetTop || 0;
      onMeasure(cardId, { w, h, x, y });
    }
  };

  const handleCardDoubleClick = (cardId, e) => {
    e.stopPropagation();
    onEnter(cardId);
  };

  // E4 Move tool card locked drag tracking
  const dragStartPos = useRef(null);
  const handleCardPointerDown = (e) => {
    if (isEntered) return;
    dragStartPos.current = { x: e.clientX, y: e.clientY, dragged: false };
  };

  const handleCardPointerMove = (e) => {
    if (isEntered || !dragStartPos.current || dragStartPos.current.dragged) return;
    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    if (dx > 5 || dy > 5) {
      dragStartPos.current.dragged = true;
      if (onTriggerLockedDrag) onTriggerLockedDrag();
    }
  };

  const handleCardPointerUp = () => {
    dragStartPos.current = null;
  };

  const handleCardDragStart = (e) => {
    e.preventDefault();
    if (onTriggerLockedDrag) onTriggerLockedDrag();
  };

  /* ──────────────────────────────────────────────────────────
     RENDER REAL SECTIONS MATCHING LIVE DEFAULT THEME
     ────────────────────────────────────────────────────────── */
  const renderFrameSection = (sectionId) => {
    switch (sectionId) {
      /* ══════════════════════════════════════════════════
         HOME FRAMES
         ══════════════════════════════════════════════════ */
      case 'frame-home-hero':
        return (
          <section className="editorial-hero">
            <div className="editorial-hero-left">
              <div className="editorial-hero-left-top">
                <div className="editorial-hero-tagline-wrap">
                  <CadCrossBox size={24} className="editorial-hero-cad-box" />
                  <span className="editorial-hero-status-pill">{EDITORIAL_CONTENT.hero.pill}</span>
                </div>

                <h1 className="editorial-hero-title">
                  {EDITORIAL_CONTENT.hero.headline}
                </h1>

                <p className="editorial-hero-desc">
                  &gt; Designing interfaces for data-heavy products, from trading dashboards to AI assistants. Turning complex systems into clear, usable experiences.
                  <span className="editorial-cursor-blink" aria-hidden="true">_</span>
                </p>

                {/* Company line: "Neo Wealth and Asset Management, Goa" without "Pvt. Ltd." */}
                <p className="editorial-hero-current-location">
                  Currently at Neo Wealth and Asset Management, Goa
                </p>

                <div className="editorial-hero-actions">
                  <button
                    type="button"
                    className="editorial-cta-btn"
                    data-text="VIEW WORK →"
                    onClick={() => onNavigatePage && onNavigatePage('work')}
                  >
                    <span>View work</span>
                    <IconArrow size={11} />
                  </button>

                  <a
                    href="/assets/Naveen_Pandey_CV.pdf"
                    download="Naveen_Pandey_CV.pdf"
                    className="editorial-hero-secondary-btn"
                    data-text="DOWNLOAD CV"
                    aria-label="Download CV"
                  >
                    <span className="editorial-btn-frame" aria-hidden="true" />
                    <span>DOWNLOAD CV</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Grouped Stats Row */}
              <div className="editorial-hero-stats-row">
                <div className="editorial-hero-stat-item">
                  <span className="editorial-hero-stat-number">5</span>
                  <span className="editorial-hero-stat-label">YEARS EXPERIENCE</span>
                </div>
                <div className="editorial-hero-stat-sep" aria-hidden="true" />
                <div className="editorial-hero-stat-item">
                  <span className="editorial-hero-stat-number">10+</span>
                  <span className="editorial-hero-stat-label">PROJECTS SHIPPED</span>
                </div>
                <div className="editorial-hero-stat-sep" aria-hidden="true" />
                <div className="editorial-hero-stat-item">
                  <span className="editorial-hero-stat-number">GOA</span>
                  <span className="editorial-hero-stat-label">BASED IN INDIA</span>
                </div>
              </div>
            </div>

            {/* Profile Photo Card */}
            <div className="editorial-hero-right">
              <div className="editorial-hero-card">
                <div className="editorial-hero-card-topbar">
                  <span className="editorial-hero-card-tag">{EDITORIAL_CONTENT.hero.photo.tag}</span>
                  <span className="editorial-hero-card-scale">{EDITORIAL_CONTENT.hero.photo.scale}</span>
                </div>
                <div className="editorial-hero-card-image-wrap">
                  <img
                    src="/assets/me.jpg"
                    alt="Naveen Pandey - Product Designer"
                    className="editorial-hero-card-img"
                    onError={(e) => { e.currentTarget.src = '/assets/hero-photo.jpg'; }}
                  />
                </div>
                <div className="editorial-hero-card-bottombar">
                  <span className="editorial-hero-card-name">{EDITORIAL_CONTENT.hero.photo.name}</span>
                  <span className="editorial-hero-card-loc">{EDITORIAL_CONTENT.hero.photo.loc}</span>
                </div>
              </div>
            </div>
          </section>
        );

      case 'frame-home-work':
        const featured = PROJECTS.slice(0, 3);
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag" style={{ position: 'relative' }}>
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.featuredWork}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />

              {/* E1 Drifting N avatar near Featured Work heading */}
              <div className="df-n-avatar-e1" title="Naveen is inspecting..." aria-hidden="true">
                N
              </div>
            </div>

            {/* 3 Real Project Cards (E3 Shift+A reflow supported) */}
            <div className={`editorial-project-grid teaser-grid ${isShiftAActive ? 'df-shifta-reflow' : ''}`}>
              {featured.map((proj) => {
                const isCardSelected = selectedChildId === proj.id;
                const isCardHovered = hoveredCardId === proj.id || hoveredId === proj.id;
                const isCardEntered = isEntered && selectedChildId === proj.id;

                return (
                  <article
                    key={proj.id}
                    id={proj.id}
                    className={`editorial-project-card df-selectable-card ${isCardSelected ? 'df-selected' : ''}`}
                    onClick={(e) => handleCardClick(proj.id, e.currentTarget, e)}
                    onDoubleClick={(e) => handleCardDoubleClick(proj.id, e)}
                    onMouseEnter={() => setHoveredCardId(proj.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onPointerDown={handleCardPointerDown}
                    onPointerMove={handleCardPointerMove}
                    onPointerUp={handleCardPointerUp}
                    onDragStart={handleCardDragStart}
                    draggable={true}
                    data-fig-node="card"
                  >
                    {/* Handles and dimension pill on select/hover */}
                    {(isCardSelected || isCardHovered) && (
                      <SelectionHandles
                        width={isCardSelected && selectedMeasure?.w ? selectedMeasure.w : 360}
                        height={isCardSelected && selectedMeasure?.h ? selectedMeasure.h : 500}
                      />
                    )}

                    {/* E6 Alt distance indicator */}
                    {isAltHeld && (isCardHovered || isCardSelected) && (
                      <div className="df-alt-measure-guides">
                        <span className="df-alt-tag top font-mono">16px</span>
                        <span className="df-alt-tag left font-mono">24px</span>
                        <span className="df-alt-tag right font-mono">24px</span>
                      </div>
                    )}

                    <div className="editorial-card-header">
                      <span className="editorial-card-tag">
                        {proj.category ? proj.category.toUpperCase().replace('-', ' ') : proj.tag}
                      </span>
                      <div className="editorial-card-header-actions">
                        <button
                          type="button"
                          className="editorial-card-preview-btn"
                          aria-label={`Preview ${proj.title}`}
                          onClick={(e) => {
                            if (!isCardEntered && !e.metaKey && !e.ctrlKey) {
                              e.preventDefault();
                              e.stopPropagation();
                              onSelect(proj.id);
                            }
                          }}
                        >
                          PREVIEW <IconArrow size={9} />
                        </button>
                        <span className="editorial-card-full-btn">
                          VIEW CASE STUDY <IconArrow size={9} />
                        </span>
                      </div>
                    </div>

                    {/* Crosshatch Placeholder strictly for Cover Image */}
                    <div className="editorial-card-image-wrap">
                      <CrosshatchCover width="100%" height="200px" label={`COVER [${proj.title}]`} />
                    </div>

                    <div className="editorial-card-title-block">
                      {proj.company && proj.year ? (
                        <div className="editorial-card-company-year">
                          {proj.company} · {proj.year}
                        </div>
                      ) : null}
                      <h3 className="editorial-card-title">
                        {proj.title}
                      </h3>
                      <p className="editorial-card-tagline">
                        {proj.description || proj.tagline}
                      </p>
                    </div>

                    {/* Exactly 4 stats in the same 2 x 2 layout from PROJECTS */}
                    <div className="editorial-stats-grid">
                      <div className="editorial-stats-row">
                        <div className="editorial-stat-box border-right headline-stat">
                          <span className="editorial-stat-val font-mono">{proj.stats?.[0]?.value ?? proj.stats?.[0]?.val ?? '3 mo'}</span>
                          <span className="editorial-stat-lbl">{proj.stats?.[0]?.label ?? proj.stats?.[0]?.lbl ?? 'DURATION'}</span>
                        </div>
                        <div className="editorial-stat-box">
                          <span className="editorial-stat-val font-mono">{proj.stats?.[1]?.value ?? proj.stats?.[1]?.val ?? 'Mobile'}</span>
                          <span className="editorial-stat-lbl">{proj.stats?.[1]?.label ?? proj.stats?.[1]?.lbl ?? 'PLATFORM'}</span>
                        </div>
                      </div>
                      <div className="editorial-stats-row row-bottom">
                        <div className="editorial-stat-box border-right">
                          <span className="editorial-stat-val font-mono">{proj.stats?.[2]?.value ?? proj.stats?.[2]?.val ?? 'UI/UX'}</span>
                          <span className="editorial-stat-lbl">{proj.stats?.[2]?.label ?? proj.stats?.[2]?.lbl ?? 'ROLE'}</span>
                        </div>
                        <div className="editorial-stat-box">
                          <span className="editorial-stat-val font-mono">{proj.stats?.[3]?.value ?? proj.stats?.[3]?.val ?? '6'}</span>
                          <span className="editorial-stat-lbl">{proj.stats?.[3]?.label ?? proj.stats?.[3]?.lbl ?? 'SCREENS'}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* View All Work Button */}
            <div className="editorial-section-footer-action">
              <button
                type="button"
                className="editorial-view-all-btn"
                data-text="VIEW ALL WORK →"
                onClick={() => onNavigatePage && onNavigatePage('work')}
              >
                <span className="editorial-btn-frame" aria-hidden="true" />
                <span>VIEW ALL WORK</span>
                <IconArrow size={12} />
              </button>
            </div>
          </section>
        );

      case 'frame-home-about':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.aboutMe}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div className="editorial-about-teaser-card">
              <div className="editorial-about-teaser-left">
                <div className="editorial-about-teaser-header">
                  <CadCrossBox size={22} className="editorial-about-teaser-icon" />
                  <span className="editorial-about-teaser-tag">WHO I AM</span>
                </div>
                <p className="editorial-about-teaser-bio">
                  Engineer-turned-designer. B.Tech in Civil Engineering, now 5 years designing digital products. At Neo I lead UX for a stock-trading app, own design QA across Android and iOS, and built a cross-platform design system.
                </p>
                <div className="editorial-about-teaser-chips">
                  {['FIGMA', 'INTERACTION DESIGN', 'DESIGN QA', 'UX RESEARCH', 'PRODUCT STRATEGY'].map((keyword) => (
                    <span key={keyword} className="editorial-tag-chip font-mono">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="editorial-about-teaser-right">
                <button
                  type="button"
                  className="editorial-hero-secondary-btn"
                  data-text="MORE ABOUT ME →"
                  onClick={() => onNavigatePage && onNavigatePage('about')}
                >
                  <span className="editorial-btn-frame" aria-hidden="true" />
                  <span>MORE ABOUT ME</span>
                  <IconArrow size={12} />
                </button>
              </div>
            </div>
          </section>
        );

      case 'frame-home-playground':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.playground}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div className="editorial-playground-header">
              <h2 className="editorial-playground-headline">
                SMALL EXPERIMENTS.
              </h2>
              <p className="editorial-playground-desc">
                Interactive toys in type, input and canvas. Try them.
              </p>
            </div>

            <div className="editorial-playground-grid three-cards">
              <div className="editorial-playground-card">
                <div className="editorial-pg-card-top">
                  <span className="editorial-pg-tag font-mono">01 // TYPOGRAPHY</span>
                  <span className="editorial-pg-key-badge font-mono">F</span>
                </div>
                <div className="editorial-pg-card-body">
                  <h3 className="editorial-pg-title">Font Pairing Studio</h3>
                  <p className="editorial-pg-copy">
                    Try 6 type pairings across this site in real time.
                  </p>
                  <div className="editorial-pg-specs font-mono">
                    <span className="editorial-pg-spec-pill">6 PAIRINGS</span>
                    <span className="editorial-pg-spec-pill">LIVE PREVIEW</span>
                  </div>
                </div>
                <div className="editorial-pg-footer">
                  <button
                    type="button"
                    className="editorial-pg-link-btn"
                    onClick={() => onNavigatePage && onNavigatePage('playground')}
                  >
                    <span>OPEN TOOL</span>
                    <IconArrow size={11} className="editorial-pg-arrow" />
                  </button>
                </div>
              </div>

              <div className="editorial-playground-card">
                <div className="editorial-pg-card-top">
                  <span className="editorial-pg-tag font-mono">02 // PERFORMANCE</span>
                  <span className="editorial-pg-key-badge font-mono">T</span>
                </div>
                <div className="editorial-pg-card-body">
                  <h3 className="editorial-pg-title">Speed Typing Benchmark</h3>
                  <p className="editorial-pg-copy">
                    Check your typing speed and accuracy.
                  </p>
                  <div className="editorial-pg-specs font-mono">
                    <span className="editorial-pg-spec-pill">15S / 30S / 60S</span>
                    <span className="editorial-pg-spec-pill">WPM + ACCURACY</span>
                  </div>
                </div>
                <div className="editorial-pg-footer">
                  <button
                    type="button"
                    className="editorial-pg-link-btn"
                    onClick={() => onNavigatePage && onNavigatePage('playground')}
                  >
                    <span>START TEST</span>
                    <IconArrow size={11} className="editorial-pg-arrow" />
                  </button>
                </div>
              </div>

              <div className="editorial-playground-card">
                <div className="editorial-pg-card-top">
                  <span className="editorial-pg-tag font-mono">03 // CANVAS</span>
                  <span className="editorial-pg-key-badge font-mono">A</span>
                </div>
                <div className="editorial-pg-card-body">
                  <h3 className="editorial-pg-title">Terminal ASCII Art Studio</h3>
                  <p className="editorial-pg-copy">
                    Turn any image into ASCII art, right in your browser.
                  </p>
                  <div className="editorial-pg-specs font-mono">
                    <span className="editorial-pg-spec-pill">4 CHARSETS</span>
                    <span className="editorial-pg-spec-pill">PNG + TXT EXPORT</span>
                  </div>
                </div>
                <div className="editorial-pg-footer">
                  <button
                    type="button"
                    className="editorial-pg-link-btn"
                    onClick={() => onNavigatePage && onNavigatePage('playground')}
                  >
                    <span>OPEN STUDIO</span>
                    <IconArrow size={11} className="editorial-pg-arrow" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );

      case 'frame-home-contact':
      case 'frame-work-contact':
      case 'frame-about-contact':
      case 'frame-playground-contact':
        return (
          <section className="editorial-bottom-cta">
            <div className="editorial-cta-left">
              <div className="editorial-section-tag" style={{ marginBottom: 12 }}>
                <CadCrossBox size={24} className="editorial-cta-cad-box" />
                <span className="editorial-section-indicator" />
                <span className="editorial-section-title">
                  {EDITORIAL_CONTENT.sections.contact}
                </span>
                <div className="editorial-section-line" aria-hidden="true" />
              </div>
              <h2 className="editorial-cta-headline">
                LET'S DESIGN WHAT'S NEXT.
              </h2>
              <p className="editorial-cta-sub">
                Open to full-time Product Designer roles and select contracts.
              </p>
            </div>

            <div className="editorial-cta-actions">
              <button
                type="button"
                className="editorial-cta-btn"
                data-text="GO TO CONTACT →"
                onClick={() => onNavigatePage && onNavigatePage('contact')}
              >
                <span>Go to contact</span>
                <IconArrow size={11} />
              </button>

              <button
                type="button"
                className="editorial-cta-copy-btn"
                data-text="COPY EMAIL ADDRESS"
                onClick={onCopyEmail}
                aria-live="polite"
              >
                <span className="editorial-btn-frame" aria-hidden="true" />
                <span>{copiedEmail ? 'Copied!' : 'COPY EMAIL ADDRESS'}</span>
              </button>
            </div>
          </section>
        );

      /* ══════════════════════════════════════════════════
         WORK FRAMES
         ══════════════════════════════════════════════════ */
      case 'frame-work-hero':
        const filteredProjects = workFilter === 'ALL'
          ? PROJECTS
          : PROJECTS.filter(p => (p.category || '').toUpperCase() === workFilter);

        return (
          <section className="editorial-page-hero">
            <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
              <CadCrossBox size={24} className="editorial-hero-cad-box" />
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.allWork}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <h1 className="editorial-page-headline">
              SELECTED WORK.
            </h1>
            <p className="editorial-work-hero-subline">
              Trading apps, investment modules, design systems and internal tools.
            </p>

            {/* Filter Strip */}
            <div className="editorial-filter-strip in-page">
              <div className="editorial-filter-pills font-mono">
                {EDITORIAL_CONTENT.filterChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className={`editorial-filter-pill ${workFilter === chip.id ? 'active' : ''}`}
                    onClick={() => setWorkFilter(chip.id)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <span className="editorial-results-count font-mono">
                Showing {filteredProjects.length} of {PROJECTS.length} projects
              </span>
            </div>
          </section>
        );

      case 'frame-work-grid':
        const currentFiltered = workFilter === 'ALL'
          ? PROJECTS
          : PROJECTS.filter(p => (p.category || '').toUpperCase() === workFilter);

        return (
          <section className="editorial-project-grid all-projects-grid" style={{ paddingTop: 0 }}>
            {currentFiltered.map((proj) => {
              const isCardSelected = selectedChildId === proj.id;
              const isCardHovered = hoveredCardId === proj.id || hoveredId === proj.id;

              return (
                <article
                  key={proj.id}
                  id={proj.id}
                  className={`editorial-project-card df-selectable-card ${isCardSelected ? 'df-selected' : ''}`}
                  onClick={(e) => handleCardClick(proj.id, e.currentTarget, e)}
                  onDoubleClick={(e) => handleCardDoubleClick(proj.id, e)}
                  onMouseEnter={() => setHoveredCardId(proj.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onPointerDown={handleCardPointerDown}
                  onPointerMove={handleCardPointerMove}
                  onPointerUp={handleCardPointerUp}
                  onDragStart={handleCardDragStart}
                  draggable={true}
                  data-fig-node="card"
                >
                  {(isCardSelected || isCardHovered) && (
                    <SelectionHandles
                      width={isCardSelected && selectedMeasure?.w ? selectedMeasure.w : 360}
                      height={isCardSelected && selectedMeasure?.h ? selectedMeasure.h : 500}
                    />
                  )}

                  {isAltHeld && (isCardHovered || isCardSelected) && (
                    <div className="df-alt-measure-guides">
                      <span className="df-alt-tag top font-mono">16px</span>
                      <span className="df-alt-tag left font-mono">24px</span>
                      <span className="df-alt-tag right font-mono">24px</span>
                    </div>
                  )}

                  <div className="editorial-card-header">
                    <span className="editorial-card-tag font-mono">
                      {proj.category ? proj.category.toUpperCase().replace('-', ' ') : proj.tag}
                    </span>
                    <div className="editorial-card-header-actions">
                      <button type="button" className="editorial-card-preview-btn">
                        PREVIEW <IconArrow size={9} />
                      </button>
                      <span className="editorial-card-full-btn">
                        VIEW CASE STUDY <IconArrow size={9} />
                      </span>
                    </div>
                  </div>

                  <div className="editorial-card-image-wrap">
                    <CrosshatchCover width="100%" height="200px" label={`COVER [${proj.title}]`} />
                  </div>

                  <div className="editorial-card-title-block">
                    {proj.company && proj.year ? (
                      <div className="editorial-card-company-year font-mono">
                        {proj.company} · {proj.year}
                      </div>
                    ) : null}
                    <h3 className="editorial-card-title">
                      {proj.title}
                    </h3>
                    <p className="editorial-card-tagline">
                      {proj.description || proj.tagline}
                    </p>
                  </div>

                  <div className="editorial-stats-grid">
                    <div className="editorial-stats-row">
                      <div className="editorial-stat-box border-right headline-stat">
                        <span className="editorial-stat-val font-mono">{proj.stats?.[0]?.value ?? proj.stats?.[0]?.val ?? '3 mo'}</span>
                        <span className="editorial-stat-lbl">{proj.stats?.[0]?.label ?? proj.stats?.[0]?.lbl ?? 'DURATION'}</span>
                      </div>
                      <div className="editorial-stat-box">
                        <span className="editorial-stat-val font-mono">{proj.stats?.[1]?.value ?? proj.stats?.[1]?.val ?? 'Mobile'}</span>
                        <span className="editorial-stat-lbl">{proj.stats?.[1]?.label ?? proj.stats?.[1]?.lbl ?? 'PLATFORM'}</span>
                      </div>
                    </div>
                    <div className="editorial-stats-row row-bottom">
                      <div className="editorial-stat-box border-right">
                        <span className="editorial-stat-val font-mono">{proj.stats?.[2]?.value ?? proj.stats?.[2]?.val ?? 'UI/UX'}</span>
                        <span className="editorial-stat-lbl">{proj.stats?.[2]?.label ?? proj.stats?.[2]?.lbl ?? 'ROLE'}</span>
                      </div>
                      <div className="editorial-stat-box">
                        <span className="editorial-stat-val font-mono">{proj.stats?.[3]?.value ?? proj.stats?.[3]?.val ?? '6'}</span>
                        <span className="editorial-stat-lbl">{proj.stats?.[3]?.label ?? proj.stats?.[3]?.lbl ?? 'SCREENS'}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        );

      /* ══════════════════════════════════════════════════
         ABOUT FRAMES
         ══════════════════════════════════════════════════ */
      case 'frame-about-hero':
        return (
          <section className="editorial-page-hero">
            <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
              <CadCrossBox size={24} className="editorial-hero-cad-box" />
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.aboutMe}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <h1 className="editorial-page-headline">
              PRODUCT DESIGNER.
            </h1>
            <p className="editorial-page-lead" style={{ fontSize: '18px', color: '#2B2B2A', lineHeight: 1.6, maxWidth: '780px' }}>
              5 years designing web and mobile products, from stock trading apps to mutual fund modules and wealth dashboards.
            </p>

            <div className="editorial-about-hero-actions">
              <a
                href="/assets/Naveen_Pandey_CV.pdf"
                download="Naveen_Pandey_CV.pdf"
                className="editorial-cta-btn"
                data-text="DOWNLOAD CV"
                aria-label="Download CV"
              >
                <span>DOWNLOAD CV</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>

              <button
                type="button"
                className="editorial-hero-secondary-btn"
                data-text="VIEW WORK →"
                onClick={() => onNavigatePage && onNavigatePage('work')}
              >
                <span className="editorial-btn-frame" aria-hidden="true" />
                <span>VIEW WORK</span>
                <IconArrow size={11} />
              </button>
            </div>
          </section>
        );

      case 'frame-about-whoiam':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">WHO I AM</span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div className="editorial-whoiam-grid">
              <div className="editorial-whoiam-left">
                <div className="editorial-whoiam-prose">
                  <p className="editorial-whoiam-p">
                    Engineer-turned-designer. B.Tech in Civil Engineering, now 5 years designing digital products.
                  </p>
                  <p className="editorial-whoiam-p">
                    At Neo I lead UX for a stock-trading app, own design QA across Android and iOS, and built a cross-platform design system.
                  </p>
                  <p className="editorial-whoiam-p">
                    I work close to engineering and increasingly scope features and run research for internal tools.
                  </p>
                </div>

                <div className="editorial-whoiam-specs-grid font-mono">
                  <div className="editorial-whoiam-spec-item">
                    <span className="spec-lbl">LOCATION:</span>
                    <span className="spec-val">Goa, India</span>
                  </div>
                  <div className="editorial-whoiam-spec-item">
                    <span className="spec-lbl">EXPERIENCE:</span>
                    <span className="spec-val">5 Years</span>
                  </div>
                  <div className="editorial-whoiam-spec-item">
                    <span className="spec-lbl">EDUCATION:</span>
                    <span className="spec-val">B.Tech Civil Engineering</span>
                  </div>
                  <div className="editorial-whoiam-spec-item">
                    <span className="spec-lbl">CURRENT ROLE:</span>
                    <span className="spec-val">Senior Product Designer, Neo</span>
                  </div>
                </div>
              </div>

              <div className="editorial-whoiam-right">
                <div className="editorial-hero-card" style={{ maxWidth: 300 }}>
                  <div className="editorial-hero-card-image-wrap">
                    <img src="/assets/me.jpg" alt="Naveen Pandey" className="editorial-hero-card-img" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'frame-experience':
      case 'frame-about-experience':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">{EDITORIAL_CONTENT.sections.experience || '03 // CAREER & EXPERIENCE'}</span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div className="editorial-experience-timeline">
              {EXPERIENCES.map((exp, idx) => (
                <div key={idx} id={`exp-${exp.id || idx}`} className="editorial-exp-card" style={{ marginBottom: 20 }}>
                  <div className="editorial-exp-header" style={{ padding: '16px 20px', background: '#F8F8F8', border: '1px solid #ECECEC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, color: '#1E1E1E' }}>{exp.role}</h3>
                        <div className="font-mono" style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                          {exp.company} · {exp.location}
                        </div>
                      </div>
                      <span className="font-mono" style={{ fontSize: 12, color: 'var(--df-canvas-blue)' }}>
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #ECECEC', borderTop: 'none' }}>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                      {exp.summary || exp.description}
                    </p>

                    {/* Metric Cards */}
                    {exp.metricCards && exp.metricCards.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 14 }}>
                        {exp.metricCards.map((mc, mci) => (
                          <div key={mci} style={{ background: '#F9F9F9', border: '1px solid #ECECEC', padding: '8px 12px' }}>
                            <div className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: '#1E1E1E' }}>{mc.val}</div>
                            <div className="font-mono" style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{mc.lbl}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullet Points */}
                    {(exp.bullets || exp.highlights) && (
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                        {(exp.bullets || exp.highlights).map((h, i) => (
                          <li key={i} style={{ marginBottom: 6 }}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {/* Skill Chips */}
                    {exp.chips && exp.chips.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                        {exp.chips.map((chip, ci) => (
                          <span key={ci} className="font-mono" style={{ fontSize: 10, background: '#F0F0F0', padding: '2px 8px', color: '#555' }}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'frame-about-education':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">EDUCATION</span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div style={{ padding: 24, background: '#FAFAFA', border: '1px solid #ECECEC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{EDUCATION?.degree || 'B.Tech in Civil Engineering'}</h3>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    {EDUCATION?.institution || 'Dr. A.P.J. Abdul Kalam Technical University'}
                  </div>
                </div>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--df-canvas-blue)' }}>
                  {EDUCATION?.period || '2016 – 2020'}
                </span>
              </div>
            </div>
          </section>
        );

      case 'frame-about-certifications':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">{EDITORIAL_CONTENT.sections.certifications}</span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} style={{ padding: 18, background: '#FAFAFA', border: '1px solid #ECECEC' }}>
                  <h4 style={{ margin: 0, fontSize: 14 }}>{cert.name}</h4>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{cert.issuer}</div>
                  <div className="font-mono" style={{ fontSize: 11, color: '#888', marginTop: 6 }}>{cert.year}</div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'frame-about-skills':
        return (
          <section className="editorial-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">SKILLS & TOOLS</span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {SKILL_GROUPS.map((grp, idx) => (
                <div key={idx} style={{ padding: 18, background: '#FAFAFA', border: '1px solid #ECECEC' }}>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--df-canvas-blue)', marginBottom: 8, fontWeight: 700 }}>
                    {grp.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {grp.skills.map((sk, i) => (
                      <span key={i} className="editorial-tag-chip font-mono" style={{ fontSize: 10 }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      /* ══════════════════════════════════════════════════
         PLAYGROUND FRAMES
         ══════════════════════════════════════════════════ */
      case 'frame-playground-hero':
        return (
          <section className="editorial-page-hero">
            <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
              <CadCrossBox size={24} className="editorial-hero-cad-box" />
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.playground}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <h1 className="editorial-page-headline">
              SMALL EXPERIMENTS.
            </h1>
            <p className="editorial-page-lead" style={{ fontSize: '18px', color: '#2B2B2A', lineHeight: 1.6, maxWidth: '780px' }}>
              Interactive toys in type, input and canvas. Try them.
            </p>
          </section>
        );

      case 'frame-playground-fonts':
        return (
          <section className="editorial-playground-section-wrapper">
            <div className="editorial-playground-tool-card">
              <div className="editorial-tool-card-header">
                <div className="editorial-tool-card-title-group">
                  <span className="editorial-tool-card-tag font-mono">01 // TYPOGRAPHY SYSTEM</span>
                  <h3 className="editorial-tool-card-title">Font Pairing Studio</h3>
                  <p className="editorial-tool-context-line">Try 6 type pairings across this site in real time.</p>
                </div>
              </div>

              <div className="editorial-font-inline-studio">
                <div className="editorial-font-tester-bar">
                  <span className="editorial-font-tester-lbl font-mono">SPECIMEN TESTER:</span>
                  <input
                    type="text"
                    className="editorial-font-tester-input"
                    value={testFontText}
                    onChange={(e) => setTestFontText(e.target.value)}
                    placeholder="Type numbers or text to evaluate tabular font alignment..."
                  />
                </div>

                <div className="editorial-font-presets-grid">
                  {FONT_PRESETS.map((font) => (
                    <div
                      key={font.id}
                      className={`editorial-font-preset-card ${(activeFontPreset?.id === font.id) ? 'active' : ''}`}
                      onClick={() => setActiveFontPreset(font)}
                    >
                      <div className="preset-name">{font.name}</div>
                      <div className="preset-sub font-mono">{font.heading} + {font.mono}</div>
                      <div className="preset-specimen font-mono" style={{ fontFamily: font.mono }}>
                        {testFontText.slice(0, 32)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'frame-playground-typing':
        return (
          <section className="editorial-playground-section-wrapper">
            <div className="editorial-playground-tool-card">
              <div className="editorial-tool-card-header">
                <div className="editorial-tool-card-title-group">
                  <span className="editorial-tool-card-tag font-mono">02 // PERFORMANCE BENCHMARK</span>
                  <h3 className="editorial-tool-card-title">Speed Typing Benchmark</h3>
                  <p className="editorial-tool-context-line">Check your typing speed and accuracy in real time.</p>
                </div>
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                <EditorialTypingTest isOpen={true} onClose={() => {}} isInline={true} />
              </div>
            </div>
          </section>
        );

      case 'frame-playground-ascii':
        return (
          <section className="editorial-playground-section-wrapper">
            <div className="editorial-playground-tool-card">
              <div className="editorial-tool-card-header">
                <div className="editorial-tool-card-title-group">
                  <span className="editorial-tool-card-tag font-mono">03 // CANVAS CONVERTER</span>
                  <h3 className="editorial-tool-card-title">Terminal ASCII Art Studio</h3>
                  <p className="editorial-tool-context-line">Turn any image into ASCII art, right in your browser.</p>
                </div>
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                <EditorialAsciiArt isOpen={true} onClose={() => {}} isInline={true} />
              </div>
            </div>
          </section>
        );

      /* ══════════════════════════════════════════════════
         CONTACT FRAMES
         ══════════════════════════════════════════════════ */
      case 'frame-contact-hero':
        return (
          <section className="editorial-page-hero">
            <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
              <CadCrossBox size={24} className="editorial-hero-cad-box" />
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">
                {EDITORIAL_CONTENT.sections.contact}
              </span>
              <div className="editorial-section-line" aria-hidden="true" />
            </div>

            <h1 className="editorial-page-headline">
              LET'S DESIGN WHAT'S NEXT.
            </h1>
            <p className="editorial-page-lead" style={{ fontSize: '18px', color: '#2B2B2A', lineHeight: 1.6, maxWidth: '780px' }}>
              Open to full-time Product Designer roles and select contracts.
            </p>
          </section>
        );

      case 'frame-contact-form':
        return (
          <section className="editorial-section" style={{ paddingTop: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 36, background: '#FAFAFA', padding: 36, border: '1px solid #ECECEC' }}>
              {/* Left Column: Direct channels */}
              <div>
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--df-canvas-blue)', marginBottom: 8, fontWeight: 700 }}>
                  DIRECT CHANNELS
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: '#888' }}>EMAIL:</div>
                  <a href="mailto:naveen85pandey@gmail.com" style={{ fontSize: 15, color: '#1E1E1E', fontWeight: 600, textDecoration: 'none' }}>
                    naveen85pandey@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={onCopyEmail}
                    className="font-mono"
                    style={{ display: 'block', marginTop: 6, fontSize: 11, background: '#EEEEEE', border: '1px solid #DDDDDD', padding: '3px 8px', cursor: 'pointer' }}
                  >
                    {copiedEmail ? 'Copied!' : 'Copy Email'}
                  </button>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: '#888' }}>LOCATION:</div>
                  <div style={{ fontSize: 14, color: '#333' }}>Goa, India (Open to Remote / Relocation)</div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>SOCIALS & RESUME:</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <a href="https://linkedin.com/in/naveen-pandey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--df-canvas-blue)', fontSize: 12 }}>LinkedIn</a>
                    <a href="https://github.com/naveen85pandey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--df-canvas-blue)', fontSize: 12 }}>GitHub</a>
                    <a href="/assets/Naveen_Pandey_CV.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--df-canvas-blue)', fontSize: 12 }}>Download CV</a>
                  </div>
                </div>
              </div>

              {/* Right Column: Transmission Dispatch Form */}
              <div>
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--df-canvas-blue)', marginBottom: 12, fontWeight: 700 }}>
                  TRANSMISSION DISPATCH FORM
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4 }}>NAME OR ORGANIZATION *</label>
                    <input type="text" placeholder="Your name or team" style={{ width: '100%', padding: '8px 10px', border: '1px solid #CCC', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4 }}>EMAIL ADDRESS *</label>
                    <input type="email" placeholder="name@domain.com" style={{ width: '100%', padding: '8px 10px', border: '1px solid #CCC', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4 }}>ENGAGEMENT DETAILS *</label>
                    <textarea rows="3" placeholder="Brief project scope or role description..." style={{ width: '100%', padding: '8px 10px', border: '1px solid #CCC', fontSize: 13 }} />
                  </div>
                  <button
                    type="button"
                    style={{ alignSelf: 'flex-start', background: '#111', color: '#FFF', padding: '10px 20px', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    DISPATCH TRANSMISSION →
                  </button>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  /* ──────────────────────────────────────────────────────────
     EDITORIAL HOME ARTBOARD RENDERER
     Renders the exact brutalist editorial design requested by user.
     ────────────────────────────────────────────────────────── */
  /* ──────────────────────────────────────────────────────────
     EDITORIAL ARTBOARD SYSTEM (Brutalist Grid Design)
     Homepage fixes + Complete inner pages: Work, About, Experience, Contact.
     ────────────────────────────────────────────────────────── */
  const isElemSelected = (id) => isSelected && selectedChildId === id;
  const getElemClass = (id, baseClass = '') =>
    `${baseClass} df-selectable-card ${isElemSelected(id) ? 'df-selected' : ''}`.trim();

  const handleAction = (layerId, e, navTarget) => {
    if (isEntered) {
      if (navTarget) {
        e.preventDefault();
        onNavigatePage && onNavigatePage(navTarget);
      }
      return;
    }
    handleCardClick(layerId, e.currentTarget, e);
  };

  /* ── Shared Editorial Header (6 Columns) ── */
  const renderEditorialHeader = (activePage = 'home') => (
    <header
      className={getElemClass('hdr-group', 'row hdr')}
      id="hdr-group"
      onClick={(e) => handleAction('hdr-group', e)}
    >
      <a
        className={getElemClass('hdr-logo', 'cell logo')}
        id="hdr-logo"
        href="#home"
        aria-label="Home"
        onClick={(e) => handleAction('hdr-logo', e, 'home')}
      >
        NAVEEN.
      </a>
      <div
        className={getElemClass('hdr-loc', 'cell tl')}
        id="hdr-loc"
        onClick={(e) => handleAction('hdr-loc', e)}
      >
        PRODUCT DESIGNER<br />GOA, INDIA
      </div>
      <nav
        className={getElemClass('hdr-nav', 'dc')}
        id="hdr-nav"
        aria-label="Primary"
        onClick={(e) => handleAction('hdr-nav', e)}
      >
        <a
          className={`cell nav ${activePage === 'work' ? 'on' : ''}`}
          data-nav="work"
          href="#work"
          onClick={(e) => handleAction('hdr-nav', e, 'work')}
        >
          WORK
        </a>
        <a
          className={`cell nav ${activePage === 'about' ? 'on' : ''}`}
          data-nav="about"
          href="#about"
          onClick={(e) => handleAction('hdr-nav', e, 'about')}
        >
          ABOUT
        </a>
        <a
          className={`cell nav ${activePage === 'contact' ? 'on' : ''}`}
          data-nav="contact"
          href="#contact"
          onClick={(e) => handleAction('hdr-nav', e, 'contact')}
        >
          CONTACT
        </a>
      </nav>
      <a
        className={getElemClass('hdr-cv', 'cell nav cv')}
        id="hdr-cv"
        href="/assets/Naveen_Pandey_CV.pdf"
        download="Naveen_Pandey_CV.pdf"
        onClick={(e) => {
          if (!isEntered) {
            e.preventDefault();
            handleCardClick('hdr-cv', e.currentTarget, e);
          }
        }}
      >
        DOWNLOAD CV <span aria-hidden="true">↓</span>
      </a>
    </header>
  );

  /* ── Shared Editorial Bottom CTA ── */
  const renderEditorialCta = () => (
    <section
      className={getElemClass('cta-group', 'row cta')}
      id="cta-group"
      onClick={(e) => handleAction('cta-group', e)}
    >
      <div
        className={getElemClass('cta-headline', 'cell red')}
        id="cta-headline"
        onClick={(e) => handleAction('cta-headline', e)}
      >
        <h2 className="disp">HIRING A FINTECH DESIGNER?<br />TALK TO ME.</h2>
      </div>
      <div
        className={getElemClass('cta-email', 'cell c2')}
        id="cta-email"
        onClick={(e) => handleAction('cta-email', e)}
      >
        <div>
          <span className="lbl">GET IN TOUCH</span>
          <p className="lc" style={{ marginTop: 6, fontSize: 13 }}>naveen85pandey@gmail.com</p>
        </div>
        <div className="btns">
          <a
            className="btn fill"
            href="#contact"
            onClick={(e) => handleAction('cta-email', e, 'contact')}
          >
            GO TO CONTACT <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            className="btn"
            onClick={(e) => {
              if (isEntered) {
                e.preventDefault();
                onCopyEmail && onCopyEmail();
              } else {
                handleCardClick('cta-email', e.currentTarget, e);
              }
            }}
          >
            {copiedEmail ? 'COPIED!' : 'COPY EMAIL ADDRESS'}
          </button>
        </div>
      </div>
      <div
        className={getElemClass('cta-socials', 'cell c2')}
        id="cta-socials"
        onClick={(e) => handleAction('cta-socials', e)}
      >
        <span className="lbl">FIND ME</span>
        <div className="soc">
          <a
            href="https://linkedin.com/in/naveen-pandey"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            onClick={(e) => {
              if (!isEntered) {
                e.preventDefault();
                handleCardClick('cta-socials', e.currentTarget, e);
              }
            }}
          >
            <span>LINKEDIN</span> <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Behance"
            onClick={(e) => {
              if (!isEntered) {
                e.preventDefault();
                handleCardClick('cta-socials', e.currentTarget, e);
              }
            }}
          >
            <span>BEHANCE</span> <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={(e) => {
              if (!isEntered) {
                e.preventDefault();
                handleCardClick('cta-socials', e.currentTarget, e);
              }
            }}
          >
            <span>WHATSAPP</span> <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );

  /* ──────────────────────────────────────────────────────────
     1. EDITORIAL HOME ARTBOARD
     ────────────────────────────────────────────────────────── */
  const renderEditorialHome = () => {
    return (
      <div className="ed-wrapper" style={{ width: '100%' }}>
        <div className="ed-frame">
          {renderEditorialHeader('home')}

          {/* ===== HOME MAIN ===== */}
          <main data-page="home">
            {/* HERO SECTION */}
            <section
              className={getElemClass('hero-group', 'row hero')}
              id="hero-group"
              onClick={(e) => handleAction('hero-group', e)}
            >
              <div className="cell hl">
                <h1
                  className={getElemClass('hero-headline', 'disp xl')}
                  id="hero-headline"
                  onClick={(e) => handleAction('hero-headline', e)}
                >
                  NAVEEN<br />PANDEY.
                </h1>

                <div>
                  <p
                    className={getElemClass('hero-tag', 'tag')}
                    id="hero-tag"
                    onClick={(e) => handleAction('hero-tag', e)}
                  >
                    <i className="sq" />Product designer for trading and wealth apps.
                  </p>
                  <div
                    className={getElemClass('hero-ctas', 'btns')}
                    id="hero-ctas"
                    style={{ marginTop: 18 }}
                    onClick={(e) => handleAction('hero-ctas', e)}
                  >
                    <a
                      className="btn fill"
                      href="#work"
                      onClick={(e) => handleAction('hero-ctas', e, 'work')}
                    >
                      VIEW WORK <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      className="btn"
                      href="/assets/Naveen_Pandey_CV.pdf"
                      download="Naveen_Pandey_CV.pdf"
                      onClick={(e) => {
                        if (!isEntered) {
                          e.preventDefault();
                          handleCardClick('hero-ctas', e.currentTarget, e);
                        }
                      }}
                    >
                      DOWNLOAD CV <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>

                {/* 3 Key Facts filling empty space under name */}
                <div
                  className={getElemClass('hero-facts', 'hero-facts')}
                  id="hero-facts"
                  onClick={(e) => handleAction('hero-facts', e)}
                >
                  <div className="fact-item">
                    <span className="fact-no">01</span>
                    <div className="fact-text">
                      <b>HIGH-FREQUENCY FINTECH</b>
                      <span>Trading terminals, option chains &amp; multi-market execution</span>
                    </div>
                  </div>
                  <div className="fact-item">
                    <span className="fact-no">02</span>
                    <div className="fact-text">
                      <b>MULTI-PLATFORM SYSTEMS</b>
                      <span>Unified architecture powering 4 distinct investor apps</span>
                    </div>
                  </div>
                  <div className="fact-item">
                    <span className="fact-no">03</span>
                    <div className="fact-text">
                      <b>MEASURED OUTCOMES</b>
                      <span>Lifted conversion from 1.2% to 4.4% at BP Equities</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stack">
                <div
                  className={getElemClass('hero-intro', 'cell')}
                  id="hero-intro"
                  onClick={(e) => handleAction('hero-intro', e)}
                >
                  <p className="intro">
                    Designing interfaces for data-heavy products, from trading dashboards to AI assistants. Turning complex systems into clear, usable experiences.
                  </p>
                </div>
                <div
                  className={getElemClass('hero-stats', 'duo')}
                  id="hero-stats"
                  onClick={(e) => handleAction('hero-stats', e)}
                >
                  <div className="cell stat">
                    <b>10+</b>
                    <span>PROJECTS SHIPPED</span>
                  </div>
                  <div className="cell stat r">
                    <b>5</b>
                    <span>YEARS EXPERIENCE</span>
                  </div>
                </div>
                {/* Real photo frame */}
                <div
                  className={getElemClass('hero-portrait', 'portrait-frame')}
                  id="hero-portrait"
                  onClick={(e) => handleAction('hero-portrait', e)}
                >
                  <img
                    src="/assets/hero-photo.jpg"
                    alt="Naveen Pandey — Product Designer"
                    onError={(e) => { e.currentTarget.src = '/assets/me.jpg'; }}
                  />
                </div>
              </div>
            </section>

            {/* STATUS BAND */}
            <section
              className={getElemClass('band-group', 'row band')}
              id="band-group"
              onClick={(e) => handleAction('band-group', e)}
            >
              <div
                className={getElemClass('band-year', 'cell vt')}
                id="band-year"
                onClick={(e) => handleAction('band-year', e)}
              >
                <span>(2026)</span>
              </div>
              <div
                className={getElemClass('band-company', 'cell mid')}
                id="band-company"
                onClick={(e) => handleAction('band-company', e)}
              >
                <p>
                  CURRENTLY AT NEO WEALTH<br />AND ASSET MANAGEMENT, GOA.
                </p>
              </div>
              <a
                className={getElemClass('band-status', 'cell open')}
                id="band-status"
                href="#contact"
                onClick={(e) => handleAction('band-status', e, 'contact')}
              >
                <span>OPEN TO FULL-TIME ROLES<br />AND SELECT CONTRACTS</span>
                <i className="dot" />
              </a>
            </section>

            {/* WORKED WITH STRIP */}
            <section
              className={getElemClass('worked-with-group', 'row worked-with-strip')}
              id="worked-with-group"
              onClick={(e) => handleAction('worked-with-group', e)}
            >
              <div className="cell worked-with-lbl" id="worked-with-lbl">WORKED WITH</div>
              <div className="cell worked-with-item">NEO WEALTH</div>
              <div className="cell worked-with-item">BP EQUITIES</div>
              <div className="cell worked-with-item">SKYDREAMS</div>
              <div className="cell worked-with-item">PIGEON EDU</div>
              <div className="cell worked-with-item">THE SOULED STORE</div>
            </section>

            {/* SELECTED WORK */}
            <section
              className={getElemClass('featured-work-group', 'row work')}
              id="featured-work-group"
              onClick={(e) => handleAction('featured-work-group', e)}
            >
              <div className="cell wl">
                <div>
                  <b>SELECTED WORK</b>
                  <span className="ar" aria-hidden="true">↓</span>
                  <p className="wl-intro">
                    Data-dense execution interfaces, thematic investment modules, and multi-tier design systems engineered for active investors.
                  </p>
                </div>
                <a
                  className={getElemClass('home-view-all-cta', 'seeall')}
                  id="home-view-all-cta"
                  href="#work"
                  onClick={(e) => handleAction('home-view-all-cta', e, 'work')}
                >
                  VIEW ALL WORK <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="stack">
                {/* 01 Stock Trading App */}
                <a
                  className={getElemClass('stock-trading-app', 'proj')}
                  id="stock-trading-app"
                  href="#work"
                  onClick={(e) => handleAction('stock-trading-app', e, 'work')}
                >
                  <div className="n">01</div>
                  <div className="t">
                    <div>
                      <b>STOCK TRADING APP</b>
                      <small>FINTECH / MOBILE</small>
                      <p className="prob-line">
                        Traders needed fast, precise order flow on mobile.
                      </p>
                      <span className="metric-pill">2 platforms / ANDROID + iOS</span>
                    </div>
                    <em>VIEW CASE STUDY ↗</em>
                  </div>
                  <div className="mockup-frame">
                    <img src="/editorial/project1.png" alt="Stock Trading App Mockup" loading="lazy" />
                  </div>
                </a>

                {/* 02 Investment Modules */}
                <a
                  className={getElemClass('investment-modules', 'proj')}
                  id="investment-modules"
                  href="#work"
                  onClick={(e) => handleAction('investment-modules', e, 'work')}
                >
                  <div className="n">02</div>
                  <div className="t">
                    <div>
                      <b>INVESTMENT MODULES</b>
                      <small>FINTECH / WEB + APP</small>
                      <p className="prob-line">
                        Investors had no single place to discover funds, options and baskets.
                      </p>
                      <span className="metric-pill">1.2% → 4.4% / CONVERSION</span>
                    </div>
                    <em>VIEW CASE STUDY ↗</em>
                  </div>
                  <div className="mockup-frame">
                    <img
                      src="/editorial/project2.png"
                      alt="Investment Modules Mockup"
                      className="proj-img-02"
                      loading="lazy"
                    />
                  </div>
                </a>

                {/* 03 Design System */}
                <a
                  className={getElemClass('markets-overview', 'proj')}
                  id="markets-overview"
                  href="#work"
                  onClick={(e) => handleAction('markets-overview', e, 'work')}
                >
                  <div className="n">03</div>
                  <div className="t">
                    <div>
                      <b>DESIGN SYSTEM &amp; INFRASTRUCTURE</b>
                      <small>DESIGN SYSTEM / MULTI-PLATFORM</small>
                      <p className="prob-line">
                        Four investor apps, four inconsistent interfaces.
                      </p>
                      <span className="metric-pill">4 apps / ONE SHARED SYSTEM</span>
                    </div>
                    <em>VIEW CASE STUDY ↗</em>
                  </div>
                  <div className="mockup-frame">
                    <img
                      src="/editorial/project3.png"
                      alt="Design System Mockup"
                      className="proj-img-03"
                      loading="lazy"
                    />
                  </div>
                </a>
              </div>
            </section>

            {/* ABOUT TEASER (2 short sentences, no arrows on skills) */}
            <section
              className={getElemClass('about-teaser-group', 'row about')}
              id="about-teaser-group"
              onClick={(e) => handleAction('about-teaser-group', e)}
            >
              <div
                className={getElemClass('about-star', 'cell ast')}
                id="about-star"
                aria-hidden="true"
                onClick={(e) => handleAction('about-star', e)}
              >
                <svg viewBox="0 0 100 100">
                  <g fill="#0A0A0A">
                    <rect x="43" y="6" width="14" height="88" />
                    <rect x="43" y="6" width="14" height="88" transform="rotate(60 50 50)" />
                    <rect x="43" y="6" width="14" height="88" transform="rotate(120 50 50)" />
                  </g>
                </svg>
              </div>
              <div
                className={getElemClass('about-bio', 'cell ab')}
                id="about-bio"
                onClick={(e) => handleAction('about-bio', e)}
              >
                <h2 className="disp h2">WHO I AM.</h2>
                <p>
                  I design trading and wealth products as one system: research the flow, build it once in the design system, and QA it against the build. At BP Equities, that took conversion from 1.2% to 4.4%.
                </p>
                <div className="btns">
                  <a
                    className={getElemClass('about-more-cta', 'btn')}
                    id="about-more-cta"
                    href="#about"
                    onClick={(e) => handleAction('about-more-cta', e, 'about')}
                  >
                    MORE ABOUT ME <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              <div className="cell vt">
                <span>SKILLS</span>
              </div>
              <div
                className={getElemClass('about-skills', 'list')}
                id="about-skills"
                onClick={(e) => handleAction('about-skills', e)}
              >
                <a href="#about" onClick={(e) => handleAction('about-skills', e, 'about')}>
                  <i>01</i>FIGMA
                </a>
                <a href="#about" onClick={(e) => handleAction('about-skills', e, 'about')}>
                  <i>02</i>INTERACTION DESIGN
                </a>
                <a href="#about" onClick={(e) => handleAction('about-skills', e, 'about')}>
                  <i>03</i>DESIGN QA
                </a>
                <a href="#about" onClick={(e) => handleAction('about-skills', e, 'about')}>
                  <i>04</i>UX RESEARCH
                </a>
                <a href="#about" onClick={(e) => handleAction('about-skills', e, 'about')}>
                  <i>05</i>PRODUCT STRATEGY
                </a>
              </div>
            </section>
          </main>

          {renderEditorialCta()}
        </div>

        <p className="ed-foot">© 2026 · Goa, India</p>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     2. EDITORIAL WORK ARTBOARD
     ────────────────────────────────────────────────────────── */
  const renderEditorialWork = () => {
    const filteredProjects = workFilter === 'ALL'
      ? PROJECTS
      : PROJECTS.filter(p => {
          if (workFilter === 'FINTECH') return p.category === 'fintech' || p.tag === 'FINTECH';
          if (workFilter === 'DESIGN SYSTEM') return p.category === 'design-system' || p.tag === 'DESIGN SYSTEM';
          if (workFilter === 'AI / TOOLS') return p.category === 'ai' || p.category === 'internal-tools';
          return true;
        });

    return (
      <div className="ed-wrapper" style={{ width: '100%' }}>
        <div className="ed-frame">
          {renderEditorialHeader('work')}

          <main data-page="work">
            {/* WORK HERO & CATEGORY FILTERS */}
            <section className="row" style={{ gridTemplateColumns: '1.8fr 1fr' }}>
              <div className="cell" style={{ padding: '32px 28px' }}>
                <h1 className="disp xl2">SELECTED<br />WORK.</h1>
                <p className="intro" style={{ marginTop: 16 }}>
                  High-frequency trading terminals, thematic wealth management modules, and multi-tier design systems engineered for active investors.
                </p>
              </div>
              <div className="cell" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
                <div>
                  <span className="lbl">PORTFOLIO INDEX //</span>
                  <p style={{ marginTop: 8, fontSize: 13, textTransform: 'none', color: '#444' }}>
                    Showing <b>{filteredProjects.length}</b> case studies with verified outcome metrics and production mockups.
                  </p>
                </div>
                <div className="filter-row" style={{ marginTop: 16 }}>
                  {['ALL', 'FINTECH', 'DESIGN SYSTEM', 'AI / TOOLS'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-btn ${workFilter === cat ? 'active' : ''}`}
                      onClick={() => setWorkFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* FULL PROJECTS STACK */}
            <section className="stack">
              {filteredProjects.map((p, idx) => (
                <article
                  key={p.id}
                  className={getElemClass(p.id, 'proj')}
                  id={p.id}
                  onClick={(e) => handleAction(p.id, e)}
                >
                  <div className="n">{String(idx + 1).padStart(2, '0')}</div>
                  <div className="t">
                    <div>
                      <b>{p.title}</b>
                      <small>{p.tag || p.category?.toUpperCase() || 'FINTECH'}</small>
                      <p className="prob-line">{p.description}</p>
                      {p.stats && p.stats[2] && (
                        <span className="metric-pill">
                          {p.stats[2].value} {p.stats[2].label}
                        </span>
                      )}
                    </div>
                    {p.stats && p.stats.length > 0 && (
                      <div className="proj-stats">
                        {p.stats.map((s, si) => (
                          <div key={si} className="proj-stat-cell">
                            <span className="proj-stat-val">{s.value}</span>
                            <span className="proj-stat-lbl">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mockup-frame">
                    <img src={p.image || '/editorial/project1.png'} alt={p.title} loading="lazy" />
                  </div>
                </article>
              ))}
            </section>
          </main>

          {renderEditorialCta()}
        </div>

        <p className="ed-foot">© 2026 NAVEEN KUMAR PANDEY</p>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     3. EDITORIAL ABOUT ARTBOARD
     ────────────────────────────────────────────────────────── */
  const renderEditorialAbout = () => {
    return (
      <div className="ed-wrapper" style={{ width: '100%' }}>
        <div className="ed-frame">
          {renderEditorialHeader('about')}

          <main data-page="about">
            {/* ABOUT HERO */}
            <section className="row" style={{ gridTemplateColumns: '1.7fr 1fr' }}>
              <div className="cell hl">
                <h1 className="disp xl2">PRODUCT<br />DESIGNER.</h1>
                <p className="intro">
                  Engineer-turned-designer with 5 years designing high-frequency fintech, options terminals, and multi-tier design systems.
                </p>
                <div className="btns" style={{ marginTop: 14 }}>
                  <a
                    className="btn fill"
                    href="/assets/Naveen_Pandey_CV.pdf"
                    download="Naveen_Pandey_CV.pdf"
                  >
                    DOWNLOAD CV <span aria-hidden="true">↓</span>
                  </a>
                  <a
                    className="btn"
                    href="#work"
                    onClick={(e) => handleAction('about-hero', e, 'work')}
                  >
                    VIEW WORK <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              <div className="stack">
                <div className="portrait-frame" style={{ minHeight: 280 }}>
                  <img
                    src="/assets/hero-photo.jpg"
                    alt="Naveen Pandey"
                    onError={(e) => { e.currentTarget.src = '/assets/me.jpg'; }}
                  />
                  <span className="photo-badge">NAVEEN // PRODUCT DESIGNER</span>
                </div>
                <div className="spec-table">
                  <div className="spec-item">
                    <span className="k">LOCATION</span>
                    <span className="v">Goa, India</span>
                  </div>
                  <div className="spec-item">
                    <span className="k">EXPERIENCE</span>
                    <span className="v">5+ Years (2021 — 2026)</span>
                  </div>
                  <div className="spec-item">
                    <span className="k">AVAILABILITY</span>
                    <span className="v">Open to Full-Time &amp; Contracts</span>
                  </div>
                </div>
              </div>
            </section>

            {/* WHO I AM NARRATIVE */}
            <section className="row" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="cell" style={{ background: 'var(--yellow)', display: 'flex', alignItems: 'center' }}>
                <h2 className="disp h2" style={{ color: 'var(--ink)' }}>WHO<br />I AM.</h2>
              </div>
              <div className="cell" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 15, lineHeight: 1.6, textTransform: 'none', fontWeight: 600, color: '#111' }}>
                  I design data-dense fintech interfaces by eliminating cognitive friction from complex trading workflows and order executions. At Neo Wealth, this systems-first approach lifted active investor conversion from 1.2% to 4.4% across web and mobile.
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.65, textTransform: 'none', color: '#444' }}>
                  With a background in Civil Engineering (B.Tech), I look at digital products as load-bearing structures: data density requires clear structural hierarchy, not superficial decoration. I partner closely with frontend engineers to build scalable token architectures and maintain high-fidelity design QA.
                </p>
              </div>
            </section>

            {/* EDUCATION & CERTIFICATIONS */}
            <section className="two-col">
              <div className="cell" style={{ padding: '24px 28px' }}>
                <span className="lbl">EDUCATION //</span>
                <h3 style={{ fontSize: 18, marginTop: 10, letterSpacing: '.02em' }}>B.TECH IN CIVIL ENGINEERING</h3>
                <p style={{ fontSize: 12, marginTop: 4, color: 'var(--grey)', textTransform: 'none' }}>
                  Babu Banarasi Das University, Lucknow · 2016 — 2020
                </p>
                <p style={{ fontSize: 12, marginTop: 8, textTransform: 'none', color: '#444' }}>
                  Engineering foundation in analytical modeling, rigorous stress calculation, and structural systems.
                </p>
              </div>
              <div className="cell" style={{ padding: '24px 28px' }}>
                <span className="lbl">CERTIFICATIONS //</span>
                <h3 style={{ fontSize: 18, marginTop: 10, letterSpacing: '.02em' }}>UI/UX DESIGN SPECIALIZATION</h3>
                <p style={{ fontSize: 12, marginTop: 4, color: 'var(--grey)', textTransform: 'none' }}>
                  California Institute of the Arts (CalArts / Coursera)
                </p>
                <p style={{ fontSize: 12, marginTop: 8, textTransform: 'none', color: '#444' }}>
                  Formal specialization in interaction design principles, visual hierarchy, and quantitative user testing.
                </p>
              </div>
            </section>

            {/* SKILLS MATRIX (NO ARROWS) */}
            <section className="row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="cell" style={{ padding: '24px' }}>
                <span className="lbl" style={{ color: 'var(--red)' }}>01 // DESIGN</span>
                <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>FIGMA (ADVANCED AUTO-LAYOUT)</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>DESIGN SYSTEMS &amp; TOKENS</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>INTERACTION DESIGN</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>FINANCIAL DATA VISUALIZATION</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>HIGH-FIDELITY PROTOTYPING</li>
                </ul>
              </div>
              <div className="cell" style={{ padding: '24px' }}>
                <span className="lbl" style={{ color: 'var(--ink)' }}>02 // TECHNICAL</span>
                <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>DESIGN QA (IOS &amp; ANDROID)</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>HTML5 / CSS3 / GRID ARCHITECTURE</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>REACT COMPONENT SPECS</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>GIT WORKFLOW &amp; HANDOFF</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>WCAG AAA ACCESSIBILITY AUDITING</li>
                </ul>
              </div>
              <div className="cell" style={{ padding: '24px' }}>
                <span className="lbl" style={{ color: 'var(--grey)' }}>03 // STRATEGY</span>
                <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>UX RESEARCH &amp; USABILITY LABS</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>PRODUCT ROADMAPPING</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>CONVERSION FUNNEL OPTIMIZATION</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>INTERNAL TOOLING SCOPING</li>
                  <li style={{ fontSize: 12, fontWeight: 700 }}>CROSS-FUNCTIONAL LEADERSHIP</li>
                </ul>
              </div>
            </section>
          </main>

          {renderEditorialCta()}
        </div>

        <p className="ed-foot">© 2026 NAVEEN KUMAR PANDEY</p>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     4. EDITORIAL EXPERIENCE ARTBOARD
     ────────────────────────────────────────────────────────── */
  const renderEditorialExperience = () => {
    return (
      <div className="ed-wrapper" style={{ width: '100%' }}>
        <div className="ed-frame">
          {renderEditorialHeader('experience')}

          <main data-page="experience">
            {/* EXPERIENCE HERO */}
            <section
              className={getElemClass('exp-hero-group', 'row exp-hero')}
              id="exp-hero-group"
              style={{ gridTemplateColumns: '1.6fr 1.2fr' }}
              onClick={(e) => handleAction('exp-hero-group', e)}
            >
              <div
                className={getElemClass('exp-headline', 'cell hl')}
                id="exp-headline"
                onClick={(e) => handleAction('exp-headline', e)}
              >
                <h1 className="disp xl2">EXPERIENCE.</h1>
                <p className="intro" style={{ fontSize: 17, lineHeight: 1.5, textTransform: 'none', fontWeight: 500 }}>
                  5 years designing web and mobile products, from stock trading apps to mutual fund modules and wealth dashboards.
                </p>
              </div>
              <div
                className={getElemClass('exp-status-cell', 'cell')}
                id="exp-status-cell"
                style={{
                  background: 'var(--yellow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px'
                }}
                onClick={(e) => handleAction('exp-status-cell', e)}
              >
                <span className="lbl">STATUS</span>
                <div>
                  <h2 className="disp" style={{ font: '400 36px/1.1 var(--disp)', color: 'var(--ink)' }}>
                    OPEN TO ROLES
                  </h2>
                  <p style={{ marginTop: 8, fontSize: 11, fontWeight: 800, color: 'var(--ink)', letterSpacing: '.06em' }}>
                    5 YEARS · 10+ PROJECTS SHIPPED
                  </p>
                </div>
              </div>
            </section>

            {/* TIMELINE ROLES */}
            <section
              className={getElemClass('exp-timeline-group', 'stack')}
              id="exp-timeline-group"
              onClick={(e) => handleAction('exp-timeline-group', e)}
            >
              {/* Row 1: Neo Wealth and Asset Management */}
              <div
                className={getElemClass('exp-row-neo', 'exp-row')}
                id="exp-row-neo"
                onClick={(e) => handleAction('exp-row-neo', e)}
              >
                <div className="exp-left">
                  <b className="exp-date">Dec 2025 – Present</b>
                  <span className="exp-loc">GOA</span>
                  <span className="exp-role">PRODUCT DESIGNER</span>
                </div>
                <div className="exp-detail">
                  <div className="exp-header">
                    <h3 className="exp-company">NEO WEALTH AND ASSET MANAGEMENT</h3>
                    <span className="metric-pill">2 INTERNAL TOOLS</span>
                  </div>
                  <ul className="exp-bullets">
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Trading app UX for Android and iOS.</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Design system across web and mobile.</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Two internal tools: invoicing and an AI chatbot.</span>
                    </li>
                  </ul>
                  <div className="exp-chips">
                    <span className="exp-chip">Figma</span>
                    <span className="exp-chip">Design Systems</span>
                    <span className="exp-chip">Design QA</span>
                    <span className="exp-chip">Interaction Design</span>
                    <span className="exp-chip">UX Research</span>
                    <span className="exp-chip">iOS / Android</span>
                  </div>
                </div>
              </div>

              {/* Row 2: BP Equities */}
              <div
                className={getElemClass('exp-row-bp', 'exp-row')}
                id="exp-row-bp"
                onClick={(e) => handleAction('exp-row-bp', e)}
              >
                <div className="exp-left">
                  <b className="exp-date">Feb 2024 – Dec 2025</b>
                  <span className="exp-loc">MUMBAI</span>
                  <span className="exp-role">PRODUCT DESIGNER</span>
                </div>
                <div className="exp-detail">
                  <div className="exp-header">
                    <h3 className="exp-company">BP EQUITIES</h3>
                    <span className="metric-pill">1.2% → 4.4% CONVERSION</span>
                  </div>
                  <ul className="exp-bullets">
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Designed the Mutual Funds, Option Chain and WealthBasket modules.</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Designed landing pages alongside the product.</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>40K → 61K Instagram followers.</span>
                    </li>
                  </ul>
                  <div className="exp-chips">
                    <span className="exp-chip">Figma</span>
                    <span className="exp-chip">Mutual Funds</span>
                    <span className="exp-chip">Option Chain</span>
                    <span className="exp-chip">WealthBasket</span>
                    <span className="exp-chip">Landing Pages</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Skydreams */}
              <div
                className={getElemClass('exp-row-skydreams', 'exp-row')}
                id="exp-row-skydreams"
                onClick={(e) => handleAction('exp-row-skydreams', e)}
              >
                <div className="exp-left">
                  <b className="exp-date">May 2023 – Jan 2024</b>
                  <span className="exp-loc">MUMBAI</span>
                  <span className="exp-role">PRODUCT DESIGNER</span>
                </div>
                <div className="exp-detail">
                  <div className="exp-header">
                    <h3 className="exp-company">SKYDREAMS</h3>
                    <span className="metric-pill">5 CLIENTS · 100% FIRST-LAUNCH APPROVAL</span>
                  </div>
                  <ul className="exp-bullets">
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Web design for 5 clients.</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Responsive design, prototyping and developer handoff.</span>
                    </li>
                  </ul>
                  <div className="exp-chips">
                    <span className="exp-chip">Figma</span>
                    <span className="exp-chip">Web Design</span>
                    <span className="exp-chip">Responsive Design</span>
                    <span className="exp-chip">Prototyping</span>
                    <span className="exp-chip">Developer Handoff</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Pigeon Edu Technology */}
              <div
                className={getElemClass('exp-row-pigeon', 'exp-row')}
                id="exp-row-pigeon"
                onClick={(e) => handleAction('exp-row-pigeon', e)}
              >
                <div className="exp-left">
                  <b className="exp-date">Nov 2021 – Apr 2023</b>
                  <span className="exp-loc">BENGALURU</span>
                  <span className="exp-role">UI &amp; GRAPHIC DESIGNER</span>
                </div>
                <div className="exp-detail">
                  <div className="exp-header">
                    <h3 className="exp-company">PIGEON EDU TECHNOLOGY</h3>
                    <span className="metric-pill">2,000+ STUDENTS</span>
                  </div>
                  <ul className="exp-bullets">
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Dashboard design.</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Study material design for 2,000+ students.</span>
                    </li>
                  </ul>
                  <div className="exp-chips">
                    <span className="exp-chip">Figma</span>
                    <span className="exp-chip">Adobe Photoshop</span>
                    <span className="exp-chip">Illustrator</span>
                    <span className="exp-chip">Dashboard Design</span>
                    <span className="exp-chip">Study Material Design</span>
                  </div>
                </div>
              </div>

              {/* Row 5: Freelance */}
              <div
                className={getElemClass('exp-row-freelance', 'exp-row')}
                id="exp-row-freelance"
                onClick={(e) => handleAction('exp-row-freelance', e)}
              >
                <div className="exp-left">
                  <b className="exp-date">FREELANCE</b>
                  <span className="exp-role" style={{ marginTop: 2 }}>PRODUCT DESIGNER</span>
                </div>
                <div className="exp-detail">
                  <div className="exp-header">
                    <h3 className="exp-company">FREELANCE</h3>
                    <span className="metric-pill">3 ENGAGEMENTS</span>
                  </div>
                  <ul className="exp-bullets">
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>The Souled Store</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Plus365 (Abu Dhabi)</span>
                    </li>
                    <li className="exp-bullet">
                      <span className="exp-marker" aria-hidden="true" />
                      <span>Key Education Foundation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
        </div>

        <p className="ed-foot">© 2026 · Goa, India</p>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     5. EDITORIAL CONTACT ARTBOARD
     ────────────────────────────────────────────────────────── */
  const renderEditorialContact = () => {
    return (
      <div className="ed-wrapper" style={{ width: '100%' }}>
        <div className="ed-frame">
          {renderEditorialHeader('contact')}

          <main data-page="contact">
            {/* CONTACT HERO */}
            <section
              className={getElemClass('contact-hero-group', 'row contact-hero')}
              id="contact-hero-group"
              onClick={(e) => handleAction('contact-hero-group', e)}
            >
              <div
                className={getElemClass('contact-headline', 'cell hl')}
                id="contact-headline"
                onClick={(e) => handleAction('contact-headline', e)}
              >
                <h1 className="disp xl2">HIRING A FINTECH<br />DESIGNER?</h1>
                <p className="intro" style={{ fontSize: 17, lineHeight: 1.5, textTransform: 'none', fontWeight: 500 }}>
                  Product designer for trading apps, design systems and internal tools. Open to full-time roles and select contracts.
                </p>
              </div>
              <div
                className={getElemClass('contact-open-cell', 'cell contact-yellow-cell')}
                id="contact-open-cell"
                onClick={(e) => handleAction('contact-open-cell', e)}
              >
                <div>
                  <span className="lbl">OPEN TO</span>
                  <h2 className="disp contact-open-hd" style={{ marginTop: 8 }}>
                    OPEN TO FULL-TIME ROLES AND SELECT CONTRACTS.
                  </h2>
                </div>
                <div className="expect-box">
                  <span className="lbl expect-lbl">WHAT TO EXPECT</span>
                  <div className="expect-list">
                    <div className="expect-item">
                      <span className="expect-num">01</span>
                      <span>Reply within 24h</span>
                    </div>
                    <div className="expect-item">
                      <span className="expect-num">02</span>
                      <span>Overlap with EU and US mornings</span>
                    </div>
                    <div className="expect-item">
                      <span className="expect-num">03</span>
                      <span>Open to remote and hybrid</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTACT DETAILS & DISPATCH FORM */}
            <section
              className={getElemClass('contact-body-row', 'row contact-row')}
              id="contact-body-row"
              onClick={(e) => handleAction('contact-body-row', e)}
            >
              <div
                className={getElemClass('contact-channels', 'contact-channels')}
                id="contact-channels"
                onClick={(e) => handleAction('contact-channels', e)}
              >
                <div>
                  <span className="lbl">CONTACT DETAILS</span>
                  <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <small style={{ fontSize: 11, fontWeight: 800, color: 'var(--grey)', letterSpacing: '.08em', display: 'block' }}>EMAIL ADDRESS</small>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                        <a
                          href="mailto:naveen85pandey@gmail.com"
                          style={{ fontSize: 14, fontWeight: 700, textTransform: 'none', wordBreak: 'break-all' }}
                        >
                          naveen85pandey@gmail.com
                        </a>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={handleContactCopy}
                          aria-label="Copy email address"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>{contactCopied || copiedEmail ? 'Copied!' : 'COPY'}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <small style={{ fontSize: 11, fontWeight: 800, color: 'var(--grey)', letterSpacing: '.08em', display: 'block' }}>BASE</small>
                      <p style={{ fontSize: 13, fontWeight: 700, marginTop: 4, textTransform: 'none' }}>
                        Goa, India (UTC +5:30)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="lbl">FIND ME</span>
                  <div className="soc" style={{ marginTop: 10 }}>
                    <a
                      href="https://linkedin.com/in/naveen-pandey"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <span>LINKEDIN</span> <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      href="https://behance.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Behance"
                    >
                      <span>BEHANCE</span> <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      href="https://wa.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                    >
                      <span>WHATSAPP</span> <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE FORM */}
              <div
                className={getElemClass('contact-form-box', 'contact-form-box')}
                id="contact-form-box"
                onClick={(e) => handleAction('contact-form-box', e)}
              >
                <span className="lbl">SEND A MESSAGE</span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onCopyEmail) onCopyEmail();
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <div className="form-group">
                    <label htmlFor="ed-name">NAME OR COMPANY *</label>
                    <input
                      id="ed-name"
                      type="text"
                      className="form-field"
                      placeholder="Your name or company"
                      defaultValue=""
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ed-email">EMAIL *</label>
                    <input
                      id="ed-email"
                      type="email"
                      className="form-field"
                      placeholder="you@company.com"
                      defaultValue=""
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ed-engagement">ENGAGEMENT TYPE (OPTIONAL)</label>
                    <select
                      id="ed-engagement"
                      className="form-field"
                      defaultValue=""
                    >
                      <option value="" disabled>Select engagement type</option>
                      <option value="full-time">Full-time role</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance project</option>
                      <option value="consulting">Consulting</option>
                      <option value="hi">Just saying hi</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ed-msg">MESSAGE *</label>
                    <textarea
                      id="ed-msg"
                      rows={4}
                      className="form-field"
                      placeholder="Tell me about your project"
                      defaultValue=""
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn fill"
                    style={{ justifyContent: 'center', marginTop: 4, width: '100%' }}
                  >
                    SEND MESSAGE <span aria-hidden="true">↗</span>
                  </button>
                  <div className="form-subnote">
                    <p>Sent directly to my inbox</p>
                    <p>
                      Form not working?{' '}
                      <a href="mailto:naveen85pandey@gmail.com" className="form-fallback-link">
                        Email me directly.
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </section>
          </main>
        </div>

        <p className="ed-foot">© 2026 · Goa, India</p>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     COMPOSITE PAGE ARTBOARD DISPATCHER
     Each page in the left Pages panel renders its dedicated artboard.
     ────────────────────────────────────────────────────────── */
  const renderContent = () => {
    switch (frame.id) {
      case 'frame-home':
        return renderEditorialHome();
      case 'frame-work':
        return renderEditorialWork();
      case 'frame-about':
        return renderEditorialAbout();
      case 'frame-experience':
        return renderEditorialExperience();
      case 'frame-contact':
        return renderEditorialContact();
      default:
        return renderEditorialHome();
    }
  };

  const isEdFrame = ['frame-home', 'frame-work', 'frame-about', 'frame-experience', 'frame-contact'].includes(frame.id);

  if (isMobileLayout) {
    return (
      <div
        id={frame.id}
        ref={frameRef}
        className={`df-mobile-frame-section ${isEdFrame ? 'has-ed-frame' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={handleFrameClick}
      >
        {isSelected && !selectedChildId && (
          <SelectionHandles
            width={selectedMeasure && isSelected ? selectedMeasure.w : frameDimensions.w}
            height={selectedMeasure && isSelected ? selectedMeasure.h : frameDimensions.h}
          />
        )}
        <div className={`df-frame-inner mobile-inner ${isEdFrame ? 'has-ed-frame' : ''}`}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`df-canvas-frame-container ${isEdFrame ? 'has-ed-frame' : ''}`}
      style={{
        width: frame.w || 1120,
        marginBottom: 80,
        position: 'relative'
      }}
    >
      {/* Frame label above frame: name left, size right, mono 11px #6B6B6B */}
      <div className="df-frame-header-label font-mono">
        <span className="df-frame-title">{frame.name}</span>
        <span className="df-frame-dims">{frameDimensions.w} × {frameDimensions.h}</span>
      </div>

      {/* Frame Body: white fill, 1px #D0D0D0 border, sharp corners */}
      <div
        ref={frameRef}
        id={frame.id}
        className={`df-canvas-frame ${isEdFrame ? 'has-ed-frame' : ''} ${isSelected ? 'selected' : ''} ${isEntered ? 'entered' : ''}`}
        data-fig-node="frame"
        onClick={handleFrameClick}
        onDoubleClick={handleFrameDoubleClick}
        tabIndex={0}
      >
        {/* Selection outline & 8 decorative handles */}
        {isSelected && !selectedChildId && (
          <SelectionHandles
            width={selectedMeasure && isSelected && !selectedChildId ? selectedMeasure.w : frameDimensions.w}
            height={selectedMeasure && isSelected && !selectedChildId ? selectedMeasure.h : frameDimensions.h}
          />
        )}

        {/* Hint Pill: "Double-click to interact" on first selection */}
        {isSelected && !isEntered && !hasSeenInteractionHint && (
          <div className="df-interact-hint-pill font-mono" aria-live="polite">
            Double-click to interact
          </div>
        )}

        {/* Entered state badge */}
        {isEntered && (
          <div className="df-entered-badge font-mono" aria-live="polite">
            Entered (Esc to exit)
          </div>
        )}

        {/* Real Content Inner Wrapper */}
        <div className={`df-frame-inner ${isEdFrame ? 'has-ed-frame' : ''} ${isEntered ? 'interactive-mode' : 'select-mode'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
