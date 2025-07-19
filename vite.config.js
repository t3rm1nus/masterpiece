import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  ssr: {
    noExternal: ['react-helmet-async']
  },
  // Excluir archivos del build
  publicDir: 'public'
});
