import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'pixu': resolve(__dirname, '../../dist/pixu.esm.js'),
    },
  },
  server: {
    port: 3002,
    open: true,
  },
});

