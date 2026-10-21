import React, { useState, useRef, useEffect, useCallback } from 'react';
import Window from '../../components/Window';
import AboutAppDialog from '../../components/AboutAppDialog';
import { useSound } from '../../../../context/SoundContext';

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
  const { playSound } = useSound();

  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const [isModified, setIsModified] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [showFindDialog, setShowFindDialog] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastFindIdxRef = useRef(0);

  // Close dialogs on Escape key
  useEffect(() => {
    if (!showFindDialog && !showConfirmClose && !showAbout) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showFindDialog) setShowFindDialog(false);
        if (showConfirmClose) setShowConfirmClose(false);
        if (showAbout) setShowAbout(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFindDialog, showConfirmClose, showAbout]);

  // Handle Text Change
  const handleTextChange = (e) => {
    setText(e.target.value);
    setIsModified(true);
  };

  // File Operations
  const handleNew = () => {
    if (isModified) {
      if (window.confirm(`Do you want to save changes to ${fileName}?`)) {
        handleSave();
      }
    }
    setText('');
    setFileName('Untitled');
    setIsModified(false);
  };

  const handleOpenFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result || '');
      setFileName(file.name);
      setIsModified(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleSaveAs = () => {
    const userFileName = window.prompt('Save As filename:', fileName.endsWith('.txt') ? fileName : `${fileName}.txt`);
    if (userFileName) {
      const cleanName = userFileName.trim();
      setFileName(cleanName);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsModified(false);
    }
  };

  const handleAttemptClose = () => {
    if (isModified && text.trim().length > 0) {
      setShowConfirmClose(true);
    } else {
      if (onClose) onClose();
    }
  };

  // Edit Operations
  const handleInsertTimeDate = () => {
    const now = new Date();
    const timeDateStr = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString()}`;
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const nextText = text.substring(0, start) + timeDateStr + text.substring(end);
      setText(nextText);
      setIsModified(true);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + timeDateStr.length;
        el.focus();
      }, 0);
    } else {
      setText((prev) => prev + timeDateStr);
      setIsModified(true);
    }
  };

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  };

  const handleDelete = () => {
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== end) {
        const nextText = text.substring(0, start) + text.substring(end);
        setText(nextText);
        setIsModified(true);
        setTimeout(() => {
          el.selectionStart = el.selectionEnd = start;
          el.focus();
        }, 0);
      }
    }
  };

  // Search Find & Find Next
  const handleFind = () => {
    if (!findQuery || !textareaRef.current) return;
    const idx = text.toLowerCase().indexOf(findQuery.toLowerCase(), lastFindIdxRef.current);
    if (idx !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(idx, idx + findQuery.length);
      lastFindIdxRef.current = idx + findQuery.length;
    } else {
      // Loop back to start
      const loopIdx = text.toLowerCase().indexOf(findQuery.toLowerCase(), 0);
      if (loopIdx !== -1) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(loopIdx, loopIdx + findQuery.length);
        lastFindIdxRef.current = loopIdx + findQuery.length;
      } else {
        alert(`Cannot find "${findQuery}"`);
        lastFindIdxRef.current = 0;
      }
    }
  };

  // Menu bar items matching classic Win98 Notepad (File, Edit, Search, Help - NO Format menu)
  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', onClick: handleNew },
        { label: 'Open...', shortcut: 'Ctrl+O', onClick: handleOpenFileClick },
        { label: 'Save', shortcut: 'Ctrl+S', onClick: handleSave },
        { label: 'Save As...', onClick: handleSaveAs },
        { isSeparator: true },
        { label: 'Page Setup...', disabled: true },
        { label: 'Print', shortcut: 'Ctrl+P', disabled: true },
        { isSeparator: true },
        { label: 'Exit', onClick: handleAttemptClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          shortcut: 'Ctrl+Z',
          onClick: () => {
            if (document.execCommand) document.execCommand('undo');
          },
        },
        { isSeparator: true },
        {
          label: 'Cut',
          shortcut: 'Ctrl+X',
          onClick: () => {
            if (document.execCommand) document.execCommand('cut');
          },
        },
        {
          label: 'Copy',
          shortcut: 'Ctrl+C',
          onClick: () => {
            if (document.execCommand) document.execCommand('copy');
          },
        },
        {
          label: 'Paste',
          shortcut: 'Ctrl+V',
          onClick: async () => {
            try {
              const clip = await navigator.clipboard.readText();
              if (clip && textareaRef.current) {
                const el = textareaRef.current;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const nextText = text.substring(0, start) + clip + text.substring(end);
                setText(nextText);
                setIsModified(true);
              }
            } catch {
              if (document.execCommand) document.execCommand('paste');
            }
          },
        },
        { label: 'Delete', shortcut: 'Del', onClick: handleDelete },
        { isSeparator: true },
        { label: 'Select All', shortcut: 'Ctrl+A', onClick: handleSelectAll },
        { label: 'Time/Date', shortcut: 'F5', onClick: handleInsertTimeDate },
        { isSeparator: true },
        {
          label: 'Word Wrap',
          checked: wordWrap,
          onClick: () => setWordWrap((prev) => !prev),
        },
      ],
    },
    {
      label: 'Search',
      items: [
        {
          label: 'Find...',
          shortcut: 'Ctrl+F',
          onClick: () => setShowFindDialog(true),
        },
        {
          label: 'Find Next',
          shortcut: 'F3',
          onClick: handleFind,
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'Help Topics',
          disabled: true,
        },
        { isSeparator: true },
        {
          label: 'About Notepad',
          onClick: () => setShowAbout(true),
        },
      ],
    },
  ];

  return (
    <>
      <Window
        id="notepad-window"
        title={`${fileName} - Notepad`}
        icon={<NotepadIconSmall />}
        isOpen={isOpen}
        isActive={isActive}
        isMaximized={isMaximized}
        zIndex={zIndex}
        position={position}
        defaultWidth={560}
        defaultHeight={380}
        minWidth={320}
        minHeight={200}
        resizable={true}
        hasMenu={true}
        menuItems={menuItems}
        hasStatusBar={false}
        onFocus={onFocus}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={handleAttemptClose}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Text Area */}
        <div
          style={{
            alignSelf: 'stretch',
            flex: 1,
            display: 'flex',
            background: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <textarea
            ref={textareaRef}
            id="notepad-textarea"
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'F5') {
                e.preventDefault();
                handleInsertTimeDate();
              }
              if (e.key === 'F3') {
                e.preventDefault();
                handleFind();
              }
            }}
            wrap={wordWrap ? 'soft' : 'off'}
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              margin: 0,
              padding: '6px 8px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
              background: '#FFFFFF',
              color: '#000000',
              fontFamily: "'Fixedsys', 'Courier New', Courier, monospace",
              fontSize: '13px',
              lineHeight: '18px',
              letterSpacing: '0px',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              overflowX: wordWrap ? 'hidden' : 'auto',
              overflowY: 'auto',
            }}
          />
        </div>
      </Window>

      {/* Find Dialog */}
      {showFindDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowFindDialog(false)}
        >
          <div
            className="win95-window win-dialog"
            style={{
              width: '320px',
              background: '#C0C0C0',
              boxShadow: '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
              padding: '3px',
              boxSizing: 'border-box',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              fontSize: '11px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
                color: 'white',
                fontWeight: 700,
                padding: '2px 4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Find</span>
              <button
                onClick={() => setShowFindDialog(false)}
                style={{ width: '16px', height: '14px', background: '#C0C0C0', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '12px 10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#000000' }}>Find what:</span>
              <input
                type="text"
                autoFocus
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFind();
                }}
                style={{
                  flex: 1,
                  height: '21px',
                  border: '1px solid #808080',
                  boxShadow: '1px 1px 0px black inset',
                  padding: '2px 4px',
                  fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                  fontSize: '11px',
                }}
              />
              <button
                onClick={handleFind}
                style={{
                  width: '75px',
                  height: '23px',
                  background: '#C0C0C0',
                  boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                  border: '1px solid black',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                }}
              >
                Find Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Save on Exit Dialog */}
      {showConfirmClose && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowConfirmClose(false)}
        >
          <div
            className="win95-window win-dialog"
            style={{
              width: '360px',
              background: '#C0C0C0',
              boxShadow: '1px 1px 0px #FFFFFF inset, -1px -1px 0px #000000 inset, 2px 2px 0px #DFDFDF inset, -2px -2px 0px #808080 inset',
              padding: '3px',
              boxSizing: 'border-box',
              fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
              fontSize: '11px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
                color: 'white',
                fontWeight: 700,
                padding: '2px 4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Notepad</span>
              <button
                onClick={() => setShowConfirmClose(false)}
                style={{ width: '16px', height: '14px', background: '#C0C0C0', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ color: '#000000', fontSize: '11px' }}>
                The text in the {fileName} file has changed. Do you want to save the changes?
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => {
                    handleSave();
                    setShowConfirmClose(false);
                    if (onClose) onClose();
                  }}
                  style={{
                    width: '70px',
                    height: '23px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: '1px solid black',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowConfirmClose(false);
                    if (onClose) onClose();
                  }}
                  style={{
                    width: '70px',
                    height: '23px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => setShowConfirmClose(false)}
                  style={{
                    width: '70px',
                    height: '23px',
                    background: '#C0C0C0',
                    boxShadow: '2px 2px 0px #DFDFDF inset, -2px -2px 0px #7F7F7F inset, 1px 1px 0px white inset, -1px -1px 0px black inset',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: "var(--win-font, 'W95FA', 'MS Sans Serif', Tahoma, sans-serif)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Dialog */}
      <AboutAppDialog
        isOpen={showAbout}
        appName="Notepad"
        version="Version 4.10 (Windows 98)"
        icon={<NotepadIconSmall />}
        description="It's text. Just text. Relax."
        onClose={() => setShowAbout(false)}
      />
    </>
  );
}
