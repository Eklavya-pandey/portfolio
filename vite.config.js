import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        about: resolve(__dirname, 'about.html'),
        playground: resolve(__dirname, 'playground.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  },
  server: {
    port: 5050,
    host: '127.0.0.1'
  }
});
