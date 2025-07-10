import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/ios-fixes.css'
import App from './App.jsx'
import { SplashScreen } from '@capacitor/splash-screen'
import { BrowserRouter } from 'react-router-dom';

// Forzar recarga dura al entrar (una vez por sesión) para evitar problemas de caché en móviles reales
// Usamos una estrategia más segura para evitar QuotaExceededError en iOS
if (typeof window !== 'undefined') {
  try {
    // Intentar con sessionStorage primero
    if ('sessionStorage' in window && sessionStorage) {
      if (!sessionStorage.getItem('app_hard_reloaded')) {
        sessionStorage.setItem('app_hard_reloaded', 'true')
        window.location.reload(true) // true es ignorado en navegadores modernos, pero fuerza reload desde el servidor
      }
    } else {
      // Fallback: usar una variable en memoria
      if (!window.__mp_reloaded) {
        window.__mp_reloaded = true;
        window.location.reload()
      }
    }
  } catch (e) {
    // Fallback final: recarga simple sin storage
    console.warn('Error al manejar recarga:', e);
    if (!window.__mp_reloaded) {
      window.__mp_reloaded = true;
      window.location.reload()
    }
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
    <BrowserRouter>
      <AppWithSplashHide />
    </BrowserRouter>
  </StrictMode>,
)
