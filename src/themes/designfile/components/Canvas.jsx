import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PAGE_FRAMES, COMMENT_NOTES } from '../designfileData';
import CanvasFrame from './CanvasFrame';

export default function Canvas({
  activePage = 'home',
  activeTool = 'select',
  transformHook,
  selectedId,
  selectedMeasure,
  enteredId,
  hoveredId,
  onSelectId,
  onEnter,
  onDeselect,
  onMeasure,
  isAltHeld,
  isShiftAActive,
  isEditMode = false,
  isDevMode = false,
  isOutlineMode = false,
  canvasBg = '#2C2C2C',
  onBlockedAction,
  onAskToEdit,
  hasSeenInteractionHint,
  copiedEmail,
  onCopyEmail,
  onNavigatePage,
  comments = [],
  onAddComment,
  onRecordEasterEgg,
  nodeStyles = {},
  onUpdateStyle,
  createdElements = [],
  onAddCreatedElement,
  onDeleteElement,
  onDuplicateElement,
  deletedNodeIds = []
}) {
  const containerRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

  const {
    transform,
    onWheel,
    onPointerDown: onTransformPointerDown,
    onPointerMove: onTransformPointerMove,
    onPointerUp: onTransformPointerUp,
    isSpaceHeld
  } = transformHook;

  // Track viewport size for accurate ruler ticks and initial fit
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setViewportSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Fit to width on mount once viewport size is known
  useEffect(() => {
    if (viewportSize.w > 0 && viewportSize.h > 0) {
      transformHook.fitToWidth(viewportSize.w, viewportSize.h);
    }
  }, [activePage, viewportSize.w, viewportSize.h]);

  // E1 Presence Cursor Label state (offset 14px right & below)
  const [presenceCursor, setPresenceCursor] = useState({
    visible: false,
    x: 0,
    y: 0,
    sectionName: 'Hero Section'
  });

  // Comment pin placement draft card state
  const [commentDraft, setCommentDraft] = useState(null); // { x, y, text }
  const [commentRotationIndex, setCommentRotationIndex] = useState(0);

  // Context Menu state (Easter Egg 7)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetId: null
  });

  // Interactive Node Dragging in Edit Mode
  const [draggingNode, setDraggingNode] = useState(null); // { id, startX, startY, origX, origY }

  // Interactive Shape Creation in Edit Mode (F, R)
  const [drawingShape, setDrawingShape] = useState(null); // { type, startX, startY, currentX, currentY }

  const frames = PAGE_FRAMES[activePage] || PAGE_FRAMES.home;

  // Real cursor tracking with 14px offset and section detection
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      setPresenceCursor((prev) => ({ ...prev, visible: false }));
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Check what is under cursor
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const frameEl = elem ? elem.closest('.df-canvas-frame, .editorial-project-card') : null;

    let sectionName = 'Hero Section';
    const cardEl = elem?.closest('.editorial-project-card');
    if (cardEl) {
      const titleEl = cardEl.querySelector('.editorial-card-title');
      sectionName = titleEl ? titleEl.textContent.trim() : 'Project Card';
    } else if (frameEl) {
      const containerEl = elem ? elem.closest('.df-canvas-frame-container') : null;
      const titleEl = containerEl ? containerEl.querySelector('.df-frame-title') : null;
      if (titleEl) {
        sectionName = titleEl.textContent.trim();
      } else {
        const frameObj = frames.find((f) => f.id === frameEl.id);
        if (frameObj) sectionName = frameObj.name;
      }
    } else {
      const canvasY = (relY - transform.y) / transform.scale;
      const approxIndex = Math.max(0, Math.min(frames.length - 1, Math.floor(Math.max(0, canvasY) / 550)));
      sectionName = frames[approxIndex]?.name || 'Canvas';
    }

    setPresenceCursor({
      visible: true,
      x: relX + 14,
      y: relY + 14,
      sectionName
    });

    // Record Easter Egg 3 if Alt is held
    if (isAltHeld && onRecordEasterEgg) {
      onRecordEasterEgg(3);
    }
  };

  const handleMouseLeave = () => {
    setPresenceCursor((prev) => ({ ...prev, visible: false }));
  };

  // Close context menu on outside click or escape
  useEffect(() => {
    const handleCloseContext = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener('click', handleCloseContext);
    return () => window.removeEventListener('click', handleCloseContext);
  }, []);

  // Context Menu handler (Easter Egg 7)
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;

    // Detect target element under click
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const nodeEl = elem ? elem.closest('[data-fig-node], .df-canvas-frame, .editorial-project-card') : null;
    const targetId = nodeEl ? (nodeEl.id || selectedId) : selectedId;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetId
    });

    if (onRecordEasterEgg) {
      onRecordEasterEgg(7); // Easter Egg 7: Context Menu
    }
  };

  // Canvas Pointer Down: Pan, Comment drop, Create Tool, or Selection
  const handlePointerDown = (e) => {
    // If context menu is open, close it
    if (contextMenu.visible) {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }

    // Space held or middle click: Canvas Pan
    if (isSpaceHeld() || e.button === 1 || activeTool === 'hand') {
      onTransformPointerDown(e);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = Math.round((e.clientX - rect.left - transform.x) / transform.scale);
    const canvasY = Math.round((e.clientY - rect.top - transform.y) / transform.scale);

    // Comment Tool (C)
    if (activeTool === 'comment') {
      setCommentDraft({
        x: canvasX,
        y: canvasY,
        text: ''
      });
      return;
    }

    // Creation Tools in View-Only mode -> Blocked Action!
    if (!isEditMode && (activeTool === 'frame' || activeTool === 'shape' || activeTool === 'text')) {
      if (onBlockedAction) onBlockedAction();
      return;
    }

    // Creation Tools in Edit Mode
    if (isEditMode) {
      if (activeTool === 'frame' || activeTool === 'shape') {
        setDrawingShape({
          type: activeTool === 'frame' ? 'frame' : 'rect',
          startX: canvasX,
          startY: canvasY,
          currentX: canvasX,
          currentY: canvasY
        });
        return;
      }

      if (activeTool === 'text') {
        if (onAddCreatedElement) {
          const newId = `custom-text-${Date.now()}`;
          onAddCreatedElement({
            id: newId,
            type: 'text',
            x: canvasX,
            y: canvasY,
            w: 160,
            h: 36,
            text: 'Type text here'
          });
          if (onSelectId) onSelectId(newId);
        }
        return;
      }
    }

    // Check if clicked element is a selectable node (data-fig-node)
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const nodeEl = elem ? elem.closest('[data-fig-node], .df-canvas-frame, .editorial-project-card') : null;

    if (nodeEl) {
      const id = nodeEl.id || nodeEl.getAttribute('data-id') || 'frame-selected';
      if (onSelectId) onSelectId(id);

      // Measure immediately
      if (onMeasure) {
        onMeasure(id, {
          w: Math.round(nodeEl.offsetWidth),
          h: Math.round(nodeEl.offsetHeight),
          x: Math.round(nodeEl.offsetLeft),
          y: Math.round(nodeEl.offsetTop)
        });
      }

      // Drag to Move in Edit Mode
      if (isEditMode) {
        const currentStyle = nodeStyles[id] || {};
        setDraggingNode({
          id,
          startX: e.clientX,
          startY: e.clientY,
          origX: currentStyle.x || 0,
          origY: currentStyle.y || 0
        });
      } else {
        // In view-only mode, pointer move check will trigger blocked action if user drags
      }
    } else {
      // Background click
      if (onDeselect) onDeselect();
    }
  };

  const handlePointerMove = (e) => {
    onTransformPointerMove(e);
    handleMouseMove(e);

    // Update Drawing Shape
    if (drawingShape && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = Math.round((e.clientX - rect.left - transform.x) / transform.scale);
      const canvasY = Math.round((e.clientY - rect.top - transform.y) / transform.scale);
      setDrawingShape((prev) => ({ ...prev, currentX: canvasX, currentY: canvasY }));
    }

    // Node Dragging in Edit Mode
    if (draggingNode) {
      const dx = (e.clientX - draggingNode.startX) / transform.scale;
      const dy = (e.clientY - draggingNode.startY) / transform.scale;
      if (onUpdateStyle) {
        onUpdateStyle(draggingNode.id, {
          x: Math.round(draggingNode.origX + dx),
          y: Math.round(draggingNode.origY + dy)
        });
      }
    }
  };

  const handlePointerUp = (e) => {
    onTransformPointerUp(e);

    // Finalize drawing shape in Edit Mode
    if (drawingShape) {
      const minX = Math.min(drawingShape.startX, drawingShape.currentX);
      const minY = Math.min(drawingShape.startY, drawingShape.currentY);
      const w = Math.max(20, Math.abs(drawingShape.currentX - drawingShape.startX));
      const h = Math.max(20, Math.abs(drawingShape.currentY - drawingShape.startY));

      if (onAddCreatedElement) {
        const newId = `custom-${drawingShape.type}-${Date.now()}`;
        onAddCreatedElement({
          id: newId,
          type: drawingShape.type,
          x: minX,
          y: minY,
          w,
          h,
          name: drawingShape.type === 'frame' ? 'Custom Frame' : 'Rectangle'
        });
        if (onSelectId) onSelectId(newId);
      }
      setDrawingShape(null);
    }

    if (draggingNode) {
      setDraggingNode(null);
    }
  };

  // Submit Comment Draft
  const handlePostComment = () => {
    if (!commentDraft || !commentDraft.text.trim()) {
      setCommentDraft(null);
      return;
    }

    const newCommentId = `comment-${Date.now()}`;
    const commentObj = {
      id: newCommentId,
      x: commentDraft.x,
      y: commentDraft.y,
      text: commentDraft.text.trim(),
      reply: null,
      timestamp: Date.now()
    };

    if (onAddComment) onAddComment(commentObj);
    setCommentDraft(null);

    // 1 second after posting, Naveen replies with next note in rotation (Easter Egg 1)
    setTimeout(() => {
      const nextNote = COMMENT_NOTES[commentRotationIndex % COMMENT_NOTES.length];
      setCommentRotationIndex((prev) => prev + 1);

      if (onAddComment) {
        onAddComment({
          ...commentObj,
          reply: nextNote
        });
      }

      if (onRecordEasterEgg) {
        onRecordEasterEgg(1); // Easter Egg 1: Naveen's reply
      }
    }, 1000);
  };

  /* ── Rulers in Screen Pixels matching zoom & pan ── */
  const renderHorizontalRuler = () => {
    if (!viewportSize.w) return null;
    const ticks = [];
    const minC = Math.floor((-transform.x) / transform.scale / 100) * 100 - 100;
    const maxC = Math.ceil((viewportSize.w - transform.x) / transform.scale / 100) * 100 + 100;

    for (let c = minC; c <= maxC; c += 50) {
      const screenX = Math.round(transform.x + c * transform.scale);
      if (screenX < 0 || screenX > viewportSize.w) continue;
      const isMajor = c % 100 === 0;

      ticks.push(
        <div
          key={`h-${c}`}
          className={`df-ruler-tick h ${isMajor ? 'major' : ''}`}
          style={{ left: `${screenX}px` }}
        >
          {isMajor && (
            <span
              className="df-ruler-num font-mono"
              style={{
                position: 'absolute',
                top: '2px',
                left: '3px',
                fontSize: '10px',
                lineHeight: 1,
                color: '#6B6B6B',
                userSelect: 'none'
              }}
            >
              {c}
            </span>
          )}
        </div>
      );
    }
    return ticks;
  };

  const renderVerticalRuler = () => {
    if (!viewportSize.h) return null;
    const ticks = [];
    const minC = Math.floor((-transform.y) / transform.scale / 100) * 100 - 100;
    const maxC = Math.ceil((viewportSize.h - transform.y) / transform.scale / 100) * 100 + 100;

    for (let c = minC; c <= maxC; c += 50) {
      const screenY = Math.round(transform.y + c * transform.scale);
      if (screenY < 0 || screenY > viewportSize.h) continue;
      const isMajor = c % 100 === 0;

      ticks.push(
        <div
          key={`v-${c}`}
          className={`df-ruler-tick v ${isMajor ? 'major' : ''}`}
          style={{ top: `${screenY}px` }}
        >
          {isMajor && (
            <span
              className="df-ruler-num font-mono"
              style={{
                position: 'absolute',
                left: '2px',
                top: '2px',
                fontSize: '10px',
                lineHeight: 1,
                color: '#6B6B6B',
                transform: 'rotate(-90deg)',
                transformOrigin: 'left top',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {c}
            </span>
          )}
        </div>
      );
    }
    return ticks;
  };

  return (
    <main
      className={`df-canvas-area ${isOutlineMode ? 'df-outline-mode' : ''}`}
      style={{ background: canvasBg }}
      aria-label="Figma Infinite Canvas"
      onContextMenu={handleContextMenu}
    >
      {/* 20px Rulers with #F5F5F5 light background and 10px #6B6B6B numbers */}
      <div className="df-ruler-corner" aria-hidden="true" />
      <div className="df-ruler df-ruler-top" aria-hidden="true">
        <div className="df-ruler-track">
          {renderHorizontalRuler()}
        </div>
      </div>
      <div className="df-ruler df-ruler-left" aria-hidden="true">
        <div className="df-ruler-track">
          {renderVerticalRuler()}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        className={`df-canvas-viewport ${isSpaceHeld() ? 'panning' : ''}`}
        style={{ background: canvasBg }}
        onWheel={(e) => {
          if (containerRef.current) {
            onWheel(e, containerRef.current.getBoundingClientRect());
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
      >
        <div
          className="df-canvas-transform"
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Vertical frames column */}
          <div
            className="df-frames-column"
            style={{
              width: frames[0]?.w || 1024,
              display: 'flex',
              flexDirection: 'column',
              gap: 80,
              paddingTop: 32,
              paddingBottom: 160
            }}
          >
            {frames.map((frame) => {
              if (deletedNodeIds.includes(frame.id)) return null;

              const isFrameSelected = selectedId === frame.id;
              const isFrameEntered = enteredId === frame.id;
              const frameStyle = nodeStyles[frame.id] || {};

              return (
                <div
                  key={frame.id}
                  style={{
                    transform: frameStyle.x || frameStyle.y ? `translate(${frameStyle.x || 0}px, ${frameStyle.y || 0}px)` : undefined,
                    opacity: frameStyle.opacity !== undefined ? frameStyle.opacity : undefined
                  }}
                >
                  <CanvasFrame
                    frame={frame}
                    isSelected={isFrameSelected}
                    isEntered={isFrameEntered}
                    selectedChildId={selectedId}
                    selectedMeasure={selectedMeasure}
                    hoveredId={hoveredId}
                    onSelect={(id) => onSelectId && onSelectId(id)}
                    onEnter={(id) => onEnter && onEnter(id)}
                    onMeasure={(id, measure) => onMeasure && onMeasure(id, measure)}
                    isAltHeld={isAltHeld}
                    isShiftAActive={isShiftAActive}
                    onTriggerLockedDrag={onBlockedAction}
                    hasSeenInteractionHint={hasSeenInteractionHint}
                    copiedEmail={copiedEmail}
                    onCopyEmail={onCopyEmail}
                    onNavigatePage={onNavigatePage}
                  />
                </div>
              );
            })}

            {/* Custom Created Elements in Edit Mode */}
            {createdElements.map((elem) => {
              const isElemSelected = selectedId === elem.id;
              const elemStyle = nodeStyles[elem.id] || {};
              const curX = elemStyle.x !== undefined ? elemStyle.x : elem.x;
              const curY = elemStyle.y !== undefined ? elemStyle.y : elem.y;
              const curW = elemStyle.width !== undefined ? elemStyle.width : elem.w;
              const curH = elemStyle.height !== undefined ? elemStyle.height : elem.h;

              return (
                <div
                  key={elem.id}
                  id={elem.id}
                  data-fig-node={elem.type}
                  className={`df-created-element ${isElemSelected ? 'df-selected' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${curX}px`,
                    top: `${curY}px`,
                    width: `${curW}px`,
                    height: `${curH}px`,
                    background: elemStyle.backgroundColor || (elem.type === 'frame' ? '#FFFFFF' : elem.type === 'rect' ? '#E6E6E6' : 'transparent'),
                    border: elemStyle.border || (elem.type === 'frame' ? '1px solid #E6E6E6' : 'none'),
                    boxShadow: elem.type === 'frame' ? '0 4px 16px rgba(0,0,0,0.1)' : 'none',
                    borderRadius: `${elemStyle.borderRadius || 0}px`,
                    padding: elem.type === 'text' ? '4px' : '0',
                    fontSize: elem.type === 'text' ? `${elemStyle.fontSize || 14}px` : undefined,
                    color: elem.type === 'text' ? (elemStyle.color || '#1E1E1E') : undefined,
                    cursor: 'default',
                    outline: isElemSelected ? '1px solid #0D99FF' : 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectId) onSelectId(elem.id);
                  }}
                >
                  {elem.type === 'text' ? (elem.text || 'Text') : null}
                  {isElemSelected && (
                    <div className="df-dim-pill font-mono">
                      {curW} × {curH}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Drawing Preview in Edit Mode */}
            {drawingShape && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(drawingShape.startX, drawingShape.currentX)}px`,
                  top: `${Math.min(drawingShape.startY, drawingShape.currentY)}px`,
                  width: `${Math.abs(drawingShape.currentX - drawingShape.startX)}px`,
                  height: `${Math.abs(drawingShape.currentY - drawingShape.startY)}px`,
                  border: '1px dashed #0D99FF',
                  background: 'rgba(13, 153, 255, 0.1)',
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Dropped Comment Pins */}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="df-comment-bubble-pin"
                style={{
                  position: 'absolute',
                  left: `${comment.x}px`,
                  top: `${comment.y}px`,
                  zIndex: 300
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="df-comment-pin-head">
                  <span className="df-comment-dot">●</span>
                  <span className="df-comment-author">Visitor</span>
                </div>
                <div className="df-comment-bubble-body">
                  {comment.text}
                </div>
                {comment.reply && (
                  <div className="df-thread-reply" style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #F0F0F0' }}>
                    <div className="df-reply-avatar">N</div>
                    <div style={{ flex: 1, fontSize: '11px', color: '#1E1E1E' }}>
                      <strong>Naveen:</strong> {comment.reply}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Comment Draft Popover */}
            {commentDraft && (
              <div
                className="df-comment-card-popover"
                style={{
                  position: 'absolute',
                  left: `${commentDraft.x}px`,
                  top: `${commentDraft.y}px`,
                  background: '#FFFFFF',
                  border: '1px solid #E6E6E6',
                  borderRadius: '8px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
                  padding: '10px',
                  width: '240px',
                  zIndex: 350
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <textarea
                  className="df-prop-input"
                  style={{ width: '100%', height: '56px', textAlign: 'left', marginBottom: '8px', resize: 'none' }}
                  placeholder="Add a comment... (Enter to post)"
                  value={commentDraft.text}
                  onChange={(e) => setCommentDraft((prev) => ({ ...prev, text: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePostComment();
                    } else if (e.key === 'Escape') {
                      setCommentDraft(null);
                    }
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '11px', cursor: 'pointer' }}
                    onClick={() => setCommentDraft(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="df-banner-ask-btn"
                    style={{ height: '24px', padding: '0 10px', fontSize: '11px' }}
                    onClick={handlePostComment}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Presence Cursor with Figma multiplayer arrow & badge (Offset 14px) */}
        {presenceCursor.visible && (
          <div
            className="df-presence-cursor"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              transform: `translate3d(${presenceCursor.x}px, ${presenceCursor.y}px, 0)`,
              zIndex: 500,
              transition: 'transform 0.04s ease-out'
            }}
            aria-hidden="true"
          >
            {/* Real Figma Multiplayer Cursor Pointer */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ position: 'absolute', top: 0, left: 0, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            >
              <path
                d="M1 1L5.5 13L7.8 7.8L13 5.5L1 1Z"
                fill="#0D99FF"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="df-presence-cursor-label"
              style={{
                marginLeft: '12px',
                marginTop: '12px'
              }}
            >
              <span>Naveen inspecting {presenceCursor.sectionName}...</span>
            </div>
          </div>
        )}
      </div>

      {/* Context Menu (Easter Egg 7) */}
      {contextMenu.visible && (
        <div
          className="df-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="df-menu-item"
            role="menuitem"
            onClick={() => {
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
          >
            <span>Copy</span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#888' }}>⌘C</span>
          </button>

          <button
            type="button"
            className="df-menu-item"
            role="menuitem"
            onClick={() => {
              setContextMenu((prev) => ({ ...prev, visible: false }));
              // Copy computed CSS
            }}
          >
            <span>Copy as CSS</span>
          </button>

          <button
            type="button"
            className="df-menu-item"
            role="menuitem"
            onClick={() => {
              setContextMenu((prev) => ({ ...prev, visible: false }));
              if (onRecordEasterEgg) onRecordEasterEgg(10);
            }}
          >
            <span>Inspect</span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#888' }}>⇧D</span>
          </button>

          {isEditMode && (
            <>
              <div className="df-menu-divider" />
              <button
                type="button"
                className="df-menu-item"
                role="menuitem"
                onClick={() => {
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                  if (onDuplicateElement && selectedId) onDuplicateElement(selectedId);
                }}
              >
                <span>Duplicate</span>
                <span className="font-mono" style={{ fontSize: '10px', color: '#888' }}>⌘D</span>
              </button>

              <button
                type="button"
                className="df-menu-item"
                role="menuitem"
                onClick={() => {
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                  if (onDeleteElement && selectedId) onDeleteElement(selectedId);
                }}
              >
                <span>Delete</span>
                <span className="font-mono" style={{ fontSize: '10px', color: '#888' }}>Del</span>
              </button>
            </>
          )}

          <div className="df-menu-divider" />

          {/* Last item: "Hire this designer" -> opens Contact page and selects its first frame */}
          <button
            type="button"
            className="df-menu-item"
            role="menuitem"
            style={{ color: '#0A78CC', fontWeight: 600 }}
            onClick={() => {
              setContextMenu((prev) => ({ ...prev, visible: false }));
              if (onNavigatePage) {
                onNavigatePage('contact');
                if (onSelectId) onSelectId('frame-contact-hero');
              }
            }}
          >
            <span>Hire this designer</span>
            <span>→</span>
          </button>
        </div>
      )}
    </main>
  );
}
