import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';

// Import authentic Windows 95/98 CSS styling
import './styles/bios.css';
import './styles/win95.css';

// Import Editorial Blueprint Boot Screen
import './themes/editorial/editorialBoot.css';
import './themes/editorial/editorialBoot.js';

// Import Editorial Subtle Animation Layer
import './themes/editorial/editorialAnim.css';
import './themes/editorial/editorialAnim.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>
);
