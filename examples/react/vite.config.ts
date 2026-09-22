import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@pantanal/pixu': resolve(__dirname, '../../dist/pixu.esm.js'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});

