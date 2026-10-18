import React from 'react';
import { MeridianAbout, MeridianDesignSystems } from '../components';
import { MeridianLink } from '../meridianRouter';

export default function MeridianAboutPage() {
  return (
    <div className="meridian-page meridian-about-page">
      {/* Page Header */}
      <div className="meridian-section" style={{ paddingBottom: '2rem' }}>
        <div className="meridian-subheading">Page // Craft & Systems</div>
        <h1 className="meridian-heading" style={{ fontSize: 'clamp(3.2rem, 7vw, 6.4rem)' }}>
          Craft & Trajectory.
        </h1>
        <p className="meridian-heading-desc">
          Five years of experience designing high-density web and mobile interfaces that clarify complex financial data into high-performance products.
        </p>
      </div>

      {/* About & Experience Section */}
      <MeridianAbout />

      {/* Design Systems & Interactive Specimen */}
      <MeridianDesignSystems />

      {/* Bottom Transition Box */}
      <div className="meridian-section" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <div className="meridian-page-transition-box">
          <div>
            <div className="meridian-subheading">Next Destination</div>
            <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '2.4rem', margin: '0.4rem 0 0.8rem 0', textTransform: 'uppercase' }}>
              Let’s Build What’s Next
            </h3>
            <p style={{ color: 'var(--mr-text-secondary)', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
              Available for select principal design roles, fintech consulting, and design systems advisory.
            </p>
          </div>
          <div>
            <MeridianLink href="/contact.html" className="meridian-cta-primary">
              <span>Go to Contact Page →</span>
            </MeridianLink>
          </div>
        </div>
      </div>
    </div>
  );
}
