import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../LanguageContext';
import MaterialThemeProvider from '../MaterialThemeProvider';
import AppContent from '../AppContent';

describe('AppContent', () => {
  test('renderiza sin errores', () => {
    render(
      <HelmetProvider>
        <LanguageProvider>
          <MaterialThemeProvider>
            <MemoryRouter>
              <AppContent />
            </MemoryRouter>
          </MaterialThemeProvider>
        </LanguageProvider>
      </HelmetProvider>
    );
  });
}); 