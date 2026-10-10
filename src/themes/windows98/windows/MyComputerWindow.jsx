import React from 'react';
import Window from '../components/Window';
import Button from '../components/Button';
import { FolderIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function MyComputerWindow({
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
  const profile = portfolioData.profile || {};
  const systemProperties = portfolioData.systemProperties || {};
  const systemInfo = systemProperties.systemInfo || {};
  const systemStatus = systemProperties.systemStatus || {};
  const { playSound } = useSound();

  const handleOk = () => {
    playSound('chord');
    if (onClose) onClose();
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <Window
      id="my-computer-window"
      title="My Computer"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={780}
      defaultHeight={660}
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
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '16px',
          background: '#C0C0C0',
          overflowY: 'auto',
          flexDirection: 'column',
          gap: '12px',
          display: 'flex',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            color: '#808080',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          &quot;Yes, unfortunately, this is mine.&quot;
        </div>

        {/* Title */}
        <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              alignSelf: 'stretch',
              color: 'black',
              fontSize: '22px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
            }}
          >
            {profile.name.toUpperCase()}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#000080',
              fontSize: '12px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#808080',
              fontSize: '10px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 400,
            }}
          >
            FINTECH • WEB &amp; MOBILE
          </div>
        </div>

        {/* 3D Divider */}
        <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid white' }} />
        </div>

        {/* 2 Columns: System Info on left, About & Status on right */}
        <div
          style={{
            alignSelf: 'stretch',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Column: System Information */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column' }}>
            <div
              className="GroupSystemInformation"
              style={{
                alignSelf: 'stretch',
                paddingTop: '22px',
                paddingBottom: '12px',
                paddingLeft: '14px',
                paddingRight: '14px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '7px',
                  bottom: 0,
                  border: '1px solid #808080',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '1px',
                  right: '1px',
                  top: '8px',
                  bottom: '1px',
                  border: '1px solid white',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  left: '10px',
                  top: 0,
                  position: 'absolute',
                  background: '#C0C0C0',
                  display: 'inline-flex',
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
                  SYSTEM INFORMATION
                </div>
              </div>

              {Object.entries(systemInfo).map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '120px',
                      color: '#808080',
                      fontSize: '10px',
                      fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                      fontWeight: 700,
                      letterSpacing: '0.50px',
                    }}
                  >
                    {label.toUpperCase()}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      color: 'black',
                      fontSize: '11px',
                      fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: About & System Status */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* About Box */}
            <div
              className="GroupAbout"
              style={{
                alignSelf: 'stretch',
                paddingTop: '22px',
                paddingBottom: '12px',
                paddingLeft: '14px',
                paddingRight: '14px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '7px',
                  bottom: 0,
                  border: '1px solid #808080',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '1px',
                  right: '1px',
                  top: '8px',
                  bottom: '1px',
                  border: '1px solid white',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  left: '10px',
                  top: 0,
                  position: 'absolute',
                  background: '#C0C0C0',
                  display: 'inline-flex',
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
                  ABOUT
                </div>
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
                {systemProperties.about}
              </div>
            </div>

            {/* System Status Box */}
            <div
              className="GroupSystemStatus"
              style={{
                alignSelf: 'stretch',
                paddingTop: '22px',
                paddingBottom: '12px',
                paddingLeft: '14px',
                paddingRight: '14px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '7px',
                  bottom: 0,
                  border: '1px solid #808080',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '1px',
                  right: '1px',
                  top: '8px',
                  bottom: '1px',
                  border: '1px solid white',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  left: '10px',
                  top: 0,
                  position: 'absolute',
                  background: '#C0C0C0',
                  display: 'inline-flex',
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
                  SYSTEM STATUS
                </div>
              </div>
              {Object.entries(systemStatus).map(([name, status]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#808080',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  }}
                >
                  <span>{name.toUpperCase()}</span>
                  <span>{status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid white' }} />
        </div>

        {/* Buttons */}
        <div
          style={{
            alignSelf: 'stretch',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Button id="btn-ok-mycomputer" onClick={handleOk}>
            OK
          </Button>
          <Button id="btn-cancel-mycomputer" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Window>
  );
}
