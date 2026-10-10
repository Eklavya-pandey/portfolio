import React, { useState } from 'react';
import Window from '../components/Window';
import Button from '../components/Button';
import { FolderIconSmall, FileIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function RecycleBinWindow({
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
  const [items, setItems] = useState(portfolioData.recycleBin?.items || []);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const { playSound } = useSound();

  const handleRowClick = (idx) => {
    setSelectedIdx(idx);
    playSound('recycle');
  };

  const handleEmpty = () => {
    playSound('recycle');
    if (window.confirm(`Are you sure you want to permanently delete these ${items.length} items?`)) {
      setItems([]);
      setSelectedIdx(null);
    }
  };

  const handleRestore = () => {
    playSound('chord');
    if (selectedIdx !== null && items[selectedIdx]) {
      alert(`Restored "${items[selectedIdx].name}" to its original location.`);
      setItems((prev) => prev.filter((_, i) => i !== selectedIdx));
      setSelectedIdx(null);
    }
  };

  const handleDelete = () => {
    playSound('recycle');
    if (selectedIdx !== null) {
      setItems((prev) => prev.filter((_, i) => i !== selectedIdx));
      setSelectedIdx(null);
    }
  };

  const statusText =
    !items || items.length === 0
      ? '0 object(s)  |  Clean slate achieved.'
      : `${items.length} object(s)  |  ${portfolioData.recycleBin?.status || 'Some ideas were deleted. Some deserved it.'}`;

  return (
    <Window
      id="recycle-bin-window"
      title="Recycle Bin"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={740}
      defaultHeight={580}
      hasMenu={true}
      hasStatusBar={true}
      statusText={statusText}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        style={{
          alignSelf: 'stretch',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#C0C0C0',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Toolbar */}
        <div
          className="Toolbar"
          style={{
            alignSelf: 'stretch',
            padding: '4px 6px',
            background: '#C0C0C0',
            boxShadow: '0px -1px 0px rgba(127.50, 127.50, 127.50, 0.30) inset',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <Button id="btn-restore-recycle" onClick={handleRestore} disabled={selectedIdx === null}>
            Restore
          </Button>
          <Button id="btn-delete-recycle" onClick={handleDelete} disabled={selectedIdx === null}>
            Delete
          </Button>
          <Button id="btn-empty-recycle" onClick={handleEmpty} disabled={items.length === 0}>
            Empty Recycle Bin
          </Button>
        </div>

        {/* Subtitle */}
        <div style={{ padding: '2px 6px' }}>
          <div
            style={{
              color: '#808080',
              fontSize: '10px',
              fontFamily: 'Inter, sans-serif',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            &quot;Ideas that sounded better at 2 AM.&quot;
          </div>
        </div>

        {/* Table / List View */}
        <div
          id="recycle-rows-container"
          style={{
            flex: 1,
            margin: '4px',
            background: 'white',
            outline: '1px solid #808080',
            boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.20) inset',
            overflowY: 'auto',
          }}
        >
          {items.length === 0 ? (
            <div style={{ padding: '16px', color: '#808080', fontSize: '11px', fontFamily: "'MS W98 UI', sans-serif" }}>
              The Recycle Bin is empty.
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                fontSize: '11px',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ background: '#DFDFDF', borderBottom: '1px solid #808080' }}>
                  <th style={{ padding: '3px 6px', fontWeight: 700 }}>Name</th>
                  <th style={{ padding: '3px 6px', fontWeight: 700 }}>Original Location</th>
                  <th style={{ padding: '3px 6px', fontWeight: 700 }}>Date Deleted</th>
                  <th style={{ padding: '3px 6px', fontWeight: 700 }}>Type</th>
                  <th style={{ padding: '3px 6px', fontWeight: 700 }}>Size</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <tr
                      key={idx}
                      className={`FileRow ${isSelected ? 'selected' : ''}`}
                      style={{
                        background: isSelected ? '#000080' : 'transparent',
                        color: isSelected ? 'white' : 'black',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      onClick={() => handleRowClick(idx)}
                    >
                      <td style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                          <FileIconSmall />
                        </div>
                        <span>{item.name}</span>
                      </td>
                      <td style={{ padding: '3px 6px' }}>{item.originalLocation}</td>
                      <td style={{ padding: '3px 6px' }}>{item.dateDeleted}</td>
                      <td style={{ padding: '3px 6px' }}>{item.type}</td>
                      <td style={{ padding: '3px 6px' }}>{item.size}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Window>
  );
}
