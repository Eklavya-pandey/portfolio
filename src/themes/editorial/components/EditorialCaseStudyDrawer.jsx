import React, { useEffect } from 'react';
import { editorialAudio } from '../editorialAudio';
import EditorialWireframeScrubber from './EditorialWireframeScrubber';
import { EditorialCornerTicks, IconClose } from './EditorialIcons';

export default function EditorialCaseStudyDrawer({
  project,
  allProjects,
  onClose,
  onSelectProject,
  onExpandToFullPage
}) {
  useEffect(() => {
    if (!project) return;

    editorialAudio.playOpen();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        editorialAudio.playClose();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const handleClose = () => {
    editorialAudio.playClose();
    onClose();
  };

  const handleNavigate = (targetProject) => {
    editorialAudio.playClick();
    onSelectProject(targetProject);
  };

  return (
    <div className="editorial-drawer-overlay" onClick={handleClose}>
      <aside
        className="editorial-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <EditorialCornerTicks />
        {/* Drawer Header */}
        <div className="editorial-drawer-header">
          <div className="editorial-drawer-header-left">
            <span className="editorial-card-tag">{project.tag}</span>
            <span className="editorial-drawer-index">0{currentIndex + 1} / 0{allProjects.length}</span>
          </div>

          <div className="editorial-drawer-header-actions">
            {onExpandToFullPage && (
              <button
                type="button"
                className="editorial-drawer-expand-btn"
                onClick={() => {
                  editorialAudio.playClick();
                  onExpandToFullPage(project);
                }}
                title="Expand to full page case study view"
              >
                <span>⛶ FULL PAGE</span>
              </button>
            )}

            <button
              type="button"
              className="editorial-drawer-close-btn"
              onClick={handleClose}
              aria-label="Close Case Study"
            >
              <span>ESC</span> <IconClose size={12} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="editorial-drawer-body">
          {/* Title & Tagline */}
          <div className="editorial-drawer-hero">
            <h2 id="drawer-title" className="editorial-drawer-title">{project.title}</h2>
            <p className="editorial-drawer-tagline">{project.tagline}</p>
          </div>

          {/* Hero Image Showcase */}
          <div className="editorial-drawer-image-wrap">
            <img
              src={project.image}
              alt={project.title}
              className="editorial-drawer-image"
            />
            <div className="editorial-drawer-image-badge">
              <span>● PRODUCTION UI</span>
            </div>
          </div>

          {/* Impact Metrics Grid */}
          {project.metrics && (
            <div className="editorial-drawer-section">
              <div className="editorial-section-tag">
                <span className="editorial-section-indicator" />
                <span className="editorial-section-title">Measurable Impact</span>
              </div>
              <div className="editorial-drawer-metrics-grid">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="editorial-drawer-metric-card">
                    <span className="editorial-drawer-metric-val">{m.val}</span>
                    <span className="editorial-drawer-metric-lbl">{m.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview & Context */}
          <div className="editorial-drawer-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">Overview</span>
            </div>
            <p className="editorial-drawer-p">{project.overview}</p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="editorial-drawer-section">
            <div className="editorial-drawer-cs-grid">
              <div className="editorial-drawer-cs-box challenge">
                <div className="editorial-drawer-cs-header">
                  <span className="editorial-drawer-cs-dot challenge-dot" />
                  <span className="editorial-drawer-cs-title">The Challenge</span>
                </div>
                <p className="editorial-drawer-cs-desc">{project.challenge}</p>
              </div>

              <div className="editorial-drawer-cs-box solution">
                <div className="editorial-drawer-cs-header">
                  <span className="editorial-drawer-cs-dot solution-dot" />
                  <span className="editorial-drawer-cs-title">The Solution</span>
                </div>
                <p className="editorial-drawer-cs-desc">{project.solution}</p>
              </div>
            </div>
          </div>

          {/* Interactive Wireframe Scrubber */}
          <div className="editorial-drawer-section">
            <EditorialWireframeScrubber
              wireframeImage={project.image}
              highFiImage={project.image}
              title={`${project.title} // Interactive Wireframe`}
              wireframeLabel="WIREFRAME"
              highFiLabel="PRODUCTION"
            />
          </div>

          {/* Key Deliverables */}
          {project.keyDeliverables && (
            <div className="editorial-drawer-section">
              <div className="editorial-section-tag">
                <span className="editorial-section-indicator" />
                <span className="editorial-section-title">Key Deliverables</span>
              </div>
              <ul className="editorial-drawer-list">
                {project.keyDeliverables.map((item, idx) => (
                  <li key={idx} className="editorial-drawer-list-item">
                    <span className="editorial-drawer-bullet">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack & Design Tokens */}
          <div className="editorial-drawer-section">
            <div className="editorial-section-tag">
              <span className="editorial-section-indicator" />
              <span className="editorial-section-title">Stack & System Tokens</span>
            </div>
            <div className="editorial-drawer-tags">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="editorial-drawer-tag-pill">{tech}</span>
              ))}
            </div>

            {project.colorPalette && (
              <div className="editorial-drawer-palette">
                <span className="editorial-drawer-palette-lbl">Color Tokens:</span>
                <div className="editorial-drawer-swatches">
                  {project.colorPalette.map((color, idx) => (
                    <div
                      key={idx}
                      className="editorial-drawer-swatch"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions & Navigation */}
        <div className="editorial-drawer-footer-wrap">
          {onExpandToFullPage && (
            <button
              type="button"
              className="editorial-drawer-full-cta"
              onClick={() => {
                editorialAudio.playClick();
                onExpandToFullPage(project);
              }}
            >
              <span>⛶ OPEN FULL-PAGE CASE STUDY &amp; KPI SPECS →</span>
            </button>
          )}

          <div className="editorial-drawer-footer">
            <button
              type="button"
              className="editorial-drawer-nav-btn"
              onClick={() => handleNavigate(prevProject)}
            >
              ← PREV
            </button>

            <a
              href="mailto:naveen.pandey.design@gmail.com?subject=Inquiry%20regarding%20Case%20Study"
              className="editorial-drawer-cta-btn"
            >
              INQUIRE ABOUT THIS PROJECT
            </a>

            <button
              type="button"
              className="editorial-drawer-nav-btn"
              onClick={() => handleNavigate(nextProject)}
            >
              NEXT →
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
