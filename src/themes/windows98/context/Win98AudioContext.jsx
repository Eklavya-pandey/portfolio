import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export const EMPTY_PLAYLIST_MESSAGE = 'Playlist is empty. Somebody forgot to bring the music.';

const Win98AudioContext = createContext(null);

export function Win98AudioProvider({ children }) {
  const [manifest, setManifest] = useState({ music: [], video: [], items: [] });
  const [customTracks, setCustomTracks] = useState([]);
  const activeOwnerRef = useRef(null);
  const pauseCallbacksRef = useRef({});

  // Fetch media-manifest.json on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/media-manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load manifest');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data) {
          setManifest({
            music: Array.isArray(data.music) ? data.music : [],
            video: Array.isArray(data.video) ? data.video : [],
            items: Array.isArray(data.items) ? data.items : [],
          });
        }
      })
      .catch(() => {
        // Fallback: empty manifest
        if (isMounted) {
          setManifest({ music: [], video: [], items: [] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Register pause callback for a player ('winamp' or 'mediaplayer')
  const registerPlayer = useCallback((playerId, pauseFn) => {
    pauseCallbacksRef.current[playerId] = pauseFn;
    return () => {
      delete pauseCallbacksRef.current[playerId];
      if (activeOwnerRef.current === playerId) {
        activeOwnerRef.current = null;
      }
    };
  }, []);

  // Request playback: pauses the other player if currently playing
  const requestPlayback = useCallback((playerId) => {
    const currentOwner = activeOwnerRef.current;
    if (currentOwner && currentOwner !== playerId) {
      const pauseOther = pauseCallbacksRef.current[currentOwner];
      if (typeof pauseOther === 'function') {
        try {
          pauseOther();
        } catch (e) {
          console.warn('Error pausing previous player:', e);
        }
      }
    }
    activeOwnerRef.current = playerId;
  }, []);

  // Notify that player has stopped/paused
  const notifyPaused = useCallback((playerId) => {
    if (activeOwnerRef.current === playerId) {
      activeOwnerRef.current = null;
    }
  }, []);

  // Add a local custom track from File > Open
  const addCustomTrack = useCallback((file, type = 'audio') => {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
    const newTrack = {
      name: cleanName || 'Local File',
      path: url,
      type: file.type.startsWith('video') ? 'video' : type,
      isLocal: true,
    };
    setCustomTracks((prev) => [newTrack, ...prev]);
    return newTrack;
  }, []);

  // Music list: custom tracks + manifest music
  const musicList = [
    ...customTracks.filter((t) => t.type === 'audio'),
    ...manifest.music,
  ];

  // Media list for Media Player: custom tracks + all manifest items
  const allMediaList = [
    ...customTracks,
    ...manifest.items,
  ];

  const value = {
    manifest,
    musicList,
    allMediaList,
    registerPlayer,
    requestPlayback,
    notifyPaused,
    addCustomTrack,
    emptyMessage: EMPTY_PLAYLIST_MESSAGE,
  };

  return (
    <Win98AudioContext.Provider value={value}>
      {children}
    </Win98AudioContext.Provider>
  );
}

export function useWin98Audio() {
  const context = useContext(Win98AudioContext);
  if (!context) {
    throw new Error('useWin98Audio must be used within a Win98AudioProvider');
  }
  return context;
}
