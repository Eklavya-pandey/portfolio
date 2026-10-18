import React from 'react';
import { MeridianWork, MeridianDeepDive } from '../components';
import { MeridianLink } from '../meridianRouter';

export default function MeridianWorkPage({ onOpenCaseStudy }) {
  return (
    <div className="meridian-page meridian-work-page">
      {/* Page Header */}
      <div className="meridian-section" style={{ paddingBottom: '2rem' }}>
        <div className="meridian-subheading">Page // Portfolio</div>
        <h1 className="meridian-heading" style={{ fontSize: 'clamp(3.2rem, 7vw, 6.4rem)' }}>
          Selected Work.
        </h1>
        <p className="meridian-heading-desc">
          Architectural product design and interaction systems spanning retail trading terminals, automated mutual funds, and enterprise tools.
        </p>
      </div>

      {/* Main Work Stream */}
      <MeridianWork
        onOpenCaseStudy={onOpenCaseStudy}
        onOpenDeepDive={() => {
          const el = document.getElementById('deep-dive');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Deep Dive Case Study Explorer */}
      <MeridianDeepDive
        onOpenFullCaseStudy={onOpenCaseStudy}
      />

      {/* Bottom Route Transition */}
      <div className="meridian-section" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <div className="meridian-page-transition-box">
          <div>
            <div className="meridian-subheading">Next Destination</div>
            <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '2.4rem', margin: '0.4rem 0 0.8rem 0', textTransform: 'uppercase' }}>
              Craft, Systems & Trajectory
            </h3>
            <p style={{ color: 'var(--mr-text-secondary)', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
              Discover the 140+ semantic design tokens, interactive order ticket, and 5-year fintech product timeline.
            </p>
          </div>
          <div>
            <MeridianLink href="/about.html" className="meridian-cta-primary">
              <span>Explore About & Systems →</span>
            </MeridianLink>
          </div>
        </div>
      </div>
    </div>
  );
}
