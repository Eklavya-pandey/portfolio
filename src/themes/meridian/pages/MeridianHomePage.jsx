import React from 'react';
import { MeridianHero } from '../components';
import { PROJECTS } from '../../../data/projectsData';
import { MeridianLink } from '../meridianRouter';

export default function MeridianHomePage({ onOpenCaseStudy, onNavigate }) {
  const p1 = PROJECTS[0]; // Stock Trading App
  const p2 = PROJECTS[1]; // Investment Modules

  return (
    <div className="meridian-page meridian-home-page">
      {/* 1. Signature Hero Section */}
      <MeridianHero
        onExploreWork={() => onNavigate('/work.html')}
        onContact={() => onNavigate('/contact.html')}
      />

      {/* 2. Featured Portfolio Spotlight Teaser */}
      <section className="meridian-section" aria-label="Featured Work">
        <div className="meridian-header-block">
          <div className="meridian-subheading">Selected Architecture // Portfolio Preview</div>
          <h2 className="meridian-heading">Featured Systems.</h2>
          <p className="meridian-heading-desc">
            Flagship fintech trading platforms and high-conversion investment workflows designed for scale.
          </p>
        </div>

        {p1 && (
          <article className="meridian-spotlight-card" style={{ marginBottom: '4rem' }}>
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
                  <span className="meridian-tag-pill meridian-tag-pill-gold">FLAGSHIP ARCHITECTURE</span>
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

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    className="meridian-work-action-btn"
                    onClick={() => onOpenCaseStudy(p1.id)}
                    aria-label={`Open Case Study for ${p1.title}`}
                  >
                    <span>Read Architecture ↗</span>
                  </button>
                  <MeridianLink
                    href="/work.html"
                    className="meridian-work-action-btn"
                    style={{ background: 'transparent', borderColor: 'var(--mr-border-subtle)', color: 'var(--mr-text-primary)' }}
                  >
                    <span>View All Work →</span>
                  </MeridianLink>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Home Navigation Route Cards */}
        <div className="meridian-home-routes-grid">
          <div className="meridian-home-route-card">
            <span className="meridian-route-index">01</span>
            <h3 className="meridian-route-title">All Selected Work</h3>
            <p className="meridian-route-desc">
              Explore 5 flagship fintech products, internal distributor portals, AI chatbots, and print publication mechanics.
            </p>
            <MeridianLink href="/work.html" className="meridian-route-link">
              Explore Portfolio (5 Projects) →
            </MeridianLink>
          </div>

          <div className="meridian-home-route-card">
            <span className="meridian-route-index">02</span>
            <h3 className="meridian-route-title">Craft & Systems</h3>
            <p className="meridian-route-desc">
              140+ synchronized semantic design tokens, interactive order execution slip, and verified career trajectory.
            </p>
            <MeridianLink href="/about.html" className="meridian-route-link">
              Inspect Design Systems →
            </MeridianLink>
          </div>

          <div className="meridian-home-route-card">
            <span className="meridian-route-index">03</span>
            <h3 className="meridian-route-title">Advisory & Contact</h3>
            <p className="meridian-route-desc">
              Available for select principal design roles, fintech consulting, and design system workshops.
            </p>
            <MeridianLink href="/contact.html" className="meridian-route-link">
              Start a Conversation →
            </MeridianLink>
          </div>
        </div>
      </section>
    </div>
  );
}
