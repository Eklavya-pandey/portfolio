import React, { useState, useEffect } from 'react';
import Window from '../../components/Window';
import { portfolioData } from '../../../../data/portfolioData';
import { CASE_STUDIES } from '../../../../data/projectsData';

// Small IE Icon
export const InternetExplorerIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#0066CC" />
    <path d="M1 8 C4 13 12 13 15 8 C12 3 4 3 1 8 Z" fill="#FFCC00" opacity="0.9" />
    <text x="5" y="11" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="Arial">e</text>
  </svg>
);

export default function InternetExplorerWindow({
  isOpen,
  isActive,
  isMaximized,
  zIndex,
  position,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
}) {
  const [history, setHistory] = useState(['/home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [addressBar, setAddressBar] = useState('http://naveen.design/home');
  const [statusText, setStatusText] = useState('Done');
  const [isThrobberActive, setIsThrobberActive] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Close dialog on Escape key
  useEffect(() => {
    if (!showErrorDialog && !showAboutDialog) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showErrorDialog) setShowErrorDialog(false);
        if (showAboutDialog) setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showErrorDialog, showAboutDialog]);

  const currentRoute = history[historyIndex] || '/home';

  // Navigate to an internal route
  const navigateTo = (route, pushToHistory = true) => {
    setIsThrobberActive(true);
    setStatusText('Opening page...');

    setTimeout(() => {
      let resolvedRoute = route;
      const lower = route.trim().toLowerCase();

      if (lower === '/' || lower === '/home' || lower === 'home' || lower === 'http://naveen.design/home') {
        resolvedRoute = '/home';
      } else if (lower.includes('work') || lower === '/work' || lower === 'work.html') {
        resolvedRoute = '/work';
      } else if (lower.includes('about') || lower === '/about' || lower === 'about.html') {
        resolvedRoute = '/about';
      } else if (lower.includes('contact') || lower === '/contact' || lower === 'contact.html') {
        resolvedRoute = '/contact';
      } else {
        resolvedRoute = '/error';
        setShowErrorDialog(true);
      }

      if (pushToHistory) {
        const nextHistory = [...history.slice(0, historyIndex + 1), resolvedRoute];
        setHistory(nextHistory);
        setHistoryIndex(nextHistory.length - 1);
      }

      setAddressBar(`http://naveen.design${resolvedRoute}`);
      setStatusText('Done');
      setIsThrobberActive(false);
    }, 250);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setAddressBar(`http://naveen.design${history[prevIdx]}`);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setAddressBar(`http://naveen.design${history[nextIdx]}`);
    }
  };

  const handleRefresh = () => {
    navigateTo(currentRoute, false);
  };

  const handleHome = () => {
    navigateTo('/home');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    navigateTo(addressBar);
  };

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Window', onClick: () => navigateTo('/home') },
        { label: 'Save As...', onClick: () => alert('Save Web Page') },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Cut' },
        { label: 'Copy' },
        { label: 'Paste' },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Stop', onClick: () => setIsThrobberActive(false) },
        { label: 'Refresh (F5)', onClick: handleRefresh },
      ],
    },
    {
      label: 'Favorites',
      items: [
        { label: 'Work', onClick: () => navigateTo('/work') },
        { label: 'About Me', onClick: () => navigateTo('/about') },
        { label: 'Contact', onClick: () => navigateTo('/contact') },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Internet Explorer',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  const toolbarBtnStyle = (disabled = false) => ({
    padding: '2px 6px',
    background: '#C0C0C0',
    border: '2px solid',
    borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    fontSize: '11px',
    cursor: disabled ? 'default' : 'pointer',
    color: disabled ? '#808080' : '#000000',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    userSelect: 'none',
  });

  return (
    <Window
      id="window-internet-explorer"
      title="Microsoft Internet Explorer - [Naveen Kumar Pandey]"
      icon={<InternetExplorerIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={680}
      defaultHeight={500}
      hasMenu={true}
      menuItems={menuItems}
      hasStatusBar={true}
      statusText={statusText}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#C0C0C0',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Navigation Toolbar */}
        <div
          style={{
            background: '#C0C0C0',
            borderBottom: '2px solid #808080',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '4px',
            boxSizing: 'border-box',
          }}
        >
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            <button
              style={toolbarBtnStyle(historyIndex === 0)}
              onClick={handleBack}
              disabled={historyIndex === 0}
            >
              ⬅️ Back
            </button>
            <button
              style={toolbarBtnStyle(historyIndex >= history.length - 1)}
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
            >
              Forward ➡️
            </button>
            <button style={toolbarBtnStyle()} onClick={() => setIsThrobberActive(false)}>
              🛑 Stop
            </button>
            <button style={toolbarBtnStyle()} onClick={handleRefresh}>
              🔄 Refresh
            </button>
            <button style={toolbarBtnStyle()} onClick={handleHome}>
              🏠 Home
            </button>
          </div>

          {/* Animated IE Throbber Logo */}
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#00BFFF',
                fontWeight: 'bold',
                transform: isThrobberActive ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease',
              }}
            >
              e
            </div>
          </div>
        </div>

        {/* Address Bar */}
        <form
          onSubmit={handleAddressSubmit}
          style={{
            background: '#C0C0C0',
            borderBottom: '2px solid #808080',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxSizing: 'border-box',
            margin: 0,
          }}
        >
          <span style={{ fontSize: '11px', color: '#000' }}>Address:</span>
          <input
            type="text"
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            style={{
              flex: 1,
              height: '20px',
              background: '#FFFFFF',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              padding: '0 4px',
              fontSize: '11px',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          />
          <button
            type="submit"
            style={{
              padding: '1px 8px',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Go
          </button>
        </form>

        {/* Browser Page Frame Content (Internal Pages Only) */}
        <div
          style={{
            flex: 1,
            background: '#FFFFFF',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            overflowY: 'auto',
            padding: '16px',
            boxSizing: 'border-box',
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          {/* Route: /home */}
          {currentRoute === '/home' && (
            <div>
              <div
                style={{
                  textAlign: 'center',
                  background: 'linear-gradient(90deg, #000080, #1084D0)',
                  color: '#FFFF00',
                  padding: '8px',
                  fontFamily: 'Impact, Arial, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '1px',
                  marginBottom: '14px',
                }}
              >
                ✨ WELCOME TO NAVEEN KUMAR PANDEY'S CYBER SPACE ✨
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1, fontSize: '13px', lineHeight: '18px' }}>
                  <p><strong>{portfolioData.profile.headline}</strong></p>
                  <p><em>{portfolioData.profile.role}</em></p>
                  <p>{portfolioData.profile.summary}</p>
                  <p>{portfolioData.profile.quote}</p>
                </div>
                <div
                  style={{
                    width: '180px',
                    border: '2px groove #808080',
                    background: '#FFFFE0',
                    padding: '8px',
                    fontSize: '11px',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>QUICK NAV:</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><a href="#work" onClick={(e) => { e.preventDefault(); navigateTo('/work'); }} style={{ color: '#0000FF' }}>Work & Projects</a></li>
                    <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('/about'); }} style={{ color: '#0000FF' }}>About Me</a></li>
                    <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }} style={{ color: '#0000FF' }}>Contact Form</a></li>
                  </ul>
                </div>
              </div>

              <hr style={{ border: '1px inset #808080', margin: '14px 0' }} />

              <div style={{ textAlign: 'center', fontSize: '11px', fontFamily: 'Arial, sans-serif', color: '#555' }}>
                Visitors: <span style={{ background: '#000', color: '#00FF00', padding: '1px 6px', fontFamily: 'Courier New', fontWeight: 'bold' }}>004289</span>
                <div style={{ marginTop: '4px' }}>Best viewed in 800x600 resolution with Internet Explorer 5.0</div>
              </div>
            </div>
          )}

          {/* Route: /work */}
          {currentRoute === '/work' && (
            <div>
              <h2 style={{ color: '#000080', borderBottom: '2px solid #000080', paddingBottom: '4px', margin: '0 0 12px 0' }}>
                Featured Projects & Case Studies
              </h2>

              {/* OneStepPrint Case Study */}
              <div style={{ border: '1px solid #808080', padding: '10px', background: '#F8F8F8', marginBottom: '14px' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#800000' }}>{CASE_STUDIES.onestepprint.title}</h3>
                <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '6px' }}>
                  Client: {CASE_STUDIES.onestepprint.header.meta.client} | Services: {CASE_STUDIES.onestepprint.header.meta.services}
                </div>
                <p style={{ fontSize: '13px', lineHeight: '18px', margin: '0 0 8px 0' }}>
                  <strong>Brief:</strong> {CASE_STUDIES.onestepprint.brief.text}
                </p>
                <p style={{ fontSize: '13px', lineHeight: '18px', margin: '0 0 8px 0' }}>
                  <strong>Concept:</strong> {CASE_STUDIES.onestepprint.concept.title} - {CASE_STUDIES.onestepprint.concept.intro}
                </p>
                <div style={{ fontSize: '12px' }}>
                  <strong>Key Problems Addressed:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                    {CASE_STUDIES.onestepprint.problem.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Freelance & Experience Work */}
              <h3 style={{ color: '#000080', margin: '14px 0 8px 0' }}>Client Deliverables</h3>
              <table border="1" cellPadding="4" cellSpacing="0" style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#E0E0E0' }}>
                  <tr>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.freelanceClients.map((c, i) => (
                    <tr key={i}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.project}</td>
                      <td>{c.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Route: /about */}
          {currentRoute === '/about' && (
            <div>
              <h2 style={{ color: '#000080', borderBottom: '2px solid #000080', paddingBottom: '4px', margin: '0 0 12px 0' }}>
                About Naveen Kumar Pandey
              </h2>
              <p style={{ fontSize: '13px', lineHeight: '18px' }}>
                {portfolioData.profile.summary}
              </p>
              <h3 style={{ color: '#800000', margin: '12px 0 6px 0' }}>Work Experience</h3>
              {portfolioData.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                    {exp.role} — <span style={{ color: '#000080' }}>{exp.company}</span> ({exp.period})
                  </div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{exp.description}</div>
                </div>
              ))}
              <h3 style={{ color: '#800000', margin: '12px 0 6px 0' }}>Education</h3>
              {portfolioData.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '6px', fontSize: '12px' }}>
                  <strong>{edu.degree}</strong> - {edu.school} ({edu.period})
                </div>
              ))}
            </div>
          )}

          {/* Route: /contact */}
          {currentRoute === '/contact' && (
            <div>
              <h2 style={{ color: '#000080', borderBottom: '2px solid #000080', paddingBottom: '4px', margin: '0 0 12px 0' }}>
                Get In Touch
              </h2>
              <p style={{ fontSize: '13px', lineHeight: '18px' }}>
                I am always excited to discuss fintech platforms, trading terminals, AI copilots, or digital products.
              </p>
              <div style={{ background: '#F0F0F0', border: '1px solid #CCC', padding: '10px', fontSize: '12px', marginBottom: '14px' }}>
                <div><strong>Location:</strong> {portfolioData.profile.location}</div>
                <div><strong>Email:</strong> <a href={`mailto:${portfolioData.profile.email}`} style={{ color: '#0000FF' }}>{portfolioData.profile.email}</a></div>
                <div><strong>LinkedIn:</strong> <a href={portfolioData.profile.links.linkedin.url} target="_blank" rel="noreferrer" style={{ color: '#0000FF' }}>{portfolioData.profile.links.linkedin.label}</a></div>
                <div><strong>Behance:</strong> <a href={portfolioData.profile.links.behance.url} target="_blank" rel="noreferrer" style={{ color: '#0000FF' }}>{portfolioData.profile.links.behance.label}</a></div>
              </div>
            </div>
          )}

          {/* Route: /error (Cannot find server) */}
          {currentRoute === '/error' && (
            <div style={{ fontFamily: 'Arial, sans-serif', padding: '10px' }}>
              <h1 style={{ color: '#000000', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                The page cannot be displayed
              </h1>
              <p style={{ fontSize: '12px', lineHeight: '18px' }}>
                The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.
              </p>
              <hr style={{ border: '1px inset #808080', margin: '12px 0' }} />
              <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Please try the following:</p>
              <ul style={{ fontSize: '12px', lineHeight: '18px' }}>
                <li>Click the <a href="#refresh" onClick={(e) => { e.preventDefault(); handleRefresh(); }} style={{ color: '#0000FF' }}>Refresh</a> button, or try again later.</li>
                <li>If you typed the page address in the Address bar, make sure that it is spelled correctly (try <code>/work</code>, <code>/about</code>, or <code>/contact</code>).</li>
                <li>Click the <a href="#home" onClick={(e) => { e.preventDefault(); handleHome(); }} style={{ color: '#0000FF' }}>Home</a> button to return to the home page.</li>
              </ul>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '16px' }}>
                Cannot find server or DNS Error<br />
                Internet Explorer
              </div>
            </div>
          )}
        </div>

        {/* Cannot find server Windows 98 dialog */}
        {showErrorDialog && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: '3px 3px 10px rgba(0,0,0,0.5)',
              padding: '16px 20px',
              zIndex: 100,
              minWidth: '280px',
              maxWidth: '360px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#FFFF00',
                  border: '2px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#000000',
                  flexShrink: 0,
                }}
              >
                !
              </div>
              <div style={{ fontSize: '12px', lineHeight: '16px', color: '#000000' }}>
                <strong>Cannot find server</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  Internet Explorer cannot open the site {addressBar}. The page does not exist or server was not found.
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                className="win-btn"
                onClick={() => setShowErrorDialog(false)}
                style={{
                  padding: '3px 20px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '11px',
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* About Dialog */}
        {showAboutDialog && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: '3px 3px 10px rgba(0,0,0,0.5)',
              padding: '16px 24px',
              zIndex: 100,
              minWidth: '240px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Internet Explorer
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Microsoft Internet Explorer 5.0 for Windows 98.
            </p>
            <button
              className="win-btn"
              onClick={() => setShowAboutDialog(false)}
              style={{
                padding: '3px 16px',
                background: '#C0C0C0',
                border: '2px solid',
                borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </Window>
  );
}
