import React, { useState, useEffect, useRef, useCallback } from 'react';
import BiosScreen from './components/BiosScreen';
import DesktopIcon from './components/DesktopIcon';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import ShutDownDialog from './components/ShutDownDialog';
import {
  MyComputerIcon,
  MadeIcon,
  ProofIcon,
  SkillsIcon,
  HelloIcon,
  OopsIcon,
  ProgramIconSmall,
  FolderIconSmall,
  FileIconSmall,
  RecycleIconSmall,
} from './components/Icons';

import AboutWindow from './windows/AboutWindow';
import SkillsWindow from './windows/SkillsWindow';
import ResumeWindow from './windows/ResumeWindow';
import HelloWindow from './windows/HelloWindow';
import RecycleBinWindow from './windows/RecycleBinWindow';
import MyComputerWindow from './windows/MyComputerWindow';
import MadeWindow from './windows/MadeWindow';
import NovaInvestWindow from './windows/NovaInvestWindow';
import DesktopContextMenu from './components/DesktopContextMenu';

import { useSound } from '../../context/SoundContext';

const INITIAL_DESKTOP_ICONS = [
  {
    id: 'me',
    domId: 'icon-me',
    name: 'Me.exe',
    defaultName: 'Me.exe',
    iconType: 'myComputer',
    windowKey: 'myComputer',
    x: 24,
    y: 20,
  },
  {
    id: 'made',
    domId: 'icon-made',
    name: 'Made',
    defaultName: 'Made',
    iconType: 'made',
    windowKey: 'made',
    x: 24,
    y: 104,
  },
  {
    id: 'proof',
    domId: 'icon-proof',
    name: 'Proof',
    defaultName: 'Proof',
    iconType: 'proof',
    windowKey: 'resume',
    x: 24,
    y: 188,
  },
  {
    id: 'skills',
    domId: 'icon-skills',
    name: 'Skills',
    defaultName: 'Skills',
    iconType: 'skills',
    windowKey: 'skills',
    x: 24,
    y: 272,
  },
  {
    id: 'hello',
    domId: 'icon-hello',
    name: 'Hello',
    defaultName: 'Hello',
    iconType: 'hello',
    windowKey: 'hello',
    x: 24,
    y: 356,
  },
  {
    id: 'oops',
    domId: 'icon-oops',
    name: 'Oops',
    defaultName: 'Oops',
    iconType: 'oops',
    windowKey: 'recycle',
    x: 24,
    y: 440,
  },
];

const ICON_COMPONENT_MAP = {
  myComputer: <MyComputerIcon />,
  made: <MadeIcon />,
  proof: <ProofIcon />,
  skills: <SkillsIcon />,
  hello: <HelloIcon />,
  oops: <OopsIcon />,
};

const INITIAL_WINDOWS = {
  about: {
    id: 'about',
    title: 'ABOUT_ME.EXE',
    icon: <ProgramIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 380, y: 140 },
    zIndex: 30,
  },
  skills: {
    id: 'skills',
    title: 'SKILLS.EXE',
    icon: <FolderIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 340, y: 100 },
    zIndex: 30,
  },
  resume: {
    id: 'resume',
    title: 'RESUME.EXE',
    icon: <FolderIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 320, y: 50 },
    zIndex: 30,
  },
  hello: {
    id: 'hello',
    title: 'HELLO.EXE',
    icon: <FolderIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 360, y: 90 },
    zIndex: 30,
  },
  recycle: {
    id: 'recycle',
    title: 'Recycle Bin',
    icon: <RecycleIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 300, y: 120 },
    zIndex: 30,
  },
  myComputer: {
    id: 'myComputer',
    title: 'System Properties',
    icon: <ProgramIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 380, y: 80 },
    zIndex: 30,
  },
  made: {
    id: 'made',
    title: 'MADE',
    icon: <FolderIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 330, y: 80 },
    zIndex: 30,
  },
  nova: {
    id: 'nova',
    title: 'NOVA_INVEST.EXE',
    icon: <FolderIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 200, y: 30 },
    zIndex: 30,
  },
};

