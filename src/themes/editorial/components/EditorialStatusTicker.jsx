import React, { useState, useEffect } from 'react';
import { EDITORIAL_CONTENT } from '../editorialContent';

/**
 * EditorialStatusTicker
 * Technical live status ticker with seamless marquee, fade masks,
 * hover-pause, tab visibility detection, and reduced-motion support.
 */
export default function EditorialStatusTicker() {
  const [isTabHidden, setIsTabHidden] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const items = EDITORIAL_CONTENT.ticker;

  return (
    <div className="editorial-ticker-container" aria-label="Technical Status Ticker">
      <div className="editorial-ticker-status-badge">
        <span className="editorial-ticker-pulsar" />
        <span className="editorial-ticker-live-text">LIVE</span>
      </div>

      <div className="editorial-ticker-marquee-track">
        <div className={`editorial-ticker-marquee-content ${isTabHidden ? 'paused' : ''}`}>
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="editorial-ticker-item">
              <span className="editorial-ticker-item-lbl">[{item.label}]</span>
              <span className="editorial-ticker-item-text">{item.text}</span>
              <span className="editorial-ticker-sep">/</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
