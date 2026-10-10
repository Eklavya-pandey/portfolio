// Windows 95 Interactive Desktop & Window Manager

class Window95Manager {
  constructor() {
    this.desktop = document.getElementById('desktop-environment');
    this.desktopArea = document.querySelector('.DesktopArea');
    this.icons = Array.from(document.querySelectorAll('.DesktopIconsColumn .Item'));
    this.startButton = document.getElementById('start-button');
    this.startMenu = document.getElementById('start-menu');
    this.shutdownDialog = document.getElementById('shutdown-dialog');
    this.highestZIndex = 30;

    // Cascading position tracker
    this.cascadeOffset = { x: 0, y: 0 };
    this.cascadeStep = 28;
    this.cascadeBase = { x: 120, y: 40 };

    // Audio manager — centralized in window.soundManager (js/sound.js)
    this.soundManager = window.soundManager;
    this.hasTriggeredContactRingin = false;

    // Window 1: ABOUT_ME.EXE
    this.about = {
      id: 'about',
      window: document.getElementById('about-me-window'),
      tab: document.getElementById('tab-about-me'),
      titlebar: document.getElementById('about-titlebar'),
      btnMinimize: document.getElementById('btn-minimize'),
      btnMaximize: document.getElementById('btn-maximize'),
      btnClose: document.getElementById('btn-close'),
      btnOk: document.getElementById('btn-ok-about') || document.getElementById('btn-ok'),
      icon: null
    };

    // Window 2: SKILLS.EXE
    this.skills = {
      id: 'skills',
      window: document.getElementById('skills-window'),
      tab: document.getElementById('tab-skills'),
      titlebar: document.getElementById('skills-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-skills'),
      btnMaximize: document.getElementById('btn-maximize-skills'),
      btnClose: document.getElementById('btn-close-skills'),
      btnOk: document.getElementById('btn-ok-skills'),
      btnApply: document.getElementById('btn-apply-skills'),
      icon: document.getElementById('icon-skills')
    };

    // Window 3: RESUME.EXE
    this.resume = {
      id: 'resume',
      window: document.getElementById('resume-window'),
      tab: document.getElementById('tab-resume'),
      titlebar: document.getElementById('resume-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-resume'),
      btnMaximize: document.getElementById('btn-maximize-resume'),
      btnClose: document.getElementById('btn-close-resume'),
      icon: document.getElementById('icon-proof'),
      docArea: document.getElementById('resume-doc-area'),
      scrollbar: document.getElementById('resume-scrollbar'),
      scrollThumb: document.getElementById('resume-scroll-thumb'),
      scrollTrack: document.getElementById('resume-scroll-track'),
      scrollUp: document.getElementById('resume-scroll-up'),
      scrollDown: document.getElementById('resume-scroll-down')
    };

    // Window 4: HELLO.EXE
    this.hello = {
      id: 'hello',
      window: document.getElementById('hello-window'),
      tab: document.getElementById('tab-hello'),
      titlebar: document.getElementById('hello-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-hello'),
      btnMaximize: document.getElementById('btn-maximize-hello'),
      btnClose: document.getElementById('btn-close-hello'),
      icon: document.getElementById('icon-hello'),
      btnSend: document.getElementById('btn-contact-send'),
      inputName: document.getElementById('contact-name'),
      inputEmail: document.getElementById('contact-email'),
      inputMessage: document.getElementById('contact-message')
    };

    // Window 5: Recycle Bin (Oops)
    this.recycle = {
      id: 'recycle',
      window: document.getElementById('recycle-bin-window'),
      tab: document.getElementById('tab-recycle-bin'),
      titlebar: document.getElementById('recycle-bin-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-recycle'),
      btnMaximize: document.getElementById('btn-maximize-recycle'),
      btnClose: document.getElementById('btn-close-recycle'),
      icon: document.getElementById('icon-oops'),
      btnRestore: document.getElementById('btn-restore-recycle'),
      btnDelete: document.getElementById('btn-delete-recycle'),
      btnEmpty: document.getElementById('btn-empty-recycle'),
      rowsContainer: document.getElementById('recycle-rows-container'),
      statusText: document.getElementById('recycle-status-text'),
      scrollThumb: document.getElementById('recycle-scroll-thumb'),
      scrollTrack: document.getElementById('recycle-scroll-track'),
      scrollUp: document.getElementById('recycle-scroll-up'),
      scrollDown: document.getElementById('recycle-scroll-down')
    };

    // Window 6: My Computer (Me.exe)
    this.myComputer = {
      id: 'mycomputer',
      window: document.getElementById('my-computer-window'),
      tab: document.getElementById('tab-my-computer'),
      titlebar: document.getElementById('my-computer-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-mycomputer'),
      btnMaximize: document.getElementById('btn-maximize-mycomputer'),
      btnClose: document.getElementById('btn-close-mycomputer'),
      btnOk: document.getElementById('btn-ok-mycomputer'),
      btnCancel: document.getElementById('btn-cancel-mycomputer'),
      icon: document.getElementById('icon-me')
    };

    // Window 7: MADE (Projects)
    this.made = {
      id: 'made',
      window: document.getElementById('made-window'),
      tab: document.getElementById('tab-made'),
      titlebar: document.getElementById('made-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-made'),
      btnMaximize: document.getElementById('btn-maximize-made'),
      btnClose: document.getElementById('btn-close-made'),
      icon: document.getElementById('icon-made'),
      rowsContainer: document.getElementById('made-rows-container'),
      detailsPane: document.getElementById('made-details-pane'),
      detailsTitle: document.getElementById('made-details-title'),
      detailsRole: document.getElementById('made-details-role'),
      detailsPlatform: document.getElementById('made-details-platform'),
      detailsFocus: document.getElementById('made-details-focus'),
      statusText: document.getElementById('made-status-text'),
      scrollThumb: document.getElementById('made-scroll-thumb'),
      scrollTrack: document.getElementById('made-scroll-track'),
      scrollUp: document.getElementById('made-scroll-up'),
      scrollDown: document.getElementById('made-scroll-down')
    };

    // Window 8: NOVA_INVEST.EXE (Project Detail)
    this.nova = {
      id: 'nova',
      window: document.getElementById('nova-invest-window'),
      tab: document.getElementById('tab-nova-invest'),
      titlebar: document.getElementById('nova-titlebar'),
      btnMinimize: document.getElementById('btn-minimize-nova'),
      btnMaximize: document.getElementById('btn-maximize-nova'),
      btnClose: document.getElementById('btn-close-nova'),
      contentScroll: document.getElementById('nova-content-scroll'),
      scrollThumb: document.getElementById('nova-scroll-thumb'),
      scrollTrack: document.getElementById('nova-scroll-track'),
      scrollUp: document.getElementById('nova-scroll-up'),
      scrollDown: document.getElementById('nova-scroll-down')
    };

    this.allWindows = [this.about, this.skills, this.resume, this.hello, this.recycle, this.myComputer, this.made, this.nova].filter(w => w && w.window);

    // No window active by default — ABOUT_ME.EXE will be opened by startup flow
    this.activeWindow = null;

    this.currentDrag = null;
    this.isScrollThumbDragging = false;

    this.initEvents();
    this.initAudio();
  }

