import React, { useState, useMemo } from 'react';
import { EDITORIAL_CONTENT } from '../editorialContent';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, CadCrossBox, IconArrow } from '../components/EditorialIcons';
import EditorialTiltCard from '../components/EditorialTiltCard';
import EditorialScrambleText from '../components/EditorialScrambleText';
import { EditorialLink } from '../editorialRouter';
import { PROJECTS as WORK_PROJECTS } from './EditorialWorkPage';

const PORTRAIT_SRC = '/assets/me.jpg';

export default function EditorialHomePage({
  projects = WORK_PROJECTS,
  onOpenCaseStudy,
  onSelectProject,
  onCopyEmail,
  isAudioEnabled
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Teaser displays top 3 projects from WORK_PROJECTS with imagePosition support
  const featuredProjects = useMemo(() => {
    // Strictly use the PROJECTS array from Work page per specification
    const sourceList = WORK_PROJECTS;
    return sourceList.slice(0, 3).map((p, idx) => ({
      ...p,
      imagePosition: p.imagePosition || (idx === 1 || p.image === '/editorial/project2.png' ? 'left top' : 'center top')
    }));
  }, []);

  const handleCopyEmail = () => {
    editorialAudio.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('naveen85pandey@gmail.com');
    }
    if (onCopyEmail) onCopyEmail();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleOpenProject = (project) => {
    if (onOpenCaseStudy) {
      onOpenCaseStudy(project);
    } else if (onSelectProject) {
      onSelectProject(project);
    }
  };

  return (
    <>
      {/* 1. Hero Section (Two-Column Technical Layout) */}
      <section id="about-section" className="editorial-hero">
        <EditorialCornerTicks />
        {/* Left Column: Pill, Title, Subtext, Location, CTAs, Grouped Stats Row */}
        <div className="editorial-hero-left">
          <div className="editorial-hero-left-top">
            <div className="editorial-hero-tagline-wrap">
              <CadCrossBox size={24} className="editorial-hero-cad-box" />
              <span className="editorial-hero-status-pill">{EDITORIAL_CONTENT.hero.pill}</span>
            </div>

            <h1 className="editorial-hero-title">
              <EditorialScrambleText
                triggerOnMount={true}
                triggerOnHover={true}
                speed={24}
                playAudio={isAudioEnabled}
              >
                {EDITORIAL_CONTENT.hero.headline}
              </EditorialScrambleText>
            </h1>

            <p className="editorial-hero-desc">
              &gt; Designing interfaces for data-heavy products, from trading dashboards to AI assistants. Turning complex systems into clear, usable experiences.
              <span className="editorial-cursor-blink" aria-hidden="true">_</span>
            </p>

            <p className="editorial-hero-current-location">
              Currently at Neo Wealth and Asset Management Pvt. Ltd., Goa
            </p>

            <div className="editorial-hero-actions">
              <EditorialLink
                href="work.html"
                className="editorial-cta-btn"
                data-text="VIEW WORK →"
                onClick={() => editorialAudio.playClick()}
              >
                <span>View work</span>
                <IconArrow size={11} />
              </EditorialLink>

              <a
                href="/assets/Naveen_Pandey_CV.pdf"
                download="Naveen_Pandey_CV.pdf"
                className="editorial-hero-secondary-btn"
                data-text="DOWNLOAD CV"
                onClick={() => editorialAudio.playClick()}
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

        {/* Right Column: Framed Design Tool Visual Card */}
        <div className="editorial-hero-right">
          <div className="editorial-hero-card">
            <EditorialCornerTicks />
            <div className="editorial-hero-card-topbar">
              <span className="editorial-hero-card-tag">{EDITORIAL_CONTENT.hero.photo.tag}</span>
              <span className="editorial-hero-card-scale">{EDITORIAL_CONTENT.hero.photo.scale}</span>
            </div>

            <div className="editorial-hero-card-image-wrap">
              <img
                src={PORTRAIT_SRC}
                alt="Naveen Pandey - Product Designer"
                className="editorial-hero-card-img"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/assets/hero-photo.jpg';
                }}
              />
            </div>

            <div className="editorial-hero-card-bottombar">
              <span className="editorial-hero-card-name">{EDITORIAL_CONTENT.hero.photo.name}</span>
              <span className="editorial-hero-card-loc">{EDITORIAL_CONTENT.hero.photo.loc}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 01 / FEATURED_WORK (Teaser Section) */}
      <section id="featured-work" className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              {EDITORIAL_CONTENT.sections.featuredWork}
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        {/* 3 Featured Project Cards */}
        <div className="editorial-project-grid teaser-grid">
          {featuredProjects.map((project) => (
            <EditorialTiltCard
              key={project.id}
              className="editorial-project-tilt-box"
              maxTilt={5}
            >
              <article
                id={project.id}
                className={`editorial-project-card ${project.caseUrl ? 'interactive has-case-url' : ''}`}
                tabIndex={project.caseUrl ? 0 : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target === e.currentTarget && project.caseUrl) {
                    handleOpenProject(project);
                  }
                }}
              >
                <EditorialCornerTicks />
                <div className="editorial-card-header">
                  <span className="editorial-card-tag">
                    {project.category ? project.category.toUpperCase().replace('-', ' ') : project.tag}
                  </span>
                  <div className="editorial-card-header-actions">
                    <button
                      type="button"
                      className="editorial-card-preview-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        editorialAudio.playClick();
                        if (onSelectProject) {
                          onSelectProject(project);
                        } else {
                          handleOpenProject(project);
                        }
                      }}
                      aria-label={`Preview ${project.title}`}
                    >
                      PREVIEW <IconArrow size={9} />
                    </button>
                    {project.caseUrl ? (
                      <span
                        className="editorial-card-full-btn"
                        aria-hidden="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          editorialAudio.playClick();
                          handleOpenProject(project);
                        }}
                      >
                        VIEW CASE STUDY <IconArrow size={9} />
                      </span>
                    ) : (
                      <span className="editorial-card-coming-soon">Case study coming soon</span>
                    )}
                  </div>
                </div>

                <div className="editorial-card-image-wrap">
                  <img
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    className="editorial-card-image"
                    style={{ objectPosition: project.imagePosition || 'center top' }}
                    loading="lazy"
                    width="800"
                    height="450"
                  />
                </div>

                <div className="editorial-card-title-block">
                  {project.company && project.year ? (
                    <div className="editorial-card-company-year">
                      {project.company} · {project.year}
                    </div>
                  ) : null}

                  <h3 className="editorial-card-title">
                    {project.caseUrl ? (
                      <a
                        href={project.caseUrl}
                        className="editorial-card-title-link"
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey) {
                            e.preventDefault();
                            handleOpenProject(project);
                          }
                        }}
                      >
                        <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                          {project.title}
                        </EditorialScrambleText>
                      </a>
                    ) : (
                      <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                        {project.title}
                      </EditorialScrambleText>
                    )}
                  </h3>
                  <p className="editorial-card-tagline">{project.description || project.tagline}</p>
                </div>

                <div className="editorial-stats-grid">
                  <div className="editorial-stats-row">
                    <div className="editorial-stat-box border-right headline-stat">
                      <span className="editorial-stat-val">{project.stats[0]?.value ?? project.stats[0]?.val}</span>
                      <span className="editorial-stat-lbl">{project.stats[0]?.label ?? project.stats[0]?.lbl}</span>
                    </div>
                    <div className="editorial-stat-box">
                      <span className="editorial-stat-val">{project.stats[1]?.value ?? project.stats[1]?.val}</span>
                      <span className="editorial-stat-lbl">{project.stats[1]?.label ?? project.stats[1]?.lbl}</span>
                    </div>
                  </div>

                  <div className="editorial-stats-row row-bottom">
                    <div className="editorial-stat-box border-right">
                      <span className="editorial-stat-val">{project.stats[2]?.value ?? project.stats[2]?.val}</span>
                      <span className="editorial-stat-lbl">{project.stats[2]?.label ?? project.stats[2]?.lbl}</span>
                    </div>
                    <div className="editorial-stat-box">
                      <span className="editorial-stat-val">{project.stats[3]?.value ?? project.stats[3]?.val}</span>
                      <span className="editorial-stat-lbl">{project.stats[3]?.label ?? project.stats[3]?.lbl}</span>
                    </div>
                  </div>
                </div>
              </article>
            </EditorialTiltCard>
          ))}
        </div>

        {/* Section Footer: VIEW ALL WORK → (Outline Button) */}
        <div className="editorial-section-footer-action">
          <EditorialLink
            href="work.html"
            className="editorial-view-all-btn"
            data-text="VIEW ALL WORK →"
            onClick={() => editorialAudio.playClick()}
          >
            <span className="editorial-btn-frame" aria-hidden="true" />
            <span>VIEW ALL WORK</span>
            <IconArrow size={12} />
          </EditorialLink>
        </div>
      </section>

      {/* 3. 02 / ABOUT_ME (Teaser Section) */}
      <section id="about-teaser-section" className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              02 / ABOUT_ME
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <div className="editorial-about-teaser-card">
          <EditorialCornerTicks />
          <div className="editorial-about-teaser-left">
            <div className="editorial-about-teaser-header">
              <CadCrossBox size={22} className="editorial-about-teaser-icon" />
              <span className="editorial-about-teaser-tag">WHO I AM</span>
            </div>
            <p className="editorial-about-teaser-bio">
              Engineer-turned-designer. B.Tech in Civil Engineering, now 5 years designing digital products. At Neo I lead UX for a stock-trading app, own design QA across Android and iOS, and built a cross-platform design system.
            </p>
            {/* Keyword skill chips */}
            <div className="editorial-about-teaser-chips">
              {['FIGMA', 'INTERACTION DESIGN', 'DESIGN QA', 'UX RESEARCH', 'PRODUCT STRATEGY'].map((keyword) => (
                <span key={keyword} className="editorial-tag-chip">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="editorial-about-teaser-right">
            <EditorialLink
              href="about.html"
              className="editorial-hero-secondary-btn"
              data-text="MORE ABOUT ME →"
              onClick={() => editorialAudio.playClick()}
            >
              <span className="editorial-btn-frame" aria-hidden="true" />
              <span>MORE ABOUT ME</span>
              <IconArrow size={12} />
            </EditorialLink>
          </div>
        </div>
      </section>

      {/* 4. 03 / PLAYGROUND (Teaser: 3 preview cards) */}
      <section id="playground-section" className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              03 / PLAYGROUND
            </EditorialScrambleText>
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

        {/* 3 Compact Playground Preview Cards Equal-Height Grid */}
        <div className="editorial-playground-grid three-cards">
          {/* Card 1: Font Pairing Studio */}
          <div className="editorial-playground-card">
            <EditorialCornerTicks />
            <div className="editorial-pg-card-top">
              <span className="editorial-pg-tag">01 // TYPOGRAPHY</span>
              <span className="editorial-pg-key-badge">F</span>
            </div>

            <div className="editorial-pg-card-body">
              <h3 className="editorial-pg-title">
                <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                  Font Pairing Studio
                </EditorialScrambleText>
              </h3>
              <p className="editorial-pg-copy">
                Try 6 type pairings across this site in real time.
              </p>
              <div className="editorial-pg-specs">
                <span className="editorial-pg-spec-pill">6 PAIRINGS</span>
                <span className="editorial-pg-spec-pill">LIVE PREVIEW</span>
              </div>
            </div>

            <div className="editorial-pg-footer">
              <EditorialLink
                href="playground.html#font-swapper"
                className="editorial-pg-link-btn"
                onClick={() => editorialAudio.playClick()}
              >
                <span>OPEN TOOL</span>
                <IconArrow size={11} className="editorial-pg-arrow" />
              </EditorialLink>
            </div>
          </div>

          {/* Card 2: Speed Typing Benchmark */}
          <div className="editorial-playground-card">
            <EditorialCornerTicks />
            <div className="editorial-pg-card-top">
              <span className="editorial-pg-tag">02 // PERFORMANCE</span>
              <span className="editorial-pg-key-badge">T</span>
            </div>

            <div className="editorial-pg-card-body">
              <h3 className="editorial-pg-title">
                <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                  Speed Typing Benchmark
                </EditorialScrambleText>
              </h3>
              <p className="editorial-pg-copy">
                Check your typing speed and accuracy.
              </p>
              <div className="editorial-pg-specs">
                <span className="editorial-pg-spec-pill">15S / 30S / 60S</span>
                <span className="editorial-pg-spec-pill">WPM + ACCURACY</span>
              </div>
            </div>

            <div className="editorial-pg-footer">
              <EditorialLink
                href="playground.html#typing-test"
                className="editorial-pg-link-btn"
                onClick={() => editorialAudio.playClick()}
              >
                <span>START TEST</span>
                <IconArrow size={11} className="editorial-pg-arrow" />
              </EditorialLink>
            </div>
          </div>

          {/* Card 3: Terminal ASCII Art Studio */}
          <div className="editorial-playground-card">
            <EditorialCornerTicks />
            <div className="editorial-pg-card-top">
              <span className="editorial-pg-tag">03 // CANVAS</span>
              <span className="editorial-pg-key-badge">A</span>
            </div>

            <div className="editorial-pg-card-body">
              <h3 className="editorial-pg-title">
                <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                  Terminal ASCII Art Studio
                </EditorialScrambleText>
              </h3>
              <p className="editorial-pg-copy">
                Turn any image into ASCII art, right in your browser.
              </p>
              <div className="editorial-pg-specs">
                <span className="editorial-pg-spec-pill">4 CHARSETS</span>
                <span className="editorial-pg-spec-pill">PNG + TXT EXPORT</span>
              </div>
            </div>

            <div className="editorial-pg-footer">
              <EditorialLink
                href="playground.html#ascii-studio"
                className="editorial-pg-link-btn"
                onClick={() => editorialAudio.playClick()}
              >
                <span>OPEN STUDIO</span>
                <IconArrow size={11} className="editorial-pg-arrow" />
              </EditorialLink>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer / Contact CTA */}
      <section id="cta-section" className="editorial-bottom-cta">
        <EditorialCornerTicks />
        <div className="editorial-cta-left">
          <div className="editorial-section-tag" style={{ marginBottom: 12 }}>
            <CadCrossBox size={24} className="editorial-cta-cad-box" />
            <span className="editorial-section-indicator" />
            <span className="editorial-section-title">
              <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                04 / CONTACT
              </EditorialScrambleText>
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
          <EditorialLink
            href="/contact.html"
            className="editorial-cta-btn"
            data-text="GO TO CONTACT →"
            onClick={() => editorialAudio.playClick()}
          >
            <span>Go to contact</span>
            <IconArrow size={11} />
          </EditorialLink>

          <button
            type="button"
            className="editorial-cta-copy-btn"
            data-text="COPY EMAIL ADDRESS"
            onClick={handleCopyEmail}
            aria-live="polite"
            aria-label="Copy email address"
          >
            <span className="editorial-btn-frame" aria-hidden="true" />
            {copiedEmail ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span>{copiedEmail ? 'Copied!' : 'COPY EMAIL ADDRESS'}</span>
          </button>
        </div>
      </section>
    </>
  );
}
