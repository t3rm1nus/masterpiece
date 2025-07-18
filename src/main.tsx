import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/ios-fixes.css'
import App from './App'
import { SplashScreen } from '@capacitor/splash-screen'
import { BrowserRouter } from 'react-router-dom';

// Función para detectar iPhone
const isIPhone = (): boolean => {
  return typeof window !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent);
};

// Aplicar fixes específicos para iPhone al inicio
const applyIPhoneFixes = (): void => {
  if (isIPhone()) {
    // Forzar propiedades de scroll en el body para iPhone
    document.body.style.overflowY = 'auto';
    (document.body.style as any).webkitOverflowScrolling = 'touch';
    
    // Forzar en html también
    document.documentElement.style.overflowY = 'auto';
    (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
    
    // Asegurar que el viewport esté configurado correctamente
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    console.log('📱 [iPhone] Aplicados fixes específicos para iPhone');
  }
};

// Forzar recarga dura al entrar (una vez por sesión) para evitar problemas de caché en móviles reales
// Usamos una estrategia más segura para evitar QuotaExceededError en iOS
/*
if (typeof window !== 'undefined') {
  try {
    // Intentar con sessionStorage primero
    if ('sessionStorage' in window && sessionStorage) {
      if (!sessionStorage.getItem('app_hard_reloaded')) {
        sessionStorage.setItem('app_hard_reloaded', 'true')
        window.location.reload() // true es ignorado en navegadores modernos, pero fuerza reload desde el servidor
      }
    } else {
      // Fallback: usar una variable en memoria
      if (!(window as any).__mp_reloaded) {
        (window as any).__mp_reloaded = true;
        window.location.reload()
      }
    }
  } catch (e) {
    // Fallback final: recarga simple sin storage
    console.warn('Error al manejar recarga:', e);
    if (!(window as any).__mp_reloaded) {
      (window as any).__mp_reloaded = true;
      window.location.reload()
    }
  }
  
  // Forzar scroll al top en cada carga para evitar que el navegador recuerde la posición
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
  
  // También deshabilitar scrollRestoration del navegador
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  
  // Aplicar fixes específicos para iPhone
  applyIPhoneFixes();
}
*/

function detectInitialLangFromUrl() {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/en/') ? 'en' : 'es';
  }
  return 'es';
}

const AppWithSplashHide: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide()
    // Aplicar fixes de iPhone también después del montaje
    if (isIPhone()) {
      const timer = setTimeout(() => {
        applyIPhoneFixes();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [])
  const initialLang = detectInitialLangFromUrl();
  return <App initialLang={initialLang} />
}

// Note: Splash screen handling is done natively in Android via SplashActivity
// No need for Capacitor splash screen plugin on web or hybrid builds

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithSplashHide />
    </BrowserRouter>
  </StrictMode>,
) 