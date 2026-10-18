import React from 'react';
import { PROJECTS } from '../../../data/projectsData';

export default function MeridianWork({ onOpenCaseStudy, onOpenDeepDive }) {
  const p1 = PROJECTS[0]; // Stock Trading App
  const p2 = PROJECTS[1]; // Investment Modules
  const p3 = PROJECTS.find((p) => p.id === 'onestepprint') || PROJECTS[5]; // OneStepPrint
  const p4 = PROJECTS[4]; // Distributor Dashboard
  const p5 = PROJECTS[3]; // Internal AI Chatbot

  return (
    <section id="work" className="meridian-section" aria-label="Selected Work">
      <div className="meridian-header-block">
        <div className="meridian-subheading">Section 02 // Portfolio</div>
        <h2 className="meridian-heading">Selected Work.</h2>
        <p className="meridian-heading-desc">
          Featured case studies and digital product architectures across retail fintech, options trading, and automated design systems.
        </p>
      </div>

      <div className="meridian-work-stream">
        {/* Archetype 1: Heroic Full-Width Spotlight Project (Stock Trading App) */}
        {p1 && (
          <article className="meridian-spotlight-card">
            <div className="meridian-spotlight-media">
              <img
                src={p1.image}
                alt={p1.imageAlt || p1.title}
                loading="lazy"
              />
              <div className="meridian-spotlight-overlay" aria-hidden="true" />
            </div>

            <div className="meridian-spotlight-body">
              <div>
                <div className="meridian-tag-row">
                  <span className="meridian-tag-pill meridian-tag-pill-gold">FEATURED CASE</span>
                  <span className="meridian-tag-pill">{p1.tag}</span>
                  <span className="meridian-tag-pill">2 PLATFORMS // ANDROID + iOS</span>
                </div>
                <h3 className="meridian-spotlight-title">{p1.title}</h3>
                <p className="meridian-spotlight-desc">{p1.description} {p1.tagline}</p>
              </div>

              <div>
                {p1.stats && (
                  <div className="meridian-stats-grid" style={{ marginBottom: '2rem' }}>
                    {p1.stats.map((s, idx) => (
                      <div key={idx}>
                        <div className="meridian-stat-val">{s.val}</div>
                        <div className="meridian-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="meridian-work-action-btn"
                  onClick={() => onOpenDeepDive(p1.id)}
                  aria-label={`Explore Architecture for ${p1.title}`}
                >
                  <span>Explore Architecture ↗</span>
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Archetype 2A: Asymmetric Split Layout (Investment Modules) */}
        {p2 && (
          <article className="meridian-split-card">
            <div className="meridian-split-media">
              <img
                src={p2.image}
                alt={p2.imageAlt || p2.title}
                style={{ objectPosition: p2.imagePosition || 'left top' }}
                loading="lazy"
              />
            </div>

            <div className="meridian-split-details">
              <div className="meridian-split-num">02</div>
              <div className="meridian-tag-row">
                <span className="meridian-tag-pill meridian-tag-pill-gold">1.2% → 4.4% CONVERSION</span>
                <span className="meridian-tag-pill">{p2.tag}</span>
                <span className="meridian-tag-pill">Client: BP Equities</span>
              </div>

              <h3 className="meridian-split-title">{p2.title}</h3>
              <p className="meridian-split-desc">{p2.description} {p2.tagline}</p>

              {p2.stats && (
                <div className="meridian-stats-grid">
                  {p2.stats.map((s, idx) => (
                    <div key={idx}>
                      <div className="meridian-stat-val">{s.val}</div>
                      <div className="meridian-stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <button
                  className="meridian-work-action-btn"
                  onClick={() => onOpenDeepDive(p2.id)}
                  aria-label={`Explore Case Study for ${p2.title}`}
                >
                  <span>View Case Study ↗</span>
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Archetype 2B: Asymmetric Reversed Split Layout (OneStepPrint) */}
        {p3 && (
          <article className="meridian-split-card reverse">
            <div className="meridian-split-details">
              <div className="meridian-split-num">03</div>
              <div className="meridian-tag-row">
                <span className="meridian-tag-pill meridian-tag-pill-gold">SCROLL-LED CMYK STORYTELLING</span>
                <span className="meridian-tag-pill">Client: {p3.client || 'Viraj Patel'}</span>
                <span className="meridian-tag-pill">{p3.services || 'UI Design & Prototyping'}</span>
              </div>

              <h3 className="meridian-split-title">{p3.title}</h3>
              <p className="meridian-split-desc">
                {p3.problemLine || p3.description} Turn a single-page pamphlet site into an interactive digital publication with CMYK pass-through mechanics.
              </p>

              <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.78rem', color: 'var(--mr-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Core Innovation: Scroll as a print job
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--mr-text-secondary)', marginTop: '0.35rem' }}>
                  Four CMYK dots travel through the site, pass into a virtual scanner, and emerge as finished print products.
                </div>
              </div>

              <div>
                <button
                  className="meridian-work-action-btn"
                  onClick={() => onOpenCaseStudy(p3.slug || 'onestepprint')}
                  aria-label={`Open Full Case Study for ${p3.title}`}
                >
                  <span>Open Full Case Study ↗</span>
                </button>
              </div>
            </div>

            <div className="meridian-split-media">
              <img
                src={p3.cover || p3.image}
                alt={p3.imageAlt || p3.title}
                loading="lazy"
              />
            </div>
          </article>
        )}

        {/* Archetype 3: Dual Column Terminal Grid (Distributor Dashboard & Internal AI Chatbot) */}
        <div className="meridian-dual-grid">
          {p4 && (
            <article className="meridian-compact-card">
              <div>
                <div className="meridian-compact-media">
                  <img
                    src={p4.image}
                    alt={p4.imageAlt || p4.title}
                    style={{ objectPosition: p4.imagePosition || 'left top' }}
                    loading="lazy"
                  />
                </div>
                <div className="meridian-tag-row">
                  <span className="meridian-tag-pill meridian-tag-pill-gold">INTERNAL PLATFORM</span>
                  <span className="meridian-tag-pill">1,200+ Partners</span>
                </div>
                <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '2.2rem', textTransform: 'uppercase', margin: '0.5rem 0 1rem 0' }}>
                  {p4.title}
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--mr-text-secondary)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                  {p4.description}
                </p>
              </div>

              <div>
                {p4.stats && (
                  <div className="meridian-stats-grid" style={{ marginBottom: '1.5rem' }}>
                    {p4.stats.map((s, idx) => (
                      <div key={idx}>
                        <div className="meridian-stat-val">{s.val}</div>
                        <div className="meridian-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="meridian-work-action-btn"
                  onClick={() => onOpenDeepDive(p4.id)}
                >
                  <span>Inspect System ↗</span>
                </button>
              </div>
            </article>
          )}

          {p5 && (
            <article className="meridian-compact-card">
              <div>
                <div className="meridian-compact-media">
                  <img
                    src={p5.image}
                    alt={p5.imageAlt || p5.title}
                    loading="lazy"
                  />
                </div>
                <div className="meridian-tag-row">
                  <span className="meridian-tag-pill meridian-tag-pill-gold">AI & AUTOMATION</span>
                  <span className="meridian-tag-pill">94% Accuracy</span>
                </div>
                <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '2.2rem', textTransform: 'uppercase', margin: '0.5rem 0 1rem 0' }}>
                  {p5.title}
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--mr-text-secondary)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                  {p5.description}
                </p>
              </div>

              <div>
                {p5.stats && (
                  <div className="meridian-stats-grid" style={{ marginBottom: '1.5rem' }}>
                    {p5.stats.map((s, idx) => (
                      <div key={idx}>
                        <div className="meridian-stat-val">{s.val}</div>
                        <div className="meridian-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="meridian-work-action-btn"
                  onClick={() => onOpenDeepDive(p5.id)}
                >
                  <span>Inspect Assistant ↗</span>
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
