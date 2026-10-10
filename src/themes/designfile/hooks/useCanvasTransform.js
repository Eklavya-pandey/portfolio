/**
 * useCanvasTransform — Pan/zoom state for the Figma-style infinite canvas.
 * Supports: wheel zoom, space+drag pan, trackpad pinch, Cmd+0 fit, Cmd+\ panel toggle.
 */
import { useState, useCallback, useRef, useEffect } from 'react';

const MIN_SCALE = 0.2;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.08;
const FRAME_WIDTH = 1024;

export default function useCanvasTransform() {
  // Initial default state (will be fitted on mount)
  const [transform, setTransform] = useState({ x: 48, y: 32, scale: 0.8 });
  const spaceHeld = useRef(false);
  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  /* ── Zoom toward a client point ── */
  const zoomAt = useCallback((clientX, clientY, delta, rect) => {
    setTransform(prev => {
      const zoomFactor = delta > 0 ? (1 - ZOOM_STEP) : (1 + ZOOM_STEP);
      const newScale = clampScale(prev.scale * zoomFactor);
      if (newScale === prev.scale) return prev;

      const ratio = newScale / prev.scale;
      const cx = clientX - rect.left;
      const cy = clientY - rect.top;
      return {
        x: Math.round(cx - (cx - prev.x) * ratio),
        y: Math.round(cy - (cy - prev.y) * ratio),
        scale: newScale,
      };
    });
  }, []);

  /* ── Wheel handler (zoom with Cmd/Ctrl, or pan) ── */
  const onWheel = useCallback((e, rect) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom centered on cursor
      zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 1 : -1, rect);
    } else {
      // Pan
      setTransform(prev => ({
        ...prev,
        x: Math.round(prev.x - e.deltaX),
        y: Math.round(prev.y - e.deltaY),
      }));
    }
  }, [zoomAt]);

  /* ── Pointer pan (Space + drag, or middle mouse) ── */
  const onPointerDown = useCallback((e) => {
    if (spaceHeld.current || e.button === 1) {
      isPanning.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.style.cursor = 'grabbing';
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback((e) => {
    if (isPanning.current) {
      isPanning.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      e.currentTarget.style.cursor = '';
    }
  }, []);

  /* ── Keyboard: Space for pan ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.code === 'Space' && !e.repeat) {
        spaceHeld.current = true;
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') spaceHeld.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /* ── Public API ── */
  const zoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: clampScale(prev.scale * 1.15) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: clampScale(prev.scale / 1.15) }));
  }, []);

  const zoomTo100 = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: 1.0 }));
  }, []);

  /**
   * Fit to Width & Center
   * Default zoom = (canvas width minus 96px) divided by frame width, clamped between 40% and 100%.
   * Top frame (Hero) is fully visible on load with y = 32px, scrollTop 0.
   */
  const fitToWidth = useCallback((viewportW, viewportH) => {
    if (!viewportW || viewportW <= 0) return;
    const availableW = viewportW - 96;
    const rawScale = availableW / FRAME_WIDTH;
    const scale = Math.min(1.0, Math.max(0.40, rawScale));
    const x = Math.round((viewportW - FRAME_WIDTH * scale) / 2);
    const y = 32;
    setTransform({ x, y, scale });
  }, []);

  /**
   * Center on a specific frame (by top coordinate or element)
   */
  const centerFrame = useCallback((frameTop, viewportW, viewportH) => {
    setTransform(prev => {
      const targetY = 60 - (frameTop || 0) * prev.scale;
      const x = Math.round((viewportW - FRAME_WIDTH * prev.scale) / 2);
      return {
        ...prev,
        x,
        y: Math.round(targetY)
      };
    });
  }, []);

  const isSpaceHeld = () => spaceHeld.current;
  const isPanningNow = () => isPanning.current;

  return {
    transform,
    setTransform,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    zoomIn,
    zoomOut,
    zoomTo100,
    fitToWidth,
    centerFrame,
    isSpaceHeld,
    isPanningNow,
  };
}
