import React, { useState, useMemo } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, CadCrossBox, IconArrow } from '../components/EditorialIcons';
import EditorialTiltCard from '../components/EditorialTiltCard';
import EditorialScrambleText from '../components/EditorialScrambleText';
import { EditorialLink } from '../editorialRouter';

export const PROJECTS = [
  {
    id: 'stock-trading-app',
    category: 'fintech',
    title: 'STOCK TRADING APP',
    description: 'End-to-end mobile trading experience engineered for high-frequency precision and zero latency.',
    image: '/editorial/project1.png',
    imageAlt: 'Stock Trading App interface mockup showing candlestick charts and trade orders',
    stats: [
      { value: '3 mo', label: 'DURATION' },
      { value: 'Mobile', label: 'PLATFORM' },
      { value: 'UI/UX', label: 'ROLE' },
      { value: '6', label: 'SCREENS' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=stock-trading-app',
    tag: 'FINTECH',
    tagline: 'End-to-end mobile trading experience engineered for high-frequency precision and zero latency.'
  },
  {
    id: 'investment-modules',
    category: 'fintech',
    title: 'INVESTMENT MODULES',
    description: 'Mutual Funds discovery, Option Chain terminal, and WealthBasket thematic investment journeys.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    imageAlt: 'Investment Modules dashboard mockup with analytics and SIP calculators',
    stats: [
      { value: '3', label: 'MODULES' },
      { value: 'Web/App', label: 'PLATFORM' },
      { value: '+266%', label: 'CONVERSION' },
      { value: 'BP Equities', label: 'CLIENT' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=investment-modules',
    tag: 'FINTECH',
    tagline: 'Mutual Funds discovery, Option Chain terminal, and WealthBasket thematic investment journeys.'
  },
  {
    id: 'markets-overview',
    category: 'design-system',
    title: 'DESIGN SYSTEM & INFRASTRUCTURE',
    description: 'Unified multi-platform financial data visualization architecture powering 4 distinct investor applications.',
    image: '/editorial/project3.png',
    imageAlt: 'Design System & Infrastructure component library and token explorer mockup',
    stats: [
      { value: '20', label: 'VARIANTS' },
      { value: 'FII/DII', label: 'DATA' },
      { value: '4', label: 'APPS SYNCED' },
      { value: '140+', label: 'DESIGN TOKENS' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=markets-overview',
    tag: 'DESIGN SYSTEM',
    tagline: 'Unified multi-platform financial data visualization architecture powering 4 distinct investor applications.'
  },
  {
    id: 'internal-ai-chatbot',
    category: 'ai',
    title: 'INTERNAL AI CHATBOT & COPILOT',
    description: 'Conversational AI assistant for automated portfolio health checkups, intent mapping, and support escalation.',
    image: '/editorial/project1.png',
    imageAlt: 'Internal AI Chatbot conversational UI mockup with streaming responses',
    stats: [
      { value: '94%', label: 'INTENT ACCURACY' },
      { value: '-42%', label: 'ESCALATION' },
      { value: '<200ms', label: 'STREAMING' },
      { value: 'Neo', label: 'LOCATION' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=internal-ai-chatbot',
    tag: 'AI',
    tagline: 'Conversational AI assistant for automated portfolio health checkups, intent mapping, and support escalation.'
  },
  {
    id: 'distributor-dashboard',
    category: 'fintech',
    title: 'DISTRIBUTOR INVOICING DASHBOARD',
    description: 'Institutional commission tracking, automated partner invoicing, and client onboarding MIS analytics.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    imageAlt: 'Distributor Invoicing Dashboard financial data grid mockup',
    stats: [
      { value: '1,200+', label: 'PARTNERS' },
      { value: '24h', label: 'INVOICE CYCLE' },
      { value: 'MIS', label: 'ANALYTICS' },
      { value: 'Desktop', label: 'PLATFORM' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=distributor-dashboard',
    tag: 'FINTECH',
    tagline: 'Institutional commission tracking, automated partner invoicing, and client onboarding MIS analytics.'
  },
  {
    id: 'skydreams-portfolio',
    category: 'web',
    title: 'SKYDREAMS CLIENT PORTFOLIO',
    description: 'Five end-to-end web applications and consumer platforms delivered with 100% first-launch client approval.',
    image: '/editorial/project3.png',
    imageAlt: 'Skydreams Client Portfolio responsive web interface mockup',
    stats: [
      { value: '5', label: 'CLIENTS' },
      { value: '100%', label: 'APPROVAL' },
      { value: '3 Weeks', label: 'AVG CYCLE' },
      { value: 'Full-Cycle', label: 'ROLE' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=skydreams-portfolio',
    tag: 'WEB',
    tagline: 'Five end-to-end web applications and consumer platforms delivered with 100% first-launch client approval.'
  },
  {
    id: 'pigeon-edu',
    category: 'web',
    title: 'PIGEON EDU PLATFORM REVAMP',
    description: 'Educational software interface, interactive learning components, and student analytics dashboard.',
    image: '/editorial/project1.png',
    imageAlt: 'Pigeon Edu Platform Revamp learning portal interface mockup',
    stats: [
      { value: '+32%', label: 'RETENTION' },
      { value: '12+', label: 'MODULES' },
      { value: 'Web', label: 'PLATFORM' },
      { value: 'EdTech', label: 'DOMAIN' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=pigeon-edu',
    tag: 'WEB',
    tagline: 'Educational software interface, interactive learning components, and student analytics dashboard.'
  },
  {
    id: 'ipo-application-flow',
    category: 'fintech',
    title: 'IPO APPLICATION FLOW',
    description: 'Streamlined retail IPO bidding pipeline eliminating UPI mandate friction and investor drop-offs.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    imageAlt: 'IPO Application Flow progressive disclosure wizard mockup',
    stats: [
      { value: '6', label: 'SCREENS' },
      { value: 'JS', label: 'STACK' },
      { value: '3', label: 'CTA STATES' },
      { value: '100%', label: 'APPROVAL' }
    ],
    company: '',
    year: '',
    caseUrl: '?project=ipo-application-flow',
    tag: 'FINTECH',
    tagline: 'Streamlined retail IPO bidding pipeline eliminating UPI mandate friction and investor drop-offs.'
  }
];

const FILTER_CHIPS = [
  { id: 'all', label: 'ALL' },
  { id: 'fintech', label: 'FINTECH' },
  { id: 'design-system', label: 'DESIGN SYSTEM' },
  { id: 'ai', label: 'AI' },
  { id: 'web', label: 'WEB' }
];

export default function EditorialWorkPage({
  projects = PROJECTS,
  onOpenCaseStudy,
  onOpenFullCaseStudy,
  onCopyEmail
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const handleCopyEmail = () => {
    editorialAudio.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('naveen85pandey@gmail.com');
    }
    if (onCopyEmail) onCopyEmail();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="editorial-page-container">
      {/* 1. Page Header */}
      <section className="editorial-page-hero">
        <EditorialCornerTicks />
        <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
          <CadCrossBox size={24} className="editorial-hero-cad-box" />
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={true} triggerOnHover={true} speed={22}>
              01 / WORK
            </EditorialScrambleText>
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
          <div className="editorial-filter-pills">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`editorial-filter-pill ${activeFilter === chip.id ? 'active' : ''}`}
                aria-pressed={activeFilter === chip.id}
                onClick={() => {
                  editorialAudio.playClick();
                  setActiveFilter(chip.id);
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <span className="editorial-results-count">
            Showing {filteredProjects.length} of {PROJECTS.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </section>

      {/* 2. Full Projects Grid */}
      <section className="editorial-project-grid all-projects-grid">
        <EditorialCornerTicks />
        {filteredProjects.length === 0 ? (
          <div className="editorial-no-projects">
            No projects in this category yet.
          </div>
        ) : (
          filteredProjects.map((project, index) => (
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
                    if (onOpenFullCaseStudy) {
                      onOpenFullCaseStudy(project);
                    } else if (onOpenCaseStudy) {
                      onOpenCaseStudy(project);
                    }
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
                        onOpenCaseStudy(project);
                      }}
                      aria-label={`Preview ${project.title}`}
                    >
                      PREVIEW <IconArrow size={9} />
                    </button>
                    {project.caseUrl ? (
                      <span className="editorial-card-full-btn" aria-hidden="true">
                        View case study <IconArrow size={9} />
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
                    loading={index < 3 ? 'eager' : 'lazy'}
                    width="800"
                    height="450"
                    style={{ objectPosition: project.imagePosition || (project.image === '/editorial/project2.png' ? 'left top' : 'center top') }}
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
                          if (!e.metaKey && !e.ctrlKey && onOpenFullCaseStudy) {
                            e.preventDefault();
                            onOpenFullCaseStudy(project);
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
                  <p className="editorial-card-tagline">{project.description}</p>
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
          ))
        )}
      </section>

      {/* 3. Bottom CTA Section */}
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
    </div>
  );
}
