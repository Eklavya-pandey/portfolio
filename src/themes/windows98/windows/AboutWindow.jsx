import React from 'react';
import Window from '../components/Window';
import Button from '../components/Button';
import { ProgramIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function AboutWindow({
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
  const { profile } = portfolioData;
  const { playSound } = useSound();

  const handleOk = () => {
    playSound('chord');
    if (onClose) onClose();
  };

  return (
    <Window
      id="about-me-window"
      title="ABOUT_ME.EXE"
      icon={<ProgramIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={460}
      defaultHeight={300}
      hasMenu={true}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        className="WindowClientArea"
        style={{
          alignSelf: 'stretch',
          flex: 1,
          padding: '16px 18px',
          background: '#C0C0C0',
          boxShadow:
            '2px 2px 0px black inset, -2px -2px 0px #C1C1C1 inset, 1px 1px 0px #808080 inset, -1px -1px 0px white inset',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '12px',
          display: 'flex',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Text */}
        <div
          className="HeaderText"
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '3px',
            display: 'flex',
          }}
        >
          <div
            className="HelloIM"
            style={{
              color: '#5A5A5A',
              fontSize: '11px',
              fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
              fontWeight: 400,
              lineHeight: '12px',
            }}
          >
            HELLO, I'M
          </div>
          <div
            className="NaveenKumarPandey"
            style={{
              color: '#000000',
              fontSize: '17px',
              fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.2px',
              lineHeight: '20px',
            }}
          >
            {profile.name.toUpperCase()}
          </div>
          <div
            className="SrExecutiveUiUxDesignerFintechWebMobile"
            style={{
              color: '#000080',
              fontSize: '11px',
              fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
              fontWeight: 700,
              lineHeight: '14px',
            }}
          >
            {profile.title.toUpperCase()}
          </div>
        </div>

        {/* 3D Divider */}
        <div
          className="DDivider"
          style={{
            alignSelf: 'stretch',
            height: '2px',
            flexDirection: 'column',
            display: 'flex',
          }}
        >
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid white' }} />
        </div>

        {/* Short personality quote: Non-italic subtle designer joke with more visual presence */}
        <div
          className="QuoteSection"
          style={{
            alignSelf: 'stretch',
            paddingTop: '2px',
            paddingBottom: '2px',
            display: 'flex',
          }}
        >
          <div
            style={{
              flex: 1,
              color: '#000000',
              fontSize: '12px',
              fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '17px',
              letterSpacing: '0.1px',
            }}
          >
            {profile.quote}
          </div>
        </div>

        {/* 3D Divider with breathing room before information section */}
        <div
          className="DDivider"
          style={{
            alignSelf: 'stretch',
            height: '2px',
            flexDirection: 'column',
            display: 'flex',
            marginTop: '2px',
            marginBottom: '2px',
          }}
        >
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid white' }} />
        </div>

        {/* Information rows: Slightly increased spacing between rows */}
        <div
          className="PropertiesDialog"
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            gap: '8px',
            display: 'flex',
          }}
        >
          <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '82px',
                color: '#505050',
                fontSize: '11px',
                fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              CURRENTLY:
            </div>
            <div
              style={{
                flex: 1,
                color: '#000000',
                fontSize: '11px',
                fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
                fontWeight: 400,
              }}
            >
              {profile.currently}
            </div>
          </div>

          <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '82px',
                color: '#505050',
                fontSize: '11px',
                fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              FOCUS:
            </div>
            <div
              style={{
                flex: 1,
                color: '#000000',
                fontSize: '11px',
                fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
                fontWeight: 400,
              }}
            >
              {profile.focus}
            </div>
          </div>

          <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '82px',
                color: '#505050',
                fontSize: '11px',
                fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              I ENJOY:
            </div>
            <div
              style={{
                flex: 1,
                color: '#000000',
                fontSize: '11px',
                fontFamily: "'MS Sans Serif', Tahoma, 'MS W98 UI', sans-serif",
                fontWeight: 400,
              }}
            >
              {profile.enjoy}
            </div>
          </div>
        </div>

        {/* Action: Centered OK Button with Preferred styling, no initial keyboard focus */}
        <div
          className="ButtonRow"
          style={{
            alignSelf: 'stretch',
            paddingTop: '12px',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Button
            id="btn-ok-about"
            preferred={true}
            onClick={handleOk}
          >
            OK
          </Button>
        </div>
      </div>
    </Window>
  );
}