  // ============================================================
  // AUDIO SYSTEM — Delegate to Centralized Win98SoundSystem
  // ============================================================
  initAudio() {
    // Centralized audio system is managed via window.soundManager (js/sound.js)
  }

  playSound(type, options = {}) {
    if (window.soundManager) {
      return window.soundManager.play(type, options);
    }
    return null;
  }

  // ============================================================
  // WINDOW CASCADING — authentic Windows-style positioning
  // ============================================================
  getNextCascadePosition(winObj) {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight - 44; // leave room for taskbar
    const winW = winObj.window.offsetWidth || 560;
    const winH = winObj.window.offsetHeight || 420;

    let x = this.cascadeBase.x + this.cascadeOffset.x;
    let y = this.cascadeBase.y + this.cascadeOffset.y;

    // If cascading would push window out of viewport, reset
    if (x + winW > maxW - 20 || y + winH > maxH - 20) {
      this.cascadeOffset = { x: 0, y: 0 };
      x = this.cascadeBase.x;
      y = this.cascadeBase.y;
    }

    // Advance cascade for next window
    this.cascadeOffset.x += this.cascadeStep;
    this.cascadeOffset.y += this.cascadeStep;

    // Final clamp to viewport
    x = Math.max(4, Math.min(x, Math.max(4, maxW - winW - 4)));
    y = Math.max(4, Math.min(y, Math.max(4, maxH - winH - 4)));

    return { x, y };
  }

  initEvents() {
    // Touch / Mobile check helper
    const isTouchOrMobile = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    };

    const iconMap = [
      { icon: this.myComputer.icon, win: this.myComputer },
      { icon: this.made.icon, win: this.made },
      { icon: this.resume.icon, win: this.resume },
      { icon: this.skills.icon, win: this.skills },
      { icon: this.hello.icon, win: this.hello },
      { icon: this.recycle.icon, win: this.recycle }
    ];

    // Desktop icon selection & launch
    this.icons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasSelected = icon.classList.contains('selected');
        this.icons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');

