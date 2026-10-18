import React, { useEffect } from 'react';
import { CASE_STUDIES } from '../../../data/projectsData';
import { portfolioData } from '../../../data/portfolioData';

export default function MeridianCaseStudyModal({ studyKey, onClose }) {
  const osp = CASE_STUDIES.onestepprint;
  const nova = portfolioData.caseStudies.nova;

  const isOsp = studyKey === 'onestepprint';
  const study = isOsp ? osp : nova;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!study) return null;

  return (
    <div
      className="meridian-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={study.title}
    >
      <div className="meridian-modal-content">
        <button
          className="meridian-modal-close-btn"
          onClick={onClose}
          aria-label="Close Case Study Modal"
        >
          ✕
        </button>

        <div style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.72rem', color: 'var(--mr-gold)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
          CASE STUDY // VERIFIED ARCHITECTURE
        </div>

        <h2 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: ' clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', margin: '0 0 1rem 0' }}>
          {study.title}
        </h2>

        {isOsp ? (
          <div>
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--mr-border-hairline)', paddingBottom: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.65rem', color: 'var(--mr-text-muted)', display: 'block' }}>CLIENT</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--mr-text-primary)' }}>{study.header.meta.client}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.65rem', color: 'var(--mr-text-muted)', display: 'block' }}>SERVICES</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--mr-text-primary)' }}>{study.header.meta.services}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.65rem', color: 'var(--mr-text-muted)', display: 'block' }}>DATE</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--mr-text-primary)' }}>{study.header.meta.date}</span>
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--mr-border-hairline)' }}>
              <img
                src={study.header.heroImage}
                alt={study.header.heroAlt}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--mr-border-hairline)' }}>
                <h4 style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.75rem', color: 'var(--mr-gold)', margin: '0 0 0.5rem 0' }}>{study.brief.label}</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--mr-text-secondary)', margin: 0 }}>{study.brief.text}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--mr-border-hairline)' }}>
                <h4 style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.75rem', color: 'var(--mr-gold)', margin: '0 0 0.5rem 0' }}>{study.challenge.label}</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--mr-text-secondary)', margin: 0 }}>{study.challenge.text}</p>
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.6rem', color: 'var(--mr-text-primary)', marginBottom: '1rem' }}>
                Concept: {study.concept.title}
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--mr-text-secondary)', marginBottom: '1.5rem' }}>
                {study.concept.intro}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {study.concept.steps.map((st) => (
                  <div key={st.num} style={{ padding: '1.25rem', background: '#121218', borderRadius: '8px', border: '1px solid var(--mr-border-hairline)' }}>
                    <div style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.5rem', color: 'var(--mr-gold)' }}>0{st.num}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', margin: '0.25rem 0' }}>{st.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mr-text-secondary)' }}>{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.75rem', background: 'var(--mr-gold-dim)', border: '1px solid var(--mr-gold-border)', borderRadius: '12px' }}>
              <h4 style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.75rem', color: 'var(--mr-gold-light)', margin: '0 0 0.5rem 0' }}>KEY TAKEAWAYS</h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--mr-text-secondary)', fontSize: '0.88rem' }}>
                {study.takeaways.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '1.1rem', color: 'var(--mr-text-secondary)', marginBottom: '2rem' }}>
              {study.subtitle}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {study.approaches.map((ap) => (
                <div key={ap.num} style={{ padding: '1.5rem', background: '#121218', borderRadius: '12px', border: '1px solid var(--mr-border-hairline)' }}>
                  <div style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.8rem', color: 'var(--mr-gold)' }}>{ap.num}</div>
                  <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.5rem 0' }}>{ap.title}</h4>
                  <p style={{ color: 'var(--mr-text-secondary)', fontSize: '0.85rem', margin: 0 }}>{ap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
