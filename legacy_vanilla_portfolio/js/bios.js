// BIOS Boot Sequence Controller
class BiosController {
  constructor() {
    this.biosScreen = document.getElementById('bios-screen');
    this.lines = Array.from(document.querySelectorAll('#bios-screen .bios-line'));
    this.pressEnterLine = document.getElementById('press-enter-line');
    this.isCompleted = false;
    this.currentIndex = 0;
    this.timer = null;

    this.init();
  }

  init() {
    // Hide lines initially for authentic sequential boot
    this.lines.forEach(line => {
      line.style.opacity = '0';
    });

    this.startBootSequence();

    // Fast-forward on click or keydown if still booting
    const skipHandler = (e) => {
      if (!this.isCompleted) {
        this.completeImmediately();
      } else if (e.type === 'click' || e.type === 'touchend' || e.key === 'Enter') {
        this.proceedToNext();
      }
    };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (!this.isCompleted) {
          this.completeImmediately();
        } else {
          this.proceedToNext();
        }
      } else if (!this.isCompleted) {
        this.completeImmediately();
      }
    });

    if (this.biosScreen) {
      this.biosScreen.addEventListener('click', skipHandler);
      this.biosScreen.addEventListener('touchend', skipHandler);
    }
  }

  startBootSequence() {
    const showNext = () => {
      if (this.currentIndex < this.lines.length) {
        const line = this.lines[this.currentIndex];
        line.style.opacity = '1';
        this.currentIndex++;

        // Varied typing delay for BIOS realism
        let delay = 90;
        if (this.currentIndex === 3 || this.currentIndex === 5 || this.currentIndex === 10) {
          delay = 200;
        } else if (this.currentIndex === 14) {
          delay = 250;
        } else if (this.currentIndex === 15) {
          delay = 300;
        }

        this.timer = setTimeout(showNext, delay);
      } else {
        this.isCompleted = true;
      }
    };

    showNext();
  }

  completeImmediately() {
    clearTimeout(this.timer);
    this.lines.forEach(line => {
      line.style.opacity = '1';
    });
    this.isCompleted = true;
  }

  proceedToNext(isDirectUrl = false) {
    console.log('BIOS completed. Ready for Windows 95 desktop.');
    document.body.classList.add('desktop-mode');

    // Startup audio: Play "11. The Microsoft Sound.mp3" when proceeding from BIOS to Windows desktop
    if (window.soundManager && !isDirectUrl) {
      window.soundManager.play('microsoft');
    }

    if (typeof window.onBiosContinue === 'function') {
      window.onBiosContinue();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.biosApp = new BiosController();

  if (window.location.search.includes('desktop') || window.location.search.includes('screen=') || window.location.search.includes('start')) {
    window.biosApp.completeImmediately();
    window.biosApp.proceedToNext(true);
  }
});
