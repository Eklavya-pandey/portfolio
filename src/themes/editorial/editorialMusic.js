/**
 * Editorial Background Music Manager
 * Single background music track, loop at volume 0.4.
 * Starts automatically on arrival (with seamless one-time gesture unlock fallback).
 * Provides pause, stop, and mute controls via floating hover button.
 */

export const BG_MUSIC_SRC = "/assets/bg-music.mp3";

class EditorialMusicManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isUnavailable = false;
    this.isMuted = false;
    this.listeners = new Set();
    this.autoStarted = false;
  }

  getAudio() {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      try {
        const audio = new Audio();
        audio.src = BG_MUSIC_SRC;
        audio.loop = true;
        audio.volume = 0.4;
        audio.preload = 'auto';

        audio.addEventListener('play', () => {
          this.isPlaying = true;
          this.notify();
        });

        audio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.notify();
        });

        audio.addEventListener('error', () => {
          if (audio.error && audio.src && !audio.src.endsWith('/')) {
            console.warn('[BG_MUSIC] Audio load error:', audio.error);
            this.isUnavailable = true;
            this.isPlaying = false;
            this.notify();
          }
        });

        this.audio = audio;
      } catch (err) {
        console.warn('[BG_MUSIC] Initialization error:', err);
        this.isUnavailable = true;
      }
    }
    return this.audio;
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      isUnavailable: this.isUnavailable,
      isMuted: this.isMuted,
      volume: this.audio ? this.audio.volume : 0.4
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch {}
    });
  }

  async play() {
    const audio = this.getAudio();
    if (!audio) {
      this.isUnavailable = true;
      this.notify();
      return false;
    }

    try {
      audio.loop = true;
      if (this.isMuted) {
        audio.muted = true;
      } else {
        audio.muted = false;
        audio.volume = 0.4;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      this.isPlaying = true;
      this.isUnavailable = false;
      this.notify();
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        // Autoplay policy prevented immediate playback without user interaction
        this.isPlaying = false;
      } else {
        this.isUnavailable = true;
        this.isPlaying = false;
      }
      this.notify();
      return false;
    }
  }

  pause() {
    if (this.audio) {
      try {
        this.audio.pause();
      } catch {}
    }
    this.isPlaying = false;
    this.notify();
  }

  stop() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {}
    }
    this.isPlaying = false;
    this.notify();
  }

  mute() {
    if (this.audio) {
      this.audio.muted = true;
    }
    this.isMuted = true;
    this.notify();
  }

  unmute() {
    if (this.audio) {
      this.audio.muted = false;
      this.audio.volume = 0.4;
    }
    this.isMuted = false;
    this.notify();
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }

  async toggle() {
    if (this.isUnavailable) {
      return { isPlaying: false, isUnavailable: true, isMuted: this.isMuted };
    }
    if (this.isPlaying) {
      this.pause();
      return { isPlaying: false, isUnavailable: false, isMuted: this.isMuted };
    } else {
      const ok = await this.play();
      return { isPlaying: ok, isUnavailable: this.isUnavailable, isMuted: this.isMuted };
    }
  }

  autoStart() {
    if (typeof window === 'undefined') return;
    if (this.autoStarted) return;
    this.autoStarted = true;

    // 1. Attempt immediate play upon arrival
    this.play().then((started) => {
      if (started) return;

      // 2. Fallback: browser requires user gesture. Start on first interaction anywhere.
      const gestureEvents = ['pointerdown', 'keydown', 'click', 'scroll', 'touchstart'];
      const onFirstGesture = () => {
        this.play();
        gestureEvents.forEach((evt) => {
          window.removeEventListener(evt, onFirstGesture, true);
        });
      };

      gestureEvents.forEach((evt) => {
        window.addEventListener(evt, onFirstGesture, { once: true, passive: true, capture: true });
      });
    }).catch(() => {});
  }
}

export const editorialMusic = new EditorialMusicManager();
