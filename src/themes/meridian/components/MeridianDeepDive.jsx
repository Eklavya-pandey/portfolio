import React, { useState } from 'react';
import { CASE_STUDIES } from '../../../data/projectsData';
import { portfolioData } from '../../../data/portfolioData';

export default function MeridianDeepDive({ onOpenFullCaseStudy }) {
  const [activeTab, setActiveTab] = useState('onestepprint');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const osp = CASE_STUDIES.onestepprint;
  const nova = portfolioData.caseStudies.nova;

  const currentStudy = activeTab === 'onestepprint' ? osp : null;

  const ospGallery = [
    { src: '/assets/projects/onestepprint/hero.jpg', caption: 'Desktop Hero — CMYK Color Entry' },
    { src: '/assets/projects/onestepprint/pages/section-2.jpg', caption: 'Section 02 — Scanner Pass-Through' },
    { src: '/assets/projects/onestepprint/pages/section-3.jpg', caption: 'Section 03 — Capabilities & Products' },
    { src: '/assets/projects/onestepprint/pages/last.jpg', caption: 'Final Section — Custom Print Ordering' }
  ];

  return (
    <section id="deep-dive" className="meridian-section" aria-label="Deep Dive Case Studies">
      <div className="meridian-header-block">
        <div className="meridian-subheading">Section 03 // Deep Dive</div>
        <h2 className="meridian-heading">Product Thinking.</h2>
        <p className="meridian-heading-desc">
          Examining the end-to-end UX rationale, systemic constraints, and interaction mechanics behind flagship projects.
        </p>
      </div>

      <div className="meridian-deepdive-container">
        <div className="meridian-deepdive-sidebar">
          {/* Tab Selector */}
          <div className="meridian-deepdive-project-selector" role="tablist">
            <button
              className={`meridian-dd-tab ${activeTab === 'onestepprint' ? 'active' : ''}`}
              onClick={() => { setActiveTab('onestepprint'); setActiveMediaIndex(0); }}
              role="tab"
              aria-selected={activeTab === 'onestepprint'}
            >
              OneStepPrint Redesign
            </button>
            <button
              className={`meridian-dd-tab ${activeTab === 'nova' ? 'active' : ''}`}
              onClick={() => setActiveTab('nova')}
              role="tab"
              aria-selected={activeTab === 'nova'}
            >
              Nova Invest Architecture
            </button>
          </div>

          {activeTab === 'onestepprint' && osp ? (
            <>
              <h3 className="meridian-dd-title">{osp.title}</h3>
              <div className="meridian-dd-client">Client: {osp.header.meta.client} • {osp.header.meta.services}</div>

              <div className="meridian-dd-block">
                <div className="meridian-dd-block-label">{osp.brief.label}</div>
                <p className="meridian-dd-block-text">{osp.brief.text}</p>
              </div>

              <div className="meridian-dd-block">
                <div className="meridian-dd-block-label">{osp.challenge.label}</div>
                <p className="meridian-dd-block-text">{osp.challenge.text}</p>
              </div>

              <div className="meridian-dd-block">
                <div className="meridian-dd-block-label">Concept: {osp.concept.title}</div>
                <p className="meridian-dd-block-text">{osp.concept.intro}</p>
              </div>

              <div className="meridian-dd-process-list">
                {osp.concept.steps.map((st) => (
                  <div key={st.num} className="meridian-dd-step">
                    <span className="meridian-dd-step-num">0{st.num}</span>
                    <div>
                      <h4 className="meridian-dd-step-title">{st.title}</h4>
                      <p className="meridian-dd-step-desc">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <button
                  className="meridian-work-action-btn"
                  onClick={() => onOpenFullCaseStudy('onestepprint')}
                >
                  <span>Open Interactive Walkthrough ↗</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="meridian-dd-title">{nova.title}</h3>
              <div className="meridian-dd-client">{nova.role} • {nova.projectType}</div>

              <div className="meridian-dd-block">
                <div className="meridian-dd-block-label">Core Problem</div>
                <p className="meridian-dd-block-text">{nova.problem}</p>
              </div>

              <div className="meridian-dd-block">
                <div className="meridian-dd-block-label">Product Goal</div>
                <p className="meridian-dd-block-text">{nova.goal}</p>
              </div>

              <div className="meridian-dd-process-list">
                {nova.approaches.map((ap) => (
                  <div key={ap.num} className="meridian-dd-step">
                    <span className="meridian-dd-step-num">{ap.num}</span>
                    <div>
                      <h4 className="meridian-dd-step-title">{ap.title}</h4>
                      <p className="meridian-dd-step-desc">{ap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Gallery / Interactive Visuals */}
        <div className="meridian-deepdive-gallery">
          {activeTab === 'onestepprint' ? (
            <>
              <div className="meridian-dd-main-media">
                <img
                  src={ospGallery[activeMediaIndex].src}
                  alt={ospGallery[activeMediaIndex].caption}
                />
              </div>
              <div style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.72rem', color: 'var(--mr-text-secondary)' }}>
                {ospGallery[activeMediaIndex].caption}
              </div>

              <div className="meridian-dd-thumbnails">
                {ospGallery.map((m, idx) => (
                  <div
                    key={idx}
                    className={`meridian-dd-thumb ${idx === activeMediaIndex ? 'active' : ''}`}
                    onClick={() => setActiveMediaIndex(idx)}
                    title={m.caption}
                  >
                    <img src={m.src} alt={m.caption} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="meridian-dd-main-media">
              <img
                src="/editorial/project1.png"
                alt="Nova Invest trading screen"
              />
              <div style={{ padding: '1.25rem', borderTop: '1px solid var(--mr-border-hairline)' }}>
                <div style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.75rem', color: 'var(--mr-gold)' }}>
                  Information Architecture • High-Density Market Depth
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--mr-text-secondary)', marginTop: '0.25rem' }}>
                  Organized into progressive disclosure tiers: quick action headers, live candlestick streams, and friction-free order tickets.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
