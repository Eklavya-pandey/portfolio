import React, { useState, useRef } from 'react';
import Window from '../components/Window';
import { FolderIconSmall, GearFileIconSmall, GlobeFileIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

const PROJECT_NOTES = {
  'Stock Trading App': 'Buy high, sell low is not a feature. Everything else is.',
  'Mutual Funds': 'Making SIPs less scary than they sound.',
  'Option Chain': 'A wall of numbers, made readable. Yes, really.',
  'WealthBasket': 'A basket that holds wealth. Eggs not included.',
  'Distributor Dashboard': 'A dashboard for people who live in dashboards.',
  'AI Support Chatbot': "Teaching a bot to say 'I understand your frustration' convincingly.",
  'Client Web Projects': 'Pixels for clients. Revisions not included. Revisions were included.',
  'OneStepPrint website redesign': 'Print, but make it scroll.',
};

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
  onOpenOneStepPrint,
}) {
  const { projects } = portfolioData;
  const { playSound } = useSound();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedProject = projects[selectedIndex] || projects[0];

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
    {
      title: 'OneStepPrint website redesign',
      role: 'UI design and prototyping',
      platform: 'Responsive Web',
      focus: ['Scroll Storytelling', 'CMYK Print Concept', 'Prototyping', 'Figma', 'Developer Build'],
    },
  ];

  const currentMeta = projectMetadata[selectedIndex] || projectMetadata[0];
  const currentNote = PROJECT_NOTES[selectedProject?.name] || 'Things I made instead of sleeping.';

  const handleRowClick = (idx) => {
    playSound('ding');
    setSelectedIndex(idx);
  };

  const handleRowDoubleClick = (idx) => {
    const proj = projects[idx];
    if (proj?.id === 'onestepprint' || proj?.deepDiveKey === 'onestepprint') {
      if (onOpenOneStepPrint) onOpenOneStepPrint();
    } else if (idx === 0 && onOpenNova) {
      onOpenNova();
    }
  };

  const handleRowTouchEnd = (idx) => {
    if (window.innerWidth <= 768) {
      const proj = projects[idx];
      if (proj?.id === 'onestepprint' || proj?.deepDiveKey === 'onestepprint') {
        if (onOpenOneStepPrint) onOpenOneStepPrint();
      } else if (idx === 0 && onOpenNova) {
        onOpenNova();
      }
    }
  };

  const getItemType = (proj) => {
    if (proj.name === 'Stock Trading App' || proj.id === 'stock-trading-app') {
      return 'Product';
    }
    return proj.type || 'Product';
  };

  const getItemIcon = (type) => {
    if (type === 'Internal Tool') {
      return <GearFileIconSmall />;
    }
    if (type === 'Web') {
      return <GlobeFileIconSmall />;
    }
    return <FolderIconSmall />;
  };

  return (
    <Window
      id="made-window"
      title="Made"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={640}
      defaultHeight={420}
      hasMenu={true}
      hasStatusBar={false}
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
          fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          fontSize: '11px',
        }}
      >
        {/* Explorer Toolbar: Back, Forward, Up, Separator, Views */}
        <div
          data-layer="explorer-toolbar"
          style={{
            alignSelf: 'stretch',
            height: '26px',
            background: '#C0C0C0',
            borderBottom: '1px solid #808080',
            boxShadow: '0 1px 0 0 white',
            display: 'flex',
            alignItems: 'center',
            padding: '2px 4px',
            gap: '2px',
            boxSizing: 'border-box',
          }}
        >
          {/* Back Button (Disabled/Greyed) */}
          <button
            disabled
            style={{
              height: '20px',
              padding: '0 6px',
              background: '#C0C0C0',
              border: '1px solid transparent',
              color: '#808080',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'default',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7 2L3 6L7 10" stroke="#808080" strokeWidth="1.5" />
            </svg>
            <span>Back</span>
          </button>

          {/* Forward Button (Disabled/Greyed) */}
          <button
            disabled
            style={{
              height: '20px',
              padding: '0 6px',
              background: '#C0C0C0',
              border: '1px solid transparent',
              color: '#808080',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'default',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M5 2L9 6L5 10" stroke="#808080" strokeWidth="1.5" />
            </svg>
            <span>Forward</span>
          </button>

          {/* Up Button (Active) */}
          <button
            onClick={() => playSound('ding')}
            style={{
              height: '20px',
              padding: '0 6px',
              background: '#C0C0C0',
              boxShadow: '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset',
              border: '1px solid #808080',
              color: '#000000',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 7L6 3L10 7" stroke="#000000" strokeWidth="1.5" />
              <line x1="6" y1="3" x2="6" y2="10" stroke="#000000" strokeWidth="1.5" />
            </svg>
            <span>Up</span>
          </button>

          {/* 3D Vertical Separator */}
          <div
            style={{
              width: '2px',
              height: '18px',
              borderLeft: '1px solid #808080',
              borderRight: '1px solid #FFFFFF',
              margin: '0 2px',
            }}
          />

          {/* Views Button */}
          <button
            onClick={() => playSound('ding')}
            style={{
              height: '20px',
              padding: '0 6px',
              background: '#C0C0C0',
              boxShadow: '1px 1px 0px #DFDFDF inset, -1px -1px 0px #7F7F7F inset',
              border: '1px solid #808080',
              color: '#000000',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="2" width="4" height="3" fill="#000080" />
              <rect x="7" y="2" width="4" height="3" fill="#000080" />
              <rect x="1" y="7" width="4" height="3" fill="#000080" />
              <rect x="7" y="7" width="4" height="3" fill="#000080" />
            </svg>
            <span>Views</span>
          </button>
        </div>

        {/* Address Bar with proper sunken border */}
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
            alignItems: 'center',
            gap: '6px',
            display: 'flex',
          }}
        >
          <div
            data-layer="Address:"
            className="Address"
            style={{
              color: '#000000',
              fontSize: '11px',
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
              background: '#FFFFFF',
              border: '1px solid #808080',
              borderRightColor: '#FFFFFF',
              borderBottomColor: '#FFFFFF',
              boxShadow: '1px 1px 0px black inset',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div
              style={{
                color: '#000000',
                fontSize: '11px',
                fontWeight: 400,
              }}
            >
              C:\NAVEEN\Projects\Made
            </div>
          </div>
        </div>

        {/* Subtitle Bar - Folder Quote */}
        <div
          style={{
            alignSelf: 'stretch',
            paddingTop: '1px',
            paddingBottom: '2px',
            paddingLeft: '6px',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <div
            style={{
              color: '#404040',
              fontSize: '10px',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            &quot;Things I made instead of sleeping.&quot;
          </div>
        </div>

        {/* Content Wrapper: File List (native overflow scrollbar only when content overflows) */}
        <div
          data-layer="content-wrapper"
          className="ContentWrapper"
          style={{
            alignSelf: 'stretch',
            flex: 1,
            paddingTop: '1px',
            paddingBottom: '1px',
            paddingLeft: '4px',
            paddingRight: '4px',
            overflow: 'hidden',
            display: 'flex',
            minHeight: 0,
          }}
        >
          {/* File List Container with Sunken Border */}
          <div
            id="made-rows-container"
            style={{
              flex: 1,
              alignSelf: 'stretch',
              background: '#FFFFFF',
              border: '1px solid #808080',
              borderRightColor: '#FFFFFF',
              borderBottomColor: '#FFFFFF',
              boxShadow: '1px 1px 0px black inset',
              overflowY: 'auto',
              flexDirection: 'column',
              display: 'flex',
            }}
          >
            {/* Column Headers */}
            <div
              data-layer="column-headers"
              className="ColumnHeaders"
              style={{
                alignSelf: 'stretch',
                background: '#C0C0C0',
                display: 'flex',
                position: 'sticky',
                top: 0,
                zIndex: 2,
                borderBottom: '1px solid #808080',
              }}
            >
              {/* Name Column */}
              <div
                style={{
                  width: '260px',
                  height: '20px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  background: '#C0C0C0',
                  boxShadow: '1px 1px 0px white inset, -1px -1px 0px #808080 inset',
                  border: '1px solid #DFDFDF',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ color: '#000000', fontSize: '11px', fontWeight: 700 }}>
                  Name
                </span>
              </div>

              {/* Type Column */}
              <div
                style={{
                  width: '130px',
                  height: '20px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  background: '#C0C0C0',
                  boxShadow: '1px 1px 0px white inset, -1px -1px 0px #808080 inset',
                  border: '1px solid #DFDFDF',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ color: '#000000', fontSize: '11px', fontWeight: 700 }}>
                  Type
                </span>
              </div>

              {/* Company / Client Column (renamed from Location) */}
              <div
                style={{
                  flex: 1,
                  minWidth: '160px',
                  height: '20px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  background: '#C0C0C0',
                  boxShadow: '1px 1px 0px white inset, -1px -1px 0px #808080 inset',
                  border: '1px solid #DFDFDF',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ color: '#000000', fontSize: '11px', fontWeight: 700 }}>
                  Company / Client
                </span>
              </div>
            </div>

            {/* Project Rows */}
            {projects.map((proj, idx) => {
              const isSelected = selectedIndex === idx;
              const itemType = getItemType(proj);
              const iconComponent = getItemIcon(itemType);

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
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    paddingLeft: '4px',
                    background: isSelected ? '#000080' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Name cell */}
                  <div
                    style={{
                      width: '260px',
                      paddingLeft: '2px',
                      paddingRight: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {iconComponent}
                    </div>
                    <div
                      style={{
                        color: isSelected ? '#FFFFFF' : '#000000',
                        fontSize: '11px',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {proj.name}
                    </div>
                  </div>

                  {/* Type cell */}
                  <div
                    style={{
                      width: '130px',
                      paddingLeft: '6px',
                      paddingRight: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        color: isSelected ? '#FFFFFF' : '#000000',
                        fontSize: '11px',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {itemType}
                    </div>
                  </div>

                  {/* Company / Client cell */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: '160px',
                      paddingLeft: '6px',
                      paddingRight: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        color: isSelected ? '#FFFFFF' : '#000000',
                        fontSize: '11px',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {proj.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel at the bottom (fixed height, no clipping) */}
        <div
          data-layer="details-pane"
          className="DetailsPane"
          id="made-details-pane"
          style={{
            alignSelf: 'stretch',
            height: '50px',
            minHeight: '50px',
            maxHeight: '50px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '4px',
            paddingBottom: '4px',
            background: '#C0C0C0',
            border: '1px solid #808080',
            borderRightColor: '#FFFFFF',
            borderBottomColor: '#FFFFFF',
            boxShadow: '1px 1px 0px white, inset 1px 1px 0px #808080',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Line 1: ROLE, PLATFORM, FOCUS as one comma-separated line with ellipsis */}
          <div
            id="made-details-summary"
            style={{
              color: '#000000',
              fontSize: '11px',
              lineHeight: '18px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <span style={{ color: '#404040', fontWeight: 700, fontSize: '10px' }}>ROLE: </span>
            {currentMeta.role}, <span style={{ color: '#404040', fontWeight: 700, fontSize: '10px' }}>PLATFORM: </span>
            {currentMeta.platform}, <span style={{ color: '#404040', fontWeight: 700, fontSize: '10px' }}>FOCUS: </span>
            {Array.isArray(currentMeta.focus) ? currentMeta.focus.join(', ') : currentMeta.focus}
          </div>

          {/* Line 2: NOTE in italic */}
          <div
            id="made-details-note"
            style={{
              color: '#404040',
              fontSize: '11px',
              lineHeight: '18px',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Note: &quot;{currentNote}&quot;
          </div>
        </div>

        {/* Status Bar */}
        <div
          id="made-status-bar"
          style={{
            alignSelf: 'stretch',
            height: '20px',
            background: '#C0C0C0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 4px',
            boxSizing: 'border-box',
          }}
        >
          {/* Left status pane: "8 object(s)" */}
          <div
            style={{
              width: '130px',
              height: '16px',
              paddingLeft: '4px',
              paddingRight: '4px',
              background: '#C0C0C0',
              border: '1px solid #808080',
              borderRightColor: '#FFFFFF',
              borderBottomColor: '#FFFFFF',
              boxShadow: '1px 1px 0px rgba(0,0,0,0.2) inset',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ color: '#000000', fontSize: '11px' }}>
              {projects.length} object(s)
            </span>
          </div>

          {/* Right status pane: selected item name */}
          <div
            style={{
              flex: 1,
              height: '16px',
              paddingLeft: '6px',
              paddingRight: '4px',
              background: '#C0C0C0',
              border: '1px solid #808080',
              borderRightColor: '#FFFFFF',
              borderBottomColor: '#FFFFFF',
              boxShadow: '1px 1px 0px rgba(0,0,0,0.2) inset',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                color: '#000000',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedProject?.name || ''}
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}
