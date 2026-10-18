import React, { useState } from 'react';
import { portfolioData } from '../../../data/portfolioData';

export default function MeridianContact({ onShowToast }) {
  const { contact } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      if (onShowToast) onShowToast('Email copied to clipboard: ' + contact.email);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="contact" className="meridian-section" aria-label="Contact and Inquiries">
      <div className="meridian-contact-box">
        <div className="meridian-subheading" style={{ justifyContent: 'center' }}>
          Section 06 // Conversion
        </div>

        <h2 className="meridian-contact-title">Let’s Build What’s Next.</h2>
        <p className="meridian-contact-sub">
          Available for select principal design roles, fintech consulting, and multi-platform design systems advisory. Based in {contact.location}.
        </p>

        <div>
          <a
            href={`mailto:${contact.email}`}
            onClick={handleCopyEmail}
            className="meridian-contact-email-btn"
            title="Click to copy email address"
            aria-label={`Email ${contact.email}`}
          >
            <span>{contact.email}</span>
            <span style={{ fontSize: '0.85rem', color: copied ? '#10B981' : 'var(--mr-gold)' }}>
              {copied ? '✓ COPIED' : 'COPY 📋'}
            </span>
          </a>
        </div>

        <div className="meridian-contact-links">
          <a
            href={contact.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="meridian-contact-social-link"
          >
            LinkedIn ↗
          </a>
          <a
            href={contact.behance.url}
            target="_blank"
            rel="noopener noreferrer"
            className="meridian-contact-social-link"
          >
            Behance ↗
          </a>
          <a
            href="/assets/Naveen_Pandey_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="meridian-contact-social-link"
          >
            Download Resume (PDF) ↓
          </a>
        </div>

        <div className="meridian-footer-meta">
          <span>© 2026 Naveen Kumar Pandey • All Rights Reserved</span>
          <span>Theme: Meridian (Cinematic 3D Editorial)</span>
          <span>Location: {contact.location}</span>
        </div>
      </div>
    </section>
  );
}
