import React, { useRef, useState } from 'react';
import Window from '../components/Window';
import { FolderIconSmall } from '../components/Icons';
import CaseStudyContent from '../../../components/CaseStudyContent';

/**
 * Windows 98 Case Study Window for OneStepPrint
 * RULE: One source of truth. Renders the universal CaseStudyContent
 * inside authentic Windows 98 chrome and 3D beveled windows.
 */
export default function OneStepPrintWindow({
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
    const thumbHeight = 60;
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

  return (
    <Window
      id="onestepprint-window"
      title="OneStepPrint website redesign - Case Study"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={860}
      defaultHeight={640}
      hasMenu={true}
      hasStatusBar={true}
      statusText="1 Case Study loaded"
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
          flexDirection: 'row',
          background: '#C0C0C0',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Scrollable Document Canvas */}
        <div
          ref={contentRef}
          onScroll={updateThumbPosition}
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#FFFFFF',
            margin: '4px',
            borderTop: '2px solid #808080',
            borderLeft: '2px solid #808080',
            borderRight: '2px solid #FFFFFF',
            borderBottom: '2px solid #FFFFFF',
            boxSizing: 'border-box'
          }}
        >
          <CaseStudyContent
            slug="onestepprint"
            theme="win98"
            onBack={onClose}
            themeClass="win98-cs-theme"
            backHref="/work.html"
          />
        </div>

        {/* Windows 98 Custom Scrollbar Rail */}
        <div
          style={{
            width: '16px',
            height: '100%',
            background: '#C0C0C0',
            borderLeft: '1px solid #808080',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}
        >
          <button
            type="button"
            onClick={handleScrollUp}
            style={{
              width: '16px',
              height: '16px',
              borderTop: '1px solid #FFF',
              borderLeft: '1px solid #FFF',
              borderRight: '1px solid #000',
              borderBottom: '1px solid #000',
              background: '#C0C0C0',
              cursor: 'pointer',
              fontSize: '8px',
              lineHeight: '1',
              padding: 0
            }}
          >
            ▲
          </button>
          <div
            ref={trackRef}
            style={{
              flex: 1,
              position: 'relative',
              background: '#DFDFDF'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: `${thumbTop}px`,
                left: '1px',
                width: '14px',
                height: '60px',
                background: '#C0C0C0',
                borderTop: '1px solid #FFF',
                borderLeft: '1px solid #FFF',
                borderRight: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleScrollDown}
            style={{
              width: '16px',
              height: '16px',
              borderTop: '1px solid #FFF',
              borderLeft: '1px solid #FFF',
              borderRight: '1px solid #000',
              borderBottom: '1px solid #000',
              background: '#C0C0C0',
              cursor: 'pointer',
              fontSize: '8px',
              lineHeight: '1',
              padding: 0
            }}
          >
            ▼
          </button>
        </div>
      </div>
    </Window>
  );
}
