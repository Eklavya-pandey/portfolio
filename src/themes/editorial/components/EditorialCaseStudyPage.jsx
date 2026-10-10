import React, { useEffect, useState } from 'react';
import { editorialAudio } from '../editorialAudio';
import EditorialWireframeScrubber from './EditorialWireframeScrubber';
import { IconClose } from './EditorialIcons';

export default function EditorialCaseStudyPage({
  project,
  allProjects,
  onBack,
  onSelectProject,
  mode,
  toggleMode,
  showToast
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Scroll to top and play audio ONLY when project ID changes
  useEffect(() => {
    editorialAudio.playOpen();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrollProgress(0);
  }, [project?.id]);

  // 2. Scroll Progress & Keyboard Shortcuts
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const current = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack?.();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const handleShare = () => {
    editorialAudio.playSuccess();
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast({
      title: 'LINK COPIED',
      message: `Direct case study link copied to clipboard`
    });
  };

  const handleCopyHex = (hex) => {
    editorialAudio.playSuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex);
    }
    showToast({
      title: 'HEX CODE COPIED',
      message: `${hex} copied to clipboard`
    });
  };

  return (
    <article className="editorial-cs-page">
      {/* Reading Progress Indicator */}
      <div
        className="editorial-reading-progress"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      {/* Sticky Case Study Navigation Bar */}
      <nav className="editorial-cs-sticky-bar">
        <div className="editorial-cs-sticky-left">
          <button
            type="button"
            className="editorial-cs-back-btn"
            onClick={onBack}
            title="Return to Portfolio Overview (Esc)"
          >
            ← ALL WORK
          </button>
          <span className="editorial-cs-divider">/</span>
          <span className="editorial-cs-breadcrumb-id">{project.tag}</span>
          <span className="editorial-cs-divider">/</span>
          <span className="editorial-cs-breadcrumb-title">{project.title}</span>
        </div>

        <div className="editorial-cs-sticky-right">
          <button
            type="button"
            className="editorial-cs-action-btn"
            onClick={handleShare}
            title="Copy direct link to this case study"
          >
            🔗 SHARE
          </button>

          <button
            type="button"
            className="editorial-cs-action-btn"
            onClick={toggleMode}
            title={`Switch to ${mode === 'blueprint' ? 'Paper' : 'Blueprint'} Mode`}
          >
            {mode === 'blueprint' ? '☀️ PAPER' : '🌙 BLUEPRINT'}
          </button>

          <button
            type="button"
            className="editorial-cs-close-btn"
            onClick={onBack}
            title="Close Case Study"
          >
            <IconClose size={12} />
          </button>
        </div>
      </nav>

      <div className="editorial-cs-content-wrap">
        {/* Case Study Hero */}
        <header className="editorial-cs-header">
          <div className="editorial-cs-meta-strip">
            <span className="editorial-card-tag">{project.tag}</span>
            <span className="editorial-cs-index">SPEC NO. 0{currentIndex + 1} // 0{allProjects.length}</span>
            <span className="editorial-cs-status-indicator">● PRODUCTION VERIFIED</span>
          </div>

          <h1 className="editorial-cs-title">{project.title}</h1>
          <p className="editorial-cs-tagline">{project.tagline}</p>

          {/* Quick Specifications Table */}
          <div className="editorial-cs-spec-table">
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">ROLE</span>
              <span className="editorial-cs-spec-val">{project.stats[2]?.val || 'UI/UX Lead'}</span>
            </div>
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">DURATION</span>
              <span className="editorial-cs-spec-val">{project.stats[0]?.val || '3 Months'}</span>
            </div>
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">PLATFORM</span>
              <span className="editorial-cs-spec-val">{project.stats[1]?.val || 'Mobile / Web'}</span>
            </div>
            <div className="editorial-cs-spec-item">
              <span className="editorial-cs-spec-lbl">DELIVERABLES</span>
              <span className="editorial-cs-spec-val">{project.stats[3]?.val || 'Design System'}</span>
            </div>
          </div>
        </header>

        {/* Hero Visual Mockup */}
        <div className="editorial-cs-image-frame">
          <div className="editorial-cs-image-banner">
            <span>HIGH-FIDELITY SCREEN SPECIFICATION // FIGMA PROTOCOL v5.0</span>
            <span>100% SCALE</span>
          </div>
          <img
            src={project.image}
            alt={project.title}
            className="editorial-cs-hero-img"
          />
        </div>

        {/* Measurable Impact Metrics Grid */}
        {project.metrics && (
          <section className="editorial-cs-section">
            <div className="editorial-cs-section-label">
              <span className="editorial-cs-num">01</span>
              <h2 className="editorial-cs-section-heading">Measurable Impact & KPI Results</h2>
            </div>

            <div className="editorial-cs-metrics-grid">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="editorial-cs-metric-card">
                  <span className="editorial-cs-metric-val">{m.val}</span>
                  <span className="editorial-cs-metric-lbl">{m.lbl}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Narrative Deep Dive: Overview, Challenge, Solution */}
        <section className="editorial-cs-section">
          <div className="editorial-cs-section-label">
            <span className="editorial-cs-num">02</span>
            <h2 className="editorial-cs-section-heading">Context & Design Strategy</h2>
          </div>

          <div className="editorial-cs-prose-block">
            <h3 className="editorial-cs-subheading">Executive Overview</h3>
            <p className="editorial-cs-text">{project.overview}</p>
          </div>

          <div className="editorial-cs-comparison-grid">
            <div className="editorial-cs-box challenge-box">
              <div className="editorial-cs-box-header">
                <span className="editorial-cs-box-dot challenge-dot" />
                <h3 className="editorial-cs-box-title">The Challenge & Friction Points</h3>
              </div>
              <p className="editorial-cs-box-desc">{project.challenge}</p>
            </div>

            <div className="editorial-cs-box solution-box">
              <div className="editorial-cs-box-header">
                <span className="editorial-cs-box-dot solution-dot" />
                <h3 className="editorial-cs-box-title">The Engineering & UX Solution</h3>
              </div>
              <p className="editorial-cs-box-desc">{project.solution}</p>
            </div>
          </div>

          {/* Interactive Visual Wireframe Scrubber */}
          <EditorialWireframeScrubber
            wireframeImage={project.image}
            highFiImage={project.image}
            title={`${project.title} // Structural Evolution`}
            wireframeLabel="01 // WIREFRAME ARCHITECTURE"
            highFiLabel="02 // HIGH-FI PRODUCTION UI"
          />
        </section>

        {/* Key Deliverables & Scope */}
        {project.keyDeliverables && (
          <section className="editorial-cs-section">
            <div className="editorial-cs-section-label">
              <span className="editorial-cs-num">03</span>
              <h2 className="editorial-cs-section-heading">Key Deliverables & Shipped Architecture</h2>
            </div>

            <div className="editorial-cs-deliverables-grid">
              {project.keyDeliverables.map((item, idx) => (
                <div key={idx} className="editorial-cs-deliverable-item">
                  <span className="editorial-cs-deliverable-badge">0{idx + 1}</span>
                  <p className="editorial-cs-deliverable-text">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Design System Tokens & Swatches */}
        <section className="editorial-cs-section">
          <div className="editorial-cs-section-label">
            <span className="editorial-cs-num">04</span>
            <h2 className="editorial-cs-section-heading">Design System & Token Architecture</h2>
          </div>

          <div className="editorial-cs-tokens-row">
            <div className="editorial-cs-token-col">
              <span className="editorial-cs-col-title">TECH STACK & TOOLS</span>
              <div className="editorial-cs-stack-pills">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="editorial-cs-stack-pill">{tech}</span>
                ))}
              </div>
            </div>

            {project.colorPalette && (
              <div className="editorial-cs-token-col">
                <span className="editorial-cs-col-title">COLOR TOKENS (CLICK TO COPY)</span>
                <div className="editorial-cs-palette-grid">
                  {project.colorPalette.map((hex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="editorial-cs-swatch-card"
                      onClick={() => handleCopyHex(hex)}
                      title={`Copy ${hex}`}
                    >
                      <div className="editorial-cs-swatch-circle" style={{ backgroundColor: hex }} />
                      <span className="editorial-cs-swatch-hex">{hex}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pagination & Next Project Link */}
        <section className="editorial-cs-pagination">
          <button
            type="button"
            className="editorial-cs-nav-card prev-card"
            onClick={() => onSelectProject(prevProject)}
          >
            <span className="editorial-cs-nav-dir">← PREVIOUS CASE STUDY</span>
            <span className="editorial-cs-nav-name">{prevProject.title}</span>
            <span className="editorial-cs-nav-tag">{prevProject.tag}</span>
          </button>

          <button
            type="button"
            className="editorial-cs-nav-card next-card"
            onClick={() => onSelectProject(nextProject)}
          >
            <span className="editorial-cs-nav-dir">NEXT CASE STUDY →</span>
            <span className="editorial-cs-nav-name">{nextProject.title}</span>
            <span className="editorial-cs-nav-tag">{nextProject.tag}</span>
          </button>
        </section>

        {/* Bottom CTA */}
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
                onClick={onBack}
              >
                ← Back to All Projects
              </button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
