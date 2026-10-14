/**
 * editorialBoot.js
 * Blueprint boot loading screen controller (< 3 KB).
 * Manages typewriter log, readiness synchronization, counter, and shutter split.
 */

(function initEditorialBoot() {
  if (typeof window === 'undefined') return;

  // 1. Session, Theme, & Motion Evaluation
  try {
    const params = new URLSearchParams(window.location.search);
    const forceBoot = params.get('boot') === '1';
    const urlTheme = params.get('theme');
    const savedTheme = sessionStorage.getItem('naveen_portfolio_theme') || localStorage.getItem('naveen_portfolio_theme');
    const activeTheme = (urlTheme || savedTheme || 'editorial').toLowerCase();
    const isNotEditorial = activeTheme !== 'editorial';
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenBoot = sessionStorage.getItem('nd_boot_seen') === '1';

    // If seen in session (and not forced), or not Editorial theme, or reduced motion: skip immediately
    if ((hasSeenBoot && !forceBoot) || isNotEditorial || prefersReducedMotion) {
      document.documentElement.classList.add('nd-boot-skip');
      const el = document.getElementById('nd-boot-overlay');
      if (el && el.parentNode) el.parentNode.removeChild(el);
      window.dispatchEvent(new CustomEvent('boot:done'));
      return;
    }
  } catch (err) {
    document.documentElement.classList.add('nd-boot-skip');
    const el = document.getElementById('nd-boot-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    window.dispatchEvent(new CustomEvent('boot:done'));
    return;
  }

  // 2. Locate Overlay Elements
  const overlay = document.getElementById('nd-boot-overlay');
  if (!overlay) return;

  window.__nd_boot_active = true;

  // Lock body scroll
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  // 3. Log Lines Definition
  const lines = [
    { text: '> INIT naveen.design v2.6', ok: false },
    { text: '> LOAD fonts .......... ', ok: true },
    { text: '> LOAD grid ........... ', ok: true },
    { text: '> LOAD portfolio ...... ', ok: true },
    { text: '> STATUS: OPEN_TO_ROLES', ok: false }
  ];

  const logEls = document.querySelectorAll('.nd-boot-log');
  const counterEls = document.querySelectorAll('.nd-boot-counter');
  const fillEls = document.querySelectorAll('.nd-boot-progress-fill');

  let finished = false;
  const startTime = performance.now();
  const MIN_TIME = 900;
  const MAX_TIME = 1400;

  // 4. Real Readiness Detection
  let isPageReady = false;
  const setPageReady = () => { isPageReady = true; };

  if (document.readyState === 'complete') {
    isPageReady = true;
  } else {
    window.addEventListener('load', setPageReady, { once: true });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setPageReady).catch(setPageReady);
  }

  // 5. Completion & Shutter Reveal Trigger
  function finishShutter(skipped) {
    if (finished) return;
    finished = true;
    window.__nd_boot_active = false;

    // Remove event listeners
    window.removeEventListener('keydown', handleSkip, { capture: true });
    overlay.removeEventListener('click', handleSkip);
    overlay.removeEventListener('touchstart', handleSkip);

    try {
      sessionStorage.setItem('nd_boot_seen', '1');
    } catch {}

    // Fill UI to 100%
    counterEls.forEach(el => { el.textContent = '100'; });
    fillEls.forEach(el => { el.style.width = '100%'; });

    // Render full completed log with READY
    let fullHtml = '';
    lines.forEach((l, i) => {
      fullHtml += `<div class="nd-boot-log-line">${l.text}${l.ok ? '<span class="nd-boot-ok">[OK]</span>' : ''}${i === 4 ? ' <span class="nd-boot-ready">READY</span>' : ''}</div>`;
    });
    logEls.forEach(el => { el.innerHTML = fullHtml; });

    // Trigger physical shutter aperture
    overlay.classList.add('shutter-open');
    overlay.setAttribute('aria-hidden', 'true');

    // Unlock body scroll
    document.body.style.overflow = prevOverflow;

    try {
      if (window.__editorialMusic) {
        window.__editorialMusic.play({ fallbackMuted: false });
      }
    } catch (err) {}

    // Clean up DOM after shutter animation (380ms)
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.documentElement.classList.add('nd-boot-hidden');
      window.dispatchEvent(new CustomEvent('boot:done'));
    }, 380);
  }

  // 6. Skip Handler (Click, Tap, Any Key)
  function handleSkip(e) {
    if (finished) return;
    if (e && e.type === 'keydown') {
      e.preventDefault();
    }
    try {
      if (window.__editorialMusic) {
        window.__editorialMusic.play({ fallbackMuted: false });
      }
    } catch (err) {}
    finishShutter(true);
  }

  window.addEventListener('keydown', handleSkip, { capture: true });
  overlay.addEventListener('click', handleSkip);
  overlay.addEventListener('touchstart', handleSkip, { passive: true });

  // 7. RequestAnimationFrame Typewriter & Counter Loop
  function tick(now) {
    if (finished) return;

    const elapsed = now - startTime;
    let progress = 0;

    if (elapsed < MIN_TIME) {
      progress = (elapsed / MIN_TIME) * 85;
    } else {
      if (isPageReady || elapsed >= MAX_TIME) {
        const extra = Math.min(1, (elapsed - MIN_TIME) / (MAX_TIME - MIN_TIME));
        progress = 85 + extra * 15;
      } else {
        progress = 85 + Math.min(10, ((elapsed - MIN_TIME) / 500) * 10);
      }
    }

    progress = Math.min(100, Math.max(0, progress));

    const countStr = String(Math.floor(progress)).padStart(3, '0');
    counterEls.forEach(el => { el.textContent = countStr; });
    fillEls.forEach(el => { el.style.width = `${progress}%`; });

    // Determine characters to show
    const totalChars = lines.reduce((sum, l) => sum + l.text.length + (l.ok ? 4 : 0), 0);
    const charsToShow = Math.floor((progress / 100) * totalChars);

    let currentChars = 0;
    let logHtml = '';
    let hasActiveLine = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLen = line.text.length + (line.ok ? 4 : 0);

      if (charsToShow >= currentChars + lineLen) {
        logHtml += `<div class="nd-boot-log-line">${line.text}${line.ok ? '<span class="nd-boot-ok">[OK]</span>' : ''}${i === 4 && progress >= 100 ? ' <span class="nd-boot-ready">READY</span>' : ''}</div>`;
        currentChars += lineLen;
      } else if (charsToShow > currentChars) {
        hasActiveLine = true;
        const lineProg = charsToShow - currentChars;
        if (lineProg <= line.text.length) {
          logHtml += `<div class="nd-boot-log-line">${line.text.slice(0, lineProg)}<span class="nd-boot-cursor" aria-hidden="true"></span></div>`;
        } else {
          const okPart = '[OK]'.slice(0, lineProg - line.text.length);
          logHtml += `<div class="nd-boot-log-line">${line.text}<span class="nd-boot-ok">${okPart}</span><span class="nd-boot-cursor" aria-hidden="true"></span></div>`;
        }
        break;
      } else {
        break;
      }
    }

    if (!hasActiveLine && progress < 100 && logHtml) {
      logHtml += '<span class="nd-boot-cursor" aria-hidden="true"></span>';
    }

    logEls.forEach(el => { el.innerHTML = logHtml; });

    if (progress >= 100 && (elapsed >= MIN_TIME && (isPageReady || elapsed >= MAX_TIME))) {
      setTimeout(() => {
        finishShutter(false);
      }, 120);
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
