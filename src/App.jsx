import React, { useEffect } from 'react';
import { useTheme, THEMES } from './context/ThemeContext';
import { editorialMusic } from './themes/editorial/editorialMusic';
import Windows98Theme from './themes/windows98/Windows98Theme';
import EditorialTheme from './themes/editorial/EditorialTheme';
import GamingTheme from './themes/gaming/GamingTheme';
import DesignFileTheme from './themes/designfile/DesignFileTheme';
import MeridianTheme from './themes/meridian/MeridianTheme';

export default function App() {
  const { currentTheme, theme } = useTheme();
  const activeTheme = currentTheme || theme || (THEMES && THEMES.WINDOWS98);

  useEffect(() => {
    document.body.setAttribute('data-theme', activeTheme);

    // Audio theme sync: Stop bg music when switching to themes without bg music
    if (activeTheme !== THEMES.MERIDIAN && activeTheme !== THEMES.EDITORIAL) {
      editorialMusic.pause();
    }

    // Allow scrolling on editorial/gaming/meridian themes, lock on win98 and designfile
    if (activeTheme === THEMES.WINDOWS98 || activeTheme === THEMES.DESIGNFILE) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.background = '';
    }
  }, [activeTheme]);

  switch (activeTheme) {
    case THEMES?.MERIDIAN:
      return <MeridianTheme />;
    case THEMES?.EDITORIAL:
      return <EditorialTheme />;
    case THEMES?.GAMING:
      return <GamingTheme />;
    case THEMES?.DESIGNFILE:
      return <DesignFileTheme />;
    case THEMES?.WINDOWS98:
    default:
      return <Windows98Theme />;
  }
}
