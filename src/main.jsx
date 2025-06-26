import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { SplashScreen } from '@capacitor/splash-screen'

// Forzar recarga dura al entrar (una vez por sesión) para evitar problemas de caché en móviles reales
if (typeof window !== 'undefined' && 'sessionStorage' in window) {
  try {
    if (!sessionStorage.getItem('app_hard_reloaded')) {
      sessionStorage.setItem('app_hard_reloaded', 'true')
      window.location.reload(true) // true es ignorado en navegadores modernos, pero fuerza reload desde el servidor
    }
  } catch (e) {
    // Fallback: recarga sin sessionStorage
    window.location.reload()
  }
}

// Ocultar splash de Capacitor al montar la app
function AppWithSplashHide() {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return <App />
}

// Note: Splash screen handling is done natively in Android via SplashActivity
// No need for Capacitor splash screen plugin on web or hybrid builds

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithSplashHide />
  </StrictMode>,
)
