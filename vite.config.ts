import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Use /aim-coffee-bar/ on GitHub Pages, and ./ for local dev
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGithubPages ? '/aim-coffee-bar/' : './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
