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
import OneStepPrintWindow from './windows/OneStepPrintWindow';
import DesktopContextMenu from './components/DesktopContextMenu';

// New Games & Shell Apps
import MinesweeperWindow, { MinesweeperIconSmall } from './windows/games/MinesweeperWindow';
import SolitaireWindow, { SolitaireIconSmall } from './windows/games/SolitaireWindow';
import FreeCellWindow, { FreeCellIconSmall } from './windows/games/FreeCellWindow';
import ChessWindow, { ChessIconSmall } from './windows/games/ChessWindow';
import PaintWindow, { PaintIconSmall } from './windows/apps/PaintWindow';
import NotepadWindow, { NotepadIconSmall } from './windows/apps/NotepadWindow';
import CalculatorWindow, { CalculatorIconSmall } from './windows/apps/CalculatorWindow';
import InternetExplorerWindow, { InternetExplorerIconSmall } from './windows/apps/InternetExplorerWindow';
import MediaPlayerWindow, { MediaPlayerIconSmall } from './windows/apps/MediaPlayerWindow';
import WinampWindow, { WinampIconSmall } from './windows/apps/WinampWindow';
import { Win98AudioProvider } from './context/Win98AudioContext';

import {
  MinesweeperIcon,
  SolitaireIcon,
  FreeCellIcon,
  ChessIcon,
  PaintIcon,
  NotepadIcon,
  CalculatorIcon,
  InternetExplorerIcon,
  MediaPlayerIcon,
  WinampIcon,
} from './components/Icons';

import { useSound } from '../../context/SoundContext';

import WelcomeDialog from './components/WelcomeDialog';

const INITIAL_DESKTOP_ICONS = [
  // Column 1 (x: 16) - Portfolio
  {
    id: 'me',
    domId: 'icon-me',
    name: 'Me.exe',
    defaultName: 'Me.exe',
    iconType: 'myComputer',
    windowKey: 'myComputer',
    x: 16,
    y: 16,
  },
  {
    id: 'made',
    domId: 'icon-made',
    name: 'Made',
    defaultName: 'Made',
    iconType: 'made',
    windowKey: 'made',
    x: 16,
    y: 92,
  },
  {
    id: 'proof',
    domId: 'icon-proof',
    name: 'Proof',
    defaultName: 'Proof',
    iconType: 'proof',
    windowKey: 'resume',
    x: 16,
    y: 168,
  },
  {
    id: 'skills',
    domId: 'icon-skills',
    name: 'Skills',
    defaultName: 'Skills',
    iconType: 'skills',
    windowKey: 'skills',
    x: 16,
    y: 244,
  },
  {
    id: 'hello',
    domId: 'icon-hello',
    name: 'Hello',
    defaultName: 'Hello',
    iconType: 'hello',
    windowKey: 'hello',
    x: 16,
    y: 320,
  },
  {
    id: 'oops',
    domId: 'icon-oops',
    name: 'Oops',
    defaultName: 'Oops',
    iconType: 'oops',
    windowKey: 'recycle',
    x: 16,
    y: 396,
  },

  // Column 2 (x: 108) - Apps
  {
    id: 'ie',
    domId: 'icon-ie',
    name: 'Internet Explorer',
    defaultName: 'Internet Explorer',
    iconType: 'internetExplorer',
    windowKey: 'internetExplorer',
    x: 108,
    y: 16,
  },
  {
    id: 'paint',
    domId: 'icon-paint',
    name: 'Paint',
    defaultName: 'Paint',
    iconType: 'paint',
    windowKey: 'paint',
    x: 108,
    y: 92,
  },
  {
    id: 'notepad',
    domId: 'icon-notepad',
    name: 'Notepad',
    defaultName: 'Notepad',
    iconType: 'notepad',
    windowKey: 'notepad',
    x: 108,
    y: 168,
  },
  {
    id: 'calculator',
    domId: 'icon-calculator',
    name: 'Calculator',
    defaultName: 'Calculator',
    iconType: 'calculator',
    windowKey: 'calculator',
    x: 108,
    y: 244,
  },
  {
    id: 'mediaPlayer',
    domId: 'icon-media-player',
    name: 'Media Player',
    defaultName: 'Media Player',
    iconType: 'mediaPlayer',
    windowKey: 'mediaPlayer',
    x: 108,
    y: 320,
  },
  {
    id: 'winamp',
    domId: 'icon-winamp',
    name: 'Winamp',
    defaultName: 'Winamp',
    iconType: 'winamp',
    windowKey: 'winamp',
    x: 108,
    y: 396,
  },

  // Column 3 (x: 200) - Games
  {
    id: 'minesweeper',
    domId: 'icon-minesweeper',
    name: 'Minesweeper',
    defaultName: 'Minesweeper',
    iconType: 'minesweeper',
    windowKey: 'minesweeper',
    x: 200,
    y: 16,
  },
  {
    id: 'solitaire',
    domId: 'icon-solitaire',
    name: 'Solitaire',
    defaultName: 'Solitaire',
    iconType: 'solitaire',
    windowKey: 'solitaire',
    x: 200,
    y: 92,
  },
  {
    id: 'freecell',
    domId: 'icon-freecell',
    name: 'FreeCell',
    defaultName: 'FreeCell',
    iconType: 'freecell',
    windowKey: 'freecell',
    x: 200,
    y: 168,
  },
  {
    id: 'chess',
    domId: 'icon-chess',
    name: 'Chess',
    defaultName: 'Chess',
    iconType: 'chess',
    windowKey: 'chess',
    x: 200,
    y: 244,
  },
];

