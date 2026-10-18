import React, { useState } from 'react';

export default function MeridianDesignSystems() {
  const [activeSide, setActiveSide] = useState('BUY');
  const [orderQty, setOrderQty] = useState(50);
  const [orderPrice, setOrderPrice] = useState(2450.75);

  const tokens = [
    { name: 'FINTECH_BUY', hex: '#10B981', color: '#10B981', role: 'Executions & Gains' },
    { name: 'FINTECH_SELL', hex: '#EF4444', color: '#EF4444', role: 'Stop-loss & Exits' },
    { name: 'GOLD_ACCENT', hex: '#D4AF37', color: '#D4AF37', role: 'Primary Highlights' },
    { name: 'SURFACE_OBSIDIAN', hex: '#0D0D12', color: '#0D0D12', role: 'Deep Contrast Glass' }
  ];

  return (
    <section id="systems" className="meridian-section" aria-label="Design Systems and Architecture">
      <div className="meridian-header-block">
        <div className="meridian-subheading">Section 04 // Systems Thinking</div>
        <h2 className="meridian-heading">Design Systems.</h2>
        <p className="meridian-heading-desc">
          Unified multi-platform design architecture powering 4 enterprise investor applications with 140+ synchronized design tokens.
        </p>
      </div>

      <div className="meridian-systems-grid">
        {/* Left Card: Token System & Typography */}
        <div className="meridian-systems-specimen-card">
          <div className="meridian-specimen-header">
            <h3 className="meridian-specimen-title">Semantic Design Tokens</h3>
            <span className="meridian-specimen-badge">140+ TOKENS // SCALED</span>
          </div>

          <div className="meridian-token-swatches">
            {tokens.map((t) => (
              <div key={t.name} className="meridian-swatch">
                <div
                  className="meridian-swatch-box"
                  style={{ backgroundColor: t.color }}
                  aria-label={`${t.name}: ${t.hex}`}
                ></div>
                <span className="meridian-swatch-name">{t.name}</span>
                <span className="meridian-swatch-hex">{t.hex}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.72rem', color: 'var(--mr-text-muted)', marginBottom: '0.75rem', letterSpacing: '0.12em' }}>
              TYPOGRAPHY & HIERARCHY MATRICES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--mr-border-hairline)', paddingBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--mr-font-serif)', fontSize: '1.6rem', color: 'var(--mr-text-primary)' }}>Hero Display Header</span>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.68rem', color: 'var(--mr-gold)' }}>Instrument Serif • clamp(2.4rem, 6vw)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--mr-border-hairline)', paddingBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--mr-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--mr-text-secondary)' }}>UI Interface & Labels</span>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.68rem', color: 'var(--mr-gold)' }}>Inter Medium • 14px / 16px</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.95rem', color: 'var(--mr-text-primary)' }}>Tabular Market Data Streams</span>
                <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.68rem', color: 'var(--mr-gold)' }}>JetBrains Mono • tnum 12px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Interactive Financial Specimen */}
        <div className="meridian-systems-specimen-card">
          <div className="meridian-specimen-header">
            <h3 className="meridian-specimen-title">Atomic Component Specimen</h3>
            <span className="meridian-specimen-badge">LIVE INTERACTIVE ORDER TICKET</span>
          </div>

          <div className="meridian-component-demo-box">
            <div className="meridian-demo-row">
              <span style={{ fontFamily: 'var(--mr-font-sans)', fontWeight: 600, fontSize: '0.9rem' }}>NIFTY 50 • SPOT EQUITIES</span>
              <span style={{ fontFamily: 'var(--mr-font-mono)', color: '#10B981', fontSize: '0.82rem' }}>+1.42% ▲</span>
            </div>

            {/* Buy / Sell Pill Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem', borderRadius: '8px' }}>
              <button
                style={{
                  background: activeSide === 'BUY' ? '#10B981' : 'transparent',
                  color: activeSide === 'BUY' ? '#000' : 'var(--mr-text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem',
                  fontFamily: 'var(--mr-font-sans)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveSide('BUY')}
              >
                BUY (LONG)
              </button>
              <button
                style={{
                  background: activeSide === 'SELL' ? '#EF4444' : 'transparent',
                  color: activeSide === 'SELL' ? '#fff' : 'var(--mr-text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem',
                  fontFamily: 'var(--mr-font-sans)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveSide('SELL')}
              >
                SELL (SHORT)
              </button>
            </div>

            {/* Market Bid/Ask Spread */}
            <div className="meridian-demo-bidask">
              <div className="meridian-bid-pill">
                <span>BID (50 QTY)</span>
                <span>₹2,450.50</span>
              </div>
              <div className="meridian-ask-pill">
                <span>ASK (75 QTY)</span>
                <span>₹2,451.00</span>
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.65rem', color: 'var(--mr-text-muted)', display: 'block', marginBottom: '0.3rem' }}>LOT QUANTITY</label>
                <input
                  type="number"
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  style={{ width: '100%', background: '#121218', border: '1px solid var(--mr-border-subtle)', color: '#fff', padding: '0.6rem', borderRadius: '6px', fontFamily: 'var(--mr-font-mono)', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.65rem', color: 'var(--mr-text-muted)', display: 'block', marginBottom: '0.3rem' }}>LIMIT PRICE (₹)</label>
                <input
                  type="number"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(Number(e.target.value))}
                  style={{ width: '100%', background: '#121218', border: '1px solid var(--mr-border-subtle)', color: '#fff', padding: '0.6rem', borderRadius: '6px', fontFamily: 'var(--mr-font-mono)', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="meridian-demo-row" style={{ borderTop: '1px solid var(--mr-border-hairline)', paddingTop: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.75rem', color: 'var(--mr-text-muted)' }}>ESTIMATED MARGIN</span>
              <span style={{ fontFamily: 'var(--mr-font-mono)', fontSize: '0.9rem', color: 'var(--mr-gold)' }}>₹{(orderQty * orderPrice).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <button
              className="meridian-demo-order-btn"
              style={{
                background: activeSide === 'BUY' ? 'var(--mr-gold)' : '#EF4444',
                color: activeSide === 'BUY' ? '#070709' : '#fff'
              }}
            >
              EXECUTE {activeSide} ORDER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
