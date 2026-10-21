import React, { useState, useRef, useEffect, useCallback } from 'react';
import Window from '../../components/Window';
import { portfolioData } from '../../../../data/portfolioData';

// Small Notepad Icon
export const NotepadIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" fill="#6699FF" stroke="#000" strokeWidth="1" />
    <path d="M4 1V15" stroke="#000" strokeWidth="0.5" />
    <rect x="5" y="3" width="7" height="1" fill="#FFF" />
    <rect x="5" y="6" width="7" height="1" fill="#FFF" />
    <rect x="5" y="9" width="7" height="1" fill="#FFF" />
    <rect x="5" y="12" width="7" height="1" fill="#FFF" />
  </svg>
);

function getResumePlainText() {
  const { profile, experience, education, freelanceClients } = portfolioData;
  let text = `=======================================================\n`;
  text += `${profile.name}\n${profile.role}\n`;
  text += `Location: ${profile.location} | Email: ${profile.email}\n`;
  text += `=======================================================\n\n`;
  text += `SUMMARY:\n${profile.summary}\n\n`;
  text += `EXPERIENCE:\n`;
  experience.forEach((exp) => {
    text += `* ${exp.role} - ${exp.company} (${exp.period})\n`;
    text += `  Focus: ${exp.focus}\n`;
    text += `  ${exp.description}\n\n`;
  });
  text += `EDUCATION:\n`;
  education.forEach((edu) => {
    text += `* ${edu.degree} - ${edu.school} (${edu.period})\n`;
    text += `  ${edu.detail}\n\n`;
  });
  text += `FREELANCE CLIENTS:\n`;
  freelanceClients.forEach((client) => {
    text += `* ${client.name} - ${client.project} (${client.year})\n`;
  });
  return text;
}

