/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { sitemapPlugin } from './build/sitemapPlugin.ts';

export default defineConfig(({ mode }) => ({
  plugins: [react(), sitemapPlugin(loadEnv(mode, process.cwd()).VITE_SITE_URL || 'https://www.crestwood.edu.in')],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          // Recharts is left to automatic splitting so it only loads with the Placements route.
          if (id.includes('framer-motion') || id.includes('motion-')) return 'motion';
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'forms';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}));
