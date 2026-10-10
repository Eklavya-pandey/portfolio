import React from 'react';
import { editorialAudio } from '../editorialAudio';
import { EDITORIAL_CONTENT } from '../editorialContent';
import { EditorialCornerTicks, IconArrow } from './EditorialIcons';
import EditorialScrambleText from './EditorialScrambleText';

/**
 * EditorialPlaygroundSection
 * Interactive Playground section placed between Experience and Certifications.
 * Features 3 compact cards that open Font Swapper, Typing Test, and ASCII Art Studio.
 */
export default function EditorialPlaygroundSection({
  onOpenFont,
  onOpenType,
  onOpenAscii
}) {
  const handleLaunch = (action) => {
    editorialAudio.playClick();
    action();
  };

  return (
    <section id="playground-section" className="editorial-section">
      <EditorialCornerTicks />
      {/* Matching section label: orange bar + uppercase mono */}
      <div className="editorial-section-tag">
        <span className="editorial-section-indicator" />
        <span className="editorial-section-title">
          <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
            {EDITORIAL_CONTENT.sections.playground}
          </EditorialScrambleText>
        </span>
        <div className="editorial-section-line" aria-hidden="true" />
      </div>

      <div className="editorial-playground-header">
        <h2 className="editorial-playground-headline">
          INTERACTIVE DESIGN & TERMINAL TOOLS
        </h2>
        <p className="editorial-playground-desc">
          Three client-side micro-applications demonstrating monospace typography systems, typing throughput benchmarks, and real-time canvas ASCII raster processing.
        </p>
      </div>

      {/* 3 Compact Playground Cards Grid */}
      <div className="editorial-playground-grid">
        {/* Card 1: Font Swapper */}
        <div
          className="editorial-playground-card"
          onClick={() => handleLaunch(onOpenFont)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLaunch(onOpenFont);
          }}
          aria-label="Open Monospace Font Swapper tool"
        >
          <EditorialCornerTicks />
          <div className="editorial-pg-card-top">
            <span className="editorial-pg-tag">01 // TYPOGRAPHY</span>
            <span className="editorial-pg-key-badge">F</span>
          </div>

          <div className="editorial-pg-card-body">
            <h3 className="editorial-pg-title">
              <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                Monospace Font Swapper
              </EditorialScrambleText>
            </h3>
            <p className="editorial-pg-copy">
              Test and evaluate 6 curated monospace typefaces across the entire design system in real time, with full tabular number alignment.
            </p>

            <div className="editorial-pg-specs">
              <span className="editorial-pg-spec-pill">6 TYPEFACES</span>
              <span className="editorial-pg-spec-pill">LIVE PREVIEW</span>
            </div>
          </div>

          <div className="editorial-pg-footer">
            <span className="editorial-pg-action-text">LAUNCH FONT SWAPPER</span>
            <IconArrow size={12} className="editorial-pg-arrow" />
          </div>
        </div>

        {/* Card 2: Typing Test */}
        <div
          className="editorial-playground-card"
          onClick={() => handleLaunch(onOpenType)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLaunch(onOpenType);
          }}
          aria-label="Open Speed Typing Benchmark tool"
        >
          <EditorialCornerTicks />
          <div className="editorial-pg-card-top">
            <span className="editorial-pg-tag">02 // PERFORMANCE</span>
            <span className="editorial-pg-key-badge">T</span>
          </div>

          <div className="editorial-pg-card-body">
            <h3 className="editorial-pg-title">
              <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                Speed Typing Benchmark
              </EditorialScrambleText>
            </h3>
            <p className="editorial-pg-copy">
              Benchmark your typing speed against Naveen’s 62 WPM baseline using design & fintech excerpts with live accuracy tracking and PNG export.
            </p>

            <div className="editorial-pg-specs">
              <span className="editorial-pg-spec-pill">15S / 30S / 60S</span>
              <span className="editorial-pg-spec-pill">PNG EXPORT</span>
            </div>
          </div>

          <div className="editorial-pg-footer">
            <span className="editorial-pg-action-text">START TYPING TEST</span>
            <IconArrow size={12} className="editorial-pg-arrow" />
          </div>
        </div>

        {/* Card 3: ASCII Art Studio */}
        <div
          className="editorial-playground-card"
          onClick={() => handleLaunch(onOpenAscii)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLaunch(onOpenAscii);
          }}
          aria-label="Open ASCII Art Studio tool"
        >
          <EditorialCornerTicks />
          <div className="editorial-pg-card-top">
            <span className="editorial-pg-tag">03 // CANVAS RASTER</span>
            <span className="editorial-pg-key-badge">A</span>
          </div>

          <div className="editorial-pg-card-body">
            <h3 className="editorial-pg-title">
              <EditorialScrambleText triggerOnMount={false} triggerOnHover={true} speed={20}>
                Terminal ASCII Art Studio
              </EditorialScrambleText>
            </h3>
            <p className="editorial-pg-copy">
              Convert photos, demo portraits, or live webcam streams into high-density terminal ASCII raster matrices 100% locally in your browser.
            </p>

            <div className="editorial-pg-specs">
              <span className="editorial-pg-spec-pill">4 CHARSETS</span>
              <span className="editorial-pg-spec-pill">COLOR MATRIX</span>
            </div>
          </div>

          <div className="editorial-pg-footer">
            <span className="editorial-pg-action-text">OPEN ASCII STUDIO</span>
            <IconArrow size={12} className="editorial-pg-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}