const ICON_COMPONENT_MAP = {
  myComputer: <MyComputerIcon />,
  made: <MadeIcon />,
  proof: <ProofIcon />,
  skills: <SkillsIcon />,
  hello: <HelloIcon />,
  oops: <OopsIcon />,
  internetExplorer: <InternetExplorerIcon />,
  paint: <PaintIcon />,
  notepad: <NotepadIcon />,
  calculator: <CalculatorIcon />,
  mediaPlayer: <MediaPlayerIcon />,
  winamp: <WinampIcon />,
  minesweeper: <MinesweeperIcon />,
  solitaire: <SolitaireIcon />,
  freecell: <FreeCellIcon />,
  chess: <ChessIcon />,
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
    title: 'Me.exe',
    icon: <MyComputerIcon />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 380, y: 80 },
    zIndex: 30,
  },
  made: {
    id: 'made',
    title: 'Made',
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
  onestepprint: {
    id: 'onestepprint',
    title: 'OneStepPrint website redesign - Case Study',
    icon: <FolderIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 220, y: 40 },
    zIndex: 30,
  },
  // Shell Apps
  internetExplorer: {
    id: 'internetExplorer',
    title: 'Microsoft Internet Explorer',
    icon: <InternetExplorerIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 260, y: 40 },
    zIndex: 30,
  },
  paint: {
    id: 'paint',
    title: 'untitled - Paint',
    icon: <PaintIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 280, y: 50 },
    zIndex: 30,
  },
  notepad: {
    id: 'notepad',
    title: 'Untitled - Notepad',
    icon: <NotepadIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 340, y: 80 },
    zIndex: 30,
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: <CalculatorIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 360, y: 110 },
    zIndex: 30,
  },
  mediaPlayer: {
    id: 'mediaPlayer',
    title: 'Windows Media Player',
    icon: <MediaPlayerIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 310, y: 100 },
    zIndex: 30,
  },
  winamp: {
    id: 'winamp',
    title: 'WINAMP',
    icon: <WinampIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 350, y: 70 },
    zIndex: 30,
  },
  // Games
  minesweeper: {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: <MinesweeperIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 270, y: 80 },
    zIndex: 30,
  },
  solitaire: {
    id: 'solitaire',
    title: 'Solitaire',
    icon: <SolitaireIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 290, y: 60 },
    zIndex: 30,
  },
  freecell: {
    id: 'freecell',
    title: 'FreeCell',
    icon: <FreeCellIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 310, y: 70 },
    zIndex: 30,
  },
  chess: {
    id: 'chess',
    title: 'Chess',
    icon: <ChessIconSmall />,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 330, y: 80 },
    zIndex: 30,
  },
};

