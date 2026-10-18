import React from 'react';
import { MeridianContact } from '../components';
import { portfolioData } from '../../../data/portfolioData';

export default function MeridianContactPage({ onShowToast }) {
  const { contact } = portfolioData;

  return (
    <div className="meridian-page meridian-contact-page">
      {/* Page Header */}
      <div className="meridian-section" style={{ paddingBottom: '2rem' }}>
        <div className="meridian-subheading">Page // Inquiries & Advisory</div>
        <h1 className="meridian-heading" style={{ fontSize: 'clamp(3.2rem, 7vw, 6.4rem)' }}>
          Get In Touch.
        </h1>
        <p className="meridian-heading-desc">
          Discuss principal product design roles, institutional fintech consulting, or design system advisory.
        </p>
      </div>

      {/* Advisory Offerings Matrix */}
      <div className="meridian-section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="meridian-advisory-grid">
          <div className="meridian-advisory-card">
            <span className="meridian-route-index">01</span>
            <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.8rem', color: '#fff', margin: '0.5rem 0' }}>
              Fintech Product Design
            </h3>
            <p style={{ color: 'var(--mr-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
              Options trading workflows, market depth interfaces, retail wealth dashboards, and mobile order slips designed for high execution speed.
            </p>
          </div>

          <div className="meridian-advisory-card">
            <span className="meridian-route-index">02</span>
            <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.8rem', color: '#fff', margin: '0.5rem 0' }}>
              Design Systems Architecture
            </h3>
            <p style={{ color: 'var(--mr-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
              Multi-brand token governance, cross-platform component libraries (Web, Android, iOS), and engineering handoff automation.
            </p>
          </div>

          <div className="meridian-advisory-card">
            <span className="meridian-route-index">03</span>
            <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.8rem', color: '#fff', margin: '0.5rem 0' }}>
              Interactive Prototyping
            </h3>
            <p style={{ color: 'var(--mr-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
              High-fidelity interactive validation, real-time data prototypes, micro-interactions, and motion choreography for stakeholders.
            </p>
          </div>
        </div>
      </div>

      {/* Main Conversion Box */}
      <MeridianContact onShowToast={onShowToast} />
    </div>
  );
}
