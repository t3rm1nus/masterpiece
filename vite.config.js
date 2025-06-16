import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false, // Cambiar a true si necesitas HTTPS
    host: true,
    port: 5173,
    // Configuración para desarrollo con PayPal
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
  }
})
