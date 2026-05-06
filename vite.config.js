// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for GitHub Pages deployment
  // Change 'easternnova-portfolio' to your actual repo name
  base: process.env.NODE_ENV === 'production'
    ? '/easternnova-portfolio/'
    : '/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Don't inline assets — keep them as files for large PNGs
    assetsInlineLimit: 0,
  },

  server: {
    port: 3000,
    open: true,
  },
});
