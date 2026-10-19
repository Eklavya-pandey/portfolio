/**
 * Editorial & Futuristic Background Music Manager
 * Single background music track, loops at volume 0.4.
 *
 * Provides:
 * 1. Immediate unmuted play attempt on landing/arrival.
 * 2. Instant gesture unlock listeners (pointerdown, touchstart, mousedown, keydown, click)
 *    so the very first touch/click anywhere on the page unlocks unmuted playback immediately.
 * 3. Immediate cutoff (pause + detach listeners) when the user navigates away or switches themes.
 * 4. Safe sync with theme switches — direct click gestures unlock audio seamlessly.
 * 5. Accurate state synchronization so buttons never show "Audio ON" when sound is actually silent or blocked.
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
    this.isPendingAutoplay = false;
    this._unlockHandler = null;
  }

  getAudio() {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      try {
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
      isPendingAutoplay: this.isPendingAutoplay,
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

  detachActivationListeners() {
    if (this._unlockHandler && typeof window !== 'undefined') {
      const activationEvents = [
        'pointerdown',
        'mousedown',
        'mouseup',
        'touchstart',
        'touchend',
        'click',
        'keydown'
      ];
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, this._unlockHandler, true);
        document.removeEventListener(evt, this._unlockHandler, true);
      });
      window.removeEventListener('boot:done', this._unlockHandler);
      this._unlockHandler = null;
    }
    this.isPendingAutoplay = false;
  }

  async play(options = {}) {
    if (typeof window === 'undefined') return false;
    if (this.userExplicitMuted && !options.overrideMute) {
      return false;
    }

    const audio = this.getAudio();
    if (!audio) {
      this.isUnavailable = true;
      this.notify();
      return false;
    }

    try {
      audio.loop = true;

      if (this.userExplicitMuted) {
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
      this.isPendingAutoplay = false;
      this.notify();
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        // Autoplay policy prevented immediate playback without user interaction
        this.isPlaying = false;
        this.isPendingAutoplay = true;
      } else if (err.name === 'AbortError') {
        // Playback was interrupted by pause or another call
      } else {
        console.warn('[BG_MUSIC] Play rejected:', err);
      }
      this.notify();
      return false;
    }
  }

  pause() {
    this.detachActivationListeners();
    if (this.audio) {
      try {
        this.audio.pause();
      } catch {}
    }
    this.isPlaying = false;
    this.isPendingAutoplay = false;
    this.notify();
  }

  stop() {
    this.detachActivationListeners();
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {}
    }
    this.isPlaying = false;
    this.isPendingAutoplay = false;
    this.notify();
  }

  mute() {
    this.userExplicitMuted = true;
    this.isMuted = true;
    if (this.audio) {
      this.audio.muted = true;
    }
    this.detachActivationListeners();
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
      this.play({ overrideMute: true });
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
      this.userExplicitMuted = true;
      this.pause();
      return { isPlaying: false, isUnavailable: false, isMuted: true };
    } else {
      this.userExplicitMuted = false;
      this.isMuted = false;
      if (this.audio) {
        this.audio.muted = false;
        this.audio.volume = 0.4;
      }
      const ok = await this.play({ overrideMute: true });
      return { isPlaying: ok, isUnavailable: this.isUnavailable, isMuted: false };
    }
  }

  autoStart() {
    if (typeof window === 'undefined') return;
    if (this.userExplicitMuted) return;

    const audio = this.getAudio();
    if (!audio) return;

    // Reset previous listeners if any
    this.detachActivationListeners();

    // Setup global one-time gesture unlock
    this._unlockHandler = () => {
      if (this.userExplicitMuted) {
        this.detachActivationListeners();
        return;
      }

      const a = this.getAudio();
      if (!a) return;

      a.muted = false;
      a.volume = 0.4;
      this.isMuted = false;

      this.play({ overrideMute: true }).then((ok) => {
        if (ok) {
          this.hasUnlocked = true;
          this.detachActivationListeners();
        }
      }).catch(() => {});
    };

    const activationEvents = [
      'pointerdown',
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'click',
      'keydown'
    ];

    activationEvents.forEach((evt) => {
      window.addEventListener(evt, this._unlockHandler, { passive: true, capture: true });
      document.addEventListener(evt, this._unlockHandler, { passive: true, capture: true });
    });
    window.addEventListener('boot:done', this._unlockHandler, { once: true });

    // Attempt immediate unmuted play on arrival
    this.play().then((started) => {
      if (started) {
        this.hasUnlocked = true;
        this.detachActivationListeners();
      }
    }).catch(() => {});
  }
}

export const editorialMusic = new EditorialMusicManager();
