import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

export default function MeridianHero({ onExploreWork, onContact }) {
  const { profile, highlights } = portfolioData;

  return (
    <section id="hero" className="meridian-section meridian-hero" aria-label="Introduction and Identity">
      <div className="meridian-hero-badge">
        <span className="meridian-status-dot" aria-hidden="true"></span>
        <span className="meridian-hero-badge-text">Available For Select Product Roles & Advisory • Goa, India</span>
      </div>

      <h1 className="meridian-hero-title">
        {profile.name.split(' ')[0]} <em>{profile.name.split(' ').slice(1).join(' ')}.</em>
      </h1>

      <div className="meridian-hero-role">
        <span>Sr. Executive UI/UX Designer</span>
        <span className="meridian-hero-role-sep">/</span>
        <span>Fintech Trading Terminals</span>
        <span className="meridian-hero-role-sep">/</span>
        <span>Multi-Platform Design Systems</span>
      </div>

      <p className="meridian-hero-lead-text">
        <strong>{profile.quote}</strong> {profile.summary} I specialize in transforming dense financial data, multi-leg options workflows, and institutional wealth tools into intuitive, high-performance interfaces that ship.
      </p>

      <div className="meridian-hero-actions">
        <button
          onClick={onExploreWork}
          className="meridian-cta-primary"
          aria-label="Explore Selected Work"
        >
          <span>Explore Selected Work ↓</span>
        </button>
        <button
          onClick={onContact}
          className="meridian-cta-secondary"
          aria-label="Discuss Opportunities"
        >
          <span>Discuss Opportunities ↗</span>
        </button>
      </div>

      {/* Horizontal Statistics Ribbon */}
      <div className="meridian-hero-metrics-ribbon">
        {highlights.map((h) => (
          <div key={h.id} className="meridian-ribbon-item">
            <span className="meridian-ribbon-num">{h.stat}</span>
            <span className="meridian-ribbon-lbl">{h.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
