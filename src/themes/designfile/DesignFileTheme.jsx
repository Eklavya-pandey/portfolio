import React, { useState, useEffect, useCallback, useRef } from 'react';
import './designfile.css';
import '../editorial/editorial.css';

import LeftIconRail from './components/LeftIconRail';
import LeftSidebar from './components/LeftSidebar';
import RightInspector from './components/RightInspector';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import CanvasFrame from './components/CanvasFrame';
import MobileBottomSheet from './components/MobileBottomSheet';
import CommandPalette from './components/CommandPalette';

import useCanvasTransform from './hooks/useCanvasTransform';
import useSelection from './hooks/useSelection';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { getCurrentPage } from '../editorial/editorialRouter';
import {
  PAGE_FRAMES,
  recordEasterEgg,
  getDiscoveredEasterEggs
} from './designfileData';

export default function DesignFileTheme() {
  const { setTheme } = useTheme();

  // Mode: View-Only (default) or Edit Mode
  const [isEditMode, setIsEditMode] = useState(() => {
    try {
      return sessionStorage.getItem('fig_edit') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTool, setActiveTool] = useState('select');
  const [activePage, setActivePage] = useState(() => getCurrentPage());
  const [activeLeftView, setActiveLeftView] = useState('file'); // 'file' | 'assets' | 'variables'
  const [isDevMode, setIsDevMode] = useState(false);
  const [isOutlineMode, setIsOutlineMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isPanelsHidden, setIsPanelsHidden] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  // Easter Egg States
  const [isShiftAActive, setIsShiftAActive] = useState(false);
  const [isAltHeld, setIsAltHeld] = useState(false);
  const [isLogoScaled, setIsLogoScaled] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const [toastWithLink, setToastWithLink] = useState(false);

  // Ask to edit multi-step animation state
  const [askToEditStatus, setAskToEditStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [isReloadingOverlay, setIsReloadingOverlay] = useState(false);

  // Right panel tabs: 'comments' | 'properties' | 'design' | 'prototype' | 'inspect'
  const [rightTab, setRightTab] = useState(() => (isEditMode ? 'design' : 'comments'));
  const [commentFilter, setCommentFilter] = useState('');
  const [comments, setComments] = useState([]);

  // Sandbox in-memory overrides & undo/redo history (100 steps)
  const [nodeStyles, setNodeStyles] = useState({});
  const [createdElements, setCreatedElements] = useState([]);
  const [deletedNodeIds, setDeletedNodeIds] = useState([]);
  const [customLayerNames, setCustomLayerNames] = useState({});
  const [hiddenLayerIds, setHiddenLayerIds] = useState([]);
  const [lockedLayerIds, setLockedLayerIds] = useState([]);
  const [canvasBg, setCanvasBg] = useState('#2C2C2C');
  const [hasShownSandboxToast, setHasShownSandboxToast] = useState(false);

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  // Responsive / Mobile
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const isMobile = windowWidth <= 900;

  // Reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const transformHook = useCanvasTransform();
  const selectionHook = useSelection();
  const selectedId = selectionHook.selectedIds[0] || null;
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [enteredId, setEnteredId] = useState(null);
  const [hoveredLayerId, setHoveredLayerId] = useState(null);

  // Window resize tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update right inspector tab when switching modes
  useEffect(() => {
    if (isDevMode) {
      setRightTab('inspect');
    } else if (isEditMode) {
      setRightTab((prev) => (prev === 'properties' || prev === 'comments' ? 'design' : prev));
    } else {
      setRightTab((prev) => (prev === 'design' || prev === 'prototype' ? 'comments' : prev));
    }
  }, [isEditMode, isDevMode]);

  // Toast dispatcher
  const showToast = useCallback((msg, duration = 2500, withLink = false) => {
    setToastMessage(msg);
    setToastWithLink(withLink);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, duration);
  }, []);

  // Record an edit into in-memory undo stack (up to 100 steps)
  const pushUndoState = useCallback((nextState) => {
    if (!hasShownSandboxToast) {
      showToast('Sandbox: edits live in this tab only.');
      setHasShownSandboxToast(true);
    }
    const snapshot = {
      nodeStyles,
      createdElements,
      deletedNodeIds,
      customLayerNames,
      canvasBg
    };
    undoStackRef.current = [...undoStackRef.current.slice(-99), snapshot];
    redoStackRef.current = [];
  }, [hasShownSandboxToast, showToast, nodeStyles, createdElements, deletedNodeIds, customLayerNames, canvasBg]);

  // Update element style live
  const handleUpdateStyle = useCallback((id, styles) => {
    pushUndoState();
    setNodeStyles((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...styles
      }
    }));
  }, [pushUndoState]);

  // Add created shape/frame/text
  const handleAddCreatedElement = useCallback((elem) => {
    pushUndoState();
    setCreatedElements((prev) => [...prev, elem]);
  }, [pushUndoState]);

  // Delete element
  const handleDeleteElement = useCallback((id) => {
    if (!id) return;
    pushUndoState();
    setDeletedNodeIds((prev) => [...prev, id]);
    selectionHook.deselect();
    setSelectedMeasure(null);
  }, [pushUndoState, selectionHook]);

  // Duplicate element
  const handleDuplicateElement = useCallback((id) => {
    if (!id) return;
    pushUndoState();
    const existingCreated = createdElements.find((e) => e.id === id);
    if (existingCreated) {
      const copyId = `copy-${Date.now()}`;
      const copyElem = {
        ...existingCreated,
        id: copyId,
        x: (existingCreated.x || 0) + 20,
        y: (existingCreated.y || 0) + 20
      };
      setCreatedElements((prev) => [...prev, copyElem]);
      selectionHook.select(copyId);
    } else {
      showToast('Duplicated layer (offset 20px)');
    }
  }, [pushUndoState, createdElements, selectionHook, showToast]);

  // Rename layer
  const handleRenameLayer = useCallback((layerId, newName) => {
    pushUndoState();
    setCustomLayerNames((prev) => ({
      ...prev,
      [layerId]: newName
    }));
  }, [pushUndoState]);

  // Hide/Show layer
  const handleToggleHideLayer = useCallback((layerId) => {
    setHiddenLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  }, []);

  // Lock/Unlock layer
  const handleToggleLockLayer = useCallback((layerId) => {
    setLockedLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  }, []);

  // Restore Original: clears all edits and history
  const handleRestoreOriginal = useCallback(() => {
    setNodeStyles({});
    setCreatedElements([]);
    setDeletedNodeIds([]);
    setCustomLayerNames({});
    setHiddenLayerIds([]);
    setLockedLayerIds([]);
    setCanvasBg('#2C2C2C');
    undoStackRef.current = [];
    redoStackRef.current = [];
    showToast('Restored original portfolio file');
  }, [showToast]);

  // Switch to Default Theme (Editorial)
  const handleSwitchToDefault = useCallback(() => {
    try {
      sessionStorage.setItem('naveen_portfolio_theme', 'editorial');
      localStorage.setItem('naveen_portfolio_theme', 'editorial');
    } catch {}
    setTheme(THEMES.EDITORIAL);
  }, [setTheme]);

  // Share Action: copies https://naveen.design to clipboard with toast
  const handleShare = useCallback(() => {
    const url = 'https://naveen.design';
    try {
      navigator.clipboard.writeText(url);
      showToast('Link copied. Anyone can view.');
    } catch {
      showToast(`Link: ${url}`);
    }
  }, [showToast]);

  // Blocked Action toast in View-Only mode
  const handleBlockedAction = useCallback(() => {
    if (!isEditMode) {
      showToast('You can only view and comment on this file. Ask to edit', 2500, true);
    }
  }, [isEditMode, showToast]);

  // Ask to Edit Flow (Part 3)
  const handleStartAskToEdit = useCallback(() => {
    if (isEditMode || isMobile) return;

    // 1. Button shows small spinner and "Sending request..." for 0.8s
    setAskToEditStatus('sending');

    setTimeout(() => {
      // 1b. "Request sent to Naveen" for 1s
      setAskToEditStatus('sent');

      setTimeout(() => {
        // 2. Toast with N avatar: "Naveen granted you edit access." for 1.5s
        showToast('Naveen granted you edit access.', 1500);

        setTimeout(() => {
          // 3. Full-screen overlay (white, centered logo with spinner, "Reloading file...") for 1s
          setIsReloadingOverlay(true);

          setTimeout(() => {
            // 4. Edit mode activated!
            setIsReloadingOverlay(false);
            setIsEditMode(true);
            setAskToEditStatus('idle');
            try {
              sessionStorage.setItem('fig_edit', 'true');
            } catch {}
          }, prefersReducedMotion ? 200 : 1000);
        }, 1500);
      }, 1000);
    }, 800);
  }, [isEditMode, isMobile, showToast, prefersReducedMotion]);

  // Comment adding & reply
  const handleAddComment = useCallback((newComment) => {
    setComments((prev) => {
      const idx = prev.findIndex((c) => c.id === newComment.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newComment;
        return next;
      }
      return [newComment, ...prev];
    });
  }, []);

  // Alt key tracking (Easter Egg 3)
  useEffect(() => {
    if (isMobile) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Alt') {
        setIsAltHeld(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {
        setIsAltHeld(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMobile]);

  // Keyboard Shortcuts (Undo, Redo, Save, Tools, Shift+A, Shift+D, Cmd+Shift+Y, Cmd+0, Cmd+\, Cmd+K)
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      const isInput =
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable ||
        e.target.closest?.('.editorial-typing-input, .editorial-specimen-input');

      if (isInput) return;

      // Easter Egg 5: Cmd/Ctrl+S -> "Nothing to save. This is a sandbox."
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        showToast('Nothing to save. This is a sandbox.');
        recordEasterEgg(5);
        return;
      }

      // Undo: Cmd/Ctrl+Z (or Redo: Cmd/Ctrl+Shift+Z)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          if (redoStackRef.current.length > 0) {
            const next = redoStackRef.current.pop();
            undoStackRef.current.push({
              nodeStyles,
              createdElements,
              deletedNodeIds,
              customLayerNames,
              canvasBg
            });
            setNodeStyles(next.nodeStyles || {});
            setCreatedElements(next.createdElements || []);
            setDeletedNodeIds(next.deletedNodeIds || []);
            setCustomLayerNames(next.customLayerNames || {});
            if (next.canvasBg) setCanvasBg(next.canvasBg);
          }
          return;
        }

        // Undo
        if (undoStackRef.current.length > 0) {
          const prev = undoStackRef.current.pop();
          redoStackRef.current.push({
            nodeStyles,
            createdElements,
            deletedNodeIds,
            customLayerNames,
            canvasBg
          });
          setNodeStyles(prev.nodeStyles || {});
          setCreatedElements(prev.createdElements || []);
          setDeletedNodeIds(prev.deletedNodeIds || []);
          setCustomLayerNames(prev.customLayerNames || {});
          if (prev.canvasBg) setCanvasBg(prev.canvasBg);
        } else {
          // Easter Egg 4: When undo history is empty, one more Cmd+Z switches back to default theme
          showToast('Undo: back to default', 1500);
          recordEasterEgg(4);
          setTimeout(() => {
            handleSwitchToDefault();
          }, 1500);
        }
        return;
      }

      // Easter Egg 8: Cmd/Ctrl+Shift+Y -> Outline view
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'Y' || e.key === 'y')) {
        e.preventDefault();
        setIsOutlineMode((prev) => {
          const next = !prev;
          showToast(next ? 'Outline view on' : 'Outline view off');
          recordEasterEgg(8);
          return next;
        });
        return;
      }

      // Dev Mode Toggle: Shift+D (Easter Egg 10)
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsDevMode((prev) => {
          const next = !prev;
          if (next) recordEasterEgg(10);
          return next;
        });
        return;
      }

      // Easter Egg 2: Shift+A (reflow or auto-layout)
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (!selectedId) {
          setIsShiftAActive(true);
          recordEasterEgg(2);
          setTimeout(() => setIsShiftAActive(false), 1500);
        } else if (isEditMode) {
          // Real auto layout applied on selection
          handleUpdateStyle(selectedId, {
            display: 'flex',
            flexDirection: 'row',
            gap: 16
          });
          showToast('Auto layout applied (row, 16px gap)');
        }
        return;
      }

      // Cmd+0: Fit canvas
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        const availW = isPanelsHidden ? window.innerWidth : window.innerWidth - 500;
        transformHook.fitToWidth(availW, window.innerHeight);
        showToast('Canvas fitted to screen');
        return;
      }

      // Cmd+\: Toggle panels
      if ((e.metaKey || e.ctrlKey) && (e.key === '\\' || e.code === 'Backslash')) {
        e.preventDefault();
        setIsPanelsHidden((prev) => {
          const next = !prev;
          setTimeout(() => {
            const availW = next ? window.innerWidth : window.innerWidth - 500;
            transformHook.fitToWidth(availW, window.innerHeight);
          }, 80);
          return next;
        });
        return;
      }

      // Cmd+K: Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Cmd/Ctrl+D: Duplicate in edit mode
      if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D') && !e.shiftKey) {
        if (isEditMode && selectedId) {
          e.preventDefault();
          handleDuplicateElement(selectedId);
          return;
        }
      }

      // Delete / Backspace: Remove in edit mode
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (isEditMode && selectedId) {
          e.preventDefault();
          handleDeleteElement(selectedId);
          return;
        }
      }

      // Arrow keys: Nudge in edit mode
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (isEditMode && selectedId) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const curStyle = nodeStyles[selectedId] || {};
          let curX = curStyle.x || 0;
          let curY = curStyle.y || 0;
          if (e.key === 'ArrowUp') curY -= step;
          if (e.key === 'ArrowDown') curY += step;
          if (e.key === 'ArrowLeft') curX -= step;
          if (e.key === 'ArrowRight') curX += step;
          handleUpdateStyle(selectedId, { x: curX, y: curY });
          return;
        }
      }

      // Escape key: exit entered state or deselect
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        else if (enteredId) setEnteredId(null);
        else {
          selectionHook.deselect();
          setSelectedMeasure(null);
        }
        return;
      }

      // Single-key tool switches
      const k = e.key.toLowerCase();
      if (k === 'v') setActiveTool('select');
      else if (k === 'h') setActiveTool('hand');
      else if (k === 'c') setActiveTool('comment');
      else if (k === 'f') {
        if (!isEditMode) handleBlockedAction();
        else setActiveTool('frame');
      } else if (k === 'r') {
        if (!isEditMode) handleBlockedAction();
        else setActiveTool('shape');
      } else if (k === 't') {
        if (!isEditMode) handleBlockedAction();
        else setActiveTool('text');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isMobile,
    isEditMode,
    isPanelsHidden,
    isCommandPaletteOpen,
    enteredId,
    selectedId,
    nodeStyles,
    createdElements,
    deletedNodeIds,
    customLayerNames,
    canvasBg,
    showToast,
    handleSwitchToDefault,
    handleUpdateStyle,
    handleDeleteElement,
    handleDuplicateElement,
    handleBlockedAction,
    transformHook,
    selectionHook
  ]);

  // Page navigation
  const handlePageChange = useCallback((pageId) => {
    setActivePage(pageId);
    try {
      const pagePath = pageId === 'home' ? '/index.html' : `/${pageId}.html`;
      window.history.replaceState(null, '', pagePath);
      window.dispatchEvent(new Event('editorial_navigate'));
    } catch {}
    selectionHook.deselect();
    setSelectedMeasure(null);
    setEnteredId(null);
  }, [selectionHook]);

  // Layer selection from sidebar
  const handleSelectLayer = useCallback((layerId) => {
    selectionHook.select(layerId);
    setTimeout(() => {
      const el = document.getElementById(layerId);
      if (el) {
        setSelectedMeasure({
          w: Math.round(el.offsetWidth),
          h: Math.round(el.offsetHeight),
          x: Math.round(el.offsetLeft),
          y: Math.round(el.offsetTop)
        });
      }
    }, 20);
  }, [selectionHook]);

  // Scale Logo (Easter Egg 6)
  const handleScaleLogo = useCallback(() => {
    setIsLogoScaled(true);
    setTimeout(() => setIsLogoScaled(false), 2000);
  }, []);

  const currentFrames = PAGE_FRAMES[activePage] || PAGE_FRAMES.home;

  return (
    <div className={`df-root ${isPanelsHidden ? 'df-panels-hidden' : ''}`}>
      {/* 1. Desktop Mode (>= 901px): Left Rail, Left Panel, Canvas, Right Inspector, Floating Toolbar */}
      {!isMobile ? (
        <>
          {/* Left Icon Rail (64px, White) */}
          <LeftIconRail
            activeView={activeLeftView}
            onViewChange={(v) => {
              setActiveLeftView(v);
              if (isLeftCollapsed) setIsLeftCollapsed(false);
            }}
            isEditMode={isEditMode}
            isLogoScaled={isLogoScaled}
            onLogoClick={handleScaleLogo}
          />

          {/* Left Panel (240px, White) */}
          <LeftSidebar
            activePage={activePage}
            onPageChange={handlePageChange}
            selectedId={selectedId}
            onSelectLayer={handleSelectLayer}
            onHoverLayer={setHoveredLayerId}
            isEditMode={isEditMode}
            activeView={activeLeftView}
            onViewChange={setActiveLeftView}
            onRestoreOriginal={handleRestoreOriginal}
            onSwitchDefaultTheme={handleSwitchToDefault}
            hiddenLayerIds={hiddenLayerIds}
            onToggleHideLayer={handleToggleHideLayer}
            lockedLayerIds={lockedLayerIds}
            onToggleLockLayer={handleToggleLockLayer}
            customLayerNames={customLayerNames}
            onRenameLayer={handleRenameLayer}
            onRecordEasterEgg={recordEasterEgg}
            isCollapsed={isLeftCollapsed}
            onToggleCollapse={() => setIsLeftCollapsed((prev) => !prev)}
          />

          {/* Canvas Area: Dark #2C2C2C, Rulers, Frames & Created Elements */}
          <Canvas
            activePage={activePage}
            activeTool={activeTool}
            transformHook={transformHook}
            selectedId={selectedId}
            selectedMeasure={selectedMeasure}
            enteredId={enteredId}
            hoveredId={hoveredLayerId}
            onSelectId={(id) => selectionHook.select(id)}
            onEnter={(id) => setEnteredId(id)}
            onDeselect={() => {
              selectionHook.deselect();
              setSelectedMeasure(null);
              setEnteredId(null);
            }}
            onMeasure={(id, m) => setSelectedMeasure(m)}
            isAltHeld={isAltHeld}
            isShiftAActive={isShiftAActive}
            isEditMode={isEditMode}
            isDevMode={isDevMode}
            isOutlineMode={isOutlineMode}
            canvasBg={canvasBg}
            onBlockedAction={handleBlockedAction}
            onAskToEdit={handleStartAskToEdit}
            onNavigatePage={handlePageChange}
            comments={comments}
            onAddComment={handleAddComment}
            onRecordEasterEgg={recordEasterEgg}
            nodeStyles={nodeStyles}
            onUpdateStyle={handleUpdateStyle}
            createdElements={createdElements}
            onAddCreatedElement={handleAddCreatedElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            deletedNodeIds={deletedNodeIds}
          />

          {/* Right Inspector Panel (260px, White) */}
          <RightInspector
            selectedId={selectedId}
            selectedMeasure={selectedMeasure}
            activePage={activePage}
            isEditMode={isEditMode}
            isDevMode={isDevMode}
            zoom={transformHook.transform.scale}
            onZoomChange={(newScale) => transformHook.setTransform((prev) => ({ ...prev, scale: newScale }))}
            onFitCanvas={() => {
              const availW = isPanelsHidden ? window.innerWidth : window.innerWidth - 500;
              transformHook.fitToWidth(availW, window.innerHeight);
            }}
            onSwitchDefaultTheme={handleSwitchToDefault}
            onShareFile={handleShare}
            activeTab={rightTab}
            onTabChange={setRightTab}
            comments={comments}
            commentFilter={commentFilter}
            onCommentFilterChange={setCommentFilter}
            canvasBg={canvasBg}
            onCanvasBgChange={setCanvasBg}
            nodeStyles={nodeStyles}
            onUpdateStyle={handleUpdateStyle}
            onShowToast={showToast}
          />

          {/* Floating Bottom Toolbar & Banner (UI3) */}
          <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            isEditMode={isEditMode}
            isDevMode={isDevMode}
            onToggleDevMode={() => {
              setIsDevMode((prev) => {
                const next = !prev;
                if (next) recordEasterEgg(10);
                return next;
              });
            }}
            onOpenResources={() => {
              setActiveLeftView('assets');
              if (isLeftCollapsed) setIsLeftCollapsed(false);
            }}
            isBannerDismissed={isBannerDismissed}
            onDismissBanner={() => setIsBannerDismissed(true)}
            onAskToEdit={handleStartAskToEdit}
            askToEditStatus={askToEditStatus}
            onBlockedAction={handleBlockedAction}
            onPenClick={() => showToast('Prototype is not available in this file.')}
            isMobile={false}
          />
        </>
      ) : (
        /* 2. Mobile Mode (<= 900px, tested at 375px) */
        <>
          {/* Mobile Top Bar (48px) */}
          <header className="df-mobile-top-bar" role="banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div className="df-logo-square" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
                <svg viewBox="0 0 38 57" width="16" height="24" fill="none">
                  <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
                  <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
                  <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
                  <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
                  <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
                </svg>
              </div>
              <span className="df-file-title" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                NAVEEN_PORTFOLIO.fig
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a
                href="/assets/Naveen_Pandey_CV.pdf"
                download="Naveen_Pandey_CV.pdf"
                className="df-download-icon-btn df-mobile-only"
                aria-label="Download CV"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>

              <button
                type="button"
                className="df-default-theme-btn df-mobile-only"
                onClick={handleSwitchToDefault}
                aria-label="Switch to futuristic theme"
              >
                Futuristic
              </button>
            </div>
          </header>

          {/* View-Only Banner on Mobile */}
          {!isBannerDismissed && (
            <div
              className="df-floating-banner"
              style={{
                position: 'fixed',
                top: '56px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 200,
                width: 'calc(100% - 24px)',
                justifyContent: 'space-between'
              }}
              role="status"
            >
              <div className="df-banner-text" style={{ fontSize: '11px' }}>
                <span>Editing is available on desktop.</span>
              </div>
              <button
                type="button"
                className="df-banner-close-btn"
                onClick={() => setIsBannerDismissed(true)}
                aria-label="Close banner"
              >
                ✕
              </button>
            </div>
          )}

          {/* Single Column Mobile Flow */}
          <main className="df-mobile-viewport" style={{ paddingBottom: 'calc(50vh + 48px)' }}>
            <div className="editorial-theme df-mobile-flow">
              {currentFrames.map((frame) => (
                <CanvasFrame
                  key={frame.id}
                  frame={frame}
                  isSelected={selectedId === frame.id}
                  isEntered={false}
                  selectedChildId={selectedId}
                  selectedMeasure={selectedMeasure}
                  onSelect={(id) => {
                    selectionHook.select(id);
                    setTimeout(() => {
                      const el = document.getElementById(id);
                      if (el) {
                        setSelectedMeasure({
                          w: Math.round(el.offsetWidth),
                          h: Math.round(el.offsetHeight),
                          x: Math.round(el.offsetLeft),
                          y: Math.round(el.offsetTop)
                        });
                      }
                    }, 20);
                  }}
                  onEnter={() => {}}
                  onMeasure={(id, m) => setSelectedMeasure(m)}
                  isMobileLayout={true}
                  onNavigatePage={handlePageChange}
                />
              ))}
            </div>
          </main>

          {/* Mobile Bottom Sheet (48px collapsed, 50vh expanded) */}
          <MobileBottomSheet
            activePage={activePage}
            onPageChange={handlePageChange}
            selectedId={selectedId}
            selectedMeasure={selectedMeasure}
            onSelectLayer={handleSelectLayer}
            comments={comments}
            onSwitchDefaultTheme={handleSwitchToDefault}
          />
        </>
      )}

      {/* 3. Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTo={handlePageChange}
        onResetZoom={transformHook.zoomTo100}
        onFitCanvas={() => {
          const availW = isPanelsHidden ? window.innerWidth : window.innerWidth - 500;
          transformHook.fitToWidth(availW, window.innerHeight);
          showToast('Canvas fitted to screen');
        }}
        onShowToast={showToast}
        onScaleLogo={handleScaleLogo}
      />

      {/* 4. Full-Screen Simulated Reload Overlay (Ask to Edit Step 3) */}
      {isReloadingOverlay && (
        <div className="df-reload-overlay" role="status" aria-live="assertive">
          <div className="df-rail-logo" style={{ width: '48px', height: '48px' }}>
            <svg viewBox="0 0 38 57" width="36" height="54" fill="none">
              <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
              <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
              <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
              <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
              <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
            </svg>
          </div>
          {!prefersReducedMotion && <div className="df-reload-spinner" />}
          <div className="df-reload-text">Reloading file...</div>
        </div>
      )}

      {/* 5. Dark Toasts (#1E1E1E, white text, 8px radius) */}
      <div
        className={`df-toast ${toastMessage ? 'visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage && toastWithLink ? (
          <span>
            You can only view and comment on this file.{' '}
            <a
              className="df-toast-link"
              onClick={(e) => {
                e.preventDefault();
                handleStartAskToEdit();
              }}
            >
              Ask to edit
            </a>
          </span>
        ) : (
          <span>{toastMessage}</span>
        )}
      </div>
    </div>
  );
}
