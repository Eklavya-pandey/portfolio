import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';

export const SoundContext = createContext();

const SOUND_FILES = {
  chimes: 'SoundPack/01. Chimes.mp3',
  chord: 'SoundPack/02. Chord.mp3',
  ding: 'SoundPack/03. Ding.mp3',
  logoff: 'SoundPack/04. Logoff.mp3',
  notify: 'SoundPack/05. Notify.mp3',
  recycle: 'SoundPack/06. Recycle.mp3',
  ringin: 'SoundPack/07. Ringin.mp3',
  ringout: 'SoundPack/08. Ringout.mp3',
  start: 'SoundPack/09. Start.mp3',
  tada: 'SoundPack/10. Tada.mp3',
  microsoft: 'SoundPack/11. The Microsoft Sound.mp3',
  startup: 'SoundPack/11. The Microsoft Sound.mp3',
  boot: 'SoundPack/11. The Microsoft Sound.mp3',
};

export function SoundProvider({ children }) {
  const audioCache = useRef({});
  const isUnlocked = useRef(false);

  const unlockAudio = useCallback(() => {
    if (isUnlocked.current) return;
    isUnlocked.current = true;

    // Silent play-pause to unlock HTML5 audio restrictions on browsers
    Object.values(audioCache.current).forEach(audio => {
      try {
        const promise = audio.play();
        if (promise !== undefined) {
          promise.then(() => {
            audio.pause();
            audio.currentTime = 0;
          }).catch(() => {});
        }
      } catch (e) {}
    });
  }, []);

  useEffect(() => {
    // Pre-initialize audio elements
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audioCache.current[key] = audio;
      } catch (e) {
        console.warn(`Could not preload audio: ${key}`, e);
      }
    });

    const unlockAudio = () => {
      if (isUnlocked.current) return;
      isUnlocked.current = true;

      // Silent play-pause to unlock HTML5 audio restrictions on browsers
      Object.values(audioCache.current).forEach(audio => {
        try {
          const promise = audio.play();
          if (promise !== undefined) {
            promise.then(() => {
              audio.pause();
              audio.currentTime = 0;
            }).catch(() => {});
          }
        } catch (e) {}
      });

      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // Expose sound manager on window for compatibility
    window.soundManager = {
      play: (soundName, options) => playSound(soundName, options),
      sounds: SOUND_FILES
    };

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const playSound = useCallback((soundName, options = {}) => {
    const audio = audioCache.current[soundName];
    if (!audio) {
      console.warn(`Sound "${soundName}" not found in SoundPack.`);
      return;
    }

    try {
      // Clone audio node for concurrent or rapid successive plays (e.g. rapid clicks)
      const soundClone = audio.cloneNode();
      soundClone.volume = options.volume !== undefined ? options.volume : 0.75;
      
      const playPromise = soundClone.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Playback prevented for sound: ${soundName}`, err);
        });
      }
    } catch (e) {
      console.warn(`Error playing sound: ${soundName}`, e);
    }
  }, []);

  return (
    <SoundContext.Provider value={{ playSound, unlockAudio, sounds: SOUND_FILES }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
