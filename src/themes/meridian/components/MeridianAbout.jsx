import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

export default function MeridianAbout() {
  const { experience, education, skillCategories } = portfolioData;

  return (
    <section id="about" className="meridian-section" aria-label="Professional Experience and Background">
      <div className="meridian-header-block">
        <div className="meridian-subheading">Section 05 // Biography</div>
        <h2 className="meridian-heading">Craft & Trajectory.</h2>
        <p className="meridian-heading-desc">
          Bridging UX research, interaction architecture, and design systems for high-growth financial technology and web products.
        </p>
      </div>

      <div className="meridian-about-layout">
        {/* Left Column: Bio & Core Philosophy */}
        <div className="meridian-about-bio-col">
          <p className="meridian-about-p">
            I design trading and wealth products as <strong>one cohesive system</strong>: research the flow, build it once in the design system, and QA it rigorously against production builds.
          </p>
          <p className="meridian-about-p">
            With 5 years in digital product design, I specialize in high-density web and mobile interfaces that clarify complex financial data—from options chains and thematic baskets to institutional partner onboarding.
          </p>

          <div style={{ marginTop: '2rem', padding: '1.75rem', background: 'var(--mr-bg-card)', border: '1px solid var(--mr-border-hairline)', borderRadius: '16px' }}>
            <div style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.7rem', color: 'var(--mr-gold)', letterSpacing: '0.14em', marginBottom: '0.5rem' }}>
              ACADEMIC FOUNDATION
            </div>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.25rem', color: 'var(--mr-text-primary)' }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--mr-text-secondary)', marginTop: '0.2rem' }}>
                  {edu.institution} • {edu.period}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Verified Professional Experience Timeline */}
        <div className="meridian-experience-track">
          {experience.map((exp) => (
            <div key={exp.id} className="meridian-exp-entry">
              <div className="meridian-exp-period">{exp.period}</div>
              <h3 className="meridian-exp-role">{exp.role}</h3>
              <div className="meridian-exp-company">{exp.company} — <span style={{ color: 'var(--mr-gold)' }}>{exp.focus}</span></div>
              <p className="meridian-exp-desc">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Skill Clusters */}
      <div className="meridian-skills-container">
        <div style={{ marginBottom: '2rem' }}>
          <div className="meridian-subheading">Core Competencies</div>
          <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '2rem', margin: 0, textTransform: 'uppercase' }}>
            Capabilities & Toolkit.
          </h3>
        </div>

        <div className="meridian-skills-groups">
          {skillCategories.map((group) => (
            <div key={group.id} className="meridian-skill-card">
              <h4 className="meridian-skill-card-title">{group.title}</h4>
              <div className="meridian-skill-tags">
                {group.skills.map((s) => (
                  <span key={s.id} className="meridian-skill-tag">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
