import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    host: true,
    port: 5173,
    headers: {
      'Permissions-Policy': 'geolocation=*, camera=*, microphone=*, payment=*, accelerometer=*, gyroscope=*',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  preview: {
    headers: {
      'Permissions-Policy': 'geolocation=*, camera=*, microphone=*, payment=*, accelerometer=*, gyroscope=*',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  build: {
    // Optimización del bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors principales
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          store: ['zustand']
        }
      }
    },
    // Configuraciones adicionales de optimización
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia a 1MB
    sourcemap: false // Desactivar sourcemaps en producción para reducir tamaño
  }
})
