import React from 'react';
import { LanguageProvider } from "./LanguageContext";
import './styles/main.css';
import MaterialThemeProvider from './components/MaterialThemeProvider';
import AppContent from './components/AppContent';
import ErrorDisplay from './components/ErrorDisplay';
import { StorageMonitor, useStorageErrorHandler } from './components/StorageMonitor';
interface AppProps {
  initialLang?: string;
}

const App: React.FC<AppProps> = ({ initialLang }) => {
  // Hook para manejar errores de storage globalmente
  useStorageErrorHandler();

  // Forzar scroll al top en cada carga
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Detectar si estamos en desarrollo o si hay problemas de storage
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  return (
    <LanguageProvider initialLang={initialLang}>
      <MaterialThemeProvider>
        <div className="App" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <AppContent />
          <ErrorDisplay />
          {/* Monitor de storage, especialmente útil en iOS */}
          <StorageMonitor enabled={isDevelopment || isIOS} />
        </div>
      </MaterialThemeProvider>
    </LanguageProvider>
  );
};

export default App; 