import React, { useState, useEffect, useRef } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';

// Authentic IE 16px icon
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
  onOpenWindow,
}) {
  const [history, setHistory] = useState([
    { url: 'http://naveen.design', title: 'Welcome to naveen.design', type: 'home' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [addressBar, setAddressBar] = useState('http://naveen.design');
  const [statusText, setStatusText] = useState('Done');
  const [isLoading, setIsLoading] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const loadTimerRef = useRef(null);

  const currentPage = history[historyIndex] || {
    url: 'http://naveen.design',
    title: 'Welcome to naveen.design',
    type: 'home',
  };

  // Synchronize address bar on history navigation
  useEffect(() => {
    if (currentPage) {
      setAddressBar(currentPage.url);
    }
  }, [historyIndex]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    };
  }, []);

  const navigateTo = (inputUrl, pushHistory = true) => {
    let cleanUrl = inputUrl.trim();
    if (!cleanUrl) cleanUrl = 'http://naveen.design';
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'http://' + cleanUrl;
    }

    setIsLoading(true);
    setStatusText(`Finding site: ${cleanUrl}...`);

    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);

    loadTimerRef.current = setTimeout(() => {
      const isHome =
        cleanUrl === 'http://naveen.design' ||
        cleanUrl === 'http://naveen.design/' ||
        cleanUrl === 'http://www.naveen.design' ||
        cleanUrl === 'http://www.naveen.design/' ||
        cleanUrl.toLowerCase().includes('naveen.design/home');

      const newPage = isHome
        ? {
            url: 'http://naveen.design',
            title: 'Welcome to naveen.design',
            type: 'home',
          }
        : {
            url: cleanUrl,
            title: `Cannot find server - ${cleanUrl}`,
            type: 'error',
          };

      if (pushHistory) {
        const nextHistory = [...history.slice(0, historyIndex + 1), newPage];
        setHistory(nextHistory);
        setHistoryIndex(nextHistory.length - 1);
      } else {
        const updatedHistory = [...history];
        updatedHistory[historyIndex] = newPage;
        setHistory(updatedHistory);
      }

      setAddressBar(newPage.url);
      setIsLoading(false);
      setStatusText('Done');
    }, 450);
  };

  const handleStop = () => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
    }
    setIsLoading(false);
    setStatusText('Done');
  };

  const handleRefresh = () => {
    navigateTo(currentPage.url, false);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      handleStop();
      setHistoryIndex(historyIndex - 1);
      setStatusText('Done');
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      handleStop();
      setHistoryIndex(historyIndex + 1);
      setStatusText('Done');
    }
  };

  const handleHome = () => {
    navigateTo('http://naveen.design');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    navigateTo(addressBar);
  };

  const openPortfolioWindow = (key) => {
    if (onOpenWindow) {
      onOpenWindow(key);
    }
  };

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Window', onClick: () => navigateTo('http://naveen.design') },
        { label: 'Open...', onClick: () => navigateTo('http://naveen.design') },
        { isSeparator: true },
        { label: 'Save As...', disabled: true },
        { isSeparator: true },
        { label: 'Close', onClick: onClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Cut', disabled: true },
        { label: 'Copy', disabled: true },
        { label: 'Paste', disabled: true },
        { isSeparator: true },
        { label: 'Select All', disabled: true },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Stop', onClick: handleStop },
        { label: 'Refresh', onClick: handleRefresh },
      ],
    },
    {
      label: 'Favorites',
      items: [
        {
          label: 'Me.exe',
          onClick: () => openPortfolioWindow('myComputer'),
        },
        {
          label: 'Made',
          onClick: () => openPortfolioWindow('made'),
        },
        {
          label: 'Hello',
          onClick: () => openPortfolioWindow('hello'),
        },
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
    boxShadow: '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
    border: 'none',
    fontSize: '11px',
    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
    cursor: disabled ? 'default' : 'pointer',
    color: disabled ? '#808080' : '#000000',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    userSelect: 'none',
    boxSizing: 'border-box',
    height: '22px',
  });

  const windowTitle = currentPage.type === 'home'
    ? 'Welcome to naveen.design - Microsoft Internet Explorer'
    : `${currentPage.title} - Microsoft Internet Explorer`;

  return (
    <>
      <Window
        id="window-internet-explorer"
        title={windowTitle}
        icon={<InternetExplorerIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={680}
        defaultHeight={500}
        resizable={true}
        allowMaximize={true}
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
            fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          }}
        >
          {/* Navigation Toolbar */}
          <div
            style={{
              background: '#C0C0C0',
              borderBottom: '1px solid #808080',
              padding: '3px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '4px',
              boxSizing: 'border-box',
            }}
          >
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                style={toolbarBtnStyle(historyIndex === 0)}
                onClick={handleBack}
                disabled={historyIndex === 0}
                title="Back"
              >
                <span style={{ fontSize: '12px' }}>&larr;</span> Back
              </button>
              <button
                style={toolbarBtnStyle(historyIndex >= history.length - 1)}
                onClick={handleForward}
                disabled={historyIndex >= history.length - 1}
                title="Forward"
              >
                Forward <span style={{ fontSize: '12px' }}>&rarr;</span>
              </button>
              <button style={toolbarBtnStyle(!isLoading)} onClick={handleStop} title="Stop">
                <span style={{ color: '#C00000', fontWeight: 'bold' }}>&times;</span> Stop
              </button>
              <button style={toolbarBtnStyle()} onClick={handleRefresh} title="Refresh">
                <span style={{ color: '#008000' }}>&#8635;</span> Refresh
              </button>
              <button style={toolbarBtnStyle()} onClick={handleHome} title="Home">
                <span>&#8962;</span> Home
              </button>
            </div>

            {/* Spinning IE 'e' Logo */}
            <div
              style={{
                width: '26px',
                height: '24px',
                background: '#000000',
                border: '2px inset #DFDFDF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
              title={isLoading ? 'Loading page...' : 'Internet Explorer'}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: isLoading ? 'ie-spin-animation 1s linear infinite' : 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="7" fill="#0066CC" />
                  <ellipse cx="9" cy="9" rx="8" ry="3.5" fill="none" stroke="#FFCC00" strokeWidth="1.5" transform="rotate(-25 9 9)" />
                  <text x="6" y="12" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="Arial">e</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Address Bar */}
          <form
            onSubmit={handleAddressSubmit}
            style={{
              background: '#C0C0C0',
              borderBottom: '1px solid #808080',
              padding: '3px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxSizing: 'border-box',
              margin: 0,
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: '#000000',
                fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                userSelect: 'none',
              }}
            >
              Address:
            </span>
            <input
              type="text"
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              style={{
                flex: 1,
                height: '21px',
                background: '#FFFFFF',
                boxShadow: '1px 1px 0px #808080 inset, -1px -1px 0px #DFDFDF inset, 2px 2px 0px #000000 inset, -2px -2px 0px #FFFFFF inset',
                border: 'none',
                padding: '0 5px',
                fontSize: '11px',
                fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                color: '#000000',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '1px 10px',
                height: '21px',
                background: '#C0C0C0',
                boxShadow: '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset, 1px 1px 0px white, -1px -1px 0px black',
                border: 'none',
                fontSize: '11px',
                fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                cursor: 'pointer',
                color: '#000000',
                boxSizing: 'border-box',
              }}
            >
              Go
            </button>
          </form>

          {/* Browser Content Area */}
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              boxShadow: '1px 1px 0px #808080 inset, -1px -1px 0px #DFDFDF inset, 2px 2px 0px #000000 inset, -2px -2px 0px #FFFFFF inset',
              overflowY: 'auto',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* HOME PAGE */}
            {currentPage.type === 'home' && (
              <div
                style={{
                  padding: '24px 28px',
                  fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                  color: '#000000',
                  lineHeight: '1.5',
                }}
              >
                {/* Vintage Header */}
                <div
                  style={{
                    background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
                    color: '#FFFFFF',
                    padding: '10px 14px',
                    border: '2px solid #808080',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        color: '#FFFF00',
                      }}
                    >
                      Welcome to naveen.design
                    </h1>
                    <div style={{ fontSize: '11px', marginTop: '2px', color: '#E0E0FF' }}>
                      Senior Product Designer: Fintech, Trading Terminals and AI Systems
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#000000',
                      color: '#00FF00',
                      border: '1px inset #808080',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    HIT: 004289
                  </div>
                </div>

                <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
                  Explore the portfolio through native Windows 98 desktop windows. Click any destination below to launch:
                </p>

                {/* 3 Portal Links */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    margin: '18px 0',
                  }}
                >
                  {/* Link 1: Me.exe */}
                  <div
                    onClick={() => openPortfolioWindow('myComputer')}
                    style={{
                      background: '#F0F0F0',
                      border: '2px outset #FFFFFF',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>&#128187;</span>
                      <a
                        href="#me"
                        onClick={(e) => {
                          e.preventDefault();
                          openPortfolioWindow('myComputer');
                        }}
                        style={{
                          color: '#0000FF',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textDecoration: 'underline',
                        }}
                      >
                        Me.exe
                      </a>
                    </div>
                    <div style={{ fontSize: '11px', color: '#555555' }}>
                      Profile, career highlights, design philosophy and contact.
                    </div>
                  </div>

                  {/* Link 2: Made */}
                  <div
                    onClick={() => openPortfolioWindow('made')}
                    style={{
                      background: '#F0F0F0',
                      border: '2px outset #FFFFFF',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>&#128193;</span>
                      <a
                        href="#made"
                        onClick={(e) => {
                          e.preventDefault();
                          openPortfolioWindow('made');
                        }}
                        style={{
                          color: '#0000FF',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textDecoration: 'underline',
                        }}
                      >
                        Made
                      </a>
                    </div>
                    <div style={{ fontSize: '11px', color: '#555555' }}>
                      Case studies, client projects and product design catalog.
                    </div>
                  </div>

                  {/* Link 3: Hello */}
                  <div
                    onClick={() => openPortfolioWindow('hello')}
                    style={{
                      background: '#F0F0F0',
                      border: '2px outset #FFFFFF',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>&#128236;</span>
                      <a
                        href="#hello"
                        onClick={(e) => {
                          e.preventDefault();
                          openPortfolioWindow('hello');
                        }}
                        style={{
                          color: '#0000FF',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textDecoration: 'underline',
                        }}
                      >
                        Hello
                      </a>
                    </div>
                    <div style={{ fontSize: '11px', color: '#555555' }}>
                      Send an inquiry, schedule a call, or connect on LinkedIn.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid #808080',
                    borderBottom: '1px solid #FFFFFF',
                    margin: '18px 0',
                  }}
                />

                <div style={{ fontSize: '11px', color: '#555555', textAlign: 'center' }}>
                  Microsoft Internet Explorer 5.0 | Best viewed in 800x600 resolution
                </div>
              </div>
            )}

            {/* ERROR PAGE: The page cannot be displayed */}
            {currentPage.type === 'error' && (
              <div
                style={{
                  padding: '24px 28px',
                  fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                  color: '#000000',
                  lineHeight: '1.5',
                }}
              >
                <h1
                  style={{
                    color: '#000000',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: '0 0 12px 0',
                  }}
                >
                  The page cannot be displayed
                </h1>

                <p style={{ fontSize: '11px', margin: '0 0 14px 0' }}>
                  The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.
                </p>

                <div
                  style={{
                    borderTop: '1px solid #808080',
                    borderBottom: '1px solid #FFFFFF',
                    margin: '14px 0',
                  }}
                />

                <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  Please try the following:
                </p>

                <ul style={{ fontSize: '11px', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                  <li style={{ marginBottom: '6px' }}>
                    Click the{' '}
                    <a
                      href="#refresh"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRefresh();
                      }}
                      style={{ color: '#0000FF', textDecoration: 'underline' }}
                    >
                      Refresh
                    </a>{' '}
                    button, or try again later.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    If you typed the page address in the Address bar, make sure that it is spelled correctly.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    Click the{' '}
                    <a
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault();
                        handleHome();
                      }}
                      style={{ color: '#0000FF', textDecoration: 'underline' }}
                    >
                      Home
                    </a>{' '}
                    button to return to the home page.
                  </li>
                </ul>

                <div
                  style={{
                    borderTop: '1px solid #808080',
                    borderBottom: '1px solid #FFFFFF',
                    margin: '14px 0',
                  }}
                />

                <div style={{ fontSize: '11px', color: '#333333', marginTop: '14px' }}>
                  <strong>Cannot find server or DNS Error</strong>
                  <div style={{ color: '#666666', fontStyle: 'italic', marginTop: '4px' }}>
                    Probably because I'm still designing it.
                  </div>
                  <div style={{ marginTop: '8px', color: '#888888' }}>
                    Internet Explorer
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Window>

      {/* About Internet Explorer Dialog */}
      <AboutAppDialog
        isOpen={showAboutDialog}
        appName="Microsoft Internet Explorer"
        version="Version 5.00.2919.6307 (Windows 98)"
        icon={<InternetExplorerIconSmall />}
        description="Browse the World Wide Web, or what is left of it."
        onClose={() => setShowAboutDialog(false)}
      />

      <style>{`
        @keyframes ie-spin-animation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
