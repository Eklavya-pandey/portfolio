/**
 * Editorial Background Music Manager
 * Single background music track, loop at volume 0.4.
 * Starts automatically on arrival with robust browser autoplay policy handling:
 * 1. Immediate play attempt (unmuted first; muted fallback to buffer/stream).
 * 2. Unmutes/plays on the very first user interaction (click, keydown, touch, tap) anywhere.
 * 3. Keeps gesture listeners active until audio is confirmed playing audibly.
 * 4. Integrates with boot screen click/keypress skip so the first interaction with the site triggers playback immediately.
 * 5. Handles AbortError and NotAllowedError gracefully without disabling the audio widget.
 */

export const BG_MUSIC_SRC = "/assets/bg-music.mp3";

class EditorialMusicManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isUnavailable = false;
    this.isMuted = false;
    this.userExplicitMuted = false;
    this.listeners = new Set();
    this.hasUnlocked = false;
    this.autoStarted = false;
  }

  getAudio() {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      try {
        // Look for preloaded element from DOM or create one
        let audio = document.getElementById('editorial-bg-audio');
        if (!audio) {
          audio = document.createElement('audio');
          audio.id = 'editorial-bg-audio';
          audio.style.display = 'none';
          document.body.appendChild(audio);
        }

        audio.src = BG_MUSIC_SRC;
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0.4;

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
        window.__editorialMusic = this;
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

  async play(options = {}) {
    const audio = this.getAudio();
    if (!audio) {
      this.isUnavailable = true;
      this.notify();
      return false;
    }

    try {
      audio.loop = true;

      // Handle muting logic
      if (this.userExplicitMuted) {
        audio.muted = true;
        this.isMuted = true;
      } else if (options.forceMuted) {
        audio.muted = true;
        this.isMuted = true;
      } else {
        audio.muted = false;
        audio.volume = 0.4;
        this.isMuted = false;
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
        // Autoplay policy prevented immediate unmuted playback
        this.isPlaying = false;
        // Fallback: start muted immediately so audio buffers and runs in the pipeline
        if (options.fallbackMuted !== false && !this.isPlaying) {
          try {
            audio.muted = true;
            this.isMuted = true;
            await audio.play();
            this.isPlaying = true;
          } catch {}
        }
      } else if (err.name === 'AbortError') {
        // Playback was interrupted by another call; not a fatal error
      } else {
        console.warn('[BG_MUSIC] Play rejected:', err);
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
    this.userExplicitMuted = true;
    this.isMuted = true;
    if (this.audio) {
      this.audio.muted = true;
    }
    this.notify();
  }

  unmute() {
    this.userExplicitMuted = false;
    this.isMuted = false;
    if (this.audio) {
      this.audio.muted = false;
      this.audio.volume = 0.4;
    }
    if (!this.isPlaying) {
      this.play({ fallbackMuted: false });
    } else {
      this.notify();
    }
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
    if (this.isPlaying && !this.isMuted) {
      this.pause();
      return { isPlaying: false, isUnavailable: false, isMuted: this.isMuted };
    } else {
      this.userExplicitMuted = false;
      const ok = await this.play({ fallbackMuted: false });
      return { isPlaying: ok, isUnavailable: this.isUnavailable, isMuted: this.isMuted };
    }
  }

  autoStart() {
    if (typeof window === 'undefined') return;

    // Direct activation events
    const activationEvents = [
      'pointerdown',
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'click',
      'keydown'
    ];

    const unlockHandler = () => {
      if (this.userExplicitMuted) return;

      const audio = this.getAudio();
      if (!audio) return;

      // Unmute and ensure playing
      audio.muted = false;
      audio.volume = 0.4;
      this.isMuted = false;

      this.play({ fallbackMuted: false }).then((ok) => {
        if (ok && !this.isMuted) {
          this.hasUnlocked = true;
          detachListeners();
        }
      }).catch(() => {});
    };

    const detachListeners = () => {
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, unlockHandler, true);
        document.removeEventListener(evt, unlockHandler, true);
      });
      window.removeEventListener('boot:done', unlockHandler);
    };

    activationEvents.forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { passive: true, capture: true });
      document.addEventListener(evt, unlockHandler, { passive: true, capture: true });
    });
    window.addEventListener('boot:done', unlockHandler, { once: true });

    // 1. Attempt immediate unmuted play on arrival
    this.play({ fallbackMuted: true }).then((started) => {
      if (started && !this.isMuted) {
        this.hasUnlocked = true;
        detachListeners();
      }
    }).catch(() => {});
  }
}

export const editorialMusic = new EditorialMusicManager();
