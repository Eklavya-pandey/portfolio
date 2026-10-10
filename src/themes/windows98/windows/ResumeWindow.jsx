import React, { useRef, useState, useEffect } from 'react';
import Window from '../components/Window';
import { FolderIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';

export default function ResumeWindow({
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
  const { profile, experience, highlights, education, freelanceClients } = portfolioData;

  const docRef = useRef(null);
  const trackRef = useRef(null);
  const [thumbTop, setThumbTop] = useState(0);

  const updateThumbPosition = () => {
    if (!docRef.current || !trackRef.current) return;
    const doc = docRef.current;
    const track = trackRef.current;
    const scrollMax = doc.scrollHeight - doc.clientHeight;
    if (scrollMax <= 0) {
      setThumbTop(0);
      return;
    }
    const trackHeight = track.clientHeight;
    const thumbHeight = 80;
    const availableTrack = trackHeight - thumbHeight;
    if (availableTrack <= 0) return;

    const ratio = doc.scrollTop / scrollMax;
    setThumbTop(ratio * availableTrack);
  };

  const handleScrollUp = () => {
    if (docRef.current) docRef.current.scrollTop -= 40;
  };

  const handleScrollDown = () => {
    if (docRef.current) docRef.current.scrollTop += 40;
  };

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startTop = thumbTop;

    const handleMouseMove = (moveEv) => {
      if (!docRef.current || !trackRef.current) return;
      const track = trackRef.current;
      const trackHeight = track.clientHeight;
      const thumbHeight = 80;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;

      const deltaY = moveEv.clientY - startY;
      const nextTop = Math.max(0, Math.min(availableTrack, startTop + deltaY));
      setThumbTop(nextTop);

      const ratio = nextTop / availableTrack;
      const scrollMax = docRef.current.scrollHeight - docRef.current.clientHeight;
      docRef.current.scrollTop = ratio * scrollMax;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackClick = (e) => {
    if (!docRef.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = trackRef.current.clientHeight;
    const thumbHeight = 80;
    const availableTrack = trackHeight - thumbHeight;
    if (availableTrack <= 0) return;

    const targetRatio = Math.max(0, Math.min((clickY - thumbHeight / 2) / availableTrack, 1));
    const scrollMax = docRef.current.scrollHeight - docRef.current.clientHeight;
    docRef.current.scrollTop = targetRatio * scrollMax;
  };

  return (
    <Window
      id="resume-window"
      title="RESUME.EXE"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={760}
      defaultHeight={700}
      hasMenu={true}
      hasStatusBar={true}
      statusText="Page 1 of 1  |  RESUME.EXE"
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        className="ClientWrapper"
        style={{
          alignSelf: 'stretch',
          flex: 1,
          paddingTop: '4px',
          paddingBottom: '4px',
          paddingLeft: '4px',
          background: '#C0C0C0',
          overflow: 'hidden',
          display: 'flex',
          boxSizing: 'border-box',
        }}
      >
        {/* Document Area */}
        <div
          ref={docRef}
          id="resume-doc-area"
          className="DocumentArea"
          style={{
            flex: 1,
            alignSelf: 'stretch',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '20px',
            paddingBottom: '20px',
            background: 'white',
            overflowY: 'auto',
            outline: '1px solid #808080',
            flexDirection: 'column',
            gap: '14px',
            display: 'flex',
            boxSizing: 'border-box',
          }}
          onScroll={updateThumbPosition}
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
            &quot;The official version of events.&quot;
          </div>

          {/* Header */}
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
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 400,
              }}
            >
              {profile.focus}
            </div>
          </div>

          <div style={{ alignSelf: 'stretch', paddingTop: '6px' }}>
            <div
              style={{
                alignSelf: 'stretch',
                color: 'black',
                fontSize: '11px',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontWeight: 400,
              }}
            >
              5 years of experience building fintech platforms, web experiences and mobile products.
            </div>
          </div>

          {/* Divider */}
          <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
            <div style={{ height: '1px', borderBottom: '1px solid white' }} />
          </div>

          {/* Experience Section */}
          <div
            style={{
              color: '#808080',
              fontSize: '10px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
              letterSpacing: '0.80px',
            }}
          >
            EXPERIENCE
          </div>

          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {experience.map((job, idx) => (
              <div key={idx} style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div
                  style={{
                    alignSelf: 'stretch',
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {job.role}
                </div>
                <div
                  style={{
                    alignSelf: 'stretch',
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {job.company}
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
                  {job.period}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
            <div style={{ height: '1px', borderBottom: '1px solid white' }} />
          </div>

          {/* Selected Highlights */}
          <div
            style={{
              color: '#808080',
              fontSize: '10px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
              letterSpacing: '0.80px',
            }}
          >
            SELECTED HIGHLIGHTS
          </div>

          <div
            style={{
              alignSelf: 'stretch',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {highlights.map((hl, idx) => (
              <div
                key={idx}
                style={{
                  width: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                }}
              >
                <div
                  style={{
                    alignSelf: 'stretch',
                    color: '#000080',
                    fontSize: '13px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {hl.metric}
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
                  {hl.description}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
            <div style={{ height: '1px', borderBottom: '1px solid white' }} />
          </div>

          {/* Education */}
          <div
            style={{
              color: '#808080',
              fontSize: '10px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
              letterSpacing: '0.80px',
            }}
          >
            EDUCATION
          </div>

          {education.map((edu, idx) => (
            <div key={idx} style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  alignSelf: 'stretch',
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                }}
              >
                {edu.degree}
              </div>
              <div
                style={{
                  alignSelf: 'stretch',
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {edu.institution}
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
                {edu.period}
              </div>
            </div>
          ))}

          {/* Divider */}
          <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
            <div style={{ height: '1px', borderBottom: '1px solid white' }} />
          </div>

          {/* Freelance */}
          <div
            style={{
              color: '#808080',
              fontSize: '10px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
              letterSpacing: '0.80px',
            }}
          >
            FREELANCE
          </div>

          <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {freelanceClients.map((client, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: 'stretch',
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {client}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Retro Scrollbar */}
        <div
          id="resume-scrollbar"
          className="Scrollbar"
          style={{
            width: '16px',
            alignSelf: 'stretch',
            background: '#DFDFDF',
            overflow: 'hidden',
            flexDirection: 'column',
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <div
            id="resume-scroll-up"
            style={{
              alignSelf: 'stretch',
              height: '16px',
              background: '#C0C0C0',
              outline: '1px solid white',
              outlineOffset: '-1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'black',
            }}
            onClick={handleScrollUp}
          >
            ▲
          </div>

          <div
            ref={trackRef}
            id="resume-scroll-track"
            style={{
              alignSelf: 'stretch',
              flex: 1,
              position: 'relative',
              background: '#DFDFDF',
              cursor: 'pointer',
            }}
            onClick={handleTrackClick}
          >
            <div
              id="resume-scroll-thumb"
              style={{
                width: '14px',
                height: '80px',
                left: '1px',
                top: `${thumbTop}px`,
                position: 'absolute',
                background: '#C0C0C0',
                boxShadow: '-1px -1px 0px white, 1px 1px 0px #666666',
                cursor: 'grab',
              }}
              onMouseDown={handleThumbMouseDown}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div
            id="resume-scroll-down"
            style={{
              alignSelf: 'stretch',
              height: '16px',
              background: '#C0C0C0',
              outline: '1px solid white',
              outlineOffset: '-1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'black',
            }}
            onClick={handleScrollDown}
          >
            ▼
          </div>
        </div>
      </div>
    </Window>
  );
}
