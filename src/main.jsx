import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

// Note: Splash screen handling is done natively in Android via SplashActivity
// No need for Capacitor splash screen plugin on web or hybrid builds

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
