import React from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { portfolioData } from '../../data/portfolioData';

export default function GamingTheme() {
  const { setTheme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a12',
      color: '#00ffcc',
      fontFamily: '"Courier New", monospace',
      padding: '40px 20px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <header style={{ border: '2px solid #ff0055', padding: '20px', marginBottom: '30px', boxShadow: '0 0 15px rgba(255,0,85,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#ffcc00' }}>[ LEVEL 1: PROFILE ]</span>
          <button
            id="btn-switch-win98"
            onClick={() => setTheme(THEMES.WINDOWS98)}
            style={{
              padding: '6px 14px',
              background: '#ff0055',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'inherit'
            }}
          >
            ← EXIT TO WIN98
          </button>
        </div>
        <h1 style={{ fontSize: '32px', margin: '16px 0 8px 0', color: '#fff' }}>PLAYER: {portfolioData.profile.name}</h1>
        <p style={{ color: '#00ffcc', margin: 0 }}>CLASS: {portfolioData.profile.role}</p>
      </header>

      <div style={{ border: '1px solid #00ffcc', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ color: '#ffcc00', marginTop: 0 }}>&gt; QUEST LOG / EXPERIENCE</h3>
        {portfolioData.experience.map(item => (
          <div key={item.id} style={{ marginBottom: '16px' }}>
            <div style={{ color: '#fff', fontWeight: 'bold' }}>• {item.role} @ {item.company}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>{item.period}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
