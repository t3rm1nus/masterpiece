import React from 'react';
import { LanguageProvider } from "./LanguageContext";
import './styles/main.css';
import MaterialThemeProvider from './components/MaterialThemeProvider';
import AppContent from './components/AppContent';
import ErrorDisplay from './components/ErrorDisplay';

function App() {
  return (
    <LanguageProvider>
      <MaterialThemeProvider>
        <div className="App" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <AppContent />
          <ErrorDisplay />
        </div>
      </MaterialThemeProvider>
    </LanguageProvider>
  );
}

export default App;
