/**
 * Editorial Background Music Manager
 * Single background music track, loop at volume 0.4.
 * Default state: OFF on page load. No autoplay.
 */

export const BG_MUSIC_SRC = "/assets/bg-music.mp3";

class EditorialMusicManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isUnavailable = false;
    this.listeners = new Set();
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
      isUnavailable: this.isUnavailable
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
      audio.volume = 0.4;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      this.isPlaying = true;
      this.isUnavailable = false;
      this.notify();
      return true;
    } catch (err) {
      console.warn('[BG_MUSIC] Play rejected:', err);
      if (err.name === 'NotAllowedError') {
        // User interaction required, do not mark as permanently unavailable
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

  async toggle() {
    if (this.isUnavailable) {
      return { isPlaying: false, isUnavailable: true };
    }
    if (this.isPlaying) {
      this.pause();
      return { isPlaying: false, isUnavailable: false };
    } else {
      const ok = await this.play();
      return { isPlaying: ok, isUnavailable: this.isUnavailable };
    }
  }
}

export const editorialMusic = new EditorialMusicManager();
