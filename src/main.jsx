import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { SplashScreen } from '@capacitor/splash-screen'

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