export default function NotepadWindow({
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
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [showFindDialog, setShowFindDialog] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Close dialogs on Escape key
  useEffect(() => {
    if (!showOpenDialog && !showFindDialog && !showAboutDialog) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showOpenDialog) setShowOpenDialog(false);
        if (showFindDialog) setShowFindDialog(false);
        if (showAboutDialog) setShowAboutDialog(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOpenDialog, showFindDialog, showAboutDialog]);

  const textareaRef = useRef(null);

  // Update cursor position Ln X, Col Y
  const updateCursorPosition = () => {
    const el = textareaRef.current;
    if (!el) return;
    const val = el.value.substr(0, el.selectionStart);
    const lines = val.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  const handleNew = () => {
    setText('');
    setFileName('Untitled');
    setIsReadOnly(false);
  };

  const handleOpenResume = () => {
    const resumeText = getResumePlainText();
    setText(resumeText);
    setFileName('Resume.txt (Read Only)');
    setIsReadOnly(true);
    setShowOpenDialog(false);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName.endsWith('.txt') ? fileName.replace(' (Read Only)', '') : `${fileName}.txt`;
    link.click();
  };

  const handleInsertTimeDate = () => {
    if (isReadOnly) return;
    const el = textareaRef.current;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString();
    const stamp = `${timeStr} ${dateStr}`;

    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const nextText = text.substring(0, start) + stamp + text.substring(end);
      setText(nextText);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + stamp.length;
        el.focus();
        updateCursorPosition();
      }, 0);
    } else {
      setText((prev) => prev + stamp);
    }
  };

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const handleFind = () => {
    if (!findQuery.trim() || !textareaRef.current) return;
    const el = textareaRef.current;
    const idx = text.toLowerCase().indexOf(findQuery.toLowerCase(), el.selectionEnd);
    if (idx !== -1) {
      el.focus();
      el.setSelectionRange(idx, idx + findQuery.length);
      setShowFindDialog(false);
    } else {
      // Loop back to start
      const startIdx = text.toLowerCase().indexOf(findQuery.toLowerCase(), 0);
      if (startIdx !== -1) {
        el.focus();
        el.setSelectionRange(startIdx, startIdx + findQuery.length);
        setShowFindDialog(false);
      } else {
        alert(`Cannot find "${findQuery}"`);
      }
    }
  };

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New', onClick: handleNew },
        { label: 'Open...', onClick: () => setShowOpenDialog(true) },
        { label: 'Save As...', onClick: handleSave },
        { isSeparator: true },
        { label: 'Exit', onClick: onClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          onClick: () => {
            document.execCommand('undo');
          },
        },
        { isSeparator: true },
        {
          label: 'Cut',
          onClick: () => {
            document.execCommand('cut');
          },
        },
        {
          label: 'Copy',
          onClick: () => {
            document.execCommand('copy');
          },
        },
        {
          label: 'Paste',
          onClick: async () => {
            try {
              const clipboardText = await navigator.clipboard.readText();
              if (textareaRef.current) {
                const el = textareaRef.current;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                setText(text.substring(0, start) + clipboardText + text.substring(end));
              }
            } catch {
              document.execCommand('paste');
            }
          },
        },
        { isSeparator: true },
        { label: 'Select All', onClick: handleSelectAll },
        { label: 'Time/Date (F5)', onClick: handleInsertTimeDate },
      ],
    },
    {
      label: 'Search',
      items: [{ label: 'Find...', onClick: () => setShowFindDialog(true) }],
    },
    {
      label: 'Format',
      items: [
        {
          label: `Word Wrap ${wordWrap ? '✓' : ''}`,
          onClick: () => setWordWrap((prev) => !prev),
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Notepad',
          onClick: () => setShowAboutDialog(true),
        },
      ],
    },
  ];

  return (
    <Window
      id="window-notepad"
      title={`${fileName} - Notepad`}
      icon={<NotepadIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={540}
      defaultHeight={380}
      hasMenu={true}
      menuItems={menuItems}
      hasStatusBar={true}
      statusText={`Ln ${cursorPos.line}, Col ${cursorPos.col}`}
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
          background: '#FFFFFF',
          position: 'relative',
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          readOnly={isReadOnly}
          wrap={wordWrap ? 'soft' : 'off'}
          onChange={(e) => {
            if (!isReadOnly) {
              setText(e.target.value);
              updateCursorPosition();
            }
          }}
          onKeyUp={updateCursorPosition}
          onClick={updateCursorPosition}
          onSelect={updateCursorPosition}
          onKeyDown={(e) => {
            if (e.key === 'F5') {
              e.preventDefault();
              handleInsertTimeDate();
            }
          }}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            padding: '6px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '13px',
            lineHeight: '18px',
            color: '#000000',
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            overflowX: wordWrap ? 'hidden' : 'auto',
            overflowY: 'auto',
          }}
          placeholder={isReadOnly ? '' : 'Type text here...'}
        />

        {/* Open Dialog */}
        {showOpenDialog && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              padding: '12px 16px',
              zIndex: 100,
              minWidth: '240px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>Open File</div>
            <div
              onClick={handleOpenResume}
              style={{
                background: '#FFFFFF',
                border: '2px solid',
                borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
              }}
            >
              📄 <strong>Resume.txt</strong> (from System)
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button
                className="win-btn"
                onClick={() => setShowOpenDialog(false)}
                style={{
                  padding: '2px 10px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Find Dialog */}
        {showFindDialog && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              padding: '12px 16px',
              zIndex: 100,
              minWidth: '220px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>Find</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px' }}>Find what:</span>
              <input
                type="text"
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '2px 4px',
                  fontSize: '11px',
                  background: '#FFFFFF',
                  border: '2px solid',
                  borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button
                className="win-btn"
                onClick={handleFind}
                style={{
                  padding: '2px 10px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Find Next
              </button>
              <button
                className="win-btn"
                onClick={() => setShowFindDialog(false)}
                style={{
                  padding: '2px 10px',
                  background: '#C0C0C0',
                  border: '2px solid',
                  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Cancel
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
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
              Notepad
            </div>
            <p style={{ fontSize: '12px', margin: '0 0 14px 0' }}>
              Classic Windows 98 text editor.
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
