import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mainApp',
      remotes: {
        musicLibrary: 'https://music-library-assignment.vercel.app/assets/remoteEntry.js',
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
});