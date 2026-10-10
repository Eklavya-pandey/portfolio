import React, { useRef, useState } from 'react';
import Window from '../components/Window';
import { FolderIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';

export default function NovaInvestWindow({
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
  const { caseStudies } = portfolioData;
  const nova = caseStudies?.nova || {};

  const contentRef = useRef(null);
  const trackRef = useRef(null);
  const [thumbTop, setThumbTop] = useState(4);

  const updateThumbPosition = () => {
    if (!contentRef.current || !trackRef.current) return;
    const content = contentRef.current;
    const track = trackRef.current;
    const scrollMax = content.scrollHeight - content.clientHeight;
    if (scrollMax <= 0) {
      setThumbTop(4);
      return;
    }
    const trackHeight = track.clientHeight;
    const thumbHeight = 80;
    const availableTrack = trackHeight - thumbHeight;
    if (availableTrack <= 0) return;

    const ratio = content.scrollTop / scrollMax;
    setThumbTop(4 + ratio * availableTrack);
  };

  const handleScrollUp = () => {
    if (contentRef.current) contentRef.current.scrollTop -= 50;
  };

  const handleScrollDown = () => {
    if (contentRef.current) contentRef.current.scrollTop += 50;
  };

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startTop = thumbTop;

    const handleMouseMove = (moveEv) => {
      if (!contentRef.current || !trackRef.current) return;
      const track = trackRef.current;
      const trackHeight = track.clientHeight;
      const thumbHeight = 80;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;

      const deltaY = moveEv.clientY - startY;
      const nextTop = Math.max(4, Math.min(4 + availableTrack, startTop + deltaY));
      setThumbTop(nextTop);

      const ratio = (nextTop - 4) / availableTrack;
      const scrollMax = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      contentRef.current.scrollTop = ratio * scrollMax;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Window
      id="nova-invest-window"
      title="NOVA_INVEST.EXE"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={1050}
      defaultHeight={740}
      hasMenu={true}
      hasStatusBar={true}
      statusText="NOVA_INVEST.EXE — Portfolio Concept"
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        className="NovaClientArea"
        style={{
          alignSelf: 'stretch',
          flex: 1,
          position: 'relative',
          background: 'white',
          boxShadow:
            '1px 1px 0px 1px rgba(0, 0, 0, 0.40) inset, -1px -1px 0px white inset',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* Scrollable Content Container */}
        <div
          ref={contentRef}
          id="nova-content-scroll"
          className="NovaContentScroll"
          onScroll={updateThumbPosition}
          style={{
            flex: 1,
            height: '100%',
            paddingTop: '24px',
            paddingBottom: '30px',
            paddingLeft: '40px',
            paddingRight: '40px',
            overflowY: 'auto',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '3px',
              paddingBottom: '3px',
              background: '#C0C0C0',
              boxShadow: '-1px -1px 0px 1px white, 1px 1px 0px rgba(0, 0, 0, 0.40)',
              display: 'inline-flex',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                color: '#808080',
                fontSize: '9px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '1.50px',
              }}
            >
              {nova.badge || 'PORTFOLIO CONCEPT'}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: 'black',
              fontSize: '28px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
              letterSpacing: '2px',
            }}
          >
            {nova.title || 'NOVA INVEST'}
          </div>

          {/* Subtitle */}
          <div
            style={{
              width: '295px',
              color: '#808080',
              fontSize: '12px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 400,
              lineHeight: '20px',
            }}
          >
            {nova.subtitle ||
              'A simplified investing experience designed to make market information easier to understand and act on.'}
          </div>

          {/* Separator */}
          <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />

          {/* Project Meta */}
          <div style={{ display: 'inline-flex', gap: '40px' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '9px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                ROLE
              </div>
              <div
                style={{
                  width: '91px',
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                  lineHeight: '17px',
                }}
              >
                {nova.role || 'Product Designer'}
              </div>
            </div>

            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '9px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                PROJECT TYPE
              </div>
              <div
                style={{
                  width: '108px',
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                  lineHeight: '17px',
                }}
              >
                {nova.projectType || 'Fintech / Mobile App'}
              </div>
            </div>

            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '9px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                FOCUS
              </div>
              <div
                style={{
                  width: '202px',
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                  lineHeight: '17px',
                }}
              >
                UX Strategy • Information Architecture
                <br />
                Interaction Design • UI Design
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />

          {/* Project Overview */}
          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '1.50px',
              }}
            >
              PROJECT OVERVIEW
            </div>
            <div style={{ alignSelf: 'stretch', display: 'inline-flex', gap: '40px' }}>
              <div style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '9px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  PROBLEM
                </div>
                <div
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                >
                  {nova.problem ||
                    'Investment apps can become overwhelming when users are presented with too much market information at once.'}
                </div>
              </div>
              <div style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '9px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  GOAL
                </div>
                <div
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                >
                  {nova.goal ||
                    'Create a cleaner experience that helps users quickly understand their portfolio, discover opportunities and make informed decisions.'}
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />

          {/* Design Approach */}
          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '1.50px',
              }}
            >
              DESIGN APPROACH
            </div>
            <div style={{ alignSelf: 'stretch', display: 'inline-flex', gap: '20px' }}>
              <div style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    color: '#000080',
                    fontSize: '20px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  01
                </div>
                <div
                  style={{
                    color: 'black',
                    fontSize: '9px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  DISCOVER
                </div>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '10px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  Understand user goals, pain points and key investment workflows.
                </div>
              </div>

              <div style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    color: '#000080',
                    fontSize: '20px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  02
                </div>
                <div
                  style={{
                    color: 'black',
                    fontSize: '9px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  STRUCTURE
                </div>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '10px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  Simplify information architecture and organize complex financial information.
                </div>
              </div>

              <div style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    color: '#000080',
                    fontSize: '20px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  03
                </div>
                <div
                  style={{
                    color: 'black',
                    fontSize: '9px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  DESIGN
                </div>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '10px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  Create clear interaction patterns and a consistent mobile design system.
                </div>
              </div>

              <div style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    color: '#000080',
                    fontSize: '20px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  04
                </div>
                <div
                  style={{
                    color: 'black',
                    fontSize: '9px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  VALIDATE
                </div>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '10px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  Prototype key flows and review usability before development.
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />

          {/* Key Screens (4 Phones) */}
          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '1.50px',
              }}
            >
              KEY SCREENS
            </div>

            <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'center', gap: '16px' }}>
              {/* Phone 1: Home */}
              <div
                style={{
                  width: '180px',
                  height: '340px',
                  background: '#0C0E16',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    alignSelf: 'stretch',
                    paddingTop: '6px',
                    paddingBottom: '4px',
                    paddingLeft: '14px',
                    paddingRight: '14px',
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>9:41</div>
                  <div style={{ color: '#F0F2F8', fontSize: '6px' }}>●●●</div>
                </div>

                <div
                  style={{
                    alignSelf: 'stretch',
                    paddingLeft: '14px',
                    paddingRight: '14px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ color: '#788296', fontSize: '8px' }}>Good morning</div>
                  <div style={{ color: '#F0F2F8', fontSize: '18px', fontWeight: 700 }}>₹4,28,350.75</div>
                  <div style={{ color: '#00C878', fontSize: '7px' }}>+₹12,480.50 (+3.01%)</div>
                </div>

                <div style={{ alignSelf: 'stretch', height: '50px', position: 'relative' }}>
                  <svg width="180" height="50" viewBox="0 0 180 50" fill="none">
                    <path d="M0 40 Q 30 25, 60 35 T 120 15 T 180 20" stroke="#00C878" strokeWidth="2" fill="none" />
                    <path d="M0 40 Q 30 25, 60 35 T 120 15 T 180 20 L 180 50 L 0 50 Z" fill="#00C878" opacity="0.15" />
                  </svg>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: '#F0F2F8', fontSize: '9px', fontWeight: 700 }}>Watchlist</div>
                  {[
                    { sym: 'RELIANCE', price: '₹2,487.30', chg: '+1.2%', up: true },
                    { sym: 'TCS', price: '₹3,542.15', chg: '-0.8%', up: false },
                    { sym: 'HDFC BANK', price: '₹1,678.90', chg: '+2.1%', up: true },
                    { sym: 'INFY', price: '₹1,456.20', chg: '+0.5%', up: true },
                  ].map((stk, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        alignSelf: 'stretch',
                        padding: '4px 10px',
                        background: '#161A26',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ color: '#F0F2F8', fontSize: '7px', fontWeight: 700 }}>{stk.sym}</div>
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ color: '#F0F2F8', fontSize: '7px' }}>{stk.price}</div>
                        <div style={{ color: stk.up ? '#00C878' : '#F04450', fontSize: '6px' }}>{stk.chg}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    alignSelf: 'stretch',
                    padding: '8px 20px',
                    background: '#161A26',
                    marginTop: 'auto',
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ color: '#00C878', fontSize: '6px' }}>Home</div>
                  <div style={{ color: '#788296', fontSize: '6px' }}>Search</div>
                  <div style={{ color: '#788296', fontSize: '6px' }}>Portfolio</div>
                  <div style={{ color: '#788296', fontSize: '6px' }}>Profile</div>
                </div>
              </div>

              {/* Phone 2: Stock Detail */}
              <div
                style={{
                  width: '180px',
                  height: '340px',
                  background: '#0C0E16',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    alignSelf: 'stretch',
                    paddingTop: '6px',
                    paddingBottom: '4px',
                    paddingLeft: '14px',
                    paddingRight: '14px',
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>9:41</div>
                  <div style={{ color: '#F0F2F8', fontSize: '6px' }}>●●●</div>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '8px 14px 6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ color: '#788296', fontSize: '8px' }}>← RELIANCE</div>
                  <div style={{ color: '#F0F2F8', fontSize: '20px', fontWeight: 700 }}>₹2,487.30</div>
                  <div style={{ color: '#00C878', fontSize: '7px' }}>+₹29.45 (+1.20%)</div>
                </div>

                <div style={{ alignSelf: 'stretch', height: '70px', position: 'relative' }}>
                  <svg width="180" height="70" viewBox="0 0 180 70" fill="none">
                    <path d="M0 50 Q 40 40, 70 30 T 130 15 T 180 25" stroke="#00C878" strokeWidth="2" fill="none" />
                    <path d="M0 50 Q 40 40, 70 30 T 130 15 T 180 25 L 180 70 L 0 70 Z" fill="#00C878" opacity="0.15" />
                  </svg>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '4px 14px 6px', display: 'inline-flex', gap: '10px' }}>
                  <div style={{ color: '#788296', fontSize: '6px', fontWeight: 700 }}>1D</div>
                  <div style={{ color: '#788296', fontSize: '6px', fontWeight: 700 }}>1W</div>
                  <div style={{ padding: '3px 6px', background: 'rgba(0, 200, 120, 0.15)', borderRadius: '4px' }}>
                    <div style={{ color: '#00C878', fontSize: '6px', fontWeight: 700 }}>1M</div>
                  </div>
                  <div style={{ color: '#788296', fontSize: '6px', fontWeight: 700 }}>3M</div>
                  <div style={{ color: '#788296', fontSize: '6px', fontWeight: 700 }}>1Y</div>
                  <div style={{ color: '#788296', fontSize: '6px', fontWeight: 700 }}>ALL</div>
                </div>

                <div style={{ alignSelf: 'stretch', margin: '0 12px', padding: '6px 12px', background: '#161A26', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>Key Statistics</div>
                  <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                    <div style={{ color: '#788296', fontSize: '6px' }}>Market Cap</div>
                    <div style={{ color: '#F0F2F8', fontSize: '6px', fontWeight: 700 }}>₹16.8L Cr</div>
                  </div>
                  <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                    <div style={{ color: '#788296', fontSize: '6px' }}>P/E Ratio</div>
                    <div style={{ color: '#F0F2F8', fontSize: '6px', fontWeight: 700 }}>27.4</div>
                  </div>
                  <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                    <div style={{ color: '#788296', fontSize: '6px' }}>52W High</div>
                    <div style={{ color: '#F0F2F8', fontSize: '6px', fontWeight: 700 }}>₹2,856.15</div>
                  </div>
                  <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                    <div style={{ color: '#788296', fontSize: '6px' }}>52W Low</div>
                    <div style={{ color: '#F0F2F8', fontSize: '6px', fontWeight: 700 }}>₹2,015.25</div>
                  </div>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '6px 14px 8px', background: '#161A26', marginTop: 'auto', display: 'inline-flex', gap: '8px' }}>
                  <div style={{ flex: 1, padding: '6px 10px', background: '#00C878', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ color: '#0C0E16', fontSize: '9px', fontWeight: 700 }}>BUY</div>
                  </div>
                  <div style={{ flex: 1, padding: '6px 10px', border: '1px solid #F04450', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ color: '#F04450', fontSize: '9px', fontWeight: 700 }}>SELL</div>
                  </div>
                </div>
              </div>

              {/* Phone 3: Portfolio */}
              <div
                style={{
                  width: '180px',
                  height: '340px',
                  background: '#0C0E16',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div style={{ alignSelf: 'stretch', padding: '6px 14px 4px', display: 'inline-flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>9:41</div>
                  <div style={{ color: '#F0F2F8', fontSize: '6px' }}>●●●</div>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ color: '#F0F2F8', fontSize: '12px', fontWeight: 700 }}>Portfolio</div>
                  <div style={{ color: '#F0F2F8', fontSize: '16px', fontWeight: 700 }}>₹4,28,350.75</div>
                  <div style={{ color: '#00C878', fontSize: '7px' }}>Total Returns +₹78,350 (+22.3%)</div>
                </div>

                <div style={{ alignSelf: 'stretch', margin: '0 12px', padding: '8px 12px', background: '#161A26', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>Allocation</div>
                  {[
                    { label: 'Large Cap', pct: '45%', bar: 58, color: '#3C78FF' },
                    { label: 'Mid Cap', pct: '30%', bar: 38, color: '#00C878' },
                    { label: 'Small Cap', pct: '15%', bar: 19, color: '#FFB432' },
                    { label: 'Others', pct: '10%', bar: 13, color: '#788296' },
                  ].map((alc, aIdx) => (
                    <div key={aIdx} style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                        <div style={{ color: '#788296', fontSize: '6px' }}>{alc.label}</div>
                        <div style={{ color: '#F0F2F8', fontSize: '6px', fontWeight: 700 }}>{alc.pct}</div>
                      </div>
                      <div style={{ alignSelf: 'stretch', height: '4px', background: '#282C38', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ width: `${alc.bar}px`, height: '4px', background: alc.color, borderRadius: '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    alignSelf: 'stretch',
                    padding: '8px 20px',
                    background: '#161A26',
                    marginTop: 'auto',
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ color: '#788296', fontSize: '6px' }}>Home</div>
                  <div style={{ color: '#788296', fontSize: '6px' }}>Search</div>
                  <div style={{ color: '#00C878', fontSize: '6px' }}>Portfolio</div>
                  <div style={{ color: '#788296', fontSize: '6px' }}>Profile</div>
                </div>
              </div>

              {/* Phone 4: Order */}
              <div
                style={{
                  width: '180px',
                  height: '340px',
                  background: '#0C0E16',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div style={{ alignSelf: 'stretch', padding: '6px 14px 4px', display: 'inline-flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>9:41</div>
                  <div style={{ color: '#F0F2F8', fontSize: '6px' }}>●●●</div>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ color: '#788296', fontSize: '8px' }}>← Buy RELIANCE</div>
                  <div style={{ color: '#F0F2F8', fontSize: '14px', fontWeight: 700 }}>₹2,487.30</div>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '4px', margin: '0 14px', background: '#161A26', borderRadius: '8px', display: 'inline-flex' }}>
                  <div style={{ flex: 1, padding: '6px 10px', background: '#282C38', borderRadius: '6px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ color: '#F0F2F8', fontSize: '8px', fontWeight: 700 }}>Market</div>
                  </div>
                  <div style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ color: '#788296', fontSize: '8px', fontWeight: 700 }}>Limit</div>
                  </div>
                </div>

                <div style={{ alignSelf: 'stretch', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ color: '#788296', fontSize: '7px' }}>Quantity</div>
                  <div style={{ alignSelf: 'stretch', padding: '8px 12px', background: '#161A26', borderRadius: '8px', display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#788296', fontSize: '12px', cursor: 'pointer' }}>−</div>
                    <div style={{ color: '#F0F2F8', fontSize: '14px', fontWeight: 700 }}>10</div>
                    <div style={{ color: '#788296', fontSize: '12px', cursor: 'pointer' }}>+</div>
                  </div>

                  <div style={{ alignSelf: 'stretch', padding: '8px 12px', background: '#161A26', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                      <div style={{ color: '#788296', fontSize: '7px' }}>Price per share</div>
                      <div style={{ color: '#F0F2F8', fontSize: '7px', fontWeight: 700 }}>₹2,487.30</div>
                    </div>
                    <div style={{ alignSelf: 'stretch', display: 'inline-flex', justifyContent: 'space-between' }}>
                      <div style={{ color: '#788296', fontSize: '7px' }}>Estimated Total</div>
                      <div style={{ color: '#F0F2F8', fontSize: '7px', fontWeight: 700 }}>₹24,873.00</div>
                    </div>
                  </div>

                  <div style={{ alignSelf: 'stretch', padding: '10px', background: '#00C878', borderRadius: '10px', display: 'inline-flex', justifyContent: 'center', cursor: 'pointer' }}>
                    <div style={{ color: '#0C0E16', fontSize: '10px', fontWeight: 700 }}>Confirm Purchase</div>
                  </div>
                  <div style={{ alignSelf: 'stretch', textAlign: 'center', color: '#788296', fontSize: '5px' }}>
                    By proceeding you agree to the terms.
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Labels */}
            <div style={{ alignSelf: 'stretch', display: 'inline-flex', gap: '16px' }}>
              <div style={{ flex: 1, textAlign: 'center', color: '#808080', fontSize: '8px', fontWeight: 700, letterSpacing: '0.50px' }}>
                01 — HOME
              </div>
              <div style={{ flex: 1, textAlign: 'center', color: '#808080', fontSize: '8px', fontWeight: 700, letterSpacing: '0.50px' }}>
                02 — STOCK DETAIL
              </div>
              <div style={{ flex: 1, textAlign: 'center', color: '#808080', fontSize: '8px', fontWeight: 700, letterSpacing: '0.50px' }}>
                03 — PORTFOLIO
              </div>
              <div style={{ flex: 1, textAlign: 'center', color: '#808080', fontSize: '8px', fontWeight: 700, letterSpacing: '0.50px' }}>
                04 — ORDER
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />

          {/* Design Decisions */}
          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '1.50px',
              }}
            >
              DESIGN DECISIONS
            </div>
            <div style={{ alignSelf: 'stretch', display: 'inline-flex', gap: '20px' }}>
              {[
                { title: 'SIMPLIFY', desc: 'Reduce visual clutter around complex financial information.' },
                { title: 'PRIORITIZE', desc: 'Surface the information users need most frequently.' },
                { title: 'CONSISTENCY', desc: 'Use reusable components and patterns across the product.' },
                { title: 'CLARITY', desc: 'Make important financial actions easy to understand.' },
              ].map((dec, dIdx) => (
                <div key={dIdx} style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#000080' }} />
                  <div style={{ color: 'black', fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>
                    {dec.title}
                  </div>
                  <div style={{ color: '#808080', fontSize: '10px', lineHeight: '16px' }}>{dec.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />

          {/* What This Project Shows */}
          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 700,
                letterSpacing: '1.50px',
              }}
            >
              WHAT THIS PROJECT SHOWS
            </div>
            <div style={{ alignSelf: 'stretch', display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                'Product Thinking',
                'UX Strategy',
                'Information Architecture',
                'Interaction Design',
                'UI Design',
                'Design Systems',
                'Prototyping',
              ].map((tag, tIdx) => (
                <div
                  key={tIdx}
                  style={{
                    padding: '4px 8px',
                    background: '#C0C0C0',
                    boxShadow: '-1px -1px 0px 1px white, 1px 1px 0px rgba(0, 0, 0, 0.40)',
                    display: 'flex',
                  }}
                >
                  <div style={{ color: 'black', fontSize: '9px' }}>{tag}</div>
                </div>
              ))}
            </div>
            <div style={{ color: '#808080', fontSize: '9px', fontStyle: 'italic' }}>
              📎 &quot;Not a real product. Very real design decisions.&quot;
            </div>
          </div>
        </div>

        {/* Custom Scrollbar */}
        <div
          data-layer="scrollbar"
          className="Scrollbar"
          id="nova-scrollbar"
          style={{
            width: '16px',
            alignSelf: 'stretch',
            background: '#C0C0C0',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Scroll Up */}
          <div
            id="nova-scroll-up"
            onClick={handleScrollUp}
            style={{
              width: '16px',
              height: '16px',
              position: 'absolute',
              left: 0,
              top: 0,
              background: '#C0C0C0',
              boxShadow: '-1px -1px 0px 1px white, 1px 1px 0px rgba(0, 0, 0, 0.40)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '7px', color: 'black' }}>▲</div>
          </div>

          {/* Scroll Track */}
          <div
            ref={trackRef}
            id="nova-scroll-track"
            style={{
              width: '16px',
              position: 'absolute',
              left: 0,
              top: '16px',
              bottom: '16px',
              background: '#DFDFDF',
            }}
          >
            <div
              id="nova-scroll-thumb"
              onMouseDown={handleThumbMouseDown}
              style={{
                width: '14px',
                height: '80px',
                left: '1px',
                top: `${thumbTop}px`,
                position: 'absolute',
                background: '#C0C0C0',
                boxShadow: '-1px -1px 0px 1px white, 1px 1px 0px rgba(0, 0, 0, 0.40)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Scroll Down */}
          <div
            id="nova-scroll-down"
            onClick={handleScrollDown}
            style={{
              width: '16px',
              height: '16px',
              position: 'absolute',
              left: 0,
              bottom: 0,
              background: '#C0C0C0',
              boxShadow: '-1px -1px 0px 1px white, 1px 1px 0px rgba(0, 0, 0, 0.40)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '7px', color: 'black' }}>▼</div>
          </div>
        </div>
      </div>
    </Window>
  );
}
