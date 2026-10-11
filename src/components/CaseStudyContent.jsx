import React, { useState } from 'react';
import { CASE_STUDIES, PROJECTS, getProjectBySlug } from '../data/projectsData';

/**
 * Universal Fixed Case Study Component
 * RULE: One source of truth. Every theme renders from that data.
 * The content, copy, and section order are identical everywhere.
 * Styling and chrome change per theme:
 *  - 'editorial': Futuristic technical editorial / blueprint theme
 *  - 'win98': Authentic Windows 98 desktop document & beveled window chrome
 *  - 'designfile': Authentic Figma canvas artboard, Inter typography & inspector styling
 */
export default function CaseStudyContent({
  slug = 'onestepprint',
  project: passedProject,
  allProjects = PROJECTS,
  onBack,
  onSelectProject,
  theme = 'editorial',
  themeClass = 'editorial-cs-theme',
  backHref = '/work.html',
  showTopBackBar = false
}) {
  const [heroAvailable, setHeroAvailable] = useState(true);
  const [videoAvailable, setVideoAvailable] = useState(true);

  // Fetch single source data
  const data = CASE_STUDIES[slug] || {};
  const project =
    passedProject ||
    getProjectBySlug(slug) ||
    allProjects?.find((p) => p.id === slug || p.slug === slug) ||
    {};

  // Current index & next/prev navigation
  const currentId = project.id || project.slug || slug;
  const projectList = allProjects && allProjects.length > 0 ? allProjects : PROJECTS;
  const currentIndex = projectList.findIndex((p) => p.id === currentId || p.slug === currentId);
  const validIndex = currentIndex >= 0 ? currentIndex : 0;
  const prevProject =
    validIndex > 0 ? projectList[validIndex - 1] : projectList[projectList.length - 1];
  const nextProject =
    validIndex < projectList.length - 1 ? projectList[validIndex + 1] : projectList[0];

  // Dynamic continuous section numbering counter
  let sectionCounter = 1;

  // Title & Header info
  const title = data.title || project.title || 'Case Study';
  const tag = project.tag || (data.header?.meta?.services?.includes('UI') ? 'WEB' : 'CASE STUDY');
  const tagline = project.tagline || data.challenge?.text || project.description || '';

  // Quick specifications table values - sentence case
  const specRole =
    data.header?.meta?.services || project.services || project.role || 'UI design and prototyping';
  const specDuration =
    data.header?.meta?.date || project.date || project.stats?.[0]?.val || '3 August 2023';
  const specPlatform =
    data.header?.meta?.client || project.client || project.stats?.[1]?.val || 'Viraj Patel';
  const specDeliverables =
    data.outcome?.text ? 'UI design and prototyping' : (project.stats?.[3]?.val || 'Design System');

  // KPI Metrics list (only rendered if verified metrics exist)
  const metricsList = project.metrics || data.metrics || null;
  const hasMetrics = Array.isArray(metricsList) && metricsList.length > 0;

  // Process / Deliverables list
  const rawProcess = data.process?.items || project.keyDeliverables || [];
  const deliverablesList = Array.isArray(rawProcess) ? rawProcess : [];
  const hasDeliverables = deliverablesList.length > 0;

  // Page Labels for Production Pages Showcase
  const pageLabels = [
    'PAGE 01 / HOMEPAGE',
    'PAGE 02 / PRODUCTS',
    'PAGE 03 / CAPABILITIES'
  ];

  const handleBackClick = (e) => {
    if (onBack) {
      e.preventDefault();
      onBack();
    }
  };

  const heroImageSrc =
    data.header?.heroImage ||
    project.image ||
    project.cover ||
    '/assets/projects/onestepprint/hero.jpg';

  const effectiveTheme =
    theme === 'win98' || themeClass?.includes('win98')
      ? 'win98'
      : theme === 'designfile' || themeClass?.includes('designfile')
      ? 'designfile'
      : 'editorial';

  /* ══════════════════════════════════════════════════════════════
     1. FUTURISTIC (EDITORIAL) THEME RENDERER
     ══════════════════════════════════════════════════════════════ */
  const renderEditorial = () => {
    let edSectionCount = 1;
    return (
      <article className={`case-study-article-root ${themeClass}`}>
        {/* Top Back to Work Link (Keyboard focusable plain text link with arrow) */}
        <div className="editorial-cs-top-back-wrap">
          <a
            href={backHref}
            onClick={handleBackClick}
            className="editorial-cs-back-text-link"
            tabIndex={0}
            aria-label="Back to Work"
          >
            ← Back to Work
          </a>
        </div>

        {/* 1. CASE STUDY HERO HEADER */}
        <header className="editorial-cs-header">
          <div className="editorial-cs-meta-strip">
            <span className="editorial-card-tag">{tag}</span>
            <span className="editorial-cs-index">
              SPEC NO. 0{validIndex + 1} // 0{projectList.length}
            </span>
            <span className="editorial-cs-status-indicator">● PRODUCTION VERIFIED</span>
          </div>

          <h1 className="editorial-cs-title">{title}</h1>
          {tagline && <p className="editorial-cs-tagline">{tagline}</p>}

          {/* 4-Column Quick Specification Table (Values formatted in sentence case) */}
          <div className="editorial-cs-spec-table">
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">ROLE</span>
              <span className="editorial-cs-spec-val">{specRole}</span>
            </div>
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">DATE / DURATION</span>
              <span className="editorial-cs-spec-val">{specDuration}</span>
            </div>
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">CLIENT / PLATFORM</span>
              <span className="editorial-cs-spec-val">{specPlatform}</span>
            </div>
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">DELIVERABLES</span>
              <span className="editorial-cs-spec-val">{specDeliverables}</span>
            </div>
          </div>
        </header>

        {/* 2. HERO VISUAL MOCKUP FRAME */}
        <div className="editorial-cs-image-frame">
          <div className="editorial-cs-image-banner">
            <span>HD PRODUCTION SCREEN (DESKTOP UX TERMINAL 1920 X 1080 RES)</span>
            <span>100% SCALE</span>
          </div>
          {heroAvailable && (
            <picture>
              {data.header?.heroWebp && (
                <source srcSet={data.header.heroWebp} type="image/webp" />
              )}
              <img
                src={heroImageSrc}
                alt={data.header?.heroAlt || project.imageAlt || `${title} hero showcase`}
                className="editorial-cs-hero-img"
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: data.header?.heroPosition || project.imagePosition || 'center top',
                  display: 'block'
                }}
                onError={() => setHeroAvailable(false)}
              />
            </picture>
          )}
        </div>

        {/* 3. MEASURABLE IMPACT & KPI RESULTS (Section rendered only if metrics exist) */}
        {hasMetrics && (
          <section className="editorial-cs-section">
            <div className="editorial-cs-section-label">
              <span className="editorial-cs-num">0{edSectionCount++}</span>
              <h2 className="editorial-cs-section-heading">Measurable Impact & KPI Results</h2>
            </div>

            <div className="editorial-cs-metrics-grid">
              {metricsList.map((m, idx) => (
                <div key={idx} className="editorial-cs-metric-card">
                  <span className="editorial-cs-metric-val">{m.val}</span>
                  <span className="editorial-cs-metric-lbl">{m.lbl}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. CONTEXT & DESIGN STRATEGY */}
        <section className="editorial-cs-section">
          <div className="editorial-cs-section-label">
            <span className="editorial-cs-num">0{edSectionCount++}</span>
            <h2 className="editorial-cs-section-heading">Context & Design Strategy</h2>
          </div>

          {/* Executive Overview */}
          {(data.brief?.text || project.overview || project.description) && (
            <div className="editorial-cs-prose-block">
              <h3 className="editorial-cs-subheading">EXECUTIVE OVERVIEW</h3>
              <p className="editorial-cs-text">
                {data.brief?.text || project.overview || project.description}
              </p>
            </div>
          )}

          {/* 2-Column Comparison Grid: Challenge & Friction vs Architecture & Solution */}
          <div className="editorial-cs-comparison-grid">
            {/* Challenge Box */}
            <div className="editorial-cs-box challenge-box">
              <div className="editorial-cs-box-header">
                <span className="editorial-cs-box-dot challenge-dot" />
                <h3 className="editorial-cs-box-title">The Challenge & Friction Points</h3>
              </div>
              {(data.challenge?.text || project.challenge) && (
                <p className="editorial-cs-box-desc">
                  {data.challenge?.text || project.challenge}
                </p>
              )}
              {data.problem?.items && data.problem.items.length > 0 && (
                <ul className="editorial-cs-box-bullets challenge-bullets">
                  {data.problem.items.map((item, idx) => (
                    <li key={idx} className="editorial-cs-bullet-item">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Architecture / Solution Box */}
            <div className="editorial-cs-box solution-box">
              <div className="editorial-cs-box-header">
                <span className="editorial-cs-box-dot solution-dot" />
                <h3 className="editorial-cs-box-title">The Architecture & Solution</h3>
              </div>
              {(data.concept?.intro || project.solution) && (
                <p className="editorial-cs-box-desc">
                  {data.concept?.intro || project.solution}
                </p>
              )}
              {data.audience?.items && data.audience.items.length > 0 && (
                <ul className="editorial-cs-box-bullets solution-bullets">
                  {data.audience.items.map((item, idx) => (
                    <li key={idx} className="editorial-cs-bullet-item">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Concept Architecture: Scroll as a print job */}
          {data.concept && (
            <div className="editorial-cs-concept-block">
              <span className="editorial-cs-concept-tag">CONCEPT:</span>
              <h3 className="editorial-cs-concept-title">
                {data.concept.title || 'Scroll as a print job.'}
              </h3>
              <p className="editorial-cs-concept-intro">
                {data.concept.intro || 'Four CMYK color dots travel through the site from start to finish.'}
              </p>

              <div className="editorial-cs-concept-cards-list">
                {data.concept.steps?.map((step) => (
                  <div key={step.num} className="editorial-cs-concept-step-card">
                    <span className="editorial-cs-concept-step-num">{step.num}</span>
                    <div className="editorial-cs-concept-step-content">
                      <strong className="editorial-cs-concept-step-title">{step.title}</strong>{' '}
                      <span className="editorial-cs-concept-step-desc">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Screen Demo / Video Frame */}
          {videoAvailable && data.video?.src && (
            <div className="editorial-cs-image-frame editorial-cs-video-frame">
              <div className="editorial-cs-image-banner">
                <span>
                  INTERACTIVE SCREEN DEMO //{' '}
                  {data.video.caption?.toUpperCase() || 'SCROLL WALKTHROUGH & PROTOTYPE'}
                </span>
                <span>100% SCALE</span>
              </div>
              <video
                className="editorial-cs-video"
                controls
                muted
                playsInline
                preload="metadata"
                poster={data.video.poster || data.header?.heroImage}
                onError={() => setVideoAvailable(false)}
              >
                <source src={data.video.src} type="video/mp4" />
              </video>
            </div>
          )}
        </section>

        {/* 5. KEY DELIVERABLES & SHIPPED ARCHITECTURE */}
        {hasDeliverables && (
          <section className="editorial-cs-section">
            <div className="editorial-cs-section-label">
              <span className="editorial-cs-num">0{edSectionCount++}</span>
              <h2 className="editorial-cs-section-heading">Key Deliverables & Shipped Architecture</h2>
            </div>

            <div className="editorial-cs-deliverables-grid">
              {deliverablesList.map((item, idx) => (
                <div key={idx} className="editorial-cs-deliverable-item">
                  <span className="editorial-cs-deliverable-badge">0{idx + 1}</span>
                  <div className="editorial-cs-deliverable-content">
                    {item.phase && (
                      <strong className="editorial-cs-deliverable-phase">{item.phase}: </strong>
                    )}
                    <span className="editorial-cs-deliverable-text">{item.detail || item}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PRODUCTION PAGES & DESIGN SHOWCASE */}
        {Array.isArray(data.pages) && data.pages.length > 0 && (
          <section className="editorial-cs-section">
            <div className="editorial-cs-section-label">
              <span className="editorial-cs-num">0{edSectionCount++}</span>
              <h2 className="editorial-cs-section-heading">Production Pages & Design Showcase</h2>
            </div>

            <div className="editorial-cs-pages-grid">
              {data.pages.map((page, idx) => {
                const label = pageLabels[idx] || `PAGE 0${idx + 1} / ${page.caption?.toUpperCase()}`;
                return (
                  <div key={idx} className="editorial-cs-page-card">
                    <div className="editorial-cs-page-banner">
                      <span className="editorial-cs-page-banner-label">{label}</span>
                      <span>100% SCALE</span>
                    </div>
                    <img
                      src={page.src}
                      alt={label}
                      loading="lazy"
                      className="editorial-cs-page-img"
                    />
                    <div className="editorial-cs-page-footer">
                      <span className="editorial-cs-page-caption">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. OUTCOME & KEY TAKEAWAYS */}
        {(data.outcome || data.takeaways) && (
          <section className="editorial-cs-section">
            <div className="editorial-cs-section-label">
              <span className="editorial-cs-num">0{edSectionCount++}</span>
              <h2 className="editorial-cs-section-heading">Outcome & Key Takeaways</h2>
            </div>

            {data.outcome && (
              <div className="editorial-cs-outcome-card">
                <span className="editorial-cs-outcome-badge">VERIFIED OUTCOME</span>
                <p className="editorial-cs-outcome-text">{data.outcome.text}</p>
              </div>
            )}

            {data.takeaways?.items && data.takeaways.items.length > 0 && (
              <div className="editorial-cs-takeaways-grid">
                {data.takeaways.items.map((item, idx) => (
                  <div key={idx} className="editorial-cs-takeaway-card">
                    <span className="editorial-cs-takeaway-num">0{idx + 1}</span>
                    <p className="editorial-cs-takeaway-text">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 8. PAGINATION & NAVIGATION */}
        {prevProject && nextProject && (
          <section className="editorial-cs-pagination">
            <button
              type="button"
              className="editorial-cs-nav-card prev-card"
              onClick={() => onSelectProject?.(prevProject)}
            >
              <span className="editorial-cs-nav-dir">← PREVIOUS CASE STUDY</span>
              <span className="editorial-cs-nav-name">{prevProject.title}</span>
              <span className="editorial-cs-nav-tag">{prevProject.tag || 'CASE STUDY'}</span>
            </button>

            <button
              type="button"
              className="editorial-cs-nav-card next-card"
              onClick={() => onSelectProject?.(nextProject)}
            >
              <span className="editorial-cs-nav-dir">NEXT CASE STUDY →</span>
              <span className="editorial-cs-nav-name">{nextProject.title}</span>
              <span className="editorial-cs-nav-tag">{nextProject.tag || 'CASE STUDY'}</span>
            </button>
          </section>
        )}

        {/* 9. BOTTOM CALL TO ACTION */}
        <section className="editorial-bottom-cta">
          <div className="editorial-cta-content">
            <span className="editorial-cta-label">● INITIATE DIALOGUE</span>
            <h2 className="editorial-cta-headline">
              LET'S BUILD COMPLEX<br />PRODUCTS USABLE.
            </h2>
            <div className="editorial-cta-actions">
              <a
                href="mailto:naveen.pandey.design@gmail.com?subject=Project%20Inquiry%20from%20Portfolio"
                className="editorial-cta-btn"
                data-text="Inquire About Project"
              >
                Inquire About Project
              </a>
              <button
                type="button"
                className="editorial-cs-back-home-btn"
                onClick={handleBackClick}
              >
                ← Back to All Projects
              </button>
            </div>
          </div>
        </section>
      </article>
    );
  };

  /* ══════════════════════════════════════════════════════════════
     2. WINDOWS 98 THEME RENDERER
     ══════════════════════════════════════════════════════════════ */
  const renderWin98 = () => {
    return (
      <div
        className="win98-cs-root"
        style={{
          background: '#FFFFFF',
          color: '#000000',
          fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
          padding: '20px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: '100%'
        }}
      >
        {/* Top Retro Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
          }}
        >
          <button
            type="button"
            onClick={handleBackClick}
            className="win98-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#C0C0C0',
              borderTop: '2px solid #FFF',
              borderLeft: '2px solid #FFF',
              borderRight: '2px solid #000',
              borderBottom: '2px solid #000',
              padding: '3px 12px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: 'none'
            }}
          >
            [ &lt; Back to Work ]
          </button>
          <span style={{ fontSize: '10px', color: '#808080', fontFamily: 'monospace' }}>
            C:\PORTFOLIO\WORK\ONESTEPPRINT.DOC
          </span>
        </div>

        {/* Header & Badges */}
        <div>
          <div
            style={{
              padding: '2px 8px',
              background: '#C0C0C0',
              boxShadow: '-1px -1px 0px 1px white, 1px 1px 0px rgba(0, 0, 0, 0.40)',
              display: 'inline-block',
              fontSize: '9px',
              fontWeight: 700,
              color: '#000080',
              letterSpacing: '1px',
              marginBottom: '8px'
            }}
          >
            {tag} // PORTFOLIO CASE STUDY
          </div>

          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: '24px',
              fontWeight: 700,
              color: 'black',
              letterSpacing: '1px',
              fontFamily: 'inherit'
            }}
          >
            {title}
          </h1>

          {tagline && (
            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '12px',
                color: '#555555',
                lineHeight: '18px',
                maxWidth: '680px'
              }}
            >
              {tagline}
            </p>
          )}

          {/* 4-Column Specification Sheet (Win98 Fieldset) */}
          <fieldset
            style={{
              border: '2px groove #C0C0C0',
              padding: '12px 16px',
              margin: 0,
              background: '#ECE9D8'
            }}
          >
            <legend
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#000080',
                padding: '0 4px'
              }}
            >
              PROJECT SPECIFICATIONS
            </legend>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#808080' }}>ROLE</div>
                <div style={{ fontSize: '11px', color: 'black', marginTop: '2px' }}>{specRole}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#808080' }}>DATE</div>
                <div style={{ fontSize: '11px', color: 'black', marginTop: '2px' }}>{specDuration}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#808080' }}>CLIENT</div>
                <div style={{ fontSize: '11px', color: 'black', marginTop: '2px' }}>{specPlatform}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#808080' }}>DELIVERABLES</div>
                <div style={{ fontSize: '11px', color: 'black', marginTop: '2px' }}>{specDeliverables}</div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Hero Banner Inset Frame */}
        <div
          style={{
            boxShadow: '1px 1px 0px 1px rgba(0, 0, 0, 0.40) inset, -1px -1px 0px white inset',
            background: '#DFDFDF',
            padding: '3px'
          }}
        >
          <div
            style={{
              background: '#000080',
              color: '#FFFFFF',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '3px'
            }}
          >
            <span>HERO_BANNER.JPG (1600 × 900)</span>
            <span>100% SCALE</span>
          </div>
          <img
            src={heroImageSrc}
            alt={`${title} hero`}
            style={{
              width: '100%',
              display: 'block',
              maxHeight: '440px',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* 01 // CONTEXT & DESIGN STRATEGY */}
        <fieldset
          style={{
            border: '2px groove #C0C0C0',
            padding: '16px',
            margin: 0
          }}
        >
          <legend
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#000080',
              padding: '0 6px'
            }}
          >
            01 // CONTEXT &amp; DESIGN STRATEGY
          </legend>

          {/* Executive Overview */}
          {(data.brief?.text || project.overview) && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#808080', marginBottom: '4px' }}>
                BRIEF / EXECUTIVE OVERVIEW
              </div>
              <p style={{ margin: 0, fontSize: '11px', lineHeight: '18px', color: 'black' }}>
                {data.brief?.text || project.overview}
              </p>
            </div>
          )}

          {/* 2-Column Problem & Architecture */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              marginBottom: '16px'
            }}
          >
            {/* Left: Challenge */}
            <div
              style={{
                background: '#F8F8F8',
                border: '1px solid #808080',
                padding: '12px'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#800000', marginBottom: '6px' }}>
                CHALLENGE &amp; FRICTION POINTS
              </div>
              {(data.challenge?.text || project.challenge) && (
                <p style={{ fontSize: '11px', lineHeight: '16px', margin: '0 0 8px 0' }}>
                  {data.challenge?.text || project.challenge}
                </p>
              )}
              {data.problem?.items && data.problem.items.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: '18px' }}>
                  {data.problem.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right: Architecture & Audience */}
            <div
              style={{
                background: '#F8F8F8',
                border: '1px solid #808080',
                padding: '12px'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#000080', marginBottom: '6px' }}>
                THE ARCHITECTURE &amp; AUDIENCE
              </div>
              {(data.concept?.intro || project.solution) && (
                <p style={{ fontSize: '11px', lineHeight: '16px', margin: '0 0 8px 0' }}>
                  {data.concept?.intro || project.solution}
                </p>
              )}
              {data.audience?.items && data.audience.items.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: '18px' }}>
                  {data.audience.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Concept Architecture: Scroll as a print job */}
          {data.concept && (
            <div
              style={{
                background: '#ECE9D8',
                border: '1px solid #808080',
                padding: '14px',
                marginTop: '12px'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#000080', marginBottom: '4px' }}>
                CONCEPT: SCROLL AS A PRINT JOB
              </div>
              <p style={{ fontSize: '11px', color: '#444', margin: '0 0 12px 0' }}>
                {data.concept.intro}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {data.concept.steps?.map((step) => (
                  <div
                    key={step.num}
                    style={{
                      background: '#FFFFFF',
                      borderTop: '1px solid #FFF',
                      borderLeft: '1px solid #FFF',
                      borderRight: '1px solid #808080',
                      borderBottom: '1px solid #808080',
                      padding: '8px 12px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'baseline'
                    }}
                  >
                    <span style={{ color: '#000080', fontWeight: 'bold', fontSize: '12px' }}>
                      [{step.num}]
                    </span>
                    <span style={{ fontSize: '11px' }}>
                      <strong>{step.title}</strong> {step.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Walkthrough (if present) */}
          {videoAvailable && data.video?.src && (
            <div
              style={{
                marginTop: '14px',
                boxShadow: '1px 1px 0px 1px rgba(0, 0, 0, 0.40) inset, -1px -1px 0px white inset',
                background: '#DFDFDF',
                padding: '3px'
              }}
            >
              <div
                style={{
                  background: '#000080',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px'
                }}
              >
                <span>DEMO.MP4 - WINDOWS MEDIA PLAYER</span>
                <span>WALKTHROUGH</span>
              </div>
              <video
                controls
                muted
                playsInline
                preload="metadata"
                poster={data.video.poster || data.header?.heroImage}
                style={{ width: '100%', display: 'block', maxHeight: '360px', background: '#000' }}
                onError={() => setVideoAvailable(false)}
              >
                <source src={data.video.src} type="video/mp4" />
              </video>
            </div>
          )}
        </fieldset>

        {/* 02 // KEY DELIVERABLES & SHIPPED ARCHITECTURE */}
        {hasDeliverables && (
          <fieldset
            style={{
              border: '2px groove #C0C0C0',
              padding: '16px',
              margin: 0
            }}
          >
            <legend
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000080',
                padding: '0 6px'
              }}
            >
              02 // KEY DELIVERABLES &amp; SHIPPED ARCHITECTURE
            </legend>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}
            >
              {deliverablesList.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ECE9D8',
                    borderTop: '2px solid #FFF',
                    borderLeft: '2px solid #FFF',
                    borderRight: '2px solid #808080',
                    borderBottom: '2px solid #808080',
                    padding: '10px'
                  }}
                >
                  <div style={{ color: '#000080', fontWeight: 'bold', fontSize: '12px', marginBottom: '2px' }}>
                    0{idx + 1}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>
                    {item.phase}
                  </div>
                  <div style={{ fontSize: '10px', lineHeight: '15px', color: '#333' }}>
                    {item.detail || item}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        )}

        {/* 03 // PRODUCTION PAGES & DESIGN SHOWCASE */}
        {Array.isArray(data.pages) && data.pages.length > 0 && (
          <fieldset
            style={{
              border: '2px groove #C0C0C0',
              padding: '16px',
              margin: 0
            }}
          >
            <legend
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000080',
                padding: '0 6px'
              }}
            >
              03 // PRODUCTION PAGES &amp; DESIGN SHOWCASE
            </legend>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.pages.map((page, idx) => {
                const label = pageLabels[idx] || `PAGE 0${idx + 1} / ${page.caption?.toUpperCase()}`;
                return (
                  <div
                    key={idx}
                    style={{
                      boxShadow: '1px 1px 0px 1px rgba(0, 0, 0, 0.40) inset, -1px -1px 0px white inset',
                      background: '#DFDFDF',
                      padding: '3px'
                    }}
                  >
                    <div
                      style={{
                        background: '#000080',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '3px'
                      }}
                    >
                      <span>{label}</span>
                      <span>100% SCALE</span>
                    </div>
                    <img
                      src={page.src}
                      alt={label}
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* 04 // OUTCOME & KEY TAKEAWAYS */}
        {(data.outcome || data.takeaways) && (
          <fieldset
            style={{
              border: '2px groove #C0C0C0',
              padding: '16px',
              margin: 0
            }}
          >
            <legend
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000080',
                padding: '0 6px'
              }}
            >
              04 // OUTCOME &amp; KEY TAKEAWAYS
            </legend>

            {data.outcome && (
              <div
                style={{
                  background: '#FFFFE1',
                  border: '1px solid #808080',
                  padding: '10px 14px',
                  marginBottom: '12px'
                }}
              >
                <strong style={{ color: '#000080', fontSize: '10px' }}>VERIFIED OUTCOME: </strong>
                <span style={{ fontSize: '11px' }}>{data.outcome.text}</span>
              </div>
            )}

            {data.takeaways?.items && data.takeaways.items.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px'
                }}
              >
                {data.takeaways.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #808080',
                      padding: '10px'
                    }}
                  >
                    <div style={{ color: '#000080', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>
                      0{idx + 1}
                    </div>
                    <div style={{ fontSize: '10px', lineHeight: '15px' }}>{item}</div>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        )}

        {/* Bottom Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid rgba(0, 0, 0, 0.15)'
          }}
        >
          <button
            type="button"
            onClick={handleBackClick}
            className="win98-btn"
            style={{
              background: '#C0C0C0',
              borderTop: '2px solid #FFF',
              borderLeft: '2px solid #FFF',
              borderRight: '2px solid #000',
              borderBottom: '2px solid #000',
              padding: '5px 16px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: 'none'
            }}
          >
            [ &lt; Back to all Projects ]
          </button>
          <span style={{ fontSize: '10px', color: '#808080' }}>
            OneStepPrint website redesign · Case Study
          </span>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════════
     3. DESIGN FILE (FIGMA) THEME RENDERER
     ══════════════════════════════════════════════════════════════ */
  const renderDesignFile = () => {
    return (
      <div
        className="designfile-cs-artboard"
        style={{
          width: '100%',
          maxWidth: '1040px',
          margin: '0 auto',
          background: '#FFFFFF',
          color: '#111827',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: '36px 44px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Top Figma Breadcrumb & Action Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span
              onClick={handleBackClick}
              style={{ color: '#0D99FF', cursor: 'pointer', fontWeight: 500 }}
            >
              Work
            </span>
            <span style={{ color: '#9CA3AF' }}>/</span>
            <span style={{ color: '#111827', fontWeight: 600 }}>{title}</span>
          </div>

          <button
            type="button"
            onClick={handleBackClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease'
            }}
          >
            ← Back to Work
          </button>
        </div>

        {/* Header & Title */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 8px',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#1D4ED8',
              letterSpacing: '0.04em',
              marginBottom: '10px'
            }}
          >
            {tag}
          </div>

          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            {title}
          </h1>

          {tagline && (
            <p
              style={{
                margin: '0 0 20px 0',
                fontSize: '15px',
                color: '#6B7280',
                lineHeight: 1.6,
                maxWidth: '720px'
              }}
            >
              {tagline}
            </p>
          )}

          {/* Properties Inspector Box (4-Column Figma Auto-Layout) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '16px 20px'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                SERVICES
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>
                {specRole}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                DATE
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>
                {specDuration}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                CLIENT
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>
                {specPlatform}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                DELIVERABLES
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>
                {specDeliverables}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Banner Frame */}
        <div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#6B7280',
              marginBottom: '6px'
            }}
          >
            # Hero Banner — 1440 × 800
          </div>
          <div
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#F3F4F6'
            }}
          >
            <img
              src={heroImageSrc}
              alt={`${title} hero showcase`}
              style={{
                width: '100%',
                display: 'block',
                maxHeight: '480px',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>

        {/* 01 // CONTEXT & DESIGN STRATEGY */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0D99FF', fontWeight: 600 }}>
              01 //
            </span>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              Context &amp; Design Strategy
            </h2>
          </div>

          {/* Executive Overview */}
          {(data.brief?.text || project.overview) && (
            <div
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '18px 20px',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px'
                }}
              >
                EXECUTIVE OVERVIEW
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#374151' }}>
                {data.brief?.text || project.overview}
              </p>
            </div>
          )}

          {/* 2-Column Comparison Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            {/* Left: Challenge */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderLeft: '3px solid #EF4444',
                borderRadius: '8px',
                padding: '18px'
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                The Challenge &amp; Friction Points
              </h3>
              {(data.challenge?.text || project.challenge) && (
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#4B5563', margin: '0 0 10px 0' }}>
                  {data.challenge?.text || project.challenge}
                </p>
              )}
              {data.problem?.items && data.problem.items.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#374151'
                  }}
                >
                  {data.problem.items.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right: Architecture & Audience */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderLeft: '3px solid #0D99FF',
                borderRadius: '8px',
                padding: '18px'
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                The Architecture &amp; Audience
              </h3>
              {(data.concept?.intro || project.solution) && (
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#4B5563', margin: '0 0 10px 0' }}>
                  {data.concept?.intro || project.solution}
                </p>
              )}
              {data.audience?.items && data.audience.items.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#374151'
                  }}
                >
                  {data.audience.items.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Concept Architecture: Scroll as a print job */}
          {data.concept && (
            <div
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: '#EFF6FF',
                    color: '#0D99FF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  CONCEPT
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#111827' }}>
                  {data.concept.title || 'Scroll as a print job.'}
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: '#4B5563', margin: '0 0 16px 0' }}>
                {data.concept.intro}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}
              >
                {data.concept.steps?.map((step) => (
                  <div
                    key={step.num}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#EFF6FF',
                        color: '#0D99FF',
                        fontSize: '11px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {step.num}
                    </span>
                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                      <strong style={{ color: '#111827' }}>{step.title}</strong>{' '}
                      <span style={{ color: '#4B5563' }}>{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Walkthrough (if present) */}
          {videoAvailable && data.video?.src && (
            <div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#6B7280',
                  marginBottom: '6px'
                }}
              >
                # Video Walkthrough — 1280 × 720
              </div>
              <div
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#000000'
                }}
              >
                <video
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster={data.video.poster || data.header?.heroImage}
                  style={{ width: '100%', display: 'block', maxHeight: '420px' }}
                  onError={() => setVideoAvailable(false)}
                >
                  <source src={data.video.src} type="video/mp4" />
                </video>
              </div>
            </div>
          )}
        </div>

        {/* 02 // KEY DELIVERABLES & SHIPPED ARCHITECTURE */}
        {hasDeliverables && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0D99FF', fontWeight: 600 }}>
                02 //
              </span>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}
              >
                Key Deliverables &amp; Shipped Architecture
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px'
              }}
            >
              {deliverablesList.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <span
                    style={{
                      background: '#EFF6FF',
                      color: '#0D99FF',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    {item.phase}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#4B5563' }}>
                    {item.detail || item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 03 // PRODUCTION PAGES & DESIGN SHOWCASE */}
        {Array.isArray(data.pages) && data.pages.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0D99FF', fontWeight: 600 }}>
                03 //
              </span>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}
              >
                Production Pages &amp; Design Showcase
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {data.pages.map((page, idx) => {
                const label = pageLabels[idx] || `PAGE 0${idx + 1} / ${page.caption?.toUpperCase()}`;
                return (
                  <div key={idx}>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: '#6B7280',
                        marginBottom: '6px'
                      }}
                    >
                      # {label}
                    </div>
                    <div
                      style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#F3F4F6'
                      }}
                    >
                      <img
                        src={page.src}
                        alt={label}
                        loading="lazy"
                        style={{ width: '100%', display: 'block' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 04 // OUTCOME & KEY TAKEAWAYS */}
        {(data.outcome || data.takeaways) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0D99FF', fontWeight: 600 }}>
                04 //
              </span>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}
              >
                Outcome &amp; Key Takeaways
              </h2>
            </div>

            {data.outcome && (
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  padding: '18px 20px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span
                  style={{
                    background: '#DCFCE7',
                    color: '#15803D',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  OUTCOME
                </span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#166534' }}>
                  {data.outcome.text}
                </span>
              </div>
            )}

            {data.takeaways?.items && data.takeaways.items.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px'
                }}
              >
                {data.takeaways.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <span
                      style={{
                        background: '#EFF6FF',
                        color: '#0D99FF',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#374151' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #E5E7EB'
          }}
        >
          <button
            type="button"
            onClick={handleBackClick}
            style={{
              background: '#0D99FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease'
            }}
          >
            ← Back to All Projects
          </button>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
            OneStepPrint website redesign · Case Study
          </span>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════════
     THEME DISPATCHER
     ══════════════════════════════════════════════════════════════ */
  if (effectiveTheme === 'win98') {
    return renderWin98();
  }
  if (effectiveTheme === 'designfile') {
    return renderDesignFile();
  }
  return renderEditorial();
}
