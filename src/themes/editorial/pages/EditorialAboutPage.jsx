import React, { useState } from 'react';
import { EXPERIENCES, FREELANCE_ROLES, EDUCATION, CERTIFICATIONS, SKILL_GROUPS } from '../editorialData';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, CadCrossBox, IconArrow } from '../components/EditorialIcons';
import EditorialScrambleText from '../components/EditorialScrambleText';
import { EditorialLink } from '../editorialRouter';

const PORTRAIT_SRC = '/assets/me.jpg';

export default function EditorialAboutPage() {
  // Default state: only the first (most recent) role is expanded. All other roles are collapsed.
  const [expandedExps, setExpandedExps] = useState({ 0: true });
  const [isFreelanceExpanded, setIsFreelanceExpanded] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleExp = (idx) => {
    editorialAudio.playClick();
    setExpandedExps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleFreelance = () => {
    editorialAudio.playClick();
    setIsFreelanceExpanded(prev => !prev);
  };

  const handleCopyEmail = () => {
    editorialAudio.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('naveen85pandey@gmail.com');
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="editorial-page-container editorial-about-page-container">
      {/* 1. Page Hero */}
      <section className="editorial-page-hero">
        <EditorialCornerTicks />
        <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
          <CadCrossBox size={24} className="editorial-hero-cad-box" />
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={true} triggerOnHover={true} speed={22}>
              02 / ABOUT_ME
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <h1 className="editorial-page-headline">
          PRODUCT DESIGNER.
        </h1>
        <p className="editorial-page-lead" style={{ fontSize: '18px', color: '#2B2B2A', lineHeight: 1.6, maxWidth: '780px' }}>
          5 years designing web and mobile products, from stock trading apps to mutual fund modules and wealth dashboards.
        </p>

        {/* Hero CTAs: primary "Download CV" + secondary "View work" */}
        <div className="editorial-about-hero-actions">
          <a
            href="/assets/Naveen_Pandey_CV.pdf"
            download="Naveen_Pandey_CV.pdf"
            className="editorial-cta-btn"
            data-text="DOWNLOAD CV"
            onClick={() => editorialAudio.playClick()}
            aria-label="Download CV"
          >
            <span>DOWNLOAD CV</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>

          <EditorialLink
            href="/work.html"
            className="editorial-hero-secondary-btn"
            data-text="VIEW WORK →"
            onClick={() => editorialAudio.playClick()}
          >
            <span className="editorial-btn-frame" aria-hidden="true" />
            <span>VIEW WORK</span>
            <IconArrow size={11} />
          </EditorialLink>
        </div>
      </section>

      {/* 2. WHO I AM Section */}
      <section className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              WHO I AM
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <div className="editorial-whoiam-grid">
          {/* Left Column: 3 Paragraphs (max 65ch) & Specs Key-Value Grid */}
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

            <div className="editorial-whoiam-specs-grid">
              <div className="editorial-whoiam-spec-item">
                <span className="editorial-whoiam-spec-lbl">LOCATION</span>
                <span className="editorial-whoiam-spec-val">Goa, India (Remote &amp; Hybrid)</span>
              </div>
              <div className="editorial-whoiam-spec-item">
                <span className="editorial-whoiam-spec-lbl">DOMAIN</span>
                <span className="editorial-whoiam-spec-val">Fintech, trading apps, internal tools</span>
              </div>
              <div className="editorial-whoiam-spec-item">
                <span className="editorial-whoiam-spec-lbl">FOCUS</span>
                <span className="editorial-whoiam-spec-val">Interaction design, design systems, design QA</span>
              </div>
              <div className="editorial-whoiam-spec-item">
                <span className="editorial-whoiam-spec-lbl">AVAILABILITY</span>
                <span className="editorial-whoiam-spec-val">Full-time roles and select contracts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Portrait Photo in Blueprint Frame (4:5 Ratio) */}
          <div className="editorial-whoiam-right">
            <div className="editorial-portrait-frame">
              <EditorialCornerTicks />
              <div className="editorial-portrait-inner">
                <img
                  src={PORTRAIT_SRC}
                  alt="Portrait of Naveen Pandey"
                  className="editorial-portrait-img"
                  loading="lazy"
                />
              </div>
              <div className="editorial-portrait-caption">
                <span className="editorial-portrait-caption-tag">//</span>
                <span>PHOTO_PLACEHOLDER</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE Section */}
      <section id="experience-section" className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              EXPERIENCE
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <div className="editorial-list">
          {EXPERIENCES.map((exp, idx) => {
            const isExpanded = !!expandedExps[idx];
            return (
              <div key={exp.id || exp.company} className="editorial-exp-accordion-item">
                <button
                  type="button"
                  className={`editorial-exp-header-btn ${isExpanded ? 'is-open' : ''}`}
                  onClick={() => toggleExp(idx)}
                  aria-expanded={isExpanded}
                  aria-controls={`exp-panel-${idx}`}
                  id={`exp-header-${idx}`}
                >
                  <div className="editorial-exp-row-top">
                    <div className="editorial-exp-title-col">
                      <div className="editorial-exp-title-group">
                        <span className="editorial-exp-role">{exp.role}</span>
                        <span className="editorial-exp-sep">·</span>
                        <span className="editorial-exp-company">{exp.company}</span>
                        <span className="editorial-exp-loc">· {exp.location}</span>
                      </div>
                    </div>

                    <div className="editorial-exp-right-col">
                      {!isExpanded && exp.collapsedMetric && (
                        <span className="editorial-exp-collapsed-metric" aria-label={`Key metric: ${exp.collapsedMetric}`}>
                          {exp.collapsedMetric}
                        </span>
                      )}
                      <span className="editorial-date-pill">{exp.period}</span>
                      <span className="editorial-exp-chevron" aria-hidden="true">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                  </div>

                  <p className="editorial-exp-summary">
                    {exp.summary}
                  </p>
                </button>

                {/* Expandable Impact Panel with Smooth Height Transition */}
                <div
                  id={`exp-panel-${idx}`}
                  role="region"
                  aria-labelledby={`exp-header-${idx}`}
                  className={`editorial-exp-accordion-collapse ${isExpanded ? 'is-expanded' : ''}`}
                >
                  <div className="editorial-exp-accordion-inner">
                    <div className="editorial-exp-impact-panel">
                      {/* Metric Cards */}
                      <div className="editorial-exp-chips-row">
                        {exp.metricCards.map((m, mIdx) => (
                          <div key={mIdx} className="editorial-exp-chip">
                            <span className="editorial-exp-chip-val">{m.val}</span>
                            <span className="editorial-exp-chip-lbl">{m.lbl}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bullets */}
                      <div className="editorial-exp-highlights">
                        <ul className="editorial-exp-list">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="editorial-exp-list-bullet">
                              <span className="editorial-drawer-bullet">→</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Chips & Related Work Link */}
                      <div className="editorial-exp-bottom-row">
                        <div className="editorial-exp-tools-row">
                          {exp.chips.map((chip, cIdx) => (
                            <span key={cIdx} className="editorial-tag-chip">{chip}</span>
                          ))}
                        </div>

                        {exp.hasRelatedWork && (
                          <EditorialLink
                            href="/work.html"
                            className="editorial-exp-work-link"
                            onClick={() => editorialAudio.playClick()}
                          >
                            <span>View related work</span>
                            <IconArrow size={10} />
                          </EditorialLink>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Freelance Compact Collapsed Group */}
          <div className="editorial-exp-accordion-item editorial-freelance-item">
            <button
              type="button"
              className={`editorial-exp-header-btn ${isFreelanceExpanded ? 'is-open' : ''}`}
              onClick={toggleFreelance}
              aria-expanded={isFreelanceExpanded}
              aria-controls="exp-panel-freelance"
              id="exp-header-freelance"
            >
              <div className="editorial-exp-row-top">
                <div className="editorial-exp-title-col">
                  <div className="editorial-exp-title-group">
                    <span className="editorial-exp-role">Freelance &amp; Select Contracts</span>
                  </div>
                </div>

                <div className="editorial-exp-right-col">
                  {!isFreelanceExpanded && (
                    <span className="editorial-exp-collapsed-metric" aria-label="Key metric: 3 engagements">
                      3 engagements
                    </span>
                  )}
                  <span className="editorial-date-pill">2023 – 2024</span>
                  <span className="editorial-exp-chevron" aria-hidden="true">
                    {isFreelanceExpanded ? '−' : '+'}
                  </span>
                </div>
              </div>

              <p className="editorial-exp-summary">
                The Souled Store, Plus365 (Abu Dhabi) and Key Education Foundation.
              </p>
            </button>

            <div
              id="exp-panel-freelance"
              role="region"
              aria-labelledby="exp-header-freelance"
              className={`editorial-exp-accordion-collapse ${isFreelanceExpanded ? 'is-expanded' : ''}`}
            >
              <div className="editorial-exp-accordion-inner">
                <div className="editorial-exp-impact-panel">
                  <div className="editorial-freelance-list">
                    {FREELANCE_ROLES.map((fRole, fIdx) => (
                      <div key={fIdx} className="editorial-freelance-row">
                        <div className="editorial-freelance-meta">
                          <strong className="editorial-freelance-role">{fRole.role}</strong>
                          <span className="editorial-exp-sep">·</span>
                          <span className="editorial-exp-company">{fRole.company}</span>
                          <span className="editorial-exp-loc">· {fRole.location}</span>
                          <span className="editorial-exp-sep">·</span>
                          <span className="editorial-freelance-period">{fRole.period}</span>
                        </div>
                        <p className="editorial-freelance-details">{fRole.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EDUCATION Section */}
      <section className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              EDUCATION
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <div className="editorial-edu-card">
          <EditorialCornerTicks />
          <div className="editorial-edu-row">
            <div className="editorial-edu-left">
              <span className="editorial-edu-degree">{EDUCATION.degree}</span>
              <span className="editorial-edu-school">{EDUCATION.institution}</span>
            </div>
            <div className="editorial-edu-right">
              <span className="editorial-date-pill">{EDUCATION.period}</span>
            </div>
          </div>
          <div className="editorial-edu-divider" />
          <p className="editorial-edu-line">
            {EDUCATION.note}
          </p>
        </div>
      </section>

      {/* 5. CERTIFICATIONS Section */}
      <section className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              CERTIFICATIONS
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <div className="editorial-certs-chips-container">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert} className="editorial-cert-badge-pill">
              <span className="editorial-cert-badge-dot">✓</span>
              <span>{cert}</span>
            </div>
          ))}
        </div>
        <p className="editorial-certs-note">
          Need verification? Reach me on{' '}
          <a
            href="https://linkedin.com/in/naveen-pandey85/"
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-inline-link"
          >
            LinkedIn
          </a>.
        </p>
      </section>

      {/* 6. SKILLS Matrix */}
      <section className="editorial-section">
        <EditorialCornerTicks />
        <div className="editorial-section-tag">
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
              SKILLS
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <div className="editorial-skills-container">
          <div className="editorial-skills-grid">
            {SKILL_GROUPS.map((group) => (
              <div key={group.category} className="editorial-skill-group-card">
                <EditorialCornerTicks />
                <h3 className="editorial-skill-group-title">{group.category}</h3>
                <div className="editorial-skill-chips">
                  {group.skills.map((skill) => (
                    <span key={skill} className="editorial-tag-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Contact Block */}
      <section className="editorial-bottom-cta">
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
            <span>GO TO CONTACT</span>
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
    </div>
  );
}