export default function Windows98Theme() {
  const { playSound, unlockAudio } = useSound();

  const [biosDone, setBiosDone] = useState(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      if (search.get('skip_bios') === '1' || search.get('skip_bios') === 'true' || search.get('project')) return true;
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
  const lastWindowPosRef = useRef({ x: 180, y: 50 });
  const cascadeStep = 24;

  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const sessionSeen = sessionStorage.getItem('win98_welcome_shown');
      const localShow = localStorage.getItem('win98_show_welcome');
      if (sessionSeen === '1') return false;
      if (localShow === 'false') return false;
      return true;
    } catch {
      return true;
    }
  });

  const handleCloseWelcome = (showNextTime) => {
    setShowWelcome(false);
    try {
      sessionStorage.setItem('win98_welcome_shown', '1');
      localStorage.setItem('win98_show_welcome', showNextTime ? 'true' : 'false');
    } catch {}
  };

  // Calculate next cascading position (+24px clamped inside viewport above taskbar)
  const getNextCascadePosition = useCallback((winKey, defaultPos = { x: 180, y: 50 }) => {
    if (typeof window === 'undefined' || window.innerWidth <= 768) {
      return { x: 0, y: 0 };
    }
    const maxW = window.innerWidth;
    const maxH = window.innerHeight - 28 - 8;

    if (winKey === 'myComputer') {
      const winW = 620;
      const winH = 490;
      const x = Math.max(8, Math.floor((maxW - winW) / 2));
      const y = Math.max(8, Math.floor((maxH - winH) / 2) - 30);
      return { x, y };
    }

    const winW = winKey === 'made' ? 640 : 640;
    const winH = winKey === 'made' ? 420 : 440;

    let x = lastWindowPosRef.current.x + cascadeStep;
    let y = lastWindowPosRef.current.y + cascadeStep;

    if (x + winW > maxW - 8 || y + winH > maxH) {
      x = 80;
      y = 40;
    }

    x = Math.max(8, Math.min(x, Math.max(8, maxW - winW - 8)));
    y = Math.max(8, Math.min(y, Math.max(8, maxH - winH)));

    lastWindowPosRef.current = { x, y };
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
          nextPos = getNextCascadePosition(winKey, current.position);
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

      if (winKey === 'onestepprint') {
        try {
          window.history.pushState(null, '', '/work/onestepprint');
        } catch {}
      }
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

      if (winKey === 'onestepprint' && window.location.pathname.includes('/work/onestepprint')) {
        try {
          window.history.pushState(null, '', '/work.html');
        } catch {}
      }

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

    // Check URL parameters and deep links for direct window launch (?screen=skills, /work/onestepprint, etc.)
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    // Auto open requested window or ABOUT_ME.EXE after delay
    setTimeout(() => {
      if (path.includes('onestepprint') || hash.includes('onestepprint') || params.get('project') === 'onestepprint') {
        openWindow('onestepprint');
        return;
      }

      if (screenParam) {
        const paramMap = {
          about: 'about',
          me: 'myComputer',
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
          onestepprint: 'onestepprint',
          mycomputer: 'myComputer',
        };
        const target = paramMap[screenParam.toLowerCase()];
        if (target) {
          openWindow(target);
          return;
        }
      }
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

      // Check if user deep-linked directly to case study while BIOS was already skipped
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      if (
        path.includes('onestepprint') ||
        hash.includes('onestepprint') ||
        search.get('project') === 'onestepprint'
      ) {
        openWindow('onestepprint');
      }
    } else {
      document.body.classList.remove('desktop-mode');
      document.body.classList.add('bios-mode');
    }
  }, [biosDone, openWindow]);

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

  // Global keyboard shortcuts (Alt+F4, Escape, Delete, F2, Enter)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Alt+F4 closes the active window
      if (e.altKey && (e.key === 'F4' || e.keyCode === 115)) {
        e.preventDefault();
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (contextMenu) setContextMenu(null);
        if (isStartMenuOpen) setIsStartMenuOpen(false);
        if (renamingIconId) setRenamingIconId(null);
        if (isShutDownOpen) setIsShutDownOpen(false);
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
    <Win98AudioProvider>
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
            {/* Mobile Device Notice */}
            <div className="win98-mobile-notice">
              ℹ️ Best on desktop
            </div>
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
            onOpenHello={() => openWindow('hello')}
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
            onOpenOneStepPrint={() => openWindow('onestepprint')}
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

          {/* Window 9: ONESTEPPRINT CASE STUDY */}
          {windows.onestepprint && (
            <OneStepPrintWindow
              isOpen={windows.onestepprint.isOpen && !windows.onestepprint.isMinimized}
              isActive={activeWindowId === 'onestepprint'}
              isMaximized={windows.onestepprint.isMaximized}
              zIndex={windows.onestepprint.zIndex}
              position={windows.onestepprint.position}
              onFocus={() => focusWindow('onestepprint')}
              onMinimize={() => minimizeWindow('onestepprint')}
              onMaximize={() => toggleMaximize('onestepprint')}
              onClose={() => closeWindow('onestepprint')}
            />
          )}

          {/* Window 10: Internet Explorer */}
          {windows.internetExplorer && (
            <InternetExplorerWindow
              isOpen={windows.internetExplorer.isOpen && !windows.internetExplorer.isMinimized}
              isActive={activeWindowId === 'internetExplorer'}
              isMaximized={windows.internetExplorer.isMaximized}
              zIndex={windows.internetExplorer.zIndex}
              position={windows.internetExplorer.position}
              onFocus={() => focusWindow('internetExplorer')}
              onMinimize={() => minimizeWindow('internetExplorer')}
              onMaximize={() => toggleMaximize('internetExplorer')}
              onClose={() => closeWindow('internetExplorer')}
            />
          )}

          {/* Window 11: Paint */}
          {windows.paint && (
            <PaintWindow
              isOpen={windows.paint.isOpen && !windows.paint.isMinimized}
              isActive={activeWindowId === 'paint'}
              isMaximized={windows.paint.isMaximized}
              zIndex={windows.paint.zIndex}
              position={windows.paint.position}
              onFocus={() => focusWindow('paint')}
              onMinimize={() => minimizeWindow('paint')}
              onMaximize={() => toggleMaximize('paint')}
              onClose={() => closeWindow('paint')}
            />
          )}

          {/* Window 12: Notepad */}
          {windows.notepad && (
            <NotepadWindow
              isOpen={windows.notepad.isOpen && !windows.notepad.isMinimized}
              isActive={activeWindowId === 'notepad'}
              isMaximized={windows.notepad.isMaximized}
              zIndex={windows.notepad.zIndex}
              position={windows.notepad.position}
              onFocus={() => focusWindow('notepad')}
              onMinimize={() => minimizeWindow('notepad')}
              onMaximize={() => toggleMaximize('notepad')}
              onClose={() => closeWindow('notepad')}
            />
          )}

          {/* Window 13: Calculator */}
          {windows.calculator && (
            <CalculatorWindow
              isOpen={windows.calculator.isOpen && !windows.calculator.isMinimized}
              isActive={activeWindowId === 'calculator'}
              isMaximized={windows.calculator.isMaximized}
              zIndex={windows.calculator.zIndex}
              position={windows.calculator.position}
              onFocus={() => focusWindow('calculator')}
              onMinimize={() => minimizeWindow('calculator')}
              onMaximize={() => toggleMaximize('calculator')}
              onClose={() => closeWindow('calculator')}
            />
          )}

          {/* Window 14: Media Player */}
          {windows.mediaPlayer && (
            <MediaPlayerWindow
              isOpen={windows.mediaPlayer.isOpen && !windows.mediaPlayer.isMinimized}
              isActive={activeWindowId === 'mediaPlayer'}
              isMaximized={windows.mediaPlayer.isMaximized}
              zIndex={windows.mediaPlayer.zIndex}
              position={windows.mediaPlayer.position}
              onFocus={() => focusWindow('mediaPlayer')}
              onMinimize={() => minimizeWindow('mediaPlayer')}
              onMaximize={() => toggleMaximize('mediaPlayer')}
              onClose={() => closeWindow('mediaPlayer')}
            />
          )}

          {/* Window 15: Winamp */}
          {windows.winamp && (
            <WinampWindow
              isOpen={windows.winamp.isOpen && !windows.winamp.isMinimized}
              isActive={activeWindowId === 'winamp'}
              zIndex={windows.winamp.zIndex}
              position={windows.winamp.position}
              onFocus={() => focusWindow('winamp')}
              onMinimize={() => minimizeWindow('winamp')}
              onClose={() => closeWindow('winamp')}
            />
          )}

          {/* Window 16: Minesweeper */}
          {windows.minesweeper && (
            <MinesweeperWindow
              isOpen={windows.minesweeper.isOpen && !windows.minesweeper.isMinimized}
              isActive={activeWindowId === 'minesweeper'}
              isMaximized={windows.minesweeper.isMaximized}
              zIndex={windows.minesweeper.zIndex}
              position={windows.minesweeper.position}
              onFocus={() => focusWindow('minesweeper')}
              onMinimize={() => minimizeWindow('minesweeper')}
              onMaximize={() => toggleMaximize('minesweeper')}
              onClose={() => closeWindow('minesweeper')}
            />
          )}

          {/* Window 17: Solitaire */}
          {windows.solitaire && (
            <SolitaireWindow
              isOpen={windows.solitaire.isOpen && !windows.solitaire.isMinimized}
              isActive={activeWindowId === 'solitaire'}
              isMaximized={windows.solitaire.isMaximized}
              zIndex={windows.solitaire.zIndex}
              position={windows.solitaire.position}
              onFocus={() => focusWindow('solitaire')}
              onMinimize={() => minimizeWindow('solitaire')}
              onMaximize={() => toggleMaximize('solitaire')}
              onClose={() => closeWindow('solitaire')}
            />
          )}

          {/* Window 18: FreeCell */}
          {windows.freecell && (
            <FreeCellWindow
              isOpen={windows.freecell.isOpen && !windows.freecell.isMinimized}
              isActive={activeWindowId === 'freecell'}
              isMaximized={windows.freecell.isMaximized}
              zIndex={windows.freecell.zIndex}
              position={windows.freecell.position}
              onFocus={() => focusWindow('freecell')}
              onMinimize={() => minimizeWindow('freecell')}
              onMaximize={() => toggleMaximize('freecell')}
              onClose={() => closeWindow('freecell')}
            />
          )}

          {/* Window 19: Chess */}
          {windows.chess && (
            <ChessWindow
              isOpen={windows.chess.isOpen && !windows.chess.isMinimized}
              isActive={activeWindowId === 'chess'}
              isMaximized={windows.chess.isMaximized}
              zIndex={windows.chess.zIndex}
              position={windows.chess.position}
              onFocus={() => focusWindow('chess')}
              onMinimize={() => minimizeWindow('chess')}
              onMaximize={() => toggleMaximize('chess')}
              onClose={() => closeWindow('chess')}
            />
          )}
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
            } else if (key === 'onestepprint') {
              openWindow('onestepprint');
            } else if (key === 'recycle') {
              openWindow('recycle');
            } else if (key === 'help') {
              openWindow('hello');
            } else if (key === 'run') {
              openWindow('skills');
            } else if (key === 'internetExplorer') {
              openWindow('internetExplorer');
            } else if (key === 'paint') {
              openWindow('paint');
            } else if (key === 'notepad') {
              openWindow('notepad');
            } else if (key === 'calculator') {
              openWindow('calculator');
            } else if (key === 'mediaPlayer') {
              openWindow('mediaPlayer');
            } else if (key === 'winamp') {
              openWindow('winamp');
            } else if (key === 'minesweeper') {
              openWindow('minesweeper');
            } else if (key === 'solitaire') {
              openWindow('solitaire');
            } else if (key === 'freecell') {
              openWindow('freecell');
            } else if (key === 'chess') {
              openWindow('chess');
            }
          }}
        />

        {/* Shut Down Dialog */}
        <ShutDownDialog
          isOpen={isShutDownOpen}
          onClose={() => setIsShutDownOpen(false)}
          onRestart={handleRestartBios}
        />

        {/* Welcome Dialog */}
        <WelcomeDialog
          isOpen={biosDone && showWelcome}
          onClose={handleCloseWelcome}
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
  </Win98AudioProvider>
  );
}
