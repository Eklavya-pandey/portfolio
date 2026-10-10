import React, { useState, useEffect } from 'react';
import { FONT_PRESETS, ensureGoogleFontsLoaded } from '../components/EditorialFontSwapper';
import { editorialAudio } from '../editorialAudio';
import { EditorialCornerTicks, CadCrossBox, IconArrow } from '../components/EditorialIcons';
import EditorialScrambleText from '../components/EditorialScrambleText';
import EditorialTypingTest from '../components/EditorialTypingTest';
import EditorialAsciiArt from '../components/EditorialAsciiArt';
import { EditorialLink } from '../editorialRouter';

export default function EditorialPlaygroundPage({
  activeFont,
  onSelectFont,
  onResetFont,
  onCopyEmail
}) {
  const [testText, setTestText] = useState('0123456789 $1,284,920.45 +42.8% USD/EUR [ACTIVE_ORDER]');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isCrossFading, setIsCrossFading] = useState(false);

  // B1: Opens strictly at top with manual scroll restoration and no autofocus
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

  const handleCopyEmail = () => {
    editorialAudio.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('naveen85pandey@gmail.com');
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="editorial-page-container">
      {/* 1. Page Header (B2) */}
      <section className="editorial-page-hero">
        <EditorialCornerTicks />
        <div className="editorial-section-tag" style={{ marginBottom: 16 }}>
          <CadCrossBox size={24} className="editorial-hero-cad-box" />
          <span className="editorial-section-indicator" />
          <span className="editorial-section-title">
            <EditorialScrambleText triggerOnMount={true} triggerOnHover={true} speed={22}>
              03 / PLAYGROUND
            </EditorialScrambleText>
          </span>
          <div className="editorial-section-line" aria-hidden="true" />
        </div>

        <h1 className="editorial-page-headline">
          SMALL EXPERIMENTS.
        </h1>
        <p className="editorial-page-lead" style={{ fontSize: '18px', color: '#2B2B2A', lineHeight: 1.6, maxWidth: '780px' }}>
          Interactive toys in type, input and canvas. Try them.
        </p>
      </section>

      {/* 2. Tool 1: Typography System (Inline) */}
      <section id="font-swapper" className="editorial-playground-section-wrapper">
        <div className="editorial-playground-tool-card">
          <EditorialCornerTicks />
          <div className="editorial-tool-card-header">
            <div className="editorial-tool-card-title-group">
              <span className="editorial-tool-card-tag">01 // TYPOGRAPHY SYSTEM</span>
              <h3 className="editorial-tool-card-title">Font Pairing Studio</h3>
              <p className="editorial-tool-context-line">Try 6 type pairings across this site in real time.</p>
            </div>
            <span
              className="editorial-pg-key-badge"
              tabIndex={0}
              role="button"
              aria-label="Press F"
            >
              <span className="badge-text">F</span>
              <span className="badge-hover-label" aria-hidden="true">Press F</span>
            </span>
          </div>

          <div className="editorial-font-inline-studio">
            {/* Live Interactive Specimen Tester */}
            <div className="editorial-font-tester-bar">
              <span className="editorial-font-tester-lbl">SPECIMEN TESTER:</span>
              <input
                type="text"
                className="editorial-font-tester-input"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Type numbers or text to evaluate tabular font alignment..."
              />
            </div>

            {/* Presets Grid: 3 cols x 2 rows */}
            <div className="editorial-font-presets-grid">
              {FONT_PRESETS.map((font) => {
                const isSelected = font.id === activeFont.id;
                const selectFontPreset = () => {
                  setIsCrossFading(true);
                  ensureGoogleFontsLoaded(font);
                  editorialAudio.playClick();
                  onSelectFont(font);
                  setTimeout(() => setIsCrossFading(false), 150);
                };
                return (
                  <div
                    key={font.id}
                    data-preset={font.id}
                    className={`editorial-font-preset-card ${isSelected ? 'selected' : ''} ${isCrossFading ? 'cross-fading' : ''}`}
                    onClick={selectFontPreset}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        selectFontPreset();
                      }
                    }}
                  >
                    <EditorialCornerTicks />
                    <div className="editorial-font-preset-top">
                      <span className="editorial-font-status-dot">
                        {isSelected ? '● ACTIVE SYSTEM' : '○ CLICK TO APPLY'}
                      </span>
                      <span className="editorial-font-tag-badge">{font.tag}</span>
                    </div>

                    <div
                      className="editorial-font-sample-display"
                      style={{ fontFamily: font.displayFont }}
                    >
                      {font.name}
                    </div>

                    <div
                      className="editorial-font-sample-preview"
                      style={{ fontFamily: font.bodyFont }}
                    >
                      {testText.includes('[ACTIVE_ORDER]') ? (
                        <>
                          {testText.replace('[ACTIVE_ORDER]', '').trim()}{' '}
                          <span className="editorial-specimen-order-tag">[ACTIVE_ORDER]</span>
                        </>
                      ) : (
                        testText
                      )}
                    </div>

                    <div className="editorial-font-preset-footer">
                      <span className="editorial-font-subtag">{font.subtag}</span>
                      <span className="editorial-font-apply-btn">
                        {isSelected ? 'CURRENT FONT' : 'APPLY PRESET →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="editorial-font-studio-footer">
              <span className="editorial-font-note">TABULAR FIGURES PRESERVED ACROSS ALL 6 PRESETS</span>
              <button
                type="button"
                className="editorial-secondary-btn"
                onClick={() => {
                  setIsCrossFading(true);
                  editorialAudio.playClick();
                  onResetFont();
                  setTimeout(() => setIsCrossFading(false), 150);
                }}
              >
                RESET TO DEFAULT PRESET
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tool 2: Speed Typing Benchmark (Inline) */}
      <section id="typing-test" className="editorial-playground-section-wrapper">
        <EditorialTypingTest isInline={true} />
      </section>

      {/* 4. Tool 3: Terminal ASCII Art Studio (Inline) */}
      <section id="ascii-studio" className="editorial-playground-section-wrapper">
        <EditorialAsciiArt isInline={true} />
      </section>

      {/* 5. Bottom Contact Block */}
      <section className="editorial-bottom-cta">
        <EditorialCornerTicks />
        <div className="editorial-cta-left">
          <div className="editorial-section-tag" style={{ marginBottom: 12 }}>
            <CadCrossBox size={24} className="editorial-cta-cad-box" />
            <span className="editorial-section-indicator" />
            <span className="editorial-section-title">
              <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                04 / CONTACT
              </EditorialScrambleText>
            </span>
            <div className="editorial-section-line" aria-hidden="true" />
          </div>
          <h2 className="editorial-cta-headline">
            LET'S DESIGN WHAT'S NEXT.
          </h2>
          <p className="editorial-cta-sub">
            Open to full-time Product Designer roles and select contracts.
          </p>
        </div>

        <div className="editorial-cta-actions">
          <EditorialLink
            href="/contact.html"
            className="editorial-cta-btn"
            data-text="GO TO CONTACT →"
            onClick={() => editorialAudio.playClick()}
          >
            <span>GO TO CONTACT</span>
            <IconArrow size={11} />
          </EditorialLink>

          <button
            type="button"
            className="editorial-cta-copy-btn"
            data-text="COPY EMAIL ADDRESS"
            onClick={handleCopyEmail}
            aria-live="polite"
            aria-label="Copy email address"
          >
            <span className="editorial-btn-frame" aria-hidden="true" />
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
            <span>{copiedEmail ? 'Copied!' : 'COPY EMAIL ADDRESS'}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
