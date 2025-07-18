import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Por defecto, build de cliente. Para SSR, usar --ssr src/entry-server.tsx
    outDir: 'dist/client',
  },
  ssr: {
    noExternal: ['react-helmet-async']
  }
});
