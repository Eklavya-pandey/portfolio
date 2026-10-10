import React, { useState, useRef, useEffect } from 'react';
import Window from '../components/Window';
import { FolderIconSmall, MadeIcon } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function MadeWindow({
  isOpen,
  isActive,
  isMaximized,
  zIndex,
  position,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onOpenNova,
}) {
  const { projects } = portfolioData;
  const { playSound } = useSound();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const rowsContainerRef = useRef(null);
  const trackRef = useRef(null);
  const [thumbTop, setThumbTop] = useState(4);

  const selectedProject = projects[selectedIndex] || projects[0];

  // Details metadata matching vanilla implementation
  const projectMetadata = [
    {
      title: 'Stock Trading App',
      role: 'Product Designer',
      platform: 'Android + iOS',
      focus: ['Information Architecture', 'Interaction Design', 'Market Data', 'Portfolio', 'Charts'],
    },
    {
      title: 'Mutual Funds',
      role: 'Lead Product Designer',
      platform: 'Android + iOS • Web',
      focus: ['Mutual Fund Onboarding', 'SIP Flow', 'Fund Comparison', 'Risk Profiler', 'KYC'],
    },
    {
      title: 'Option Chain',
      role: 'Product Designer',
      platform: 'Web & Mobile',
      focus: ['Option Greeks', 'Strike Prices', 'Real-Time P&L', 'Fast Execution', 'Multi-Leg Orders'],
    },
    {
      title: 'WealthBasket',
      role: 'Product Designer',
      platform: 'Mobile App',
      focus: ['Thematic Investing', 'Model Portfolios', 'Rebalancing Engine', 'Performance Analytics'],
    },
    {
      title: 'Distributor Dashboard',
      role: 'Internal Tool Designer',
      platform: 'Desktop Web',
      focus: ['AUM Tracking', 'Commission Reports', 'Client Management', 'Regulatory Compliance'],
    },
    {
      title: 'AI Support Chatbot',
      role: 'Product & Conversational Designer',
      platform: 'Mobile & Web SDK',
      focus: ['Intent Mapping', 'Fallback Flow', 'Market FAQ', 'Prompt Engineering', 'Agent Handoff'],
    },
    {
      title: 'Client Web Projects',
      role: 'Web & UI/UX Designer',
      platform: 'Responsive Web',
      focus: ['Brand Identity', 'Marketing Websites', 'Design Systems', 'Animation', 'SEO'],
    },
  ];

  const currentMeta = projectMetadata[selectedIndex] || projectMetadata[0];

  const updateThumbPosition = () => {
    if (!rowsContainerRef.current || !trackRef.current) return;
    const container = rowsContainerRef.current;
    const track = trackRef.current;
    const scrollMax = container.scrollHeight - container.clientHeight;
    if (scrollMax <= 0) {
      setThumbTop(4);
      return;
    }
    const trackHeight = track.clientHeight;
    const thumbHeight = 52;
    const availableTrack = trackHeight - thumbHeight;
    if (availableTrack <= 0) return;

    const ratio = container.scrollTop / scrollMax;
    setThumbTop(4 + ratio * availableTrack);
  };

  const handleScrollUp = () => {
    if (rowsContainerRef.current) {
      rowsContainerRef.current.scrollTop -= 30;
    }
  };

  const handleScrollDown = () => {
    if (rowsContainerRef.current) {
      rowsContainerRef.current.scrollTop += 30;
    }
  };

  const handleRowClick = (idx) => {
    playSound('ding');
    setSelectedIndex(idx);
  };

  const handleRowDoubleClick = (idx) => {
    if (idx === 0 && onOpenNova) {
      onOpenNova();
    }
  };

  const handleRowTouchEnd = (idx) => {
    if (window.innerWidth <= 768 && idx === 0 && onOpenNova) {
      onOpenNova();
    }
  };

  return (
    <Window
      id="made-window"
      title="MADE"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={820}
      defaultHeight={620}
      hasMenu={true}
      hasStatusBar={true}
      statusText={`${projects.length} object(s)`}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        className="MadeContentArea"
        style={{
          alignSelf: 'stretch',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#C0C0C0',
          gap: '2px',
        }}
      >
        {/* Address Bar */}
        <div
          data-layer="address-bar"
          className="AddressBar"
          style={{
            alignSelf: 'stretch',
            paddingLeft: '6px',
            paddingRight: '6px',
            paddingTop: '3px',
            paddingBottom: '3px',
            background: '#C0C0C0',
            overflow: 'hidden',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '6px',
            display: 'inline-flex',
          }}
        >
          <div
            data-layer="Address:"
            className="Address"
            style={{
              color: 'black',
              fontSize: '11px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 400,
            }}
          >
            Address:
          </div>
          <div
            data-layer="Frame"
            className="Frame"
            style={{
              flex: 1,
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingLeft: '4px',
              background: 'white',
              boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.15) inset',
              overflow: 'hidden',
              outline: '1px #808080 solid',
              outlineOffset: '-1px',
              display: 'flex',
            }}
          >
            <div
              style={{
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 400,
              }}
            >
              C:\NAVEEN\Projects\Made
            </div>
          </div>
        </div>

        {/* Subtitle Bar */}
        <div
          style={{
            alignSelf: 'stretch',
            paddingTop: '2px',
            paddingBottom: '2px',
            paddingLeft: '6px',
            overflow: 'hidden',
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              color: '#808080',
              fontSize: '10px',
              fontFamily: 'Inter, sans-serif',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            &quot;Things I made instead of sleeping.&quot;
          </div>
        </div>

        {/* Content Wrapper (File list + scrollbar) */}
        <div
          data-layer="content-wrapper"
          className="ContentWrapper"
          style={{
            alignSelf: 'stretch',
            flex: 1,
            paddingTop: '2px',
            paddingBottom: '2px',
            paddingLeft: '4px',
            overflow: 'hidden',
            display: 'inline-flex',
          }}
        >
          {/* File List */}
          <div
            ref={rowsContainerRef}
            data-layer="file-list"
            className="FileList"
            id="made-rows-container"
            onScroll={updateThumbPosition}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              background: 'white',
              boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.15) inset',
              overflowY: 'auto',
              outline: '1px #808080 solid',
              flexDirection: 'column',
              display: 'inline-flex',
            }}
          >
            {/* Column Headers */}
            <div
              data-layer="column-headers"
              className="ColumnHeaders"
              style={{
                alignSelf: 'stretch',
                background: '#C0C0C0',
                overflow: 'hidden',
                display: 'inline-flex',
                position: 'sticky',
                top: 0,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '280px',
                  height: '20px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  background: '#C0C0C0',
                  boxShadow: '1px 1px 0px #666666 inset',
                  outline: '1px white solid',
                  outlineOffset: '-1px',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Name
                </div>
              </div>
              <div
                style={{
                  width: '140px',
                  height: '20px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  background: '#C0C0C0',
                  boxShadow: '1px 1px 0px #666666 inset',
                  outline: '1px white solid',
                  outlineOffset: '-1px',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Type
                </div>
              </div>
              <div
                style={{
                  width: '160px',
                  height: '20px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  background: '#C0C0C0',
                  boxShadow: '1px 1px 0px #666666 inset',
                  outline: '1px white solid',
                  outlineOffset: '-1px',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Location
                </div>
              </div>
            </div>

            {/* Project Rows */}
            {projects.map((proj, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={proj.id || idx}
                  data-layer={`project-row-${idx}`}
                  className={`ProjectRow ProjectRow${idx} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleRowClick(idx)}
                  onDoubleClick={() => handleRowDoubleClick(idx)}
                  onTouchEnd={() => handleRowTouchEnd(idx)}
                  style={{
                    alignSelf: 'stretch',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    paddingLeft: '4px',
                    background: isSelected ? '#000080' : 'transparent',
                    overflow: 'hidden',
                    display: 'inline-flex',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '276px',
                      paddingLeft: '2px',
                      paddingRight: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <FolderIconSmall />
                    <div
                      style={{
                        color: isSelected ? 'white' : 'black',
                        fontSize: '11px',
                        fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {proj.name}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '140px',
                      paddingLeft: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: isSelected ? 'white' : 'black',
                        fontSize: '11px',
                        fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {proj.type}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '160px',
                      paddingLeft: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: isSelected ? 'white' : 'black',
                        fontSize: '11px',
                        fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {proj.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Scrollbar */}
          <div
            data-layer="scrollbar"
            className="Scrollbar"
            id="made-scrollbar"
            style={{
              width: '16px',
              alignSelf: 'stretch',
              background: '#DFDFDF',
              overflow: 'hidden',
              flexDirection: 'column',
              display: 'inline-flex',
            }}
          >
            {/* Scroll Up Button */}
            <div
              id="made-scroll-up"
              onClick={handleScrollUp}
              style={{
                alignSelf: 'stretch',
                height: '16px',
                position: 'relative',
                background: '#C0C0C0',
                outline: '1px white solid',
                outlineOffset: '-1px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '5px',
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '5px solid black',
                }}
              />
            </div>

            {/* Scroll Track */}
            <div
              ref={trackRef}
              id="made-scroll-track"
              style={{
                alignSelf: 'stretch',
                flex: 1,
                position: 'relative',
                background: '#DFDFDF',
                overflow: 'hidden',
              }}
            >
              <div
                id="made-scroll-thumb"
                style={{
                  left: '1px',
                  top: `${thumbTop}px`,
                  position: 'absolute',
                  cursor: 'pointer',
                  width: '14px',
                  height: '50px',
                  background: '#C0C0C0',
                  boxShadow: '-1px -1px 0px 1px white inset, 1px 1px 0px rgba(0, 0, 0, 0.40) inset',
                }}
              />
            </div>

            {/* Scroll Down Button */}
            <div
              id="made-scroll-down"
              onClick={handleScrollDown}
              style={{
                alignSelf: 'stretch',
                height: '16px',
                position: 'relative',
                background: '#C0C0C0',
                outline: '1px white solid',
                outlineOffset: '-1px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '6px',
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '5px solid black',
                }}
              />
            </div>
          </div>
        </div>

        {/* Details Pane */}
        <div
          data-layer="details-pane"
          className="DetailsPane"
          id="made-details-pane"
          style={{
            alignSelf: 'stretch',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '10px',
            paddingBottom: '10px',
            background: '#C0C0C0',
            boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.10) inset',
            outline: '1px #808080 solid',
            outlineOffset: '-1px',
            display: 'inline-flex',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          {/* Selected Item Title & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MadeIcon />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.50px',
                }}
              >
                SELECTED:
              </div>
              <div
                id="made-details-title"
                style={{
                  color: 'black',
                  fontSize: '12px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                }}
              >
                {currentMeta.title}
              </div>
            </div>
          </div>

          {/* Role & Platform */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.50px',
                }}
              >
                ROLE:
              </div>
              <div
                id="made-details-role"
                style={{
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {currentMeta.role}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.50px',
                }}
              >
                PLATFORM:
              </div>
              <div
                id="made-details-platform"
                style={{
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {currentMeta.platform}
              </div>
            </div>
          </div>

          {/* Focus Points */}
          <div
            id="made-details-focus"
            style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
          >
            <div
              style={{
                color: '#808080',
                fontSize: '10px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '0.50px',
              }}
            >
              FOCUS:
            </div>
            {currentMeta.focus.map((item, fIdx) => (
              <div
                key={fIdx}
                style={{
                  color: 'black',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}
