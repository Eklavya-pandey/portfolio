import React, { createContext, useContext, useState } from 'react';
import { editorialMusic } from '../themes/editorial/editorialMusic';

export const ThemeContext = createContext();

export const THEMES = {
  WINDOWS98: 'windows98',
  EDITORIAL: 'editorial',
  GAMING: 'gaming',
  DESIGNFILE: 'designfile',
  MERIDIAN: 'meridian'
};

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme && Object.values(THEMES).includes(urlTheme.toLowerCase())) {
          return urlTheme.toLowerCase();
        }
        const sessionTheme = sessionStorage.getItem('naveen_portfolio_theme');
        if (sessionTheme && Object.values(THEMES).includes(sessionTheme)) {
          return sessionTheme;
        }
        const savedTheme = localStorage.getItem('naveen_portfolio_theme');
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
          return savedTheme;
        }
      }
    } catch {
      // Fallback
    }
    return THEMES.EDITORIAL;
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const switchTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      if (newTheme !== THEMES.MERIDIAN && newTheme !== THEMES.EDITORIAL) {
        editorialMusic.pause();
      } else {
        editorialMusic.play();
      }
      setTheme(newTheme);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('naveen_portfolio_theme', newTheme);
          localStorage.setItem('naveen_portfolio_theme', newTheme);
        }
      } catch {
        // Fallback
      }
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      currentTheme: theme,
      setTheme: switchTheme,
      switchTheme,
      availableThemes: THEMES,
      THEMES
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
