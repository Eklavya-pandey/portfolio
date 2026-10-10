import React, { useState } from 'react';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, CadCrossBox, IconArrow } from '../components/EditorialIcons';
import EditorialScrambleText from '../components/EditorialScrambleText';
import { EditorialLink } from '../editorialRouter';

export default function EditorialContactPage({ onCopyEmail }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleOrProject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (val) => {
    if (!val || !val.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
    return null;
  };

  const handleBlurEmail = () => {
    const err = validateEmail(formData.email);
    setErrors(prev => ({ ...prev, email: err }));
  };

  const handleCopyClick = (e) => {
    if (e) e.preventDefault();
    const email = 'naveen85pandey@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    if (typeof onCopyEmail === 'function') {
      onCopyEmail(e);
    } else {
      editorialAudio.playSuccess();
    }
    setCopiedEmail(true);
    setTimeout(() => {
      setCopiedEmail(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editorialAudio.playClick();

    // Validate fields
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name or organization is required.';
    }
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      newErrors.email = emailErr;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your project or inquiry.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      editorialAudio.playError();
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate technical transmission dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      editorialAudio.playSuccess();
    }, 650);
  };

  return (
    <div className="editorial-page-container">
      {/* 1. Page Hero */}
      <section className="editorial-page-hero">
        <EditorialCornerTicks />
        <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
          <CadCrossBox size={24} className="editorial-hero-cad-box" />
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={true} triggerOnHover={true} speed={22}>
              04 / CONTACT
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <h1 className="editorial-page-headline">
          LET'S DESIGN WHAT'S NEXT.
        </h1>
        <p className="editorial-page-lead editorial-contact-hero-subline">
          Product designer for trading apps, design systems and internal tools. Open to full-time roles and select contracts.
        </p>

        {/* Hero CTAs: Primary "Download CV" + Secondary "View work" */}
        <div className="editorial-contact-hero-actions">
          <a
            href="/assets/Naveen_Pandey_CV.pdf"
            download="Naveen_Pandey_CV.pdf"
            className="editorial-cta-btn"
            data-text="DOWNLOAD CV"
            onClick={() => editorialAudio.playClick()}
            aria-label="Download CV"
          >
            <span>DOWNLOAD CV</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>

          <EditorialLink
            href="/work.html"
            className="editorial-hero-secondary-btn"
            data-text="VIEW WORK →"
            onClick={() => editorialAudio.playClick()}
          >
            <span className="editorial-btn-frame" aria-hidden="true" />
            <span>VIEW WORK</span>
            <IconArrow size={11} />
          </EditorialLink>
        </div>
      </section>

      {/* 2. Contact Content Grid */}
      <div className="editorial-contact-page-grid">
        {/* Left Column: Direct Coordinates & Social Anchors */}
        <div className="editorial-contact-info-card">
          <EditorialCornerTicks />
          <div className="editorial-contact-info-header">
            <span className="editorial-section-indicator" />
            <span className="editorial-contact-info-tag">CONTACT DETAILS</span>
          </div>

          <div className="editorial-contact-methods-list">
            {/* Primary Inbox Block */}
            <div className="editorial-contact-method-item">
              <span className="editorial-contact-method-lbl">PRIMARY INBOX</span>
              <div className="editorial-contact-method-row">
                <a
                  href="mailto:naveen85pandey@gmail.com"
                  className="editorial-contact-email-link"
                  onClick={() => editorialAudio.playClick()}
                >
                  naveen85pandey@gmail.com
                </a>
                <button
                  type="button"
                  className={`editorial-contact-copy-badge ${copiedEmail ? 'copied' : ''}`}
                  onClick={handleCopyClick}
                  title="Copy email to clipboard"
                  aria-live="polite"
                  aria-label={copiedEmail ? 'Email address copied to clipboard' : 'Copy email address'}
                >
                  {copiedEmail ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  <span>{copiedEmail ? 'Copied!' : 'COPY'}</span>
                </button>
              </div>
            </div>

            {/* Location Block */}
            <div className="editorial-contact-method-item">
              <span className="editorial-contact-method-lbl">BASE LOCATION</span>
              <div className="editorial-contact-method-val">
                Goa, India (UTC +5:30)
              </div>
            </div>

            {/* Social & Professional Networks */}
            <div className="editorial-contact-method-item">
              <span className="editorial-contact-method-lbl">PROFESSIONAL NETWORKS</span>
              <div className="editorial-contact-links-grid">
                {/* LinkedIn = Primary solid dark button */}
                <a
                  href="https://linkedin.com/in/naveen-pandey85/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-contact-social-btn outline"
                  onClick={() => editorialAudio.playClick()}
                  aria-label="LinkedIn Profile"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                  </svg>
                  <span>LINKEDIN</span>
                  <IconArrow size={10} />
                </a>

                {/* Behance = Outline */}
                <a
                  href="https://behance.net/naveen_pandey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-contact-social-btn outline"
                  onClick={() => editorialAudio.playClick()}
                  aria-label="Behance Portfolio"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.109 0-5.5-2.266-5.5-5.5 0-3.141 2.391-5.5 5.5-5.5 3.031 0 5.172 2.156 5.172 5.5 0 .344-.031.75-.062 1h-8.11c.125 1.5 1.359 2.5 3 2.5 1.156 0 2.141-.531 2.726-1.5zm-5.126-5c-1.5 0-2.672.938-2.906 2.5h5.812c-.234-1.562-1.406-2.5-2.906-2.5zM2 4h6.5c1.938 0 3.5 1.297 3.5 3.125 0 1.094-.578 2.063-1.453 2.609 1.188.547 1.953 1.672 1.953 2.984 0 2.078-1.703 3.282-3.844 3.282H2V4zm2.75 6.25h3.25c.969 0 1.625-.563 1.625-1.406 0-.844-.656-1.344-1.625-1.344H4.75v2.75zm0 3.25v3.25h3.5c1.109 0 1.875-.625 1.875-1.594 0-.969-.766-1.656-1.875-1.656H4.75z" />
                  </svg>
                  <span>BEHANCE</span>
                  <IconArrow size={10} />
                </a>

                {/* WhatsApp = Outline */}
                <a
                  href="https://wa.me/919634746009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-contact-social-btn outline"
                  onClick={() => editorialAudio.playClick()}
                  aria-label="Chat on WhatsApp"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.09 1.04-1.53 1.1-.41.05-.94.08-2.73-.66-2.28-.95-3.74-3.26-3.86-3.41-.11-.16-.91-1.21-.91-2.31 0-1.1.58-1.64.78-1.86.2-.23.45-.29.6-.29.15 0 .3 0 .43.01.14.01.32-.05.5.38.19.45.64 1.57.7 1.69.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.32-.36.43-.12.12-.24.25-.1.5.14.24.63 1.04 1.36 1.68.93.83 1.72 1.09 1.96 1.21.24.12.39.1.53-.06.15-.17.63-.73.8-1 .17-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.2.5.31.06.12.06.68-.13 1.21z" />
                  </svg>
                  <span>WHATSAPP</span>
                  <IconArrow size={10} />
                </a>
              </div>
            </div>

            {/* WHAT TO EXPECT Compact Monospace Block */}
            <div className="editorial-contact-expect-block">
              <span className="editorial-contact-method-lbl">// WHAT TO EXPECT</span>
              <div className="editorial-contact-expect-content">
                <div className="editorial-contact-expect-line">
                  <span className="editorial-contact-expect-bullet">01</span>
                  <span>Reply within 24h</span>
                </div>
                <div className="editorial-contact-expect-line">
                  <span className="editorial-contact-expect-bullet">02</span>
                  <span>Overlap with EU and US mornings</span>
                </div>
                <div className="editorial-contact-expect-line">
                  <span className="editorial-contact-expect-bullet">03</span>
                  <span>Open to remote and hybrid</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Inquiry Transmission Form */}
        <div className="editorial-contact-form-card">
          <EditorialCornerTicks />
          <div className="editorial-contact-info-header">
            <span className="editorial-section-indicator" />
            <span className="editorial-contact-info-tag">SEND A MESSAGE</span>
          </div>

          {formSubmitted ? (
            <div className="editorial-form-success-box" role="status" aria-live="polite">
              <div className="editorial-form-success-icon">✓</div>
              <h3 className="editorial-form-success-title">MESSAGE RECEIVED</h3>
              <p className="editorial-form-success-msg">
                Thank you{formData.name ? `, ${formData.name}` : ''}! Your dispatch has been logged. I review all inquiries directly and will reply within 24 hours.
              </p>
              <div className="editorial-form-success-actions">
                <a
                  href={`mailto:naveen85pandey@gmail.com?subject=Design%20Inquiry%20from%20${encodeURIComponent(formData.name || 'Visitor')}&body=${encodeURIComponent((formData.roleOrProject ? 'Engagement: ' + formData.roleOrProject + '\n\n' : '') + (formData.message || ''))}`}
                  className="editorial-cta-btn"
                  data-text="SEND BACKUP VIA EMAIL →"
                  onClick={() => editorialAudio.playClick()}
                >
                  <span>SEND BACKUP VIA EMAIL</span>
                  <IconArrow size={11} />
                </a>
                <button
                  type="button"
                  className="editorial-form-reset-btn"
                  onClick={() => {
                    editorialAudio.playClick();
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', roleOrProject: '', message: '' });
                    setErrors({});
                  }}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            </div>
          ) : (
            <form className="editorial-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="editorial-form-row">
                {/* Field 1: Name */}
                <div className="editorial-form-field">
                  <label htmlFor="contact-name" className="editorial-form-label">
                    NAME / ORGANIZATION<span className="editorial-form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={`editorial-form-input ${errors.name ? 'has-error' : ''}`}
                    placeholder="Your name or company"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                  />
                  {errors.name && (
                    <span id="contact-name-error" className="editorial-form-field-error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Field 2: Email */}
                <div className="editorial-form-field">
                  <label htmlFor="contact-email" className="editorial-form-label">
                    EMAIL ADDRESS<span className="editorial-form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={`editorial-form-input ${errors.email ? 'has-error' : ''}`}
                    placeholder="you@company.com"
                    value={formData.email}
                    onBlur={handleBlurEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                  />
                  {errors.email && (
                    <span id="contact-email-error" className="editorial-form-field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Field 3: Engagement Type */}
              <div className="editorial-form-field">
                <label htmlFor="contact-role" className="editorial-form-label">
                  ENGAGEMENT TYPE <span className="editorial-form-optional">(optional)</span>
                </label>
                <select
                  id="contact-role"
                  name="roleOrProject"
                  className="editorial-form-select"
                  data-empty={!formData.roleOrProject}
                  value={formData.roleOrProject}
                  onChange={(e) => setFormData({ ...formData, roleOrProject: e.target.value })}
                >
                  <option value="" disabled>Select engagement type</option>
                  <option value="Full-time role">Full-time role</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance project">Freelance project</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Just saying hi">Just saying hi</option>
                </select>
              </div>

              {/* Field 4: Project Details */}
              <div className="editorial-form-field">
                <label htmlFor="contact-message" className="editorial-form-label">
                  PROJECT DETAILS<span className="editorial-form-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  aria-required="true"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  rows={4}
                  className={`editorial-form-textarea ${errors.message ? 'has-error' : ''}`}
                  placeholder="Tell me about the role or project, timeline, and what you need designed..."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: null });
                  }}
                />
                {errors.message && (
                  <span id="contact-message-error" className="editorial-form-field-error" role="alert">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit & Helper */}
              <div className="editorial-form-footer">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="editorial-cta-btn submit-btn"
                  data-text={isSubmitting ? "SENDING..." : "SEND MESSAGE →"}
                >
                  <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  <IconArrow size={11} />
                </button>
                <span className="editorial-form-note">
                  Sent directly to my inbox
                </span>
              </div>

              {/* Direct Mailto Fallback Link */}
              <p className="editorial-form-fallback">
                Form not working?{' '}
                <a
                  href="mailto:naveen85pandey@gmail.com"
                  className="editorial-form-fallback-link"
                  onClick={() => editorialAudio.playClick()}
                >
                  Email me directly.
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
