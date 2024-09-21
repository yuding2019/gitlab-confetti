import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  base: isDev ? '/' : '/gitlab-confetti/',
  root: 'web',
  build: {
    outDir: 'out',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname),
    },
  },
  plugins: [react()],
});
