import React, { useEffect, useState } from 'react';
import { editorialAudio } from '../editorialAudio';
import { IconClose } from './EditorialIcons';
import CaseStudyContent from '../../../components/CaseStudyContent';

/**
 * Editorial Case Study Page
 * Wraps the single-source CaseStudyContent with Editorial chrome,
 * reading progress bar, share actions, and theme styling.
 */
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

  useEffect(() => {
    editorialAudio?.playOpen?.();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrollProgress(0);
  }, [project?.id]);

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

  const slug = project.slug || project.id || 'onestepprint';

  const handleShare = () => {
    editorialAudio?.playSuccess?.();
    const url = window.location.href;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    showToast?.({
      title: 'LINK COPIED',
      message: 'Direct case study link copied to clipboard'
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
            title="Return to Work (Esc)"
          >
            ← ALL WORK
          </button>
          <span className="editorial-cs-divider">/</span>
          <span className="editorial-cs-breadcrumb-id">{project.tag || 'CASE STUDY'}</span>
          <span className="editorial-cs-divider">/</span>
          <span className="editorial-cs-breadcrumb-nav">
            <a
              href="/work.html"
              onClick={(e) => {
                e.preventDefault();
                onBack?.();
              }}
              className="editorial-cs-breadcrumb-link"
              title="Back to Work"
            >
              Work
            </a>
            <span className="editorial-cs-breadcrumb-sep"> &gt; </span>
            <span className="editorial-cs-breadcrumb-current">
              {project.id === 'onestepprint' ? 'OneStepPrint website redesign' : project.title}
            </span>
          </span>
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
        <CaseStudyContent
          slug={slug}
          project={project}
          allProjects={allProjects}
          onBack={onBack}
          onSelectProject={onSelectProject}
          themeClass="editorial-cs-theme"
          backHref="/work.html"
        />
      </div>
    </article>
  );
}