        // On touch screens / mobile, single tap opens window immediately
        if (isTouchOrMobile()) {
          const match = iconMap.find(m => m.icon === icon);
          if (match && match.win) {
            this.openWindow(match.win);
          }
        }
      });
    });

    if (this.desktopArea) {
      this.desktopArea.addEventListener('click', (e) => {
        if (e.target === this.desktopArea) {
          this.icons.forEach(i => i.classList.remove('selected'));
        }
      });
    }

    // Double-click icon handlers for desktop mouse users
    iconMap.forEach(item => {
      if (item.icon && item.win) {
        item.icon.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          this.openWindow(item.win);
        });
      }
    });


    // Row selection and Details Pane update in MADE window
    if (this.made && this.made.rowsContainer) {
      const projectMetadata = [
        {
          title: "Stock Trading App",
          role: "Product Designer",
          platform: "Android + iOS",
          focus: ["Information Architecture", "Interaction Design", "Market Data", "Portfolio", "Charts"]
        },
        {
          title: "Mutual Funds",
          role: "Lead Product Designer",
          platform: "Android + iOS • Web",
          focus: ["Mutual Fund Onboarding", "SIP Flow", "Fund Comparison", "Risk Profiler", "KYC"]
        },
        {
          title: "Option Chain",
          role: "Product Designer",
          platform: "Web & Mobile",
          focus: ["Option Greeks", "Strike Prices", "Real-Time P&L", "Fast Execution", "Multi-Leg Orders"]
        },
        {
          title: "WealthBasket",
          role: "Product Designer",
          platform: "Mobile App",
          focus: ["Thematic Investing", "Model Portfolios", "Rebalancing Engine", "Performance Analytics"]
        },
        {
          title: "Distributor Dashboard",
          role: "Internal Tool Designer",
          platform: "Desktop Web",
          focus: ["AUM Tracking", "Commission Reports", "Client Management", "Regulatory Compliance"]
        },
        {
          title: "AI Support Chatbot",
          role: "Product & Conversational Designer",
          platform: "Mobile & Web SDK",
          focus: ["Intent Mapping", "Fallback Flow", "Market FAQ", "Prompt Engineering", "Agent Handoff"]
        },
        {
          title: "Client Web Projects",
          role: "Web & UI/UX Designer",
          platform: "Responsive Web",
          focus: ["Brand Identity", "Marketing Websites", "Design Systems", "Animation", "SEO"]
        }
      ];

      const rows = Array.from(this.made.rowsContainer.querySelectorAll('.ProjectRow'));
      rows.forEach((row, idx) => {
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          this.playSound('ding');
          rows.forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');

          const meta = projectMetadata[idx];
          if (meta) {
            if (this.made.detailsTitle) this.made.detailsTitle.textContent = meta.title;
            if (this.made.detailsRole) this.made.detailsRole.textContent = meta.role;
            if (this.made.detailsPlatform) this.made.detailsPlatform.textContent = meta.platform;
            if (this.made.detailsFocus) {
              let focusHtml = '<div data-layer="FOCUS:" class="Focus" style="color: #808080; font-size: 10px; font-family: var(--win-font); font-weight: 700; letter-spacing: 0.50px; word-wrap: break-word">FOCUS:</div>';
              meta.focus.forEach(item => {
                focusHtml += `<div style="color: black; font-size: 10px; font-family: var(--win-font); font-weight: 400; word-wrap: break-word">${item}</div>`;
              });
              this.made.detailsFocus.innerHTML = focusHtml;
            }
          }
        });
      });
    }

    this.setupMadeScrollbar();

    // Double clicking row 0 (Stock Trading App) in MADE window opens NOVA_INVEST.EXE
    if (this.made && this.made.rowsContainer) {
      const row0 = this.made.rowsContainer.querySelector('.ProjectRow0');
      if (row0) {
        row0.addEventListener('dblclick', () => {
          this.openWindow(this.nova);
        });
        // Also support tap to open on mobile
        row0.addEventListener('touchend', (e) => {
          if (window.innerWidth <= 768) {
            this.openWindow(this.nova);
          }
        });
      }
    }

    this.setupNovaScrollbar();

    // Row selection in Recycle Bin
    if (this.recycle && this.recycle.rowsContainer) {
      const rows = Array.from(this.recycle.rowsContainer.querySelectorAll('[class^="FileRow"]'));
      rows.forEach(row => {
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          this.playSound('recycle');
          rows.forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');
        });
      });
    }

    // Empty Recycle Bin
    if (this.recycle && this.recycle.btnEmpty) {
      this.recycle.btnEmpty.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('recycle');
        if (confirm("Are you sure you want to permanently delete these 7 items?")) {
          if (this.recycle.rowsContainer) {
            this.recycle.rowsContainer.innerHTML = '<div style="padding: 16px; color: #808080; font-size: 11px; font-family: var(--win-font);">The Recycle Bin is empty.</div>';
          }
          if (this.recycle.statusText) {
            this.recycle.statusText.textContent = '0 object(s)  |  Clean slate achieved.';
          }
        }
      });
    }

    this.setupRecycleScrollbar();

    if (this.hello) {
      // 07. Ringin.mp3: Use for incoming/contact-style interactions (focus into contact input)
      const triggerRingin = () => {
        if (!this.hasTriggeredContactRingin) {
          this.hasTriggeredContactRingin = true;
          this.playSound('ringin');
        }
      };
      if (this.hello.inputName) this.hello.inputName.addEventListener('focus', triggerRingin);
      if (this.hello.inputEmail) this.hello.inputEmail.addEventListener('focus', triggerRingin);
      if (this.hello.inputMessage) this.hello.inputMessage.addEventListener('focus', triggerRingin);

      if (this.hello.btnSend) {
        this.hello.btnSend.addEventListener('click', (e) => {
          e.stopPropagation();
          const name = this.hello.inputName ? this.hello.inputName.value.trim() : '';
          const email = this.hello.inputEmail ? this.hello.inputEmail.value.trim() : '';
          const message = this.hello.inputMessage ? this.hello.inputMessage.value.trim() : '';
          
          if (!name && !email && !message) {
            this.playSound('notify');
            alert("Please fill in your details before sending.");
            return;
          }

          // 08. Ringout.mp3 -> User fills contact form -> User clicks Send -> Ringout.mp3
          this.playSound('ringout');

          // 10. Tada.mp3 -> Success confirmation -> Tada.mp3
          setTimeout(() => {
            this.playSound('tada');
            alert(`Thank you, ${name || 'friend'}!\n\nYour message has been sent to Naveen Kumar Pandey.`);
            if (this.hello.inputName) this.hello.inputName.value = '';
            if (this.hello.inputEmail) this.hello.inputEmail.value = '';
            if (this.hello.inputMessage) this.hello.inputMessage.value = '';
            this.hasTriggeredContactRingin = false;
          }, 700);
        });
      }
    }

    // Setup window controls for each window
    this.allWindows.forEach(winObj => {
      if (!winObj.window) return;

      // Bring to front on click / touch
      winObj.window.addEventListener('mousedown', () => {
        this.focusWindow(winObj);
      });
      winObj.window.addEventListener('touchstart', () => {
        this.focusWindow(winObj);
      }, { passive: true });

      // Minimize
      if (winObj.btnMinimize) {
        winObj.btnMinimize.addEventListener('click', (e) => {
          e.stopPropagation();
          this.minimizeWindow(winObj);
        });
      }

      // Maximize
      if (winObj.btnMaximize) {
        winObj.btnMaximize.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMaximizeWindow(winObj);
        });
      }

      // Close
      if (winObj.btnClose) {
        winObj.btnClose.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeWindow(winObj);
        });
      }

      // OK button closes window with chord confirmation
      if (winObj.btnOk) {
        winObj.btnOk.addEventListener('click', (e) => {
          e.stopPropagation();
          this.playSound('chord');
          this.closeWindow(winObj);
        });
      }

      // Taskbar tab toggle
      if (winObj.tab) {
        winObj.tab.addEventListener('click', (e) => {
          e.stopPropagation();
          if (winObj.window.style.display === 'none') {
            this.openWindow(winObj);
          } else if (this.activeWindow !== winObj) {
            this.focusWindow(winObj);
          } else {
            this.minimizeWindow(winObj);
          }
        });
      }

      // Dragging via titlebar
      this.setupDragging(winObj);
    });

    // Custom scrollbar behavior for RESUME.EXE
    this.setupResumeScrollbar();

    // Apply button for skills
    if (this.skills.btnApply) {
      this.skills.btnApply.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('ding');
        this.skills.btnApply.style.boxShadow = '1px 1px 0px #000000 inset, -1px -1px 0px #FFFFFF inset, 2px 2px 0px #808080 inset, -2px -2px 0px #DFDFDF inset';
        setTimeout(() => {
          this.skills.btnApply.style.boxShadow = '';
        }, 150);
      });
    }

    // Checkbox toggling for individual skills
    const skillItems = document.querySelectorAll('.SkillsWindow [data-layer^="skill-"]');
    skillItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const checkbox = item.querySelector('.CheckboxIcon');
        if (checkbox) {
          checkbox.classList.toggle('unchecked');
          this.playSound('ding');
        }
      });
    });

    // Start Menu Toggle
    if (this.startButton && this.startMenu) {
      this.startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStartMenu();
      });

      document.addEventListener('click', (e) => {
        if (this.startMenu && this.startMenu.style.display !== 'none') {
          if (!this.startMenu.contains(e.target) && !this.startButton.contains(e.target)) {
            this.closeStartMenu();
          }
        }
      });

      // Hook menu items — clicking meaningful menu items triggers 03. Ding.mp3
      const itemPrograms = document.getElementById('menu-item-programs');
      if (itemPrograms) {
        itemPrograms.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          if (this.made && this.made.window) this.openWindow(this.made);
        });
      }

      const itemDocuments = document.getElementById('menu-item-documents');
      if (itemDocuments) {
        itemDocuments.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          if (this.resume && this.resume.window) this.openWindow(this.resume);
        });
      }

      const itemSettings = document.getElementById('menu-item-settings');
      if (itemSettings) {
        itemSettings.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          if (this.skills && this.skills.window) this.openWindow(this.skills);
        });
      }

      const itemHelp = document.getElementById('menu-item-help');
      if (itemHelp) {
        itemHelp.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          if (this.about && this.about.window) this.openWindow(this.about);
        });
      }

      const itemFind = document.getElementById('menu-item-find');
      if (itemFind) {
        itemFind.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          if (this.hello && this.hello.window) this.openWindow(this.hello);
        });
      }

      const itemRun = document.getElementById('menu-item-run');
      if (itemRun) {
        itemRun.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          if (this.myComputer && this.myComputer.window) this.openWindow(this.myComputer);
        });
      }

      const itemShutdown = document.getElementById('menu-item-shutdown');
      if (itemShutdown) {
        itemShutdown.addEventListener('click', () => {
          this.playSound('ding');
          this.closeStartMenu();
          this.openShutdownDialog();
        });
      }
    }

    // Menu bar items across all windows
    document.querySelectorAll('.WindowMenu .MenuItem').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.querySelector('.Help') || item.textContent.trim().toLowerCase() === 'help') {
          this.playSound('notify');
        } else {
          this.playSound('ding');
        }
      });
    });

    // Setup Shut Down Dialog
    this.setupShutdownDialog();

    // ============================================================
    // STARTUP FLOW: Open ABOUT_ME.EXE (NOT Nova Invest)
    // ============================================================
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');
    const screenMap = {
      '3': this.skills,
      'skills': this.skills,
      '4': this.resume,
      'proof': this.resume,
      'resume': this.resume,
      '5': this.hello,
      'hello': this.hello,
      'contact': this.hello,
      '6': this.recycle,
      'oops': this.recycle,
      'recycle': this.recycle,
      '7': this.myComputer,
      'me': this.myComputer,
      'about': this.myComputer,
      '8': this.made,
      'projects': this.made,
      'made': this.made,
      '9': this.nova,
      'novainvest': this.nova,
      'nova': this.nova
    };

    if (screenParam === 'desktop' || screenParam === '2') {
      // Clean desktop — hide all windows
      this.allWindows.forEach(w => {
        if (w && w.window) w.window.style.display = 'none';
        if (w && w.tab) w.tab.style.display = 'none';
      });
    } else if (screenParam === 'start' || screenParam === 'start-menu' || screenParam === '10a') {
      this.allWindows.forEach(w => {
        if (w && w.window) w.window.style.display = 'none';
        if (w && w.tab) w.tab.style.display = 'none';
      });
      this.openStartMenu();
    } else if (screenParam === 'shutdown' || screenParam === '10b' || screenParam === 'shut-down') {
      this.allWindows.forEach(w => {
        if (w && w.window) w.window.style.display = 'none';
        if (w && w.tab) w.tab.style.display = 'none';
      });
      this.closeStartMenu();
      this.openShutdownDialog();
    } else if (screenMap[screenParam]) {
      this.allWindows.forEach(w => {
        if (w && w.window) w.window.style.display = 'none';
        if (w && w.tab) w.tab.style.display = 'none';
      });
      this.openWindow(screenMap[screenParam]);
    } else {
      // DEFAULT STARTUP: hide all windows first, then open ABOUT_ME.EXE
      this.allWindows.forEach(w => {
        if (w && w.window) w.window.style.display = 'none';
        if (w && w.tab) w.tab.style.display = 'none';
      });
      // Open About Me after 1400ms delay so The Microsoft Sound has established, then plays Chimes.mp3
      setTimeout(() => {
        this.openWindow(this.about);
      }, 1400);
    }

    // Live clock
    this.updateClock();
    setInterval(() => this.updateClock(), 30000);

    // Dynamic viewport resize handling
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  handleResize() {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight - 40;

    if (maxW <= 768) {
      return; // Fullscreen style on mobile
    }

    // Clamp open windows so they stay fully visible
    this.allWindows.forEach(winObj => {
      if (!winObj || !winObj.window) return;
      if (winObj.window.style.display === 'none') return;
      if (winObj.window.classList.contains('maximized')) return;

      const currentLeft = winObj.window.offsetLeft;
      const currentTop = winObj.window.offsetTop;
      const winW = winObj.window.offsetWidth;
      const winH = winObj.window.offsetHeight;

      const clampedLeft = Math.max(0, Math.min(currentLeft, Math.max(0, maxW - winW)));
      const clampedTop = Math.max(0, Math.min(currentTop, Math.max(0, maxH - winH)));

      winObj.window.style.left = `${clampedLeft}px`;
      winObj.window.style.top = `${clampedTop}px`;
    });
  }

  setupNovaScrollbar() {
    if (!this.nova) return;
    const { contentScroll, scrollThumb, scrollTrack, scrollUp, scrollDown } = this.nova;
    if (!contentScroll || !scrollThumb || !scrollTrack) return;

    if (scrollUp) {
      scrollUp.addEventListener('click', (e) => {
        e.stopPropagation();
        contentScroll.scrollTop -= 50;
      });
    }

    if (scrollDown) {
      scrollDown.addEventListener('click', (e) => {
        e.stopPropagation();
        contentScroll.scrollTop += 50;
      });
    }

    const updateThumb = () => {
      const scrollMax = contentScroll.scrollHeight - contentScroll.clientHeight;
      if (scrollMax <= 0) {
        scrollThumb.style.top = '4px';
        return;
      }
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = 80;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;
      const ratio = contentScroll.scrollTop / scrollMax;
      scrollThumb.style.top = `${4 + ratio * availableTrack}px`;
    };

    contentScroll.addEventListener('scroll', updateThumb);

    let isDragging = false;
    let startY = 0;
    let startTop = 4;

    scrollThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startTop = parseFloat(scrollThumb.style.top) || 4;
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = 80;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;

      let newTop = Math.max(4, Math.min(4 + availableTrack, startTop + deltaY));
      scrollThumb.style.top = `${newTop}px`;

      const ratio = (newTop - 4) / availableTrack;
      const scrollMax = contentScroll.scrollHeight - contentScroll.clientHeight;
      contentScroll.scrollTop = ratio * scrollMax;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  setupMadeScrollbar() {
    if (!this.made) return;
    const { rowsContainer, scrollThumb, scrollTrack, scrollUp, scrollDown } = this.made;
    if (!rowsContainer || !scrollThumb || !scrollTrack) return;

    if (scrollUp) {
      scrollUp.addEventListener('click', (e) => {
        e.stopPropagation();
        rowsContainer.scrollTop -= 30;
      });
    }

    if (scrollDown) {
      scrollDown.addEventListener('click', (e) => {
        e.stopPropagation();
        rowsContainer.scrollTop += 30;
      });
    }

    rowsContainer.addEventListener('scroll', () => {
      const scrollMax = rowsContainer.scrollHeight - rowsContainer.clientHeight;
      if (scrollMax <= 0) return;
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = 52;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;
      const ratio = rowsContainer.scrollTop / scrollMax;
      scrollThumb.style.top = `${4 + ratio * availableTrack}px`;
    });
  }

  setupRecycleScrollbar() {
    if (!this.recycle) return;
    const { rowsContainer, scrollThumb, scrollTrack, scrollUp, scrollDown } = this.recycle;
    if (!rowsContainer || !scrollThumb || !scrollTrack) return;

    if (scrollUp) {
      scrollUp.addEventListener('click', (e) => {
        e.stopPropagation();
        rowsContainer.scrollTop -= 30;
      });
    }

    if (scrollDown) {
      scrollDown.addEventListener('click', (e) => {
        e.stopPropagation();
        rowsContainer.scrollTop += 30;
      });
    }

    rowsContainer.addEventListener('scroll', () => {
      const scrollMax = rowsContainer.scrollHeight - rowsContainer.clientHeight;
      if (scrollMax <= 0) return;
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = scrollThumb.clientHeight;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;
      const ratio = rowsContainer.scrollTop / scrollMax;
      scrollThumb.style.top = `${ratio * availableTrack}px`;
    });
  }

  setupResumeScrollbar() {
    const { docArea, scrollThumb, scrollTrack, scrollUp, scrollDown } = this.resume;
    if (!docArea || !scrollThumb || !scrollTrack) return;

    if (scrollUp) {
      scrollUp.addEventListener('click', (e) => {
        e.stopPropagation();
        docArea.scrollTop -= 40;
      });
    }

    if (scrollDown) {
      scrollDown.addEventListener('click', (e) => {
        e.stopPropagation();
        docArea.scrollTop += 40;
      });
    }

    docArea.addEventListener('scroll', () => {
      const scrollMax = docArea.scrollHeight - docArea.clientHeight;
      if (scrollMax <= 0) return;
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = scrollThumb.clientHeight;
      const availableTrack = trackHeight - thumbHeight;
      const currentScrollRatio = docArea.scrollTop / scrollMax;
      const thumbTop = currentScrollRatio * availableTrack;
      scrollThumb.style.top = `${thumbTop}px`;
    });

    let thumbStartY = 0;
    let thumbStartTop = 0;

    const onThumbMouseMove = (e) => {
      if (!this.isScrollThumbDragging) return;
      const deltaY = e.clientY - thumbStartY;
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = scrollThumb.clientHeight;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;

      let newTop = thumbStartTop + deltaY;
      newTop = Math.max(0, Math.min(newTop, availableTrack));
      scrollThumb.style.top = `${newTop}px`;

      const scrollMax = docArea.scrollHeight - docArea.clientHeight;
      docArea.scrollTop = (newTop / availableTrack) * scrollMax;
    };

    const onThumbMouseUp = () => {
      this.isScrollThumbDragging = false;
      document.removeEventListener('mousemove', onThumbMouseMove);
      document.removeEventListener('mouseup', onThumbMouseUp);
    };

    scrollThumb.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.isScrollThumbDragging = true;
      thumbStartY = e.clientY;
      thumbStartTop = scrollThumb.offsetTop;
      document.addEventListener('mousemove', onThumbMouseMove);
      document.addEventListener('mouseup', onThumbMouseUp);
    });

    scrollTrack.addEventListener('click', (e) => {
      if (e.target === scrollThumb) return;
      const rect = scrollTrack.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const trackHeight = scrollTrack.clientHeight;
      const thumbHeight = scrollThumb.clientHeight;
      const availableTrack = trackHeight - thumbHeight;
      if (availableTrack <= 0) return;

      const targetRatio = Math.max(0, Math.min((clickY - thumbHeight / 2) / availableTrack, 1));
      const scrollMax = docArea.scrollHeight - docArea.clientHeight;
      docArea.scrollTop = targetRatio * scrollMax;
    });
  }

  // ============================================================
  // WINDOW FOCUS — active/inactive title bar states
  // ============================================================
  focusWindow(winObj) {
    if (!winObj || !winObj.window) return;
    this.highestZIndex++;
    winObj.window.style.zIndex = this.highestZIndex;

    // Set ALL windows to inactive
    this.allWindows.forEach(w => {
      if (w.titlebar) {
        w.titlebar.classList.add('inactive');
        w.titlebar.style.background = '';
      }
      if (w.tab) {
        w.tab.classList.remove('active');
      }
    });

    // Set clicked window to active
    if (winObj.titlebar) {
      winObj.titlebar.classList.remove('inactive');
      winObj.titlebar.style.background = '';
    }
    if (winObj.tab) {
      winObj.tab.classList.add('active');
    }

    this.activeWindow = winObj;
  }

  // ============================================================
  // WINDOW OPEN — with cascading position
  // ============================================================
  openWindow(winObj) {
    if (!winObj || !winObj.window) return;

    const wasHidden = winObj.window.style.display === 'none';

    winObj.window.style.display = 'inline-flex';
    if (winObj.tab) {
      winObj.tab.style.display = 'inline-flex';
    }

    // Apply cascade position only for newly opened windows (not mobile)
    if (wasHidden && window.innerWidth > 768 && !winObj.window.classList.contains('maximized')) {
      const pos = this.getNextCascadePosition(winObj);
      winObj.window.style.left = `${pos.x}px`;
      winObj.window.style.top = `${pos.y}px`;
    }

    this.focusWindow(winObj);

    if (wasHidden) {
      if (winObj === this.recycle) {
        this.playSound('recycle'); // 06. Recycle.mp3: Use specifically for the Oops / Recycle Bin experience
      } else {
        this.playSound('chimes'); // 01. Chimes.mp3: Use when a major application/window opens
      }
    }
  }

  minimizeWindow(winObj) {
    if (!winObj || !winObj.window) return;
    winObj.window.style.display = 'none';
    if (winObj.tab) {
      winObj.tab.classList.remove('active');
    }
    if (this.activeWindow === winObj) {
      this.activeWindow = null;
      const otherWin = this.allWindows.find(w => w !== winObj && w.window && w.window.style.display !== 'none');
      if (otherWin) {
        this.focusWindow(otherWin);
      }
    }
  }

  toggleMaximizeWindow(winObj) {
    if (!winObj || !winObj.window) return;
    winObj.window.classList.toggle('maximized');
    this.focusWindow(winObj);
  }

  closeWindow(winObj) {
    if (!winObj || !winObj.window) return;
    winObj.window.style.display = 'none';
    if (winObj.tab) {
      winObj.tab.style.display = 'none';
      winObj.tab.classList.remove('active');
    }
    if (this.activeWindow === winObj) {
      this.activeWindow = null;
      const otherWin = this.allWindows.find(w => w !== winObj && w.window && w.window.style.display !== 'none');
      if (otherWin) {
        this.focusWindow(otherWin);
      }
    }
  }

  setupDragging(winObj) {
    if (!winObj.titlebar || !winObj.window) return;

    const startDrag = (clientX, clientY) => {
      if (winObj.window.classList.contains('maximized')) return;
      if (window.innerWidth <= 768) return; // Full bleed on mobile

      this.focusWindow(winObj);

      this.currentDrag = {
        window: winObj.window,
        initialLeft: winObj.window.offsetLeft,
        initialTop: winObj.window.offsetTop,
        startX: clientX,
        startY: clientY
      };

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchend', this.onTouchEnd);
    };

    winObj.titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ButtonWindowButton') || e.target.closest('.MenuItem')) return;
      startDrag(e.clientX, e.clientY);
    });

    winObj.titlebar.addEventListener('touchstart', (e) => {
      if (e.target.closest('.ButtonWindowButton') || e.target.closest('.MenuItem')) return;
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  onMouseMove = (e) => {
    if (!this.currentDrag) return;
    this.moveCurrentDrag(e.clientX, e.clientY);
  };

  onTouchMove = (e) => {
    if (!this.currentDrag || !e.touches || !e.touches[0]) return;
    e.preventDefault();
    this.moveCurrentDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  moveCurrentDrag(clientX, clientY) {
    const deltaX = clientX - this.currentDrag.startX;
    const deltaY = clientY - this.currentDrag.startY;

    let x = this.currentDrag.initialLeft + deltaX;
    let y = this.currentDrag.initialTop + deltaY;

    const areaWidth = this.desktopArea ? this.desktopArea.clientWidth : window.innerWidth;
    const areaHeight = this.desktopArea ? this.desktopArea.clientHeight : (window.innerHeight - 40);

    x = Math.max(0, Math.min(x, Math.max(0, areaWidth - this.currentDrag.window.offsetWidth)));
    y = Math.max(0, Math.min(y, Math.max(0, areaHeight - this.currentDrag.window.offsetHeight)));

    this.currentDrag.window.style.left = `${x}px`;
    this.currentDrag.window.style.top = `${y}px`;
  }

  onMouseUp = () => {
    this.endDrag();
  };

  onTouchEnd = () => {
    this.endDrag();
  };

  endDrag() {
    this.currentDrag = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  makeDraggable(element, handle) {
    if (!element || !handle) return;

    const startDrag = (clientX, clientY) => {
      if (window.innerWidth <= 768) return; // Centered modal on mobile
      const initialLeft = element.offsetLeft;
      const initialTop = element.offsetTop;

      const onMove = (moveEvent) => {
        const cx = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const cy = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
        const deltaX = cx - clientX;
        const deltaY = cy - clientY;

        const maxW = window.innerWidth;
        const maxH = window.innerHeight - 40;
        let x = Math.max(0, Math.min(initialLeft + deltaX, maxW - element.offsetWidth));
        let y = Math.max(0, Math.min(initialTop + deltaY, maxH - element.offsetHeight));

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.transform = 'none';
      };

      const onEnd = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    };

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ButtonWindowButton') || e.target.closest('.MenuItem')) return;
      startDrag(e.clientX, e.clientY);
    });

    handle.addEventListener('touchstart', (e) => {
      if (e.target.closest('.ButtonWindowButton') || e.target.closest('.MenuItem')) return;
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  toggleStartMenu() {
    if (!this.startMenu) return;
    if (this.startMenu.style.display === 'none' || !this.startMenu.style.display) {
      this.openStartMenu();
    } else {
      this.closeStartMenu();
    }
  }

  openStartMenu() {
    if (!this.startMenu) return;
    // Fix positioning: anchored directly above taskbar, not hardcoded top
    this.startMenu.style.top = 'auto';
    this.startMenu.style.bottom = '42px';
    this.startMenu.style.display = 'inline-flex';
    this.startMenu.style.zIndex = '10002';
    if (this.startButton) {
      this.startButton.classList.add('pressed');
    }
    this.playSound('start'); // 09. Start.mp3: Use when the Windows Start Menu opens
  }

  closeStartMenu() {
    if (!this.startMenu) return;
    this.startMenu.style.display = 'none';
    if (this.startButton) {
      this.startButton.classList.remove('pressed');
    }
  }

  // ============================================================
  // SHUTDOWN DIALOG — portfolio-safe with funny options
  // ============================================================
  setupShutdownDialog() {
    if (!this.shutdownDialog) return;
    const titlebar = document.getElementById('shutdown-titlebar');
    const btnClose = document.getElementById('btn-close-shutdown');
    const btnCancel = document.getElementById('btn-cancel-shutdown');
    const btnOk = document.getElementById('btn-ok-shutdown');
    const btnHelp = document.getElementById('btn-help-shutdown');

    if (titlebar) {
      this.makeDraggable(this.shutdownDialog, titlebar);
    }

    const closeHandler = () => {
      this.shutdownDialog.style.display = 'none';
    };

    if (btnClose) btnClose.addEventListener('click', closeHandler);
    if (btnCancel) btnCancel.addEventListener('click', closeHandler);

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        this.playSound('notify'); // 05. Notify.mp3: Windows-style informational/status messages
        alert("Why would you want to leave? There's so much more to explore!\n\nTip: Try clicking around the desktop — you might find something fun.");
      });
    }

    // Radio selection logic
    const radios = [
      document.getElementById('radio-stand-by'),
      document.getElementById('radio-shut-down'),
      document.getElementById('radio-restart'),
      document.getElementById('radio-restart-msdos')
    ].filter(Boolean);

    const selectRadio = (selected) => {
      radios.forEach(r => {
        const svg = r.querySelector('svg g');
        if (!svg) return;
        const existingDot = svg.querySelector('.radio-dot');
        if (r === selected) {
          if (!existingDot) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '6');
            circle.setAttribute('cy', '7');
            circle.setAttribute('r', '2');
            circle.setAttribute('fill', 'black');
            circle.classList.add('radio-dot');
            svg.appendChild(circle);
          }
        } else {
          if (existingDot) existingDot.remove();
        }
      });
      this.playSound('ding'); // 03. Ding.mp3: standard important Windows UI interactions
    };

    radios.forEach(r => {
      r.addEventListener('click', () => selectRadio(r));
    });

    if (btnOk) {
      btnOk.addEventListener('click', () => {
        this.shutdownDialog.style.display = 'none';

        // Check which radio is selected
        const restartThemeRadio = document.getElementById('radio-restart-msdos');
        const isRestartTheme = restartThemeRadio && restartThemeRadio.querySelector('.radio-dot');

        const goBackRadio = document.getElementById('radio-restart');
        const isGoBack = goBackRadio && goBackRadio.querySelector('.radio-dot');

        if (isRestartTheme) {
          // 04. Logoff.mp3: Use when the portfolio session reaches its final/session-complete state
          this.playSound('logoff');
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 1400);
        } else if (isGoBack) {
          // 02. Chord.mp3: Use for important system-level confirmations
          this.playSound('chord');
        } else {
          // "Keep exploring" or "Stay here a little longer"
          this.playSound('chord');
        }
      });
    }
  }

  openShutdownDialog() {
    if (!this.shutdownDialog) return;
    this.shutdownDialog.style.display = 'inline-flex';
    // Center in viewport
    this.shutdownDialog.style.left = `${Math.max(10, (window.innerWidth - 360) / 2)}px`;
    this.shutdownDialog.style.top = `${Math.max(10, (window.innerHeight - 260) / 2)}px`;
    this.highestZIndex += 1;
    this.shutdownDialog.style.zIndex = this.highestZIndex;
    this.playSound('notify'); // 05. Notify.mp3: opening status/dialog
  }

  updateClock() {
    const clockEl = document.getElementById('taskbar-clock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }
}

// BIOS transition callback: transition to Desktop
window.onBiosContinue = function() {
  const biosScreen = document.getElementById('bios-screen');
  const desktop = document.getElementById('desktop-environment');

  document.body.classList.add('desktop-mode');
  if (biosScreen) {
    biosScreen.style.display = 'none';
  }
  if (desktop) {
    desktop.style.display = 'block';
  }
  if (!window.win95) {
    window.win95 = new Window95Manager();
  }
};

// If desktop-mode is already set or URL requested desktop directly, initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('desktop-mode') || window.location.search.includes('desktop') || window.location.search.includes('screen=') || window.location.search.includes('start')) {
      window.onBiosContinue();
    }
  });
} else {
  if (document.body.classList.contains('desktop-mode') || window.location.search.includes('desktop') || window.location.search.includes('screen=') || window.location.search.includes('start')) {
    window.onBiosContinue();
  }
}
