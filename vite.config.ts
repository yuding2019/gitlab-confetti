import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const isDev = process.env.NODE_ENV === 'development';

const defaultBasePath = isDev ? '/' : '/gitlab-confetti/';

const basePath = process.env.BASE_PATH;

export default defineConfig({
  base: basePath || defaultBasePath,
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
