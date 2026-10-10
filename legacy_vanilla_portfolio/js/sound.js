// ============================================================
// Windows 98 Centralized Sound System
// Uses authentic Windows 98 SoundPack audio assets
// ============================================================

class Win98SoundSystem {
  constructor() {
    this.soundMap = {
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
      microsoft: 'SoundPack/11. The Microsoft Sound.mp3'
    };

    this.lastPlayedAt = {};
    this.unlocked = false;
    this.preloaded = {};

    this.initUnlock();
  }

  initUnlock() {
    const unlock = () => {
      if (this.unlocked) return;
      this.unlocked = true;

      // Preload audio elements on first user gesture
      Object.keys(this.soundMap).forEach(key => {
        try {
          const a = new Audio(this.soundMap[key]);
          a.preload = 'auto';
          this.preloaded[key] = a;
        } catch (e) {}
      });

      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('touchstart', unlock);
    };

    document.addEventListener('click', unlock, { passive: true });
    document.addEventListener('keydown', unlock, { passive: true });
    document.addEventListener('touchstart', unlock, { passive: true });
  }

  play(eventKey, options = {}) {
    const src = this.soundMap[eventKey];
    if (!src) {
      console.warn(`[Win98 Sound] Unknown sound event: "${eventKey}"`);
      return null;
    }

    // Throttle repeated triggers (min 150ms between identical events)
    const now = Date.now();
    const minInterval = options.minInterval || 150;
    if (this.lastPlayedAt[eventKey] && now - this.lastPlayedAt[eventKey] < minInterval) {
      return null;
    }
    this.lastPlayedAt[eventKey] = now;

    try {
      const audio = new Audio(src);
      audio.volume = options.volume !== undefined ? options.volume : 0.8;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy prevented playback or user navigated away
          console.debug(`[Win98 Sound] Playback prevented for ${eventKey}:`, err);
        });
      }
      return audio;
    } catch (err) {
      console.debug(`[Win98 Sound] Error playing ${eventKey}:`, err);
      return null;
    }
  }
}

// Global centralized sound manager
window.soundManager = new Win98SoundSystem();