export default function Windows98Theme() {
  const { playSound, unlockAudio } = useSound();

  const [biosDone, setBiosDone] = useState(() => {
    try {
      return sessionStorage.getItem('win98_bios_done') === 'true';
    } catch {
      return false;
    }
  });
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isShutDownOpen, setIsShutDownOpen] = useState(false);
  const [desktopIcons, setDesktopIcons] = useState(INITIAL_DESKTOP_ICONS);
  const [renamingIconId, setRenamingIconId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const highestZRef = useRef(35);
  const cascadeOffsetRef = useRef({ x: 0, y: 0 });
  const cascadeStep = 28;

  // Calculate next cascading position for desktop window
  const getNextCascadePosition = useCallback((defaultPos = { x: 100, y: 100 }) => {
    if (window.innerWidth <= 768) {
      return { x: 0, y: 0 };
    }
    const maxW = window.innerWidth;
    const maxH = window.innerHeight - 44;
    const winW = 600;
    const winH = 460;

    let x = defaultPos.x + cascadeOffsetRef.current.x;
    let y = defaultPos.y + cascadeOffsetRef.current.y;

    if (x + winW > maxW - 20 || y + winH > maxH - 20) {
      cascadeOffsetRef.current = { x: 0, y: 0 };
      x = defaultPos.x;
      y = defaultPos.y;
    }

    cascadeOffsetRef.current.x += cascadeStep;
    cascadeOffsetRef.current.y += cascadeStep;

    x = Math.max(4, Math.min(x, Math.max(4, maxW - winW - 4)));
    y = Math.max(4, Math.min(y, Math.max(4, maxH - winH - 4)));

    return { x, y };
  }, []);

  // Window Focus Handler
  const focusWindow = useCallback((winKey) => {
    highestZRef.current += 1;
    const nextZ = highestZRef.current;

    setActiveWindowId(winKey);
    setWindows((prev) => {
      const current = prev[winKey];
      if (!current) return prev;
      return {
        ...prev,
        [winKey]: {
          ...current,
          zIndex: nextZ,
          isMinimized: false,
        },
      };
    });
  }, []);

  // Open Window Handler
  const openWindow = useCallback(
    (winKey) => {
      if (typeof unlockAudio === 'function') unlockAudio();
      setWindows((prev) => {
        const current = prev[winKey];
        if (!current) return prev;

        const isNewlyOpening = !current.isOpen;
        highestZRef.current += 1;
        const nextZ = highestZRef.current;

        let nextPos = current.position;
        if (isNewlyOpening && !current.isMaximized) {
          nextPos = getNextCascadePosition(current.position);
        }

        if (isNewlyOpening) {
          if (winKey === 'recycle') {
            playSound('recycle');
          } else {
            playSound('chimes');
          }
        }

        return {
          ...prev,
          [winKey]: {
            ...current,
            isOpen: true,
            isMinimized: false,
            position: nextPos,
            zIndex: nextZ,
          },
        };
      });

      setActiveWindowId(winKey);
    },
    [getNextCascadePosition, playSound, unlockAudio]
  );

  // Close Window Handler
  const closeWindow = useCallback(
    (winKey) => {
      playSound('chord');
      setWindows((prev) => {
        const current = prev[winKey];
        if (!current) return prev;
        return {
          ...prev,
          [winKey]: {
            ...current,
            isOpen: false,
            isMinimized: false,
          },
        };
      });

      if (activeWindowId === winKey) {
        // Find remaining highest open window to focus
        setWindows((prev) => {
          const openKeys = Object.keys(prev).filter(
            (k) => k !== winKey && prev[k].isOpen && !prev[k].isMinimized
          );
          if (openKeys.length > 0) {
            const topKey = openKeys.sort((a, b) => prev[b].zIndex - prev[a].zIndex)[0];
            setActiveWindowId(topKey);
          } else {
            setActiveWindowId(null);
          }
          return prev;
        });
      }
    },
    [activeWindowId, playSound]
  );

  // Minimize Window Handler
  const minimizeWindow = useCallback((winKey) => {
    setWindows((prev) => {
      const current = prev[winKey];
      if (!current) return prev;
      return {
        ...prev,
        [winKey]: {
          ...current,
          isMinimized: true,
        },
      };
    });
    setActiveWindowId((prevActive) => (prevActive === winKey ? null : prevActive));
  }, []);

  // Maximize / Restore Window Handler
  const toggleMaximize = useCallback((winKey) => {
    setWindows((prev) => {
      const current = prev[winKey];
      if (!current) return prev;
      return {
        ...prev,
        [winKey]: {
          ...current,
          isMaximized: !current.isMaximized,
        },
      };
    });
  }, []);

  // Taskbar Tab Click Handler
  const handleTaskbarTabClick = useCallback(
    (winKey) => {
      playSound('chord');
      const win = windows[winKey];
      if (!win) return;

      if (win.isMinimized) {
        focusWindow(winKey);
      } else if (activeWindowId === winKey) {
        minimizeWindow(winKey);
      } else {
        focusWindow(winKey);
      }
    },
    [windows, activeWindowId, focusWindow, minimizeWindow, playSound]
  );

  // BIOS Complete Handler
  const handleBiosComplete = useCallback(() => {
    setBiosDone(true);
    try {
      sessionStorage.setItem('win98_bios_done', 'true');
    } catch {}
    // Play startup chime right as desktop loads
    setTimeout(() => {
      playSound('startup');
    }, 450);

    // Check URL parameters for direct window launch (?screen=skills, etc.)
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');

    // Auto open ABOUT_ME.EXE after ~1400ms delay, unless a specific screen was requested
    setTimeout(() => {
      if (screenParam) {
        const paramMap = {
          about: 'about',
          me: 'about',
          skills: 'skills',
          resume: 'resume',
          proof: 'resume',
          hello: 'hello',
          contact: 'hello',
          oops: 'recycle',
          recycle: 'recycle',
          made: 'made',
          projects: 'made',
          nova: 'nova',
          mycomputer: 'myComputer',
        };
        const target = paramMap[screenParam.toLowerCase()];
        if (target) {
          openWindow(target);
          return;
        }
      }

      // Default: auto open ABOUT_ME.EXE. NOVA_INVEST.EXE must NOT auto open.
      openWindow('about');
    }, 1400);
  }, [openWindow, playSound]);

  // Restart BIOS / Reboot
  const handleRestartBios = useCallback(() => {
    setIsShutDownOpen(false);
    setIsStartMenuOpen(false);
    setWindows(INITIAL_WINDOWS);
    setActiveWindowId(null);
    setDesktopIcons(INITIAL_DESKTOP_ICONS);
    setSelectedIcon(null);
    setRenamingIconId(null);
    setContextMenu(null);
    try {
      sessionStorage.removeItem('win98_bios_done');
    } catch {}
    setBiosDone(false);
  }, []);

  useEffect(() => {
    if (biosDone) {
      document.body.classList.remove('bios-mode');
      document.body.classList.add('desktop-mode');
    } else {
      document.body.classList.remove('desktop-mode');
      document.body.classList.add('bios-mode');
    }
  }, [biosDone]);

  // Global click-outside listener
  useEffect(() => {
    const handleGlobalMouseDown = (e) => {
      // 1. Context menu click outside
      if (contextMenu) {
        const ctxEl = document.getElementById('desktop-context-menu');
        if (!ctxEl || !ctxEl.contains(e.target)) {
          setContextMenu(null);
        }
      }

      // 2. Start menu click outside
      if (isStartMenuOpen) {
        const startMenuEl = document.getElementById('start-menu');
        const startBtnEl = document.getElementById('start-button');
        if (startMenuEl && startMenuEl.contains(e.target)) {
          return;
        }
        if (startBtnEl && startBtnEl.contains(e.target)) {
          return;
        }
        setIsStartMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleGlobalMouseDown, true);
    return () => window.removeEventListener('mousedown', handleGlobalMouseDown, true);
  }, [isStartMenuOpen, contextMenu]);

  // Global keyboard shortcuts (Escape, Delete, F2, Enter)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (contextMenu) setContextMenu(null);
        if (isStartMenuOpen) setIsStartMenuOpen(false);
        if (renamingIconId) setRenamingIconId(null);
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIcon && !renamingIconId) {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          playSound('recycle');
          setDesktopIcons((prev) => prev.filter((item) => item.id !== selectedIcon));
          setSelectedIcon(null);
        }
      }

      if (e.key === 'F2' && selectedIcon && !renamingIconId) {
        e.preventDefault();
        setRenamingIconId(selectedIcon);
      }

      if (e.key === 'Enter' && selectedIcon && !renamingIconId && !isStartMenuOpen) {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          const target = desktopIcons.find((i) => i.id === selectedIcon);
          if (target) {
            openWindow(target.windowKey);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [contextMenu, isStartMenuOpen, selectedIcon, renamingIconId, desktopIcons, openWindow, playSound]);

  // Desktop click to clear selections
  const handleDesktopClick = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('DesktopArea')) {
      setSelectedIcon(null);
      setIsStartMenuOpen(false);
      setContextMenu(null);
      setRenamingIconId(null);
    }
  };

  // Open windows array for Taskbar tabs
  const openWindowsList = Object.keys(windows)
    .filter((k) => windows[k].isOpen)
    .map((k) => ({
      id: k,
      title: windows[k].title,
      icon: windows[k].icon,
      isActive: activeWindowId === k && !windows[k].isMinimized,
      isMinimized: windows[k].isMinimized,
    }));

  return (
    <div
      className="Windows98Experience"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#008080',
        userSelect: 'none',
      }}
    >
      {/* 1. BIOS Startup Screen */}
      {!biosDone && <BiosScreen onComplete={handleBiosComplete} />}

      {/* 2. Desktop Environment */}
      <div
        id="desktop-environment"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: biosDone ? 'block' : 'none',
        }}
      >
        <div
          data-layer="desktop-area"
          className="DesktopArea"
          onClick={handleDesktopClick}
          style={{
            width: '100%',
            height: 'calc(100% - 38px)',
            position: 'relative',
            overflow: 'hidden',
            background: '#008080',
          }}
        >
          {/* Desktop Icons (Draggable, Selectable, Renamable, Deletable) */}
          {desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              id={icon.domId}
              label={icon.name}
              icon={ICON_COMPONENT_MAP[icon.iconType]}
              position={{ x: icon.x, y: icon.y }}
              isSelected={selectedIcon === icon.id}
              isRenaming={renamingIconId === icon.id}
              onClick={() => {
                if (isStartMenuOpen) {
                  setIsStartMenuOpen(false);
                  openWindow(icon.windowKey);
                } else {
                  setSelectedIcon(icon.id);
                }
              }}
              onDoubleClick={() => openWindow(icon.windowKey)}
              onPositionChange={(pos) => {
                setDesktopIcons((prev) =>
                  prev.map((item) => (item.id === icon.id ? { ...item, x: pos.x, y: pos.y } : item))
                );
              }}
              onContextMenu={(e) => {
                setSelectedIcon(icon.id);
                setIsStartMenuOpen(false);
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  icon,
                });
              }}
              onRenameCommit={(newName) => {
                setDesktopIcons((prev) =>
                  prev.map((item) =>
                    item.id === icon.id ? { ...item, name: newName || item.defaultName } : item
                  )
                );
                setRenamingIconId(null);
              }}
              onRenameCancel={() => setRenamingIconId(null)}
            />
          ))}

          {/* Desktop Context Menu */}
          <DesktopContextMenu
            isOpen={!!contextMenu}
            x={contextMenu?.x || 0}
            y={contextMenu?.y || 0}
            icon={contextMenu?.icon}
            onOpen={(icon) => {
              openWindow(icon.windowKey);
              setContextMenu(null);
            }}
            onDelete={(icon) => {
              playSound('recycle');
              setDesktopIcons((prev) => prev.filter((item) => item.id !== icon.id));
              if (selectedIcon === icon.id) setSelectedIcon(null);
              setContextMenu(null);
            }}
            onRename={(icon) => {
              setRenamingIconId(icon.id);
              setContextMenu(null);
            }}
            onProperties={(icon) => {
              openWindow(icon.windowKey === 'myComputer' ? 'myComputer' : 'about');
              setContextMenu(null);
            }}
            onClose={() => setContextMenu(null)}
          />

          {/* Windows Layer */}
          {/* Window 1: ABOUT_ME.EXE */}
          <AboutWindow
            isOpen={windows.about.isOpen && !windows.about.isMinimized}
            isActive={activeWindowId === 'about'}
            isMaximized={windows.about.isMaximized}
            zIndex={windows.about.zIndex}
            position={windows.about.position}
            onFocus={() => focusWindow('about')}
            onMinimize={() => minimizeWindow('about')}
            onMaximize={() => toggleMaximize('about')}
            onClose={() => closeWindow('about')}
          />

          {/* Window 2: SKILLS.EXE */}
          <SkillsWindow
            isOpen={windows.skills.isOpen && !windows.skills.isMinimized}
            isActive={activeWindowId === 'skills'}
            isMaximized={windows.skills.isMaximized}
            zIndex={windows.skills.zIndex}
            position={windows.skills.position}
            onFocus={() => focusWindow('skills')}
            onMinimize={() => minimizeWindow('skills')}
            onMaximize={() => toggleMaximize('skills')}
            onClose={() => closeWindow('skills')}
          />

          {/* Window 3: RESUME.EXE */}
          <ResumeWindow
            isOpen={windows.resume.isOpen && !windows.resume.isMinimized}
            isActive={activeWindowId === 'resume'}
            isMaximized={windows.resume.isMaximized}
            zIndex={windows.resume.zIndex}
            position={windows.resume.position}
            onFocus={() => focusWindow('resume')}
            onMinimize={() => minimizeWindow('resume')}
            onMaximize={() => toggleMaximize('resume')}
            onClose={() => closeWindow('resume')}
          />

          {/* Window 4: HELLO.EXE */}
          <HelloWindow
            isOpen={windows.hello.isOpen && !windows.hello.isMinimized}
            isActive={activeWindowId === 'hello'}
            isMaximized={windows.hello.isMaximized}
            zIndex={windows.hello.zIndex}
            position={windows.hello.position}
            onFocus={() => focusWindow('hello')}
            onMinimize={() => minimizeWindow('hello')}
            onMaximize={() => toggleMaximize('hello')}
            onClose={() => closeWindow('hello')}
          />

          {/* Window 5: Recycle Bin / Oops */}
          <RecycleBinWindow
            isOpen={windows.recycle.isOpen && !windows.recycle.isMinimized}
            isActive={activeWindowId === 'recycle'}
            isMaximized={windows.recycle.isMaximized}
            zIndex={windows.recycle.zIndex}
            position={windows.recycle.position}
            onFocus={() => focusWindow('recycle')}
            onMinimize={() => minimizeWindow('recycle')}
            onMaximize={() => toggleMaximize('recycle')}
            onClose={() => closeWindow('recycle')}
          />

          {/* Window 6: My Computer / Me.exe */}
          <MyComputerWindow
            isOpen={windows.myComputer.isOpen && !windows.myComputer.isMinimized}
            isActive={activeWindowId === 'myComputer'}
            isMaximized={windows.myComputer.isMaximized}
            zIndex={windows.myComputer.zIndex}
            position={windows.myComputer.position}
            onFocus={() => focusWindow('myComputer')}
            onMinimize={() => minimizeWindow('myComputer')}
            onMaximize={() => toggleMaximize('myComputer')}
            onClose={() => closeWindow('myComputer')}
          />

          {/* Window 7: MADE (Projects) */}
          <MadeWindow
            isOpen={windows.made.isOpen && !windows.made.isMinimized}
            isActive={activeWindowId === 'made'}
            isMaximized={windows.made.isMaximized}
            zIndex={windows.made.zIndex}
            position={windows.made.position}
            onFocus={() => focusWindow('made')}
            onMinimize={() => minimizeWindow('made')}
            onMaximize={() => toggleMaximize('made')}
            onClose={() => closeWindow('made')}
            onOpenNova={() => openWindow('nova')}
          />

          {/* Window 8: NOVA_INVEST.EXE */}
          <NovaInvestWindow
            isOpen={windows.nova.isOpen && !windows.nova.isMinimized}
            isActive={activeWindowId === 'nova'}
            isMaximized={windows.nova.isMaximized}
            zIndex={windows.nova.zIndex}
            position={windows.nova.position}
            onFocus={() => focusWindow('nova')}
            onMinimize={() => minimizeWindow('nova')}
            onMaximize={() => toggleMaximize('nova')}
            onClose={() => closeWindow('nova')}
          />
        </div>

        {/* Start Menu */}
        <StartMenu
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onSelectItem={(key) => {
            if (key === 'shutdown') {
              setIsShutDownOpen(true);
            } else if (key === 'made') {
              openWindow('made');
            } else if (key === 'programs' || key === 'about') {
              openWindow('about');
            } else if (key === 'documents' || key === 'resume') {
              openWindow('resume');
            } else if (key === 'find') {
              openWindow('made');
            } else if (key === 'settings' || key === 'myComputer') {
              openWindow('myComputer');
            } else if (key === 'skills') {
              openWindow('skills');
            } else if (key === 'hello') {
              openWindow('hello');
            } else if (key === 'nova') {
              openWindow('nova');
            } else if (key === 'recycle') {
              openWindow('recycle');
            } else if (key === 'help') {
              openWindow('hello');
            } else if (key === 'run') {
              openWindow('skills');
            }
          }}
        />

        {/* Shut Down Dialog */}
        <ShutDownDialog
          isOpen={isShutDownOpen}
          onClose={() => setIsShutDownOpen(false)}
          onRestart={handleRestartBios}
        />

        {/* Taskbar */}
        <Taskbar
          openWindows={openWindowsList}
          isStartMenuOpen={isStartMenuOpen}
          onToggleStart={() => {
            playSound('start');
            setIsStartMenuOpen((prev) => !prev);
          }}
          onWindowTabClick={handleTaskbarTabClick}
        />
      </div>
    </div>
  );
}
