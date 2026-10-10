import React, { useState } from 'react';
import { DESIGN_SYSTEM_TOKENS } from '../editorialData';
import { editorialAudio } from '../editorialAudio';
import { EDITORIAL_CONTENT } from '../editorialContent';
import { EditorialCornerTicks } from './EditorialIcons';

export default function EditorialDesignSystemSection({ onShowToast }) {
  const [activeBtnState, setActiveBtnState] = useState('DEFAULT');
  const [testScale, setTestScale] = useState(16);
  const [testInput, setTestInput] = useState('');

  const handleCopyColor = (color) => {
    editorialAudio.playSuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(color.hex);
    }
    if (onShowToast) {
      onShowToast({
        title: 'TOKEN COPIED',
        message: `${color.name} (${color.hex}) copied to clipboard`
      });
    }
  };

  return (
    <section id="design-system-section" className="editorial-section">
      <EditorialCornerTicks />
      <div className="editorial-section-tag">
        <span className="editorial-section-indicator" />
        <span className="editorial-section-title">{EDITORIAL_CONTENT.sections.designSystem}</span>
        <div className="editorial-section-line" aria-hidden="true" />
      </div>

      <div className="editorial-ds-intro">
        <h2 className="editorial-ds-headline">SYSTEM TOKENS & ATOMIC FOUNDATIONS</h2>
        <p className="editorial-ds-desc">
          A codified design system built for fintech scalability. Strict mathematical scales, WCAG 2.1 AAA contrast compliance, and unified multi-platform primitives.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="editorial-ds-block">
        <div className="editorial-ds-block-header">
          <span className="editorial-ds-subheading">01 / COLOR TOKENS & CONTRAST RATIOS</span>
          <span className="editorial-ds-hint">CLICK TO COPY HEX</span>
        </div>

        <div className="editorial-ds-swatches-grid">
          {DESIGN_SYSTEM_TOKENS.colors.map((color) => (
            <div
              key={color.hex}
              className="editorial-ds-color-card"
              onClick={() => handleCopyColor(color)}
              title={`Click to copy ${color.hex}`}
            >
              <div
                className="editorial-ds-swatch-box"
                style={{ backgroundColor: color.hex }}
              >
                <span className="editorial-ds-swatch-copy-hint">COPY</span>
              </div>
              <div className="editorial-ds-color-info">
                <span className="editorial-ds-color-name">{color.name}</span>
                <span className="editorial-ds-color-hex">{color.hex}</span>
                <span className="editorial-ds-color-role">{color.role}</span>
                <span className="editorial-ds-contrast-badge">{color.contrast}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography Hierarchy Explorer */}
      <div className="editorial-ds-block">
        <div className="editorial-ds-block-header">
          <span className="editorial-ds-subheading">02 / TYPOGRAPHY SCALE SPECIFICATIONS</span>
          <span className="editorial-ds-hint">JETBRAINS MONO · TABULAR NUMS</span>
        </div>

        <div className="editorial-ds-type-table">
          {DESIGN_SYSTEM_TOKENS.typography.map((item, idx) => (
            <div key={idx} className="editorial-ds-type-row">
              <div className="editorial-ds-type-meta">
                <span className="editorial-ds-type-level">{item.level}</span>
                <span className="editorial-ds-type-specs">{item.size} · {item.weight}</span>
              </div>
              <div className="editorial-ds-type-preview">
                <span className="editorial-ds-type-sample" style={{ fontWeight: item.weight.includes('800') ? 800 : item.weight.includes('700') ? 700 : 400 }}>
                  {item.usage} — 0123456789
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Scale Slider */}
        <div className="editorial-ds-scale-slider-box">
          <div className="editorial-ds-slider-header">
            <span>LIVE TYPE SCALE TESTER: {testScale}px</span>
            <span>LINE-HEIGHT: 1.5 · LETTER-SPACING: -0.2px</span>
          </div>
          <input
            type="range"
            min="11"
            max="32"
            value={testScale}
            onChange={(e) => {
              editorialAudio.playClick();
              setTestScale(Number(e.target.value));
            }}
            className="editorial-ds-range-slider"
          />
          <p className="editorial-ds-live-sample" style={{ fontSize: `${testScale}px` }}>
            The quick brown fox jumps over the 9,876,543.21 high-frequency market depth ledger.
          </p>
        </div>
      </div>

      {/* 3. Interactive Component States Playground */}
      <div className="editorial-ds-block">
        <div className="editorial-ds-block-header">
          <span className="editorial-ds-subheading">03 / INTERACTIVE COMPONENT STATES PLAYGROUND</span>
          <span className="editorial-ds-hint">INTERACTIVE TOKENS</span>
        </div>

        <div className="editorial-ds-playground-grid">
          {/* Buttons Playground */}
          <div className="editorial-ds-play-card">
            <span className="editorial-ds-play-title">BUTTON PRIMITIVES</span>
            <div className="editorial-ds-play-row">
              <button
                type="button"
                className={`editorial-contact-btn ${activeBtnState === 'LOADING' ? 'loading' : ''}`}
                disabled={activeBtnState === 'DISABLED'}
                onClick={() => {
                  editorialAudio.playClick();
                  setActiveBtnState(prev => prev === 'DEFAULT' ? 'ACTIVE' : prev === 'ACTIVE' ? 'LOADING' : 'DEFAULT');
                }}
              >
                {activeBtnState === 'LOADING' ? 'EXECUTING...' : 'PRIMARY CTA'}
              </button>

              <button
                type="button"
                className="editorial-cta-btn"
                style={{ padding: '10px 18px', fontSize: '11px' }}
                onClick={() => editorialAudio.playClick()}
              >
                SECONDARY INK +
              </button>

              <button
                type="button"
                className="editorial-theme-btn"
                onClick={() => editorialAudio.playClick()}
              >
                OUTLINED GHOST
              </button>
            </div>
            <div className="editorial-ds-play-state-pills">
              {['DEFAULT', 'ACTIVE', 'LOADING', 'DISABLED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`editorial-ds-state-pill ${activeBtnState === st ? 'active' : ''}`}
                  onClick={() => {
                    editorialAudio.playClick();
                    setActiveBtnState(st);
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Form Elements */}
          <div className="editorial-ds-play-card">
            <span className="editorial-ds-play-title">FORM INPUT PRIMITIVE</span>
            <div className="editorial-ds-input-group">
              <label className="editorial-ds-input-lbl">ORDER QUANTITY / INPUT</label>
              <div className="editorial-ds-input-wrap">
                <input
                  type="text"
                  className="editorial-ds-input"
                  placeholder="Enter lot size or symbol..."
                  value={testInput}
                  onChange={(e) => {
                    editorialAudio.playClick();
                    setTestInput(e.target.value);
                  }}
                />
                <span className="editorial-ds-input-badge">{testInput.length} CHARS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
