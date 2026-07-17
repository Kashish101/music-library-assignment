import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'musicLibrary',
      filename: 'remoteEntry.js',
      exposes: {
        './MusicLibraryApp': './src/MusicLibraryApp.jsx',
      },
      shared: ['react', 'react-dom', '@tanstack/react-query'],
    }),
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5001,
  },
  preview: {
    port: 5001,
  },
});