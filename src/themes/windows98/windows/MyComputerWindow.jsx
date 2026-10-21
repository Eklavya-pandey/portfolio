import React from 'react';
import Window from '../components/Window';
import { MyComputerIcon } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function MyComputerWindow({
  isOpen,
  isActive,
  zIndex,
  position,
  onFocus,
  onClose,
  onOpenHello,
}) {
  const profile = portfolioData.profile || {};
  const rawExperience = portfolioData.systemProperties?.systemInfo?.EXPERIENCE || '5 Years';
  const experienceText = `${rawExperience} of 'just one small change'`;
  const { playSound } = useSound();

  const handleSayHello = () => {
    playSound('chimes');
    if (onOpenHello) onOpenHello();
    if (onClose) onClose();
  };

  const handleClose = () => {
    playSound('chord');
    if (onClose) onClose();
  };

  const sysInfoItems = [
    { label: 'SYSTEM TYPE', val: 'Product Designer (mostly human)' },
    { label: 'SPECIALIZATION', val: 'Fintech, Web, Mobile. Making numbers look friendly.' },
    { label: 'EXPERIENCE', val: experienceText },
    { label: 'CURRENT ROLE', val: 'Product Designer at Neo. Unofficially: the person who knows where the Figma file is.' },
    { label: 'LOCATION', val: 'Goa, India. Working, not vacationing.' },
    { label: 'PRIMARY TOOLS', val: 'Figma, Photoshop, Illustrator, and Ctrl+Z' },
    { label: 'INTERESTS', val: 'Product design, UX strategy, AI, research. Also strong opinions about padding.' },
  ];

  const sysStatusItems = [
    { label: 'DESIGN SYSTEM', val: 'ACTIVE' },
    { label: 'FINTECH MODE', val: 'ACTIVE (SADLY)' },
    { label: 'IDEAS', val: 'RUNNING (UNSTABLE)' },
    { label: 'COFFEE', val: 'REQUIRED' },
  ];

  return (
    <Window
      id="my-computer-window"
      title="Me.exe"
      icon={<MyComputerIcon />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={false}
      zIndex={zIndex}
      position={position}
      defaultWidth={620}
      defaultHeight="auto"
      hasMenu={false}
      showMinimize={false}
      showMaximize={false}
      showClose={true}
      isDialog={true}
      onFocus={onFocus}
      onClose={handleClose}
    >
      <div
        className="WindowClientArea win-dialog-client"
        style={{
          alignSelf: 'stretch',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
          paddingBottom: '14px',
          background: '#C0C0C0',
          boxShadow: 'none',
          border: 'none',
          flexDirection: 'column',
          gap: '10px',
          display: 'flex',
          boxSizing: 'border-box',
          fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
          fontSize: '11px',
        }}
      >
        {/* Header section */}
        <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#404040',
              fontSize: '11px',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            &quot;Yes, unfortunately, this is mine.&quot;
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#000000',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '22px',
            }}
          >
            NAVEEN KUMAR PANDEY
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#000080',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            PRODUCT DESIGNER
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#404040',
              fontSize: '11px',
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            Fintech • Web • Mobile
          </div>
        </div>

        {/* 3D Divider */}
        <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid #FFFFFF' }} />
        </div>

        {/* 2 Columns: System Info on left, About & Status on right */}
        <div
          style={{
            alignSelf: 'stretch',
            display: 'flex',
            gap: '12px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: System Information */}
          <div style={{ flex: '1 1 310px', display: 'flex', flexDirection: 'column' }}>
            <div
              className="GroupSystemInformation"
              style={{
                alignSelf: 'stretch',
                height: '100%',
                paddingTop: '16px',
                paddingBottom: '10px',
                paddingLeft: '12px',
                paddingRight: '12px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                border: '1px solid #808080',
                boxShadow: '1px 1px 0px #FFFFFF, inset 1px 1px 0px #FFFFFF',
                boxSizing: 'border-box',
              }}
            >
              {/* Group Box Title */}
              <div
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  left: '10px',
                  top: '-7px',
                  position: 'absolute',
                  background: '#C0C0C0',
                  display: 'inline-flex',
                }}
              >
                <span
                  style={{
                    color: '#000000',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  SYSTEM INFORMATION
                </span>
              </div>

              {sysInfoItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '108px',
                      flexShrink: 0,
                      color: '#404040',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.3px',
                    }}
                  >
                    {item.label}:
                  </div>
                  <div
                    style={{
                      flex: 1,
                      color: '#000000',
                      fontSize: '11px',
                      fontWeight: 400,
                    }}
                  >
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: About & System Status */}
          <div style={{ flex: '1 1 270px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* About Box */}
            <div
              className="GroupAbout"
              style={{
                alignSelf: 'stretch',
                paddingTop: '16px',
                paddingBottom: '10px',
                paddingLeft: '12px',
                paddingRight: '12px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #808080',
                boxShadow: '1px 1px 0px #FFFFFF, inset 1px 1px 0px #FFFFFF',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  left: '10px',
                  top: '-7px',
                  position: 'absolute',
                  background: '#C0C0C0',
                  display: 'inline-flex',
                }}
              >
                <span
                  style={{
                    color: '#000000',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  ABOUT
                </span>
              </div>
              <div
                style={{
                  color: '#000000',
                  fontSize: '11px',
                  lineHeight: '15px',
                  fontWeight: 400,
                }}
              >
                I&apos;m a product designer who builds fintech, web and mobile products people can actually use, even on a Monday. I work across product strategy, UX, interaction design, design systems, research and design QA, which is a fancy way of saying I notice the 2px misalignment you didn&apos;t.
              </div>
            </div>

            {/* System Status Box */}
            <div
              className="GroupSystemStatus"
              style={{
                alignSelf: 'stretch',
                paddingTop: '16px',
                paddingBottom: '10px',
                paddingLeft: '12px',
                paddingRight: '12px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                border: '1px solid #808080',
                boxShadow: '1px 1px 0px #FFFFFF, inset 1px 1px 0px #FFFFFF',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  left: '10px',
                  top: '-7px',
                  position: 'absolute',
                  background: '#C0C0C0',
                  display: 'inline-flex',
                }}
              >
                <span
                  style={{
                    color: '#000000',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  SYSTEM STATUS
                </span>
              </div>
              {sysStatusItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    lineHeight: '14px',
                  }}
                >
                  <span style={{ color: '#404040', fontWeight: 700, fontSize: '10px' }}>
                    {item.label}:
                  </span>
                  <span style={{ color: '#000000', fontWeight: 700 }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Divider */}
        <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column', marginTop: '2px' }}>
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid #FFFFFF' }} />
        </div>

        {/* Buttons Row */}
        <div
          style={{
            alignSelf: 'stretch',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            paddingTop: '2px',
          }}
        >
          {/* Default Button: Say Hello */}
          <button
            id="btn-say-hello"
            onClick={handleSayHello}
            style={{
              minWidth: '80px',
              height: '23px',
              padding: '0 12px',
              background: '#C0C0C0',
              boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
              border: '1px solid #000000',
              outline: '1px dotted #000000',
              outlineOffset: '-4px',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            Say Hello
          </button>

          {/* Close Button */}
          <button
            id="btn-close-mycomputer"
            onClick={handleClose}
            style={{
              minWidth: '75px',
              height: '23px',
              padding: '0 12px',
              background: '#C0C0C0',
              boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
              border: 'none',
              fontSize: '11px',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Window>
  );
}
